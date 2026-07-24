import AppLayout from '@/Layouts/AppLayout';
import { Head, router, Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Search, Users, ChevronRight, Activity, Target, Flame, Info, Ruler, Weight, Zap, Scale, TrendingUp } from 'lucide-react';
import PageHeader from '@/Components/Layout/PageHeader';

export default function Index({ athletes, filters }) {
    const { auth } = usePage().props;
    const isSuperadmin = auth?.user?.role === 'superadmin';
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const isMounted = useRef(false);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

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
                subtitle="Lihat profil dan rekam jejak klien."
                badge="Profiling"
                icon={Users}
                searchPlaceholder="Cari nama klien..."
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
            />

            {athletes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 animate-in fade-in zoom-in-95 duration-300">
                    {athletes.map((athlete) => (
                        <div 
                            key={athlete.id} 
                            onClick={() => handleCardClick(athlete.id)}
                            className="relative bg-white rounded-xl border border-slate-200 p-5 hover:border-orange-400 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col gap-4 overflow-hidden"
                        >
                            {/* Decorative Hover Element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                            <div className="relative flex items-center gap-4 z-10">
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-orange-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                                    {athlete.profile_photo_url ? (
                                        <img src={athlete.profile_photo_url} alt={athlete.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xl font-bold text-orange-500">{athlete.name.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-800 text-base md:text-lg truncate group-hover:text-orange-500 transition-colors">
                                        {athlete.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 truncate mb-1.5">@{athlete.username}</p>
                                    
                                    {athlete.sport ? (
                                        <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 inline-block truncate max-w-full">
                                            {athlete.sport.name}
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 inline-block">
                                            Tanpa Cabor
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Packages & Groups Info */}
                            <div className="flex flex-col gap-1.5 mt-1">
                                {athlete.package && (
                                    <div className="flex items-center justify-between bg-orange-50/50 border border-orange-100 rounded-lg p-2">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
                                            <span className="text-[10px] font-bold text-slate-700 truncate max-w-[120px]">{athlete.package.name} (Private)</span>
                                        </div>
                                        {athlete.training_exp_date && (
                                            <span className="text-[9px] text-slate-500 font-medium shrink-0">
                                                Exp: {new Date(athlete.training_exp_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        )}
                                    </div>
                                )}
                                
                                {athlete.groups && athlete.groups.length > 0 && athlete.groups.map(group => (
                                    <div key={group.id} className="flex items-center justify-between bg-blue-50/50 border border-blue-100 rounded-lg p-2">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                                            <span className="text-[10px] font-bold text-slate-700 truncate max-w-[150px]">
                                                {group.name} {group.package ? `(${group.package.name})` : '(Grup)'}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {!athlete.package && (!athlete.groups || athlete.groups.length === 0) && (
                                    <div className="flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg p-2">
                                        <span className="text-[10px] text-slate-400 font-medium italic">Belum ada paket / grup</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 mt-auto">
                                <div className="text-center">
                                    <div className="text-[10px] text-slate-400 font-medium mb-0.5">Umur</div>
                                    <div className="font-semibold text-slate-700 text-xs">{athlete.age ? `${athlete.age} Thn` : '-'}</div>
                                </div>
                                <div className="text-center border-x border-slate-100">
                                    <div className="text-[10px] text-slate-400 font-medium mb-0.5">Tinggi</div>
                                    <div className="font-semibold text-slate-700 text-xs">{athlete.height ? `${athlete.height} cm` : '-'}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] text-slate-400 font-medium mb-0.5">Berat</div>
                                    <div className="font-semibold text-slate-700 text-xs">{athlete.weight ? `${athlete.weight} kg` : '-'}</div>
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
        </AppLayout>
    );
}