import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Layout/PageHeader';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Trash2, User, Activity, Edit2, PenLine, MapPin, Dumbbell, Check, X } from 'lucide-react';

export default function ShowAthlete({ auth, athlete, trainings }) {
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
        return days.map(day => ({
            ...day,
            sessions: trainings.filter(t => t.date === day.dateStr),
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

    return (
        <AppLayout title={`Kalender Latihan - ${athlete.name}`}>
            <Head title={`Kalender Latihan - ${athlete.name}`} />
            
            <PageHeader 
                title={`Program Latihan: ${athlete.name}`}
                subtitle="Pantau dan kelola jadwal pelatihan individu dalam tampilan kalender."
                badge="Calendar"
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
                {/* Athlete Profile Summary */}
                <div className="bg-white p-4 md:p-6 border border-slate-200 rounded-xl flex items-center gap-4 md:gap-6 shadow-sm">
                    <div className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                        {athlete.profile_photo_url ? (
                            <img src={athlete.profile_photo_url} alt={athlete.name} className="h-full w-full object-cover" />
                        ) : (
                            <User className="h-6 w-6 md:h-8 md:w-8 text-slate-400" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-slate-900">{athlete.name}</h2>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 md:mt-2">
                            <span className="text-[10px] md:text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                                {athlete.sport?.name || 'UMUM'}
                            </span>
                            <span className="text-xs md:text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                                <Activity size={14} className="text-slate-400" />
                                {trainings.length > 0 ? trainings[trainings.length - 1].session_number : 0} Total Sesi
                            </span>
                        </div>
                    </div>
                </div>

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
                                            {day.sessions.map(session => (
                                                <div 
                                                    key={session.id} 
                                                    className={`group/session relative p-1.5 rounded-md border text-left flex flex-col gap-1 transition-all shadow-sm ${
                                                        session.status === 'completed' 
                                                        ? 'bg-green-50 border-green-200 hover:border-green-400' 
                                                        : 'bg-orange-50 border-orange-200 hover:border-orange-400'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-1">
                                                        <div className="flex-1 min-w-0">
                                                                <Link 
                                                                    href={route('admin.individual-trainings.session.show', session.id)}
                                                                    className="block"
                                                                >
                                                                    <div className={`text-[11px] font-bold leading-tight line-clamp-2 ${
                                                                        session.status === 'completed' ? 'text-green-800' : 'text-orange-900'
                                                                    }`}>
                                                                        {session.name || 'Sesi Latihan'}
                                                                    </div>
                                                                    <div className="mt-1 flex items-center gap-1">
                                                                        <span className={`text-[8.5px] font-semibold px-1 py-0.5 rounded ${
                                                                            session.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                                        }`}>
                                                                            Sesi {session.session_number}
                                                                        </span>
                                                                        <span className={`text-[8.5px] font-semibold truncate ${
                                                                            session.status === 'completed' ? 'text-green-600' : 'text-orange-600'
                                                                        }`}>
                                                                            • {session.training_type || 'Umum'}
                                                                        </span>
                                                                    </div>
                                                                </Link>
                                                        </div>
                                                        
                                                        {auth.user.role !== 'athlete' && (
                                                            <div className="flex flex-col gap-0.5 opacity-0 group-hover/session:opacity-100 transition-opacity">
                                                                <Link
                                                                    href={route('admin.individual-trainings.session.edit', session.id)}
                                                                    className={`p-0.5 rounded inline-flex items-center justify-center ${session.status === 'completed' ? 'hover:bg-green-200 text-green-700' : 'hover:bg-orange-200 text-orange-700'}`}
                                                                    title="Edit Program"
                                                                >
                                                                    <Edit2 size={10} />
                                                                </Link>
                                                                <button 
                                                                    onClick={(e) => deleteSession(e, session.id)}
                                                                    className={`p-0.5 rounded inline-flex items-center justify-center ${session.status === 'completed' ? 'hover:bg-green-200 text-red-600' : 'hover:bg-orange-200 text-red-600'}`}
                                                                    title="Hapus"
                                                                >
                                                                    <Trash2 size={10} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
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
