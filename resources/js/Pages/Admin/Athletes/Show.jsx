import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    User, Calendar, Activity, Trophy, ArrowLeft, TrendingUp, TrendingDown, 
    Target, Scale, Ruler, Weight, Clock, Zap, AlertCircle, Minus, FileText
} from 'lucide-react';
import { 
    ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    BarChart, Bar
} from 'recharts';

export default function Show({ athlete, stats, radar_data, comparison_data, item_analysis, history_data, strengths, weaknesses, has_data }) {

    const calculateBMI = (h, w) => {
        if (!h || !w) return '-';
        const heightInM = h / 100;
        return (w / (heightInM * heightInM)).toFixed(1);
    };

    const formatScore = (val) => {
        if (val === undefined || val === null) return 0;
        return Number(val) % 1 === 0 ? Number(val) : Number(val).toFixed(1);
    };

    const formatNumber = (val) => {
        if (val === undefined || val === null || val === '') return '-';
        return Number(val).toLocaleString('en-US', { maximumFractionDigits: 2 });
    };

    const GrowthIndicator = ({ value }) => {
        if (value === undefined || value === null) return <span className="text-slate-300">-</span>;
        if (value > 0) return <span className="flex items-center text-emerald-600 text-[10px] font-bold"><TrendingUp className="w-3 h-3 mr-1" /> +{value}%</span>;
        if (value < 0) return <span className="flex items-center text-red-500 text-[10px] font-bold"><TrendingDown className="w-3 h-3 mr-1" /> {value}%</span>;
        return <span className="flex items-center text-slate-400 text-[10px] font-bold"><Minus className="w-3 h-3 mr-1" /> 0%</span>;
    };

    const safeAthlete = athlete || {};
    const bmi = calculateBMI(safeAthlete.height, safeAthlete.weight);
    const initial = safeAthlete.name ? safeAthlete.name.charAt(0).toUpperCase() : '-';

    const current_score = stats?.latest_score || 0;
    const previous_score = stats?.previous_score || 0;

    return (
        <AdminLayout title={`Profile - ${safeAthlete.name}`}>
            <Head title={safeAthlete.name || 'Athlete Profile'} />

            {/* HEADER */}
            <div className="mb-8">
                <Link href={route('admin.athletes.index')} className="inline-flex items-center text-sm text-slate-500 hover:text-[#00488b] mb-3 group transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                    Back to Athletes List
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Athlete Analysis</h1>
                        <p className="text-slate-500 text-sm mt-1">Comprehensive performance report and physical metrics.</p>
                    </div>
                    {safeAthlete.name && (
                        <Link 
                            href={route('admin.performance.index', { search: safeAthlete.name })}
                            className="w-full md:w-auto bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                            <Activity className="w-4 h-4" /> View Training Logs
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                
                {/* 1. PROFILE CARD (LEFT COLUMN) */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center h-full relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-blue-50/80 to-transparent"></div>
                    
                    {/* FOTO PROFIL ATLET */}
                    <div className="relative z-10 w-28 h-28 mb-4">
                        {safeAthlete.profile_photo_url ? (
                            <img 
                                src={safeAthlete.profile_photo_url} 
                                alt={safeAthlete.name} 
                                className="w-full h-full rounded-full object-cover shadow-xl shadow-blue-900/10 border-4 border-white"
                            />
                        ) : (
                            <div className="w-full h-full bg-[#00488b] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-900/10 border-4 border-white">
                                {initial}
                            </div>
                        )}
                    </div>
                    
                    <h2 className="text-xl font-bold text-slate-800">{safeAthlete.name || 'Unknown Name'}</h2>
                    <p className="text-sm text-slate-500 font-mono mb-2">{safeAthlete.athlete_id || '-'}</p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#00488b] rounded-full text-xs font-bold border border-blue-100 mb-6">
                        <Trophy className="w-3 h-3" /> {safeAthlete.sport?.name || 'No Sport'}
                    </span>

                    <div className="grid grid-cols-2 gap-3 w-full border-t border-slate-100 pt-6">
                        <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Height</p>
                            <p className="font-bold text-slate-800">{safeAthlete.height || '-'} <span className="text-xs font-normal text-slate-500">cm</span></p>
                        </div>
                        <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Weight</p>
                            <p className="font-bold text-slate-800">{safeAthlete.weight || '-'} <span className="text-xs font-normal text-slate-500">kg</span></p>
                        </div>
                        <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Age</p>
                            <p className="font-bold text-slate-800">{safeAthlete.age || '-'} <span className="text-xs font-normal text-slate-500">yrs</span></p>
                        </div>
                        <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">BMI</p>
                            <p className="font-bold text-slate-800">{bmi}</p>
                        </div>
                    </div>
                </div>

                {/* 2. STATS & CHARTS (RIGHT COLUMN) */}
                <div className="xl:col-span-2 flex flex-col gap-6">
                    
                    {/* A. Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Total Sessions</p>
                            <p className="text-3xl font-black text-slate-800">{stats?.total_sessions || 0}</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Avg Score</p>
                            <p className="text-3xl font-black text-[#00488b]">{formatScore(stats?.average_score)}</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Best Score</p>
                            <p className="text-3xl font-black text-emerald-600">{formatScore(stats?.highest_score)}</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Last Activity</p>
                            <p className="text-sm font-bold text-slate-800 leading-tight mt-1">{stats?.latest_date || '-'}</p>
                        </div>
                    </div>

                    {/* B. Main Charts */}
                    {has_data ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                            {/* 1. Radar Chart */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                                <h3 className="text-sm font-bold text-slate-700 mb-6 flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-50 rounded-lg text-[#00488b]"><Target className="w-4 h-4" /></div>
                                    Skill Map (Average)
                                </h3>
                                <div className="flex-1 min-h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radar_data}>
                                            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: '600' }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar name="Target" dataKey="B" stroke="#fbbf24" strokeWidth={2} fill="#fbbf24" fillOpacity={0.1} />
                                            <Radar name="Athlete" dataKey="A" stroke="#00488b" strokeWidth={2} fill="#00488b" fillOpacity={0.5} />
                                            <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                            <RechartsTooltip contentStyle={{borderRadius:'12px', border:'none', boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* 2. Comparison Bar Chart */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                                <h3 className="text-sm font-bold text-slate-700 mb-6 flex items-center gap-2">
                                    <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600"><Activity className="w-4 h-4" /></div>
                                    Comparison: Latest vs Previous
                                </h3>
                                <div className="flex-1 min-h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={comparison_data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} barGap={4}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius:'12px', border:'none', boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)', fontSize:'12px'}} />
                                            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                            <Bar name="Previous" dataKey="previous" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} />
                                            <Bar name="Latest" dataKey="latest" fill="#00488b" radius={[4, 4, 0, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center h-64 text-slate-400 gap-2">
                            <Activity className="w-8 h-8 opacity-20" />
                            <p className="text-sm font-medium">No training data available.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* C. ITEM ANALYSIS (Full Width) */}
            {has_data && item_analysis && item_analysis.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8">
                    <h3 className="text-sm font-bold text-slate-700 mb-6 flex items-center gap-2">
                        <div className="p-1.5 bg-blue-50 rounded-lg text-blue-500"><TrendingUp className="w-4 h-4" /></div>
                        Detailed Item Progress (Current vs Previous)
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={item_analysis} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barGap={6}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} interval={0} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius:'12px', border:'none', boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)', fontSize:'12px'}} />
                                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                <Bar name="Previous" dataKey="previous_score" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={16} />
                                <Bar name="Current" dataKey="score" fill="#00488b" radius={[4, 4, 0, 0]} barSize={16} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* D. DETAILED TABLE (Responsive Scrolling) */}
            {has_data && item_analysis && (
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm mb-8">
                    <div className="px-6 py-5 bg-slate-50/80 border-b border-slate-100 backdrop-blur-sm">
                        <h3 className="font-bold text-slate-700">Latest Test Breakdown</h3>
                    </div>
                    
                    {/* WRAPPER FOR MOBILE SCROLLING */}
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-sm text-left min-w-[800px]">
                            <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-100 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Test Item</th>
                                    <th className="px-6 py-4 text-center font-bold">Raw Result</th>
                                    <th className="px-6 py-4 text-center font-bold">Benchmark</th>
                                    <th className="px-6 py-4 text-center font-bold">Prev (%)</th>
                                    <th className="px-6 py-4 text-center font-bold">Curr (%)</th>
                                    <th className="px-6 py-4 text-center font-bold">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {item_analysis.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-700 group-hover:text-[#00488b] transition-colors">{item.name}</div>
                                            <div className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">{item.category}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-slate-800 bg-slate-50/30">
                                            {formatNumber(item.result_value)} <span className="text-[10px] font-normal text-slate-400">{item.unit}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-xs font-bold text-slate-500 border border-slate-200">
                                                <Target className="w-3 h-3 text-slate-400" />
                                                {formatNumber(item.target_value)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-slate-400 font-medium">
                                            {item.previous_score > 0 ? formatScore(item.previous_score) + '%' : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-block font-bold text-[#00488b] bg-blue-50 px-2 py-1 rounded border border-blue-100 min-w-[60px]">
                                                {formatScore(item.score)}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center flex justify-center">
                                            <div className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                                                <GrowthIndicator value={item.growth} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                
                                {/* FOOTER: AVERAGE SUMMARY */}
                                <tr className="bg-blue-50/50 border-t-2 border-slate-200">
                                    <td colSpan="3" className="px-6 py-5 text-right font-bold text-slate-500 text-xs uppercase tracking-wider align-middle">
                                        Total Average Score:
                                    </td>
                                    <td colSpan="3" className="px-8 py-5">
                                        <div className="flex items-center justify-end gap-6">
                                            {/* Previous Score */}
                                            {previous_score > 0 && (
                                                <div className="text-right opacity-60">
                                                    <span className="block text-[10px] text-slate-500 font-bold uppercase">Prev</span>
                                                    <span className="text-lg font-bold text-slate-500 line-through decoration-red-300">{formatScore(previous_score)}%</span>
                                                </div>
                                            )}
                                            
                                            {/* Current Score */}
                                            <div className="text-right">
                                                <span className="block text-[10px] text-[#00488b] font-bold uppercase">Current</span>
                                                <span className="text-3xl font-black text-[#00488b]">{formatScore(current_score)}%</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* E. SWOT ANALYSIS */}
            {has_data && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm mb-8 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        {/* Strengths */}
                        <div className="p-6 md:p-8">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600"><Zap className="w-5 h-5" /></div>
                                Top Strengths ({'>'}70%)
                            </h3>
                            <div className="space-y-4">
                                {strengths && strengths.length > 0 ? strengths.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between group p-3 rounded-xl hover:bg-emerald-50/50 transition-colors border border-transparent hover:border-emerald-100">
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl font-black text-slate-100 group-hover:text-emerald-200 transition-colors">0{idx + 1}</span>
                                            <div>
                                                <p className="font-bold text-slate-700">{item.name}</p>
                                                <p className="text-xs text-slate-400 font-medium">Physical Category</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-xl font-bold text-emerald-600">{formatScore(item.score)}</span>
                                        </div>
                                    </div>
                                )) : <p className="text-slate-400 italic text-sm text-center py-4">No categories above 70% yet.</p>}
                            </div>
                        </div>

                        {/* Weaknesses */}
                        <div className="p-6 md:p-8">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <div className="p-1.5 bg-red-100 rounded-lg text-red-600"><AlertCircle className="w-5 h-5" /></div>
                                Areas for Improvement
                            </h3>
                            <div className="space-y-4">
                                {weaknesses && weaknesses.length > 0 ? weaknesses.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between group p-3 rounded-xl hover:bg-red-50/50 transition-colors border border-transparent hover:border-red-100">
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl font-black text-slate-100 group-hover:text-red-200 transition-colors">0{idx + 1}</span>
                                            <div>
                                                <p className="font-bold text-slate-700">{item.name}</p>
                                                <p className="text-xs text-slate-400 font-medium">Physical Category</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-xl font-bold text-red-500">{formatScore(item.score)}</span>
                                        </div>
                                    </div>
                                )) : <p className="text-slate-400 italic text-sm text-center py-4">Great! All categories are above 70%.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* F. HISTORY TABLE (Responsive) */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" /> Session History
                    </h3>
                    {safeAthlete.name && (
                        <Link href={route('admin.performance.index', { search: safeAthlete.name })} className="text-xs font-bold text-[#00488b] hover:underline bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:bg-blue-50 transition-colors">
                            View All Logs &rarr;
                        </Link>
                    )}
                </div>
                
                {/* Scroll Wrapper */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[600px]">
                        <thead className="text-xs text-slate-500 bg-slate-50/50 border-b border-slate-100 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3 font-bold">Date</th>
                                <th className="px-6 py-3 text-center font-bold">Session Score</th>
                                <th className="px-6 py-3 text-center font-bold">Rating</th>
                                <th className="px-6 py-3 text-right font-bold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {history_data && history_data.length > 0 ? (
                                history_data.slice().reverse().slice(0, 5).map((session) => (
                                    <tr key={session.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-700 flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            {session.full_date}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-bold text-[#00488b] text-lg">{formatScore(session.score)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                                                session.score >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                session.score >= 60 ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                                'bg-red-50 text-red-600 border-red-100'
                                            }`}>
                                                {session.score >= 80 ? 'Excellent' : session.score >= 60 ? 'Good' : 'Poor'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={route('admin.performance.show', session.id)} className="text-xs font-bold text-slate-500 hover:text-[#00488b] transition-colors">
                                                Details &rarr;
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic">
                                        No training history found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </AdminLayout>
    );
}