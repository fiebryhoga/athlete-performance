import { Activity, Droplets, Zap, Target, ArrowDown, ArrowUp, Minus, Gauge, Scale, HeartPulse, Dumbbell } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, AreaChart, Area, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function AnalyticsDashboard({ history, athlete, benchmarks }) {
    if (!history || history.length === 0) return null;

    const reversedHistory = [...history].reverse();
    const latest = history[0]; 
    const prev = history.length > 1 ? history[1] : null; 

    const prevDateStr = prev ? new Date(prev.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '';

    
    
    
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-md p-3 md:p-4 rounded-lg border border-slate-100 shadow-xl">
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 md:mb-3 border-b border-slate-100 pb-2">{label}</p>
                    <div className="space-y-1.5 md:space-y-2">
                        {payload.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between gap-4 text-xs md:text-sm font-bold">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
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

    
    
    
    const renderDiff = (current, previous, isReversedGood = false, unit = '') => {
        if (!previous) return <span className="text-slate-400 text-[9px] md:text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-md uppercase tracking-widest">Data Perdana</span>;
        
        const diff = (parseFloat(current || 0) - parseFloat(previous || 0)).toFixed(1);
        if (diff == 0) return <span className="text-slate-500 text-[10px] md:text-xs font-bold flex items-center bg-slate-100 px-2 py-1 rounded-md shadow-sm"><Minus className="w-3 h-3 mr-1"/> Tetap</span>;
        
        const isDown = diff < 0;
        const isGood = isReversedGood ? isDown : !isDown;
        const color = isGood ? 'text-emerald-600' : 'text-rose-600';
        const bg = isGood ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100';
        const Icon = isDown ? ArrowDown : ArrowUp;
        
        return (
            <span className={`${color} ${bg} border text-[10px] md:text-xs font-bold flex items-center px-1.5 md:px-2 py-0.5 md:py-1 rounded-md shadow-sm transition-transform hover:scale-105 whitespace-nowrap`}>
                <Icon className="w-3 h-3 mr-0.5"/> {Math.abs(diff)}{unit}
            </span>
        );
    };

    
    
    
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
            ? ['bg-rose-400', 'bg-amber-400', 'bg-emerald-400', 'bg-teal-400'] 
            : ['bg-teal-400', 'bg-emerald-400', 'bg-amber-400', 'bg-rose-400'];

        return (
            <div className="bg-white p-4 md:p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md hover:border-orange-200 transition-all">
                <div className="flex justify-between items-end mb-5 md:mb-6 relative z-10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight w-1/2">{title}</span>
                    <span className="text-2xl md:text-3xl font-black text-[#ff4d00]">{value || '-'}<span className="text-xs md:text-sm font-bold text-slate-400 ml-1">{unit}</span></span>
                </div>
                
                <div className="relative w-full z-10">
                    <div className="w-full h-2 md:h-3 rounded-full overflow-hidden flex shadow-inner border border-slate-100/50">
                        <div className={`h-full ${colors[0]}`} style={{ width: '25%' }}></div>
                        <div className={`h-full ${colors[1]}`} style={{ width: '25%' }}></div>
                        <div className={`h-full ${colors[2]}`} style={{ width: '25%' }}></div>
                        <div className={`h-full ${colors[3]}`} style={{ width: '25%' }}></div>
                    </div>
                    
                    {value && (
                        <div 
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 md:w-2 h-5 md:h-7 bg-slate-800 border-[1.5px] border-white rounded-full shadow-md transition-all duration-1000 ease-out" 
                            style={{ left: `${pos}%` }}
                        >
                            <div className="absolute -top-6 md:-top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[9px] md:text-[10px] font-bold py-0.5 px-1.5 md:px-2 rounded-md whitespace-nowrap shadow-lg">
                                {value}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="flex justify-between mt-2 md:mt-3 text-[8px] md:text-[9px] font-bold text-slate-400 uppercase z-10">
                    <span className="w-1/4 text-center truncate pr-0.5">{labels[0]}</span>
                    <span className="w-1/4 text-center truncate pr-0.5">{labels[1]}</span>
                    <span className="w-1/4 text-center truncate pr-0.5">{labels[2]}</span>
                    <span className="w-1/4 text-center truncate">{labels[3]}</span>
                </div>
            </div>
        );
    };

    
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
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 max-w-full overflow-hidden">
            
            
            
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                
                
                <div className="bg-white p-4 md:p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group hover:border-orange-200 hover:shadow-md transition-all">
                    <div className="absolute -right-4 -top-4 text-slate-50/80 group-hover:text-orange-50 transition-colors pointer-events-none">
                        <Scale className="w-24 h-24 md:w-32 md:h-32" strokeWidth={1} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-3 md:gap-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <div className="p-1.5 md:p-2 bg-orange-50 rounded-md text-[#ff4d00]"><Scale className="w-3.5 h-3.5 md:w-4 md:h-4"/></div>
                                <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Berat Badan</p>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-end gap-1 md:gap-2 mb-1 md:mb-2">
                                <span className="text-2xl md:text-4xl font-black text-slate-800 leading-none">{latest.weight}</span>
                                <span className="text-xs md:text-sm font-bold text-slate-400 mb-0.5 md:mb-1">kg</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                                {renderDiff(latest.weight, prev?.weight, true)}
                                {prev && <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">vs {prevDateStr}</span>}
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className="bg-white p-4 md:p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group hover:border-teal-200 hover:shadow-md transition-all">
                    <div className="absolute -right-4 -top-4 text-slate-50/80 group-hover:text-teal-50 transition-colors pointer-events-none">
                        <Activity className="w-24 h-24 md:w-32 md:h-32" strokeWidth={1} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-3 md:gap-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <div className="p-1.5 md:p-2 bg-teal-50 rounded-md text-teal-500"><Activity className="w-3.5 h-3.5 md:w-4 md:h-4"/></div>
                                <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Body Fat</p>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-end gap-1 md:gap-2 mb-1 md:mb-2">
                                <span className="text-2xl md:text-4xl font-black text-slate-800 leading-none">{latest.body_fat_percentage || '-'}</span>
                                <span className="text-xs md:text-sm font-bold text-slate-400 mb-0.5 md:mb-1">%</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                                {renderDiff(latest.body_fat_percentage, prev?.body_fat_percentage, true, '%')}
                                {prev && <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">vs {prevDateStr}</span>}
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className="bg-white p-4 md:p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-200 hover:shadow-md transition-all">
                    <div className="absolute -right-4 -top-4 text-slate-50/80 group-hover:text-emerald-50 transition-colors pointer-events-none">
                        <Dumbbell className="w-24 h-24 md:w-32 md:h-32" strokeWidth={1} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-3 md:gap-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <div className="p-1.5 md:p-2 bg-emerald-50 rounded-md text-emerald-600"><Dumbbell className="w-3.5 h-3.5 md:w-4 md:h-4"/></div>
                                <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Massa Otot</p>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-end gap-1 md:gap-2 mb-1 md:mb-2">
                                <span className="text-2xl md:text-4xl font-black text-slate-800 leading-none">{latest.muscle_mass || '-'}</span>
                                <span className="text-xs md:text-sm font-bold text-slate-400 mb-0.5 md:mb-1">kg</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                                {renderDiff(latest.muscle_mass, prev?.muscle_mass, false, 'k')}
                                {prev && <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">vs {prevDateStr}</span>}
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className="bg-white p-4 md:p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-200 hover:shadow-md transition-all">
                    <div className="absolute -right-4 -top-4 text-slate-50/80 group-hover:text-amber-50 transition-colors pointer-events-none">
                        <HeartPulse className="w-24 h-24 md:w-32 md:h-32" strokeWidth={1} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-3 md:gap-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <div className="p-1.5 md:p-2 bg-amber-50 rounded-md text-amber-500"><HeartPulse className="w-3.5 h-3.5 md:w-4 md:h-4"/></div>
                                <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Visceral Fat</p>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-end gap-1 md:gap-2 mb-1 md:mb-2">
                                <span className="text-2xl md:text-4xl font-black text-slate-800 leading-none">{latest.visceral_fat || '-'}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                                {renderDiff(latest.visceral_fat, prev?.visceral_fat, true)}
                                {prev && <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">vs {prevDateStr}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
            
            
            <div>
                <h3 className="text-sm md:text-base font-bold text-slate-800 flex items-center gap-2 mb-4 mt-6 md:mt-8 uppercase tracking-widest">
                    <Gauge className="w-5 h-5 md:w-6 md:h-6 text-[#ff4d00]" /> Kondisi Saat Ini
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <LinearGauge title="Body Mass Index" value={latest.bmi} unit="" thresholds={bmiThresholds} labels={['Under', 'Normal', 'Over', 'Obese']} />
                    <LinearGauge title="Body Fat Percent" value={latest.body_fat_percentage} unit="%" thresholds={fatThresholds} labels={['Athlete', 'Fitness', 'Acceptable', 'Obese']} />
                    <LinearGauge title="Visceral Fat Rating" value={latest.visceral_fat} unit="" thresholds={viscThresholds} labels={['Excellent', 'Normal', 'High', 'Danger']} isReverseColor={true} />
                </div>
            </div>

            
            
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 md:gap-6 pt-2 md:pt-4">
                
                
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 md:p-6 flex flex-col hover:border-orange-200 transition-colors">
                    <div className="flex items-start justify-between mb-6 md:mb-8">
                        <div>
                            <h3 className="text-xs md:text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest"><Target className="w-4 h-4 md:w-5 md:h-5 text-[#ff4d00]" /> Body Recomposition</h3>
                            <p className="text-[10px] md:text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Pergerakan massa otot vs persentase lemak.</p>
                        </div>
                    </div>
                    <div className="h-[250px] md:h-[280px] w-full mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={trendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="date" tick={{fontSize: 10, fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} dy={10} />
                                <YAxis yAxisId="left" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="right" orientation="right" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                                <Legend wrapperStyle={{fontSize: '11px', fontWeight: 700, paddingTop: '10px'}} iconType="circle" />
                                
                                <Bar yAxisId="left" dataKey="weight" name="Berat (Kg)" fill="#e2e8f0" radius={[4,4,0,0]} barSize={16} />
                                <Line yAxisId="left" type="monotone" dataKey="muscle" name="Otot (Kg)" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#fff', strokeWidth: 2}} activeDot={{r: 6, strokeWidth: 0, fill: '#10b981'}} />
                                <Line yAxisId="right" type="monotone" dataKey="fat_percent" name="Lemak (%)" stroke="#ef4444" strokeWidth={3} dot={{r: 4, fill: '#fff', strokeWidth: 2}} activeDot={{r: 6, strokeWidth: 0, fill: '#ef4444'}} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 md:p-6 flex flex-col hover:border-teal-200 transition-colors">
                    <div className="mb-6 md:mb-8">
                        <h3 className="text-xs md:text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest"><Droplets className="w-4 h-4 md:w-5 md:h-5 text-teal-500" /> Tingkat Hidrasi (TBW)</h3>
                        <p className="text-[10px] md:text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Pemantauan persentase air dalam tubuh.</p>
                    </div>
                    <div className="h-[250px] md:h-[280px] w-full mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTbw" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.6}/>
                                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.05}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="date" tick={{fontSize: 10, fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} dy={10} />
                                <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} domain={['dataMin - 3', 'dataMax + 3']} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{fontSize: '11px', fontWeight: 700, paddingTop: '10px'}} iconType="circle" />
                                <Area type="monotone" dataKey="tbw" name="Kadar Air (%)" stroke="#14b8a6" strokeWidth={3} fill="url(#colorTbw)" activeDot={{r: 6, strokeWidth: 0, fill: '#14b8a6'}} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}