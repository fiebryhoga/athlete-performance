import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Edit2, Trash2, Package, Search, Calendar, DollarSign, Wallet } from 'lucide-react';
import PageHeader from '@/Components/Layout/PageHeader';
import Modal from '@/Components/Modal';
import Swal from 'sweetalert2';

export default function Index({ packages }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);

    const { data, setData, post, put, delete: destroy, reset, errors, clearErrors } = useForm({
        name: '',
        description: '',
        session_count: 0,
        coach_fee_per_session: 0,
        price: 0,
    });

    const openModal = (pkg = null) => {
        clearErrors();
        if (pkg) {
            setEditingPackage(pkg);
            setData({
                name: pkg.name,
                description: pkg.description || '',
                session_count: pkg.session_count,
                coach_fee_per_session: pkg.coach_fee_per_session,
                price: pkg.price || 0,
            });
        } else {
            setEditingPackage(null);
            reset();
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
        
        if (editingPackage) {
            put(route('admin.packages.update', editingPackage.id), {
                onSuccess: () => {
                    closeModal();
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: 'Paket berhasil diperbarui.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            });
        } else {
            post(route('admin.packages.store'), {
                onSuccess: () => {
                    closeModal();
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: 'Paket berhasil ditambahkan.',
                        timer: 1500,
                        showConfirmButton: false
                    });
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
            confirmButtonColor: 'orange-500',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'rounded-xl px-6 py-2.5 font-bold',
                cancelButton: 'rounded-xl px-6 py-2.5 font-bold'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('admin.packages.destroy', pkg.id), {
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Terhapus!',
                            text: 'Paket berhasil dihapus.',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    }
                });
            }
        });
    };

    const filteredPackages = packages.filter(pkg => 
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    return (
        <AppLayout title="Manajemen Paket">
            <Head title="Manajemen Paket" />

            <PageHeader 
                title="Manajemen Paket Latihan"
                subtitle="Kelola paket latihan, harga, dan tarif per sesi untuk pelatih."
                badge="Master Data"
                icon={Package}
                searchPlaceholder="Cari paket..."
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                actions={
                    <button 
                        onClick={() => openModal()} 
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-500/90 text-white rounded-xl text-xs md:text-sm font-bold transition-all shadow-sm shadow-orange-500/20 hover:shadow-md hover:shadow-orange-500/30 hover:-translate-y-0.5"
                    >
                        <Plus size={18} strokeWidth={2.5} />
                        Tambah Paket
                    </button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.map(pkg => (
                    <div key={pkg.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                        <div className="p-5 flex-1 border-b border-slate-100 flex flex-col">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-orange-500 transition-colors">{pkg.name}</h3>
                                    {pkg.description && (
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{pkg.description}</p>
                                    )}
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-colors">
                                    <Package size={20} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                                </div>
                            </div>

                            <div className="mt-auto grid grid-cols-2 gap-3 pt-4">
                                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                    <div className="flex items-center gap-1.5 mb-1 text-slate-500">
                                        <Calendar size={12} />
                                        <span className="text-[10px] font-bold">JUMLAH SESI</span>
                                    </div>
                                    <span className="text-lg font-bold text-slate-800">{pkg.session_count} <span className="text-xs font-medium text-slate-500">sesi</span></span>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                    <div className="flex items-center gap-1.5 mb-1 text-slate-500">
                                        <Wallet size={12} />
                                        <span className="text-[10px] font-bold">FEE PELATIH</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-800">{formatCurrency(pkg.coach_fee_per_session)}</span>
                                </div>
                                {pkg.price > 0 && (
                                    <div className="col-span-2 bg-slate-50 rounded-xl p-3 border border-slate-100 mt-1">
                                        <div className="flex items-center gap-1.5 mb-1 text-slate-500">
                                            <DollarSign size={12} />
                                            <span className="text-[10px] font-bold">HARGA PAKET KLIEN</span>
                                        </div>
                                        <span className="text-lg font-bold text-orange-500">{formatCurrency(pkg.price)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex bg-slate-50 border-t border-slate-100">
                            <button
                                onClick={() => openModal(pkg)}
                                className="flex-1 py-3 text-xs font-bold text-slate-600 hover:text-orange-500 hover:bg-orange-500/5 flex items-center justify-center gap-2 transition-colors border-r border-slate-200"
                            >
                                <Edit2 size={14} /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(pkg)}
                                className="flex-1 py-3 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 transition-colors"
                            >
                                <Trash2 size={14} /> Hapus
                            </button>
                        </div>
                    </div>
                ))}

                {filteredPackages.length === 0 && (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white border border-slate-200 border-dashed rounded-2xl">
                        <Package size={48} className="text-slate-300 mb-4" strokeWidth={1.5} />
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Belum ada paket latihan</h3>
                        <p className="text-sm text-slate-500 mb-6">Mulai dengan menambahkan paket baru.</p>
                        <button 
                            onClick={() => openModal()} 
                            className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-500/90 transition-all shadow-sm shadow-orange-500/20 hover:-translate-y-0.5"
                        >
                            <Plus size={18} strokeWidth={2.5} />
                            Tambah Paket
                        </button>
                    </div>
                )}
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">
                        {editingPackage ? 'Edit Paket' : 'Tambah Paket Baru'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Nama Paket</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border-slate-200 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                placeholder="Contoh: Paket 12 Sesi"
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
                                rows="3"
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Jumlah Sesi</label>
                                <input
                                    type="number"
                                    value={data.session_count}
                                    onChange={e => setData('session_count', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border-slate-200 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                    min="1"
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

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Harga Jual Paket (Opsional)</label>
                            <input
                                type="number"
                                value={data.price}
                                onChange={e => setData('price', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border-slate-200 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                min="0"
                                placeholder="Rp"
                            />
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                        </div>

                        <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-500/90 rounded-xl shadow-sm shadow-orange-500/20 hover:shadow-md hover:-translate-y-0.5 transition-all"
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
