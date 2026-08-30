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

    const filteredTrainings = useMemo(() => {
        return trainings.filter(t => {
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
    }, [trainings, searchTerm, statusFilter]);

    const expDate = sharedPackage.expiration_date
        ? new Date(sharedPackage.expiration_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : null;

    const startDate = sharedPackage.start_date
        ? new Date(sharedPackage.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
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

    return (
        <AppLayout title={sharedPackage.name}>
            <Head title={`Paket Bersama: ${sharedPackage.name}`} />

            <div className="space-y-4 pb-12 max-w-[1600px] mx-auto">
                {/* ─── PAGE HEADER ─── */}
                <PageHeader
                    title={sharedPackage.name}
                    description={`Paket Bersama Private • ${sharedPackage.package?.name || 'Paket Bersama'} (${usedSessions}/${totalSessions || '∞'} Sesi)`}
                    actions={
                        <div className="flex flex-wrap items-center gap-2">
                            <Link
                                href={route('admin.individual-trainings.index')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                <span>Kembali</span>
                            </Link>

                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-violet-700 rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit Paket</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsCreateSessionModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-xs font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Input Sesi Baru</span>
                            </button>
                        </div>
                    }
                />

                {/* ─── 2-COLUMN LAYOUT (KIRI & KANAN) ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    
                    {/* ═══════════════════════════════════════════════════════
                        KOLOM KIRI (5 Kolom di LG) — Ringkasan & Anggota Pool
                       ═══════════════════════════════════════════════════════ */}
                    <div className="lg:col-span-5 space-y-4">
                        
                        {/* 1. KARTU KUOTA & STATUS POOL */}
                        <div className="bg-white border border-slate-200/90 rounded-lg shadow-2xs overflow-hidden">
                            <div className="p-4 bg-gradient-to-br from-violet-50/60 via-white to-slate-50/40 border-b border-slate-100 flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-11 h-11 rounded-lg bg-violet-600 text-white flex items-center justify-center font-black shrink-0 shadow-2xs">
                                        <UsersRound className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-sm text-slate-900 truncate leading-tight">
                                            {sharedPackage.name}
                                        </h3>
                                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-violet-100/80 text-violet-800 border border-violet-200/60">
                                                <Package className="w-3 h-3 text-violet-600" />
                                                {sharedPackage.package?.name || 'Paket Master'}
                                            </span>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                                                sharedPackage.status === 'active'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                                                    : sharedPackage.status === 'completed'
                                                    ? 'bg-slate-50 text-slate-600 border-slate-200'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                                {sharedPackage.status === 'active' ? 'Aktif' : sharedPackage.status === 'completed' ? 'Selesai' : 'Kadaluarsa'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 space-y-4">
                                {/* Visual Progress Bar Pool */}
                                <div className="space-y-1.5 bg-slate-50/80 p-3 rounded-lg border border-slate-100">
                                    <div className="flex items-center justify-between text-xs font-semibold">
                                        <span className="text-slate-500 flex items-center gap-1">
                                            <Activity className="w-3.5 h-3.5 text-violet-600" />
                                            Penggunaan Kuota Bersama
                                        </span>
                                        <span className={`font-bold ${progress >= 100 ? 'text-rose-600' : isNearLimit ? 'text-amber-600' : 'text-violet-700'}`}>
                                            {usedSessions} / {totalSessions || '∞'} Sesi ({progress}%)
                                        </span>
                                    </div>
                                    {totalSessions && (
                                        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    progress >= 100
                                                        ? 'bg-rose-500'
                                                        : isNearLimit
                                                        ? 'bg-amber-500'
                                                        : 'bg-gradient-to-r from-violet-500 to-indigo-600'
                                                }`}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    )}
                                    <div className="flex justify-between text-[10.5px] text-slate-400 font-medium pt-0.5">
                                        <span>Terpakai: <strong>{usedSessions} sesi</strong></span>
                                        <span>Sisa: <strong className={isNearLimit ? 'text-amber-600 font-bold' : 'text-slate-700 font-bold'}>{remainingSessions ?? '∞'} sesi</strong></span>
                                    </div>
                                </div>

                                {/* 4 Grid Metrics */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="p-2.5 bg-violet-50/40 border border-violet-100 rounded-md">
                                        <span className="text-[9.5px] font-bold text-violet-500 uppercase block">Total Kuota</span>
                                        <span className="text-base font-black text-violet-900 mt-0.5 block">{totalSessions || '∞'} Sesi</span>
                                    </div>
                                    <div className="p-2.5 bg-emerald-50/40 border border-emerald-100 rounded-md">
                                        <span className="text-[9.5px] font-bold text-emerald-500 uppercase block">Terpakai</span>
                                        <span className="text-base font-black text-emerald-900 mt-0.5 block">{usedSessions} Sesi</span>
                                    </div>
                                    <div className={`p-2.5 ${isNearLimit ? 'bg-amber-50/40 border-amber-100' : 'bg-sky-50/40 border-sky-100'} border rounded-md`}>
                                        <span className={`text-[9.5px] font-bold ${isNearLimit ? 'text-amber-500' : 'text-sky-500'} uppercase block`}>Sisa Kuota</span>
                                        <span className={`text-base font-black ${isNearLimit ? 'text-amber-900' : 'text-sky-900'} mt-0.5 block`}>{remainingSessions ?? '∞'} Sesi</span>
                                    </div>
                                    <div className="p-2.5 bg-slate-50/70 border border-slate-200/80 rounded-md">
                                        <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Biaya Paket</span>
                                        <span className="text-xs font-black text-slate-800 mt-1 block truncate">{formatCurrency(sharedPackage.package?.price)}</span>
                                    </div>
                                </div>

                                {/* Metadata Tanggal & Coach */}
                                <div className="space-y-2 pt-1 border-t border-slate-100 text-xs text-slate-600">
                                    {(startDate || expDate) && (
                                        <div className="flex items-center justify-between py-1 bg-slate-50/60 px-2.5 rounded">
                                            <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                Masa Berlaku
                                            </span>
                                            <span className="font-semibold text-slate-800 text-[11px]">
                                                {startDate || '-'} s/d {expDate || 'Selamanya'}
                                            </span>
                                        </div>
                                    )}

                                    {sharedPackage.coaches && sharedPackage.coaches.length > 0 && (
                                        <div className="flex items-center justify-between py-1 bg-amber-50/40 px-2.5 rounded border border-amber-100/50">
                                            <span className="text-amber-700 flex items-center gap-1.5 font-medium">
                                                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                                                Pelatih Pendamping
                                            </span>
                                            <span className="font-bold text-amber-900 text-[11px] truncate max-w-[180px]">
                                                {sharedPackage.coaches.map(c => c.name).join(', ')}
                                            </span>
                                        </div>
                                    )}

                                    {sharedPackage.description && (
                                        <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-100 italic leading-relaxed">
                                            "{sharedPackage.description}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 2. KARTU ANGGOTA PAKET BERSAMA */}
                        <div className="bg-white border border-slate-200/90 rounded-lg shadow-2xs overflow-hidden">
                            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    <UsersRound className="w-3.5 h-3.5 text-violet-600" />
                                    Anggota Paket ({memberStats.length} Atlet)
                                </h3>
                                <span className="text-[10.5px] text-slate-400">Penggunaan Kuota</span>
                            </div>

                            <div className="p-3 divide-y divide-slate-100">
                                {memberStats.map((member) => {
                                    const memberPercent = totalSessions && totalSessions > 0
                                        ? Math.round((member.sessions_used / totalSessions) * 100)
                                        : 0;

                                    return (
                                        <div key={member.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group">
                                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                                <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden border border-violet-200/60 shadow-2xs">
                                                    {member.profile_photo_url ? (
                                                        <img src={member.profile_photo_url} alt={member.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span>{getInitials(member.name)}</span>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <Link 
                                                        href={route('admin.individual-trainings.show', member.id)}
                                                        className="font-bold text-xs text-slate-800 hover:text-violet-600 transition-colors block truncate"
                                                    >
                                                        {member.name}
                                                    </Link>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] text-slate-400 truncate">{member.sport || 'Atlet'}</span>
                                                        <span className="text-[9.5px] font-bold text-violet-700 bg-violet-50 px-1.5 py-0.2 rounded border border-violet-100">
                                                            {member.sessions_used} sesi ({memberPercent}%)
                                                        </span>
                                                    </div>
                                                    {/* Mini bar */}
                                                    <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                                                        <div 
                                                            className="h-full bg-violet-500 rounded-full"
                                                            style={{ width: `${Math.min(100, memberPercent)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Shortcut + Sesi */}
                                            <Link
                                                href={route('admin.individual-trainings.session.create', member.id)}
                                                className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-violet-50 border border-slate-200 hover:border-violet-200 text-slate-600 hover:text-violet-700 rounded-md text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                                                title={`Buat sesi baru untuk ${member.name}`}
                                            >
                                                <Plus size={11} />
                                                <span>Sesi</span>
                                            </Link>
                                        </div>
                                    );
                                })}

                                {memberStats.length === 0 && (
                                    <div className="text-center py-6 text-slate-400 text-xs">
                                        Belum ada anggota atlet terdaftar.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════
                        KOLOM KANAN (7 Kolom di LG) — Riwayat Sesi Latihan Pool
                       ═══════════════════════════════════════════════════════ */}
                    <div className="lg:col-span-7 space-y-4">
                        
                        <div className="bg-white border border-slate-200/90 rounded-lg shadow-2xs overflow-hidden">
                            {/* Feed Header with Search & Filters */}
                            <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2.5">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-violet-600" />
                                    <h3 className="text-xs font-bold text-slate-900">
                                        Riwayat Latihan Bersama ({filteredTrainings.length})
                                    </h3>
                                </div>

                                <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
                                    {/* Status Filter */}
                                    <div className="inline-flex p-0.5 bg-slate-100 rounded-md border border-slate-200/60 text-[11px]">
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
                                    <div className="relative w-36 sm:w-44">
                                        <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Cari sesi..."
                                            className="w-full pl-7 pr-6 py-1 bg-white border border-slate-200 rounded-md text-[11px] placeholder:text-slate-400 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all shadow-2xs"
                                        />
                                        {searchTerm && (
                                            <button type="button" onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                <X className="w-2.5 h-2.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Feed Items */}
                            <div className="divide-y divide-slate-100">
                                {filteredTrainings.length > 0 ? (
                                    filteredTrainings.map((training) => {
                                        const isCompleted = training.status === 'completed' || training.is_completed;
                                        const athletePhoto = training.user?.profile_photo_url;
                                        const blockCount = training.blocks?.length || 0;

                                        return (
                                            <Link
                                                key={training.id}
                                                href={route('admin.individual-trainings.session.show', training.id)}
                                                className="p-3.5 hover:bg-slate-50/80 transition-all flex items-start gap-3 group cursor-pointer block"
                                            >
                                                {/* Sesi Pool Number Badge */}
                                                <div className="flex flex-col items-center shrink-0 w-11">
                                                    <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center font-black border shadow-2xs ${
                                                        training.is_extra
                                                            ? 'bg-amber-50 text-amber-700 border-amber-200/70'
                                                            : 'bg-violet-50 text-violet-700 border-violet-200/80 group-hover:bg-violet-600 group-hover:text-white transition-all'
                                                    }`}>
                                                        <span className="text-[8px] uppercase tracking-wider font-bold opacity-80 leading-none">
                                                            {training.is_extra ? 'Extra' : 'Sesi'}
                                                        </span>
                                                        <span className="text-sm font-black leading-tight mt-0.5">
                                                            {training.is_extra ? '+' : (training.shared_session_number || training.session_number || '#')}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Sesi Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <h4 className="font-bold text-xs text-slate-900 group-hover:text-violet-600 transition-colors flex items-center gap-1.5">
                                                                <span>{training.name || 'Program Latihan'}</span>
                                                                {training.training_type && (
                                                                    <span className="text-[9.5px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                                                                        {training.training_type}
                                                                    </span>
                                                                )}
                                                            </h4>

                                                            {/* Athlete Info */}
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                                                                    <div className="w-4 h-4 rounded-full bg-slate-200 text-[8px] font-bold flex items-center justify-center overflow-hidden">
                                                                        {athletePhoto ? (
                                                                            <img src={athletePhoto} alt={training.user?.name} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <span>{getInitials(training.user?.name)}</span>
                                                                        )}
                                                                    </div>
                                                                    <span>{training.user?.name || 'Atlet'}</span>
                                                                </div>
                                                                {training.user?.sport && (
                                                                    <span className="text-[10px] text-slate-400">• {training.user.sport.name}</span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Status Badge */}
                                                        <div className="shrink-0 flex flex-col items-end gap-1">
                                                            {isCompleted ? (
                                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                                                                    <CheckCircle2 size={11} /> Selesai
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                                                                    <Clock size={11} /> Terjadwal
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Metadata row: Tanggal, Lokasi, Coach */}
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100/80">
                                                        <span className="inline-flex items-center gap-1">
                                                            <CalendarIcon className="w-3 h-3 text-slate-400" />
                                                            {formatDate(training.date)}
                                                        </span>
                                                        {training.location && (
                                                            <span className="inline-flex items-center gap-1">
                                                                <MapPin className="w-3 h-3 text-slate-400" />
                                                                {training.location}
                                                            </span>
                                                        )}
                                                        {training.coach && (
                                                            <span className="inline-flex items-center gap-1 text-slate-600">
                                                                <ShieldCheck className="w-3 h-3 text-amber-500" />
                                                                Coach: <strong>{training.coach.name}</strong>
                                                            </span>
                                                        )}
                                                        {blockCount > 0 && (
                                                            <span className="inline-flex items-center gap-1 text-slate-400 ml-auto">
                                                                <Layers className="w-3 h-3 text-violet-500" />
                                                                {blockCount} Blok Latihan
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Arrow */}
                                                <div className="self-center pl-1">
                                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-violet-600 group-hover:translate-x-0.5 transition-all" />
                                                </div>
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <div className="py-16 text-center space-y-3">
                                        <div className="w-12 h-12 rounded-full bg-violet-50 text-violet-500 mx-auto flex items-center justify-center border border-violet-100 shadow-2xs">
                                            <Dumbbell className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-1 max-w-sm mx-auto">
                                            <h4 className="text-xs font-bold text-slate-800">Belum Ada Sesi Latihan</h4>
                                            <p className="text-[11px] text-slate-400">
                                                Gunakan tombol "Input Sesi Baru" untuk menjadwalkan latihan bagi anggota paket bersama ini.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsCreateSessionModalOpen(true)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-xs font-bold shadow-2xs transition-all cursor-pointer"
                                        >
                                            <Plus size={12} /> Mulai Sesi Pertama
                                        </button>
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
                <div className="p-5 space-y-4">
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
                                <Plus size={16} />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-slate-900">Pilih Atlet untuk Sesi Latihan</h3>
                                <p className="text-[10.5px] text-slate-400">Sesi akan otomatis memotong kuota paket bersama ini.</p>
                            </div>
                        </div>
                        <button type="button" onClick={() => setIsCreateSessionModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {memberStats.map((member) => (
                            <Link
                                key={member.id}
                                href={route('admin.individual-trainings.session.create', member.id)}
                                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 transition-all group cursor-pointer"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center overflow-hidden border border-slate-200">
                                        {member.profile_photo_url ? (
                                            <img src={member.profile_photo_url} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span>{getInitials(member.name)}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <span className="font-bold text-xs text-slate-900 group-hover:text-violet-700 transition-colors block truncate">
                                            {member.name}
                                        </span>
                                        <span className="text-[10.5px] text-slate-400 block">{member.sport || 'Atlet'}</span>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 group-hover:translate-x-0.5 transition-transform">
                                    Buat Sesi <ArrowRight size={13} />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </Modal>

            {/* ─── MODAL EDIT PAKET BERSAMA ─── */}
            <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="2xl">
                <form onSubmit={handleUpdatePackage} className="p-5 space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Edit3 size={15} className="text-violet-600" />
                            Edit Paket Bersama
                        </h2>
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Paket Bersama *</label>
                            <input 
                                type="text"
                                value={editData.name}
                                onChange={e => setEditData('name', e.target.value)}
                                className="w-full text-xs rounded-md border-slate-200 focus:border-violet-500 focus:ring-violet-500 shadow-2xs"
                                required
                            />
                            {editErrors.name && <p className="text-rose-500 text-[11px] mt-1">{editErrors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Deskripsi / Catatan</label>
                            <textarea 
                                value={editData.description}
                                onChange={e => setEditData('description', e.target.value)}
                                rows="2"
                                className="w-full text-xs rounded-md border-slate-200 focus:border-violet-500 focus:ring-violet-500 shadow-2xs"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">Paket Master *</label>
                                <select 
                                    value={editData.subscription_package_id}
                                    onChange={e => setEditData('subscription_package_id', e.target.value)}
                                    className="w-full text-xs rounded-md border-slate-200 focus:border-violet-500 focus:ring-violet-500 shadow-2xs"
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
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">Masa Berlaku Mulai</label>
                                <input 
                                    type="date"
                                    value={editData.start_date}
                                    onChange={e => setEditData('start_date', e.target.value)}
                                    className="w-full text-xs rounded-md border-slate-200 focus:border-violet-500 focus:ring-violet-500 shadow-2xs"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">Masa Berlaku Sampai</label>
                                <input 
                                    type="date"
                                    value={editData.expiration_date}
                                    onChange={e => setEditData('expiration_date', e.target.value)}
                                    className="w-full text-xs rounded-md border-slate-200 focus:border-violet-500 focus:ring-violet-500 shadow-2xs"
                                />
                            </div>
                        </div>

                        {/* Coach Selection */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Penugasan Pelatih</label>
                            <div className="border border-slate-200 rounded-md p-2 max-h-28 overflow-y-auto space-y-1 bg-slate-50/50">
                                {coachesList.map(coach => (
                                    <label key={coach.id} className="flex items-center gap-2 p-1 hover:bg-white rounded cursor-pointer">
                                        <input 
                                            type="checkbox"
                                            checked={editData.coach_ids.includes(coach.id)}
                                            onChange={() => toggleCoach(coach.id)}
                                            className="rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                                        />
                                        <span className="text-xs text-slate-700">{coach.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Member Selection */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Anggota Atlet ({editData.member_ids.length} dipilih)</label>
                            <div className="border border-slate-200 rounded-md p-2 max-h-40 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-slate-50/50">
                                {allAthletes.map(athlete => (
                                    <label key={athlete.id} className={`flex items-center gap-2 p-1.5 border rounded cursor-pointer transition-all ${
                                        editData.member_ids.includes(athlete.id) 
                                            ? 'bg-violet-50 border-violet-200 font-bold text-violet-900' 
                                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                    }`}>
                                        <input 
                                            type="checkbox"
                                            checked={editData.member_ids.includes(athlete.id)}
                                            onChange={() => toggleMember(athlete.id)}
                                            className="rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                                        />
                                        <span className="text-xs truncate">{athlete.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={editProcessing}
                            className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-xs font-bold shadow-2xs cursor-pointer disabled:opacity-50"
                        >
                            {editProcessing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
