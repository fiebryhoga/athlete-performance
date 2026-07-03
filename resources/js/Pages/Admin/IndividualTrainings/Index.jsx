import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Search, User, ChevronRight, Activity, Users, Dumbbell, Calendar as CalendarIcon } from 'lucide-react';
import PageHeader from '@/Components/Layout/PageHeader';

export default function Index({ athletes, groups }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('individual');

    const filteredAthletes = useMemo(() => {
        if (!searchTerm.trim()) return athletes;
        const q = searchTerm.toLowerCase();
        return athletes.filter(athlete => 
            athlete.name.toLowerCase().includes(q) ||
            (athlete.sport?.name && athlete.sport.name.toLowerCase().includes(q))
        );
    }, [athletes, searchTerm]);

    const filteredGroups = useMemo(() => {
        if (!searchTerm.trim()) return groups;
        const q = searchTerm.toLowerCase();
        return groups.filter(group => 
            group.name.toLowerCase().includes(q)
        );
    }, [groups, searchTerm]);

    return (
        <AppLayout title="Program Latihan">
            <Head title="Program Latihan" />
            <PageHeader 
                title="Program Latihan"
                subtitle="Pilih athlete atau grup untuk mencatat dan mengelola sesi program latihan mereka."
                badge="Latihan"
                icon={Dumbbell}
                actions={
                    <div className="relative w-full md:w-64 group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="text-slate-400" size={16} />
                        </div>
                        <input 
                            name="search"
                            type="text" 
                            placeholder="Cari Athlete atau Grup..." 
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-500 focus:border-slate-400 focus:ring-4 focus:ring-slate-400/10 focus:shadow-sm outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                }
            />

            <div className="pb-12 space-y-6">
                
                {/* Tabs */}
                <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200 w-full sm:w-fit mx-auto md:mx-0">
                    <button
                        onClick={() => setActiveTab('individual')}
                        className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                            activeTab === 'individual' 
                                ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }`}
                    >
                        <User size={16} /> Klien Individu
                    </button>
                    <button
                        onClick={() => setActiveTab('group')}
                        className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                            activeTab === 'group' 
                                ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }`}
                    >
                        <Users size={16} /> Grup Latihan
                    </button>
                </div>

                {activeTab === 'individual' ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredAthletes.map(athlete => (
                                <Link key={athlete.id} href={route('admin.individual-trainings.show', athlete.id)} className="block group">
                                    <div className="bg-white border border-slate-200 hover:border-slate-900 hover:shadow-md rounded-xl p-5 transition-all shadow-sm flex flex-col h-full relative overflow-hidden group-hover:-translate-y-1">
                                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 ">
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
                                                {athlete.sport?.name || 'Tidak ada cabang olahraga'}
                                            </p>
                                        </div>
                                        <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 relative z-10">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400">Total Sesi</p>
                                                <p className="text-sm font-semibold text-slate-900 mt-1 flex items-center gap-1.5">
                                                    <Activity size={14} className="text-slate-400" />
                                                    {athlete.total_records}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400">Role</p>
                                                <p className="text-sm font-semibold text-slate-900 mt-1 flex items-center gap-1.5">
                                                    <Users size={14} className="text-slate-400" />
                                                    <span className="capitalize">{athlete.role}</span>
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
                                    <Dumbbell className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 ">Tidak ada Athlete ditemukan</h3>
                                <p className="mt-1 text-xs text-slate-500">Ubah kata kunci pencarian Anda atau pastikan data athlete tersedia.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredGroups.map(group => (
                                <Link key={group.id} href={route('admin.group-trainings.show', group.id)} className="block group">
                                    <div className="bg-white border border-slate-200 hover:border-slate-900 hover:shadow-md rounded-xl p-5 transition-all shadow-sm flex flex-col h-full relative overflow-hidden group-hover:-translate-y-1">
                                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 ">
                                                <Users className="h-6 w-6 text-slate-400" />
                                            </div>
                                            <div className="bg-slate-100 p-1.5 rounded-lg text-slate-400 group-hover:text-white group-hover:bg-[#ff4d00] transition-colors shadow-sm">
                                                <ChevronRight size={18} />
                                            </div>
                                        </div>
                                        <div className="relative z-10 mb-6">
                                            <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#ff4d00] transition-colors">
                                                {group.name}
                                            </h3>
                                            <p className="text-xs text-slate-500 font-semibold mt-1">
                                                {group.package?.name || 'Tidak ada paket'}
                                            </p>
                                        </div>
                                        <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 relative z-10">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400">Total Sesi</p>
                                                <p className="text-sm font-semibold text-slate-900 mt-1 flex items-center gap-1.5">
                                                    <CalendarIcon size={14} className="text-slate-400" />
                                                    {group.total_records}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400">Total Anggota</p>
                                                <p className="text-sm font-semibold text-slate-900 mt-1 flex items-center gap-1.5">
                                                    <Users size={14} className="text-slate-400" />
                                                    {group.members?.length || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {filteredGroups.length === 0 && (
                            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center">
                                <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <Users className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 ">Tidak ada Grup ditemukan</h3>
                                <p className="mt-1 text-xs text-slate-500">Buat grup baru di menu Manajemen Pengguna terlebih dahulu.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}
