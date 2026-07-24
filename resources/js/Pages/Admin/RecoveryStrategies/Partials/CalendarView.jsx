import React, { useState, useEffect } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import { X, Calendar as CalendarIcon, Save, ChevronLeft, ChevronRight, Clock, Plus, Target, HeartPulse, CheckCircle2 } from 'lucide-react';
import PageHeader from '@/Components/Layout/PageHeader';
import AppLayout from '@/Layouts/AppLayout';

export default function CalendarView({ strategies, isGroup, entity }) {
    const { auth } = usePage().props;
    const isAthlete = auth.user.role === 'athlete';

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStrategy, setEditingStrategy] = useState(null);

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const strategyTypes = ["Ice Bath", "Massage", "Active Recovery", "Sleep Optimization", "Stretching/Yoga", "Nutrition/Hydration", "Pool Session", "Compression Garments", "Other"];

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const getLocalDateStr = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const openModal = (dateStr, strategy = null) => {
        // Athletes cannot create new strategies, only view/edit existing ones
        if (isAthlete && !strategy) return;
        
        setSelectedDate(dateStr);
        setEditingStrategy(strategy);
        setIsModalOpen(true);
    };

    const calendarDays = React.useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];
        const firstDayOfWeek = firstDay.getDay(); 
        
        for (let i = firstDayOfWeek; i > 0; i--) {
            const d = new Date(year, month, 1 - i);
            days.push({
                date: d,
                dateStr: getLocalDateStr(d),
                isCurrentMonth: false,
                isToday: getLocalDateStr(d) === getLocalDateStr(new Date())
            });
        }
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const d = new Date(year, month, i);
            days.push({
                date: d,
                dateStr: getLocalDateStr(d),
                isCurrentMonth: true,
                isToday: getLocalDateStr(d) === getLocalDateStr(new Date())
            });
        }
        const remainingCells = 42 - days.length;
        for (let i = 1; i <= remainingCells; i++) {
            const d = new Date(year, month + 1, i);
            days.push({
                date: d,
                dateStr: getLocalDateStr(d),
                isCurrentMonth: false,
                isToday: getLocalDateStr(d) === getLocalDateStr(new Date())
            });
        }
        return days;
    }, [currentDate]);

    const getStrategiesForDate = (dateStr) => {
        if (!strategies) return [];
        return strategies.filter(s => s.scheduled_date === dateStr);
    };

    return (
        <AppLayout title={`Recovery Strategi - ${entity.name}`}>
            <PageHeader 
                title={`Recovery Strategi ${entity.name}`}
                subtitle={isAthlete ? 'Pantau dan tandai status jadwal recovery Anda.' : `Kelola jadwal recovery untuk ${isGroup ? 'grup' : 'klien'} ini.`}
                badge="Recovery"
                icon={HeartPulse}
            />

            <div className="pb-12 space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-xl font-bold text-slate-900 w-48">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h3>
                            <div className="flex items-center bg-slate-100 rounded-lg p-1">
                                <button onClick={prevMonth} className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-md transition-all">
                                    <ChevronLeft size={18} />
                                </button>
                                <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-all">
                                    Today
                                </button>
                                <button onClick={nextMonth} className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-md transition-all">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        <div className="min-w-[800px]">
                            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                                {dayNames.map(day => (
                                    <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 last:border-0">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 auto-rows-fr bg-slate-200 gap-px border-l border-slate-200">
                                {calendarDays.map((day, idx) => {
                                    const dayStrategies = getStrategiesForDate(day.dateStr);
                                    
                                    return (
                                        <div key={idx} className={`min-h-[120px] bg-white p-2 flex flex-col group transition-colors ${!day.isCurrentMonth ? 'bg-slate-50/50' : ''}`}>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${
                                                    day.isToday ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30' : 
                                                    day.isCurrentMonth ? 'text-slate-700' : 'text-slate-400'
                                                }`}>
                                                    {day.date.getDate()}
                                                </span>
                                                {!isAthlete && (
                                                    <button 
                                                        onClick={() => openModal(day.dateStr)}
                                                        className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-orange-500 transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-1.5">
                                                {dayStrategies.map(strategy => (
                                                    <div 
                                                        key={strategy.id}
                                                        onClick={() => openModal(day.dateStr, strategy)}
                                                        className={`px-2 py-1.5 border rounded-lg text-xs font-semibold truncate cursor-pointer transition-colors flex items-center justify-between ${
                                                            strategy.is_completed 
                                                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100' 
                                                                : 'bg-sky-50 border-sky-100 text-sky-700 hover:bg-sky-100'
                                                        }`}
                                                    >
                                                        <span>{strategy.type}</span>
                                                        {strategy.is_completed && <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <StrategyModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    date={selectedDate}
                    strategy={editingStrategy}
                    isGroup={isGroup}
                    entity={entity}
                    strategyTypes={strategyTypes}
                    isAthlete={isAthlete}
                />
            )}
        </AppLayout>
    );
}

function StrategyModal({ isOpen, onClose, date, strategy, isGroup, entity, strategyTypes, isAthlete }) {
    const isCustomStrategy = strategy && !strategyTypes.includes(strategy.type);
    
    const { data, setData, post, put, delete: destroy, processing, errors, transform } = useForm({
        type: isCustomStrategy ? 'Other' : (strategy?.type || strategyTypes[0]),
        custom_type: isCustomStrategy ? strategy.type : '',
        scheduled_date: date,
        notes: strategy?.notes || '',
        is_completed: strategy?.is_completed || false,
        athlete_note: strategy?.athlete_note || '',
    });

    transform((data) => ({
        ...data,
        type: data.type === 'Other' ? data.custom_type : data.type,
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isAthlete && strategy) {
            post(route('admin.recovery-strategies.complete', strategy.id), {
                onSuccess: () => onClose()
            });
            return;
        }

        if (strategy) {
            put(route('admin.recovery-strategies.update', strategy.id), {
                onSuccess: () => onClose()
            });
        } else {
            const url = isGroup 
                ? route('admin.recovery-strategies.group.store', entity.id)
                : route('admin.recovery-strategies.store', entity.id);
            post(url, {
                onSuccess: () => onClose()
            });
        }
    };

    const handleDelete = () => {
        if(confirm('Hapus strategi ini?')) {
            destroy(route('admin.recovery-strategies.destroy', strategy.id), {
                onSuccess: () => onClose()
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2.5">
                        <div className="p-1.5 bg-white rounded-lg shadow-sm text-sky-500 border border-slate-200">
                            {isAthlete ? <CheckCircle2 size={18} /> : <HeartPulse size={18} />}
                        </div>
                        {isAthlete ? 'Feedback Strategy' : (strategy ? 'Edit Strategy' : 'Tambah Strategy')}
                    </h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-all">
                        <X size={18} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {isAthlete ? (
                        <>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                                <div>
                                    <p className="text-xs font-bold text-slate-400">Tanggal</p>
                                    <p className="text-sm font-semibold text-slate-800">{data.scheduled_date}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400">Tipe Strategy</p>
                                    <p className="text-sm font-semibold text-slate-800">{strategy.type}</p>
                                </div>
                                {strategy.notes && (
                                    <div>
                                        <p className="text-xs font-bold text-slate-400">Catatan Pelatih</p>
                                        <p className="text-sm text-slate-700 whitespace-pre-line">{strategy.notes}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="pt-2">
                                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input 
                                        type="checkbox" 
                                        checked={data.is_completed} 
                                        onChange={e => setData('is_completed', e.target.checked)}
                                        className="w-5 h-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                                    />
                                    <span className="font-semibold text-slate-800">Tandai telah selesai dilakukan</span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Feedback / Catatan Atlet (Opsional)</label>
                                <textarea 
                                    value={data.athlete_note} 
                                    onChange={e => setData('athlete_note', e.target.value)} 
                                    rows="3" 
                                    placeholder="Bagaimana perasaan Anda setelah melakukan strategi ini?"
                                    className="w-full rounded-lg border-slate-200 bg-white focus:ring-sky-500 focus:border-sky-500 text-sm"
                                ></textarea>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Tanggal</label>
                                <input type="date" value={data.scheduled_date} onChange={e => setData('scheduled_date', e.target.value)} disabled={strategy && isGroup} className="w-full rounded-lg border-slate-200 bg-slate-50/50 focus:ring-sky-500 focus:border-sky-500 text-sm" required />
                                {errors.scheduled_date && <p className="text-rose-500 text-xs mt-1">{errors.scheduled_date}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Tipe Strategy</label>
                                <select value={data.type} onChange={e => setData('type', e.target.value)} disabled={strategy && isGroup} className="w-full rounded-lg border-slate-200 bg-white focus:ring-sky-500 focus:border-sky-500 text-sm">
                                    {strategyTypes.map(type => (
                                        <option key={type} value={type}>{type === 'Other' ? 'Lainnya (Tulis Sendiri)' : type}</option>
                                    ))}
                                </select>
                                {data.type === 'Other' && (
                                    <input 
                                        type="text" 
                                        placeholder="Masukkan nama strategi..." 
                                        value={data.custom_type} 
                                        onChange={e => setData('custom_type', e.target.value)} 
                                        disabled={strategy && isGroup} 
                                        className="w-full mt-2 rounded-lg border-slate-200 bg-white focus:ring-sky-500 focus:border-sky-500 text-sm" 
                                        required={data.type === 'Other'}
                                    />
                                )}
                                {errors.type && <p className="text-rose-500 text-xs mt-1">{errors.type}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
                                <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} disabled={strategy && isGroup} rows="3" className="w-full rounded-lg border-slate-200 bg-white focus:ring-sky-500 focus:border-sky-500 text-sm"></textarea>
                                {errors.notes && <p className="text-rose-500 text-xs mt-1">{errors.notes}</p>}
                            </div>

                            {strategy && (strategy.is_completed || strategy.athlete_note) && (
                                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl mt-2">
                                    <p className="text-xs font-bold text-emerald-700 mb-1 flex items-center gap-1.5">
                                        <CheckCircle2 size={14} /> Status: Selesai
                                    </p>
                                    {strategy.athlete_note && (
                                        <div className="mt-2 text-sm text-emerald-800">
                                            <strong>Feedback Atlet:</strong> {strategy.athlete_note}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    <div className="flex justify-between pt-4 border-t border-slate-100">
                        {strategy && isGroup && !isAthlete ? (
                            <div className="w-full text-center">
                                <p className="text-xs text-slate-500 font-semibold bg-slate-100 p-2 rounded-lg">
                                    Pilih kalender Klien Individu untuk mengubah atau menghapus jadwal ini.
                                </p>
                                <button type="button" onClick={onClose} className="mt-3 w-full px-4 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg text-sm font-bold transition-colors">
                                    Tutup
                                </button>
                            </div>
                        ) : (
                            <>
                                {strategy && !isGroup && !isAthlete ? (
                                    <button type="button" onClick={handleDelete} className="px-4 py-2 text-rose-500 hover:bg-rose-50 rounded-lg text-sm font-bold transition-colors">
                                        Hapus
                                    </button>
                                ) : <div></div>}
                                <div className="flex gap-2">
                                    <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-bold transition-colors">
                                        Batal
                                    </button>
                                    <button type="submit" disabled={processing} className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                                        <Save size={16} /> Simpan
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
