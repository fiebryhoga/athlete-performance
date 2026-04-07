import { Scale, Save, X, Calculator, Droplets, Zap, HeartPulse, Dumbbell, Activity, UserCheck } from 'lucide-react';
import { useState } from 'react';

export default function CompositionModal({ isOpen, onClose, data, setData, submit, processing, athlete }) {
    if (!isOpen) return null;

    // --- STATE UNTUK TOOLS KALKULATOR ---
    const [activeTool, setActiveTool] = useState('bodyfat'); // 'bodyfat', 'bmr', atau 'mass'
    
    // Input Kalkulator Body Fat (US Navy Method)
    const [neck, setNeck] = useState('');
    const [waist, setWaist] = useState('');
    const [hip, setHip] = useState('');

    // ==========================================
    // FUNGSI KALKULATOR (RUMUS TERVERIFIKASI)
    // ==========================================
    
    // 1. Body Fat (US Navy Method)
    const estimatedBF = (() => {
        if (!data.height || !neck || !waist || (athlete.gender === 'P' && !hip)) return null;
        const h = parseFloat(data.height) * 100, n = parseFloat(neck), w = parseFloat(waist), hi = parseFloat(hip);
        let bf = athlete.gender === 'L' 
            ? 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450
            : 495 / (1.29579 - 0.35004 * Math.log10(w + hi - n) + 0.22100 * Math.log10(h)) - 450;
        return isNaN(bf) ? null : Math.max(2, bf).toFixed(1);
    })();

    // 2. Visceral Fat (Proksi dari Lingkar Perut)
    const estimatedVisceral = (() => {
        if (!waist) return null;
        const w = parseFloat(waist);
        const v = Math.round((w / 10) - (athlete.gender === 'L' ? 2 : 3));
        return isNaN(v) ? null : Math.max(1, v);
    })();

    // 3. BMR (Mifflin-St Jeor)
    const estimatedBMR = (() => {
        if (!data.weight || !data.height || !data.age) return null;
        const w = parseFloat(data.weight), h = parseFloat(data.height) * 100, a = parseFloat(data.age);
        const bmr = athlete.gender === 'L' 
            ? (10 * w + 6.25 * h - 5 * a + 5)
            : (10 * w + 6.25 * h - 5 * a - 161);
        return isNaN(bmr) ? null : Math.round(bmr);
    })();

    // 4. TBW / Air (Watson Formula)
    const estimatedTBW = (() => {
        if (!data.weight || !data.height || !data.age) return null;
        const w = parseFloat(data.weight), h = parseFloat(data.height) * 100, a = parseFloat(data.age);
        let tbwLiters = athlete.gender === 'L'
            ? 2.447 - (0.09156 * a) + (0.1074 * h) + (0.3362 * w)
            : -2.097 + (0.1069 * h) + (0.2466 * w);
        const percent = (tbwLiters / w) * 100;
        return isNaN(percent) ? null : percent.toFixed(1);
    })();

    // 5. Bone Mass (Berdasarkan Tabel Standar Excel)
    const estimatedBone = (() => {
        if (!data.weight) return null;
        const w = parseFloat(data.weight);
        if (athlete.gender === 'L') return w < 60 ? 2.5 : w <= 75 ? 2.9 : 3.2;
        return w < 45 ? 1.8 : w <= 60 ? 2.2 : 2.5;
    })();

    // 6. Muscle Mass (Berat Total - Lemak - Tulang)
    const estimatedMuscle = (() => {
        if (!data.weight || !data.body_fat_percentage) return null; // Butuh bodyfat di form kiri
        const w = parseFloat(data.weight);
        const bf = parseFloat(data.body_fat_percentage);
        const bone = estimatedBone ? parseFloat(estimatedBone) : 2.5;
        const muscle = w - (w * (bf / 100)) - bone;
        return isNaN(muscle) ? null : Math.max(0, muscle).toFixed(1);
    })();

    // 7. Metabolic Age (Proksi Usia vs Target Lemak)
    const estimatedMetAge = (() => {
        if (!data.age || !data.body_fat_percentage) return null;
        const a = parseFloat(data.age), bf = parseFloat(data.body_fat_percentage);
        const normalBf = athlete.gender === 'L' ? 15 : 23;
        const met = Math.round(a + (bf - normalBf) / 1.2);
        return isNaN(met) ? null : Math.max(12, met);
    })();


    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            
            <div className="bg-white w-full max-w-6xl rounded-lg shadow-2xl flex flex-col xl:flex-row my-auto max-h-[95vh] xl:max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                
                
                
                
                <div className="flex-1 xl:w-7/12 border-b xl:border-b-0 xl:border-r border-slate-200 flex flex-col overflow-y-auto custom-scrollbar">
                    
                    
                    <div className="sticky top-0 z-20 px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 flex justify-between items-center bg-white shadow-sm">
                        <h3 className="font-bold text-base md:text-lg text-slate-800 flex items-center gap-2">
                            <Scale className="w-4 h-4 md:w-5 md:h-5 text-[#ff4d00]"/> Record Composition
                        </h3>
                        <button onClick={onClose} className="p-1.5 md:p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"><X className="w-5 h-5"/></button>
                    </div>

                    <form onSubmit={submit} className="p-4 md:p-6 sm:p-8 flex-1 flex flex-col bg-white">
                        
                        
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 md:mb-6">
                            <div className="col-span-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block tracking-widest">Tanggal Tes</label>
                                <input type="date" value={data.date} onChange={e=>setData('date', e.target.value)} className="w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] transition-all outline-none shadow-sm" required/>
                            </div>
                            <div className="col-span-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block tracking-widest">Usia Biologis</label>
                                <input type="number" value={data.age} onChange={e=>setData('age', e.target.value)} className="w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] transition-all outline-none shadow-sm" required/>
                            </div>
                        </div>
                        
                        
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 md:mb-6">
                            <div className="col-span-1 p-3 sm:p-4 bg-orange-50/50 rounded-lg border border-orange-100 shadow-sm">
                                <label className="text-[10px] font-bold uppercase text-[#ff4d00] mb-1 block tracking-widest">Berat (KG)</label>
                                <input type="number" step="0.01" value={data.weight} onChange={e=>setData('weight', e.target.value)} className="w-full rounded-lg border-white focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]/20 text-base md:text-lg font-bold shadow-sm outline-none transition-all text-slate-800" required placeholder="0.00"/>
                            </div>
                            <div className="col-span-1 p-3 sm:p-4 bg-orange-50/50 rounded-lg border border-orange-100 shadow-sm">
                                <label className="text-[10px] font-bold uppercase text-[#ff4d00] mb-1 block tracking-widest">Tinggi (Meter)</label>
                                <input type="number" step="0.01" value={data.height} onChange={e=>setData('height', e.target.value)} className="w-full rounded-lg border-white focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]/20 text-base md:text-lg font-bold shadow-sm outline-none transition-all text-slate-800" required placeholder="1.70"/>
                            </div>
                        </div>

                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 border-t border-slate-100 pt-5">
                            <div>
                                <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1.5 block tracking-widest">Bodyfat %</label>
                                <input type="number" step="0.1" value={data.body_fat_percentage} onChange={e=>setData('body_fat_percentage', e.target.value)} className="w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] bg-slate-50 focus:bg-white transition-all outline-none shadow-sm"/>
                            </div>
                            <div>
                                <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1.5 block tracking-widest">Muscle Mass</label>
                                <input type="number" step="0.1" value={data.muscle_mass} onChange={e=>setData('muscle_mass', e.target.value)} className="w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] bg-slate-50 focus:bg-white transition-all outline-none shadow-sm"/>
                            </div>
                            <div>
                                <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1.5 block tracking-widest">Bone Mass</label>
                                <input type="number" step="0.1" value={data.bone_mass} onChange={e=>setData('bone_mass', e.target.value)} className="w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] bg-slate-50 focus:bg-white transition-all outline-none shadow-sm"/>
                            </div>
                            <div>
                                <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1.5 block tracking-widest">Visceral Fat</label>
                                <input type="number" step="0.1" value={data.visceral_fat} onChange={e=>setData('visceral_fat', e.target.value)} className="w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] bg-slate-50 focus:bg-white transition-all outline-none shadow-sm"/>
                            </div>
                            <div>
                                <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1.5 block tracking-widest">BMR (Kcal)</label>
                                <input type="number" value={data.bmr} onChange={e=>setData('bmr', e.target.value)} className="w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] bg-slate-50 focus:bg-white transition-all outline-none shadow-sm"/>
                            </div>
                            <div>
                                <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1.5 block tracking-widest">TBW % (Air)</label>
                                <input type="number" step="0.1" value={data.total_body_water} onChange={e=>setData('total_body_water', e.target.value)} className="w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] bg-slate-50 focus:bg-white transition-all outline-none shadow-sm"/>
                            </div>
                            <div className="col-span-2 sm:col-span-3 lg:col-span-1">
                                <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-1.5 block tracking-widest">Metabolic Age</label>
                                <input type="number" value={data.metabolic_age} onChange={e=>setData('metabolic_age', e.target.value)} className="w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] bg-slate-50 focus:bg-white transition-all outline-none shadow-sm" placeholder="Opsional"/>
                            </div>
                        </div>

                        
                        <div className="pt-6 md:pt-8 mt-auto border-t border-slate-100 hidden xl:block">
                            <button type="submit" disabled={processing} className="w-full py-3 md:py-4 bg-[#ff4d00] text-white font-bold rounded-lg shadow-lg shadow-[#ff4d00]/20 hover:bg-[#e64500] hover:shadow-xl hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 uppercase tracking-widest text-sm disabled:opacity-70">
                                {processing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-4 h-4"/>} 
                                {processing ? 'Menyimpan...' : 'Simpan Rekaman Tes'}
                            </button>
                        </div>
                    </form>
                </div>

                
                
                
                <div className="xl:w-5/12 bg-slate-50 flex flex-col relative border-t xl:border-t-0 border-slate-200 xl:border-none overflow-y-auto custom-scrollbar">
                    
                    <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-200 bg-slate-50 sticky top-0 z-10 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-base md:text-lg text-slate-800 flex items-center gap-2">
                                <Calculator className="w-4 h-4 md:w-5 md:h-5 text-teal-600"/> Helper Tools
                            </h3>
                            <p className="text-[10px] md:text-xs text-slate-500 mt-0.5">Kalkulator jika Anda hanya membawa meteran pita.</p>
                        </div>
                    </div>

                    <div className="flex px-3 md:px-4 pt-3 border-b border-slate-200 overflow-x-auto custom-scrollbar bg-slate-100 sticky top-[60px] md:top-[70px] z-10">
                        <button onClick={() => setActiveTool('bodyfat')} className={`pb-2.5 px-3 text-[10px] md:text-xs font-bold border-b-2 whitespace-nowrap transition-all uppercase tracking-widest ${activeTool === 'bodyfat' ? 'border-teal-500 text-teal-700 bg-slate-50 rounded-t-lg' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>1. Lemak & Visc</button>
                        <button onClick={() => setActiveTool('bmr')} className={`pb-2.5 px-3 text-[10px] md:text-xs font-bold border-b-2 whitespace-nowrap transition-all uppercase tracking-widest ${activeTool === 'bmr' ? 'border-teal-500 text-teal-700 bg-slate-50 rounded-t-lg' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>2. BMR & Air</button>
                        <button onClick={() => setActiveTool('mass')} className={`pb-2.5 px-3 text-[10px] md:text-xs font-bold border-b-2 whitespace-nowrap transition-all uppercase tracking-widest ${activeTool === 'mass' ? 'border-teal-500 text-teal-700 bg-slate-50 rounded-t-lg' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>3. Otot & Tulang</button>
                    </div>

                    <div className="p-4 md:p-6 flex-1 flex flex-col pb-8">
                        
                        
                        
                        
                        {activeTool === 'bodyfat' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="bg-teal-50/50 p-3 md:p-4 rounded-lg border border-teal-100 text-[10px] md:text-xs text-teal-800 font-medium leading-relaxed">
                                    Menggunakan metode ukur US Navy. Pastikan input <strong className="font-bold text-teal-900">Tinggi Badan</strong> di form utama sudah terisi.
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-2">
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-widest">Lingkar Leher (cm)</label>
                                        <input type="number" step="0.1" value={neck} onChange={e=>setNeck(e.target.value)} className="w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none shadow-sm" placeholder="Cth: 38" />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-widest">Lingkar Perut (cm)</label>
                                        <input type="number" step="0.1" value={waist} onChange={e=>setWaist(e.target.value)} className="w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none shadow-sm" placeholder="Pada pusar" />
                                    </div>
                                    {athlete.gender === 'P' && (
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-bold text-slate-500 mb-1.5 block uppercase tracking-widest">Lingkar Pinggul (cm) - Wanita</label>
                                            <input type="number" step="0.1" value={hip} onChange={e=>setHip(e.target.value)} className="w-full rounded-lg border-slate-200 text-xs md:text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none shadow-sm" placeholder="Bagian terlebar" />
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white p-4 md:p-5 rounded-lg border border-slate-200 flex flex-col gap-3 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1"><Activity className="w-3.5 h-3.5 text-teal-500"/> Body Fat %</div>
                                            <p className="text-xl md:text-2xl font-black text-teal-600">{estimatedBF ? `${estimatedBF}%` : '-'}</p>
                                        </div>
                                        <button type="button" onClick={() => estimatedBF && setData('body_fat_percentage', estimatedBF)} disabled={!estimatedBF} className="px-3 md:px-4 py-2 bg-teal-50 text-teal-600 hover:bg-teal-500 hover:text-white font-bold text-[10px] md:text-xs rounded-lg transition-all disabled:opacity-50 uppercase tracking-widest">Terapkan</button>
                                    </div>
                                    <div className="h-px bg-slate-100 w-full"></div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1"><HeartPulse className="w-3.5 h-3.5 text-rose-500"/> Visceral Rating</div>
                                            <p className="text-xl md:text-2xl font-black text-rose-600">{estimatedVisceral || '-'}</p>
                                        </div>
                                        <button type="button" onClick={() => estimatedVisceral && setData('visceral_fat', estimatedVisceral)} disabled={!estimatedVisceral} className="px-3 md:px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white font-bold text-[10px] md:text-xs rounded-lg transition-all disabled:opacity-50 uppercase tracking-widest">Terapkan</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        
                        
                        
                        {activeTool === 'bmr' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="bg-teal-50/50 p-3 md:p-4 rounded-lg border border-teal-100 text-[10px] md:text-xs text-teal-800 font-medium leading-relaxed">
                                    Menggunakan rumus Mifflin-St Jeor (BMR) dan Watson (Air). Pastikan <strong className="font-bold text-teal-900">Usia, Berat, dan Tinggi</strong> di form utama sudah terisi.
                                </div>

                                <div className="grid grid-cols-1 gap-3 md:gap-4 mt-2">
                                    <div className="bg-white p-4 md:p-5 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
                                        <div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1"><Zap className="w-3.5 h-3.5 text-amber-500"/> BMR (Kcal)</div>
                                            <p className="text-xl md:text-2xl font-black text-amber-600">{estimatedBMR || '-'}</p>
                                        </div>
                                        <button type="button" onClick={() => estimatedBMR && setData('bmr', estimatedBMR)} disabled={!estimatedBMR} className="px-3 md:px-4 py-2 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white font-bold text-[10px] md:text-xs rounded-lg transition-all disabled:opacity-50 uppercase tracking-widest">Terapkan</button>
                                    </div>

                                    <div className="bg-white p-4 md:p-5 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
                                        <div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1"><Droplets className="w-3.5 h-3.5 text-teal-500"/> Air / TBW (%)</div>
                                            <p className="text-xl md:text-2xl font-black text-teal-600">{estimatedTBW ? `${estimatedTBW}%` : '-'}</p>
                                        </div>
                                        <button type="button" onClick={() => estimatedTBW && setData('total_body_water', estimatedTBW)} disabled={!estimatedTBW} className="px-3 md:px-4 py-2 bg-teal-50 text-teal-600 hover:bg-teal-500 hover:text-white font-bold text-[10px] md:text-xs rounded-lg transition-all disabled:opacity-50 uppercase tracking-widest">Terapkan</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        
                        
                        
                        {activeTool === 'mass' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="bg-teal-50/50 p-3 md:p-4 rounded-lg border border-teal-100 text-[10px] md:text-xs text-teal-800 font-medium leading-relaxed">
                                    Pastikan metrik <strong className="font-bold text-teal-900">Body Fat %</strong> di form kiri sudah terisi agar sistem dapat memisahkan massa otot dan tulang secara akurat.
                                </div>

                                <div className="grid grid-cols-1 gap-3 md:gap-4 mt-2">
                                    <div className="bg-white p-4 md:p-5 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
                                        <div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1"><Activity className="w-3.5 h-3.5 text-slate-400"/> Bone Mass (Kg)</div>
                                            <p className="text-xl md:text-2xl font-black text-slate-700">{estimatedBone || '-'}</p>
                                        </div>
                                        <button type="button" onClick={() => estimatedBone && setData('bone_mass', estimatedBone)} disabled={!estimatedBone} className="px-3 md:px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-500 hover:text-white font-bold text-[10px] md:text-xs rounded-lg transition-all disabled:opacity-50 uppercase tracking-widest">Terapkan</button>
                                    </div>

                                    <div className="bg-white p-4 md:p-5 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
                                        <div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1"><Dumbbell className="w-3.5 h-3.5 text-emerald-500"/> Est. Muscle (Kg)</div>
                                            <p className="text-xl md:text-2xl font-black text-emerald-600">{estimatedMuscle || '-'}</p>
                                        </div>
                                        <button type="button" onClick={() => estimatedMuscle && setData('muscle_mass', estimatedMuscle)} disabled={!estimatedMuscle} className="px-3 md:px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white font-bold text-[10px] md:text-xs rounded-lg transition-all disabled:opacity-50 uppercase tracking-widest">Terapkan</button>
                                    </div>

                                    <div className="bg-white p-4 md:p-5 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
                                        <div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1"><UserCheck className="w-3.5 h-3.5 text-teal-600"/> Metabolic Age</div>
                                            <p className="text-xl md:text-2xl font-black text-teal-700">{estimatedMetAge || '-'}</p>
                                        </div>
                                        <button type="button" onClick={() => estimatedMetAge && setData('metabolic_age', estimatedMetAge)} disabled={!estimatedMetAge} className="px-3 md:px-4 py-2 bg-teal-50 text-teal-600 hover:bg-teal-500 hover:text-white font-bold text-[10px] md:text-xs rounded-lg transition-all disabled:opacity-50 uppercase tracking-widest">Terapkan</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        
                        <div className="xl:hidden mt-auto pt-8">
                            <button 
                                type="button"
                                onClick={(e) => { e.preventDefault(); submit(e); }} 
                                disabled={processing} 
                                className="w-full py-4 bg-[#ff4d00] text-white font-bold rounded-lg shadow-lg shadow-[#ff4d00]/20 hover:bg-[#e64500] transition-all flex justify-center items-center gap-2 uppercase tracking-widest text-sm disabled:opacity-70"
                            >
                                {processing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-4 h-4"/>} 
                                {processing ? 'Menyimpan...' : 'Simpan Rekaman Tes'}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}