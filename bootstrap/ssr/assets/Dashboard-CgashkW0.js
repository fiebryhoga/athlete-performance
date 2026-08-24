import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { Head, Link, router } from "@inertiajs/react";
import { P as PageHeader } from "./PageHeader-BXFyVdi4.js";
import { P as PageFooter } from "./PageFooter-BbeHbnjC.js";
import { Calendar, Users, Zap, Trophy, ArrowUpRight, Dumbbell, Utensils, HeartPulse, ArrowRight, Activity, ChevronLeft, ChevronRight, ClipboardList } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts";
import "axios";
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
const AthleteHeroGreeting = ({ user, stats }) => {
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
          "Pantau kesiapan dan progres latihan atlet secara langsung (",
          /* @__PURE__ */ jsx("span", { className: "italic", children: "real-time" }),
          "). Selesaikan agenda harianmu hari ini untuk mendorong performa dan pemulihan optimal."
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
const AthletePhysicalScoreCard = ({ stats = {} }) => {
  const score = stats?.latest_test_score !== null && stats?.latest_test_score !== void 0 ? Number(stats.latest_test_score) : null;
  const hasScore = score !== null;
  const getPredicate = (val) => {
    if (val === null) return { label: "Belum Ada Tes", color: "bg-slate-100 text-slate-600 border-slate-200" };
    if (val >= 85) return { label: "Sangat Baik", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (val >= 70) return { label: "Baik", color: "bg-blue-50 text-blue-700 border-blue-200" };
    if (val >= 55) return { label: "Cukup Baik", color: "bg-orange-50 text-orange-700 border-orange-200" };
    return { label: "Perlu Peningkatan", color: "bg-amber-50 text-amber-700 border-amber-200" };
  };
  const predicate = getPredicate(score);
  const scorePercent = hasScore ? Math.min(Math.max(score, 0), 100) : 0;
  const scoreDiff = stats?.score_diff;
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between h-full hover:border-slate-300 transition-all", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-orange-50/80 via-amber-50/30 to-transparent pointer-events-none rounded-tr-xl" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center justify-between mb-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(Trophy, { size: 16 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-800 leading-tight", children: "Skor Evaluasi Fisik" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 font-medium", children: "Skor kumulatif atribut tes performa" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "span",
        {
          className: `px-2.5 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${predicate.color}`,
          children: predicate.label
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 my-auto py-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between gap-2 mb-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1.5", children: [
          /* @__PURE__ */ jsx("span", { className: "text-4xl font-black text-slate-900 tracking-tight", children: hasScore ? score.toFixed(1) : "—" }),
          hasScore && /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-400", children: "/ 100 Pts" })
        ] }),
        scoreDiff !== null && scoreDiff !== void 0 && /* @__PURE__ */ jsxs(
          "span",
          {
            className: `inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-md border ${scoreDiff >= 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`,
            children: [
              scoreDiff >= 0 ? `▲ +${scoreDiff}` : `▼ ${scoreDiff}`,
              " Pts"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2.5", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-700 ease-out",
          style: { width: `${scorePercent}%` }
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[11px] text-slate-500", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 font-medium text-slate-500", children: [
          /* @__PURE__ */ jsx(Calendar, { size: 12, className: "text-orange-500" }),
          stats?.latest_test_date || "Belum ada tes"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "font-semibold text-slate-600", children: [
          stats?.total_tests || 0,
          " Total Evaluasi"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 pt-2.5 border-t border-slate-100 flex items-center justify-between", children: /* @__PURE__ */ jsxs(
      Link,
      {
        href: route("athlete.profiling"),
        className: "inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors group",
        children: [
          /* @__PURE__ */ jsx("span", { children: "Buka Rincian Tes & Analisis" }),
          /* @__PURE__ */ jsx(ArrowRight, { size: 13, className: "group-hover:translate-x-0.5 transition-transform" })
        ]
      }
    ) })
  ] });
};
const AthleteCategoryRadarCard = ({ data }) => {
  const defaultData = [
    { name: "Speed", value: 85 },
    { name: "Endurance", value: 80 },
    { name: "Power", value: 78.5 },
    { name: "Strength", value: 75 },
    { name: "Agility", value: 72 },
    { name: "Str. Endurance", value: 65 }
  ];
  const rawItems = data && data.length > 0 ? data : defaultData;
  const radarItems = rawItems.map((item) => ({
    subject: `${item.name.replace("Strength Endurance", "Str. Endurance")} (${item.value})`,
    category: item.name,
    score: item.value,
    fullMark: 100
  }));
  const sorted = [...rawItems].sort((a, b) => b.value - a.value);
  const topCat = sorted[0];
  const lowestCat = sorted[sorted.length - 1];
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between h-full hover:border-slate-300 transition-all", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-orange-50/80 via-amber-50/30 to-transparent pointer-events-none rounded-tr-xl" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center justify-between mb-1", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-800 leading-tight", children: "Radar Kategori Fisik" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 font-medium", children: "Profil atribut fisik dari evaluasi tes terakhir (0 - 100)" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(Activity, { size: 15 }) })
    ] }),
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
      topCat && /* @__PURE__ */ jsxs("span", { children: [
        "Teratas: ",
        /* @__PURE__ */ jsxs("strong", { className: "text-slate-800 font-bold", children: [
          topCat.name,
          " (",
          topCat.value,
          ")"
        ] })
      ] }),
      lowestCat && /* @__PURE__ */ jsxs("span", { children: [
        "Fokus: ",
        /* @__PURE__ */ jsxs("strong", { className: "text-orange-600 font-bold", children: [
          lowestCat.name,
          " (",
          lowestCat.value,
          ")"
        ] })
      ] })
    ] })
  ] });
};
const AthleteWellnessCard = ({ hasWellnessToday, wellnessRecord, todayDate }) => {
  return /* @__PURE__ */ jsxs(
    Link,
    {
      href: route("admin.wellness-rpe.session-form", {
        date: todayDate,
        mode: "wellness"
      }),
      className: "relative overflow-hidden bg-white border border-slate-200/80 hover:border-orange-300 rounded-xl p-5 flex flex-col justify-between h-full hover:shadow-xs transition-all group cursor-pointer block",
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-orange-50/80 via-amber-50/30 to-transparent pointer-events-none rounded-tr-xl" }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 mb-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsx(HeartPulse, { size: 16 }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wide", children: "Log Kebugaran" }),
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors leading-tight truncate", children: "Kuisioner Wellness" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `px-2.5 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${hasWellnessToday ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-orange-50 text-orange-700 border-orange-200"}`,
                children: hasWellnessToday ? "Sudah Terisi" : "Wajib Diisi"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 font-normal leading-relaxed mb-3", children: "Pantau kualitas tidur, tingkat stres, rasa lelah, dan nyeri otot untuk evaluasi pemulihan fisik." }),
          hasWellnessToday && wellnessRecord ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 mb-1 text-center", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-slate-400 font-semibold", children: "Tidur" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-800", children: wellnessRecord.sleep_quality ? `${wellnessRecord.sleep_quality}/5` : "—" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "border-x border-slate-200/60", children: [
              /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-slate-400 font-semibold", children: "Kelelahan" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-800", children: wellnessRecord.fatigue ? `${wellnessRecord.fatigue}/5` : "—" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-slate-400 font-semibold", children: "Total Skor" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-emerald-600", children: wellnessRecord.daily_wellness_score || "Terisi" })
            ] })
          ] }) : /* @__PURE__ */ jsx("div", { className: "p-2.5 rounded-lg bg-orange-50/40 border border-orange-100 text-[11px] text-orange-700 font-medium", children: "Belum ada input evaluasi kesiapan fisik untuk hari ini." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 pt-3 mt-3 border-t border-slate-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 group-hover:text-orange-700 transition-colors", children: [
            /* @__PURE__ */ jsx("span", { children: hasWellnessToday ? "Lihat / Ubah Kuisioner" : "Isi Kuisioner Sekarang" }),
            /* @__PURE__ */ jsx(ArrowRight, { size: 13, className: "group-hover:translate-x-0.5 transition-transform" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-medium", children: "Form Harian" })
        ] })
      ]
    }
  );
};
const AthleteRpeCard = ({ hasRpeToday, wellnessRecord, todayDate }) => {
  return /* @__PURE__ */ jsxs(
    Link,
    {
      href: route("admin.wellness-rpe.session-form", {
        date: todayDate,
        mode: "rpe"
      }),
      className: "relative overflow-hidden bg-white border border-slate-200/80 hover:border-orange-300 rounded-xl p-5 flex flex-col justify-between h-full hover:shadow-xs transition-all group cursor-pointer block",
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-orange-50/80 via-amber-50/30 to-transparent pointer-events-none rounded-tr-xl" }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 mb-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsx(Activity, { size: 16 }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wide", children: "Log Latihan" }),
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors leading-tight truncate", children: "Pengerahan Tenaga (RPE)" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `px-2.5 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${hasRpeToday ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-orange-50 text-orange-700 border-orange-200"}`,
                children: hasRpeToday ? "Sudah Terisi" : "Wajib Diisi"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 font-normal leading-relaxed mb-3", children: "Catat skala intensitas kelelahan dan beban pengerahan tenaga (Skala 1 - 10 RPE) sesi latihan hari ini." }),
          hasRpeToday && wellnessRecord ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 mb-1 text-center", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-slate-400 font-semibold", children: "RPE Pagi" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-800", children: wellnessRecord.am_rpe ? `${wellnessRecord.am_rpe}/10` : "—" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "border-x border-slate-200/60", children: [
              /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-slate-400 font-semibold", children: "RPE Sore" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-800", children: wellnessRecord.pm_rpe ? `${wellnessRecord.pm_rpe}/10` : "—" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-slate-400 font-semibold", children: "Daily Load" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-orange-600", children: wellnessRecord.daily_load ? `${wellnessRecord.daily_load} AU` : "Terisi" })
            ] })
          ] }) : /* @__PURE__ */ jsx("div", { className: "p-2.5 rounded-lg bg-orange-50/40 border border-orange-100 text-[11px] text-orange-700 font-medium", children: "Belum ada catatan skala pengerahan tenaga yang dimasukkan hari ini." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 pt-3 mt-3 border-t border-slate-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 group-hover:text-orange-700 transition-colors", children: [
            /* @__PURE__ */ jsx("span", { children: hasRpeToday ? "Lihat / Ubah Catatan RPE" : "Isi Catatan RPE Sekarang" }),
            /* @__PURE__ */ jsx(ArrowRight, { size: 13, className: "group-hover:translate-x-0.5 transition-transform" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-medium", children: "Beban Sesi" })
        ] })
      ]
    }
  );
};
const AthleteSessionsCard = ({ agendas = [], initialDate }) => {
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
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 font-medium", children: "Jadwal sesi Privat & Grup Anda" })
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
          item.coach_name ? `Coach: ${item.coach_name}` : "Pelatih",
          " • Sesi #",
          item.session_number || 1
        ] })
      ] }),
      item.route && /* @__PURE__ */ jsx(
        Link,
        {
          href: item.route,
          className: "px-2.5 py-1 bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white border border-orange-200 hover:border-orange-500 rounded text-[10px] font-bold transition-all shrink-0",
          children: "Buka Sesi"
        }
      )
    ] }, idx)) }) : /* @__PURE__ */ jsxs("div", { className: "py-6 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200", children: [
      /* @__PURE__ */ jsx(ClipboardList, { size: 18, className: "text-slate-300 mb-1.5" }),
      /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-700", children: "Tidak ada sesi pada tanggal ini" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-[10px] mt-0.5", children: "Belum ada jadwal sesi latihan privat atau grup yang terdaftar." })
    ] }) })
  ] });
};
function AthleteDashboard({
  user,
  today_agendas = [],
  selected_agenda_date = null,
  has_wellness_today,
  has_rpe_today,
  today_wellness_record = null,
  today_date,
  category_averages = [],
  stats = {}
}) {
  const todayFormatted = (/* @__PURE__ */ new Date()).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Dashboard", children: [
    /* @__PURE__ */ jsx(Head, { title: "Dashboard Atlet" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3.5 pb-1", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Dashboard",
          description: "Portal performa atlet, kesiapan fisik, dan agenda latihan harian."
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 space-y-4", children: [
          /* @__PURE__ */ jsx(AthleteHeroGreeting, { user, stats }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(AthletePhysicalScoreCard, { stats }),
            /* @__PURE__ */ jsx(AthleteCategoryRadarCard, { data: category_averages })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(
              AthleteWellnessCard,
              {
                hasWellnessToday: has_wellness_today,
                wellnessRecord: today_wellness_record,
                todayDate: today_date
              }
            ),
            /* @__PURE__ */ jsx(
              AthleteRpeCard,
              {
                hasRpeToday: has_rpe_today,
                wellnessRecord: today_wellness_record,
                todayDate: today_date
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-[340px] xl:w-[380px] 2xl:w-[400px] shrink-0 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-4 hover:border-slate-300 transition-all", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-28 h-28 bg-gradient-to-bl from-orange-50/70 via-amber-50/20 to-transparent pointer-events-none rounded-tr-xl" }),
            /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm shadow-orange-500/10", children: user?.name?.charAt(0)?.toUpperCase() || "A" }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-800 truncate leading-tight", children: user?.name }),
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold shrink-0 border border-emerald-100", children: [
                    /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500" }),
                    "Aktif"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-slate-400 font-medium truncate mt-0.5", children: [
                  stats?.sport || "Atlet",
                  " • ",
                  stats?.package || "Reguler"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative z-10 pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 font-medium text-slate-500", children: [
                /* @__PURE__ */ jsx(Calendar, { size: 13, className: "text-orange-500" }),
                todayFormatted
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-slate-400", children: "Hari Ini" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            AthleteSessionsCard,
            {
              agendas: today_agendas,
              initialDate: selected_agenda_date
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-4 hover:border-slate-300 transition-all", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-28 h-28 bg-gradient-to-bl from-orange-50/70 via-amber-50/20 to-transparent pointer-events-none rounded-tr-xl" }),
            /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(Users, { size: 14 }) }),
              /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-800", children: "Pelatih Pendamping" })
            ] }),
            user?.coaches && user.coaches.length > 0 ? /* @__PURE__ */ jsx("div", { className: "relative z-10 space-y-2", children: user.coaches.map((c) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0", children: c.name?.charAt(0)?.toUpperCase() }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-800 truncate", children: c.name })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold text-slate-400", children: "Pelatih" })
                ]
              },
              c.id
            )) }) : /* @__PURE__ */ jsx("p", { className: "relative z-10 text-[11px] text-slate-400 italic", children: "Belum ada pelatih khusus yang ditetapkan." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-white border border-slate-200/80 rounded-xl p-4 hover:border-slate-300 transition-all", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-28 h-28 bg-gradient-to-bl from-orange-50/70 via-amber-50/20 to-transparent pointer-events-none rounded-tr-xl" }),
            /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(Zap, { size: 14 }) }),
              /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-800", children: "Menu Akses Cepat" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative z-10 space-y-1.5", children: [
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route("athlete.profiling"),
                  className: "flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all group",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                      /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsx(Trophy, { size: 13 }) }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-700 group-hover:text-orange-600 transition-colors truncate", children: "Profil Fisik & Analisis" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      ArrowUpRight,
                      {
                        size: 14,
                        className: "text-slate-400 group-hover:text-orange-600 transition-colors"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route("admin.individual-trainings.index"),
                  className: "flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all group",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                      /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsx(Dumbbell, { size: 13 }) }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-700 group-hover:text-orange-600 transition-colors truncate", children: "Program Latihan" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      ArrowUpRight,
                      {
                        size: 14,
                        className: "text-slate-400 group-hover:text-orange-600 transition-colors"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route("admin.meal-plans.index"),
                  className: "flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all group",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                      /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsx(Utensils, { size: 13 }) }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-700 group-hover:text-orange-600 transition-colors truncate", children: "Rencana Nutrisi & Makan" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      ArrowUpRight,
                      {
                        size: 14,
                        className: "text-slate-400 group-hover:text-orange-600 transition-colors"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route("admin.wellness-rpe.index"),
                  className: "flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all group",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                      /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsx(HeartPulse, { size: 13 }) }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-700 group-hover:text-orange-600 transition-colors truncate", children: "Wellness & Recovery" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      ArrowUpRight,
                      {
                        size: 14,
                        className: "text-slate-400 group-hover:text-orange-600 transition-colors"
                      }
                    )
                  ]
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(PageFooter, {})
  ] });
}
export {
  AthleteDashboard as default
};
