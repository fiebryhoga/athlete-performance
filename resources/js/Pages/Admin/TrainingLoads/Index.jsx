import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Search, ChevronRight, HeartPulse } from 'lucide-react';
import { useState } from 'react';

export default function Index({ athletes }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAthletes = athletes?.filter(athlete =>
        athlete.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <AdminLayout title="Wellness & Training Load">
            <Head title="Wellness & Training Load" />

            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                        <HeartPulse className="w-7 h-7 text-rose-500" /> Wellness & Training Load
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Pantau tingkat kebugaran, RPE, dan Load atlet.</p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Cari atlet..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 transition-all" 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredAthletes.map((athlete) => (
                    <div key={athlete.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-rose-100 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                {/* FOTO PROFIL ATLET */}
                                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xl group-hover:bg-rose-500 group-hover:text-white transition-colors shrink-0">
                                    {athlete.profile_photo_url ? (
                                        <img src={athlete.profile_photo_url} alt={athlete.name} className="w-full h-full object-cover" />
                                    ) : (
                                        athlete.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-rose-500 transition-colors">{athlete.name}</h3>
                                    <span className="text-[10px] font-extrabold tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md mt-1 inline-block">
                                        {athlete.sport?.name || 'Umum'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                            <div className="text-xs font-bold text-slate-500">
                                <span className="text-slate-800 text-lg">{athlete.total_records}</span> Data Load
                            </div>
                            <Link 
                                href={route('admin.training-loads.show', athlete.id)}
                                className="flex items-center gap-1 text-xs font-bold text-white bg-rose-500 px-4 py-2 rounded-xl shadow-sm hover:bg-rose-600 hover:-translate-y-0.5 transition-all"
                            >
                                Buka Menu <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}