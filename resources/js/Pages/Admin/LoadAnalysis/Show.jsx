import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import PageHeader from '@/Components/Common/PageHeader';
import { 
    BarChart3, 
    Dumbbell, 
    TrendingUp, 
    Target, 
    Flame, 
    Calendar, 
    ChevronDown, 
    ChevronRight, 
    ChevronLeft, 
    Award,
    Activity,
    Search,
    Info,
    CheckCircle2,
    AlertTriangle,
    ShieldAlert,
    ArrowUpRight
} from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Cell, LabelList, ComposedChart, ReferenceLine
} from 'recharts';

export default function Show({ athlete, sessions = [], exerciseStats = [], weeklyData = [], summary = {} }) {
    const [expandedSessions, setExpandedSessions] = useState(new Set());
    const [activeChartTab, setActiveChartTab] = useState('trend'); // 'trend', 'weekly', 'exercise'
    
    // Filters
    const [sessionTypeFilter, setSessionTypeFilter] = useState('all'); // 'all', 'individual', 'group'
    const [exerciseSearch, setExerciseSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sessionSearch, setSessionSearch] = useState('');

    const toggleSession = (id) => {
        const next = new Set(expandedSessions);
        next.has(id) ? next.delete(id) : next.add(id);
        setExpandedSessions(next);
    };

    const expandAllSessions = () => {
        const allKeys = new Set(sessions.map(s => `${s.type}-${s.id}`));
        setExpandedSessions(allKeys);
    };

    const collapseAllSessions = () => {
        setExpandedSessions(new Set());
    };

    const formatVolume = (v) => {
        if (!v || isNaN(v)) return '0';
        if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
        if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
        return Math.round(v).toLocaleString('id-ID');
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Filtered Sessions for Chart & Table
    const filteredSessions = useMemo(() => {
        return sessions.filter(s => {
            const matchesType = sessionTypeFilter === 'all' || s.type === sessionTypeFilter;
            const matchesSearch = !sessionSearch || 
                (s.name && s.name.toLowerCase().includes(sessionSearch.toLowerCase())) ||
                (s.date && s.date.includes(sessionSearch));
            return matchesType && matchesSearch;
        });
    }, [sessions, sessionTypeFilter, sessionSearch]);

    // Trend chart data
    const trendData = useMemo(() => filteredSessions.map((s, i) => ({
        index: i + 1,
        name: formatDate(s.date),
        rawDate: s.date,
        volume: s.total_volume || 0,
        sessionName: s.name,
        type: s.type === 'group' ? 'Grup' : 'Individu',
        exerciseCount: s.exercise_count || (s.exercises ? s.exercises.length : 0),
        maxLoad: s.max_load || 0,
    })), [filteredSessions]);

    // Categories list for exercise filter
    const categories = useMemo(() => {
        const cats = new Set();
        exerciseStats.forEach(e => {
            if (e.category) cats.add(e.category);
        });
        return Array.from(cats);
    }, [exerciseStats]);

    // Filtered Exercises
    const filteredExercises = useMemo(() => {
        return exerciseStats.filter(e => {
            const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
            const matchesSearch = !exerciseSearch || 
                (e.name && e.name.toLowerCase().includes(exerciseSearch.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [exerciseStats, selectedCategory, exerciseSearch]);

    // Weekly Chart Data
    const weeklyChartData = useMemo(() => weeklyData.map(w => ({
        name: w.label,
        volume: w.total_volume || 0,
        sessions: w.session_count || 0,
        monotony: w.monotony || 0,
        strain: w.strain || 0,
        acwr: w.acwr || 0,
        std_dev: w.std_dev || 0,
    })), [weeklyData]);

    // Top Exercise Chart Data
    const exerciseChartData = useMemo(() =>
        exerciseStats.slice(0, 10).map(e => ({
            name: e.name && e.name.length > 18 ? e.name.substring(0, 16) + '...' : e.name,
            fullName: e.name,
            volume: e.total_volume || 0,
            category: e.category,
        })), [exerciseStats]);

    const barColors = ['#f97316', '#fb923c', '#fdba74', '#ea580c', '#c2410c', '#9a3412', '#7c2d12', '#6366f1', '#8b5cf6', '#0ea5e9'];

    // Latest ACWR Calculation & Status
    const latestWeek = weeklyData.length > 0 ? weeklyData[weeklyData.length - 1] : null;
    const latestAcwr = latestWeek ? latestWeek.acwr : 0;
    const getAcwrStatus = (val) => {
        if (!val || val === 0) return { label: 'Belum Terhitung', color: 'text-slate-500 bg-slate-100 border-slate-200', icon: Info };
        if (val < 0.8) return { label: 'Under-trained (<0.8)', color: 'text-sky-700 bg-sky-50 border-sky-200', icon: Info };
        if (val <= 1.3) return { label: 'Optimal (0.8 - 1.3)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle2 };
        if (val <= 1.5) return { label: 'Caution (1.3 - 1.5)', color: 'text-amber-700 bg-amber-50 border-amber-200', icon: AlertTriangle };
        return { label: 'Danger (>1.5)', color: 'text-rose-700 bg-rose-50 border-rose-200', icon: ShieldAlert };
    };
    const acwrStatus = getAcwrStatus(latestAcwr);
    const AcwrIcon = acwrStatus.icon;

    // Breakdown counts
    const indCount = sessions.filter(s => s.type === 'individual').length;
    const grpCount = sessions.filter(s => s.type === 'group').length;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0]?.payload;
            return (
                <div className="bg-slate-900/95 text-white backdrop-blur-xs border border-slate-800 rounded-lg shadow-xl px-3 py-2 text-xs min-w-[200px]">
                    <div className="flex items-center justify-between gap-3 pb-1.5 mb-1.5 border-b border-slate-800">
                        <span className="font-bold text-slate-200">{label}</span>
                        {data?.type && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${data.type === 'Grup' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-orange-500/20 text-orange-300'}`}>
                                {data.type}
                            </span>
                        )}
                    </div>
                    {data?.sessionName && (
                        <p className="text-[11px] text-slate-300 font-medium mb-1.5 truncate max-w-[220px]">
                            {data.sessionName}
                        </p>
                    )}
                    {payload.map((entry, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4 py-0.5 text-xs font-semibold">
                            <span className="text-slate-400 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color || '#f97316' }} />
                                {entry.name}:
                            </span>
                            <span className="text-white font-bold">
                                {entry.value?.toLocaleString('id-ID')} {entry.name === 'Volume Load' || entry.name === 'Volume Mingguan' || entry.name === 'Strain' ? 'AU' : ''}
                            </span>
                        </div>
                    ))}
                    {data?.maxLoad > 0 && (
                        <div className="flex items-center justify-between gap-4 pt-1 mt-1 border-t border-slate-800/80 text-[10.5px] text-slate-400">
                            <span>Max Load:</span>
                            <span className="text-amber-300 font-bold">{data.maxLoad} kg</span>
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    const ExerciseTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-slate-900/95 text-white backdrop-blur-xs border border-slate-800 rounded-lg shadow-xl px-3 py-2 text-xs">
                    <p className="font-bold text-slate-200 mb-0.5">{data.fullName}</p>
                    <p className="text-[10px] text-slate-400 mb-1">{data.category}</p>
                    <p className="font-bold text-orange-400">Total Load: {data.volume?.toLocaleString('id-ID')} AU</p>
                </div>
            );
        }
        return null;
    };

    return (
        <AppLayout title={`Analisis Beban - ${athlete?.name}`}>
            <Head title={`Analisis Beban - ${athlete?.name}`} />

            <div className="space-y-4 pb-12">
                {/* ─── 1. STANDARD CLEAN PAGE HEADER ─── */}
                <PageHeader
                    title={`Analisis Beban ${athlete?.name}`}
                    description="Volume load dari seluruh sesi latihan kekuatan (individu & grup)"
                    icon={BarChart3}
                    badge={athlete?.sport?.name || ''}
                    actions={
                        <Link
                            href={route('admin.load-analysis.index')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs"
                        >
                            <ChevronLeft size={14} /> Kembali
                        </Link>
                    }
                />

                {/* ─── 2. 5 MINIMALIST KPI CARDS ─── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[
                        { 
                            label: 'Total Volume Load', 
                            value: formatVolume(summary.total_volume), 
                            suffix: 'AU', 
                            icon: Flame, 
                            color: 'orange',
                        },
                        { 
                            label: 'Rata-rata per Sesi', 
                            value: formatVolume(summary.avg_per_session), 
                            suffix: 'AU', 
                            icon: Target, 
                            color: 'blue',
                        },
                        { 
                            label: 'Max Volume (1 Sesi)', 
                            value: formatVolume(summary.max_single_session), 
                            suffix: 'AU', 
                            icon: TrendingUp, 
                            color: 'emerald',
                        },
                        { 
                            label: 'Beban Terberat', 
                            value: `${summary.max_load || 0}`, 
                            suffix: 'kg', 
                            icon: Dumbbell, 
                            color: 'indigo',
                        },
                        { 
                            label: 'Total Sesi', 
                            value: summary.total_sessions || 0, 
                            suffix: 'sesi', 
                            icon: Calendar, 
                            color: 'purple',
                        },
                    ].map((card, i) => {
                        const colorMap = {
                            orange: 'text-orange-500 bg-orange-50/80 border-orange-100',
                            blue: 'text-blue-500 bg-blue-50/80 border-blue-100',
                            emerald: 'text-emerald-500 bg-emerald-50/80 border-emerald-100',
                            indigo: 'text-indigo-500 bg-indigo-50/80 border-indigo-100',
                            purple: 'text-purple-500 bg-purple-50/80 border-purple-100',
                        };
                        const c = colorMap[card.color] || colorMap.orange;
                        const Icon = card.icon;
                        return (
                            <div 
                                key={i} 
                                className="bg-white rounded-md border border-slate-200/80 p-3.5 shadow-2xs hover:border-slate-300 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-bold text-slate-500 truncate">{card.label}</span>
                                    <div className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 ${c}`}>
                                        <Icon size={12} />
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{card.value}</span>
                                    <span className="text-[11px] font-semibold text-slate-400">{card.suffix}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ─── 3. INTERACTIVE CHART STUDIO ─── */}
                {sessions.length > 0 && (
                    <div className="space-y-3">
                        {/* Tab Pills */}
                        <div className="flex items-center gap-1.5">
                            {[
                                { key: 'trend', label: 'Tren Volume', icon: TrendingUp },
                                { key: 'weekly', label: 'Per Minggu', icon: Calendar },
                                { key: 'exercise', label: 'Per Exercise', icon: Dumbbell },
                            ].map(tab => {
                                const Icon = tab.icon;
                                const isActive = activeChartTab === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => setActiveChartTab(tab.key)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                                            isActive
                                                ? 'bg-orange-500 text-white shadow-2xs'
                                                : 'bg-white border border-slate-200/90 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Icon size={13} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Chart Container */}
                        <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs p-4 sm:p-5">
                            {/* TAB 1: Trend */}
                            {activeChartTab === 'trend' && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-xs font-bold text-slate-900">Tren Volume Load per Sesi</h3>
                                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                                            <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                                            <span>Volume Load (AU)</span>
                                        </div>
                                    </div>
                                    <div className="h-[280px] sm:h-[340px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                                <defs>
                                                    <linearGradient id="trendVolumeGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                                <XAxis 
                                                    dataKey="name" 
                                                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} 
                                                    axisLine={{ stroke: '#e2e8f0' }}
                                                    tickLine={false} 
                                                    dy={8}
                                                />
                                                <YAxis 
                                                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} 
                                                    axisLine={false}
                                                    tickLine={false} 
                                                    tickFormatter={formatVolume} 
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Area 
                                                    type="monotone" 
                                                    dataKey="volume" 
                                                    stroke="#f97316" 
                                                    strokeWidth={2.5} 
                                                    fill="url(#trendVolumeGradient)" 
                                                    dot={{ r: 4, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }} 
                                                    activeDot={{ r: 6, fill: '#f97316', stroke: '#fff', strokeWidth: 2.5 }} 
                                                    name="Volume Load" 
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: Weekly Load */}
                            {activeChartTab === 'weekly' && (
                                <div className="space-y-5">
                                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                                        <div>
                                            <h3 className="text-xs font-bold text-slate-900">Load & ACWR Trend Mingguan</h3>
                                            <p className="text-[11px] text-slate-500 mt-0.5">Overview beban mingguan, strain, dan rasio ACWR</p>
                                        </div>
                                        <div className="flex items-center gap-3 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 text-[10px] font-bold text-slate-600">
                                            <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-indigo-500 rounded-xs" /> Weekly Load</div>
                                            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-rose-500 rounded-full" /> Strain</div>
                                            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-700 rounded-full" /> ACWR</div>
                                        </div>
                                    </div>

                                    {/* ACWR Legend Bar */}
                                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 bg-slate-50 border border-slate-200/80 rounded-md py-1.5 px-3 text-[10.5px] font-semibold">
                                        <div className="flex items-center gap-1 text-slate-500">
                                            <div className="w-2 h-2 rounded-full bg-slate-400" /> Under (&lt;0.8)
                                        </div>
                                        <div className="text-slate-300">|</div>
                                        <div className="flex items-center gap-1 text-emerald-600">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" /> Safe (0.8 - 1.3)
                                        </div>
                                        <div className="text-slate-300">|</div>
                                        <div className="flex items-center gap-1 text-amber-600">
                                            <div className="w-2 h-2 rounded-full bg-amber-500" /> Caution (1.3 - 1.5)
                                        </div>
                                        <div className="text-slate-300">|</div>
                                        <div className="flex items-center gap-1 text-rose-600">
                                            <div className="w-2 h-2 rounded-full bg-rose-500" /> Danger (&gt;1.5)
                                        </div>
                                    </div>

                                    <div className="h-[320px] sm:h-[360px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ComposedChart data={weeklyChartData} margin={{ top: 20, right: 10, bottom: 20, left: -15 }}>
                                                <defs>
                                                    <linearGradient id="weeklyLoadGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.85} />
                                                        <stop offset="95%" stopColor="#a5b4fc" stopOpacity={0.3} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} dy={8} />
                                                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#6366f1', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
                                                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                                                
                                                <Bar yAxisId="left" dataKey="volume" name="Volume Mingguan" fill="url(#weeklyLoadGradient)" barSize={36} radius={[4, 4, 0, 0]}>
                                                    <LabelList dataKey="volume" position="top" fill="#4f46e5" fontSize={9} fontWeight={700} formatter={(v) => v > 0 ? (v >= 1000 ? `${(v/1000).toFixed(1)}k` : v) : ''} />
                                                </Bar>
                                                <Line yAxisId="left" type="monotone" dataKey="strain" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3.5, fill: '#fff', stroke: '#f43f5e', strokeWidth: 2 }} activeDot={{ r: 5, fill: '#f43f5e' }} name="Strain" />
                                                <Line yAxisId="right" type="monotone" dataKey="acwr" stroke="#334155" strokeWidth={2} dot={{ r: 3.5, fill: '#fff', stroke: '#334155', strokeWidth: 2 }} activeDot={{ r: 5, fill: '#334155' }} name="ACWR" />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Weekly Breakdown Cards */}
                                    <div className="space-y-3 pt-2">
                                        {[...weeklyData].reverse().map((week, idx) => (
                                            <div key={idx} className="bg-slate-50/70 border border-slate-200/80 rounded-md p-3.5 sm:p-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200/70">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center text-orange-600 font-bold text-xs shadow-2xs">
                                                            W{weeklyData.length - idx}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Week {weeklyData.length - idx}</h4>
                                                            <p className="text-[10.5px] text-slate-400 font-medium">({week.label})</p>
                                                        </div>
                                                    </div>
                                                    <div className={`px-2.5 py-1 rounded-md border text-xs font-bold flex items-center gap-1.5 w-fit ${
                                                        week.acwr > 1.5 ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                                                        (week.acwr >= 0.8 && week.acwr <= 1.3 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200')
                                                    }`}>
                                                        <span>ACWR:</span>
                                                        <span className="font-extrabold">{week.acwr > 0 ? week.acwr : 'N/A'}</span>
                                                    </div>
                                                </div>

                                                {/* Daily load mini heatmap */}
                                                <div className="mb-3">
                                                    <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                                                        {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => (
                                                            <div key={day} className="bg-white border border-slate-200/80 rounded-md p-1.5 text-center shadow-2xs">
                                                                <div className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">{day}</div>
                                                                <div className="text-[10.5px] sm:text-xs font-bold text-slate-800 truncate">
                                                                    {week.daily_volumes?.[day] > 0 ? `${week.daily_volumes[day].toLocaleString('id-ID')}` : '-'}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Metrics row */}
                                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 text-xs">
                                                    <div className="bg-white border border-slate-200/80 rounded-md p-2 shadow-2xs">
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Weekly Load</span>
                                                        <span className="text-xs font-bold text-slate-900">{week.total_volume?.toLocaleString('id-ID')} AU</span>
                                                    </div>
                                                    <div className="bg-white border border-slate-200/80 rounded-md p-2 shadow-2xs">
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Mean Daily</span>
                                                        <span className="text-xs font-bold text-slate-900">{week.mean_load?.toLocaleString('id-ID')} AU</span>
                                                    </div>
                                                    <div className="bg-white border border-slate-200/80 rounded-md p-2 shadow-2xs">
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Std. Dev</span>
                                                        <span className="text-xs font-bold text-slate-900">{week.std_dev?.toLocaleString('id-ID')}</span>
                                                    </div>
                                                    <div className="bg-white border border-slate-200/80 rounded-md p-2 shadow-2xs">
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Monotony</span>
                                                        <span className={`text-xs font-bold ${week.monotony > 2.0 ? 'text-rose-600' : 'text-emerald-600'}`}>{week.monotony}</span>
                                                    </div>
                                                    <div className="bg-white border border-slate-200/80 rounded-md p-2 shadow-2xs">
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Strain</span>
                                                        <span className="text-xs font-bold text-slate-900">{week.strain?.toLocaleString('id-ID')}</span>
                                                    </div>
                                                    <div className="bg-white border border-slate-200/80 rounded-md p-2 shadow-2xs">
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Sesi</span>
                                                        <span className="text-xs font-bold text-slate-900">{week.session_count} sesi</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: Top Exercise */}
                            {activeChartTab === 'exercise' && (
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900 mb-3">Top 10 Exercise (Volume Load)</h3>
                                    <div className="h-[320px] sm:h-[380px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={exerciseChartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                                                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={formatVolume} />
                                                <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: '#334155', fontWeight: 600 }} width={130} />
                                                <Tooltip content={<ExerciseTooltip />} />
                                                <Bar dataKey="volume" name="Volume Load" radius={[0, 4, 4, 0]} maxBarSize={24}>
                                                    {exerciseChartData.map((_, idx) => (
                                                        <Cell key={idx} fill={barColors[idx % barColors.length]} />
                                                    ))}
                                                    <LabelList dataKey="volume" position="right" fill="#64748b" fontSize={9.5} fontWeight={600} formatter={(v) => `${v?.toLocaleString('id-ID')} AU`} />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── 4. STATISTIK PER EXERCISE TABLE ─── */}
                {exerciseStats.length > 0 && (
                    <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-orange-500" />
                                <h3 className="text-xs sm:text-sm font-bold text-slate-900">Statistik per Exercise</h3>
                            </div>
                            <span className="text-[11px] font-medium text-slate-400">{exerciseStats.length} Exercise</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/80 border-b border-slate-200/80">
                                    <tr>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase">#</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase">Nama Exercise</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase">Kategori</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase text-right">Total Volume</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase text-center">Beban Maks</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase text-center">Total Set</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase text-center">Total Rep</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase text-center">Sesi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {filteredExercises.map((ex, i) => (
                                        <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-4 py-2.5 font-bold text-slate-400">{i + 1}</td>
                                            <td className="px-4 py-2.5">
                                                <span className="font-semibold text-slate-900">{ex.name}</span>
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/80">
                                                    {ex.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5 text-right font-bold text-orange-600">
                                                {ex.total_volume?.toLocaleString('id-ID')} <span className="text-[10px] text-slate-400 font-normal">AU</span>
                                            </td>
                                            <td className="px-4 py-2.5 text-center font-semibold text-slate-700">
                                                {ex.max_load} kg
                                            </td>
                                            <td className="px-4 py-2.5 text-center font-medium text-slate-600">{ex.total_sets}</td>
                                            <td className="px-4 py-2.5 text-center font-medium text-slate-600">{ex.total_reps}</td>
                                            <td className="px-4 py-2.5 text-center">
                                                <span className="inline-flex min-w-[1.5rem] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100">
                                                    {ex.session_count}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ─── 5. DETAIL VOLUME PER SESI (EXPANDABLE TABLE) ─── */}
                {sessions.length > 0 && (
                    <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-orange-500" />
                                <h3 className="text-xs sm:text-sm font-bold text-slate-900">Detail Volume per Sesi</h3>
                            </div>
                            <span className="text-[11px] font-medium text-slate-400">{sessions.length} Sesi</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/80 border-b border-slate-200/80">
                                    <tr>
                                        <th className="px-4 py-2.5 w-8"></th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase">Tanggal</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase">Nama Sesi</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase">Tipe</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase text-center">Exercise</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase text-right">Volume Load</th>
                                        <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase text-center">Max Beban</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {[...filteredSessions].reverse().map((session) => {
                                        const key = `${session.type}-${session.id}`;
                                        const isExpanded = expandedSessions.has(key);
                                        return (
                                            <React.Fragment key={key}>
                                                <tr 
                                                    className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                                                    onClick={() => toggleSession(key)}
                                                >
                                                    <td className="px-3 py-2.5 text-center">
                                                        <button type="button" className="p-0.5 text-slate-400 hover:text-slate-800 rounded">
                                                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-2.5 font-semibold text-slate-700 whitespace-nowrap">
                                                        {formatDate(session.date)}
                                                    </td>
                                                    <td className="px-4 py-2.5">
                                                        <span className="font-semibold text-slate-900">{session.name}</span>
                                                    </td>
                                                    <td className="px-4 py-2.5">
                                                        <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded border ${
                                                            session.type === 'group'
                                                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200/80'
                                                                : 'bg-orange-50 text-orange-700 border-orange-200/80'
                                                        }`}>
                                                            {session.type === 'group' ? 'Grup' : 'Individu'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2.5 text-center font-medium text-slate-600">
                                                        {session.exercise_count}
                                                    </td>
                                                    <td className="px-4 py-2.5 text-right font-bold text-orange-600">
                                                        {session.total_volume?.toLocaleString('id-ID')} <span className="text-[10px] text-slate-400 font-normal">AU</span>
                                                    </td>
                                                    <td className="px-4 py-2.5 text-center font-medium text-slate-700">
                                                        {session.max_load} kg
                                                    </td>
                                                </tr>

                                                {/* Expanded Breakdown Table */}
                                                {isExpanded && (
                                                    <tr className="bg-slate-50/50">
                                                        <td colSpan="7" className="px-6 py-3 border-b border-slate-100">
                                                            <div className="bg-white border border-slate-200/80 rounded-md overflow-hidden shadow-2xs">
                                                                <table className="w-full text-left text-xs">
                                                                    <thead className="bg-slate-50 border-b border-slate-200/80">
                                                                        <tr>
                                                                            <th className="px-3.5 py-2 text-[10px] font-bold text-slate-500 uppercase">Exercise</th>
                                                                            <th className="px-3.5 py-2 text-[10px] font-bold text-slate-500 uppercase">Kategori</th>
                                                                            <th className="px-3.5 py-2 text-[10px] font-bold text-slate-500 uppercase text-center">Set</th>
                                                                            <th className="px-3.5 py-2 text-[10px] font-bold text-slate-500 uppercase text-center">Rep</th>
                                                                            <th className="px-3.5 py-2 text-[10px] font-bold text-slate-500 uppercase text-center">Max Beban</th>
                                                                            <th className="px-3.5 py-2 text-[10px] font-bold text-slate-500 uppercase text-right">Volume</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-slate-100">
                                                                        {session.exercises && session.exercises.map((ex, idx) => (
                                                                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                                                <td className="px-3.5 py-2 font-semibold text-slate-900">{ex.name}</td>
                                                                                <td className="px-3.5 py-2 text-slate-500">{ex.category}</td>
                                                                                <td className="px-3.5 py-2 text-center text-slate-600 font-medium">{ex.sets}</td>
                                                                                <td className="px-3.5 py-2 text-center text-slate-600 font-medium">{ex.reps}</td>
                                                                                <td className="px-3.5 py-2 text-center text-slate-600 font-medium">{ex.max_load} kg</td>
                                                                                <td className="px-3.5 py-2 text-right font-bold text-orange-600">{ex.volume?.toLocaleString('id-ID')} AU</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ─── 6. EMPTY STATE ─── */}
                {sessions.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 rounded-md border border-dashed border-slate-300 bg-white text-center p-6 shadow-2xs">
                        <div className="p-3 bg-orange-50 border border-orange-200/80 rounded-md mb-3 text-orange-600">
                            <Dumbbell className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">Belum ada data beban latihan</h3>
                        <p className="text-xs text-slate-500 mt-1 font-medium max-w-sm">
                            Data volume load akan muncul secara otomatis setelah atlet memiliki sesi latihan dengan data exercise (sets, reps, load).
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
