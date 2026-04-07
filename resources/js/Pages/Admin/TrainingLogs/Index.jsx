import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Plus, X, MapPin, Edit3, User, Dumbbell, ChevronLeft, ChevronRight, Pencil, Trash2, CalendarDays, ChevronDown, Activity, AlertTriangle, Info } from 'lucide-react';
import { useState, useEffect, useRef, Fragment } from 'react';




const CustomSelect = ({ value, onChange, options, placeholder, disabled, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => String(opt.value) === String(value));

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`flex justify-between items-center w-full rounded-lg border touch-manipulation ${isOpen ? 'border-[#ff4d00] ring-2 ring-[#ff4d00]/20 bg-white' : 'border-slate-200 bg-slate-50'} text-xs md:text-sm px-3 md:px-4 py-3 md:py-3.5 transition-all ${disabled ? 'cursor-not-allowed opacity-60 bg-slate-100' : 'cursor-pointer hover:border-slate-300'} ${className}`}
            >
                <span className={`truncate pr-4 ${selectedOption ? "text-slate-800 font-bold" : "text-slate-400 font-medium"}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#ff4d00]' : ''}`} />
            </div>

            {isOpen && !disabled && (
                <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white border border-slate-200 shadow-xl rounded-lg max-h-48 md:max-h-56 overflow-y-auto z-[80] py-1.5 custom-scrollbar origin-top animate-in fade-in slide-in-from-top-2 duration-150">
                    {options.map((opt, idx) => {
                        const isSelected = String(value) === String(opt.value);
                        return (
                            <div
                                key={idx}
                                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                className={`px-4 py-3 md:py-2.5 text-xs md:text-sm cursor-pointer font-medium transition-colors ${isSelected ? 'bg-orange-50 text-[#ff4d00] font-bold border-l-2 border-[#ff4d00]' : 'text-slate-700 hover:bg-slate-50 border-l-2 border-transparent'}`}
                            >
                                {opt.label}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};




export default function Index({ calendar, athletes, coaches, is_athlete, currentMonth, currentYear, monthName }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    
    const [detailModal, setDetailModal] = useState({ isOpen: false, session: null, date: null });
    
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
    
    const form = useForm({
        user_id: '', date: new Date().toISOString().split('T')[0], 
        session_number: 1, training_type: '', coach_id: '', location: ''
    });

    useEffect(() => {
        if (isModalOpen || deleteModal.isOpen || detailModal.isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isModalOpen, deleteModal.isOpen, detailModal.isOpen]);

    const openModal = (dateStr = '', existingSession = null) => {
        if (existingSession) {
            setEditMode(true); setEditingId(existingSession.id);
            form.setData({
                user_id: existingSession.user_id, date: existingSession.date,
                session_number: existingSession.session_number, training_type: existingSession.training_type,
                coach_id: existingSession.coach_id || '', location: existingSession.location || ''
            });
            
            setDetailModal({ isOpen: false, session: null, date: null }); 
        } else {
            setEditMode(false); setEditingId(null);
            form.setData({ 
                user_id: '', date: dateStr || new Date().toISOString().split('T')[0], 
                session_number: 1, training_type: '', coach_id: '', location: '' 
            });
        }
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editMode) {
            form.put(route('admin.training-logs.session.update', editingId), { 
                onSuccess: () => { setIsModalOpen(false); form.reset(); }, 
                preserveScroll: true 
            });
        } else {
            form.post(route('admin.training-logs.session.store'), { 
                onSuccess: () => { setIsModalOpen(false); form.reset(); },
                preserveScroll: true
            });
        }
    };

    const confirmDelete = () => {
        router.delete(route('admin.training-logs.destroy', deleteModal.id), { 
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModal({ isOpen: false, id: null });
                setDetailModal({ isOpen: false, session: null, date: null }); 
            }
        });
    };

    const navigateMonth = (direction) => {
        let newMonth = currentMonth; let newYear = currentYear;
        if (direction === 'prev') { newMonth -= 1; if (newMonth < 1) { newMonth = 12; newYear -= 1; } } 
        else { newMonth += 1; if (newMonth > 12) { newMonth = 1; newYear += 1; } }
        router.get(route('admin.training-logs.index'), { month: newMonth, year: newYear }, { preserveState: true, preserveScroll: true });
    };

    const goToToday = () => {
        const today = new Date();
        router.get(route('admin.training-logs.index'), { month: today.getMonth() + 1, year: today.getFullYear() }, { preserveState: true, preserveScroll: true });
    };

    const openDetail = (session, date) => {
        setDetailModal({ isOpen: true, session, date });
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short' });
    
    
    const sessionOptions = Array.from({length: 100}, (_, i) => ({ value: i + 1, label: `Sesi ${i + 1}` }));
    const athleteOptions = athletes.map(a => ({ value: a.id, label: a.name }));
    const coachOptions = [{ value: '', label: '-- Latihan Mandiri (Tanpa Coach) --' }, ...coaches.map(c => ({ value: c.id, label: c.name }))];

    return (
        <AdminLayout title="Jadwal & Log Latihan">
            <Head title="Jadwal & Log Latihan" />
            
            <div className="w-full max-w-[1400px] mx-auto pb-20">
                
                
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6 mb-6 w-full bg-white p-4 sm:p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none"></div>
                    <div className="min-w-0 flex-1 relative z-10 w-full">
                        <span className="text-[9px] md:text-[10px] font-bold text-[#ff4d00] bg-orange-50 px-3 py-1 rounded-full uppercase tracking-widest mb-2 inline-block">Management</span>
                        <h2 className="text-xl md:text-3xl font-bold text-slate-800 flex items-center gap-2 tracking-tight">Jadwal Latihan</h2>
                        <p className="text-slate-500 font-medium mt-1 text-xs md:text-sm">Atur jadwal sesi klien dan kelola log.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0 relative z-10">
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1 shadow-inner w-full sm:w-auto justify-between">
                            <button onClick={() => navigateMonth('prev')} className="p-2 text-slate-500 hover:bg-white hover:text-[#ff4d00] hover:shadow-sm rounded-md transition-all touch-manipulation"><ChevronLeft className="w-4 h-4 md:w-5 md:h-5"/></button>
                            <div className="px-2 md:px-4 font-bold text-slate-700 w-full sm:w-28 md:w-36 text-center uppercase tracking-wider text-xs md:text-sm flex items-center justify-center gap-1.5 truncate"><CalendarDays className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400 shrink-0"/> {monthName}</div>
                            <button onClick={() => navigateMonth('next')} className="p-2 text-slate-500 hover:bg-white hover:text-[#ff4d00] hover:shadow-sm rounded-md transition-all touch-manipulation"><ChevronRight className="w-4 h-4 md:w-5 md:h-5"/></button>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button onClick={goToToday} className="flex-1 sm:flex-none px-3 md:px-4 py-2.5 md:py-3 bg-white text-slate-600 font-bold text-xs md:text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-center whitespace-nowrap touch-manipulation">Bulan Ini</button>
                            {!is_athlete && (
                                <button onClick={() => openModal()} className="flex-1 sm:flex-none bg-[#ff4d00] text-white px-3 md:px-5 py-2.5 md:py-3 rounded-lg font-bold text-xs md:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-[#ff4d00]/20 hover:bg-[#e64500] transition-all whitespace-nowrap touch-manipulation">
                                    <Plus className="w-3.5 h-3.5 md:w-4 md:h-4"/> Jadwal Baru
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                
                <div className="md:hidden flex flex-col gap-3">
                    {calendar.map((item, idx) => {

                        
                        const d = new Date();
                        const localDateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

                        const isToday = item.date === localDateString;

                        
                        if (item.is_empty) {
                            return (
                                <div key={`mob-empty-${item.date}`} className={`bg-white rounded-xl border p-4 shadow-sm ${isToday ? 'border-[#ff4d00]/30 bg-orange-50/10' : 'border-slate-200'}`}>
                                    <div className="flex justify-between items-center mb-3">
                                        <div className={`font-bold text-sm ${isToday ? 'text-[#ff4d00]' : 'text-slate-600'}`}>
                                            {formatDate(item.date)} {isToday && <span className="ml-2 text-[9px] bg-[#ff4d00] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Hari Ini</span>}
                                        </div>
                                    </div>
                                    <div className="border-2 border-dashed border-slate-100 rounded-lg bg-slate-50/50 p-3 flex justify-between items-center">
                                        <span className="text-slate-400 font-medium text-xs italic">-- Jadwal Kosong --</span>
                                        {!is_athlete && (
                                            <button onClick={() => openModal(item.date)} className="text-[#ff4d00] bg-white border border-orange-100 shadow-sm px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#ff4d00] hover:text-white transition-all touch-manipulation">
                                                <Plus className="w-3.5 h-3.5"/> Isi
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        }

                        
                        return (
                            <div key={`mob-session-${item.date}`} className={`bg-white rounded-xl border p-4 shadow-sm relative overflow-hidden ${isToday ? 'border-[#ff4d00]/50 ring-1 ring-[#ff4d00]/20' : 'border-slate-200'}`}>
                                {isToday && <div className="absolute top-0 right-0 w-16 h-16 bg-[#ff4d00] blur-3xl opacity-10 rounded-full pointer-events-none"></div>}
                                
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`font-bold text-sm ${isToday ? 'text-[#ff4d00]' : 'text-slate-500'}`}>
                                        {formatDate(item.date)} {isToday && <span className="ml-2 text-[9px] bg-[#ff4d00] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Hari Ini</span>}
                                    </div>
                                    <span className="text-[10px] font-bold text-[#ff4d00] bg-orange-50 px-2 py-1 rounded-md uppercase tracking-widest border border-orange-100">
                                        Sesi {item.session.session_number}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                                        {item.session.user?.profile_photo_url ? <img src={item.session.user.profile_photo_url} className="w-full h-full rounded-full object-cover" alt="" /> : <User className="w-6 h-6" />}
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="font-bold text-slate-800 text-base truncate">{item.session.user?.name || '-'}</span>
                                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500 truncate">
                                            <Activity className="w-3.5 h-3.5 shrink-0"/> <span className="truncate">{item.session.training_type}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button onClick={() => openDetail(item.session, item.date)} className="flex-1 py-2.5 bg-slate-50 text-slate-600 font-bold text-xs border border-slate-200 rounded-lg flex items-center justify-center gap-1.5 touch-manipulation hover:bg-slate-100">
                                        <Info className="w-4 h-4"/> Detail
                                    </button>
                                    <Link href={route('admin.training-logs.show', item.session.id)} className="flex-1 py-2.5 bg-[#ff4d00] text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 touch-manipulation shadow-md shadow-[#ff4d00]/20 hover:bg-[#e64500]">
                                        <Edit3 className="w-4 h-4"/> Buka Log
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>


                
                <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full relative z-0">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 text-xs uppercase font-bold tracking-widest">
                            <tr>
                                <th className="px-6 py-5 w-32">Tanggal</th>
                                <th className="px-6 py-5">Klien & Sesi</th>
                                <th className="px-6 py-5">Program Latihan</th>
                                <th className="px-6 py-5">Lokasi & Coach</th>
                                <th className="px-6 py-5 text-right w-48">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {calendar.map((item, idx) => {
                                const isToday = item.date === new Date().toISOString().split('T')[0];
                                
                                
                                if (item.is_empty) {
                                    return (
                                        <tr key={`desk-empty-${item.date}`} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 align-top">
                                                <div className={`font-bold text-sm mt-1 ${isToday ? 'text-[#ff4d00]' : 'text-slate-400'}`}>{formatDate(item.date)}</div>
                                            </td>
                                            <td colSpan="4" className="px-6 py-3">
                                                <div className="border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50 p-4 flex justify-between items-center group-hover:border-orange-200 group-hover:bg-orange-50/30 transition-all">
                                                    <span className="text-slate-400 font-medium text-xs italic ml-2">-- Kosong --</span>
                                                    {!is_athlete && (
                                                        <button onClick={() => openModal(item.date)} className="text-[#ff4d00] bg-white border border-orange-100 shadow-sm px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#ff4d00] hover:text-white transition-all">
                                                            <Plus className="w-3.5 h-3.5"/> Jadwalkan
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }

                                
                                return (
                                    <tr key={`desk-session-${item.date}`} className={`transition-colors hover:bg-slate-50 ${isToday ? 'bg-orange-50/10' : 'bg-white'}`}>
                                        <td className="px-6 py-4 align-middle">
                                            <div className={`font-bold flex flex-col gap-1 text-sm ${isToday ? 'text-[#ff4d00]' : 'text-slate-700'}`}>
                                                <span>{formatDate(item.date)}</span>
                                                {isToday && <span className="text-[9px] bg-[#ff4d00] text-white px-2 py-0.5 rounded-full uppercase tracking-wider w-fit">Hari Ini</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                                                    {item.session.user?.profile_photo_url ? <img src={item.session.user.profile_photo_url} className="w-full h-full rounded-full object-cover" alt="" /> : <User className="w-5 h-5" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-800 text-base">{item.session.user?.name || '-'}</span>
                                                    <span className="text-[10px] font-bold text-[#ff4d00] uppercase tracking-widest mt-1">Sesi {item.session.session_number}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-orange-50 rounded-lg text-[#ff4d00] shrink-0"><Activity className="w-4 h-4"/></div>
                                                <span className="font-bold text-slate-700 text-sm truncate max-w-[200px]">{item.session.training_type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-middle">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0"/>
                                                    <span className="truncate max-w-[150px]">{item.session.location || '-'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                                    <Dumbbell className="w-3.5 h-3.5 text-[#ff4d00] shrink-0"/>
                                                    <span className="truncate max-w-[150px]">{item.session.coach?.name || 'Latihan Mandiri'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-middle text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!is_athlete && (
                                                    <>
                                                        <button onClick={() => openModal(item.date, item.session)} title="Edit" className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"><Pencil className="w-4 h-4"/></button>
                                                        <button onClick={() => setDeleteModal({ isOpen: true, id: item.session.id })} title="Hapus" className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                                                    </>
                                                )}
                                                <Link href={route('admin.training-logs.show', item.session.id)} className="px-4 py-2 text-xs font-bold text-white bg-[#ff4d00] shadow-md shadow-[#ff4d00]/20 hover:bg-[#e64500] rounded-lg transition-all flex items-center gap-1.5">
                                                    <Edit3 className="w-4 h-4"/> Buka Log
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            
            {detailModal.isOpen && detailModal.session && (
                <div className="fixed inset-0 z-[60] md:hidden flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full rounded-t-2xl sm:rounded-xl shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
                        
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1 sm:hidden"></div>
                        
                        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Detail Sesi Latihan</h3>
                                <p className="text-[10px] font-bold text-[#ff4d00] uppercase tracking-widest mt-0.5">{formatDate(detailModal.date)}</p>
                            </div>
                            <button onClick={() => setDetailModal({ isOpen: false, session: null, date: null })} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors touch-manipulation"><X className="w-5 h-5 text-slate-500"/></button>
                        </div>
                        
                        <div className="p-5 space-y-4">
                            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                                    {detailModal.session.user?.profile_photo_url ? <img src={detailModal.session.user.profile_photo_url} className="w-full h-full rounded-full object-cover" alt="" /> : <User className="w-6 h-6" />}
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Klien</span>
                                    <span className="font-bold text-slate-800 text-base block leading-none">{detailModal.session.user?.name || '-'}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 flex items-center gap-1"><Activity className="w-3.5 h-3.5"/> Program</span>
                                    <span className="font-bold text-slate-700 text-sm block truncate">{detailModal.session.training_type}</span>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 flex items-center gap-1"><Dumbbell className="w-3.5 h-3.5"/> Coach</span>
                                    <span className="font-bold text-slate-700 text-sm block truncate">{detailModal.session.coach?.name || 'Tanpa Coach'}</span>
                                </div>
                                <div className="col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> Lokasi</span>
                                    <span className="font-bold text-slate-700 text-sm block truncate">{detailModal.session.location || 'Tidak ditentukan'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl sm:rounded-b-xl">
                            {/* AKALAN: Tambahkan event onClick untuk menutup modal sebelum navigasi Inertia terjadi agar tidak stuck */}
                            <Link 
                                href={route('admin.training-logs.show', detailModal.session.id)} 
                                onClick={() => setDetailModal({ isOpen: false, session: null, date: null })}
                                className="w-full py-3.5 bg-[#ff4d00] text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 touch-manipulation shadow-lg shadow-[#ff4d00]/20 hover:bg-[#e64500] mb-3"
                            >
                                <Edit3 className="w-5 h-5"/> Buka Log & Catat Latihan
                            </Link>
                            
                            {!is_athlete && (
                                <div className="flex gap-3">
                                    <button onClick={() => openModal(detailModal.date, detailModal.session)} className="flex-1 py-3 bg-white text-slate-700 font-bold text-xs border border-slate-200 rounded-lg flex items-center justify-center gap-1.5 touch-manipulation hover:bg-slate-50">
                                        <Pencil className="w-4 h-4"/> Edit Info
                                    </button>
                                    <button onClick={() => setDeleteModal({ isOpen: true, id: detailModal.session.id })} className="flex-1 py-3 bg-rose-50 text-rose-600 font-bold text-xs border border-rose-200 rounded-lg flex items-center justify-center gap-1.5 touch-manipulation hover:bg-rose-100">
                                        <Trash2 className="w-4 h-4"/> Hapus
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}


            
            
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col my-auto">
                        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center rounded-t-xl">
                            <div>
                                <h3 className="font-bold text-base md:text-lg text-slate-800">{editMode ? 'Edit Jadwal Sesi' : 'Jadwal Sesi Baru'}</h3>
                                <p className="text-[10px] md:text-xs font-medium text-slate-500 mt-0.5">{editMode ? 'Perbarui detail jadwal latihan.' : 'Tentukan jadwal sebelum mengisi Excel Log.'}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-100 transition-colors touch-manipulation"><X className="w-5 h-5 text-slate-500"/></button>
                        </div>
                        <form onSubmit={submit} className="p-5 space-y-4 rounded-b-xl overflow-y-auto max-h-[80vh] custom-scrollbar">
                            
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Pilih Klien (Atlet)</label>
                                <CustomSelect 
                                    value={form.data.user_id} 
                                    onChange={(val) => form.setData('user_id', val)} 
                                    options={athleteOptions} 
                                    placeholder="-- Pilih Klien --" 
                                    disabled={editMode}
                                    className={editMode ? '' : '!bg-orange-50/50 !text-orange-900 !border-orange-200'}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Tanggal</label>
                                    <input type="date" value={form.data.date} onChange={e => form.setData('date', e.target.value)} className="w-full rounded-lg border border-slate-200 text-sm bg-slate-50 px-3 py-3 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] transition-all outline-none" required/>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Sesi Ke-</label>
                                    <CustomSelect 
                                        value={form.data.session_number} 
                                        onChange={(val) => form.setData('session_number', val)} 
                                        options={sessionOptions} 
                                        placeholder="Sesi" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Tipe Latihan</label>
                                <input type="text" placeholder="Cth: Strength Training..." value={form.data.training_type} onChange={e => form.setData('training_type', e.target.value)} className="w-full rounded-lg border border-slate-200 text-sm bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] transition-all outline-none font-medium" required/>
                            </div>
                            
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Coach Pendamping</label>
                                <CustomSelect 
                                    value={form.data.coach_id} 
                                    onChange={(val) => form.setData('coach_id', val)} 
                                    options={coachOptions} 
                                    placeholder="-- Pilih Coach --" 
                                />
                            </div>
                            
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Lokasi Latihan</label>
                                <input type="text" placeholder="Cth: Apartemen / Gym Pusat..." value={form.data.location} onChange={e => form.setData('location', e.target.value)} className="w-full rounded-lg border border-slate-200 text-sm bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] transition-all outline-none font-medium"/>
                            </div>
                            
                            <div className="pt-3">
                                <button type="submit" disabled={form.processing || !form.data.user_id} className="w-full py-3.5 bg-[#ff4d00] text-white font-bold text-sm rounded-lg shadow-lg shadow-[#ff4d00]/20 hover:bg-[#e64500] transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed touch-manipulation">
                                    {form.processing ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : editMode ? 'Simpan Pembaruan Jadwal' : 'Buat Sesi & Isi Log Training'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            
            
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-rose-50">
                            <AlertTriangle className="w-8 h-8 text-rose-500" />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">Hapus Jadwal?</h3>
                        <p className="text-xs md:text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                            Yakin ingin mengosongkan jadwal ini? Seluruh <strong className="text-slate-700">catatan beban & repetisi (log)</strong> di dalamnya juga akan terhapus secara permanen.
                        </p>
                        <div className="flex flex-col-reverse sm:flex-row gap-3">
                            <button onClick={() => setDeleteModal({ isOpen: false, id: null })} className="w-full sm:flex-1 py-3 bg-slate-100 text-slate-600 font-bold text-sm rounded-lg hover:bg-slate-200 transition-colors touch-manipulation">
                                Batal
                            </button>
                            <button onClick={confirmDelete} className="w-full sm:flex-1 py-3 bg-rose-500 text-white font-bold text-sm rounded-lg shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-colors touch-manipulation">
                                Ya, Hapus!
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}