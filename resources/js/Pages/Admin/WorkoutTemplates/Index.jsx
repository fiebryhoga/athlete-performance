import React, { useState, useMemo } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/Common/PageHeader";
import PageFooter from "@/Components/Common/PageFooter";
import {
    Sparkles,
    Plus,
    Search,
    Dumbbell,
    Layers,
    Trash2,
    Edit,
    Copy,
    Eye,
    Zap,
    Flame,
    Activity,
    HeartPulse,
    ChevronRight,
    X,
    Filter,
    Compass,
    Info,
    CheckCircle2,
    Trophy,
    Target,
    Timer,
    Scale,
    Footprints,
    Gauge,
    Shield,
    TrendingUp,
    RotateCcw,
    Crosshair
} from "lucide-react";
import Swal from "sweetalert2";

export default function Index({ templates, categories = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || "");
    const [selectedCategory, setSelectedCategory] = useState(filters.category || "");
    const [previewTemplate, setPreviewTemplate] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("admin.workout-templates.index"),
            { search, category: selectedCategory },
            { preserveState: true }
        );
    };

    const handleCategoryFilter = (cat) => {
        setSelectedCategory(cat);
        router.get(
            route("admin.workout-templates.index"),
            { search, category: cat },
            { preserveState: true }
        );
    };

    const handleDelete = (template) => {
        Swal.fire({
            title: "Hapus Template?",
            text: `Yakin ingin menghapus template "${template.title}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.workout-templates.destroy", template.id), {
                    onSuccess: () => {
                        Swal.fire("Terhapus!", "Template berhasil dihapus.", "success");
                    },
                });
            }
        });
    };

    const handleDuplicate = (template) => {
        router.post(
            route("admin.workout-templates.duplicate", template.id),
            {},
            {
                onSuccess: () => {
                    Swal.fire("Berhasil!", "Template berhasil diduplikasi.", "success");
                },
            }
        );
    };

    const getIconComponent = (iconName) => {
        switch (iconName) {
            case "Zap": return <Zap size={13} className="text-amber-500" />;
            case "Flame": return <Flame size={13} className="text-rose-500" />;
            case "Activity": return <Activity size={13} className="text-emerald-500" />;
            case "HeartPulse": return <HeartPulse size={13} className="text-cyan-500" />;
            case "Trophy": return <Trophy size={13} className="text-yellow-500" />;
            case "Target": return <Target size={13} className="text-indigo-500" />;
            case "Timer": return <Timer size={13} className="text-purple-500" />;
            case "Footprints": return <Footprints size={13} className="text-teal-500" />;
            case "Gauge": return <Gauge size={13} className="text-blue-500" />;
            case "Shield": return <Shield size={13} className="text-emerald-600" />;
            case "TrendingUp": return <TrendingUp size={13} className="text-orange-500" />;
            case "Scale": return <Scale size={13} className="text-sky-500" />;
            case "RotateCcw": return <RotateCcw size={13} className="text-pink-500" />;
            case "Crosshair": return <Crosshair size={13} className="text-red-500" />;
            case "Sparkles": return <Sparkles size={13} className="text-amber-400" />;
            default: return <Dumbbell size={13} className="text-orange-500" />;
        }
    };

    return (
        <AppLayout>
            <Head title="Kelola Template Sesi Latihan" />

            <div className="space-y-4 pb-6">
                {/* PAGE HEADER */}
                <PageHeader
                    title="Template Sesi Latihan"
                    description="Kelola skema program latihan siap pakai untuk pelatih."
                    icon={Sparkles}
                    badge={`${templates.total ?? templates.data.length} Template`}
                    actions={
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Search Bar in Header */}
                            <form onSubmit={handleSearch} className="relative w-48 sm:w-64">
                                <Search
                                    size={13}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari judul atau gerakan..."
                                    className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-orange-500 outline-none transition-all shadow-2xs text-slate-800"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch("");
                                            router.get(
                                                route("admin.workout-templates.index"),
                                                { category: selectedCategory },
                                                { preserveState: true }
                                            );
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </form>

                            <Link
                                href={route("admin.workout-templates.create")}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-md text-xs font-bold shadow-2xs transition-all cursor-pointer"
                            >
                                <Plus size={14} />
                                <span>Buat Template Baru</span>
                            </Link>
                        </div>
                    }
                />

                {/* ═══════════════════════════════════════════════════════
                    TWO-COLUMN (KANAN - KIRI) LAYOUT
                   ═══════════════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    
                    {/* ───────────────────────────────────────────────────
                        KOLOM KIRI (4 Kolom di LG) — Kategori & Informasi
                       ─────────────────────────────────────────────────── */}
                    <div className="lg:col-span-4 space-y-3.5">
                        {/* Sidebar Kategori */}
                        <div className="bg-white border border-slate-200/90 rounded-lg p-3.5 shadow-2xs space-y-2.5">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    <Compass size={14} className="text-orange-500" />
                                    <span>Kategori Template</span>
                                </h3>
                                <span className="text-[10px] font-semibold text-slate-400">
                                    {categories.length + 1} Kategori
                                </span>
                            </div>

                            <div className="space-y-1">
                                <button
                                    type="button"
                                    onClick={() => handleCategoryFilter("")}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md transition-all cursor-pointer ${
                                        !selectedCategory
                                            ? "bg-orange-500 text-white font-bold shadow-2xs"
                                            : "text-slate-700 hover:bg-slate-50 font-medium"
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={13} className={!selectedCategory ? "text-white" : "text-slate-400"} />
                                        <span>Semua Kategori</span>
                                    </div>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                                        !selectedCategory ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                                    }`}>
                                        {templates.total ?? templates.data.length}
                                    </span>
                                </button>

                                {categories.map((cat) => {
                                    const isCurrent = selectedCategory === cat;
                                    return (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => handleCategoryFilter(cat)}
                                            className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md transition-all cursor-pointer ${
                                                isCurrent
                                                    ? "bg-orange-500 text-white font-bold shadow-2xs"
                                                    : "text-slate-700 hover:bg-slate-50 font-medium"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 truncate pr-2">
                                                <ChevronRight size={13} className={isCurrent ? "text-white" : "text-slate-400"} />
                                                <span className="truncate">{cat}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tips & Panduan Box */}
                        <div className="bg-slate-50 border border-slate-200/90 rounded-lg p-3.5 space-y-2">
                            <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
                                <Info size={14} className="text-orange-500" />
                                <span>Petunjuk Penggunaan</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                Template yang Anda simpan di sini akan otomatis muncul di popup <strong>"Gunakan Template"</strong> pada form pembuatan sesi latihan pelatih.
                            </p>
                            <div className="pt-1.5 border-t border-slate-200/60 flex items-center gap-1.5 text-[10.5px] text-slate-600 font-medium">
                                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                                <span>Mendukung Sesi Individu & Sesi Grup</span>
                            </div>
                        </div>
                    </div>

                    {/* ───────────────────────────────────────────────────
                        KOLOM KANAN (8 Kolom di LG) — Grid Template Cards
                       ─────────────────────────────────────────────────── */}
                    <div className="lg:col-span-8 space-y-3">
                        {templates.data.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {templates.data.map((tmpl) => {
                                    const blockCount = tmpl.blocks?.length || 0;
                                    const totalExercises =
                                        tmpl.blocks?.reduce(
                                            (acc, b) => acc + (b.items?.length || 0),
                                            0
                                        ) || 0;

                                    return (
                                        <div
                                            key={tmpl.id}
                                            className="bg-white border border-slate-200/90 hover:border-orange-300 rounded-lg p-3 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group"
                                        >
                                            <div>
                                                {/* Top Row: Icon + Badge + Summary */}
                                                <div className="flex items-center justify-between gap-1.5 mb-2">
                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                        <div className="w-6 h-6 rounded bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                                            {getIconComponent(tmpl.icon)}
                                                        </div>
                                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80 truncate max-w-[130px]">
                                                            {tmpl.category}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] font-medium text-slate-400 shrink-0">
                                                        {blockCount} Fase • {totalExercises} Gerakan
                                                    </span>
                                                </div>

                                                {/* Title & Description */}
                                                <h3 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors truncate mb-1">
                                                    {tmpl.title}
                                                </h3>
                                                <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug mb-2.5">
                                                    {tmpl.description ||
                                                        "Template standar dengan pembagian fase pemanasan, latihan inti, dan pendinginan."}
                                                </p>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewTemplate(tmpl)}
                                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-orange-600 transition-colors cursor-pointer"
                                                >
                                                    <Eye size={12} />
                                                    <span>Rincian</span>
                                                </button>

                                                <div className="flex items-center gap-0.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDuplicate(tmpl)}
                                                        className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                                                        title="Duplikasi Template"
                                                    >
                                                        <Copy size={12} />
                                                    </button>
                                                    <Link
                                                        href={route("admin.workout-templates.edit", tmpl.id)}
                                                        className="p-1 text-slate-400 hover:text-orange-600 rounded hover:bg-orange-50 transition-colors"
                                                        title="Edit Template"
                                                    >
                                                        <Edit size={12} />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(tmpl)}
                                                        className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                                                        title="Hapus Template"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-14 bg-white border border-dashed border-slate-200 rounded-lg shadow-2xs">
                                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 border border-orange-100">
                                    <Sparkles size={18} />
                                </div>
                                <h4 className="text-xs font-bold text-slate-800">
                                    Tidak Ada Template Ditemukan
                                </h4>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                    Belum ada template pada kategori ini atau kata kunci pencarian Anda.
                                </p>
                            </div>
                        )}

                        {/* PAGINATION */}
                        {templates.links && templates.links.length > 3 && (
                            <div className="flex justify-center gap-1 pt-2">
                                {templates.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || "#"}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                                            link.active
                                                ? "bg-orange-500 text-white border-orange-500 font-bold"
                                                : !link.url
                                                ? "text-slate-300 border-slate-100 cursor-not-allowed"
                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* PREVIEW DETAIL MODAL */}
            {previewTemplate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
                    <div className="bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center">
                                    <Sparkles size={16} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900">
                                        {previewTemplate.title}
                                    </h3>
                                    <p className="text-[10.5px] text-slate-400">
                                        {previewTemplate.category}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPreviewTemplate(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Modal Body: Scrollable Phases */}
                        <div className="p-5 overflow-y-auto space-y-4 text-xs">
                            {previewTemplate.description && (
                                <p className="text-[11.5px] text-slate-600 bg-slate-50 p-3 rounded border border-slate-100">
                                    {previewTemplate.description}
                                </p>
                            )}

                            <div className="space-y-3">
                                {previewTemplate.blocks?.map((block, bIdx) => (
                                    <div
                                        key={bIdx}
                                        className="border border-slate-200 rounded-md overflow-hidden"
                                    >
                                        <div className="bg-slate-100/70 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                                            <span className="font-bold text-slate-800 text-[11px]">
                                                {bIdx + 1}. {block.name}
                                            </span>
                                            <span className="text-[10px] text-slate-500 capitalize bg-white px-2 py-0.5 rounded border border-slate-200/60">
                                                {block.category?.replace("_", " ")}
                                            </span>
                                        </div>
                                        <div className="p-3 divide-y divide-slate-100">
                                            {block.items?.map((item, iIdx) => (
                                                <div
                                                    key={iIdx}
                                                    className="py-1.5 flex items-center justify-between text-[11px]"
                                                >
                                                    <span className="font-medium text-slate-700">
                                                        {item.exercise_name || "Gerakan Kustom"}
                                                    </span>
                                                    <span className="text-slate-500 font-mono text-[10.5px]">
                                                        {item.sets ? `${item.sets} set` : ""}{" "}
                                                        {item.reps ? `× ${item.reps}` : ""}{" "}
                                                        {item.load ? `@ ${item.load}kg` : ""}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2">
                            <Link
                                href={route("admin.workout-templates.edit", previewTemplate.id)}
                                className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded text-xs font-bold transition-colors"
                            >
                                Edit Template Ini
                            </Link>
                            <button
                                type="button"
                                onClick={() => setPreviewTemplate(null)}
                                className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded text-xs font-semibold transition-colors cursor-pointer"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
