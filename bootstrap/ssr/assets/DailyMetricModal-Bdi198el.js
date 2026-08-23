import { jsxs, jsx } from "react/jsx-runtime";
import { X, Zap, Save } from "lucide-react";
function DailyMetricModal({ isOpen, onClose, form, submit, selectedDateLabel, formatDateToIndo }) {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity", onClick: onClose }),
    /* @__PURE__ */ jsxs("div", { className: "relative bg-white w-full max-w-md rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 shrink-0", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-base md:text-lg text-slate-800", children: "Input Data Harian" }),
          /* @__PURE__ */ jsxs("p", { className: "text-[10px] md:text-xs text-orange-500 font-bold mt-0.5", children: [
            selectedDateLabel,
            " • ",
            formatDateToIndo(form.data.record_date, "full")
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: onClose, className: "p-1.5 md:p-2 text-slate-400 hover:bg-orange-50 hover:text-orange-500 rounded-full transition-all touch-manipulation", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-y-auto custom-scrollbar flex-1", children: /* @__PURE__ */ jsxs("form", { id: "daily-metric-form", onSubmit: submit, className: "p-5 md:p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 md:gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-[9px] md:text-[10px] font-bold text-slate-500", children: [
              "Usia (Thn) ",
              /* @__PURE__ */ jsx("span", { className: "text-rose-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: "5",
                max: "100",
                required: true,
                value: form.data.age,
                onChange: (e) => form.setData("age", e.target.value),
                className: "w-full text-xs md:text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none",
                placeholder: "Cth: 22"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-[9px] md:text-[10px] font-bold text-slate-500", children: [
              "Weight / BB (Kg) ",
              /* @__PURE__ */ jsx("span", { className: "text-rose-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                step: "0.1",
                required: true,
                value: form.data.weight,
                onChange: (e) => form.setData("weight", e.target.value),
                className: "w-full text-xs md:text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none",
                placeholder: "Cth: 65.5"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-[9px] md:text-[10px] font-bold text-slate-500", children: [
              "RHR ",
              /* @__PURE__ */ jsx("span", { className: "text-rose-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                step: "0.1",
                required: true,
                value: form.data.rhr,
                onChange: (e) => form.setData("rhr", e.target.value),
                className: "w-full text-xs md:text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none",
                placeholder: "Cth: 60"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-[9px] md:text-[10px] font-bold text-slate-500", children: [
              "SpO2 (%) ",
              /* @__PURE__ */ jsx("span", { className: "text-rose-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                step: "0.1",
                required: true,
                value: form.data.spo2,
                onChange: (e) => form.setData("spo2", e.target.value),
                className: "w-full text-xs md:text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none",
                placeholder: "Cth: 98"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "col-span-2 space-y-1.5", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-[9px] md:text-[10px] font-bold text-slate-500", children: [
              "Vertical Jump (VJ) ",
              /* @__PURE__ */ jsx("span", { className: "text-rose-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                step: "0.01",
                required: true,
                value: form.data.vj,
                onChange: (e) => form.setData("vj", e.target.value),
                className: "w-full text-xs md:text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none",
                placeholder: "Cth: 55"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "col-span-2 space-y-1.5 mt-1", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[9px] md:text-[10px] font-bold text-slate-500", children: "Catatan Tambahan (Opsional)" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                rows: "2",
                value: form.data.notes,
                onChange: (e) => form.setData("notes", e.target.value),
                className: "w-full text-xs md:text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none outline-none",
                placeholder: "Cth: Tidur larut malam, otot agak pegal..."
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "bg-orange-50/80 p-3 md:p-4 rounded-xl md:rounded-2xl border border-orange-100 mt-5 md:mt-6", children: /* @__PURE__ */ jsxs("p", { className: "text-[10px] md:text-xs text-orange-700 font-medium leading-relaxed", children: [
          /* @__PURE__ */ jsxs("span", { className: "font-bold flex items-center gap-1.5 mb-1.5 text-orange-500", children: [
            /* @__PURE__ */ jsx(Zap, { className: "w-3.5 h-3.5 fill-current" }),
            " Auto-Calculate"
          ] }),
          "Sistem otomatis menghitung ",
          /* @__PURE__ */ jsx("b", { children: "VO2Max" }),
          " (menggunakan Usia), ",
          /* @__PURE__ */ jsx("b", { children: "Peak Power" }),
          ", dan ",
          /* @__PURE__ */ jsx("b", { children: "Status Recovery" }),
          "."
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 md:p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2 md:gap-3 shrink-0", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "flex-1 px-4 md:px-5 py-2.5 md:py-3 text-slate-500 font-bold text-xs md:text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors touch-manipulation", children: "Batal" }),
        /* @__PURE__ */ jsxs("button", { type: "submit", form: "daily-metric-form", disabled: form.processing, className: "flex-[2] px-5 md:px-6 py-2.5 md:py-3 bg-orange-500 text-white font-bold text-xs md:text-sm rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation", children: [
          form.processing ? /* @__PURE__ */ jsx("span", { className: "w-4 h-4 md:w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4 md:w-4" }),
          "Simpan Data"
        ] })
      ] })
    ] })
  ] });
}
export {
  DailyMetricModal as default
};
