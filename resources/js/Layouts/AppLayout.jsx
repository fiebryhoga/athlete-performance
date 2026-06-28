import { useState, useEffect } from 'react';
import Navbar from '@/Components/Layout/Navbar';
import Sidebar from '@/Components/Layout/Sidebar';

export default function AppLayout({ children, title }) {
    // State untuk Mobile (Overlay)
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    
    // State untuk Desktop (Collapse/Expand)
    // Coba baca dari localStorage supaya state-nya persisten
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('sidebarCollapsed') === 'true';
        }
        return false;
    });

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', isSidebarCollapsed);
    }, [isSidebarCollapsed]);

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            
            {/* SIDEBAR */}
            <Sidebar 
                isCollapsed={isSidebarCollapsed}
                isMobileOpen={isMobileSidebarOpen}
                onMobileClose={() => setIsMobileSidebarOpen(false)}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* OVERLAY MOBILE */}
            {isMobileSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileSidebarOpen(false)}
                ></div>
            )}

            {/* MAIN CONTENT WRAPPER */}
            <div className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-[260px]'}`}>
                
                {/* NAVBAR */}
                <Navbar 
                    onMobileMenuClick={() => setIsMobileSidebarOpen(true)}
                />

                {/* CONTENT PAGE */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth custom-scrollbar">
                    <div className="w-full max-w-[1920px] mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
