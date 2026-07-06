import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Layout/PageHeader';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Trash2, User, Activity, Edit2, PenLine, MapPin, Dumbbell, Check, CheckCircle2, Clock, Timer, X, Target, Package } from 'lucide-react';

export default function ShowAthlete({ auth, athlete, trainings, groupTrainings }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const deleteSession = (e, sessionId) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Yakin ingin menghapus sesi latihan ini?')) {
            router.delete(route('admin.individual-trainings.session.destroy', sessionId), { preserveScroll: true });
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
        
        // Start on Sunday: 0, Google Calendar usually starts on Sunday.
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
        return days.map(day => {
            const indTrainings = trainings.filter(t => (t.date || '').substring(0, 10) === day.dateStr).map(t => ({...t, type: 'individual'}));
            const grpTrainings = (groupTrainings || []).filter(t => (t.date || '').substring(0, 10) === day.dateStr).map(t => ({...t, type: 'group'}));
            return {
                ...day,
                sessions: [...indTrainings, ...grpTrainings].sort((a, b) => a.id - b.id),
                isToday: day.dateStr === todayStr
            };
        });
    }, [currentDate, trainings, groupTrainings, todayStr]);

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

    const expDate = athlete.training_exp_date 
        ? new Date(athlete.training_exp_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        : null;

    const packageBadge = athlete.package 
        ? `Paket: ${athlete.package.name} (Sesi ${maxSession}/${athlete.package.session_count})${expDate ? ` • Masa Aktif Sampai ${expDate}` : ''}`
        : 'Tidak Ada Paket';

    return (
        <AppLayout title={`Kalender Latihan - ${athlete.name}`}>
            <Head title={`Kalender Latihan - ${athlete.name}`} />
            
            <PageHeader 
                title={`Program Latihan ${athlete.name}`}
                subtitle="Pantau dan kelola jadwal program latihan dalam tampilan kalender."
                badge={`Program Latihan • ${packageBadge}`}
                icon={CalendarIcon}
                actions={
                    <Link
                        href={route('admin.individual-trainings.index')}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <ChevronLeft size={16} /> Kembali
                    </Link>
                }
            />

            <div className="pb-12 space-y-6">
                {/* Calendar View */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    {/* Calendar Header */}
                    <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-xl font-bold text-slate-900 w-48">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h3>
                            <div className="flex items-center rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
                                <button 
                                    onClick={prevMonth}
                                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <div className="w-px h-5 bg-slate-200"></div>
                                <button 
                                    onClick={goToToday}
                                    className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                                >
                                    Hari Ini
                                </button>
                                <div className="w-px h-5 bg-slate-200"></div>
                                <button 
                                    onClick={nextMonth}
                                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="flex-1 overflow-x-auto">
                        <div className="min-w-[800px]">
                            {/* Day Names Header */}
                            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                                {dayNames.map(day => (
                                    <div key={day} className="py-2.5 text-center text-[11px] font-bold text-slate-500">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            
                            {/* Calendar Days */}
                            <div className="grid grid-cols-7 auto-rows-fr bg-slate-200 gap-px border-l border-slate-200">
                                {calendarDays.map((day, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`min-h-[120px] bg-white p-2 flex flex-col group transition-colors ${!day.isCurrentMonth ? 'bg-slate-50/50' : ''}`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold ${
                                                day.isToday 
                                                    ? 'bg-[#ff4d00] text-white shadow-sm' 
                                                    : day.isCurrentMonth 
                                                        ? 'text-slate-700' 
                                                        : 'text-slate-400'
                                            }`}>
                                                {day.date.getDate()}
                                            </div>
                                            {auth.user.role !== 'athlete' && (
                                                <Link 
                                                    href={route('admin.individual-trainings.session.create', { user: athlete.id, date: day.dateStr })}
                                                    className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-[#ff4d00] hover:text-white transition-all shadow-sm"
                                                    title="Tambah Sesi"
                                                >
                                                    <Plus size={14} strokeWidth={2.5} />
                                                </Link>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
                                            {day.sessions.map(session => {
                                                const isGroup = session.type === 'group';
                                                
                                                // Base colors
                                                let bgColor = '';
                                                let borderColor = '';
                                                let hoverBorderColor = '';
                                                let titleColor = '';
                                                let badgeBgColor = '';
                                                let badgeTextColor = '';
                                                let subtitleColor = '';

                                                if (isGroup) {
                                                    // Group styling
                                                    bgColor = 'bg-white';
                                                    borderColor = 'border-slate-200 border-l-[3px] border-l-indigo-400';
                                                    hoverBorderColor = 'hover:border-slate-300 hover:border-l-indigo-500';
                                                    titleColor = 'text-indigo-700';
                                                    badgeBgColor = 'bg-indigo-50 border border-indigo-100';
                                                    badgeTextColor = 'text-indigo-700';
                                                    subtitleColor = 'text-slate-500';
                                                } else {
                                                    // Individual styling
                                                    let isCompleted = session.status === 'completed' || session.is_completed;
                                                    bgColor = 'bg-white';
                                                    borderColor = isCompleted ? 'border-slate-200 border-l-[3px] border-l-emerald-400' : 'border-slate-200 border-l-[3px] border-l-orange-400';
                                                    hoverBorderColor = isCompleted ? 'hover:border-slate-300 hover:border-l-emerald-500' : 'hover:border-slate-300 hover:border-l-orange-500';
                                                    titleColor = isCompleted ? 'text-emerald-700' : 'text-orange-600';
                                                    badgeBgColor = isCompleted ? 'bg-emerald-50 border border-emerald-100' : 'bg-orange-50 border border-orange-100';
                                                    badgeTextColor = isCompleted ? 'text-emerald-700' : 'text-orange-700';
                                                    subtitleColor = 'text-slate-500';
                                                }

                                                return (
                                                <div 
                                                    key={`${session.type}-${session.id}`} 
                                                    className={`group/session relative p-2 rounded-lg border text-left flex flex-col gap-1.5 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 ${bgColor} ${borderColor} ${hoverBorderColor}`}
                                                >
                                                    <Link 
                                                        href={isGroup 
                                                            ? route('admin.group-trainings.session.show', session.id) 
                                                            : route('admin.individual-trainings.session.show', session.id)}
                                                        className="block w-full"
                                                    >
                                                        {/* Header: Badge & Status */}
                                                        <div className="flex items-start justify-between mb-1.5">
                                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${badgeBgColor} ${badgeTextColor}`}>
                                                                Sesi {session.session_number}/{isGroup ? (session.group?.package?.session_count || '∞') : (athlete.package?.session_count || '∞')}
                                                            </span>
                                                            <div className="flex items-center gap-1">
                                                                {auth.user.role !== 'athlete' && !isGroup && (
                                                                    <div className="flex items-center gap-0.5 opacity-0 group-hover/session:opacity-100 transition-opacity">
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                router.get(route('admin.individual-trainings.session.edit', session.id));
                                                                            }}
                                                                            className={`p-1 rounded inline-flex items-center justify-center ${session.status === 'completed' ? 'hover:bg-green-200 text-green-700' : 'hover:bg-orange-200 text-orange-700'}`}
                                                                            title="Edit Program"
                                                                        >
                                                                            <Edit2 size={10} />
                                                                        </button>
                                                                        <button 
                                                                            onClick={(e) => deleteSession(e, session.id)}
                                                                            className={`p-1 rounded inline-flex items-center justify-center ${session.status === 'completed' ? 'hover:bg-green-200 text-red-600' : 'hover:bg-orange-200 text-red-600'}`}
                                                                            title="Hapus"
                                                                        >
                                                                            <Trash2 size={10} />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                {session.status === 'completed' || session.is_completed ? (
                                                                    <CheckCircle2 size={12} className={isGroup ? 'text-purple-500' : 'text-green-500'} />
                                                                ) : (
                                                                    <Clock size={12} className={isGroup ? 'text-indigo-400' : 'text-orange-400'} />
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Title */}
                                                        <div className={`text-xs font-bold leading-snug line-clamp-2 ${titleColor}`}>
                                                            {isGroup ? `[GRUP] ${session.group?.name || 'Sesi Grup'}` : (session.name || 'Sesi Privat')}
                                                        </div>

                                                        {/* Details */}
                                                        <div className="mt-1.5 flex flex-col gap-1">
                                                            {session.training_type && (
                                                                <div className={`text-[9.5px] font-semibold flex items-center gap-1.5 ${subtitleColor}`}>
                                                                    <Dumbbell size={10} className="shrink-0" />
                                                                    <span className="truncate">{session.training_type}</span>
                                                                </div>
                                                            )}
                                                            {session.location && (
                                                                <div className={`text-[9.5px] font-semibold flex items-center gap-1.5 ${subtitleColor}`}>
                                                                    <MapPin size={10} className="shrink-0" />
                                                                    <span className="truncate">{session.location}</span>
                                                                </div>
                                                            )}
                                                            {session.duration_minutes && (
                                                                <div className={`text-[9.5px] font-semibold flex items-center gap-1.5 ${subtitleColor}`}>
                                                                    <Timer size={10} className="shrink-0" />
                                                                    <span className="truncate">{session.duration_minutes} Menit</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Link>
                                                </div>
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
            
            <style jsx>{`
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
