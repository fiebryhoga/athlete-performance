import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Calendar, User, BarChart3, AlertTriangle, Check, X, CalendarDays, Activity } from 'lucide-react';
import { useState } from 'react';


import HistoryTable from './Partials/HistoryTable';
import AnalyticsDashboard from './Partials/AnalyticsDashboard';
import DailyMetricModal from './Partials/DailyMetricModal';

export default function Show({ athlete, dailyHistory }) {
    
    const { auth } = usePage().props;
    const isAthlete = auth.user.role === 'athlete';

    
    const [isConfirmDateOpen, setIsConfirmDateOpen] = useState(false);
    const formStartDate = useForm({ training_start_date: athlete?.training_start_date || '' });

    const handleOpenConfirmDate = (e) => {
        e.preventDefault();
        setIsConfirmDateOpen(true); 
    };

    const submitStartDate = () => {
        formStartDate.post(route('admin.daily-metrics.set-start-date', athlete?.id), {
            onSuccess: () => setIsConfirmDateOpen(false),
            preserveScroll: true
        });
    };

    
    const [activeTab, setActiveTab] = useState('analytics');

    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDateLabel, setSelectedDateLabel] = useState('');
    

    const formMetric = useForm({
        user_id: athlete?.id, record_date: '', rhr: '', spo2: '', weight: '', vj: '', notes: ''
    });

    const openModal = (historyItem) => {
        setSelectedDateLabel(historyItem.week_label);
        formMetric.setData({
            user_id: athlete?.id,
            record_date: historyItem.record_date,
            rhr: historyItem.data?.rhr > 0 ? historyItem.data.rhr : '',
            spo2: historyItem.data?.spo2 > 0 ? historyItem.data.spo2 : '',
            weight: historyItem.data?.weight > 0 ? historyItem.data.weight : (athlete?.weight || ''),
            vj: historyItem.data?.vj > 0 ? historyItem.data.vj : '',
            notes: historyItem.data?.notes || ''
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

    const formatDateToIndo = (dateString, formatType = 'full') => {
        if (!dateString) return '-';
        const options = formatType === 'full' 
            ? { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }
            : { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <AdminLayout title={`Monitoring - ${athlete?.name || 'Athlete'}`}>
            <Head title={`Monitoring - ${athlete?.name || 'Athlete'}`} />

            <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
                
                {/* Header Profile Section - Clean Minimalist */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-6">
                    <div className="flex items-center gap-4 md:gap-5">
                        {/* Avatar menggunakan warna Orange */}
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-orange-50 text-[#ff4d00] flex items-center justify-center font-bold text-xl md:text-2xl border-4 border-white shadow-sm shrink-0">
                            {athlete?.profile_photo_url ? (
                                <img src={athlete.profile_photo_url} alt={athlete.name} className="w-full h-full object-cover" />
                            ) : (
                                athlete?.name?.charAt(0).toUpperCase() || <User className="w-6 h-6 md:w-8 md:h-8"/>
                            )}
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">{athlete?.name || 'Loading...'}</h2>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1.5 md:mt-2">
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] md:text-xs font-medium border border-slate-200">
                                    {athlete?.sport?.name || 'Tanpa Cabor'}
                                </span>
                                {athlete?.weight && (
                                    <span className="text-[10px] md:text-xs font-medium text-slate-500 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                        BB: {athlete.weight} kg
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form Setup Tanggal (Hanya Admin) */}
                    {!isAthlete && (
                        <form onSubmit={handleOpenConfirmDate} className="flex flex-col sm:flex-row items-end sm:items-center gap-2 md:gap-3 shrink-0 mt-2 md:mt-0">
                            <div className="w-full sm:w-auto">
                                <label className="text-[10px] md:text-xs font-medium text-slate-500 mb-1 md:mb-1.5 flex items-center gap-1.5">
                                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" /> Start Program
                                </label>
                                {/* Input Ring Focus Orange */}
                                <input 
                                    type="date" 
                                    value={formStartDate.data.training_start_date} 
                                    onChange={e => formStartDate.setData('training_start_date', e.target.value)} 
                                    className="w-full text-xs md:text-sm font-medium text-slate-700 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/50 focus:border-[#ff4d00] transition-all bg-white px-3 py-2" 
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={formStartDate.processing || formStartDate.data.training_start_date === athlete?.training_start_date} 
                                className="w-full sm:w-auto mt-2 sm:mt-auto bg-slate-800 text-white px-5 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Simpan
                            </button>
                        </form>
                    )}
                </div>

                {/* Tabs Navigation - Responsive Padding & Font Size */}
                <div className="flex gap-1 md:gap-2 mb-6 border-b border-slate-200 pb-px overflow-x-auto custom-scrollbar">
                    <button 
                        onClick={() => setActiveTab('analytics')} 
                        className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2.5 md:py-3 text-[11px] md:text-sm font-medium transition-all relative whitespace-nowrap ${
                            activeTab === 'analytics' 
                                ? 'text-[#ff4d00]' 
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-lg'
                        }`}
                    >
                        <Activity className="w-3.5 h-3.5 md:w-4 md:h-4" /> 
                        Dashboard Analitik
                        {activeTab === 'analytics' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ff4d00] rounded-t-full"></span>
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')} 
                        className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2.5 md:py-3 text-[11px] md:text-sm font-medium transition-all relative whitespace-nowrap ${
                            activeTab === 'history' 
                                ? 'text-[#ff4d00]' 
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-lg'
                        }`}
                    >
                        <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" /> 
                        Kalender Input
                        {activeTab === 'history' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ff4d00] rounded-t-full"></span>
                        )}
                    </button>
                </div>

                {/* Content Area */}
                <div className="min-h-[500px]">
                    {activeTab === 'history' ? (
                        <HistoryTable 
                            dailyHistory={dailyHistory} 
                            formatDateToIndo={formatDateToIndo} 
                            openModal={openModal} 
                            isAthlete={isAthlete}
                        />
                    ) : (
                        <AnalyticsDashboard dailyHistory={dailyHistory} formatDateToIndo={formatDateToIndo} />
                    )}
                </div>
            </div>

            {/* Modal Form Metrik Harian */}
            <DailyMetricModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                form={formMetric}
                submit={submitMetric}
                selectedDateLabel={selectedDateLabel}
                formatDateToIndo={formatDateToIndo}
            />

            {/* Confirmation Modal */}
            {isConfirmDateOpen && !isAthlete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsConfirmDateOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-5 md:p-6">
                            <div className="flex items-start gap-3 md:gap-4">
                                <div className="p-2 md:p-3 bg-amber-50 text-amber-600 rounded-full shrink-0">
                                    <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <div>
                                    <h3 className="text-base md:text-lg font-semibold text-slate-800">Konfirmasi Perubahan Tanggal</h3>
                                    <p className="text-xs md:text-sm text-slate-600 mt-1.5 md:mt-2">
                                        Anda akan mengubah tanggal mulai latihan menjadi <span className="font-semibold text-slate-800">{formatDateToIndo(formStartDate.data.training_start_date, 'full')}</span>.
                                    </p>
                                    <div className="mt-3 md:mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <p className="text-[10px] md:text-xs text-slate-500 flex items-start gap-2">
                                            <span className="font-medium text-slate-700 shrink-0">Catatan:</span>
                                            Perubahan ini dapat memengaruhi pengelompokan minggu pada laporan analitik.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 md:gap-3 mt-5 md:mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setIsConfirmDateOpen(false)} 
                                    className="px-3 md:px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium text-xs md:text-sm rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Batal
                                </button>
                                {/* Tombol Simpan Modal Menggunakan Orange */}
                                <button 
                                    type="button" 
                                    onClick={submitStartDate} 
                                    disabled={formStartDate.processing} 
                                    className="px-3 md:px-4 py-2 bg-[#ff4d00] text-white font-medium text-xs md:text-sm rounded-lg shadow-sm hover:bg-[#e64500] transition-colors flex items-center gap-1.5 md:gap-2"
                                >
                                    {formStartDate.processing ? <span className="w-3.5 h-3.5 md:w-4 md:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Check className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                                    Simpan Perubahan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}