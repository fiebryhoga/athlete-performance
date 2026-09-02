import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Common/PageHeader';
import PageFooter from '@/Components/Common/PageFooter';
import CoachPayoutModal from '@/Components/Admin/CoachPayoutModal';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import {
    Banknote,
    Users,
    Calendar,
    Search,
    Printer,
    CheckCircle2,
    Clock,
    ShieldCheck,
    Dumbbell,
    X,
    DollarSign,
    ArrowRight,
    Eye
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

export default function CoachSalaryRecap({
    coaches = [],
    available_months = [],
    monthly_summary = [],
    current_month = {}
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('all'); // 'all' | 'YYYY-MM'
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'unpaid' | 'paid'
    const [selectedCoachForPayout, setSelectedCoachForPayout] = useState(null);
    const [payoutModalOpen, setPayoutModalOpen] = useState(false);

    // Filter coaches
    const filteredCoaches = useMemo(() => {
        return coaches.filter(coach => {
            if (searchTerm.trim()) {
                const q = searchTerm.toLowerCase();
                const matchName = coach.name?.toLowerCase().includes(q);
                const matchEmail = coach.email?.toLowerCase().includes(q);
                if (!matchName && !matchEmail) return false;
            }

            if (statusFilter === 'unpaid') {
                if ((coach.unpaid_earnings || 0) <= 0) return false;
            } else if (statusFilter === 'paid') {
                if ((coach.unpaid_earnings || 0) > 0) return false;
            }

            if (selectedMonth !== 'all') {
                const hasInMonth = coach.monthly_breakdown?.some(mb => mb.month_key === selectedMonth && mb.total_sessions > 0);
                if (!hasInMonth) return false;
            }

            return true;
        });
    }, [coaches, searchTerm, statusFilter, selectedMonth]);

    // Summary calculations
    const totalUnpaidGlobal = useMemo(() => {
        return coaches.reduce((acc, c) => acc + (c.unpaid_earnings || 0), 0);
    }, [coaches]);

    const handlePayCoach = (coach, e) => {
        e.stopPropagation(); // Prevent row click
        if (!coach.unpaid_earnings || coach.unpaid_earnings <= 0) {
            Swal.fire({
                icon: 'info',
                title: 'Tidak Ada Tagihan',
                text: `Semua sesi kepelatihan untuk Coach ${coach.name} sudah tercatat lunas.`,
                confirmButtonColor: '#ea580c',
            });
            return;
        }

        setSelectedCoachForPayout(coach);
        setPayoutModalOpen(true);
    };

    const handleExportPdf = (coachId, e) => {
        e.stopPropagation(); // Prevent row click
        let url = route('admin.reports.coaches.export-pdf', coachId);
        if (selectedMonth && selectedMonth !== 'all') {
            url += `?month=${selectedMonth}`;
        }
        window.open(url, '_blank');
    };

    return (
        <AppLayout title="Rekap Pelatih">
            <Head title="Rekap Honor & Gaji Pelatih" />

            <div className="space-y-4 pb-12 max-w-[1600px] mx-auto">
                {/* ─── PAGE HEADER ─── */}
                <PageHeader
                    title="Rekap Honor Pelatih"
                    description="Laporan sesi kepelatihan, rekap honor bulanan, shift jaga gym, dan pencairan honor pelatih."
                />

                {/* ─── KPI METRIC CARDS ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* 1. Total Unpaid Fee */}
                    <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500">Honor Belum Dicairkan</span>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${totalUnpaidGlobal > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                <Banknote className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className={`text-xl font-black ${totalUnpaidGlobal > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                                {formatCurrency(totalUnpaidGlobal)}
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Total akumulasi honor yang siap dibayarkan</p>
                    </div>

                    {/* 2. Total Fee Current Month */}
                    <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500">Honor Bulan Ini ({current_month.label || 'Bulan Ini'})</span>
                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                                <DollarSign className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-xl font-black text-slate-900">
                                {formatCurrency(current_month.total_coach_earnings || 0)}
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Estimasi total gaji pelatih bulan berjalan</p>
                    </div>

                    {/* 3. Total Sessions Current Month */}
                    <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500">Sesi Latihan Bulan Ini</span>
                            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                                <Dumbbell className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-xl font-black text-slate-900">
                                {(current_month.total_individual_sessions || 0) + (current_month.total_group_sessions || 0)} Sesi
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                            {current_month.total_individual_sessions || 0} Individu • {current_month.total_group_sessions || 0} Grup
                        </p>
                    </div>

                    {/* 4. Active Coaches */}
                    <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500">Pelatih Aktif Bulan Ini</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-xl font-black text-slate-900">
                                {current_month.active_coaches_count || coaches.length} Pelatih
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Dari total {coaches.length} pelatih terdaftar</p>
                    </div>
                </div>

                {/* ─── MONTHLY SUMMARY PILLS ─── */}
                {monthly_summary && monthly_summary.length > 0 && (
                    <div className="bg-white border border-slate-200/90 rounded-lg p-3.5 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-orange-600" />
                                Ringkasan Bulanan (4 Bulan Terakhir)
                            </span>
                            <span className="text-[10.5px] text-slate-400">Klik bulan untuk memfilter tabel di bawah</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {monthly_summary.map((ms) => {
                                const isSelected = selectedMonth === ms.month_key;
                                return (
                                    <button
                                        key={ms.month_key}
                                        type="button"
                                        onClick={() => setSelectedMonth(isSelected ? 'all' : ms.month_key)}
                                        className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                                            isSelected 
                                                ? 'bg-orange-50/80 border-orange-300 ring-2 ring-orange-400/30' 
                                                : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                                            <span>{ms.month_label}</span>
                                            <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200">
                                                {ms.total_sessions} Sesi
                                            </span>
                                        </div>
                                        <div className="mt-1 text-xs font-black text-orange-700">
                                            {formatCurrency(ms.total_fee)}
                                        </div>
                                        <div className="flex justify-between text-[9.5px] text-slate-400 mt-1">
                                            <span>Cair: <strong className="text-emerald-600 font-semibold">{formatCurrency(ms.paid_fee)}</strong></span>
                                            {ms.unpaid_fee > 0 && (
                                                <span>Pending: <strong className="text-amber-600 font-semibold">{formatCurrency(ms.unpaid_fee)}</strong></span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ─── MAIN TABLE & FILTERS ─── */}
                <div className="bg-white border border-slate-200/90 rounded-lg shadow-2xs overflow-hidden">
                    {/* Table Toolbar */}
                    <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-orange-600" />
                            <h3 className="text-xs font-bold text-slate-900">
                                Daftar Honor Pelatih ({filteredCoaches.length})
                            </h3>
                            {selectedMonth !== 'all' && (
                                <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded border border-orange-200">
                                    Filter: {available_months.find(m => m.key === selectedMonth)?.label || selectedMonth}
                                    <button onClick={() => setSelectedMonth('all')} className="hover:text-rose-600 cursor-pointer ml-0.5">
                                        <X size={10} />
                                    </button>
                                </span>
                            )}
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
                                    Semua Status
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStatusFilter('unpaid')}
                                    className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                                        statusFilter === 'unpaid' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    Belum Dicairkan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStatusFilter('paid')}
                                    className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                                        statusFilter === 'paid' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    Sudah Lunas
                                </button>
                            </div>

                            {/* Search Input */}
                            <div className="relative w-44">
                                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Cari nama pelatih..."
                                    className="w-full pl-8 pr-6 py-1 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-2xs"
                                />
                                {searchTerm && (
                                    <button type="button" onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead className="bg-slate-50/70 border-b border-slate-100 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-2.5">Nama Pelatih</th>
                                    <th className="px-4 py-2.5 text-center">Sesi Individu</th>
                                    <th className="px-4 py-2.5 text-center">Sesi Grup</th>
                                    <th className="px-4 py-2.5 text-center">Jaga Gym</th>
                                    <th className="px-4 py-2.5 text-center">Total Sesi</th>
                                    <th className="px-4 py-2.5 text-right">Belum Dicairkan</th>
                                    <th className="px-4 py-2.5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                                {filteredCoaches.length > 0 ? (
                                    filteredCoaches.map((coach) => {
                                        const hasUnpaid = (coach.unpaid_earnings || 0) > 0;

                                        return (
                                            <tr 
                                                key={coach.id} 
                                                onClick={() => router.visit(route('admin.reports.coaches.show', coach.id))}
                                                className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] aspect-square rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 border border-orange-500 shadow-2xs group-hover:ring-2 group-hover:ring-orange-400/40 transition-all overflow-hidden leading-none select-none">
                                                            {coach.profile_photo_url ? (
                                                                <img src={coach.profile_photo_url} alt={coach.name} className="w-full h-full object-cover rounded-full aspect-square" />
                                                            ) : (
                                                                <span className="leading-none">{getInitials(coach.name)}</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-xs text-slate-900 group-hover:text-orange-700 transition-colors block">
                                                                {coach.name}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 block">{coach.email || 'Pelatih OTS'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center font-semibold text-slate-700">
                                                    {coach.individual_sessions || 0}
                                                </td>
                                                <td className="px-4 py-3 text-center font-semibold text-slate-700">
                                                    {coach.group_sessions || 0}
                                                </td>
                                                <td className="px-4 py-3 text-center font-semibold text-slate-700">
                                                    {coach.gym_sessions || 0}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-800 text-[11px]">
                                                        {coach.total_sessions || 0} Sesi
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {hasUnpaid ? (
                                                        <div>
                                                            <span className="font-black text-amber-600 text-xs block">
                                                                {formatCurrency(coach.unpaid_earnings)}
                                                            </span>
                                                            <span className="text-[9.5px] text-amber-500 font-semibold">
                                                                {coach.unpaid_sessions} sesi pending
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                                                            <CheckCircle2 size={12} /> Lunas
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                                        {/* Print Slip PDF Button */}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleExportPdf(coach.id, e)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                                                            title="Cetak Slip Gaji PDF"
                                                        >
                                                            <Printer className="w-3.5 h-3.5 text-slate-500" />
                                                            <span className="hidden sm:inline">Slip PDF</span>
                                                        </button>

                                                        {/* Pay Coach Button */}
                                                        {hasUnpaid && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => handlePayCoach(coach, e)}
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-xs font-bold shadow-2xs transition-all cursor-pointer"
                                                            >
                                                                <Banknote className="w-3.5 h-3.5" />
                                                                <span>Cairkan</span>
                                                            </button>
                                                        )}

                                                        {/* View Detail Link */}
                                                        <Link
                                                            href={route('admin.reports.coaches.show', coach.id)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-slate-600 hover:text-orange-700 rounded-md text-xs font-semibold transition-all shadow-2xs"
                                                        >
                                                            <Eye size={12} />
                                                            <span>Detail</span>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-5 py-10 text-center text-slate-400 italic">
                                            Tidak ada data pelatih yang sesuai filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <PageFooter className="!mt-8 !pt-4 !pb-1" />
            </div>

            {/* Payout Modal */}
            <CoachPayoutModal
                show={payoutModalOpen}
                onClose={() => {
                    setPayoutModalOpen(false);
                    setSelectedCoachForPayout(null);
                }}
                coach={selectedCoachForPayout}
                defaultMonth={selectedMonth}
            />
        </AppLayout>
    );
}
