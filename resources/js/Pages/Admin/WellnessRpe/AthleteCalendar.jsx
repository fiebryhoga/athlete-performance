import React from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/Common/PageHeader";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    CheckCircle2,
    Flame,
    HeartPulse,
} from "lucide-react";

export default function AthleteCalendar({
    auth,
    athlete,
    season_start_date,
    calendarWeeks = [],
}) {
    // Format date function for header (prevents timezone bug)
    const formatHeaderDate = (dateString) => {
        if (!dateString) return "-";
        const baseDate = dateString.split('T')[0];
        const [year, month, day] = baseDate.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return date.toLocaleDateString('id-ID', {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <AppLayout
            user={auth.user}
            title={`Kalender Wellness - ${athlete.name}`}
        >
            <Head title={`Kalender ${athlete.name}`} />

            <div className="space-y-4 pb-16">
                {/* ─── 1. PAGE HEADER ─── */}
                <PageHeader 
                    title={`Kalender Wellness: ${athlete.name}`}
                    description="Pantau data beban latihan (RPE) dan skor wellness harian atlet ini."
                    actions={
                        <div className="flex items-center gap-2">
                            <Link
                                href={route("admin.wellness-rpe.index")}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs"
                            >
                                <ChevronLeft size={14} />
                                <span>Daftar Atlet</span>
                            </Link>

                            {season_start_date && (
                                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-md text-xs font-medium text-slate-600">
                                    <CalendarIcon size={13} className="text-slate-400" />
                                    <span>Mulai: {formatHeaderDate(season_start_date)}</span>
                                </span>
                            )}
                        </div>
                    }
                />

                {/* ─── 2. TABS NAVIGATION ─── */}
                <div className="flex items-center gap-1.5 border-b border-slate-200/80 pb-2.5">
                    <div className="px-3.5 py-1.5 rounded-md text-xs font-bold text-white bg-orange-500 shadow-2xs flex items-center gap-1.5 cursor-default">
                        <CalendarIcon size={13} />
                        <span>Kalender Harian</span>
                    </div>
                    <Link
                        href={route('admin.wellness-rpe.athlete.analysis', athlete.id)}
                        className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                        <TrendingUp size={13} className="text-slate-400" />
                        <span>Analisis ACWR</span>
                    </Link>
                </div>

                {/* ─── 3. WEEKLY CALENDAR LIST ─── */}
                <div className="space-y-4">
                    {calendarWeeks.map((week) => (
                        <div key={week.week_number} className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden">
                            {/* Week Header */}
                            <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                        Week {week.week_number}
                                    </h4>
                                    <span className="px-2 py-0.5 rounded bg-white text-[10.5px] font-bold text-slate-500 border border-slate-200 shadow-2xs">
                                        {week.week_range}
                                    </span>
                                </div>
                            </div>

                            {/* 7 Days Grid (Mon – Sun) */}
                            <div className="p-3 sm:p-3.5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                                {week.days.map((day) => {
                                    const isToday =
                                        day.date ===
                                        new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split("T")[0];
                                    
                                    const targetRoute = route("admin.wellness-rpe.athlete.date.show", {
                                        user: athlete.id,
                                        date: day.date,
                                    });

                                    const dateParts = day.formatted_date ? day.formatted_date.split(' ') : [day.date, ''];
                                    const dayNum = dateParts[0];
                                    const monthName = dateParts[1] || '';

                                    return (
                                        <Link
                                            key={day.date}
                                            href={targetRoute}
                                            className={`group relative flex flex-col justify-between p-3 rounded-md border transition-all cursor-pointer ${
                                                isToday 
                                                    ? "bg-orange-50/20 border-orange-500 shadow-2xs ring-1 ring-orange-500/30" 
                                                    : "bg-slate-50/40 border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-2xs"
                                            }`}
                                        >
                                            {/* Top: Day Name + Date Number */}
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-[10px] font-black uppercase tracking-wider ${isToday ? "text-orange-600" : "text-slate-400"}`}>
                                                        {day.day_name}
                                                    </span>
                                                    {day.has_data ? (
                                                        <CheckCircle2 size={13} className="text-emerald-500" />
                                                    ) : (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                                    )}
                                                </div>

                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-base sm:text-lg font-black text-slate-900 leading-none">
                                                        {dayNum}
                                                    </span>
                                                    <span className="text-[11px] font-bold text-slate-500">
                                                        {monthName}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Bottom: Metrics or Empty */}
                                            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                                                {day.has_data ? (
                                                    <div className="flex items-center gap-1.5 text-[10.5px]">
                                                        {day.daily_load ? (
                                                            <span className="inline-flex items-center gap-0.5 font-bold text-orange-700 bg-orange-50 px-1 py-0.2 rounded border border-orange-200">
                                                                <Flame size={10} className="text-orange-500" />
                                                                {day.daily_load}
                                                            </span>
                                                        ) : null}
                                                        {day.wellness_score ? (
                                                            <span className="inline-flex items-center gap-0.5 font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                                                                <HeartPulse size={10} className="text-emerald-500" />
                                                                {day.wellness_score}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] font-medium text-slate-400">
                                                        Belum ada data
                                                    </span>
                                                )}

                                                <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-orange-600 group-hover:border-orange-200 transition-colors shrink-0">
                                                    <ChevronRight size={11} />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
