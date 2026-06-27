import React, { useState, useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ChevronLeft, Plus, Calendar, Dumbbell, Trash2, X, ChevronDown, User, Activity, Package } from 'lucide-react';

export default function ShowAthlete({ auth, athlete, trainings, exercises = [], packages = [] }) {
 // Generate dates: from today to +7 days buffer
 const dateList = useMemo(() => {
 const list = [];
 const today = new Date();
 today.setHours(0, 0, 0, 0);

 for (let i = -7; i <= 7; i++) {
 const d = new Date(today);
 d.setDate(today.getDate() + i);
 const dateStr = d.toISOString().split('T')[0];
 const displayDate = d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
 
 // Find sessions for this date
 const sessions = trainings.filter(t => t.date === dateStr);
 
 list.push({
 date: dateStr,
 displayDate,
 sessions,
 isToday: i === 0,
 });
 }
 return list;
 }, [trainings]);

 const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
 const [selectedDate, setSelectedDate] = useState("");
 const [nextSessionNumber, setNextSessionNumber] = useState(1);

 const { data, setData, post, processing, reset, errors } = useForm({
 date: '',
 session_option: 'next',
 custom_session_number: '',
 training_type: '',
 location: '',
 programs: []
 });

 const openAddSessionModal = (dateStr) => {
 const sessionsForDate = trainings.filter(t => t.date === dateStr);
 const lastSessionNumber = sessionsForDate.length > 0 
 ? Math.max(...sessionsForDate.map(s => s.session_number)) 
 : 0;
 
 setNextSessionNumber(lastSessionNumber + 1);
 
 setData({
 date: dateStr,
 session_option: 'next',
 custom_session_number: '',
 training_type: '',
 location: '',
 programs: [{ phase: '', logic: '', exercise_id: '', sets: '', reps: '', duration: '', rest: '', intensity: '', notes: '' }]
 });
 
 setSelectedDate(dateStr);
 setIsSessionModalOpen(true);
 };

 const addProgramRow = () => {
 setData('programs', [...data.programs, { phase: '', logic: '', exercise_id: '', sets: '', reps: '', duration: '', rest: '', intensity: '', notes: '' }]);
 };

 const removeProgramRow = (index) => {
 const newPrograms = [...data.programs];
 newPrograms.splice(index, 1);
 setData('programs', newPrograms);
 };

 const updateProgram = (index, field, value) => {
 const newPrograms = [...data.programs];
 newPrograms[index][field] = value;
 setData('programs', newPrograms);
 };

 const [isPackageDropdownOpen, setIsPackageDropdownOpen] = useState(false);
 const addFromPackage = (pkg) => {
    if (!pkg || !pkg.exercises || pkg.exercises.length === 0) return;
    const newPrograms = pkg.exercises.map(ex => ({
        phase: '', logic: '', exercise_id: ex.id, sets: '', reps: '', duration: '', rest: '', intensity: '', notes: ''
    }));
    // If there is only one empty row, replace it
    if (data.programs.length === 1 && data.programs[0].exercise_id === '') {
        setData('programs', newPrograms);
    } else {
        setData('programs', [...data.programs, ...newPrograms]);
    }
    setIsPackageDropdownOpen(false);
 };

 const submitSession = (e) => {
 e.preventDefault();
 post(route('admin.individual-trainings.session.store', athlete.id), {
 preserveScroll: true,
 onSuccess: () => {
 setIsSessionModalOpen(false);
 reset();
 }
 });
 };

 const handleDeleteSession = (id) => {
 if (confirm('Yakin ingin menghapus sesi latihan ini?')) {
 router.delete(route('admin.individual-trainings.session.destroy', id), {
 preserveScroll: true
 });
 }
 };

 return (
 <AdminLayout title={`Individual Training - ${athlete.name}`}>
 <Head title={`Individual Training - ${athlete.name}`} />
 <div className="mb-8">
 <h1 className="text-2xl font-bold text-gray-900 ">Timeline Individual Training</h1>
 <p className="text-gray-600 ">Manajemen sesi latihan individu untuk {athlete.name}.</p>
 </div>

 <div className="pb-12 space-y-6">
 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
 <Link
 href={route('admin.individual-trainings.index')}
 className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
 >
 <ChevronLeft size={16} /> Kembali ke Daftar Athlete
 </Link>
 </div>

 {/* Athlete Profile Card */}
 <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex items-center gap-6">
 <div className="h-20 w-20 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden border-2 border-zinc-200 shrink-0">
 {athlete.profile_photo_url ? (
 <img src={athlete.profile_photo_url} alt={athlete.name} className="h-full w-full object-cover" />
 ) : (
 <User className="h-8 w-8 text-zinc-400" />
 )}
 </div>
 <div>
 <h2 className="text-xl font-black text-zinc-900 ">{athlete.name}</h2>
 <div className="mt-2 flex items-center gap-4 text-sm font-semibold text-zinc-500">
 <span className="flex items-center gap-1.5"><Activity size={14}/> {athlete.sport?.name || 'Cabang Olahraga'}</span>
 <span className="flex items-center gap-1.5 capitalize"><Dumbbell size={14}/> {athlete.role}</span>
 </div>
 </div>
 </div>

 <div className="space-y-4">
 {dateList.map((dayData, index) => (
 <div key={index} className={`rounded-2xl border transition-colors overflow-hidden ${dayData.isToday ? 'border-zinc-900 bg-zinc-50 ' : 'border-zinc-200 bg-white '} shadow-sm`}>
 <div className="px-6 py-4 flex items-center justify-between border-b border-zinc-100 ">
 <div className="flex items-center gap-3">
 <div className={`p-2 rounded-lg ${dayData.isToday ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
 <Calendar size={18} />
 </div>
 <div>
 <h3 className="font-bold text-zinc-900 flex items-center gap-2">
 {dayData.displayDate}
 {dayData.isToday && <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-black bg-zinc-900 text-white">Hari Ini</span>}
 </h3>
 </div>
 </div>
 <div className="flex items-center gap-4">
 {dayData.sessions.length > 0 && (
 <span className="px-3 py-1 bg-zinc-100 text-zinc-900 text-xs font-bold rounded-lg">
 {dayData.sessions.length} Sesi
 </span>
 )}
 <button
 onClick={() => openAddSessionModal(dayData.date)}
 className="flex items-center gap-1.5 text-sm font-semibold text-zinc-900 hover:opacity-70 transition-opacity"
 >
 <Plus size={16} /> <span className="hidden sm:inline">Tambah Sesi</span>
 </button>
 </div>
 </div>
 
 {dayData.sessions.length > 0 ? (
 <div className="divide-y divide-zinc-100 ">
 {dayData.sessions.map((session) => (
 <div key={session.id} className="p-6">
 <div className="flex justify-between items-start mb-4">
 <div>
 <div className="flex items-center gap-2 mb-1">
 <span className="bg-zinc-900 text-white text-xs font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
 Sesi {session.session_number}
 </span>
 <span className="text-sm font-semibold text-zinc-500">
 {session.training_type || 'General Training'}
 </span>
 </div>
 {session.location && (
 <p className="text-sm text-zinc-400 font-medium flex items-center gap-1.5 mt-1">
 📍 {session.location}
 </p>
 )}
 </div>
 <button 
 onClick={() => handleDeleteSession(session.id)}
 className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
 >
 <Trash2 size={16} />
 </button>
 </div>

 {session.programs && session.programs.length > 0 ? (
 <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 ">
 <table className="w-full text-sm text-left">
 <thead className="text-xs text-zinc-500 bg-zinc-50 uppercase tracking-wider">
 <tr>
 <th className="px-4 py-3 font-semibold">Phase & Logic</th>
 <th className="px-4 py-3 font-semibold">Master Exercise</th>
 <th className="px-4 py-3 font-semibold text-center">Set x Reps</th>
 <th className="px-4 py-3 font-semibold">Intensity / Rest</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-zinc-100 ">
 {session.programs.map((prog, idx) => (
 <tr key={idx} className="bg-white ">
 <td className="px-4 py-3">
 <div className="font-semibold text-zinc-900 ">{prog.phase || '-'}</div>
 <div className="text-xs text-zinc-500 mt-0.5">{prog.logic || '-'}</div>
 </td>
 <td className="px-4 py-3 font-bold text-zinc-900 ">
 {prog.exercise ? prog.exercise.name : <span className="text-zinc-400 italic">Unknown</span>}
 {prog.notes && <div className="text-xs font-normal text-zinc-500 mt-1">Notes: {prog.notes}</div>}
 </td>
 <td className="px-4 py-3 text-center font-semibold text-zinc-700 ">
 {prog.sets || '-'} {prog.reps ? `x ${prog.reps}` : ''}
 </td>
 <td className="px-4 py-3">
 <div className="flex flex-col gap-1 text-xs font-medium text-zinc-600 ">
 {prog.intensity && <span>Int: <span className="font-bold text-zinc-900 ">{prog.intensity}</span></span>}
 {prog.rest && <span>Rest: <span className="font-bold text-zinc-900 ">{prog.rest}</span></span>}
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 ) : (
 <div className="p-4 text-center bg-zinc-50 rounded-xl mt-4 border border-zinc-100 ">
 <p className="text-sm font-semibold text-zinc-500">Tidak ada detail program untuk sesi ini.</p>
 </div>
 )}
 </div>
 ))}
 </div>
 ) : (
 <div className="px-6 py-4 bg-zinc-50 text-sm font-medium text-zinc-400 italic">
 Belum ada sesi latihan.
 </div>
 )}
 </div>
 ))}
 </div>
 </div>

 {/* Add Session Modal */}
 {isSessionModalOpen && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm transition-opacity">
 <div className="bg-white border border-zinc-200 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
 <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between shrink-0">
 <h3 className="text-lg font-bold text-zinc-900 ">
 Tambah Sesi Latihan
 </h3>
 <button
 onClick={() => setIsSessionModalOpen(false)}
 className="text-zinc-400 hover:text-zinc-900 transition-colors"
 >
 <X size={20} />
 </button>
 </div>
 
 <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
 <form id="sessionForm" onSubmit={submitSession} className="space-y-6">
 {/* Basic Info */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="block text-[11px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">Opsi Sesi</label>
 <div className="flex gap-4 items-center h-[42px]">
 <label className="flex items-center gap-2 text-sm font-semibold text-zinc-900 cursor-pointer">
 <input type="radio" value="next" checked={data.session_option === 'next'} onChange={(e) => setData('session_option', e.target.value)} className="text-zinc-900 focus:ring-zinc-900 bg-zinc-100 border-zinc-300 " />
 Lanjut Sesi {nextSessionNumber}
 </label>
 <label className="flex items-center gap-2 text-sm font-semibold text-zinc-900 cursor-pointer">
 <input type="radio" value="custom" checked={data.session_option === 'custom'} onChange={(e) => setData('session_option', e.target.value)} className="text-zinc-900 focus:ring-zinc-900 bg-zinc-100 border-zinc-300 " />
 Custom
 </label>
 </div>
 </div>
 {data.session_option === 'custom' && (
 <div>
 <label className="block text-[11px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">Nomor Sesi Custom</label>
 <input 
 type="number" min="1" 
 value={data.custom_session_number} 
 onChange={(e) => setData('custom_session_number', e.target.value)}
 className="w-full py-2.5 px-3 bg-white border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none"
 />
 </div>
 )}
 </div>
 
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="block text-[11px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">Jenis / Tipe Latihan (Opsional)</label>
 <input 
 type="text" 
 value={data.training_type} 
 onChange={(e) => setData('training_type', e.target.value)}
 placeholder="e.g. Strength, Recovery..."
 className="w-full py-2.5 px-3 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none"
 />
 </div>
 <div>
 <label className="block text-[11px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">Lokasi (Opsional)</label>
 <input 
 type="text" 
 value={data.location} 
 onChange={(e) => setData('location', e.target.value)}
 placeholder="e.g. Gym A, Field B..."
 className="w-full py-2.5 px-3 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none"
 />
 </div>
 </div>

 {/* Programs Editor */}
 <div className="border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50 ">
 <div className="px-4 py-3 bg-zinc-100 border-b border-zinc-200 flex justify-between items-center flex-wrap gap-2">
 <h4 className="text-sm font-bold text-zinc-900 ">Program / Skema Konten</h4>
 <div className="flex items-center gap-2">
    <div className="relative">
        <button type="button" onClick={() => setIsPackageDropdownOpen(!isPackageDropdownOpen)} className="text-xs font-bold bg-white border border-zinc-200 text-zinc-900 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors hover:bg-zinc-50">
            <Package size={14} /> Pilih Paket
        </button>
        {isPackageDropdownOpen && (
            <>
            <div className="fixed inset-0 z-40" onClick={() => setIsPackageDropdownOpen(false)}></div>
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 py-2 max-h-60 overflow-y-auto custom-scrollbar">
                {packages.length > 0 ? packages.map(pkg => (
                    <button key={pkg.id} type="button" onClick={() => addFromPackage(pkg)} className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 font-semibold flex justify-between items-center group">
                        {pkg.name} <span className="text-xs text-zinc-400 group-hover:text-zinc-600">{pkg.exercises?.length} ex</span>
                    </button>
                )) : (
                    <div className="px-4 py-2 text-xs text-zinc-500 italic">Belum ada paket latihan.</div>
                )}
            </div>
            </>
        )}
    </div>
    <button type="button" onClick={addProgramRow} className="text-xs font-bold bg-zinc-900 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-opacity hover:opacity-80">
    <Plus size={14} /> Tambah Row
    </button>
 </div>
 </div>
 <div className="p-4 space-y-4">
 {data.programs.map((prog, index) => (
 <div key={index} className="relative bg-white border border-zinc-200 p-4 rounded-xl shadow-sm pr-12">
 <button type="button" onClick={() => removeProgramRow(index)} className="absolute right-3 top-4 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
 <Trash2 size={16} />
 </button>
 
 <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
 <div className="md:col-span-1">
 <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase">Fase</label>
 <input type="text" value={prog.phase} onChange={(e) => updateProgram(index, 'phase', e.target.value)} className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded text-sm outline-none" placeholder="Phase..." />
 </div>
 <div className="md:col-span-1">
 <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase">Logic</label>
 <input type="text" value={prog.logic} onChange={(e) => updateProgram(index, 'logic', e.target.value)} className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded text-sm outline-none" placeholder="Logic..." />
 </div>
 <div className="md:col-span-1 lg:col-span-2">
 <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase">Master Exercise</label>
 <div className="relative">
 <select value={prog.exercise_id} onChange={(e) => updateProgram(index, 'exercise_id', e.target.value)} className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded text-sm outline-none appearance-none" required>
 <option value="">Pilih Exercise...</option>
 {exercises.map(ex => (
 <option key={ex.id} value={ex.id}>{ex.name}</option>
 ))}
 </select>
 <ChevronDown size={14} className="absolute right-3 top-3 text-zinc-400 pointer-events-none" />
 </div>
 </div>
 
 <div className="md:col-span-1">
 <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase">Sets</label>
 <input type="text" value={prog.sets} onChange={(e) => updateProgram(index, 'sets', e.target.value)} className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded text-sm outline-none" placeholder="e.g. 3" />
 </div>
 <div className="md:col-span-1">
 <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase">Reps</label>
 <input type="text" value={prog.reps} onChange={(e) => updateProgram(index, 'reps', e.target.value)} className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded text-sm outline-none" placeholder="e.g. 10" />
 </div>
 <div className="md:col-span-1">
 <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase">Rest</label>
 <input type="text" value={prog.rest} onChange={(e) => updateProgram(index, 'rest', e.target.value)} className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded text-sm outline-none" placeholder="e.g. 60s" />
 </div>
 <div className="md:col-span-1">
 <label className="block text-[10px] font-bold text-zinc-500 mb-1 uppercase">Intensity</label>
 <input type="text" value={prog.intensity} onChange={(e) => updateProgram(index, 'intensity', e.target.value)} className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded text-sm outline-none" placeholder="e.g. RPE 8" />
 </div>
 </div>
 </div>
 ))}
 {data.programs.length === 0 && (
 <div className="text-center py-8">
 <p className="text-sm font-semibold text-zinc-500">Klik "Tambah Row" untuk menambahkan skema konten pada sesi ini.</p>
 </div>
 )}
 </div>
 </div>
 </form>
 </div>

 <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3 shrink-0">
 <button
 type="button"
 onClick={() => setIsSessionModalOpen(false)}
 className="px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-200 rounded-lg transition-colors"
 >
 Batal
 </button>
 <button
 type="submit"
 form="sessionForm"
 disabled={processing}
 className="px-6 py-2 text-sm font-bold text-white bg-[#ff4d00] hover:bg-[#e64500] rounded-lg transition-colors shadow-sm shadow-[#ff4d00]/20 disabled:opacity-50"
 >
 {processing ? "Menyimpan..." : "Simpan Sesi"}
 </button>
 </div>
 </div>
 </div>
 )}
 </AdminLayout>
 );
}
