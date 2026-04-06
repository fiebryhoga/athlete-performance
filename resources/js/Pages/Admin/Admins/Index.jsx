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

            {/* --- HEADER UTAMA --- */}
            <div className="bg-white p-6 md:p-8 rounded-lg border border-slate-200 shadow-sm mb-8 relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none"></div>
                
                <div className="relative z-10 w-full lg:w-auto">
                    <span className="text-[10px] font-bold text-purple-500 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">System & Security</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        Admin Management
                    </h2>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Manage accounts with administrative privileges and system access.</p>
                </div>

                <div className="relative z-10 w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search by name or ID..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00488b]/20 focus:border-[#00488b] transition-all outline-none shadow-sm" 
                        />
                    </div>
                    <button 
                        onClick={openCreateModal}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff4d00] text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-[#003666] transition-all active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> Add Admin
                    </button>
                </div>
            </div>

            {/* --- TABEL DATA --- */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col animate-in fade-in duration-300">
                <div className="overflow-x-auto w-full custom-scrollbar">
                    <table className="min-w-full text-left text-sm text-slate-600 whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold tracking-widest text-slate-400">
                            <tr>
                                <th className="px-6 py-4">Admin Profile</th>
                                <th className="px-6 py-4">Login ID (Username)</th>
                                <th className="px-6 py-4 text-center">Role Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {admins.data.length > 0 ? (
                                admins.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 align-middle">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm border border-purple-100 shadow-sm overflow-hidden">
                                                    {user.profile_photo_url ? (
                                                        <img src={user.profile_photo_url} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        user.name.substring(0, 2).toUpperCase()
                                                    )}
                                                </div>
                                                <span className="font-bold text-slate-800 text-sm group-hover:text-[#00488b] transition-colors">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-middle font-mono text-slate-500 text-xs">
                                            {user.athlete_id}
                                        </td>
                                        <td className="px-6 py-4 align-middle text-center">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100 uppercase tracking-widest">
                                                <Shield className="w-3 h-3"/> Administrator
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 align-middle text-right">
                                            <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => openEditModal(user)} 
                                                    className="p-2 text-slate-400 hover:text-[#00488b] hover:bg-blue-50 rounded-lg transition-colors"
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

            {/* --- MODAL FORM --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                    <UserCog className="w-5 h-5 text-[#00488b]" />
                                    {modalMode === 'create' ? 'Add New Admin' : 'Edit Admin'}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                    {modalMode === 'create' ? 'Create a new administrative account.' : 'Update administrator details.'}
                                </p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-lg hover:bg-rose-50">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
                            
                            {/* PHOTO UPLOAD AREA */}
                            <div className="flex flex-col items-center mb-6">
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative w-24 h-24 rounded-full border-2 border-dashed border-slate-300 hover:border-[#00488b] bg-slate-50 hover:bg-blue-50/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group shadow-sm"
                                >
                                    {photoPreview ? (
                                        <>
                                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="w-6 h-6 text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center text-slate-400 group-hover:text-[#00488b]">
                                            <UploadCloud className="w-6 h-6 mb-1" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Photo</span>
                                        </div>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
                                {errors.profile_photo && <p className="text-rose-500 text-xs mt-2 font-bold">{errors.profile_photo}</p>}
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-slate-400 group-focus-within:text-[#00488b] transition-colors" />
                                    </div>
                                    <input 
                                        type="text" 
                                        className="block w-full pl-10 pr-4 py-2.5 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-[#00488b] focus:ring-2 focus:ring-[#00488b]/20 transition-all font-medium text-slate-800 outline-none text-sm"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                {errors.name && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.name}</p>}
                            </div>

                            {/* Username ID */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Login ID (Username)</label>
                                <input 
                                    type="text" 
                                    className="block w-full px-4 py-2.5 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-[#00488b] focus:ring-2 focus:ring-[#00488b]/20 transition-all text-sm font-mono text-slate-800 outline-none font-medium disabled:opacity-60"
                                    value={data.athlete_id}
                                    onChange={e => setData('athlete_id', e.target.value)}
                                    placeholder="e.g. admin_01"
                                    disabled={modalMode === 'edit'}
                                />
                                {errors.athlete_id && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.athlete_id}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex justify-between items-end">
                                    Password
                                    {modalMode === 'edit' && <span className="text-slate-400 font-medium normal-case tracking-normal">(leave blank to keep)</span>}
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-[#00488b] transition-colors" />
                                    </div>
                                    <input 
                                        type="password" 
                                        className="block w-full pl-10 pr-4 py-2.5 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-[#00488b] focus:ring-2 focus:ring-[#00488b]/20 transition-all font-medium text-slate-800 outline-none text-sm"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.password}</p>}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-6 mt-4 border-t border-slate-100">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="flex-[2] px-4 py-2.5 bg-[#ff4d00] text-white font-bold text-sm rounded-lg shadow-lg shadow-blue-900/20 hover:bg-[#003666] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {processing && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                                    {processing ? 'Saving...' : (modalMode === 'create' ? 'Create Account' : 'Update Account')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}