import React, { useState } from "react";

import { Head, router, Link, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    CalendarDays,
    Check,
    Edit2,
    X,
    Calendar as CalendarIcon,
    ChevronRight,
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
                                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
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
                                            new Date()
                                                .toISOString()
                                                .split("T")[0];
                                        const targetRoute = route("admin.wellness-rpe.athlete.date.show", {
                                            user: athlete.id,
                                            date: day.date,
                                        });

                                        return (
                                            <Link
                                                key={day.date}
                                                href={targetRoute}
                                                className={`group flex flex-col justify-between p-3 bg-white  border rounded-xl hover:shadow-md transition-all cursor-pointer relative overflow-hidden
 ${
     isToday
         ? "border-[#ff4d00] shadow-[0_0_15px_rgba(255,77,0,0.15)] ring-1 ring-[#ff4d00]/50 bg-orange-50/10"
         : "border-slate-200  hover:border-[#ff4d00]/50 "
 }
 `}
                                            >
                                                {/* Today Badge */}
                                                {isToday && (
                                                    <div className="absolute top-0 right-0 w-8 h-8 bg-orange-50  rounded-bl-full flex items-start justify-end p-1.5">
                                                        <div className="w-2 h-2 rounded-full bg-[#ff4d00] animate-pulse"></div>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between mb-4">
                                                    <span
                                                        className={`text-[10px] font-bold 
 ${isToday ? "text-[#ff4d00]" : "text-slate-400 "}
 `}
                                                    >
                                                        {day.day_name}
                                                    </span>
                                                    <ChevronRight
                                                        size={14}
                                                        className={`transition-transform group-hover:translate-x-1 ${isToday ? "text-[#ff4d00]" : "text-slate-300 group-hover:text-[#ff4d00]"}`}
                                                    />
                                                </div>
                                                <h5
                                                    className={`text-xs font-bold ${isToday ? "text-slate-900" : "text-slate-900"}`}
                                                >
                                                    {day.formatted_date}
                                                </h5>
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
