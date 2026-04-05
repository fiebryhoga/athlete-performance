import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Activity, Search, ChevronRight, CalendarDays } from 'lucide-react';
import { useState } from 'react';

export default function Index({ athletes }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAthletes = athletes?.filter(athlete =>
        athlete.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <AdminLayout title="Daily Monitoring">
            <Head title="Daily Monitoring" />

            {/* --- HEADER UTAMA --- */}
            <div className="bg-white p-6 md:p-8 rounded-lg border border-slate-200 shadow-sm mb-8 relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>
                
                <div className="relative z-10 w-full lg:w-auto">
                    <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">Wellness & Readiness</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        Daily Monitoring
                    </h2>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Pilih atlet untuk melihat atau mengisi metrik keseharian mereka.</p>
                </div>

                <div className="relative z-10 w-full lg:w-auto flex items-center gap-3">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Cari nama atlet..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00488b]/20 focus:border-[#00488b] transition-all outline-none shadow-sm" 
                        />
                    </div>
                </div>
            </div>

            {/* --- KONTEN GRID --- */}
            {filteredAthletes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-300">
                    {filteredAthletes.map((athlete) => (
                        <Link 
                            key={athlete.id} 
                            href={route('admin.daily-metrics.show', athlete.id)} 
                            className="group bg-white p-5 rounded-lg shadow-sm border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4 min-w-0 pr-4">
                                {/* AREA FOTO PROFIL */}
                                <div className="w-14 h-14 rounded-full overflow-hidden bg-blue-50 text-[#00488b] flex items-center justify-center font-bold text-xl shrink-0 border-2 border-slate-100 shadow-sm group-hover:border-blue-200 transition-colors">
                                    {athlete.profile_photo_url ? (
                                        <img src={athlete.profile_photo_url} alt={athlete.name} className="w-full h-full object-cover" />
                                    ) : (
                                        athlete.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                
                                <div className="min-w-0">
                                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-[#00488b] transition-colors truncate">{athlete.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 truncate max-w-[100px]">
                                            {athlete.sport?.name || 'Tanpa Cabor'}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
                                            <CalendarDays className="w-3 h-3" /> {athlete.total_records || 0} Record
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-2 rounded-lg text-slate-300 group-hover:text-[#00488b] group-hover:bg-blue-50 transition-all group-hover:translate-x-1 shrink-0">
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                /* --- EMPTY STATE --- */
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-dashed border-slate-300 text-center shadow-sm">
                    <div className="p-4 bg-slate-50 rounded-full mb-3">
                        <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-slate-800 font-bold text-lg">Atlet tidak ditemukan</h3>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Coba gunakan kata kunci pencarian yang lain.</p>
                </div>
            )}
        </AdminLayout>
    );
}