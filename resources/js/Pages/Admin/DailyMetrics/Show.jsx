import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Calendar, User, BarChart3, AlertTriangle, Check, X, CalendarDays, Activity } from 'lucide-react';
import { useState } from 'react';

// Import Komponen Partials
import HistoryTable from './Partials/HistoryTable';
import AnalyticsDashboard from './Partials/AnalyticsDashboard';
import DailyMetricModal from './Partials/DailyMetricModal';

export default function Show({ athlete, dailyHistory }) {
    // DETEKSI ROLE USER SAAT INI
    const { auth } = usePage().props;
    const isAthlete = auth.user.role === 'athlete';

    // 1. Setup Start Date Form & Confirmation Modal
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

    // 2. Setup Navigasi Tab
    const [activeTab, setActiveTab] = useState('analytics');

    // 3. Setup Modal Form Input Metrik
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
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-2xl border-4 border-white shadow-sm shrink-0">
                            {athlete?.profile_photo_url ? (
                                <img src={athlete.profile_photo_url} alt={athlete.name} className="w-full h-full object-cover" />
                            ) : (
                                athlete?.name?.charAt(0).toUpperCase() || <User className="w-8 h-8"/>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight">{athlete?.name || 'Loading...'}</h2>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
                                    {athlete?.sport?.name || 'Tanpa Cabor'}
                                </span>
                                {athlete?.weight && (
                                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                        BB: {athlete.weight} kg
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form Setup Tanggal (Hanya Admin) */}
                    {!isAthlete && (
                        <form onSubmit={handleOpenConfirmDate} className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
                            <div className="w-full sm:w-auto">
                                <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1.5">
                                    <CalendarDays className="w-4 h-4 text-slate-400" /> Start Program
                                </label>
                                <input 
                                    type="date" 
                                    value={formStartDate.data.training_start_date} 
                                    onChange={e => formStartDate.setData('training_start_date', e.target.value)} 
                                    className="w-full text-sm font-medium text-slate-700 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white px-3 py-2" 
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={formStartDate.processing || formStartDate.data.training_start_date === athlete?.training_start_date} 
                                className="w-full sm:w-auto mt-auto bg-slate-800 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Simpan
                            </button>
                        </form>
                    )}
                </div>

                {/* Tabs Navigation - Clean Ghost Tabs */}
                <div className="flex gap-2 mb-6 border-b border-slate-200 pb-px">
                    <button 
                        onClick={() => setActiveTab('analytics')} 
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative ${
                            activeTab === 'analytics' 
                                ? 'text-blue-600' 
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-lg'
                        }`}
                    >
                        <Activity className="w-4 h-4" /> 
                        Dashboard Analitik
                        {activeTab === 'analytics' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')} 
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative ${
                            activeTab === 'history' 
                                ? 'text-blue-600' 
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-lg'
                        }`}
                    >
                        <Calendar className="w-4 h-4" /> 
                        Kalender Input
                        {activeTab === 'history' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
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
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-full shrink-0">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800">Konfirmasi Perubahan Tanggal</h3>
                                    <p className="text-sm text-slate-600 mt-2">
                                        Anda akan mengubah tanggal mulai latihan menjadi <span className="font-semibold text-slate-800">{formatDateToIndo(formStartDate.data.training_start_date, 'full')}</span>.
                                    </p>
                                    <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <p className="text-xs text-slate-500 flex items-start gap-2">
                                            <span className="font-medium text-slate-700 shrink-0">Catatan:</span>
                                            Perubahan ini dapat memengaruhi pengelompokan minggu pada laporan analitik.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setIsConfirmDateOpen(false)} 
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="button" 
                                    onClick={submitStartDate} 
                                    disabled={formStartDate.processing} 
                                    className="px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    {formStartDate.processing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Check className="w-4 h-4" />}
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