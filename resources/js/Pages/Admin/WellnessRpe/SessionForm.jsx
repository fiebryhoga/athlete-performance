import React, { useState } from "react";

import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Save,
    Clock,
    Activity,
    HeartPulse,
    CheckSquare,
    ArrowRight,
} from "lucide-react";
import BodyHighlighter from "@/Components/BodyHighlighter";
import PageHeader from "@/Components/Layout/PageHeader";

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

export default function SessionForm({
    auth,
    date,
    log,
    redirectTo,
    mode = "all",
    training_id,
    isCompleted = false,
}) {
    
    // Wellness is locked when completed, RPE is always editable
    const isWellnessLocked = isCompleted && (mode === "all" || mode === "wellness");
    const isRpeLocked = false; // RPE is never locked
    const { data, setData, post, processing, errors, transform } = useForm({
        date: date,
        session_type: "am",
        rpe: log?.am_rpe || "",
        duration: log?.am_duration || "",

        // Wellness
        quality_of_sleep: log?.quality_of_sleep || "",
        stress: log?.stress || "",
        fatigue: log?.fatigue || "",
        muscle_soreness: log?.muscle_soreness || "",

        muscle_pain_areas: log?.muscle_pain_areas || [],
        other_pain: "", // Temporary field to handle "Other:" text
        redirect_to: redirectTo || "",
    });

    const [isWellnessExpanded, setIsWellnessExpanded] = useState(
        mode === "all" || mode === "wellness",
    );
    const [isRpeExpanded, setIsRpeExpanded] = useState(
        mode === "all" || mode === "rpe",
    );

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
            duration:
                type === "am" ? log?.am_duration || "" : log?.pm_duration || "",
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

        if ((mode === 'all' || mode === 'rpe') && !isRpeComplete) {
            setRpeError('Wajib mengisi RPE & Duration minimal di salah satu sesi (AM/PM).');
            return;
        }
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

    const isWellnessComplete = data.quality_of_sleep && data.stress && data.fatigue && data.muscle_soreness;

    // RPE validation: current session RPE & Duration must be filled
    const isRpeComplete = data.rpe && data.duration;

    const [rpeError, setRpeError] = useState('');

    const isSubmitDisabled = processing 
        || (mode === 'wellness' && isWellnessLocked)
        || ((mode === 'all' || mode === 'wellness') && !isWellnessComplete && !isWellnessLocked)
        || ((mode === 'all' || mode === 'rpe') && !isRpeComplete);

    const renderScaleButtons = (field, label, leftLabel, rightLabel) => {
        const getColorClass = (num, isSelected) => {
            const colors = {
                1: "bg-[#673ab7]", // Purple
                2: "bg-[#4285f4]", // Blue
                3: "bg-[#34a853]", // Green
                4: "bg-[#fbbc05]", // Yellow
                5: "bg-[#ff9800]", // Orange
                6: "bg-[#f57c00]", // Dark Orange
                7: "bg-[#ea4335]", // Red
            };

            const baseColor = colors[num];
            if (isSelected) {
                return `${baseColor} text-white border-transparent shadow-lg transform scale-[1.03] ring-2 ring-offset-2 ring-slate-400  z-10`;
            }
            return `${baseColor} text-white/90 border-transparent opacity-70 hover:opacity-100 hover:scale-[1.02]`;
        };

        return (
            <div className="space-y-3 p-5 bg-slate-50  rounded-xl border border-slate-100 ">
                <label className="text-sm font-bold text-slate-900  tracking-tight">
                    {label}
                </label>

                <div className="flex justify-between text-[11px] font-bold text-slate-600  mb-1">
                    <span>{leftLabel}</span>
                    <span>{rightLabel}</span>
                </div>

                <div className="flex">
                    {[1, 2, 3, 4, 5, 6, 7].map((num, idx) => (
                        <button
                            key={num}
                            type="button"
                            disabled={isWellnessLocked}
                            onClick={() => {
                                if (isWellnessLocked) return;
                                setData(field, num);
                            }}
                            className={`flex-1 sm:h-12 py-3 font-bold text-sm sm:text-base transition-all relative
                                ${idx === 0 ? "rounded-l-md" : ""} 
                                ${idx === 6 ? "rounded-r-md" : ""}
                                ${getColorClass(num, data[field] === num)}
                                ${isWellnessLocked ? 'cursor-not-allowed opacity-50' : ''}
                            `}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <AppLayout
            user={auth.user}
            headerTitle="Wellness & RPE Harian"
            headerDescription="Catat metrik wellness harian dan RPE sesi latihan Anda."
        >
            <Head title="Wellness & RPE Harian" />

            <div className="pb-12 mx-auto space-y-6 relative">
                <PageHeader 
                    title="Wellness & RPE Harian"
                    subtitle="Catat metrik wellness harian dan RPE sesi latihan Anda."
                    badge={new Date(date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                    icon={Activity}
                    actions={
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={() => {
                                    if ((mode === 'all' || mode === 'rpe') && !isRpeComplete && !isCompleted) {
                                        setRpeError('Wajib mengisi RPE & Duration minimal di salah satu sesi (AM/PM) sebelum kembali.');
                                        return;
                                    }
                                    window.location.href = route("admin.individual-trainings.index");
                                }}
                                className="flex justify-center items-center gap-2 px-4 py-2.5 bg-white text-slate-700 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-50 transition-all shadow-sm w-full sm:w-auto"
                            >
                                <ArrowLeft size={16} /> Kembali
                            </button>
                            {training_id && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if ((mode === 'all' || mode === 'rpe') && !isRpeComplete && !isCompleted) {
                                            setRpeError('Wajib mengisi RPE & Duration minimal di salah satu sesi (AM/PM) sebelum kembali.');
                                            return;
                                        }
                                        window.location.href = route("admin.individual-trainings.show", training_id);
                                    }}
                                    className="flex justify-center items-center gap-2 px-4 py-2.5 bg-[#ff4d00] text-white rounded-xl text-sm font-bold hover:bg-[#e64500] transition-all shadow-md shadow-[#ff4d00]/20 w-full sm:w-auto"
                                >
                                    {mode === "wellness" ? (
                                        <>Ke Program Latihan <ArrowRight size={16} /></>
                                    ) : (
                                        <><ArrowLeft size={16} /> Ke Program Latihan</>
                                    )}
                                </button>
                            )}
                        </div>
                    }
                />

                <form onSubmit={submit} className="space-y-6">
                    {/* WELLNESS SECTION */}
                    {(mode === "all" || mode === "wellness") && (
                        <div className="bg-white  border border-slate-200  rounded-2xl shadow-sm overflow-hidden">
                            <div
                                className="p-6 sm:p-8 cursor-pointer flex justify-between items-center bg-slate-50  hover:bg-slate-100  transition-colors"
                                onClick={() =>
                                    setIsWellnessExpanded(!isWellnessExpanded)
                                }
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-200  rounded-xl text-slate-900 ">
                                        <HeartPulse size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900  tracking-tight">
                                            1. Wellness Harian
                                        </h2>
                                        <p className="text-sm font-medium text-slate-500  mt-1">
                                            Catat kualitas tidur, stres, dan tingkat kelelahan otot
                                        </p>
                                    </div>
                                </div>
                                <div className="text-slate-400 font-bold text-sm bg-white  px-3 py-1 rounded-full border border-slate-200  shadow-sm">
                                    {isWellnessExpanded ? "Tutup" : "Buka"}
                                </div>
                            </div>

                            {isWellnessExpanded && (
                                <div className="p-6 sm:p-8 border-t border-slate-100  space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {renderScaleButtons(
                                            "quality_of_sleep",
                                            "Bagaimana kualitas tidur Anda semalam?",
                                            "Sangat Sangat Baik",
                                            "Sangat Sangat Buruk",
                                        )}
                                        {renderScaleButtons(
                                            "stress",
                                            "Bagaimana tingkat stres Anda?",
                                            "Sangat Sangat Rendah",
                                            "Sangat Sangat Tinggi",
                                        )}
                                        {renderScaleButtons(
                                            "fatigue",
                                            "Seberapa lelah yang Anda rasakan?",
                                            "Sangat Sangat Rendah",
                                            "Sangat Sangat Tinggi",
                                        )}
                                        {renderScaleButtons(
                                            "muscle_soreness",
                                            "Bagaimana tingkat kekakuan/nyeri otot Anda?",
                                            "Sangat Sangat Rendah",
                                            "Sangat Sangat Tinggi",
                                        )}
                                    </div>

                                    <div className="pt-6 border-t border-slate-100  space-y-6">
                                        <h3 className="text-lg font-bold text-slate-900 ">
                                            Bagaimana dengan Keluhan Area Nyeri Anda?
                                        </h3>

                                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                                            <div className="w-full lg:w-1/2 rounded-xl overflow-hidden border border-slate-200  bg-white  p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-center">
                                                <div className="flex-1 w-full flex flex-col items-center">
                                                    <h4 className="text-[10px] font-bold text-slate-400  tracking-[0.15em] mb-2">DEPAN (ANTERIOR)</h4>
                                                    <div className="w-full max-w-[180px]">
                                                        <BodyHighlighter type="anterior" selectedAreas={data.muscle_pain_areas} onSelectArea={togglePainArea} />
                                                    </div>
                                                </div>
                                                <div className="flex-1 w-full flex flex-col items-center">
                                                    <h4 className="text-[10px] font-bold text-slate-400  tracking-[0.15em] mb-2">BELAKANG (POSTERIOR)</h4>
                                                    <div className="w-full max-w-[180px]">
                                                        <BodyHighlighter type="posterior" selectedAreas={data.muscle_pain_areas} onSelectArea={togglePainArea} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-full lg:w-1/2 space-y-4">
                                                <p className="text-sm font-bold text-slate-500  mb-2">
                                                    Pilih area spesifik di mana Anda merasakan nyeri atau ketidaknyamanan:
                                                </p>

                                                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                    {MUSCLE_PAIN_AREAS.map(
                                                        (area) => (
                                                            <div
                                                                key={area}
                                                                onClick={() =>
                                                                    togglePainArea(
                                                                        area,
                                                                    )
                                                                }
                                                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                                                    data.muscle_pain_areas.includes(
                                                                        area,
                                                                    )
                                                                        ? "bg-[#ff4d00] border-[#ff4d00] text-white shadow-md shadow-[#ff4d00]/20"
                                                                        : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700"
                                                                }`}
                                                            >
                                                                <div
                                                                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                                                        data.muscle_pain_areas.includes(
                                                                            area,
                                                                        )
                                                                            ? "bg-white border-white text-[#ff4d00]"
                                                                            : "bg-white border-slate-300"
                                                                    }`}
                                                                >
                                                                    {data.muscle_pain_areas.includes(
                                                                        area,
                                                                    ) && (
                                                                        <CheckSquare
                                                                            size={
                                                                                12
                                                                            }
                                                                            strokeWidth={
                                                                                4
                                                                            }
                                                                        />
                                                                    )}
                                                                </div>
                                                                <span className="text-xs font-bold leading-tight">
                                                                    {area}
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>

                                                <div className="pt-2">
                                                    <label className="text-xs font-bold text-slate-700  mb-1 block">
                                                        Area Lainnya:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Sebutkan titik nyeri lainnya..."
                                                        className="w-full px-4 py-3 bg-slate-50  border border-slate-200  rounded-xl text-sm font-medium text-slate-900  focus:ring-2 focus:ring-[#ff4d00]  outline-none transition-all"
                                                        value={data.other_pain}
                                                        onChange={(e) =>
                                                            setData(
                                                                "other_pain",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* RPE SECTION */}
                    {(mode === "all" || mode === "rpe") && (
                        <div className="bg-white  border border-slate-200  rounded-2xl shadow-sm overflow-hidden">
                            <div
                                className="p-6 sm:p-8 cursor-pointer flex justify-between items-center bg-slate-50  hover:bg-slate-100  transition-colors"
                                onClick={() => setIsRpeExpanded(!isRpeExpanded)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-200  rounded-xl text-slate-900 ">
                                        <Activity size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900  tracking-tight">
                                            2. RPE Sesi Latihan
                                        </h2>
                                        <p className="text-sm font-medium text-slate-500  mt-1">
                                            Catat intensitas dan durasi latihan Anda
                                        </p>
                                    </div>
                                </div>
                                <div className="text-slate-400 font-bold text-sm bg-white  px-3 py-1 rounded-full border border-slate-200  shadow-sm">
                                    {isRpeExpanded ? "Tutup" : "Buka"}
                                </div>
                            </div>

                            {isRpeExpanded && (
                                <div className="p-6 sm:p-8 border-t border-slate-100  animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="space-y-6">
                                        {/* Session Type */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-slate-900 ">
                                                Pilih Sesi Latihan
                                            </label>
                                            <p className="text-xs font-medium text-slate-500  mb-3">
                                                Masukkan skor RPE (1–10) berdasarkan seberapa berat sesi latihan yang dirasakan, lalu catat durasi latihan dalam menit
                                            </p>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleSessionTypeChange("am")}
                                                    className={`p-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center justify-center gap-2 ${
                                                        data.session_type === "am"
                                                            ? "border-[#ff4d00] bg-orange-50 text-[#ff4d00] "
                                                            : "border-slate-200  bg-white  text-slate-500 hover:border-slate-300 "
                                                    }`}
                                                >
                                                    Sesi Pagi (AM)
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSessionTypeChange("pm")}
                                                    className={`p-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center justify-center gap-2 ${
                                                        data.session_type === "pm"
                                                            ? "border-[#ff4d00] bg-orange-50 text-[#ff4d00] "
                                                            : "border-slate-200  bg-white  text-slate-500 hover:border-slate-300 "
                                                    }`}
                                                >
                                                    Sesi Sore (PM)
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            {/* RPE Input */}
                                            <div className="space-y-3">
                                                <label className="text-sm font-bold text-slate-900 ">
                                                    RPE Sesi (1-10)
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Activity
                                                            size={18}
                                                            className="text-slate-400"
                                                        />
                                                    </div>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="10"
                                                        value={data.rpe}
                                                        onChange={(e) => setData("rpe", e.target.value)}
                                                        className="w-full pl-11 pr-4 py-3 bg-slate-50  border border-slate-200  rounded-xl text-slate-900  font-bold focus:ring-2 focus:ring-[#ff4d00]  outline-none transition-all"
                                                        placeholder="Masukkan angka 1 - 10"
                                                    />
                                                </div>
                                                <p className="text-xs font-medium text-slate-500  mt-2">
                                                    Pilih angka yang paling menggambarkan seberapa berat sesi latihan yang baru saja dilakukan.
                                                </p>


                                                {/* RPE Scale Information */}
                                                <div className="mt-4 p-4 bg-slate-100  border border-slate-200  rounded-xl space-y-3">
                                                    <div className="flex items-center justify-between text-xs font-bold">
                                                        <div className="flex items-center gap-3">
                                                            <span className="w-12 text-center py-1 bg-slate-300  text-slate-800  rounded">
                                                                1 - 2
                                                            </span>
                                                            <span className="text-slate-600 ">
                                                                Sangat Ringan
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs font-bold">
                                                        <div className="flex items-center gap-3">
                                                            <span className="w-12 text-center py-1 bg-blue-400  text-white rounded">
                                                                3 - 4
                                                            </span>
                                                            <span className="text-blue-600 ">
                                                                Ringan
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs font-bold">
                                                        <div className="flex items-center gap-3">
                                                            <span className="w-12 text-center py-1 bg-green-500  text-white rounded">
                                                                5 - 6
                                                            </span>
                                                            <span className="text-green-600 ">
                                                                Sedang
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs font-bold">
                                                        <div className="flex items-center gap-3">
                                                            <span className="w-12 text-center py-1 bg-amber-500  text-white rounded">
                                                                7 - 8
                                                            </span>
                                                            <span className="text-amber-600 ">
                                                                Berat
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs font-bold">
                                                        <div className="flex items-center gap-3">
                                                            <span className="w-12 text-center py-1 bg-red-600  text-white rounded">
                                                                9 - 10
                                                            </span>
                                                            <span className="text-red-600 ">
                                                                Maksimal
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Duration Input */}
                                            <div className="space-y-3">
                                                <label className="text-sm font-bold text-slate-900 ">
                                                    Durasi Latihan (Menit)
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Clock
                                                            size={18}
                                                            className="text-slate-400"
                                                        />
                                                    </div>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={data.duration}
                                                        onChange={(e) => setData("duration", e.target.value)}
                                                        className="w-full pl-11 pr-4 py-3 bg-slate-50  border border-slate-200  rounded-xl text-slate-900  font-bold focus:ring-2 focus:ring-[#ff4d00]  outline-none transition-all"
                                                        placeholder="Misal: 60"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* RPE Validation Error */}
                    {rpeError && (
                        <div className="p-3 rounded-lg bg-red-50  border border-red-200  text-red-600  text-sm font-semibold flex items-center gap-2">
                            <Activity size={16} />
                            {rpeError}
                        </div>
                    )}

                    <div className="flex justify-end pt-4 gap-4">
                        {mode === "wellness" && isWellnessLocked ? (
                            <>
                                {training_id && (
                                    <Link
                                        href={route("admin.individual-trainings.show", training_id)}
                                        className="rounded-lg flex items-center gap-2 px-8 py-3 bg-[#ff4d00] text-white  hover:bg-[#e64500] hover:scale-105 font-bold text-sm transition-all shadow-lg shadow-[#ff4d00]/20"
                                    >
                                        Lanjut: Lihat Program Aktual <ArrowRight size={18} />
                                    </Link>
                                )}
                            </>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitDisabled}
                                onClick={() => {
                                    if ((mode === 'all' || mode === 'rpe') && !isRpeComplete) {
                                        setRpeError('Wajib mengisi RPE & Duration minimal di salah satu sesi (AM/PM).');
                                    }
                                }}
                                className={`w-full py-3 rounded-lg font-bold text-sm transition-all shadow-lg shadow-[#ff4d00]/20 flex items-center justify-center gap-2 ${
                                    isSubmitDisabled 
                                        ? "bg-slate-300  text-slate-500  cursor-not-allowed shadow-none"
                                        : "bg-[#ff4d00] text-white  hover:bg-[#e64500]"
                                }`}
                            >
                                <>Selesai <CheckSquare size={18} /></>
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 10px;
                }
                :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #334155;
                }
            `}</style>
        </AppLayout>
    );
}
