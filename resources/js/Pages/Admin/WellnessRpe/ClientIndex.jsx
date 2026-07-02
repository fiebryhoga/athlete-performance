import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Layout/PageHeader';
import { Head, Link } from '@inertiajs/react';
import { User, Activity, HeartPulse, Search, ChevronRight } from 'lucide-react';

export default function ClientIndex({ auth, athletes }) {
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredAthletes = React.useMemo(() => {
        if (!searchTerm.trim()) return athletes;
        const q = searchTerm.toLowerCase();
        return athletes.filter(athlete => 
            athlete.name.toLowerCase().includes(q) || 
            (athlete.sport?.name && athlete.sport.name.toLowerCase().includes(q))
        );
    }, [athletes, searchTerm]);

    return (
        <AppLayout user={auth.user} title="Data Klien Wellness" headerTitle="Wellness & RPE" headerDescription="Pantau data Wellness dan RPE atlet Anda.">
            <Head title="Wellness Klien" />
            
            <PageHeader 
                title="Data Klien Wellness"
                subtitle="Pilih athlete untuk memantau data Wellness dan RPE harian mereka."
                badge="Coach View"
                icon={HeartPulse}
                actions={
                    <div className="relative w-full md:w-64 group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="text-slate-400" size={16} />
                        </div>
                        <input 
                            name="search"
                            type="text" 
                            placeholder="Cari Athlete..." 
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-500 focus:border-[#ff4d00] focus:ring-4 focus:ring-[#ff4d00]/10 focus:shadow-sm outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                }
            />

            <div className="pb-12 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredAthletes.map(athlete => (
                        <Link key={athlete.id} href={route('admin.wellness-rpe.athlete.show', athlete.id)} className="block group">
                            <div className="bg-white border border-slate-200 hover:border-[#ff4d00] hover:shadow-md hover:shadow-[#ff4d00]/10 rounded-xl p-5 transition-all flex flex-col h-full relative overflow-hidden group-hover:-translate-y-1">
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                        {athlete.profile_photo_url ? (
                                            <img src={athlete.profile_photo_url} alt={athlete.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <User className="h-6 w-6 text-slate-400" />
                                        )}
                                    </div>
                                    <div className="bg-slate-100 p-1.5 rounded-lg text-slate-400 group-hover:text-white group-hover:bg-[#ff4d00] transition-colors shadow-sm">
                                        <ChevronRight size={18} />
                                    </div>
                                </div>
                                <div className="relative z-10 mb-6">
                                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#ff4d00] transition-colors">
                                        {athlete.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-semibold mt-1">
                                        {athlete.sport?.name || 'Athlete'}
                                    </p>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 relative z-10">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400">Update Terakhir</p>
                                        <p className="text-sm font-semibold text-slate-900 mt-1 flex items-center gap-1.5">
                                            <Activity size={14} className="text-slate-400" />
                                            {athlete.latest_wellness ? new Date(athlete.latest_wellness.record_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400">Score Terakhir</p>
                                        <p className="text-sm font-semibold text-slate-900 mt-1 flex items-center gap-1.5">
                                            <HeartPulse size={14} className="text-slate-400" />
                                            {athlete.latest_wellness?.daily_wellness_score || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredAthletes.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center">
                        <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <HeartPulse className="h-6 w-6 text-slate-400" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">Tidak ada Athlete ditemukan</h3>
                        <p className="mt-1 text-xs text-slate-500">Ubah kata kunci pencarian Anda atau pastikan data athlete tersedia.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
