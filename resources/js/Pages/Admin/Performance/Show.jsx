import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import PageHeader from "@/Components/Common/PageHeader";
import PageFooter from "@/Components/Common/PageFooter";
import {
    ArrowLeft,
    Edit3,
    Calendar,
    FileText,
    Target,
    Activity,
    TrendingUp,
    TrendingDown,
    Minus,
    Compass,
    Sparkles,
} from "lucide-react";
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend,
    Tooltip as RechartsTooltip,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    BarChart,
    Bar,
    LabelList,
} from "recharts";

// --- HELPER FORMAT NUMBERS ---
const formatNumber = (val) => {
    if (val === undefined || val === null || val === "") return "-";
    return Number(val).toLocaleString("id-ID", { maximumFractionDigits: 2 });
};

const formatPercent = (val) => {
    if (val === undefined || val === null) return "-";
    return (
        Number(val).toLocaleString("id-ID", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        }) + "%"
    );
};

const formatScore = (val) => {
    if (val === undefined || val === null) return 0;
    return Number(val) % 1 === 0 ? Number(val) : Number(val).toFixed(1);
};

const GrowthIndicator = ({ value, hasPrevious }) => {
    if (!hasPrevious || value === undefined || value === null)
        return (
            <span className="text-slate-300 text-[10px] font-medium">-</span>
        );
    if (value > 0)
        return (
            <span className="inline-flex items-center text-emerald-600 text-[10.5px] font-bold">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +{formatNumber(value)}
                %
            </span>
        );
    if (value < 0)
        return (
            <span className="inline-flex items-center text-rose-500 text-[10.5px] font-bold">
                <TrendingDown className="w-3 h-3 mr-0.5" />{" "}
                {formatNumber(value)}%
            </span>
        );
    return (
        <span className="inline-flex items-center text-slate-400 text-[10.5px] font-bold">
            <Minus className="w-3 h-3 mr-0.5" /> 0%
        </span>
    );
};

const getScoreColor = (val) => {
    if (val >= 90) return "#059669"; // Emerald
    if (val >= 80) return "#0d9488"; // Teal
    if (val >= 70) return "#d97706"; // Amber
    if (val >= 60) return "#ea580c"; // Orange
    return "#e11d48"; // Rose
};

const getScoreBadge = (score) => {
    const val = parseFloat(score);
    if (val >= 90)
        return {
            label: "Sangat Baik",
            color: "text-emerald-600",
        };
    if (val >= 80)
        return {
            label: "Baik",
            color: "text-teal-600",
        };
    if (val >= 70)
        return {
            label: "Cukup",
            color: "text-amber-600",
        };
    if (val >= 60)
        return {
            label: "Kurang",
            color: "text-orange-600",
        };
    return {
        label: "Sangat Kurang",
        color: "text-rose-600",
    };
};

export default function Show({
    test,
    current_score,
    radar_data = [],
    item_analysis = [],
    history = [],
    historical_labels = [],
}) {
    const { auth } = usePage().props;
    const isAthlete = auth.user.role === "athlete";
    const hasPrevious = history && history.length > 1;

    const athleteInitial = test.athlete?.name
        ? test.athlete.name.charAt(0).toUpperCase()
        : "A";

    const status = getScoreBadge(current_score);
    const historicalColors = ["#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8"];

    const gaugeScore = Math.min(100, Math.max(0, current_score || 0));
    const gaugeOffset = 201.06 - (201.06 * gaugeScore) / 100;

    return (
        <AppLayout title={`Hasil Tes Fisik - ${test.athlete?.name || "Atlet"}`}>
            <Head
                title={`Hasil Tes Fisik - ${test.athlete?.name || "Atlet"}`}
            />

            <div className="space-y-4 pb-4">
                {/* ─── PAGE HEADER & ACTIONS ─── */}
                <div className="space-y-1">
                    <Link
                        href={route("admin.performance.index")}
                        className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-orange-600 transition-colors gap-1.5"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Tes
                        Fisik
                    </Link>
                    <PageHeader
                        title="Analisis Tes Fisik"
                        description={`Hasil asesmen performa fisik, peta keterampilan, dan rekam perbandingan parameter ${test.athlete?.name || "atlet"}.`}
                        actions={
                            !isAthlete && (
                                <Link
                                    href={route(
                                        "admin.performance.edit",
                                        test.id,
                                    )}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-white via-white to-orange-50/70 hover:to-orange-100/80 text-orange-600 hover:text-orange-700 border border-slate-200 hover:border-slate-300 rounded-md text-xs font-bold transition-all shadow-2xs"
                                >
                                    <Edit3 className="w-3.5 h-3.5" /> Edit Nilai
                                </Link>
                            )
                        }
                    />
                </div>

                {/* ─── REPORT CONTENT WRAPPER ─── */}
                <div id="report-content" className="space-y-4">
                    {/* ═══════════════════════════════════════════════════════════
                        1. DASHBOARD ATAS: SPLIT 2-KOLOM (KIRI & KANAN EGALITER)
                       ═══════════════════════════════════════════════════════════ */}
                    <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                        {/* ─── KOLOM KIRI: HERO CARD + DUAL CHARTS ─── */}
                        <div className="flex-1 min-w-0 flex flex-col gap-4">
                            {/* Athlete Hero Card */}
                            <div className="bg-white rounded-lg border border-slate-200/80 shadow-2xs overflow-hidden">
                                {/* Cover Banner */}
                                <div className="relative h-20 sm:h-24 bg-gradient-to-r from-white via-orange-50/50 to-amber-50/60 border-b border-slate-100 p-3 flex justify-between items-start overflow-hidden">
                                    <div className="flex items-center gap-2 z-10">
                                        <span className="text-[10px] font-bold text-orange-700 bg-white/90 border border-slate-200/80 px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                                            <Sparkles className="w-3 h-3 text-orange-500" />
                                            Laporan Tes Resmi
                                        </span>
                                    </div>
                                    <span className="relative z-10 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-slate-200/80 text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                                        REF ID: {test.name}
                                    </span>
                                </div>

                                {/* Content Container Below Banner */}
                                <div className="px-5 pb-4 pt-2.5 sm:pt-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        {/* Left: Avatar + Athlete Identity */}
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <div className="relative -mt-10 sm:-mt-12 w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] rounded-md border-[3px] border-white shadow-md overflow-hidden bg-white text-orange-600 font-black text-xl sm:text-2xl flex items-center justify-center shrink-0 z-10">
                                                {test.athlete?.profile_photo ? (
                                                    <img
                                                        src={
                                                            test.athlete
                                                                .profile_photo_url ||
                                                            `/storage/${test.athlete.profile_photo}`
                                                        }
                                                        alt={test.athlete?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="leading-none select-none">
                                                        {athleteInitial}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                                                        {test.athlete?.name ||
                                                            "Unknown"}
                                                    </h2>
                                                    <span className="inline-flex items-center gap-1 font-bold text-orange-700 bg-orange-50 border border-orange-200/70 px-2 py-0.5 rounded text-[10px]">
                                                        <Compass className="w-2.5 h-2.5 text-orange-500" />
                                                        {test.athlete?.sport
                                                            ?.name ||
                                                            "Tanpa Cabor"}
                                                    </span>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border bg-slate-100 text-slate-700 border-slate-200/70">
                                                        Sesi: {test.name}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
                                                    <span className="inline-flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                        Pelaksanaan:{" "}
                                                        <strong className="text-slate-700">
                                                            {test.date}
                                                        </strong>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Quick Metrik Badges */}
                                        <div className="grid grid-cols-2 gap-2 shrink-0">
                                            <div className="px-3 py-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-center min-w-[85px]">
                                                <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                                    Tanggal
                                                </span>
                                                <span className="text-xs font-bold text-slate-800 leading-tight">
                                                    {test.date}
                                                </span>
                                            </div>
                                            <div className="px-3 py-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-center min-w-[85px]">
                                                <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                                    Parameter
                                                </span>
                                                <span className="text-xs font-black text-slate-900 leading-tight">
                                                    {item_analysis.length} Item
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dual Charts Grid (Radar & Area History) */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Radar Chart Card */}
                                <div className="bg-gradient-to-br from-white via-white to-orange-50/30 p-4 sm:p-5 rounded-lg border border-slate-200/80 shadow-2xs flex flex-col justify-between h-full">
                                    <div className="mb-2">
                                        <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 flex items-center gap-1.5 leading-tight">
                                            <Target className="w-3.5 h-3.5 text-orange-500" />
                                            Peta Keterampilan Fisik
                                        </h3>
                                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                            Profil atribut fisik vs target ideal
                                            (0 – 100)
                                        </p>
                                    </div>

                                    <div className="flex-1 w-full min-h-[220px] py-1">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <RadarChart
                                                cx="50%"
                                                cy="50%"
                                                outerRadius="66%"
                                                data={radar_data}
                                            >
                                                <PolarGrid
                                                    stroke="#e2e8f0"
                                                    strokeDasharray="3 3"
                                                />
                                                <PolarAngleAxis
                                                    dataKey="subject"
                                                    tick={({
                                                        payload,
                                                        x,
                                                        y,
                                                        cx,
                                                        cy,
                                                        ...rest
                                                    }) => {
                                                        const item =
                                                            radar_data?.find(
                                                                (d) =>
                                                                    d.subject ===
                                                                    payload.value,
                                                            );
                                                        const labelName =
                                                            payload.value ===
                                                            "Strength Endurance"
                                                                ? "Str. Endurance"
                                                                : payload.value;
                                                        const valStr = item
                                                            ? ` (${formatScore(item.A)})`
                                                            : "";
                                                        return (
                                                            <text
                                                                {...rest}
                                                                x={x}
                                                                y={y}
                                                                fill="#475569"
                                                                fontSize={9.5}
                                                                fontWeight="bold"
                                                                textAnchor={
                                                                    x > cx
                                                                        ? "start"
                                                                        : x < cx
                                                                          ? "end"
                                                                          : "middle"
                                                                }
                                                            >
                                                                {labelName}
                                                                {valStr}
                                                            </text>
                                                        );
                                                    }}
                                                />
                                                <PolarRadiusAxis
                                                    angle={30}
                                                    domain={[0, 100]}
                                                    tick={false}
                                                    axisLine={false}
                                                />
                                                <Radar
                                                    name="Target Ideal"
                                                    dataKey="B"
                                                    stroke="#cbd5e1"
                                                    strokeWidth={1}
                                                    fill="#f8fafc"
                                                    fillOpacity={0.4}
                                                    strokeDasharray="3 3"
                                                />
                                                <Radar
                                                    name="Hasil Atlet"
                                                    dataKey="A"
                                                    stroke="#ea580c"
                                                    strokeWidth={2}
                                                    fill="#ea580c"
                                                    fillOpacity={0.25}
                                                    dot={{
                                                        r: 3.5,
                                                        fill: "#fff",
                                                        stroke: "#ea580c",
                                                        strokeWidth: 2,
                                                    }}
                                                />
                                                <RechartsTooltip
                                                    contentStyle={{
                                                        borderRadius: "6px",
                                                        border: "1px solid #e2e8f0",
                                                        backgroundColor:
                                                            "#ffffff",
                                                        boxShadow:
                                                            "0 4px 6px -1px rgba(0,0,0,0.05)",
                                                        fontSize: "11px",
                                                        fontWeight: "700",
                                                        padding: "6px 10px",
                                                    }}
                                                />
                                                <Legend
                                                    iconType="circle"
                                                    wrapperStyle={{
                                                        fontSize: "11px",
                                                        paddingTop: "6px",
                                                    }}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Area History Chart Card */}
                                <div className="bg-gradient-to-br from-white via-white to-orange-50/30 p-4 sm:p-5 rounded-lg border border-slate-200/80 shadow-2xs flex flex-col justify-between h-full">
                                    <div className="mb-2">
                                        <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 flex items-center gap-1.5 leading-tight">
                                            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                            Tren Perkembangan Skor
                                        </h3>
                                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                            Riwayat progres skor rata-rata pada
                                            setiap sesi
                                        </p>
                                    </div>

                                    <div className="flex-1 w-full min-h-[220px] py-1">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <AreaChart
                                                data={history}
                                                margin={{
                                                    top: 22,
                                                    right: 15,
                                                    left: -20,
                                                    bottom: 0,
                                                }}
                                            >
                                                <defs>
                                                    <linearGradient
                                                        id="colorScore"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="5%"
                                                            stopColor="#ea580c"
                                                            stopOpacity={0.35}
                                                        />
                                                        <stop
                                                            offset="95%"
                                                            stopColor="#ea580c"
                                                            stopOpacity={0}
                                                        />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                    stroke="#f1f5f9"
                                                />
                                                <XAxis
                                                    dataKey="date"
                                                    tick={{
                                                        fontSize: 10,
                                                        fill: "#64748b",
                                                        fontWeight: "bold",
                                                    }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    dy={10}
                                                />
                                                <YAxis
                                                    domain={[0, 100]}
                                                    tick={{
                                                        fontSize: 10,
                                                        fill: "#94a3b8",
                                                    }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <RechartsTooltip
                                                    contentStyle={{
                                                        borderRadius: "6px",
                                                        border: "1px solid #e2e8f0",
                                                        backgroundColor:
                                                            "#ffffff",
                                                        boxShadow:
                                                            "0 4px 6px -1px rgba(0,0,0,0.05)",
                                                        fontSize: "11px",
                                                        fontWeight: "700",
                                                        padding: "6px 10px",
                                                    }}
                                                    formatter={(val) => [
                                                        `${formatNumber(val)}%`,
                                                        "Skor Rata-rata",
                                                    ]}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="score"
                                                    stroke="#ea580c"
                                                    strokeWidth={2.5}
                                                    fillOpacity={1}
                                                    fill="url(#colorScore)"
                                                    dot={{
                                                        r: 4,
                                                        fill: "#ea580c",
                                                        stroke: "#fff",
                                                        strokeWidth: 2,
                                                    }}
                                                    activeDot={{
                                                        r: 6,
                                                        fill: "#ea580c",
                                                        strokeWidth: 0,
                                                    }}
                                                >
                                                    <LabelList
                                                        dataKey="score"
                                                        position="top"
                                                        offset={10}
                                                        style={{
                                                            fontSize: "10.5px",
                                                            fontWeight: "bold",
                                                            fill: "#ea580c",
                                                        }}
                                                        formatter={(val) =>
                                                            `${formatNumber(val)}%`
                                                        }
                                                    />
                                                </Area>
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── KOLOM KANAN: GAUGE WIDGET + CATATAN PELATIH ─── */}
                        <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col gap-4">
                            {/* Performance Gauge Widget */}
                            <div className="bg-gradient-to-br from-white via-white to-orange-50/40 border border-slate-200/80 rounded-lg p-4 shadow-2xs hover:border-slate-300 transition-all">
                                <div className="mb-2 pb-2 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-slate-900">
                                        Skor Performa Sesi
                                    </h3>
                                    <span
                                        className={`text-xs font-bold ${status.color}`}
                                    >
                                        {status.label}
                                    </span>
                                </div>

                                {/* Semi-Circle Aspect Gauge Meter */}
                                <div className="flex flex-col items-center justify-center pt-2 pb-1">
                                    <div className="relative w-48 h-26 flex items-end justify-center">
                                        <svg
                                            className="w-48 h-26 overflow-visible"
                                            viewBox="0 0 160 90"
                                        >
                                            {/* Background Arc */}
                                            <path
                                                d="M 16 80 A 64 64 0 0 1 144 80"
                                                fill="none"
                                                stroke="#f1f5f9"
                                                strokeWidth="11"
                                                strokeLinecap="round"
                                            />
                                            {/* Value Arc */}
                                            <path
                                                d="M 16 80 A 64 64 0 0 1 144 80"
                                                fill="none"
                                                stroke="url(#performanceGaugeGradient)"
                                                strokeWidth="11"
                                                strokeLinecap="round"
                                                strokeDasharray="201.06"
                                                strokeDashoffset={gaugeOffset}
                                                className="transition-all duration-1000 ease-out"
                                            />
                                            <defs>
                                                <linearGradient
                                                    id="performanceGaugeGradient"
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
                                            <span className="text-3xl font-black text-slate-900 leading-none">
                                                {formatScore(current_score)}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                                                Rata-Rata Sesi
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* 2-Column Mini Metrics */}
                                <div className="grid grid-cols-2 gap-2 text-center mt-3 pt-2.5 border-t border-slate-100">
                                    <div className="p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                                        <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                            Target Ideal
                                        </span>
                                        <p className="text-xs sm:text-sm font-black text-slate-800 leading-tight mt-0.5">
                                            100{" "}
                                            <span className="text-[8.5px] font-normal text-slate-400">
                                                pts
                                            </span>
                                        </p>
                                    </div>

                                    <div className="p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                                        <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                            Status Akhir
                                        </span>
                                        <p
                                            className={`text-xs font-black leading-tight mt-0.5 ${status.color}`}
                                        >
                                            {status.label}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Coach Notes & Evaluation Card */}
                            <div className="bg-gradient-to-br from-white via-white to-orange-50/30 rounded-lg border border-slate-200/80 shadow-2xs p-4 flex-1 flex flex-col justify-between">
                                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                                    <FileText className="w-3.5 h-3.5 text-orange-500" />
                                    Catatan & Evaluasi Pelatih
                                </h4>
                                <p className="text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-line bg-white/80 p-3 rounded-md border border-slate-200/70 flex-1 overflow-y-auto">
                                    {test.notes ||
                                        "Belum ada catatan evaluasi dari pelatih untuk sesi ini."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════════
                        2. DASHBOARD BAWAH: FULL WIDTH 100% (TANPA KANAN-KIRI)
                       ═══════════════════════════════════════════════════════════ */}

                    {/* Komparasi Sesi Terakhir (Bar Chart - FULL WIDTH) */}
                    <div className="bg-white rounded-lg border border-slate-200/80 shadow-2xs p-4 sm:p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
                                    <Activity className="w-3.5 h-3.5 text-orange-500" />
                                    Komparasi Sesi Terakhir
                                </h3>
                                <p className="text-[10.5px] text-slate-400 font-medium mt-0.5">
                                    Skor persentase capaian per item (
                                    {historical_labels
                                        ? historical_labels.length + 1
                                        : 1}{" "}
                                    sesi)
                                </p>
                            </div>
                        </div>

                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={item_analysis}
                                    margin={{
                                        top: 10,
                                        right: 15,
                                        left: 10,
                                        bottom: 45,
                                    }}
                                    barGap={2}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#f1f5f9"
                                    />
                                    <XAxis
                                        dataKey="name"
                                        tick={{
                                            fontSize: 9.5,
                                            fill: "#64748b",
                                            fontWeight: 600,
                                        }}
                                        angle={-35}
                                        textAnchor="end"
                                        interval={0}
                                        height={50}
                                        dy={6}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis domain={[0, 100]} hide />
                                    <RechartsTooltip
                                        cursor={{ fill: "#f8fafc" }}
                                        contentStyle={{
                                            borderRadius: "6px",
                                            border: "1px solid #e2e8f0",
                                            boxShadow:
                                                "0 4px 6px -1px rgba(0,0,0,0.05)",
                                            fontSize: "11px",
                                            fontWeight: "700",
                                        }}
                                        formatter={(val) => [
                                            `${formatPercent(val)}`,
                                            "Skor",
                                        ]}
                                    />
                                    <Legend
                                        verticalAlign="top"
                                        align="right"
                                        wrapperStyle={{
                                            fontSize: "11px",
                                            paddingBottom: "8px",
                                        }}
                                        iconType="circle"
                                    />

                                    {historical_labels &&
                                        historical_labels.map(
                                            (label, index) => {
                                                const colorIndex =
                                                    4 -
                                                    historical_labels.length +
                                                    index;
                                                const color =
                                                    historicalColors[
                                                        colorIndex
                                                    ] || "#cbd5e1";

                                                return (
                                                    <Bar
                                                        key={label.key}
                                                        name={label.name}
                                                        dataKey={label.key}
                                                        fill={color}
                                                        radius={[3, 3, 0, 0]}
                                                        barSize={10}
                                                    />
                                                );
                                            },
                                        )}

                                    <Bar
                                        name="Tes Ini"
                                        dataKey="score"
                                        fill="#ea580c"
                                        radius={[3, 3, 0, 0]}
                                        barSize={10}
                                    >
                                        <LabelList
                                            dataKey="score"
                                            position="top"
                                            offset={6}
                                            angle={-90}
                                            textAnchor="start"
                                            style={{
                                                fontSize: "8.5px",
                                                fontWeight: "bold",
                                                fill: "#ea580c",
                                            }}
                                            formatter={(val) =>
                                                `${formatNumber(val)}%`
                                            }
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Rincian Hasil & Capaian Parameter (Tabel - FULL WIDTH) */}
                    <div className="bg-white rounded-lg border border-slate-200/80 shadow-2xs overflow-hidden">
                        <div className="px-4 py-3 bg-gradient-to-r from-white via-orange-50/20 to-white border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 text-xs sm:text-[13px]">
                                Rincian Hasil & Capaian Parameter
                            </h3>
                            <span className="text-[10.5px] font-semibold text-slate-400">
                                {item_analysis.length} Parameter Diuji
                            </span>
                        </div>

                        <div className="overflow-x-auto w-full custom-scrollbar">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50/80 text-[10px] text-slate-400 font-bold border-b border-slate-200/80 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3">
                                            Parameter Tes
                                        </th>
                                        <th className="px-4 py-3 text-center">
                                            Hasil (Nilai Riil)
                                        </th>
                                        <th className="px-4 py-3 text-center hidden md:table-cell">
                                            Target Benchmark
                                        </th>
                                        <th className="px-4 py-3 text-center bg-slate-100/40 hidden md:table-cell">
                                            Sesi Lalu (%)
                                        </th>
                                        <th className="px-4 py-3 text-center bg-orange-50/40 text-orange-700">
                                            Skor Capaian (%)
                                        </th>
                                        <th className="px-4 py-3 text-center hidden sm:table-cell">
                                            Tren
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {item_analysis.map((item, idx) => (
                                        <tr
                                            key={idx}
                                            className="hover:bg-orange-50/20 transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="font-bold text-slate-800 text-xs">
                                                    {item.name}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-medium">
                                                    {item.category}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center font-black text-slate-900 text-sm whitespace-nowrap">
                                                {formatNumber(
                                                    item.result_value,
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center hidden md:table-cell">
                                                <div className="inline-flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600 border border-slate-200/70">
                                                    <Target className="w-2.5 h-2.5 text-orange-500" />
                                                    {formatNumber(
                                                        item.target_value,
                                                    )}{" "}
                                                    {item.unit}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center bg-slate-50/30 text-slate-400 font-medium text-xs hidden md:table-cell">
                                                {hasPrevious
                                                    ? formatPercent(
                                                          item.previous_score,
                                                      )
                                                    : "-"}
                                            </td>
                                            <td className="px-4 py-3 text-center bg-orange-50/30">
                                                <span
                                                    className="font-black text-xs sm:text-sm"
                                                    style={{
                                                        color: getScoreColor(
                                                            item.score,
                                                        ),
                                                    }}
                                                >
                                                    {formatPercent(item.score)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center hidden sm:table-cell">
                                                <div className="flex justify-center">
                                                    <GrowthIndicator
                                                        value={item.growth}
                                                        hasPrevious={
                                                            hasPrevious
                                                        }
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    <tr className="bg-gradient-to-r from-orange-50/30 via-white to-orange-50/40 border-t-2 border-slate-200">
                                        <td
                                            colSpan="100%"
                                            className="px-4 py-3"
                                        >
                                            <div className="flex justify-end items-center gap-3">
                                                <span className="font-bold text-slate-500 text-xs">
                                                    Total Skor Rata-rata:
                                                </span>
                                                <span className="font-black text-xl text-orange-600">
                                                    {formatPercent(
                                                        current_score,
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <PageFooter className="!mt-6 !pt-4 !pb-1" />
            </div>
        </AppLayout>
    );
}
