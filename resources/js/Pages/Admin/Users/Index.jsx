import AppLayout from '@/Layouts/AppLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { 
    Plus, Search, Edit3, Trash2, Shield, X, Lock, User, UserCog, Camera, UploadCloud, Users
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function Index({ users, filters, activeTab }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); 
    const [editUser, setEditUser] = useState(null);
    
    // State & Ref untuk Foto Profil
    const [photoPreview, setPhotoPreview] = useState(null);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        athlete_id: '', 
        password: '',
        profile_photo: null,
        role: activeTab,
        _method: 'POST',     
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(route('admin.users.index'), { search, tab: activeTab }, { preserveState: true, replace: true });
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    // Handler Foto
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_photo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTabChange = (tab) => {
        router.get(route('admin.users.index'), { tab, search: '' });
    };

    const openCreateModal = () => {
        setModalMode('create');
        setEditUser(null);
        setPhotoPreview(null);
        reset();
        clearErrors();
        setData({
            name: '',
            athlete_id: '',
            password: '',
            profile_photo: null,
            role: activeTab,
            _method: 'POST',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setModalMode('edit');
        setEditUser(user);
        setPhotoPreview(user.profile_photo_url || null);
        clearErrors();
        setData({
            name: user.name,
            athlete_id: user.athlete_id,
            password: '', 
            profile_photo: null,
            role: user.role,
            _method: 'PUT', 
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (modalMode === 'create') {
            post(route('admin.users.store'), {
                forceFormData: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            post(route('admin.users.update', editUser.id), {
                forceFormData: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            router.delete(route('admin.users.destroy', id));
        }
    };

    const tabs = [
        { id: 'superadmin', label: 'Superadmin' },
        { id: 'coach', label: 'Coach' },
        { id: 'athlete', label: 'Athlete / Klien' }
    ];

    return (
        <AppLayout title="Manajemen Pengguna">
            <Head title="Manajemen Pengguna" />

            <div className="w-full max-w-[1400px] mx-auto pb-12">
                
                {/* Header Section */}
                <div className="bg-white p-5 md:p-8 rounded-xl border border-slate-200 shadow-sm mb-6 relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6 w-full">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none"></div>
                    
                    <div className="relative z-10 w-full lg:w-auto">
                        <span className="text-[9px] md:text-[10px] font-bold text-[#ff4d00] bg-orange-50 px-3 py-1 rounded-full uppercase tracking-widest mb-2 md:mb-3 inline-block">System & Security</span>
                        <h2 className="text-xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                            Manajemen Pengguna
                        </h2>
                        <p className="text-slate-500 font-medium mt-1 text-xs md:text-sm">Kelola akun dan hak akses pengguna secara terpusat.</p>
                    </div>

                    <div className="relative z-10 w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="relative w-full sm:w-72 shrink-0">
                            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Cari nama atau ID..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] transition-all outline-none shadow-sm touch-manipulation" 
                            />
                        </div>
                        <button 
                            onClick={openCreateModal}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff4d00] text-white px-5 py-2.5 md:py-3 rounded-lg font-bold text-xs md:text-sm shadow-lg shadow-[#ff4d00]/20 hover:bg-[#e64500] transition-all active:scale-95 touch-manipulation shrink-0"
                        >
                            <Plus className="w-4 h-4 md:w-5 md:h-5" /> Tambah Akun
                        </button>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="flex border-b border-slate-200 mb-6 overflow-x-auto custom-scrollbar pb-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`px-6 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                                activeTab === tab.id 
                                ? 'border-[#ff4d00] text-[#ff4d00]' 
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Table Section Desktop */}
                <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="px-6 py-4 w-[40%]">Nama Lengkap</th>
                                    <th className="px-6 py-4 w-[25%]">Login ID</th>
                                    <th className="px-6 py-4 text-center w-[20%]">Role</th>
                                    <th className="px-6 py-4 text-right w-[15%]">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4 align-middle">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-50 text-[#ff4d00] flex items-center justify-center font-bold text-sm border border-orange-100 shadow-sm overflow-hidden">
                                                        {user.profile_photo_url ? (
                                                            <img src={user.profile_photo_url} alt={user.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            user.name.substring(0, 2).toUpperCase()
                                                        )}
                                                    </div>
                                                    <span className="font-bold text-slate-800 text-sm group-hover:text-[#ff4d00] transition-colors">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-middle font-mono text-slate-500 text-xs font-medium">
                                                {user.athlete_id}
                                            </td>
                                            <td className="px-6 py-4 align-middle text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
                                                    user.role === 'superadmin' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                    user.role === 'coach' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    'bg-orange-50 text-[#ff4d00] border-orange-100'
                                                }`}>
                                                    <Shield className="w-3 h-3"/> {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 align-middle text-right">
                                                <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => openEditModal(user)} 
                                                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                        title="Edit Pengguna"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(user.id)} 
                                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                        title="Hapus Pengguna"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-20 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="p-4 bg-slate-50 rounded-full mb-3">
                                                    <Users className="w-8 h-8 text-slate-300" />
                                                </div>
                                                <h3 className="text-sm font-bold text-slate-700">Tidak ada pengguna ditemukan</h3>
                                                <p className="text-xs text-slate-500 mt-1 font-medium">Coba sesuaikan kata kunci pencarian atau ganti tab.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden flex flex-col gap-3">
                    {users.data.length > 0 ? (
                        users.data.map((user) => (
                            <div key={user.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-50 text-[#ff4d00] flex items-center justify-center font-bold text-base border border-orange-100 shadow-sm overflow-hidden">
                                            {user.profile_photo_url ? (
                                                <img src={user.profile_photo_url} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                user.name.substring(0, 2).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm">{user.name}</h3>
                                            <p className="font-mono text-slate-500 text-xs mt-0.5">{user.athlete_id}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border ${
                                            user.role === 'superadmin' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                            user.role === 'coach' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            'bg-orange-50 text-[#ff4d00] border-orange-100'
                                        }`}>
                                            <Shield className="w-3 h-3"/> {user.role}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                    <button 
                                        onClick={() => openEditModal(user)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors border border-slate-200 hover:border-amber-200"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" /> Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user.id)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors border border-slate-200 hover:border-rose-200"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white p-10 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center">
                            <div className="p-4 bg-slate-50 rounded-full mb-3">
                                <Users className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-700">Tidak ada pengguna</h3>
                            <p className="text-xs text-slate-500 mt-1 font-medium">Coba sesuaikan pencarian.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {users.links && users.links.length > 3 && (
                    <div className="mt-6 flex justify-center">
                        <div className="inline-flex gap-1 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm">
                            {users.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-bold rounded-md transition-all ${
                                        link.active 
                                        ? 'bg-[#ff4d00] text-white shadow-md shadow-[#ff4d00]/20' 
                                        : link.url 
                                            ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' 
                                            : 'text-slate-300 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
                        
                        <div className="px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="font-bold text-base md:text-lg text-slate-800 flex items-center gap-2">
                                    <UserCog className="w-4 h-4 md:w-5 md:h-5 text-[#ff4d00]" />
                                    {modalMode === 'create' ? 'Tambah Akun' : 'Edit Akun'}
                                </h3>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-0.5">
                                    {modalMode === 'create' ? 'Buat akun pengguna baru.' : 'Ubah informasi akun pengguna.'}
                                </p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-lg hover:bg-rose-50 touch-manipulation">
                                <X className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4 md:space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            
                            <div className="flex flex-col items-center mb-2">
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-dashed border-slate-300 hover:border-[#ff4d00] bg-slate-50 hover:bg-orange-50/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group shadow-sm touch-manipulation"
                                >
                                    {photoPreview ? (
                                        <>
                                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center text-slate-400 group-hover:text-[#ff4d00]">
                                            <UploadCloud className="w-5 h-5 md:w-6 md:h-6 mb-1" />
                                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-0.5 md:mt-1">Photo</span>
                                        </div>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
                                {errors.profile_photo && <p className="text-rose-500 text-[10px] md:text-xs mt-2 font-bold">{errors.profile_photo}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Role / Jabatan</label>
                                <select
                                    className="block w-full px-4 py-3 md:py-2.5 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]/20 transition-all font-medium text-slate-800 outline-none text-xs md:text-sm"
                                    value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                >
                                    <option value="superadmin">Superadmin</option>
                                    <option value="coach">Coach (Pelatih)</option>
                                    <option value="athlete">Athlete / Klien</option>
                                </select>
                                {errors.role && <p className="text-rose-500 text-[10px] md:text-xs mt-1 font-bold">{errors.role}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nama Lengkap</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-slate-400 group-focus-within:text-[#ff4d00] transition-colors" />
                                    </div>
                                    <input 
                                        type="text" 
                                        className="block w-full pl-10 pr-4 py-3 md:py-2.5 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]/20 transition-all font-medium text-slate-800 outline-none text-xs md:text-sm touch-manipulation"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                {errors.name && <p className="text-rose-500 text-[10px] md:text-xs mt-1 font-bold">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Login ID (Username)</label>
                                <input 
                                    type="text" 
                                    className="block w-full px-4 py-3 md:py-2.5 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]/20 transition-all text-xs md:text-sm font-mono text-slate-800 outline-none font-medium disabled:opacity-60 touch-manipulation"
                                    value={data.athlete_id}
                                    onChange={e => setData('athlete_id', e.target.value)}
                                    placeholder="e.g. admin_01"
                                />
                                {errors.athlete_id && <p className="text-rose-500 text-[10px] md:text-xs mt-1 font-bold">{errors.athlete_id}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex justify-between items-end">
                                    Password
                                    {modalMode === 'edit' && <span className="text-slate-400 font-medium normal-case tracking-normal text-[9px]">(Kosongkan jika tidak diganti)</span>}
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-[#ff4d00] transition-colors" />
                                    </div>
                                    <input 
                                        type="password" 
                                        className="block w-full pl-10 pr-4 py-3 md:py-2.5 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]/20 transition-all font-medium text-slate-800 outline-none text-xs md:text-sm touch-manipulation"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && <p className="text-rose-500 text-[10px] md:text-xs mt-1 font-bold">{errors.password}</p>}
                            </div>

                            <div className="flex gap-2 md:gap-3 pt-4 md:pt-6 mt-2 md:mt-4 border-t border-slate-100">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 md:py-2.5 text-slate-500 bg-slate-100 hover:bg-slate-200 font-bold text-xs md:text-sm rounded-lg transition-colors touch-manipulation"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="flex-[2] px-4 py-3 md:py-2.5 bg-[#ff4d00] text-white font-bold text-xs md:text-sm rounded-lg shadow-lg shadow-[#ff4d00]/20 hover:bg-[#e64500] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation"
                                >
                                    {processing && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                                    {processing ? 'Menyimpan...' : (modalMode === 'create' ? 'Buat Akun' : 'Simpan Perubahan')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}