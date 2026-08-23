import { Link, usePage, useForm } from '@inertiajs/react';
import { Search, Menu, LogOut, User, Lock, X, Settings, ChevronDown, Save, Shield, Loader2, ArrowRight, Camera, UploadCloud, ChevronRight, Home, Plus, Calendar, Dumbbell, ClipboardList, Users, Flame } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios'; 

export default function Navbar({ onMobileMenuClick }) {
    const { auth, url } = usePage().props;
    const pageUrl = usePage().url;
    const user = auth.user;
    const isAthlete = user.role === 'athlete';

    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    const dropdownRef = useRef(null);
    const quickActionRef = useRef(null);
    const searchRef = useRef(null);
    const searchInputRef = useRef(null);
    const mobileInputRef = useRef(null);

    // Dynamic Breadcrumbs mapping
    const breadcrumbs = useMemo(() => {
        const pathSegments = pageUrl.split('?')[0].split('/').filter(Boolean);
        
        const segmentNames = {
            'dashboard': 'Overview',
            'admin': 'Admin',
            'athletes': 'Profiling',
            'dpa': 'Analysis DPA',
            'performance': 'Tes Fisik',
            'composition': 'Komposisi Tubuh',
            'phv-calculator': 'Kalkulator PHV',
            'meal-plans': 'Rencana Makan',
            'wellness-rpe': 'Wellness & Beban',
            'recovery-strategies': 'Recovery Strategi',
            'daily-metrics': 'Pantauan Harian',
            'load-analysis': 'Analisis Beban',
            'sports': 'Kategori Olahraga',
            'exercises': 'Master Exercise',
            'dpa-compensations': 'DPA Compensations',
            'packages': 'Manajemen Paket',
            'users': 'Manajemen Pengguna',
            'reports': 'Laporan',
            'sessions': 'Rekap Sesi',
            'settings': 'Pengaturan Sistem',
            'profiling': 'Profil Fisik',
            'gym-attendance': 'Absensi Gym',
            'individual-trainings': 'Program Latihan',
            'group-trainings': 'Latihan Grup',
            'create': 'Tambah Baru',
            'edit': 'Edit Data',
        };

        // Jika halaman utama /dashboard -> "Dashboard > Overview"
        if (pathSegments.length === 0 || (pathSegments.length === 1 && pathSegments[0] === 'dashboard')) {
            return [
                { name: 'Dashboard', route: '/dashboard', isCurrent: false },
                { name: 'Overview', route: null, isCurrent: true }
            ];
        }

        const isUnderAdmin = pathSegments.includes('admin');
        const items = [{ name: 'Dashboard', route: '/dashboard', isCurrent: false }];
        let accumulatedPath = isUnderAdmin ? '/admin' : '';

        pathSegments.forEach((segment, idx) => {
            if (segment === 'admin' || segment === 'dashboard') return;
            accumulatedPath += `/${segment}`;
            
            const isLast = idx === pathSegments.length - 1;
            const label = segmentNames[segment] || (!isNaN(segment) ? 'Detail' : segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' '));

            items.push({
                name: label,
                route: isLast ? null : accumulatedPath,
                isCurrent: isLast
            });
        });

        return items;
    }, [pageUrl]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (keyword.length > 1) {
                performSearch(keyword);
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 300); 

        return () => clearTimeout(delayDebounceFn);
    }, [keyword]);

    const performSearch = async (query) => {
        setIsLoading(true);
        try {
            const response = await axios.get(route('global.search'), {
                params: { query }
            });
            setResults(response.data);
            setShowResults(true);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (quickActionRef.current && !quickActionRef.current.contains(event.target)) {
                setIsQuickActionOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef, quickActionRef, searchRef]);

    useEffect(() => {
        if (isMobileSearchOpen && mobileInputRef.current) {
            mobileInputRef.current.focus();
        }
    }, [isMobileSearchOpen]);

    return (
        <>
            <nav className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
                <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-6 max-w-[1920px] mx-auto relative gap-4">
                    
                    {/* Mobile Search Overlay */}
                    {isMobileSearchOpen ? (
                        <div className="absolute inset-0 bg-white z-50 flex items-center px-4 gap-3 animate-in fade-in slide-in-from-top-1 duration-150">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input 
                                    ref={mobileInputRef}
                                    type="text" 
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    className="w-full pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-orange-500 text-xs outline-none transition-all"
                                    placeholder="Cari atlet, data tes, jadwal..."
                                />
                            </div>
                            <button onClick={() => { setIsMobileSearchOpen(false); setKeyword(''); }} className="p-2 text-slate-500 hover:text-slate-800 rounded-lg">
                                <span className="text-xs font-semibold">Batal</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Left Side: Mobile Menu & Breadcrumbs */}
                            <div className="flex items-center gap-2.5 shrink-0">
                                {/* Mobile Menu Button */}
                                <button onClick={onMobileMenuClick} className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-orange-600 rounded-lg lg:hidden transition-all">
                                    <Menu className="h-5 w-5" />
                                </button>
                                
                                {/* Breadcrumb Navigation */}
                                <nav className="flex items-center gap-1.5 text-xs" aria-label="Breadcrumb">
                                    <Link 
                                        href="/dashboard" 
                                        className="text-slate-400 hover:text-slate-700 flex items-center gap-1 shrink-0 transition-colors p-1 rounded-md hover:bg-slate-50"
                                        title="Dashboard"
                                    >
                                        <Home className="w-3.5 h-3.5" />
                                    </Link>
                                    
                                    {breadcrumbs.map((crumb, idx) => (
                                        <div key={idx} className="flex items-center gap-1.5">
                                            {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />}
                                            {crumb.isCurrent ? (
                                                <span className="font-semibold text-slate-900 text-xs">
                                                    {crumb.name}
                                                </span>
                                            ) : (
                                                <Link 
                                                    href={crumb.route || '#'} 
                                                    className="text-slate-400 hover:text-slate-700 transition-colors text-xs font-medium"
                                                >
                                                    {crumb.name}
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                </nav>
                            </div>

                            {/* Center Search Bar - Well Proportioned */}
                            <div className="hidden md:flex justify-center max-w-[420px] w-full mx-4" ref={searchRef}>
                                <div className="w-full relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        {isLoading ? <Loader2 className="h-4 w-4 text-orange-500 animate-spin" /> : <Search className="h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />}
                                    </div>
                                    <input 
                                        ref={searchInputRef} 
                                        type="text" 
                                        value={keyword} 
                                        onChange={(e) => setKeyword(e.target.value)}
                                        onFocus={() => { if(results.length > 0) setShowResults(true); }}
                                        placeholder={isAthlete ? "Cari fitur, jadwal, atau analisis..." : "Cari atlet, tes fisik, atau jadwal..."} 
                                        className="block w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200/90 bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all font-medium text-xs shadow-2xs hover:bg-white"
                                    />

                                    {showResults && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-100 z-50">
                                            {results.length > 0 ? (
                                                <ul className="py-1 divide-y divide-slate-50">
                                                    <li className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">Hasil Pencarian</li>
                                                    {results.map((result) => (
                                                        <li key={result.id}>
                                                            <Link href={result.url} onClick={() => { setShowResults(false); setKeyword(''); }} className="flex items-center justify-between px-3.5 py-2.5 hover:bg-orange-50/60 transition-colors group">
                                                                <div className="flex items-center gap-2.5 min-w-0">
                                                                    <div className="h-7 w-7 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0">
                                                                        {result.title.charAt(0)}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors truncate">{result.title}</p>
                                                                        <p className="text-[10px] text-slate-400 font-medium truncate">{result.subtitle}</p>
                                                                    </div>
                                                                </div>
                                                                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-500 -translate-x-1 group-hover:translate-x-0 transition-all opacity-0 group-hover:opacity-100 shrink-0" />
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="p-4 text-center text-xs font-medium text-slate-500">Tidak ada hasil untuk "{keyword}".</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Side: Quick Action & Profile */}
                            <div className="flex items-center justify-end gap-2.5 sm:gap-3 shrink-0">
                                <button onClick={() => setIsMobileSearchOpen(true)} className="md:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-all">
                                    <Search className="h-4 w-4" />
                                </button>

                                {/* Quick Action Button [ + Input Baru ▾ ] */}
                                {!isAthlete && (
                                    <div className="relative" ref={quickActionRef}>
                                        <button 
                                            onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
                                            className={`hidden sm:inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold transition-all duration-150 active:scale-95 ${
                                                isQuickActionOpen 
                                                    ? 'text-orange-600 font-bold' 
                                                    : 'text-slate-700 hover:text-orange-600'
                                            }`}
                                        >
                                            <span>Input Baru</span>
                                            <ChevronDown size={12} className={`transition-transform duration-150 opacity-70 ${isQuickActionOpen ? 'rotate-180 opacity-100 text-orange-600' : ''}`} />
                                        </button>

                                        {/* Quick Action Dropdown */}
                                        {isQuickActionOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200/80 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                                                <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                    Pintasan Aksi Cepat
                                                </div>
                                                <div className="space-y-0.5">
                                                    <Link
                                                        href={route('admin.individual-trainings.index')}
                                                        onClick={() => setIsQuickActionOpen(false)}
                                                        className="flex items-center gap-2.5 px-2.5 py-2 text-xs text-slate-700 hover:bg-orange-50/70 hover:text-orange-700 font-medium rounded-lg transition-colors group"
                                                    >
                                                        <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-orange-100 group-hover:text-orange-600 transition-all">
                                                            <Calendar size={13} />
                                                        </div>
                                                        <span>Program Latihan</span>
                                                    </Link>
                                                    <Link
                                                        href={route('admin.performance.index')}
                                                        onClick={() => setIsQuickActionOpen(false)}
                                                        className="flex items-center gap-2.5 px-2.5 py-2 text-xs text-slate-700 hover:bg-orange-50/70 hover:text-orange-700 font-medium rounded-lg transition-colors group"
                                                    >
                                                        <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-orange-100 group-hover:text-orange-600 transition-all">
                                                            <ClipboardList size={13} />
                                                        </div>
                                                        <span>Tes Fisik</span>
                                                    </Link>
                                                    <Link
                                                        href={route('admin.athletes.index')}
                                                        onClick={() => setIsQuickActionOpen(false)}
                                                        className="flex items-center gap-2.5 px-2.5 py-2 text-xs text-slate-700 hover:bg-orange-50/70 hover:text-orange-700 font-medium rounded-lg transition-colors group"
                                                    >
                                                        <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-orange-100 group-hover:text-orange-600 transition-all">
                                                            <Users size={13} />
                                                        </div>
                                                        <span>Profil Atlet</span>
                                                    </Link>
                                                    <Link
                                                        href={route('admin.meal-plans.index')}
                                                        onClick={() => setIsQuickActionOpen(false)}
                                                        className="flex items-center gap-2.5 px-2.5 py-2 text-xs text-slate-700 hover:bg-orange-50/70 hover:text-orange-700 font-medium rounded-lg transition-colors group"
                                                    >
                                                        <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-orange-100 group-hover:text-orange-600 transition-all">
                                                            <Flame size={13} />
                                                        </div>
                                                        <span>Rencana Makan</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Profile Dropdown Button */}
                                <div className="relative" ref={dropdownRef}>
                                    <button 
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className={`flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-full border transition-all duration-150 group ${
                                            isDropdownOpen ? 'bg-slate-50 border-slate-300 shadow-2xs' : 'bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-200'
                                        }`}
                                    >
                                        {/* Orange Background Avatar if no profile photo */}
                                        <div className="h-7 w-7 rounded-full overflow-hidden bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                                            {user.profile_photo_url ? (
                                                <img src={user.profile_photo_url} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                user.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        
                                        <div className="hidden sm:block text-left mr-0.5">
                                            <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                                                {user.name}
                                            </p>
                                            <p className="text-[10px] font-medium text-slate-400 capitalize">
                                                {user.role}
                                            </p>
                                        </div>
                                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 hidden sm:block ${isDropdownOpen ? 'rotate-180 text-slate-700' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-slate-200/80 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                            <div className="px-3.5 py-2 border-b border-slate-100 sm:hidden bg-slate-50/50 mb-1">
                                                <p className="text-xs font-bold text-slate-800">{user.name}</p>
                                                <p className="text-[10px] font-semibold capitalize text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <Shield className="w-3 h-3 text-orange-500" /> {user.role}
                                                </p>
                                            </div>
                                            <div className="px-1.5 space-y-0.5">
                                                <button 
                                                    onClick={() => { setIsEditModalOpen(true); setIsDropdownOpen(false); }}
                                                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-lg transition-colors group"
                                                >
                                                    <div className="p-1 rounded-md bg-slate-100 text-slate-500 group-hover:text-slate-800 transition-all">
                                                        <Settings className="w-3.5 h-3.5" />
                                                    </div>
                                                    Edit Profile
                                                </button>
                                            </div>
                                            <div className="h-px bg-slate-100 my-1 mx-1.5"></div>
                                            <div className="px-1.5">
                                                <Link href={route('logout')} method="post" as="button" className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 font-medium rounded-lg transition-colors group">
                                                    <div className="p-1 rounded-md bg-rose-50 text-rose-500 transition-all">
                                                        <LogOut className="w-3.5 h-3.5" />
                                                    </div>
                                                    Keluar Sesi
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
                
                {/* Mobile Search Result Drawer */}
                {isMobileSearchOpen && showResults && (
                    <div className="absolute top-16 left-0 w-full bg-white shadow-xl border-t border-slate-100 max-h-[60vh] overflow-y-auto z-40 custom-scrollbar">
                         {results.length > 0 ? (
                            <ul className="divide-y divide-slate-50">
                                {results.map((result) => (
                                    <li key={result.id}>
                                        <Link href={result.url} onClick={() => { setIsMobileSearchOpen(false); setKeyword(''); }} className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors">
                                            <div className="h-8 w-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shadow-xs shrink-0">{result.title.charAt(0)}</div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">{result.title}</p>
                                                <p className="text-[10px] font-medium text-slate-500">{result.subtitle}</p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : <div className="p-4 text-center text-slate-500 text-xs font-medium">Tidak ada hasil ditemukan.</div>}
                    </div>
                )}
            </nav>

            {isEditModalOpen && (
                <EditProfileModal user={user} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
            )}
        </>
    );
}




function EditProfileModal({ user, isOpen, onClose }) {
    
    const [photoPreview, setPhotoPreview] = useState(user.profile_photo_url || null);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: user.name || '',
        current_password: '',
        password: '',
        password_confirmation: '',
        profile_photo: null,
        _method: 'PATCH', 
    });

    useEffect(() => {
        if (isOpen) {
            reset();
            clearErrors();
            setData('name', user.name);
            setPhotoPreview(user.profile_photo_url || null);
        }
    }, [isOpen]);

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
        post(route('profile.update'), { 
            forceFormData: true,
            onSuccess: () => {
                onClose();
                reset();
            },
            onError: (err) => console.log(err),
            preserveScroll: true,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                    <h3 className="font-bold text-base text-slate-800 flex items-center gap-2.5">
                        <div className="p-1.5 bg-white rounded-lg shadow-xs border border-slate-100 text-orange-500">
                            <User className="w-4 h-4" />
                        </div>
                        Edit Profile
                    </h3>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 custom-scrollbar max-h-[80vh] overflow-y-auto">
                    
                    {/* AREA UPLOAD FOTO TENGAH */}
                    <div className="flex flex-col items-center mb-4">
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="relative w-20 h-20 rounded-full border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50 hover:bg-orange-50/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group shadow-2xs"
                        >
                            {photoPreview ? (
                                <>
                                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-5 h-5 text-white" />
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center text-slate-400 group-hover:text-orange-500">
                                    <UploadCloud className="w-5 h-5 mb-0.5" />
                                    <span className="text-[9px] font-bold">Foto</span>
                                </div>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
                        {errors.profile_photo && <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.profile_photo}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 ml-1">Nama Lengkap</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                            </div>
                            <input 
                                type="text" 
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="block w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-medium text-slate-800 text-xs outline-none shadow-2xs"
                                placeholder="Masukkan nama lengkap"
                            />
                        </div>
                        {errors.name && <p className="text-rose-500 text-xs font-bold ml-1">{errors.name}</p>}
                    </div>
                    
                    <div className="space-y-3 pt-1">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-px bg-slate-100 flex-1"></div>
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Ganti Password
                            </span>
                            <div className="h-px bg-slate-100 flex-1"></div>
                        </div>
                        <div className="space-y-2.5">
                            <input 
                                type="password" 
                                value={data.current_password}
                                onChange={e => setData('current_password', e.target.value)}
                                className={`block w-full px-3.5 py-2 rounded-lg border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 transition-all text-xs outline-none shadow-2xs font-medium ${errors.current_password ? 'border-rose-300' : 'border-slate-200 focus:border-orange-500'}`}
                                placeholder="Password Sekarang (Wajib jika ubah)"
                            />
                            {errors.current_password && <p className="text-rose-500 text-xs font-bold ml-1">{errors.current_password}</p>}
                            <div className="grid grid-cols-2 gap-2.5">
                                <input 
                                    type="password" 
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="block w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-xs outline-none shadow-2xs font-medium"
                                    placeholder="Password Baru"
                                />
                                <input 
                                    type="password" 
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className="block w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-xs outline-none shadow-2xs font-medium"
                                    placeholder="Konfirmasi Password"
                                />
                            </div>
                            {errors.password && <p className="text-rose-500 text-xs font-bold ml-1">{errors.password}</p>}
                        </div>
                    </div>

                    <div className="flex gap-2.5 pt-4 border-t border-slate-100">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-slate-600 font-semibold text-xs hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="flex-[2] bg-orange-500 text-white font-semibold text-xs rounded-lg shadow-xs hover:bg-orange-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 py-2"
                        >
                            {processing ? (
                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <Save className="w-3.5 h-3.5" />
                            )}
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}