import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { X, Image, Trash2, Plus, Video, Loader2, Save } from "lucide-react";
import axios from "axios";
function ExerciseQuickModal({ isOpen, onClose, onSuccess, initialName = "" }) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setErrors({});
      setDescription("");
      setCategoryId("");
      setImages([]);
      setVideos([""]);
      if (categories.length === 0) {
        setLoadingCategories(true);
        axios.get("/admin/exercises/api/categories").then((res) => setCategories(res.data)).catch((err) => console.error("Failed to load categories:", err)).finally(() => setLoadingCategories(false));
      }
    }
  }, [isOpen, initialName]);
  if (!isOpen) return null;
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
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
    formData.append("name", name);
    if (description) formData.append("description", description);
    if (categoryId) formData.append("exercise_category_id", categoryId);
    images.forEach((img) => {
      formData.append("images[]", img);
    });
    const cleanVideos = videos.filter((v) => v.trim() !== "");
    formData.append("videos", JSON.stringify(cleanVideos));
    try {
      const res = await axios.post("/admin/exercises/quick-store", formData, {
        headers: { "Content-Type": "multipart/form-data" }
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
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[200] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-zinc-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold tracking-tight text-zinc-900", children: "Tambah Master Latihan" }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-zinc-500 font-bold mt-0.5 uppercase tracking-wider", children: "Quick Create" })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, disabled: loading, className: "p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors", children: /* @__PURE__ */ jsx(X, { size: 20 }) })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex-1 overflow-y-auto p-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "text-xs text-zinc-500 font-bold mb-1.5 block", children: [
            "Nama Latihan ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: name,
              onChange: (e) => setName(e.target.value),
              className: `w-full bg-zinc-50 border rounded-lg text-sm py-2 px-3 outline-none transition-all ${errors.name ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-zinc-200 focus:ring-1 focus:ring-zinc-900"}`,
              required: true
            }
          ),
          errors.name && /* @__PURE__ */ jsx("span", { className: "text-[10px] text-red-500 font-bold mt-1 block", children: errors.name[0] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs text-zinc-500 font-bold mb-1.5 block", children: "Kategori" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: categoryId,
              onChange: (e) => setCategoryId(e.target.value),
              className: "w-full bg-zinc-50 border border-zinc-200 rounded-lg text-sm py-2 px-3 outline-none focus:ring-1 focus:ring-zinc-900",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Tanpa Kategori" }),
                categories.map((cat) => /* @__PURE__ */ jsx("option", { value: cat.id, children: cat.name }, cat.id))
              ]
            }
          ),
          loadingCategories && /* @__PURE__ */ jsx("span", { className: "text-[10px] text-zinc-400 block mt-1", children: "Memuat kategori..." })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs text-zinc-500 font-bold mb-1.5 block", children: "Deskripsi / Instruksi" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: description,
              onChange: (e) => setDescription(e.target.value),
              className: "w-full bg-zinc-50 border border-zinc-200 rounded-lg text-sm py-2 px-3 outline-none focus:ring-1 focus:ring-zinc-900 min-h-[80px]",
              placeholder: "Cara melakukan gerakan ini..."
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-t border-zinc-100 pt-6 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "text-xs text-zinc-500 font-bold mb-2 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Image, { size: 14 }),
            " Foto Referensi"
          ] }),
          images.length > 0 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3 mb-3", children: images.map((file, i) => /* @__PURE__ */ jsxs("div", { className: "relative aspect-square bg-zinc-100 rounded-lg overflow-hidden group border border-zinc-200", children: [
            /* @__PURE__ */ jsx("img", { src: URL.createObjectURL(file), className: "w-full h-full object-cover" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => removeNewImage(i),
                className: "absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white",
                children: /* @__PURE__ */ jsx(Trash2, { size: 20 })
              }
            )
          ] }, i)) }),
          /* @__PURE__ */ jsxs("label", { className: "flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 transition-colors rounded-xl cursor-pointer", children: [
            /* @__PURE__ */ jsx(Plus, { size: 20, className: "text-zinc-400 mb-1" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-zinc-500", children: "Unggah Gambar" }),
            /* @__PURE__ */ jsx("input", { type: "file", multiple: true, accept: "image/*", className: "hidden", onChange: handleImageUpload })
          ] }),
          errors["images.0"] && /* @__PURE__ */ jsx("span", { className: "text-[10px] text-red-500 font-bold mt-1 block", children: errors["images.0"][0] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "text-xs text-zinc-500 font-bold mb-2 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Video, { size: 14 }),
            " Link Video Youtube / Drive"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            videos.map((vid, idx) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "url",
                  placeholder: "https://...",
                  value: vid,
                  onChange: (e) => updateVideoRow(idx, e.target.value),
                  className: "w-full bg-zinc-50 border border-zinc-200 rounded-lg text-sm py-2 px-3 outline-none focus:ring-1 focus:ring-zinc-900"
                }
              ),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => removeVideoRow(idx), className: "p-2 text-zinc-400 hover:text-red-500 transition-colors shrink-0", children: /* @__PURE__ */ jsx(Trash2, { size: 16 }) })
            ] }, idx)),
            /* @__PURE__ */ jsxs("button", { type: "button", onClick: addVideoRow, className: "text-[11px] font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 mt-1", children: [
              /* @__PURE__ */ jsx(Plus, { size: 12 }),
              " Tambah Link Video Lainnya"
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-5 border-t border-zinc-100 bg-zinc-50/50 flex justify-end gap-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          disabled: loading,
          className: "px-4 py-2 text-sm font-bold text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors",
          children: "Batal"
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleSubmit,
          disabled: loading,
          className: "px-6 py-2 text-sm font-bold bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg shadow-md transition-colors flex items-center gap-2 disabled:opacity-50",
          children: [
            loading ? /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ jsx(Save, { size: 16 }),
            "Simpan ke Master"
          ]
        }
      )
    ] })
  ] }) });
}
export {
  ExerciseQuickModal as default
};
