import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Calendar,
    CheckCircle,
    AlertCircle,
    HeartPulse,
    Activity,
    Dumbbell,
    ArrowRight,
    Sparkles,
    Target,
    Users,
} from "lucide-react";

export default function AthleteDashboard({
    user,
    today_agendas,
    has_wellness_today,
    has_rpe_today,
    today_date,
    stats,
}) {
    const todayStr = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    // Check if everything is done today
    const allDone =
        has_wellness_today &&
        has_rpe_today &&
        (today_agendas?.length || 0) === 0;
    const totalTasks =
        (today_agendas?.length || 0) +
        (!has_wellness_today ? 1 : 0) +
        (!has_rpe_today ? 1 : 0);

    return (
        <AppLayout title="Dashboard Atlet">
            <Head title="Dashboard Utama" />

            <div className="w-full pb-12 overflow-x-hidden sm:overflow-visible">
                {/* Header Section */}
                <div className="relative min-h-[250px] mb-8 group rounded-xl shadow-xl shadow-[#ff4d00]/10 border border-[#ff4d00]/20 overflow-hidden z-0">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ff4d00] via-[#ff6600] to-[#ff8c00]"></div>
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
                    <div className="absolute -right-20 -top-20 w-[400px] h-[400px] border-[40px] border-white/5 rounded-full pointer-events-none"></div>
                    <div className="absolute right-32 -bottom-24 w-[300px] h-[300px] border-[20px] border-white/5 rounded-full pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/20 rounded-full mix-blend-overlay filter blur-[100px] animate-pulse pointer-events-none"></div>

                    {/* Model Image */}
                    <div className="absolute right-4 md:right-12 -bottom-0 z-10 h-[300px] md:h-[300px] pointer-events-none hidden md:block opacity-90">
                        <img
                            src="/assets/images/model2.png"
                            alt="Athlete Model"
                            className="h-full w-auto object-contain object-bottom drop-shadow-2xl"
                        />
                    </div>

                    <div className="relative z-20 w-full h-full p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                        <div className="max-w-xl xl:max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-4 shadow-sm">
                                <Sparkles
                                    size={14}
                                    className="text-yellow-200 fill-yellow-200"
                                />
                                <span className="text-[10px] font-bold text-white uppercase tracking-normal">
                                    Area Atlet
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-sm leading-tight">
                                Halo,{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-white">
                                    {user?.name?.split(" ")[0]} 👋
                                </span>
                            </h1>

                            <p className="text-orange-100 text-sm md:text-base leading-relaxed font-medium max-w-lg">
                                Selamat datang di profil berlatih Anda.
                                Selesaikan agenda hari ini dengan maksimal dan
                                pantau terus performamu.
                            </p>
                        </div>

                        <div className="w-fit flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-4 rounded-xl shadow-lg hover:bg-white/20 transition-all cursor-default relative overflow-hidden group/date">
                            <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-0 group-hover/date:animate-shine"></div>
                            <div className="relative z-10 w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-[#ff4d00] shrink-0">
                                <Calendar size={20} strokeWidth={2.5} />
                            </div>
                            <div className="relative z-10 pr-2">
                                <p className="text-[10px] text-orange-200 font-bold mb-0.5 uppercase tracking-normal">
                                    Tanggal Hari Ini
                                </p>
                                <p className="text-base font-bold text-white leading-none whitespace-nowrap">
                                    {todayStr}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                        <p className="text-xs text-slate-500 font-bold mb-1 flex items-center gap-1.5">
                            <Dumbbell className="w-3.5 h-3.5 text-slate-400" />{" "}
                            Total Sesi
                        </p>
                        <p className="font-bold text-2xl text-slate-900">
                            {stats.total_sessions}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                        <p className="text-xs text-slate-500 font-bold mb-1 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-slate-400" />{" "}
                            Cabang Olahraga
                        </p>
                        <p className="font-bold text-lg text-[#ff4d00]">
                            {stats.sport}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                        <p className="text-xs text-slate-500 font-bold mb-1 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />{" "}
                            Agenda Aktif
                        </p>
                        <p className="font-bold text-2xl text-slate-900">
                            {totalTasks}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center group hover:bg-slate-50 transition-colors">
                        <Link
                            href={route("athlete.profiling")}
                            className="flex items-center justify-between w-full h-full"
                        >
                            <div>
                                <p className="text-xs text-slate-500 font-bold mb-1 flex items-center gap-1.5">
                                    Profil Lengkap
                                </p>
                                <p className="font-bold text-sm text-slate-700">
                                    Lihat Tren Performa
                                </p>
                            </div>
                            <div className="p-2 bg-slate-100 group-hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Agenda Hari Ini Section */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Target className="w-5 h-5 text-[#ff4d00]" />
                            Agenda Hari Ini
                        </h2>
                        {totalTasks > 0 && (
                            <span className="px-3 py-1 bg-orange-50 text-[#ff4d00] border border-orange-100 rounded-md text-[10px] font-bold">
                                {totalTasks} Agenda Tersisa
                            </span>
                        )}
                    </div>

                    {allDone ? (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-8 text-center flex flex-col items-center justify-center shadow-sm">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">
                                Kerja Bagus! 🎉
                            </h3>
                            <p className="text-slate-600 max-w-sm mx-auto text-sm">
                                Kamu sudah menyelesaikan seluruh agenda latihan,
                                RPE, dan pendataan harianmu hari ini. Waktunya
                                beristirahat!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {/* Wellness Check Card */}
                            <div className={`group bg-white border rounded-xl p-6 transition-all duration-300 flex flex-col h-full shadow-sm border-slate-200 hover:border-orange-200 hover:bg-orange-50/30`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${has_wellness_today ? 'bg-slate-100 text-slate-500' : 'bg-rose-50 text-rose-600'}`}>
                                        {has_wellness_today ? <CheckCircle size={24} strokeWidth={2} /> : <HeartPulse size={24} strokeWidth={2} />}
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${has_wellness_today ? 'bg-slate-100 text-slate-600' : 'bg-rose-100 text-rose-700'}`}>
                                        {has_wellness_today ? 'Selesai' : 'Wajib'}
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col justify-end">
                                    <h3 className="font-bold text-slate-900 text-base mb-1">
                                        Data Wellness
                                    </h3>
                                    <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                                        Bagaimana kondisi fisik Anda hari
                                        ini? Isi kuisioner wellness untuk
                                        evaluasi pelatih.
                                    </p>
                                    <Link
                                        href={route(
                                            "admin.wellness-rpe.session-form", { date: today_date, mode: 'wellness' }
                                        )}
                                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm ${has_wellness_today ? 'bg-white border-2 border-[#ff4d00] text-[#ff4d00] hover:bg-orange-50' : 'bg-gradient-to-r from-[#ff4d00] to-[#ff7a00] hover:from-[#e64500] hover:to-[#e66a00] hover:shadow-[#ff4d00]/30 text-white'}`}
                                    >
                                        {has_wellness_today ? 'Lihat Data' : 'Isi Sekarang'} <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>

                            {/* RPE Check Card */}
                            <div className={`group bg-white border rounded-xl p-6 transition-all duration-300 flex flex-col h-full shadow-sm border-slate-200 hover:border-orange-200 hover:bg-orange-50/30`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${has_rpe_today ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-600'}`}>
                                        {has_rpe_today ? <CheckCircle size={24} strokeWidth={2} /> : <Activity size={24} strokeWidth={2} />}
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${has_rpe_today ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-700'}`}>
                                        {has_rpe_today ? 'Selesai' : 'Wajib'}
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col justify-end">
                                    <h3 className="font-bold text-slate-900 text-base mb-1">
                                        Data RPE
                                    </h3>
                                    <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                                        Catat tingkat pengerahan tenaga (RPE)
                                        sesi latihanmu hari ini.
                                    </p>
                                    <Link
                                        href={route(
                                            "admin.wellness-rpe.session-form", { date: today_date, mode: 'rpe' }
                                        )}
                                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm ${has_rpe_today ? 'bg-white border-2 border-[#ff4d00] text-[#ff4d00] hover:bg-orange-50' : 'bg-gradient-to-r from-[#ff4d00] to-[#ff7a00] hover:from-[#e64500] hover:to-[#e66a00] hover:shadow-[#ff4d00]/30 text-white'}`}
                                    >
                                        {has_rpe_today ? 'Lihat / Edit Data' : 'Isi Sekarang'} <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>

                            {/* Training Agendas */}
                            {today_agendas?.map((training, index) => (
                                <div
                                    key={`agenda-${index}`}
                                    className="group bg-white border border-slate-200 hover:border-orange-200 rounded-xl p-6 transition-all duration-300 flex flex-col h-full shadow-sm relative overflow-hidden"
                                >
                                    <div className="absolute -right-6 -bottom-6 text-slate-50 group-hover:text-orange-50/50 transition-colors duration-300 transform group-hover:scale-110 z-0">
                                        {training.is_group ? (
                                            <Users size={120} strokeWidth={1} />
                                        ) : (
                                            <Dumbbell
                                                size={120}
                                                strokeWidth={1}
                                            />
                                        )}
                                    </div>

                                    <div className="relative z-10 flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#ff4d00] flex items-center justify-center shrink-0">
                                            {training.is_group ? (
                                                <Users
                                                    size={24}
                                                    strokeWidth={2}
                                                />
                                            ) : (
                                                <Dumbbell
                                                    size={24}
                                                    strokeWidth={2}
                                                />
                                            )}
                                        </div>
                                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase">
                                            Sesi {training.session_number}
                                        </span>
                                    </div>

                                    <div className="relative z-10 flex-1 flex flex-col justify-end">
                                        <span className="text-[10px] font-bold text-orange-600 mb-1 uppercase tracking-normal">
                                            {training.is_group
                                                ? "Latihan Grup"
                                                : "Latihan Pribadi"}
                                        </span>
                                        <h3
                                            className="font-bold text-slate-900 text-base mb-1 line-clamp-1"
                                            title={training.name}
                                        >
                                            {training.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 mb-5 font-medium flex items-center gap-1.5">
                                            <Calendar
                                                size={14}
                                                className="text-slate-400"
                                            />{" "}
                                            {training.date}
                                        </p>

                                        <Link
                                            href={training.route}
                                            className="w-full flex items-center justify-center gap-2 bg-[#ff4d00] hover:bg-[#e64500] text-white py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm hover:shadow-[#ff4d00]/30"
                                        >
                                            {training.is_group
                                                ? "Lihat Grup"
                                                : "Mulai Latihan"}{" "}
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
