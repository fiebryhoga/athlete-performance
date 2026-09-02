import React, { useState, useEffect, useMemo } from 'react';
import Modal from '@/Components/Modal';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import {
    Banknote,
    Calendar,
    CheckCircle2,
    Clock,
    DollarSign,
    Dumbbell,
    Layers,
    UserCheck,
    X,
    AlertCircle,
    ArrowRight
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

export default function CoachPayoutModal({
    show = false,
    onClose = () => {},
    coach = null,
    defaultMonth = 'all',
    onSuccess = () => {}
}) {
    const [selectedMonth, setSelectedMonth] = useState('all');
    const [processing, setProcessing] = useState(false);

    // Get list of unpaid months from monthly breakdown
    const unpaidMonths = useMemo(() => {
        if (!coach || !coach.monthly_breakdown) return [];
        return coach.monthly_breakdown.filter(m => (m.unpaid_fee || 0) > 0);
    }, [coach]);

    // Total unpaid across all months
    const totalAllUnpaidFee = useMemo(() => {
        if (!coach) return 0;
        if (unpaidMonths.length > 0) {
            return unpaidMonths.reduce((acc, m) => acc + (m.unpaid_fee || 0), 0);
        }
        return coach.unpaid_earnings || 0;
    }, [coach, unpaidMonths]);

    const totalAllUnpaidSessions = useMemo(() => {
        if (!coach) return 0;
        if (unpaidMonths.length > 0) {
            return unpaidMonths.reduce((acc, m) => acc + (m.unpaid_sessions || 0), 0);
        }
        return coach.unpaid_sessions || 0;
    }, [coach, unpaidMonths]);

    // Initialize or reset selected month whenever modal opens or defaultMonth / coach changes
    useEffect(() => {
        if (show) {
            if (defaultMonth && defaultMonth !== 'all' && unpaidMonths.some(m => m.month_key === defaultMonth)) {
                setSelectedMonth(defaultMonth);
            } else if (unpaidMonths.length === 1) {
                // If only 1 month has unpaid balance, preselect it or 'all'
                setSelectedMonth(unpaidMonths[0].month_key);
            } else {
                setSelectedMonth('all');
            }
        }
    }, [show, defaultMonth, unpaidMonths]);

    // Currently selected target info
    const currentSelectionInfo = useMemo(() => {
        if (selectedMonth === 'all') {
            return {
                label: 'Semua Periode Belum Cair',
                fee: totalAllUnpaidFee,
                sessions: totalAllUnpaidSessions,
                isAll: true
            };
        }
        const target = unpaidMonths.find(m => m.month_key === selectedMonth);
        if (target) {
            return {
                label: `Periode ${target.month_label}`,
                fee: target.unpaid_fee || 0,
                sessions: target.unpaid_sessions || 0,
                individual: target.individual_sessions || 0,
                group: target.group_sessions || 0,
                gym: target.gym_sessions || 0,
                isAll: false
            };
        }
        return {
            label: 'Periode Tidak Diketahui',
            fee: 0,
            sessions: 0,
            isAll: false
        };
    }, [selectedMonth, unpaidMonths, totalAllUnpaidFee, totalAllUnpaidSessions]);

    if (!coach) return null;

    const handleSubmitPayout = () => {
        if (currentSelectionInfo.fee <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Tidak Ada Nominal',
                text: 'Nominal pencairan untuk periode ini adalah Rp 0.',
                confirmButtonColor: '#ea580c'
            });
            return;
        }

        const isAll = selectedMonth === 'all';
        const targetMonthLabel = isAll ? 'seluruh periode belum dicairkan' : `periode ${currentSelectionInfo.label}`;

        Swal.fire({
            title: 'Konfirmasi Pencairan',
            html: `
                <div class="text-left text-xs space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div><strong>Pelatih:</strong> ${coach.name}</div>
                    <div><strong>Periode:</strong> <span class="font-bold text-orange-600">${currentSelectionInfo.label}</span></div>
                    <div><strong>Total Honor:</strong> <span class="text-emerald-700 font-bold">${formatCurrency(currentSelectionInfo.fee)}</span></div>
                    <div><strong>Jumlah Sesi:</strong> ${currentSelectionInfo.sessions} sesi</div>
                </div>
                <p class="text-xs text-slate-500 mt-3">
                    Apakah Anda yakin ingin mencairkan honor ${targetMonthLabel}? Status sesi pada periode tersebut akan ditandai Lunas.
                </p>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ea580c',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Cairkan Sekarang',
            cancelButtonText: 'Batal',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                setProcessing(true);
                router.post(route('admin.reports.pay-coach', coach.id), {
                    month: selectedMonth
                }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setProcessing(false);
                        onClose();
                        onSuccess();
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil Dicairkan!',
                            text: `Honor untuk Coach ${coach.name} (${currentSelectionInfo.label}) sebesar ${formatCurrency(currentSelectionInfo.fee)} berhasil dicairkan.`,
                            confirmButtonColor: '#ea580c'
                        });
                    },
                    onError: (errors) => {
                        setProcessing(false);
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal Mencairkan',
                            text: errors?.message || 'Terjadi kesalahan saat memproses pencairan honor.',
                            confirmButtonColor: '#ea580c'
                        });
                    }
                });
            }
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <div className="p-5 sm:p-6 space-y-5 bg-white">
                {/* Modal Header */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shadow-2xs shrink-0">
                            <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 leading-tight">
                                Cairkan Honor Pelatih
                            </h3>
                            <p className="text-xs text-slate-500">
                                Pilih periode bulan yang ingin dicairkan untuk pelatih ini.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Coach Info Badge */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-orange-400/40 shadow-2xs">
                        {coach.profile_photo_url ? (
                            <img src={coach.profile_photo_url} alt={coach.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <span>{getInitials(coach.name)}</span>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <span className="font-bold text-sm text-slate-900 block truncate">
                            {coach.name}
                        </span>
                        <span className="text-xs text-slate-400 block truncate">
                            {coach.email || 'Pelatih OTS'}
                        </span>
                    </div>
                    <div className="text-right shrink-0">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Belum Cair</span>
                        <span className="text-xs font-black text-amber-700">
                            {formatCurrency(totalAllUnpaidFee)}
                        </span>
                    </div>
                </div>

                {/* Period Selection */}
                <div className="space-y-2.5">
                    <label className="text-xs font-bold text-slate-700 block">
                        Pilih Periode Pencairan:
                    </label>

                    {unpaidMonths.length === 0 ? (
                        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-center space-y-1 text-xs text-amber-800">
                            <AlertCircle className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                            <p className="font-bold">Tidak ada honor yang belum dicairkan</p>
                            <p className="text-[11px] text-amber-700 opacity-90">
                                Semua sesi kepelatihan dan shift gym pelatih ini sudah tercatat lunas.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {/* Option 1: ALL PERIODS */}
                            {unpaidMonths.length > 1 && (
                                <div
                                    onClick={() => setSelectedMonth('all')}
                                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                        selectedMonth === 'all'
                                            ? 'bg-orange-50/80 border-orange-400 ring-2 ring-orange-400/20'
                                            : 'bg-white border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                            selectedMonth === 'all' ? 'border-orange-600 bg-orange-600 text-white' : 'border-slate-300 bg-white'
                                        }`}>
                                            {selectedMonth === 'all' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                        <div>
                                            <span className="font-bold text-xs text-slate-900 block">
                                                Semua Periode Belum Cair
                                            </span>
                                            <span className="text-[10.5px] text-slate-400">
                                                Mencakup {unpaidMonths.length} bulan ({totalAllUnpaidSessions} sesi total)
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-black text-emerald-700 block">
                                            {formatCurrency(totalAllUnpaidFee)}
                                        </span>
                                        <span className="text-[9.5px] text-orange-600 font-semibold">
                                            Semua Bulan
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Options per month */}
                            {unpaidMonths.map((m) => {
                                const isSelected = selectedMonth === m.month_key;
                                return (
                                    <div
                                        key={m.month_key}
                                        onClick={() => setSelectedMonth(m.month_key)}
                                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                            isSelected
                                                ? 'bg-orange-50/80 border-orange-400 ring-2 ring-orange-400/20'
                                                : 'bg-white border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                                isSelected ? 'border-orange-600 bg-orange-600 text-white' : 'border-slate-300 bg-white'
                                            }`}>
                                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-orange-600" />
                                                    <span className="font-bold text-xs text-slate-900">
                                                        {m.month_label}
                                                    </span>
                                                </div>
                                                <div className="text-[10.5px] text-slate-400 flex items-center gap-2 mt-0.5">
                                                    <span>{m.unpaid_sessions} sesi pending</span>
                                                    {m.individual_sessions > 0 && <span>• {m.individual_sessions} Individu</span>}
                                                    {m.group_sessions > 0 && <span>• {m.group_sessions} Grup</span>}
                                                    {m.gym_sessions > 0 && <span>• {m.gym_sessions} Gym</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-black text-slate-900 block">
                                                {formatCurrency(m.unpaid_fee)}
                                            </span>
                                            <span className="inline-flex items-center gap-0.5 text-[9.5px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                                <Clock size={9} /> Pending
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Summary Box */}
                {currentSelectionInfo.fee > 0 && (
                    <div className="p-3.5 rounded-xl bg-orange-500/5 border border-orange-200/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 font-medium">Periode yang dipilih:</span>
                            <span className="font-bold text-orange-700">{currentSelectionInfo.label}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 font-medium">Jumlah sesi yang dicairkan:</span>
                            <span className="font-bold text-slate-800">{currentSelectionInfo.sessions} Sesi</span>
                        </div>
                        <div className="pt-2 border-t border-orange-200/60 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">Total Nominal Cair:</span>
                            <span className="text-base font-black text-emerald-700">
                                {formatCurrency(currentSelectionInfo.fee)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmitPayout}
                        disabled={processing || currentSelectionInfo.fee <= 0}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Banknote className="w-4 h-4" />
                        <span>{processing ? 'Memproses...' : 'Konfirmasi Cairkan'}</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
}
