import React, { useState, useMemo, Fragment } from 'react';
import { 
    Activity, 
    Zap, 
    TrendingUp, 
    HeartPulse, 
    BarChart3, 
    ListFilter, 
    CalendarDays, 
    Eye, 
    EyeOff 
} from 'lucide-react';
import { 
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart,
    PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Line 
} from 'recharts';

export default function AnalyticsDashboard({ dailyHistory, formatDateToIndo }) {
    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
    const [timeRange, setTimeRange] = useState('Mingguan');
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [expandedRow, setExpandedRow] = useState(null); 

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

    const periodDays = processedData.length;
    const periodAvgRecovery = periodDays ? (processedData.reduce((acc, curr) => acc + curr.recovery, 0) / periodDays).toFixed(1) : 0;
    const periodMaxPeakPower = periodDays ? Math.round(Math.max(...processedData.map(d => d.peak_power))).toLocaleString('id-ID') : 0;
    const periodAvgVo2Max = periodDays ? (processedData.reduce((acc, curr) => acc + curr.vo2_max, 0) / periodDays).toFixed(2) : 0;
    const periodAvgRhr = periodDays ? (processedData.reduce((acc, curr) => acc + curr.rhr, 0) / periodDays).toFixed(1) : 0;
    
    let periodStatus = 'RECOVERY KURANG';
    if (periodAvgRecovery >= 75) periodStatus = 'RECOVERY BAIK';
    else if (periodAvgRecovery >= 35) periodStatus = 'RECOVERY CUKUP';

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

    const toggleExpand = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    const customTooltipStyle = {
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        backgroundColor: '#ffffff',
        padding: '8px 12px',
        fontSize: '12px',
        color: '#334155',
        fontWeight: 'bold'
    };

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-md border border-slate-200/80 shadow-2xs">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-3">Skor Pemulihan Harian</h3>
                    <div className="h-56 flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={gaugeData}
                                    cx="50%"
                                    cy="70%"
                                    startAngle={180}
                                    endAngle={0}
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    <Cell fill={gaugeColor} />
                                    <Cell fill="#f1f5f9" />
                                </Pie>
                                <Tooltip contentStyle={customTooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                            <span className="text-3xl font-black text-slate-900">{current.recovery}%</span>
                            <span className="text-[11px] font-bold text-slate-400 block mt-0.5">{current.status}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-md border border-slate-200/80 shadow-2xs">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-3">Profil Kesiapan Fisik (Radar)</h3>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
                                <Tooltip contentStyle={customTooltipStyle} />
                                <Legend wrapperStyle={{fontSize: '11px', color: '#64748b', paddingTop: '10px'}} />
                                <Radar name="Hari Ini" dataKey="today" stroke="#f97316" strokeWidth={2} fill="#f97316" fillOpacity={0.25} />
                                <Radar name="Rata-rata" dataKey="avg" stroke="#94a3b8" strokeWidth={1.5} fill="#94a3b8" fillOpacity={0.1} strokeDasharray="3 3" />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    };

    const renderWeeklyCharts = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-md border border-slate-200/80 shadow-2xs">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-3">Tren Recovery (7 Hari)</h3>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="label" tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} dy={5} />
                            <YAxis tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} domain={[0, 100]} dx={-5}/>
                            <Tooltip contentStyle={customTooltipStyle} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }} />
                            <Area type="monotone" dataKey="recovery" name="Recovery %" stroke="#10b981" strokeWidth={2.5} fill="url(#colorRec)" activeDot={{r: 5, stroke: '#fff', strokeWidth: 2}} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-4 rounded-md border border-slate-200/80 shadow-2xs">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-3">Peak Power (Watt)</h3>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={processedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="label" tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} dy={5} />
                            <YAxis tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} dx={-5}/>
                            <Tooltip contentStyle={customTooltipStyle} cursor={{fill: '#f8fafc'}} />
                            <Bar dataKey="peak_power" name="Peak Power" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-4 rounded-md border border-slate-200/80 shadow-2xs lg:col-span-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-3">VO2Max vs Vertical Jump</h3>
                <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={processedData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="label" tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} dy={5} />
                            <YAxis yAxisId="left" tick={{fontSize: 11, fill: '#0ea5e9'}} axisLine={false} tickLine={false} dx={-5} />
                            <YAxis yAxisId="right" orientation="right" tick={{fontSize: 11, fill: '#f43f5e'}} axisLine={false} tickLine={false} dx={5}/>
                            <Tooltip contentStyle={customTooltipStyle} />
                            <Legend wrapperStyle={{fontSize: '11px', color: '#475569', paddingTop: '10px'}} iconType="circle"/>
                            <Line yAxisId="left" type="monotone" dataKey="vo2_max" name="VO2Max" stroke="#0ea5e9" strokeWidth={2.5} dot={{r: 3, fill: '#fff', strokeWidth: 2}} activeDot={{r: 5}} />
                            <Line yAxisId="right" type="monotone" dataKey="vj" name="Vertical Jump (cm)" stroke="#f43f5e" strokeWidth={2.5} dot={{r: 3, fill: '#fff', strokeWidth: 2}} activeDot={{r: 5}} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    const renderMonthlyCharts = () => (
        <div className="space-y-4">
            <div className="bg-white p-4 rounded-md border border-slate-200/80 shadow-2xs">
                <div className="mb-3">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">Tren Makro: Recovery vs Peak Power (30 Hari)</h3>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={processedData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRecMacro" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="label" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={5} interval="preserveStartEnd" minTickGap={20} />
                            <YAxis yAxisId="left" tick={{fontSize: 11, fill: '#10b981'}} axisLine={false} tickLine={false} domain={[0, 100]} dx={-5}/>
                            <YAxis yAxisId="right" orientation="right" tick={{fontSize: 11, fill: '#f59e0b'}} axisLine={false} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} dx={5}/>
                            <Tooltip contentStyle={customTooltipStyle} cursor={{fill: '#f8fafc'}} />
                            <Legend wrapperStyle={{fontSize: '11px', color: '#475569', paddingTop: '10px'}} iconType="circle"/>
                            <Area yAxisId="left" type="monotone" dataKey="recovery" name="Recovery Score %" stroke="#10b981" strokeWidth={2} fill="url(#colorRecMacro)" activeDot={{r: 4}}/>
                            <Bar yAxisId="right" dataKey="peak_power" name="Peak Power (W)" fill="#f59e0b" radius={[3, 3, 0, 0]} barSize={10} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-4 rounded-md border border-slate-200/80 shadow-2xs">
                <div className="mb-3">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">Cardiovascular Stress Trend (RHR & SpO2)</h3>
                </div>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={processedData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="label" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={5} interval="preserveStartEnd" minTickGap={20} />
                            <YAxis yAxisId="left" tick={{fontSize: 11, fill: '#ef4444'}} axisLine={false} tickLine={false} domain={['dataMin - 5', 'dataMax + 5']} dx={-5}/>
                            <YAxis yAxisId="right" orientation="right" tick={{fontSize: 11, fill: '#3b82f6'}} axisLine={false} tickLine={false} domain={[90, 100]} dx={5}/>
                            <Tooltip contentStyle={customTooltipStyle} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}/>
                            <Legend wrapperStyle={{fontSize: '11px', color: '#475569', paddingTop: '10px'}} iconType="circle"/>
                            <Line yAxisId="left" type="monotone" dataKey="rhr" name="Resting HR (bpm)" stroke="#ef4444" strokeWidth={2} dot={{r: 3, fill: '#fff', strokeWidth: 2}} activeDot={{r: 4}} />
                            <Line yAxisId="right" type="monotone" dataKey="spo2" name="SpO2 (%)" stroke="#3b82f6" strokeWidth={2} dot={{r: 3, fill: '#fff', strokeWidth: 2}} activeDot={{r: 4}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Filter Control Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-md border border-slate-200/80 shadow-2xs">
                {/* Segmented Range Buttons */}
                <div className="inline-flex bg-slate-100 p-0.5 rounded-md border border-slate-200">
                    {['Harian', 'Mingguan', 'Bulanan'].map(range => (
                        <button 
                            key={range} 
                            type="button"
                            onClick={() => setTimeRange(range)} 
                            className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                                timeRange === range 
                                    ? 'bg-white text-orange-600 shadow-2xs' 
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
                
                {/* Date Picker */}
                <div className="relative">
                    <CalendarDays size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input 
                        type="date" 
                        value={selectedDate} 
                        onChange={(e) => setSelectedDate(e.target.value)} 
                        className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer"
                    />
                </div>
            </div>

            {periodDays === 0 ? (
                <div className="bg-white p-8 rounded-md text-center border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center min-h-[300px] space-y-2">
                    <BarChart3 className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800">Tidak Ada Data Metrik</h3>
                    <p className="text-xs text-slate-500 max-w-sm">
                        Belum ada metrik yang tercatat untuk periode {formatDateToIndo(startDate, 'short')} – {formatDateToIndo(endDate, 'short')}.
                    </p>
                </div>
            ) : (
                <>
                    {/* 4 Summary KPI Metric Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div className="bg-white p-3 rounded-md border border-slate-200/80 shadow-2xs">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">Avg Recovery</span>
                                <HeartPulse size={13} className="text-rose-500" />
                            </div>
                            <div className="text-lg sm:text-xl font-black text-slate-900">{periodAvgRecovery}%</div>
                            <span className={`text-[10px] font-bold mt-0.5 inline-block ${
                                periodAvgRecovery >= 75 ? 'text-emerald-600' : periodAvgRecovery >= 35 ? 'text-amber-600' : 'text-rose-600'
                            }`}>
                                {periodStatus}
                            </span>
                        </div>

                        <div className="bg-white p-3 rounded-md border border-slate-200/80 shadow-2xs">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">Max Peak Power</span>
                                <Zap size={13} className="text-amber-500" />
                            </div>
                            <div className="text-lg sm:text-xl font-black text-slate-900">{periodMaxPeakPower} <span className="text-xs font-normal text-slate-400">W</span></div>
                            <span className="text-[10px] font-semibold text-slate-400 mt-0.5 inline-block">Watt output</span>
                        </div>

                        <div className="bg-white p-3 rounded-md border border-slate-200/80 shadow-2xs">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">Avg VO2Max</span>
                                <Activity size={13} className="text-sky-500" />
                            </div>
                            <div className="text-lg sm:text-xl font-black text-slate-900">{periodAvgVo2Max}</div>
                            <span className="text-[10px] font-semibold text-slate-400 mt-0.5 inline-block">ml/kg/min</span>
                        </div>

                        <div className="bg-white p-3 rounded-md border border-slate-200/80 shadow-2xs">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">Avg RHR</span>
                                <TrendingUp size={13} className="text-emerald-500" />
                            </div>
                            <div className="text-lg sm:text-xl font-black text-slate-900">{periodAvgRhr} <span className="text-xs font-normal text-slate-400">bpm</span></div>
                            <span className="text-[10px] font-semibold text-slate-400 mt-0.5 inline-block">Denyut istirahat</span>
                        </div>
                    </div>

                    {/* Chart Views */}
                    {timeRange === 'Harian' && renderDailyCharts()}
                    {timeRange === 'Mingguan' && renderWeeklyCharts()}
                    {timeRange === 'Bulanan' && renderMonthlyCharts()}

                    {/* Tabular Breakdown */}
                    <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden">
                        <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <ListFilter size={13} className="text-slate-500" />
                                <h3 className="text-xs font-bold text-slate-900">Rincian Data ({timeRange})</h3>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs whitespace-nowrap">
                                <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="px-4 py-2.5">Tanggal</th>
                                        <th className="hidden md:table-cell px-3 py-2.5 text-center">RHR</th>
                                        <th className="hidden md:table-cell px-3 py-2.5 text-center">SpO2</th>
                                        <th className="hidden md:table-cell px-3 py-2.5 text-center">BB (kg)</th>
                                        <th className="hidden md:table-cell px-3 py-2.5 text-center">VJ (cm)</th>
                                        <th className="hidden md:table-cell px-3 py-2.5 text-center">VO2Max</th>
                                        <th className="hidden md:table-cell px-3 py-2.5 text-center">Peak Power</th>
                                        <th className="px-4 py-2.5 text-center">Status</th>
                                        <th className="md:hidden px-4 py-2.5 text-right">Detail</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {processedData.map((item, index) => {
                                        const isExpanded = expandedRow === index;
                                        return (
                                            <Fragment key={index}>
                                                <tr className={`hover:bg-slate-50/70 transition-colors ${isExpanded ? 'bg-slate-50' : ''}`}>
                                                    <td className="px-4 py-2.5 font-bold text-slate-800">
                                                        {formatDateToIndo(item.full_date, 'short')}
                                                    </td>
                                                    <td className="hidden md:table-cell px-3 py-2.5 text-center text-slate-600 font-semibold">{item.rhr}</td>
                                                    <td className="hidden md:table-cell px-3 py-2.5 text-center text-slate-600 font-semibold">{item.spo2}%</td>
                                                    <td className="hidden md:table-cell px-3 py-2.5 text-center text-slate-600 font-semibold">{item.weight}</td>
                                                    <td className="hidden md:table-cell px-3 py-2.5 text-center text-slate-600 font-semibold">{item.vj}</td>
                                                    <td className="hidden md:table-cell px-3 py-2.5 text-center text-slate-600 font-semibold">{Number(item.vo2_max).toLocaleString('id-ID', { minimumFractionDigits: 2 })}</td>
                                                    <td className="hidden md:table-cell px-3 py-2.5 text-center text-slate-600 font-semibold">{Number(item.peak_power).toLocaleString('id-ID')} W</td>
                                                    <td className="px-4 py-2.5 text-center">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold border ${
                                                            item.status === 'RECOVERY BAIK' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                                            item.status === 'RECOVERY CUKUP' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                                            'bg-rose-50 text-rose-700 border-rose-200'
                                                        }`}>
                                                            {item.recovery}% ({item.status.replace('RECOVERY ', '')})
                                                        </span>
                                                    </td>
                                                    <td className="md:hidden px-4 py-2.5 text-right">
                                                        <button 
                                                            onClick={() => toggleExpand(index)} 
                                                            className="p-1 rounded border border-slate-200 text-slate-600 hover:text-orange-600"
                                                        >
                                                            {isExpanded ? <EyeOff size={13} /> : <Eye size={13} />}
                                                        </button>
                                                    </td>
                                                </tr>
                                            </Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}