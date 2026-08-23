import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Eraser, Lock, Check } from "lucide-react";
const STICKY_COLS = {
  drag: { left: 0, width: 30, minWidth: 30, maxWidth: 30, boxSizing: "border-box" },
  c1: { left: 30, width: 40, minWidth: 40, maxWidth: 40, boxSizing: "border-box" },
  c2: { left: 70, width: 50, minWidth: 50, maxWidth: 50, boxSizing: "border-box" },
  c3: { left: 120, width: 40, minWidth: 40, maxWidth: 40, boxSizing: "border-box" },
  c4: { left: 160, width: 180, minWidth: 180, maxWidth: 180, boxSizing: "border-box" },
  superHeader: { left: 0 }
};
function WellnessTableHeader({ actions }) {
  const [globalVals, setGlobalVals] = useState({});
  const wellnessCols = [
    { id: "quality_of_sleep", label: "Sleep Quality" },
    { id: "fatigue", label: "Fatigue" },
    { id: "muscle_soreness", label: "Muscle Soreness" },
    { id: "stress", label: "Stress" }
  ];
  const handleGlobalFill = (colId) => {
    const val = globalVals[colId];
    if (val !== void 0 && val !== "") {
      actions.fillColumn(colId, val);
      setGlobalVals((prev) => ({ ...prev, [colId]: "" }));
    }
  };
  const renderGlobalInput = (colId) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-1.5 px-0.5", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        placeholder: "Set All",
        value: globalVals[colId] || "",
        onChange: (e) => setGlobalVals((prev) => ({ ...prev, [colId]: e.target.value })),
        className: "w-full h-5 text-[9px] px-1 text-center border border-slate-200  focus:ring-1 focus:ring-slate-500 rounded bg-white  text-slate-900  placeholder-zinc-300  outline-none transition-colors"
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => handleGlobalFill(colId),
        className: "h-5 w-5 flex items-center justify-center bg-slate-800 text-slate-100   rounded hover:opacity-80 transition-opacity shrink-0",
        title: "Apply to All",
        children: /* @__PURE__ */ jsx(Check, { size: 10, strokeWidth: 4 })
      }
    )
  ] });
  return /* @__PURE__ */ jsxs("thead", { className: "bg-slate-50 ", children: [
    /* @__PURE__ */ jsxs("tr", { children: [
      /* @__PURE__ */ jsx("th", { colSpan: "5", style: STICKY_COLS.superHeader, className: "p-2 border-b sticky z-40 bg-slate-50  align-bottom border-r border-slate-200  shadow-[4px_0_12px_rgba(0,0,0,0.03)]", children: /* @__PURE__ */ jsx("div", { className: "flex font-bold text-slate-400  mb-1 ml-1 text-[9px]", children: "Athlete" }) }),
      /* @__PURE__ */ jsx("th", { colSpan: "4", className: "p-2 border-b-2 border-slate-300  text-center font-bold text-[9px] tracking-[0.2em] text-slate-800  bg-slate-100/50 ", children: "Wellness Metrics (1-7)" }),
      /* @__PURE__ */ jsx("th", { colSpan: "3", className: "p-2 border-b-2 border-slate-300  text-center font-bold text-[9px] tracking-[0.2em] text-slate-800  bg-slate-200/30  border-l", children: "AM Session" }),
      /* @__PURE__ */ jsx("th", { colSpan: "3", className: "p-2 border-b-2 border-slate-300  text-center font-bold text-[9px] tracking-[0.2em] text-slate-800  bg-slate-200/30  border-l", children: "PM Session" }),
      /* @__PURE__ */ jsx("th", { colSpan: "3", className: "p-2 border-b bg-slate-100/50  border-l border-slate-200 " }),
      /* @__PURE__ */ jsx("th", { className: "p-2 border-b border-slate-200 " })
    ] }),
    /* @__PURE__ */ jsxs("tr", { className: "bg-slate-50  [&>th]:border-b [&>th]:border-slate-200 ", children: [
      /* @__PURE__ */ jsx("th", { style: STICKY_COLS.drag, className: "p-2 sticky z-30 bg-slate-50 " }),
      /* @__PURE__ */ jsx("th", { style: STICKY_COLS.c1, className: "p-2 font-bold text-slate-500 text-[9px] sticky z-30 bg-slate-50  text-center border-r border-slate-200  align-top pt-3", children: "NO" }),
      /* @__PURE__ */ jsx("th", { style: STICKY_COLS.c2, className: "p-2 font-bold text-slate-500 text-[9px] sticky z-30 bg-slate-50 text-center border-r border-slate-200 align-top pt-3", children: "L/P" }),
      /* @__PURE__ */ jsx("th", { style: STICKY_COLS.c3, className: "p-2 font-bold text-slate-500 text-[9px] sticky z-30 bg-slate-50  text-center border-r border-slate-200  align-top pt-3", children: "NP" }),
      /* @__PURE__ */ jsx("th", { style: STICKY_COLS.c4, className: "p-2 font-bold text-slate-500 text-[9px] sticky z-30 bg-slate-50  shadow-[4px_0_12px_rgba(0,0,0,0.03)] border-r border-slate-200  align-top pt-3", children: "PLAYER NAME" }),
      wellnessCols.map((col) => /* @__PURE__ */ jsxs("th", { className: "p-2 font-bold text-[9px] text-center border-l border-slate-200  min-w-[70px] text-slate-700  align-top", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1 group/header cursor-default", children: [
          /* @__PURE__ */ jsx("span", { className: "truncate", children: col.label }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => actions.clearColumn(col.id, col.label), className: "text-slate-300  hover:text-slate-600  transition-colors shrink-0 opacity-0 group-hover/header:opacity-100", title: `Clear ${col.label}`, children: /* @__PURE__ */ jsx(Eraser, { size: 12, strokeWidth: 2.5 }) })
        ] }),
        renderGlobalInput(col.id)
      ] }, col.id)),
      /* @__PURE__ */ jsxs("th", { className: "p-2 font-bold text-[9px] text-center border-l border-slate-200  min-w-[65px] text-slate-700  bg-slate-100/30  align-top", children: [
        /* @__PURE__ */ jsx("div", { children: "RPE (1-10)" }),
        renderGlobalInput("am_rpe")
      ] }),
      /* @__PURE__ */ jsxs("th", { className: "p-2 font-bold text-[9px] text-center border-l border-slate-200  min-w-[65px] text-slate-700  bg-slate-100/30  align-top", children: [
        /* @__PURE__ */ jsx("div", { children: "Duration (Minute)" }),
        renderGlobalInput("am_duration")
      ] }),
      /* @__PURE__ */ jsx("th", { className: "p-2 font-bold text-[9px] text-center border-l border-slate-200  min-w-[60px] text-slate-500  bg-slate-100/30  align-top pt-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1", children: [
        /* @__PURE__ */ jsx(Lock, { size: 10, strokeWidth: 3 }),
        "LOAD"
      ] }) }),
      /* @__PURE__ */ jsxs("th", { className: "p-2 font-bold text-[9px] text-center border-l border-slate-200  min-w-[65px] text-slate-700  bg-slate-100/30  align-top", children: [
        /* @__PURE__ */ jsx("div", { children: "RPE (1-10)" }),
        renderGlobalInput("pm_rpe")
      ] }),
      /* @__PURE__ */ jsxs("th", { className: "p-2 font-bold text-[9px] text-center border-l border-slate-200  min-w-[65px] text-slate-700  bg-slate-100/30  align-top", children: [
        /* @__PURE__ */ jsx("div", { children: "Duration (Minute)" }),
        renderGlobalInput("pm_duration")
      ] }),
      /* @__PURE__ */ jsx("th", { className: "p-2 font-bold text-[9px] text-center border-l border-slate-200  min-w-[60px] text-slate-500  bg-slate-100/30  align-top pt-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1", children: [
        /* @__PURE__ */ jsx(Lock, { size: 10, strokeWidth: 3 }),
        "Load"
      ] }) }),
      /* @__PURE__ */ jsx("th", { className: "p-2 font-bold text-[9px] text-center border-l-2 border-slate-300  min-w-[70px] text-slate-800  bg-slate-100  align-top pt-3", children: "Daily Load" }),
      /* @__PURE__ */ jsx("th", { className: "p-2 font-bold text-[9px] text-center border-l border-slate-200  min-w-[70px] text-slate-900  bg-slate-200/50  align-top pt-3", children: "Daily Score" }),
      /* @__PURE__ */ jsx("th", { className: "p-2 font-bold text-[9px] text-center border-l border-slate-200  min-w-[70px] text-slate-900  bg-slate-300/50  align-top pt-3", children: "Weekly Score" }),
      /* @__PURE__ */ jsx("th", { className: "p-2 font-bold text-[9px] text-center border-l border-slate-200  min-w-[150px] text-slate-700  bg-slate-50  align-top pt-3", children: "Notes" }),
      /* @__PURE__ */ jsx("th", { className: "p-2 font-bold text-[9px] text-center border-l border-slate-200  text-slate-500 align-top pt-3", children: "Actions" })
    ] })
  ] });
}
export {
  WellnessTableHeader as default
};
