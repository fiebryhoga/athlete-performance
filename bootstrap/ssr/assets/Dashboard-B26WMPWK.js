import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { P as PageHeader } from "./PageHeader-BXFyVdi4.js";
import { P as PageFooter } from "./PageFooter-BbeHbnjC.js";
import { Calendar, Zap, TrendingUp, Wallet, ChevronLeft, ChevronRight, Dumbbell, Users, Clock, ClipboardList } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ComposedChart, CartesianGrid, XAxis, YAxis, Bar, Line, PieChart, Pie, Cell } from "recharts";
import "axios";
const CategoryAveragesCard = ({ data }) => {
  const defaultData = [
    { name: "Speed", value: 97 },
    { name: "Endurance", value: 86.9 },
    { name: "Power", value: 81.8 },
    { name: "Strength", value: 72.3 },
    { name: "Agility", value: 71.3 },
    { name: "Str. Endurance", value: 59.1 }
  ];
  const rawItems = data && data.length > 0 ? data : defaultData;
  const radarItems = rawItems.map((item) => ({
    subject: `${item.name.replace("Strength Endurance", "Str. Endurance")} (${item.value})`,
    category: item.name,
    score: item.value,
    fullMark: 100
  }));
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between h-full hover:border-slate-300 transition-all", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-orange-50/80 via-amber-50/30 to-transparent pointer-events-none rounded-tr-xl" }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 flex items-center justify-between mb-1", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-800 leading-tight", children: "Radar Kategori Fisik" }),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 font-medium", children: "Benchmark rata-rata atribut klien (0 - 100)" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 h-[200px] w-full -my-1", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(RadarChart, { cx: "50%", cy: "50%", outerRadius: "66%", data: radarItems, children: [
      /* @__PURE__ */ jsx(PolarGrid, { stroke: "#e2e8f0", strokeDasharray: "3 3" }),
      /* @__PURE__ */ jsx(
        PolarAngleAxis,
        {
          dataKey: "subject",
          tick: { fill: "#475569", fontSize: 9.5, fontWeight: 600 }
        }
      ),
      /* @__PURE__ */ jsx(PolarRadiusAxis, { domain: [0, 100], tick: false, axisLine: false }),
      /* @__PURE__ */ jsx(
        Radar,
        {
          name: "Skor Fisik",
          dataKey: "score",
          stroke: "#ea580c",
          strokeWidth: 2.5,
          fill: "#f97316",
          fillOpacity: 0.25,
          dot: { r: 3.5, fill: "#fff", stroke: "#ea580c", strokeWidth: 2 }
        }
      ),
      /* @__PURE__ */ jsx(
        Tooltip,
        {
          content: ({ active, payload }) => {
            if (active && payload && payload.length) {
              const d = payload[0]?.payload;
              return /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200/90 shadow-md rounded-lg px-3 py-1.5 text-xs", children: [
                /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-800", children: [
                  d?.category,
                  ": "
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "font-bold text-orange-600", children: [
                  d?.score,
                  " / 100 pts"
                ] })
              ] });
            }
            return null;
          }
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center justify-between text-[11px] font-semibold text-slate-500 pt-2 border-t border-slate-100", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "Teratas: ",
        /* @__PURE__ */ jsx("strong", { className: "text-slate-800 font-bold", children: "Speed (97.0)" })
      ] }),
      /* @__PURE__ */ jsxs("span", { children: [
        "Fokus: ",
        /* @__PURE__ */ jsx("strong", { className: "text-orange-600 font-bold", children: "Str. Endurance (59.1)" })
      ] })
    ] })
  ] });
};
const TopClientsCard = ({ athletes }) => {
  const defaultAthletes = [
    { name: "Indri", sport: "Kebugaran Lv 1", test_date: "05 Agu 2026", score: 91.7 },
    { name: "Clayton", sport: "Man Padel Junior", test_date: "01 Mei 2025", score: 91.3 },
    { name: "Augustin", sport: "Kebugaran Lv 1", test_date: "05 Agu 2026", score: 86 },
    { name: "Rini", sport: "Kebugaran Lv 1", test_date: "05 Agu 2026", score: 85.7 },
    { name: "Andri Suyoko", sport: "Kebugaran Lv 1", test_date: "27 Jul 2026", score: 77.2 }
  ];
  const items = athletes && athletes.length > 0 ? athletes : defaultAthletes;
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between h-full hover:border-slate-300 transition-all", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-orange-50/80 via-amber-50/30 to-transparent pointer-events-none rounded-tr-xl" }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 flex items-center justify-between mb-2", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-800 leading-tight", children: "Klien Teratas" }),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 font-medium", children: "Skor tertinggi dari tes fisik terbaru" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 divide-y divide-slate-100 my-1 space-y-2", children: items.map((ath, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-2 first:pt-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
        /* @__PURE__ */ jsx("span", { className: "w-4 text-center text-xs font-bold text-slate-400 shrink-0", children: idx + 1 }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-800 truncate", children: ath.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-medium text-slate-400 truncate", children: [
            ath.sport,
            " ",
            ath.test_date ? `• ${ath.test_date}` : ""
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-right shrink-0 ml-2", children: /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-slate-900", children: [
        ath.score,
        " ",
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-orange-600", children: "pts" })
      ] }) })
    ] }, idx)) })
  ] });
};
const toLocalYMD = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const parseLocalYMD = (str) => {
  if (!str) return /* @__PURE__ */ new Date();
  const parts = str.split("-").map(Number);
  if (parts.length === 3) {
    return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
  }
  return /* @__PURE__ */ new Date();
};
const TodaySessionsSidebarCard = ({ agendas = [], initialDate }) => {
  const todayStr = toLocalYMD(/* @__PURE__ */ new Date());
  const currentDateStr = initialDate || todayStr;
  const [isLoading, setIsLoading] = useState(false);
  const formatDateIndo = (dateString) => {
    if (!dateString) return "";
    const date = parseLocalYMD(dateString);
    const today = /* @__PURE__ */ new Date();
    today.setHours(12, 0, 0, 0);
    const target = new Date(date);
    target.setHours(12, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1e3 * 3600 * 24));
    const dayName = date.toLocaleDateString("id-ID", { weekday: "short" });
    const dayNum = date.toLocaleDateString("id-ID", { day: "numeric" });
    const monthName = date.toLocaleDateString("id-ID", { month: "short" });
    const yearNum = date.getFullYear();
    if (diffDays === 0) return `Hari Ini, ${dayNum} ${monthName}`;
    if (diffDays === 1) return `Besok, ${dayNum} ${monthName}`;
    if (diffDays === -1) return `Kemarin, ${dayNum} ${monthName}`;
    return `${dayName}, ${dayNum} ${monthName} ${yearNum}`;
  };
  const fetchAgendasForDate = (dateStr) => {
    setIsLoading(true);
    router.get(
      route("dashboard"),
      { agenda_date: dateStr },
      {
        preserveState: true,
        preserveScroll: true,
        only: ["today_agendas", "selected_agenda_date"],
        onFinish: () => setIsLoading(false)
      }
    );
  };
  const handleNavigateDate = (offsetDays) => {
    const d = parseLocalYMD(currentDateStr);
    d.setDate(d.getDate() + offsetDays);
    const newStr = toLocalYMD(d);
    fetchAgendasForDate(newStr);
  };
  const handleDirectDateChange = (e) => {
    const newStr = e.target.value;
    if (!newStr) return;
    fetchAgendasForDate(newStr);
  };
  const handleResetToday = () => {
    fetchAgendasForDate(todayStr);
  };
  const isToday = currentDateStr === todayStr;
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-5 hover:border-slate-300 transition-all", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-28 h-28 bg-gradient-to-bl from-orange-50/80 via-amber-50/30 to-transparent pointer-events-none rounded-tr-xl" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-800 leading-tight", children: isToday ? "Sesi Latihan Hari Ini" : "Sesi Latihan" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 font-medium", children: "Jadwal sesi Privat & Grup" })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 rounded bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-bold", children: [
        agendas?.length || 0,
        " Sesi"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center justify-between gap-1.5 bg-slate-50 border border-slate-200/80 rounded-lg p-1.5 mb-3.5", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => handleNavigateDate(-1),
          className: "p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-white transition-all active:scale-95 shrink-0",
          title: "Hari Sebelumnya",
          children: /* @__PURE__ */ jsx(ChevronLeft, { size: 14 })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1 flex items-center justify-center gap-1.5 text-center cursor-pointer group", children: [
        /* @__PURE__ */ jsx(Calendar, { size: 13, className: "text-orange-500 shrink-0 group-hover:scale-110 transition-transform" }),
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-slate-700 select-none group-hover:text-orange-600 transition-colors", children: formatDateIndo(currentDateStr) }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "date",
            value: currentDateStr,
            onChange: handleDirectDateChange,
            className: "absolute inset-0 opacity-0 cursor-pointer w-full h-full",
            title: "Pilih tanggal sesi"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => handleNavigateDate(1),
          className: "p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-white transition-all active:scale-95 shrink-0",
          title: "Hari Berikutnya",
          children: /* @__PURE__ */ jsx(ChevronRight, { size: 14 })
        }
      ),
      !isToday && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleResetToday,
          className: "px-2 py-0.5 rounded bg-orange-500 text-white text-[9px] font-bold hover:bg-orange-600 transition-all shrink-0 active:scale-95",
          title: "Kembali ke Hari Ini",
          children: "Hari Ini"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: `relative z-10 transition-opacity duration-200 ${isLoading ? "opacity-40 pointer-events-none" : "opacity-100"}`, children: agendas && agendas.length > 0 ? /* @__PURE__ */ jsx("div", { className: "divide-y divide-slate-100 space-y-2.5", children: agendas.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "pt-2.5 first:pt-0 flex items-center justify-between gap-2.5", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${item.is_group ? "bg-amber-50 text-amber-700 border border-amber-200/70" : "bg-orange-50 text-orange-700 border border-orange-200/70"}`,
              children: item.is_group ? "Grup" : "Privat"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-800 truncate", children: item.participant_name })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-slate-400 font-medium truncate", children: [
          item.coach_name ? `Pelatih: ${item.coach_name}` : "Staf",
          " • Sesi #",
          item.session_number || 1
        ] })
      ] }),
      item.route && /* @__PURE__ */ jsx(
        Link,
        {
          href: item.route,
          className: "p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors shrink-0",
          children: /* @__PURE__ */ jsx(ChevronRight, { size: 14 })
        }
      )
    ] }, idx)) }) : /* @__PURE__ */ jsxs("div", { className: "py-6 px-3 text-center bg-slate-50/70 border border-dashed border-slate-200 rounded-xl", children: [
      /* @__PURE__ */ jsx(Calendar, { size: 18, className: "mx-auto text-slate-300 mb-1" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-600", children: isToday ? "Tidak ada sesi hari ini" : "Tidak ada sesi pada tanggal ini" }),
      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 mt-0.5", children: "Semua sesi latihan telah selesai atau belum dijadwalkan." })
    ] }) })
  ] });
};
const PerformanceTrendChart = ({ trendData }) => {
  const defaultData = [
    { week: "15 Jun", range: "15 Jun - 21 Jun", score: 0, sessions: 1, private: 1, group: 0, tests: 0 },
    { week: "22 Jun", range: "22 Jun - 28 Jun", score: 0, sessions: 3, private: 3, group: 0, tests: 0 },
    { week: "29 Jun", range: "29 Jun - 05 Jul", score: 0, sessions: 23, private: 18, group: 5, tests: 0 },
    { week: "06 Jul", range: "06 Jul - 12 Jul", score: 0, sessions: 12, private: 7, group: 5, tests: 0 },
    { week: "13 Jul", range: "13 Jul - 19 Jul", score: 50.9, sessions: 27, private: 18, group: 8, tests: 1 },
    { week: "20 Jul", range: "20 Jul - 26 Jul", score: 0, sessions: 38, private: 28, group: 10, tests: 0 },
    { week: "27 Jul", range: "27 Jul - 02 Aug", score: 70, sessions: 58, private: 46, group: 9, tests: 3 },
    { week: "03 Aug", range: "03 Aug - 09 Aug", score: 69, sessions: 41, private: 23, group: 10, tests: 8 },
    { week: "10 Aug", range: "10 Aug - 16 Aug", score: 58.6, sessions: 29, private: 24, group: 3, tests: 2 },
    { week: "17 Aug", range: "17 Aug - 23 Aug", score: 0, sessions: 1, private: 1, group: 0, tests: 0 }
  ];
  const chartData = trendData && trendData.length > 0 ? trendData : defaultData;
  const maxSessions = Math.max(
    ...chartData.map((d) => (Number(d.private) || 0) + (Number(d.group) || 0)),
    4
  );
  const sessionAxisMax = Math.max(Math.ceil(maxSessions * 1.3), 5);
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-5 hover:border-slate-300 transition-all", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-48 h-36 bg-gradient-to-bl from-orange-50/70 via-amber-50/20 to-transparent pointer-events-none rounded-tr-xl" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(TrendingUp, { size: 16 }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xs sm:text-sm font-bold text-slate-800 leading-tight truncate", children: "Tren Performa & Volume Sesi Mingguan" }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-[11px] text-slate-400 font-medium truncate", children: "Statistik 10 minggu skor fisik & rincian sesi latihan" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3.5 text-[11px] font-semibold shrink-0 sm:ml-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-xs bg-orange-600 shadow-2xs" }),
          /* @__PURE__ */ jsx("span", { className: "text-slate-600", children: "Privat (Sesi)" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-xs bg-amber-400 shadow-2xs" }),
          /* @__PURE__ */ jsx("span", { className: "text-slate-600", children: "Grup (Sesi)" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-orange-950 border border-orange-800 shadow-2xs" }),
          /* @__PURE__ */ jsx("span", { className: "text-slate-600", children: "Skor Fisik (Pts)" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-[235px] w-full", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(
      ComposedChart,
      {
        data: chartData,
        margin: { top: 10, right: 0, left: -22, bottom: 5 },
        children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }),
          /* @__PURE__ */ jsx(
            XAxis,
            {
              dataKey: "week",
              axisLine: false,
              tickLine: false,
              tick: { fill: "#64748b", fontSize: 10, fontWeight: 600 },
              angle: -25,
              textAnchor: "end",
              height: 32,
              interval: 0
            }
          ),
          /* @__PURE__ */ jsx(
            YAxis,
            {
              yAxisId: "sessions",
              domain: [0, sessionAxisMax],
              allowDecimals: false,
              axisLine: false,
              tickLine: false,
              tick: { fill: "#64748b", fontSize: 10, fontWeight: 600 }
            }
          ),
          /* @__PURE__ */ jsx(
            YAxis,
            {
              yAxisId: "score",
              orientation: "right",
              domain: [0, 100],
              ticks: [0, 25, 50, 75, 100],
              axisLine: false,
              tickLine: false,
              tick: { fill: "#431407", fontSize: 9.5, fontWeight: 700 }
            }
          ),
          /* @__PURE__ */ jsx(
            Tooltip,
            {
              content: ({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0]?.payload;
                  const hasScore = data?.score !== null && data?.score > 0;
                  return /* @__PURE__ */ jsxs("div", { className: "bg-white text-slate-800 rounded-lg px-3.5 py-2.5 text-xs shadow-md border border-slate-200/90 space-y-1.5 min-w-[210px]", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 pb-1.5", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900 text-[11px]", children: data?.range || data?.week }),
                      /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100", children: data?.week })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 text-slate-600 text-[11px]", children: [
                      /* @__PURE__ */ jsx("span", { children: "Skor Fisik:" }),
                      /* @__PURE__ */ jsx("span", { className: `font-bold ${hasScore ? "text-orange-950" : "text-slate-400 italic font-normal"}`, children: hasScore ? `${data.score} pts` : "0 pts (Tidak ada tes)" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 text-slate-600 text-[11px]", children: [
                      /* @__PURE__ */ jsx("span", { children: "Total Sesi:" }),
                      /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-900", children: [
                        data?.sessions || 0,
                        " Sesi"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-slate-400 pt-1.5 border-t border-slate-100 flex justify-between gap-2 font-medium", children: [
                      /* @__PURE__ */ jsxs("span", { className: "text-orange-600 font-semibold", children: [
                        "Privat: ",
                        /* @__PURE__ */ jsx("strong", { className: "text-slate-900 font-bold", children: data?.private || 0 })
                      ] }),
                      /* @__PURE__ */ jsx("span", { children: "•" }),
                      /* @__PURE__ */ jsxs("span", { className: "text-amber-500 font-semibold", children: [
                        "Grup: ",
                        /* @__PURE__ */ jsx("strong", { className: "text-slate-900 font-bold", children: data?.group || 0 })
                      ] }),
                      /* @__PURE__ */ jsx("span", { children: "•" }),
                      /* @__PURE__ */ jsxs("span", { children: [
                        "Tes: ",
                        /* @__PURE__ */ jsx("strong", { className: "text-slate-900 font-bold", children: data?.tests || 0 })
                      ] })
                    ] })
                  ] });
                }
                return null;
              }
            }
          ),
          /* @__PURE__ */ jsx(
            Bar,
            {
              yAxisId: "sessions",
              dataKey: "private",
              name: "Sesi Privat",
              stackId: "sessions",
              fill: "#ea580c",
              radius: [0, 0, 0, 0],
              barSize: 38
            }
          ),
          /* @__PURE__ */ jsx(
            Bar,
            {
              yAxisId: "sessions",
              dataKey: "group",
              name: "Sesi Grup",
              stackId: "sessions",
              fill: "#fbbf24",
              radius: [4, 4, 0, 0],
              barSize: 38
            }
          ),
          /* @__PURE__ */ jsx(
            Line,
            {
              yAxisId: "score",
              type: "monotone",
              dataKey: "score",
              name: "Skor Fisik",
              stroke: "#431407",
              strokeWidth: 2,
              strokeDasharray: "4 4",
              connectNulls: true,
              dot: (props) => {
                const { cx, cy } = props;
                if (!cx || !cy) return null;
                return /* @__PURE__ */ jsx(
                  "circle",
                  {
                    cx,
                    cy,
                    r: 4.5,
                    fill: "#ffffff",
                    stroke: "#431407",
                    strokeWidth: 2,
                    strokeDasharray: "none"
                  },
                  `dot-${cx}-${cy}`
                );
              },
              activeDot: (props) => {
                const { cx, cy } = props;
                if (!cx || !cy) return null;
                return /* @__PURE__ */ jsx(
                  "circle",
                  {
                    cx,
                    cy,
                    r: 6.5,
                    fill: "#ea580c",
                    stroke: "#431407",
                    strokeWidth: 2,
                    strokeDasharray: "none"
                  },
                  `act-dot-${cx}-${cy}`
                );
              }
            }
          )
        ]
      }
    ) }) })
  ] });
};
const CoachEarningsCard = ({ salaryData }) => {
  const { auth } = usePage().props;
  const isCoach = auth?.user?.role === "coach";
  const currentMonthStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
  const selectedMonth = salaryData?.month || currentMonthStr;
  const [isLoading, setIsLoading] = useState(false);
  const formatRupiah = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val || 0);
  };
  const formatShortRupiah = (val) => {
    const num = val || 0;
    if (num >= 1e6) {
      return `Rp ${(num / 1e6).toFixed(1).replace(/\.0$/, "")} jt`;
    }
    if (num >= 1e3) {
      return `Rp ${(num / 1e3).toFixed(0)} rb`;
    }
    return `Rp ${num}`;
  };
  const fetchMonthData = (monthStr) => {
    setIsLoading(true);
    router.get(
      route("dashboard"),
      { salary_month: monthStr },
      {
        preserveState: true,
        preserveScroll: true,
        only: ["coach_salaries"],
        onFinish: () => setIsLoading(false)
      }
    );
  };
  const handleNavigateMonth = (offsetMonths) => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const d = new Date(year, month - 1 + offsetMonths, 1, 12, 0, 0);
    const newYear = d.getFullYear();
    const newMonth = String(d.getMonth() + 1).padStart(2, "0");
    const newMonthStr = `${newYear}-${newMonth}`;
    fetchMonthData(newMonthStr);
  };
  const handleDirectMonthChange = (e) => {
    const newMonthStr = e.target.value;
    if (!newMonthStr) return;
    fetchMonthData(newMonthStr);
  };
  const handleResetThisMonth = () => {
    fetchMonthData(currentMonthStr);
  };
  const isCurrentMonth = selectedMonth === currentMonthStr;
  const coaches = salaryData?.coaches || [];
  const activeCoaches = coaches.filter((c) => (c.total_fee || 0) > 0);
  const myData = coaches[0] || null;
  const [categoryFilter, setCategoryFilter] = useState("all");
  const myItems = myData?.items || [];
  const filteredItems = myItems.filter((it) => {
    if (categoryFilter === "all") return true;
    return it.type === categoryFilter;
  });
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-5 hover:border-slate-300 transition-all", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-48 h-36 bg-gradient-to-bl from-orange-50/70 via-amber-50/20 to-transparent pointer-events-none rounded-tr-xl" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(Wallet, { size: 16 }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xs sm:text-sm font-bold text-slate-800 leading-tight truncate", children: isCoach ? "Ringkasan Pendapatan & Fee Saya" : "Rekap Gaji & Fee Pelatih" }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-[11px] text-slate-400 font-medium truncate", children: isCoach ? `Rincian honor sesi privat, latihan grup, dan shift gym Anda pada ${salaryData?.month_label || selectedMonth}` : "Rincian fee sesi privat, latihan grup, dan shift jaga gym" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-1.5 shrink-0 self-start md:self-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-semibold text-slate-400 leading-tight", children: [
            "Total Fee ",
            salaryData?.month_label
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm font-black text-slate-900 leading-tight", children: formatRupiah(salaryData?.total_fee) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-6 w-px bg-slate-200" }),
        /* @__PURE__ */ jsxs("div", { className: "text-[10px] space-y-0.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-emerald-600 font-semibold", children: [
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Cair: ",
              formatShortRupiah(salaryData?.paid_fee)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-amber-600 font-semibold", children: [
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-500" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Belum: ",
              formatShortRupiah(salaryData?.unpaid_fee)
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center justify-between gap-2 bg-slate-50 border border-slate-200/80 rounded-lg p-1.5 mb-4", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => handleNavigateMonth(-1),
          className: "p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-white transition-all active:scale-95 shrink-0",
          title: "Bulan Sebelumnya",
          children: /* @__PURE__ */ jsx(ChevronLeft, { size: 15 })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1 flex items-center justify-center gap-1.5 text-center cursor-pointer group", children: [
        /* @__PURE__ */ jsx(Calendar, { size: 13, className: "text-orange-500 shrink-0 group-hover:scale-110 transition-transform" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-700 select-none group-hover:text-orange-600 transition-colors", children: salaryData?.month_label || selectedMonth }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "month",
            value: selectedMonth,
            onChange: handleDirectMonthChange,
            className: "absolute inset-0 opacity-0 cursor-pointer w-full h-full",
            title: "Pilih bulan dari kalender"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => handleNavigateMonth(1),
          className: "p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-white transition-all active:scale-95 shrink-0",
          title: "Bulan Berikutnya",
          children: /* @__PURE__ */ jsx(ChevronRight, { size: 15 })
        }
      ),
      !isCurrentMonth && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleResetThisMonth,
          className: "px-2 py-0.5 rounded bg-orange-500 text-white text-[10px] font-bold hover:bg-orange-600 transition-all shrink-0 active:scale-95",
          title: "Kembali ke Bulan Ini",
          children: "Bulan Ini"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: `relative z-10 transition-opacity duration-200 ${isLoading ? "opacity-40 pointer-events-none" : "opacity-100"}`, children: isCoach ? (
      /* ═══════════════════════════════════════════
         COACH PERSONAL REDESIGN VIEW WITH DIRECT DETAILS
         ═══════════════════════════════════════════ */
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setCategoryFilter(categoryFilter === "individual" ? "all" : "individual"),
              className: `relative overflow-hidden p-4 rounded-xl text-left border transition-all duration-300 shadow-2xs group ${categoryFilter === "individual" ? "bg-gradient-to-br from-orange-50/70 via-white to-amber-50/40 border-orange-200/90 shadow-xs ring-1 ring-orange-400/30" : "bg-gradient-to-br from-white via-white to-slate-50/60 border-slate-200/80 hover:border-slate-300 hover:to-orange-50/30"}`,
              children: [
                /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-orange-400/10 via-amber-400/5 to-transparent rounded-bl-full pointer-events-none transition-opacity group-hover:opacity-100" }),
                /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center justify-between gap-2 mb-3 w-full", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-orange-500/25", children: /* @__PURE__ */ jsx(Dumbbell, { size: 15 }) }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-800 leading-tight", children: "Sesi Privat" }),
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-semibold", children: "Latihan Individu" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/90 border border-slate-200/80 text-slate-700 shrink-0 shadow-2xs", children: [
                    myData?.individual_count || 0,
                    " Sesi"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "relative z-10 pt-2.5 border-t border-slate-100 flex items-baseline justify-between w-full", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-medium", children: "Honor Sesi" }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-black text-slate-900", children: formatRupiah(myData?.individual_fee || 0) })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setCategoryFilter(categoryFilter === "group" ? "all" : "group"),
              className: `relative overflow-hidden p-4 rounded-xl text-left border transition-all duration-300 shadow-2xs group ${categoryFilter === "group" ? "bg-gradient-to-br from-amber-50/70 via-white to-yellow-50/40 border-amber-200/90 shadow-xs ring-1 ring-amber-400/30" : "bg-gradient-to-br from-white via-white to-slate-50/60 border-slate-200/80 hover:border-slate-300 hover:to-amber-50/30"}`,
              children: [
                /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-amber-400/10 via-yellow-400/5 to-transparent rounded-bl-full pointer-events-none transition-opacity group-hover:opacity-100" }),
                /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center justify-between gap-2 mb-3 w-full", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-amber-500/25", children: /* @__PURE__ */ jsx(Users, { size: 15 }) }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-800 leading-tight", children: "Latihan Grup" }),
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-semibold", children: "Sesi Kelompok" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/90 border border-slate-200/80 text-slate-700 shrink-0 shadow-2xs", children: [
                    myData?.group_count || 0,
                    " Sesi"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "relative z-10 pt-2.5 border-t border-slate-100 flex items-baseline justify-between w-full", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-medium", children: "Honor Sesi" }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-black text-slate-900", children: formatRupiah(myData?.group_fee || 0) })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setCategoryFilter(categoryFilter === "gym" ? "all" : "gym"),
              className: `relative overflow-hidden p-4 rounded-xl text-left border transition-all duration-300 shadow-2xs group ${categoryFilter === "gym" ? "bg-gradient-to-br from-blue-50/70 via-white to-cyan-50/40 border-blue-200/90 shadow-xs ring-1 ring-blue-400/30" : "bg-gradient-to-br from-white via-white to-slate-50/60 border-slate-200/80 hover:border-slate-300 hover:to-blue-50/30"}`,
              children: [
                /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-blue-400/10 via-cyan-400/5 to-transparent rounded-bl-full pointer-events-none transition-opacity group-hover:opacity-100" }),
                /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center justify-between gap-2 mb-3 w-full", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-blue-500/25", children: /* @__PURE__ */ jsx(Clock, { size: 15 }) }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-800 leading-tight", children: "Shift Jaga Gym" }),
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-semibold", children: "Tugas Jaga OTS" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/90 border border-slate-200/80 text-slate-700 shrink-0 shadow-2xs", children: [
                    myData?.gym_count || 0,
                    " Shift"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "relative z-10 pt-2.5 border-t border-slate-100 flex items-baseline justify-between w-full", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-medium", children: "Honor Shift" }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-black text-slate-900", children: formatRupiah(myData?.gym_fee || 0) })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-2xs", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50/80 px-4 py-2.5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(ClipboardList, { size: 14, className: "text-orange-500" }),
              /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-800", children: "Rincian Sesi & Shift Latihan" }),
              /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700", children: [
                filteredItems.length,
                " Catatan"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-[10px] font-semibold", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setCategoryFilter("all"),
                  className: `px-2 py-1 rounded-md transition-all ${categoryFilter === "all" ? "bg-slate-900 text-white font-bold" : "text-slate-600 hover:text-slate-900"}`,
                  children: [
                    "Semua (",
                    myItems.length,
                    ")"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setCategoryFilter("individual"),
                  className: `px-2 py-1 rounded-md transition-all ${categoryFilter === "individual" ? "bg-orange-500 text-white font-bold" : "text-slate-600 hover:text-slate-900"}`,
                  children: [
                    "Privat (",
                    myData?.individual_count || 0,
                    ")"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setCategoryFilter("group"),
                  className: `px-2 py-1 rounded-md transition-all ${categoryFilter === "group" ? "bg-amber-500 text-white font-bold" : "text-slate-600 hover:text-slate-900"}`,
                  children: [
                    "Grup (",
                    myData?.group_count || 0,
                    ")"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setCategoryFilter("gym"),
                  className: `px-2 py-1 rounded-md transition-all ${categoryFilter === "gym" ? "bg-blue-500 text-white font-bold" : "text-slate-600 hover:text-slate-900"}`,
                  children: [
                    "Gym (",
                    myData?.gym_count || 0,
                    ")"
                  ]
                }
              )
            ] })
          ] }),
          filteredItems.length > 0 ? /* @__PURE__ */ jsx("div", { className: "divide-y divide-slate-100 max-h-[290px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden", children: filteredItems.map((item) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "px-4 py-3 hover:bg-slate-50/60 transition-colors flex items-center justify-between gap-3 text-xs",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "w-9 h-9 rounded-lg bg-slate-100 border border-slate-200/80 flex flex-col items-center justify-center shrink-0 text-slate-700", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold uppercase leading-none text-slate-400", children: item.date?.split(" ")[1] || "—" }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-black leading-none text-slate-900 mt-0.5", children: item.date?.split(" ")[0] || "—" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: `text-[9px] font-bold px-1.5 py-0.5 rounded ${item.type === "individual" ? "bg-orange-50 text-orange-600 border border-orange-100" : item.type === "group" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-blue-50 text-blue-700 border border-blue-100"}`,
                          children: item.type_label
                        }
                      ),
                      /* @__PURE__ */ jsx("h5", { className: "text-xs font-bold text-slate-800 truncate", children: item.title })
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-slate-400 font-medium truncate mt-0.5", children: [
                      item.subtitle,
                      " ",
                      item.time ? `• ${item.time}` : ""
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 shrink-0 text-right", children: /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-black text-slate-900", children: formatRupiah(item.fee) }),
                  /* @__PURE__ */ jsx("div", { className: "mt-0.5", children: item.is_paid ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100", children: [
                    /* @__PURE__ */ jsx("span", { className: "w-1 h-1 rounded-full bg-emerald-500" }),
                    "Lunas"
                  ] }) : item.fee > 0 ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100", children: [
                    /* @__PURE__ */ jsx("span", { className: "w-1 h-1 rounded-full bg-amber-500" }),
                    "Belum Cair"
                  ] }) : /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-medium", children: "—" }) })
                ] }) })
              ]
            },
            item.id
          )) }) : /* @__PURE__ */ jsxs("div", { className: "py-8 px-4 text-center bg-slate-50/40", children: [
            /* @__PURE__ */ jsx(ClipboardList, { size: 22, className: "mx-auto text-slate-300 mb-1.5" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-600", children: "Tidak ada catatan sesi untuk kategori ini" }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 mt-0.5", children: "Pilih filter lain atau ubah bulan untuk melihat riwayat sesi Anda." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-3 bg-slate-50/90 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-medium", children: /* @__PURE__ */ jsxs("span", { children: [
            "Menampilkan ",
            filteredItems.length,
            " dari total ",
            myItems.length,
            " sesi/shift bulan ",
            salaryData?.month_label || selectedMonth,
            "."
          ] }) })
        ] })
      ] })
    ) : activeCoaches && activeCoaches.length > 0 ? (
      /* ═══════════════════════════════════════════
         SUPERADMIN MULTI-COACH VIEW
         ═══════════════════════════════════════════ */
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: activeCoaches.map((c) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white border border-slate-200/80 rounded-xl p-3.5 hover:border-orange-200 hover:shadow-xs transition-all flex flex-col justify-between",
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 mb-2.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[11px] shrink-0 shadow-2xs", children: c.initials || "C" }),
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-800 truncate leading-tight", children: c.coach_name }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-medium truncate capitalize", children: c.role === "superadmin" ? "Super Admin" : "Pelatih" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0", children: [
                  c.total_sessions,
                  " Sesi"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-[10px] text-slate-600 mb-3 bg-slate-50/70 p-2 rounded-lg border border-slate-100", children: [
                c.individual_fee > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 font-medium", children: [
                    /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-orange-500" }),
                    "Privat (",
                    c.individual_count,
                    ")"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-800", children: formatShortRupiah(c.individual_fee) })
                ] }),
                c.group_fee > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 font-medium", children: [
                    /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-500" }),
                    "Grup (",
                    c.group_count,
                    ")"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-800", children: formatShortRupiah(c.group_fee) })
                ] }),
                c.gym_fee > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 font-medium", children: [
                    /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-blue-500" }),
                    "Jaga Gym (",
                    c.gym_count,
                    ")"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-800", children: formatShortRupiah(c.gym_fee) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-2 border-t border-slate-100 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[9px] font-semibold text-slate-400", children: "Total Fee" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs font-black text-orange-600", children: formatRupiah(c.total_fee) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-right text-[10px]", children: c.unpaid_fee > 0 ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100", children: [
                "Belum: ",
                formatShortRupiah(c.unpaid_fee)
              ] }) : c.total_fee > 0 ? /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100", children: "Lunas" }) : /* @__PURE__ */ jsx("span", { className: "text-slate-400 font-medium", children: "—" }) })
            ] })
          ]
        },
        c.coach_id
      )) })
    ) : /* @__PURE__ */ jsxs("div", { className: "py-8 px-4 text-center bg-slate-50/70 border border-dashed border-slate-200 rounded-xl", children: [
      /* @__PURE__ */ jsx(Wallet, { size: 20, className: "mx-auto text-slate-300 mb-1.5" }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-slate-600", children: [
        "Tidak ada fee pelatih pada ",
        salaryData?.month_label || selectedMonth
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 mt-0.5", children: "Belum ada sesi latihan atau shift gym yang tercatat untuk bulan ini." })
    ] }) })
  ] });
};
const HeroGreeting = ({ user, stats }) => {
  user?.role === "superadmin" ? "Super Admin" : "Pelatih";
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-white rounded-lg p-7 md:p-8 lg:p-9 border border-slate-200/90 shadow-2xs group min-h-[210px] flex items-center", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-orange-50/50 via-amber-50/20 to-transparent pointer-events-none" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center justify-between w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 pr-4 md:pr-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[11px] font-semibold text-emerald-600 mb-3", children: [
          /* @__PURE__ */ jsxs("span", { className: "relative flex h-2 w-2", children: [
            /* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }),
            /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500" })
          ] }),
          /* @__PURE__ */ jsx("span", { children: "Status Sistem: Optimal & Terintegrasi" })
        ] }),
        /* @__PURE__ */ jsxs("h2", { className: "text-base sm:text-lg font-bold tracking-tight text-slate-900 mb-2 leading-snug", children: [
          "Selamat Datang Kembali,",
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-orange-600 font-bold", children: user?.name }),
          "!"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-slate-500 text-[11px] sm:text-xs font-medium leading-relaxed sm:leading-5 mb-5 max-w-xl", children: [
          "Pantau kesiapan dan progres latihan klien secara langsung (",
          /* @__PURE__ */ jsx("span", { className: "italic", children: "real-time" }),
          "). Saat ini mengelola",
          " ",
          /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-900", children: [
            stats?.total_atlet || 0,
            " klien aktif"
          ] }),
          " ",
          "dan",
          " ",
          /* @__PURE__ */ jsxs("span", { className: "font-bold text-orange-600", children: [
            stats?.sesi_bulan_ini || 0,
            " sesi latihan"
          ] }),
          " ",
          "bulan ini untuk mendorong performa optimal."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-slate-100 pt-4 mt-10 flex flex-wrap items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[11px] font-semibold text-slate-700", children: [
            /* @__PURE__ */ jsx("span", { className: "text-slate-800 font-bold", children: "OTS Performance Hub" }),
            /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "•" }),
            /* @__PURE__ */ jsx("span", { className: "text-slate-500 font-medium", children: "Olympus Training Surabaya" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-50 border border-slate-200/90 rounded text-[10px] font-bold text-slate-700 shadow-2xs", children: [
            /* @__PURE__ */ jsx(
              Zap,
              {
                size: 11,
                className: "text-orange-500 fill-orange-500"
              }
            ),
            /* @__PURE__ */ jsx("span", { children: "Fase Latihan Aktif" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative hidden lg:flex items-end shrink-0 -mb-9 -mr-3 z-10 pointer-events-none self-end", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "/assets/images/model2.png",
          alt: "Athlete Performance",
          className: "h-[200px] xl:h-[220px] w-auto object-contain object-bottom drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] group-hover:scale-105 transition-transform duration-500"
        }
      ) })
    ] })
  ] });
};
const DemographicsCard = ({ genderData = [], ageData = [], bmiData = [] }) => {
  const maleItem = genderData?.find((g) => g.name === "Laki-laki" || g.name === "Male") || { value: 61 };
  const femaleItem = genderData?.find((g) => g.name === "Perempuan" || g.name === "Female") || { value: 31 };
  const genderTotal = (maleItem.value || 0) + (femaleItem.value || 0);
  const defaultGenderList = [
    { name: "Laki-laki", value: maleItem.value || 61, color: "#ea580c" },
    { name: "Perempuan", value: femaleItem.value || 31, color: "#fb923c" }
  ];
  const defaultAgeData = [
    { name: "Anak (<18)", short: "Anak", value: 15, color: "#0284c7" },
    { name: "Dewasa (18-50)", short: "Dewasa", value: 27, color: "#10b981" },
    { name: "Lansia (>50)", short: "Lansia", value: 15, color: "#f97316" }
  ];
  const formattedAgeData = (ageData && ageData.length > 0 ? ageData : defaultAgeData).map((d, i) => ({
    name: d.name,
    short: d.name.split(" ")[0],
    value: d.value,
    color: d.color || (i === 0 ? "#0284c7" : i === 1 ? "#10b981" : "#f97316")
  }));
  const ageTotal = formattedAgeData.reduce((sum, item) => sum + (item.value || 0), 0);
  const defaultBmiData = [
    { name: "Underweight", range: "< 18.5", value: 7, color: "#0284c7" },
    { name: "Normal", range: "18.5-24.9", value: 25, color: "#10b981" },
    { name: "Overweight", range: "25-29.9", value: 12, color: "#f59e0b" },
    { name: "Obesitas", range: "≥ 30", value: 8, color: "#ef4444" }
  ];
  const formattedBmiData = (bmiData && bmiData.length > 0 ? bmiData : defaultBmiData).map((d, i) => ({
    name: d.name === "Obese" ? "Obesitas" : d.name,
    range: d.range || "",
    value: d.value,
    color: d.color || (i === 0 ? "#0284c7" : i === 1 ? "#10b981" : i === 2 ? "#f59e0b" : "#ef4444")
  }));
  const bmiTotal = formattedBmiData.reduce((sum, item) => sum + (item.value || 0), 0);
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-5 hover:border-slate-300 transition-all space-y-3.5", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-orange-50/70 via-amber-50/20 to-transparent pointer-events-none rounded-tr-xl" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
      /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-slate-800 leading-tight", children: "Demografi Klien" }),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 font-medium", children: "Distribusi jenis kelamin, kelompok usia & status BMI" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 grid grid-cols-2 gap-4 divide-x divide-slate-100", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center pr-3", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2", children: "Jenis Kelamin" }),
        /* @__PURE__ */ jsxs("div", { className: "h-[90px] w-[90px] relative flex items-center justify-center mb-2", children: [
          /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsx(PieChart, { children: /* @__PURE__ */ jsx(
            Pie,
            {
              data: defaultGenderList,
              cx: "50%",
              cy: "50%",
              innerRadius: 27,
              outerRadius: 41,
              paddingAngle: 3,
              dataKey: "value",
              strokeWidth: 0,
              children: defaultGenderList.map((entry, idx) => /* @__PURE__ */ jsx(Cell, { fill: entry.color }, `gender-${idx}`))
            }
          ) }) }),
          /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-black text-slate-800 leading-none", children: genderTotal }),
            /* @__PURE__ */ jsx("span", { className: "text-[8px] font-semibold text-slate-400", children: "Total" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full space-y-1.5 text-[11px]", children: defaultGenderList.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-slate-600 font-medium", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full shrink-0", style: { backgroundColor: item.color } }),
            item.name
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-800", children: [
            item.value,
            " ",
            /* @__PURE__ */ jsxs("span", { className: "text-slate-400 text-[10px] font-normal", children: [
              "(",
              genderTotal > 0 ? Math.round(item.value / genderTotal * 100) : 0,
              "%)"
            ] })
          ] })
        ] }, idx)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center pl-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2", children: "Kelompok Usia" }),
        /* @__PURE__ */ jsxs("div", { className: "h-[90px] w-[90px] relative flex items-center justify-center mb-2", children: [
          /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsx(PieChart, { children: /* @__PURE__ */ jsx(
            Pie,
            {
              data: formattedAgeData,
              cx: "50%",
              cy: "50%",
              innerRadius: 27,
              outerRadius: 41,
              paddingAngle: 3,
              dataKey: "value",
              strokeWidth: 0,
              children: formattedAgeData.map((entry, idx) => /* @__PURE__ */ jsx(Cell, { fill: entry.color }, `age-${idx}`))
            }
          ) }) }),
          /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-black text-slate-800 leading-none", children: ageTotal }),
            /* @__PURE__ */ jsx("span", { className: "text-[8px] font-semibold text-slate-400", children: "Total" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full space-y-1.5 text-[11px]", children: formattedAgeData.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-slate-600 font-medium", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 truncate max-w-[70px]", children: [
            /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full shrink-0", style: { backgroundColor: item.color } }),
            item.short
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-800 shrink-0", children: [
            item.value,
            " ",
            /* @__PURE__ */ jsxs("span", { className: "text-slate-400 text-[10px] font-normal", children: [
              "(",
              ageTotal > 0 ? Math.round(item.value / ageTotal * 100) : 0,
              "%)"
            ] })
          ] })
        ] }, idx)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-slate-100 space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: "Status BMI Klien" }),
        /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-semibold text-slate-500", children: [
          bmiTotal,
          " Terukur"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between text-[10px] text-slate-600 font-medium px-0.5 pt-0.5", children: formattedBmiData.map((item, idx) => /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: "w-2 h-2 rounded-full shrink-0",
            style: { backgroundColor: item.color }
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-700", children: item.name })
      ] }, idx)) }),
      /* @__PURE__ */ jsx("div", { className: "h-2 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5", children: formattedBmiData.map((item, idx) => {
        const pct = bmiTotal > 0 ? item.value / bmiTotal * 100 : 0;
        if (pct <= 0) return null;
        return /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              width: `${pct}%`,
              backgroundColor: item.color
            },
            className: "h-full first:rounded-l-full last:rounded-r-full transition-all",
            title: `${item.name}: ${item.value} (${Math.round(pct)}%)`
          },
          idx
        );
      }) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-1.5 pt-1 text-center", children: formattedBmiData.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "p-1.5 rounded-lg bg-slate-50 border border-slate-100", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[9px] font-bold text-slate-600 truncate", children: item.name }),
        /* @__PURE__ */ jsx("p", { className: "text-xs font-black text-slate-900 mt-0.5", children: item.value }),
        /* @__PURE__ */ jsxs("p", { className: "text-[8px] text-slate-400", children: [
          bmiTotal > 0 ? Math.round(item.value / bmiTotal * 100) : 0,
          "%"
        ] })
      ] }, idx)) })
    ] })
  ] });
};
const CaborPerformance = ({ caborData }) => /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-5 hover:border-slate-300 transition-all", children: [
  /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-28 h-28 bg-gradient-to-bl from-orange-50/70 via-amber-50/20 to-transparent pointer-events-none rounded-tr-xl" }),
  /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center justify-between mb-3", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-slate-800 leading-tight", children: "Performa Cabor" }),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 font-medium", children: "Rata-rata skor fisik per cabang olahraga" })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold", children: "Top 5" })
  ] }),
  /* @__PURE__ */ jsx("div", { className: "divide-y divide-slate-100 space-y-2", children: caborData?.length > 0 ? caborData.slice(0, 5).map((cabor, i) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: "pt-2 first:pt-0 flex items-center justify-between gap-3",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `text-xs font-bold w-4 text-center shrink-0 ${i === 0 ? "text-orange-600 font-extrabold" : "text-slate-400"}`,
              children: i + 1
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-800 truncate mb-1", children: cabor.name }),
            /* @__PURE__ */ jsx("div", { className: "h-1 w-full bg-slate-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: `h-full rounded-full transition-all duration-700 ease-out ${i === 0 ? "bg-gradient-to-r from-orange-500 to-amber-500" : "bg-slate-300"}`,
                style: {
                  width: `${Math.min(cabor.score / 100 * 100, 100)}%`
                }
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-right shrink-0 ml-2", children: /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-slate-900", children: [
          cabor.score,
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-orange-600 font-semibold", children: "pts" })
        ] }) })
      ]
    },
    i
  )) : /* @__PURE__ */ jsx("div", { className: "text-center text-xs text-slate-400 py-6", children: "Belum ada data cabor" }) })
] });
function Dashboard({ auth }) {
  const {
    stats = {},
    performance_pulse = {},
    charts = { radar: [], gender: [] },
    lists = {
      recent_activity: [],
      top_athletes: [],
      cabor_performance: []
    },
    today_agendas = [],
    selected_agenda_date = null,
    coach_salaries = {}
  } = usePage().props;
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Dashboard", children: [
    /* @__PURE__ */ jsx(Head, { title: "Ringkasan Performa" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3.5 pb-1", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Dashboard",
          description: "Ringkasan target objektif dan performa operasional klien & pelatih."
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 space-y-4", children: [
          /* @__PURE__ */ jsx(HeroGreeting, { user: auth?.user, stats }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(CategoryAveragesCard, { data: performance_pulse?.category_averages }),
            /* @__PURE__ */ jsx(TopClientsCard, { athletes: performance_pulse?.top_clients })
          ] }),
          /* @__PURE__ */ jsx(PerformanceTrendChart, { trendData: charts?.weekly_trend || charts?.monthly_trend }),
          /* @__PURE__ */ jsx(CoachEarningsCard, { salaryData: coach_salaries })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-[340px] xl:w-[380px] 2xl:w-[400px] shrink-0 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-4 hover:border-slate-300 transition-all", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-28 h-28 bg-gradient-to-bl from-orange-50/70 via-amber-50/20 to-transparent pointer-events-none rounded-tr-xl" }),
            /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm shadow-orange-500/10", children: auth?.user?.name?.charAt(0)?.toUpperCase() || "U" }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-800 truncate leading-tight", children: auth?.user?.name }),
                  /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold shrink-0", children: auth?.user?.role === "superadmin" ? "Super Admin" : "Pelatih" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 font-medium truncate mt-0.5", children: auth?.user?.email || "Operasional Performa" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-slate-600 font-medium", children: [
                /* @__PURE__ */ jsx(Calendar, { size: 13, className: "text-slate-400" }),
                /* @__PURE__ */ jsx("span", { children: (/* @__PURE__ */ new Date()).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                }) })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100", children: "Aktif" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            TodaySessionsSidebarCard,
            {
              agendas: today_agendas,
              initialDate: selected_agenda_date
            }
          ),
          /* @__PURE__ */ jsx(
            DemographicsCard,
            {
              genderData: charts?.gender,
              ageData: charts?.age_groups,
              bmiData: charts?.bmi_groups
            }
          ),
          /* @__PURE__ */ jsx(
            CaborPerformance,
            {
              caborData: lists?.cabor_performance
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx(PageFooter, {})
    ] })
  ] });
}
export {
  Dashboard as default
};
