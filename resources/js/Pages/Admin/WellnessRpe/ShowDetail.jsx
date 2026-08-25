import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import PageHeader from "@/Components/Common/PageHeader";
import BodyHighlighter from "@/Components/BodyHighlighter";
import {
    ChevronLeft,
    HeartPulse,
    Activity,
    Moon,
    Flame,
    Brain,
    Dumbbell,
    Clock,
    User,
    CheckCircle2,
    Zap,
    Smile,
    Calendar,
    AlertCircle
} from "lucide-react";

export default function ShowDetail({
    auth,
    athlete,
    log,
    selectedDate,
    formattedDate,
}) {
    const renderScoreCard = (title, icon, score, colorClass, max = 5) => (
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">{title}</span>
                <div className={`p-1 rounded ${colorClass} bg-opacity-15`}>
                    {icon}
                </div>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-900 leading-none">
                    {score || '-'}
                </span>
                <span className="text-[10px] font-bold text-slate-400">/ {max}</span>
            </div>
        </div>
    );

    return (
        <AppLayout
            user={auth.user}
            title={`Detail Wellness - ${athlete.name}`}
        >
            <Head title={`Wellness - ${athlete.name}`} />

            <div className="space-y-4 pb-16">
                {/* ─── 1. PAGE HEADER ─── */}
                <PageHeader 
                    title={`Detail Log: ${athlete.name}`}
                    description={`Rekap metrik pemulihan dan beban latihan untuk ${formattedDate}.`}
                    actions={
                        <div className="flex items-center gap-2">
                            <Link
                                href={route("admin.wellness-rpe.athlete.show", athlete.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs"
                            >
                                <ChevronLeft size={14} />
                                <span>Kembali ke Kalender</span>
                            </Link>
                            <Link
                                href={route("admin.wellness-rpe.session-form", { 
                                    date: selectedDate, 
                                    athlete_id: athlete.id, 
                                    mode: 'wellness', 
                                    redirect_to: route('admin.wellness-rpe.athlete.date.show', { user: athlete.id, date: selectedDate }) 
                                })}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs"
                            >
                                <HeartPulse size={13} className="text-rose-500" />
                                <span>{log && log.daily_wellness_score ? 'Edit Wellness' : 'Isi Wellness'}</span>
                            </Link>
                            <Link
                                href={route("admin.wellness-rpe.session-form", { 
                                    date: selectedDate, 
                                    athlete_id: athlete.id, 
                                    mode: 'rpe', 
                                    redirect_to: route('admin.wellness-rpe.athlete.date.show', { user: athlete.id, date: selectedDate }) 
                                })}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-md text-xs font-bold hover:bg-orange-600 transition-colors shadow-2xs"
                            >
                                <Dumbbell size={13} />
                                <span>{log && log.daily_load ? 'Edit RPE' : 'Isi RPE'}</span>
                            </Link>
                        </div>
                    }
                />

                {!log ? (
                    <div className="bg-white rounded-md border border-slate-200/80 p-8 text-center shadow-2xs space-y-2">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                            <Activity size={20} />
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900">Belum Ada Data Log</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Atlet belum mengisi log wellness dan sesi latihan untuk tanggal {formattedDate}.
                        </p>
                        <div className="pt-2">
                            <Link
                                href={route("admin.wellness-rpe.session-form", { date: selectedDate, athlete_id: athlete.id, mode: 'all' })}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-md hover:bg-orange-600 transition-colors shadow-2xs"
                            >
                                <span>Isi Log Sekarang</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                        {/* ─── LEFT COLUMN: WELLNESS & RPE METRICS ─── */}
                        <div className="lg:col-span-7 space-y-4">
                            {/* Wellness Metrics Card */}
                            <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-1.5">
                                        <HeartPulse size={14} className="text-rose-500" />
                                        <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                                            Parameter Wellness
                                        </h3>
                                    </div>
                                    <span className="text-[10.5px] font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                                        Total Skor: <strong className="text-slate-900">{log.daily_wellness_score || '-'}</strong> / 30
                                    </span>
                                </div>
                                
                                <div className="p-3.5 sm:p-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                    {renderScoreCard("Kualitas Tidur", <Moon size={14} className="text-indigo-600" />, log.quality_of_sleep, "bg-indigo-100")}
                                    {renderScoreCard("Tingkat Stres", <Brain size={14} className="text-rose-600" />, log.stress, "bg-rose-100")}
                                    {renderScoreCard("Kelelahan (Fatigue)", <Activity size={14} className="text-amber-600" />, log.fatigue, "bg-amber-100")}
                                    {renderScoreCard("Nyeri Otot (Soreness)", <Flame size={14} className="text-red-600" />, log.muscle_soreness, "bg-red-100")}
                                    {renderScoreCard("Motivasi Latihan", <Zap size={14} className="text-yellow-600" />, log.motivation, "bg-yellow-100")}
                                    {renderScoreCard("Kondisi Mood", <Smile size={14} className="text-sky-600" />, log.mood_state, "bg-sky-100")}
                                </div>
                            </div>

                            {/* RPE & Training Load Card */}
                            <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-1.5">
                                        <Dumbbell size={14} className="text-orange-500" />
                                        <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                                            RPE & Beban Latihan
                                        </h3>
                                    </div>
                                    <span className="text-[10.5px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
                                        Daily Load: <strong className="text-orange-900">{log.daily_load ? `${log.daily_load} AU` : '-'}</strong>
                                    </span>
                                </div>

                                <div className="p-3.5 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* AM Session */}
                                    <div className="border border-slate-200/80 bg-slate-50/60 rounded-md p-3 space-y-2">
                                        <h4 className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1.5">
                                            Sesi Pagi (AM)
                                        </h4>
                                        <div className="space-y-1 text-xs">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500 font-medium">Skor RPE (1–10)</span>
                                                <span className="font-black text-slate-900">{log.am_rpe || '-'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500 font-medium">Durasi Latihan</span>
                                                <span className="font-bold text-slate-900">{log.am_duration ? `${log.am_duration} Menit` : '-'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PM Session */}
                                    <div className="border border-slate-200/80 bg-slate-50/60 rounded-md p-3 space-y-2">
                                        <h4 className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1.5">
                                            Sesi Sore / Malam (PM)
                                        </h4>
                                        <div className="space-y-1 text-xs">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500 font-medium">Skor RPE (1–10)</span>
                                                <span className="font-black text-slate-900">{log.pm_rpe || '-'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500 font-medium">Durasi Latihan</span>
                                                <span className="font-bold text-slate-900">{log.pm_duration ? `${log.pm_duration} Menit` : '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── RIGHT COLUMN: BODY PAIN MAP ─── */}
                        <div className="lg:col-span-5 space-y-4">
                            <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-1.5">
                                        <User size={14} className="text-slate-700" />
                                        <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                                            Keluhan & Area Nyeri Otot
                                        </h3>
                                    </div>
                                    {log.muscle_pain_areas && log.muscle_pain_areas.length > 0 && (
                                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.2 rounded">
                                            {log.muscle_pain_areas.length} Titik
                                        </span>
                                    )}
                                </div>
                                
                                <div className="p-3.5 sm:p-4 space-y-3">
                                    {(!log.muscle_pain_areas || log.muscle_pain_areas.length === 0) ? (
                                        <div className="text-center py-6 border border-dashed border-slate-200 rounded-md">
                                            <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-1.5" />
                                            <p className="text-xs font-bold text-slate-700">Tidak Ada Keluhan Nyeri</p>
                                            <p className="text-[10.5px] text-slate-400 mt-0.5">Otot dalam kondisi bugar tanpa titik nyeri.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {/* Visual Anterior & Posterior Model */}
                                            <div className="rounded-md border border-slate-200/80 bg-slate-50/50 p-2.5 flex items-center justify-around">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[9px] font-bold text-slate-400 tracking-wider mb-1">DEPAN</span>
                                                    <div className="w-[110px]">
                                                        <BodyHighlighter type="anterior" selectedAreas={log.muscle_pain_areas || []} onSelectArea={() => {}} />
                                                    </div>
                                                </div>
                                                <div className="w-px h-24 bg-slate-200" />
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[9px] font-bold text-slate-400 tracking-wider mb-1">BELAKANG</span>
                                                    <div className="w-[110px]">
                                                        <BodyHighlighter type="posterior" selectedAreas={log.muscle_pain_areas || []} onSelectArea={() => {}} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tags List */}
                                            <div className="flex flex-wrap gap-1">
                                                {log.muscle_pain_areas.map((area, idx) => (
                                                    <span key={idx} className="inline-block px-2 py-0.5 bg-orange-50 text-orange-700 text-[10.5px] font-bold rounded border border-orange-200">
                                                        {area}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
