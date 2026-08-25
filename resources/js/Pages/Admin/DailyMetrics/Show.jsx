import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { 
    Calendar, 
    User, 
    AlertTriangle, 
    Check, 
    ChevronLeft,
    CalendarDays, 
    Activity,
    Save
} from 'lucide-react';
import PageHeader from '@/Components/Common/PageHeader';
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
        user_id: athlete?.id, 
        record_date: '', 
        rhr: '', 
        spo2: '', 
        weight: '', 
        vj: '', 
        notes: ''
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
        <AppLayout title={`Pantauan Harian - ${athlete?.name || 'Athlete'}`}>
            <Head title={`Pantauan Harian - ${athlete?.name || 'Athlete'}`} />

            <div className="space-y-4 pb-16">
                {/* ─── 1. PAGE HEADER ─── */}
                <PageHeader 
                    title={`Pantauan Harian: ${athlete?.name || 'Loading...'}`}
                    description="Pantau performa harian, kesiapan fisik, dan riwayat status pemulihan atlet."
                    actions={
                        <Link
                            href={route("admin.daily-metrics.index")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                        >
                            <ChevronLeft size={14} />
                            <span>Daftar Atlet</span>
                        </Link>
                    }
                />

                {/* ─── 2. ATHLETE INFO & START DATE BANNER ─── */}
                <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-md overflow-hidden bg-orange-50 text-orange-600 flex items-center justify-center font-black text-base border border-orange-200/80 shadow-2xs shrink-0">
                            {athlete?.profile_photo_url ? (
                                <img src={athlete.profile_photo_url} alt={athlete.name} className="w-full h-full object-cover" />
                            ) : (
                                athlete?.name?.charAt(0).toUpperCase() || <User size={18} />
                            )}
                        </div>
                        <div>
                            <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                                {athlete?.name || 'Loading...'}
                            </h2>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10.5px] font-bold border border-slate-200">
                                    {athlete?.sport?.name || 'Tanpa Cabor'}
                                </span>
                                {athlete?.weight && (
                                    <span className="text-[11px] font-semibold text-slate-500">
                                        BB: {athlete.weight} kg
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Setup Tanggal Form (Admin Only) */}
                    {!isAthlete && (
                        <form onSubmit={handleOpenConfirmDate} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 shrink-0">
                            <div>
                                <label className="text-[10.5px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                                    <CalendarDays size={12} className="text-slate-400" /> Start Program
                                </label>
                                <input 
                                    type="date" 
                                    value={formStartDate.data.training_start_date} 
                                    onChange={e => formStartDate.setData('training_start_date', e.target.value)} 
                                    className="text-xs font-semibold text-slate-800 rounded-md border border-slate-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-slate-50 focus:bg-white px-2.5 py-1.5" 
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={formStartDate.processing || formStartDate.data.training_start_date === athlete?.training_start_date} 
                                className="inline-flex items-center justify-center gap-1 bg-orange-500 text-white px-3.5 py-1.5 rounded-md text-xs font-bold hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
                            >
                                <Save size={13} />
                                <span>Simpan</span>
                            </button>
                        </form>
                    )}
                </div>

                {/* ─── 3. TABS NAVIGATION ─── */}
                <div className="flex items-center gap-1.5 border-b border-slate-200/80 pb-2.5">
                    <button 
                        onClick={() => setActiveTab('analytics')} 
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'analytics' 
                                ? 'bg-orange-500 text-white shadow-2xs' 
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold'
                        }`}
                    >
                        <Activity size={13} /> 
                        <span>Dashboard Analitik</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')} 
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'history' 
                                ? 'bg-orange-500 text-white shadow-2xs' 
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold'
                        }`}
                    >
                        <Calendar size={13} /> 
                        <span>Kalender Input</span>
                    </button>
                </div>

                {/* ─── 4. TAB CONTENT ─── */}
                <div>
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
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsConfirmDateOpen(false)} />
                    <div className="relative bg-white w-full max-w-md rounded-md border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-150 p-4 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-md border border-amber-200 shrink-0">
                                <AlertTriangle size={18} />
                            </div>
                            <div>
                                <h3 className="text-xs sm:text-sm font-bold text-slate-900">Konfirmasi Perubahan Tanggal</h3>
                                <p className="text-xs text-slate-600 mt-1">
                                    Anda akan mengubah tanggal mulai latihan menjadi <strong className="text-slate-900">{formatDateToIndo(formStartDate.data.training_start_date, 'full')}</strong>.
                                </p>
                                <div className="mt-2.5 p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-500">
                                    Perubahan ini dapat memengaruhi pengelompokan minggu pada laporan analitik.
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                            <button 
                                type="button" 
                                onClick={() => setIsConfirmDateOpen(false)} 
                                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button 
                                type="button" 
                                onClick={submitStartDate} 
                                disabled={formStartDate.processing} 
                                className="px-3.5 py-1.5 bg-orange-500 text-white font-bold text-xs rounded-md shadow-2xs hover:bg-orange-600 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                                {formStartDate.processing ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={13} />}
                                <span>Simpan Perubahan</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}