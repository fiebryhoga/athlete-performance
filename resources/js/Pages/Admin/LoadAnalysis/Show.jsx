import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import PageHeader from '@/Components/Layout/PageHeader';
import { BarChart3, Dumbbell, TrendingUp, Target, Flame, Calendar, ChevronDown, ChevronRight, ChevronLeft, Award } from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Cell, Legend, ComposedChart, LabelList
} from 'recharts';

export default function Show({ athlete, sessions, exerciseStats, weeklyData, summary }) {
    const [expandedSessions, setExpandedSessions] = useState(new Set());
    const [activeChartTab, setActiveChartTab] = useState('trend'); // 'trend', 'weekly', 'exercise'

    const toggleSession = (id) => {
        const next = new Set(expandedSessions);
        next.has(id) ? next.delete(id) : next.add(id);
        setExpandedSessions(next);
    };

    const formatVolume = (v) => {
        if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
        if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
        return v?.toLocaleString('id-ID') || '0';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Chart data
    const trendData = useMemo(() => sessions.map((s, i) => ({
        index: i + 1,
        name: formatDate(s.date),
        volume: s.total_volume,
        type: s.type === 'group' ? 'Grup' : 'Individu',
    })), [sessions]);

    const weeklyChartData = useMemo(() => weeklyData.map(w => ({
        name: w.label,
        volume: w.total_volume,
        sessions: w.session_count,
        monotony: w.monotony,
        strain: w.strain,
        acwr: w.acwr,
        std_dev: w.std_dev,
    })), [weeklyData]);

    const exerciseChartData = useMemo(() =>
        exerciseStats.slice(0, 10).map(e => ({
            name: e.name.length > 18 ? e.name.substring(0, 16) + '...' : e.name,
            fullName: e.name,
            volume: e.total_volume,
            category: e.category,
        })), [exerciseStats]);

    const barColors = ['orange-500', '#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ea580c', '#c2410c', '#9a3412', '#7c2d12', '#431407'];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg px-4 py-3 min-w-[200px]">
                    <p className="text-xs font-bold text-slate-800 mb-2 pb-2 border-b border-slate-100">{label}</p>
                    {payload.map((entry, idx) => (
                        <p key={idx} className="text-xs font-semibold flex justify-between gap-4 mb-1" style={{ color: entry.color }}>
                            <span>{entry.name}</span>
                            <span>
                                {entry.value?.toLocaleString('id-ID')} 
                                {entry.name === 'Volume Mingguan' || entry.name === 'Strain' ? ' kg' : ''}
                            </span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const ExerciseTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg px-4 py-3">
                    <p className="text-xs font-bold text-slate-800 mb-1">{data.fullName}</p>
                    <p className="text-xs text-slate-500">{data.category}</p>
                    <p className="text-xs font-bold text-orange-500 mt-1">Volume: {data.volume?.toLocaleString('id-ID')} kg</p>
                </div>
            );
        }
        return null;
    };

    return (
        <AppLayout title={`Analisis Beban - ${athlete?.name}`}>
            <Head title={`Analisis Beban - ${athlete?.name}`} />

            <div className="pb-12 space-y-6">
                <PageHeader
                    title={`Analisis Beban ${athlete?.name}`}
                    subtitle="Volume load dari seluruh sesi latihan kekuatan (individu & grup)"
                    icon={BarChart3}
                    badge={athlete?.sport?.name || ''}
                    actions={
                        <Link
                            href={route('admin.load-analysis.index')}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <ChevronLeft size={16} /> Kembali
                        </Link>
                    }
                />

                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
                    {[
                        { label: 'Total Volume Load', value: formatVolume(summary.total_volume), suffix: 'kg', icon: Flame, color: 'orange' },
                        { label: 'Rata-rata per Sesi', value: formatVolume(summary.avg_per_session), suffix: 'kg', icon: Target, color: 'blue' },
                        { label: 'Max Volume (1 Sesi)', value: formatVolume(summary.max_single_session), suffix: 'kg', icon: TrendingUp, color: 'emerald' },
                        { label: 'Beban Terberat', value: `${summary.max_load}`, suffix: 'kg', icon: Dumbbell, color: 'indigo' },
                        { label: 'Total Sesi', value: summary.total_sessions, suffix: 'sesi', icon: Calendar, color: 'purple' },
                    ].map((card, i) => {
                        const colorMap = {
                            orange: { bg: 'from-orange-50 to-orange-100', icon: 'text-orange-500', border: 'border-orange-100' },
                            blue: { bg: 'from-blue-50 to-blue-100', icon: 'text-blue-600', border: 'border-blue-100' },
                            emerald: { bg: 'from-emerald-50 to-emerald-100', icon: 'text-emerald-600', border: 'border-emerald-100' },
                            indigo: { bg: 'from-indigo-50 to-indigo-100', icon: 'text-indigo-600', border: 'border-indigo-100' },
                            purple: { bg: 'from-purple-50 to-purple-100', icon: 'text-purple-600', border: 'border-purple-100' },
                        };
                        const c = colorMap[card.color];
                        const Icon = card.icon;
                        return (
                            <div key={i} className={`relative bg-white rounded-2xl border ${c.border} p-4 md:p-5 shadow-sm overflow-hidden group hover:shadow-md transition-all`}>
                                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${c.bg} rounded-bl-full -mr-3 -mt-3 opacity-60 transition-transform group-hover:scale-110`}></div>
                                <div className="relative">
                                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center ${c.icon} mb-2 shadow-inner`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <p className="text-[10px] md:text-xs font-bold text-slate-500 mb-0.5">{card.label}</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl md:text-2xl font-bold text-slate-800">{card.value}</span>
                                        <span className="text-[10px] font-bold text-slate-400">{card.suffix}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Chart Tabs */}
                {sessions.length > 0 && (
                    <>
                        <div className="flex flex-wrap items-center gap-2">
                            {[
                                { key: 'trend', label: 'Tren Volume', icon: TrendingUp },
                                { key: 'weekly', label: 'Per Minggu', icon: Calendar },
                                { key: 'exercise', label: 'Per Exercise', icon: Dumbbell },
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveChartTab(tab.key)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                        activeChartTab === tab.key
                                            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    <tab.icon size={14} /> {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
                            {/* Trend Chart */}
                            {activeChartTab === 'trend' && (
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 mb-4">Tren Volume Load per Sesi</h3>
                                    <div className="h-[300px] md:h-[350px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={trendData}>
                                                <defs>
                                                    <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="orange-500" stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor="orange-500" stopOpacity={0.02} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} angle={-30} textAnchor="end" height={60} />
                                                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={formatVolume} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Area type="monotone" dataKey="volume" stroke="orange-500" strokeWidth={2.5} fill="url(#volumeGradient)" dot={{ r: 4, fill: 'orange-500', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6, fill: 'orange-500' }} name="Volume Load" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}

                            {/* Premium Weekly Load Analysis (ISMS Standard) */}
                            {activeChartTab === 'weekly' && (
                                <div className="space-y-6">
                                    {/* Chart Card */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                    <TrendingUp className="w-5 h-5 text-slate-500" />
                                                    Load & ACWR Trend
                                                </h3>
                                                <p className="text-xs font-medium text-slate-500 mt-1">Overview of weekly load, strain, and ACWR ratio trends.</p>
                                            </div>
                                            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-600">
                                                <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-400 rounded-sm"></div> Weekly Load</div>
                                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-rose-500 rounded-full"></div> Strain</div>
                                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-slate-600 rounded-full"></div> ACWR</div>
                                            </div>
                                        </div>

                                        {/* ACWR Legend Bar */}
                                        <div className="flex flex-wrap items-center justify-center gap-6 bg-slate-50 border border-slate-200 rounded-xl py-2 mb-6">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                                <div className="w-2.5 h-2.5 rounded-full bg-slate-500"></div> Under (&lt;0.8)
                                            </div>
                                            <div className="text-slate-300">|</div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500">
                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Safe (0.8-1.3)
                                            </div>
                                            <div className="text-slate-300">|</div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500">
                                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> Caution (1.3-1.5)
                                            </div>
                                            <div className="text-slate-300">|</div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500">
                                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div> Danger (&gt;1.5)
                                            </div>
                                        </div>

                                        <div className="h-[400px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <ComposedChart data={weeklyChartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                                    <defs>
                                                        <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.9} />
                                                            <stop offset="95%" stopColor="#c7d2fe" stopOpacity={0.4} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                                                    <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#818cf8', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
                                                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                                                    <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                                                    
                                                    <Bar yAxisId="left" dataKey="volume" fill="url(#blueGradient)" barSize={48} radius={[6, 6, 0, 0]}>
                                                        <LabelList dataKey="volume" position="insideBottom" angle={-90} fill="#4f46e5" fontSize={10} fontWeight={700} offset={25} formatter={(v) => v > 0 ? v.toLocaleString('id-ID') : ''} />
                                                    </Bar>
                                                    <Line yAxisId="left" type="monotone" dataKey="strain" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4, fill: '#fff', stroke: '#f43f5e', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#f43f5e' }}>
                                                        <LabelList dataKey="strain" position="top" angle={-90} fill="#f43f5e" fontSize={9} fontWeight={700} offset={15} formatter={(v) => v > 0 ? v.toLocaleString('id-ID') : ''} />
                                                    </Line>
                                                    <Line yAxisId="right" type="monotone" dataKey="acwr" stroke="#475569" strokeWidth={2.5} dot={{ r: 4, fill: '#fff', stroke: '#475569', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#475569' }} />
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Weekly Cards List */}
                                    <div className="space-y-4">
                                        {[...weeklyData].reverse().map((week, idx) => (
                                            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                                                {/* Card Header */}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
                                                            <Calendar className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-800 text-sm md:text-base">Week {weeklyData.length - idx}</h4>
                                                            <p className="text-xs font-medium text-slate-400">({week.label})</p>
                                                        </div>
                                                    </div>
                                                    <div className={`px-4 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                                                        week.acwr > 1.5 ? 'bg-rose-50 text-rose-600 border-rose-200' : 
                                                        (week.acwr >= 0.8 && week.acwr <= 1.3 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200')
                                                    }`}>
                                                        ACWR <span className="text-sm">{week.acwr > 0 ? week.acwr : 'N/A'}</span>
                                                    </div>
                                                </div>

                                                {/* Daily Load Row */}
                                                <div className="mb-6">
                                                    <h5 className="text-[10px] font-bold text-slate-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                                                        <Flame className="w-3.5 h-3.5" /> DAILY LOAD (kg)
                                                    </h5>
                                                    <div className="grid grid-cols-7 gap-2 md:gap-3">
                                                        {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => (
                                                            <div key={day} className="bg-white border border-slate-100 rounded-xl p-2 md:p-3 text-center shadow-sm">
                                                                <div className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1 md:mb-2">{day}</div>
                                                                <div className="text-[10px] md:text-sm font-bold text-slate-800 break-words">
                                                                    {week.daily_volumes?.[day] > 0 ? week.daily_volumes[day].toLocaleString('id-ID') : '-'}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Metrics Summary Row */}
                                                <div>
                                                    <h5 className="text-[10px] font-bold text-emerald-500 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                                                        <TrendingUp className="w-3.5 h-3.5" /> Metrics & Monitoring Summary
                                                    </h5>
                                                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3">
                                                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 shadow-sm">
                                                            <div className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1.5">Weekly Load</div>
                                                            <div className="text-lg md:text-xl font-bold text-slate-800">{week.total_volume.toLocaleString('id-ID')}</div>
                                                        </div>
                                                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 shadow-sm">
                                                            <div className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1.5">Mean Daily</div>
                                                            <div className="text-lg md:text-xl font-bold text-slate-800">{week.mean_load.toLocaleString('id-ID')}</div>
                                                        </div>
                                                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 shadow-sm">
                                                            <div className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1.5">Std. Deviation</div>
                                                            <div className="text-lg md:text-xl font-bold text-slate-800">{week.std_dev.toLocaleString('id-ID')}</div>
                                                        </div>
                                                        <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
                                                            <div className="text-[9px] md:text-[10px] font-bold text-emerald-500 uppercase mb-1.5">Monotony</div>
                                                            <div className={`text-lg md:text-xl font-bold ${week.monotony > 2.0 ? 'text-rose-500' : 'text-emerald-500'}`}>{week.monotony}</div>
                                                        </div>
                                                        <div className={`rounded-xl p-3 shadow-sm border ${week.strain > 20000 ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-100'}`}>
                                                            <div className={`text-[9px] md:text-[10px] font-bold uppercase mb-1.5 ${week.strain > 20000 ? 'text-rose-500' : 'text-rose-400'}`}>Strain</div>
                                                            <div className={`text-lg md:text-xl font-bold ${week.strain > 20000 ? 'text-rose-600' : 'text-rose-500'}`}>{week.strain.toLocaleString('id-ID')}</div>
                                                        </div>
                                                        <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm flex flex-col justify-between">
                                                            <div className="text-[9px] md:text-[10px] font-bold text-rose-500 uppercase mb-1.5">ACWR Ratio</div>
                                                            <div className={`text-lg md:text-xl font-bold ${
                                                                week.acwr > 1.5 ? 'text-rose-500' : 
                                                                (week.acwr >= 0.8 && week.acwr <= 1.3 ? 'text-emerald-500' : 'text-slate-800')
                                                            }`}>{week.acwr > 0 ? week.acwr : 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Exercise Chart */}
                            {activeChartTab === 'exercise' && (
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 mb-4">Top 10 Exercise (Volume Load)</h3>
                                    <div className="h-[350px] md:h-[400px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={exerciseChartData} layout="vertical" margin={{ left: 10 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                                                <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={formatVolume} />
                                                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} width={130} />
                                                <Tooltip content={<ExerciseTooltip />} />
                                                <Bar dataKey="volume" name="Volume Load" radius={[0, 6, 6, 0]} maxBarSize={28}>
                                                    {exerciseChartData.map((_, idx) => (
                                                        <Cell key={idx} fill={barColors[idx] || 'orange-500'} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Exercise Stats Table */}
                {exerciseStats.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                            <Award className="w-4 h-4 text-orange-500" />
                            <h3 className="text-sm font-bold text-slate-800">Statistik per Exercise</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500">#</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500">Nama Exercise</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500">Kategori</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 text-right">Total Volume</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 text-center">Beban Maks</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 text-center">Total Set</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 text-center">Total Rep</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 text-center">Sesi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {exerciseStats.map((ex, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-5 py-3 text-xs font-bold text-slate-400">{i + 1}</td>
                                            <td className="px-5 py-3">
                                                <span className="text-sm font-bold text-slate-800">{ex.name}</span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                                                    {ex.category}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <span className="text-sm font-bold text-orange-500">{ex.total_volume.toLocaleString('id-ID')}</span>
                                                <span className="text-[10px] text-slate-400 ml-1">kg</span>
                                            </td>
                                            <td className="px-5 py-3 text-center">
                                                <span className="text-xs font-bold text-slate-700">{ex.max_load} kg</span>
                                            </td>
                                            <td className="px-5 py-3 text-center text-xs font-bold text-slate-600">{ex.total_sets}</td>
                                            <td className="px-5 py-3 text-center text-xs font-bold text-slate-600">{ex.total_reps}</td>
                                            <td className="px-5 py-3 text-center">
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

                {/* Session Detail Table */}
                {sessions.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-orange-500" />
                            <h3 className="text-sm font-bold text-slate-800">Detail Volume per Sesi</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-5 py-3 w-10"></th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500">Tanggal</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500">Nama Sesi</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500">Tipe</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 text-center">Exercise</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 text-right">Volume Load</th>
                                        <th className="px-5 py-3 text-xs font-bold text-slate-500 text-center">Max Beban</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {[...sessions].reverse().map((session) => {
                                        const key = `${session.type}-${session.id}`;
                                        const isExpanded = expandedSessions.has(key);
                                        return (
                                            <React.Fragment key={key}>
                                                <tr className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => toggleSession(key)}>
                                                    <td className="px-5 py-3">
                                                        <button className="p-1 text-slate-400 hover:text-slate-800 rounded">
                                                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                        </button>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <span className="text-xs font-bold text-slate-700">{formatDate(session.date)}</span>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <span className="text-sm font-bold text-slate-800">{session.name}</span>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                                            session.type === 'group'
                                                                ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                                                : 'bg-orange-50 text-orange-600 border-orange-100'
                                                        }`}>
                                                            {session.type === 'group' ? 'Grup' : 'Individu'}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3 text-center">
                                                        <span className="text-xs font-bold text-slate-600">{session.exercise_count}</span>
                                                    </td>
                                                    <td className="px-5 py-3 text-right">
                                                        <span className="text-sm font-bold text-orange-500">{session.total_volume.toLocaleString('id-ID')}</span>
                                                        <span className="text-[10px] text-slate-400 ml-1">kg</span>
                                                    </td>
                                                    <td className="px-5 py-3 text-center">
                                                        <span className="text-xs font-bold text-slate-600">{session.max_load} kg</span>
                                                    </td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr className="bg-slate-50/50">
                                                        <td colSpan="7" className="px-8 py-3 border-b border-slate-100">
                                                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                                                                <table className="w-full text-left">
                                                                    <thead className="bg-slate-50">
                                                                        <tr>
                                                                            <th className="px-4 py-2 text-[10px] font-bold text-slate-500">Exercise</th>
                                                                            <th className="px-4 py-2 text-[10px] font-bold text-slate-500">Kategori</th>
                                                                            <th className="px-4 py-2 text-[10px] font-bold text-slate-500 text-center">Set</th>
                                                                            <th className="px-4 py-2 text-[10px] font-bold text-slate-500 text-center">Rep</th>
                                                                            <th className="px-4 py-2 text-[10px] font-bold text-slate-500 text-center">Max Beban</th>
                                                                            <th className="px-4 py-2 text-[10px] font-bold text-slate-500 text-right">Volume</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-slate-100">
                                                                        {session.exercises.map((ex, idx) => (
                                                                            <tr key={idx} className="text-xs hover:bg-slate-50 transition-colors">
                                                                                <td className="px-4 py-2 font-bold text-slate-800">{ex.name}</td>
                                                                                <td className="px-4 py-2 text-slate-500">{ex.category}</td>
                                                                                <td className="px-4 py-2 text-center text-slate-600 font-bold">{ex.sets}</td>
                                                                                <td className="px-4 py-2 text-center text-slate-600 font-bold">{ex.reps}</td>
                                                                                <td className="px-4 py-2 text-center text-slate-600 font-bold">{ex.max_load} kg</td>
                                                                                <td className="px-4 py-2 text-right font-bold text-orange-500">{ex.volume.toLocaleString('id-ID')} kg</td>
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

                {/* Empty State */}
                {sessions.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 text-center">
                        <div className="p-4 bg-white border border-slate-200 rounded-full mb-4 shadow-sm">
                            <Dumbbell className="w-10 h-10 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Belum ada data beban latihan</h3>
                        <p className="text-sm text-slate-500 mt-2 font-medium max-w-md">
                            Data volume load akan muncul otomatis setelah atlet ini memiliki sesi latihan dengan data exercise (sets, reps, load).
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
