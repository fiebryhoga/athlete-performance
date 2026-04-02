import { Save, X, Zap } from 'lucide-react';

export default function DailyMetricModal({ isOpen, onClose, form, submit, selectedDateLabel, formatDateToIndo }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Input Data Harian</h3>
                        <p className="text-xs text-[#00488b] font-bold mt-0.5">
                            {selectedDateLabel} • {formatDateToIndo(form.data.record_date, 'full')}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={submit} className="p-6">
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500   tracking-wider">RHR <span className="text-red-500">*</span></label>
                            <input type="number" step="0.1" required value={form.data.rhr} onChange={e => form.setData('rhr', e.target.value)} className="w-full text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-[#00488b] transition-all" placeholder="Contoh: 65"/>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500   tracking-wider">SpO2 (%) <span className="text-red-500">*</span></label>
                            <input type="number" step="0.1" required value={form.data.spo2} onChange={e => form.setData('spo2', e.target.value)} className="w-full text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-[#00488b] transition-all" placeholder="Contoh: 98"/>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500   tracking-wider">Weight / BB (Kg) <span className="text-red-500">*</span></label>
                            <input type="number" step="0.1" required value={form.data.weight} onChange={e => form.setData('weight', e.target.value)} className="w-full text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-[#00488b] transition-all"/>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500   tracking-wider">Vertical Jump (VJ) <span className="text-red-500">*</span></label>
                            <input type="number" step="0.01" required value={form.data.vj} onChange={e => form.setData('vj', e.target.value)} className="w-full text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-[#00488b] transition-all"/>
                        </div>
                    </div>
                    
                    <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100 mt-6">
                        <p className="text-xs text-[#00488b] font-medium leading-relaxed">
                            <span className="font-bold   tracking-wider flex items-center gap-1.5 mb-1.5"><Zap className="w-3.5 h-3.5 fill-current"/> Auto-Calculate</span>
                            Sistem otomatis menghitung <b>VO2Max</b>, <b>Peak Power</b>, dan <b>Status Recovery</b>.
                        </p>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3.5 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors">Batal</button>
                        <button type="submit" disabled={form.processing} className="flex-[2] py-3.5 bg-[#00488b] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#003666] transition-all flex justify-center items-center gap-2">
                            {form.processing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-4 h-4" />}
                            Simpan Data
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}