import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PageHeader from '@/Components/Common/PageHeader';
import { 
    Users, UserCheck, User, Activity, Search, Trophy, CheckCircle2, Calendar, 
    Banknote, ChevronDown, ChevronRight, Package, Dumbbell, Filter, 
    Clock, DollarSign, Layers, Eye, ShieldCheck, Sparkles, TrendingUp, FileText,
    X, Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { pdf } from '@react-pdf/renderer';
import CoachSalarySlipPdfDocument from './Partials/CoachSalarySlipPdfDocument';

export default function SessionRecap({ 
    athletes = [], 
    groups = [], 
    coaches = [], 
    available_months = [], 
    monthly_summary = [],
    current_month = null
}) {
    const [activeTab, setActiveTab] = useState('individual'); // 'individual', 'group', 'coach'
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [selectedMonth, setSelectedMonth] = useState('all'); // 'all' or '2026-08', '2026-07', etc.
    const [expandedCoachTab, setExpandedCoachTab] = useState({}); // coachId => 'monthly' | 'unpaid' | 'all'
    const [expandedMonthDetail, setExpandedMonthDetail] = useState(new Set()); // 'coachId-monthKey'
    const [exportingCoachKey, setExportingCoachKey] = useState(null);

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
            // Close other dropdowns of the same category (Coach, Athlete, Group)
            if (id.startsWith('coach-')) {
                for (const item of newExpanded) {
                    if (item.startsWith('coach-')) {
                        newExpanded.delete(item);
                    }
                }
            } else if (id.startsWith('athlete-')) {
                for (const item of newExpanded) {
                    if (item.startsWith('athlete-')) {
                        newExpanded.delete(item);
                    }
                }
            } else if (id.startsWith('group-')) {
                for (const item of newExpanded) {
                    if (item.startsWith('group-')) {
                        newExpanded.delete(item);
                    }
                }
            }
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const toggleMonthDetail = (key) => {
        const newExpanded = new Set(expandedMonthDetail);
        if (newExpanded.has(key)) {
            newExpanded.delete(key);
        } else {
            // Close other opened month details to keep view compact
            newExpanded.clear();
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

    // Robust Monthly Breakdown Builder per Coach
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

    // Calculate Dynamic Available Months if not provided by backend
    const computedAvailableMonths = useMemo(() => {
        if (available_months && available_months.length > 0) return available_months;

        const monthsSet = new Set();
        coaches.forEach(c => {
            const list = getCoachMonthlyBreakdown(c);
            list.forEach(m => monthsSet.add(m.month_key));
        });

        return Array.from(monthsSet)
            .filter(k => k !== 'other')
            .sort((a, b) => b.localeCompare(a))
            .map(k => {
                const [y, m] = k.split('-');
                return { key: k, label: `${monthNamesMap[m] || m} ${y}` };
            });
    }, [coaches, available_months]);

    // Calculate Dynamic Monthly Summary
    const computedMonthlySummary = useMemo(() => {
        if (monthly_summary && monthly_summary.length > 0) return monthly_summary;

        const map = {};
        coaches.forEach(c => {
            const list = getCoachMonthlyBreakdown(c);
            list.forEach(mb => {
                if (!map[mb.month_key]) {
                    map[mb.month_key] = {
                        month_key: mb.month_key,
                        month_label: mb.month_label,
                        total_sessions: 0,
                        total_fee: 0,
                        paid_fee: 0,
                        unpaid_fee: 0
                    };
                }
                map[mb.month_key].total_sessions += mb.total_sessions;
                map[mb.month_key].total_fee += mb.total_fee;
                map[mb.month_key].paid_fee += mb.paid_fee;
                map[mb.month_key].unpaid_fee += mb.unpaid_fee;
            });
        });

        return Object.values(map).sort((a, b) => b.month_key.localeCompare(a.month_key));
    }, [coaches, monthly_summary]);

    // Filtered lists based on search and active tab
    const filteredAthletes = useMemo(() => {
        if (!searchQuery) return athletes;
        const q = searchQuery.toLowerCase();
        return athletes.filter(a => 
            a.name?.toLowerCase().includes(q) || 
            a.package_name?.toLowerCase().includes(q) ||
            a.sport?.name?.toLowerCase().includes(q)
        );
    }, [athletes, searchQuery]);

    const filteredGroups = useMemo(() => {
        if (!searchQuery) return groups;
        const q = searchQuery.toLowerCase();
        return groups.filter(g => 
            g.name?.toLowerCase().includes(q) || 
            g.package_name?.toLowerCase().includes(q) ||
            (g.member_names && g.member_names.some(m => m.toLowerCase().includes(q)))
        );
    }, [groups, searchQuery]);

    const filteredCoaches = useMemo(() => {
        let list = coaches;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            list = list.filter(c => 
                c.name?.toLowerCase().includes(q) || 
                c.username?.toLowerCase().includes(q)
            );
        }
        if (selectedMonth !== 'all') {
            list = list.filter(c => {
                const mb = getCoachMonthlyBreakdown(c);
                return mb.some(m => m.month_key === selectedMonth && m.total_sessions > 0);
            });
        }
        return list;
    }, [coaches, searchQuery, selectedMonth]);

    // ─── KPI COUNTERS (Bulan Ini) ───
    const activePeriodLabel = current_month?.label || "Bulan Ini";
    const totalAthleteSessions = current_month?.total_individual_sessions ?? athletes.reduce((acc, curr) => acc + (curr.unpaid_sessions || 0), 0);
    const regularAthleteSessions = current_month?.regular_individual_sessions ?? athletes.reduce((acc, curr) => acc + (curr.unpaid_regular_sessions || 0), 0);
    const extraAthleteSessions = current_month?.extra_individual_sessions ?? athletes.reduce((acc, curr) => acc + (curr.unpaid_extra_sessions || 0), 0);

    const totalGroupSessions = current_month?.total_group_sessions ?? groups.reduce((acc, curr) => acc + (curr.unpaid_sessions || 0), 0);
    const regularGroupSessions = current_month?.regular_group_sessions ?? groups.reduce((acc, curr) => acc + (curr.unpaid_regular_sessions || 0), 0);
    const extraGroupSessions = current_month?.extra_group_sessions ?? groups.reduce((acc, curr) => acc + (curr.unpaid_extra_sessions || 0), 0);

    const activeCoachesCount = current_month?.active_coaches_count ?? coaches.filter(c => (c.total_sessions || 0) > 0 || (c.unpaid_earnings || 0) > 0).length;
    const totalUnpaidCoachEarnings = coaches.reduce((acc, curr) => acc + (curr.unpaid_earnings || 0), 0);

    const handlePayAthlete = (athlete) => {
        Swal.fire({
            title: 'Konfirmasi Pelunasan',
            text: `Tandai seluruh sesi belum bayar untuk atlet "${athlete.name}" sebagai LUNAS?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Tandai Lunas',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#ea580c',
            cancelButtonColor: '#64748b',
        }).then((result) => {
            if (result.isConfirmed) {
                post(route('admin.reports.pay-athlete', athlete.id));
            }
        });
    };

    const handlePayGroup = (group) => {
        Swal.fire({
            title: 'Konfirmasi Pelunasan Grup',
            text: `Tandai seluruh sesi belum bayar untuk grup "${group.name}" sebagai LUNAS?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Tandai Lunas',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#ea580c',
            cancelButtonColor: '#64748b',
        }).then((result) => {
            if (result.isConfirmed) {
                post(route('admin.reports.pay-group', group.id));
            }
        });
    };

    const handlePayCoach = (coach) => {
        Swal.fire({
            title: 'Pencairan Honor Pelatih',
            text: `Cairkan seluruh honor sesi yang belum dibayar sebesar ${formatCurrency(coach.unpaid_earnings)} untuk pelatih "${coach.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Cairkan Sekarang',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#ea580c',
            cancelButtonColor: '#64748b',
        }).then((result) => {
            if (result.isConfirmed) {
                post(route('admin.reports.pay-coach', coach.id));
            }
        });
    };

    const handleDownloadCoachPdf = async (coach, targetMonth = 'all', monthLabel = null, explicitSessions = null) => {
        const loadingKey = `${coach.id}-${targetMonth}`;
        if (exportingCoachKey) return;
        setExportingCoachKey(loadingKey);

        try {
            let label = monthLabel;
            if (!label) {
                if (targetMonth && targetMonth !== 'all') {
                    const found = available_months?.find(m => m.key === targetMonth);
                    label = found ? found.label : targetMonth;
                } else {
                    label = "Semua Periode";
                }
            }

            const doc = (
                <CoachSalarySlipPdfDocument
                    coach={coach}
                    targetMonth={targetMonth}
                    targetMonthLabel={label}
                    monthSessions={explicitSessions}
                />
            );
            const asPdf = pdf();
            asPdf.updateContainer(doc);
            const blob = await asPdf.toBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const cleanName = (coach?.name || "Pelatih").replace(/[^a-zA-Z0-9_-]/g, "_");
            const monthSuffix = targetMonth && targetMonth !== 'all' ? `_${targetMonth}` : '';
            a.download = `Slip_Gaji_${cleanName}${monthSuffix}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("PDF generation error:", err);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Membuat Slip PDF',
                text: 'Terjadi kesalahan saat memproses slip gaji PDF.'
            });
        } finally {
            setExportingCoachKey(null);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount || 0);
    };

    const renderProgressBar = (completed, total, packageType = 'quota') => {
        if (packageType === 'per_session') {
            return (
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-orange-700">{completed} Sesi</span>
                    <span className="text-[10px] text-orange-600 bg-orange-50 border border-orange-200/60 px-1.5 py-0.5 rounded font-semibold">Per Pertemuan</span>
                </div>
            );
        }

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
        if (percent >= 100) colorClass = "bg-emerald-500";
        else if (percent > 60) colorClass = "bg-orange-500";
        
        return (
            <div className="flex flex-col gap-1 w-full max-w-[140px]">
                <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-600">Sesi {completed}/{total}</span>
                    <span className={percent >= 100 ? "text-emerald-600 font-extrabold" : "text-slate-400"}>{percent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full ${colorClass} rounded-full transition-all duration-300`} style={{ width: `${percent}%` }}></div>
                </div>
            </div>
        );
    };

    return (
        <AppLayout title="Rekap Sesi">
            <Head title="Rekap Sesi & Honor Pelatih - Admin" />
            
            <div className="space-y-4 pb-16">
                {/* ─── PAGE HEADER ─── */}
                <PageHeader
                    title="Rekap Sesi & Honor Pelatih"
                    description={`Laporan kumulatif sesi latihan atlet, grup, serta rekapitulasi honor pelatih periode ${activePeriodLabel}.`}
                    actions={
                        <div className="relative w-56 sm:w-64">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                placeholder={`Cari ${activeTab === 'individual' ? 'klien individu' : activeTab === 'group' ? 'grup' : 'pelatih'}...`}
                                className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200/90 rounded-md text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-2xs" 
                            />
                            {searchQuery && (
                                <button 
                                    type="button" 
                                    onClick={() => setSearchQuery("")} 
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    }
                />

                {/* ─── SUMMARY KPI CARDS (BULAN INI) ─── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {/* Card 1: Total Sesi Individu */}
                    <div className="bg-white rounded-md border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">Total Sesi Individu</span>
                            <div className="w-8 h-8 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200/60">
                                <UserCheck className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-black text-slate-900">{totalAthleteSessions}</h3>
                                <span className="text-[11px] font-semibold text-slate-400">Total</span>
                            </div>
                            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 text-[11px]">
                                <span className="font-bold text-slate-700">{regularAthleteSessions} Asli</span>
                                <span className="text-slate-300">•</span>
                                <span className="font-bold text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200/60 text-[10px]">
                                    +{extraAthleteSessions} Tambahan
                                </span>
                            </div>
                            <div className="text-[10.5px] text-slate-400 font-medium">
                                Periode {activePeriodLabel}
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Total Sesi Grup */}
                    <div className="bg-white rounded-md border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">Total Sesi Grup</span>
                            <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-black text-slate-900">{totalGroupSessions}</h3>
                                <span className="text-[11px] font-semibold text-slate-400">Total</span>
                            </div>
                            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 text-[11px]">
                                <span className="font-bold text-slate-700">{regularGroupSessions} Asli</span>
                                <span className="text-slate-300">•</span>
                                <span className="font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200/60 text-[10px]">
                                    +{extraGroupSessions} Tambahan
                                </span>
                            </div>
                            <div className="text-[10.5px] text-slate-400 font-medium">
                                Sesi grup {activePeriodLabel}
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Pelatih Aktif */}
                    <div className="bg-white rounded-md border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">Pelatih Aktif</span>
                            <div className="w-8 h-8 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200/60">
                                <Activity className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <h3 className="text-2xl font-black text-slate-900">{activeCoachesCount}</h3>
                            <div className="text-[11px] text-slate-400 font-medium pt-1 border-t border-slate-100">
                                Pelatih bertugas aktif
                            </div>
                            <div className="text-[10.5px] text-slate-400 font-medium">
                                Periode {activePeriodLabel}
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Total Belum Dicairkan */}
                    <div className="bg-white rounded-md border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10.5px] font-bold text-emerald-700 uppercase tracking-wider">Total Belum Dicairkan</span>
                            <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60">
                                <Banknote className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <h3 className="text-xl sm:text-2xl font-black text-emerald-700">{formatCurrency(totalUnpaidCoachEarnings)}</h3>
                            <div className="text-[11px] text-emerald-600 font-bold pt-1 border-t border-slate-100">
                                Seluruh honor tertunda
                            </div>
                            <div className="text-[10.5px] text-slate-400 font-medium">
                                Akumulasi belum dicairkan
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── TABS NAVIGATION ─── */}
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
                            <span>Klien Individu</span>
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
                            <span>Grup Latihan</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('coach')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                activeTab === 'coach' 
                                    ? 'bg-white text-orange-600 shadow-2xs border border-slate-200/70' 
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                            }`}
                        >
                            <Banknote size={13.5} />
                            <span>Rekap Pelatih (Honor & Bulanan)</span>
                        </button>
                    </div>

                    {/* Month Filter (Active in Coach Tab) */}
                    {activeTab === 'coach' && computedAvailableMonths && computedAvailableMonths.length > 0 && (
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200/80 shadow-2xs">
                            <Calendar className="w-3.5 h-3.5 text-orange-500" />
                            <span className="text-xs font-bold text-slate-700">Filter Bulan:</span>
                            <select 
                                value={selectedMonth} 
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-md py-1 px-2.5 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none cursor-pointer"
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
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-orange-500" /> Rekapitulasi Honor Pelatih Per Bulan
                            </h3>
                            <span className="text-xs text-slate-400 font-medium">Total {computedMonthlySummary.length} Bulan Terekam</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {computedMonthlySummary.map((month) => {
                                const isSelected = selectedMonth === month.month_key;
                                return (
                                    <div 
                                        key={month.month_key}
                                        onClick={() => setSelectedMonth(isSelected ? 'all' : month.month_key)}
                                        className={`p-3.5 rounded-md border transition-all cursor-pointer flex flex-col justify-between ${
                                            isSelected 
                                                ? 'bg-orange-50/70 border-orange-300 ring-1 ring-orange-400/40 shadow-2xs' 
                                                : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-slate-900">{month.month_label}</span>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
                                                {month.total_sessions} Sesi
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-500">Total Honor:</span>
                                                <strong className="text-slate-900 font-bold">{formatCurrency(month.total_fee)}</strong>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-500">Belum Dicairkan:</span>
                                                <strong className={month.unpaid_fee > 0 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>
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
                <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                    
                    {/* ── 1. INDIVIDUAL TAB ── */}
                    {activeTab === 'individual' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead className="bg-slate-50/70 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-4 py-2.5 w-10"></th>
                                        <th className="px-4 py-2.5">Nama Atlet</th>
                                        <th className="px-4 py-2.5">Paket Latihan</th>
                                        <th className="px-4 py-2.5">Progress Sesi</th>
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
                                                        <span className="font-bold text-xs text-slate-900">{athlete.name}</span>
                                                        <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 mt-0.5">
                                                            <Trophy className="w-2.5 h-2.5 text-slate-300" />
                                                            {athlete.sport?.name || '-'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {athlete.package_name ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-semibold">
                                                            <Package size={11} className="text-slate-400" />
                                                            {athlete.package_name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">Tanpa Paket</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {renderProgressBar(athlete.unpaid_sessions, athlete.package_session_count, athlete.package_type)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {athlete.unpaid_sessions > 0 ? (
                                                        <span className="inline-flex min-w-[1.75rem] px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 font-bold text-xs border border-orange-200/60">
                                                            {athlete.unpaid_sessions}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-300">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {athlete.unpaid_sessions > 0 ? (
                                                        <button
                                                            onClick={() => handlePayAthlete(athlete)}
                                                            disabled={processing}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white rounded-md text-xs font-bold transition-all disabled:opacity-50 border border-orange-200/70 shadow-2xs cursor-pointer"
                                                        >
                                                            <Banknote className="w-3.5 h-3.5" /> Tandai Lunas
                                                        </button>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                                                            <CheckCircle2 size={13} /> Lunas
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                            {/* Expanded Details */}
                                            {expandedRows.has(`athlete-${athlete.id}`) && (
                                                <tr className="bg-slate-50/40">
                                                    <td colSpan="6" className="px-6 py-3 border-b border-slate-100">
                                                        <div className="bg-white border border-slate-200/80 rounded-md overflow-hidden shadow-2xs">
                                                            <div className="px-3.5 py-2 bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-800">
                                                                Riwayat Sesi Latihan Atlet
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
                                                                                        <span className="text-slate-600">{session.name || 'Program Latihan'}</span>
                                                                                        {session.is_extra && (
                                                                                            <span className="text-[9.5px] font-bold text-orange-700 bg-orange-50 border border-orange-200/70 px-1.5 py-0.2 rounded">
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
                                                                                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 text-[10px]">Selesai</span>
                                                                                    ) : (
                                                                                        <span className="text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60 text-[10px]">Terjadwal</span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-3.5 py-2 w-28 text-right">
                                                                                    {session.is_paid ? (
                                                                                        <span className="text-emerald-600 font-bold text-xs"><CheckCircle2 size={12} className="inline mr-1" /> Lunas</span>
                                                                                    ) : (
                                                                                        <span className="text-slate-400 font-bold text-xs">Belum Bayar</span>
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
                                        <th className="px-4 py-2.5">Anggota</th>
                                        <th className="px-4 py-2.5">Paket Latihan</th>
                                        <th className="px-4 py-2.5">Progress Sesi</th>
                                        <th className="px-4 py-2.5 text-center">Belum Bayar</th>
                                        <th className="px-4 py-2.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {filteredGroups.length > 0 ? filteredGroups.map(group => (
                                        <React.Fragment key={group.id}>
                                            <tr className="hover:bg-slate-50/60 transition-colors group/row">
                                                <td className="px-4 py-3">
                                                    <button onClick={() => toggleRow(`group-${group.id}`)} className="p-1 text-slate-400 hover:text-slate-800 rounded cursor-pointer">
                                                        {expandedRows.has(`group-${group.id}`) ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="font-bold text-xs text-slate-900">{group.name}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex -space-x-1.5 overflow-hidden">
                                                        {group.member_names?.slice(0, 3).map((name, i) => (
                                                            <div key={i} className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-[7.5px] font-bold text-slate-600" title={name}>
                                                                {name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                        ))}
                                                        {group.member_names?.length > 3 && (
                                                            <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">
                                                                +{group.member_names.length - 3}
                                                            </div>
                                                        )}
                                                        {(!group.member_names || group.member_names.length === 0) && (
                                                            <span className="text-xs text-slate-400">0 Anggota</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {group.package_name ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-semibold">
                                                            <Package size={11} className="text-slate-400" />
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
                                                        <span className="inline-flex min-w-[1.75rem] px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 font-bold text-xs border border-orange-200/60">
                                                            {group.unpaid_sessions}
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
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white rounded-md text-xs font-bold transition-all disabled:opacity-50 border border-orange-200/70 shadow-2xs cursor-pointer"
                                                        >
                                                            <Banknote className="w-3.5 h-3.5" /> Tandai Lunas
                                                        </button>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                                                            <CheckCircle2 size={13} /> Lunas
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                            {/* Expanded Details */}
                                            {expandedRows.has(`group-${group.id}`) && (
                                                <tr className="bg-slate-50/40">
                                                    <td colSpan="7" className="px-6 py-3 border-b border-slate-100">
                                                        <div className="bg-white border border-slate-200/80 rounded-md overflow-hidden shadow-2xs">
                                                            <div className="px-3.5 py-2 bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-800">
                                                                Riwayat Sesi Latihan Grup
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
                                                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                                                        <span className="font-bold text-slate-900">
                                                                                            {session.session_number ? `Sesi ${session.session_number}:` : '•'}
                                                                                        </span>
                                                                                        <span className="text-slate-600">{session.name || 'Program Latihan Grup'}</span>
                                                                                        {session.is_extra && (
                                                                                            <span className="text-[9.5px] font-bold text-blue-700 bg-blue-50 border border-blue-200/70 px-1.5 py-0.2 rounded">
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
                                                                                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 text-[10px]">Selesai</span>
                                                                                    ) : (
                                                                                        <span className="text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60 text-[10px]">Terjadwal</span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-3.5 py-2 w-28 text-right">
                                                                                    {session.is_paid ? (
                                                                                        <span className="text-emerald-600 font-bold text-xs"><CheckCircle2 size={12} className="inline mr-1" /> Lunas</span>
                                                                                    ) : (
                                                                                        <span className="text-slate-400 font-bold text-xs">Belum Bayar</span>
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
                                            <td colSpan="7" className="px-5 py-8 text-center text-slate-400 text-xs font-medium italic">Tidak ada data grup.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ── 3. COACH TAB (WITH RICH MONTHLY BREAKDOWN) ── */}
                    {activeTab === 'coach' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[850px]">
                                <thead className="bg-slate-50/70 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-4 py-2.5 w-10"></th>
                                        <th className="px-4 py-2.5">Nama Pelatih</th>
                                        <th className="px-4 py-2.5 text-center">Sesi Individu</th>
                                        <th className="px-4 py-2.5 text-center">Sesi Grup</th>
                                        <th className="px-4 py-2.5 text-center">Jaga Gym</th>
                                        <th className="px-4 py-2.5 text-center">Total Sesi</th>
                                        <th className="px-4 py-2.5 text-right">Pencairan Terakhir</th>
                                        <th className="px-4 py-2.5 text-right">Belum Dicairkan</th>
                                        <th className="px-4 py-2.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
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
                                                    <td className="px-4 py-3">
                                                        <button onClick={() => toggleRow(`coach-${coach.id}`)} className="p-1 text-slate-400 hover:text-slate-800 rounded cursor-pointer">
                                                            {expandedRows.has(`coach-${coach.id}`) ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-8 h-8 rounded-md bg-orange-100 text-orange-700 font-black text-[11px] flex items-center justify-center shrink-0 border border-orange-200/60">
                                                                {coach.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-xs text-slate-900 block">{coach.name}</span>
                                                                <span className="text-[10px] text-slate-400 font-mono">@{coach.username || '-'}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className="inline-flex min-w-[1.75rem] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200/60">
                                                            {displayIndSessions}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className="inline-flex min-w-[1.75rem] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200/60">
                                                            {displayGrpSessions}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className="inline-flex min-w-[1.75rem] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200/60">
                                                            {displayGymSessions}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className="inline-flex min-w-[2rem] px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 font-black text-xs border border-orange-200/60">
                                                            {displayTotalSessions}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className="font-bold text-emerald-700 text-xs">{formatCurrency(coach.last_payout_amount || 0)}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        {displayUnpaidEarnings > 0 ? (
                                                            <span className="font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md text-xs border border-rose-200/60">
                                                                {formatCurrency(displayUnpaidEarnings)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                                                                Lunas
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            {selectedMonth !== 'all' && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDownloadCoachPdf(coach, selectedMonth)}
                                                                    disabled={exportingCoachKey === `${coach.id}-${selectedMonth}`}
                                                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-slate-700 hover:bg-slate-50 rounded-md text-xs font-semibold transition-all border border-slate-200/90 shadow-2xs cursor-pointer disabled:opacity-50"
                                                                    title={`Download Slip Gaji PDF (${selectedMonth})`}
                                                                >
                                                                    {exportingCoachKey === `${coach.id}-${selectedMonth}` ? (
                                                                        <Loader2 size={13} className="text-orange-600 animate-spin" />
                                                                    ) : (
                                                                        <FileText size={13} className="text-orange-600" />
                                                                    )}
                                                                    <span>Slip PDF</span>
                                                                </button>
                                                            )}
                                                            {coach.unpaid_sessions > 0 ? (
                                                                <button
                                                                    onClick={() => handlePayCoach(coach)}
                                                                    disabled={processing}
                                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-orange-600 text-white hover:bg-orange-700 rounded-md text-xs font-bold transition-all disabled:opacity-50 shadow-2xs cursor-pointer"
                                                                >
                                                                    <Banknote className="w-3.5 h-3.5" /> Cairkan
                                                                </button>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                                                                    <CheckCircle2 size={13} /> Lunas
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* ── Coach Expanded Details (Tabs for Monthly Recap & Session Details) ── */}
                                                {expandedRows.has(`coach-${coach.id}`) && (
                                                    <tr className="bg-slate-50/40">
                                                        <td colSpan="9" className="px-6 py-3 border-b border-slate-100">
                                                            <div className="bg-white border border-slate-200/80 rounded-md overflow-hidden shadow-2xs">
                                                                
                                                                {/* Sub Tabs in Coach Drill-down */}
                                                                <div className="px-3.5 py-2.5 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <button
                                                                            onClick={() => setCoachDetailTab(coach.id, 'monthly')}
                                                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                                                                activeCoachView === 'monthly'
                                                                                    ? 'bg-white text-orange-600 shadow-2xs border border-slate-200/70'
                                                                                    : 'text-slate-600 hover:text-slate-900 bg-transparent'
                                                                            }`}
                                                                        >
                                                                            <Calendar size={13} className={activeCoachView === 'monthly' ? 'text-orange-600' : 'text-slate-400'} />
                                                                            <span>Rekapitulasi Per Bulan ({monthlyList.length} Bulan)</span>
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setCoachDetailTab(coach.id, 'unpaid')}
                                                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                                                                activeCoachView === 'unpaid'
                                                                                    ? 'bg-white text-orange-600 shadow-2xs border border-slate-200/70'
                                                                                    : 'text-slate-600 hover:text-slate-900 bg-transparent'
                                                                            }`}
                                                                        >
                                                                            <Clock size={13} className={activeCoachView === 'unpaid' ? 'text-orange-600' : 'text-slate-400'} />
                                                                            <span>Sesi Belum Dicairkan ({unpaidSessionsList.length})</span>
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setCoachDetailTab(coach.id, 'all')}
                                                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                                                                activeCoachView === 'all'
                                                                                    ? 'bg-white text-orange-600 shadow-2xs border border-slate-200/70'
                                                                                    : 'text-slate-600 hover:text-slate-900 bg-transparent'
                                                                            }`}
                                                                        >
                                                                            <Layers size={13} className={activeCoachView === 'all' ? 'text-orange-600' : 'text-slate-400'} />
                                                                            <span>Seluruh Riwayat ({allSessionsList.length})</span>
                                                                        </button>
                                                                    </div>

                                                                    <div className="flex items-center gap-2">
                                                                        <div className="text-xs font-bold text-slate-700">
                                                                            Pelatih: <span className="text-orange-600">{coach.name}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* ── Subview 1: MONTHLY BREAKDOWN TABLE ── */}
                                                                {activeCoachView === 'monthly' && (
                                                                    <div className="overflow-x-auto">
                                                                        {monthlyList.length > 0 ? (
                                                                            <table className="w-full text-left">
                                                                                <thead className="bg-slate-50/80 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                                                                                    <tr>
                                                                                        <th className="px-4 py-2.5">Bulan Periode</th>
                                                                                        <th className="px-4 py-2.5 text-center">Individu</th>
                                                                                        <th className="px-4 py-2.5 text-center">Grup</th>
                                                                                        <th className="px-4 py-2.5 text-center">Jaga Gym</th>
                                                                                        <th className="px-4 py-2.5 text-center">Total Sesi</th>
                                                                                        <th className="px-4 py-2.5 text-right">Total Honor</th>
                                                                                        <th className="px-4 py-2.5 text-right">Status & Slip</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className="divide-y divide-slate-100 text-xs">
                                                                                    {monthlyList.map((mb) => {
                                                                                        const monthDetailKey = `${coach.id}-${mb.month_key}`;
                                                                                        const isMonthExpanded = expandedMonthDetail.has(monthDetailKey);

                                                                                        return (
                                                                                            <React.Fragment key={mb.month_key}>
                                                                                                <tr className="hover:bg-slate-50/60 transition-colors">
                                                                                                    <td className="px-4 py-2.5 font-bold text-slate-800">
                                                                                                        <div className="flex items-center gap-1.5">
                                                                                                            <button 
                                                                                                                onClick={() => toggleMonthDetail(monthDetailKey)}
                                                                                                                className="p-0.5 text-orange-600 hover:bg-orange-50 rounded cursor-pointer"
                                                                                                                title="Lihat rincian sesi bulan ini"
                                                                                                            >
                                                                                                                {isMonthExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                                                                            </button>
                                                                                                            <Calendar className="w-3.5 h-3.5 text-orange-500" />
                                                                                                            <span>{mb.month_label}</span>
                                                                                                        </div>
                                                                                                    </td>
                                                                                                    <td className="px-4 py-2.5 text-center text-slate-600">{mb.individual_sessions}</td>
                                                                                                    <td className="px-4 py-2.5 text-center text-slate-600">{mb.group_sessions}</td>
                                                                                                    <td className="px-4 py-2.5 text-center text-slate-600">{mb.gym_sessions}</td>
                                                                                                    <td className="px-4 py-2.5 text-center">
                                                                                                        <span className="font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                                                                                                            {mb.total_sessions}
                                                                                                        </span>
                                                                                                    </td>
                                                                                                    <td className="px-4 py-2.5 text-right font-black text-slate-900">
                                                                                                        {formatCurrency(mb.total_fee)}
                                                                                                    </td>
                                                                                                    <td className="px-4 py-2.5 text-right">
                                                                                                        <div className="flex items-center justify-end gap-2">
                                                                                                            {mb.unpaid_fee > 0 ? (
                                                                                                                <div className="inline-flex flex-col items-end">
                                                                                                                    <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60 text-[10.5px]">
                                                                                                                        Belum: {formatCurrency(mb.unpaid_fee)}
                                                                                                                    </span>
                                                                                                                    {mb.paid_fee > 0 && (
                                                                                                                        <span className="text-[9.5px] text-slate-400 font-medium mt-0.5">
                                                                                                                            Sudah: {formatCurrency(mb.paid_fee)}
                                                                                                                        </span>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            ) : (
                                                                                                                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 text-[10.5px]">
                                                                                                                    Lunas
                                                                                                                </span>
                                                                                                            )}
                                                                                                            <button
                                                                                                                type="button"
                                                                                                                onClick={() => handleDownloadCoachPdf(coach, mb.month_key, mb.month_label, mb.sessions)}
                                                                                                                disabled={exportingCoachKey === `${coach.id}-${mb.month_key}`}
                                                                                                                className="inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-orange-50 hover:text-orange-600 border border-slate-200 rounded text-[11px] font-bold text-slate-700 shadow-2xs cursor-pointer disabled:opacity-50"
                                                                                                                title={`Download Slip Gaji ${mb.month_label}`}
                                                                                                            >
                                                                                                                {exportingCoachKey === `${coach.id}-${mb.month_key}` ? (
                                                                                                                    <Loader2 size={11} className="text-orange-600 animate-spin" />
                                                                                                                ) : (
                                                                                                                    <FileText size={11} className="text-orange-600" />
                                                                                                                )}
                                                                                                                <span>Slip</span>
                                                                                                            </button>
                                                                                                        </div>
                                                                                                    </td>
                                                                                                </tr>

                                                                                                {/* Sub-row for Month Drill-down */}
                                                                                                {isMonthExpanded && (
                                                                                                    <tr className="bg-orange-50/20">
                                                                                                        <td colSpan="7" className="px-6 py-2.5 border-b border-orange-100">
                                                                                                            <div className="bg-white border border-slate-200/80 rounded-md p-3 shadow-2xs">
                                                                                                                <h4 className="text-[10.5px] font-bold text-slate-700 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                                                                                                                    <Calendar size={12} className="text-orange-600" />
                                                                                                                    Daftar Sesi Periode {mb.month_label} ({mb.sessions.length} Sesi)
                                                                                                                </h4>
                                                                                                                <div className="divide-y divide-slate-100">
                                                                                                                    {mb.sessions.map((item, idx) => (
                                                                                                                        <div key={idx} className="py-2 flex items-center justify-between text-xs hover:bg-slate-50/80 px-2 rounded-md transition-colors gap-3">
                                                                                                                            <div className="flex items-center gap-2 min-w-0 flex-wrap sm:flex-nowrap">
                                                                                                                                <span className="font-mono text-slate-500 w-20 shrink-0 font-bold">
                                                                                                                                    {item.date ? new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
                                                                                                                                </span>
                                                                                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                                                                                                                                    item.type === 'Grup' ? 'bg-orange-50 text-orange-700 border border-orange-200/60' :
                                                                                                                                    item.type === 'Jaga Gym' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                                                                                                                                    'bg-blue-50 text-blue-700 border border-blue-200/60'
                                                                                                                                }`}>
                                                                                                                                    {item.type}
                                                                                                                                </span>

                                                                                                                                <div className="flex items-center gap-1 shrink-0">
                                                                                                                                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs border border-slate-200 flex items-center gap-1">
                                                                                                                                        <User size={11} className="text-slate-500" />
                                                                                                                                        {item.client_name || item.user_name || 'Klien'}
                                                                                                                                    </span>
                                                                                                                                </div>

                                                                                                                                <span className="font-medium text-slate-700 truncate">
                                                                                                                                    {item.session_number ? <span className="font-bold text-orange-600 mr-1">#{item.session_number}</span> : ''}
                                                                                                                                    {item.name}
                                                                                                                                </span>
                                                                                                                            </div>
                                                                                                                            <div className="flex items-center gap-3 shrink-0">
                                                                                                                                <span className="font-black text-slate-900">{formatCurrency(item.fee)}</span>
                                                                                                                                {item.is_paid ? (
                                                                                                                                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">Lunas</span>
                                                                                                                                ) : (
                                                                                                                                    <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60">Belum</span>
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
                                                                            <div className="p-5 text-center text-xs text-slate-400 italic">
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
                                                                                <thead className="bg-slate-50/80 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                                                                                    <tr>
                                                                                        <th className="px-4 py-2.5 w-28">Tanggal</th>
                                                                                        <th className="px-4 py-2.5 w-24 text-center">Tipe Sesi</th>
                                                                                        <th className="px-4 py-2.5 w-40">Klien / Atlet / Grup</th>
                                                                                        <th className="px-4 py-2.5">Nama Sesi / Program</th>
                                                                                        <th className="px-4 py-2.5 w-24 text-center">Status</th>
                                                                                        <th className="px-4 py-2.5 w-28 text-right">Honor</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className="divide-y divide-slate-100">
                                                                                    {unpaidSessionsList.map(session => (
                                                                                        <tr key={session.id} className="hover:bg-slate-50/60 transition-colors">
                                                                                            <td className="px-4 py-2.5 font-semibold text-slate-700">
                                                                                                {session.date ? new Date(session.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                                                            </td>
                                                                                            <td className="px-4 py-2.5 text-center">
                                                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                                                                    session.type === 'Grup' ? 'bg-orange-50 text-orange-700 border border-orange-200/60' : 
                                                                                                    session.type === 'Jaga Gym' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 
                                                                                                    'bg-blue-50 text-blue-700 border border-blue-200/60'
                                                                                                }`}>
                                                                                                    {session.type}
                                                                                                </span>
                                                                                            </td>
                                                                                            <td className="px-4 py-2.5">
                                                                                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                                                                                    <User size={12} className="text-slate-400" />
                                                                                                    {session.client_name || '-'}
                                                                                                </div>
                                                                                                {session.client_sport && (
                                                                                                    <div className="text-[10px] text-slate-400 font-medium pl-4">{session.client_sport}</div>
                                                                                                )}
                                                                                            </td>
                                                                                            <td className="px-4 py-2.5">
                                                                                                <div className="flex items-center">
                                                                                                    {session.session_number ? (
                                                                                                        <span className="font-bold text-slate-900 mr-1.5">Sesi {session.session_number}:</span>
                                                                                                    ) : (
                                                                                                        <span className="font-bold text-slate-900 mr-1.5">•</span>
                                                                                                    )}
                                                                                                    <span className="text-slate-700 font-medium">{session.name}</span>
                                                                                                </div>
                                                                                                {session.notes && (
                                                                                                    <div className="text-[10.5px] text-slate-500 mt-0.5 italic pl-2.5 border-l-2 border-slate-200">
                                                                                                        {session.notes}
                                                                                                    </div>
                                                                                                )}
                                                                                            </td>
                                                                                            <td className="px-4 py-2.5 text-center">
                                                                                                {session.status === 'completed' ? (
                                                                                                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 text-[10px]">Selesai</span>
                                                                                                ) : (
                                                                                                    <span className="text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60 text-[10px]">Terjadwal</span>
                                                                                                )}
                                                                                            </td>
                                                                                            <td className="px-4 py-2.5 text-right font-black text-slate-900">
                                                                                                {formatCurrency(session.fee)}
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        ) : (
                                                                            <div className="p-5 text-center text-xs text-slate-400 italic">
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
                                                                                <thead className="bg-slate-50/80 border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                                                                                    <tr>
                                                                                        <th className="px-4 py-2.5 w-28">Tanggal</th>
                                                                                        <th className="px-4 py-2.5 w-24 text-center">Tipe Sesi</th>
                                                                                        <th className="px-4 py-2.5 w-40">Klien / Atlet / Grup</th>
                                                                                        <th className="px-4 py-2.5">Nama Sesi / Program</th>
                                                                                        <th className="px-4 py-2.5 w-24 text-center">Status Sesi</th>
                                                                                        <th className="px-4 py-2.5 w-28 text-right">Honor</th>
                                                                                        <th className="px-4 py-2.5 w-24 text-right">Status Bayar</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className="divide-y divide-slate-100">
                                                                                    {allSessionsList.map(session => (
                                                                                        <tr key={session.id} className="hover:bg-slate-50/60 transition-colors">
                                                                                            <td className="px-4 py-2.5 font-semibold text-slate-700">
                                                                                                {session.date ? new Date(session.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                                                            </td>
                                                                                            <td className="px-4 py-2.5 text-center">
                                                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                                                                    session.type === 'Grup' ? 'bg-orange-50 text-orange-700 border border-orange-200/60' : 
                                                                                                    session.type === 'Jaga Gym' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 
                                                                                                    'bg-blue-50 text-blue-700 border border-blue-200/60'
                                                                                                }`}>
                                                                                                    {session.type}
                                                                                                </span>
                                                                                            </td>
                                                                                            <td className="px-4 py-2.5">
                                                                                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                                                                                    <User size={12} className="text-slate-400" />
                                                                                                    {session.client_name || '-'}
                                                                                                </div>
                                                                                                {session.client_sport && (
                                                                                                    <div className="text-[10px] text-slate-400 font-medium pl-4">{session.client_sport}</div>
                                                                                                )}
                                                                                            </td>
                                                                                            <td className="px-4 py-2.5">
                                                                                                <div className="flex items-center">
                                                                                                    {session.session_number ? (
                                                                                                        <span className="font-bold text-slate-900 mr-1.5">Sesi {session.session_number}:</span>
                                                                                                    ) : (
                                                                                                        <span className="font-bold text-slate-900 mr-1.5">•</span>
                                                                                                    )}
                                                                                                    <span className="text-slate-700 font-medium">{session.name}</span>
                                                                                                </div>
                                                                                            </td>
                                                                                            <td className="px-4 py-2.5 text-center">
                                                                                                {session.status === 'completed' ? (
                                                                                                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 text-[10px]">Selesai</span>
                                                                                                ) : (
                                                                                                    <span className="text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60 text-[10px]">Terjadwal</span>
                                                                                                )}
                                                                                            </td>
                                                                                            <td className="px-4 py-2.5 text-right font-black text-slate-900">
                                                                                                {formatCurrency(session.fee)}
                                                                                            </td>
                                                                                            <td className="px-4 py-2.5 text-right">
                                                                                                {session.is_paid ? (
                                                                                                    <span className="text-emerald-600 font-bold text-xs inline-flex items-center gap-1">
                                                                                                        <CheckCircle2 size={12} /> Lunas
                                                                                                    </span>
                                                                                                ) : (
                                                                                                    <span className="text-rose-600 font-bold text-xs bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60">
                                                                                                        Belum
                                                                                                    </span>
                                                                                                )}
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        ) : (
                                                                            <div className="p-5 text-center text-xs text-slate-400 italic">
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
                                            <td colSpan="9" className="px-5 py-8 text-center text-slate-400 text-xs font-medium italic">
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
