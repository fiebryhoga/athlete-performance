import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PageHeader from '@/Components/Layout/PageHeader';
import { 
    Users, UserCheck, User, Activity, Search, Trophy, CheckCircle2, Calendar, 
    Banknote, ChevronDown, ChevronRight, Package, Dumbbell, Filter, 
    Clock, DollarSign, Layers, Eye, ShieldCheck, Sparkles, TrendingUp, FileText
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function SessionRecap({ 
    athletes = [], 
    groups = [], 
    coaches = [], 
    available_months = [], 
    monthly_summary = [] 
}) {
    const [activeTab, setActiveTab] = useState('individual'); // 'individual', 'group', 'coach'
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [selectedMonth, setSelectedMonth] = useState('all'); // 'all' or '2026-08', '2026-07', etc.
    const [expandedCoachTab, setExpandedCoachTab] = useState({}); // coachId => 'monthly' | 'unpaid' | 'all'
    const [expandedMonthDetail, setExpandedMonthDetail] = useState(new Set()); // 'coachId-monthKey'

    const { post, processing } = useForm();

    const monthNamesMap = {
        '01': 'Januari', '02': 'Februari', '03': 'Maret', '04': 'April',
        '05': 'Mei', '06': 'Juni', '07': 'Juli', '08': 'Agustus',
        '09': 'September', '10': 'Oktober', '11': 'November', '12': 'Desember'
    };

    const toggleRow = (id) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const toggleMonthDetail = (key) => {
        const newExpanded = new Set(expandedMonthDetail);
        if (newExpanded.has(key)) {
            newExpanded.delete(key);
        } else {
            newExpanded.add(key);
        }
        setExpandedMonthDetail(newExpanded);
    };

    const setCoachDetailTab = (coachId, tab) => {
        setExpandedCoachTab(prev => ({
            ...prev,
            [coachId]: tab
        }));
    };

    // Robust Monthly Breakdown Builder per Coach (guarantees data even if server returns raw sessions)
    const getCoachMonthlyBreakdown = (coach) => {
        if (coach.monthly_breakdown && coach.monthly_breakdown.length > 0) {
            return coach.monthly_breakdown;
        }

        const sourceSessions = (coach.all_sessions && coach.all_sessions.length > 0) 
            ? coach.all_sessions 
            : (coach.sessions || []);

        if (!sourceSessions.length) return [];

        const grouped = {};
        sourceSessions.forEach(s => {
            let mKey = s.month_key;
            if (!mKey && s.date) {
                const dStr = String(s.date).substring(0, 10);
                if (dStr.length >= 7) {
                    mKey = dStr.substring(0, 7);
                }
            }
            if (!mKey) mKey = 'other';

            if (!grouped[mKey]) {
                let label = mKey;
                if (mKey.includes('-')) {
                    const [y, m] = mKey.split('-');
                    label = `${monthNamesMap[m] || m} ${y}`;
                }
                grouped[mKey] = {
                    month_key: mKey,
                    month_label: label,
                    total_sessions: 0,
                    individual_sessions: 0,
                    group_sessions: 0,
                    gym_sessions: 0,
                    total_fee: 0,
                    paid_fee: 0,
                    unpaid_fee: 0,
                    unpaid_sessions: 0,
                    paid_sessions: 0,
                    sessions: []
                };
            }

            const fee = Number(s.fee || 0);
            grouped[mKey].total_sessions += 1;
            grouped[mKey].total_fee += fee;
            if (s.type === 'Individu') grouped[mKey].individual_sessions += 1;
            else if (s.type === 'Grup') grouped[mKey].group_sessions += 1;
            else if (s.type === 'Jaga Gym') grouped[mKey].gym_sessions += 1;

            if (s.is_paid) {
                grouped[mKey].paid_fee += fee;
                grouped[mKey].paid_sessions += 1;
            } else {
                grouped[mKey].unpaid_fee += fee;
                grouped[mKey].unpaid_sessions += 1;
            }
            grouped[mKey].sessions.push(s);
        });

        return Object.values(grouped).sort((a, b) => b.month_key.localeCompare(a.month_key));
    };

    // Compute or enrich global monthly summaries and available months list
    const computedAvailableMonths = useMemo(() => {
        if (available_months && available_months.length > 0) {
            return available_months;
        }

        const monthsSet = new Map();
        coaches.forEach(c => {
            const list = getCoachMonthlyBreakdown(c);
            list.forEach(mb => {
                if (mb.month_key !== 'other' && !monthsSet.has(mb.month_key)) {
                    monthsSet.set(mb.month_key, mb.month_label);
                }
            });
        });

        return Array.from(monthsSet.entries())
            .sort((a, b) => b[0].localeCompare(a[0]))
            .map(([key, label]) => ({ key, label }));
    }, [available_months, coaches]);

    const computedMonthlySummary = useMemo(() => {
        if (monthly_summary && monthly_summary.length > 0) {
            return monthly_summary;
        }

        return computedAvailableMonths.map(m => {
            let totalFee = 0;
            let paidFee = 0;
            let unpaidFee = 0;
            let totalSessions = 0;

            coaches.forEach(c => {
                const list = getCoachMonthlyBreakdown(c);
                const match = list.find(item => item.month_key === m.key);
                if (match) {
                    totalFee += match.total_fee;
                    paidFee += match.paid_fee;
                    unpaidFee += match.unpaid_fee;
                    totalSessions += match.total_sessions;
                }
            });

            return {
                month_key: m.key,
                month_label: m.label,
                total_fee: totalFee,
                paid_fee: paidFee,
                unpaid_fee: unpaidFee,
                total_sessions: totalSessions,
            };
        });
    }, [monthly_summary, computedAvailableMonths, coaches]);

    // Calculate Totals for Summary Cards
    const totalAthleteSessions = athletes.reduce((sum, a) => sum + (a.total_sessions || 0), 0);
    const totalGroupSessions = groups.reduce((sum, g) => sum + (g.total_sessions || 0), 0);
    const activeCoachesCount = coaches.filter(c => (c.total_sessions > 0 || (c.all_sessions && c.all_sessions.length > 0) || (c.sessions && c.sessions.length > 0))).length;
    const totalUnpaidCoachEarnings = coaches.reduce((sum, c) => sum + (c.unpaid_earnings || 0), 0);

    // Filtering Athletes & Groups
    const filteredAthletes = athletes.filter(a => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (a.sport?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredGroups = groups.filter(g => 
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filtering Coaches (by search & selected month)
    const filteredCoaches = coaches.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        if (selectedMonth === 'all') return true;

        const breakdown = getCoachMonthlyBreakdown(c);
        return breakdown.some(m => m.month_key === selectedMonth);
    });

    // Payment Handlers
    const handlePayAthlete = (athlete) => {
        Swal.fire({
            title: 'Tandai Lunas?',
            text: `Anda akan menandai ${athlete.unpaid_sessions} sesi belum bayar milik ${athlete.name} sebagai lunas.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f97316',
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
            confirmButtonColor: '#f97316',
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
            text: `Anda akan mencairkan honor sebesar Rp ${Number(coach.unpaid_earnings).toLocaleString('id-ID')} untuk pelatih ${coach.name}.`,
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
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount || 0);
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
        let colorClass = "bg-orange-500";
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
            <Head title="Rekap Sesi & Honor Pelatih - Admin" />
            
            <div className="w-full mx-auto pb-16 px-4 sm:px-6 lg:px-8 space-y-6">
                
                <PageHeader
                    title="Rekap Sesi & Honor Pelatih"
                    subtitle="Laporan kumulatif sesi latihan atlet, grup, serta rekapitulasi honor pelatih per bulan"
                    icon={Activity}
                    backButton={true}
                    searchPlaceholder={`Cari ${activeTab === 'individual' ? 'klien individu' : activeTab === 'group' ? 'grup' : 'pelatih'}...`}
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                {/* ─── SUMMARY KPI CARDS ─── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sesi Individu</span>
                            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100">
                                <UserCheck className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl md:text-3xl font-black text-slate-800">{totalAthleteSessions}</h3>
                            <span className="text-xs text-slate-400">Semua klien individu</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sesi Grup</span>
                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl md:text-3xl font-black text-slate-800">{totalGroupSessions}</h3>
                            <span className="text-xs text-slate-400">Seluruh sesi kelas grup</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pelatih Aktif</span>
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                <Activity className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl md:text-3xl font-black text-slate-800">{activeCoachesCount}</h3>
                            <span className="text-xs text-slate-400">Pelatih bertugas</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Total Belum Dicairkan</span>
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                <Banknote className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-black text-emerald-700">{formatCurrency(totalUnpaidCoachEarnings)}</h3>
                            <span className="text-xs text-emerald-600 font-semibold">Honor pelatih tertunda</span>
                        </div>
                    </div>
                </div>

                {/* ─── TABS NAVIGATION ─── */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => setActiveTab('individual')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
                                activeTab === 'individual' ? 'bg-orange-500 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <UserCheck size={16} /> Klien Individu
                        </button>
                        <button
                            onClick={() => setActiveTab('group')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
                                activeTab === 'group' ? 'bg-orange-500 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <Users size={16} /> Grup Latihan
                        </button>
                        <button
                            onClick={() => setActiveTab('coach')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
                                activeTab === 'coach' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <Banknote size={16} /> Rekap Pelatih (Honor & Bulanan)
                        </button>
                    </div>

                    {/* Month Filter (Active in Coach Tab) */}
                    {activeTab === 'coach' && computedAvailableMonths && computedAvailableMonths.length > 0 && (
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                            <Calendar className="w-4 h-4 text-indigo-500" />
                            <span className="text-xs font-bold text-slate-600">Filter Bulan:</span>
                            <select 
                                value={selectedMonth} 
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="text-xs font-bold text-slate-800 bg-slate-50 border-slate-200 rounded-md py-1 px-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="all">Semua Bulan</option>
                                {computedAvailableMonths.map(m => (
                                    <option key={m.key} value={m.key}>{m.label}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* ─── COACH MONTHLY STRIP CARDS (If Coach Tab is active) ─── */}
                {activeTab === 'coach' && computedMonthlySummary && computedMonthlySummary.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-indigo-600" /> Rekapitulasi Honor Pelatih Per Bulan
                            </h3>
                            <span className="text-xs text-slate-400">Total {computedMonthlySummary.length} Bulan Terekam</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {computedMonthlySummary.map((month) => {
                                const isSelected = selectedMonth === month.month_key;
                                return (
                                    <div 
                                        key={month.month_key}
                                        onClick={() => setSelectedMonth(isSelected ? 'all' : month.month_key)}
                                        className={`p-4 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                                            isSelected 
                                                ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-sm' 
                                                : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-black text-slate-900">{month.month_label}</span>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                                {month.total_sessions} Sesi
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-500">Total Honor:</span>
                                                <strong className="text-slate-900 font-extrabold">{formatCurrency(month.total_fee)}</strong>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-500">Belum Dicairkan:</span>
                                                <strong className={month.unpaid_fee > 0 ? "text-rose-600 font-black" : "text-emerald-600 font-bold"}>
                                                    {month.unpaid_fee > 0 ? formatCurrency(month.unpaid_fee) : 'Lunas'}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ─── MAIN TABLES ─── */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                    
                    {/* ── 1. INDIVIDUAL TAB ── */}
                    {activeTab === 'individual' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-5 py-3 w-10"></th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Atlet</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Paket Latihan</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Progress Sesi</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Belum Bayar</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredAthletes.length > 0 ? filteredAthletes.map(athlete => (
                                        <React.Fragment key={athlete.id}>
                                            <tr className="hover:bg-slate-50/60 transition-colors group">
                                                <td className="px-5 py-3.5">
                                                    <button onClick={() => toggleRow(`athlete-${athlete.id}`)} className="p-1 text-slate-400 hover:text-slate-800 rounded">
                                                        {expandedRows.has(`athlete-${athlete.id}`) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                                    </button>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex flex-col">
                                                        <span className="font-extrabold text-sm text-slate-900">{athlete.name}</span>
                                                        <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                                                            <Trophy className="w-3 h-3 text-slate-300" />
                                                            {athlete.sport?.name || '-'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    {athlete.package_name ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-bold">
                                                            <Package size={12} className="text-slate-400" />
                                                            {athlete.package_name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">Tanpa Paket</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    {renderProgressBar(athlete.unpaid_sessions, athlete.package_session_count)}
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    {athlete.unpaid_sessions > 0 ? (
                                                        <span className="inline-flex min-w-[2rem] px-2 py-1 rounded bg-orange-50 text-orange-700 font-bold text-xs border border-orange-200">
                                                            {athlete.unpaid_sessions}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-300">-</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    {athlete.unpaid_sessions > 0 ? (
                                                        <button
                                                            onClick={() => handlePayAthlete(athlete)}
                                                            disabled={processing}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 border border-orange-200"
                                                        >
                                                            <Banknote className="w-3.5 h-3.5" /> Tandai Lunas
                                                        </button>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                                            <CheckCircle2 size={14} /> Lunas
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                            {/* Expanded Details */}
                                            {expandedRows.has(`athlete-${athlete.id}`) && (
                                                <tr className="bg-slate-50/50">
                                                    <td colSpan="6" className="px-8 py-4 border-b border-slate-200/80">
                                                        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                                            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
                                                                Riwayat Sesi Latihan Atlet
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
                                                                                    <span className="font-bold text-slate-900 mr-2">Sesi {session.session_number}:</span>
                                                                                    <span className="text-slate-600">{session.name || 'Program Latihan'}</span>
                                                                                </td>
                                                                                <td className="px-4 py-3 text-slate-500">
                                                                                    {session.coaches.length > 0 ? session.coaches.join(', ') : '-'}
                                                                                </td>
                                                                                <td className="px-4 py-3 w-28">
                                                                                    {session.status === 'completed' ? (
                                                                                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Selesai</span>
                                                                                    ) : (
                                                                                        <span className="text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200">Terjadwal</span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-4 py-3 w-28 text-right">
                                                                                    {session.is_paid ? (
                                                                                        <span className="text-emerald-600 font-bold"><CheckCircle2 size={12} className="inline mr-1" /> Lunas</span>
                                                                                    ) : (
                                                                                        <span className="text-slate-400 font-bold">Belum Bayar</span>
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            ) : (
                                                                <div className="p-4 text-center text-xs text-slate-400 italic">Belum ada riwayat sesi.</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="px-5 py-8 text-center text-slate-400 text-sm font-medium italic">Tidak ada data atlet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ── 2. GROUP TAB ── */}
                    {activeTab === 'group' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-5 py-3 w-10"></th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Grup</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Anggota</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Paket Latihan</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Progress Sesi</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Belum Bayar</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredGroups.length > 0 ? filteredGroups.map(group => (
                                        <React.Fragment key={group.id}>
                                            <tr className="hover:bg-slate-50/60 transition-colors group/row">
                                                <td className="px-5 py-3.5">
                                                    <button onClick={() => toggleRow(`group-${group.id}`)} className="p-1 text-slate-400 hover:text-slate-800 rounded">
                                                        {expandedRows.has(`group-${group.id}`) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                                    </button>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="font-extrabold text-sm text-slate-900">{group.name}</span>
                                                </td>
                                                <td className="px-5 py-3.5">
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
                                                <td className="px-5 py-3.5">
                                                    {group.package_name ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-bold">
                                                            <Package size={12} className="text-slate-400" />
                                                            {group.package_name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">Tanpa Paket</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    {renderProgressBar(group.unpaid_sessions, group.package_session_count)}
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    {group.unpaid_sessions > 0 ? (
                                                        <span className="inline-flex min-w-[2rem] px-2 py-1 rounded bg-orange-50 text-orange-700 font-bold text-xs border border-orange-200">
                                                            {group.unpaid_sessions}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-300">-</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    {group.unpaid_sessions > 0 ? (
                                                        <button
                                                            onClick={() => handlePayGroup(group)}
                                                            disabled={processing}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 border border-orange-200"
                                                        >
                                                            <Banknote className="w-3.5 h-3.5" /> Tandai Lunas
                                                        </button>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                                            <CheckCircle2 size={14} /> Lunas
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                            {/* Expanded Details */}
                                            {expandedRows.has(`group-${group.id}`) && (
                                                <tr className="bg-slate-50/50">
                                                    <td colSpan="7" className="px-8 py-4 border-b border-slate-200/80">
                                                        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                                            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
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
                                                                                    <span className="font-bold text-slate-900 mr-2">Sesi {session.session_number}:</span>
                                                                                    <span className="text-slate-600">{session.name || 'Program Latihan Grup'}</span>
                                                                                </td>
                                                                                <td className="px-4 py-3 text-slate-500">
                                                                                    {session.coaches.length > 0 ? session.coaches.join(', ') : '-'}
                                                                                </td>
                                                                                <td className="px-4 py-3 w-28">
                                                                                    {session.status === 'completed' ? (
                                                                                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Selesai</span>
                                                                                    ) : (
                                                                                        <span className="text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200">Terjadwal</span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-4 py-3 w-28 text-right">
                                                                                    {session.is_paid ? (
                                                                                        <span className="text-emerald-600 font-bold"><CheckCircle2 size={12} className="inline mr-1" /> Lunas</span>
                                                                                    ) : (
                                                                                        <span className="text-slate-400 font-bold">Belum Bayar</span>
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            ) : (
                                                                <div className="p-4 text-center text-xs text-slate-400 italic">Belum ada riwayat sesi grup.</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    )) : (
                                        <tr>
                                            <td colSpan="7" className="px-5 py-8 text-center text-slate-400 text-sm font-medium italic">Tidak ada data grup.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ── 3. COACH TAB (WITH RICH MONTHLY BREAKDOWN) ── */}
                    {activeTab === 'coach' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-5 py-3 w-10"></th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Pelatih</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Sesi Individu</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Sesi Grup</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Jaga Gym</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Total Sesi</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Pencairan Terakhir</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Belum Dicairkan</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredCoaches.length > 0 ? filteredCoaches.map(coach => {
                                        const monthlyList = getCoachMonthlyBreakdown(coach);
                                        const allSessionsList = (coach.all_sessions && coach.all_sessions.length > 0) 
                                            ? coach.all_sessions 
                                            : (coach.sessions || []);
                                        const unpaidSessionsList = coach.sessions || allSessionsList.filter(s => !s.is_paid);

                                        // Compute monthly-specific metrics if a month is selected
                                        const currentMonthData = selectedMonth !== 'all' 
                                            ? monthlyList.find(m => m.month_key === selectedMonth)
                                            : null;

                                        const displayIndSessions = currentMonthData ? currentMonthData.individual_sessions : coach.individual_sessions;
                                        const displayGrpSessions = currentMonthData ? currentMonthData.group_sessions : coach.group_sessions;
                                        const displayGymSessions = currentMonthData ? currentMonthData.gym_sessions : (coach.gym_sessions || 0);
                                        const displayTotalSessions = currentMonthData ? currentMonthData.total_sessions : coach.total_sessions;
                                        const displayUnpaidEarnings = currentMonthData ? currentMonthData.unpaid_fee : coach.unpaid_earnings;

                                        const activeCoachView = expandedCoachTab[coach.id] || 'monthly';

                                        return (
                                            <React.Fragment key={coach.id}>
                                                <tr className="hover:bg-slate-50/60 transition-colors group/row">
                                                    <td className="px-5 py-4">
                                                        <button onClick={() => toggleRow(`coach-${coach.id}`)} className="p-1 text-slate-400 hover:text-slate-800 rounded">
                                                            {expandedRows.has(`coach-${coach.id}`) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                                        </button>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-xs shrink-0 border border-indigo-200">
                                                                {coach.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <span className="font-extrabold text-sm text-slate-900 block">{coach.name}</span>
                                                                <span className="text-[11px] text-slate-400 font-mono">@{coach.username || '-'}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <span className="inline-flex min-w-[2.2rem] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
                                                            {displayIndSessions}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <span className="inline-flex min-w-[2.2rem] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
                                                            {displayGrpSessions}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <span className="inline-flex min-w-[2.2rem] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
                                                            {displayGymSessions}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <span className="inline-flex min-w-[2.2rem] px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-black text-xs border border-indigo-200 shadow-sm">
                                                            {displayTotalSessions}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <span className="font-bold text-emerald-700 text-xs md:text-sm">{formatCurrency(coach.last_payout_amount || 0)}</span>
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        {displayUnpaidEarnings > 0 ? (
                                                            <span className="font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md text-xs border border-rose-200">
                                                                {formatCurrency(displayUnpaidEarnings)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                                                                Lunas
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <a
                                                                href={route('admin.reports.sessions.export-coach', coach.id)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition-all border border-slate-300 shadow-sm"
                                                                title="Export Laporan & Slip Honor PDF"
                                                            >
                                                                <FileText size={14} className="text-slate-500" /> PDF
                                                            </a>
                                                            {coach.unpaid_sessions > 0 ? (
                                                                <button
                                                                    onClick={() => handlePayCoach(coach)}
                                                                    disabled={processing}
                                                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-xs font-bold transition-all disabled:opacity-50 shadow-sm shadow-indigo-600/20"
                                                                >
                                                                    <Banknote className="w-3.5 h-3.5" /> Cairkan Honor
                                                                </button>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                                                                    <CheckCircle2 size={14} /> Lunas
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* ── Coach Expanded Details (Tabs for Monthly Recap & Session Details) ── */}
                                                {expandedRows.has(`coach-${coach.id}`) && (
                                                    <tr className="bg-slate-50/50">
                                                        <td colSpan="9" className="px-6 md:px-8 py-5 border-b border-slate-200/80">
                                                            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                                                
                                                                {/* Sub Tabs in Coach Drill-down */}
                                                                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <button
                                                                            onClick={() => setCoachDetailTab(coach.id, 'monthly')}
                                                                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                                                                                activeCoachView === 'monthly'
                                                                                    ? 'bg-indigo-600 text-white shadow-sm'
                                                                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                                                            }`}
                                                                        >
                                                                            📅 Rekapitulasi Per Bulan ({monthlyList.length} Bulan)
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setCoachDetailTab(coach.id, 'unpaid')}
                                                                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                                                                                activeCoachView === 'unpaid'
                                                                                    ? 'bg-indigo-600 text-white shadow-sm'
                                                                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                                                            }`}
                                                                        >
                                                                            📋 Sesi Belum Dicairkan ({unpaidSessionsList.length})
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setCoachDetailTab(coach.id, 'all')}
                                                                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                                                                                activeCoachView === 'all'
                                                                                    ? 'bg-indigo-600 text-white shadow-sm'
                                                                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                                                            }`}
                                                                        >
                                                                            🗂️ Seluruh Riwayat Sesi ({allSessionsList.length})
                                                                        </button>
                                                                    </div>

                                                                    <div className="flex items-center gap-3">
                                                                        <div className="text-xs font-bold text-slate-700">
                                                                            Pelatih: <span className="text-indigo-600">{coach.name}</span>
                                                                        </div>
                                                                        <a
                                                                            href={route('admin.reports.sessions.export-coach', coach.id)}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-bold text-slate-700 shadow-2xs"
                                                                        >
                                                                            <FileText size={12} className="text-indigo-600" /> Cetak Slip PDF
                                                                        </a>
                                                                    </div>
                                                                </div>

                                                                {/* ── Subview 1: MONTHLY BREAKDOWN TABLE ── */}
                                                                {activeCoachView === 'monthly' && (
                                                                    <div className="overflow-x-auto">
                                                                        {monthlyList.length > 0 ? (
                                                                            <table className="w-full text-left">
                                                                                <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                                                    <tr>
                                                                                        <th className="px-5 py-3">Bulan Periode</th>
                                                                                        <th className="px-5 py-3 text-center">Individu</th>
                                                                                        <th className="px-5 py-3 text-center">Grup</th>
                                                                                        <th className="px-5 py-3 text-center">Jaga Gym</th>
                                                                                        <th className="px-5 py-3 text-center">Total Sesi</th>
                                                                                        <th className="px-5 py-3 text-right">Total Honor</th>
                                                                                        <th className="px-5 py-3 text-right">Status Pencairan</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className="divide-y divide-slate-100 text-xs">
                                                                                    {monthlyList.map((mb) => {
                                                                                        const monthDetailKey = `${coach.id}-${mb.month_key}`;
                                                                                        const isMonthExpanded = expandedMonthDetail.has(monthDetailKey);

                                                                                        return (
                                                                                            <React.Fragment key={mb.month_key}>
                                                                                                <tr className="hover:bg-slate-50/80 transition-colors">
                                                                                                    <td className="px-5 py-3.5 font-extrabold text-slate-800">
                                                                                                        <div className="flex items-center gap-2">
                                                                                                            <button 
                                                                                                                onClick={() => toggleMonthDetail(monthDetailKey)}
                                                                                                                className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                                                                                                                title="Lihat rincian sesi bulan ini"
                                                                                                            >
                                                                                                                {isMonthExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                                                                            </button>
                                                                                                            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                                                                                                            <span>{mb.month_label}</span>
                                                                                                        </div>
                                                                                                    </td>
                                                                                                    <td className="px-5 py-3.5 text-center text-slate-600">{mb.individual_sessions}</td>
                                                                                                    <td className="px-5 py-3.5 text-center text-slate-600">{mb.group_sessions}</td>
                                                                                                    <td className="px-5 py-3.5 text-center text-slate-600">{mb.gym_sessions}</td>
                                                                                                    <td className="px-5 py-3.5 text-center">
                                                                                                        <span className="font-extrabold px-2.5 py-0.5 rounded bg-slate-100 text-slate-800">
                                                                                                            {mb.total_sessions}
                                                                                                        </span>
                                                                                                    </td>
                                                                                                    <td className="px-5 py-3.5 text-right font-black text-slate-900">
                                                                                                        {formatCurrency(mb.total_fee)}
                                                                                                    </td>
                                                                                                    <td className="px-5 py-3.5 text-right">
                                                                                                        {mb.unpaid_fee > 0 ? (
                                                                                                            <div className="inline-flex flex-col items-end">
                                                                                                                <span className="font-black text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200 text-[11px]">
                                                                                                                    Belum: {formatCurrency(mb.unpaid_fee)}
                                                                                                                </span>
                                                                                                                {mb.paid_fee > 0 && (
                                                                                                                    <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                                                                                                        Sudah: {formatCurrency(mb.paid_fee)}
                                                                                                                    </span>
                                                                                                                )}
                                                                                                            </div>
                                                                                                        ) : (
                                                                                                            <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 text-[11px] inline-flex items-center gap-1">
                                                                                                                <CheckCircle2 className="w-3 h-3" /> Lunas
                                                                                                            </span>
                                                                                                        )}
                                                                                                    </td>
                                                                                                </tr>

                                                                                                {/* Sub-row for Month Drill-down */}
                                                                                                {isMonthExpanded && (
                                                                                                    <tr className="bg-indigo-50/30">
                                                                                                        <td colSpan="7" className="px-6 md:px-8 py-3 border-b border-indigo-100">
                                                                                                            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs">
                                                                                                                <h4 className="text-[11px] font-black text-slate-700 mb-2.5 uppercase tracking-wide flex items-center gap-1.5">
                                                                                                                    <Calendar size={13} className="text-indigo-600" />
                                                                                                                    Daftar Sesi Periode {mb.month_label} ({mb.sessions.length} Sesi)
                                                                                                                </h4>
                                                                                                                <div className="divide-y divide-slate-100">
                                                                                                                    {mb.sessions.map((item, idx) => (
                                                                                                                        <div key={idx} className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50/80 px-2 rounded-md transition-colors gap-3">
                                                                                                                            <div className="flex items-center gap-2.5 min-w-0 flex-wrap sm:flex-nowrap">
                                                                                                                                <span className="font-mono text-slate-500 w-20 shrink-0 font-bold">
                                                                                                                                    {item.date ? new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
                                                                                                                                </span>
                                                                                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                                                                                                                                    item.type === 'Grup' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                                                                                                                                    item.type === 'Jaga Gym' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                                                                                                    'bg-blue-50 text-blue-700 border border-blue-200'
                                                                                                                                }`}>
                                                                                                                                    {item.type}
                                                                                                                                </span>

                                                                                                                                {/* Prominent Client / Athlete Badge */}
                                                                                                                                <div className="flex items-center gap-1 shrink-0">
                                                                                                                                    <span className="font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs border border-slate-200 flex items-center gap-1">
                                                                                                                                        <User size={11} className="text-slate-500" />
                                                                                                                                        {item.client_name || item.user_name || 'Klien'}
                                                                                                                                    </span>
                                                                                                                                </div>

                                                                                                                                {/* Program & Session Title */}
                                                                                                                                <span className="font-medium text-slate-700 truncate">
                                                                                                                                    {item.session_number ? <span className="font-bold text-indigo-600 mr-1">#{item.session_number}</span> : ''}
                                                                                                                                    {item.name}
                                                                                                                                </span>
                                                                                                                            </div>
                                                                                                                            <div className="flex items-center gap-3 shrink-0">
                                                                                                                                <span className="font-black text-slate-900">{formatCurrency(item.fee)}</span>
                                                                                                                                {item.is_paid ? (
                                                                                                                                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Lunas</span>
                                                                                                                                ) : (
                                                                                                                                    <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Belum</span>
                                                                                                                                )}
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    ))}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                )}
                                                                                            </React.Fragment>
                                                                                        );
                                                                                    })}
                                                                                </tbody>
                                                                            </table>
                                                                        ) : (
                                                                            <div className="p-6 text-center text-xs text-slate-400 italic">
                                                                                Belum ada rekapitulasi honor bulanan untuk pelatih ini.
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {/* ── Subview 2: UNPAID SESSIONS ── */}
                                                                {activeCoachView === 'unpaid' && (
                                                                    <div className="overflow-x-auto">
                                                                        {unpaidSessionsList.length > 0 ? (
                                                                            <table className="w-full text-left text-xs">
                                                                                <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                                                    <tr>
                                                                                        <th className="px-5 py-3 w-28">Tanggal</th>
                                                                                        <th className="px-5 py-3 w-24 text-center">Tipe Sesi</th>
                                                                                        <th className="px-5 py-3 w-40">Klien / Atlet / Grup</th>
                                                                                        <th className="px-5 py-3">Nama Sesi / Program</th>
                                                                                        <th className="px-5 py-3 w-24 text-center">Status</th>
                                                                                        <th className="px-5 py-3 w-28 text-right">Honor</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className="divide-y divide-slate-100">
                                                                                    {unpaidSessionsList.map(session => (
                                                                                        <tr key={session.id} className="hover:bg-slate-50 transition-colors">
                                                                                            <td className="px-5 py-3 font-semibold text-slate-700">
                                                                                                {session.date ? new Date(session.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                                                            </td>
                                                                                            <td className="px-5 py-3 text-center">
                                                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                                                                    session.type === 'Grup' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 
                                                                                                    session.type === 'Jaga Gym' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                                                                                                    'bg-blue-50 text-blue-700 border border-blue-200'
                                                                                                }`}>
                                                                                                    {session.type}
                                                                                                </span>
                                                                                            </td>
                                                                                            <td className="px-5 py-3">
                                                                                                <div className="font-black text-slate-900 flex items-center gap-1.5">
                                                                                                    <User size={13} className="text-slate-400" />
                                                                                                    {session.client_name || '-'}
                                                                                                </div>
                                                                                                {session.client_sport && (
                                                                                                    <div className="text-[10px] text-slate-400 font-medium pl-4">{session.client_sport}</div>
                                                                                                )}
                                                                                            </td>
                                                                                            <td className="px-5 py-3">
                                                                                                <div className="flex items-center">
                                                                                                    {session.session_number ? (
                                                                                                        <span className="font-bold text-slate-900 mr-2">Sesi {session.session_number}:</span>
                                                                                                    ) : (
                                                                                                        <span className="font-bold text-slate-900 mr-2">•</span>
                                                                                                    )}
                                                                                                    <span className="text-slate-700 font-medium">{session.name}</span>
                                                                                                </div>
                                                                                                {session.notes && (
                                                                                                    <div className="text-[11px] text-slate-500 mt-1 italic pl-3 border-l-2 border-slate-200">
                                                                                                        {session.notes}
                                                                                                    </div>
                                                                                                )}
                                                                                            </td>
                                                                                            <td className="px-5 py-3 text-center">
                                                                                                {session.status === 'completed' ? (
                                                                                                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">Selesai</span>
                                                                                                ) : (
                                                                                                    <span className="text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200 text-[10px]">Terjadwal</span>
                                                                                                )}
                                                                                            </td>
                                                                                            <td className="px-5 py-3 text-right font-black text-slate-900">
                                                                                                {formatCurrency(session.fee)}
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        ) : (
                                                                            <div className="p-6 text-center text-xs text-slate-400 italic">
                                                                                Semua sesi pada pelatih ini telah dicairkan (lunas).
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {/* ── Subview 3: ALL SESSIONS LOG ── */}
                                                                {activeCoachView === 'all' && (
                                                                    <div className="overflow-x-auto">
                                                                        {allSessionsList.length > 0 ? (
                                                                            <table className="w-full text-left text-xs">
                                                                                <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                                                    <tr>
                                                                                        <th className="px-5 py-3 w-28">Tanggal</th>
                                                                                        <th className="px-5 py-3 w-24 text-center">Tipe Sesi</th>
                                                                                        <th className="px-5 py-3 w-40">Klien / Atlet / Grup</th>
                                                                                        <th className="px-5 py-3">Nama Sesi / Program</th>
                                                                                        <th className="px-5 py-3 w-24 text-center">Status Sesi</th>
                                                                                        <th className="px-5 py-3 w-28 text-right">Honor</th>
                                                                                        <th className="px-5 py-3 w-24 text-right">Status Bayar</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className="divide-y divide-slate-100">
                                                                                    {allSessionsList.map(session => (
                                                                                        <tr key={session.id} className="hover:bg-slate-50 transition-colors">
                                                                                            <td className="px-5 py-3 font-semibold text-slate-700">
                                                                                                {session.date ? new Date(session.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                                                            </td>
                                                                                            <td className="px-5 py-3 text-center">
                                                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                                                                    session.type === 'Grup' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 
                                                                                                    session.type === 'Jaga Gym' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                                                                                                    'bg-blue-50 text-blue-700 border border-blue-200'
                                                                                                }`}>
                                                                                                    {session.type}
                                                                                                </span>
                                                                                            </td>
                                                                                            <td className="px-5 py-3">
                                                                                                <div className="font-black text-slate-900 flex items-center gap-1.5">
                                                                                                    <User size={13} className="text-slate-400" />
                                                                                                    {session.client_name || '-'}
                                                                                                </div>
                                                                                                {session.client_sport && (
                                                                                                    <div className="text-[10px] text-slate-400 font-medium pl-4">{session.client_sport}</div>
                                                                                                )}
                                                                                            </td>
                                                                                            <td className="px-5 py-3">
                                                                                                <div className="flex items-center">
                                                                                                    {session.session_number ? (
                                                                                                        <span className="font-bold text-slate-900 mr-2">Sesi {session.session_number}:</span>
                                                                                                    ) : (
                                                                                                        <span className="font-bold text-slate-900 mr-2">•</span>
                                                                                                    )}
                                                                                                    <span className="text-slate-700 font-medium">{session.name}</span>
                                                                                                </div>
                                                                                            </td>
                                                                                            <td className="px-5 py-3 text-center">
                                                                                                {session.status === 'completed' ? (
                                                                                                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">Selesai</span>
                                                                                                ) : (
                                                                                                    <span className="text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200 text-[10px]">Terjadwal</span>
                                                                                                )}
                                                                                            </td>
                                                                                            <td className="px-5 py-3 text-right font-black text-slate-900">
                                                                                                {formatCurrency(session.fee)}
                                                                                            </td>
                                                                                            <td className="px-5 py-3 text-right">
                                                                                                {session.is_paid ? (
                                                                                                    <span className="text-emerald-600 font-bold text-[11px] inline-flex items-center gap-1">
                                                                                                        <CheckCircle2 size={12} /> Lunas
                                                                                                    </span>
                                                                                                ) : (
                                                                                                    <span className="text-rose-600 font-bold text-[11px] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                                                                                        Belum
                                                                                                    </span>
                                                                                                )}
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        ) : (
                                                                            <div className="p-6 text-center text-xs text-slate-400 italic">
                                                                                Belum ada log sesi yang tercatat.
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan="9" className="px-5 py-8 text-center text-slate-400 text-sm font-medium italic">
                                                Tidak ada data pelatih untuk filter yang dipilih.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>

            </div>
        </AppLayout>
    );
}
