import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import {
    Calendar as CalendarIcon,
    TrendingUp,
    Eye,
    Edit3,
    Plus,
    X,
    Activity,
    LineChart
} from "lucide-react";

export default function AthleteAnalysis({
    auth,
    athlete,
    weeklyData
}) {
    const [viewingEntry, setViewingEntry] = useState(null);

    const getAcwrBadgeClass = (acwr) => {
        if (!acwr || acwr === 0) return 'text-slate-400 bg-transparent';
        if (acwr < 0.8) return 'text-orange-500 font-black';
        if (acwr >= 0.8 && acwr <= 1.3) return 'text-emerald-500 font-black';
        if (acwr > 1.3 && acwr <= 1.5) return 'text-yellow-500 font-black';
        return 'text-red-600 font-black';
    };

    const getDailyLoadBadgeClass = (val) => {
        if (!val || val === 0) return 'text-slate-900 bg-slate-100 border-slate-200';
        if (val < 1500) return 'text-emerald-700 bg-emerald-100 border-emerald-200';
        if (val <= 3000) return 'text-amber-700 bg-amber-100 border-amber-200';
        return 'text-red-700 bg-red-100 border-red-200';
    };

    const getDailyWellnessColor = (score) => {
        if (!score && score !== 0) return { text: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-300', label: 'N/A' };
        if (score <= 9) return { text: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200', label: "Sangat Buruk" };
        if (score <= 13) return { text: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-200', label: "Buruk" };
        if (score <= 16) return { text: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-200', label: "Agak Buruk" };
        if (score <= 19) return { text: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-200', label: "Sedang" };
        if (score <= 23) return { text: 'text-sky-700', bg: 'bg-sky-100', border: 'border-sky-200', label: "Agak Baik" };
        if (score <= 27) return { text: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-200', label: "Baik" };
        return { text: 'text-teal-700', bg: 'bg-teal-100', border: 'border-teal-200', label: "Sangat Baik" };
    };

    return (
        <AppLayout
            user={auth.user}
            headerTitle={`Analisis ACWR: ${athlete.name}`}
            headerDescription="Pantau data historis dan analisis beban latihan atlet."
        >
            <Head title={`Analisis ${athlete.name}`} />

            <div className="pb-12 space-y-6">
                <PageHeader 
                    title={`Analisis ACWR: ${athlete.name}`}
                    subtitle="Evaluasi data wellness mingguan, riwayat RPE harian, dan metrik monitoring."
                    badge="Analytics"
                    icon={LineChart}
                />

                {/* TABS NAVIGATION */}
                <div className="flex items-center gap-2 border-b border-slate-200 mb-6 pb-4">
                    <Link
                        href={route('admin.wellness-rpe.athlete.show', athlete.id)}
                        className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center gap-2"
                    >
                        <CalendarIcon size={16} />
                        Kalender Harian
                    </Link>
                    <div className="px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#ff4d00] shadow-md shadow-[#ff4d00]/20 flex items-center gap-2 cursor-default">
                        <TrendingUp size={16} />
                        Analisis ACWR
                    </div>
                </div>

                <div className="space-y-8 animate-in fade-in duration-300">
                    {weeklyData && weeklyData.length > 0 ? weeklyData.map((week, idx) => (
                        <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                            {/* Header per minggu */}
                            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-[#ff4d00]/10 flex items-center justify-center text-[#ff4d00] font-black text-xs">
                                        W{week.week_number}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">Minggu Ke-{week.week_number}</h3>
                                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">{week.start_date} s/d {week.end_date}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Table harian */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4">Hari</th>
                                            <th className="px-4 py-4 text-center">Wellness</th>
                                            <th className="px-4 py-4 text-center">AM Load</th>
                                            <th className="px-4 py-4 text-center">PM Load</th>
                                            <th className="px-4 py-4 text-center">Daily Load</th>
                                            <th className="px-6 py-4 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {week.chartData.map((day, dayIdx) => (
                                            <tr key={dayIdx} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="px-6 py-3">
                                                    <div className="font-bold text-slate-900 text-xs">{day.dayName}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold">{day.dateLabel}</div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {day.wellness > 0 ? (
                                                        <div className="flex flex-col items-center gap-1">
                                                            <span className={`font-black px-2.5 py-0.5 rounded text-[11px] border ${getDailyWellnessColor(day.wellness).bg} ${getDailyWellnessColor(day.wellness).text} ${getDailyWellnessColor(day.wellness).border}`}>
                                                                {day.wellness}
                                                            </span>
                                                            <span className={`text-[9px] font-bold ${getDailyWellnessColor(day.wellness).text}`}>
                                                                {getDailyWellnessColor(day.wellness).label}
                                                            </span>
                                                        </div>
                                                    ) : <span className="text-slate-300">-</span>}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {day.amLoad > 0 ? (
                                                        <div className="font-bold text-slate-700 text-xs">{day.amLoad} <span className="text-[9px] text-slate-400 font-normal">AU</span></div>
                                                    ) : <span className="text-slate-300">-</span>}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {day.pmLoad > 0 ? (
                                                        <div className="font-bold text-slate-700 text-xs">{day.pmLoad} <span className="text-[9px] text-slate-400 font-normal">AU</span></div>
                                                    ) : <span className="text-slate-300">-</span>}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {day.load > 0 ? (
                                                        <span className={`font-black px-2.5 py-1 rounded text-xs border ${getDailyLoadBadgeClass(day.load)}`}>
                                                            {day.load}
                                                        </span>
                                                    ) : <span className="text-slate-300">-</span>}
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    <Link 
                                                        href={route('admin.wellness-rpe.athlete.date.show', { user: athlete.id, date: day.dateStr })}
                                                        className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold px-2.5 py-1.5 rounded hover:bg-slate-50 transition-colors shadow-sm"
                                                    >
                                                        {day.hasData ? <><Eye size={12} /> Detail</> : <><Plus size={12} /> Isi</>}
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Monitoring Metrics Block */}
                            <div className="bg-slate-50 p-6 text-slate-900 border-t border-slate-200 relative overflow-hidden">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-[#ff4d00] opacity-5 rounded-bl-full pointer-events-none"></div>
                                <div className="flex items-center gap-2 mb-6">
                                    <Activity className="w-5 h-5 text-[#ff4d00]" />
                                    <h4 className="text-sm font-bold tracking-tight text-slate-900">Load Metrics & Monitoring</h4>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-6 gap-y-6 gap-x-4">
                                    <div className="px-2 md:px-4 md:border-r border-slate-200 last:border-0">
                                        <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Weekly Load</p>
                                        <p className="text-2xl font-black text-slate-900">{week.weekly_load}</p>
                                    </div>
                                    <div className="px-2 md:px-4 md:border-r border-slate-200 last:border-0">
                                        <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">ACWR Ratio</p>
                                        <p className={`text-2xl font-black ${getAcwrBadgeClass(week.acwr)} inline-block`}>
                                            {week.acwr > 0 ? week.acwr : <span className="text-slate-400 text-lg">0.00</span>}
                                        </p>
                                    </div>
                                    <div className="px-2 md:px-4 md:border-r border-slate-200 last:border-0">
                                        <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Mean Daily Load</p>
                                        <p className="text-xl font-bold mt-1 text-slate-700">{week.mean_daily_load}</p>
                                    </div>
                                    <div className="px-2 md:px-4 md:border-r border-slate-200 last:border-0">
                                        <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Std Deviation</p>
                                        <p className="text-xl font-bold mt-1 text-slate-700">{week.standard_deviation}</p>
                                    </div>
                                    <div className="px-2 md:px-4 md:border-r border-slate-200 last:border-0">
                                        <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Monotony</p>
                                        <p className="text-xl font-bold mt-1 text-[#ff4d00]">{week.training_monotony}</p>
                                    </div>
                                    <div className="px-2 md:px-4 md:border-r border-slate-200 last:border-0">
                                        <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Strain</p>
                                        <p className="text-xl font-bold mt-1 text-red-500">{week.strain}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <Activity className="mx-auto h-12 w-12 text-slate-300" />
                            <h3 className="mt-4 text-sm font-bold text-slate-900">Belum ada riwayat</h3>
                            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                                Analisis beban mingguan akan muncul di sini setelah atlet memiliki setidaknya satu log latihan mingguan.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
