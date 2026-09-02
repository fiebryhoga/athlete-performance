import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import PageHeader from '@/Components/Common/PageHeader';
import BodyHighlighter from '@/Components/BodyHighlighter';
import { 
    BarChart3, 
    Dumbbell, 
    TrendingUp, 
    TrendingDown,
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
    ArrowUpRight,
    Layers,
    User as UserIcon,
    Zap,
    GitCompare,
    Sparkles,
    RotateCcw,
    X
} from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Cell, LabelList, ComposedChart, ReferenceLine
} from 'recharts';

export default function Show({ athlete, sessions = [], exerciseStats = [], bodyPartStats = [], weeklyData = [], summary = {} }) {
    const [expandedSessions, setExpandedSessions] = useState(new Set());
    const [activeChartTab, setActiveChartTab] = useState('trend'); // 'trend', 'weekly', 'exercise', 'body'
    const [selectedMuscle, setSelectedMuscle] = useState(null);
    
    // Body Load Map View & Comparison Mode
    const [bodyMapViewMode, setBodyMapViewMode] = useState('compare'); // 'all' | 'compare' | 'single_week'
    const [selectedCurrentWeekIdx, setSelectedCurrentWeekIdx] = useState(
        weeklyData.length > 0 ? weeklyData.length - 1 : 0
    );
    const [selectedPrevWeekIdx, setSelectedPrevWeekIdx] = useState(
        weeklyData.length > 1 ? weeklyData.length - 2 : (weeklyData.length > 0 ? 0 : null)
    );
    
    // Filters
    const [sessionTypeFilter, setSessionTypeFilter] = useState('all'); // 'all', 'individual', 'group'
    const [exerciseSearch, setExerciseSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sessionSearch, setSessionSearch] = useState('');

    // Helper: Compute muscle load stats from a given session array
    const getMuscleStatsForSessions = (targetSessions) => {
        const stats = {};
        let totalVol = 0;

        targetSessions.forEach(session => {
            (session.exercises || []).forEach(ex => {
                const bodyParts = ex.body_parts || [];
                if (Array.isArray(bodyParts) && bodyParts.length > 0) {
                    bodyParts.forEach(part => {
                        if (!stats[part]) {
                            stats[part] = {
                                name: part,
                                total_volume: 0,
                                total_sets: 0,
                                total_reps: 0,
                                session_count: 0,
                                exercises: {},
                            };
                        }
                        stats[part].total_volume += ex.volume || 0;
                        stats[part].total_sets += ex.sets || 0;
                        stats[part].total_reps += ex.reps || 0;
                        stats[part].session_count++;

                        const exName = ex.name;
                        if (!stats[part].exercises[exName]) {
                            stats[part].exercises[exName] = {
                                name: ex.name,
                                category: ex.category || 'Lainnya',
                                volume: 0,
                                sets: 0,
                                reps: 0,
                            };
                        }
                        stats[part].exercises[exName].volume += ex.volume || 0;
                        stats[part].exercises[exName].sets += ex.sets || 0;
                        stats[part].exercises[exName].reps += ex.reps || 0;
                    });
                    totalVol += ex.volume || 0;
                }
            });
        });

        const result = Object.values(stats).map(bp => ({
            ...bp,
            exercises: Object.values(bp.exercises).sort((a, b) => b.volume - a.volume),
        })).sort((a, b) => b.total_volume - a.total_volume);

        return { stats: result, totalVolume: totalVol };
    };

    // Current Week Data
    const currentWeekInfo = weeklyData[selectedCurrentWeekIdx] || null;
    const currentWeekSessions = useMemo(() => {
        if (!currentWeekInfo) return [];
        return sessions.filter(s => s.date >= currentWeekInfo.week_start && s.date <= currentWeekInfo.week_end);
    }, [sessions, currentWeekInfo]);
    const currentWeekMuscleData = useMemo(() => {
        return getMuscleStatsForSessions(currentWeekSessions);
    }, [currentWeekSessions]);

    // Previous Week Data
    const prevWeekInfo = selectedPrevWeekIdx !== null ? weeklyData[selectedPrevWeekIdx] || null : null;
    const prevWeekSessions = useMemo(() => {
        if (!prevWeekInfo) return [];
        return sessions.filter(s => s.date >= prevWeekInfo.week_start && s.date <= prevWeekInfo.week_end);
    }, [sessions, prevWeekInfo]);
    const prevWeekMuscleData = useMemo(() => {
        return getMuscleStatsForSessions(prevWeekSessions);
    }, [prevWeekSessions]);

    // Comparison Matrix (Otot & Perubahan Beban Minggu Ini vs Minggu Lalu)
    const muscleComparisonList = useMemo(() => {
        const map = new Map();

        // 1. Add current week
        currentWeekMuscleData.stats.forEach(bp => {
            map.set(bp.name, {
                name: bp.name,
                current_volume: bp.total_volume || 0,
                current_sets: bp.total_sets || 0,
                current_reps: bp.total_reps || 0,
                current_exercises: bp.exercises || [],
                prev_volume: 0,
                prev_sets: 0,
                prev_reps: 0,
                prev_exercises: [],
            });
        });

        // 2. Add previous week
        prevWeekMuscleData.stats.forEach(bp => {
            if (map.has(bp.name)) {
                const item = map.get(bp.name);
                item.prev_volume = bp.total_volume || 0;
                item.prev_sets = bp.total_sets || 0;
                item.prev_reps = bp.total_reps || 0;
                item.prev_exercises = bp.exercises || [];
            } else {
                map.set(bp.name, {
                    name: bp.name,
                    current_volume: 0,
                    current_sets: 0,
                    current_reps: 0,
                    current_exercises: [],
                    prev_volume: bp.total_volume || 0,
                    prev_sets: bp.total_sets || 0,
                    prev_reps: bp.total_reps || 0,
                    prev_exercises: bp.exercises || [],
                });
            }
        });

        // 3. Compute Delta and Percentages
        return Array.from(map.values()).map(item => {
            const delta = item.current_volume - item.prev_volume;
            let percentChange = 0;
            if (item.prev_volume > 0) {
                percentChange = Math.round((delta / item.prev_volume) * 100);
            } else if (item.current_volume > 0) {
                percentChange = 100; // New muscle trained
            }
            return {
                ...item,
                delta,
                percentChange,
            };
        }).sort((a, b) => (b.current_volume + b.prev_volume) - (a.current_volume + a.prev_volume));
    }, [currentWeekMuscleData, prevWeekMuscleData]);

    // Color Maps for Current & Previous Weeks
    const maxCurrentWeekMuscleVol = Math.max(...currentWeekMuscleData.stats.map(b => b.total_volume || 0), 1);
    const currentWeekColorMap = useMemo(() => {
        const map = {};
        currentWeekMuscleData.stats.forEach(bp => {
            const vol = bp.total_volume || 0;
            if (vol > 0) {
                const ratio = vol / maxCurrentWeekMuscleVol;
                if (ratio >= 0.75) map[bp.name] = '#dc2626'; // Red
                else if (ratio >= 0.50) map[bp.name] = '#ea580c'; // Orange-600
                else if (ratio >= 0.25) map[bp.name] = '#f97316'; // Orange-500
                else map[bp.name] = '#f59e0b'; // Amber-500
            }
        });
        return map;
    }, [currentWeekMuscleData, maxCurrentWeekMuscleVol]);

    const maxPrevWeekMuscleVol = Math.max(...prevWeekMuscleData.stats.map(b => b.total_volume || 0), 1);
    const prevWeekColorMap = useMemo(() => {
        const map = {};
        prevWeekMuscleData.stats.forEach(bp => {
            const vol = bp.total_volume || 0;
            if (vol > 0) {
                const ratio = vol / maxPrevWeekMuscleVol;
                if (ratio >= 0.75) map[bp.name] = '#dc2626';
                else if (ratio >= 0.50) map[bp.name] = '#ea580c';
                else if (ratio >= 0.25) map[bp.name] = '#f97316';
                else map[bp.name] = '#f59e0b';
            }
        });
        return map;
    }, [prevWeekMuscleData, maxPrevWeekMuscleVol]);

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

    // Muscle / Body Parts Load Calculations
    const maxMuscleVolume = useMemo(() => {
        if (!bodyPartStats || bodyPartStats.length === 0) return 1;
        return Math.max(...bodyPartStats.map(b => b.total_volume || 0), 1);
    }, [bodyPartStats]);

    const muscleColorMap = useMemo(() => {
        const map = {};
        if (!bodyPartStats) return map;

        bodyPartStats.forEach(bp => {
            const vol = bp.total_volume || 0;
            if (vol > 0) {
                const ratio = vol / maxMuscleVolume;
                if (ratio >= 0.75) {
                    map[bp.name] = '#dc2626'; // Red-600 (Maksimal)
                } else if (ratio >= 0.50) {
                    map[bp.name] = '#ea580c'; // Orange-600 (Tinggi)
                } else if (ratio >= 0.25) {
                    map[bp.name] = '#f97316'; // Orange-500 (Sedang)
                } else {
                    map[bp.name] = '#f59e0b'; // Amber-500 (Ringan)
                }
            }
        });
        return map;
    }, [bodyPartStats, maxMuscleVolume]);

    const selectedMuscleData = useMemo(() => {
        if (!selectedMuscle || !bodyPartStats) return null;
        return bodyPartStats.find(bp => bp.name === selectedMuscle) || null;
    }, [selectedMuscle, bodyPartStats]);

    const totalLoadAllMuscles = useMemo(() => {
        if (!bodyPartStats) return 0;
        return bodyPartStats.reduce((acc, curr) => acc + (curr.total_volume || 0), 0);
    }, [bodyPartStats]);

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
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {[
                                { key: 'trend', label: 'Tren Volume', icon: TrendingUp },
                                { key: 'weekly', label: 'Per Minggu', icon: Calendar },
                                { key: 'exercise', label: 'Per Exercise', icon: Dumbbell },
                                { key: 'body', label: 'Peta Beban Tubuh', icon: Activity },
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

                            {/* TAB 4: Peta Beban Tubuh / Komparasi Distribusi Otot */}
                            {activeChartTab === 'body' && (
                                <div className="space-y-4">
                                    {/* 1. Header Toolbar with Title, View Mode Switcher, & Floating Heat Legend */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                                        <div>
                                            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                                <Activity size={14} className="text-orange-500" />
                                                <span>Peta Distribusi Beban Tubuh & Komparasi Mingguan</span>
                                            </h3>
                                            <p className="text-[11px] text-slate-500 mt-0.5">
                                                Visualisasi anatomi beban otot dan perbandingan distribusi volume antar minggu
                                            </p>
                                        </div>

                                        {/* View Mode Switcher & Heat Legend */}
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            {/* Heat Legend Pill */}
                                            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-md text-[10.5px] font-semibold text-slate-600">
                                                <span className="text-[9.5px] uppercase font-bold text-slate-400">Intensitas:</span>
                                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> &lt;25%</span>
                                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f97316]" /> 25-50%</span>
                                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ea580c]" /> 50-75%</span>
                                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#dc2626]" /> &gt;75%</span>
                                            </div>

                                            {/* Segmented Control */}
                                            <div className="inline-flex bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs font-semibold">
                                                <button
                                                    type="button"
                                                    onClick={() => setBodyMapViewMode('compare')}
                                                    className={`px-3 py-1 rounded-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                                                        bodyMapViewMode === 'compare'
                                                            ? 'bg-white text-orange-600 shadow-2xs font-bold'
                                                            : 'text-slate-600 hover:text-slate-900'
                                                    }`}
                                                >
                                                    <GitCompare size={13} className={bodyMapViewMode === 'compare' ? 'text-orange-600' : 'text-slate-400'} />
                                                    <span>Komparasi Mingguan</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setBodyMapViewMode('all')}
                                                    className={`px-3 py-1 rounded-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                                                        bodyMapViewMode === 'all'
                                                            ? 'bg-white text-orange-600 shadow-2xs font-bold'
                                                            : 'text-slate-600 hover:text-slate-900'
                                                    }`}
                                                >
                                                    <Layers size={13} className={bodyMapViewMode === 'all' ? 'text-orange-600' : 'text-slate-400'} />
                                                    <span>Semua Sesi</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ─── MODE 1: KOMPARASI MINGGUAN ─── */}
                                    {bodyMapViewMode === 'compare' && (
                                        <div className="space-y-4">
                                            {/* 1. Comparison Selector & KPI Bar */}
                                            <div className="bg-slate-50/70 border border-slate-200/80 rounded-md p-3.5 space-y-3">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-200/70">
                                                    <div className="flex items-center gap-2 flex-wrap text-xs">
                                                        <span className="text-[11px] font-bold text-slate-500 uppercase">Periode:</span>
                                                        
                                                        <select
                                                            value={selectedPrevWeekIdx !== null ? selectedPrevWeekIdx : ''}
                                                            onChange={(e) => setSelectedPrevWeekIdx(e.target.value !== '' ? parseInt(e.target.value) : null)}
                                                            className="bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs font-medium text-slate-800 shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
                                                        >
                                                            {weeklyData.map((w, idx) => (
                                                                <option key={idx} value={idx}>
                                                                    Minggu A: {w.label} ({w.total_volume?.toLocaleString('id-ID')} AU)
                                                                </option>
                                                            ))}
                                                        </select>

                                                        <span className="font-extrabold text-orange-600 px-1 text-xs">VS</span>

                                                        <select
                                                            value={selectedCurrentWeekIdx}
                                                            onChange={(e) => setSelectedCurrentWeekIdx(parseInt(e.target.value))}
                                                            className="bg-white border border-orange-300 rounded-md px-2.5 py-1 text-xs font-bold text-orange-700 shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
                                                        >
                                                            {weeklyData.map((w, idx) => (
                                                                <option key={idx} value={idx}>
                                                                    Minggu B: {w.label} ({w.total_volume?.toLocaleString('id-ID')} AU)
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {selectedMuscle && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedMuscle(null)}
                                                            className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md px-2.5 py-1 shadow-2xs cursor-pointer transition-colors shrink-0 flex items-center gap-1.5"
                                                        >
                                                            <RotateCcw size={12} />
                                                            <span>Reset Sorotan ({selectedMuscle})</span>
                                                        </button>
                                                    )}
                                                </div>

                                                {/* KPI Metric Cards */}
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                    <div className="bg-white border border-slate-200/80 rounded-md p-2.5 shadow-2xs">
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Beban Minggu A</span>
                                                        <div className="mt-0.5 flex items-baseline gap-1">
                                                            <span className="text-sm sm:text-base font-bold text-slate-900">
                                                                {prevWeekInfo ? prevWeekInfo.total_volume?.toLocaleString('id-ID') : 0}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-semibold">AU</span>
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 font-medium truncate block mt-0.5">
                                                            {prevWeekInfo ? prevWeekInfo.label : '-'}
                                                        </span>
                                                    </div>

                                                    <div className="bg-white border border-orange-200 rounded-md p-2.5 shadow-2xs">
                                                        <span className="text-[9px] font-bold text-orange-600 uppercase block">Beban Minggu B</span>
                                                        <div className="mt-0.5 flex items-baseline gap-1">
                                                            <span className="text-sm sm:text-base font-bold text-slate-900">
                                                                {currentWeekInfo ? currentWeekInfo.total_volume?.toLocaleString('id-ID') : 0}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-semibold">AU</span>
                                                        </div>
                                                        <span className="text-[10px] text-orange-600/80 font-medium truncate block mt-0.5">
                                                            {currentWeekInfo ? currentWeekInfo.label : '-'}
                                                        </span>
                                                    </div>

                                                    <div className="bg-white border border-slate-200/80 rounded-md p-2.5 shadow-2xs">
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Perubahan (Δ)</span>
                                                        {(() => {
                                                            const prevVol = prevWeekInfo?.total_volume || 0;
                                                            const currVol = currentWeekInfo?.total_volume || 0;
                                                            const diff = currVol - prevVol;
                                                            const pct = prevVol > 0 ? Math.round((diff / prevVol) * 100) : (currVol > 0 ? 100 : 0);
                                                            const isPositive = diff > 0;
                                                            return (
                                                                <>
                                                                    <div className="mt-0.5 flex items-baseline gap-1">
                                                                        <span className={`text-sm sm:text-base font-bold ${isPositive ? 'text-rose-600' : diff < 0 ? 'text-sky-600' : 'text-slate-900'}`}>
                                                                            {isPositive ? `+${diff.toLocaleString('id-ID')}` : diff.toLocaleString('id-ID')}
                                                                        </span>
                                                                        <span className="text-[10px] text-slate-400 font-semibold">AU</span>
                                                                    </div>
                                                                    <span className={`text-[10px] font-bold flex items-center gap-1 mt-0.5 ${isPositive ? 'text-rose-600' : diff < 0 ? 'text-sky-600' : 'text-slate-500'}`}>
                                                                        {isPositive ? (
                                                                            <>
                                                                                <TrendingUp size={11} />
                                                                                <span>+{pct}%</span>
                                                                            </>
                                                                        ) : diff < 0 ? (
                                                                            <>
                                                                                <TrendingDown size={11} />
                                                                                <span>{pct}%</span>
                                                                            </>
                                                                        ) : (
                                                                            <span>0%</span>
                                                                        )}
                                                                    </span>
                                                                </>
                                                            );
                                                        })()}
                                                    </div>

                                                    <div className="bg-white border border-slate-200/80 rounded-md p-2.5 shadow-2xs">
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Otot Terlatih</span>
                                                        <div className="mt-0.5 flex items-baseline gap-1">
                                                            <span className="text-sm sm:text-base font-bold text-slate-900">
                                                                {currentWeekMuscleData.stats.length}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-semibold">grup</span>
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
                                                            vs {prevWeekMuscleData.stats.length} grup di Minggu A
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 2. Side-by-Side Anatomical Models */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                                {/* WEEK A (PREVIOUS) */}
                                                <div className="bg-slate-50/70 border border-slate-200/80 rounded-md p-3.5 flex flex-col justify-between">
                                                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/70">
                                                        <div>
                                                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                                                                Minggu Sebelumnya
                                                            </span>
                                                            <h4 className="text-xs font-bold text-slate-800">
                                                                {prevWeekInfo ? prevWeekInfo.label : 'Tidak ada data'}
                                                            </h4>
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                                                            {prevWeekInfo?.total_volume?.toLocaleString('id-ID') || 0} AU
                                                        </span>
                                                    </div>

                                                    {/* Two full body models side by side */}
                                                    <div className="grid grid-cols-2 gap-2 my-2">
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Depan</span>
                                                            <div className="w-full max-w-[160px] h-[340px] sm:h-[380px] flex items-center justify-center">
                                                                <BodyHighlighter
                                                                    type="anterior"
                                                                    selectedAreas={selectedMuscle ? [selectedMuscle] : []}
                                                                    onSelectArea={(muscleName) => setSelectedMuscle(selectedMuscle === muscleName ? null : muscleName)}
                                                                    customColorMap={prevWeekColorMap}
                                                                    customTooltip={(muscleName) => {
                                                                        const bp = prevWeekMuscleData.stats.find(b => b.name === muscleName);
                                                                        return bp 
                                                                            ? `${muscleName}: ${bp.total_volume.toLocaleString('id-ID')} AU` 
                                                                            : `${muscleName}: 0 AU`;
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col items-center">
                                                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Belakang</span>
                                                            <div className="w-full max-w-[160px] h-[340px] sm:h-[380px] flex items-center justify-center">
                                                                <BodyHighlighter
                                                                    type="posterior"
                                                                    selectedAreas={selectedMuscle ? [selectedMuscle] : []}
                                                                    onSelectArea={(muscleName) => setSelectedMuscle(selectedMuscle === muscleName ? null : muscleName)}
                                                                    customColorMap={prevWeekColorMap}
                                                                    customTooltip={(muscleName) => {
                                                                        const bp = prevWeekMuscleData.stats.find(b => b.name === muscleName);
                                                                        return bp 
                                                                            ? `${muscleName}: ${bp.total_volume.toLocaleString('id-ID')} AU` 
                                                                            : `${muscleName}: 0 AU`;
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* WEEK B (ACTIVE/CURRENT) */}
                                                <div className="bg-orange-50/30 border border-orange-200/80 rounded-md p-3.5 flex flex-col justify-between">
                                                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-orange-100">
                                                        <div>
                                                            <span className="text-[9px] font-bold uppercase tracking-wider text-orange-600 block">
                                                                Minggu Aktif
                                                            </span>
                                                            <h4 className="text-xs font-bold text-slate-900">
                                                                {currentWeekInfo ? currentWeekInfo.label : 'Tidak ada data'}
                                                            </h4>
                                                        </div>
                                                        <span className="text-xs font-bold text-orange-600 bg-white px-2.5 py-1 rounded-md border border-orange-200 shadow-2xs">
                                                            {currentWeekInfo?.total_volume?.toLocaleString('id-ID') || 0} AU
                                                        </span>
                                                    </div>

                                                    {/* Two full body models side by side */}
                                                    <div className="grid grid-cols-2 gap-2 my-2">
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-[10px] font-bold uppercase text-orange-600 tracking-wider mb-1">Depan</span>
                                                            <div className="w-full max-w-[160px] h-[340px] sm:h-[380px] flex items-center justify-center">
                                                                <BodyHighlighter
                                                                    type="anterior"
                                                                    selectedAreas={selectedMuscle ? [selectedMuscle] : []}
                                                                    onSelectArea={(muscleName) => setSelectedMuscle(selectedMuscle === muscleName ? null : muscleName)}
                                                                    customColorMap={currentWeekColorMap}
                                                                    customTooltip={(muscleName) => {
                                                                        const bp = currentWeekMuscleData.stats.find(b => b.name === muscleName);
                                                                        return bp 
                                                                            ? `${muscleName}: ${bp.total_volume.toLocaleString('id-ID')} AU` 
                                                                            : `${muscleName}: 0 AU`;
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col items-center">
                                                            <span className="text-[10px] font-bold uppercase text-orange-600 tracking-wider mb-1">Belakang</span>
                                                            <div className="w-full max-w-[160px] h-[340px] sm:h-[380px] flex items-center justify-center">
                                                                <BodyHighlighter
                                                                    type="posterior"
                                                                    selectedAreas={selectedMuscle ? [selectedMuscle] : []}
                                                                    onSelectArea={(muscleName) => setSelectedMuscle(selectedMuscle === muscleName ? null : muscleName)}
                                                                    customColorMap={currentWeekColorMap}
                                                                    customTooltip={(muscleName) => {
                                                                        const bp = currentWeekMuscleData.stats.find(b => b.name === muscleName);
                                                                        return bp 
                                                                            ? `${muscleName}: ${bp.total_volume.toLocaleString('id-ID')} AU` 
                                                                            : `${muscleName}: 0 AU`;
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 3. Muscle Comparison Table */}
                                            <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden">
                                                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Activity className="w-4 h-4 text-orange-500" />
                                                        <h3 className="text-xs sm:text-sm font-bold text-slate-900">Rincian Perubahan Beban per Bagian Tubuh</h3>
                                                    </div>
                                                    <span className="text-[11px] font-medium text-slate-400">{muscleComparisonList.length} Bagian Otot</span>
                                                </div>

                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-left text-xs">
                                                        <thead className="bg-slate-50 border-b border-slate-200/80">
                                                            <tr>
                                                                <th className="px-3.5 py-2 text-[10px] font-bold text-slate-500 uppercase">Bagian Otot</th>
                                                                <th className="px-3.5 py-2 text-[10px] font-bold text-slate-500 uppercase text-right">Minggu A</th>
                                                                <th className="px-3.5 py-2 text-[10px] font-bold text-slate-500 uppercase text-right">Minggu B</th>
                                                                <th className="px-3.5 py-2 text-[10px] font-bold text-slate-500 uppercase text-right">Perubahan (Δ AU)</th>
                                                                <th className="px-3.5 py-2 text-[10px] font-bold text-slate-500 uppercase text-center">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {muscleComparisonList.length > 0 ? (
                                                                muscleComparisonList.map((item, idx) => {
                                                                    const isSpike = item.percentChange >= 25 && item.current_volume > 0;
                                                                    const isDeload = item.percentChange < -10;
                                                                    const isNew = item.prev_volume === 0 && item.current_volume > 0;
                                                                    const isSelected = selectedMuscle === item.name;

                                                                    return (
                                                                        <tr
                                                                            key={idx}
                                                                            onClick={() => setSelectedMuscle(isSelected ? null : item.name)}
                                                                            className={`cursor-pointer transition-colors ${
                                                                                isSelected ? 'bg-orange-50/80 font-semibold' : 'hover:bg-slate-50'
                                                                            }`}
                                                                        >
                                                                            <td className="px-3.5 py-2.5 font-semibold text-slate-900 flex items-center gap-2">
                                                                                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-orange-500' : 'bg-slate-300'}`} />
                                                                                <span>{item.name}</span>
                                                                            </td>
                                                                            <td className="px-3.5 py-2.5 text-right text-slate-500">
                                                                                {item.prev_volume > 0 ? `${item.prev_volume.toLocaleString('id-ID')} AU` : '-'}
                                                                            </td>
                                                                            <td className="px-3.5 py-2.5 text-right font-bold text-slate-900">
                                                                                {item.current_volume > 0 ? `${item.current_volume.toLocaleString('id-ID')} AU` : '-'}
                                                                            </td>
                                                                            <td className="px-3.5 py-2.5 text-right font-bold">
                                                                                {item.delta > 0 ? (
                                                                                    <span className="text-rose-600">+{item.delta.toLocaleString('id-ID')} AU</span>
                                                                                ) : item.delta < 0 ? (
                                                                                    <span className="text-sky-600">{item.delta.toLocaleString('id-ID')} AU</span>
                                                                                ) : (
                                                                                    <span className="text-slate-400">0 AU</span>
                                                                                )}
                                                                            </td>
                                                                            <td className="px-3.5 py-2.5 text-center">
                                                                                {isNew ? (
                                                                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                                                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                                                                        <span>Baru Dilatih</span>
                                                                                    </span>
                                                                                ) : isSpike ? (
                                                                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                                                        <span>Kenaikan (+{item.percentChange}%)</span>
                                                                                    </span>
                                                                                ) : isDeload ? (
                                                                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                                                                                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                                                                                        <span>Deload ({item.percentChange}%)</span>
                                                                                    </span>
                                                                                ) : item.current_volume > 0 ? (
                                                                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                                                        <span>Terjaga ({item.percentChange > 0 ? `+${item.percentChange}%` : `${item.percentChange}%`})</span>
                                                                                    </span>
                                                                                ) : (
                                                                                    <span className="text-slate-300">-</span>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={5} className="py-6 text-center text-slate-400 italic">
                                                                        Tidak ada data komparasi bagian tubuh untuk minggu yang dipilih.
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ─── MODE 2: AKUMULASI SEMUA WAKTU ─── */}
                                    {bodyMapViewMode === 'all' && (
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                            {/* Visual Anatomical Models (7 Cols) */}
                                            <div className="lg:col-span-7 bg-slate-50/70 rounded-md border border-slate-200/80 p-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                    {/* Anterior */}
                                                    <div className="flex flex-col items-center bg-white p-3 rounded-md border border-slate-200/80 shadow-2xs">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                            Tampak Depan (Anterior)
                                                        </span>
                                                        <div className="w-full max-w-[180px] h-[350px] sm:h-[390px] flex items-center justify-center p-1">
                                                            <BodyHighlighter
                                                                type="anterior"
                                                                selectedAreas={selectedMuscle ? [selectedMuscle] : []}
                                                                onSelectArea={(muscleName) => setSelectedMuscle(selectedMuscle === muscleName ? null : muscleName)}
                                                                customColorMap={muscleColorMap}
                                                                customTooltip={(muscleName) => {
                                                                    const bp = bodyPartStats.find(b => b.name === muscleName);
                                                                    return bp 
                                                                        ? `${muscleName}: ${bp.total_volume.toLocaleString('id-ID')} AU (${Math.round((bp.total_volume / (totalLoadAllMuscles || 1)) * 100)}%)`
                                                                        : `${muscleName}: 0 AU (Belum dilatih)`;
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Posterior */}
                                                    <div className="flex flex-col items-center bg-white p-3 rounded-md border border-slate-200/80 shadow-2xs">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                            Tampak Belakang (Posterior)
                                                        </span>
                                                        <div className="w-full max-w-[180px] h-[350px] sm:h-[390px] flex items-center justify-center p-1">
                                                            <BodyHighlighter
                                                                type="posterior"
                                                                selectedAreas={selectedMuscle ? [selectedMuscle] : []}
                                                                onSelectArea={(muscleName) => setSelectedMuscle(selectedMuscle === muscleName ? null : muscleName)}
                                                                customColorMap={muscleColorMap}
                                                                customTooltip={(muscleName) => {
                                                                    const bp = bodyPartStats.find(b => b.name === muscleName);
                                                                    return bp 
                                                                        ? `${muscleName}: ${bp.total_volume.toLocaleString('id-ID')} AU (${Math.round((bp.total_volume / (totalLoadAllMuscles || 1)) * 100)}%)`
                                                                        : `${muscleName}: 0 AU (Belum dilatih)`;
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Panel (5 Cols): Selected Muscle Detail OR Top Trained Muscles List */}
                                            <div className="lg:col-span-5 flex flex-col justify-between">
                                                {selectedMuscleData ? (
                                                    <div className="bg-white rounded-md border border-orange-200 p-4 shadow-2xs space-y-3.5 animate-in fade-in duration-200">
                                                        <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                                                            <div>
                                                                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                                                                    Detail Beban Bagian Tubuh
                                                                </span>
                                                                <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                                                                    {selectedMuscleData.name}
                                                                </h4>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => setSelectedMuscle(null)}
                                                                className="text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md cursor-pointer transition-colors"
                                                            >
                                                                Tutup
                                                            </button>
                                                        </div>

                                                        {/* Stats KPI mini */}
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <div className="bg-orange-50/70 p-2.5 rounded-md border border-orange-100 text-center">
                                                                <span className="text-[9px] font-bold text-orange-600 uppercase block">Total Load</span>
                                                                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                                                                    {selectedMuscleData.total_volume.toLocaleString('id-ID')} <span className="text-[10px] font-normal text-slate-400">AU</span>
                                                                </span>
                                                            </div>
                                                            <div className="bg-slate-50 p-2.5 rounded-md border border-slate-100 text-center">
                                                                <span className="text-[9px] font-bold text-slate-500 uppercase block">Total Set</span>
                                                                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                                                                    {selectedMuscleData.total_sets} <span className="text-[10px] font-normal text-slate-400">set</span>
                                                                </span>
                                                            </div>
                                                            <div className="bg-slate-50 p-2.5 rounded-md border border-slate-100 text-center">
                                                                <span className="text-[9px] font-bold text-slate-500 uppercase block">Total Rep</span>
                                                                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                                                                    {selectedMuscleData.total_reps} <span className="text-[10px] font-normal text-slate-400">rep</span>
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Exercise Breakdown for this muscle */}
                                                        <div className="space-y-2 pt-1">
                                                            <span className="text-xs font-bold text-slate-700 block">
                                                                Latihan yang Melatih Bagian Ini ({selectedMuscleData.exercises?.length || 0}):
                                                            </span>
                                                            <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
                                                                {selectedMuscleData.exercises && selectedMuscleData.exercises.map((ex, exIdx) => {
                                                                    const sharePct = Math.round((ex.volume / (selectedMuscleData.total_volume || 1)) * 100);
                                                                    return (
                                                                        <div key={exIdx} className="bg-slate-50/80 p-2.5 rounded-md border border-slate-200/80 space-y-1">
                                                                            <div className="flex items-center justify-between text-xs">
                                                                                <span className="font-semibold text-slate-800 truncate">{ex.name}</span>
                                                                                <span className="font-bold text-orange-600 shrink-0">{ex.volume.toLocaleString('id-ID')} AU</span>
                                                                            </div>
                                                                            <div className="flex items-center justify-between text-[10.5px] text-slate-400">
                                                                                <span>{ex.sets} set &bull; {ex.reps} rep &bull; {ex.category || 'Lainnya'}</span>
                                                                                <span className="font-bold text-slate-600">{sharePct}%</span>
                                                                            </div>
                                                                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                                                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${sharePct}%` }} />
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-white rounded-md border border-slate-200/80 p-4 shadow-2xs space-y-3 flex-1 flex flex-col justify-between">
                                                        <div className="space-y-1">
                                                            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                                                <Award size={14} className="text-orange-500" />
                                                                <span>Ranking Bagian Tubuh Terlatih</span>
                                                            </h4>
                                                            <p className="text-[11px] text-slate-400 font-medium">
                                                                Klik salah satu otot untuk menyorot posisinya pada model tubuh.
                                                            </p>
                                                        </div>

                                                        <div className="space-y-2 flex-1 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                                                            {bodyPartStats && bodyPartStats.length > 0 ? (
                                                                bodyPartStats.slice(0, 8).map((bp, bpIdx) => {
                                                                    return (
                                                                        <div
                                                                            key={bpIdx}
                                                                            onClick={() => setSelectedMuscle(bp.name)}
                                                                            className="group bg-slate-50 hover:bg-orange-50/60 p-2.5 rounded-md border border-slate-200/70 hover:border-orange-300 transition-all cursor-pointer shadow-2xs space-y-1"
                                                                        >
                                                                            <div className="flex items-center justify-between text-xs">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                                                                                        {bpIdx + 1}
                                                                                    </span>
                                                                                    <span className="font-semibold text-slate-800 group-hover:text-orange-700 transition-colors truncate">
                                                                                        {bp.name}
                                                                                    </span>
                                                                                </div>
                                                                                <span className="font-bold text-slate-900">
                                                                                    {bp.total_volume.toLocaleString('id-ID')} <span className="text-[10px] text-slate-400 font-normal">AU</span>
                                                                                </span>
                                                                            </div>
                                                                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                                                <div 
                                                                                    className="h-full bg-orange-500 rounded-full transition-all duration-300"
                                                                                    style={{ width: `${Math.min(100, Math.max(8, (bp.total_volume / maxMuscleVolume) * 100))}%` }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })
                                                            ) : (
                                                                <div className="py-8 text-center text-slate-400 text-xs font-medium italic">
                                                                    Belum ada data latihan dengan target bagian tubuh.
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
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
