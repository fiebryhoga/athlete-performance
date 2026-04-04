import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Save, CalendarDays } from 'lucide-react';
import { useState, useEffect } from 'react';

// === IMPORT PARTIALS ===
import LogHeader from './Partials/LogHeader';
import ExcelTable from './Partials/ExcelTable';
import HistorySection from './Partials/HistorySection'; // <-- 1. IMPORT DI SINI

export default function Show({ session, exercisesList, nextSession, historySessions, is_athlete }) {
    const [libExercises, setLibExercises] = useState(exercisesList || []);
    const { data, setData, put, processing } = useForm({ exercises: session.exercises });

    useEffect(() => setLibExercises(exercisesList || []), [exercisesList]);

    const handleExChange = (index, field, value) => {
        const newEx = [...data.exercises]; 
        newEx[index][field] = value; 
        setData('exercises', newEx);
    };

    // TAMBAHAN: Fungsi untuk menambah baris baru di frontend
    const addNewRow = () => {
        const newRow = {
            id: null, // ID null menandakan ini data baru (belum ada di DB)
            exercise_name: '', notes: '',
            set_1_load: '', set_1_reps: '',
            set_2_load: '', set_2_reps: '',
            set_3_load: '', set_3_reps: '',
            set_4_load: '', set_4_reps: ''
        };
        setData('exercises', [...data.exercises, newRow]);
    };

    // TAMBAHAN: Fungsi untuk menghapus baris dari layar frontend
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
        // 1. Update state lokal agar langsung hilang dari dropdown
        setLibExercises(prev => prev.filter(item => item !== exerciseName));
    
        // 2. Kirim ke database via Axios
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
            
            <div className="max-w-[1400px] mx-auto">
                
                {/* TOMBOL NAVIGASI & SIMPAN */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <Link href={route('admin.training-logs.index')} className="text-slate-500 hover:text-[#00488b] flex items-center gap-2 font-normal text-sm">
                        <ArrowLeft className="w-4 h-4"/> Kembali ke Jadwal
                    </Link>
                    {!is_athlete && (
                        <button onClick={submit} disabled={processing} className="w-full sm:w-auto bg-[#00488b] text-white px-8 py-3 rounded-md font-medium text-sm flex justify-center items-center gap-2 shadow-lg shadow-blue-900/20 hover:bg-[#003666] hover:scale-[1.02] transition-all">
                            {processing ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-5 h-5"/>}
                            Simpan Log Latihan
                        </button>
                    )}
                </div>

                {/* BANNER JADWAL SELANJUTNYA */}
                {nextSession && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-2xl mb-6 flex items-center gap-4 shadow-sm">
                        <div className="bg-white p-2.5 rounded-xl shadow-sm text-blue-500 shrink-0"><CalendarDays className="w-6 h-6" /></div>
                        <div>
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-0.5">Informasi Jadwal Berikutnya</p>
                            <p className="text-sm text-slate-700 font-medium">Latihan selanjutnya adalah <span className="font-black text-[#00488b]">{nextSession.training_type}</span> pada <span className="font-bold text-[#00488b] underline decoration-blue-200 underline-offset-2">{new Date(nextSession.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>.</p>
                        </div>
                    </div>
                )}

                {/* HEADER INFO (Menggunakan Komponen) */}
                <LogHeader session={session} />

                {/* TABEL EXCEL UTAMA (Menggunakan Komponen) */}
                <div className="mb-12 z-20 relative">
                    <ExcelTable 
                        data={data} 
                        is_athlete={is_athlete} 
                        handleExChange={handleExChange} 
                        libExercises={libExercises} 
                        handleAddNewExercise={handleAddNewExercise} 
                        addNewRow={addNewRow} // <--- Lempar fungsi ini
                        removeRow={removeRow} // <--- Lempar fungsi ini
                        onDeleteExercise={handleDeleteExercise}
                    />
                </div>

                {/* === TABEL HISTORY (PANGGIL DI SINI) === */}
                <HistorySection 
                    historySessions={historySessions} 
                    userName={session.user.name} 
                />
                
                {/* Extra space at bottom to allow scrolling dropdowns */}
                <div className="h-40"></div>

            </div>
        </AdminLayout>
    );
}