import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

import ProfileHeader from './Partials/ProfileHeader';
import AnalyticsDashboard from './Partials/AnalyticsDashboard';
import SmartInsights from './Partials/SmartInsights';
import HistoryTable from './Partials/HistoryTable';
import CompositionModal from './Partials/CompositionModal';

export default function Show({ athlete, history, benchmarks }) {
    // CEK ROLE USER YANG SEDANG LOGIN
    const { auth } = usePage().props;
    const is_athlete = auth.user.role === 'athlete';

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        user_id: athlete.id, 
        date: new Date().toISOString().split('T')[0], 
        age: athlete.age || '',
        metabolic_age: '', 
        weight: '', 
        height: (athlete.height / 100) || '', 
        body_fat_percentage: '',
        muscle_mass: '', 
        bone_mass: '', 
        visceral_fat: '', 
        bmr: '', 
        total_body_water: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.composition-tests.store'), {
            onSuccess: () => { setIsModalOpen(false); reset(); },
            preserveScroll: true
        });
    };

    return (
        <AdminLayout title={`Composition - ${athlete.name}`}>
            <Head title={`Tes Komposisi - ${athlete.name}`} />
            
            <div className="max-w-[1400px] mx-auto pb-12">
                
                {/* 1. HEADER PROFIL (Kirim status is_athlete) */}
                <ProfileHeader athlete={athlete} onOpenModal={() => setIsModalOpen(true)} is_athlete={is_athlete} />

                {/* 2. ANALISIS DATA & GRAFIK */}
                {history.length > 0 && (
                    <div className="mb-8 space-y-6">
                        <SmartInsights history={history} athlete={athlete} benchmarks={benchmarks} />
                        <AnalyticsDashboard history={history} athlete={athlete} benchmarks={benchmarks} />
                    </div>
                )}

                {/* 3. TABEL RIWAYAT (Kirim status is_athlete) */}
                <HistoryTable history={history} athlete={athlete} benchmarks={benchmarks} is_athlete={is_athlete} />

            </div>

            {/* 4. MODAL INPUT DATA (Jika admin maksa buka via inspect element, form tetap dicegah) */}
            {!is_athlete && (
                <CompositionModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    data={data} 
                    setData={setData} 
                    submit={submit} 
                    processing={processing} 
                    athlete={athlete} 
                />
            )}

        </AdminLayout>
    );
}