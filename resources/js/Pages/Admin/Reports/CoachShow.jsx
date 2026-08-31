import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Common/PageHeader';
import PageFooter from '@/Components/Common/PageFooter';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import {
    ChevronLeft,
    Banknote,
    Printer,
    CheckCircle2,
    Clock,
    AlertCircle,
    Calendar,
    Users,
    User,
    Dumbbell,
    Layers,
    ShieldCheck,
    Search,
    X,
    Building2,
    DollarSign,
    ArrowUpRight,
    Sparkles,
    Mail,
    Phone,
    TrendingUp,
    FileSpreadsheet
} from 'lucide-react';

function getInitials(name) {
    if (!name) return "??";
    const words = name.trim().split(" ");
    if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
}

function formatCurrency(val) {
    if (!val && val !== 0) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function CoachShow({
    coach = {},
    stats = {},
    monthly_breakdown = [],
    unpaid_sessions = [],
    all_sessions = []
}) {
    const [activeTab, setActiveTab] = useState('monthly'); // 'monthly' | 'unpaid' | 'all'
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'Individu' | 'Grup' | 'Jaga Gym'
    const [processing, setProcessing] = useState(false);

    // Filtered list for "all" and "unpaid" tabs
    const displayedSessions = useMemo(() => {
        const sourceList = activeTab === 'unpaid' ? unpaid_sessions : all_sessions;
        return sourceList.filter(s => {
            if (typeFilter !== 'all' && s.type !== typeFilter) return false;
            if (searchTerm.trim()) {
                const q = searchTerm.toLowerCase();
                const matchClient = s.client_name?.toLowerCase().includes(q);
                const matchName = s.name?.toLowerCase().includes(q);
                const matchNotes = s.notes?.toLowerCase().includes(q);
                if (!matchClient && !matchName && !matchNotes) return false;
            }
            return true;
        });
    }, [activeTab, unpaid_sessions, all_sessions, typeFilter, searchTerm]);

    const handlePayCoach = () => {
        if (!stats.unpaid_earnings || stats.unpaid_earnings <= 0) {
            Swal.fire({
                icon: 'info',
                title: 'Tidak Ada Tagihan',
                text: `Semua sesi kepelatihan untuk Coach ${coach.name} sudah tercatat lunas.`,
                confirmButtonColor: '#ea580c',
            });
            return;
        }

        Swal.fire({
            title: 'Cairkan Honor Pelatih?',
            html: `
                <div class="text-left text-xs space-y-2 p-3 bg-slate-50 rounded border border-slate-200">
                    <div><strong>Pelatih:</strong> ${coach.name}</div>
                    <div><strong>Total Honor Dicairkan:</strong> <span class="text-emerald-700 font-bold">${formatCurrency(stats.unpaid_earnings)}</span></div>
                    <div><strong>Jumlah Sesi:</strong> ${stats.unpaid_sessions_count || 0} sesi pending</div>
                </div>
                <p class="text-xs text-slate-500 mt-3">Tindakan ini akan menandai seluruh sesi belum dibayar coach ini sebagai lunas dan mencatat riwayat payout.</p>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ea580c',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Cairkan Honor',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                setProcessing(true);
                router.post(route('admin.reports.pay-coach', coach.id), {}, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setProcessing(false);
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil Dicairkan!',
                            text: `Honor untuk Coach ${coach.name} sebesar ${formatCurrency(stats.unpaid_earnings)} berhasil dicairkan.`,
                            confirmButtonColor: '#ea580c',
                        });
                    },
                    onError: () => {
                        setProcessing(false);
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal',
                            text: 'Terjadi kesalahan saat memproses pencairan.',
                            confirmButtonColor: '#ea580c',
                        });
                    }
                });
            }
        });
    };

    const handleExportPdf = (monthKey = null) => {
        let url = route('admin.reports.coaches.export-pdf', coach.id);
        if (monthKey && monthKey !== 'all') {
            url += `?month=${monthKey}`;
        }
        window.open(url, '_blank');
    };

    const hasUnpaid = (stats.unpaid_earnings || 0) > 0;

    return (
        <AppLayout title={`Detail Honor: ${coach.name}`}>
            <Head title={`Detail Honor Pelatih - ${coach.name}`} />

            <div className="space-y-4 pb-12 max-w-[1600px] mx-auto">
                {/* ─── PAGE HEADER ─── */}
                <PageHeader
                    title={coach.name}
                    description="Rincian sesi kepelatihan, rekap honor bulanan, shift jaga gym, dan pencairan honor."
                    actions={
                        <div className="flex flex-wrap items-center gap-2">
                            <Link
                                href={route('admin.reports.coaches')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                <span>Kembali ke Rekap Pelatih</span>
                            </Link>

                            <button
                                type="button"
                                onClick={() => handleExportPdf(null)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-orange-700 rounded-md text-xs font-bold shadow-2xs transition-all cursor-pointer"
                            >
                                <Printer className="w-3.5 h-3.5 text-slate-500" />
                                <span>Cetak Semua Slip PDF</span>
                            </button>

                            {hasUnpaid && (
                                <button
                                    type="button"
                                    onClick={handlePayCoach}
                                    disabled={processing}
                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-xs font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                                >
                                    <Banknote className="w-3.5 h-3.5" />
                                    <span>Cairkan Honor ({formatCurrency(stats.unpaid_earnings)})</span>
                                </button>
                            )}
                        </div>
                    }
                />

                {/* ─── 2-COLUMN LAYOUT (KANAN - KIRI) ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    
                    {/* ═══════════════════════════════════════════════════════
                        KOLOM KIRI (4.5 Kolom di LG) — Profil & Ringkasan Honor
                       ═══════════════════════════════════════════════════════ */}
                    <div className="lg:col-span-4 xl:col-span-4 space-y-4">
                        
                        {/* 1. KARTU PROFIL PELATIH */}
                        <div className="bg-white border border-slate-200/90 rounded-lg shadow-2xs overflow-hidden">
                            <div className="p-4 bg-gradient-to-br from-orange-50/60 via-white to-amber-50/30 border-b border-slate-100 flex items-start gap-3">
                                <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-2xs overflow-hidden border border-orange-600">
                                    {coach.profile_photo_url ? (
                                        <img src={coach.profile_photo_url} alt={coach.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{getInitials(coach.name)}</span>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <h3 className="font-bold text-sm text-slate-900 truncate">{coach.name}</h3>
                                        <span className="inline-flex items-center px-2 py-0.2 rounded text-[10px] font-bold bg-orange-100/80 text-orange-800 border border-orange-200/70">
                                            Pelatih OTS
                                        </span>
                                    </div>
                                    <div className="space-y-0.5 mt-1.5 text-[11px] text-slate-500">
                                        {coach.email && (
                                            <div className="flex items-center gap-1.5 truncate">
                                                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                                <span className="truncate">{coach.email}</span>
                                            </div>
                                        )}
                                        {coach.phone && (
                                            <div className="flex items-center gap-1.5">
                                                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                                <span>{coach.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-3.5 space-y-2.5 bg-slate-50/40 text-xs">
                                <div className="flex items-center justify-between py-1 px-2.5 bg-white rounded border border-slate-200/60">
                                    <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                                        <Building2 className="w-3.5 h-3.5 text-orange-500" />
                                        Honor Shift Jaga Gym
                                    </span>
                                    <span className="font-bold text-slate-800">
                                        {formatCurrency(coach.effective_gym_fee || 0)} <span className="text-[10px] text-slate-400 font-normal">/ shift</span>
                                    </span>
                                </div>

                                {stats.last_payout && (
                                    <div className="flex items-center justify-between py-1 px-2.5 bg-white rounded border border-slate-200/60 text-[11px]">
                                        <span className="text-slate-500">Pencairan Terakhir:</span>
                                        <span className="font-semibold text-slate-700">
                                            {formatCurrency(stats.last_payout.amount)} ({formatDate(stats.last_payout.paid_at)})
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. KARTU REKAP METRIK HONOR */}
                        <div className="bg-white border border-slate-200/90 rounded-lg shadow-2xs overflow-hidden">
                            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    <Banknote className="w-3.5 h-3.5 text-orange-600" />
                                    Ringkasan Honor Kepelatihan
                                </h4>
                                {hasUnpaid ? (
                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                        Ada Pending
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                        Semua Lunas
                                    </span>
                                )}
                            </div>

                            <div className="p-4 space-y-3">
                                {/* Highlight Box: Belum Dicairkan */}
                                <div className={`p-3.5 rounded-lg border ${
                                    hasUnpaid 
                                        ? 'bg-amber-50/70 border-amber-200 text-amber-900' 
                                        : 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                                }`}>
                                    <div className="flex items-center justify-between text-[11px] font-bold">
                                        <span className="uppercase text-[9.5px] tracking-wider opacity-80">Honor Belum Dicairkan</span>
                                        <span className="text-[10.5px]">{stats.unpaid_sessions_count || 0} sesi pending</span>
                                    </div>
                                    <div className="text-xl font-black mt-1">
                                        {formatCurrency(stats.unpaid_earnings)}
                                    </div>

                                    {hasUnpaid && (
                                        <button
                                            type="button"
                                            onClick={handlePayCoach}
                                            disabled={processing}
                                            className="w-full mt-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                        >
                                            <Banknote size={13} />
                                            <span>Cairkan Honor Sekarang</span>
                                        </button>
                                    )}
                                </div>

                                {/* 3 Mini Boxes */}
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="p-2.5 bg-slate-50/70 border border-slate-200/70 rounded-md">
                                        <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Sudah Dicairkan</span>
                                        <span className="text-sm font-black text-emerald-700 mt-0.5 block">
                                            {formatCurrency(stats.paid_earnings)}
                                        </span>
                                    </div>
                                    <div className="p-2.5 bg-slate-50/70 border border-slate-200/70 rounded-md">
                                        <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Total Akumulasi</span>
                                        <span className="text-sm font-black text-slate-900 mt-0.5 block">
                                            {formatCurrency(stats.total_earnings)}
                                        </span>
                                    </div>
                                </div>

                                {/* Sesi Breakdown */}
                                <div className="p-3 bg-orange-50/30 border border-orange-100 rounded-md space-y-1.5 text-xs">
                                    <div className="flex items-center justify-between font-bold text-slate-800">
                                        <span className="flex items-center gap-1">
                                            <Dumbbell className="w-3.5 h-3.5 text-orange-600" />
                                            Total Sesi Dilatih
                                        </span>
                                        <span className="text-orange-700 font-black">{stats.total_sessions || 0} Sesi</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-1 text-center pt-1 border-t border-orange-100 text-[10.5px]">
                                        <div className="bg-white p-1 rounded border border-slate-200/60">
                                            <span className="text-slate-400 block text-[9px]">Individu</span>
                                            <strong className="text-slate-800">{stats.individual_sessions || 0}</strong>
                                        </div>
                                        <div className="bg-white p-1 rounded border border-slate-200/60">
                                            <span className="text-slate-400 block text-[9px]">Grup</span>
                                            <strong className="text-slate-800">{stats.group_sessions || 0}</strong>
                                        </div>
                                        <div className="bg-white p-1 rounded border border-slate-200/60">
                                            <span className="text-slate-400 block text-[9px]">Gym Shift</span>
                                            <strong className="text-slate-800">{stats.gym_sessions || 0}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════
                        KOLOM KANAN (7.5 Kolom di LG) — Detail Bulanan & Sesi
                       ═══════════════════════════════════════════════════════ */}
                    <div className="lg:col-span-8 xl:col-span-8 space-y-4">
                        
                        <div className="bg-white border border-slate-200/90 rounded-lg shadow-2xs overflow-hidden">
                            {/* Tab Navigation & Toolbar */}
                            <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 border border-slate-200/60 rounded-md">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('monthly')}
                                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                            activeTab === 'monthly'
                                                ? 'bg-white text-orange-600 shadow-2xs border border-slate-200/80'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        Rekap Bulanan ({monthly_breakdown.length})
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('unpaid')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                            activeTab === 'unpaid'
                                                ? 'bg-white text-orange-600 shadow-2xs border border-slate-200/80'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <span>Sesi Belum Dicairkan</span>
                                        {unpaid_sessions.length > 0 && (
                                            <span className="px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-800 text-[10px]">
                                                {unpaid_sessions.length}
                                            </span>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('all')}
                                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                            activeTab === 'all'
                                                ? 'bg-white text-orange-600 shadow-2xs border border-slate-200/80'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        Semua Sesi ({all_sessions.length})
                                    </button>
                                </div>

                                {/* Search & Type Filters (Active for Unpaid & All Tabs) */}
                                {activeTab !== 'monthly' && (
                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* Type Filter */}
                                        <div className="inline-flex p-0.5 bg-slate-100 rounded-md border border-slate-200/60 text-[11px]">
                                            {['all', 'Individu', 'Grup', 'Jaga Gym'].map(t => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() => setTypeFilter(t)}
                                                    className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                                                        typeFilter === t ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                                                    }`}
                                                >
                                                    {t === 'all' ? 'Semua' : t}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Search Input */}
                                        <div className="relative w-36 sm:w-44">
                                            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Cari sesi..."
                                                className="w-full pl-8 pr-6 py-1 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-2xs"
                                            />
                                            {searchTerm && (
                                                <button type="button" onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ═══════════════════════════════════════════════════════
                                TAB 1: REKAP BULANAN
                               ═══════════════════════════════════════════════════════ */}
                            {activeTab === 'monthly' && (
                                <div className="p-4 space-y-3">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse min-w-[650px]">
                                            <thead className="bg-slate-50/70 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                                                <tr>
                                                    <th className="px-4 py-2.5">Periode Bulan</th>
                                                    <th className="px-4 py-2.5 text-center">Individu</th>
                                                    <th className="px-4 py-2.5 text-center">Grup</th>
                                                    <th className="px-4 py-2.5 text-center">Jaga Gym</th>
                                                    <th className="px-4 py-2.5 text-center">Total Sesi</th>
                                                    <th className="px-4 py-2.5 text-right">Total Honor</th>
                                                    <th className="px-4 py-2.5 text-center">Status</th>
                                                    <th className="px-4 py-2.5 text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 text-xs">
                                                {monthly_breakdown.length > 0 ? (
                                                    monthly_breakdown.map((mb) => (
                                                        <tr key={mb.month_key} className="hover:bg-slate-50/70 transition-colors">
                                                            <td className="px-4 py-3 font-bold text-slate-800">
                                                                <div className="flex items-center gap-1.5">
                                                                    <Calendar className="w-3.5 h-3.5 text-orange-600" />
                                                                    <span>{mb.month_label}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-center font-semibold text-slate-700">{mb.individual_sessions}</td>
                                                            <td className="px-4 py-3 text-center font-semibold text-slate-700">{mb.group_sessions}</td>
                                                            <td className="px-4 py-3 text-center font-semibold text-slate-700">{mb.gym_sessions}</td>
                                                            <td className="px-4 py-3 text-center">
                                                                <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-800 text-[11px]">
                                                                    {mb.total_sessions} Sesi
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-black text-slate-900">
                                                                {formatCurrency(mb.total_fee)}
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                {mb.unpaid_fee > 0 ? (
                                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                                                        <Clock size={11} /> Pending {formatCurrency(mb.unpaid_fee)}
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                                        <CheckCircle2 size={11} /> Lunas
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleExportPdf(mb.month_key)}
                                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-700 rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                                                                >
                                                                    <Printer size={12} className="text-slate-500" />
                                                                    <span>Cetak Slip</span>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="8" className="px-5 py-8 text-center text-slate-400 italic">
                                                            Belum ada rekapitulasi bulanan untuk pelatih ini.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* ═══════════════════════════════════════════════════════
                                TAB 2 & 3: SESI BELUM DICAIRKAN & SEMUA SESI
                               ═══════════════════════════════════════════════════════ */}
                            {activeTab !== 'monthly' && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[700px]">
                                        <thead className="bg-slate-50/70 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                                            <tr>
                                                <th className="px-4 py-2.5">Tanggal</th>
                                                <th className="px-4 py-2.5">Klien / Program Latihan</th>
                                                <th className="px-4 py-2.5 text-center">Tipe</th>
                                                <th className="px-4 py-2.5 text-center">Sesi</th>
                                                <th className="px-4 py-2.5 text-right">Honor</th>
                                                <th className="px-4 py-2.5 text-center">Status</th>
                                                <th className="px-4 py-2.5 text-right">Catatan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-xs">
                                            {displayedSessions.length > 0 ? (
                                                displayedSessions.map((sess) => (
                                                    <tr key={sess.id} className="hover:bg-slate-50/70 transition-colors">
                                                        <td className="px-4 py-3 font-medium text-slate-600 whitespace-nowrap">
                                                            {formatDate(sess.date)}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                {sess.client_photo ? (
                                                                    <img src={sess.client_photo} alt={sess.client_name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                                                                ) : (
                                                                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-[9px] flex items-center justify-center shrink-0">
                                                                        {getInitials(sess.client_name)}
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <span className="font-bold text-xs text-slate-900 block">{sess.client_name}</span>
                                                                    <span className="text-[10.5px] text-slate-400 block">{sess.name}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                                                                sess.type === 'Individu'
                                                                    ? 'bg-orange-50 text-orange-700 border-orange-200/70'
                                                                    : sess.type === 'Grup'
                                                                    ? 'bg-sky-50 text-sky-700 border-sky-200/70'
                                                                    : 'bg-amber-50 text-amber-700 border-amber-200/70'
                                                            }`}>
                                                                {sess.type}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center font-semibold text-slate-700">
                                                            {sess.session_number ? `Sesi ${sess.session_number}` : '-'}
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-black text-slate-900">
                                                            {formatCurrency(sess.fee)}
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            {sess.is_paid ? (
                                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                                    <CheckCircle2 size={11} /> Lunas
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                                                    <Clock size={11} /> Belum Dicairkan
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-[11px] text-slate-400 truncate max-w-[150px]">
                                                            {sess.notes || '-'}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="px-5 py-10 text-center text-slate-400 italic">
                                                        Tidak ada sesi yang ditemukan pada kategori ini.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <PageFooter className="!mt-8 !pt-4 !pb-1" />
            </div>
        </AppLayout>
    );
}
