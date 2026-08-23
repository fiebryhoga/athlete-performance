import { jsxs, jsx } from "react/jsx-runtime";
import CreatableExerciseInput from "./CreatableExerciseInput-C3c2V_Jd.js";
import { Dumbbell, X, Plus } from "lucide-react";
import "react";
function ExcelTable({ data, is_athlete, handleExChange, libExercises, handleAddNewExercise, addNewRow, removeRow, onDeleteExercise }) {
  return /* @__PURE__ */ jsxs("div", { className: "w-full max-w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:hidden flex flex-col gap-4 w-full relative z-10", children: [
      data.exercises.length === 0 && /* @__PURE__ */ jsx("div", { className: "bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 font-medium italic shadow-sm", children: "Belum ada gerakan yang ditambahkan ke sesi ini." }),
      data.exercises.map((ex, i) => /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative overflow-visible", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-3", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-slate-400 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Dumbbell, { className: "w-3.5 h-3.5" }),
            " Gerakan ",
            i + 1
          ] }),
          !is_athlete && /* @__PURE__ */ jsx("button", { type: "button", onClick: () => removeRow(i), className: "text-rose-400 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 p-1.5 rounded-lg transition-colors touch-manipulation", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mb-4 border border-slate-200 rounded-xl bg-slate-50 relative", style: { zIndex: 50 - i }, children: /* @__PURE__ */ jsx(
          CreatableExerciseInput,
          {
            value: ex.exercise_name,
            options: libExercises,
            disabled: is_athlete,
            onChange: (val) => handleExChange(i, "exercise_name", val),
            onNewOption: handleAddNewExercise,
            onDeleteOption: onDeleteExercise
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-orange-50/50 border border-orange-100 rounded-xl p-2.5 shadow-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold text-orange-500 text-center mb-2", children: "SET 1" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[8px] text-slate-400 text-center mb-1 font-bold", children: "LOAD" }),
                /* @__PURE__ */ jsx("input", { disabled: is_athlete, type: "text", inputMode: "decimal", value: ex.set_1_load || "", onChange: (e) => handleExChange(i, "set_1_load", e.target.value), className: "w-full text-center text-xs p-2 rounded-lg border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none touch-manipulation bg-white min-w-0" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[8px] text-slate-400 text-center mb-1 font-bold", children: "REPS" }),
                /* @__PURE__ */ jsx("input", { disabled: is_athlete, type: "text", inputMode: "numeric", value: ex.set_1_reps || "", onChange: (e) => handleExChange(i, "set_1_reps", e.target.value), className: "w-full text-center text-xs font-bold text-orange-500 p-2 rounded-lg border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none touch-manipulation bg-white min-w-0" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border border-slate-200 rounded-xl p-2.5 shadow-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold text-slate-500 text-center mb-2", children: "SET 2" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[8px] text-slate-400 text-center mb-1 font-bold", children: "LOAD" }),
                /* @__PURE__ */ jsx("input", { disabled: is_athlete, type: "text", inputMode: "decimal", value: ex.set_2_load || "", onChange: (e) => handleExChange(i, "set_2_load", e.target.value), className: "w-full text-center text-xs p-2 rounded-lg border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none touch-manipulation bg-white min-w-0" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[8px] text-slate-400 text-center mb-1 font-bold", children: "REPS" }),
                /* @__PURE__ */ jsx("input", { disabled: is_athlete, type: "text", inputMode: "numeric", value: ex.set_2_reps || "", onChange: (e) => handleExChange(i, "set_2_reps", e.target.value), className: "w-full text-center text-xs font-bold text-orange-500 p-2 rounded-lg border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none touch-manipulation bg-white min-w-0" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-orange-50/50 border border-orange-100 rounded-xl p-2.5 shadow-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold text-orange-500 text-center mb-2", children: "SET 3" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[8px] text-slate-400 text-center mb-1 font-bold", children: "LOAD" }),
                /* @__PURE__ */ jsx("input", { disabled: is_athlete, type: "text", inputMode: "decimal", value: ex.set_3_load || "", onChange: (e) => handleExChange(i, "set_3_load", e.target.value), className: "w-full text-center text-xs p-2 rounded-lg border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none touch-manipulation bg-white min-w-0" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[8px] text-slate-400 text-center mb-1 font-bold", children: "REPS" }),
                /* @__PURE__ */ jsx("input", { disabled: is_athlete, type: "text", inputMode: "numeric", value: ex.set_3_reps || "", onChange: (e) => handleExChange(i, "set_3_reps", e.target.value), className: "w-full text-center text-xs font-bold text-orange-500 p-2 rounded-lg border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none touch-manipulation bg-white min-w-0" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border border-slate-200 rounded-xl p-2.5 shadow-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold text-slate-500 text-center mb-2", children: "SET 4" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[8px] text-slate-400 text-center mb-1 font-bold", children: "LOAD" }),
                /* @__PURE__ */ jsx("input", { disabled: is_athlete, type: "text", inputMode: "decimal", value: ex.set_4_load || "", onChange: (e) => handleExChange(i, "set_4_load", e.target.value), className: "w-full text-center text-xs p-2 rounded-lg border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none touch-manipulation bg-white min-w-0" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[8px] text-slate-400 text-center mb-1 font-bold", children: "REPS" }),
                /* @__PURE__ */ jsx("input", { disabled: is_athlete, type: "text", inputMode: "numeric", value: ex.set_4_reps || "", onChange: (e) => handleExChange(i, "set_4_reps", e.target.value), className: "w-full text-center text-xs font-bold text-orange-500 p-2 rounded-lg border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none touch-manipulation bg-white min-w-0" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "bg-slate-50 border border-slate-200 rounded-xl p-2", children: /* @__PURE__ */ jsx("input", { disabled: is_athlete, type: "text", placeholder: "Tambahkan catatan (opsional)...", value: ex.notes || "", onChange: (e) => handleExChange(i, "notes", e.target.value), className: "w-full text-xs p-2 bg-transparent outline-none italic text-slate-600 touch-manipulation placeholder-slate-400 min-w-0" }) })
      ] }, ex.id || `mob-${i}`)),
      !is_athlete && /* @__PURE__ */ jsxs("button", { type: "button", onClick: addNewRow, className: "flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-bold text-sm hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all w-full touch-manipulation mt-2 bg-white", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" }),
        " Tambah Gerakan Baru"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex bg-white border border-slate-300 rounded-3xl shadow-sm relative z-20 flex-col w-full max-w-full overflow-visible", children: [
      /* @__PURE__ */ jsx("div", { className: "w-full overflow-x-auto pb-20 relative rounded-lg", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[900px] table-fixed text-sm text-left border-collapse relative", children: [
        /* @__PURE__ */ jsxs("thead", { className: "bg-orange-500 text-white text-[11px] font-bold relative z-50", children: [
          /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { rowSpan: "2", className: "border-r border-b border-orange-700 px-3 py-3 text-center w-[25%] z-50", children: "EXERCISE" }),
            /* @__PURE__ */ jsx("th", { colSpan: "2", className: "border-r border-b border-orange-700 px-1 py-2 text-center bg-orange-800/40 w-[12%]", children: "SET 1" }),
            /* @__PURE__ */ jsx("th", { colSpan: "2", className: "border-r border-b border-orange-700 px-1 py-2 text-center w-[12%]", children: "SET 2" }),
            /* @__PURE__ */ jsx("th", { colSpan: "2", className: "border-r border-b border-orange-700 px-1 py-2 text-center bg-orange-800/40 w-[12%]", children: "SET 3" }),
            /* @__PURE__ */ jsx("th", { colSpan: "2", className: "border-r border-b border-orange-700 px-1 py-2 text-center w-[12%]", children: "SET 4" }),
            /* @__PURE__ */ jsx("th", { rowSpan: "2", className: "border-b border-orange-700 px-3 py-3 text-center w-[20%]", children: "NOTE" }),
            !is_athlete && /* @__PURE__ */ jsx("th", { rowSpan: "2", className: "bg-orange-950 border-l border-b border-orange-700 px-1 py-3 text-center w-[5%] z-50" })
          ] }),
          /* @__PURE__ */ jsxs("tr", { className: "bg-orange-900 text-[9px] relative z-40", children: [
            /* @__PURE__ */ jsx("th", { className: "border-r border-b border-orange-700 px-1 py-1.5 text-center w-[6%]", children: "LOAD" }),
            /* @__PURE__ */ jsx("th", { className: "border-r border-b border-orange-700 px-1 py-1.5 text-center w-[6%]", children: "REPS" }),
            /* @__PURE__ */ jsx("th", { className: "border-r border-b border-orange-700 px-1 py-1.5 text-center w-[6%]", children: "LOAD" }),
            /* @__PURE__ */ jsx("th", { className: "border-r border-b border-orange-700 px-1 py-1.5 text-center w-[6%]", children: "REPS" }),
            /* @__PURE__ */ jsx("th", { className: "border-r border-b border-orange-700 px-1 py-1.5 text-center w-[6%]", children: "LOAD" }),
            /* @__PURE__ */ jsx("th", { className: "border-r border-b border-orange-700 px-1 py-1.5 text-center w-[6%]", children: "REPS" }),
            /* @__PURE__ */ jsx("th", { className: "border-r border-b border-orange-700 px-1 py-1.5 text-center w-[6%]", children: "LOAD" }),
            /* @__PURE__ */ jsx("th", { className: "border-b border-orange-700 px-1 py-1.5 text-center w-[6%]", children: "REPS" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("tbody", { className: "relative z-30", children: [
          data.exercises.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: is_athlete ? 10 : 11, className: "py-12 text-center text-slate-400 font-medium italic border-b border-slate-200 bg-slate-50", children: "Belum ada gerakan yang ditambahkan ke sesi ini." }) }),
          data.exercises.map((ex, i) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-orange-50/30 group bg-white border-b border-slate-200 last:border-b-0", children: [
            /* @__PURE__ */ jsx("td", { className: "bg-white group-hover:bg-orange-50/50 border-r border-slate-200 p-0 relative", style: { zIndex: 100 - i }, children: /* @__PURE__ */ jsx(
              CreatableExerciseInput,
              {
                value: ex.exercise_name,
                options: libExercises,
                disabled: is_athlete,
                onChange: (val) => handleExChange(i, "exercise_name", val),
                onNewOption: handleAddNewExercise,
                onDeleteOption: onDeleteExercise
              }
            ) }),
            /* @__PURE__ */ jsx("td", { className: "border-r border-slate-200 p-0 bg-slate-50/50", children: /* @__PURE__ */ jsx("input", { disabled: is_athlete, type: "text", inputMode: "decimal", value: ex.set_1_load || "", onChange: (e) => handleExChange(i, "set_1_load", e.target.value), className: "w-full h-full min-h-[50px] border-none outline-none bg-transparent text-center px-1 py-4 focus:ring-2 focus:ring-inset focus:ring-orange-500 text-xs min-w-0" }) }),
            /* @__PURE__ */ jsx("td", { className: "border-r border-slate-200 p-0 bg-slate-50/50", children: /* @__PURE__ */ jsx("input", { disabled: is_athlete, type: "text", inputMode: "numeric", value: ex.set_1_reps || "", onChange: (e) => handleExChange(i, "set_1_reps", e.target.value), className: "w-full h-full min-h-[50px] border-none outline-none bg-transparent text-center px-1 py-4 font-medium text-orange-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 text-xs min-w-0" }) }),
            /* @__PURE__ */ jsx("td", { className: "border-r border-slate-200 p-0", children: /* @__PURE__ */ jsx("input", { disabled: is_athlete, type: "text", inputMode: "decimal", value: ex.set_2_load || "", onChange: (e) => handleExChange(i, "set_2_load", e.target.value), className: "w-full h-full min-h-[50px] border-none outline-none bg-transparent text-center px-1 py-4 focus:ring-2 focus:ring-inset focus:ring-orange-500 text-xs min-w-0" }) }),
            /* @__PURE__ */ jsx("td", { className: "border-r border-slate-200 p-0", children: /* @__PURE__ */ jsx("input", { disabled: is_athlete, type: "text", inputMode: "numeric", value: ex.set_2_reps || "", onChange: (e) => handleExChange(i, "set_2_reps", e.target.value), className: "w-full h-full min-h-[50px] border-none outline-none bg-transparent text-center px-1 py-4 font-medium text-orange-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 text-xs min-w-0" }) }),
            /* @__PURE__ */ jsx("td", { className: "border-r border-slate-200 p-0 bg-slate-50/50", children: /* @__PURE__ */ jsx("input", { disabled: is_athlete, type: "text", inputMode: "decimal", value: ex.set_3_load || "", onChange: (e) => handleExChange(i, "set_3_load", e.target.value), className: "w-full h-full min-h-[50px] border-none outline-none bg-transparent text-center px-1 py-4 focus:ring-2 focus:ring-inset focus:ring-orange-500 text-xs min-w-0" }) }),
            /* @__PURE__ */ jsx("td", { className: "border-r border-slate-200 p-0 bg-slate-50/50", children: /* @__PURE__ */ jsx("input", { disabled: is_athlete, type: "text", inputMode: "numeric", value: ex.set_3_reps || "", onChange: (e) => handleExChange(i, "set_3_reps", e.target.value), className: "w-full h-full min-h-[50px] border-none outline-none bg-transparent text-center px-1 py-4 font-medium text-orange-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 text-xs min-w-0" }) }),
            /* @__PURE__ */ jsx("td", { className: "border-r border-slate-200 p-0", children: /* @__PURE__ */ jsx("input", { disabled: is_athlete, type: "text", inputMode: "decimal", value: ex.set_4_load || "", onChange: (e) => handleExChange(i, "set_4_load", e.target.value), className: "w-full h-full min-h-[50px] border-none outline-none bg-transparent text-center px-1 py-4 focus:ring-2 focus:ring-inset focus:ring-orange-500 text-xs min-w-0" }) }),
            /* @__PURE__ */ jsx("td", { className: "border-r border-slate-200 p-0", children: /* @__PURE__ */ jsx("input", { disabled: is_athlete, type: "text", inputMode: "numeric", value: ex.set_4_reps || "", onChange: (e) => handleExChange(i, "set_4_reps", e.target.value), className: "w-full h-full min-h-[50px] border-none outline-none bg-transparent text-center px-1 py-4 font-medium text-orange-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 text-xs min-w-0" }) }),
            /* @__PURE__ */ jsx("td", { className: "p-0", children: /* @__PURE__ */ jsx("input", { disabled: is_athlete, type: "text", placeholder: "...", value: ex.notes || "", onChange: (e) => handleExChange(i, "notes", e.target.value), className: "w-full h-full min-h-[50px] border-none outline-none bg-transparent text-xs px-3 py-4 italic text-slate-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 min-w-0" }) }),
            !is_athlete && /* @__PURE__ */ jsx("td", { className: "bg-slate-50 group-hover:bg-orange-50/80 border-l border-slate-200 p-0 text-center relative z-10", children: /* @__PURE__ */ jsx("button", { type: "button", onClick: () => removeRow(i), className: "text-rose-400 hover:text-rose-600 hover:bg-rose-100 p-4 w-full h-full min-h-[50px] flex items-center justify-center transition-colors mx-auto", title: "Hapus Baris", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5 font-bold" }) }) })
          ] }, ex.id || `desk-${i}`))
        ] })
      ] }) }),
      !is_athlete && /* @__PURE__ */ jsx("div", { className: "bg-slate-50 border-t border-slate-200 p-4 flex justify-center shrink-0 absolute bottom-0 left-0 right-0 z-[20] rounded-b-3xl", children: /* @__PURE__ */ jsxs("button", { type: "button", onClick: addNewRow, className: "flex items-center justify-center gap-2 px-8 py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-bold text-sm hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all min-w-[300px]", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" }),
        " Tambah Gerakan Baru"
      ] }) })
    ] })
  ] });
}
export {
  ExcelTable as default
};
