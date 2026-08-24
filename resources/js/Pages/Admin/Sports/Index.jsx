import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { Plus, Users, Dumbbell, Activity, X, Save, Trash2, Search, Copy, Pencil, AlertTriangle, Filter, ChevronDown, Check, ArrowUpRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import PageHeader from '@/Components/Common/PageHeader';
import PageFooter from '@/Components/Common/PageFooter';

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

export default function Index({ sports }) {
    const { auth } = usePage().props;
    const isSuperadmin = auth?.user?.role === 'superadmin';

    const { data, setData, post, processing, reset, errors } = useForm({ name: '', description: '' });
    const duplicateForm = useForm({ name: '' });
    const editForm = useForm({ name: '', description: '' });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSport, setSelectedSport] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name_asc');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const sortOptions = [
        { value: "name_asc", label: "Nama (A - Z)" },
        { value: "name_desc", label: "Nama (Z - A)" },
        { value: "athletes_desc", label: "Atlet Terbanyak" },
    ];

    const filteredSports = useMemo(() => {
        return (sports || [])
            .filter(sport => {
                if (!searchTerm.trim()) return true;
                return sport.name.toLowerCase().includes(searchTerm.toLowerCase());
            })
            .sort((a, b) => {
                if (sortBy === 'name_asc') return (a.name || '').localeCompare(b.name || '');
                if (sortBy === 'name_desc') return (b.name || '').localeCompare(a.name || '');
                if (sortBy === 'athletes_desc') return (b.athletes_count || 0) - (a.athletes_count || 0);
                return 0;
            });
    }, [sports, searchTerm, sortBy]);

    const activeFilterCount = (sortBy !== 'name_asc' ? 1 : 0);

    const resetFilters = () => {
        setSearchTerm('');
        setSortBy('name_asc');
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.sports.store'), { onSuccess: () => { reset(); setIsModalOpen(false); } });
    };

    const handleDuplicateSubmit = (e) => {
        e.preventDefault();
        duplicateForm.post(route('admin.sports.duplicate', selectedSport.id), {
            onSuccess: () => { duplicateForm.reset(); setIsDuplicateModalOpen(false); setSelectedSport(null); }
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.put(route('admin.sports.update', selectedSport.id), {
            onSuccess: () => { editForm.reset(); setIsEditModalOpen(false); setSelectedSport(null); }
        });
    };

    const openDuplicateModal = (e, sport) => {
        e.preventDefault(); e.stopPropagation();
        setSelectedSport(sport);
        duplicateForm.setData('name', sport.name + ' (Copy)');
        duplicateForm.clearErrors();
        setIsDuplicateModalOpen(true);
    };

    const openEditModal = (e, sport) => {
        e.preventDefault(); e.stopPropagation();
        setSelectedSport(sport);
        editForm.setData({ name: sport.name, description: sport.description || '' });
        editForm.clearErrors();
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (e, sport) => {
        e.preventDefault(); e.stopPropagation();
        setSelectedSport(sport);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route('admin.sports.destroy', selectedSport.id), {
            onSuccess: () => { setIsDeleteModalOpen(false); setSelectedSport(null); }
        });
    };

    return (
        <AppLayout title="Kategori Olahraga">
            <Head title="Kategori Olahraga" />

            <div className="space-y-4 pb-6">
                <PageHeader
                    title="Kategori Olahraga"
                    description="Kelola data cabang olahraga dan spesifikasi parameter tes fisik."
                    actions={
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative w-44 sm:w-52">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Cari cabor..."
                                    className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-2xs" />
                                {searchTerm && (
                                    <button type="button" onClick={() => setSearchTerm("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-3 h-3" /></button>
                                )}
                            </div>

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
                                            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5"><Filter className="w-3.5 h-3.5 text-orange-500" /> Filter Cabor</h4>
                                            <div className="flex items-center gap-2">
                                                {activeFilterCount > 0 && <button type="button" onClick={resetFilters} className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer">Reset</button>}
                                                <button type="button" onClick={() => setIsFilterOpen(false)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </div>
                                        <CustomSelect label="Urutkan" value={sortBy} options={sortOptions} onChange={setSortBy} />
                                        <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                                            <button type="button" onClick={() => setIsFilterOpen(false)} className="px-3 py-1.5 bg-gradient-to-r from-white via-white to-orange-50/70 hover:to-orange-100/80 text-orange-600 hover:text-orange-700 border border-slate-200 hover:border-slate-300 rounded-md text-xs font-bold transition-all shadow-2xs cursor-pointer">Terapkan</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {isSuperadmin && (
                                <button onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-orange-500 to-orange-600 text-white border border-orange-600 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-sm hover:from-orange-600 hover:to-orange-700 cursor-pointer">
                                    <Plus className="w-3.5 h-3.5" /> Tambah Cabor
                                </button>
                            )}
                        </div>
                    }
                />

                {filteredSports.length === 0 ? (
                    <div className="col-span-full py-16 px-4 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-500 shadow-2xs"><Dumbbell className="w-5 h-5" /></div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-slate-800">No Sports Categories Found</h4>
                            <p className="text-xs text-slate-400 font-medium max-w-sm">Please add new data to get started.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
                        {filteredSports.map((sport) => (
                            <Link key={sport.id} href={route('admin.sports.show', sport.id)}
                                className="group relative bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 rounded-lg border border-slate-200/90 hover:border-orange-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden">
                                <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                                    <div className="flex items-start gap-2.5">
                                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-md border-2 border-white shadow-2xs bg-gradient-to-br from-orange-50 to-orange-100/70 text-orange-600 font-black text-base flex items-center justify-center shrink-0">
                                            <Dumbbell className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0 flex-1 space-y-0.5">
                                            <h3 className="font-bold text-slate-900 text-xs sm:text-[13px] truncate group-hover:text-orange-600 transition-colors leading-tight">{sport.name}</h3>
                                            <p className="text-[11px] text-slate-500 font-medium truncate line-clamp-1">{sport.description || 'Tidak ada deskripsi'}</p>
                                        </div>
                                    </div>

                                    {/* Action buttons for superadmin */}
                                    {isSuperadmin && (
                                        <div className="flex items-center gap-1 pt-1">
                                            <button onClick={(e) => openDuplicateModal(e, sport)} className="p-1 rounded text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all z-10 relative" title="Duplicate">
                                                <Copy className="w-3 h-3" />
                                            </button>
                                            <button onClick={(e) => openEditModal(e, sport)} className="p-1 rounded text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all z-10 relative" title="Edit">
                                                <Pencil className="w-3 h-3" />
                                            </button>
                                            <button onClick={(e) => openDeleteModal(e, sport)} className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all z-10 relative" title="Delete">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-1.5 pt-0.5 border-t border-slate-100/90">
                                        <div className="p-1.5 bg-white/90 rounded-md border border-slate-200/70 shadow-2xs">
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Athletes</span>
                                            <div className="flex items-baseline gap-0.5 mt-0.5">
                                                <span className="text-[11.5px] font-black text-orange-600 leading-tight">{sport.athletes_count}</span>
                                                <span className="text-[8px] font-normal text-slate-400">orang</span>
                                            </div>
                                        </div>
                                        <div className="p-1.5 bg-white/90 rounded-md border border-slate-200/70 shadow-2xs">
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Tests</span>
                                            <div className="flex items-baseline gap-0.5 mt-0.5">
                                                <span className="text-[11.5px] font-black text-teal-700 leading-tight">{sport.test_items_count}</span>
                                                <span className="text-[8px] font-normal text-slate-400">item</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-3.5 py-2 bg-gradient-to-r from-slate-50/90 via-white to-orange-50/30 border-t border-slate-100 flex items-center justify-between text-xs">
                                    <span className="text-[9.5px] font-bold text-slate-500">{sport.athletes_count} Athletes</span>
                                    <span className="inline-flex items-center gap-0.5 text-[10.5px] font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                                        Detail
                                        <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <PageFooter className="!mt-8 !pt-4 !pb-1" />
            </div>

            {/* ─── ADD SPORT MODAL ─── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => { setIsModalOpen(false); reset(); }}></div>
                    <div className="relative bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Tambah Cabor</h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">Daftarkan cabang olahraga baru.</p>
                            </div>
                            <button onClick={() => { setIsModalOpen(false); reset(); }} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={submit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1.5">Nama Cabor</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm py-2.5 placeholder-slate-400 transition-all outline-none" placeholder="Contoh: Basketball, Swimming..." autoFocus />
                                {errors.name && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1.5">Deskripsi (Opsional)</label>
                                <textarea value={data.description} onChange={e => setData('description', e.target.value)} className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm py-2.5 min-h-[100px] placeholder-slate-400 resize-none transition-all outline-none custom-scrollbar" placeholder="Deskripsi singkat tentang cabor ini..." />
                            </div>
                            <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-slate-100">
                                <button type="button" onClick={() => { setIsModalOpen(false); reset(); }} className="px-5 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-lg transition-colors">Batal</button>
                                <button type="submit" disabled={processing} className="px-6 py-2.5 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-70 flex items-center gap-2">
                                    {processing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-4 h-4" />}
                                    {processing ? 'Saving...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ─── DUPLICATE MODAL ─── */}
            {isDuplicateModalOpen && selectedSport && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => { setIsDuplicateModalOpen(false); duplicateForm.reset(); }}></div>
                    <div className="relative bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Duplikat Cabor</h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">Buat salinan dari {selectedSport.name}.</p>
                            </div>
                            <button onClick={() => { setIsDuplicateModalOpen(false); duplicateForm.reset(); }} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleDuplicateSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1.5">Nama Cabor Baru</label>
                                <input type="text" value={duplicateForm.data.name} onChange={e => duplicateForm.setData('name', e.target.value)} className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm py-2.5 placeholder-slate-400 transition-all outline-none" placeholder="Masukkan nama unik..." autoFocus />
                                {duplicateForm.errors.name && <p className="text-rose-500 text-xs mt-1 font-bold">{duplicateForm.errors.name}</p>}
                            </div>
                            <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-slate-100">
                                <button type="button" onClick={() => { setIsDuplicateModalOpen(false); duplicateForm.reset(); }} className="px-5 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-lg transition-colors">Batal</button>
                                <button type="submit" disabled={duplicateForm.processing} className="px-6 py-2.5 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-70 flex items-center gap-2">
                                    {duplicateForm.processing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Copy className="w-4 h-4" />}
                                    {duplicateForm.processing ? 'Duplicating...' : 'Duplikat'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ─── EDIT MODAL ─── */}
            {isEditModalOpen && selectedSport && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => { setIsEditModalOpen(false); editForm.reset(); }}></div>
                    <div className="relative bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Edit Cabor</h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">Perbarui detail cabang olahraga.</p>
                            </div>
                            <button onClick={() => { setIsEditModalOpen(false); editForm.reset(); }} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1.5">Nama Cabor</label>
                                <input type="text" value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm py-2.5 placeholder-slate-400 transition-all outline-none" autoFocus />
                                {editForm.errors.name && <p className="text-rose-500 text-xs mt-1 font-bold">{editForm.errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1.5">Deskripsi (Opsional)</label>
                                <textarea value={editForm.data.description} onChange={e => editForm.setData('description', e.target.value)} className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm py-2.5 min-h-[100px] placeholder-slate-400 resize-none transition-all outline-none custom-scrollbar" />
                            </div>
                            <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-slate-100">
                                <button type="button" onClick={() => { setIsEditModalOpen(false); editForm.reset(); }} className="px-5 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-lg transition-colors">Batal</button>
                                <button type="submit" disabled={editForm.processing} className="px-6 py-2.5 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-70 flex items-center gap-2">
                                    {editForm.processing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-4 h-4" />}
                                    {editForm.processing ? 'Saving...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ─── DELETE MODAL ─── */}
            {isDeleteModalOpen && selectedSport && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" onClick={() => setIsDeleteModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-rose-50 shadow-sm">
                                <AlertTriangle className="w-8 h-8" strokeWidth={2.5} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Peringatan Keras!</h3>
                            <p className="text-slate-600 text-sm mb-4">
                                Anda akan menghapus cabor <span className="font-bold text-rose-500">"{selectedSport.name}"</span>.
                            </p>
                            <div className="bg-rose-50 p-4 rounded-xl text-left border border-rose-100 mb-6">
                                <p className="text-xs font-bold text-rose-700 mb-2">Dampak Tindakan Ini:</p>
                                <ul className="text-xs text-rose-600 space-y-1.5 ml-4 list-disc font-medium">
                                    <li>Seluruh <span className="font-bold">DATA LATIHAN / SKOR</span> terkait cabor ini akan dihapus permanen.</li>
                                    <li>Seluruh parameter item latihan pada cabor ini akan hilang.</li>
                                    {selectedSport.athletes_count > 0 && (
                                        <li>Sebanyak <span className="font-bold">{selectedSport.athletes_count} atlet</span> akan dikeluarkan dari cabor (menjadi 'Tanpa Cabor'), tapi akun mereka tidak dihapus.</li>
                                    )}
                                </ul>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 text-slate-600 font-bold text-sm bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Batalkan</button>
                                <button onClick={confirmDelete} className="flex-1 py-3 bg-rose-500 text-white font-bold text-sm rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30 hover:shadow-rose-500/40 active:scale-95">Ya, Hapus Permanen</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}