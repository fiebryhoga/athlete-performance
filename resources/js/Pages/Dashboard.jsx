import AppLayout from "@/Layouts/AppLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import {
    Users,
    Activity,
    Trophy,
    TrendingUp,
    Calendar,
    Ruler,
    Weight,
    Timer,
    Target,
    Zap,
    ChevronRight,
    Sparkles,
    User,
    Dumbbell,
    ArrowRight,
    ClipboardList,
} from "lucide-react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
} from "recharts";

const StatCard = ({ title, value, icon: Icon, colorClass, isText }) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all flex items-center justify-between group cursor-default">
        <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3
                className={`font-bold ${isText ? "text-xl text-slate-700" : "text-3xl text-slate-900"}`}
            >
                {value}
            </h3>
        </div>
        <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform`}
        >
            <Icon size={24} />
        </div>
    </div>
);

const MiniStatCard = ({ label, value, unit, icon: Icon }) => (
    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-4 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all cursor-default group">
        <div className="w-10 h-10 rounded-full bg-white border border-slate-100 group-hover:border-orange-100 flex items-center justify-center text-slate-500 group-hover:text-orange-500 transition-colors">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                {label}
            </p>
            <p className="text-lg font-bold text-slate-800 leading-none">
                {value}{" "}
                <span className="text-xs font-medium text-slate-500 ml-0.5">
                    {unit}
                </span>
            </p>
        </div>
    </div>
);

export default function Dashboard({ auth }) {
    const {
        stats = {},
        charts = { radar: [], gender: [] },
        lists = {
            recent_activity: [],
            top_athletes: [],
            cabor_performance: [],
        },
        today_agendas = [],
    } = usePage().props;

    const GENDER_COLORS = ["orange-500", "#ec4899"];

    return (
        <AppLayout title="Dashboard">
            <Head title="Performance Overview" />

            <div className="space-y-8 pb-10">
                {/* HERO HEADER */}
                <div className="relative min-h-[300px] flex mb-8 group">
                    <div className="absolute inset-0 rounded-2xl shadow-xl shadow-orange-500/10 border border-orange-500/20 overflow-hidden z-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-[#ff6600] to-[#ff8c00]"></div>
                        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
                        <div className="absolute -right-20 -top-20 w-[400px] h-[400px] border-[40px] border-white/5 rounded-full pointer-events-none"></div>
                        <div className="absolute right-32 -bottom-24 w-[300px] h-[300px] border-[20px] border-white/5 rounded-full pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/20 rounded-full mix-blend-overlay filter blur-[100px] animate-pulse pointer-events-none"></div>
                    </div>

                    <div className="absolute right-4 md:right-12 -bottom-0 z-10 h-[350px] md:h-[420px] pointer-events-none hidden md:block opacity-90">
                        <img
                            src="/assets/images/model2.png"
                            alt="Athlete Model"
                            className="h-full w-auto object-contain object-bottom drop-shadow-2xl"
                        />
                    </div>

                    <div className="relative z-20 flex flex-col justify-between w-full h-full p-8 md:p-10">
                        <div className="max-w-xl xl:max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-5 shadow-sm">
                                <Sparkles
                                    size={14}
                                    className="text-yellow-200 fill-yellow-200"
                                />
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                    {auth?.user?.role === "superadmin"
                                        ? "Superadmin Hub"
                                        : "Coach Hub"}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 drop-shadow-sm leading-tight">
                                Welcome back, <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-white">
                                    {auth?.user?.name} 👋
                                </span>
                            </h1>

                            <p className="text-orange-100 text-sm md:text-base leading-relaxed font-medium max-w-lg mb-8 md:mb-10">
                                Berikut adalah ringkasan sistem. Anda mengelola{" "}
                                <span className="font-bold text-white border-b border-white/40 pb-0.5">
                                    {stats?.total_atlet || 0} atlet aktif
                                </span>{" "}
                                dengan total {stats?.sesi_bulan_ini || 0} sesi
                                latihan bulan ini.
                            </p>
                        </div>

                        <div className="w-fit flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-4 rounded-xl shadow-lg hover:bg-white/20 transition-all cursor-default relative overflow-hidden group/date">
                            <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-0 group-hover/date:animate-shine"></div>
                            <div className="relative z-10 w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-orange-500 shrink-0">
                                <Calendar size={20} strokeWidth={2.5} />
                            </div>
                            <div className="relative z-10 pr-2">
                                <p className="text-[10px] text-orange-200 font-bold mb-0.5 uppercase tracking-wider">
                                    Hari Ini
                                </p>
                                <p className="text-base font-bold text-white leading-none whitespace-nowrap">
                                    {new Date().toLocaleDateString("id-ID", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* QUICK STATS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard
                        title="Total Atlet Aktif"
                        value={stats?.total_atlet || 0}
                        icon={Users}
                        colorClass="bg-orange-50 text-orange-500"
                    />
                    <StatCard
                        title="Sesi Bulan Ini"
                        value={stats?.sesi_bulan_ini || 0}
                        icon={Calendar}
                        colorClass="bg-blue-50 text-blue-600"
                    />
                    <StatCard
                        title="Rata-rata Skor Global"
                        value={stats?.avg_skor_global || 0}
                        icon={Activity}
                        colorClass="bg-emerald-50 text-emerald-600"
                    />
                    <StatCard
                        title="Cabor Terbaik"
                        value={stats?.cabor_unggulan || "-"}
                        icon={Trophy}
                        isText={true}
                        colorClass="bg-amber-50 text-amber-600"
                    />
                </div>

                {/* TODAY'S AGENDAS */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 md:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <ClipboardList size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 leading-tight">
                                    Jadwal Latihan Hari Ini
                                </h2>
                                <p className="text-xs text-slate-500 font-medium">
                                    Sesi latihan privat dan grup yang
                                    dijadwalkan untuk hari ini.
                                </p>
                            </div>
                        </div>
                        <div className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200">
                            {today_agendas?.length || 0} Sesi
                        </div>
                    </div>
                    <div className="p-5 md:p-6 bg-white">
                        {today_agendas?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {today_agendas.map((agenda, index) => (
                                    <div
                                        key={index}
                                        className="group relative bg-white border border-slate-200 hover:border-orange-500 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs ${agenda.is_group ? "bg-purple-500" : "bg-blue-500"}`}
                                                >
                                                    {agenda.is_group ? (
                                                        <Users size={16} />
                                                    ) : (
                                                        <User size={16} />
                                                    )}
                                                </div>
                                                <span
                                                    className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${agenda.is_group ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}
                                                >
                                                    {agenda.is_group
                                                        ? "Grup"
                                                        : "Privat"}
                                                </span>
                                            </div>
                                            <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                                                Sesi{" "}
                                                {agenda.session_number || "-"}
                                            </span>
                                        </div>
                                        <h3 className="text-base font-bold text-slate-900 mb-1 leading-tight line-clamp-1">
                                            {agenda.participant_name}
                                        </h3>
                                        <p className="text-xs text-slate-500 mb-4 font-medium flex items-center gap-1">
                                            <User
                                                size={12}
                                                className="text-slate-400"
                                            />{" "}
                                            Coach:{" "}
                                            <span className="text-slate-700">
                                                {agenda.coach_name}
                                            </span>
                                        </p>
                                        <Link
                                            href={agenda.route}
                                            className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 bg-slate-50 hover:bg-orange-500 text-slate-700 hover:text-white border border-slate-200 hover:border-orange-500 rounded-lg text-sm font-bold transition-colors"
                                        >
                                            Kelola Sesi <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm mb-4">
                                    <ClipboardList size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">
                                    Tidak ada jadwal latihan hari ini
                                </h3>
                                <p className="text-slate-500 max-w-sm text-sm">
                                    Semua jadwal telah selesai atau memang tidak
                                    ada latihan yang dijadwalkan pada hari ini.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* CHARTS & LISTS ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Radar Chart */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                                        <Target size={16} />
                                    </div>
                                    Benchmark Analysis
                                </h3>
                            </div>
                            <div className="p-2 flex-1 min-h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    {charts?.radar?.length > 0 ? (
                                        <RadarChart
                                            cx="50%"
                                            cy="50%"
                                            outerRadius="70%"
                                            data={charts.radar}
                                        >
                                            <defs>
                                                <linearGradient
                                                    id="colorAthlete"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="orange-500"
                                                        stopOpacity={0.7}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="orange-500"
                                                        stopOpacity={0.1}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <PolarGrid
                                                stroke="#e2e8f0"
                                                strokeDasharray="3 3"
                                            />
                                            <PolarAngleAxis
                                                dataKey="subject"
                                                tick={{
                                                    fill: "#64748b",
                                                    fontSize: 10,
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
                                                strokeWidth={2}
                                                strokeDasharray="4 4"
                                                fill="transparent"
                                            />
                                            <Radar
                                                name="Athlete"
                                                dataKey="A"
                                                stroke="orange-500"
                                                strokeWidth={2}
                                                fill="url(#colorAthlete)"
                                                fillOpacity={1}
                                            />
                                        </RadarChart>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-sm text-slate-400">
                                            Tidak ada data
                                        </div>
                                    )}
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Top Athletes */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                                        <Trophy size={16} />
                                    </div>
                                    Top 5 Atlet
                                </h3>
                            </div>
                            <div className="p-0 flex-1">
                                {lists?.top_athletes?.length > 0 ? (
                                    <div className="divide-y divide-slate-100">
                                        {lists.top_athletes.map(
                                            (atlet, index) => (
                                                <div
                                                    key={index}
                                                    className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div
                                                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                                                index === 0
                                                                    ? "bg-yellow-100 text-yellow-700"
                                                                    : index ===
                                                                        1
                                                                      ? "bg-slate-200 text-slate-700"
                                                                      : index ===
                                                                          2
                                                                        ? "bg-orange-100 text-orange-700"
                                                                        : "bg-slate-100 text-slate-500"
                                                            }`}
                                                        >
                                                            #{index + 1}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-slate-800 leading-tight">
                                                                {atlet.name}
                                                            </h4>
                                                            <p className="text-[10px] uppercase font-bold text-slate-400">
                                                                {atlet.sport}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="inline-block px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-sm font-bold">
                                                            {atlet.score}
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-sm text-slate-400 min-h-[200px]">
                                        Belum ada data atlet
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Gender & Cabor */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                                        <Users size={16} />
                                    </div>
                                    Distribusi Gender
                                </h3>
                            </div>
                            <div className="p-5 flex flex-col items-center">
                                <div className="h-[200px] w-full mb-4">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        {charts?.gender?.length > 0 ? (
                                            <PieChart>
                                                <Pie
                                                    data={charts.gender}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {charts.gender.map(
                                                        (entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    GENDER_COLORS[
                                                                        index %
                                                                            GENDER_COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        borderRadius: "8px",
                                                        border: "none",
                                                        boxShadow:
                                                            "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                                    }}
                                                />
                                            </PieChart>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-sm text-slate-400">
                                                Tidak ada data
                                            </div>
                                        )}
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex items-center justify-center gap-6 w-full">
                                    {charts?.gender?.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2"
                                        >
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        GENDER_COLORS[
                                                            i %
                                                                GENDER_COLORS.length
                                                        ],
                                                }}
                                            ></div>
                                            <span className="text-xs font-medium text-slate-600">
                                                {item.name}
                                            </span>
                                            <span className="text-sm font-bold text-slate-800">
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600">
                                        <TrendingUp size={16} />
                                    </div>
                                    Performa Cabor
                                </h3>
                            </div>
                            <div className="p-5 space-y-4">
                                {lists?.cabor_performance?.length > 0 ? (
                                    lists.cabor_performance.map((cabor, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className="text-sm font-bold text-slate-700">
                                                    {cabor.name}
                                                </span>
                                                <span className="text-sm font-bold text-orange-500">
                                                    {cabor.score}
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-orange-500 to-[#ff7a00] rounded-full transition-all duration-1000"
                                                    style={{
                                                        width: `${Math.min((cabor.score / 100) * 100, 100)}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-sm text-slate-400 py-4">
                                        Belum ada data cabor
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
