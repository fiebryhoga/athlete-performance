import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage } from '@inertiajs/react';
import { 
    Users, Activity, Trophy, TrendingUp, Calendar, 
    Ruler, Weight, Timer, Target, Zap, ChevronRight,
    Sparkles 
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, 
    PolarAngleAxis, PolarRadiusAxis, Legend 
} from 'recharts';

export default function Dashboard({ auth }) {
    
    const { 
        stats = {}, 
        charts = { radar: [], gender: [] }, 
        lists = { recent_activity: [], top_athletes: [], cabor_performance: [] } 
    } = usePage().props;

    
    const GENDER_COLORS = ['#ff4d00', '#ec4899']; 
    
    
    const getTrend = (idx) => idx % 2 === 0 ? '+2.4%' : '-1.1%';
    const getTrendColor = (idx) => idx % 2 === 0 ? 'text-emerald-300' : 'text-rose-300';

    return (
        <AdminLayout title="Dashboard">
            <Head title="Performance Overview" />

            <div className="space-y-8 pb-10">
                
                
                <div className="relative rounded-2xl p-8 md:p-10 shadow-xl shadow-[#ff4d00]/10 border border-[#ff4d00]/20 overflow-hidden group">
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ff4d00] via-[#ff6600] to-[#ff8c00] z-0"></div>
                    
                    
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] z-0 pointer-events-none"></div>
                    
                    
                    <div className="absolute -right-20 -top-20 w-[400px] h-[400px] border-[40px] border-white/5 rounded-full z-0 pointer-events-none"></div>
                    <div className="absolute right-32 -bottom-24 w-[300px] h-[300px] border-[20px] border-white/5 rounded-full z-0 pointer-events-none"></div>

                    
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/20 rounded-full mix-blend-overlay filter blur-[100px] animate-pulse z-0 pointer-events-none"></div>

                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                        <div className="max-w-2xl">
                            
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-5 shadow-sm">
                                <Sparkles size={14} className="text-yellow-200 fill-yellow-200" /> 
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Coach Area</span>
                            </div>
                            
                            
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-sm leading-tight">
                                Welcome back, <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-white">{auth.user.name} 👋</span>
                            </h1>
                            
                            
                            <p className="text-orange-100 text-sm leading-relaxed font-medium max-w-lg">
                                Berikut adalah ringkasan performa terbaru. Anda membina <span className="font-bold text-white border-b border-white/40 pb-0.5">{stats?.total_atlet || 0} atlet aktif</span> yang siap mencapai potensi maksimalnya hari ini.
                            </p>
                        </div>
                        
                        
                        <div className="w-full md:w-auto flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-4 rounded-xl shadow-lg hover:bg-white/20 transition-all cursor-default relative overflow-hidden group/date">
                            
                            <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-0 group-hover/date:animate-shine"></div>
                            
                            <div className="relative z-10 w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-[#ff4d00] shrink-0">
                                <Calendar size={20} strokeWidth={2.5} />
                            </div>
                            <div className="relative z-10 pr-2">
                                <p className="text-[10px] text-orange-200 font-bold tracking-wider mb-0.5 uppercase">Tanggal Hari Ini</p>
                                <p className="text-base font-bold text-white leading-none whitespace-nowrap">
                                    {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard 
                        title="Total Athletes" 
                        value={stats?.total_atlet || 0} 
                        icon={Users} 
                        colorClass="bg-orange-50 text-[#ff4d00]"
                    />
                    <StatCard 
                        title="Sessions This Month" 
                        value={stats?.sesi_bulan_ini || 0} 
                        icon={Calendar} 
                        colorClass="bg-purple-50 text-purple-600"
                    />
                    <StatCard 
                        title="Global Avg Score" 
                        value={stats?.avg_skor_global || 0} 
                        icon={Activity} 
                        colorClass="bg-emerald-50 text-emerald-600"
                    />
                    <StatCard 
                        title="Top Category" 
                        value={stats?.cabor_unggulan || '-'} 
                        icon={Trophy} 
                        isText={true}
                        colorClass="bg-amber-50 text-amber-600"
                    />
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <MiniStatCard label="Average Age" value={stats?.avg_age || 0} unit="Years Old" icon={Timer} />
                    <MiniStatCard label="Average Height" value={stats?.avg_height || 0} unit="Centimeters" icon={Ruler} />
                    <MiniStatCard label="Average Weight" value={stats?.avg_weight || 0} unit="Kilograms" icon={Weight} />
                </div>

                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-5 border-b border-slate-100 bg-slate-50/30">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600"><Target size={16} /></div>
                                    Benchmark Analysis
                                </h3>
                            </div>
                            <div className="p-2 flex-1 min-h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    
                                    {charts?.radar?.length > 0 ? (
                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={charts.radar}>
                                            <defs>
                                                <linearGradient id="colorAthlete" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ff4d00" stopOpacity={0.7}/>
                                                    <stop offset="95%" stopColor="#ff4d00" stopOpacity={0.1}/>
                                                </linearGradient>
                                            </defs>
                                            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar name="Target" dataKey="B" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                                            <Radar name="Athlete" dataKey="A" stroke="#ff4d00" strokeWidth={2} fill="url(#colorAthlete)" fillOpacity={1} />
                                            <Tooltip contentStyle={{borderRadius:'8px', border:'none'}} itemStyle={{fontSize:'12px', fontWeight:'bold', color: '#1e293b'}} />
                                            <Legend wrapperStyle={{fontSize:'11px', paddingTop:'10px'}} iconType="circle"/>
                                        </RadarChart>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">No benchmark data available</div>
                                    )}
                                </ResponsiveContainer>
                            </div>
                        </div>

                        
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-5 border-b border-slate-100 bg-slate-50/30">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <div className="p-1.5 bg-pink-50 rounded-lg text-pink-500"><Users size={16} /></div>
                                    Gender Distribution
                                </h3>
                            </div>
                            <div className="p-4 flex-1 flex flex-col items-center justify-center relative min-h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    {charts?.gender?.length > 0 ? (
                                        <PieChart>
                                            <Pie data={charts.gender} innerRadius={65} outerRadius={85} dataKey="value" paddingAngle={4} stroke="none">
                                                {charts.gender.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{borderRadius:'8px', border:'none'}} itemStyle={{fontSize:'12px', fontWeight:'bold'}} />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '12px'}}/>
                                        </PieChart>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">No gender data</div>
                                    )}
                                </ResponsiveContainer>
                                {charts?.gender?.length > 0 && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                                        <span className="text-3xl font-black text-slate-700">{charts.gender.reduce((a, b) => a + b.value, 0)}</span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm md:col-span-2 overflow-hidden">
                            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <div className="p-1.5 bg-orange-50 rounded-lg text-[#ff4d00]"><Activity size={16} /></div>
                                    Recent Activity
                                </h3>
                            </div>
                            
                            <div className="p-2">
                                
                                {(lists?.recent_activity?.length || 0) > 0 ? (
                                    <div className="divide-y divide-slate-50">
                                        {lists.recent_activity.slice(0, 3).map((act, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors group cursor-default">
                                                <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ff4d00] font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
                                                    {act.user ? act.user.substring(0,2).toUpperCase() : 'NA'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center mb-0.5">
                                                        <p className="text-sm font-bold text-slate-800 truncate pr-2">{act.title}</p>
                                                        <span className="text-xs font-bold text-[#ff4d00] bg-orange-50 px-2 py-0.5 rounded border border-orange-100">{act.score}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-xs text-slate-500 truncate"><span className="font-medium text-slate-600">{act.user}</span> • {act.sport}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap pl-2">{act.date}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center"><p className="text-sm text-slate-400 italic font-medium">No recent activity found.</p></div>
                                )}
                            </div>
                        </div>
                    </div>

                    
                    <div className="space-y-6">
                        
                        
                        <div className="bg-[#ff4d00] rounded-lg p-6 text-white shadow-lg relative overflow-hidden h-fit">
                             <Trophy size={140} className="absolute -top-4 -right-6 opacity-10 rotate-12" />
                             <h3 className="font-bold text-xl mb-6 relative z-10 border-b border-white/20 pb-4">🏆 Top 5 Elite</h3>
                             <div className="space-y-4 relative z-10">
                                
                                {(lists?.top_athletes?.length || 0) > 0 ? lists.top_athletes.map((user, idx) => (
                                    <div key={idx} className="flex items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm hover:bg-white/20 transition cursor-pointer border border-white/5">
                                        <div className="w-8 h-8 flex items-center justify-center bg-white text-[#ff4d00] font-bold rounded-full mr-3 text-sm shadow-md">{idx + 1}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{user.name}</p>
                                            <p className="text-xs text-orange-200">{user.sport}</p>
                                        </div>
                                        <div className="text-right ml-2">
                                            <p className="font-bold text-sm">{user.score}</p>
                                            <p className={`text-[10px] font-medium ${getTrendColor(idx)}`}>{getTrend(idx)}</p>
                                        </div>
                                    </div>
                                )) : <p className="text-sm text-orange-200 font-medium">Not enough data.</p>}
                             </div>
                        </div>

                        
                        <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <Zap size={16} className="text-amber-500"/> Sport Rankings
                            </h3>
                            <div className="space-y-3">
                                
                                {(lists?.cabor_performance?.length || 0) > 0 ? lists.cabor_performance.slice(0, 5).map((cabor, idx) => (
                                    <div key={idx} className="group">
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-sm font-semibold text-slate-700">{cabor.name}</span>
                                            <span className="text-sm font-bold text-slate-800">{cabor.score}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2">
                                            <div className="bg-slate-800 h-2 rounded-full transition-all duration-500 group-hover:bg-[#ff4d00]" style={{width: `${cabor.score}%`}}></div>
                                        </div>
                                    </div>
                                )) : <p className="text-xs text-slate-400 font-medium">No sport data available.</p>}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}



function StatCard({ title, value, icon: Icon, colorClass, isText = false }) {
    return (
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">{title}</p>
                    <h3 className={`font-black text-slate-800 ${isText ? 'text-xl mt-1 truncate' : 'text-3xl'}`}>
                        {value}
                    </h3>
                </div>
                <div className={`p-3 rounded-lg ${colorClass} shrink-0`}>
                    <Icon size={20} />
                </div>
            </div>
        </div>
    );
}

function MiniStatCard({ label, value, unit, icon: Icon }) {
    return (
        <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm flex items-center gap-4 hover:border-orange-200 transition-colors">
            <div className="p-3 bg-slate-50 text-slate-600 rounded-lg border border-slate-100 shrink-0">
                <Icon size={20} />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">{label}</p>
                <div className="flex items-baseline gap-1">
                    <p className="text-xl font-black text-slate-800 truncate">{value}</p>
                    <span className="text-xs text-slate-400 font-medium truncate">{unit}</span>
                </div>
            </div>
        </div>
    );
}