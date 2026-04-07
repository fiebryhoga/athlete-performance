import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { 
    Plus, Search, Edit3, Trash2, Shield, X, Lock, User, UserCog, Camera, UploadCloud 
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function Index({ admins, filters }) {
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
        _method: 'POST',     
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(route('manage-admins.index'), { search }, { preserveState: true, replace: true });
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

    const openCreateModal = () => {
        setModalMode('create');
        setEditUser(null);
        setPhotoPreview(null);
        reset();
        clearErrors();
        setData('_method', 'POST');
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
            _method: 'PUT', 
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (modalMode === 'create') {
            post(route('manage-admins.store'), {
                forceFormData: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            post(route('manage-admins.update', editUser.id), {
                forceFormData: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this admin account?')) {
            router.delete(route('manage-admins.destroy', id));
        }
    };

    return (
        <AdminLayout title="Admin Management">
            <Head title="Admin Management" />

            <div className="w-full max-w-[1400px] mx-auto pb-12">
                
                
                <div className="bg-white p-5 md:p-8 rounded-xl border border-slate-200 shadow-sm mb-6 md:mb-8 relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6 w-full">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none"></div>
                    
                    <div className="relative z-10 w-full lg:w-auto">
                        <span className="text-[9px] md:text-[10px] font-bold text-[#ff4d00] bg-orange-50 px-3 py-1 rounded-full uppercase tracking-widest mb-2 md:mb-3 inline-block">System & Security</span>
                        <h2 className="text-xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                            Admin Management
                        </h2>
                        <p className="text-slate-500 font-medium mt-1 text-xs md:text-sm">Kelola akun dengan hak akses administratif dan akses sistem..</p>
                    </div>

                    <div className="relative z-10 w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="relative w-full sm:w-72 shrink-0">
                            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search by name or ID..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] transition-all outline-none shadow-sm touch-manipulation" 
                            />
                        </div>
                        <button 
                            onClick={openCreateModal}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff4d00] text-white px-5 py-2.5 md:py-3 rounded-lg font-bold text-xs md:text-sm shadow-lg shadow-[#ff4d00]/20 hover:bg-[#e64500] transition-all active:scale-95 touch-manipulation shrink-0"
                        >
                            <Plus className="w-4 h-4 md:w-5 md:h-5" /> Add Admin
                        </button>
                    </div>
                </div>

                
                
                <div className="md:hidden flex flex-col gap-3">
                    {admins.data.length > 0 ? (
                        admins.data.map((user) => (
                            <div key={user.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-[#ff4d00] blur-2xl opacity-5 rounded-full pointer-events-none"></div>
                                
                                <div className="flex justify-between items-start mb-3">
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-bold bg-orange-50 text-[#ff4d00] border border-orange-100 uppercase tracking-widest">
                                        <Shield className="w-3 h-3"/> Administrator
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-50 text-[#ff4d00] flex items-center justify-center font-bold text-lg border border-orange-100 shadow-sm overflow-hidden">
                                        {user.profile_photo_url ? (
                                            <img src={user.profile_photo_url} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            user.name.substring(0, 2).toUpperCase()
                                        )}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-bold text-slate-800 text-base truncate">{user.name}</span>
                                        <span className="font-mono text-slate-500 text-[10px] truncate">ID: {user.athlete_id}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-3 border-t border-slate-100">
                                    <button 
                                        onClick={() => openEditModal(user)} 
                                        className="flex-1 py-2 text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 touch-manipulation"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" /> Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user.id)} 
                                        className="flex-1 py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 touch-manipulation"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center flex flex-col items-center justify-center">
                            <div className="p-3 bg-slate-50 rounded-full mb-3">
                                <Shield className="w-6 h-6 text-slate-300" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-700">No admin accounts found</h3>
                            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query.</p>
                        </div>
                    )}
                </div>

                
                
                <div className="hidden md:flex bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-col w-full">
                    <div className="overflow-x-auto w-full custom-scrollbar">
                        <table className="w-full min-w-[800px] text-left text-sm text-slate-600 whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold tracking-widest text-slate-400">
                                <tr>
                                    <th className="px-6 py-4 w-[40%]">Admin Profile</th>
                                    <th className="px-6 py-4 w-[25%]">Login ID (Username)</th>
                                    <th className="px-6 py-4 text-center w-[20%]">Role Status</th>
                                    <th className="px-6 py-4 text-right w-[15%]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {admins.data.length > 0 ? (
                                    admins.data.map((user) => (
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
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-orange-50 text-[#ff4d00] border border-orange-100 uppercase tracking-widest">
                                                    <Shield className="w-3 h-3"/> Administrator
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 align-middle text-right">
                                                <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => openEditModal(user)} 
                                                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                        title="Edit Admin"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(user.id)} 
                                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                        title="Delete Admin"
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
                                                    <Shield className="w-8 h-8 text-slate-300" />
                                                </div>
                                                <h3 className="text-sm font-bold text-slate-700">No admin accounts found</h3>
                                                <p className="text-xs text-slate-500 mt-1 font-medium">Try adjusting your search query.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
                        
                        <div className="px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="font-bold text-base md:text-lg text-slate-800 flex items-center gap-2">
                                    <UserCog className="w-4 h-4 md:w-5 md:h-5 text-[#ff4d00]" />
                                    {modalMode === 'create' ? 'Add New Admin' : 'Edit Admin'}
                                </h3>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-0.5">
                                    {modalMode === 'create' ? 'Create a new administrative account.' : 'Update administrator details.'}
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
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name</label>
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
                                    disabled={modalMode === 'edit'}
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
        </AdminLayout>
    );
}