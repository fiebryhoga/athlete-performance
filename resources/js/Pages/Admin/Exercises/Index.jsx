import React, { useState, useMemo, useRef } from "react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/Common/PageHeader";
import PageFooter from "@/Components/Common/PageFooter";
import { Head, useForm, Link, usePage, router } from "@inertiajs/react";
import {
    Search, Plus, Trash2, Dumbbell, X, Edit, ChevronDown, ArrowUpDown, Package,
    Image as ImageIcon, Video, UploadCloud, AlignLeft, Filter, Check, ArrowUpRight
} from "lucide-react";

// --- CUSTOM SELECT COMPONENT ---
function CustomSelect({ label, value, options, onChange, placeholder = "Pilih..." }) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((opt) => String(opt.value) === String(value));
    return (
        <div className="space-y-1 relative">
            {label && <label className="block text-[11px] font-bold text-slate-600">{label}</label>}
            <button type="button" onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-800 transition-all text-left shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500">
                <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 ml-1.5 transition-transform ${isOpen ? "rotate-180 text-orange-500" : ""}`} />
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsOpen(false)} />
                    <div className="absolute left-0 top-full mt-1 w-full max-h-48 overflow-y-auto bg-white rounded-md shadow-xl border border-slate-200 p-1 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-0.5 custom-scrollbar">
                        {options.map((opt) => {
                            const isSelected = String(opt.value) === String(value);
                            return (
                                <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors text-left ${isSelected ? "bg-orange-50 text-orange-700 font-bold" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"}`}>
                                    <span className="truncate">{opt.label}</span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-orange-600 shrink-0 ml-1.5" />}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

export default function Index({ auth, exercises, categories = [], packages = [], currentCategoryId }) {
    const { permissions } = usePage().props;
    const canModify = true;

    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("name_asc");
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");
    const [activeTab, setActiveTab] = useState(new URLSearchParams(window.location.search).get("tab") || "exercises");
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { delete: destroy } = useForm();

    // Category Modal
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const { data: catData, setData: setCatData, post: postCat, put: putCat, processing: processingCat, reset: resetCat, delete: destroyCat } = useForm({ name: "" });

    // Bulk Category Modal
    const [isBulkCategoryModalOpen, setIsBulkCategoryModalOpen] = useState(false);
    const { data: bulkCatData, setData: setBulkCatData, post: postBulkCat, processing: processingBulkCat, reset: resetBulkCat } = useForm({ ids: [], category_id: "", new_category_name: "" });

    const sortOptions = [
        { value: "name_asc", label: "Nama (A - Z)" },
        { value: "name_desc", label: "Nama (Z - A)" },
        { value: "created_desc", label: "Terbaru Ditambahkan" },
        { value: "created_asc", label: "Terlama Ditambahkan" },
    ];

    const filteredExercises = useMemo(() => {
        let result = exercises;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((ex) => ex.name.toLowerCase().includes(q));
        }
        return [...result].sort((a, b) => {
            switch (sortOption) {
                case "name_asc": return a.name.localeCompare(b.name);
                case "name_desc": return b.name.localeCompare(a.name);
                case "created_desc": return new Date(b.created_at || 0) - new Date(a.created_at || 0);
                case "created_asc": return new Date(a.created_at || 0) - new Date(b.created_at || 0);
                default: return 0;
            }
        });
    }, [searchQuery, exercises, sortOption]);

    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return categories;
        const q = searchQuery.toLowerCase();
        return categories.filter((cat) => cat.name.toLowerCase().includes(q));
    }, [searchQuery, categories]);

    const filteredPackages = useMemo(() => {
        if (!searchQuery.trim()) return packages;
        const q = searchQuery.toLowerCase();
        return packages.filter((pkg) => pkg.name.toLowerCase().includes(q));
    }, [searchQuery, packages]);

    const handleDeleteExercise = (e, id) => {
        e.preventDefault(); e.stopPropagation();
        if (confirm("Yakin ingin menghapus latihan ini?")) { router.delete(route("admin.exercises.destroy", id)); }
    };

    const toggleExerciseMainSelection = (exerciseId) => {
        setSelectedExercises((prev) => prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId]);
    };

    const handleBulkDelete = () => {
        if (confirm(`Yakin ingin menghapus ${selectedExercises.length} latihan terpilih?`)) {
            router.delete(route("admin.exercises.bulk-destroy"), { data: { ids: selectedExercises }, onSuccess: () => setSelectedExercises([]) });
        }
    };

    const handleOpenBulkCategoryModal = () => {
        setBulkCatData({ ids: selectedExercises, category_id: "", new_category_name: "" });
        setIsBulkCategoryModalOpen(true);
    };

    const submitBulkCategory = (e) => {
        e.preventDefault();
        postBulkCat(route("admin.exercises.bulk-assign-category"), { onSuccess: () => { setIsBulkCategoryModalOpen(false); resetBulkCat(); setSelectedExercises([]); } });
    };

    const openCategoryModal = (cat = null) => {
        if (cat) { setEditingCategoryId(cat.id); setCatData("name", cat.name); } else { setEditingCategoryId(null); resetCat(); }
        setIsCategoryModalOpen(true);
    };

    const submitCategory = (e) => {
        e.preventDefault();
        if (editingCategoryId) {
            putCat(route("admin.exercise-categories.update", editingCategoryId), { onSuccess: () => { setIsCategoryModalOpen(false); resetCat(); } });
        } else {
            postCat(route("admin.exercise-categories.store"), { onSuccess: () => { setIsCategoryModalOpen(false); resetCat(); } });
        }
    };

    const handleDeleteCategory = (e, id) => {
        e.preventDefault(); e.stopPropagation();
        if (confirm("Yakin ingin menghapus kategori ini? Latihan di dalamnya akan menjadi tanpa kategori.")) { destroyCat(route("admin.exercise-categories.destroy", id)); }
    };

    const handleDeletePackage = (e, id) => {
        e.preventDefault(); e.stopPropagation();
        if (confirm("Yakin ingin menghapus paket latihan ini?")) { router.delete(route("admin.exercise-packages.destroy", id)); }
    };

    const activeFilterCount = (sortOption !== 'name_asc' ? 1 : 0);

    const headerTitle = useMemo(() => {
        if (!currentCategoryId) return "Master Latihan";
        if (currentCategoryId === "uncategorized") return "Latihan Tanpa Kategori";
        const cat = categories.find((c) => c.id == currentCategoryId);
        return cat ? `Kategori: ${cat.name}` : "Master Latihan";
    }, [currentCategoryId, categories]);

    return (
        <AppLayout title={headerTitle}>
            <Head title={headerTitle} />

            <div className="space-y-4 pb-6">
                <PageHeader
                    title={headerTitle}
                    description="Kelola daftar bentuk latihan fisik, kategori, dan paket latihan."
                    actions={
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative w-44 sm:w-52">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={activeTab === "exercises" ? "Cari latihan..." : activeTab === "packages" ? "Cari paket..." : "Cari kategori..."}
                                    className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-2xs" />
                                {searchQuery && <button type="button" onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-3 h-3" /></button>}
                            </div>

                            {activeTab === "exercises" && (
                                <div className="relative">
                                    {isFilterOpen && <div className="fixed inset-0 z-20 cursor-default" onClick={() => setIsFilterOpen(false)} />}
                                    <button type="button" onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 hover:via-orange-50/40 hover:to-orange-100/60 text-orange-600 border border-slate-200/90 hover:border-orange-300 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer">
                                        <Filter className="w-3.5 h-3.5 text-orange-500" /><span>Filter</span>
                                        {activeFilterCount > 0 && <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black flex items-center justify-center">{activeFilterCount}</span>}
                                        <ChevronDown className={`w-3 h-3 text-orange-400 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
                                    </button>
                                    {isFilterOpen && (
                                        <div className="absolute right-0 top-full mt-1.5 w-72 sm:w-80 bg-white rounded-lg shadow-xl border border-slate-200/80 p-4 z-30 animate-in fade-in zoom-in-95 duration-100 space-y-3.5">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5"><Filter className="w-3.5 h-3.5 text-orange-500" /> Filter Latihan</h4>
                                                <button type="button" onClick={() => setIsFilterOpen(false)} className="text-slate-400 hover:text-slate-600 p-0.5"><X className="w-3.5 h-3.5" /></button>
                                            </div>

                                            {/* Category Filter */}
                                            <div className="space-y-1">
                                                <label className="block text-[11px] font-bold text-slate-600">Kategori</label>
                                                <div className="max-h-32 overflow-y-auto bg-slate-50 rounded-md p-1.5 border border-slate-200 space-y-0.5 custom-scrollbar">
                                                    <button type="button" onClick={() => { router.get(route('admin.exercises.index'), {}, { preserveState: true }); setIsFilterOpen(false); }}
                                                        className={`w-full text-left px-2 py-1 text-xs rounded ${!currentCategoryId ? 'bg-orange-50 text-orange-700 font-bold' : 'text-slate-700 hover:bg-white font-medium'}`}>
                                                        Semua Latihan
                                                    </button>
                                                    <button type="button" onClick={() => { router.get(route('admin.exercises.index', { category_id: 'uncategorized' }), {}, { preserveState: true }); setIsFilterOpen(false); }}
                                                        className={`w-full text-left px-2 py-1 text-xs rounded ${currentCategoryId === 'uncategorized' ? 'bg-orange-50 text-orange-700 font-bold' : 'text-slate-700 hover:bg-white font-medium'}`}>
                                                        Tanpa Kategori
                                                    </button>
                                                    {categories.map(cat => (
                                                        <button key={cat.id} type="button" onClick={() => { router.get(route('admin.exercises.index', { category_id: cat.id }), {}, { preserveState: true }); setIsFilterOpen(false); }}
                                                            className={`w-full text-left px-2 py-1 text-xs rounded truncate ${currentCategoryId == cat.id ? 'bg-orange-50 text-orange-700 font-bold' : 'text-slate-700 hover:bg-white font-medium'}`}>
                                                            {cat.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <CustomSelect label="Urutkan" value={sortOption} options={sortOptions} onChange={setSortOption} />
                                            <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                                                <button type="button" onClick={() => setIsFilterOpen(false)} className="px-3 py-1.5 bg-gradient-to-r from-white via-white to-orange-50/70 hover:to-orange-100/80 text-orange-600 hover:text-orange-700 border border-slate-200 hover:border-slate-300 rounded-md text-xs font-bold transition-all shadow-2xs cursor-pointer">Terapkan</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {canModify && (
                                <>
                                    {activeTab === "exercises" && (
                                        <>
                                            <Link href={route("admin.exercises.bulk-create")} className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 text-orange-600 border border-slate-200/90 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-xs">
                                                <AlignLeft className="w-3.5 h-3.5" /> Buat Banyak
                                            </Link>
                                            <Link href={route("admin.exercises.create")} className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-orange-500 to-orange-600 text-white border border-orange-600 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-sm hover:from-orange-600 hover:to-orange-700">
                                                <Plus className="w-3.5 h-3.5" /> Buat Latihan
                                            </Link>
                                        </>
                                    )}
                                    {activeTab === "categories" && (
                                        <button onClick={() => openCategoryModal()} className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-orange-500 to-orange-600 text-white border border-orange-600 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-sm hover:from-orange-600 hover:to-orange-700 cursor-pointer">
                                            <Plus className="w-3.5 h-3.5" /> Buat Kategori
                                        </button>
                                    )}
                                    {activeTab === "packages" && (
                                        <Link href={route("admin.exercise-packages.create")} className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-orange-500 to-orange-600 text-white border border-orange-600 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-sm hover:from-orange-600 hover:to-orange-700">
                                            <Plus className="w-3.5 h-3.5" /> Buat Paket
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    }
                />

                {/* ─── TABS ─── */}
                <div className="flex space-x-0.5 bg-white/80 p-0.5 rounded-lg border border-slate-200 w-fit">
                    <button type="button" onClick={() => { setActiveTab("exercises"); router.get(route('admin.exercises.index'), {}, { preserveState: true }); }}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === "exercises" ? "bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 text-orange-600 border border-slate-200/90 shadow-2xs" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}>
                        <Dumbbell className="w-3.5 h-3.5" /> Latihan Satuan
                    </button>
                    <button type="button" onClick={() => setActiveTab("categories")}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === "categories" ? "bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 text-orange-600 border border-slate-200/90 shadow-2xs" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}>
                        <Edit className="w-3.5 h-3.5" /> Kategori Latihan
                    </button>
                    <button type="button" onClick={() => setActiveTab("packages")}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === "packages" ? "bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 text-orange-600 border border-slate-200/90 shadow-2xs" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}>
                        <Package className="w-3.5 h-3.5" /> Paket Latihan
                    </button>
                </div>

                {/* ─── BULK SELECTION BAR ─── */}
                {activeTab === "exercises" && selectedExercises.length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-lg">
                        <span className="text-xs font-bold">{selectedExercises.length} Latihan Terpilih</span>
                        <div className="flex gap-2">
                            <button onClick={() => setSelectedExercises([])} className="flex items-center gap-1.5 px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-md text-xs font-semibold transition-colors">Batal</button>
                            <button onClick={handleOpenBulkCategoryModal} className="flex items-center gap-1.5 px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-md text-xs font-semibold transition-colors"><Edit className="w-3 h-3" /> Pindahkan</button>
                            <button onClick={handleBulkDelete} className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/20 text-red-100 hover:bg-red-500/40 rounded-md text-xs font-semibold transition-colors"><Trash2 className="w-3 h-3" /> Hapus</button>
                        </div>
                    </div>
                )}

                {/* ─── EXERCISES TAB ─── */}
                {activeTab === "exercises" && (
                    <>
                        {filteredExercises.length === 0 ? (
                            <div className="col-span-full py-16 px-4 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-500 shadow-2xs"><Dumbbell className="w-5 h-5" /></div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-slate-800">Belum ada latihan yang didaftarkan</h4>
                                    <p className="text-xs text-slate-400 font-medium max-w-sm">Mulai dengan menambah latihan baru.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
                                {filteredExercises.map((ex) => (
                                    <div key={ex.id} onClick={() => router.get(route('admin.exercises.edit', ex.id))}
                                        className={`group cursor-pointer relative bg-white rounded-md border ${selectedExercises.includes(ex.id) ? 'border-orange-400 ring-1 ring-orange-400' : 'border-slate-200 hover:border-slate-300'} shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col justify-between overflow-hidden`}>
                                        {canModify && (
                                            <div className="absolute top-2.5 right-2.5 z-10">
                                                <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                                                    checked={selectedExercises.includes(ex.id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={() => toggleExerciseMainSelection(ex.id)} />
                                            </div>
                                        )}
                                        <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                                            <div className="flex items-start gap-2.5">
                                                <div className="w-9 h-9 rounded-md border border-orange-200/60 shadow-2xs bg-orange-50/60 text-orange-600 font-bold text-sm flex items-center justify-center shrink-0 overflow-hidden">
                                                    {ex.images && ex.images.length > 0 ? <img src={ex.images[0]} alt={ex.name} className="w-full h-full object-cover" /> : <Dumbbell className="w-4 h-4" />}
                                                </div>
                                                <div className="min-w-0 flex-1 space-y-0.5 pr-4">
                                                    <h3 className="font-bold text-slate-900 text-xs truncate group-hover:text-orange-600 transition-colors leading-tight">{ex.name}</h3>
                                                    <p className="text-[10.5px] text-slate-400 font-medium truncate">{ex.category?.name || "Tanpa Kategori"}</p>
                                                </div>
                                            </div>

                                            {ex.description && <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{ex.description}</p>}

                                            {/* Target Body Parts / Muscles Badges */}
                                            {ex.body_parts && Array.isArray(ex.body_parts) && ex.body_parts.length > 0 && (
                                                <div className="flex flex-wrap gap-1 pt-0.5">
                                                    {ex.body_parts.slice(0, 3).map((bp, bpIdx) => (
                                                        <span key={bpIdx} className="px-1.5 py-0.2 bg-orange-50 text-orange-700 border border-orange-200/60 rounded text-[9px] font-bold">
                                                            {bp}
                                                        </span>
                                                    ))}
                                                    {ex.body_parts.length > 3 && (
                                                        <span className="px-1 py-0.2 bg-slate-100 text-slate-600 rounded text-[9px] font-bold" title={ex.body_parts.slice(3).join(', ')}>
                                                            +{ex.body_parts.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-100">
                                                <div className="p-1.5 bg-slate-50/80 rounded border border-slate-100 shadow-2xs">
                                                    <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">Gambar</span>
                                                    <div className="flex items-baseline gap-0.5 mt-0.5">
                                                        <span className="text-[11px] font-bold text-slate-800 leading-tight">{Array.isArray(ex.images) ? ex.images.length : 0}</span>
                                                    </div>
                                                </div>
                                                <div className="p-1.5 bg-slate-50/80 rounded border border-slate-100 shadow-2xs">
                                                    <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">Video</span>
                                                    <div className="flex items-baseline gap-0.5 mt-0.5">
                                                        <span className="text-[11px] font-bold text-slate-800 leading-tight">{Array.isArray(ex.videos) ? ex.videos.length : 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-3 py-1.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                                            <span className="text-[9.5px] font-medium text-slate-400 truncate">{ex.category?.name || "Tanpa Kategori"}</span>
                                            <div className="flex items-center gap-1.5">
                                                {canModify && (
                                                    <button onClick={(e) => handleDeleteExercise(e, ex.id)} className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"><Trash2 className="w-3 h-3" /></button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* ─── CATEGORIES TAB ─── */}
                {activeTab === "categories" && (
                    <>
                        {filteredCategories.length === 0 ? (
                            <div className="col-span-full py-16 px-4 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-500 shadow-2xs"><Edit className="w-5 h-5" /></div>
                                <div className="space-y-1"><h4 className="text-sm font-bold text-slate-800">Belum ada kategori</h4></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
                                {filteredCategories.map((cat) => (
                                    <div key={cat.id} className="group relative bg-white rounded-md border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col justify-between overflow-hidden">
                                        <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                                            <div className="flex items-start gap-2.5">
                                                <div className="w-9 h-9 rounded-md border border-orange-200/60 shadow-2xs bg-orange-50/60 text-orange-600 flex items-center justify-center shrink-0"><Edit className="w-4 h-4" /></div>
                                                <div className="min-w-0 flex-1"><h3 className="font-bold text-slate-900 text-xs truncate group-hover:text-orange-600 transition-colors leading-tight">{cat.name}</h3></div>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                                            <span className="text-[9.5px] font-medium text-slate-400">Kategori</span>
                                            <div className="flex items-center gap-1.5">
                                                {canModify && (
                                                    <>
                                                        <button onClick={() => openCategoryModal(cat)} className="text-slate-400 hover:text-orange-500 transition-colors p-0.5"><Edit className="w-3 h-3" /></button>
                                                        <button onClick={(e) => handleDeleteCategory(e, cat.id)} className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"><Trash2 className="w-3 h-3" /></button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* ─── PACKAGES TAB ─── */}
                {activeTab === "packages" && (
                    <>
                        {filteredPackages.length === 0 ? (
                            <div className="col-span-full py-16 px-4 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-500 shadow-2xs"><Package className="w-5 h-5" /></div>
                                <div className="space-y-1"><h4 className="text-sm font-bold text-slate-800">Belum ada paket latihan</h4></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
                                {filteredPackages.map((pkg) => (
                                    <div key={pkg.id} className="group relative bg-white rounded-md border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col justify-between overflow-hidden">
                                        <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                                            <div className="flex items-start gap-2.5">
                                                <div className="w-9 h-9 rounded-md border border-orange-200/60 shadow-2xs bg-orange-50/60 text-orange-600 flex items-center justify-center shrink-0"><Package className="w-4 h-4" /></div>
                                                <div className="min-w-0 flex-1 space-y-0.5">
                                                    <h3 className="font-bold text-slate-900 text-xs truncate group-hover:text-orange-600 transition-colors leading-tight">{pkg.name}</h3>
                                                    <p className="text-[10.5px] text-slate-400 font-medium">{pkg.exercises?.length || 0} Latihan</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                                            <span className="text-[9.5px] font-medium text-slate-400">{pkg.exercises?.length || 0} Latihan</span>
                                            <div className="flex items-center gap-1.5">
                                                {canModify && (
                                                    <>
                                                        <Link href={route("admin.exercise-packages.edit", pkg.id)} className="text-slate-400 hover:text-orange-500 transition-colors p-0.5"><Edit className="w-3 h-3" /></Link>
                                                        <button onClick={(e) => handleDeletePackage(e, pkg.id)} className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"><Trash2 className="w-3 h-3" /></button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                <PageFooter className="!mt-8 !pt-4 !pb-1" />
            </div>

            {/* ─── BULK CATEGORY MODAL ─── */}
            {isBulkCategoryModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><ArrowUpDown size={18} className="text-slate-400" /> Pindahkan Kategori ({selectedExercises.length} Latihan)</h3>
                            <button onClick={() => setIsBulkCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="bulkCategoryForm" onSubmit={submitBulkCategory}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2">Pilih Kategori Tujuan</label>
                                        <select className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none" value={bulkCatData.category_id} onChange={(e) => setBulkCatData("category_id", e.target.value)}>
                                            <option value="">-- Buat Kategori Baru --</option>
                                            <option value="uncategorized">Tanpa Kategori</option>
                                            {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                                        </select>
                                    </div>
                                    {bulkCatData.category_id === "" && (
                                        <div className="animate-in slide-in-from-top-2 duration-200">
                                            <label className="block text-xs font-bold text-slate-500 mb-2">Nama Kategori Baru</label>
                                            <input type="text" className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none" value={bulkCatData.new_category_name} onChange={(e) => setBulkCatData("new_category_name", e.target.value)} placeholder="e.g., Flexibility & Mobility..." required autoFocus />
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                            <button type="button" onClick={() => setIsBulkCategoryModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors">Batal</button>
                            <button type="submit" form="bulkCategoryForm" disabled={processingBulkCat} className="px-6 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors disabled:opacity-50 shadow-sm shadow-orange-500/20">{processingBulkCat ? "Memproses..." : "Terapkan Kategori"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── CATEGORY MODAL ─── */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">{editingCategoryId ? "Edit Kategori" : "Buat Kategori Baru"}</h3>
                            <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={submitCategory}>
                            <div className="p-6">
                                <label className="block text-[11px] font-bold text-slate-500 mb-2">Nama Kategori</label>
                                <input type="text" className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none" value={catData.name} onChange={(e) => setCatData("name", e.target.value)} placeholder="e.g., Core, Upper Body..." required autoFocus />
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">Batal</button>
                                <button type="submit" disabled={processingCat} className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors disabled:opacity-50">{processingCat ? "Menyimpan..." : "Simpan Kategori"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
