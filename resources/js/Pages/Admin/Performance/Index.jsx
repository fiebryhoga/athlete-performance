import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { 
    Plus, Calendar, User, Activity, Search, Filter, 
    X, ChevronDown, Check, Edit3, ArrowUpRight, Trash2, Target 
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Index({ tests, sports, filters = {} }) {
    
    // 1. Get User Data for Role Check
    const { auth } = usePage().props;
    const isAthlete = auth.user.role === 'athlete';

    // State Filter
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedSport, setSelectedSport] = useState(filters?.sport_id || '');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                route('admin.performance.index'),
                { search: search, sport_id: selectedSport },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 400);

        return () => clearTimeout(timer);
    }, [search, selectedSport]);

    const resetFilters = () => {
        setSearch('');
        setSelectedSport('');
    };

    const selectedSportLabel = sports.find(s => s.id.toString() === selectedSport.toString())?.name || "All Sports";

    // --- PERFORMANCE STATUS LOGIC ---
    const getPerformanceStatus = (val) => {
        const score = parseFloat(val);
        
        if (score >= 90) return { 
            label: 'Excellent', 
            badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', 
            bar: 'bg-emerald-500' 
        };
        if (score >= 80) return { 
            label: 'Good', 
            badge: 'bg-blue-100 text-blue-700 border-blue-200', 
            bar: 'bg-blue-500' 
        };
        if (score >= 70) return { 
            label: 'Average', 
            badge: 'bg-yellow-100 text-yellow-700 border-yellow-200', 
            bar: 'bg-yellow-400' 
        };
        if (score >= 60) return { 
            label: 'Fair', 
            badge: 'bg-orange-100 text-orange-700 border-orange-200', 
            bar: 'bg-orange-500' 
        };
        return { 
            label: 'Poor', 
            badge: 'bg-red-100 text-red-700 border-red-200', 
            bar: 'bg-red-500' 
        };
    };

    // Handle Delete Data
    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete the test data for "${name}"? This action cannot be undone.`)) {
            router.delete(route('admin.performance.destroy', id));
        }
    };

    return (
        <AdminLayout title="Performance History">
            <Head title="Performance History" />

            {/* --- HEADER --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Performance History</h1>
                    <p className="text-slate-500 text-sm mt-1">Monitor athlete scores and progress over time.</p>
                </div>
                
                {!isAthlete && (
                    <Link 
                        href={route('admin.performance.create')} 
                        className="flex items-center gap-2 bg-[#00488b] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-900/10 hover:bg-[#003666] hover:shadow-xl transition-all transform active:scale-95 text-sm"
                    >
                        <Plus className="w-5 h-5" />
                        New Test Entry
                    </Link>
                )}
            </div>

            {/* --- FILTER --- */}
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-2 items-center relative z-20">
                <div className="relative w-full md:flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search athlete name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-transparent placeholder-slate-400 focus:ring-2 focus:ring-[#00488b]/20 text-sm font-medium text-slate-700"
                    />
                </div>

                <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

                <div className="relative w-full md:w-64">
                    {isDropdownOpen && (
                        <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsDropdownOpen(false)}></div>
                    )}
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-sm font-medium text-slate-700 group"
                    >
                        <div className="flex items-center gap-2 truncate">
                            <Filter className={`h-4 w-4 ${selectedSport ? 'text-[#00488b]' : 'text-slate-400'}`} />
                            <span className={`truncate ${selectedSport ? 'text-[#00488b] font-bold' : ''}`}>
                                {selectedSportLabel}
                            </span>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-full md:w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-80 overflow-y-auto">
                            <div 
                                className={`px-4 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between group ${selectedSport === '' ? 'bg-blue-50/50' : ''}`}
                                onClick={() => { setSelectedSport(''); setIsDropdownOpen(false); }}
                            >
                                <span className={`text-sm  ${selectedSport === '' ? 'font-bold text-[#00488b]' : 'text-slate-600'}`}>All Sports</span>
                                {selectedSport === '' && <Check className="w-4 h-4 text-[#00488b]" />}
                            </div>
                            <div className="h-px bg-slate-100 my-1"></div>
                            {sports.map((sport) => (
                                <div 
                                    key={sport.id}
                                    className={`px-4 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between group ${selectedSport == sport.id ? 'bg-blue-50/50' : ''}`}
                                    onClick={() => { setSelectedSport(sport.id); setIsDropdownOpen(false); }}
                                >
                                    <span className={`text-sm  ${selectedSport == sport.id ? 'font-bold text-[#00488b]' : 'text-slate-600'}`}>{sport.name}</span>
                                    {selectedSport == sport.id && <Check className="w-4 h-4 text-[#00488b]" />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {(search || selectedSport) && (
                    <button 
                        onClick={resetFilters}
                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Reset Filters"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* --- CARD GRID --- */}
            {tests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-0">
                    {tests.map((test) => {
                        // Calculate Status in Frontend
                        const status = getPerformanceStatus(test.average_score);

                        return (
                            <div key={test.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 flex flex-col overflow-hidden">
                                
                                {/* Card Header */}
                                <div className="px-6 py-5 border-b border-slate-50 bg-white">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${status.badge}`}>
                                            {status.label}
                                        </span>
                                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" /> {test.date}
                                        </span>
                                    </div>
                                    
                                    <h3 className="font-bold text-slate-800 text-lg truncate group-hover:text-[#00488b] transition-colors">
                                        {test.athlete?.name || 'Unknown Athlete'}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <div className="p-1 rounded bg-slate-100 text-slate-500"><User className="w-3 h-3" /></div>
                                        <p className="text-xs text-slate-500 font-medium">
                                            {test.athlete?.sport?.name || '-'}
                                        </p>
                                    </div>
                                </div>

                                {/* Main Score Display */}
                                <div className="px-6 py-6 bg-slate-50/50 border-b border-slate-50 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Score</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black text-slate-800 tracking-tight">{test.average_score}</span>
                                            <span className="text-sm font-bold text-slate-400">/100</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Target Ideal</p>
                                        <div className="flex items-center justify-end gap-1 text-slate-600">
                                            <Target className="w-3.5 h-3.5 text-slate-400" />
                                            <p className="text-lg font-bold">100</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Breakdown Category */}
                                <div className="px-6 py-5 bg-white flex-1">
                                    <p className="text-xs font-bold text-slate-400 mb-4 flex items-center gap-1.5 uppercase tracking-wide">
                                        <Activity className="w-3.5 h-3.5" /> Performance Breakdown
                                    </p>
                                    <div className="space-y-3">
                                        {Object.entries(test.category_scores || {}).slice(0, 3).map(([category, score]) => {
                                            const catStatus = getPerformanceStatus(score);
                                            return (
                                                <div key={category} className="group/item">
                                                    <div className="flex justify-between items-end mb-1">
                                                        <span className="text-xs font-semibold text-slate-600 truncate max-w-[120px]">{category}</span>
                                                        <span className="text-xs font-bold text-slate-800">{score}</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full transition-all duration-500 ${catStatus.bar}`} 
                                                            style={{ width: `${score}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {Object.keys(test.category_scores || {}).length > 3 && (
                                            <p className="text-[10px] text-center text-slate-400 pt-1 italic">
                                                +{Object.keys(test.category_scores).length - 3} other categories...
                                            </p>
                                        )}
                                        {Object.keys(test.category_scores || {}).length === 0 && (
                                            <p className="text-[10px] text-slate-400 italic">No breakdown details available.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Actions Footer */}
                                <div className={`grid ${isAthlete ? 'grid-cols-1' : 'grid-cols-3 divide-x divide-slate-100'} border-t border-slate-100`}>
                                    {!isAthlete && (
                                        <>
                                            <button
                                                onClick={() => handleDelete(test.id, test.athlete?.name)}
                                                className="py-3.5 text-xs font-bold text-slate-400 hover:text-red-600 hover:bg-red-50/50 transition-colors flex items-center justify-center gap-2"
                                                title="Delete Record"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Delete</span>
                                            </button>

                                            <Link 
                                                href={route('admin.performance.edit', test.id)}
                                                className="py-3.5 text-xs font-bold text-slate-500 hover:text-amber-600 hover:bg-amber-50/50 transition-colors flex items-center justify-center gap-2"
                                                title="Edit Score"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Edit</span>
                                            </Link>
                                        </>
                                    )}

                                    <Link 
                                        href={route('admin.performance.show', test.id)}
                                        className="py-3.5 text-xs font-bold text-[#00488b] hover:text-white hover:bg-[#00488b] transition-colors flex items-center justify-center gap-2 group/btn"
                                    >
                                        Details <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-slate-800 font-bold text-lg">No Data Found</h3>
                    <p className="text-slate-500 text-sm mt-1 mb-6">Try changing your search keywords or filters.</p>
                    <button 
                        onClick={resetFilters} 
                        className="px-6 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-sm shadow-sm"
                    >
                        Reset Filter
                    </button>
                </div>
            )}
        </AdminLayout>
    );
}