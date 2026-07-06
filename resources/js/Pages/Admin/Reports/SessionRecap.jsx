import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PageHeader from '@/Components/Layout/PageHeader';
import { Users, UserCheck, Activity, Search, Trophy, CheckCircle2, Calendar, Banknote, ChevronDown, ChevronRight, Package, Dumbbell } from 'lucide-react';
import Swal from 'sweetalert2';

export default function SessionRecap({ athletes, groups, coaches }) {
    const [activeTab, setActiveTab] = useState('individual'); // 'individual', 'group', 'coach'
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedRows, setExpandedRows] = useState(new Set());

    const { post, processing } = useForm();

    const toggleRow = (id) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    // Calculate Totals for Summary Cards
    const totalAthleteSessions = athletes.reduce((sum, a) => sum + (a.total_sessions || 0), 0);
    const totalGroupSessions = groups.reduce((sum, g) => sum + (g.total_sessions || 0), 0);
    const activeCoachesCount = coaches.filter(c => c.total_sessions > 0).length;

    // Filtering
    const filteredAthletes = athletes.filter(a => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (a.sport?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredGroups = groups.filter(g => 
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredCoaches = coaches.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Payment Handlers
    const handlePayAthlete = (athlete) => {
        Swal.fire({
            title: 'Tandai Lunas?',
            text: `Anda akan menandai ${athlete.unpaid_sessions} sesi belum bayar milik ${athlete.name} sebagai lunas.`,
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

    const handlePayGroup = (group) => {
        Swal.fire({
            title: 'Tandai Lunas?',
            text: `Anda akan menandai ${group.unpaid_sessions} sesi belum bayar milik grup ${group.name} sebagai lunas.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff4d00',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Ya, Tandai Lunas!'
        }).then((result) => {
            if (result.isConfirmed) {
                post(route('admin.reports.pay-group', group.id));
            }
        });
    };

    const handlePayCoach = (coach) => {
        Swal.fire({
            title: 'Tandai Lunas?',
            text: `Anda akan mencairkan honor sebesar Rp ${coach.unpaid_earnings.toLocaleString('id-ID')} untuk pelatih ${coach.name}.`,
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
    };

    const renderProgressBar = (completed, total) => {
        if (!total) {
            return (
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">{completed} Sesi</span>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Tanpa Paket</span>
                </div>
            );
        }
        
        const percent = Math.min(100, Math.round((completed / total) * 100));
        let colorClass = "bg-[#ff4d00]";
        if (percent >= 100) colorClass = "bg-green-500";
        else if (percent > 60) colorClass = "bg-orange-500";
        
        return (
            <div className="flex flex-col gap-1 w-full max-w-[150px]">
                <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-600">Sesi {completed}/{total}</span>
                    <span className={percent >= 100 ? "text-green-600" : "text-slate-400"}>{percent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${percent}%` }}></div>
                </div>
            </div>
        );
    };

    return (
        <AppLayout title="Rekap Sesi">
            <Head title="Rekap Sesi - Superadmin" />
            
            <PageHeader
                title="Rekap Sesi Latihan"
                subtitle="Laporan kumulatif sesi latihan atlet, grup, dan perhitungan honor pelatih"
                icon={Activity}
                backButton={true}
                searchPlaceholder={`Cari ${activeTab === 'individual' ? 'klien individu' : activeTab === 'group' ? 'grup' : 'pelatih'}...`}
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="relative bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-50/0 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 mb-1">Total Sesi Individu</p>
                            <h3 className="text-3xl font-black text-slate-800">{totalAthleteSessions}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center text-[#ff4d00] shadow-inner">
                            <UserCheck className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="relative bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50/0 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 mb-1">Total Sesi Grup</p>
                            <h3 className="text-3xl font-black text-slate-800">{totalGroupSessions}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="relative bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100 to-indigo-50/0 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 mb-1">Pelatih Aktif</p>
                            <h3 className="text-3xl font-black text-slate-800">{activeCoachesCount}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                            <Activity className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="relative bg-emerald-50 rounded-2xl border border-emerald-100 p-6 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-200 to-emerald-100/0 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-emerald-600 mb-1">Total Tagihan Pelatih</p>
                            <h3 className="text-xl font-black text-emerald-800">{formatCurrency(coaches.reduce((sum, c) => sum + (c.unpaid_earnings || 0), 0))}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-emerald-700 shadow-inner">
                            <Banknote className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-8 flex flex-wrap items-center gap-2 mb-4">
                <button
                    onClick={() => setActiveTab('individual')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                        activeTab === 'individual' ? 'bg-[#ff4d00] text-white shadow-md shadow-orange-500/20' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <UserCheck size={16} /> Klien Individu
                </button>
                <button
                    onClick={() => setActiveTab('group')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                        activeTab === 'group' ? 'bg-[#ff4d00] text-white shadow-md shadow-orange-500/20' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <Users size={16} /> Grup Latihan
                </button>
                <button
                    onClick={() => setActiveTab('coach')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                        activeTab === 'coach' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <Activity size={16} /> Rekap Pelatih (Honor)
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-0">
                    {/* INDIVIDUAL TAB */}
                    {activeTab === 'individual' && (
                        <div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-5 py-3 w-10"></th>
                                            <th className="px-5 py-3 text-xs font-bold text-slate-500">Nama Atlet</th>
                                            <th className="px-5 py-3 text-xs font-bold text-slate-500">Paket Latihan</th>
                                            <th className="px-5 py-3 text-xs font-bold text-slate-500">Progress Sesi</th>
                                            <th className="px-5 py-3 text-xs font-bold text-slate-500 text-center">Belum Bayar</th>
                                            <th className="px-5 py-3 text-xs font-bold text-slate-500 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredAthletes.length > 0 ? filteredAthletes.map(athlete => (
                                            <React.Fragment key={athlete.id}>
                                                <tr className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-5 py-3">
                                                        <button onClick={() => toggleRow(`athlete-${athlete.id}`)} className="p-1 text-slate-400 hover:text-slate-800 rounded">
                                                            {expandedRows.has(`athlete-${athlete.id}`) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                                        </button>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-sm text-slate-800">{athlete.name}</span>
                                                            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                                                                <Trophy className="w-3 h-3 text-slate-300" />
                                                                {athlete.sport?.name || '-'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        {athlete.package_name ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[11px] font-bold">
                                                                <Package size={12} className="text-slate-400" />
                                                                {athlete.package_name}
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-slate-400 italic">Tanpa Paket</span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        {renderProgressBar(athlete.unpaid_sessions, athlete.package_session_count)}
                                                    </td>
                                                    <td className="px-5 py-3 text-center">
                                                        {athlete.unpaid_sessions > 0 ? (
                                                            <span className="inline-flex min-w-[2rem] px-2 py-1 rounded bg-orange-50 text-orange-700 font-bold text-xs border border-orange-200">
                                                                {athlete.unpaid_sessions}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-300">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-3 text-right">
                                                        {athlete.unpaid_sessions > 0 ? (
                                                            <button
                                                                onClick={() => handlePayAthlete(athlete)}
                                                                disabled={processing}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ff4d00]/10 text-[#ff4d00] hover:bg-[#ff4d00] hover:text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                                                            >
                                                                <Banknote className="w-3.5 h-3.5" /> Tandai Lunas
                                                            </button>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-lg">
                                                                <CheckCircle2 size={14} /> Lunas
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                                {/* Expanded Details */}
                                                {expandedRows.has(`athlete-${athlete.id}`) && (
                                                    <tr className="bg-slate-50/50">
                                                        <td colSpan="6" className="px-10 py-4 border-b border-slate-100">
                                                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                                                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
                                                                    Riwayat Sesi Latihan
                                                                </div>
                                                                {athlete.sessions && athlete.sessions.length > 0 ? (
                                                                    <table className="w-full text-left">
                                                                        <tbody className="divide-y divide-slate-100">
                                                                            {athlete.sessions.map(session => (
                                                                                <tr key={session.id} className="text-xs hover:bg-slate-50 transition-colors">
                                                                                    <td className="px-4 py-3 font-medium text-slate-600 w-32 border-r border-slate-50">
                                                                                        {session.date ? new Date(session.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                                                    </td>
                                                                                    <td className="px-4 py-3">
                                                                                        <span className="font-bold text-slate-800 mr-2">Sesi {session.session_number}:</span>
                                                                                        <span className="text-slate-600">{session.name || 'Program Latihan'}</span>
                                                                                    </td>
                                                                                    <td className="px-4 py-3 text-slate-500">
                                                                                        {session.coaches.length > 0 ? session.coaches.join(', ') : '-'}
                                                                                    </td>
                                                                                    <td className="px-4 py-3 w-28">
                                                                                        {session.status === 'completed' ? (
                                                                                            <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100">Selesai</span>
                                                                                        ) : (
                                                                                            <span className="text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-100">Terjadwal</span>
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="px-4 py-3 w-28 text-right">
                                                                                        {session.is_paid ? (
                                                                                            <span className="text-emerald-500 font-bold"><CheckCircle2 size={12} className="inline mr-1" /> Lunas</span>
                                                                                        ) : (
                                                                                            <span className="text-slate-400 font-bold">Belum Bayar</span>
                                                                                        )}
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                ) : (
                                                                    <div className="p-4 text-center text-xs text-slate-400">Belum ada riwayat sesi.</div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        )) : (
                                            <tr>
                                                <td colSpan="6" className="px-5 py-8 text-center text-slate-400 text-sm font-medium">Tidak ada data atlet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* GROUP TAB */}
                    {activeTab === 'group' && (
                        <div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-5 py-3 w-10"></th>
                                            <th className="px-5 py-3 text-xs font-bold text-slate-500">Nama Grup</th>
                                            <th className="px-5 py-3 text-xs font-bold text-slate-500">Anggota</th>
                                            <th className="px-5 py-3 text-xs font-bold text-slate-500">Paket Latihan</th>
                                            <th className="px-5 py-3 text-xs font-bold text-slate-500">Progress Sesi</th>
                                            <th className="px-5 py-3 text-xs font-bold text-slate-500 text-center">Belum Bayar</th>
                                            <th className="px-5 py-3 text-xs font-bold text-slate-500 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredGroups.length > 0 ? filteredGroups.map(group => (
                                            <React.Fragment key={group.id}>
                                                <tr className="hover:bg-slate-50/50 transition-colors group/row">
                                                    <td className="px-5 py-3">
                                                        <button onClick={() => toggleRow(`group-${group.id}`)} className="p-1 text-slate-400 hover:text-slate-800 rounded">
                                                            {expandedRows.has(`group-${group.id}`) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                                        </button>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <span className="font-bold text-sm text-slate-800">{group.name}</span>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <div className="flex -space-x-2 overflow-hidden">
                                                            {group.member_names?.slice(0, 3).map((name, i) => (
                                                                <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600" title={name}>
                                                                    {name.substring(0, 2).toUpperCase()}
                                                                </div>
                                                            ))}
                                                            {group.member_names?.length > 3 && (
                                                                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500">
                                                                    +{group.member_names.length - 3}
                                                                </div>
                                                            )}
                                                            {(!group.member_names || group.member_names.length === 0) && (
                                                                <span className="text-xs text-slate-400">0 Anggota</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        {group.package_name ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[11px] font-bold">
                                                                <Package size={12} className="text-slate-400" />
                                                                {group.package_name}
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-slate-400 italic">Tanpa Paket</span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        {renderProgressBar(group.unpaid_sessions, group.package_session_count)}
                                                    </td>
                                                    <td className="px-5 py-3 text-center">
                                                        {group.unpaid_sessions > 0 ? (
                                                            <span className="inline-flex min-w-[2rem] px-2 py-1 rounded bg-orange-50 text-orange-700 font-bold text-xs border border-orange-200">
                                                                {group.unpaid_sessions}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-300">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-3 text-right">
                                                        {group.unpaid_sessions > 0 ? (
                                                            <button
                                                                onClick={() => handlePayGroup(group)}
                                                                disabled={processing}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ff4d00]/10 text-[#ff4d00] hover:bg-[#ff4d00] hover:text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                                                            >
                                                                <Banknote className="w-3.5 h-3.5" /> Tandai Lunas
                                                            </button>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-lg">
                                                                <CheckCircle2 size={14} /> Lunas
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                                {/* Expanded Details */}
                                                {expandedRows.has(`group-${group.id}`) && (
                                                    <tr className="bg-slate-50/50">
                                                        <td colSpan="7" className="px-10 py-4 border-b border-slate-100">
                                                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                                                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
                                                                    Riwayat Sesi Latihan Grup
                                                                </div>
                                                                {group.sessions && group.sessions.length > 0 ? (
                                                                    <table className="w-full text-left">
                                                                        <tbody className="divide-y divide-slate-100">
                                                                            {group.sessions.map(session => (
                                                                                <tr key={session.id} className="text-xs hover:bg-slate-50 transition-colors">
                                                                                    <td className="px-4 py-3 font-medium text-slate-600 w-32 border-r border-slate-50">
                                                                                        {session.date ? new Date(session.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                                                    </td>
                                                                                    <td className="px-4 py-3">
                                                                                        <span className="font-bold text-slate-800 mr-2">Sesi {session.session_number}:</span>
                                                                                        <span className="text-slate-600">{session.name || 'Program Latihan Grup'}</span>
                                                                                    </td>
                                                                                    <td className="px-4 py-3 text-slate-500">
                                                                                        {session.coaches.length > 0 ? session.coaches.join(', ') : '-'}
                                                                                    </td>
                                                                                    <td className="px-4 py-3 w-28">
                                                                                        {session.status === 'completed' ? (
                                                                                            <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100">Selesai</span>
                                                                                        ) : (
                                                                                            <span className="text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-100">Terjadwal</span>
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="px-4 py-3 w-28 text-right">
                                                                                        {session.is_paid ? (
                                                                                            <span className="text-emerald-500 font-bold"><CheckCircle2 size={12} className="inline mr-1" /> Lunas</span>
                                                                                        ) : (
                                                                                            <span className="text-slate-400 font-bold">Belum Bayar</span>
                                                                                        )}
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                ) : (
                                                                    <div className="p-4 text-center text-xs text-slate-400">Belum ada riwayat sesi grup.</div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        )) : (
                                            <tr>
                                                <td colSpan="7" className="px-5 py-8 text-center text-slate-400 text-sm font-medium">Tidak ada data grup.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* COACH TAB */}
                    {activeTab === 'coach' && (
                        <div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-5 py-3 w-10"></th>
                                            <th className="px-5 py-3 text-xs font-bold text-slate-500">Nama Pelatih</th>
                                            <th className="px-5 py-3 text-xs font-bold text-slate-500 text-center">Sesi Individu</th>
                                            <th className="px-5 py-3 text-xs font-bold text-slate-500 text-center">Sesi Grup</th>
                                            <th className="px-5 py-3 text-xs font-bold text-slate-500 text-center">Total Sesi (All)</th>
                                            <th className="px-5 py-3 text-xs font-bold text-slate-500 text-right">Pencairan Terakhir</th>
                                            <th className="px-5 py-3 text-xs font-bold text-slate-500 text-right">Belum Dicairkan</th>
                                            <th className="px-5 py-3 text-xs font-bold text-slate-500 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredCoaches.length > 0 ? filteredCoaches.map(coach => (
                                            <React.Fragment key={coach.id}>
                                                <tr className="hover:bg-slate-50 transition-colors group/row">
                                                    <td className="px-5 py-3">
                                                        <button onClick={() => toggleRow(`coach-${coach.id}`)} className="p-1 text-slate-400 hover:text-slate-800 rounded">
                                                            {expandedRows.has(`coach-${coach.id}`) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                                        </button>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                                                                {coach.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <span className="font-bold text-sm text-slate-800">{coach.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <span className="inline-flex min-w-[2.5rem] px-2 py-1 rounded bg-slate-100 text-slate-600 font-bold text-sm border border-slate-200">
                                                            {coach.individual_sessions}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <span className="inline-flex min-w-[2.5rem] px-2 py-1 rounded bg-slate-100 text-slate-600 font-bold text-sm border border-slate-200">
                                                            {coach.group_sessions}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <span className="inline-flex min-w-[2.5rem] px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-bold text-sm border border-indigo-100 shadow-sm">
                                                            {coach.total_sessions}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <span className="font-bold text-emerald-700">{formatCurrency(coach.last_payout_amount || 0)}</span>
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        {coach.unpaid_earnings > 0 ? (
                                                            <span className="font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded border border-rose-100">{formatCurrency(coach.unpaid_earnings)}</span>
                                                        ) : (
                                                            <span className="text-slate-400 font-semibold">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        {coach.unpaid_sessions > 0 ? (
                                                            <button
                                                                onClick={() => handlePayCoach(coach)}
                                                                disabled={processing}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 shadow-sm shadow-indigo-600/20"
                                                            >
                                                                <Banknote className="w-3.5 h-3.5" /> Cairkan Honor
                                                            </button>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-lg">
                                                                <CheckCircle2 size={14} /> Lunas
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                                {/* Expanded Details */}
                                                {expandedRows.has(`coach-${coach.id}`) && (
                                                    <tr className="bg-slate-50/50">
                                                        <td colSpan="8" className="px-10 py-4 border-b border-slate-100">
                                                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                                                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 flex justify-between">
                                                                    <span>Riwayat Sesi (Belum Dicairkan)</span>
                                                                </div>
                                                                {coach.sessions && coach.sessions.length > 0 ? (
                                                                    <table className="w-full text-left">
                                                                        <tbody className="divide-y divide-slate-100">
                                                                            {coach.sessions.map(session => (
                                                                                <tr key={session.id} className="text-xs hover:bg-slate-50 transition-colors">
                                                                                    <td className="px-4 py-3 font-medium text-slate-600 w-32 border-r border-slate-50">
                                                                                        {session.date ? new Date(session.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                                                    </td>
                                                                                    <td className="px-4 py-3 w-24 text-center">
                                                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${session.type === 'Grup' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                                                                            {session.type}
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="px-4 py-3">
                                                                                        <span className="font-bold text-slate-800 mr-2">Sesi {session.session_number}:</span>
                                                                                        <span className="text-slate-600">{session.name}</span>
                                                                                    </td>
                                                                                    <td className="px-4 py-3 w-28">
                                                                                        {session.status === 'completed' ? (
                                                                                            <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100">Selesai</span>
                                                                                        ) : (
                                                                                            <span className="text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-100">Terjadwal</span>
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="px-4 py-3 w-32 text-right">
                                                                                        <span className="font-bold text-emerald-600">{formatCurrency(session.fee)}</span>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                ) : (
                                                                    <div className="p-4 text-center text-xs text-slate-400">Tidak ada sesi yang belum dicairkan.</div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        )) : (
                                            <tr>
                                                <td colSpan="8" className="px-5 py-8 text-center text-slate-400 text-sm font-medium">Tidak ada data pelatih.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
