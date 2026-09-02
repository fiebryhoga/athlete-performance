import AppLayout from '@/Layouts/AppLayout';
import { Head, router, Link } from '@inertiajs/react';
import { 
    Plus, Search, Edit3, Trash2, Shield, X, UploadCloud, Users, UsersRound, ChevronRight, 
    ArrowUpDown, ArrowUp, ArrowDown, Package, Building2, UserCheck, Dumbbell, ShieldCheck 
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import GroupList from './Components/GroupList';
import SharedPackageList from './Components/SharedPackageList';
import PageHeader from '@/Components/Common/PageHeader';

export default function Index({ auth, users, filters, activeTab, tabCounts, sports, coachesList, packagesList, groupsList, sharedPackagesList, allAthletes }) {
    const [search, setSearch] = useState(filters.search || '');
    const groupListRef = useRef(null);
    const sharedPackageListRef = useRef(null);
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

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            router.delete(route('admin.users.destroy', id));
        }
    };

    const tabs = [
        { id: 'superadmin', label: 'Superadmin' },
        { id: 'coach', label: 'Coach' },
        { id: 'athlete', label: 'Athlete / Klien' },
        { id: 'group', label: 'Grup' },
        { id: 'shared_package', label: 'Paket Bersama' }
    ];

    return (
        <AppLayout title={auth.user.role === 'superadmin' ? 'Manajemen Pengguna' : 'Manajemen Klien'}>
            <Head title={auth.user.role === 'superadmin' ? 'Manajemen Pengguna' : 'Manajemen Klien'} />

            <div className="space-y-4 pb-8 max-w-[1600px] mx-auto">
                
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
                                    placeholder={activeTab === 'group' ? "Cari nama grup..." : "Cari nama atau username..."}
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

                            {/* Tambah Akun Button (Dedicated Page) */}
                            {auth.user.role === 'superadmin' && activeTab !== 'group' && activeTab !== 'shared_package' && (
                                <Link 
                                    href={route('admin.users.create', { role: activeTab === 'group' || activeTab === 'shared_package' ? 'athlete' : activeTab })}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Tambah Akun</span>
                                </Link>
                            )}

                            {/* Buat Grup Button */}
                            {auth.user.role === 'superadmin' && activeTab === 'group' && (
                                <button 
                                    onClick={() => groupListRef.current?.openCreateModal()}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Buat Grup Baru</span>
                                </button>
                            )}

                            {/* Buat Paket Bersama Button */}
                            {auth.user.role === 'superadmin' && activeTab === 'shared_package' && (
                                <button 
                                    onClick={() => sharedPackageListRef.current?.openCreateModal()}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-xs font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Tambah</span>
                                </button>
                            )}
                        </div>
                    }
                />

                {/* Modern Segmented Navigation Tabs */}
                {auth.user.role === 'superadmin' && (
                    <div className="flex items-center justify-between">
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
                        ref={groupListRef}
                        groups={groupsList} 
                        packages={packagesList} 
                        allAthletes={allAthletes} 
                        coaches={coachesList}
                        searchTerm={search}
                    />
                ) : activeTab === 'shared_package' ? (
                    <SharedPackageList 
                        ref={sharedPackageListRef}
                        sharedPackages={sharedPackagesList} 
                        packages={packagesList} 
                        allAthletes={allAthletes} 
                        coaches={coachesList}
                        searchTerm={search}
                    />
                ) : (
                <>
                <div className="hidden md:block bg-white rounded-md border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="px-4 py-2.5 cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('name')}>
                                        Nama Lengkap <SortIcon field="name" />
                                    </th>
                                    <th className="px-3 py-2.5 cursor-pointer hover:bg-slate-100/50 transition-colors" onClick={() => handleSort('username')}>
                                        Login ID <SortIcon field="username" />
                                    </th>

                                    {/* Kolom Khusus Athlete */}
                                    {activeTab === 'athlete' && (
                                        <>
                                            <th className="px-3 py-2.5 text-center">Gender / Usia</th>
                                            <th className="px-3 py-2.5 text-center">Data Fisik</th>
                                            <th className="px-3 py-2.5">Paket & Status</th>
                                            <th className="px-3 py-2.5">Coach Pendamping</th>
                                        </>
                                    )}

                                    {/* Kolom Khusus Coach */}
                                    {activeTab === 'coach' && (
                                        <>
                                            <th className="px-3 py-2.5">Penugasan Gym</th>
                                            <th className="px-3 py-2.5 text-center">Total Klien</th>
                                        </>
                                    )}

                                    {/* Kolom Khusus Superadmin */}
                                    {activeTab === 'superadmin' && (
                                        <th className="px-3 py-2.5">Hak Akses</th>
                                    )}

                                    <th className="px-4 py-2.5 text-right w-16">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr 
                                            key={user.id} 
                                            onClick={() => router.visit(route('admin.users.edit', user.id))}
                                            className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                                            title="Klik baris untuk edit data pengguna"
                                        >
                                            {/* Nama & Avatar */}
                                            <td className="px-4 py-3 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200/80 shadow-2xs overflow-hidden">
                                                        {user.profile_photo_url ? (
                                                            <img src={user.profile_photo_url} alt={user.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            user.name.substring(0, 2).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <span className="font-bold text-slate-800 text-xs group-hover:text-orange-600 transition-colors block truncate">
                                                            {user.name}
                                                        </span>
                                                        {user.role === 'athlete' && user.sport && (
                                                            <span className="text-[10px] text-slate-500 font-medium">
                                                                {user.sport.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Login ID */}
                                            <td className="px-3 py-3 align-middle text-slate-600 text-xs font-mono">
                                                {user.username}
                                            </td>

                                            {/* Baris Khusus Athlete */}
                                            {activeTab === 'athlete' && (
                                                <>
                                                    {/* Gender & Usia */}
                                                    <td className="px-3 py-3 align-middle text-center text-xs text-slate-700">
                                                        <span className="font-semibold">{user.gender === 'P' ? 'Perempuan' : 'Laki-laki'}</span>
                                                        {user.age ? <span className="text-slate-400 text-[11px] block">{user.age} thn</span> : <span className="text-slate-300 text-[11px] block">-</span>}
                                                    </td>

                                                    {/* Data Fisik (BB/TB) */}
                                                    <td className="px-3 py-3 align-middle text-center text-xs text-slate-700">
                                                        {user.weight || user.height ? (
                                                            <div>
                                                                <span className="font-medium">{user.weight ? `${user.weight} kg` : '-'}</span>
                                                                <span className="text-slate-400 text-[11px] block">{user.height ? `${user.height} cm` : '-'}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-300 text-[11px]">-</span>
                                                        )}
                                                    </td>

                                                    {/* Paket & Status */}
                                                    <td className="px-3 py-3 align-middle">
                                                        <div className="flex flex-col gap-1 max-w-[200px]">
                                                            {user.package && (
                                                                <div className="inline-flex items-center gap-1 text-[9.5px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/60 font-medium whitespace-nowrap w-fit">
                                                                    <Package className="w-2.5 h-2.5 shrink-0" /> 
                                                                    <span className="truncate max-w-[130px]">Privat ({user.package.name})</span>
                                                                    {user.training_exp_date && (
                                                                        <span className="text-rose-600 font-bold ml-0.5 shrink-0">
                                                                            Exp: {new Date(user.training_exp_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric'})}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {(user.shared_packages || user.sharedPackages)?.map(sp => (
                                                                <div key={sp.id} className="inline-flex items-center gap-1 text-[9.5px] text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200/60 font-medium whitespace-nowrap w-fit">
                                                                    <UsersRound className="w-2.5 h-2.5 shrink-0 text-orange-600" /> 
                                                                    <span className="truncate max-w-[130px]">Bersama ({sp.name})</span>
                                                                    {sp.expiration_date && (
                                                                        <span className="text-rose-600 font-bold ml-0.5 shrink-0">
                                                                            Exp: {new Date(sp.expiration_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric'})}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ))}

                                                            {user.groups?.map(g => (
                                                                <div key={g.id} className="inline-flex items-center gap-1 text-[9.5px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/60 font-medium whitespace-nowrap w-fit">
                                                                    <Users className="w-2.5 h-2.5 shrink-0" /> 
                                                                    <span className="truncate max-w-[120px]">{g.name}</span>
                                                                </div>
                                                            ))}

                                                            {!user.package && (!user.shared_packages || user.shared_packages.length === 0) && (!user.sharedPackages || user.sharedPackages.length === 0) && (!user.groups || user.groups.length === 0) && (
                                                                <span className="text-slate-400 text-[11px]">-</span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Coach Pendamping */}
                                                    <td className="px-3 py-3 align-middle">
                                                        {user.coaches?.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1">
                                                                {user.coaches.map(c => (
                                                                    <span key={c.id} className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9.5px] font-semibold bg-emerald-50 border border-emerald-200/60 text-emerald-700">
                                                                        <ShieldCheck className="w-2.5 h-2.5" /> {c.name}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400 text-[11px]">-</span>
                                                        )}
                                                    </td>
                                                </>
                                            )}

                                            {/* Baris Khusus Coach */}
                                            {activeTab === 'coach' && (
                                                <>
                                                    <td className="px-3 py-3 align-middle">
                                                        {user.is_gym_guard ? (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border bg-amber-50 text-amber-700 border-amber-200/70">
                                                                <Building2 className="w-2.5 h-2.5" /> Penjaga Gym {user.gym_fee ? `(Rp ${Number(user.gym_fee).toLocaleString('id-ID')})` : ''}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-400 text-xs">Bukan Penjaga Gym</span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-3 align-middle text-center text-xs font-semibold text-slate-700">
                                                        {user.athletes_count ?? 0} Atlet
                                                    </td>
                                                </>
                                            )}

                                            {/* Baris Khusus Superadmin */}
                                            {activeTab === 'superadmin' && (
                                                <td className="px-3 py-3 align-middle">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border bg-indigo-50 text-indigo-700 border-indigo-200/70">
                                                        <Shield className="w-2.5 h-2.5"/> Full Access System
                                                    </span>
                                                </td>
                                            )}

                                            {/* Aksi */}
                                            <td className="px-4 py-3 align-middle text-right">
                                                <div className="flex justify-end items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                                                    <Link 
                                                        href={route('admin.users.edit', user.id)}
                                                        onClick={(e) => e.stopPropagation()} 
                                                        className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                                                        title="Edit Pengguna"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </Link>
                                                    {auth.user.role === 'superadmin' && (
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }} 
                                                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
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
                                        <td colSpan={activeTab === 'athlete' ? 7 : 5} className="px-6 py-14 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="p-2.5 bg-slate-50 rounded-full mb-2 border border-slate-100">
                                                    <Users className="w-5 h-5 text-slate-300" />
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
                            <div 
                                key={user.id} 
                                onClick={() => router.visit(route('admin.users.edit', user.id))}
                                className="bg-white p-3.5 rounded-md border border-slate-200 shadow-2xs flex flex-col gap-3 cursor-pointer hover:border-slate-300 transition-all"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200 shadow-2xs overflow-hidden">
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
                                                    {user.sport && (
                                                        <span className="text-[10px] text-slate-500 font-medium">
                                                            {user.sport.name} {user.age ? `• ${user.age} thn` : ''}
                                                        </span>
                                                    )}
                                                    {user.package && (
                                                        <div className="inline-flex items-center gap-1 text-[9px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/60 font-medium whitespace-nowrap w-fit">
                                                            <Package className="w-2.5 h-2.5 shrink-0" /> <span className="truncate max-w-[130px]">Privat ({user.package.name})</span>
                                                        </div>
                                                    )}
                                                    {(user.shared_packages || user.sharedPackages)?.map(sp => (
                                                        <div key={sp.id} className="inline-flex items-center gap-1 text-[9px] text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200/60 font-medium whitespace-nowrap w-fit">
                                                            <UsersRound className="w-2.5 h-2.5 shrink-0 text-orange-600" /> <span className="truncate max-w-[130px]">Bersama ({sp.name})</span>
                                                        </div>
                                                    ))}
                                                    {user.groups?.map(g => (
                                                        <div key={g.id} className="inline-flex items-center gap-1 text-[9px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/60 font-medium whitespace-nowrap w-fit">
                                                            <Users className="w-2.5 h-2.5 shrink-0" /> <span className="truncate max-w-[130px]">{g.name}</span>
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
                                    <Link 
                                        href={route('admin.users.edit', user.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 rounded-md transition-colors border border-slate-200 hover:border-amber-200"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" /> Edit
                                    </Link>
                                    {auth.user.role === 'superadmin' && (
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-rose-50 hover:text-rose-700 rounded-md transition-colors border border-slate-200 hover:border-rose-200"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white p-8 rounded-md border border-slate-200 text-center">
                            <div className="p-2.5 bg-slate-50 rounded-full mb-2 border border-slate-100 inline-block">
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
                        <div className="inline-flex gap-1 bg-white p-1 rounded-md border border-slate-200 shadow-2xs">
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
        </AppLayout>
    );
}