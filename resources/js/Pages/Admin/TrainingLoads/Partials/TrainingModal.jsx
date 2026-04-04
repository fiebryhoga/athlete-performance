import { X, Save, HeartPulse, Brain, Battery, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

// Sub-Komponen Pembantu untuk Skala 1-5 (Diperbarui untuk menerima data & setData)
const ScaleRadio = ({ label, name, data, setData }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
        <label className="text-sm font-medium text-slate-700 w-1/2">{label}</label>
        <div className="flex gap-2 w-1/2 justify-end">
            {[1, 2, 3, 4, 5].map(num => (
                <label key={num} className={`relative w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer text-sm font-semibold transition-all duration-200 ${
                    data[name] == num 
                    ? 'bg-rose-500 text-white shadow-sm ring-2 ring-rose-200 ring-offset-1' 
                    : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}>
                    <input type="radio" name={name} value={num} checked={data[name] == num} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full m-0" onChange={e => setData(name, e.target.value)} />
                    <span>{num}</span>
                </label>
            ))}
        </div>
    </div>
);

// Sub-Komponen Pembantu untuk Custom Select
const CustomSelect = ({ options, value, onChange, placeholder, iconColorClass = "text-blue-500" }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative w-full">
            <div onClick={() => setIsOpen(!isOpen)} className="w-full text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 cursor-pointer flex justify-between items-center hover:border-blue-400 transition-colors">
                <span className={value ? 'text-slate-800' : 'text-slate-400'}>{value || placeholder}</span>
                <ChevronDown className={`w-4 h-4 ${iconColorClass}`} />
            </div>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 shadow-lg rounded-lg max-h-56 overflow-y-auto custom-scrollbar py-1">
                        <div onClick={() => { onChange(''); setIsOpen(false); }} className="px-3 py-2 text-sm text-slate-400 hover:bg-slate-50 cursor-pointer italic">Kosongkan...</div>
                        {options.map(opt => (
                            <div key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={`px-3 py-2 text-sm cursor-pointer transition-colors ${value == opt ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'}`}>{opt}</div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default function TrainingModal({ isOpen, onClose, activeData, selectedDate, formatDateToIndo, sessionTypes, rpeOptions, athleteId }) {
    
    // Pindahkan useForm ke dalam Modal agar tidak me-render ulang halaman utama saat mengetik
    const { data, setData, post, processing, reset } = useForm({
        user_id: athleteId, record_date: selectedDate,
        sleep_quality: '', fatigue: '', muscle_soreness: '', stress: '', motivation: '', health: '', mood: '', study_attitude: '',
        am_session_type: '', am_rpe: '', am_duration: '', pm_session_type: '', pm_rpe: '', pm_duration: '', notes: ''
    });

    // Mengunci scroll background dan mengisi form saat modal dibuka
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const existingData = activeData.find(d => d.record_date === selectedDate);
            if (existingData) {
                setData({
                    user_id: athleteId,
                    record_date: selectedDate,
                    ...existingData,
                    notes: existingData.notes || ''
                });
            } else {
                reset();
                setData('user_id', athleteId);
                setData('record_date', selectedDate);
            }
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen, selectedDate]);

    if (!isOpen) return null;

    const submitLoad = (e) => {
        e.preventDefault();
        post(route('admin.training-loads.store'), {
            onSuccess: () => {
                onClose();
                reset();
            },
            preserveScroll: true
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 transition-opacity" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
                
                <div className="sticky top-0 z-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white shadow-sm">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2.5">
                            <div className="p-1.5 bg-rose-50 rounded-lg text-rose-500">
                                <HeartPulse className="w-5 h-5" />
                            </div>
                            {activeData.find(d => d.record_date === selectedDate) ? 'Edit Readiness & Load' : 'Input Readiness & Load'}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 ml-10">
                            {formatDateToIndo(new Date(selectedDate), 'full')}
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={submitLoad} className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        
                        {/* KOLOM KIRI: WELLNESS */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                                <Brain className="w-5 h-5 text-slate-400"/>
                                <h4 className="font-semibold text-slate-800 text-lg">Wellness Questionnaire</h4>
                                <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md">1: Buruk - 5: Baik</span>
                            </div>
                            
                            <ScaleRadio label="Kualitas Tidur" name="sleep_quality" data={data} setData={setData} />
                            <ScaleRadio label="Tingkat Kelelahan" name="fatigue" data={data} setData={setData} />
                            <ScaleRadio label="Nyeri Otot" name="muscle_soreness" data={data} setData={setData} />
                            <ScaleRadio label="Tingkat Stres" name="stress" data={data} setData={setData} />
                            <ScaleRadio label="Motivasi Latihan" name="motivation" data={data} setData={setData} />
                            <ScaleRadio label="Kondisi Kesehatan" name="health" data={data} setData={setData} />
                            <ScaleRadio label="Suasana Hati (Mood)" name="mood" data={data} setData={setData} />
                            <ScaleRadio label="Fokus/Sikap Belajar" name="study_attitude" data={data} setData={setData} />
                        </div>

                        {/* KOLOM KANAN: RPE */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                                <Battery className="w-5 h-5 text-slate-400"/>
                                <h4 className="font-semibold text-slate-800 text-lg">Sesi Latihan (RPE)</h4>
                            </div>

                            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 relative z-20">
                                <h5 className="font-semibold text-blue-800 text-sm mb-4 flex items-center gap-2">Sesi Pagi <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">AM</span></h5>
                                <div className="space-y-4">
                                    <div className="relative z-30">
                                        <label className="text-xs font-medium text-slate-600 mb-1.5 block">Tipe Latihan</label>
                                        <CustomSelect options={sessionTypes} value={data.am_session_type} onChange={val => setData('am_session_type', val)} placeholder="Pilih tipe sesi..." iconColorClass="text-blue-500" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 relative z-20">
                                        <div>
                                            <label className="text-xs font-medium text-slate-600 mb-1.5 block">Beban (RPE 1-10)</label>
                                            <CustomSelect options={rpeOptions} value={data.am_rpe} onChange={val => setData('am_rpe', val)} placeholder="Skala 1-10" iconColorClass="text-blue-500" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-600 mb-1.5 block">Durasi (Menit)</label>
                                            <input type="number" min="0" value={data.am_duration} onChange={e => setData('am_duration', e.target.value)} className="w-full text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors" placeholder="0"/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100 relative z-10">
                                <h5 className="font-semibold text-indigo-800 text-sm mb-4 flex items-center gap-2">Sesi Sore/Malam <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded">PM</span></h5>
                                <div className="space-y-4">
                                    <div className="relative z-30">
                                        <label className="text-xs font-medium text-slate-600 mb-1.5 block">Tipe Latihan</label>
                                        <CustomSelect options={sessionTypes} value={data.pm_session_type} onChange={val => setData('pm_session_type', val)} placeholder="Pilih tipe sesi..." iconColorClass="text-indigo-500" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 relative z-20">
                                        <div>
                                            <label className="text-xs font-medium text-slate-600 mb-1.5 block">Beban (RPE 1-10)</label>
                                            <CustomSelect options={rpeOptions} value={data.pm_rpe} onChange={val => setData('pm_rpe', val)} placeholder="Skala 1-10" iconColorClass="text-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-600 mb-1.5 block">Durasi (Menit)</label>
                                            <input type="number" min="0" value={data.pm_duration} onChange={e => setData('pm_duration', e.target.value)} className="w-full text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-colors" placeholder="0"/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1 lg:col-span-2 space-y-2 mt-2 pt-4 border-t border-slate-100">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Catatan Tambahan (Opsional)</label>
                                <textarea 
                                    rows="2" 
                                    value={data.notes} 
                                    onChange={e => setData('notes', e.target.value)} 
                                    className="w-full text-sm rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus:bg-white focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none transition-all resize-none" 
                                    placeholder="Cth: Latihan sangat intens, cuaca sedang buruk..."
                                ></textarea>
                            </div>

                        </div>
                    </div>

                    <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end gap-3 relative z-0">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-50 transition-colors">Batal</button>
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-rose-500 text-white font-medium text-sm rounded-lg shadow-sm hover:bg-rose-600 transition-colors flex items-center gap-2">
                            {processing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-4 h-4" />}
                            Simpan Data
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}