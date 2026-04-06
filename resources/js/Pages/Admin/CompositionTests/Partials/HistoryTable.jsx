import { useForm, router } from '@inertiajs/react';
import { Scale, Trash2, Edit3, X, Save, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function HistoryTable({ history, athlete, benchmarks, is_athlete }) {
    const [editingId, setEditingId] = useState(null);

    const { data, setData, put, processing, reset } = useForm({
        date: '', age: '', metabolic_age: '', weight: '', height: '',
        body_fat_percentage: '', muscle_mass: '', bone_mass: '', visceral_fat: '', bmr: '', total_body_water: ''
    });

    const startEditing = (test) => {
        setEditingId(test.id);
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

    const getStatusColor = (type, value) => {
        if (!value) return 'text-slate-400';
        const b = benchmarks;
        if (type === 'bmi') return value < b.bmi.underweight ? 'text-blue-500' : value < b.bmi.normal ? 'text-emerald-500 font-bold' : value < b.bmi.overweight ? 'text-amber-500' : 'text-rose-500  font-bold';
        if (type === 'bodyfat') {
            const st = athlete.gender === 'P' ? b.bodyfat_female : b.bodyfat_male;
            return value < st.athlete ? 'text-blue-600 font-bold' : value < st.fitness ? 'text-emerald-500 font-bold' : value < st.acceptable ? 'text-amber-500' : 'text-rose-500';
        }
        if (type === 'visceral') return value < b.visceral_fat.standard ? 'text-emerald-500 font-bold' : value < b.visceral_fat.high ? 'text-amber-500' : 'text-rose-500 font-bold';
        return 'text-slate-700';
    };

    return (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden min-w-0 w-full">
            <div className="px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-[#00488b]" />
                    <h3 className="font-bold text-slate-800 text-sm md:text-base">Tabel Riwayat Komposisi</h3>
                </div>
                <span className="text-[10px] md:text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm whitespace-nowrap">
                    {history.length} Rekaman
                </span>
            </div>

            <div className="overflow-x-auto custom-scrollbar w-full">
                <table className="w-full text-sm text-left whitespace-nowrap min-w-[850px]">
                    <thead className="bg-[#00488b] text-white text-[10px] uppercase font-bold tracking-widest border-b border-slate-200">
                        <tr>
                            <th className="px-4 md:px-6 py-4">Tanggal</th>
                            <th className="px-2 py-4 text-center">Age/Met.</th>
                            <th className="px-2 py-4 text-center">W / H</th>
                            <th className="px-2 py-4 text-center bg-blue-800/30">BMI</th>
                            <th className="px-2 py-4 text-center bg-blue-800/30">Body Fat %</th>
                            <th className="px-2 py-4 text-center">Muscle (kg)</th>
                            <th className="px-2 py-4 text-center">Visceral</th>
                            <th className="px-2 py-4 text-center">TBW %</th>
                            {/* SEMBUNYIKAN HEADER AKSI JIKA ATLET */}
                            {!is_athlete && <th className="px-4 md:px-6 py-4 text-right">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {history.length > 0 ? history.map((test) => {
                            const isEditing = editingId === test.id;

                            if (isEditing && !is_athlete) {
                                return (
                                    <tr key={test.id} className="bg-blue-50/50 border-l-4 border-l-blue-500 animate-in fade-in duration-200">
                                        <td className="px-2 py-3"><input type="date" value={data.date} onChange={e=>setData('date', e.target.value)} className="w-full min-w-[110px] max-w-[125px] p-1.5 text-xs rounded border-slate-300 focus:ring-blue-500"/></td>
                                        <td className="px-1 py-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <input type="number" placeholder="Age" value={data.age} onChange={e=>setData('age', e.target.value)} className="w-12 p-1.5 text-xs rounded border-slate-300 text-center"/>
                                                <span className="text-slate-400">/</span>
                                                <input type="number" placeholder="Met" value={data.metabolic_age} onChange={e=>setData('metabolic_age', e.target.value)} className="w-12 p-1.5 text-xs rounded border-slate-300 text-center font-bold text-purple-600"/>
                                            </div>
                                        </td>
                                        <td className="px-1 py-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <input type="number" step="0.1" placeholder="Kg" value={data.weight} onChange={e=>setData('weight', e.target.value)} className="w-14 p-1.5 text-xs rounded border-slate-300 text-center font-bold"/>
                                                <span className="text-slate-400">/</span>
                                                <input type="number" step="0.01" placeholder="M" value={data.height} onChange={e=>setData('height', e.target.value)} className="w-14 p-1.5 text-xs rounded border-slate-300 text-center"/>
                                            </div>
                                        </td>
                                        <td className="px-2 py-3 text-center text-xs italic text-slate-400 bg-white/50">Auto</td>
                                        <td className="px-1 py-3 text-center bg-white/50"><input type="number" step="0.1" value={data.body_fat_percentage} onChange={e=>setData('body_fat_percentage', e.target.value)} className="w-16 mx-auto p-1.5 text-xs rounded border-slate-300 text-center font-bold text-red-500"/></td>
                                        <td className="px-1 py-3 text-center"><input type="number" step="0.1" value={data.muscle_mass} onChange={e=>setData('muscle_mass', e.target.value)} className="w-16 mx-auto p-1.5 text-xs rounded border-slate-300 text-center font-bold text-emerald-600"/></td>
                                        <td className="px-1 py-3 text-center"><input type="number" step="0.1" value={data.visceral_fat} onChange={e=>setData('visceral_fat', e.target.value)} className="w-16 mx-auto p-1.5 text-xs rounded border-slate-300 text-center font-bold text-orange-500"/></td>
                                        <td className="px-1 py-3 text-center"><input type="number" step="0.1" value={data.total_body_water} onChange={e=>setData('total_body_water', e.target.value)} className="w-16 mx-auto p-1.5 text-xs rounded border-slate-300 text-center font-bold text-blue-500"/></td>
                                        
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <button onClick={() => saveEdit(test.id)} disabled={processing} className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded shadow-sm transition-colors" title="Simpan">
                                                    {processing ? <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"></div> : <CheckCircle2 className="w-4 h-4"/>}
                                                </button>
                                                <button onClick={cancelEditing} className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded transition-colors" title="Batal"><X className="w-4 h-4"/></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }

                            return (
                                <tr key={test.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-4 md:px-6 py-4 font-bold text-slate-700">
                                        <div className="flex items-center gap-2">
                                            {new Date(test.date).toLocaleDateString('id-ID', {day:'2-digit', month:'short', year:'numeric'})}
                                            {test.id === history[0].id && <span className="bg-blue-100 text-blue-600 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">New</span>}
                                        </div>
                                    </td>
                                    
                                    <td className="px-2 py-4 text-center">
                                        <div className="flex flex-col items-center justify-center leading-tight">
                                            <span className="text-slate-500 text-xs font-medium">Usia: {test.age}</span>
                                            <span className="text-[10px] text-purple-500 font-bold bg-purple-50 px-1.5 rounded mt-0.5">Met: {test.metabolic_age || '-'}</span>
                                        </div>
                                    </td>
                                    
                                    <td className="px-2 py-4 text-center">
                                        <div className="flex flex-col items-center justify-center leading-tight">
                                            <span className="text-slate-800 font-bold">{test.weight} <span className="text-[9px] text-slate-400 font-normal">kg</span></span>
                                            <span className="text-slate-400 text-xs">{test.height} m</span>
                                        </div>
                                    </td>
                                    
                                    <td className="px-2 py-4 text-center bg-blue-50/30">
                                        <div className={`inline-flex items-center justify-center text-slate-800 font-bold ${getStatusColor('bmi', test.bmi)}`}>
                                            {test.bmi}
                                        </div>
                                    </td>
                                    
                                    <td className="px-2 py-4 text-center bg-blue-50/30">
                                        <div className={`inline-flex items-center justify-center text-slate-800 font-bold ${getStatusColor('bodyfat', test.body_fat_percentage)}`}>
                                            {test.body_fat_percentage || '-'} <span className="text-xs ml-0.5">%</span>
                                        </div>
                                    </td>
                                    
                                    <td className="px-2 py-4 text-center">
                                        <span className="text-slate-800 font-bold">{test.muscle_mass || '-'}</span>
                                    </td>
                                    
                                    <td className="px-2 py-4 text-center">
                                        <span className={`text-slate-800 font-bold ${getStatusColor('visceral', test.visceral_fat)}`}>{test.visceral_fat || '-'}</span>
                                    </td>
                                    
                                    <td className="px-2 py-4 text-slate-800 font-bold">
                                        {test.total_body_water || '-'} <span className="text-xs">%</span>
                                    </td>
                                    
                                    {/* SEMBUNYIKAN KOLOM AKSI JIKA ATLET */}
                                    {!is_athlete && (
                                        <td className="px-4 md:px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => startEditing(test)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Baris">
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => { if(confirm('Hapus permanen data ini?')) router.delete(route('admin.composition-tests.destroy', test.id), {preserveScroll:true}) }} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        }) : (
                            <tr>
                                {/* SESUAIKAN COLSPAN JIKA KOLOM AKSI DIHILANGKAN */}
                                <td colSpan={is_athlete ? "8" : "9"} className="px-6 py-16 text-center text-slate-400 font-medium">
                                    Belum ada data rekaman tes untuk atlet ini.
                                    {!is_athlete && <><br/><span className="text-xs font-normal">Klik tombol "INPUT TES BARU" di atas untuk memulai.</span></>}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}