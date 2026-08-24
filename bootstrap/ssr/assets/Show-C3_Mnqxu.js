import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { useForm, Head, Link, router } from "@inertiajs/react";
import { Activity, ChevronLeft, Plus, Dumbbell, ShieldAlert, Target, Zap, FileText, History, Edit, Trash2 } from "lucide-react";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import AssessmentForm from "./AssessmentForm-Bgna4CbI.js";
import "axios";
function DpaShow({ auth, player, assessments, compensations }) {
  const t = (text) => text;
  const isAuthorized = auth?.user?.role === "superadmin" || auth?.user?.role === "coach";
  const isAthlete = auth?.user?.role === "athlete";
  const canCreate = isAuthorized;
  const canUpdate = isAuthorized;
  const canDelete = isAuthorized;
  const [activeTab, setActiveTab] = useState("analysis");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const { data, setData, post, put, processing, reset } = useForm({
    assessment_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    notes: "",
    compensations: []
  });
  const handleEdit = (item) => {
    setIsEditMode(true);
    setEditId(item.id);
    setData({
      assessment_date: item.assessment_date ? item.assessment_date.split("T")[0] : "",
      notes: item.notes || "",
      compensations: item.details.map((d) => d.dpa_compensation_id)
    });
    setActiveTab("input");
  };
  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus data evaluasi DPA ini?")) {
      router.delete(route("admin.athletes.dpa.destroy", id), { preserveScroll: true });
    }
  };
  const cancelEdit = () => {
    setIsEditMode(false);
    setEditId(null);
    reset();
    setActiveTab("analysis");
  };
  const submit = (e) => {
    e.preventDefault();
    const action = isEditMode ? put : post;
    const currentRoute = isEditMode ? route("admin.athletes.dpa.update", editId) : route("admin.athletes.dpa.store", player.id);
    action(currentRoute, {
      onSuccess: () => cancelEdit()
    });
  };
  const latest = assessments[0] || null;
  const analysis = useMemo(() => {
    if (!latest) return null;
    const comps = latest.details.map((d) => d.compensation).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
    const result = {
      compensations: comps,
      overactive: [],
      underactive: [],
      injuries: []
    };
    const addItems = (source, target) => {
      if (!source) return;
      const items = source.split(/[\n,]/).map((s) => s.trim().replace(/^-\s*/, "")).filter(Boolean);
      items.forEach((item) => {
        if (!target.includes(item)) target.push(item);
      });
    };
    comps.forEach((c) => {
      addItems(c.overactive_muscles, result.overactive);
      addItems(c.underactive_muscles, result.underactive);
      addItems(c.possible_injuries, result.injuries);
    });
    return result;
  }, [latest]);
  const splitItems = (str) => {
    if (!str) return [];
    return str.split(/[\n,]/).map((s) => s.trim().replace(/^-\s*/, "")).filter(Boolean);
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: `DPA - ${player.name}`, children: [
    /* @__PURE__ */ jsx(Head, { title: `DPA - ${player.name}` }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: `Analisis DPA ${player.name}`,
          subtitle: `Analisis detail tentang Dynamic Posture Assessment (DPA) untuk ${player.name}.`,
          badge: "Detail Evaluasi",
          icon: Activity,
          actions: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 w-full sm:w-auto", children: [
            !isAthlete && /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("admin.athletes.dpa.index"),
                className: "inline-flex flex-1 md:flex-none items-center justify-center rounded-xl text-sm font-bold transition-colors border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 h-10 px-5 shadow-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2",
                children: [
                  /* @__PURE__ */ jsx(ChevronLeft, { size: 16, className: "mr-1.5" }),
                  "Kembali"
                ]
              }
            ),
            isAuthorized && /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-auto h-10", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: cancelEdit,
                  className: `flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ease-out ${activeTab === "analysis" ? "bg-white text-orange-500 shadow-sm ring-1 ring-slate-900/5" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}`,
                  children: [
                    /* @__PURE__ */ jsx(Activity, { size: 16 }),
                    " ",
                    t("Analisis")
                  ]
                }
              ),
              canCreate && /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => {
                    setActiveTab("input");
                    setIsEditMode(false);
                    reset();
                  },
                  className: `flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ease-out ${activeTab === "input" && !isEditMode ? "bg-white text-orange-500 shadow-sm ring-1 ring-slate-900/5" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}`,
                  children: [
                    /* @__PURE__ */ jsx(Plus, { size: 16, strokeWidth: 3 }),
                    " ",
                    t("Input Evaluasi")
                  ]
                }
              )
            ] })
          ] })
        }
      ),
      activeTab === "analysis" && /* @__PURE__ */ jsx("div", { className: "space-y-8 animate-in fade-in duration-500", children: analysis ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "border-b border-slate-200 p-5 bg-slate-50 ", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-base font-bold text-slate-900 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Activity, { size: 18, className: "text-slate-500" }),
              " ",
              t("Profil Ketidakseimbangan Keseluruhan")
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-1", children: t("Agregasi otot dan risiko cedera dari semua kompensasi yang terdeteksi.") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 ", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600 ", children: /* @__PURE__ */ jsx(Activity, { size: 14 }) }),
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-slate-800 uppercase tracking-wide", children: t("Otot Overactive") })
              ] }),
              /* @__PURE__ */ jsxs("ul", { className: "space-y-2", children: [
                analysis.overactive.map((m, idx) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-sm text-slate-600 ", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" }),
                  m
                ] }, idx)),
                analysis.overactive.length === 0 && /* @__PURE__ */ jsx("span", { className: "text-slate-400 text-sm italic", children: t("Tidak ada") })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600 ", children: /* @__PURE__ */ jsx(Dumbbell, { size: 14 }) }),
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-slate-800 uppercase tracking-wide", children: t("Otot Underactive") })
              ] }),
              /* @__PURE__ */ jsxs("ul", { className: "space-y-2", children: [
                analysis.underactive.map((m, idx) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-sm text-slate-600 ", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" }),
                  m
                ] }, idx)),
                analysis.underactive.length === 0 && /* @__PURE__ */ jsx("span", { className: "text-slate-400 text-sm italic", children: t("Tidak ada") })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600 ", children: /* @__PURE__ */ jsx(ShieldAlert, { size: 14 }) }),
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-slate-800 uppercase tracking-wide", children: t("Risiko Cedera") })
              ] }),
              /* @__PURE__ */ jsxs("ul", { className: "space-y-2", children: [
                analysis.injuries.map((m, idx) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-sm text-slate-600 ", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" }),
                  m
                ] }, idx)),
                analysis.injuries.length === 0 && /* @__PURE__ */ jsx("span", { className: "text-slate-400 text-sm italic", children: t("Tidak ada") })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-base font-bold text-slate-900 flex items-center gap-2 px-2", children: [
            /* @__PURE__ */ jsx(Target, { size: 18, className: "text-slate-500" }),
            " ",
            t("Analisis Kompensasi Spesifik")
          ] }),
          analysis.compensations.map((comp, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 hover:border-orange-500 transition-colors rounded-2xl shadow-sm overflow-hidden group", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-slate-50 to-white p-5 border-b border-slate-100 flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full uppercase tracking-wider", children: comp.category }),
              /* @__PURE__ */ jsx("h4", { className: "text-lg font-bold text-slate-900 mt-2", children: comp.name })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "p-6 grid grid-cols-1 lg:grid-cols-12 gap-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-8", children: [
                comp.image_path && /* @__PURE__ */ jsx("div", { className: "bg-white border border-slate-200/80 rounded-xl p-2 shadow-sm", children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: `/storage/${comp.image_path}`,
                    alt: comp.name,
                    className: "w-full h-48 object-contain rounded-lg"
                  }
                ) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h5", { className: "text-[11px] font-bold text-slate-500 uppercase mb-3", children: t("Otot Overactive") }),
                  /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: splitItems(comp.overactive_muscles).map((m, i) => /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100", children: m }, i)) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h5", { className: "text-[11px] font-bold text-slate-500 uppercase mb-3", children: t("Otot Underactive") }),
                  /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: splitItems(comp.underactive_muscles).map((m, i) => /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100", children: m }, i)) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h5", { className: "text-[11px] font-bold text-slate-500 uppercase mb-3", children: t("Kemungkinan Cedera") }),
                  /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: splitItems(comp.possible_injuries).map((m, i) => /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100", children: m }, i)) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8 space-y-6", children: [
                /* @__PURE__ */ jsxs("h5", { className: "text-sm font-bold text-slate-900 mb-4 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Zap, { size: 16, className: "text-slate-500" }),
                  " ",
                  t("Latihan Korektif")
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "bg-slate-50/70 border border-slate-100 rounded-xl p-4 hover:border-slate-300 transition-colors", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                      /* @__PURE__ */ jsx("span", { className: "w-5 h-5 rounded bg-orange-100 text-orange-500 text-[10px] font-bold flex items-center justify-center", children: "1" }),
                      /* @__PURE__ */ jsx("h6", { className: "text-xs font-bold text-slate-800 uppercase", children: t("Fase 1: Inhibit (SMR)") })
                    ] }),
                    /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: splitItems(comp.exercises_smr).map((m, i) => /* @__PURE__ */ jsxs("li", { className: "text-sm text-slate-600 flex items-start gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-orange-500 font-bold mt-0.5", children: "•" }),
                      m
                    ] }, i)) }),
                    comp.image_smr && /* @__PURE__ */ jsx("img", { src: `/storage/${comp.image_smr}`, alt: "SMR", className: "mt-4 w-full h-auto object-contain rounded-lg border border-slate-200 " })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-slate-50/70 border border-slate-100 rounded-xl p-4 hover:border-slate-300 transition-colors", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                      /* @__PURE__ */ jsx("span", { className: "w-5 h-5 rounded bg-orange-100 text-orange-500 text-[10px] font-bold flex items-center justify-center", children: "2" }),
                      /* @__PURE__ */ jsx("h6", { className: "text-xs font-bold text-slate-800 uppercase", children: t("Fase 2: Lengthen (Peregangan)") })
                    ] }),
                    /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: splitItems(comp.exercises_stretching).map((m, i) => /* @__PURE__ */ jsxs("li", { className: "text-sm text-slate-600 flex items-start gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-orange-500 font-bold mt-0.5", children: "•" }),
                      m
                    ] }, i)) }),
                    comp.image_stretching && /* @__PURE__ */ jsx("img", { src: `/storage/${comp.image_stretching}`, alt: "Stretch", className: "mt-4 w-full h-auto object-contain rounded-lg border border-slate-200 " })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-slate-50/70 border border-slate-100 rounded-xl p-4 hover:border-slate-300 transition-colors", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                      /* @__PURE__ */ jsx("span", { className: "w-5 h-5 rounded bg-orange-100 text-orange-500 text-[10px] font-bold flex items-center justify-center", children: "3" }),
                      /* @__PURE__ */ jsx("h6", { className: "text-xs font-bold text-slate-800 uppercase", children: t("Fase 3: Activate") })
                    ] }),
                    /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: splitItems(comp.exercises_isometrics).map((m, i) => /* @__PURE__ */ jsxs("li", { className: "text-sm text-slate-600 flex items-start gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-orange-500 font-bold mt-0.5", children: "•" }),
                      m
                    ] }, i)) }),
                    comp.image_isometrics && /* @__PURE__ */ jsx("img", { src: `/storage/${comp.image_isometrics}`, alt: "Activate", className: "mt-4 w-full h-auto object-contain rounded-lg border border-slate-200 " })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-slate-50/70 border border-slate-100 rounded-xl p-4 hover:border-slate-300 transition-colors", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                      /* @__PURE__ */ jsx("span", { className: "w-5 h-5 rounded bg-orange-100 text-orange-500 text-[10px] font-bold flex items-center justify-center", children: "4" }),
                      /* @__PURE__ */ jsx("h6", { className: "text-xs font-bold text-slate-800 uppercase", children: t("Fase 4: Integrate") })
                    ] }),
                    /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: splitItems(comp.exercises_integrated).map((m, i) => /* @__PURE__ */ jsxs("li", { className: "text-sm text-slate-600 flex items-start gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-orange-500 font-bold mt-0.5", children: "•" }),
                      m
                    ] }, i)) }),
                    comp.image_integrated && /* @__PURE__ */ jsx("img", { src: `/storage/${comp.image_integrated}`, alt: "Integrate", className: "mt-4 w-full h-auto object-contain rounded-lg border border-slate-200 " })
                  ] })
                ] })
              ] })
            ] })
          ] }, idx)),
          analysis.compensations.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-10 text-center flex flex-col items-center justify-center bg-white border border-slate-200 rounded-2xl shadow-sm", children: [
            /* @__PURE__ */ jsx(Activity, { size: 32, className: "text-slate-300 mb-3" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-900 ", children: t("Tidak Ada Kompensasi") }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-1", children: t("Postur tubuh pemain sangat baik.") })
          ] })
        ] }),
        latest.notes && /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border border-slate-200 rounded-2xl shadow-sm p-6 mt-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 ", children: /* @__PURE__ */ jsx(FileText, { size: 14 }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-900 ", children: t("Catatan Klinis") })
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "text-sm text-slate-600 leading-relaxed pl-1 prose prose-slate max-w-none",
              dangerouslySetInnerHTML: { __html: latest.notes }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-8", children: [
          /* @__PURE__ */ jsx("div", { className: "p-5 border-b border-slate-200 bg-slate-50 ", children: /* @__PURE__ */ jsxs("h3", { className: "text-base font-bold text-slate-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(History, { size: 18, className: "text-slate-500" }),
            " ",
            t("Riwayat Evaluasi")
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "divide-y divide-slate-100 ", children: assessments.length > 0 ? assessments.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "p-4 md:px-6 flex items-center justify-between hover:bg-slate-50/50 hover:bg-orange-50 transition-colors group", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-900 ", children: new Date(item.assessment_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-slate-500 mt-0.5", children: [
                item.details.length,
                " Kompensasi terdeteksi"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity", children: [
              canUpdate && /* @__PURE__ */ jsx("button", { onClick: () => handleEdit(item), className: "p-2 bg-white text-slate-600 border border-slate-200 rounded-lg shadow-sm hover:text-slate-900 :text-white transition-colors", children: /* @__PURE__ */ jsx(Edit, { size: 14 }) }),
              canDelete && /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(item.id), className: "p-2 bg-white text-slate-600 border border-slate-200 rounded-lg shadow-sm hover:text-rose-600 :text-rose-500 transition-colors", children: /* @__PURE__ */ jsx(Trash2, { size: 14 }) })
            ] })
          ] }, idx)) : /* @__PURE__ */ jsxs("div", { className: "p-10 text-center flex flex-col items-center justify-center", children: [
            /* @__PURE__ */ jsx(History, { size: 24, className: "text-slate-300 mb-2" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-500 ", children: t("Belum ada riwayat evaluasi") })
          ] }) })
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "p-10 text-center flex flex-col items-center justify-center bg-white border border-slate-200 rounded-2xl shadow-sm h-full", children: [
        /* @__PURE__ */ jsx(Activity, { size: 32, className: "text-slate-300 mb-3" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-900 ", children: t("Tidak Ada Data Analisis") }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-1", children: t("Silakan tambahkan evaluasi DPA baru terlebih dahulu.") })
      ] }) }),
      activeTab === "input" && /* @__PURE__ */ jsx(
        AssessmentForm,
        {
          compensations,
          data,
          setData,
          submit,
          processing,
          isEditMode,
          cancelEdit
        }
      )
    ] })
  ] });
}
export {
  DpaShow as default
};
