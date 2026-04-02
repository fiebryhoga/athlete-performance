import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    User, Calendar, Activity, Trophy, TrendingUp, TrendingDown, 
    Target, Scale, Ruler, Weight, Clock, Zap, AlertCircle, ArrowRight, HeartPulse, Battery
} from 'lucide-react';
import { 
    ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ComposedChart, Bar, Line
} from 'recharts';

export default function AthleteDashboard({ user, stats, radarData, history, trendData, daily_metrics, training_loads }) {

    // --- 1. LOGIC HELPER ---
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
        <AdminLayout title="My Dashboard">
            <Head title="Dashboard Atlet" />

            {/* HEADER WELCOME */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard & Profil</h1>
                    <p className="text-slate-500 text-sm">Selamat datang, terus tingkatkan performamu hari ini!</p>
                </div>
                <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
                    <div className="p-2 bg-blue-50 text-[#00488b] rounded-lg">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Hari Ini</p>
                        <p className="text-sm font-bold text-slate-700">
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* 1. KARTU PROFIL LENGKAP (KIRI) */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center h-full relative overflow-hidden">
                    <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-[#00488b]/10 to-transparent"></div>
                    
                    <div className="relative z-10 w-24 h-24 bg-[#00488b] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-xl shadow-blue-900/20 border-4 border-white overflow-hidden shrink-0">
                        {user.profile_photo_url ? (
                            <img src={user.profile_photo_url} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            initial
                        )}
                    </div>
                    
                    <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
                    <p className="text-sm text-slate-500 font-medium mb-2">{user.athlete_id || '-'}</p>
                    
                    <div className="flex gap-2 mb-6">
                        <span className="px-3 py-1 bg-blue-50 text-[#00488b] rounded-full text-xs font-bold tracking-wider flex items-center gap-1 border border-blue-100">
                            <Trophy className="w-3 h-3" /> {stats.sport}
                        </span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold tracking-wider border border-slate-200">
                            Athlete
                        </span>
                    </div>

                    {/* Grid Fisik */}
                    <div className="grid grid-cols-2 gap-3 w-full border-t border-slate-100 pt-6">
                        <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex justify-center mb-1"><Ruler className="w-4 h-4 text-slate-400" /></div>
                            <p className="text-[10px] text-slate-400 font-bold">Tinggi</p>
                            <p className="font-bold text-slate-800 text-lg">{user.height || '-'} <span className="text-xs font-normal text-slate-500">cm</span></p>
                        </div>
                        <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex justify-center mb-1"><Weight className="w-4 h-4 text-slate-400" /></div>
                            <p className="text-[10px] text-slate-400 font-bold">Berat</p>
                            <p className="font-bold text-slate-800 text-lg">{user.weight || '-'} <span className="text-xs font-normal text-slate-500">kg</span></p>
                        </div>
                        <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex justify-center mb-1"><Clock className="w-4 h-4 text-slate-400" /></div>
                            <p className="text-[10px] text-slate-400 font-bold">Umur</p>
                            <p className="font-bold text-slate-800 text-lg">{user.age || '-'} <span className="text-xs font-normal text-slate-500">thn</span></p>
                        </div>
                        <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex justify-center mb-1"><Scale className="w-4 h-4 text-slate-400" /></div>
                            <p className="text-[10px] text-slate-400 font-bold">BMI</p>
                            <p className="font-bold text-slate-800 text-lg">{bmi}</p>
                            <p className={`text-[10px] font-bold ${bmiStatus.color}`}>{bmiStatus.label}</p>
                        </div>
                    </div>
                </div>

                {/* 2. STATISTIK & GRAFIK (KANAN) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <StatCard label="Total Sesi" value={stats.sessions} icon={Activity} color="text-slate-800" />
                        <StatCard label="Rata-rata Skor" value={stats.avg_score} icon={Target} color="text-[#00488b]" />
                        <StatCard label="Skor Tertinggi" value={stats.max_score} icon={TrendingUp} color="text-emerald-600" />
                        <StatCard label="Kategori Terbaik" value={stats.best_category} icon={Zap} color="text-amber-500" isText />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                        {/* Radar Chart */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-[#00488b] rounded-full"></span> Peta Kemampuan vs Target
                            </h3>
                            <div className="flex-1 min-h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar name="Target Cabor" dataKey="B" stroke="#fbbf24" strokeWidth={2} fill="#fbbf24" fillOpacity={0.15} />
                                        <Radar name="Performa Saya" dataKey="A" stroke="#00488b" strokeWidth={2} fill="#00488b" fillOpacity={0.5} />
                                        <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                        <RechartsTooltip contentStyle={{borderRadius:'8px'}} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Trend Chart */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span> Tren Progress (6 Sesi Terakhir)
                            </h3>
                            <div className="flex-1 min-h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
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
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. SECTION ANALISIS (KEKUATAN & KELEMAHAN) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-8 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    <div className="p-6 md:p-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600"><Zap className="w-5 h-5" /></div> Keunggulan Utama
                        </h3>
                        <div className="space-y-4">
                            {strengths.length > 0 ? strengths.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <span className="text-3xl font-black text-slate-100 group-hover:text-emerald-100 transition-colors">0{idx + 1}</span>
                                        <div>
                                            <p className="font-bold text-slate-700">{item.subject}</p>
                                            <p className="text-xs text-slate-400">Score &gt; Target</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xl font-bold text-emerald-600">{Number(item.A).toFixed(1)}</span>
                                    </div>
                                </div>
                            )) : <p className="text-slate-400 italic text-sm py-4">Data belum cukup untuk analisis keunggulan.</p>}
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <div className="p-1.5 bg-red-100 rounded-lg text-red-600"><AlertCircle className="w-5 h-5" /></div> Area Peningkatan
                        </h3>
                        <div className="space-y-4">
                            {weaknesses.length > 0 ? weaknesses.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <span className="text-3xl font-black text-slate-100 group-hover:text-red-100 transition-colors">0{idx + 1}</span>
                                        <div>
                                            <p className="font-bold text-slate-700">{item.subject}</p>
                                            <p className="text-xs text-slate-400">Target: <span className="font-bold">{item.B}</span></p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xl font-bold text-red-500">{Number(item.A).toFixed(1)}</span>
                                    </div>
                                </div>
                            )) : <p className="text-slate-400 italic text-sm py-4">Tidak ada kelemahan signifikan.</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. NEW SECTION: DAILY METRICS & TRAINING LOAD */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                {/* A. Training Load Trend */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="text-sm font-bold text-slate-700 mb-6 flex items-center gap-2">
                        <div className="p-1.5 bg-amber-50 rounded-lg text-amber-500"><Battery className="w-4 h-4" /></div>
                        Tren Beban Latihan (30 Hari)
                    </h3>
                    <div className="flex-1 min-h-[300px]">
                        {training_loads && training_loads.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={training_loads} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#f59e0b' }} axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#8b5cf6' }} axisLine={false} tickLine={false} domain={[0, 40]}/>
                                    <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={customTooltipStyle} />
                                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                    <Bar yAxisId="left" name="Daily Load" dataKey="daily_load" fill="#fbd38d" radius={[4, 4, 0, 0]} barSize={20} />
                                    <Line yAxisId="right" type="monotone" dataKey="wellness" name="Wellness (Max 40)" stroke="#8b5cf6" strokeWidth={3} dot={{r: 3}} activeDot={{r: 5}} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                                <Activity className="w-8 h-8 opacity-20" />
                                <p className="text-sm font-medium">Belum ada data Load.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* B. Daily Recovery Trend */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="text-sm font-bold text-slate-700 mb-6 flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-500"><HeartPulse className="w-4 h-4" /></div>
                        Tren Recovery Fisik
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
                                    <XAxis dataKey="date" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                    <YAxis tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} domain={[0, 100]}/>
                                    <RechartsTooltip contentStyle={customTooltipStyle} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }} />
                                    <Area type="natural" dataKey="recovery" name="Recovery %" stroke="#10b981" strokeWidth={3} fill="url(#colorRecSmall)" activeDot={{r: 5}} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                                <HeartPulse className="w-8 h-8 opacity-20" />
                                <p className="text-sm font-medium">Belum ada data metrik harian.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 5. TABEL RIWAYAT LATIHAN */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-slate-400" /> Riwayat Tes Performa Terbaru
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-3">Tanggal</th>
                                <th className="px-6 py-3">Nama Sesi</th>
                                <th className="px-6 py-3 text-center">Jml Item</th>
                                <th className="px-6 py-3 text-center">Skor</th>
                                <th className="px-6 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {history && history.length > 0 ? (
                                history.map((session) => (
                                    <tr key={session.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-700">{session.date}</td>
                                        <td className="px-6 py-4 text-slate-600">{session.name}</td>
                                        <td className="px-6 py-4 text-center text-slate-500 text-xs">{session.items_count} Tes</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-bold text-[#00488b] text-lg">{Number(session.score).toFixed(1)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold border ${session.status.color}`}>
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
        </AdminLayout>
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
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
            <div>
                <p className="text-xs text-slate-400 font-bold mb-2 flex items-center gap-1">
                    <Icon className="w-3 h-3" /> {label}
                </p>
                <p className={`font-black ${isText ? 'text-lg leading-tight' : 'text-3xl'} ${color}`}>
                    {displayValue || '-'}
                </p>
            </div>
        </div>
    );
}