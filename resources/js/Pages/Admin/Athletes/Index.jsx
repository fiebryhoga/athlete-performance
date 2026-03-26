import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, User, X, Eye, ChevronRight, AlertCircle, Camera, UploadCloud } from 'lucide-react';

export default function Index({ athletes, sports, filters }) {
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    
    // State untuk preview foto (UI Only)
    const [photoPreview, setPhotoPreview] = useState(null);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        name: '',
        athlete_id: '',
        password: '',
        sport_id: '',
        gender: 'L',
        age: '',
        height: '',
        weight: '',
        profile_photo: null, // Tambahan untuk file foto
        _method: 'POST',     // Penting untuk method spoofing di Laravel
    });

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(
                route('admin.athletes.index'),
                { search: searchTerm },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_photo', file);
            // Buat preview gambar
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const openCreateModal = () => {
        setIsEditMode(false);
        setEditingId(null);
        setPhotoPreview(null);
        reset();
        clearErrors();
        setData('_method', 'POST'); // Set method
        setIsModalOpen(true);
    };

    const openEditModal = (e, athlete) => {
        e.stopPropagation(); 
        setIsEditMode(true);
        setEditingId(athlete.id);
        setPhotoPreview(athlete.profile_photo_url || null);
        clearErrors();
        
        setData({
            name: athlete.name,
            athlete_id: athlete.athlete_id,
            password: '', 
            sport_id: athlete.sport_id || '',
            gender: athlete.gender || 'L',
            age: athlete.age || '',
            height: athlete.height || '',
            weight: athlete.weight || '',
            profile_photo: null, 
            _method: 'PUT', // Penting! Method Spoofing agar Inertia bisa kirim file via PUT
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEditMode) {
            // Gunakan post dengan _method: 'PUT' karena form-data tidak bisa pakai router.put langsung
            post(route('admin.athletes.update', editingId), {
                forceFormData: true, // Paksa Inertia pakai FormData (multipart/form-data)
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            post(route('admin.athletes.store'), {
                forceFormData: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this athlete? This action cannot be undone.')) {
            router.delete(route('admin.athletes.destroy', id));
        }
    };

    const handleRowClick = (id) => {
        router.get(route('admin.athletes.show', id));
    };

    return (
        <AdminLayout title="Athlete Management">
            <Head title="Athletes" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Athletes Data</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage athlete profiles, accounts, and physical metrics.</p>
                </div>
                <button onClick={openCreateModal} className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#00488b] hover:bg-[#003666] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/10 transition-all hover:-translate-y-0.5">
                    <Plus className="w-4 h-4" /> Add New Athlete
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative w-full sm:max-w-xs">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input type="text" placeholder="Search name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-[#00488b] focus:border-[#00488b] transition-shadow shadow-sm"/>
                    </div>
                </div>

                <div className="overflow-x-auto w-full">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Athlete Profile</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Sport</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Physical (H/W)</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Age / Gender</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {athletes.data.length > 0 ? (
                                athletes.data.map((athlete) => (
                                    <tr key={athlete.id} onClick={() => handleRowClick(athlete.id)} className="hover:bg-blue-50/40 transition-colors group cursor-pointer">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 relative">
                                                    {athlete.profile_photo_url ? (
                                                        <img src={athlete.profile_photo_url} alt={athlete.name} className="h-10 w-10 rounded-full object-cover border border-slate-200 shadow-sm group-hover:scale-110 transition-transform" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-[#00488b] flex items-center justify-center text-white font-bold border border-blue-200 text-sm shadow-sm group-hover:scale-110 transition-transform">
                                                            {athlete.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-slate-800 group-hover:text-[#00488b] transition-colors">{athlete.name}</div>
                                                    <div className="text-xs text-slate-500 font-mono">ID: {athlete.athlete_id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {athlete.sport ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-50 text-[#00488b] border border-blue-100">{athlete.sport.name}</span> : <span className="text-slate-400 text-xs italic">Not Assigned</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-xs text-slate-600 space-y-1">
                                                <div className="flex items-center gap-2"><span className="text-slate-400 w-8">H:</span><span className="font-bold">{athlete.height ? `${athlete.height} cm` : '-'}</span></div>
                                                <div className="flex items-center gap-2"><span className="text-slate-400 w-8">W:</span><span className="font-bold">{athlete.weight ? `${athlete.weight} kg` : '-'}</span></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-slate-700">{athlete.age ? `${athlete.age} Yrs` : '-'}</div>
                                            <div className="text-xs text-slate-400">{athlete.gender === 'L' ? 'Male' : 'Female'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={(e) => { e.stopPropagation(); handleRowClick(athlete.id); }} className="p-2 text-slate-400 hover:text-[#00488b] hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                                                <button onClick={(e) => openEditModal(e, athlete)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={(e) => handleDelete(e, athlete.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <User className="w-10 h-10 opacity-30 mb-3" />
                                            <h3 className="text-sm font-bold text-slate-700">No athletes found</h3>
                                            <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria or add a new athlete.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs text-slate-500 font-medium">Showing {athletes.from || 0} to {athletes.to || 0} of {athletes.total} entries</span>
                    <div className="flex gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
                        {athletes.links.map((link, key) => (
                            <button key={key} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} disabled={!link.url || link.active} className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors whitespace-nowrap ${link.active ? 'bg-[#00488b] text-white border-[#00488b]' : 'bg-white text-slate-500 border-slate-200 hover:text-[#00488b]'} ${!link.url && 'opacity-50 cursor-not-allowed'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
                        
                        <div className="sticky top-0 z-10 px-6 py-4 border-b border-slate-100 bg-white/90 backdrop-blur-sm flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">{isEditMode ? 'Edit Athlete Data' : 'Add New Athlete'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors p-1 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 md:p-8">
                            
                            {/* PHOTO UPLOAD AREA */}
                            <div className="mb-8 flex flex-col items-center">
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative w-28 h-28 rounded-full border-2 border-dashed border-slate-300 hover:border-[#00488b] bg-slate-50 hover:bg-blue-50/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group"
                                >
                                    {photoPreview ? (
                                        <>
                                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="w-6 h-6 text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center text-slate-400 group-hover:text-[#00488b]">
                                            <UploadCloud className="w-8 h-8 mb-1" />
                                            <span className="text-[10px] font-bold uppercase">Upload</span>
                                        </div>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
                                {errors.profile_photo && <p className="text-red-500 text-xs mt-2 font-medium">{errors.profile_photo}</p>}
                                <p className="text-[10px] text-slate-400 mt-2 font-medium">JPEG, PNG up to 2MB</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-5">
                                    <h4 className="text-xs font-bold text-[#00488b] uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">Account Information</h4>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-slate-300 focus:ring-[#00488b] focus:border-[#00488b] text-sm" placeholder="e.g. John Doe" />
                                        {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Athlete ID (Login)</label>
                                        <input type="text" value={data.athlete_id} onChange={e => setData('athlete_id', e.target.value)} disabled={isEditMode} className="w-full px-4 py-2.5 rounded-xl border-slate-300 focus:ring-[#00488b] focus:border-[#00488b] text-sm disabled:bg-slate-100 disabled:text-slate-500" placeholder="e.g. ATL-001" />
                                        {errors.athlete_id && <p className="text-red-500 text-xs mt-1 font-medium">{errors.athlete_id}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password {isEditMode && <span className="text-xs font-normal text-slate-400">(Leave blank to keep current)</span>}</label>
                                        <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-slate-300 focus:ring-[#00488b] focus:border-[#00488b] text-sm" placeholder="••••••••" />
                                        {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sport Category</label>
                                        <div className="relative">
                                            <select value={data.sport_id} onChange={e => setData('sport_id', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-slate-300 focus:ring-[#00488b] focus:border-[#00488b] text-sm appearance-none bg-white">
                                                <option value="">-- Select Sport --</option>
                                                {sports.map(sport => <option key={sport.id} value={sport.id}>{sport.name}</option>)}
                                            </select>
                                            <ChevronRight className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <h4 className="text-xs font-bold text-[#00488b] uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">Physical Metrics</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
                                            <div className="relative">
                                                <select value={data.gender} onChange={e => setData('gender', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-slate-300 focus:ring-[#00488b] focus:border-[#00488b] text-sm appearance-none bg-white">
                                                    <option value="L">Male</option>
                                                    <option value="P">Female</option>
                                                </select>
                                                <ChevronRight className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Age</label>
                                            <input type="number" value={data.age} onChange={e => setData('age', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-slate-300 focus:ring-[#00488b] focus:border-[#00488b] text-sm" placeholder="e.g. 21" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Height (cm)</label>
                                            <input type="number" step="0.01" value={data.height} onChange={e => setData('height', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-slate-300 focus:ring-[#00488b] focus:border-[#00488b] text-sm" placeholder="e.g. 175" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Weight (kg)</label>
                                            <input type="number" step="0.01" value={data.weight} onChange={e => setData('weight', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-slate-300 focus:ring-[#00488b] focus:border-[#00488b] text-sm" placeholder="e.g. 65" />
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex gap-3">
                                        <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
                                        <p className="text-xs text-blue-700 leading-relaxed">Physical data is used for BMI calculation and performance baselines.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-slate-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                                <button type="submit" disabled={processing} className="px-6 py-2.5 text-sm font-bold bg-[#00488b] text-white rounded-xl hover:bg-[#003666] shadow-lg shadow-blue-900/10 transition-all flex items-center gap-2">
                                    {processing ? 'Saving...' : (isEditMode ? 'Update Athlete' : 'Create Athlete')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}