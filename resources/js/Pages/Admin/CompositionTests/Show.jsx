import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

// PASTIKAN 5 BARIS IMPORT INI ADA
import ProfileHeader from './Partials/ProfileHeader';
import AnalyticsDashboard from './Partials/AnalyticsDashboard';
import SmartInsights from './Partials/SmartInsights';
import HistoryTable from './Partials/HistoryTable';
import CompositionModal from './Partials/CompositionModal';

export default function Show({ athlete, history, benchmarks }) {
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
            
            <div className="max-w-[1400px] mx-auto pb-12 px-4 md:px-6">
                
                {/* 1. HEADER PROFIL */}
                <ProfileHeader athlete={athlete} onOpenModal={() => setIsModalOpen(true)} />

                {/* 2. ANALISIS DATA & GRAFIK (Hanya muncul jika sudah ada histori) */}
                {history.length > 0 && (
                    <div className="mb-8 space-y-6">
                        {/* Saran / Insight Otomatis */}
                        <SmartInsights history={history} athlete={athlete} benchmarks={benchmarks} />
                        
                        {/* 4 Grafik Visualisasi Data */}
                        {/* 4 Grafik Visualisasi Data */}
                        <AnalyticsDashboard history={history} athlete={athlete} benchmarks={benchmarks} />
                    </div>
                )}

                {/* 3. TABEL RIWAYAT */}
                <HistoryTable history={history} athlete={athlete} benchmarks={benchmarks} />

            </div>

            {/* 4. MODAL INPUT DATA */}
            <CompositionModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                data={data} 
                setData={setData} 
                submit={submit} 
                processing={processing} 
                athlete={athlete} 
            />

        </AdminLayout>
    );
}