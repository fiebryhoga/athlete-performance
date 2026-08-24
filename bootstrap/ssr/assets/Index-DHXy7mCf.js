import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { useForm, Head, router } from "@inertiajs/react";
import { useState, useCallback } from "react";
import { Settings, Shield, Clock, Navigation, LogIn, CheckCircle2, MapPin, Smartphone, LogOut, Calendar, ChevronLeft, ChevronRight, Edit3, X, Trash2 } from "lucide-react";
import { P as PageHeader } from "./PageHeader-BXFyVdi4.js";
import { P as PageFooter } from "./PageFooter-BbeHbnjC.js";
import "axios";
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371e3;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function Index({
  auth,
  attendances = [],
  gymLocation = {},
  todayAttendance = null,
  recapData = null,
  myStats = null,
  currentMonth,
  currentYear
}) {
  const isSuperadmin = auth.user.role === "superadmin";
  const isCoach = auth.user.role === "coach";
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
  const navigateMonth = (dir) => {
    let m = currentMonth + dir;
    let y = currentYear;
    if (m < 1) {
      m = 12;
      y--;
    }
    if (m > 12) {
      m = 1;
      y++;
    }
    router.get(
      route("admin.gym-attendance.index"),
      { month: m, year: y },
      { preserveState: true, replace: true }
    );
  };
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();
  const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const calendarDays = [];
  for (let i = 0; i < adjustedFirstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);
  const getAttendancesForDay = (day) => {
    if (!day) return [];
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return attendances.filter(
      (a) => a.date === dateStr || a.date?.startsWith(dateStr)
    );
  };
  const getDayStatus = (atts) => {
    if (atts.length === 0) return null;
    return "on_time";
  };
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedGuard, setSelectedGuard] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Konfirmasi",
    isDanger: false,
    isLoading: false,
    onConfirm: null
  });
  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
  };
  const locationForm = useForm({
    latitude: gymLocation.latitude || "",
    longitude: gymLocation.longitude || "",
    radius: gymLocation.radius || 50,
    fee: gymLocation.fee || 0
  });
  const guardFeeForm = useForm({
    gym_fee: ""
  });
  const openGuardFeeModal = (guard) => {
    setSelectedGuard(guard);
    guardFeeForm.setData(
      "gym_fee",
      guard.gym_fee !== null && guard.gym_fee !== void 0 ? guard.gym_fee : ""
    );
    setActiveModal("guardFee");
  };
  const submitGuardFee = (e) => {
    e.preventDefault();
    if (!selectedGuard) return;
    guardFeeForm.post(
      route("admin.gym-attendance.guard-fee.update", selectedGuard.id),
      {
        onSuccess: () => setActiveModal(null)
      }
    );
  };
  const submitLocation = (e) => {
    e.preventDefault();
    locationForm.post(route("admin.gym-attendance.location.update"), {
      onSuccess: () => setActiveModal(null)
    });
  };
  const [gpsStatus, setGpsStatus] = useState("idle");
  const getUserLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      setGpsStatus("loading");
      if (!navigator.geolocation) {
        const err = "Browser tidak mendukung Geolocation.";
        setGpsStatus("error");
        reject(err);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          let dist = null;
          if (gymLocation.latitude && gymLocation.longitude) {
            dist = haversineDistance(
              coords.lat,
              coords.lng,
              parseFloat(gymLocation.latitude),
              parseFloat(gymLocation.longitude)
            );
          }
          setGpsStatus("success");
          resolve({ coords, dist });
        },
        (err) => {
          const errorMsg = "Gagal mendapatkan lokasi: " + err.message;
          setGpsStatus("error");
          reject(errorMsg);
        },
        { enableHighAccuracy: true, timeout: 15e3 }
      );
    });
  }, [gymLocation]);
  const handleCheckIn = () => {
    setConfirmModal({
      isOpen: true,
      title: "Mulai Sesi Jaga Gym",
      message: "Apakah Anda yakin ingin memulai sesi jaga gym sekarang? Lokasi GPS dan jam kehadiran Anda akan diverifikasi otomatis.",
      confirmText: "Mulai Bertugas",
      isDanger: false,
      isLoading: false,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        try {
          const { coords, dist } = await getUserLocation();
          const maxRadius = parseInt(gymLocation.radius) || 50;
          if (dist !== null && dist > maxRadius) {
            setErrorMessage(
              `Gagal: Anda berada di luar radius gym! (${Math.round(dist)}m / maks ${maxRadius}m)`
            );
            closeConfirmModal();
            return;
          }
          router.post(
            route("admin.gym-attendance.check-in"),
            {
              latitude: coords.lat,
              longitude: coords.lng
            },
            {
              onFinish: () => closeConfirmModal()
            }
          );
        } catch (error) {
          setErrorMessage(
            typeof error === "string" ? error : "Gagal mengakses GPS perangkat. Pastikan izin lokasi aktif."
          );
          closeConfirmModal();
        }
      }
    });
  };
  const checkoutForm = useForm({ notes: "", latitude: "", longitude: "" });
  const openCheckoutModal = () => {
    checkoutForm.reset();
    setActiveModal("checkout");
  };
  const submitCheckout = async (e) => {
    e.preventDefault();
    try {
      const { coords, dist } = await getUserLocation();
      const maxRadius = parseInt(gymLocation.radius) || 50;
      if (dist !== null && dist > maxRadius) {
        setErrorMessage(
          `Gagal: Anda berada di luar radius gym! (${Math.round(dist)}m / maks ${maxRadius}m)`
        );
        return;
      }
      checkoutForm.transform((data) => ({
        ...data,
        latitude: coords.lat,
        longitude: coords.lng
      }));
      checkoutForm.post(route("admin.gym-attendance.check-out"), {
        onSuccess: () => setActiveModal(null),
        onError: () => setErrorMessage("Terjadi kesalahan saat memproses check-out.")
      });
    } catch (error) {
      setErrorMessage(
        typeof error === "string" ? error : "Gagal mengakses GPS perangkat saat check-out."
      );
    }
  };
  const deleteAttendance = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Riwayat Absensi",
      message: "Apakah Anda yakin ingin menghapus data absensi ini? Data yang dihapus tidak dapat dipulihkan.",
      confirmText: "Hapus Data",
      isDanger: true,
      isLoading: false,
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        router.delete(route("admin.gym-attendance.destroy", id), {
          onSuccess: () => {
            closeConfirmModal();
            if (activeModal === "selectedDay") setActiveModal(null);
          },
          onFinish: () => closeConfirmModal()
        });
      }
    });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Manajemen Jaga Gym", children: [
    /* @__PURE__ */ jsx(Head, { title: "Manajemen Jaga Gym" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 pb-8", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Manajemen Jaga Gym",
          description: "Pantau jadwal piket dan absensi harian shift jaga gym pelatih dengan verifikasi geolokasi.",
          actions: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: isSuperadmin && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveModal("location"),
              className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-md transition-all shadow-2xs",
              children: [
                /* @__PURE__ */ jsx(Settings, { className: "w-3.5 h-3.5 text-slate-500" }),
                /* @__PURE__ */ jsx("span", { children: "Lokasi & Tarif" })
              ]
            }
          ) })
        }
      ),
      isCoach && /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs overflow-hidden transition-all", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 bg-gradient-to-r from-white via-orange-50/30 to-white border-b border-slate-200/80 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold text-slate-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4 text-orange-500" }),
            "Panel Absensi Hari Ini"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200/80", children: (/* @__PURE__ */ new Date()).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
          }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "p-4 sm:p-5", children: !todayAttendance ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3.5 text-center sm:text-left", children: [
            /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-md bg-orange-50 border border-orange-200/60 text-orange-600 flex items-center justify-center shrink-0 shadow-2xs", children: /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "text-xs sm:text-sm font-bold text-slate-800", children: "Belum Memulai Sesi Jaga" }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500 font-medium mt-0.5", children: "Lakukan check-in saat Anda sudah berada di lokasi gym untuk mencatat jam bertugas." })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleCheckIn,
              disabled: gpsStatus === "loading",
              className: "w-full sm:w-auto px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-2xs transition-all disabled:opacity-50 flex items-center justify-center gap-2 shrink-0",
              children: gpsStatus === "loading" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Navigation, { className: "w-3.5 h-3.5 animate-pulse" }),
                " ",
                "Memverifikasi Lokasi..."
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(LogIn, { className: "w-3.5 h-3.5" }),
                " ",
                "Mulai Bertugas (Check-in)"
              ] })
            }
          )
        ] }) : /* @__PURE__ */ jsx("div", { className: "bg-emerald-50/60 border border-emerald-200/80 rounded-md p-3.5 sm:p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/80", children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3" }),
                " ",
                "Sedang Bertugas"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-800", children: "Check-in Terverifikasi" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 mt-1", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 font-medium", children: [
                /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5 text-slate-400" }),
                " ",
                "Jam:",
                " ",
                /* @__PURE__ */ jsx("strong", { className: "font-bold text-slate-800", children: new Date(
                  todayAttendance.check_in_time
                ).toLocaleTimeString(
                  "id-ID"
                ) })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 font-medium", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 text-slate-400" }),
                " ",
                "Jarak:",
                " ",
                /* @__PURE__ */ jsxs("strong", { className: "font-bold text-slate-800", children: [
                  todayAttendance.check_in_distance,
                  " ",
                  "m"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 font-medium", children: [
                /* @__PURE__ */ jsx(Smartphone, { className: "w-3.5 h-3.5 text-slate-400" }),
                " ",
                "Device:",
                " ",
                todayAttendance.check_in_device?.substring(
                  0,
                  24
                ),
                "..."
              ] })
            ] })
          ] }),
          !todayAttendance.check_out_time ? /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: openCheckoutModal,
              className: "w-full sm:w-auto px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-2 shrink-0",
              children: [
                /* @__PURE__ */ jsx(LogOut, { className: "w-3.5 h-3.5 text-orange-400" }),
                " ",
                "Selesai Bertugas (Check-out)"
              ]
            }
          ) : /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 mb-1", children: [
              /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 text-emerald-600" }),
              " ",
              "Tugas Selesai"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-slate-500", children: [
              "Check-out:",
              " ",
              /* @__PURE__ */ jsx("strong", { className: "text-slate-700", children: new Date(
                todayAttendance.check_out_time
              ).toLocaleTimeString(
                "id-ID"
              ) })
            ] })
          ] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-4 items-start", children: [
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-8 space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 bg-gradient-to-r from-white via-orange-50/30 to-white border-b border-slate-200/80 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold text-slate-900 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-orange-500" }),
              "Jadwal Shift Jaga Gym -",
              " ",
              monthNames[currentMonth - 1],
              " ",
              currentYear
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => navigateMonth(-1),
                  className: "p-1 rounded bg-white hover:bg-slate-100 border border-slate-200/80 text-slate-600 transition-colors",
                  title: "Bulan Sebelumnya",
                  children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => navigateMonth(1),
                  className: "p-1 rounded bg-white hover:bg-slate-100 border border-slate-200/80 text-slate-600 transition-colors",
                  title: "Bulan Berikutnya",
                  children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-3 sm:p-4", children: [
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-1.5 mb-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: [
              "Sen",
              "Sel",
              "Rab",
              "Kam",
              "Jum",
              "Sab",
              "Min"
            ].map((d) => /* @__PURE__ */ jsx("div", { children: d }, d)) }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-1.5", children: calendarDays.map((day, idx) => {
              if (!day)
                return /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "aspect-square bg-slate-50/40 rounded-md border border-slate-100/60"
                  },
                  idx
                );
              const dayAtts = getAttendancesForDay(day);
              const status = getDayStatus(dayAtts);
              let bgClass = "bg-white hover:border-orange-400";
              let badgeColor = "bg-slate-300";
              if (status === "on_time") {
                bgClass = "bg-emerald-50/30 border-emerald-200/70 hover:border-emerald-400";
                badgeColor = "bg-emerald-500";
              }
              const isToday = day === (/* @__PURE__ */ new Date()).getDate() && currentMonth === (/* @__PURE__ */ new Date()).getMonth() + 1 && currentYear === (/* @__PURE__ */ new Date()).getFullYear();
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => {
                    setSelectedDay(day);
                    setActiveModal(
                      "selectedDay"
                    );
                  },
                  className: `relative aspect-square border ${isToday ? "border-orange-500 ring-1 ring-orange-500/50 bg-orange-50/20" : "border-slate-200/80"} rounded-md p-1.5 flex flex-col items-center justify-between transition-all group ${bgClass}`,
                  children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `text-[11px] font-bold leading-none ${isToday ? "text-orange-600" : "text-slate-700"}`,
                        children: day
                      }
                    ),
                    dayAtts.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-0.5 w-full", children: [
                      /* @__PURE__ */ jsxs("span", { className: "text-[9px] font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-200/60 px-1 rounded-sm w-full truncate text-center", children: [
                        dayAtts.length,
                        " ",
                        "Jaga"
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-0.5", children: dayAtts.slice(0, 3).map((a, i) => /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: `w-1 h-1 rounded-full ${badgeColor}`
                        },
                        i
                      )) })
                    ] }) : /* @__PURE__ */ jsx("div", { className: "h-1" })
                  ]
                },
                idx
              );
            }) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-6 text-[11px] text-slate-500 font-medium", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500" }),
                /* @__PURE__ */ jsx("span", { children: "Tercatat bertugas" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full border border-slate-300 bg-white" }),
                /* @__PURE__ */ jsx("span", { children: "Kosong" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full border border-orange-500 bg-orange-100" }),
                /* @__PURE__ */ jsx("span", { children: "Hari ini" })
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 space-y-4", children: [
          isSuperadmin && /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-white via-white to-orange-50/40 rounded-lg border border-slate-200/80 shadow-2xs overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-b border-slate-100/80 flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-slate-900", children: "Lokasi & Tarif Dasar Gym" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setActiveModal("location"),
                  className: "p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors",
                  title: "Ubah Pengaturan Lokasi & Tarif Default",
                  children: /* @__PURE__ */ jsx(Edit3, { className: "w-3.5 h-3.5" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 space-y-2 text-xs", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-slate-600 py-0.5", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[11px] text-slate-500 font-medium", children: "Koordinat:" }),
                /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-semibold text-slate-800", children: [
                  gymLocation.latitude || "-",
                  ",",
                  " ",
                  gymLocation.longitude || "-"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-slate-600 py-0.5", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[11px] text-slate-500 font-medium", children: "Radius Maksimal:" }),
                /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-semibold text-slate-800", children: [
                  gymLocation.radius || 50,
                  " meter"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-slate-600 pt-2 border-t border-slate-100", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[11px] text-slate-500 font-medium", children: "Tarif Default / Shift:" }),
                /* @__PURE__ */ jsxs("span", { className: "font-bold text-emerald-600 text-xs", children: [
                  "Rp",
                  " ",
                  Number(
                    gymLocation.fee || 0
                  ).toLocaleString("id-ID")
                ] })
              ] })
            ] })
          ] }),
          isSuperadmin ? (
            /* Superadmin: Rekapitulasi Seluruh Penjaga */
            /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-white via-white to-orange-50/40 rounded-lg border border-slate-200/80 shadow-2xs overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-b border-slate-100/80 flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-slate-900", children: "Rekapitulasi Penjaga Gym" }),
                /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-medium text-slate-400", children: [
                  recapData?.length || 0,
                  " Coach"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "p-3 space-y-2.5", children: recapData && recapData.length > 0 ? recapData.map((guard) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "bg-white rounded-md border border-slate-200/70 p-3 shadow-2xs hover:border-orange-200/80 transition-all space-y-2",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-orange-100 text-orange-600 overflow-hidden flex items-center justify-center text-[10px] font-bold shrink-0", children: guard.profile_photo ? /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: guard.profile_photo,
                            alt: "",
                            className: "w-full h-full object-cover"
                          }
                        ) : guard.name.charAt(0).toUpperCase() }),
                        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-800 leading-tight", children: guard.name })
                      ] }),
                      /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-slate-500 font-medium", children: [
                        guard.total_shifts,
                        " sesi"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[11px] pt-1", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-slate-600", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "Tarif:" }),
                        /* @__PURE__ */ jsxs("span", { className: "font-semibold text-slate-800", children: [
                          "Rp",
                          " ",
                          Number(
                            guard.effective_gym_fee || 0
                          ).toLocaleString(
                            "id-ID"
                          )
                        ] }),
                        guard.gym_fee !== null && guard.gym_fee > 0 && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-orange-600", children: "(Khusus)" })
                      ] }),
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          onClick: () => openGuardFeeModal(
                            guard
                          ),
                          className: "text-[11px] font-semibold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1",
                          title: "Ubah tarif khusus untuk coach ini",
                          children: [
                            /* @__PURE__ */ jsx(Edit3, { className: "w-3 h-3" }),
                            " ",
                            "Ubah"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "Belum dicairkan:" }),
                      /* @__PURE__ */ jsxs("span", { className: "font-bold text-rose-600", children: [
                        guard.unpaid_shifts,
                        " Hari",
                        guard.unpaid_amount > 0 && /* @__PURE__ */ jsxs("span", { className: "font-medium text-slate-500 ml-1", children: [
                          "(Rp",
                          " ",
                          Number(
                            guard.unpaid_amount || 0
                          ).toLocaleString(
                            "id-ID"
                          ),
                          ")"
                        ] })
                      ] })
                    ] })
                  ]
                },
                guard.id
              )) : /* @__PURE__ */ jsx("div", { className: "text-center text-xs text-slate-400 py-6 italic", children: "Belum ada penjaga gym terdaftar." }) })
            ] })
          ) : (
            /* Coach: Ringkasan Tugas & Honor Jaga Saya */
            /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-white via-white to-orange-50/40 rounded-lg border border-slate-200/80 shadow-2xs overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-b border-slate-100/80 flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-slate-900", children: "Ringkasan Tugas & Honor Saya" }),
                /* @__PURE__ */ jsx("span", { className: "text-[10.5px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60", children: "Penjaga Aktif" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-3.5 space-y-3 text-xs", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-md p-3 border border-slate-200/70 space-y-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-slate-600", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] text-slate-500 font-medium", children: "Tugas Bulan Ini:" }),
                    /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-800 text-xs", children: [
                      myStats?.total_shifts_month || 0,
                      " Sesi"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-slate-100", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] text-slate-500 font-medium", children: "Belum Dicairkan:" }),
                    /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                      /* @__PURE__ */ jsxs("span", { className: "font-bold text-rose-600 text-xs", children: [
                        myStats?.unpaid_shifts || 0,
                        " Hari"
                      ] }),
                      (myStats?.unpaid_amount || 0) > 0 && /* @__PURE__ */ jsxs("div", { className: "text-[10.5px] font-semibold text-slate-600", children: [
                        "Rp",
                        " ",
                        Number(
                          myStats?.unpaid_amount || 0
                        ).toLocaleString("id-ID")
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-2.5 bg-orange-50/50 rounded-md border border-orange-100/80 text-[10.5px] text-slate-600 space-y-1", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-bold text-orange-800", children: "Ketentuan Absensi:" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-slate-500 leading-relaxed", children: [
                    "Wajib mengaktifkan GPS dan berada dalam radius ",
                    /* @__PURE__ */ jsxs("strong", { children: [
                      gymLocation.radius || 50,
                      " meter"
                    ] }),
                    " dari lokasi gym saat Check-in dan Check-out."
                  ] })
                ] })
              ] })
            ] })
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx(PageFooter, { className: "!mt-2 !pt-1 !pb-0" })
    ] }),
    activeModal === "checkout" && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-slate-200/80 shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-white via-orange-50/20 to-white", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xs sm:text-[13px] font-bold text-slate-900", children: "Selesai Bertugas & Catatan Harian" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveModal(null),
            className: "text-slate-400 hover:text-slate-600 transition-colors",
            children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: submitCheckout,
          className: "p-4 space-y-3",
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: [
                "Catatan Pekerjaan / Laporan Shift",
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-rose-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-[10.5px] text-slate-500 mb-2", children: "Tuliskan kegiatan atau kondisi fasilitas selama bertugas hari ini." }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: checkoutForm.data.notes,
                  onChange: (e) => checkoutForm.setData(
                    "notes",
                    e.target.value
                  ),
                  className: "w-full border border-slate-200 rounded-md text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 h-24 p-2.5 outline-none",
                  required: true,
                  placeholder: "Contoh: Merapikan barbel, mendampingi member baru, dan mengecek treadmill."
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-3 border-t border-slate-100", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveModal(null),
                  className: "flex-1 py-2 rounded-md bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors shadow-2xs",
                  children: "Batal"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: checkoutForm.processing || gpsStatus === "loading",
                  className: "flex-1 py-2 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-2xs",
                  children: gpsStatus === "loading" || checkoutForm.processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Navigation, { className: "w-3.5 h-3.5 animate-pulse" }),
                    " ",
                    "Memproses..."
                  ] }) : /* @__PURE__ */ jsx(Fragment, { children: "Konfirmasi Check-out" })
                }
              )
            ] })
          ]
        }
      )
    ] }) }),
    activeModal === "selectedDay" && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs",
        onClick: () => setActiveModal(null),
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-white rounded-lg border border-slate-200/80 shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-white via-orange-50/20 to-white", children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-xs sm:text-[13px] font-bold text-slate-900", children: [
                  "Detail Absensi - ",
                  selectedDay,
                  " ",
                  monthNames[currentMonth - 1],
                  " ",
                  currentYear
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setActiveModal(null),
                    className: "text-slate-400 hover:text-slate-600 transition-colors",
                    children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "p-4 overflow-y-auto space-y-3", children: getAttendancesForDay(selectedDay).length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-slate-400 text-xs italic", children: "Tidak ada absen jaga pada tanggal ini." }) : getAttendancesForDay(selectedDay).map((att) => {
                const isOwn = isCoach && auth.user.id === att.user_id;
                const canDelete = isSuperadmin || isOwn;
                return /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "border border-slate-200/80 rounded-lg p-3.5 bg-gradient-to-br from-white via-white to-orange-50/40 shadow-2xs group relative space-y-2.5",
                    children: [
                      canDelete && /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => deleteAttendance(att.id),
                          className: "absolute top-3 right-3 p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 rounded-md transition-colors opacity-0 group-hover:opacity-100 shadow-2xs",
                          title: "Hapus Data",
                          children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                        /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs uppercase shrink-0 overflow-hidden", children: att.user?.profile_photo ? /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: att.user.profile_photo_url || `/storage/${att.user.profile_photo}`,
                            alt: "",
                            className: "w-full h-full object-cover"
                          }
                        ) : att.user?.name?.substring(0, 2).toUpperCase() }),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("div", { className: "text-xs font-bold text-slate-900 leading-tight", children: att.user?.name }),
                          /* @__PURE__ */ jsxs("div", { className: "text-[10.5px] text-slate-500 font-medium mt-0.5", children: [
                            "Check-in:",
                            " ",
                            /* @__PURE__ */ jsx("span", { className: "text-slate-800 font-bold", children: att.check_in_time ? new Date(
                              att.check_in_time
                            ).toLocaleTimeString(
                              "id-ID"
                            ) : "-" }),
                            " |  Check-out:",
                            " ",
                            /* @__PURE__ */ jsx("span", { className: "text-slate-800 font-bold", children: att.check_out_time ? new Date(
                              att.check_out_time
                            ).toLocaleTimeString(
                              "id-ID"
                            ) : "-" })
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-slate-500 pt-2 border-t border-slate-100/80", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                          /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3 text-slate-400 shrink-0" }),
                          /* @__PURE__ */ jsxs("span", { children: [
                            "Radius In:",
                            " ",
                            /* @__PURE__ */ jsxs("strong", { className: "text-slate-700", children: [
                              att.check_in_distance,
                              "m"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "|" }),
                          /* @__PURE__ */ jsxs("span", { children: [
                            "Out:",
                            " ",
                            /* @__PURE__ */ jsx("strong", { className: "text-slate-700", children: att.check_out_distance !== null ? `${att.check_out_distance}m` : "-" })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs(
                          "div",
                          {
                            className: "flex items-center gap-1 text-slate-400 truncate max-w-[200px]",
                            title: att.check_in_device,
                            children: [
                              /* @__PURE__ */ jsx(Smartphone, { className: "w-3 h-3 shrink-0" }),
                              /* @__PURE__ */ jsxs("span", { className: "truncate", children: [
                                att.check_in_device?.substring(
                                  0,
                                  25
                                ),
                                "..."
                              ] })
                            ]
                          }
                        )
                      ] }),
                      att.notes && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-md border border-slate-200/70 p-2.5 text-[11px] text-slate-700 shadow-2xs space-y-0.5", children: [
                        /* @__PURE__ */ jsx("div", { className: "text-[9.5px] font-bold text-slate-400 uppercase tracking-wider", children: "Catatan Tugas:" }),
                        /* @__PURE__ */ jsxs("p", { className: "leading-relaxed text-slate-700 font-medium", children: [
                          '"',
                          att.notes,
                          '"'
                        ] })
                      ] })
                    ]
                  },
                  att.id
                );
              }) })
            ]
          }
        )
      }
    ),
    isSuperadmin && activeModal === "location" && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-slate-200/80 shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-white via-orange-50/20 to-white", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xs sm:text-[13px] font-bold text-slate-900", children: "Pengaturan Lokasi & Tarif Default Gym" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveModal(null),
            className: "text-slate-400 hover:text-slate-600 transition-colors",
            children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: submitLocation,
          className: "p-4 space-y-3",
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "Latitude" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: locationForm.data.latitude,
                  onChange: (e) => locationForm.setData(
                    "latitude",
                    e.target.value
                  ),
                  className: "w-full border border-slate-200 rounded-md text-xs py-2 px-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "Longitude" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: locationForm.data.longitude,
                  onChange: (e) => locationForm.setData(
                    "longitude",
                    e.target.value
                  ),
                  className: "w-full border border-slate-200 rounded-md text-xs py-2 px-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "Radius Toleransi (Meter)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: locationForm.data.radius,
                  onChange: (e) => locationForm.setData(
                    "radius",
                    e.target.value
                  ),
                  className: "w-full border border-slate-200 rounded-md text-xs py-2 px-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none",
                  min: "10",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "Tarif Default Sekali Jaga (Rp)" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400", children: "Rp" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    value: locationForm.data.fee,
                    onChange: (e) => locationForm.setData(
                      "fee",
                      e.target.value
                    ),
                    className: "w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none",
                    min: "0",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 mt-1", children: "Tarif dasar yang diterapkan jika penjaga tidak memiliki tarif khusus." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-2 border-t border-slate-100", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveModal(null),
                  className: "flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-md font-bold text-xs hover:bg-slate-50 transition-colors shadow-2xs",
                  children: "Batal"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: locationForm.processing,
                  className: "flex-1 py-2 bg-orange-600 text-white rounded-md font-bold text-xs hover:bg-orange-700 transition-colors shadow-2xs",
                  children: "Simpan Perubahan"
                }
              )
            ] })
          ]
        }
      )
    ] }) }),
    isSuperadmin && activeModal === "guardFee" && selectedGuard && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-slate-200/80 shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-white via-orange-50/20 to-white", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xs sm:text-[13px] font-bold text-slate-900", children: "Atur Tarif Jaga Gym" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveModal(null),
            className: "text-slate-400 hover:text-slate-600 transition-colors",
            children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: submitGuardFee,
          className: "p-4 space-y-3.5",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-white via-white to-orange-50/40 border border-slate-200/80 rounded-md p-3 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-xs flex items-center justify-center shrink-0", children: selectedGuard.profile_photo ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: selectedGuard.profile_photo,
                    alt: "",
                    className: "w-full h-full rounded-full object-cover"
                  }
                ) : selectedGuard.name.charAt(0).toUpperCase() }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "text-xs font-bold text-slate-900", children: selectedGuard.name }),
                  /* @__PURE__ */ jsx("div", { className: "text-[10.5px] text-slate-500 font-medium", children: "Penjaga Gym" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsx("div", { className: "text-[10px] text-slate-400 font-medium", children: "Tarif Default" }),
                /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold text-emerald-600", children: [
                  "Rp",
                  " ",
                  Number(
                    gymLocation.fee || 0
                  ).toLocaleString("id-ID")
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5", children: "Tarif Khusus Pelatih (Rp / shift)" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400", children: "Rp" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    value: guardFeeForm.data.gym_fee,
                    onChange: (e) => guardFeeForm.setData(
                      "gym_fee",
                      e.target.value
                    ),
                    className: "w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-2xs",
                    placeholder: "Kosongkan untuk tarif default",
                    min: "0"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-[10.5px] text-slate-500 mt-1.5 leading-relaxed", children: [
                "Kosongkan (atau isi 0) jika ingin mengikuti tarif default gym (Rp",
                " ",
                Number(
                  gymLocation.fee || 0
                ).toLocaleString("id-ID"),
                ")."
              ] }),
              guardFeeForm.data.gym_fee && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => guardFeeForm.setData("gym_fee", ""),
                  className: "text-[10.5px] font-bold text-orange-600 hover:text-orange-700 hover:underline mt-1 inline-block",
                  children: "Gunakan Tarif Default"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-2 border-t border-slate-100", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveModal(null),
                  className: "flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-md font-bold text-xs hover:bg-slate-50 transition-colors shadow-2xs",
                  children: "Batal"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: guardFeeForm.processing,
                  className: "flex-1 py-2 bg-orange-600 text-white rounded-md font-bold text-xs hover:bg-orange-700 transition-colors shadow-2xs",
                  children: "Simpan Tarif"
                }
              )
            ] })
          ]
        }
      )
    ] }) }),
    confirmModal.isOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-slate-200/80 shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-white via-orange-50/20 to-white", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xs sm:text-[13px] font-bold text-slate-900", children: confirmModal.title }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: closeConfirmModal,
            className: "text-slate-400 hover:text-slate-600 transition-colors",
            children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-3", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: confirmModal.message }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-2 border-t border-slate-100", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: closeConfirmModal,
              className: "flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-md font-bold text-xs hover:bg-slate-50 transition-colors shadow-2xs",
              children: "Batal"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: confirmModal.onConfirm,
              disabled: confirmModal.isLoading,
              className: `flex-1 py-2 ${confirmModal.isDanger ? "bg-rose-600 hover:bg-rose-700" : "bg-orange-600 hover:bg-orange-700"} text-white rounded-md font-bold text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5`,
              children: confirmModal.isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Navigation, { className: "w-3.5 h-3.5 animate-pulse" }),
                " ",
                "Memproses..."
              ] }) : confirmModal.confirmText
            }
          )
        ] })
      ] })
    ] }) }),
    errorMessage && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-slate-200/80 shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-white via-orange-50/20 to-white", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xs sm:text-[13px] font-bold text-slate-900", children: "Pemberitahuan" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setErrorMessage(null),
            className: "text-slate-400 hover:text-slate-600 transition-colors",
            children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-3", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-700 leading-relaxed", children: errorMessage }),
        /* @__PURE__ */ jsx("div", { className: "pt-2 border-t border-slate-100 flex justify-end", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setErrorMessage(null),
            className: "w-full py-2 bg-orange-600 text-white rounded-md font-bold text-xs hover:bg-orange-700 transition-colors shadow-2xs",
            children: "Mengerti"
          }
        ) })
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
