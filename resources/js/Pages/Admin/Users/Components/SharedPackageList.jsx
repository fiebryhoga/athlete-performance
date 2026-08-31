import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import { Plus, Edit3, Trash2, UsersRound, Package, Search, Calendar, ShieldCheck, X, ExternalLink } from 'lucide-react';
import Modal from '@/Components/Modal';

const SharedPackageList = forwardRef(({ sharedPackages, packages, allAthletes, coaches, searchTerm = '', isCreateModalOpen, setIsCreateModalOpen }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editPackage, setEditPackage] = useState(null);

    const { data, setData, post, put, delete: destroy, reset, errors, clearErrors, processing } = useForm({
        name: '',
        description: '',
        subscription_package_id: '',
        start_date: '',
        expiration_date: '',
        member_ids: [],
        coach_ids: [],
    });

    const openCreateModal = () => {
        clearErrors();
        reset();
        setEditPackage(null);
        setIsModalOpen(true);
    };

    useImperativeHandle(ref, () => ({
        openCreateModal
    }));

    const openEditModal = (sp) => {
        clearErrors();
        setEditPackage(sp);
        setData({
            name: sp.name,
            description: sp.description || '',
            subscription_package_id: sp.subscription_package_id || '',
            start_date: sp.start_date ? sp.start_date.split('T')[0] : '',
            expiration_date: sp.expiration_date ? sp.expiration_date.split('T')[0] : '',
            member_ids: sp.members?.map(m => m.id) || [],
            coach_ids: sp.coaches?.map(c => c.id) || [],
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editPackage) {
            put(route('admin.shared-packages.update', editPackage.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            post(route('admin.shared-packages.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus paket bersama ini?')) {
            destroy(route('admin.shared-packages.destroy', id));
        }
    };

    const toggleMember = (athleteId) => {
        let current = [...data.member_ids];
        if (current.includes(athleteId)) {
            current = current.filter(id => id !== athleteId);
        } else {
            current.push(athleteId);
        }
        setData('member_ids', current);
    };

    const toggleCoach = (coachId) => {
        let current = [...data.coach_ids];
        if (current.includes(coachId)) {
            current = current.filter(id => id !== coachId);
        } else {
            current.push(coachId);
        }
        setData('coach_ids', current);
    };

    const filteredPackages = (sharedPackages || []).filter(sp => 
        sp.name.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
        (sp.description && sp.description.toLowerCase().includes((searchTerm || '').toLowerCase()))
    );

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredPackages.map(sp => {
                    const memberCount = sp.members?.length || 0;
                    const maxDisplayMembers = 4;
                    const displayedMembers = sp.members?.slice(0, maxDisplayMembers) || [];
                    const remainingMembers = memberCount - maxDisplayMembers;
                    const progress = sp.total_sessions
                        ? Math.min(100, Math.round((sp.used_sessions / sp.total_sessions) * 100))
                        : 0;

                    return (
                        <div 
                            key={sp.id} 
                            onClick={() => router.visit(route('admin.shared-packages.show', sp.id))}
                            className="bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between group cursor-pointer"
                            title="Klik untuk membuka detail paket bersama"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="min-w-0 pr-2">
                                        <h3 className="font-bold text-xs text-slate-900 truncate group-hover:text-orange-600 transition-colors flex items-center gap-1.5">
                                            <span>{sp.name}</span>
                                            <ExternalLink size={11} className="text-slate-300 group-hover:text-orange-500 transition-colors opacity-0 group-hover:opacity-100" />
                                        </h3>
                                        {sp.description && <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{sp.description}</p>}
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); openEditModal(sp); }} 
                                            className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                                            title="Edit Paket Bersama"
                                        >
                                            <Edit3 size={13} />
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleDelete(sp.id); }} 
                                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                            title="Hapus Paket Bersama"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 mt-2.5">
                                    <div className="flex items-center justify-between text-xs bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
                                        <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate text-[11px]">
                                            <Package size={12} className="text-orange-600 shrink-0" />
                                            <span className="truncate">{sp.package?.name || 'Tanpa Paket'}</span>
                                        </div>
                                        {sp.expiration_date && (
                                            <span className="text-[9.5px] font-bold text-rose-600 shrink-0 ml-2">
                                                Exp: {new Date(sp.expiration_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric'})}
                                            </span>
                                        )}
                                    </div>

                                    {/* Progress Sesi */}
                                    <div className="space-y-1 bg-slate-50/70 p-2 rounded border border-slate-100">
                                        <div className="flex items-center justify-between text-[10.5px]">
                                            <span className="text-slate-500 font-medium">Kuota Terpakai</span>
                                            <span className="font-bold text-orange-700">{sp.used_sessions || 0} / {sp.total_sessions || '∞'} Sesi</span>
                                        </div>
                                        {sp.total_sessions && (
                                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-orange-600 rounded-full transition-all duration-300"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Coach list */}
                                    {sp.coaches && sp.coaches.length > 0 && (
                                        <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-amber-50/60 border border-amber-100/60 px-2 py-0.5 rounded">
                                            <ShieldCheck size={11} className="text-amber-600 shrink-0" />
                                            <span className="truncate font-medium">Coach: {sp.coaches.map(c => c.name).join(', ')}</span>
                                        </div>
                                    )}

                                    {/* Member list preview */}
                                    <div className="space-y-1 mt-2">
                                        <span className="text-[10px] font-bold text-slate-400 block">
                                            Anggota ({memberCount})
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                            {displayedMembers.map(m => (
                                                <span key={m.id} className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-700 font-medium px-1.5 py-0.5 rounded border border-slate-200/60">
                                                    {m.name}
                                                </span>
                                            ))}
                                            {remainingMembers > 0 && (
                                                <span className="text-[9.5px] bg-slate-50 text-slate-500 font-bold px-1.5 py-0.5 rounded border border-slate-200">
                                                    +{remainingMembers} lainnya
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                                <span className="text-slate-400">
                                    Sisa: <strong className="text-slate-700 font-bold">{sp.remaining_sessions ?? '∞'} sesi</strong>
                                </span>
                                <span className="text-orange-600 font-bold group-hover:underline flex items-center gap-0.5">
                                    Lihat Detail &rarr;
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredPackages.length === 0 && (
                <div className="text-center py-12 bg-white rounded-md border border-slate-200 p-8 shadow-2xs">
                    <UsersRound className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 text-xs font-semibold">Tidak ada paket bersama yang ditemukan.</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">Klik tombol "Tambah Paket Bersama" untuk membuat baru.</p>
                </div>
            )}

            {/* Modal Create/Edit Paket Bersama */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <h2 className="text-sm font-bold text-slate-900">
                            {editPackage ? 'Edit Paket Bersama' : 'Tambah Paket Bersama Baru'}
                        </h2>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="space-y-3.5 text-xs">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Paket Bersama (cth: Keluarga Caca / Private Family 3) *</label>
                            <input 
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Masukkan nama paket bersama..."
                                className="w-full text-xs rounded-md border-slate-200 focus:border-orange-500 focus:ring-orange-500 shadow-2xs"
                                required
                            />
                            {errors.name && <p className="text-rose-500 text-[11px] mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Deskripsi / Catatan Tambahan</label>
                            <textarea 
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Catatan opsional..."
                                rows="2"
                                className="w-full text-xs rounded-md border-slate-200 focus:border-orange-500 focus:ring-orange-500 shadow-2xs"
                            />
                            {errors.description && <p className="text-rose-500 text-[11px] mt-1">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">Paket Langganan *</label>
                                <select 
                                    value={data.subscription_package_id}
                                    onChange={e => setData('subscription_package_id', e.target.value)}
                                    className="w-full text-xs rounded-md border-slate-200 focus:border-orange-500 focus:ring-orange-500 shadow-2xs"
                                    required
                                >
                                    <option value="">-- Pilih Paket Master --</option>
                                    {packages?.map(pkg => (
                                        <option key={pkg.id} value={pkg.id}>
                                            {pkg.name} ({pkg.package_type === 'per_session' ? 'Per Pertemuan' : `${pkg.session_count} Sesi`})
                                        </option>
                                    ))}
                                </select>
                                {errors.subscription_package_id && <p className="text-rose-500 text-[11px] mt-1">{errors.subscription_package_id}</p>}
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">Masa Berlaku Mulai</label>
                                <input 
                                    type="date"
                                    value={data.start_date}
                                    onChange={e => setData('start_date', e.target.value)}
                                    className="w-full text-xs rounded-md border-slate-200 focus:border-orange-500 focus:ring-orange-500 shadow-2xs"
                                />
                                {errors.start_date && <p className="text-rose-500 text-[11px] mt-1">{errors.start_date}</p>}
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">Masa Berlaku Sampai</label>
                                <input 
                                    type="date"
                                    value={data.expiration_date}
                                    onChange={e => setData('expiration_date', e.target.value)}
                                    className="w-full text-xs rounded-md border-slate-200 focus:border-orange-500 focus:ring-orange-500 shadow-2xs"
                                />
                                {errors.expiration_date && <p className="text-rose-500 text-[11px] mt-1">{errors.expiration_date}</p>}
                            </div>
                        </div>

                        {/* Coach Selection */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Penugasan Pelatih (Coach)</label>
                            <div className="border border-slate-200 rounded-md p-2.5 max-h-32 overflow-y-auto space-y-1 bg-slate-50/50">
                                {coaches?.map(coach => (
                                    <label key={coach.id} className="flex items-center gap-2 p-1 hover:bg-white rounded cursor-pointer transition-colors">
                                        <input 
                                            type="checkbox"
                                            checked={data.coach_ids.includes(coach.id)}
                                            onChange={() => toggleCoach(coach.id)}
                                            className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        <span className="text-xs text-slate-700 font-medium">{coach.name}</span>
                                    </label>
                                ))}
                                {(!coaches || coaches.length === 0) && (
                                    <p className="text-slate-400 text-[11px] italic">Tidak ada coach terdaftar.</p>
                                )}
                            </div>
                        </div>

                        {/* Member Selection */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-[11px] font-bold text-slate-700">Pilih Anggota Atlet * ({data.member_ids.length} dipilih)</label>
                                <span className="text-[10px] text-slate-400">Pilih minimal 1 atlet</span>
                            </div>
                            <div className="border border-slate-200 rounded-md p-2.5 max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-slate-50/50">
                                {allAthletes?.map(athlete => (
                                    <label key={athlete.id} className={`flex items-center gap-2 p-1.5 border rounded cursor-pointer transition-all ${
                                        data.member_ids.includes(athlete.id) 
                                            ? 'bg-orange-50/80 border-orange-200 text-orange-900 font-semibold' 
                                            : 'bg-white border-slate-200/70 text-slate-700 hover:bg-slate-50'
                                    }`}>
                                        <input 
                                            type="checkbox"
                                            checked={data.member_ids.includes(athlete.id)}
                                            onChange={() => toggleMember(athlete.id)}
                                            className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <span className="text-xs block truncate leading-tight">{athlete.name}</span>
                                            {athlete.sport && <span className="text-[9.5px] text-slate-400 block font-normal truncate">{athlete.sport.name}</span>}
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {errors.member_ids && <p className="text-rose-500 text-[11px] mt-1">{errors.member_ids}</p>}
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 cursor-pointer transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-xs font-bold shadow-2xs cursor-pointer transition-all disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : (editPackage ? 'Perbarui Paket Bersama' : 'Buat Paket Bersama')}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
});

export default SharedPackageList;
