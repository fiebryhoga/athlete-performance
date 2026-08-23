import { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, usePage, Link, router } from "@inertiajs/react";
import PageHeader from "@/Components/Common/PageHeader";
import PageFooter from "@/Components/Common/PageFooter";
import {
    Users,
    Activity,
    Trophy,
    TrendingUp,
    TrendingDown,
    Calendar,
    Target,
    Zap,
    Sparkles,
    User,
    ArrowRight,
    ArrowUpRight,
    ClipboardList,
    BarChart3,
    Clock,
    Flame,
    ChevronRight,
    ChevronLeft,
    Minus,
    Wallet,
} from "lucide-react";
import {
    ComposedChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
} from "recharts";

/* ───────────────────────────────────────────────
   4 ATHLETE ANALYTICS CARDS (Reference Inspired)
   ─────────────────────────────────────────────── */

const CategoryAveragesCard = ({ data }) => {
    const defaultData = [
        { name: "Speed", value: 97.0 },
        { name: "Endurance", value: 86.9 },
        { name: "Power", value: 81.8 },
        { name: "Strength", value: 72.3 },
        { name: "Agility", value: 71.3 },
        { name: "Str. Endurance", value: 59.1 },
    ];
    const rawItems = data && data.length > 0 ? data : defaultData;

    const radarItems = rawItems.map((item) => ({
        subject: `${item.name.replace("Strength Endurance", "Str. Endurance")} (${item.value})`,
        category: item.name,
        score: item.value,
        fullMark: 100,
    }));

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
                        Benchmark rata-rata atribut klien (0 - 100)
                    </p>
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
                <span>Teratas: <strong className="text-slate-800 font-bold">Speed (97.0)</strong></span>
                <span>Fokus: <strong className="text-orange-600 font-bold">Str. Endurance (59.1)</strong></span>
            </div>
        </div>
    );
};

const TopClientsCard = ({ athletes }) => {
    const defaultAthletes = [
        { name: "Indri", sport: "Kebugaran Lv 1", test_date: "05 Agu 2026", score: 91.7 },
        { name: "Clayton", sport: "Man Padel Junior", test_date: "01 Mei 2025", score: 91.3 },
        { name: "Augustin", sport: "Kebugaran Lv 1", test_date: "05 Agu 2026", score: 86.0 },
        { name: "Rini", sport: "Kebugaran Lv 1", test_date: "05 Agu 2026", score: 85.7 },
        { name: "Andri Suyoko", sport: "Kebugaran Lv 1", test_date: "27 Jul 2026", score: 77.2 },
    ];
    const items = athletes && athletes.length > 0 ? athletes : defaultAthletes;

    return (
        <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between h-full hover:border-slate-300 transition-all">
            {/* Subtle Warm Ambient Background Glow */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-orange-50/80 via-amber-50/30 to-transparent pointer-events-none rounded-tr-xl"></div>

            <div className="relative z-10 flex items-center justify-between mb-2">
                <div>
                    <h3 className="text-sm font-bold text-slate-800 leading-tight">
                        Klien Teratas
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                        Skor tertinggi dari tes fisik terbaru
                    </p>
                </div>
            </div>

            <div className="relative z-10 divide-y divide-slate-100 my-1 space-y-2">
                {items.map((ath, idx) => (
                    <div key={idx} className="flex items-center justify-between pt-2 first:pt-0">
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="w-4 text-center text-xs font-bold text-slate-400 shrink-0">
                                {idx + 1}
                            </span>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">
                                    {ath.name}
                                </p>
                                <p className="text-[10px] font-medium text-slate-400 truncate">
                                    {ath.sport} {ath.test_date ? `• ${ath.test_date}` : ""}
                                </p>
                            </div>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                            <span className="text-xs font-bold text-slate-900">
                                {ath.score} <span className="text-[10px] font-medium text-orange-600">pts</span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Helper tanggal lokal bebas offset timezone
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

const TodaySessionsSidebarCard = ({ agendas = [], initialDate }) => {
    const todayStr = toLocalYMD(new Date());
    const currentDateStr = initialDate || todayStr;
    const [isLoading, setIsLoading] = useState(false);

    // Format tanggal ke Bahasa Indonesia yang ramah (Hari Ini, Besok, Kemarin, dsb.)
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
                        Jadwal sesi Privat & Grup
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

            {/* Agendas List with smooth loading state */}
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
                                        {item.coach_name ? `Pelatih: ${item.coach_name}` : "Staf"} • Sesi #{item.session_number || 1}
                                    </p>
                                </div>

                                {item.route && (
                                    <Link
                                        href={item.route}
                                        className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors shrink-0"
                                    >
                                        <ChevronRight size={14} />
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-6 px-3 text-center bg-slate-50/70 border border-dashed border-slate-200 rounded-xl">
                        <Calendar size={18} className="mx-auto text-slate-300 mb-1" />
                        <p className="text-xs font-bold text-slate-600">
                            {isToday ? "Tidak ada sesi hari ini" : "Tidak ada sesi pada tanggal ini"}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                            Semua sesi latihan telah selesai atau belum dijadwalkan.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ───────────────────────────────────────────────
   STAT CARD — Clean & Minimal SaaS Metric Card
   ─────────────────────────────────────────────── */

const StatCard = ({
    title,
    value,
    unit,
    description,
    icon: Icon,
}) => (
    <div className="bg-white border border-slate-200/80 rounded-lg p-3.5 sm:p-4 transition-all duration-200 hover:shadow-xs hover:border-slate-300">
        {/* Top: Title on left, Subtle Icon on right */}
        <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-500 truncate">
                {title}
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <Icon size={14} strokeWidth={2} />
            </div>
        </div>

        {/* Middle: Compact Metric Value */}
        <div className="flex items-baseline gap-1 mb-1">
            <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                {value}
            </span>
            {unit && (
                <span className="text-xs font-semibold text-slate-400">
                    {unit}
                </span>
            )}
        </div>

        {/* Bottom: Context Detail */}
        {description && (
            <p className="text-[11px] font-medium text-slate-400 truncate">
                {description}
            </p>
        )}
    </div>
);

/* ───────────────────────────────────────────────
   PERFORMANCE TREND CHART — 6 Month Area Chart
   ─────────────────────────────────────────────── */

const PerformanceTrendChart = ({ trendData }) => {
    // Realistis 10 weeks data: score 0 (turun) jika tidak ada tes fisik
    const defaultData = [
        { week: "15 Jun", range: "15 Jun - 21 Jun", score: 0, sessions: 1, private: 1, group: 0, tests: 0 },
        { week: "22 Jun", range: "22 Jun - 28 Jun", score: 0, sessions: 3, private: 3, group: 0, tests: 0 },
        { week: "29 Jun", range: "29 Jun - 05 Jul", score: 0, sessions: 23, private: 18, group: 5, tests: 0 },
        { week: "06 Jul", range: "06 Jul - 12 Jul", score: 0, sessions: 12, private: 7, group: 5, tests: 0 },
        { week: "13 Jul", range: "13 Jul - 19 Jul", score: 50.9, sessions: 27, private: 18, group: 8, tests: 1 },
        { week: "20 Jul", range: "20 Jul - 26 Jul", score: 0, sessions: 38, private: 28, group: 10, tests: 0 },
        { week: "27 Jul", range: "27 Jul - 02 Aug", score: 70.0, sessions: 58, private: 46, group: 9, tests: 3 },
        { week: "03 Aug", range: "03 Aug - 09 Aug", score: 69.0, sessions: 41, private: 23, group: 10, tests: 8 },
        { week: "10 Aug", range: "10 Aug - 16 Aug", score: 58.6, sessions: 29, private: 24, group: 3, tests: 2 },
        { week: "17 Aug", range: "17 Aug - 23 Aug", score: 0, sessions: 1, private: 1, group: 0, tests: 0 },
    ];

    const chartData = trendData && trendData.length > 0 ? trendData : defaultData;

    return (
        <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-5 hover:border-slate-300 transition-all">
            {/* Subtle Warm Ambient Background Glow */}
            <div className="absolute right-0 top-0 w-48 h-36 bg-gradient-to-bl from-orange-50/70 via-amber-50/20 to-transparent pointer-events-none rounded-tr-xl"></div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                        <TrendingUp size={16} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight truncate">
                            Tren Performa & Volume Sesi Mingguan
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">
                            Statistik 10 minggu skor fisik & rincian sesi latihan
                        </p>
                    </div>
                </div>

                {/* Legend — Aligned to the Right */}
                <div className="flex items-center gap-3.5 text-[11px] font-semibold shrink-0 sm:ml-auto">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-xs bg-orange-600 shadow-2xs"></div>
                        <span className="text-slate-600">Privat</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-xs bg-amber-400 shadow-2xs"></div>
                        <span className="text-slate-600">Grup</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-950 border border-orange-800 shadow-2xs"></div>
                        <span className="text-slate-600">Skor Fisik</span>
                    </div>
                </div>
            </div>

            <div className="h-[235px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="week"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }}
                            angle={-25}
                            textAnchor="end"
                            height={32}
                            interval={0}
                        />
                        <YAxis
                            yAxisId="left"
                            domain={[0, 70]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 10 }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            domain={[0, 100]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#ea580c", fontSize: 10 }}
                            hide={true}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0]?.payload;
                                    const hasScore = data?.score !== null && data?.score > 0;
                                    return (
                                        <div className="bg-white text-slate-800 rounded-lg px-3.5 py-2.5 text-xs shadow-md border border-slate-200/90 space-y-1.5 min-w-[210px]">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                                <span className="font-bold text-slate-900 text-[11px]">
                                                    {data?.range || data?.week}
                                                </span>
                                                <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
                                                    {data?.week}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4 text-slate-600 text-[11px]">
                                                <span>Skor Fisik:</span>
                                                <span className={`font-bold ${hasScore ? "text-orange-950" : "text-slate-400 italic font-normal"}`}>
                                                    {hasScore ? `${data.score} pts` : "— (Tidak ada tes)"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4 text-slate-600 text-[11px]">
                                                <span>Total Sesi:</span>
                                                <span className="font-bold text-slate-900">{data?.sessions || 0}</span>
                                            </div>
                                            <div className="text-[10px] text-slate-400 pt-1.5 border-t border-slate-100 flex justify-between gap-2 font-medium">
                                                <span className="text-orange-600 font-semibold">Privat: <strong className="text-slate-900 font-bold">{data?.private || 0}</strong></span>
                                                <span>•</span>
                                                <span className="text-amber-500 font-semibold">Grup: <strong className="text-slate-900 font-bold">{data?.group || 0}</strong></span>
                                                <span>•</span>
                                                <span>Tes: <strong className="text-slate-900 font-bold">{data?.tests || 0}</strong></span>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        {/* Stacked Chunky Bars with Deep Orange & Warm Amber */}
                        <Bar
                            yAxisId="left"
                            dataKey="private"
                            name="Sesi Privat"
                            stackId="sessions"
                            fill="#ea580c"
                            radius={[0, 0, 0, 0]}
                            barSize={44}
                        />
                        <Bar
                            yAxisId="left"
                            dataKey="group"
                            name="Sesi Grup"
                            stackId="sessions"
                            fill="#fbbf24"
                            radius={[4, 4, 0, 0]}
                            barSize={44}
                        />
                        {/* Dashed Line for Physical Score: Drops down when empty, solid unbroken dots */}
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="score"
                            name="Skor Fisik"
                            stroke="#431407"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            connectNulls={true}
                            dot={(props) => {
                                const { cx, cy } = props;
                                if (!cx || !cy) return null;
                                return (
                                    <circle
                                        key={`dot-${cx}-${cy}`}
                                        cx={cx}
                                        cy={cy}
                                        r={4.5}
                                        fill="#ffffff"
                                        stroke="#431407"
                                        strokeWidth={2}
                                        strokeDasharray="none"
                                    />
                                );
                            }}
                            activeDot={(props) => {
                                const { cx, cy } = props;
                                if (!cx || !cy) return null;
                                return (
                                    <circle
                                        key={`act-dot-${cx}-${cy}`}
                                        cx={cx}
                                        cy={cy}
                                        r={6.5}
                                        fill="#ea580c"
                                        stroke="#431407"
                                        strokeWidth={2}
                                        strokeDasharray="none"
                                    />
                                );
                            }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

/* ───────────────────────────────────────────────
   COACH EARNINGS & FEE SUMMARY CARD (MONTHLY)
   ─────────────────────────────────────────────── */

const CoachEarningsCard = ({ salaryData }) => {
    const currentMonthStr = new Date().toISOString().slice(0, 7); // "YYYY-MM"
    const selectedMonth = salaryData?.month || currentMonthStr;
    const [isLoading, setIsLoading] = useState(false);

    const formatRupiah = (val) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(val || 0);
    };

    const formatShortRupiah = (val) => {
        const num = val || 0;
        if (num >= 1000000) {
            return `Rp ${(num / 1000000).toFixed(1).replace(/\.0$/, "")} jt`;
        }
        if (num >= 1000) {
            return `Rp ${(num / 1000).toFixed(0)} rb`;
        }
        return `Rp ${num}`;
    };

    const fetchMonthData = (monthStr) => {
        setIsLoading(true);
        router.get(
            route("dashboard"),
            { salary_month: monthStr },
            {
                preserveState: true,
                preserveScroll: true,
                only: ["coach_salaries"],
                onFinish: () => setIsLoading(false),
            }
        );
    };

    const handleNavigateMonth = (offsetMonths) => {
        const [year, month] = selectedMonth.split("-").map(Number);
        const d = new Date(year, month - 1 + offsetMonths, 1, 12, 0, 0);
        const newYear = d.getFullYear();
        const newMonth = String(d.getMonth() + 1).padStart(2, "0");
        const newMonthStr = `${newYear}-${newMonth}`;
        fetchMonthData(newMonthStr);
    };

    const handleDirectMonthChange = (e) => {
        const newMonthStr = e.target.value;
        if (!newMonthStr) return;
        fetchMonthData(newMonthStr);
    };

    const handleResetThisMonth = () => {
        fetchMonthData(currentMonthStr);
    };

    const isCurrentMonth = selectedMonth === currentMonthStr;
    const coaches = salaryData?.coaches || [];
    const activeCoaches = coaches.filter((c) => (c.total_fee || 0) > 0);

    return (
        <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-5 hover:border-slate-300 transition-all">
            {/* Subtle Warm Ambient Background Glow */}
            <div className="absolute right-0 top-0 w-48 h-36 bg-gradient-to-bl from-orange-50/70 via-amber-50/20 to-transparent pointer-events-none rounded-tr-xl"></div>

            {/* Header & Total Recap */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                        <Wallet size={16} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight truncate">
                            Rekap Gaji & Fee Pelatih
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">
                            Rincian fee sesi privat, latihan grup, dan shift jaga gym
                        </p>
                    </div>
                </div>

                {/* Total Stats Banner */}
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-1.5 shrink-0 self-start md:self-auto">
                    <div className="text-right">
                        <p className="text-[10px] font-semibold text-slate-400 leading-tight">Total Fee {salaryData?.month_label}</p>
                        <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                            {formatRupiah(salaryData?.total_fee)}
                        </p>
                    </div>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <div className="text-[10px] space-y-0.5">
                        <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>Cair: {formatShortRupiah(salaryData?.paid_fee)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-600 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            <span>Belum: {formatShortRupiah(salaryData?.unpaid_fee)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Month Selector Bar */}
            <div className="relative z-10 flex items-center justify-between gap-2 bg-slate-50 border border-slate-200/80 rounded-lg p-1.5 mb-4">
                <button
                    type="button"
                    onClick={() => handleNavigateMonth(-1)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-white transition-all active:scale-95 shrink-0"
                    title="Bulan Sebelumnya"
                >
                    <ChevronLeft size={15} />
                </button>

                {/* Month Picker Display */}
                <div className="relative flex-1 flex items-center justify-center gap-1.5 text-center cursor-pointer group">
                    <Calendar size={13} className="text-orange-500 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-slate-700 select-none group-hover:text-orange-600 transition-colors">
                        {salaryData?.month_label || selectedMonth}
                    </span>
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={handleDirectMonthChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        title="Pilih bulan dari kalender"
                    />
                </div>

                <button
                    type="button"
                    onClick={() => handleNavigateMonth(1)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-white transition-all active:scale-95 shrink-0"
                    title="Bulan Berikutnya"
                >
                    <ChevronRight size={15} />
                </button>

                {/* Reset to This Month */}
                {!isCurrentMonth && (
                    <button
                        type="button"
                        onClick={handleResetThisMonth}
                        className="px-2 py-0.5 rounded bg-orange-500 text-white text-[10px] font-bold hover:bg-orange-600 transition-all shrink-0 active:scale-95"
                        title="Kembali ke Bulan Ini"
                    >
                        Bulan Ini
                    </button>
                )}
            </div>

            {/* Coaches List / Cards */}
            <div className={`relative z-10 transition-opacity duration-200 ${isLoading ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
                {activeCoaches && activeCoaches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {activeCoaches.map((c) => (
                            <div
                                key={c.coach_id}
                                className="bg-white border border-slate-200/80 rounded-xl p-3.5 hover:border-orange-200 hover:shadow-xs transition-all flex flex-col justify-between"
                            >
                                <div>
                                    {/* Coach Header */}
                                    <div className="flex items-center justify-between gap-2 mb-2.5">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[11px] shrink-0 shadow-2xs">
                                                {c.initials || "C"}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                                                    {c.coach_name}
                                                </h4>
                                                <p className="text-[10px] text-slate-400 font-medium truncate capitalize">
                                                    {c.role === "superadmin" ? "Super Admin" : "Pelatih"}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                                            {c.total_sessions} Sesi
                                        </span>
                                    </div>

                                    {/* Sesi Breakdown Pills (Only show active categories with fee > 0) */}
                                    <div className="space-y-1 text-[10px] text-slate-600 mb-3 bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                                        {c.individual_fee > 0 && (
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-1 font-medium">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                                    Privat ({c.individual_count})
                                                </span>
                                                <span className="font-semibold text-slate-800">{formatShortRupiah(c.individual_fee)}</span>
                                            </div>
                                        )}
                                        {c.group_fee > 0 && (
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-1 font-medium">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                                    Grup ({c.group_count})
                                                </span>
                                                <span className="font-semibold text-slate-800">{formatShortRupiah(c.group_fee)}</span>
                                            </div>
                                        )}
                                        {c.gym_fee > 0 && (
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-1 font-medium">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                    Jaga Gym ({c.gym_count})
                                                </span>
                                                <span className="font-semibold text-slate-800">{formatShortRupiah(c.gym_fee)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Total Fee & Payment Status Footer */}
                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] font-semibold text-slate-400">Total Fee</p>
                                        <p className="text-xs font-black text-orange-600">
                                            {formatRupiah(c.total_fee)}
                                        </p>
                                    </div>
                                    <div className="text-right text-[10px]">
                                        {c.unpaid_fee > 0 ? (
                                            <span className="inline-flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                                Belum: {formatShortRupiah(c.unpaid_fee)}
                                            </span>
                                        ) : c.total_fee > 0 ? (
                                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                                Lunas
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 font-medium">—</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-8 px-4 text-center bg-slate-50/70 border border-dashed border-slate-200 rounded-xl">
                        <Wallet size={20} className="mx-auto text-slate-300 mb-1.5" />
                        <p className="text-xs font-bold text-slate-600">
                            Tidak ada fee pelatih pada {salaryData?.month_label || selectedMonth}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                            Belum ada sesi latihan atau shift gym yang tercatat untuk bulan ini.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ───────────────────────────────────────────────
   HERO GREETING — Compact & Clean
   ─────────────────────────────────────────────── */

const HeroGreeting = ({ user, stats }) => {
    const roleLabel = user?.role === "superadmin" ? "Super Admin" : "Pelatih";

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
                        Pantau kesiapan dan progres latihan klien secara langsung (<span className="italic">real-time</span>). Saat ini mengelola{" "}
                        <span className="font-bold text-slate-900">
                            {stats?.total_atlet || 0} klien aktif
                        </span>{" "}
                        dan{" "}
                        <span className="font-bold text-orange-600">
                            {stats?.sesi_bulan_ini || 0} sesi latihan
                        </span>{" "}
                        bulan ini untuk mendorong performa optimal.
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
   TODAY'S AGENDA — Clean schedule list
   ─────────────────────────────────────────────── */

const AgendaSection = ({ agendas }) => (
    <div className="bg-white border border-slate-200/80 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                    <ClipboardList size={15} />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-slate-900 leading-tight">
                        Jadwal Hari Ini
                    </h2>
                    <p className="text-[11px] text-slate-400 font-medium">
                        {new Date().toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </div>
            <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-bold rounded-lg">
                {agendas?.length || 0} Sesi
            </span>
        </div>
        <div className="p-4">
            {agendas?.length > 0 ? (
                <div className="space-y-2.5">
                    {agendas.map((agenda, index) => (
                        <div
                            key={index}
                            className="group flex items-center justify-between p-3.5 bg-slate-50/70 border border-slate-100 hover:border-slate-200 hover:bg-white rounded-lg transition-all"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                                        agenda.is_group
                                            ? "bg-purple-100 text-purple-700"
                                            : "bg-blue-100 text-blue-700"
                                    }`}
                                >
                                    {agenda.is_group ? (
                                        <Users size={14} />
                                    ) : (
                                        <User size={14} />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="text-xs font-bold text-slate-800 truncate">
                                            {agenda.participant_name}
                                        </h3>
                                        <span
                                            className={`px-1.5 py-0.5 text-[9px] font-bold rounded-lg shrink-0 ${
                                                agenda.is_group
                                                    ? "bg-purple-50 text-purple-600 border border-purple-100"
                                                    : "bg-blue-50 text-blue-600 border border-blue-100"
                                            }`}
                                        >
                                            {agenda.is_group
                                                ? "Grup"
                                                : "Privat"}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium truncate">
                                        Sesi {agenda.session_number || "-"} •
                                        Coach: {agenda.coach_name}
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={agenda.route}
                                className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-900 text-slate-600 hover:text-white border border-slate-200 hover:border-slate-900 rounded-lg text-[11px] font-bold transition-all shrink-0"
                            >
                                Kelola <ArrowRight size={12} />
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-10 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                    <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center text-slate-300 shadow-xs mb-3 border border-slate-100">
                        <ClipboardList size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-700 mb-1">
                        Tidak ada jadwal hari ini
                    </h3>
                    <p className="text-slate-400 text-xs max-w-xs">
                        Semua jadwal telah selesai atau belum dijadwalkan.
                    </p>
                </div>
            )}
        </div>
    </div>
);

/* ───────────────────────────────────────────────
   DEMOGRAPHICS CARD — Gender & Age (Top) + BMI (Bottom)
   ─────────────────────────────────────────────── */

const DemographicsCard = ({ genderData = [], ageData = [], bmiData = [] }) => {
    const maleItem = genderData?.find((g) => g.name === "Laki-laki" || g.name === "Male") || { value: 61, color: "#ea580c" };
    const femaleItem = genderData?.find((g) => g.name === "Perempuan" || g.name === "Female") || { value: 31, color: "#fb923c" };
    const genderTotal = (maleItem.value || 0) + (femaleItem.value || 0);

    const defaultGenderList = [
        { name: "Laki-laki", value: maleItem.value || 61, color: "#ea580c" },
        { name: "Perempuan", value: femaleItem.value || 31, color: "#fb923c" },
    ];

    const defaultAgeData = [
        { name: "Anak (<18)", short: "Anak", value: 15, color: "#0284c7" },
        { name: "Dewasa (18-50)", short: "Dewasa", value: 27, color: "#10b981" },
        { name: "Lansia (>50)", short: "Lansia", value: 15, color: "#f97316" },
    ];
    const formattedAgeData = (ageData && ageData.length > 0 ? ageData : defaultAgeData).map((d, i) => ({
        name: d.name,
        short: d.name.split(" ")[0],
        value: d.value,
        color: d.color || (i === 0 ? "#0284c7" : i === 1 ? "#10b981" : "#f97316"),
    }));
    const ageTotal = formattedAgeData.reduce((sum, item) => sum + (item.value || 0), 0);

    const defaultBmiData = [
        { name: "Underweight", range: "< 18.5", value: 7, color: "#0284c7" },
        { name: "Normal", range: "18.5-24.9", value: 25, color: "#10b981" },
        { name: "Overweight", range: "25-29.9", value: 12, color: "#f59e0b" },
        { name: "Obesitas", range: "≥ 30", value: 8, color: "#ef4444" },
    ];
    const formattedBmiData = (bmiData && bmiData.length > 0 ? bmiData : defaultBmiData).map((d, i) => ({
        name: d.name === "Obese" ? "Obesitas" : d.name,
        range: d.range || "",
        value: d.value,
        color: d.color || (i === 0 ? "#0284c7" : i === 1 ? "#10b981" : i === 2 ? "#f59e0b" : "#ef4444"),
    }));
    const bmiTotal = formattedBmiData.reduce((sum, item) => sum + (item.value || 0), 0);

    return (
        <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-5 hover:border-slate-300 transition-all space-y-3.5">
            {/* Subtle Warm Ambient Background Glow */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-orange-50/70 via-amber-50/20 to-transparent pointer-events-none rounded-tr-xl"></div>

            <div className="relative z-10">
                <h4 className="text-sm font-bold text-slate-800 leading-tight">
                    Demografi Klien
                </h4>
                <p className="text-[11px] text-slate-400 font-medium">
                    Distribusi jenis kelamin, kelompok usia & status BMI
                </p>
            </div>

            {/* TOP ROW: 2 Donut Charts (Gender & Usia) */}
            <div className="relative z-10 grid grid-cols-2 gap-4 divide-x divide-slate-100">
                {/* 1. Gender Donut */}
                <div className="flex flex-col items-center pr-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Jenis Kelamin
                    </p>
                    <div className="h-[90px] w-[90px] relative flex items-center justify-center mb-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={defaultGenderList}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={27}
                                    outerRadius={41}
                                    paddingAngle={3}
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    {defaultGenderList.map((entry, idx) => (
                                        <Cell key={`gender-${idx}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xs font-black text-slate-800 leading-none">
                                {genderTotal}
                            </span>
                            <span className="text-[8px] font-semibold text-slate-400">Total</span>
                        </div>
                    </div>

                    <div className="w-full space-y-1.5 text-[11px]">
                        {defaultGenderList.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-slate-600 font-medium">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                                    {item.name}
                                </span>
                                <span className="font-bold text-slate-800">
                                    {item.value} <span className="text-slate-400 text-[10px] font-normal">({genderTotal > 0 ? Math.round((item.value / genderTotal) * 100) : 0}%)</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Age Donut */}
                <div className="flex flex-col items-center pl-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Kelompok Usia
                    </p>
                    <div className="h-[90px] w-[90px] relative flex items-center justify-center mb-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={formattedAgeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={27}
                                    outerRadius={41}
                                    paddingAngle={3}
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    {formattedAgeData.map((entry, idx) => (
                                        <Cell key={`age-${idx}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xs font-black text-slate-800 leading-none">
                                {ageTotal}
                            </span>
                            <span className="text-[8px] font-semibold text-slate-400">Total</span>
                        </div>
                    </div>

                    <div className="w-full space-y-1.5 text-[11px]">
                        {formattedAgeData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-slate-600 font-medium">
                                <span className="flex items-center gap-1.5 truncate max-w-[70px]">
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                                    {item.short}
                                </span>
                                <span className="font-bold text-slate-800 shrink-0">
                                    {item.value} <span className="text-slate-400 text-[10px] font-normal">({ageTotal > 0 ? Math.round((item.value / ageTotal) * 100) : 0}%)</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* BOTTOM SECTION: Status BMI */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Status BMI Klien
                    </p>
                    <span className="text-[10px] font-semibold text-slate-500">
                        {bmiTotal} Terukur
                    </span>
                </div>

                {/* Legend Info directly above the bar */}
                <div className="flex items-center justify-between text-[10px] text-slate-600 font-medium px-0.5 pt-0.5">
                    {formattedBmiData.map((item, idx) => (
                        <span key={idx} className="flex items-center gap-1">
                            <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: item.color }}
                            ></span>
                            <span className="font-semibold text-slate-700">{item.name}</span>
                        </span>
                    ))}
                </div>

                {/* Multi-segmented BMI Progress Bar */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                    {formattedBmiData.map((item, idx) => {
                        const pct = bmiTotal > 0 ? (item.value / bmiTotal) * 100 : 0;
                        if (pct <= 0) return null;
                        return (
                            <div
                                key={idx}
                                style={{
                                    width: `${pct}%`,
                                    backgroundColor: item.color,
                                }}
                                className="h-full first:rounded-l-full last:rounded-r-full transition-all"
                                title={`${item.name}: ${item.value} (${Math.round(pct)}%)`}
                            ></div>
                        );
                    })}
                </div>

                {/* BMI 4-column breakdown */}
                <div className="grid grid-cols-4 gap-1.5 pt-1 text-center">
                    {formattedBmiData.map((item, idx) => (
                        <div key={idx} className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                            <p className="text-[9px] font-bold text-slate-600 truncate">
                                {item.name}
                            </p>
                            <p className="text-xs font-black text-slate-900 mt-0.5">
                                {item.value}
                            </p>
                            <p className="text-[8px] text-slate-400">
                                {bmiTotal > 0 ? Math.round((item.value / bmiTotal) * 100) : 0}%
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ───────────────────────────────────────────────
   CABOR PERFORMANCE — Clean SaaS Ranking List
   ─────────────────────────────────────────────── */

const CaborPerformance = ({ caborData }) => (
    <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-5 hover:border-slate-300 transition-all">
        {/* Subtle Warm Ambient Background Glow */}
        <div className="absolute right-0 top-0 w-28 h-28 bg-gradient-to-bl from-orange-50/70 via-amber-50/20 to-transparent pointer-events-none rounded-tr-xl"></div>

        <div className="relative z-10 flex items-center justify-between mb-3">
            <div>
                <h4 className="text-sm font-bold text-slate-800 leading-tight">
                    Performa Cabor
                </h4>
                <p className="text-[11px] text-slate-400 font-medium">
                    Rata-rata skor fisik per cabang olahraga
                </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                Top 5
            </span>
        </div>

        <div className="divide-y divide-slate-100 space-y-2">
            {caborData?.length > 0 ? (
                caborData.slice(0, 5).map((cabor, i) => (
                    <div
                        key={i}
                        className="pt-2 first:pt-0 flex items-center justify-between gap-3"
                    >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            {/* Rank Number */}
                            <span
                                className={`text-xs font-bold w-4 text-center shrink-0 ${
                                    i === 0 ? "text-orange-600 font-extrabold" : "text-slate-400"
                                }`}
                            >
                                {i + 1}
                            </span>

                            {/* Cabor Name & Bar */}
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-800 truncate mb-1">
                                    {cabor.name}
                                </p>
                                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                                            i === 0
                                                ? "bg-gradient-to-r from-orange-500 to-amber-500"
                                                : "bg-slate-300"
                                        }`}
                                        style={{
                                            width: `${Math.min((cabor.score / 100) * 100, 100)}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Score */}
                        <div className="text-right shrink-0 ml-2">
                            <span className="text-xs font-bold text-slate-900">
                                {cabor.score}{" "}
                                <span className="text-[10px] text-orange-600 font-semibold">
                                    pts
                                </span>
                            </span>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center text-xs text-slate-400 py-6">
                    Belum ada data cabor
                </div>
            )}
        </div>
    </div>
);

/* ───────────────────────────────────────────────
   TOP ATHLETES — Clean table list
   ─────────────────────────────────────────────── */

const TopAthletes = ({ athletes }) => (
    <div className="bg-white border border-slate-200/80 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <div className="p-1 bg-amber-50 rounded-lg text-amber-600">
                    <Trophy size={14} />
                </div>
                Top Atlet
            </h3>
            <Link
                href={route("admin.athletes.index")}
                className="text-[11px] font-semibold text-slate-400 hover:text-orange-600 flex items-center gap-0.5 transition-colors"
            >
                Lihat Semua <ChevronRight size={12} />
            </Link>
        </div>
        <div>
            {athletes?.length > 0 ? (
                <div className="divide-y divide-slate-50">
                    {athletes.map((atlet, index) => (
                        <div
                            key={index}
                            className="px-5 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                        index === 0
                                            ? "bg-amber-100 text-amber-800"
                                            : index === 1
                                              ? "bg-slate-200 text-slate-700"
                                              : index === 2
                                                ? "bg-orange-100 text-orange-700"
                                                : "bg-slate-100 text-slate-500"
                                    }`}
                                >
                                    #{index + 1}
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-800 leading-tight">
                                        {atlet.name}
                                    </h4>
                                    <p className="text-[10px] font-medium text-slate-400">
                                        {atlet.sport}
                                    </p>
                                </div>
                            </div>
                            <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-bold">
                                {atlet.score}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center text-xs text-slate-400 min-h-[140px]">
                    Belum ada data atlet
                </div>
            )}
        </div>
    </div>
);

/* ───────────────────────────────────────────────
   RADAR CHART — Benchmark Analysis
   ─────────────────────────────────────────────── */

const BenchmarkRadar = ({ radarData }) => (
    <div className="bg-white border border-slate-200/80 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <div className="p-1 bg-slate-100 rounded-lg text-slate-600">
                    <Target size={14} />
                </div>
                Benchmark Analysis
            </h3>
            <div className="flex items-center gap-3 text-[10px] font-semibold">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-slate-500">Rata-rata</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    <span className="text-slate-500">Target</span>
                </div>
            </div>
        </div>
        <div className="p-4 min-h-[280px]">
            <ResponsiveContainer width="100%" height={260}>
                {radarData?.length > 0 ? (
                    <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="72%"
                        data={radarData}
                    >
                        <defs>
                            <linearGradient
                                id="colorRadar"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#f97316"
                                    stopOpacity={0.35}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#f97316"
                                    stopOpacity={0.03}
                                />
                            </linearGradient>
                        </defs>
                        <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{
                                fill: "#475569",
                                fontSize: 11,
                                fontWeight: 600,
                            }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={false}
                            axisLine={false}
                        />
                        <Radar
                            name="Target"
                            dataKey="B"
                            stroke="#cbd5e1"
                            strokeWidth={1.5}
                            strokeDasharray="4 4"
                            fill="transparent"
                        />
                        <Radar
                            name="Athlete"
                            dataKey="A"
                            stroke="#f97316"
                            strokeWidth={2}
                            fill="url(#colorRadar)"
                            fillOpacity={1}
                        />
                    </RadarChart>
                ) : (
                    <div className="flex items-center justify-center h-full text-xs text-slate-400">
                        Tidak ada data
                    </div>
                )}
            </ResponsiveContainer>
        </div>
    </div>
);

/* ───────────────────────────────────────────────
   RECENT ACTIVITY — Compact activity feed
   ─────────────────────────────────────────────── */

const RecentActivity = ({ activity }) => (
    <div className="bg-white border border-slate-200/80 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <div className="p-1 bg-slate-100 rounded-lg text-slate-600">
                    <Activity size={14} />
                </div>
                Aktivitas Terbaru
            </h3>
            <Link
                href={route("admin.performance.index")}
                className="text-[11px] font-semibold text-slate-400 hover:text-orange-600 flex items-center gap-0.5 transition-colors"
            >
                Selengkapnya <ChevronRight size={12} />
            </Link>
        </div>
        <div>
            {activity?.length > 0 ? (
                <div className="divide-y divide-slate-50">
                    {activity.map((item, index) => (
                        <div
                            key={index}
                            className="px-5 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-[11px] shrink-0">
                                    {item.user?.charAt(0)?.toUpperCase() || "A"}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-800 truncate">
                                        {item.user}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-medium truncate">
                                        {item.title} • {item.sport}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right shrink-0 ml-3">
                                <span className="inline-block px-2 py-0.5 bg-slate-50 text-slate-700 border border-slate-100 rounded-lg text-[11px] font-bold">
                                    {item.score}
                                </span>
                                <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                                    {item.date}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center text-xs text-slate-400 min-h-[120px]">
                    Belum ada aktivitas
                </div>
            )}
        </div>
    </div>
);

/* ───────────────────────────────────────────────
   QUICK INFO SIDEBAR STATS
   ─────────────────────────────────────────────── */

const QuickInfo = ({ label, value, icon: Icon }) => (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200/80 rounded-lg hover:border-slate-300 transition-colors">
        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
            <Icon size={15} />
        </div>
        <div className="min-w-0">
            <p className="text-[10px] font-medium text-slate-400 mb-0.5">
                {label}
            </p>
            <p className="text-sm font-bold text-slate-800 leading-none truncate">
                {value}
            </p>
        </div>
    </div>
);

/* ═══════════════════════════════════════════════
   MAIN DASHBOARD PAGE
   ═══════════════════════════════════════════════ */

export default function Dashboard({ auth }) {
    const {
        stats = {},
        performance_pulse = {},
        charts = { radar: [], gender: [] },
        lists = {
            recent_activity: [],
            top_athletes: [],
            cabor_performance: [],
        },
        today_agendas = [],
        selected_agenda_date = null,
        coach_salaries = {},
    } = usePage().props;

    return (
        <AppLayout title="Dashboard">
            <Head title="Ringkasan Performa" />

            <div className="space-y-3.5 pb-1">
                {/* Page Title & Subtitle Header */}
                <PageHeader
                    title="Dashboard"
                    description="Ringkasan target objektif dan performa operasional klien & pelatih."
                />

                <div className="flex flex-col lg:flex-row gap-4">
                    {/* ═══════════════════════════════════════
                        KOLOM KIRI — MAIN CONTENT (LEBAR)
                       ═══════════════════════════════════════ */}
                    <div className="flex-1 min-w-0 space-y-4">
                        {/* Hero Greeting */}
                        <HeroGreeting user={auth?.user} stats={stats} />

                        {/* 2 Performance Overview Cards: Physical Categories & Top Clients */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CategoryAveragesCard data={performance_pulse?.category_averages} />
                            <TopClientsCard athletes={performance_pulse?.top_clients} />
                        </div>

                        {/* Interactive Weekly Performance & Volume Trend Chart */}
                        <PerformanceTrendChart trendData={charts?.weekly_trend || charts?.monthly_trend} />

                        {/* Rekap Gaji & Fee Pelatih (Filter Per Bulan) */}
                        <CoachEarningsCard salaryData={coach_salaries} />
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
                                    {auth?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="text-sm font-bold text-slate-800 truncate leading-tight">
                                            {auth?.user?.name}
                                        </h3>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold shrink-0">
                                            {auth?.user?.role === "superadmin" ? "Super Admin" : "Pelatih"}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                                        {auth?.user?.email || "Operasional Performa"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                                <div className="flex items-center gap-2 text-slate-600 font-medium">
                                    <Calendar size={13} className="text-slate-400" />
                                    <span>
                                        {new Date().toLocaleDateString("id-ID", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                    Aktif
                                </span>
                            </div>
                        </div>

                        {/* Sesi Latihan (Filter Tanggal Interaktif) */}
                        <TodaySessionsSidebarCard
                            agendas={today_agendas}
                            initialDate={selected_agenda_date}
                        />

                        {/* Demografi Klien (Gender, Usia & BMI) */}
                        <DemographicsCard
                            genderData={charts?.gender}
                            ageData={charts?.age_groups}
                            bmiData={charts?.bmi_groups}
                        />

                        {/* Cabor Performance */}
                        <CaborPerformance
                            caborData={lists?.cabor_performance}
                        />
                    </div>
                </div>

                {/* Reusable Page Footer */}
                <PageFooter />
            </div>
        </AppLayout>
    );
}
