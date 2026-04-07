import { History, ChevronDown, ChevronUp, Activity, Calendar } from 'lucide-react';
import { useState, Fragment } from 'react';
import ExcelTable from './ExcelTable';

export default function HistorySection({ historySessions, userName }) {
    const [openHistoryId, setOpenHistoryId] = useState(null);

    const toggleHistory = (id) => {
        setOpenHistoryId(openHistoryId === id ? null : id);
    };

    if (!historySessions || historySessions.length === 0) return null;

    const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <div className="mt-8 md:mt-16 border-t border-slate-200 pt-6 md:pt-10 w-full max-w-full">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="p-2 md:p-2.5 bg-orange-50 rounded-xl text-[#ff4d00]">
                    <History className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-base md:text-xl font-bold text-slate-800 tracking-tight">Riwayat Latihan</h3>
                    <p className="text-xs md:text-sm text-slate-500 font-medium">5 Sesi terakhir milik {userName}</p>
                </div>
            </div>

            
            
            <div className="md:hidden flex flex-col gap-3 w-full">
                {historySessions.map(hist => {
                    const isOpen = openHistoryId === hist.id;
                    return (
                        <div key={hist.id} className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${isOpen ? 'border-[#ff4d00]/30 ring-1 ring-[#ff4d00]/20' : 'border-slate-200'}`}>
                            
                            <div 
                                className={`p-4 flex flex-col gap-3 touch-manipulation cursor-pointer ${isOpen ? 'bg-orange-50/10' : 'bg-white'}`} 
                                onClick={() => toggleHistory(hist.id)}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-xs">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400"/> {formatDate(hist.date)}
                                    </div>
                                    <span className="text-[9px] font-bold text-[#ff4d00] bg-orange-50 px-2 py-1 rounded-md uppercase border border-orange-100 tracking-widest">
                                        Sesi {hist.session_number}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                            <Activity className="w-3 h-3"/> Program
                                        </span>
                                        <span className="font-bold text-slate-800 text-sm truncate max-w-[200px]">{hist.training_type}</span>
                                    </div>
                                    <button className={`text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${isOpen ? 'bg-[#ff4d00] text-white' : 'bg-slate-100 text-slate-600'}`}>
                                        {isOpen ? <><ChevronUp className="w-3 h-3"/> Tutup</> : <><ChevronDown className="w-3 h-3"/> Detail</>}
                                    </button>
                                </div>
                            </div>

                            
                            {isOpen && (
                                <div className="border-t border-slate-100 bg-slate-50 overflow-hidden">
                                    <div className="p-3">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Isi Log Sesi {hist.session_number}:</span>
                                        
                                        <div className="pointer-events-none opacity-90 overflow-x-auto custom-scrollbar w-full rounded-lg border border-slate-200">
                                            <ExcelTable 
                                                data={{ exercises: hist.exercises || [] }} 
                                                is_athlete={true} 
                                                handleExChange={() => {}} 
                                                libExercises={[]} 
                                                handleAddNewExercise={() => {}} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            
            <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm w-full max-w-full">
                <div className="overflow-x-auto w-full custom-scrollbar max-w-full">
                    <table className="w-full text-left text-sm whitespace-nowrap min-w-[500px]">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Tanggal</th>
                                <th className="px-6 py-4 text-center">Sesi</th>
                                <th className="px-6 py-4">Tipe Latihan</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {historySessions.map(hist => (
                                <Fragment key={hist.id}>
                                    <tr 
                                        className={`hover:bg-slate-50 transition-colors cursor-pointer ${openHistoryId === hist.id ? 'bg-orange-50/30' : ''}`}
                                        onClick={() => toggleHistory(hist.id)}
                                    >
                                        <td className="px-6 py-4 font-bold text-slate-700">
                                            {formatDate(hist.date)}
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-[#ff4d00]">Sesi {hist.session_number}</td>
                                        <td className="px-6 py-4 font-bold text-slate-800">
                                            <div className="flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-slate-400" /> {hist.training_type}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    toggleHistory(hist.id);
                                                }}
                                                className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ml-auto ${openHistoryId === hist.id ? 'bg-[#ff4d00] text-white shadow-md shadow-[#ff4d00]/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                            >
                                                {openHistoryId === hist.id ? <><ChevronUp className="w-4 h-4"/> Tutup</> : <><ChevronDown className="w-4 h-4"/> Buka Log</>}
                                            </button>
                                        </td>
                                    </tr>

                                    {openHistoryId === hist.id && (
                                        <tr>
                                            <td colSpan="4" className="p-0 border-b border-slate-200 max-w-0">
                                                <div className="p-6 bg-slate-50 shadow-inner w-full overflow-hidden">
                                                    <div className="mb-4 flex justify-between items-center min-w-max">
                                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                            Detail Log: Sesi {hist.session_number}
                                                        </span>
                                                    </div>
                                                    
                                                    
                                                    <div className="pointer-events-none opacity-90 overflow-x-auto w-full max-w-full custom-scrollbar rounded-xl border border-slate-200 bg-white">
                                                        <ExcelTable 
                                                            data={{ exercises: hist.exercises || [] }} 
                                                            is_athlete={true} 
                                                            handleExChange={() => {}} 
                                                            libExercises={[]} 
                                                            handleAddNewExercise={() => {}} 
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}