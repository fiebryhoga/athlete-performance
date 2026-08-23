import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/Common/PageHeader";
import PageFooter from "@/Components/Common/PageFooter";
import {
    Calendar,
    CheckCircle2,
    HeartPulse,
    Activity,
    Dumbbell,
    ArrowRight,
    ArrowUpRight,
    Sparkles,
    Target,
    Users,
    Trophy,
    Flame,
    Zap,
    Utensils,
    ClipboardList,
    Clock,
    User,
    Shield,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

/* ───────────────────────────────────────────────
   DATE HELPERS
   ─────────────────────────────────────────────── */

const toLocalYMD = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const parseLocalYMD = (str) => {
    if (!str) return new Date();
    const parts = str.split("-").map(Number);
    if (parts.length === 3) {
        return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
    }
    return new Date();
};

/* ───────────────────────────────────────────────
   ATHLETE HERO GREETING BANNER
   ─────────────────────────────────────────────── */

const AthleteHeroGreeting = ({ user, stats }) => {
    return (
        <div className="relative overflow-hidden bg-white rounded-lg p-7 md:p-8 lg:p-9 border border-slate-200/90 shadow-2xs group min-h-[210px] flex items-center">
            {/* Subtle Warm Ambient Background */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-orange-50/50 via-amber-50/20 to-transparent pointer-events-none"></div>

            <div className="relative z-10 flex items-center justify-between w-full">
                {/* Left: Rich Structured Content */}
                <div className="flex-1 min-w-0 pr-4 md:pr-10">
                    {/* Top Row: Clean System Status Indicator */}
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-600 mb-3">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>Status Sistem: Optimal & Terintegrasi</span>
                    </div>

                    {/* Main Greeting Title */}
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 mb-2 leading-snug">
                        Selamat Datang Kembali,{" "}
                        <span className="text-orange-600 font-bold">
                            {user?.name}
                        </span>
                        !
                    </h2>

                    {/* Professional Performance Description */}
                    <p className="text-slate-500 text-[11px] sm:text-xs font-medium leading-relaxed sm:leading-5 mb-5 max-w-xl">
                        Pantau kesiapan dan progres latihan atlet secara langsung (<span className="italic">real-time</span>). Selesaikan agenda harianmu hari ini untuk mendorong performa dan pemulihan optimal.
                    </p>

                    {/* Divider & Footer Hub */}
                    <div className="border-t border-slate-100 pt-4 mt-10 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-700">
                            <span className="text-slate-800 font-bold">
                                OTS Performance Hub
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500 font-medium">
                                Olympus Training Surabaya
                            </span>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-50 border border-slate-200/90 rounded text-[10px] font-bold text-slate-700 shadow-2xs">
                            <Zap
                                size={11}
                                className="text-orange-500 fill-orange-500"
                            />
                            <span>Fase Latihan Aktif</span>
                        </div>
                    </div>
                </div>

                {/* Right: Athlete Model Graphic */}
                <div className="relative hidden lg:flex items-end shrink-0 -mb-9 -mr-3 z-10 pointer-events-none self-end">
                    <img
                        src="/assets/images/model2.png"
                        alt="Athlete Performance"
                        className="h-[200px] xl:h-[220px] w-auto object-contain object-bottom drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </div>
        </div>
    );
};

/* ───────────────────────────────────────────────
   ATHLETE PHYSICAL SCORE & EVALUATION CARD
   ─────────────────────────────────────────────── */

const AthletePhysicalScoreCard = ({ stats = {} }) => {
    const score = stats?.latest_test_score !== null && stats?.latest_test_score !== undefined ? Number(stats.latest_test_score) : null;
    const hasScore = score !== null;

    const getPredicate = (val) => {
        if (val === null) return { label: "Belum Ada Tes", color: "bg-slate-100 text-slate-600 border-slate-200" };
        if (val >= 85) return { label: "Sangat Baik", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
        if (val >= 70) return { label: "Baik", color: "bg-blue-50 text-blue-700 border-blue-200" };
        if (val >= 55) return { label: "Cukup Baik", color: "bg-orange-50 text-orange-700 border-orange-200" };
        return { label: "Perlu Peningkatan", color: "bg-amber-50 text-amber-700 border-amber-200" };
    };

    const predicate = getPredicate(score);
    const scorePercent = hasScore ? Math.min(Math.max(score, 0), 100) : 0;
    const scoreDiff = stats?.score_diff;

    return (
        <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between h-full hover:border-slate-300 transition-all">
            {/* Subtle Warm Ambient Background Glow */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-orange-50/80 via-amber-50/30 to-transparent pointer-events-none rounded-tr-xl"></div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                        <Trophy size={16} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 leading-tight">
                            Skor Evaluasi Fisik
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium">
                            Skor kumulatif atribut tes performa
                        </p>
                    </div>
                </div>

                <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${predicate.color}`}
                >
                    {predicate.label}
                </span>
            </div>

            {/* Main Score Visual with Progress Bar & Metrics */}
            <div className="relative z-10 my-auto py-3">
                <div className="flex items-baseline justify-between gap-2 mb-2">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-4xl font-black text-slate-900 tracking-tight">
                            {hasScore ? score.toFixed(1) : "—"}
                        </span>
                        {hasScore && (
                            <span className="text-xs font-bold text-slate-400">
                                / 100 Pts
                            </span>
                        )}
                    </div>

                    {scoreDiff !== null && scoreDiff !== undefined && (
                        <span
                            className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                                scoreDiff >= 0
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                        >
                            {scoreDiff >= 0 ? `▲ +${scoreDiff}` : `▼ ${scoreDiff}`} Pts
                        </span>
                    )}
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2.5">
                    <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${scorePercent}%` }}
                    ></div>
                </div>

                {/* Metadata Pills */}
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-500">
                        <Calendar size={12} className="text-orange-500" />
                        {stats?.latest_test_date || "Belum ada tes"}
                    </span>
                    <span className="font-semibold text-slate-600">
                        {stats?.total_tests || 0} Total Evaluasi
                    </span>
                </div>
            </div>

            {/* Footer Link */}
            <div className="relative z-10 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <Link
                    href={route("athlete.profiling")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors group"
                >
                    <span>Buka Rincian Tes & Analisis</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>
        </div>
    );
};

/* ───────────────────────────────────────────────
   ATHLETE PHYSICAL CATEGORY RADAR CARD
   ─────────────────────────────────────────────── */

const AthleteCategoryRadarCard = ({ data }) => {
    const defaultData = [
        { name: "Speed", value: 85.0 },
        { name: "Endurance", value: 80.0 },
        { name: "Power", value: 78.5 },
        { name: "Strength", value: 75.0 },
        { name: "Agility", value: 72.0 },
        { name: "Str. Endurance", value: 65.0 },
    ];
    const rawItems = data && data.length > 0 ? data : defaultData;

    const radarItems = rawItems.map((item) => ({
        subject: `${item.name.replace("Strength Endurance", "Str. Endurance")} (${item.value})`,
        category: item.name,
        score: item.value,
        fullMark: 100,
    }));

    const sorted = [...rawItems].sort((a, b) => b.value - a.value);
    const topCat = sorted[0];
    const lowestCat = sorted[sorted.length - 1];

    return (
        <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between h-full hover:border-slate-300 transition-all">
            {/* Subtle Warm Ambient Background Glow */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-orange-50/80 via-amber-50/30 to-transparent pointer-events-none rounded-tr-xl"></div>

            <div className="relative z-10 flex items-center justify-between mb-1">
                <div>
                    <h3 className="text-sm font-bold text-slate-800 leading-tight">
                        Radar Kategori Fisik
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                        Profil atribut fisik dari evaluasi tes terakhir (0 - 100)
                    </p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                    <Activity size={15} />
                </div>
            </div>

            <div className="relative z-10 h-[200px] w-full -my-1">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="66%" data={radarItems}>
                        <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: "#475569", fontSize: 9.5, fontWeight: 600 }}
                        />
                        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Skor Fisik"
                            dataKey="score"
                            stroke="#ea580c"
                            strokeWidth={2.5}
                            fill="#f97316"
                            fillOpacity={0.25}
                            dot={{ r: 3.5, fill: "#fff", stroke: "#ea580c", strokeWidth: 2 }}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const d = payload[0]?.payload;
                                    return (
                                        <div className="bg-white border border-slate-200/90 shadow-md rounded-lg px-3 py-1.5 text-xs">
                                            <span className="font-bold text-slate-800">{d?.category}: </span>
                                            <span className="font-bold text-orange-600">{d?.score} / 100 pts</span>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Bottom Insight */}
            <div className="relative z-10 flex items-center justify-between text-[11px] font-semibold text-slate-500 pt-2 border-t border-slate-100">
                {topCat && (
                    <span>Teratas: <strong className="text-slate-800 font-bold">{topCat.name} ({topCat.value})</strong></span>
                )}
                {lowestCat && (
                    <span>Fokus: <strong className="text-orange-600 font-bold">{lowestCat.name} ({lowestCat.value})</strong></span>
                )}
            </div>
        </div>
    );
};

/* ───────────────────────────────────────────────
   CARD 1: KUISIONER WELLNESS (STANDALONE & FULLY CLICKABLE)
   ─────────────────────────────────────────────── */

const AthleteWellnessCard = ({ hasWellnessToday, wellnessRecord, todayDate }) => {
    return (
        <Link
            href={route("admin.wellness-rpe.session-form", {
                date: todayDate,
                mode: "wellness",
            })}
            className="relative overflow-hidden bg-white border border-slate-200/80 hover:border-orange-300 rounded-xl p-5 flex flex-col justify-between h-full hover:shadow-xs transition-all group cursor-pointer block"
        >
            {/* Subtle Warm Ambient Background Glow */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-orange-50/80 via-amber-50/30 to-transparent pointer-events-none rounded-tr-xl"></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <HeartPulse size={16} />
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                Log Kebugaran
                            </h4>
                            <h3 className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors leading-tight truncate">
                                Kuisioner Wellness
                            </h3>
                        </div>
                    </div>

                    <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${
                            hasWellnessToday
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-orange-50 text-orange-700 border-orange-200"
                        }`}
                    >
                        {hasWellnessToday ? "Sudah Terisi" : "Wajib Diisi"}
                    </span>
                </div>

                <p className="text-xs text-slate-500 font-normal leading-relaxed mb-3">
                    Pantau kualitas tidur, tingkat stres, rasa lelah, dan nyeri otot untuk evaluasi pemulihan fisik.
                </p>

                {/* Data preview when filled */}
                {hasWellnessToday && wellnessRecord ? (
                    <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 mb-1 text-center">
                        <div>
                            <span className="block text-[10px] text-slate-400 font-semibold">Tidur</span>
                            <span className="text-xs font-bold text-slate-800">
                                {wellnessRecord.sleep_quality ? `${wellnessRecord.sleep_quality}/5` : "—"}
                            </span>
                        </div>
                        <div className="border-x border-slate-200/60">
                            <span className="block text-[10px] text-slate-400 font-semibold">Kelelahan</span>
                            <span className="text-xs font-bold text-slate-800">
                                {wellnessRecord.fatigue ? `${wellnessRecord.fatigue}/5` : "—"}
                            </span>
                        </div>
                        <div>
                            <span className="block text-[10px] text-slate-400 font-semibold">Total Skor</span>
                            <span className="text-xs font-bold text-emerald-600">
                                {wellnessRecord.daily_wellness_score || "Terisi"}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="p-2.5 rounded-lg bg-orange-50/40 border border-orange-100 text-[11px] text-orange-700 font-medium">
                        Belum ada input evaluasi kesiapan fisik untuk hari ini.
                    </div>
                )}
            </div>

            {/* Footer Link */}
            <div className="relative z-10 pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                    <span>{hasWellnessToday ? "Lihat / Ubah Kuisioner" : "Isi Kuisioner Sekarang"}</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Form Harian</span>
            </div>
        </Link>
    );
};

/* ───────────────────────────────────────────────
   CARD 2: PENGERAHAN TENAGA (RPE) (STANDALONE & FULLY CLICKABLE)
   ─────────────────────────────────────────────── */

const AthleteRpeCard = ({ hasRpeToday, wellnessRecord, todayDate }) => {
    return (
        <Link
            href={route("admin.wellness-rpe.session-form", {
                date: todayDate,
                mode: "rpe",
            })}
            className="relative overflow-hidden bg-white border border-slate-200/80 hover:border-orange-300 rounded-xl p-5 flex flex-col justify-between h-full hover:shadow-xs transition-all group cursor-pointer block"
        >
            {/* Subtle Warm Ambient Background Glow */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-orange-50/80 via-amber-50/30 to-transparent pointer-events-none rounded-tr-xl"></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Activity size={16} />
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                Log Latihan
                            </h4>
                            <h3 className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors leading-tight truncate">
                                Pengerahan Tenaga (RPE)
                            </h3>
                        </div>
                    </div>

                    <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${
                            hasRpeToday
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-orange-50 text-orange-700 border-orange-200"
                        }`}
                    >
                        {hasRpeToday ? "Sudah Terisi" : "Wajib Diisi"}
                    </span>
                </div>

                <p className="text-xs text-slate-500 font-normal leading-relaxed mb-3">
                    Catat skala intensitas kelelahan dan beban pengerahan tenaga (Skala 1 - 10 RPE) sesi latihan hari ini.
                </p>

                {/* Data preview when filled */}
                {hasRpeToday && wellnessRecord ? (
                    <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 mb-1 text-center">
                        <div>
                            <span className="block text-[10px] text-slate-400 font-semibold">RPE Pagi</span>
                            <span className="text-xs font-bold text-slate-800">
                                {wellnessRecord.am_rpe ? `${wellnessRecord.am_rpe}/10` : "—"}
                            </span>
                        </div>
                        <div className="border-x border-slate-200/60">
                            <span className="block text-[10px] text-slate-400 font-semibold">RPE Sore</span>
                            <span className="text-xs font-bold text-slate-800">
                                {wellnessRecord.pm_rpe ? `${wellnessRecord.pm_rpe}/10` : "—"}
                            </span>
                        </div>
                        <div>
                            <span className="block text-[10px] text-slate-400 font-semibold">Daily Load</span>
                            <span className="text-xs font-bold text-orange-600">
                                {wellnessRecord.daily_load ? `${wellnessRecord.daily_load} AU` : "Terisi"}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="p-2.5 rounded-lg bg-orange-50/40 border border-orange-100 text-[11px] text-orange-700 font-medium">
                        Belum ada catatan skala pengerahan tenaga yang dimasukkan hari ini.
                    </div>
                )}
            </div>

            {/* Footer Link */}
            <div className="relative z-10 pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                    <span>{hasRpeToday ? "Lihat / Ubah Catatan RPE" : "Isi Catatan RPE Sekarang"}</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Beban Sesi</span>
            </div>
        </Link>
    );
};

/* ───────────────────────────────────────────────
   TODAY / DATE SESSIONS CARD (INTERACTIVE)
   ─────────────────────────────────────────────── */

const AthleteSessionsCard = ({ agendas = [], initialDate }) => {
    const todayStr = toLocalYMD(new Date());
    const currentDateStr = initialDate || todayStr;
    const [isLoading, setIsLoading] = useState(false);

    const formatDateIndo = (dateString) => {
        if (!dateString) return "";
        const date = parseLocalYMD(dateString);
        const today = new Date();
        today.setHours(12, 0, 0, 0);
        const target = new Date(date);
        target.setHours(12, 0, 0, 0);

        const diffTime = target.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

        const dayName = date.toLocaleDateString("id-ID", { weekday: "short" });
        const dayNum = date.toLocaleDateString("id-ID", { day: "numeric" });
        const monthName = date.toLocaleDateString("id-ID", { month: "short" });
        const yearNum = date.getFullYear();

        if (diffDays === 0) return `Hari Ini, ${dayNum} ${monthName}`;
        if (diffDays === 1) return `Besok, ${dayNum} ${monthName}`;
        if (diffDays === -1) return `Kemarin, ${dayNum} ${monthName}`;
        return `${dayName}, ${dayNum} ${monthName} ${yearNum}`;
    };

    const fetchAgendasForDate = (dateStr) => {
        setIsLoading(true);
        router.get(
            route("dashboard"),
            { agenda_date: dateStr },
            {
                preserveState: true,
                preserveScroll: true,
                only: ["today_agendas", "selected_agenda_date"],
                onFinish: () => setIsLoading(false),
            }
        );
    };

    const handleNavigateDate = (offsetDays) => {
        const d = parseLocalYMD(currentDateStr);
        d.setDate(d.getDate() + offsetDays);
        const newStr = toLocalYMD(d);
        fetchAgendasForDate(newStr);
    };

    const handleDirectDateChange = (e) => {
        const newStr = e.target.value;
        if (!newStr) return;
        fetchAgendasForDate(newStr);
    };

    const handleResetToday = () => {
        fetchAgendasForDate(todayStr);
    };

    const isToday = currentDateStr === todayStr;

    return (
        <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-5 hover:border-slate-300 transition-all">
            {/* Subtle Warm Ambient Background Glow */}
            <div className="absolute right-0 top-0 w-28 h-28 bg-gradient-to-bl from-orange-50/80 via-amber-50/30 to-transparent pointer-events-none rounded-tr-xl"></div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-3">
                <div>
                    <h3 className="text-sm font-bold text-slate-800 leading-tight">
                        {isToday ? "Sesi Latihan Hari Ini" : "Sesi Latihan"}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                        Jadwal sesi Privat & Grup Anda
                    </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-bold">
                    {agendas?.length || 0} Sesi
                </span>
            </div>

            {/* Interactive Date Bar */}
            <div className="relative z-10 flex items-center justify-between gap-1.5 bg-slate-50 border border-slate-200/80 rounded-lg p-1.5 mb-3.5">
                <button
                    type="button"
                    onClick={() => handleNavigateDate(-1)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-white transition-all active:scale-95 shrink-0"
                    title="Hari Sebelumnya"
                >
                    <ChevronLeft size={14} />
                </button>

                {/* Date Display with Clickable Native Picker */}
                <div className="relative flex-1 flex items-center justify-center gap-1.5 text-center cursor-pointer group">
                    <Calendar size={13} className="text-orange-500 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-bold text-slate-700 select-none group-hover:text-orange-600 transition-colors">
                        {formatDateIndo(currentDateStr)}
                    </span>
                    <input
                        type="date"
                        value={currentDateStr}
                        onChange={handleDirectDateChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        title="Pilih tanggal sesi"
                    />
                </div>

                <button
                    type="button"
                    onClick={() => handleNavigateDate(1)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-white transition-all active:scale-95 shrink-0"
                    title="Hari Berikutnya"
                >
                    <ChevronRight size={14} />
                </button>

                {/* Quick Reset to Today Button */}
                {!isToday && (
                    <button
                        type="button"
                        onClick={handleResetToday}
                        className="px-2 py-0.5 rounded bg-orange-500 text-white text-[9px] font-bold hover:bg-orange-600 transition-all shrink-0 active:scale-95"
                        title="Kembali ke Hari Ini"
                    >
                        Hari Ini
                    </button>
                )}
            </div>

            {/* Agendas List */}
            <div className={`relative z-10 transition-opacity duration-200 ${isLoading ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
                {agendas && agendas.length > 0 ? (
                    <div className="divide-y divide-slate-100 space-y-2.5">
                        {agendas.map((item, idx) => (
                            <div key={idx} className="pt-2.5 first:pt-0 flex items-center justify-between gap-2.5">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span
                                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                                                item.is_group
                                                    ? "bg-amber-50 text-amber-700 border border-amber-200/70"
                                                    : "bg-orange-50 text-orange-700 border border-orange-200/70"
                                            }`}
                                        >
                                            {item.is_group ? "Grup" : "Privat"}
                                        </span>
                                        <p className="text-xs font-bold text-slate-800 truncate">
                                            {item.participant_name}
                                        </p>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium truncate">
                                        {item.coach_name ? `Coach: ${item.coach_name}` : "Pelatih"} • Sesi #{item.session_number || 1}
                                    </p>
                                </div>

                                {item.route && (
                                    <Link
                                        href={item.route}
                                        className="px-2.5 py-1 bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white border border-orange-200 hover:border-orange-500 rounded text-[10px] font-bold transition-all shrink-0"
                                    >
                                        Buka Sesi
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-6 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                        <ClipboardList size={18} className="text-slate-300 mb-1.5" />
                        <h4 className="text-xs font-bold text-slate-700">
                            Tidak ada sesi pada tanggal ini
                        </h4>
                        <p className="text-slate-400 text-[10px] mt-0.5">
                            Belum ada jadwal sesi latihan privat atau grup yang terdaftar.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ───────────────────────────────────────────────
   MAIN ATHLETE DASHBOARD
   ─────────────────────────────────────────────── */

export default function AthleteDashboard({
    user,
    today_agendas = [],
    selected_agenda_date = null,
    has_wellness_today,
    has_rpe_today,
    today_wellness_record = null,
    today_date,
    category_averages = [],
    stats = {},
}) {
    const todayFormatted = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard Atlet" />

            <div className="space-y-3.5 pb-1">
                {/* Page Title & Subtitle Header */}
                <PageHeader
                    title="Dashboard"
                    description="Portal performa atlet, kesiapan fisik, dan agenda latihan harian."
                />

                <div className="flex flex-col lg:flex-row gap-4">
                    {/* ═══════════════════════════════════════
                        KOLOM KIRI — MAIN CONTENT
                       ═══════════════════════════════════════ */}
                    <div className="flex-1 min-w-0 space-y-4">
                        {/* Hero Greeting */}
                        <AthleteHeroGreeting user={user} stats={stats} />

                        {/* Row 1: Skor Tes Fisik & Radar Kategori Fisik (2 Columns) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Card 1: Skor Tes Fisik */}
                            <AthletePhysicalScoreCard stats={stats} />

                            {/* Card 2: Radar Kategori Fisik */}
                            <AthleteCategoryRadarCard data={category_averages} />
                        </div>

                        {/* Row 2: 2 Standalone Daily Log Cards (Wellness & RPE) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Card 3: Kuisioner Wellness */}
                            <AthleteWellnessCard
                                hasWellnessToday={has_wellness_today}
                                wellnessRecord={today_wellness_record}
                                todayDate={today_date}
                            />

                            {/* Card 4: Log Beban Latihan RPE */}
                            <AthleteRpeCard
                                hasRpeToday={has_rpe_today}
                                wellnessRecord={today_wellness_record}
                                todayDate={today_date}
                            />
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════
                        KOLOM KANAN — SIDEBAR INFO (380px)
                       ═══════════════════════════════════════ */}
                    <div className="w-full lg:w-[340px] xl:w-[380px] 2xl:w-[400px] shrink-0 space-y-4">
                        {/* Profile & Today Overview Card */}
                        <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-4 hover:border-slate-300 transition-all">
                            {/* Subtle Warm Ambient Background Glow */}
                            <div className="absolute right-0 top-0 w-28 h-28 bg-gradient-to-bl from-orange-50/70 via-amber-50/20 to-transparent pointer-events-none rounded-tr-xl"></div>

                            <div className="relative z-10 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm shadow-orange-500/10">
                                    {user?.name?.charAt(0)?.toUpperCase() || "A"}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="text-sm font-bold text-slate-800 truncate leading-tight">
                                            {user?.name}
                                        </h3>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold shrink-0 border border-emerald-100">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            Aktif
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                                        {stats?.sport || "Atlet"} • {stats?.package || "Reguler"}
                                    </p>
                                </div>
                            </div>

                            <div className="relative z-10 pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                <span className="flex items-center gap-1.5 font-medium text-slate-500">
                                    <Calendar size={13} className="text-orange-500" />
                                    {todayFormatted}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-400">
                                    Hari Ini
                                </span>
                            </div>
                        </div>

                        {/* Sesi Latihan Hari Ini / Navigasi Tanggal (Sidebar Card) */}
                        <AthleteSessionsCard
                            agendas={today_agendas}
                            initialDate={selected_agenda_date}
                        />

                        {/* Pelatih Pendamping Card */}
                        <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-4 hover:border-slate-300 transition-all">
                            <div className="absolute right-0 top-0 w-28 h-28 bg-gradient-to-bl from-orange-50/70 via-amber-50/20 to-transparent pointer-events-none rounded-tr-xl"></div>

                            <div className="relative z-10 flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                    <Users size={14} />
                                </div>
                                <h4 className="text-xs font-bold text-slate-800">
                                    Pelatih Pendamping
                                </h4>
                            </div>

                            {user?.coaches && user.coaches.length > 0 ? (
                                <div className="relative z-10 space-y-2">
                                    {user.coaches.map((c) => (
                                        <div
                                            key={c.id}
                                            className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
                                        >
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                                                    {c.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <span className="text-xs font-bold text-slate-800 truncate">
                                                    {c.name}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-semibold text-slate-400">
                                                Pelatih
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="relative z-10 text-[11px] text-slate-400 italic">
                                    Belum ada pelatih khusus yang ditetapkan.
                                </p>
                            )}
                        </div>

                        {/* Menu Akses Cepat */}
                        <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-4 hover:border-slate-300 transition-all">
                            <div className="absolute right-0 top-0 w-28 h-28 bg-gradient-to-bl from-orange-50/70 via-amber-50/20 to-transparent pointer-events-none rounded-tr-xl"></div>

                            <div className="relative z-10 flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                    <Zap size={14} />
                                </div>
                                <h4 className="text-xs font-bold text-slate-800">
                                    Menu Akses Cepat
                                </h4>
                            </div>

                            <div className="relative z-10 space-y-1.5">
                                <Link
                                    href={route("athlete.profiling")}
                                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all group"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-6 h-6 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                            <Trophy size={13} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 group-hover:text-orange-600 transition-colors truncate">
                                            Profil Fisik & Analisis
                                        </span>
                                    </div>
                                    <ArrowUpRight
                                        size={14}
                                        className="text-slate-400 group-hover:text-orange-600 transition-colors"
                                    />
                                </Link>

                                <Link
                                    href={route("admin.individual-trainings.index")}
                                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all group"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-6 h-6 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                            <Dumbbell size={13} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 group-hover:text-orange-600 transition-colors truncate">
                                            Program Latihan
                                        </span>
                                    </div>
                                    <ArrowUpRight
                                        size={14}
                                        className="text-slate-400 group-hover:text-orange-600 transition-colors"
                                    />
                                </Link>

                                <Link
                                    href={route("admin.meal-plans.index")}
                                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all group"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-6 h-6 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                            <Utensils size={13} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 group-hover:text-orange-600 transition-colors truncate">
                                            Rencana Nutrisi & Makan
                                        </span>
                                    </div>
                                    <ArrowUpRight
                                        size={14}
                                        className="text-slate-400 group-hover:text-orange-600 transition-colors"
                                    />
                                </Link>

                                <Link
                                    href={route("admin.wellness-rpe.index")}
                                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all group"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-6 h-6 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                            <HeartPulse size={13} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 group-hover:text-orange-600 transition-colors truncate">
                                            Wellness & Recovery
                                        </span>
                                    </div>
                                    <ArrowUpRight
                                        size={14}
                                        className="text-slate-400 group-hover:text-orange-600 transition-colors"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Page Footer */}
            <PageFooter />
        </AppLayout>
    );
}
