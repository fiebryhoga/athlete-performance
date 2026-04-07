import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Search, User, ChevronRight, Activity, Settings2, Save, Scale, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Index({ athletes, filters, benchmarks }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [activeTab, setActiveTab] = useState('athletes'); 

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.composition-tests.index'), { search }, { preserveState: true, replace: true });
    };

    
    const { data: bData, setData: setBData, post, processing } = useForm({
        benchmarks: benchmarks
    });

    const handleBenchmarkChange = (category, key, value) => {
        setBData('benchmarks', {
            ...bData.benchmarks,
            [category]: { 
                ...bData.benchmarks[category], 
                [key]: value === '' ? '' : value 
            }
        });
    };

    const submitBenchmarks = (e) => {
        e.preventDefault();
        post(route('admin.composition-tests.save-benchmarks'), { preserveScroll: true });
    };

    return (
        <AdminLayout title="Body Composition">
            <Head title="Body Composition Tests" />
            <div className="max-w-[1200px] mx-auto pb-12">
                
                
                <div className="bg-white p-5 md:p-8 rounded-lg border border-slate-200 shadow-sm mb-6 md:mb-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-5 md:gap-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-70 pointer-events-none"></div>
                    <div className="relative z-10">
                        <span className="text-[10px] font-bold text-[#ff4d00] bg-orange-50 px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block border border-orange-100/50">Management & Analysis</span>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                            Body Composition
                        </h2>
                        <p className="text-slate-500 font-medium mt-1 text-sm">Pilih klien untuk melihat dan menambah rekaman tes, atau atur standar evaluasi global.</p>
                    </div>

                    {activeTab === 'athletes' && (
                        <form onSubmit={handleSearch} className="w-full md:w-80 relative z-10">
                            <input type="text" placeholder="Cari nama klien..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-lg border-none outline-none ring-1 ring-slate-200 shadow-sm text-sm focus:ring-2 focus:ring-[#ff4d00] transition-all bg-slate-50 focus:bg-white font-medium" />
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 md:top-3.5" />
                        </form>
                    )}
                </div>

                
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-6 md:mb-8 bg-slate-100 p-1.5 rounded-lg w-full sm:w-fit">
                    <button onClick={() => setActiveTab('athletes')} className={`flex-1 sm:flex-none justify-center px-4 py-2.5 text-[11px] md:text-xs font-bold uppercase tracking-widest rounded-lg whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'athletes' ? 'bg-white text-[#ff4d00] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
                        <User className="w-3.5 h-3.5 md:w-4 md:h-4"/> Daftar Klien
                    </button>
                    <button onClick={() => setActiveTab('benchmarks')} className={`flex-1 sm:flex-none justify-center px-4 py-2.5 text-[11px] md:text-xs font-bold uppercase tracking-widest rounded-lg whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'benchmarks' ? 'bg-white text-[#ff4d00] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
                        <Settings2 className="w-3.5 h-3.5 md:w-4 md:h-4"/> Algoritma
                    </button>
                </div>

                
                
                
                {activeTab === 'athletes' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 animate-in fade-in duration-300">
                        {athletes.length > 0 ? athletes.map((athlete) => (
                            <Link key={athlete.id} href={route('admin.composition-tests.show', athlete.id)} className="bg-white rounded-lg p-4 md:p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-orange-200 transition-all group flex items-center gap-4 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#ff4d00]"><ArrowRight className="w-4 h-4"/></div>
                                
                                <div className="relative shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border border-orange-100 shadow-sm bg-orange-50 flex items-center justify-center transition-colors group-hover:border-orange-200">
                                    {athlete.profile_photo_url ? <img src={athlete.profile_photo_url} alt={athlete.name} className="w-full h-full object-cover" /> : <User className="w-6 h-6 md:w-7 md:h-7 text-[#ff4d00]" />}
                                </div>
                                
                                <div className="flex-1 min-w-0 pr-5">
                                    <h3 className="font-bold text-base md:text-lg text-slate-800 truncate group-hover:text-[#ff4d00] transition-colors">{athlete.name}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <p className="text-[10px] md:text-[11px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1"><Activity className="w-3 h-3 text-teal-500" /> {athlete.total_tests || 0} Record</p>
                                    </div>
                                    
                                    {athlete.latest_test ? (
                                        <div className="mt-3 text-[9px] md:text-[10px] font-bold bg-orange-50 text-orange-800 rounded-md px-2 md:px-3 py-1.5 flex justify-between items-center border border-orange-100 uppercase tracking-widest">
                                            <span className="opacity-70 truncate pr-1">Upd: {new Date(athlete.latest_test.date).toLocaleDateString('id-ID', {day:'2-digit', month:'short'})}</span>
                                            <span className="flex items-center gap-1 shrink-0">BMI: <span className="text-[#ff4d00] bg-white px-1.5 rounded shadow-sm">{athlete.latest_test.bmi}</span></span>
                                        </div>
                                    ) : (
                                        <div className="mt-3 text-[9px] md:text-[10px] font-bold bg-slate-50 text-slate-400 rounded-md px-3 py-1.5 border border-slate-100 uppercase tracking-widest">
                                            Belum ada data tes
                                        </div>
                                    )}
                                </div>
                            </Link>
                        )) : (
                            <div className="col-span-full bg-white p-8 md:p-12 rounded-lg border border-dashed border-slate-300 text-center shadow-sm">
                                <div className="p-3 md:p-4 bg-slate-50 rounded-full inline-block mb-3">
                                    <Scale className="w-8 h-8 md:w-10 md:h-10 text-slate-300" />
                                </div>
                                <h3 className="text-base md:text-lg font-bold text-slate-700">Klien tidak ditemukan</h3>
                                <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">Coba gunakan kata kunci pencarian yang lain.</p>
                            </div>
                        )}
                    </div>
                )}

                
                
                
                {activeTab === 'benchmarks' && (
                    <form onSubmit={submitBenchmarks} className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-6 md:p-8 animate-in fade-in duration-300">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8 border-b border-slate-100 pb-5 md:pb-6">
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                                    <Settings2 className="w-4 h-4 md:w-5 md:h-5 text-[#ff4d00]" /> Parameter Benchmark
                                </h3>
                                <p className="text-xs md:text-sm font-medium text-slate-500 mt-1">Sesuaikan rentang maksimal algoritma warna yang digunakan di seluruh sistem.</p>
                            </div>
                            <button type="submit" disabled={processing} className="w-full md:w-auto bg-[#ff4d00] text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-bold text-sm flex justify-center items-center gap-2 shadow-lg shadow-[#ff4d00]/20 hover:bg-[#e64500] hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 uppercase tracking-widest">
                                {processing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-4 h-4"/>}
                                {processing ? 'Menyimpan...' : 'Simpan Parameter'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                            
                            
                            <div className="space-y-6">
                                
                                <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                                    <div className="bg-slate-100 px-4 md:px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                                        <h4 className="font-bold text-slate-700 text-xs md:text-sm tracking-wide uppercase">Standar BMI (Kg/M2)</h4>
                                        <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Universal</span>
                                    </div>
                                    <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                                        <div className="flex flex-row items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                                            <span className="text-slate-500 font-bold text-xs md:text-sm pl-1 md:pl-2 truncate pr-2">Underweight (&lt;)</span> 
                                            <input type="number" step="0.1" value={bData.benchmarks.bmi.underweight} onChange={e=>handleBenchmarkChange('bmi','underweight',e.target.value)} className="w-16 md:w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#ff4d00] text-center font-bold text-slate-800 outline-none text-sm"/>
                                        </div>
                                        <div className="flex flex-row items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-teal-100">
                                            <span className="text-teal-600 font-bold text-xs md:text-sm pl-1 md:pl-2 truncate pr-2">Normal (&lt;)</span> 
                                            <input type="number" step="0.1" value={bData.benchmarks.bmi.normal} onChange={e=>handleBenchmarkChange('bmi','normal',e.target.value)} className="w-16 md:w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#ff4d00] text-center font-bold text-slate-800 outline-none text-sm"/>
                                        </div>
                                        <div className="flex flex-row items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-amber-100">
                                            <span className="text-amber-500 font-bold text-xs md:text-sm pl-1 md:pl-2 truncate pr-2">Overweight (&lt;)</span> 
                                            <input type="number" step="0.1" value={bData.benchmarks.bmi.overweight} onChange={e=>handleBenchmarkChange('bmi','overweight',e.target.value)} className="w-16 md:w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#ff4d00] text-center font-bold text-slate-800 outline-none text-sm"/>
                                        </div>
                                        <div className="flex flex-row items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-rose-100">
                                            <span className="text-rose-500 font-bold text-xs md:text-sm pl-1 md:pl-2 truncate pr-2">Obesity I (&lt;)</span> 
                                            <input type="number" step="0.1" value={bData.benchmarks.bmi.obesity1} onChange={e=>handleBenchmarkChange('bmi','obesity1',e.target.value)} className="w-16 md:w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#ff4d00] text-center font-bold text-slate-800 outline-none text-sm"/>
                                        </div>
                                    </div>
                                </div>

                                
                                <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                                    <div className="bg-slate-100 px-4 md:px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                                        <h4 className="font-bold text-slate-700 text-xs md:text-sm tracking-wide uppercase">Visceral Fat Level</h4>
                                        <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Universal</span>
                                    </div>
                                    <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                                        <div className="flex flex-row items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                                            <span className="text-slate-500 font-bold text-xs md:text-sm pl-1 md:pl-2 truncate pr-2">Standard (&lt;)</span> 
                                            <input type="number" step="0.1" value={bData.benchmarks.visceral_fat.standard} onChange={e=>handleBenchmarkChange('visceral_fat','standard',e.target.value)} className="w-16 md:w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#ff4d00] text-center font-bold text-slate-800 outline-none text-sm"/>
                                        </div>
                                        <div className="flex flex-row items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-rose-100">
                                            <span className="text-rose-500 font-bold text-xs md:text-sm pl-1 md:pl-2 truncate pr-2">Danger / High (&lt;)</span> 
                                            <input type="number" step="0.1" value={bData.benchmarks.visceral_fat.high} onChange={e=>handleBenchmarkChange('visceral_fat','high',e.target.value)} className="w-16 md:w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#ff4d00] text-center font-bold text-slate-800 outline-none text-sm"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-orange-50 p-3 md:p-4 rounded-lg border border-orange-100 text-[10px] md:text-xs font-medium text-[#ff4d00] leading-relaxed">
                                    * Info: Standar Muscle Mass & Bone Mass akan disesuaikan otomatis oleh algoritma sistem berdasarkan umur dan berat badan klien.
                                </div>
                            </div>

                            
                            <div className="space-y-6">
                                
                                <div className="bg-teal-50/30 rounded-lg border border-teal-100 overflow-hidden">
                                    <div className="bg-teal-50 px-4 md:px-5 py-3 border-b border-teal-100 flex items-center justify-between">
                                        <h4 className="font-bold text-teal-900 text-xs md:text-sm tracking-wide uppercase">Bodyfat Persentase %</h4>
                                        <span className="text-[9px] md:text-[10px] font-bold text-teal-600 bg-teal-100/50 px-2 py-0.5 rounded-md uppercase tracking-widest">Laki-Laki</span>
                                    </div>
                                    <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                                        <div className="flex flex-row items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                                            <span className="text-slate-500 font-bold text-xs md:text-sm pl-1 md:pl-2 truncate pr-2">Esensial (&lt;)</span> 
                                            <input type="number" step="0.1" value={bData.benchmarks.bodyfat_male.essential} onChange={e=>handleBenchmarkChange('bodyfat_male','essential',e.target.value)} className="w-16 md:w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#ff4d00] text-center font-bold text-slate-800 outline-none text-sm"/>
                                        </div>
                                        <div className="flex flex-row items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-teal-200">
                                            <span className="text-teal-600 font-bold text-xs md:text-sm pl-1 md:pl-2 truncate pr-2">Atlet (&lt;)</span> 
                                            <input type="number" step="0.1" value={bData.benchmarks.bodyfat_male.athlete} onChange={e=>handleBenchmarkChange('bodyfat_male','athlete',e.target.value)} className="w-16 md:w-20 p-1.5 rounded-lg border-teal-200 focus:ring-teal-500 text-center font-black text-teal-600 outline-none text-sm"/>
                                        </div>
                                        <div className="flex flex-row items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-emerald-100">
                                            <span className="text-emerald-600 font-bold text-xs md:text-sm pl-1 md:pl-2 truncate pr-2">Fitness (&lt;)</span> 
                                            <input type="number" step="0.1" value={bData.benchmarks.bodyfat_male.fitness} onChange={e=>handleBenchmarkChange('bodyfat_male','fitness',e.target.value)} className="w-16 md:w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#ff4d00] text-center font-bold text-slate-800 outline-none text-sm"/>
                                        </div>
                                        <div className="flex flex-row items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-amber-100">
                                            <span className="text-amber-500 font-bold text-xs md:text-sm pl-1 md:pl-2 truncate pr-2">Acceptable (&lt;)</span> 
                                            <input type="number" step="0.1" value={bData.benchmarks.bodyfat_male.acceptable} onChange={e=>handleBenchmarkChange('bodyfat_male','acceptable',e.target.value)} className="w-16 md:w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#ff4d00] text-center font-bold text-slate-800 outline-none text-sm"/>
                                        </div>
                                    </div>
                                </div>

                                
                                <div className="bg-rose-50/50 rounded-lg border border-rose-100 overflow-hidden">
                                    <div className="bg-rose-100/50 px-4 md:px-5 py-3 border-b border-rose-100 flex items-center justify-between">
                                        <h4 className="font-bold text-rose-900 text-xs md:text-sm tracking-wide uppercase">Bodyfat Persentase %</h4>
                                        <span className="text-[9px] md:text-[10px] font-bold text-rose-500 bg-rose-100/50 px-2 py-0.5 rounded-md uppercase tracking-widest">Perempuan</span>
                                    </div>
                                    <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                                        <div className="flex flex-row items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                                            <span className="text-slate-500 font-bold text-xs md:text-sm pl-1 md:pl-2 truncate pr-2">Esensial (&lt;)</span> 
                                            <input type="number" step="0.1" value={bData.benchmarks.bodyfat_female.essential} onChange={e=>handleBenchmarkChange('bodyfat_female','essential',e.target.value)} className="w-16 md:w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#ff4d00] text-center font-bold text-slate-800 outline-none text-sm"/>
                                        </div>
                                        <div className="flex flex-row items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-rose-200">
                                            <span className="text-rose-500 font-bold text-xs md:text-sm pl-1 md:pl-2 truncate pr-2">Atlet (&lt;)</span> 
                                            <input type="number" step="0.1" value={bData.benchmarks.bodyfat_female.athlete} onChange={e=>handleBenchmarkChange('bodyfat_female','athlete',e.target.value)} className="w-16 md:w-20 p-1.5 rounded-lg border-rose-200 focus:ring-rose-500 text-center font-black text-rose-500 outline-none text-sm"/>
                                        </div>
                                        <div className="flex flex-row items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-emerald-100">
                                            <span className="text-emerald-600 font-bold text-xs md:text-sm pl-1 md:pl-2 truncate pr-2">Fitness (&lt;)</span> 
                                            <input type="number" step="0.1" value={bData.benchmarks.bodyfat_female.fitness} onChange={e=>handleBenchmarkChange('bodyfat_female','fitness',e.target.value)} className="w-16 md:w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#ff4d00] text-center font-bold text-slate-800 outline-none text-sm"/>
                                        </div>
                                        <div className="flex flex-row items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-amber-100">
                                            <span className="text-amber-500 font-bold text-xs md:text-sm pl-1 md:pl-2 truncate pr-2">Acceptable (&lt;)</span> 
                                            <input type="number" step="0.1" value={bData.benchmarks.bodyfat_female.acceptable} onChange={e=>handleBenchmarkChange('bodyfat_female','acceptable',e.target.value)} className="w-16 md:w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#ff4d00] text-center font-bold text-slate-800 outline-none text-sm"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}