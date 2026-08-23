import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Activity, TrendingUp, Trophy, Clock, Target, Zap, AlertCircle, FileText, Calendar, TrendingDown, Minus } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip, BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts";
import { Link } from "@inertiajs/react";
function PhysicalTests({ has_data, stats, formatScore, formatNumber, radar_data, comparison_data, item_analysis, strengths, weaknesses, history_data, safeAthlete }) {
  const GrowthIndicator = ({ value }) => {
    if (value === void 0 || value === null) return /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "-" });
    if (value > 0) return /* @__PURE__ */ jsxs("span", { className: "flex items-center text-emerald-600 text-[10px] font-bold", children: [
      /* @__PURE__ */ jsx(TrendingUp, { className: "w-3 h-3 mr-1" }),
      " +",
      value,
      "%"
    ] });
    if (value < 0) return /* @__PURE__ */ jsxs("span", { className: "flex items-center text-rose-500 text-[10px] font-bold", children: [
      /* @__PURE__ */ jsx(TrendingDown, { className: "w-3 h-3 mr-1" }),
      " ",
      value,
      "%"
    ] });
    return /* @__PURE__ */ jsxs("span", { className: "flex items-center text-slate-400 text-[10px] font-bold", children: [
      /* @__PURE__ */ jsx(Minus, { className: "w-3 h-3 mr-1" }),
      " 0%"
    ] });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 md:p-5 rounded-lg border border-slate-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all group", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-[9px] md:text-[10px] text-slate-400 font-bold mb-2 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Activity, { className: "w-3.5 h-3.5 text-slate-300 group-hover:text-orange-500 transition-colors" }),
          " Total Sessions"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl md:text-3xl font-bold text-slate-800", children: stats?.total_sessions || 0 })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 md:p-5 rounded-lg border border-slate-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all group", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-[9px] md:text-[10px] text-slate-400 font-bold mb-2 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(TrendingUp, { className: "w-3.5 h-3.5 text-slate-300 group-hover:text-orange-500 transition-colors" }),
          " Avg Score"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl md:text-3xl font-bold text-orange-500", children: formatScore(stats?.average_score) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 md:p-5 rounded-lg border border-slate-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all group", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-[9px] md:text-[10px] text-slate-400 font-bold mb-2 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Trophy, { className: "w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 transition-colors" }),
          " Best Score"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl md:text-3xl font-bold text-emerald-500", children: formatScore(stats?.highest_score) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 md:p-5 rounded-lg border border-slate-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all group", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-[9px] md:text-[10px] text-slate-400 font-bold mb-2 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5 text-slate-300 group-hover:text-orange-500 transition-colors" }),
          " Last Activity"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm font-bold text-slate-700 leading-tight mt-2", children: stats?.latest_date || "-" })
      ] })
    ] }),
    has_data ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 h-full mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 md:p-6 rounded-lg border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold text-slate-800 mb-6 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "p-1.5 bg-orange-50 rounded-md text-orange-500", children: /* @__PURE__ */ jsx(Target, { className: "w-4 h-4" }) }),
          "Skill Map (Average)"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-[250px] md:min-h-[300px]", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(RadarChart, { cx: "50%", cy: "50%", outerRadius: "70%", data: radar_data, children: [
          /* @__PURE__ */ jsx(PolarGrid, { stroke: "#f1f5f9", strokeDasharray: "3 3" }),
          /* @__PURE__ */ jsx(PolarAngleAxis, { dataKey: "subject", tick: { fill: "#64748b", fontSize: 10, fontWeight: "600" } }),
          /* @__PURE__ */ jsx(PolarRadiusAxis, { angle: 30, domain: [0, 100], tick: false, axisLine: false }),
          /* @__PURE__ */ jsx(Radar, { name: "Target", dataKey: "B", stroke: "#fbbf24", strokeWidth: 2, fill: "#fbbf24", fillOpacity: 0.1 }),
          /* @__PURE__ */ jsx(Radar, { name: "Athlete", dataKey: "A", stroke: "orange-500", strokeWidth: 2, fill: "orange-500", fillOpacity: 0.5 }),
          /* @__PURE__ */ jsx(Legend, { iconType: "circle", wrapperStyle: { fontSize: "11px", paddingTop: "10px" } }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: { borderRadius: "8px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" } })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 md:p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold text-slate-700 mb-6 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "p-1.5 bg-rose-50 rounded-md text-rose-500", children: /* @__PURE__ */ jsx(Activity, { className: "w-4 h-4" }) }),
          "Comparison: Latest vs Previous"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-[250px] md:min-h-[300px]", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: comparison_data, margin: { top: 20, right: 0, left: -20, bottom: 0 }, barGap: 4, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "name", tick: { fontSize: 10, fill: "#64748b", fontWeight: 600 }, axisLine: false, tickLine: false }),
          /* @__PURE__ */ jsx(YAxis, { domain: [0, 100], tick: { fontSize: 10, fill: "#94a3b8" }, axisLine: false, tickLine: false }),
          /* @__PURE__ */ jsx(Tooltip, { cursor: { fill: "#f8fafc" }, contentStyle: { borderRadius: "8px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", fontSize: "12px" } }),
          /* @__PURE__ */ jsx(Legend, { wrapperStyle: { fontSize: "11px", paddingTop: "10px" }, iconType: "circle" }),
          /* @__PURE__ */ jsx(Bar, { name: "Previous", dataKey: "previous", fill: "#cbd5e1", radius: [4, 4, 0, 0], barSize: 16 }),
          /* @__PURE__ */ jsx(Bar, { name: "Latest", dataKey: "latest", fill: "orange-500", radius: [4, 4, 0, 0], barSize: 16 })
        ] }) }) })
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center h-64 text-slate-400 gap-2 mb-8", children: [
      /* @__PURE__ */ jsx(Activity, { className: "w-8 h-8 opacity-20" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold", children: "No training data available" })
    ] }),
    has_data && item_analysis && /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "px-5 py-4 bg-slate-50/80 border-b border-slate-100 backdrop-blur-sm", children: /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-slate-700", children: "Latest Test Breakdown" }) }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto w-full custom-scrollbar", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm text-left", children: [
        /* @__PURE__ */ jsx("thead", { className: "text-[10px] text-slate-400 bg-slate-50 border-b border-slate-100", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-4 md:px-6 py-3 md:py-4 font-bold", children: "Test Item" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 md:px-6 py-3 md:py-4 text-center font-bold", children: "Result" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 md:px-6 py-3 md:py-4 text-center font-bold hidden md:table-cell", children: "Benchmark" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 md:px-6 py-3 md:py-4 text-center font-bold hidden lg:table-cell", children: "Prev (%)" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 md:px-6 py-3 md:py-4 text-center font-bold", children: "Score (%)" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 md:px-6 py-3 md:py-4 text-center font-bold hidden sm:table-cell", children: "Trend" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: item_analysis.map((item, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-orange-50/30 transition-colors group", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-4 md:px-6 py-3 md:py-4", children: [
            /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-800 text-xs md:text-sm group-hover:text-orange-500 transition-colors", children: item.name }),
            /* @__PURE__ */ jsx("div", { className: "text-[9px] md:text-[10px] text-slate-400 font-bold mt-0.5", children: item.category })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 md:px-6 py-3 md:py-4 text-center font-bold text-slate-800 bg-slate-50/30 whitespace-nowrap", children: [
            formatNumber(item.result_value),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-[9px] md:text-[10px] font-normal text-slate-400", children: item.unit })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 md:px-6 py-3 md:py-4 text-center hidden md:table-cell", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded text-[10px] md:text-xs font-bold text-slate-500 border border-slate-200", children: [
            /* @__PURE__ */ jsx(Target, { className: "w-3 h-3 text-slate-400" }),
            formatNumber(item.target_value)
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 md:px-6 py-3 md:py-4 text-center text-slate-400 font-medium text-xs md:text-sm hidden lg:table-cell", children: item.previous_score > 0 ? formatScore(item.previous_score) + "%" : "-" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 md:px-6 py-3 md:py-4 text-center", children: /* @__PURE__ */ jsxs("span", { className: "inline-block font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded text-xs md:text-sm border border-orange-100 min-w-[50px] md:min-w-[60px]", children: [
            formatScore(item.score),
            "%"
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 md:px-6 py-3 md:py-4 text-center hidden sm:table-cell", children: /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "bg-white px-2 py-1 md:px-2.5 md:py-1.5 rounded-md border border-slate-100 shadow-sm", children: /* @__PURE__ */ jsx(GrowthIndicator, { value: item.growth }) }) }) })
        ] }, idx)) })
      ] }) })
    ] }),
    has_data && /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg border border-slate-200 shadow-sm mb-8 overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-5 md:p-8", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-slate-800 mb-5 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "p-1.5 bg-emerald-100 rounded-md text-emerald-600", children: /* @__PURE__ */ jsx(Zap, { className: "w-4 h-4" }) }),
          "Top Strengths (",
          ">",
          "70%)"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: strengths && strengths.length > 0 ? strengths.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between group p-3 rounded-lg hover:bg-emerald-50/50 transition-colors border border-transparent hover:border-emerald-100", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xl md:text-2xl font-bold text-slate-100 group-hover:text-emerald-200 transition-colors", children: [
              "0",
              idx + 1
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold text-sm md:text-base text-slate-700", children: item.name }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-bold", children: "Physical Category" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx("span", { className: "block text-lg md:text-xl font-bold text-emerald-600", children: formatScore(item.score) }) })
        ] }, idx)) : /* @__PURE__ */ jsx("p", { className: "text-slate-400 font-medium text-xs md:text-sm text-center py-4", children: "No categories above 70% yet." }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-5 md:p-8", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-slate-800 mb-5 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "p-1.5 bg-rose-100 rounded-md text-rose-600", children: /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4" }) }),
          "Areas for Improvement"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: weaknesses && weaknesses.length > 0 ? weaknesses.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between group p-3 rounded-lg hover:bg-rose-50/50 transition-colors border border-transparent hover:border-rose-100", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xl md:text-2xl font-bold text-slate-100 group-hover:text-rose-200 transition-colors", children: [
              "0",
              idx + 1
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold text-sm md:text-base text-slate-700", children: item.name }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-bold", children: "Physical Category" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx("span", { className: "block text-lg md:text-xl font-bold text-rose-500", children: formatScore(item.score) }) })
        ] }, idx)) : /* @__PURE__ */ jsx("p", { className: "text-slate-400 font-medium text-xs md:text-sm text-center py-4", children: "Great! All categories are above 70%." }) })
      ] })
    ] }) }),
    has_data && /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold text-slate-700 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(FileText, { className: "w-3.5 h-3.5 text-slate-400" }),
          " Session History"
        ] }),
        safeAthlete.name && /* @__PURE__ */ jsx(Link, { href: route("admin.performance.index", { search: safeAthlete.name }), className: "text-[10px] md:text-xs font-bold text-orange-500 hover:underline bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm hover:bg-orange-50 transition-colors", children: "View All Logs →" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto w-full custom-scrollbar", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm text-left", children: [
        /* @__PURE__ */ jsx("thead", { className: "text-[10px] text-slate-400 bg-slate-50/50 border-b border-slate-100", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-4 md:px-6 py-3 font-bold", children: "Date" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 md:px-6 py-3 text-center font-bold", children: "Score" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 md:px-6 py-3 text-center font-bold hidden sm:table-cell", children: "Rating" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 md:px-6 py-3 text-right font-bold", children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: history_data && history_data.length > 0 ? history_data.slice().reverse().slice(0, 5).map((session) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-orange-50/30 transition-colors", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-4 md:px-6 py-4 font-bold text-slate-700 flex items-center gap-1.5 md:gap-2 text-xs md:text-sm whitespace-nowrap", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5 text-slate-400" }),
            session.full_date
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 md:px-6 py-4 text-center", children: /* @__PURE__ */ jsx("span", { className: "font-bold text-orange-500 text-base md:text-lg", children: formatScore(session.score) }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 md:px-6 py-4 text-center hidden sm:table-cell", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-1 rounded text-[9px] md:text-[10px] font-bold border ${session.score >= 80 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : session.score >= 60 ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-rose-50 text-rose-600 border-rose-100"}`, children: session.score >= 80 ? "Excellent" : session.score >= 60 ? "Good" : "Poor" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 md:px-6 py-4 text-right", children: /* @__PURE__ */ jsx(Link, { href: route("admin.performance.show", session.id), className: "text-[10px] md:text-xs font-bold text-slate-500 hover:text-orange-500 transition-colors whitespace-nowrap", children: "Details →" }) })
        ] }, session.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "4", className: "px-4 md:px-6 py-12 text-center text-slate-400 font-medium text-xs md:text-sm", children: "No training history found." }) }) })
      ] }) })
    ] })
  ] });
}
export {
  PhysicalTests as default
};
