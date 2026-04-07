import { Calendar, User, Plus, Search, CalendarDays } from 'lucide-react';

export default function HeaderProfile({ athlete, selectedDate, setSelectedDate, openModal, searchDate, setSearchDate }) {
    return (
        <div className="w-full bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between md:items-center gap-5 md:gap-6">
            
            <div className="flex items-center gap-3 md:gap-5">
                
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden bg-orange-50 text-[#ff4d00] flex items-center justify-center font-bold text-xl md:text-2xl border-2 md:border-4 border-white shadow-sm shrink-0">
                    {athlete?.profile_photo_url ? (
                        <img src={athlete.profile_photo_url} alt={athlete.name} className="w-full h-full object-cover" />
                    ) : (
                        athlete?.name?.charAt(0).toUpperCase() || <User className="w-6 h-6 md:w-8 h-8"/>
                    )}
                </div>
                
                <div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">{athlete?.name || 'Loading...'}</h2>
                    <span className="px-2 md:px-3 py-0.5 md:py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] md:text-xs font-medium border border-slate-200 mt-1 md:mt-2 inline-block">
                        {athlete?.sport?.name || 'Tanpa Cabor'}
                    </span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                
                <div className="flex flex-col">
                    <label className="text-[10px] md:text-xs font-medium text-slate-500 mb-1 md:mb-1.5 flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" /> Cari Data Minggu
                    </label>
                    <div className="flex gap-2">
                        
                        <input 
                            type="date" 
                            value={searchDate} 
                            onChange={e => setSearchDate(e.target.value)} 
                            className="w-full sm:w-40 text-xs md:text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/50 focus:border-[#ff4d00] transition-all bg-white text-slate-700 px-2.5 md:px-3 py-1.5 md:py-2"
                        />
                        {searchDate && (
                            <button onClick={() => setSearchDate('')} className="bg-white border border-slate-200 text-slate-500 px-3 md:px-4 rounded-lg hover:bg-slate-50 transition-colors text-xs md:text-sm font-medium">Reset</button>
                        )}
                    </div>
                </div>

                
                <div className="flex flex-col">
                    <label className="text-[10px] md:text-xs font-medium text-slate-500 mb-1 md:mb-1.5 flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" /> Input Data Harian
                    </label>
                    <div className="flex gap-2">
                        
                        <input 
                            type="date" 
                            value={selectedDate} 
                            onChange={e => setSelectedDate(e.target.value)} 
                            className="w-full sm:w-40 text-xs md:text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/50 focus:border-[#ff4d00] transition-all bg-white text-slate-700 px-2.5 md:px-3 py-1.5 md:py-2"
                        />
                        
                        <button onClick={() => openModal(selectedDate)} className="bg-[#ff4d00] text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-[#e64500] transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap">
                            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" /> Input
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}