import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    CalendarDays,
    LayoutGrid,
    HeartPulse,
    UtensilsCrossed,
    Users,
    Timer,
    Building2,
    FileSpreadsheet,
    Banknote,
} from "lucide-react";

export default function MobileBottomNav({ onOpenMenu }) {
    const { url, props } = usePage();
    const userRole = props.auth?.user?.role || "athlete";
    const isAthlete = userRole === "athlete";
    const isSuperAdmin = userRole === "superadmin";
    const isGymGuard = Boolean(props.auth?.user?.is_gym_guard);

    // Active state checkers
    const isDashboardActive = url === "/dashboard" || url === "/";
    const isProgramActive =
        url.startsWith("/admin/individual-trainings") ||
        url.startsWith("/admin/group-trainings");
    const isAthletesActive =
        url.startsWith("/admin/athletes") && !url.includes("/dpa");
    const isGymAttendanceActive = url.startsWith("/admin/gym-attendance");
    const isPerformanceActive = url.startsWith("/admin/performance");
    const isWellnessActive =
        url.startsWith("/admin/wellness-rpe") ||
        url.startsWith("/admin/recovery-strategies") ||
        url.startsWith("/admin/daily-metrics");
    const isMealActive = url.startsWith("/admin/meal-plans");
    const isReportsSessionsActive = url.startsWith("/admin/reports/sessions");
    const isReportsCoachesActive = url.startsWith("/admin/reports/coaches");

    // Dynamic Navigation Items Setup
    let item1 = {
        name: "Dashboard",
        href: route("dashboard"),
        icon: LayoutDashboard,
        isActive: isDashboardActive,
    };
    let item2 = null;
    let item4 = null;
    let item5 = null;

    if (isSuperAdmin) {
        // SUPERADMIN: Dashboard, Klien, Menu, Sesi, Honor
        item2 = {
            name: "Klien",
            href: route("admin.athletes.index"),
            icon: Users,
            isActive: isAthletesActive,
        };
        item4 = {
            name: "Sesi",
            href: route("admin.reports.sessions"),
            icon: FileSpreadsheet,
            isActive: isReportsSessionsActive,
        };
        item5 = {
            name: "Honor",
            href: route("admin.reports.coaches"),
            icon: Banknote,
            isActive: isReportsCoachesActive,
        };
    } else if (isAthlete) {
        // ATHLETE: Dashboard, Program, Menu, Wellness, Makanan
        item2 = {
            name: "Program",
            href: route("admin.individual-trainings.index"),
            icon: CalendarDays,
            isActive: isProgramActive,
        };
        item4 = {
            name: "Wellness",
            href: route("admin.wellness-rpe.index"),
            icon: HeartPulse,
            isActive: isWellnessActive,
        };
        item5 = {
            name: "Makanan",
            href: route("admin.meal-plans.index"),
            icon: UtensilsCrossed,
            isActive: isMealActive,
        };
    } else {
        // COACH: Dashboard, Program, Menu, Klien, (Absensi / Tes Fisik)
        item2 = {
            name: "Program",
            href: route("admin.individual-trainings.index"),
            icon: CalendarDays,
            isActive: isProgramActive,
        };
        item4 = {
            name: "Klien",
            href: route("admin.athletes.index"),
            icon: Users,
            isActive: isAthletesActive,
        };
        if (isGymGuard) {
            item5 = {
                name: "Absensi",
                href: route("admin.gym-attendance.index"),
                icon: Building2,
                isActive: isGymAttendanceActive,
            };
        } else {
            item5 = {
                name: "Tes Fisik",
                href: route("admin.performance.index"),
                icon: Timer,
                isActive: isPerformanceActive,
            };
        }
    }

    const Icon1 = item1.icon;
    const Icon2 = item2.icon;
    const Icon4 = item4.icon;
    const Icon5 = item5.icon;

    return (
        <nav
            aria-label="Navigasi Bawah Mobile"
            className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.07)] pb-[env(safe-area-inset-bottom,0px)]"
        >
            <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1 relative">
                {/* 1. Slot 1: Dashboard */}
                <Link
                    href={item1.href}
                    className={`flex flex-col items-center justify-center h-full transition-colors relative group py-1.5 ${
                        item1.isActive
                            ? "text-orange-600 font-bold"
                            : "text-slate-500 hover:text-slate-800 font-medium"
                    }`}
                >
                    <div className="relative">
                        <Icon1
                            size={20}
                            className={`transition-transform duration-200 ${
                                item1.isActive ? "scale-105 text-orange-600" : "text-slate-500"
                            }`}
                        />
                    </div>
                    <span className="text-[10.5px] tracking-tight mt-1 leading-none">
                        {item1.name}
                    </span>
                </Link>

                {/* 2. Slot 2: (Klien untuk Superadmin, Program untuk Coach & Atlet) */}
                <Link
                    href={item2.href}
                    className={`flex flex-col items-center justify-center h-full transition-colors relative group py-1.5 ${
                        item2.isActive
                            ? "text-orange-600 font-bold"
                            : "text-slate-500 hover:text-slate-800 font-medium"
                    }`}
                >
                    <div className="relative">
                        <Icon2
                            size={20}
                            className={`transition-transform duration-200 ${
                                item2.isActive ? "scale-105 text-orange-600" : "text-slate-500"
                            }`}
                        />
                    </div>
                    <span className="text-[10.5px] tracking-tight mt-1 leading-none">
                        {item2.name}
                    </span>
                </Link>

                {/* 3. Slot 3: Center Floating Menu Button */}
                <div className="flex flex-col items-center justify-center relative -top-3">
                    <button
                        type="button"
                        onClick={onOpenMenu}
                        aria-label="Buka Menu Lengkap"
                        className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/35 ring-4 ring-white active:scale-95 hover:scale-105 transition-all flex items-center justify-center cursor-pointer"
                    >
                        <LayoutGrid size={21} strokeWidth={2.2} />
                    </button>
                    <span className="text-[10.5px] font-bold text-slate-700 tracking-tight mt-1 leading-none">
                        Menu
                    </span>
                </div>

                {/* 4. Slot 4: (Rekap Sesi untuk Superadmin, Klien untuk Coach, Wellness untuk Atlet) */}
                <Link
                    href={item4.href}
                    className={`flex flex-col items-center justify-center h-full transition-colors relative group py-1.5 ${
                        item4.isActive
                            ? "text-orange-600 font-bold"
                            : "text-slate-500 hover:text-slate-800 font-medium"
                    }`}
                >
                    <div className="relative">
                        <Icon4
                            size={20}
                            className={`transition-transform duration-200 ${
                                item4.isActive ? "scale-105 text-orange-600" : "text-slate-500"
                            }`}
                        />
                    </div>
                    <span className="text-[10.5px] tracking-tight mt-1 leading-none truncate max-w-[62px]">
                        {item4.name}
                    </span>
                </Link>

                {/* 5. Slot 5: (Rekap Honor untuk Superadmin, Absensi/Tes Fisik untuk Coach, Makanan untuk Atlet) */}
                <Link
                    href={item5.href}
                    className={`flex flex-col items-center justify-center h-full transition-colors relative group py-1.5 ${
                        item5.isActive
                            ? "text-orange-600 font-bold"
                            : "text-slate-500 hover:text-slate-800 font-medium"
                    }`}
                >
                    <div className="relative">
                        <Icon5
                            size={20}
                            className={`transition-transform duration-200 ${
                                item5.isActive ? "scale-105 text-orange-600" : "text-slate-500"
                            }`}
                        />
                    </div>
                    <span className="text-[10.5px] tracking-tight mt-1 leading-none truncate max-w-[62px]">
                        {item5.name}
                    </span>
                </Link>
            </div>
        </nav>
    );
}
