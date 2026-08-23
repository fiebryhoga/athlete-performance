import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { usePage, Head, Link } from "@inertiajs/react";
import { Flame, ChevronRight, Search } from "lucide-react";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import "axios";
function Index({ athletes, filters }) {
  const { auth } = usePage().props;
  auth.user.role === "athlete";
  const [searchQuery, setSearchQuery] = useState(filters?.search || "");
  const filteredAthletes = useMemo(() => {
    if (!searchQuery.trim()) return athletes;
    const q = searchQuery.toLowerCase();
    return athletes.filter(
      (athlete) => athlete.name.toLowerCase().includes(q)
    );
  }, [searchQuery, athletes]);
  const getInitials = (name) => {
    if (!name) return "??";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  return /* @__PURE__ */ jsxs(
    AppLayout,
    {
      title: "Rencana Makan",
      description: "Kelola rencana makan atlet yang dihasilkan oleh AI.",
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Rencana Makan" }),
        /* @__PURE__ */ jsxs("div", { className: "pb-12 space-y-6", children: [
          /* @__PURE__ */ jsx(
            PageHeader,
            {
              title: "Rencana Makan",
              subtitle: "Kelola rencana makan atlet yang dihasilkan oleh AI.",
              badge: "Nutrisi & Diet",
              icon: Flame,
              searchPlaceholder: "Cari atlet...",
              searchValue: searchQuery,
              onSearchChange: setSearchQuery
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6", children: [
            filteredAthletes.map((athlete) => /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("admin.meal-plans.show", athlete.id),
                className: "relative bg-white rounded-xl border border-slate-200 p-5 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 overflow-hidden group",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" }),
                  /* @__PURE__ */ jsxs("div", { className: "relative flex items-center gap-4 z-10", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-14 h-14 md:w-16 md:h-16 rounded-full bg-orange-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 overflow-hidden", children: athlete.photo_url ? /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: athlete.photo_url,
                        alt: athlete.name,
                        className: "w-full h-full object-cover"
                      }
                    ) : /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-orange-500", children: getInitials(athlete.name) }) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 text-base md:text-lg truncate group-hover:text-orange-500 transition-colors", children: athlete.name }),
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 inline-block mt-1", children: "Klien" })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shrink-0", children: /* @__PURE__ */ jsx(ChevronRight, { size: 16 }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 mt-auto relative z-10", children: [
                    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                      /* @__PURE__ */ jsx("div", { className: "text-[10px] text-slate-400 font-medium mb-0.5", children: "Dibuat Pada" }),
                      /* @__PURE__ */ jsx("div", { className: "font-semibold text-slate-700 text-xs", children: athlete.latest_plan ? new Date(athlete.latest_plan.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "text-center border-l border-slate-100", children: [
                      /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-slate-400 font-medium mb-0.5 flex items-center justify-center gap-1", children: [
                        /* @__PURE__ */ jsx(Flame, { size: 10 }),
                        " Total"
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "font-semibold text-xs truncate px-1", children: athlete.total_plans > 0 ? /* @__PURE__ */ jsxs("span", { className: "text-orange-500", children: [
                        athlete.total_plans,
                        " Rencana"
                      ] }) : /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "Belum Ada" }) })
                    ] })
                  ] })
                ]
              },
              athlete.id
            )),
            filteredAthletes.length === 0 && /* @__PURE__ */ jsxs("div", { className: "col-span-full py-16 flex flex-col items-center justify-center bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4", children: /* @__PURE__ */ jsx(Search, { className: "text-slate-300", size: 24 }) }),
              /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-sm font-bold", children: "No athletes found matching your search." })
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  Index as default
};
