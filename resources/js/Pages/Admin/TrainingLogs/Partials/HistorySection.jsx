import { History, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, Fragment } from 'react';
import ExcelTable from './ExcelTable';

export default function HistorySection({ historySessions, userName }) {
    const [openHistoryId, setOpenHistoryId] = useState(null);

    const toggleHistory = (id) => {
        setOpenHistoryId(openHistoryId === id ? null : id);
    };

    if (!historySessions || historySessions.length === 0) return null;

    return (
        <div className="mt-16 border-t border-slate-200 pt-10">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                    <History className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg  font-bold text-slate-800">Riwayat Latihan Terdahulu</h3>
                    <p className="text-sm text-slate-500 font-medium">5 Sesi terakhir milik {userName}</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm whitespace-nowrap">
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
                                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${openHistoryId === hist.id ? 'bg-blue-50/30' : ''}`}
                                    onClick={() => toggleHistory(hist.id)}
                                >
                                    <td className="px-6 py-4 font-bold text-slate-700">
                                        {new Date(hist.date).toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-center  font-bold text-[#00488b]">{hist.session_number}</td>
                                    <td className="px-6 py-4 font-bold text-slate-800">{hist.training_type}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation(); 
                                                toggleHistory(hist.id);
                                            }}
                                            className="text-xs font-bold text-white bg-slate-400 hover:bg-[#00488b] px-4 py-2 rounded-lg transition-colors flex items-center gap-1 ml-auto"
                                        >
                                            {openHistoryId === hist.id ? (
                                                <><ChevronUp className="w-3.5 h-3.5"/> Tutup Log</>
                                            ) : (
                                                <><ChevronDown className="w-3.5 h-3.5"/> Lihat Log</>
                                            )}
                                        </button>
                                    </td>
                                </tr>

                                {openHistoryId === hist.id && (
                                    <tr>
                                        <td colSpan="4" className="p-0 border-b border-slate-200">
                                            <div className="p-4 md:p-6 bg-slate-100/50 shadow-inner">
                                                <div className="mb-3 flex justify-between items-center">
                                                    <span className="text-xs font-normal text-slate-500 uppercase tracking-wider">
                                                        Detail Log: Sesi {hist.session_number}
                                                    </span>
                                                </div>
                                                
                                                <div className="pointer-events-none opacity-90 scale-[0.98] origin-top-left">
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
    );
}