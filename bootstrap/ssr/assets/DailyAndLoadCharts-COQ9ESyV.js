import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { Battery, Activity, HeartPulse } from "lucide-react";
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, AreaChart, Area } from "recharts";
function DailyAndLoadCharts({ daily_metrics, training_loads }) {
  const customTooltipStyle = {
    borderRadius: "8px",
    border: "none",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
    fontSize: "12px"
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 md:p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold text-slate-800 mb-6 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "p-1.5 bg-orange-50 rounded-md text-orange-500", children: /* @__PURE__ */ jsx(Battery, { className: "w-4 h-4" }) }),
        "Training Load Trend (30 Days)"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-[300px]", children: training_loads && training_loads.length > 0 ? /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(ComposedChart, { data: training_loads, margin: { top: 10, right: 0, left: -20, bottom: 0 }, children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "date", tick: { fontSize: 10, fill: "#64748b", fontWeight: 600 }, axisLine: false, tickLine: false, dy: 10 }),
        /* @__PURE__ */ jsx(YAxis, { yAxisId: "left", tick: { fontSize: 10, fill: "#fb923c", fontWeight: 600 }, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsx(YAxis, { yAxisId: "right", orientation: "right", tick: { fontSize: 10, fill: "orange-500", fontWeight: 600 }, axisLine: false, tickLine: false, domain: [0, 40] }),
        /* @__PURE__ */ jsx(Tooltip, { cursor: { fill: "#f8fafc" }, contentStyle: customTooltipStyle }),
        /* @__PURE__ */ jsx(Legend, { wrapperStyle: { fontSize: "11px", paddingTop: "10px", fontWeight: "bold" }, iconType: "circle" }),
        /* @__PURE__ */ jsx(Bar, { yAxisId: "left", name: "Daily Load", dataKey: "daily_load", fill: "#fed7aa", radius: [4, 4, 0, 0], barSize: 20 }),
        /* @__PURE__ */ jsx(Line, { yAxisId: "right", type: "monotone", dataKey: "wellness", name: "Wellness (Max 40)", stroke: "orange-500", strokeWidth: 3, dot: { r: 4, fill: "#fff", strokeWidth: 2 }, activeDot: { r: 6, strokeWidth: 0, fill: "orange-500" } })
      ] }) }) : /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-slate-400 gap-2", children: [
        /* @__PURE__ */ jsx(Activity, { className: "w-8 h-8 opacity-20" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold", children: "No load data recorded yet" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 md:p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold text-slate-800 mb-6 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "p-1.5 bg-emerald-50 rounded-md text-emerald-500", children: /* @__PURE__ */ jsx(HeartPulse, { className: "w-4 h-4" }) }),
        "Physiological Recovery"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-[300px]", children: daily_metrics && daily_metrics.length > 0 ? /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: daily_metrics, margin: { top: 10, right: 10, left: -20, bottom: 0 }, children: [
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "colorRecSmall", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#10b981", stopOpacity: 0.4 }),
          /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#10b981", stopOpacity: 0 })
        ] }) }),
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "date", tick: { fontSize: 10, fill: "#64748b", fontWeight: 600 }, axisLine: false, tickLine: false, dy: 10 }),
        /* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 10, fill: "#94a3b8", fontWeight: 600 }, axisLine: false, tickLine: false, domain: [0, 100] }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: customTooltipStyle, cursor: { stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "3 3" } }),
        /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "recovery", name: "Recovery %", stroke: "#10b981", strokeWidth: 3, fill: "url(#colorRecSmall)", activeDot: { r: 6, strokeWidth: 0, fill: "#10b981" } })
      ] }) }) : /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center text-slate-400 gap-2", children: [
        /* @__PURE__ */ jsx(HeartPulse, { className: "w-8 h-8 opacity-20" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold", children: "No physiological data yet" })
      ] }) })
    ] })
  ] }) });
}
export {
  DailyAndLoadCharts as default
};
