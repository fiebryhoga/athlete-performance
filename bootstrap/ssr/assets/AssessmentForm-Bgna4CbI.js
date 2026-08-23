import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { Edit, History, X, Save } from "lucide-react";
function AssessmentForm({
  compensations,
  data,
  setData,
  submit,
  processing,
  isEditMode,
  cancelEdit
}) {
  const t = (text) => text;
  const categories = [
    "Posterior View",
    "Lateral View",
    "Anterior View",
    "Single Leg"
  ];
  const handleCheckboxChange = (compensationId) => {
    const selected = data.compensations || [];
    if (selected.includes(compensationId)) {
      setData(
        "compensations",
        selected.filter((id) => id !== compensationId)
      );
    } else {
      setData("compensations", [...selected, compensationId]);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "animate-in fade-in slide-in-from-bottom-4 duration-500", children: /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: submit,
      className: "bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300 flex flex-col",
      children: [
        /* @__PURE__ */ jsx("div", { className: "p-5 md:p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-5", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 mb-1.5", children: [
            /* @__PURE__ */ jsx("div", { className: "p-1.5 rounded-md bg-orange-500 text-slate-50 shadow-sm", children: isEditMode ? /* @__PURE__ */ jsx(Edit, { size: 16, strokeWidth: 2.5 }) : /* @__PURE__ */ jsx(History, { size: 16, strokeWidth: 2.5 }) }),
            /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2", children: [
              isEditMode ? "Perbarui Data DPA" : "Evaluasi DPA Baru",
              isEditMode && /* @__PURE__ */ jsx("span", { className: "px-2 py-0.2 rounded-lg bg-slate-200 text-[10px] font-bold text-slate-600 ", children: t("Mode Edit") })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 ", children: "Centang semua kompensasi gerakan yang diamati pada atlet." })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 md:p-6 space-y-8", children: [
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-5", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2 max-w-sm", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-xs font-semibold text-slate-900 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(History, { size: 14, className: "text-slate-500" }),
              " ",
              t("Tanggal Evaluasi")
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: data.assessment_date,
                onChange: (e) => setData("assessment_date", e.target.value),
                className: "flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm text-slate-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 :ring-slate-300 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "space-y-6", children: categories.map((category) => {
            const categoryItems = compensations.filter(
              (c) => c.category === category
            );
            if (categoryItems.length === 0) return null;
            return /* @__PURE__ */ jsxs(
              "div",
              {
                className: "bg-slate-50 border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "mb-4 border-b border-slate-200 pb-2", children: /* @__PURE__ */ jsx("h5", { className: "font-bold text-slate-900 text-lg", children: category }) }),
                  /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: categoryItems.map((comp) => {
                    const isChecked = data.compensations.includes(
                      comp.id
                    );
                    return /* @__PURE__ */ jsxs(
                      "label",
                      {
                        className: `flex flex-col border rounded-xl overflow-hidden cursor-pointer transition-all ${isChecked ? "border-slate-900 ring-1 ring-slate-900 bg-slate-50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50 :bg-orange-500/30"}`,
                        children: [
                          comp.image_path ? /* @__PURE__ */ jsx("div", { className: "w-full h-36 bg-white border-b border-slate-100 p-2 flex items-center justify-center", children: /* @__PURE__ */ jsx(
                            "img",
                            {
                              src: `/storage/${comp.image_path}`,
                              alt: comp.name,
                              className: "w-full h-full object-contain rounded-lg"
                            }
                          ) }) : /* @__PURE__ */ jsxs("div", { className: "w-full h-36 bg-slate-50 border-b border-slate-100 flex flex-col items-center justify-center text-slate-400 ", children: [
                            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase", children: comp.name.substring(
                              0,
                              2
                            ) }) }),
                            /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase font-bold tracking-wider", children: t("Tanpa Gambar") })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "p-4 flex items-start gap-3 flex-1", children: [
                            /* @__PURE__ */ jsx("div", { className: "mt-0.5", children: /* @__PURE__ */ jsx(
                              "input",
                              {
                                type: "checkbox",
                                className: "rounded text-slate-900 focus:ring-slate-900 :ring-slate-100 w-4 h-4 bg-white border-slate-300 ",
                                checked: isChecked,
                                onChange: () => handleCheckboxChange(
                                  comp.id
                                )
                              }
                            ) }),
                            /* @__PURE__ */ jsx("div", { className: "flex flex-col flex-1 mt-1.5", children: /* @__PURE__ */ jsx("span", { className: "font-bold text-sm text-slate-900 leading-snug", children: comp.name }) })
                          ] })
                        ]
                      },
                      comp.id
                    );
                  }) })
                ]
              },
              category
            );
          }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-slate-900 ", children: t("Observasi & Catatan Tambahan") }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: data.notes || "",
                onChange: (e) => setData("notes", e.target.value),
                rows: "3",
                className: "flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 :text-slate-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 :ring-slate-300 resize-y",
                placeholder: t("Catat kompensasi gerakan atau keluhan nyeri...")
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 border-t border-slate-200 bg-slate-50/50 flex flex-col-reverse md:flex-row justify-end items-center gap-3 mt-auto", children: [
          isEditMode && /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: cancelEdit,
              className: "w-full md:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 :ring-slate-300 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-100 :bg-slate-800 text-slate-900 h-9 px-4 py-2 gap-2 shadow-sm",
              children: [
                /* @__PURE__ */ jsx(X, { size: 16 }),
                " ",
                t("Batal Ubah")
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "w-full md:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 :ring-slate-300 disabled:pointer-events-none disabled:opacity-50 bg-orange-500 text-slate-50 hover:bg-orange-500/90 :bg-slate-50/90 shadow h-9 px-6 py-2 gap-2",
              children: [
                /* @__PURE__ */ jsx(Save, { size: 16 }),
                isEditMode ? t("Perbarui Data") : t("Simpan Evaluasi")
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
export {
  AssessmentForm as default
};
