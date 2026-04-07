import { X, Save, HeartPulse, Brain, Battery, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';


const ScaleRadio = ({ label, name, data, setData }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
        <label className="text-sm font-medium text-slate-700 w-full sm:w-1/2">{label}</label>
        <div className="flex gap-1.5 sm:gap-2 w-full sm:w-1/2 justify-between sm:justify-end">
            {[1, 2, 3, 4, 5].map(num => (
                <label key={num} className={`relative w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg cursor-pointer text-xs md:text-sm font-semibold transition-all duration-200 shrink-0 ${
                    data[name] == num 
                    ? 'bg-[#ff4d00] text-white shadow-sm ring-2 ring-orange-200 ring-offset-1' 
                    : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}>
                    <input type="radio" name={name} value={num} checked={data[name] == num} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full m-0" onChange={e => setData(name, e.target.value)} />
                    <span>{num}</span>
                </label>
            ))}
        </div>
    </div>
);


const CustomSelect = ({ options, value, onChange, placeholder, iconColorClass = "text-[#ff4d00]", activeBgClass = "bg-orange-50 text-orange-700", hoverClass = "hover:text-orange-600" }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative w-full">
            <div onClick={() => setIsOpen(!isOpen)} className="w-full text-xs md:text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 cursor-pointer flex justify-between items-center hover:border-orange-400 transition-colors">
                <span className={value ? 'text-slate-800 font-medium' : 'text-slate-400'}>{value || placeholder}</span>
                <ChevronDown className={`w-4 h-4 ${iconColorClass}`} />
            </div>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 shadow-lg rounded-lg max-h-56 overflow-y-auto custom-scrollbar py-1">
                        <div onClick={() => { onChange(''); setIsOpen(false); }} className="px-3 py-2 text-xs md:text-sm text-slate-400 hover:bg-slate-50 cursor-pointer italic">Kosongkan...</div>
                        {options.map(opt => (
                            <div key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={`px-3 py-2 text-xs md:text-sm cursor-pointer transition-colors ${value == opt ? `${activeBgClass} font-bold` : `text-slate-700 hover:bg-slate-50 ${hoverClass}`}`}>{opt}</div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default function TrainingModal({ isOpen, onClose, activeData, selectedDate, formatDateToIndo, sessionTypes, rpeOptions, athleteId }) {
    
    const { data, setData, post, processing, reset } = useForm({
        user_id: athleteId, record_date: selectedDate,
        sleep_quality: '', fatigue: '', muscle_soreness: '', stress: '', motivation: '', health: '', mood: '', study_attitude: '',
        am_session_type: '', am_rpe: '', am_duration: '', pm_session_type: '', pm_rpe: '', pm_duration: '', notes: ''
    });

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
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                
                
                <div className="px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 flex justify-between items-center bg-white shadow-sm shrink-0">
                    <div>
                        <h3 className="font-bold text-lg md:text-xl text-slate-800 flex items-center gap-2.5">
                            <div className="p-1.5 bg-orange-50 rounded-lg text-[#ff4d00]">
                                <HeartPulse className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            {activeData.find(d => d.record_date === selectedDate) ? 'Edit Readiness & Load' : 'Input Readiness & Load'}
                        </h3>
                        <p className="text-xs md:text-sm text-slate-500 mt-1 md:ml-11">
                            {formatDateToIndo(new Date(selectedDate), 'full')}
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:bg-orange-50 hover:text-[#ff4d00] rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                
                <div className="overflow-y-auto custom-scrollbar flex-1">
                    <form onSubmit={submitLoad} className="p-5 md:p-6" id="training-load-form">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
                            
                            
                            <div className="space-y-3.5 md:space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 md:mb-6 border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-2">
                                        <Brain className="w-4 h-4 md:w-5 md:h-5 text-slate-400"/>
                                        <h4 className="font-semibold text-slate-800 text-base md:text-lg">Wellness Questionnaire</h4>
                                    </div>
                                    <span className="text-[10px] md:text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md uppercase tracking-wider">1 Buruk - 5 Baik</span>
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

                            
                            <div className="space-y-5 md:space-y-6">
                                <div className="flex items-center gap-2 mb-2 md:mb-4 border-b border-slate-100 pb-3">
                                    <Battery className="w-4 h-4 md:w-5 md:h-5 text-slate-400"/>
                                    <h4 className="font-semibold text-slate-800 text-base md:text-lg">Sesi Latihan (RPE)</h4>
                                </div>

                                
                                <div className="bg-orange-50/50 p-4 md:p-5 rounded-xl border border-orange-100 relative z-20">
                                    <h5 className="font-bold text-slate-700 text-xs md:text-sm mb-4 flex items-center gap-2">Sesi Pagi <span className="text-[10px] bg-[#ff4d00] text-white px-2 py-0.5 rounded tracking-wider">AM</span></h5>
                                    <div className="space-y-4">
                                        <div className="relative z-30">
                                            <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Tipe Latihan</label>
                                            <CustomSelect options={sessionTypes} value={data.am_session_type} onChange={val => setData('am_session_type', val)} placeholder="Pilih tipe sesi..." iconColorClass="text-[#ff4d00]" activeBgClass="bg-orange-50 text-[#ff4d00]" hoverClass="hover:text-[#ff4d00]"/>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 md:gap-4 relative z-20">
                                            <div>
                                                <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Beban (RPE)</label>
                                                <CustomSelect options={rpeOptions} value={data.am_rpe} onChange={val => setData('am_rpe', val)} placeholder="Skala 1-10" iconColorClass="text-[#ff4d00]" activeBgClass="bg-orange-50 text-[#ff4d00]" hoverClass="hover:text-[#ff4d00]"/>
                                            </div>
                                            <div>
                                                <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Durasi (Mnt)</label>
                                                <input type="number" min="0" value={data.am_duration} onChange={e => setData('am_duration', e.target.value)} className="w-full text-xs md:text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] outline-none transition-colors" placeholder="0"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                
                                <div className="bg-amber-50/50 p-4 md:p-5 rounded-xl border border-amber-100 relative z-10">
                                    <h5 className="font-bold text-slate-700 text-xs md:text-sm mb-4 flex items-center gap-2">Sesi Sore/Malam <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded tracking-wider">PM</span></h5>
                                    <div className="space-y-4">
                                        <div className="relative z-30">
                                            <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Tipe Latihan</label>
                                            <CustomSelect options={sessionTypes} value={data.pm_session_type} onChange={val => setData('pm_session_type', val)} placeholder="Pilih tipe sesi..." iconColorClass="text-amber-600" activeBgClass="bg-amber-50 text-amber-700" hoverClass="hover:text-amber-600"/>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 md:gap-4 relative z-20">
                                            <div>
                                                <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Beban (RPE)</label>
                                                <CustomSelect options={rpeOptions} value={data.pm_rpe} onChange={val => setData('pm_rpe', val)} placeholder="Skala 1-10" iconColorClass="text-amber-600" activeBgClass="bg-amber-50 text-amber-700" hoverClass="hover:text-amber-600"/>
                                            </div>
                                            <div>
                                                <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Durasi (Mnt)</label>
                                                <input type="number" min="0" value={data.pm_duration} onChange={e => setData('pm_duration', e.target.value)} className="w-full text-xs md:text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors" placeholder="0"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5 md:space-y-2 mt-4 md:mt-2 pt-2 md:pt-4 border-t border-slate-100">
                                    <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Catatan Tambahan (Opsional)</label>
                                    <textarea 
                                        rows="2" 
                                        value={data.notes} 
                                        onChange={e => setData('notes', e.target.value)} 
                                        className="w-full text-xs md:text-sm rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus:bg-white focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] outline-none transition-all resize-none" 
                                        placeholder="Cth: Latihan sangat intens, cuaca sedang buruk..."
                                    ></textarea>
                                </div>

                            </div>
                        </div>
                    </form>
                </div>

                
                <div className="px-5 md:px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-4 md:px-5 py-2 md:py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs md:text-sm rounded-lg hover:bg-slate-100 transition-colors">Batal</button>
                    <button type="submit" form="training-load-form" disabled={processing} className="px-5 md:px-6 py-2 md:py-2.5 bg-[#ff4d00] text-white font-bold text-xs md:text-sm rounded-lg shadow-sm hover:bg-[#e64500] transition-colors flex items-center gap-2">
                        {processing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-4 h-4" />}
                        Simpan Data
                    </button>
                </div>
            </div>
        </div>
    );
}