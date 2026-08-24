import React, { useState, useEffect } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import PageHeader from "@/Components/Common/PageHeader";
import PageFooter from "@/Components/Common/PageFooter";
import {
    Plus,
    Calendar,
    User,
    Activity,
    Search,
    Filter,
    X,
    ChevronDown,
    Check,
    Edit3,
    ArrowUpRight,
    Trash2,
    Target,
} from "lucide-react";

export default function Index({ tests = [], sports = [], filters = {} }) {
    const { auth } = usePage().props;
    const isAthlete = auth.user.role === "athlete";

    const [search, setSearch] = useState(filters?.search || "");
    const [selectedSport, setSelectedSport] = useState(filters?.sport_id || "");
    const [selectedMonth, setSelectedMonth] = useState(filters?.month || "");
    const [startDate, setStartDate] = useState(filters?.start_date || "");
    const [endDate, setEndDate] = useState(filters?.end_date || "");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Custom confirmation modal state
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        testId: null,
        athleteName: "",
        isLoading: false,
    });

    useEffect(() => {
        if (isAthlete) return;

        const timer = setTimeout(() => {
            router.get(
                route("admin.performance.index"),
                {
                    search: search,
                    sport_id: selectedSport,
                    month: selectedMonth,
                    start_date: startDate,
                    end_date: endDate,
                },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 350);

        return () => clearTimeout(timer);
    }, [search, selectedSport, selectedMonth, startDate, endDate, isAthlete]);

    const resetFilters = () => {
        setSearch("");
        setSelectedSport("");
        setSelectedMonth("");
        setStartDate("");
        setEndDate("");
    };

    const activeFilterCount = [
        selectedSport ? 1 : 0,
        selectedMonth ? 1 : 0,
        startDate || endDate ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    const getPerformanceStatus = (val) => {
        const score = parseFloat(val);
        if (score >= 90)
            return {
                label: "Sangat Baik",
                badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
                bar: "bg-emerald-500",
            };
        if (score >= 80)
            return {
                label: "Baik",
                badge: "bg-teal-50 text-teal-700 border-teal-200/80",
                bar: "bg-teal-500",
            };
        if (score >= 70)
            return {
                label: "Cukup",
                badge: "bg-amber-50 text-amber-700 border-amber-200/80",
                bar: "bg-amber-500",
            };
        if (score >= 60)
            return {
                label: "Kurang",
                badge: "bg-orange-50 text-orange-700 border-orange-200/80",
                bar: "bg-orange-500",
            };
        return {
            label: "Sangat Kurang",
            badge: "bg-rose-50 text-rose-700 border-rose-200/80",
            bar: "bg-rose-500",
        };
    };

    const openDeleteModal = (id, name) => {
        setConfirmModal({
            isOpen: true,
            testId: id,
            athleteName: name || "Atlet",
            isLoading: false,
        });
    };

    const closeDeleteModal = () => {
        setConfirmModal({
            isOpen: false,
            testId: null,
            athleteName: "",
            isLoading: false,
        });
    };

    const executeDelete = () => {
        if (!confirmModal.testId) return;
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        router.delete(route("admin.performance.destroy", confirmModal.testId), {
            onSuccess: () => closeDeleteModal(),
            onFinish: () =>
                setConfirmModal((prev) => ({ ...prev, isLoading: false })),
        });
    };

    return (
        <AppLayout title="Tes Fisik">
            <Head title="Tes Fisik" />

            <div className="space-y-4 mx-auto">
                {/* ─── 1. PAGE HEADER ─── */}
                <PageHeader
                    title="Tes Fisik"
                    description="Kelola dan pantau hasil asesmen performa fisik atlet."
                    actions={
                        !isAthlete && (
                            <div className="flex flex-wrap items-center gap-2.5">
                                {/* Search Input */}
                                <div className="relative min-w-[180px] sm:w-56">
                                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Cari nama atlet..."
                                        className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-2xs"
                                    />
                                    {search && (
                                        <button
                                            onClick={() => setSearch("")}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>

                                {/* Filter Dropdown Button */}
                                <div className="relative">
                                    {isFilterOpen && (
                                        <div
                                            className="fixed inset-0 z-20 cursor-default"
                                            onClick={() =>
                                                setIsFilterOpen(false)
                                            }
                                        ></div>
                                    )}
                                    <button
                                        onClick={() =>
                                            setIsFilterOpen(!isFilterOpen)
                                        }
                                        className={`flex items-center gap-1.5 px-3 py-1.5 bg-white border rounded-md text-xs font-semibold shadow-2xs transition-all ${
                                            activeFilterCount > 0
                                                ? "border-orange-300 text-orange-600 bg-orange-50/30"
                                                : "border-slate-200 hover:border-slate-300 text-slate-700"
                                        }`}
                                    >
                                        <Filter
                                            className={`w-3.5 h-3.5 ${
                                                activeFilterCount > 0
                                                    ? "text-orange-500"
                                                    : "text-slate-400"
                                            }`}
                                        />
                                        <span>Filter</span>
                                        {activeFilterCount > 0 && (
                                            <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold flex items-center justify-center">
                                                {activeFilterCount}
                                            </span>
                                        )}
                                        <ChevronDown
                                            className={`w-3 h-3 text-slate-400 transition-transform ${
                                                isFilterOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    {/* Filter Modal / Popover */}
                                    {isFilterOpen && (
                                        <div className="absolute right-0 top-full mt-1.5 w-72 sm:w-80 bg-white rounded-lg shadow-xl border border-slate-200/80 p-4 z-30 animate-in fade-in zoom-in-95 duration-100 space-y-3.5">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                                    <Filter className="w-3.5 h-3.5 text-orange-500" />
                                                    Filter Tes Fisik
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    {activeFilterCount > 0 && (
                                                        <button
                                                            onClick={
                                                                resetFilters
                                                            }
                                                            className="text-[11px] font-semibold text-rose-600 hover:underline"
                                                        >
                                                            Reset
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() =>
                                                            setIsFilterOpen(
                                                                false,
                                                            )
                                                        }
                                                        className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
                                                        title="Tutup"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* 1. Filter Cabang Olahraga */}
                                            <div className="space-y-1">
                                                <label className="block text-[11px] font-bold text-slate-600">
                                                    Cabang Olahraga
                                                </label>
                                                <select
                                                    value={selectedSport}
                                                    onChange={(e) =>
                                                        setSelectedSport(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                                >
                                                    <option value="">
                                                        Semua Cabor
                                                    </option>
                                                    {sports.map((sport) => (
                                                        <option
                                                            key={sport.id}
                                                            value={sport.id}
                                                        >
                                                            {sport.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* 2. Filter Bulan */}
                                            <div className="space-y-1">
                                                <label className="block text-[11px] font-bold text-slate-600">
                                                    Bulan
                                                </label>
                                                <input
                                                    type="month"
                                                    value={selectedMonth}
                                                    onChange={(e) => {
                                                        setSelectedMonth(
                                                            e.target.value,
                                                        );
                                                        setStartDate("");
                                                        setEndDate("");
                                                    }}
                                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                                />
                                            </div>

                                            {/* 3. Filter Rentang Tanggal */}
                                            <div className="space-y-1 pt-1 border-t border-slate-100">
                                                <label className="block text-[11px] font-bold text-slate-600">
                                                    Atau Rentang Tanggal
                                                </label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 font-medium block mb-0.5">
                                                            Dari:
                                                        </span>
                                                        <input
                                                            type="date"
                                                            value={startDate}
                                                            onChange={(e) => {
                                                                setStartDate(
                                                                    e.target
                                                                        .value,
                                                                );
                                                                setSelectedMonth(
                                                                    "",
                                                                );
                                                            }}
                                                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-medium text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 font-medium block mb-0.5">
                                                            Sampai:
                                                        </span>
                                                        <input
                                                            type="date"
                                                            value={endDate}
                                                            onChange={(e) => {
                                                                setEndDate(
                                                                    e.target
                                                                        .value,
                                                                );
                                                                setSelectedMonth(
                                                                    "",
                                                                );
                                                            }}
                                                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-medium text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Reset Filter Button */}
                                {(search || activeFilterCount > 0) && (
                                    <button
                                        onClick={resetFilters}
                                        className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-md transition-colors border border-slate-200/60"
                                        title="Atur Ulang Filter"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}

                                {/* Create Button */}
                                <Link
                                    href={route("admin.performance.create")}
                                    className="inline-flex items-center justify-center px-3.5 py-1.5 bg-gradient-to-r from-white via-white to-orange-50/70 hover:to-orange-100/80 text-orange-600 hover:text-orange-700 border border-slate-200 hover:border-slate-300 rounded-md text-xs font-bold transition-all shadow-2xs"
                                >
                                    Input Tes Fisik
                                </Link>
                            </div>
                        )
                    }
                />

                {/* ─── 2. TEST CARDS GRID (5 COLUMNS) ─── */}
                {tests.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
                        {tests.map((test) => {
                            const status = getPerformanceStatus(
                                test.average_score,
                            );

                            return (
                                <div
                                    key={test.id}
                                    className="bg-gradient-to-br from-white via-white to-orange-50/30 rounded-lg border border-slate-200/80 shadow-2xs hover:border-orange-300/80 hover:shadow-xs transition-all flex flex-col justify-between overflow-hidden group"
                                >
                                    {/* Top Content */}
                                    <div className="p-3.5 space-y-2.5">
                                        {/* Status & Date */}
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded border ${status.badge}`}
                                            >
                                                {status.label}
                                            </span>
                                            <span className="text-[10.5px] font-semibold text-slate-400">
                                                {test.date}
                                            </span>
                                        </div>

                                        {/* Athlete Info */}
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 font-bold text-[10px] flex items-center justify-center shrink-0 overflow-hidden">
                                                {test.athlete?.profile_photo ? (
                                                    <img
                                                        src={
                                                            test.athlete
                                                                .profile_photo_url ||
                                                            `/storage/${test.athlete.profile_photo}`
                                                        }
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    (test.athlete?.name || "A")
                                                        .charAt(0)
                                                        .toUpperCase()
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-xs font-bold text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                                                    {test.athlete?.name ||
                                                        "Unknown Athlete"}
                                                </h3>
                                                <p className="text-[10px] text-slate-500 font-medium truncate">
                                                    {test.athlete?.sport
                                                        ?.name || "Umum"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Session Name (Nama Sesi) */}
                                        {test.name && (
                                            <div
                                                className="text-[10.5px] font-semibold text-slate-700 bg-white/90 px-2 py-1 rounded border border-slate-200/70 truncate flex items-center gap-1.5 shadow-2xs"
                                                title={test.name}
                                            >
                                                <span className="text-slate-400 font-medium shrink-0">
                                                    Sesi:
                                                </span>
                                                <span className="truncate font-bold text-slate-800">
                                                    {test.name}
                                                </span>
                                            </div>
                                        )}

                                        {/* Total Score Banner */}
                                        <div className="bg-white rounded-md p-2.5 border border-slate-200/70 flex items-center justify-between">
                                            <div>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                                                    Skor Performa
                                                </span>
                                                <div className="flex items-baseline gap-1 mt-0.5">
                                                    <span className="text-xl font-black text-slate-900">
                                                        {test.average_score}
                                                    </span>
                                                    <span className="text-[10px] font-semibold text-slate-400">
                                                        / 100
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                                                    Target
                                                </span>
                                                <span className="text-[11px] font-bold text-slate-700 mt-0.5 block">
                                                    100 Pts
                                                </span>
                                            </div>
                                        </div>

                                        {/* Category Breakdown (Top 3) */}
                                        <div className="space-y-1.5 pt-0.5">
                                            <div className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
                                                Rincian Kategori
                                            </div>
                                            <div className="space-y-1.5">
                                                {Object.entries(
                                                    test.category_scores || {},
                                                )
                                                    .slice(0, 3)
                                                    .map(
                                                        ([category, score]) => {
                                                            const catStatus =
                                                                getPerformanceStatus(
                                                                    score,
                                                                );
                                                            return (
                                                                <div
                                                                    key={
                                                                        category
                                                                    }
                                                                    className="space-y-0.5"
                                                                >
                                                                    <div className="flex justify-between text-[10px]">
                                                                        <span className="font-semibold text-slate-600 truncate pr-1">
                                                                            {
                                                                                category
                                                                            }
                                                                        </span>
                                                                        <span className="font-bold text-slate-800">
                                                                            {
                                                                                score
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                                                        <div
                                                                            className={`h-full rounded-full transition-all duration-500 ${catStatus.bar}`}
                                                                            style={{
                                                                                width: `${score}%`,
                                                                            }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        },
                                                    )}

                                                {Object.keys(
                                                    test.category_scores || {},
                                                ).length > 3 && (
                                                    <p className="text-[9.5px] text-center text-slate-400 font-medium pt-0.5">
                                                        +
                                                        {Object.keys(
                                                            test.category_scores,
                                                        ).length - 3}{" "}
                                                        kategori lainnya
                                                    </p>
                                                )}

                                                {Object.keys(
                                                    test.category_scores || {},
                                                ).length === 0 && (
                                                    <p className="text-[10px] text-slate-400 italic text-center py-1">
                                                        Rincian belum tersedia.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Bar Footer */}
                                    <div className="border-t border-slate-100 bg-white/60 p-1.5 flex items-center gap-1">
                                        {!isAthlete ? (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        openDeleteModal(
                                                            test.id,
                                                            test.athlete?.name,
                                                        )
                                                    }
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                                    title="Hapus Data Tes"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                                <Link
                                                    href={route(
                                                        "admin.performance.edit",
                                                        test.id,
                                                    )}
                                                    className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                                    title="Edit Data Nilai"
                                                >
                                                    <Edit3 className="w-3 h-3" />
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "admin.performance.show",
                                                        test.id,
                                                    )}
                                                    className="flex-1 py-1 bg-gradient-to-r from-white via-white to-orange-50/70 hover:to-orange-100/80 text-orange-600 hover:text-orange-700 border border-slate-200 hover:border-slate-300 rounded text-[11px] font-bold flex items-center justify-center gap-0.5 transition-all shadow-2xs"
                                                >
                                                    Detail
                                                    <ArrowUpRight className="w-3 h-3" />
                                                </Link>
                                            </>
                                        ) : (
                                            <Link
                                                href={route(
                                                    "admin.performance.show",
                                                    test.id,
                                                )}
                                                className="w-full py-1 bg-gradient-to-r from-white via-white to-orange-50/70 hover:to-orange-100/80 text-orange-600 hover:text-orange-700 border border-slate-200 hover:border-slate-300 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-all shadow-2xs"
                                            >
                                                Lihat Analisis
                                                <ArrowUpRight className="w-3 h-3" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-lg border border-dashed border-slate-300 p-12 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                            <Search className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">
                            {isAthlete
                                ? "Belum Ada Data Tes Fisik"
                                : "Data Tes Fisik Tidak Ditemukan"}
                        </h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            {isAthlete
                                ? "Anda belum memiliki riwayat tes fisik yang tercatat."
                                : "Tidak ada hasil tes fisik yang cocok dengan kata kunci pencarian atau filter yang dipilih."}
                        </p>
                        {!isAthlete && (search || selectedSport) && (
                            <button
                                onClick={resetFilters}
                                className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-md font-bold text-xs hover:bg-slate-50 transition-colors shadow-2xs"
                            >
                                Atur Ulang Filter
                            </button>
                        )}
                    </div>
                )}

                <PageFooter className="!mt-6 !pt-4 !pb-1" />
            </div>

            {/* ─── MODAL: DELETE CONFIRMATION ─── */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                    <div className="bg-white rounded-lg border border-slate-200/80 shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-white via-rose-50/30 to-white">
                            <h3 className="text-xs sm:text-[13px] font-bold text-slate-900">
                                Hapus Riwayat Tes Fisik
                            </h3>
                            <button
                                onClick={closeDeleteModal}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Apakah Anda yakin ingin menghapus data tes fisik
                                untuk atlet{" "}
                                <strong className="text-slate-800">
                                    "{confirmModal.athleteName}"
                                </strong>
                                ? Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={closeDeleteModal}
                                    className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-md font-bold text-xs hover:bg-slate-50 transition-colors shadow-2xs"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={executeDelete}
                                    disabled={confirmModal.isLoading}
                                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-bold text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                                >
                                    {confirmModal.isLoading
                                        ? "Menghapus..."
                                        : "Hapus Data"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
