import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { usePage, useForm, Head } from "@inertiajs/react";
import { User, CalendarDays, Activity, Calendar, AlertTriangle, Check } from "lucide-react";
import { useState } from "react";
import HistoryTable from "./HistoryTable-7trScnfs.js";
import AnalyticsDashboard from "./AnalyticsDashboard-3Bxax2X9.js";
import DailyMetricModal from "./DailyMetricModal-Bdi198el.js";
import "axios";
import "recharts";
function Show({ athlete, dailyHistory }) {
  const { auth } = usePage().props;
  const isAthlete = auth.user.role === "athlete";
  const [isConfirmDateOpen, setIsConfirmDateOpen] = useState(false);
  const formStartDate = useForm({ training_start_date: athlete?.training_start_date || "" });
  const handleOpenConfirmDate = (e) => {
    e.preventDefault();
    setIsConfirmDateOpen(true);
  };
  const submitStartDate = () => {
    formStartDate.post(route("admin.daily-metrics.set-start-date", athlete?.id), {
      onSuccess: () => setIsConfirmDateOpen(false),
      preserveScroll: true
    });
  };
  const [activeTab, setActiveTab] = useState("analytics");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateLabel, setSelectedDateLabel] = useState("");
  const formMetric = useForm({
    user_id: athlete?.id,
    record_date: "",
    rhr: "",
    spo2: "",
    weight: "",
    vj: "",
    notes: ""
  });
  const openModal = (historyItem) => {
    setSelectedDateLabel(historyItem.week_label);
    formMetric.setData({
      user_id: athlete?.id,
      record_date: historyItem.record_date,
      rhr: historyItem.data?.rhr > 0 ? historyItem.data.rhr : "",
      spo2: historyItem.data?.spo2 > 0 ? historyItem.data.spo2 : "",
      weight: historyItem.data?.weight > 0 ? historyItem.data.weight : athlete?.weight || "",
      vj: historyItem.data?.vj > 0 ? historyItem.data.vj : "",
      notes: historyItem.data?.notes || ""
    });
    setIsModalOpen(true);
  };
  const submitMetric = (e) => {
    e.preventDefault();
    formMetric.post(route("admin.daily-metrics.store"), {
      onSuccess: () => setIsModalOpen(false),
      preserveScroll: true
    });
  };
  const formatDateToIndo = (dateString, formatType = "full") => {
    if (!dateString) return "-";
    const options = formatType === "full" ? { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" } : { day: "numeric", month: "short", timeZone: "Asia/Jakarta" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: `Monitoring - ${athlete?.name || "Athlete"}`, children: [
    /* @__PURE__ */ jsx(Head, { title: `Monitoring - ${athlete?.name || "Athlete"}` }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto animate-in fade-in duration-500", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 md:gap-5", children: [
          /* @__PURE__ */ jsx("div", { className: "w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-orange-50 text-orange-500 flex items-center justify-center font-bold text-xl md:text-2xl border-4 border-white shadow-sm shrink-0", children: athlete?.profile_photo_url ? /* @__PURE__ */ jsx("img", { src: athlete.profile_photo_url, alt: athlete.name, className: "w-full h-full object-cover" }) : athlete?.name?.charAt(0).toUpperCase() || /* @__PURE__ */ jsx(User, { className: "w-6 h-6 md:w-8 md:h-8" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg md:text-xl font-bold text-slate-800 tracking-tight", children: athlete?.name || "Loading..." }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 md:gap-3 mt-1.5 md:mt-2", children: [
              /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] md:text-xs font-medium border border-slate-200", children: athlete?.sport?.name || "Tanpa Cabor" }),
              athlete?.weight && /* @__PURE__ */ jsxs("span", { className: "text-[10px] md:text-xs font-medium text-slate-500 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-slate-300" }),
                "BB: ",
                athlete.weight,
                " kg"
              ] })
            ] })
          ] })
        ] }),
        !isAthlete && /* @__PURE__ */ jsxs("form", { onSubmit: handleOpenConfirmDate, className: "flex flex-col sm:flex-row items-end sm:items-center gap-2 md:gap-3 shrink-0 mt-2 md:mt-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "w-full sm:w-auto", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-[10px] md:text-xs font-medium text-slate-500 mb-1 md:mb-1.5 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(CalendarDays, { className: "w-3.5 h-3.5 text-slate-400" }),
              " Start Program"
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: formStartDate.data.training_start_date,
                onChange: (e) => formStartDate.setData("training_start_date", e.target.value),
                className: "w-full text-xs md:text-sm font-medium text-slate-700 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all bg-white px-3 py-2",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: formStartDate.processing || formStartDate.data.training_start_date === athlete?.training_start_date,
              className: "w-full sm:w-auto mt-2 sm:mt-auto bg-slate-800 text-white px-5 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
              children: "Simpan"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-1 md:gap-2 mb-6 border-b border-slate-200 pb-px overflow-x-auto custom-scrollbar", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setActiveTab("analytics"),
            className: `flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2.5 md:py-3 text-[11px] md:text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === "analytics" ? "text-orange-500" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-lg"}`,
            children: [
              /* @__PURE__ */ jsx(Activity, { className: "w-3.5 h-3.5 md:w-4 md:h-4" }),
              "Dashboard Analitik",
              activeTab === "analytics" && /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setActiveTab("history"),
            className: `flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2.5 md:py-3 text-[11px] md:text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === "history" ? "text-orange-500" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-lg"}`,
            children: [
              /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5 md:w-4 md:h-4" }),
              "Kalender Input",
              activeTab === "history" && /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "min-h-[500px]", children: activeTab === "history" ? /* @__PURE__ */ jsx(
        HistoryTable,
        {
          dailyHistory,
          formatDateToIndo,
          openModal,
          isAthlete
        }
      ) : /* @__PURE__ */ jsx(AnalyticsDashboard, { dailyHistory, formatDateToIndo }) })
    ] }),
    /* @__PURE__ */ jsx(
      DailyMetricModal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        form: formMetric,
        submit: submitMetric,
        selectedDateLabel,
        formatDateToIndo
      }
    ),
    isConfirmDateOpen && !isAthlete && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity", onClick: () => setIsConfirmDateOpen(false) }),
      /* @__PURE__ */ jsx("div", { className: "relative bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200", children: /* @__PURE__ */ jsxs("div", { className: "p-5 md:p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 md:gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 md:p-3 bg-amber-50 text-amber-600 rounded-full shrink-0", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5 md:w-6 md:h-6" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-base md:text-lg font-semibold text-slate-800", children: "Konfirmasi Perubahan Tanggal" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs md:text-sm text-slate-600 mt-1.5 md:mt-2", children: [
              "Anda akan mengubah tanggal mulai latihan menjadi ",
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-800", children: formatDateToIndo(formStartDate.data.training_start_date, "full") }),
              "."
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-3 md:mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100", children: /* @__PURE__ */ jsxs("p", { className: "text-[10px] md:text-xs text-slate-500 flex items-start gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-700 shrink-0", children: "Catatan:" }),
              "Perubahan ini dapat memengaruhi pengelompokan minggu pada laporan analitik."
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 md:gap-3 mt-5 md:mt-6", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setIsConfirmDateOpen(false),
              className: "px-3 md:px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium text-xs md:text-sm rounded-lg hover:bg-slate-50 transition-colors",
              children: "Batal"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: submitStartDate,
              disabled: formStartDate.processing,
              className: "px-3 md:px-4 py-2 bg-orange-500 text-white font-medium text-xs md:text-sm rounded-lg shadow-sm hover:bg-orange-600 transition-colors flex items-center gap-1.5 md:gap-2",
              children: [
                formStartDate.processing ? /* @__PURE__ */ jsx("span", { className: "w-3.5 h-3.5 md:w-4 md:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 md:w-4 md:h-4" }),
                "Simpan Perubahan"
              ]
            }
          )
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Show as default
};
