import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { Head, Link } from "@inertiajs/react";
import { Search, CalendarDays, ChevronRight } from "lucide-react";
import { useState } from "react";
import "axios";
function Index({ athletes }) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredAthletes = athletes?.filter(
    (athlete) => athlete.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Daily Monitoring", children: [
    /* @__PURE__ */ jsx(Head, { title: "Daily Monitoring" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 md:p-8 rounded-lg border border-slate-200 shadow-sm mb-6 md:mb-8 relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 md:gap-6", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none" }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 w-full lg:w-auto", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-orange-500 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full mb-2.5 md:mb-3 inline-block shadow-sm", children: "Wellness & Readiness" }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2", children: "Daily Monitoring" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 font-medium mt-1 text-xs md:text-sm", children: "Pilih atlet untuk melihat atau mengisi metrik keseharian mereka." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative z-10 w-full lg:w-auto flex items-center gap-3", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full sm:w-72 md:w-80", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3.5 top-3 w-4 h-4 md:w-4 md:h-4 text-slate-400" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Cari nama atlet...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none shadow-sm"
          }
        )
      ] }) })
    ] }),
    filteredAthletes.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 animate-in fade-in duration-300", children: filteredAthletes.map((athlete) => /* @__PURE__ */ jsxs(
      Link,
      {
        href: route("admin.daily-metrics.show", athlete.id),
        className: "group bg-white p-4 md:p-5 rounded-lg shadow-sm border border-slate-200 hover:border-orange-200 hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 md:gap-4 min-w-0 pr-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-orange-50 text-orange-500 flex items-center justify-center font-bold text-lg md:text-xl shrink-0 border-2 border-slate-100 shadow-sm group-hover:border-orange-200 transition-colors", children: athlete.profile_photo_url ? /* @__PURE__ */ jsx("img", { src: athlete.profile_photo_url, alt: athlete.name, className: "w-full h-full object-cover" }) : athlete.name.charAt(0).toUpperCase() }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 text-base md:text-lg group-hover:text-orange-500 transition-colors truncate", children: athlete.name }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1.5 md:gap-2 mt-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] md:text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 truncate max-w-[100px] md:max-w-[120px]", children: athlete.sport?.name || "Tanpa Cabor" }),
                /* @__PURE__ */ jsxs("span", { className: "text-[9px] md:text-[10px] font-bold text-slate-400 flex items-center gap-1 shrink-0", children: [
                  /* @__PURE__ */ jsx(CalendarDays, { className: "w-2.5 h-2.5 md:w-3 md:h-3" }),
                  " ",
                  athlete.total_records || 0,
                  " Record"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-1.5 md:p-2 rounded-lg text-slate-300 group-hover:text-orange-500 group-hover:bg-orange-50 transition-all group-hover:translate-x-1 shrink-0", children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 md:w-5 md:h-5" }) })
        ]
      },
      athlete.id
    )) }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16 md:py-20 bg-white rounded-lg border border-dashed border-slate-300 text-center shadow-sm mx-2 md:mx-0", children: [
      /* @__PURE__ */ jsx("div", { className: "p-4 bg-orange-50/50 rounded-full mb-3", children: /* @__PURE__ */ jsx(Search, { className: "w-6 h-6 md:w-8 md:h-8 text-orange-200" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-slate-800 font-bold text-base md:text-lg", children: "Atlet tidak ditemukan" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-xs md:text-sm mt-1 font-medium px-4", children: "Coba gunakan kata kunci pencarian yang lain." })
    ] })
  ] });
}
export {
  Index as default
};
