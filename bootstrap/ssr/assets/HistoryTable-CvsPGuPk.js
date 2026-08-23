import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { M as Modal } from "./Modal-DUGk5ZHw.js";
import { History, CalendarDays, Scale, Activity, HeartPulse, Edit, Trash2, AlertTriangle } from "lucide-react";
import "@headlessui/react";
function HistoryTable({ history, onEdit, canDelete }) {
  const { delete: destroy, processing } = useForm();
  const [confirmingDeletion, setConfirmingDeletion] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmingDeletion(true);
  };
  const closeModal = () => {
    setConfirmingDeletion(false);
    setDeleteId(null);
  };
  const deleteRecord = () => {
    if (!deleteId) return;
    destroy(route("admin.composition-tests.destroy", deleteId), {
      preserveScroll: true,
      onSuccess: () => closeModal()
    });
  };
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };
  if (!history || history.length === 0) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200/80 rounded-lg shadow-2xs overflow-hidden flex flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold text-slate-900 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(History, { className: "w-3.5 h-3.5 text-orange-500" }),
            "Riwayat Pengukuran Komposisi Tubuh"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 font-medium mt-0.5", children: "Daftar rekam jejak evaluasi bioimpedansi atlet sepanjang waktu." })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold text-slate-500 bg-white border border-slate-200/70 px-2.5 py-0.5 rounded-md shadow-2xs", children: [
          "Total: ",
          history.length,
          " Record"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto custom-scrollbar", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
        /* @__PURE__ */ jsx("thead", { className: "text-[10.5px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/80 border-b border-slate-200/70", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(CalendarDays, { className: "w-3.5 h-3.5 text-slate-400" }),
            "Tanggal Tes"
          ] }) }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Scale, { className: "w-3.5 h-3.5 text-slate-400" }),
            "Berat & BMI"
          ] }) }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Activity, { className: "w-3.5 h-3.5 text-slate-400" }),
            "Lemak & Otot"
          ] }) }),
          /* @__PURE__ */ jsx("th", { className: "px-5 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(HeartPulse, { className: "w-3.5 h-3.5 text-slate-400" }),
            "Visceral & Phase Angle"
          ] }) }),
          (onEdit || canDelete) && /* @__PURE__ */ jsx("th", { className: "px-5 py-3 whitespace-nowrap text-right", children: "Aksi" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: history.map((item, index) => /* @__PURE__ */ jsxs(
          "tr",
          {
            className: "group hover:bg-orange-50/20 transition-colors bg-white",
            children: [
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                index === 0 && /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "w-2 h-2 rounded-full bg-orange-500 ring-2 ring-orange-500/20",
                    title: "Data Terbaru"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `font-bold ${index === 0 ? "text-slate-900" : "text-slate-700"}`,
                    children: formatDate(item.date)
                  }
                ),
                index === 0 && /* @__PURE__ */ jsx("span", { className: "text-[9.5px] font-bold text-orange-600 bg-orange-50 border border-orange-200/60 px-1.5 py-0.2 rounded", children: "Terbaru" })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-900", children: [
                  item.weight,
                  " kg"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "/" }),
                /* @__PURE__ */ jsxs("span", { className: "font-semibold text-slate-600", children: [
                  "BMI ",
                  item.bmi || "-"
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-bold", children: "Fat:" }),
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-orange-600", children: item.body_fat_percentage ? `${item.body_fat_percentage}%` : "-" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "/" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-bold", children: "Otot:" }),
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-teal-700", children: item.muscle_mass ? `${item.muscle_mass} kg` : "-" })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-bold", children: "Visc:" }),
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800", children: item.visceral_fat ? `Lvl ${item.visceral_fat}` : "-" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "/" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-bold", children: "Phase:" }),
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-indigo-600", children: item.phase_angle ? `${item.phase_angle}°` : "-" })
                ] })
              ] }) }),
              (onEdit || canDelete) && /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 whitespace-nowrap text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                onEdit && /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => onEdit(item),
                    className: "p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors",
                    title: "Edit Data",
                    children: /* @__PURE__ */ jsx(Edit, { className: "w-3.5 h-3.5" })
                  }
                ),
                canDelete && /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => confirmDelete(
                      item.id
                    ),
                    className: "p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors",
                    title: "Hapus Data",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
                  }
                )
              ] }) })
            ]
          },
          item.id
        )) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Modal, { show: confirmingDeletion, onClose: closeModal, maxWidth: "md", children: /* @__PURE__ */ jsxs("div", { className: "p-5 bg-white rounded-xl space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-900", children: "Hapus Data Komposisi Tubuh?" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Tindakan ini tidak dapat dibatalkan. Rekam jejak evaluasi ini akan terhapus secara permanen." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2 pt-2 border-t border-slate-100", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: closeModal,
            className: "px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-md transition-colors",
            children: "Batal"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            disabled: processing,
            onClick: deleteRecord,
            className: "px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors shadow-sm disabled:opacity-50",
            children: processing ? "Menghapus..." : "Hapus Data"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  HistoryTable as default
};
