import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { CalendarDays, BarChart3, HeartPulse, Zap, Activity, TrendingUp, ListFilter, EyeOff, Eye } from "lucide-react";
import { useState, useMemo, Fragment as Fragment$1 } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend, Radar, AreaChart, CartesianGrid, XAxis, YAxis, Area, BarChart, Bar, ComposedChart, Line, LineChart } from "recharts";
function AnalyticsDashboard({ dailyHistory, formatDateToIndo }) {
  const todayStr = (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
  const [timeRange, setTimeRange] = useState("Mingguan");
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [expandedRow, setExpandedRow] = useState(null);
  const endDate = new Date(selectedDate);
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date(selectedDate);
  startDate.setHours(0, 0, 0, 0);
  if (timeRange === "Mingguan") startDate.setDate(startDate.getDate() - 6);
  else if (timeRange === "Bulanan") startDate.setDate(startDate.getDate() - 29);
  const filteredRawData = dailyHistory?.filter((item) => {
    const itemDate = new Date(item.record_date);
    itemDate.setHours(12, 0, 0, 0);
    return itemDate >= startDate && itemDate <= endDate && item.data && item.data.recovery_status !== "KOSONG";
  }).reverse() || [];
  const processedData = filteredRawData.map((item) => ({
    label: formatDateToIndo(item.record_date, "short"),
    full_date: item.record_date,
    rhr: parseFloat(item.data.rhr),
    spo2: parseFloat(item.data.spo2),
    vj: parseFloat(item.data.vj),
    weight: parseFloat(item.data.weight),
    vo2_max: parseFloat(item.data.vo2_max),
    peak_power: parseFloat(item.data.peak_power),
    recovery: parseFloat(item.data.quick_recovery_score),
    status: item.data.recovery_status
  }));
  const periodDays = processedData.length;
  const periodAvgRecovery = periodDays ? (processedData.reduce((acc, curr) => acc + curr.recovery, 0) / periodDays).toFixed(1) : 0;
  const periodMaxPeakPower = periodDays ? Math.round(Math.max(...processedData.map((d) => d.peak_power))).toLocaleString("id-ID") : 0;
  const periodAvgVo2Max = periodDays ? (processedData.reduce((acc, curr) => acc + curr.vo2_max, 0) / periodDays).toFixed(2) : 0;
  const periodAvgRhr = periodDays ? (processedData.reduce((acc, curr) => acc + curr.rhr, 0) / periodDays).toFixed(1) : 0;
  let periodStatus = "RECOVERY KURANG";
  if (periodAvgRecovery >= 75) periodStatus = "RECOVERY BAIK";
  else if (periodAvgRecovery >= 35) periodStatus = "RECOVERY CUKUP";
  const { avgPP, avgVO2, avgVJ, avgRec } = useMemo(() => {
    const allActive = dailyHistory?.filter((i) => i.data && i.data.recovery_status !== "KOSONG") || [];
    const len = allActive.length || 1;
    return {
      avgPP: allActive.reduce((s, i) => s + parseFloat(i.data.peak_power), 0) / len,
      avgVO2: allActive.reduce((s, i) => s + parseFloat(i.data.vo2_max), 0) / len,
      avgVJ: allActive.reduce((s, i) => s + parseFloat(i.data.vj), 0) / len,
      avgRec: allActive.reduce((s, i) => s + parseFloat(i.data.quick_recovery_score), 0) / len
    };
  }, [dailyHistory]);
  const toggleExpand = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };
  const customTooltipStyle = {
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    backgroundColor: "#ffffff",
    padding: "12px",
    fontSize: "13px",
    color: "#334155"
  };
  const renderDailyCharts = () => {
    if (periodDays === 0) return null;
    const current = processedData[0];
    const gaugeData = [
      { name: "Recovery", value: current.recovery },
      { name: "Sisa", value: 100 - current.recovery }
    ];
    const gaugeColor = current.recovery >= 75 ? "#10b981" : current.recovery >= 35 ? "#f59e0b" : "#ef4444";
    const radarData = [
      { metric: "Recovery %", today: current.recovery, avg: Math.round(avgRec), fullMark: 100 },
      { metric: "VO2Max", today: current.vo2_max, avg: Number(avgVO2.toFixed(1)), fullMark: 80 },
      { metric: "Vertical Jump", today: current.vj, avg: Number(avgVJ.toFixed(1)), fullMark: 100 },
      { metric: "SpO2 %", today: current.spo2, avg: 98, fullMark: 100 }
    ];
    return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "w-full text-center mb-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-slate-800 text-lg", children: "Recovery Score" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mt-1", children: "Kondisi fisik hari ini" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "h-56 w-full relative flex items-center justify-center", children: [
          /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsx(PieChart, { children: /* @__PURE__ */ jsxs(
            Pie,
            {
              data: gaugeData,
              cx: "50%",
              cy: "50%",
              startAngle: 90,
              endAngle: -270,
              innerRadius: "75%",
              outerRadius: "100%",
              dataKey: "value",
              stroke: "none",
              cornerRadius: 8,
              children: [
                /* @__PURE__ */ jsx(Cell, { fill: gaugeColor }),
                /* @__PURE__ */ jsx(Cell, { fill: "#f1f5f9" })
              ]
            }
          ) }) }),
          /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-4xl font-bold text-slate-800 tracking-tight", children: [
              current.recovery,
              /* @__PURE__ */ jsx("span", { className: "text-xl text-slate-400 ml-1", children: "%" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: `text-[10px] font-bold mt-1 px-3 py-1 rounded-full ${current.recovery >= 75 ? "bg-emerald-50 text-emerald-600" : current.recovery >= 35 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"}`, children: current.status.replace("RECOVERY ", "") })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-slate-800 text-lg", children: "Profil Kebugaran Harian" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-orange-500 bg-orange-50 px-3 py-1 rounded-full border border-orange-100", children: "Hari Ini vs Rata-rata" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-64 w-full", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(RadarChart, { cx: "50%", cy: "50%", outerRadius: "70%", data: radarData, children: [
          /* @__PURE__ */ jsx(PolarGrid, { stroke: "#e2e8f0", strokeDasharray: "3 3" }),
          /* @__PURE__ */ jsx(PolarAngleAxis, { dataKey: "metric", tick: { fill: "#475569", fontSize: 12, fontWeight: 500 } }),
          /* @__PURE__ */ jsx(PolarRadiusAxis, { angle: 30, domain: [0, "dataMax"], tick: false, axisLine: false }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: customTooltipStyle }),
          /* @__PURE__ */ jsx(Legend, { wrapperStyle: { fontSize: "12px", color: "#64748b", paddingTop: "15px" } }),
          /* @__PURE__ */ jsx(Radar, { name: "Hari Ini", dataKey: "today", stroke: "orange-500", strokeWidth: 2, fill: "orange-500", fillOpacity: 0.3 }),
          /* @__PURE__ */ jsx(Radar, { name: "Rata-rata", dataKey: "avg", stroke: "#94a3b8", strokeWidth: 2, fill: "#94a3b8", fillOpacity: 0.1, strokeDasharray: "4 4" })
        ] }) }) })
      ] })
    ] });
  };
  const renderWeeklyCharts = () => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-slate-800 mb-6 text-lg", children: "Trend Recovery (7 Hari)" }),
      /* @__PURE__ */ jsx("div", { className: "h-64", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: processedData, margin: { top: 10, right: 10, left: -20, bottom: 0 }, children: [
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "colorRec", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#10b981", stopOpacity: 0.4 }),
          /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#10b981", stopOpacity: 0 })
        ] }) }),
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "label", tick: { fontSize: 12, fill: "#64748b" }, axisLine: false, tickLine: false, dy: 10 }),
        /* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 12, fill: "#64748b" }, axisLine: false, tickLine: false, domain: [0, 100], dx: -10 }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: customTooltipStyle, cursor: { stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "3 3" } }),
        /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "recovery", name: "Recovery %", stroke: "#10b981", strokeWidth: 3, fill: "url(#colorRec)", activeDot: { r: 6, stroke: "#fff", strokeWidth: 2 } })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-slate-800 mb-6 text-lg", children: "Peak Power (Watt)" }),
      /* @__PURE__ */ jsx("div", { className: "h-64", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: processedData, margin: { top: 10, right: 10, left: -10, bottom: 0 }, children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "label", tick: { fontSize: 12, fill: "#64748b" }, axisLine: false, tickLine: false, dy: 10 }),
        /* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 12, fill: "#64748b" }, axisLine: false, tickLine: false, domain: ["dataMin - 100", "dataMax + 100"], dx: -10 }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: customTooltipStyle, cursor: { fill: "#f8fafc" } }),
        /* @__PURE__ */ jsx(Bar, { dataKey: "peak_power", name: "Peak Power", fill: "#f59e0b", radius: [4, 4, 0, 0], barSize: 32 })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-slate-800 mb-6 text-lg", children: "VO2Max vs Vertical Jump" }),
      /* @__PURE__ */ jsx("div", { className: "h-72", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(ComposedChart, { data: processedData, margin: { top: 10, right: 0, left: -20, bottom: 0 }, children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "label", tick: { fontSize: 12, fill: "#64748b" }, axisLine: false, tickLine: false, dy: 10 }),
        /* @__PURE__ */ jsx(YAxis, { yAxisId: "left", tick: { fontSize: 12, fill: "#0ea5e9" }, axisLine: false, tickLine: false, dx: -10 }),
        /* @__PURE__ */ jsx(YAxis, { yAxisId: "right", orientation: "right", tick: { fontSize: 12, fill: "#f43f5e" }, axisLine: false, tickLine: false, dx: 10 }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: customTooltipStyle }),
        /* @__PURE__ */ jsx(Legend, { wrapperStyle: { fontSize: "13px", color: "#475569", paddingTop: "20px" }, iconType: "circle" }),
        /* @__PURE__ */ jsx(Line, { yAxisId: "left", type: "monotone", dataKey: "vo2_max", name: "VO2Max", stroke: "#0ea5e9", strokeWidth: 3, dot: { r: 4, fill: "#fff", strokeWidth: 2 }, activeDot: { r: 6 } }),
        /* @__PURE__ */ jsx(Line, { yAxisId: "right", type: "monotone", dataKey: "vj", name: "Vertical Jump (cm)", stroke: "#f43f5e", strokeWidth: 3, dot: { r: 4, fill: "#fff", strokeWidth: 2 }, activeDot: { r: 6 } })
      ] }) }) })
    ] })
  ] });
  const renderMonthlyCharts = () => /* @__PURE__ */ jsxs("div", { className: "space-y-6 mb-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-slate-800 text-lg", children: "Macro Trend: Recovery vs Peak Power" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mt-1", children: "Periode 30 Hari Terakhir" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "h-80", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(ComposedChart, { data: processedData, margin: { top: 10, right: 0, left: -20, bottom: 0 }, children: [
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "colorRecMacro", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#10b981", stopOpacity: 0.2 }),
          /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#10b981", stopOpacity: 0 })
        ] }) }),
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "label", tick: { fontSize: 11, fill: "#94a3b8" }, axisLine: false, tickLine: false, dy: 10, interval: "preserveStartEnd", minTickGap: 20 }),
        /* @__PURE__ */ jsx(YAxis, { yAxisId: "left", tick: { fontSize: 12, fill: "#10b981" }, axisLine: false, tickLine: false, domain: [0, 100], dx: -10 }),
        /* @__PURE__ */ jsx(YAxis, { yAxisId: "right", orientation: "right", tick: { fontSize: 12, fill: "#f59e0b" }, axisLine: false, tickLine: false, domain: ["dataMin - 100", "dataMax + 100"], dx: 10 }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: customTooltipStyle, cursor: { fill: "#f8fafc" } }),
        /* @__PURE__ */ jsx(Legend, { wrapperStyle: { fontSize: "13px", color: "#475569", paddingTop: "20px" }, iconType: "circle" }),
        /* @__PURE__ */ jsx(Area, { yAxisId: "left", type: "monotone", dataKey: "recovery", name: "Recovery Score %", stroke: "#10b981", strokeWidth: 2, fill: "url(#colorRecMacro)", activeDot: { r: 5 } }),
        /* @__PURE__ */ jsx(Bar, { yAxisId: "right", dataKey: "peak_power", name: "Peak Power (W)", fill: "#f59e0b", radius: [4, 4, 0, 0], barSize: 12 })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx("h3", { className: "font-semibold text-slate-800 text-lg", children: "Cardiovascular Stress Trend (RHR & SpO2)" }) }),
      /* @__PURE__ */ jsx("div", { className: "h-64", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(LineChart, { data: processedData, margin: { top: 10, right: 0, left: -20, bottom: 0 }, children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "label", tick: { fontSize: 11, fill: "#94a3b8" }, axisLine: false, tickLine: false, dy: 10, interval: "preserveStartEnd", minTickGap: 20 }),
        /* @__PURE__ */ jsx(YAxis, { yAxisId: "left", tick: { fontSize: 12, fill: "#ef4444" }, axisLine: false, tickLine: false, domain: ["dataMin - 5", "dataMax + 5"], dx: -10 }),
        /* @__PURE__ */ jsx(YAxis, { yAxisId: "right", orientation: "right", tick: { fontSize: 12, fill: "#3b82f6" }, axisLine: false, tickLine: false, domain: [90, 100], dx: 10 }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: customTooltipStyle, cursor: { stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "3 3" } }),
        /* @__PURE__ */ jsx(Legend, { wrapperStyle: { fontSize: "13px", color: "#475569", paddingTop: "20px" }, iconType: "circle" }),
        /* @__PURE__ */ jsx(Line, { yAxisId: "left", type: "monotone", dataKey: "rhr", name: "Resting HR (bpm)", stroke: "#ef4444", strokeWidth: 2, dot: { r: 3, fill: "#fff", strokeWidth: 2 }, activeDot: { r: 5 } }),
        /* @__PURE__ */ jsx(Line, { yAxisId: "right", type: "monotone", dataKey: "spo2", name: "SpO2 (%)", stroke: "#3b82f6", strokeWidth: 2, dot: { r: 3, fill: "#fff", strokeWidth: 2 }, activeDot: { r: 5 } })
      ] }) }) })
    ] })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-slate-800", children: "Analytics Dashboard" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-sm mt-1", children: "Pantau performa dan pemulihan harian" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-slate-100 p-1 rounded-xl inline-flex w-full sm:w-auto border border-slate-200", children: ["Harian", "Mingguan", "Bulanan"].map((range) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setTimeRange(range),
            className: `flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${timeRange === range ? "bg-white text-orange-500 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`,
            children: range
          },
          range
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "relative w-full sm:w-auto", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(CalendarDays, { className: "h-4 w-4 text-slate-400" }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              value: selectedDate,
              onChange: (e) => setSelectedDate(e.target.value),
              className: "pl-10 pr-4 py-2 w-full text-sm font-medium text-slate-700 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all bg-white cursor-pointer shadow-sm"
            }
          )
        ] })
      ] })
    ] }),
    periodDays === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white p-12 rounded-2xl text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]", children: [
      /* @__PURE__ */ jsx(BarChart3, { className: "w-16 h-16 text-slate-300 mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-slate-700", children: "Tidak Ada Data" }),
      /* @__PURE__ */ jsxs("p", { className: "text-slate-500 mt-2 max-w-md", children: [
        "Belum ada metrik yang tercatat untuk periode ",
        formatDateToIndo(startDate, "short"),
        " - ",
        formatDateToIndo(endDate, "short"),
        "."
      ] })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3 transition-all hover:shadow-md", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-rose-50 rounded-xl text-rose-500 shrink-0", children: /* @__PURE__ */ jsx(HeartPulse, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm font-medium text-slate-500 truncate", children: "Avg Recovery" }),
            /* @__PURE__ */ jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxs("span", { className: "text-xl md:text-2xl font-bold text-slate-800", children: [
              periodAvgRecovery,
              "%"
            ] }) }),
            /* @__PURE__ */ jsx("span", { className: `text-[9px] md:text-[10px] font-semibold mt-1 inline-block truncate ${periodAvgRecovery >= 75 ? "text-emerald-500" : periodAvgRecovery >= 35 ? "text-amber-500" : "text-rose-500"}`, children: periodStatus })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3 transition-all hover:shadow-md", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-amber-50 rounded-xl text-amber-500 shrink-0", children: /* @__PURE__ */ jsx(Zap, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex flex-col justify-between h-full", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm font-medium text-slate-500 truncate", children: "Max Peak Power" }),
            /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-baseline gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xl md:text-2xl font-bold text-slate-800 truncate", children: periodMaxPeakPower }),
              /* @__PURE__ */ jsx("span", { className: "text-xs md:text-sm font-medium text-slate-500", children: "W" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3 transition-all hover:shadow-md", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-blue-50 rounded-xl text-blue-500 shrink-0", children: /* @__PURE__ */ jsx(Activity, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex flex-col justify-between h-full", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm font-medium text-slate-500 truncate", children: "Avg VO2Max" }),
            /* @__PURE__ */ jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsx("span", { className: "text-xl md:text-2xl font-bold text-slate-800 truncate", children: periodAvgVo2Max }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3 transition-all hover:shadow-md", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-emerald-50 rounded-xl text-emerald-500 shrink-0", children: /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex flex-col justify-between h-full", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm font-medium text-slate-500 truncate", children: "Avg RHR" }),
            /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-baseline gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xl md:text-2xl font-bold text-slate-800 truncate", children: periodAvgRhr }),
              /* @__PURE__ */ jsx("span", { className: "text-xs md:text-sm font-medium text-slate-500", children: "bpm" })
            ] })
          ] })
        ] })
      ] }),
      timeRange === "Harian" && renderDailyCharts(),
      timeRange === "Mingguan" && renderWeeklyCharts(),
      timeRange === "Bulanan" && renderMonthlyCharts(),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-slate-50 rounded-lg text-slate-500", children: /* @__PURE__ */ jsx(ListFilter, { className: "w-4 h-4 md:w-5 md:h-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-slate-800 text-base md:text-lg", children: "Detail Breakdown" }),
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] md:text-xs text-slate-500 mt-0.5", children: [
              "Ringkasan data tabular periode ",
              timeRange
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto w-full", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm whitespace-nowrap", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-slate-50/50 text-slate-500 border-b border-slate-200", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 md:px-6 py-3 font-medium text-xs md:text-sm", children: "Tanggal" }),
            /* @__PURE__ */ jsx("th", { className: "hidden md:table-cell px-3 py-3 font-medium text-center text-xs md:text-sm", children: "RHR" }),
            /* @__PURE__ */ jsx("th", { className: "hidden md:table-cell px-3 py-3 font-medium text-center text-xs md:text-sm", children: "SpO2" }),
            /* @__PURE__ */ jsx("th", { className: "hidden md:table-cell px-3 py-3 font-medium text-center text-xs md:text-sm", children: "BB (kg)" }),
            /* @__PURE__ */ jsx("th", { className: "hidden md:table-cell px-3 py-3 font-medium text-center text-xs md:text-sm", children: "VJ (cm)" }),
            /* @__PURE__ */ jsx("th", { className: "hidden md:table-cell px-3 py-3 font-medium text-center text-xs md:text-sm", children: "VO2Max" }),
            /* @__PURE__ */ jsx("th", { className: "hidden md:table-cell px-3 py-3 font-medium text-center text-xs md:text-sm", children: "Peak Power" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 md:px-6 py-3 font-medium text-center text-xs md:text-sm", children: "Status" }),
            /* @__PURE__ */ jsx("th", { className: "md:hidden px-4 py-3 font-medium text-right text-xs", children: "Detail" })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-slate-100", children: [
            processedData.map((item, index) => {
              const isExpanded = expandedRow === index;
              return /* @__PURE__ */ jsxs(Fragment$1, { children: [
                /* @__PURE__ */ jsxs("tr", { className: `hover:bg-slate-50/80 transition-colors ${isExpanded ? "bg-slate-50" : ""}`, children: [
                  /* @__PURE__ */ jsx("td", { className: "px-4 md:px-6 py-3.5 font-medium text-slate-700 text-xs md:text-sm", children: formatDateToIndo(item.full_date, "short") }),
                  /* @__PURE__ */ jsx("td", { className: "hidden md:table-cell px-3 py-3.5 text-center text-slate-600", children: item.rhr }),
                  /* @__PURE__ */ jsxs("td", { className: "hidden md:table-cell px-3 py-3.5 text-center text-slate-600", children: [
                    item.spo2,
                    "%"
                  ] }),
                  /* @__PURE__ */ jsx("td", { className: "hidden md:table-cell px-3 py-3.5 text-center text-slate-600", children: item.weight }),
                  /* @__PURE__ */ jsx("td", { className: "hidden md:table-cell px-3 py-3.5 text-center text-slate-600", children: item.vj }),
                  /* @__PURE__ */ jsx("td", { className: "hidden md:table-cell px-3 py-3.5 text-center text-slate-600", children: Number(item.vo2_max).toLocaleString("id-ID", { minimumFractionDigits: 2 }) }),
                  /* @__PURE__ */ jsxs("td", { className: "hidden md:table-cell px-3 py-3.5 text-center text-slate-600", children: [
                    Number(item.peak_power).toLocaleString("id-ID"),
                    " W"
                  ] }),
                  /* @__PURE__ */ jsx("td", { className: "px-4 md:px-6 py-3.5 text-center", children: /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-medium border ${item.status === "RECOVERY BAIK" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : item.status === "RECOVERY CUKUP" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-rose-50 text-rose-700 border-rose-200"}`, children: [
                    /* @__PURE__ */ jsx("span", { className: `w-1.5 h-1.5 rounded-full ${item.status === "RECOVERY BAIK" ? "bg-emerald-500" : item.status === "RECOVERY CUKUP" ? "bg-amber-500" : "bg-rose-500"}` }),
                    item.recovery,
                    "% ",
                    /* @__PURE__ */ jsxs("span", { className: "hidden sm:inline", children: [
                      "- ",
                      item.status.replace("RECOVERY ", "")
                    ] })
                  ] }) }) }),
                  /* @__PURE__ */ jsx("td", { className: "md:hidden px-4 py-3.5 text-right", children: /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => toggleExpand(index),
                      className: `p-1.5 rounded-lg border transition-colors flex items-center justify-center ml-auto ${isExpanded ? "bg-orange-500 text-white border-orange-500" : "text-orange-500 border-orange-200 hover:bg-orange-50"}`,
                      children: isExpanded ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
                    }
                  ) })
                ] }),
                isExpanded && /* @__PURE__ */ jsx("tr", { className: "md:hidden bg-slate-50 border-b border-slate-100", children: /* @__PURE__ */ jsx("td", { colSpan: 3, className: "px-4 py-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "bg-white p-2 rounded-md border border-slate-200/60 shadow-sm text-center", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 block mb-0.5", children: "RHR" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700 text-sm", children: item.rhr })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-white p-2 rounded-md border border-slate-200/60 shadow-sm text-center", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 block mb-0.5", children: "SpO2" }),
                    /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-700 text-sm", children: [
                      item.spo2,
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-white p-2 rounded-md border border-slate-200/60 shadow-sm text-center", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 block mb-0.5", children: "BB (kg)" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700 text-sm", children: item.weight })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-white p-2 rounded-md border border-slate-200/60 shadow-sm text-center", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 block mb-0.5", children: "VJ (cm)" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700 text-sm", children: item.vj })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-white p-2 rounded-md border border-slate-200/60 shadow-sm text-center", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 block mb-0.5", children: "VO2Max" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700 text-sm", children: Number(item.vo2_max).toLocaleString("id-ID", { minimumFractionDigits: 1 }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-white p-2 rounded-md border border-slate-200/60 shadow-sm text-center", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 block mb-0.5", children: "Peak W." }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700 text-sm", children: Number(item.peak_power).toLocaleString("id-ID") })
                  ] })
                ] }) }) })
              ] }, index);
            }),
            periodDays > 1 && /* @__PURE__ */ jsxs("tr", { className: "bg-slate-50 border-t-2 border-slate-200", children: [
              /* @__PURE__ */ jsx("td", { className: "px-4 md:px-6 py-4 font-bold text-slate-700 text-[10px] md:text-xs", children: "Rata-rata / Max" }),
              /* @__PURE__ */ jsx("td", { className: "hidden md:table-cell px-3 py-4 text-center font-bold text-slate-700", children: periodAvgRhr }),
              /* @__PURE__ */ jsx("td", { className: "hidden md:table-cell", colSpan: "3" }),
              /* @__PURE__ */ jsx("td", { className: "hidden md:table-cell px-3 py-4 text-center font-bold text-slate-700", children: periodAvgVo2Max }),
              /* @__PURE__ */ jsxs("td", { className: "hidden md:table-cell px-3 py-4 text-center font-bold text-slate-700", children: [
                periodMaxPeakPower,
                " W"
              ] }),
              /* @__PURE__ */ jsxs("td", { className: "px-4 md:px-6 py-4 text-center font-bold text-slate-700 text-xs md:text-sm", children: [
                periodAvgRecovery,
                "%"
              ] }),
              /* @__PURE__ */ jsx("td", { className: "md:hidden" })
            ] })
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  AnalyticsDashboard as default
};
