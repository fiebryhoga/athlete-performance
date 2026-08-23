import React, { useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Printer,
    ArrowLeft,
    Download,
    CheckCircle2,
    User,
    Calendar,
    Activity,
    Trophy,
    Target,
    Scale,
    Ruler,
    Weight,
    ShieldCheck,
    Compass,
    Sparkles,
    TrendingUp,
    TrendingDown,
    Minus,
    Camera,
    Info,
    Maximize2,
} from "lucide-react";
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
} from "recharts";

export default function ProfilingPdf({
    athlete,
    stats = {},
    radarData = [],
    comparisonData = [],
    itemAnalysis = [],
    strengths = [],
    weaknesses = [],
    latest_phv,
    latest_composition,
    latest_wellness,
    latest_dpa,
    galleries = [],
    history = [],
    clubLogo,
    printDate,
}) {
    const handlePrint = () => {
        window.print();
    };

    const calculateBMI = (h, w) => {
        if (!h || !w) return "-";
        const heightInM = h / 100;
        const bmiVal = w / (heightInM * heightInM);
        return parseFloat(bmiVal.toFixed(1));
    };

    const bmi = calculateBMI(athlete?.height, athlete?.weight);
    const initial = athlete?.name ? athlete.name.charAt(0).toUpperCase() : "-";

    const getBMIStatus = (val) => {
        if (val === "-")
            return { label: "-", color: "text-slate-500", bg: "bg-slate-100" };
        if (val < 18.5)
            return {
                label: "Underweight",
                color: "text-amber-600",
                bg: "bg-amber-50",
            };
        if (val >= 18.5 && val <= 24.9)
            return {
                label: "Ideal",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
            };
        if (val >= 25 && val <= 29.9)
            return {
                label: "Overweight",
                color: "text-orange-600",
                bg: "bg-orange-50",
            };
        return { label: "Obese", color: "text-rose-600", bg: "bg-rose-50" };
    };
    const bmiStatus = getBMIStatus(bmi);

    const isFemale =
        athlete?.gender === "P" ||
        athlete?.gender === "female" ||
        athlete?.gender === "Perempuan";
    const genderLabel = isFemale ? "Perempuan" : "Laki-laki";

    const formatScore = (val) => {
        if (val === undefined || val === null) return 0;
        return Number(val) % 1 === 0 ? Number(val) : Number(val).toFixed(1);
    };

    const formatNumber = (val) => {
        if (val === undefined || val === null) return "-";
        return Number(val) % 1 === 0 ? Number(val) : Number(val).toFixed(1);
    };

    const GrowthIndicator = ({ value }) => {
        if (value === undefined || value === null)
            return <span className="text-slate-300">-</span>;
        if (value > 0)
            return (
                <span className="inline-flex items-center text-emerald-600 text-xs font-bold">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> +{value}%
                </span>
            );
        if (value < 0)
            return (
                <span className="inline-flex items-center text-rose-500 text-xs font-bold">
                    <TrendingDown className="w-3 h-3 mr-0.5" /> {value}%
                </span>
            );
        return (
            <span className="inline-flex items-center text-slate-400 text-xs font-bold">
                <Minus className="w-3 h-3 mr-0.5" /> 0%
            </span>
        );
    };

    // Sort item analysis from best/highest score to lowest
    const sortedItemAnalysis = [...(itemAnalysis || [])].sort(
        (a, b) => (Number(b.score) || 0) - (Number(a.score) || 0),
    );

    return (
        <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans antialiased print:bg-white print:p-0">
            <Head title={`Laporan Profiling - ${athlete?.name || "Athlete"}`} />

            {/* ─── ACTION BAR (HIDDEN IN PRINT) ─── */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs print:hidden">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors"
                    >
                        <ArrowLeft size={15} /> Kembali
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                            Format Cetak: A4 Portrait
                        </span>
                        <button
                            onClick={handlePrint}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                        >
                            <Printer size={15} /> Cetak / Simpan PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── PRINTABLE DOCUMENT CONTAINER ─── */}
            <div className="max-w-5xl mx-auto my-6 p-6 sm:p-8 bg-white rounded-xl shadow-md border border-slate-200/80 print:m-0 print:p-0 print:border-none print:shadow-none print:max-w-none print:w-full space-y-4">
                {/* ─── DOCUMENT HEADER WITH LOGO ─── */}
                <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900/80">
                    <div className="flex items-center gap-3">
                        {clubLogo ? (
                            <img
                                src={clubLogo}
                                alt="Logo"
                                className="h-10 w-auto object-contain max-w-[160px]"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-md bg-orange-600 text-white font-black text-lg flex items-center justify-center">
                                O
                            </div>
                        )}
                        <div>
                            <h1 className="text-base font-black text-slate-900 uppercase tracking-tight leading-tight">
                                Laporan Profiling & Analisis Performa
                            </h1>
                            <p className="text-[10px] text-slate-500 font-medium">
                                Olympus Training Surabaya - Performance Hub
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Tanggal Cetak
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                            {printDate ||
                                new Date().toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                        </span>
                    </div>
                </div>

                {/* ─── 1. HERO PROFILE CARD ─── */}
                <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden">
                    {/* Soft White-Orange Cover Banner */}
                    <div className="relative h-16 sm:h-20 bg-gradient-to-r from-white via-orange-50/50 to-amber-50/60 border-b border-slate-100 p-2.5 flex justify-end items-start overflow-hidden">
                        <span className="relative z-10 inline-flex items-center gap-1.5 bg-white/90 border border-slate-200/80 text-slate-700 text-[9.5px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                            <ShieldCheck
                                size={11}
                                className="text-orange-500"
                            />
                            <span>
                                {stats?.package_name ||
                                    (stats?.sport
                                        ? `${stats.sport}`
                                        : "Member")}
                            </span>
                        </span>
                    </div>

                    {/* Content Container Below Banner */}
                    <div className="px-4 pb-3.5 pt-2">
                        <div className="flex flex-row items-center justify-between gap-4">
                            {/* Left: Avatar overlapping banner + Identity */}
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="relative -mt-9 sm:-mt-10 w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-md border-[2.5px] border-white shadow-md overflow-hidden bg-white text-orange-600 font-black text-xl flex items-center justify-center shrink-0 z-10">
                                    {athlete?.profile_photo_url ? (
                                        <img
                                            src={athlete.profile_photo_url}
                                            alt={athlete.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="leading-none select-none">
                                            {initial}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-0.5 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h2 className="text-base font-black text-slate-900 leading-tight">
                                            {athlete?.name || "Athlete"}
                                        </h2>
                                        <span className="text-[9.5px] font-mono text-slate-400 font-bold">
                                            @{athlete?.username || "-"}
                                        </span>
                                        <span className="inline-flex items-center gap-1 font-bold text-orange-700 bg-orange-50 border border-orange-200/70 px-2 py-0.5 rounded text-[9.5px]">
                                            <Compass
                                                size={10}
                                                className="text-orange-500"
                                            />
                                            {stats?.sport ||
                                                athlete?.sport?.name ||
                                                "Tanpa Cabor"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium flex-wrap">
                                        <span className="inline-flex items-center gap-1">
                                            <User
                                                size={10}
                                                className="text-slate-400"
                                            />
                                            {genderLabel}
                                        </span>
                                        {stats?.coaches_text &&
                                            stats.coaches_text !== "-" && (
                                                <>
                                                    <span className="text-slate-300">
                                                        •
                                                    </span>
                                                    <span>
                                                        Pelatih:{" "}
                                                        <strong className="text-slate-700 font-semibold">
                                                            {stats.coaches_text}
                                                        </strong>
                                                    </span>
                                                </>
                                            )}
                                    </div>
                                </div>
                            </div>

                            {/* Right: 4 Biometrics Sub-Boxes */}
                            <div className="grid grid-cols-4 gap-1.5 shrink-0">
                                <div className="px-2.5 py-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-center min-w-[65px]">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">
                                        Tinggi
                                    </span>
                                    <span className="text-xs font-black text-slate-900 leading-tight">
                                        {athlete?.height || "-"}{" "}
                                        <span className="text-[8px] font-normal text-slate-400">
                                            cm
                                        </span>
                                    </span>
                                </div>

                                <div className="px-2.5 py-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-center min-w-[65px]">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">
                                        Berat
                                    </span>
                                    <span className="text-xs font-black text-slate-900 leading-tight">
                                        {athlete?.weight || "-"}{" "}
                                        <span className="text-[8px] font-normal text-slate-400">
                                            kg
                                        </span>
                                    </span>
                                </div>

                                <div className="px-2.5 py-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-center min-w-[65px]">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">
                                        Usia
                                    </span>
                                    <span className="text-xs font-black text-slate-900 leading-tight">
                                        {athlete?.age || "-"}{" "}
                                        <span className="text-[8px] font-normal text-slate-400">
                                            thn
                                        </span>
                                    </span>
                                </div>

                                <div className="px-2.5 py-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-center min-w-[65px]">
                                    <span
                                        className={`text-[8px] font-bold block truncate ${bmiStatus.color}`}
                                    >
                                        {bmiStatus.label}
                                    </span>
                                    <span
                                        className={`text-xs font-black leading-tight ${bmiStatus.color}`}
                                    >
                                        {bmi}{" "}
                                        <span className="text-[8px] font-normal text-slate-400">
                                            BMI
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── 2-COLUMN SECTION: (LEFT: CHARTS & STRENGTHS, RIGHT: SCORE & PARAMETER TABLE) ─── */}
                <div className="grid grid-cols-12 gap-3.5 items-start">
                    {/* ═══ KOLOM KIRI (7/12) ═══ */}
                    <div className="col-span-7 space-y-3.5">
                        {/* Dual Chart Row */}
                        <div className="grid grid-cols-2 gap-2.5">
                            {/* Radar Chart */}
                            <div className="bg-white p-3 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                                <div className="mb-1">
                                    <h3 className="text-xs font-bold text-slate-900 leading-tight">
                                        Radar Kategori Fisik
                                    </h3>
                                    <p className="text-[9px] text-slate-400">
                                        Evaluasi atribut fisik (0 – 100)
                                    </p>
                                </div>
                                <div className="h-[180px] w-full">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <RadarChart
                                            cx="50%"
                                            cy="50%"
                                            outerRadius="68%"
                                            data={radarData}
                                        >
                                            <PolarGrid
                                                stroke="#e2e8f0"
                                                strokeDasharray="3 3"
                                            />
                                            <PolarAngleAxis
                                                dataKey="subject"
                                                tick={{
                                                    fill: "#334155",
                                                    fontSize: 8.5,
                                                    fontWeight: "bold",
                                                }}
                                            />
                                            <PolarRadiusAxis
                                                angle={30}
                                                domain={[0, 100]}
                                                tick={false}
                                                axisLine={false}
                                            />
                                            <Radar
                                                name="Target"
                                                dataKey="B"
                                                stroke="#f59e0b"
                                                strokeWidth={1.5}
                                                fill="#f59e0b"
                                                fillOpacity={0.08}
                                            />
                                            <Radar
                                                name="Skor"
                                                dataKey="A"
                                                stroke="#ea580c"
                                                strokeWidth={2}
                                                fill="#ea580c"
                                                fillOpacity={0.35}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Comparison Bar Chart */}
                            <div className="bg-white p-3 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                                <div className="mb-1">
                                    <h3 className="text-xs font-bold text-slate-900 leading-tight">
                                        Perbandingan Sesi
                                    </h3>
                                    <p className="text-[9px] text-slate-400">
                                        Sesi Terkini vs Sebelumnya
                                    </p>
                                </div>
                                <div className="h-[180px] w-full">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={comparisonData}
                                            margin={{
                                                top: 10,
                                                right: 0,
                                                left: -25,
                                                bottom: 0,
                                            }}
                                            barGap={3}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                vertical={false}
                                                stroke="#f1f5f9"
                                            />
                                            <XAxis
                                                dataKey="name"
                                                tick={{
                                                    fontSize: 8,
                                                    fill: "#64748b",
                                                    fontWeight: 600,
                                                }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                domain={[0, 100]}
                                                tick={{
                                                    fontSize: 8,
                                                    fill: "#94a3b8",
                                                }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Bar
                                                name="Lalu"
                                                dataKey="previous"
                                                fill="#cbd5e1"
                                                radius={[2, 2, 0, 0]}
                                                barSize={10}
                                            />
                                            <Bar
                                                name="Kini"
                                                dataKey="latest"
                                                fill="#ea580c"
                                                radius={[2, 2, 0, 0]}
                                                barSize={10}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Keunggulan & Prioritas */}
                        <div className="grid grid-cols-2 gap-2.5">
                            {/* Keunggulan Fisik */}
                            <div className="bg-white p-3 rounded-md border border-slate-200/80 shadow-2xs">
                                <div className="mb-2 pb-1 border-b border-slate-100">
                                    <h4 className="text-[11px] font-bold text-slate-900">
                                        Keunggulan Fisik (&gt;70%)
                                    </h4>
                                </div>
                                <div className="space-y-2">
                                    {strengths && strengths.length > 0 ? (
                                        strengths.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="p-2 rounded bg-gradient-to-br from-white via-white to-orange-50/40 border border-slate-200/80 space-y-1"
                                            >
                                                <div className="flex items-center justify-between text-[10px]">
                                                    <span className="font-bold text-slate-800">
                                                        {item.name}
                                                    </span>
                                                    <span className="font-black text-emerald-600">
                                                        {formatScore(
                                                            item.score,
                                                        )}
                                                        %
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-emerald-500 h-full rounded-full"
                                                        style={{
                                                            width: `${Math.min(100, Math.max(0, item.score))}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[9.5px] text-slate-400 italic text-center py-2">
                                            Belum ada kategori di atas 70%
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Prioritas Peningkatan */}
                            <div className="bg-white p-3 rounded-md border border-slate-200/80 shadow-2xs">
                                <div className="mb-2 pb-1 border-b border-slate-100">
                                    <h4 className="text-[11px] font-bold text-slate-900">
                                        Prioritas Peningkatan (&le;70%)
                                    </h4>
                                </div>
                                <div className="space-y-2">
                                    {weaknesses && weaknesses.length > 0 ? (
                                        weaknesses.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="p-2 rounded bg-gradient-to-br from-white via-white to-orange-50/40 border border-slate-200/80 space-y-1"
                                            >
                                                <div className="flex items-center justify-between text-[10px]">
                                                    <span className="font-bold text-slate-800">
                                                        {item.name}
                                                    </span>
                                                    <span className="font-black text-rose-500">
                                                        {formatScore(
                                                            item.score,
                                                        )}
                                                        %
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-rose-500 h-full rounded-full"
                                                        style={{
                                                            width: `${Math.min(100, Math.max(0, item.score))}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[9.5px] text-slate-400 italic text-center py-2">
                                            Semua kategori berada di atas 70%
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Status Multi-Domain Asesmen */}
                        <div className="bg-white border border-slate-200/80 rounded-md p-3 shadow-2xs space-y-2.5">
                            <div className="pb-1 border-b border-slate-100">
                                <h3 className="text-xs font-bold text-slate-900">
                                    Status Multi-Domain Asesmen
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {/* PHV */}
                                <div className="p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80 space-y-0.5">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase block">
                                        PHV & Pertumbuhan
                                    </span>
                                    {latest_phv ? (
                                        <div className="flex items-center justify-between text-[10px]">
                                            <span className="font-bold text-slate-800">
                                                Offset:{" "}
                                                {Number(
                                                    latest_phv.maturity_offset,
                                                ).toFixed(1)}{" "}
                                                thn
                                            </span>
                                            <span className="font-bold text-orange-600">
                                                +
                                                {latest_phv.remaining_growth ||
                                                    "-"}{" "}
                                                cm
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-[9px] text-slate-400 italic">
                                            Belum ada data PHV
                                        </span>
                                    )}
                                </div>

                                {/* Body Composition */}
                                <div className="p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80 space-y-0.5">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase block">
                                        Komposisi Tubuh
                                    </span>
                                    {latest_composition ? (
                                        <div className="flex items-center justify-between text-[10px]">
                                            <span className="font-bold text-orange-600">
                                                Fat:{" "}
                                                {latest_composition.body_fat_percentage ??
                                                    "-"}
                                                %
                                            </span>
                                            <span className="font-bold text-slate-800">
                                                Muscle:{" "}
                                                {latest_composition.muscle_mass ??
                                                    "-"}{" "}
                                                kg
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-[9px] text-slate-400 italic">
                                            Belum ada data
                                        </span>
                                    )}
                                </div>

                                {/* Wellness */}
                                <div className="p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80 space-y-0.5">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase block">
                                        Beban & Wellness
                                    </span>
                                    {latest_wellness ? (
                                        <div className="flex items-center justify-between text-[10px]">
                                            <span className="font-bold text-emerald-600">
                                                Well:{" "}
                                                {latest_wellness.daily_wellness_score ??
                                                    "-"}
                                                /30
                                            </span>
                                            <span className="font-bold text-orange-600">
                                                Load:{" "}
                                                {latest_wellness.daily_load ??
                                                    0}{" "}
                                                AU
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-[9px] text-slate-400 italic">
                                            Belum ada catatan
                                        </span>
                                    )}
                                </div>

                                {/* DPA Posture */}
                                <div className="p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80 space-y-0.5">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase block">
                                        Postur Dinamis (DPA)
                                    </span>
                                    {latest_dpa ? (
                                        <span className="text-[10px] font-bold text-slate-800 truncate block">
                                            {latest_dpa.conclusion || "Normal"}
                                        </span>
                                    ) : (
                                        <span className="text-[9px] text-slate-400 italic">
                                            Belum ada data DPA
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ═══ KOLOM KANAN (5/12) — SCORE GAUGE & TEST PARAMETERS ═══ */}
                    <div className="col-span-5 space-y-3.5">
                        {/* Semi-Circle Aspect Gauge Card */}
                        <div className="bg-white border border-slate-200/80 rounded-md p-3.5 shadow-2xs">
                            <div className="mb-1 pb-1.5 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-xs font-bold text-slate-900">
                                    Skor Performa
                                </h3>
                                <span
                                    className={`text-[9.5px] font-bold ${(() => {
                                        const score =
                                            stats?.avg_score ||
                                            stats?.average_score ||
                                            0;
                                        if (score >= 90)
                                            return "text-emerald-600";
                                        if (score >= 80) return "text-teal-600";
                                        if (score >= 70)
                                            return "text-amber-600";
                                        if (score >= 60)
                                            return "text-orange-600";
                                        return "text-rose-600";
                                    })()}`}
                                >
                                    {(() => {
                                        const score =
                                            stats?.avg_score ||
                                            stats?.average_score ||
                                            0;
                                        if (score >= 90) return "Sangat Baik";
                                        if (score >= 80) return "Baik";
                                        if (score >= 70) return "Cukup";
                                        if (score >= 60) return "Kurang";
                                        return "Sangat Kurang";
                                    })()}
                                </span>
                            </div>

                            {/* Gauge */}
                            <div className="flex flex-col items-center justify-center pt-1 pb-0.5">
                                <div className="relative w-40 h-22 flex items-end justify-center">
                                    <svg
                                        className="w-40 h-22 overflow-visible"
                                        viewBox="0 0 160 90"
                                    >
                                        <path
                                            d="M 16 80 A 64 64 0 0 1 144 80"
                                            fill="none"
                                            stroke="#f1f5f9"
                                            strokeWidth="11"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M 16 80 A 64 64 0 0 1 144 80"
                                            fill="none"
                                            stroke="url(#aspectGaugeGradientPdf)"
                                            strokeWidth="11"
                                            strokeLinecap="round"
                                            strokeDasharray="201.06"
                                            strokeDashoffset={
                                                201.06 -
                                                (201.06 *
                                                    Math.min(
                                                        100,
                                                        Math.max(
                                                            0,
                                                            stats?.avg_score ||
                                                                stats?.average_score ||
                                                                0,
                                                        ),
                                                    )) /
                                                    100
                                            }
                                        />
                                        <defs>
                                            <linearGradient
                                                id="aspectGaugeGradientPdf"
                                                x1="0%"
                                                y1="0%"
                                                x2="100%"
                                                y2="0%"
                                            >
                                                <stop
                                                    offset="0%"
                                                    stopColor="#fb923c"
                                                />
                                                <stop
                                                    offset="100%"
                                                    stopColor="#ea580c"
                                                />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute bottom-0 text-center pb-0.5">
                                        <span className="text-2xl font-black text-slate-900 leading-none">
                                            {formatScore(
                                                stats?.avg_score ||
                                                    stats?.average_score,
                                            )}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-400 block mt-0.5">
                                            Rata-Rata Tes
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Mini 3 Stats */}
                            <div className="grid grid-cols-3 gap-1 text-center mt-2 pt-2 border-t border-slate-100">
                                <div className="p-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase block">
                                        Total Sesi
                                    </span>
                                    <p className="text-xs font-black text-slate-800 leading-tight">
                                        {stats?.total_sessions ||
                                            stats?.sessions ||
                                            0}
                                    </p>
                                </div>
                                <div className="p-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase block">
                                        Puncak
                                    </span>
                                    <p className="text-xs font-black text-emerald-600 leading-tight">
                                        {formatScore(
                                            stats?.highest_score ||
                                                stats?.max_score,
                                        )}
                                    </p>
                                </div>
                                <div className="p-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase block truncate">
                                        Terbaik
                                    </span>
                                    <p className="text-xs font-black text-orange-600 leading-tight truncate">
                                        {stats?.best_category || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Rincian Parameter Tes Sesi Terakhir (Sorted by Score Descending, Full Height) */}
                        <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden">
                            <div className="px-3 py-2 bg-gradient-to-r from-white via-orange-50/30 to-white border-b border-slate-200/80 flex items-center justify-between">
                                <h3 className="text-xs font-bold text-slate-900">
                                    Rincian Parameter Tes
                                </h3>
                                <span className="text-[9px] text-slate-500 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200/80">
                                    {sortedItemAnalysis.length} Item
                                </span>
                            </div>

                            <table className="w-full text-xs text-left">
                                <thead className="text-[8.5px] text-slate-500 bg-slate-50 border-b border-slate-200/80 font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="px-2.5 py-1.5">
                                            Item & Target
                                        </th>
                                        <th className="px-2 py-1.5 text-center">
                                            Hasil
                                        </th>
                                        <th className="px-2.5 py-1.5 text-right">
                                            Skor
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {sortedItemAnalysis.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="px-2.5 py-1.5">
                                                <div className="font-bold text-slate-900 text-[11px] leading-tight">
                                                    {item.name}
                                                </div>
                                                <div className="text-[8.5px] text-slate-400 font-medium">
                                                    <span>{item.category}</span>{" "}
                                                    •{" "}
                                                    <span>
                                                        Tgt:{" "}
                                                        {formatNumber(
                                                            item.target_value ||
                                                                item.target,
                                                        )}{" "}
                                                        {item.unit}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-1.5 text-center">
                                                <span className="font-black text-slate-900 text-[11px] block leading-tight">
                                                    {formatNumber(
                                                        item.result_value ||
                                                            item.result,
                                                    )}
                                                </span>
                                                <span className="text-[8px] text-slate-400">
                                                    {item.unit}
                                                </span>
                                            </td>
                                            <td className="px-2.5 py-1.5 text-right">
                                                <div className="inline-flex flex-col items-end">
                                                    <span
                                                        className={`font-black text-[11px] leading-tight ${
                                                            (item.score || 0) >=
                                                            80
                                                                ? "text-emerald-600"
                                                                : (item.score ||
                                                                        0) >= 60
                                                                  ? "text-amber-600"
                                                                  : "text-rose-600"
                                                        }`}
                                                    >
                                                        {formatScore(
                                                            item.score,
                                                        )}
                                                        %
                                                    </span>
                                                    {item.growth !==
                                                        undefined &&
                                                        item.growth !== 0 && (
                                                            <div className="scale-75 origin-right">
                                                                <GrowthIndicator
                                                                    value={
                                                                        item.growth
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ─── 3. BIOMETRIC GALLERY (IF ANY) ─── */}
                {galleries && galleries.length > 0 && (
                    <div className="bg-white rounded-md border border-slate-200/80 p-3 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                            <h3 className="text-xs font-bold text-slate-900">
                                Dokumentasi Galeri Biometrik
                            </h3>
                            <span className="text-[9px] text-slate-400">
                                {galleries.length} Foto
                            </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {galleries.slice(0, 4).map((g, idx) => (
                                <div
                                    key={idx}
                                    className="bg-gradient-to-br from-white via-white to-orange-50/40 border border-slate-200/80 rounded overflow-hidden"
                                >
                                    <div className="aspect-square bg-slate-100">
                                        <img
                                            src={g.image || g.image_path}
                                            alt="Biometric"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {g.notes && (
                                        <p className="p-1 text-[8.5px] italic text-slate-600 line-clamp-1 border-t border-slate-100">
                                            "{g.notes}"
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─── 4. SIGNATURE / VERIFICATION FOOTER (PRINT-READY) ─── */}
                <div className="pt-4 border-t border-slate-200 grid grid-cols-3 gap-4 text-center text-xs">
                    <div>
                        <span className="text-[10px] text-slate-400 block mb-12">
                            Atlet / Klien
                        </span>
                        <strong className="text-slate-800 block text-xs underline">
                            {athlete?.name}
                        </strong>
                    </div>
                    <div>
                        <span className="text-[10px] text-slate-400 block mb-12">
                            Pelatih Kepala / Head Coach
                        </span>
                        <strong className="text-slate-800 block text-xs underline">
                            {stats?.coaches_text !== "-"
                                ? stats?.coaches_text
                                : "Pelatih Olympus"}
                        </strong>
                    </div>
                    <div>
                        <span className="text-[10px] text-slate-400 block mb-12">
                            Direktur Performa Olahraga
                        </span>
                        <strong className="text-slate-800 block text-xs underline">
                            Olympus Performance Lead
                        </strong>
                    </div>
                </div>
            </div>
        </div>
    );
}
