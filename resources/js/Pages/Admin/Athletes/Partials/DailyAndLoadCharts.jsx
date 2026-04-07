import { HeartPulse, Battery, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ComposedChart, Line } from 'recharts';

export default function DailyAndLoadCharts({ daily_metrics, training_loads }) {
    
    const customTooltipStyle = {
        borderRadius: '8px', border: 'none',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px'
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                <div className="bg-white p-5 md:p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                    <h3 className="text-xs font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-widest">
                        <div className="p-1.5 bg-orange-50 rounded-md text-[#ff4d00]"><Battery className="w-4 h-4" /></div>
                        Training Load Trend (30 Days)
                    </h3>
                    <div className="flex-1 min-h-[300px]">
                        {training_loads && training_loads.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={training_loads} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#fb923c', fontWeight: 600 }} axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#ff4d00', fontWeight: 600 }} axisLine={false} tickLine={false} domain={[0, 40]}/>
                                    <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={customTooltipStyle} />
                                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontWeight: 'bold' }} iconType="circle" />
                                    
                                    
                                    <Bar yAxisId="left" name="Daily Load" dataKey="daily_load" fill="#fed7aa" radius={[4, 4, 0, 0]} barSize={20} />
                                    <Line yAxisId="right" type="monotone" dataKey="wellness" name="Wellness (Max 40)" stroke="#ff4d00" strokeWidth={3} dot={{r: 4, fill: '#fff', strokeWidth: 2}} activeDot={{r: 6, strokeWidth: 0, fill: '#ff4d00'}} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                                <Activity className="w-8 h-8 opacity-20" />
                                <p className="text-xs font-bold uppercase tracking-widest">No load data recorded yet</p>
                            </div>
                        )}
                    </div>
                </div>

                
                <div className="bg-white p-5 md:p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                    <h3 className="text-xs font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-widest">
                        <div className="p-1.5 bg-emerald-50 rounded-md text-emerald-500"><HeartPulse className="w-4 h-4" /></div>
                        Physiological Recovery
                    </h3>
                    <div className="flex-1 min-h-[300px]">
                        {daily_metrics && daily_metrics.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={daily_metrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRecSmall" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" tick={{fontSize: 10, fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} axisLine={false} tickLine={false} domain={[0, 100]}/>
                                    <RechartsTooltip contentStyle={customTooltipStyle} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }} />
                                    <Area type="monotone" dataKey="recovery" name="Recovery %" stroke="#10b981" strokeWidth={3} fill="url(#colorRecSmall)" activeDot={{r: 6, strokeWidth: 0, fill: '#10b981'}} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                                <HeartPulse className="w-8 h-8 opacity-20" />
                                <p className="text-xs font-bold uppercase tracking-widest">No physiological data yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}