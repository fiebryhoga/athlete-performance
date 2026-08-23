import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { HeartPulse, X, Brain, Battery, Save, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
const ScaleRadio = ({ label, name, data, setData }) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors", children: [
  /* @__PURE__ */ jsx("label", { className: "text-sm font-medium text-slate-700 w-full sm:w-1/2", children: label }),
  /* @__PURE__ */ jsx("div", { className: "flex gap-1.5 sm:gap-2 w-full sm:w-1/2 justify-between sm:justify-end", children: [1, 2, 3, 4, 5].map((num) => /* @__PURE__ */ jsxs("label", { className: `relative w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg cursor-pointer text-xs md:text-sm font-semibold transition-all duration-200 shrink-0 ${data[name] == num ? "bg-orange-500 text-white shadow-sm ring-2 ring-orange-200 ring-offset-1" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`, children: [
    /* @__PURE__ */ jsx("input", { type: "radio", name, value: num, checked: data[name] == num, className: "absolute inset-0 opacity-0 cursor-pointer w-full h-full m-0", onChange: (e) => setData(name, e.target.value) }),
    /* @__PURE__ */ jsx("span", { children: num })
  ] }, num)) })
] });
const CustomSelect = ({ options, value, onChange, placeholder, iconColorClass = "text-orange-500", activeBgClass = "bg-orange-50 text-orange-700", hoverClass = "hover:text-orange-600" }) => {
  const [isOpen, setIsOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
    /* @__PURE__ */ jsxs("div", { onClick: () => setIsOpen(!isOpen), className: "w-full text-xs md:text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 cursor-pointer flex justify-between items-center hover:border-orange-400 transition-colors", children: [
      /* @__PURE__ */ jsx("span", { className: value ? "text-slate-800 font-medium" : "text-slate-400", children: value || placeholder }),
      /* @__PURE__ */ jsx(ChevronDown, { className: `w-4 h-4 ${iconColorClass}` })
    ] }),
    isOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-10", onClick: () => setIsOpen(false) }),
      /* @__PURE__ */ jsxs("div", { className: "absolute z-20 w-full mt-1 bg-white border border-slate-200 shadow-lg rounded-lg max-h-56 overflow-y-auto custom-scrollbar py-1", children: [
        /* @__PURE__ */ jsx("div", { onClick: () => {
          onChange("");
          setIsOpen(false);
        }, className: "px-3 py-2 text-xs md:text-sm text-slate-400 hover:bg-slate-50 cursor-pointer italic", children: "Kosongkan..." }),
        options.map((opt) => /* @__PURE__ */ jsx("div", { onClick: () => {
          onChange(opt);
          setIsOpen(false);
        }, className: `px-3 py-2 text-xs md:text-sm cursor-pointer transition-colors ${value == opt ? `${activeBgClass} font-bold` : `text-slate-700 hover:bg-slate-50 ${hoverClass}`}`, children: opt }, opt))
      ] })
    ] })
  ] });
};
function TrainingModal({ isOpen, onClose, activeData, selectedDate, formatDateToIndo, sessionTypes, rpeOptions, athleteId }) {
  const { data, setData, post, processing, reset } = useForm({
    user_id: athleteId,
    record_date: selectedDate,
    sleep_quality: "",
    fatigue: "",
    muscle_soreness: "",
    stress: "",
    motivation: "",
    health: "",
    mood: "",
    study_attitude: "",
    am_session_type: "",
    am_rpe: "",
    am_duration: "",
    pm_session_type: "",
    pm_rpe: "",
    pm_duration: "",
    notes: ""
  });
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const existingData = activeData.find((d) => d.record_date === selectedDate);
      if (existingData) {
        setData({
          user_id: athleteId,
          record_date: selectedDate,
          ...existingData,
          notes: existingData.notes || ""
        });
      } else {
        reset();
        setData("user_id", athleteId);
        setData("record_date", selectedDate);
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, selectedDate]);
  if (!isOpen) return null;
  const submitLoad = (e) => {
    e.preventDefault();
    post(route("admin.training-loads.store"), {
      onSuccess: () => {
        onClose();
        reset();
      },
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity", onClick: onClose }),
    /* @__PURE__ */ jsxs("div", { className: "relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 flex justify-between items-center bg-white shadow-sm shrink-0", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { className: "font-bold text-lg md:text-xl text-slate-800 flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsx("div", { className: "p-1.5 bg-orange-50 rounded-lg text-orange-500", children: /* @__PURE__ */ jsx(HeartPulse, { className: "w-4 h-4 md:w-5 md:h-5" }) }),
            activeData.find((d) => d.record_date === selectedDate) ? "Edit Readiness & Load" : "Input Readiness & Load"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-slate-500 mt-1 md:ml-11", children: formatDateToIndo(new Date(selectedDate), "full") })
        ] }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "p-2 text-slate-400 hover:bg-orange-50 hover:text-orange-500 rounded-full transition-colors", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-y-auto custom-scrollbar flex-1", children: /* @__PURE__ */ jsx("form", { onSubmit: submitLoad, className: "p-5 md:p-6", id: "training-load-form", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-3.5 md:space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 md:mb-6 border-b border-slate-100 pb-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Brain, { className: "w-4 h-4 md:w-5 md:h-5 text-slate-400" }),
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-slate-800 text-base md:text-lg", children: "Wellness Questionnaire" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] md:text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md", children: "1 Buruk - 5 Baik" })
          ] }),
          /* @__PURE__ */ jsx(ScaleRadio, { label: "Kualitas Tidur", name: "sleep_quality", data, setData }),
          /* @__PURE__ */ jsx(ScaleRadio, { label: "Tingkat Kelelahan", name: "fatigue", data, setData }),
          /* @__PURE__ */ jsx(ScaleRadio, { label: "Nyeri Otot", name: "muscle_soreness", data, setData }),
          /* @__PURE__ */ jsx(ScaleRadio, { label: "Tingkat Stres", name: "stress", data, setData }),
          /* @__PURE__ */ jsx(ScaleRadio, { label: "Motivasi Latihan", name: "motivation", data, setData }),
          /* @__PURE__ */ jsx(ScaleRadio, { label: "Kondisi Kesehatan", name: "health", data, setData }),
          /* @__PURE__ */ jsx(ScaleRadio, { label: "Suasana Hati (Mood)", name: "mood", data, setData }),
          /* @__PURE__ */ jsx(ScaleRadio, { label: "Fokus/Sikap Belajar", name: "study_attitude", data, setData })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-5 md:space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2 md:mb-4 border-b border-slate-100 pb-3", children: [
            /* @__PURE__ */ jsx(Battery, { className: "w-4 h-4 md:w-5 md:h-5 text-slate-400" }),
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-slate-800 text-base md:text-lg", children: "Sesi Latihan (RPE)" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-orange-50/50 p-4 md:p-5 rounded-xl border border-orange-100 relative z-20", children: [
            /* @__PURE__ */ jsxs("h5", { className: "font-bold text-slate-700 text-xs md:text-sm mb-4 flex items-center gap-2", children: [
              "Sesi Pagi ",
              /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded", children: "AM" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative z-30", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] md:text-xs font-bold text-slate-500 mb-1.5 block", children: "Tipe Latihan" }),
                /* @__PURE__ */ jsx(CustomSelect, { options: sessionTypes, value: data.am_session_type, onChange: (val) => setData("am_session_type", val), placeholder: "Pilih tipe sesi...", iconColorClass: "text-orange-500", activeBgClass: "bg-orange-50 text-orange-500", hoverClass: "hover:text-orange-500" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 md:gap-4 relative z-20", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] md:text-xs font-bold text-slate-500 mb-1.5 block", children: "Beban (RPE)" }),
                  /* @__PURE__ */ jsx(CustomSelect, { options: rpeOptions, value: data.am_rpe, onChange: (val) => setData("am_rpe", val), placeholder: "Skala 1-10", iconColorClass: "text-orange-500", activeBgClass: "bg-orange-50 text-orange-500", hoverClass: "hover:text-orange-500" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] md:text-xs font-bold text-slate-500 mb-1.5 block", children: "Durasi (Mnt)" }),
                  /* @__PURE__ */ jsx("input", { type: "number", min: "0", value: data.am_duration, onChange: (e) => setData("am_duration", e.target.value), className: "w-full text-xs md:text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors", placeholder: "0" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-amber-50/50 p-4 md:p-5 rounded-xl border border-amber-100 relative z-10", children: [
            /* @__PURE__ */ jsxs("h5", { className: "font-bold text-slate-700 text-xs md:text-sm mb-4 flex items-center gap-2", children: [
              "Sesi Sore/Malam ",
              /* @__PURE__ */ jsx("span", { className: "text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded", children: "PM" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative z-30", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] md:text-xs font-bold text-slate-500 mb-1.5 block", children: "Tipe Latihan" }),
                /* @__PURE__ */ jsx(CustomSelect, { options: sessionTypes, value: data.pm_session_type, onChange: (val) => setData("pm_session_type", val), placeholder: "Pilih tipe sesi...", iconColorClass: "text-amber-600", activeBgClass: "bg-amber-50 text-amber-700", hoverClass: "hover:text-amber-600" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 md:gap-4 relative z-20", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] md:text-xs font-bold text-slate-500 mb-1.5 block", children: "Beban (RPE)" }),
                  /* @__PURE__ */ jsx(CustomSelect, { options: rpeOptions, value: data.pm_rpe, onChange: (val) => setData("pm_rpe", val), placeholder: "Skala 1-10", iconColorClass: "text-amber-600", activeBgClass: "bg-amber-50 text-amber-700", hoverClass: "hover:text-amber-600" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] md:text-xs font-bold text-slate-500 mb-1.5 block", children: "Durasi (Mnt)" }),
                  /* @__PURE__ */ jsx("input", { type: "number", min: "0", value: data.pm_duration, onChange: (e) => setData("pm_duration", e.target.value), className: "w-full text-xs md:text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors", placeholder: "0" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 md:space-y-2 mt-4 md:mt-2 pt-2 md:pt-4 border-t border-slate-100", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] md:text-xs font-bold text-slate-500", children: "Catatan Tambahan (Opsional)" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                rows: "2",
                value: data.notes,
                onChange: (e) => setData("notes", e.target.value),
                className: "w-full text-xs md:text-sm rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all resize-none",
                placeholder: "Cth: Latihan sangat intens, cuaca sedang buruk..."
              }
            )
          ] })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "px-5 md:px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "px-4 md:px-5 py-2 md:py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs md:text-sm rounded-lg hover:bg-slate-100 transition-colors", children: "Batal" }),
        /* @__PURE__ */ jsxs("button", { type: "submit", form: "training-load-form", disabled: processing, className: "px-5 md:px-6 py-2 md:py-2.5 bg-orange-500 text-white font-bold text-xs md:text-sm rounded-lg shadow-sm hover:bg-orange-600 transition-colors flex items-center gap-2", children: [
          processing ? /* @__PURE__ */ jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
          "Simpan Data"
        ] })
      ] })
    ] })
  ] });
}
export {
  TrainingModal as default
};
