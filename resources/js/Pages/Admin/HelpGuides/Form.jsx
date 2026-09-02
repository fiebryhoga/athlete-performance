import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/Common/PageHeader';
import PageFooter from '@/Components/Common/PageFooter';
import { 
    ArrowLeft, 
    Save, 
    Plus, 
    Trash2, 
    MoveUp, 
    MoveDown, 
    UploadCloud, 
    X, 
    Image as ImageIcon, 
    Lightbulb, 
    Layers, 
    BookOpen,
    Loader2,
    Settings
} from 'lucide-react';

export default function HelpGuideForm({ guide = null, categories = [] }) {
    const isEdit = !!guide;

    // Initial steps
    const initialSteps = (guide?.steps && guide.steps.length > 0)
        ? guide.steps.map((step, idx) => ({
            id: step.id,
            step_number: step.step_number || (idx + 1),
            title: step.title || '',
            description: step.description || '',
            tip: step.tip || '',
            image: null,
            existing_image: step.image_path || null,
            remove_image: false,
            preview: step.image_path ? (step.image_path.startsWith('http') ? step.image_path : `/storage/${step.image_path}`) : null,
        }))
        : [
            {
                id: null,
                step_number: 1,
                title: '',
                description: '',
                tip: '',
                image: null,
                existing_image: null,
                remove_image: false,
                preview: null,
            }
        ];

    const { data, setData, post, processing, errors } = useForm({
        title: guide?.title || '',
        slug: guide?.slug || '',
        category_id: guide?.category_id || '',
        target_role: guide?.target_role || 'athlete',
        summary: guide?.summary || '',
        content: guide?.content || '',
        is_published: guide ? guide.is_published : true,
        order: guide?.order || 0,
        steps: initialSteps,
    });

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setData(prev => {
            const shouldUpdateSlug = !isEdit || prev.slug === '' || prev.slug === slugify(prev.title);
            return {
                ...prev,
                title: newTitle,
                slug: shouldUpdateSlug ? slugify(newTitle) : prev.slug,
            };
        });
    };

    const slugify = (text) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    };

    const addStep = () => {
        setData('steps', [
            ...data.steps,
            {
                id: null,
                step_number: data.steps.length + 1,
                title: '',
                description: '',
                tip: '',
                image: null,
                existing_image: null,
                remove_image: false,
                preview: null,
            }
        ]);
    };

    const removeStep = (index) => {
        if (data.steps.length <= 1) {
            alert('Panduan minimal harus memiliki 1 langkah.');
            return;
        }
        const updatedSteps = data.steps
            .filter((_, i) => i !== index)
            .map((s, idx) => ({ ...s, step_number: idx + 1 }));
        setData('steps', updatedSteps);
    };

    const moveStep = (index, direction) => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= data.steps.length) return;

        const updated = [...data.steps];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        const reordered = updated.map((s, idx) => ({ ...s, step_number: idx + 1 }));
        setData('steps', reordered);
    };

    const handleStepChange = (index, field, value) => {
        const updated = [...data.steps];
        updated[index][field] = value;
        setData('steps', updated);
    };

    const handleStepImageChange = (index, file) => {
        if (!file) return;
        const updated = [...data.steps];
        updated[index].image = file;
        updated[index].preview = URL.createObjectURL(file);
        updated[index].remove_image = false;
        setData('steps', updated);
    };

    const handleRemoveStepImage = (index) => {
        const updated = [...data.steps];
        updated[index].image = null;
        updated[index].preview = null;
        updated[index].remove_image = true;
        setData('steps', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            router.post(route('admin.help-guides.update', guide.id), {
                _method: 'PUT',
                ...data,
            }, {
                forceFormData: true,
            });
        } else {
            post(route('admin.help-guides.store'), {
                forceFormData: true,
            });
        }
    };

    return (
        <AppLayout title={isEdit ? 'Edit Panduan' : 'Tambah Panduan'}>
            <Head title={isEdit ? `Edit Panduan: ${guide.title}` : 'Tambah Panduan Baru'} />

            <form onSubmit={handleSubmit} className="space-y-4 pb-6">
                {/* STANDARD PAGE HEADER */}
                <PageHeader
                    title={isEdit ? 'Edit Panduan' : 'Tambah Panduan'}
                    description={isEdit ? `Mengubah panduan "${guide.title}"` : 'Buat petunjuk tata cara langkah demi langkah dengan ilustrasi gambar.'}
                    icon={BookOpen}
                    actions={
                        <div className="flex items-center gap-2">
                            <Link
                                href={route('admin.help-guides.index')}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 border border-slate-200/90 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-xs"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Batal</span>
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-b from-orange-500 to-orange-600 text-white border border-orange-600 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-sm hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 cursor-pointer"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-3.5 h-3.5" />
                                        <span>{isEdit ? 'Simpan Perubahan' : 'Terbitkan Panduan'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    }
                />

                {/* TWO COLUMN / KANAN KIRI LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    
                    {/* LEFT COLUMN: DYNAMIC STEP BUILDER (8 cols) */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/80 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100/60">
                                        <Layers className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-900">
                                            Rincian Langkah Demi Langkah ({data.steps.length} Langkah)
                                        </h3>
                                        <p className="text-[11px] text-slate-400">
                                            Susun urutan tindakan, penjelasan detail, screenshot UI, dan tips.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={addStep}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200/70 rounded-md transition-colors shadow-2xs cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Tambah Langkah</span>
                                </button>
                            </div>

                            {/* Step Cards List */}
                            <div className="space-y-3.5">
                                {data.steps.map((step, idx) => (
                                    <div 
                                        key={idx} 
                                        className="p-3.5 sm:p-4 bg-slate-50/70 border border-slate-200 rounded-lg space-y-3 relative"
                                    >
                                        {/* Step Card Header */}
                                        <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                                            <div className="flex items-center gap-2">
                                                <span className="w-5 h-5 rounded-md bg-orange-500 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                                                    {idx + 1}
                                                </span>
                                                <span className="text-xs font-bold text-slate-800">
                                                    Langkah {idx + 1}
                                                </span>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    disabled={idx === 0}
                                                    onClick={() => moveStep(idx, 'up')}
                                                    title="Pindah ke Atas"
                                                    className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors"
                                                >
                                                    <MoveUp className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={idx === data.steps.length - 1}
                                                    onClick={() => moveStep(idx, 'down')}
                                                    title="Pindah ke Bawah"
                                                    className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors"
                                                >
                                                    <MoveDown className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeStep(idx)}
                                                    title="Hapus Langkah Ini"
                                                    className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors ml-1 cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Step Title */}
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-slate-700">
                                                Judul Langkah <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={step.title}
                                                onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                                                placeholder="Misal: Buka Menu Wellness & Klik Input Baru"
                                                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-medium placeholder-slate-400 shadow-2xs"
                                                required
                                            />
                                        </div>

                                        {/* Step Description */}
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-slate-700">
                                                Petunjuk / Deskripsi Langkah
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={step.description}
                                                onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                                                placeholder="Jelaskan tindakan yang harus dilakukan oleh pengguna pada langkah ini..."
                                                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-slate-900 placeholder-slate-400 leading-relaxed shadow-2xs"
                                            />
                                        </div>

                                        {/* Step Tip Callout */}
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                                                <Lightbulb className="w-3 h-3 text-orange-500" />
                                                Tips / Catatan Singkat (Opsional)
                                            </label>
                                            <input
                                                type="text"
                                                value={step.tip}
                                                onChange={(e) => handleStepChange(idx, 'tip', e.target.value)}
                                                placeholder="Tips: Pastikan mengisi sebelum jam 09:00 pagi..."
                                                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-slate-800 placeholder-slate-400"
                                            />
                                        </div>

                                        {/* Step Image Upload */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                                                <ImageIcon className="w-3 h-3 text-slate-500" />
                                                Screenshot / Gambar Ilustrasi (Opsional)
                                            </label>

                                            {step.preview ? (
                                                <div className="relative inline-block border border-slate-200 rounded-md overflow-hidden bg-slate-50 max-w-sm">
                                                    <img
                                                        src={step.preview}
                                                        alt={`Preview Langkah ${idx + 1}`}
                                                        className="max-h-44 w-auto object-contain"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveStepImage(idx)}
                                                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors"
                                                        title="Hapus Gambar"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2.5">
                                                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors shadow-2xs">
                                                        <UploadCloud className="w-3.5 h-3.5 text-orange-500" />
                                                        <span>Pilih File Screenshot</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => handleStepImageChange(idx, e.target.files[0])}
                                                        />
                                                    </label>
                                                    <span className="text-[11px] text-slate-400">
                                                        PNG, JPG, atau WebP (Maks. 5MB)
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Step Button */}
                            <button
                                type="button"
                                onClick={addStep}
                                className="w-full py-2.5 border border-dashed border-slate-300 hover:border-orange-500 rounded-lg text-xs font-bold text-slate-500 hover:text-orange-600 flex items-center justify-center gap-1.5 transition-colors bg-white hover:bg-orange-50/20 cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ Tambah Langkah Selanjutnya</span>
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: GENERAL SETTINGS (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/80 shadow-2xs space-y-3.5">
                            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                                <div className="w-6 h-6 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100/60">
                                    <Settings className="w-3.5 h-3.5" />
                                </div>
                                <h3 className="text-xs font-bold text-slate-900">
                                    Pengaturan Panduan
                                </h3>
                            </div>

                            {/* Judul Panduan */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-700">
                                    Judul Panduan <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={handleTitleChange}
                                    placeholder="Contoh: Cara Mengisi Wellness"
                                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-slate-900 placeholder-slate-400 shadow-2xs font-semibold"
                                    required
                                />
                                {errors.title && <p className="text-[11px] text-rose-500">{errors.title}</p>}
                            </div>

                            {/* Slug URL */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-700">
                                    Slug URL
                                </label>
                                <input
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="cara-mengisi-wellness"
                                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-slate-700 placeholder-slate-400 font-mono text-[11px]"
                                />
                                {errors.slug && <p className="text-[11px] text-rose-500">{errors.slug}</p>}
                            </div>

                            {/* Target Peran */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-700">
                                    Target Peran Pengguna <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={data.target_role}
                                    onChange={(e) => setData('target_role', e.target.value)}
                                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-medium shadow-2xs"
                                    required
                                >
                                    <option value="athlete">Khusus Klien / Atlet (Athlete)</option>
                                    <option value="coach">Khusus Pelatih (Coach)</option>
                                    <option value="all">Semua Peran (Umum)</option>
                                </select>
                            </div>

                            {/* Kategori */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-700">
                                    Kategori Modul
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-slate-900 shadow-2xs"
                                >
                                    <option value="">Pilih Kategori (Opsional)</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Urutan & Status */}
                            <div className="grid grid-cols-2 gap-2.5 pt-1">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-700">
                                        Urutan Tampil
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.order}
                                        onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-slate-900 shadow-2xs"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-700">
                                        Status
                                    </label>
                                    <div className="pt-1 flex items-center gap-1.5">
                                        <input
                                            type="checkbox"
                                            id="is_published"
                                            checked={data.is_published}
                                            onChange={(e) => setData('is_published', e.target.checked)}
                                            className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                                        />
                                        <label htmlFor="is_published" className="text-xs font-semibold text-slate-800 cursor-pointer">
                                            {data.is_published ? 'Publish' : 'Draft'}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Ringkasan */}
                            <div className="space-y-1 pt-1">
                                <label className="text-[11px] font-bold text-slate-700">
                                    Ringkasan Singkat (Summary)
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.summary}
                                    onChange={(e) => setData('summary', e.target.value)}
                                    placeholder="Jelaskan secara singkat tujuan panduan ini..."
                                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-slate-900 placeholder-slate-400 leading-relaxed shadow-2xs"
                                />
                            </div>

                            {/* Save Button in Sidebar */}
                            <div className="pt-2 border-t border-slate-100">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex items-center justify-center gap-1.5 py-2 bg-gradient-to-b from-orange-500 to-orange-600 text-white border border-orange-600 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-sm hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 cursor-pointer"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            <span>Menyimpan...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-3.5 h-3.5" />
                                            <span>{isEdit ? 'Simpan Perubahan' : 'Terbitkan Panduan'}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <PageFooter />
            </form>
        </AppLayout>
    );
}
