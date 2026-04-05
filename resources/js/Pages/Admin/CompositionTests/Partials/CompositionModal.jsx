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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white w-full max-w-6xl rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto flex flex-col xl:flex-row">
                
                {/* ========================================== */}
                {/* KIRI: FORMULIR INPUT UTAMA */}
                {/* ========================================== */}
                <div className="flex-1 xl:w-7/12 border-b xl:border-b-0 xl:border-r border-slate-200 flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
                        <h3 className=" font-bold text-lg text-slate-800 flex items-center gap-2">
                            <Scale className="w-5 h-5 text-[#00488b]"/> Record Composition
                        </h3>
                        <button onClick={onClose} className="xl:hidden p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X className="w-5 h-5"/></button>
                    </div>

                    <form onSubmit={submit} className="p-6 sm:p-8 grid grid-cols-2 gap-4 sm:gap-6 bg-white overflow-y-auto custom-scrollbar flex-1">
                        <div className="col-span-1"><label className="text-[10px]  font-bold uppercase text-slate-400 mb-1 block tracking-widest">Tanggal Tes</label><input type="date" value={data.date} onChange={e=>setData('date', e.target.value)} className="w-full rounded-lg border-slate-200 text-sm focus:ring-[#00488b]" required/></div>
                        <div className="col-span-1"><label className="text-[10px]  font-bold uppercase text-slate-400 mb-1 block tracking-widest">Usia Biologis</label><input type="number" value={data.age} onChange={e=>setData('age', e.target.value)} className="w-full rounded-lg border-slate-200 text-sm" required/></div>
                        
                        <div className="col-span-1 p-3 sm:p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                            <label className="text-[10px]  font-bold uppercase text-blue-500 mb-1 block tracking-widest">Berat (KG)</label>
                            <input type="number" step="0.01" value={data.weight} onChange={e=>setData('weight', e.target.value)} className="w-full rounded-lg border-white focus:border-blue-300 text-lg font-bold shadow-sm" required placeholder="0.00"/>
                        </div>
                        <div className="col-span-1 p-3 sm:p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                            <label className="text-[10px]  font-bold uppercase text-blue-500 mb-1 block tracking-widest">Tinggi (Meter)</label>
                            <input type="number" step="0.01" value={data.height} onChange={e=>setData('height', e.target.value)} className="w-full rounded-lg border-white focus:border-blue-300 text-lg font-bold shadow-sm" required placeholder="1.70"/>
                        </div>

                        <div className="col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-5 mt-1">
                            <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Bodyfat %</label><input type="number" step="0.1" value={data.body_fat_percentage} onChange={e=>setData('body_fat_percentage', e.target.value)} className="w-full rounded-lg border-slate-200 text-sm focus:ring-[#00488b] bg-slate-50"/></div>
                            <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Muscle Mass</label><input type="number" step="0.1" value={data.muscle_mass} onChange={e=>setData('muscle_mass', e.target.value)} className="w-full rounded-lg border-slate-200 text-sm focus:ring-[#00488b] bg-slate-50"/></div>
                            <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Bone Mass</label><input type="number" step="0.1" value={data.bone_mass} onChange={e=>setData('bone_mass', e.target.value)} className="w-full rounded-lg border-slate-200 text-sm focus:ring-[#00488b] bg-slate-50"/></div>
                            <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Visceral Fat</label><input type="number" step="0.1" value={data.visceral_fat} onChange={e=>setData('visceral_fat', e.target.value)} className="w-full rounded-lg border-slate-200 text-sm focus:ring-[#00488b] bg-slate-50"/></div>
                            <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">BMR (Kcal)</label><input type="number" value={data.bmr} onChange={e=>setData('bmr', e.target.value)} className="w-full rounded-lg border-slate-200 text-sm focus:ring-[#00488b] bg-slate-50"/></div>
                            <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">TBW % (Air)</label><input type="number" step="0.1" value={data.total_body_water} onChange={e=>setData('total_body_water', e.target.value)} className="w-full rounded-lg border-slate-200 text-sm focus:ring-[#00488b] bg-slate-50"/></div>
                            <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Metabolic Age</label><input type="number" value={data.metabolic_age} onChange={e=>setData('metabolic_age', e.target.value)} className="w-full rounded-lg border-slate-200 text-sm focus:ring-[#00488b] bg-slate-50" placeholder="Opsional"/></div>
                        </div>

                        <div className="col-span-2 pt-4 border-t border-slate-100 mt-auto">
                            <button type="submit" disabled={processing} className="w-full py-4 bg-[#00488b] text-white font-bold rounded-lg shadow-lg shadow-blue-900/20 hover:bg-[#003666] transition-all flex justify-center items-center gap-2">
                                <Save className="w-5 h-5"/> {processing ? 'MENYIMPAN DATA...' : 'Simpan Rekaman Tes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ========================================== */}
                {/* KANAN: HELPER TOOLS (KALKULATOR ESTIMASI) */}
                {/* ========================================== */}
                <div className="xl:w-5/12 bg-slate-50 flex flex-col relative h-[85vh] xl:h-auto">
                    <button onClick={onClose} className="absolute top-5 right-6 hidden xl:block p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors z-10"><X className="w-5 h-5"/></button>
                    
                    <div className="px-6 py-6 border-b border-slate-200">
                        <h3 className=" font-bold text-lg text-slate-800 flex items-center gap-2"><Calculator className="w-5 h-5 text-indigo-500"/> Helper Tools</h3>
                        <p className="text-xs text-slate-500 mt-1">Kalkulator jika Anda hanya membawa meteran pita.</p>
                    </div>

                    <div className="flex px-4 pt-3 border-b border-slate-200 overflow-x-auto custom-scrollbar bg-slate-100">
                        <button onClick={() => setActiveTool('bodyfat')} className={`pb-3 px-3 text-xs md:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${activeTool === 'bodyfat' ? 'border-indigo-500 text-indigo-600 bg-slate-50 rounded-t-lg' : 'border-transparent text-slate-400'}`}>1. Lemak & Visceral</button>
                        <button onClick={() => setActiveTool('bmr')} className={`pb-3 px-3 text-xs md:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${activeTool === 'bmr' ? 'border-indigo-500 text-indigo-600 bg-slate-50 rounded-t-lg' : 'border-transparent text-slate-400'}`}>2. BMR & Air</button>
                        <button onClick={() => setActiveTool('mass')} className={`pb-3 px-3 text-xs md:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${activeTool === 'mass' ? 'border-indigo-500 text-indigo-600 bg-slate-50 rounded-t-lg' : 'border-transparent text-slate-400'}`}>3. Otot & Tulang</button>
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                        
                        {/* ------------------------------------------------ */}
                        {/* TAB 1: BODY FAT NAVY METHOD & VISCERAL */}
                        {/* ------------------------------------------------ */}
                        {activeTool === 'bodyfat' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100 text-xs text-indigo-800 font-medium leading-relaxed">
                                    Menggunakan metode ukur US Navy Pastikan input Tinggi Badan di form utama sebelah kiri sudah terisi.
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mb-2">
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="text-xs font-bold text-slate-500 mb-1 block">Lingkar Leher (cm)</label>
                                        <input type="number" step="0.1" value={neck} onChange={e=>setNeck(e.target.value)} className="w-full rounded-lg border-slate-200 text-sm" placeholder="Cth: 38" />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="text-xs font-bold text-slate-500 mb-1 block">Lingkar Perut (cm)</label>
                                        <input type="number" step="0.1" value={waist} onChange={e=>setWaist(e.target.value)} className="w-full rounded-lg border-slate-200 text-sm" placeholder="Pada pusar" />
                                    </div>
                                    {athlete.gender === 'P' && (
                                        <div className="col-span-2">
                                            <label className="text-xs font-bold text-slate-500 mb-1 block">Lingkar Pinggul (cm) - Khusus Wanita</label>
                                            <input type="number" step="0.1" value={hip} onChange={e=>setHip(e.target.value)} className="w-full rounded-lg border-slate-200 text-sm" placeholder="Bagian terlebar" />
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col gap-3 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-1.5 text-[10px]  font-bold uppercase text-slate-400 tracking-widest mb-1"><Activity className="w-3.5 h-3.5 text-indigo-500"/> Body Fat %</div>
                                            <p className="text-2xl font-semibold text-indigo-600">{estimatedBF ? `${estimatedBF}%` : '-'}</p>
                                        </div>
                                        <button type="button" onClick={() => estimatedBF && setData('body_fat_percentage', estimatedBF)} disabled={!estimatedBF} className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-500 hover:text-white font-bold text-xs rounded-lg transition-all disabled:opacity-50">Terapkan</button>
                                    </div>
                                    <div className="h-px bg-slate-100 w-full"></div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-1.5 text-[10px]  font-bold uppercase text-slate-400 tracking-widest mb-1"><HeartPulse className="w-3.5 h-3.5 text-rose-500"/> Visceral Rating</div>
                                            <p className="text-2xl font-semibold text-rose-600">{estimatedVisceral || '-'}</p>
                                        </div>
                                        <button type="button" onClick={() => estimatedVisceral && setData('visceral_fat', estimatedVisceral)} disabled={!estimatedVisceral} className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white font-bold text-xs rounded-lg transition-all disabled:opacity-50">Terapkan</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ------------------------------------------------ */}
                        {/* TAB 2: BMR & TOTAL BODY WATER */}
                        {/* ------------------------------------------------ */}
                        {activeTool === 'bmr' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100 text-xs text-amber-800 font-medium leading-relaxed">
                                    Menggunakan rumus Mifflin-St Jeor (BMR) dan Watson (Air). Pastikan Usia, Berat, dan Tinggi di form utama sudah terisi.
                                </div>

                                <div className="grid grid-cols-1 gap-4 mt-2">
                                    <div className="bg-white p-5 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
                                        <div>
                                            <div className="flex items-center gap-1.5 text-[10px]  font-bold uppercase text-slate-400 tracking-widest mb-1"><Zap className="w-3.5 h-3.5 text-amber-500"/> BMR (Kcal)</div>
                                            <p className="text-2xl font-semibold text-amber-600">{estimatedBMR || '-'}</p>
                                        </div>
                                        <button type="button" onClick={() => estimatedBMR && setData('bmr', estimatedBMR)} disabled={!estimatedBMR} className="px-4 py-2 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white font-bold text-xs rounded-lg transition-all disabled:opacity-50">Terapkan</button>
                                    </div>

                                    <div className="bg-white p-5 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
                                        <div>
                                            <div className="flex items-center gap-1.5 text-[10px]  font-bold uppercase text-slate-400 tracking-widest mb-1"><Droplets className="w-3.5 h-3.5 text-blue-500"/> Air / TBW (%)</div>
                                            <p className="text-2xl font-semibold text-blue-600">{estimatedTBW ? `${estimatedTBW}%` : '-'}</p>
                                        </div>
                                        <button type="button" onClick={() => estimatedTBW && setData('total_body_water', estimatedTBW)} disabled={!estimatedTBW} className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white font-bold text-xs rounded-lg transition-all disabled:opacity-50">Terapkan</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ------------------------------------------------ */}
                        {/* TAB 3: OTOT, TULANG & METABOLIC AGE */}
                        {/* ------------------------------------------------ */}
                        {activeTool === 'mass' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100 text-xs text-emerald-800 font-medium leading-relaxed">
                                    Pastikan metrik Body Fat % di form kiri sudah terisi (atau gunakan Tab 1 lalu terapkan) agar sistem dapat memisahkan massa otot dan tulang.
                                </div>

                                <div className="grid grid-cols-1 gap-4 mt-2">
                                    <div className="bg-white p-5 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
                                        <div>
                                            <div className="flex items-center gap-1.5 text-[10px]  font-bold uppercase text-slate-400 tracking-widest mb-1"><Activity className="w-3.5 h-3.5 text-slate-400"/> Bone Mass (Kg)</div>
                                            <p className="text-2xl font-semibold text-slate-700">{estimatedBone || '-'}</p>
                                        </div>
                                        <button type="button" onClick={() => estimatedBone && setData('bone_mass', estimatedBone)} disabled={!estimatedBone} className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-500 hover:text-white font-bold text-xs rounded-lg transition-all disabled:opacity-50">Terapkan</button>
                                    </div>

                                    <div className="bg-white p-5 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
                                        <div>
                                            <div className="flex items-center gap-1.5 text-[10px]  font-bold uppercase text-slate-400 tracking-widest mb-1"><Dumbbell className="w-3.5 h-3.5 text-emerald-500"/> Est. Muscle Mass (Kg)</div>
                                            <p className="text-2xl font-semibold text-emerald-600">{estimatedMuscle || '-'}</p>
                                        </div>
                                        <button type="button" onClick={() => estimatedMuscle && setData('muscle_mass', estimatedMuscle)} disabled={!estimatedMuscle} className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white font-bold text-xs rounded-lg transition-all disabled:opacity-50">Terapkan</button>
                                    </div>

                                    <div className="bg-white p-5 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
                                        <div>
                                            <div className="flex items-center gap-1.5 text-[10px]  font-bold uppercase text-slate-400 tracking-widest mb-1"><UserCheck className="w-3.5 h-3.5 text-purple-500"/> Metabolic Age (Usia)</div>
                                            <p className="text-2xl font-semibold text-purple-600">{estimatedMetAge || '-'}</p>
                                        </div>
                                        <button type="button" onClick={() => estimatedMetAge && setData('metabolic_age', estimatedMetAge)} disabled={!estimatedMetAge} className="px-4 py-2 bg-purple-50 text-purple-600 hover:bg-purple-500 hover:text-white font-bold text-xs rounded-lg transition-all disabled:opacity-50">Terapkan</button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
}