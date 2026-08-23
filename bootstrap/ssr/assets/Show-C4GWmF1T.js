import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import { HeartPulse, Plus, Activity, Info, Calendar, Edit, Trash2 } from "lucide-react";
import "axios";
function Show({ auth, athlete, assessments }) {
  const [isDeleting, setIsDeleting] = useState(null);
  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus data penilaian ini?")) {
      setIsDeleting(id);
      router.delete(route("admin.phv-calculator.destroy", id), {
        preserveScroll: true,
        onFinish: () => setIsDeleting(null)
      });
    }
  };
  const latest = assessments.length > 0 ? assessments[0] : null;
  return /* @__PURE__ */ jsxs(AppLayout, { user: auth.user, children: [
    /* @__PURE__ */ jsx(Head, { title: `Riwayat PHV - ${athlete.name}` }),
    /* @__PURE__ */ jsx("div", { className: "pb-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: `Riwayat PHV: ${athlete.name}`,
          subtitle: `Pantau riwayat Peak Height Velocity dan status kematangan fisik atlet.`,
          icon: HeartPulse,
          badge: "Tools",
          actions: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsx(Link, { href: route("admin.phv-calculator.index"), className: "px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-200 transition-colors", children: "Kembali" }),
            /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("admin.phv-calculator.create", athlete.id),
                className: "px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-orange-500/20",
                children: [
                  /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                  " Catat Penilaian Baru"
                ]
              }
            )
          ] })
        }
      ),
      latest && /* @__PURE__ */ jsxs("div", { className: "mb-6 bg-white rounded-xl shadow-sm border border-orange-500/20 overflow-hidden relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-70 pointer-events-none" }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 relative z-10", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xl font-bold text-slate-800 flex items-center gap-2 mb-6", children: [
            /* @__PURE__ */ jsx(Activity, { className: "text-orange-500 w-6 h-6" }),
            "Latest PHV Result",
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-500 ml-2 bg-slate-100 px-3 py-1 rounded-full", children: new Date(latest.assessment_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-6 justify-between items-center bg-slate-50/80 rounded-xl p-6 border border-slate-200", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-center w-full sm:w-1/2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-wider mb-2", children: [
                  /* @__PURE__ */ jsx(Activity, { className: "w-4 h-4" }),
                  " Maturity"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex items-baseline justify-center gap-2", children: /* @__PURE__ */ jsx("span", { className: "text-5xl font-bold text-slate-800", children: Number(latest.maturity_offset).toFixed(1) }) }),
                /* @__PURE__ */ jsx("span", { className: "text-slate-500 font-medium text-sm", children: "years from PHV" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "h-16 w-px bg-slate-300 hidden sm:block" }),
              /* @__PURE__ */ jsxs("div", { className: "text-center w-full sm:w-1/2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-wider mb-2", children: [
                  /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
                  " Age at PHV"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-4xl font-bold text-slate-800", children: latest.phv_age }),
                  /* @__PURE__ */ jsx("span", { className: "text-slate-500 font-medium", children: "years" })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold px-2 py-1 bg-slate-200 text-slate-700 rounded mt-2 inline-block uppercase tracking-widest", children: [
                  latest.maturity_status,
                  " MATURER"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 pt-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center", children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500 text-sm font-bold mb-2", children: "Predicted Growth Remain" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-slate-800", children: latest.remaining_growth }),
                  /* @__PURE__ */ jsx("span", { className: "text-slate-500 font-medium", children: "cm" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center", children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500 text-sm font-bold mb-2", children: "Predicted Adult Height" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-slate-800", children: latest.predicted_adult_height }),
                  /* @__PURE__ */ jsx("span", { className: "text-slate-500 font-medium", children: "cm" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center", children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-500 text-sm font-bold mb-2", children: "Current % Adult Height" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-slate-800", children: latest.adult_height_percentage }),
                  /* @__PURE__ */ jsx("span", { className: "text-slate-500 font-medium", children: "%" })
                ] })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-slate-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("h3", { className: "font-bold text-slate-800 text-lg flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "w-5 h-5 text-slate-400" }),
            "History List"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full", children: [
            "Total: ",
            assessments.length,
            " Data"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm text-slate-600", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-xs tracking-wider", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Tanggal Asesmen" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-center", children: "Usia" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-center", children: "Maturity Offset" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-center", children: "Age at PHV & Status" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-center", children: "Predicted Growth Remain" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-center", children: "Predicted Adult Height" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Aksi" })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-slate-100", children: [
            assessments.map((item) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50 transition-colors", children: [
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-bold text-slate-800 whitespace-nowrap", children: new Date(item.assessment_date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-center font-medium whitespace-nowrap", children: Math.round(item.age) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700 whitespace-nowrap", children: Number(item.maturity_offset).toFixed(1) }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800", children: item.phv_age }),
                /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700 uppercase tracking-widest", children: item.maturity_status })
              ] }) }),
              /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 text-center font-medium whitespace-nowrap", children: [
                item.remaining_growth,
                " cm"
              ] }),
              /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 text-center font-medium whitespace-nowrap", children: [
                item.predicted_adult_height,
                " cm"
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route("admin.phv-calculator.edit", item.id),
                    className: "p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors",
                    title: "Edit",
                    children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleDelete(item.id),
                    disabled: isDeleting === item.id,
                    className: "p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50",
                    title: "Hapus",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                  }
                )
              ] }) })
            ] }, item.id)),
            assessments.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "7", className: "px-6 py-12 text-center text-slate-500", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center", children: [
              /* @__PURE__ */ jsx(HeartPulse, { className: "w-10 h-10 text-slate-300 mb-3" }),
              /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Belum ada riwayat pengukuran PHV." }),
              /* @__PURE__ */ jsx("p", { className: "text-sm mt-1 mb-4", children: "Silakan catat penilaian pertama untuk atlet ini." }),
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: route("admin.phv-calculator.create", athlete.id),
                  className: "px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors",
                  children: "Mulai Penilaian"
                }
              )
            ] }) }) })
          ] })
        ] }) })
      ] })
    ] }) })
  ] });
}
export {
  Show as default
};
