import { Link } from '@inertiajs/react';
import { ArrowLeft, Activity, Trophy } from 'lucide-react';

export default function ProfileHeader({ safeAthlete, bmi, initial }) {
    return (
        <>
            <div className="mb-8">
                <Link href={route('admin.athletes.index')} className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-[#00488b] mb-4 group transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1" />
                    Back to Athletes List
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Athlete Analysis</h1>
                        <p className="text-slate-500 text-sm mt-1">Comprehensive performance report and physical metrics.</p>
                    </div>
                    {safeAthlete.name && (
                        <Link href={route('admin.performance.index', { search: safeAthlete.name })} className="w-full md:w-auto bg-white border border-slate-200 text-[#00488b] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm flex items-center justify-center gap-2">
                            <Activity className="w-4 h-4" /> View Training Logs
                        </Link>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center h-full relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-50 to-transparent"></div>
                
                <div className="relative z-10 w-28 h-28 mb-5 mt-2">
                    {safeAthlete.profile_photo_url ? (
                        <img src={safeAthlete.profile_photo_url} alt={safeAthlete.name} className="w-full h-full rounded-2xl object-cover shadow-xl shadow-blue-900/10 border-4 border-white rotate-3 hover:rotate-0 transition-transform duration-300" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#00488b] to-blue-600 rounded-2xl flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-blue-900/20 border-4 border-white rotate-3 hover:rotate-0 transition-transform duration-300">
                            {initial}
                        </div>
                    )}
                </div>
                
                <h2 className="text-xl font-black text-slate-800 tracking-tight">{safeAthlete.name || 'Unknown Name'}</h2>
                <p className="text-xs text-slate-400 font-bold tracking-widest uppercase mt-1 mb-3">{safeAthlete.athlete_id || '-'}</p>
                
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-[#00488b] rounded-lg text-[10px] font-extrabold uppercase tracking-wider border border-blue-100 mb-6">
                    <Trophy className="w-3.5 h-3.5" /> {safeAthlete.sport?.name || 'No Sport'}
                </span>

                <div className="grid grid-cols-2 gap-3 w-full mt-auto pt-6 border-t border-slate-100">
                    <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100/50 transition-colors hover:bg-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Height</p>
                        <p className="font-black text-slate-700">{safeAthlete.height || '-'} <span className="text-[10px] font-bold text-slate-400">cm</span></p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100/50 transition-colors hover:bg-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Weight</p>
                        <p className="font-black text-slate-700">{safeAthlete.weight || '-'} <span className="text-[10px] font-bold text-slate-400">kg</span></p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100/50 transition-colors hover:bg-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Age</p>
                        <p className="font-black text-slate-700">{safeAthlete.age || '-'} <span className="text-[10px] font-bold text-slate-400">yrs</span></p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100/50 transition-colors hover:bg-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">BMI</p>
                        <p className="font-black text-[#00488b]">{bmi}</p>
                    </div>
                </div>
            </div>
        </>
    );
}