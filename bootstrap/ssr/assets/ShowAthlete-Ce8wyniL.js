import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import { Head, Link, router } from "@inertiajs/react";
import { Calendar, Download, ChevronLeft, ChevronRight, List, User, Users, Plus, Dumbbell, Copy, Edit2, Trash2, CheckCircle2, Clock, MapPin, Timer, X } from "lucide-react";
import "axios";
function ShowAthlete({ auth, athlete, trainings, groupTrainings }) {
  const [currentDate, setCurrentDate] = useState(/* @__PURE__ */ new Date());
  const [sessionFilter, setSessionFilter] = useState("all");
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [sessionToDuplicate, setSessionToDuplicate] = useState(null);
  const [duplicateDate, setDuplicateDate] = useState("");
  const deleteSession = (e, sessionId) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Yakin ingin menghapus sesi latihan ini?")) {
      router.delete(route("admin.individual-trainings.session.destroy", sessionId), { preserveScroll: true });
    }
  };
  const getLocalDateStr = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const todayStr = getLocalDateStr(/* @__PURE__ */ new Date());
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek; i > 0; i--) {
      const d = new Date(year, month, 1 - i);
      days.push({ date: d, isCurrentMonth: false, dateStr: getLocalDateStr(d) });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      days.push({ date: d, isCurrentMonth: true, dateStr: getLocalDateStr(d) });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, isCurrentMonth: false, dateStr: getLocalDateStr(d) });
    }
    return days.map((day) => {
      const indTrainings = trainings.filter((t) => (t.date || "").substring(0, 10) === day.dateStr).map((t) => ({ ...t, type: "individual" }));
      const grpTrainings = (groupTrainings || []).filter((t) => (t.date || "").substring(0, 10) === day.dateStr).map((t) => ({ ...t, type: "group" }));
      let allSessions = [...indTrainings, ...grpTrainings];
      if (sessionFilter === "individual") {
        allSessions = indTrainings;
      } else if (sessionFilter === "group") {
        allSessions = grpTrainings;
      }
      return {
        ...day,
        sessions: allSessions.sort((a, b) => a.id - b.id),
        isToday: day.dateStr === todayStr
      };
    });
  }, [currentDate, trainings, groupTrainings, todayStr, sessionFilter]);
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const goToToday = () => {
    setCurrentDate(/* @__PURE__ */ new Date());
  };
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
  ];
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const maxSession = useMemo(() => {
    if (!trainings || trainings.length === 0) return 0;
    return Math.max(...trainings.map((t) => t.session_number || 0));
  }, [trainings]);
  const expDate = athlete.training_exp_date ? new Date(athlete.training_exp_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : null;
  const packageBadge = athlete.package ? `Paket: ${athlete.package.name} (Sesi ${maxSession}/${athlete.package.session_count})${expDate ? ` • Masa Aktif Sampai ${expDate}` : ""}` : "Tidak Ada Paket";
  return /* @__PURE__ */ jsxs(AppLayout, { title: `Kalender Latihan - ${athlete.name}`, children: [
    /* @__PURE__ */ jsx(Head, { title: `Kalender Latihan - ${athlete.name}` }),
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: `Program Latihan ${athlete.name}`,
        subtitle: "Pantau dan kelola jadwal program latihan dalam tampilan kalender.",
        badge: `Program Latihan • ${packageBadge}`,
        icon: Calendar,
        actions: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: route("admin.reports.sessions.export-athlete", athlete.id),
              target: "_blank",
              className: "flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/20",
              children: [
                /* @__PURE__ */ jsx(Download, { size: 16 }),
                " Download Laporan Sesi"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("admin.individual-trainings.index"),
              className: "flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm",
              children: [
                /* @__PURE__ */ jsx(ChevronLeft, { size: 16 }),
                " Kembali"
              ]
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "pb-12 space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xl font-bold text-slate-900 w-48", children: [
            monthNames[currentDate.getMonth()],
            " ",
            currentDate.getFullYear()
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: prevMonth,
                className: "p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors",
                children: /* @__PURE__ */ jsx(ChevronLeft, { size: 18 })
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "w-px h-5 bg-slate-200" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: goToToday,
                className: "px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors",
                children: "Hari Ini"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "w-px h-5 bg-slate-200" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: nextMonth,
                className: "p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors",
                children: /* @__PURE__ */ jsx(ChevronRight, { size: 18 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setSessionFilter("all"),
              className: `flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${sessionFilter === "all" ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`,
              children: [
                /* @__PURE__ */ jsx(List, { size: 16 }),
                " Semua"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setSessionFilter("individual"),
              className: `flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${sessionFilter === "individual" ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`,
              children: [
                /* @__PURE__ */ jsx(User, { size: 16 }),
                " Privat"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setSessionFilter("group"),
              className: `flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${sessionFilter === "group" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`,
              children: [
                /* @__PURE__ */ jsx(Users, { size: 16 }),
                " Grup"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-x-auto", children: /* @__PURE__ */ jsxs("div", { className: "min-w-[800px]", children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 border-b border-slate-200 bg-slate-50", children: dayNames.map((day) => /* @__PURE__ */ jsx("div", { className: "py-2.5 text-center text-[11px] font-bold text-slate-500", children: day }, day)) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 auto-rows-fr bg-slate-200 gap-px border-l border-slate-200", children: calendarDays.map((day, idx) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: `min-h-[120px] bg-white p-2 flex flex-col group transition-colors ${!day.isCurrentMonth ? "bg-slate-50/50" : ""}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
                /* @__PURE__ */ jsx("div", { className: `w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold ${day.isToday ? "bg-orange-500 text-white shadow-sm" : day.isCurrentMonth ? "text-slate-700" : "text-slate-400"}`, children: day.date.getDate() }),
                auth.user.role !== "athlete" && /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route("admin.individual-trainings.session.create", { user: athlete.id, date: day.dateStr }),
                    className: "w-6 h-6 flex items-center justify-center rounded bg-slate-100 text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-orange-500 hover:text-white transition-all shadow-sm",
                    title: "Tambah Sesi",
                    children: /* @__PURE__ */ jsx(Plus, { size: 14, strokeWidth: 2.5 })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex-1 space-y-1.5 overflow-y-auto pr-1 custom-scrollbar", children: day.sessions.map((session) => {
                const isGroup = session.type === "group";
                let isCompleted = session.status === "completed" || session.is_completed;
                if (isGroup && session.members_pivot?.length > 0) {
                  isCompleted = isCompleted || session.members_pivot[0].is_completed;
                }
                let bgColor = "bg-white";
                let borderColor = "border-slate-200";
                let hoverBorderColor = "hover:border-slate-300";
                let titleColor = "text-slate-800";
                let badgeBgColor = "";
                let subtitleColor = "text-slate-500";
                if (isGroup) {
                  titleColor = "text-indigo-900";
                  badgeBgColor = "bg-indigo-50 text-indigo-700 border border-indigo-100";
                  if (isCompleted) {
                    titleColor = "text-purple-900";
                    badgeBgColor = "bg-purple-50 text-purple-700 border border-purple-100";
                  }
                } else {
                  titleColor = isCompleted ? "text-emerald-900" : "text-slate-800";
                  badgeBgColor = isCompleted ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-50 text-slate-700 border border-slate-200";
                }
                return /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `group/session relative p-2.5 rounded-md border text-left flex flex-col gap-2 transition-all shadow-sm hover:-translate-y-0.5 ${session.is_absent ? "opacity-60 bg-slate-50 border-slate-200 grayscale" : `hover:shadow-md ${bgColor} ${borderColor} ${hoverBorderColor}`}`,
                    children: session.is_absent ? /* @__PURE__ */ jsxs("div", { className: "block w-full pointer-events-none", children: [
                      /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between mb-2", children: /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 border border-slate-300", children: [
                        "Sesi ",
                        session.session_number,
                        " (Absen)"
                      ] }) }),
                      /* @__PURE__ */ jsx("div", { className: "text-sm font-bold leading-snug line-clamp-2 text-slate-400", children: isGroup ? `[GRUP] ${session.group?.name || "Sesi Grup"}` : session.name || "Sesi Privat" }),
                      /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-col gap-1.5 opacity-60", children: session.training_type && /* @__PURE__ */ jsxs("div", { className: "text-xs font-semibold flex items-center gap-1.5 text-slate-400", children: [
                        /* @__PURE__ */ jsx(Dumbbell, { size: 12, className: "shrink-0" }),
                        /* @__PURE__ */ jsx("span", { className: "truncate", children: session.training_type })
                      ] }) })
                    ] }) : /* @__PURE__ */ jsxs(
                      Link,
                      {
                        href: isGroup ? route("admin.group-trainings.session.show", session.id) + "?from=athlete&athlete_id=" + athlete.id : route("admin.individual-trainings.session.show", session.id),
                        className: "block w-full",
                        children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-2", children: [
                            session.is_extra ? /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 border border-orange-200`, children: "Sesi Tambahan" }) : /* @__PURE__ */ jsxs("span", { className: `text-[10px] font-bold px-1.5 py-0.5 rounded ${badgeBgColor}`, children: [
                              "Sesi ",
                              session.display_session_number || session.session_number,
                              "/",
                              isGroup ? session.group?.package?.session_count || "∞" : athlete.package?.session_count || "∞"
                            ] }),
                            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                              auth.user.role !== "athlete" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5 opacity-0 group-hover/session:opacity-100 transition-opacity", children: [
                                /* @__PURE__ */ jsx(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: (e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setSessionToDuplicate(session);
                                      setDuplicateDate(getLocalDateStr(/* @__PURE__ */ new Date()));
                                      setDuplicateModalOpen(true);
                                    },
                                    className: `p-1 rounded inline-flex items-center justify-center ${isCompleted ? isGroup ? "hover:bg-purple-200 text-purple-700" : "hover:bg-emerald-200 text-emerald-700" : isGroup ? "hover:bg-indigo-200 text-indigo-700" : "hover:bg-orange-200 text-orange-700"}`,
                                    title: "Duplikasi Program",
                                    children: /* @__PURE__ */ jsx(Copy, { size: 12 })
                                  }
                                ),
                                !isGroup && /* @__PURE__ */ jsx(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: (e) => {
                                      e.preventDefault();
                                      router.get(route("admin.individual-trainings.session.edit", session.id));
                                    },
                                    className: `p-1 rounded inline-flex items-center justify-center hover:bg-slate-200 text-slate-600`,
                                    title: "Edit Program",
                                    children: /* @__PURE__ */ jsx(Edit2, { size: 12 })
                                  }
                                ),
                                /* @__PURE__ */ jsx(
                                  "button",
                                  {
                                    onClick: (e) => isGroup ? null : deleteSession(e, session.id),
                                    className: `p-1 rounded inline-flex items-center justify-center ${isCompleted ? isGroup ? "hover:bg-purple-200 text-red-600" : "hover:bg-emerald-200 text-red-600" : isGroup ? "hover:bg-indigo-200 text-red-600" : "hover:bg-orange-200 text-red-600"}`,
                                    title: "Hapus",
                                    children: /* @__PURE__ */ jsx(Trash2, { size: 12 })
                                  }
                                )
                              ] }),
                              isCompleted ? /* @__PURE__ */ jsx(CheckCircle2, { size: 14, className: `${isGroup ? "text-purple-600" : "text-green-600"} ml-0.5 mr-1` }) : /* @__PURE__ */ jsx(Clock, { size: 14, className: `${isGroup ? "text-indigo-500" : "text-orange-500"} ml-0.5 mr-1` })
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: `text-sm font-bold leading-snug line-clamp-2 ${titleColor}`, children: [
                            isGroup ? `[GRUP] ${session.group?.name || "Sesi Grup"}` : session.name || "Sesi Privat",
                            session.is_makeup && /* @__PURE__ */ jsx("span", { className: "ml-1.5 text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider inline-block", children: "GUEST" })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-col gap-1.5", children: [
                            session.training_type && /* @__PURE__ */ jsxs("div", { className: `text-xs font-semibold flex items-center gap-1.5 ${subtitleColor}`, children: [
                              /* @__PURE__ */ jsx(Dumbbell, { size: 12, className: "shrink-0" }),
                              /* @__PURE__ */ jsx("span", { className: "truncate", children: session.training_type })
                            ] }),
                            session.location && /* @__PURE__ */ jsxs("div", { className: `text-xs font-semibold flex items-center gap-1.5 ${subtitleColor}`, children: [
                              /* @__PURE__ */ jsx(MapPin, { size: 12, className: "shrink-0" }),
                              /* @__PURE__ */ jsx("span", { className: "truncate", children: session.location })
                            ] }),
                            session.duration_minutes && /* @__PURE__ */ jsxs("div", { className: `text-xs font-semibold flex items-center gap-1.5 ${subtitleColor}`, children: [
                              /* @__PURE__ */ jsx(Timer, { size: 12, className: "shrink-0" }),
                              /* @__PURE__ */ jsxs("span", { className: "truncate", children: [
                                session.duration_minutes,
                                " Menit"
                              ] })
                            ] })
                          ] })
                        ]
                      }
                    )
                  },
                  `${session.type}-${session.id}`
                );
              }) })
            ]
          },
          idx
        )) })
      ] }) })
    ] }) }),
    duplicateModalOpen && sessionToDuplicate && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-slate-100 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800", children: "Duplikasi Sesi Latihan" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setDuplicateModalOpen(false), className: "text-slate-400 hover:text-slate-600", children: /* @__PURE__ */ jsx(X, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 border border-slate-200 rounded-lg p-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 font-medium mb-1", children: "Sesi yang Diduplikasi:" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-800", children: sessionToDuplicate.type === "group" ? `[GRUP] ${sessionToDuplicate.group?.name || "Sesi Grup"}` : sessionToDuplicate.name || "Sesi Privat" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: sessionToDuplicate.training_type })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Tanggal Tujuan" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              value: duplicateDate,
              onChange: (e) => setDuplicateDate(e.target.value),
              className: "w-full border-slate-300 rounded-lg shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setDuplicateModalOpen(false),
            className: "px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800",
            children: "Batal"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              if (!duplicateDate) return;
              const routeName = sessionToDuplicate.type === "group" ? "admin.group-trainings.session.duplicate" : "admin.individual-trainings.session.duplicate";
              router.post(route(routeName, sessionToDuplicate.id), { target_date: duplicateDate }, {
                preserveScroll: true,
                onSuccess: () => setDuplicateModalOpen(false)
              });
            },
            className: "px-4 py-2 text-sm font-bold bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition-colors",
            children: "Duplikasi Sesi"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("style", { children: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 10px;
                }
            ` })
  ] });
}
export {
  ShowAthlete as default
};
