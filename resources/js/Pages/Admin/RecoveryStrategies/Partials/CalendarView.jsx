import React, { useState, useMemo } from 'react';
import { useForm, router, usePage, Link } from '@inertiajs/react';
import { 
    X, 
    Calendar as CalendarIcon, 
    Save, 
    ChevronLeft, 
    ChevronRight, 
    Plus, 
    HeartPulse, 
    CheckCircle2, 
    Clock, 
    Trash2,
    Check
} from 'lucide-react';
import PageHeader from '@/Components/Common/PageHeader';
import AppLayout from '@/Layouts/AppLayout';

export default function CalendarView({ strategies, isGroup, entity }) {
    const { auth } = usePage().props;
    const isAthlete = auth.user.role === 'athlete';

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStrategy, setEditingStrategy] = useState(null);

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const dayNames = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
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
        if (isAthlete && !strategy) return;
        setSelectedDate(dateStr);
        setEditingStrategy(strategy);
        setIsModalOpen(true);
    };

    const calendarDays = useMemo(() => {
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
            <div className="space-y-4 pb-16">
                {/* ─── 1. PAGE HEADER ─── */}
                <PageHeader 
                    title={`Recovery Strategi: ${entity.name}`}
                    description={isAthlete ? 'Pantau dan tandai status penyelesaian jadwal recovery Anda.' : `Kelola jadwal dan strategi recovery untuk ${isGroup ? 'grup' : 'atlet'} ini.`}
                    actions={
                        <Link
                            href={route("admin.recovery-strategies.index")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                        >
                            <ChevronLeft size={14} />
                            <span>Kembali ke Daftar</span>
                        </Link>
                    }
                />

                {/* ─── 2. CALENDAR CARD ─── */}
                <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden flex flex-col">
                    {/* Month Navigator Header */}
                    <div className="p-3 sm:p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h3>

                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-0.5 shadow-2xs">
                            <button 
                                onClick={prevMonth} 
                                className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors cursor-pointer"
                                title="Bulan Sebelumnya"
                            >
                                <ChevronLeft size={15} />
                            </button>
                            <button 
                                onClick={() => setCurrentDate(new Date())} 
                                className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors cursor-pointer"
                            >
                                Hari Ini
                            </button>
                            <button 
                                onClick={nextMonth} 
                                className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors cursor-pointer"
                                title="Bulan Berikutnya"
                            >
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    </div>

                    {/* Calendar Table Grid */}
                    <div className="flex-1 overflow-x-auto">
                        <div className="min-w-[700px]">
                            {/* Day Name Header Row */}
                            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80">
                                {dayNames.map(day => (
                                    <div key={day} className="py-2.5 text-center text-[10.5px] font-black text-slate-500 uppercase tracking-wider border-r border-slate-200 last:border-0">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Day Cells Grid */}
                            <div className="grid grid-cols-7 bg-slate-200 gap-px border-l border-slate-200">
                                {calendarDays.map((day, idx) => {
                                    const dayStrategies = getStrategiesForDate(day.dateStr);
                                    
                                    return (
                                        <div 
                                            key={idx} 
                                            className={`min-h-[110px] sm:min-h-[125px] p-2 flex flex-col group transition-colors ${
                                                day.isCurrentMonth ? 'bg-white' : 'bg-slate-50/60'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className={`text-xs font-black w-6 h-6 flex items-center justify-center rounded ${
                                                    day.isToday 
                                                        ? 'bg-orange-500 text-white shadow-2xs font-black' 
                                                        : day.isCurrentMonth ? 'text-slate-800' : 'text-slate-400'
                                                }`}>
                                                    {day.date.getDate()}
                                                </span>

                                                {!isAthlete && (
                                                    <button 
                                                        onClick={() => openModal(day.dateStr)}
                                                        className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:bg-orange-50 hover:text-orange-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                                                        title="Tambah Strategi"
                                                    >
                                                        <Plus size={13} />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex-1 space-y-1 overflow-y-auto max-h-[85px] custom-scrollbar">
                                                {dayStrategies.map(strategy => (
                                                    <button 
                                                        key={strategy.id}
                                                        type="button"
                                                        onClick={() => openModal(day.dateStr, strategy)}
                                                        className={`w-full px-2 py-1 border rounded text-[11px] font-bold text-left transition-colors flex items-center justify-between gap-1 shadow-2xs cursor-pointer ${
                                                            strategy.is_completed 
                                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100/80' 
                                                                : 'bg-sky-50 border-sky-200 text-sky-800 hover:bg-sky-100/80'
                                                        }`}
                                                    >
                                                        <span className="truncate">{strategy.type}</span>
                                                        {strategy.is_completed && (
                                                            <CheckCircle2 size={11} className="text-emerald-600 shrink-0" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Form */}
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
        if (confirm('Hapus jadwal strategi recovery ini?')) {
            destroy(route('admin.recovery-strategies.destroy', strategy.id), {
                onSuccess: () => onClose()
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-md rounded-md border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Modal Header */}
                <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/60">
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                        <HeartPulse size={14} className="text-orange-500" />
                        <span>{isAthlete ? 'Feedback Recovery' : (strategy ? 'Edit Strategi Recovery' : 'Tambah Strategi Recovery')}</span>
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                    >
                        <X size={15} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
                    {isAthlete ? (
                        <>
                            <div className="bg-slate-50 p-3 rounded-md border border-slate-200/80 space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-semibold text-slate-500">Tanggal</span>
                                    <span className="font-bold text-slate-900">{data.scheduled_date}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-semibold text-slate-500">Tipe Strategi</span>
                                    <span className="font-bold text-orange-600">{strategy.type}</span>
                                </div>
                                {strategy.notes && (
                                    <div className="pt-1.5 border-t border-slate-200">
                                        <p className="text-[11px] font-bold text-slate-500 mb-0.5">Catatan Pelatih:</p>
                                        <p className="text-xs text-slate-700 whitespace-pre-line">{strategy.notes}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <label className="flex items-center gap-2.5 p-2.5 border border-slate-200 rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input 
                                        type="checkbox" 
                                        checked={data.is_completed} 
                                        onChange={e => setData('is_completed', e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                    />
                                    <span className="text-xs font-bold text-slate-800">Tandai telah selesai dilakukan</span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Feedback / Catatan Atlet (Opsional)</label>
                                <textarea 
                                    value={data.athlete_note} 
                                    onChange={e => setData('athlete_note', e.target.value)} 
                                    rows="3" 
                                    placeholder="Bagaimana kondisi pemulihan Anda setelah melakukan strategi ini?"
                                    className="w-full rounded-md border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-xs font-medium"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Terjadwal</label>
                                <input 
                                    type="date" 
                                    value={data.scheduled_date} 
                                    onChange={e => setData('scheduled_date', e.target.value)} 
                                    disabled={strategy && isGroup} 
                                    className="w-full rounded-md border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-xs font-semibold" 
                                    required 
                                />
                                {errors.scheduled_date && <p className="text-rose-600 text-xs mt-1">{errors.scheduled_date}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Tipe Strategi Recovery</label>
                                <select 
                                    value={data.type} 
                                    onChange={e => setData('type', e.target.value)} 
                                    disabled={strategy && isGroup} 
                                    className="w-full rounded-md border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-xs font-semibold"
                                >
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
                                        className="w-full mt-2 rounded-md border-slate-200 bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-xs font-semibold" 
                                        required={data.type === 'Other'}
                                    />
                                )}
                                {errors.type && <p className="text-rose-600 text-xs mt-1">{errors.type}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
                                <textarea 
                                    value={data.notes} 
                                    onChange={e => setData('notes', e.target.value)} 
                                    disabled={strategy && isGroup} 
                                    rows="3" 
                                    placeholder="Contoh: 15 menit suhu 10-12°C setelah sesi sore"
                                    className="w-full rounded-md border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-xs font-medium"
                                />
                                {errors.notes && <p className="text-rose-600 text-xs mt-1">{errors.notes}</p>}
                            </div>

                            {strategy && (strategy.is_completed || strategy.athlete_note) && (
                                <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-md text-xs space-y-1">
                                    <p className="font-bold text-emerald-800 flex items-center gap-1">
                                        <CheckCircle2 size={13} className="text-emerald-600" /> 
                                        <span>Status: Telah Diselesaikan Atlet</span>
                                    </p>
                                    {strategy.athlete_note && (
                                        <p className="text-emerald-900 text-[11.5px] font-medium pt-0.5">
                                            <strong>Feedback:</strong> {strategy.athlete_note}
                                        </p>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                        {strategy && isGroup && !isAthlete ? (
                            <div className="w-full text-center space-y-2">
                                <p className="text-xs text-slate-500 font-medium bg-slate-50 p-2 rounded border border-slate-200">
                                    Pilih kalender Klien Individu untuk mengubah atau menghapus jadwal ini.
                                </p>
                                <button 
                                    type="button" 
                                    onClick={onClose} 
                                    className="w-full px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-bold transition-colors cursor-pointer"
                                >
                                    Tutup
                                </button>
                            </div>
                        ) : (
                            <>
                                {strategy && !isGroup && !isAthlete ? (
                                    <button 
                                        type="button" 
                                        onClick={handleDelete} 
                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-md text-xs font-bold transition-colors cursor-pointer"
                                    >
                                        <Trash2 size={13} />
                                        <span>Hapus</span>
                                    </button>
                                ) : <div />}

                                <div className="flex items-center gap-2">
                                    <button 
                                        type="button" 
                                        onClick={onClose} 
                                        className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={processing} 
                                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                                    >
                                        <Save size={13} /> 
                                        <span>{processing ? 'Menyimpan...' : 'Simpan'}</span>
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
