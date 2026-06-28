import React, { useRef } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Dumbbell, X, ChevronLeft, UploadCloud, Trash2, Video } from "lucide-react";

export default function Create({ categories = [] }) {
    const fileInputRef = useRef(null);

    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        name: "",
        description: "",
        exercise_category_id: "",
        images: [],
        existing_images: [],
        videos: [""],
        _method: "post"
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
        <AppLayout title="Buat Latihan Baru">
            <Head title="Buat Latihan Baru" />
            <div className="mb-8">
                <Link href={route('admin.exercises.index')} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors mb-4">
                    <ChevronLeft size={16} /> Kembali ke Master Latihan
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-white border border-zinc-200 rounded-xl shadow-sm"><Dumbbell size={24} className="text-zinc-900"/></div>
                    Buat Latihan Baru
                </h1>
                <p className="text-gray-600 mt-2">Tambahkan master latihan baru ke dalam database beserta gambar dan tautan videonya.</p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden max-w-4xl">
                <form onSubmit={submit}>
                    <div className="p-8 space-y-8">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                                    Nama Latihan
                                </label>
                                <input
                                    type="text"
                                    className={`w-full py-3 px-4 bg-zinc-50 border rounded-xl text-sm font-semibold text-zinc-900 outline-none ${errors.name ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-zinc-200 focus:ring-1 focus:ring-zinc-900'}`}
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    placeholder="e.g., Barbell Squat..."
                                    required
                                    autoFocus
                                />
                                {errors.name && <p className="mt-2 text-xs text-red-500 font-medium">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                                    Kategori (Opsional)
                                </label>
                                <select
                                    className="w-full py-3 px-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none"
                                    value={data.exercise_category_id}
                                    onChange={(e) => setData("exercise_category_id", e.target.value)}
                                >
                                    <option value="">Tanpa Kategori</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Media */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-zinc-100">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase tracking-wider">
                                    Gambar Pendukung
                                </label>
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*" 
                                    className="hidden" 
                                    ref={fileInputRef} 
                                    onChange={handleImageUpload} 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => fileInputRef.current.click()}
                                    className="w-full py-8 border-2 border-dashed border-zinc-300 rounded-2xl flex flex-col items-center justify-center text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                                >
                                    <UploadCloud size={28} className="mb-3" />
                                    <span className="text-sm font-bold">Pilih File Gambar</span>
                                    <span className="text-xs font-medium text-zinc-400 mt-1">Bisa pilih lebih dari satu (Max 5MB/file)</span>
                                </button>
                                
                                {data.images.length > 0 && (
                                    <div className="flex flex-wrap gap-3 mt-4">
                                        {data.images.map((file, idx) => (
                                            <div key={`new-${idx}`} className="relative w-20 h-20 rounded-xl border border-zinc-200 overflow-hidden group shadow-sm">
                                                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => removeNewImage(idx)} className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors['images.*'] && <p className="mt-2 text-xs text-red-500 font-medium">{errors['images.*']}</p>}
                            </div>

                            <div>
                                <label className="flex text-xs font-bold text-zinc-500 mb-3 uppercase tracking-wider justify-between items-center">
                                    Tautan Video
                                    <button type="button" onClick={addVideoRow} className="text-xs text-zinc-900 font-bold bg-zinc-100 px-3 py-1.5 rounded-lg hover:bg-zinc-200 transition-colors">
                                        + Tambah Link
                                    </button>
                                </label>
                                <div className="space-y-3">
                                    {data.videos.map((vid, idx) => (
                                        <div key={idx} className="flex gap-2 items-center">
                                            <div className="flex-1 relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Video size={16} className="text-zinc-400" />
                                                </div>
                                                <input
                                                    type="url"
                                                    value={vid}
                                                    onChange={(e) => updateVideoRow(idx, e.target.value)}
                                                    placeholder="https://youtube.com/watch..."
                                                    className="w-full py-2.5 pl-10 pr-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:ring-1 focus:ring-zinc-900"
                                                />
                                            </div>
                                            <button type="button" onClick={() => removeVideoRow(idx)} className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="pt-6 border-t border-zinc-100">
                            <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase tracking-wider">
                                Deskripsi / Instruksi (Opsional)
                            </label>
                            <textarea
                                className="w-full py-3 px-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none resize-y min-h-[120px]"
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                placeholder="Masukkan detail instruksi pelaksanaan latihan ini secara lengkap..."
                            />
                        </div>
                    </div>
                    
                    <div className="px-8 py-5 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                        <Link
                            href={route('admin.exercises.index')}
                            className="px-6 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-200 rounded-xl transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors disabled:opacity-50 shadow-sm shadow-zinc-900/20"
                        >
                            {processing ? "Menyimpan..." : "Simpan Latihan"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
