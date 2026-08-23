import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { History, Calendar, Activity, ChevronUp, ChevronDown } from "lucide-react";
import { useState, Fragment as Fragment$1 } from "react";
import ExcelTable from "./ExcelTable-OKTj6rc-.js";
import "./CreatableExerciseInput-C3c2V_Jd.js";
function HistorySection({ historySessions, userName }) {
  const [openHistoryId, setOpenHistoryId] = useState(null);
  const toggleHistory = (id) => {
    setOpenHistoryId(openHistoryId === id ? null : id);
  };
  if (!historySessions || historySessions.length === 0) return null;
  const formatDate = (d) => new Date(d).toLocaleDateString("id-ID", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
  return /* @__PURE__ */ jsxs("div", { className: "mt-8 md:mt-16 border-t border-slate-200 pt-6 md:pt-10 w-full max-w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4 md:mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "p-2 md:p-2.5 bg-orange-50 rounded-xl text-orange-500", children: /* @__PURE__ */ jsx(History, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base md:text-xl font-bold text-slate-800 tracking-tight", children: "Riwayat Latihan" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs md:text-sm text-slate-500 font-medium", children: [
          "5 Sesi terakhir milik ",
          userName
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "md:hidden flex flex-col gap-3 w-full", children: historySessions.map((hist) => {
      const isOpen = openHistoryId === hist.id;
      return /* @__PURE__ */ jsxs("div", { className: `bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${isOpen ? "border-orange-500/30 ring-1 ring-orange-500/20" : "border-slate-200"}`, children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `p-4 flex flex-col gap-3 touch-manipulation cursor-pointer ${isOpen ? "bg-orange-50/10" : "bg-white"}`,
            onClick: () => toggleHistory(hist.id),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 font-bold text-slate-700 text-xs", children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5 text-slate-400" }),
                  " ",
                  formatDate(hist.date)
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-[9px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md border border-orange-100", children: [
                  "Sesi ",
                  hist.session_number
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-slate-400 font-bold flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(Activity, { className: "w-3 h-3" }),
                    " Program"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800 text-sm truncate max-w-[200px]", children: hist.training_type })
                ] }),
                /* @__PURE__ */ jsx("button", { className: `text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${isOpen ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"}`, children: isOpen ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(ChevronUp, { className: "w-3 h-3" }),
                  " Tutup"
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(ChevronDown, { className: "w-3 h-3" }),
                  " Detail"
                ] }) })
              ] })
            ]
          }
        ),
        isOpen && /* @__PURE__ */ jsx("div", { className: "border-t border-slate-100 bg-slate-50 overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "p-3", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-[9px] font-bold text-slate-400 mb-2 block", children: [
            "Isi Log Sesi ",
            hist.session_number,
            ":"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pointer-events-none opacity-90 overflow-x-auto custom-scrollbar w-full rounded-lg border border-slate-200", children: /* @__PURE__ */ jsx(
            ExcelTable,
            {
              data: { exercises: hist.exercises || [] },
              is_athlete: true,
              handleExChange: () => {
              },
              libExercises: [],
              handleAddNewExercise: () => {
              }
            }
          ) })
        ] }) })
      ] }, hist.id);
    }) }),
    /* @__PURE__ */ jsx("div", { className: "hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm w-full max-w-full", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto w-full custom-scrollbar max-w-full", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm whitespace-nowrap min-w-[500px]", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-bold", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Tanggal" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-center", children: "Sesi" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4", children: "Tipe Latihan" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Aksi" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: historySessions.map((hist) => /* @__PURE__ */ jsxs(Fragment$1, { children: [
        /* @__PURE__ */ jsxs(
          "tr",
          {
            className: `hover:bg-slate-50 transition-colors cursor-pointer ${openHistoryId === hist.id ? "bg-orange-50/30" : ""}`,
            onClick: () => toggleHistory(hist.id),
            children: [
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-bold text-slate-700", children: formatDate(hist.date) }),
              /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 text-center font-bold text-orange-500", children: [
                "Sesi ",
                hist.session_number
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-bold text-slate-800", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Activity, { className: "w-4 h-4 text-slate-400" }),
                " ",
                hist.training_type
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    toggleHistory(hist.id);
                  },
                  className: `text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ml-auto ${openHistoryId === hist.id ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
                  children: openHistoryId === hist.id ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(ChevronUp, { className: "w-4 h-4" }),
                    " Tutup"
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4" }),
                    " Buka Log"
                  ] })
                }
              ) })
            ]
          }
        ),
        openHistoryId === hist.id && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "4", className: "p-0 border-b border-slate-200 max-w-0", children: /* @__PURE__ */ jsxs("div", { className: "p-6 bg-slate-50 shadow-inner w-full overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-4 flex justify-between items-center min-w-max", children: /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-slate-500 flex items-center gap-2", children: [
            "Detail Log: Sesi ",
            hist.session_number
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "pointer-events-none opacity-90 overflow-x-auto w-full max-w-full custom-scrollbar rounded-xl border border-slate-200 bg-white", children: /* @__PURE__ */ jsx(
            ExcelTable,
            {
              data: { exercises: hist.exercises || [] },
              is_athlete: true,
              handleExChange: () => {
              },
              libExercises: [],
              handleAddNewExercise: () => {
              }
            }
          ) })
        ] }) }) })
      ] }, hist.id)) })
    ] }) }) })
  ] });
}
export {
  HistorySection as default
};
