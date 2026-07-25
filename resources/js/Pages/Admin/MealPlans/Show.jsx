import React, { useState, useEffect, useMemo } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import {
    ChevronLeft,
    Flame,
    Sparkles,
    Save,
    Trash2,
    Droplets,
    Target,
    RefreshCw,
    FileText,
    CheckCircle2,
    Info,
    Activity,
    Plus,
} from "lucide-react";
import PageHeader from "@/Components/Layout/PageHeader";
import Modal from "@/Components/Modal";
import {
    generateWeeklyMealPlan,
    rerollMeal,
    rerollMealItem,
} from "@/Utils/MealGenerator";

export default function Show({ player, history, latestTest }) {
    const { auth } = usePage().props;
    const isAthlete = auth.user.role === "athlete";

    const [draftPlan, setDraftPlan] = useState(null);
    const activePlan = history.length > 0 ? history[0] : null;

    const [selectedGoal, setSelectedGoal] = useState("maintenance");
    const [startDate, setStartDate] = useState("");
    const [dailySplits, setDailySplits] = useState(
        Array(7).fill("Moderate Carb"),
    );
    const [activeTab, setActiveTab] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setStartDate(new Date().toISOString().split("T")[0]);
    }, []);

    const DIET_OPTIONS = [
        { label: "Lower", value: "Lower Carb" },
        { label: "Moderate", value: "Moderate Carb" },
        { label: "Higher", value: "Higher Carb" },
    ];

    const getWeekDays = () => {
        if (!startDate) return [];
        const days = [],
            start = new Date(startDate);
        const names = [
            "Minggu",
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jumat",
            "Sabtu",
        ];
        for (let i = 0; i < 7; i++) {
            const c = new Date(start);
            c.setDate(start.getDate() + i);
            days.push({
                index: i,
                date: c.toISOString().split("T")[0],
                label: `${names[c.getDay()]}, ${c.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}`,
            });
        }
        return days;
    };
    const weekDays = getWeekDays();

    const getTargetCalories = () => {
        if (!latestTest) return 0;
        const m = Math.round(
            (parseFloat(latestTest.bmr) || 0) *
                (parseFloat(latestTest.activity_level) || 1.2),
        );
        if (selectedGoal === "cutting") return m - 500;
        if (selectedGoal === "bulking") return m + 500;
        return m;
    };
    const targetCalories = getTargetCalories();

    const handleSplitChange = (i, v) => {
        const s = [...dailySplits];
        s[i] = v;
        setDailySplits(s);
    };

    const handleGenerate = () => {
        if (!latestTest)
            return alert("Atlet belum memiliki data Komposisi Tubuh.");
        const splits = dailySplits.map((split, i) => ({
            date: weekDays[i]?.date,
            label: weekDays[i]?.label,
            split,
        }));
        const weekly = generateWeeklyMealPlan(
            targetCalories,
            splits,
            selectedGoal,
        );
        setDraftPlan({
            recommendation: selectedGoal,
            target_calories: targetCalories,
            weekly_meal_plan: weekly,
            macro_plan: {
                protein: { grams: Math.round((targetCalories * 0.3) / 4) },
                carbs: { grams: Math.round((targetCalories * 0.35) / 4) },
                fats: { grams: Math.round((targetCalories * 0.35) / 9) },
            },
            overall_assessment: `Rencana makan 7 hari untuk program ${selectedGoal} — target ${targetCalories} kcal/hari.`,
            hydration: {
                daily_water_liters:
                    Math.round(
                        (parseFloat(latestTest.weight) || 70) * 0.04 * 10,
                    ) / 10,
                pre_training: "500ml air, 2 jam sebelum latihan",
                during_training: "200ml setiap 15–20 menit",
                post_training: "Ganti 150% cairan yang hilang",
            },
        });
        setActiveTab(0);
        setIsModalOpen(false);
    };

    const handleRerollMeal = (dayIdx, mealIdx) => {
        setDraftPlan((prev) => {
            const p = { ...prev },
                w = [...p.weekly_meal_plan];
            const d = { ...w[dayIdx], meals: [...w[dayIdx].meals] };
            d.meals[mealIdx] = rerollMeal(d.meals[mealIdx]);
            w[dayIdx] = d;
            p.weekly_meal_plan = w;
            return p;
        });
    };

    const handleRerollItem = (dayIdx, mealIdx, itemIdx) => {
        setDraftPlan((prev) => {
            const p = { ...prev },
                w = [...p.weekly_meal_plan];
            const d = { ...w[dayIdx], meals: [...w[dayIdx].meals] };
            d.meals[mealIdx] = rerollMealItem(d.meals[mealIdx], itemIdx);
            w[dayIdx] = d;
            p.weekly_meal_plan = w;
            return p;
        });
    };

    const handleSavePlan = () => {
        if (!draftPlan) return;
        const clean = draftPlan.weekly_meal_plan.map((day) => ({
            day: day.day,
            date: day.date,
            splitType: day.splitType,
            meals: day.meals.map((m) => ({
                time: m.time,
                type: m.type,
                menu: m.menu,
                protein: m.protein,
                carbs: m.carbs,
                fats: m.fats,
                calories: m.calories,
                items: m.items?.map((i) => ({
                    name: i.displayName || i.name,
                    scaledPortion: i.scaledPortion,
                    protein: i.protein,
                    carbs: i.carbs,
                    fats: i.fats,
                    calories: i.calories,
                })),
            })),
        }));
        router.post(
            route("admin.meal-plans.store"),
            {
                user_id: player.id,
                recommendation: draftPlan.recommendation,
                target_calories: draftPlan.target_calories,
                protein_target: draftPlan.macro_plan?.protein?.grams || 0,
                carbs_target: draftPlan.macro_plan?.carbs?.grams || 0,
                fats_target: draftPlan.macro_plan?.fats?.grams || 0,
                weekly_plan: clean,
                hydration_plan: draftPlan.hydration,
                supplements_plan: [],
                notes: draftPlan.overall_assessment,
                warnings: "",
            },
            { onSuccess: () => setDraftPlan(null) },
        );
    };

    const handleDelete = (id) => {
        if (confirm("Yakin ingin menghapus rencana makan ini?"))
            router.delete(route("admin.meal-plans.destroy", id));
    };

    const planToDisplay = draftPlan || activePlan;
    const isDraft = !!draftPlan;

    const weeklyStats = useMemo(() => {
        if (!planToDisplay) return null;
        const days =
            planToDisplay.weekly_plan || planToDisplay.weekly_meal_plan || [];
        let cal = 0,
            p = 0,
            c = 0,
            f = 0;
        const perDay = days.map((day) => {
            const d = { calories: 0, protein: 0, carbs: 0, fats: 0 };
            (day.meals || []).forEach((m) => {
                d.calories += m.calories || 0;
                d.protein += m.protein || 0;
                d.carbs += m.carbs || 0;
                d.fats += m.fats || 0;
            });
            cal += d.calories;
            p += d.protein;
            c += d.carbs;
            f += d.fats;
            return d;
        });
        return {
            total: {
                calories: Math.round(cal),
                protein: Math.round(p),
                carbs: Math.round(c),
                fats: Math.round(f),
            },
            perDay,
        };
    }, [planToDisplay]);

    const weeklyTarget = (planToDisplay?.target_calories || targetCalories) * 7;

    const renderPlanDetails = () => (
        <>
            {/* Top Summaries */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm hover:border-orange-300 hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">
                            Target Kalori
                        </h3>
                        <Flame
                            size={14}
                            className="text-orange-500 group-hover:scale-110 transition-transform"
                        />
                    </div>
                    <div className="flex items-baseline gap-1">
                        <p className="text-xl font-black text-zinc-900 group-hover:text-orange-600 transition-colors">
                            {planToDisplay.target_calories || "-"}
                        </p>
                        <p className="text-zinc-400 font-medium text-[12px]">
                            kcal/hr
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm hover:border-rose-300 hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">
                            Protein
                        </h3>
                        <div className="w-2 h-2 rounded-full bg-rose-500 group-hover:scale-125 transition-transform"></div>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <p className="text-xl font-black text-zinc-900 group-hover:text-rose-600 transition-colors">
                            {planToDisplay.protein_target ||
                                planToDisplay.macro_plan?.protein?.grams ||
                                "-"}
                        </p>
                        <p className="text-zinc-400 font-medium text-[12px]">
                            g/hr
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">
                            Karbohidrat
                        </h3>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform"></div>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <p className="text-xl font-black text-zinc-900 group-hover:text-emerald-600 transition-colors">
                            {planToDisplay.carbs_target ||
                                planToDisplay.macro_plan?.carbs?.grams ||
                                "-"}
                        </p>
                        <p className="text-zinc-400 font-medium text-[12px]">
                            g/hr
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm hover:border-amber-300 hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">
                            Lemak
                        </h3>
                        <div className="w-2 h-2 rounded-full bg-amber-500 group-hover:scale-125 transition-transform"></div>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <p className="text-xl font-black text-zinc-900 group-hover:text-amber-600 transition-colors">
                            {planToDisplay.fats_target ||
                                planToDisplay.macro_plan?.fats?.grams ||
                                "-"}
                        </p>
                        <p className="text-zinc-400 font-medium text-[12px]">
                            g/hr
                        </p>
                    </div>
                </div>

                <div
                    className={`rounded-xl border p-4 shadow-sm transition-all group ${weeklyStats?.total.calories <= weeklyTarget ? "bg-orange-50/50 border-orange-200 hover:border-orange-400 hover:shadow-md" : "bg-red-50 border-red-200 hover:border-red-400 hover:shadow-md"}`}
                >
                    <div className="flex items-center justify-between mb-1.5">
                        <h3
                            className={`font-bold text-[10px] uppercase tracking-widest ${weeklyStats?.total.calories <= weeklyTarget ? "text-orange-700" : "text-red-700"}`}
                        >
                            Total Mg.
                        </h3>
                        {weeklyStats?.total.calories <= weeklyTarget ? (
                            <CheckCircle2
                                size={14}
                                className="text-orange-500"
                            />
                        ) : null}
                    </div>
                    <div className="flex items-baseline gap-1">
                        <p
                            className={`text-xl font-black leading-none ${weeklyStats?.total.calories <= weeklyTarget ? "text-orange-600 group-hover:text-orange-700" : "text-red-600 group-hover:text-red-700"}`}
                        >
                            {weeklyStats?.total.calories.toLocaleString()}
                        </p>
                    </div>
                    <p
                        className={`font-medium text-[12px] mt-1 ${weeklyStats?.total.calories <= weeklyTarget ? "text-orange-600/70" : "text-red-600/70"}`}
                    >
                        dari {weeklyTarget.toLocaleString()} kcal
                    </p>
                </div>
            </div>

            {/* Schedule Tabs */}
            <div className="mt-6">
                <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-6 border-b border-zinc-100 px-1">
                    {(
                        planToDisplay.weekly_plan ||
                        planToDisplay.weekly_meal_plan ||
                        []
                    ).map((day, idx) => {
                        const dateObj = new Date(day.date);
                        const dayNumber = dateObj.getDate();
                        const monthName = dateObj.toLocaleDateString('id-ID', { month: 'short' });
                        const dayName = day.day.split(",")[0];

                        return (
                            <button
                                key={idx}
                                onClick={() => setActiveTab(idx)}
                                className={`shrink-0 flex flex-col items-center justify-center min-w-[80px] p-3 rounded-lg border transition-all ${
                                    activeTab === idx 
                                    ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30 scale-100" 
                                    : "bg-white border-zinc-200 text-zinc-500 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                                }`}
                            >
                                <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${activeTab === idx ? "text-orange-100" : "text-zinc-400"}`}>
                                    {dayName}
                                </span>
                                <span className="text-2xl font-black leading-none">
                                    {dayNumber}
                                </span>
                                <span className={`text-[10px] font-medium mt-1 ${activeTab === idx ? "text-orange-200" : "text-zinc-400"}`}>
                                    {monthName}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="pt-6">
                    {(() => {
                        const day = (planToDisplay.weekly_plan ||
                            planToDisplay.weekly_meal_plan ||
                            [])[activeTab];
                        if (!day) return null;
                        const dayTotals = weeklyStats?.perDay?.[activeTab];
                        return (
                            <div className="animate-in fade-in duration-300">
                                <div className="bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl p-5 md:p-2 text-white mb-6 shadow-lg shadow-orange-500/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                                    {/* Decorative subtle pattern */}
                                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
                                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
                                    
                                    <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left relative z-10">
                                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl flex flex-col items-center justify-center shrink-0 border border-white/30 shadow-inner">
                                            <span className="text-xs font-bold text-orange-100">{day.day.split(",")[0]}</span>
                                            <span className="text-xl font-bold text-white leading-none mt-1">{new Date(day.date).getDate()}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl md:text-xl font-black text-white">
                                                Jadwal Makan Harian
                                            </h3>
                                            <div className="flex flex-wrap gap-3">
                                                {day.splitType && (
                                                    <span className="inline-flex gap-1.5 text-xs font-bold text-white ">
                                                        {day.splitType}
                                                    </span>
                                                )}
                                                
                                            </div>
                                        </div>
                                    </div>

                                    {dayTotals && (
                                        <div className="px-6 py-2 text-center min-w-[180px] relative z-10 shadow-inner">
                                            <p className="text-[10px] font-bold text-orange-200">Target Harian</p>
                                            <div className="flex items-baseline justify-center gap-1.5">
                                                <span className="text-lg font-bold text-white">
                                                    {Math.round(dayTotals.calories).toLocaleString()} / {Math.round(planToDisplay?.target_calories || targetCalories).toLocaleString()}
                                                </span>
                                                <span className="text-orange-200 font-bold text-sm uppercase">kcal</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="relative pb-6">
                                    {/* Timeline line */}
                                    <div className="absolute top-0 bottom-0 left-[19px] md:left-[27px] w-[3px] bg-gradient-to-b from-orange-200 via-orange-100 to-transparent rounded-full hidden sm:block"></div>

                                    {day.meals.map((meal, mealIdx) => (
                                        <div key={mealIdx} className="relative mb-8 last:mb-0 group">
                                            {/* Timeline dot */}
                                            <div className="hidden sm:flex absolute top-7 left-0 md:left-3 w-8 h-8 rounded-full bg-white border-[3px] border-orange-500 items-center justify-center shadow-lg shadow-orange-500/30 z-10 transition-transform group-hover:scale-110">
                                                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                            </div>

                                            <div className="bg-white border border-zinc-100 rounded-xl p-5 md:p-6 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 transition-all ml-0 sm:ml-16 md:ml-20 relative overflow-hidden">
                                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                                    
                                                    {/* Header */}
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-2xl md:text-xl font-bold text-zinc-900 tracking-tight">{meal.time}</span>
                                                            <span className="px-3 py-1.5  text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-sm">
                                                                {meal.type}
                                                            </span>
                                                        </div>
                                                        <p className="text-zinc-500 font-medium text-xs flex items-center gap-1.5 mb-2">
                                                            Target kalori: <span className="text-zinc-800 font-bold ">{meal.calories} kcal</span>
                                                        </p>

                                                        {/* Items */}
                                                        <div className="space-y-3">
                                                            {meal.items && meal.items.length > 0 ? (
                                                                meal.items.map((item, iIdx) => (
                                                                    <div key={iIdx} className="flex items-start justify-between p-2.5 rounded-xl bg-zinc-50 hover:bg-orange-50/50 border border-transparent hover:border-orange-200 transition-colors group/item">
                                                                        <div className="flex items-start gap-4">
                                                                            <div className="w-4 h-4 rounded-full bg-white shadow-sm border border-zinc-100 flex items-center justify-center shrink-0 mt-0.5">
                                                                                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                                                            </div>
                                                                            <div>
                                                                                <span className="block text-[13px] text-zinc-800 font-bold">{item.displayName || item.name}</span>
                                                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5">
                                                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{item.calories} kcal</span>
                                                                                    <span className="text-[10px] font-medium text-rose-500 bg-rose-50 px-1.5 rounded">P: {item.protein}g</span>
                                                                                    <span className="text-[10px] font-medium text-emerald-500 bg-emerald-50 px-1.5 rounded">C: {item.carbs}g</span>
                                                                                    <span className="text-[10px] font-medium text-amber-500 bg-amber-50 px-1.5 rounded">F: {item.fats}g</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-start gap-3 shrink-0">
                                                                            <span className="text-[12px] text-zinc-600 font-bold mt-0.5">
                                                                                {item.scaledPortion}
                                                                            </span>
                                                                            {isDraft && (
                                                                                <button
                                                                                    onClick={() => handleRerollItem(activeTab, mealIdx, iIdx)}
                                                                                    title="Ganti bahan ini"
                                                                                    className="opacity-0 group-hover/item:opacity-100 hover:text-zinc-500 text-zinc-300 transition-all mt-0.5"
                                                                                >
                                                                                    <RefreshCw size={14} strokeWidth={2.5} />
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-zinc-800 font-semibold px-2">{meal.menu}</p>
                                                            )}
                                                        </div>

                                                        {/* Macros */}
                                                        <div className="mt-4 pt-2 border-t border-zinc-100 flex flex-wrap items-center gap-3">
                                                            <span className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-md text-xs font-bold border border-rose-100">
                                                                Protein <span className="text-rose-900">{meal.protein}g</span>
                                                            </span>
                                                            <span className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold border border-emerald-100">
                                                                Carbo <span className="text-emerald-900">{meal.carbs}g</span>
                                                            </span>
                                                            <span className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-md text-xs font-bold border border-amber-100">
                                                                Fat <span className="text-amber-900">{meal.fats}g</span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Meal-level Reroll Action */}
                                                    {isDraft && (
                                                        <div className="shrink-0 mt-4 md:mt-0 flex justify-end">
                                                            <button
                                                                onClick={() => handleRerollMeal(activeTab, mealIdx)}
                                                                title="Reroll set menu lengkap"
                                                                className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-orange-500 text-zinc-400 hover:text-white rounded-lg text-xs font-bold transition-all shadow-sm border border-zinc-200 hover:border-orange-500 group-hover:opacity-100 sm:opacity-0"
                                                            >
                                                                <RefreshCw size={16} strokeWidth={2.5} />
                                                                <span className="sm:hidden group-hover:inline-block">Reroll Sesi</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:border-orange-300 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -mr-12 -mt-12 group-hover:bg-orange-100 transition-colors"></div>
                    <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-widest mb-3 flex items-center gap-2 relative z-10">
                        <Target size={16} /> Objektif Program
                    </h4>
                    <p className="text-sm text-zinc-800 font-medium leading-relaxed relative z-10">
                        {planToDisplay.notes ||
                            planToDisplay.overall_assessment}
                    </p>
                </div>

                {(planToDisplay.hydration_plan || planToDisplay.hydration) && (
                    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:border-sky-300 transition-colors">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-full -mr-12 -mt-12 group-hover:bg-sky-100 transition-colors"></div>
                        <h4 className="text-[11px] font-black text-sky-500 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
                            <Droplets size={16} /> Panduan Hidrasi &middot;{" "}
                            <span className="text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded ml-1">
                                {
                                    (
                                        planToDisplay.hydration_plan ||
                                        planToDisplay.hydration
                                    ).daily_water_liters
                                }{" "}
                                L/hari
                            </span>
                        </h4>
                        <div className="space-y-3 relative z-10">
                            {[
                                (
                                    planToDisplay.hydration_plan ||
                                    planToDisplay.hydration
                                ).pre_training,
                                (
                                    planToDisplay.hydration_plan ||
                                    planToDisplay.hydration
                                ).during_training,
                                (
                                    planToDisplay.hydration_plan ||
                                    planToDisplay.hydration
                                ).post_training,
                            ]
                                .filter(Boolean)
                                .map((t, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3 text-sm text-zinc-700 font-semibold bg-zinc-50 p-3 rounded-xl border border-zinc-100"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                                        {t}
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );

    return (
        <AppLayout
            title={`Rencana Makan ${player.name}`}
            description="Manajemen rencana makan atlet"
        >
            <Head title={`Rencana Makan - ${player.name}`} />

            <div className="pb-24 space-y-8">
                <PageHeader
                    title={`Rencana Makan ${player.name}`}
                    subtitle="Manajemen nutrisi dan jadwal diet khusus klien."
                    badge="Nutrisi & Diet"
                    icon={Flame}
                    actions={
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            {!isAthlete && (
                                <>
                                    <Link
                                        href={route("admin.meal-plans.index")}
                                        className="inline-flex flex-1 md:flex-none items-center justify-center rounded-xl text-sm font-bold transition-colors border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 h-10 px-5 shadow-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2"
                                    >
                                        <ChevronLeft
                                            size={16}
                                            className="mr-1.5"
                                        />
                                        Kembali
                                    </Link>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="inline-flex flex-[2] md:flex-none items-center justify-center rounded-xl text-sm font-bold transition-all bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20 h-10 px-6 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                    >
                                        <Plus size={16} className="mr-1.5" />
                                        <span className="hidden sm:inline">
                                            Buat Rencana Baru
                                        </span>
                                        <span className="sm:hidden">
                                            Generate
                                        </span>
                                    </button>
                                </>
                            )}
                        </div>
                    }
                />

                {/* ── Configurator ── */}
                <Modal
                    show={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    maxWidth="4xl"
                >
                    <div className="bg-white overflow-hidden relative">
                        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                                    <UtensilsIcon size={18} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-zinc-900">
                                        Meal Plan Generator
                                    </h3>
                                    <p className="text-xs text-zinc-500 font-medium mt-0.5">
                                        Atur preferensi makro dan hasilkan menu
                                        otomatis.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[75vh]">
                            <div className="flex flex-col gap-6">
                                {/* Settings */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 flex flex-col">
                                        <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-3">
                                            1. Target Program
                                        </label>
                                        <div className="grid grid-cols-3 gap-2 flex-1">
                                            {[
                                                "cutting",
                                                "maintenance",
                                                "bulking",
                                            ].map((g) => (
                                                <button
                                                    key={g}
                                                    onClick={() =>
                                                        setSelectedGoal(g)
                                                    }
                                                    className={`py-2 px-2 rounded-xl text-[12px] font-bold transition-all border ${selectedGoal === g ? "bg-white border-orange-500 text-orange-600 shadow-sm ring-1 ring-orange-500" : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300"}`}
                                                >
                                                    <span className="capitalize">
                                                        {g}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-3">
                                                2. Tanggal Mulai
                                            </label>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) =>
                                                    setStartDate(e.target.value)
                                                }
                                                className="w-full bg-white border border-zinc-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-700 transition-colors shadow-sm"
                                            />
                                        </div>
                                        <div className="w-36 shrink-0 bg-orange-500 text-white rounded-xl flex flex-col items-center justify-center p-3 shadow-lg shadow-orange-500/20">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-orange-100 mb-1">
                                                Target Kalori
                                            </p>
                                            <p className="text-xl font-black text-white">
                                                {targetCalories}
                                            </p>
                                            <p className="text-[9px] font-medium text-orange-100 mb-2">
                                                kcal/hari
                                            </p>
                                            <div className="w-full h-px bg-orange-400 mb-2"></div>
                                            <p className="text-sm font-bold text-white">
                                                {(
                                                    targetCalories * 7
                                                ).toLocaleString()}
                                            </p>
                                            <p className="text-[9px] font-medium text-orange-200 mt-0.5">
                                                kcal/minggu
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {!latestTest && (
                                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                                        <Info
                                            className="text-red-500 shrink-0 mt-0.5"
                                            size={18}
                                        />
                                        <p className="text-sm font-medium text-red-700">
                                            Atlet belum memiliki data Komposisi
                                            Tubuh. Tes diperlukan untuk
                                            kalkulasi TDEE akurat.
                                        </p>
                                    </div>
                                )}

                                {/* Dist */}
                                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 flex flex-col">
                                    <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-4">
                                        3. Distribusi Nutrisi (7 Hari)
                                    </label>
                                    {startDate ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {weekDays.map((day, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col items-center text-center shadow-sm hover:border-orange-300 transition-colors group"
                                                >
                                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-orange-500 transition-colors">
                                                        {day.label
                                                            .split(",")[1]
                                                            ?.trim()}
                                                    </p>
                                                    <p className="text-[14px] font-black text-zinc-800 mt-1 mb-3">
                                                        {day.label
                                                            .split(",")[0]
                                                            ?.trim()}
                                                    </p>
                                                    <div className="w-full">
                                                        <select
                                                            value={
                                                                dailySplits[idx]
                                                            }
                                                            onChange={(e) =>
                                                                handleSplitChange(
                                                                    idx,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg text-[12px] font-bold text-zinc-700 py-2 pl-3 pr-8 cursor-pointer focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:bg-white shadow-sm transition-all text-left"
                                                        >
                                                            {DIET_OPTIONS.map(
                                                                (o) => (
                                                                    <option
                                                                        key={
                                                                            o.value
                                                                        }
                                                                        value={
                                                                            o.value
                                                                        }
                                                                    >
                                                                        {
                                                                            o.label
                                                                        }
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="border border-dashed border-zinc-300 rounded-xl flex items-center justify-center bg-white p-8">
                                            <p className="text-sm text-zinc-400 font-medium text-center">
                                                Pilih tanggal mulai terlebih
                                                dahulu.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 mt-2">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl transition-all text-sm"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleGenerate}
                                        disabled={!latestTest || !startDate}
                                        className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                                    >
                                        <Target size={18} />
                                        Buat Rencana Otomatis
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>

                {/* ── Plan Display ── */}
                {planToDisplay && !isDraft ? (
                    <div className="space-y-6">
                        {renderPlanDetails()}

                        {!isAthlete && activePlan && !isDraft && (
                            <div className="pt-4 pb-12 flex justify-center">
                                <button
                                    onClick={() => handleDelete(activePlan.id)}
                                    className="py-2.5 px-4 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 font-bold flex items-center justify-center gap-2 rounded-xl transition-all"
                                >
                                    <Trash2 size={14} /> Hapus Rencana Makan Ini
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    !isDraft && (
                        <div className="bg-white rounded-2xl border border-zinc-200 py-24 flex flex-col items-center justify-center shadow-sm mt-8">
                            <div className="w-20 h-20 bg-zinc-50 border border-zinc-200 rounded-full flex items-center justify-center mb-6">
                                <Activity className="text-zinc-400" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900">
                                Belum Ada Rencana Makan
                            </h3>
                            <p className="text-zinc-500 mt-2 max-w-sm text-center text-sm font-medium">
                                {isAthlete
                                    ? "Anda belum memiliki jadwal rencana makan. Silakan tunggu pelatih Anda."
                                    : "Gunakan generator di atas untuk menciptakan menu secara otomatis."}
                            </p>
                        </div>
                    )
                )}

                {/* Draft Modal */}
                <Modal
                    show={isDraft && !!planToDisplay}
                    onClose={() => setDraftPlan(null)}
                    maxWidth="5xl"
                >
                    <div className="bg-white overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Draft Banner */}
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 md:p-8 shrink-0 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden z-20">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 pointer-events-none"></div>
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="p-2.5 bg-white/20 text-white rounded-xl backdrop-blur-sm">
                                    <Info size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white flex items-center gap-3">
                                        Draft Rencana Makan
                                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-white text-orange-600 uppercase tracking-widest shadow-sm">
                                            Unsaved
                                        </span>
                                    </h3>
                                    <p className="text-sm font-medium text-orange-50 mt-1.5">
                                        Periksa jadwal di bawah. Klik ikon putar
                                        (↻) pada bahan spesifik untuk
                                        menggantinya secara otomatis.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto shrink-0 relative z-10">
                                <button
                                    onClick={() => setDraftPlan(null)}
                                    className="flex-1 md:flex-none px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all text-sm backdrop-blur-sm border border-white/20"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSavePlan}
                                    className="flex-1 md:flex-none px-6 py-3 bg-white hover:bg-orange-50 text-orange-600 rounded-xl font-black transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
                                >
                                    <Save size={18} /> Simpan Permanen
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-6 md:p-8 overflow-y-auto bg-zinc-50/50 flex-1 min-h-0">
                            <div className="max-w-4xl mx-auto pb-8">
                                {planToDisplay && renderPlanDetails()}
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </AppLayout>
    );
}

// Minimal icon to replace standard Utensils if needed
function UtensilsIcon(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
    );
}
