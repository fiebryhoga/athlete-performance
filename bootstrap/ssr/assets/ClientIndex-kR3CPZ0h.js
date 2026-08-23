import { jsxs, jsx } from "react/jsx-runtime";
import React from "react";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import { Head, Link } from "@inertiajs/react";
import { HeartPulse, Search, User, ChevronRight, Activity } from "lucide-react";
import "axios";
function ClientIndex({ auth, athletes }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredAthletes = React.useMemo(() => {
    if (!searchTerm.trim()) return athletes;
    const q = searchTerm.toLowerCase();
    return athletes.filter(
      (athlete) => athlete.name.toLowerCase().includes(q) || athlete.sport?.name && athlete.sport.name.toLowerCase().includes(q)
    );
  }, [athletes, searchTerm]);
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth.user, title: "Data Klien Wellness", headerTitle: "Wellness & RPE", headerDescription: "Pantau data Wellness dan RPE atlet Anda.", children: [
    /* @__PURE__ */ jsx(Head, { title: "Wellness Klien" }),
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: "Data Klien Wellness",
        subtitle: "Pilih athlete untuk memantau data Wellness dan RPE harian mereka.",
        badge: "Coach View",
        icon: HeartPulse,
        actions: /* @__PURE__ */ jsxs("div", { className: "relative w-full md:w-64 group", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: /* @__PURE__ */ jsx(Search, { className: "text-slate-400", size: 16 }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              name: "search",
              type: "text",
              placeholder: "Cari Athlete...",
              className: "w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:shadow-sm outline-none transition-all",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value)
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "pb-12 space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", children: filteredAthletes.map((athlete) => /* @__PURE__ */ jsx(Link, { href: route("admin.wellness-rpe.athlete.show", athlete.id), className: "block group", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 hover:border-orange-500 hover:shadow-md hover:shadow-orange-500/10 rounded-xl p-5 transition-all flex flex-col h-full relative overflow-hidden group-hover:-translate-y-1", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -right-4 -top-4 w-24 h-24 bg-orange-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none" }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4 relative z-10", children: [
          /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200", children: athlete.profile_photo_url ? /* @__PURE__ */ jsx("img", { src: athlete.profile_photo_url, alt: athlete.name, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsx(User, { className: "h-6 w-6 text-slate-400" }) }),
          /* @__PURE__ */ jsx("div", { className: "bg-slate-100 p-1.5 rounded-lg text-slate-400 group-hover:text-white group-hover:bg-orange-500 transition-colors shadow-sm", children: /* @__PURE__ */ jsx(ChevronRight, { size: 18 }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 mb-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg text-slate-900 group-hover:text-orange-500 transition-colors", children: athlete.name }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 font-semibold mt-1", children: athlete.sport?.name || "Athlete" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400", children: "Update Terakhir" }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-slate-900 mt-1 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Activity, { size: 14, className: "text-slate-400" }),
              athlete.latest_wellness ? new Date(athlete.latest_wellness.record_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "-"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400", children: "Score Terakhir" }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-slate-900 mt-1 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(HeartPulse, { size: 14, className: "text-slate-400" }),
              athlete.latest_wellness?.daily_wellness_score || "-"
            ] })
          ] })
        ] })
      ] }) }, athlete.id)) }),
      filteredAthletes.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-16 bg-white rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center", children: [
        /* @__PURE__ */ jsx("div", { className: "h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(HeartPulse, { className: "h-6 w-6 text-slate-400" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-900", children: "Tidak ada Athlete ditemukan" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-500", children: "Ubah kata kunci pencarian Anda atau pastikan data athlete tersedia." })
      ] })
    ] })
  ] });
}
export {
  ClientIndex as default
};
