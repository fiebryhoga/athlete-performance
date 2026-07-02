import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, Users, LogOut, Trophy, ClipboardList, Shield, Settings, Activity, HeartPulse, Dumbbell, Scale, Calendar, ChevronLeft, ChevronRight, Target, BarChart3
} from 'lucide-react';

export default function Sidebar({ isCollapsed, isMobileOpen, onMobileClose, onToggleCollapse }) {
    
    const { url, props } = usePage();
    const userRole = props.auth.user.role; 
    const appSettings = props.app_settings || {}; 
    const appName = appSettings?.name || 'Sistem Performa';
    const appLogo = appSettings?.logo;

    const isActive = (path) => url.startsWith(path);

    // Array definisi Menu
    const menuItems = [
        { 
            name: 'Dashboard', 
            route: 'dashboard', 
            checkPath: '/dashboard', 
            icon: LayoutDashboard,
            roles: ['superadmin', 'coach', 'athlete'] 
        },
        { 
            name: 'Kategori Olahraga', 
            route: 'admin.sports.index', 
            checkPath: '/admin/sports', 
            icon: Trophy,
            roles: ['superadmin', 'coach'] 
        },
        { 
            name: 'Profilling', 
            route: 'admin.athletes.index', 
            checkPath: '/admin/athletes', 
            icon: Users,
            roles: ['superadmin', 'coach'] 
        },
        { 
            name: 'Tes Fisik', 
            route: 'admin.performance.index', 
            checkPath: '/performance', 
            icon: ClipboardList,
            roles: ['superadmin', 'coach', 'athlete'] 
        },
        { 
            name: 'Komposisi Tubuh', 
            route: 'admin.composition-tests.index',
            checkPath: '/admin/composition', 
            icon: Scale, 
            roles: ['superadmin', 'coach', 'athlete'] 
        },
        { 
            name: 'Pantauan Harian', 
            route: 'admin.daily-metrics.index', 
            checkPath: '/admin/daily-metrics', 
            icon: Activity,
            roles: ['superadmin', 'coach', 'athlete']
        },
        { 
            name: 'Wellness & Beban', 
            route: 'admin.wellness-rpe.index', 
            checkPath: '/admin/wellness-rpe', 
            icon: HeartPulse,
            roles: ['superadmin', 'coach', 'athlete'] 
        },
        { 
            name: 'Master Exercise', 
            route: 'admin.exercises.index', 
            checkPath: '/admin/exercises', 
            icon: Dumbbell,
            roles: ['superadmin', 'coach'] 
        },
        { 
            name: 'Program Latihan', 
            route: 'admin.individual-trainings.index', 
            checkPath: '/admin/individual-trainings', 
            icon: Calendar,
            roles: ['superadmin', 'coach', 'athlete'] 
        },
        { 
            name: 'Profil Fisik', 
            route: 'athlete.profiling', 
            checkPath: '/profiling', 
            icon: Target,
            roles: ['athlete'] 
        },
        { 
            name: 'Rekap Sesi', 
            route: 'admin.reports.sessions', 
            checkPath: '/admin/reports/sessions', 
            icon: BarChart3,
            roles: ['superadmin'] 
        },
        { 
            name: userRole === 'superadmin' ? 'Manajemen Pengguna' : 'Manajemen Klien', 
            route: 'admin.users.index', 
            checkPath: '/admin/users', 
            icon: Shield,
            roles: ['superadmin', 'coach'] 
        },
        { 
            name: 'Pengaturan Sistem', 
            route: 'admin.settings.index', 
            checkPath: '/admin/settings', 
            icon: Settings,
            roles: ['superadmin'] 
        },
    ];

    const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

    // Gaya dasar sidebar
    const sidebarClasses = `
        fixed top-0 left-0 h-screen bg-white border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]
        flex flex-col z-40 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-[260px]'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `;

    return (
        <aside className={sidebarClasses}>
            
            {/* Header (Logo & Brand) */}
            <div className={`h-20 flex items-center border-b border-slate-100 px-4 relative transition-all ${isCollapsed ? 'justify-center' : 'justify-start gap-3'}`}>
                {appLogo ? (
                    <div className="flex-shrink-0 flex items-center justify-center">
                        <img src={appLogo} alt="Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
                    </div>
                ) : (
                    <div className="flex-shrink-0 w-10 h-10 bg-[#ff4d00] text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-orange-500/20">
                        {appName.charAt(0)}
                    </div>
                )}
                {!isCollapsed && (
                    <div className="flex flex-col animate-in fade-in duration-300 truncate">
                        <span className="font-bold text-slate-800 text-sm truncate">{appName}</span>
                        <span className="text-[10px] font-medium text-slate-400 capitalize">{userRole} Portal</span>
                    </div>
                )}
                
                {/* Desktop Toggle Button */}
                <button 
                    onClick={onToggleCollapse} 
                    className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-[#ff4d00] hover:border-[#ff4d00] shadow-sm transition-colors z-50 group"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4 group-hover:scale-110 transition-transform" /> : <ChevronLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                </button>
            </div>

            {/* Menu List */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-6 px-3 space-y-1">
                {filteredMenu.map((item, index) => {
                    const active = isActive(item.checkPath);
                    const Icon = item.icon;
                    return (
                        <div key={index} className="relative group">
                            <Link
                                href={route(item.route)}
                                onClick={() => { if(window.innerWidth < 1024) onMobileClose() }}
                                className={`
                                    flex items-center rounded-xl transition-all duration-200 relative
                                    ${isCollapsed ? 'justify-center p-3' : 'justify-start px-4 py-3 gap-3'}
                                    ${active 
                                        ? 'bg-orange-50 text-[#ff4d00] font-semibold' 
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium'}
                                `}
                            >
                                <Icon className={`flex-shrink-0 transition-all ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${active ? 'text-[#ff4d00]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                
                                {!isCollapsed && (
                                    <span className="truncate text-sm">{item.name}</span>
                                )}

                                {/* Indikator Aktif Kiri (hanya di mode expand) */}
                                {active && !isCollapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#ff4d00] rounded-r-full"></div>
                                )}
                            </Link>

                            {/* Tooltip Hover saat Collapsed */}
                            {isCollapsed && (
                                <div className="absolute left-[85px] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl">
                                    {item.name}
                                    <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Logout Footer */}
            <div className="p-4 border-t border-slate-100">
                <div className="relative group">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className={`
                            w-full flex items-center rounded-xl transition-all duration-200
                            text-rose-500 hover:bg-rose-50 hover:text-rose-600 font-medium
                            ${isCollapsed ? 'justify-center p-3' : 'justify-start px-4 py-3 gap-3'}
                        `}
                    >
                        <LogOut className={`flex-shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
                        {!isCollapsed && <span className="text-sm">Keluar Sesi</span>}
                    </Link>

                    {/* Tooltip Hover saat Collapsed */}
                    {isCollapsed && (
                        <div className="absolute left-[85px] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-rose-600 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl">
                            Keluar Sesi
                            <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-rose-600 rotate-45"></div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
