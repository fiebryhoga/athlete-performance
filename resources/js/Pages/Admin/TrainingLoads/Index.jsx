import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Activity, Search, ChevronRight, HeartPulse } from 'lucide-react';
import { useState } from 'react';

export default function Index({ athletes }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAthletes = athletes?.filter(athlete =>
        athlete.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <AdminLayout title="Wellness & Training Load">
            <Head title="Wellness & Training Load" />

            {/* --- HEADER UTAMA --- */}
            <div className="bg-white p-6 md:p-8 rounded-lg border border-slate-200 shadow-sm mb-8 relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none"></div>
                
                <div className="relative z-10 w-full lg:w-auto">
                    <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">Recovery & Load</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        Wellness & Load
                    </h2>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Pantau tingkat kebugaran, RPE, dan akumulasi beban latihan atlet.</p>
                </div>

                <div className="relative z-10 w-full lg:w-auto flex items-center gap-3">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Cari nama atlet..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none shadow-sm" 
                        />
                    </div>
                </div>
            </div>

            {/* --- KONTEN GRID KARTU ATLET --- */}
            {filteredAthletes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-300">
                    {filteredAthletes.map((athlete) => (
                        <div key={athlete.id} className="group bg-white p-5 rounded-lg shadow-sm border border-slate-200 hover:border-rose-200 hover:shadow-lg transition-all hover:-translate-y-1 relative flex flex-col justify-between">
                            
                            <div className="flex items-start gap-4 mb-4">
                                {/* FOTO PROFIL ATLET */}
                                <div className="w-14 h-14 rounded-full overflow-hidden bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xl shrink-0 border-2 border-slate-100 shadow-sm group-hover:border-rose-200 transition-colors">
                                    {athlete.profile_photo_url ? (
                                        <img src={athlete.profile_photo_url} alt={athlete.name} className="w-full h-full object-cover" />
                                    ) : (
                                        athlete.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                
                                <div className="min-w-0 pt-1">
                                    <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-rose-500 transition-colors truncate">{athlete.name}</h3>
                                    <div className="mt-1.5 flex items-center">
                                        <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 truncate max-w-[120px]">
                                            {athlete.sport?.name || 'Tanpa Cabor'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                                <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                                    <Activity className="w-4 h-4 text-rose-400" />
                                    <span className="text-slate-800 text-base">{athlete.total_records || 0}</span> Data Load
                                </div>
                                <Link 
                                    href={route('admin.training-loads.show', athlete.id)}
                                    className="flex items-center gap-1 text-xs font-bold text-white bg-rose-500 px-4 py-2 rounded-lg shadow-sm hover:bg-rose-600 hover:-translate-y-0.5 transition-all"
                                >
                                    Detail <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* --- EMPTY STATE --- */
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-dashed border-slate-300 text-center shadow-sm">
                    <div className="p-4 bg-rose-50 rounded-full mb-3">
                        <Search className="w-8 h-8 text-rose-300" />
                    </div>
                    <h3 className="text-slate-800 font-bold text-lg">Atlet tidak ditemukan</h3>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Coba gunakan kata kunci pencarian yang lain.</p>
                </div>
            )}
        </AdminLayout>
    );
}