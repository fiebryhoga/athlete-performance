import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, User, X, Eye, ChevronRight, AlertCircle, Camera, UploadCloud, Users, Save } from 'lucide-react';

// =================================================================
// 1. KOMPONEN UTAMA (Tabel & Layout)
// =================================================================
export default function Index({ athletes, sports, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAthlete, setSelectedAthlete] = useState(null); 

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

    const openCreateModal = () => {
        setSelectedAthlete(null); 
        setIsModalOpen(true);
    };

    const openEditModal = (e, athlete) => {
        e.stopPropagation(); 
        setSelectedAthlete(athlete); 
        setIsModalOpen(true);
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

            
            <div className="bg-white p-5 md:p-8 rounded-lg border border-slate-200 shadow-sm mb-6 md:mb-8 relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 md:gap-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-70 pointer-events-none"></div>
                <div className="relative z-10 w-full lg:w-auto">
                    <span className="text-[10px] font-bold text-[#ff4d00] bg-orange-50 px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">Management</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <Users className="w-7 h-7 md:w-8 md:h-8 text-[#ff4d00]" /> Clients Data
                    </h2>
                    <p className="text-slate-500 font-medium mt-1 text-xs md:text-sm">Kelola profil klien, akun, dan metrik fisik.</p>
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    <form onSubmit={(e) => e.preventDefault()} className="w-full sm:w-72 relative">
                        <input 
                            type="text" 
                            placeholder="Search name or ID..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border-slate-200 shadow-sm text-sm focus:ring-[#ff4d00] focus:border-[#ff4d00] transition-all outline-none" 
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </form>
                    <button 
                        onClick={openCreateModal} 
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff4d00] hover:bg-[#e64500] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-[#ff4d00]/20 transition-all active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> Add Athlete
                    </button>
                </div>
            </div>

            
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col animate-in fade-in duration-300">
                <div className="overflow-x-auto w-full custom-scrollbar">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold tracking-widest text-slate-400">
                            <tr>
                                <th className="px-4 md:px-6 py-4">Athlete Profile</th>
                                
                                <th className="px-4 md:px-6 py-4 hidden md:table-cell">Sport</th>
                                
                                <th className="px-4 md:px-6 py-4 hidden lg:table-cell">Physical (H/W)</th>
                                <th className="px-4 md:px-6 py-4 hidden lg:table-cell">Age / Gender</th>
                                <th className="px-4 md:px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {athletes.data.length > 0 ? (
                                athletes.data.map((athlete) => (
                                    <tr key={athlete.id} onClick={() => handleRowClick(athlete.id)} className="hover:bg-orange-50/50 transition-colors group cursor-pointer">
                                        
                                        <td className="px-4 md:px-6 py-4 align-middle">
                                            <div className="flex items-center gap-3 md:gap-4">
                                                <div className="flex-shrink-0 h-10 w-10 md:h-11 md:w-11 relative">
                                                    {athlete.profile_photo_url ? (
                                                        <img src={athlete.profile_photo_url} alt={athlete.name} className="h-full w-full rounded-full object-cover border border-slate-200 shadow-sm" />
                                                    ) : (
                                                        <div className="h-full w-full rounded-full bg-orange-100 flex items-center justify-center text-[#ff4d00] font-bold border border-orange-200 shadow-sm text-sm md:text-base">
                                                            {athlete.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-800 group-hover:text-[#ff4d00] transition-colors truncate max-w-[140px] sm:max-w-xs">{athlete.name}</div>
                                                    <div className="text-[10px] md:text-xs text-slate-500 font-mono mt-0.5">ID: {athlete.athlete_id}</div>
                                                    
                                                    
                                                    <div className="md:hidden mt-1.5">
                                                        {athlete.sport ? (
                                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-50 text-[#ff4d00] border border-orange-100">
                                                                {athlete.sport.name}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-400 text-[9px] italic font-medium">Not Assigned</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        
                                        <td className="px-4 md:px-6 py-4 align-middle hidden md:table-cell">
                                            {athlete.sport ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-orange-50 text-[#ff4d00] border border-orange-100">
                                                    {athlete.sport.name}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-xs italic font-medium">Not Assigned</span>
                                            )}
                                        </td>

                                        <td className="px-4 md:px-6 py-4 align-middle hidden lg:table-cell">
                                            <div className="text-xs text-slate-600 space-y-1">
                                                <div className="flex items-center gap-2"><span className="text-slate-400 w-4">H:</span><span className="font-bold">{athlete.height ? `${athlete.height} cm` : '-'}</span></div>
                                                <div className="flex items-center gap-2"><span className="text-slate-400 w-4">W:</span><span className="font-bold">{athlete.weight ? `${athlete.weight} kg` : '-'}</span></div>
                                            </div>
                                        </td>

                                        <td className="px-4 md:px-6 py-4 align-middle hidden lg:table-cell">
                                            <div className="text-sm font-bold text-slate-700">{athlete.age ? `${athlete.age} Yrs` : '-'}</div>
                                            <div className="text-[11px] font-bold text-slate-400 uppercase mt-0.5">{athlete.gender === 'L' ? 'Male' : 'Female'}</div>
                                        </td>

                                        <td className="px-4 md:px-6 py-4 align-middle text-right">
                                            
                                            <div className="flex items-center justify-end gap-0.5 md:gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={(e) => { e.stopPropagation(); handleRowClick(athlete.id); }} className="p-1.5 md:p-2 text-slate-400 hover:text-[#ff4d00] hover:bg-orange-50 rounded-lg transition-colors" title="View Detail"><Eye className="w-4 h-4" /></button>
                                                <button onClick={(e) => openEditModal(e, athlete)} className="p-1.5 md:p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={(e) => handleDelete(e, athlete.id)} className="p-1.5 md:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-4 py-16 md:py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <div className="p-3 bg-slate-50 rounded-full mb-3">
                                                <User className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-700">No athletes found</h3>
                                            <p className="text-xs text-slate-500 mt-1 font-medium">Try adjusting your search criteria or add a new athlete.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                
                <div className="px-4 md:px-6 py-3.5 md:py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-[10px] md:text-xs text-slate-500 font-medium whitespace-nowrap">
                        Showing <strong className="text-slate-700">{athletes.from || 0}</strong> to <strong className="text-slate-700">{athletes.to || 0}</strong> of <strong className="text-slate-700">{athletes.total}</strong>
                    </span>
                    <div className="flex flex-wrap justify-center gap-1 w-full sm:w-auto">
                        {athletes.links.map((link, key) => {
                            // MENGHAPUS TEKS "Previous" dan "Next", TINGGALKAN PANAH SAJA
                            let labelHtml = link.label.replace(/Previous/g, '').replace(/Next/g, '').trim();
                            
                            return (
                                <button 
                                    key={key} 
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} 
                                    disabled={!link.url || link.active} 
                                    className={`px-2.5 md:px-3 py-1 md:py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center justify-center min-w-[32px] ${link.active ? 'bg-[#ff4d00] text-white border-[#ff4d00] shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:text-[#ff4d00] hover:border-orange-200 hover:bg-orange-50'} ${!link.url && 'opacity-50 cursor-not-allowed bg-transparent border-transparent'}`} 
                                    dangerouslySetInnerHTML={{ __html: labelHtml }} 
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            
            {isModalOpen && (
                <AthleteFormModal 
                    athlete={selectedAthlete} 
                    sports={sports} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </AdminLayout>
    );
}

// =================================================================
// 2. KOMPONEN MODAL MANDIRI
// =================================================================
function AthleteFormModal({ athlete, sports, onClose }) {
    const isEditMode = !!athlete;
    
    const { data, setData, post, processing, reset, errors } = useForm({
        name: athlete?.name || '',
        athlete_id: athlete?.athlete_id || '',
        password: '',
        sport_id: athlete?.sport_id || '',
        gender: athlete?.gender || 'L',
        age: athlete?.age || '',
        height: athlete?.height || '',
        weight: athlete?.weight || '',
        profile_photo: null, 
        _method: isEditMode ? 'PUT' : 'POST',     
    });

    const [photoPreview, setPhotoPreview] = useState(athlete?.profile_photo_url || null);
    const fileInputRef = useRef(null);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = isEditMode ? route('admin.athletes.update', athlete.id) : route('admin.athletes.store');
        
        post(url, {
            forceFormData: true, 
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            
            <div className="relative bg-white w-full max-w-3xl max-h-full sm:max-h-[90vh] flex flex-col rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 transform-gpu overflow-hidden">
                
                <div className="sticky top-0 z-20 px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 bg-white shadow-sm flex justify-between items-center">
                    <div>
                        <h3 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2">
                            <User className="w-4 h-4 md:w-5 md:h-5 text-[#ff4d00]" />
                            {isEditMode ? 'Edit Athlete Data' : 'Add New Athlete'}
                        </h3>
                        <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-0.5">{isEditMode ? 'Update existing profile information.' : 'Register a new athlete to the system.'}</p>
                    </div>
                    <button type="button" onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto custom-scrollbar overscroll-contain flex-1">
                    <form onSubmit={handleSubmit} className="p-5 md:p-8">
                        
                        <div className="mb-6 md:mb-8 flex flex-col items-center">
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-dashed border-slate-300 hover:border-[#ff4d00] bg-slate-50 hover:bg-orange-50/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group"
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
                                        <UploadCloud className="w-6 h-6 md:w-8 md:h-8 mb-1" />
                                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider">Upload</span>
                                    </div>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
                            {errors.profile_photo && <p className="text-rose-500 text-xs mt-2 font-bold">{errors.profile_photo}</p>}
                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 mt-2 md:mt-3 uppercase tracking-widest">JPEG, PNG up to 2MB</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <div className="space-y-4 md:space-y-5">
                                <h4 className="text-[10px] font-bold text-[#ff4d00] uppercase tracking-widest mb-2 border-b border-orange-100 pb-2">Account Information</h4>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] text-sm transition-all outline-none shadow-sm" placeholder="e.g. John Doe" />
                                    {errors.name && <p className="text-rose-500 text-xs mt-1 font-bold ml-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Athlete ID (Login)</label>
                                    <input type="text" value={data.athlete_id} onChange={e => setData('athlete_id', e.target.value)} disabled={isEditMode} className="w-full px-4 py-2.5 rounded-lg border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] text-sm disabled:bg-slate-100 disabled:text-slate-400 transition-all outline-none font-medium shadow-sm" placeholder="e.g. ATL-001" />
                                    {errors.athlete_id && <p className="text-rose-500 text-xs mt-1 font-bold ml-1">{errors.athlete_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Password {isEditMode && <span className="text-[9px] font-medium text-slate-400 normal-case tracking-normal">(Leave blank to keep)</span>}</label>
                                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] text-sm transition-all outline-none shadow-sm" placeholder="••••••••" />
                                    {errors.password && <p className="text-rose-500 text-xs mt-1 font-bold ml-1">{errors.password}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Sport Category</label>
                                    <div className="relative">
                                        <select value={data.sport_id} onChange={e => setData('sport_id', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] text-sm appearance-none bg-white transition-all outline-none shadow-sm font-medium">
                                            <option value="">-- Select Sport --</option>
                                            {sports.map(sport => <option key={sport.id} value={sport.id}>{sport.name}</option>)}
                                        </select>
                                        <ChevronRight className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 md:space-y-5">
                                <h4 className="text-[10px] font-bold text-[#ff4d00] uppercase tracking-widest mb-2 border-b border-orange-100 pb-2">Physical Metrics</h4>
                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Gender</label>
                                        <div className="relative">
                                            <select value={data.gender} onChange={e => setData('gender', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] text-sm appearance-none bg-white transition-all outline-none shadow-sm font-medium">
                                                <option value="L">Male</option>
                                                <option value="P">Female</option>
                                            </select>
                                            <ChevronRight className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Age</label>
                                        <input type="number" value={data.age} onChange={e => setData('age', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] text-sm transition-all outline-none shadow-sm" placeholder="e.g. 21" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Height (cm)</label>
                                        <input type="number" step="0.01" value={data.height} onChange={e => setData('height', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] text-sm transition-all outline-none shadow-sm" placeholder="e.g. 175" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Weight (kg)</label>
                                        <input type="number" step="0.01" value={data.weight} onChange={e => setData('weight', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border-slate-200 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] text-sm transition-all outline-none shadow-sm" placeholder="e.g. 65" />
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-3 md:p-4 rounded-lg border border-slate-100 flex gap-2.5 md:gap-3 mt-2">
                                    <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-relaxed">Physical data is used for BMI calculations, algorithms, and performance baselines.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2.5 md:gap-3 mt-8 md:mt-10 pt-4 md:pt-5 border-t border-slate-100">
                            <button type="button" onClick={onClose} className="flex-1 px-4 md:px-5 py-2.5 md:py-3 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                            <button type="submit" disabled={processing} className="flex-[2] px-4 md:px-6 py-2.5 md:py-3 text-sm font-bold bg-[#ff4d00] text-white rounded-lg hover:bg-[#e64500] shadow-lg shadow-[#ff4d00]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                                {processing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-4 h-4" />}
                                {processing ? 'Saving...' : (isEditMode ? 'Update Athlete' : 'Create Athlete')}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}