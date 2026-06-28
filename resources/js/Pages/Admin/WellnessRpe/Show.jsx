import React, { useState, useEffect } from "react";

import { Head, Link, router, useRemember, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    ArrowLeft,
    Save,
    Activity,
    LayoutGrid,
    LineChart,
    Users,
    Search,
    Plus,
    X,
    Download,
    FileSpreadsheet,
} from "lucide-react";
import axios from "axios";

import WellnessTableHeader from "./Partials/WellnessTableHeader";
import WellnessAthleteRow from "./Partials/WellnessAthleteRow";
import AnalysisTab from "./Partials/AnalysisTab";
import Modal from "@/Components/Modal";
import ExportModal from "@/Components/Partials/ExportModal";
import BodyHighlighter from "@/Components/BodyHighlighter";
import { submitDownloadForm } from '@/utils/submitDownloadForm';

const posOrder = { CB: 1, FB: 2, MF: 3, WF: 4, FW: 5, GK: 0 };
const getPosOrder = (pos) => posOrder[pos?.toUpperCase()] ?? 99;

const sortAthletes = (arr) => {
    return [...arr].sort((a, b) => {
        if (a.sort_order !== 999 || b.sort_order !== 999) {
            return a.sort_order - b.sort_order;
        }

        if (getPosOrder(a.position) !== getPosOrder(b.position)) {
            return getPosOrder(a.position) - getPosOrder(b.position);
        }
        return a.name.localeCompare(b.name);
    });
};

export default function WellnessRpeShow({
    auth,
    selectedDate,
    formattedDate,
    athletes,
    redirectTo,
}) {
    
    // MENGGUNAKAN userRemember AGAR STATE TERSIMPAN SAAT REFRESH / PINDAH TAB
    const [activeTab, setActiveTab] = useRemember(
        "input",
        `WellnessShow_Tab_${selectedDate}`,
    );
    const [selectedAnalysisAthleteId, setSelectedAnalysisAthleteId] = useRemember(
        "",
        `WellnessShow_Athlete_${selectedDate}`,
    );

    const { permissions } = usePage().props;
    const canModify = true;

    const [weeklyData, setWeeklyData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [availableAthletes, setAvailableAthletes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [tableData, setTableData] = useState([]);
    const [draggedAthleteId, setDraggedAthleteId] = useState(null);
    const [painModalAthlete, setPainModalAthlete] = useState(null);

    const [exportModal, setExportModal] = useState({ isOpen: false, type: 'pdf' });
    const [exportOptions, setExportOptions] = useState({ wellness: true, pain: true, rpe: true });

    const PASTE_COLUMNS = [
        "quality_of_sleep",
        "fatigue",
        "muscle_soreness",
        "stress",
        "am_rpe",
        "am_duration",
        "pm_rpe",
        "pm_duration",
    ];

    const fetchWeeklyData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                route("admin.wellness-rpe.weekly-data"),
                { date: selectedDate },
            );
            setWeeklyData(response.data);

            const withData = [];
            const withoutData = [];

            athletes.forEach((athlete) => {
                const athleteWeekly = response.data.data.find(
                    (p) => p.user_id === athlete.id,
                );
                const todayLog = athleteWeekly?.logs?.[selectedDate] || {};

                const savedDailyWellness = todayLog.daily_wellness_score || 0;
                const baseWeeklyWellness =
                    (athleteWeekly?.weekly_wellness_score || 0) -
                    savedDailyWellness;

                const mapped = {
                    ...athlete,
                    baseWeeklyWellness,
                    sort_order: todayLog.sort_order ?? 999,
                    metrics: {
                        quality_of_sleep: todayLog.quality_of_sleep ?? "",
                        fatigue: todayLog.fatigue ?? "",
                        muscle_soreness: todayLog.muscle_soreness ?? "",
                        stress: todayLog.stress ?? "",
                        motivation: todayLog.motivation ?? "",
                        health: todayLog.health ?? "",
                        mood_state: todayLog.mood_state ?? "",
                        attitude_to_study: todayLog.attitude_to_study ?? "",
                        am_rpe: todayLog.am_rpe ?? "",
                        am_duration: todayLog.am_duration ?? "",
                        pm_rpe: todayLog.pm_rpe ?? "",
                        pm_duration: todayLog.pm_duration ?? "",
                        notes: todayLog.notes ?? "",
                        muscle_pain_areas: todayLog.muscle_pain_areas ?? [],
                    },
                };

                const hasLogRecord = !!athleteWeekly?.logs?.[selectedDate];
                if (hasLogRecord) {
                    withData.push(mapped);
                } else {
                    withoutData.push(mapped);
                }
            });

            setTableData(sortAthletes(withData));
            setAvailableAthletes(sortAthletes(withoutData));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWeeklyData();
    }, []);

    const addAthlete = (athlete) => {
        setAvailableAthletes((prev) => prev.filter((p) => p.id !== athlete.id));
        setTableData((prev) => sortAthletes([...prev, athlete]));
    };

    const addAllAthletes = () => {
        const combined = [...tableData, ...availableAthletes];
        setTableData(sortAthletes(combined));
        setAvailableAthletes([]);
    };

    const removeAthlete = (athlete) => {
        setTableData((prev) => prev.filter((p) => p.id !== athlete.id));
        setAvailableAthletes((prev) =>
            sortAthletes([...prev, { ...athlete, metrics: {} }]),
        );
    };

    const handleDragStart = (e, id) => {
        setDraggedAthleteId(id);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", id);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, targetId) => {
        e.preventDefault();
        if (draggedAthleteId === targetId || !draggedAthleteId) return;

        const newTable = [...tableData];
        const draggedIdx = newTable.findIndex((p) => p.id === draggedAthleteId);
        const targetIdx = newTable.findIndex((p) => p.id === targetId);

        const [draggedItem] = newTable.splice(draggedIdx, 1);
        newTable.splice(targetIdx, 0, draggedItem);

        setTableData(newTable);
        setDraggedAthleteId(null);
    };

    const handleWellnessChange = (userId, colId, value) => {
        if (value !== "" && !/^[1-9]$/.test(value)) return;
        setTableData((prev) =>
            prev.map((p) =>
                p.id === userId
                    ? { ...p, metrics: { ...p.metrics, [colId]: value } }
                    : p,
            ),
        );
    };

    const handleNumericChange = (userId, colId, value) => {
        if (value !== "" && !/^\d*\.?\d*$/.test(value)) return;
        setTableData((prev) =>
            prev.map((p) =>
                p.id === userId
                    ? { ...p, metrics: { ...p.metrics, [colId]: value } }
                    : p,
            ),
        );
    };

    const handleTextChange = (userId, colId, value) => {
        setTableData((prev) =>
            prev.map((p) =>
                p.id === userId
                    ? { ...p, metrics: { ...p.metrics, [colId]: value } }
                    : p,
            ),
        );
    };

    const fillColumn = (colId, value) => {
        if (!confirm(`Apply value "${value}" to all athletes in this table?`))
            return;
        setTableData((prev) =>
            prev.map((p) => ({
                ...p,
                metrics: { ...p.metrics, [colId]: value },
            })),
        );
    };

    const handleLocalPaste = (e, visibleIndex, startColId) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text");
        if (!pasteData) return;

        const rows = pasteData.split(/\r?\n/).map((r) => r.split("\t"));
        const startColIdx = PASTE_COLUMNS.indexOf(startColId);
        if (startColIdx === -1) return;

        let newData = [...tableData];
        rows.forEach((row, i) => {
            if (row.length === 1 && row[0] === "") return;
            const targetAthleteIdx = visibleIndex + i;
            if (newData[targetAthleteIdx]) {
                row.forEach((val, j) => {
                    const targetColIdx = startColIdx + j;
                    if (targetColIdx < PASTE_COLUMNS.length) {
                        const targetColId = PASTE_COLUMNS[targetColIdx];
                        let cleanVal = val.replace(",", ".").trim();
                        if (targetColIdx <= 3) {
                            if (cleanVal !== "" && parseInt(cleanVal) > 7)
                                cleanVal = "7";
                            if (cleanVal !== "" && parseInt(cleanVal) < 1)
                                cleanVal = "1";
                        }
                        newData[targetAthleteIdx].metrics[targetColId] =
                            cleanVal;
                    }
                });
            }
        });
        setTableData(newData);
    };

    const clearColumn = (colId, colName) => {
        if (!confirm(`Clear all data in column ${colName}?`)) return;
        setTableData((prev) =>
            prev.map((p) => ({ ...p, metrics: { ...p.metrics, [colId]: "" } })),
        );
    };

    const actions = {
        handleWellnessChange,
        handleNumericChange,
        handleTextChange,
        fillColumn,
        handleLocalPaste,
        clearColumn,
        removeAthlete,
        handleDragStart,
        handleDragOver,
        handleDrop,
        openPainModal: (athlete) => setPainModalAthlete(athlete),
    };

    const handleSave = () => {
        setIsSaving(true);
        router.post(
            route("admin.wellness-rpe.store"),
            {
                record_date: selectedDate,
                data: tableData.map((athlete) => ({
                    user_id: athlete.id,
                    metrics: athlete.metrics,
                })),
                redirect_to: redirectTo,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSaving(false);
                    fetchWeeklyData();
                },
                onError: (errors) => {
                    console.error(errors);
                    setIsSaving(false);
                    alert("Failed to save data. Check console log.");
                },
                onFinish: () => setIsSaving(false),
            },
        );
    };

    return (
        <AppLayout
            user={auth.user}
            headerTitle="Wellness & RPE Detail"
            headerDescription="Log athlete metrics or monitor weekly reports."
        >
            <Head title={`RPE - ${formattedDate}`} />

            <div className="w-full pb-20 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("admin.wellness-rpe.index")}
                            className="p-2 border border-slate-200  bg-white  rounded-lg hover:bg-slate-50  transition-colors"
                        >
                            <ArrowLeft
                                size={16}
                                className="text-slate-600 "
                            />
                        </Link>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 ">
                                {formattedDate}
                            </h2>
                            <p className="text-xs text-slate-500 font-medium">
                                {weeklyData ? `Weekly Report: ${weeklyData.start_of_week} to ${weeklyData.end_of_week}` : ""}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => setExportModal({ isOpen: true, type: 'pdf' })} type="button" className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all bg-white  text-slate-700  hover:bg-slate-50  border border-slate-200  shadow-sm">
                                <Download size={14} strokeWidth={2.5} /> "PDF"
                            </button>
                            <button onClick={() => setExportModal({ isOpen: true, type: 'excel' })} type="button" className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all bg-white  text-emerald-700  hover:bg-emerald-50  border border-slate-200  shadow-sm">
                                <FileSpreadsheet size={14} strokeWidth={2.5} /> "Excel"
                            </button>
                        </div>

                        <div className="flex p-1 bg-slate-100  border border-slate-200  rounded-lg shrink-0">
                            {canModify && (
                                <button
                                    onClick={() => setActiveTab("input")}
                                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === "input" ? "bg-white  shadow-sm text-slate-900 " : "text-slate-500 hover:text-slate-700 "}`}
                                >
                                    <LayoutGrid size={14} /> "Input Data"
                                </button>
                            )}
                            <button
                                onClick={() => setActiveTab("analysis")}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${!canModify || activeTab === "analysis" ? "bg-white  shadow-sm text-slate-900 " : "text-slate-500 hover:text-slate-700 "}`}
                            >
                                <LineChart size={14} /> "Analysis Data"
                            </button>
                        </div>
                    </div>
                </div>

                {!canModify || activeTab === "analysis" ? (
                    <AnalysisTab
                        weeklyData={weeklyData}
                        athletes={athletes}
                        selectedAthleteId={selectedAnalysisAthleteId}
                        onSelectAthlete={setSelectedAnalysisAthleteId}
                    />
                ) : (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="bg-white  border border-slate-200  rounded-xl p-4 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900  capitalize tracking-tight flex items-center gap-2">
                                        <Users size={16} className="text-slate-500 " /> "Unrecorded Athletes List"
                                    </h3>
                                    <p className="text-[11px] font-semibold text-slate-500  mt-0.5">"Click a athlete to add them to today's RPE & Wellness tracking table."</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <input
                                            type="text"
                                            placeholder="Search athlete..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-8 pr-3 py-1 h-8 rounded-lg border-slate-200 text-xs w-[180px] focus:ring-slate-900 focus:border-slate-900"
                                        />
                                    </div>
                                    {availableAthletes.length > 0 && (
                                        <>
                                            <button
                                                onClick={addAllAthletes}
                                                className="px-2.5 py-1 bg-[#ff4d00] text-white hover:bg-[#e64500] rounded border border-transparent text-[11px] font-bold transition-all shadow-lg shadow-[#ff4d00]/20 outline-none capitalize flex items-center gap-1.5"
                                            >
                                                <Plus size={12} strokeWidth={3} />
                                                "Add All"
                                            </button>
                                            <div className="text-[10px] font-bold text-slate-500  bg-slate-100  px-2 py-1 rounded border border-slate-200  capitalize shadow-sm">
                                                {availableAthletes.length} "Unrated"
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            {availableAthletes.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 p-1">
                                    {availableAthletes.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => addAthlete(p)}
                                            type="button"
                                            className="flex items-center justify-between px-3 h-9 bg-white  border border-slate-200  hover:border-slate-900  hover:bg-slate-100  rounded-lg text-[11px] font-bold transition-all group shadow-sm overflow-hidden"
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <span className="text-[10px] font-black text-slate-400  group-hover:text-slate-900  shrink-0">{p.position}</span>
                                                <span className="text-slate-700  group-hover:text-slate-900  truncate">
                                                    {p.name}
                                                </span>
                                            </div>
                                            <Plus size={12} className="text-slate-400  group-hover:text-slate-900  shrink-0 ml-1 transition-colors" strokeWidth={3} />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-3 text-[11px] font-bold text-slate-500  border border-dashed border-slate-300  bg-slate-50  rounded-lg">
                                    "All athletes have been added to the table."
                                </div>
                            )}
                        </div>

                        <div className="bg-white  border border-slate-200  rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto relative [&::-webkit-scrollbar]:h-2">
                                <table className="w-max min-w-full text-left whitespace-nowrap text-[10px] border-separate border-spacing-0 tabular-nums">
                                    <WellnessTableHeader actions={actions} />
                                    <tbody className="[&>tr>td]:border-b [&>tr>td]:border-slate-100 ">
                                        {isLoading ? (
                                            <tr>
                                                <td
                                                    colSpan="100%"
                                                    className="p-10 text-center text-slate-500 font-medium"
                                                >
                                                    "Loading table..."
                                                </td>
                                            </tr>
                                        ) : tableData.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="100%"
                                                    className="p-10 text-center text-slate-500 font-medium"
                                                >
                                                    "No athletes in the table. Please select from the list above."
                                                </td>
                                            </tr>
                                        ) : (
                                            tableData.map((athlete, idx) => (
                                                <WellnessAthleteRow
                                                    key={athlete.id}
                                                    athlete={athlete}
                                                    visibleIdx={idx}
                                                    actions={actions}
                                                />
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4 border-t border-slate-200  flex justify-end bg-slate-50 ">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || isLoading}
                                    className="flex items-center gap-2 bg-[#ff4d00] hover:bg-[#e64500] text-white px-6 py-2.5 rounded-lg text-xs font-bold shadow-lg shadow-[#ff4d00]/20 transition-all"
                                >
                                    {isSaving ? (
                                        <Activity
                                            className="animate-spin"
                                            size={14}
                                        />
                                    ) : (
                                        <Save size={14} />
                                    )}
                                    "Save Today's Data"
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Modal show={!!painModalAthlete} onClose={() => setPainModalAthlete(null)} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-black text-slate-900  leading-tight">
                                "Reported Pain Areas"
                            </h3>
                            <p className="text-xs font-bold text-slate-500 mt-1">
                                {painModalAthlete?.name} • {formattedDate}
                            </p>
                        </div>
                        <button onClick={() => setPainModalAthlete(null)} className="p-2 bg-slate-100  hover:bg-slate-200  text-slate-500 rounded-full transition-colors">
                            <X size={16} strokeWidth={2.5} />
                        </button>
                    </div>

                    <div className="bg-slate-50  rounded-xl border border-slate-200  p-4 flex items-center justify-center gap-6 min-h-[350px]">
                        {painModalAthlete && (
                            <>
                                <div className="w-full h-full max-w-[160px] flex flex-col items-center">
                                    <span className="text-[10px] font-bold text-slate-400 mb-2">"FRONT"</span>
                                    <BodyHighlighter 
                                        type="anterior" 
                                        selectedAreas={painModalAthlete.metrics?.muscle_pain_areas || []} 
                                    />
                                </div>
                                <div className="w-full h-full max-w-[160px] flex flex-col items-center">
                                    <span className="text-[10px] font-bold text-slate-400 mb-2">"BACK"</span>
                                    <BodyHighlighter 
                                        type="posterior" 
                                        selectedAreas={painModalAthlete.metrics?.muscle_pain_areas || []} 
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    
                    {painModalAthlete?.metrics?.muscle_pain_areas?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {painModalAthlete.metrics.muscle_pain_areas.map((area, i) => (
                                <span key={i} className="px-2 py-1 bg-red-100  text-red-600  text-[11px] font-bold rounded capitalize">
                                    {area}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </Modal>

            <ExportModal 
                isOpen={exportModal.isOpen} 
                onClose={() => setExportModal(prev => ({ ...prev, isOpen: false }))} 
                onExport={(filename, reportTitle, note) => {
                    const finalFilename = filename.trim() || (exportModal.type === 'pdf' ? `Wellness_RPE_Daily_${selectedDate}` : `Wellness_RPE_Recap_${selectedDate}`);
                    const routeName = exportModal.type === 'pdf' ? 'wellness-rpe.export-pdf-daily' : 'wellness-rpe.export-excel';
                    
                    submitDownloadForm(route(routeName, selectedDate), {
                        _token: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                        filename: finalFilename,
                        title: reportTitle,
                        note: note,
                        include_wellness: exportOptions.wellness,
                        include_pain: exportOptions.pain,
                        include_rpe: exportOptions.rpe
                    });
                    
                    setExportModal(prev => ({ ...prev, isOpen: false }));
                }}
                isExporting={false}
                defaultTitle="Daily Wellness & RPE Report"
                defaultFilename={exportModal.type === 'pdf' ? `Wellness_RPE_Daily_${selectedDate}` : `Wellness_RPE_Recap_${selectedDate}`}
                exportType={exportModal.type} 
                showNotesToggle={false}
            >
                {exportModal.type === 'excel' && (
                    <div className="space-y-4 bg-slate-50  p-4 rounded-xl border border-slate-200  mt-2">
                        <p className="text-sm font-semibold text-slate-900  mb-3">"Select metrics to include:"</p>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" checked={exportOptions.wellness} onChange={e => setExportOptions(prev => ({...prev, wellness: e.target.checked}))} className="w-4 h-4 rounded border-slate-300  text-slate-900  focus:ring-slate-900" />
                            <span className="text-sm font-medium text-slate-700  group-hover:text-slate-900  transition-colors">"Wellness Metrics"</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" checked={exportOptions.pain} onChange={e => setExportOptions(prev => ({...prev, pain: e.target.checked}))} className="w-4 h-4 rounded border-slate-300  text-slate-900  focus:ring-slate-900" />
                            <span className="text-sm font-medium text-slate-700  group-hover:text-slate-900  transition-colors">"Pain Areas"</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" checked={exportOptions.rpe} onChange={e => setExportOptions(prev => ({...prev, rpe: e.target.checked}))} className="w-4 h-4 rounded border-slate-300  text-slate-900  focus:ring-slate-900" />
                            <span className="text-sm font-medium text-slate-700  group-hover:text-slate-900  transition-colors">"RPE & Load"</span>
                        </label>
                        {(!exportOptions.wellness && !exportOptions.pain && !exportOptions.rpe) && (
                            <p className="text-xs text-red-500 font-medium mt-2">"Please select at least one metric to export."</p>
                        )}
                    </div>
                )}
            </ExportModal>
        </AppLayout>
    );
}
