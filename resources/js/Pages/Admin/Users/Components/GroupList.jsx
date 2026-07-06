import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, Edit3, Trash2, Users, Package, Search } from 'lucide-react';
import Modal from '@/Components/Modal';

export default function GroupList({ groups, packages, allAthletes, coaches }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editGroup, setEditGroup] = useState(null);

    const { data, setData, post, put, delete: destroy, reset, errors, clearErrors } = useForm({
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

    const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Cari nama grup..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] transition-all outline-none shadow-sm" 
                    />
                </div>
                <button 
                    onClick={openCreateModal}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff4d00] text-white px-5 py-2.5 md:py-3 rounded-lg font-bold text-xs md:text-sm shadow-lg shadow-[#ff4d00]/20 hover:bg-[#e64500] transition-all"
                >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" /> Buat Grup
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map(group => (
                    <div key={group.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{group.name}</h3>
                                {group.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{group.description}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => openEditModal(group)} className="text-slate-400 hover:text-[#ff4d00] transition-colors"><Edit3 size={16} /></button>
                                <button onClick={() => handleDelete(group.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mt-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                <Package size={16} className="text-[#ff4d00]" />
                                <span className="font-medium">{group.package?.name || 'Belum ada paket'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                <Users size={16} className="text-blue-500" />
                                <span className="font-medium">{group.members?.length || 0} Klien terdaftar</span>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredGroups.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500">
                        Tidak ada grup yang ditemukan.
                    </div>
                )}
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">{editGroup ? 'Edit Grup' : 'Buat Grup Baru'}</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Grup</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border-slate-200 focus:ring-[#ff4d00] focus:border-[#ff4d00] text-sm"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Paket Langganan Grup</label>
                                <select
                                    value={data.subscription_package_id}
                                    onChange={e => setData('subscription_package_id', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg border-slate-200 focus:ring-[#ff4d00] focus:border-[#ff4d00] text-sm"
                                >
                                    <option value="">-- Tidak Ada / Kosongkan --</option>
                                    {packages?.map(pkg => (
                                        <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                                    ))}
                                </select>
                                {errors.subscription_package_id && <p className="text-red-500 text-xs mt-1">{errors.subscription_package_id}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Tanggal Kedaluwarsa</label>
                                <input
                                    type="date"
                                    value={data.expiration_date}
                                    onChange={e => setData('expiration_date', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg border-slate-200 focus:ring-[#ff4d00] focus:border-[#ff4d00] text-sm"
                                />
                                {errors.expiration_date && <p className="text-red-500 text-xs mt-1">{errors.expiration_date}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Deskripsi Singkat</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border-slate-200 focus:ring-[#ff4d00] focus:border-[#ff4d00] text-sm"
                                rows="2"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-3">Pilih Klien / Anggota Grup</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto custom-scrollbar p-1">
                                {allAthletes?.map(athlete => (
                                    <div 
                                        key={athlete.id}
                                        onClick={() => toggleMember(athlete.id)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                            data.member_ids.includes(athlete.id) 
                                            ? 'border-[#ff4d00] bg-orange-50' 
                                            : 'border-slate-200 bg-white hover:border-[#ff4d00]/30 hover:bg-orange-50/30'
                                        }`}
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                            data.member_ids.includes(athlete.id)
                                            ? 'bg-[#ff4d00] border-[#ff4d00]'
                                            : 'border-slate-300'
                                        }`}>
                                            {data.member_ids.includes(athlete.id) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 line-clamp-1">{athlete.name}</p>
                                            <p className="text-[10px] text-slate-500">{athlete.sport?.name || 'Umum'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-3">Pilih Coach Pendamping</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto custom-scrollbar p-1">
                                {coaches?.map(coach => (
                                    <div 
                                        key={coach.id}
                                        onClick={() => toggleCoach(coach.id)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                            data.coach_ids.includes(coach.id) 
                                            ? 'border-[#ff4d00] bg-orange-50' 
                                            : 'border-slate-200 bg-white hover:border-[#ff4d00]/30 hover:bg-orange-50/30'
                                        }`}
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                            data.coach_ids.includes(coach.id)
                                            ? 'bg-[#ff4d00] border-[#ff4d00]'
                                            : 'border-slate-300'
                                        }`}>
                                            {data.coach_ids.includes(coach.id) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 line-clamp-1">{coach.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 text-sm font-bold text-white bg-[#ff4d00] hover:bg-[#ff4d00]/90 rounded-lg shadow-sm shadow-[#ff4d00]/20"
                            >
                                Simpan Grup
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
