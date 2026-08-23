import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { ArrowLeft, Video, Trash2, Plus, CheckCircle, Save, Image } from "lucide-react";
import "axios";
function Create({ categories = [] }) {
  const {
    data,
    setData,
    post,
    processing,
    recentlySuccessful,
    errors
  } = useForm({
    name: "",
    description: "",
    exercise_category_id: "",
    images: [],
    videos: [""]
  });
  const submit = (e) => {
    e.preventDefault();
    const cleanVideos = data.videos.filter((v) => v.trim() !== "");
    post(route("admin.exercises.store"), {
      ...data,
      videos: JSON.stringify(cleanVideos),
      forceFormData: true
    });
  };
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setData("images", [...data.images, ...files]);
  };
  const removeNewImage = (index) => {
    const newImages = [...data.images];
    newImages.splice(index, 1);
    setData("images", newImages);
  };
  const addVideoRow = () => setData("videos", [...data.videos, ""]);
  const removeVideoRow = (index) => {
    const newVids = [...data.videos];
    newVids.splice(index, 1);
    if (newVids.length === 0) newVids.push("");
    setData("videos", newVids);
  };
  const updateVideoRow = (index, val) => {
    const newVids = [...data.videos];
    newVids[index] = val;
    setData("videos", newVids);
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Buat Latihan", children: [
    /* @__PURE__ */ jsx(Head, { title: "Buat Latihan Baru" }),
    /* @__PURE__ */ jsxs("div", { className: "pb-12 space-y-8", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs(
        Link,
        {
          href: route("admin.exercises.index"),
          className: "flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
            " Kembali ke Master Latihan"
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-1 space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-xl p-6 shadow-sm sticky top-6", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 mb-4", children: "Informasi Latihan" }),
          /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-bold mb-1 block", children: "Nama" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: data.name,
                  onChange: (e) => setData("name", e.target.value),
                  className: `w-full bg-slate-50 border rounded-lg text-sm py-2 px-3 outline-none ${errors.name ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-200 focus:ring-1 focus:ring-slate-900"}`,
                  required: true
                }
              ),
              errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-500", children: errors.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-bold mb-1 block", children: "Kategori (Opsional)" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: data.exercise_category_id,
                  onChange: (e) => setData("exercise_category_id", e.target.value),
                  className: "w-full bg-slate-50 border border-slate-200 rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-slate-900 outline-none",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Tanpa Kategori" }),
                    categories.map((cat) => /* @__PURE__ */ jsx("option", { value: cat.id, children: cat.name }, cat.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] text-slate-400 font-bold mb-1 block", children: "Deskripsi" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: data.description,
                  onChange: (e) => setData("description", e.target.value),
                  className: "w-full bg-slate-50 border border-slate-200 rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-slate-900 outline-none resize-y min-h-[100px]",
                  placeholder: "Instruksi pelaksanaan latihan..."
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-slate-100", children: [
              /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-[10px] font-bold text-slate-500 mb-3", children: [
                /* @__PURE__ */ jsx(Video, { size: 12 }),
                " Tautan Video (URL)"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                data.videos.map((v, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "url",
                      value: v,
                      onChange: (e) => updateVideoRow(i, e.target.value),
                      placeholder: "Tautan (YouTube, dll)...",
                      className: "w-full bg-slate-50 border border-slate-200 rounded-lg text-xs py-2 px-3 outline-none focus:ring-1 focus:ring-slate-900"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeVideoRow(i),
                      className: "p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors bg-white border border-slate-200 rounded-lg shadow-sm",
                      children: /* @__PURE__ */ jsx(Trash2, { size: 14 })
                    }
                  )
                ] }, i)),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: addVideoRow,
                    className: "text-[10px] font-bold text-slate-400 hover:text-slate-900 mt-2 inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded",
                    children: [
                      /* @__PURE__ */ jsx(Plus, { size: 10 }),
                      " Tambah Tautan"
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                disabled: processing,
                className: "w-full mt-6 bg-slate-900 text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:bg-slate-800 transition-colors disabled:opacity-50",
                children: [
                  recentlySuccessful ? /* @__PURE__ */ jsx(CheckCircle, { size: 16, className: "text-emerald-400" }) : /* @__PURE__ */ jsx(Save, { size: 16 }),
                  recentlySuccessful ? "Berhasil Disimpan!" : "Simpan Latihan"
                ]
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-2 space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-xl p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
            /* @__PURE__ */ jsxs("h3", { className: "font-bold flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Image, { size: 18 }),
              " Galeri Gambar"
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "cursor-pointer bg-slate-100 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors border border-slate-200 shadow-sm flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Plus, { size: 14 }),
              " Pilih Gambar...",
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "file",
                  multiple: true,
                  accept: "image/*",
                  className: "hidden",
                  onChange: handleImageUpload
                }
              )
            ] })
          ] }),
          data.images.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "mb-8 p-5 border border-slate-200 bg-slate-50/50 rounded-xl", children: [
            /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center mb-4", children: /* @__PURE__ */ jsxs("h4", { className: "text-xs font-bold text-slate-900 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Image, { size: 14 }),
              " Pratinjau Gambar Baru"
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: data.images.map((file, idx) => /* @__PURE__ */ jsxs("div", { className: "relative aspect-square rounded-lg overflow-hidden border-2 border-dashed border-slate-300 group", children: [
              /* @__PURE__ */ jsx("img", { src: URL.createObjectURL(file), className: "w-full h-full object-cover" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => removeNewImage(idx),
                  className: "absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600",
                  children: /* @__PURE__ */ jsx(Trash2, { size: 14 })
                }
              )
            ] }, `new-${idx}`)) })
          ] }) : /* @__PURE__ */ jsx("div", { className: "py-12 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm bg-slate-50/50", children: "Pilih gambar untuk melihat pratinjau di sini." })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  Create as default
};
