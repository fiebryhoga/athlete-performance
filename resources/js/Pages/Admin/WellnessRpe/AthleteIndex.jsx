import React from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/Common/PageHeader";
import { 
    Calendar, 
    CheckCircle2, 
    Circle, 
    ChevronRight, 
    Activity, 
    HeartPulse, 
    Flame, 
    Dumbbell, 
    Smile, 
    Clock, 
    Info,
    ArrowUpRight,
    BarChart3
} from "lucide-react";

export default function AthleteIndex({ auth, days = [], metrics = {} }) {
    return (
        <AppLayout
            user={auth.user}
            title="Wellness & RPE"
        >
            <Head title="Daily Wellness & RPE" />

            <div className="space-y-4 pb-12">
                {/* ─── 1. PAGE HEADER ─── */}
                <PageHeader 
                    title="Daily Wellness & RPE"
                    description="Lengkapi evaluasi pemulihan harian (Wellness) dan intensitas beban latihan (RPE) Anda."
                />

                {/* ─── 2. 2-COLUMN LAYOUT (KIRI & KANAN) ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    {/* ─── LEFT COLUMN: RIWAYAT 7 HARI TERAKHIR ─── */}
                    <div className="lg:col-span-8 bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <Calendar size={15} className="text-orange-500" />
                                <h3 className="text-xs sm:text-sm font-bold text-slate-900">Riwayat 7 Hari Terakhir</h3>
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium">Pilih hari untuk mengisi atau melihat log</span>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {days.map((day) => (
                                <div
                                    key={day.date}
                                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:px-4 hover:bg-slate-50/70 transition-colors ${
                                        day.is_today ? 'bg-orange-50/20' : ''
                                    }`}
                                >
                                    {/* Left Date & Status */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`w-10 h-10 rounded-md border flex flex-col items-center justify-center shrink-0 shadow-2xs ${
                                            day.is_today 
                                                ? 'bg-orange-50 text-orange-600 border-orange-200 font-bold' 
                                                : 'bg-slate-50 text-slate-700 border-slate-200'
                                        }`}>
                                            <span className="text-[9px] font-bold uppercase leading-none opacity-80">
                                                {day.day_name.substring(0, 3)}
                                            </span>
                                            <span className="text-sm font-bold leading-none mt-0.5">
                                                {day.formatted_date.split(' ')[0]}
                                            </span>
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <h4 className={`text-xs font-bold ${day.is_today ? 'text-orange-600' : 'text-slate-900'}`}>
                                                    {day.is_today ? 'Hari Ini' : day.formatted_date}
                                                </h4>
                                                {day.is_today && (
                                                    <span className="text-[9.5px] font-bold text-orange-600 bg-orange-100/70 px-1.5 py-0.2 rounded">
                                                        HARI INI
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10.5px]">
                                                {day.wellness_filled ? (
                                                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/80 font-semibold">
                                                        <CheckCircle2 size={11} className="text-emerald-600" />
                                                        Wellness: {day.wellness_score}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-medium">
                                                        <Circle size={10} className="text-slate-400" />
                                                        Wellness: -
                                                    </span>
                                                )}

                                                {day.rpe_filled ? (
                                                    <span className="inline-flex items-center gap-1 text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/80 font-semibold">
                                                        <Dumbbell size={11} className="text-indigo-600" />
                                                        Load: {day.daily_load ? `${day.daily_load} AU` : 'Terisi'}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-medium">
                                                        <Circle size={10} className="text-slate-400" />
                                                        Load: -
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Actions */}
                                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                        <Link
                                            href={route("admin.wellness-rpe.session-form", { date: day.date, mode: 'wellness' })}
                                            className="px-2.5 py-1.5 bg-white text-slate-700 rounded-md text-xs font-semibold border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-2xs"
                                        >
                                            {day.wellness_filled ? 'Edit Wellness' : 'Isi Wellness'}
                                        </Link>
                                        <Link
                                            href={route("admin.wellness-rpe.session-form", { date: day.date, mode: 'rpe' })}
                                            className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all shadow-2xs ${
                                                day.rpe_filled 
                                                    ? 'bg-slate-900 text-white hover:bg-slate-800' 
                                                    : 'bg-white border border-orange-200 text-orange-700 hover:bg-orange-50'
                                            }`}
                                        >
                                            {day.rpe_filled ? 'Edit RPE' : 'Isi RPE'}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ─── RIGHT COLUMN: STATS & GUIDELINES ─── */}
                    <div className="lg:col-span-4 space-y-4">
                        {/* 4 KPI Metrics in 2x2 Grid */}
                        <div className="bg-white rounded-md border border-slate-200/80 p-3.5 shadow-2xs">
                            <h3 className="text-xs font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
                                <Activity size={14} className="text-orange-500" />
                                <span>Ringkasan 7 Hari</span>
                            </h3>

                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="bg-slate-50/70 border border-slate-200/70 rounded-md p-2.5">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10.5px] font-semibold text-slate-500 truncate">Total Load</span>
                                        <Flame size={12} className="text-orange-500 shrink-0" />
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-base sm:text-lg font-bold text-slate-900">
                                            {metrics.total_weekly_load ? metrics.total_weekly_load.toLocaleString('id-ID') : '0'}
                                        </span>
                                        <span className="text-[10px] font-semibold text-slate-400">AU</span>
                                    </div>
                                </div>

                                <div className="bg-slate-50/70 border border-slate-200/70 rounded-md p-2.5">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10.5px] font-semibold text-slate-500 truncate">Rata-rata Skor</span>
                                        <Smile size={12} className="text-emerald-500 shrink-0" />
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-base sm:text-lg font-bold text-slate-900">
                                            {metrics.avg_wellness_score !== null ? metrics.avg_wellness_score : '-'}
                                        </span>
                                        <span className="text-[10px] font-semibold text-slate-400">skor</span>
                                    </div>
                                </div>

                                <div className="bg-slate-50/70 border border-slate-200/70 rounded-md p-2.5">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10.5px] font-semibold text-slate-500 truncate">Log Wellness</span>
                                        <CheckCircle2 size={12} className="text-blue-500 shrink-0" />
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-base sm:text-lg font-bold text-slate-900">
                                            {metrics.filled_wellness_count || 0}
                                        </span>
                                        <span className="text-[10px] font-semibold text-slate-400">/ 7 hari</span>
                                    </div>
                                </div>

                                <div className="bg-slate-50/70 border border-slate-200/70 rounded-md p-2.5">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10.5px] font-semibold text-slate-500 truncate">Log RPE</span>
                                        <Dumbbell size={12} className="text-indigo-500 shrink-0" />
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-base sm:text-lg font-bold text-slate-900">
                                            {metrics.filled_rpe_count || 0}
                                        </span>
                                        <span className="text-[10px] font-semibold text-slate-400">/ 7 hari</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Guidelines & Scales Card */}
                        <div className="bg-white border border-slate-200/80 rounded-md p-3.5 shadow-2xs text-xs text-slate-600 space-y-2">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs border-b border-slate-100 pb-2">
                                <Info size={14} className="text-orange-500" />
                                <span>Panduan Pengisian</span>
                            </div>
                            <div className="space-y-2 text-[11px] leading-relaxed text-slate-500">
                                <div>
                                    <strong className="text-slate-700 block mb-0.5">Wellness Score (1–5):</strong>
                                    Diisi setiap pagi setelah bangun tidur untuk memantau kualitas tidur, rasa lelah, nyeri otot, dan tingkat stres.
                                </div>
                                <div>
                                    <strong className="text-slate-700 block mb-0.5">Session RPE (1–10):</strong>
                                    Diisi setelah sesi latihan (skala Borg CR-10). Nilai RPE × Durasi menghasilkan total <strong>Beban Latihan (AU)</strong>.
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
