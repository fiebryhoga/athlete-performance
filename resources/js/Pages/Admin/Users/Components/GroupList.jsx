import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, Edit3, Trash2, Users, Package, Search, Calendar, ShieldCheck, X } from 'lucide-react';
import Modal from '@/Components/Modal';

export default function GroupList({ groups, packages, allAthletes, coaches }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editGroup, setEditGroup] = useState(null);

    const { data, setData, post, put, delete: destroy, reset, errors, clearErrors, processing } = useForm({
        name: '',
        description: '',
        subscription_package_id: '',
        expiration_date: '',
        member_ids: [],
        coach_ids: [],
    });

    const openCreateModal = () => {
        clearErrors();
        reset();
        setEditGroup(null);
        setIsModalOpen(true);
    };

    const openEditModal = (group) => {
        clearErrors();
        setEditGroup(group);
        setData({
            name: group.name,
            description: group.description || '',
            subscription_package_id: group.subscription_package_id || '',
            expiration_date: group.expiration_date ? group.expiration_date.split('T')[0] : '',
            member_ids: group.members?.map(m => m.id) || [],
            coach_ids: group.coaches?.map(c => c.id) || [],
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editGroup) {
            put(route('admin.groups.update', editGroup.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            post(route('admin.groups.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus grup ini?')) {
            destroy(route('admin.groups.destroy', id));
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

    const filteredGroups = (groups || []).filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Cari nama grup..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:ring-1 focus:ring-slate-400 focus:border-slate-400 focus:bg-white transition-all outline-none" 
                    />
                    {searchTerm && (
                        <button type="button" onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
                <button 
                    onClick={openCreateModal}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Buat Grup Baru</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGroups.map(group => (
                    <div key={group.id} className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <div className="min-w-0 pr-2">
                                    <h3 className="font-bold text-sm text-slate-900 truncate group-hover:text-orange-600 transition-colors">{group.name}</h3>
                                    {group.description && <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{group.description}</p>}
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <button 
                                        onClick={() => openEditModal(group)} 
                                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                                        title="Edit Grup"
                                    >
                                        <Edit3 size={13} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(group.id)} 
                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                        title="Hapus Grup"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 mt-3">
                                <div className="flex items-center justify-between text-xs bg-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate">
                                        <Package size={13} className="text-teal-600 shrink-0" />
                                        <span className="truncate">{group.package?.name || 'Tanpa Paket'}</span>
                                    </div>
                                    {group.expiration_date && (
                                        <span className="text-[10px] font-bold text-rose-600 shrink-0 ml-2">
                                            Exp: {new Date(group.expiration_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric'})}
                                        </span>
                                    )}
                                </div>

                                <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                                            <Users size={13} className="text-indigo-600" />
                                            <span>{group.members?.length || 0} Atlet Terdaftar</span>
                                        </div>
                                    </div>
                                    {group.members?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 pt-1.5 border-t border-slate-200/60">
                                            {group.members.map(member => (
                                                <span key={member.id} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-white border border-slate-200 text-slate-700 shadow-2xs">
                                                    {member.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {group.coaches?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-200/60">
                                            <span className="text-[9.5px] font-bold text-slate-400 w-full">Pelatih:</span>
                                            {group.coaches.map(coach => (
                                                <span key={coach.id} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 border border-emerald-200/60 text-emerald-700">
                                                    <ShieldCheck size={10} /> {coach.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredGroups.length === 0 && (
                    <div className="col-span-full py-12 bg-white rounded-xl border border-slate-200/90 text-center text-slate-400">
                        <div className="p-3 bg-slate-50 rounded-full mb-2 inline-block border border-slate-100">
                            <Users className="w-5 h-5 text-slate-300" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-700">Tidak ada grup ditemukan</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Coba sesuaikan kata kunci pencarian.</p>
                    </div>
                )}
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                        <h2 className="text-sm font-bold text-slate-900">{editGroup ? 'Edit Grup Latihan' : 'Buat Grup Latihan Baru'}</h2>
                        <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
                            <X size={15} />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Grup</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Contoh: Tim Sprint Junior"
                                className="w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs"
                                required
                            />
                            {errors.name && <p className="text-rose-500 text-[11px] mt-1">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Paket Langganan Grup</label>
                                <select
                                    value={data.subscription_package_id}
                                    onChange={e => setData('subscription_package_id', e.target.value)}
                                    className="w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs"
                                >
                                    <option value="">-- Tanpa Paket --</option>
                                    {packages?.map(pkg => (
                                        <option key={pkg.id} value={pkg.id}>
                                            {pkg.name} ({pkg.package_type === 'per_session' ? 'Per Pertemuan' : `${pkg.session_count} Sesi`})
                                        </option>
                                    ))}
                                </select>
                                {errors.subscription_package_id && <p className="text-rose-500 text-[11px] mt-1">{errors.subscription_package_id}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Kedaluwarsa</label>
                                <input
                                    type="date"
                                    value={data.expiration_date}
                                    onChange={e => setData('expiration_date', e.target.value)}
                                    className="w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs"
                                />
                                {errors.expiration_date && <p className="text-rose-500 text-[11px] mt-1">{errors.expiration_date}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Deskripsi atau catatan tentang grup..."
                                className="w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 text-xs"
                                rows="2"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-2">Pilih Anggota Atlet / Klien</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1 border border-slate-200 rounded-md bg-slate-50/50">
                                {allAthletes?.map(athlete => {
                                    const isSelected = data.member_ids.includes(athlete.id);
                                    return (
                                        <div 
                                            key={athlete.id}
                                            onClick={() => toggleMember(athlete.id)}
                                            className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-all ${
                                                isSelected 
                                                ? 'border-orange-500 bg-orange-50/80 shadow-2xs' 
                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                            }`}
                                        >
                                            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                                                isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 bg-white'
                                            }`}>
                                                {isSelected && <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-800 truncate">{athlete.name}</p>
                                                <p className="text-[9.5px] text-slate-400 truncate">{athlete.sport?.name || 'Umum'}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-2">Pilih Coach Pendamping</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-36 overflow-y-auto custom-scrollbar p-1 border border-slate-200 rounded-md bg-slate-50/50">
                                {coaches?.map(coach => {
                                    const isSelected = data.coach_ids.includes(coach.id);
                                    return (
                                        <div 
                                            key={coach.id}
                                            onClick={() => toggleCoach(coach.id)}
                                            className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-all ${
                                                isSelected 
                                                ? 'border-emerald-500 bg-emerald-50/80 shadow-2xs' 
                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                            }`}
                                        >
                                            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                                                isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                                            }`}>
                                                {isSelected && <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-800 truncate">{coach.name}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-3.5 py-1.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-md shadow-2xs transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Grup'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
