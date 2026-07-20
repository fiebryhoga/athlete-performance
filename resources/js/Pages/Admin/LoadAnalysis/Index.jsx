import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, ChevronRight, Search, Dumbbell } from 'lucide-react';
import { useState } from 'react';
import PageHeader from '@/Components/Layout/PageHeader';

export default function Index({ athletes }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAthletes = athletes?.filter(athlete =>
        athlete.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <AppLayout title="Analisis Beban Latihan">
            <Head title="Analisis Beban Latihan" />

            <div className="pb-12 space-y-6">
                <PageHeader 
                    title="Analisis Beban Latihan"
                    subtitle="Pantau volume load, progressive overload, dan distribusi beban latihan kekuatan per atlet."
                    badge="Strength Analysis"
                    icon={BarChart3}
                    searchPlaceholder="Cari nama atlet..."
                    searchValue={searchQuery}
                    onSearchChange={(e) => setSearchQuery(typeof e === 'string' ? e : e.target.value)}
                />

                {filteredAthletes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 animate-in fade-in duration-300">
                        {filteredAthletes.map((athlete) => (
                            <div key={athlete.id} className="group bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-orange-200 hover:shadow-lg transition-all hover:-translate-y-1 relative flex flex-col justify-between overflow-hidden">
                                
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-50 to-orange-100/0 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

                                <div className="relative flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 text-orange-500 flex items-center justify-center font-bold text-lg md:text-xl shrink-0 border border-orange-100 shadow-inner group-hover:border-orange-200 transition-colors">
                                        {athlete.profile_photo_url ? (
                                            <img src={athlete.profile_photo_url} alt={athlete.name} className="w-full h-full object-cover" />
                                        ) : (
                                            athlete.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    
                                    <div className="min-w-0 pt-0.5">
                                        <h3 className="font-bold text-slate-800 text-base md:text-lg leading-tight group-hover:text-orange-500 transition-colors truncate">{athlete.name}</h3>
                                        <div className="mt-1.5 flex items-center">
                                            <span className="text-[10px] md:text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 truncate max-w-[150px]">
                                                {athlete.sport?.name || 'Tanpa Cabor'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                                    <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                                        <Dumbbell className="w-4 h-4 text-orange-500" />
                                        <span className="text-slate-800 text-sm md:text-base">{athlete.load_session_count || 0}</span> Sesi
                                    </div>
                                    <Link 
                                        href={route('admin.load-analysis.show', athlete.id)}
                                        className="flex items-center gap-1 text-xs font-bold text-white bg-orange-500 px-4 py-2 rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:-translate-y-0.5 transition-all"
                                    >
                                        Analisis <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 text-center shadow-sm">
                        <div className="p-4 bg-white border border-slate-200 rounded-full mb-3 shadow-sm">
                            <Search className="w-8 h-8 text-orange-500" />
                        </div>
                        <h3 className="text-slate-800 font-bold text-lg">Atlet tidak ditemukan</h3>
                        <p className="text-slate-500 text-sm mt-1 font-medium px-4">Coba gunakan kata kunci pencarian yang lain.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
