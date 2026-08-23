import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";
import { ImagePlus, Camera, Maximize2, Info, Download, Edit3, Trash2, X, CalendarDays, Save, Plus } from "lucide-react";
function AthleteGallery({ athlete, galleries = [] }) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewer, setViewer] = useState({ isOpen: false, photo: null });
  const [editModal, setEditModal] = useState({ isOpen: false, photo: null });
  const { data: uploadData, setData: setUploadData, post: postUpload, processing: uploadProcessing, reset: resetUpload, errors: uploadErrors } = useForm({
    photos: []
  });
  const editForm = useForm({
    notes: ""
  });
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (isUploadModalOpen || viewer.isOpen || editModal.isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isUploadModalOpen, viewer.isOpen, editModal.isOpen]);
  const formatDateIndo = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };
  const handleDownload = (url, filename) => {
    fetch(url).then((response) => response.blob()).then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename || `biometric-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    }).catch((err) => console.error("Download error:", err));
  };
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      notes: ""
    }));
    setUploadData("photos", [...uploadData.photos, ...newPhotos]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const removePhoto = (index) => {
    const updatedPhotos = [...uploadData.photos];
    URL.revokeObjectURL(updatedPhotos[index].preview);
    updatedPhotos.splice(index, 1);
    setUploadData("photos", updatedPhotos);
  };
  const submitUpload = (e) => {
    e.preventDefault();
    postUpload(route("admin.athletes.gallery.store", athlete.id), {
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
    uploadData.photos.forEach((p) => URL.revokeObjectURL(p.preview));
    resetUpload();
  };
  const openEdit = (photo) => {
    editForm.setData("notes", photo.notes || "");
    setEditModal({ isOpen: true, photo });
  };
  const closeEdit = () => {
    setEditModal({ isOpen: false, photo: null });
    editForm.reset();
  };
  const submitEdit = (e) => {
    e.preventDefault();
    editForm.put(route("admin.athletes.gallery.update", editModal.photo.id), {
      preserveScroll: true,
      onSuccess: () => closeEdit()
    });
  };
  const deleteGallery = (id) => {
    if (confirm("Hapus foto biometrik ini secara permanen?")) {
      router.delete(route("admin.athletes.gallery.destroy", id), {
        preserveScroll: true,
        onSuccess: () => {
          setViewer({ isOpen: false, photo: null });
        }
      });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 bg-gradient-to-r from-white via-orange-50/40 to-white border-b border-slate-200/80 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 text-xs sm:text-sm tracking-tight", children: "Galeri Biometrik" }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-medium mt-0.5", children: "Dokumentasi fisik dan catatan atlet." })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setIsUploadModalOpen(true),
          className: "bg-orange-600 hover:bg-orange-700 text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:shadow-xs transition-all touch-manipulation whitespace-nowrap",
          children: [
            /* @__PURE__ */ jsx(ImagePlus, { className: "w-3.5 h-3.5" }),
            " ",
            /* @__PURE__ */ jsx("span", { children: "Tambah Foto" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-4 bg-white", children: galleries.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-8 flex flex-col items-center justify-center text-center border border-dashed border-slate-200 rounded-md bg-gradient-to-br from-white via-white to-orange-50/30", children: [
      /* @__PURE__ */ jsx(Camera, { className: "w-8 h-8 text-slate-300 mb-2" }),
      /* @__PURE__ */ jsx("h4", { className: "text-slate-700 font-bold text-xs sm:text-sm", children: "Belum Ada Dokumentasi" }),
      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 mt-0.5 max-w-xs", children: "Tambahkan foto postur, cedera, atau progres biometrik atlet di sini." })
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5", children: galleries.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col bg-gradient-to-br from-white via-white to-orange-50/40 border border-slate-200/80 rounded-md overflow-hidden shadow-2xs hover:border-slate-300 transition-all", children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "aspect-square bg-slate-100 relative overflow-hidden cursor-pointer group",
          onClick: () => setViewer({ isOpen: true, photo: item }),
          children: [
            /* @__PURE__ */ jsx("img", { src: item.image_path, alt: "Biometric", className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105", loading: "lazy" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[8.5px] font-bold px-1.5 py-0.5 rounded shadow-xs", children: new Date(item.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ jsx("div", { className: "p-1.5 bg-white/90 rounded-full text-slate-800 shadow-md scale-75 group-hover:scale-100 transition-transform", children: /* @__PURE__ */ jsx(Maximize2, { className: "w-4 h-4" }) }) })
          ]
        }
      ),
      item.notes && /* @__PURE__ */ jsx("div", { className: "p-2 bg-white/70 flex-1 border-t border-slate-100 cursor-pointer", onClick: () => setViewer({ isOpen: true, photo: item }), children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-1 text-slate-600", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-3 h-3 mt-0.5 shrink-0 text-orange-500" }),
        /* @__PURE__ */ jsxs("p", { className: "text-[10px] italic text-slate-700 leading-relaxed line-clamp-2", children: [
          '"',
          item.notes,
          '"'
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-1.5 bg-white/90 flex justify-between items-center border-t border-slate-100", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setViewer({ isOpen: true, photo: item }), title: "Lihat Penuh", className: "p-1.5 text-slate-400 hover:bg-slate-100 hover:text-orange-500 rounded transition-colors touch-manipulation", children: /* @__PURE__ */ jsx(Maximize2, { className: "w-3.5 h-3.5" }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => handleDownload(item.image_path, `biometric-${item.id}.jpg`), title: "Download", className: "p-1.5 text-slate-400 hover:bg-slate-100 hover:text-orange-500 rounded transition-colors touch-manipulation", children: /* @__PURE__ */ jsx(Download, { className: "w-3.5 h-3.5" }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => openEdit(item), title: "Edit Catatan", className: "p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-500 rounded transition-colors touch-manipulation", children: /* @__PURE__ */ jsx(Edit3, { className: "w-3.5 h-3.5" }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => deleteGallery(item.id), title: "Hapus Foto", className: "p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded transition-colors touch-manipulation", children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }) })
      ] })
    ] }, item.id)) }) }),
    viewer.isOpen && viewer.photo && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-6", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-900/95 backdrop-blur-sm animate-in fade-in duration-200", onClick: () => setViewer({ isOpen: false, photo: null }) }),
      /* @__PURE__ */ jsx("button", { onClick: () => setViewer({ isOpen: false, photo: null }), className: "absolute top-3 right-3 sm:top-6 sm:right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-20 touch-manipulation", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5 sm:w-6 sm:h-6" }) }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 w-full max-w-4xl max-h-[95vh] flex flex-col bg-black/50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-200", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-hidden flex items-center justify-center bg-black/90 relative", children: /* @__PURE__ */ jsx("img", { src: viewer.photo.image_path, alt: "View", className: "max-w-full max-h-[60vh] sm:max-h-[70vh] object-contain" }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-6 bg-white shrink-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsx(CalendarDays, { className: "w-4 h-4 text-orange-500" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs sm:text-sm font-bold text-slate-800", children: formatDateIndo(viewer.photo.created_at) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-orange-50/50 p-3 sm:p-4 rounded-xl border border-orange-100 max-h-[15vh] overflow-y-auto custom-scrollbar", children: /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-slate-700 italic leading-relaxed", children: viewer.photo.notes ? `"${viewer.photo.notes}"` : /* @__PURE__ */ jsx("span", { className: "text-slate-400 not-italic", children: "Tidak ada catatan untuk foto ini." }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 flex gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsxs("button", { onClick: () => handleDownload(viewer.photo.image_path, `biometric-${viewer.photo.id}.jpg`), className: "flex-1 py-2.5 sm:py-3 bg-orange-500 text-white font-bold text-xs sm:text-sm rounded-lg sm:rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 touch-manipulation", children: [
              /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Download Foto" })
            ] }),
            /* @__PURE__ */ jsxs("button", { onClick: () => {
              setViewer({ isOpen: false, photo: null });
              openEdit(viewer.photo);
            }, className: "flex-1 py-2.5 sm:py-3 bg-amber-50 text-amber-600 border border-amber-200 font-bold text-xs sm:text-sm rounded-lg sm:rounded-xl flex items-center justify-center gap-2 hover:bg-amber-100 transition-colors touch-manipulation", children: [
              /* @__PURE__ */ jsx(Edit3, { className: "w-4 h-4" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Edit Catatan" })
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: () => deleteGallery(viewer.photo.id), className: "px-4 py-2.5 sm:py-3 bg-rose-50 text-rose-500 border border-rose-200 font-bold text-xs sm:text-sm rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-rose-100 transition-colors touch-manipulation", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
          ] })
        ] })
      ] })
    ] }),
    editModal.isOpen && editModal.photo && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[120] flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200", onClick: closeEdit }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50", children: [
          /* @__PURE__ */ jsxs("h3", { className: "font-bold text-base md:text-lg text-slate-800 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Edit3, { className: "w-4 h-4 md:w-5 md:h-5 text-orange-500" }),
            " Edit Catatan Foto"
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: closeEdit, className: "p-1.5 text-slate-400 hover:bg-slate-200 rounded-full touch-manipulation", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submitEdit, children: [
          /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
            /* @__PURE__ */ jsx("div", { className: "w-full h-32 md:h-40 rounded-xl overflow-hidden mb-4 border border-slate-200 bg-slate-100 flex items-center justify-center", children: /* @__PURE__ */ jsx("img", { src: editModal.photo.image_path, alt: "thumbnail", className: "h-full object-contain" }) }),
            /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 block", children: "Catatan Analisis" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                rows: "4",
                value: editForm.data.notes,
                onChange: (e) => editForm.setData("notes", e.target.value),
                className: "w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs md:text-sm focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all resize-none",
                placeholder: "Tambahkan atau ubah catatan..."
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5", children: [
            /* @__PURE__ */ jsx("button", { type: "button", onClick: closeEdit, className: "px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors touch-manipulation", children: "Batal" }),
            /* @__PURE__ */ jsxs("button", { type: "submit", disabled: editForm.processing, className: "px-5 md:px-6 py-2 md:py-2.5 bg-orange-500 text-white font-bold text-xs md:text-sm rounded-lg flex items-center gap-2 hover:bg-orange-600 shadow-md shadow-orange-500/20 disabled:opacity-50 transition-all touch-manipulation", children: [
              editForm.processing ? /* @__PURE__ */ jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
              "Simpan"
            ] })
          ] })
        ] })
      ] })
    ] }),
    isUploadModalOpen && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200", onClick: closeUploadModal }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 shrink-0 rounded-t-2xl", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h3", { className: "font-bold text-base md:text-lg text-slate-800 flex items-center gap-2 md:gap-2.5", children: [
              /* @__PURE__ */ jsx(ImagePlus, { className: "w-4 h-4 md:w-5 md:h-5 text-orange-500" }),
              " Upload Biometrik"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[9px] md:text-xs text-slate-500 font-medium mt-0.5 md:mt-1", children: "Pilih beberapa foto sekaligus dan tambahkan catatan." })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: closeUploadModal, className: "p-1.5 md:p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-all touch-manipulation", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar", children: [
          uploadData.photos.length === 0 && /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => fileInputRef.current?.click(),
              className: "w-full h-40 md:h-48 border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50 hover:bg-orange-50/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors group",
              children: [
                /* @__PURE__ */ jsx("div", { className: "p-3 md:p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform mb-3", children: /* @__PURE__ */ jsx(ImagePlus, { className: "w-6 h-6 md:w-8 md:h-8 text-slate-400 group-hover:text-orange-500" }) }),
                /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm font-bold text-slate-600 group-hover:text-orange-500", children: "Klik untuk Memilih Foto" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] md:text-xs text-slate-400 mt-1", children: "Bisa memilih lebih dari 1 file (JPG, PNG)" })
              ]
            }
          ),
          uploadData.photos.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            uploadData.photos.map((photo, index) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 sm:gap-4 bg-slate-50 border border-slate-200 p-3 md:p-4 rounded-xl relative group", children: [
              /* @__PURE__ */ jsx("div", { className: "w-full sm:w-28 md:w-32 h-40 sm:h-28 md:h-32 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0", children: /* @__PURE__ */ jsx("img", { src: photo.preview, alt: "preview", className: "w-full h-full object-cover" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-400 mb-1.5 mt-2 sm:mt-0", children: "Catatan (Opsional)" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    rows: "3",
                    value: photo.notes,
                    onChange: (e) => {
                      const updated = [...uploadData.photos];
                      updated[index].notes = e.target.value;
                      setUploadData("photos", updated);
                    },
                    placeholder: "Cth: Evaluasi postur minggu ke-4...",
                    className: "w-full flex-1 rounded-lg border-slate-200 text-xs md:text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none outline-none p-2.5 md:p-3 shadow-sm"
                  }
                ),
                uploadErrors[`photos.${index}.file`] && /* @__PURE__ */ jsx("p", { className: "text-[10px] md:text-xs text-rose-500 font-bold mt-1", children: uploadErrors[`photos.${index}.file`] })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => removePhoto(index),
                  className: "absolute top-2 right-2 sm:top-auto sm:right-auto sm:relative sm:self-center p-1.5 md:p-2 bg-white sm:bg-transparent border border-slate-200 sm:border-transparent text-rose-400 hover:text-rose-600 sm:hover:bg-rose-100 rounded-full sm:rounded-lg shadow-sm sm:shadow-none transition-colors touch-manipulation",
                  children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 md:w-5 md:h-5" })
                }
              )
            ] }, index)),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => fileInputRef.current?.click(),
                className: "w-full py-3 md:py-3.5 border-2 border-dashed border-slate-300 text-slate-500 hover:text-orange-500 hover:border-orange-500 hover:bg-orange-50 font-bold text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 transition-colors touch-manipulation",
                children: [
                  /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                  " Tambah Foto Lainnya"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              ref: fileInputRef,
              onChange: handleFileSelect,
              accept: "image/jpeg, image/png, image/webp",
              multiple: true,
              className: "hidden"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 md:p-5 border-t border-slate-100 bg-white rounded-b-2xl shrink-0 flex justify-end gap-2 md:gap-3", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: closeUploadModal, className: "px-4 md:px-5 py-2 md:py-2.5 text-slate-500 font-bold text-xs md:text-sm hover:bg-slate-100 rounded-lg transition-colors touch-manipulation", children: "Batal" }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: submitUpload,
              disabled: uploadProcessing || uploadData.photos.length === 0,
              className: "px-5 md:px-6 py-2 md:py-2.5 bg-orange-500 text-white font-bold text-xs md:text-sm rounded-lg shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation",
              children: [
                uploadProcessing ? /* @__PURE__ */ jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
                "Upload ",
                uploadData.photos.length > 0 ? `${uploadData.photos.length} Foto` : ""
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  AthleteGallery as default
};
