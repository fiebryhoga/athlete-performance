import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/Layout/PageHeader";
import BodyHighlighter from "@/Components/BodyHighlighter";
import {
    ArrowLeft,
    HeartPulse,
    Activity,
    Moon,
    Flame,
    Brain,
    Dumbbell,
    Clock,
    User,
    CheckCircle2
} from "lucide-react";

export default function ShowDetail({
    auth,
    athlete,
    log,
    selectedDate,
    formattedDate,
}) {
    const renderScoreCard = (title, icon, score, colorClass, max = 7) => (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
                    {icon}
                </div>
                <h4 className="text-sm font-bold text-slate-700">{title}</h4>
            </div>
            <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-slate-900 leading-none">
                    {score || '-'}
                </span>
                <span className="text-sm font-bold text-slate-400 mb-1">/ {max}</span>
            </div>
        </div>
    );

    return (
        <AppLayout
            user={auth.user}
            headerTitle={`Detail Wellness: ${athlete.name}`}
            headerDescription={`Data wellness dan RPE untuk tanggal ${formattedDate}`}
        >
            <Head title={`Wellness - ${athlete.name}`} />

            <div className="pb-12 space-y-6">
                <PageHeader 
                    title={`Wellness Detail: ${athlete.name}`}
                    subtitle={`Data kesehatan dan intensitas latihan untuk tanggal ${formattedDate}`}
                    badge={formattedDate}
                    icon={HeartPulse}
                    actions={
                        <Link
                            href={route("admin.wellness-rpe.athlete.show", athlete.id)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <ArrowLeft size={16} /> Kembali ke Kalender
                        </Link>
                    }
                />

                {!log ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center">
                        <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Activity className="h-6 w-6 text-slate-400" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">Belum Ada Data</h3>
                        <p className="mt-1 text-xs text-slate-500">Athlete belum mengisi form wellness/RPE pada tanggal ini.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Kiri: Wellness Metrics */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <HeartPulse className="text-[#ff4d00]" size={20} />
                                    Wellness Metrics
                                    <span className="ml-auto text-sm font-bold bg-orange-50 text-[#ff4d00] px-3 py-1 rounded-full border border-orange-100">
                                        Total Score: {log.daily_wellness_score || '-'} / 28
                                    </span>
                                </h3>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    {renderScoreCard("Kualitas Tidur", <Moon size={18} className="text-indigo-500" />, log.quality_of_sleep, "bg-indigo-500")}
                                    {renderScoreCard("Tingkat Stres", <Brain size={18} className="text-rose-500" />, log.stress, "bg-rose-500")}
                                    {renderScoreCard("Kelelahan (Fatigue)", <Activity size={18} className="text-amber-500" />, log.fatigue, "bg-amber-500")}
                                    {renderScoreCard("Nyeri Otot (Soreness)", <Flame size={18} className="text-red-500" />, log.muscle_soreness, "bg-red-500")}
                                </div>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Dumbbell className="text-[#ff4d00]" size={20} />
                                    RPE & Load
                                    <span className="ml-auto text-sm font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                                        Daily Load: <span className="text-[#ff4d00] ml-1">{log.daily_load || '-'}</span>
                                    </span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border border-slate-100 bg-slate-50 rounded-xl p-5">
                                        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">Sesi Pagi (AM)</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-semibold text-slate-500">RPE (1-10)</span>
                                                <span className="text-sm font-bold text-slate-900">{log.am_rpe || '-'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-semibold text-slate-500">Durasi (Menit)</span>
                                                <span className="text-sm font-bold text-slate-900 flex items-center gap-1"><Clock size={14} className="text-slate-400"/> {log.am_duration || '-'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border border-slate-100 bg-slate-50 rounded-xl p-5">
                                        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">Sesi Sore (PM)</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-semibold text-slate-500">RPE (1-10)</span>
                                                <span className="text-sm font-bold text-slate-900">{log.pm_rpe || '-'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-semibold text-slate-500">Durasi (Menit)</span>
                                                <span className="text-sm font-bold text-slate-900 flex items-center gap-1"><Clock size={14} className="text-slate-400"/> {log.pm_duration || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kanan: Body Pain Map */}
                        <div className="space-y-6">
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full flex flex-col">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <User className="text-[#ff4d00]" size={20} />
                                    Area Nyeri Otot
                                </h3>
                                
                                <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
                                    {(!log.muscle_pain_areas || log.muscle_pain_areas.length === 0) ? (
                                        <div className="text-center">
                                            <div className="inline-flex h-12 w-12 bg-green-50 rounded-full items-center justify-center mb-3">
                                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-700">Tidak ada keluhan nyeri</p>
                                        </div>
                                    ) : (
                                        <div className="w-full flex justify-center scale-90 origin-top">
                                            <BodyHighlighter 
                                                selectedAreas={log.muscle_pain_areas || []} 
                                                onAreaToggle={() => {}} 
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                {log.muscle_pain_areas && log.muscle_pain_areas.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                                        {log.muscle_pain_areas.map((area, idx) => (
                                            <span key={idx} className="inline-block px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full border border-red-100">
                                                {area}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
