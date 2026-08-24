import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image as ImageIcon, Video, Loader2, Save } from 'lucide-react';
import axios from 'axios';

export default function ExerciseQuickModal({ isOpen, onClose, onSuccess, initialName = '' }) {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState(['']);
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            setName(initialName);
            setErrors({});
            setDescription('');
            setCategoryId('');
            setImages([]);
            setVideos(['']);
            
            if (categories.length === 0) {
                setLoadingCategories(true);
                axios.get('/admin/exercises/api/categories')
                    .then(res => setCategories(res.data))
                    .catch(err => console.error("Failed to load categories:", err))
                    .finally(() => setLoadingCategories(false));
            }
        }
    }, [isOpen, initialName]);

    if (!isOpen) return null;

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
    };

    const removeNewImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const addVideoRow = () => setVideos([...videos, ""]);
    
    const removeVideoRow = (index) => {
        const newVids = [...videos];
        newVids.splice(index, 1);
        if (newVids.length === 0) newVids.push("");
        setVideos(newVids);
    };
    
    const updateVideoRow = (index, val) => {
        const newVids = [...videos];
        newVids[index] = val;
        setVideos(newVids);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const formData = new FormData();
        formData.append('name', name);
        if (description) formData.append('description', description);
        if (categoryId) formData.append('exercise_category_id', categoryId);
        
        images.forEach(img => {
            formData.append('images[]', img);
        });

        const cleanVideos = videos.filter(v => v.trim() !== "");
        formData.append('videos', JSON.stringify(cleanVideos));

        try {
            const res = await axios.post('/admin/exercises/quick-store', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (onSuccess) {
                onSuccess(res.data);
            }
            onClose();
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                alert(err.response?.data?.message || "Gagal menyimpan Latihan");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white border border-slate-200/90 rounded-md shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-xs font-bold tracking-tight text-slate-900">Tambah Master Latihan</h3>
                    </div>
                    <button 
                        type="button"
                        onClick={onClose} 
                        disabled={loading} 
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                    >
                        <X size={14} />
                    </button>
                </div>
                
                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Basic Info */}
                    <div className="space-y-3">
                        <div>
                            <label className="text-[11px] text-slate-600 font-bold mb-1 block">
                                Nama Latihan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Contoh: Barbell Bench Press"
                                className={`w-full bg-white border rounded-md text-xs font-medium py-2 px-3 outline-none transition-all shadow-2xs ${errors.name ? "border-red-400 focus:ring-1 focus:ring-red-400" : "border-slate-200 focus:ring-1 focus:ring-orange-400 focus:border-orange-400"}`}
                                required
                            />
                            {errors.name && <span className="text-[10px] text-red-500 font-semibold mt-0.5 block">{errors.name[0]}</span>}
                        </div>

                        <div>
                            <label className="text-[11px] text-slate-600 font-bold mb-1 block">
                                Kategori
                            </label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-md text-xs font-medium py-2 px-3 outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 shadow-2xs leading-normal cursor-pointer"
                            >
                                <option value="">Tanpa Kategori</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {loadingCategories && <span className="text-[10px] text-slate-400 block mt-0.5">Memuat kategori...</span>}
                        </div>

                        <div>
                            <label className="text-[11px] text-slate-600 font-bold mb-1 block">
                                Deskripsi / Instruksi
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-md text-xs font-medium p-2.5 outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 shadow-2xs min-h-[70px] leading-relaxed placeholder:text-slate-400"
                                placeholder="Cara melakukan gerakan ini..."
                            />
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3.5 space-y-3.5">
                        {/* Images */}
                        <div>
                            <label className="text-[11px] text-slate-600 font-bold mb-1.5 flex items-center gap-1.5">
                                <ImageIcon size={12} className="text-orange-500" /> Foto Referensi
                            </label>
                            
                            {images.length > 0 && (
                                <div className="grid grid-cols-4 gap-2 mb-2">
                                    {images.map((file, i) => (
                                        <div key={i} className="relative aspect-square bg-slate-100 rounded-md overflow-hidden group border border-slate-200">
                                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Preview" />
                                            <button 
                                                type="button" 
                                                onClick={() => removeNewImage(i)}
                                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <label className="flex flex-col items-center justify-center w-full h-18 border border-dashed border-slate-200 hover:border-orange-400 hover:bg-orange-50/20 transition-colors rounded-md cursor-pointer bg-slate-50/40">
                                <Plus size={16} className="text-slate-400 mb-0.5" />
                                <span className="text-[11px] font-semibold text-slate-600">Unggah Gambar</span>
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                            {errors['images.0'] && <span className="text-[10px] text-red-500 font-semibold mt-0.5 block">{errors['images.0'][0]}</span>}
                        </div>

                        {/* Videos */}
                        <div>
                            <label className="text-[11px] text-slate-600 font-bold mb-1.5 flex items-center gap-1.5">
                                <Video size={12} className="text-orange-500" /> Link Video Youtube / Drive
                            </label>
                            <div className="space-y-1.5">
                                {videos.map((vid, idx) => (
                                    <div key={idx} className="flex gap-1.5">
                                        <input
                                            type="url"
                                            placeholder="https://..."
                                            value={vid}
                                            onChange={(e) => updateVideoRow(idx, e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-md text-xs font-medium py-1.5 px-3 outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 shadow-2xs"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => removeVideoRow(idx)} 
                                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition-colors shrink-0 cursor-pointer"
                                            title="Hapus Link"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                ))}
                                <button 
                                    type="button" 
                                    onClick={addVideoRow} 
                                    className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 mt-1 cursor-pointer"
                                >
                                    <Plus size={11} /> Tambah Link Video Lainnya
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Modal Footer */}
                <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2">
                    <button 
                        type="button" 
                        onClick={onClose}
                        disabled={loading}
                        className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                    >
                        Batal
                    </button>
                    <button 
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 rounded-md shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                        <span>Simpan ke Master</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
