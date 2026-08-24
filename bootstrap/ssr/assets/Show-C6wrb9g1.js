import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { useForm, Head, Link, router } from "@inertiajs/react";
import { ArrowLeft, Info, Plus, Edit3, Trash2, Target, X, AlertCircle, Save, Timer, Ruler, Activity, Scale, Hash } from "lucide-react";
import { useState, useEffect } from "react";
import "axios";
const PARAM_CONFIG = {
  "points": {
    label: "Points (Score)",
    unit: "pts",
    step: "1",
    placeholder: "100",
    hint: "Integer value (1-100)"
  },
  "reps": {
    label: "Repetitions",
    unit: "reps",
    step: "1",
    placeholder: "50",
    hint: "Integer count"
  },
  "cm": {
    label: "Centimeters (cm)",
    unit: "cm",
    step: "1",
    placeholder: "120",
    hint: "Integer height/distance"
  },
  "second": {
    label: "Seconds (s)",
    unit: "s",
    step: "1",
    placeholder: "60",
    hint: "Total seconds (integer)"
  },
  "vo2max": {
    label: "VO2Max",
    unit: "ml/kg/min",
    step: "1",
    placeholder: "55",
    hint: "Integer value"
  },
  "meter": {
    label: "Meters (m)",
    unit: "m",
    step: "0.01",
    placeholder: "1.20",
    hint: "Use dot (.) for decimals"
  },
  "minute": {
    label: "Minutes (min)",
    unit: "min",
    step: "0.01",
    placeholder: "2.50",
    hint: "Use dot (.) for decimals"
  },
  "kg": {
    label: "Kilogram (kg)",
    unit: "kg",
    step: "0.1",
    placeholder: "50.0",
    hint: "Use dot (.) for decimals"
  },
  "n": {
    label: "Newton (N)",
    unit: "N",
    step: "0.1",
    placeholder: "100.0",
    hint: "Use dot (.) for decimals"
  },
  "n_kg": {
    label: "Newton per Kg (N/kg)",
    unit: "N/kg",
    step: "0.1",
    placeholder: "10.0",
    hint: "Use dot (.) for decimals"
  },
  "percent": {
    label: "Percentage (%)",
    unit: "%",
    step: "0.1",
    placeholder: "50.0",
    hint: "Use dot (.) for decimals"
  },
  "watt": {
    label: "Watt (W)",
    unit: "W",
    step: "0.1",
    placeholder: "300.0",
    hint: "Use dot (.) for decimals"
  },
  "degree": {
    label: "Derajat (°)",
    unit: "°",
    step: "0.1",
    placeholder: "90.0",
    hint: "Use dot (.) for decimals"
  }
};
function Show({ sport, categories }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm({
    category_id: "",
    name: "",
    parameter_type: "points",
    unit: "pts",
    target_value: "",
    is_lower_better: false
  });
  useEffect(() => {
    if (PARAM_CONFIG[data.parameter_type]) {
      setData("unit", PARAM_CONFIG[data.parameter_type].unit);
    }
  }, [data.parameter_type]);
  const openAddModal = (category) => {
    setModalMode("create");
    setSelectedCategory(category);
    clearErrors();
    reset();
    setData({
      category_id: category.id,
      name: "",
      parameter_type: "points",
      unit: "pts",
      target_value: "",
      is_lower_better: false
    });
    setIsModalOpen(true);
  };
  const openEditModal = (item, category) => {
    setModalMode("edit");
    setEditingItem(item);
    setSelectedCategory(category);
    clearErrors();
    setData({
      category_id: category.id,
      name: item.name,
      parameter_type: item.parameter_type,
      unit: item.unit,
      target_value: item.target_value,
      is_lower_better: Boolean(item.is_lower_better)
    });
    setIsModalOpen(true);
  };
  const submitForm = (e) => {
    e.preventDefault();
    if (modalMode === "create") {
      post(route("admin.sports.tests.store", sport.id), {
        onSuccess: () => setIsModalOpen(false)
      });
    } else {
      put(route("admin.tests.update", editingItem.id), {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };
  const deleteTest = (id) => {
    if (confirm("Are you sure? This will delete related performance data.")) {
      router.delete(route("admin.tests.destroy", id));
    }
  };
  const getParamIcon = (type) => {
    if (["second", "minute"].includes(type)) return /* @__PURE__ */ jsx(Timer, { className: "w-3.5 h-3.5 md:w-3 md:h-3" });
    if (["cm", "meter", "degree"].includes(type)) return /* @__PURE__ */ jsx(Ruler, { className: "w-3.5 h-3.5 md:w-3 md:h-3" });
    if (["vo2max", "watt", "percent"].includes(type)) return /* @__PURE__ */ jsx(Activity, { className: "w-3.5 h-3.5 md:w-3 md:h-3" });
    if (["reps", "points", "n", "n_kg", "kg"].includes(type)) return /* @__PURE__ */ jsx(Scale, { className: "w-3.5 h-3.5 md:w-3 md:h-3" });
    return /* @__PURE__ */ jsx(Hash, { className: "w-3.5 h-3.5 md:w-3 md:h-3" });
  };
  const activeConfig = PARAM_CONFIG[data.parameter_type] || PARAM_CONFIG["points"];
  return /* @__PURE__ */ jsxs(AppLayout, { title: `Manage: ${sport.name}`, children: [
    /* @__PURE__ */ jsx(Head, { title: sport.name }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[1400px] mx-auto pb-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 md:gap-6 mb-6 md:mb-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-auto", children: [
          /* @__PURE__ */ jsxs(Link, { href: route("admin.sports.index"), className: "inline-flex items-center text-[10px] md:text-xs font-bold text-slate-400 hover:text-orange-500 transition-colors mb-2 md:mb-3 group touch-manipulation py-1", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "w-3 h-3 md:w-4 md:h-4 mr-1.5 transition-transform group-hover:-translate-x-1" }),
            "Back to Sports"
          ] }),
          /* @__PURE__ */ jsxs("h1", { className: "text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2 flex-wrap", children: [
            sport.name,
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-slate-300 font-light hidden sm:inline", children: "|" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-xl md:text-3xl text-slate-600 sm:text-slate-800", children: "Configuration" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 font-medium text-xs md:text-sm mt-1.5", children: "Manage physical test items and performance benchmarks." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3 w-full lg:max-w-sm shadow-sm shrink-0", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-white rounded-lg text-orange-500 shadow-sm shrink-0", children: /* @__PURE__ */ jsx(Info, { className: "w-4 h-4 md:w-5 md:h-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] md:text-xs font-bold text-orange-900 mb-0.5", children: "Benchmark Info" }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] md:text-xs text-orange-800/80 font-medium leading-relaxed", children: "Set the standard target (100% score) for each test. Ensure the unit matches the parameter type." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6", children: categories.map((category) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full hover:shadow-md hover:border-orange-200 transition-all duration-300 overflow-hidden group", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50", children: [
          /* @__PURE__ */ jsxs("h3", { className: "font-bold text-slate-800 flex items-center gap-2 text-xs md:text-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-orange-500" }),
            category.name
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => openAddModal(category),
              className: "w-8 h-8 md:w-9 md:h-9 rounded-lg bg-white border border-slate-200 text-slate-400 hover:border-orange-500 hover:bg-orange-500 hover:text-white transition-all shadow-sm flex items-center justify-center touch-manipulation",
              title: "Add Item",
              children: /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 md:w-5 md:h-5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "p-4 md:p-5 flex-1 bg-white", children: category.test_items.length > 0 ? /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: category.test_items.map((test) => /* @__PURE__ */ jsxs("li", { className: "relative bg-white p-4 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 hover:shadow-sm transition-all group/item flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start gap-3", children: [
            /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-800 text-sm leading-tight flex-1", children: test.name }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 opacity-100 lg:opacity-0 lg:group-hover/item:opacity-100 transition-opacity bg-white/80 lg:bg-white pl-1 shrink-0", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => openEditModal(test, category),
                  className: "p-2 lg:p-1.5 text-slate-400 hover:text-amber-600 bg-slate-50 hover:bg-amber-50 rounded-lg transition-colors touch-manipulation",
                  title: "Edit Test",
                  children: /* @__PURE__ */ jsx(Edit3, { className: "w-3.5 h-3.5 md:w-4 md:h-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => deleteTest(test.id),
                  className: "p-2 lg:p-1.5 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-lg transition-colors touch-manipulation",
                  title: "Delete Test",
                  children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5 md:w-4 md:h-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] md:text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200", children: [
              getParamIcon(test.parameter_type),
              PARAM_CONFIG[test.parameter_type]?.label || test.parameter_type
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] md:text-[10px] font-bold bg-orange-50 text-orange-500 border border-orange-100", children: [
              /* @__PURE__ */ jsx(Target, { className: "w-3 h-3" }),
              "Target: ",
              Number(test.target_value),
              " ",
              test.unit
            ] })
          ] })
        ] }, test.id)) }) : /* @__PURE__ */ jsxs("div", { className: "h-full min-h-[150px] flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50", children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 bg-white rounded-full shadow-sm border border-slate-100 mb-3", children: /* @__PURE__ */ jsx(Target, { className: "w-5 h-5 md:w-6 md:h-6 text-slate-300" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] md:text-xs font-bold", children: "No Items Yet" })
        ] }) })
      ] }, category.id)) })
    ] }),
    isModalOpen && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity", onClick: () => setIsModalOpen(false) }),
      /* @__PURE__ */ jsxs("div", { className: "relative bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-base md:text-lg text-slate-800 flex items-center gap-2", children: modalMode === "create" ? "Add New Item" : "Edit Test Item" }),
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] md:text-xs text-slate-500 font-medium mt-0.5", children: [
              "Category: ",
              /* @__PURE__ */ jsx("span", { className: "text-orange-500 font-bold ml-1", children: selectedCategory?.name })
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setIsModalOpen(false), className: "p-2 text-slate-400 hover:text-rose-500 bg-white border border-slate-200 hover:bg-rose-50 rounded-full transition-all touch-manipulation", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4 md:w-5 md:h-5" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-y-auto custom-scrollbar flex-1", children: /* @__PURE__ */ jsxs("form", { onSubmit: submitForm, className: "p-5 md:p-6 space-y-5 md:space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 ml-1", children: "Item Name" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                className: "w-full px-4 py-3 md:py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm font-medium outline-none shadow-sm touch-manipulation",
                placeholder: "e.g. 100m Sprint",
                autoFocus: true
              }
            ),
            errors.name && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-[10px] md:text-xs font-bold ml-1", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 ml-1", children: "Parameter Type" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "select",
                {
                  value: data.parameter_type,
                  onChange: (e) => setData("parameter_type", e.target.value),
                  className: "w-full px-4 py-3 md:py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm font-medium appearance-none outline-none shadow-sm touch-manipulation",
                  children: Object.entries(PARAM_CONFIG).map(([key, config]) => /* @__PURE__ */ jsx("option", { value: key, children: config.label }, key))
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 -rotate-90" }) })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-[9px] md:text-[10px] font-bold text-slate-400 flex items-center gap-1.5 ml-1 mt-1.5", children: [
              /* @__PURE__ */ jsx(Info, { className: "w-3 h-3" }),
              "Auto Unit: ",
              /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded", children: activeConfig.unit })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-orange-50/50 p-4 md:p-5 rounded-xl border border-orange-100 space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-orange-500 ml-1", children: "Target Benchmark (100%)" }),
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(Target, { className: "h-4 w-4 md:h-5 md:w-5 text-orange-400 group-focus-within:text-orange-500 transition-colors" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  step: activeConfig.step,
                  value: data.target_value,
                  onChange: (e) => setData("target_value", e.target.value),
                  className: "w-full pl-11 pr-16 py-3.5 md:py-3 rounded-lg border border-orange-200 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm text-orange-500 font-bold placeholder-orange-200 outline-none shadow-sm touch-manipulation",
                  placeholder: activeConfig.placeholder
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx("span", { className: "text-[9px] md:text-[10px] font-bold text-orange-500 bg-orange-100 px-2 py-1 rounded-md", children: activeConfig.unit }) })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-[9px] md:text-[10px] text-slate-500 font-medium ml-1 flex items-center gap-1.5 mt-2", children: [
              /* @__PURE__ */ jsx(AlertCircle, { className: "w-3 h-3 text-amber-500 shrink-0" }),
              "Format: ",
              activeConfig.hint
            ] }),
            errors.target_value && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-[10px] md:text-xs font-bold ml-1", children: errors.target_value })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100/50 transition-colors", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative inline-flex items-center cursor-pointer shrink-0", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  className: "sr-only peer",
                  checked: data.is_lower_better,
                  onChange: (e) => setData("is_lower_better", e.target.checked)
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-800", children: "Semakin kecil nilai semakin bagus?" }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 mt-0.5 font-medium leading-tight", children: "Aktifkan jika parameter ini dinilai lebih baik saat nilainya lebih rendah (contoh: waktu tempuh, sprint)." })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 md:gap-3 pt-5 border-t border-slate-100", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setIsModalOpen(false),
                className: "flex-1 px-4 py-3 md:py-2.5 text-slate-500 bg-slate-100 border border-slate-200 font-bold text-xs md:text-sm hover:bg-slate-200 hover:text-slate-700 rounded-lg transition-colors touch-manipulation",
                children: "Batal"
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "submit",
                disabled: processing,
                className: "flex-[2] px-4 py-3 md:py-2.5 bg-orange-500 text-white font-bold text-xs md:text-sm rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 touch-manipulation",
                children: [
                  processing ? /* @__PURE__ */ jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
                  processing ? "Menyimpan..." : modalMode === "create" ? "Simpan Item" : "Update Item"
                ]
              }
            )
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  Show as default
};
