import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Common/PageHeader';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ChevronLeft, 
    ChevronRight, 
    Plus, 
    Trash2, 
    User, 
    Activity,
    Edit2, 
    MapPin,
    Dumbbell, 
    CheckCircle2, 
    Clock, 
    Timer, 
    X, 
    Copy, 
    Download, 
    Users, 
    UsersRound,
    List,
    ShieldCheck,
    Package,
    Calendar as CalendarIcon,
    Search,
    Check,
    CheckSquare,
    Square,
    UserCheck,
    Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { pdf } from '@react-pdf/renderer';
import AthleteSessionReportPdfDocument, { prepareTrainingsWithCompressedImages } from '@/Components/Pdf/AthleteSessionReportPdfDocument';

function getInitials(name) {
    if (!name) return "AT";
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

function getSessionPhasesSummary(session, targetAthleteId = null) {
    if (!session || !session.blocks || !Array.isArray(session.blocks)) {
        return null;
    }

    let hasStrength = false;
    let strengthVolume = 0;
    let hasCardioInterval = false;
    let cardioDistance = 0;

    const rpeRecords = session.rpeRecords || session.rpe_records || [];
    const rpeMap = {};
    if (Array.isArray(rpeRecords)) {
        rpeRecords.forEach((r) => {
            if (r.training_block_item_id && r.rpe_data) {
                if (!targetAthleteId || Number(r.athlete_id) === Number(targetAthleteId)) {
                    rpeMap[r.training_block_item_id] = r.rpe_data;
                }
            }
        });
    }

    // Filter blocks if target athlete is given (e.g. In multi-program group training)
    let blocksToCalculate = session.blocks;
    if (targetAthleteId) {
        const targetId = Number(targetAthleteId);
        const hasAssignedBlocks = session.blocks.some((b) => {
            const ids = b.program_athlete_ids || b.athlete_ids;
            return Array.isArray(ids) && ids.map(Number).includes(targetId);
        });

        if (hasAssignedBlocks) {
            blocksToCalculate = session.blocks.filter((b) => {
                const ids = b.program_athlete_ids || b.athlete_ids;
                return Array.isArray(ids) && ids.map(Number).includes(targetId);
            });
        }
    }

    blocksToCalculate.forEach((block) => {
        const cat = block.category;
        const isStrength = cat === 'strength_training' || cat === 'free_strength';
        const isCardioInterval = cat === 'interval' || cat === 'cardio';

        if (isStrength) hasStrength = true;
        if (isCardioInterval) hasCardioInterval = true;

        if (block.items && Array.isArray(block.items)) {
            block.items.forEach((item) => {
                const actual = rpeMap[item.id] || {};

                if (isStrength) {
                    const loads = (actual.load_array && actual.load_array.length > 0) ? actual.load_array : (item.load_array || []);
                    const reps = (actual.reps_array && actual.reps_array.length > 0) ? actual.reps_array : (item.reps_array || []);

                    if (Array.isArray(loads) && Array.isArray(reps) && (loads.length > 0 || reps.length > 0)) {
                        const count = Math.max(loads.length, reps.length);
                        for (let i = 0; i < count; i++) {
                            const l = parseFloat(loads[i]) || 0;
                            const r = parseFloat(reps[i]) || 0;
                            strengthVolume += l * r;
                        }
                    } else {
                        const s = parseFloat(item.sets) || 0;
                        const r = parseFloat(item.reps) || 0;
                        const l = parseFloat(item.load) || 0;
                        if (s > 0 && r > 0 && l > 0) {
                            strengthVolume += s * r * l;
                        }
                    }
                }

                if (isCardioInterval) {
                    const distances = (actual.distance_array && actual.distance_array.length > 0) ? actual.distance_array : (item.distance_array || []);
                    if (Array.isArray(distances) && distances.length > 0) {
                        distances.forEach((d) => {
                            cardioDistance += parseFloat(d) || 0;
                        });
                    } else if (item.distance) {
                        cardioDistance += parseFloat(item.distance) || 0;
                    }
                }
            });
        }
    });

    if (!hasStrength && !hasCardioInterval) return null;

    return {
        hasStrength,
        strengthVolume: Math.round(strengthVolume),
        hasCardioInterval,
        cardioDistance: Math.round(cardioDistance),
        totalLoad: Math.round(strengthVolume + cardioDistance),
    };
}

export default function ShowAthlete({ auth, athlete, trainings = [], groupTrainings = [], allAthletes = [], sharedPackages = [] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [sessionFilter, setSessionFilter] = useState('all'); // 'all', 'individual', 'group'
    const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
    const [sessionToDuplicate, setSessionToDuplicate] = useState(null);
    const [duplicateDate, setDuplicateDate] = useState('');
    const [selectedTargetUserIds, setSelectedTargetUserIds] = useState([]);
    const [clientSearch, setClientSearch] = useState('');
    const [isDuplicating, setIsDuplicating] = useState(false);
    const [isExportingPdf, setIsExportingPdf] = useState(false);

    const handleDownloadPdf = async () => {
        if (isExportingPdf) return;
        setIsExportingPdf(true);
        try {
            const optimizedTrainings = await prepareTrainingsWithCompressedImages(trainings);
            const doc = (
                <AthleteSessionReportPdfDocument
                    athlete={athlete}
                    trainings={optimizedTrainings}
                />
            );
            const blob = await pdf(doc).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            const cleanName = (athlete?.name || "Athlete").replace(/[^A-Za-z0-9_\-]/g, "_");
            link.download = `Laporan_Sesi_${cleanName}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to generate PDF:", err);
            Swal.fire({
                icon: "error",
                title: "Gagal Generate PDF",
                text: "Terjadi kesalahan saat memproses laporan PDF sesi.",
                confirmButtonColor: "#ea580c",
            });
        } finally {
            setIsExportingPdf(false);
        }
    };

    const isAthlete = auth?.user?.role === 'athlete';

    const filteredAthletes = useMemo(() => {
        if (!allAthletes || allAthletes.length === 0) return [];
        if (!clientSearch) return allAthletes;
        const q = clientSearch.toLowerCase();
        return allAthletes.filter(a => 
            a.name?.toLowerCase().includes(q) || 
            a.sport?.name?.toLowerCase().includes(q)
        );
    }, [allAthletes, clientSearch]);

    const toggleTargetUser = (userId) => {
        setSelectedTargetUserIds(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            } else {
                return [...prev, userId];
            }
        });
    };

    const selectOnlyCurrentAthlete = () => {
        setSelectedTargetUserIds([athlete.id]);
    };

    const selectAllAthletes = () => {
        setSelectedTargetUserIds(allAthletes.map(a => a.id));
    };

    const deselectAllAthletes = () => {
        setSelectedTargetUserIds([]);
    };

    const deleteSession = (e, sessionId) => {
        e.preventDefault();
        e.stopPropagation();
        
        Swal.fire({
            title: "Hapus Sesi Latihan?",
            text: "Data sesi latihan ini akan dihapus secara permanen.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
            customClass: {
                popup: "rounded-md",
                confirmButton: "rounded-md",
                cancelButton: "rounded-md",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.individual-trainings.session.destroy', sessionId), { preserveScroll: true });
            }
        });
    };

    const getLocalDateStr = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const todayStr = getLocalDateStr(new Date());

    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const days = [];
        const firstDayOfWeek = firstDay.getDay(); 
        
        // Prev month padding
        for (let i = firstDayOfWeek; i > 0; i--) {
            const d = new Date(year, month, 1 - i);
            days.push({ date: d, isCurrentMonth: false, dateStr: getLocalDateStr(d) });
        }
        
        // Current month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const d = new Date(year, month, i);
            days.push({ date: d, isCurrentMonth: true, dateStr: getLocalDateStr(d) });
        }
        
        // Next month padding to fill exactly 42 slots (6 weeks)
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            const d = new Date(year, month + 1, i);
            days.push({ date: d, isCurrentMonth: false, dateStr: getLocalDateStr(d) });
        }
        
        // Attach sessions
        return days.map(day => {
            const indTrainings = trainings.filter(t => (t.date || '').substring(0, 10) === day.dateStr).map(t => ({...t, type: 'individual'}));
            const grpTrainings = (groupTrainings || []).filter(t => (t.date || '').substring(0, 10) === day.dateStr).map(t => ({...t, type: 'group'}));
            
            let allSessions = [...indTrainings, ...grpTrainings];
            if (sessionFilter === 'individual') {
                allSessions = indTrainings;
            } else if (sessionFilter === 'group') {
                allSessions = grpTrainings;
            }
            
            return {
                ...day,
                sessions: allSessions.sort((a, b) => (a.session_number || 0) - (b.session_number || 0)),
                isToday: day.dateStr === todayStr
            };
        });
    }, [currentDate, trainings, groupTrainings, todayStr, sessionFilter]);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
    
    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    const totalSessionsCount = (trainings.length || 0) + (groupTrainings.length || 0);
    const completedSessionsCount = useMemo(() => {
        const indDone = trainings.filter(t => t.status === 'completed' || t.is_completed).length;
        const grpDone = (groupTrainings || []).filter(t => {
            if (t.status === 'completed' || t.is_completed) return true;
            if (t.members_pivot?.length > 0 && t.members_pivot[0].is_completed) return true;
            return false;
        }).length;
        return indDone + grpDone;
    }, [trainings, groupTrainings]);

    const maxSession = useMemo(() => {
        if (!trainings || trainings.length === 0) return 0;
        return Math.max(...trainings.map(t => t.session_number || 0));
    }, [trainings]);

    const expDate = athlete.training_exp_date 
        ? new Date(athlete.training_exp_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        : null;

    const photo = athlete.photo_url || (athlete.profile_photo ? `/storage/${athlete.profile_photo}` : null);

    // Back URL logic
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const fromParam = urlParams.get('from');

    let backUrl = route("admin.individual-trainings.index");
    let backLabel = "Kembali ke Program Latihan";

    if (fromParam === 'profiling') {
        backUrl = route("admin.athletes.show", athlete.id);
        backLabel = "Kembali ke Profiling";
    }

    return (
        <AppLayout 
            title={`Program Latihan - ${athlete.name}`}
            description="Jadwal program latihan individual & grup atlet."
        >
            <Head title={`Program Latihan - ${athlete.name}`} />
            
            <div className="space-y-4 pb-12">
                {/* ─── BREADCRUMB & HEADER ─── */}
                <div className="space-y-1">
                    {!isAthlete && (
                        <Link
                            href={backUrl}
                            className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors gap-1.5"
                        >
                            <ChevronLeft size={13} /> {backLabel}
                        </Link>
                    )}

                    <PageHeader 
                        title="Program Latihan"
                        description="Kelola dan pantau seluruh jadwal sesi program latihan atlet dalam tampilan kalender interaktif."
                        actions={
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleDownloadPdf}
                                    disabled={isExportingPdf}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-xs font-semibold transition-all shadow-2xs hover:shadow-xs disabled:opacity-50 cursor-pointer"
                                >
                                    {isExportingPdf ? (
                                        <Loader2 size={13} className="text-orange-500 animate-spin" />
                                    ) : (
                                        <Download size={13} className="text-orange-500" />
                                    )}
                                    <span>{isExportingPdf ? "Memproses PDF..." : "Download Laporan Sesi"}</span>
                                </button>
                            </div>
                        }
                    />
                </div>

                {/* ─── ATHLETE PROFILE HERO CARD ─── */}
                <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden hover:border-slate-300 transition-all">
                    {/* Hero Banner Strip */}
                    <div className="relative h-16 sm:h-20 bg-gradient-to-r from-white via-orange-50/30 to-amber-50/40 border-b border-slate-100 p-3.5 flex justify-end items-start overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
                        <span className="relative z-10 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-slate-200/90 text-slate-700 text-[10.5px] font-bold px-2.5 py-0.5 rounded-md shadow-2xs">
                            <ShieldCheck size={12} className="text-orange-500" />
                            <span>
                                {athlete.sport?.name || "Member Atlet"}
                            </span>
                        </span>
                    </div>

                    {/* Athlete Details */}
                    <div className="px-4 pb-3.5 pt-2 sm:pt-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="relative -mt-8 sm:-mt-10 w-14 h-14 sm:w-16 sm:h-16 rounded-md border-[2.5px] border-white shadow-xs overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 font-bold text-lg flex items-center justify-center shrink-0 z-10">
                                    {photo ? (
                                        <img
                                            src={photo}
                                            alt={athlete.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span>{getInitials(athlete.name)}</span>
                                    )}
                                </div>

                                <div className="space-y-0.5 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                                            {athlete.name}
                                        </h2>
                                        {athlete.username && (
                                            <span className="text-[10.5px] text-slate-400 font-medium">
                                                @{athlete.username}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
                                        {athlete.package ? (
                                            <span className="text-orange-700 font-semibold flex items-center gap-1">
                                                <Package size={11} className="text-orange-500" />
                                                {athlete.package.name} ({athlete.package.package_type === 'per_session' ? 'Per Pertemuan' : `${maxSession}/${athlete.package.session_count || '∞'} Sesi`})
                                            </span>
                                        ) : (sharedPackages && sharedPackages.length > 0) ? (
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                {sharedPackages.map((sp) => (
                                                    <Link
                                                        key={sp.id}
                                                        href={route('admin.shared-packages.show', sp.id) + '?from=athlete&athlete_id=' + athlete.id}
                                                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer"
                                                    >
                                                        <UsersRound size={11} className="text-orange-600" />
                                                        <span>Paket Bersama: {sp.name} ({sp.used_sessions ?? (sp.trainings ? sp.trainings.filter(t => !t.is_athlete_paid && !t.is_extra).length : 0)}/{sp.total_sessions || sp.package?.session_count || '∞'} Sesi)</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (athlete.shared_packages && athlete.shared_packages.length > 0) ? (
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                {athlete.shared_packages.map((sp) => (
                                                    <Link
                                                        key={sp.id}
                                                        href={route('admin.shared-packages.show', sp.id) + '?from=athlete&athlete_id=' + athlete.id}
                                                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer"
                                                    >
                                                        <UsersRound size={11} className="text-orange-600" />
                                                        <span>Paket Bersama: {sp.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (athlete.sharedPackages && athlete.sharedPackages.length > 0) ? (
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                {athlete.sharedPackages.map((sp) => (
                                                    <Link
                                                        key={sp.id}
                                                        href={route('admin.shared-packages.show', sp.id) + '?from=athlete&athlete_id=' + athlete.id}
                                                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer"
                                                    >
                                                        <UsersRound size={11} className="text-orange-600" />
                                                        <span>Paket Bersama: {sp.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-slate-400">Tidak Ada Paket</span>
                                        )}
                                        {expDate && (
                                            <span className="text-[11px] text-slate-400">
                                                • Aktif s/d {expDate}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Summary Metrics */}
                            <div className="flex items-center gap-4 self-end sm:self-auto shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                                <div className="text-right">
                                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">
                                        Total Jadwal
                                    </span>
                                    <span className="text-xs font-bold text-slate-900">
                                        {totalSessionsCount} <span className="text-[10px] text-slate-400 font-normal">sesi</span>
                                    </span>
                                </div>
                                <div className="w-px h-6 bg-slate-100" />
                                <div className="text-right">
                                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">
                                        Selesai
                                    </span>
                                    <span className="text-xs font-bold text-emerald-600">
                                        {completedSessionsCount} <span className="text-[10px] text-slate-400 font-normal">sesi</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── MAIN CALENDAR VIEW ─── */}
                <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden flex flex-col">
                    {/* Calendar Toolbar */}
                    <div className="px-4 py-2.5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
                        {/* Month Navigation */}
                        <div className="flex items-center gap-2.5">
                            <div className="flex items-center gap-1.5">
                                <CalendarIcon size={14} className="text-orange-500" />
                                <h3 className="text-xs font-bold text-slate-900 tracking-tight min-w-[130px]">
                                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </h3>
                            </div>
                            <div className="flex items-center rounded-md border border-slate-200 bg-white shadow-2xs overflow-hidden">
                                <button 
                                    type="button"
                                    onClick={prevMonth}
                                    className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                                    title="Bulan Sebelumnya"
                                >
                                    <ChevronLeft size={13} />
                                </button>
                                <div className="w-px h-3.5 bg-slate-200" />
                                <button 
                                    type="button"
                                    onClick={goToToday}
                                    className="px-2 py-0.5 text-[11px] font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    Hari Ini
                                </button>
                                <div className="w-px h-3.5 bg-slate-200" />
                                <button 
                                    type="button"
                                    onClick={nextMonth}
                                    className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                                    title="Bulan Berikutnya"
                                >
                                    <ChevronRight size={13} />
                                </button>
                            </div>
                        </div>

                        {/* Legend & Filter Controls */}
                        <div className="flex items-center gap-3 flex-wrap self-end sm:self-auto">
                            {/* Legend Dots */}
                            <div className="hidden lg:flex items-center gap-2.5 text-[10.5px] text-slate-500 font-medium">
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-orange-500" /> Privat
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500" /> Grup
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Selesai
                                </span>
                            </div>

                            {/* Filter Tabs */}
                            <div className="inline-flex p-0.5 bg-slate-100 border border-slate-200/70 rounded-md">
                                <button
                                    type="button"
                                    onClick={() => setSessionFilter('all')}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                                        sessionFilter === 'all' 
                                            ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    <List size={11} />
                                    <span>Semua</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSessionFilter('individual')}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                                        sessionFilter === 'individual' 
                                            ? 'bg-white text-orange-700 shadow-2xs font-bold' 
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    <User size={11} />
                                    <span>Privat</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSessionFilter('group')}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                                        sessionFilter === 'group' 
                                            ? 'bg-white text-indigo-700 shadow-2xs font-bold' 
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    <Users size={11} />
                                    <span>Grup</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="flex-1 overflow-x-auto">
                        <div className="min-w-[800px]">
                            {/* Day Names Header */}
                            <div className="grid grid-cols-7 border-b border-slate-200/80 bg-slate-50/80">
                                {dayNames.map((day, idx) => (
                                    <div 
                                        key={day} 
                                        className={`py-2 text-center text-[10.5px] font-bold uppercase tracking-wider ${
                                            idx === 0 || idx === 6 ? 'text-orange-600/80' : 'text-slate-600'
                                        }`}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>
                            
                            {/* Calendar Days */}
                            <div className="grid grid-cols-7 auto-rows-fr bg-slate-200/40 gap-px">
                                {calendarDays.map((day, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`min-h-[120px] p-2 flex flex-col group transition-colors relative ${
                                            !day.isCurrentMonth 
                                                ? 'bg-slate-50/40' 
                                                : 'bg-white hover:bg-slate-50/40'
                                        }`}
                                    >
                                        {/* Day Header */}
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className={`w-5 h-5 flex items-center justify-center rounded-md text-xs ${
                                                day.isToday 
                                                    ? 'bg-orange-500 text-white font-bold shadow-2xs' 
                                                    : day.isCurrentMonth 
                                                        ? 'text-slate-800 font-bold' 
                                                        : 'text-slate-400 font-medium'
                                            }`}>
                                                {day.date.getDate()}
                                            </div>
                                            {!isAthlete && (
                                                <Link 
                                                    href={route('admin.individual-trainings.session.create', { user: athlete.id, date: day.dateStr })}
                                                    className="w-5 h-5 flex items-center justify-center rounded-md bg-slate-100 text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-orange-500 hover:text-white transition-all shadow-2xs cursor-pointer"
                                                    title="Tambah Sesi"
                                                >
                                                    <Plus size={11} strokeWidth={2.5} />
                                                </Link>
                                            )}
                                        </div>
                                        
                                        {/* Sessions List */}
                                        <div className="flex-1 space-y-1.5 overflow-y-auto pr-0.5 custom-scrollbar">
                                            {day.sessions.map(session => {
                                                const isGroup = session.type === 'group';
                                                let isCompleted = session.status === 'completed' || session.is_completed;
                                                if (isGroup && session.members_pivot?.length > 0) {
                                                    isCompleted = isCompleted || session.members_pivot[0].is_completed;
                                                }
                                                const sessionUrl = isGroup 
                                                    ? route('admin.group-trainings.session.show', session.id) + "?from=athlete&athlete_id=" + athlete.id
                                                    : route('admin.individual-trainings.session.show', session.id);
                                                
                                                return (
                                                    <Link 
                                                        key={`${session.type}-${session.id}`} 
                                                        href={session.is_absent ? '#' : sessionUrl}
                                                        className={`group/session relative rounded-md border text-left flex flex-col transition-all shadow-2xs hover:shadow-xs overflow-hidden block cursor-pointer ${
                                                            session.is_absent 
                                                                ? 'opacity-60 bg-slate-50 border-dashed border-slate-200 cursor-default' 
                                                                : isCompleted
                                                                    ? 'bg-white border-emerald-200 hover:border-emerald-400'
                                                                    : isGroup
                                                                        ? 'bg-white border-indigo-200/80 hover:border-indigo-400'
                                                                        : session.is_extra
                                                                            ? 'bg-white border-violet-200/90 hover:border-violet-400'
                                                                            : 'bg-white border-slate-200/90 hover:border-orange-300'
                                                        }`}
                                                    >
                                                        {session.is_absent ? (
                                                            <div className="p-1.5 block w-full pointer-events-none">
                                                                <div className="flex items-start justify-between mb-0.5">
                                                                    <span className="text-[9px] font-bold px-1 py-0.2 rounded-md bg-slate-200 text-slate-600">
                                                                        Sesi {session.session_number} (Absen)
                                                                    </span>
                                                                </div>
                                                                <div className="text-[11px] font-semibold leading-tight line-clamp-1 text-slate-400">
                                                                    {isGroup ? `[GRUP] ${session.group?.name || 'Sesi Grup'}` : (session.name || 'Sesi Privat')}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {/* Top Header Strip inside card */}
                                                                <div className={`px-2 py-0.5 flex items-center justify-between gap-1 border-b ${
                                                                    isCompleted
                                                                        ? 'bg-emerald-50/70 border-emerald-100 text-emerald-800'
                                                                        : isGroup
                                                                            ? 'bg-indigo-50/70 border-indigo-100 text-indigo-800'
                                                                            : session.is_extra
                                                                                ? 'bg-slate-100 border-slate-200 text-slate-700'
                                                                                : 'bg-orange-50/60 border-orange-100/80 text-orange-800'
                                                                }`}>
                                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                                                            isCompleted 
                                                                                ? 'bg-emerald-500' 
                                                                                : isGroup 
                                                                                    ? 'bg-indigo-500' 
                                                                                    : session.is_extra 
                                                                                        ? 'bg-slate-400' 
                                                                                        : 'bg-orange-500'
                                                                        }`} />
                                                                        <span className="text-[9.5px] font-bold tracking-tight truncate">
                                                                            {session.is_extra ? 'Tambahan' : (() => {
                                                                                const maxCount = isGroup
                                                                                    ? (session.group?.package?.session_count || '∞')
                                                                                    : (session.shared_package?.total_sessions || session.shared_package?.package?.session_count || athlete.package?.session_count || (sharedPackages && sharedPackages.length > 0 ? (sharedPackages[0].total_sessions || sharedPackages[0].package?.session_count) : null) || '∞');
                                                                                const sessionNum = isGroup
                                                                                    ? (session.display_session_number || session.session_number)
                                                                                    : (session.shared_package_id ? (session.shared_session_number || session.session_number) : (session.display_session_number || session.session_number));
                                                                                return `Sesi ${sessionNum}/${maxCount}`;
                                                                            })()}
                                                                        </span>
                                                                    </div>

                                                                    {/* Action Buttons & Status Icon */}
                                                                    <div className="flex items-center gap-0.5 shrink-0">
                                                                        {!isAthlete && (
                                                                            <div className="flex items-center" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        e.stopPropagation();
                                                                                        setSessionToDuplicate(session);
                                                                                        setDuplicateDate(session.date || getLocalDateStr(new Date()));
                                                                                        setSelectedTargetUserIds([athlete.id]);
                                                                                        setClientSearch('');
                                                                                        setDuplicateModalOpen(true);
                                                                                    }}
                                                                                    className="p-0.5 rounded-md hover:bg-white/80 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                                                                                    title="Duplikasi"
                                                                                >
                                                                                    <Copy size={10} />
                                                                                </button>
                                                                                {!isGroup && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            e.stopPropagation();
                                                                                            router.visit(route('admin.individual-trainings.session.edit', session.id));
                                                                                        }}
                                                                                        className="p-0.5 rounded-md hover:bg-white/80 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                                                                                        title="Edit"
                                                                                    >
                                                                                        <Edit2 size={10} />
                                                                                    </button>
                                                                                )}
                                                                                <button 
                                                                                    type="button"
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        e.stopPropagation();
                                                                                        if (!isGroup) deleteSession(e, session.id);
                                                                                    }}
                                                                                    className="p-0.5 rounded-md hover:bg-red-100 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                                                                                    title="Hapus"
                                                                                >
                                                                                    <Trash2 size={10} />
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                        {isCompleted ? (
                                                                            <CheckCircle2 size={10.5} className="text-emerald-600 ml-0.5 shrink-0" title="Selesai" />
                                                                        ) : (
                                                                            <Clock size={10.5} className="text-slate-400 ml-0.5 shrink-0" title="Terjadwal" />
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Card Body */}
                                                                <div className="p-1.5 flex flex-col gap-0.5 bg-white">
                                                                    {(() => {
                                                                        const targetId = Number(athlete?.id);
                                                                        const athleteProgramBlock = isGroup && session.blocks ? session.blocks.find((b) => {
                                                                            const ids = b.program_athlete_ids || b.athlete_ids;
                                                                            return Array.isArray(ids) && ids.map(Number).includes(targetId);
                                                                        }) : null;
                                                                        const assignedProgramName = athleteProgramBlock?.program_name;

                                                                        return (
                                                                            <>
                                                                                <div className="text-[11px] font-bold leading-tight line-clamp-1 text-slate-900 group-hover/session:text-orange-600 transition-colors">
                                                                                    {isGroup ? `[GRUP] ${session.group?.name || 'Sesi Grup'}` : (session.name || 'Sesi Privat')}
                                                                                    {session.is_makeup && (
                                                                                        <span className="ml-1 text-[8px] bg-orange-100 text-orange-700 px-1 py-0.2 rounded-md font-bold uppercase tracking-wider inline-block">
                                                                                        GUEST
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                                {assignedProgramName && (
                                                                                    <div className="flex items-center gap-1 mt-0.5">
                                                                                        <span className="text-[8.5px] font-bold text-indigo-700 bg-indigo-50/90 px-1.5 py-0.2 rounded border border-indigo-200/70 inline-flex items-center gap-1 truncate max-w-full">
                                                                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                                                                            <span className="truncate">{assignedProgramName}</span>
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                            </>
                                                                        );
                                                                    })()}

                                                                    {/* Metadata: Focus, Location, Duration */}
                                                                    {(session.location || session.training_type || session.duration_minutes) && (
                                                                        <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-[9px] text-slate-600 mt-0.5">
                                                                            {session.training_type && (
                                                                                <div className="flex items-center gap-1 truncate max-w-full" title={session.training_type}>
                                                                                    <span className="text-orange-600 font-bold shrink-0">foc:</span>
                                                                                    <span className="truncate font-medium text-slate-700">{session.training_type}</span>
                                                                                </div>
                                                                            )}
                                                                            {session.location && (
                                                                                <div className="flex items-center gap-1 truncate max-w-full" title={session.location}>
                                                                                    <span className="text-slate-400 font-bold shrink-0">loc:</span>
                                                                                    <span className="truncate font-medium text-slate-600">{session.location}</span>
                                                                                </div>
                                                                            )}
                                                                            {session.duration_minutes && (
                                                                                <div className="flex items-center gap-1 shrink-0">
                                                                                    <Timer size={8.5} className="text-slate-400 shrink-0" />
                                                                                    <span className="font-medium text-slate-600">{session.duration_minutes}m</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}

                                                                    {/* Phase Summary (Strength, Cardio Distance & Total Load in AU) */}
                                                                    {(() => {
                                                                        const phases = getSessionPhasesSummary(session, athlete?.id);
                                                                        if (!phases) return null;

                                                                        return (
                                                                            <div className="flex flex-col gap-0.5 mt-1 pt-1 border-t border-slate-100 text-[9px]">
                                                                                {phases.hasStrength && (
                                                                                    <div className="flex items-center justify-between text-slate-600 font-medium">
                                                                                        <span className="flex items-center gap-1">
                                                                                            <Dumbbell size={8.5} className="text-orange-500 shrink-0" /> Strength:
                                                                                        </span>
                                                                                        <strong className="text-slate-800 font-semibold">
                                                                                            {phases.strengthVolume > 0 ? `${phases.strengthVolume >= 1000 ? (phases.strengthVolume / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + 'k' : phases.strengthVolume.toLocaleString('id-ID')} AU` : '-'}
                                                                                        </strong>
                                                                                    </div>
                                                                                )}
                                                                                {phases.hasCardioInterval && (
                                                                                    <div className="flex items-center justify-between text-slate-600 font-medium">
                                                                                        <span className="flex items-center gap-1">
                                                                                            <Activity size={8.5} className="text-sky-600 shrink-0" /> Cardio:
                                                                                        </span>
                                                                                        <strong className="text-slate-800 font-semibold">
                                                                                            {phases.cardioDistance > 0 ? (phases.cardioDistance >= 1000 ? (phases.cardioDistance / 1000).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' km' : `${phases.cardioDistance.toLocaleString('id-ID')} m`) : '-'}
                                                                                        </strong>
                                                                                    </div>
                                                                                )}
                                                                                <div className="flex items-center justify-between text-slate-700 font-bold pt-0.5 mt-0.5 border-t border-dashed border-slate-200/80">
                                                                                    <span className="text-slate-500 font-semibold">Total Load:</span>
                                                                                    <span className="text-orange-600 font-extrabold">
                                                                                        {phases.totalLoad > 0 ? `${phases.totalLoad >= 1000 ? (phases.totalLoad / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + 'k' : phases.totalLoad.toLocaleString('id-ID')} AU` : '-'}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            </>
                                                        )}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* ─── DUPLICATE MODAL ─── */}
            {duplicateModalOpen && sessionToDuplicate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-md border border-slate-200/90 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                            <div className="flex items-center gap-2">
                                <Copy className="w-4 h-4 text-orange-600" />
                                <h3 className="text-xs font-bold text-slate-900">Duplikasi Sesi Latihan</h3>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setDuplicateModalOpen(false)} 
                                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                <X size={14} />
                            </button>
                        </div>
                        
                        <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
                            {/* Info Sesi Asal */}
                            <div className="bg-slate-50 border border-slate-200/80 rounded-md p-3">
                                <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                                    Sesi Asal ({athlete.name})
                                </span>
                                <p className="text-xs font-bold text-slate-900">
                                    {sessionToDuplicate.type === 'group' ? `[GRUP] ${sessionToDuplicate.group?.name || 'Sesi Grup'}` : (sessionToDuplicate.name || 'Sesi Privat')}
                                </p>
                                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-1">
                                    <span>Tgl: {sessionToDuplicate.date}</span>
                                    {sessionToDuplicate.training_type && (
                                        <>
                                            <span>•</span>
                                            <span>Fokus: {sessionToDuplicate.training_type}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Tanggal Tujuan */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Tanggal Tujuan <span className="text-rose-500">*</span>
                                </label>
                                <input 
                                    type="date" 
                                    value={duplicateDate}
                                    onChange={(e) => setDuplicateDate(e.target.value)}
                                    className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 shadow-2xs outline-none"
                                />
                            </div>

                            {/* Pilih Klien Tujuan */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold text-slate-700">
                                        Klien Tujuan <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="flex items-center gap-2 text-[11px]">
                                        <button 
                                            type="button" 
                                            onClick={selectOnlyCurrentAthlete}
                                            className="text-orange-600 hover:text-orange-700 font-semibold hover:underline cursor-pointer"
                                        >
                                            Hanya {athlete.name.split(' ')[0]}
                                        </button>
                                        {allAthletes && allAthletes.length > 1 && (
                                            <>
                                                <span className="text-slate-300">•</span>
                                                <button 
                                                    type="button" 
                                                    onClick={selectAllAthletes}
                                                    className="text-slate-500 hover:text-slate-800 font-semibold hover:underline cursor-pointer"
                                                >
                                                    Pilih Semua
                                                </button>
                                            </>
                                        )}
                                        {selectedTargetUserIds.length > 0 && (
                                            <>
                                                <span className="text-slate-300">•</span>
                                                <button 
                                                    type="button" 
                                                    onClick={deselectAllAthletes}
                                                    className="text-rose-600 hover:text-rose-700 font-semibold hover:underline cursor-pointer"
                                                >
                                                    Kosongkan
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {allAthletes && allAthletes.length > 0 ? (
                                    <div className="border border-slate-200 rounded-md bg-white overflow-hidden">
                                        {/* Search Filter */}
                                        <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                            <Search size={13} className="text-slate-400 shrink-0" />
                                            <input 
                                                type="text" 
                                                value={clientSearch}
                                                onChange={(e) => setClientSearch(e.target.value)}
                                                placeholder="Cari nama klien / cabang olahraga..."
                                                className="w-full text-xs bg-transparent border-none p-0 focus:ring-0 text-slate-800 placeholder-slate-400 font-medium outline-none"
                                            />
                                            {clientSearch && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => setClientSearch('')}
                                                    className="text-slate-400 hover:text-slate-600"
                                                >
                                                    <X size={12} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Selected Clients Chips Bar (Always visible & removable) */}
                                        {selectedTargetUserIds.length > 0 && (
                                            <div className="px-3 py-2 border-b border-slate-100 bg-orange-50/40 flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                                                <span className="text-[10px] font-bold text-slate-500 mr-0.5">Terpilih ({selectedTargetUserIds.length}):</span>
                                                {selectedTargetUserIds.map((id) => {
                                                    const targetUser = allAthletes.find(a => a.id === id) || (id === athlete.id ? athlete : null);
                                                    if (!targetUser) return null;
                                                    const isCurrent = id === athlete.id;
                                                    return (
                                                        <span 
                                                            key={id}
                                                            className={`inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full text-[10.5px] font-bold border transition-all ${
                                                                isCurrent 
                                                                    ? 'bg-orange-100/90 text-orange-950 border-orange-300 shadow-2xs' 
                                                                    : 'bg-white text-slate-800 border-slate-200 shadow-2xs'
                                                            }`}
                                                        >
                                                            <span>{targetUser.name}</span>
                                                            {isCurrent && <span className="text-[9px] text-orange-700 font-medium">(Asal)</span>}
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleTargetUser(id);
                                                                }}
                                                                className="w-3.5 h-3.5 rounded-full hover:bg-slate-200/80 text-slate-400 hover:text-rose-600 flex items-center justify-center cursor-pointer transition-colors"
                                                                title={`Hapus ${targetUser.name}`}
                                                            >
                                                                <X size={10} strokeWidth={2.5} />
                                                            </button>
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Client List Checkboxes */}
                                        <div className="max-h-48 overflow-y-auto divide-y divide-slate-50 custom-scrollbar p-1">
                                            {filteredAthletes.map((a) => {
                                                const isSelected = selectedTargetUserIds.includes(a.id);
                                                const isCurrent = a.id === athlete.id;
                                                return (
                                                    <div 
                                                        key={a.id}
                                                        onClick={() => toggleTargetUser(a.id)}
                                                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                                                            isSelected ? 'bg-orange-50/80 text-orange-950' : 'hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                                                                isSelected 
                                                                    ? 'bg-orange-600 border-orange-600 text-white' 
                                                                    : 'border-slate-300 bg-white'
                                                            }`}>
                                                                {isSelected && <Check size={11} strokeWidth={3} />}
                                                            </div>
                                                            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0 overflow-hidden">
                                                                {(a.profile_photo_url || a.profile_photo) ? (
                                                                    <img src={a.profile_photo_url || `/storage/${a.profile_photo}`} alt={a.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    getInitials(a.name)
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-xs font-bold truncate">
                                                                    {a.name} {isCurrent && <span className="text-[10px] font-semibold text-orange-600">(Saat Ini)</span>}
                                                                </p>
                                                                {a.sport?.name && (
                                                                    <p className="text-[10px] text-slate-400 font-medium truncate">
                                                                        {a.sport.name}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {isSelected && (
                                                            <span className="text-[9.5px] font-bold text-orange-600 bg-orange-100/80 px-1.5 py-0.5 rounded shrink-0">
                                                                Terpilih
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            {filteredAthletes.length === 0 && (
                                                <div className="py-4 text-center text-xs text-slate-400 font-medium">
                                                    Klien tidak ditemukan
                                                </div>
                                            )}
                                        </div>

                                        <div className="px-3 py-1.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                                            <span>Total Klien: {allAthletes.length}</span>
                                            <span className="text-orange-600 font-bold">{selectedTargetUserIds.length} Klien Terpilih</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 border border-slate-200 rounded-md p-2.5 text-xs text-slate-600 font-medium">
                                        Duplikasi akan diterapkan untuk: <strong>{athlete.name}</strong>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] text-slate-500 font-medium">
                                {selectedTargetUserIds.length} sesi akan dibuat
                            </span>
                            <div className="flex items-center gap-2">
                                <button 
                                    type="button"
                                    onClick={() => setDuplicateModalOpen(false)}
                                    disabled={isDuplicating}
                                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="button"
                                    disabled={!duplicateDate || selectedTargetUserIds.length === 0 || isDuplicating}
                                    onClick={() => {
                                        if (!duplicateDate || selectedTargetUserIds.length === 0) return;
                                        setIsDuplicating(true);
                                        const routeName = sessionToDuplicate.type === 'group' 
                                            ? 'admin.group-trainings.session.duplicate' 
                                            : 'admin.individual-trainings.session.duplicate';
                                        router.post(route(routeName, sessionToDuplicate.id), { 
                                            target_date: duplicateDate,
                                            target_user_ids: selectedTargetUserIds 
                                        }, {
                                            preserveScroll: true,
                                            onSuccess: () => {
                                                setDuplicateModalOpen(false);
                                                setIsDuplicating(false);
                                            },
                                            onError: () => {
                                                setIsDuplicating(false);
                                            }
                                        });
                                    }}
                                    className="px-4 py-1.5 text-xs font-bold bg-orange-600 text-white rounded-md shadow-2xs hover:bg-orange-700 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50 active:scale-95"
                                >
                                    {isDuplicating ? (
                                        <>
                                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            <span>Menduplikasi...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={12} />
                                            <span>Duplikasi ke {selectedTargetUserIds.length} Klien</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                    height: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 4px;
                }
            `}</style>
        </AppLayout>
    );
}
