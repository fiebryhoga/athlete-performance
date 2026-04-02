import { Calendar, Edit3, Plus, TrendingUp, Target } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Bar, Line } from 'recharts';

export default function WeeklyGroup({ week, formatDateToIndo, openModal, sessionTypes, physicalPrepTypes, skillTypes, matchTypes, travelTypes }) {
    
    // Custom Tooltip Style
    const customTooltipStyle = {
        borderRadius: '8px', border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px',
        backgroundColor: '#fff', color: '#334155', padding: '10px'
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
            
            {/* HEADER MINGGU */}
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Calendar className="w-5 h-5"/>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 text-base">Minggu: {week.label}</h3>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg flex items-center gap-3 shadow-sm w-fit">
                    <span className="text-xs font-medium text-slate-500">Weekly Wellness Score</span>
                    <span className="font-bold text-slate-800 text-lg">{week.metrics.weeklyWellnessScore} <span className="text-xs font-normal text-slate-400">/ 280</span></span>
                </div>
            </div>
            
            {/* MICRO CHART & PEAK STATS */}
            <div className="p-6 border-b border-slate-100 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white">
                <div className="h-56 w-full lg:col-span-2">
                    <h4 className="text-sm font-semibold text-slate-700 mb-4">Grafik Beban Harian (AU) vs Kebugaran</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={week.days.map(d => ({ day: d.dayName.substring(0,3), load: d.load, wellness: d.wellness }))} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="day" tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} dy={5} />
                            <YAxis yAxisId="left" tick={{fontSize: 11, fill: '#3b82f6'}} axisLine={false} tickLine={false} dx={-5} />
                            <YAxis yAxisId="right" orientation="right" tick={{fontSize: 11, fill: '#f43f5e'}} axisLine={false} tickLine={false} domain={[0,40]} dx={5} />
                            <RechartsTooltip contentStyle={customTooltipStyle} cursor={{fill: '#f8fafc'}} />
                            <Bar yAxisId="left" dataKey="load" name="Daily Load (AU)" fill="#3b82f6" radius={[4,4,0,0]} barSize={28} />
                            <Line yAxisId="right" type="monotone" dataKey="wellness" name="Wellness Score" stroke="#f43f5e" strokeWidth={2} dot={{r: 3, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 5}} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="flex flex-col justify-center gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-xs font-medium text-slate-500">Puncak Beban Latihan</p>
                        <div className="mt-2 flex items-baseline gap-1">
                            <span className="font-bold text-2xl text-slate-800">{Math.max(...week.days.map(d => d.load))}</span>
                            <span className="text-sm text-slate-500">AU</span>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-xs font-medium text-slate-500">Kebugaran Minimum</p>
                        <div className="mt-2 flex items-baseline gap-1">
                            <span className="font-bold text-2xl text-slate-800">
                                {week.days.filter(d => d.wellness > 0).length > 0 ? Math.min(...week.days.filter(d => d.wellness > 0).map(d => d.wellness)) : 0}
                            </span>
                            <span className="text-sm text-slate-500">/ 40</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABEL HARIAN (Dengan Ghost Button Action) */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        <tr>
                            <th className="px-6 py-4 font-medium">Hari / Tanggal</th>
                            <th className="px-4 py-4 font-medium text-center">Wellness</th>
                            <th className="px-4 py-4 font-medium">Sesi Pagi (AM)</th>
                            <th className="px-4 py-4 font-medium">Sesi Sore (PM)</th>
                            <th className="px-4 py-4 font-medium text-center">Daily Load</th>
                            <th className="px-6 py-4 font-medium text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {week.days.map((day, dIndex) => (
                            <tr key={dIndex} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-800 capitalize">{day.dayName}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{formatDateToIndo(day.dateObj, 'short')}</div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex justify-center">
                                        {day.wellness ? (
                                            <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 bg-rose-50 text-rose-600 rounded-md text-sm font-medium border border-rose-100">{day.wellness}</span>
                                        ) : <span className="text-slate-300">-</span>}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    {day.data?.am_load ? (
                                        <div>
                                            <div className="font-medium text-slate-700">{day.data.am_load} <span className="text-xs text-slate-400">AU</span></div>
                                            <div className="text-xs text-slate-500 mt-0.5">{day.data.am_session_type}</div>
                                        </div>
                                    ) : <span className="text-slate-300">-</span>}
                                </td>
                                <td className="px-4 py-4">
                                    {day.data?.pm_load ? (
                                        <div>
                                            <div className="font-medium text-slate-700">{day.data.pm_load} <span className="text-xs text-slate-400">AU</span></div>
                                            <div className="text-xs text-slate-500 mt-0.5">{day.data.pm_session_type}</div>
                                        </div>
                                    ) : <span className="text-slate-300">-</span>}
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex justify-center">
                                        {day.load ? (
                                            <span className="inline-flex items-center justify-center min-w-[40px] px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium border border-blue-100">{day.load}</span>
                                        ) : <span className="text-slate-300">-</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center">
                                        <button 
                                            onClick={() => openModal(day.dateStr)} 
                                            title={day.data ? "Edit Data" : "Isi Data"}
                                            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 text-slate-400 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
                                        >
                                            {day.data ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* FOOTER 1: SUMMARY MINGGUAN (SPORTS SCIENCE METRICS) */}
            <div className="bg-blue-950 p-6 text-white">
                <div className="flex items-center gap-2 mb-4 text-slate-300">
                    <TrendingUp className="w-4 h-4" />
                    <h4 className="text-sm font-medium">Load Metrics & Monitoring</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-x divide-slate-700">
                    <div className="px-2 md:px-4 first:pl-0">
                        <p className="text-xs text-slate-400 mb-1">Weekly Load</p>
                        <p className="text-2xl font-bold text-white">{week.metrics.weeklyLoad}</p>
                    </div>
                    <div className="px-4">
                        <p className="text-xs text-slate-400 mb-1">Mean Daily Load</p>
                        <p className="text-lg font-semibold text-white mt-1">{week.metrics.meanLoad}</p>
                    </div>
                    <div className="px-4">
                        <p className="text-xs text-slate-400 mb-1">Std Deviation</p>
                        <p className="text-lg font-semibold text-white mt-1">{week.metrics.stdDev}</p>
                    </div>
                    <div className="px-4">
                        <p className="text-xs text-slate-400 mb-1">Training Monotony</p>
                        <p className="text-lg font-semibold text-amber-400 mt-1">{week.metrics.monotony}</p>
                    </div>
                    <div className="px-4">
                        <p className="text-xs text-slate-400 mb-1">Strain</p>
                        <p className="text-lg font-semibold text-rose-400 mt-1">{week.metrics.strain}</p>
                    </div>
                </div>
            </div>

            {/* FOOTER 2: TRAINING / MATCH FREQUENCY */}
            <div className="bg-slate-50 p-6">
                <div className="flex items-center gap-2 mb-6 text-slate-600">
                    <Target className="w-4 h-4" />
                    <h4 className="text-sm font-medium">Training / Match Frequency</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                        {physicalPrepTypes.map(t => (
                            <div key={t} className="flex justify-between text-sm border-b border-slate-200 pb-1.5">
                                <span className="text-slate-600">{t}</span>
                                <span className="font-medium text-slate-800">{week.metrics.frequency[t]}</span>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-3">
                        {[...skillTypes, ...matchTypes, ...travelTypes].map(t => (
                            <div key={t} className="flex justify-between text-sm border-b border-slate-200 pb-1.5">
                                <span className="text-slate-600">{t}</span>
                                <span className="font-medium text-slate-800">{week.metrics.frequency[t]}</span>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-fit space-y-3 text-sm">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                            <span className="text-slate-500 font-medium">Total Activity</span>
                            <span className="text-lg font-bold text-blue-600">{week.metrics.totals.all}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                            <span className="text-slate-500">Total Training</span>
                            <span className="font-semibold text-slate-800">{week.metrics.totals.training}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                            <span className="text-slate-500">Physical Prep</span>
                            <span className="font-medium text-slate-700">{week.metrics.totals.physical}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                            <span className="text-slate-500">Skill Sessions</span>
                            <span className="font-medium text-slate-700">{week.metrics.totals.skill}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                            <span className="text-slate-500">Matches/Comps</span>
                            <span className="font-medium text-slate-700">{week.metrics.totals.matches}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">Travel</span>
                            <span className="font-medium text-slate-700">{week.metrics.totals.travel}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}