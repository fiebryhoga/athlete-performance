import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Activity, User, ChevronRight, ClipboardList } from 'lucide-react';
import { useState } from 'react';

export default function AthleteList({ athletes, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.training-logs.index'), { search }, { 
            preserveState: true,
            replace: true
        });
    };

    return (
        <AdminLayout title="Daftar Klien - Training Logs">
            <Head title="Training Session Logs" />

            <div className="max-w-7xl mx-auto pb-12">
                
                {/* HEADER & SEARCH BAR */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <ClipboardList className="w-8 h-8 text-[#00488b]" />
                            Training Session Logs
                        </h2>
                        <p className="text-slate-500 font-medium mt-1">Pilih klien/atlet untuk membuat sesi latihan atau melihat buku log.</p>
                    </div>

                    <form onSubmit={handleSearch} className="w-full md:w-80 relative">
                        <input
                            type="text"
                            placeholder="Cari nama klien..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm text-sm focus:ring-2 focus:ring-[#00488b]/20 focus:border-[#00488b] transition-all"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <button type="submit" className="hidden">Cari</button>
                    </form>
                </div>

                {/* DAFTAR ATLET / KLIEN */}
                {athletes && athletes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {athletes.map((athlete) => (
                            <Link 
                                key={athlete.id} 
                                // MENGARAH KE HALAMAN JADWAL (INDEX)
                                href={route('admin.training-logs.sessions', athlete.id)}
                                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group flex items-center gap-4"
                            >
                                {/* FOTO / INISIAL */}
                                <div className="relative shrink-0 w-14 h-14 rounded-full overflow-hidden border border-slate-100 bg-blue-50 flex items-center justify-center">
                                    {athlete.profile_photo_url ? (
                                        <img src={athlete.profile_photo_url} alt={athlete.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-6 h-6 text-blue-400" />
                                    )}
                                </div>

                                {/* INFO ATLET */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-800 truncate group-hover:text-[#00488b] transition-colors text-base">
                                        {athlete.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                                            {athlete.sport?.name || 'Umum'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
                                        <Activity className="w-3.5 h-3.5 text-[#00488b]" />
                                        {athlete.total_records || 0} Sesi Tercatat
                                    </p>
                                </div>

                                {/* ICON PANAH */}
                                <div className="shrink-0 text-slate-300 group-hover:text-[#00488b] transition-colors group-hover:translate-x-1">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
                        <div className="bg-slate-50 p-4 rounded-full mb-4">
                            <Search className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">Klien tidak ditemukan</h3>
                        <p className="text-slate-500 text-sm mt-1 max-w-sm">
                            {search ? `Tidak ada klien dengan nama "${search}". Silakan coba kata kunci lain.` : "Belum ada klien yang terdaftar di sistem."}
                        </p>
                    </div>
                )}

            </div>
        </AdminLayout>
    );
}