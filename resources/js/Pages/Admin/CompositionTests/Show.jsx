import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

import ProfileHeader from './Partials/ProfileHeader';
import AnalyticsDashboard from './Partials/AnalyticsDashboard';
import SmartInsights from './Partials/SmartInsights';
import HistoryTable from './Partials/HistoryTable';
import CompositionModal from './Partials/CompositionModal';

export default function Show({ athlete, history, benchmarks }) {
    
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
        <AdminLayout title={`Composition Analysis - ${athlete.name}`}>
            <Head title={`Analysis - ${athlete.name}`} />
            
            
            <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
                
                
                <ProfileHeader 
                    athlete={athlete} 
                    onOpenModal={() => setIsModalOpen(true)} 
                    is_athlete={is_athlete} 
                />

                
                {history.length > 0 ? (
                    <div className="mb-8 space-y-6 md:space-y-8">
                        
                        <SmartInsights 
                            history={history} 
                            athlete={athlete} 
                            benchmarks={benchmarks} 
                        />
                        
                        
                        <AnalyticsDashboard 
                            history={history} 
                            athlete={athlete} 
                            benchmarks={benchmarks} 
                        />
                    </div>
                ) : (
                    /* Tampilan jika data masih kosong */
                    <div className="bg-white rounded-lg border border-[#BFC9D1]/50 p-12 text-center mb-8 shadow-sm">
                        <div className="w-16 h-16 bg-[#EAEFEF] rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📊</span>
                        </div>
                        <h3 className="text-[#262626] font-black uppercase tracking-widest text-lg">Belum Ada Data Analisis</h3>
                        <p className="text-slate-500 text-sm font-medium mt-1">Silakan lakukan input data tes komposisi tubuh pertama untuk melihat statistik.</p>
                    </div>
                )}

                
                <HistoryTable 
                    history={history} 
                    athlete={athlete} 
                    benchmarks={benchmarks} 
                    is_athlete={is_athlete} 
                />

            </div>

            
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