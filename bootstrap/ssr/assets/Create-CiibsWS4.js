import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { ChevronLeft, Package, Search } from "lucide-react";
import "axios";
function Create({ exercises = [] }) {
  const {
    data,
    setData,
    post,
    processing,
    errors
  } = useForm({
    name: "",
    description: "",
    exercise_ids: []
  });
  const [searchPackageEx, setSearchPackageEx] = useState("");
  const submit = (e) => {
    e.preventDefault();
    post(route("admin.exercise-packages.store"));
  };
  const togglePackageExercise = (exId) => {
    const current = data.exercise_ids;
    if (current.includes(exId)) {
      setData("exercise_ids", current.filter((id) => id !== exId));
    } else {
      setData("exercise_ids", [...current, exId]);
    }
  };
  const filteredExercises = useMemo(() => {
    if (!searchPackageEx) return exercises;
    return exercises.filter((ex) => ex.name.toLowerCase().includes(searchPackageEx.toLowerCase()));
  }, [exercises, searchPackageEx]);
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Buat Paket Latihan", children: [
    /* @__PURE__ */ jsx(Head, { title: "Buat Paket Latihan" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxs(Link, { href: route("admin.exercises.index", { tab: "packages" }), className: "inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors mb-4", children: [
        /* @__PURE__ */ jsx(ChevronLeft, { size: 16 }),
        " Kembali ke Master Latihan"
      ] }),
      /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold text-gray-900 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 bg-white border border-zinc-200 rounded-xl shadow-sm", children: /* @__PURE__ */ jsx(Package, { size: 24, className: "text-zinc-900" }) }),
        "Buat Paket Latihan Baru"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-2", children: "Buat grup/paket berisi kumpulan master latihan untuk memudahkan pemilihan saat membuat sesi." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden max-w-4xl", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { className: "p-8 space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-zinc-500 mb-2", children: "Nama Paket" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: `w-full py-3 px-4 bg-zinc-50 border rounded-xl text-sm font-semibold text-zinc-900 outline-none ${errors.name ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-zinc-200 focus:ring-1 focus:ring-zinc-900"}`,
              value: data.name,
              onChange: (e) => setData("name", e.target.value),
              placeholder: "e.g., Warm Up Upper Body...",
              required: true,
              autoFocus: true
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-red-500 font-medium", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-zinc-500 mb-2", children: "Deskripsi (Opsional)" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "w-full py-3 px-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none resize-y min-h-[100px]",
              value: data.description,
              onChange: (e) => setData("description", e.target.value),
              placeholder: "Tujuan atau deskripsi paket ini..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-zinc-100", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-zinc-500", children: [
              "Pilih Master Latihan (",
              data.exercise_ids.length,
              " dipilih)"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(Search, { size: 14, className: "text-zinc-400" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Cari latihan...",
                  value: searchPackageEx,
                  onChange: (e) => setSearchPackageEx(e.target.value),
                  className: "pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-zinc-900"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "max-h-80 overflow-y-auto custom-scrollbar border border-zinc-200 rounded-xl bg-zinc-50 p-2 grid grid-cols-1 md:grid-cols-2 gap-2", children: filteredExercises.length > 0 ? filteredExercises.map((ex) => /* @__PURE__ */ jsxs("label", { className: `flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${data.exercise_ids.includes(ex.id) ? "bg-zinc-900 border-zinc-900 text-white" : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300"}`, children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                className: "w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 hidden",
                checked: data.exercise_ids.includes(ex.id),
                onChange: () => togglePackageExercise(ex.id)
              }
            ),
            /* @__PURE__ */ jsx("div", { className: `w-5 h-5 flex items-center justify-center rounded border ${data.exercise_ids.includes(ex.id) ? "bg-white border-white" : "bg-zinc-100 border-zinc-300"}`, children: data.exercise_ids.includes(ex.id) && /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 text-zinc-900", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "3", d: "M5 13l4 4L19 7" }) }) }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold flex-1", children: ex.name })
          ] }, ex.id)) : /* @__PURE__ */ jsx("div", { className: "col-span-full py-8 text-center text-zinc-400 text-sm font-medium", children: "Tidak ada latihan yang ditemukan." }) }),
          errors.exercise_ids && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-red-500 font-medium", children: errors.exercise_ids })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "px-8 py-5 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("admin.exercises.index", { tab: "packages" }),
            className: "px-6 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-200 rounded-xl transition-colors",
            children: "Batal"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "px-6 py-2.5 text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors disabled:opacity-50 shadow-sm shadow-zinc-900/20",
            children: processing ? "Menyimpan..." : "Simpan Paket"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  Create as default
};
