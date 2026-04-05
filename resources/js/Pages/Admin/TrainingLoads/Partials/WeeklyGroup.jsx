import { Calendar, Edit3, Plus, TrendingUp, Target, AlertTriangle, Eye, X, FileText } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Bar, Line } from 'recharts';
import { useState } from 'react'; // Tambahkan useState

export default function WeeklyGroup({ week, formatDateToIndo, openModal, sessionTypes, physicalPrepTypes, skillTypes, matchTypes, travelTypes }) {
    
    // State untuk Modal Catatan
    const [detailNote, setDetailNote] = useState(null);

    // Custom Tooltip Style
    const customTooltipStyle = {
        borderRadius: '12px', border: 'none',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold'
    };

    // Fungsi Warna Dinamis untuk ACWR (Standar Sports Science)
    const getAcwrColor = (acwr) => {
        if (!acwr || acwr === 0) return 'text-slate-400';
        if (acwr < 0.8) return 'text-amber-300'; // Under-training
        if (acwr >= 0.8 && acwr <= 1.3) return 'text-emerald-400'; // Sweet spot
        if (acwr > 1.3 && acwr <= 1.5) return 'text-orange-400'; // Caution
        return 'text-rose-400'; // Danger zone (> 1.5)
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            
            {/* HEADER MINGGU */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#00488b]"/>
                    <h3 className="font-extrabold text-slate-800 text-lg">Periode: {week.label}</h3>
                </div>
                <div className="flex items-center gap-3">
                    {/* Badge Peringatan ACWR (Muncul jika > 1.5) */}
                    {week.metrics.acwr > 1.5 && (
                        <div className="bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Risiko Cedera</span>
                        </div>
                    )}
                    <div className="bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-lg flex items-center gap-2 w-fit">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Weekly Wellness:</span>
                        <span className=" font-bold text-slate-600 text-lg">{week.metrics.weeklyWellnessScore} <span className="text-xs font-bold text-slate-400">/ 280</span></span>
                    </div>
                </div>
            </div>
            
            {/* MICRO CHART & PEAK STATS */}
            <div className="p-6 border-b border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white">
                <div className="h-56 w-full">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 text-center tracking-widest">Load vs Wellness (Harian)</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={week.days.map(d => ({ day: d.dayName.substring(0,3), load: d.load, wellness: d.wellness }))} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="day" tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} axisLine={false} tickLine={false} dy={5} />
                            <YAxis yAxisId="left" tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} axisLine={false} tickLine={false} dx={-5} />
                            <YAxis yAxisId="right" orientation="right" tick={{fontSize: 10, fill: '#f43f5e', fontWeight: 'bold'}} axisLine={false} tickLine={false} domain={[0,40]} dx={5} />
                            <RechartsTooltip contentStyle={customTooltipStyle} cursor={{fill: '#f8fafc'}} />
                            <Bar yAxisId="left" dataKey="load" name="Daily Load (AU)" fill="#00488b" radius={[4,4,0,0]} barSize={24} />
                            <Line yAxisId="right" type="monotone" dataKey="wellness" name="Wellness Score" stroke="#f43f5e" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 6}} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-colors">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Puncak Beban Latihan</p>
                            <p className="font-bold text-slate-800 text-sm mt-0.5">Hari dengan Load Tertinggi</p>
                        </div>
                        <span className=" font-bold text-2xl text-[#00488b] group-hover:scale-110 transition-transform">{Math.max(...week.days.map(d => d.load))} <span className="text-sm font-bold text-slate-400">AU</span></span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-rose-200 transition-colors">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kebugaran Minimum</p>
                            <p className="font-bold text-slate-800 text-sm mt-0.5">Hari dengan Wellness Terendah</p>
                        </div>
                        <span className=" font-bold text-2xl text-rose-500 group-hover:scale-110 transition-transform">
                            {week.days.filter(d => d.wellness > 0).length > 0 ? Math.min(...week.days.filter(d => d.wellness > 0).map(d => d.wellness)) : 0} 
                            <span className="text-sm font-bold text-rose-300">/40</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* TABEL HARIAN */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-white border-b border-slate-100 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Hari</th>
                            <th className="px-4 py-4 text-center">Wellness</th>
                            <th className="px-4 py-4">Sesi Pagi (AM)</th>
                            <th className="px-4 py-4">Sesi Sore (PM)</th>
                            <th className="px-4 py-4 text-center text-[#00488b]">Daily Load</th>
                            <th className="px-4 py-4">Catatan</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {week.days.map((day, dIndex) => (
                            <tr key={dIndex} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-3">
                                    <div className="font-bold text-slate-800 capitalize">{day.dayName}</div>
                                    <div className="text-[10px] text-slate-400 font-medium">{formatDateToIndo(day.dateObj, 'short')}</div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {day.wellness ? (
                                        <span className=" font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-lg">{day.wellness}</span>
                                    ) : <span className="text-slate-300">-</span>}
                                </td>
                                <td className="px-4 py-3">
                                    {day.data?.am_load ? (
                                        <div>
                                            <div className="font-bold text-slate-700">{day.data.am_load} <span className="text-[10px] text-slate-400 font-normal">AU</span></div>
                                            <div className="text-[10px] text-slate-500">{day.data.am_session_type}</div>
                                        </div>
                                    ) : <span className="text-slate-300">-</span>}
                                </td>
                                <td className="px-4 py-3">
                                    {day.data?.pm_load ? (
                                        <div>
                                            <div className="font-bold text-slate-700">{day.data.pm_load} <span className="text-[10px] text-slate-400 font-normal">AU</span></div>
                                            <div className="text-[10px] text-slate-500">{day.data.pm_session_type}</div>
                                        </div>
                                    ) : <span className="text-slate-300">-</span>}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {day.load ? (
                                        <span className=" font-bold text-[#00488b] bg-blue-50 px-3 py-1 rounded-lg">{day.load}</span>
                                    ) : <span className="text-slate-300">-</span>}
                                </td>
                                
                                {/* KOLOM CATATAN (DENGAN TOMBOL VIEW) */}
                                <td className="px-4 py-3">
                                    {day.data?.notes ? (
                                        <button 
                                            onClick={() => setDetailNote(day)}
                                            className="flex items-center gap-1.5 max-w-[140px] text-left text-[11px] text-slate-600 italic bg-slate-50 hover:bg-sky-50 hover:text-sky-700 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-sky-200 transition-colors group/note"
                                            title="Lihat Catatan Lengkap"
                                        >
                                            <span className="truncate flex-1">"{day.data.notes}"</span>
                                            <Eye className="w-3.5 h-3.5 shrink-0 opacity-50 group-hover/note:opacity-100" />
                                        </button>
                                    ) : (
                                        <span className="text-slate-300">-</span>
                                    )}
                                </td>
                                
                                <td className="px-6 py-3 text-right">
                                    <button onClick={() => openModal(day.dateStr)} className="inline-flex items-center gap-1.5 ml-auto text-xs font-bold px-3 py-1.5 rounded-xl transition-all bg-white border border-slate-200 text-slate-500 hover:text-[#00488b] hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm">
                                        {day.data ? <><Edit3 className="w-3.5 h-3.5" /> Edit</> : <><Plus className="w-3.5 h-3.5" /> Isi Data</>}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* FOOTER 1: SUMMARY MINGGUAN (SPORTS SCIENCE METRICS) */}
            <div className="bg-[#00488b] p-6 text-white border-b border-blue-800">
                <div className="flex items-center gap-2 mb-4 opacity-80">
                    <TrendingUp className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Load Metrics & Monitoring</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 divide-x divide-blue-700/50">
                    <div className="px-4 first:pl-0"><p className="text-[10px] font-bold text-blue-200 uppercase mb-1">Weekly Load</p><p className="text-3xl  font-bold">{week.metrics.weeklyLoad}</p></div>
                    
                    {/* ACWR BLOCK */}
                    <div className="px-4">
                        <p className="text-[10px] font-bold text-blue-200 uppercase mb-1">ACWR Ratio</p>
                        <p className={`text-3xl  font-bold mt-1 ${getAcwrColor(week.metrics.acwr)}`}>
                            {week.metrics.acwr ? week.metrics.acwr : <span className="text-blue-400 font-medium text-lg italic">N/A</span>}
                        </p>
                    </div>

                    <div className="px-4"><p className="text-[10px] font-bold text-blue-200 uppercase mb-1">Mean Daily Load</p><p className="text-2xl font-bold mt-1">{week.metrics.meanLoad}</p></div>
                    <div className="px-4"><p className="text-[10px] font-bold text-blue-200 uppercase mb-1">Standard Deviation</p><p className="text-2xl font-bold mt-1">{week.metrics.stdDev}</p></div>
                    <div className="px-4"><p className="text-[10px] font-bold text-amber-300 uppercase mb-1">Training Monotony</p><p className="text-2xl font-bold mt-1 text-amber-400">{week.metrics.monotony}</p></div>
                    <div className="px-4"><p className="text-[10px] font-bold text-rose-300 uppercase mb-1">Strain</p><p className="text-2xl font-bold mt-1 text-rose-400">{week.metrics.strain}</p></div>
                </div>
            </div>

            {/* FOOTER 2: TRAINING / MATCH FREQUENCY */}
            <div className="bg-slate-50 p-6">
                <div className="flex items-center gap-2 mb-6 text-slate-500">
                    <Target className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Training / Match Frequency</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    <div className="space-y-2.5">
                        {physicalPrepTypes.map(t => (
                            <div key={t} className="flex justify-between text-sm border-b border-slate-200/50 pb-1">
                                <span className="text-slate-600">{t}</span><span className="font-extrabold text-slate-800">{week.metrics.frequency[t]}</span>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2.5">
                        {[...skillTypes, ...matchTypes, ...travelTypes].map(t => (
                            <div key={t} className="flex justify-between text-sm border-b border-slate-200/50 pb-1">
                                <span className="text-slate-600">{t}</span><span className="font-extrabold text-slate-800">{week.metrics.frequency[t]}</span>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5 h-fit">
                        <div className="flex justify-between items-center pb-2.5 border-b border-slate-100"><span className="text-[10px] font-bold text-slate-500 uppercase">Total (Train/Match/Travel)</span><span className="text-xl  font-bold text-[#00488b]">{week.metrics.totals.all}</span></div>
                        <div className="flex justify-between items-center pb-2.5 border-b border-slate-100"><span className="text-[10px] font-bold text-slate-500 uppercase">Total Training Sessions</span><span className="text-base font-extrabold text-slate-800">{week.metrics.totals.training}</span></div>
                        <div className="flex justify-between items-center pb-2.5 border-b border-slate-100"><span className="text-[10px] font-bold text-slate-500 uppercase">Num. Physical Prep</span><span className="text-sm font-bold text-slate-600">{week.metrics.totals.physical}</span></div>
                        <div className="flex justify-between items-center pb-2.5 border-b border-slate-100"><span className="text-[10px] font-bold text-slate-500 uppercase">Num. Skill Sessions</span><span className="text-sm font-bold text-slate-600">{week.metrics.totals.skill}</span></div>
                        <div className="flex justify-between items-center pb-2.5 border-b border-slate-100"><span className="text-[10px] font-bold text-slate-500 uppercase">Matches / Comps</span><span className="text-sm font-bold text-slate-600">{week.metrics.totals.matches}</span></div>
                        <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-slate-500 uppercase">Travel</span><span className="text-sm font-bold text-slate-600">{week.metrics.totals.travel}</span></div>
                    </div>
                </div>
            </div>

            {/* ========================================== */}
            {/* MODAL POP-UP UNTUK MELIHAT CATATAN LENGKAP */}
            {/* ========================================== */}
            {detailNote && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    {/* Background Overlay */}
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setDetailNote(null)}></div>
                    
                    {/* Modal Content */}
                    <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-sky-100 text-sky-600 rounded-xl">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800 leading-tight">Catatan Harian</h3>
                                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                                        {formatDateToIndo(detailNote.dateObj, 'full')} • <span className="capitalize">{detailNote.dayName}</span>
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setDetailNote(null)} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner">
                                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap italic">
                                    "{detailNote.data.notes}"
                                </p>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button onClick={() => setDetailNote(null)} className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors">
                                    Tutup Catatan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
}