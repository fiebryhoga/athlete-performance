import React, { useRef } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Plus,
    Trash2,
    Save,
    Image as ImageIcon,
    Video,
    CheckCircle,
} from "lucide-react";

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

    return (
        <AppLayout title="Buat Latihan">
            <Head title="Buat Latihan Baru" />

            <div className="pb-12 space-y-8">
                {/* Back Link */}
                <div className="flex items-center justify-between">
                    <Link
                        href={route("admin.exercises.index")}
                        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft size={16} /> Kembali ke Master Latihan
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* KOLOM KIRI: Form Edit */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm sticky top-6">
                            <label className="block text-[10px] font-bold text-slate-500 mb-4">
                                Informasi Latihan
                            </label>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="text-[10px] text-slate-400 font-bold mb-1 block">
                                        Nama
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        className={`w-full bg-slate-50 border rounded-lg text-sm py-2 px-3 outline-none ${errors.name ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-200 focus:ring-1 focus:ring-slate-900"}`}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-[10px] text-slate-400 font-bold mb-1 block">
                                        Kategori (Opsional)
                                    </label>
                                    <select
                                        value={data.exercise_category_id}
                                        onChange={(e) => setData("exercise_category_id", e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-slate-900 outline-none"
                                    >
                                        <option value="">Tanpa Kategori</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] text-slate-400 font-bold mb-1 block">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-slate-900 outline-none resize-y min-h-[100px]"
                                        placeholder="Instruksi pelaksanaan latihan..."
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mb-3">
                                        <Video size={12} /> Tautan Video (URL)
                                    </label>
                                    <div className="space-y-2">
                                        {data.videos.map((v, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <input
                                                    type="url"
                                                    value={v}
                                                    onChange={(e) => updateVideoRow(i, e.target.value)}
                                                    placeholder="Tautan (YouTube, dll)..."
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs py-2 px-3 outline-none focus:ring-1 focus:ring-slate-900"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeVideoRow(i)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors bg-white border border-slate-200 rounded-lg shadow-sm"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addVideoRow}
                                            className="text-[10px] font-bold text-slate-400 hover:text-slate-900 mt-2 inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"
                                        >
                                            <Plus size={10} /> Tambah Tautan
                                        </button>
                                    </div>
                                </div>

                                <button
                                    disabled={processing}
                                    className="w-full mt-6 bg-slate-900 text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:bg-slate-800 transition-colors disabled:opacity-50"
                                >
                                    {recentlySuccessful ? (
                                        <CheckCircle size={16} className="text-emerald-400" />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    {recentlySuccessful ? "Berhasil Disimpan!" : "Simpan Latihan"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* KOLOM KANAN: Galeri & Media */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* AREA GALERI GAMBAR */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold flex items-center gap-2">
                                    <ImageIcon size={18} /> Galeri Gambar
                                </h3>

                                <label className="cursor-pointer bg-slate-100 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors border border-slate-200 shadow-sm flex items-center gap-2">
                                    <Plus size={14} /> Pilih Gambar...
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            </div>

                            {/* PREVIEW BARU */}
                            {data.images.length > 0 ? (
                                <div className="mb-8 p-5 border border-slate-200 bg-slate-50/50 rounded-xl">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                            <ImageIcon size={14} /> Pratinjau Gambar Baru
                                        </h4>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {data.images.map((file, idx) => (
                                            <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-dashed border-slate-300 group">
                                                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => removeNewImage(idx)}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm bg-slate-50/50">
                                    Pilih gambar untuk melihat pratinjau di sini.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
