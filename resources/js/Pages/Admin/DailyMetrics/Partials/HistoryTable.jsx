import { Activity, Plus, Edit3, Zap, Eye, X, HeartPulse, FileText } from 'lucide-react';
import { useState } from 'react';

export default function HistoryTable({ dailyHistory, formatDateToIndo, openModal, isAthlete }) {
    const totalActiveDays = dailyHistory?.filter(i => i.data && i.data.recovery_status !== 'KOSONG').length || 0;

    // State untuk mengontrol Modal Detail
    const [detailItem, setDetailItem] = useState(null);

    // Fungsi Helper untuk Warna Dinamis Kotak Recovery
    const getRecoveryColors = (status) => {
        if (status === 'RECOVERY BAIK') return {
            border: 'border-emerald-100',
            bg: 'bg-emerald-50',
            text: 'text-emerald-500'
        };
        if (status === 'RECOVERY CUKUP') return {
            border: 'border-amber-100',
            bg: 'bg-amber-50',
            text: 'text-amber-500'
        };
        if (status === 'RECOVERY KURANG') return {
            border: 'border-red-100',
            bg: 'bg-red-50',
            text: 'text-red-500'
        };
        // Default jika kosong/libur
        return {
            border: 'border-slate-100',
            bg: 'bg-slate-50',
            text: 'text-slate-400'
        };
    };

    return (
        <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5 text-[#00488b]"/> Kalender Metrik Harian
                </h3>
                {totalActiveDays > 0 && <p className="text-sm text-slate-500 font-medium">Total Data: {totalActiveDays} Hari Aktif</p>}
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-white border-b border-slate-100 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider">
                        <tr>
                            <th className="px-4 py-4">Waktu (WIB)</th>
                            <th className="px-4 py-4 text-center">RHR</th>
                            <th className="px-4 py-4 text-center">SpO2</th>
                            <th className="px-4 py-4 text-center text-[#00488b]">Peak Power</th>
                            <th className="px-4 py-4 text-center">Recovery</th>
                            <th className="px-4 py-4">Catatan</th>
                            <th className="px-4 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {dailyHistory && dailyHistory.length > 0 ? dailyHistory.map((item, index) => (
                            <tr key={index} className={`hover:bg-slate-50 transition-colors ${item.is_today ? 'bg-blue-50/40' : ''}`}>
                                <td className="px-4 py-3">
                                    <div className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                                        {formatDateToIndo(item.record_date, 'short')}
                                        {item.is_today && <span className="text-[9px] bg-[#00488b] text-white px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">Hari Ini</span>}
                                    </div>
                                    <div className="text-[11px] text-[#00488b] font-bold mt-0.5">{item.week_label}</div>
                                </td>
                                <td className="px-4 py-3 text-center font-bold text-slate-700 text-sm">
                                    {item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : item.data?.rhr}
                                </td>
                                <td className="px-4 py-3 text-center font-bold text-slate-700 text-sm">
                                    {item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : `${item.data?.spo2}%`}
                                </td>
                                <td className="px-4 py-3 text-center font-bold text-slate-800 text-sm bg-slate-50/50">
                                    {item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : (
                                        <span className="flex items-center justify-center gap-1">
                                            {Number(item.data?.peak_power).toLocaleString('id-ID', { minimumFractionDigits: 0 })} <Zap className="w-3.5 h-3.5 text-amber-500"/>
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider rounded-xl border shadow-sm ${
                                        item.data?.recovery_status === 'RECOVERY BAIK' ? 'bg-green-50 text-green-700 border-green-200' : 
                                        item.data?.recovery_status === 'RECOVERY CUKUP' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                        item.data?.recovery_status === 'RECOVERY KURANG' ? 'bg-red-50 text-red-700 border-red-200' : 
                                        'bg-slate-100 text-slate-400 border-slate-200 shadow-none'
                                    }`}>
                                        {item.data?.recovery_status === 'KOSONG' ? 'LIBUR / KOSONG' : <>{item.data?.quick_recovery_score}% <span className="w-1 h-1 rounded-full bg-current opacity-50"></span> {item.data?.recovery_status}</>}
                                    </span>
                                </td>
                                
                                {/* KOLOM CATATAN */}
                                <td className="px-4 py-3">
                                    {item.data?.recovery_status !== 'KOSONG' && item.data?.notes ? (
                                        <div className="max-w-[150px] truncate text-[11px] text-slate-500 italic bg-slate-100 px-2 py-1 rounded border border-slate-200" title={item.data.notes}>
                                            {item.data.notes}
                                        </div>
                                    ) : (
                                        <span className="text-slate-300">-</span>
                                    )}
                                </td>
                                
                                {/* KOLOM AKSI (DETAIL & EDIT) */}
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {/* Tombol Detail */}
                                        {item.data?.recovery_status !== 'KOSONG' && (
                                            <button onClick={() => setDetailItem(item)} className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors border border-transparent hover:border-sky-200" title="Lihat Detail Lengkap">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        )}
                                        
                                        {/* Tombol Edit/Isi Data (Hanya Admin/Coach) */}
                                        {!isAthlete && (
                                            <button onClick={() => openModal(item)} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all ${
                                                item.data?.recovery_status === 'KOSONG' ? 'bg-[#00488b] text-white hover:bg-[#003666]' : 'bg-white border border-slate-200 text-slate-500 hover:text-[#00488b] hover:bg-blue-50'
                                            }`}>
                                                {item.data?.recovery_status === 'KOSONG' ? <><Plus className="w-3 h-3" /> Isi Data</> : <><Edit3 className="w-3 h-3" /> Edit</>}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={isAthlete ? "6" : "7"} className="text-center py-16 text-slate-500">Belum ada data monitoring.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ========================================== */}
            {/* MODAL POP-UP DETAIL LENGKAP                */}
            {/* ========================================== */}
            {detailItem && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setDetailItem(null)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-[#00488b] rounded-xl">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800 leading-tight">Detail Metrik Harian</h3>
                                    <p className="text-xs font-medium text-slate-500 mt-0.5">{formatDateToIndo(detailItem.record_date, 'full')} • {detailItem.week_label}</p>
                                </div>
                            </div>
                            <button onClick={() => setDetailItem(null)} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            {/* Grid 6 Kotak Angka */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">RHR</p>
                                    <p className="font-black text-slate-800 text-xl">{detailItem.data?.rhr} <span className="text-xs font-medium text-slate-500">bpm</span></p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">SpO2</p>
                                    <p className="font-black text-slate-800 text-xl">{detailItem.data?.spo2}<span className="text-xs font-medium text-slate-500">%</span></p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Berat Badan</p>
                                    <p className="font-black text-slate-800 text-xl">{detailItem.data?.weight} <span className="text-xs font-medium text-slate-500">kg</span></p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Vertical Jump</p>
                                    <p className="font-black text-slate-800 text-xl">{detailItem.data?.vj} <span className="text-xs font-medium text-slate-500">cm</span></p>
                                </div>
                                <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100">
                                    <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">VO2Max</p>
                                    <p className="font-black text-sky-700 text-xl">{Number(detailItem.data?.vo2_max).toLocaleString('id-ID', { minimumFractionDigits: 2 })}</p>
                                </div>
                                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Zap className="w-3 h-3"/> Power</p>
                                    <p className="font-black text-amber-700 text-xl">{Number(detailItem.data?.peak_power).toLocaleString('id-ID', { minimumFractionDigits: 0 })} <span className="text-xs font-medium">W</span></p>
                                </div>
                            </div>

                            {/* KOTAK RECOVERY DINAMIS (Berdasarkan Status) */}
                            {(() => {
                                const recColors = getRecoveryColors(detailItem.data?.recovery_status);
                                return (
                                    <div className={`flex items-center justify-between p-4 rounded-2xl border mb-6 bg-white shadow-sm ${recColors.border}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${recColors.bg} ${recColors.text}`}>
                                                <HeartPulse className="w-5 h-5"/>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recovery Score</p>
                                                <p className={`text-sm font-bold mt-0.5 ${recColors.text}`}>{detailItem.data?.recovery_status}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-3xl font-black ${recColors.text}`}>{detailItem.data?.quick_recovery_score}%</span>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Kotak Catatan */}
                            {detailItem.data?.notes ? (
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                    <div className="flex items-center gap-2 mb-2 text-slate-600">
                                        <FileText className="w-4 h-4" />
                                        <h4 className="text-xs font-bold uppercase tracking-wider">Catatan Tambahan</h4>
                                    </div>
                                    <p className="text-sm text-slate-700 leading-relaxed italic border-l-2 border-slate-300 pl-3 ml-1 whitespace-pre-wrap">
                                        "{detailItem.data.notes}"
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-2 text-slate-400 text-xs italic">
                                    Tidak ada catatan untuk hari ini.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}