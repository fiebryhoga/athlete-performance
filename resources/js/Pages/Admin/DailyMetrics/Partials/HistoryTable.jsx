import { Activity, Plus, Edit3, Zap } from 'lucide-react';

// MENERIMA PROPS `isAthlete`
export default function HistoryTable({ dailyHistory, formatDateToIndo, openModal, isAthlete }) {
    const totalActiveDays = dailyHistory?.filter(i => i.data && i.data.recovery_status !== 'KOSONG').length || 0;

    return (
        <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                            <th className="px-4 py-4 text-center">BB</th>
                            <th className="px-4 py-4 text-center">VJ</th>
                            <th className="px-4 py-4 text-center text-[#00488b]">VO2Max</th>
                            <th className="px-4 py-4 text-center text-[#00488b]">Peak Power</th>
                            <th className="px-4 py-4 text-center">Recovery</th>
                            {/* SEMBUNYIKAN HEADER AKSI JIKA ATLET */}
                            {!isAthlete && <th className="px-4 py-4 text-right">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {dailyHistory && dailyHistory.length > 0 ? dailyHistory.map((item, index) => (
                            <tr key={index} className={`hover:bg-slate-50 transition-colors ${item.is_today ? 'bg-blue-50/40' : ''}`}>
                                <td className="px-4 py-3">
                                    <div className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                                        {formatDateToIndo(item.record_date, 'short')}
                                        {item.is_today && <span className="text-[9px] bg-[#00488b] text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">Hari Ini</span>}
                                    </div>
                                    <div className="text-[11px] text-[#00488b] font-bold mt-0.5">{item.week_label}</div>
                                </td>
                                <td className="px-4 py-3 text-center font-bold text-slate-700 text-sm">{item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : item.data?.rhr}</td>
                                <td className="px-4 py-3 text-center font-bold text-slate-700 text-sm">{item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : `${item.data?.spo2}%`}</td>
                                <td className="px-4 py-3 text-center font-bold text-slate-700 text-sm">{item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : `${item.data?.weight} kg`}</td>
                                <td className="px-4 py-3 text-center font-bold text-slate-700 text-sm">{item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : item.data?.vj}</td>
                                <td className="px-4 py-3 text-center font-bold text-slate-800 text-sm bg-slate-50/50">{item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : Number(item.data?.vo2_max).toLocaleString('id-ID', { minimumFractionDigits: 2 })}</td>
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
                                
                                {/* SEMBUNYIKAN TOMBOL EDIT JIKA ATLET */}
                                {!isAthlete && (
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => openModal(item)} className={`flex items-center gap-1.5 ml-auto text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all ${
                                            item.data?.recovery_status === 'KOSONG' ? 'bg-[#00488b] text-white hover:bg-[#003666]' : 'bg-white border border-slate-200 text-slate-500 hover:text-[#00488b] hover:bg-blue-50'
                                        }`}>
                                            {item.data?.recovery_status === 'KOSONG' ? <><Plus className="w-3.5 h-3.5" /> Isi Data</> : <><Edit3 className="w-3.5 h-3.5" /> Edit</>}
                                        </button>
                                    </td>
                                )}
                            </tr>
                        )) : (
                            <tr><td colSpan={isAthlete ? "8" : "9"} className="text-center py-16 text-slate-500">Belum ada data monitoring.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}