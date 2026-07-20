import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import CompositionAnatomy from '@/Pages/Admin/CompositionTests/Partials/CompositionAnatomy';
import { 
    User, Calendar, Activity, Trophy, TrendingUp, TrendingDown, 
    Target, Scale, Ruler, Weight, Clock, Zap, AlertCircle, ArrowRight, HeartPulse, Battery, History, FileText
} from 'lucide-react';
import { 
    ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ComposedChart, Bar, Line
} from 'recharts';

export default function AthleteProfiling({ user, stats, radarData, history, trendData, daily_metrics, training_loads, latest_phv, latest_composition, latest_wellness, latest_dpa }) {

    
    const calculateBMI = (h, w) => {
        if (!h || !w) return '-';
        const heightInM = h / 100;
        const bmiVal = w / (heightInM * heightInM);
        return parseFloat(bmiVal.toFixed(1)); 
    };

    const bmi = calculateBMI(user.height, user.weight);
    const initial = user.name ? user.name.charAt(0).toUpperCase() : '-';

    const sortedSkills = [...radarData].sort((a, b) => b.A - a.A);
    const strengths = sortedSkills.slice(0, 3).filter(s => s.A > 0); 
    const weaknesses = [...radarData].sort((a, b) => a.A - b.A).slice(0, 3).filter(s => s.A < s.B);

    const getBMIStatus = (val) => {
        if (val === '-') return { label: '-', color: 'text-slate-500' };
        if (val < 18.5) return { label: 'Underweight', color: 'text-amber-500' };
        if (val >= 18.5 && val <= 24.9) return { label: 'Normal', color: 'text-emerald-600' };
        if (val >= 25 && val <= 29.9) return { label: 'Overweight', color: 'text-orange-500' };
        return { label: 'Obese', color: 'text-red-600' };
    };
    const bmiStatus = getBMIStatus(bmi);

    const customTooltipStyle = {
        borderRadius: '12px', border: 'none',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px'
    };

    return (
        <AppLayout title="Profil Fisik">
            <Head title="Profil Fisik" />

            <div className="w-full max-w-[1400px] mx-auto  pb-12 overflow-x-hidden sm:overflow-visible">
                
                
                <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative">
                    <div className="relative z-10 w-full md:w-auto">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Profil Fisik</h1>
                        <p className="text-slate-500 text-xs md:text-sm mt-1">Data performa dan komposisi tubuh Anda</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    
                    
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center h-full relative overflow-hidden">
                        <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-orange-500/10 to-transparent"></div>
                        
                        <div className="relative z-10 w-20 h-20 md:w-24 md:h-24 bg-[#ff4d00] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-xl shadow-[#ff4d00]/20 border-4 border-white overflow-hidden shrink-0">
                            {user.profile_photo_url ? (
                                <img src={user.profile_photo_url} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                initial
                            )}
                        </div>
                        
                        <h2 className="text-lg md:text-xl font-bold text-slate-800">{user.name}</h2>
                        <p className="text-xs md:text-sm text-slate-500 font-medium mb-3">{user.username || '-'}</p>
                        
                        <div className="flex gap-2 mb-6">
                            <span className="px-3 py-1 bg-orange-50 text-[#ff4d00] rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1 border border-orange-100">
                                <Trophy className="w-3 h-3" /> {stats.sport}
                            </span>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] md:text-xs font-bold border border-slate-200">
                                Athlete
                            </span>
                        </div>

                        
                        <div className="grid grid-cols-2 gap-3 w-full border-t border-slate-100 pt-6">
                            <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex justify-center mb-1.5"><Ruler className="w-4 h-4 text-slate-400" /></div>
                                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold">Tinggi</p>
                                <p className="font-bold text-slate-800 text-base md:text-lg">{user.height || '-'} <span className="text-[10px] md:text-xs font-normal text-slate-500">cm</span></p>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex justify-center mb-1.5"><Weight className="w-4 h-4 text-slate-400" /></div>
                                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold">Berat</p>
                                <p className="font-bold text-slate-800 text-base md:text-lg">{user.weight || '-'} <span className="text-[10px] md:text-xs font-normal text-slate-500">kg</span></p>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex justify-center mb-1.5"><Clock className="w-4 h-4 text-slate-400" /></div>
                                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold">Umur</p>
                                <p className="font-bold text-slate-800 text-base md:text-lg">{user.age || '-'} <span className="text-[10px] md:text-xs font-normal text-slate-500">thn</span></p>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex justify-center mb-1.5"><Scale className="w-4 h-4 text-slate-400" /></div>
                                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold">BMI</p>
                                <p className="font-bold text-slate-800 text-base md:text-lg leading-none mb-1">{bmi}</p>
                                <p className={`text-[9px] font-bold ${bmiStatus.color}`}>{bmiStatus.label}</p>
                            </div>
                        </div>
                    </div>

                    
                    <div className="lg:col-span-2 flex flex-col gap-6 min-w-0 w-full">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                            <StatCard label="Total Sesi" value={stats.sessions} icon={Activity} color="text-slate-800" />
                            <StatCard label="Rata-rata Skor" value={stats.avg_score} icon={Target} color="text-[#ff4d00]" />
                            <StatCard label="Skor Tertinggi" value={stats.max_score} icon={TrendingUp} color="text-emerald-600" />
                            <StatCard label="Terbaik" value={stats.best_category} icon={Zap} color="text-amber-500" isText />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-w-0">
                            
                            <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col min-w-0 w-full">
                                <h3 className="text-xs md:text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-4 bg-[#ff4d00] rounded-full"></span> Peta Kemampuan vs Target
                                </h3>
                                <div className="flex-1 w-full min-h-[250px] relative">
                                    {/* <ResponsiveContainer width="100%" minHeight={250}>
                                        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                                            <PolarGrid stroke="#e2e8f0" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar name="Target Cabor" dataKey="B" stroke="#fbbf24" strokeWidth={2} fill="#fbbf24" fillOpacity={0.15} />
                                            <Radar name="Performa Saya" dataKey="A" stroke="#ff4d00" strokeWidth={2} fill="#ff4d00" fillOpacity={0.5} />
                                            <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                                            <RechartsTooltip contentStyle={{borderRadius:'8px', fontSize: '12px'}} />
                                        </RadarChart>
                                    </ResponsiveContainer> */}
                                </div>
                            </div>

                            
                            <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col min-w-0 w-full">
                                <h3 className="text-xs md:text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span> Tren Progress (6 Sesi Terakhir)
                                </h3>
                                <div className="flex-1 w-full min-h-[250px] relative">
                                    {/* <ResponsiveContainer width="100%" minHeight={250}>
                                        <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                            <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                        </AreaChart>
                                    </ResponsiveContainer> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-8 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        <div className="p-5 md:p-8">
                            <h3 className="text-base md:text-lg font-bold text-slate-800 mb-5 md:mb-6 flex items-center gap-2">
                                <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600"><Zap className="w-4 h-4 md:w-5 md:h-5" /></div> Keunggulan Utama
                            </h3>
                            <div className="space-y-4">
                                {strengths.length > 0 ? strengths.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <span className="text-2xl md:text-3xl font-bold text-slate-100 group-hover:text-emerald-100 transition-colors">0{idx + 1}</span>
                                            <div>
                                                <p className="font-bold text-sm md:text-base text-slate-700">{item.subject}</p>
                                                <p className="text-[10px] md:text-xs text-slate-400">Score &gt; Target</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-lg md:text-xl font-bold text-emerald-600">{Number(item.A).toFixed(1)}</span>
                                        </div>
                                    </div>
                                )) : <p className="text-slate-400 italic text-xs md:text-sm py-4">Data belum cukup untuk analisis keunggulan.</p>}
                            </div>
                        </div>

                        <div className="p-5 md:p-8">
                            <h3 className="text-base md:text-lg font-bold text-slate-800 mb-5 md:mb-6 flex items-center gap-2">
                                <div className="p-1.5 bg-rose-100 rounded-lg text-rose-600"><AlertCircle className="w-4 h-4 md:w-5 md:h-5" /></div> Area Peningkatan
                            </h3>
                            <div className="space-y-4">
                                {weaknesses.length > 0 ? weaknesses.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <span className="text-2xl md:text-3xl font-bold text-slate-100 group-hover:text-rose-100 transition-colors">0{idx + 1}</span>
                                            <div>
                                                <p className="font-bold text-sm md:text-base text-slate-700">{item.subject}</p>
                                                <p className="text-[10px] md:text-xs text-slate-400">Target: <span className="font-bold">{item.B}</span></p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-lg md:text-xl font-bold text-rose-500">{Number(item.A).toFixed(1)}</span>
                                        </div>
                                    </div>
                                )) : <p className="text-slate-400 italic text-xs md:text-sm py-4">Tidak ada kelemahan signifikan.</p>}
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    
                    
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col min-w-0 w-full">
                        <h3 className="text-xs md:text-sm font-bold text-slate-700 mb-6 flex items-center gap-2">
                            <div className="p-1.5 bg-amber-50 rounded-lg text-amber-500"><Battery className="w-4 h-4" /></div>
                            Tren Beban Latihan (30 Hari)
                        </h3>
                        <div className="flex-1 w-full min-h-[300px] relative">
                            {training_loads && training_loads.length > 0 ? (
                                /* <ResponsiveContainer width="100%" minHeight={300}>
                                    <ComposedChart data={training_loads} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                        <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#f59e0b' }} axisLine={false} tickLine={false} />
                                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} domain={[0, 40]}/>
                                        <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={customTooltipStyle} />
                                        <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                                        
                                        <Bar yAxisId="left" name="Daily Load" dataKey="daily_load" fill="#ff4d00" fillOpacity={0.6} radius={[4, 4, 0, 0]} barSize={20} />
                                        <Line yAxisId="right" type="monotone" dataKey="wellness" name="Wellness (Max 40)" stroke="#475569" strokeWidth={3} dot={{r: 3}} activeDot={{r: 5}} />
                                    </ComposedChart>
                                </ResponsiveContainer> */ null
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                                    <Activity className="w-6 h-6 md:w-8 md:h-8 opacity-20" />
                                    <p className="text-xs md:text-sm font-medium">Belum ada data Load.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col min-w-0 w-full">
                        <h3 className="text-xs md:text-sm font-bold text-slate-700 mb-6 flex items-center gap-2">
                            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-500"><HeartPulse className="w-4 h-4" /></div>
                            Tren Recovery Fisik
                        </h3>
                        <div className="flex-1 w-full min-h-[300px] relative">
                            {daily_metrics && daily_metrics.length > 0 ? (
                                /* <ResponsiveContainer width="100%" minHeight={300}>
                                    <AreaChart data={daily_metrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRecSmall" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="date" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                        <YAxis tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} domain={[0, 100]}/>
                                        <RechartsTooltip contentStyle={customTooltipStyle} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }} />
                                        <Area type="natural" dataKey="recovery" name="Recovery %" stroke="#10b981" strokeWidth={3} fill="url(#colorRecSmall)" activeDot={{r: 5}} />
                                    </AreaChart>
                                </ResponsiveContainer> */ null
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                                    <HeartPulse className="w-6 h-6 md:w-8 md:h-8 opacity-20" />
                                    <p className="text-xs md:text-sm font-medium">Belum ada data metrik harian.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                
                {/* Comprehensive Athlete Profiling Metrics */}
                <div className="mb-6 md:mb-8">
                    <h3 className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Target className="w-4 h-4 text-[#ff4d00]" />
                        Athlete Profiling Metrics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                        {/* PHV & Growth */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col transition-all hover:shadow-md">
                            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-emerald-500"/>
                                    PHV & Pertumbuhan
                                </h4>
                                {latest_phv && <span className="text-xs font-medium bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">{new Date(latest_phv.assessment_date).toLocaleDateString('id-ID')}</span>}
                            </div>
                            {latest_phv ? (
                                <div className="space-y-6 flex-1">
                                    <div>
                                        <p className="text-sm text-slate-500 font-medium mb-1">Status PHV</p>
                                        <p className="text-2xl font-bold text-emerald-600 tracking-tight">{latest_phv.phv_status}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <p className="text-xs text-slate-500 font-bold mb-1">Maturity Offset</p>
                                            <p className="text-lg font-bold text-slate-800">{latest_phv.maturity_offset} <span className="text-xs text-slate-400 font-medium">tahun</span></p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <p className="text-xs text-slate-500 font-bold mb-1">Prediksi Tinggi</p>
                                            <p className="text-lg font-bold text-slate-800">{latest_phv.predicted_adult_height} <span className="text-xs text-slate-400 font-medium">cm</span></p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-10 gap-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <Activity className="w-8 h-8 opacity-30" />
                                    <p className="text-sm font-medium">Belum ada data PHV</p>
                                </div>
                            )}
                        </div>

                        {/* Wellness & RPE */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col transition-all hover:shadow-md">
                            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-orange-500"/>
                                    Wellness & Beban
                                </h4>
                                {latest_wellness && <span className="text-xs font-medium bg-orange-50 text-orange-600 px-3 py-1 rounded-full">{new Date(latest_wellness.record_date).toLocaleDateString('id-ID')}</span>}
                            </div>
                            {latest_wellness ? (
                                <div className="space-y-6 flex-1">
                                    <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                                        <div>
                                            <p className="text-sm text-slate-500 font-medium mb-1">Skor Wellness</p>
                                            <p className="text-3xl font-bold text-emerald-600 tracking-tight">{latest_wellness.daily_wellness_score} <span className="text-sm text-slate-400 font-medium">/ 30</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-slate-500 font-medium mb-1">Session RPE</p>
                                            <p className="text-3xl font-bold text-orange-500 tracking-tight">{latest_wellness.session_rpe ?? '-'} <span className="text-sm text-slate-400 font-medium">/ 10</span></p>
                                        </div>
                                    </div>
                                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex justify-between items-center">
                                        <span className="text-sm text-[#ff4d00] font-bold">Daily Load (AU)</span>
                                        <span className="text-xl font-bold text-[#ff4d00]">{latest_wellness.daily_load ?? '-'}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-10 gap-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <Zap className="w-8 h-8 opacity-30" />
                                    <p className="text-sm font-medium">Belum ada data Wellness</p>
                                </div>
                            )}
                        </div>

                        {/* DPA Status */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col transition-all hover:shadow-md">
                            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <User className="w-5 h-5 text-indigo-500"/>
                                    Dynamic Posture
                                </h4>
                                {latest_dpa && <span className="text-xs font-medium bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">{new Date(latest_dpa.assessment_date).toLocaleDateString('id-ID')}</span>}
                            </div>
                            {latest_dpa ? (
                                <div className="space-y-6 flex-1">
                                    <div>
                                        <p className="text-sm text-slate-500 font-medium mb-1">Status DPA</p>
                                        <p className="text-2xl font-bold text-indigo-600 tracking-tight">Assessed</p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex items-center justify-between">
                                            <p className="text-sm text-indigo-500 font-bold">Total Kompensasi</p>
                                            <p className="text-xl font-bold text-indigo-600">{latest_dpa.total_score} <span className="text-xs text-indigo-400 font-medium">temuan</span></p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-10 gap-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <User className="w-8 h-8 opacity-30" />
                                    <p className="text-sm font-medium">Belum ada data DPA</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {latest_composition && (
                    <div className="mb-6 md:mb-8">
                        {/* <CompositionAnatomy test={latest_composition} /> */}
                    </div>
                )}

                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <History className="w-5 h-5 text-slate-400" /> 
                        <h3 className="font-bold text-slate-700">Riwayat Tes Performa Terbaru</h3>
                    </div>

                    
                    <div className="md:hidden flex flex-col gap-3">
                        {history && history.length > 0 ? (
                            history.map((session) => (
                                <div key={session.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="font-bold text-sm text-slate-700">{session.date}</div>
                                        <span className={`px-2 py-1 rounded text-[9px] font-bold border ${session.status.color}`}>
                                            {session.status.label}
                                        </span>
                                    </div>
                                    <div className="mb-3">
                                        <p className="text-sm font-bold text-slate-800">{session.name}</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{session.items_count} Tes Diselesaikan</p>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
                                        <span className="text-[10px] font-bold text-slate-400">Skor Akhir</span>
                                        <span className="font-bold text-[#ff4d00] text-lg">{Number(session.score).toFixed(1)}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-400 italic text-xs shadow-sm">
                                Belum ada data latihan yang terekam.
                            </div>
                        )}
                    </div>

                    
                    <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-sm text-left whitespace-nowrap min-w-[600px]">
                                <thead className="text-xs text-slate-500 bg-slate-50/50 font-bold">
                                    <tr>
                                        <th className="px-6 py-4 border-b border-slate-100">Tanggal</th>
                                        <th className="px-6 py-4 border-b border-slate-100">Nama Sesi</th>
                                        <th className="px-6 py-4 border-b border-slate-100 text-center">Jml Item</th>
                                        <th className="px-6 py-4 border-b border-slate-100 text-center">Skor</th>
                                        <th className="px-6 py-4 border-b border-slate-100 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {history && history.length > 0 ? (
                                        history.map((session) => (
                                            <tr key={session.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-slate-700">{session.date}</td>
                                                <td className="px-6 py-4 font-bold text-slate-800">{session.name}</td>
                                                <td className="px-6 py-4 text-center text-slate-500 text-xs">{session.items_count} Tes</td>
                                                <td className="px-6 py-4 text-center">
                                                    
                                                    <span className="font-bold text-[#ff4d00] text-lg">{Number(session.score).toFixed(1)}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${session.status.color}`}>
                                                        {session.status.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-slate-400 italic">
                                                Belum ada data latihan yang terekam.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}

function StatCard({ label, value, icon: Icon, color, isText = false }) {
    let displayValue = value;
    if (!isText && typeof value === 'number') {
        if (!Number.isInteger(value)) displayValue = value.toFixed(1);
    } else if (!isText && !isNaN(parseFloat(value)) && isFinite(value)) {
        displayValue = parseFloat(value).toFixed(1);
    }

    return (
        <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full min-w-0">
            <div>
                <p className="text-[10px] md:text-xs text-slate-400 font-bold mb-1.5 md:mb-2 flex items-center gap-1.5 truncate">
                    <Icon className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" /> <span className="truncate">{label}</span>
                </p>
                <p className={`font-bold ${isText ? 'text-sm md:text-lg leading-tight truncate' : 'text-xl md:text-3xl truncate'} ${color}`}>
                    {displayValue || '-'}
                </p>
            </div>
        </div>
    );
}