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
        <AdminLayout title="new test session" noContainer>
            <Head title="new session" />

            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-white">
                
                <div className="lg:w-5/12 bg-[#00488b] relative overflow-hidden flex flex-col justify-between p-8 lg:p-12 text-white">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#003666] to-transparent opacity-50"></div>
                    
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-medium border border-white/20 mb-6">
                            <Sparkles className="w-4 h-4 text-blue-200" /> new session wizard
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight   leading-tight">
                            initiate performance testing
                        </h1>
                        <p className="text-blue-100 mt-4 text-lg font-light   max-w-md leading-relaxed">
                            setup a new evaluation session to track and analyze athlete progress based on standardized benchmarks.
                        </p>
                    </div>

                    <div className="relative z-10 mt-12 lg:mt-0 hidden lg:block">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-white text-[#00488b] flex items-center justify-center font-bold shadow-lg shadow-blue-900/20">1</div>
                            <span className="font-bold text-lg  ">session setup</span>
                        </div>
                        <div className="h-10 border-l-2 border-white/20 ml-5 my-1"></div>
                        <div className="flex items-center gap-4 opacity-50">
                            <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-bold">2</div>
                            <span className="font-medium text-lg  ">input scores</span>
                        </div>
                    </div>
                </div>

                <div className="lg:w-7/12 flex flex-col justify-center p-6 lg:p-16 bg-white relative">
                    <div className="max-w-lg mx-auto w-full">
                        
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-800   flex items-center gap-2">
                                <Target className="w-6 h-6 text-[#00488b]" /> session details
                            </h2>
                            <p className="text-slate-500 mt-1  ">please fill in the required information below.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-8">
                            
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-slate-700  ">test date <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-[#00488b] transition-colors" />
                                    </div>
                                    <input 
                                        type="date"
                                        value={data.date}
                                        onChange={e => setData('date', e.target.value)}
                                        className="block w-full pl-12 pr-4 py-4 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-[#00488b] focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700   hover:border-slate-300"
                                    />
                                </div>
                                {errors.date && <p className="text-red-500 text-xs font-bold   flex items-center gap-1 mt-2"><X className="w-3 h-3"/> {errors.date}</p>}
                            </div>

                            <div className="space-y-3 relative" ref={dropdownRef}>
                                <label className="block text-sm font-bold text-slate-700  ">select athlete <span className="text-red-500">*</span></label>
                                
                                <div 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className={`w-full flex items-center justify-between pl-4 pr-4 py-4 rounded-xl border cursor-pointer transition-all group ${
                                        isDropdownOpen ? 'border-[#00488b] ring-4 ring-blue-500/10 bg-white' : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                                    } ${errors.user_id ? 'border-red-300 bg-red-50/50' : ''}`}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`p-2 rounded-lg transition-colors ${selectedAthleteLabel ? 'bg-[#00488b] text-white shadow-md' : 'bg-slate-200 text-slate-400'}`}>
                                            <User className="w-5 h-5" />
                                        </div>
                                        <span className={`truncate font-medium   ${selectedAthleteLabel ? 'text-slate-900 text-base' : 'text-slate-400'}`}>
                                            {selectedAthleteLabel || 'search athlete...'}
                                        </span>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>

                                {isDropdownOpen && (
                                    <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top">
                                        <div className="p-3 border-b border-slate-50 bg-white sticky top-0">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                                <input 
                                                    type="text" 
                                                    autoFocus
                                                    placeholder="type name or sport..."
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#00488b]/20 placeholder-slate-400 lowercase"
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                                            {filteredAthletes.length > 0 ? (
                                                filteredAthletes.map(athlete => (
                                                    <div 
                                                        key={athlete.id}
                                                        onClick={() => selectAthlete(athlete)}
                                                        className={`px-4 py-3 cursor-pointer rounded-xl flex justify-between items-center group transition-all ${
                                                            data.user_id === athlete.id ? 'bg-blue-50 text-[#00488b]' : 'hover:bg-slate-50 text-slate-700'
                                                        }`}
                                                    >
                                                        <span className={`font-bold text-sm   ${data.user_id === athlete.id ? 'text-[#00488b]' : 'group-hover:text-[#00488b]'}`}>{athlete.name}</span>
                                                        <span className={`text-xs   px-2.5 py-1 rounded-md border transition-colors ${data.user_id === athlete.id ? 'bg-white border-blue-100 text-[#00488b]' : 'bg-white border-slate-100 text-slate-500 group-hover:border-blue-100 group-hover:text-blue-600'}`}>
                                                            {athlete.sport_name}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-8 text-center text-slate-400 text-sm   flex flex-col items-center gap-2">
                                                    <Search className="w-8 h-8 opacity-20 mb-1" />
                                                    no athlete found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {errors.user_id && <p className="text-red-500 text-xs font-bold   mt-2 flex items-center gap-1"><X className="w-3 h-3"/> please select an athlete</p>}
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between items-end">
                                    <label className="block text-sm font-bold text-slate-700  ">session name</label>
                                    <span className="text-[10px] font-bold text-slate-400   bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">optional</span>
                                </div>
                                <input 
                                    type="text"
                                    placeholder={`e.g. training - ${data.date}`}
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="block w-full px-4 py-4 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-[#00488b] focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700 placeholder-slate-400   hover:border-slate-300"
                                />
                                <p className="text-xs text-slate-400 pl-1  ">will default to date if left blank.</p>
                            </div>

                            <div className="pt-8">
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full bg-[#00488b] text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-900/20 hover:bg-[#003666] hover:shadow-2xl hover:-translate-y-1 transition-all flex justify-center items-center gap-3   text-lg group disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> processing...</span>
                                    ) : (
                                        <>continue to scoring <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
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