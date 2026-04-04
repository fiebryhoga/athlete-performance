import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Plus, X, MapPin, Edit3, User, Dumbbell, ChevronLeft, ChevronRight, Pencil, Trash2, CalendarDays, ChevronDown, ChevronUp, Activity, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useRef, Fragment } from 'react';

// ==========================================
// KOMPONEN: CUSTOM DROPDOWN SELECT
// ==========================================
const CustomSelect = ({ value, onChange, options, placeholder, disabled, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    // Tutup jika klik di luar
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
                className={`flex justify-between items-center w-full rounded-xl border ${isOpen ? 'border-[#00488b] ring-2 ring-[#00488b]/20 bg-white' : 'border-slate-200 bg-slate-50'} text-sm px-4 py-3.5 transition-all ${disabled ? 'cursor-not-allowed opacity-60 bg-slate-100' : 'cursor-pointer hover:border-slate-300'} ${className}`}
            >
                <span className={`truncate pr-4 ${selectedOption ? "text-slate-800 font-bold" : "text-slate-400 font-medium"}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#00488b]' : ''}`} />
            </div>

            {isOpen && !disabled && (
                <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white border border-slate-200 shadow-xl rounded-xl max-h-56 overflow-y-auto z-[80] py-1.5 custom-scrollbar origin-top animate-in fade-in slide-in-from-top-2 duration-150">
                    {options.map((opt, idx) => {
                        const isSelected = String(value) === String(opt.value);
                        return (
                            <div
                                key={idx}
                                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                className={`px-4 py-2.5 text-sm cursor-pointer font-medium transition-colors ${isSelected ? 'bg-blue-50 text-[#00488b] font-bold border-l-2 border-[#00488b]' : 'text-slate-700 hover:bg-slate-50 border-l-2 border-transparent'}`}
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

// ==========================================
// HALAMAN UTAMA (INDEX)
// ==========================================
export default function Index({ calendar, athletes, coaches, is_athlete, currentMonth, currentYear, monthName }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    
    // State Modal Hapus
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
    
    const form = useForm({
        user_id: '', date: new Date().toISOString().split('T')[0], 
        session_number: 1, training_type: '', coach_id: '', location: ''
    });

    useEffect(() => {
        if (isModalOpen || deleteModal.isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isModalOpen, deleteModal.isOpen]);

    const openModal = (dateStr = '', existingSession = null) => {
        if (existingSession) {
            setEditMode(true); setEditingId(existingSession.id);
            form.setData({
                user_id: existingSession.user_id, date: existingSession.date,
                session_number: existingSession.session_number, training_type: existingSession.training_type,
                coach_id: existingSession.coach_id || '', location: existingSession.location || ''
            });
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
                preserveScroll: true // <--- Tambahkan baris ini
            });
        }
    };

    // FUNGSI EKSEKUSI HAPUS
    const confirmDelete = () => {
        router.delete(route('admin.training-logs.destroy', deleteModal.id), { 
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModal({ isOpen: false, id: null });
                setExpandedRow(null); // <--- Tambahkan baris ini
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

    const toggleRow = (id) => setExpandedRow(expandedRow === id ? null : id);
    const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short' });
    
    // Persiapan Data untuk Custom Dropdowns
    const sessionOptions = Array.from({length: 100}, (_, i) => ({ value: i + 1, label: `Sesi ${i + 1}` }));
    const athleteOptions = athletes.map(a => ({ value: a.id, label: a.name }));
    const coachOptions = [{ value: '', label: '-- Latihan Mandiri (Tanpa Coach) --' }, ...coaches.map(c => ({ value: c.id, label: c.name }))];

    return (
        <AdminLayout title="Jadwal & Log Latihan">
            <Head title="Jadwal & Log Latihan" />
            
            <div className="w-full max-w-[1400px] mx-auto min-w-0 pb-20">
                
                {/* HEADER UTAMA */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 w-full bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50"></div>
                    <div className="min-w-0 flex-1 relative z-10">
                        <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">Management</span>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-2 truncate tracking-tight">Jadwal Latihan</h2>
                        <p className="text-slate-500 font-medium mt-1 text-sm truncate">Atur jadwal sesi klien dan kelola log latihan bulanan.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0 relative z-10">
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1 shadow-inner w-full sm:w-auto justify-between">
                            <button onClick={() => navigateMonth('prev')} className="p-2 text-slate-500 hover:bg-white hover:text-[#00488b] hover:shadow-sm rounded-xl transition-all"><ChevronLeft className="w-5 h-5"/></button>
                            <div className="px-4 font-black text-slate-700 w-36 text-center uppercase tracking-wider text-sm flex items-center justify-center gap-2"><CalendarDays className="w-4 h-4 text-slate-400"/> {monthName}</div>
                            <button onClick={() => navigateMonth('next')} className="p-2 text-slate-500 hover:bg-white hover:text-[#00488b] hover:shadow-sm rounded-xl transition-all"><ChevronRight className="w-5 h-5"/></button>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button onClick={goToToday} className="flex-1 sm:flex-none px-4 py-3 bg-white text-slate-600 font-bold text-sm border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm text-center">Bulan Ini</button>
                            {!is_athlete && (
                                <button onClick={() => openModal()} className="flex-1 sm:flex-none bg-[#00488b] text-white px-5 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 hover:bg-[#003666] transition-all">
                                    <Plus className="w-4 h-4"/> Jadwal Baru
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* TABEL JADWAL */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                                <tr>
                                    <th className="px-6 py-5 w-32">Tanggal</th>
                                    <th className="px-6 py-5">Client & Sesi</th>
                                    <th className="px-6 py-5">Program Latihan</th>
                                    <th className="px-6 py-5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {calendar.map((item, idx) => {
                                    const isToday = item.date === new Date().toISOString().split('T')[0];
                                    
                                    if (item.is_empty) {
                                        return (
                                            <tr key={`empty-${item.date}`} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 align-top"><div className={`font-bold text-slate-400 ${isToday ? 'text-blue-500' : ''}`}>{formatDate(item.date)}</div></td>
                                                <td colSpan="3" className="px-6 py-3">
                                                    <div className="border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50 p-3 flex justify-between items-center group-hover:border-blue-200 group-hover:bg-blue-50/30 transition-all">
                                                        <span className="text-slate-400 font-medium text-xs italic ml-2">-- Kosong --</span>
                                                        {!is_athlete && (
                                                            <button onClick={() => openModal(item.date)} className="text-[#00488b] bg-white border border-blue-100 shadow-sm px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#00488b] hover:text-white transition-all"><Plus className="w-3.5 h-3.5"/> Jadwalkan</button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }

                                    return (
                                        <Fragment key={`session-${item.date}`}>
                                            <tr className={`transition-colors cursor-pointer ${isToday ? 'bg-blue-50/10' : 'bg-white'} ${expandedRow === item.session.id ? 'bg-blue-50/30' : 'hover:bg-slate-50'}`} onClick={() => toggleRow(item.session.id)}>
                                                <td className="px-6 py-5 align-middle">
                                                    <div className={`font-bold flex flex-col gap-1 ${isToday ? 'text-[#00488b]' : 'text-slate-700'}`}>
                                                        <span>{formatDate(item.date)}</span>
                                                        {isToday && <span className="text-[9px] bg-[#00488b] text-white px-2 py-0.5 rounded-full uppercase tracking-wider w-fit">Hari Ini</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 align-middle">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                                                            {item.session.user?.profile_photo_url ? <img src={item.session.user.profile_photo_url} className="w-full h-full rounded-full object-cover" alt="" /> : <User className="w-5 h-5" />}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-slate-800 text-base">{item.session.user?.name || '-'}</span>
                                                            <span className="text-[10px] font-bold text-[#00488b] uppercase tracking-widest mt-0.5">Sesi {item.session.session_number}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-500 shrink-0"><Activity className="w-4 h-4"/></div>
                                                        <span className="font-bold text-slate-700 truncate max-w-[200px]">{item.session.training_type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 align-middle text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={(e) => { e.stopPropagation(); toggleRow(item.session.id); }} className="px-3 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5">
                                                            {expandedRow === item.session.id ? <><ChevronUp className="w-4 h-4"/> Tutup</> : <><ChevronDown className="w-4 h-4"/> Detail</>}
                                                        </button>
                                                        <Link href={route('admin.training-logs.show', item.session.id)} onClick={(e) => e.stopPropagation()} className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-[#00488b] shadow-md shadow-blue-900/20 hover:bg-[#003666] px-5 py-2.5 rounded-xl transition-all">
                                                            <Edit3 className="w-3.5 h-3.5"/> Buka Log
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>

                                            {expandedRow === item.session.id && (
                                                <tr>
                                                    <td colSpan="4" className="p-0 border-b border-slate-200 bg-slate-50/80 shadow-inner">
                                                        <div className="px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                            <div className="flex flex-wrap items-center gap-6">
                                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                                    <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 text-[#00488b]"><Dumbbell className="w-4 h-4"/></div>
                                                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Coach Pendamping</p><p className="font-bold">{item.session.coach?.name || 'Tanpa Coach'}</p></div>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                                    <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 text-rose-500"><MapPin className="w-4 h-4"/></div>
                                                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lokasi Latihan</p><p className="font-bold">{item.session.location || 'Tidak ditentukan'}</p></div>
                                                                </div>
                                                            </div>

                                                            {!is_athlete && (
                                                                <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 border-t border-slate-200 md:border-0 pt-4 md:pt-0">
                                                                    <button onClick={() => openModal(item.date, item.session)} className="flex-1 md:flex-none px-4 py-2 text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"><Pencil className="w-3.5 h-3.5"/> Edit Info</button>
                                                                    <button onClick={() => setDeleteModal({ isOpen: true, id: item.session.id })} className="flex-1 md:flex-none px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"><Trash2 className="w-3.5 h-3.5"/> Hapus</button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL TAMBAH / EDIT JADWAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                    {/* Hapus overflow-hidden agar custom dropdown tidak terpotong saat memanjang ke bawah */}
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 my-auto flex flex-col">
                        <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center rounded-t-3xl">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">{editMode ? 'Edit Jadwal Sesi' : 'Jadwal Sesi Baru'}</h3>
                                <p className="text-xs font-medium text-slate-500 mt-0.5">{editMode ? 'Perbarui detail jadwal latihan.' : 'Tentukan jadwal sebelum mengisi Excel Log.'}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-100 transition-colors"><X className="w-4 h-4 text-slate-500"/></button>
                        </div>
                        <form onSubmit={submit} className="p-6 space-y-5 rounded-b-3xl">
                            
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Pilih Klien (Atlet)</label>
                                <CustomSelect 
                                    value={form.data.user_id} 
                                    onChange={(val) => form.setData('user_id', val)} 
                                    options={athleteOptions} 
                                    placeholder="-- Pilih Klien --" 
                                    disabled={editMode}
                                    className={editMode ? '' : '!bg-blue-50/50 !text-blue-900 !border-blue-200'}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Tanggal</label>
                                    <input type="date" value={form.data.date} onChange={e => form.setData('date', e.target.value)} className="w-full rounded-xl border border-slate-200 text-sm bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-[#00488b]/20 focus:border-[#00488b] transition-all outline-none" required/>
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
                                <input type="text" placeholder="Cth: Strength Training, Hipertrofi..." value={form.data.training_type} onChange={e => form.setData('training_type', e.target.value)} className="w-full rounded-xl border border-slate-200 text-sm bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-[#00488b]/20 focus:border-[#00488b] transition-all outline-none font-medium" required/>
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
                                <input type="text" placeholder="Cth: Apartemen / Gym Pusat..." value={form.data.location} onChange={e => form.setData('location', e.target.value)} className="w-full rounded-xl border border-slate-200 text-sm bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-[#00488b]/20 focus:border-[#00488b] transition-all outline-none font-medium"/>
                            </div>
                            
                            <div className="pt-3">
                                <button type="submit" disabled={form.processing || !form.data.user_id} className="w-full py-4 bg-[#00488b] text-white font-black text-sm rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#003666] transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                                    {form.processing ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : editMode ? 'Simpan Pembaruan Jadwal' : 'Buat Sesi & Isi Log Training'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL KONFIRMASI HAPUS (KUSTOM) */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-rose-50">
                            <AlertTriangle className="w-8 h-8 text-rose-500" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">Hapus Jadwal?</h3>
                        <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                            Yakin ingin mengosongkan jadwal ini? Seluruh <strong className="text-slate-700">catatan beban & repetisi (log)</strong> di dalamnya juga akan terhapus secara permanen.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteModal({ isOpen: false, id: null })} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors">
                                Batal
                            </button>
                            <button onClick={confirmDelete} className="flex-1 py-3 bg-rose-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-colors">
                                Ya, Hapus!
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}