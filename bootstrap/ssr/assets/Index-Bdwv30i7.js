import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { Head, Link, router } from "@inertiajs/react";
import { Activity, Plus, Image, Edit, Trash2 } from "lucide-react";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import "axios";
function DpaIndex({ auth, compensations }) {
  const t = (text) => text;
  const isAuthorized = auth?.user?.role === "superadmin" || auth?.user?.role === "coach";
  const canCreate = isAuthorized;
  const canUpdate = isAuthorized;
  const canDelete = isAuthorized;
  const categories = [
    "Posterior View",
    "Lateral View",
    "Anterior View",
    "Single Leg"
  ];
  const handleDelete = (item) => {
    if (confirm("Are you sure you want to delete this DPA compensation?")) {
      router.delete(route("admin.dpa-compensations.destroy", item.id), {
        preserveScroll: true
      });
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: "DPA Compensations", children: [
    /* @__PURE__ */ jsx(Head, { title: "DPA Benchmark Settings" }),
    /* @__PURE__ */ jsxs("div", { className: "w-full pb-12 space-y-6", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: t("Compensation Directory"),
          subtitle: t("Browse and organize postural compensations by category"),
          badge: "Master DPA",
          icon: Activity,
          actions: canCreate && /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("admin.dpa-compensations.create"),
              className: "bg-orange-500 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-orange-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsx(Plus, { size: 18, strokeWidth: 2 }),
                " ",
                t("Add Compensation")
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "space-y-12", children: categories.map((category) => {
        const catItems = compensations.filter(
          (c) => c.category === category
        );
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: "animate-in fade-in slide-in-from-bottom-4 duration-500",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-5 pb-3 border-b border-slate-200 ", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900 tracking-tight", children: category }),
                /* @__PURE__ */ jsxs("span", { className: "bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-200 shadow-sm", children: [
                  catItems.length,
                  " Compensations"
                ] })
              ] }),
              catItems.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center p-8 bg-slate-50/50 border border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center", children: [
                /* @__PURE__ */ jsx("div", { className: "p-3 bg-white rounded-full border border-slate-200 shadow-sm mb-3", children: /* @__PURE__ */ jsx(
                  Image,
                  {
                    size: 20,
                    className: "text-slate-400"
                  }
                ) }),
                /* @__PURE__ */ jsxs("p", { className: "text-slate-500 text-sm font-medium", children: [
                  "No compensations added for",
                  " ",
                  category,
                  " yet."
                ] }),
                canCreate && /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route("admin.dpa-compensations.create"),
                    className: "mt-3 text-xs font-bold text-slate-900 hover:underline",
                    children: "Add one now →"
                  }
                )
              ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5", children: catItems.map((item) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "bg-white [#09090b] border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 :border-slate-700 transition-all duration-200 flex flex-col group relative overflow-hidden",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "absolute top-0 right-0 p-4 flex gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity z-10", children: [
                      canUpdate && /* @__PURE__ */ jsx(
                        Link,
                        {
                          href: route("admin.dpa-compensations.edit", item.id),
                          className: "p-1.5 bg-white/80 [#09090b]/80 backdrop-blur-sm border border-slate-200 text-slate-500 hover:text-slate-900 :text-slate-100 rounded-lg transition-colors shadow-sm",
                          children: /* @__PURE__ */ jsx(Edit, { size: 14 })
                        }
                      ),
                      canDelete && /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => handleDelete(item),
                          className: "p-1.5 bg-white/80 [#09090b]/80 backdrop-blur-sm border border-slate-200 text-slate-500 hover:text-rose-600 :text-rose-400 rounded-lg transition-colors shadow-sm",
                          children: /* @__PURE__ */ jsx(Trash2, { size: 14 })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 mb-5 pr-16", children: [
                      item.image_path ? /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: `/storage/${item.image_path}`,
                          className: "w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0 bg-white",
                          alt: item.name
                        }
                      ) : /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-300 shrink-0 shadow-sm", children: /* @__PURE__ */ jsx(
                        Image,
                        {
                          size: 24
                        }
                      ) }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("h4", { className: "font-bold text-slate-900 text-base leading-tight mb-1", children: item.name }),
                        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: item.category })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 flex-1 bg-slate-50/50 -mx-5 -mb-5 p-5 border-t border-slate-100 mt-auto", children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1", children: t("Overactive Muscles") }),
                        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-700 line-clamp-2 leading-relaxed", children: item.overactive_muscles || /* @__PURE__ */ jsx("span", { className: "text-slate-400 italic", children: "None specified" }) })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1", children: t("Underactive Muscles") }),
                        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-700 line-clamp-2 leading-relaxed", children: item.underactive_muscles || /* @__PURE__ */ jsx("span", { className: "text-slate-400 italic", children: "None specified" }) })
                      ] })
                    ] })
                  ]
                },
                item.id
              )) })
            ]
          },
          category
        );
      }) })
    ] })
  ] });
}
export {
  DpaIndex as default
};
