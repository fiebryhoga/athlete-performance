import React from "react";
import {
    ShieldCheck,
    Compass,
    User,
    TrendingUp,
    TrendingDown,
    Minus,
} from "lucide-react";
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

export default function ProfilingPrintDocument({
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
    clubLogo,
}) {
    const calculateBMI = (h, w) => {
        if (!h || !w) return "-";
        const heightInM = h / 100;
        const bmiVal = w / (heightInM * heightInM);
        return parseFloat(bmiVal.toFixed(1));
    };

    const bmi = calculateBMI(athlete?.height, athlete?.weight);
    const initial = athlete?.name ? athlete.name.charAt(0).toUpperCase() : "-";

    const getBMIStatus = (val) => {
        if (val === "-") return { label: "-", color: "text-slate-500" };
        if (val < 18.5)
            return { label: "Underweight", color: "text-amber-600" };
        if (val >= 18.5 && val <= 24.9)
            return { label: "Ideal", color: "text-emerald-600" };
        if (val >= 25 && val <= 29.9)
            return { label: "Overweight", color: "text-orange-600" };
        return { label: "Obese", color: "text-rose-600" };
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
                <span className="inline-flex items-center text-emerald-600 text-[9.5px] font-bold">
                    <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> +{value}%
                </span>
            );
        if (value < 0)
            return (
                <span className="inline-flex items-center text-rose-500 text-[9.5px] font-bold">
                    <TrendingDown className="w-2.5 h-2.5 mr-0.5" /> {value}%
                </span>
            );
        return (
            <span className="inline-flex items-center text-slate-400 text-[9.5px] font-bold">
                <Minus className="w-2.5 h-2.5 mr-0.5" /> 0%
            </span>
        );
    };

    // Sort item analysis from best/highest score to lowest
    const sortedItemAnalysis = [...(itemAnalysis || [])].sort(
        (a, b) => (Number(b.score) || 0) - (Number(a.score) || 0),
    );

    const currentDate = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const avgScore = Number(stats?.avg_score || stats?.average_score || 0);

    return (
        <div
            style={{
                width: "1120px",
                backgroundColor: "#ffffff",
                color: "#0f172a",
                padding: "20px 24px",
                fontFamily: "system-ui, -apple-system, sans-serif",
            }}
        >
            {/* ─── 1. OFFICIAL DOCUMENT HEADER (LANDSCAPE FULL WIDTH) ─── */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b-2 border-slate-900">
                <div className="flex items-center gap-3">
                    <img
                        src="/assets/images/otslogo2.png"
                        alt="OTS Logo"
                        className="h-10 w-auto object-contain"
                        onError={(e) => {
                            e.target.style.display = "none";
                        }}
                    />
                    <div>
                        <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">
                            Laporan Profiling & Analisis Performa
                        </h1>
                        <p className="text-[9px] text-slate-500 font-medium">
                            Olympus Training Surabaya - Performance Hub
                        </p>
                    </div>
                </div>

                <div className="text-right flex items-center gap-4">
                    <div>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">
                            Tanggal Cetak
                        </span>
                        <span className="text-[11px] font-bold text-slate-800">
                            {currentDate}
                        </span>
                    </div>
                </div>
            </div>

            {/* ─── 2. TOP ROW: HERO PROFILE BANNER (FULL WIDTH) ─── */}
            <div className="bg-white rounded-md border border-slate-200 shadow-2xs overflow-hidden mb-2.5">
                <div className="h-10 bg-gradient-to-r from-white via-orange-50/60 to-amber-50/70 border-b border-slate-100 px-3 py-1.5 flex justify-end items-start">
                    <span className="inline-flex items-center gap-1.5 bg-white/95 border border-slate-200 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                        <ShieldCheck size={11} className="text-orange-500" />
                        <span>
                            {stats?.package_name ||
                                (stats?.sport ? `${stats.sport}` : "Member")}
                        </span>
                    </span>
                </div>

                <div className="px-3 pb-2 pt-0.5">
                    <div className="flex flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="relative -mt-6 w-[52px] h-[52px] rounded-md border-2 border-white shadow-md overflow-hidden bg-white text-orange-600 font-black text-lg flex items-center justify-center shrink-0">
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
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xs font-black text-slate-900 leading-tight">
                                        {athlete?.name || "Athlete"}
                                    </h2>
                                    <span className="text-[9px] font-mono text-slate-400 font-bold">
                                        @{athlete?.username || "-"}
                                    </span>
                                    <span className="inline-flex items-center gap-1 font-bold text-orange-700 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded text-[8.5px]">
                                        <Compass
                                            size={9}
                                            className="text-orange-500"
                                        />
                                        {stats?.sport ||
                                            athlete?.sport?.name ||
                                            "Umum"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-[9.5px] text-slate-500 font-medium">
                                    <span className="inline-flex items-center gap-1">
                                        <User
                                            size={9}
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

                        {/* 4 Biometrics Sub-Boxes */}
                        <div className="grid grid-cols-4 gap-1.5 shrink-0">
                            <div className="px-3 py-1 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200 text-center min-w-[70px]">
                                <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                    Tinggi
                                </span>
                                <span className="text-xs font-black text-slate-900 leading-tight">
                                    {athlete?.height || "-"}{" "}
                                    <span className="text-[7.5px] font-normal text-slate-400">
                                        cm
                                    </span>
                                </span>
                            </div>

                            <div className="px-3 py-1 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200 text-center min-w-[70px]">
                                <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                    Berat
                                </span>
                                <span className="text-xs font-black text-slate-900 leading-tight">
                                    {athlete?.weight || "-"}{" "}
                                    <span className="text-[7.5px] font-normal text-slate-400">
                                        kg
                                    </span>
                                </span>
                            </div>

                            <div className="px-3 py-1 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200 text-center min-w-[70px]">
                                <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                    Usia
                                </span>
                                <span className="text-xs font-black text-slate-900 leading-tight">
                                    {athlete?.age || "-"}{" "}
                                    <span className="text-[7.5px] font-normal text-slate-400">
                                        thn
                                    </span>
                                </span>
                            </div>

                            <div className="px-3 py-1 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200 text-center min-w-[70px]">
                                <span
                                    className={`text-[7.5px] font-bold block truncate ${bmiStatus.color}`}
                                >
                                    {bmiStatus.label}
                                </span>
                                <span
                                    className={`text-xs font-black leading-tight ${bmiStatus.color}`}
                                >
                                    {bmi}{" "}
                                    <span className="text-[7.5px] font-normal text-slate-400">
                                        BMI
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── 3. MAIN CONTENT: 3 BALANCED LANDSCAPE COLUMNS ─── */}
            <div className="grid grid-cols-12 gap-2.5 items-start mb-2.5">
                {/* ═══ KOLOM 1 (4/12): SCORE GAUGE & STRENGTHS/PRIORITIES ═══ */}
                <div className="col-span-4 space-y-2.5">
                    {/* Semi-Circle Aspect Gauge Card */}
                    <div className="bg-white border border-slate-200 rounded-md p-2.5 shadow-2xs">
                        <div className="mb-1 pb-1 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-[10.5px] font-bold text-slate-900">
                                Skor Performa
                            </h3>
                            <span
                                className={`text-[9.5px] font-bold ${
                                    avgScore >= 90
                                        ? "text-emerald-600"
                                        : avgScore >= 80
                                          ? "text-teal-600"
                                          : avgScore >= 70
                                            ? "text-amber-600"
                                            : avgScore >= 60
                                              ? "text-orange-600"
                                              : "text-rose-600"
                                }`}
                            >
                                {avgScore >= 90
                                    ? "Sangat Baik"
                                    : avgScore >= 80
                                      ? "Baik"
                                      : avgScore >= 70
                                        ? "Cukup"
                                        : avgScore >= 60
                                          ? "Kurang"
                                          : "Sangat Kurang"}
                            </span>
                        </div>

                        <div className="flex flex-col items-center justify-center pt-0.5 pb-0.5">
                            <div className="relative w-36 h-20 flex items-end justify-center">
                                <svg
                                    className="w-36 h-20 overflow-visible"
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
                                        stroke="url(#aspectGaugeGradientLandscape)"
                                        strokeWidth="11"
                                        strokeLinecap="round"
                                        strokeDasharray="201.06"
                                        strokeDashoffset={
                                            201.06 -
                                            (201.06 *
                                                Math.min(
                                                    100,
                                                    Math.max(0, avgScore),
                                                )) /
                                                100
                                        }
                                    />
                                    <defs>
                                        <linearGradient
                                            id="aspectGaugeGradientLandscape"
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
                                    <span className="text-xl font-black text-slate-900 leading-none">
                                        {formatScore(avgScore)}
                                    </span>
                                    <span className="text-[8px] font-bold text-slate-400 block mt-0.5">
                                        Rata-Rata Tes
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Mini 3 Stats */}
                        <div className="grid grid-cols-3 gap-1 text-center mt-1.5 pt-1.5 border-t border-slate-100">
                            <div className="p-1 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80">
                                <span className="text-[7px] font-bold text-slate-400 uppercase block">
                                    Total Sesi
                                </span>
                                <p className="text-[10px] font-black text-slate-800 leading-tight">
                                    {stats?.total_sessions ||
                                        stats?.sessions ||
                                        0}
                                </p>
                            </div>
                            <div className="p-1 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80">
                                <span className="text-[7px] font-bold text-slate-400 uppercase block">
                                    Puncak
                                </span>
                                <p className="text-[10px] font-black text-emerald-600 leading-tight">
                                    {formatScore(
                                        stats?.highest_score ||
                                            stats?.max_score,
                                    )}
                                </p>
                            </div>
                            <div className="p-1 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80">
                                <span className="text-[7px] font-bold text-slate-400 uppercase block truncate">
                                    Terbaik
                                </span>
                                <p className="text-[10px] font-black text-orange-600 leading-tight truncate">
                                    {stats?.best_category || "-"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Keunggulan & Prioritas */}
                    <div className="space-y-2">
                        {/* Keunggulan Fisik */}
                        <div className="bg-white p-2 rounded-md border border-slate-200 shadow-2xs">
                            <div className="mb-1 pb-0.5 border-b border-slate-100">
                                <h4 className="text-[9.5px] font-bold text-slate-900">
                                    Keunggulan Fisik (&gt;70%)
                                </h4>
                            </div>
                            <div className="space-y-1">
                                {strengths && strengths.length > 0 ? (
                                    strengths.slice(0, 3).map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="p-1 rounded bg-gradient-to-br from-white via-white to-orange-50/40 border border-slate-200/80 space-y-0.5"
                                        >
                                            <div className="flex items-center justify-between text-[9px]">
                                                <span className="font-bold text-slate-800 truncate">
                                                    {item.name}
                                                </span>
                                                <span className="font-black text-emerald-600">
                                                    {formatScore(item.score)}%
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
                                    <p className="text-[8.5px] text-slate-400 italic text-center py-0.5">
                                        Belum ada kategori di atas 70%
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Prioritas Peningkatan */}
                        <div className="bg-white p-2 rounded-md border border-slate-200 shadow-2xs">
                            <div className="mb-1 pb-0.5 border-b border-slate-100">
                                <h4 className="text-[9.5px] font-bold text-slate-900">
                                    Prioritas Peningkatan (&le;70%)
                                </h4>
                            </div>
                            <div className="space-y-1">
                                {weaknesses && weaknesses.length > 0 ? (
                                    weaknesses.slice(0, 3).map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="p-1 rounded bg-gradient-to-br from-white via-white to-orange-50/40 border border-slate-200/80 space-y-0.5"
                                        >
                                            <div className="flex items-center justify-between text-[9px]">
                                                <span className="font-bold text-slate-800 truncate">
                                                    {item.name}
                                                </span>
                                                <span className="font-black text-rose-500">
                                                    {formatScore(item.score)}%
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
                                    <p className="text-[8.5px] text-slate-400 italic text-center py-0.5">
                                        Semua kategori berada di atas 70%
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ KOLOM 2 (4/12): RADAR CHART & BAR CHART & MULTI-DOMAIN ═══ */}
                <div className="col-span-4 space-y-2.5">
                    {/* Radar Chart */}
                    <div className="bg-white p-2 rounded-md border border-slate-200 shadow-2xs flex flex-col justify-between">
                        <div className="mb-0.5">
                            <h3 className="text-[10px] font-bold text-slate-900 leading-tight">
                                Radar Kategori Fisik
                            </h3>
                            <p className="text-[8px] text-slate-400">
                                Evaluasi atribut fisik (0 – 100)
                            </p>
                        </div>
                        <div className="h-[140px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
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
                                            fontSize: 7.5,
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

                    {/* Status Multi-Domain Asesmen */}
                    <div className="bg-white border border-slate-200 rounded-md p-2 shadow-2xs space-y-1.5">
                        <div className="pb-0.5 border-b border-slate-100">
                            <h3 className="text-[10px] font-bold text-slate-900">
                                Status Multi-Domain Asesmen
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                            {/* PHV */}
                            <div className="p-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80 space-y-0.5">
                                <span className="text-[8px] font-bold text-slate-400 uppercase block">
                                    PHV
                                </span>
                                {latest_phv ? (
                                    <div className="flex items-center justify-between text-[8.5px]">
                                        <span className="font-bold text-slate-800">
                                            Offset:{" "}
                                            {Number(
                                                latest_phv.maturity_offset,
                                            ).toFixed(1)}
                                            th
                                        </span>
                                        <span className="font-bold text-orange-600">
                                            +
                                            {latest_phv.remaining_growth || "-"}
                                            cm
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-[8px] text-slate-400 italic">
                                        Belum ada PHV
                                    </span>
                                )}
                            </div>

                            {/* Body Composition */}
                            <div className="p-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80 space-y-0.5">
                                <span className="text-[8px] font-bold text-slate-400 uppercase block">
                                    Komposisi
                                </span>
                                {latest_composition ? (
                                    <div className="flex items-center justify-between text-[8.5px]">
                                        <span className="font-bold text-orange-600">
                                            Fat:{" "}
                                            {latest_composition.body_fat_percentage ??
                                                "-"}
                                            %
                                        </span>
                                        <span className="font-bold text-slate-800">
                                            Msc:{" "}
                                            {latest_composition.muscle_mass ??
                                                "-"}
                                            kg
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-[8px] text-slate-400 italic">
                                        Belum ada data
                                    </span>
                                )}
                            </div>

                            {/* Wellness */}
                            <div className="p-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80 space-y-0.5">
                                <span className="text-[8px] font-bold text-slate-400 uppercase block">
                                    Wellness
                                </span>
                                {latest_wellness ? (
                                    <div className="flex items-center justify-between text-[8.5px]">
                                        <span className="font-bold text-emerald-600">
                                            Well:{" "}
                                            {latest_wellness.daily_wellness_score ??
                                                "-"}
                                            /30
                                        </span>
                                        <span className="font-bold text-orange-600">
                                            {latest_wellness.daily_load ?? 0}AU
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-[8px] text-slate-400 italic">
                                        Belum ada catatan
                                    </span>
                                )}
                            </div>

                            {/* DPA Posture */}
                            <div className="p-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80 space-y-0.5">
                                <span className="text-[8px] font-bold text-slate-400 uppercase block">
                                    Postur DPA
                                </span>
                                {latest_dpa ? (
                                    <span className="text-[8.5px] font-bold text-slate-800 truncate block">
                                        {latest_dpa.conclusion || "Normal"}
                                    </span>
                                ) : (
                                    <span className="text-[8px] text-slate-400 italic">
                                        Belum ada DPA
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ KOLOM 3 (4/12): PARAMETER TEST TABLE (SORTED BY SCORE DESCENDING) ═══ */}
                <div className="col-span-4 space-y-2.5">
                    <div className="bg-white rounded-md border border-slate-200 shadow-2xs overflow-hidden">
                        <div className="px-2.5 py-1.5 bg-gradient-to-r from-white via-orange-50/30 to-white border-b border-slate-200 flex items-center justify-between">
                            <h3 className="text-[10px] font-bold text-slate-900">
                                Rincian Parameter Tes
                            </h3>
                            <span className="text-[8px] text-slate-500 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                {sortedItemAnalysis.length} Item
                            </span>
                        </div>

                        <table className="w-full text-xs text-left">
                            <thead className="text-[7.5px] text-slate-500 bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-2 py-1">Item & Target</th>
                                    <th className="px-1.5 py-1 text-center">
                                        Hasil
                                    </th>
                                    <th className="px-2 py-1 text-right">
                                        Skor
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {sortedItemAnalysis
                                    .slice(0, 10)
                                    .map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="px-2 py-0.5">
                                                <div className="font-bold text-slate-900 text-[9.5px] leading-tight truncate max-w-[130px]">
                                                    {item.name}
                                                </div>
                                                <div className="text-[7.5px] text-slate-400 font-medium">
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
                                            <td className="px-1.5 py-0.5 text-center">
                                                <span className="font-black text-slate-900 text-[9.5px] block leading-tight">
                                                    {formatNumber(
                                                        item.result_value ||
                                                            item.result,
                                                    )}
                                                </span>
                                                <span className="text-[7px] text-slate-400">
                                                    {item.unit}
                                                </span>
                                            </td>
                                            <td className="px-2 py-0.5 text-right">
                                                <div className="inline-flex flex-col items-end">
                                                    <span
                                                        className={`font-black text-[9.5px] leading-tight ${
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

            {/* ─── 4. SIGNATURE / VERIFICATION FOOTER ─── */}
            <div className="pt-2 border-t border-slate-200 grid grid-cols-3 gap-3 text-center text-xs">
                <div>
                    <span className="text-[8px] text-slate-400 block mb-6">
                        Atlet / Klien
                    </span>
                    <strong className="text-slate-800 block text-[9.5px] underline">
                        {athlete?.name}
                    </strong>
                </div>
                <div>
                    <span className="text-[8px] text-slate-400 block mb-6">
                        Pelatih Kepala / Head Coach
                    </span>
                    <strong className="text-slate-800 block text-[9.5px] underline">
                        {stats?.coaches_text && stats.coaches_text !== "-"
                            ? stats.coaches_text
                            : "Pelatih Olympus"}
                    </strong>
                </div>
                <div>
                    <span className="text-[8px] text-slate-400 block mb-6">
                        Direktur Performa Olahraga
                    </span>
                    <strong className="text-slate-800 block text-[9.5px] underline">
                        Olympus Performance Lead
                    </strong>
                </div>
            </div>

            {/* ─── 5. FOOTER ─── */}
            <div className="mt-2 pt-1 border-t border-slate-100 text-center text-[7.5px] text-slate-400">
                Generated via Olympus Performance System &bull; Dokumen ini
                adalah laporan performa resmi Olympus Training Surabaya
            </div>
        </div>
    );
}
