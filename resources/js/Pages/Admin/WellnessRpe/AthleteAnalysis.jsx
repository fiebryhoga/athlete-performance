import React from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/Common/PageHeader";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    TrendingUp,
    Eye,
    Plus,
    Activity,
} from "lucide-react";

export default function AthleteAnalysis({
    auth,
    athlete,
    weeklyData = []
}) {
    const getAcwrBadgeClass = (acwr) => {
        if (!acwr || acwr === 0) return 'text-slate-400 font-semibold';
        if (acwr < 0.8) return 'text-orange-600 font-black';
        if (acwr >= 0.8 && acwr <= 1.3) return 'text-emerald-600 font-black';
        if (acwr > 1.3 && acwr <= 1.5) return 'text-amber-600 font-black';
        return 'text-rose-600 font-black';
    };

    const getDailyLoadBadgeClass = (val) => {
        if (!val || val === 0) return 'text-slate-700 bg-slate-100 border-slate-200';
        if (val < 1500) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
        if (val <= 3000) return 'text-amber-700 bg-amber-50 border-amber-200';
        return 'text-rose-700 bg-rose-50 border-rose-200';
    };

    const getDailyWellnessColor = (score) => {
        if (!score && score !== 0) return { text: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-300', label: 'N/A' };
        if (score <= 9) return { text: 'text-emerald-800', bg: 'bg-emerald-100', border: 'border-emerald-200', label: "Sangat Baik" };
        if (score <= 13) return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', label: "Baik" };
        if (score <= 17) return { text: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200', label: "Agak Baik" };
        if (score <= 20) return { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', label: "Sedang" };
        if (score <= 23) return { text: 'text-amber-800', bg: 'bg-amber-100', border: 'border-amber-300', label: "Agak Buruk" };
        if (score <= 27) return { text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', label: "Buruk" };
        return { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', label: "Sangat Buruk" };
    };

    return (
        <AppLayout
            user={auth.user}
            title={`Analisis ACWR - ${athlete.name}`}
        >
            <Head title={`Analisis ${athlete.name}`} />

            <div className="space-y-4 pb-16">
                {/* ─── 1. PAGE HEADER ─── */}
                <PageHeader 
                    title={`Analisis ACWR: ${athlete.name}`}
                    description="Evaluasi data beban latihan mingguan (Acute:Chronic Workload Ratio), monotoni, dan strain."
                    actions={
                        <Link
                            href={route("admin.wellness-rpe.athlete.show", athlete.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs"
                        >
                            <ChevronLeft size={14} />
                            <span>Kembali ke Kalender</span>
                        </Link>
                    }
                />

                {/* ─── 2. TABS NAVIGATION ─── */}
                <div className="flex items-center gap-1.5 border-b border-slate-200/80 pb-2.5">
                    <Link
                        href={route('admin.wellness-rpe.athlete.show', athlete.id)}
                        className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                        <CalendarIcon size={13} className="text-slate-400" />
                        <span>Kalender Harian</span>
                    </Link>
                    <div className="px-3.5 py-1.5 rounded-md text-xs font-bold text-white bg-orange-500 shadow-2xs flex items-center gap-1.5 cursor-default">
                        <TrendingUp size={13} />
                        <span>Analisis ACWR</span>
                    </div>
                </div>

                {/* ─── 3. WEEKLY DATA & ACWR MONITORING ─── */}
                <div className="space-y-4">
                    {weeklyData && weeklyData.length > 0 ? weeklyData.map((week, idx) => (
                        <div key={idx} className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
                            {/* Header per minggu */}
                            <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                        Minggu Ke-{week.week_number}
                                    </h4>
                                    <span className="px-2 py-0.5 rounded bg-white text-[10.5px] font-bold text-slate-500 border border-slate-200 shadow-2xs">
                                        {week.start_date} s/d {week.end_date}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Table harian */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs whitespace-nowrap">
                                    <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                                        <tr>
                                            <th className="px-4 py-2.5">Hari</th>
                                            <th className="px-3 py-2.5 text-center">Wellness</th>
                                            <th className="px-3 py-2.5 text-center">AM Load</th>
                                            <th className="px-3 py-2.5 text-center">PM Load</th>
                                            <th className="px-3 py-2.5 text-center">Daily Load</th>
                                            <th className="px-4 py-2.5 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs">
                                        {week.chartData.map((day, dayIdx) => (
                                            <tr key={dayIdx} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-4 py-2.5">
                                                    <div className="font-bold text-slate-900">{day.dayName}</div>
                                                    <div className="text-[10px] text-slate-400 font-medium">{day.dateLabel}</div>
                                                </td>
                                                <td className="px-3 py-2.5 text-center">
                                                    {day.wellness > 0 ? (
                                                        <div className="inline-flex items-center gap-1">
                                                            <span className={`font-bold px-2 py-0.5 rounded text-[10.5px] border ${getDailyWellnessColor(day.wellness).bg} ${getDailyWellnessColor(day.wellness).text} ${getDailyWellnessColor(day.wellness).border}`}>
                                                                {day.wellness} ({getDailyWellnessColor(day.wellness).label})
                                                            </span>
                                                        </div>
                                                    ) : <span className="text-slate-300">-</span>}
                                                </td>
                                                <td className="px-3 py-2.5 text-center font-bold text-slate-700">
                                                    {day.amLoad > 0 ? `${day.amLoad} AU` : <span className="text-slate-300">-</span>}
                                                </td>
                                                <td className="px-3 py-2.5 text-center font-bold text-slate-700">
                                                    {day.pmLoad > 0 ? `${day.pmLoad} AU` : <span className="text-slate-300">-</span>}
                                                </td>
                                                <td className="px-3 py-2.5 text-center">
                                                    {day.load > 0 ? (
                                                        <span className={`font-bold px-2 py-0.5 rounded text-[11px] border ${getDailyLoadBadgeClass(day.load)}`}>
                                                            {day.load} AU
                                                        </span>
                                                    ) : <span className="text-slate-300">-</span>}
                                                </td>
                                                <td className="px-4 py-2.5 text-right">
                                                    <Link 
                                                        href={route('admin.wellness-rpe.athlete.date.show', { user: athlete.id, date: day.dateStr })}
                                                        className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-2 py-1 rounded-md hover:bg-slate-50 transition-colors shadow-2xs"
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
                            <div className="bg-slate-50/70 p-3.5 sm:p-4 border-t border-slate-100">
                                <div className="flex items-center gap-1.5 mb-3">
                                    <Activity className="w-4 h-4 text-orange-500" />
                                    <h4 className="text-xs font-bold text-slate-900">Metrik Beban & Monitoring ACWR</h4>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                                    <div className="bg-white border border-slate-200/80 rounded-md p-2.5">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weekly Load</p>
                                        <p className="text-base font-black text-slate-900 mt-0.5">{week.weekly_load} <span className="text-[10px] font-medium text-slate-400">AU</span></p>
                                    </div>
                                    <div className="bg-white border border-slate-200/80 rounded-md p-2.5">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rasio ACWR</p>
                                        <p className={`text-base mt-0.5 ${getAcwrBadgeClass(week.acwr)}`}>
                                            {week.acwr > 0 ? week.acwr : '0.00'}
                                        </p>
                                    </div>
                                    <div className="bg-white border border-slate-200/80 rounded-md p-2.5">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rata-rata Load</p>
                                        <p className="text-base font-bold text-slate-800 mt-0.5">{week.mean_daily_load} <span className="text-[10px] font-medium text-slate-400">AU</span></p>
                                    </div>
                                    <div className="bg-white border border-slate-200/80 rounded-md p-2.5">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Std Deviation</p>
                                        <p className="text-base font-bold text-slate-800 mt-0.5">{week.standard_deviation}</p>
                                    </div>
                                    <div className="bg-white border border-slate-200/80 rounded-md p-2.5">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monotony</p>
                                        <p className="text-base font-bold text-orange-600 mt-0.5">{week.training_monotony}</p>
                                    </div>
                                    <div className="bg-white border border-slate-200/80 rounded-md p-2.5">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Strain</p>
                                        <p className="text-base font-bold text-rose-600 mt-0.5">{week.strain}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-12 bg-white rounded-md border border-slate-200/80 p-8 shadow-2xs space-y-2">
                            <Activity className="mx-auto h-8 w-8 text-slate-300" />
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900">Belum Ada Riwayat Latihan</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                Analisis beban mingguan akan otomatis muncul setelah atlet mengisi log latihan.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
