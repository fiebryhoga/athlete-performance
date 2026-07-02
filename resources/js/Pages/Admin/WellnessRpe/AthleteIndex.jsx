import React from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Calendar, CheckCircle2, Circle, ChevronRight, Activity } from "lucide-react";

export default function AthleteIndex({ auth, days }) {
    return (
        <AppLayout
            user={auth.user}
            headerTitle="Wellness & RPE"
            headerDescription="Isi form wellness dan RPE harian Anda."
        >
            <Head title="Wellness & RPE" />

            <div className="pb-12 space-y-6">
                <PageHeader 
                    title="Daily Wellness & RPE"
                    subtitle="Lengkapi data wellness dan latihan harian Anda untuk pemantauan optimal."
                    badge="Athlete View"
                    icon={Activity}
                />

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-200 text-[#ff4d00]">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 tracking-tight">Riwayat 7 Hari Terakhir</h3>
                                <p className="text-sm font-medium text-slate-500">Pilih hari untuk mengisi atau melihat log.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="divide-y divide-slate-100">
                        {days.map((day) => (
                            <div
                                key={day.date}
                                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:px-6 hover:bg-orange-50/50 transition-colors group ${day.is_today ? 'bg-orange-50/10' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-white rounded-xl border border-slate-200 shadow-sm shrink-0">
                                        <span className={`text-[10px] font-bold ${day.is_today ? 'text-[#ff4d00]' : 'text-slate-400'}`}>
                                            {day.day_name.substring(0, 3)}
                                        </span>
                                        <span className={`text-lg font-black leading-none mt-0.5 ${day.is_today ? 'text-slate-900' : 'text-slate-700'}`}>
                                            {day.formatted_date.split(' ')[0]}
                                        </span>
                                    </div>
                                    
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className={`text-sm font-bold ${day.is_today ? 'text-[#ff4d00]' : 'text-slate-900'}`}>
                                                {day.is_today ? 'Hari Ini' : day.formatted_date}
                                            </h4>
                                            {day.is_today && (
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4d00] opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff4d00]"></span>
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-1.5 mt-1">
                                            {day.is_filled ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                                    <CheckCircle2 size={12} /> Selesai
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                                    <Circle size={12} /> Belum Diisi Lengkap
                                                </span>
                                            )}
                                            
                                            {day.wellness_score !== null && (
                                                <span className="text-xs font-semibold text-slate-500">
                                                    • Score: <span className="text-slate-700 font-bold">{day.wellness_score}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                    <Link
                                        href={route("admin.wellness-rpe.session-form", { date: day.date, mode: 'wellness' })}
                                        className="flex-1 sm:flex-none text-center px-4 py-2 bg-white text-slate-700 rounded-xl text-xs font-bold border border-slate-200 hover:border-[#ff4d00] hover:text-[#ff4d00] hover:shadow-sm transition-all"
                                    >
                                        Isi Wellness
                                    </Link>
                                    <Link
                                        href={route("admin.wellness-rpe.session-form", { date: day.date, mode: 'rpe' })}
                                        className="flex-1 sm:flex-none text-center px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-[#ff4d00] hover:shadow-md hover:shadow-[#ff4d00]/20 transition-all"
                                    >
                                        Isi RPE
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
