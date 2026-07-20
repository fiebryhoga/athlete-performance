import React, { useState, useMemo, useRef } from "react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Head, useForm, Link, usePage, router } from "@inertiajs/react";
import {
    Search,
    Plus,
    Trash2,
    Dumbbell,
    X,
    Edit,
    ChevronDown,
    ArrowUpDown,
    Package,
    Image as ImageIcon,
    Video,
    UploadCloud,
    AlignLeft
} from "lucide-react";

export default function Index({ auth, exercises, categories = [], packages = [], currentCategoryId }) {
    const { permissions } = usePage().props;
    const canModify = true;

    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("name_asc");
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");
    const [activeTab, setActiveTab] = useState(new URLSearchParams(window.location.search).get("tab") || "exercises");
    const [selectedExercises, setSelectedExercises] = useState([]);

    const { delete: destroy } = useForm();
    const fileInputRef = useRef(null);


    // Category Modal
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const {
        data: catData,
        setData: setCatData,
        post: postCat,
        put: putCat,
        processing: processingCat,
        reset: resetCat,
        delete: destroyCat,
    } = useForm({
        name: "",
    });

    // Bulk Category Modal
    const [isBulkCategoryModalOpen, setIsBulkCategoryModalOpen] = useState(false);
    const {
        data: bulkCatData,
        setData: setBulkCatData,
        post: postBulkCat,
        processing: processingBulkCat,
        reset: resetBulkCat,
    } = useForm({
        ids: [],
        category_id: "",
        new_category_name: "",
    });


    const filteredExercises = useMemo(() => {
        let result = exercises;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((ex) => ex.name.toLowerCase().includes(q));
        }

        return [...result].sort((a, b) => {
            switch (sortOption) {
                case "name_asc":
                    return a.name.localeCompare(b.name);
                case "name_desc":
                    return b.name.localeCompare(a.name);
                case "created_desc":
                    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
                case "created_asc":
                    return new Date(a.created_at || 0) - new Date(b.created_at || 0);
                default:
                    return 0;
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
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Yakin ingin menghapus latihan ini?")) {
            router.delete(route("admin.exercises.destroy", id));
        }
    };

    const toggleExerciseMainSelection = (exerciseId) => {
        setSelectedExercises((prev) =>
            prev.includes(exerciseId)
                ? prev.filter((id) => id !== exerciseId)
                : [...prev, exerciseId]
        );
    };

    const handleBulkDelete = () => {
        if (confirm(`Yakin ingin menghapus ${selectedExercises.length} latihan terpilih?`)) {
            router.delete(route("admin.exercises.bulk-destroy"), {
                data: { ids: selectedExercises },
                onSuccess: () => setSelectedExercises([]),
            });
        }
    };

    const handleOpenBulkCategoryModal = () => {
        setBulkCatData({
            ids: selectedExercises,
            category_id: "",
            new_category_name: "",
        });
        setIsBulkCategoryModalOpen(true);
    };

    const submitBulkCategory = (e) => {
        e.preventDefault();
        postBulkCat(route("admin.exercises.bulk-assign-category"), {
            onSuccess: () => {
                setIsBulkCategoryModalOpen(false);
                resetBulkCat();
                setSelectedExercises([]);
            },
        });
    };

    const openCategoryModal = (cat = null) => {
        if (cat) {
            setEditingCategoryId(cat.id);
            setCatData("name", cat.name);
        } else {
            setEditingCategoryId(null);
            resetCat();
        }
        setIsCategoryModalOpen(true);
    };

    const submitCategory = (e) => {
        e.preventDefault();
        if (editingCategoryId) {
            putCat(route("admin.exercise-categories.update", editingCategoryId), {
                onSuccess: () => {
                    setIsCategoryModalOpen(false);
                    resetCat();
                },
            });
        } else {
            postCat(route("admin.exercise-categories.store"), {
                onSuccess: () => {
                    setIsCategoryModalOpen(false);
                    resetCat();
                },
            });
        }
    };

    const handleDeleteCategory = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Yakin ingin menghapus kategori ini? Latihan di dalamnya akan menjadi tanpa kategori.")) {
            destroyCat(route("admin.exercise-categories.destroy", id));
        }
    };

    const handleDeletePackage = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Yakin ingin menghapus paket latihan ini?")) {
            router.delete(route("admin.exercise-packages.destroy", id));
        }
    };

    const togglePackageExercise = (exId) => {
        setPkgData('exercise_ids', pkgData.exercise_ids.includes(exId) 
            ? pkgData.exercise_ids.filter(id => id !== exId)
            : [...pkgData.exercise_ids, exId]
        );
    };

    // Images handling
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setData('images', [...data.images, ...files]);
    };
    
    const removeNewImage = (index) => {
        const newImages = [...data.images];
        newImages.splice(index, 1);
        setData('images', newImages);
    };
    
    const removeExistingImage = (index) => {
        const newExisting = [...data.existing_images];
        newExisting.splice(index, 1);
        setData('existing_images', newExisting);
    };

    // Videos handling
    const addVideoRow = () => setData('videos', [...data.videos, ""]);
    const removeVideoRow = (index) => {
        const newVids = [...data.videos];
        newVids.splice(index, 1);
        if (newVids.length === 0) newVids.push("");
        setData('videos', newVids);
    };
    const updateVideoRow = (index, val) => {
        const newVids = [...data.videos];
        newVids[index] = val;
        setData('videos', newVids);
    };

    const headerTitle = useMemo(() => {
        if (!currentCategoryId) return "Master Latihan";
        if (currentCategoryId === "uncategorized") return "Latihan Tanpa Kategori";
        const cat = categories.find((c) => c.id == currentCategoryId);
        return cat ? `Kategori: ${cat.name}` : "Master Latihan";
    }, [currentCategoryId, categories]);

    return (
        <AppLayout title={headerTitle}>
            <Head title={headerTitle} />
            <PageHeader 
                title={headerTitle}
                subtitle="Kelola daftar bentuk latihan fisik, kategori, dan paket latihan."
                badge="Master Data"
                icon={Dumbbell}
                actions={
                    canModify ? (
                        <div className="flex items-center gap-2">
                            {activeTab === "exercises" && (
                                <>
                                    <Link href={route("admin.exercises.bulk-create")} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs md:text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
                                        <AlignLeft size={16} /> Buat Banyak
                                    </Link>
                                    <Link href={route("admin.exercises.create")} className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-xs md:text-sm font-bold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/20">
                                        <Plus size={16} /> Buat Latihan
                                    </Link>
                                </>
                            )}
                            {activeTab === "categories" && (
                                <button
                                    onClick={() => openCategoryModal()}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-xs md:text-sm font-bold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/20"
                                >
                                    <Plus size={16} /> Buat Kategori
                                </button>
                            )}
                            {activeTab === "packages" && (
                                <Link href={route("admin.exercise-packages.create")} className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-xs md:text-sm font-bold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/20">
                                    <Plus size={16} /> Buat Paket
                                </Link>
                            )}
                        </div>
                    ) : null
                }
            />

            <div className="pb-12 space-y-6 relative">
                {/* Tabs & Filters */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex p-1 bg-slate-100 border border-slate-200 rounded-xl w-fit shadow-sm overflow-x-auto max-w-full">
                        <button
                            onClick={() => {
                                setActiveTab("exercises");
                                router.get(route('admin.exercises.index'), {}, { preserveState: true });
                            }}
                            className={`flex whitespace-nowrap items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === "exercises" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            <Dumbbell size={16} /> Latihan Satuan
                        </button>
                        <button
                            onClick={() => setActiveTab("categories")}
                            className={`flex whitespace-nowrap items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === "categories" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            <Edit size={16} /> Kategori Latihan
                        </button>
                        <button
                            onClick={() => setActiveTab("packages")}
                            className={`flex whitespace-nowrap items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === "packages" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            <Package size={16} /> Paket Latihan
                        </button>
                    </div>

                    {/* Category Filter Dropdown (Only for exercises tab) */}
                    {activeTab === "exercises" && (
                        <div className="relative">
                            <button
                                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                className="flex items-center justify-between w-64 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 transition-colors shadow-sm"
                            >
                                <span className="truncate">
                                    {!currentCategoryId ? "Semua Latihan" : currentCategoryId === 'uncategorized' ? "Tanpa Kategori" : categories.find(c => c.id == currentCategoryId)?.name || "Pilih Kategori"}
                                </span>
                                <ChevronDown size={16} className={`text-slate-500 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
                            </button>
                            
                            {isCategoryDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsCategoryDropdownOpen(false)}></div>
                                    <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        <div className="p-2 border-b border-slate-100">
                                            <div className="relative">
                                                <Search className="absolute left-2.5 top-2.5 text-slate-400" size={14} />
                                                <input 
                                                    type="text" 
                                                    placeholder="Cari kategori..." 
                                                    value={categorySearch}
                                                    onChange={(e) => setCategorySearch(e.target.value)}
                                                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border-none rounded-lg text-sm text-slate-900 focus:ring-0 outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                                            <button 
                                                onClick={() => { router.get(route('admin.exercises.index'), {}, { preserveState: true }); setIsCategoryDropdownOpen(false); }}
                                                className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-100 transition-colors ${!currentCategoryId ? 'bg-slate-100 font-bold text-slate-900' : 'text-slate-700'}`}
                                            >
                                                Semua Latihan
                                            </button>
                                            <button 
                                                onClick={() => { router.get(route('admin.exercises.index', { category_id: 'uncategorized' }), {}, { preserveState: true }); setIsCategoryDropdownOpen(false); }}
                                                className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-100 transition-colors ${currentCategoryId === 'uncategorized' ? 'bg-slate-100 font-bold text-slate-900' : 'text-slate-700'}`}
                                            >
                                                Tanpa Kategori
                                            </button>
                                            {categories.filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase())).map(cat => (
                                                <div key={cat.id} className="flex items-center group">
                                                    <button 
                                                        onClick={() => { router.get(route('admin.exercises.index', { category_id: cat.id }), {}, { preserveState: true }); setIsCategoryDropdownOpen(false); }}
                                                        className={`flex-1 text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-100 transition-colors truncate ${currentCategoryId == cat.id ? 'bg-slate-100 font-bold text-slate-900' : 'text-slate-700'}`}
                                                    >
                                                        {cat.name}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        {canModify && (
                                            <div className="p-2 border-t border-slate-100 bg-slate-50">
                                                <button 
                                                    onClick={() => { openCategoryModal(); setIsCategoryDropdownOpen(false); }}
                                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-900 transition-colors shadow-sm"
                                                >
                                                    <Plus size={14} /> Buat Kategori Baru
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                        <div className="relative w-full sm:w-80 group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="text-slate-400" size={16} />
                            </div>
                            <input
                                type="text"
                                placeholder={
                                    activeTab === "exercises" ? "Cari latihan..." : 
                                    activeTab === "packages" ? "Cari paket..." : "Cari kategori..."
                                }
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-500 focus:ring-1 focus:ring-slate-900 outline-none shadow-sm"
                            />
                        </div>

                        {activeTab === "exercises" && (
                            <div className="relative w-full sm:w-48">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <ArrowUpDown className="text-slate-400" size={16} />
                                </div>
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none shadow-sm appearance-none cursor-pointer truncate"
                                >
                                    <option value="name_asc">Nama (A-Z)</option>
                                    <option value="name_desc">Nama (Z-A)</option>
                                    <option value="created_desc">Terbaru Ditambahkan</option>
                                    <option value="created_asc">Terlama Ditambahkan</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <ChevronDown className="text-slate-400" size={16} />
                                </div>
                            </div>
                        )}
                    </div>


                </div>

                {activeTab === "exercises" && (
                    <>
                        {selectedExercises.length > 0 && (
                            <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl animate-in fade-in slide-in-from-top-2">
                                <span className="text-sm font-bold">
                                    {selectedExercises.length} Latihan Terpilih
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedExercises([])}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleOpenBulkCategoryModal}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors"
                                    >
                                        <Edit size={16} /> Pindahkan Kategori
                                    </button>
                                    <button
                                        onClick={handleBulkDelete}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-100 hover:bg-red-500/40 rounded-xl text-sm font-semibold transition-colors "
                                    >
                                        <Trash2 size={16} /> Hapus
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {filteredExercises.map((ex) => (
                                <div
                                    key={ex.id}
                                    onClick={() => router.get(route('admin.exercises.edit', ex.id))}
                                    className={`group cursor-pointer bg-white border ${selectedExercises.includes(ex.id) ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-900 hover:shadow-md'} rounded-xl p-5 transition-all shadow-sm flex flex-col justify-between relative`}
                                >
                                    {canModify && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                                                checked={selectedExercises.includes(ex.id)}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={() => toggleExerciseMainSelection(ex.id)}
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 border border-slate-200 mb-4 overflow-hidden relative">
                                            {ex.images && ex.images.length > 0 ? (
                                                <img src={ex.images[0]} alt={ex.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Dumbbell size={18} />
                                            )}
                                        </div>
                                        <h4 className="font-bold text-slate-900 pr-6">
                                            {ex.name}
                                        </h4>
                                        <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                                            {ex.category?.name || "Tanpa Kategori"}
                                        </div>
                                        
                                        <div className="flex gap-3 mt-3 text-xs text-slate-500 font-semibold">
                                            <span className="flex items-center gap-1"><ImageIcon size={14}/> {Array.isArray(ex.images) ? ex.images.length : 0}</span>
                                            <span className="flex items-center gap-1"><Video size={14}/> {Array.isArray(ex.videos) ? ex.videos.length : 0}</span>
                                        </div>
                                        
                                        {ex.description && (
                                            <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                                                {ex.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end items-center">
                                        <div className="flex items-center gap-3">
                                            {canModify && (
                                                <>
                                                    <button type="button" onClick={(e) => { e.stopPropagation(); router.get(route("admin.exercises.edit", ex.id)); }} className="text-slate-400 hover:text-slate-900 transition-colors p-1"><Edit size={16} /></button>
                                                    <button
                                                        onClick={(e) => handleDeleteExercise(e, ex.id)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredExercises.length === 0 && (
                                <div className="col-span-full py-12 text-center text-slate-500 text-sm">
                                    Belum ada latihan yang didaftarkan.
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === "categories" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {filteredCategories.map((cat) => (
                            <div
                                key={cat.id}
                                className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-900 transition-all shadow-sm flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 border border-slate-200 mb-4">
                                        <Edit size={18} />
                                    </div>
                                    <h4 className="font-bold text-slate-900">
                                        {cat.name}
                                    </h4>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end items-center gap-3">
                                    {canModify && (
                                        <>
                                            <button
                                                onClick={() => openCategoryModal(cat)}
                                                className="text-slate-400 hover:text-slate-900 transition-colors p-1"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteCategory(e, cat.id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                        {filteredCategories.length === 0 && (
                            <div className="col-span-full py-12 text-center text-slate-500 text-sm">
                                Belum ada kategori yang dibuat.
                            </div>
                        )}
                    </div>
                )}
                
                {activeTab === "packages" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {filteredPackages.map((pkg) => (
                            <div
                                key={pkg.id}
                                className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-900 transition-all shadow-sm flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 border border-slate-200 mb-4">
                                        <Package size={18} />
                                    </div>
                                    <h4 className="font-bold text-slate-900">
                                        {pkg.name}
                                    </h4>
                                    <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                                        {pkg.exercises?.length || 0} Latihan
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end items-center gap-3">
                                    {canModify && (
                                        <>
                                            <Link href={route("admin.exercise-packages.edit", pkg.id)} className="text-slate-400 hover:text-slate-900 transition-colors p-1"><Edit size={16} /></Link>
                                            <button
                                                onClick={(e) => handleDeletePackage(e, pkg.id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                        {filteredPackages.length === 0 && (
                            <div className="col-span-full py-12 text-center text-slate-500 text-sm">
                                Belum ada paket latihan yang dibuat.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bulk Category Modal */}
            {isBulkCategoryModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <ArrowUpDown size={18} className="text-slate-400" />
                                Pindahkan Kategori ({selectedExercises.length} Latihan)
                            </h3>
                            <button
                                onClick={() => setIsBulkCategoryModalOpen(false)}
                                className="text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="bulkCategoryForm" onSubmit={submitBulkCategory}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2">
                                            Pilih Kategori Tujuan
                                        </label>
                                        <select
                                            className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none"
                                            value={bulkCatData.category_id}
                                            onChange={(e) => setBulkCatData("category_id", e.target.value)}
                                        >
                                            <option value="">-- Buat Kategori Baru --</option>
                                            <option value="uncategorized">Tanpa Kategori</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {bulkCatData.category_id === "" && (
                                        <div className="animate-in slide-in-from-top-2 duration-200">
                                            <label className="block text-xs font-bold text-slate-500 mb-2">
                                                Nama Kategori Baru
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none"
                                                value={bulkCatData.new_category_name}
                                                onChange={(e) => setBulkCatData("new_category_name", e.target.value)}
                                                placeholder="e.g., Flexibility & Mobility..."
                                                required
                                                autoFocus
                                            />
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsBulkCategoryModalOpen(false)}
                                className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                form="bulkCategoryForm"
                                disabled={processingBulkCat}
                                className="px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50 shadow-sm shadow-slate-900/20"
                            >
                                {processingBulkCat ? "Memproses..." : "Terapkan Kategori"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">
                                {editingCategoryId ? "Edit Kategori" : "Buat Kategori Baru"}
                            </h3>
                            <button
                                onClick={() => setIsCategoryModalOpen(false)}
                                className="text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={submitCategory}>
                            <div className="p-6">
                                <label className="block text-[11px] font-bold text-slate-500 mb-2">
                                    Nama Kategori
                                </label>
                                <input
                                    type="text"
                                    className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none"
                                    value={catData.name}
                                    onChange={(e) => setCatData("name", e.target.value)}
                                    placeholder="e.g., Core, Upper Body..."
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryModalOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processingCat}
                                    className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {processingCat ? "Menyimpan..." : "Simpan Kategori"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            </AppLayout>
    );
}
