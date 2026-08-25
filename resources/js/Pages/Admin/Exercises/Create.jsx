import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import {
    ChevronLeft,
    Plus,
    Trash2,
    Save,
    Image as ImageIcon,
    Video,
    ExternalLink,
    PlayCircle,
    CheckCircle,
    FileText,
    Layers,
    Dumbbell,
    UploadCloud,
    X,
    Sparkles
} from "lucide-react";
import PageHeader from "@/Components/Common/PageHeader";

export default function Create({ categories = [] }) {
    const {
        data,
        setData,
        post,
        processing,
        recentlySuccessful,
        errors,
    } = useForm({
        name: "",
        description: "",
        exercise_category_id: "",
        images: [],
        videos: [""],
    });

    const submit = (e) => {
        e.preventDefault();
        const cleanVideos = data.videos.filter(v => v.trim() !== "");
        
        post(route("admin.exercises.store"), {
            ...data,
            videos: JSON.stringify(cleanVideos),
            forceFormData: true,
        });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setData('images', [...data.images, ...files]);
    };
    
    const removeNewImage = (index) => {
        const newImages = [...data.images];
        newImages.splice(index, 1);
        setData('images', newImages);
    };

    const addVideoRow = () => setData('videos', [...data.videos, ""]);
    
    const removeVideoRow = (index) => {
        const newVids = [...data.videos];
        newVids.splice(index, 1);
        if (newVids.length === 0) newVids.push("");
        setData('videos', newVids);
    };
    
    const updateVideoRow = (index, val) => {
        const newVids = [...data.videos];
        newVids[index] = val;
        setData('videos', newVids);
    };

    const totalImagesCount = data.images.length;
    const validVideosCount = data.videos.filter(v => v.trim() !== "").length;

    return (
        <AppLayout title="Buat Latihan Baru">
            <Head title="Buat Latihan Baru" />

            <div className="space-y-4 pb-16">
                {/* ─── PAGE HEADER ─── */}
                <div className="space-y-1">
                    <Link
                        href={route("admin.exercises.index")}
                        className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors gap-1.5"
                    >
                        <ChevronLeft size={14} />
                        <span>Kembali ke Master Latihan</span>
                    </Link>

                    <PageHeader
                        title="Buat Latihan Baru"
                        description="Tambahkan master gerakan latihan baru beserta kategori, deskripsi instruksi, foto visual, dan tautan video tutorial."
                        actions={
                            <Link
                                href={route("admin.exercises.index")}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                            >
                                <ChevronLeft size={14} />
                                <span>Daftar Latihan</span>
                            </Link>
                        }
                    />
                </div>

                <form onSubmit={submit}>
                    {/* ─── 2-COLUMN DASHBOARD LAYOUT (KANAN - KIRI) ─── */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                        {/* ═══════════════════════════════════════
                            KOLOM KIRI (LEBAR): Form Detail & Video URL
                           ═══════════════════════════════════════ */}
                        <div className="order-1 lg:col-span-7 xl:col-span-8 space-y-4">
                            {/* Card 1: Informasi Utama Latihan */}
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Dumbbell size={14} className="text-orange-500" />
                                        <h3 className="text-xs font-bold text-slate-900">
                                            Informasi Detail Latihan
                                        </h3>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        Data Baru
                                    </span>
                                </div>

                                <div className="p-4 space-y-3.5">
                                    {/* Nama Latihan */}
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-700 block">
                                            Nama Latihan <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            className={`w-full px-3 py-2 rounded-md border text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all ${
                                                errors.name ? "border-rose-300 ring-1 ring-rose-300" : "border-slate-200"
                                            }`}
                                            placeholder="Contoh: Barbell Back Squat, Dumbbell Bench Press"
                                            required
                                            autoFocus
                                        />
                                        {errors.name && (
                                            <p className="text-[10.5px] text-rose-600 font-bold mt-0.5">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Kategori Latihan */}
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-700 block">
                                            Kategori Latihan (Opsional)
                                        </label>
                                        <select
                                            value={data.exercise_category_id}
                                            onChange={(e) => setData("exercise_category_id", e.target.value)}
                                            className="w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold text-slate-800 shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all cursor-pointer"
                                        >
                                            <option value="">Tanpa Kategori</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Deskripsi & Instruksi Pelaksanaan */}
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-700 block">
                                            Deskripsi & Petunjuk Gerakan
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData("description", e.target.value)}
                                            rows="4"
                                            className="w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium text-slate-800 shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-y"
                                            placeholder="Tuliskan petunjuk teknik, posisi tubuh awal, titik fokus otot, atau instruksi pernapasan..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Tautan Video Referensi */}
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Video size={14} className="text-orange-500" />
                                        <h3 className="text-xs font-bold text-slate-900">
                                            Tautan Video Referensi (URL)
                                        </h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addVideoRow}
                                        className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60 cursor-pointer transition-colors"
                                    >
                                        <Plus size={11} />
                                        <span>Tambah Tautan</span>
                                    </button>
                                </div>

                                <div className="p-4 space-y-2.5">
                                    {data.videos.map((v, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                                                    <Video size={13} />
                                                </div>
                                                <input
                                                    type="url"
                                                    value={v}
                                                    onChange={(e) => updateVideoRow(i, e.target.value)}
                                                    placeholder="https://www.youtube.com/watch?v=..."
                                                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-800 shadow-2xs outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                                />
                                            </div>

                                            {v.trim() !== "" && (
                                                <a
                                                    href={v}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-1.5 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-md shadow-2xs transition-colors"
                                                    title="Buka tautan video"
                                                >
                                                    <ExternalLink size={13} />
                                                </a>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => removeVideoRow(i)}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 bg-white border border-slate-200 rounded-md shadow-2xs transition-colors cursor-pointer"
                                                title="Hapus baris tautan"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    ))}
                                    <p className="text-[10.5px] text-slate-400 font-medium pt-1">
                                        Mendukung tautan video dari YouTube, Vimeo, atau media online lainnya.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ═══════════════════════════════════════
                            KOLOM KANAN (SIDEBAR): Aksi Simpan & Galeri Gambar
                           ═══════════════════════════════════════ */}
                        <div className="order-2 lg:col-span-5 xl:col-span-4 space-y-4 lg:sticky lg:top-4">
                            {/* Card 1: Ringkasan & Tombol Aksi */}
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Layers size={14} className="text-orange-500" />
                                        <h3 className="text-xs font-bold text-slate-900">
                                            Status & Aksi
                                        </h3>
                                    </div>
                                    {recentlySuccessful && (
                                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                            <CheckCircle size={12} /> Tersimpan
                                        </span>
                                    )}
                                </div>

                                <div className="p-4 space-y-3.5">
                                    <div className="divide-y divide-slate-100 text-xs">
                                        <div className="py-1.5 flex items-center justify-between">
                                            <span className="text-slate-500 font-medium">Gambar Terlampir</span>
                                            <span className="font-bold text-slate-900">{totalImagesCount} Foto</span>
                                        </div>
                                        <div className="py-1.5 flex items-center justify-between">
                                            <span className="text-slate-500 font-medium">Tautan Video</span>
                                            <span className="font-bold text-slate-900">{validVideosCount} Tautan</span>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full inline-flex items-center justify-center rounded-md text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-2xs h-9 px-4 gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
                                        >
                                            <Save size={13.5} />
                                            <span>{processing ? "Menyimpan..." : "Simpan Latihan"}</span>
                                        </button>

                                        <Link
                                            href={route("admin.exercises.index")}
                                            className="w-full inline-flex items-center justify-center rounded-md text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 h-8 px-3.5 gap-1.5 shadow-2xs cursor-pointer transition-colors"
                                        >
                                            <X size={13} />
                                            <span>Batal</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Galeri Gambar Visual */}
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <ImageIcon size={14} className="text-orange-500" />
                                        <h3 className="text-xs font-bold text-slate-900">
                                            Galeri Gambar
                                        </h3>
                                    </div>

                                    <label className="cursor-pointer bg-white px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors border border-slate-200/90 shadow-2xs flex items-center gap-1">
                                        <Plus size={12} className="text-orange-600" />
                                        <span>Pilih Gambar</span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                </div>

                                <div className="p-4 space-y-4">
                                    {/* Preview Gambar Baru yang Dipilih */}
                                    {data.images.length > 0 ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10.5px] font-bold text-orange-600 uppercase tracking-wide flex items-center gap-1">
                                                    <Sparkles size={12} /> Pratinjau Gambar ({data.images.length})
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-3 gap-2">
                                                {data.images.map((file, idx) => (
                                                    <div key={`new-${idx}`} className="relative aspect-square rounded-md overflow-hidden border border-orange-200 bg-slate-50 group">
                                                        <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeNewImage(idx)}
                                                            className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-rose-700 cursor-pointer"
                                                            title="Hapus gambar"
                                                        >
                                                            <Trash2 size={11} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center border border-dashed border-slate-200/80 rounded-md text-slate-400 text-xs bg-slate-50/40">
                                            Pilih gambar foto gerakan untuk melihat pratinjau di sini.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
