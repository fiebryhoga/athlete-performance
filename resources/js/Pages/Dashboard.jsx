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
    // 1. SAFE DESTRUCTURING: Beri nilai default kosong {} agar tidak error jika props undefined
    const { 
        stats = {}, 
        charts = { radar: [], gender: [] }, 
        lists = { recent_activity: [], top_athletes: [], cabor_performance: [] } 
    } = usePage().props;

    // Warna Chart
    const GENDER_COLORS = ['#3b82f6', '#ec4899']; // Blue, Pink
    
    // Helper untuk Trend
    const getTrend = (idx) => idx % 2 === 0 ? '+2.4%' : '-1.1%';
    const getTrendColor = (idx) => idx % 2 === 0 ? 'text-emerald-300' : 'text-rose-300';

    return (
        <AdminLayout title="Dashboard">
            <Head title="Performance Overview" />

            <div className="space-y-8 pb-10">
                
                {/* 1. HEADER SECTION */}
                <div className="relative rounded-3xl p-8 md:p-10 shadow-xl overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00488b] via-[#003666] to-[#002444] z-0"></div>
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] z-0 pointer-events-none"></div>
                    
                    {/* Glow Effects */}
                    <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-400/30 rounded-full mix-blend-overlay filter blur-[80px] opacity-40 animate-pulse z-0"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/30 rounded-full mix-blend-overlay filter blur-[60px] opacity-30 z-0"></div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 py-1.5 rounded-full mb-4 shadow-sm">
                                <Sparkles size={14} className="text-yellow-300 fill-yellow-300" /> 
                                <span className="text-xs font-bold text-white tracking-wide">Coach Dashboard</span>
                            </div>
                            <h1 className="text-3xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-3 drop-shadow-sm">
                                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">{auth.user.name} 👋</span>
                            </h1>
                            <p className="text-blue-100/80 text-xs md:text-sm leading-relaxed font-medium">
                                Here represents the latest performance summary. You currently have <span className="font-bold text-white border-b border-white/30 pb-0.5">{stats?.total_atlet || 0} active athletes</span> ready to reach their peak potential today.
                            </p>
                        </div>
                        
                        <div className="w-full md:w-auto flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-lg shadow-lg hover:bg-white/10 transition-colors cursor-default">
                            <div className="w-8 h-8 bg-white rounded-lg shadow-inner flex items-center justify-center text-[#00488b]">
                                <Calendar size={20} strokeWidth={2.5} />
                            </div>
                            <div className="pr-2">
                                <p className="text-[10px] text-blue-200 font-bold tracking-wider mb-0.5">Today's Date</p>
                                <p className="text-sm font-bold text-white leading-none">
                                    {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. MAIN STATS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard 
                        title="Total Athletes" 
                        value={stats?.total_atlet || 0} 
                        icon={Users} 
                        colorClass="bg-blue-50 text-blue-600"
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

                {/* 3. PHYSICAL STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <MiniStatCard label="Average Age" value={stats?.avg_age || 0} unit="Years Old" icon={Timer} />
                    <MiniStatCard label="Average Height" value={stats?.avg_height || 0} unit="Centimeters" icon={Ruler} />
                    <MiniStatCard label="Average Weight" value={stats?.avg_weight || 0} unit="Kilograms" icon={Weight} />
                </div>

                {/* 4. MIDDLE SECTION: Charts & Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Radar Chart */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-5 border-b border-slate-100 bg-slate-50/30">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600"><Target size={16} /></div>
                                    Benchmark Analysis
                                </h3>
                            </div>
                            <div className="p-2 flex-1 min-h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    {/* 2. SAFE CHECK: Pastikan charts.radar ada isinya sebelum render */}
                                    {charts?.radar?.length > 0 ? (
                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={charts.radar}>
                                            <defs>
                                                <linearGradient id="colorAthlete" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#00488b" stopOpacity={0.7}/>
                                                    <stop offset="95%" stopColor="#00488b" stopOpacity={0.1}/>
                                                </linearGradient>
                                            </defs>
                                            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar name="Target" dataKey="B" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                                            <Radar name="Athlete" dataKey="A" stroke="#00488b" strokeWidth={2} fill="url(#colorAthlete)" fillOpacity={1} />
                                            <Tooltip contentStyle={{borderRadius:'12px', border:'none'}} itemStyle={{fontSize:'12px', fontWeight:'bold', color: '#1e293b'}} />
                                            <Legend wrapperStyle={{fontSize:'11px', paddingTop:'10px'}} iconType="circle"/>
                                        </RadarChart>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-400 text-sm">No benchmark data available</div>
                                    )}
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Pie Chart */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
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
                                            <Tooltip contentStyle={{borderRadius:'12px', border:'none'}} itemStyle={{fontSize:'12px', fontWeight:'bold'}} />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '12px'}}/>
                                        </PieChart>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-400 text-sm">No gender data</div>
                                    )}
                                </ResponsiveContainer>
                                {charts?.gender?.length > 0 && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                                        <span className="text-3xl font-bold text-slate-700">{charts.gender.reduce((a, b) => a + b.value, 0)}</span>
                                        <span className="text-[10px] text-slate-400 font-bold  tracking-wider">Total</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm md:col-span-2 overflow-hidden">
                            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <div className="p-1.5 bg-orange-50 rounded-lg text-orange-500"><Activity size={16} /></div>
                                    Recent Activity
                                </h3>
                            </div>
                            
                            <div className="p-2">
                                {/* 3. SAFE CHECK: Menggunakan '?.' dan '|| []' untuk mencegah error map */}
                                {(lists?.recent_activity?.length || 0) > 0 ? (
                                    <div className="divide-y divide-slate-50">
                                        {lists.recent_activity.slice(0, 3).map((act, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors group cursor-default">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#00488b] font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
                                                    {act.user ? act.user.substring(0,2).toUpperCase() : 'NA'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center mb-0.5">
                                                        <p className="text-sm font-bold text-slate-800 truncate pr-2">{act.title}</p>
                                                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{act.score}</span>
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
                                    <div className="py-8 text-center"><p className="text-sm text-slate-400 italic">No recent activity found.</p></div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-6">
                        
                        {/* Top 5 Elite */}
                        <div className="bg-[#00488b] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden h-fit">
                             <Trophy size={140} className="absolute -top-4 -right-6 opacity-10 rotate-12" />
                             <h3 className="font-bold text-xl mb-6 relative z-10 border-b border-white/20 pb-4">🏆 Top 5 Elite</h3>
                             <div className="space-y-4 relative z-10">
                                {/* 4. SAFE CHECK */}
                                {(lists?.top_athletes?.length || 0) > 0 ? lists.top_athletes.map((user, idx) => (
                                    <div key={idx} className="flex items-center bg-white/10 p-3 rounded-xl backdrop-blur-sm hover:bg-white/20 transition cursor-pointer border border-white/5">
                                        <div className="w-8 h-8 flex items-center justify-center bg-white text-[#00488b] font-bold rounded-full mr-3 text-sm shadow-md">{idx + 1}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{user.name}</p>
                                            <p className="text-xs text-blue-200">{user.sport}</p>
                                        </div>
                                        <div className="text-right ml-2">
                                            <p className="font-bold text-sm">{user.score}</p>
                                            <p className={`text-[10px] ${getTrendColor(idx)}`}>{getTrend(idx)}</p>
                                        </div>
                                    </div>
                                )) : <p className="text-sm text-blue-200">Not enough data.</p>}
                             </div>
                        </div>

                        {/* Sport Rankings */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm  tracking-wider">
                                <Zap size={16} className="text-amber-500"/> Sport Rankings
                            </h3>
                            <div className="space-y-3">
                                {/* 5. SAFE CHECK */}
                                {(lists?.cabor_performance?.length || 0) > 0 ? lists.cabor_performance.slice(0, 5).map((cabor, idx) => (
                                    <div key={idx} className="group">
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-sm font-semibold text-slate-700">{cabor.name}</span>
                                            <span className="text-sm font-bold text-slate-800">{cabor.score}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2">
                                            <div className="bg-slate-800 h-2 rounded-full transition-all duration-500 group-hover:bg-[#00488b]" style={{width: `${cabor.score}%`}}></div>
                                        </div>
                                    </div>
                                )) : <p className="text-xs text-slate-400">No sport data available.</p>}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}

// --- HELPER COMPONENTS ---

function StatCard({ title, value, icon: Icon, colorClass, isText = false }) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-slate-500 text-xs font-bold  tracking-wide mb-1">{title}</p>
                    <h3 className={`font-bold text-slate-800 ${isText ? 'text-xl mt-1' : 'text-3xl'}`}>
                        {value}
                    </h3>
                </div>
                <div className={`p-3 rounded-xl ${colorClass}`}>
                    <Icon size={20} />
                </div>
            </div>
        </div>
    );
}

function MiniStatCard({ label, value, unit, icon: Icon }) {
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-blue-200 transition-colors">
            <div className="p-3 bg-slate-50 text-slate-600 rounded-lg">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-[10px] text-slate-400 font-bold  tracking-wider">{label}</p>
                <div className="flex items-baseline gap-1">
                    <p className="text-xl font-bold text-slate-800">{value}</p>
                    <span className="text-xs text-slate-400 font-medium">{unit}</span>
                </div>
            </div>
        </div>
    );
}