import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Activity, Calendar, Save, Edit3, Plus, X, Zap, User } from 'lucide-react';
import { useState } from 'react';

export default function Show({ athlete, dailyHistory }) {
    const formStartDate = useForm({ training_start_date: athlete?.training_start_date || '' });

    const submitStartDate = (e) => {
        e.preventDefault();
        formStartDate.post(route('admin.daily-metrics.set-start-date', athlete?.id));
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDateLabel, setSelectedDateLabel] = useState('');
    
    const formMetric = useForm({
        user_id: athlete?.id,
        record_date: '',
        rhr: '',
        spo2: '',
        weight: '',
        vj: ''
    });

    const openModal = (historyItem) => {
        setSelectedDateLabel(historyItem.week_label);
        formMetric.setData({
            user_id: athlete?.id,
            record_date: historyItem.record_date,
            rhr: historyItem.data && historyItem.data.rhr > 0 ? historyItem.data.rhr : '',
            spo2: historyItem.data && historyItem.data.spo2 > 0 ? historyItem.data.spo2 : '',
            weight: historyItem.data && historyItem.data.weight > 0 ? historyItem.data.weight : (athlete?.weight || ''),
            vj: historyItem.data && historyItem.data.vj > 0 ? historyItem.data.vj : ''
        });
        setIsModalOpen(true);
    };

    const submitMetric = (e) => {
        e.preventDefault();
        formMetric.post(route('admin.daily-metrics.store'), {
            onSuccess: () => setIsModalOpen(false),
            preserveScroll: true
        });
    };

    // Fungsi helper untuk memformat tanggal ke format Indonesia
    const formatDateToIndo = (dateString, formatType = 'full') => {
        const options = formatType === 'full' 
            ? { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }
            : { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' };
            
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <AdminLayout title={`Monitoring - ${athlete?.name || 'Athlete'}`}>
            <Head title={`Monitoring - ${athlete?.name || 'Athlete'}`} />

            <div className="flex flex-col gap-6 mb-8 max-w-7xl mx-auto">
                
                {/* ========================================== */}
                {/* BAGIAN ATAS: PROFIL & SETTING              */}
                {/* ========================================== */}
                <div className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    
                    {/* Profil Atlet */}
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#00488b] to-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-900/20">
                            {athlete?.name?.charAt(0) || <User className="w-8 h-8"/>}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{athlete?.name || 'Loading...'}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                                    {athlete?.sport?.name || 'Tanpa Cabor'}
                                </span>
                                {athlete?.weight && (
                                    <span className="text-sm font-medium text-slate-500">BB Profil: {athlete.weight} kg</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form Set Tanggal */}
                    <form onSubmit={submitStartDate} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 md:w-96 flex-shrink-0">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#00488b]" /> Start Date Latihan
                        </label>
                        <div className="flex gap-2">
                            <input 
                                type="date" 
                                value={formStartDate.data.training_start_date}
                                onChange={e => formStartDate.setData('training_start_date', e.target.value)}
                                className="flex-1 text-sm rounded-xl border-slate-200 focus:ring-[#00488b] transition-all bg-white"
                                required
                            />
                            <button 
                                disabled={formStartDate.processing} 
                                type="submit" 
                                className="bg-[#00488b] text-white px-5 rounded-xl text-sm font-bold shadow-md hover:bg-[#003666] transition-all disabled:opacity-70 whitespace-nowrap"
                            >
                                {formStartDate.processing ? 'Saving...' : 'Set Date'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ========================================== */}
                {/* BAGIAN BAWAH: TABEL KALENDER DINAMIS       */}
                {/* ========================================== */}
                <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                            <Activity className="w-5 h-5 text-[#00488b]"/> History Metrik Harian
                        </h3>
                        {dailyHistory?.length > 0 && (
                            <p className="text-sm text-slate-500 font-medium">
                                Total Data: {dailyHistory.filter(h => h.data?.recovery_status !== 'KOSONG').length} Hari Aktif
                            </p>
                        )}
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
                                    <th className="px-4 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {dailyHistory && dailyHistory.length > 0 ? dailyHistory.map((item, index) => (
                                    <tr key={index} className={`hover:bg-slate-50 transition-colors ${item.is_today ? 'bg-blue-50/40' : ''}`}>
                                        
                                        {/* KOLOM WAKTU */}
                                        <td className="px-4 py-3">
                                            <div className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                                                {formatDateToIndo(item.record_date, 'short')}
                                                {item.is_today && <span className="text-[9px] bg-[#00488b] text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">Hari Ini</span>}
                                            </div>
                                            <div className="text-[11px] text-[#00488b] font-bold mt-0.5">{item.week_label}</div>
                                        </td>
                                        
                                        {/* KOLOM RHR */}
                                        <td className="px-4 py-3 text-center font-bold text-slate-700 text-sm">
                                            {item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : item.data?.rhr}
                                        </td>
                                        
                                        {/* KOLOM SpO2 */}
                                        <td className="px-4 py-3 text-center font-bold text-slate-700 text-sm">
                                            {item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : `${item.data?.spo2}%`}
                                        </td>
                                        
                                        {/* KOLOM BB */}
                                        <td className="px-4 py-3 text-center font-bold text-slate-700 text-sm">
                                            {item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : `${item.data?.weight} kg`}
                                        </td>
                                        
                                        {/* KOLOM VJ */}
                                        <td className="px-4 py-3 text-center font-bold text-slate-700 text-sm">
                                            {item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : item.data?.vj}
                                        </td>
                                        
                                        {/* KOLOM VO2MAX */}
                                        <td className="px-4 py-3 text-center font-bold text-slate-800 text-sm bg-slate-50/50">
                                            {item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : Number(item.data?.vo2_max).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                                        </td>
                                        
                                        {/* KOLOM PEAK POWER */}
                                        <td className="px-4 py-3 text-center font-bold text-slate-800 text-sm bg-slate-50/50">
                                            {item.data?.recovery_status === 'KOSONG' ? <span className="text-slate-300">-</span> : (
                                                <span className="flex items-center justify-center gap-1">
                                                    {Number(item.data?.peak_power).toLocaleString('id-ID', { minimumFractionDigits: 0 })} <Zap className="w-3.5 h-3.5 text-amber-500"/>
                                                </span>
                                            )}
                                        </td>
                                        
                                        {/* KOLOM STATUS RECOVERY */}
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider rounded-xl border shadow-sm ${
                                                item.data?.recovery_status === 'RECOVERY BAIK' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                item.data?.recovery_status === 'RECOVERY CUKUP' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                                item.data?.recovery_status === 'RECOVERY KURANG' ? 'bg-red-50 text-red-700 border-red-200' : 
                                                'bg-slate-100 text-slate-400 border-slate-200 shadow-none'
                                            }`}>
                                                {item.data?.recovery_status === 'KOSONG' 
                                                    ? 'LIBUR / KOSONG' 
                                                    : <>{item.data?.quick_recovery_score}% <span className="w-1 h-1 rounded-full bg-current opacity-50"></span> {item.data?.recovery_status}</>
                                                }
                                            </span>
                                        </td>
                                        
                                        {/* KOLOM AKSI */}
                                        <td className="px-4 py-3 text-right">
                                            <button 
                                                onClick={() => openModal(item)} 
                                                className={`flex items-center gap-1.5 ml-auto text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all ${
                                                    item.data?.recovery_status === 'KOSONG' 
                                                    ? 'bg-[#00488b] text-white hover:bg-[#003666] hover:shadow-md hover:-translate-y-0.5' 
                                                    : 'bg-white border border-slate-200 text-slate-500 hover:text-[#00488b] hover:border-blue-200 hover:bg-blue-50'
                                                }`}
                                            >
                                                {item.data?.recovery_status === 'KOSONG' ? (
                                                    <><Plus className="w-3.5 h-3.5" /> Isi Data</>
                                                ) : (
                                                    <><Edit3 className="w-3.5 h-3.5" /> Edit</>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="9" className="text-center py-16">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                    <Calendar className="w-8 h-8 text-slate-300" />
                                                </div>
                                                <p className="text-base font-bold text-slate-600">Belum ada data monitoring.</p>
                                                <p className="text-sm mt-1">Silakan set <b>Start Date Latihan</b> di atas terlebih dahulu.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ========================================== */}
            {/* MODAL FORM (UPSERT DATA)                   */}
            {/* ========================================== */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Input Data Harian</h3>
                                <p className="text-xs text-[#00488b] font-bold mt-0.5">
                                    {selectedDateLabel} • {formatDateToIndo(formMetric.data.record_date, 'full')}
                                </p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={submitMetric} className="p-6">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">RHR <span className="text-red-500">*</span></label>
                                    <input 
                                        type="number" step="0.1" required 
                                        value={formMetric.data.rhr} 
                                        onChange={e => formMetric.setData('rhr', e.target.value)} 
                                        className="w-full text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-[#00488b] transition-all" 
                                        placeholder="Contoh: 65"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SpO2 (%) <span className="text-red-500">*</span></label>
                                    <input 
                                        type="number" step="0.1" required 
                                        value={formMetric.data.spo2} 
                                        onChange={e => formMetric.setData('spo2', e.target.value)} 
                                        className="w-full text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-[#00488b] transition-all" 
                                        placeholder="Contoh: 98"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weight / BB (Kg) <span className="text-red-500">*</span></label>
                                    <input 
                                        type="number" step="0.1" required 
                                        value={formMetric.data.weight} 
                                        onChange={e => formMetric.setData('weight', e.target.value)} 
                                        className="w-full text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-[#00488b] transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vertical Jump (VJ) <span className="text-red-500">*</span></label>
                                    <input 
                                        type="number" step="0.01" required 
                                        value={formMetric.data.vj} 
                                        onChange={e => formMetric.setData('vj', e.target.value)} 
                                        className="w-full text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-[#00488b] transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100 mt-6">
                                <p className="text-xs text-[#00488b] font-medium leading-relaxed">
                                    <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                                        <Zap className="w-3.5 h-3.5 fill-current"/> Auto-Calculate Active
                                    </span>
                                    Sistem akan otomatis menghitung <b>VO2Max</b>, <b>Peak Power</b>, dan mensimulasikan poin diferensial untuk <b>Status Recovery</b>.
                                </p>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="flex-1 py-3.5 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={formMetric.processing} 
                                    className="flex-[2] py-3.5 bg-[#00488b] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#003666] hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                                >
                                    {formMetric.processing ? (
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    {formMetric.processing ? 'Menyimpan...' : 'Simpan Data Mentah'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}