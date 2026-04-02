import { X, Save, HeartPulse, Brain, Battery, ChevronDown } from 'lucide-react';
import { useState } from 'react';

// Sub-Komponen Pembantu untuk Skala 1-5
const ScaleRadio = ({ label, name, formLoad }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
        <label className="text-sm font-medium text-slate-700 w-1/2">{label}</label>
        <div className="flex gap-2 w-1/2 justify-end">
            {[1, 2, 3, 4, 5].map(num => (
                <label key={num} className={`relative w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer text-sm font-semibold transition-all duration-200 ${
                    formLoad.data[name] == num 
                    ? 'bg-rose-500 text-white shadow-sm ring-2 ring-rose-200 ring-offset-1' 
                    : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}>
                    <input type="radio" name={name} value={num} checked={formLoad.data[name] == num} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full m-0" onChange={e => formLoad.setData(name, e.target.value)} required />
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
        <div className="relative">
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

export default function TrainingModal({ isOpen, onClose, formLoad, submitLoad, activeData, selectedDate, formatDateToIndo, sessionTypes, rpeOptions }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
                
                <div className="sticky top-0 z-30 px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white/95 backdrop-blur-md">
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
                            
                            <ScaleRadio label="Kualitas Tidur" name="sleep_quality" formLoad={formLoad} />
                            <ScaleRadio label="Tingkat Kelelahan" name="fatigue" formLoad={formLoad} />
                            <ScaleRadio label="Nyeri Otot" name="muscle_soreness" formLoad={formLoad} />
                            <ScaleRadio label="Tingkat Stres" name="stress" formLoad={formLoad} />
                            <ScaleRadio label="Motivasi Latihan" name="motivation" formLoad={formLoad} />
                            <ScaleRadio label="Kondisi Kesehatan" name="health" formLoad={formLoad} />
                            <ScaleRadio label="Suasana Hati (Mood)" name="mood" formLoad={formLoad} />
                            <ScaleRadio label="Fokus/Sikap Belajar" name="study_attitude" formLoad={formLoad} />
                        </div>

                        {/* KOLOM KANAN: RPE */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                                <Battery className="w-5 h-5 text-slate-400"/>
                                <h4 className="font-semibold text-slate-800 text-lg">Sesi Latihan (RPE)</h4>
                            </div>

                            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 relative">
                                <h5 className="font-semibold text-blue-800 text-sm mb-4 flex items-center gap-2">Sesi Pagi <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">AM</span></h5>
                                <div className="space-y-4">
                                    <div className="relative z-20">
                                        <label className="text-xs font-medium text-slate-600 mb-1.5 block">Tipe Latihan</label>
                                        <CustomSelect options={sessionTypes} value={formLoad.data.am_session_type} onChange={val => formLoad.setData('am_session_type', val)} placeholder="Pilih tipe sesi..." iconColorClass="text-blue-500" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 relative z-10">
                                        <div>
                                            <label className="text-xs font-medium text-slate-600 mb-1.5 block">Beban (RPE 1-10)</label>
                                            <CustomSelect options={rpeOptions} value={formLoad.data.am_rpe} onChange={val => formLoad.setData('am_rpe', val)} placeholder="Skala 1-10" iconColorClass="text-blue-500" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-600 mb-1.5 block">Durasi (Menit)</label>
                                            <input type="number" min="0" value={formLoad.data.am_duration} onChange={e => formLoad.setData('am_duration', e.target.value)} className="w-full text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors" placeholder="0"/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100 relative">
                                <h5 className="font-semibold text-indigo-800 text-sm mb-4 flex items-center gap-2">Sesi Sore/Malam <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded">PM</span></h5>
                                <div className="space-y-4">
                                    <div className="relative z-20">
                                        <label className="text-xs font-medium text-slate-600 mb-1.5 block">Tipe Latihan</label>
                                        <CustomSelect options={sessionTypes} value={formLoad.data.pm_session_type} onChange={val => formLoad.setData('pm_session_type', val)} placeholder="Pilih tipe sesi..." iconColorClass="text-indigo-500" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 relative z-10">
                                        <div>
                                            <label className="text-xs font-medium text-slate-600 mb-1.5 block">Beban (RPE 1-10)</label>
                                            <CustomSelect options={rpeOptions} value={formLoad.data.pm_rpe} onChange={val => formLoad.setData('pm_rpe', val)} placeholder="Skala 1-10" iconColorClass="text-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-600 mb-1.5 block">Durasi (Menit)</label>
                                            <input type="number" min="0" value={formLoad.data.pm_duration} onChange={e => formLoad.setData('pm_duration', e.target.value)} className="w-full text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-colors" placeholder="0"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-50 transition-colors">Batal</button>
                        <button type="submit" disabled={formLoad.processing} className="px-6 py-2.5 bg-rose-500 text-white font-medium text-sm rounded-lg shadow-sm hover:bg-rose-600 transition-colors flex items-center gap-2">
                            {formLoad.processing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-4 h-4" />}
                            Simpan Data
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}