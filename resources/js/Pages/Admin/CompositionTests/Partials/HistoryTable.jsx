import { useForm, router } from '@inertiajs/react';
import { Scale, Trash2, Edit3, X, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useState, Fragment } from 'react';

export default function HistoryTable({ history, athlete, benchmarks, is_athlete }) {
    const [editingId, setEditingId] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    const { data, setData, put, processing, reset } = useForm({
        date: '', age: '', metabolic_age: '', weight: '', height: '',
        body_fat_percentage: '', muscle_mass: '', bone_mass: '', visceral_fat: '', bmr: '', total_body_water: ''
    });

    const startEditing = (test) => {
        setEditingId(test.id);
        setExpandedId(null);
        setData({
            date: test.date, age: test.age, metabolic_age: test.metabolic_age || '',
            weight: test.weight, height: test.height, body_fat_percentage: test.body_fat_percentage || '',
            muscle_mass: test.muscle_mass || '', bone_mass: test.bone_mass || '',
            visceral_fat: test.visceral_fat || '', bmr: test.bmr || '', total_body_water: test.total_body_water || ''
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        reset();
    };

    const saveEdit = (id) => {
        put(route('admin.composition-tests.update', id), {
            preserveScroll: true,
            onSuccess: () => { setEditingId(null); reset(); }
        });
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getStatusColor = (type, value) => {
        if (!value) return 'text-slate-400';
        const b = benchmarks;
        if (type === 'bmi') return value < b.bmi.underweight ? 'text-teal-600' : value < b.bmi.normal ? 'text-emerald-600 font-bold' : value < b.bmi.overweight ? 'text-amber-500' : 'text-rose-600 font-bold';
        if (type === 'bodyfat') {
            const st = athlete.gender === 'P' ? b.bodyfat_female : b.bodyfat_male;
            return value < st.athlete ? 'text-teal-600 font-bold' : value < st.fitness ? 'text-emerald-600 font-bold' : value < st.acceptable ? 'text-amber-500' : 'text-rose-600';
        }
        if (type === 'visceral') return value < b.visceral_fat.standard ? 'text-emerald-600 font-bold' : value < b.visceral_fat.high ? 'text-amber-500' : 'text-rose-600 font-bold';
        return 'text-slate-700';
    };

    return (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden min-w-0 w-full">
            
            <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 md:w-5 md:h-5 text-[#ff4d00]" />
                    <h3 className="font-bold text-slate-800 text-sm md:text-base uppercase tracking-widest">Riwayat Komposisi</h3>
                </div>
                <span className="text-[10px] md:text-xs font-bold text-[#ff4d00] bg-orange-50 px-3 py-1 rounded-md border border-orange-100 shadow-sm whitespace-nowrap uppercase tracking-widest">
                    {history.length} Rekaman
                </span>
            </div>

            <div className="overflow-x-auto custom-scrollbar w-full">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#ff4d00] text-white text-[9px] md:text-[10px] uppercase font-bold tracking-widest border-b border-slate-200">
                        <tr>
                            <th className="px-3 md:px-5 py-3">Tanggal & Info</th>
                            <th className="hidden md:table-cell px-2 md:px-4 py-3">Fisik Dasar</th>
                            <th className="hidden md:table-cell px-2 md:px-4 py-3">Detail Komposisi</th>
                            <th className={`px-3 md:px-5 py-3 text-right ${is_athlete ? 'md:hidden' : ''}`}>
                                <span className="md:hidden">Aksi</span>
                                {!is_athlete && <span className="hidden md:inline">Aksi</span>}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {history.length > 0 ? history.map((test) => {
                            const isEditing = editingId === test.id;
                            const isExpanded = expandedId === test.id;

                            // ==========================================
                            // MODE EDIT (RESPONSIVE GRID)
                            // ==========================================
                            if (isEditing && !is_athlete) {
                                return (
                                    <tr key={`edit-${test.id}`} className="bg-orange-50/70 border-l-4 border-l-[#ff4d00] animate-in fade-in duration-200">
                                        <td colSpan={4} className="p-3 md:p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Tanggal & Info</label>
                                                    <input type="date" value={data.date} onChange={e=>setData('date', e.target.value)} className="w-full p-2 text-[10px] md:text-xs rounded-md border-slate-300 focus:ring-[#ff4d00] focus:border-[#ff4d00] outline-none"/>
                                                    <div className="flex gap-1.5">
                                                        <input type="number" placeholder="Usia" value={data.age} onChange={e=>setData('age', e.target.value)} className="w-1/2 p-2 text-[10px] md:text-xs rounded-md border-slate-300 focus:ring-[#ff4d00] focus:border-[#ff4d00] text-center outline-none"/>
                                                        <input type="number" placeholder="MetAge" value={data.metabolic_age} onChange={e=>setData('metabolic_age', e.target.value)} className="w-1/2 p-2 text-[10px] md:text-xs rounded-md border-slate-300 focus:ring-[#ff4d00] focus:border-[#ff4d00] text-center font-bold text-teal-600 outline-none"/>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Fisik Dasar</label>
                                                    <input type="number" step="0.1" placeholder="Berat (kg)" value={data.weight} onChange={e=>setData('weight', e.target.value)} className="w-full p-2 text-[10px] md:text-xs rounded-md border-slate-300 focus:ring-[#ff4d00] focus:border-[#ff4d00] outline-none font-bold"/>
                                                    <input type="number" step="0.01" placeholder="Tinggi (m)" value={data.height} onChange={e=>setData('height', e.target.value)} className="w-full p-2 text-[10px] md:text-xs rounded-md border-slate-300 focus:ring-[#ff4d00] focus:border-[#ff4d00] outline-none"/>
                                                </div>
                                                
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Komposisi (%)</label>
                                                    <div className="grid grid-cols-2 gap-1.5">
                                                        <input type="number" step="0.1" placeholder="Fat %" value={data.body_fat_percentage} onChange={e=>setData('body_fat_percentage', e.target.value)} className="w-full p-2 text-[10px] md:text-xs rounded-md border-slate-300 focus:ring-[#ff4d00] focus:border-[#ff4d00] outline-none text-center font-bold text-rose-500"/>
                                                        <input type="number" step="0.1" placeholder="Musc kg" value={data.muscle_mass} onChange={e=>setData('muscle_mass', e.target.value)} className="w-full p-2 text-[10px] md:text-xs rounded-md border-slate-300 focus:ring-[#ff4d00] focus:border-[#ff4d00] outline-none text-center font-bold text-emerald-600"/>
                                                        <input type="number" step="0.1" placeholder="Visceral" value={data.visceral_fat} onChange={e=>setData('visceral_fat', e.target.value)} className="w-full p-2 text-[10px] md:text-xs rounded-md border-slate-300 focus:ring-[#ff4d00] focus:border-[#ff4d00] outline-none text-center font-bold text-orange-500"/>
                                                        <input type="number" step="0.1" placeholder="TBW %" value={data.total_body_water} onChange={e=>setData('total_body_water', e.target.value)} className="w-full p-2 text-[10px] md:text-xs rounded-md border-slate-300 focus:ring-[#ff4d00] focus:border-[#ff4d00] outline-none text-center font-bold text-teal-600"/>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-col justify-end pt-2 md:pt-0 gap-1.5">
                                                    <button onClick={() => saveEdit(test.id)} disabled={processing} className="w-full p-2 bg-[#ff4d00] hover:bg-[#e64500] text-white rounded-md shadow-sm transition-colors flex justify-center items-center gap-2">
                                                        {processing ? <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"></div> : <><CheckCircle2 className="w-4 h-4"/> <span className="text-xs md:hidden">Simpan</span></>}
                                                    </button>
                                                    <button onClick={cancelEditing} className="w-full p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-md transition-colors flex justify-center items-center gap-2">
                                                        <X className="w-4 h-4"/> <span className="text-xs md:hidden">Batal</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }

                            // ==========================================
                            // MODE VIEW
                            // ==========================================
                            return (
                                <Fragment key={test.id}>
                                    <tr className={`hover:bg-orange-50/30 transition-colors group ${isExpanded ? 'bg-orange-50/10' : ''}`}>
                                        
                                        
                                        <td className="px-3 md:px-5 py-3 align-top min-w-[120px]">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-slate-800 text-xs md:text-sm whitespace-nowrap">
                                                    {new Date(test.date).toLocaleDateString('id-ID', {day:'2-digit', month:'short', year:'numeric'})}
                                                </span>
                                                {test.id === history[0].id && <span className="bg-[#ff4d00] text-white text-[8px] md:text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-widest">New</span>}
                                            </div>
                                            <div className="text-[10px] md:text-xs text-slate-500 font-medium">
                                                Usia: <span className="font-bold text-slate-700">{test.age}</span> | Met: <span className="font-bold text-teal-600">{test.metabolic_age || '-'}</span>
                                            </div>
                                        </td>
                                        
                                        
                                        <td className="hidden md:table-cell px-2 md:px-4 py-3 align-top">
                                            <div className="font-black text-slate-800 text-sm md:text-base mb-0.5 whitespace-nowrap">
                                                {test.weight} <span className="text-[10px] md:text-xs text-slate-400 font-medium">kg</span> <span className="text-slate-300 font-light mx-0.5">/</span> {test.height} <span className="text-[10px] md:text-xs text-slate-400 font-medium">m</span>
                                            </div>
                                            <div className="text-[10px] md:text-xs font-medium text-slate-500">
                                                BMI: <span className={`font-bold ${getStatusColor('bmi', test.bmi)}`}>{test.bmi}</span>
                                            </div>
                                        </td>
                                        
                                        
                                        <td className="hidden md:table-cell px-2 md:px-4 py-3 align-top">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-3 text-[10px] md:text-xs whitespace-nowrap">
                                                    <span className="w-16 text-slate-500 font-medium">Fat: <span className={`${getStatusColor('bodyfat', test.body_fat_percentage)}`}>{test.body_fat_percentage || '-'}%</span></span>
                                                    <span className="text-slate-500 font-medium">Musc: <span className="font-bold text-slate-800">{test.muscle_mass || '-'}kg</span></span>
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] md:text-xs whitespace-nowrap">
                                                    <span className="w-16 text-slate-500 font-medium">Visc: <span className={`${getStatusColor('visceral', test.visceral_fat)}`}>{test.visceral_fat || '-'}</span></span>
                                                    <span className="text-slate-500 font-medium">TBW: <span className="font-bold text-slate-800">{test.total_body_water || '-'}%</span></span>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        
                                        <td className={`px-3 md:px-5 py-3 text-right align-top ${is_athlete ? 'md:hidden' : ''}`}>
                                            <div className="flex items-center justify-end gap-1">
                                                
                                                
                                                <button 
                                                    onClick={() => toggleExpand(test.id)} 
                                                    className={`md:hidden p-1.5 rounded-lg border transition-colors flex items-center justify-center ${isExpanded ? 'bg-[#ff4d00] text-white border-[#ff4d00]' : 'text-[#ff4d00] border-orange-200 hover:bg-orange-50'}`}
                                                >
                                                    {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>

                                                
                                                {!is_athlete && (
                                                    <>
                                                        <button onClick={() => startEditing(test)} className="p-1.5 md:p-2 text-slate-400 hover:text-[#ff4d00] hover:bg-orange-50 rounded-lg transition-colors" title="Edit Baris">
                                                            <Edit3 className="w-4 h-4 md:w-4 md:h-4" />
                                                        </button>
                                                        <button onClick={() => { if(confirm('Hapus permanen data ini?')) router.delete(route('admin.composition-tests.destroy', test.id), {preserveScroll:true}) }} className="p-1.5 md:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus">
                                                            <Trash2 className="w-4 h-4 md:w-4 md:h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>

                                    
                                    {isExpanded && (
                                        <tr className="md:hidden bg-slate-50/50 border-b border-slate-100 shadow-inner">
                                            <td colSpan={4} className="px-3 py-3">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="bg-white p-2.5 rounded-md border border-slate-200/60">
                                                        <span className="text-[9px] font-bold uppercase text-slate-400 block mb-1 tracking-wider">Fisik Dasar</span>
                                                        <div className="font-black text-slate-800 text-sm mb-0.5">
                                                            {test.weight} <span className="text-[10px] text-slate-400 font-medium">kg</span> <br/>
                                                            {test.height} <span className="text-[10px] text-slate-400 font-medium">m</span>
                                                        </div>
                                                        <div className="text-[10px] mt-1 text-slate-500">
                                                            BMI: <span className={`font-bold ${getStatusColor('bmi', test.bmi)}`}>{test.bmi}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="bg-white p-2.5 rounded-md border border-slate-200/60 flex flex-col justify-center space-y-1.5 text-[10px]">
                                                        <span className="text-[9px] font-bold uppercase text-slate-400 block mb-0.5 tracking-wider">Komposisi</span>
                                                        <div className="flex justify-between border-b border-slate-50 pb-1">
                                                            <span className="text-slate-500">Fat:</span>
                                                            <span className={`text-right ${getStatusColor('bodyfat', test.body_fat_percentage)}`}>{test.body_fat_percentage || '-'}%</span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-slate-50 pb-1">
                                                            <span className="text-slate-500">Musc:</span>
                                                            <span className="font-bold text-slate-800 text-right">{test.muscle_mass || '-'}kg</span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-slate-50 pb-1">
                                                            <span className="text-slate-500">Visc:</span>
                                                            <span className={`text-right ${getStatusColor('visceral', test.visceral_fat)}`}>{test.visceral_fat || '-'}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-500">TBW:</span>
                                                            <span className="font-bold text-slate-800 text-right">{test.total_body_water || '-'}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            );
                        }) : (
                            <tr>
                                <td colSpan={4} className="px-4 md:px-6 py-16 text-center text-slate-400 font-medium text-xs md:text-sm">
                                    Belum ada data rekaman tes untuk atlet ini.
                                    {!is_athlete && <><br/><span className="text-[10px] md:text-xs font-bold uppercase tracking-widest mt-2 inline-block">Klik tombol "Input Tes Baru" di atas untuk memulai.</span></>}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}