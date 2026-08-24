import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Package, 
    Search, 
    X, 
    Filter, 
    ChevronDown, 
    Check, 
    CalendarClock, 
    Sparkles
} from 'lucide-react';
import PageHeader from '@/Components/Common/PageHeader';
import PageFooter from '@/Components/Common/PageFooter';
import Modal from '@/Components/Modal';
import Swal from 'sweetalert2';

// --- CUSTOM SELECT COMPONENT ---
function CustomSelect({ label, value, options, onChange, placeholder = "Pilih..." }) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((opt) => String(opt.value) === String(value));
    return (
        <div className="space-y-1 relative">
            {label && <label className="block text-[11px] font-bold text-slate-600">{label}</label>}
            <button type="button" onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-800 transition-all text-left shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500">
                <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 ml-1.5 transition-transform ${isOpen ? "rotate-180 text-orange-500" : ""}`} />
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsOpen(false)} />
                    <div className="absolute left-0 top-full mt-1 w-full max-h-48 overflow-y-auto bg-white rounded-md shadow-xl border border-slate-200 p-1 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-0.5 custom-scrollbar">
                        {options.map((opt) => {
                            const isSelected = String(opt.value) === String(value);
                            return (
                                <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors text-left ${isSelected ? "bg-orange-50 text-orange-700 font-bold" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"}`}>
                                    <span className="truncate">{opt.label}</span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-orange-600 shrink-0 ml-1.5" />}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

export default function Index({ packages }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('name_asc');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { data, setData, post, put, delete: destroy, reset, errors, clearErrors } = useForm({
        name: '',
        package_type: 'quota', // 'quota' | 'per_session'
        description: '',
        session_count: 12,
        coach_fee_per_session: 0,
        price: 0,
    });

    const typeOptions = [
        { value: "all", label: "Semua Tipe" },
        { value: "quota", label: "Paket Kuota (Bundel)" },
        { value: "per_session", label: "Per Pertemuan (Sesi Lepas)" },
    ];

    const sortOptions = [
        { value: "name_asc", label: "Nama (A - Z)" },
        { value: "name_desc", label: "Nama (Z - A)" },
        { value: "sessions_desc", label: "Sesi Terbanyak" },
        { value: "price_desc", label: "Harga Tertinggi" },
    ];

    const openModal = (pkg = null) => {
        clearErrors();
        if (pkg) {
            setEditingPackage(pkg);
            setData({
                name: pkg.name,
                package_type: pkg.package_type || 'quota',
                description: pkg.description || '',
                session_count: pkg.session_count || 12,
                coach_fee_per_session: pkg.coach_fee_per_session || 0,
                price: pkg.price || 0,
            });
        } else {
            setEditingPackage(null);
            setData({
                name: '',
                package_type: 'quota',
                description: '',
                session_count: 12,
                coach_fee_per_session: 0,
                price: 0,
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPackage(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...data,
            session_count: data.package_type === 'per_session' ? null : data.session_count,
        };

        if (editingPackage) {
            put(route('admin.packages.update', editingPackage.id), {
                data: payload,
                onSuccess: () => {
                    closeModal();
                    Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Paket berhasil diperbarui.', timer: 1500, showConfirmButton: false });
                }
            });
        } else {
            post(route('admin.packages.store'), {
                data: payload,
                onSuccess: () => {
                    closeModal();
                    Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Paket berhasil ditambahkan.', timer: 1500, showConfirmButton: false });
                }
            });
        }
    };

    const handleDelete = (pkg) => {
        Swal.fire({
            title: 'Hapus Paket?',
            text: `Paket "${pkg.name}" akan dihapus permanen!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f97316',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'rounded-xl px-6 py-2.5 font-bold',
                cancelButton: 'rounded-xl px-6 py-2.5 font-bold',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('admin.packages.destroy', pkg.id), {
                    onSuccess: () => {
                        Swal.fire({ icon: 'success', title: 'Terhapus!', text: 'Paket berhasil dihapus.', timer: 1500, showConfirmButton: false });
                    }
                });
            }
        });
    };

    const filteredPackages = useMemo(() => {
        return (packages || [])
            .filter(pkg => {
                const matchesSearch = !searchTerm.trim() || pkg.name.toLowerCase().includes(searchTerm.toLowerCase());
                const pkgType = pkg.package_type || 'quota';
                const matchesType = filterType === 'all' || pkgType === filterType;
                return matchesSearch && matchesType;
            })
            .sort((a, b) => {
                if (sortBy === 'name_asc') return (a.name || '').localeCompare(b.name || '');
                if (sortBy === 'name_desc') return (b.name || '').localeCompare(a.name || '');
                if (sortBy === 'sessions_desc') return (b.session_count || 0) - (a.session_count || 0);
                if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
                return 0;
            });
    }, [packages, searchTerm, filterType, sortBy]);

    const activeFilterCount = (filterType !== 'all' ? 1 : 0) + (sortBy !== 'name_asc' ? 1 : 0);

    const resetFilters = () => {
        setSearchTerm('');
        setFilterType('all');
        setSortBy('name_asc');
    };

    const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);

    return (
        <AppLayout title="Manajemen Paket">
            <Head title="Manajemen Paket" />

            <div className="space-y-4 pb-6">
                <PageHeader
                    title="Manajemen Paket Latihan"
                    description="Kelola paket kuota (bundel sesi) dan paket per pertemuan (sesi lepas), tarif atlet, serta fee pelatih."
                    actions={
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative w-44 sm:w-52">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Cari paket..."
                                    className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-2xs"
                                />
                                {searchTerm && (
                                    <button type="button" onClick={() => setSearchTerm("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>

                            <div className="relative">
                                {isFilterOpen && <div className="fixed inset-0 z-20 cursor-default" onClick={() => setIsFilterOpen(false)} />}
                                <button
                                    type="button"
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 hover:via-orange-50/40 hover:to-orange-100/60 text-orange-600 border border-slate-200/90 hover:border-orange-300 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                                >
                                    <Filter className="w-3.5 h-3.5 text-orange-500" />
                                    <span>Filter</span>
                                    {activeFilterCount > 0 && (
                                        <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black flex items-center justify-center">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                    <ChevronDown className={`w-3 h-3 text-orange-400 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
                                </button>
                                {isFilterOpen && (
                                    <div className="absolute right-0 top-full mt-1.5 w-72 sm:w-80 bg-white rounded-lg shadow-xl border border-slate-200/80 p-4 z-30 animate-in fade-in zoom-in-95 duration-100 space-y-3.5">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                                <Filter className="w-3.5 h-3.5 text-orange-500" /> Filter Paket
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                {activeFilterCount > 0 && (
                                                    <button type="button" onClick={resetFilters} className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer">
                                                        Reset
                                                    </button>
                                                )}
                                                <button type="button" onClick={() => setIsFilterOpen(false)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors cursor-pointer">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                        <CustomSelect label="Tipe Paket" value={filterType} options={typeOptions} onChange={setFilterType} />
                                        <CustomSelect label="Urutkan" value={sortBy} options={sortOptions} onChange={setSortBy} />
                                        <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setIsFilterOpen(false)}
                                                className="px-3 py-1.5 bg-gradient-to-r from-white via-white to-orange-50/70 hover:to-orange-100/80 text-orange-600 hover:text-orange-700 border border-slate-200 hover:border-slate-300 rounded-md text-xs font-bold transition-all shadow-2xs cursor-pointer"
                                            >
                                                Terapkan
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => openModal()}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-orange-500 to-orange-600 text-white border border-orange-600 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-sm hover:from-orange-600 hover:to-orange-700 cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" /> Tambah Paket
                            </button>
                        </div>
                    }
                />

                {/* Quick Type Filter Tabs */}
                <div className="flex items-center gap-1.5 border-b border-slate-200/80 pb-2">
                    {[
                        { id: 'all', label: 'Semua Paket', count: (packages || []).length },
                        { id: 'quota', label: 'Paket Kuota (Bundel)', count: (packages || []).filter(p => (p.package_type || 'quota') === 'quota').length },
                        { id: 'per_session', label: 'Per Pertemuan', count: (packages || []).filter(p => p.package_type === 'per_session').length },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setFilterType(tab.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                filterType === tab.id
                                    ? 'bg-orange-500 text-white shadow-xs'
                                    : 'bg-white text-slate-600 hover:bg-slate-100/80 border border-slate-200/70'
                            }`}
                        >
                            <span>{tab.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                                filterType === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {filteredPackages.length === 0 ? (
                    <div className="col-span-full py-16 px-4 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-500 shadow-2xs">
                            <Package className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-slate-800">Belum ada paket latihan</h4>
                            <p className="text-xs text-slate-400 font-medium max-w-sm">Mulai dengan menambahkan paket kuota atau paket per pertemuan baru.</p>
                        </div>
                        <button
                            onClick={() => openModal()}
                            className="px-3.5 py-1.5 text-xs font-bold text-orange-600 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-md transition-all shadow-2xs cursor-pointer"
                        >
                            <Plus className="w-3 h-3 inline mr-1" /> Tambah Paket
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
                        {filteredPackages.map(pkg => {
                            const isPerSession = pkg.package_type === 'per_session';
                            return (
                                <div
                                    key={pkg.id}
                                    className={`group relative rounded-lg border shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                                        isPerSession
                                            ? 'bg-gradient-to-b from-white via-indigo-50/15 to-indigo-100/25 border-slate-200/90 hover:border-indigo-300/80'
                                            : 'bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 border-slate-200/90 hover:border-orange-200/80'
                                    }`}
                                >
                                    <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                                        {/* Identity Row */}
                                        <div className="flex items-start gap-2.5">
                                            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-md border-2 border-white shadow-2xs font-black text-base flex items-center justify-center shrink-0 ${
                                                isPerSession
                                                    ? 'bg-gradient-to-br from-indigo-50 to-indigo-100/80 text-indigo-600'
                                                    : 'bg-gradient-to-br from-orange-50 to-orange-100/70 text-orange-600'
                                            }`}>
                                                {isPerSession ? <CalendarClock className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                                            </div>
                                            <div className="min-w-0 flex-1 space-y-1">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                                        isPerSession
                                                            ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                                            : 'bg-orange-100 text-orange-700 border border-orange-200'
                                                    }`}>
                                                        {isPerSession ? 'Per Pertemuan' : 'Paket Kuota'}
                                                    </span>
                                                </div>
                                                <h3 className={`font-bold text-slate-900 text-xs sm:text-[13px] truncate transition-colors leading-tight ${
                                                    isPerSession ? 'group-hover:text-indigo-600' : 'group-hover:text-orange-600'
                                                }`}>
                                                    {pkg.name}
                                                </h3>
                                                {pkg.description && (
                                                    <p className="text-[11px] text-slate-500 font-medium truncate">{pkg.description}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Metric Tiles */}
                                        <div className="grid grid-cols-2 gap-1.5 pt-0.5 border-t border-slate-100/90">
                                            <div className="p-1.5 bg-white/90 rounded-md border border-slate-200/70 shadow-2xs">
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">
                                                    {isPerSession ? 'Model' : 'Kuota'}
                                                </span>
                                                <div className="flex items-baseline gap-0.5 mt-0.5">
                                                    {isPerSession ? (
                                                        <span className="text-[11px] font-black text-indigo-600 leading-tight">Fleksibel</span>
                                                    ) : (
                                                        <>
                                                            <span className="text-[11.5px] font-black text-orange-600 leading-tight">{pkg.session_count}</span>
                                                            <span className="text-[8px] font-normal text-slate-400">sesi</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="p-1.5 bg-white/90 rounded-md border border-slate-200/70 shadow-2xs">
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Fee Pelatih</span>
                                                <div className="mt-0.5">
                                                    <span className="text-[9.5px] font-bold text-slate-700 leading-tight block truncate">
                                                        {formatCurrency(pkg.coach_fee_per_session)}
                                                        <span className="text-[8px] font-normal text-slate-400 ml-0.5">/sesi</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {pkg.price > 0 && (
                                            <div className="p-1.5 bg-white/90 rounded-md border border-slate-200/70 shadow-2xs">
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">
                                                    {isPerSession ? 'Harga Per Pertemuan' : 'Harga Total Paket'}
                                                </span>
                                                <div className="mt-0.5 flex items-baseline gap-1">
                                                    <span className={`text-[11.5px] font-black leading-tight ${isPerSession ? 'text-indigo-600' : 'text-orange-600'}`}>
                                                        {formatCurrency(pkg.price)}
                                                    </span>
                                                    <span className="text-[8px] text-slate-400 font-medium">
                                                        {isPerSession ? '/ pertemuan' : '/ paket'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Footer */}
                                    <div className="px-3.5 py-2 bg-gradient-to-r from-slate-50/90 via-white to-orange-50/30 border-t border-slate-100 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => openModal(pkg)}
                                                className="text-slate-400 hover:text-orange-500 transition-colors p-0.5"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(pkg)}
                                                className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <span className={`inline-flex items-center gap-0.5 text-[10.5px] font-bold ${
                                            isPerSession ? 'text-indigo-600' : 'text-orange-600'
                                        }`}>
                                            {isPerSession ? 'Per Pertemuan' : `${pkg.session_count} Sesi`}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <PageFooter className="!mt-8 !pt-4 !pb-1" />
            </div>

            {/* ─── CREATE/EDIT MODAL ─── */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">
                        {editingPackage ? 'Edit Paket Latihan' : 'Tambah Paket Baru'}
                    </h2>
                    <p className="text-xs text-slate-500 mb-5">
                        Tentukan skema pembayaran paket: kuota bundel sesi atau tarif per pertemuan.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Package Type Selector */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-2 ml-0.5">
                                Tipe Skema Paket
                            </label>
                            <div className="grid grid-cols-2 gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setData('package_type', 'quota')}
                                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                                        data.package_type === 'quota'
                                            ? 'bg-orange-50/70 border-orange-500 ring-2 ring-orange-500/20 text-orange-950'
                                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className={`p-1.5 rounded-lg ${data.package_type === 'quota' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                            <Package className="w-4 h-4" />
                                        </div>
                                        {data.package_type === 'quota' && <Check className="w-4 h-4 text-orange-600" />}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold leading-tight">Paket Kuota</h4>
                                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">Bundel Sesi (misal 12 Sesi)</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setData('package_type', 'per_session')}
                                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                                        data.package_type === 'per_session'
                                            ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-950'
                                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className={`p-1.5 rounded-lg ${data.package_type === 'per_session' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                            <CalendarClock className="w-4 h-4" />
                                        </div>
                                        {data.package_type === 'per_session' && <Check className="w-4 h-4 text-indigo-600" />}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold leading-tight">Per Pertemuan</h4>
                                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">Fleksibel / Sesi Lepas</p>
                                    </div>
                                </button>
                            </div>
                            {errors.package_type && <p className="text-red-500 text-xs mt-1">{errors.package_type}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Nama Paket</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border-slate-200 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                placeholder={data.package_type === 'quota' ? "Contoh: Paket 12 Sesi Gold" : "Contoh: Paket Latihan Reguler (Per Sesi)"}
                                required
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Deskripsi (Opsional)</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border-slate-200 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                placeholder="Tuliskan deskripsi singkat paket"
                                rows="2"
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        {data.package_type === 'quota' ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Jumlah Sesi (Kuota)</label>
                                    <input
                                        type="number"
                                        value={data.session_count}
                                        onChange={e => setData('session_count', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border-slate-200 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                        min="1"
                                        placeholder="12"
                                        required
                                    />
                                    {errors.session_count && <p className="text-red-500 text-xs mt-1">{errors.session_count}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Fee Pelatih / Sesi</label>
                                    <input
                                        type="number"
                                        value={data.coach_fee_per_session}
                                        onChange={e => setData('coach_fee_per_session', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border-slate-200 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                        min="0"
                                        placeholder="Rp"
                                        required
                                    />
                                    {errors.coach_fee_per_session && <p className="text-red-500 text-xs mt-1">{errors.coach_fee_per_session}</p>}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-start gap-2.5">
                                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-indigo-900 font-medium leading-relaxed">
                                        Paket ini berlaku fleksibel per kedatangan. Atlet/klien dikenakan biaya setiap pertemuan dan pelatih menerima fee per pertemuan.
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Fee Pelatih / Pertemuan</label>
                                    <input
                                        type="number"
                                        value={data.coach_fee_per_session}
                                        onChange={e => setData('coach_fee_per_session', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        min="0"
                                        placeholder="Rp"
                                        required
                                    />
                                    {errors.coach_fee_per_session && <p className="text-red-500 text-xs mt-1">{errors.coach_fee_per_session}</p>}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
                                {data.package_type === 'quota' ? 'Total Harga Jual Paket (Opsional)' : 'Harga per Pertemuan (Opsional)'}
                            </label>
                            <input
                                type="number"
                                value={data.price}
                                onChange={e => setData('price', e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-xl border-slate-200 text-sm ${
                                    data.package_type === 'quota'
                                        ? 'focus:ring-orange-500 focus:border-orange-500'
                                        : 'focus:ring-indigo-500 focus:border-indigo-500'
                                }`}
                                min="0"
                                placeholder="Rp"
                            />
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                        </div>

                        <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className={`px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer ${
                                    data.package_type === 'per_session'
                                        ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                                        : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
                                }`}
                            >
                                {editingPackage ? 'Simpan Perubahan' : 'Tambah Paket'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AppLayout>
    );
}
