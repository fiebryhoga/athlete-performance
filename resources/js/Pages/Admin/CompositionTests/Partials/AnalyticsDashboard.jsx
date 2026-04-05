import { Activity, Droplets, Zap, Target, ArrowDown, ArrowUp, Minus, Gauge, Scale, HeartPulse, Dumbbell } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, AreaChart, Area, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function AnalyticsDashboard({ history, athlete, benchmarks }) {
    if (!history || history.length === 0) return null;

    const reversedHistory = [...history].reverse();
    const latest = history[0]; 
    const prev = history.length > 1 ? history[1] : null; 

    const prevDateStr = prev ? new Date(prev.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '';

    // ==========================================
    // 1. CUSTOM TOOLTIP UNTUK GRAFIK (UI MODERN)
    // ==========================================
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-md p-4 rounded-lg border border-slate-100 shadow-xl">
                    <p className="text-xs  font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">{label}</p>
                    <div className="space-y-2">
                        {payload.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between gap-4 text-sm font-bold">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
                                    <span className="text-slate-600">{entry.name}</span>
                                </div>
                                <span className="text-slate-900">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    // ==========================================
    // 2. FUNGSI KESIMPULAN CEPAT (PERBANDINGAN)
    // ==========================================
    const renderDiff = (current, previous, isReversedGood = false, unit = '') => {
        if (!previous) return <span className="text-slate-400 text-[10px] font-medium bg-slate-100 px-2 py-1 rounded-lg">Data Perdana</span>;
        
        const diff = (parseFloat(current || 0) - parseFloat(previous || 0)).toFixed(1);
        if (diff == 0) return <span className="text-slate-500 text-xs font-bold flex items-center bg-slate-100 px-2.5 py-1 rounded-lg shadow-sm"><Minus className="w-3.5 h-3.5 mr-1"/> Tetap</span>;
        
        const isDown = diff < 0;
        const isGood = isReversedGood ? isDown : !isDown;
        const color = isGood ? 'text-emerald-600' : 'text-rose-600';
        const bg = isGood ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100';
        const Icon = isDown ? ArrowDown : ArrowUp;
        
        return (
            <span className={`${color} ${bg} border text-xs font-bold flex items-center px-2.5 py-1 rounded-lg shadow-sm transition-transform hover:scale-105`}>
                <Icon className="w-3.5 h-3.5 mr-0.5"/> {Math.abs(diff)}{unit}
            </span>
        );
    };

    // ==========================================
    // 3. KOMPONEN SPIDOMETER (GAUGE) ELEGAN
    // ==========================================
    const getPointerPosition = (val, thresholds) => {
        if (!val) return 0;
        if (val < thresholds[0]) {
            const min = thresholds[0] * 0.5; 
            return Math.max(0, (val - min) / (thresholds[0] - min)) * 25;
        } else if (val < thresholds[1]) {
            return 25 + ((val - thresholds[0]) / (thresholds[1] - thresholds[0]) * 25);
        } else if (val < thresholds[2]) {
            return 50 + ((val - thresholds[1]) / (thresholds[2] - thresholds[1]) * 25);
        } else {
            const max = thresholds[2] * 1.5; 
            return Math.min(100, 75 + ((val - thresholds[2]) / (max - thresholds[2]) * 25));
        }
    };

    const LinearGauge = ({ title, value, unit, thresholds, labels, isReverseColor = false }) => {
        const pos = getPointerPosition(parseFloat(value || 0), thresholds);
        
        const colors = isReverseColor 
            ? ['bg-rose-400', 'bg-amber-400', 'bg-emerald-400', 'bg-blue-400'] 
            : ['bg-blue-400', 'bg-emerald-400', 'bg-amber-400', 'bg-rose-400'];

        return (
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="flex justify-between items-end mb-6 relative z-10">
                    <span className="text-[10px]  font-bold text-slate-400 uppercase tracking-widest">{title}</span>
                    <span className="text-3xl  font-bold text-[#00488b]">{value || '-'}<span className="text-sm font-bold text-slate-400 ml-1">{unit}</span></span>
                </div>
                
                <div className="relative w-full z-10">
                    <div className="w-full h-3 rounded-full overflow-hidden flex shadow-inner border border-slate-100/50">
                        <div className={`h-full ${colors[0]}`} style={{ width: '25%' }}></div>
                        <div className={`h-full ${colors[1]}`} style={{ width: '25%' }}></div>
                        <div className={`h-full ${colors[2]}`} style={{ width: '25%' }}></div>
                        <div className={`h-full ${colors[3]}`} style={{ width: '25%' }}></div>
                    </div>
                    {/* Jarum Indikator Premium */}
                    {value && (
                        <div 
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-7 bg-slate-800 border-2 border-white rounded-full shadow-md transition-all duration-1000 ease-out" 
                            style={{ left: `${pos}%` }}
                        >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold py-0.5 px-2 rounded-md whitespace-nowrap shadow-lg">
                                {value}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="flex justify-between mt-3 text-[9px] font-bold text-slate-400 uppercase z-10">
                    <span className="w-1/4 text-center truncate pr-1">{labels[0]}</span>
                    <span className="w-1/4 text-center truncate pr-1">{labels[1]}</span>
                    <span className="w-1/4 text-center truncate pr-1">{labels[2]}</span>
                    <span className="w-1/4 text-center truncate">{labels[3]}</span>
                </div>
            </div>
        );
    };

    // SETUP STANDAR BENCHMARK
    const b = benchmarks;
    const fatStandars = athlete.gender === 'P' ? b.bodyfat_female : b.bodyfat_male;
    const fatThresholds = [fatStandars.athlete, fatStandars.fitness, fatStandars.acceptable];
    const bmiThresholds = [b.bmi.underweight, b.bmi.normal, b.bmi.overweight];
    const viscThresholds = [b.visceral_fat.standard - 3, b.visceral_fat.standard, b.visceral_fat.high];

    const trendData = reversedHistory.map(item => ({
        date: new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        weight: parseFloat(item.weight),
        muscle: parseFloat(item.muscle_mass || 0),
        fat_percent: parseFloat(item.body_fat_percentage || 0),
        tbw: parseFloat(item.total_body_water || 0),
        visceral: parseFloat(item.visceral_fat || 0)
    }));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* ========================================== */}
            {/* BAGIAN 1: KESIMPULAN CEPAT (CARDS) */}
            {/* ========================================== */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                
                {/* Card Berat Badan */}
                <div className="bg-white p-5 md:p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="absolute -right-6 -top-6 text-slate-50/80 group-hover:text-blue-50/50 transition-colors pointer-events-none">
                        <Scale className="w-32 h-32" strokeWidth={1} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-50 rounded-lg text-[#00488b]"><Scale className="w-4 h-4"/></div>
                                <p className="text-[10px] md:text-xs  font-bold text-slate-500 uppercase tracking-widest">Berat Badan</p>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-3xl md:text-4xl  font-bold text-slate-800 leading-none">{latest.weight}</span>
                                <span className="text-sm font-bold text-slate-400 mb-1">kg</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {renderDiff(latest.weight, prev?.weight, true)}
                                {prev && <span className="text-[10px] font-medium text-slate-400">vs {prevDateStr}</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Body Fat */}
                <div className="bg-white p-5 md:p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="absolute -right-6 -top-6 text-slate-50/80 group-hover:text-rose-50/50 transition-colors pointer-events-none">
                        <Activity className="w-32 h-32" strokeWidth={1} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-rose-50 rounded-lg text-rose-500"><Activity className="w-4 h-4"/></div>
                                <p className="text-[10px] md:text-xs  font-bold text-slate-500 uppercase tracking-widest">Body Fat</p>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-3xl md:text-4xl  font-bold text-slate-800 leading-none">{latest.body_fat_percentage || '-'}</span>
                                <span className="text-sm font-bold text-slate-400 mb-1">%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {renderDiff(latest.body_fat_percentage, prev?.body_fat_percentage, true, '%')}
                                {prev && <span className="text-[10px] font-medium text-slate-400">vs {prevDateStr}</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Massa Otot */}
                <div className="bg-white p-5 md:p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="absolute -right-6 -top-6 text-slate-50/80 group-hover:text-emerald-50/50 transition-colors pointer-events-none">
                        <Dumbbell className="w-32 h-32" strokeWidth={1} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Dumbbell className="w-4 h-4"/></div>
                                <p className="text-[10px] md:text-xs  font-bold text-slate-500 uppercase tracking-widest">Massa Otot</p>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-3xl md:text-4xl  font-bold text-slate-800 leading-none">{latest.muscle_mass || '-'}</span>
                                <span className="text-sm font-bold text-slate-400 mb-1">kg</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {renderDiff(latest.muscle_mass, prev?.muscle_mass, false, 'k')}
                                {prev && <span className="text-[10px] font-medium text-slate-400">vs {prevDateStr}</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Visceral Fat */}
                <div className="bg-white p-5 md:p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="absolute -right-6 -top-6 text-slate-50/80 group-hover:text-amber-50/50 transition-colors pointer-events-none">
                        <HeartPulse className="w-32 h-32" strokeWidth={1} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-amber-50 rounded-lg text-amber-500"><HeartPulse className="w-4 h-4"/></div>
                                <p className="text-[10px] md:text-xs  font-bold text-slate-500 uppercase tracking-widest">Visceral Fat</p>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-3xl md:text-4xl  font-bold text-slate-800 leading-none">{latest.visceral_fat || '-'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {renderDiff(latest.visceral_fat, prev?.visceral_fat, true)}
                                {prev && <span className="text-[10px] font-medium text-slate-400">vs {prevDateStr}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================================== */}
            {/* BAGIAN 2: SNAPSHOT SPIDOMETER (GAUGE) */}
            {/* ========================================== */}
            <div>
                <h3 className="text-lg  font-bold text-slate-800 flex items-center gap-2 mb-4 mt-6">
                    <Gauge className="w-6 h-6 text-[#00488b]" /> Peta Kondisi Saat Ini
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <LinearGauge title="Body Mass Index" value={latest.bmi} unit="" thresholds={bmiThresholds} labels={['Under', 'Normal', 'Over', 'Obese']} />
                    <LinearGauge title="Body Fat Percent" value={latest.body_fat_percentage} unit="%" thresholds={fatThresholds} labels={['Athlete', 'Fitness', 'Acceptable', 'Obese']} />
                    <LinearGauge title="Visceral Fat Rating" value={latest.visceral_fat} unit="" thresholds={viscThresholds} labels={['Excellent', 'Normal', 'High', 'Danger']} />
                </div>
            </div>

            {/* ========================================== */}
            {/* BAGIAN 3: GRAFIK TREN (RECHARTS) */}
            {/* ========================================== */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4">
                
                {/* GRAFIK 1: BODY RECOMPOSITION */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h3 className="text-lg  font-bold text-slate-800 flex items-center gap-2"><Target className="w-6 h-6 text-[#00488b]" /> Body Recomposition</h3>
                            <p className="text-sm font-medium text-slate-500 mt-1">Pergerakan massa otot vs persentase lemak.</p>
                        </div>
                    </div>
                    <div className="h-[280px] w-full mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={trendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="date" tick={{fontSize: 11, fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} dy={15} />
                                <YAxis yAxisId="left" tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="right" orientation="right" tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                                <Legend wrapperStyle={{fontSize: '12px', fontWeight: 700, paddingTop: '20px'}} iconType="circle" />
                                
                                <Bar yAxisId="left" dataKey="weight" name="Berat (Kg)" fill="#e2e8f0" radius={[6,6,0,0]} barSize={20} />
                                <Line yAxisId="left" type="monotone" dataKey="muscle" name="Otot (Kg)" stroke="#10b981" strokeWidth={4} dot={{r: 5, fill: '#fff', strokeWidth: 3}} activeDot={{r: 7, strokeWidth: 0, fill: '#10b981'}} />
                                <Line yAxisId="right" type="monotone" dataKey="fat_percent" name="Lemak (%)" stroke="#ef4444" strokeWidth={4} dot={{r: 5, fill: '#fff', strokeWidth: 3}} activeDot={{r: 7, strokeWidth: 0, fill: '#ef4444'}} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* GRAFIK 2: HYDRATION & METABOLIC */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col">
                    <div className="mb-8">
                        <h3 className="text-lg  font-bold text-slate-800 flex items-center gap-2"><Droplets className="w-6 h-6 text-blue-500" /> Tingkat Hidrasi (TBW)</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">Pemantauan persentase air dalam tubuh.</p>
                    </div>
                    <div className="h-[280px] w-full mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTbw" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="date" tick={{fontSize: 11, fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} dy={15} />
                                <YAxis tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} domain={['dataMin - 3', 'dataMax + 3']} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{fontSize: '12px', fontWeight: 700, paddingTop: '20px'}} iconType="circle" />
                                <Area type="monotone" dataKey="tbw" name="Kadar Air (%)" stroke="#3b82f6" strokeWidth={4} fill="url(#colorTbw)" activeDot={{r: 7, strokeWidth: 0, fill: '#3b82f6'}} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}