import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Save, Upload, Settings, UploadCloud, MonitorSmartphone } from 'lucide-react';
import { useState, useRef } from 'react';

export default function Index({ app_name, app_logo }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        app_name: app_name || '',
        app_logo: null, 
    });

    const [preview, setPreview] = useState(app_logo);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('app_logo', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Application Settings">
            <Head title="Settings" />

            
            <div className="w-full max-w-[1400px] mx-auto pb-12">
                
                
                <div className="bg-white p-5 md:p-8 rounded-xl border border-slate-200 shadow-sm mb-6 md:mb-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none"></div>
                    
                    <div className="relative z-10 w-full">
                        <span className="text-[9px] md:text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest mb-2 md:mb-3 inline-block border border-slate-200">System Configuration</span>
                        <h2 className="text-xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                            <Settings className="w-6 h-6 md:w-8 md:h-8 text-slate-700" /> Application Settings
                        </h2>
                        <p className="text-slate-500 font-medium mt-1 text-xs md:text-sm">Ubah nama dan logo identitas aplikasi yang akan ditampilkan di seluruh sistem.</p>
                    </div>
                </div>

                
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
                    
                    <div className="px-5 md:px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                        <MonitorSmartphone className="w-4 h-4 md:w-5 md:h-5 text-[#ff4d00]" />
                        <h3 className="font-bold text-base md:text-lg text-slate-800">Branding & Identity</h3>
                    </div>

                    <form onSubmit={submit} className="p-5 md:p-8 space-y-6 md:space-y-8">
                        
                        
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nama Aplikasi</label>
                            <input 
                                type="text" 
                                value={data.app_name}
                                onChange={e => setData('app_name', e.target.value)}
                                
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] font-medium text-sm transition-all outline-none touch-manipulation"
                                placeholder="Masukkan nama aplikasi..."
                            />
                            {errors.app_name && <p className="text-rose-500 text-[10px] md:text-xs mt-1.5 font-bold">{errors.app_name}</p>}
                        </div>

                        
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Logo Aplikasi</label>
                            
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 md:gap-6">
                                
                                
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="shrink-0 w-28 h-28 md:w-32 md:h-32 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden relative cursor-pointer group hover:border-[#ff4d00] hover:bg-orange-50/50 transition-all touch-manipulation"
                                >
                                    {preview ? (
                                        <>
                                            <img src={preview} alt="Logo Preview" className="w-full h-full object-contain p-3" />
                                            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <UploadCloud className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center text-slate-400 group-hover:text-[#ff4d00]">
                                            <UploadCloud className="w-6 h-6 md:w-8 md:h-8 mb-1" />
                                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Upload</span>
                                        </div>
                                    )}
                                </div>

                                
                                <div className="flex-1 w-full text-center sm:text-left">
                                    <button 
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-xs md:text-sm font-bold text-slate-600 mb-3 shadow-sm w-full sm:w-auto touch-manipulation"
                                    >
                                        <Upload className="w-4 h-4 text-slate-400" /> Pilih File Logo Baru
                                    </button>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        className="hidden" 
                                        accept="image/png, image/jpeg, image/svg+xml"
                                        onChange={handleFileChange}
                                    />
                                    
                                    <div className="bg-slate-50 p-3.5 md:p-4 rounded-xl border border-slate-100 text-left">
                                        <p className="text-[11px] md:text-xs text-slate-500 font-medium leading-relaxed">
                                            Format didukung: <strong className="text-slate-700">PNG, JPG, SVG</strong> (Maks: 2MB). <br className="hidden sm:block"/>
                                            Disarankan menggunakan gambar <strong className="text-slate-700">transparan (PNG)</strong> dengan rasio <strong className="text-slate-700">1:1 (Kotak)</strong> agar tampil presisi di sidebar.
                                        </p>
                                    </div>
                                    
                                    {errors.app_logo && <p className="text-rose-500 text-[10px] md:text-xs mt-2 font-bold text-left">{errors.app_logo}</p>}
                                    
                                    {progress && (
                                        <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden border border-slate-200">
                                            <div className="bg-[#ff4d00] h-full rounded-full transition-all duration-300" style={{ width: `${progress.percentage}%` }}></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        
                        <div className="pt-6 md:pt-8 border-t border-slate-100 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff4d00] text-white px-8 py-3.5 md:py-3 rounded-lg md:rounded-xl font-bold hover:bg-[#e64500] transition-all shadow-lg shadow-[#ff4d00]/20 active:scale-95 disabled:opacity-70 text-sm touch-manipulation"
                            >
                                {processing && <span className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                                {!processing && <Save className="w-4 h-4 md:w-5 md:h-5" />}
                                {processing ? 'Menyimpan Konfigurasi...' : 'Simpan Konfigurasi'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}