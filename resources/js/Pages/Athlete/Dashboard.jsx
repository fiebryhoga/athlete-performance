import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Calendar, CheckCircle, AlertCircle, HeartPulse, Activity, Dumbbell, ArrowRight, Sparkles, Target
} from 'lucide-react';

export default function AthleteDashboard({ 
    user, 
    pending_trainings, 
    has_wellness_today, 
    has_daily_metric_today, 
    stats 
}) {
    const todayStr = new Date().toLocaleDateString('id-ID', { 
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    });
    
    // Check if everything is done today
    const allDone = has_wellness_today && has_daily_metric_today && (pending_trainings?.length || 0) === 0;

    return (
        <AppLayout title="Dashboard Atlet">
            <Head title="Dashboard Utama" />

            <div className="w-full pb-12 overflow-x-hidden sm:overflow-visible">
                
                {/* Header Section with Integrated Tasks */}
                <div className="relative min-h-[300px] mb-8 group">
                    
                    {/* Background Container with overflow hidden */}
                    <div className="absolute inset-0 rounded-2xl shadow-xl shadow-[#ff4d00]/10 border border-[#ff4d00]/20 overflow-hidden z-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#ff4d00] via-[#ff6600] to-[#ff8c00]"></div>
                        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
                        <div className="absolute -right-20 -top-20 w-[400px] h-[400px] border-[40px] border-white/5 rounded-full pointer-events-none"></div>
                        <div className="absolute right-32 -bottom-24 w-[300px] h-[300px] border-[20px] border-white/5 rounded-full pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/20 rounded-full mix-blend-overlay filter blur-[100px] animate-pulse pointer-events-none"></div>
                    </div>

                    {/* Model Image - Outside overflow-hidden so it can pop out */}
                    <div className="absolute right-4 md:right-12 -bottom-0 z-10 h-[350px] md:h-[350px] pointer-events-none hidden md:block opacity-90">
                        <img
                            src="/assets/images/model2.png"
                            alt="Athlete Model"
                            className="h-full w-auto object-contain object-bottom drop-shadow-2xl"
                        />
                    </div>

                    <div className="relative z-20 w-full h-full p-8 md:p-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-10">
                            <div className="max-w-xl xl:max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-5 shadow-sm">
                                    <Sparkles size={14} className="text-yellow-200 fill-yellow-200" /> 
                                    <span className="text-[10px] font-bold text-white">Client Area</span>
                                </div>
                                
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 drop-shadow-sm leading-tight">
                                    Welcome back, <br className="hidden md:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-white">{user?.name?.split(' ')[0]} 👋</span>
                                </h1>
                                
                                <p className="text-orange-100 text-sm md:text-base leading-relaxed font-medium max-w-lg">
                                    Selamat datang di profil berlatih Anda. Selesaikan tugas hari ini dengan maksimal dan pantau terus performamu.
                                </p>
                            </div>
                            
                            <div className="w-fit flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-4 rounded-xl shadow-lg hover:bg-white/20 transition-all cursor-default relative overflow-hidden group/date">
                                <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-0 group-hover/date:animate-shine"></div>
                                <div className="relative z-10 w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-[#ff4d00] shrink-0">
                                    <Calendar size={20} strokeWidth={2.5} />
                                </div>
                                <div className="relative z-10 pr-2">
                                    <p className="text-[10px] text-orange-200 font-bold mb-0.5">Tanggal Hari Ini</p>
                                    <p className="text-base font-bold text-white leading-none whitespace-nowrap">
                                        {todayStr}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                  </div>
                </div>

                {/* Tasks Section (Moved outside banner) */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-5 px-1">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Target className="w-6 h-6 text-[#ff4d00]" />
                            Tugas Anda Hari Ini
                        </h2>
                        <span className="px-3 py-1 bg-orange-100 text-[#ff4d00] rounded-full text-[10px] font-bold">
                            {(pending_trainings?.length || 0) + (!has_wellness_today ? 1 : 0) + (!has_daily_metric_today ? 1 : 0)} Tugas
                        </span>
                    </div>

                    {allDone ? (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center flex flex-col items-center justify-center shadow-sm">
                            <CheckCircle className="w-10 h-10 text-emerald-500 mb-3" />
                            <h3 className="text-xl font-bold text-slate-800 mb-1">Kerja Bagus! 🎉</h3>
                            <p className="text-slate-500 max-w-sm mx-auto text-sm">
                                Kamu sudah menyelesaikan semua tugas, latihan, dan kuisioner harian. Waktunya beristirahat!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            
                            {/* Wellness Check */}
                            {!has_wellness_today && (
                                <div className="group bg-white hover:bg-slate-50 border border-slate-200 hover:border-rose-200 rounded-2xl p-5 transition-all duration-300 relative overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md">
                                    <div className="relative z-10 flex items-start justify-between mb-5">
                                        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                            <HeartPulse size={24} strokeWidth={2.5} />
                                        </div>
                                        <span className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded-lg text-[9px] font-bold">
                                            Wajib
                                        </span>
                                    </div>

                                    <div className="relative z-10 flex-1 flex flex-col justify-end">
                                        <h3 className="font-bold text-slate-800 text-base mb-1">Wellness & Beban</h3>
                                        <p className="text-xs text-slate-500 mb-5 line-clamp-2 leading-relaxed">
                                            Bagaimana kondisi fisik Anda hari ini? Isi kuisioner pemulihan untuk melacak kesiapan.
                                        </p>
                                        
                                        <Link 
                                            href={route('admin.wellness-rpe.index')}
                                            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-[#ff4d00] text-white py-2.5 rounded-xl text-xs font-bold transition-colors duration-300 group-hover:shadow-lg group-hover:shadow-[#ff4d00]/20"
                                        >
                                            Isi Sekarang <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Daily Metric Check */}
                            {!has_daily_metric_today && (
                                <div className="group bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-200 rounded-2xl p-5 transition-all duration-300 relative overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md">
                                    <div className="relative z-10 flex items-start justify-between mb-5">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                            <Activity size={24} strokeWidth={2.5} />
                                        </div>
                                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-[9px] font-bold">
                                            Wajib
                                        </span>
                                    </div>

                                    <div className="relative z-10 flex-1 flex flex-col justify-end">
                                        <h3 className="font-bold text-slate-800 text-base mb-1">Pantauan Harian</h3>
                                        <p className="text-xs text-slate-500 mb-5 line-clamp-2 leading-relaxed">
                                            Catat metrik fisik harian seperti detak jantung istirahat dan berat badan.
                                        </p>
                                        
                                        <Link 
                                            href={route('admin.daily-metrics.index')}
                                            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-[#ff4d00] text-white py-2.5 rounded-xl text-xs font-bold transition-colors duration-300 group-hover:shadow-lg group-hover:shadow-[#ff4d00]/20"
                                        >
                                            Isi Sekarang <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Pending Trainings */}
                            {pending_trainings?.map((training) => (
                                <div key={training.id} className="group bg-white hover:bg-orange-50/30 border border-slate-200 hover:border-[#ff4d00]/30 rounded-2xl p-5 transition-all duration-300 relative overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md">
                                    <div className="absolute -right-6 -top-6 text-slate-50 group-hover:text-orange-50 transition-colors duration-300 transform group-hover:scale-110 group-hover:rotate-12 z-0">
                                        <Dumbbell size={100} strokeWidth={1} />
                                    </div>
                                    
                                    <div className="relative z-10 flex items-start justify-between mb-5">
                                        <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#ff4d00] flex items-center justify-center shrink-0 group-hover:bg-[#ff4d00] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                            <Dumbbell size={24} strokeWidth={2.5} />
                                        </div>
                                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-bold group-hover:bg-orange-100 group-hover:text-[#ff4d00] transition-colors">
                                            Sesi {training.session_number}
                                        </span>
                                    </div>

                                    <div className="relative z-10 flex-1 flex flex-col justify-end">
                                        <h3 className="font-bold text-slate-800 text-base mb-1 line-clamp-1" title={training.name}>
                                            {training.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 mb-5 font-medium flex items-center gap-1.5">
                                            <Calendar size={14} /> {training.date}
                                        </p>
                                        
                                        <Link 
                                            href={route('admin.individual-trainings.session.show', training.id)}
                                            className="w-full flex items-center justify-center gap-2 bg-[#ff4d00] hover:bg-[#e64500] text-white py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-[#ff4d00]/30"
                                        >
                                            Mulai Latihan <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                {/* Quick Stats Below Banner */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                        <p className="text-xs text-slate-400 font-bold mb-1 flex items-center gap-1.5">
                            <Dumbbell className="w-3.5 h-3.5" /> Total Sesi
                        </p>
                        <p className="font-bold text-2xl text-slate-800">{stats.total_sessions}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                        <p className="text-xs text-slate-400 font-bold mb-1 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5" /> Cabang Olahraga
                        </p>
                        <p className="font-bold text-lg text-[#ff4d00]">{stats.sport}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                        <p className="text-xs text-slate-400 font-bold mb-1 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" /> Tugas Aktif
                        </p>
                        <p className="font-bold text-2xl text-slate-800">{(pending_trainings?.length || 0) + (!has_wellness_today ? 1 : 0) + (!has_daily_metric_today ? 1 : 0)}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400 font-bold mb-1 flex items-center gap-1.5">
                                Profil Lengkap
                            </p>
                            <p className="font-bold text-sm text-slate-600">Lihat performa & tren fisikmu.</p>
                        </div>
                        <Link href={route('athlete.profiling')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors">
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

             </div>
        </AppLayout>
    );
}
