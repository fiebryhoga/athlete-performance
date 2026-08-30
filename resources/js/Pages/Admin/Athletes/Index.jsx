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
    ChevronDown,
    Check,
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
    const [trainingTypeFilter, setTrainingTypeFilter] = useState("ALL"); // 'ALL' | 'PRIVATE' | 'GROUP'
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

    const handleCardClick = (athleteId) => {
        router.visit(route("admin.athletes.show", athleteId));
    };

    const calculateBMI = (height, weight) => {
        if (!height || !weight) return null;
        const heightInMeters = height / 100;
        const bmiValue = weight / (heightInMeters * heightInMeters);
        return bmiValue.toFixed(1);
    };

    const getBMIStatus = (bmi) => {
        if (!bmi) return { label: "—", color: "text-slate-400 bg-slate-50 border-slate-200/60" };
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
                // Training type filter (Private vs Group)
                if (trainingTypeFilter === "GROUP" && (!athlete.groups || athlete.groups.length === 0)) {
                    return false;
                }
                if (trainingTypeFilter === "PRIVATE" && athlete.groups && athlete.groups.length > 0) {
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
    }, [athletes, selectedSport, trainingTypeFilter, statusFilter, sortBy]);

    const totalCount = summary?.total || athletes.length;
    const testedCount = summary?.tested_count || 0;
    const phvCount = summary?.phv_count || 0;
    const compCount = summary?.comp_count || 0;

    const testedPercent = totalCount > 0 ? Math.round((testedCount / totalCount) * 100) : 0;
    const phvPercent = totalCount > 0 ? Math.round((phvCount / totalCount) * 100) : 0;
    const compPercent = totalCount > 0 ? Math.round((compCount / totalCount) * 100) : 0;

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSportDropdownOpen, setIsSportDropdownOpen] = useState(false);
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const filterRef = useRef(null);
    const sportDropdownRef = useRef(null);
    const sortDropdownRef = useRef(null);

    // Close filter dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
                setIsSportDropdownOpen(false);
                setIsSortDropdownOpen(false);
            } else {
                if (sportDropdownRef.current && !sportDropdownRef.current.contains(event.target)) {
                    setIsSportDropdownOpen(false);
                }
                if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                    setIsSortDropdownOpen(false);
                }
            }
        };
        if (isFilterOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isFilterOpen]);

    const sortOptions = [
        { id: "name_asc", label: "Nama (A - Z)" },
        { id: "name_desc", label: "Nama (Z - A)" },
        { id: "score_desc", label: "Skor Fisik Tertinggi" },
        { id: "age_asc", label: "Usia Termuda" },
    ];

    const currentSportLabel = useMemo(() => {
        if (selectedSport === "ALL") return `Semua Cabor (${athletes.length})`;
        const found = sports.find((s) => s.id.toString() === selectedSport.toString());
        const count = athletes.filter((a) => a.sport_id === (found?.id)).length;
        return found ? `${found.name} (${count})` : "Pilih Cabor";
    }, [selectedSport, sports, athletes]);

    const currentSortLabel = sortOptions.find((o) => o.id === sortBy)?.label || "Nama (A - Z)";

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (selectedSport !== "ALL") count++;
        if (trainingTypeFilter !== "ALL") count++;
        if (statusFilter !== "ALL") count++;
        if (sortBy !== "name_asc") count++;
        return count;
    }, [selectedSport, trainingTypeFilter, statusFilter, sortBy]);

    return (
        <AppLayout title="Profiling">
            <Head title="Profiling" />

            <div className="space-y-3 pb-2">
                
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
                                        ? "bg-gradient-to-br from-white via-white to-orange-50 text-orange-600 border-slate-200/90 shadow-xs"
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
                                                    setTrainingTypeFilter("ALL");
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
                                        {/* 1. Cabang Olahraga (Custom Dropdown) */}
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                                                Cabang Olahraga
                                            </label>
                                            <div className="relative" ref={sportDropdownRef}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsSportDropdownOpen(!isSportDropdownOpen);
                                                        setIsSortDropdownOpen(false);
                                                    }}
                                                    className="w-full flex items-center justify-between bg-white border border-slate-200/90 text-slate-800 text-xs font-semibold rounded-md px-3 py-2 hover:bg-slate-50 transition-all cursor-pointer text-left shadow-2xs"
                                                >
                                                    <span className="truncate">{currentSportLabel}</span>
                                                    <ChevronDown size={13} className={`text-slate-400 shrink-0 ml-1.5 transition-transform duration-200 ${isSportDropdownOpen ? "rotate-180 text-orange-500" : ""}`} />
                                                </button>

                                                {isSportDropdownOpen && (
                                                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200/90 rounded-xl shadow-lg p-1 z-30 max-h-48 overflow-y-auto [scrollbar-width:thin] animate-in fade-in zoom-in-95 duration-100">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedSport("ALL");
                                                                setIsSportDropdownOpen(false);
                                                            }}
                                                            className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between text-left transition-colors ${
                                                                selectedSport === "ALL"
                                                                    ? "bg-orange-50 text-orange-600 font-bold"
                                                                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                                            }`}
                                                        >
                                                            <span>Semua Cabor</span>
                                                            <span className="text-[10px] text-slate-400 font-mono">({athletes.length})</span>
                                                        </button>
                                                        {sports.map((sport) => {
                                                            const count = athletes.filter((a) => a.sport_id === sport.id).length;
                                                            const isSelected = selectedSport === sport.id.toString();
                                                            return (
                                                                <button
                                                                    key={sport.id}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelectedSport(sport.id.toString());
                                                                        setIsSportDropdownOpen(false);
                                                                    }}
                                                                    className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between text-left transition-colors ${
                                                                        isSelected
                                                                            ? "bg-orange-50 text-orange-600 font-bold"
                                                                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                                                    }`}
                                                                >
                                                                    <span className="truncate">{sport.name}</span>
                                                                    <span className="text-[10px] text-slate-400 font-mono ml-2 shrink-0">({count})</span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* 2. Tipe Latihan (Privat / Grup) */}
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                                                Tipe Latihan / Kelas
                                            </label>
                                            <div className="grid grid-cols-3 gap-1.5">
                                                {[
                                                    { id: "ALL", label: "Semua" },
                                                    { id: "PRIVATE", label: "Privat" },
                                                    { id: "GROUP", label: "Grup Latihan" },
                                                ].map((item) => (
                                                    <button
                                                        key={item.id}
                                                        type="button"
                                                        onClick={() => setTrainingTypeFilter(item.id)}
                                                        className={`px-2 py-1.5 rounded-md text-[11px] font-bold text-center border transition-all ${
                                                            trainingTypeFilter === item.id
                                                                ? "bg-gradient-to-br from-white via-white to-orange-50/90 text-orange-600 border-slate-200/90 shadow-xs"
                                                                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80"
                                                        }`}
                                                    >
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 3. Status Kelengkapan Evaluasi */}
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
                                                                ? "bg-gradient-to-br from-white via-white to-orange-50/90 text-orange-600 border-slate-200/90 shadow-xs"
                                                                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80"
                                                        }`}
                                                    >
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 4. Urutkan Berdasarkan (Custom Dropdown) */}
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                                                Urutkan Berdasarkan
                                            </label>
                                            <div className="relative" ref={sortDropdownRef}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsSortDropdownOpen(!isSortDropdownOpen);
                                                        setIsSportDropdownOpen(false);
                                                    }}
                                                    className="w-full flex items-center justify-between bg-white border border-slate-200/90 text-slate-800 text-xs font-semibold rounded-md px-3 py-2 hover:bg-slate-50 transition-all cursor-pointer text-left shadow-2xs"
                                                >
                                                    <span className="truncate">{currentSortLabel}</span>
                                                    <ChevronDown size={13} className={`text-slate-400 shrink-0 ml-1.5 transition-transform duration-200 ${isSortDropdownOpen ? "rotate-180 text-orange-500" : ""}`} />
                                                </button>

                                                {isSortDropdownOpen && (
                                                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200/90 rounded-xl shadow-lg p-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                                                        {sortOptions.map((opt) => {
                                                            const isSelected = sortBy === opt.id;
                                                            return (
                                                                <button
                                                                    key={opt.id}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSortBy(opt.id);
                                                                        setIsSortDropdownOpen(false);
                                                                    }}
                                                                    className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between text-left transition-colors ${
                                                                        isSelected
                                                                            ? "bg-orange-50 text-orange-600 font-bold"
                                                                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                                                    }`}
                                                                >
                                                                    <span>{opt.label}</span>
                                                                    {isSelected && <Check size={12} className="text-orange-500" />}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                />

                {/* ─── ATHLETE PROFILING CARDS GRID (5 COLUMNS) ─── */}
                {processedAthletes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-3.5 animate-in fade-in duration-300">
                        {processedAthletes.map((athlete) => {
                            const isFemale = athlete.gender === "P" || athlete.gender === "female" || athlete.gender === "Perempuan";
                            const initial = athlete.name ? athlete.name.charAt(0).toUpperCase() : "-";
                            const hasPHV = !!athlete.latest_phv;
                            const hasComp = !!athlete.latest_composition;
                            const hasWellness = !!athlete.latest_wellness;
                            const hasScore = athlete.latest_test_score !== null && athlete.latest_test_score !== undefined;
                            const bmi = calculateBMI(athlete.height, athlete.weight);
                            const bmiStatus = getBMIStatus(bmi);
                            const hasGroups = athlete.groups && athlete.groups.length > 0;
                            const hasShared = athlete.shared_packages && athlete.shared_packages.length > 0;
                            const membershipLabel = hasGroups
                                ? (athlete.groups.length > 1 ? `${athlete.groups.length} Grup` : athlete.groups[0].name)
                                : hasShared
                                ? (athlete.shared_packages.length > 1 ? `${athlete.shared_packages.length} Paket Bersama` : athlete.shared_packages[0].name)
                                : (athlete.package?.name || "Privat");
                            const fullMembershipTitle = hasGroups
                                ? `Grup: ${athlete.groups.map((g) => g.name).join(", ")}`
                                : hasShared
                                ? `Paket Bersama: ${athlete.shared_packages.map((sp) => sp.name).join(", ")}`
                                : (athlete.package?.name ? `Paket: ${athlete.package.name}` : "Sesi Privat");

                            return (
                                <div
                                    key={athlete.id}
                                    onClick={() => handleCardClick(athlete.id)}
                                    className="bg-white rounded-xl border border-slate-200/80 p-3.5 hover:border-orange-300 hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between group"
                                >
                                    <div>
                                        {/* Header Row: Avatar, Name, Sport & Group Meta */}
                                        <div className="flex items-start gap-2.5 mb-2.5">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white via-white to-orange-50/90 text-orange-600 border border-slate-200/90 shadow-2xs flex items-center justify-center text-sm font-black shrink-0 overflow-hidden mt-0.5">
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
                                                <h3 className="font-bold text-slate-900 text-xs truncate leading-snug group-hover:text-orange-600 transition-colors">
                                                    {athlete.name}
                                                </h3>

                                                <div className="flex items-center gap-1 text-[10px] truncate mt-0.5">
                                                    <span className="font-semibold text-orange-600 truncate">
                                                        {athlete.sport?.name || "Tanpa Cabor"}
                                                    </span>
                                                    <span className="text-slate-300">•</span>
                                                    <span
                                                        title={fullMembershipTitle}
                                                        className={`truncate font-medium ${
                                                            hasGroups ? "text-blue-600" : "text-slate-500"
                                                        }`}
                                                    >
                                                        {membershipLabel}
                                                    </span>
                                                </div>

                                                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                                    @{athlete.username || "athlete"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Biometrics Strip */}
                                        <div className="grid grid-cols-3 gap-1 text-center bg-slate-50/80 p-1.5 rounded-lg border border-slate-100 mb-2.5 text-[10px]">
                                            <div>
                                                <span className="text-[8px] font-bold text-slate-400 uppercase block">Usia</span>
                                                <span className="font-bold text-slate-800">{athlete.age ? `${athlete.age} th` : "—"}</span>
                                            </div>
                                            <div className="border-x border-slate-200/60">
                                                <span className="text-[8px] font-bold text-slate-400 uppercase block">TB/BB</span>
                                                <span className="font-bold text-slate-800 truncate block">
                                                    {athlete.height ? athlete.height : "—"}/{athlete.weight ? athlete.weight : "—"}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[8px] font-bold text-slate-400 uppercase block">BMI</span>
                                                <span className={`font-bold block truncate ${bmiStatus.color ? bmiStatus.color.split(' ')[0] : 'text-slate-600'}`}>
                                                    {bmi || "—"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Performance Matrix */}
                                        <div className="space-y-1 mb-2 text-[11px]">
                                            {/* 1. Skor Tes Fisik */}
                                            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                                                <span className="text-slate-600 font-semibold flex items-center gap-1 text-[10px]">
                                                    <Target size={11} className="text-orange-500" />
                                                    <span>Skor Fisik</span>
                                                </span>
                                                {hasScore ? (
                                                    <span className="font-black text-[11px] text-orange-600">
                                                        {athlete.latest_test_score} <span className="text-[9px] font-medium text-slate-500">pts</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-[9px] text-slate-400 italic">Belum tes</span>
                                                )}
                                            </div>

                                            {/* 2. Status PHV */}
                                            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                                                <span className="text-slate-600 font-semibold flex items-center gap-1 text-[10px]">
                                                    <Activity size={11} className="text-emerald-500" />
                                                    <span>PHV</span>
                                                </span>
                                                {hasPHV ? (
                                                    <span className="font-bold text-[10px] text-emerald-700 truncate">
                                                        {athlete.latest_phv.phv_status || "Circa"} ({Number(athlete.latest_phv.maturity_offset).toFixed(1)})
                                                    </span>
                                                ) : (
                                                    <span className="text-[9px] text-slate-400 italic">Belum diukur</span>
                                                )}
                                            </div>

                                            {/* 3. Komposisi Tubuh */}
                                            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                                                <span className="text-slate-600 font-semibold flex items-center gap-1 text-[10px]">
                                                    <Scale size={11} className="text-purple-500" />
                                                    <span>Lemak Tubuh</span>
                                                </span>
                                                {hasComp && athlete.latest_composition.body_fat_percentage !== null ? (
                                                    <span className="font-bold text-[10px] text-purple-700">
                                                        {athlete.latest_composition.body_fat_percentage}% BF
                                                    </span>
                                                ) : (
                                                    <span className="text-[9px] text-slate-400 italic">Belum ada</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer Action */}
                                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                                        <span>Lihat Profiling</span>
                                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
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
                        <p className="text-xs text-slate-500">
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
                <PageFooter className="!mt-1 !py-2" />
            </div>
        </AppLayout>
    );
}