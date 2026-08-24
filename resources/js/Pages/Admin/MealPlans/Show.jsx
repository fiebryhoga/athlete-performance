import React, { useState, useEffect, useMemo } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import {
    ArrowLeft,
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
    Clock,
    Calendar,
    Check,
    X,
    AlertCircle,
    ChevronDown,
    BarChart3,
    ArrowRight,
    Pencil,
    ShieldCheck,
    Compass,
    Users,
    Scale,
    User as UserIcon,
    Utensils,
    Sunrise,
    Sun,
    Moon,
    Apple,
    Coffee,
} from "lucide-react";
import PageHeader from "@/Components/Common/PageHeader";
import PageFooter from "@/Components/Common/PageFooter";
import Modal from "@/Components/Modal";
import {
    generateWeeklyMealPlan,
    rerollMeal,
    rerollMealItem,
    createDishTitle,
} from "@/utils/MealGenerator";

function getMealIcon(type) {
    const t = (type || "").toLowerCase();
    if (t.includes("sarapan") || t.includes("breakfast")) return Sunrise;
    if (t.includes("siang") || t.includes("lunch")) return Sun;
    if (t.includes("malam") || t.includes("dinner")) return Moon;
    return Apple;
}

function cleanPortionText(portionStr, itemName = "") {
    if (!portionStr || typeof portionStr !== "string") return "1 porsi";
    let p = portionStr;
    const name = (itemName || "").toLowerCase();

    // 1. Broth / Kuah -> Fixed "1 mangkuk kecil kuah"
    if (name.includes("kuah") || name.includes("kaldu")) {
        return "1 mangkuk kecil kuah";
    }

    // 2. Cucumber, Tomato, Pickles -> Always in "iris"
    if ((name.includes("mentimun") || name.includes("tomat") || name.includes("acar")) && p.includes("porsi")) {
        return "4 iris";
    }

    // 3. Fix "250 gelas" -> "1 gelas (250ml)", "300 gelas" -> "1 gelas (300ml)"
    if (/^\d{2,4}\s*(gelas|cangkir)/i.test(p)) {
        const match = p.match(/^(\d{2,4})\s*(gelas|cangkir)/i);
        const ml = match[1];
        const unit = match[2].toLowerCase();
        return `1 ${unit} (${ml}ml)`;
    }
    if (p.startsWith("ml (") || p.startsWith("ml")) {
        return p.includes("cangkir") ? "1 cangkir (200ml)" : "1 gelas (250ml)";
    }

    // 4. Carb staples without fraction info (e.g. "180 gram" or "320 gram")
    if (/^\d{2,4}\s*gram$/i.test(p.trim())) {
        const grams = parseInt(p.trim());
        if (name.includes("bubur") || name.includes("oatmeal") || name.includes("bihun")) {
            const frac = grams <= 140 ? "1/2" : grams <= 200 ? "3/4" : "1";
            return `${grams} gram (${frac} mangkuk)`;
        }
        if (name.includes("nasi") || name.includes("kentang") || name.includes("ubi") || name.includes("pasta") || name.includes("singkong")) {
            const frac = grams <= 90 ? "1/2" : grams <= 130 ? "3/4" : "1";
            return `${grams} gram (${frac} porsi)`;
        }
    }

    // 5. Eliminate awkward mixed fractions like "1 1/4", "1 1/2", "11/4" -> "1"
    p = p.replace(/\b1\s+1\/[24]\b/g, "1");
    p = p.replace(/\b11\/[24]\b/g, "1");

    // 6. Fix decimal discrete counts: "1.1 butir" -> "1 butir", "1.1 mangkuk (200g)" -> "1 mangkuk (200g)"
    p = p.replace(/(\d+)\.\d+\s*(butir|buah|lembar|potong|mangkuk|porsi|tongkol|keping|sdm)/gi, (_, num) => `${num} $2`);
    // Fix decimal grams: "91.1 gram" -> "90 gram"
    p = p.replace(/(\d+)\.\d+\s*(gram|g)/gi, (_, num) => `${Math.round(+num / 10) * 10} gram`);
    // Fix decimal volume: "227.1 ml" -> "250 ml"
    p = p.replace(/(\d+)\.\d+\s*(ml)/gi, (_, num) => `${Math.round(+num / 50) * 50} ml`);
    return p;
}

function getItemCategoryBadge(idx, isSnack) {
    if (isSnack) return { label: "Camilan", color: "bg-amber-50 text-amber-700 border-amber-200/60" };
    if (idx === 0) return { label: "Karbo", color: "bg-sky-50 text-sky-700 border-sky-200/60" };
    if (idx === 1) return { label: "Protein", color: "bg-rose-50 text-rose-700 border-rose-200/60" };
    return { label: "Sayur/Lauk", color: "bg-emerald-50 text-emerald-700 border-emerald-200/60" };
}

// --- HELPER INITIALS ---
function getInitials(name) {
    if (!name) return "??";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

// --- HELPER ATHLETE CODE ---
function getAthleteCode(name) {
    if (!name) return "";
    const words = name.trim().split(" ");
    if (words.length >= 3) {
        return `@${words[0][0]}${words[1][0]}${words[2][0]}`.toUpperCase();
    }
    if (words.length === 2) {
        return `@${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return `@${name.substring(0, 3)}`.toUpperCase();
}

/* ═══════════════════════════════════════════════════════════
   HELPER: Status badge
   ═══════════════════════════════════════════════════════════ */
const STATUS_MAP = {
    active: {
        label: "Aktif",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
    },
    completed: {
        label: "Selesai",
        bg: "bg-slate-100",
        text: "text-slate-600",
        border: "border-slate-200",
        dot: "bg-slate-400",
    },
    archived: {
        label: "Riwayat",
        bg: "bg-slate-100",
        text: "text-slate-600",
        border: "border-slate-200",
        dot: "bg-slate-400",
    },
    upcoming: {
        label: "Mendatang",
        bg: "bg-sky-50",
        text: "text-sky-700",
        border: "border-sky-200",
        dot: "bg-sky-500",
    },
};

function StatusBadge({ status }) {
    const cfg = STATUS_MAP[status] || STATUS_MAP.active;
    return (
        <span
            className={`inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-md border ${cfg.bg} ${cfg.text} ${cfg.border}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

/* ═══════════════════════════════════════════════════════════
   HELPER: Compliance Ring
   ═══════════════════════════════════════════════════════════ */
function ComplianceRing({ score, size = 42 }) {
    const r = (size - 6) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (circ * (score || 0)) / 100;
    const color =
        score >= 75
            ? "stroke-emerald-500"
            : score >= 50
              ? "stroke-amber-500"
              : "stroke-rose-500";
    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    className="stroke-slate-200"
                    strokeWidth={3}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    className={color}
                    strokeWidth={3}
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.5s ease" }}
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-700">
                {Math.round(score || 0)}%
            </span>
        </div>
    );
}

export default function Show({ player, history = [], trackings = {}, latestTest }) {
    const { auth } = usePage().props;
    const isAthlete = auth?.user?.role === "athlete";

    const [draftPlan, setDraftPlan] = useState(null);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [showHistoryPanel, setShowHistoryPanel] = useState(false);

    // Generator state
    const [selectedGoal, setSelectedGoal] = useState("maintenance");
    const [startDate, setStartDate] = useState("");
    const [dailySplits, setDailySplits] = useState(
        Array(7).fill("Moderate Carb"),
    );
    const [activeTab, setActiveTab] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Tracking state (athlete side)
    const [trackingState, setTrackingState] = useState({});
    const [trackingDate, setTrackingDate] = useState(
        new Date().toISOString().split("T")[0],
    );
    const [isSavingTracking, setIsSavingTracking] = useState(false);

    useEffect(() => {
        setStartDate(new Date().toISOString().split("T")[0]);
    }, []);

    // Auto-select active plan or first plan
    useEffect(() => {
        if (history.length > 0 && !selectedPlanId) {
            const active = history.find((p) => p.status === "active");
            setSelectedPlanId(active ? active.id : history[0].id);
        }
    }, [history]);

    const activePlan = useMemo(
        () => history.find((p) => p.id === selectedPlanId) || (history.length > 0 ? history[0] : null),
        [history, selectedPlanId],
    );

    // Sync trackingDate with active tab
    useEffect(() => {
        const daysList = activePlan?.weekly_plan || activePlan?.weekly_meal_plan || [];
        if (daysList[activeTab]?.date) {
            setTrackingDate(daysList[activeTab].date);
        }
    }, [activeTab, activePlan]);

    // Load tracking data when plan or date changes
    useEffect(() => {
        if (!activePlan || !trackingDate) return;
        const planTrackings = trackings[activePlan.id] || [];
        const targetDate = trackingDate.split("T")[0];
        const existing = planTrackings.find((t) => {
            const d = t.date_str || t.date || "";
            return d.split("T")[0] === targetDate;
        });
        if (existing && existing.tracking_data) {
            setTrackingState(existing.tracking_data);
        } else {
            setTrackingState({});
        }
    }, [activePlan, trackingDate, trackings]);

    const DIET_OPTIONS = [
        { label: "Lower Carb", value: "Lower Carb" },
        { label: "Moderate Carb", value: "Moderate Carb" },
        { label: "Higher Carb", value: "Higher Carb" },
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
        if (!latestTest) return 2000;
        const m = Math.round(
            (parseFloat(latestTest.bmr) || 1600) *
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
            overall_assessment: `Rencana makan 7 hari program ${selectedGoal} — target ${targetCalories} kcal/hari.`,
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

    const [localPlanData, setLocalPlanData] = useState(null);
    const [isSavingPlan, setIsSavingPlan] = useState(false);

    // Keep localPlanData in sync with activePlan
    useEffect(() => {
        if (activePlan) {
            setLocalPlanData(JSON.parse(JSON.stringify(activePlan)));
        } else {
            setLocalPlanData(null);
        }
    }, [activePlan]);

    const handleRerollMeal = (dayIdx, mealIdx) => {
        if (isDraft) {
            setDraftPlan((prev) => {
                const p = { ...prev },
                    w = [...p.weekly_meal_plan];
                const d = { ...w[dayIdx], meals: [...w[dayIdx].meals] };
                d.meals[mealIdx] = rerollMeal(d.meals[mealIdx]);
                w[dayIdx] = d;
                p.weekly_meal_plan = w;
                return p;
            });
            return;
        }

        if (!localPlanData || !activePlan) return;
        const daysList = localPlanData.weekly_plan || [];
        const newDays = JSON.parse(JSON.stringify(daysList));
        if (newDays[dayIdx] && newDays[dayIdx].meals[mealIdx]) {
            newDays[dayIdx].meals[mealIdx] = rerollMeal(newDays[dayIdx].meals[mealIdx]);
            
            const updated = { ...localPlanData, weekly_plan: newDays };
            setLocalPlanData(updated);

            // Auto-save update to database
            setIsSavingPlan(true);
            router.put(
                route("admin.meal-plans.update", activePlan.id),
                { weekly_plan: newDays },
                {
                    preserveScroll: true,
                    onFinish: () => setIsSavingPlan(false),
                }
            );
        }
    };

    const handleRerollItem = (dayIdx, mealIdx, itemIdx) => {
        if (isDraft) {
            setDraftPlan((prev) => {
                const p = { ...prev },
                    w = [...p.weekly_meal_plan];
                const d = { ...w[dayIdx], meals: [...w[dayIdx].meals] };
                d.meals[mealIdx] = rerollMealItem(d.meals[mealIdx], itemIdx);
                w[dayIdx] = d;
                p.weekly_meal_plan = w;
                return p;
            });
            return;
        }

        if (!localPlanData || !activePlan) return;
        const daysList = localPlanData.weekly_plan || [];
        const newDays = JSON.parse(JSON.stringify(daysList));
        if (newDays[dayIdx] && newDays[dayIdx].meals[mealIdx] && newDays[dayIdx].meals[mealIdx].items?.[itemIdx]) {
            newDays[dayIdx].meals[mealIdx] = rerollMealItem(newDays[dayIdx].meals[mealIdx], itemIdx);
            
            const updated = { ...localPlanData, weekly_plan: newDays };
            setLocalPlanData(updated);

            // Auto-save update to database
            setIsSavingPlan(true);
            router.put(
                route("admin.meal-plans.update", activePlan.id),
                { weekly_plan: newDays },
                {
                    preserveScroll: true,
                    onFinish: () => setIsSavingPlan(false),
                }
            );
        }
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
                start_date: clean[0]?.date || null,
                end_date: clean[clean.length - 1]?.date || null,
            },
            { onSuccess: () => setDraftPlan(null) },
        );
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Hapus Rencana Makan?",
            text: "Data rencana makan ini akan dihapus secara permanen.",
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
                router.delete(route("admin.meal-plans.destroy", id));
            }
        });
    };

    /* ═══════════════════════════════════
       TRACKING HANDLERS (Athlete)
       ═══════════════════════════════════ */
    const getItemStatus = (mealIdx, itemIdx) => {
        return (
            trackingState?.meals?.[mealIdx]?.items?.[itemIdx]?.status || null
        );
    };

    const getItemReplacement = (mealIdx, itemIdx) => {
        return (
            trackingState?.meals?.[mealIdx]?.items?.[itemIdx]?.replacement || ""
        );
    };

    const getItemNotes = (mealIdx, itemIdx) => {
        return (
            trackingState?.meals?.[mealIdx]?.items?.[itemIdx]?.notes || ""
        );
    };

    const saveTrackingData = (stateToSave) => {
        if (!activePlan) return;
        setIsSavingTracking(true);

        const days = activePlan.weekly_plan || [];
        const currentDay = days.find((d) => d.date === trackingDate);
        const enriched = { ...stateToSave };
        if (currentDay && enriched.meals) {
            enriched.meals = enriched.meals.map((tm, mi) => {
                const planMeal = currentDay.meals?.[mi];
                return {
                    ...tm,
                    type: planMeal?.type || "",
                    items: (tm.items || []).map((ti, ii) => {
                        const planItem = planMeal?.items?.[ii];
                        return {
                            ...ti,
                            name:
                                planItem?.name ||
                                planItem?.displayName ||
                                "",
                        };
                    }),
                };
            });
        }

        router.post(
            route("admin.meal-plans.tracking"),
            {
                meal_plan_id: activePlan.id,
                date: trackingDate,
                tracking_data: enriched,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setIsSavingTracking(false),
                onError: () => setIsSavingTracking(false),
            },
        );
    };

    const updateTrackingItem = (mealIdx, itemIdx, field, value) => {
        setTrackingState((prev) => {
            const next = { ...prev };
            if (!next.meals) next.meals = [];

            while (next.meals.length <= mealIdx) {
                next.meals.push({ meal_index: next.meals.length, items: [] });
            }
            const meal = { ...next.meals[mealIdx] };
            if (!meal.items) meal.items = [];

            while (meal.items.length <= itemIdx) {
                meal.items.push({
                    item_index: meal.items.length,
                    status: null,
                });
            }
            meal.items = [...meal.items];
            meal.items[itemIdx] = { ...meal.items[itemIdx], [field]: value };

            next.meals = [...next.meals];
            next.meals[mealIdx] = meal;

            // Auto-save immediately on status change
            if (field === "status") {
                saveTrackingData(next);
            }

            return next;
        });
    };

    /* ═══════════════════════════════════
       COMPUTED: Plan stats & compliance
       ═══════════════════════════════════ */
    const planToDisplay = draftPlan || localPlanData || activePlan;
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

    const weeklyTarget =
        (planToDisplay?.target_calories || targetCalories) * 7;

    // Compliance summary for coach view
    const complianceSummary = useMemo(() => {
        if (!activePlan) return null;
        const planTrackings = trackings[activePlan.id] || [];
        if (planTrackings.length === 0) return null;

        const avgScore =
            planTrackings.reduce(
                (sum, t) => sum + (t.compliance_score || 0),
                0,
            ) / planTrackings.length;

        return {
            tracked_days: planTrackings.length,
            avg_score: Math.round(avgScore * 10) / 10,
            daily: planTrackings.map((t) => ({
                date: t.date,
                score: t.compliance_score || 0,
                data: t.tracking_data,
            })),
        };
    }, [activePlan, trackings]);

    const trackingCompliance = useMemo(() => {
        if (!trackingState?.meals) return null;
        let total = 0,
            eaten = 0,
            replaced = 0,
            skipped = 0;
        (trackingState.meals || []).forEach((m) => {
            (m.items || []).forEach((item) => {
                if (item.status) {
                    total++;
                    if (item.status === "eaten") eaten++;
                    else if (item.status === "replaced") replaced++;
                    else if (item.status === "skipped") skipped++;
                }
            });
        });
        return total > 0
            ? {
                  total,
                  eaten,
                  replaced,
                  skipped,
                  score: Math.round((eaten / total) * 100),
              }
            : null;
    }, [trackingState]);

    const photo = player.photo_url || player.profile_photo ? (player.photo_url || `/storage/${player.profile_photo}`) : null;

    const days = planToDisplay?.weekly_plan || planToDisplay?.weekly_meal_plan || [];
    const showTrackingUI = isAthlete && activePlan?.status === "active";

    /* ═══════════════════════════════════
       MAIN RENDER
       ═══════════════════════════════════ */
    return (
        <AppLayout
            title={`Rencana Makan - ${player.name}`}
            description="Manajemen rencana makan dan nutrisi atlet."
        >
            <Head title={`Rencana Makan - ${player.name}`} />

            <div className="space-y-4 pb-12">
                {/* ─── BREADCRUMB & HEADER ACTIONS ─── */}
                <div className="space-y-1">
                    {!isAthlete && (
                        <Link
                            href={route("admin.meal-plans.index")}
                            className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors gap-1.5"
                        >
                            <ArrowLeft size={13} /> Kembali ke Rencana Makan
                        </Link>
                    )}

                    <PageHeader
                        title={`Rencana Makan ${player.name}`}
                        description="Kelola jadwal diet harian, target makro nutrisi, serta pantau kepatuhan konsumsi makanan atlet."
                        actions={
                            !isAthlete && (
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 hover:via-orange-50/40 hover:to-orange-100/60 text-orange-600 border border-slate-200/90 hover:border-orange-300 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Buat Rencana Baru</span>
                                </button>
                            )
                        }
                    />
                </div>

                {/* ─── 2-COLUMN DASHBOARD LAYOUT (KANAN - KIRI) ─── */}
                {planToDisplay && !isDraft ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                        {/* ═══════════════════════════════════════════════════════
                            KOLOM KIRI (8 Kolom di LG) — Profil & Sesi Makan
                           ═══════════════════════════════════════════════════════ */}
                        <div className="lg:col-span-8 space-y-3.5">
                            {/* 1. Athlete Profile Hero Card */}
                            <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden hover:border-slate-300 transition-all">
                                <div className="relative h-16 sm:h-20 bg-gradient-to-r from-white via-orange-50/30 to-amber-50/40 border-b border-slate-100 p-3.5 flex justify-end items-start overflow-hidden">
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
                                    <span className="relative z-10 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-slate-200/90 text-slate-700 text-[10.5px] font-bold px-2.5 py-0.5 rounded-md shadow-2xs">
                                        <ShieldCheck size={12} className="text-orange-500" />
                                        <span>
                                            {player.sport?.name || "Member Atlet"}
                                        </span>
                                    </span>
                                </div>

                                <div className="px-4 pb-3.5 pt-2 sm:pt-2.5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="relative -mt-8 sm:-mt-10 w-14 h-14 sm:w-16 sm:h-16 rounded-md border-[2.5px] border-white shadow-xs overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 font-bold text-lg flex items-center justify-center shrink-0 z-10">
                                                {photo ? (
                                                    <img
                                                        src={photo}
                                                        alt={player.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span>{getInitials(player.name)}</span>
                                                )}
                                            </div>

                                            <div className="space-y-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                                                        {player.name}
                                                    </h2>
                                                    <span className="text-[10.5px] text-slate-400 font-medium">
                                                        {player.username
                                                            ? `@${player.username}`
                                                            : getAthleteCode(player.name)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap mt-0.5">
                                                    {player.sport?.name && (
                                                        <span className="font-bold text-orange-600">
                                                            {player.sport.name}
                                                        </span>
                                                    )}
                                                    <span>
                                                        {player.gender === "P" || player.gender === "female" ? "Perempuan" : "Laki-laki"}
                                                    </span>
                                                    {latestTest?.weight && (
                                                        <span>
                                                            {latestTest.weight} kg
                                                        </span>
                                                    )}
                                                    {latestTest?.height && (
                                                        <span>
                                                            {latestTest.height} cm
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Active Meal Plan Title Header & 7-Day Navigation Bar */}
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                {/* Upper Header: Meal Plan Title & Metadata */}
                                <div className="p-3.5 sm:px-4 sm:py-3 border-b border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                                            {(planToDisplay.title || (planToDisplay.recommendation ? `Rencana Makan Program ${planToDisplay.recommendation.charAt(0).toUpperCase() + planToDisplay.recommendation.slice(1)}` : "Rencana Nutrisi Atlet")).replace(/:\s*/g, " ")}
                                        </h3>
                                        {planToDisplay.start_date && (
                                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                                Periode {new Date(planToDisplay.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                                {planToDisplay.end_date && ` sampai ${new Date(planToDisplay.end_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}`}
                                            </p>
                                        )}
                                    </div>

                                    <div className="text-left sm:text-right shrink-0">
                                        <span className="text-[9px] sm:text-[9.5px] uppercase font-bold text-slate-400 block tracking-wider">
                                            Target Energi
                                        </span>
                                        <span className="text-xs sm:text-sm font-bold text-orange-600">
                                            {(planToDisplay.target_calories || 0).toLocaleString("id-ID")} kkal / hari
                                        </span>
                                    </div>
                                </div>

                                {/* Lower Row: 7-Day Navigation Strip */}
                                <div className="grid grid-cols-7 divide-x divide-slate-100 bg-white">
                                    {days.map((day, idx) => {
                                        const dateObj = new Date(day.date);
                                        const dayNumber = dateObj.getDate();
                                        const dayName = day.day.split(",")[0];
                                        const isToday = day.date === new Date().toISOString().split("T")[0];
                                        const isSelected = activeTab === idx;
                                        const dayKcal = weeklyStats?.perDay?.[idx]?.calories;

                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => {
                                                    setActiveTab(idx);
                                                    if (showTrackingUI) setTrackingDate(day.date);
                                                }}
                                                className={`py-2 px-1 text-center transition-all cursor-pointer flex flex-col items-center justify-center relative ${
                                                    isSelected
                                                        ? "bg-orange-50/40 text-orange-600 font-bold"
                                                        : "hover:bg-slate-50 text-slate-600"
                                                }`}
                                            >
                                                {/* Active top line */}
                                                {isSelected && (
                                                    <span className="absolute top-0 inset-x-0 h-0.5 bg-orange-500" />
                                                )}
                                                <span
                                                    className={`text-[9.5px] sm:text-[10px] uppercase tracking-wider block ${
                                                        isSelected ? "font-bold text-orange-600" : "font-semibold text-slate-400"
                                                    }`}
                                                >
                                                    {dayName}
                                                </span>
                                                <span className={`text-xs sm:text-sm font-bold mt-0.5 ${isSelected ? "text-slate-900" : "text-slate-700"}`}>
                                                    {dayNumber}
                                                </span>
                                                {isToday ? (
                                                    <span className="text-[8.5px] font-bold text-emerald-600 tracking-wide uppercase block">
                                                        Hari Ini
                                                    </span>
                                                ) : (
                                                    <span className="text-[8.5px] opacity-0 select-none block" aria-hidden="true">
                                                        Hari Ini
                                                    </span>
                                                )}
                                                <span className={`text-[9px] sm:text-[9.5px] hidden sm:block ${isSelected ? "text-orange-600 font-semibold" : "text-slate-400"}`}>
                                                    {dayKcal ? Math.round(dayKcal) : Math.round(planToDisplay?.target_calories || targetCalories)} kkal
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 3. Day Schedule Header & Visual Meal Cards Grid */}
                            {(() => {
                                const day = days[activeTab];
                                if (!day) return null;
                                const dayTotals = weeklyStats?.perDay?.[activeTab];
                                const plannedKcal =
                                    dayTotals?.calories ||
                                    (planToDisplay?.target_calories || targetCalories);
                                const targetKcal =
                                    planToDisplay?.target_calories || targetCalories;

                                return (
                                    <div className="space-y-3.5">
                                        {/* Athlete Daily Compliance Bar */}
                                        {showTrackingUI && trackingCompliance && (
                                            <div className="bg-white border border-slate-200/80 rounded-md p-3 shadow-2xs">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-xs font-bold text-slate-700">
                                                        Kepatuhan Makan Hari Ini
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-900">
                                                        {trackingCompliance.score}%
                                                    </span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${trackingCompliance.score}%`,
                                                            background:
                                                                trackingCompliance.score >= 75
                                                                    ? "#10b981"
                                                                    : trackingCompliance.score >= 50
                                                                      ? "#f59e0b"
                                                                      : "#ef4444",
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-3 text-[10.5px]">
                                                    <span className="font-semibold text-emerald-600">
                                                        ✓ Dimakan: {trackingCompliance.eaten}
                                                    </span>
                                                    <span className="font-semibold text-amber-600">
                                                        ↻ Diganti: {trackingCompliance.replaced}
                                                    </span>
                                                    <span className="font-semibold text-slate-500">
                                                        — Lewat: {trackingCompliance.skipped}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Visual Meal Cards Grid (Responsive Multi-Column Cards) */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                            {day.meals.map((meal, mealIdx) => {
                                                const MealIcon = getMealIcon(meal.type);
                                                return (
                                                    <div
                                                        key={mealIdx}
                                                        className="bg-white border border-slate-200/80 rounded-md overflow-hidden shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
                                                    >
                                                        {/* Top Card Header */}
                                                        <div>
                                                            <div className="px-3.5 py-2.5 bg-gradient-to-r from-slate-50 to-orange-50/30 border-b border-slate-100 flex items-center justify-between gap-2">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-6 h-6 rounded-md bg-white border border-slate-200 text-orange-600 flex items-center justify-center shrink-0 shadow-2xs">
                                                                        <MealIcon size={12} />
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                                                            {meal.type}
                                                                        </span>
                                                                        <span className="text-[10px] text-slate-400 font-medium">
                                                                            {meal.time}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-xs font-bold text-slate-800">
                                                                        {meal.calories} kkal
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleRerollMeal(
                                                                                activeTab,
                                                                                mealIdx,
                                                                            )
                                                                        }
                                                                        disabled={isSavingPlan}
                                                                        title="Acak sesi makan ini"
                                                                        className="p-1 text-slate-400 hover:text-orange-600 hover:bg-orange-50 border border-transparent hover:border-orange-200 rounded-md transition-all cursor-pointer disabled:opacity-50"
                                                                    >
                                                                        <RefreshCw size={11} className={isSavingPlan ? "animate-spin" : ""} />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Main Dish Headline & Macros */}
                                                            <div className="p-3.5 border-b border-slate-100 bg-white">
                                                                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                                                                    {createDishTitle(meal.items, meal.menu) || meal.menu || "Menu Seimbang Atlet"}
                                                                </h4>
                                                                <div className="flex items-center gap-3 mt-1 text-[10.5px] text-slate-500 font-medium">
                                                                    <span>Protein <strong className="text-slate-700 font-semibold">{meal.protein}g</strong></span>
                                                                    <span>Karbo <strong className="text-slate-700 font-semibold">{meal.carbs}g</strong></span>
                                                                    <span>Lemak <strong className="text-slate-700 font-semibold">{meal.fats}g</strong></span>
                                                                </div>
                                                            </div>

                                                            {/* Ingredients & Portion Composition */}
                                                            <div className="p-3 bg-slate-50/30">
                                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                                                                    Komposisi & Takaran Porsi
                                                                </span>
                                                                {meal.items && meal.items.length > 0 ? (
                                                                    <div className="space-y-1.5">
                                                                        {meal.items.map((item, iIdx) => (
                                                                            <div
                                                                                key={iIdx}
                                                                                className="flex items-center justify-between text-xs py-0.5"
                                                                            >
                                                                                <span className="font-medium text-slate-800 truncate pr-2">
                                                                                    {item.displayName || item.name}
                                                                                </span>
                                                                                <span className="text-xs font-semibold text-slate-500 shrink-0">
                                                                                    {cleanPortionText(item.scaledPortion || item.portion || "1 porsi", item.displayName || item.name)}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-xs text-slate-600">
                                                                        {meal.menu}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Athlete Tracking UI per Sesi */}
                                                            {showTrackingUI && (
                                                                <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                                                                    {(() => {
                                                                        const sessionStatus = getItemStatus(mealIdx, 0);
                                                                        return (
                                                                            <div className="space-y-2">
                                                                                <div className="flex items-center gap-1.5">
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            const nextStatus = sessionStatus === "eaten" ? null : "eaten";
                                                                                            (meal.items || [{}]).forEach((_, idx) => {
                                                                                                updateTrackingItem(mealIdx, idx, "status", nextStatus);
                                                                                            });
                                                                                        }}
                                                                                        className={`flex-1 inline-flex items-center justify-center gap-1 py-1 px-2 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                                                                            sessionStatus === "eaten"
                                                                                                ? "bg-emerald-500 text-white shadow-2xs"
                                                                                                : "bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
                                                                                        }`}
                                                                                    >
                                                                                        <Check size={10} /> Dimakan
                                                                                    </button>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            const nextStatus = sessionStatus === "replaced" ? null : "replaced";
                                                                                            (meal.items || [{}]).forEach((_, idx) => {
                                                                                                updateTrackingItem(mealIdx, idx, "status", nextStatus);
                                                                                            });
                                                                                        }}
                                                                                        className={`flex-1 inline-flex items-center justify-center gap-1 py-1 px-2 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                                                                            sessionStatus === "replaced"
                                                                                                ? "bg-amber-500 text-white shadow-2xs"
                                                                                                : "bg-white border border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-amber-600"
                                                                                        }`}
                                                                                    >
                                                                                        <RefreshCw size={9} /> Diganti
                                                                                    </button>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            const nextStatus = sessionStatus === "skipped" ? null : "skipped";
                                                                                            (meal.items || [{}]).forEach((_, idx) => {
                                                                                                updateTrackingItem(mealIdx, idx, "status", nextStatus);
                                                                                            });
                                                                                        }}
                                                                                        className={`flex-1 inline-flex items-center justify-center gap-1 py-1 px-2 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                                                                            sessionStatus === "skipped"
                                                                                                ? "bg-slate-500 text-white shadow-2xs"
                                                                                                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                                                                                        }`}
                                                                                    >
                                                                                        <X size={10} /> Lewat
                                                                                    </button>
                                                                                </div>

                                                                                {sessionStatus === "replaced" && (
                                                                                    <input
                                                                                        type="text"
                                                                                        placeholder="Menu pengganti yang dimakan..."
                                                                                        value={getItemReplacement(mealIdx, 0)}
                                                                                        onChange={(e) => {
                                                                                            (meal.items || [{}]).forEach((_, idx) => {
                                                                                                updateTrackingItem(mealIdx, idx, "replacement", e.target.value);
                                                                                            });
                                                                                        }}
                                                                                        onBlur={() => saveTrackingData(trackingState)}
                                                                                        className="w-full bg-white border border-amber-200 rounded-md px-2.5 py-1 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:ring-1 focus:ring-amber-400"
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* ═══════════════════════════════════════════════════════
                            KOLOM KANAN (4 Kolom di LG) — Ringkasan Makro & Panduan
                           ═══════════════════════════════════════════════════════ */}
                        <div className="lg:col-span-4 space-y-3.5">
                            {/* 1. Target Nutrisi & Makronutrisi */}
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                {/* Header */}
                                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                                    <h3 className="text-xs font-bold text-slate-900">
                                        Target Kalori & Makronutrisi
                                    </h3>
                                    <span className="text-xs font-semibold text-slate-500 capitalize">
                                        {planToDisplay.recommendation ? `Program ${planToDisplay.recommendation}` : "Program Nutrisi"}
                                    </span>
                                </div>

                                <div className="p-3.5 space-y-3.5">
                                    {/* Daily Energy Highlight Box */}
                                    <div className="p-3 rounded-md bg-white border border-slate-200/80 shadow-2xs">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">
                                                    Target Energi Harian
                                                </span>
                                                <div className="flex items-baseline gap-1 mt-0.5">
                                                    <span className="text-2xl font-black tracking-tight leading-none text-slate-900">
                                                        {(planToDisplay.target_calories || 0).toLocaleString("id-ID")}
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
                                                    {(weeklyStats?.total.calories || (planToDisplay.target_calories || 0) * 7).toLocaleString("id-ID")}{" "}
                                                    <span className="text-[10px] text-slate-400 font-normal">
                                                        kkal
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3 Macro Columns (Protein, Lemak, Karbo) */}
                                    <div className="space-y-1.5">
                                        <span className="text-[11px] font-bold text-slate-700 block">
                                            Distribusi Makronutrisi Harian
                                        </span>

                                        <div className="grid grid-cols-3 gap-2">
                                            {/* Protein */}
                                            {(() => {
                                                const protGrams = planToDisplay.protein_target || planToDisplay.macro_plan?.protein?.grams || 0;
                                                return (
                                                    <div className="bg-white border border-slate-200/80 rounded-md p-2 text-center shadow-2xs">
                                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                                                            Protein
                                                        </span>
                                                        <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                                                            <span className="text-base font-black text-slate-900">
                                                                {protGrams}
                                                            </span>
                                                            <span className="text-[9px] font-bold text-slate-400">
                                                                g
                                                            </span>
                                                        </div>
                                                        <span className="text-[8.5px] text-slate-400 font-medium block">
                                                            {Math.round(protGrams * 4)} kkal
                                                        </span>
                                                    </div>
                                                );
                                            })()}

                                            {/* Lemak */}
                                            {(() => {
                                                const fatGrams = planToDisplay.fats_target || planToDisplay.macro_plan?.fats?.grams || 0;
                                                return (
                                                    <div className="bg-white border border-slate-200/80 rounded-md p-2 text-center shadow-2xs">
                                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                                                            Lemak
                                                        </span>
                                                        <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                                                            <span className="text-base font-black text-slate-900">
                                                                {fatGrams}
                                                            </span>
                                                            <span className="text-[9px] font-bold text-slate-400">
                                                                g
                                                            </span>
                                                        </div>
                                                        <span className="text-[8.5px] text-slate-400 font-medium block">
                                                            {Math.round(fatGrams * 9)} kkal
                                                        </span>
                                                    </div>
                                                );
                                            })()}

                                            {/* Karbo */}
                                            {(() => {
                                                const carbGrams = planToDisplay.carbs_target || planToDisplay.macro_plan?.carbs?.grams || 0;
                                                return (
                                                    <div className="bg-white border border-slate-200/80 rounded-md p-2 text-center shadow-2xs">
                                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                                                            Karbo
                                                        </span>
                                                        <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                                                            <span className="text-base font-black text-slate-900">
                                                                {carbGrams}
                                                            </span>
                                                            <span className="text-[9px] font-bold text-slate-400">
                                                                g
                                                            </span>
                                                        </div>
                                                        <span className="text-[8.5px] text-slate-400 font-medium block">
                                                            {Math.round(carbGrams * 4)} kkal
                                                        </span>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Coach Compliance Dashboard */}
                            {!isAthlete && complianceSummary && complianceSummary.tracked_days > 0 && (
                                <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xs font-bold text-slate-900 leading-tight">
                                                Kepatuhan Nutrisi Atlet
                                            </h3>
                                            <p className="text-[10px] text-slate-400 font-medium">
                                                {complianceSummary.tracked_days} hari laporan tercatat
                                            </p>
                                        </div>
                                        <ComplianceRing score={complianceSummary.avg_score} size={36} />
                                    </div>

                                    <div className="p-3">
                                        <div className="grid grid-cols-7 gap-1">
                                            {complianceSummary.daily.map((day, idx) => {
                                                const date = new Date(day.date);
                                                const dayName = date.toLocaleDateString("id-ID", {
                                                    weekday: "short",
                                                });
                                                const dayNum = date.getDate();
                                                return (
                                                    <div
                                                        key={idx}
                                                        className="flex flex-col items-center gap-0.5 p-1 rounded-md bg-slate-50/70 border border-slate-100 text-center"
                                                    >
                                                        <span className="text-[8.5px] font-semibold text-slate-400 uppercase">
                                                            {dayName}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-700">
                                                            {dayNum}
                                                        </span>
                                                        <div className="w-full h-1 rounded-full overflow-hidden bg-slate-200 my-0.5">
                                                            <div
                                                                className="h-full rounded-full"
                                                                style={{
                                                                    width: `${day.score}%`,
                                                                    background:
                                                                        day.score >= 75
                                                                            ? "#10b981"
                                                                            : day.score >= 50
                                                                              ? "#f59e0b"
                                                                              : "#ef4444",
                                                                }}
                                                            />
                                                        </div>
                                                        <span
                                                            className={`text-[8.5px] font-bold ${
                                                                day.score >= 75
                                                                    ? "text-emerald-600"
                                                                    : day.score >= 50
                                                                      ? "text-amber-600"
                                                                      : "text-rose-600"
                                                                }`}
                                                        >
                                                            {Math.round(day.score)}%
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 3. Meal Plan History Selector Card */}
                            {history.length > 1 && (
                                <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                        <h3 className="text-xs font-bold text-slate-800">
                                            Riwayat Rencana Makan ({history.length})
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowHistoryPanel(!showHistoryPanel)
                                            }
                                            className="text-[10.5px] font-semibold text-slate-500 hover:text-orange-600 flex items-center gap-1 transition-colors cursor-pointer"
                                        >
                                            {showHistoryPanel ? "Ringkas" : "Semua"}
                                            <ChevronDown
                                                size={11}
                                                className={`transition-transform ${
                                                    showHistoryPanel ? "rotate-180" : ""
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto custom-scrollbar">
                                        {(showHistoryPanel ? history : history.slice(0, 3)).map(
                                            (plan) => {
                                                const isCurrent = plan.id === (activePlan?.id || selectedPlanId);
                                                return (
                                                    <div
                                                        key={plan.id}
                                                        onClick={() => {
                                                            setSelectedPlanId(plan.id);
                                                            setActiveTab(0);
                                                        }}
                                                        className="w-full flex items-center justify-between px-3.5 py-2.5 transition-colors text-left cursor-pointer group hover:bg-slate-50/70"
                                                    >
                                                        <div className="min-w-0 flex-1 pr-2">
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className={`text-xs font-bold ${
                                                                        isCurrent
                                                                            ? "text-orange-600"
                                                                            : "text-slate-800 group-hover:text-slate-900"
                                                                    }`}
                                                                >
                                                                    {plan.recommendation
                                                                        ? plan.recommendation.charAt(0).toUpperCase() +
                                                                          plan.recommendation.slice(1)
                                                                        : "Rencana Nutrisi"}
                                                                </span>
                                                                <span
                                                                    className={`text-[10px] font-semibold ${
                                                                        plan.status === "active"
                                                                            ? "text-emerald-600"
                                                                            : "text-slate-400"
                                                                    }`}
                                                                >
                                                                    {plan.status === "active" ? "Aktif" : "Selesai"}
                                                                </span>
                                                            </div>
                                                            <span className="text-[10.5px] text-slate-400 block mt-0.5 font-medium">
                                                                {plan.start_date
                                                                    ? new Date(plan.start_date).toLocaleDateString("id-ID", {
                                                                          day: "numeric",
                                                                          month: "short",
                                                                          year: "numeric",
                                                                      })
                                                                    : new Date(plan.created_at).toLocaleDateString("id-ID", {
                                                                          day: "numeric",
                                                                          month: "short",
                                                                          year: "numeric",
                                                                      })}
                                                                {plan.target_calories ? `, ${plan.target_calories} kkal` : ""}
                                                            </span>
                                                        </div>

                                                        {!isAthlete && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(plan.id);
                                                                }}
                                                                title="Hapus rencana makan ini"
                                                                className="p-1 text-slate-300 hover:text-red-600 rounded-md transition-colors cursor-pointer shrink-0"
                                                            >
                                                                <Trash2 size={13} />
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    !isDraft && (
                        <div className="bg-white rounded-xl border border-slate-200/80 py-16 flex flex-col items-center justify-center shadow-2xs">
                            <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mb-3">
                                <Activity className="text-slate-400" size={24} />
                            </div>
                            <h3 className="text-sm font-bold text-slate-800">
                                Belum Ada Rencana Makan
                            </h3>
                            <p className="text-slate-400 text-xs mt-1 max-w-sm text-center">
                                {isAthlete
                                    ? "Anda belum memiliki rencana makan aktif. Silakan hubungi pelatih Anda."
                                    : "Gunakan tombol Buat Rencana Baru di atas untuk menghasilkan rancangan otomatis."}
                            </p>
                        </div>
                    )
                )}

                {/* ── Generator Modal ── */}
                <Modal
                    show={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    maxWidth="2xl"
                >
                    <div className="bg-white overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
                                    <UtensilsIcon size={14} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900">
                                        Meal Plan Generator
                                    </h3>
                                    <p className="text-[10.5px] text-slate-500">
                                        Atur preferensi makro dan hasilkan menu diet otomatis.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 sm:p-5 overflow-y-auto max-h-[75vh] space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200/80">
                                    <label className="block text-[10.5px] font-bold text-slate-600 mb-2">
                                        1. Target Program
                                    </label>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {["cutting", "maintenance", "bulking"].map((g) => (
                                            <button
                                                key={g}
                                                onClick={() => setSelectedGoal(g)}
                                                className={`py-1.5 px-2 rounded-md text-[11px] font-bold transition-all border cursor-pointer ${
                                                    selectedGoal === g
                                                        ? "bg-orange-500 border-orange-500 text-white shadow-2xs"
                                                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                                }`}
                                            >
                                                <span className="capitalize">{g}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200/80 flex gap-3">
                                    <div className="flex-1">
                                        <label className="block text-[10.5px] font-bold text-slate-600 mb-2">
                                            2. Tanggal Mulai
                                        </label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div className="w-28 shrink-0 bg-orange-500 text-white rounded-lg flex flex-col items-center justify-center p-2 text-center">
                                        <span className="text-[9px] font-semibold uppercase text-orange-100">
                                            Target
                                        </span>
                                        <span className="text-base font-black leading-tight">
                                            {targetCalories}
                                        </span>
                                        <span className="text-[9px] text-orange-100">
                                            kcal/hari
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {!latestTest && (
                                <div className="bg-amber-50 border border-amber-200/80 rounded-lg p-2.5 flex items-center gap-2">
                                    <Info size={14} className="text-amber-600 shrink-0" />
                                    <p className="text-xs text-amber-700">
                                        Atlet belum memiliki data Komposisi Tubuh. Kalori menggunakan estimasi standar.
                                    </p>
                                </div>
                            )}

                            {/* 7-Day Split Dist */}
                            <div className="bg-slate-50/70 border border-slate-200/80 rounded-lg p-3">
                                <label className="block text-[10.5px] font-bold text-slate-600 mb-2.5">
                                    3. Distribusi Karbohidrat (7 Hari)
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {weekDays.map((day, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white border border-slate-200/80 rounded-md p-2 text-center"
                                        >
                                            <span className="text-[9.5px] font-semibold text-slate-400 uppercase block">
                                                {day.label.split(",")[0]}
                                            </span>
                                            <span className="text-xs font-bold text-slate-800 block mb-1.5">
                                                {day.label.split(",")[1]?.trim()}
                                            </span>
                                            <select
                                                value={dailySplits[idx]}
                                                onChange={(e) => handleSplitChange(idx, e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded text-[10.5px] font-semibold text-slate-700 py-1 px-1.5 focus:ring-1 focus:ring-orange-500 cursor-pointer"
                                            >
                                                {DIET_OPTIONS.map((o) => (
                                                    <option key={o.value} value={o.value}>
                                                        {o.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md text-xs transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleGenerate}
                                    disabled={!startDate}
                                    className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-md text-xs shadow-2xs transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Target size={13} />
                                    <span>Hasilkan Rencana</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>

                {/* ── Draft Modal ── */}
                <Modal
                    show={isDraft && !!planToDisplay}
                    onClose={() => setDraftPlan(null)}
                    maxWidth="4xl"
                >
                    {isDraft && planToDisplay && (
                        <div className="bg-white overflow-hidden flex flex-col max-h-[85vh]">
                            {/* Draft Banner */}
                            <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-4 text-white flex items-center justify-between gap-3 shrink-0">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 bg-white/20 rounded-md">
                                        <Info size={16} />
                                    </div>
                                    <div>
                                        <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
                                            Draft Rencana Makan Baru
                                        </h3>
                                        <p className="text-[10.5px] text-orange-100">
                                            Tinjau rancangan menu sebelum disimpan permanen.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setDraftPlan(null)}
                                        className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-md text-xs font-semibold transition-colors cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleSavePlan}
                                        className="px-3.5 py-1.5 bg-white hover:bg-orange-50 text-orange-600 rounded-md text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                                    >
                                        <Save size={13} />
                                        <span>Simpan Rencana</span>
                                    </button>
                                </div>
                            </div>

                            {/* Scrollable Draft Content */}
                            <div className="p-4 sm:p-5 overflow-y-auto bg-slate-50/40 flex-1 min-h-0">
                                <div className="p-4 bg-white rounded-xl border border-slate-200">
                                    <p className="text-xs text-slate-500 mb-4">
                                        Target Kalori: <b>{planToDisplay?.target_calories || "-"} kcal</b>
                                    </p>
                                    {days.map((day, dIdx) => (
                                        <div key={dIdx} className="mb-4 border-b border-slate-100 pb-3">
                                            <h4 className="text-xs font-bold text-slate-800 mb-2">{day.day}</h4>
                                            <div className="space-y-2">
                                                {day.meals?.map((m, mIdx) => (
                                                    <div key={mIdx} className="bg-slate-50 p-2 rounded text-xs">
                                                        <span className="font-bold text-orange-600 mr-2">{m.time} - {m.type}:</span>
                                                        <span className="text-slate-700">{m.items?.map(i => i.name).join(", ") || m.menu}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>

            <PageFooter />
        </AppLayout>
    );
}

// Minimal icon helper
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
