import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Save, Upload, Settings } from 'lucide-react';
import { useState } from 'react';

export default function Index({ app_name, app_logo }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        app_name: app_name || '',
        app_logo: null, // Untuk file upload
    });

    const [preview, setPreview] = useState(app_logo);

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
            forceFormData: true, // Wajib untuk upload file
        });
    };

    return (
        <AdminLayout title="Konfigurasi Aplikasi">
            <Head title="Konfigurasi" />

            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-[#00488b] text-white rounded-xl shadow-lg shadow-blue-900/20">
                        <Settings className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Konfigurasi Aplikasi</h1>
                        <p className="text-slate-500 text-sm">Ubah nama dan logo aplikasi secara global.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <form onSubmit={submit} className="p-6 md:p-8 space-y-6">
                        
                        {/* 1. Nama Aplikasi */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Aplikasi</label>
                            <input 
                                type="text" 
                                value={data.app_name}
                                onChange={e => setData('app_name', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-slate-200 focus:ring-[#00488b] focus:border-[#00488b] font-medium"
                                placeholder="Masukkan nama aplikasi..."
                            />
                            {errors.app_name && <p className="text-red-500 text-xs mt-1">{errors.app_name}</p>}
                        </div>

                        {/* 2. Upload Logo */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Logo Aplikasi</label>
                            <div className="flex items-start gap-6">
                                {/* Preview Box */}
                                <div className="shrink-0 w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden relative">
                                    {preview ? (
                                        <img src={preview} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <span className="text-xs text-slate-400 font-bold">No Logo</span>
                                    )}
                                </div>

                                {/* Input File */}
                                <div className="flex-1">
                                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors text-sm font-bold text-slate-600 mb-2 shadow-sm">
                                        <Upload className="w-4 h-4" />
                                        Pilih File Baru
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Format: PNG, JPG, SVG. Maksimal 2MB.<br/>
                                        Disarankan menggunakan gambar transparan (PNG) rasio 1:1.
                                    </p>
                                    {errors.app_logo && <p className="text-red-500 text-xs mt-1">{errors.app_logo}</p>}
                                    {progress && (
                                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                                            <div className="bg-[#00488b] h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress.percentage}%` }}></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-slate-100 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="flex items-center gap-2 bg-[#00488b] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#003666] transition-all shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-70"
                            >
                                {processing ? 'Menyimpan...' : (
                                    <>
                                        <Save className="w-4 h-4" /> Simpan Perubahan
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}