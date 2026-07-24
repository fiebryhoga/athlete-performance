import React, { useState, useEffect, useCallback, memo } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Save, Wand2, Calculator, Info } from 'lucide-react';

const InfoTooltip = memo(({ text }) => (
    <div className="relative group inline-flex items-center justify-center ml-1.5 cursor-help">
        <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500 transition-colors" />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-900 text-white text-[11px] leading-relaxed rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] pointer-events-none">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-900"></div>
        </div>
    </div>
));

const InputField = memo(({ label, id, type ="number", step ="0.1", placeholder ="", value, onChange, error, tooltip }) => {
 const handleChange = (e) => onChange(id, e.target.value);

 return (
 <div className="space-y-1.5">
        <div className="flex items-center h-5">
            <label htmlFor={id} className="text-xs font-bold text-slate-700">
                {label}
            </label>
            {tooltip && <InfoTooltip text={tooltip} />}
        </div>
        <input
            id={id}
            type={type}
            step={step}
            placeholder={placeholder}
            value={value ?? ''}
            onChange={handleChange}
            className={`flex h-9 w-full rounded-md border bg-slate-50/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 ${
                error ? 'border-red-500 focus-visible:ring-red-500 bg-red-50/50' : 'border-slate-200'
            }`}
        />
 {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
 </div>
 );
});

const SelectField = memo(({ label, id, value, onChange, error, tooltip, options }) => {
    const handleChange = (e) => onChange(id, e.target.value);
    
    return (
        <div className="space-y-1.5">
            <div className="flex items-center h-5">
                <label htmlFor={id} className="text-xs font-bold text-slate-700">
                    {label}
                </label>
                {tooltip && <InfoTooltip text={tooltip} />}
            </div>
            <select
                id={id}
                value={value ?? ''}
                onChange={handleChange}
                className={`flex h-9 w-full rounded-md border bg-slate-50/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 ${
                    error ? 'border-red-500 focus-visible:ring-red-500 bg-red-50/50' : 'border-slate-200'
                }`}
            >
                <option value="">- Select -</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
        </div>
    );
});

export default function CompositionFormModal({ isOpen, onClose, player, record = null }) {
 const isEditing = !!record;
 const isMale = player?.gender === 'male' || player?.gender === 'L' || !player?.gender;

 const [measurements, setMeasurements] = useState({ neck: '', waist: '', hip: '' });

 const getInitialData = () => {
 const playerAge = player?.age || '';
 let playerHeight = player?.height || '';
 if (playerHeight && playerHeight < 3) playerHeight = playerHeight * 100;

 return {
 user_id: player?.id || '',
 date: new Date().toISOString().split('T')[0],
 age: playerAge,
 weight: player?.weight || '',
 height: playerHeight,
 bmi: '',
 body_fat_percentage: '',
 fat_free_mass: '',
 muscle_mass: '',
 skeletal_muscle_mass: '',
 bone_mass: '',
 essential_fat_mass: '',
 storage_fat_mass: '',
 visceral_fat: '',
 total_body_water: '',
 intracellular_water: '',
 extracellular_water: '',
 phase_angle: '',
 metabolic_age: '',
 bmr: '',
 activity_level: '',
 tdee: '',
 other_mass: '',
 };
 };

 const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm(getInitialData());

 useEffect(() => {
 if (isOpen) {
 clearErrors();
 setMeasurements({ neck: '', waist: '', hip: '' });
 
 if (isEditing && record) {
 const editData = getInitialData();
 Object.keys(editData).forEach(key => {
 if (record[key] !== undefined && record[key] !== null && key !== 'user_id') {
 editData[key] = record[key];
 }
 });
 setData(editData);
 } else {
 setData(getInitialData());
 }
 }
 }, [isOpen, record, player]);

 const handleDataChange = useCallback((id, value) => {
    setData(prev => {
        const next = { ...prev, [id]: value };
        if (id === 'activity_level' && next.bmr && value) {
            next.tdee = Math.round(next.bmr * parseFloat(value));
        } else if (id === 'activity_level' && !value) {
            next.tdee = '';
        }
        return next;
    });
 }, [setData]);

 const handleMeasurementChange = useCallback((id, value) => {
 setMeasurements(prev => ({ ...prev, [id]: value }));
 }, []);

 const handleAutoCalculate = () => {
 const w = parseFloat(data.weight);
 const h = parseFloat(data.height); 
 const a = parseFloat(data.age);
 
 const neck = parseFloat(measurements.neck);
 const waist = parseFloat(measurements.waist);
 const hip = parseFloat(measurements.hip);

 let updates = {};
 let currentBF = parseFloat(data.body_fat_percentage);

 if (h > 0 && neck > 0 && waist > 0) {
 if (isMale) {
 const bfRaw = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(h)) - 450;
 if (!isNaN(bfRaw)) currentBF = Math.max(2, bfRaw);
 } else if (hip > 0) { 
 const bfRaw = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(h)) - 450;
 if (!isNaN(bfRaw)) currentBF = Math.max(10, bfRaw);
 }
 updates.visceral_fat = Math.max(1, Math.round((waist / 10) - (isMale ? 2 : 3)));
 }

 if (currentBF) updates.body_fat_percentage = currentBF.toFixed(1);

 if (w > 0 && h > 0) updates.bmi = (w / Math.pow(h/100, 2)).toFixed(2);

 if (w > 0 && h > 0 && a > 0) {
 const bmr = (10 * w) + (6.25 * h) - (5 * a) + (isMale ? 5 : -161);
 updates.bmr = Math.round(bmr);
 if (data.activity_level) {
    updates.tdee = Math.round(bmr * parseFloat(data.activity_level));
 }
 }

 if (w > 0 && h > 0 && a > 0) {
 const tbwLiters = isMale 
 ? 2.447 - (0.09156 * a) + (0.1074 * h) + (0.3362 * w) 
 : -2.097 + (0.1069 * h) + (0.2466 * w);
 
 updates.total_body_water = ((tbwLiters / w) * 100).toFixed(1);
 updates.intracellular_water = (tbwLiters * 0.65).toFixed(1);
 updates.extracellular_water = (tbwLiters * 0.35).toFixed(1);
 }

 if (w > 0) {
 let bone = isMale ? (w < 60 ? 2.5 : w <= 75 ? 2.9 : 3.2) : (w < 45 ? 1.8 : w <= 60 ? 2.2 : 2.5);
 updates.bone_mass = bone.toFixed(1);

 if (currentBF > 0) {
 const totalFatKg = w * (currentBF / 100);
 updates.fat_free_mass = (w - totalFatKg).toFixed(1);

 const essFat = w * ((isMale ? 3 : 12) / 100);
 updates.essential_fat_mass = essFat.toFixed(1);
 updates.storage_fat_mass = Math.max(0, totalFatKg - essFat).toFixed(1);

 const other = w * 0.25; 
 updates.other_mass = other.toFixed(1);

 const muscle = Math.max(0, w - totalFatKg - bone - other);
 updates.muscle_mass = muscle.toFixed(1);
 updates.skeletal_muscle_mass = (muscle * 0.8).toFixed(1);
 
 if (a > 0) {
 updates.metabolic_age = Math.max(12, Math.round(a + (currentBF - (isMale ? 15 : 23)) / 1.2));
 }
 }
 }

 setData(prev => ({ ...prev, ...updates }));
 };

 const submit = (e) => {
 e.preventDefault();
 const options = { preserveScroll: true, onSuccess: () => { onClose(); reset(); } };
 if (isEditing) put(route('admin.composition-tests.update', record.id), options);
 else post(route('admin.composition-tests.store'), options);
 };

 if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-2xl w-full shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0 bg-slate-50/50">
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-slate-900">
                            {isEditing ? 'Edit Komposisi Tubuh' : 'Tambah Rekam Data'}
                        </h2>
                        <p className="text-sm font-medium text-slate-500 mt-0.5">
                            {player?.name} {player?.position ? `• ${player.position}` : ''}
                        </p>
                    </div>
                    <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 py-4 bg-orange-50/50 border-b border-orange-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-[0.03] -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="flex items-start gap-3 max-w-2xl relative z-10">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-500 mt-0.5 shrink-0">
                            <Calculator className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-sm font-bold text-orange-950">{"Mesin Kalkulasi Pintar"}</p>
                            <p className="text-xs font-medium text-orange-900/80 leading-relaxed">
                                {"Isi"} <strong>{"Berat Badan, Tinggi Badan, Usia"}</strong>. Jika tanpa alat BIA, isi <strong>{"Lingkar Leher & Pinggang"}</strong> lalu klik tombol untuk mengekstrak otomatis 10+ metrik anatomi.
                            </p>
                        </div>
                    </div>
                    <button 
                        type="button" 
                        onClick={handleAutoCalculate}
                        className="inline-flex items-center justify-center shrink-0 rounded-xl text-sm font-bold transition-all bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 h-10 px-5 gap-2 w-full sm:w-auto relative z-10"
                    >
                        <Wand2 className="w-4 h-4" /> {"Kalkulasi Otomatis"}
                    </button>
                </div>

 <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
 <form id="composition-form" onSubmit={submit} className="space-y-8">
 
 <div className="space-y-4">
                            <h3 className="text-[11px] font-bold text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
 {"Data Dasar Pasien (Wajib)"}
 </h3>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 <InputField label="Tanggal Tes" id="date" type="date" value={data.date} onChange={handleDataChange} error={errors.date} tooltip="Tanggal pengambilan sampel fisik." />
 <InputField label="Usia (Tahun)" id="age" value={data.age} onChange={handleDataChange} error={errors.age} tooltip="Usia biologis (kronologis) saat pengetesan." />
 <InputField label="Berat (Kg)" id="weight" value={data.weight} onChange={handleDataChange} error={errors.weight} tooltip="Berat badan total menggunakan timbangan digital." />
 <InputField label="Tinggi (cm)" id="height" value={data.height} onChange={handleDataChange} error={errors.height} tooltip="Tinggi badan aktual tanpa alas kaki." />
 </div>
 </div>

 <div className="space-y-4">
 <h3 className="text-[11px] font-bold text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
 {"Metrik Lingkar (Opsional - Untuk Kalkulasi Manual)"}
 </h3>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
 <InputField label="Lingkar Leher (cm)" id="neck" value={measurements.neck} onChange={handleMeasurementChange} placeholder={""} tooltip="Diukur tepat di bawah laring menggunakan pita ukur. (Formula US Navy)" />
 <InputField label="Lingkar Pinggang (cm)" id="waist" value={measurements.waist} onChange={handleMeasurementChange} placeholder={""} tooltip="Diukur tepat di sekitar pusar saat ekshalasi normal." />
 {!isMale && (
 <InputField label="Lingkar Pinggul (cm)" id="hip" value={measurements.hip} onChange={handleMeasurementChange} placeholder={"Khusus Wanita"} tooltip="Diukur pada bagian terlebar dari pinggul." />
 )}
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 <div className="space-y-4">
 <h3 className="text-[11px] font-bold text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
 {"Distribusi Anatomi Tubuh"}
 </h3>
 <div className="grid grid-cols-2 gap-4">
 <InputField label="Body Fat (%)" id="body_fat_percentage" value={data.body_fat_percentage} onChange={handleDataChange} error={errors.body_fat_percentage} tooltip="Persentase massa lemak terhadap berat badan total." />
 <InputField label="Muscle Mass (kg)" id="muscle_mass" value={data.muscle_mass} onChange={handleDataChange} error={errors.muscle_mass} tooltip="Estimasi total massa otot. Formula: (Berat - Lemak - Tulang - Organ)" />
 <InputField label="Fat-Free Mass (kg)" id="fat_free_mass" value={data.fat_free_mass} onChange={handleDataChange} error={errors.fat_free_mass} tooltip="Berat badan murni tanpa lemak (Otot + Tulang + Air). Formula: Berat - Total Lemak" />
 <InputField label="Bone Mass (kg)" id="bone_mass" value={data.bone_mass} onChange={handleDataChange} error={errors.bone_mass} tooltip="Estimasi berat mineral tulang murni. Rata-rata 2.5kg - 3.2kg." />
 <InputField label="Essential Fat (kg)" id="essential_fat_mass" value={data.essential_fat_mass} onChange={handleDataChange} tooltip="Lemak yang dibutuhkan untuk fungsi saraf/hormon (Pria: ~3%, Wanita: ~12%)." />
 <InputField label="Storage Fat (kg)" id="storage_fat_mass" value={data.storage_fat_mass} onChange={handleDataChange} tooltip="Lemak cadangan energi (non-esensial) di bawah kulit." />
 <InputField label="Skeletal Muscle (kg)" id="skeletal_muscle_mass" value={data.skeletal_muscle_mass} onChange={handleDataChange} tooltip="Otot yang melekat pada tulang (bisa dilatih/diperbesar)." />
 <InputField label="Other / Organ (kg)" id="other_mass" value={data.other_mass} onChange={handleDataChange} tooltip="Berat organ dalam, darah, dan jaringan lain (Estimasi ~25% dari berat)." />
 </div>
 </div>

 <div className="space-y-4">
 <h3 className="text-[11px] font-bold text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
 {"Metabolism & Cellular Level"}
 </h3>
 <div className="grid grid-cols-2 gap-4">
 <InputField label="BMI" id="bmi" value={data.bmi} onChange={handleDataChange} tooltip="Indeks Massa Tubuh. Formula: Berat(kg) / Tinggi(m) kuadrat." />
 <InputField label="BMR (Kcal)" id="bmr" type="number" step="1" value={data.bmr} onChange={handleDataChange} tooltip="Laju Metabolik Basal. Kalori harian minimum untuk fungsi organ saat istirahat (Mifflin-St Jeor)." />
 <InputField label="TBW / Total Water (%)" id="total_body_water" value={data.total_body_water} onChange={handleDataChange} tooltip="Total Air Tubuh. Persentase cairan dalam tubuh. Dihitung via Formula Watson." />
 <InputField label="Visceral Fat Level" id="visceral_fat" type="number" step="1" value={data.visceral_fat} onChange={handleDataChange} tooltip="Indeks lemak yang menyelimuti organ dalam (jantung/hati). (Normal: < 10)." />
 <InputField label="Intracellular Water (L)" id="intracellular_water" value={data.intracellular_water} onChange={handleDataChange} tooltip="Air DI DALAM sel (Estimasi 65% dari TBW)." />
 <InputField label="Extracellular Water (L)" id="extracellular_water" value={data.extracellular_water} onChange={handleDataChange} tooltip="Air DI LUAR sel / plasma darah (Estimasi 35% dari TBW)." />
 <InputField label="Metabolic Age" id="metabolic_age" type="number" step="1" value={data.metabolic_age} onChange={handleDataChange} tooltip="Usia metabolik seluler. Dipengaruhi oleh BMR dan persentase otot/lemak." />
 <InputField label="Phase Angle (°)" id="phase_angle" value={data.phase_angle} onChange={handleDataChange} placeholder={"BIA required"} tooltip="Sudut Fase (Arctan Xc/R). Mengukur kekuatan dinding membran sel. Membutuhkan alat BIA (InBody)." />
 <SelectField label="Tingkat Aktivitas" id="activity_level" value={data.activity_level} onChange={handleDataChange} options={[
                                    { value: 1.2, label: "Sedentary (pekerjaan kantor)" },
                                    { value: 1.375, label: "Olahraga Ringan (1-2 hari/minggu)" },
                                    { value: 1.55, label: "Olahraga Sedang (3-5 hari/minggu)" },
                                    { value: 1.725, label: "Olahraga Berat (6-7 hari/minggu)" },
                                    { value: 1.9, label: "Atlet (2x per hari)" }
                                ]} tooltip="Digunakan untuk menghitung TDEE (Total Pengeluaran Energi Harian)." />
 <InputField label="TDEE (Kkal)" id="tdee" type="number" step="1" value={data.tdee} onChange={handleDataChange} tooltip="Total Pengeluaran Energi Harian. Dihitung sebagai BMR x Tingkat Aktivitas." />
 </div>
 </div>
 </div>

 </form>
 </div>

                <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-slate-100 bg-slate-50/50 shrink-0">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="inline-flex items-center justify-center rounded-xl text-sm font-bold transition-colors border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 h-10 px-5"
                    >
                        {"Batal"}
                    </button>
                    <button 
                        type="submit" 
                        form="composition-form" 
                        disabled={processing} 
                        className="inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all disabled:opacity-50 bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 h-10 px-6 gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Simpan Analisis')}
                    </button>
                </div>

            </div>
        </div>
 );
}