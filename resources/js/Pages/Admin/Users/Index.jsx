import AppLayout from '@/Layouts/AppLayout';
import { Head, router, useForm, Link } from '@inertiajs/react';
import { 
    Plus, Search, Edit3, Trash2, Shield, X, Lock, User, UserCog, Camera, UploadCloud, Users, ChevronRight, UserCheck, ArrowUpDown, ArrowUp, ArrowDown, Package, Building2, Dumbbell
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import GroupList from './Components/GroupList';
import PageHeader from '@/Components/Common/PageHeader';

export default function Index({ auth, users, filters, activeTab, tabCounts, sports, coachesList, packagesList, groupsList, allAthletes }) {
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
        role: activeTab === 'group' ? 'athlete' : activeTab,
        is_gym_guard: false,
        gym_fee: '',
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

    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        
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
        if (filters.sort_direction === 'asc') return <ArrowUp className="w-3 h-3 text-orange-500 ml-1 inline-block" />;
        return <ArrowDown className="w-3 h-3 text-orange-500 ml-1 inline-block" />;
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
            role: activeTab === 'group' ? 'athlete' : activeTab,
            is_gym_guard: false,
            gym_fee: '',
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
            is_gym_guard: user.is_gym_guard || false,
            gym_fee: user.gym_fee || '',
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

            <div className="space-y-5 pb-8 max-w-[1600px] mx-auto">
                
                {/* Modern PageHeader */}
                <PageHeader
                    title={auth.user.role === 'superadmin' ? 'Manajemen Pengguna' : 'Manajemen Klien'}
                    description={auth.user.role === 'superadmin' 
                        ? 'Kelola akun pengguna, hak akses, data privat klien, dan penugasan pelatih secara terpusat.' 
                        : 'Kelola data fisik klien yang berada di bawah pendampingan dan pantauan Anda.'
                    }
                    actions={
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Search Input */}
                            <div className="relative w-48 sm:w-56">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari nama atau username..."
                                    className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all shadow-2xs"
                                />
                                {search && (
                                    <button 
                                        type="button" 
                                        onClick={() => setSearch('')} 
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>

                            {/* Bulk Add Button for Superadmin & Athlete Tab */}
                            {auth.user.role === 'superadmin' && activeTab === 'athlete' && (
                                <Link 
                                    href={route('admin.users.bulkCreate')}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md text-xs font-semibold shadow-2xs transition-all"
                                >
                                    <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Bulk Add Klien</span>
                                </Link>
                            )}

                            {/* Tambah Akun Button */}
                            {auth.user.role === 'superadmin' && activeTab !== 'group' && (
                                <button 
                                    onClick={openCreateModal}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Tambah Akun</span>
                                </button>
                            )}
                        </div>
                    }
                />

                {/* Modern Segmented Navigation Tabs */}
                {auth.user.role === 'superadmin' && (
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                        <div className="inline-flex p-1 bg-slate-100/90 rounded-lg border border-slate-200/60 gap-1 overflow-x-auto custom-scrollbar">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                const count = tabCounts ? tabCounts[tab.id] : null;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                                            isActive 
                                                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/50' 
                                                : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                        {count !== null && count !== undefined && (
                                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                                isActive ? 'bg-orange-100 text-orange-700' : 'bg-slate-200/70 text-slate-600'
                                            }`}>
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
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
                <div className="hidden md:block bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="px-5 py-3 w-[40%] cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('name')}>
                                        Nama Lengkap <SortIcon field="name" />
                                    </th>
                                    <th className="px-5 py-3 w-[25%] cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('username')}>
                                        Login ID (Username) <SortIcon field="username" />
                                    </th>
                                    <th className="px-5 py-3 text-center w-[20%] cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('role')}>
                                        Role / Status <SortIcon field="role" />
                                    </th>
                                    <th className="px-5 py-3 text-right w-[15%]">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/70 transition-colors group">
                                            <td className="px-5 py-3.5 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200/80 shadow-2xs overflow-hidden">
                                                        {user.profile_photo_url ? (
                                                            <img src={user.profile_photo_url} alt={user.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            user.name.substring(0, 2).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-slate-800 text-xs group-hover:text-orange-600 transition-colors">{user.name}</span>
                                                        {user.role === 'athlete' && (
                                                            <div className="flex flex-wrap items-center gap-1 mt-1">
                                                                {user.sport && (
                                                                    <span className="text-[10px] text-slate-500 font-medium mr-1">
                                                                        {user.sport.name}
                                                                    </span>
                                                                )}
                                                                {user.package && (
                                                                    <div className="inline-flex items-center gap-1 text-[9.5px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/60 font-medium">
                                                                        <Package className="w-2.5 h-2.5" /> Privat ({user.package.name})
                                                                        {user.training_exp_date && <span className="text-rose-600 font-bold ml-1">Exp: {new Date(user.training_exp_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric'})}</span>}
                                                                    </div>
                                                                )}
                                                                {user.groups?.map(g => (
                                                                    <div key={g.id} className="inline-flex items-center gap-1 text-[9.5px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/60 font-medium">
                                                                        <Users className="w-2.5 h-2.5" /> {g.name}
                                                                        {g.package && <span className="opacity-75">({g.package.name})</span>}
                                                                        {g.expiration_date && <span className="text-rose-600 font-bold ml-1">Exp: {new Date(g.expiration_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric'})}</span>}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 align-middle text-slate-600 text-xs font-mono">
                                                {user.username}
                                            </td>
                                            <td className="px-5 py-3.5 align-middle text-center">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                                                    user.role === 'superadmin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200/70' :
                                                    user.role === 'coach' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70' :
                                                    'bg-orange-50 text-orange-700 border-orange-200/70'
                                                }`}>
                                                    <Shield className="w-2.5 h-2.5"/> {user.role}
                                                </span>
                                                {user.role === 'coach' && user.is_gym_guard && (
                                                    <div className="mt-1">
                                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border bg-amber-50 text-amber-700 border-amber-200/70">
                                                            <Building2 className="w-2.5 h-2.5" /> Penjaga Gym
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5 align-middle text-right">
                                                <div className="flex justify-end items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => openEditModal(user)} 
                                                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors border border-transparent hover:border-amber-200"
                                                        title="Edit Pengguna"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </button>
                                                    {auth.user.role === 'superadmin' && (
                                                        <button 
                                                            onClick={() => handleDelete(user.id)} 
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors border border-transparent hover:border-rose-200"
                                                            title="Hapus Pengguna"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-16 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="p-3 bg-slate-50 rounded-full mb-2 border border-slate-100">
                                                    <Users className="w-6 h-6 text-slate-300" />
                                                </div>
                                                <h3 className="text-xs font-bold text-slate-700">Tidak ada pengguna ditemukan</h3>
                                                <p className="text-[11px] text-slate-400 mt-0.5">Coba sesuaikan kata kunci pencarian atau ganti tab peran.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden flex flex-col gap-2.5">
                    {users.data.length > 0 ? (
                        users.data.map((user) => (
                            <div key={user.id} className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200 shadow-2xs overflow-hidden">
                                            {user.profile_photo_url ? (
                                                <img src={user.profile_photo_url} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                user.name.substring(0, 2).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-xs">{user.name}</h3>
                                            <p className="text-slate-400 text-[11px] font-mono mt-0.5">{user.username}</p>
                                            {user.role === 'athlete' && (
                                                <div className="flex flex-col gap-1 mt-1.5">
                                                    {user.package && (
                                                        <div className="inline-flex items-center gap-1 text-[9px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/60 font-medium whitespace-nowrap w-fit">
                                                            <Package className="w-2.5 h-2.5 shrink-0" /> <span className="truncate max-w-[130px]">Privat ({user.package.name})</span>
                                                            {user.training_exp_date && <span className="text-rose-600 font-bold ml-0.5 shrink-0">Exp: {new Date(user.training_exp_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric'})}</span>}
                                                        </div>
                                                    )}
                                                    {user.groups?.map(g => (
                                                        <div key={g.id} className="inline-flex items-center gap-1 text-[9px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/60 font-medium whitespace-nowrap w-fit">
                                                            <Users className="w-2.5 h-2.5 shrink-0" /> <span className="truncate max-w-[130px]">{g.name}</span>
                                                            {g.expiration_date && <span className="text-rose-600 font-bold ml-0.5 shrink-0">Exp: {new Date(g.expiration_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric'})}</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] font-bold border ${
                                            user.role === 'superadmin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200/70' :
                                            user.role === 'coach' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70' :
                                            'bg-orange-50 text-orange-700 border-orange-200/70'
                                        }`}>
                                            <Shield className="w-2.5 h-2.5"/> {user.role}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                    <button 
                                        onClick={() => openEditModal(user)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 rounded-md transition-colors border border-slate-200 hover:border-amber-200"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" /> Edit
                                    </button>
                                    {auth.user.role === 'superadmin' && (
                                        <button 
                                            onClick={() => handleDelete(user.id)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-rose-50 hover:text-rose-700 rounded-md transition-colors border border-slate-200 hover:border-rose-200"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white p-8 rounded-xl border border-slate-200/90 text-center">
                            <div className="p-3 bg-slate-50 rounded-full mb-2 border border-slate-100 inline-block">
                                <Users className="w-5 h-5 text-slate-300" />
                            </div>
                            <h3 className="text-xs font-bold text-slate-700">Tidak ada pengguna</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">Coba sesuaikan kata kunci pencarian.</p>
                        </div>
                    )}
                </div>

                {/* Clean Modern Pagination */}
                {users.links && users.links.length > 3 && (
                    <div className="mt-4 flex justify-center">
                        <div className="inline-flex gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                            {users.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                    disabled={!link.url}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                                        link.active 
                                        ? 'bg-orange-500 text-white shadow-2xs' 
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
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className={`relative bg-white w-full ${data.role === 'athlete' ? 'max-w-3xl' : 'max-w-md'} rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto flex flex-col`}>
                        
                        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/70 sticky top-0 z-10">
                            <div>
                                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                    <UserCog className="w-4 h-4 text-orange-500" />
                                    {modalMode === 'create' ? 'Tambah Akun Pengguna' : 'Edit Akun Pengguna'}
                                </h3>
                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                    {modalMode === 'create' ? 'Isi formulir untuk menambahkan akun baru ke sistem.' : 'Perbarui data akun pengguna.'}
                                </p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col max-h-[75vh] overflow-y-auto custom-scrollbar">
                            <div className="p-5 sm:p-6">
                                <div className="flex flex-col items-center mb-6">
                                    <div 
                                        onClick={() => auth.user.role === 'superadmin' && fileInputRef.current?.click()}
                                        className={`w-20 h-20 rounded-full border-2 border-dashed flex flex-col items-center justify-center bg-slate-50 overflow-hidden relative group transition-all ${auth.user.role === 'superadmin' ? 'border-slate-300 cursor-pointer hover:border-orange-500 hover:bg-orange-50/50' : 'border-slate-200 cursor-not-allowed opacity-70'}`}
                                    >
                                        {photoPreview ? (
                                            <>
                                                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Camera className="w-5 h-5 text-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center text-slate-400 group-hover:text-orange-500">
                                                <UploadCloud className="w-5 h-5 mb-1" />
                                                <span className="text-[10px] font-bold">Foto Profil</span>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
                                    {errors.profile_photo && <p className="text-rose-500 text-[11px] mt-1.5 font-semibold">{errors.profile_photo}</p>}
                                </div>

                                <div className={data.role === 'athlete' ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : 'space-y-4'}>
                                    {/* Account Information Column */}
                                    <div className="space-y-3.5">
                                        {data.role === 'athlete' && <h4 className="text-xs font-bold text-slate-900 pb-1.5 border-b border-slate-100">Informasi Akun</h4>}
                                        
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">Role / Peran</label>
                                            <select
                                                className="block w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all font-medium text-slate-800 outline-none text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                                                value={data.role}
                                                onChange={e => setData('role', e.target.value)}
                                                disabled={auth.user.role !== 'superadmin'}
                                            >
                                                <option value="superadmin">Superadmin</option>
                                                <option value="coach">Coach (Pelatih)</option>
                                                <option value="athlete">Athlete / Klien</option>
                                            </select>
                                            {errors.role && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.role}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <User className="h-3.5 w-3.5 text-slate-400" />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    className="block w-full pl-8 pr-3 py-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all font-medium text-slate-800 outline-none text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    placeholder="Nama lengkap..."
                                                    disabled={auth.user.role !== 'superadmin'}
                                                />
                                            </div>
                                            {errors.name && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">Login ID (Username)</label>
                                            <input 
                                                type="text" 
                                                className="block w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-xs text-slate-800 outline-none font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                                                value={data.username}
                                                onChange={e => setData('username', e.target.value)}
                                                placeholder="Username login..."
                                                disabled={auth.user.role !== 'superadmin'}
                                            />
                                            {errors.username && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.username}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1 flex justify-between items-end">
                                                Password
                                                {modalMode === 'edit' && <span className="text-slate-400 font-normal text-[10px]">(Kosongkan bila tidak diganti)</span>}
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                                                </div>
                                                <input 
                                                    type="password" 
                                                    className="block w-full pl-8 pr-3 py-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all font-medium text-slate-800 outline-none text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                                                    value={data.password}
                                                    onChange={e => setData('password', e.target.value)}
                                                    placeholder="••••••••"
                                                    disabled={auth.user.role !== 'superadmin'}
                                                />
                                            </div>
                                            {errors.password && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.password}</p>}
                                        </div>

                                        {/* Gym Guard Toggle (Only for Coach) */}
                                        {data.role === 'coach' && (
                                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                                                <label className="flex items-center gap-2.5 cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={data.is_gym_guard}
                                                        onChange={e => setData('is_gym_guard', e.target.checked)}
                                                        className="w-4 h-4 rounded text-orange-500 border-slate-300 focus:ring-orange-400"
                                                    />
                                                    <div>
                                                        <span className="text-xs font-bold text-slate-800">Petugas Jaga Gym</span>
                                                        <p className="text-[10px] text-slate-400">Izinkan akses absensi & scan gym member.</p>
                                                    </div>
                                                </label>
                                            </div>
                                        )}
                                    </div>

                                    {/* Athlete Specific Column */}
                                    {data.role === 'athlete' && (
                                        <div className="space-y-3.5">
                                            <h4 className="text-xs font-bold text-slate-900 pb-1.5 border-b border-slate-100">Profil & Langganan</h4>
                                            
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Cabang Olahraga</label>
                                                    <select
                                                        className="block w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs text-slate-800 outline-none"
                                                        value={data.sport_id}
                                                        onChange={e => setData('sport_id', e.target.value)}
                                                    >
                                                        <option value="">Pilih Cabor...</option>
                                                        {sports?.map(s => (
                                                            <option key={s.id} value={s.id}>{s.name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                                                    <select
                                                        className="block w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs text-slate-800 outline-none"
                                                        value={data.gender}
                                                        onChange={e => setData('gender', e.target.value)}
                                                    >
                                                        <option value="L">Laki-laki</option>
                                                        <option value="P">Perempuan</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-2.5">
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Usia (thn)</label>
                                                    <input 
                                                        type="number" 
                                                        className="block w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs text-slate-800 outline-none"
                                                        value={data.age}
                                                        onChange={e => setData('age', e.target.value)}
                                                        placeholder="18"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-700 mb-1">TB (cm)</label>
                                                    <input 
                                                        type="number" 
                                                        step="0.1"
                                                        className="block w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs text-slate-800 outline-none"
                                                        value={data.height}
                                                        onChange={e => setData('height', e.target.value)}
                                                        placeholder="175"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-700 mb-1">BB (kg)</label>
                                                    <input 
                                                        type="number" 
                                                        step="0.1"
                                                        className="block w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs text-slate-800 outline-none"
                                                        value={data.weight}
                                                        onChange={e => setData('weight', e.target.value)}
                                                        placeholder="68"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">Paket Latihan Privat</label>
                                                <select
                                                    className="block w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs text-slate-800 outline-none"
                                                    value={data.subscription_package_id}
                                                    onChange={e => setData('subscription_package_id', e.target.value)}
                                                >
                                                    <option value="">Tanpa Paket Privat</option>
                                                    {packagesList?.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name} ({p.session_count ? `${p.session_count} sesi` : 'Membership'})</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">Kedaluwarsa Paket Privat</label>
                                                <input 
                                                    type="date" 
                                                    className="block w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs text-slate-800 outline-none"
                                                    value={data.training_exp_date}
                                                    onChange={e => setData('training_exp_date', e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex justify-between">
                                                    <span>Pelatih Pendamping</span>
                                                    <span className="text-[10px] text-slate-400 font-normal">(Maksimal 2 pelatih)</span>
                                                </label>
                                                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-md border border-slate-200 custom-scrollbar">
                                                    {coachesList?.map(c => {
                                                        const isSelected = data.coach_ids.includes(c.id);
                                                        return (
                                                            <button
                                                                key={c.id}
                                                                type="button"
                                                                onClick={() => handleCoachToggle(c.id)}
                                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold border transition-all ${
                                                                    isSelected 
                                                                        ? 'bg-orange-500 text-white border-orange-500 shadow-2xs' 
                                                                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                                                                }`}
                                                            >
                                                                {isSelected && <UserCheck className="w-3 h-3" />}
                                                                <span>{c.name}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-2 sticky bottom-0">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-md shadow-2xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
                                >
                                    {processing ? 'Menyimpan...' : (modalMode === 'create' ? 'Simpan Pengguna' : 'Perbarui Pengguna')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}