import { Link, usePage, useForm, router } from '@inertiajs/react';
import { Search, Menu, LogOut, User, Lock, X, Settings, ChevronDown, Save, Shield, Loader2, ArrowRight, Camera, UploadCloud } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios'; 

export default function Navbar({ onMenuClick }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isAthlete = user.role === 'athlete';

    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);
    const searchInputRef = useRef(null);
    const mobileInputRef = useRef(null);

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
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef, searchRef]);

    useEffect(() => {
        if (isMobileSearchOpen && mobileInputRef.current) {
            mobileInputRef.current.focus();
        }
    }, [isMobileSearchOpen]);


    return (
        <>
            <nav className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60 transition-all">
                <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto relative">
                    
                    {isMobileSearchOpen ? (
                        <div className="absolute inset-0 bg-white z-50 flex items-center px-4 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                <input 
                                    ref={mobileInputRef}
                                    type="text" 
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-[#00488b] text-sm"
                                    placeholder="Search athlete..."
                                />
                            </div>
                            <button onClick={() => { setIsMobileSearchOpen(false); setKeyword(''); }} className="p-2 text-slate-500 hover:text-slate-800">
                                <span className="text-xs font-bold">Cancel</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-4">
                                <button onClick={onMenuClick} className="p-2 text-slate-500 hover:bg-slate-100 hover:text-[#00488b] rounded-xl lg:hidden transition-all">
                                    <Menu className="h-6 w-6" />
                                </button>
                                
                                <div className="lg:hidden flex flex-col">
                                    <span className="text-sm font-bold text-slate-800 tracking-tight leading-none">
                                        {isAthlete ? 'Athlete Panel' : 'Dashboard'}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium mt-1 sm:mt-0">ZK15 Analytics</span>
                                </div>
                            </div>

                            {!isAthlete && (
                                <div className="hidden lg:flex flex-1 justify-center max-w-xl mx-auto px-6" ref={searchRef}>
                                    <div className="w-full relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            {isLoading ? <Loader2 className="h-4 w-4 text-[#00488b] animate-spin" /> : <Search className="h-4 w-4 text-slate-400 group-focus-within:text-[#00488b] transition-colors" />}
                                        </div>
                                        <input 
                                            ref={searchInputRef} type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)}
                                            onFocus={() => { if(results.length > 0) setShowResults(true); }}
                                            placeholder="Search athletes, test results, or reports..." 
                                            className="block w-full pl-11 pr-4 py-2.5 rounded-xl border-none bg-slate-100/50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00488b]/10 focus:bg-white transition-all font-medium text-sm shadow-sm hover:bg-slate-100"
                                        />

                                        {showResults && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                                {results.length > 0 ? (
                                                    <ul className="py-2">
                                                        <li className="px-4 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Search Results</li>
                                                        {results.map((result) => (
                                                            <li key={result.id}>
                                                                <Link href={result.url} onClick={() => { setShowResults(false); setKeyword(''); }} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors group">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="h-8 w-8 rounded-full bg-blue-50 text-[#00488b] flex items-center justify-center font-bold text-xs">
                                                                            {result.title.charAt(0)}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-bold text-slate-700 group-hover:text-[#00488b]">{result.title}</p>
                                                                            <p className="text-xs text-slate-400">{result.subtitle}</p>
                                                                        </div>
                                                                    </div>
                                                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#00488b] -translate-x-2 group-hover:translate-x-0 transition-all opacity-0 group-hover:opacity-100" />
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <div className="p-4 text-center text-sm text-slate-500">No results found for "{keyword}".</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 sm:gap-4 pl-4" ref={dropdownRef}>
                                {!isAthlete && (
                                    <button onClick={() => setIsMobileSearchOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
                                        <Search className="h-5 w-5" />
                                    </button>
                                )}

                                <div className="h-8 w-px bg-slate-200 hidden sm:block mx-1"></div>

                                <div className="relative">
                                    <button 
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className={`flex items-center gap-3 pl-1.5 pr-2.5 py-1.5 rounded-full border transition-all duration-200 group ${
                                            isDropdownOpen ? 'bg-white border-[#00488b]/20 shadow-md ring-2 ring-[#00488b]/5' : 'bg-transparent border-transparent hover:bg-white hover:border-slate-100 hover:shadow-sm'
                                        }`}
                                    >
                                        {/* TAMPILKAN FOTO PROFIL (JIKA ADA) ATAU INISIAL (JIKA KOSONG) */}
                                        <div className="h-9 w-9 rounded-full overflow-hidden bg-gradient-to-br from-[#00488b] to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform">
                                            {user.profile_photo_url ? (
                                                <img src={user.profile_photo_url} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                user.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        
                                        <div className="hidden md:block text-left mr-1">
                                            <p className="text-sm font-bold text-slate-700 leading-none group-hover:text-[#00488b] transition-colors truncate max-w-[120px]">
                                                {user.name}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                {user.role}
                                            </p>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 hidden md:block ${isDropdownOpen ? 'rotate-180 text-[#00488b]' : ''}`} />
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                                            <div className="px-5 py-4 border-b border-slate-50 md:hidden bg-slate-50/50 mb-1">
                                                <p className="text-sm font-bold text-slate-800">{user.name}</p>
                                                <p className="text-xs text-slate-500 font-medium capitalize flex items-center gap-1 mt-0.5">
                                                    <Shield className="w-3 h-3" /> {user.role}
                                                </p>
                                            </div>
                                            <div className="p-1.5 space-y-0.5">
                                                <button 
                                                    onClick={() => { setIsEditModalOpen(true); setIsDropdownOpen(false); }}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#00488b] font-medium rounded-xl transition-colors group"
                                                >
                                                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-[#00488b] transition-colors">
                                                        <Settings className="w-4 h-4" />
                                                    </div>
                                                    Edit Profile
                                                </button>
                                            </div>
                                            <div className="h-px bg-slate-100 my-1 mx-2"></div>
                                            <div className="p-1.5">
                                                <Link href={route('logout')} method="post" as="button" className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold rounded-xl transition-colors group">
                                                    <div className="p-1.5 rounded-lg bg-red-50 text-red-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                                                        <LogOut className="w-4 h-4" />
                                                    </div>
                                                    Sign Out
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
                
                {isMobileSearchOpen && showResults && (
                    <div className="absolute top-20 left-0 w-full bg-white shadow-xl border-t border-slate-100 max-h-[60vh] overflow-y-auto z-40">
                         {results.length > 0 ? (
                            <ul className="divide-y divide-slate-50">
                                {results.map((result) => (
                                    <li key={result.id}>
                                        <Link href={result.url} onClick={() => { setIsMobileSearchOpen(false); setKeyword(''); }} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50">
                                            <div className="h-10 w-10 rounded-full bg-blue-50 text-[#00488b] flex items-center justify-center font-bold text-sm">{result.title.charAt(0)}</div>
                                            <div><p className="text-sm font-bold text-slate-800">{result.title}</p><p className="text-xs text-slate-500">{result.subtitle}</p></div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : <div className="p-6 text-center text-slate-500 text-sm">No results found.</div>}
                    </div>
                )}
            </nav>

            {isEditModalOpen && (
                <EditProfileModal user={user} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
            )}
        </>
    );
}

// ==========================================
// MODAL EDIT PROFILE (DENGAN UPLOAD FOTO)
// ==========================================
function EditProfileModal({ user, isOpen, onClose }) {
    
    // State untuk preview foto secara lokal
    const [photoPreview, setPhotoPreview] = useState(user.profile_photo_url || null);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: user.name || '',
        current_password: '',
        password: '',
        password_confirmation: '',
        profile_photo: null,
        _method: 'PATCH', // Penting untuk spoofing form-data di Laravel
    });

    useEffect(() => {
        if (isOpen) {
            reset();
            clearErrors();
            setData('name', user.name);
            setPhotoPreview(user.profile_photo_url || null);
        }
    }, [isOpen]);

    // Handler ketika file dipilih
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_photo', file);
            // Buat preview gambar langsung di browser
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Gunakan post dengan _method: PATCH dan forceFormData: true untuk kirim file
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
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2.5">
                        <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-[#00488b]">
                            <User className="w-5 h-5" />
                        </div>
                        Edit Profile
                    </h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    
                    {/* AREA UPLOAD FOTO TENGAH */}
                    <div className="flex flex-col items-center mb-6">
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="relative w-24 h-24 rounded-full border-2 border-dashed border-slate-300 hover:border-[#00488b] bg-slate-50 hover:bg-blue-50/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group shadow-sm"
                        >
                            {photoPreview ? (
                                <>
                                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center text-slate-400 group-hover:text-[#00488b]">
                                    <UploadCloud className="w-6 h-6 mb-1" />
                                    <span className="text-[10px] font-bold uppercase">Photo</span>
                                </div>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
                        {errors.profile_photo && <p className="text-red-500 text-xs mt-2 font-medium">{errors.profile_photo}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Full Name</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-400 group-focus-within:text-[#00488b] transition-colors" />
                            </div>
                            <input 
                                type="text" 
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="block w-full pl-11 pr-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-[#00488b] focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-800"
                                placeholder="Enter your full name"
                            />
                        </div>
                        {errors.name && <p className="text-red-500 text-xs font-bold ml-1">{errors.name}</p>}
                    </div>
                    
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-px bg-slate-100 flex-1"></div>
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Change Password (Optional)
                            </span>
                            <div className="h-px bg-slate-100 flex-1"></div>
                        </div>
                        <div className="space-y-3">
                            <input 
                                type="password" 
                                value={data.current_password}
                                onChange={e => setData('current_password', e.target.value)}
                                className={`block w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all text-sm ${errors.current_password ? 'border-red-300' : 'border-slate-200 focus:border-[#00488b]'}`}
                                placeholder="Current Password (Required to change)"
                            />
                            {errors.current_password && <p className="text-red-500 text-xs font-bold ml-1">{errors.current_password}</p>}
                            <div className="grid grid-cols-2 gap-3">
                                <input 
                                    type="password" 
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-[#00488b] focus:ring-4 focus:ring-blue-500/10 transition-all text-sm"
                                    placeholder="New Password"
                                />
                                <input 
                                    type="password" 
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className="block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-[#00488b] focus:ring-4 focus:ring-blue-500/10 transition-all text-sm"
                                    placeholder="Confirm Password"
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs font-bold ml-1">{errors.password}</p>}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-5 py-3 text-slate-500 font-bold text-sm hover:bg-slate-50 hover:text-slate-700 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="flex-[2] bg-[#00488b] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#003666] hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}