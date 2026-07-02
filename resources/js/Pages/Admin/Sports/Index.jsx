import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { Plus, Users, Dumbbell, ChevronRight, Activity, X, Save, Trash2, Trophy, Search, Copy, Pencil, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import PageHeader from '@/Components/Layout/PageHeader';

export default function Index({ sports }) {
    const { auth } = usePage().props;
    const isSuperadmin = auth?.user?.role === 'superadmin';

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        description: ''
    });

    const duplicateForm = useForm({
        name: ''
    });

    const editForm = useForm({
        name: '',
        description: ''
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const [selectedSport, setSelectedSport] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSports = sports.filter(sport => 
        sport.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.sports.store'), {
            onSuccess: () => {
                reset();
                setIsModalOpen(false);
            }
        });
    };

    const handleDuplicateSubmit = (e) => {
        e.preventDefault();
        duplicateForm.post(route('admin.sports.duplicate', selectedSport.id), {
            onSuccess: () => {
                duplicateForm.reset();
                setIsDuplicateModalOpen(false);
                setSelectedSport(null);
            }
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.put(route('admin.sports.update', selectedSport.id), {
            onSuccess: () => {
                editForm.reset();
                setIsEditModalOpen(false);
                setSelectedSport(null);
            }
        });
    };

    const openDuplicateModal = (e, sport) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedSport(sport);
        duplicateForm.setData('name', sport.name + ' (Copy)');
        duplicateForm.clearErrors();
        setIsDuplicateModalOpen(true);
    };

    const openEditModal = (e, sport) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedSport(sport);
        editForm.setData({
            name: sport.name,
            description: sport.description || ''
        });
        editForm.clearErrors();
        setIsEditModalOpen(true);
    };
    
    const openDeleteModal = (e, sport) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        setSelectedSport(sport);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route('admin.sports.destroy', selectedSport.id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedSport(null);
            }
        });
    };

    return (
        <AppLayout title="Sports Management">
            <Head title="Sports Management" />

            <PageHeader 
                title="Sports Categories"
                subtitle="Kelola data cabang olahraga dan spesifikasi parameter tes fisik."
                badge="Management"
                icon={Dumbbell}
                searchPlaceholder="Search sports..."
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                actions={
                    isSuperadmin && (
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-[#ff4d00] text-white px-5 py-2.5 md:px-6 md:py-3 rounded-lg text-sm font-bold hover:bg-[#e64500] transition-all shadow-lg shadow-[#ff4d00]/20 active:scale-95 w-full sm:w-auto justify-center"
                        >
                            <Plus className="w-4 h-4 md:w-5 md:h-5" /> Add Sport
                        </button>
                    )
                }
            />

            
            {filteredSports.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                    {filteredSports.map((sport) => (
                        <Link 
                            key={sport.id} 
                            href={route('admin.sports.show', sport.id)}
                            className="group bg-white p-6 rounded-lg border border-slate-200 hover:border-[#ff4d00] hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-lg border border-slate-100 overflow-hidden bg-orange-50 text-[#ff4d00] flex justify-center items-center group-hover:bg-[#ff4d00] group-hover:text-white transition-colors duration-300 shadow-sm">
                                    <Dumbbell className="w-6 h-6" />
                                </div>
                                
                                
                                <div className="flex items-center gap-2">
                                    {isSuperadmin && (
                                        <>
                                            <button 
                                                onClick={(e) => openDuplicateModal(e, sport)}
                                                className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all z-10 relative"
                                                title="Duplicate Sport"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={(e) => openEditModal(e, sport)}
                                                className="p-2 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all z-10 relative"
                                                title="Edit Sport"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={(e) => openDeleteModal(e, sport)}
                                                className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all z-10 relative"
                                                title="Delete Sport"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                    
                                    <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-orange-50 transition-colors">
                                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#ff4d00]" />
                                    </div>
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-[#ff4d00] transition-colors">{sport.name}</h3>
                            <p className="text-xs text-slate-500 mb-6 line-clamp-2 flex-grow leading-relaxed font-medium">
                                {sport.description || 'No additional description provided for this sport.'}
                            </p>

                            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-4 border-t border-slate-100 mt-auto">
                                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                                    <Users className="w-3.5 h-3.5 text-[#ff4d00]" />
                                    <span>{sport.athletes_count} Athletes</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>{sport.test_items_count} Tests</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-dashed border-slate-300 text-center shadow-sm">
                    <div className="p-4 bg-orange-50 rounded-full mb-3">
                        <Trophy className="w-8 h-8 text-orange-300" />
                    </div>
                    <h3 className="text-slate-800 font-bold text-lg">No Sports Categories Found</h3>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Please add new data to get started.</p>
                </div>
            )}

            
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => { setIsModalOpen(false); reset(); }}></div>
                    <div className="relative bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Add New Sport</h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">Register a new sports category.</p>
                            </div>
                            <button onClick={() => { setIsModalOpen(false); reset(); }} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1.5">Sport Name</label>
                                <input 
                                    type="text" 
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] text-sm py-2.5 placeholder-slate-400 transition-all outline-none"
                                    placeholder="e.g. Basketball, Swimming..."
                                    autoFocus
                                />
                                {errors.name && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1.5">Description (Optional)</label>
                                <textarea 
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] text-sm py-2.5 min-h-[100px] placeholder-slate-400 resize-none transition-all outline-none custom-scrollbar"
                                    placeholder="Brief description about this sport..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-slate-100">
                                <button 
                                    type="button" 
                                    onClick={() => { setIsModalOpen(false); reset(); }} 
                                    className="px-5 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="px-6 py-2.5 bg-[#ff4d00] text-white font-bold text-sm rounded-lg hover:bg-[#e64500] transition-colors shadow-lg shadow-[#ff4d00]/20 disabled:opacity-70 flex items-center gap-2"
                                >
                                    {processing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-4 h-4" />}
                                    {processing ? 'Saving...' : 'Save Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Duplicate Modal */}
            {isDuplicateModalOpen && selectedSport && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => { setIsDuplicateModalOpen(false); duplicateForm.reset(); }}></div>
                    <div className="relative bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Duplicate Sport</h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">Create a copy of {selectedSport.name}.</p>
                            </div>
                            <button onClick={() => { setIsDuplicateModalOpen(false); duplicateForm.reset(); }} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleDuplicateSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1.5">New Sport Name</label>
                                <input 
                                    type="text" 
                                    value={duplicateForm.data.name}
                                    onChange={e => duplicateForm.setData('name', e.target.value)}
                                    className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] text-sm py-2.5 placeholder-slate-400 transition-all outline-none"
                                    placeholder="Enter unique name..."
                                    autoFocus
                                />
                                {duplicateForm.errors.name && <p className="text-rose-500 text-xs mt-1 font-bold">{duplicateForm.errors.name}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-slate-100">
                                <button 
                                    type="button" 
                                    onClick={() => { setIsDuplicateModalOpen(false); duplicateForm.reset(); }} 
                                    className="px-5 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={duplicateForm.processing} 
                                    className="px-6 py-2.5 bg-[#ff4d00] text-white font-bold text-sm rounded-lg hover:bg-[#e64500] transition-colors shadow-lg shadow-[#ff4d00]/20 disabled:opacity-70 flex items-center gap-2"
                                >
                                    {duplicateForm.processing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Copy className="w-4 h-4" />}
                                    {duplicateForm.processing ? 'Duplicating...' : 'Duplicate Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && selectedSport && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => { setIsEditModalOpen(false); editForm.reset(); }}></div>
                    <div className="relative bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Edit Sport</h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">Update sport details.</p>
                            </div>
                            <button onClick={() => { setIsEditModalOpen(false); editForm.reset(); }} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1.5">Sport Name</label>
                                <input 
                                    type="text" 
                                    value={editForm.data.name}
                                    onChange={e => editForm.setData('name', e.target.value)}
                                    className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] text-sm py-2.5 placeholder-slate-400 transition-all outline-none"
                                    placeholder="Enter sport name..."
                                    autoFocus
                                />
                                {editForm.errors.name && <p className="text-rose-500 text-xs mt-1 font-bold">{editForm.errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1.5">Description (Optional)</label>
                                <textarea 
                                    value={editForm.data.description}
                                    onChange={e => editForm.setData('description', e.target.value)}
                                    className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] text-sm py-2.5 min-h-[100px] placeholder-slate-400 resize-none transition-all outline-none custom-scrollbar"
                                    placeholder="Brief description about this sport..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-slate-100">
                                <button 
                                    type="button" 
                                    onClick={() => { setIsEditModalOpen(false); editForm.reset(); }} 
                                    className="px-5 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={editForm.processing} 
                                    className="px-6 py-2.5 bg-[#ff4d00] text-white font-bold text-sm rounded-lg hover:bg-[#e64500] transition-colors shadow-lg shadow-[#ff4d00]/20 disabled:opacity-70 flex items-center gap-2"
                                >
                                    {editForm.processing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-4 h-4" />}
                                    {editForm.processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Delete Modal */}
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
                                <button 
                                    onClick={() => setIsDeleteModalOpen(false)} 
                                    className="flex-1 py-3 text-slate-600 font-bold text-sm bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                >
                                    Batalkan
                                </button>
                                <button 
                                    onClick={confirmDelete}
                                    className="flex-1 py-3 bg-rose-500 text-white font-bold text-sm rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30 hover:shadow-rose-500/40 active:scale-95"
                                >
                                    Ya, Hapus Permanen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}