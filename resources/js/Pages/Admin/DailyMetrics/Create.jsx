import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { Calendar, User, Search, ChevronDown, Activity, Save, X } from 'lucide-react';

export default function Create({ athletes }) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        record_date: new Date().toISOString().split('T')[0],
        week: 'Week 1',
        rhr: '',
        spo2: '',
        weight: '',
        vj: '',
        quick_recovery_score: ''
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

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.daily-metrics.store'));
    };

    return (
        <AdminLayout title="Daily Monitoring" noContainer>
            <Head title="Daily Monitoring" />
            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-slate-50">
                <div className="lg:w-full flex justify-center p-6 lg:p-12">
                    <div className="max-w-3xl w-full bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                        <div className="mb-8 border-b border-slate-100 pb-6">
                            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                <Activity className="w-6 h-6 text-[#00488b]" /> Record Daily Metrics
                            </h2>
                            <p className="text-slate-500 mt-1">Input athlete's daily resting heart rate, recovery, and other metrics.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* ATHLETE DROPDOWN */}
                                <div className="space-y-2 relative" ref={dropdownRef}>
                                    <label className="block text-sm font-bold text-slate-700">Select Athlete <span className="text-red-500">*</span></label>
                                    <div 
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className={`w-full flex items-center justify-between pl-4 pr-4 py-3.5 rounded-xl border cursor-pointer transition-all ${isDropdownOpen ? 'border-[#00488b] ring-4 ring-blue-500/10' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}
                                    >
                                        <span className={`truncate font-medium ${selectedAthleteLabel ? 'text-slate-900' : 'text-slate-400'}`}>
                                            {selectedAthleteLabel || 'Search athlete...'}
                                        </span>
                                        <ChevronDown className="w-5 h-5 text-slate-400" />
                                    </div>

                                    {isDropdownOpen && (
                                        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                                            <div className="p-3 border-b border-slate-50 bg-white sticky top-0">
                                                <input 
                                                    type="text" 
                                                    placeholder="Type name..."
                                                    className="w-full pl-4 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#00488b]/20"
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                            <div className="max-h-60 overflow-y-auto p-2">
                                                {filteredAthletes.map(athlete => (
                                                    <div 
                                                        key={athlete.id}
                                                        onClick={() => {
                                                            setData('user_id', athlete.id);
                                                            setSelectedAthleteLabel(athlete.label);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className="px-4 py-3 cursor-pointer rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-sm"
                                                    >
                                                        {athlete.name} <span className="text-xs font-normal text-slate-400">({athlete.sport_name})</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {errors.user_id && <p className="text-red-500 text-xs font-bold">{errors.user_id}</p>}
                                </div>

                                {/* DATE */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700">Record Date <span className="text-red-500">*</span></label>
                                    <input 
                                        type="date"
                                        value={data.record_date}
                                        onChange={e => setData('record_date', e.target.value)}
                                        className="block w-full px-4 py-3.5 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-[#00488b] focus:ring-4 focus:ring-blue-500/10 font-medium text-slate-700"
                                    />
                                    {errors.record_date && <p className="text-red-500 text-xs font-bold">{errors.record_date}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700">Week Label</label>
                                    <input type="text" value={data.week} onChange={e => setData('week', e.target.value)} className="block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:border-[#00488b]" placeholder="e.g. Week 17" />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700">RHR (Resting Heart Rate)</label>
                                    <input type="number" value={data.rhr} onChange={e => setData('rhr', e.target.value)} className="block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:border-[#00488b]" placeholder="e.g. 61" />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700">SpO2 (%)</label>
                                    <input type="number" value={data.spo2} onChange={e => setData('spo2', e.target.value)} className="block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:border-[#00488b]" placeholder="e.g. 98" />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700">Weight (BB)</label>
                                    <input type="number" value={data.weight} onChange={e => setData('weight', e.target.value)} className="block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:border-[#00488b]" placeholder="e.g. 70" />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700">Vertical Jump (VJ)</label>
                                    <input type="number" step="0.01" value={data.vj} onChange={e => setData('vj', e.target.value)} className="block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:border-[#00488b]" placeholder="e.g. 30.66" />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700">Quick Recovery Score</label>
                                    <input type="number" value={data.quick_recovery_score} onChange={e => setData('quick_recovery_score', e.target.value)} className="block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:border-[#00488b]" placeholder="0 - 100" />
                                </div>
                            </div>

                            <div className="pt-6">
                                <button type="submit" disabled={processing} className="w-full bg-[#ff4d00] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#003666] transition-all flex justify-center items-center gap-2">
                                    <Save className="w-5 h-5" /> {processing ? 'Processing...' : 'Save & Calculate Metrics'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}