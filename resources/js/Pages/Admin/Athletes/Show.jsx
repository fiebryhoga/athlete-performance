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
        if (value > 0) return <span className="flex items-center text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-1 rounded-md"><TrendingUp className="w-3 h-3 mr-1" /> +{value}%</span>;
        if (value < 0) return <span className="flex items-center text-red-500 text-[10px] font-bold bg-red-50 px-2 py-1 rounded-md"><TrendingDown className="w-3 h-3 mr-1" /> {value}%</span>;
        return <span className="flex items-center text-slate-500 text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-md"><Minus className="w-3 h-3 mr-1" /> 0%</span>;
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
                <div className="mb-8">
                    <Link href={route('admin.athletes.index')} className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-4 group transition-colors">
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
                                className="w-full md:w-auto bg-white border border-slate-200 text-slate-700 px-5 py-2 rounded-lg font-medium text-sm hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                <Activity className="w-4 h-4" /> View Training Logs
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                    
                    {/* 1. PROFILE CARD (LEFT COLUMN) */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center h-full">
                        {/* FOTO PROFIL ATLET */}
                        <div className="relative z-10 w-24 h-24 mb-5">
                            {safeAthlete.profile_photo_url ? (
                                <img 
                                    src={safeAthlete.profile_photo_url} 
                                    alt={safeAthlete.name} 
                                    className="w-full h-full rounded-full object-cover shadow-sm border-2 border-slate-100"
                                />
                            ) : (
                                <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold shadow-sm border-2 border-slate-100">
                                    {initial}
                                </div>
                            )}
                        </div>
                        
                        <h2 className="text-xl font-bold text-slate-800">{safeAthlete.name || 'Unknown Name'}</h2>
                        <p className="text-sm text-slate-500 font-mono mb-3">{safeAthlete.athlete_id || '-'}</p>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200 mb-6">
                            <Trophy className="w-3.5 h-3.5" /> {safeAthlete.sport?.name || 'No Sport'}
                        </span>

                        <div className="grid grid-cols-2 gap-3 w-full border-t border-slate-100 pt-6">
                            <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-400 font-medium mb-1">Height</p>
                                <p className="font-semibold text-slate-800">{safeAthlete.height || '-'} <span className="text-xs font-normal text-slate-500">cm</span></p>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-400 font-medium mb-1">Weight</p>
                                <p className="font-semibold text-slate-800">{safeAthlete.weight || '-'} <span className="text-xs font-normal text-slate-500">kg</span></p>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-400 font-medium mb-1">Age</p>
                                <p className="font-semibold text-slate-800">{safeAthlete.age || '-'} <span className="text-xs font-normal text-slate-500">yrs</span></p>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-400 font-medium mb-1">BMI</p>
                                <p className="font-semibold text-slate-800">{bmi}</p>
                            </div>
                        </div>
                    </div>

                    {/* 2. STATS & CHARTS (RIGHT COLUMN) */}
                    <div className="xl:col-span-2 flex flex-col gap-6">
                        
                        {/* A. Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                                <p className="text-xs text-slate-500 font-medium mb-2">Total Sessions</p>
                                <p className="text-2xl font-bold text-slate-800">{stats?.total_sessions || 0}</p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                                <p className="text-xs text-slate-500 font-medium mb-2">Avg Score</p>
                                <p className="text-2xl font-bold text-blue-600">{formatScore(stats?.average_score)}</p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                                <p className="text-xs text-slate-500 font-medium mb-2">Best Score</p>
                                <p className="text-2xl font-bold text-emerald-600">{formatScore(stats?.highest_score)}</p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                                <p className="text-xs text-slate-500 font-medium mb-2">Last Activity</p>
                                <p className="text-sm font-semibold text-slate-800 mt-1 truncate">{stats?.latest_date || '-'}</p>
                            </div>
                        </div>

                        {/* B. Main Charts */}
                        {has_data ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                                {/* 1. Radar Chart */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                                    <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                        <Target className="w-4 h-4 text-blue-500" />
                                        Skill Map (Average)
                                    </h3>
                                    <div className="flex-1 min-h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radar_data}>
                                                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                <Radar name="Target" dataKey="B" stroke="#94a3b8" strokeWidth={1} fill="#f8fafc" fillOpacity={0.5} strokeDasharray="3 3" />
                                                <Radar name="Athlete" dataKey="A" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.3} />
                                                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                                <RechartsTooltip contentStyle={{borderRadius:'8px', border:'1px solid #e2e8f0', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* 2. Comparison Bar Chart */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                                    <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-purple-500" />
                                        Comparison: Latest vs Previous
                                    </h3>
                                    <div className="flex-1 min-h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={comparison_data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barGap={2}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius:'8px', border:'1px solid #e2e8f0', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)', fontSize:'12px'}} />
                                                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                                <Bar name="Previous" dataKey="previous" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={16} />
                                                <Bar name="Latest" dataKey="latest" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={16} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
                                <Activity className="w-8 h-8 opacity-50" />
                                <p className="text-sm font-medium">No training data available.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* C. ITEM ANALYSIS (Full Width) */}
                {has_data && item_analysis && item_analysis.length > 0 && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
                        <h3 className="text-sm font-semibold text-slate-800 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            Detailed Item Progress (Current vs Previous)
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={item_analysis} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barGap={4}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} interval={0} />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius:'8px', border:'1px solid #e2e8f0', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)', fontSize:'12px'}} />
                                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                    <Bar name="Previous" dataKey="previous_score" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={12} />
                                    <Bar name="Current" dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* D. DETAILED TABLE (Responsive Scrolling) */}
                {has_data && item_analysis && (
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-8">
                        <div className="px-6 py-5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-semibold text-slate-800">Latest Test Breakdown</h3>
                        </div>
                        
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-sm text-left min-w-[800px]">
                                <thead className="text-xs text-slate-500 bg-slate-50/80 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Test Item</th>
                                        <th className="px-6 py-4 text-center font-medium">Raw Result</th>
                                        <th className="px-6 py-4 text-center font-medium">Benchmark</th>
                                        <th className="px-6 py-4 text-center font-medium">Prev (%)</th>
                                        <th className="px-6 py-4 text-center font-medium">Curr (%)</th>
                                        <th className="px-6 py-4 text-center font-medium">Trend</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {item_analysis.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-800">{item.name}</div>
                                                <div className="text-xs text-slate-500 mt-0.5">{item.category}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-slate-700 font-medium">
                                                {formatNumber(item.result_value)} <span className="text-xs text-slate-400 font-normal">{item.unit}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-slate-600 bg-slate-100">
                                                    <Target className="w-3 h-3 text-slate-400" />
                                                    {formatNumber(item.target_value)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-slate-500">
                                                {item.previous_score > 0 ? formatScore(item.previous_score) + '%' : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-block font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md min-w-[60px]">
                                                    {formatScore(item.score)}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center flex justify-center">
                                                <GrowthIndicator value={item.growth} />
                                            </td>
                                        </tr>
                                    ))}
                                    
                                    {/* FOOTER: AVERAGE SUMMARY */}
                                    <tr className="bg-slate-50 border-t border-slate-200">
                                        <td colSpan="3" className="px-6 py-5 text-right font-medium text-slate-600 text-sm align-middle">
                                            Total Average Score:
                                        </td>
                                        <td colSpan="3" className="px-8 py-5">
                                            <div className="flex items-center justify-end gap-6">
                                                {previous_score > 0 && (
                                                    <div className="text-right opacity-70">
                                                        <span className="block text-xs text-slate-500 mb-1">Previous</span>
                                                        <span className="text-lg font-medium text-slate-500 line-through">{formatScore(previous_score)}%</span>
                                                    </div>
                                                )}
                                                <div className="text-right">
                                                    <span className="block text-xs text-blue-600 font-medium mb-1">Current</span>
                                                    <span className="text-2xl font-bold text-blue-600">{formatScore(current_score)}%</span>
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
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-8 overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                            {/* Strengths */}
                            <div className="p-6 md:p-8">
                                <h3 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-emerald-500" />
                                    Top Strengths ({'>'}70%)
                                </h3>
                                <div className="space-y-3">
                                    {strengths && strengths.length > 0 ? strengths.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-bold text-slate-300 w-6">0{idx + 1}</span>
                                                <div>
                                                    <p className="font-medium text-slate-700">{item.name}</p>
                                                    <p className="text-xs text-slate-400">Physical Category</p>
                                                </div>
                                            </div>
                                            <span className="block text-lg font-bold text-emerald-600">{formatScore(item.score)}</span>
                                        </div>
                                    )) : <p className="text-slate-400 italic text-sm text-center py-4">No categories above 70% yet.</p>}
                                </div>
                            </div>

                            {/* Weaknesses */}
                            <div className="p-6 md:p-8">
                                <h3 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                    Areas for Improvement
                                </h3>
                                <div className="space-y-3">
                                    {weaknesses && weaknesses.length > 0 ? weaknesses.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-red-200 hover:bg-red-50/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-bold text-slate-300 w-6">0{idx + 1}</span>
                                                <div>
                                                    <p className="font-medium text-slate-700">{item.name}</p>
                                                    <p className="text-xs text-slate-400">Physical Category</p>
                                                </div>
                                            </div>
                                            <span className="block text-lg font-bold text-red-500">{formatScore(item.score)}</span>
                                        </div>
                                    )) : <p className="text-slate-400 italic text-sm text-center py-4">Great! All categories are above 70%.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* F. HISTORY TABLE (Responsive) */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-6 py-5 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-400" /> 5 Session History Terakhir
                        </h3>
                        {safeAthlete.name && (
                            <Link href={route('admin.performance.index', { search: safeAthlete.name })} className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-white px-4 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">
                                View All Logs &rarr;
                            </Link>
                        )}
                    </div>
                    
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-sm text-left min-w-[600px]">
                            <thead className="text-xs text-slate-500 bg-slate-50/80 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 text-center font-medium">Session Score</th>
                                    <th className="px-6 py-4 text-center font-medium">Rating</th>
                                    <th className="px-6 py-4 text-center font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {history_data && history_data.length > 0 ? (
                                    history_data.slice().reverse().slice(0, 5).map((session) => (
                                        <tr key={session.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 text-slate-700 flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                {session.full_date}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="font-semibold text-slate-800">{formatScore(session.score)}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium border ${
                                                    session.score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                                    session.score >= 60 ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                                    'bg-red-50 text-red-700 border-red-200'
                                                }`}>
                                                    {session.score >= 80 ? 'Excellent' : session.score >= 60 ? 'Good' : 'Poor'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    <Link 
                                                        href={route('admin.performance.show', session.id)} 
                                                        className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all focus:outline-none"
                                                    >
                                                        Details
                                                    </Link>
                                                </div>
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
            </div>
        </AdminLayout>
    );
}