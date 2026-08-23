import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import { LineChart, Calendar, TrendingUp, Eye, Plus, Activity } from "lucide-react";
import "axios";
function AthleteAnalysis({
  auth,
  athlete,
  weeklyData
}) {
  const [viewingEntry, setViewingEntry] = useState(null);
  const getAcwrBadgeClass = (acwr) => {
    if (!acwr || acwr === 0) return "text-slate-400 bg-transparent";
    if (acwr < 0.8) return "text-orange-500 font-bold";
    if (acwr >= 0.8 && acwr <= 1.3) return "text-emerald-500 font-bold";
    if (acwr > 1.3 && acwr <= 1.5) return "text-yellow-500 font-bold";
    return "text-red-600 font-bold";
  };
  const getDailyLoadBadgeClass = (val) => {
    if (!val || val === 0) return "text-slate-900 bg-slate-100 border-slate-200";
    if (val < 1500) return "text-emerald-700 bg-emerald-100 border-emerald-200";
    if (val <= 3e3) return "text-amber-700 bg-amber-100 border-amber-200";
    return "text-red-700 bg-red-100 border-red-200";
  };
  const getDailyWellnessColor = (score) => {
    if (!score && score !== 0) return { text: "text-slate-500", bg: "bg-slate-100", border: "border-slate-300", label: "N/A" };
    if (score <= 9) return { text: "text-teal-700", bg: "bg-teal-100", border: "border-teal-200", label: "Sangat Baik" };
    if (score <= 13) return { text: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-200", label: "Baik" };
    if (score <= 17) return { text: "text-sky-700", bg: "bg-sky-100", border: "border-sky-200", label: "Agak Baik" };
    if (score <= 20) return { text: "text-yellow-700", bg: "bg-yellow-100", border: "border-yellow-200", label: "Sedang" };
    if (score <= 23) return { text: "text-amber-700", bg: "bg-amber-100", border: "border-amber-200", label: "Agak Buruk" };
    if (score <= 27) return { text: "text-orange-700", bg: "bg-orange-100", border: "border-orange-200", label: "Buruk" };
    return { text: "text-red-700", bg: "bg-red-100", border: "border-red-200", label: "Sangat Buruk" };
  };
  return /* @__PURE__ */ jsxs(
    AppLayout,
    {
      user: auth.user,
      headerTitle: `Analisis ACWR: ${athlete.name}`,
      headerDescription: "Pantau data historis dan analisis beban latihan atlet.",
      children: [
        /* @__PURE__ */ jsx(Head, { title: `Analisis ${athlete.name}` }),
        /* @__PURE__ */ jsxs("div", { className: "pb-12 space-y-6", children: [
          /* @__PURE__ */ jsx(
            PageHeader,
            {
              title: `Analisis ACWR: ${athlete.name}`,
              subtitle: "Evaluasi data wellness mingguan, riwayat RPE harian, dan metrik monitoring.",
              badge: "Analytics",
              icon: LineChart
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b border-slate-200 mb-6 pb-4", children: [
            /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("admin.wellness-rpe.athlete.show", athlete.id),
                className: "px-5 py-2.5 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsx(Calendar, { size: 16 }),
                  "Kalender Harian"
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-orange-500 shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-default", children: [
              /* @__PURE__ */ jsx(TrendingUp, { size: 16 }),
              "Analisis ACWR"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-8 animate-in fade-in duration-300", children: weeklyData && weeklyData.length > 0 ? weeklyData.map((week, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col", children: [
            /* @__PURE__ */ jsx("div", { className: "px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-xs", children: [
                "W",
                week.week_number
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("h3", { className: "font-bold text-slate-900 text-sm", children: [
                  "Minggu Ke-",
                  week.week_number
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-slate-500 font-medium mt-0.5", children: [
                  week.start_date,
                  " s/d ",
                  week.end_date
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs whitespace-nowrap", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Hari" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-4 text-center", children: "Wellness" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-4 text-center", children: "AM Load" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-4 text-center", children: "PM Load" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-4 text-center", children: "Daily Load" }),
                /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Aksi" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-50", children: week.chartData.map((day, dayIdx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50/80 transition-colors", children: [
                /* @__PURE__ */ jsxs("td", { className: "px-6 py-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-900 text-xs", children: day.dayName }),
                  /* @__PURE__ */ jsx("div", { className: "text-[10px] text-slate-400 font-bold", children: day.dateLabel })
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: day.wellness > 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1", children: [
                  /* @__PURE__ */ jsx("span", { className: `font-bold px-2.5 py-0.5 rounded text-[11px] border ${getDailyWellnessColor(day.wellness).bg} ${getDailyWellnessColor(day.wellness).text} ${getDailyWellnessColor(day.wellness).border}`, children: day.wellness }),
                  /* @__PURE__ */ jsx("span", { className: `text-[9px] font-bold ${getDailyWellnessColor(day.wellness).text}`, children: getDailyWellnessColor(day.wellness).label })
                ] }) : /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "-" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: day.amLoad > 0 ? /* @__PURE__ */ jsxs("div", { className: "font-bold text-slate-700 text-xs", children: [
                  day.amLoad,
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 font-normal", children: "AU" })
                ] }) : /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "-" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: day.pmLoad > 0 ? /* @__PURE__ */ jsxs("div", { className: "font-bold text-slate-700 text-xs", children: [
                  day.pmLoad,
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 font-normal", children: "AU" })
                ] }) : /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "-" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: day.load > 0 ? /* @__PURE__ */ jsx("span", { className: `font-bold px-2.5 py-1 rounded text-xs border ${getDailyLoadBadgeClass(day.load)}`, children: day.load }) : /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "-" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-6 py-3 text-right", children: /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route("admin.wellness-rpe.athlete.date.show", { user: athlete.id, date: day.dateStr }),
                    className: "inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold px-2.5 py-1.5 rounded hover:bg-slate-50 transition-colors shadow-sm",
                    children: day.hasData ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Eye, { size: 12 }),
                      " Detail"
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Plus, { size: 12 }),
                      " Isi"
                    ] })
                  }
                ) })
              ] }, dayIdx)) })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-6 text-slate-900 border-t border-slate-200 relative overflow-hidden", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-32 h-32 bg-orange-500 opacity-5 rounded-bl-full pointer-events-none" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
                /* @__PURE__ */ jsx(Activity, { className: "w-5 h-5 text-orange-500" }),
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold tracking-tight text-slate-900", children: "Load Metrics & Monitoring" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-6 gap-y-6 gap-x-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "px-2 md:px-4 md:border-r border-slate-200 last:border-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider", children: "Weekly Load" }),
                  /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-slate-900", children: week.weekly_load })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "px-2 md:px-4 md:border-r border-slate-200 last:border-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider", children: "ACWR Ratio" }),
                  /* @__PURE__ */ jsx("p", { className: `text-2xl font-bold ${getAcwrBadgeClass(week.acwr)} inline-block`, children: week.acwr > 0 ? week.acwr : /* @__PURE__ */ jsx("span", { className: "text-slate-400 text-lg", children: "0.00" }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "px-2 md:px-4 md:border-r border-slate-200 last:border-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider", children: "Mean Daily Load" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xl font-bold mt-1 text-slate-700", children: week.mean_daily_load })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "px-2 md:px-4 md:border-r border-slate-200 last:border-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider", children: "Std Deviation" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xl font-bold mt-1 text-slate-700", children: week.standard_deviation })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "px-2 md:px-4 md:border-r border-slate-200 last:border-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider", children: "Monotony" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xl font-bold mt-1 text-orange-500", children: week.training_monotony })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "px-2 md:px-4 md:border-r border-slate-200 last:border-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider", children: "Strain" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xl font-bold mt-1 text-red-500", children: week.strain })
                ] })
              ] })
            ] })
          ] }, idx)) : /* @__PURE__ */ jsxs("div", { className: "text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm", children: [
            /* @__PURE__ */ jsx(Activity, { className: "mx-auto h-12 w-12 text-slate-300" }),
            /* @__PURE__ */ jsx("h3", { className: "mt-4 text-sm font-bold text-slate-900", children: "Belum ada riwayat" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-500 max-w-sm mx-auto", children: "Analisis beban mingguan akan muncul di sini setelah atlet memiliki setidaknya satu log latihan mingguan." })
          ] }) })
        ] })
      ]
    }
  );
}
export {
  AthleteAnalysis as default
};
