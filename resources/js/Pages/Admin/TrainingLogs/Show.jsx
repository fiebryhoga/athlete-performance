import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Save, CalendarDays } from 'lucide-react';
import { useState, useEffect } from 'react';


import LogHeader from './Partials/LogHeader';
import ExcelTable from './Partials/ExcelTable';
import HistorySection from './Partials/HistorySection';

export default function Show({ session, exercisesList, nextSession, historySessions, is_athlete }) {
    const [libExercises, setLibExercises] = useState(exercisesList || []);
    const { data, setData, put, processing } = useForm({ exercises: session.exercises });

    useEffect(() => setLibExercises(exercisesList || []), [exercisesList]);

    const handleExChange = (index, field, value) => {
        const newEx = [...data.exercises]; 
        newEx[index][field] = value; 
        setData('exercises', newEx);
    };

    const addNewRow = () => {
        const newRow = {
            id: null,
            exercise_name: '', notes: '',
            set_1_load: '', set_1_reps: '',
            set_2_load: '', set_2_reps: '',
            set_3_load: '', set_3_reps: '',
            set_4_load: '', set_4_reps: ''
        };
        setData('exercises', [...data.exercises, newRow]);
    };

    const removeRow = (index) => {
        const newExercises = [...data.exercises];
        newExercises.splice(index, 1);
        setData('exercises', newExercises);
    };

    const handleAddNewExercise = (newExerciseName) => {
        if (libExercises.find(e => e.toLowerCase() === newExerciseName.toLowerCase())) return;
        setLibExercises([...libExercises, newExerciseName].sort());
        axios.post(route('admin.training-logs.exercises.store'), { name: newExerciseName }).catch(e => console.error(e));
    };

    const handleDeleteExercise = (exerciseName) => {
        setLibExercises(prev => prev.filter(item => item !== exerciseName));
        axios.delete(route('admin.training-logs.exercises.destroy'), {
            data: { name: exerciseName }
        }).catch(err => console.error("Gagal menghapus exercise", err));
    };

    const submit = (e) => { 
        e.preventDefault(); 
        put(route('admin.training-logs.update', session.id)); 
    };

    return (
        <AdminLayout title={`Training Log - ${session.training_type}`}>
            <Head title={`Log Latihan - ${session.user.name}`} />
            
            
            <div className="mx-auto pb-28 md:pb-12 w-full max-w-full">
                
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-4 w-full md:mt-0">
                    <Link href={route('admin.training-logs.index')} className="text-slate-500 hover:text-[#ff4d00] flex items-center gap-2 font-bold text-xs md:text-sm transition-colors py-2 touch-manipulation">
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5"/> Kembali ke Jadwal
                    </Link>
                    
                    
                    {!is_athlete && (
                        <button onClick={submit} disabled={processing} className="hidden md:flex bg-[#ff4d00] text-white px-8 py-3 rounded-xl font-bold text-sm justify-center items-center gap-2 shadow-lg shadow-[#ff4d00]/20 hover:bg-[#e64500] hover:scale-[1.02] transition-all">
                            {processing ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-5 h-5"/>}
                            Simpan Log Latihan
                        </button>
                    )}
                </div>

                
                {nextSession && (
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 p-4 md:p-5 rounded-xl md:rounded-2xl mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 shadow-sm w-full max-w-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <div className="bg-white p-2.5 rounded-xl shadow-sm text-[#ff4d00] shrink-0 relative z-10">
                            <CalendarDays className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="min-w-0 flex-1 w-full relative z-10">
                            <p className="text-[10px] font-bold text-[#ff4d00] uppercase tracking-widest mb-1">Jadwal Berikutnya</p>
                            <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed break-words">
                                <span className="font-bold text-[#e64500]">{nextSession.training_type}</span> pada <span className="font-bold text-[#e64500] underline decoration-orange-200 underline-offset-2">{new Date(nextSession.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>.
                            </p>
                        </div>
                    </div>
                )}

                
                <LogHeader session={session} />

                
                <div className="mb-8 md:mb-12 z-20 relative w-full max-w-full">
                    <ExcelTable 
                        data={data} 
                        is_athlete={is_athlete} 
                        handleExChange={handleExChange} 
                        libExercises={libExercises} 
                        handleAddNewExercise={handleAddNewExercise} 
                        addNewRow={addNewRow}
                        removeRow={removeRow}
                        onDeleteExercise={handleDeleteExercise}
                    />
                </div>

                
                <HistorySection 
                    historySessions={historySessions} 
                    userName={session.user.name} 
                />

            </div>

            
            
            {!is_athlete && (
                <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] z-[80] animate-in slide-in-from-bottom-full duration-300">
                    <button 
                        onClick={submit} 
                        disabled={processing} 
                        className="w-full bg-[#ff4d00] text-white px-6 py-3.5 rounded-xl font-bold text-sm flex justify-center items-center gap-2 shadow-lg shadow-[#ff4d00]/30 active:scale-[0.98] transition-all touch-manipulation disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {processing ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-5 h-5"/>}
                        Simpan Semua Perubahan
                    </button>
                </div>
            )}
        </AdminLayout>
    );
}