import React, { useState } from "react";
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Activity,
    Scale,
    Droplets,
    Dumbbell,
    Flame,
    Ruler,
    User,
    Zap,
    HeartPulse,
    Shield,
    Layers,
} from "lucide-react";

export default function TrendHighlights({ history }) {
    if (!history || history.length === 0) return null;

    const current = history[0];
    const previous = history.length > 1 ? history[1] : null;
    const [selectedCategory, setSelectedCategory] = useState("all");

    const formatShortDate = (dateString) => {
        if (!dateString) return "";
        const options = { day: "numeric", month: "short", year: "numeric" };
        return new Date(dateString).toLocaleDateString("id-ID", options);
    };

    const getTrendInfo = (currVal, prevVal, inverse = false) => {
        if (
            currVal === undefined ||
            currVal === null ||
            prevVal === undefined ||
            prevVal === null ||
            currVal === "" ||
            prevVal === ""
        ) {
            return {
                icon: Minus,
                badgeClass: "bg-slate-100 text-slate-500 border-slate-200",
                text: "0.0",
                prevValue: "-",
                hasComparison: false,
            };
        }

        const deltaNum = parseFloat(currVal) - parseFloat(prevVal);
        const delta = deltaNum.toFixed(1);

        if (deltaNum > 0) {
            const isGood = !inverse;
            return {
                icon: TrendingUp,
                badgeClass: isGood
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200/80"
                    : "bg-rose-50 text-rose-600 border-rose-200/80",
                text: `+${delta}`,
                prevValue: prevVal,
                hasComparison: true,
            };
        }

        if (deltaNum < 0) {
            const isGood = inverse;
            return {
                icon: TrendingDown,
                badgeClass: isGood
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200/80"
                    : "bg-rose-50 text-rose-600 border-rose-200/80",
                text: `${delta}`,
                prevValue: prevVal,
                hasComparison: true,
            };
        }

        return {
            icon: Minus,
            badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
            text: "Stabil",
            prevValue: prevVal,
            hasComparison: true,
        };
    };

    const categories = [
        { id: "all", label: "Semua", count: 19 },
        { id: "fat", label: "Berat & Lemak", count: 7 },
        { id: "muscle", label: "Otot & Tulang", count: 4 },
        { id: "water", label: "Cairan & Sel", count: 4 },
        { id: "metabolic", label: "Metabolisme", count: 4 },
    ];

    const allMetrics = [
        // Category 1: Berat & Lemak
        {
            id: "weight",
            category: "fat",
            label: "Berat Badan",
            value: current.weight,
            unit: "kg",
            icon: Scale,
            iconBg: "bg-blue-50 text-blue-600 border-blue-100",
            trend: getTrendInfo(current.weight, previous?.weight, false),
        },
        {
            id: "height",
            category: "fat",
            label: "Tinggi Badan",
            value: current.height,
            unit: "cm",
            icon: Ruler,
            iconBg: "bg-purple-50 text-purple-600 border-purple-100",
            trend: getTrendInfo(current.height, previous?.height, false),
        },
        {
            id: "bmi",
            category: "fat",
            label: "BMI",
            value: current.bmi,
            unit: "",
            icon: Activity,
            iconBg: "bg-orange-50 text-orange-600 border-orange-100",
            trend: getTrendInfo(current.bmi, previous?.bmi, true),
        },
        {
            id: "body_fat",
            category: "fat",
            label: "Body Fat",
            value: current.body_fat_percentage,
            unit: "%",
            icon: Flame,
            iconBg: "bg-rose-50 text-rose-600 border-rose-100",
            trend: getTrendInfo(
                current.body_fat_percentage,
                previous?.body_fat_percentage,
                true,
            ),
        },
        {
            id: "fat_free_mass",
            category: "fat",
            label: "Fat-Free Mass",
            value: current.fat_free_mass,
            unit: "kg",
            icon: Shield,
            iconBg: "bg-teal-50 text-teal-600 border-teal-100",
            trend: getTrendInfo(
                current.fat_free_mass,
                previous?.fat_free_mass,
                false,
            ),
        },
        {
            id: "essential_fat",
            category: "fat",
            label: "Lemak Esensial",
            value: current.essential_fat_mass,
            unit: "kg",
            icon: HeartPulse,
            iconBg: "bg-pink-50 text-pink-600 border-pink-100",
            trend: getTrendInfo(
                current.essential_fat_mass,
                previous?.essential_fat_mass,
                true,
            ),
        },
        {
            id: "storage_fat",
            category: "fat",
            label: "Lemak Cadangan",
            value: current.storage_fat_mass,
            unit: "kg",
            icon: Flame,
            iconBg: "bg-orange-50 text-orange-600 border-orange-100",
            trend: getTrendInfo(
                current.storage_fat_mass,
                previous?.storage_fat_mass,
                true,
            ),
        },
        {
            id: "visceral_fat",
            category: "fat",
            label: "Lemak Visceral",
            value: current.visceral_fat,
            unit: "Lvl",
            icon: Flame,
            iconBg: "bg-amber-50 text-amber-600 border-amber-100",
            trend: getTrendInfo(
                current.visceral_fat,
                previous?.visceral_fat,
                true,
            ),
        },

        // Category 2: Otot & Tulang
        {
            id: "muscle_mass",
            category: "muscle",
            label: "Massa Otot",
            value: current.muscle_mass,
            unit: "kg",
            icon: Dumbbell,
            iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
            trend: getTrendInfo(
                current.muscle_mass,
                previous?.muscle_mass,
                false,
            ),
        },
        {
            id: "skeletal_muscle",
            category: "muscle",
            label: "Otot Rangka",
            value: current.skeletal_muscle_mass,
            unit: "kg",
            icon: Dumbbell,
            iconBg: "bg-teal-50 text-teal-600 border-teal-100",
            trend: getTrendInfo(
                current.skeletal_muscle_mass,
                previous?.skeletal_muscle_mass,
                false,
            ),
        },
        {
            id: "bone_mass",
            category: "muscle",
            label: "Massa Tulang",
            value: current.bone_mass,
            unit: "kg",
            icon: Layers,
            iconBg: "bg-slate-100 text-slate-600 border-slate-200",
            trend: getTrendInfo(current.bone_mass, previous?.bone_mass, false),
        },
        {
            id: "other_mass",
            category: "muscle",
            label: "Massa Jaringan Lain",
            value: current.other_mass,
            unit: "kg",
            icon: Layers,
            iconBg: "bg-zinc-100 text-zinc-600 border-zinc-200",
            trend: getTrendInfo(
                current.other_mass,
                previous?.other_mass,
                false,
            ),
        },

        // Category 3: Cairan & Sel
        {
            id: "total_water",
            category: "water",
            label: "Total Cairan (TBW)",
            value: current.total_body_water,
            unit: "%",
            icon: Droplets,
            iconBg: "bg-cyan-50 text-cyan-600 border-cyan-100",
            trend: getTrendInfo(
                current.total_body_water,
                previous?.total_body_water,
                false,
            ),
        },
        {
            id: "intracellular_water",
            category: "water",
            label: "Cairan Intrasel (ICW)",
            value: current.intracellular_water,
            unit: "L",
            icon: Droplets,
            iconBg: "bg-blue-50 text-blue-600 border-blue-100",
            trend: getTrendInfo(
                current.intracellular_water,
                previous?.intracellular_water,
                false,
            ),
        },
        {
            id: "extracellular_water",
            category: "water",
            label: "Cairan Ekstrasel (ECW)",
            value: current.extracellular_water,
            unit: "L",
            icon: Droplets,
            iconBg: "bg-sky-50 text-sky-600 border-sky-100",
            trend: getTrendInfo(
                current.extracellular_water,
                previous?.extracellular_water,
                false,
            ),
        },
        {
            id: "phase_angle",
            category: "water",
            label: "Phase Angle",
            value: current.phase_angle,
            unit: "°",
            icon: Zap,
            iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
            trend: getTrendInfo(
                current.phase_angle,
                previous?.phase_angle,
                false,
            ),
        },

        // Category 4: Metabolisme
        {
            id: "bmr",
            category: "metabolic",
            label: "BMR (Metabolisme Basal)",
            value: current.bmr,
            unit: "kkal",
            icon: Flame,
            iconBg: "bg-orange-50 text-orange-600 border-orange-100",
            trend: getTrendInfo(current.bmr, previous?.bmr, false),
        },
        {
            id: "tdee",
            category: "metabolic",
            label: "TDEE (Energi Harian)",
            value: current.tdee,
            unit: "kkal",
            icon: Activity,
            iconBg: "bg-rose-50 text-rose-600 border-rose-100",
            trend: getTrendInfo(current.tdee, previous?.tdee, false),
        },
        {
            id: "metabolic_age",
            category: "metabolic",
            label: "Usia Metabolik",
            value: current.metabolic_age,
            unit: "thn",
            icon: User,
            iconBg: "bg-purple-50 text-purple-600 border-purple-100",
            trend: getTrendInfo(
                current.metabolic_age,
                previous?.metabolic_age,
                true,
            ),
        },
    ];

    const filteredMetrics =
        selectedCategory === "all"
            ? allMetrics
            : allMetrics.filter((m) => m.category === selectedCategory);

    return (
        <div className="space-y-2.5">
            {/* Header & Filter Tabs Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-white px-3.5 py-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                <div>
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-orange-500" />
                        Parameter Komposisi Tubuh
                    </h3>
                    <p className="text-[10.5px] text-slate-400 font-medium mt-0.5">
                        Evaluasi tes terbaru ({formatShortDate(current.date)})
                    </p>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-0.5">
                    {categories.map((cat) => {
                        const isActive = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-2 py-0.5 rounded text-[10.5px] font-bold transition-all shrink-0 ${
                                    isActive
                                        ? "bg-orange-500 text-white shadow-2xs"
                                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60"
                                }`}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Metrics 4-Grid Compact */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {filteredMetrics.map((metric) => {
                    const MetricIcon = metric.icon;
                    const TrendIcon = metric.trend.icon;
                    const hasVal =
                        metric.value !== null &&
                        metric.value !== undefined &&
                        metric.value !== "";

                    return (
                        <div
                            key={metric.id}
                            className="bg-gradient-to-b from-white via-orange-50/10 to-orange-50/20 rounded-md border border-slate-200/80 p-2.5 shadow-2xs flex flex-col justify-between gap-1.5 hover:border-orange-200/90 hover:shadow-xs transition-all"
                        >
                            {/* Card Top: Icon & Label */}
                            <div className="flex items-center gap-1.5 min-w-0">
                                <div
                                    className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${metric.iconBg}`}
                                >
                                    <MetricIcon className="w-2.5 h-2.5" />
                                </div>
                                <h4
                                    className="text-[10.5px] font-bold text-slate-700 truncate leading-tight"
                                    title={metric.label}
                                >
                                    {metric.label}
                                </h4>
                            </div>

                            {/* Card Middle: Value */}
                            <div className="flex items-baseline gap-1 my-0.5">
                                <span className="text-base sm:text-[17px] font-black text-slate-900 tracking-tight leading-none">
                                    {hasVal ? metric.value : "-"}
                                </span>
                                {hasVal && metric.unit && (
                                    <span className="text-[9px] font-bold text-slate-400">
                                        {metric.unit}
                                    </span>
                                )}
                            </div>

                            {/* Card Bottom: Trend vs Previous */}
                            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 font-medium leading-none">
                                {previous && metric.trend.hasComparison ? (
                                    <div className="flex items-center gap-1 w-full justify-between">
                                        <div
                                            className={`inline-flex items-center gap-0.5 font-bold px-1 py-0.2 rounded border text-[8.5px] ${metric.trend.badgeClass}`}
                                        >
                                            <TrendIcon className="w-2 h-2" />
                                            <span>{metric.trend.text}</span>
                                        </div>
                                        <span className="truncate text-slate-400">
                                            vs {metric.trend.prevValue}{" "}
                                            {metric.unit}
                                        </span>
                                    </div>
                                ) : (
                                    <span>
                                        {previous
                                            ? "Tidak ada perbandingan"
                                            : "Data pertama"}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
