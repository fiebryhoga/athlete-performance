import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { Dumbbell, Search, User, Users, ChevronRight, Activity, Calendar } from "lucide-react";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import "axios";
function Index({ athletes, groups }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("individual");
  const filteredAthletes = useMemo(() => {
    if (!searchTerm.trim()) return athletes;
    const q = searchTerm.toLowerCase();
    return athletes.filter(
      (athlete) => athlete.name.toLowerCase().includes(q) || athlete.sport?.name && athlete.sport.name.toLowerCase().includes(q)
    );
  }, [athletes, searchTerm]);
  const filteredGroups = useMemo(() => {
    if (!searchTerm.trim()) return groups;
    const q = searchTerm.toLowerCase();
    return groups.filter(
      (group) => group.name.toLowerCase().includes(q)
    );
  }, [groups, searchTerm]);
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Program Latihan", children: [
    /* @__PURE__ */ jsx(Head, { title: "Program Latihan" }),
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: "Program Latihan",
        subtitle: "Pilih athlete atau grup untuk mencatat dan mengelola sesi program latihan mereka.",
        badge: "Latihan",
        icon: Dumbbell,
        actions: /* @__PURE__ */ jsxs("div", { className: "relative w-full md:w-64 group", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: /* @__PURE__ */ jsx(Search, { className: "text-slate-400", size: 16 }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              name: "search",
              type: "text",
              placeholder: "Cari Athlete atau Grup...",
              className: "w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-500 focus:border-slate-400 focus:ring-4 focus:ring-slate-400/10 focus:shadow-sm outline-none transition-all",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value)
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "pb-12 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex space-x-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200 w-full sm:w-fit mx-auto md:mx-0", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setActiveTab("individual"),
            className: `flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "individual" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}`,
            children: [
              /* @__PURE__ */ jsx(User, { size: 16 }),
              " Klien Individu"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setActiveTab("group"),
            className: `flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "group" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}`,
            children: [
              /* @__PURE__ */ jsx(Users, { size: 16 }),
              " Grup Latihan"
            ]
          }
        )
      ] }),
      activeTab === "individual" ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", children: filteredAthletes.map((athlete) => /* @__PURE__ */ jsx(Link, { href: route("admin.individual-trainings.show", athlete.id), className: "block group", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 hover:border-slate-900 hover:shadow-md rounded-xl p-5 transition-all shadow-sm flex flex-col h-full relative overflow-hidden group-hover:-translate-y-1", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none" }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4 relative z-10", children: [
            /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 ", children: athlete.profile_photo_url ? /* @__PURE__ */ jsx("img", { src: athlete.profile_photo_url, alt: athlete.name, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsx(User, { className: "h-6 w-6 text-slate-400" }) }),
            /* @__PURE__ */ jsx("div", { className: "bg-slate-100 p-1.5 rounded-lg text-slate-400 group-hover:text-white group-hover:bg-orange-500 transition-colors shadow-sm", children: /* @__PURE__ */ jsx(ChevronRight, { size: 18 }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative z-10 mb-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg text-slate-900 group-hover:text-orange-500 transition-colors", children: athlete.name }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 font-semibold mt-1", children: athlete.sport?.name || "Tidak ada cabang olahraga" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 relative z-10", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400", children: "Total Sesi" }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-slate-900 mt-1 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(Activity, { size: 14, className: "text-slate-400" }),
                athlete.total_records
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400", children: "Role" }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-slate-900 mt-1 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(Users, { size: 14, className: "text-slate-400" }),
                /* @__PURE__ */ jsx("span", { className: "capitalize", children: athlete.role })
              ] })
            ] })
          ] })
        ] }) }, athlete.id)) }),
        filteredAthletes.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-16 bg-white rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsx("div", { className: "h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(Dumbbell, { className: "h-6 w-6 text-slate-400" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-900 ", children: "Tidak ada Athlete ditemukan" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-500", children: "Ubah kata kunci pencarian Anda atau pastikan data athlete tersedia." })
        ] })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", children: filteredGroups.map((group) => /* @__PURE__ */ jsx(Link, { href: route("admin.group-trainings.show", group.id), className: "block group", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 hover:border-slate-900 hover:shadow-md rounded-xl p-5 transition-all shadow-sm flex flex-col h-full relative overflow-hidden group-hover:-translate-y-1", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none" }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4 relative z-10", children: [
            /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 ", children: /* @__PURE__ */ jsx(Users, { className: "h-6 w-6 text-slate-400" }) }),
            /* @__PURE__ */ jsx("div", { className: "bg-slate-100 p-1.5 rounded-lg text-slate-400 group-hover:text-white group-hover:bg-orange-500 transition-colors shadow-sm", children: /* @__PURE__ */ jsx(ChevronRight, { size: 18 }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative z-10 mb-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg text-slate-900 group-hover:text-orange-500 transition-colors", children: group.name }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 font-semibold mt-1", children: group.package?.name || "Tidak ada paket" }),
            group.members && group.members.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5 mt-4", children: group.members.map((member) => /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200", children: member.name }, member.id)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 relative z-10", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400", children: "Total Sesi" }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-slate-900 mt-1 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(Calendar, { size: 14, className: "text-slate-400" }),
                group.total_records
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-400", children: "Total Anggota" }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-slate-900 mt-1 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(Users, { size: 14, className: "text-slate-400" }),
                group.members?.length || 0
              ] })
            ] })
          ] })
        ] }) }, group.id)) }),
        filteredGroups.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-16 bg-white rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsx("div", { className: "h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(Users, { className: "h-6 w-6 text-slate-400" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-900 ", children: "Tidak ada Grup ditemukan" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-500", children: "Buat grup baru di menu Manajemen Pengguna terlebih dahulu." })
        ] })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
