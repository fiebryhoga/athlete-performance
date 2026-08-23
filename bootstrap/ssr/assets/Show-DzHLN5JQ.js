import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { ArrowLeft, Save, CalendarDays } from "lucide-react";
import { useState, useEffect } from "react";
import LogHeader from "./LogHeader-BEYoB0XB.js";
import ExcelTable from "./ExcelTable-OKTj6rc-.js";
import HistorySection from "./HistorySection-B35kOxB8.js";
import "axios";
import "./CreatableExerciseInput-C3c2V_Jd.js";
function Show({ session, exercisesList, nextSession, historySessions, is_athlete }) {
  const [libExercises, setLibExercises] = useState(exercisesList || []);
  const { data, setData, put, processing } = useForm({ exercises: session.exercises });
  useEffect(() => setLibExercises(exercisesList || []), [exercisesList]);
  const handleExChange = (index, field, value) => {
    const newEx = [...data.exercises];
    newEx[index][field] = value;
    setData("exercises", newEx);
  };
  const addNewRow = () => {
    const newRow = {
      id: null,
      exercise_name: "",
      notes: "",
      set_1_load: "",
      set_1_reps: "",
      set_2_load: "",
      set_2_reps: "",
      set_3_load: "",
      set_3_reps: "",
      set_4_load: "",
      set_4_reps: ""
    };
    setData("exercises", [...data.exercises, newRow]);
  };
  const removeRow = (index) => {
    const newExercises = [...data.exercises];
    newExercises.splice(index, 1);
    setData("exercises", newExercises);
  };
  const handleAddNewExercise = (newExerciseName) => {
    if (libExercises.find((e) => e.toLowerCase() === newExerciseName.toLowerCase())) return;
    setLibExercises([...libExercises, newExerciseName].sort());
    axios.post(route("admin.training-logs.exercises.store"), { name: newExerciseName }).catch((e) => console.error(e));
  };
  const handleDeleteExercise = (exerciseName) => {
    setLibExercises((prev) => prev.filter((item) => item !== exerciseName));
    axios.delete(route("admin.training-logs.exercises.destroy"), {
      data: { name: exerciseName }
    }).catch((err) => console.error("Gagal menghapus exercise", err));
  };
  const submit = (e) => {
    e.preventDefault();
    put(route("admin.training-logs.update", session.id));
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: `Training Log - ${session.training_type}`, children: [
    /* @__PURE__ */ jsx(Head, { title: `Log Latihan - ${session.user.name}` }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto pb-28 md:pb-12 w-full max-w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-4 w-full md:mt-0", children: [
        /* @__PURE__ */ jsxs(Link, { href: route("admin.training-logs.index"), className: "text-slate-500 hover:text-orange-500 flex items-center gap-2 font-bold text-xs md:text-sm transition-colors py-2 touch-manipulation", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 md:w-5 md:h-5" }),
          " Kembali ke Jadwal"
        ] }),
        !is_athlete && /* @__PURE__ */ jsxs("button", { onClick: submit, disabled: processing, className: "hidden md:flex bg-orange-500 text-white px-8 py-3 rounded-xl font-bold text-sm justify-center items-center gap-2 shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:scale-[1.02] transition-all", children: [
          processing ? /* @__PURE__ */ jsx("span", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-5 h-5" }),
          "Simpan Log Latihan"
        ] })
      ] }),
      nextSession && /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 p-4 md:p-5 rounded-xl md:rounded-2xl mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 shadow-sm w-full max-w-full relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -mr-10 -mt-10" }),
        /* @__PURE__ */ jsx("div", { className: "bg-white p-2.5 rounded-xl shadow-sm text-orange-500 shrink-0 relative z-10", children: /* @__PURE__ */ jsx(CalendarDays, { className: "w-5 h-5 md:w-6 md:h-6" }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 w-full relative z-10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-orange-500 mb-1", children: "Jadwal Berikutnya" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs md:text-sm text-slate-700 font-medium leading-relaxed break-words", children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold text-orange-600", children: nextSession.training_type }),
            " pada ",
            /* @__PURE__ */ jsx("span", { className: "font-bold text-orange-600 underline decoration-orange-200 underline-offset-2", children: new Date(nextSession.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) }),
            "."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(LogHeader, { session }),
      /* @__PURE__ */ jsx("div", { className: "mb-8 md:mb-12 z-20 relative w-full max-w-full", children: /* @__PURE__ */ jsx(
        ExcelTable,
        {
          data,
          is_athlete,
          handleExChange,
          libExercises,
          handleAddNewExercise,
          addNewRow,
          removeRow,
          onDeleteExercise: handleDeleteExercise
        }
      ) }),
      /* @__PURE__ */ jsx(
        HistorySection,
        {
          historySessions,
          userName: session.user.name
        }
      )
    ] }),
    !is_athlete && /* @__PURE__ */ jsx("div", { className: "md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] z-[80] animate-in slide-in-from-bottom-full duration-300", children: /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: submit,
        disabled: processing,
        className: "w-full bg-orange-500 text-white px-6 py-3.5 rounded-xl font-bold text-sm flex justify-center items-center gap-2 shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-all touch-manipulation disabled:opacity-70 disabled:cursor-not-allowed",
        children: [
          processing ? /* @__PURE__ */ jsx("span", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-5 h-5" }),
          "Simpan Semua Perubahan"
        ]
      }
    ) })
  ] });
}
export {
  Show as default
};
