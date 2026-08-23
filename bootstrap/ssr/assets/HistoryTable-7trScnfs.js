import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Activity, Zap, Eye, Plus, Edit3, X, HeartPulse, FileText } from "lucide-react";
import { useState } from "react";
function HistoryTable({ dailyHistory, formatDateToIndo, openModal, isAthlete }) {
  const totalActiveDays = dailyHistory?.filter((i) => i.data && i.data.recovery_status !== "KOSONG").length || 0;
  const [detailItem, setDetailItem] = useState(null);
  const getRecoveryColors = (status) => {
    if (status === "RECOVERY BAIK") return {
      border: "border-emerald-100",
      bg: "bg-emerald-50",
      text: "text-emerald-500"
    };
    if (status === "RECOVERY CUKUP") return {
      border: "border-amber-100",
      bg: "bg-amber-50",
      text: "text-amber-500"
    };
    if (status === "RECOVERY KURANG") return {
      border: "border-red-100",
      bg: "bg-red-50",
      text: "text-red-500"
    };
    return {
      border: "border-slate-100",
      bg: "bg-slate-50",
      text: "text-slate-400"
    };
  };
  return /* @__PURE__ */ jsxs("div", { className: "w-full bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-4 md:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3", children: [
      /* @__PURE__ */ jsxs("h3", { className: "font-bold text-slate-800 flex items-center gap-2 text-base md:text-lg", children: [
        /* @__PURE__ */ jsx(Activity, { className: "w-4 h-4 md:w-5 md:h-5 text-orange-500" }),
        " Kalender Metrik Harian"
      ] }),
      totalActiveDays > 0 && /* @__PURE__ */ jsxs("p", { className: "text-xs md:text-sm text-slate-500 font-medium", children: [
        "Total Data: ",
        totalActiveDays,
        " Hari Aktif"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto w-full", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm whitespace-nowrap", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-white border-b border-slate-100 text-slate-500 text-[9px] md:text-[10px] font-bold", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-3 md:px-4 py-4", children: "Waktu (WIB)" }),
        /* @__PURE__ */ jsx("th", { className: "hidden md:table-cell px-3 md:px-4 py-4 text-center", children: "RHR" }),
        /* @__PURE__ */ jsx("th", { className: "hidden md:table-cell px-3 md:px-4 py-4 text-center", children: "SpO2" }),
        /* @__PURE__ */ jsx("th", { className: "hidden lg:table-cell px-3 md:px-4 py-4 text-center text-orange-500", children: "Peak Power" }),
        /* @__PURE__ */ jsx("th", { className: "px-3 md:px-4 py-4 text-center", children: "Recovery" }),
        /* @__PURE__ */ jsx("th", { className: "hidden xl:table-cell px-3 md:px-4 py-4", children: "Catatan" }),
        /* @__PURE__ */ jsx("th", { className: "px-3 md:px-4 py-4 text-right", children: "Aksi" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: dailyHistory && dailyHistory.length > 0 ? dailyHistory.map((item, index) => /* @__PURE__ */ jsxs("tr", { className: `hover:bg-slate-50 transition-colors ${item.is_today ? "bg-orange-50/40" : ""}`, children: [
        /* @__PURE__ */ jsxs("td", { className: "px-3 md:px-4 py-3 align-middle", children: [
          /* @__PURE__ */ jsxs("div", { className: "font-bold text-slate-800 flex items-center gap-2 text-xs md:text-sm", children: [
            formatDateToIndo(item.record_date, "short"),
            item.is_today && /* @__PURE__ */ jsx("span", { className: "text-[8px] md:text-[9px] bg-orange-500 text-white px-1.5 md:px-2 py-0.5 rounded-md shadow-sm", children: "Hari Ini" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-[10px] md:text-[11px] text-orange-500 font-bold mt-0.5", children: item.week_label })
        ] }),
        /* @__PURE__ */ jsx("td", { className: "hidden md:table-cell px-3 md:px-4 py-3 text-center font-bold text-slate-700 text-xs md:text-sm", children: item.data?.recovery_status === "KOSONG" ? /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "-" }) : item.data?.rhr }),
        /* @__PURE__ */ jsx("td", { className: "hidden md:table-cell px-3 md:px-4 py-3 text-center font-bold text-slate-700 text-xs md:text-sm", children: item.data?.recovery_status === "KOSONG" ? /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "-" }) : `${item.data?.spo2}%` }),
        /* @__PURE__ */ jsx("td", { className: "hidden lg:table-cell px-3 md:px-4 py-3 text-center font-bold text-slate-800 text-xs md:text-sm bg-slate-50/50", children: item.data?.recovery_status === "KOSONG" ? /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "-" }) : /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-center gap-1", children: [
          Number(item.data?.peak_power).toLocaleString("id-ID", { minimumFractionDigits: 0 }),
          " ",
          /* @__PURE__ */ jsx(Zap, { className: "w-3 md:w-3.5 h-3 md:h-3.5 text-amber-500" })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-3 md:px-4 py-3 text-center align-middle", children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center gap-1.5 px-2 md:px-3 py-1.5 text-[9px] md:text-[10px] font-bold rounded-xl border shadow-sm ${item.data?.recovery_status === "RECOVERY BAIK" ? "bg-green-50 text-green-700 border-green-200" : item.data?.recovery_status === "RECOVERY CUKUP" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : item.data?.recovery_status === "RECOVERY KURANG" ? "bg-red-50 text-red-700 border-red-200" : "bg-slate-100 text-slate-400 border-slate-200 shadow-none"}`, children: item.data?.recovery_status === "KOSONG" ? "LIBUR / KOSONG" : /* @__PURE__ */ jsxs(Fragment, { children: [
          item.data?.quick_recovery_score,
          "% ",
          /* @__PURE__ */ jsx("span", { className: "hidden md:inline w-1 h-1 rounded-full bg-current opacity-50" }),
          " ",
          /* @__PURE__ */ jsx("span", { className: "hidden md:inline", children: item.data?.recovery_status })
        ] }) }) }),
        /* @__PURE__ */ jsx("td", { className: "hidden xl:table-cell px-3 md:px-4 py-3 align-middle", children: item.data?.recovery_status !== "KOSONG" && item.data?.notes ? /* @__PURE__ */ jsx("div", { className: "max-w-[150px] truncate text-[11px] text-slate-500 italic bg-slate-100 px-2 py-1 rounded border border-slate-200", title: item.data.notes, children: item.data.notes }) : /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "-" }) }),
        /* @__PURE__ */ jsx("td", { className: "px-3 md:px-4 py-3 text-right align-middle", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1 md:gap-2", children: [
          item.data?.recovery_status !== "KOSONG" && /* @__PURE__ */ jsx("button", { onClick: () => setDetailItem(item), className: "p-1.5 md:p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-200", title: "Lihat Detail Lengkap", children: /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4 md:w-4 md:h-4" }) }),
          !isAthlete && /* @__PURE__ */ jsx("button", { onClick: () => openModal(item), className: `flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs font-bold px-2 md:px-3 py-1.5 md:py-1.5 rounded-xl shadow-sm transition-all whitespace-nowrap ${item.data?.recovery_status === "KOSONG" ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-white border border-slate-200 text-slate-500 hover:text-orange-500 hover:bg-orange-50"}`, children: item.data?.recovery_status === "KOSONG" ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3" }),
            " Isi Data"
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Edit3, { className: "w-3 h-3" }),
            " Edit"
          ] }) })
        ] }) })
      ] }, index)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: isAthlete ? "5" : "7", className: "text-center py-16 text-slate-500 text-xs md:text-sm", children: "Belum ada data monitoring." }) }) })
    ] }) }),
    detailItem && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[70] flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity", onClick: () => setDetailItem(null) }),
      /* @__PURE__ */ jsxs("div", { className: "relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-orange-100 text-orange-500 rounded-xl", children: /* @__PURE__ */ jsx(Activity, { className: "w-4 h-4 md:w-5 md:h-5" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-base md:text-lg text-slate-800 leading-tight", children: "Detail Metrik Harian" }),
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] md:text-xs font-medium text-slate-500 mt-0.5", children: [
                formatDateToIndo(detailItem.record_date, "full"),
                " • ",
                detailItem.week_label
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setDetailItem(null), className: "p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-all", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 md:p-6 max-h-[80vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mb-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 md:p-4 rounded-2xl border border-slate-100", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[9px] md:text-[10px] font-bold text-slate-400 mb-1", children: "RHR" }),
              /* @__PURE__ */ jsxs("p", { className: "font-bold text-slate-800 text-lg md:text-xl", children: [
                detailItem.data?.rhr,
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-[10px] md:text-xs font-medium text-slate-500", children: "bpm" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 md:p-4 rounded-2xl border border-slate-100", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[9px] md:text-[10px] font-bold text-slate-400 mb-1", children: "SpO2" }),
              /* @__PURE__ */ jsxs("p", { className: "font-bold text-slate-800 text-lg md:text-xl", children: [
                detailItem.data?.spo2,
                /* @__PURE__ */ jsx("span", { className: "text-[10px] md:text-xs font-medium text-slate-500", children: "%" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 md:p-4 rounded-2xl border border-slate-100", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[9px] md:text-[10px] font-bold text-slate-400 mb-1", children: "Berat Badan" }),
              /* @__PURE__ */ jsxs("p", { className: "font-bold text-slate-800 text-lg md:text-xl", children: [
                detailItem.data?.weight,
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-[10px] md:text-xs font-medium text-slate-500", children: "kg" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 md:p-4 rounded-2xl border border-slate-100", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[9px] md:text-[10px] font-bold text-slate-400 mb-1", children: "Vertical Jump" }),
              /* @__PURE__ */ jsxs("p", { className: "font-bold text-slate-800 text-lg md:text-xl", children: [
                detailItem.data?.vj,
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-[10px] md:text-xs font-medium text-slate-500", children: "cm" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-orange-50 p-3 md:p-4 rounded-2xl border border-orange-100", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[9px] md:text-[10px] font-bold text-orange-500 mb-1", children: "VO2Max" }),
              /* @__PURE__ */ jsx("p", { className: "font-bold text-orange-600 text-lg md:text-xl", children: Number(detailItem.data?.vo2_max).toLocaleString("id-ID", { minimumFractionDigits: 2 }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-amber-50 p-3 md:p-4 rounded-2xl border border-amber-100", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-[9px] md:text-[10px] font-bold text-amber-500 mb-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Zap, { className: "w-3 h-3" }),
                " Power"
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "font-bold text-amber-700 text-lg md:text-xl", children: [
                Number(detailItem.data?.peak_power).toLocaleString("id-ID", { minimumFractionDigits: 0 }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-[10px] md:text-xs font-medium", children: "W" })
              ] })
            ] })
          ] }),
          (() => {
            const recColors = getRecoveryColors(detailItem.data?.recovery_status);
            return /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between p-3 md:p-4 rounded-2xl border mb-6 bg-white shadow-sm ${recColors.border}`, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 md:gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: `p-2 rounded-lg ${recColors.bg} ${recColors.text}`, children: /* @__PURE__ */ jsx(HeartPulse, { className: "w-4 h-4 md:w-5 md:h-5" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] md:text-xs font-bold text-slate-500", children: "Recovery Score" }),
                  /* @__PURE__ */ jsx("p", { className: `text-xs md:text-sm font-bold mt-0.5 ${recColors.text}`, children: detailItem.data?.recovery_status })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxs("span", { className: `text-2xl md:text-3xl font-bold ${recColors.text}`, children: [
                detailItem.data?.quick_recovery_score,
                "%"
              ] }) })
            ] });
          })(),
          detailItem.data?.notes ? /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-4 rounded-2xl border border-slate-200", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2 text-slate-600", children: [
              /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("h4", { className: "text-[10px] md:text-xs font-bold", children: "Catatan Tambahan" })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs md:text-sm text-slate-700 leading-relaxed italic border-l-2 border-orange-500 pl-3 ml-1 whitespace-pre-wrap", children: [
              '"',
              detailItem.data.notes,
              '"'
            ] })
          ] }) : /* @__PURE__ */ jsx("div", { className: "text-center py-2 text-slate-400 text-xs italic", children: "Tidak ada catatan untuk hari ini." })
        ] })
      ] })
    ] })
  ] });
}
export {
  HistoryTable as default
};
