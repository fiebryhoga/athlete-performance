import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { Calendar, User, Search, ArrowRight, ChevronDown, Sparkles, Target, X } from 'lucide-react';

export default function Create({ athletes }) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        date: new Date().toISOString().split('T')[0], 
        name: ''
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedAthleteLabel, setSelectedAthleteLabel] = useState('');
    const dropdownRef = useRef(null);

    const filteredAthletes = athletes.filter(athlete => 
        athlete.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const selectAthlete = (athlete) => {
        setData('user_id', athlete.id);
        setSelectedAthleteLabel(athlete.label);
        setIsDropdownOpen(false);
        setSearchQuery('');
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.performance.store'));
    };

    return (
        <AdminLayout title="New Test Session" noContainer>
            <Head title="New Session" />

            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-white">
                
                {/* --- LEFT SIDE (THEME ORANGE) --- */}
                <div className="lg:w-5/12 bg-gradient-to-br from-[#ff4d00] to-[#cc3d00] relative overflow-hidden flex flex-col justify-between p-8 lg:p-12 text-white">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/40 to-transparent opacity-50"></div>
                    
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 mb-6 uppercase tracking-widest">
                            <Sparkles className="w-4 h-4 text-orange-200" /> New Session Wizard
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight capitalize">
                            Initiate Performance Testing
                        </h1>
                        <p className="text-orange-100 mt-4 text-sm md:text-base font-medium max-w-md leading-relaxed">
                            Setup a new evaluation session to track and analyze athlete progress based on standardized benchmarks.
                        </p>
                    </div>

                    <div className="relative z-10 mt-12 lg:mt-0 hidden lg:block">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-white text-[#ff4d00] flex items-center justify-center font-bold shadow-lg shadow-black/20">1</div>
                            <span className="font-bold text-lg uppercase tracking-wider">Session Setup</span>
                        </div>
                        <div className="h-10 border-l-2 border-white/20 ml-5 my-1"></div>
                        <div className="flex items-center gap-4 opacity-50">
                            <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-bold">2</div>
                            <span className="font-bold text-lg uppercase tracking-wider">Input Scores</span>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT SIDE (FORM) --- */}
                <div className="lg:w-7/12 flex flex-col justify-center p-6 lg:p-16 bg-white relative">
                    <div className="max-w-lg mx-auto w-full">
                        
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 capitalize">
                                <Target className="w-6 h-6 text-[#ff4d00]" /> Session Details
                            </h2>
                            <p className="text-slate-500 mt-1 text-sm font-medium">Please fill in the required information below.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-8">
                            
                            {/* Input Date */}
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Test Date <span className="text-rose-500">*</span></label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-[#ff4d00] transition-colors" />
                                    </div>
                                    <input 
                                        type="date"
                                        value={data.date}
                                        onChange={e => setData('date', e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]/20 transition-all font-medium text-slate-700 outline-none hover:border-slate-300 shadow-sm"
                                    />
                                </div>
                                {errors.date && <p className="text-rose-500 text-xs font-bold flex items-center gap-1 mt-1.5 ml-1"><X className="w-3 h-3"/> {errors.date}</p>}
                            </div>

                            {/* Custom Select Athlete */}
                            <div className="space-y-2 relative" ref={dropdownRef}>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Select Athlete <span className="text-rose-500">*</span></label>
                                
                                <div 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className={`w-full flex items-center justify-between pl-3 pr-4 py-3 rounded-lg border cursor-pointer transition-all shadow-sm group ${
                                        isDropdownOpen ? 'border-[#ff4d00] ring-2 ring-[#ff4d00]/20 bg-white' : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                                    } ${errors.user_id ? 'border-rose-300 bg-rose-50/50' : ''}`}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`p-2 rounded-lg transition-colors ${selectedAthleteLabel ? 'bg-teal-500 text-white shadow-sm' : 'bg-slate-200 text-slate-400'}`}>
                                            <User className="w-5 h-5" />
                                        </div>
                                        <span className={`truncate font-bold text-sm ${selectedAthleteLabel ? 'text-slate-800' : 'text-slate-400'}`}>
                                            {selectedAthleteLabel || 'Search athlete...'}
                                        </span>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>

                                {/* Dropdown List */}
                                {isDropdownOpen && (
                                    <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top">
                                        <div className="p-2 border-b border-slate-100 bg-slate-50/50 sticky top-0">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                                <input 
                                                    type="text" 
                                                    autoFocus
                                                    placeholder="Type name or sport..."
                                                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] placeholder-slate-400 outline-none transition-all shadow-sm"
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
                                            {filteredAthletes.length > 0 ? (
                                                filteredAthletes.map(athlete => (
                                                    <div 
                                                        key={athlete.id}
                                                        onClick={() => selectAthlete(athlete)}
                                                        className={`px-3 py-2.5 cursor-pointer rounded-lg flex justify-between items-center group transition-all ${
                                                            data.user_id === athlete.id ? 'bg-teal-50 text-teal-700' : 'hover:bg-orange-50 text-slate-700'
                                                        }`}
                                                    >
                                                        <span className={`font-bold text-sm ${data.user_id === athlete.id ? 'text-teal-700' : 'group-hover:text-[#ff4d00]'}`}>{athlete.name}</span>
                                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border transition-colors ${data.user_id === athlete.id ? 'bg-white border-teal-200 text-teal-600' : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:border-orange-200 group-hover:text-[#ff4d00] group-hover:bg-white'}`}>
                                                            {athlete.sport_name}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest flex flex-col items-center gap-2">
                                                    <Search className="w-8 h-8 opacity-20 mb-1" />
                                                    No Athlete Found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {errors.user_id && <p className="text-rose-500 text-xs font-bold mt-1.5 ml-1 flex items-center gap-1"><X className="w-3 h-3"/> Please select an athlete</p>}
                            </div>

                            {/* Input Session Name */}
                            <div className="space-y-2 pt-2">
                                <div className="flex justify-between items-end mb-1.5">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Session Name</label>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Optional</span>
                                </div>
                                <input 
                                    type="text"
                                    placeholder={`e.g. Training - ${data.date}`}
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="block w-full px-4 py-3 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]/20 transition-all font-medium text-slate-700 placeholder-slate-400 hover:border-slate-300 outline-none shadow-sm text-sm"
                                />
                                <p className="text-[10px] text-slate-400 font-medium ml-1 mt-1.5">Will default to date if left blank.</p>
                            </div>

                            <div className="pt-6">
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full bg-[#ff4d00] text-white font-bold py-3.5 rounded-lg shadow-lg shadow-[#ff4d00]/20 hover:bg-[#e64500] hover:shadow-xl hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 text-sm uppercase tracking-widest group disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...</span>
                                    ) : (
                                        <>Continue to Scoring <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}