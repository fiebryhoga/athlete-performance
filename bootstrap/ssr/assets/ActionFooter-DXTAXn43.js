import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import "react";
import "@inertiajs/react";
import { Check, CheckCircle, Save, Edit, X, ArrowRight } from "lucide-react";
function ActionFooter({
  isAthlete,
  isCompleted,
  recentlySuccessful,
  processing,
  onComplete,
  data,
  training,
  isEditingActuals,
  setIsEditingActuals
}) {
  const isLocked = isCompleted && !isEditingActuals;
  if (!isAthlete) {
    return /* @__PURE__ */ jsxs("div", { className: "sticky bottom-0 z-40 mt-8 p-4 sm:p-6 bg-white/80 backdrop-blur-xl border-t border-slate-200/60 flex justify-end items-center gap-3 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] rounded-t-2xl", children: [
      recentlySuccessful && /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-slate-500 flex justify-center items-center gap-1", children: [
        /* @__PURE__ */ jsx(Check, { size: 16, className: "text-green-500" }),
        " Tersimpan"
      ] }),
      isCompleted && /* @__PURE__ */ jsxs("span", { className: "flex justify-center items-center gap-2 px-6 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-bold border border-green-200", children: [
        /* @__PURE__ */ jsx(CheckCircle, { size: 16 }),
        " Program Selesai"
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "submit",
          disabled: processing,
          className: "flex justify-center items-center gap-2 px-6 py-2.5 bg-orange-500 text-white border border-transparent rounded-xl text-sm font-bold hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20 disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsx(Save, { size: 16 }),
            " Simpan Update RPE"
          ]
        }
      ),
      !isCompleted && /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          disabled: processing,
          onClick: onComplete,
          className: "flex justify-center items-center gap-2 px-6 py-2.5 bg-green-500 text-white border border-transparent rounded-xl text-sm font-bold hover:bg-green-600 transition-all shadow-md shadow-green-500/20 disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsx(CheckCircle, { size: 16 }),
            " Selesaikan Latihan"
          ]
        }
      )
    ] });
  }
  const hasSavedDraft = training?.status === "in_progress" || isCompleted;
  return /* @__PURE__ */ jsx("div", { className: "sticky bottom-0 z-40 mt-8 p-4 sm:p-6 bg-white/80 backdrop-blur-xl border-t border-slate-200/60 flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 sm:gap-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] rounded-t-2xl", children: isLocked ? /* @__PURE__ */ jsxs(Fragment, { children: [
    recentlySuccessful && /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-slate-500 flex justify-center items-center gap-1 mt-2 sm:mt-0", children: [
      /* @__PURE__ */ jsx(Check, { size: 16, className: "text-green-500" }),
      " Tersimpan"
    ] }),
    /* @__PURE__ */ jsxs("span", { className: "flex w-full sm:w-auto justify-center items-center gap-2 px-6 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-bold border border-green-200", children: [
      /* @__PURE__ */ jsx(CheckCircle, { size: 16 }),
      " Program Selesai"
    ] }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: (e) => {
          e.preventDefault();
          setIsEditingActuals(true);
        },
        className: "flex w-full sm:w-auto justify-center items-center gap-2 px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm",
        children: [
          /* @__PURE__ */ jsx(Edit, { size: 16 }),
          " Edit Hasil Latihan"
        ]
      }
    )
  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    recentlySuccessful && /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-slate-500 flex justify-center items-center gap-1 mt-2 sm:mt-0", children: [
      /* @__PURE__ */ jsx(Check, { size: 16, className: "text-green-500" }),
      " Draft Tersimpan"
    ] }),
    hasSavedDraft && isEditingActuals && /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: (e) => {
          e.preventDefault();
          setIsEditingActuals(false);
        },
        className: "flex w-full sm:w-auto justify-center items-center gap-2 px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm",
        children: [
          /* @__PURE__ */ jsx(X, { size: 16 }),
          " Batal Edit"
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "submit",
        disabled: processing,
        className: "flex w-full sm:w-auto justify-center items-center gap-2 px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50",
        children: [
          /* @__PURE__ */ jsx(Save, { size: 16 }),
          " Simpan Sebagai Draft"
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        disabled: processing,
        onClick: onComplete,
        className: "flex w-full sm:w-auto justify-center items-center gap-2 px-6 py-2.5 bg-orange-500 text-white border border-transparent rounded-xl text-sm font-bold hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20 disabled:opacity-50",
        children: [
          "Selesaikan Latihan ",
          /* @__PURE__ */ jsx(ArrowRight, { size: 16 })
        ]
      }
    )
  ] }) });
}
export {
  ActionFooter as default
};
