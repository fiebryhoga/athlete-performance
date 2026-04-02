import { Calendar, User, Plus, Search, CalendarDays } from 'lucide-react';

export default function HeaderProfile({ athlete, selectedDate, setSelectedDate, openModal, searchDate, setSearchDate }) {
    return (
        <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between md:items-center gap-6">
            
            <div className="flex items-center gap-5">
                {/* AREA FOTO PROFIL */}
                <div className="w-16 h-16 rounded-full overflow-hidden bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-2xl border-4 border-white shadow-sm shrink-0">
                    {athlete?.profile_photo_url ? (
                        <img src={athlete.profile_photo_url} alt={athlete.name} className="w-full h-full object-cover" />
                    ) : (
                        athlete?.name?.charAt(0).toUpperCase() || <User className="w-8 h-8"/>
                    )}
                </div>
                
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">{athlete?.name || 'Loading...'}</h2>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200 mt-2 inline-block">
                        {athlete?.sport?.name || 'Tanpa Cabor'}
                    </span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                {/* KOTAK PENCARIAN MINGGU (FILTER) */}
                <div className="flex flex-col">
                    <label className="text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1.5">
                        <Search className="w-4 h-4 text-slate-400" /> Cari Data Minggu
                    </label>
                    <div className="flex gap-2">
                        <input 
                            type="date" 
                            value={searchDate} 
                            onChange={e => setSearchDate(e.target.value)} 
                            className="w-full sm:w-40 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-slate-700 px-3 py-2"
                        />
                        {searchDate && (
                            <button onClick={() => setSearchDate('')} className="bg-white border border-slate-200 text-slate-500 px-4 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">Reset</button>
                        )}
                    </div>
                </div>

                {/* KOTAK INPUT DATA BARU */}
                <div className="flex flex-col">
                    <label className="text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4 text-slate-400" /> Input Data Harian
                    </label>
                    <div className="flex gap-2">
                        <input 
                            type="date" 
                            value={selectedDate} 
                            onChange={e => setSelectedDate(e.target.value)} 
                            className="w-full sm:w-40 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all bg-white text-slate-700 px-3 py-2"
                        />
                        <button onClick={() => openModal(selectedDate)} className="bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors flex items-center gap-1.5 shadow-sm">
                            <Plus className="w-4 h-4" /> Input
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}