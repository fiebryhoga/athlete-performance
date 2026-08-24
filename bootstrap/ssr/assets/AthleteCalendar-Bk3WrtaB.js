import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Head, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { Calendar, TrendingUp, CheckCircle2, ChevronRight } from "lucide-react";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import "axios";
function AthleteCalendar({
  auth,
  athlete,
  season_start_date,
  calendarWeeks
}) {
  const formatHeaderDate = (dateString) => {
    if (!dateString) return "-";
    const baseDate = dateString.split("T")[0];
    const [year, month, day] = baseDate.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };
  return /* @__PURE__ */ jsxs(
    AppLayout,
    {
      user: auth.user,
      headerTitle: `Wellness Kalender: ${athlete.name}`,
      headerDescription: "Pantau data harian spesifik untuk athlete ini.",
      children: [
        /* @__PURE__ */ jsx(Head, { title: `Kalender ${athlete.name}` }),
        /* @__PURE__ */ jsxs("div", { className: "pb-12 space-y-6", children: [
          /* @__PURE__ */ jsx(
            PageHeader,
            {
              title: `Kalender Wellness: ${athlete.name}`,
              subtitle: "Pantau data latihan dan wellness harian spesifik untuk athlete ini.",
              badge: "Timeline",
              icon: Calendar,
              actions: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h1", { className: "text-xl sm:text-2xl font-bold text-slate-900 tracking-tight", children: "Weekly Calendar" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-slate-500 mt-1 flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Calendar, { size: 14 }),
                    " Kalender dibuat otomatis dari data pertama."
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-900", children: formatHeaderDate(season_start_date) }) })
              ] })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b border-slate-200 mb-6 pb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-orange-500 shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-default", children: [
              /* @__PURE__ */ jsx(Calendar, { size: 16 }),
              "Kalender Harian"
            ] }),
            /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("admin.wellness-rpe.athlete.analysis", athlete.id),
                className: "px-5 py-2.5 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsx(TrendingUp, { size: 16 }),
                  "Analisis ACWR"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-8", children: calendarWeeks.map((week) => /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200  pb-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxs("h4", { className: "text-sm font-bold text-slate-900  tracking-tight", children: [
                "Week ",
                week.week_number
              ] }),
              /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 rounded bg-slate-100  text-[10px] font-bold text-slate-500 border border-slate-200 ", children: week.week_range })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3", children: week.days.map((day) => {
              const isToday = day.date === new Date((/* @__PURE__ */ new Date()).getTime() - (/* @__PURE__ */ new Date()).getTimezoneOffset() * 6e4).toISOString().split("T")[0];
              const targetRoute = route("admin.wellness-rpe.athlete.date.show", {
                user: athlete.id,
                date: day.date
              });
              return /* @__PURE__ */ jsxs(
                Link,
                {
                  href: targetRoute,
                  className: `group relative overflow-hidden flex flex-col justify-between p-4 bg-white border rounded-xl hover:shadow-md transition-all cursor-pointer ${isToday ? "border-orange-500 ring-1 ring-orange-500/30 shadow-[0_4px_12px_rgba(255,77,0,0.1)]" : "border-slate-200 hover:border-orange-500/50"}`,
                  children: [
                    isToday && /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-8 h-8 bg-orange-50 rounded-bl-full flex items-start justify-end p-1.5 z-10", children: /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-orange-500 animate-pulse" }) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 mb-4 z-10", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold uppercase tracking-wider ${isToday ? "text-orange-500" : "text-slate-400"}`, children: day.day_name }),
                        day.has_data ? /* @__PURE__ */ jsx(CheckCircle2, { size: 14, className: "text-emerald-500" }) : /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-slate-200" })
                      ] }),
                      /* @__PURE__ */ jsxs("h5", { className: `text-base font-bold tracking-tight ${isToday ? "text-slate-900" : "text-slate-900"}`, children: [
                        day.formatted_date.split(" ")[0],
                        " ",
                        /* @__PURE__ */ jsx("span", { className: "font-bold text-sm text-slate-500", children: day.formatted_date.split(" ")[1] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-auto pt-3 border-t border-slate-100 flex items-center justify-between z-10", children: [
                      day.has_data ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wide", children: "Load" }),
                          /* @__PURE__ */ jsx("span", { className: "text-[13px] font-bold text-slate-700", children: day.daily_load })
                        ] }),
                        /* @__PURE__ */ jsx("div", { className: "w-[1px] h-5 bg-slate-200" }),
                        /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wide", children: "Wlns" }),
                          /* @__PURE__ */ jsx("span", { className: "text-[13px] font-bold text-slate-700", children: day.wellness_score })
                        ] })
                      ] }) : /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-slate-400 italic", children: "Belum ada data" }),
                      /* @__PURE__ */ jsx("div", { className: "h-6 w-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white text-slate-400 transition-colors shrink-0", children: /* @__PURE__ */ jsx(ChevronRight, { size: 12 }) })
                    ] })
                  ]
                },
                day.date
              );
            }) })
          ] }, week.week_number)) })
        ] })
      ]
    }
  );
}
export {
  AthleteCalendar as default
};
