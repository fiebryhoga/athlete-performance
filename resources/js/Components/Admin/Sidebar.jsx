import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Users, 
    LogOut, 
    Trophy, 
    ClipboardList,
    Shield,
    Settings,
    Activity,
    HeartPulse // 1. Import Icon baru untuk Wellness & Load
} from 'lucide-react';

export default function Sidebar({ className }) {
    
    const { url, props } = usePage();
    const userRole = props.auth.user.role; 
    
    // Ambil setting global dari middleware (untuk logo & nama dinamis)
    const appSettings = props.app_settings || {}; 

    const isActive = (path) => url.startsWith(path);

    // 2. Tambahkan menu baru ke dalam array menuItems
    const menuItems = [
        { 
            name: 'dashboard', 
            route: 'dashboard', 
            checkPath: '/dashboard', 
            icon: LayoutDashboard,
            roles: ['admin', 'coach', 'athlete'] 
        },
        
        { 
            name: 'sports categories', 
            route: 'admin.sports.index', 
            checkPath: '/admin/sports', 
            icon: Trophy,
            roles: ['admin', 'coach'] 
        },
        
        { 
            name: 'athletes data', 
            route: 'admin.athletes.index', 
            checkPath: '/admin/athletes', 
            icon: Users,
            roles: ['admin', 'coach'] 
        },
        { 
            name: 'Physical Test', 
            route: 'admin.performance.index', 
            checkPath: '/admin/performance', 
            icon: ClipboardList,
            roles: ['admin', 'coach', 'athlete'] 
        },
        { 
            name: 'Daily Monitoring', 
            route: 'admin.daily-metrics.index', 
            checkPath: '/admin/daily-metrics', 
            icon: Activity,
            roles: ['admin', 'coach', 'athlete']
        },

        // --- MENU BARU: WELLNESS & LOAD ---
        { 
            name: 'Wellness & Load', 
            route: 'admin.training-loads.index', 
            checkPath: '/admin/training-loads', 
            icon: HeartPulse,
            roles: ['admin', 'coach', 'athlete'] 
        },
        
        { 
            name: 'admin access', 
            route: 'manage-admins.index', 
            checkPath: '/admin/manage-admins', 
            icon: Shield,
            roles: ['admin'] 
        },

        // --- CONFIGURATION ---
        { 
            name: 'configuration', 
            route: 'admin.settings.index', 
            checkPath: '/admin/settings', 
            icon: Settings,
            roles: ['admin'] // Hanya Admin
        },
    ];

    const visibleMenuItems = menuItems.filter(item => item.roles.includes(userRole));

    return (
        <aside className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white transition-transform duration-300 flex flex-col font-sans ${className}`}>
            
            {/* --- LOGO AREA (DINAMIS) --- */}
            <div className="flex h-20 items-center border-b border-slate-100 px-6 shrink-0 bg-white">
                <Link href="/dashboard" className="flex items-center gap-3">
                    {/* Logo: Cek jika ada di setting, jika tidak pakai default */}
                    {appSettings.logo ? (
                        <img 
                            src={appSettings.logo} 
                            alt="App Logo" 
                            className="h-8 w-8 object-contain rounded-lg"
                        />
                    ) : (
                        // Fallback jika belum ada logo
                        <div className="h-8 w-8 bg-[#00488b] text-white flex items-center justify-center rounded-lg font-bold">
                            {appSettings.name ? appSettings.name.charAt(0) : 'A'}
                        </div>
                    )}
                    
                    <div className="overflow-hidden">
                        {/* Nama Aplikasi Dinamis */}
                        <h1 className="text-sm font-extrabold text-blue-900 tracking-tight truncate max-w-[140px] leading-tight">
                            {appSettings.name || 'Performance'}
                        </h1>
                        <p className="text-[10px] text-slate-500 font-medium truncate">Analytics Dashboard</p>
                    </div>
                </Link>
            </div>

            {/* --- MENU ITEMS --- */}
            <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
                
                <div className="mb-8">
                    <p className="px-3 text-[10px] font-bold text-slate-400 tracking-widest mb-2 opacity-70 uppercase">
                        main menu
                    </p>
                    <ul className="space-y-1">
                        {visibleMenuItems.map((item) => {
                            const active = isActive(item.checkPath);
                            
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={route(item.route)}
                                        className={`group relative flex items-center rounded-xl px-3.5 py-3 text-sm font-bold transition-all duration-200 ${
                                            active
                                                ? 'bg-[#00488b] text-white shadow-md shadow-blue-900/20'
                                                : 'text-slate-500 hover:bg-slate-50 hover:text-[#00488b]'
                                        }`}
                                    >
                                        <item.icon
                                            strokeWidth={2.5}
                                            className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                                                active ? 'text-white' : 'text-slate-400 group-hover:text-[#00488b]'
                                            }`}
                                        />
                                        <span className="capitalize">{item.name}</span>
                                        
                                        {active && (
                                            <span className="absolute right-3 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse"></span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

            </div>

            {/* --- BOTTOM SECTION --- */}
            <div className="shrink-0 border-t border-slate-100 p-4 bg-white">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm group"
                >
                    <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="capitalize">sign out system</span>
                </Link>
            </div>
        </aside>
    );
}