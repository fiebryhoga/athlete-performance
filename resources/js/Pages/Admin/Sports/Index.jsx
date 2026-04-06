import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Plus, Users, Dumbbell, ChevronRight, Activity, X, Save, Trash2, Trophy } from 'lucide-react';
import { useState } from 'react';

export default function Index({ sports }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        description: ''
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.sports.store'), {
            onSuccess: () => {
                reset();
                setIsModalOpen(false);
            }
        });
    };

    // --- HANDLE DELETE UPDATE ---
    const handleDelete = (e, sportId, sportName, athleteCount) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        
        let message = `⚠️ PERINGATAN KERAS \n\nAnda akan menghapus cabor "${sportName}".`;
        
        message += `\n\nDAMPAK TINDAKAN INI:`;
        message += `\n1. Seluruh DATA LATIHAN/SKOR (History) terkait cabor ini akan DIHAPUS PERMANEN.`;
        message += `\n2. Item tes/parameter latihan akan hilang.`;
        
        if (athleteCount > 0) {
            message += `\n3. Sebanyak ${athleteCount} atlet akan dikeluarkan dari cabor (menjadi status 'Tanpa Cabor'), tapi akun mereka TIDAK dihapus.`;
        }

        message += `\n\nApakah Anda yakin ingin melanjutkan?`;

        if (confirm(message)) {
            router.delete(route('admin.sports.destroy', sportId));
        }
    };

    return (
        <AdminLayout title="Sports Management">
            <Head title="Sports Management" />

            {/* HEADER UTAMA YANG SELARAS DENGAN TEMA BARU */}
            <div className="bg-white p-6 md:p-8 rounded-lg border border-slate-200 shadow-sm mb-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/* Efek Glow Oranye */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-70 pointer-events-none"></div>
                
                <div className="relative z-10">
                    <span className="text-[10px] font-bold text-[#ff4d00] bg-orange-50 px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">Management</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        Sports Categories
                    </h2>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Kelola data cabang olahraga dan spesifikasi parameter tes fisik.</p>
                </div>

                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="relative z-10 flex items-center gap-2 bg-[#ff4d00] text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-[#e64500] transition-all shadow-lg shadow-[#ff4d00]/20 active:scale-95"
                >
                    <Plus className="w-4 h-4" /> Add Sport
                </button>
            </div>

            {/* KONTEN KARTU CABOR */}
            {sports.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                    {sports.map((sport) => (
                        <Link 
                            key={sport.id} 
                            href={route('admin.sports.show', sport.id)}
                            className="group bg-white p-6 rounded-lg border border-slate-200 hover:border-[#ff4d00] hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-lg border border-slate-100 overflow-hidden bg-orange-50 text-[#ff4d00] flex justify-center items-center group-hover:bg-[#ff4d00] group-hover:text-white transition-colors duration-300 shadow-sm">
                                    <Dumbbell className="w-6 h-6" />
                                </div>
                                
                                {/* ACTION BUTTONS */}
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={(e) => handleDelete(e, sport.id, sport.name, sport.athletes_count)}
                                        className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all z-10 relative"
                                        title="Delete Sport"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    
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

            {/* MODAL TAMBAH CABOR */}
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
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Sport Name</label>
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
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Description (Optional)</label>
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
        </AdminLayout>
    );
}