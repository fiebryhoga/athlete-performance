import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { 
    LayoutDashboard, Users, LogOut, Trophy, ClipboardList, Shield, Settings, Activity, HeartPulse, Dumbbell, Scale, Calendar, ChevronLeft, ChevronRight, Target, BarChart3, Package, Flame, Building2
} from 'lucide-react';

export default function Sidebar({ isCollapsed, isMobileOpen, onMobileClose, onToggleCollapse }) {
    
    const { url, props } = usePage();
    const scrollContainerRef = useRef(null);
    const [tooltip, setTooltip] = useState({ show: false, text: '', top: 0, left: 0 });

    // Persist sidebar scroll position across navigation
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const savedScroll = sessionStorage.getItem('sidebarScrollPos');
        if (savedScroll) {
            container.scrollTop = parseInt(savedScroll, 10);
        }

        const handleScroll = () => {
            sessionStorage.setItem('sidebarScrollPos', container.scrollTop.toString());
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const userRole = props.auth.user.role; 
    const appSettings = props.app_settings || {}; 
    const appName = appSettings?.name || 'Sistem Performa';
    const appLogo = appSettings?.logo;

    const isActive = (path) => {
        if (path === '/admin/athletes/dpa') {
            return url.startsWith('/admin/athletes/dpa') || (url.startsWith('/admin/athletes/') && url.includes('/dpa'));
        }
        if (path === '/admin/athletes') {
            return url.startsWith('/admin/athletes') && !url.includes('/dpa');
        }
        return url.startsWith(path);
    };

    const handleMouseEnter = (e, text) => {
        if (!isCollapsed) return;
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
                { name: 'Profilling', route: 'admin.athletes.index', checkPath: '/admin/athletes', icon: Users, roles: ['superadmin', 'coach'] },
                { name: 'Profil Fisik', route: 'athlete.profiling', checkPath: '/profiling', icon: Target, roles: ['athlete'] },
                { name: 'Program Latihan', route: 'admin.individual-trainings.index', checkPath: '/admin/individual-trainings', icon: Calendar, roles: ['superadmin', 'coach', 'athlete'] },
                { name: 'Absensi Gym', route: 'admin.gym-attendance.index', checkPath: '/admin/gym-attendance', icon: Building2, roles: ['superadmin', 'coach'], condition: () => userRole === 'superadmin' || props.auth.user.is_gym_guard },
            ]
        },
        {
            title: 'Tes',
            items: [
                { name: 'Tes Fisik', route: 'admin.performance.index', checkPath: '/performance', icon: ClipboardList, roles: ['superadmin', 'coach', 'athlete'] },
                { name: 'Komposisi Tubuh', route: 'admin.composition-tests.index', checkPath: '/admin/composition', icon: Scale, roles: ['superadmin', 'coach', 'athlete'] },
                { name: 'Kalkulator PHV', route: 'admin.phv-calculator.index', checkPath: '/admin/phv-calculator', icon: HeartPulse, roles: ['superadmin', 'coach'] },
                { name: 'Analysis DPA', route: 'admin.athletes.dpa.index', checkPath: '/admin/athletes/dpa', icon: Activity, roles: ['superadmin', 'coach', 'athlete'] },
            ]
        },
        {
            title: 'Nutrisi & Diet',
            items: [
                { name: 'Rencana Makan', route: 'admin.meal-plans.index', checkPath: '/admin/meal-plans', icon: Flame, roles: ['superadmin', 'coach', 'athlete'] },
            ]
        },
        {
            title: 'Recovery Tracking',
            items: [
                { name: 'Wellness & Beban', route: 'admin.wellness-rpe.index', checkPath: '/admin/wellness-rpe', icon: HeartPulse, roles: ['superadmin', 'coach', 'athlete'] },
                { name: 'Recovery Strategi', route: 'admin.recovery-strategies.index', checkPath: '/admin/recovery-strategies', icon: Calendar, roles: ['superadmin', 'coach', 'athlete'] },
                { name: 'Pantauan Harian', route: 'admin.daily-metrics.index', checkPath: '/admin/daily-metrics', icon: Activity, roles: ['superadmin', 'coach', 'athlete'] },
                { name: 'Analisis Beban', route: 'admin.load-analysis.index', checkPath: '/admin/load-analysis', icon: BarChart3, roles: ['superadmin', 'coach', 'athlete'] },
            ]
        },
        {
            title: 'Master Data',
            items: [
                { name: 'Kategori Olahraga', route: 'admin.sports.index', checkPath: '/admin/sports', icon: Trophy, roles: ['superadmin', 'coach'] },
                { name: 'Master Exercise', route: 'admin.exercises.index', checkPath: '/admin/exercises', icon: Dumbbell, roles: ['superadmin', 'coach'] },
                { name: 'DPA Compensations', route: 'admin.dpa-compensations.index', checkPath: '/admin/dpa-compensations', icon: ClipboardList, roles: ['superadmin', 'coach'] },
                { name: 'Manajemen Paket', route: 'admin.packages.index', checkPath: '/admin/packages', icon: Package, roles: ['superadmin'] },
            ]
        },
        {
            title: 'Setting',
            items: [
                { name: userRole === 'superadmin' ? 'Manajemen Pengguna' : 'Manajemen Klien', route: 'admin.users.index', checkPath: '/admin/users', icon: Shield, roles: ['superadmin', 'coach'] },
                { name: 'Rekap Sesi', route: 'admin.reports.sessions', checkPath: '/admin/reports/sessions', icon: BarChart3, roles: ['superadmin'] },
                { name: 'Pengaturan Sistem', route: 'admin.settings.index', checkPath: '/admin/settings', icon: Settings, roles: ['superadmin'] },
            ]
        }
    ];

    // Gaya dasar sidebar
    const sidebarClasses = `
        fixed top-0 left-0 h-screen bg-white border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]
        flex flex-col z-40 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-[76px]' : 'w-[250px]'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `;

    return (
        <aside className={sidebarClasses}>
            
            {/* Header (Logo & Brand) */}
            <div className={`h-20 flex items-center border-b border-slate-100 px-4 relative transition-all ${isCollapsed ? 'justify-center' : 'justify-start gap-3'}`}>
                {appLogo ? (
                    <div className="flex-shrink-0 flex items-center justify-center">
                        <img src={appLogo} alt="Logo" className="w-9 h-9 object-contain drop-shadow-sm" />
                    </div>
                ) : (
                    <div className="flex-shrink-0 w-9 h-9 bg-orange-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-sm shadow-orange-500/20">
                        {appName.charAt(0)}
                    </div>
                )}
                {!isCollapsed && (
                    <div className="flex flex-col animate-in fade-in duration-300 truncate">
                        <span className="font-bold text-slate-800 text-[13px] truncate">{appName}</span>
                        <span className="text-[10px] font-medium text-slate-400 capitalize">{userRole} Portal</span>
                    </div>
                )}
                
                {/* Desktop Toggle Button */}
                <button 
                    onClick={onToggleCollapse} 
                    className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-500 shadow-sm transition-colors z-50 group"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4 group-hover:scale-110 transition-transform" /> : <ChevronLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                </button>
            </div>

            {/* Menu List */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar py-5 px-3 space-y-5" onMouseLeave={handleMouseLeave}>
                {menuGroups.map((group, groupIdx) => {
                    const filteredItems = group.items.filter(item => {
                        if (!item.roles.includes(userRole)) return false;
                        if (item.condition && !item.condition()) return false;
                        return true;
                    });
                    if (filteredItems.length === 0) return null;

                    return (
                        <div key={groupIdx} className="space-y-1">
                            {group.title && !isCollapsed && (
                                <div className="px-3 py-1 mt-3 mb-1 text-[10px] font-bold text-slate-400/80 tracking-wider">
                                    {group.title}
                                </div>
                            )}
                            {group.title && isCollapsed && (
                                <div className="w-6 h-px bg-slate-200 mx-auto my-3"></div>
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
                                            onClick={() => { if(window.innerWidth < 1024) onMobileClose() }}
                                            className={`
                                                relative flex items-center rounded-xl transition-all duration-200
                                                ${isCollapsed ? 'justify-center p-2.5 mx-auto w-11 h-11' : 'justify-start px-3 py-2.5 gap-3 w-full'}
                                                ${active 
                                                    ? 'bg-orange-50 text-orange-600 font-bold' 
                                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 font-medium'}
                                            `}
                                        >
                                            <Icon className={`flex-shrink-0 transition-all w-5 h-5 ${active ? 'text-orange-500' : 'text-slate-400'}`} />
                                            
                                            {!isCollapsed && (
                                                <span className="truncate text-[13px]">{item.name}</span>
                                            )}

                                            {/* Indikator Aktif Kiri (hanya di mode expand) */}
                                            {active && !isCollapsed && (
                                                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange-500 rounded-r-full"></div>
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
            <div className="p-3 border-t border-slate-100">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    onMouseEnter={(e) => handleMouseEnter(e, 'Keluar Sesi')}
                    onMouseLeave={handleMouseLeave}
                    className={`
                        flex items-center rounded-xl transition-all duration-200 w-full
                        text-rose-500 hover:bg-rose-50 hover:text-rose-600 font-medium
                        ${isCollapsed ? 'justify-center p-2.5 mx-auto w-11 h-11' : 'justify-start px-3 py-2.5 gap-3'}
                    `}
                >
                    <LogOut className="flex-shrink-0 w-5 h-5" />
                    {!isCollapsed && <span className="text-[13px]">Keluar Sesi</span>}
                </Link>
            </div>

            {/* Fixed Tooltip for Collapsed Mode (Escapes scroll overflow) */}
            {tooltip.show && (
                <div 
                    className="fixed z-[100] px-3 py-1.5 bg-slate-800 text-white text-[12px] font-bold rounded-lg shadow-xl whitespace-nowrap pointer-events-none animate-in fade-in duration-150"
                    style={{ top: tooltip.top, left: tooltip.left, transform: 'translateY(-50%)' }}
                >
                    {tooltip.text}
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 rounded-sm"></div>
                </div>
            )}
        </aside>
    );
}
