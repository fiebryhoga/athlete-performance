import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ActivitySquare } from 'lucide-react';

import HeaderProfile from './Partials/HeaderProfile';
import WeeklyGroup from './Partials/WeeklyGroup';
import TrainingModal from './Partials/TrainingModal';

export default function Show({ athlete, trainingHistory }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
    const [selectedDate, setSelectedDate] = useState(todayStr); 
    const [searchDate, setSearchDate] = useState(''); 

    const activeData = trainingHistory || [];
    
    const physicalPrepTypes = ['Power', 'Strength/Power', 'Strength UB', 'Strength LB', 'Strength Full Body', 'Speed/Agility', 'Injury Prevention', 'General Strength', 'Other activity', 'Recovery', 'Conditioning'];
    const skillTypes = ['Tactical', 'Technical', 'Skills'];
    const matchTypes = ['Match', 'Competition'];
    const travelTypes = ['Travel'];
    
    const sessionTypes = [...physicalPrepTypes, ...skillTypes, ...matchTypes, ...travelTypes];
    const rpeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const formLoad = useForm({
        user_id: athlete?.id, 
        record_date: todayStr,
        sleep_quality: '', fatigue: '', muscle_soreness: '', stress: '', motivation: '', health: '', mood: '', study_attitude: '',
        am_session_type: '', am_rpe: '', am_duration: '', pm_session_type: '', pm_rpe: '', pm_duration: '', notes: ''
    });

    const openModal = (dateToEdit = selectedDate) => {
        const existingData = activeData.find(item => item.record_date === dateToEdit);
        
        if (existingData) {
            formLoad.setData({
                user_id: athlete?.id, 
                record_date: dateToEdit,
                ...existingData,
                notes: existingData.notes || ''
            });
        } else {
            formLoad.setData({
                user_id: athlete?.id, 
                record_date: dateToEdit,
                sleep_quality: '', fatigue: '', muscle_soreness: '', stress: '', motivation: '', health: '', mood: '', study_attitude: '',
                am_session_type: '', am_rpe: '', am_duration: '', pm_session_type: '', pm_rpe: '', pm_duration: '', notes: ''
            });
        }
        setSelectedDate(dateToEdit);
        setIsModalOpen(true);
    };

    const submitLoad = (e) => {
        e.preventDefault();
        formLoad.post(route('admin.training-loads.store'), {
            onSuccess: () => { setIsModalOpen(false); formLoad.reset(); },
            preserveScroll: true
        });
    };

    const formatDateToIndo = (dateObj, formatType = 'full') => {
        if (!dateObj) return '-';
        const options = formatType === 'full' 
            ? { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }
            : { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' };
        return new Date(dateObj).toLocaleDateString('id-ID', options);
    };

    
    const generateWeeklyData = () => {
        if (!activeData || activeData.length === 0) return [];

        const sortedData = [...activeData].sort((a,b) => new Date(a.record_date) - new Date(b.record_date));
        const firstDate = new Date(sortedData[0].record_date);
        
        const startDay = firstDate.getDay();
        const startDiff = firstDate.getDate() - startDay + (startDay === 0 ? -6 : 1);
        let currentMonday = new Date(firstDate.setDate(startDiff));
        currentMonday.setHours(0,0,0,0);

        const endLimit = new Date();
        endLimit.setHours(23,59,59,999);

        let weeksArray = [];

        while (currentMonday <= endLimit) {
            const weekDays = [];
            const dailyLoadsForMath = [];
            const frequency = {};
            sessionTypes.forEach(t => frequency[t] = 0);
            
            let totals = { all: 0, physical: 0, skill: 0, matches: 0, travel: 0 };
            
            // Variabel penjumlah
            let weeklyWellnessScore = 0;

            for(let i=0; i<7; i++) {
                const d = new Date(currentMonday);
                d.setDate(d.getDate() + i);
                
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                const dateStr = `${yyyy}-${mm}-${dd}`;
                
                const existingRecord = sortedData.find(item => item.record_date === dateStr);
                
                // MENGUBAH STRING MENJADI ANGKA (SOLUSI BUG HOSTING)
                const load = existingRecord ? Number(existingRecord.daily_load || 0) : 0;
                const wellness = existingRecord ? Number(existingRecord.wellness_score || 0) : 0;
                
                weekDays.push({
                    dateStr, dateObj: d, dayName: d.toLocaleDateString('id-ID', { weekday: 'long' }),
                    data: existingRecord || null, load, wellness
                });
                
                dailyLoadsForMath.push(load);
                weeklyWellnessScore += wellness;

                if (existingRecord) {
                    [existingRecord.am_session_type, existingRecord.pm_session_type].forEach(t => {
                        if (t && frequency[t] !== undefined) {
                            frequency[t]++;
                            totals.all++;
                            if (physicalPrepTypes.includes(t)) totals.physical++;
                            else if (skillTypes.includes(t)) totals.skill++;
                            else if (matchTypes.includes(t)) totals.matches++;
                            else if (travelTypes.includes(t)) totals.travel++;
                        }
                    });
                }
            }

            // PERHITUNGAN MATEMATIKA YANG SUDAH AMAN (DARI ANGKA)
            const weeklyLoad = dailyLoadsForMath.reduce((acc, val) => acc + val, 0);
            const meanLoad = weeklyLoad / 7;
            const variance = dailyLoadsForMath.reduce((acc, val) => acc + Math.pow(val - meanLoad, 2), 0) / 6;
            const stdDev = Math.sqrt(variance);
            const monotony = stdDev > 0 ? (meanLoad / stdDev) : (meanLoad > 0 ? meanLoad : 0);
            const strain = weeklyLoad * monotony;

            weeksArray.push({
                startObj: new Date(currentMonday),
                endObj: new Date(weekDays[6].dateObj),
                label: `${formatDateToIndo(currentMonday, 'short')} - ${formatDateToIndo(weekDays[6].dateObj, 'short')}`,
                days: weekDays,
                metrics: {
                    weeklyLoad, weeklyWellnessScore,
                    meanLoad: parseFloat(meanLoad.toFixed(1)),
                    stdDev: parseFloat(stdDev.toFixed(1)),
                    monotony: parseFloat(monotony.toFixed(2)),
                    strain: parseFloat(strain.toFixed(1)),
                    frequency,
                    totals: { ...totals, training: totals.physical + totals.skill }
                }
            });

            currentMonday.setDate(currentMonday.getDate() + 7);
        }

        // Kalkulasi ACWR (Aman karena tipe datanya sudah pasti Number)
        weeksArray.forEach((week, index) => {
            if (index === 0) {
                week.metrics.acwr = 0; 
            } else {
                let sumPrevLoad = 0;
                let countPrevWeeks = 0;
                
                for (let j = index - 1; j >= Math.max(0, index - 4); j--) {
                    sumPrevLoad += weeksArray[j].metrics.weeklyLoad;
                    countPrevWeeks++;
                }
                
                let chronicLoad = sumPrevLoad / (countPrevWeeks === 4 ? 4 : countPrevWeeks); 
                week.metrics.acwr = chronicLoad > 0 ? parseFloat((week.metrics.weeklyLoad / chronicLoad).toFixed(2)) : 0;
            }
        });

        return weeksArray.reverse();
    };

    const groupedWeeks = generateWeeklyData();

    // Filter pencarian tanggal
    const displayedWeeks = searchDate 
        ? groupedWeeks.filter(week => {
            const sDate = new Date(searchDate);
            sDate.setHours(12,0,0,0);
            const wStart = new Date(week.startObj); wStart.setHours(0,0,0,0);
            const wEnd = new Date(week.endObj); wEnd.setHours(23,59,59,999);
            return sDate >= wStart && sDate <= wEnd;
        })
        : groupedWeeks;

    return (
        <AdminLayout title={`Wellness & Load - ${athlete?.name}`}>
            <Head title={`Wellness & Load - ${athlete?.name}`} />

            <div className="flex flex-col gap-6 md:gap-8 mb-8 md:mb-12 max-w-7xl mx-auto">
                <HeaderProfile 
                    athlete={athlete} 
                    selectedDate={selectedDate} 
                    setSelectedDate={setSelectedDate} 
                    openModal={openModal}
                    searchDate={searchDate}
                    setSearchDate={setSearchDate}
                />

                {displayedWeeks.length === 0 ? (
                    <div className="bg-white p-8 md:p-16 rounded-lg border border-slate-200 text-center shadow-sm">
                        <div className="p-4 bg-orange-50 rounded-full inline-block mb-4">
                            <ActivitySquare className="w-12 h-12 text-[#ff4d00]/50" />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-800 uppercase tracking-widest">
                            {searchDate ? 'Data Minggu Tidak Ditemukan' : 'Belum Ada Data Load'}
                        </h3>
                        <p className="text-sm md:text-base text-slate-500 mt-2 max-w-md mx-auto font-medium">
                            {searchDate ? `Tidak ada aktivitas yang tercatat pada minggu yang mengandung tanggal ${formatDateToIndo(searchDate, 'short')}.` : 'Silakan input data Wellness & RPE pertama Anda.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6 md:space-y-10">
                        {displayedWeeks.map((week, index) => (
                            <WeeklyGroup 
                                key={index} 
                                week={week} 
                                formatDateToIndo={formatDateToIndo} 
                                openModal={openModal} 
                                sessionTypes={sessionTypes}
                                physicalPrepTypes={physicalPrepTypes}
                                skillTypes={skillTypes}
                                matchTypes={matchTypes}
                                travelTypes={travelTypes}
                            />
                        ))}
                    </div>
                )}
            </div>

            <TrainingModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                formLoad={formLoad} 
                submitLoad={submitLoad} 
                activeData={activeData} 
                selectedDate={selectedDate} 
                formatDateToIndo={formatDateToIndo} 
                sessionTypes={sessionTypes} 
                rpeOptions={rpeOptions}
                athleteId={athlete?.id} 
            />
        </AdminLayout>
    );
}