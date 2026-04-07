import { useState, useRef, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { ImagePlus, X, Save, Trash2, Camera, Info, Plus, Maximize2, Download, Edit3, CalendarDays } from 'lucide-react';

export default function AthleteGallery({ athlete, galleries = [] }) {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [viewer, setViewer] = useState({ isOpen: false, photo: null });
    const [editModal, setEditModal] = useState({ isOpen: false, photo: null });
    
    // State Form Upload
    const { data: uploadData, setData: setUploadData, post: postUpload, processing: uploadProcessing, reset: resetUpload, errors: uploadErrors } = useForm({
        photos: [] 
    });

    // State Form Edit
    const editForm = useForm({
        notes: ''
    });

    const fileInputRef = useRef(null);

    // Kunci Scroll Body saat Modal Apapun Terbuka
    useEffect(() => {
        if (isUploadModalOpen || viewer.isOpen || editModal.isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isUploadModalOpen, viewer.isOpen, editModal.isOpen]);

    // ==========================================
    // FUNGSI FORMAT TANGGAL INDO
    // ==========================================
    const formatDateIndo = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    // ==========================================
    // FUNGSI DOWNLOAD FOTO
    // ==========================================
    const handleDownload = (url, filename) => {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = filename || `biometric-${Date.now()}.jpg`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(blobUrl);
            })
            .catch(err => console.error('Download error:', err));
    };

    // ==========================================
    // FUNGSI HANDLER UPLOAD
    // ==========================================
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newPhotos = files.map(file => ({
            file: file, preview: URL.createObjectURL(file), notes: ''
        }));

        setUploadData('photos', [...uploadData.photos, ...newPhotos]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removePhoto = (index) => {
        const updatedPhotos = [...uploadData.photos];
        URL.revokeObjectURL(updatedPhotos[index].preview); 
        updatedPhotos.splice(index, 1);
        setUploadData('photos', updatedPhotos);
    };

    const submitUpload = (e) => {
        e.preventDefault();
        postUpload(route('admin.athletes.gallery.store', athlete.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsUploadModalOpen(false);
                resetUpload();
            }
        });
    };

    const closeUploadModal = () => {
        setIsUploadModalOpen(false);
        uploadData.photos.forEach(p => URL.revokeObjectURL(p.preview));
        resetUpload();
    };

    // ==========================================
    // FUNGSI HANDLER EDIT & HAPUS
    // ==========================================
    const openEdit = (photo) => {
        editForm.setData('notes', photo.notes || '');
        setEditModal({ isOpen: true, photo });
    };

    const closeEdit = () => {
        setEditModal({ isOpen: false, photo: null });
        editForm.reset();
    };

    const submitEdit = (e) => {
        e.preventDefault();
        editForm.put(route('admin.athletes.gallery.update', editModal.photo.id), {
            preserveScroll: true,
            onSuccess: () => closeEdit()
        });
    };

    const deleteGallery = (id) => {
        if (confirm("Hapus foto biometrik ini secara permanen?")) {
            router.delete(route('admin.athletes.gallery.destroy', id), { 
                preserveScroll: true,
                onSuccess: () => {
                    setViewer({ isOpen: false, photo: null });
                }
            });
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6 md:mt-8 w-full max-w-full">
            
            {/* HEADER GALERI */}
            <div className="px-4 md:px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 md:p-2 bg-orange-100 text-[#ff4d00] rounded-xl shadow-sm">
                        <Camera className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm md:text-lg tracking-tight">Galeri Biometrik</h3>
                        <p className="text-[9px] md:text-xs text-slate-500 font-medium mt-0.5">Dokumentasi fisik dan catatan atlet.</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsUploadModalOpen(true)} 
                    className="bg-[#ff4d00] text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1.5 md:gap-2 shadow-lg shadow-[#ff4d00]/20 hover:bg-[#e64500] hover:scale-105 transition-all touch-manipulation whitespace-nowrap"
                >
                    <ImagePlus className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span className="hidden sm:inline">Tambah Foto</span>
                </button>
            </div>

            {/* GRID GALERI */}
            <div className="p-4 md:p-6 bg-slate-50/30">
                {galleries.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-xl bg-white">
                        <Camera className="w-10 h-10 md:w-12 md:h-12 text-slate-300 mb-3" />
                        <h4 className="text-slate-600 font-bold text-sm md:text-base">Belum Ada Dokumentasi</h4>
                        <p className="text-[10px] md:text-xs text-slate-400 mt-1 max-w-xs md:max-w-sm">Tambahkan foto postur, cedera, atau progres biometrik atlet di sini.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {galleries.map((item) => (
                            <div key={item.id} className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                
                                {/* Area Gambar */}
                                <div 
                                    className="aspect-[4/5] bg-slate-100 relative overflow-hidden cursor-pointer group" 
                                    onClick={() => setViewer({ isOpen: true, photo: item })}
                                >
                                    <img src={item.image_path} alt="Biometric" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                    
                                    {/* Overlay Tanggal Singkat */}
                                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </div>
                                    
                                    {/* Indikator Klik */}
                                    <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                        <div className="p-2 bg-white/90 rounded-full text-slate-800 shadow-lg scale-75 group-hover:scale-100 transition-transform">
                                            <Maximize2 className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Area Catatan */}
                                {item.notes && (
                                    <div className="p-3 bg-slate-50 flex-1 border-t border-slate-100 cursor-pointer" onClick={() => setViewer({ isOpen: true, photo: item })}>
                                        <div className="flex items-start gap-1.5 text-slate-600">
                                            <Info className="w-3 h-3 md:w-3.5 md:h-3.5 mt-0.5 shrink-0 text-[#ff4d00]" />
                                            <p className="text-[10px] md:text-xs italic text-slate-700 leading-relaxed line-clamp-2 md:line-clamp-3">"{item.notes}"</p>
                                        </div>
                                    </div>
                                )}

                                {/* Toolbar Aksi Bawah */}
                                <div className="p-2 bg-white flex justify-between items-center border-t border-slate-100">
                                    <button onClick={() => setViewer({ isOpen: true, photo: item })} title="Lihat Penuh" className="p-2 text-slate-400 hover:bg-slate-100 hover:text-[#ff4d00] rounded-lg transition-colors touch-manipulation"><Maximize2 className="w-4 h-4 md:w-4 md:h-4"/></button>
                                    <button onClick={() => handleDownload(item.image_path, `biometric-${item.id}.jpg`)} title="Download" className="p-2 text-slate-400 hover:bg-slate-100 hover:text-[#ff4d00] rounded-lg transition-colors touch-manipulation"><Download className="w-4 h-4 md:w-4 md:h-4"/></button>
                                    <button onClick={() => openEdit(item)} title="Edit Catatan" className="p-2 text-slate-400 hover:bg-amber-50 hover:text-amber-500 rounded-lg transition-colors touch-manipulation"><Edit3 className="w-4 h-4 md:w-4 md:h-4"/></button>
                                    <button onClick={() => deleteGallery(item.id)} title="Hapus Foto" className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-lg transition-colors touch-manipulation"><Trash2 className="w-4 h-4 md:w-4 md:h-4"/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* =========================================
                MODAL 1: VIEWER / LIGHTBOX FOTO
            ========================================= */}
            {viewer.isOpen && viewer.photo && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-6">
                    {/* Layer Gelap Pembungkus (Background) - Klik untuk Tutup */}
                    <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setViewer({ isOpen: false, photo: null })}></div>
                    
                    {/* Tombol X (Absolute di sudut) */}
                    <button onClick={() => setViewer({ isOpen: false, photo: null })} className="absolute top-3 right-3 sm:top-6 sm:right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-20 touch-manipulation">
                        <X className="w-5 h-5 sm:w-6 sm:h-6"/>
                    </button>
                    
                    {/* Konten Modal Utama */}
                    <div className="relative z-10 w-full max-w-4xl max-h-[95vh] flex flex-col bg-black/50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-200">
                        {/* Area Foto Penuh */}
                        <div className="flex-1 overflow-hidden flex items-center justify-center bg-black/90 relative">
                            <img src={viewer.photo.image_path} alt="View" className="max-w-full max-h-[60vh] sm:max-h-[70vh] object-contain" />
                        </div>
                        
                        {/* Panel Info & Aksi Bawah */}
                        <div className="p-4 sm:p-6 bg-white shrink-0">
                            <div className="flex items-center gap-2 mb-3">
                                <CalendarDays className="w-4 h-4 text-[#ff4d00]" />
                                <span className="text-xs sm:text-sm font-bold text-slate-800">
                                    {formatDateIndo(viewer.photo.created_at)}
                                </span>
                            </div>
                            
                            <div className="bg-orange-50/50 p-3 sm:p-4 rounded-xl border border-orange-100 max-h-[15vh] overflow-y-auto custom-scrollbar">
                                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                                    {viewer.photo.notes ? `"${viewer.photo.notes}"` : <span className="text-slate-400 not-italic">Tidak ada catatan untuk foto ini.</span>}
                                </p>
                            </div>
                            
                            <div className="mt-4 flex gap-2 sm:gap-3">
                                <button onClick={() => handleDownload(viewer.photo.image_path, `biometric-${viewer.photo.id}.jpg`)} className="flex-1 py-2.5 sm:py-3 bg-[#ff4d00] text-white font-bold text-xs sm:text-sm rounded-lg sm:rounded-xl flex items-center justify-center gap-2 hover:bg-[#e64500] transition-colors shadow-lg shadow-[#ff4d00]/20 touch-manipulation">
                                    <Download className="w-4 h-4"/> <span className="hidden sm:inline">Download Foto</span>
                                </button>
                                <button onClick={() => {
                                    setViewer({ isOpen: false, photo: null }); // Tutup viewer
                                    openEdit(viewer.photo); // Buka edit
                                }} className="flex-1 py-2.5 sm:py-3 bg-amber-50 text-amber-600 border border-amber-200 font-bold text-xs sm:text-sm rounded-lg sm:rounded-xl flex items-center justify-center gap-2 hover:bg-amber-100 transition-colors touch-manipulation">
                                    <Edit3 className="w-4 h-4"/> <span className="hidden sm:inline">Edit Catatan</span>
                                </button>
                                <button onClick={() => deleteGallery(viewer.photo.id)} className="px-4 py-2.5 sm:py-3 bg-rose-50 text-rose-500 border border-rose-200 font-bold text-xs sm:text-sm rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-rose-100 transition-colors touch-manipulation">
                                    <Trash2 className="w-4 h-4"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================
                MODAL 2: EDIT CATATAN FOTO
            ========================================= */}
            {editModal.isOpen && editModal.photo && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    {/* Layer Gelap Pembungkus (Background) - Klik untuk Tutup */}
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={closeEdit}></div>
                    
                    {/* Konten Modal Utama */}
                    <div className="relative z-10 bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-base md:text-lg text-slate-800 flex items-center gap-2">
                                <Edit3 className="w-4 h-4 md:w-5 md:h-5 text-[#ff4d00]" /> Edit Catatan Foto
                            </h3>
                            <button onClick={closeEdit} className="p-1.5 text-slate-400 hover:bg-slate-200 rounded-full touch-manipulation"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={submitEdit}>
                            <div className="p-5">
                                {/* Thumbnail Kecil */}
                                <div className="w-full h-32 md:h-40 rounded-xl overflow-hidden mb-4 border border-slate-200 bg-slate-100 flex items-center justify-center">
                                    <img src={editModal.photo.image_path} alt="thumbnail" className="h-full object-contain" />
                                </div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Catatan Analisis</label>
                                <textarea 
                                    rows="4" 
                                    value={editForm.data.notes}
                                    onChange={(e) => editForm.setData('notes', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs md:text-sm focus:bg-white focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] outline-none transition-all resize-none"
                                    placeholder="Tambahkan atau ubah catatan..."
                                ></textarea>
                            </div>
                            <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
                                <button type="button" onClick={closeEdit} className="px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors touch-manipulation">Batal</button>
                                <button type="submit" disabled={editForm.processing} className="px-5 md:px-6 py-2 md:py-2.5 bg-[#ff4d00] text-white font-bold text-xs md:text-sm rounded-lg flex items-center gap-2 hover:bg-[#e64500] shadow-md shadow-[#ff4d00]/20 disabled:opacity-50 transition-all touch-manipulation">
                                    {editForm.processing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-4 h-4"/>}
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =========================================
                MODAL 3: MULTI-UPLOAD GAMBAR
            ========================================= */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Layer Gelap Pembungkus (Background) - Klik untuk Tutup */}
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={closeUploadModal}></div>
                    
                    {/* Konten Modal Utama */}
                    <div className="relative z-10 bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        <div className="px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 shrink-0 rounded-t-2xl">
                            <div>
                                <h3 className="font-bold text-base md:text-lg text-slate-800 flex items-center gap-2 md:gap-2.5">
                                    <ImagePlus className="w-4 h-4 md:w-5 md:h-5 text-[#ff4d00]" /> Upload Biometrik
                                </h3>
                                <p className="text-[9px] md:text-xs text-slate-500 font-medium mt-0.5 md:mt-1">Pilih beberapa foto sekaligus dan tambahkan catatan.</p>
                            </div>
                            <button onClick={closeUploadModal} className="p-1.5 md:p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-all touch-manipulation"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                            
                            {uploadData.photos.length === 0 && (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-40 md:h-48 border-2 border-dashed border-slate-300 hover:border-[#ff4d00] bg-slate-50 hover:bg-orange-50/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors group"
                                >
                                    <div className="p-3 md:p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform mb-3">
                                        <ImagePlus className="w-6 h-6 md:w-8 md:h-8 text-slate-400 group-hover:text-[#ff4d00]" />
                                    </div>
                                    <p className="text-xs md:text-sm font-bold text-slate-600 group-hover:text-[#ff4d00]">Klik untuk Memilih Foto</p>
                                    <p className="text-[10px] md:text-xs text-slate-400 mt-1">Bisa memilih lebih dari 1 file (JPG, PNG)</p>
                                </div>
                            )}

                            {uploadData.photos.length > 0 && (
                                <div className="space-y-4">
                                    {uploadData.photos.map((photo, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row gap-3 sm:gap-4 bg-slate-50 border border-slate-200 p-3 md:p-4 rounded-xl relative group">
                                            <div className="w-full sm:w-28 md:w-32 h-40 sm:h-28 md:h-32 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0">
                                                <img src={photo.preview} alt="preview" className="w-full h-full object-cover" />
                                            </div>
                                            
                                            <div className="flex-1 flex flex-col">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 mt-2 sm:mt-0">Catatan (Opsional)</label>
                                                <textarea 
                                                    rows="3" 
                                                    value={photo.notes}
                                                    onChange={(e) => {
                                                        const updated = [...uploadData.photos];
                                                        updated[index].notes = e.target.value;
                                                        setUploadData('photos', updated);
                                                    }}
                                                    placeholder="Cth: Evaluasi postur minggu ke-4..."
                                                    className="w-full flex-1 rounded-lg border-slate-200 text-xs md:text-sm focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] resize-none outline-none p-2.5 md:p-3 shadow-sm"
                                                ></textarea>
                                                {uploadErrors[`photos.${index}.file`] && <p className="text-[10px] md:text-xs text-rose-500 font-bold mt-1">{uploadErrors[`photos.${index}.file`]}</p>}
                                            </div>

                                            <button 
                                                type="button" 
                                                onClick={() => removePhoto(index)}
                                                className="absolute top-2 right-2 sm:top-auto sm:right-auto sm:relative sm:self-center p-1.5 md:p-2 bg-white sm:bg-transparent border border-slate-200 sm:border-transparent text-rose-400 hover:text-rose-600 sm:hover:bg-rose-100 rounded-full sm:rounded-lg shadow-sm sm:shadow-none transition-colors touch-manipulation"
                                            >
                                                <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                            </button>
                                        </div>
                                    ))}

                                    <button 
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-3 md:py-3.5 border-2 border-dashed border-slate-300 text-slate-500 hover:text-[#ff4d00] hover:border-[#ff4d00] hover:bg-orange-50 font-bold text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 transition-colors touch-manipulation"
                                    >
                                        <Plus className="w-4 h-4" /> Tambah Foto Lainnya
                                    </button>
                                </div>
                            )}

                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileSelect} 
                                accept="image/jpeg, image/png, image/webp" 
                                multiple 
                                className="hidden" 
                            />
                        </div>

                        <div className="p-4 md:p-5 border-t border-slate-100 bg-white rounded-b-2xl shrink-0 flex justify-end gap-2 md:gap-3">
                            <button type="button" onClick={closeUploadModal} className="px-4 md:px-5 py-2 md:py-2.5 text-slate-500 font-bold text-xs md:text-sm hover:bg-slate-100 rounded-lg transition-colors touch-manipulation">
                                Batal
                            </button>
                            <button 
                                type="button"
                                onClick={submitUpload}
                                disabled={uploadProcessing || uploadData.photos.length === 0}
                                className="px-5 md:px-6 py-2 md:py-2.5 bg-[#ff4d00] text-white font-bold text-xs md:text-sm rounded-lg shadow-lg shadow-[#ff4d00]/20 hover:bg-[#e64500] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                            >
                                {uploadProcessing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save className="w-4 h-4" />}
                                Upload {uploadData.photos.length > 0 ? `${uploadData.photos.length} Foto` : ''}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}