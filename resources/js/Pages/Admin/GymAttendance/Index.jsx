import AppLayout from "@/Layouts/AppLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useState, useCallback } from "react";
import {
    Building2,
    Clock,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Trash2,
    X,
    CheckCircle2,
    Calendar,
    Settings,
    LogIn,
    LogOut,
    Navigation,
    Shield,
    Banknote,
    Smartphone,
    FileText,
    Edit3,
    User,
    Sparkles,
    AlertCircle,
    Info,
    Flame,
    Eye,
} from "lucide-react";
import PageHeader from "@/Components/Common/PageHeader";
import PageFooter from "@/Components/Common/PageFooter";

// ─── Haversine Distance (meters) ───
function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function Index({
    auth,
    attendances = [],
    gymLocation = {},
    todayAttendance = null,
    recapData = null,
    myStats = null,
    currentMonth,
    currentYear,
}) {
    const isSuperadmin = auth.user.role === "superadmin";
    const isCoach = auth.user.role === "coach";

    // ─── MONTH NAVIGATION ───
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
        "Desember",
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
            { preserveState: true, replace: true },
        );
    };

    // ─── CALENDAR DATA ───
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0=Sun
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Mon=0

    const calendarDays = [];
    for (let i = 0; i < adjustedFirstDay; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

    const getAttendancesForDay = (day) => {
        if (!day) return [];
        const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return attendances.filter(
            (a) => a.date === dateStr || a.date?.startsWith(dateStr),
        );
    };

    const getDayStatus = (atts) => {
        if (atts.length === 0) return null;
        return "on_time";
    };

    // ─── MODALS & CONFIRMATION STATE ───
    const [activeModal, setActiveModal] = useState(null); // 'checkout', 'location', 'selectedDay', 'guardFee'
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
        onConfirm: null,
    });

    const closeConfirmModal = () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
    };

    const locationForm = useForm({
        latitude: gymLocation.latitude || "",
        longitude: gymLocation.longitude || "",
        radius: gymLocation.radius || 50,
        fee: gymLocation.fee || 0,
    });

    const guardFeeForm = useForm({
        gym_fee: "",
    });

    const openGuardFeeModal = (guard) => {
        setSelectedGuard(guard);
        guardFeeForm.setData(
            "gym_fee",
            guard.gym_fee !== null && guard.gym_fee !== undefined
                ? guard.gym_fee
                : "",
        );
        setActiveModal("guardFee");
    };

    const submitGuardFee = (e) => {
        e.preventDefault();
        if (!selectedGuard) return;
        guardFeeForm.post(
            route("admin.gym-attendance.guard-fee.update", selectedGuard.id),
            {
                onSuccess: () => setActiveModal(null),
            },
        );
    };

    const submitLocation = (e) => {
        e.preventDefault();
        locationForm.post(route("admin.gym-attendance.location.update"), {
            onSuccess: () => setActiveModal(null),
        });
    };

    // ─── GPS & CHECK-IN/OUT ───
    const [gpsStatus, setGpsStatus] = useState("idle"); // idle, loading, success, error

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
                        lng: pos.coords.longitude,
                    };
                    let dist = null;
                    if (gymLocation.latitude && gymLocation.longitude) {
                        dist = haversineDistance(
                            coords.lat,
                            coords.lng,
                            parseFloat(gymLocation.latitude),
                            parseFloat(gymLocation.longitude),
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
                { enableHighAccuracy: true, timeout: 15000 },
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
                            longitude: coords.lng,
                        },
                        {
                            onFinish: () => closeConfirmModal(),
                        }
                    );
                } catch (error) {
                    setErrorMessage(
                        typeof error === "string"
                            ? error
                            : "Gagal mengakses GPS perangkat. Pastikan izin lokasi aktif."
                    );
                    closeConfirmModal();
                }
            },
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
                longitude: coords.lng,
            }));

            checkoutForm.post(route("admin.gym-attendance.check-out"), {
                onSuccess: () => setActiveModal(null),
                onError: () => setErrorMessage("Terjadi kesalahan saat memproses check-out."),
            });
        } catch (error) {
            setErrorMessage(
                typeof error === "string"
                    ? error
                    : "Gagal mengakses GPS perangkat saat check-out."
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
                    onFinish: () => closeConfirmModal(),
                });
            },
        });
    };

    return (
        <AppLayout title="Manajemen Jaga Gym">
            <Head title="Manajemen Jaga Gym" />

            <div className="space-y-4 pb-8">
                {/* ─── 1. PAGE HEADER ─── */}
                <PageHeader
                    title="Manajemen Jaga Gym"
                    description="Pantau jadwal piket dan absensi harian shift jaga gym pelatih dengan verifikasi geolokasi."
                    actions={
                        <div className="flex items-center gap-2">
                            {isSuperadmin && (
                                <button
                                    onClick={() => setActiveModal("location")}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-md transition-all shadow-2xs"
                                >
                                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Lokasi & Tarif</span>
                                </button>
                            )}
                        </div>
                    }
                />

                {/* ─── 2. COACH: TODAY'S PANEL ─── */}
                {isCoach && (
                    <div className="bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs overflow-hidden transition-all">
                        <div className="px-4 py-3 bg-gradient-to-r from-white via-orange-50/30 to-white border-b border-slate-200/80 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-orange-500" />
                                Panel Absensi Hari Ini
                            </h3>
                            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200/80">
                                {new Date().toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                        </div>

                        <div className="p-4 sm:p-5">
                            {!todayAttendance ? (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3.5 text-center sm:text-left">
                                        <div className="w-11 h-11 rounded-md bg-orange-50 border border-orange-200/60 text-orange-600 flex items-center justify-center shrink-0 shadow-2xs">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                                                Belum Memulai Sesi Jaga
                                            </h4>
                                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                                Lakukan check-in saat Anda sudah
                                                berada di lokasi gym untuk
                                                mencatat jam bertugas.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCheckIn}
                                        disabled={gpsStatus === "loading"}
                                        className="w-full sm:w-auto px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-2xs transition-all disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
                                    >
                                        {gpsStatus === "loading" ? (
                                            <>
                                                <Navigation className="w-3.5 h-3.5 animate-pulse" />{" "}
                                                Memverifikasi Lokasi...
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="w-3.5 h-3.5" />{" "}
                                                Mulai Bertugas (Check-in)
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-md p-3.5 sm:p-4">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/80">
                                                    <CheckCircle2 className="w-3 h-3" />{" "}
                                                    Sedang Bertugas
                                                </span>
                                                <span className="text-xs font-bold text-slate-800">
                                                    Check-in Terverifikasi
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 mt-1">
                                                <span className="flex items-center gap-1 font-medium">
                                                    <Clock className="w-3.5 h-3.5 text-slate-400" />{" "}
                                                    Jam:{" "}
                                                    <strong className="font-bold text-slate-800">
                                                        {new Date(
                                                            todayAttendance.check_in_time,
                                                        ).toLocaleTimeString(
                                                            "id-ID",
                                                        )}
                                                    </strong>
                                                </span>
                                                <span className="flex items-center gap-1 font-medium">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />{" "}
                                                    Jarak:{" "}
                                                    <strong className="font-bold text-slate-800">
                                                        {
                                                            todayAttendance.check_in_distance
                                                        }{" "}
                                                        m
                                                    </strong>
                                                </span>
                                                <span className="flex items-center gap-1 font-medium">
                                                    <Smartphone className="w-3.5 h-3.5 text-slate-400" />{" "}
                                                    Device:{" "}
                                                    {todayAttendance.check_in_device?.substring(
                                                        0,
                                                        24,
                                                    )}
                                                    ...
                                                </span>
                                            </div>
                                        </div>

                                        {!todayAttendance.check_out_time ? (
                                            <button
                                                onClick={openCheckoutModal}
                                                className="w-full sm:w-auto px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-2 shrink-0"
                                            >
                                                <LogOut className="w-3.5 h-3.5 text-orange-400" />{" "}
                                                Selesai Bertugas (Check-out)
                                            </button>
                                        ) : (
                                            <div className="text-right">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 mb-1">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />{" "}
                                                    Tugas Selesai
                                                </span>
                                                <div className="text-[11px] text-slate-500">
                                                    Check-out:{" "}
                                                    <strong className="text-slate-700">
                                                        {new Date(
                                                            todayAttendance.check_out_time,
                                                        ).toLocaleTimeString(
                                                            "id-ID",
                                                        )}
                                                    </strong>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── 3. MAIN CONTENT GRID: CALENDAR (LEFT) & SIDEBAR (RIGHT) ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    {/* ────── LEFT COLUMN (8/12): CALENDAR WIDGET ────── */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden">
                            <div className="px-4 py-3 bg-gradient-to-r from-white via-orange-50/30 to-white border-b border-slate-200/80 flex items-center justify-between">
                                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-orange-500" />
                                    Jadwal Shift Jaga Gym -{" "}
                                    {monthNames[currentMonth - 1]} {currentYear}
                                </h3>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => navigateMonth(-1)}
                                        className="p-1 rounded bg-white hover:bg-slate-100 border border-slate-200/80 text-slate-600 transition-colors"
                                        title="Bulan Sebelumnya"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => navigateMonth(1)}
                                        className="p-1 rounded bg-white hover:bg-slate-100 border border-slate-200/80 text-slate-600 transition-colors"
                                        title="Bulan Berikutnya"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-3 sm:p-4">
                                <div className="grid grid-cols-7 gap-1.5 mb-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    {[
                                        "Sen",
                                        "Sel",
                                        "Rab",
                                        "Kam",
                                        "Jum",
                                        "Sab",
                                        "Min",
                                    ].map((d) => (
                                        <div key={d}>{d}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1.5">
                                    {calendarDays.map((day, idx) => {
                                        if (!day)
                                            return (
                                                <div
                                                    key={idx}
                                                    className="aspect-square bg-slate-50/40 rounded-md border border-slate-100/60"
                                                ></div>
                                            );

                                        const dayAtts =
                                            getAttendancesForDay(day);
                                        const status = getDayStatus(dayAtts);

                                        let bgClass =
                                            "bg-white hover:border-orange-400";
                                        let badgeColor = "bg-slate-300";
                                        if (status === "on_time") {
                                            bgClass =
                                                "bg-emerald-50/30 border-emerald-200/70 hover:border-emerald-400";
                                            badgeColor = "bg-emerald-500";
                                        }

                                        const isToday =
                                            day === new Date().getDate() &&
                                            currentMonth ===
                                                new Date().getMonth() + 1 &&
                                            currentYear ===
                                                new Date().getFullYear();

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setSelectedDay(day);
                                                    setActiveModal(
                                                        "selectedDay",
                                                    );
                                                }}
                                                className={`relative aspect-square border ${isToday ? "border-orange-500 ring-1 ring-orange-500/50 bg-orange-50/20" : "border-slate-200/80"} rounded-md p-1.5 flex flex-col items-center justify-between transition-all group ${bgClass}`}
                                            >
                                                <span
                                                    className={`text-[11px] font-bold leading-none ${isToday ? "text-orange-600" : "text-slate-700"}`}
                                                >
                                                    {day}
                                                </span>
                                                {dayAtts.length > 0 ? (
                                                    <div className="flex flex-col items-center gap-0.5 w-full">
                                                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-200/60 px-1 rounded-sm w-full truncate text-center">
                                                            {dayAtts.length}{" "}
                                                            Jaga
                                                        </span>
                                                        <div className="flex items-center gap-0.5">
                                                            {dayAtts
                                                                .slice(0, 3)
                                                                .map((a, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className={`w-1 h-1 rounded-full ${badgeColor}`}
                                                                    ></div>
                                                                ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-1"></div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-6 text-[11px] text-slate-500 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                        <span>Tercatat bertugas</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full border border-slate-300 bg-white"></div>
                                        <span>Kosong</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full border border-orange-500 bg-orange-100"></div>
                                        <span>Hari ini</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ────── RIGHT COLUMN (4/12): SETTINGS & RECAP ────── */}
                    <div className="lg:col-span-4 space-y-4">
                        {/* 1. Location Settings (Superadmin) */}
                        {isSuperadmin && (
                            <div className="bg-gradient-to-br from-white via-white to-orange-50/40 rounded-lg border border-slate-200/80 shadow-2xs overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100/80 flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-slate-900">
                                        Lokasi & Tarif Dasar Gym
                                    </h3>
                                    <button
                                        onClick={() =>
                                            setActiveModal("location")
                                        }
                                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                                        title="Ubah Pengaturan Lokasi & Tarif Default"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div className="p-3.5 space-y-2 text-xs">
                                    <div className="flex items-center justify-between text-slate-600 py-0.5">
                                        <span className="text-[11px] text-slate-500 font-medium">
                                            Koordinat:
                                        </span>
                                        <span className="text-[11px] font-semibold text-slate-800">
                                            {gymLocation.latitude || "-"},{" "}
                                            {gymLocation.longitude || "-"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-600 py-0.5">
                                        <span className="text-[11px] text-slate-500 font-medium">
                                            Radius Maksimal:
                                        </span>
                                        <span className="text-[11px] font-semibold text-slate-800">
                                            {gymLocation.radius || 50} meter
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-600 pt-2 border-t border-slate-100">
                                        <span className="text-[11px] text-slate-500 font-medium">
                                            Tarif Default / Shift:
                                        </span>
                                        <span className="font-bold text-emerald-600 text-xs">
                                            Rp{" "}
                                            {Number(
                                                gymLocation.fee || 0,
                                            ).toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. Right Sidebar Content: Superadmin vs Coach */}
                        {isSuperadmin ? (
                            /* Superadmin: Rekapitulasi Seluruh Penjaga */
                            <div className="bg-gradient-to-br from-white via-white to-orange-50/40 rounded-lg border border-slate-200/80 shadow-2xs overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100/80 flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-slate-900">
                                        Rekapitulasi Penjaga Gym
                                    </h3>
                                    <span className="text-[11px] font-medium text-slate-400">
                                        {recapData?.length || 0} Coach
                                    </span>
                                </div>
                                <div className="p-3 space-y-2.5">
                                    {recapData && recapData.length > 0 ? (
                                        recapData.map((guard) => (
                                            <div
                                                key={guard.id}
                                                className="bg-white rounded-md border border-slate-200/70 p-3 shadow-2xs hover:border-orange-200/80 transition-all space-y-2"
                                            >
                                                {/* Top Row: Avatar & Name & Total Sessions */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 overflow-hidden flex items-center justify-center text-[10px] font-bold shrink-0">
                                                            {guard.profile_photo ? (
                                                                <img
                                                                    src={
                                                                        guard.profile_photo
                                                                    }
                                                                    alt=""
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                guard.name
                                                                    .charAt(0)
                                                                    .toUpperCase()
                                                            )}
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-800 leading-tight">
                                                            {guard.name}
                                                        </span>
                                                    </div>
                                                    <span className="text-[11px] text-slate-500 font-medium">
                                                        {guard.total_shifts} sesi
                                                    </span>
                                                </div>

                                                {/* Middle Row: Fee per Shift & Edit button */}
                                                <div className="flex items-center justify-between text-[11px] pt-1">
                                                    <div className="flex items-center gap-1.5 text-slate-600">
                                                        <span className="text-slate-400">
                                                            Tarif:
                                                        </span>
                                                        <span className="font-semibold text-slate-800">
                                                            Rp{" "}
                                                            {Number(
                                                                guard.effective_gym_fee ||
                                                                    0,
                                                            ).toLocaleString(
                                                                "id-ID",
                                                            )}
                                                        </span>
                                                        {guard.gym_fee !== null &&
                                                            guard.gym_fee > 0 && (
                                                                <span className="text-[10px] font-bold text-orange-600">
                                                                    (Khusus)
                                                                </span>
                                                            )}
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            openGuardFeeModal(
                                                                guard,
                                                            )
                                                        }
                                                        className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
                                                        title="Ubah tarif khusus untuk coach ini"
                                                    >
                                                        <Edit3 className="w-3 h-3" />{" "}
                                                        Ubah
                                                    </button>
                                                </div>

                                                {/* Bottom Row: Unpaid Shifts */}
                                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                                                    <span className="text-slate-400">
                                                        Belum dicairkan:
                                                    </span>
                                                    <span className="font-bold text-rose-600">
                                                        {guard.unpaid_shifts} Hari
                                                        {guard.unpaid_amount >
                                                            0 && (
                                                            <span className="font-medium text-slate-500 ml-1">
                                                                (Rp{" "}
                                                                {Number(
                                                                    guard.unpaid_amount ||
                                                                        0,
                                                                ).toLocaleString(
                                                                    "id-ID",
                                                                )}
                                                                )
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-xs text-slate-400 py-6 italic">
                                            Belum ada penjaga gym terdaftar.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* Coach: Ringkasan Tugas & Honor Jaga Saya */
                            <div className="bg-gradient-to-br from-white via-white to-orange-50/40 rounded-lg border border-slate-200/80 shadow-2xs overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100/80 flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-slate-900">
                                        Ringkasan Tugas & Honor Saya
                                    </h3>
                                    <span className="text-[10.5px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                                        Penjaga Aktif
                                    </span>
                                </div>
                                <div className="p-3.5 space-y-3 text-xs">
                                    <div className="bg-white rounded-md p-3 border border-slate-200/70 space-y-2">
                                        <div className="flex items-center justify-between text-slate-600">
                                            <span className="text-[11px] text-slate-500 font-medium">
                                                Tugas Bulan Ini:
                                            </span>
                                            <span className="font-bold text-slate-800 text-xs">
                                                {myStats?.total_shifts_month || 0} Sesi
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                            <span className="text-[11px] text-slate-500 font-medium">
                                                Belum Dicairkan:
                                            </span>
                                            <div className="text-right">
                                                <span className="font-bold text-rose-600 text-xs">
                                                    {myStats?.unpaid_shifts || 0} Hari
                                                </span>
                                                {(myStats?.unpaid_amount || 0) > 0 && (
                                                    <div className="text-[10.5px] font-semibold text-slate-600">
                                                        Rp{" "}
                                                        {Number(
                                                            myStats?.unpaid_amount || 0,
                                                        ).toLocaleString("id-ID")}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-2.5 bg-orange-50/50 rounded-md border border-orange-100/80 text-[10.5px] text-slate-600 space-y-1">
                                        <div className="font-bold text-orange-800">Ketentuan Absensi:</div>
                                        <p className="text-slate-500 leading-relaxed">
                                            Wajib mengaktifkan GPS dan berada dalam radius <strong>{gymLocation.radius || 50} meter</strong> dari lokasi gym saat Check-in dan Check-out.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <PageFooter className="!mt-2 !pt-1 !pb-0" />
            </div>

            {/* ─── MODAL: CHECKOUT (WITH NOTES) ─── */}
            {activeModal === "checkout" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                    <div className="bg-white rounded-lg border border-slate-200/80 shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-white via-orange-50/20 to-white">
                            <h3 className="text-xs sm:text-[13px] font-bold text-slate-900">
                                Selesai Bertugas & Catatan Harian
                            </h3>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form
                            onSubmit={submitCheckout}
                            className="p-4 space-y-3"
                        >
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Catatan Pekerjaan / Laporan Shift{" "}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <p className="text-[10.5px] text-slate-500 mb-2">
                                    Tuliskan kegiatan atau kondisi fasilitas
                                    selama bertugas hari ini.
                                </p>
                                <textarea
                                    value={checkoutForm.data.notes}
                                    onChange={(e) =>
                                        checkoutForm.setData(
                                            "notes",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full border border-slate-200 rounded-md text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 h-24 p-2.5 outline-none"
                                    required
                                    placeholder="Contoh: Merapikan barbel, mendampingi member baru, dan mengecek treadmill."
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setActiveModal(null)}
                                    className="flex-1 py-2 rounded-md bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors shadow-2xs"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        checkoutForm.processing ||
                                        gpsStatus === "loading"
                                    }
                                    className="flex-1 py-2 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-2xs"
                                >
                                    {gpsStatus === "loading" ||
                                    checkoutForm.processing ? (
                                        <>
                                            <Navigation className="w-3.5 h-3.5 animate-pulse" />{" "}
                                            Memproses...
                                        </>
                                    ) : (
                                        <>Konfirmasi Check-out</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ─── MODAL: DAY DETAIL ─── */}
            {activeModal === "selectedDay" && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
                    onClick={() => setActiveModal(null)}
                >
                    <div
                        className="bg-white rounded-lg border border-slate-200/80 shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-white via-orange-50/20 to-white">
                            <h3 className="text-xs sm:text-[13px] font-bold text-slate-900">
                                Detail Absensi - {selectedDay}{" "}
                                {monthNames[currentMonth - 1]} {currentYear}
                            </h3>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto space-y-3">
                            {getAttendancesForDay(selectedDay).length === 0 ? (
                                <div className="text-center py-8 text-slate-400 text-xs italic">
                                    Tidak ada absen jaga pada tanggal ini.
                                </div>
                            ) : (
                                getAttendancesForDay(selectedDay).map((att) => {
                                    const isOwn =
                                        isCoach && auth.user.id === att.user_id;
                                    const canDelete = isSuperadmin || isOwn;

                                    return (
                                        <div
                                            key={att.id}
                                            className="border border-slate-200/80 rounded-lg p-3.5 bg-gradient-to-br from-white via-white to-orange-50/40 shadow-2xs group relative space-y-2.5"
                                        >
                                            {canDelete && (
                                                <button
                                                    onClick={() =>
                                                        deleteAttendance(att.id)
                                                    }
                                                    className="absolute top-3 right-3 p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 rounded-md transition-colors opacity-0 group-hover:opacity-100 shadow-2xs"
                                                    title="Hapus Data"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}

                                            {/* Top Row: User Avatar, Name & Check-in/out times */}
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs uppercase shrink-0 overflow-hidden">
                                                    {att.user?.profile_photo ? (
                                                        <img
                                                            src={
                                                                att.user
                                                                    .profile_photo_url ||
                                                                `/storage/${att.user.profile_photo}`
                                                            }
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        att.user?.name
                                                            ?.substring(0, 2)
                                                            .toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-slate-900 leading-tight">
                                                        {att.user?.name}
                                                    </div>
                                                    <div className="text-[10.5px] text-slate-500 font-medium mt-0.5">
                                                        Check-in:{" "}
                                                        <span className="text-slate-800 font-bold">
                                                            {att.check_in_time
                                                                ? new Date(
                                                                      att.check_in_time,
                                                                  ).toLocaleTimeString(
                                                                      "id-ID",
                                                                  )
                                                                : "-"}
                                                        </span>
                                                        &nbsp;|&nbsp; Check-out:{" "}
                                                        <span className="text-slate-800 font-bold">
                                                            {att.check_out_time
                                                                ? new Date(
                                                                      att.check_out_time,
                                                                  ).toLocaleTimeString(
                                                                      "id-ID",
                                                                  )
                                                                : "-"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Location Radius & Device Info */}
                                            <div className="flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-slate-500 pt-2 border-t border-slate-100/80">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                                    <span>
                                                        Radius In:{" "}
                                                        <strong className="text-slate-700">
                                                            {
                                                                att.check_in_distance
                                                            }
                                                            m
                                                        </strong>
                                                    </span>
                                                    <span className="text-slate-300">|</span>
                                                    <span>
                                                        Out:{" "}
                                                        <strong className="text-slate-700">
                                                            {att.check_out_distance !==
                                                            null
                                                                ? `${att.check_out_distance}m`
                                                                : "-"}
                                                        </strong>
                                                    </span>
                                                </div>
                                                <div
                                                    className="flex items-center gap-1 text-slate-400 truncate max-w-[200px]"
                                                    title={att.check_in_device}
                                                >
                                                    <Smartphone className="w-3 h-3 shrink-0" />
                                                    <span className="truncate">
                                                        {att.check_in_device?.substring(
                                                            0,
                                                            25,
                                                        )}
                                                        ...
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Notes / Duty Log (Clean subtle box, NO yellow background) */}
                                            {att.notes && (
                                                <div className="bg-white rounded-md border border-slate-200/70 p-2.5 text-[11px] text-slate-700 shadow-2xs space-y-0.5">
                                                    <div className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
                                                        Catatan Tugas:
                                                    </div>
                                                    <p className="leading-relaxed text-slate-700 font-medium">
                                                        "{att.notes}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ─── MODAL: LOCATION ─── */}
            {isSuperadmin && activeModal === "location" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                    <div className="bg-white rounded-lg border border-slate-200/80 shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-white via-orange-50/20 to-white">
                            <h3 className="text-xs sm:text-[13px] font-bold text-slate-900">
                                Pengaturan Lokasi & Tarif Default Gym
                            </h3>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form
                            onSubmit={submitLocation}
                            className="p-4 space-y-3"
                        >
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Latitude
                                </label>
                                <input
                                    type="text"
                                    value={locationForm.data.latitude}
                                    onChange={(e) =>
                                        locationForm.setData(
                                            "latitude",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full border border-slate-200 rounded-md text-xs py-2 px-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Longitude
                                </label>
                                <input
                                    type="text"
                                    value={locationForm.data.longitude}
                                    onChange={(e) =>
                                        locationForm.setData(
                                            "longitude",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full border border-slate-200 rounded-md text-xs py-2 px-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Radius Toleransi (Meter)
                                </label>
                                <input
                                    type="number"
                                    value={locationForm.data.radius}
                                    onChange={(e) =>
                                        locationForm.setData(
                                            "radius",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full border border-slate-200 rounded-md text-xs py-2 px-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                                    min="10"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Tarif Default Sekali Jaga (Rp)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                        Rp
                                    </span>
                                    <input
                                        type="number"
                                        value={locationForm.data.fee}
                                        onChange={(e) =>
                                            locationForm.setData(
                                                "fee",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                                        min="0"
                                        required
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">
                                    Tarif dasar yang diterapkan jika penjaga
                                    tidak memiliki tarif khusus.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setActiveModal(null)}
                                    className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-md font-bold text-xs hover:bg-slate-50 transition-colors shadow-2xs"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={locationForm.processing}
                                    className="flex-1 py-2 bg-orange-600 text-white rounded-md font-bold text-xs hover:bg-orange-700 transition-colors shadow-2xs"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ─── MODAL: GUARD FEE (CUSTOM PER GUARD) ─── */}
            {isSuperadmin && activeModal === "guardFee" && selectedGuard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                    <div className="bg-white rounded-lg border border-slate-200/80 shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-white via-orange-50/20 to-white">
                            <h3 className="text-xs sm:text-[13px] font-bold text-slate-900">
                                Atur Tarif Jaga Gym
                            </h3>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form
                            onSubmit={submitGuardFee}
                            className="p-4 space-y-3.5"
                        >
                            {/* Guard Info Card */}
                            <div className="bg-gradient-to-br from-white via-white to-orange-50/40 border border-slate-200/80 rounded-md p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-xs flex items-center justify-center shrink-0">
                                        {selectedGuard.profile_photo ? (
                                            <img
                                                src={
                                                    selectedGuard.profile_photo
                                                }
                                                alt=""
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            selectedGuard.name
                                                .charAt(0)
                                                .toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-900">
                                            {selectedGuard.name}
                                        </div>
                                        <div className="text-[10.5px] text-slate-500 font-medium">
                                            Penjaga Gym
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-slate-400 font-medium">
                                        Tarif Default
                                    </div>
                                    <div className="text-xs font-bold text-emerald-600">
                                        Rp{" "}
                                        {Number(
                                            gymLocation.fee || 0,
                                        ).toLocaleString("id-ID")}
                                    </div>
                                </div>
                            </div>

                            {/* Fee Input Field */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Tarif Khusus Pelatih (Rp / shift)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                        Rp
                                    </span>
                                    <input
                                        type="number"
                                        value={guardFeeForm.data.gym_fee}
                                        onChange={(e) =>
                                            guardFeeForm.setData(
                                                "gym_fee",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-2xs"
                                        placeholder="Kosongkan untuk tarif default"
                                        min="0"
                                    />
                                </div>
                                <p className="text-[10.5px] text-slate-500 mt-1.5 leading-relaxed">
                                    Kosongkan (atau isi 0) jika ingin mengikuti
                                    tarif default gym (Rp{" "}
                                    {Number(
                                        gymLocation.fee || 0,
                                    ).toLocaleString("id-ID")}
                                    ).
                                </p>
                                {guardFeeForm.data.gym_fee && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            guardFeeForm.setData("gym_fee", "")
                                        }
                                        className="text-[10.5px] font-bold text-orange-600 hover:text-orange-700 hover:underline mt-1 inline-block"
                                    >
                                        Gunakan Tarif Default
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setActiveModal(null)}
                                    className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-md font-bold text-xs hover:bg-slate-50 transition-colors shadow-2xs"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={guardFeeForm.processing}
                                    className="flex-1 py-2 bg-orange-600 text-white rounded-md font-bold text-xs hover:bg-orange-700 transition-colors shadow-2xs"
                                >
                                    Simpan Tarif
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ─── MODAL: CUSTOM CONFIRMATION ─── */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                    <div className="bg-white rounded-lg border border-slate-200/80 shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-white via-orange-50/20 to-white">
                            <h3 className="text-xs sm:text-[13px] font-bold text-slate-900">
                                {confirmModal.title}
                            </h3>
                            <button
                                onClick={closeConfirmModal}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            <p className="text-xs text-slate-600 leading-relaxed">
                                {confirmModal.message}
                            </p>
                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={closeConfirmModal}
                                    className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-md font-bold text-xs hover:bg-slate-50 transition-colors shadow-2xs"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmModal.onConfirm}
                                    disabled={confirmModal.isLoading}
                                    className={`flex-1 py-2 ${
                                        confirmModal.isDanger
                                            ? "bg-rose-600 hover:bg-rose-700"
                                            : "bg-orange-600 hover:bg-orange-700"
                                    } text-white rounded-md font-bold text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5`}
                                >
                                    {confirmModal.isLoading ? (
                                        <>
                                            <Navigation className="w-3.5 h-3.5 animate-pulse" />{" "}
                                            Memproses...
                                        </>
                                    ) : (
                                        confirmModal.confirmText
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── MODAL: ERROR NOTIFICATION ─── */}
            {errorMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                    <div className="bg-white rounded-lg border border-slate-200/80 shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-white via-orange-50/20 to-white">
                            <h3 className="text-xs sm:text-[13px] font-bold text-slate-900">
                                Pemberitahuan
                            </h3>
                            <button
                                onClick={() => setErrorMessage(null)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            <p className="text-xs text-slate-700 leading-relaxed">
                                {errorMessage}
                            </p>
                            <div className="pt-2 border-t border-slate-100 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setErrorMessage(null)}
                                    className="w-full py-2 bg-orange-600 text-white rounded-md font-bold text-xs hover:bg-orange-700 transition-colors shadow-2xs"
                                >
                                    Mengerti
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
