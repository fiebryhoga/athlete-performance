import React, { useState, useMemo, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PageHeader from '@/Components/Common/PageHeader';
import PageFooter from '@/Components/Common/PageFooter';
import { 
    Users, UsersRound, UserCheck, User, Activity, Search, Trophy, CheckCircle2, Calendar, 
    Banknote, ChevronDown, ChevronRight, Package, Dumbbell, Filter, 
    Clock, DollarSign, Layers, Eye, ShieldCheck, Sparkles, TrendingUp, FileText,
    X, AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function SessionRecap({ 
    athletes = [], 
    groups = [], 
    sharedPackages = [],
    sessionSummary = {}
}) {
    // Read from URL query param or localStorage
    const getInitialTab = () => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tabParam = params.get('tab');
            if (tabParam && ['individual', 'group', 'shared_package'].includes(tabParam)) {
                return tabParam;
            }
            const saved = localStorage.getItem('session_recap_client_active_tab');
            if (saved && ['individual', 'group', 'shared_package'].includes(saved)) {
                return saved;
            }
        }
        return 'individual';
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'unpaid' | 'paid'
    const [expandedRows, setExpandedRows] = useState(new Set());

    // Sync activeTab to localStorage and URL query param
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('session_recap_client_active_tab', activeTab);
            const url = new URL(window.location.href);
            url.searchParams.set('tab', activeTab);
            window.history.replaceState({}, '', url.toString());
        }
    }, [activeTab]);

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

    // Filter Athletes (Individual)
    const filteredAthletes = useMemo(() => {
        return athletes.filter(a => {
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchName = a.name?.toLowerCase().includes(q);
                const matchSport = a.sport?.name?.toLowerCase().includes(q);
                const matchPackage = a.package_name?.toLowerCase().includes(q);
                if (!matchName && !matchSport && !matchPackage) return false;
            }
            if (statusFilter === 'unpaid') {
                if ((a.unpaid_sessions || 0) <= 0) return false;
            } else if (statusFilter === 'paid') {
                if ((a.unpaid_sessions || 0) > 0) return false;
            }
            return true;
        });
    }, [athletes, searchQuery, statusFilter]);

    // Filter Groups
    const filteredGroups = useMemo(() => {
        return groups.filter(g => {
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchName = g.name?.toLowerCase().includes(q);
                const matchPackage = g.package_name?.toLowerCase().includes(q);
                const matchMember = g.member_names?.some(m => m.toLowerCase().includes(q));
                if (!matchName && !matchPackage && !matchMember) return false;
            }
            if (statusFilter === 'unpaid') {
                if ((g.unpaid_sessions || 0) <= 0) return false;
            } else if (statusFilter === 'paid') {
                if ((g.unpaid_sessions || 0) > 0) return false;
            }
            return true;
        });
    }, [groups, searchQuery, statusFilter]);

    // Filter Shared Packages
    const filteredSharedPackages = useMemo(() => {
        return sharedPackages.filter(sp => {
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchName = sp.name?.toLowerCase().includes(q);
                const matchPackage = sp.package_name?.toLowerCase().includes(q);
                const matchMember = sp.member_names?.some(m => m.toLowerCase().includes(q));
                if (!matchName && !matchPackage && !matchMember) return false;
            }
            if (statusFilter === 'unpaid') {
                if ((sp.unpaid_sessions || 0) <= 0) return false;
            } else if (statusFilter === 'paid') {
                if ((sp.unpaid_sessions || 0) > 0) return false;
            }
            return true;
        });
    }, [sharedPackages, searchQuery, statusFilter]);

    // Handle Payment Actions
    const handlePayAthlete = (athlete) => {
        Swal.fire({
            title: 'Konfirmasi Pelunasan',
            html: `Tandai seluruh sesi belum bayar untuk atlet <b>${athlete.name}</b> (${athlete.unpaid_sessions} sesi) sebagai lunas?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ea580c',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Tandai Lunas',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                post(route('admin.reports.pay-athlete', athlete.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire('Berhasil!', 'Sesi atlet berhasil ditandai lunas.', 'success');
                    }
                });
            }
        });
    };

    const handlePayGroup = (group) => {
        Swal.fire({
            title: 'Konfirmasi Pelunasan Grup',
            html: `Tandai seluruh sesi belum bayar untuk grup <b>${group.name}</b> (${group.unpaid_sessions} sesi) sebagai lunas?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ea580c',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Tandai Lunas',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                post(route('admin.reports.pay-group', group.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire('Berhasil!', 'Sesi grup berhasil ditandai lunas.', 'success');
                    }
                });
            }
        });
    };

    const handlePaySharedPackage = (sp) => {
        Swal.fire({
            title: 'Konfirmasi Pelunasan Paket Bersama',
            html: `Tandai seluruh sesi belum bayar untuk paket bersama <b>${sp.name}</b> (${sp.unpaid_sessions} sesi) sebagai lunas?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ea580c',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Tandai Lunas',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                post(route('admin.reports.pay-shared-package', sp.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire('Berhasil!', 'Sesi paket bersama berhasil ditandai lunas.', 'success');
                    }
                });
            }
        });
    };

    // Helper render progress bar
    const renderProgressBar = (usedCount, totalQuota, packageType) => {
        if (!totalQuota) {
            return (
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-700">{usedCount || 0} Sesi</span>
                    <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5 bg-slate-100 rounded">Tanpa Paket</span>
                </div>
            );
        }

        const percentage = Math.min(100, Math.round(((usedCount || 0) / totalQuota) * 100));
        let colorClass = 'bg-emerald-500';
        if (percentage >= 100) colorClass = 'bg-rose-500';
        else if (percentage >= 75) colorClass = 'bg-orange-500';
        else if (percentage >= 50) colorClass = 'bg-amber-500';

        return (
            <div className="w-full max-w-[160px] space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-700">
                    <span>Sesi {usedCount || 0}/{totalQuota}</span>
                    <span className="text-slate-400 font-medium">{percentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${colorClass}`} style={{ width: `${percentage}%` }} />
                </div>
            </div>
        );
    };

    return (
        <AppLayout title="Rekap Sesi">
            <Head title="Rekap Sesi & Pelunasan Klien" />

            <div className="space-y-4 pb-12 max-w-[1600px] mx-auto">
                {/* ─── PAGE HEADER ─── */}
                <PageHeader
                    title="Rekap Sesi Latihan"
                    description="Rekapitulasi dan pelunasan sesi latihan klien individu, grup latihan, dan paket bersama."
                />

                {/* ─── KPI SUMMARY CARDS ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Total Unpaid */}
                    <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500">Total Sesi Belum Lunas</span>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${sessionSummary.total_unpaid > 0 ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                <AlertCircle className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className={`text-xl font-black ${sessionSummary.total_unpaid > 0 ? 'text-orange-600' : 'text-emerald-700'}`}>
                                {sessionSummary.total_unpaid || 0} Sesi
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Akumulasi seluruh sesi yang belum ditandai lunas</p>
                    </div>

                    {/* Individual Client */}
                    <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500">Klien Individu</span>
                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                                <UserCheck className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-xl font-black text-slate-900">
                                {sessionSummary.total_individual || 0} Sesi
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                            {sessionSummary.unpaid_individual || 0} sesi belum lunas • {athletes.length} atlet terdaftar
                        </p>
                    </div>

                    {/* Group Trainings */}
                    <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500">Grup Latihan</span>
                            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-xl font-black text-slate-900">
                                {sessionSummary.total_group || 0} Sesi
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                            {sessionSummary.unpaid_group || 0} sesi belum lunas • {groups.length} grup aktif
                        </p>
                    </div>

                    {/* Shared Packages */}
                    <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500">Paket Bersama</span>
                            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                                <UsersRound className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-xl font-black text-slate-900">
                                {sessionSummary.total_shared || 0} Sesi
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                            {sessionSummary.unpaid_shared || 0} sesi belum lunas • {sharedPackages.length} paket bersama
                        </p>
                    </div>
                </div>

                {/* ─── TABS NAVIGATION & SEARCH ─── */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-1.5 p-1 bg-slate-100/70 border border-slate-200/60 rounded-md">
                        <button
                            type="button"
                            onClick={() => setActiveTab('individual')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                activeTab === 'individual' 
                                    ? 'bg-white text-orange-600 shadow-2xs border border-slate-200/70' 
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                            }`}
                        >
                            <UserCheck size={13.5} />
                            <span>Klien Individu ({athletes.length})</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('group')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                activeTab === 'group' 
                                    ? 'bg-white text-orange-600 shadow-2xs border border-slate-200/70' 
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                            }`}
                        >
                            <Users size={13.5} />
                            <span>Grup Latihan ({groups.length})</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('shared_package')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                activeTab === 'shared_package' 
                                    ? 'bg-white text-orange-700 shadow-2xs border border-slate-200/70' 
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                            }`}
                        >
                            <UsersRound size={13.5} />
                            <span>Paket Bersama ({sharedPackages.length})</span>
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Status Filter */}
                        <div className="inline-flex p-0.5 bg-slate-100 rounded-md border border-slate-200/60 text-[11px]">
                            <button
                                type="button"
                                onClick={() => setStatusFilter('all')}
                                className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                                    statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                Semua
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('unpaid')}
                                className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                                    statusFilter === 'unpaid' ? 'bg-white text-orange-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                Belum Bayar
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('paid')}
                                className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                                    statusFilter === 'paid' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                Lunas
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-44">
                            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama / paket..."
                                className="w-full pl-8 pr-6 py-1 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-2xs"
                            />
                            {searchQuery && (
                                <button type="button" onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ─── MAIN TABLES ─── */}
                <div className="bg-white border border-slate-200/90 rounded-lg shadow-2xs overflow-hidden">
                    
                    {/* ── 1. INDIVIDUAL TAB ── */}
                    {activeTab === 'individual' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead className="bg-slate-50/70 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-4 py-2.5 w-10"></th>
                                        <th className="px-4 py-2.5">Nama Atlet</th>
                                        <th className="px-4 py-2.5">Paket Latihan</th>
                                        <th className="px-4 py-2.5">Progress Sesi Latihan</th>
                                        <th className="px-4 py-2.5 text-center">Belum Bayar</th>
                                        <th className="px-4 py-2.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {filteredAthletes.length > 0 ? filteredAthletes.map(athlete => (
                                        <React.Fragment key={athlete.id}>
                                            <tr className="hover:bg-slate-50/60 transition-colors group">
                                                <td className="px-4 py-3">
                                                    <button onClick={() => toggleRow(`athlete-${athlete.id}`)} className="p-1 text-slate-400 hover:text-slate-800 rounded cursor-pointer">
                                                        {expandedRows.has(`athlete-${athlete.id}`) ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col">
                                                        <Link 
                                                            href={route('admin.individual-trainings.show', athlete.id)}
                                                            className="font-bold text-xs text-slate-900 hover:text-orange-600 transition-colors"
                                                        >
                                                            {athlete.name}
                                                        </Link>
                                                        <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 mt-0.5">
                                                            <Trophy className="w-2.5 h-2.5 text-slate-300" />
                                                            {athlete.sport?.name || '-'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {athlete.is_shared_package ? (
                                                        <Link
                                                            href={route('admin.shared-packages.show', athlete.shared_package_id)}
                                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-orange-50 text-orange-700 border border-orange-200/80 hover:bg-orange-100 transition-colors"
                                                        >
                                                            <UsersRound size={11} className="text-orange-600" />
                                                            <span>Bersama ({athlete.package_name})</span>
                                                        </Link>
                                                    ) : athlete.package_name ? (
                                                        <span className="text-slate-700 text-xs font-semibold">
                                                            {athlete.package_name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">Tanpa Paket</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {renderProgressBar(athlete.sessions_used, athlete.package_session_count, athlete.package_type)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {athlete.unpaid_sessions > 0 ? (
                                                        <span className="font-bold text-orange-600 text-xs">
                                                            {athlete.unpaid_sessions} Sesi
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-300">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Link
                                                            href={route('admin.individual-trainings.show', athlete.id)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md text-xs font-semibold shadow-2xs transition-colors"
                                                        >
                                                            <Eye size={12} /> Sesi
                                                        </Link>
                                                        {athlete.unpaid_sessions > 0 ? (
                                                            <button
                                                                onClick={() => handlePayAthlete(athlete)}
                                                                disabled={processing}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 text-white hover:bg-orange-700 rounded-md text-xs font-semibold transition-all disabled:opacity-50 shadow-2xs cursor-pointer"
                                                            >
                                                                <Banknote className="w-3.5 h-3.5" /> Tandai Lunas
                                                            </button>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                                                <CheckCircle2 size={13} /> Lunas
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Expanded Details */}
                                            {expandedRows.has(`athlete-${athlete.id}`) && (
                                                <tr className="bg-slate-50/40">
                                                    <td colSpan="6" className="px-6 py-3 border-b border-slate-100">
                                                        <div className="bg-white border border-slate-200/80 rounded-md overflow-hidden shadow-2xs">
                                                            <div className="px-3.5 py-2 bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-800">
                                                                Riwayat Sesi Latihan Atlet (Belum Bayar)
                                                            </div>
                                                            {athlete.sessions && athlete.sessions.length > 0 ? (
                                                                <table className="w-full text-left">
                                                                    <tbody className="divide-y divide-slate-100 text-xs">
                                                                        {athlete.sessions.map(session => (
                                                                            <tr key={session.id} className="hover:bg-slate-50/60 transition-colors">
                                                                                <td className="px-3.5 py-2 font-medium text-slate-600 w-32 border-r border-slate-50">
                                                                                    {session.date ? new Date(session.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                                                </td>
                                                                                <td className="px-3.5 py-2">
                                                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                                                        <span className="font-bold text-slate-900">
                                                                                            {session.session_number ? `Sesi ${session.session_number}:` : '•'}
                                                                                        </span>
                                                                                        <span className="text-slate-700">{session.name || 'Program Latihan'}</span>
                                                                                        {session.is_shared && (
                                                                                            <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200/70">
                                                                                                Paket Bersama ({session.shared_package_name})
                                                                                            </span>
                                                                                        )}
                                                                                        {session.is_extra && (
                                                                                            <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200/60">
                                                                                                Sesi Tambahan
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                </td>
                                                                                <td className="px-3.5 py-2 text-slate-500">
                                                                                    {session.coaches.length > 0 ? session.coaches.join(', ') : '-'}
                                                                                </td>
                                                                                <td className="px-3.5 py-2 w-28">
                                                                                    {session.status === 'completed' ? (
                                                                                        <span className="text-emerald-600 font-semibold inline-flex items-center gap-1 text-[11px]">
                                                                                            <CheckCircle2 size={12} /> Selesai
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span className="text-amber-600 font-semibold text-[11px]">
                                                                                            Terjadwal
                                                                                        </span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-3.5 py-2 w-28 text-right">
                                                                                    {session.is_paid ? (
                                                                                        <span className="text-emerald-600 font-semibold text-xs inline-flex items-center gap-1">
                                                                                            <CheckCircle2 size={12} /> Lunas
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span className="text-rose-600 font-semibold text-xs">Belum Bayar</span>
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            ) : (
                                                                <div className="p-4 text-center text-xs text-slate-400 italic">Belum ada riwayat sesi belum bayar.</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="px-5 py-8 text-center text-slate-400 text-xs font-medium italic">Tidak ada data atlet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ── 2. GROUP TAB ── */}
                    {activeTab === 'group' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead className="bg-slate-50/70 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-4 py-2.5 w-10"></th>
                                        <th className="px-4 py-2.5">Nama Grup</th>
                                        <th className="px-4 py-2.5">Paket Latihan</th>
                                        <th className="px-4 py-2.5">Progress Sesi</th>
                                        <th className="px-4 py-2.5 text-center">Belum Bayar</th>
                                        <th className="px-4 py-2.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {filteredGroups.length > 0 ? filteredGroups.map(group => (
                                        <React.Fragment key={group.id}>
                                            <tr className="hover:bg-slate-50/60 transition-colors group">
                                                <td className="px-4 py-3">
                                                    <button onClick={() => toggleRow(`group-${group.id}`)} className="p-1 text-slate-400 hover:text-slate-800 rounded cursor-pointer">
                                                        {expandedRows.has(`group-${group.id}`) ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-xs text-slate-900">{group.name}</span>
                                                        <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 mt-0.5">
                                                            <Users className="w-2.5 h-2.5 text-slate-300" />
                                                            {group.members_count || 0} Anggota ({group.member_names?.join(', ') || '-'})
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {group.package_name ? (
                                                        <span className="text-slate-700 text-xs font-medium">
                                                            {group.package_name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">Tanpa Paket</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {renderProgressBar(group.unpaid_sessions, group.package_session_count, group.package_type)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {group.unpaid_sessions > 0 ? (
                                                        <span className="font-bold text-orange-600 text-xs">
                                                            {group.unpaid_sessions} Sesi
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-300">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {group.unpaid_sessions > 0 ? (
                                                        <button
                                                            onClick={() => handlePayGroup(group)}
                                                            disabled={processing}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 text-white hover:bg-orange-700 rounded-md text-xs font-semibold transition-all disabled:opacity-50 shadow-2xs cursor-pointer"
                                                        >
                                                            <Banknote className="w-3.5 h-3.5" /> Tandai Lunas
                                                        </button>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                                            <CheckCircle2 size={13} /> Lunas
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                            {/* Expanded Group Details */}
                                            {expandedRows.has(`group-${group.id}`) && (
                                                <tr className="bg-slate-50/40">
                                                    <td colSpan="6" className="px-6 py-3 border-b border-slate-100">
                                                        <div className="bg-white border border-slate-200/80 rounded-md overflow-hidden shadow-2xs">
                                                            <div className="px-3.5 py-2 bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-800">
                                                                Riwayat Sesi Latihan Grup (Belum Bayar)
                                                            </div>
                                                            {group.sessions && group.sessions.length > 0 ? (
                                                                <table className="w-full text-left">
                                                                    <tbody className="divide-y divide-slate-100 text-xs">
                                                                        {group.sessions.map(session => (
                                                                            <tr key={session.id} className="hover:bg-slate-50/60 transition-colors">
                                                                                <td className="px-3.5 py-2 font-medium text-slate-600 w-32 border-r border-slate-50">
                                                                                    {session.date ? new Date(session.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                                                </td>
                                                                                <td className="px-3.5 py-2">
                                                                                    <div className="flex items-center gap-1.5">
                                                                                        <span className="font-bold text-slate-900">
                                                                                            {session.session_number ? `Sesi ${session.session_number}:` : '•'}
                                                                                        </span>
                                                                                        <span className="text-slate-700">{session.name || 'Latihan Grup'}</span>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="px-3.5 py-2 text-slate-500">
                                                                                    {session.coaches?.length > 0 ? session.coaches.join(', ') : '-'}
                                                                                </td>
                                                                                <td className="px-3.5 py-2 w-28">
                                                                                    {session.status === 'completed' ? (
                                                                                        <span className="text-emerald-600 font-semibold inline-flex items-center gap-1 text-[11px]">
                                                                                            <CheckCircle2 size={12} /> Selesai
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span className="text-amber-600 font-semibold text-[11px]">
                                                                                            Terjadwal
                                                                                        </span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-3.5 py-2 w-28 text-right">
                                                                                    {session.is_paid ? (
                                                                                        <span className="text-emerald-600 font-semibold text-xs inline-flex items-center gap-1">
                                                                                            <CheckCircle2 size={12} /> Lunas
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span className="text-rose-600 font-semibold text-xs">Belum Bayar</span>
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            ) : (
                                                                <div className="p-4 text-center text-xs text-slate-400 italic">Belum ada sesi belum bayar.</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="px-5 py-8 text-center text-slate-400 text-xs font-medium italic">Tidak ada data grup.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ── 3. SHARED PACKAGE TAB ── */}
                    {activeTab === 'shared_package' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead className="bg-slate-50/70 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-4 py-2.5 w-10"></th>
                                        <th className="px-4 py-2.5">Nama Paket Bersama</th>
                                        <th className="px-4 py-2.5">Paket Master</th>
                                        <th className="px-4 py-2.5">Penggunaan Kuota Pool</th>
                                        <th className="px-4 py-2.5 text-center">Belum Bayar</th>
                                        <th className="px-4 py-2.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {filteredSharedPackages.length > 0 ? filteredSharedPackages.map(sp => (
                                        <React.Fragment key={sp.id}>
                                            <tr className="hover:bg-slate-50/60 transition-colors group">
                                                <td className="px-4 py-3">
                                                    <button onClick={() => toggleRow(`sp-${sp.id}`)} className="p-1 text-slate-400 hover:text-slate-800 rounded cursor-pointer">
                                                        {expandedRows.has(`sp-${sp.id}`) ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col">
                                                        <Link 
                                                            href={route('admin.shared-packages.show', sp.id)}
                                                            className="font-bold text-xs text-slate-900 hover:text-orange-600 transition-colors flex items-center gap-1"
                                                        >
                                                            <span>{sp.name}</span>
                                                            <Eye size={12} className="opacity-0 group-hover:opacity-100 text-orange-500 transition-opacity" />
                                                        </Link>
                                                        <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 mt-0.5">
                                                            <UsersRound className="w-2.5 h-2.5 text-orange-500" />
                                                            {sp.members_count || 0} Anggota ({sp.member_names?.join(', ') || '-'})
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-orange-50 text-orange-700 border border-orange-200/60">
                                                        <Package size={11} className="text-orange-600" />
                                                        {sp.package_name || 'Paket Bersama'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {renderProgressBar(sp.used_sessions || sp.unpaid_sessions, sp.package_session_count, sp.package_type)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {sp.unpaid_sessions > 0 ? (
                                                        <span className="font-bold text-orange-700 text-xs">
                                                            {sp.unpaid_sessions} Sesi
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-300">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Link
                                                            href={route('admin.shared-packages.show', sp.id)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-orange-50 text-slate-600 hover:text-orange-700 border border-slate-200 rounded-md text-xs font-semibold shadow-2xs transition-colors"
                                                        >
                                                            <Eye size={12} /> Detail
                                                        </Link>
                                                        {sp.unpaid_sessions > 0 ? (
                                                            <button
                                                                onClick={() => handlePaySharedPackage(sp)}
                                                                disabled={processing}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 text-white hover:bg-orange-700 rounded-md text-xs font-bold transition-all disabled:opacity-50 shadow-2xs cursor-pointer"
                                                            >
                                                                <Banknote className="w-3.5 h-3.5" /> Tandai Lunas
                                                            </button>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                                                <CheckCircle2 size={13} /> Lunas
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Expanded Shared Package Details */}
                                            {expandedRows.has(`sp-${sp.id}`) && (
                                                <tr className="bg-slate-50/40">
                                                    <td colSpan="6" className="px-6 py-3 border-b border-slate-100">
                                                        <div className="bg-white border border-slate-200/80 rounded-md overflow-hidden shadow-2xs space-y-2">
                                                            {/* Member breakdown */}
                                                            {sp.member_usage && sp.member_usage.length > 0 && (
                                                                <div className="p-3 bg-orange-50/40 border-b border-slate-100">
                                                                    <span className="text-[11px] font-bold text-slate-700 block mb-2">
                                                                        Kontribusi Pemakaian Sesi per Anggota:
                                                                    </span>
                                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                                        {sp.member_usage.map(mu => (
                                                                            <div key={mu.id} className="bg-white p-2 rounded border border-slate-200 text-xs">
                                                                                <span className="font-bold text-slate-800 block truncate">{mu.name}</span>
                                                                                <span className="text-orange-600 font-bold text-[11px]">{mu.sessions_used} sesi terpakai</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="px-3.5 py-2 bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-800">
                                                                Riwayat Sesi Latihan Paket Bersama (Belum Bayar)
                                                            </div>
                                                            {sp.sessions && sp.sessions.length > 0 ? (
                                                                <table className="w-full text-left">
                                                                    <tbody className="divide-y divide-slate-100 text-xs">
                                                                        {sp.sessions.map(session => (
                                                                            <tr key={session.id} className="hover:bg-slate-50/60 transition-colors">
                                                                                <td className="px-3.5 py-2 font-medium text-slate-600 w-32 border-r border-slate-50">
                                                                                    {session.date ? new Date(session.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                                                </td>
                                                                                <td className="px-3.5 py-2">
                                                                                    <div className="flex items-center gap-1.5">
                                                                                        <span className="font-bold text-orange-700 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-100 text-[11px]">
                                                                                            Sesi #{session.session_number || '1'}
                                                                                        </span>
                                                                                        <span className="font-bold text-slate-900">{session.athlete_name}</span>
                                                                                        <span className="text-slate-500">• {session.name || 'Latihan'}</span>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="px-3.5 py-2 text-slate-500">
                                                                                    {session.coaches?.length > 0 ? session.coaches.join(', ') : '-'}
                                                                                </td>
                                                                                <td className="px-3.5 py-2 w-28">
                                                                                    {session.status === 'completed' ? (
                                                                                        <span className="text-emerald-600 font-semibold inline-flex items-center gap-1 text-[11px]">
                                                                                            <CheckCircle2 size={12} /> Selesai
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span className="text-amber-600 font-semibold text-[11px]">
                                                                                            Terjadwal
                                                                                        </span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-3.5 py-2 w-28 text-right">
                                                                                    {session.is_paid ? (
                                                                                        <span className="text-emerald-600 font-semibold text-xs inline-flex items-center gap-1">
                                                                                            <CheckCircle2 size={12} /> Lunas
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span className="text-rose-600 font-semibold text-xs">Belum Bayar</span>
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            ) : (
                                                                <div className="p-4 text-center text-xs text-slate-400 italic">Belum ada sesi belum bayar.</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="px-5 py-8 text-center text-slate-400 text-xs font-medium italic">Tidak ada data paket bersama.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <PageFooter className="!mt-8 !pt-4 !pb-1" />
            </div>
        </AppLayout>
    );
}
