import { useState } from 'react';
import Navbar from '@/Components/Admin/Navbar';
import Sidebar from '@/Components/Admin/Sidebar';

export default function AdminLayout({ children, title }) {
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            
            {/* SIDEBAR */}
            <Sidebar 
                
                
                className={`transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`} 
            />

            {/* OVERLAY GELAP (Untuk menutup sidebar saat di klik di luar pada mobile) */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* MAIN CONTENT WRAPPER */}
            <div className="flex-1 flex flex-col ml-0 lg:ml-64 transition-all duration-300">
                
                {/* NAVBAR: Oper fungsi toggle ke sini */}
                <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

                {/* CONTENT PAGE */}
                <main className="flex-1 p-6 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}