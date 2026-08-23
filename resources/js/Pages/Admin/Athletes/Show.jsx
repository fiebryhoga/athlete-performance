import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import PageHeader from '@/Components/Common/PageHeader';
import AthleteGallery from './Partials/AthleteGallery';
import CompositionAnatomy from '@/Pages/Admin/CompositionTests/Partials/CompositionAnatomy';
import { 
    User, Calendar, Activity, Trophy, ArrowLeft, TrendingUp, TrendingDown, 
    Target, Scale, Ruler, Weight, Clock, Zap, AlertCircle, Minus, FileText, ChevronRight, 
    Download, HeartPulse, Battery, History, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, 
    AlertTriangle, Dumbbell, Compass, Flame, Droplets, Bed, Info, Layers, Eye, Camera
} from 'lucide-react';
import { 
    ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ComposedChart, Bar, Line, BarChart
} from 'recharts';

export default function Show({ 
    athlete = {}, 
    galleries = [],
    stats = {}, 
    radar_data = [], 
    comparison_data = [], 
    item_analysis = [], 
    history_data = [], 
    strengths = [], 
    weaknesses = [], 
    has_data = false, 
    historical_labels = [],
    daily_metrics = [],
    training_loads = [],
    latest_phv, 
    latest_composition, 
    latest_wellness, 
    latest_dpa,
    latest_daily_metric
}) {
    const safeAthlete = athlete || {};

    const calculateBMI = (h, w) => {
        if (!h || !w) return '-';
        const heightInM = h / 100;
        const bmiVal = w / (heightInM * heightInM);
        return parseFloat(bmiVal.toFixed(1)); 
    };

    const bmi = calculateBMI(safeAthlete.height, safeAthlete.weight);
    const initial = safeAthlete.name ? safeAthlete.name.charAt(0).toUpperCase() : '-';

    const getBMIStatus = (val) => {
        if (val === '-') return { label: '-', color: 'text-slate-500', bg: 'bg-slate-100 border-slate-200' };
        if (val < 18.5) return { label: 'Underweight', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
        if (val >= 18.5 && val <= 24.9) return { label: 'Ideal', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
        if (val >= 25 && val <= 29.9) return { label: 'Overweight', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' };
        return { label: 'Obese', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' };
    };
    const bmiStatus = getBMIStatus(bmi);

    const isFemale = safeAthlete.gender === 'P' || safeAthlete.gender === 'female' || safeAthlete.gender === 'Perempuan';
    const genderLabel = isFemale ? 'Perempuan' : 'Laki-laki';
    const coachNames = safeAthlete.coaches && safeAthlete.coaches.length > 0 
        ? safeAthlete.coaches.map(c => c.name).join(', ') 
        : (safeAthlete.coach?.name || null);

    const hasGroups = safeAthlete.groups && safeAthlete.groups.length > 0;
    const membershipLabel = hasGroups
        ? (safeAthlete.groups.length > 1 ? `${safeAthlete.groups.length} Grup` : safeAthlete.groups[0].name)
        : (safeAthlete.package?.name || 'Privat');

    const formatScore = (val) => {
        if (val === undefined || val === null) return 0;
        return Number(val) % 1 === 0 ? Number(val) : Number(val).toFixed(1);
    };

    const formatNumber = (val) => {
        if (val === undefined || val === null) return '-';
        return Number(val) % 1 === 0 ? Number(val) : Number(val).toFixed(1);
    };

    const customTooltipStyle = {
        borderRadius: '8px', 
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', 
        fontSize: '12px',
        fontWeight: '600',
        padding: '8px 12px'
    };

    const GrowthIndicator = ({ value }) => {
        if (value === undefined || value === null) return <span className="text-slate-300">-</span>;
        if (value > 0) return <span className="inline-flex items-center text-emerald-600 text-xs font-bold"><TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +{value}%</span>;
        if (value < 0) return <span className="inline-flex items-center text-rose-500 text-xs font-bold"><TrendingDown className="w-3.5 h-3.5 mr-0.5" /> {value}%</span>;
        return <span className="inline-flex items-center text-slate-400 text-xs font-bold"><Minus className="w-3.5 h-3.5 mr-0.5" /> 0%</span>;
    };

    return (
        <AppLayout title={`Profil - ${safeAthlete.name || 'Athlete'}`}>
            <Head title={`Profil - ${safeAthlete.name || 'Athlete Profile'}`} />

            <div className="space-y-3 pb-4">
                
                {/* ─── PAGE HEADER WITH BREADCRUMB & ACTIONS ─── */}
                <div className="space-y-1">
                    <Link 
                        href={route('admin.athletes.index')} 
                        className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors gap-1.5"
                    >
                        <ArrowLeft size={13} /> Kembali ke Profiling
                    </Link>
                    <PageHeader
                        title="Profiling"
                        description={`Evaluasi rekam jejak performa fisik, antropometri, dan beban latihan ${safeAthlete.name || 'atlet'}.`}
                        actions={
                            safeAthlete.id ? (
                                <div className="flex items-center gap-2">
                                    <a 
                                        href={route('admin.athletes.export-pdf', safeAthlete.id)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 hover:border-slate-300 px-3 py-1.5 rounded-md font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5"
                                    >
                                        <Download size={13} className="text-orange-500" /> Download PDF
                                    </a>
                                    <Link 
                                        href={route('admin.individual-trainings.show', safeAthlete.id)}
                                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3 py-1.5 rounded-md font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                                    >
                                        <Activity size={13} /> Program Latihan
                                    </Link>
                                </div>
                            ) : null
                        }
                    />
                </div>

                {/* ─── 1. HERO PROFILE & BIOMETRICS BANNER ─── */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-3.5 sm:p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Left: Avatar & Identity details */}
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-white via-white to-orange-50/90 text-orange-600 border border-slate-200/90 shadow-2xs flex items-center justify-center text-xl sm:text-2xl font-black shrink-0 overflow-hidden">
                                {safeAthlete.profile_photo_url ? (
                                    <img src={safeAthlete.profile_photo_url} alt={safeAthlete.name} className="w-full h-full object-cover" />
                                ) : (
                                    initial
                                )}
                            </div>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5 text-xs mb-0.5">
                                    <span className="font-bold text-orange-600">
                                        {safeAthlete.sport?.name || 'Tanpa Cabor'}
                                    </span>
                                    <span className="text-slate-300">•</span>
                                    <span className={`font-semibold ${hasGroups ? 'text-blue-600' : 'text-slate-600'}`}>
                                        {membershipLabel}
                                    </span>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-slate-500 font-medium">{genderLabel}</span>
                                    {coachNames && (
                                        <>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-slate-500 font-medium">Pelatih: {coachNames}</span>
                                        </>
                                    )}
                                </div>
                                <h2 className="text-lg sm:text-xl font-black text-slate-900 truncate tracking-tight">{safeAthlete.name || 'Unknown'}</h2>
                                <p className="text-[11px] text-slate-400 font-mono mt-0.5">@{safeAthlete.username || '-'}</p>
                            </div>
                        </div>

                        {/* Right: 4 Biometrics Metric Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
                            <div className="px-3 py-2 bg-slate-50/70 rounded-md border border-slate-200/70 min-w-[90px] flex flex-col justify-between">
                                <div className="flex items-center justify-between text-slate-400 mb-0.5">
                                    <span className="text-[9px] font-bold uppercase tracking-wider">Tinggi</span>
                                    <Ruler size={12} className="text-slate-400" />
                                </div>
                                <div className="text-slate-900 font-black text-sm sm:text-base leading-tight">
                                    {safeAthlete.height || '-'} <span className="text-[10px] font-semibold text-slate-400">cm</span>
                                </div>
                            </div>
                            <div className="px-3 py-2 bg-slate-50/70 rounded-md border border-slate-200/70 min-w-[90px] flex flex-col justify-between">
                                <div className="flex items-center justify-between text-slate-400 mb-0.5">
                                    <span className="text-[9px] font-bold uppercase tracking-wider">Berat</span>
                                    <Weight size={12} className="text-slate-400" />
                                </div>
                                <div className="text-slate-900 font-black text-sm sm:text-base leading-tight">
                                    {safeAthlete.weight || '-'} <span className="text-[10px] font-semibold text-slate-400">kg</span>
                                </div>
                            </div>
                            <div className="px-3 py-2 bg-slate-50/70 rounded-md border border-slate-200/70 min-w-[90px] flex flex-col justify-between">
                                <div className="flex items-center justify-between text-slate-400 mb-0.5">
                                    <span className="text-[9px] font-bold uppercase tracking-wider">Usia</span>
                                    <Calendar size={12} className="text-slate-400" />
                                </div>
                                <div className="text-slate-900 font-black text-sm sm:text-base leading-tight">
                                    {safeAthlete.age || '-'} <span className="text-[10px] font-semibold text-slate-400">thn</span>
                                </div>
                            </div>
                            <div className="px-3 py-2 bg-slate-50/70 rounded-md border border-slate-200/70 min-w-[90px] flex flex-col justify-between">
                                <div className="flex items-center justify-between text-slate-400 mb-0.5">
                                    <span className="text-[9px] font-bold uppercase tracking-wider">BMI</span>
                                    <span className={`text-[8px] font-bold px-1 rounded ${bmiStatus.bg} ${bmiStatus.color}`}>{bmiStatus.label}</span>
                                </div>
                                <div className={`font-black text-sm sm:text-base leading-tight ${bmiStatus.color}`}>
                                    {bmi}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── 2. EXECUTIVE PERFORMANCE KPIS (4 STAT CARDS) ─── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Sesi</span>
                            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100"><Layers size={13} /></div>
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-black text-slate-900">{stats?.total_sessions || 0}</p>
                            <span className="text-[10px] text-slate-400 font-medium">Tes fisik terekam</span>
                        </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rata-Rata Skor</span>
                            <div className="p-1.5 bg-orange-50 text-orange-600 rounded-md border border-orange-100"><Activity size={13} /></div>
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-black text-orange-600">{formatScore(stats?.average_score)} <span className="text-[10px] font-bold text-slate-400">/ 100</span></p>
                            <span className="text-[10px] text-slate-400 font-medium">Skor kumulatif tes</span>
                        </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skor Tertinggi</span>
                            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100"><Trophy size={13} /></div>
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-black text-emerald-600">{formatScore(stats?.highest_score)} <span className="text-[10px] font-bold text-slate-400">/ 100</span></p>
                            <span className="text-[10px] text-slate-400 font-medium">Rekor performa puncak</span>
                        </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aktivitas Terakhir</span>
                            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-md border border-purple-100"><Calendar size={13} /></div>
                        </div>
                        <div>
                            <p className="text-sm sm:text-base font-black text-slate-800 truncate mt-0.5">{stats?.latest_date || '-'}</p>
                            <span className="text-[10px] text-slate-400 font-medium">Sesi tes terakhir</span>
                        </div>
                    </div>
                </div>

                {/* ─── 3. PHYSICAL STRENGTHS & IMPROVEMENT PRIORITIES ─── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                    {/* Strengths */}
                    <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-2.5 pb-2 border-b border-slate-100">
                                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    <div className="p-1 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100">
                                        <Zap size={13} />
                                    </div>
                                    Keunggulan Fisik (&gt;70%)
                                </h3>
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
                                    {strengths?.length || 0} Kategori Unggul
                                </span>
                            </div>
                            <div className="space-y-2">
                                {strengths && strengths.length > 0 ? strengths.map((item, idx) => (
                                    <div key={idx} className="p-2 rounded-lg bg-slate-50/70 border border-slate-200/70 flex flex-col gap-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold text-slate-800 text-xs">{item.name}</span>
                                            <span className="font-black text-emerald-600 text-xs">{formatScore(item.score)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                                            <div 
                                                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" 
                                                style={{ width: `${Math.min(100, Math.max(0, item.score))}%` }}
                                            />
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-4 text-center text-slate-400 text-xs italic bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                                        Belum ada kategori dengan skor di atas 70%.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Weaknesses / Improvement Priorities */}
                    <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-2.5 pb-2 border-b border-slate-100">
                                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    <div className="p-1 bg-rose-50 text-rose-600 rounded-md border border-rose-100">
                                        <AlertCircle size={13} />
                                    </div>
                                    Prioritas Peningkatan (&le;70%)
                                </h3>
                                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/70">
                                    {weaknesses?.length || 0} Kategori Perlu Dilatih
                                </span>
                            </div>
                            <div className="space-y-2">
                                {weaknesses && weaknesses.length > 0 ? weaknesses.map((item, idx) => (
                                    <div key={idx} className="p-2 rounded-lg bg-slate-50/70 border border-slate-200/70 flex flex-col gap-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold text-slate-800 text-xs">{item.name}</span>
                                            <span className="font-black text-rose-500 text-xs">{formatScore(item.score)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                                            <div 
                                                className="bg-gradient-to-r from-rose-500 to-orange-400 h-full rounded-full transition-all duration-500" 
                                                style={{ width: `${Math.min(100, Math.max(0, item.score))}%` }}
                                            />
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-4 text-center text-slate-400 text-xs italic bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                                        Semua kategori telah berada di atas standar 70%.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── 4. MULTI-DOMAIN HEALTH & ASSESSMENT MATRIX (4 BENTO CARDS) ─── */}
                <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5">
                        <div className="p-1 bg-orange-50 text-orange-500 rounded-md border border-orange-100">
                            <Layers size={13} />
                        </div>
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight">Status Multi-Domain Asesmen Atlet</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                        {/* 1. PHV & Maturity */}
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
                            <div>
                                <div className="flex justify-between items-center mb-2.5 pb-2 border-b border-slate-100">
                                    <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                        <Activity size={13} className="text-emerald-500" /> PHV & Pertumbuhan
                                    </h4>
                                    {latest_phv && (
                                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/70">
                                            {latest_phv.phv_status || 'Circa-PHV'}
                                        </span>
                                    )}
                                </div>

                                {latest_phv ? (
                                    <div className="space-y-2">
                                        <div className="bg-slate-50/80 p-2 rounded-lg border border-slate-200/70">
                                            <span className="text-[9px] text-slate-400 font-bold uppercase block">Maturity Offset</span>
                                            <p className="text-base font-black text-slate-900">{Number(latest_phv.maturity_offset).toFixed(2)} <span className="text-[10px] font-normal text-slate-500">thn dr PHV</span></p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-1.5 text-xs text-center">
                                            <div className="p-1.5 bg-slate-50/80 rounded-lg border border-slate-200/70">
                                                <span className="text-[9px] text-slate-400 block mb-0.5">Prediksi Tinggi</span>
                                                <strong className="text-slate-800 text-[11px] font-bold">{latest_phv.predicted_adult_height || '-'} cm</strong>
                                            </div>
                                            <div className="p-1.5 bg-slate-50/80 rounded-lg border border-slate-200/70">
                                                <span className="text-[9px] text-slate-400 block mb-0.5">Sisa Tumbuh</span>
                                                <strong className="text-orange-600 text-[11px] font-bold">+{latest_phv.remaining_growth || '-'} cm</strong>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-6 text-center text-slate-400 text-xs italic">Belum ada asesmen PHV</div>
                                )}
                            </div>
                        </div>

                        {/* 2. Body Composition */}
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
                            <div>
                                <div className="flex justify-between items-center mb-2.5 pb-2 border-b border-slate-100">
                                    <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                        <Scale size={13} className="text-indigo-500" /> Komposisi Tubuh
                                    </h4>
                                    {latest_composition && (
                                        <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/70">
                                            Terekam
                                        </span>
                                    )}
                                </div>

                                {latest_composition ? (
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-2 gap-1.5 text-center">
                                            <div className="bg-orange-50/60 p-2 rounded-lg border border-orange-200/60">
                                                <span className="text-[9px] font-bold text-orange-700 uppercase block">Body Fat</span>
                                                <p className="text-sm font-black text-orange-600">{latest_composition.body_fat_percentage ?? '-'}%</p>
                                                <span className="text-[9px] text-slate-500">{latest_composition.fat_mass ?? '-'} kg</span>
                                            </div>
                                            <div className="bg-indigo-50/60 p-2 rounded-lg border border-indigo-200/60">
                                                <span className="text-[9px] font-bold text-indigo-700 uppercase block">Muscle Mass</span>
                                                <p className="text-sm font-black text-indigo-600">{latest_composition.muscle_mass ?? '-'} <span className="text-[9px]">kg</span></p>
                                                <span className="text-[9px] text-slate-500">Massa Otot</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-1.5 text-xs text-center">
                                            <div className="p-1.5 bg-slate-50/80 rounded-lg border border-slate-200/70">
                                                <span className="text-[9px] text-slate-400 block mb-0.5">BMR</span>
                                                <strong className="text-slate-800 text-[11px] font-bold">{latest_composition.bmr ? `${latest_composition.bmr} kcal` : '-'}</strong>
                                            </div>
                                            <div className="p-1.5 bg-slate-50/80 rounded-lg border border-slate-200/70">
                                                <span className="text-[9px] text-slate-400 block mb-0.5">Visceral Fat</span>
                                                <strong className="text-slate-800 text-[11px] font-bold">Lvl {latest_composition.visceral_fat_level ?? '-'}</strong>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-6 text-center text-slate-400 text-xs italic">Belum ada tes komposisi tubuh</div>
                                )}
                            </div>
                        </div>

                        {/* 3. Wellness & Training Load */}
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
                            <div>
                                <div className="flex justify-between items-center mb-2.5 pb-2 border-b border-slate-100">
                                    <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                        <Battery size={13} className="text-amber-500" /> Beban & Wellness
                                    </h4>
                                    {latest_wellness && (
                                        <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/70">
                                            Aktif
                                        </span>
                                    )}
                                </div>

                                {latest_wellness ? (
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-2 gap-1.5 text-center">
                                            <div className="bg-slate-50/80 p-2 rounded-lg border border-slate-200/70">
                                                <span className="text-[9px] text-slate-400 font-bold uppercase block">Wellness</span>
                                                <p className="text-sm font-black text-emerald-600">{latest_wellness.daily_wellness_score ?? '-'} <span className="text-[9px] text-slate-400 font-normal">/30</span></p>
                                            </div>
                                            <div className="bg-slate-50/80 p-2 rounded-lg border border-slate-200/70">
                                                <span className="text-[9px] text-slate-400 font-bold uppercase block">Session RPE</span>
                                                <p className="text-sm font-black text-orange-500">{latest_wellness.session_rpe ?? '-'} <span className="text-[9px] text-slate-400 font-normal">/10</span></p>
                                            </div>
                                        </div>
                                        <div className="bg-orange-50/60 p-2 rounded-lg border border-orange-200/60 flex items-center justify-between text-xs">
                                            <span className="font-bold text-orange-800 text-[10px]">Daily Load (AU)</span>
                                            <strong className="text-sm font-black text-orange-600">{latest_wellness.daily_load ?? '-'}</strong>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-6 text-center text-slate-400 text-xs italic">Belum ada catatan wellness</div>
                                )}
                            </div>
                        </div>

                        {/* 4. Dynamic Posture Assessment (DPA) */}
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
                            <div>
                                <div className="flex justify-between items-center mb-2.5 pb-2 border-b border-slate-100">
                                    <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                        <User size={13} className="text-purple-500" /> Postur Dinamis (DPA)
                                    </h4>
                                    {latest_dpa && (
                                        <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200/70">
                                            Assessed
                                        </span>
                                    )}
                                </div>

                                {latest_dpa ? (
                                    <div className="space-y-2">
                                        <div className="bg-purple-50/40 p-2 rounded-lg border border-purple-200/60 flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-purple-800">Total Deviasi</span>
                                            <p className="text-base font-black text-purple-700">{latest_dpa.total_score} <span className="text-[9px] font-normal">poin</span></p>
                                        </div>
                                        <p className="text-[10px] text-slate-500 line-clamp-2 bg-slate-50/80 p-2 rounded-lg border border-slate-200/70">
                                            {latest_dpa.details && latest_dpa.details.length > 0 
                                                ? latest_dpa.details.map(d => d.compensation?.name || d.movement_name).filter(Boolean).slice(0, 2).join(', ')
                                                : 'Tidak ada deviasi sendi signifikan.'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="py-6 text-center text-slate-400 text-xs italic">Belum ada asesmen postur (DPA)</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── 5. PHYSICAL PERFORMANCE CHARTS & BREAKDOWN ─── */}
                <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5">
                        <div className="p-1 bg-orange-50 text-orange-500 rounded-md border border-orange-100">
                            <Target size={13} />
                        </div>
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight">Analisis Performa & Grafik Tes Fisik</h2>
                    </div>

                    {has_data ? (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-3">
                                {/* Radar Chart */}
                                <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                                    <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                                        <Target size={13} className="text-orange-500" /> Peta Kemampuan Fisik (Radar Chart)
                                    </h3>
                                    <div className="h-[250px] sm:h-[280px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radar_data}>
                                                <PolarGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                <Radar name="Target Cabor" dataKey="B" stroke="#f59e0b" strokeWidth={1.5} fill="#f59e0b" fillOpacity={0.1} />
                                                <Radar name="Performa Atlet" dataKey="A" stroke="#f97316" strokeWidth={2} fill="#f97316" fillOpacity={0.35} />
                                                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                                                <RechartsTooltip contentStyle={customTooltipStyle} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Comparison Bar Chart */}
                                <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                                    <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                                        <Activity size={13} className="text-orange-500" /> Perbandingan Kategori: Sesi Terkini vs Sebelumnya
                                    </h3>
                                    <div className="h-[250px] sm:h-[280px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={comparison_data} margin={{ top: 15, right: 0, left: -20, bottom: 0 }} barGap={3}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                                                <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={customTooltipStyle} />
                                                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} iconType="circle" />
                                                <Bar name="Sesi Sebelumnya" dataKey="previous" fill="#cbd5e1" radius={[3, 3, 0, 0]} barSize={14} />
                                                <Bar name="Sesi Terkini" dataKey="latest" fill="#f97316" radius={[3, 3, 0, 0]} barSize={14} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Item Breakdown Table */}
                            {item_analysis && item_analysis.length > 0 && (
                                <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
                                    <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
                                        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                            <FileText size={13} className="text-orange-500" /> Rincian Parameter Tes Sesi Terakhir
                                        </h3>
                                        <span className="text-[10px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded border border-slate-200/80">
                                            Total {item_analysis.length} Item
                                        </span>
                                    </div>

                                    <div className="overflow-x-auto custom-scrollbar">
                                        <table className="w-full text-xs text-left whitespace-nowrap">
                                            <thead className="text-[10px] text-slate-500 bg-slate-50/70 border-b border-slate-200/80 font-bold uppercase tracking-wider">
                                                <tr>
                                                    <th className="px-4 py-2.5">Item Tes</th>
                                                    <th className="px-4 py-2.5 text-center">Hasil Aktual</th>
                                                    <th className="px-4 py-2.5 text-center">Target Benchmark</th>
                                                    <th className="px-4 py-2.5 text-center">Skor Sebelumnya</th>
                                                    <th className="px-4 py-2.5 text-center">Skor Terkini</th>
                                                    <th className="px-4 py-2.5 text-center">Pertumbuhan</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {item_analysis.map((item, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                                        <td className="px-4 py-2.5">
                                                            <div className="font-bold text-slate-900 text-xs">{item.name}</div>
                                                            <span className="text-[9px] text-slate-400 font-semibold">{item.category}</span>
                                                        </td>
                                                        <td className="px-4 py-2.5 text-center font-bold text-slate-900 bg-slate-50/30">
                                                            {formatNumber(item.result_value)} <span className="text-[9px] font-normal text-slate-500">{item.unit}</span>
                                                        </td>
                                                        <td className="px-4 py-2.5 text-center">
                                                            <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-700 border border-slate-200/70">
                                                                <Target size={10} className="text-slate-400" />
                                                                {formatNumber(item.target_value)} {item.unit}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2.5 text-center text-slate-500 font-medium">
                                                            {item.previous_score > 0 ? `${formatScore(item.previous_score)}%` : '-'}
                                                        </td>
                                                        <td className="px-4 py-2.5 text-center">
                                                            <span className="inline-block font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded text-xs border border-orange-200/70">
                                                                {formatScore(item.score)}%
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2.5 text-center">
                                                            <div className="flex justify-center">
                                                                <div className="bg-white px-2 py-0.5 rounded border border-slate-200/80 shadow-2xs">
                                                                    <GrowthIndicator value={item.growth} />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white border border-dashed border-slate-200/90 rounded-xl flex flex-col items-center justify-center p-8 text-slate-400 gap-1.5 shadow-2xs">
                            <Activity className="w-6 h-6 opacity-30 text-slate-400" />
                            <p className="text-xs font-bold text-slate-500">Belum ada rekaman tes performa fisik</p>
                        </div>
                    )}
                </div>

                {/* ─── 6. TRAINING LOAD & PHYSIOLOGICAL RECOVERY (30 DAYS) ─── */}
                <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5">
                        <div className="p-1 bg-orange-50 text-orange-500 rounded-md border border-orange-100">
                            <Battery size={13} />
                        </div>
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight">Tren Beban Latihan & Pemulihan Fisiologis (30 Hari)</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-3">
                        {/* Training Load 30 Days */}
                        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                            <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                                <Battery size={13} className="text-orange-500" /> Beban Latihan (AU) vs Skor Wellness (/30)
                            </h3>
                            <div className="h-[250px] sm:h-[280px] w-full">
                                {training_loads && training_loads.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={training_loads} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                                            <YAxis yAxisId="left" tick={{ fontSize: 9, fill: '#fb923c', fontWeight: 600 }} axisLine={false} tickLine={false} />
                                            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fill: '#f97316', fontWeight: 600 }} axisLine={false} tickLine={false} domain={[0, 40]}/>
                                            <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={customTooltipStyle} />
                                            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} iconType="circle" />
                                            <Bar yAxisId="left" name="Daily Load (AU)" dataKey="daily_load" fill="#fed7aa" radius={[3, 3, 0, 0]} barSize={14} />
                                            <Line yAxisId="right" type="monotone" dataKey="wellness" name="Wellness (/30)" stroke="#f97316" strokeWidth={2} dot={{r: 2.5, fill: '#fff', strokeWidth: 1.5}} activeDot={{r: 4}} />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-1.5 py-8">
                                        <Activity className="w-6 h-6 opacity-30 text-slate-400" />
                                        <p className="text-xs font-bold text-slate-500">Belum ada data beban latihan</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Physiological Recovery 30 Days */}
                        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                            <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                                <HeartPulse size={13} className="text-emerald-500" /> Kurva Pemulihan Fisiologis (% Recovery)
                            </h3>
                            <div className="h-[250px] sm:h-[280px] w-full">
                                {daily_metrics && daily_metrics.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={daily_metrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorRecUnified" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="date" tick={{fontSize: 9, fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} />
                                            <YAxis tick={{fontSize: 9, fill: '#94a3b8', fontWeight: 600}} axisLine={false} tickLine={false} domain={[0, 100]}/>
                                            <RechartsTooltip contentStyle={customTooltipStyle} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }} />
                                            <Area type="monotone" dataKey="recovery" name="Recovery Score (%)" stroke="#10b981" strokeWidth={2.5} fill="url(#colorRecUnified)" activeDot={{r: 4}} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-1.5 py-8">
                                        <HeartPulse className="w-6 h-6 opacity-30 text-slate-400" />
                                        <p className="text-xs font-bold text-slate-500">Belum ada data pemulihan harian</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── 7. BODY COMPOSITION ANATOMY VISUALIZATION ─── */}
                {latest_composition && (
                    <div className="space-y-2.5">
                        <CompositionAnatomy test={latest_composition} />
                    </div>
                )}

                {/* ─── 8. BIOMETRIC PROGRESS GALLERY ─── */}
                <div className="space-y-2.5">
                    <AthleteGallery 
                        athlete={safeAthlete} 
                        galleries={galleries && galleries.length > 0 ? galleries : (safeAthlete.galleries || [])} 
                    />
                </div>

                {/* ─── 9. COMPLETE PERFORMANCE SESSIONS HISTORY ─── */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <History size={13} className="text-orange-500" /> Riwayat Seluruh Sesi Tes Performa
                        </h3>
                        <span className="text-[10px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded border border-slate-200/80">
                            Total {history_data?.length || 0} Sesi
                        </span>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-xs text-left whitespace-nowrap">
                            <thead className="text-[10px] text-slate-500 bg-slate-50/70 border-b border-slate-200/80 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-2.5">Tanggal Sesi</th>
                                    <th className="px-4 py-2.5 text-center">Skor Kumulatif</th>
                                    <th className="px-4 py-2.5 text-center">Evaluasi Kinerja</th>
                                    <th className="px-4 py-2.5 text-right">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {history_data && history_data.length > 0 ? (
                                    history_data.map((session) => (
                                        <tr key={session.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-4 py-2.5 font-bold text-slate-800">{session.full_date}</td>
                                            <td className="px-4 py-2.5 text-center">
                                                <span className="font-black text-orange-600 text-sm">{formatScore(session.score)}</span>
                                            </td>
                                            <td className="px-4 py-2.5 text-center">
                                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                                                    session.score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70' : 
                                                    session.score >= 60 ? 'bg-amber-50 text-amber-700 border-amber-200/70' : 
                                                    'bg-rose-50 text-rose-700 border-rose-200/70'
                                                }`}>
                                                    {session.score >= 80 ? 'Excellent' : session.score >= 60 ? 'Good' : 'Needs Improvement'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5 text-right">
                                                <Link 
                                                    href={route('admin.performance.show', session.id)} 
                                                    className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-orange-500 hover:text-white rounded-md transition-all shadow-2xs"
                                                >
                                                    Detail Sesi
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-8 text-center text-slate-400 italic">
                                            Belum ada riwayat tes performa fisik yang terekam.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>               </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}