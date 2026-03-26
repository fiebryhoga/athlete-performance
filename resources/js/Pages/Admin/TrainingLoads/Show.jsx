import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Calendar, Save, Plus, X, User, HeartPulse, Brain, Battery, Edit3, ChevronDown, ActivitySquare, TrendingUp, Target, Search, CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { 
    BarChart, Bar, LineChart, Line, XAxis, YAxis, 
    CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ComposedChart 
} from 'recharts';

export default function Show({ athlete, trainingHistory }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
    const [selectedDate, setSelectedDate] = useState(todayStr); // Untuk form input
    const [searchDate, setSearchDate] = useState(''); // Untuk filter pencarian minggu

    const formLoad = useForm({
        user_id: athlete?.id,
        record_date: todayStr,
        sleep_quality: '', fatigue: '', muscle_soreness: '', stress: '', 
        motivation: '', health: '', mood: '', study_attitude: '',
        am_session_type: '', am_rpe: '', am_duration: '',
        pm_session_type: '', pm_rpe: '', pm_duration: ''
    });

    const activeData = trainingHistory || [];
    
    const physicalPrepTypes = ['Power', 'Strength/Power', 'Strength UB', 'Strength LB', 'Strength Full Body', 'Speed/Agility', 'Injury Prevention', 'General Strength', 'Other activity', 'Recovery', 'Conditioning'];
    const skillTypes = ['Tactical', 'Technical', 'Skills'];
    const matchTypes = ['Match', 'Competition'];
    const travelTypes = ['Travel'];
    
    const sessionTypes = [...physicalPrepTypes, ...skillTypes, ...matchTypes, ...travelTypes];

    const openModal = (dateToEdit = selectedDate) => {
        const existingData = activeData.find(item => item.record_date === dateToEdit);
        if (existingData) {
            formLoad.setData({
                user_id: athlete?.id, record_date: dateToEdit,
                sleep_quality: existingData.sleep_quality || '', fatigue: existingData.fatigue || '',
                muscle_soreness: existingData.muscle_soreness || '', stress: existingData.stress || '',
                motivation: existingData.motivation || '', health: existingData.health || '',
                mood: existingData.mood || '', study_attitude: existingData.study_attitude || '',
                am_session_type: existingData.am_session_type || '', am_rpe: existingData.am_rpe || '', am_duration: existingData.am_duration || '',
                pm_session_type: existingData.pm_session_type || '', pm_rpe: existingData.pm_rpe || '', pm_duration: existingData.pm_duration || ''
            });
        } else {
            formLoad.setData({
                user_id: athlete?.id, record_date: dateToEdit,
                sleep_quality: '', fatigue: '', muscle_soreness: '', stress: '', motivation: '', health: '', mood: '', study_attitude: '',
                am_session_type: '', am_rpe: '', am_duration: '', pm_session_type: '', pm_rpe: '', pm_duration: ''
            });
        }
        setSelectedDate(dateToEdit);
        setIsModalOpen(true);
    };

    const submitLoad = (e) => {
        e.preventDefault();
        formLoad.post(route('admin.training-loads.store'), {
            onSuccess: () => { setIsModalOpen(false); formLoad.reset(); },
            preserveScroll: true
        });
    };

    const formatDateToIndo = (dateObj, formatType = 'full') => {
        const options = formatType === 'full' 
            ? { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }
            : { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' };
        return dateObj.toLocaleDateString('id-ID', options);
    };

    // ==========================================
    // LOGIKA PENGELOMPOKAN MINGGUAN
    // ==========================================
    const generateWeeklyData = () => {
        if (!activeData || activeData.length === 0) return [];

        const sortedData = [...activeData].sort((a,b) => new Date(a.record_date) - new Date(b.record_date));
        const firstDate = new Date(sortedData[0].record_date);
        
        const startDay = firstDate.getDay();
        const startDiff = firstDate.getDate() - startDay + (startDay === 0 ? -6 : 1);
        let currentMonday = new Date(firstDate.setDate(startDiff));
        currentMonday.setHours(0,0,0,0);

        const endLimit = new Date();
        endLimit.setHours(23,59,59,999);

        let weeksArray = [];

        while (currentMonday <= endLimit) {
            const weekDays = [];
            let weeklyLoad = 0;
            let weeklyWellnessScore = 0;
            const dailyLoadsForMath = [];
            const frequency = {};
            sessionTypes.forEach(t => frequency[t] = 0);
            
            let totals = { all: 0, physical: 0, skill: 0, matches: 0, travel: 0 };

            for(let i=0; i<7; i++) {
                const d = new Date(currentMonday);
                d.setDate(d.getDate() + i);
                
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                const dateStr = `${yyyy}-${mm}-${dd}`;
                
                const existingRecord = sortedData.find(item => item.record_date === dateStr);
                const load = existingRecord ? (existingRecord.daily_load || 0) : 0;
                const wellness = existingRecord ? (existingRecord.wellness_score || 0) : 0;
                
                weekDays.push({
                    dateStr, dateObj: d, dayName: d.toLocaleDateString('id-ID', { weekday: 'long' }),
                    data: existingRecord || null, load, wellness
                });
                
                dailyLoadsForMath.push(load);
                weeklyLoad += load;
                weeklyWellnessScore += wellness;

                if (existingRecord) {
                    [existingRecord.am_session_type, existingRecord.pm_session_type].forEach(t => {
                        if (t && frequency[t] !== undefined) {
                            frequency[t]++;
                            totals.all++;
                            if (physicalPrepTypes.includes(t)) totals.physical++;
                            else if (skillTypes.includes(t)) totals.skill++;
                            else if (matchTypes.includes(t)) totals.matches++;
                            else if (travelTypes.includes(t)) totals.travel++;
                        }
                    });
                }
            }

            const meanLoad = weeklyLoad / 7;
            const variance = dailyLoadsForMath.reduce((acc, val) => acc + Math.pow(val - meanLoad, 2), 0) / 6; // N-1
            const stdDev = Math.sqrt(variance);
            const monotony = stdDev > 0 ? (meanLoad / stdDev) : (meanLoad > 0 ? meanLoad : 0);
            const strain = weeklyLoad * monotony;

            weeksArray.push({
                startObj: new Date(currentMonday),
                endObj: new Date(weekDays[6].dateObj),
                label: `${formatDateToIndo(currentMonday, 'short')} - ${formatDateToIndo(weekDays[6].dateObj, 'short')}`,
                days: weekDays,
                metrics: {
                    weeklyLoad, weeklyWellnessScore,
                    meanLoad: parseFloat(meanLoad.toFixed(1)),
                    stdDev: parseFloat(stdDev.toFixed(1)),
                    monotony: parseFloat(monotony.toFixed(2)),
                    strain: parseFloat(strain.toFixed(1)),
                    frequency,
                    totals: { ...totals, training: totals.physical + totals.skill }
                }
            });

            currentMonday.setDate(currentMonday.getDate() + 7);
        }

        return weeksArray.reverse();
    };

    const groupedWeeks = generateWeeklyData();

    // ==========================================
    // FILTER PENCARIAN TANGGAL
    // ==========================================
    const displayedWeeks = searchDate 
        ? groupedWeeks.filter(week => {
            const sDate = new Date(searchDate);
            sDate.setHours(12,0,0,0);
            const wStart = new Date(week.startObj); wStart.setHours(0,0,0,0);
            const wEnd = new Date(week.endObj); wEnd.setHours(23,59,59,999);
            return sDate >= wStart && sDate <= wEnd;
        })
        : groupedWeeks;

    // ==========================================
    // KOMPONEN CUSTOM UI
    // ==========================================
    const ScaleRadio = ({ label, name }) => (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-rose-200 transition-colors">
            <label className="text-xs font-bold text-slate-600 uppercase w-1/2">{label}</label>
            <div className="flex gap-2 w-1/2 justify-end">
                {[1, 2, 3, 4, 5].map(num => (
                    <label key={num} className={`relative w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer text-xs font-extrabold transition-all ${
                        formLoad.data[name] == num 
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-110' 
                        : 'bg-white border border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200'
                    }`}>
                        <input type="radio" name={name} value={num} checked={formLoad.data[name] == num} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full m-0" onChange={e => formLoad.setData(name, e.target.value)} required />
                        <span>{num}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    const CustomSelect = ({ options, value, onChange, placeholder, iconColorClass = "text-[#00488b]" }) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <div className="relative">
                <div onClick={() => setIsOpen(!isOpen)} className="w-full text-sm rounded-xl border border-slate-200 bg-white p-2.5 cursor-pointer flex justify-between items-center hover:border-blue-300 transition-colors">
                    <span className={value ? 'text-slate-800 font-bold' : 'text-slate-400'}>{value || placeholder}</span>
                    <ChevronDown className={`w-4 h-4 ${iconColorClass}`} />
                </div>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                        <div className="absolute z-20 w-full mt-1 bg-white border border-slate-100 shadow-2xl rounded-xl max-h-56 overflow-y-auto custom-scrollbar py-1">
                            <div onClick={() => { onChange(''); setIsOpen(false); }} className="px-4 py-2.5 text-sm text-slate-400 hover:bg-slate-50 cursor-pointer italic">Kosongkan...</div>
                            {options.map(opt => (
                                <div key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${value == opt ? 'bg-blue-50 text-[#00488b] font-bold' : 'text-slate-700 hover:bg-slate-50 hover:text-[#00488b]'}`}>{opt}</div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <AdminLayout title={`Wellness & Load - ${athlete?.name}`}>
            <Head title={`Wellness & Load - ${athlete?.name}`} />

            <div className="flex flex-col gap-8 mb-12 max-w-7xl mx-auto">
                
                {/* 1. PROFIL & KONTROL INPUT */}
                <div className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-orange-500 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-rose-500/20">
                            {athlete?.name?.charAt(0) || <User className="w-8 h-8"/>}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{athlete?.name}</h2>
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider mt-1 inline-block">
                                {athlete?.sport?.name || 'Umum'}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* KOTAK PENCARIAN MINGGU (FILTER) */}
                        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex-shrink-0">
                            <label className="block text-[11px] font-bold text-[#00488b] uppercase mb-2 flex items-center gap-1.5">
                                <Search className="w-3.5 h-3.5" /> Cari Data Minggu
                            </label>
                            <div className="flex gap-2">
                                <input type="date" value={searchDate} onChange={e => setSearchDate(e.target.value)} className="w-36 text-sm rounded-xl border-blue-200 focus:ring-[#00488b] transition-all bg-white font-bold text-[#00488b]"/>
                                {searchDate && (
                                    <button onClick={() => setSearchDate('')} className="bg-white border border-blue-200 text-slate-500 px-3 rounded-xl hover:bg-blue-100 transition-all font-bold text-xs shadow-sm">Reset</button>
                                )}
                            </div>
                        </div>

                        {/* KOTAK INPUT DATA BARU */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex-shrink-0">
                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-2 flex items-center gap-1.5">
                                <CalendarDays className="w-3.5 h-3.5 text-rose-500" /> Input Data Harian
                            </label>
                            <div className="flex gap-2">
                                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-36 text-sm rounded-xl border-slate-200 focus:ring-rose-500 transition-all bg-white font-bold text-slate-700"/>
                                <button onClick={() => openModal(selectedDate)} className="bg-rose-500 text-white px-4 rounded-xl text-sm font-bold shadow-md hover:bg-rose-600 transition-all flex items-center gap-1">
                                    <Plus className="w-4 h-4" /> Input
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. AREA GROUPING MINGGUAN */}
                {displayedWeeks.length === 0 ? (
                    <div className="bg-white p-16 rounded-3xl border border-slate-100 text-center shadow-sm">
                        <ActivitySquare className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-600">
                            {searchDate ? 'Data Minggu Tidak Ditemukan' : 'Belum Ada Data Load'}
                        </h3>
                        <p className="text-slate-400 mt-2">
                            {searchDate ? `Tidak ada aktivitas yang tercatat pada minggu yang mengandung tanggal ${formatDateToIndo(new Date(searchDate), 'short')}.` : 'Silakan input data Wellness & RPE pertama Anda.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {displayedWeeks.map((week, wIndex) => (
                            <div key={wIndex} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                
                                {/* HEADER MINGGU */}
                                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-[#00488b]"/>
                                        <h3 className="font-extrabold text-slate-800 text-lg">Periode: {week.label}</h3>
                                    </div>
                                    <div className="bg-rose-50 border border-rose-100 px-4 py-1.5 rounded-lg flex items-center gap-2 w-fit">
                                        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Weekly Wellness:</span>
                                        <span className="font-black text-rose-600 text-lg">{week.metrics.weeklyWellnessScore} <span className="text-xs font-bold text-rose-400">/ 280</span></span>
                                    </div>
                                </div>
                                
                                {/* MICRO CHART (GRAFIK HARIAN DALAM MINGGU INI) */}
                                <div className="p-6 border-b border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white">
                                    <div className="h-48 w-full">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 text-center">Load vs Wellness (Harian)</h4>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ComposedChart data={week.days.map(d => ({ day: d.dayName.substring(0,3), load: d.load, wellness: d.wellness }))} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="day" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                                <YAxis yAxisId="left" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                                <YAxis yAxisId="right" orientation="right" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} domain={[0,40]} />
                                                <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}} />
                                                <Bar yAxisId="left" dataKey="load" name="Daily Load" fill="#00488b" radius={[4,4,0,0]} barSize={20} />
                                                <Line yAxisId="right" type="monotone" dataKey="wellness" name="Wellness Score" stroke="#f43f5e" strokeWidth={3} dot={{r: 3}} />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Puncak Beban Latihan</p>
                                                <p className="font-bold text-slate-800 text-sm mt-0.5">Hari dengan Load Tertinggi</p>
                                            </div>
                                            <span className="font-black text-xl text-[#00488b]">{Math.max(...week.days.map(d => d.load))} AU</span>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kebugaran Minimum</p>
                                                <p className="font-bold text-slate-800 text-sm mt-0.5">Hari dengan Wellness Terendah</p>
                                            </div>
                                            <span className="font-black text-xl text-rose-500">
                                                {week.days.filter(d => d.wellness > 0).length > 0 ? Math.min(...week.days.filter(d => d.wellness > 0).map(d => d.wellness)) : 0} 
                                                <span className="text-xs text-rose-300">/40</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* TABEL HARIAN */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-white border-b border-slate-100 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">Hari</th>
                                                <th className="px-4 py-4 text-center">Wellness</th>
                                                <th className="px-4 py-4">Sesi Pagi (AM)</th>
                                                <th className="px-4 py-4">Sesi Sore (PM)</th>
                                                <th className="px-4 py-4 text-center text-[#00488b]">Daily Load</th>
                                                <th className="px-6 py-4 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {week.days.map((day, dIndex) => (
                                                <tr key={dIndex} className="hover:bg-slate-50 transition-colors group">
                                                    <td className="px-6 py-3">
                                                        <div className="font-bold text-slate-800 capitalize">{day.dayName}</div>
                                                        <div className="text-[10px] text-slate-400 font-medium">{formatDateToIndo(day.dateObj, 'short')}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        {day.wellness ? (
                                                            <span className="font-black text-rose-500 bg-rose-50 px-3 py-1 rounded-lg">{day.wellness}</span>
                                                        ) : <span className="text-slate-300">-</span>}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {day.data?.am_load ? (
                                                            <div>
                                                                <div className="font-bold text-slate-700">{day.data.am_load} <span className="text-[10px] text-slate-400 font-normal">AU</span></div>
                                                                <div className="text-[10px] text-slate-500">{day.data.am_session_type}</div>
                                                            </div>
                                                        ) : <span className="text-slate-300">-</span>}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {day.data?.pm_load ? (
                                                            <div>
                                                                <div className="font-bold text-slate-700">{day.data.pm_load} <span className="text-[10px] text-slate-400 font-normal">AU</span></div>
                                                                <div className="text-[10px] text-slate-500">{day.data.pm_session_type}</div>
                                                            </div>
                                                        ) : <span className="text-slate-300">-</span>}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        {day.load ? (
                                                            <span className="font-black text-[#00488b] bg-blue-50 px-3 py-1 rounded-lg">{day.load}</span>
                                                        ) : <span className="text-slate-300">-</span>}
                                                    </td>
                                                    <td className="px-6 py-3 text-right">
                                                        <button onClick={() => openModal(day.dateStr)} className="inline-flex items-center gap-1.5 ml-auto text-xs font-bold px-3 py-1.5 rounded-xl transition-all bg-white border border-slate-200 text-slate-500 hover:text-[#00488b] hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm">
                                                            {day.data ? <><Edit3 className="w-3.5 h-3.5" /> Edit</> : <><Plus className="w-3.5 h-3.5" /> Isi Data</>}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* FOOTER 1: SUMMARY MINGGUAN */}
                                <div className="bg-[#00488b] p-6 text-white border-b border-blue-800">
                                    <div className="flex items-center gap-2 mb-4 opacity-80">
                                        <TrendingUp className="w-4 h-4" />
                                        <h4 className="text-xs font-bold uppercase tracking-widest">Load Metrics & Monitoring</h4>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 divide-x divide-blue-700/50">
                                        <div className="px-4 first:pl-0"><p className="text-[10px] font-bold text-blue-200 uppercase mb-1">Weekly Load</p><p className="text-3xl font-black">{week.metrics.weeklyLoad}</p></div>
                                        <div className="px-4"><p className="text-[10px] font-bold text-blue-200 uppercase mb-1">Mean Daily Load</p><p className="text-2xl font-bold mt-1">{week.metrics.meanLoad}</p></div>
                                        <div className="px-4"><p className="text-[10px] font-bold text-blue-200 uppercase mb-1">Standard Deviation</p><p className="text-2xl font-bold mt-1">{week.metrics.stdDev}</p></div>
                                        <div className="px-4"><p className="text-[10px] font-bold text-amber-300 uppercase mb-1">Training Monotony</p><p className="text-2xl font-bold mt-1 text-amber-400">{week.metrics.monotony}</p></div>
                                        <div className="px-4"><p className="text-[10px] font-bold text-rose-300 uppercase mb-1">Strain</p><p className="text-2xl font-bold mt-1 text-rose-400">{week.metrics.strain}</p></div>
                                    </div>
                                </div>

                                {/* FOOTER 2: FREKUENSI */}
                                <div className="bg-slate-50 p-6">
                                    <div className="flex items-center gap-2 mb-6 text-slate-500">
                                        <Target className="w-4 h-4" />
                                        <h4 className="text-xs font-bold uppercase tracking-widest">Training / Match Frequency</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                                        <div className="space-y-2.5">
                                            {physicalPrepTypes.map(t => (
                                                <div key={t} className="flex justify-between text-sm border-b border-slate-200/50 pb-1">
                                                    <span className="text-slate-600">{t}</span><span className="font-extrabold text-slate-800">{week.metrics.frequency[t]}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-2.5">
                                            {[...skillTypes, ...matchTypes, ...travelTypes].map(t => (
                                                <div key={t} className="flex justify-between text-sm border-b border-slate-200/50 pb-1">
                                                    <span className="text-slate-600">{t}</span><span className="font-extrabold text-slate-800">{week.metrics.frequency[t]}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5 h-fit">
                                            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100"><span className="text-[10px] font-bold text-slate-500 uppercase">Total (Train/Match/Travel)</span><span className="text-xl font-black text-[#00488b]">{week.metrics.totals.all}</span></div>
                                            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100"><span className="text-[10px] font-bold text-slate-500 uppercase">Total Training Sessions</span><span className="text-base font-extrabold text-slate-800">{week.metrics.totals.training}</span></div>
                                            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100"><span className="text-[10px] font-bold text-slate-500 uppercase">Num. Physical Prep</span><span className="text-sm font-bold text-slate-600">{week.metrics.totals.physical}</span></div>
                                            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100"><span className="text-[10px] font-bold text-slate-500 uppercase">Num. Skill Sessions</span><span className="text-sm font-bold text-slate-600">{week.metrics.totals.skill}</span></div>
                                            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100"><span className="text-[10px] font-bold text-slate-500 uppercase">Matches / Comps</span><span className="text-sm font-bold text-slate-600">{week.metrics.totals.matches}</span></div>
                                            <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-slate-500 uppercase">Travel</span><span className="text-sm font-bold text-slate-600">{week.metrics.totals.travel}</span></div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL INPUT (TIDAK ADA PERUBAHAN) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
                        <div className="sticky top-0 z-10 px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white/90 backdrop-blur-md">
                            <div>
                                <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
                                    <HeartPulse className="w-5 h-5 text-rose-500" /> 
                                    {activeData.find(d => d.record_date === selectedDate) ? 'Edit Data Readiness & Load' : 'Input Readiness & Load'}
                                </h3>
                                <p className="text-sm text-slate-500 font-bold mt-0.5">
                                    {formatDateToIndo(new Date(selectedDate), 'full')}
                                </p>
                            </div>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-600 rounded-full transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={submitLoad} className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                        <Brain className="w-5 h-5 text-rose-500"/>
                                        <h4 className="font-extrabold text-slate-800 text-lg">Wellness Questionnaire</h4>
                                    </div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">1 = Sangat Buruk, 5 = Sangat Baik</p>
                                    <ScaleRadio label="Kualitas Tidur" name="sleep_quality" />
                                    <ScaleRadio label="Tingkat Kelelahan" name="fatigue" />
                                    <ScaleRadio label="Nyeri Otot" name="muscle_soreness" />
                                    <ScaleRadio label="Tingkat Stres" name="stress" />
                                    <ScaleRadio label="Motivasi Latihan" name="motivation" />
                                    <ScaleRadio label="Kondisi Kesehatan" name="health" />
                                    <ScaleRadio label="Suasana Hati (Mood)" name="mood" />
                                    <ScaleRadio label="Fokus/Sikap Belajar" name="study_attitude" />
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2">
                                        <Battery className="w-5 h-5 text-[#00488b]"/>
                                        <h4 className="font-extrabold text-slate-800 text-lg">Sesi Latihan (RPE)</h4>
                                    </div>

                                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 relative overflow-visible">
                                        <h5 className="font-bold text-[#00488b] text-sm mb-3">Sesi Pagi (AM)</h5>
                                        <div className="space-y-3">
                                            <div className="relative z-20">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase">Tipe Latihan</label>
                                                <CustomSelect options={sessionTypes} value={formLoad.data.am_session_type} onChange={val => formLoad.setData('am_session_type', val)} placeholder="Pilih tipe sesi..." iconColorClass="text-[#00488b]" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase">RPE (1-10)</label>
                                                    <CustomSelect options={[1,2,3,4,5,6,7,8,9,10]} value={formLoad.data.am_rpe} onChange={val => formLoad.setData('am_rpe', val)} placeholder="Beban 1-10" iconColorClass="text-[#00488b]" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Durasi (Menit)</label>
                                                    <input type="number" min="0" value={formLoad.data.am_duration} onChange={e => formLoad.setData('am_duration', e.target.value)} className="w-full text-sm rounded-xl border-slate-200 bg-white focus:border-blue-300 focus:ring-[#00488b] transition-all" placeholder="Menit"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 relative overflow-visible">
                                        <h5 className="font-bold text-indigo-700 text-sm mb-3">Sesi Sore/Malam (PM)</h5>
                                        <div className="space-y-3">
                                            <div className="relative z-20">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase">Tipe Latihan</label>
                                                <CustomSelect options={sessionTypes} value={formLoad.data.pm_session_type} onChange={val => formLoad.setData('pm_session_type', val)} placeholder="Pilih tipe sesi..." iconColorClass="text-indigo-600" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase">RPE (1-10)</label>
                                                    <CustomSelect options={[1,2,3,4,5,6,7,8,9,10]} value={formLoad.data.pm_rpe} onChange={val => formLoad.setData('pm_rpe', val)} placeholder="Beban 1-10" iconColorClass="text-indigo-600" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Durasi (Menit)</label>
                                                    <input type="number" min="0" value={formLoad.data.pm_duration} onChange={e => formLoad.setData('pm_duration', e.target.value)} className="w-full text-sm rounded-xl border-slate-200 bg-white focus:border-indigo-300 focus:ring-indigo-600 transition-all" placeholder="Menit"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors">Batal</button>
                                <button type="submit" disabled={formLoad.processing} className="flex-[2] py-3.5 bg-rose-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all flex justify-center items-center gap-2">
                                    {formLoad.processing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-4 h-4" />}
                                    Simpan & Kalkulasi Load
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}