import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { useForm, Head } from "@inertiajs/react";
import { Settings, MonitorSmartphone, UploadCloud, Upload, Image, Save } from "lucide-react";
import { useState, useRef } from "react";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import "axios";
function Index({ app_name, app_logo, login_background }) {
  const { data, setData, post, processing, errors, progress } = useForm({
    app_name: app_name || "",
    app_logo: null,
    login_background: null
  });
  const [preview, setPreview] = useState(app_logo);
  const [previewBg, setPreviewBg] = useState(login_background);
  const fileInputRef = useRef(null);
  const bgFileInputRef = useRef(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData("app_logo", file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleBgFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData("login_background", file);
      setPreviewBg(URL.createObjectURL(file));
    }
  };
  const submit = (e) => {
    e.preventDefault();
    post(route("admin.settings.update"), {
      preserveScroll: true,
      forceFormData: true
    });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Application Settings", children: [
    /* @__PURE__ */ jsx(Head, { title: "Settings" }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[1400px] mx-auto pb-12", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Application Settings",
          subtitle: "Ubah nama dan logo identitas aplikasi yang akan ditampilkan di seluruh sistem.",
          badge: "System Configuration",
          icon: Settings
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-5 md:px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(MonitorSmartphone, { className: "w-4 h-4 md:w-5 md:h-5 text-orange-500" }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-base md:text-lg text-slate-800", children: "Branding & Identity" })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-5 md:p-8 space-y-6 md:space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 mb-2", children: "Nama Aplikasi" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.app_name,
                onChange: (e) => setData("app_name", e.target.value),
                className: "w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium text-sm transition-all outline-none touch-manipulation",
                placeholder: "Masukkan nama aplikasi..."
              }
            ),
            errors.app_name && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-[10px] md:text-xs mt-1.5 font-bold", children: errors.app_name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 mb-3", children: "Logo Aplikasi" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center sm:items-start gap-5 md:gap-6", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  onClick: () => fileInputRef.current?.click(),
                  className: "shrink-0 w-28 h-28 md:w-32 md:h-32 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden relative cursor-pointer group hover:border-orange-500 hover:bg-orange-50/50 transition-all touch-manipulation",
                  children: preview ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx("img", { src: preview, alt: "Logo Preview", className: "w-full h-full object-contain p-3" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(UploadCloud, { className: "w-6 h-6 md:w-8 md:h-8 text-white" }) })
                  ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-slate-400 group-hover:text-orange-500", children: [
                    /* @__PURE__ */ jsx(UploadCloud, { className: "w-6 h-6 md:w-8 md:h-8 mb-1" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] md:text-[10px] font-bold", children: "Upload" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 w-full text-center sm:text-left", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => fileInputRef.current?.click(),
                    className: "inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-xs md:text-sm font-bold text-slate-600 mb-3 shadow-sm w-full sm:w-auto touch-manipulation",
                    children: [
                      /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4 text-slate-400" }),
                      " Pilih File Logo Baru"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "file",
                    ref: fileInputRef,
                    className: "hidden",
                    accept: "image/png, image/jpeg, image/svg+xml",
                    onChange: handleFileChange
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "bg-slate-50 p-3.5 md:p-4 rounded-xl border border-slate-100 text-left", children: /* @__PURE__ */ jsxs("p", { className: "text-[11px] md:text-xs text-slate-500 font-medium leading-relaxed", children: [
                  "Format didukung: ",
                  /* @__PURE__ */ jsx("strong", { className: "text-slate-700", children: "PNG, JPG, SVG" }),
                  " (Maks: 2MB). ",
                  /* @__PURE__ */ jsx("br", { className: "hidden sm:block" }),
                  "Disarankan menggunakan gambar ",
                  /* @__PURE__ */ jsx("strong", { className: "text-slate-700", children: "transparan (PNG)" }),
                  " dengan rasio ",
                  /* @__PURE__ */ jsx("strong", { className: "text-slate-700", children: "1:1 (Kotak)" }),
                  " agar tampil presisi di sidebar."
                ] }) }),
                errors.app_logo && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-[10px] md:text-xs mt-2 font-bold text-left", children: errors.app_logo }),
                progress && /* @__PURE__ */ jsx("div", { className: "w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden border border-slate-200", children: /* @__PURE__ */ jsx("div", { className: "bg-orange-500 h-full rounded-full transition-all duration-300", style: { width: `${progress.percentage}%` } }) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 mb-3", children: "Background Halaman Login" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center sm:items-start gap-5 md:gap-6", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  onClick: () => bgFileInputRef.current?.click(),
                  className: "shrink-0 w-full sm:w-64 h-36 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden relative cursor-pointer group hover:border-orange-500 hover:bg-orange-50/50 transition-all touch-manipulation",
                  children: previewBg ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx("img", { src: previewBg, alt: "Background Preview", className: "w-full h-full object-cover" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(Image, { className: "w-6 h-6 md:w-8 md:h-8 text-white" }) })
                  ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-slate-400 group-hover:text-orange-500", children: [
                    /* @__PURE__ */ jsx(Image, { className: "w-6 h-6 md:w-8 md:h-8 mb-1" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] md:text-[10px] font-bold", children: "Upload BG" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 w-full text-center sm:text-left", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => bgFileInputRef.current?.click(),
                    className: "inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-xs md:text-sm font-bold text-slate-600 mb-3 shadow-sm w-full sm:w-auto touch-manipulation",
                    children: [
                      /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4 text-slate-400" }),
                      " Pilih Background Baru"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "file",
                    ref: bgFileInputRef,
                    className: "hidden",
                    accept: "image/png, image/jpeg, image/jpg",
                    onChange: handleBgFileChange
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "bg-slate-50 p-3.5 md:p-4 rounded-xl border border-slate-100 text-left", children: /* @__PURE__ */ jsxs("p", { className: "text-[11px] md:text-xs text-slate-500 font-medium leading-relaxed", children: [
                  "Format didukung: ",
                  /* @__PURE__ */ jsx("strong", { className: "text-slate-700", children: "PNG, JPG, JPEG" }),
                  " (Maks: 5MB). ",
                  /* @__PURE__ */ jsx("br", { className: "hidden sm:block" }),
                  "Disarankan menggunakan gambar ukuran resolusi tinggi (misal 1920x1080) agar tampilan memukau."
                ] }) }),
                errors.login_background && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-[10px] md:text-xs mt-2 font-bold text-left", children: errors.login_background })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pt-6 md:pt-8 border-t border-slate-100 flex justify-end", children: /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-500 text-white px-8 py-3.5 md:py-3 rounded-lg md:rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95 disabled:opacity-70 text-sm touch-manipulation",
              children: [
                processing && /* @__PURE__ */ jsx("span", { className: "w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" }),
                !processing && /* @__PURE__ */ jsx(Save, { className: "w-4 h-4 md:w-5 md:h-5" }),
                processing ? "Menyimpan Konfigurasi..." : "Simpan Konfigurasi"
              ]
            }
          ) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
