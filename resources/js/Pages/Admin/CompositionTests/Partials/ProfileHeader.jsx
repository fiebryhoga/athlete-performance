import { Link } from '@inertiajs/react';
import { ArrowLeft, Plus, User } from 'lucide-react';

export default function ProfileHeader({ athlete, onOpenModal, is_athlete }) {
    return (
        <div className="mb-6 md:mb-8">
            
            {/* TOMBOL KEMBALI HANYA MUNCUL JIKA BUKAN ATLET (ADMIN/COACH) */}
            {!is_athlete && (
                <Link href={route('admin.composition-tests.index')} className="text-slate-500 hover:text-[#ff4d00] flex items-center gap-1.5 font-bold text-[10px] md:text-xs mb-4 transition-colors group w-fit uppercase tracking-widest">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Kembali ke Daftar
                </Link>
            )}
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 bg-white p-5 md:p-6 rounded-lg border border-[#BFC9D1]/50 shadow-sm relative overflow-hidden">
                
                {/* Efek Glow menggunakan palet warna FFCE99 dan EAEFEF */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#FFCE99] rounded-full blur-3xl opacity-40 pointer-events-none"></div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#EAEFEF] rounded-full blur-3xl opacity-80 pointer-events-none"></div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border border-[#BFC9D1]/50 shrink-0 bg-[#EAEFEF] flex items-center justify-center shadow-sm">
                        {athlete.profile_photo_url ? (
                            <img src={athlete.profile_photo_url} alt={athlete.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-6 h-6 md:w-7 md:h-7 text-[#FF9644]" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-[#262626] tracking-tight">{athlete.name}</h2>
                        <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5 flex items-center flex-wrap">
                            {athlete.sport?.name || 'Umum'} 
                            <span className="text-[#BFC9D1] mx-1.5">•</span> 
                            {athlete.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </p>
                    </div>
                </div>
                
                {/* TOMBOL INPUT TES BARU HANYA MUNCUL JIKA BUKAN ATLET (ADMIN/COACH) */}
                {!is_athlete && (
                    <button onClick={onOpenModal} className="w-full md:w-auto bg-[#ff4d00] text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FF9644]/40 hover:bg-[#FF9644] hover:shadow-xl hover:-translate-y-0.5 transition-all relative z-10 uppercase tracking-widest">
                        <Plus className="w-4 h-4 md:w-5 md:h-5" /> Input Tes Baru
                    </button>
                )}
            </div>
        </div>
    );
}