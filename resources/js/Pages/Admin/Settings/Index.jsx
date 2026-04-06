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

            <div className="pb-12">
                
                {/* --- HEADER UTAMA --- */}
                <div className="bg-white p-6 md:p-8 rounded-lg border border-slate-200 shadow-sm mb-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none"></div>
                    
                    <div className="relative z-10 w-full">
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block border border-slate-200">System Configuration</span>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                            <Settings className="w-8 h-8 text-slate-700" /> Application Settings
                        </h2>
                        <p className="text-slate-500 font-medium mt-1 text-sm">Ubah nama dan logo identitas aplikasi yang akan ditampilkan di seluruh sistem.</p>
                    </div>
                </div>

                {/* --- FORM CARD --- */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
                    
                    <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                        <MonitorSmartphone className="w-5 h-5 text-[#00488b]" />
                        <h3 className="font-bold text-lg text-slate-800">Branding & Identity</h3>
                    </div>

                    <form onSubmit={submit} className="p-6 md:p-8 space-y-8">
                        
                        {/* 1. Nama Aplikasi */}
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nama Aplikasi</label>
                            <input 
                                type="text" 
                                value={data.app_name}
                                onChange={e => setData('app_name', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-slate-200 focus:ring-2 focus:ring-[#00488b]/20 focus:border-[#00488b] font-medium text-sm transition-all outline-none"
                                placeholder="Masukkan nama aplikasi..."
                            />
                            {errors.app_name && <p className="text-rose-500 text-xs mt-1.5 font-bold">{errors.app_name}</p>}
                        </div>

                        {/* 2. Upload Logo */}
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Logo Aplikasi</label>
                            <div className="flex flex-col sm:flex-row items-start gap-6">
                                
                                {/* Preview Box (Clickable) */}
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="shrink-0 w-32 h-32 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden relative cursor-pointer group hover:border-[#00488b] hover:bg-blue-50/30 transition-all"
                                >
                                    {preview ? (
                                        <>
                                            <img src={preview} alt="Logo Preview" className="w-full h-full object-contain p-3" />
                                            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <UploadCloud className="w-6 h-6 text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center text-slate-400 group-hover:text-[#00488b]">
                                            <UploadCloud className="w-8 h-8 mb-1" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Upload</span>
                                        </div>
                                    )}
                                </div>

                                {/* Input File Info */}
                                <div className="flex-1 w-full">
                                    <button 
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-bold text-slate-600 mb-3 shadow-sm"
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
                                    
                                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                            Format didukung: <strong className="text-slate-700">PNG, JPG, SVG</strong> (Maks: 2MB). <br className="hidden sm:block"/>
                                            Disarankan menggunakan gambar <strong className="text-slate-700">transparan (PNG)</strong> dengan rasio <strong className="text-slate-700">1:1 (Kotak)</strong> agar tampil presisi di sidebar.
                                        </p>
                                    </div>
                                    
                                    {errors.app_logo && <p className="text-rose-500 text-xs mt-2 font-bold">{errors.app_logo}</p>}
                                    
                                    {progress && (
                                        <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden border border-slate-200">
                                            <div className="bg-[#ff4d00] h-full rounded-full transition-all duration-300" style={{ width: `${progress.percentage}%` }}></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-8 border-t border-slate-100 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff4d00] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#003666] transition-all shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-70 text-sm"
                            >
                                {processing && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                                {!processing && <Save className="w-4 h-4" />}
                                {processing ? 'Menyimpan Konfigurasi...' : 'Simpan Konfigurasi'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}