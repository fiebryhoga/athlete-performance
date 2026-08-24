import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React, { useState, useMemo } from "react";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { Head, Link } from "@inertiajs/react";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import { BarChart3, ChevronLeft, Flame, Target, TrendingUp, Dumbbell, Calendar, Award, ChevronDown, ChevronRight } from "lucide-react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, ComposedChart, Bar, LabelList, Line, BarChart, Cell } from "recharts";
import "axios";
function Show({ athlete, sessions, exerciseStats, weeklyData, summary }) {
  const [expandedSessions, setExpandedSessions] = useState(/* @__PURE__ */ new Set());
  const [activeChartTab, setActiveChartTab] = useState("trend");
  const toggleSession = (id) => {
    const next = new Set(expandedSessions);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedSessions(next);
  };
  const formatVolume = (v) => {
    if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
    if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
    return v?.toLocaleString("id-ID") || "0";
  };
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };
  const trendData = useMemo(() => sessions.map((s, i) => ({
    index: i + 1,
    name: formatDate(s.date),
    volume: s.total_volume,
    type: s.type === "group" ? "Grup" : "Individu"
  })), [sessions]);
  const weeklyChartData = useMemo(() => weeklyData.map((w) => ({
    name: w.label,
    volume: w.total_volume,
    sessions: w.session_count,
    monotony: w.monotony,
    strain: w.strain,
    acwr: w.acwr,
    std_dev: w.std_dev
  })), [weeklyData]);
  const exerciseChartData = useMemo(() => exerciseStats.slice(0, 10).map((e) => ({
    name: e.name.length > 18 ? e.name.substring(0, 16) + "..." : e.name,
    fullName: e.name,
    volume: e.total_volume,
    category: e.category
  })), [exerciseStats]);
  const barColors = ["orange-500", "#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ea580c", "#c2410c", "#9a3412", "#7c2d12", "#431407"];
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return /* @__PURE__ */ jsxs("div", { className: "bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg px-4 py-3 min-w-[200px]", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-800 mb-2 pb-2 border-b border-slate-100", children: label }),
        payload.map((entry, idx) => /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold flex justify-between gap-4 mb-1", style: { color: entry.color }, children: [
          /* @__PURE__ */ jsx("span", { children: entry.name }),
          /* @__PURE__ */ jsxs("span", { children: [
            entry.value?.toLocaleString("id-ID"),
            entry.name === "Volume Mingguan" || entry.name === "Strain" ? " kg" : ""
          ] })
        ] }, idx))
      ] });
    }
    return null;
  };
  const ExerciseTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return /* @__PURE__ */ jsxs("div", { className: "bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg px-4 py-3", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-800 mb-1", children: data.fullName }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: data.category }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-orange-500 mt-1", children: [
          "Volume: ",
          data.volume?.toLocaleString("id-ID"),
          " kg"
        ] })
      ] });
    }
    return null;
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: `Analisis Beban - ${athlete?.name}`, children: [
    /* @__PURE__ */ jsx(Head, { title: `Analisis Beban - ${athlete?.name}` }),
    /* @__PURE__ */ jsxs("div", { className: "pb-12 space-y-6", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: `Analisis Beban ${athlete?.name}`,
          subtitle: "Volume load dari seluruh sesi latihan kekuatan (individu & grup)",
          icon: BarChart3,
          badge: athlete?.sport?.name || "",
          actions: /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("admin.load-analysis.index"),
              className: "flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm",
              children: [
                /* @__PURE__ */ jsx(ChevronLeft, { size: 16 }),
                " Kembali"
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4", children: [
        { label: "Total Volume Load", value: formatVolume(summary.total_volume), suffix: "kg", icon: Flame, color: "orange" },
        { label: "Rata-rata per Sesi", value: formatVolume(summary.avg_per_session), suffix: "kg", icon: Target, color: "blue" },
        { label: "Max Volume (1 Sesi)", value: formatVolume(summary.max_single_session), suffix: "kg", icon: TrendingUp, color: "emerald" },
        { label: "Beban Terberat", value: `${summary.max_load}`, suffix: "kg", icon: Dumbbell, color: "indigo" },
        { label: "Total Sesi", value: summary.total_sessions, suffix: "sesi", icon: Calendar, color: "purple" }
      ].map((card, i) => {
        const colorMap = {
          orange: { bg: "from-orange-50 to-orange-100", icon: "text-orange-500", border: "border-orange-100" },
          blue: { bg: "from-blue-50 to-blue-100", icon: "text-blue-600", border: "border-blue-100" },
          emerald: { bg: "from-emerald-50 to-emerald-100", icon: "text-emerald-600", border: "border-emerald-100" },
          indigo: { bg: "from-indigo-50 to-indigo-100", icon: "text-indigo-600", border: "border-indigo-100" },
          purple: { bg: "from-purple-50 to-purple-100", icon: "text-purple-600", border: "border-purple-100" }
        };
        const c = colorMap[card.color];
        const Icon = card.icon;
        return /* @__PURE__ */ jsxs("div", { className: `relative bg-white rounded-2xl border ${c.border} p-4 md:p-5 shadow-sm overflow-hidden group hover:shadow-md transition-all`, children: [
          /* @__PURE__ */ jsx("div", { className: `absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${c.bg} rounded-bl-full -mr-3 -mt-3 opacity-60 transition-transform group-hover:scale-110` }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center ${c.icon} mb-2 shadow-inner`, children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] md:text-xs font-bold text-slate-500 mb-0.5", children: card.label }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xl md:text-2xl font-bold text-slate-800", children: card.value }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400", children: card.suffix })
            ] })
          ] })
        ] }, i);
      }) }),
      sessions.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2", children: [
          { key: "trend", label: "Tren Volume", icon: TrendingUp },
          { key: "weekly", label: "Per Minggu", icon: Calendar },
          { key: "exercise", label: "Per Exercise", icon: Dumbbell }
        ].map((tab) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setActiveChartTab(tab.key),
            className: `flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${activeChartTab === tab.key ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`,
            children: [
              /* @__PURE__ */ jsx(tab.icon, { size: 14 }),
              " ",
              tab.label
            ]
          },
          tab.key
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6", children: [
          activeChartTab === "trend" && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-800 mb-4", children: "Tren Volume Load per Sesi" }),
            /* @__PURE__ */ jsx("div", { className: "h-[300px] md:h-[350px]", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: trendData, children: [
              /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "volumeGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "orange-500", stopOpacity: 0.2 }),
                /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "orange-500", stopOpacity: 0.02 })
              ] }) }),
              /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f1f5f9" }),
              /* @__PURE__ */ jsx(XAxis, { dataKey: "name", tick: { fontSize: 10, fill: "#94a3b8" }, angle: -30, textAnchor: "end", height: 60 }),
              /* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 10, fill: "#94a3b8" }, tickFormatter: formatVolume }),
              /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(CustomTooltip, {}) }),
              /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "volume", stroke: "orange-500", strokeWidth: 2.5, fill: "url(#volumeGradient)", dot: { r: 4, fill: "orange-500", stroke: "#fff", strokeWidth: 2 }, activeDot: { r: 6, fill: "orange-500" }, name: "Volume Load" })
            ] }) }) })
          ] }),
          activeChartTab === "weekly" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-slate-800 flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5 text-slate-500" }),
                    "Load & ACWR Trend"
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-slate-500 mt-1", children: "Overview of weekly load, strain, and ACWR ratio trends." })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-600", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-blue-400 rounded-sm" }),
                    " Weekly Load"
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 bg-rose-500 rounded-full" }),
                    " Strain"
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 bg-slate-600 rounded-full" }),
                    " ACWR"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-6 bg-slate-50 border border-slate-200 rounded-xl py-2 mb-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-bold text-slate-500", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-slate-500" }),
                  " Under (<0.8)"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-slate-300", children: "|" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-bold text-emerald-500", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500" }),
                  " Safe (0.8-1.3)"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-slate-300", children: "|" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-bold text-amber-500", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-amber-500" }),
                  " Caution (1.3-1.5)"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-slate-300", children: "|" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-bold text-rose-500", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-rose-500" }),
                  " Danger (>1.5)"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "h-[400px] w-full", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(ComposedChart, { data: weeklyChartData, margin: { top: 20, right: 20, bottom: 20, left: 20 }, children: [
                /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "blueGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                  /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#818cf8", stopOpacity: 0.9 }),
                  /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#c7d2fe", stopOpacity: 0.4 })
                ] }) }),
                /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f1f5f9", vertical: false }),
                /* @__PURE__ */ jsx(XAxis, { dataKey: "name", tick: { fontSize: 10, fill: "#64748b", fontWeight: 600 }, axisLine: false, tickLine: false, dy: 10 }),
                /* @__PURE__ */ jsx(YAxis, { yAxisId: "left", tick: { fontSize: 10, fill: "#818cf8", fontWeight: 600 }, axisLine: false, tickLine: false, tickFormatter: (v) => v >= 1e3 ? `${(v / 1e3).toFixed(1)}k` : v }),
                /* @__PURE__ */ jsx(YAxis, { yAxisId: "right", orientation: "right", tick: { fontSize: 10, fill: "#64748b", fontWeight: 600 }, axisLine: false, tickLine: false }),
                /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(CustomTooltip, {}), cursor: { fill: "#f8fafc" } }),
                /* @__PURE__ */ jsx(Bar, { yAxisId: "left", dataKey: "volume", fill: "url(#blueGradient)", barSize: 48, radius: [6, 6, 0, 0], children: /* @__PURE__ */ jsx(LabelList, { dataKey: "volume", position: "insideBottom", angle: -90, fill: "#4f46e5", fontSize: 10, fontWeight: 700, offset: 25, formatter: (v) => v > 0 ? v.toLocaleString("id-ID") : "" }) }),
                /* @__PURE__ */ jsx(Line, { yAxisId: "left", type: "monotone", dataKey: "strain", stroke: "#f43f5e", strokeWidth: 2.5, dot: { r: 4, fill: "#fff", stroke: "#f43f5e", strokeWidth: 2 }, activeDot: { r: 6, fill: "#f43f5e" }, children: /* @__PURE__ */ jsx(LabelList, { dataKey: "strain", position: "top", angle: -90, fill: "#f43f5e", fontSize: 9, fontWeight: 700, offset: 15, formatter: (v) => v > 0 ? v.toLocaleString("id-ID") : "" }) }),
                /* @__PURE__ */ jsx(Line, { yAxisId: "right", type: "monotone", dataKey: "acwr", stroke: "#475569", strokeWidth: 2.5, dot: { r: 4, fill: "#fff", stroke: "#475569", strokeWidth: 2 }, activeDot: { r: 6, fill: "#475569" } })
              ] }) }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: [...weeklyData].reverse().map((week, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600", children: /* @__PURE__ */ jsx(Calendar, { className: "w-5 h-5" }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs("h4", { className: "font-bold text-slate-800 text-sm md:text-base", children: [
                      "Week ",
                      weeklyData.length - idx
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs font-medium text-slate-400", children: [
                      "(",
                      week.label,
                      ")"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: `px-4 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${week.acwr > 1.5 ? "bg-rose-50 text-rose-600 border-rose-200" : week.acwr >= 0.8 && week.acwr <= 1.3 ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"}`, children: [
                  "ACWR ",
                  /* @__PURE__ */ jsx("span", { className: "text-sm", children: week.acwr > 0 ? week.acwr : "N/A" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
                /* @__PURE__ */ jsxs("h5", { className: "text-[10px] font-bold text-slate-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider", children: [
                  /* @__PURE__ */ jsx(Flame, { className: "w-3.5 h-3.5" }),
                  " DAILY LOAD (kg)"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-2 md:gap-3", children: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-100 rounded-xl p-2 md:p-3 text-center shadow-sm", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1 md:mb-2", children: day }),
                  /* @__PURE__ */ jsx("div", { className: "text-[10px] md:text-sm font-bold text-slate-800 break-words", children: week.daily_volumes?.[day] > 0 ? week.daily_volumes[day].toLocaleString("id-ID") : "-" })
                ] }, day)) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("h5", { className: "text-[10px] font-bold text-emerald-500 mb-3 flex items-center gap-1.5 uppercase tracking-wider", children: [
                  /* @__PURE__ */ jsx(TrendingUp, { className: "w-3.5 h-3.5" }),
                  " Metrics & Monitoring Summary"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border border-slate-100 rounded-xl p-3 shadow-sm", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1.5", children: "Weekly Load" }),
                    /* @__PURE__ */ jsx("div", { className: "text-lg md:text-xl font-bold text-slate-800", children: week.total_volume.toLocaleString("id-ID") })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border border-slate-100 rounded-xl p-3 shadow-sm", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1.5", children: "Mean Daily" }),
                    /* @__PURE__ */ jsx("div", { className: "text-lg md:text-xl font-bold text-slate-800", children: week.mean_load.toLocaleString("id-ID") })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border border-slate-100 rounded-xl p-3 shadow-sm", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1.5", children: "Std. Deviation" }),
                    /* @__PURE__ */ jsx("div", { className: "text-lg md:text-xl font-bold text-slate-800", children: week.std_dev.toLocaleString("id-ID") })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-100 rounded-xl p-3 shadow-sm", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-[9px] md:text-[10px] font-bold text-emerald-500 uppercase mb-1.5", children: "Monotony" }),
                    /* @__PURE__ */ jsx("div", { className: `text-lg md:text-xl font-bold ${week.monotony > 2 ? "text-rose-500" : "text-emerald-500"}`, children: week.monotony })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: `rounded-xl p-3 shadow-sm border ${week.strain > 2e4 ? "bg-rose-50 border-rose-100" : "bg-white border-slate-100"}`, children: [
                    /* @__PURE__ */ jsx("div", { className: `text-[9px] md:text-[10px] font-bold uppercase mb-1.5 ${week.strain > 2e4 ? "text-rose-500" : "text-rose-400"}`, children: "Strain" }),
                    /* @__PURE__ */ jsx("div", { className: `text-lg md:text-xl font-bold ${week.strain > 2e4 ? "text-rose-600" : "text-rose-500"}`, children: week.strain.toLocaleString("id-ID") })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-100 rounded-xl p-3 shadow-sm flex flex-col justify-between", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-[9px] md:text-[10px] font-bold text-rose-500 uppercase mb-1.5", children: "ACWR Ratio" }),
                    /* @__PURE__ */ jsx("div", { className: `text-lg md:text-xl font-bold ${week.acwr > 1.5 ? "text-rose-500" : week.acwr >= 0.8 && week.acwr <= 1.3 ? "text-emerald-500" : "text-slate-800"}`, children: week.acwr > 0 ? week.acwr : "N/A" })
                  ] })
                ] })
              ] })
            ] }, idx)) })
          ] }),
          activeChartTab === "exercise" && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-800 mb-4", children: "Top 10 Exercise (Volume Load)" }),
            /* @__PURE__ */ jsx("div", { className: "h-[350px] md:h-[400px]", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: exerciseChartData, layout: "vertical", margin: { left: 10 }, children: [
              /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f1f5f9", horizontal: false }),
              /* @__PURE__ */ jsx(XAxis, { type: "number", tick: { fontSize: 10, fill: "#94a3b8" }, tickFormatter: formatVolume }),
              /* @__PURE__ */ jsx(YAxis, { type: "category", dataKey: "name", tick: { fontSize: 10, fill: "#64748b", fontWeight: 600 }, width: 130 }),
              /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(ExerciseTooltip, {}) }),
              /* @__PURE__ */ jsx(Bar, { dataKey: "volume", name: "Volume Load", radius: [0, 6, 6, 0], maxBarSize: 28, children: exerciseChartData.map((_, idx) => /* @__PURE__ */ jsx(Cell, { fill: barColors[idx] || "orange-500" }, idx)) })
            ] }) }) })
          ] })
        ] })
      ] }),
      exerciseStats.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 border-b border-slate-100 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Award, { className: "w-4 h-4 text-orange-500" }),
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-800", children: "Statistik per Exercise" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-slate-50 border-b border-slate-200", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500", children: "#" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500", children: "Nama Exercise" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500", children: "Kategori" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 text-right", children: "Total Volume" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 text-center", children: "Beban Maks" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 text-center", children: "Total Set" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 text-center", children: "Total Rep" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 text-center", children: "Sesi" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: exerciseStats.map((ex, i) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50/50 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-xs font-bold text-slate-400", children: i + 1 }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-800", children: ex.name }) }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200", children: ex.category }) }),
            /* @__PURE__ */ jsxs("td", { className: "px-5 py-3 text-right", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-orange-500", children: ex.total_volume.toLocaleString("id-ID") }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 ml-1", children: "kg" })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-center", children: /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-slate-700", children: [
              ex.max_load,
              " kg"
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-center text-xs font-bold text-slate-600", children: ex.total_sets }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-center text-xs font-bold text-slate-600", children: ex.total_reps }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-center", children: /* @__PURE__ */ jsx("span", { className: "inline-flex min-w-[1.5rem] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100", children: ex.session_count }) })
          ] }, i)) })
        ] }) })
      ] }),
      sessions.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 border-b border-slate-100 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-orange-500" }),
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-800", children: "Detail Volume per Sesi" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-slate-50 border-b border-slate-200", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 w-10" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500", children: "Tanggal" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500", children: "Nama Sesi" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500", children: "Tipe" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 text-center", children: "Exercise" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 text-right", children: "Volume Load" }),
            /* @__PURE__ */ jsx("th", { className: "px-5 py-3 text-xs font-bold text-slate-500 text-center", children: "Max Beban" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: [...sessions].reverse().map((session) => {
            const key = `${session.type}-${session.id}`;
            const isExpanded = expandedSessions.has(key);
            return /* @__PURE__ */ jsxs(React.Fragment, { children: [
              /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50/50 transition-colors group cursor-pointer", onClick: () => toggleSession(key), children: [
                /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx("button", { className: "p-1 text-slate-400 hover:text-slate-800 rounded", children: isExpanded ? /* @__PURE__ */ jsx(ChevronDown, { size: 16 }) : /* @__PURE__ */ jsx(ChevronRight, { size: 16 }) }) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-700", children: formatDate(session.date) }) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-800", children: session.name }) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-md border ${session.type === "group" ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-orange-50 text-orange-600 border-orange-100"}`, children: session.type === "group" ? "Grup" : "Individu" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-center", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-600", children: session.exercise_count }) }),
                /* @__PURE__ */ jsxs("td", { className: "px-5 py-3 text-right", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-orange-500", children: session.total_volume.toLocaleString("id-ID") }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 ml-1", children: "kg" })
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-center", children: /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-slate-600", children: [
                  session.max_load,
                  " kg"
                ] }) })
              ] }),
              isExpanded && /* @__PURE__ */ jsx("tr", { className: "bg-slate-50/50", children: /* @__PURE__ */ jsx("td", { colSpan: "7", className: "px-8 py-3 border-b border-slate-100", children: /* @__PURE__ */ jsx("div", { className: "bg-white border border-slate-200 rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left", children: [
                /* @__PURE__ */ jsx("thead", { className: "bg-slate-50", children: /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-[10px] font-bold text-slate-500", children: "Exercise" }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-[10px] font-bold text-slate-500", children: "Kategori" }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-[10px] font-bold text-slate-500 text-center", children: "Set" }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-[10px] font-bold text-slate-500 text-center", children: "Rep" }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-[10px] font-bold text-slate-500 text-center", children: "Max Beban" }),
                  /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-[10px] font-bold text-slate-500 text-right", children: "Volume" })
                ] }) }),
                /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: session.exercises.map((ex, idx) => /* @__PURE__ */ jsxs("tr", { className: "text-xs hover:bg-slate-50 transition-colors", children: [
                  /* @__PURE__ */ jsx("td", { className: "px-4 py-2 font-bold text-slate-800", children: ex.name }),
                  /* @__PURE__ */ jsx("td", { className: "px-4 py-2 text-slate-500", children: ex.category }),
                  /* @__PURE__ */ jsx("td", { className: "px-4 py-2 text-center text-slate-600 font-bold", children: ex.sets }),
                  /* @__PURE__ */ jsx("td", { className: "px-4 py-2 text-center text-slate-600 font-bold", children: ex.reps }),
                  /* @__PURE__ */ jsxs("td", { className: "px-4 py-2 text-center text-slate-600 font-bold", children: [
                    ex.max_load,
                    " kg"
                  ] }),
                  /* @__PURE__ */ jsxs("td", { className: "px-4 py-2 text-right font-bold text-orange-500", children: [
                    ex.volume.toLocaleString("id-ID"),
                    " kg"
                  ] })
                ] }, idx)) })
              ] }) }) }) })
            ] }, key);
          }) })
        ] }) })
      ] }),
      sessions.length === 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "p-4 bg-white border border-slate-200 rounded-full mb-4 shadow-sm", children: /* @__PURE__ */ jsx(Dumbbell, { className: "w-10 h-10 text-orange-500" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-800", children: "Belum ada data beban latihan" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mt-2 font-medium max-w-md", children: "Data volume load akan muncul otomatis setelah atlet ini memiliki sesi latihan dengan data exercise (sets, reps, load)." })
      ] })
    ] })
  ] });
}
export {
  Show as default
};
