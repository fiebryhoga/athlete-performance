import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PageHeader from '@/Components/Layout/PageHeader';
import { Users, UserCheck, Activity, Search, Trophy, CheckCircle2, Calendar, Banknote } from 'lucide-react';
import Swal from 'sweetalert2';

export default function SessionRecap({ athletes, coaches }) {
    const [athleteSearch, setAthleteSearch] = useState('');
    const [coachSearch, setCoachSearch] = useState('');

    const filteredAthletes = athletes.filter(a => 
        a.name.toLowerCase().includes(athleteSearch.toLowerCase()) || 
        (a.sport?.name || '').toLowerCase().includes(athleteSearch.toLowerCase())
    );

    const filteredCoaches = coaches.filter(c => 
        c.name.toLowerCase().includes(coachSearch.toLowerCase())
    );

    const totalAthleteSessions = athletes.reduce((sum, a) => sum + (a.total_sessions || 0), 0);
    const totalCoachSessions = coaches.reduce((sum, c) => sum + (c.total_handled_sessions || 0), 0);
    const totalUnpaidAthleteSessions = athletes.reduce((sum, a) => sum + (a.unpaid_sessions || 0), 0);
    const totalUnpaidCoachSessions = coaches.reduce((sum, c) => sum + (c.unpaid_handled_sessions || 0), 0);

    const { post, processing } = useForm();

    const handlePayAthlete = (athlete) => {
        Swal.fire({
            title: 'Tandai Lunas?',
            text: `Anda akan menandai ${athlete.unpaid_sessions} sesi milik ${athlete.name} sebagai lunas.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff4d00',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Ya, Tandai Lunas!'
        }).then((result) => {
            if (result.isConfirmed) {
                post(route('admin.reports.pay-athlete', athlete.id));
            }
        });
    };

    const handlePayCoach = (coach) => {
        Swal.fire({
            title: 'Tandai Lunas?',
            text: `Anda akan menandai ${coach.unpaid_handled_sessions} sesi yang ditangani ${coach.name} sebagai lunas.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Ya, Tandai Lunas!'
        }).then((result) => {
            if (result.isConfirmed) {
                post(route('admin.reports.pay-coach', coach.id));
            }
        });
    };

    return (
        <AppLayout title="Rekap Sesi">
            <Head title="Rekap Sesi - Superadmin" />
            
            <PageHeader
                title="Rekap Sesi"
                subtitle="Laporan kumulatif sesi latihan atlet dan pelatih"
                icon={Activity}
                backButton={true}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 mt-6">
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 mb-1">Total Sesi Atlet</p>
                        <h3 className="text-3xl font-black text-slate-800">{totalAthleteSessions}</h3>
                        <p className="text-xs text-slate-400 mt-2">Seluruh sesi terjadwal & selesai</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-[#ff4d00]">
                        <Users className="w-8 h-8" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 mb-1">Total Sesi Pelatih</p>
                        <h3 className="text-3xl font-black text-slate-800">{totalCoachSessions}</h3>
                        <p className="text-xs text-slate-400 mt-2">Sesi yang ditangani oleh pelatih</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <UserCheck className="w-8 h-8" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Tabel Atlet */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-orange-100 text-[#ff4d00]">
                                <Users className="w-5 h-5" />
                            </div>
                            <h2 className="font-bold text-lg text-slate-800">Rekap Atlet</h2>
                        </div>
                        <div className="relative w-48 lg:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text"
                                value={athleteSearch}
                                onChange={e => setAthleteSearch(e.target.value)}
                                placeholder="Cari atlet..."
                                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] transition-all outline-none"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Nama Atlet</th>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-center">Total Sesi</th>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-center">Selesai</th>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-center">Terjadwal</th>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-center">Belum Dibayar</th>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredAthletes.length > 0 ? filteredAthletes.map(athlete => (
                                    <tr key={athlete.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-slate-800">{athlete.name}</span>
                                                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                                                    <Trophy className="w-3 h-3 text-slate-300" />
                                                    {athlete.sport?.name || '-'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-bold text-xs">
                                                {athlete.total_sessions}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md bg-green-50 text-green-700 font-bold text-xs border border-green-100">
                                                {athlete.completed_sessions}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md bg-slate-50 text-slate-500 font-bold text-xs border border-slate-200">
                                                {athlete.scheduled_sessions}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md bg-orange-50 text-orange-700 font-bold text-xs border border-orange-100">
                                                {athlete.unpaid_sessions}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            {athlete.unpaid_sessions > 0 ? (
                                                <button
                                                    onClick={() => handlePayAthlete(athlete)}
                                                    disabled={processing}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#ff4d00]/10 text-[#ff4d00] hover:bg-[#ff4d00] hover:text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                                                >
                                                    <Banknote className="w-3.5 h-3.5" />
                                                    Tandai Lunas
                                                </button>
                                            ) : (
                                                <span className="text-xs font-bold text-slate-400">Lunas</span>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-5 py-8 text-center text-slate-400 text-sm font-medium">
                                            Tidak ada data atlet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tabel Pelatih */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                                <UserCheck className="w-5 h-5" />
                            </div>
                            <h2 className="font-bold text-lg text-slate-800">Rekap Pelatih</h2>
                        </div>
                        <div className="relative w-48 lg:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text"
                                value={coachSearch}
                                onChange={e => setCoachSearch(e.target.value)}
                                placeholder="Cari pelatih..."
                                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Nama Pelatih</th>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-center">Total Sesi Ditangani</th>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-center">Belum Dibayar</th>
                                    <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredCoaches.length > 0 ? filteredCoaches.map(coach => (
                                    <tr key={coach.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-3">
                                            <span className="font-bold text-sm text-slate-800">{coach.name}</span>
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-bold text-sm border border-slate-200">
                                                {coach.total_handled_sessions}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-bold text-sm border border-indigo-100">
                                                {coach.unpaid_handled_sessions}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            {coach.unpaid_handled_sessions > 0 ? (
                                                <button
                                                    onClick={() => handlePayCoach(coach)}
                                                    disabled={processing}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                                                >
                                                    <Banknote className="w-3.5 h-3.5" />
                                                    Tandai Lunas
                                                </button>
                                            ) : (
                                                <span className="text-xs font-bold text-slate-400">Lunas</span>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="2" className="px-5 py-8 text-center text-slate-400 text-sm font-medium">
                                            Tidak ada data pelatih
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </AppLayout>
    );
}
