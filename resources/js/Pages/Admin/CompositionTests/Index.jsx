import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Search, User, ChevronRight, Activity, Settings2, Save, Scale, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Index({ athletes, filters, benchmarks }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [activeTab, setActiveTab] = useState('athletes'); // 'athletes' atau 'benchmarks'

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.composition-tests.index'), { search }, { preserveState: true, replace: true });
    };

    // Form untuk Benchmark Settings
    const { data: bData, setData: setBData, post, processing } = useForm({
        benchmarks: benchmarks
    });

    // BUG FIX: Hapus "parseFloat() || 0" agar input bisa dikosongkan saat di-backspace
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
                
                {/* HEADER UTAMA */}
                <div className="bg-white p-6 md:p-8 rounded-lg border border-slate-200 shadow-sm mb-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50"></div>
                    <div className="relative z-10">
                        <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">Management & Analysis</span>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                            Komposisi Tubuh
                        </h2>
                        <p className="text-slate-500 font-medium mt-1 text-sm">Pilih klien untuk melihat dan menambah rekaman tes, atau atur standar evaluasi global.</p>
                    </div>

                    {activeTab === 'athletes' && (
                        <form onSubmit={handleSearch} className="w-full md:w-80 relative z-10">
                            <input type="text" placeholder="Cari nama klien..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-lg border-none outline-none ring-1 ring-slate-200 shadow-sm text-sm focus:ring-2 focus:ring-[#00488b] transition-all bg-slate-50 focus:bg-white font-medium" />
                            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                        </form>
                    )}
                </div>

                {/* TABS NAVIGATION */}
                <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-lg w-fit mx-auto md:mx-0">
                    <button onClick={() => setActiveTab('athletes')} className={`px-6 py-2.5 text-sm font-bold rounded-lg whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'athletes' ? 'bg-white text-[#00488b] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
                        <User className="w-4 h-4"/> Daftar Klien
                    </button>
                    <button onClick={() => setActiveTab('benchmarks')} className={`px-6 py-2.5 text-sm font-bold rounded-lg whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'benchmarks' ? 'bg-white text-[#00488b] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
                        <Settings2 className="w-4 h-4"/> Standar Algoritma
                    </button>
                </div>

                {/* ========================================== */}
                {/* TAB CONTENT: ATHLETES */}
                {/* ========================================== */}
                {activeTab === 'athletes' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-300">
                        {athletes.length > 0 ? athletes.map((athlete) => (
                            <Link key={athlete.id} href={route('admin.composition-tests.show', athlete.id)} className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-blue-200 transition-all group flex items-center gap-5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#00488b]"><ArrowRight className="w-5 h-5"/></div>
                                
                                <div className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-slate-100 shadow-sm bg-blue-50 flex items-center justify-center">
                                    {athlete.profile_photo_url ? <img src={athlete.profile_photo_url} alt={athlete.name} className="w-full h-full object-cover" /> : <User className="w-7 h-7 text-blue-400" />}
                                </div>
                                
                                <div className="flex-1 min-w-0 pr-6">
                                    <h3 className="font-bold text-lg text-slate-800 truncate group-hover:text-[#00488b] transition-colors">{athlete.name}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-emerald-500" /> {athlete.total_tests || 0} Record</p>
                                    </div>
                                    
                                    {athlete.latest_test ? (
                                        <div className="mt-3 text-[10px] font-bold bg-blue-50 text-blue-800 rounded-lg px-3 py-1.5 flex justify-between items-center border border-blue-100/50">
                                            <span className="opacity-70">Update: {new Date(athlete.latest_test.date).toLocaleDateString('id-ID', {day:'2-digit', month:'short'})}</span>
                                            <span className="flex items-center gap-1">BMI: <span className="text-blue-600 bg-white px-1.5 rounded shadow-sm">{athlete.latest_test.bmi}</span></span>
                                        </div>
                                    ) : (
                                        <div className="mt-3 text-[10px] font-bold bg-slate-50 text-slate-400 rounded-lg px-3 py-1.5 border border-slate-100">
                                            Belum ada data tes
                                        </div>
                                    )}
                                </div>
                            </Link>
                        )) : (
                            <div className="col-span-full bg-white p-12 rounded-lg border border-dashed border-slate-300 text-center">
                                <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-slate-700">Klien tidak ditemukan</h3>
                                <p className="text-sm text-slate-500 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* ========================================== */}
                {/* TAB CONTENT: BENCHMARK SETTINGS */}
                {/* ========================================== */}
                {activeTab === 'benchmarks' && (
                    <form onSubmit={submitBenchmarks} className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 md:p-8 animate-in fade-in duration-300">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Settings2 className="w-5 h-5 text-indigo-500" /> Parameter Benchmark Global</h3>
                                <p className="text-sm font-medium text-slate-500 mt-1">Sesuaikan rentang maksimal algoritma warna yang digunakan di seluruh aplikasi.</p>
                            </div>
                            <button type="submit" disabled={processing} className="w-full md:w-auto bg-[#00488b] text-white px-8 py-3 rounded-lg font-bold text-sm flex justify-center items-center gap-2 shadow-lg shadow-blue-900/20 hover:bg-[#003666] transition-all">
                                {processing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-4 h-4"/>}
                                {processing ? 'Menyimpan...' : 'Simpan Parameter'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            
                            {/* KIRI: BMI & VISCERAL */}
                            <div className="space-y-6">
                                {/* CARD BMI */}
                                <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                                    <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                                        <h4 className="font-bold text-slate-700 text-sm tracking-wide">Standar BMI (Kg/M2)</h4>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Universal</span>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-slate-100"><span className="text-slate-500 font-bold text-sm pl-2">Underweight (&lt;)</span> <input type="number" step="0.1" value={bData.benchmarks.bmi.underweight} onChange={e=>handleBenchmarkChange('bmi','underweight',e.target.value)} className="w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#00488b] text-center font-bold text-slate-800"/></div>
                                        <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-emerald-100"><span className="text-emerald-600 font-bold text-sm pl-2">Normal (&lt;)</span> <input type="number" step="0.1" value={bData.benchmarks.bmi.normal} onChange={e=>handleBenchmarkChange('bmi','normal',e.target.value)} className="w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#00488b] text-center font-bold text-slate-800"/></div>
                                        <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-amber-100"><span className="text-amber-500 font-bold text-sm pl-2">Overweight (&lt;)</span> <input type="number" step="0.1" value={bData.benchmarks.bmi.overweight} onChange={e=>handleBenchmarkChange('bmi','overweight',e.target.value)} className="w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#00488b] text-center font-bold text-slate-800"/></div>
                                        <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-rose-100"><span className="text-rose-500 font-bold text-sm pl-2">Obesity I (&lt;)</span> <input type="number" step="0.1" value={bData.benchmarks.bmi.obesity1} onChange={e=>handleBenchmarkChange('bmi','obesity1',e.target.value)} className="w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#00488b] text-center font-bold text-slate-800"/></div>
                                    </div>
                                </div>

                                {/* CARD VISCERAL */}
                                <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                                    <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                                        <h4 className="font-bold text-slate-700 text-sm tracking-wide">Visceral Fat Level</h4>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Universal</span>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-slate-100"><span className="text-slate-500 font-bold text-sm pl-2">Standard (&lt;)</span> <input type="number" step="0.1" value={bData.benchmarks.visceral_fat.standard} onChange={e=>handleBenchmarkChange('visceral_fat','standard',e.target.value)} className="w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#00488b] text-center font-bold text-slate-800"/></div>
                                        <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-rose-100"><span className="text-rose-500 font-bold text-sm pl-2">Danger / High (&lt;)</span> <input type="number" step="0.1" value={bData.benchmarks.visceral_fat.high} onChange={e=>handleBenchmarkChange('visceral_fat','high',e.target.value)} className="w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#00488b] text-center font-bold text-slate-800"/></div>
                                    </div>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-xs font-medium text-blue-800 leading-relaxed">
                                    * Info: Standar Muscle Mass & Bone Mass akan disesuaikan otomatis oleh algoritma sistem berdasarkan umur dan berat badan klien secara spesifik.
                                </div>
                            </div>

                            {/* KANAN: BODY FAT MALE & FEMALE */}
                            <div className="space-y-6">
                                {/* CARD MALE FAT */}
                                <div className="bg-blue-50/50 rounded-lg border border-blue-100 overflow-hidden">
                                    <div className="bg-blue-100/50 px-5 py-3 border-b border-blue-100 flex items-center justify-between">
                                        <h4 className="font-bold text-blue-900 text-sm tracking-wide">Bodyfat Persentase %</h4>
                                        <span className="text-[10px] font-bold text-blue-500 bg-blue-100 px-2 py-0.5 rounded-md uppercase">Laki-Laki</span>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-slate-100"><span className="text-slate-500 font-bold text-sm pl-2 w-28">Esensial (&lt;)</span> <input type="number" step="0.1" value={bData.benchmarks.bodyfat_male.essential} onChange={e=>handleBenchmarkChange('bodyfat_male','essential',e.target.value)} className="w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#00488b] text-center font-bold text-slate-800"/></div>
                                        <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-[#00488b]/20"><span className="text-[#00488b] font-bold text-sm pl-2 w-28">Atlet (&lt;)</span> <input type="number" step="0.1" value={bData.benchmarks.bodyfat_male.athlete} onChange={e=>handleBenchmarkChange('bodyfat_male','athlete',e.target.value)} className="w-20 p-1.5 rounded-lg border-[#00488b] focus:ring-[#00488b] text-center font-bold text-[#00488b]"/></div>
                                        <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-emerald-100"><span className="text-emerald-600 font-bold text-sm pl-2 w-28">Fitness (&lt;)</span> <input type="number" step="0.1" value={bData.benchmarks.bodyfat_male.fitness} onChange={e=>handleBenchmarkChange('bodyfat_male','fitness',e.target.value)} className="w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#00488b] text-center font-bold text-slate-800"/></div>
                                        <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-amber-100"><span className="text-amber-500 font-bold text-sm pl-2 w-28">Acceptable (&lt;)</span> <input type="number" step="0.1" value={bData.benchmarks.bodyfat_male.acceptable} onChange={e=>handleBenchmarkChange('bodyfat_male','acceptable',e.target.value)} className="w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#00488b] text-center font-bold text-slate-800"/></div>
                                    </div>
                                </div>

                                {/* CARD FEMALE FAT */}
                                <div className="bg-rose-50/50 rounded-lg border border-rose-100 overflow-hidden">
                                    <div className="bg-rose-100/50 px-5 py-3 border-b border-rose-100 flex items-center justify-between">
                                        <h4 className="font-bold text-rose-900 text-sm tracking-wide">Bodyfat Persentase %</h4>
                                        <span className="text-[10px] font-bold text-rose-500 bg-rose-100 px-2 py-0.5 rounded-md uppercase">Perempuan</span>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-slate-100"><span className="text-slate-500 font-bold text-sm pl-2 w-28">Esensial (&lt;)</span> <input type="number" step="0.1" value={bData.benchmarks.bodyfat_female.essential} onChange={e=>handleBenchmarkChange('bodyfat_female','essential',e.target.value)} className="w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#00488b] text-center font-bold text-slate-800"/></div>
                                        <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-rose-200"><span className="text-rose-500 font-bold text-sm pl-2 w-28">Atlet (&lt;)</span> <input type="number" step="0.1" value={bData.benchmarks.bodyfat_female.athlete} onChange={e=>handleBenchmarkChange('bodyfat_female','athlete',e.target.value)} className="w-20 p-1.5 rounded-lg border-rose-200 focus:ring-rose-500 text-center font-bold text-rose-500"/></div>
                                        <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-emerald-100"><span className="text-emerald-600 font-bold text-sm pl-2 w-28">Fitness (&lt;)</span> <input type="number" step="0.1" value={bData.benchmarks.bodyfat_female.fitness} onChange={e=>handleBenchmarkChange('bodyfat_female','fitness',e.target.value)} className="w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#00488b] text-center font-bold text-slate-800"/></div>
                                        <div className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm border border-amber-100"><span className="text-amber-500 font-bold text-sm pl-2 w-28">Acceptable (&lt;)</span> <input type="number" step="0.1" value={bData.benchmarks.bodyfat_female.acceptable} onChange={e=>handleBenchmarkChange('bodyfat_female','acceptable',e.target.value)} className="w-20 p-1.5 rounded-lg border-slate-200 focus:ring-[#00488b] text-center font-bold text-slate-800"/></div>
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