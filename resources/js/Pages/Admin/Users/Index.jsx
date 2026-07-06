import AppLayout from '@/Layouts/AppLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { 
    Plus, Search, Edit3, Trash2, Shield, X, Lock, User, UserCog, Camera, UploadCloud, Users, ChevronRight, UserCheck, ArrowUpDown, ArrowUp, ArrowDown, Package
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import GroupList from './Components/GroupList';

export default function Index({ auth, users, filters, activeTab, sports, coachesList, packagesList, groupsList, allAthletes }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); 
    const [editUser, setEditUser] = useState(null);
    
    // State & Ref untuk Foto Profil
    const [photoPreview, setPhotoPreview] = useState(null);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        username: '', 
        password: '',
        profile_photo: null,
        role: activeTab,
        sport_id: '',
        gender: 'L',
        age: '',
        height: '',
        weight: '',
        training_exp_date: '',
        subscription_package_id: '',
        coach_ids: [],
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
        router.get(route('admin.users.index'), { tab }, { preserveState: true, replace: true });
    };

    const handleSort = (field) => {
        let newDirection = 'asc';
        if (filters.sort_field === field) {
            newDirection = filters.sort_direction === 'asc' ? 'desc' : 'asc';
        }
        router.get(route('admin.users.index'), {
            tab: activeTab,
            search: search,
            sort_field: field,
            sort_direction: newDirection,
        }, { preserveState: true, replace: true });
    };

    const SortIcon = ({ field }) => {
        if (filters.sort_field !== field) return <ArrowUpDown className="w-3 h-3 text-slate-300 ml-1 inline-block" />;
        if (filters.sort_direction === 'asc') return <ArrowUp className="w-3 h-3 text-[#ff4d00] ml-1 inline-block" />;
        return <ArrowDown className="w-3 h-3 text-[#ff4d00] ml-1 inline-block" />;
    };

    const openCreateModal = () => {
        setModalMode('create');
        setEditUser(null);
        setPhotoPreview(null);
        reset();
        clearErrors();
        setData({
            name: '',
            username: '',
            password: '',
            profile_photo: null,
            role: activeTab,
            sport_id: '',
            gender: 'L',
            age: '',
            height: '',
            weight: '',
            training_exp_date: '',
            subscription_package_id: '',
            coach_ids: [],
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
            username: user.username,
            password: '', 
            profile_photo: null,
            role: user.role,
            sport_id: user.sport_id || '',
            gender: user.gender || 'L',
            age: user.age || '',
            height: user.height || '',
            weight: user.weight || '',
            training_exp_date: user.training_exp_date || '',
            subscription_package_id: user.subscription_package_id || '',
            coach_ids: user.coaches?.map(c => c.id) || [],
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

    const handleCoachToggle = (coachId) => {
        let newCoachIds = [...data.coach_ids];
        if (newCoachIds.includes(coachId)) {
            newCoachIds = newCoachIds.filter(id => id !== coachId);
        } else {
            if (newCoachIds.length >= 2) {
                alert("Maksimal hanya 2 pelatih (coach) yang dapat dipilih.");
                return;
            }
            newCoachIds.push(coachId);
        }
        setData('coach_ids', newCoachIds);
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            router.delete(route('admin.users.destroy', id));
        }
    };

    const tabs = [
        { id: 'superadmin', label: 'Superadmin' },
        { id: 'coach', label: 'Coach' },
        { id: 'athlete', label: 'Athlete / Klien' },
        { id: 'group', label: 'Grup' }
    ];

    return (
        <AppLayout title={auth.user.role === 'superadmin' ? 'Manajemen Pengguna' : 'Manajemen Klien'}>
            <Head title={auth.user.role === 'superadmin' ? 'Manajemen Pengguna' : 'Manajemen Klien'} />

            <div className="w-full max-w-[1400px] mx-auto pb-12">
                
                {/* Header Section */}
                <div className="bg-white p-5 md:p-8 rounded-xl border border-slate-200 shadow-sm mb-6 relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6 w-full">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none"></div>
                    
                    <div className="relative z-10 w-full lg:w-auto">
                        <span className="text-[9px] md:text-[10px] font-bold text-[#ff4d00] bg-orange-50 px-3 py-1 rounded-full mb-2 md:mb-3 inline-block">System & Security</span>
                        <h2 className="text-xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                            {auth.user.role === 'superadmin' ? 'Manajemen Pengguna' : 'Manajemen Klien'}
                        </h2>
                        <p className="text-slate-500 font-medium mt-1 text-xs md:text-sm">
                            {auth.user.role === 'superadmin' ? 'Kelola akun dan hak akses pengguna secara terpusat.' : 'Kelola data fisik klien yang berada di bawah pantauan Anda.'}
                        </p>
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
                        {auth.user.role === 'superadmin' && (
                            <button 
                                onClick={openCreateModal}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff4d00] text-white px-5 py-2.5 md:py-3 rounded-lg font-bold text-xs md:text-sm shadow-lg shadow-[#ff4d00]/20 hover:bg-[#e64500] transition-all active:scale-95 touch-manipulation shrink-0"
                            >
                                <Plus className="w-4 h-4 md:w-5 md:h-5" /> Tambah Akun
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs Section */}
                {auth.user.role === 'superadmin' && (
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
                )}

                {/* Table Section Desktop */}
                {activeTab === 'group' ? (
                    <GroupList 
                        groups={groupsList} 
                        packages={packagesList} 
                        allAthletes={allAthletes} 
                        coaches={coachesList}
                    />
                ) : (
                <>
                <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500">
                                    <th className="px-6 py-4 w-[40%] cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('name')}>
                                        Nama Lengkap <SortIcon field="name" />
                                    </th>
                                    <th className="px-6 py-4 w-[25%] cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('username')}>
                                        Login ID <SortIcon field="username" />
                                    </th>
                                    <th className="px-6 py-4 text-center w-[20%] cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('role')}>
                                        Role <SortIcon field="role" />
                                    </th>
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
                                                    <div>
                                                        <span className="font-bold text-slate-800 text-sm group-hover:text-[#ff4d00] transition-colors">{user.name}</span>
                                                        {user.role === 'athlete' && (
                                                            <div className="flex flex-col gap-1 mt-1.5">
                                                                {user.package && (
                                                                    <div className="inline-flex items-center gap-1.5 text-[10px] text-teal-700 bg-teal-50/80 px-2 py-0.5 rounded border border-teal-100 font-medium w-fit">
                                                                        <Package className="w-3 h-3" /> Privat ({user.package.name})
                                                                        {user.training_exp_date && <span className="text-rose-500 font-bold ml-1">Exp: {new Date(user.training_exp_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric'})}</span>}
                                                                    </div>
                                                                )}
                                                                {user.groups?.map(g => (
                                                                    <div key={g.id} className="inline-flex items-center gap-1.5 text-[10px] text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-100 font-medium w-fit">
                                                                        <Users className="w-3 h-3" /> Grup: {g.name}
                                                                        {g.package && <span className="opacity-75">({g.package.name})</span>}
                                                                        {g.expiration_date && <span className="text-rose-500 font-bold ml-1">Exp: {new Date(g.expiration_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric'})}</span>}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-middle text-slate-500 text-xs font-medium">
                                                {user.username}
                                            </td>
                                            <td className="px-6 py-4 align-middle text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border ${
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
                                                    {auth.user.role === 'superadmin' && (
                                                        <button 
                                                            onClick={() => handleDelete(user.id)} 
                                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                            title="Hapus Pengguna"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
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
                                            <p className="text-slate-500 text-xs mt-0.5">{user.username}</p>
                                            {user.role === 'athlete' && (
                                                <div className="flex flex-col gap-1 mt-2">
                                                    {user.package && (
                                                        <div className="inline-flex items-center gap-1 text-[9px] text-teal-700 bg-teal-50/80 px-1.5 py-0.5 rounded border border-teal-100 font-medium whitespace-nowrap w-fit">
                                                            <Package className="w-2.5 h-2.5 shrink-0" /> <span className="truncate max-w-[120px]">Privat ({user.package.name})</span>
                                                            {user.training_exp_date && <span className="text-rose-500 font-bold ml-0.5 shrink-0">Exp: {new Date(user.training_exp_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric'})}</span>}
                                                        </div>
                                                    )}
                                                    {user.groups?.map(g => (
                                                        <div key={g.id} className="inline-flex items-center gap-1 text-[9px] text-indigo-700 bg-indigo-50/80 px-1.5 py-0.5 rounded border border-indigo-100 font-medium whitespace-nowrap w-fit">
                                                            <Users className="w-2.5 h-2.5 shrink-0" /> <span className="truncate max-w-[120px]">Grup: {g.name} {g.package && `(${g.package.name})`}</span>
                                                            {g.expiration_date && <span className="text-rose-500 font-bold ml-0.5 shrink-0">Exp: {new Date(g.expiration_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric'})}</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold border ${
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
                                    {auth.user.role === 'superadmin' && (
                                        <button 
                                            onClick={() => handleDelete(user.id)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors border border-slate-200 hover:border-rose-200"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                                        </button>
                                    )}
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
                </>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className={`relative bg-white w-full ${data.role === 'athlete' ? 'max-w-3xl' : 'max-w-md'} rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col`}>
                        
                        <div className="px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10">
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

                        <form onSubmit={handleSubmit} className="flex flex-col max-h-[75vh] overflow-y-auto custom-scrollbar">
                            <div className="p-5 md:p-6 lg:p-8">
                                <div className="flex flex-col items-center mb-6 md:mb-8">
                                <div 
                                    onClick={() => auth.user.role === 'superadmin' && fileInputRef.current?.click()}
                                    className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-dashed flex flex-col items-center justify-center bg-slate-50 overflow-hidden relative group transition-all ${auth.user.role === 'superadmin' ? 'border-slate-300 cursor-pointer hover:border-[#ff4d00] hover:bg-orange-50' : 'border-slate-200 cursor-not-allowed opacity-70'}`}
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
                                            <span className="text-[9px] md:text-[10px] font-bold mt-0.5 md:mt-1">Photo</span>
                                        </div>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
                                {errors.profile_photo && <p className="text-rose-500 text-[10px] md:text-xs mt-2 font-bold">{errors.profile_photo}</p>}
                            </div>

                            <div className={data.role === 'athlete' ? 'grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8' : 'space-y-4 md:space-y-5'}>
                                {/* Account Information Column */}
                                <div className="space-y-4 md:space-y-5">
                                    {data.role === 'athlete' && <h4 className="text-[10px] font-bold text-[#ff4d00] mb-2 border-b border-orange-100 pb-2">Account Information</h4>}
                                    
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 ml-1">Role / Jabatan</label>
                                        <select
                                            className="block w-full px-4 py-3 md:py-2.5 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]/20 transition-all font-medium text-slate-800 outline-none text-xs md:text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                            value={data.role}
                                            onChange={e => setData('role', e.target.value)}
                                            disabled={auth.user.role !== 'superadmin'}
                                        >
                                            <option value="superadmin">Superadmin</option>
                                            <option value="coach">Coach (Pelatih)</option>
                                            <option value="athlete">Athlete / Klien</option>
                                        </select>
                                        {errors.role && <p className="text-rose-500 text-[10px] md:text-xs mt-1 font-bold ml-1">{errors.role}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 ml-1">Nama Lengkap</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <User className="h-4 w-4 text-slate-400 group-focus-within:text-[#ff4d00] transition-colors" />
                                            </div>
                                            <input 
                                                type="text" 
                                                className="block w-full pl-10 pr-4 py-3 md:py-2.5 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]/20 transition-all font-medium text-slate-800 outline-none text-xs md:text-sm touch-manipulation disabled:opacity-60 disabled:cursor-not-allowed"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                placeholder="e.g. John Doe"
                                                disabled={auth.user.role !== 'superadmin'}
                                            />
                                        </div>
                                        {errors.name && <p className="text-rose-500 text-[10px] md:text-xs mt-1 font-bold ml-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 ml-1">Login ID (Username)</label>
                                        <input 
                                            type="text" 
                                            className="block w-full px-4 py-3 md:py-2.5 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]/20 transition-all text-xs md:text-sm text-slate-800 outline-none font-medium disabled:opacity-60 touch-manipulation disabled:cursor-not-allowed"
                                            value={data.username}
                                            onChange={e => setData('username', e.target.value)}
                                            placeholder="e.g. admin_01"
                                            disabled={auth.user.role !== 'superadmin'}
                                        />
                                        {errors.username && <p className="text-rose-500 text-[10px] md:text-xs mt-1 font-bold ml-1">{errors.username}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 ml-1 flex justify-between items-end">
                                            Password
                                            {modalMode === 'edit' && <span className="text-slate-400 font-medium normal-case tracking-normal text-[9px]">(Kosongkan jika tidak diganti)</span>}
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-[#ff4d00] transition-colors" />
                                            </div>
                                            <input 
                                                type="password" 
                                                className="block w-full pl-10 pr-4 py-3 md:py-2.5 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]/20 transition-all font-medium text-slate-800 outline-none text-xs md:text-sm touch-manipulation disabled:opacity-60 disabled:cursor-not-allowed"
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                                placeholder="••••••••"
                                                disabled={auth.user.role !== 'superadmin'}
                                            />
                                        </div>
                                        {errors.password && <p className="text-rose-500 text-[10px] md:text-xs mt-1 font-bold ml-1">{errors.password}</p>}
                                    </div>

                                    {data.role === 'athlete' && (
                                        <>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 ml-1">Sport Category</label>
                                                <div className="relative">
                                                    <select 
                                                        value={data.sport_id} 
                                                        onChange={e => setData('sport_id', e.target.value)} 
                                                        className="w-full px-4 py-2.5 md:py-3 rounded-lg border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] text-xs md:text-sm appearance-none bg-white transition-all outline-none shadow-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                                                        disabled={auth.user.role !== 'superadmin'}
                                                    >
                                                        <option value="">-- Select Sport --</option>
                                                        {sports && sports.map(sport => <option key={sport.id} value={sport.id}>{sport.name}</option>)}
                                                    </select>
                                                    <ChevronRight className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 ml-1">Assign Coaches (Max 2)</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {coachesList && coachesList.map((coach) => (
                                                        <label key={coach.id} onClick={() => auth.user.role === 'superadmin' && handleCoachToggle(coach.id)} className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors text-xs md:text-sm font-medium select-none ${auth.user.role === 'superadmin' ? 'cursor-pointer hover:bg-slate-50' : 'cursor-not-allowed opacity-60'} ${data.coach_ids.includes(coach.id) ? 'border-[#ff4d00] bg-orange-50 text-[#ff4d00]' : 'border-slate-200 text-slate-700'}`}>
                                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${data.coach_ids.includes(coach.id) ? 'bg-[#ff4d00] border-[#ff4d00]' : 'border-slate-300'}`}>
                                                                {data.coach_ids.includes(coach.id) && <UserCheck className="w-3 h-3 text-white" />}
                                                            </div>
                                                            {coach.name}
                                                        </label>
                                                    ))}
                                                </div>
                                                {errors.coach_ids && <p className="text-rose-500 text-[10px] md:text-xs mt-1 font-bold ml-1">{errors.coach_ids}</p>}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Physical Metrics Column (Only for Athlete) */}
                                {data.role === 'athlete' && (
                                    <div className="space-y-4 md:space-y-5 border-t border-slate-100 pt-5 md:pt-0 md:border-t-0 md:border-l md:pl-6 lg:pl-8">
                                        <h4 className="text-[10px] font-bold text-[#ff4d00] mb-2 border-b border-orange-100 pb-2">Physical Metrics</h4>
                                        
                                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 ml-1">Gender</label>
                                                <div className="relative">
                                                    <select 
                                                        value={data.gender} 
                                                        onChange={e => setData('gender', e.target.value)} 
                                                        className="w-full px-4 py-2.5 md:py-3 rounded-lg border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] text-xs md:text-sm appearance-none bg-white transition-all outline-none shadow-sm font-medium"
                                                    >
                                                        <option value="L">Male</option>
                                                        <option value="P">Female</option>
                                                    </select>
                                                    <ChevronRight className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 ml-1">Age</label>
                                                <input 
                                                    type="number" 
                                                    value={data.age} 
                                                    onChange={e => setData('age', e.target.value)} 
                                                    className="w-full px-4 py-2.5 md:py-3 rounded-lg border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] text-xs md:text-sm transition-all outline-none font-medium shadow-sm" 
                                                    placeholder="e.g. 25" 
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 ml-1">Height (cm)</label>
                                                <input 
                                                    type="number" 
                                                    step="0.01" 
                                                    value={data.height} 
                                                    onChange={e => setData('height', e.target.value)} 
                                                    className="w-full px-4 py-2.5 md:py-3 rounded-lg border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] text-xs md:text-sm transition-all outline-none font-medium shadow-sm" 
                                                    placeholder="e.g. 175" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 ml-1">Weight (kg)</label>
                                                <input 
                                                    type="number" 
                                                    step="0.01" 
                                                    value={data.weight} 
                                                    onChange={e => setData('weight', e.target.value)} 
                                                    className="w-full px-4 py-2.5 md:py-3 rounded-lg border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] text-xs md:text-sm transition-all outline-none font-medium shadow-sm" 
                                                    placeholder="e.g. 70" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 ml-1">Masa Aktif Latihan (Opsional)</label>
                                                <input 
                                                    type="date" 
                                                    value={data.training_exp_date} 
                                                    onChange={e => setData('training_exp_date', e.target.value)} 
                                                    className="w-full px-4 py-2.5 md:py-3 rounded-lg border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] text-xs md:text-sm transition-all outline-none font-medium shadow-sm" 
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 ml-1">Paket Latihan (Opsional)</label>
                                            <select 
                                                value={data.subscription_package_id} 
                                                onChange={e => setData('subscription_package_id', e.target.value)} 
                                                className="w-full px-4 py-2.5 md:py-3 rounded-lg border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] text-xs md:text-sm transition-all outline-none font-medium shadow-sm"
                                            >
                                                <option value="">-- Tidak Ada / Kosongkan --</option>
                                                {packagesList?.map(pkg => (
                                                    <option key={pkg.id} value={pkg.id}>
                                                        {pkg.name} ({pkg.session_count} Sesi)
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="bg-slate-50 p-3 md:p-4 rounded-lg border border-slate-100 flex gap-2.5 md:gap-3 mt-4">
                                            <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                            <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-relaxed">
                                                Physical data is used for performance baselines and body composition algorithms.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            </div>
                            
                            {/* Submit Area */}
                            <div className="p-5 md:p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 md:gap-3 sticky bottom-0 z-10">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-700 font-bold text-sm rounded-lg transition-colors touch-manipulation"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-[#ff4d00] text-white font-bold text-sm rounded-lg shadow-lg shadow-[#ff4d00]/20 hover:bg-[#e64500] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation"
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