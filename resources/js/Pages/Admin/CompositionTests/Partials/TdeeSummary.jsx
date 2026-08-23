import React, { useState, useMemo } from "react";
import {
    Calculator,
    Utensils,
    Flame,
    ChevronDown,
    ChevronUp,
    Activity,
    Dumbbell,
} from "lucide-react";

const ACTIVITY_MULTIPLIERS = [
    { label: "BMR (Metabolisme Basal)", value: 1 },
    { label: "Tidak Aktif (Sedentary)", value: 1.2 },
    { label: "Olahraga Ringan (1-3x/mgg)", value: 1.375 },
    { label: "Olahraga Sedang (3-5x/mgg)", value: 1.55 },
    { label: "Olahraga Berat (6-7x/mgg)", value: 1.725 },
    { label: "Atlet Sangat Aktif (2x/hari)", value: 1.9 },
];

const MACRO_SPLITS = [
    {
        id: "moderate",
        name: "Karbo Sedang (Moderate)",
        ratios: [0.3, 0.35, 0.35],
        desc: "30P / 35L / 35K",
    },
    {
        id: "lower",
        name: "Karbo Rendah (Low Carb)",
        ratios: [0.4, 0.4, 0.2],
        desc: "40P / 40L / 20K",
    },
    {
        id: "higher",
        name: "Karbo Tinggi (High Carb)",
        ratios: [0.3, 0.2, 0.5],
        desc: "30P / 20L / 50K",
    },
];

export default function TdeeSummary({ test }) {
    const [activeGoal, setActiveGoal] = useState("maintenance"); // 'maintenance' | 'cutting' | 'bulking'
    const [selectedMacroSplit, setSelectedMacroSplit] = useState("moderate");
    const [showActivityTable, setShowActivityTable] = useState(false);

    const analysis = useMemo(() => {
        if (!test || !test.bmr) return null;
        const bmr = parseFloat(test.bmr) || 0;
        const activityLevel = parseFloat(test.activity_level) || 1.2;
        const maintenance = Math.round(bmr * activityLevel);

        return { bmr, maintenance, activityLevel };
    }, [test]);

    if (!analysis) return null;

    const { bmr, maintenance } = analysis;

    const getGoalCalories = (goal) => {
        if (goal === "cutting") return Math.max(1000, maintenance - 500);
        if (goal === "bulking") return maintenance + 500;
        return maintenance;
    };

    const goalCalories = getGoalCalories(activeGoal);

    const calculateMacros = (cals, ratios) => {
        const [pRatio, fRatio, cRatio] = ratios;
        return {
            protein: Math.round((cals * pRatio) / 4),
            fats: Math.round((cals * fRatio) / 9),
            carbs: Math.round((cals * cRatio) / 4),
        };
    };

    const activeSplit =
        MACRO_SPLITS.find((s) => s.id === selectedMacroSplit) ||
        MACRO_SPLITS[0];
    const currentMacros = calculateMacros(goalCalories, activeSplit.ratios);

    return (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden transition-colors">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Calculator className="w-3.5 h-3.5 text-orange-500" />
                            Target Kalori & Makronutrisi
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                            Kalkulasi kebutuhan energi (Katch-McArdle).
                        </p>
                    </div>
                </div>

                {/* Goal Switcher Tabs */}
                <div className="flex bg-slate-200/60 p-0.5 rounded-lg border border-slate-200/80 mt-2.5">
                    {[
                        { id: "maintenance", label: "Maintenance" },
                        { id: "cutting", label: "Cutting (-500)" },
                        { id: "bulking", label: "Bulking (+500)" },
                    ].map((g) => (
                        <button
                            key={g.id}
                            type="button"
                            onClick={() => setActiveGoal(g.id)}
                            className={`flex-1 py-1 text-[10.5px] font-bold rounded-md transition-all ${
                                activeGoal === g.id
                                    ? "bg-white text-orange-600 shadow-2xs border border-slate-200/60"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            {g.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-3.5 space-y-3.5">
                {/* 1. Daily & Weekly Energy Target Box */}
                <div className="p-3 rounded-lg bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 border border-slate-200/90 shadow-2xs hover:border-orange-200/90 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">
                                Target Energi Harian
                            </span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="text-2xl font-black tracking-tight leading-none text-slate-900">
                                    {goalCalories.toLocaleString("id-ID")}
                                </span>
                                <span className="text-xs font-bold text-slate-400">
                                    kkal/hari
                                </span>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">
                                Total Mingguan
                            </span>
                            <span className="text-xs font-bold text-slate-700 mt-0.5 block">
                                {(goalCalories * 7).toLocaleString("id-ID")}{" "}
                                <span className="text-[10px] text-slate-400 font-normal">
                                    kkal
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Macro Nutrients Section */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                            <Utensils className="w-3 h-3 text-orange-500" />
                            Distribusi Makronutrisi
                        </span>

                        {/* Macro Split Selector */}
                        <div className="flex items-center gap-1">
                            {MACRO_SPLITS.map((split) => (
                                <button
                                    key={split.id}
                                    type="button"
                                    onClick={() =>
                                        setSelectedMacroSplit(split.id)
                                    }
                                    className={`px-1.5 py-0.5 text-[9.5px] font-bold rounded transition-all ${
                                        selectedMacroSplit === split.id
                                            ? "bg-orange-50 text-orange-700 border border-orange-200"
                                            : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200/60"
                                    }`}
                                >
                                    {split.id === "moderate"
                                        ? "Sedang"
                                        : split.id === "lower"
                                          ? "Rendah"
                                          : "Tinggi"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3 Macro Cards (Protein, Lemak, Karbo) */}
                    <div className="grid grid-cols-3 gap-2">
                        {/* Protein */}
                        <div className="bg-gradient-to-b from-white via-orange-50/10 to-orange-50/25 border border-slate-200/90 rounded-lg p-2 text-center shadow-2xs hover:border-orange-200/90 transition-all">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                                Protein
                            </span>
                            <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                                <span className="text-base font-black text-slate-900">
                                    {currentMacros.protein}
                                </span>
                                <span className="text-[9px] font-bold text-slate-400">
                                    g
                                </span>
                            </div>
                            <span className="text-[8.5px] text-slate-400 font-medium block">
                                {Math.round(currentMacros.protein * 4)} kkal
                            </span>
                        </div>

                        {/* Lemak */}
                        <div className="bg-gradient-to-b from-white via-orange-50/10 to-orange-50/25 border border-slate-200/90 rounded-lg p-2 text-center shadow-2xs hover:border-orange-200/90 transition-all">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                                Lemak
                            </span>
                            <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                                <span className="text-base font-black text-slate-900">
                                    {currentMacros.fats}
                                </span>
                                <span className="text-[9px] font-bold text-slate-400">
                                    g
                                </span>
                            </div>
                            <span className="text-[8.5px] text-slate-400 font-medium block">
                                {Math.round(currentMacros.fats * 9)} kkal
                            </span>
                        </div>

                        {/* Karbo */}
                        <div className="bg-gradient-to-b from-white via-orange-50/10 to-orange-50/25 border border-slate-200/90 rounded-lg p-2 text-center shadow-2xs hover:border-orange-200/90 transition-all">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                                Karbo
                            </span>
                            <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                                <span className="text-base font-black text-slate-900">
                                    {currentMacros.carbs}
                                </span>
                                <span className="text-[9px] font-bold text-slate-400">
                                    g
                                </span>
                            </div>
                            <span className="text-[8.5px] text-slate-400 font-medium block">
                                {Math.round(currentMacros.carbs * 4)} kkal
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. Estimasi Berdasarkan Tingkat Aktivitas (Collapsible Accordion) */}
                <div className="border border-slate-200/80 rounded-lg overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setShowActivityTable(!showActivityTable)}
                        className="w-full px-3 py-2 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between text-left transition-colors"
                    >
                        <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                            <Activity className="w-3 h-3 text-orange-500" />
                            Estimasi Berdasarkan Aktivitas
                        </span>
                        {showActivityTable ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        )}
                    </button>

                    {showActivityTable && (
                        <div className="p-2 divide-y divide-slate-100 bg-white">
                            {ACTIVITY_MULTIPLIERS.map((act, idx) => {
                                const baseMaintenance = Math.round(
                                    bmr * act.value,
                                );
                                let cals = baseMaintenance;
                                if (act.label !== "BMR (Metabolisme Basal)") {
                                    if (activeGoal === "cutting")
                                        cals = Math.max(1000, cals - 500);
                                    if (activeGoal === "bulking") cals += 500;
                                }
                                return (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-center py-1.5 px-2 hover:bg-slate-50 rounded text-[10.5px]"
                                    >
                                        <span className="text-slate-600 font-medium">
                                            {act.label}
                                        </span>
                                        <span className="font-bold text-slate-900">
                                            {cals.toLocaleString("id-ID")}{" "}
                                            <span className="text-[9px] text-slate-400 font-normal">
                                                kkal
                                            </span>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
