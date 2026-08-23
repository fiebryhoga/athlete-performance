import React, { useState, useEffect, useRef, useMemo } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router, Link, usePage } from "@inertiajs/react";
import PageHeader from "@/Components/Common/PageHeader";
import PageFooter from "@/Components/Common/PageFooter";
import {
    Search,
    Users,
    ChevronRight,
    Activity,
    Target,
    Flame,
    Info,
    Ruler,
    Weight,
    Zap,
    Scale,
    TrendingUp,
    Sparkles,
    Trophy,
    HeartPulse,
    Battery,
    Layers,
    CheckCircle2,
    ArrowRight,
    ArrowUpRight,
    Filter,
    SlidersHorizontal,
    X,
    User,
    Calendar,
    Dumbbell,
    Clock,
} from "lucide-react";

export default function Index({
    athletes = [],
    summary = {},
    sports = [],
    filters = {},
}) {
    const { auth } = usePage().props;
    const isCoach = auth?.user?.role === "coach";
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [selectedSport, setSelectedSport] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL"); // 'ALL' | 'TESTED' | 'PHV' | 'COMP'
    const [sortBy, setSortBy] = useState("name_asc"); // 'name_asc' | 'name_desc' | 'score_desc' | 'age_asc'
    const isMounted = useRef(false);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(
                route("admin.athletes.index"),
                { search: searchTerm },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleCardClick = (id) => {
        router.get(route("admin.athletes.show", id));
    };

    const calculateBMI = (h, w) => {
        if (!h || !w) return null;
        const heightInM = h / 100;
        const bmiVal = w / (heightInM * heightInM);
        return parseFloat(bmiVal.toFixed(1));
    };

    const getBMIStatus = (bmi) => {
        if (!bmi) return { label: "—", color: "text-slate-400 bg-slate-50 border-slate-200" };
        if (bmi < 18.5) return { label: "Underweight", color: "text-amber-700 bg-amber-50 border-amber-200/80" };
        if (bmi <= 24.9) return { label: "Ideal", color: "text-emerald-700 bg-emerald-50 border-emerald-200/80" };
        if (bmi <= 29.9) return { label: "Overweight", color: "text-orange-700 bg-orange-50 border-orange-200/80" };
        return { label: "Obese", color: "text-rose-700 bg-rose-50 border-rose-200/80" };
    };

    // Filter & Sort Pipeline
    const processedAthletes = useMemo(() => {
        return athletes
            .filter((athlete) => {
                // Sport filter
                if (selectedSport !== "ALL" && athlete.sport_id !== parseInt(selectedSport)) {
                    return false;
                }
                // Status domain filter
                if (statusFilter === "TESTED" && (athlete.latest_test_score === null || athlete.latest_test_score === undefined)) {
                    return false;
                }
                if (statusFilter === "PHV" && !athlete.latest_phv) {
                    return false;
                }
                if (statusFilter === "COMP" && !athlete.latest_composition) {
                    return false;
                }
                return true;
            })
            .sort((a, b) => {
                if (sortBy === "name_asc") return (a.name || "").localeCompare(b.name || "");
                if (sortBy === "name_desc") return (b.name || "").localeCompare(a.name || "");
                if (sortBy === "score_desc") return (b.latest_test_score || 0) - (a.latest_test_score || 0);
                if (sortBy === "age_asc") return (a.age || 99) - (b.age || 99);
                return 0;
            });
    }, [athletes, selectedSport, statusFilter, sortBy]);

    const totalCount = summary?.total || athletes.length;
    const testedCount = summary?.tested_count || 0;
    const phvCount = summary?.phv_count || 0;
    const compCount = summary?.comp_count || 0;

    const testedPercent = totalCount > 0 ? Math.round((testedCount / totalCount) * 100) : 0;
    const phvPercent = totalCount > 0 ? Math.round((phvCount / totalCount) * 100) : 0;
    const compPercent = totalCount > 0 ? Math.round((compCount / totalCount) * 100) : 0;

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef(null);

    // Close filter dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };
        if (isFilterOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isFilterOpen]);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (selectedSport !== "ALL") count++;
        if (statusFilter !== "ALL") count++;
        if (sortBy !== "name_asc") count++;
        return count;
    }, [selectedSport, statusFilter, sortBy]);

    return (
        <AppLayout title="Profiling">
            <Head title="Profiling" />

            <div className="space-y-4 pb-12">
                
                {/* ─── PAGE HEADER WITH SEARCH & FILTER BUTTON MODAL ─── */}
                <PageHeader
                    title="Profiling"
                    description="Evaluasi performa fisik, maturitas PHV, dan komposisi tubuh atlet."
                    actions={
                        <div className="flex items-center gap-2 relative" ref={filterRef}>
                            {/* Search Input Box */}
                            <div className="w-48 sm:w-64 relative">
                                <Search
                                    size={14}
                                    className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Cari atlet..."
                                    className="w-full pl-8 pr-7 py-2 bg-white border border-slate-200/90 rounded-md text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-2xs"
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchTerm("")}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded transition-colors"
                                    >
                                        <X size={13} />
                                    </button>
                                )}
                            </div>

                            {/* Filter Trigger Button */}
                            <button
                                type="button"
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-bold transition-all shadow-2xs ${
                                    activeFilterCount > 0
                                        ? "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100/60"
                                        : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90"
                                }`}
                            >
                                <SlidersHorizontal size={13} className={activeFilterCount > 0 ? "text-orange-600" : "text-slate-500"} />
                                <span>Filter</span>
                                {activeFilterCount > 0 && (
                                    <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>

                            {/* Filter Dropdown Popover */}
                            {isFilterOpen && (
                                <div className="absolute right-0 top-full mt-2 w-80 sm:w-88 bg-white border border-slate-200/90 rounded-xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                                    {/* Header */}
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                                        <div className="flex items-center gap-1.5">
                                            <SlidersHorizontal size={14} className="text-orange-500" />
                                            <h4 className="text-xs font-bold text-slate-800">Filter & Pengurutan</h4>
                                        </div>
                                        {activeFilterCount > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedSport("ALL");
                                                    setStatusFilter("ALL");
                                                    setSortBy("name_asc");
                                                }}
                                                className="text-[11px] font-bold text-orange-600 hover:text-orange-700 transition-colors"
                                            >
                                                Reset Filter
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-3.5 text-xs">
                                        {/* 1. Cabang Olahraga */}
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                                                Cabang Olahraga
                                            </label>
                                            <select
                                                value={selectedSport}
                                                onChange={(e) => setSelectedSport(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-semibold rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer"
                                            >
                                                <option value="ALL">Semua Cabor ({athletes.length})</option>
                                                {sports.map((sport) => {
                                                    const count = athletes.filter((a) => a.sport_id === sport.id).length;
                                                    return (
                                                        <option key={sport.id} value={sport.id.toString()}>
                                                            {sport.name} ({count})
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>

                                        {/* 2. Status Kelengkapan Evaluasi */}
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                                                Kelengkapan Data
                                            </label>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                {[
                                                    { id: "ALL", label: "Semua" },
                                                    { id: "TESTED", label: "Skor Tes Fisik" },
                                                    { id: "PHV", label: "Asesmen PHV" },
                                                    { id: "COMP", label: "Komposisi Tubuh" },
                                                ].map((item) => (
                                                    <button
                                                        key={item.id}
                                                        type="button"
                                                        onClick={() => setStatusFilter(item.id)}
                                                        className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold text-center border transition-all ${
                                                            statusFilter === item.id
                                                                ? "bg-orange-50 text-orange-600 border-orange-200"
                                                                : "bg-slate-50 text-slate-600 border-slate-200/70 hover:bg-slate-100"
                                                        }`}
                                                    >
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 3. Urutkan Berdasarkan */}
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                                                Urutkan Berdasarkan
                                            </label>
                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-semibold rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer"
                                            >
                                                <option value="name_asc">Nama (A - Z)</option>
                                                <option value="name_desc">Nama (Z - A)</option>
                                                <option value="score_desc">Skor Fisik Tertinggi</option>
                                                <option value="age_asc">Usia Termuda</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Footer Action */}
                                    <div className="mt-4 pt-3 border-t border-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => setIsFilterOpen(false)}
                                            className="w-full py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-md text-xs font-bold hover:from-orange-600 hover:to-amber-700 shadow-xs shadow-orange-500/25 transition-all text-center"
                                        >
                                            Terapkan ({processedAthletes.length} Atlet Ditemukan)
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                />

                {/* ─── ATHLETE PROFILING CARDS GRID ─── */}
                {processedAthletes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 animate-in fade-in duration-300">
                        {processedAthletes.map((athlete) => {
                            const isFemale = athlete.gender === "P" || athlete.gender === "female" || athlete.gender === "Perempuan";
                            const initial = athlete.name ? athlete.name.charAt(0).toUpperCase() : "-";
                            const hasPHV = !!athlete.latest_phv;
                            const hasComp = !!athlete.latest_composition;
                            const hasWellness = !!athlete.latest_wellness;
                            const hasScore = athlete.latest_test_score !== null && athlete.latest_test_score !== undefined;
                            const bmi = calculateBMI(athlete.height, athlete.weight);
                            const bmiStatus = getBMIStatus(bmi);

                            return (
                                <div
                                    key={athlete.id}
                                    onClick={() => handleCardClick(athlete.id)}
                                    className="bg-white rounded-2xl border border-slate-200/85 p-5 hover:border-orange-300/90 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                                >
                                    {/* Ambient top gradient glow */}
                                    <div className="absolute right-0 top-0 w-36 h-36 bg-gradient-to-bl from-orange-50/70 via-amber-50/20 to-transparent pointer-events-none rounded-tr-2xl group-hover:from-orange-100/60 transition-all duration-500"></div>

                                    <div>
                                        {/* Header Row: Avatar, Name, Sport, Gender */}
                                        <div className="relative z-10 flex items-start gap-3.5 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center text-lg font-black shadow-xs shadow-orange-500/20 border border-white shrink-0 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                                {athlete.profile_photo_url ? (
                                                    <img
                                                        src={athlete.profile_photo_url}
                                                        alt={athlete.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    initial
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                                    <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60 truncate">
                                                        {athlete.sport?.name || "Tanpa Cabor"}
                                                    </span>
                                                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                                        {isFemale ? "Perempuan" : "Laki-laki"}
                                                    </span>
                                                </div>

                                                <h3 className="font-bold text-slate-900 text-sm truncate leading-snug group-hover:text-orange-600 transition-colors">
                                                    {athlete.name}
                                                </h3>
                                                <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                                                    @{athlete.username || "athlete"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Biometric Summary Row */}
                                        <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3.5 bg-slate-50/70 p-2 rounded-xl border border-slate-100">
                                            <div className="px-1">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                                                    Usia
                                                </span>
                                                <strong className="text-xs font-bold text-slate-800 mt-0.5 block">
                                                    {athlete.age ? `${athlete.age} thn` : "—"}
                                                </strong>
                                            </div>
                                            <div className="px-1 border-x border-slate-200/60">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                                                    TB / BB
                                                </span>
                                                <strong className="text-xs font-bold text-slate-800 mt-0.5 block truncate">
                                                    {athlete.height ? `${athlete.height}cm` : "—"}/{athlete.weight ? `${athlete.weight}kg` : "—"}
                                                </strong>
                                            </div>
                                            <div className="px-1">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                                                    BMI
                                                </span>
                                                <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded border mt-0.5 ${bmiStatus.color}`}>
                                                    {bmiStatus.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Core Multi-Domain Status Matrix */}
                                        <div className="space-y-2 mb-4">
                                            {/* 1. Skor Tes Fisik */}
                                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs">
                                                <span className="text-slate-600 font-semibold flex items-center gap-1.5 text-[11px]">
                                                    <Target size={13} className="text-orange-500" />
                                                    <span>Skor Tes Fisik</span>
                                                </span>
                                                {hasScore ? (
                                                    <span className="font-black text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                                                        {athlete.latest_test_score} pts
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 italic font-medium">
                                                        Belum ada tes
                                                    </span>
                                                )}
                                            </div>

                                            {/* 2. Status PHV (Maturitas) */}
                                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs">
                                                <span className="text-slate-600 font-semibold flex items-center gap-1.5 text-[11px]">
                                                    <Activity size={13} className="text-emerald-500" />
                                                    <span>Maturitas PHV</span>
                                                </span>
                                                {hasPHV ? (
                                                    <span className="font-bold text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                                        {athlete.latest_phv.phv_status || "Circa-PHV"} ({Number(athlete.latest_phv.maturity_offset).toFixed(1)} thn)
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 italic font-medium">
                                                        Belum diukur
                                                    </span>
                                                )}
                                            </div>

                                            {/* 3. Komposisi Tubuh & Lemak */}
                                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs">
                                                <span className="text-slate-600 font-semibold flex items-center gap-1.5 text-[11px]">
                                                    <Scale size={13} className="text-purple-500" />
                                                    <span>Lemak Tubuh (BF)</span>
                                                </span>
                                                {hasComp && athlete.latest_composition.body_fat_percentage !== null ? (
                                                    <span className="font-bold text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                                                        {athlete.latest_composition.body_fat_percentage}% BF
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 italic font-medium">
                                                        Belum ada data
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer: Action Link */}
                                    <div className="relative z-10 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                                        <span>Buka Analisis Profiling Lengkap</span>
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white p-12 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-3 border border-slate-200/80 shadow-2xs">
                            <Users className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-base font-bold text-slate-800 mb-1">
                            Tidak Ada Atlet Ditemukan
                        </h3>
                        <p className="text-xs text-slate-500 max-w-sm">
                            Tidak ada data atlet yang cocok dengan kata kunci pencarian atau filter yang dipilih.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedSport("ALL");
                                setStatusFilter("ALL");
                            }}
                            className="mt-4 px-3.5 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-all shadow-2xs"
                        >
                            Reset Semua Filter
                        </button>
                    </div>
                )}

                {/* Footer Component */}
                <PageFooter />
            </div>
        </AppLayout>
    );
}