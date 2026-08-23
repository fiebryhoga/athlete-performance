import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { Head, Link } from "@inertiajs/react";
import { BarChart3, Dumbbell, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import "axios";
function Index({ athletes }) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredAthletes = athletes?.filter(
    (athlete) => athlete.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Analisis Beban Latihan", children: [
    /* @__PURE__ */ jsx(Head, { title: "Analisis Beban Latihan" }),
    /* @__PURE__ */ jsxs("div", { className: "pb-12 space-y-6", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Analisis Beban Latihan",
          subtitle: "Pantau volume load, progressive overload, dan distribusi beban latihan kekuatan per atlet.",
          badge: "Strength Analysis",
          icon: BarChart3,
          searchPlaceholder: "Cari nama atlet...",
          searchValue: searchQuery,
          onSearchChange: (e) => setSearchQuery(typeof e === "string" ? e : e.target.value)
        }
      ),
      filteredAthletes.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 animate-in fade-in duration-300", children: filteredAthletes.map((athlete) => /* @__PURE__ */ jsxs("div", { className: "group bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-orange-200 hover:shadow-lg transition-all hover:-translate-y-1 relative flex flex-col justify-between overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-50 to-orange-100/0 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" }),
        /* @__PURE__ */ jsxs("div", { className: "relative flex items-start gap-4 mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 text-orange-500 flex items-center justify-center font-bold text-lg md:text-xl shrink-0 border border-orange-100 shadow-inner group-hover:border-orange-200 transition-colors", children: athlete.profile_photo_url ? /* @__PURE__ */ jsx("img", { src: athlete.profile_photo_url, alt: athlete.name, className: "w-full h-full object-cover" }) : athlete.name.charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 pt-0.5", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 text-base md:text-lg leading-tight group-hover:text-orange-500 transition-colors truncate", children: athlete.name }),
            /* @__PURE__ */ jsx("div", { className: "mt-1.5 flex items-center", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] md:text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 truncate max-w-[150px]", children: athlete.sport?.name || "Tanpa Cabor" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-auto pt-4 border-t border-slate-100", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold text-slate-500 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Dumbbell, { className: "w-4 h-4 text-orange-500" }),
            /* @__PURE__ */ jsx("span", { className: "text-slate-800 text-sm md:text-base", children: athlete.load_session_count || 0 }),
            " Sesi"
          ] }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("admin.load-analysis.show", athlete.id),
              className: "flex items-center gap-1 text-xs font-bold text-white bg-orange-500 px-4 py-2 rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:-translate-y-0.5 transition-all",
              children: [
                "Analisis ",
                /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })
              ]
            }
          )
        ] })
      ] }, athlete.id)) }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 text-center shadow-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "p-4 bg-white border border-slate-200 rounded-full mb-3 shadow-sm", children: /* @__PURE__ */ jsx(Search, { className: "w-8 h-8 text-orange-500" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-slate-800 font-bold text-lg", children: "Atlet tidak ditemukan" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-sm mt-1 font-medium px-4", children: "Coba gunakan kata kunci pencarian yang lain." })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
