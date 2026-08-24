import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/Common/PageHeader";
import PageFooter from "@/Components/Common/PageFooter";
import {
    Activity,
    Plus,
    Calendar,
    ArrowLeft,
    ShieldCheck,
    Compass,
    Users,
    Clock,
    TrendingUp,
    Sparkles,
    Ruler,
    Scale,
    Flame,
    Zap,
    AlertCircle,
    Info,
    Edit3,
    Trash2,
    CheckCircle2,
    Layers,
    User as UserIcon,
} from "lucide-react";

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

export default function Show({ auth, athlete = {}, assessments = [] }) {
    const [isDeleting, setIsDeleting] = useState(null);

    const isAthlete = auth?.user?.role === "athlete";
    const latest = assessments.length > 0 ? assessments[0] : null;

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus data penilaian ini?")) {
            setIsDeleting(id);
            router.delete(route("admin.phv-calculator.destroy", id), {
                preserveScroll: true,
                onFinish: () => setIsDeleting(null),
            });
        }
    };

    const isFemale =
        athlete?.gender === "P" ||
        athlete?.gender === "female" ||
        athlete?.gender === "Perempuan";
    const genderFull = isFemale ? "Perempuan" : "Laki-laki";

    const coachesList =
        athlete?.coaches && athlete.coaches.length > 0
            ? athlete.coaches.map((c) => c.name).join(", ")
            : null;

    // Normalizing status
    const getStatusInfo = (statusStr) => {
        if (!statusStr)
            return {
                label: "Belum Terukur",
                color: "text-slate-600",
                bg: "bg-slate-50 border-slate-200",
                badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
                stage: "-",
            };
        const s = statusStr.toUpperCase();
        if (s.includes("PRE")) {
            return {
                label: "Pre-PHV",
                color: "text-sky-600",
                bg: "bg-sky-50/50 border-sky-200",
                badgeBg: "bg-sky-50 text-sky-700 border-sky-200",
                stage: "Pra-Lonjakan Pertumbuhan",
            };
        }
        if (s.includes("CIRCA")) {
            return {
                label: "Circa-PHV",
                color: "text-orange-600",
                bg: "bg-orange-50/50 border-orange-200",
                badgeBg: "bg-orange-50 text-orange-700 border-orange-200",
                stage: "Puncak Lonjakan Pertumbuhan",
            };
        }
        if (s.includes("POST")) {
            return {
                label: "Post-PHV",
                color: "text-emerald-600",
                bg: "bg-emerald-50/50 border-emerald-200",
                badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
                stage: "Pasca-Lonjakan Pertumbuhan",
            };
        }
        return {
            label: statusStr,
            color: "text-slate-700",
            bg: "bg-slate-50 border-slate-200",
            badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
            stage: "Status Kematangan",
        };
    };

    const statusInfo = latest ? getStatusInfo(latest.maturity_status) : null;
    const offsetNum = latest ? parseFloat(latest.maturity_offset) : null;
    const isOffsetPositive = offsetNum !== null && offsetNum >= 0;

    // Sitting height ratio
    const sittingRatio =
        latest && latest.standing_height && latest.sitting_height
            ? (
                  (parseFloat(latest.sitting_height) /
                      parseFloat(latest.standing_height)) *
                  100
              ).toFixed(1)
            : null;

    const photo = athlete.profile_photo_url || athlete.profile_photo;

    return (
        <AppLayout>
            <Head title={`Evaluasi PHV - ${athlete.name}`} />

            <div className="space-y-4 pb-12">
                {/* ─── BREADCRUMB & HEADER ACTIONS ─── */}
                <div className="space-y-1">
                    {!isAthlete && (
                        <Link
                            href={route("admin.phv-calculator.index")}
                            className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors gap-1.5"
                        >
                            <ArrowLeft size={13} /> Kembali ke Kalkulator PHV
                        </Link>
                    )}

                    <PageHeader
                        title="Analisis Peak Height Velocity (PHV)"
                        description="Pantau status kematangan biologis, lintasan pertumbuhan, dan perkiraan lonjakan tinggi badan atlet."
                        actions={
                            <div className="flex flex-wrap items-center gap-2">
                                <Link
                                    href={route(
                                        "admin.phv-calculator.create",
                                        athlete.id,
                                    )}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 hover:via-orange-50/40 hover:to-orange-100/60 text-orange-600 border border-slate-200/90 hover:border-orange-300 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Catat Penilaian Baru</span>
                                </Link>
                            </div>
                        }
                    />
                </div>

                {/* ─── 2-COLUMN DASHBOARD LAYOUT (KANAN - KIRI) ─── */}
                {latest ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                        {/* ═══════════════════════════════════════
                            KOLOM KIRI (LEBAR) - 8 Kolom di LG
                           ═══════════════════════════════════════ */}
                        <div className="lg:col-span-8 space-y-4">
                            {/* 1. Athlete Profile Hero Card */}
                            <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden hover:border-slate-300 transition-all">
                                {/* Top Cover Banner */}
                                <div className="relative h-20 sm:h-24 bg-gradient-to-r from-white via-orange-50/40 to-amber-50/50 border-b border-slate-100 p-3.5 flex justify-end items-start overflow-hidden">
                                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
                                    <span className="relative z-10 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-slate-200/90 text-slate-700 text-[10.5px] font-bold px-3 py-1 rounded-full shadow-2xs">
                                        <ShieldCheck
                                            size={13}
                                            className="text-orange-500"
                                        />
                                        <span>
                                            {athlete.sport?.name ||
                                                "Atlet / Member"}
                                        </span>
                                    </span>
                                </div>

                                {/* Bottom Container Overlapping Banner */}
                                <div className="px-5 pb-4 pt-2.5 sm:pt-3">
                                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                                        {/* Left: Avatar overlapping banner + Identity */}
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <div className="relative -mt-10 sm:-mt-12 w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-xl border-[3px] border-white shadow-md overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100/70 text-orange-600 font-black text-2xl flex items-center justify-center shrink-0 z-10">
                                                {photo ? (
                                                    <img
                                                        src={photo}
                                                        alt={athlete.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="leading-none select-none">
                                                        {getInitials(
                                                            athlete.name,
                                                        )}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-1.5 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight uppercase tracking-tight">
                                                        {athlete.name ||
                                                            "Unknown"}
                                                    </h2>
                                                    <span className="text-[11px] font-mono text-slate-400 font-bold">
                                                        {athlete.username
                                                            ? `@${athlete.username}`
                                                            : getAthleteCode(
                                                                  athlete.name,
                                                              )}
                                                    </span>
                                                </div>

                                                {/* Sport and Badges */}
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {athlete.sport?.name && (
                                                        <span className="inline-flex items-center gap-1 font-bold text-orange-700 bg-orange-50 border border-orange-200/80 px-2 py-0.5 rounded text-[10.5px]">
                                                            <Compass
                                                                size={11}
                                                                className="text-orange-500"
                                                            />
                                                            {athlete.sport.name}
                                                        </span>
                                                    )}
                                                    <span className="inline-flex items-center font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10.5px]">
                                                        {genderFull}
                                                    </span>
                                                    {athlete.age && (
                                                        <span className="inline-flex items-center font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10.5px]">
                                                            {Math.round(
                                                                athlete.age,
                                                            )}{" "}
                                                            Tahun
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Quick Anthropometric Badges */}
                                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                            <div className="px-3 py-2 bg-gradient-to-b from-white via-orange-50/10 to-orange-50/25 border border-slate-200/90 rounded-lg text-center shadow-2xs min-w-[70px]">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                                                    Tinggi
                                                </span>
                                                <span className="text-xs font-black text-slate-800">
                                                    {latest.standing_height ||
                                                        "-"}{" "}
                                                    <span className="text-[9px] text-slate-400 font-normal">
                                                        cm
                                                    </span>
                                                </span>
                                            </div>

                                            <div className="px-3 py-2 bg-gradient-to-b from-white via-orange-50/10 to-orange-50/25 border border-slate-200/90 rounded-lg text-center shadow-2xs min-w-[70px]">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                                                    Berat
                                                </span>
                                                <span className="text-xs font-black text-slate-800">
                                                    {latest.weight || "-"}{" "}
                                                    <span className="text-[9px] text-slate-400 font-normal">
                                                        kg
                                                    </span>
                                                </span>
                                            </div>

                                            <div className="px-3 py-2 bg-gradient-to-b from-white via-orange-50/10 to-orange-50/25 border border-slate-200/90 rounded-lg text-center shadow-2xs min-w-[70px]">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                                                    Evaluasi
                                                </span>
                                                <span className="text-xs font-black text-orange-600">
                                                    {assessments.length}{" "}
                                                    <span className="text-[9px] text-slate-400 font-normal">
                                                        x
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Coach info footer if available */}
                                    {coachesList && (
                                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                                            <Users
                                                size={12}
                                                className="text-slate-400"
                                            />
                                            <span>Pelatih / Coach:</span>
                                            <strong className="text-slate-700">
                                                {coachesList}
                                            </strong>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 2. Latest PHV Result Highlight Card */}
                            <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden p-4 sm:p-5 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200/80 text-orange-600 flex items-center justify-center shadow-2xs">
                                            <Activity className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                                                Hasil Penilaian PHV Terkini
                                            </h3>
                                            <p className="text-[11px] text-slate-400 font-medium">
                                                Formula Mirwald (Biological
                                                Maturity Assessment)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-md text-[10.5px] font-bold text-slate-600 shadow-2xs">
                                        <Calendar className="w-3 h-3 text-slate-400" />
                                        <span>
                                            {new Date(
                                                latest.assessment_date,
                                            ).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Main Highlight Split Box */}
                                <div className="bg-gradient-to-b from-white via-orange-50/15 to-orange-50/30 rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
                                        {/* Left: Maturity Offset */}
                                        <div className="flex flex-col items-center justify-center text-center p-2">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                                                Maturity Offset
                                            </span>
                                            <div className="flex items-baseline gap-1 my-1">
                                                <span className="text-4xl sm:text-5xl font-black text-slate-900 leading-none">
                                                    {isOffsetPositive
                                                        ? `+${offsetNum.toFixed(
                                                              1,
                                                          )}`
                                                        : offsetNum.toFixed(1)}
                                                </span>
                                                <span className="text-xs font-bold text-slate-400">
                                                    tahun
                                                </span>
                                            </div>
                                            <div className="mt-1">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold border ${statusInfo.badgeBg}`}
                                                >
                                                    {statusInfo.label} •{" "}
                                                    {statusInfo.stage}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right: Age at PHV */}
                                        <div className="flex flex-col items-center justify-center text-center p-2 pt-4 sm:pt-2">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                Perkiraan Usia Saat PHV
                                            </span>
                                            <div className="flex items-baseline gap-1 my-1">
                                                <span className="text-4xl sm:text-5xl font-black text-slate-900 leading-none">
                                                    {latest.phv_age
                                                        ? parseFloat(
                                                              latest.phv_age,
                                                          ).toFixed(1)
                                                        : "-"}
                                                </span>
                                                <span className="text-xs font-bold text-slate-400">
                                                    tahun
                                                </span>
                                            </div>
                                            <div className="mt-1">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
                                                    {latest.maturity_status ||
                                                        "TEREKAM"}{" "}
                                                    MATURER
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 3 Core Projected Metrics Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {/* 1. Sisa Pertumbuhan */}
                                    <div className="bg-gradient-to-b from-white via-orange-50/15 to-orange-50/30 rounded-xl border border-slate-200/90 p-3.5 text-center shadow-2xs hover:border-orange-300 transition-all">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                            Sisa Pertumbuhan
                                        </span>
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-2xl font-black text-slate-900 leading-tight">
                                                {latest.remaining_growth || "-"}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400">
                                                cm
                                            </span>
                                        </div>
                                        <span className="text-[9.5px] text-slate-400 font-medium mt-0.5 block">
                                            Predicted Growth Remain
                                        </span>
                                    </div>

                                    {/* 2. Prediksi Tinggi Dewasa */}
                                    <div className="bg-gradient-to-b from-white via-orange-50/15 to-orange-50/30 rounded-xl border border-slate-200/90 p-3.5 text-center shadow-2xs hover:border-orange-300 transition-all">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                            Prediksi Tinggi Dewasa
                                        </span>
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-2xl font-black text-slate-900 leading-tight">
                                                {latest.predicted_adult_height ||
                                                    "-"}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400">
                                                cm
                                            </span>
                                        </div>
                                        <span className="text-[9.5px] text-slate-400 font-medium mt-0.5 block">
                                            Predicted Adult Height
                                        </span>
                                    </div>

                                    {/* 3. Capaian Tinggi Saat Ini */}
                                    <div className="bg-gradient-to-b from-white via-orange-50/15 to-orange-50/30 rounded-xl border border-slate-200/90 p-3.5 text-center shadow-2xs hover:border-orange-300 transition-all">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                            Capaian Tinggi Dewasa
                                        </span>
                                        <div className="flex items-baseline justify-center gap-0.5">
                                            <span className="text-2xl font-black text-orange-600 leading-tight">
                                                {latest.adult_height_percentage ||
                                                    "-"}
                                            </span>
                                            <span className="text-[11px] font-black text-orange-500">
                                                %
                                            </span>
                                        </div>
                                        <span className="text-[9.5px] text-slate-400 font-medium mt-0.5 block">
                                            Current % Adult Height
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Smart Insights & Training Recommendations */}
                            <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-4 sm:p-5 space-y-3.5">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                    <div className="w-7 h-7 rounded-md bg-white border border-slate-200 text-orange-500 flex items-center justify-center shadow-2xs">
                                        <Sparkles className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900">
                                            Rekomendasi & Panduan Latihan
                                            Biologis
                                        </h4>
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            Penyesuaian periodisasi beban
                                            latihan berdasarkan status
                                            kematangan atlet
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* Insight 1: Fokus Latihan */}
                                    <div className="bg-gradient-to-b from-white via-orange-50/15 to-orange-50/30 border border-slate-200/90 rounded-xl p-3.5 shadow-2xs space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-md bg-white border border-slate-200 text-orange-600 flex items-center justify-center shadow-2xs">
                                                <Zap className="w-3.5 h-3.5" />
                                            </div>
                                            <h5 className="text-xs font-bold text-slate-800">
                                                Prioritas Adaptasi Fisik
                                            </h5>
                                        </div>
                                        <p className="text-[11px] text-slate-600 leading-relaxed">
                                            {statusInfo.label === "Pre-PHV"
                                                ? "Fokus utama pada kelincahan (agility), koordinasi neuromuskular, kecepatan, dan penguasaan teknik dasar sebelum pertumbuhan pesat."
                                                : statusInfo.label ===
                                                    "Circa-PHV"
                                                  ? "Fasilitasi stabilitas sendi, fleksibilitas otot, dan mobilitas. Kurangi beban aksial berat untuk melindungi lempeng pertumbuhan (epifisis)."
                                                  : "Jendela optimal untuk penguatan hipertrofi otot, kekuatan maksimal (maximal strength), dan kapasitas daya tahan aerobik/anaerobik."}
                                        </p>
                                    </div>

                                    {/* Insight 2: Manajemen Beban & Pencegahan Cedera */}
                                    <div className="bg-gradient-to-b from-white via-orange-50/15 to-orange-50/30 border border-slate-200/90 rounded-xl p-3.5 shadow-2xs space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-md bg-white border border-slate-200 text-orange-600 flex items-center justify-center shadow-2xs">
                                                <AlertCircle className="w-3.5 h-3.5" />
                                            </div>
                                            <h5 className="text-xs font-bold text-slate-800">
                                                Mitigasi Cedera & Beban
                                            </h5>
                                        </div>
                                        <p className="text-[11px] text-slate-600 leading-relaxed">
                                            {statusInfo.label === "Circa-PHV"
                                                ? "Waspadai risiko Osgood-Schlatter dan Sever's Disease akibat pemanjangan tulang yang mendahului adaptasi tendon dan otot."
                                                : "Pastikan pemulihan yang cukup, nutrisi tinggi kalsium dan protein untuk mendukung perkembangan densitas tulang dan massa otot."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ═══════════════════════════════════════
                            KOLOM KANAN (SIDEBAR) - 4 Kolom di LG
                           ═══════════════════════════════════════ */}
                        <div className="lg:col-span-4 space-y-4">
                            {/* 1. Ringkasan Antropometri Terbaru Card */}
                            <div className="bg-gradient-to-b from-white via-orange-50/10 to-orange-50/25 border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3.5">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-md bg-white border border-slate-200 text-orange-500 flex items-center justify-center shadow-2xs">
                                            <Ruler className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900">
                                                Data Antropometri
                                            </h4>
                                            <p className="text-[10px] text-slate-400 font-medium">
                                                Pengukuran Fisik Terbaru
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 text-xs">
                                    {/* Tinggi Berdiri */}
                                    <div className="flex items-center justify-between p-2 bg-white/90 rounded-lg border border-slate-200/70 shadow-2xs">
                                        <span className="text-[11px] text-slate-500 font-medium">
                                            Tinggi Berdiri (Standing)
                                        </span>
                                        <strong className="text-slate-900 font-black">
                                            {latest.standing_height || "-"} cm
                                        </strong>
                                    </div>

                                    {/* Tinggi Duduk */}
                                    <div className="flex items-center justify-between p-2 bg-white/90 rounded-lg border border-slate-200/70 shadow-2xs">
                                        <span className="text-[11px] text-slate-500 font-medium">
                                            Tinggi Duduk (Sitting)
                                        </span>
                                        <strong className="text-slate-900 font-black">
                                            {latest.sitting_height || "-"} cm
                                        </strong>
                                    </div>

                                    {/* Panjang Kaki */}
                                    <div className="flex items-center justify-between p-2 bg-white/90 rounded-lg border border-slate-200/70 shadow-2xs">
                                        <span className="text-[11px] text-slate-500 font-medium">
                                            Panjang Kaki (Leg Length)
                                        </span>
                                        <strong className="text-slate-900 font-black">
                                            {latest.leg_length || "-"} cm
                                        </strong>
                                    </div>

                                    {/* Berat Badan */}
                                    <div className="flex items-center justify-between p-2 bg-white/90 rounded-lg border border-slate-200/70 shadow-2xs">
                                        <span className="text-[11px] text-slate-500 font-medium">
                                            Berat Badan
                                        </span>
                                        <strong className="text-slate-900 font-black">
                                            {latest.weight || "-"} kg
                                        </strong>
                                    </div>

                                    {/* Rasio Duduk/Berdiri */}
                                    {sittingRatio && (
                                        <div className="flex items-center justify-between p-2 bg-white/90 rounded-lg border border-slate-200/70 shadow-2xs">
                                            <span className="text-[11px] text-slate-500 font-medium">
                                                Rasio Duduk / Berdiri
                                            </span>
                                            <strong className="text-orange-600 font-black">
                                                {sittingRatio} %
                                            </strong>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 2. Standar Klasifikasi PHV Card */}
                            <div className="bg-gradient-to-b from-white via-orange-50/10 to-orange-50/25 border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                                    <div className="w-7 h-7 rounded-md bg-white border border-slate-200 text-orange-500 flex items-center justify-center shadow-2xs">
                                        <Layers className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900">
                                            Tahapan Kematangan PHV
                                        </h4>
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            Kriteria Klasifikasi Biologis
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-[11px]">
                                    {/* Pre-PHV */}
                                    <div className="p-2.5 bg-white/90 rounded-lg border border-slate-200/70 shadow-2xs space-y-0.5">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-sky-700">
                                                Pre-PHV
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-mono font-bold">
                                                Offset &lt; -1.0 thn
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] leading-tight">
                                            Fase pra-lonjakan. Kecepatan tumbuh
                                            masih stabil.
                                        </p>
                                    </div>

                                    {/* Circa-PHV */}
                                    <div className="p-2.5 bg-white/90 rounded-lg border border-slate-200/70 shadow-2xs space-y-0.5">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-orange-700">
                                                Circa-PHV
                                            </span>
                                            <span className="text-[10px] text-orange-500 font-mono font-bold">
                                                -1.0 s/d +1.0 thn
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] leading-tight">
                                            Puncak pertumbuhan cepat tinggi
                                            badan atlet.
                                        </p>
                                    </div>

                                    {/* Post-PHV */}
                                    <div className="p-2.5 bg-white/90 rounded-lg border border-slate-200/70 shadow-2xs space-y-0.5">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-emerald-700">
                                                Post-PHV
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-mono font-bold">
                                                Offset &gt; +1.0 thn
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] leading-tight">
                                            Pertumbuhan melambat menuju tinggi
                                            dewasa penuh.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty state if athlete has no records yet */
                    <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center shadow-2xs">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 text-orange-500 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                            <Activity className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 mb-1">
                            Belum Ada Data Penilaian PHV
                        </h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4 leading-relaxed">
                            Mulai rekam pengukuran antropometri dan kematangan
                            biologis pertama untuk atlet {athlete.name}.
                        </p>
                        <Link
                            href={route(
                                "admin.phv-calculator.create",
                                athlete.id,
                            )}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 text-orange-600 border border-slate-200/90 rounded-md text-xs font-bold hover:border-orange-300 transition-all shadow-2xs cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Mulai Penilaian PHV</span>
                        </Link>
                    </div>
                )}

                {/* ─── HISTORY LIST TABLE ─── */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md bg-white border border-slate-200 text-slate-500 flex items-center justify-center shadow-2xs">
                                <Calendar className="w-3.5 h-3.5" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
                                Riwayat Evaluasi PHV
                            </h3>
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/80">
                            Total: {assessments.length} Catatan
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="bg-slate-50/80 text-slate-700 font-bold border-b border-slate-200/80 uppercase text-[10px] tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">
                                        Tanggal Asesmen
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        Usia
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        Tinggi (cm)
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        Duduk (cm)
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        Kaki (cm)
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        Maturity Offset
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        Age at PHV
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        Sisa Tumbuh
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        Prediksi Dewasa
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {assessments.map((item) => {
                                    const itemStatus = getStatusInfo(
                                        item.maturity_status,
                                    );
                                    const itemOffset = parseFloat(
                                        item.maturity_offset,
                                    );
                                    const isItemOffsetPos = itemOffset >= 0;

                                    return (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-orange-50/20 transition-colors"
                                        >
                                            <td className="px-4 py-3 font-bold text-slate-800 whitespace-nowrap">
                                                {new Date(
                                                    item.assessment_date,
                                                ).toLocaleDateString("id-ID", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="px-4 py-3 text-center font-medium whitespace-nowrap">
                                                {Math.round(item.age)} thn
                                            </td>
                                            <td className="px-4 py-3 text-center font-semibold text-slate-800 whitespace-nowrap">
                                                {item.standing_height || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-center font-medium text-slate-600 whitespace-nowrap">
                                                {item.sitting_height || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-center font-medium text-slate-600 whitespace-nowrap">
                                                {item.leg_length || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-center whitespace-nowrap">
                                                <span className="font-bold text-slate-900">
                                                    {isItemOffsetPos
                                                        ? `+${itemOffset.toFixed(
                                                              1,
                                                          )}`
                                                        : itemOffset.toFixed(
                                                              1,
                                                          )}{" "}
                                                    thn
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center whitespace-nowrap">
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <span className="font-bold text-slate-800">
                                                        {item.phv_age
                                                            ? parseFloat(
                                                                  item.phv_age,
                                                              ).toFixed(1)
                                                            : "-"}
                                                    </span>
                                                    <span
                                                        className={`inline-flex items-center px-1.5 py-0.2 rounded text-[8.5px] font-bold border ${itemStatus.badgeBg}`}
                                                    >
                                                        {itemStatus.label}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center font-medium whitespace-nowrap">
                                                {item.remaining_growth || "-"}{" "}
                                                cm
                                            </td>
                                            <td className="px-4 py-3 text-center font-semibold text-slate-800 whitespace-nowrap">
                                                {item.predicted_adult_height ||
                                                    "-"}{" "}
                                                cm
                                            </td>
                                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link
                                                        href={route(
                                                            "admin.phv-calculator.edit",
                                                            item.id,
                                                        )}
                                                        className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                                                        title="Edit Penilaian"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id,
                                                            )
                                                        }
                                                        disabled={
                                                            isDeleting ===
                                                            item.id
                                                        }
                                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                                                        title="Hapus Penilaian"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {assessments.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="10"
                                            className="px-6 py-8 text-center text-slate-400 text-xs"
                                        >
                                            Belum ada catatan evaluasi PHV untuk
                                            atlet ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ─── PAGE FOOTER ─── */}
                <PageFooter />
            </div>
        </AppLayout>
    );
}
