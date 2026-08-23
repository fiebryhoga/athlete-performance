import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { P as PageHeader } from "./PageHeader-BXFyVdi4.js";
import { P as PageFooter } from "./PageFooter-BbeHbnjC.js";
import { ArrowLeft, Save, MessageSquare, Target } from "lucide-react";
import "axios";
const ResultInput = ({ item, value, onChange }) => {
  const decimalTypes = [
    "second",
    "minute",
    "meter",
    "vo2max",
    "kg",
    "n",
    "n_kg",
    "percent",
    "watt",
    "degree"
  ];
  const isDecimal = decimalTypes.includes(item.parameter_type);
  const step = isDecimal ? "0.01" : "1";
  const placeholder = isDecimal ? "0.00" : "0";
  let displayValue = value;
  if (!isDecimal && value !== "" && value !== null && value !== void 0) {
    if (typeof value === "string" && value.endsWith(".00")) {
      displayValue = parseInt(value).toString();
    } else if (typeof value === "number") {
      displayValue = Math.floor(value).toString();
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-white via-white to-orange-50/20 p-3.5 rounded-lg border border-slate-200/80 shadow-2xs hover:border-orange-300/80 transition-all flex flex-col justify-between space-y-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsx("label", { className: "font-bold text-slate-800 text-xs leading-snug", children: item.name }),
      /* @__PURE__ */ jsxs("div", { className: "shrink-0 flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-white/90 px-1.5 py-0.5 rounded border border-slate-200/70 shadow-2xs", children: [
        /* @__PURE__ */ jsx(Target, { className: "w-2.5 h-2.5 text-orange-500" }),
        /* @__PURE__ */ jsxs("span", { children: [
          Number(item.target_value),
          " ",
          item.unit
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "number",
          step,
          min: "0",
          value: displayValue,
          onChange: (e) => onChange(e.target.value),
          className: "w-full pl-3 pr-11 py-1.5 bg-white border border-slate-200 rounded-md font-bold text-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-2xs text-xs",
          placeholder,
          onWheel: (e) => e.target.blur()
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400", children: item.unit }) })
    ] })
  ] });
};
function Edit({ test, categories = [] }) {
  const initialScores = categories.flatMap(
    (cat) => cat.test_items.map((item) => ({
      test_item_id: item.id,
      result_value: item.saved_result !== null ? item.saved_result : ""
    }))
  );
  const { data, setData, put, processing, isDirty } = useForm({
    scores: initialScores,
    notes: test.notes || ""
  });
  const handleValueChange = (itemId, val) => {
    const updatedScores = data.scores.map(
      (item) => item.test_item_id === itemId ? { ...item, result_value: val } : item
    );
    setData("scores", updatedScores);
  };
  const submit = (e) => {
    e.preventDefault();
    put(route("admin.performance.update", test.id));
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: `Input Nilai - ${test.name}`, children: [
    /* @__PURE__ */ jsx(Head, { title: `Input Nilai - ${test.name}` }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5 pb-4", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Input Nilai Tes Fisik",
          description: `Sesi: ${test.name} • Atlet: ${test.athlete?.name || "Atlet"} (${test.athlete?.sport?.name || "Umum"})`,
          actions: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2.5", children: [
            /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("admin.performance.index"),
                className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-md text-xs font-bold transition-all shadow-2xs",
                children: [
                  /* @__PURE__ */ jsx(ArrowLeft, { className: "w-3.5 h-3.5" }),
                  " Kembali"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "submit",
                disabled: processing,
                className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-white via-white to-orange-50/70 hover:to-orange-100/80 text-orange-600 hover:text-orange-700 border border-slate-200 hover:border-slate-300 rounded-md text-xs font-bold transition-all shadow-2xs disabled:opacity-60",
                children: [
                  /* @__PURE__ */ jsx(Save, { className: "w-3.5 h-3.5" }),
                  processing ? "Menyimpan..." : "Simpan Nilai"
                ]
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: categories.map((category) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white rounded-lg border border-slate-200/80 shadow-2xs overflow-hidden",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 bg-gradient-to-r from-white via-orange-50/20 to-white border-b border-slate-100 flex justify-between items-center", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 text-xs sm:text-sm", children: category.name }),
              /* @__PURE__ */ jsxs("span", { className: "text-[10.5px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60", children: [
                category.test_items.length,
                " Parameter"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5", children: category.test_items.map((item) => {
              const currentVal = data.scores.find(
                (s) => s.test_item_id === item.id
              )?.result_value;
              return /* @__PURE__ */ jsx(
                ResultInput,
                {
                  item,
                  value: currentVal,
                  onChange: (val) => handleValueChange(item.id, val)
                },
                item.id
              );
            }) })
          ]
        },
        category.id
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-white via-white to-orange-50/30 rounded-lg border border-slate-200/80 shadow-2xs p-4 sm:p-5 space-y-2.5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("h3", { className: "font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(MessageSquare, { className: "w-4 h-4 text-orange-500" }),
            "Catatan & Rekomendasi Pelatih"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-medium text-slate-400", children: [
            data.notes.length,
            " Karakter"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx(
          "textarea",
          {
            value: data.notes,
            onChange: (e) => setData("notes", e.target.value),
            className: "w-full rounded-md border border-slate-200 bg-white p-3 text-slate-800 min-h-[90px] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400 font-medium resize-y text-xs leading-relaxed outline-none shadow-2xs",
            placeholder: "Tuliskan evaluasi performa, catatan kekuatan, dan rekomendasi program latihan untuk atlet pada sesi ini..."
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx(PageFooter, { className: "!mt-6 !pt-4 !pb-1" })
    ] })
  ] });
}
export {
  Edit as default
};
