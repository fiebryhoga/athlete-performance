import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { useForm, Head, Link, router } from "@inertiajs/react";
import { ChevronLeft, CalendarDays, ChevronRight, Plus, User, Activity, Info, Edit3, MapPin, Dumbbell, Pencil, Trash2, X, AlertTriangle, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import "axios";
const CustomSelect = ({ value, onChange, options, placeholder, disabled, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const selectedOption = options.find((opt) => String(opt.value) === String(value));
  return /* @__PURE__ */ jsxs("div", { ref: wrapperRef, className: "relative w-full", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => !disabled && setIsOpen(!isOpen),
        className: `flex justify-between items-center w-full rounded-lg border touch-manipulation ${isOpen ? "border-orange-500 ring-2 ring-orange-500/20 bg-white" : "border-slate-200 bg-slate-50"} text-xs md:text-sm px-3 md:px-4 py-3 md:py-3.5 transition-all ${disabled ? "cursor-not-allowed opacity-60 bg-slate-100" : "cursor-pointer hover:border-slate-300"} ${className}`,
        children: [
          /* @__PURE__ */ jsx("span", { className: `truncate pr-4 ${selectedOption ? "text-slate-800 font-bold" : "text-slate-400 font-medium"}`, children: selectedOption ? selectedOption.label : placeholder }),
          /* @__PURE__ */ jsx(ChevronDown, { className: `w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-orange-500" : ""}` })
        ]
      }
    ),
    isOpen && !disabled && /* @__PURE__ */ jsx("div", { className: "absolute top-[calc(100%+6px)] left-0 w-full bg-white border border-slate-200 shadow-xl rounded-lg max-h-48 md:max-h-56 overflow-y-auto z-[80] py-1.5 custom-scrollbar origin-top animate-in fade-in slide-in-from-top-2 duration-150", children: options.map((opt, idx) => {
      const isSelected = String(value) === String(opt.value);
      return /* @__PURE__ */ jsx(
        "div",
        {
          onClick: () => {
            onChange(opt.value);
            setIsOpen(false);
          },
          className: `px-4 py-3 md:py-2.5 text-xs md:text-sm cursor-pointer font-medium transition-colors ${isSelected ? "bg-orange-50 text-orange-500 font-bold border-l-2 border-orange-500" : "text-slate-700 hover:bg-slate-50 border-l-2 border-transparent"}`,
          children: opt.label
        },
        idx
      );
    }) })
  ] });
};
function Index({ calendar, athletes, coaches, is_athlete, currentMonth, currentYear, monthName }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detailModal, setDetailModal] = useState({ isOpen: false, session: null, date: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const form = useForm({
    user_id: "",
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    session_number: 1,
    training_type: "",
    coach_id: "",
    location: ""
  });
  useEffect(() => {
    if (isModalOpen || deleteModal.isOpen || detailModal.isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isModalOpen, deleteModal.isOpen, detailModal.isOpen]);
  const openModal = (dateStr = "", existingSession = null) => {
    if (existingSession) {
      setEditMode(true);
      setEditingId(existingSession.id);
      form.setData({
        user_id: existingSession.user_id,
        date: existingSession.date,
        session_number: existingSession.session_number,
        training_type: existingSession.training_type,
        coach_id: existingSession.coach_id || "",
        location: existingSession.location || ""
      });
      setDetailModal({ isOpen: false, session: null, date: null });
    } else {
      setEditMode(false);
      setEditingId(null);
      form.setData({
        user_id: "",
        date: dateStr || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        session_number: 1,
        training_type: "",
        coach_id: "",
        location: ""
      });
    }
    setIsModalOpen(true);
  };
  const submit = (e) => {
    e.preventDefault();
    if (editMode) {
      form.put(route("admin.training-logs.session.update", editingId), {
        onSuccess: () => {
          setIsModalOpen(false);
          form.reset();
        },
        preserveScroll: true
      });
    } else {
      form.post(route("admin.training-logs.session.store"), {
        onSuccess: () => {
          setIsModalOpen(false);
          form.reset();
        },
        preserveScroll: true
      });
    }
  };
  const confirmDelete = () => {
    router.delete(route("admin.training-logs.destroy", deleteModal.id), {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteModal({ isOpen: false, id: null });
        setDetailModal({ isOpen: false, session: null, date: null });
      }
    });
  };
  const navigateMonth = (direction) => {
    let newMonth = currentMonth;
    let newYear = currentYear;
    if (direction === "prev") {
      newMonth -= 1;
      if (newMonth < 1) {
        newMonth = 12;
        newYear -= 1;
      }
    } else {
      newMonth += 1;
      if (newMonth > 12) {
        newMonth = 1;
        newYear += 1;
      }
    }
    router.get(route("admin.training-logs.index"), { month: newMonth, year: newYear }, { preserveState: true, preserveScroll: true });
  };
  const goToToday = () => {
    const today = /* @__PURE__ */ new Date();
    router.get(route("admin.training-logs.index"), { month: today.getMonth() + 1, year: today.getFullYear() }, { preserveState: true, preserveScroll: true });
  };
  const openDetail = (session, date) => {
    setDetailModal({ isOpen: true, session, date });
  };
  const formatDate = (d) => new Date(d).toLocaleDateString("id-ID", { weekday: "short", day: "2-digit", month: "short" });
  const sessionOptions = Array.from({ length: 100 }, (_, i) => ({ value: i + 1, label: `Sesi ${i + 1}` }));
  const athleteOptions = athletes.map((a) => ({ value: a.id, label: a.name }));
  const coachOptions = [{ value: "", label: "-- Latihan Mandiri (Tanpa Coach) --" }, ...coaches.map((c) => ({ value: c.id, label: c.name }))];
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Jadwal & Log Latihan", children: [
    /* @__PURE__ */ jsx(Head, { title: "Jadwal & Log Latihan" }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[1400px] mx-auto pb-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6 mb-6 w-full bg-white p-4 sm:p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none" }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 relative z-10 w-full", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[9px] md:text-[10px] font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full mb-2 inline-block", children: "Management" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl md:text-3xl font-bold text-slate-800 flex items-center gap-2 tracking-tight", children: "Jadwal Latihan" }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 font-medium mt-1 text-xs md:text-sm", children: "Atur jadwal sesi klien dan kelola log." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0 relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1 shadow-inner w-full sm:w-auto justify-between", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => navigateMonth("prev"), className: "p-2 text-slate-500 hover:bg-white hover:text-orange-500 hover:shadow-sm rounded-md transition-all touch-manipulation", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4 md:w-5 md:h-5" }) }),
            /* @__PURE__ */ jsxs("div", { className: "px-2 md:px-4 font-bold text-slate-700 w-full sm:w-28 md:w-36 text-center text-xs md:text-sm flex items-center justify-center gap-1.5 truncate", children: [
              /* @__PURE__ */ jsx(CalendarDays, { className: "w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400 shrink-0" }),
              " ",
              monthName
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: () => navigateMonth("next"), className: "p-2 text-slate-500 hover:bg-white hover:text-orange-500 hover:shadow-sm rounded-md transition-all touch-manipulation", children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 md:w-5 md:h-5" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 w-full sm:w-auto", children: [
            /* @__PURE__ */ jsx("button", { onClick: goToToday, className: "flex-1 sm:flex-none px-3 md:px-4 py-2.5 md:py-3 bg-white text-slate-600 font-bold text-xs md:text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-center whitespace-nowrap touch-manipulation", children: "Bulan Ini" }),
            !is_athlete && /* @__PURE__ */ jsxs("button", { onClick: () => openModal(), className: "flex-1 sm:flex-none bg-orange-500 text-white px-3 md:px-5 py-2.5 md:py-3 rounded-lg font-bold text-xs md:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all whitespace-nowrap touch-manipulation", children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5 md:w-4 md:h-4" }),
              " Jadwal Baru"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "md:hidden flex flex-col gap-3", children: calendar.map((item, idx) => {
        const d = /* @__PURE__ */ new Date();
        const localDateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        const isToday = item.date === localDateString;
        if (item.is_empty) {
          return /* @__PURE__ */ jsxs("div", { className: `bg-white rounded-xl border p-4 shadow-sm ${isToday ? "border-orange-500/30 bg-orange-50/10" : "border-slate-200"}`, children: [
            /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center mb-3", children: /* @__PURE__ */ jsxs("div", { className: `font-bold text-sm ${isToday ? "text-orange-500" : "text-slate-600"}`, children: [
              formatDate(item.date),
              " ",
              isToday && /* @__PURE__ */ jsx("span", { className: "ml-2 text-[9px] bg-orange-500 text-white px-2 py-0.5 rounded-full", children: "Hari Ini" })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "border-2 border-dashed border-slate-100 rounded-lg bg-slate-50/50 p-3 flex justify-between items-center", children: [
              /* @__PURE__ */ jsx("span", { className: "text-slate-400 font-medium text-xs italic", children: "-- Jadwal Kosong --" }),
              !is_athlete && /* @__PURE__ */ jsxs("button", { onClick: () => openModal(item.date), className: "text-orange-500 bg-white border border-orange-100 shadow-sm px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-orange-500 hover:text-white transition-all touch-manipulation", children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
                " Isi"
              ] })
            ] })
          ] }, `mob-empty-${item.date}`);
        }
        return /* @__PURE__ */ jsxs("div", { className: `bg-white rounded-xl border p-4 shadow-sm relative overflow-hidden ${isToday ? "border-orange-500/50 ring-1 ring-orange-500/20" : "border-slate-200"}`, children: [
          isToday && /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-16 h-16 bg-orange-500 blur-3xl opacity-10 rounded-full pointer-events-none" }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: `font-bold text-sm ${isToday ? "text-orange-500" : "text-slate-500"}`, children: [
              formatDate(item.date),
              " ",
              isToday && /* @__PURE__ */ jsx("span", { className: "ml-2 text-[9px] bg-orange-500 text-white px-2 py-0.5 rounded-full", children: "Hari Ini" })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md border border-orange-100", children: [
              "Sesi ",
              item.session.session_number
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0", children: item.session.user?.profile_photo_url ? /* @__PURE__ */ jsx("img", { src: item.session.user.profile_photo_url, className: "w-full h-full rounded-full object-cover", alt: "" }) : /* @__PURE__ */ jsx(User, { className: "w-6 h-6" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800 text-base truncate", children: item.session.user?.name || "-" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mt-0.5 text-xs text-slate-500 truncate", children: [
                /* @__PURE__ */ jsx(Activity, { className: "w-3.5 h-3.5 shrink-0" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "truncate", children: item.session.training_type })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxs("button", { onClick: () => openDetail(item.session, item.date), className: "flex-1 py-2.5 bg-slate-50 text-slate-600 font-bold text-xs border border-slate-200 rounded-lg flex items-center justify-center gap-1.5 touch-manipulation hover:bg-slate-100", children: [
              /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
              " Detail"
            ] }),
            /* @__PURE__ */ jsxs(Link, { href: route("admin.training-logs.show", item.session.id), className: "flex-1 py-2.5 bg-orange-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 touch-manipulation shadow-md shadow-orange-500/20 hover:bg-orange-600", children: [
              /* @__PURE__ */ jsx(Edit3, { className: "w-4 h-4" }),
              " Buka Log"
            ] })
          ] })
        ] }, `mob-session-${item.date}`);
      }) }),
      /* @__PURE__ */ jsx("div", { className: "hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full relative z-0", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm whitespace-nowrap", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-slate-50 border-b border-slate-200 text-slate-400 text-xs font-bold", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5 w-32", children: "Tanggal" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5", children: "Klien & Sesi" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5", children: "Program Latihan" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5", children: "Lokasi & Coach" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-5 text-right w-48", children: "Aksi" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: calendar.map((item, idx) => {
          const isToday = item.date === (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          if (item.is_empty) {
            return /* @__PURE__ */ jsxs("tr", { className: "group hover:bg-slate-50/50 transition-colors", children: [
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 align-top", children: /* @__PURE__ */ jsx("div", { className: `font-bold text-sm mt-1 ${isToday ? "text-orange-500" : "text-slate-400"}`, children: formatDate(item.date) }) }),
              /* @__PURE__ */ jsx("td", { colSpan: "4", className: "px-6 py-3", children: /* @__PURE__ */ jsxs("div", { className: "border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50 p-4 flex justify-between items-center group-hover:border-orange-200 group-hover:bg-orange-50/30 transition-all", children: [
                /* @__PURE__ */ jsx("span", { className: "text-slate-400 font-medium text-xs italic ml-2", children: "-- Kosong --" }),
                !is_athlete && /* @__PURE__ */ jsxs("button", { onClick: () => openModal(item.date), className: "text-orange-500 bg-white border border-orange-100 shadow-sm px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-orange-500 hover:text-white transition-all", children: [
                  /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
                  " Jadwalkan"
                ] })
              ] }) })
            ] }, `desk-empty-${item.date}`);
          }
          return /* @__PURE__ */ jsxs("tr", { className: `transition-colors hover:bg-slate-50 ${isToday ? "bg-orange-50/10" : "bg-white"}`, children: [
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 align-middle", children: /* @__PURE__ */ jsxs("div", { className: `font-bold flex flex-col gap-1 text-sm ${isToday ? "text-orange-500" : "text-slate-700"}`, children: [
              /* @__PURE__ */ jsx("span", { children: formatDate(item.date) }),
              isToday && /* @__PURE__ */ jsx("span", { className: "text-[9px] bg-orange-500 text-white px-2 py-0.5 rounded-full w-fit", children: "Hari Ini" })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 align-middle", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0", children: item.session.user?.profile_photo_url ? /* @__PURE__ */ jsx("img", { src: item.session.user.profile_photo_url, className: "w-full h-full rounded-full object-cover", alt: "" }) : /* @__PURE__ */ jsx(User, { className: "w-5 h-5" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800 text-base", children: item.session.user?.name || "-" }),
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-orange-500 mt-1", children: [
                  "Sesi ",
                  item.session.session_number
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 align-middle", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "p-1.5 bg-orange-50 rounded-lg text-orange-500 shrink-0", children: /* @__PURE__ */ jsx(Activity, { className: "w-4 h-4" }) }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700 text-sm truncate max-w-[200px]", children: item.session.training_type })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 align-middle", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-600", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 text-rose-500 shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "truncate max-w-[150px]", children: item.session.location || "-" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-600", children: [
                /* @__PURE__ */ jsx(Dumbbell, { className: "w-3.5 h-3.5 text-orange-500 shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "truncate max-w-[150px]", children: item.session.coach?.name || "Latihan Mandiri" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 align-middle text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
              !is_athlete && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("button", { onClick: () => openModal(item.date, item.session), title: "Edit", className: "p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors", children: /* @__PURE__ */ jsx(Pencil, { className: "w-4 h-4" }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => setDeleteModal({ isOpen: true, id: item.session.id }), title: "Hapus", className: "p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
              ] }),
              /* @__PURE__ */ jsxs(Link, { href: route("admin.training-logs.show", item.session.id), className: "px-4 py-2 text-xs font-bold text-white bg-orange-500 shadow-md shadow-orange-500/20 hover:bg-orange-600 rounded-lg transition-all flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(Edit3, { className: "w-4 h-4" }),
                " Buka Log"
              ] })
            ] }) })
          ] }, `desk-session-${item.date}`);
        }) })
      ] }) })
    ] }),
    detailModal.isOpen && detailModal.session && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[60] md:hidden flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "bg-white w-full rounded-t-2xl sm:rounded-xl shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1 sm:hidden" }),
      /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 border-b border-slate-100 flex justify-between items-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg text-slate-800", children: "Detail Sesi Latihan" }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-orange-500 mt-0.5", children: formatDate(detailModal.date) })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setDetailModal({ isOpen: false, session: null, date: null }), className: "p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors touch-manipulation", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5 text-slate-500" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0", children: detailModal.session.user?.profile_photo_url ? /* @__PURE__ */ jsx("img", { src: detailModal.session.user.profile_photo_url, className: "w-full h-full rounded-full object-cover", alt: "" }) : /* @__PURE__ */ jsx(User, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400 block mb-0.5", children: "Klien" }),
            /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800 text-base block leading-none", children: detailModal.session.user?.name || "-" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 rounded-xl border border-slate-100", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-slate-400 block mb-1.5 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Activity, { className: "w-3.5 h-3.5" }),
              " Program"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700 text-sm block truncate", children: detailModal.session.training_type })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 rounded-xl border border-slate-100", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-slate-400 block mb-1.5 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Dumbbell, { className: "w-3.5 h-3.5" }),
              " Coach"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700 text-sm block truncate", children: detailModal.session.coach?.name || "Tanpa Coach" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-slate-400 block mb-1.5 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5" }),
              " Lokasi"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700 text-sm block truncate", children: detailModal.session.location || "Tidak ditentukan" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-5 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl sm:rounded-b-xl", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("admin.training-logs.show", detailModal.session.id),
            onClick: () => setDetailModal({ isOpen: false, session: null, date: null }),
            className: "w-full py-3.5 bg-orange-500 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 touch-manipulation shadow-lg shadow-orange-500/20 hover:bg-orange-600 mb-3",
            children: [
              /* @__PURE__ */ jsx(Edit3, { className: "w-5 h-5" }),
              " Buka Log & Catat Latihan"
            ]
          }
        ),
        !is_athlete && /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => openModal(detailModal.date, detailModal.session), className: "flex-1 py-3 bg-white text-slate-700 font-bold text-xs border border-slate-200 rounded-lg flex items-center justify-center gap-1.5 touch-manipulation hover:bg-slate-50", children: [
            /* @__PURE__ */ jsx(Pencil, { className: "w-4 h-4" }),
            " Edit Info"
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => setDeleteModal({ isOpen: true, id: detailModal.session.id }), className: "flex-1 py-3 bg-rose-50 text-rose-600 font-bold text-xs border border-rose-200 rounded-lg flex items-center justify-center gap-1.5 touch-manipulation hover:bg-rose-100", children: [
            /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }),
            " Hapus"
          ] })
        ] })
      ] })
    ] }) }),
    isModalOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "bg-white w-full max-w-md rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col my-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center rounded-t-xl", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-base md:text-lg text-slate-800", children: editMode ? "Edit Jadwal Sesi" : "Jadwal Sesi Baru" }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] md:text-xs font-medium text-slate-500 mt-0.5", children: editMode ? "Perbarui detail jadwal latihan." : "Tentukan jadwal sebelum mengisi Excel Log." })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setIsModalOpen(false), className: "p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-100 transition-colors touch-manipulation", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5 text-slate-500" }) })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-5 space-y-4 rounded-b-xl overflow-y-auto max-h-[80vh] custom-scrollbar", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Pilih Klien (Atlet)" }),
          /* @__PURE__ */ jsx(
            CustomSelect,
            {
              value: form.data.user_id,
              onChange: (val) => form.setData("user_id", val),
              options: athleteOptions,
              placeholder: "-- Pilih Klien --",
              disabled: editMode,
              className: editMode ? "" : "!bg-orange-50/50 !text-orange-900 !border-orange-200"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Tanggal" }),
            /* @__PURE__ */ jsx("input", { type: "date", value: form.data.date, onChange: (e) => form.setData("date", e.target.value), className: "w-full rounded-lg border border-slate-200 text-sm bg-slate-50 px-3 py-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none", required: true })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Sesi Ke-" }),
            /* @__PURE__ */ jsx(
              CustomSelect,
              {
                value: form.data.session_number,
                onChange: (val) => form.setData("session_number", val),
                options: sessionOptions,
                placeholder: "Sesi"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Tipe Latihan" }),
          /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Cth: Strength Training...", value: form.data.training_type, onChange: (e) => form.setData("training_type", e.target.value), className: "w-full rounded-lg border border-slate-200 text-sm bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none font-medium", required: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Coach Pendamping" }),
          /* @__PURE__ */ jsx(
            CustomSelect,
            {
              value: form.data.coach_id,
              onChange: (val) => form.setData("coach_id", val),
              options: coachOptions,
              placeholder: "-- Pilih Coach --"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Lokasi Latihan" }),
          /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Cth: Apartemen / Gym Pusat...", value: form.data.location, onChange: (e) => form.setData("location", e.target.value), className: "w-full rounded-lg border border-slate-200 text-sm bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none font-medium" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-3", children: /* @__PURE__ */ jsx("button", { type: "submit", disabled: form.processing || !form.data.user_id, className: "w-full py-3.5 bg-orange-500 text-white font-bold text-sm rounded-lg shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed touch-manipulation", children: form.processing ? /* @__PURE__ */ jsx("span", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : editMode ? "Simpan Pembaruan Jadwal" : "Buat Sesi & Isi Log Training" }) })
      ] })
    ] }) }),
    deleteModal.isOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "bg-white w-full max-w-sm rounded-xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-rose-50", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "w-8 h-8 text-rose-500" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-bold text-slate-800 mb-2", children: "Hapus Jadwal?" }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs md:text-sm text-slate-500 font-medium mb-8 leading-relaxed", children: [
        "Yakin ingin mengosongkan jadwal ini? Seluruh ",
        /* @__PURE__ */ jsx("strong", { className: "text-slate-700", children: "catatan beban & repetisi (log)" }),
        " di dalamnya juga akan terhapus secara permanen."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col-reverse sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setDeleteModal({ isOpen: false, id: null }), className: "w-full sm:flex-1 py-3 bg-slate-100 text-slate-600 font-bold text-sm rounded-lg hover:bg-slate-200 transition-colors touch-manipulation", children: "Batal" }),
        /* @__PURE__ */ jsx("button", { onClick: confirmDelete, className: "w-full sm:flex-1 py-3 bg-rose-500 text-white font-bold text-sm rounded-lg shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-colors touch-manipulation", children: "Ya, Hapus!" })
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
