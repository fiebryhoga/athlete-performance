import { Search } from 'lucide-react';

export default function PageHeader({ 
    title, 
    subtitle, 
    badge = 'Management', 
    icon: Icon, 
    searchPlaceholder,
    searchValue,
    onSearchChange,
    actions 
}) {
    return (
        <div className="bg-white p-5 md:p-8 rounded-lg border border-slate-200 shadow-sm mb-6 md:mb-8 relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 md:gap-6">
            <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-70"></div>
            </div>
            
            <div className="relative z-10 w-full lg:w-auto">
                {badge && (
                    <span className="text-[12px] font-bold text-[#ff4d00] bg-orange-50 px-3 py-1 rounded-full mb-3 inline-block">
                        {badge}
                    </span>
                )}
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                    {Icon && <Icon className="w-7 h-7 md:w-8 md:h-8 text-[#ff4d00]" />} 
                    {title}
                </h2>
                {subtitle && (
                    <div className="text-slate-500 font-medium mt-1 text-xs md:text-sm">{subtitle}</div>
                )}
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                {searchPlaceholder && (
                    <form onSubmit={(e) => e.preventDefault()} className="w-full sm:w-72 relative">
                        <input 
                            type="text" 
                            placeholder={searchPlaceholder} 
                            value={searchValue || ''} 
                            onChange={(e) => onSearchChange && onSearchChange(e.target.value)} 
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border-slate-200 shadow-sm text-sm focus:ring-[#ff4d00] focus:border-[#ff4d00] transition-all outline-none" 
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </form>
                )}
                {actions}
            </div>
        </div>
    );
}
