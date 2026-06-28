import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { Activity, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import PageHeader from '@/Components/Layout/PageHeader';

export default function Index({ athletes }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAthletes = athletes?.filter(athlete =>
        athlete.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <AppLayout title="Wellness & Training Load">
            <Head title="Wellness & Training Load" />

            <div className="pb-12 space-y-6">
                <PageHeader 
                    title="Wellness & Load"
                    subtitle="Pantau tingkat kebugaran, RPE, dan akumulasi beban latihan atlet."
                    badge="Recovery & Load"
                    icon={Activity}
                    searchPlaceholder="Cari nama atlet..."
                    searchValue={searchQuery}
                    onSearchChange={(e) => setSearchQuery(e.target.value)}
                />

            
            {filteredAthletes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 animate-in fade-in duration-300">
                    {filteredAthletes.map((athlete) => (
                        <div key={athlete.id} className="group bg-white p-4 md:p-5 rounded-lg shadow-sm border border-slate-200 hover:border-orange-200 hover:shadow-lg transition-all hover:-translate-y-1 relative flex flex-col justify-between">
                            
                            <div className="flex items-start gap-3 md:gap-4 mb-4">
                                
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-orange-50 text-[#ff4d00] flex items-center justify-center font-bold text-lg md:text-xl shrink-0 border-2 border-slate-100 shadow-sm group-hover:border-orange-200 transition-colors">
                                    {athlete.profile_photo_url ? (
                                        <img src={athlete.profile_photo_url} alt={athlete.name} className="w-full h-full object-cover" />
                                    ) : (
                                        athlete.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                
                                <div className="min-w-0 pt-0.5 md:pt-1">
                                    <h3 className="font-bold text-slate-800 text-base md:text-lg leading-tight group-hover:text-[#ff4d00] transition-colors truncate">{athlete.name}</h3>
                                    <div className="mt-1 md:mt-1.5 flex items-center">
                                        <span className="text-[10px] md:text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 truncate max-w-[120px]">
                                            {athlete.sport?.name || 'Tanpa Cabor'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                                <div className="text-[10px] md:text-xs font-bold text-slate-500 flex items-center gap-1.5">
                                    <Activity className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#ff4d00]" />
                                    <span className="text-slate-800 text-sm md:text-base">{athlete.total_records || 0}</span> Data Load
                                </div>
                                <Link 
                                    href={route('admin.training-loads.show', athlete.id)}
                                    className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-white bg-[#ff4d00] px-3 md:px-4 py-1.5 md:py-2 rounded-lg shadow-lg shadow-[#ff4d00]/20 hover:bg-[#e64500] hover:-translate-y-0.5 transition-all"
                                >
                                    Detail <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 md:py-20 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 text-center shadow-sm mx-2 md:mx-0">
                    <div className="p-4 bg-white border border-slate-200 rounded-full mb-3 shadow-sm">
                        <Search className="w-6 h-6 md:w-8 md:h-8 text-[#ff4d00]" />
                    </div>
                    <h3 className="text-slate-800 font-bold text-base md:text-lg">Atlet tidak ditemukan</h3>
                    <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium px-4">Coba gunakan kata kunci pencarian yang lain.</p>
                </div>
            )}
            </div>
        </AppLayout>
    );
}