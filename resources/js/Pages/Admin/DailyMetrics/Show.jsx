import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Activity, Calendar, Save, Edit3, Plus, X, Zap, User, TrendingUp, HeartPulse, BarChart3, ListFilter, CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { 
    LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart
} from 'recharts';

export default function Show({ athlete, dailyHistory }) {
    const formStartDate = useForm({ training_start_date: athlete?.training_start_date || '' });

    const submitStartDate = (e) => {
        e.preventDefault();
        formStartDate.post(route('admin.daily-metrics.set-start-date', athlete?.id));
    };

    // State untuk Tab Utama, Filter Waktu, dan Tanggal Pilihan
    const [activeTab, setActiveTab] = useState('history');
    const [timeRange, setTimeRange] = useState('mingguan'); // Default Mingguan agar grafiknya terlihat bagus
    // Ambil tanggal hari ini dalam format YYYY-MM-DD untuk default kalender
    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
    const [selectedDate, setSelectedDate] = useState(todayStr);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDateLabel, setSelectedDateLabel] = useState('');
    
    const formMetric = useForm({
        user_id: athlete?.id,
        record_date: '',
        rhr: '',
        spo2: '',
        weight: '',
        vj: ''
    });

    const openModal = (historyItem) => {
        setSelectedDateLabel(historyItem.week_label);
        formMetric.setData({
            user_id: athlete?.id,
            record_date: historyItem.record_date,
            rhr: historyItem.data && historyItem.data.rhr > 0 ? historyItem.data.rhr : '',
            spo2: historyItem.data && historyItem.data.spo2 > 0 ? historyItem.data.spo2 : '',
            weight: historyItem.data && historyItem.data.weight > 0 ? historyItem.data.weight : (athlete?.weight || ''),
            vj: historyItem.data && historyItem.data.vj > 0 ? historyItem.data.vj : ''
        });
        setIsModalOpen(true);
    };

    const submitMetric = (e) => {
        e.preventDefault();
        formMetric.post(route('admin.daily-metrics.store'), {
            onSuccess: () => setIsModalOpen(false),
            preserveScroll: true
        });
    };

    const formatDateToIndo = (dateString, formatType = 'full') => {
        const options = formatType === 'full' 
            ? { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }
            : { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    // ==========================================
    // LOGIKA FILTER RENTANG WAKTU (TARIK MUNDUR)
    // ==========================================
    // 1. Tentukan batas akhir (End Date) = Tanggal yang dipilih
    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);

    // 2. Tentukan batas awal (Start Date) ditarik mundur sesuai pilihan
    const startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);
    
    if (timeRange === 'mingguan') {
        startDate.setDate(startDate.getDate() - 6); // Hari ini + 6 hari ke belakang = 7 Hari
    } else if (timeRange === 'bulanan') {
        startDate.setDate(startDate.getDate() - 29); // Hari ini + 29 hari ke belakang = 30 Hari
    }
    // Jika 'harian', Start Date otomatis sama dengan End Date (0 hari ditarik)

    // 3. Filter dailyHistory yang masuk dalam rentang waktu tersebut dan urutkan dari terlama ke terbaru
    const filteredRawData = dailyHistory?.filter(item => {
        const itemDate = new Date(item.record_date);
        itemDate.setHours(12, 0, 0, 0); // Amankan zona waktu
        return itemDate >= startDate && itemDate <= endDate && item.data && item.data.recovery_status !== 'KOSONG';
    }).reverse() || [];

    // 4. Map data untuk dimasukkan ke Grafik & Tabel
    const processedData = filteredRawData.map(item => ({
        label: formatDateToIndo(item.record_date, 'short'),
        full_date: item.record_date,
        rhr: parseFloat(item.data.rhr),
        spo2: parseFloat(item.data.spo2),
        vj: parseFloat(item.data.vj),
        weight: parseFloat(item.data.weight),
        vo2_max: parseFloat(item.data.vo2_max),
        peak_power: parseFloat(item.data.peak_power),
        recovery: parseFloat(item.data.quick_recovery_score),
        status: item.data.recovery_status
    }));

    // Kalkulasi Rata-rata/Max HANYA untuk rentang waktu yang difilter
    const periodDays = processedData.length;
    const periodAvgRecovery = periodDays ? (processedData.reduce((acc, curr) => acc + curr.recovery, 0) / periodDays).toFixed(1) : 0;
    const periodMaxPeakPower = periodDays ? Math.max(...processedData.map(d => d.peak_power)).toLocaleString('id-ID') : 0;
    const periodAvgVo2Max = periodDays ? (processedData.reduce((acc, curr) => acc + curr.vo2_max, 0) / periodDays).toFixed(2) : 0;
    const periodAvgRhr = periodDays ? (processedData.reduce((acc, curr) => acc + curr.rhr, 0) / periodDays).toFixed(1) : 0;
    
    // Status rata-rata periode tersebut
    const periodStatus = periodAvgRecovery >= 75 ? 'RECOVERY BAIK' : periodAvgRecovery >= 35 ? 'RECOVERY CUKUP' : 'RECOVERY KURANG';

    return (
        <AdminLayout title={`Monitoring - ${athlete?.name || 'Athlete'}`}>
            <Head title={`Monitoring - ${athlete?.name || 'Athlete'}`} />

            <div className="flex flex-col gap-6 mb-12 max-w-7xl mx-auto">
                
                {/* BAGIAN ATAS: PROFIL & SETTING */}
                <div className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#00488b] to-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-900/20">
                            {athlete?.name?.charAt(0) || <User className="w-8 h-8"/>}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{athlete?.name || 'Loading...'}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                                    {athlete?.sport?.name || 'Tanpa Cabor'}
                                </span>
                                {athlete?.weight && <span className="text-sm font-medium text-slate-500">BB Profil: {athlete.weight} kg</span>}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submitStartDate} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 md:w-96 flex-shrink-0">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#00488b]" /> Start Date Latihan
                        </label>
                        <div className="flex gap-2">
                            <input type="date" value={formStartDate.data.training_start_date} onChange={e => formStartDate.setData('training_start_date', e.target.value)} className="flex-1 text-sm rounded-xl border-slate-200 focus:ring-[#00488b] transition-all bg-white" required/>
                            <button disabled={formStartDate.processing} type="submit" className="bg-[#00488b] text-white px-5 rounded-xl text-sm font-bold shadow-md hover:bg-[#003666] transition-all disabled:opacity-70">
                                {formStartDate.processing ? 'Saving...' : 'Set Date'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* NAVIGASI TAB UTAMA (HISTORY vs ANALYTICS) */}
                <div className="flex gap-3 bg-slate-100/50 p-1.5 rounded-2xl w-fit border border-slate-200/60">
                    <button onClick={() => setActiveTab('history')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white text-[#00488b] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        <Calendar className="w-4 h-4" /> Kalender Input
                    </button>
                    <button onClick={() => setActiveTab('analytics')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-white text-[#00488b] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        <BarChart3 className="w-4 h-4" /> Dashboard Analitik
                    </button>
                </div>

                {/* ========================================== */}
                {/* TAB 1: HISTORY (KALENDER INPUT KESELURUHAN)*/}
                {/* ========================================== */}
                {activeTab === 'history' && (
                    <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                                <Activity className="w-5 h-5 text-[#00488b]"/> Kalender Metrik Harian
                            </h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-white border-b border-slate-100 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider">
                                    <tr>
                                        <th className="px-4 py-4">Waktu (WIB)</th>
                                        <th className="px-4 py-4 text-center">RHR</th>
                                        <th className="px-4 py-4 text-center">SpO2</th>
                                        <th className="px-4 py-4 text-center">BB</th>
                                        <th className="px-4 py-4 text-center">VJ</th>
                                        <th className="px-4 py-4 text-center text-[#00488b]">VO2Max</th>
                                        <th className="px-4 py-4 text-center text-[#00488b]">Peak Power</th>
                                        <th className="px-4 py-4 text-center">Recovery</th>
                                        <th className="px-4 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {dailyHistory && dailyHistory.length > 0 ? dailyHistory.map((item, index) => (
                                        <tr key={index} className={`hover:bg-slate-50 transition-colors ${item.is_today ? 'bg-blue-50/40' : ''}`}>
                                            <td className="px-4 py-3">
                                                <div className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                                                    {formatDateToIndo(item.record_date, 'short')}
                                                    {item.is_today && <span className="text-[9px] bg-[#00488b] text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">Hari Ini</span>}
                                                </div>
                                                <div className="text-[11px] text-[#00488b] font-bold mt-0.5">{item.week_label}</div>
                                            </td>
                                            <td className="px-4 py-3 text-center font-bold text-slate-700 text-sm">{item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : item.data?.rhr}</td>
                                            <td className="px-4 py-3 text-center font-bold text-slate-700 text-sm">{item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : `${item.data?.spo2}%`}</td>
                                            <td className="px-4 py-3 text-center font-bold text-slate-700 text-sm">{item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : `${item.data?.weight} kg`}</td>
                                            <td className="px-4 py-3 text-center font-bold text-slate-700 text-sm">{item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : item.data?.vj}</td>
                                            <td className="px-4 py-3 text-center font-bold text-slate-800 text-sm bg-slate-50/50">{item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : Number(item.data?.vo2_max).toLocaleString('id-ID', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 py-3 text-center font-bold text-slate-800 text-sm bg-slate-50/50">
                                                {item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : (
                                                    <span className="flex items-center justify-center gap-1">
                                                        {Number(item.data?.peak_power).toLocaleString('id-ID', { minimumFractionDigits: 0 })} <Zap className="w-3.5 h-3.5 text-amber-500"/>
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider rounded-xl border shadow-sm ${
                                                    item.data?.recovery_status === 'RECOVERY BAIK' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                    item.data?.recovery_status === 'RECOVERY CUKUP' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                                    item.data?.recovery_status === 'RECOVERY KURANG' ? 'bg-red-50 text-red-700 border-red-200' : 
                                                    'bg-slate-100 text-slate-400 border-slate-200 shadow-none'
                                                }`}>
                                                    {item.data?.recovery_status === 'KOSONG' ? 'LIBUR / KOSONG' : <>{item.data?.quick_recovery_score}% <span className="w-1 h-1 rounded-full bg-current opacity-50"></span> {item.data?.recovery_status}</>}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => openModal(item)} className={`flex items-center gap-1.5 ml-auto text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all ${
                                                    item.data?.recovery_status === 'KOSONG' ? 'bg-[#00488b] text-white hover:bg-[#003666]' : 'bg-white border border-slate-200 text-slate-500 hover:text-[#00488b] hover:bg-blue-50'
                                                }`}>
                                                    {item.data?.recovery_status === 'KOSONG' ? <><Plus className="w-3.5 h-3.5" /> Isi Data</> : <><Edit3 className="w-3.5 h-3.5" /> Edit</>}
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="9" className="text-center py-16 text-slate-500">Belum ada data monitoring.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ========================================== */}
                {/* TAB 2: ANALYTICS DENGAN DATE PICKER        */}
                {/* ========================================== */}
                {activeTab === 'analytics' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        {/* KONTROL NAVIGASI (RENTANG WAKTU & TANGGAL) */}
                        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            
                            {/* Segmented Control Harian/Mingguan/Bulanan */}
                            <div className="bg-slate-100 p-1.5 rounded-xl inline-flex w-full lg:w-auto">
                                {['harian', 'mingguan', 'bulanan'].map(range => (
                                    <button 
                                        key={range}
                                        onClick={() => setTimeRange(range)}
                                        className={`flex-1 lg:flex-none px-6 py-2.5 rounded-lg text-sm font-extrabold uppercase tracking-wide transition-all ${
                                            timeRange === range ? 'bg-white text-[#00488b] shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>

                            {/* Date Picker (Mundur dari Tanggal Ini) */}
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Lihat Berdasarkan Tanggal:</span>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <CalendarDays className="h-4 w-4 text-[#00488b]" />
                                    </div>
                                    <input 
                                        type="date" 
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="pl-10 text-sm font-bold text-slate-700 rounded-xl border-slate-200 focus:ring-[#00488b] transition-all bg-white w-full sm:w-auto cursor-pointer shadow-sm hover:border-blue-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {periodDays === 0 ? (
                            <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-sm">
                                <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-slate-600">Tidak ada data di rentang waktu ini</h3>
                                <p className="text-slate-400 text-sm mt-2">Tidak ditemukan data latihan untuk tanggal <b>{formatDateToIndo(startDate, 'short')}</b> hingga <b>{formatDateToIndo(endDate, 'short')}</b>.</p>
                            </div>
                        ) : (
                            <>
                                {/* KARTU OVERALL SUMMARY (Berdasarkan filter) */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                                        <div className="absolute right-0 top-0 w-16 h-16 bg-rose-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
                                        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2"><HeartPulse className="w-4 h-4 text-rose-500"/> Avg Recovery</div>
                                        <div className="text-3xl font-black text-slate-800">{periodAvgRecovery}%</div>
                                        <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{periodStatus}</div>
                                    </div>
                                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                                        <div className="absolute right-0 top-0 w-16 h-16 bg-amber-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
                                        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500"/> Max Peak Power</div>
                                        <div className="text-3xl font-black text-slate-800">{periodMaxPeakPower} <span className="text-base font-semibold text-slate-400">W</span></div>
                                    </div>
                                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                                        <div className="absolute right-0 top-0 w-16 h-16 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
                                        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2"><Activity className="w-4 h-4 text-[#00488b]"/> Avg VO2Max</div>
                                        <div className="text-3xl font-black text-slate-800">{periodAvgVo2Max}</div>
                                    </div>
                                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                                        <div className="absolute right-0 top-0 w-16 h-16 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
                                        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500"/> Avg RHR</div>
                                        <div className="text-3xl font-black text-slate-800">{periodAvgRhr} <span className="text-base font-semibold text-slate-400">bpm</span></div>
                                    </div>
                                </div>

                                {/* AREA GRAFIK */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* GRAFIK: TREND RECOVERY */}
                                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                        <h3 className="font-bold text-slate-800 mb-6 text-base">Trend Recovery ({timeRange.toUpperCase()})</h3>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="colorRecovery" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis dataKey="label" tick={{fontSize: 11, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                                    <YAxis tick={{fontSize: 11, fill: '#94a3b8'}} axisLine={false} tickLine={false} domain={[0, 100]}/>
                                                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                                    {/* Tambahan activeDot untuk memperjelas jika hanya ada 1 data (Harian) */}
                                                    <Area type="monotone" dataKey="recovery" name="Recovery Score" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRecovery)" activeDot={{r: 8}} dot={{r: 4, strokeWidth: 2}}/>
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* GRAFIK: PEAK POWER */}
                                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                        <h3 className="font-bold text-slate-800 mb-6 text-base">Peak Power (Watt)</h3>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={processedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis dataKey="label" tick={{fontSize: 11, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                                    <YAxis tick={{fontSize: 11, fill: '#94a3b8'}} axisLine={false} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']}/>
                                                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                                    <Bar dataKey="peak_power" name="Peak Power" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={timeRange === 'harian' ? 60 : 30} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                {/* TABEL DETAIL DARI RENTANG WAKTU YANG DIPILIH */}
                                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <ListFilter className="w-5 h-5 text-[#00488b]"/>
                                            <h3 className="font-bold text-slate-800 text-lg">
                                                Detail {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
                                            </h3>
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                                            {formatDateToIndo(startDate, 'short')} - {formatDateToIndo(endDate, 'short')}
                                        </p>
                                    </div>
                                    
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm whitespace-nowrap">
                                            <thead className="bg-white border-b border-slate-100 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider">
                                                <tr>
                                                    <th className="px-6 py-4">Tanggal Latihan</th>
                                                    <th className="px-4 py-4 text-center">RHR</th>
                                                    <th className="px-4 py-4 text-center">SpO2</th>
                                                    <th className="px-4 py-4 text-center">BB</th>
                                                    <th className="px-4 py-4 text-center">VJ</th>
                                                    <th className="px-4 py-4 text-center text-[#00488b]">VO2Max</th>
                                                    <th className="px-4 py-4 text-center text-[#00488b]">Peak Power</th>
                                                    <th className="px-6 py-4 text-center">Status Recovery</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {processedData.map((item, index) => (
                                                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-slate-800">{formatDateToIndo(item.full_date, 'full')}</td>
                                                        <td className="px-4 py-4 text-center font-bold text-slate-600">{item.rhr}</td>
                                                        <td className="px-4 py-4 text-center font-bold text-slate-600">{item.spo2}%</td>
                                                        <td className="px-4 py-4 text-center font-bold text-slate-600">{item.weight} kg</td>
                                                        <td className="px-4 py-4 text-center font-bold text-slate-600">{item.vj}</td>
                                                        <td className="px-4 py-4 text-center font-bold text-slate-800 bg-slate-50/50">{Number(item.vo2_max).toLocaleString('id-ID', { minimumFractionDigits: 2 })}</td>
                                                        <td className="px-4 py-4 text-center font-bold text-slate-800 bg-slate-50/50">
                                                            {Number(item.peak_power).toLocaleString('id-ID')} <span className="text-amber-500 text-xs">W</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider rounded-xl border shadow-sm ${
                                                                item.status === 'RECOVERY BAIK' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                                item.status === 'RECOVERY CUKUP' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                                                'bg-red-50 text-red-700 border-red-200'
                                                            }`}>
                                                                {item.recovery}% <span className="w-1 h-1 rounded-full bg-current opacity-50"></span> {item.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                                
                                                {/* BARIS REKAP/SUMMARY DI PALING BAWAH TABEL */}
                                                {periodDays > 1 && (
                                                    <tr className="bg-slate-800 text-white">
                                                        <td className="px-6 py-4 font-black uppercase text-xs tracking-wider">Rata-rata / Tertinggi</td>
                                                        <td className="px-4 py-4 text-center font-bold">{periodAvgRhr}</td>
                                                        <td className="px-4 py-4 text-center font-bold">-</td>
                                                        <td className="px-4 py-4 text-center font-bold">-</td>
                                                        <td className="px-4 py-4 text-center font-bold">-</td>
                                                        <td className="px-4 py-4 text-center font-bold text-blue-200">{periodAvgVo2Max}</td>
                                                        <td className="px-4 py-4 text-center font-bold text-amber-300">
                                                            {periodMaxPeakPower} <span className="text-xs">W</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center font-bold text-emerald-300">{periodAvgRecovery}%</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </>
                        )}
                    </div>
                )}
            </div>

            {/* MODAL FORM INPUT (SAMA SEPERTI SEBELUMNYA) */}
            {/* ... (Modal Pop-Up tidak diubah) ... */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Input Data Harian</h3>
                                <p className="text-xs text-[#00488b] font-bold mt-0.5">
                                    {selectedDateLabel} • {formatDateToIndo(formMetric.data.record_date, 'full')}
                                </p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={submitMetric} className="p-6">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">RHR <span className="text-red-500">*</span></label>
                                    <input type="number" step="0.1" required value={formMetric.data.rhr} onChange={e => formMetric.setData('rhr', e.target.value)} className="w-full text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-[#00488b] transition-all" placeholder="Contoh: 65"/>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SpO2 (%) <span className="text-red-500">*</span></label>
                                    <input type="number" step="0.1" required value={formMetric.data.spo2} onChange={e => formMetric.setData('spo2', e.target.value)} className="w-full text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-[#00488b] transition-all" placeholder="Contoh: 98"/>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weight / BB (Kg) <span className="text-red-500">*</span></label>
                                    <input type="number" step="0.1" required value={formMetric.data.weight} onChange={e => formMetric.setData('weight', e.target.value)} className="w-full text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-[#00488b] transition-all"/>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vertical Jump (VJ) <span className="text-red-500">*</span></label>
                                    <input type="number" step="0.01" required value={formMetric.data.vj} onChange={e => formMetric.setData('vj', e.target.value)} className="w-full text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-[#00488b] transition-all"/>
                                </div>
                            </div>
                            
                            <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100 mt-6">
                                <p className="text-xs text-[#00488b] font-medium leading-relaxed">
                                    <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><Zap className="w-3.5 h-3.5 fill-current"/> Auto-Calculate</span>
                                    Sistem akan otomatis menghitung <b>VO2Max</b>, <b>Peak Power</b>, dan mensimulasikan poin diferensial untuk <b>Status Recovery</b>.
                                </p>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors">Batal</button>
                                <button type="submit" disabled={formMetric.processing} className="flex-[2] py-3.5 bg-[#00488b] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#003666] hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2">
                                    {formMetric.processing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-4 h-4" />}
                                    Simpan Data
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}