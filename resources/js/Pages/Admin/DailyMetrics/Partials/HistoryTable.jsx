import React, { useState } from 'react';
import { Activity, Plus, Edit3, Zap, Eye, X, HeartPulse, FileText } from 'lucide-react';

export default function HistoryTable({ dailyHistory, formatDateToIndo, openModal, isAthlete }) {
    const totalActiveDays = dailyHistory?.filter(i => i.data && i.data.recovery_status !== 'KOSONG').length || 0;
    const [detailItem, setDetailItem] = useState(null);

    const getRecoveryColors = (status) => {
        if (status === 'RECOVERY BAIK') return {
            border: 'border-emerald-200',
            bg: 'bg-emerald-50',
            text: 'text-emerald-700'
        };
        if (status === 'RECOVERY CUKUP') return {
            border: 'border-amber-200',
            bg: 'bg-amber-50',
            text: 'text-amber-700'
        };
        if (status === 'RECOVERY KURANG') return {
            border: 'border-rose-200',
            bg: 'bg-rose-50',
            text: 'text-rose-700'
        };
        return {
            border: 'border-slate-200',
            bg: 'bg-slate-50',
            text: 'text-slate-500'
        };
    };

    return (
        <div className="w-full bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                    <Activity size={14} className="text-orange-500"/> 
                    <span>Kalender Riwayat Metrik Harian</span>
                </h3>
                {totalActiveDays > 0 && (
                    <span className="text-[11px] text-slate-500 font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                        Total: {totalActiveDays} Hari Terisi
                    </span>
                )}
            </div>
            
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-2.5">Waktu (WIB)</th>
                            <th className="hidden md:table-cell px-3 py-2.5 text-center">RHR</th>
                            <th className="hidden md:table-cell px-3 py-2.5 text-center">SpO2</th>
                            <th className="hidden lg:table-cell px-3 py-2.5 text-center">Peak Power</th>
                            <th className="px-4 py-2.5 text-center">Status Recovery</th>
                            <th className="hidden xl:table-cell px-3 py-2.5">Catatan</th>
                            <th className="px-4 py-2.5 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                        {dailyHistory && dailyHistory.length > 0 ? dailyHistory.map((item, index) => (
                            <tr key={index} className={`hover:bg-slate-50/70 transition-colors ${item.is_today ? 'bg-orange-50/30' : ''}`}>
                                <td className="px-4 py-2.5 align-middle">
                                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                        <span>{formatDateToIndo(item.record_date, 'short')}</span>
                                        {item.is_today && (
                                            <span className="text-[9px] bg-orange-500 text-white font-bold px-1.5 py-0.2 rounded shadow-2xs">
                                                Hari Ini
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{item.week_label}</div>
                                </td>
                                
                                <td className="hidden md:table-cell px-3 py-2.5 text-center font-bold text-slate-700">
                                    {item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : `${item.data?.rhr} bpm`}
                                </td>
                                <td className="hidden md:table-cell px-3 py-2.5 text-center font-bold text-slate-700">
                                    {item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : `${item.data?.spo2}%`}
                                </td>
                                <td className="hidden lg:table-cell px-3 py-2.5 text-center font-bold text-slate-800">
                                    {item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : (
                                        <span className="inline-flex items-center gap-0.5">
                                            {Number(item.data?.peak_power).toLocaleString('id-ID')} <span className="text-[10px] font-normal text-slate-400">W</span>
                                        </span>
                                    )}
                                </td>
                                
                                <td className="px-4 py-2.5 text-center align-middle">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10.5px] font-bold rounded border ${
                                        item.data?.recovery_status === 'RECOVERY BAIK' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                        item.data?.recovery_status === 'RECOVERY CUKUP' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                        item.data?.recovery_status === 'RECOVERY KURANG' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                                        'bg-slate-100 text-slate-400 border-slate-200'
                                    }`}>
                                        {item.data?.recovery_status === 'KOSONG' ? 'KOSONG' : `${item.data?.quick_recovery_score}% (${item.data?.recovery_status.replace('RECOVERY ', '')})`}
                                    </span>
                                </td>
                                
                                <td className="hidden xl:table-cell px-3 py-2.5 align-middle">
                                    {item.data?.recovery_status !== 'KOSONG' && item.data?.notes ? (
                                        <div className="max-w-[150px] truncate text-[11px] text-slate-500 font-medium bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200" title={item.data.notes}>
                                            {item.data.notes}
                                        </div>
                                    ) : (
                                        <span className="text-slate-300">-</span>
                                    )}
                                </td>
                                
                                <td className="px-4 py-2.5 text-right align-middle">
                                    <div className="flex items-center justify-end gap-1.5">
                                        {item.data?.recovery_status !== 'KOSONG' && (
                                            <button 
                                                onClick={() => setDetailItem(item)} 
                                                className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer" 
                                                title="Lihat Detail"
                                            >
                                                <Eye size={13} />
                                            </button>
                                        )}
                                        
                                        {!isAthlete && (
                                            <button 
                                                onClick={() => openModal(item)} 
                                                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md shadow-2xs transition-all cursor-pointer ${
                                                    item.data?.recovery_status === 'KOSONG' 
                                                        ? 'bg-orange-500 text-white hover:bg-orange-600 font-bold' 
                                                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                            >
                                                {item.data?.recovery_status === 'KOSONG' ? <><Plus size={12} /> Isi Data</> : <><Edit3 size={12} /> Edit</>}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={isAthlete ? 5 : 7} className="text-center py-12 text-slate-400 text-xs font-medium">
                                    Belum ada data monitoring.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detail Popup Modal */}
            {detailItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setDetailItem(null)} />
                    <div className="relative bg-white w-full max-w-md rounded-md border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-150 p-4 space-y-3">
                        <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                            <div>
                                <h3 className="font-bold text-xs sm:text-sm text-slate-900">Detail Metrik Harian</h3>
                                <p className="text-[10.5px] text-slate-500">{formatDateToIndo(detailItem.record_date, 'full')} • {detailItem.week_label}</p>
                            </div>
                            <button onClick={() => setDetailItem(null)} className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer">
                                <X size={15} />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-slate-50 p-2 rounded-md border border-slate-200/80 text-center">
                                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">RHR</span>
                                <span className="text-sm font-black text-slate-900">{detailItem.data?.rhr} <small className="text-[9px] font-normal text-slate-400">bpm</small></span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-md border border-slate-200/80 text-center">
                                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">SpO2</span>
                                <span className="text-sm font-black text-slate-900">{detailItem.data?.spo2}%</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-md border border-slate-200/80 text-center">
                                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Berat Badan</span>
                                <span className="text-sm font-black text-slate-900">{detailItem.data?.weight} <small className="text-[9px] font-normal text-slate-400">kg</small></span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-md border border-slate-200/80 text-center">
                                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Vertical Jump</span>
                                <span className="text-sm font-black text-slate-900">{detailItem.data?.vj} <small className="text-[9px] font-normal text-slate-400">cm</small></span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-md border border-slate-200/80 text-center">
                                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">VO2Max</span>
                                <span className="text-sm font-black text-slate-900">{Number(detailItem.data?.vo2_max).toLocaleString('id-ID', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-md border border-slate-200/80 text-center">
                                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Peak Power</span>
                                <span className="text-sm font-black text-slate-900">{Number(detailItem.data?.peak_power).toLocaleString('id-ID')} <small className="text-[9px] font-normal text-slate-400">W</small></span>
                            </div>
                        </div>

                        {(() => {
                            const recColors = getRecoveryColors(detailItem.data?.recovery_status);
                            return (
                                <div className={`flex items-center justify-between p-2.5 rounded-md border ${recColors.border} ${recColors.bg}`}>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recovery Score</p>
                                        <p className={`text-xs font-black ${recColors.text}`}>{detailItem.data?.recovery_status}</p>
                                    </div>
                                    <span className={`text-xl font-black ${recColors.text}`}>{detailItem.data?.quick_recovery_score}%</span>
                                </div>
                            );
                        })()}

                        {detailItem.data?.notes && (
                            <div className="bg-slate-50 p-2.5 rounded-md border border-slate-200 text-xs">
                                <span className="font-bold text-slate-700 block mb-0.5">Catatan:</span>
                                <p className="text-slate-600 italic">"{detailItem.data.notes}"</p>
                            </div>
                        )}

                        <div className="flex justify-end pt-2 border-t border-slate-100">
                            <button 
                                onClick={() => setDetailItem(null)} 
                                className="px-3.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-bold transition-colors cursor-pointer"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}