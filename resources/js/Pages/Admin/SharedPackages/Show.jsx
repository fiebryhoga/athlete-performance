import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Common/PageHeader';
import PageFooter from '@/Components/Common/PageFooter';
import Modal from '@/Components/Modal';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ChevronLeft,
    UsersRound,
    User,
    Calendar as CalendarIcon,
    Package,
    Activity,
    ArrowUpRight,
    MapPin,
    CheckCircle2,
    Clock,
    Search,
    X,
    Plus,
    Edit3,
    ShieldCheck,
    Dumbbell,
    Filter,
    Layers,
    Sparkles,
    Calendar,
    ChevronRight,
    ArrowRight
} from 'lucide-react';

function getInitials(name) {
    if (!name) return "??";
    const words = name.trim().split(" ");
    if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatCurrency(val) {
    if (!val && val !== 0) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
}

export default function Show({ 
    sharedPackage, 
    trainings = [], 
    memberStats = [], 
    totalSessions, 
    usedSessions, 
    remainingSessions,
    packagesList = [],
    allAthletes = [],
    coachesList = []
}) {
    const [cycleTab, setCycleTab] = useState('current'); // 'current' | 'history' | 'all'
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'completed' | 'scheduled'
    const [isCreateSessionModalOpen, setIsCreateSessionModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Edit form hook
    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        name: sharedPackage.name || '',
        description: sharedPackage.description || '',
        subscription_package_id: sharedPackage.subscription_package_id || '',
        start_date: sharedPackage.start_date ? sharedPackage.start_date.split('T')[0] : '',
        expiration_date: sharedPackage.expiration_date ? sharedPackage.expiration_date.split('T')[0] : '',
        member_ids: sharedPackage.members?.map(m => m.id) || [],
        coach_ids: sharedPackage.coaches?.map(c => c.id) || [],
    });

    const progress = totalSessions
        ? Math.min(100, Math.round((usedSessions / totalSessions) * 100))
        : 0;
    const isNearLimit = totalSessions && remainingSessions !== null && remainingSessions <= 3;
    const isExpired = sharedPackage.status === 'expired';
    const isCompleted = sharedPackage.status === 'completed';

    const currentTrainings = useMemo(() => trainings.filter(t => !t.is_athlete_paid), [trainings]);
    const historyTrainings = useMemo(() => trainings.filter(t => t.is_athlete_paid), [trainings]);

    const filteredTrainings = useMemo(() => {
        let baseList = trainings;
        if (cycleTab === 'current') {
            baseList = currentTrainings;
        } else if (cycleTab === 'history') {
            baseList = historyTrainings;
        }

        return baseList.filter(t => {
            if (searchTerm.trim()) {
                const q = searchTerm.toLowerCase();
                const matchName = t.name?.toLowerCase().includes(q);
                const matchAthlete = t.user?.name?.toLowerCase().includes(q);
                const matchCoach = t.coach?.name?.toLowerCase().includes(q);
                const matchLocation = t.location?.toLowerCase().includes(q);
                if (!matchName && !matchAthlete && !matchCoach && !matchLocation) return false;
            }

            if (statusFilter === 'completed') {
                if (t.status !== 'completed' && !t.is_completed) return false;
            } else if (statusFilter === 'scheduled') {
                if (t.status === 'completed' || t.is_completed) return false;
            }

            return true;
        });
    }, [trainings, currentTrainings, historyTrainings, cycleTab, searchTerm, statusFilter]);

    const expDate = sharedPackage.expiration_date
        ? new Date(sharedPackage.expiration_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        : null;

    const startDate = sharedPackage.start_date
        ? new Date(sharedPackage.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        : null;

    const handleUpdatePackage = (e) => {
        e.preventDefault();
        put(route('admin.shared-packages.update', sharedPackage.id), {
            onSuccess: () => setIsEditModalOpen(false),
        });
    };

    const toggleMember = (athleteId) => {
        let current = [...editData.member_ids];
        if (current.includes(athleteId)) {
            current = current.filter(id => id !== athleteId);
        } else {
            current.push(athleteId);
        }
        setEditData('member_ids', current);
    };

    const toggleCoach = (coachId) => {
        let current = [...editData.coach_ids];
        if (current.includes(coachId)) {
            current = current.filter(id => id !== coachId);
        } else {
            current.push(coachId);
        }
        setEditData('coach_ids', current);
    };

    // Back URL logic
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const fromParam = urlParams.get('from');
    const athleteIdParam = urlParams.get('athlete_id');

    let backUrl = route('admin.individual-trainings.index');
    let backLabel = "Kembali ke Program Latihan";

    if (fromParam === 'athlete' && athleteIdParam) {
        backUrl = route('admin.individual-trainings.show', athleteIdParam);
        backLabel = "Kembali ke Kalender Latihan";
    } else if (fromParam === 'recap') {
        backUrl = route('admin.reports.session-recap');
        backLabel = "Kembali ke Rekap Sesi";
    }

    return (
        <AppLayout title={sharedPackage.name}>
            <Head title={`Paket Bersama: ${sharedPackage.name}`} />

            <div className="space-y-4 pb-12 max-w-[1600px] mx-auto">
                {/* ─── BREADCRUMB & HEADER ─── */}
                <div className="space-y-1">
                    <Link
                        href={backUrl}
                        className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors gap-1.5"
                    >
                        <ChevronLeft size={13} /> {backLabel}
                    </Link>

                    <PageHeader
                        title={sharedPackage.name}
                        description={`Paket Latihan Privat Bersama (${usedSessions}/${totalSessions || '∞'} Sesi Terpakai)`}
                        actions={
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-orange-700 rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                                >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit Paket</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsCreateSessionModalOpen(true)}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-xs font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Input Sesi Baru</span>
                                </button>
                            </div>
                        }
                    />
                </div>

                {/* ─── 2-COLUMN LAYOUT (KIRI & KANAN) ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    
                    {/* ═══════════════════════════════════════════════════════
                        KOLOM KIRI (4 Kolom di LG) — Ringkasan & Anggota Pool
                       ═══════════════════════════════════════════════════════ */}
                    <div className="lg:col-span-4 space-y-4">
                        
                        {/* 1. KARTU KUOTA & STATUS POOL */}
                        <div className="bg-white border border-slate-200/90 rounded-lg shadow-2xs overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold shrink-0 shadow-2xs">
                                        <UsersRound className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-sm text-slate-900 truncate leading-tight">
                                            {sharedPackage.name}
                                        </h3>
                                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                                                <Package className="w-3 h-3 text-orange-500" />
                                                {sharedPackage.package?.name || 'Paket Master'}
                                            </span>
                                            <span className="text-slate-300">•</span>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-bold border shadow-2xs ${
                                                sharedPackage.status === 'active'
                                                    ? 'text-emerald-700 bg-gradient-to-r from-emerald-50 to-teal-50/70 border-emerald-200/70'
                                                    : sharedPackage.status === 'completed'
                                                    ? 'text-slate-600 bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200'
                                                    : 'text-amber-800 bg-gradient-to-r from-amber-50 to-orange-50/70 border-amber-200/70'
                                            }`}>
                                                {sharedPackage.status === 'active' ? 'Aktif' : sharedPackage.status === 'completed' ? 'Selesai' : 'Kadaluarsa'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 space-y-4">
                                {/* Visual Progress Bar Pool */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 font-medium">Penggunaan Kuota Bersama</span>
                                        <span className="font-bold text-slate-800">
                                            {usedSessions} / {totalSessions || '∞'} Sesi <span className="text-orange-600 font-bold">({progress}%)</span>
                                        </span>
                                    </div>
                                    {totalSessions && (
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    progress >= 100
                                                        ? 'bg-rose-500'
                                                        : isNearLimit
                                                        ? 'bg-amber-500'
                                                        : 'bg-orange-500'
                                                }`}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Clean Unified Stat Row (Tanpa background kotak-kotak) */}
                                <div className="grid grid-cols-4 divide-x divide-slate-100 border-y border-slate-100 py-3 text-center">
                                    <div className="px-1">
                                        <span className="text-[10px] text-slate-400 font-medium uppercase block">Total</span>
                                        <span className="text-xs font-bold text-slate-800 mt-0.5 block">{totalSessions || '∞'} Sesi</span>
                                    </div>
                                    <div className="px-1">
                                        <span className="text-[10px] text-slate-400 font-medium uppercase block">Terpakai</span>
                                        <span className="text-xs font-bold text-orange-600 mt-0.5 block">{usedSessions} Sesi</span>
                                    </div>
                                    <div className="px-1">
                                        <span className="text-[10px] text-slate-400 font-medium uppercase block">Sisa</span>
                                        <span className="text-xs font-bold text-slate-800 mt-0.5 block">{remainingSessions ?? '∞'} Sesi</span>
                                    </div>
                                    <div className="px-1">
                                        <span className="text-[10px] text-slate-400 font-medium uppercase block">Biaya</span>
                                        <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">{formatCurrency(sharedPackage.package?.price)}</span>
                                    </div>
                                </div>

                                {/* Metadata List Bersih */}
                                <div className="space-y-2 text-xs text-slate-600">
                                    {(startDate || expDate) && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400 font-medium">Masa Berlaku</span>
                                            <span className="font-semibold text-slate-700 text-[11px]">
                                                {startDate || '-'} s/d {expDate || 'Selamanya'}
                                            </span>
                                        </div>
                                    )}

                                    {sharedPackage.coaches && sharedPackage.coaches.length > 0 && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400 font-medium">Pelatih Pendamping</span>
                                            <span className="font-semibold text-slate-700 text-[11px] truncate max-w-[200px]">
                                                {sharedPackage.coaches.map(c => c.name).join(', ')}
                                            </span>
                                        </div>
                                    )}

                                    {sharedPackage.description && (
                                        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 italic">
                                            "{sharedPackage.description}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 2. KARTU ANGGOTA PAKET BERSAMA */}
                        <div className="bg-white border border-slate-200/90 rounded-lg shadow-2xs overflow-hidden">
                            <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    <UsersRound className="w-3.5 h-3.5 text-orange-600" />
                                    Anggota Paket ({memberStats.length} Atlet)
                                </h3>
                                <span className="text-[10px] text-slate-400">Penggunaan Kuota</span>
                            </div>

                            <div className="p-3 divide-y divide-slate-100">
                                {memberStats.map((member) => {
                                    const memberPercent = totalSessions && totalSessions > 0
                                        ? Math.round((member.sessions_used / totalSessions) * 100)
                                        : 0;

                                    return (
                                        <div key={member.id} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-2.5 group">
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700 font-bold text-[10px] flex items-center justify-center shrink-0 overflow-hidden border border-orange-200 shadow-2xs">
                                                    {member.profile_photo_url ? (
                                                        <img src={member.profile_photo_url} alt={member.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span>{getInitials(member.name)}</span>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <Link 
                                                        href={route('admin.individual-trainings.show', member.id)}
                                                        className="font-bold text-xs text-slate-800 hover:text-orange-600 transition-colors block truncate"
                                                    >
                                                        {member.name}
                                                    </Link>
                                                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                                        <span className="text-[9.5px] text-slate-400 truncate">{member.sport || 'Atlet'}</span>
                                                        <span className="text-[9px] font-bold text-orange-700 bg-orange-50 px-1 py-0.2 rounded border border-orange-100">
                                                            {member.sessions_used} sesi ({memberPercent}%)
                                                        </span>
                                                        {member.history_sessions > 0 && (
                                                            <span className="text-[8.5px] font-semibold text-slate-400">
                                                                • {member.history_sessions} sesi lalu
                                                            </span>
                                                        )}
                                                    </div>
                                                    {/* Mini bar */}
                                                    <div className="w-full h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                                        <div 
                                                            className="h-full bg-orange-500 rounded-full"
                                                            style={{ width: `${Math.min(100, memberPercent)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Shortcut + Sesi */}
                                            <Link
                                                href={route('admin.individual-trainings.session.create', member.id) + '?from=shared-package&package_id=' + sharedPackage.id}
                                                className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-slate-600 hover:text-orange-700 rounded text-[10.5px] font-semibold transition-all shadow-2xs cursor-pointer"
                                                title={`Buat sesi baru untuk ${member.name}`}
                                            >
                                                <Plus size={10} />
                                                <span>Sesi</span>
                                            </Link>
                                        </div>
                                    );
                                })}

                                {memberStats.length === 0 && (
                                    <div className="text-center py-4 text-slate-400 text-xs italic">
                                        Belum ada anggota atlet terdaftar.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════
                        KOLOM KANAN (8 Kolom di LG) — Riwayat Sesi Latihan Pool
                       ═══════════════════════════════════════════════════════ */}
                    <div className="lg:col-span-8 space-y-3">
                        
                        {/* ─── CYCLE TABS (Siklus Berjalan vs Riwayat Sebelumnya) ─── */}
                        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-lg border border-slate-200/70 text-xs">
                            <button
                                type="button"
                                onClick={() => setCycleTab('current')}
                                className={`flex-1 py-1.5 px-3 rounded-md font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                                    cycleTab === 'current'
                                        ? 'bg-white text-orange-700 shadow-2xs border border-orange-200/70'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <Sparkles size={12} className={cycleTab === 'current' ? 'text-orange-600' : 'text-slate-400'} />
                                <span>Siklus Berjalan</span>
                                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                                    cycleTab === 'current' ? 'bg-orange-100 text-orange-800' : 'bg-slate-200 text-slate-600'
                                }`}>
                                    {currentTrainings.length}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setCycleTab('history')}
                                className={`flex-1 py-1.5 px-3 rounded-md font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                                    cycleTab === 'history'
                                        ? 'bg-white text-slate-800 shadow-2xs border border-slate-200'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <Clock size={12} className={cycleTab === 'history' ? 'text-slate-700' : 'text-slate-400'} />
                                <span>Riwayat Selesai (Lunas)</span>
                                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                                    cycleTab === 'history' ? 'bg-slate-200 text-slate-800' : 'bg-slate-200 text-slate-600'
                                }`}>
                                    {historyTrainings.length}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setCycleTab('all')}
                                className={`py-1.5 px-3 rounded-md font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                                    cycleTab === 'all'
                                        ? 'bg-white text-slate-800 shadow-2xs border border-slate-200'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <span>Semua</span>
                                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                                    cycleTab === 'all' ? 'bg-slate-200 text-slate-800' : 'bg-slate-200 text-slate-600'
                                }`}>
                                    {trainings.length}
                                </span>
                            </button>
                        </div>

                        {/* ─── CYCLE CONTEXT BANNER ─── */}
                        {cycleTab === 'current' && (
                            <div className="bg-orange-50/70 border border-orange-200/80 rounded-lg p-2.5 flex items-center justify-between gap-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 font-bold">
                                        <Sparkles size={12} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[11.5px] text-orange-950">Sesi Siklus Kuota Berjalan (Saat Ini)</p>
                                        <p className="text-[10px] text-orange-700">Sesi yang sedang berjalan aktif dalam kuota paket bersama saat ini.</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-[11px] font-extrabold text-orange-900">{usedSessions}/{totalSessions || '∞'} Sesi Terpakai</span>
                                    <span className="text-[10px] text-orange-600 font-semibold block">(Sisa {remainingSessions ?? '∞'} sesi)</span>
                                </div>
                            </div>
                        )}

                        {cycleTab === 'history' && (
                            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 flex items-center justify-between gap-2 text-xs text-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 font-bold">
                                        <CheckCircle2 size={12} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[11.5px] text-slate-900">Riwayat Sesi Sebelumnya (Sudah Lunas)</p>
                                        <p className="text-[10px] text-slate-500">Sesi-sesi dari siklus sebelumnya yang telah ditandai lunas dan tersimpan sebagai arsip.</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-[11px] font-extrabold text-slate-800">{historyTrainings.length} Sesi Lunas</span>
                                </div>
                            </div>
                        )}

                        <div className="bg-white border border-slate-200/90 rounded-lg shadow-2xs overflow-hidden">
                            {/* Feed Header with Search & Filters */}
                            <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                    <Activity className="w-3.5 h-3.5 text-orange-600" />
                                    <h3 className="text-xs font-bold text-slate-900">
                                        {cycleTab === 'current'
                                            ? `Sesi Siklus Berjalan (${filteredTrainings.length})`
                                            : cycleTab === 'history'
                                                ? `Riwayat Sesi Selesai / Lunas (${filteredTrainings.length})`
                                                : `Semua Sesi (${filteredTrainings.length})`}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
                                    {/* Status Filter */}
                                    <div className="inline-flex p-0.5 bg-slate-100 rounded-md border border-slate-200/60 text-[10.5px]">
                                        <button
                                            type="button"
                                            onClick={() => setStatusFilter('all')}
                                            className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                                                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                                            }`}
                                        >
                                            Semua
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStatusFilter('completed')}
                                            className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                                                statusFilter === 'completed' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                                            }`}
                                        >
                                            Selesai
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStatusFilter('scheduled')}
                                            className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                                                statusFilter === 'scheduled' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                                            }`}
                                        >
                                            Terjadwal
                                        </button>
                                    </div>

                                    {/* Search Input */}
                                    <div className="relative w-32 sm:w-40">
                                        <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Cari sesi..."
                                            className="w-full pl-7 pr-5 py-0.5 bg-white border border-slate-200 rounded-md text-[11px] placeholder:text-slate-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-2xs"
                                        />
                                        {searchTerm && (
                                            <button type="button" onClick={() => setSearchTerm('')} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                <X className="w-2.5 h-2.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Feed Items */}
                            <div className="divide-y divide-slate-100">
                                {filteredTrainings.length > 0 ? (
                                    filteredTrainings.map((training, idx) => {
                                        const isPaid = Boolean(training.is_athlete_paid);
                                        const isCompleted = training.status === 'completed' || training.is_completed;
                                        const athletePhoto = training.user?.profile_photo_url;
                                        const blockCount = training.blocks?.length || 0;

                                        // In 'all' tab, show section divider when crossing from current to history
                                        const prevTraining = idx > 0 ? filteredTrainings[idx - 1] : null;
                                        const showHistoryDivider = cycleTab === 'all' && isPaid && (!prevTraining || !prevTraining.is_athlete_paid);
                                        const showCurrentDivider = cycleTab === 'all' && !isPaid && idx === 0;

                                        return (
                                            <React.Fragment key={training.id}>
                                                {showCurrentDivider && (
                                                    <div className="bg-orange-50/50 border-y border-orange-100 px-3 py-1.5 flex items-center justify-between text-[11px] font-bold text-orange-800">
                                                        <span className="flex items-center gap-1.5">
                                                            <Sparkles size={11} className="text-orange-600" /> Sesi Siklus Berjalan (Aktif)
                                                        </span>
                                                        <span className="text-[10px] font-semibold text-orange-600">{currentTrainings.length} Sesi</span>
                                                    </div>
                                                )}
                                                {showHistoryDivider && (
                                                    <div className="bg-slate-100/80 border-y border-slate-200 px-3 py-1.5 flex items-center justify-between text-[11px] font-bold text-slate-700">
                                                        <span className="flex items-center gap-1.5">
                                                            <Clock size={11} className="text-slate-500" /> Riwayat Sesi Sebelumnya (Sudah Lunas)
                                                        </span>
                                                        <span className="text-[10px] font-semibold text-slate-500">{historyTrainings.length} Sesi</span>
                                                    </div>
                                                )}
                                                <Link
                                                    href={route('admin.individual-trainings.session.show', training.id) + '?from=shared-package&package_id=' + sharedPackage.id}
                                                    className={`p-3 hover:bg-slate-50/80 transition-all flex items-start gap-2.5 group cursor-pointer block ${
                                                        isPaid ? 'bg-slate-50/30' : 'bg-white'
                                                    }`}
                                                >
                                                    {/* Sesi Pool Number Badge */}
                                                    <div className="flex flex-col items-center shrink-0 w-9">
                                                        <div className={`w-8 h-8 rounded-md flex flex-col items-center justify-center font-bold border shadow-2xs transition-all ${
                                                            training.is_extra
                                                                ? 'bg-amber-50 text-amber-700 border-amber-200/70'
                                                                : isPaid
                                                                    ? 'bg-slate-100 text-slate-600 border-slate-200/80 group-hover:bg-slate-700 group-hover:text-white'
                                                                    : 'bg-orange-50 text-orange-700 border-orange-200/80 group-hover:bg-orange-600 group-hover:text-white'
                                                        }`}>
                                                            <span className="text-[7.5px] uppercase tracking-wider font-semibold opacity-75 leading-none">
                                                                {training.is_extra ? 'Extra' : 'Sesi'}
                                                            </span>
                                                            <span className="text-xs font-black leading-none mt-0.5">
                                                                {training.is_extra ? '+' : (training.shared_session_number || training.session_number || '#')}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Sesi Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div>
                                                                <h4 className="font-bold text-xs text-slate-900 group-hover:text-orange-600 transition-colors flex items-center gap-1.5 flex-wrap">
                                                                    <span>{training.name || 'Program Latihan'}</span>
                                                                    {training.training_type && (
                                                                        <span className="text-[9px] font-medium text-slate-400 bg-slate-100 px-1 py-0.2 rounded">
                                                                            {training.training_type}
                                                                        </span>
                                                                    )}
                                                                </h4>

                                                                {/* Athlete Info */}
                                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                                    <div className="flex items-center gap-1 text-[10.5px] font-semibold text-slate-700">
                                                                        <div className="w-3.5 h-3.5 rounded-full bg-slate-200 text-[7.5px] font-bold flex items-center justify-center overflow-hidden">
                                                                            {athletePhoto ? (
                                                                                <img src={athletePhoto} alt={training.user?.name} className="w-full h-full object-cover" />
                                                                            ) : (
                                                                                <span>{getInitials(training.user?.name)}</span>
                                                                            )}
                                                                        </div>
                                                                        <span>{training.user?.name || 'Atlet'}</span>
                                                                    </div>
                                                                    {training.user?.sport && (
                                                                        <span className="text-[9.5px] text-slate-400">• {training.user.sport.name}</span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Status Badges */}
                                                            <div className="shrink-0 flex flex-col items-end gap-1">
                                                                <div className="flex items-center gap-1 flex-wrap justify-end">
                                                                    {/* Cycle Tag */}
                                                                    {isPaid ? (
                                                                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                                                                            <CheckCircle2 size={9} className="text-slate-500" /> Lunas (Lalu)
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded-md border border-orange-200/70 shadow-2xs">
                                                                            <Sparkles size={9} className="text-orange-600" /> Siklus Berjalan
                                                                        </span>
                                                                    )}

                                                                    {/* Completion Status Badge */}
                                                                    {isCompleted ? (
                                                                        <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70 shadow-2xs">
                                                                            <CheckCircle2 size={10} className="text-emerald-600" /> Selesai
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/70 shadow-2xs">
                                                                            <Clock size={10} className="text-amber-600" /> Terjadwal
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Metadata row: Tanggal, Lokasi, Coach */}
                                                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1.5 text-[10px] text-slate-500 pt-1.5 border-t border-slate-100/80">
                                                            <span className="inline-flex items-center gap-1">
                                                                <CalendarIcon className="w-2.5 h-2.5 text-slate-400" />
                                                                {formatDate(training.date)}
                                                            </span>
                                                            {training.location && (
                                                                <span className="inline-flex items-center gap-1">
                                                                    <MapPin className="w-2.5 h-2.5 text-slate-400" />
                                                                    {training.location}
                                                                </span>
                                                            )}
                                                            {training.coach && (
                                                                <span className="inline-flex items-center gap-1 text-slate-600">
                                                                    <ShieldCheck className="w-2.5 h-2.5 text-amber-500" />
                                                                    Coach: <strong>{training.coach.name}</strong>
                                                                </span>
                                                            )}
                                                            {blockCount > 0 && (
                                                                <span className="inline-flex items-center gap-1 text-slate-400 ml-auto">
                                                                    <Layers className="w-2.5 h-2.5 text-orange-500" />
                                                                    {blockCount} Blok
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Arrow */}
                                                    <div className="self-center pl-0.5">
                                                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
                                                    </div>
                                                </Link>
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <div className="py-12 text-center space-y-2.5">
                                        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 mx-auto flex items-center justify-center border border-orange-100 shadow-2xs">
                                            <Dumbbell className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-0.5 max-w-sm mx-auto">
                                            <h4 className="text-xs font-bold text-slate-800">
                                                {cycleTab === 'current'
                                                    ? 'Belum Ada Sesi pada Siklus Ini'
                                                    : cycleTab === 'history'
                                                        ? 'Belum Ada Riwayat Sesi Selesai'
                                                        : 'Belum Ada Sesi Latihan'}
                                            </h4>
                                            <p className="text-[10.5px] text-slate-400">
                                                {cycleTab === 'current'
                                                    ? 'Jadwalkan sesi latihan baru untuk anggota paket bersama pada kuota siklus ini.'
                                                    : 'Sesi yang sudah ditandai lunas akan tersimpan secara otomatis di riwayat.'}
                                            </p>
                                        </div>
                                        {cycleTab === 'current' && (
                                            <button
                                                type="button"
                                                onClick={() => setIsCreateSessionModalOpen(true)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-xs font-bold shadow-2xs transition-all cursor-pointer"
                                            >
                                                <Plus size={11} /> Input Sesi Baru
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <PageFooter className="!mt-8 !pt-4 !pb-1" />
            </div>

            {/* ─── MODAL PILIH ANGGOTA UNTUK INPUT SESI ─── */}
            <Modal show={isCreateSessionModalOpen} onClose={() => setIsCreateSessionModalOpen(false)} maxWidth="md">
                <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                                <Plus size={14} />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-slate-900">Pilih Atlet untuk Sesi Latihan</h3>
                                <p className="text-[10px] text-slate-400">Sesi akan otomatis memotong kuota paket bersama ini.</p>
                            </div>
                        </div>
                        <button type="button" onClick={() => setIsCreateSessionModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                            <X size={15} />
                        </button>
                    </div>

                    <div className="space-y-1.5">
                        {memberStats.map((member) => (
                            <Link
                                key={member.id}
                                href={route('admin.individual-trainings.session.create', member.id) + '?from=shared-package&package_id=' + sharedPackage.id}
                                className="flex items-center justify-between p-2.5 rounded-md border border-slate-200 hover:border-orange-300 hover:bg-orange-50/40 transition-all group cursor-pointer"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center overflow-hidden border border-slate-200">
                                        {member.profile_photo_url ? (
                                            <img src={member.profile_photo_url} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span>{getInitials(member.name)}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <span className="font-bold text-xs text-slate-900 group-hover:text-orange-700 transition-colors block truncate">
                                            {member.name}
                                        </span>
                                        <span className="text-[10px] text-slate-400 block">{member.sport || 'Atlet'}</span>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 group-hover:translate-x-0.5 transition-transform">
                                    Buat Sesi <ArrowRight size={12} />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </Modal>

            {/* ─── MODAL EDIT PAKET BERSAMA ─── */}
            <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="2xl">
                <form onSubmit={handleUpdatePackage} className="p-4 space-y-3.5">
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                        <h2 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Edit3 size={14} className="text-orange-600" />
                            Edit Paket Bersama
                        </h2>
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                            <X size={15} />
                        </button>
                    </div>

                    <div className="space-y-2.5 text-xs">
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nama Paket Bersama *</label>
                            <input 
                                type="text"
                                value={editData.name}
                                onChange={e => setEditData('name', e.target.value)}
                                className="w-full text-xs rounded-md border-slate-200 focus:border-orange-500 focus:ring-orange-500 shadow-2xs"
                                required
                            />
                            {editErrors.name && <p className="text-rose-500 text-[10.5px] mt-1">{editErrors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Deskripsi / Catatan</label>
                            <textarea 
                                value={editData.description}
                                onChange={e => setEditData('description', e.target.value)}
                                rows="2"
                                className="w-full text-xs rounded-md border-slate-200 focus:border-orange-500 focus:ring-orange-500 shadow-2xs"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Paket Master *</label>
                                <select 
                                    value={editData.subscription_package_id}
                                    onChange={e => setEditData('subscription_package_id', e.target.value)}
                                    className="w-full text-xs rounded-md border-slate-200 focus:border-orange-500 focus:ring-orange-500 shadow-2xs"
                                    required
                                >
                                    <option value="">-- Pilih Paket --</option>
                                    {packagesList.map(pkg => (
                                        <option key={pkg.id} value={pkg.id}>
                                            {pkg.name} ({pkg.session_count || '∞'} Sesi)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Masa Berlaku Mulai</label>
                                <input 
                                    type="date"
                                    value={editData.start_date}
                                    onChange={e => setEditData('start_date', e.target.value)}
                                    className="w-full text-xs rounded-md border-slate-200 focus:border-orange-500 focus:ring-orange-500 shadow-2xs"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Masa Berlaku Sampai</label>
                                <input 
                                    type="date"
                                    value={editData.expiration_date}
                                    onChange={e => setEditData('expiration_date', e.target.value)}
                                    className="w-full text-xs rounded-md border-slate-200 focus:border-orange-500 focus:ring-orange-500 shadow-2xs"
                                />
                            </div>
                        </div>

                        {/* Coach Selection */}
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Penugasan Pelatih</label>
                            <div className="border border-slate-200 rounded-md p-2 max-h-24 overflow-y-auto space-y-1 bg-slate-50/50">
                                {coachesList.map(coach => (
                                    <label key={coach.id} className="flex items-center gap-2 p-1 hover:bg-white rounded cursor-pointer">
                                        <input 
                                            type="checkbox"
                                            checked={editData.coach_ids.includes(coach.id)}
                                            onChange={() => toggleCoach(coach.id)}
                                            className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        <span className="text-xs text-slate-700">{coach.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Member Selection */}
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Anggota Atlet ({editData.member_ids.length} dipilih)</label>
                            <div className="border border-slate-200 rounded-md p-2 max-h-36 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-1 bg-slate-50/50">
                                {allAthletes.map(athlete => (
                                    <label key={athlete.id} className={`flex items-center gap-2 p-1.5 border rounded cursor-pointer transition-all ${
                                        editData.member_ids.includes(athlete.id) 
                                            ? 'bg-orange-50 border-orange-200 font-bold text-orange-900' 
                                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                    }`}>
                                        <input 
                                            type="checkbox"
                                            checked={editData.member_ids.includes(athlete.id)}
                                            onChange={() => toggleMember(athlete.id)}
                                            className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        <span className="text-xs truncate">{athlete.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={editProcessing}
                            className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-xs font-bold shadow-2xs cursor-pointer disabled:opacity-50"
                        >
                            {editProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
