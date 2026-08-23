import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import { HeartPulse, UserCircle, Activity, ChevronRight } from "lucide-react";
import "axios";
function Index({ auth, athletes }) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredAthletes = athletes.filter(
    (athlete) => athlete.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth.user, children: [
    /* @__PURE__ */ jsx(Head, { title: "Kalkulator PHV" }),
    /* @__PURE__ */ jsx("div", { className: "pb-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Penilaian PHV",
          subtitle: "Pilih profil atlet untuk melihat riwayat atau mencatat pengukuran Peak Height Velocity baru.",
          icon: HeartPulse,
          badge: "Manajemen",
          searchPlaceholder: "Cari nama atlet...",
          searchValue: searchQuery,
          onSearchChange: setSearchQuery
        }
      ),
      filteredAthletes.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500", children: "Tidak ada profil atlet ditemukan." }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: filteredAthletes.map((athlete) => {
        const latest = athlete.phv_assessments?.[0];
        return /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("admin.phv-calculator.show", athlete.id),
            className: "group bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:border-orange-500 hover:shadow-md transition-all flex flex-col justify-between",
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden flex-shrink-0", children: athlete.profile_photo_url ? /* @__PURE__ */ jsx("img", { src: athlete.profile_photo_url, alt: athlete.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx(UserCircle, { className: "w-8 h-8" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "overflow-hidden", children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 text-lg truncate group-hover:text-orange-500 transition-colors", children: athlete.name }),
                    /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500 capitalize flex items-center gap-2", children: [
                      athlete.gender === "P" || athlete.gender === "female" || athlete.gender === "Perempuan" ? "Perempuan" : "Laki-laki",
                      athlete.age && /* @__PURE__ */ jsxs("span", { className: "bg-slate-100 px-2 rounded-full text-xs font-bold text-slate-600", children: [
                        Math.round(athlete.age),
                        " Thn"
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "pt-4 border-t border-slate-100", children: latest ? /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Update Terakhir" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700", children: new Date(latest.assessment_date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Maturity Offset" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700", children: Number(latest.maturity_offset).toFixed(1) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: "Status" }),
                    /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 uppercase tracking-widest", children: latest.maturity_status })
                  ] })
                ] }) : /* @__PURE__ */ jsxs("div", { className: "py-6 flex flex-col items-center justify-center text-slate-400 text-sm", children: [
                  /* @__PURE__ */ jsx(Activity, { className: "w-6 h-6 mb-2 opacity-50" }),
                  /* @__PURE__ */ jsx("span", { children: "Belum ada data evaluasi" })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-5 pt-3 border-t border-slate-50 flex items-center justify-between text-orange-500 font-bold text-sm", children: [
                /* @__PURE__ */ jsx("span", { children: "Lihat Riwayat Lengkap" }),
                /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 transform group-hover:translate-x-1 transition-transform" })
              ] })
            ]
          },
          athlete.id
        );
      }) })
    ] }) })
  ] });
}
export {
  Index as default
};
