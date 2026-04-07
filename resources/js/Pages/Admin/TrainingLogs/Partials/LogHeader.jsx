import { User, MapPin, Calendar, Dumbbell, Activity, Target } from 'lucide-react';

export default function LogHeader({ session }) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-6 md:mb-8 w-full max-w-full overflow-hidden flex flex-col">
            
            

            <div className="p-5 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 md:gap-6 relative">
                
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-orange-50/50 to-transparent pointer-events-none"></div>

                
                <div className="shrink-0 relative z-10">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white shadow-md bg-slate-100 flex items-center justify-center overflow-hidden">
                        {session.user?.profile_photo_url ? (
                            <img src={session.user.profile_photo_url} alt={session.user.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-8 h-8 text-slate-400" />
                        )}
                    </div>
                </div>

                
                <div className="flex-1 min-w-0 relative z-10">
                    <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-2.5">
                        <span className="bg-[#ff4d00] text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-md uppercase tracking-widest shadow-sm shadow-[#ff4d00]/20">
                            Sesi {session.session_number}
                        </span>
                        <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1 rounded-md">
                            <Activity className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#ff4d00]" /> Program Latihan
                        </span>
                    </div>
                    
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-tight break-words whitespace-normal">
                        {session.training_type}
                    </h2>
                </div>
            </div>

            

            <div className="grid grid-cols-2 md:grid-cols-4 bg-slate-50 border-t border-slate-100 divide-x divide-slate-200/60">
                
                
                <div className="p-4 md:p-5 flex items-center gap-3 border-b md:border-b-0 border-slate-200/60">
                    <div className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 shadow-sm shrink-0">
                        <User className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Klien (Atlet)</p>
                        <p className="text-xs md:text-sm font-bold text-slate-700 truncate">{session.user?.name || '-'}</p>
                    </div>
                </div>

                
                <div className="p-4 md:p-5 flex items-center gap-3 border-b md:border-b-0 border-slate-200/60">
                    <div className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 shadow-sm shrink-0">
                        <Dumbbell className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Coach Pendamping</p>
                        <p className="text-xs md:text-sm font-bold text-slate-700 truncate">{session.coach?.name || 'Latihan Mandiri'}</p>
                    </div>
                </div>

                
                <div className="p-4 md:p-5 flex items-center gap-3">
                    <div className="p-2 bg-white border border-slate-200 rounded-lg text-[#ff4d00] shadow-sm shrink-0">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Tanggal</p>
                        <p className="text-xs md:text-sm font-bold text-slate-700 truncate">
                            {new Date(session.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                
                <div className="p-4 md:p-5 flex items-center gap-3">
                    <div className="p-2 bg-white border border-slate-200 rounded-lg text-rose-500 shadow-sm shrink-0">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Lokasi Latihan</p>
                        <p className="text-xs md:text-sm font-bold text-slate-700 truncate">{session.location || 'Tidak diatur'}</p>
                    </div>
                </div>

            </div>
        </div>
    );
}