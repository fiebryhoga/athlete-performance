import AppLayout from '@/Layouts/AppLayout';
import { Head, router, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Search, Users, ChevronRight, Activity, Target, Flame, Info, Ruler, Weight, Zap, Scale, TrendingUp } from 'lucide-react';
import PageHeader from '@/Components/Layout/PageHeader';

export default function Index({ athletes, filters }) {
    const { auth } = usePage().props;
    const isSuperadmin = auth?.user?.role === 'superadmin';
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(
                route('admin.athletes.index'),
                { search: searchTerm },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleCardClick = (id) => {
        router.get(route('admin.athletes.show', id));
    };

    return (
        <AppLayout title="Data Klien">
            <Head title="Data Klien" />

            <PageHeader 
                title="Data Klien"
                subtitle="Lihat profil dan rekam jejak atlet."
                badge="Profiling"
                icon={Users}
                searchPlaceholder="Cari nama klien..."
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
            />

            {athletes.data.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 animate-in fade-in zoom-in-95 duration-300">
                    {athletes.data.map((athlete) => (
                        <div 
                            key={athlete.id} 
                            onClick={() => handleCardClick(athlete.id)}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative flex flex-col"
                        >
                            {/* Premium Card Header */}
                            <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-orange-500/10 to-transparent"></div>
                            
                            <div className="absolute top-4 right-4 p-2 bg-white/60 backdrop-blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity border border-slate-100 shadow-sm">
                                <ChevronRight className="w-4 h-4 text-orange-500" />
                            </div>

                            <div className="p-6 flex flex-col items-center justify-center relative z-10 border-b border-slate-50">
                                <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl shadow-orange-500/10 mb-4 bg-orange-500 flex items-center justify-center overflow-hidden shrink-0">
                                    {athlete.profile_photo_url ? (
                                        <img src={athlete.profile_photo_url} alt={athlete.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-bold text-white">{athlete.name.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg group-hover:text-orange-500 transition-colors text-center line-clamp-1">{athlete.name}</h3>
                                <p className="text-xs font-medium text-slate-400 mb-4">{athlete.username}</p>
                                
                                {athlete.sport ? (
                                    <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full border border-orange-100 flex items-center gap-1.5">
                                        <Target className="w-3 h-3" /> {athlete.sport.name}
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                                        Tanpa Cabor
                                    </span>
                                )}
                            </div>
                            
                            {/* Card Body - Physical Metrics */}
                            <div className="p-5 bg-slate-50/50 flex-1 flex flex-col justify-between gap-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col justify-center shadow-sm">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="text-[9px] font-bold text-slate-400">PHV Status</span>
                                        </div>
                                        <div className="text-slate-700 font-bold text-xs line-clamp-1">
                                            {athlete.latest_phv?.phv_status || '-'}
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col justify-center shadow-sm">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <Scale className="w-3.5 h-3.5 text-blue-500" />
                                            <span className="text-[9px] font-bold text-slate-400">Muscle Mass</span>
                                        </div>
                                        <div className="text-slate-700 font-bold text-xs line-clamp-1">
                                            {athlete.latest_composition?.muscle_mass ? `${athlete.latest_composition.muscle_mass} kg` : '-'}
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col justify-center shadow-sm">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <Zap className="w-3.5 h-3.5 text-orange-500" />
                                            <span className="text-[9px] font-bold text-slate-400">Wellness</span>
                                        </div>
                                        <div className="text-slate-700 font-bold text-xs line-clamp-1">
                                            {athlete.latest_wellness?.daily_wellness_score ? `${athlete.latest_wellness.daily_wellness_score} / 25` : '-'}
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col justify-center shadow-sm">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <Activity className="w-3.5 h-3.5 text-rose-500" />
                                            <span className="text-[9px] font-bold text-slate-400">Daily Load</span>
                                        </div>
                                        <div className="text-slate-700 font-bold text-xs line-clamp-1">
                                            {athlete.latest_wellness?.daily_load || '-'}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-100">
                                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                                        <Info className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{athlete.age ? `${athlete.age} Thn` : 'Umur -'}</span>
                                        <span className="mx-1 text-slate-300">•</span>
                                        <span className="flex items-center gap-1"><Ruler className="w-3 h-3"/>{athlete.height || '-'}</span>
                                        <span className="mx-1 text-slate-300">•</span>
                                        <span className="flex items-center gap-1"><Weight className="w-3 h-3"/>{athlete.weight || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-5 border-4 border-white shadow-lg">
                        <Users className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">Belum ada Klien</h3>
                    <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                        Data klien asuhan Anda akan muncul di sini. Jika kosong, pastikan akun telah diassign kepada Anda oleh Superadmin.
                    </p>
                </div>
            )}

            {/* Pagination */}
            {athletes.links && athletes.links.length > 3 && (
                <div className="mt-8 flex justify-center pb-8">
                    <div className="inline-flex gap-1 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
                        {athletes.links.map((link, index) => (
                            <button
                                key={index}
                                onClick={() => link.url && router.get(link.url)}
                                disabled={!link.url}
                                className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${
                                    link.active 
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' 
                                    : link.url 
                                        ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900' 
                                        : 'text-slate-300 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}