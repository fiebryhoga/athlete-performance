import React, { useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, Plus, Calendar, Dumbbell, Trash2, User } from 'lucide-react';

export default function ShowAthlete({ auth, athlete, trainings, exercises = [], packages = [] }) {
    // Generate dates: from today to +7 days buffer
    const groupedDates = useMemo(() => {
        const groups = [];
        let currentGroup = null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 7);

        const startDate = new Date(athlete?.created_at || today);
        startDate.setHours(0, 0, 0, 0);
        
        if (startDate > today) {
            startDate.setTime(today.getTime());
        }

        for (let d = new Date(endDate); d >= startDate; d.setDate(d.getDate() - 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const monthYear = d.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
            
            if (!currentGroup || currentGroup.monthYear !== monthYear) {
                if (currentGroup) groups.push(currentGroup);
                currentGroup = {
                    monthYear,
                    days: []
                };
            }
            
            const sessions = trainings.filter(t => t.date === dateStr);
            const isToday = dateStr === today.toISOString().split('T')[0];
            const dayName = d.toLocaleString('id-ID', { weekday: 'short' });

            currentGroup.days.push({
                date: dateStr,
                dayNum: d.getDate(),
                dayName: dayName,
                isToday,
                isFuture: d > today,
                sessions: sessions
            });
        }
        
        if (currentGroup) groups.push(currentGroup);
        return groups;
    }, [trainings, athlete]);

    const getProgramIcon = (logic) => {
        switch (logic) {
            case 'warm_up': return <div className="w-2 h-2 rounded-full bg-orange-400"></div>;
            case 'main_exercise': return <div className="w-2 h-2 rounded-full bg-blue-500"></div>;
            case 'cooling_down': return <div className="w-2 h-2 rounded-full bg-teal-400"></div>;
            case 'instruction': return <div className="w-2 h-2 rounded-full bg-purple-400"></div>;
            default: return <div className="w-2 h-2 rounded-full bg-zinc-400"></div>;
        }
    };

    const getProgramLabel = (logic) => {
        switch (logic) {
            case 'warm_up': return 'Pemanasan';
            case 'main_exercise': return 'Latihan Inti';
            case 'cooling_down': return 'Pendinginan';
            case 'instruction': return 'Instruksi / Catatan';
            default: return logic || 'Umum';
        }
    };

    const deleteSession = (sessionId) => {
        if (confirm('Yakin ingin menghapus sesi latihan ini?')) {
            router.delete(route('admin.individual-trainings.session.destroy', sessionId));
        }
    };

    return (
        <AppLayout title={`Training Log - ${athlete.name}`}>
            <Head title={`Training Log - ${athlete.name}`} />
            
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Training Log Individual</h1>
                    <p className="text-gray-600">Linimasa sesi latihan atlet.</p>
                </div>
                <Link
                    href={route('admin.individual-trainings.index')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                    <ChevronLeft size={16} /> Kembali ke Daftar
                </Link>
            </div>

            {/* Athlete Profile Summary */}
            <div className="bg-white p-6 border border-zinc-200 rounded-xl mb-8 flex items-center gap-6 shadow-sm">
                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400">
                    <User size={32} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-zinc-900">{athlete.name}</h2>
                    <div className="flex items-center gap-4 mt-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-600">
                            {athlete.sport?.name || 'Tidak ada cabang olahraga'}
                        </span>
                        <span className="text-sm font-medium text-zinc-500">
                            Bergabung: {new Date(athlete.created_at).toLocaleDateString('id-ID')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Timeline View */}
            <div className="space-y-12">
                {groupedDates.map((group, gIndex) => (
                    <div key={gIndex} className="relative">
                        <div className="sticky top-[72px] z-10 bg-[#fafafa] py-3 mb-6">
                            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={16} />
                                {group.monthYear}
                            </h3>
                        </div>
                        
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[35px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
                            {group.days.map((dayData, dIndex) => (
                                <div key={dIndex} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    
                                    {/* Timeline dot */}
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#fafafa] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${
                                        dayData.isToday ? 'bg-[#ff4d00]' : 
                                        dayData.sessions.length > 0 ? 'bg-zinc-800' : 'bg-zinc-200'
                                    }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${dayData.isToday || dayData.sessions.length > 0 ? 'bg-white' : 'bg-zinc-400'}`}></div>
                                    </div>

                                    {/* Content Card */}
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl border border-zinc-200 shadow-sm transition-all hover:shadow-md hover:border-zinc-300">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className={`text-2xl font-black ${dayData.isToday ? 'text-[#ff4d00]' : 'text-zinc-900'}`}>{dayData.dayNum}</span>
                                                    <span className="text-sm font-bold text-zinc-400 uppercase tracking-wide">{dayData.dayName}</span>
                                                </div>
                                                {dayData.isToday && <span className="text-[10px] font-bold bg-[#ff4d00]/10 text-[#ff4d00] px-2 py-0.5 rounded-full mt-1 inline-block">HARI INI</span>}
                                            </div>
                                            
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={route('admin.individual-trainings.session.create', { user: athlete.id, date: dayData.date })}
                                                    className="text-zinc-300 hover:text-zinc-900 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
                                                    title="Tambah Sesi"
                                                >
                                                    <Plus size={16} />
                                                </Link>
                                            </div>
                                        </div>

                                        {dayData.sessions.length === 0 ? (
                                            <div className="text-center py-6 bg-zinc-50 rounded-lg border border-zinc-100 border-dashed">
                                                <p className="text-xs font-semibold text-zinc-400">Tidak ada sesi latihan</p>
                                                {!dayData.isFuture && (
                                                    <p className="text-[10px] text-zinc-300 mt-1">Hari istirahat atau terlewat</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {dayData.sessions.map((session, sIndex) => (
                                                    <div key={sIndex} className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
                                                        <div className="flex items-center justify-between mb-3 border-b border-zinc-200 pb-3">
                                                            <div>
                                                                <span className="text-[10px] font-bold text-zinc-500 bg-white px-2 py-1 rounded-md border border-zinc-200 uppercase tracking-wider">
                                                                    Sesi {session.session_number}
                                                                </span>
                                                                {(session.training_type || session.location) && (
                                                                    <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-zinc-700">
                                                                        {session.training_type && <span>{session.training_type}</span>}
                                                                        {session.training_type && session.location && <span className="text-zinc-300">•</span>}
                                                                        {session.location && <span>@ {session.location}</span>}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <button 
                                                                onClick={() => deleteSession(session.id)}
                                                                className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-md transition-colors"
                                                                title="Hapus Sesi"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>

                                                        {session.programs && session.programs.length > 0 ? (
                                                            <div className="space-y-2">
                                                                {session.programs.map((prog, pIndex) => (
                                                                    <div key={pIndex} className="flex gap-3 text-sm">
                                                                        <div className="mt-1.5 shrink-0">
                                                                            {getProgramIcon(prog.logic)}
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            {prog.phase === 'TEXT_BLOCK' ? (
                                                                                <div className="bg-white p-3 rounded-lg border border-zinc-100">
                                                                                    <span className="text-xs font-bold text-purple-600 block mb-1">CATATAN UMUM</span>
                                                                                    <p className="text-zinc-700 text-sm italic">{prog.notes}</p>
                                                                                </div>
                                                                            ) : (
                                                                                <div>
                                                                                    <div className="font-semibold text-zinc-900">
                                                                                        {prog.exercise ? prog.exercise.name : prog.phase}
                                                                                    </div>
                                                                                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-zinc-600">
                                                                                        {prog.sets && prog.reps && (
                                                                                            <span className="font-medium bg-zinc-200/50 px-1.5 py-0.5 rounded">
                                                                                                {prog.sets} × {prog.reps}
                                                                                            </span>
                                                                                        )}
                                                                                        {prog.duration && <span><span className="text-zinc-400">Dur:</span> {prog.duration}</span>}
                                                                                        {prog.rest && <span><span className="text-zinc-400">Rest:</span> {prog.rest}</span>}
                                                                                        {prog.intensity && <span><span className="text-zinc-400">Int:</span> {prog.intensity}</span>}
                                                                                    </div>
                                                                                    {prog.notes && <div className="text-xs text-zinc-500 mt-1 italic opacity-80">Catatan: {prog.notes}</div>}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-4 bg-white rounded-lg border border-zinc-100 border-dashed">
                                                                <p className="text-xs text-zinc-400">Belum ada konten latihan untuk sesi ini</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
