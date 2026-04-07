import { Save, X, Zap } from 'lucide-react';

export default function DailyMetricModal({ isOpen, onClose, form, submit, selectedDateLabel, formatDateToIndo }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            
            <div className="relative bg-white w-full max-w-md rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                
                {/* HEADER MODAL */}
                <div className="px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 shrink-0">
                    <div>
                        <h3 className="font-bold text-base md:text-lg text-slate-800">Input Data Harian</h3>
                        <p className="text-[10px] md:text-xs text-[#ff4d00] font-bold mt-0.5">
                            {selectedDateLabel} • {formatDateToIndo(form.data.record_date, 'full')}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1.5 md:p-2 text-slate-400 hover:bg-orange-50 hover:text-[#ff4d00] rounded-full transition-all touch-manipulation">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                {/* BODY FORM */}
                <div className="overflow-y-auto custom-scrollbar flex-1">
                    <form id="daily-metric-form" onSubmit={submit} className="p-5 md:p-6">
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            
                            {/* BARIS 1: Usia & BB */}
                            <div className="space-y-1.5">
                                <label className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    Usia (Thn) <span className="text-rose-500">*</span>
                                </label>
                                <input 
                                    type="number" 
                                    min="5" 
                                    max="100" 
                                    required 
                                    value={form.data.age} 
                                    onChange={e => form.setData('age', e.target.value)} 
                                    className="w-full text-xs md:text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#ff4d00] focus:border-[#ff4d00] transition-all outline-none" 
                                    placeholder="Cth: 22"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    Weight / BB (Kg) <span className="text-rose-500">*</span>
                                </label>
                                <input 
                                    type="number" 
                                    step="0.1" 
                                    required 
                                    value={form.data.weight} 
                                    onChange={e => form.setData('weight', e.target.value)} 
                                    className="w-full text-xs md:text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#ff4d00] focus:border-[#ff4d00] transition-all outline-none" 
                                    placeholder="Cth: 65.5"
                                />
                            </div>

                            {/* BARIS 2: RHR & SpO2 */}
                            <div className="space-y-1.5">
                                <label className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    RHR <span className="text-rose-500">*</span>
                                </label>
                                <input 
                                    type="number" 
                                    step="0.1" 
                                    required 
                                    value={form.data.rhr} 
                                    onChange={e => form.setData('rhr', e.target.value)} 
                                    className="w-full text-xs md:text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#ff4d00] focus:border-[#ff4d00] transition-all outline-none" 
                                    placeholder="Cth: 60"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    SpO2 (%) <span className="text-rose-500">*</span>
                                </label>
                                <input 
                                    type="number" 
                                    step="0.1" 
                                    required 
                                    value={form.data.spo2} 
                                    onChange={e => form.setData('spo2', e.target.value)} 
                                    className="w-full text-xs md:text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#ff4d00] focus:border-[#ff4d00] transition-all outline-none" 
                                    placeholder="Cth: 98"
                                />
                            </div>
                            
                            {/* BARIS 3: VJ (Full Width) */}
                            <div className="col-span-2 space-y-1.5">
                                <label className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    Vertical Jump (VJ) <span className="text-rose-500">*</span>
                                </label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    required 
                                    value={form.data.vj} 
                                    onChange={e => form.setData('vj', e.target.value)} 
                                    className="w-full text-xs md:text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#ff4d00] focus:border-[#ff4d00] transition-all outline-none"
                                    placeholder="Cth: 55"
                                />
                            </div>
                            
                            {/* BARIS 4: Notes (Full Width) */}
                            <div className="col-span-2 space-y-1.5 mt-1">
                                <label className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Catatan Tambahan (Opsional)</label>
                                <textarea 
                                    rows="2" 
                                    value={form.data.notes} 
                                    onChange={e => form.setData('notes', e.target.value)} 
                                    className="w-full text-xs md:text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#ff4d00] focus:border-[#ff4d00] transition-all resize-none outline-none" 
                                    placeholder="Cth: Tidur larut malam, otot agak pegal..."
                                ></textarea>
                            </div>
                        </div>
                        
                        {/* INFO AUTO CALCULATE */}
                        <div className="bg-orange-50/80 p-3 md:p-4 rounded-xl md:rounded-2xl border border-orange-100 mt-5 md:mt-6">
                            <p className="text-[10px] md:text-xs text-orange-700 font-medium leading-relaxed">
                                <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1.5 text-[#ff4d00]"><Zap className="w-3.5 h-3.5 fill-current"/> Auto-Calculate</span>
                                Sistem otomatis menghitung <b>VO2Max</b> (menggunakan Usia), <b>Peak Power</b>, dan <b>Status Recovery</b>.
                            </p>
                        </div>
                    </form>
                </div>

                {/* FOOTER MODAL (Tombol Submit) */}
                <div className="p-4 md:p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2 md:gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="flex-1 px-4 md:px-5 py-2.5 md:py-3 text-slate-500 font-bold text-xs md:text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors touch-manipulation">
                        Batal
                    </button>
                    <button type="submit" form="daily-metric-form" disabled={form.processing} className="flex-[2] px-5 md:px-6 py-2.5 md:py-3 bg-[#ff4d00] text-white font-bold text-xs md:text-sm rounded-xl shadow-lg shadow-[#ff4d00]/20 hover:bg-[#e64500] hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation">
                        {form.processing ? <span className="w-4 h-4 md:w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-4 h-4 md:w-4" />}
                        Simpan Data
                    </button>
                </div>

            </div>
        </div>
    );
}