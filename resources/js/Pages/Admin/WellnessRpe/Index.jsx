import React, { useState } from "react";

import { Head, router, Link, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    CalendarDays,
    Check,
    Edit2,
    X,
    Calendar as CalendarIcon,
    ChevronRight,
} from "lucide-react";

export default function WellnessCalendarIndex({
    auth,
    season_start_date,
    calendarWeeks,
}) {
    
    // PENGAMAN: Cek apakah start date valid (tidak null, tidak kosong, dan bukan 1970)
    const isDateValid =
        season_start_date && !season_start_date.includes("1970");

    // Jika tidak valid, langsung mode edit. Jika valid, mode view.
    const [isEditingDate, setIsEditingDate] = useState(!isDateValid);
    const [tempDate, setTempDate] = useState(
        isDateValid ? season_start_date : "",
    );

    const { permissions } = usePage().props;
    const canModify =
        permissions?.wellness?.create || permissions?.wellness?.update;

    // Format date function for header (prevents H-1 timezone bug)
    const formatHeaderDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString + "T00:00:00");
        return date.toLocaleDateString('id-ID', {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const saveStartDate = () => {
        if (!tempDate) return;
        router.post(
            route("admin.wellness-rpe.updateStartDate"),
            { season_start_date: tempDate },
            {
                preserveScroll: true,
                onSuccess: () => setIsEditingDate(false),
            },
        );
    };

    return (
        <AdminLayout
            user={auth.user}
            headerTitle="Wellness & RPE Calendar"
            headerDescription="Manage team training calendar and monitor athlete performance metric logs."
        >
            <Head title="Wellness Calendar" />

            <div className="w-full pb-20 space-y-6">
                {/* 1. DATE CONTROL HEADER (Select Start of Season) */}
                <div className="bg-white  border border-zinc-200  rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <CalendarIcon
                            size={18}
                            className="text-zinc-400 "
                        />
                        <span className="text-xs font-black text-zinc-500 ">
                            "Start of Season"
                        </span>
                    </div>

                    {isEditingDate ? (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <input
                                type="date"
                                value={tempDate}
                                onChange={(e) => setTempDate(e.target.value)}
                                className="w-full sm:w-auto bg-transparent border border-zinc-200  text-zinc-900  text-xs font-bold rounded-lg py-2 px-3 focus:ring-1 focus:ring-zinc-500 outline-none "
                            />
                            <button
                                onClick={saveStartDate}
                                className="p-2.5 bg-zinc-600 hover:bg-zinc-700 text-white rounded-lg shadow-sm transition-colors"
                                title="Save Date"
                            >
                                <Check size={14} strokeWidth={3} />
                            </button>
                            {isDateValid && (
                                <button
                                    onClick={() => {
                                        setIsEditingDate(false);
                                        setTempDate(season_start_date);
                                    }}
                                    className="p-2.5 bg-zinc-100  hover:bg-zinc-200  text-zinc-500 rounded-lg border border-zinc-200  transition-colors"
                                    title="Cancel"
                                >
                                    <X size={14} strokeWidth={2.5} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-zinc-900 ">
                                {formatHeaderDate(season_start_date)}
                            </span>
                            {canModify && (
                                <button
                                    onClick={() => setIsEditingDate(true)}
                                    className="p-2 text-zinc-500 hover:text-zinc-600 bg-zinc-50  hover:bg-zinc-50  rounded-lg border border-zinc-200  shadow-sm transition-all"
                                    title="Edit Start Date"
                                >
                                    <Edit2 size={12} strokeWidth={2.5} />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* 2. WEEKLY CALENDAR LIST */}
                {!isDateValid ? (
                    // View If Start Date Not Set
                    <div className="flex flex-col items-center justify-center py-24 border border-dashed border-zinc-300  rounded-xl bg-zinc-50/50  text-zinc-400">
                        <div className="p-4 bg-white  rounded-full shadow-sm border border-zinc-200  mb-4">
                            <CalendarDays
                                size={32}
                                className="text-zinc-300 "
                            />
                        </div>
                        <h3 className="text-base font-black text-zinc-900  tracking-tight">
                            "Timeline Inactive"
                        </h3>
                        <p className="text-xs font-medium text-zinc-500 max-w-sm text-center mt-1.5">
                            Set the "Start of Season" date in the top panel to automatically generate the weekly calendar.
                        </p>
                    </div>
                ) : (
                    // View If Start Date Is Set
                    <div className="space-y-8">
                        {calendarWeeks.map((week) => (
                            <div key={week.week_number} className="space-y-3">
                                {/* Header Per Sunday */}
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200  pb-2">
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-sm font-black text-zinc-900  tracking-tight">
                                            "Week" {week.week_number}
                                        </h4>
                                        <span className="px-2 py-0.5 rounded bg-zinc-100  text-[10px] font-bold text-zinc-500 border border-zinc-200 ">
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
                                        const targetRoute =
                                            auth.user.role === "athlete"
                                                ? route(
                                                      "admin.wellness-rpe.session-form",
                                                      { date: day.date },
                                                  )
                                                : route("admin.wellness-rpe.show", {
                                                      date: day.date,
                                                  });

                                        return (
                                            <Link
                                                key={day.date}
                                                href={targetRoute}
                                                className={`group flex flex-col justify-between p-3 bg-white  border rounded-xl hover:shadow-md transition-all cursor-pointer relative overflow-hidden
 ${
     isToday
         ? "border-zinc-500  shadow-[0_0_15px_rgba(99,102,241,0.15)] ring-1 ring-zinc-500/50"
         : "border-zinc-200  hover:border-zinc-400 "
 }
 `}
                                            >
                                                {/* Today Badge */}
                                                {isToday && (
                                                    <div className="absolute top-0 right-0 w-8 h-8 bg-zinc-50  rounded-bl-full flex items-start justify-end p-1.5">
                                                        <div className="w-2 h-2 rounded-full bg-zinc-500 animate-pulse"></div>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between mb-4">
                                                    <span
                                                        className={`text-[10px] font-black 
 ${isToday ? "text-zinc-600 " : "text-zinc-400 "}
 `}
                                                    >
                                                        {day.day_name}
                                                    </span>
                                                    <ChevronRight
                                                        size={14}
                                                        className="text-zinc-300  group-hover:text-zinc-500  transition-transform group-hover:translate-x-1"
                                                    />
                                                </div>
                                                <h5
                                                    className={`text-xs font-bold ${isToday ? "text-zinc-900 " : "text-zinc-900 "}`}
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
                )}
            </div>
        </AdminLayout>
    );
}
