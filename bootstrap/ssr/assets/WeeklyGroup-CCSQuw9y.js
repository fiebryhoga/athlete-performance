import { jsxs, jsx, Fragment as Fragment$1 } from "react/jsx-runtime";
import { Calendar, AlertTriangle, Eye, Activity, Edit3, Plus, TrendingUp, Target, FileText, X } from "lucide-react";
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Line } from "recharts";
import { useState, Fragment } from "react";
function WeeklyGroup({ week, formatDateToIndo, openModal, sessionTypes, physicalPrepTypes, skillTypes, matchTypes, travelTypes }) {
  const [detailNote, setDetailNote] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const toggleExpand = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };
  const customTooltipStyle = {
    borderRadius: "12px",
    border: "none",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
    fontSize: "12px",
    fontWeight: "bold"
  };
  const getAcwrColor = (acwr) => {
    if (!acwr || acwr === 0) return "text-orange-200";
    if (acwr < 0.8) return "text-amber-300";
    if (acwr >= 0.8 && acwr <= 1.3) return "text-emerald-300";
    if (acwr > 1.3 && acwr <= 1.5) return "text-yellow-300";
    return "text-rose-300";
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-4 md:px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 md:gap-3", children: [
        /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 md:w-5 md:h-5 text-orange-500" }),
        /* @__PURE__ */ jsxs("h3", { className: "font-bold text-slate-800 text-base md:text-lg", children: [
          "Periode: ",
          week.label
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 md:gap-3", children: [
        week.metrics.acwr > 1.5 && /* @__PURE__ */ jsxs("div", { className: "bg-rose-50 border border-rose-100 px-2 md:px-3 py-1 md:py-1.5 rounded-lg flex items-center gap-1.5 animate-pulse", children: [
          /* @__PURE__ */ jsx(AlertTriangle, { className: "w-3.5 h-3.5 text-rose-500" }),
          /* @__PURE__ */ jsx("span", { className: "text-[9px] md:text-[10px] font-bold text-rose-600", children: "Risiko Cedera" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border border-slate-200 px-3 md:px-4 py-1 md:py-1.5 rounded-lg flex items-center gap-1.5 md:gap-2 w-fit", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[9px] md:text-[10px] font-bold text-slate-500", children: "Weekly Wellness:" }),
          /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-600 text-sm md:text-lg", children: [
            week.metrics.weeklyWellnessScore,
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-[10px] md:text-xs font-bold text-slate-400", children: "/ 280" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 md:p-6 border-b border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center bg-white", children: [
      /* @__PURE__ */ jsxs("div", { className: "h-48 md:h-56 w-full", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-[10px] md:text-xs font-bold text-slate-500 mb-2 md:mb-4 text-center", children: "Load vs Wellness (Harian)" }),
        /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(ComposedChart, { data: week.days.map((d) => ({ day: d.dayName.substring(0, 3), load: d.load, wellness: d.wellness })), margin: { top: 0, right: 0, left: -20, bottom: 0 }, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "day", tick: { fontSize: 10, fill: "#94a3b8", fontWeight: "bold" }, axisLine: false, tickLine: false, dy: 5 }),
          /* @__PURE__ */ jsx(YAxis, { yAxisId: "left", tick: { fontSize: 10, fill: "#64748b", fontWeight: "bold" }, axisLine: false, tickLine: false, dx: -5 }),
          /* @__PURE__ */ jsx(YAxis, { yAxisId: "right", orientation: "right", tick: { fontSize: 10, fill: "#f43f5e", fontWeight: "bold" }, axisLine: false, tickLine: false, domain: [0, 40], dx: 5 }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: customTooltipStyle, cursor: { fill: "#f8fafc" } }),
          /* @__PURE__ */ jsx(Bar, { yAxisId: "left", dataKey: "load", name: "Daily Load (AU)", fill: "orange-500", radius: [4, 4, 0, 0], barSize: 24 }),
          /* @__PURE__ */ jsx(Line, { yAxisId: "right", type: "monotone", dataKey: "wellness", name: "Wellness Score", stroke: "#f43f5e", strokeWidth: 3, dot: { r: 4, strokeWidth: 2, fill: "#fff" }, activeDot: { r: 6 } })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 md:space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 md:p-4 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-orange-200 transition-colors", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[9px] md:text-[10px] font-bold text-slate-400", children: "Puncak Beban Latihan" }),
            /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-800 text-xs md:text-sm mt-0.5", children: "Hari dengan Load Tertinggi" })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "font-bold text-xl md:text-2xl text-orange-500 group-hover:scale-110 transition-transform", children: [
            Math.max(...week.days.map((d) => d.load)),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-xs md:text-sm font-bold text-slate-400", children: "AU" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 md:p-4 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-rose-200 transition-colors", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[9px] md:text-[10px] font-bold text-slate-400", children: "Kebugaran Minimum" }),
            /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-800 text-xs md:text-sm mt-0.5", children: "Hari dengan Wellness Terendah" })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "font-bold text-xl md:text-2xl text-rose-500 group-hover:scale-110 transition-transform", children: [
            week.days.filter((d) => d.wellness > 0).length > 0 ? Math.min(...week.days.filter((d) => d.wellness > 0).map((d) => d.wellness)) : 0,
            /* @__PURE__ */ jsx("span", { className: "text-[10px] md:text-sm font-bold text-rose-300", children: "/40" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto w-full", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm whitespace-nowrap", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-white border-b border-slate-100 text-slate-400 text-[9px] md:text-[10px] font-bold", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-4 md:px-6 py-3 md:py-4", children: "Hari" }),
        /* @__PURE__ */ jsx("th", { className: "hidden md:table-cell px-3 md:px-4 py-3 md:py-4 text-center", children: "Wellness" }),
        /* @__PURE__ */ jsx("th", { className: "hidden md:table-cell px-3 md:px-4 py-3 md:py-4", children: "Sesi Pagi (AM)" }),
        /* @__PURE__ */ jsx("th", { className: "hidden lg:table-cell px-3 md:px-4 py-3 md:py-4", children: "Sesi Sore (PM)" }),
        /* @__PURE__ */ jsx("th", { className: "hidden xl:table-cell px-3 md:px-4 py-3 md:py-4", children: "Catatan" }),
        /* @__PURE__ */ jsx("th", { className: "px-3 md:px-4 py-3 md:py-4 text-center text-orange-500", children: "Daily Load" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 md:px-6 py-3 md:py-4 text-right", children: "Aksi" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-50", children: week.days.map((day, dIndex) => {
        const isExpanded = expandedRow === dIndex;
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("tr", { className: `hover:bg-slate-50 transition-colors group ${isExpanded ? "bg-orange-50/20" : ""}`, children: [
            /* @__PURE__ */ jsxs("td", { className: "px-4 md:px-6 py-3", children: [
              /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-800 capitalize text-xs md:text-sm", children: day.dayName }),
              /* @__PURE__ */ jsx("div", { className: "text-[9px] md:text-[10px] text-slate-400 font-medium", children: formatDateToIndo(day.dateObj, "short") })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "hidden md:table-cell px-3 md:px-4 py-3 text-center", children: day.wellness ? /* @__PURE__ */ jsx("span", { className: "font-bold text-rose-500 bg-rose-50 px-2 md:px-3 py-1 rounded-lg text-xs", children: day.wellness }) : /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "-" }) }),
            /* @__PURE__ */ jsx("td", { className: "hidden md:table-cell px-3 md:px-4 py-3", children: day.data?.am_load ? /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "font-bold text-slate-700 text-xs md:text-sm", children: [
                day.data.am_load,
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-[9px] md:text-[10px] text-slate-400 font-normal", children: "AU" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-[9px] md:text-[10px] text-slate-500", children: day.data.am_session_type })
            ] }) : /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "-" }) }),
            /* @__PURE__ */ jsx("td", { className: "hidden lg:table-cell px-3 md:px-4 py-3", children: day.data?.pm_load ? /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "font-bold text-slate-700 text-xs md:text-sm", children: [
                day.data.pm_load,
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-[9px] md:text-[10px] text-slate-400 font-normal", children: "AU" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-[9px] md:text-[10px] text-slate-500", children: day.data.pm_session_type })
            ] }) : /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "-" }) }),
            /* @__PURE__ */ jsx("td", { className: "hidden xl:table-cell px-3 md:px-4 py-3", children: day.data?.notes ? /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setDetailNote(day),
                className: "flex items-center gap-1.5 max-w-[140px] text-left text-[11px] text-slate-600 italic bg-slate-50 hover:bg-orange-50 hover:text-orange-500 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-orange-200 transition-colors group/note",
                title: "Lihat Catatan Lengkap",
                children: [
                  /* @__PURE__ */ jsxs("span", { className: "truncate flex-1", children: [
                    '"',
                    day.data.notes,
                    '"'
                  ] }),
                  /* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5 shrink-0 opacity-50 group-hover/note:opacity-100" })
                ]
              }
            ) : /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "-" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-3 md:px-4 py-3 text-center", children: day.load ? /* @__PURE__ */ jsx("span", { className: "font-bold text-orange-500 bg-orange-50 px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm", children: day.load }) : /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "-" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 md:px-6 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1.5 md:gap-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => toggleExpand(dIndex),
                  className: `md:hidden p-1.5 rounded-lg border transition-colors flex items-center justify-center ${isExpanded ? "bg-orange-500 text-white border-orange-500" : "text-orange-500 border-orange-200 hover:bg-orange-50"}`,
                  children: /* @__PURE__ */ jsx(Activity, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsx("button", { onClick: () => openModal(day.dateStr), className: `inline-flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs font-bold px-2 md:px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${day.data ? "bg-white border border-slate-200 text-slate-500 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50 hover:shadow-sm" : "bg-orange-500 text-white hover:bg-orange-600 shadow-sm"}`, children: day.data ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
                /* @__PURE__ */ jsx(Edit3, { className: "w-3 h-3" }),
                " Edit"
              ] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3" }),
                " Isi Data"
              ] }) })
            ] }) })
          ] }),
          isExpanded && /* @__PURE__ */ jsx("tr", { className: "md:hidden bg-slate-50/80 border-b border-slate-100", children: /* @__PURE__ */ jsxs("td", { colSpan: 3, className: "px-4 py-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 mb-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 block mb-1", children: "Wellness Score" }),
                day.wellness ? /* @__PURE__ */ jsx("span", { className: "font-bold text-rose-500 text-sm", children: day.wellness }) : /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "-" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 block mb-1", children: "Total Load" }),
                day.load ? /* @__PURE__ */ jsxs("span", { className: "font-bold text-orange-500 text-sm", children: [
                  day.load,
                  " AU"
                ] }) : /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "-" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "bg-white p-3 rounded-xl border border-slate-200 shadow-sm mb-3", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 block mb-1 border-b border-slate-50 pb-1", children: "Sesi Pagi (AM)" }),
                day.data?.am_load ? /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("div", { className: "font-bold text-slate-700 text-xs", children: [
                    day.data.am_load,
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 font-normal", children: "AU" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "text-[9px] text-slate-500", children: day.data.am_session_type })
                ] }) : /* @__PURE__ */ jsx("span", { className: "text-slate-300 text-xs", children: "-" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 block mb-1 border-b border-slate-50 pb-1", children: "Sesi Sore (PM)" }),
                day.data?.pm_load ? /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("div", { className: "font-bold text-slate-700 text-xs", children: [
                    day.data.pm_load,
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 font-normal", children: "AU" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "text-[9px] text-slate-500", children: day.data.pm_session_type })
                ] }) : /* @__PURE__ */ jsx("span", { className: "text-slate-300 text-xs", children: "-" })
              ] })
            ] }) }),
            day.data?.notes && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setDetailNote(day),
                className: "w-full flex items-center justify-between text-left text-xs text-slate-600 italic bg-white hover:bg-orange-50 hover:text-orange-500 px-3 py-2 rounded-xl border border-slate-200 transition-colors",
                children: [
                  /* @__PURE__ */ jsxs("span", { className: "truncate pr-2", children: [
                    'Lihat Catatan: "',
                    day.data.notes,
                    '"'
                  ] }),
                  /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4 shrink-0 text-orange-500" })
                ]
              }
            )
          ] }) })
        ] }, dIndex);
      }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-orange-500 p-4 md:p-6 text-white border-b border-orange-700", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3 md:mb-4 opacity-90", children: [
        /* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx("h4", { className: "text-[10px] md:text-xs font-bold", children: "Load Metrics & Monitoring" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-4 gap-x-2 md:gap-4 divide-x divide-orange-400/50", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-2 md:px-4 first:pl-0 border-none sm:border-solid", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[9px] md:text-[10px] font-bold text-orange-200 mb-0.5 md:mb-1", children: "Weekly Load" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl md:text-3xl font-bold", children: week.metrics.weeklyLoad })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-2 md:px-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[9px] md:text-[10px] font-bold text-orange-200 mb-0.5 md:mb-1", children: "ACWR Ratio" }),
          /* @__PURE__ */ jsx("p", { className: `text-2xl md:text-3xl font-bold ${getAcwrColor(week.metrics.acwr)}`, children: week.metrics.acwr ? week.metrics.acwr : /* @__PURE__ */ jsx("span", { className: "text-orange-300 font-medium text-base md:text-lg italic", children: "N/A" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-2 md:px-4 border-none sm:border-solid", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[9px] md:text-[10px] font-bold text-orange-200 mb-0.5 md:mb-1", children: "Mean Daily Load" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl md:text-2xl font-bold mt-1", children: week.metrics.meanLoad })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-2 md:px-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[9px] md:text-[10px] font-bold text-orange-200 mb-0.5 md:mb-1", children: "Std Deviation" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl md:text-2xl font-bold mt-1", children: week.metrics.stdDev })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-2 md:px-4 border-none sm:border-solid", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[9px] md:text-[10px] font-bold text-amber-200 mb-0.5 md:mb-1", children: "Training Monotony" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl md:text-2xl font-bold mt-1 text-amber-300", children: week.metrics.monotony })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-2 md:px-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[9px] md:text-[10px] font-bold text-rose-200 mb-0.5 md:mb-1", children: "Strain" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl md:text-2xl font-bold mt-1 text-rose-300", children: week.metrics.strain })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-4 md:p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4 md:mb-6 text-slate-500", children: [
        /* @__PURE__ */ jsx(Target, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx("h4", { className: "text-[10px] md:text-xs font-bold", children: "Training / Match Frequency" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-12", children: [
        /* @__PURE__ */ jsx("div", { className: "space-y-2 md:space-y-2.5", children: physicalPrepTypes.map((t) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs md:text-sm border-b border-slate-200/50 pb-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-slate-600", children: t }),
          /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800", children: week.metrics.frequency[t] })
        ] }, t)) }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2 md:space-y-2.5", children: [...skillTypes, ...matchTypes, ...travelTypes].map((t) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs md:text-sm border-b border-slate-200/50 pb-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-slate-600", children: t }),
          /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800", children: week.metrics.frequency[t] })
        ] }, t)) }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2.5 md:space-y-3.5 h-fit", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pb-2.5 border-b border-slate-100", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] md:text-[10px] font-bold text-slate-500 pr-2", children: "Total (Train/Match/Travel)" }),
            /* @__PURE__ */ jsx("span", { className: "text-lg md:text-xl font-bold text-orange-500", children: week.metrics.totals.all })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pb-2 md:pb-2.5 border-b border-slate-100", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] md:text-[10px] font-bold text-slate-500 pr-2", children: "Total Training Sessions" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm md:text-base font-bold text-slate-800", children: week.metrics.totals.training })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pb-2 md:pb-2.5 border-b border-slate-100", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] md:text-[10px] font-bold text-slate-500 pr-2", children: "Num. Physical Prep" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs md:text-sm font-bold text-slate-600", children: week.metrics.totals.physical })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pb-2 md:pb-2.5 border-b border-slate-100", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] md:text-[10px] font-bold text-slate-500 pr-2", children: "Num. Skill Sessions" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs md:text-sm font-bold text-slate-600", children: week.metrics.totals.skill })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pb-2 md:pb-2.5 border-b border-slate-100", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] md:text-[10px] font-bold text-slate-500 pr-2", children: "Matches / Comps" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs md:text-sm font-bold text-slate-600", children: week.metrics.totals.matches })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] md:text-[10px] font-bold text-slate-500 pr-2", children: "Travel" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs md:text-sm font-bold text-slate-600", children: week.metrics.totals.travel })
          ] })
        ] })
      ] })
    ] }),
    detailNote && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[70] flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity", onClick: () => setDetailNote(null) }),
      /* @__PURE__ */ jsxs("div", { className: "relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-orange-100 text-orange-500 rounded-xl", children: /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 md:w-5 md:h-5" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-base md:text-lg text-slate-800 leading-tight", children: "Catatan Harian" }),
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] md:text-xs font-medium text-slate-500 mt-0.5", children: [
                formatDateToIndo(detailNote.dateObj, "full"),
                " • ",
                /* @__PURE__ */ jsx("span", { className: "capitalize", children: detailNote.dayName })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setDetailNote(null), className: "p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-all", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4 md:w-5 md:h-5" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 md:p-6", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-200 shadow-inner max-h-[50vh] overflow-y-auto custom-scrollbar", children: /* @__PURE__ */ jsxs("p", { className: "text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap italic", children: [
            '"',
            detailNote.data.notes,
            '"'
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "mt-5 md:mt-6 flex justify-end", children: /* @__PURE__ */ jsx("button", { onClick: () => setDetailNote(null), className: "px-5 md:px-6 py-2 md:py-2.5 bg-slate-100 text-slate-700 font-bold text-xs md:text-sm rounded-xl hover:bg-slate-200 transition-colors", children: "Tutup Catatan" }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  WeeklyGroup as default
};
