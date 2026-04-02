import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Edit3, Printer, Calendar, User, Trophy, FileText, Target, Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { 
    ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceLine,
    BarChart, Bar, Cell
} from 'recharts';

// --- HELPER FORMAT NUMBERS ---
const formatNumber = (val) => {
    if (val === undefined || val === null || val === '') return '-';
    return Number(val).toLocaleString('en-US', { maximumFractionDigits: 2 });
};

const formatPercent = (val) => {
    if (val === undefined || val === null) return '-';
    return Number(val).toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    }) + '%';
};

const GrowthIndicator = ({ value, hasPrevious }) => {
    if (!hasPrevious) return <span className="text-slate-300 text-[10px] font-medium">-</span>;
    if (value > 0) return <span className="flex items-center text-emerald-600 text-[10px] font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100"><TrendingUp className="w-3 h-3 mr-1" /> +{formatNumber(value)}%</span>;
    if (value < 0) return <span className="flex items-center text-red-500 text-[10px] font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-100"><TrendingDown className="w-3 h-3 mr-1" /> {formatNumber(value)}%</span>;
    return <span className="flex items-center text-slate-400 text-[10px] font-bold bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100"><Minus className="w-3 h-3 mr-1" /> 0%</span>;
};

const getScoreColor = (val) => {
    if (val >= 91) return '#059669'; 
    if (val >= 81) return '#2563eb'; 
    if (val >= 71) return '#ca8a04'; 
    if (val >= 51) return '#f97316'; 
    return '#ef4444'; 
};

export default function Show({ test, current_score, radar_data, item_analysis, history }) {
    const { auth, app_settings } = usePage().props; // Get app_settings here
    const isAthlete = auth.user.role === 'athlete';
    const hasPrevious = history && history.length > 1;

    // Use app settings or fallbacks
    const appName = app_settings?.name || 'ZK15 Sports Analytics';
    const appLogo = app_settings?.logo || '/assets/images/zk-logo.png';

    const handlePrint = () => {
        window.print();
    };

    return (
        <AdminLayout title="test result details">
            <Head title="result details" />

            {/* --- PRINT CSS & RESPONSIVE FIX --- */}
            <style>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    body * { visibility: hidden; }
                    
                    #report-content, #report-content * { 
                        visibility: visible; 
                    }
                    
                    #report-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 20px 40px !important;
                        border: none;
                        background: white;
                    }

                    .print\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
                    .print\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
                    .print\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
                    
                    .overflow-x-auto { overflow: visible !important; }
                    
                    .no-print { display: none !important; }
                    
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            `}</style>

            {/* ACTION BAR */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 no-print">
                <Link href={route('admin.performance.index')} className="text-slate-500 hover:text-[#00488b] flex items-center gap-2 font-bold text-sm transition-colors group  ">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> back
                </Link>
                <div className="flex w-full sm:w-auto gap-2">
                    {!isAthlete && (
                        <Link href={route('admin.performance.edit', test.id)} className="flex-1 sm:flex-none justify-center bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors  ">
                            <Edit3 className="w-4 h-4" /> edit
                        </Link>
                    )}
                    <button onClick={handlePrint} className="flex-1 sm:flex-none justify-center bg-[#00488b] text-white px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-900/20 hover:bg-[#003666] transition-colors  ">
                        <Printer className="w-4 h-4" /> print pdf
                    </button>
                </div>
            </div>

            {/* --- REPORT CONTAINER --- */}
            <div id="report-content" className="bg-white w-full max-w-7xl mx-auto rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 p-4 md:p-8 lg:p-12 relative">
                
                {/* 1. HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-200 pb-6 mb-6 gap-4">
                    <div className="flex items-center gap-4">
                            <img 
                                src={appLogo} // Changed here
                                alt="App Logo" 
                                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                                onError={(e) => {
                                    // Fallback jika gambar tidak ditemukan / error load
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        <div>
                            <h1 className="text-xl md:text-2xl text-blue-900 font-extrabold tracking-tight  ">Performance Report</h1>
                            <p className="text-xs md:text-sm text-slate-500 font-bold tracking-wide  ">{appName}</p> {/* Changed here */}                        </div>
                    </div>
                    <div className="text-left md:text-right w-full md:w-auto bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-lg">
                        <div className="inline-block px-2 py-0.5 bg-white md:bg-slate-50 rounded md:rounded-lg border border-slate-200 md:border-slate-100 mb-1">
                            <p className="text-[10px] md:text-xs font-bold text-slate-500 tracking-wider  ">official document</p>
                        </div>
                        <p className="text-xs md:text-sm text-slate-400 font-mono mt-1 font-medium  ">ref id: {test.name}</p>
                    </div>
                </div>

                {/* 2. ATHLETE PROFILE */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-4 gap-6">
                        <div className="space-y-1.5">
                            <p className="text-xs text-slate-400 font-bold tracking-wider  ">athlete name</p>
                            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm md:text-base  ">
                                <User className="w-4 h-4 text-[#00488b]" /> {test.athlete.name}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-xs text-slate-400 font-bold tracking-wider  ">sport category</p>
                            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm md:text-base  ">
                                <Trophy className="w-4 h-4 text-[#00488b]" /> {test.athlete.sport.name}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-xs text-slate-400 font-bold tracking-wider  ">assessment date</p>
                            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm md:text-base  ">
                                <Calendar className="w-4 h-4 text-[#00488b]" /> {test.date}
                            </div>
                        </div>
                        <div className="space-y-1.5 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-200 mt-2 sm:mt-0">
                            <p className="text-xs text-slate-400 font-bold tracking-wider  ">total avg score</p>
                            <div className="flex items-center gap-2 text-[#00488b]">
                                <span className="text-2xl md:text-3xl font-black tracking-tight">{formatPercent(current_score)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. GRAPHS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 print:grid-cols-2 gap-6 md:gap-8 mb-10" style={{ pageBreakInside: 'avoid' }}>
                    <div className="border border-slate-100 rounded-2xl p-4 md:p-6 bg-slate-50/30">
                        <h3 className="text-xs font-bold text-slate-500 mb-4  ">skill map</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radar_data}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="target" dataKey="B" stroke="#fbbf24" strokeWidth={2} fill="#fbbf24" fillOpacity={0.1} />
                                    <Radar name="athlete" dataKey="A" stroke="#00488b" strokeWidth={3} fill="#00488b" fillOpacity={0.4} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="border border-slate-100 rounded-2xl p-4 md:p-6 bg-slate-50/30">
                        <h3 className="text-xs font-bold text-slate-500 mb-4  ">performance trend</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00488b" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#00488b" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <Area type="monotone" dataKey="score" stroke="#00488b" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 4. BAR CHART */}
                <div className="mb-10 border border-slate-100 rounded-2xl p-4 md:p-6 bg-slate-50/30" style={{ pageBreakInside: 'avoid' }}>
                    <h3 className="text-xs font-bold text-slate-500 mb-4  ">item comparison (prev vs current)</h3>
                    <div className="h-64 md:h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={item_analysis} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} barGap={2}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b', fontWeight:600 }} axisLine={false} tickLine={false} interval={0} />
                                <YAxis domain={[0, 100]} hide />
                                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                <Bar name="previous test" dataKey="previous_score" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar name="current test" dataKey="score" fill="#00488b" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 5. DETAIL TABLE */}
                <div className="mb-10 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left min-w-[700px]">
                            <thead className="bg-slate-50 text-xs text-slate-500 font-bold tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="px-4 md:px-6 py-4  ">test item</th>
                                    <th className="px-4 md:px-6 py-4 text-center  ">result (raw)</th>
                                    <th className="px-4 md:px-6 py-4 text-center  ">unit</th>
                                    <th className="px-4 md:px-6 py-4 text-center  ">benchmark</th>
                                    <th className="px-4 md:px-6 py-4 text-center bg-slate-100/50 print:bg-transparent  ">prev (%)</th>
                                    <th className="px-4 md:px-6 py-4 text-right bg-blue-50/30 print:bg-transparent  ">curr (%)</th>
                                    <th className="px-4 md:px-6 py-4 text-center  ">trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {item_analysis.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors" style={{ pageBreakInside: 'avoid' }}>
                                        <td className="px-4 md:px-6 py-3">
                                            <div className="font-bold text-slate-700  ">{item.name}</div>
                                            <div className="text-[10px] text-slate-400 font-bold mt-0.5  ">{item.category}</div>
                                        </td>
                                        <td className="px-4 md:px-6 py-3 text-center font-bold text-slate-800 text-base">{formatNumber(item.result_value)}</td>
                                        <td className="px-4 md:px-6 py-3 text-center text-slate-400 text-xs font-bold  ">{item.unit}</td>
                                        <td className="px-4 md:px-6 py-3 text-center">
                                            <div className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md text-xs font-bold text-slate-600 border border-slate-200">
                                                <Target className="w-3 h-3 text-slate-400" />
                                                {formatNumber(item.target_value)}
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-3 text-center bg-slate-50/30 text-slate-400 font-medium print:bg-transparent print:text-slate-600">
                                            {hasPrevious ? formatPercent(item.previous_score) : '-'}
                                        </td>
                                        <td className="px-4 md:px-6 py-3 text-right bg-blue-50/10 print:bg-transparent">
                                            <span className="font-black text-base" style={{ color: getScoreColor(item.score) }}>{formatPercent(item.score)}</span>
                                        </td>
                                        <td className="px-4 md:px-6 py-3 text-center flex justify-center">
                                            <div className="bg-white px-2 py-1 rounded border border-slate-100 shadow-sm print:shadow-none print:border-slate-300">
                                                <GrowthIndicator value={item.growth} hasPrevious={hasPrevious} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-blue-50/50 border-t-2 border-slate-200 print:bg-slate-100" style={{ pageBreakInside: 'avoid' }}>
                                    <td colSpan="5" className="px-4 md:px-6 py-5 text-right font-bold text-slate-500 text-xs tracking-wider  ">total average score :</td>
                                    <td className="px-4 md:px-6 py-5 text-right font-black text-2xl text-[#00488b]">{formatPercent(current_score)}</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 6. NOTES */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 print:bg-transparent print:border-slate-300" style={{ pageBreakInside: 'avoid' }}>
                    <h4 className="text-xs font-bold text-[#00488b] mb-2 flex items-center gap-2  ">
                        <FileText className="w-4 h-4" /> coach notes / evaluation
                    </h4>
                    <p className="text-sm text-slate-600 italic leading-relaxed whitespace-pre-line text-justify  ">
                        "{test.notes || "no notes available."}"
                    </p>
                </div>
                
                <div className="text-center pt-8 text-[10px] text-slate-300 font-bold tracking-widest print:text-slate-500  ">
                    Generated by {appName} • {new Date().getFullYear()} {/* Changed here */}
                </div>
            </div>
        </AdminLayout>
    );
}