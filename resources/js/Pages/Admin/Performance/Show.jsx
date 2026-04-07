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
    if (value > 0) return <span className="flex items-center text-emerald-600 text-[10px] font-bold"><TrendingUp className="w-3 h-3 mr-1" /> +{formatNumber(value)}%</span>;
    if (value < 0) return <span className="flex items-center text-rose-500 text-[10px] font-bold"><TrendingDown className="w-3 h-3 mr-1" /> {formatNumber(value)}%</span>;
    return <span className="flex items-center text-slate-400 text-[10px] font-bold"><Minus className="w-3 h-3 mr-1" /> 0%</span>;
};

const getScoreColor = (val) => {
    if (val >= 91) return '#059669'; // Emerald
    if (val >= 81) return '#0d9488'; // Teal (Komplementer Oranye)
    if (val >= 71) return '#d97706'; // Amber
    if (val >= 51) return '#ea580c'; // Orange
    return '#e11d48'; // Rose
};

// MENERIMA `historical_labels` DARI CONTROLLER
export default function Show({ test, current_score, radar_data, item_analysis, history, historical_labels }) {
    const { auth, app_settings } = usePage().props; 
    const isAthlete = auth.user.role === 'athlete';
    const hasPrevious = history && history.length > 1;

    const appName = app_settings?.name || 'Performance Analytics';
    const appLogo = app_settings?.logo || '/assets/images/zk-logo.png';

    const handlePrint = () => {
        window.print();
    };

    // Palet warna untuk riwayat tes agar terlihat gradasi
    const historicalColors = ['#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8'];

    return (
        <AdminLayout title="Test Result Details">
            <Head title="Result Details" />

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

            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 no-print">
                <Link href={route('admin.performance.index')} className="inline-flex items-center text-[10px] md:text-xs font-bold text-slate-400 hover:text-[#ff4d00] mb-3 md:mb-4 group transition-colors uppercase tracking-widest touch-manipulation py-1">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-x-1" /> Back to History list
                </Link>
                <div className="flex w-full sm:w-auto gap-2">
                    {!isAthlete && (
                        <Link href={route('admin.performance.edit', test.id)} className="flex-1 sm:flex-none justify-center bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-orange-50 hover:text-[#ff4d00] hover:border-orange-200 transition-colors shadow-sm">
                            <Edit3 className="w-4 h-4" /> Edit
                        </Link>
                    )}
                    <button onClick={handlePrint} className="flex-1 sm:flex-none justify-center bg-[#ff4d00] text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#ff4d00]/20 hover:bg-[#e64500] hover:shadow-xl transition-all active:scale-95">
                        <Printer className="w-4 h-4" /> Print PDF
                    </button>
                </div>
            </div>

            
            <div id="report-content" className="bg-white w-full max-w-7xl mx-auto rounded-lg shadow-sm border border-slate-200 p-5 md:p-8 lg:p-12 relative overflow-hidden">
                
                
                <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-200 pb-6 mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <img 
                            src={appLogo}
                            alt="App Logo" 
                            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div>
                            <h1 className="text-xl md:text-2xl text-slate-800 font-black tracking-tight uppercase">Performance Report</h1>
                            <p className="text-[10px] md:text-xs text-[#ff4d00] font-bold tracking-widest uppercase mt-0.5">{appName}</p> 
                        </div>
                    </div>
                    <div className="text-left md:text-right w-full md:w-auto bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-lg">
                        <div className="inline-block px-2 py-0.5 bg-white md:bg-orange-50 rounded border border-slate-200 md:border-orange-100 mb-1">
                            <p className="text-[9px] md:text-[10px] font-bold text-[#ff4d00] tracking-widest uppercase">Official Document</p>
                        </div>
                        <p className="text-[10px] md:text-xs text-slate-400 font-mono mt-1 font-bold uppercase tracking-widest">REF ID: {test.name}</p>
                    </div>
                </div>

                
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-100 mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-4 gap-6">
                        <div className="space-y-1.5">
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Athlete Name</p>
                            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm md:text-base">
                                <User className="w-4 h-4 text-[#ff4d00]" /> {test.athlete.name}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Sport Category</p>
                            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm md:text-base">
                                <Trophy className="w-4 h-4 text-[#ff4d00]" /> {test.athlete.sport.name}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Assessment Date</p>
                            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm md:text-base">
                                <Calendar className="w-4 h-4 text-[#ff4d00]" /> {test.date}
                            </div>
                        </div>
                        <div className="space-y-1.5 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-200 mt-2 sm:mt-0">
                            <p className="text-[10px] text-[#ff4d00] font-bold tracking-widest uppercase">Total Avg Score</p>
                            <div className="flex items-center gap-2 text-[#ff4d00]">
                                <span className="text-2xl md:text-3xl font-black tracking-tight">{formatPercent(current_score)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className="grid grid-cols-1 lg:grid-cols-2 print:grid-cols-2 gap-6 mb-10" style={{ pageBreakInside: 'avoid' }}>
                    <div className="border border-slate-100 rounded-lg p-5 bg-white shadow-sm">
                        <h3 className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-widest flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-slate-400"/> Skill Map</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radar_data}>
                                    <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Target" dataKey="B" stroke="#cbd5e1" strokeWidth={1} fill="#f8fafc" fillOpacity={0.5} strokeDasharray="3 3" />
                                    <Radar name="Athlete" dataKey="A" stroke="#ff4d00" strokeWidth={2} fill="#ff4d00" fillOpacity={0.3} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="border border-slate-100 rounded-lg p-5 bg-white shadow-sm">
                        <h3 className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-widest flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-slate-400"/> Performance Trend</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ff4d00" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#ff4d00" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <Area type="monotone" dataKey="score" stroke="#ff4d00" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" activeDot={{r: 5, fill: '#ff4d00', strokeWidth: 0}} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                
                <div className="mb-10 border border-slate-100 rounded-lg p-5 bg-white shadow-sm" style={{ pageBreakInside: 'avoid' }}>
                    <h3 className="text-[10px] font-bold text-slate-500 mb-6 uppercase tracking-widest flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-slate-400"/> Item Comparison (Last {historical_labels ? historical_labels.length + 1 : 1} Tests)</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={item_analysis} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barGap={2}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} interval={0} />
                                <YAxis domain={[0, 100]} hide />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius:'8px', border:'none', boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)', fontSize:'12px'}} />
                                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
                                
                                
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
                                            barSize={12} 
                                        />
                                    );
                                })}

                                
                                <Bar name="Current Test" dataKey="score" fill="#ff4d00" radius={[4, 4, 0, 0]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                
                <div className="mb-10 rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto w-full custom-scrollbar">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-200">
                                <tr>
                                    <th className="px-4 md:px-6 py-4">Test Item</th>
                                    <th className="px-4 md:px-6 py-4 text-center">Result (Raw)</th>
                                    
                                    
                                    <th className="px-4 md:px-6 py-4 text-center hidden sm:table-cell">Unit</th>
                                    <th className="px-4 md:px-6 py-4 text-center hidden md:table-cell">Benchmark</th>
                                    <th className="px-4 md:px-6 py-4 text-center bg-slate-100/50 print:bg-transparent hidden md:table-cell">Prev (%)</th>
                                    
                                    <th className="px-4 md:px-6 py-4 text-center bg-orange-50/50 print:bg-transparent text-slate-500">Score (%)</th>
                                    <th className="px-4 md:px-6 py-4 text-center hidden sm:table-cell">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {item_analysis.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-orange-50/30 transition-colors" style={{ pageBreakInside: 'avoid' }}>
                                        <td className="px-4 md:px-6 py-3 md:py-4">
                                            <div className="font-bold text-slate-700 text-xs md:text-sm">{item.name}</div>
                                            <div className="text-[9px] md:text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-widest">{item.category}</div>
                                        </td>
                                        <td className="px-4 md:px-6 py-3 md:py-4 text-center font-black text-slate-800 text-base whitespace-nowrap">{formatNumber(item.result_value)}</td>
                                        
                                        <td className="px-4 md:px-6 py-3 md:py-4 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest hidden sm:table-cell">{item.unit}</td>
                                        
                                        <td className="px-4 md:px-6 py-3 md:py-4 text-center hidden md:table-cell">
                                            <div className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-500 border border-slate-200">
                                                <Target className="w-3 h-3 text-slate-400" />
                                                {formatNumber(item.target_value)}
                                            </div>
                                        </td>
                                        
                                        <td className="px-4 md:px-6 py-3 md:py-4 text-center bg-slate-50/30 text-slate-400 font-medium text-xs md:text-sm print:bg-transparent print:text-slate-600 hidden md:table-cell">
                                            {hasPrevious ? formatPercent(item.previous_score) : '-'}
                                        </td>
                                        
                                        <td className="px-4 md:px-6 py-3 md:py-4 text-center bg-orange-50/30 print:bg-transparent">
                                            <span className="font-black text-sm md:text-base" style={{ color: getScoreColor(item.score) }}>{formatPercent(item.score)}</span>
                                        </td>
                                        
                                        <td className="px-4 md:px-6 py-3 md:py-4 text-center hidden sm:table-cell">
                                            <div className="flex justify-center">
                                                <div className="bg-white px-2 py-1 rounded border border-slate-100 shadow-sm print:shadow-none print:border-slate-300">
                                                    <GrowthIndicator value={item.growth} hasPrevious={hasPrevious} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                
                                
                                <tr className="bg-orange-50/50 border-t-2 border-slate-200 print:bg-slate-100" style={{ pageBreakInside: 'avoid' }}>
                                    <td colSpan="100%" className="px-4 md:px-6 py-4">
                                        <div className="flex justify-end items-center gap-4">
                                            <span className="font-bold text-slate-500 text-[10px] md:text-xs tracking-widest uppercase">Total Average Score :</span>
                                            <span className="font-black text-2xl md:text-3xl text-[#ff4d00]">{formatPercent(current_score)}</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                
                <div className="bg-slate-50 rounded-lg p-5 md:p-6 border border-slate-100 print:bg-transparent print:border-slate-300" style={{ pageBreakInside: 'avoid' }}>
                    <h4 className="text-[10px] md:text-xs font-bold text-[#ff4d00] mb-3 flex items-center gap-2 uppercase tracking-widest">
                        <FileText className="w-4 h-4" /> Coach Notes & Evaluation
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-line text-justify">
                        "{test.notes || "No notes available."}"
                    </p>
                </div>
                
                <div className="text-center pt-8 text-[9px] md:text-[10px] text-slate-300 font-bold tracking-widest uppercase print:text-slate-500">
                    Generated by {appName} • {new Date().getFullYear()} 
                </div>
            </div>
        </AdminLayout>
    );
}