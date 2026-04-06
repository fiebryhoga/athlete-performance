import { Link } from '@inertiajs/react';
import { ArrowLeft, Activity, Trophy } from 'lucide-react';

export default function ProfileHeader({ safeAthlete, bmi, initial }) {
    return (
        <>
            <div className="mb-8">
                <Link href={route('admin.athletes.index')} className="inline-flex items-center text-[10px] font-bold text-slate-400 hover:text-[#ff4d00] mb-4 group transition-colors uppercase tracking-widest">
                    <ArrowLeft className="w-3 h-3 mr-1.5 transition-transform group-hover:-translate-x-1" />
                    Back to Athletes List
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Athlete Analysis</h1>
                        <p className="text-slate-500 font-medium text-sm mt-1">Comprehensive performance report and physical metrics.</p>
                    </div>
                    {safeAthlete.name && (
                        <Link href={route('admin.performance.index', { search: safeAthlete.name })} className="w-full md:w-auto bg-white border border-slate-200 text-[#ff4d00] px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-orange-50 hover:border-orange-200 transition-all shadow-sm flex items-center justify-center gap-2">
                            <Activity className="w-4 h-4" /> View Training Logs
                        </Link>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center h-full relative overflow-hidden group hover:border-orange-200 transition-colors">
                {/* Efek Latar Belakang Profil */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-orange-50 to-transparent"></div>
                
                <div className="relative z-10 w-28 h-28 mb-5 mt-2">
                    {safeAthlete.profile_photo_url ? (
                        <img src={safeAthlete.profile_photo_url} alt={safeAthlete.name} className="w-full h-full rounded-lg object-cover shadow-lg shadow-[#ff4d00]/10 border-4 border-white rotate-3 group-hover:rotate-0 transition-transform duration-300" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#ff4d00] to-orange-500 rounded-lg flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-[#ff4d00]/20 border-4 border-white rotate-3 group-hover:rotate-0 transition-transform duration-300">
                            {initial}
                        </div>
                    )}
                </div>
                
                <h2 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-[#ff4d00] transition-colors">{safeAthlete.name || 'Unknown Name'}</h2>
                <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1 mb-3">{safeAthlete.athlete_id || '-'}</p>
                
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-50 text-[#ff4d00] rounded-lg text-[10px] font-bold uppercase tracking-widest border border-orange-100 mb-6">
                    <Trophy className="w-3.5 h-3.5" /> {safeAthlete.sport?.name || 'No Sport'}
                </span>

                <div className="grid grid-cols-2 gap-3 w-full mt-auto pt-6 border-t border-slate-100">
                    <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-100/50 transition-colors hover:bg-orange-50 hover:border-orange-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Height</p>
                        <p className="font-bold text-slate-700">{safeAthlete.height || '-'} <span className="text-[10px] font-bold text-slate-400">cm</span></p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-100/50 transition-colors hover:bg-orange-50 hover:border-orange-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Weight</p>
                        <p className="font-bold text-slate-700">{safeAthlete.weight || '-'} <span className="text-[10px] font-bold text-slate-400">kg</span></p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-100/50 transition-colors hover:bg-orange-50 hover:border-orange-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Age</p>
                        <p className="font-bold text-slate-700">{safeAthlete.age || '-'} <span className="text-[10px] font-bold text-slate-400">yrs</span></p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-100/50 transition-colors hover:bg-orange-50 hover:border-orange-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">BMI</p>
                        <p className="font-bold text-[#ff4d00]">{bmi}</p>
                    </div>
                </div>
            </div>
        </>
    );
}