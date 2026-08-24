import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Common/PageHeader';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ChevronLeft, 
    ChevronRight, 
    Plus, 
    Calendar as CalendarIcon, 
    Trash2, 
    User, 
    Users, 
    Activity, 
    Edit2, 
    MapPin, 
    Dumbbell, 
    Check, 
    CheckCircle2, 
    Clock, 
    Timer, 
    X, 
    Target, 
    Package, 
    Copy, 
    Download,
    ShieldCheck
} from 'lucide-react';

export default function ShowGroup({ auth, group, trainings = [], groupTrainings = [] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
    const [sessionToDuplicate, setSessionToDuplicate] = useState(null);
    const [duplicateDate, setDuplicateDate] = useState('');

    const deleteSession = (e, sessionId) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Yakin ingin menghapus sesi latihan grup ini?')) {
            router.delete(route('admin.group-trainings.session.destroy', sessionId), { preserveScroll: true });
        }
    };

    const getLocalDateStr = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const todayStr = getLocalDateStr(new Date());

    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const days = [];
        const firstDayOfWeek = firstDay.getDay(); 
        
        // Prev month padding
        for (let i = firstDayOfWeek; i > 0; i--) {
            const d = new Date(year, month, 1 - i);
            days.push({ date: d, isCurrentMonth: false, dateStr: getLocalDateStr(d) });
        }
        
        // Current month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const d = new Date(year, month, i);
            days.push({ date: d, isCurrentMonth: true, dateStr: getLocalDateStr(d) });
        }
        
        // Next month padding to fill exactly 42 slots (6 weeks)
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            const d = new Date(year, month + 1, i);
            days.push({ date: d, isCurrentMonth: false, dateStr: getLocalDateStr(d) });
        }
        
        // Attach sessions
        return days.map(day => ({
            ...day,
            sessions: trainings.filter(t => (t.date || '').substring(0, 10) === day.dateStr),
            isToday: day.dateStr === todayStr
        }));
    }, [currentDate, trainings, todayStr]);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
    
    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    const maxSession = useMemo(() => {
        if (!trainings || trainings.length === 0) return 0;
        return Math.max(...trainings.map(t => t.session_number || 0));
    }, [trainings]);

    const totalSessionsCount = trainings ? trainings.length : 0;
    const completedSessionsCount = useMemo(() => {
        if (!trainings) return 0;
        return trainings.filter(t => t.status === 'completed' || t.is_completed).length;
    }, [trainings]);

    const expDate = group.training_exp_date 
        ? new Date(group.training_exp_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        : null;

    const getInitials = (name) => {
        if (!name) return "G";
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <AppLayout title={`Kalender Latihan - ${group.name}`}>
            <Head title={`Kalender Latihan - ${group.name}`} />
            
            <div className="space-y-4 pb-12">
                {/* ─── BREADCRUMB & HEADER ─── */}
                <div className="space-y-1">
                    <Link
                        href={route('admin.individual-trainings.index')}
                        className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors gap-1.5"
                    >
                        <ChevronLeft size={13} /> Kembali ke Program Latihan
                    </Link>

                    <PageHeader 
                        title={`Program Latihan ${group.name}`}
                        description="Pantau dan kelola jadwal program latihan grup dalam tampilan kalender."
                        actions={
                            <div className="flex items-center gap-2">
                                <a
                                    href={route('admin.reports.sessions.export-group', group.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-semibold shadow-2xs hover:shadow-xs transition-all"
                                >
                                    <Download size={13} />
                                    <span>Download Laporan Sesi</span>
                                </a>
                                <Link
                                    href={route('admin.individual-trainings.index')}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-semibold shadow-2xs transition-colors"
                                >
                                    <ChevronLeft size={13} />
                                    <span>Kembali</span>
                                </Link>
                            </div>
                        }
                    />
                </div>

                {/* ─── GROUP PROFILE HERO CARD ─── */}
                <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden hover:border-slate-300 transition-all">
                    {/* Hero Banner Strip */}
                    <div className="relative h-16 sm:h-20 bg-gradient-to-r from-white via-indigo-50/30 to-amber-50/40 border-b border-slate-100 p-3.5 flex justify-end items-start overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
                        <span className="relative z-10 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-slate-200/90 text-slate-700 text-[10.5px] font-bold px-2.5 py-0.5 rounded-md shadow-2xs">
                            <Users size={12} className="text-indigo-600" />
                            <span>Grup Latihan</span>
                        </span>
                    </div>

                    {/* Group Details */}
                    <div className="px-4 pb-3.5 pt-2 sm:pt-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="relative -mt-8 sm:-mt-10 w-14 h-14 sm:w-16 sm:h-16 rounded-md border-[2.5px] border-white shadow-xs overflow-hidden bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-700 font-bold text-lg flex items-center justify-center shrink-0 z-10">
                                    <span>{getInitials(group.name)}</span>
                                </div>

                                <div className="space-y-0.5 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                                            {group.name}
                                        </h2>
                                        {group.members_count !== undefined && (
                                            <span className="text-[10.5px] text-slate-400 font-medium">
                                                {group.members_count} Anggota Atlet
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
                                        {group.package ? (
                                            <span className="text-orange-700 font-semibold flex items-center gap-1">
                                                <Package size={11} className="text-orange-500" />
                                                {group.package.name} ({group.package.package_type === 'per_session' ? 'Per Pertemuan' : `${maxSession}/${group.package.session_count || '∞'} Sesi`})
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">Tidak Ada Paket</span>
                                        )}
                                        {expDate && (
                                            <span className="text-[11px] text-slate-400">
                                                • Aktif s/d {expDate}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Summary Metrics */}
                            <div className="flex items-center gap-4 self-end sm:self-auto shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                                <div className="text-right">
                                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">
                                        Total Jadwal
                                    </span>
                                    <span className="text-xs font-bold text-slate-900">
                                        {totalSessionsCount} <span className="text-[10px] text-slate-400 font-normal">sesi</span>
                                    </span>
                                </div>
                                <div className="w-px h-6 bg-slate-100" />
                                <div className="text-right">
                                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block">
                                        Selesai
                                    </span>
                                    <span className="text-xs font-bold text-emerald-600">
                                        {completedSessionsCount} <span className="text-[10px] text-slate-400 font-normal">sesi</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── MAIN CALENDAR VIEW ─── */}
                <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden flex flex-col">
                    {/* Calendar Toolbar */}
                    <div className="px-4 py-2.5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
                        {/* Month Navigation */}
                        <div className="flex items-center gap-2.5">
                            <div className="flex items-center gap-1.5">
                                <CalendarIcon size={14} className="text-orange-500" />
                                <h3 className="text-xs font-bold text-slate-900 tracking-tight min-w-[130px]">
                                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </h3>
                            </div>
                            <div className="flex items-center rounded-md border border-slate-200 bg-white shadow-2xs overflow-hidden">
                                <button 
                                    type="button"
                                    onClick={prevMonth}
                                    className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                                    title="Bulan Sebelumnya"
                                >
                                    <ChevronLeft size={13} />
                                </button>
                                <div className="w-px h-3.5 bg-slate-200" />
                                <button 
                                    type="button"
                                    onClick={goToToday}
                                    className="px-2 py-0.5 text-[11px] font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    Hari Ini
                                </button>
                                <div className="w-px h-3.5 bg-slate-200" />
                                <button 
                                    type="button"
                                    onClick={nextMonth}
                                    className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                                    title="Bulan Berikutnya"
                                >
                                    <ChevronRight size={13} />
                                </button>
                            </div>
                        </div>

                        {/* Legend Dots */}
                        <div className="flex items-center gap-2.5 text-[10.5px] text-slate-500 font-medium">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Grup
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Selesai
                            </span>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="flex-1 overflow-x-auto">
                        <div className="min-w-[800px]">
                            {/* Day Names Header */}
                            <div className="grid grid-cols-7 border-b border-slate-200/80 bg-slate-50/80">
                                {dayNames.map((day, idx) => (
                                    <div 
                                        key={day} 
                                        className={`py-2 text-center text-[10.5px] font-bold uppercase tracking-wider ${
                                            idx === 0 || idx === 6 ? 'text-orange-600/80' : 'text-slate-600'
                                        }`}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>
                            
                            {/* Calendar Days */}
                            <div className="grid grid-cols-7 auto-rows-fr bg-slate-200/40 gap-px">
                                {calendarDays.map((day, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`min-h-[120px] p-2 flex flex-col group transition-colors relative ${
                                            !day.isCurrentMonth 
                                                ? 'bg-slate-50/40' 
                                                : 'bg-white hover:bg-slate-50/40'
                                        }`}
                                    >
                                        {/* Day Header */}
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className={`w-5 h-5 flex items-center justify-center rounded-md text-xs ${
                                                day.isToday 
                                                    ? 'bg-orange-500 text-white font-bold shadow-2xs' 
                                                    : day.isCurrentMonth 
                                                        ? 'text-slate-800 font-bold' 
                                                        : 'text-slate-400 font-medium'
                                            }`}>
                                                {day.date.getDate()}
                                            </div>
                                            {auth.user.role !== 'athlete' && (
                                                <Link 
                                                    href={route('admin.group-trainings.session.create', { group: group.id, date: day.dateStr })}
                                                    className="w-5 h-5 flex items-center justify-center rounded-md bg-slate-100 text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-orange-500 hover:text-white transition-all shadow-2xs cursor-pointer"
                                                    title="Tambah Sesi Grup"
                                                >
                                                    <Plus size={11} strokeWidth={2.5} />
                                                </Link>
                                            )}
                                        </div>
                                        
                                        {/* Sessions List */}
                                        <div className="flex-1 space-y-1.5 overflow-y-auto pr-0.5 custom-scrollbar">
                                            {day.sessions.map(session => {
                                                const isCompleted = session.status === 'completed' || session.is_completed;
                                                const sessionUrl = route('admin.group-trainings.session.show', session.id);

                                                return (
                                                    <Link 
                                                        key={session.id} 
                                                        href={sessionUrl}
                                                        className={`group/session relative rounded-md border text-left flex flex-col transition-all shadow-2xs hover:shadow-xs overflow-hidden block cursor-pointer ${
                                                            isCompleted
                                                                ? 'bg-white border-emerald-200 hover:border-emerald-400'
                                                                : session.is_extra
                                                                    ? 'bg-white border-orange-200/90 hover:border-orange-400'
                                                                    : 'bg-white border-indigo-200/80 hover:border-indigo-400'
                                                        }`}
                                                    >
                                                        {/* Top Header Strip inside card */}
                                                        <div className={`px-2 py-0.5 flex items-center justify-between gap-1 border-b ${
                                                            isCompleted
                                                                ? 'bg-emerald-50/70 border-emerald-100 text-emerald-800'
                                                                : session.is_extra
                                                                    ? 'bg-orange-50/70 border-orange-100 text-orange-800'
                                                                    : 'bg-indigo-50/70 border-indigo-100 text-indigo-800'
                                                        }`}>
                                                            <div className="flex items-center gap-1.5 min-w-0">
                                                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                                                    isCompleted 
                                                                        ? 'bg-emerald-500' 
                                                                        : session.is_extra 
                                                                            ? 'bg-orange-500' 
                                                                            : 'bg-indigo-500'
                                                                }`} />
                                                                <span className="text-[9.5px] font-bold tracking-tight truncate">
                                                                    {session.is_extra ? 'Tambahan' : `Sesi ${session.session_number}/${group.package?.session_count || '∞'}`}
                                                                </span>
                                                            </div>

                                                            {/* Action Buttons & Status Icon */}
                                                            <div className="flex items-center gap-0.5 shrink-0">
                                                                {auth.user.role !== 'athlete' && (
                                                                    <div className="flex items-center" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                setSessionToDuplicate(session);
                                                                                setDuplicateDate(getLocalDateStr(new Date()));
                                                                                setDuplicateModalOpen(true);
                                                                            }}
                                                                            className="p-0.5 rounded-md hover:bg-white/80 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                                                                            title="Duplikasi"
                                                                        >
                                                                            <Copy size={10} />
                                                                        </button>
                                                                        <Link
                                                                            href={route('admin.group-trainings.session.edit', session.id)}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            className="p-0.5 rounded-md hover:bg-white/80 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                                                                            title="Edit"
                                                                        >
                                                                            <Edit2 size={10} />
                                                                        </Link>
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                deleteSession(e, session.id);
                                                                            }}
                                                                            className="p-0.5 rounded-md hover:bg-white/80 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                                                                            title="Hapus"
                                                                        >
                                                                            <Trash2 size={10} />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                {isCompleted ? (
                                                                    <CheckCircle2 size={12} className="text-emerald-600" />
                                                                ) : (
                                                                    <Clock size={12} className="text-slate-400" />
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Card Body */}
                                                        <div className="p-2 block w-full hover:bg-slate-50/50 transition-colors">
                                                            {/* Title */}
                                                            <div className="text-[11px] font-bold leading-tight line-clamp-2 text-slate-900 group-hover/session:text-orange-600 transition-colors mb-1">
                                                                [GRUP] {session.name || group.name}
                                                            </div>

                                                            {/* Tags */}
                                                            <div className="flex flex-wrap items-center gap-1 text-[10px] text-slate-500 font-medium">
                                                                {session.training_type && (
                                                                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/80 px-1.5 py-0.5 rounded-md text-[9.5px] truncate max-w-full">
                                                                        <Dumbbell size={9} className="text-orange-500 shrink-0" />
                                                                        <span className="truncate">{session.training_type}</span>
                                                                    </span>
                                                                )}
                                                                {session.location && (
                                                                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/80 px-1.5 py-0.5 rounded-md text-[9.5px] truncate max-w-full" title={session.location}>
                                                                        <MapPin size={9} className="text-orange-500 shrink-0" />
                                                                        <span className="truncate">{session.location}</span>
                                                                    </span>
                                                                )}
                                                                {session.duration_minutes && (
                                                                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/80 px-1.5 py-0.5 rounded-md text-[9.5px]">
                                                                        <Timer size={9} className="text-orange-500 shrink-0" />
                                                                        <span>{session.duration_minutes}m</span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Duplicate Modal */}
            {duplicateModalOpen && sessionToDuplicate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-md border border-slate-200/90 shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                            <h3 className="text-xs font-bold text-slate-900">Duplikasi Sesi Latihan Grup</h3>
                            <button 
                                onClick={() => setDuplicateModalOpen(false)} 
                                className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                        <div className="p-4 space-y-3 text-xs">
                            <div className="bg-slate-50 border border-slate-200/80 rounded-md p-2.5">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Sesi yang Diduplikasi:</p>
                                <p className="font-bold text-slate-900">[GRUP] {sessionToDuplicate.name || group.name}</p>
                                {sessionToDuplicate.training_type && (
                                    <p className="text-[11px] text-slate-500 mt-0.5">{sessionToDuplicate.training_type}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 mb-1">Tanggal Tujuan</label>
                                <input 
                                    type="date" 
                                    value={duplicateDate}
                                    onChange={(e) => setDuplicateDate(e.target.value)}
                                    className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-orange-400 focus:border-orange-400 shadow-2xs"
                                />
                            </div>
                        </div>
                        <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 flex justify-end gap-2">
                            <button 
                                onClick={() => setDuplicateModalOpen(false)}
                                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={() => {
                                    if (!duplicateDate) return;
                                    router.post(route('admin.group-trainings.session.duplicate', sessionToDuplicate.id), { target_date: duplicateDate }, {
                                        preserveScroll: true,
                                        onSuccess: () => setDuplicateModalOpen(false)
                                    });
                                }}
                                className="px-3.5 py-1.5 text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-2xs transition-colors"
                            >
                                Duplikasi Sesi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 10px;
                }
            `}</style>
        </AppLayout>
    );
}
