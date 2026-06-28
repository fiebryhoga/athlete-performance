import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { User, Activity, Dumbbell, Users, Search, ChevronRight } from 'lucide-react';

export default function Index({ auth, athletes, filters }) {
 const [searchTerm, setSearchTerm] = React.useState(filters.search || '');

 return (
 <AppLayout title="Individual Training">
 <Head title="Individual Training" />
 <div className="mb-8">
 <h1 className="text-2xl font-bold text-gray-900 ">Individual Training</h1>
 <p className="text-gray-600 ">Pilih athlete untuk mengelola sesi Individual Training.</p>
 </div>

 <div className="pb-12 space-y-6">
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
 <div className="relative w-full md:max-w-md group">
 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
 <Search className="text-zinc-400" size={16} />
 </div>
 <form action={route('admin.individual-trainings.index')} method="GET">
 <input 
 name="search"
 type="text" 
 placeholder="Cari Athlete..." 
 className="w-full pl-9 pr-8 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-500 focus:ring-1 focus:ring-zinc-900 outline-none shadow-sm"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 />
 </form>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
 {athletes.map(athlete => (
 <Link key={athlete.id} href={route('admin.individual-trainings.show', athlete.id)} className="block group">
 <div className="bg-white border border-zinc-200 hover:border-zinc-900 rounded-xl p-5 transition-all shadow-sm flex flex-col h-full relative overflow-hidden">
 <div className="absolute -right-4 -top-4 w-24 h-24 bg-zinc-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
 <div className="flex justify-between items-start mb-4 relative z-10">
 <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-200 ">
 {athlete.profile_photo_url ? (
 <img src={athlete.profile_photo_url} alt={athlete.name} className="h-full w-full object-cover" />
 ) : (
 <User className="h-6 w-6 text-zinc-400" />
 )}
 </div>
 <div className="bg-zinc-100 p-1.5 rounded-lg text-zinc-400 group-hover:text-zinc-900 transition-colors">
 <ChevronRight size={18} />
 </div>
 </div>
 <div className="relative z-10 mb-6">
 <h3 className="font-bold text-lg text-zinc-900 group-hover:text-black transition-colors">
 {athlete.name}
 </h3>
 <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">
 {athlete.sport?.name || 'Tidak ada cabang olahraga'}
 </p>
 </div>
 <div className="mt-auto pt-4 border-t border-zinc-100 grid grid-cols-2 gap-4 relative z-10">
 <div>
 <p className="text-[10px] font-bold text-zinc-400 uppercase">Total Sesi</p>
 <p className="text-sm font-semibold text-zinc-900 mt-1 flex items-center gap-1.5">
 <Activity size={14} className="text-zinc-400" />
 {athlete.total_records}
 </p>
 </div>
 <div>
 <p className="text-[10px] font-bold text-zinc-400 uppercase">Role</p>
 <p className="text-sm font-semibold text-zinc-900 mt-1 flex items-center gap-1.5">
 <Users size={14} className="text-zinc-400" />
 <span className="capitalize">{athlete.role}</span>
 </p>
 </div>
 </div>
 </div>
 </Link>
 ))}
 </div>

 {athletes.length === 0 && (
 <div className="text-center py-16 bg-white rounded-xl border border-dashed border-zinc-300 flex flex-col items-center justify-center">
 <div className="h-12 w-12 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
 <Dumbbell className="h-6 w-6 text-zinc-400" />
 </div>
 <h3 className="text-sm font-bold text-zinc-900 ">Tidak ada Athlete ditemukan</h3>
 <p className="mt-1 text-xs text-zinc-500">Ubah kata kunci pencarian Anda atau pastikan data athlete tersedia.</p>
 </div>
 )}
 </div>
 </AppLayout>
 );
}
