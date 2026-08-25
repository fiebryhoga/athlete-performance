import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { Settings, Save, Upload, UploadCloud, MonitorSmartphone, Image as ImageIcon, Sparkles, CheckCircle2, ShieldCheck, Eye, Info } from 'lucide-react';
import { useState, useRef } from 'react';
import Swal from 'sweetalert2';

export default function Index({ app_name, app_logo, login_background }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        app_name: app_name || '',
        app_logo: null, 
        login_background: null,
    });

    const [preview, setPreview] = useState(app_logo || '/assets/images/otslogo.png');
    const [previewBg, setPreviewBg] = useState(login_background || '/assets/images/bg-login.jpg');
    const fileInputRef = useRef(null);
    const bgFileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('app_logo', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleBgFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('login_background', file);
            setPreviewBg(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil Disimpan',
                    text: 'Pengaturan sistem & identitas aplikasi telah diperbarui.',
                    timer: 2000,
                    showConfirmButton: false,
                });
            },
        });
    };

    return (
        <AppLayout title="Pengaturan Sistem">
            <Head title="Pengaturan Sistem" />

            <div className="w-full mx-auto space-y-4 pb-12">
                
                {/* ── Header Atas ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/80 rounded-md p-4 sm:p-5 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-orange-50 border border-orange-200/70 flex items-center justify-center text-orange-600 shrink-0">
                            <Settings size={20} />
                        </div>
                        <div>
                            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                                Pengaturan Sistem
                            </h1>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                Kelola identitas merek, nama aplikasi, logo navigasi, dan visual halaman login.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Grid Kiri & Kanan (2 Kolom) ── */}
                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                        
                        {/* ─── KOLOM KIRI: Pratinjau Live & Ringkasan Info (lg:col-span-4) ─── */}
                        <div className="lg:col-span-4 space-y-4">
                            
                            {/* Kartu Live Preview Sidebar */}
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-orange-600" />
                                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                                        Pratinjau Navigasi
                                    </h3>
                                </div>
                                <div className="p-4 space-y-3">
                                    <p className="text-[11px] text-slate-500 font-medium">
                                        Tampilan logo dan nama aplikasi pada header sidebar sistem:
                                    </p>

                                    {/* Mockup Mini Header Sidebar */}
                                    <div className="bg-white border border-slate-200 rounded-md p-3 flex items-center gap-3 shadow-2xs">
                                        <div className="w-9 h-9 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 p-1">
                                            {preview ? (
                                                <img src={preview} alt="Logo Mockup" className="w-full h-full object-contain" />
                                            ) : (
                                                <div className="w-full h-full bg-orange-500 rounded text-white flex items-center justify-center font-bold text-xs">
                                                    {(data.app_name || 'O').charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                                                {data.app_name || 'Nama Aplikasi'}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium capitalize mt-0.5">
                                                Superadmin Hub
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Kartu Pratinjau Background Login */}
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-orange-600" />
                                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                                        Pratinjau Halaman Login
                                    </h3>
                                </div>
                                <div className="p-4 space-y-2.5">
                                    <div className="w-full h-32 rounded-md border border-slate-200 overflow-hidden relative shadow-2xs bg-slate-900">
                                        {previewBg && (
                                            <img src={previewBg} alt="Login BG Mockup" className="w-full h-full object-cover opacity-80" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded bg-white/20 backdrop-blur-xs p-0.5">
                                                    {preview && <img src={preview} alt="Logo Mini" className="w-full h-full object-contain" />}
                                                </div>
                                                <span className="text-[11px] font-bold text-white truncate max-w-[170px]">
                                                    {data.app_name || 'Nama Aplikasi'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10.5px] text-slate-400 font-medium">
                                        Gambar latar belakang yang menyambut pengguna saat proses autentikasi masuk.
                                    </p>
                                </div>
                            </div>

                            {/* Kartu Panduan Sistem */}
                            <div className="bg-slate-50 border border-slate-200/80 rounded-md p-3.5 space-y-2 text-[11px] text-slate-600 font-medium">
                                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                                    <Info size={13} className="text-orange-600" />
                                    <span>Panduan Identitas Visual</span>
                                </div>
                                <ul className="space-y-1 list-disc list-inside text-slate-500 text-[11px]">
                                    <li>Gunakan logo PNG dengan latar transparan (1:1).</li>
                                    <li>Maksimal ukuran file logo adalah 2MB.</li>
                                    <li>Background login resolusi 1920x1080 (16:9).</li>
                                </ul>
                            </div>

                        </div>

                        {/* ─── KOLOM KANAN: Form Pengaturan (lg:col-span-8) ─── */}
                        <div className="lg:col-span-8 space-y-4">
                            
                            {/* Card Form Branding */}
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                
                                <div className="px-4 sm:px-6 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MonitorSmartphone className="w-4 h-4 text-orange-600" />
                                        <h2 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
                                            Formulir Konfigurasi Identitas
                                        </h2>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6 space-y-6">
                                    
                                    {/* 1. Nama Aplikasi */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold text-slate-700">
                                            Nama Aplikasi <span className="text-rose-500">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            value={data.app_name}
                                            onChange={e => setData('app_name', e.target.value)}
                                            className="w-full px-3.5 py-2 rounded-md border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 font-medium text-xs sm:text-sm transition-all outline-none"
                                            placeholder="Contoh: Olympus Training Surabaya"
                                        />
                                        <p className="text-[11px] text-slate-400 font-medium">
                                            Nama ini ditampilkan pada judul sistem, header sidebar, dan dokumen ekspor resmi.
                                        </p>
                                        {errors.app_name && <p className="text-rose-500 text-xs font-bold mt-1">{errors.app_name}</p>}
                                    </div>

                                    {/* 2. Logo Aplikasi */}
                                    <div className="border-t border-slate-100 pt-5 space-y-3">
                                        <label className="block text-xs font-bold text-slate-700">
                                            Logo Aplikasi (Sidebar & Navigasi)
                                        </label>
                                        
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                                            {/* Preview Box */}
                                            <div 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="shrink-0 w-24 h-24 rounded-md border border-slate-200 bg-white flex items-center justify-center overflow-hidden relative cursor-pointer group hover:border-orange-400 transition-all shadow-2xs p-2"
                                                title="Klik untuk memilih logo baru"
                                            >
                                                {preview ? (
                                                    <>
                                                        <img src={preview} alt="Logo Preview" className="w-full h-full object-contain" />
                                                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <UploadCloud className="w-5 h-5 text-white" />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center text-slate-400 group-hover:text-orange-500">
                                                        <UploadCloud className="w-5 h-5 mb-1" />
                                                        <span className="text-[9px] font-bold">Unggah</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Button & Info */}
                                            <div className="flex-1 w-full text-center sm:text-left space-y-2">
                                                <button 
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:border-slate-300 transition-all text-xs font-bold text-slate-700 shadow-2xs cursor-pointer"
                                                >
                                                    <Upload size={13} className="text-orange-600" />
                                                    <span>Pilih File Logo Baru</span>
                                                </button>
                                                <input 
                                                    type="file" 
                                                    ref={fileInputRef}
                                                    className="hidden" 
                                                    accept="image/png, image/jpeg, image/svg+xml"
                                                    onChange={handleFileChange}
                                                />
                                                
                                                <div className="bg-slate-50 p-2.5 rounded-md border border-slate-100 text-left">
                                                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                                        Format: <strong className="text-slate-800">PNG, JPG, SVG</strong> (Maks: 2MB). Disarankan <strong className="text-slate-800">PNG transparan</strong> rasio 1:1.
                                                    </p>
                                                </div>
                                                
                                                {errors.app_logo && <p className="text-rose-500 text-xs font-bold">{errors.app_logo}</p>}
                                                
                                                {progress && (
                                                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                                                        <div className="bg-orange-500 h-full rounded-full transition-all duration-300" style={{ width: `${progress.percentage}%` }}></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. Background Halaman Login */}
                                    <div className="border-t border-slate-100 pt-5 space-y-3">
                                        <label className="block text-xs font-bold text-slate-700">
                                            Latar Belakang Halaman Login
                                        </label>
                                        
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                                            {/* Preview BG Box */}
                                            <div 
                                                onClick={() => bgFileInputRef.current?.click()}
                                                className="shrink-0 w-full sm:w-44 h-28 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative cursor-pointer group hover:border-orange-400 transition-all shadow-2xs"
                                                title="Klik untuk memilih background login baru"
                                            >
                                                {previewBg ? (
                                                    <>
                                                        <img src={previewBg} alt="Background Preview" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <ImageIcon className="w-5 h-5 text-white" />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center text-slate-400 group-hover:text-orange-500">
                                                        <ImageIcon className="w-5 h-5 mb-1" />
                                                        <span className="text-[9px] font-bold">Unggah BG</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* BG Actions */}
                                            <div className="flex-1 w-full text-center sm:text-left space-y-2">
                                                <button 
                                                    type="button"
                                                    onClick={() => bgFileInputRef.current?.click()}
                                                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:border-slate-300 transition-all text-xs font-bold text-slate-700 shadow-2xs cursor-pointer"
                                                >
                                                    <Upload size={13} className="text-orange-600" />
                                                    <span>Pilih Background Baru</span>
                                                </button>
                                                <input 
                                                    type="file" 
                                                    ref={bgFileInputRef}
                                                    className="hidden" 
                                                    accept="image/png, image/jpeg, image/jpg"
                                                    onChange={handleBgFileChange}
                                                />
                                                
                                                <div className="bg-slate-50 p-2.5 rounded-md border border-slate-100 text-left">
                                                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                                        Format: <strong className="text-slate-800">PNG, JPG, JPEG</strong> (Maks: 5MB). Resolusi rekomendasi 1920x1080 piksel.
                                                    </p>
                                                </div>
                                                
                                                {errors.login_background && <p className="text-rose-500 text-xs font-bold">{errors.login_background}</p>}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Submit Action Bar */}
                                <div className="px-4 sm:px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end">
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="inline-flex items-center justify-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-md font-bold text-xs shadow-2xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                                    >
                                        {processing ? (
                                            <>
                                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                <span>Menyimpan...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={14} />
                                                <span>Simpan Konfigurasi</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                            </div>

                        </div>

                    </div>
                </form>

            </div>
        </AppLayout>
    );
}