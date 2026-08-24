import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { Head, Link, router } from "@inertiajs/react";
import { Search, X, Plus, Image, Edit, Trash2 } from "lucide-react";
import { P as PageHeader } from "./PageHeader-BXFyVdi4.js";
import { P as PageFooter } from "./PageFooter-BbeHbnjC.js";
import "axios";
function DpaIndex({ auth, compensations }) {
  const isAuthorized = auth?.user?.role === "superadmin" || auth?.user?.role === "coach";
  const canCreate = isAuthorized;
  const canUpdate = isAuthorized;
  const canDelete = isAuthorized;
  const [searchTerm, setSearchTerm] = useState("");
  const categories = [
    "Posterior View",
    "Lateral View",
    "Anterior View",
    "Single Leg"
  ];
  const handleDelete = (item) => {
    if (confirm("Are you sure you want to delete this DPA compensation?")) {
      router.delete(route("admin.dpa-compensations.destroy", item.id), { preserveScroll: true });
    }
  };
  const filteredCompensations = (compensations || []).filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return c.name?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q);
  });
  return /* @__PURE__ */ jsxs(AppLayout, { title: "DPA Compensations", children: [
    /* @__PURE__ */ jsx(Head, { title: "DPA Compensations" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 pb-6", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Compensation Directory",
          description: "Browse and organize postural compensations by category.",
          actions: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative w-44 sm:w-52", children: [
              /* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: searchTerm,
                  onChange: (e) => setSearchTerm(e.target.value),
                  placeholder: "Cari kompensasi...",
                  className: "w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-2xs"
                }
              ),
              searchTerm && /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setSearchTerm(""), className: "absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600", children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" }) })
            ] }),
            canCreate && /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("admin.dpa-compensations.create"),
                className: "flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-orange-500 to-orange-600 text-white border border-orange-600 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-sm hover:from-orange-600 hover:to-orange-700 cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
                  " Tambah"
                ]
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "space-y-8", children: categories.map((category) => {
        const catItems = filteredCompensations.filter((c) => c.category === category);
        return /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 mb-3 pb-2 border-b border-slate-200", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-900 tracking-tight", children: category }),
            /* @__PURE__ */ jsx("span", { className: "bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-200/60", children: catItems.length })
          ] }),
          catItems.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-10 px-4 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-500 shadow-2xs", children: /* @__PURE__ */ jsx(Image, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400 font-medium", children: [
              "No compensations added for ",
              category,
              " yet."
            ] }),
            canCreate && /* @__PURE__ */ jsx(Link, { href: route("admin.dpa-compensations.create"), className: "text-[11px] font-bold text-orange-600 hover:underline", children: "Add one now →" })
          ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5", children: catItems.map((item) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "group relative bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 rounded-lg border border-slate-200/90 hover:border-orange-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "p-3.5 space-y-3 flex-1 flex flex-col justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-10 h-10 sm:w-11 sm:h-11 rounded-md border-2 border-white shadow-2xs bg-gradient-to-br from-orange-50 to-orange-100/70 text-orange-600 font-black text-base flex items-center justify-center shrink-0 overflow-hidden", children: item.image_path ? /* @__PURE__ */ jsx("img", { src: `/storage/${item.image_path}`, className: "w-full h-full object-cover", alt: item.name }) : /* @__PURE__ */ jsx(Image, { className: "w-5 h-5" }) }),
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 space-y-0.5", children: [
                      /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 text-xs sm:text-[13px] truncate group-hover:text-orange-600 transition-colors leading-tight", children: item.name }),
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-bold uppercase tracking-wider", children: item.category })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 pt-0.5 border-t border-slate-100/90", children: [
                    /* @__PURE__ */ jsxs("div", { className: "p-1.5 bg-white/90 rounded-md border border-slate-200/70 shadow-2xs", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase tracking-wider block", children: "Overactive" }),
                      /* @__PURE__ */ jsx("p", { className: "text-[9.5px] font-medium text-slate-700 leading-tight mt-0.5 line-clamp-2", children: item.overactive_muscles || /* @__PURE__ */ jsx("span", { className: "text-slate-400 italic", children: "None specified" }) })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "p-1.5 bg-white/90 rounded-md border border-slate-200/70 shadow-2xs", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase tracking-wider block", children: "Underactive" }),
                      /* @__PURE__ */ jsx("p", { className: "text-[9.5px] font-medium text-slate-700 leading-tight mt-0.5 line-clamp-2", children: item.underactive_muscles || /* @__PURE__ */ jsx("span", { className: "text-slate-400 italic", children: "None specified" }) })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "px-3.5 py-2 bg-gradient-to-r from-slate-50/90 via-white to-orange-50/30 border-t border-slate-100 flex items-center justify-between text-xs", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[9.5px] font-bold text-slate-500", children: item.category }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                    canUpdate && /* @__PURE__ */ jsx(Link, { href: route("admin.dpa-compensations.edit", item.id), className: "text-slate-400 hover:text-orange-500 transition-colors p-0.5", title: "Edit", children: /* @__PURE__ */ jsx(Edit, { className: "w-3 h-3" }) }),
                    canDelete && /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(item), className: "text-slate-400 hover:text-rose-500 transition-colors p-0.5", title: "Hapus", children: /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" }) })
                  ] })
                ] })
              ]
            },
            item.id
          )) })
        ] }, category);
      }) }),
      /* @__PURE__ */ jsx(PageFooter, { className: "!mt-8 !pt-4 !pb-1" })
    ] })
  ] });
}
export {
  DpaIndex as default
};
