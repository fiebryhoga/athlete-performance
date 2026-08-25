import { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, Users, LogOut, Trophy, Shield, Settings, HeartPulse, Dumbbell, Scale, ChevronLeft, ChevronRight, Target, BarChart3, Package, Building2, Calculator, Scan, UtensilsCrossed, BatteryCharging, CalendarCheck, CalendarDays, Timer, BookOpen, UserCog, FileSpreadsheet
} from 'lucide-react';

export default function Sidebar({ isCollapsed, isMobileOpen, onMobileClose, onToggleCollapse }) {
    const { url, props } = usePage();
    const userRole = props.auth?.user?.role || 'athlete';
    const appSettings = props.app_settings || props.appSettings || {};
    const appLogo = appSettings?.logo || props.club_logo_url || '/assets/images/otslogo.png';
    const appName = appSettings?.name || props.club_name || "OTS Performance";

    // Tooltip State untuk Desktop saat Sidebar Mengecil (Collapsed)
    const [tooltip, setTooltip] = useState({ show: false, text: '', top: 0, left: 0 });
    const scrollContainerRef = useRef(null);

    // Otomatis scroll ke menu yang aktif saat halaman dimuat
    useEffect(() => {
        if (scrollContainerRef.current) {
            const activeElement = scrollContainerRef.current.querySelector('.active-menu-item');
            if (activeElement) {
                activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }, [url]);

    // Deteksi menu aktif
    const isActive = (path) => {
        if (path === '/dashboard' || path === 'dashboard') {
            return url === '/dashboard' || url === '/';
        }
        if (path === '/admin/athletes/dpa') {
            return url.startsWith('/admin/athletes/dpa');
        }
        if (path === '/admin/athletes') {
            return url.startsWith('/admin/athletes') && !url.includes('/dpa');
        }
        return url.startsWith(path);
    };

    const handleMouseEnter = (e, text) => {
        if (!isCollapsed || (typeof window !== 'undefined' && window.innerWidth < 1024)) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
            show: true,
            text,
            top: rect.top + rect.height / 2,
            left: rect.right + 12
        });
    };

    const handleMouseLeave = () => {
        setTooltip(prev => ({ ...prev, show: false }));
    };

    const menuGroups = [
        {
            title: null, 
            items: [
                { name: 'Dashboard', route: 'dashboard', checkPath: '/dashboard', icon: LayoutDashboard, roles: ['superadmin', 'coach', 'athlete'] },
                { name: 'Profiling', route: 'admin.athletes.index', checkPath: '/admin/athletes', icon: Users, roles: ['superadmin', 'coach'] },
                { name: 'Profil Fisik', route: 'athlete.profiling', checkPath: '/profiling', icon: Target, roles: ['athlete'] },
                { name: 'Program Latihan', route: 'admin.individual-trainings.index', checkPath: '/admin/individual-trainings', icon: CalendarDays, roles: ['superadmin', 'coach', 'athlete'] },
                { name: 'Absensi Gym', route: 'admin.gym-attendance.index', checkPath: '/admin/gym-attendance', icon: Building2, roles: ['superadmin', 'coach'], condition: () => userRole === 'superadmin' || props.auth.user.is_gym_guard },
            ]
        },
        {
            title: 'Tes & Evaluasi',
            items: [
                { name: 'Tes Fisik', route: 'admin.performance.index', checkPath: '/performance', icon: Timer, roles: ['superadmin', 'coach', 'athlete'] },
                { name: 'Komposisi Tubuh', route: 'admin.composition-tests.index', checkPath: '/admin/composition', icon: Scale, roles: ['superadmin', 'coach', 'athlete'] },
                { name: 'Kalkulator PHV', route: 'admin.phv-calculator.index', checkPath: '/admin/phv-calculator', icon: Calculator, roles: ['superadmin', 'coach'] },
                { name: 'Analysis DPA', route: 'admin.athletes.dpa.index', checkPath: '/admin/athletes/dpa', icon: Scan, roles: ['superadmin', 'coach', 'athlete'] },
            ]
        },
        {
            title: 'Nutrisi & Diet',
            items: [
                { name: 'Rencana Makan', route: 'admin.meal-plans.index', checkPath: '/admin/meal-plans', icon: UtensilsCrossed, roles: ['superadmin', 'coach', 'athlete'] },
            ]
        },
        {
            title: 'Recovery Tracking',
            items: [
                { name: 'Wellness & Beban', route: 'admin.wellness-rpe.index', checkPath: '/admin/wellness-rpe', icon: HeartPulse, roles: ['superadmin', 'coach', 'athlete'] },
                { name: 'Recovery Strategi', route: 'admin.recovery-strategies.index', checkPath: '/admin/recovery-strategies', icon: BatteryCharging, roles: ['superadmin', 'coach', 'athlete'] },
                { name: 'Pantauan Harian', route: 'admin.daily-metrics.index', checkPath: '/admin/daily-metrics', icon: CalendarCheck, roles: ['superadmin', 'coach', 'athlete'] },
                { name: 'Analisis Beban', route: 'admin.load-analysis.index', checkPath: '/admin/load-analysis', icon: BarChart3, roles: ['superadmin', 'coach', 'athlete'] },
            ]
        },
        {
            title: 'Master Data',
            items: [
                { name: 'Kategori Olahraga', route: 'admin.sports.index', checkPath: '/admin/sports', icon: Trophy, roles: ['superadmin', 'coach'] },
                { name: 'Master Exercise', route: 'admin.exercises.index', checkPath: '/admin/exercises', icon: Dumbbell, roles: ['superadmin', 'coach'] },
                { name: 'DPA Compensations', route: 'admin.dpa-compensations.index', checkPath: '/admin/dpa-compensations', icon: BookOpen, roles: ['superadmin', 'coach'] },
                { name: 'Manajemen Paket', route: 'admin.packages.index', checkPath: '/admin/packages', icon: Package, roles: ['superadmin'] },
            ]
        },
        {
            title: 'Pengaturan',
            items: [
                { name: userRole === 'superadmin' ? 'Manajemen Pengguna' : 'Manajemen Klien', route: 'admin.users.index', checkPath: '/admin/users', icon: UserCog, roles: ['superadmin', 'coach'] },
                { name: 'Rekap Sesi', route: 'admin.reports.sessions', checkPath: '/admin/reports/sessions', icon: FileSpreadsheet, roles: ['superadmin'] },
                { name: 'Pengaturan Sistem', route: 'admin.settings.index', checkPath: '/admin/settings', icon: Settings, roles: ['superadmin'] },
            ]
        }
    ];

    // Gaya dasar sidebar: Di mobile (< lg) SELALU full-width (w-[245px]), collapse hanya berlaku di Desktop (>= lg)
    const sidebarClasses = `
        fixed top-0 left-0 h-screen bg-white border-r border-slate-200/80 shadow-[1px_0_10px_rgba(0,0,0,0.02)]
        flex flex-col z-40 transition-all duration-300 ease-in-out
        w-[245px] ${isCollapsed ? 'lg:w-[70px]' : 'lg:w-[235px]'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `;

    return (
        <aside className={sidebarClasses}>
            
            {/* Header (Logo & Brand) */}
            <div className={`h-16 flex items-center border-b border-slate-100 px-3.5 relative transition-all justify-start gap-2.5 ${isCollapsed ? 'lg:justify-center lg:gap-0' : 'lg:justify-start lg:gap-2.5'}`}>
                {appLogo ? (
                    <div className="flex-shrink-0 flex items-center justify-center">
                        <img src={appLogo} alt="Logo" className="w-8 h-8 object-contain" />
                    </div>
                ) : (
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-md flex items-center justify-center font-bold text-sm shadow-xs">
                        {appName.charAt(0)}
                    </div>
                )}
                <div className={`flex flex-col animate-in fade-in duration-300 truncate min-w-0 pr-3 ${isCollapsed ? 'lg:hidden' : 'block'}`}>
                    <span className="font-bold text-slate-900 text-xs truncate leading-tight">{appName}</span>
                    <span className="text-[10px] font-medium text-slate-400 capitalize">{userRole} Hub</span>
                </div>
                
                {/* Desktop Toggle Button */}
                <button 
                    onClick={onToggleCollapse} 
                    className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-500 shadow-xs transition-colors z-50 group cursor-pointer"
                    title={isCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
                >
                    {isCollapsed ? <ChevronRight className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> : <ChevronLeft className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />}
                </button>
            </div>

            {/* Menu List */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar py-3 px-2 space-y-3.5" onMouseLeave={handleMouseLeave}>
                {menuGroups.map((group, groupIdx) => {
                    const filteredItems = group.items.filter(item => {
                        if (!item.roles.includes(userRole)) return false;
                        if (item.condition && !item.condition()) return false;
                        return true;
                    });
                    if (filteredItems.length === 0) return null;

                    return (
                        <div key={groupIdx} className="space-y-0.5">
                            {group.title && (
                                <>
                                    <div className={`px-2.5 py-1 text-[10px] font-semibold text-slate-400 tracking-wider ${isCollapsed ? 'lg:hidden' : 'block'}`}>
                                        {group.title}
                                    </div>
                                    {isCollapsed && (
                                        <div className="hidden lg:block w-4 h-px bg-slate-100 mx-auto my-2"></div>
                                    )}
                                </>
                            )}
                            
                            {filteredItems.map((item, index) => {
                                const active = isActive(item.checkPath);
                                const Icon = item.icon;
                                return (
                                    <div key={index}>
                                        <Link
                                            href={route(item.route)}
                                            onMouseEnter={(e) => handleMouseEnter(e, item.name)}
                                            onMouseLeave={handleMouseLeave}
                                            onClick={() => { if(typeof window !== 'undefined' && window.innerWidth < 1024) onMobileClose() }}
                                            className={`
                                                relative flex items-center rounded-md transition-all duration-150
                                                justify-start px-2.5 py-2 gap-2.5 w-full
                                                ${isCollapsed ? 'lg:justify-center lg:p-2 lg:mx-auto lg:w-9 lg:h-9' : 'lg:justify-start lg:px-2.5 lg:py-2 lg:gap-2.5 lg:w-full'}
                                                ${active 
                                                    ? 'text-orange-600 font-semibold border border-orange-100/70 shadow-2xs bg-orange-20/80 active-menu-item' 
                                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium'}
                                            `}
                                        >
                                            <Icon className={`flex-shrink-0 transition-all w-4 h-4 ${active ? 'text-orange-500 stroke-[2.2]' : 'text-slate-400 group-hover:text-slate-600 stroke-[1.8]'}`} />
                                            
                                            <span className={`truncate text-xs ${isCollapsed ? 'lg:hidden' : 'block'}`}>{item.name}</span>

                                            {/* Subtle indicator dot on active when expanded */}
                                            {active && (
                                                <div className={`ml-auto w-1.5 h-1.5 rounded-full bg-orange-500 ${isCollapsed ? 'lg:hidden' : 'block'}`}></div>
                                            )}
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Logout Footer */}
            <div className="p-2 border-t border-slate-100">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    onMouseEnter={(e) => handleMouseEnter(e, 'Keluar Sesi')}
                    onMouseLeave={handleMouseLeave}
                    className={`
                        flex items-center rounded-md transition-all duration-150 w-full cursor-pointer
                        text-rose-500 hover:bg-rose-50/80 hover:text-rose-600 font-medium text-xs
                        justify-start px-2.5 py-2 gap-2.5
                        ${isCollapsed ? 'lg:justify-center lg:p-2 lg:mx-auto lg:w-9 lg:h-9' : 'lg:justify-start lg:px-2.5 lg:py-2 lg:gap-2.5'}
                    `}
                >
                    <LogOut className="flex-shrink-0 w-4 h-4" />
                    <span className={`text-xs font-medium ${isCollapsed ? 'lg:hidden' : 'block'}`}>Keluar Sesi</span>
                </Link>
            </div>

            {/* Fixed Tooltip for Collapsed Mode on Desktop */}
            {tooltip.show && (
                <div 
                    className="fixed z-[100] px-2.5 py-1 bg-slate-900 text-white text-[11px] font-semibold rounded-md shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in duration-100 hidden lg:block"
                    style={{ top: tooltip.top, left: tooltip.left, transform: 'translateY(-50%)' }}
                >
                    {tooltip.text}
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-slate-900 rotate-45 rounded-2xs"></div>
                </div>
            )}
        </aside>
    );
}
