import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/Common/PageHeader";
import AthleteGallery from "./Partials/AthleteGallery";
import ProfilingPdfDocument from "./Partials/ProfilingPdfDocument";
import { pdf } from "@react-pdf/renderer";
import {
    User,
    Calendar,
    Activity,
    Trophy,
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    Target,
    Scale,
    Ruler,
    Weight,
    Clock,
    Zap,
    AlertCircle,
    Minus,
    FileText,
    ChevronRight,
    Download,
    HeartPulse,
    Battery,
    History,
    ArrowRight,
    ShieldCheck,
    Sparkles,
    CheckCircle2,
    AlertTriangle,
    Dumbbell,
    Compass,
    Flame,
    Droplets,
    Bed,
    Info,
    Layers,
    Eye,
    Camera,
    Loader2,
} from "lucide-react";
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ComposedChart,
    Bar,
    Line,
    BarChart,
    LabelList,
} from "recharts";

export default function Show({
    athlete = {},
    galleries = [],
    stats = {},
    radar_data = [],
    comparison_data = [],
    item_analysis = [],
    history_data = [],
    strengths = [],
    weaknesses = [],
    has_data = false,
    historical_labels = [],
    daily_metrics = [],
    training_loads = [],
    latest_phv,
    latest_composition,
    latest_wellness,
    latest_dpa,
    latest_daily_metric,
}) {
    const safeAthlete = athlete || {};
    const [isExporting, setIsExporting] = useState(false);

    const handleDownloadPdf = async () => {
        if (isExporting) return;
        setIsExporting(true);
        try {
            const doc = (
                <ProfilingPdfDocument
                    athlete={safeAthlete}
                    stats={stats}
                    radarData={radar_data}
                    comparisonData={comparison_data}
                    itemAnalysis={item_analysis}
                    strengths={strengths}
                    weaknesses={weaknesses}
                    latest_phv={latest_phv}
                    latest_composition={latest_composition}
                    latest_wellness={latest_wellness}
                    latest_dpa={latest_dpa}
                />
            );
            const asPdf = pdf();
            asPdf.updateContainer(doc);
            const blob = await asPdf.toBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const cleanName = (safeAthlete?.name || "Athlete").replace(
                /[^a-zA-Z0-9_-]/g,
                "_",
            );
            a.download = `Profiling_${cleanName}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("PDF generation error:", err);
        } finally {
            setIsExporting(false);
        }
    };

    const calculateBMI = (h, w) => {
        if (!h || !w) return "-";
        const heightInM = h / 100;
        const bmiVal = w / (heightInM * heightInM);
        return parseFloat(bmiVal.toFixed(1));
    };

    const bmi = calculateBMI(safeAthlete.height, safeAthlete.weight);
    const initial = safeAthlete.name
        ? safeAthlete.name.charAt(0).toUpperCase()
        : "-";

    const getBMIStatus = (val) => {
        if (val === "-")
            return {
                label: "-",
                color: "text-slate-500",
                bg: "bg-slate-100 border-slate-200",
            };
        if (val < 18.5)
            return {
                label: "Underweight",
                color: "text-amber-600",
                bg: "bg-amber-50 border-amber-200",
            };
        if (val >= 18.5 && val <= 24.9)
            return {
                label: "Ideal",
                color: "text-emerald-600",
                bg: "bg-emerald-50 border-emerald-200",
            };
        if (val >= 25 && val <= 29.9)
            return {
                label: "Overweight",
                color: "text-orange-600",
                bg: "bg-orange-50 border-orange-200",
            };
        return {
            label: "Obese",
            color: "text-rose-600",
            bg: "bg-rose-50 border-rose-200",
        };
    };
    const bmiStatus = getBMIStatus(bmi);

    const getScoreBadge = (score) => {
        const val = parseFloat(score || 0);
        if (val >= 90)
            return { label: "Sangat Baik", color: "text-emerald-600" };
        if (val >= 80) return { label: "Baik", color: "text-teal-600" };
        if (val >= 70) return { label: "Cukup", color: "text-amber-600" };
        if (val >= 60) return { label: "Kurang", color: "text-orange-600" };
        return { label: "Sangat Kurang", color: "text-rose-600" };
    };
    const perfStatus = getScoreBadge(stats?.average_score);

    const isFemale =
        safeAthlete.gender === "P" ||
        safeAthlete.gender === "female" ||
        safeAthlete.gender === "Perempuan";
    const genderLabel = isFemale ? "Perempuan" : "Laki-laki";
    const coachNames =
        safeAthlete.coaches && safeAthlete.coaches.length > 0
            ? safeAthlete.coaches.map((c) => c.name).join(", ")
            : safeAthlete.coach?.name || null;

    const hasGroups = safeAthlete.groups && safeAthlete.groups.length > 0;
    const membershipLabel = hasGroups
        ? safeAthlete.groups.length > 1
            ? `${safeAthlete.groups.length} Grup`
            : safeAthlete.groups[0].name
        : safeAthlete.package?.name || "Privat";

    const formatScore = (val) => {
        if (val === undefined || val === null) return 0;
        return Number(val) % 1 === 0 ? Number(val) : Number(val).toFixed(1);
    };

    const formatNumber = (val) => {
        if (val === undefined || val === null) return "-";
        return Number(val) % 1 === 0 ? Number(val) : Number(val).toFixed(1);
    };

    const customTooltipStyle = {
        borderRadius: "6px",
        border: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
        fontSize: "11px",
        fontWeight: "700",
        padding: "6px 10px",
    };

    const GrowthIndicator = ({ value }) => {
        if (value === undefined || value === null)
            return <span className="text-slate-300">-</span>;
        if (value > 0)
            return (
                <span className="inline-flex items-center text-emerald-600 text-xs font-bold">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +{value}%
                </span>
            );
        if (value < 0)
            return (
                <span className="inline-flex items-center text-rose-500 text-xs font-bold">
                    <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> {value}%
                </span>
            );
        return (
            <span className="inline-flex items-center text-slate-400 text-xs font-bold">
                <Minus className="w-3.5 h-3.5 mr-0.5" /> 0%
            </span>
        );
    };

    return (
        <AppLayout title={`Profil - ${safeAthlete.name || "Athlete"}`}>
            <Head title={`Profil - ${safeAthlete.name || "Athlete Profile"}`} />

            <div className="space-y-3.5 pb-4">
                {/* ─── PAGE HEADER WITH BREADCRUMB & ACTIONS ─── */}
                <div className="space-y-1">
                    <Link
                        href={route("admin.athletes.index")}
                        className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors gap-1.5"
                    >
                        <ArrowLeft size={13} /> Kembali ke Profiling
                    </Link>
                    <PageHeader
                        title="Profiling"
                        description={`Evaluasi rekam jejak performa fisik, antropometri, dan beban latihan ${safeAthlete.name || "atlet"}.`}
                        actions={
                            safeAthlete.id ? (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleDownloadPdf}
                                        disabled={isExporting}
                                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 hover:border-slate-300 px-3 py-1.5 rounded-md font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                                    >
                                        {isExporting ? (
                                            <>
                                                <Loader2
                                                    size={13}
                                                    className="text-orange-500 animate-spin"
                                                />
                                                <span>Membuat PDF...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Download
                                                    size={13}
                                                    className="text-orange-500"
                                                />
                                                <span>Download PDF</span>
                                            </>
                                        )}
                                    </button>
                                    <Link
                                        href={route(
                                            "admin.individual-trainings.show",
                                            safeAthlete.id,
                                        )}
                                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3 py-1.5 rounded-md font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                                    >
                                        <Activity size={13} /> Program Latihan
                                    </Link>
                                </div>
                            ) : null
                        }
                    />
                </div>

                {/* ─── 2-COLUMN MAIN DASHBOARD LAYOUT ─── */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* ═══════════════════════════════════════
                        KOLOM KIRI — MAIN CONTENT (LEBAR)
                       ═══════════════════════════════════════ */}
                    <div className="flex-1 min-w-0 space-y-4">
                        {/* 1. Athlete Profile Hero Card (Cover Banner + Overlapping Avatar Style) */}
                        <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden hover:border-slate-300 transition-all">
                            {/* Cover Banner (Soft White-Orange Gradient) */}
                            <div className="relative h-20 sm:h-24 bg-gradient-to-r from-white via-orange-50/50 to-amber-50/60 border-b border-slate-100 p-3 flex justify-end items-start overflow-hidden">
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>
                                <span className="relative z-10 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-slate-200/80 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
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
                            <div className="px-5 pb-4 pt-2.5 sm:pt-3">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    {/* Left: Avatar overlapping banner + Identity */}
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div className="relative -mt-10 sm:-mt-12 w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-md border-[3px] border-white shadow-md overflow-hidden bg-white text-orange-600 font-black text-xl sm:text-2xl flex items-center justify-center shrink-0 z-10">
                                            {safeAthlete.profile_photo_url ? (
                                                <img
                                                    src={
                                                        safeAthlete.profile_photo_url
                                                    }
                                                    alt={safeAthlete.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="leading-none select-none">
                                                    {initial}
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                                                    {safeAthlete.name ||
                                                        "Unknown"}
                                                </h2>
                                                <span className="text-[10px] font-mono text-slate-400 font-bold">
                                                    @
                                                    {safeAthlete.username ||
                                                        "-"}
                                                </span>
                                                <span className="inline-flex items-center gap-1 font-bold text-orange-700 bg-orange-50 border border-orange-200/70 px-2 py-0.5 rounded text-[10px]">
                                                    <Compass
                                                        size={10}
                                                        className="text-orange-500"
                                                    />
                                                    {safeAthlete.sport?.name ||
                                                        "Tanpa Cabor"}
                                                </span>
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                                        hasGroups
                                                            ? "bg-blue-50 text-blue-700 border-blue-200/70"
                                                            : "bg-slate-100 text-slate-700 border-slate-200/70"
                                                    }`}
                                                >
                                                    {membershipLabel}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
                                                <span className="inline-flex items-center gap-1">
                                                    <User
                                                        size={11}
                                                        className="text-slate-400"
                                                    />
                                                    {genderLabel}
                                                </span>
                                                {coachNames && (
                                                    <>
                                                        <span className="text-slate-300">
                                                            •
                                                        </span>
                                                        <span>
                                                            Pelatih:{" "}
                                                            <strong className="text-slate-700 font-semibold">
                                                                {coachNames}
                                                            </strong>
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: 4 Biometrics Sub-Boxes with proper breathing room */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0 mt-1 lg:mt-0">
                                        <div className="px-3 py-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-center min-w-[70px]">
                                            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                                Tinggi
                                            </span>
                                            <span className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                                                {safeAthlete.height || "-"}{" "}
                                                <span className="text-[8.5px] font-normal text-slate-400">
                                                    cm
                                                </span>
                                            </span>
                                        </div>

                                        <div className="px-3 py-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-center min-w-[70px]">
                                            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                                Berat
                                            </span>
                                            <span className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                                                {safeAthlete.weight || "-"}{" "}
                                                <span className="text-[8.5px] font-normal text-slate-400">
                                                    kg
                                                </span>
                                            </span>
                                        </div>

                                        <div className="px-3 py-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-center min-w-[70px]">
                                            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                                Usia
                                            </span>
                                            <span className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                                                {safeAthlete.age || "-"}{" "}
                                                <span className="text-[8.5px] font-normal text-slate-400">
                                                    thn
                                                </span>
                                            </span>
                                        </div>

                                        <div className="px-3 py-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-center min-w-[70px]">
                                            <span
                                                className={`text-[8.5px] font-bold block truncate ${bmiStatus.color}`}
                                            >
                                                {bmiStatus.label}
                                            </span>
                                            <span
                                                className={`text-xs sm:text-sm font-black leading-tight ${bmiStatus.color}`}
                                            >
                                                {bmi}{" "}
                                                <span className="text-[8.5px] font-normal text-slate-400">
                                                    BMI
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Visualisasi Dual Chart (Radar & Bar Comparison) */}
                        {has_data ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                {/* Radar Chart Card */}
                                <div className="bg-gradient-to-br from-white via-white to-orange-50/40 p-4 sm:p-5 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
                                    {/* Header */}
                                    <div className="mb-2">
                                        <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                                            Radar Kategori Fisik
                                        </h3>
                                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                            Profil atribut fisik dari evaluasi
                                            tes terakhir (0 – 100)
                                        </p>
                                    </div>

                                    {/* Chart */}
                                    <div className="h-[230px] sm:h-[250px] w-full py-1">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <RadarChart
                                                cx="50%"
                                                cy="50%"
                                                outerRadius="68%"
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
                                                                fontWeight="600"
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
                                                    name="Performa Atlet"
                                                    dataKey="A"
                                                    stroke="#ea580c"
                                                    strokeWidth={2.5}
                                                    fill="#fed7aa"
                                                    fillOpacity={0.45}
                                                    dot={{
                                                        r: 3.5,
                                                        fill: "#fff",
                                                        stroke: "#ea580c",
                                                        strokeWidth: 2,
                                                    }}
                                                />
                                                <RechartsTooltip
                                                    contentStyle={
                                                        customTooltipStyle
                                                    }
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Footer Summary */}
                                    <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-[11px] font-normal text-slate-500">
                                        <div>
                                            Teratas:{" "}
                                            <strong className="text-slate-900 font-bold">
                                                {(() => {
                                                    if (
                                                        !radar_data ||
                                                        radar_data.length === 0
                                                    )
                                                        return "-";
                                                    const top = [
                                                        ...radar_data,
                                                    ].sort(
                                                        (a, b) =>
                                                            (b.A || 0) -
                                                            (a.A || 0),
                                                    )[0];
                                                    const name =
                                                        top?.subject ===
                                                        "Strength Endurance"
                                                            ? "Str. Endurance"
                                                            : top?.subject;
                                                    return `${name} (${formatScore(top?.A)})`;
                                                })()}
                                            </strong>
                                        </div>
                                        <div>
                                            Fokus:{" "}
                                            <strong className="text-orange-600 font-bold">
                                                {(() => {
                                                    if (
                                                        !radar_data ||
                                                        radar_data.length === 0
                                                    )
                                                        return "-";
                                                    const lowest = [
                                                        ...radar_data,
                                                    ].sort(
                                                        (a, b) =>
                                                            (a.A || 0) -
                                                            (b.A || 0),
                                                    )[0];
                                                    const name =
                                                        lowest?.subject ===
                                                        "Strength Endurance"
                                                            ? "Str. Endurance"
                                                            : lowest?.subject;
                                                    return `${name} (${formatScore(lowest?.A)})`;
                                                })()}
                                            </strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Comparison Bar Chart */}
                                <div className="bg-gradient-to-br from-white via-white to-orange-50/40 p-4 sm:p-5 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
                                    <div className="mb-2">
                                        <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                                            Komparasi Sesi Terkini
                                        </h3>
                                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                            Perbandingan kategori sesi terkini
                                            vs sebelumnya (0 – 100)
                                        </p>
                                    </div>
                                    <div className="h-[230px] sm:h-[250px] w-full py-1">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <BarChart
                                                data={comparison_data}
                                                margin={{
                                                    top: 22,
                                                    right: 0,
                                                    left: -20,
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
                                                        fontSize: 9,
                                                        fill: "#64748b",
                                                        fontWeight: 600,
                                                    }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <YAxis
                                                    domain={[0, 100]}
                                                    tick={{
                                                        fontSize: 9,
                                                        fill: "#94a3b8",
                                                    }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <RechartsTooltip
                                                    cursor={{ fill: "#f8fafc" }}
                                                    contentStyle={
                                                        customTooltipStyle
                                                    }
                                                />
                                                <Legend
                                                    wrapperStyle={{
                                                        fontSize: "10px",
                                                        paddingTop: "4px",
                                                    }}
                                                    iconType="circle"
                                                />
                                                <Bar
                                                    name="Sesi Sebelumnya"
                                                    dataKey="previous"
                                                    fill="#cbd5e1"
                                                    radius={[3, 3, 0, 0]}
                                                    barSize={14}
                                                >
                                                    <LabelList
                                                        dataKey="previous"
                                                        position="top"
                                                        fill="#64748b"
                                                        fontSize={8.5}
                                                        fontWeight="bold"
                                                        formatter={(val) =>
                                                            val > 0
                                                                ? `${formatScore(val)}`
                                                                : ""
                                                        }
                                                        offset={3}
                                                    />
                                                </Bar>
                                                <Bar
                                                    name="Sesi Terkini"
                                                    dataKey="latest"
                                                    fill="#f97316"
                                                    radius={[3, 3, 0, 0]}
                                                    barSize={14}
                                                >
                                                    <LabelList
                                                        dataKey="latest"
                                                        position="top"
                                                        fill="#ea580c"
                                                        fontSize={8.5}
                                                        fontWeight="bold"
                                                        formatter={(val) =>
                                                            val > 0
                                                                ? `${formatScore(val)}`
                                                                : ""
                                                        }
                                                        offset={3}
                                                    />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="border-t border-slate-100 pt-2.5 flex items-center text-[11px] font-normal text-slate-500">
                                        <span>
                                            Total Kategori:{" "}
                                            <strong className="text-slate-900 font-bold">
                                                {comparison_data?.length || 0}{" "}
                                                Elemen
                                            </strong>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {/* 4. Physical Strengths (>70%) vs Improvement Priorities (<=70%) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {/* Strengths */}
                            <div className="bg-gradient-to-br from-white via-white to-orange-50/40 p-3.5 sm:p-4 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
                                <div>
                                    <div className="mb-2.5 pb-2 border-b border-slate-100">
                                        <h3 className="text-[11.5px] sm:text-xs font-bold text-slate-900">
                                            Keunggulan Fisik (&gt;70%)
                                        </h3>
                                    </div>
                                    <div className="space-y-2">
                                        {strengths && strengths.length > 0 ? (
                                            strengths.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-2 rounded-md bg-slate-50/70 border border-slate-200/70 flex flex-col gap-1"
                                                >
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="font-bold text-slate-800 text-xs">
                                                            {item.name}
                                                        </span>
                                                        <span className="font-black text-emerald-600 text-xs">
                                                            {formatScore(
                                                                item.score,
                                                            )}
                                                            %
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                                                            style={{
                                                                width: `${Math.min(100, Math.max(0, item.score))}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-4 text-center text-slate-400 text-xs italic bg-slate-50/50 rounded-md border border-dashed border-slate-200">
                                                Belum ada kategori di atas 70%.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Weaknesses */}
                            <div className="bg-gradient-to-br from-white via-white to-orange-50/40 p-3.5 sm:p-4 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
                                <div>
                                    <div className="mb-2.5 pb-2 border-b border-slate-100">
                                        <h3 className="text-[11.5px] sm:text-xs font-bold text-slate-900">
                                            Prioritas Peningkatan (&le;70%)
                                        </h3>
                                    </div>
                                    <div className="space-y-2">
                                        {weaknesses && weaknesses.length > 0 ? (
                                            weaknesses.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-2 rounded-md bg-slate-50/70 border border-slate-200/70 flex flex-col gap-1"
                                                >
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="font-bold text-slate-800 text-xs">
                                                            {item.name}
                                                        </span>
                                                        <span className="font-black text-rose-500 text-xs">
                                                            {formatScore(
                                                                item.score,
                                                            )}
                                                            %
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-gradient-to-r from-rose-500 to-orange-400 h-full rounded-full transition-all duration-500"
                                                            style={{
                                                                width: `${Math.min(100, Math.max(0, item.score))}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-4 text-center text-slate-400 text-xs italic bg-slate-50/50 rounded-md border border-dashed border-slate-200">
                                                Semua kategori berada di atas
                                                70%.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 7. Galeri Biometrik (Moved to Left Column for Full Width) */}
                        <div className="space-y-2">
                            <AthleteGallery
                                athlete={safeAthlete}
                                galleries={
                                    galleries && galleries.length > 0
                                        ? galleries
                                        : safeAthlete.galleries || []
                                }
                            />
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════
                        KOLOM KANAN — PERFORMANCE STATS & MULTI-DOMAIN SIDEBAR (340px-380px)
                       ═══════════════════════════════════════ */}
                    <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 space-y-4">
                        {/* 1. Executive Performance Summary Widget (Semi-Circle Aspect Gauge Meter Style) */}
                        <div className="bg-gradient-to-br from-white via-white to-orange-50/40 border border-slate-200/80 rounded-md p-4 shadow-2xs hover:border-slate-300 transition-all">
                            <div className="mb-2 pb-2 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-xs font-bold text-slate-900">
                                    Skor Performa
                                </h3>
                                <span
                                    className={`text-xs font-bold ${perfStatus.color}`}
                                >
                                    {perfStatus.label}
                                </span>
                            </div>

                            {/* Semi-Circle Aspect Gauge Meter (Matching Reference) */}
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
                                            stroke="url(#aspectGaugeGradient)"
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
                                                            stats?.average_score ||
                                                                0,
                                                        ),
                                                    )) /
                                                    100
                                            }
                                            className="transition-all duration-1000 ease-out"
                                        />
                                        <defs>
                                            <linearGradient
                                                id="aspectGaugeGradient"
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
                                            {formatScore(stats?.average_score)}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                                            Rata-Rata Tes
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 3-Column Mini Metrics */}
                            <div className="grid grid-cols-3 gap-1.5 text-center mt-3 pt-2.5 border-t border-slate-100">
                                <div className="p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                                    <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                        Sesi Latihan
                                    </span>
                                    <p className="text-xs sm:text-sm font-black text-slate-800 leading-tight mt-0.5">
                                        {stats?.total_trainings ?? 0}{" "}
                                        <span className="text-[8.5px] font-normal text-slate-400">
                                            sesi
                                        </span>
                                    </p>
                                </div>

                                <div className="p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                                    <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                        Tes Fisik
                                    </span>
                                    <p className="text-xs sm:text-sm font-black text-orange-600 leading-tight mt-0.5">
                                        {stats?.total_tests ??
                                            stats?.total_sessions ??
                                            0}{" "}
                                        <span className="text-[8.5px] font-normal text-slate-400">
                                            tes
                                        </span>
                                    </p>
                                </div>

                                <div className="p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                                    <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                        Skor Puncak
                                    </span>
                                    <p className="text-xs sm:text-sm font-black text-emerald-600 leading-tight mt-0.5">
                                        {formatScore(stats?.highest_score)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Detailed Item Breakdown Table */}
                        {item_analysis && item_analysis.length > 0 && (
                            <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden">
                                <div className="px-4 py-3 bg-gradient-to-r from-white via-orange-50/30 to-white border-b border-slate-200/80 flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-slate-900">
                                        Rincian Parameter Tes Sesi Terakhir
                                    </h3>
                                    <span className="text-[10px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200/80 shadow-2xs">
                                        Total {item_analysis.length} Item
                                    </span>
                                </div>

                                <div>
                                    <table className="w-full text-xs text-left">
                                        <thead className="sticky top-0 z-10 text-[9.5px] text-slate-500 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200/80 font-bold uppercase tracking-wider">
                                            <tr>
                                                <th className="px-3 py-2">
                                                    Item Tes & Target
                                                </th>
                                                <th className="px-2 py-2 text-center">
                                                    Hasil
                                                </th>
                                                <th className="px-3 py-2 text-right">
                                                    Skor
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {[...(item_analysis || [])]
                                                .sort(
                                                    (a, b) =>
                                                        (Number(b.score) || 0) -
                                                        (Number(a.score) || 0),
                                                )
                                                .map((item, idx) => (
                                                    <tr
                                                        key={idx}
                                                        className="hover:bg-orange-50/20 transition-colors"
                                                    >
                                                        <td className="px-3 py-2.5">
                                                            <div className="font-bold text-slate-900 text-xs leading-tight">
                                                                {item.name}
                                                            </div>
                                                            <div className="text-[9.5px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                                                                <span>
                                                                    {
                                                                        item.category
                                                                    }
                                                                </span>
                                                                <span>•</span>
                                                                <span className="text-slate-500">
                                                                    Tgt:{" "}
                                                                    {formatNumber(
                                                                        item.target_value,
                                                                    )}{" "}
                                                                    {item.unit}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-2 py-2.5 text-center">
                                                            <span className="font-black text-slate-900 text-xs block leading-tight">
                                                                {formatNumber(
                                                                    item.result_value,
                                                                )}
                                                            </span>
                                                            <span className="text-[10.5px] text-slate-500 font-medium">
                                                                {item.unit}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2.5 text-right">
                                                            <div className="inline-flex flex-col items-end">
                                                                <span
                                                                    className={`font-black text-xs sm:text-sm leading-tight ${
                                                                        (item.score ||
                                                                            0) >=
                                                                        80
                                                                            ? "text-emerald-600"
                                                                            : (item.score ||
                                                                                    0) >=
                                                                                60
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
                                                                    0 && (
                                                                    <div className="mt-0.5 scale-90 origin-right">
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
                        )}

                        {/* 3. Status Multi-Domain Asesmen Atlet (Single Unified Card) */}
                        <div className="bg-gradient-to-br from-white via-white to-orange-50/40 border border-slate-200/80 rounded-md p-4 shadow-2xs hover:border-slate-300 transition-all space-y-3.5">
                            <div className="mb-1 pb-2 border-b border-slate-100">
                                <h3 className="text-xs font-bold text-slate-900">
                                    Status Multi-Domain Asesmen
                                </h3>
                            </div>

                            {/* Section 1: PHV & Pertumbuhan */}
                            <div className="space-y-1.5">
                                <div className="text-xs">
                                    <span className="font-bold text-slate-800 text-[11px]">
                                        PHV & Pertumbuhan
                                    </span>
                                </div>
                                {latest_phv ? (
                                    <div className="grid grid-cols-3 gap-1.5 text-center p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-xs">
                                        <div>
                                            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                                Maturity Offset
                                            </span>
                                            <strong className="text-slate-900 font-bold text-xs">
                                                {Number(
                                                    latest_phv.maturity_offset,
                                                ).toFixed(2)}{" "}
                                                <span className="text-[9px] font-normal text-slate-400">
                                                    thn
                                                </span>
                                            </strong>
                                        </div>
                                        <div>
                                            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                                Prediksi Tinggi
                                            </span>
                                            <strong className="text-slate-900 font-bold text-xs">
                                                {latest_phv.predicted_adult_height ||
                                                    "-"}{" "}
                                                <span className="text-[9px] font-normal text-slate-400">
                                                    cm
                                                </span>
                                            </strong>
                                        </div>
                                        <div>
                                            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                                Sisa Tumbuh
                                            </span>
                                            <strong className="text-orange-600 font-bold text-xs">
                                                +
                                                {latest_phv.remaining_growth ||
                                                    "-"}{" "}
                                                <span className="text-[9px] font-normal text-slate-400">
                                                    cm
                                                </span>
                                            </strong>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-[10.5px] text-slate-400 italic">
                                        Belum ada asesmen PHV
                                    </p>
                                )}
                            </div>

                            {/* Section 2: Komposisi Tubuh */}
                            <div className="pt-2 border-t border-slate-100 space-y-1.5">
                                <div className="text-xs">
                                    <span className="font-bold text-slate-800 text-[11px]">
                                        Komposisi Tubuh
                                    </span>
                                </div>
                                {latest_composition ? (
                                    <div className="grid grid-cols-4 gap-1 text-center p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-xs">
                                        <div>
                                            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                                Body Fat
                                            </span>
                                            <strong className="text-orange-600 font-bold text-xs">
                                                {latest_composition.body_fat_percentage ??
                                                    "-"}
                                                %
                                            </strong>
                                        </div>
                                        <div>
                                            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                                Muscle
                                            </span>
                                            <strong className="text-slate-900 font-bold text-xs">
                                                {latest_composition.muscle_mass ??
                                                    "-"}{" "}
                                                <span className="text-[8px] font-normal text-slate-400">
                                                    kg
                                                </span>
                                            </strong>
                                        </div>
                                        <div>
                                            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                                BMR
                                            </span>
                                            <strong className="text-slate-900 font-bold text-xs">
                                                {latest_composition.bmr ?? "-"}
                                            </strong>
                                        </div>
                                        <div>
                                            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                                Visceral
                                            </span>
                                            <strong className="text-slate-900 font-bold text-xs">
                                                Lvl{" "}
                                                {latest_composition.visceral_fat_level ??
                                                    "-"}
                                            </strong>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-[10.5px] text-slate-400 italic">
                                        Belum ada tes komposisi tubuh
                                    </p>
                                )}
                            </div>

                            {/* Section 3: Beban & Wellness */}
                            <div className="pt-2 border-t border-slate-100 space-y-1.5">
                                <div className="text-xs">
                                    <span className="font-bold text-slate-800 text-[11px]">
                                        Beban & Wellness
                                    </span>
                                </div>
                                {latest_wellness ? (
                                    <div className="grid grid-cols-3 gap-1.5 text-center p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-xs">
                                        <div>
                                            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                                Wellness
                                            </span>
                                            <strong className="text-emerald-600 font-bold text-xs">
                                                {latest_wellness.daily_wellness_score ??
                                                    "-"}{" "}
                                                <span className="text-[8.5px] font-normal text-slate-400">
                                                    /30
                                                </span>
                                            </strong>
                                        </div>
                                        <div>
                                            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                                Session RPE
                                            </span>
                                            <strong className="text-slate-900 font-bold text-xs">
                                                {latest_wellness.session_rpe ??
                                                    "-"}{" "}
                                                <span className="text-[8.5px] font-normal text-slate-400">
                                                    /10
                                                </span>
                                            </strong>
                                        </div>
                                        <div>
                                            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                                                Daily Load
                                            </span>
                                            <strong className="text-orange-600 font-bold text-xs">
                                                {latest_wellness.daily_load ??
                                                    0}{" "}
                                                <span className="text-[8.5px] font-normal text-slate-400">
                                                    AU
                                                </span>
                                            </strong>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-[10.5px] text-slate-400 italic">
                                        Belum ada catatan wellness
                                    </p>
                                )}
                            </div>

                            {/* Section 4: Postur Dinamis (DPA) */}
                            <div className="pt-2 border-t border-slate-100 space-y-1.5">
                                <div className="text-xs">
                                    <span className="font-bold text-slate-800 text-[11px]">
                                        Postur Dinamis (DPA)
                                    </span>
                                </div>
                                {latest_dpa ? (
                                    <div className="p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-xs flex items-center justify-between">
                                        <span className="text-[9px] text-slate-500 font-medium">
                                            Hasil Postur
                                        </span>
                                        <strong className="text-slate-900 font-bold text-xs">
                                            {latest_dpa.conclusion || "Normal"}
                                        </strong>
                                    </div>
                                ) : (
                                    <p className="text-[10.5px] text-slate-400 italic">
                                        Belum ada asesmen postur (DPA)
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
