import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { Head, Link } from "@inertiajs/react";
import { Users, ChevronRight, Activity, Stethoscope, Search } from "lucide-react";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import "axios";
function DpaIndex({ auth, players }) {
  const t = (text) => text;
  const [searchQuery, setSearchQuery] = useState("");
  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) return players;
    const q = searchQuery.toLowerCase();
    return players.filter(
      (player) => player.name.toLowerCase().includes(q) || player.position?.toLowerCase().includes(q) || player.position_number && String(player.position_number).includes(q)
    );
  }, [searchQuery, players]);
  const getInitials = (name) => {
    if (!name) return "??";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Analisis DPA", children: [
    /* @__PURE__ */ jsx(Head, { title: "Analisis DPA" }),
    /* @__PURE__ */ jsxs("div", { className: "pb-12 space-y-6", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Analisis DPA",
          subtitle: t("Evaluasi pola postur dinamis dan kompensasi otot."),
          badge: "Evaluasi DPA",
          icon: Users,
          searchPlaceholder: t("Cari klien atau posisi..."),
          searchValue: searchQuery,
          onSearchChange: setSearchQuery
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6", children: [
        filteredPlayers.map((player) => /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("admin.athletes.dpa.show", player.id),
            className: "relative bg-white rounded-xl border border-slate-200 p-5 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 overflow-hidden group",
            children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" }),
              /* @__PURE__ */ jsxs("div", { className: "relative flex items-center gap-4 z-10", children: [
                /* @__PURE__ */ jsx("div", { className: "w-14 h-14 md:w-16 md:h-16 rounded-full bg-orange-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 overflow-hidden", children: player.profile_photo || player.photo_url ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: player.profile_photo ? `/storage/${player.profile_photo}` : player.photo_url,
                    alt: player.name,
                    className: "w-full h-full object-cover"
                  }
                ) : /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-orange-500", children: getInitials(player.name) }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 text-base md:text-lg truncate group-hover:text-orange-500 transition-colors", children: player.name }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 inline-block mt-1 truncate max-w-full", children: player.position || "Klien" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shrink-0", children: /* @__PURE__ */ jsx(ChevronRight, { size: 16 }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 mt-auto relative z-10", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-slate-400 font-medium mb-0.5 flex items-center justify-center gap-1", children: [
                    /* @__PURE__ */ jsx(Activity, { size: 10 }),
                    " ",
                    t("Riwayat")
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "font-semibold text-slate-700 text-xs", children: player.total_records > 0 ? `${player.total_records} Tes` : "-" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-center border-l border-slate-100", children: [
                  /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-slate-400 font-medium mb-0.5 flex items-center justify-center gap-1", children: [
                    /* @__PURE__ */ jsx(Stethoscope, { size: 10 }),
                    " ",
                    t("Status")
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "font-semibold text-xs truncate px-1", children: player.total_records > 0 ? /* @__PURE__ */ jsx("span", { className: "text-orange-600", children: "Terdata" }) : /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "Belum Ada" }) })
                ] })
              ] })
            ]
          },
          player.id
        )),
        filteredPlayers.length === 0 && /* @__PURE__ */ jsxs("div", { className: "col-span-full py-16 text-center border border-dashed border-slate-300 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 bg-white border border-slate-200 rounded-full mb-3 shadow-sm", children: /* @__PURE__ */ jsx(
            Search,
            {
              size: 24,
              className: "text-slate-400 "
            }
          ) }),
          /* @__PURE__ */ jsx("h4", { className: "font-semibold text-slate-900 mb-1", children: t("Klien Tidak Ditemukan") }),
          /* @__PURE__ */ jsxs("p", { className: "text-slate-500 text-sm", children: [
            'Pencarian untuk "',
            searchQuery,
            '" tidak menemukan hasil.'
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  DpaIndex as default
};
