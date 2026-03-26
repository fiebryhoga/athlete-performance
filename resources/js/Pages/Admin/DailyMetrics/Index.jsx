import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Activity, Search, User, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function Index({ athletes }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAthletes = athletes?.filter(athlete =>
        athlete.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <AdminLayout title="Daily Monitoring">
            <Head title="Daily Monitoring" />

            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-[#00488b]" /> Daily Monitoring
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Pilih atlet untuk melihat atau mengisi metrik harian mereka.</p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Cari atlet..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00488b]/20 transition-all" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAthletes.map((athlete) => (
                    <Link key={athlete.id} href={route('admin.daily-metrics.show', athlete.id)} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-[#00488b]/30 hover:shadow-md transition-all group flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-[#00488b] rounded-full flex items-center justify-center font-bold text-lg">
                                {athlete.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 group-hover:text-[#00488b] transition-colors">{athlete.name}</h3>
                                <p className="text-xs text-slate-500">{athlete.sport?.name || 'Tanpa Cabor'} • {athlete.total_records} Records</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#00488b] transition-colors" />
                    </Link>
                ))}
            </div>
        </AdminLayout>
    );
}