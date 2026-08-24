import React, { useState, useMemo } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PageHeader from "@/Components/Common/PageHeader";
import {
    ChevronLeft,
    Save,
    Clock,
    Activity,
    HeartPulse,
    Check,
    ArrowRight,
    Flame,
    AlertCircle,
    CheckCircle2,
    Info
} from "lucide-react";
import BodyHighlighter from "@/Components/BodyHighlighter";

const MUSCLE_PAIN_AREAS = [
    "Neck (L)", "Neck (R)",
    "Trapezius (L)", "Trapezius (R)",
    "Front Deltoids (L)", "Front Deltoids (R)",
    "Back Deltoids (L)", "Back Deltoids (R)",
    "Chest (L)", "Chest (R)",
    "Upper Back (L)", "Upper Back (R)",
    "Lower Back (L)", "Lower Back (R)",
    "Rectus Abdominis (L)", "Rectus Abdominis (R)",
    "Obliques (L)", "Obliques (R)",
    "Biceps (L)", "Biceps (R)",
    "Triceps (L)", "Triceps (R)",
    "Forearm (L)", "Forearm (R)",
    "Gluteal (L)", "Gluteal (R)",
    "Abductors (L)", "Abductors (R)",
    "Quadriceps (L)", "Quadriceps (R)",
    "Hamstring (L)", "Hamstring (R)",
    "Knees (L)", "Knees (R)",
    "Calves (L)", "Calves (R)",
    "Ankles (L)", "Ankles (R)",
    "Head"
];

const RPE_DESCRIPTIONS = {
    1: { label: "Sangat Ringan", tag: "Rest / Very Light" },
    2: { label: "Sangat Ringan", tag: "Easy" },
    3: { label: "Ringan", tag: "Moderate Light" },
    4: { label: "Ringan", tag: "Light" },
    5: { label: "Sedang", tag: "Moderate" },
    6: { label: "Sedang", tag: "Hard Working" },
    7: { label: "Berat", tag: "Hard" },
    8: { label: "Berat", tag: "Very Hard" },
    9: { label: "Maksimal", tag: "Near Maximal" },
    10: { label: "Maksimal", tag: "Maximal" },
};

export default function SessionForm({
    auth,
    date,
    log,
    redirectTo,
    mode = "all",
    training_id,
    isCompleted = false,
    athlete_id = null,
}) {
    // Wellness is locked when completed, RPE is always editable
    const isWellnessLocked = isCompleted && (mode === "all" || mode === "wellness");
    
    const { data, setData, post, processing, errors, transform } = useForm({
        date: date,
        session_type: "am",
        rpe: log?.am_rpe || "",
        duration: log?.am_duration || "",

        // Wellness fields
        quality_of_sleep: log?.quality_of_sleep || "",
        stress: log?.stress || "",
        fatigue: log?.fatigue || "",
        muscle_soreness: log?.muscle_soreness || "",
        motivation: log?.motivation || "",
        mood_state: log?.mood_state || "",

        muscle_pain_areas: log?.muscle_pain_areas || [],
        other_pain: "",
        redirect_to: redirectTo || "",
        athlete_id: athlete_id,
    });

    const [rpeError, setRpeError] = useState('');

    // Initial load for "Other" text if it was saved before
    React.useEffect(() => {
        if (log?.muscle_pain_areas && Array.isArray(log.muscle_pain_areas)) {
            const otherArea = log.muscle_pain_areas.find((a) =>
                a.startsWith("Other: "),
            );
            if (otherArea) {
                setData("other_pain", otherArea.replace("Other: ", ""));
            }
        }
    }, [log]);

    const handleSessionTypeChange = (type) => {
        setData((data) => ({
            ...data,
            session_type: type,
            rpe: type === "am" ? log?.am_rpe || "" : log?.pm_rpe || "",
            duration: type === "am" ? log?.am_duration || "" : log?.pm_duration || "",
        }));
    };

    const togglePainArea = (area) => {
        if (isWellnessLocked) return;
        setData(
            "muscle_pain_areas",
            data.muscle_pain_areas.includes(area)
                ? data.muscle_pain_areas.filter((a) => a !== area)
                : [...data.muscle_pain_areas, area],
        );
    };

    const submit = (e) => {
        e.preventDefault();
        setRpeError('');

        transform((data) => {
            let finalAreas = data.muscle_pain_areas.filter(
                (a) => !a.startsWith("Other: "),
            );
            if (data.other_pain.trim() !== "") {
                finalAreas.push(`Other: ${data.other_pain.trim()}`);
            }
            return {
                ...data,
                muscle_pain_areas: finalAreas,
            };
        });

        post(route("admin.wellness-rpe.store-session"));
    };

    const isWellnessComplete = 
        data.quality_of_sleep && 
        data.stress && 
        data.fatigue && 
        data.muscle_soreness && 
        data.motivation && 
        data.mood_state;

    const isRpeComplete = data.rpe && data.duration;

    const calculatedLoad = useMemo(() => {
        const r = parseFloat(data.rpe);
        const d = parseFloat(data.duration);
        if (!isNaN(r) && !isNaN(d) && r > 0 && d > 0) {
            return Math.round(r * d);
        }
        return 0;
    }, [data.rpe, data.duration]);

    const isSubmitDisabled = processing 
        || (mode === 'wellness' && isWellnessLocked)
        || ((mode === 'all' || mode === 'wellness') && !isWellnessComplete && !isWellnessLocked);

    // Formatted date string
    const formattedDate = new Date(date).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const renderScaleButtons = (field, label, leftLabel, rightLabel) => {
        const levels = [
            { num: 1, text: "Sangat Baik", selectedBg: "bg-emerald-500 text-white border-emerald-600 shadow-xs" },
            { num: 2, text: "Baik", selectedBg: "bg-sky-500 text-white border-sky-600 shadow-xs" },
            { num: 3, text: "Normal", selectedBg: "bg-amber-500 text-white border-amber-600 shadow-xs" },
            { num: 4, text: "Buruk", selectedBg: "bg-orange-500 text-white border-orange-600 shadow-xs" },
            { num: 5, text: "Sangat Buruk", selectedBg: "bg-rose-500 text-white border-rose-600 shadow-xs" },
        ];

        const selectedVal = data[field];

        return (
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 tracking-tight">
                        {label}
                    </label>
                    {selectedVal && (
                        <span className="text-[10.5px] font-bold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                            Skor: {selectedVal}
                        </span>
                    )}
                </div>

                <div className="flex justify-between text-[9.5px] font-semibold text-slate-400 px-0.5">
                    <span>1: {leftLabel}</span>
                    <span>5: {rightLabel}</span>
                </div>

                <div className="grid grid-cols-5 gap-1">
                    {levels.map((lvl) => {
                        const isSelected = selectedVal === lvl.num;
                        return (
                            <button
                                key={lvl.num}
                                type="button"
                                disabled={isWellnessLocked}
                                onClick={() => {
                                    if (isWellnessLocked) return;
                                    setData(field, lvl.num);
                                }}
                                className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-md border text-xs font-bold transition-all cursor-pointer ${
                                    isSelected
                                        ? lvl.selectedBg
                                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                } ${isWellnessLocked ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                <span className="text-sm font-black leading-none">{lvl.num}</span>
                                <span className={`text-[8.5px] mt-0.5 font-medium truncate max-w-full ${isSelected ? 'text-white/90' : 'text-slate-400'}`}>
                                    {lvl.text}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <AppLayout
            user={auth.user}
            title={`Wellness & RPE - ${formattedDate}`}
        >
            <Head title={`Wellness & RPE - ${formattedDate}`} />

            <div className="space-y-4 pb-16">
                {/* ─── 1. PAGE HEADER ─── */}
                <PageHeader 
                    title="Wellness & RPE Harian"
                    description={`Catat metrik pemulihan (Wellness) dan beban latihan untuk ${formattedDate}.`}
                    actions={
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    if (redirectTo) {
                                        window.location.href = redirectTo;
                                    } else {
                                        window.location.href = route("admin.wellness-rpe.index");
                                    }
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                            >
                                <ChevronLeft size={14} /> Kembali
                            </button>

                            {training_id && (
                                <Link
                                    href={route("admin.individual-trainings.show", training_id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-md text-xs font-bold hover:bg-orange-600 transition-colors shadow-2xs"
                                >
                                    <span>Program Latihan</span>
                                    <ArrowRight size={13} />
                                </Link>
                            )}
                        </div>
                    }
                />

                <form onSubmit={submit} className="space-y-4">
                    {/* ─── 2. 2-COLUMN LAYOUT: KIRI & KANAN ─── */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                        {/* ─── LEFT COLUMN ─── */}
                        <div className="lg:col-span-7 space-y-4">
                            {/* WELLNESS SCALES (If mode === all or mode === wellness) */}
                            {(mode === "all" || mode === "wellness") && (
                                <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                        <div>
                                            <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                                                1. Evaluasi Parameter Wellness
                                            </h2>
                                            <p className="text-[11px] text-slate-500 font-medium">
                                                Isi 6 parameter fisik & mental pagi ini (Skala 1–5)
                                            </p>
                                        </div>
                                        {isWellnessComplete && (
                                            <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                <CheckCircle2 size={11} className="text-emerald-600" />
                                                Lengkap
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-3.5 sm:p-4 space-y-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            {renderScaleButtons(
                                                "quality_of_sleep",
                                                "Kualitas Tidur (Sleep)",
                                                "Sangat Baik",
                                                "Sangat Buruk",
                                            )}
                                            {renderScaleButtons(
                                                "fatigue",
                                                "Tingkat Kelelahan (Fatigue)",
                                                "Sangat Bugar",
                                                "Sangat Lelah",
                                            )}
                                            {renderScaleButtons(
                                                "muscle_soreness",
                                                "Nyeri Otot (Soreness)",
                                                "Tidak Nyeri",
                                                "Sangat Nyeri",
                                            )}
                                            {renderScaleButtons(
                                                "stress",
                                                "Tingkat Stres (Stress)",
                                                "Sangat Tenang",
                                                "Sangat Stres",
                                            )}
                                            {renderScaleButtons(
                                                "motivation",
                                                "Motivasi (Motivation)",
                                                "Sangat Tinggi",
                                                "Sangat Rendah",
                                            )}
                                            {renderScaleButtons(
                                                "mood_state",
                                                "Kondisi Mood (Mood)",
                                                "Sangat Positif",
                                                "Sangat Negatif",
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* RPE SECTION (If mode === rpe) */}
                            {mode === "rpe" && (
                                <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                        <div>
                                            <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                                                Skala Intensitas RPE Latihan
                                            </h2>
                                            <p className="text-[11px] text-slate-500 font-medium">
                                                Pilih nilai RPE (1–10 Skala Borg CR-10)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-4">
                                        {/* Waktu Sesi Toggle */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700">
                                                Waktu Sesi Latihan
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleSessionTypeChange("am")}
                                                    className={`py-2 px-3 rounded-md border text-xs font-bold transition-all cursor-pointer ${
                                                        data.session_type === "am"
                                                            ? "bg-orange-500 text-white border-orange-600 shadow-2xs"
                                                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                                    }`}
                                                >
                                                    Sesi Pagi (AM)
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSessionTypeChange("pm")}
                                                    className={`py-2 px-3 rounded-md border text-xs font-bold transition-all cursor-pointer ${
                                                        data.session_type === "pm"
                                                            ? "bg-orange-500 text-white border-orange-600 shadow-2xs"
                                                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                                    }`}
                                                >
                                                    Sesi Sore / Malam (PM)
                                                </button>
                                            </div>
                                        </div>

                                        {/* RPE 1-10 Grid */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-bold text-slate-900">
                                                    Pilih Angka RPE (1–10)
                                                </label>
                                                {data.rpe && (
                                                    <span className="text-[11px] font-bold text-slate-700">
                                                        Terpilih: {data.rpe} ({RPE_DESCRIPTIONS[data.rpe]?.label})
                                                    </span>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-5 gap-1.5">
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                                                    const isSelected = parseInt(data.rpe) === num;
                                                    return (
                                                        <button
                                                            key={num}
                                                            type="button"
                                                            onClick={() => setData("rpe", num)}
                                                            className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-md border text-xs font-bold transition-all cursor-pointer ${
                                                                isSelected
                                                                    ? "bg-orange-500 text-white border-orange-600 shadow-xs ring-2 ring-orange-300 ring-offset-1"
                                                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                                            }`}
                                                        >
                                                            <span className="text-base font-black leading-none">{num}</span>
                                                            <span className="text-[9px] mt-1 truncate opacity-75 font-medium">
                                                                {num <= 2 ? 'Santai' : num <= 4 ? 'Ringan' : num <= 6 ? 'Sedang' : num <= 8 ? 'Berat' : 'Maks'}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ─── RIGHT COLUMN ─── */}
                        <div className="lg:col-span-5 space-y-4">
                            {/* BODY HIGHLIGHTER / PAIN AREAS (If mode === all or mode === wellness) */}
                            {(mode === "all" || mode === "wellness") && (
                                <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                        <div>
                                            <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                                                2. Area Nyeri & Keluhan Otot
                                            </h2>
                                            <p className="text-[11px] text-slate-500 font-medium">
                                                Pilih titik nyeri pada tubuh bila ada (Opsional)
                                            </p>
                                        </div>
                                        {data.muscle_pain_areas.length > 0 && (
                                            <span className="text-[10.5px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.2 rounded">
                                                {data.muscle_pain_areas.length} Area
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-3.5 sm:p-4 space-y-3">
                                        {/* Anterior & Posterior Model */}
                                        <div className="rounded-md border border-slate-200/80 bg-slate-50/50 p-2.5 flex items-center justify-around">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[9px] font-bold text-slate-400 tracking-wider mb-1">DEPAN (ANTERIOR)</span>
                                                <div className="w-[125px]">
                                                    <BodyHighlighter type="anterior" selectedAreas={data.muscle_pain_areas} onSelectArea={togglePainArea} />
                                                </div>
                                            </div>
                                            <div className="w-px h-28 bg-slate-200" />
                                            <div className="flex flex-col items-center">
                                                <span className="text-[9px] font-bold text-slate-400 tracking-wider mb-1">BELAKANG (POSTERIOR)</span>
                                                <div className="w-[125px]">
                                                    <BodyHighlighter type="posterior" selectedAreas={data.muscle_pain_areas} onSelectArea={togglePainArea} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pain Area Tags Grid */}
                                        <div className="grid grid-cols-2 gap-1.5 max-h-[170px] overflow-y-auto pr-1 custom-scrollbar">
                                            {MUSCLE_PAIN_AREAS.map((area) => {
                                                const isSelected = data.muscle_pain_areas.includes(area);
                                                return (
                                                    <button
                                                        key={area}
                                                        type="button"
                                                        disabled={isWellnessLocked}
                                                        onClick={() => togglePainArea(area)}
                                                        className={`flex items-center gap-1.5 p-1.5 rounded-md border text-left text-xs font-semibold transition-all cursor-pointer ${
                                                            isSelected
                                                                ? "bg-orange-500 border-orange-500 text-white shadow-2xs"
                                                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                                        } ${isWellnessLocked ? 'cursor-not-allowed opacity-50' : ''}`}
                                                    >
                                                        <div className={`w-3 h-3 rounded border flex items-center justify-center shrink-0 ${
                                                            isSelected ? "bg-white border-white text-orange-600" : "bg-slate-50 border-slate-300"
                                                        }`}>
                                                            {isSelected && <Check size={8} strokeWidth={4} />}
                                                        </div>
                                                        <span className="text-[10px] truncate leading-tight">{area}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Sebutkan titik nyeri lainnya bila ada..."
                                                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-hidden transition-all"
                                                value={data.other_pain}
                                                onChange={(e) => setData("other_pain", e.target.value)}
                                                disabled={isWellnessLocked}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* RPE SECTION (If mode === all) */}
                            {mode === "all" && (
                                <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                        <div>
                                            <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                                                3. RPE Sesi Latihan
                                            </h2>
                                            <p className="text-[11px] text-slate-500 font-medium">
                                                Intensitas (1–10) & durasi latihan
                                            </p>
                                        </div>
                                        {calculatedLoad > 0 && (
                                            <span className="text-[10.5px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-1.5 py-0.2 rounded">
                                                {calculatedLoad} AU
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-3.5 sm:p-4 space-y-3">
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleSessionTypeChange("am")}
                                                className={`py-1.5 px-2.5 rounded-md border text-xs font-bold transition-all cursor-pointer ${
                                                    data.session_type === "am"
                                                        ? "bg-orange-500 text-white border-orange-600 shadow-2xs"
                                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                                }`}
                                            >
                                                Sesi Pagi (AM)
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleSessionTypeChange("pm")}
                                                className={`py-1.5 px-2.5 rounded-md border text-xs font-bold transition-all cursor-pointer ${
                                                    data.session_type === "pm"
                                                        ? "bg-orange-500 text-white border-orange-600 shadow-2xs"
                                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                                }`}
                                            >
                                                Sesi Sore (PM)
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-5 gap-1">
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                                                const isSelected = parseInt(data.rpe) === num;
                                                return (
                                                    <button
                                                        key={num}
                                                        type="button"
                                                        onClick={() => setData("rpe", num)}
                                                        className={`py-1.5 rounded-md border text-xs font-bold transition-all cursor-pointer ${
                                                            isSelected
                                                                ? "bg-orange-500 text-white border-orange-600 shadow-xs ring-1 ring-orange-300"
                                                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        {num}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                                Durasi Latihan (Menit)
                                            </label>
                                            <div className="relative">
                                                <Clock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={data.duration}
                                                    onChange={(e) => setData("duration", e.target.value)}
                                                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold text-slate-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-hidden"
                                                    placeholder="Contoh: 60"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* RPE DURATION & LIVE CALCULATOR (If mode === rpe) */}
                            {mode === "rpe" && (
                                <div className="space-y-4">
                                    <div className="bg-white rounded-md border border-slate-200/80 p-3.5 shadow-2xs space-y-3">
                                        <div>
                                            <label className="text-xs font-bold text-slate-900 block mb-1">
                                                Durasi Latihan (Menit)
                                            </label>
                                            <div className="relative">
                                                <Clock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={data.duration}
                                                    onChange={(e) => setData("duration", e.target.value)}
                                                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold text-slate-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-hidden transition-all"
                                                    placeholder="Contoh: 60"
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 border border-slate-200/80 rounded-md p-3 text-center">
                                            <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                                                Kalkulasi Beban Latihan
                                            </span>
                                            <div className="flex items-baseline justify-center gap-1">
                                                <span className="text-2xl font-black text-slate-900">
                                                    {calculatedLoad > 0 ? calculatedLoad.toLocaleString('id-ID') : '0'}
                                                </span>
                                                <span className="text-xs font-bold text-orange-600">AU</span>
                                            </div>
                                            <p className="text-[9.5px] text-slate-400 font-medium mt-0.5">
                                                Formula: RPE ({data.rpe || 0}) × {data.duration || 0} menit
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* RPE Error Alert */}
                            {rpeError && (
                                <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                                    <AlertCircle size={14} className="text-rose-600 shrink-0" />
                                    <span>{rpeError}</span>
                                </div>
                            )}

                            {/* Action Submission Card */}
                            <div className="bg-white rounded-md border border-slate-200/80 p-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                                <Link
                                    href={redirectTo || route("admin.wellness-rpe.index")}
                                    className="w-full sm:w-auto text-center px-3.5 py-2 bg-white text-slate-700 border border-slate-200 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs"
                                >
                                    Batal
                                </Link>

                                <button
                                    type="submit"
                                    disabled={isSubmitDisabled}
                                    onClick={() => {
                                        if ((mode === 'all' || mode === 'rpe') && !isRpeComplete) {
                                            setRpeError('Harap mengisi RPE (1-10) dan durasi latihan minimal di salah satu sesi.');
                                        }
                                    }}
                                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-md font-bold text-xs transition-all shadow-2xs cursor-pointer ${
                                        isSubmitDisabled 
                                            ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                                            : "bg-orange-500 text-white hover:bg-orange-600"
                                    }`}
                                >
                                    <Save size={13} />
                                    <span>{processing ? 'Menyimpan...' : 'Simpan Log Harian'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
