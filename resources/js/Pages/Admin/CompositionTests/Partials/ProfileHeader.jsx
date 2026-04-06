import { Link } from '@inertiajs/react';
import { ArrowLeft, Plus } from 'lucide-react';

export default function ProfileHeader({ athlete, onOpenModal, is_athlete }) {
    return (
        <div className="mb-8">
            
            {/* TOMBOL KEMBALI HANYA MUNCUL JIKA BUKAN ATLET (ADMIN/COACH) */}
            {!is_athlete && (
                <Link href={route('admin.composition-tests.index')} className="text-slate-500 hover:text-[#00488b] flex items-center gap-2 font-bold text-sm mb-4 transition-colors group w-fit">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Daftar
                </Link>
            )}
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-5 relative z-10">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-slate-100 shrink-0">
                        {athlete.profile_photo_url ? (
                            <img src={athlete.profile_photo_url} alt={athlete.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-400 font-bold text-xl">
                                {athlete.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">{athlete.name}</h2>
                        <p className="text-sm text-slate-500 font-medium">{athlete.sport?.name || 'Umum'} • {athlete.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                    </div>
                </div>
                
                {/* TOMBOL INPUT TES BARU HANYA MUNCUL JIKA BUKAN ATLET (ADMIN/COACH) */}
                {!is_athlete && (
                    <button onClick={onOpenModal} className="w-full md:w-auto bg-[#00488b] text-white px-6 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-[#003666] transition-all relative z-10">
                        <Plus className="w-5 h-5" /> Input Tes Baru
                    </button>
                )}
            </div>
        </div>
    );
}