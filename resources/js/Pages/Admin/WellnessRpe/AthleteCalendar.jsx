import React, { useState } from "react";

import { Head, router, Link, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    CalendarDays,
    Check,
    Edit2,
    Calendar as CalendarIcon,
    ChevronRight,
    TrendingUp,
    CheckCircle2,
} from "lucide-react";
import PageHeader from "@/Components/Layout/PageHeader";

export default function AthleteCalendar({
    auth,
    athlete,
    season_start_date,
    calendarWeeks,
}) {
    // Format date function for header (prevents H-1 timezone bug)
    const formatHeaderDate = (dateString) => {
        if (!dateString) return "-";
        
        // Remove timezone or time parts if they exist before appending our own
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
            headerTitle={`Wellness Kalender: ${athlete.name}`}
            headerDescription="Pantau data harian spesifik untuk athlete ini."
        >
            <Head title={`Kalender ${athlete.name}`} />

            <div className="pb-12 space-y-6">
                <PageHeader 
                    title={`Kalender Wellness: ${athlete.name}`}
                    subtitle="Pantau data latihan dan wellness harian spesifik untuk athlete ini."
                    badge="Timeline"
                    icon={CalendarIcon}
                    actions={
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                                    Weekly Calendar
                                </h1>
                                <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
                                    <CalendarIcon size={14} /> Kalender dibuat otomatis dari data pertama.
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-slate-900">
                                    {formatHeaderDate(season_start_date)}
                                </span>
                            </div>
                        </div>
                    }
                />

                {/* TABS NAVIGATION */}
                <div className="flex items-center gap-2 border-b border-slate-200 mb-6 pb-4">
                    <div className="px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#ff4d00] shadow-md shadow-[#ff4d00]/20 flex items-center gap-2 cursor-default">
                        <CalendarIcon size={16} />
                        Kalender Harian
                    </div>
                    <Link
                        href={route('admin.wellness-rpe.athlete.analysis', athlete.id)}
                        className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center gap-2"
                    >
                        <TrendingUp size={16} />
                        Analisis ACWR
                    </Link>
                </div>

                {/* 2. WEEKLY CALENDAR LIST */}
                <div className="space-y-8">
                        {calendarWeeks.map((week) => (
                            <div key={week.week_number} className="space-y-3">
                                {/* Header Per Sunday */}
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200  pb-2">
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-sm font-bold text-slate-900  tracking-tight">
                                            Week {week.week_number}
                                        </h4>
                                        <span className="px-2 py-0.5 rounded bg-slate-100  text-[10px] font-bold text-slate-500 border border-slate-200 ">
                                            {week.week_range}
                                        </span>
                                    </div>
                                </div>
                                {/* Grid 7 Days (Monday - Sunday) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                                    {week.days.map((day) => {
                                        // Pengecekan apakah hari ini
                                        const isToday =
                                            day.date ===
                                            new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split("T")[0];
                                        const targetRoute = route("admin.wellness-rpe.athlete.date.show", {
                                            user: athlete.id,
                                            date: day.date,
                                        });

                                        return (
                                            <Link
                                                key={day.date}
                                                href={targetRoute}
                                                className={`group relative overflow-hidden flex flex-col justify-between p-4 bg-white border rounded-xl hover:shadow-md transition-all cursor-pointer ${
                                                    isToday 
                                                    ? "border-[#ff4d00] ring-1 ring-[#ff4d00]/30 shadow-[0_4px_12px_rgba(255,77,0,0.1)]" 
                                                    : "border-slate-200 hover:border-[#ff4d00]/50"
                                                }`}
                                            >
                                                {isToday && (
                                                    <div className="absolute top-0 right-0 w-8 h-8 bg-orange-50 rounded-bl-full flex items-start justify-end p-1.5 z-10">
                                                        <div className="w-2 h-2 rounded-full bg-[#ff4d00] animate-pulse"></div>
                                                    </div>
                                                )}

                                                <div className="flex flex-col gap-1 mb-4 z-10">
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? "text-[#ff4d00]" : "text-slate-400"}`}>
                                                            {day.day_name}
                                                        </span>
                                                        {day.has_data ? (
                                                            <CheckCircle2 size={14} className="text-emerald-500" />
                                                        ) : (
                                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                                                        )}
                                                    </div>
                                                    <h5 className={`text-base font-bold tracking-tight ${isToday ? "text-slate-900" : "text-slate-900"}`}>
                                                        {day.formatted_date.split(' ')[0]} <span className="font-bold text-sm text-slate-500">{day.formatted_date.split(' ')[1]}</span>
                                                    </h5>
                                                </div>

                                                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between z-10">
                                                    {day.has_data ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Load</span>
                                                                <span className="text-[13px] font-bold text-slate-700">{day.daily_load}</span>
                                                            </div>
                                                            <div className="w-[1px] h-5 bg-slate-200"></div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Wlns</span>
                                                                <span className="text-[13px] font-bold text-slate-700">{day.wellness_score}</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] font-medium text-slate-400 italic">Belum ada data</span>
                                                    )}
                                                    <div className="h-6 w-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#ff4d00] group-hover:text-white text-slate-400 transition-colors shrink-0">
                                                        <ChevronRight size={12} />
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
