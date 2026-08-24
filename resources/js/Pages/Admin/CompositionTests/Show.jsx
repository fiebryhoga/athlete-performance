import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import {
    Activity,
    Plus,
    Scale,
    ChevronLeft,
    Flame,
    Zap,
    HeartPulse,
    Calendar,
    User as UserIcon,
    ArrowLeft,
    Sparkles,
    ShieldCheck,
    Compass,
    Users,
} from "lucide-react";

import PageHeader from "@/Components/Common/PageHeader";
import PageFooter from "@/Components/Common/PageFooter";
import TrendHighlights from "./Partials/TrendHighlights";
import CompositionAnatomy from "./Partials/CompositionAnatomy";
import AnalyticsDashboard from "./Partials/AnalyticsDashboard";
import SmartInsights from "./Partials/SmartInsights";
import HistoryTable from "./Partials/HistoryTable";
import CompositionFormModal from "./Partials/CompositionFormModal";
import TdeeSummary from "./Partials/TdeeSummary";

export default function Show({
    auth,
    player = {},
    history = [],
    benchmarks = {},
}) {
    const isAthlete = auth?.user?.role === "athlete";
    const { permissions } = usePage().props;
    const canCreate = permissions?.body_composition?.create ?? true;

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    const latestTest = history.length > 0 ? history[0] : null;

    const handleEdit = (record) => {
        setEditingRecord(record);
        setIsFormModalOpen(true);
    };

    const handleAddRecord = () => {
        setEditingRecord(null);
        setIsFormModalOpen(true);
    };

    // Helper initials & code
    const getInitials = (name) => {
        if (!name) return "??";
        const words = name.trim().split(" ");
        if (words.length >= 2) {
            return `${words[0][0]}${words[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const getAthleteCode = (name) => {
        if (!name) return "";
        const words = name.trim().split(" ");
        if (words.length >= 3) {
            return `@${words[0][0]}${words[1][0]}${words[2][0]}`.toUpperCase();
        }
        if (words.length === 2) {
            return `@${words[0][0]}${words[1][0]}`.toUpperCase();
        }
        return `@${name.substring(0, 3)}`.toUpperCase();
    };

    const isFemale =
        player?.gender === "P" ||
        player?.gender === "female" ||
        player?.gender === "Perempuan";
    const genderFull = isFemale ? "Perempuan" : "Laki-laki";

    const coachesList =
        player?.coaches && player.coaches.length > 0
            ? player.coaches.map((c) => c.name).join(", ")
            : null;

    // BMI Evaluator
    const currentWeight = latestTest?.weight || player?.weight || "-";
    const currentHeight = latestTest?.height || player?.height || "-";
    const currentAge = latestTest?.age || player?.age || "-";

    const calculateBMI = (h, w) => {
        if (!h || !w || h === "-" || w === "-") return "-";
        const heightInM = parseFloat(h) / 100;
        const bmiVal = parseFloat(w) / (heightInM * heightInM);
        return parseFloat(bmiVal.toFixed(1));
    };

    const bmi = latestTest?.bmi || calculateBMI(currentHeight, currentWeight);

    const getBMIStatus = (val) => {
        if (val === "-" || isNaN(val))
            return {
                label: "-",
                color: "text-slate-400",
                bg: "bg-slate-50 border-slate-200",
            };
        const num = parseFloat(val);
        if (num < 18.5)
            return {
                label: "Underweight",
                color: "text-blue-600",
                bg: "bg-blue-50 border-blue-200",
            };
        if (num >= 18.5 && num <= 22.9)
            return {
                label: "Ideal",
                color: "text-emerald-600",
                bg: "bg-emerald-50 border-emerald-200",
            };
        if (num >= 23 && num <= 24.9)
            return {
                label: "Normal",
                color: "text-teal-600",
                bg: "bg-teal-50 border-teal-200",
            };
        if (num >= 25 && num <= 29.9)
            return {
                label: "Overweight",
                color: "text-amber-600",
                bg: "bg-amber-50 border-amber-200",
            };
        return {
            label: "Obese",
            color: "text-rose-600",
            bg: "bg-rose-50 border-rose-200",
        };
    };

    const bmiStatus = getBMIStatus(bmi);

    return (
        <AppLayout
            title={`Komposisi Tubuh - ${player.name}`}
            description={`Analisis detail komposisi tubuh, massa otot, persentase lemak, dan performa seluler atlet ${player.name}.`}
        >
            <Head title={`Komposisi Tubuh - ${player.name}`} />

            <div className="space-y-4 pb-12">
                {/* ─── BREADCRUMB & HEADER ACTIONS ─── */}
                <div className="space-y-1">
                    {!isAthlete && (
                        <Link
                            href={route("admin.composition-tests.index")}
                            className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors gap-1.5"
                        >
                            <ArrowLeft size={13} /> Kembali ke Komposisi Tubuh
                        </Link>
                    )}

                    <PageHeader
                        title="Analisis Komposisi Tubuh"
                        description={`Evaluasi bioimpedansi atlet, distribusi jaringan otot, lemak tubuh, dan metabolisme.`}
                        actions={
                            !isAthlete &&
                            canCreate && (
                                <button
                                    type="button"
                                    onClick={handleAddRecord}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 hover:via-orange-50/40 hover:to-orange-100/60 text-orange-600 border border-slate-200/90 hover:border-orange-300 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Tambah Data</span>
                                </button>
                            )
                        }
                    />
                </div>

                {/* ─── 2-COLUMN DASHBOARD LAYOUT (KANAN - KIRI) ─── */}
                {latestTest ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                        {/* ═══════════════════════════════════════
                            KOLOM KIRI (LEBAR) - 8 Kolom di LG
                           ═══════════════════════════════════════ */}
                        <div className="lg:col-span-8 space-y-4">
                            {/* 1. Athlete Profile Hero Card (Cover Banner + Overlapping Avatar) */}
                            <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden hover:border-slate-300 transition-all">
                                {/* Top Cover Banner (Soft Warm Dot Grid Pattern) */}
                                <div className="relative h-20 sm:h-24 bg-gradient-to-r from-white via-orange-50/40 to-amber-50/50 border-b border-slate-100 p-3.5 flex justify-end items-start overflow-hidden">
                                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
                                    <span className="relative z-10 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-slate-200/90 text-slate-700 text-[10.5px] font-bold px-3 py-1 rounded-full shadow-2xs">
                                        <ShieldCheck
                                            size={13}
                                            className="text-orange-500"
                                        />
                                        <span>
                                            {player.package?.name ||
                                                player.subscription_package
                                                    ?.name ||
                                                (player.sport?.name
                                                    ? `${player.sport.name}`
                                                    : "Member")}
                                        </span>
                                    </span>
                                </div>

                                {/* Bottom Container Overlapping Banner */}
                                <div className="px-5 pb-4 pt-2.5 sm:pt-3">
                                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                                        {/* Left: Avatar overlapping banner + Identity */}
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <div className="relative -mt-10 sm:-mt-12 w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-xl border-[3px] border-white shadow-md overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100/70 text-orange-600 font-black text-2xl flex items-center justify-center shrink-0 z-10">
                                                {player.photo_url ? (
                                                    <img
                                                        src={player.photo_url}
                                                        alt={player.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="leading-none select-none">
                                                        {getInitials(
                                                            player.name,
                                                        )}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-1.5 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight uppercase tracking-tight">
                                                        {player.name ||
                                                            "Unknown"}
                                                    </h2>
                                                    <span className="text-[11px] font-mono text-slate-400 font-bold">
                                                        {player.username
                                                            ? `@${player.username}`
                                                            : getAthleteCode(
                                                                  player.name,
                                                              )}
                                                    </span>
                                                </div>

                                                {/* Sport and Category Badges */}
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {player.sport?.name && (
                                                        <span className="inline-flex items-center gap-1 font-bold text-orange-700 bg-orange-50 border border-orange-200/80 px-2 py-0.5 rounded text-[10.5px]">
                                                            <Compass
                                                                size={11}
                                                                className="text-orange-500"
                                                            />
                                                            {player.sport.name}
                                                        </span>
                                                    )}
                                                    {player.category && (
                                                        <span className="inline-flex items-center font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded text-[10.5px] uppercase">
                                                            {player.category}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Subtitle: Gender & Coaches */}
                                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
                                                    <span className="inline-flex items-center gap-1">
                                                        <UserIcon
                                                            size={12}
                                                            className="text-slate-400"
                                                        />
                                                        {genderFull}
                                                    </span>
                                                    {coachesList && (
                                                        <>
                                                            <span className="text-slate-300">
                                                                •
                                                            </span>
                                                            <span className="text-slate-500">
                                                                Pelatih:{" "}
                                                                <strong className="text-slate-700 font-bold">
                                                                    {
                                                                        coachesList
                                                                    }
                                                                </strong>
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: 4 Statistic Tiles */}
                                        <div className="flex items-center gap-2 sm:gap-2.5 self-stretch xl:self-auto justify-between xl:justify-end border-t xl:border-t-0 pt-3 xl:pt-0 border-slate-100 overflow-x-auto">
                                            {/* Tinggi */}
                                            <div className="px-3.5 py-2 bg-white rounded-lg border border-slate-200/80 text-center shadow-2xs min-w-[72px]">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                                                    Tinggi
                                                </span>
                                                <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                                                    <span className="text-sm sm:text-base font-black text-slate-900">
                                                        {currentHeight}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-slate-400">
                                                        cm
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Berat */}
                                            <div className="px-3.5 py-2 bg-white rounded-lg border border-slate-200/80 text-center shadow-2xs min-w-[72px]">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                                                    Berat
                                                </span>
                                                <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                                                    <span className="text-sm sm:text-base font-black text-slate-900">
                                                        {currentWeight}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-slate-400">
                                                        kg
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Usia */}
                                            <div className="px-3.5 py-2 bg-white rounded-lg border border-slate-200/80 text-center shadow-2xs min-w-[72px]">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                                                    Usia
                                                </span>
                                                <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                                                    <span className="text-sm sm:text-base font-black text-slate-900">
                                                        {currentAge}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-slate-400">
                                                        thn
                                                    </span>
                                                </div>
                                            </div>

                                            {/* BMI */}
                                            <div className="px-3.5 py-2 bg-white rounded-lg border border-slate-200/80 text-center shadow-2xs min-w-[72px]">
                                                <span
                                                    className={`text-[9.5px] font-bold block ${bmiStatus.color}`}
                                                >
                                                    {bmiStatus.label}
                                                </span>
                                                <div className="flex items-baseline justify-center gap-0.5 mt-0.5">
                                                    <span
                                                        className={`text-sm sm:text-base font-black ${bmiStatus.color}`}
                                                    >
                                                        {bmi}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-slate-400">
                                                        BMI
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 19 Biomarker Categories Grid */}
                            <TrendHighlights history={history} />

                            {/* Human Silhouette Visualization */}
                            <CompositionAnatomy
                                test={latestTest}
                                player={player}
                            />

                            {/* Riwayat Pengukuran Table */}
                            <HistoryTable
                                history={history}
                                onEdit={!isAthlete ? handleEdit : null}
                                canDelete={!isAthlete}
                            />
                        </div>

                        {/* ═══════════════════════════════════════
                            KOLOM KANAN (SIDEBAR) - 4 Kolom di LG
                           ═══════════════════════════════════════ */}
                        <div className="lg:col-span-4 space-y-4">
                            {/* Ambang Batas & Benchmark Bioimpedansi Gauges */}
                            <AnalyticsDashboard
                                test={latestTest}
                                player={player}
                                benchmarks={benchmarks}
                            />

                            {/* Smart Insights AI & Coach */}
                            <SmartInsights
                                test={latestTest}
                                player={player}
                                benchmarks={benchmarks}
                            />

                            {/* Caloric & Macronutrient Target */}
                            <TdeeSummary test={latestTest} player={player} />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-2xs">
                        <div className="w-14 h-14 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-3 text-orange-500 shadow-2xs">
                            <Scale className="w-7 h-7" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">
                            Belum Ada Data Evaluasi Komposisi Tubuh
                        </h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
                            Atlet ini belum memiliki catatan riwayat
                            bioimpedansi. Tambahkan data pengukuran pertama
                            untuk melihat analisis mendalam.
                        </p>
                        {!isAthlete && canCreate && (
                            <button
                                type="button"
                                onClick={handleAddRecord}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 hover:via-orange-50/40 hover:to-orange-100/60 text-orange-600 border border-slate-200/90 hover:border-orange-300 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Input Data Pertama</span>
                            </button>
                        )}
                    </div>
                )}

                <PageFooter />
            </div>

            {/* Modal Input & Edit Data */}
            <CompositionFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                player={player}
                record={editingRecord}
            />
        </AppLayout>
    );
}
