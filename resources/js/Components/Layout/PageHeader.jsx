import { Link } from '@inertiajs/react';
import { Search } from 'lucide-react';

export default function PageHeader({ 
    title, 
    subtitle, 
    badge = 'Management', 
    icon: Icon, 
    searchPlaceholder,
    searchValue,
    onSearchChange,
    actions,
    backUrl,
    children
}) {
    return (
        <div className="bg-white p-5 md:p-7 rounded-xl border border-slate-200 shadow-sm mb-6 md:mb-8 relative flex flex-col gap-5 md:gap-6">
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                <div className="absolute top-0 right-0 w-72 h-72 bg-orange-50 rounded-full blur-3xl -mr-24 -mt-24 opacity-60"></div>
            </div>
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 md:gap-6">
            
            <div className="relative z-10 w-full lg:w-auto">
                {badge && (
                    <span className="text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full mb-3 inline-block tracking-wide">
                        {badge}
                    </span>
                )}
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2.5">
                    {backUrl && (
                        <Link href={backUrl} className="p-1.5 -ml-1.5 mr-1 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        </Link>
                    )}
                    {Icon && <Icon className="w-6 h-6 md:w-7 md:h-7 text-orange-500" strokeWidth={2.5} />} 
                    {title}
                </h2>
                {subtitle && (
                    <div className="text-slate-500 font-medium mt-1.5 text-xs md:text-sm">{subtitle}</div>
                )}
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
                {searchPlaceholder && (
                    <form onSubmit={(e) => e.preventDefault()} className="w-full sm:w-72 relative">
                        <input 
                            type="text" 
                            placeholder={searchPlaceholder} 
                            value={searchValue || ''} 
                            onChange={(e) => onSearchChange && onSearchChange(e.target.value)} 
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none" 
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </form>
                )}
                <div className="flex w-full sm:w-auto justify-end gap-2">
                    {actions}
                </div>
            </div>
            </div>

            {children && (
                <div className="w-full relative z-10 pt-5 border-t border-slate-100">
                    {children}
                </div>
            )}
        </div>
    );
}
