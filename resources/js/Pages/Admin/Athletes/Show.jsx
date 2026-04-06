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

export default function Show({ athlete, stats, radar_data, comparison_data, item_analysis, history_data, strengths, weaknesses, has_data, historical_labels }) {

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

    // Palet warna untuk riwayat tes gradasi abu-abu
    const historicalColors = ['#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8'];

    return (
        <AdminLayout title={`Profile - ${safeAthlete.name}`}>
            <Head title={safeAthlete.name || 'Athlete Profile'} />

            <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
                {/* --- HEADER --- */}
                <div className="mb-6 md:mb-8">
                    <Link href={route('admin.athletes.index')} className="inline-flex items-center text-[10px] md:text-xs font-bold text-slate-400 hover:text-[#ff4d00] mb-4 group transition-colors uppercase tracking-widest">
                        <ArrowLeft className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-x-1" />
                        Back to Athletes
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Athlete Analysis</h1>
                            <p className="text-slate-500 font-medium text-xs md:text-sm mt-1">Comprehensive performance report and physical metrics.</p>
                        </div>
                        {safeAthlete.name && (
                            <Link 
                                href={route('admin.performance.index', { search: safeAthlete.name })}
                                className="w-full md:w-auto bg-white border border-slate-200 text-[#ff4d00] px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-orange-50 hover:border-orange-200 transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                <Activity className="w-4 h-4" /> View Training Logs
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 md:gap-6 mb-6 md:mb-8">
                    
                    {/* 1. PROFILE CARD (LEFT COLUMN) */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 md:p-6 flex flex-col items-center text-center h-full hover:shadow-md transition-shadow">
                        <div className="relative z-10 w-24 h-24 mb-5">
                            {safeAthlete.profile_photo_url ? (
                                <img 
                                    src={safeAthlete.profile_photo_url} 
                                    alt={safeAthlete.name} 
                                    className="w-full h-full rounded-lg object-cover shadow-sm border-2 border-slate-100"
                                />
                            ) : (
                                <div className="w-full h-full bg-orange-50 rounded-lg flex items-center justify-center text-[#ff4d00] text-3xl font-black shadow-sm border-2 border-orange-100">
                                    {initial}
                                </div>
                            )}
                        </div>
                        
                        <h2 className="text-xl font-bold text-slate-800">{safeAthlete.name || 'Unknown Name'}</h2>
                        <p className="text-xs text-slate-500 font-mono mb-3 mt-0.5">{safeAthlete.athlete_id || '-'}</p>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-[#ff4d00] rounded-md text-[10px] font-bold uppercase tracking-widest border border-orange-100 mb-6">
                            <Trophy className="w-3.5 h-3.5" /> {safeAthlete.sport?.name || 'No Sport'}
                        </span>

                        <div className="grid grid-cols-2 gap-3 w-full border-t border-slate-100 pt-6">
                            <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-100/50">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Height</p>
                                <p className="font-bold text-slate-800">{safeAthlete.height || '-'} <span className="text-[10px] font-medium text-slate-400">cm</span></p>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-100/50">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Weight</p>
                                <p className="font-bold text-slate-800">{safeAthlete.weight || '-'} <span className="text-[10px] font-medium text-slate-400">kg</span></p>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-100/50">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Age</p>
                                <p className="font-bold text-slate-800">{safeAthlete.age || '-'} <span className="text-[10px] font-medium text-slate-400">yrs</span></p>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-100/50">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">BMI</p>
                                <p className="font-bold text-[#ff4d00]">{bmi}</p>
                            </div>
                        </div>
                    </div>

                    {/* 2. STATS & CHARTS (RIGHT COLUMN) */}
                    <div className="xl:col-span-2 flex flex-col gap-5 md:gap-6">
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            <div className="bg-white p-4 md:p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:border-orange-200 transition-colors">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Total Sessions</p>
                                <p className="text-xl md:text-2xl font-black text-slate-800">{stats?.total_sessions || 0}</p>
                            </div>
                            <div className="bg-white p-4 md:p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:border-orange-200 transition-colors">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Avg Score</p>
                                <p className="text-xl md:text-2xl font-black text-[#ff4d00]">{formatScore(stats?.average_score)}</p>
                            </div>
                            <div className="bg-white p-4 md:p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition-colors">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Best Score</p>
                                <p className="text-xl md:text-2xl font-black text-emerald-600">{formatScore(stats?.highest_score)}</p>
                            </div>
                            <div className="bg-white p-4 md:p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:border-orange-200 transition-colors">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Last Activity</p>
                                <p className="text-xs md:text-sm font-bold text-slate-800 mt-1 truncate">{stats?.latest_date || '-'}</p>
                            </div>
                        </div>

                        {has_data ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 h-full">
                                <div className="bg-white p-5 md:p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                                    <h3 className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-widest">
                                        <Target className="w-4 h-4 text-orange-500" />
                                        Skill Map (Average)
                                    </h3>
                                    <div className="flex-1 min-h-[250px] md:min-h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radar_data}>
                                                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                <Radar name="Target" dataKey="B" stroke="#cbd5e1" strokeWidth={1} fill="#f8fafc" fillOpacity={0.5} strokeDasharray="3 3" />
                                                <Radar name="Athlete" dataKey="A" stroke="#ff4d00" strokeWidth={2} fill="#ff4d00" fillOpacity={0.3} />
                                                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                                <RechartsTooltip contentStyle={{borderRadius:'8px', border:'none', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="bg-white p-5 md:p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                                    <h3 className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-widest">
                                        <Activity className="w-4 h-4 text-orange-500" />
                                        Latest vs Previous
                                    </h3>
                                    <div className="flex-1 min-h-[250px] md:min-h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={comparison_data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barGap={2}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                                                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius:'8px', border:'none', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)', fontSize:'12px'}} />
                                                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
                                                <Bar name="Previous Avg" dataKey="previous" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={14} />
                                                <Bar name="Latest" dataKey="latest" fill="#ff4d00" radius={[4, 4, 0, 0]} barSize={14} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
                                <Activity className="w-8 h-8 opacity-40" />
                                <p className="text-xs font-bold uppercase tracking-widest">No training data available.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* C. ITEM ANALYSIS (MULTI-COMPARISON) */}
                {has_data && item_analysis && item_analysis.length > 0 && (
                    <div className="bg-white p-5 md:p-6 rounded-lg border border-slate-200 shadow-sm mb-6 md:mb-8">
                        <h3 className="text-xs font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-widest">
                            <TrendingUp className="w-4 h-4 text-[#ff4d00]" />
                            Detailed Progress (Last {historical_labels ? historical_labels.length + 1 : 1} Tests)
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={item_analysis} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barGap={2}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} interval={0} />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius:'8px', border:'none', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)', fontSize:'12px'}} />
                                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
                                    
                                    {/* LOOP BAR UNTUK TES SEBELUMNYA */}
                                    {historical_labels && historical_labels.map((label, index) => {
                                        const colorIndex = 4 - historical_labels.length + index; 
                                        const color = historicalColors[colorIndex] || '#cbd5e1';
                                        
                                        return (
                                            <Bar 
                                                key={label.key} 
                                                name={label.name} 
                                                dataKey={label.key} 
                                                fill={color} 
                                                radius={[4, 4, 0, 0]} 
                                                barSize={10} 
                                            />
                                        );
                                    })}

                                    {/* BAR UNTUK TES SAAT INI */}
                                    <Bar name="Current Test" dataKey="score" fill="#ff4d00" radius={[4, 4, 0, 0]} barSize={10} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* D. SWOT ANALYSIS */}
                {has_data && (
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm mb-6 md:mb-8 overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                            <div className="p-5 md:p-8">
                                <h3 className="text-xs font-bold text-slate-800 mb-5 flex items-center gap-2 uppercase tracking-widest">
                                    <Zap className="w-4 h-4 text-emerald-500" />
                                    Top Strengths ({'>'}70%)
                                </h3>
                                <div className="space-y-3">
                                    {strengths && strengths.length > 0 ? strengths.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-black text-slate-200 w-6">0{idx + 1}</span>
                                                <div>
                                                    <p className="font-bold text-sm text-slate-700">{item.name}</p>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Physical Category</p>
                                                </div>
                                            </div>
                                            <span className="block text-lg font-black text-emerald-600">{formatScore(item.score)}</span>
                                        </div>
                                    )) : <p className="text-slate-400 font-medium text-xs text-center py-4">No categories above 70% yet.</p>}
                                </div>
                            </div>

                            <div className="p-5 md:p-8">
                                <h3 className="text-xs font-bold text-slate-800 mb-5 flex items-center gap-2 uppercase tracking-widest">
                                    <AlertCircle className="w-4 h-4 text-rose-500" />
                                    Areas for Improvement
                                </h3>
                                <div className="space-y-3">
                                    {weaknesses && weaknesses.length > 0 ? weaknesses.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-rose-200 hover:bg-rose-50/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-black text-slate-200 w-6">0{idx + 1}</span>
                                                <div>
                                                    <p className="font-bold text-sm text-slate-700">{item.name}</p>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Physical Category</p>
                                                </div>
                                            </div>
                                            <span className="block text-lg font-black text-rose-500">{formatScore(item.score)}</span>
                                        </div>
                                    )) : <p className="text-slate-400 font-medium text-xs text-center py-4">Great! All categories are above 70%.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* E. HISTORY TABLE (Responsif) */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest">
                            <FileText className="w-3.5 h-3.5 text-slate-400" /> 5 Session History Terakhir
                        </h3>
                        {safeAthlete.name && (
                            <Link href={route('admin.performance.index', { search: safeAthlete.name })} className="text-[10px] md:text-xs font-bold text-[#ff4d00] hover:underline bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm hover:bg-orange-50 transition-colors uppercase tracking-widest">
                                View All Logs &rarr;
                            </Link>
                        )}
                    </div>
                    
                    <div className="overflow-x-auto w-full custom-scrollbar">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[10px] text-slate-400 bg-slate-50/80 border-b border-slate-100 uppercase tracking-widest">
                                <tr>
                                    <th className="px-4 md:px-6 py-3 font-bold">Date</th>
                                    <th className="px-4 md:px-6 py-3 text-center font-bold">Score</th>
                                    {/* Sembunyikan kolom Rating di layar HP (muncul di tablet ke atas) */}
                                    <th className="px-4 md:px-6 py-3 text-center font-bold hidden sm:table-cell">Rating</th>
                                    <th className="px-4 md:px-6 py-3 text-center font-bold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {history_data && history_data.length > 0 ? (
                                    history_data.slice().reverse().slice(0, 5).map((session) => (
                                        <tr key={session.id} className="hover:bg-orange-50/30 transition-colors">
                                            <td className="px-4 md:px-6 py-3.5 md:py-4 font-bold text-slate-700 flex items-center gap-2 text-xs md:text-sm whitespace-nowrap">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                {session.full_date}
                                            </td>
                                            <td className="px-4 md:px-6 py-3.5 md:py-4 text-center">
                                                <span className="font-black text-[#ff4d00] text-base md:text-lg">{formatScore(session.score)}</span>
                                            </td>
                                            {/* Sembunyikan kolom Rating di layar HP */}
                                            <td className="px-4 md:px-6 py-3.5 md:py-4 text-center hidden sm:table-cell">
                                                <span className={`inline-flex px-2 py-1 rounded text-[9px] md:text-[10px] font-bold uppercase tracking-wider border ${
                                                    session.score >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                    session.score >= 60 ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                                    'bg-rose-50 text-rose-600 border-rose-100'
                                                }`}>
                                                    {session.score >= 80 ? 'Excellent' : session.score >= 60 ? 'Good' : 'Poor'}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-6 py-3.5 md:py-4 text-center">
                                                <div className="flex justify-center">
                                                    <Link 
                                                        href={route('admin.performance.show', session.id)} 
                                                        className="inline-flex items-center justify-center px-3 py-1.5 text-[10px] md:text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-md hover:bg-orange-50 hover:text-[#ff4d00] hover:border-orange-200 transition-all uppercase tracking-widest whitespace-nowrap"
                                                    >
                                                        Details
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-4 md:px-6 py-12 text-center text-slate-400 font-medium text-xs md:text-sm">
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