import { Activity, Zap, TrendingUp, HeartPulse, BarChart3, ListFilter, CalendarDays } from 'lucide-react';
import { useState, useMemo } from 'react';
import { 
    LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart,
    PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';

export default function AnalyticsDashboard({ dailyHistory, formatDateToIndo }) {
    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
    const [timeRange, setTimeRange] = useState('Mingguan');
    const [selectedDate, setSelectedDate] = useState(todayStr);

    // 1. FILTER TANGGAL (TARIK MUNDUR)
    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);
    
    if (timeRange === 'Mingguan') startDate.setDate(startDate.getDate() - 6);
    else if (timeRange === 'Bulanan') startDate.setDate(startDate.getDate() - 29);

    const filteredRawData = dailyHistory?.filter(item => {
        const itemDate = new Date(item.record_date);
        itemDate.setHours(12, 0, 0, 0);
        return itemDate >= startDate && itemDate <= endDate && item.data && item.data.recovery_status !== 'KOSONG';
    }).reverse() || [];

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

    // 2. KALKULASI RATA-RATA PERIODE (Untuk Summary Cards)
    const periodDays = processedData.length;
    const periodAvgRecovery = periodDays ? (processedData.reduce((acc, curr) => acc + curr.recovery, 0) / periodDays).toFixed(1) : 0;
    
    // Perbaikan Max Peak Power (Dibulatkan agar tidak terlalu panjang)
    const periodMaxPeakPower = periodDays ? Math.round(Math.max(...processedData.map(d => d.peak_power))).toLocaleString('id-ID') : 0;
    
    const periodAvgVo2Max = periodDays ? (processedData.reduce((acc, curr) => acc + curr.vo2_max, 0) / periodDays).toFixed(2) : 0;
    const periodAvgRhr = periodDays ? (processedData.reduce((acc, curr) => acc + curr.rhr, 0) / periodDays).toFixed(1) : 0;
    
    // Status Logic
    let periodStatus = 'RECOVERY KURANG';
    if (periodAvgRecovery >= 75) periodStatus = 'RECOVERY BAIK';
    else if (periodAvgRecovery >= 35) periodStatus = 'RECOVERY CUKUP';

    // 3. KALKULASI ALL-TIME AVERAGE
    const { avgPP, avgVO2, avgVJ, avgRec } = useMemo(() => {
        const allActive = dailyHistory?.filter(i => i.data && i.data.recovery_status !== 'KOSONG') || [];
        const len = allActive.length || 1;
        return {
            avgPP: allActive.reduce((s, i) => s + parseFloat(i.data.peak_power), 0) / len,
            avgVO2: allActive.reduce((s, i) => s + parseFloat(i.data.vo2_max), 0) / len,
            avgVJ: allActive.reduce((s, i) => s + parseFloat(i.data.vj), 0) / len,
            avgRec: allActive.reduce((s, i) => s + parseFloat(i.data.quick_recovery_score), 0) / len,
        };
    }, [dailyHistory]);

    // Custom Tooltip Styling (Lebih modern)
    const customTooltipStyle = {
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        backgroundColor: '#ffffff',
        padding: '12px',
        fontSize: '13px',
        color: '#334155'
    };

    // =====================================
    // RENDER GRAFIK Harian (Gauge & Radar)
    // =====================================
    const renderDailyCharts = () => {
        if (periodDays === 0) return null;
        const current = processedData[0];
        
        const gaugeData = [
            { name: 'Recovery', value: current.recovery },
            { name: 'Sisa', value: 100 - current.recovery }
        ];
        const gaugeColor = current.recovery >= 75 ? '#10b981' : current.recovery >= 35 ? '#f59e0b' : '#ef4444';

        const radarData = [
            { metric: 'Recovery %', today: current.recovery, avg: Math.round(avgRec), fullMark: 100 },
            { metric: 'VO2Max', today: current.vo2_max, avg: Number(avgVO2.toFixed(1)), fullMark: 80 },
            { metric: 'Vertical Jump', today: current.vj, avg: Number(avgVJ.toFixed(1)), fullMark: 100 },
            { metric: 'SpO2 %', today: current.spo2, avg: 98, fullMark: 100 },
        ];

        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Circle Donut Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-between">
                    <div className="w-full text-center mb-2">
                        <h3 className="font-semibold text-slate-800 text-lg">Recovery Score</h3>
                        <p className="text-sm text-slate-500 mt-1">Kondisi fisik hari ini</p>
                    </div>
                    
                    <div className="h-56 w-full relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={gaugeData} 
                                    cx="50%" 
                                    cy="50%" 
                                    startAngle={90} 
                                    endAngle={-270} 
                                    innerRadius="75%" 
                                    outerRadius="100%" 
                                    dataKey="value" 
                                    stroke="none" 
                                    cornerRadius={8}
                                >
                                    <Cell fill={gaugeColor} />
                                    <Cell fill="#f1f5f9" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        
                        {/* Teks di Tengah Lingkaran */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                            <div className="text-4xl font-bold text-slate-800 tracking-tight">
                                {current.recovery}<span className="text-xl text-slate-400 ml-1">%</span>
                            </div>
                            <div className={`text-[10px] font-bold mt-1 px-3 py-1 uppercase tracking-wider rounded-full ${
                                current.recovery >= 75 ? 'bg-emerald-50 text-emerald-600' : 
                                current.recovery >= 35 ? 'bg-amber-50 text-amber-600' : 
                                'bg-rose-50 text-rose-600'
                            }`}>
                                {current.status.replace('RECOVERY ', '')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Radar Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-slate-800 text-lg">Profil Kebugaran Harian</h3>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Hari Ini vs Rata-rata</span>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3"/>
                                <PolarAngleAxis dataKey="metric" tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
                                <Tooltip contentStyle={customTooltipStyle} />
                                <Legend wrapperStyle={{fontSize: '12px', color: '#64748b', paddingTop: '15px'}} />
                                <Radar name="Hari Ini" dataKey="today" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.3} />
                                <Radar name="Rata-rata" dataKey="avg" stroke="#94a3b8" strokeWidth={2} fill="#94a3b8" fillOpacity={0.1} strokeDasharray="4 4" />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    };

    // =====================================
    // RENDER GRAFIK Mingguan
    // =====================================
    const renderWeeklyCharts = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-6 text-lg">Trend Recovery (7 Hari)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="label" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} domain={[0, 100]} dx={-10}/>
                            <Tooltip contentStyle={customTooltipStyle} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }} />
                            <Area type="monotone" dataKey="recovery" name="Recovery %" stroke="#10b981" strokeWidth={3} fill="url(#colorRec)" activeDot={{r: 6, stroke: '#fff', strokeWidth: 2}} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-6 text-lg">Peak Power (Watt)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={processedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="label" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} dx={-10}/>
                            <Tooltip contentStyle={customTooltipStyle} cursor={{fill: '#f8fafc'}} />
                            <Bar dataKey="peak_power" name="Peak Power" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
                <h3 className="font-semibold text-slate-800 mb-6 text-lg">VO2Max vs Vertical Jump</h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={processedData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="label" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} />
                            <YAxis yAxisId="left" tick={{fontSize: 12, fill: '#0ea5e9'}} axisLine={false} tickLine={false} dx={-10} />
                            <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12, fill: '#f43f5e'}} axisLine={false} tickLine={false} dx={10}/>
                            <Tooltip contentStyle={customTooltipStyle} />
                            <Legend wrapperStyle={{fontSize: '13px', color: '#475569', paddingTop: '20px'}} iconType="circle"/>
                            <Line yAxisId="left" type="monotone" dataKey="vo2_max" name="VO2Max" stroke="#0ea5e9" strokeWidth={3} dot={{r: 4, fill: '#fff', strokeWidth: 2}} activeDot={{r: 6}} />
                            <Line yAxisId="right" type="monotone" dataKey="vj" name="Vertical Jump (cm)" stroke="#f43f5e" strokeWidth={3} dot={{r: 4, fill: '#fff', strokeWidth: 2}} activeDot={{r: 6}} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    // =====================================
    // RENDER GRAFIK Bulanan
    // =====================================
    const renderMonthlyCharts = () => (
        <div className="space-y-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-semibold text-slate-800 text-lg">Macro Trend: Recovery vs Peak Power</h3>
                        <p className="text-sm text-slate-500 mt-1">Periode 30 Hari Terakhir</p>
                    </div>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={processedData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRecMacro" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="label" tick={{fontSize: 11, fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={10} interval="preserveStartEnd" minTickGap={20} />
                            <YAxis yAxisId="left" tick={{fontSize: 12, fill: '#10b981'}} axisLine={false} tickLine={false} domain={[0, 100]} dx={-10}/>
                            <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12, fill: '#f59e0b'}} axisLine={false} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} dx={10}/>
                            <Tooltip contentStyle={customTooltipStyle} cursor={{fill: '#f8fafc'}} />
                            <Legend wrapperStyle={{fontSize: '13px', color: '#475569', paddingTop: '20px'}} iconType="circle"/>
                            <Area yAxisId="left" type="monotone" dataKey="recovery" name="Recovery Score %" stroke="#10b981" strokeWidth={2} fill="url(#colorRecMacro)" activeDot={{r: 5}}/>
                            <Bar yAxisId="right" dataKey="peak_power" name="Peak Power (W)" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={12} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-6">
                    <h3 className="font-semibold text-slate-800 text-lg">Cardiovascular Stress Trend (RHR & SpO2)</h3>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={processedData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="label" tick={{fontSize: 11, fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={10} interval="preserveStartEnd" minTickGap={20} />
                            <YAxis yAxisId="left" tick={{fontSize: 12, fill: '#ef4444'}} axisLine={false} tickLine={false} domain={['dataMin - 5', 'dataMax + 5']} dx={-10}/>
                            <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12, fill: '#3b82f6'}} axisLine={false} tickLine={false} domain={[90, 100]} dx={10}/>
                            <Tooltip contentStyle={customTooltipStyle} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}/>
                            <Legend wrapperStyle={{fontSize: '13px', color: '#475569', paddingTop: '20px'}} iconType="circle"/>
                            <Line yAxisId="left" type="monotone" dataKey="rhr" name="Resting HR (bpm)" stroke="#ef4444" strokeWidth={2} dot={{r: 3, fill: '#fff', strokeWidth: 2}} activeDot={{r: 5}} />
                            <Line yAxisId="right" type="monotone" dataKey="spo2" name="SpO2 (%)" stroke="#3b82f6" strokeWidth={2} dot={{r: 3, fill: '#fff', strokeWidth: 2}} activeDot={{r: 5}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header & Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Analytics Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Pantau performa dan pemulihan harian</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Toggle Button Group */}
                    <div className="bg-slate-100 p-1 rounded-xl inline-flex w-full sm:w-auto border border-slate-200">
                        {['Harian', 'Mingguan', 'Bulanan'].map(range => (
                            <button 
                                key={range} 
                                onClick={() => setTimeRange(range)} 
                                className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${timeRange === range ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    
                    {/* Date Picker */}
                    <div className="relative w-full sm:w-auto">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <CalendarDays className="h-4 w-4 text-slate-400" />
                        </div>
                        <input 
                            type="date" 
                            value={selectedDate} 
                            onChange={(e) => setSelectedDate(e.target.value)} 
                            className="pl-10 pr-4 py-2 w-full text-sm font-medium text-slate-700 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white cursor-pointer shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {periodDays === 0 ? (
                <div className="bg-white p-12 rounded-2xl text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                    <BarChart3 className="w-16 h-16 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">Tidak Ada Data</h3>
                    <p className="text-slate-500 mt-2 max-w-md">Belum ada metrik yang tercatat untuk periode {formatDateToIndo(startDate, 'short')} - {formatDateToIndo(endDate, 'short')}.</p>
                </div>
            ) : (
                <>
                    {/* Summary Highlight Cards - Diperbaiki untuk mencegah overflow teks panjang */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Card 1: Avg Recovery */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3 transition-all hover:shadow-md">
                            <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500 shrink-0">
                                <HeartPulse className="w-5 h-5"/>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-500 truncate">Avg Recovery</p>
                                <div className="mt-1">
                                    <span className="text-2xl font-bold text-slate-800">{periodAvgRecovery}%</span>
                                </div>
                                <span className={`text-[10px] font-semibold mt-1 inline-block truncate ${periodAvgRecovery >= 75 ? 'text-emerald-500' : periodAvgRecovery >= 35 ? 'text-amber-500' : 'text-rose-500'}`}>
                                    {periodStatus}
                                </span>
                            </div>
                        </div>

                        {/* Card 2: Max Peak Power (Disesuaikan agar tidak keluar kotak) */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3 transition-all hover:shadow-md">
                            <div className="p-2.5 bg-amber-50 rounded-xl text-amber-500 shrink-0">
                                <Zap className="w-5 h-5"/>
                            </div>
                            <div className="min-w-0 flex flex-col justify-between h-full">
                                <p className="text-sm font-medium text-slate-500 truncate">Max Peak Power</p>
                                <div className="mt-1 flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-slate-800 truncate">{periodMaxPeakPower}</span>
                                    <span className="text-sm font-medium text-slate-500">W</span>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Avg VO2Max */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3 transition-all hover:shadow-md">
                            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-500 shrink-0">
                                <Activity className="w-5 h-5"/>
                            </div>
                            <div className="min-w-0 flex flex-col justify-between h-full">
                                <p className="text-sm font-medium text-slate-500 truncate">Avg VO2Max</p>
                                <div className="mt-1">
                                    <span className="text-2xl font-bold text-slate-800 truncate">{periodAvgVo2Max}</span>
                                </div>
                            </div>
                        </div>

                        {/* Card 4: Avg RHR */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3 transition-all hover:shadow-md">
                            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-500 shrink-0">
                                <TrendingUp className="w-5 h-5"/>
                            </div>
                            <div className="min-w-0 flex flex-col justify-between h-full">
                                <p className="text-sm font-medium text-slate-500 truncate">Avg RHR</p>
                                <div className="mt-1 flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-slate-800 truncate">{periodAvgRhr}</span>
                                    <span className="text-sm font-medium text-slate-500">bpm</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DYNAMIC CHARTS RENDERER */}
                    {timeRange === 'Harian' && renderDailyCharts()}
                    {timeRange === 'Mingguan' && renderWeeklyCharts()}
                    {timeRange === 'Bulanan' && renderMonthlyCharts()}

                    {/* Table Detail Breakdown - Clean Minimalist Style */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                                <ListFilter className="w-5 h-5"/>
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 text-lg">Detail Breakdown</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Ringkasan data tabular periode {timeRange}</p>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-slate-50/50 text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Tanggal</th>
                                        <th className="px-4 py-4 font-medium text-center">RHR</th>
                                        <th className="px-4 py-4 font-medium text-center">SpO2</th>
                                        <th className="px-4 py-4 font-medium text-center">BB (kg)</th>
                                        <th className="px-4 py-4 font-medium text-center">VJ (cm)</th>
                                        <th className="px-4 py-4 font-medium text-center">VO2Max</th>
                                        <th className="px-4 py-4 font-medium text-center">Peak Power</th>
                                        <th className="px-6 py-4 font-medium text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {processedData.map((item, index) => (
                                        <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-700">{formatDateToIndo(item.full_date, 'full')}</td>
                                            <td className="px-4 py-4 text-center text-slate-600">{item.rhr}</td>
                                            <td className="px-4 py-4 text-center text-slate-600">{item.spo2}%</td>
                                            <td className="px-4 py-4 text-center text-slate-600">{item.weight}</td>
                                            <td className="px-4 py-4 text-center text-slate-600">{item.vj}</td>
                                            <td className="px-4 py-4 text-center text-slate-600">{Number(item.vo2_max).toLocaleString('id-ID', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-4 py-4 text-center text-slate-600">{Number(item.peak_power).toLocaleString('id-ID')} W</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                                        item.status === 'RECOVERY BAIK' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                                        item.status === 'RECOVERY CUKUP' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                                        'bg-rose-50 text-rose-700 border-rose-200'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${
                                                            item.status === 'RECOVERY BAIK' ? 'bg-emerald-500' : 
                                                            item.status === 'RECOVERY CUKUP' ? 'bg-amber-500' : 
                                                            'bg-rose-500'
                                                        }`}></span>
                                                        {item.recovery}% - {item.status.replace('RECOVERY ', '')}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Footer Row for Averages */}
                                    {periodDays > 1 && (
                                        <tr className="bg-slate-50 border-t-2 border-slate-200">
                                            <td className="px-6 py-4 font-semibold text-slate-700 text-xs uppercase tracking-wider">Rata-rata / Max</td>
                                            <td className="px-4 py-4 text-center font-semibold text-slate-700">{periodAvgRhr}</td>
                                            <td colSpan="3"></td>
                                            <td className="px-4 py-4 text-center font-semibold text-slate-700">{periodAvgVo2Max}</td>
                                            <td className="px-4 py-4 text-center font-semibold text-slate-700">{periodMaxPeakPower} W</td>
                                            <td className="px-6 py-4 text-center font-semibold text-slate-700">{periodAvgRecovery}%</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}