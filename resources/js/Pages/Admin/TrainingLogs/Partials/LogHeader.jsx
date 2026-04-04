import { User, MapPin, Calendar, Dumbbell, Activity } from 'lucide-react';

export default function LogHeader({ session }) {
    return (
        <div className="relative bg-white rounded-lg border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 overflow-hidden mb-8">
            {/* Garis aksen vertikal di sebelah kiri */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#00488b] to-blue-300"></div>
            
            {/* Dekorasi Background Halus */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50/50 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center w-full">
                {/* FOTO PROFIL & BADGE SESI */}
                <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-50 flex items-center justify-center relative z-10">
                        {session.user?.profile_photo_url ? (
                            <img src={session.user.profile_photo_url} alt={session.user.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-8 h-8 text-slate-300" />
                        )}
                    </div>
                    {/* Badge Sesi menempel di sudut foto */}
                    <div className="absolute -bottom-3 -right-3 bg-[#00488b] text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg border-2 border-white uppercase tracking-widest z-20">
                        Sesi {session.session_number}
                    </div>
                </div>

                {/* INFO UTAMA (TENGAH) */}
                <div className="flex-1 mt-3 sm:mt-0 sm:ml-2">
                    <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-blue-500" />
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Training Program</span>
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-800 uppercase tracking-tight">
                        {session.training_type}
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4 text-sm font-medium">
                        <div className="flex items-center gap-2.5 text-slate-600">
                            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                <User className="w-3.5 h-3.5 text-slate-500"/>
                            </div>
                            <span>Client: <strong className="text-slate-800">{session.user?.name || '-'}</strong></span>
                        </div>
                        <div className="flex items-center gap-2.5 text-slate-600">
                            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                <Dumbbell className="w-3.5 h-3.5 text-slate-500"/>
                            </div>
                            <span>Coach: <strong className="text-slate-800">{session.coach?.name || '-'}</strong></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* INFO WAKTU & LOKASI (KANAN) */}
            <div className="relative z-10 flex flex-col gap-3 shrink-0 w-full md:w-auto md:min-w-[220px]">
                {/* Kotak Tanggal */}
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-lg border border-slate-100 transition-colors hover:bg-slate-100/80">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-[#00488b]">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Tanggal</p>
                        <p className="text-sm font-bold text-slate-700">
                            {new Date(session.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Kotak Lokasi */}
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-lg border border-slate-100 transition-colors hover:bg-slate-100/80">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-rose-500">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Lokasi</p>
                        <p className="text-sm font-bold text-slate-700 truncate max-w-[150px]">
                            {session.location || 'Tidak ditentukan'}
                        </p>
                    </div>
                </div>
            </div>
            
        </div>
    );
}