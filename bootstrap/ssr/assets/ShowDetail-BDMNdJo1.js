import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { Head, Link } from "@inertiajs/react";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import { B as BodyHighlighter } from "./BodyHighlighter-CAt1_A-z.js";
import { HeartPulse, ArrowLeft, Dumbbell, Activity, Moon, Brain, Flame, Zap, Smile, Clock, User, CheckCircle2 } from "lucide-react";
import "axios";
function ShowDetail({
  auth,
  athlete,
  log,
  selectedDate,
  formattedDate
}) {
  const renderScoreCard = (title, icon, score, colorClass, max = 5) => /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-xl p-5 shadow-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: `p-2 rounded-lg ${colorClass} bg-opacity-10`, children: icon }),
      /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-slate-700", children: title })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold text-slate-900 leading-none", children: score || "-" }),
      /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-slate-400 mb-1", children: [
        "/ ",
        max
      ] })
    ] })
  ] });
  return /* @__PURE__ */ jsxs(
    AppLayout,
    {
      user: auth.user,
      headerTitle: `Detail Wellness: ${athlete.name}`,
      headerDescription: `Data wellness dan RPE untuk tanggal ${formattedDate}`,
      children: [
        /* @__PURE__ */ jsx(Head, { title: `Wellness - ${athlete.name}` }),
        /* @__PURE__ */ jsxs("div", { className: "pb-12 space-y-6", children: [
          /* @__PURE__ */ jsx(
            PageHeader,
            {
              title: `Wellness Detail: ${athlete.name}`,
              subtitle: `Data kesehatan dan intensitas latihan untuk tanggal ${formattedDate}`,
              badge: formattedDate,
              icon: HeartPulse,
              actions: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route("admin.wellness-rpe.athlete.show", athlete.id),
                    className: "flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-50 transition-all shadow-sm",
                    children: [
                      /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
                      " Kembali ke Kalender"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route("admin.wellness-rpe.session-form", { date: selectedDate, athlete_id: athlete.id, mode: "wellness", redirect_to: route("admin.wellness-rpe.athlete.date.show", { user: athlete.id, date: selectedDate }) }),
                    className: "flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600 transition-all shadow-sm",
                    children: [
                      /* @__PURE__ */ jsx(HeartPulse, { size: 16 }),
                      " ",
                      log && log.daily_wellness_score ? "Edit Wellness" : "Isi Wellness"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route("admin.wellness-rpe.session-form", { date: selectedDate, athlete_id: athlete.id, mode: "rpe", redirect_to: route("admin.wellness-rpe.athlete.date.show", { user: athlete.id, date: selectedDate }) }),
                    className: "flex items-center gap-2 px-4 py-2.5 border border-orange-500 text-orange-500 rounded-lg text-sm font-bold hover:bg-orange-500 hover:text-white cursor-pointer transition-all shadow-sm",
                    children: [
                      /* @__PURE__ */ jsx(Dumbbell, { size: 16 }),
                      " ",
                      log && log.daily_load ? "Edit RPE" : "Isi RPE"
                    ]
                  }
                )
              ] })
            }
          ),
          !log ? /* @__PURE__ */ jsxs("div", { className: "text-center py-16 bg-white rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center", children: [
            /* @__PURE__ */ jsx("div", { className: "h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(Activity, { className: "h-6 w-6 text-slate-400" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-900", children: "Belum Ada Data" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-500", children: "Athlete belum mengisi form wellness/RPE pada tanggal ini." })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl p-6 shadow-sm", children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-slate-900 mb-4 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(HeartPulse, { className: "text-orange-500", size: 20 }),
                  "Wellness Metrics",
                  /* @__PURE__ */ jsxs("span", { className: "ml-auto text-sm font-bold bg-orange-50 text-orange-500 px-3 py-1 rounded-full border border-orange-100", children: [
                    "Total Score: ",
                    log.daily_wellness_score || "-",
                    " / 30"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: [
                  renderScoreCard("Kualitas Tidur", /* @__PURE__ */ jsx(Moon, { size: 18, className: "text-indigo-500" }), log.quality_of_sleep, "bg-indigo-500"),
                  renderScoreCard("Tingkat Stres", /* @__PURE__ */ jsx(Brain, { size: 18, className: "text-rose-500" }), log.stress, "bg-rose-500"),
                  renderScoreCard("Kelelahan", /* @__PURE__ */ jsx(Activity, { size: 18, className: "text-amber-500" }), log.fatigue, "bg-amber-500"),
                  renderScoreCard("Nyeri Otot", /* @__PURE__ */ jsx(Flame, { size: 18, className: "text-red-500" }), log.muscle_soreness, "bg-red-500"),
                  renderScoreCard("Motivasi", /* @__PURE__ */ jsx(Zap, { size: 18, className: "text-yellow-500" }), log.motivation, "bg-yellow-500"),
                  renderScoreCard("Kondisi Mood", /* @__PURE__ */ jsx(Smile, { size: 18, className: "text-sky-500" }), log.mood_state, "bg-sky-500")
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl p-6 shadow-sm", children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-slate-900 mb-4 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Dumbbell, { className: "text-orange-500", size: 20 }),
                  "RPE & Load",
                  /* @__PURE__ */ jsxs("span", { className: "ml-auto text-sm font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200", children: [
                    "Daily Load: ",
                    /* @__PURE__ */ jsx("span", { className: "text-orange-500 ml-1", children: log.daily_load || "-" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "border border-slate-100 bg-slate-50 rounded-xl p-5", children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-slate-700 mb-3 flex items-center gap-2", children: "Sesi Pagi (AM)" }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-500", children: "RPE (1-10)" }),
                        /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-900", children: log.am_rpe || "-" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-500", children: "Durasi (Menit)" }),
                        /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-slate-900 flex items-center gap-1", children: [
                          /* @__PURE__ */ jsx(Clock, { size: 14, className: "text-slate-400" }),
                          " ",
                          log.am_duration || "-"
                        ] })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "border border-slate-100 bg-slate-50 rounded-xl p-5", children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-slate-700 mb-3 flex items-center gap-2", children: "Sesi Sore (PM)" }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-500", children: "RPE (1-10)" }),
                        /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-900", children: log.pm_rpe || "-" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-500", children: "Durasi (Menit)" }),
                        /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-slate-900 flex items-center gap-1", children: [
                          /* @__PURE__ */ jsx(Clock, { size: 14, className: "text-slate-400" }),
                          " ",
                          log.pm_duration || "-"
                        ] })
                      ] })
                    ] })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full flex flex-col", children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-slate-900 mb-4 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(User, { className: "text-orange-500", size: 20 }),
                "Area Nyeri Otot"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex-1 flex flex-col items-center justify-center min-h-[300px]", children: !log.muscle_pain_areas || log.muscle_pain_areas.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "inline-flex h-12 w-12 bg-green-50 rounded-full items-center justify-center mb-3", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-6 w-6 text-green-500" }) }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-700", children: "Tidak ada keluhan nyeri" })
              ] }) : /* @__PURE__ */ jsx("div", { className: "w-full flex justify-center scale-90 origin-top", children: /* @__PURE__ */ jsx(
                BodyHighlighter,
                {
                  selectedAreas: log.muscle_pain_areas || [],
                  onAreaToggle: () => {
                  }
                }
              ) }) }),
              log.muscle_pain_areas && log.muscle_pain_areas.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2", children: log.muscle_pain_areas.map((area, idx) => /* @__PURE__ */ jsx("span", { className: "inline-block px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full border border-red-100", children: area }, idx)) })
            ] }) })
          ] })
        ] })
      ]
    }
  );
}
export {
  ShowDetail as default
};
