import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Plus, Users, Dumbbell, ChevronRight, Activity, X, Save, Trash2 } from 'lucide-react';
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
    // Terima parameter jumlah atlet (count) untuk warning yang lebih baik
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
        <AdminLayout title="sports management">
            <Head title="sports management" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Sports Categories</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage sports data and physical training specifications.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-[#00488b] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#003666] transition-all shadow-lg shadow-blue-900/20 active:scale-95 lowercase"
                >
                    <Plus className="w-4 h-4" />
                    add sport
                </button>
            </div>

            {sports.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sports.map((sport) => (
                        <Link 
                            key={sport.id} 
                            href={route('admin.sports.show', sport.id)}
                            className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#00488b] hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 text-[#00488b] rounded-xl group-hover:bg-[#00488b] group-hover:text-white transition-colors duration-300">
                                    <Dumbbell className="w-6 h-6" />
                                </div>
                                
                                {/* ACTION BUTTONS */}
                                <div className="flex items-center gap-2">
                                    <button 
                                        // Kirim jumlah atlet ke fungsi delete
                                        onClick={(e) => handleDelete(e, sport.id, sport.name, sport.athletes_count)}
                                        className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all z-10 relative"
                                        title="delete sport"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    
                                    <div className="p-1.5 rounded-full bg-slate-50 group-hover:bg-blue-50 transition-colors">
                                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00488b]" />
                                    </div>
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-[#00488b] transition-colors  ">{sport.name}</h3>
                            <p className="text-xs text-slate-500 mb-6 line-clamp-2 flex-grow leading-relaxed  ">
                                {sport.description || 'no additional description for this sport.'}
                            </p>

                            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 pt-4 border-t border-slate-100 mt-auto">
                                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md  ">
                                    <Users className="w-3.5 h-3.5" />
                                    <span>{sport.athletes_count} athletes</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md  ">
                                    <Activity className="w-3.5 h-3.5" />
                                    <span>{sport.test_items_count} test types</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
                    <div className="p-4 bg-slate-50 rounded-full mb-3">
                        <Dumbbell className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-slate-800 font-bold  ">no sports categories found</h3>
                    <p className="text-slate-500 text-xs mt-1  ">please add new data to get started.</p>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => { setIsModalOpen(false); reset(); }}></div>
                    <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800  ">add new sport</h3>
                            <button onClick={() => { setIsModalOpen(false); reset(); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">sport name</label>
                                <input 
                                    type="text" 
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full rounded-xl border-slate-200 focus:ring-[#00488b] focus:border-[#00488b] text-sm py-2.5 placeholder-slate-400 lowercase"
                                    placeholder="e.g. football"
                                    autoFocus
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1  ">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">description (optional)</label>
                                <textarea 
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full rounded-xl border-slate-200 focus:ring-[#00488b] focus:border-[#00488b] text-sm py-2.5 min-h-[100px] placeholder-slate-400 resize-none"
                                    placeholder="brief description about this sport..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => { setIsModalOpen(false); reset(); }} 
                                    className="px-5 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-xl transition-colors lowercase"
                                >
                                    cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="px-6 py-2.5 bg-[#00488b] text-white font-bold text-sm rounded-xl hover:bg-[#003666] transition-colors shadow-lg shadow-blue-900/10 disabled:opacity-50 flex items-center gap-2 lowercase"
                                >
                                    {processing ? (
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    {processing ? 'saving...' : 'save data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}