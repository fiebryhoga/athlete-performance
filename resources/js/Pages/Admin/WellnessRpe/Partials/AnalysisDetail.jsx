import React, { useState } from 'react';

import { Link, usePage } from '@inertiajs/react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Bar, Line } from 'recharts';
import { TrendingUp, Edit3, Plus, ArrowLeft, Download, Loader2, Eye, X } from 'lucide-react';
import ExportModal from '@/Components/Partials/ExportModal';
import { submitDownloadForm } from '@/utils/submitDownloadForm';

export default function AnalysisDetail({ weeklyData, athleteWeeklyInfo, onBack }) {
    
 const { permissions } = usePage().props;
 const canModify = permissions?.wellness?.create || permissions?.wellness?.update;
 
 const [isExporting, setIsExporting] = useState(false);
 const [isExportModalOpen, setIsExportModalOpen] = useState(false);
 const [viewingEntry, setViewingEntry] = useState(null);

 // Fungsi membuka modal
 const handleDownloadPdf = () => {
 if (!athleteWeeklyInfo || !athleteWeeklyInfo.user_id) return;
 setIsExportModalOpen(true);
 };

 const handleExportConfirm = (filename, customTitle, note, { includeInsights }) => {
 setIsExportModalOpen(false);
 setIsExporting(true);

 const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
 submitDownloadForm(route('admin.wellness-rpe.export-pdf', athleteWeeklyInfo.user_id), {
 _token: csrfToken,
 filename: filename,
 title: customTitle,
 note: note,
 include_insights: includeInsights ? 1 : 0
 });

 setTimeout(() => setIsExporting(false), 2000);
 };

 const getAcwrBadgeClass = (acwr) => {
 if (!acwr || acwr === 0) return 'text-slate-400  bg-transparent';
 if (acwr < 0.8) return 'text-orange-500  font-bold'; // Under
 if (acwr >= 0.8 && acwr <= 1.3) return 'text-emerald-500  font-bold'; // Aman
 if (acwr > 1.3 && acwr <= 1.5) return 'text-yellow-500  font-bold'; // Warning
 return 'text-red-600  font-bold'; // Danger
 };

    const getDailyLoadBadgeClass = (val) => {
        if (!val || val === 0) return 'text-slate-900  bg-slate-100  border-slate-200 ';
        if (val < 1500) return 'text-emerald-700  bg-emerald-100  border-emerald-200 ';
        if (val <= 3000) return 'text-amber-700  bg-amber-100  border-amber-200 ';
        return 'text-red-700  bg-red-100  border-red-200 ';
    };

    const getDailyWellnessColor = (score) => {
        if (!score && score !== 0) return { text: 'text-slate-500', bg: 'bg-slate-100 ', border: 'border-slate-300 ', label: 'N/A' };
        if (score <= 9) return { text: 'text-red-700 ', bg: 'bg-red-100 ', border: 'border-red-200 ', label: "Sangat Buruk" };
        if (score <= 13) return { text: 'text-orange-700 ', bg: 'bg-orange-100 ', border: 'border-orange-200 ', label: "Buruk" };
        if (score <= 16) return { text: 'text-amber-700 ', bg: 'bg-amber-100 ', border: 'border-amber-200 ', label: "Agak Buruk" };
        if (score <= 19) return { text: 'text-yellow-700 ', bg: 'bg-yellow-100 ', border: 'border-yellow-200 ', label: "Sedang" };
        if (score <= 23) return { text: 'text-sky-700 ', bg: 'bg-sky-100 ', border: 'border-sky-200 ', label: "Agak Baik" };
        if (score <= 27) return { text: 'text-emerald-700 ', bg: 'bg-emerald-100 ', border: 'border-emerald-200 ', label: "Baik" };
        return { text: 'text-teal-700 ', bg: 'bg-teal-100 ', border: 'border-teal-200 ', label: "Sangat Baik" };
    };

    const getWeeklyWellnessColor = (score) => {
        if (!score && score !== 0) return { text: 'text-slate-500', bg: 'bg-slate-100 ', border: 'border-slate-300 ', label: 'N/A' };
        if (score <= 66) return { text: 'text-red-700 ', bg: 'bg-red-100 ', border: 'border-red-200 ', label: "Sangat Buruk" };
        if (score <= 90) return { text: 'text-orange-700 ', bg: 'bg-orange-100 ', border: 'border-orange-200 ', label: "Buruk" };
        if (score <= 114) return { text: 'text-amber-700 ', bg: 'bg-amber-100 ', border: 'border-amber-200 ', label: "Agak Buruk" };
        if (score <= 138) return { text: 'text-yellow-700 ', bg: 'bg-yellow-100 ', border: 'border-yellow-200 ', label: "Sedang" };
        if (score <= 162) return { text: 'text-sky-700 ', bg: 'bg-sky-100 ', border: 'border-sky-200 ', label: "Agak Baik" };
        if (score <= 186) return { text: 'text-emerald-700 ', bg: 'bg-emerald-100 ', border: 'border-emerald-200 ', label: "Baik" };
        return { text: 'text-teal-700 ', bg: 'bg-teal-100 ', border: 'border-teal-200 ', label: "Sangat Baik" };
    };

 return (
 <div className="space-y-6 pb-10 animate-in fade-in zoom-in-95 duration-300">
 <ExportModal 
 isOpen={isExportModalOpen} 
 onClose={() => setIsExportModalOpen(false)} 
 onExport={handleExportConfirm} 
 isExporting={isExporting}
 defaultTitle={`WELLNESS & ACWR REPORT`}
 defaultFilename={`Wellness_ACWR_${athleteWeeklyInfo?.name?.replace(/ /g, "_")}`}
 showSmartInsightsToggle={true}
 />

 {/* KONTROL NAVIGASI & PDF BUTTON */}
 <div className="flex items-center justify-between border-b border-slate-200  pb-4">
 {onBack ? (
 <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900  transition-colors py-2 px-1">
 <ArrowLeft size={16} />Back to Athlete Register</button>
 ) : <div />}

 <button 
 onClick={handleDownloadPdf}
 disabled={isExporting}
 className="flex items-center gap-2 px-4 py-2 bg-slate-900  text-white  rounded-lg text-xs font-bold hover:bg-slate-800  transition-colors shadow-sm disabled:opacity-50"
 >
 {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
 "Download PDF Report"
 </button>
 </div>

 {/* LOOPING UNTUK SETIAP MINGGU YANG ADA DI RIWAYAT */}
 <div className="space-y-6 bg-transparent">
 {athleteWeeklyInfo?.weekly_history?.map((week, idx) => {
 const chartData = [];
 const parts = week.start_date.split('-');
 
 for (let i = 0; i < 7; i++) {
 const currentDay = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
 currentDay.setDate(currentDay.getDate() + i);
 
 const yyyy = currentDay.getFullYear();
 const mm = String(currentDay.getMonth() + 1).padStart(2, '0');
 const dd = String(currentDay.getDate()).padStart(2, '0');
 const dateStr = `${yyyy}-${mm}-${dd}`;
 
 const dateLabel = `${currentDay.getDate()} ${currentDay.toLocaleDateString('id-ID', { month: 'short' })}`;
 const logData = week.logs?.[dateStr]; 
 
 chartData.push({
 dateStr: dateStr,
 dayName: currentDay.toLocaleDateString('id-ID', { weekday: 'long' }),
 dateLabel: dateLabel,
 load: logData ? parseFloat(logData.daily_load || 0) : 0,
 wellness: logData ? parseInt(logData.daily_wellness_score || 0) : 0,
 notes: logData?.notes || '-',
 amLoad: logData ? (parseFloat(logData.am_rpe || 0) * parseInt(logData.am_duration || 0)) : 0,
 pmLoad: logData ? (parseFloat(logData.pm_rpe || 0) * parseInt(logData.pm_duration || 0)) : 0,
 hasData: !!logData,
 rawData: logData
 });
 }

 const maxLoad = chartData.length > 0 ? Math.max(...chartData.map(d => d.load)) : 0;
 const validWellness = chartData.map(d => d.wellness).filter(w => w > 0);
 const minWellness = validWellness.length > 0 ? Math.min(...validWellness) : 0;

 return (
 <div key={week.week_number} className="bg-white  rounded-2xl shadow-sm border border-slate-200  overflow-hidden relative">
 
 {/* HEADER INFO PEMAIN & MINGGU */}
 <div className="px-6 py-4 border-b border-slate-200  bg-slate-50/80  flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
 
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-slate-200  flex items-center justify-center font-bold text-slate-500 text-sm  shrink-0 border border-slate-300 ">
 {athleteWeeklyInfo.position}
 </div>
 
 <div>
 <div className="flex flex-wrap items-center gap-2 mb-1">
 <h3 className="font-bold text-slate-900  text-base leading-none">
 {athleteWeeklyInfo.name}
 </h3>
 
 <div className="flex items-center gap-1.5">
 <span className="bg-slate-900 text-slate-100   px-4 py-1 rounded-md text-[10px] font-bold shadow-sm">
 "Week" {week.week_number}
 </span>
 
 {idx === 0 && (
 <span className="bg-slate-100 text-slate-700 border border-slate-200    px-4 py-1 rounded-md text-[10px] font-bold">Latest</span>
 )}
 </div>
 </div>
 
 <p className="text-[10px] text-slate-500 font-bold">
 "Period": {week.start_date} <span className="mx-1 text-slate-300 ">➔</span> {week.end_date}
 </p>
 </div>
 </div>
 
 <div className="bg-white  px-4 py-2 rounded-xl flex items-center gap-3 border border-slate-200  shadow-sm w-fit self-start sm:self-auto">
 <span className="text-[12px] font-bold text-slate-400 ">Weekly Wellness</span>
 <div className="h-5 w-px bg-slate-200 "></div>
 <div className="flex flex-col">
 <span className={`font-bold text-lg leading-none ${getWeeklyWellnessColor(week.weekly_wellness_score).text}`}>
 {week.weekly_wellness_score || 0} <span className="text-[10px] text-slate-400 font-bold">/ 196</span>
 </span>
 <span className={`text-[9px] font-bold ${getWeeklyWellnessColor(week.weekly_wellness_score).text} mt-0.5`}>
 {getWeeklyWellnessColor(week.weekly_wellness_score).label}
 </span>
 </div>
 </div>
 
 </div>
 
 {/* GRAFIK & HIGHLIGHTS */}
 <div className="p-6 border-b border-slate-200  grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pb-8 bg-white ">
 <div className="h-56 w-full" id={`chart-week-${week.week_number}`}>
 <h4 className="text-xs font-bold text-slate-400  text-center">Load vs Wellness (Daily)</h4>
 <ResponsiveContainer width="100%" height="100%">
 <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="" />
 <XAxis dataKey="dayName" tick={{fontSize: 10, fill: '#a1a1aa', fontWeight: 'bold'}} axisLine={false} tickLine={false} dy={5} />
 <YAxis yAxisId="left" tick={{fontSize: 10, fill: '#71717a', fontWeight: 'bold'}} axisLine={false} tickLine={false} dx={-5} />
 <YAxis yAxisId="right" orientation="right" tick={{fontSize: 10, fill: '#a1a1aa', fontWeight: 'bold'}} axisLine={false} tickLine={false} domain={[0,28]} dx={5} />
 <RechartsTooltip contentStyle={{ backgroundColor: '#09090b', color: '#fff', borderRadius: '8px', border: '1px solid #27272a', fontSize: '12px', fontWeight: 'bold' }} cursor={{fill: 'rgba(0,0,0,0.02)'}} />
 
 <Bar yAxisId="left" dataKey="load" name="Daily Load (AU)" fill="#27272a" radius={[4,4,0,0]} barSize={22} className="" />
 <Line yAxisId="right" type="monotone" dataKey="wellness" name="Wellness" stroke="#a1a1aa" strokeWidth={2.5} dot={{r: 3, strokeWidth: 2, fill: '#fff'}} />
 </ComposedChart>
 </ResponsiveContainer>
 </div>
 
 <div className="space-y-4">
 <div className="bg-slate-50  p-4 rounded-xl border border-slate-200  flex items-center justify-between">
 <div>
 <p className="text-[10px] font-bold text-slate-400 ">Peak Training Load</p>
 <p className="font-bold text-slate-700  text-xs mt-0.5">Day with Highest Load</p>
 </div>
 <span className="font-bold text-xl text-slate-900 ">{maxLoad} <span className="text-xs text-slate-400">AU</span></span>
 </div>
 <div className="bg-slate-50  p-4 rounded-xl border border-slate-200  flex items-center justify-between">
 <div>
 <p className="text-[10px] font-bold text-slate-400 ">Minimum Fitness</p>
 <p className="font-bold text-slate-700  text-xs mt-0.5">Day with Lowest Wellness</p>
 </div>
 <span className="font-bold text-xl text-slate-900 ">
 {minWellness} <span className="text-xs font-bold text-slate-400">/28</span>
 </span>
 </div>
 </div>
 </div>

 {/* TABEL DETAIL HARIAN */}
 <div className="overflow-x-auto w-full border-b border-slate-200 ">
 <table className="w-full text-left text-xs whitespace-nowrap">
 <thead className="bg-slate-50/50  border-b border-slate-200  text-slate-500 text-[9px] font-bold">
 <tr>
 <th className="px-6 py-4">Days</th>
 <th className="px-4 py-4 text-center">Wellness</th>
 <th className="px-4 py-4">Morning Session (AM)</th>
 <th className="px-4 py-4">Afternoon Session (PM)</th>
 <th className="px-4 py-4">Notes</th>
 <th className="px-4 py-4 text-center">Daily Load</th>
 <th className="px-6 py-4 text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 ">
 {chartData.map((day, dayIdx) => (
 <tr key={dayIdx} className="hover:bg-slate-50/40  transition-colors">
 <td className="px-6 py-3">
 <div className="font-bold text-slate-900  text-xs">{day.dayName}</div>
 <div className="text-[10px] text-slate-400 font-bold">{day.dateLabel}</div>
 </td>
 <td className="px-4 py-3 text-center">
 {day.wellness > 0 ? (
 <div className="flex flex-col items-center gap-1">
 <span className={`font-bold px-2.5 py-0.5 rounded text-[11px] border ${getDailyWellnessColor(day.wellness).bg} ${getDailyWellnessColor(day.wellness).text} ${getDailyWellnessColor(day.wellness).border}`}>
 {day.wellness}
 </span>
 <span className={`text-[9px] font-bold ${getDailyWellnessColor(day.wellness).text}`}>
 {getDailyWellnessColor(day.wellness).label}
 </span>
 </div>
 ) : <span className="text-slate-300 ">-</span>}
 </td>
 <td className="px-4 py-3">
 {day.amLoad > 0 ? (
 <div className="font-bold text-slate-700  text-xs">{day.amLoad} <span className="text-[9px] text-slate-400 font-normal">AU</span></div>
 ) : <span className="text-slate-300 ">-</span>}
 </td>
 <td className="px-4 py-3">
 {day.pmLoad > 0 ? (
 <div className="font-bold text-slate-700  text-xs">{day.pmLoad} <span className="text-[9px] text-slate-400 font-normal">AU</span></div>
 ) : <span className="text-slate-300 ">-</span>}
 </td>
 <td className="px-4 py-3 max-w-[200px] whitespace-normal">
 {day.notes !== '-' ? (
 <span className="text-[11px] text-slate-500  italic">{day.notes}</span>
 ) : <span className="text-slate-300 ">-</span>}
 </td>
 <td className="px-4 py-3 text-center">
 {day.load > 0 ? (
 <span className={`font-bold px-2.5 py-1 rounded text-xs border ${getDailyLoadBadgeClass(day.load)}`}>
 {day.load}
 </span>
 ) : <span className="text-slate-300 ">-</span>}
 </td>
 <td className="px-6 py-3 text-right">
 {!canModify ? (
 <button 
 onClick={() => setViewingEntry(day)}
 className="inline-flex items-center gap-1 bg-slate-900  text-slate-50  text-[10px] font-bold px-2.5 py-1 rounded hover:bg-slate-800  transition-colors"
 >
 <Eye size={10} />View</button>
 ) : (
 <Link 
 href={route('admin.wellness-rpe.show', { date: day.dateStr })}
 className="inline-flex items-center gap-1 bg-slate-900  text-slate-50  text-[10px] font-bold px-2.5 py-1 rounded hover:bg-slate-800  transition-colors"
 >
 {day.hasData ? <><Edit3 size={10} />Edit</> : <><Plus size={10} />Fill Data</>}
 </Link>
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* MONITORING METRICS */}
 <div className="bg-slate-800  p-6 text-slate-100 ">
 <div className="flex items-center gap-2 mb-4 opacity-70">
 <TrendingUp className="w-4 h-4 text-slate-100 " />
 <h4 className="text-xs text-slate-100  font-bold">"Load Metrics & Monitoring" ("Week" {week.week_number})</h4>
 </div>
 <div className="grid grid-cols-2 md:grid-cols-6 gap-y-6 gap-x-4 divide-x divide-slate-400 ">
 <div className="px-4 first:pl-0 border-none">
 <p className="text-[9px] font-bold text-slate-100  mb-1">Weekly Load</p>
 <p className="text-2xl text-slate-100 ">{week.weekly_load}</p>
 </div>
 <div className="px-4">
 <p className="text-[9px] font-bold text-slate-100  mb-1">ACWR Ratio</p>
 <p className={`text-2xl font-bold ${getAcwrBadgeClass(week.acwr)} px-2 py-0.5 rounded inline-block`}>
 {week.acwr > 0 ? week.acwr : <span className="text-slate-100  text-sm font-medium border-none bg-transparent">0.00</span>}
 </p>
 </div>
 <div className="px-4">
 <p className="text-[9px] font-bold text-slate-100  mb-1">Mean Daily Load</p>
 <p className="text-xl font-bold mt-1 text-slate-100 ">{week.mean_daily_load}</p>
 </div>
 <div className="px-4 border-none md:border-solid">
 <p className="text-[9px] font-bold text-slate-100  mb-1">Std Deviation</p>
 <p className="text-xl font-bold mt-1 text-slate-100 ">{week.standard_deviation}</p>
 </div>
 <div className="px-4">
 <p className="text-[9px] font-bold text-slate-100  mb-1">Monotony</p>
 <p className="text-xl font-bold mt-1 text-slate-100 ">{week.training_monotony}</p>
 </div>
 <div className="px-4">
 <p className="text-[9px] font-bold text-slate-100  mb-1">Strain</p>
 <p className="text-xl font-bold mt-1 text-slate-100 ">{week.strain}</p>
 </div>
 </div>
 </div>

 </div>
 );
 })}
 </div>
 {viewingEntry && (
 <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
 <div className="bg-white  border border-slate-200  w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
 <div className="p-6 border-b border-slate-200  bg-slate-50/50  flex justify-between items-center">
 <div>
 <h3 className="text-lg font-bold text-slate-900 ">Metric Details</h3>
 <p className="text-[11px] font-bold text-slate-500  mt-0.5">{viewingEntry.dayName}, {viewingEntry.dateLabel}</p>
 </div>
 <button onClick={() => setViewingEntry(null)} className="p-2 text-slate-500 hover:bg-slate-200    rounded-full transition-colors">
 <X size={20} />
 </button>
 </div>
 <div className="p-6 grid grid-cols-1 gap-3 overflow-y-auto">
 {!viewingEntry.hasData ? (
 <p className="text-sm text-slate-500 text-center py-4">No data for today.</p>
 ) : (
 <>
 <div className="font-bold text-sm text-slate-900  mb-2 border-b border-slate-200  pb-2">Wellness</div>
 <DetailRow label="Quality of Sleep" value={viewingEntry.rawData?.quality_of_sleep} />
 <DetailRow label="Fatigue" value={viewingEntry.rawData?.fatigue} />
 <DetailRow label="Muscle Soreness" value={viewingEntry.rawData?.muscle_soreness} />
 <DetailRow label="Stress" value={viewingEntry.rawData?.stress} />
 <DetailRow label="Motivation" value={viewingEntry.rawData?.motivation} />
 <DetailRow label="Health" value={viewingEntry.rawData?.health} />
 <DetailRow label="Mood State" value={viewingEntry.rawData?.mood_state} />
 <DetailRow label="Attitude to Study" value={viewingEntry.rawData?.attitude_to_study} />
 
 <div className="font-bold text-sm text-slate-900  mt-4 mb-2 border-b border-slate-200  pb-2">RPE (AM & PM)</div>
 <DetailRow label="AM RPE" value={viewingEntry.rawData?.am_rpe} unit="point" />
 <DetailRow label="AM Duration" value={viewingEntry.rawData?.am_duration} unit="min" />
 <DetailRow label="PM RPE" value={viewingEntry.rawData?.pm_rpe} unit="point" />
 <DetailRow label="PM Duration" value={viewingEntry.rawData?.pm_duration} unit="min" />
 </>
 )}
 </div>
 </div>
 </div>
 )}
 </div>
 );
}

const DetailRow = ({ label, value, unit = '' }) => (
 <div className="flex justify-between items-center py-2.5 border-b border-slate-100  last:border-0">
 <div className="flex items-center gap-2 text-xs font-bold text-slate-500  tracking-tighter">{label}</div>
 <div className="text-sm font-bold text-slate-900 ">
 {value !== null && value !== undefined && value !== '' ? value : '-'} 
 {unit && <span className="text-[10px] font-bold text-slate-400  ml-1">{unit}</span>}
 </div>
 </div>
);