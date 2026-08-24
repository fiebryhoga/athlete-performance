import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { useForm, Head } from "@inertiajs/react";
import { useState, useMemo } from "react";
import { Search, X, Filter, ChevronDown, Plus, Package, Edit2, Trash2, Check } from "lucide-react";
import { P as PageHeader } from "./PageHeader-BXFyVdi4.js";
import { P as PageFooter } from "./PageFooter-BbeHbnjC.js";
import { M as Modal } from "./Modal-DUGk5ZHw.js";
import Swal from "sweetalert2";
import "axios";
import "@headlessui/react";
function CustomSelect({ label, value, options, onChange, placeholder = "Pilih..." }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => String(opt.value) === String(value));
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1 relative", children: [
    label && /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-slate-600", children: label }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setIsOpen(!isOpen),
        className: "w-full flex items-center justify-between px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-800 transition-all text-left shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500",
        children: [
          /* @__PURE__ */ jsx("span", { className: "truncate", children: selectedOption ? selectedOption.label : placeholder }),
          /* @__PURE__ */ jsx(ChevronDown, { className: `w-3.5 h-3.5 text-slate-400 shrink-0 ml-1.5 transition-transform ${isOpen ? "rotate-180 text-orange-500" : ""}` })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-40 cursor-default", onClick: () => setIsOpen(false) }),
      /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-full mt-1 w-full max-h-48 overflow-y-auto bg-white rounded-md shadow-xl border border-slate-200 p-1 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-0.5 custom-scrollbar", children: options.map((opt) => {
        const isSelected = String(opt.value) === String(value);
        return /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              onChange(opt.value);
              setIsOpen(false);
            },
            className: `w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors text-left ${isSelected ? "bg-orange-50 text-orange-700 font-bold" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"}`,
            children: [
              /* @__PURE__ */ jsx("span", { className: "truncate", children: opt.label }),
              isSelected && /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 text-orange-600 shrink-0 ml-1.5" })
            ]
          },
          opt.value
        );
      }) })
    ] })
  ] });
}
function Index({ packages }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [sortBy, setSortBy] = useState("name_asc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { data, setData, post, put, delete: destroy, reset, errors, clearErrors } = useForm({
    name: "",
    description: "",
    session_count: 0,
    coach_fee_per_session: 0,
    price: 0
  });
  const sortOptions = [
    { value: "name_asc", label: "Nama (A - Z)" },
    { value: "name_desc", label: "Nama (Z - A)" },
    { value: "sessions_desc", label: "Sesi Terbanyak" },
    { value: "price_desc", label: "Harga Tertinggi" }
  ];
  const openModal = (pkg = null) => {
    clearErrors();
    if (pkg) {
      setEditingPackage(pkg);
      setData({ name: pkg.name, description: pkg.description || "", session_count: pkg.session_count, coach_fee_per_session: pkg.coach_fee_per_session, price: pkg.price || 0 });
    } else {
      setEditingPackage(null);
      reset();
    }
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPackage(null);
    reset();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPackage) {
      put(route("admin.packages.update", editingPackage.id), {
        onSuccess: () => {
          closeModal();
          Swal.fire({ icon: "success", title: "Berhasil!", text: "Paket berhasil diperbarui.", timer: 1500, showConfirmButton: false });
        }
      });
    } else {
      post(route("admin.packages.store"), {
        onSuccess: () => {
          closeModal();
          Swal.fire({ icon: "success", title: "Berhasil!", text: "Paket berhasil ditambahkan.", timer: 1500, showConfirmButton: false });
        }
      });
    }
  };
  const handleDelete = (pkg) => {
    Swal.fire({
      title: "Hapus Paket?",
      text: `Paket "${pkg.name}" akan dihapus permanen!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "orange-500",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true,
      customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-bold", cancelButton: "rounded-xl px-6 py-2.5 font-bold" }
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(route("admin.packages.destroy", pkg.id), {
          onSuccess: () => {
            Swal.fire({ icon: "success", title: "Terhapus!", text: "Paket berhasil dihapus.", timer: 1500, showConfirmButton: false });
          }
        });
      }
    });
  };
  const filteredPackages = useMemo(() => {
    return (packages || []).filter((pkg) => {
      if (!searchTerm.trim()) return true;
      return pkg.name.toLowerCase().includes(searchTerm.toLowerCase());
    }).sort((a, b) => {
      if (sortBy === "name_asc") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "name_desc") return (b.name || "").localeCompare(a.name || "");
      if (sortBy === "sessions_desc") return (b.session_count || 0) - (a.session_count || 0);
      if (sortBy === "price_desc") return (b.price || 0) - (a.price || 0);
      return 0;
    });
  }, [packages, searchTerm, sortBy]);
  const activeFilterCount = sortBy !== "name_asc" ? 1 : 0;
  const resetFilters = () => {
    setSearchTerm("");
    setSortBy("name_asc");
  };
  const formatCurrency = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Manajemen Paket", children: [
    /* @__PURE__ */ jsx(Head, { title: "Manajemen Paket" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 pb-6", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Manajemen Paket Latihan",
          description: "Kelola paket latihan, harga, dan tarif per sesi untuk pelatih.",
          actions: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative w-44 sm:w-52", children: [
              /* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: searchTerm,
                  onChange: (e) => setSearchTerm(e.target.value),
                  placeholder: "Cari paket...",
                  className: "w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-2xs"
                }
              ),
              searchTerm && /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setSearchTerm(""), className: "absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600", children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              isFilterOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-20 cursor-default", onClick: () => setIsFilterOpen(false) }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setIsFilterOpen(!isFilterOpen),
                  className: "flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 hover:via-orange-50/40 hover:to-orange-100/60 text-orange-600 border border-slate-200/90 hover:border-orange-300 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsx(Filter, { className: "w-3.5 h-3.5 text-orange-500" }),
                    /* @__PURE__ */ jsx("span", { children: "Filter" }),
                    activeFilterCount > 0 && /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black flex items-center justify-center", children: activeFilterCount }),
                    /* @__PURE__ */ jsx(ChevronDown, { className: `w-3 h-3 text-orange-400 transition-transform ${isFilterOpen ? "rotate-180" : ""}` })
                  ]
                }
              ),
              isFilterOpen && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-full mt-1.5 w-72 sm:w-80 bg-white rounded-lg shadow-xl border border-slate-200/80 p-4 z-30 animate-in fade-in zoom-in-95 duration-100 space-y-3.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 pb-2", children: [
                  /* @__PURE__ */ jsxs("h4", { className: "text-xs font-bold text-slate-900 flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx(Filter, { className: "w-3.5 h-3.5 text-orange-500" }),
                    " Filter Paket"
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    activeFilterCount > 0 && /* @__PURE__ */ jsx("button", { type: "button", onClick: resetFilters, className: "text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer", children: "Reset" }),
                    /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsFilterOpen(false), className: "text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors cursor-pointer", children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" }) })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(CustomSelect, { label: "Urutkan", value: sortBy, options: sortOptions, onChange: setSortBy }),
                /* @__PURE__ */ jsx("div", { className: "pt-2 border-t border-slate-100 flex items-center justify-end", children: /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsFilterOpen(false), className: "px-3 py-1.5 bg-gradient-to-r from-white via-white to-orange-50/70 hover:to-orange-100/80 text-orange-600 hover:text-orange-700 border border-slate-200 hover:border-slate-300 rounded-md text-xs font-bold transition-all shadow-2xs cursor-pointer", children: "Terapkan" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => openModal(),
                className: "flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-orange-500 to-orange-600 text-white border border-orange-600 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-sm hover:from-orange-600 hover:to-orange-700 cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
                  " Tambah Paket"
                ]
              }
            )
          ] })
        }
      ),
      filteredPackages.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "col-span-full py-16 px-4 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-500 shadow-2xs", children: /* @__PURE__ */ jsx(Package, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-slate-800", children: "Belum ada paket latihan" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 font-medium max-w-sm", children: "Mulai dengan menambahkan paket baru." })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => openModal(), className: "px-3.5 py-1.5 text-xs font-bold text-orange-600 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-md transition-all shadow-2xs cursor-pointer", children: [
          /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3 inline mr-1" }),
          " Tambah Paket"
        ] })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5", children: filteredPackages.map((pkg) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "group relative bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 rounded-lg border border-slate-200/90 hover:border-orange-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 space-y-3 flex-1 flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 sm:w-11 sm:h-11 rounded-md border-2 border-white shadow-2xs bg-gradient-to-br from-orange-50 to-orange-100/70 text-orange-600 font-black text-base flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(Package, { className: "w-5 h-5" }) }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 space-y-0.5", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 text-xs sm:text-[13px] truncate group-hover:text-orange-600 transition-colors leading-tight", children: pkg.name }),
                  pkg.description && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500 font-medium truncate", children: pkg.description })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-1.5 pt-0.5 border-t border-slate-100/90", children: [
                /* @__PURE__ */ jsxs("div", { className: "p-1.5 bg-white/90 rounded-md border border-slate-200/70 shadow-2xs", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase tracking-wider block", children: "Sesi" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-0.5 mt-0.5", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[11.5px] font-black text-orange-600 leading-tight", children: pkg.session_count }),
                    /* @__PURE__ */ jsx("span", { className: "text-[8px] font-normal text-slate-400", children: "sesi" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-1.5 bg-white/90 rounded-md border border-slate-200/70 shadow-2xs", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase tracking-wider block", children: "Fee Pelatih" }),
                  /* @__PURE__ */ jsx("div", { className: "mt-0.5", children: /* @__PURE__ */ jsx("span", { className: "text-[9.5px] font-bold text-slate-700 leading-tight block truncate", children: formatCurrency(pkg.coach_fee_per_session) }) })
                ] })
              ] }),
              pkg.price > 0 && /* @__PURE__ */ jsxs("div", { className: "p-1.5 bg-white/90 rounded-md border border-slate-200/70 shadow-2xs", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase tracking-wider block", children: "Harga Paket" }),
                /* @__PURE__ */ jsx("div", { className: "mt-0.5", children: /* @__PURE__ */ jsx("span", { className: "text-[11.5px] font-black text-orange-600 leading-tight", children: formatCurrency(pkg.price) }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "px-3.5 py-2 bg-gradient-to-r from-slate-50/90 via-white to-orange-50/30 border-t border-slate-100 flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => openModal(pkg), className: "text-slate-400 hover:text-orange-500 transition-colors p-0.5", title: "Edit", children: /* @__PURE__ */ jsx(Edit2, { className: "w-3 h-3" }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(pkg), className: "text-slate-400 hover:text-rose-500 transition-colors p-0.5", title: "Hapus", children: /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" }) })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-0.5 text-[10.5px] font-bold text-orange-600", children: [
                pkg.session_count,
                " Sesi"
              ] })
            ] })
          ]
        },
        pkg.id
      )) }),
      /* @__PURE__ */ jsx(PageFooter, { className: "!mt-8 !pt-4 !pb-1" })
    ] }),
    /* @__PURE__ */ jsx(Modal, { show: isModalOpen, onClose: closeModal, maxWidth: "md", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-900 mb-6", children: editingPackage ? "Edit Paket" : "Tambah Paket Baru" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5 ml-1", children: "Nama Paket" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: data.name, onChange: (e) => setData("name", e.target.value), className: "w-full px-4 py-2.5 rounded-xl border-slate-200 focus:ring-orange-500 focus:border-orange-500 text-sm", placeholder: "Contoh: Paket 12 Sesi", required: true }),
          errors.name && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5 ml-1", children: "Deskripsi (Opsional)" }),
          /* @__PURE__ */ jsx("textarea", { value: data.description, onChange: (e) => setData("description", e.target.value), className: "w-full px-4 py-2.5 rounded-xl border-slate-200 focus:ring-orange-500 focus:border-orange-500 text-sm", placeholder: "Tuliskan deskripsi singkat paket", rows: "3" }),
          errors.description && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5 ml-1", children: "Jumlah Sesi" }),
            /* @__PURE__ */ jsx("input", { type: "number", value: data.session_count, onChange: (e) => setData("session_count", e.target.value), className: "w-full px-4 py-2.5 rounded-xl border-slate-200 focus:ring-orange-500 focus:border-orange-500 text-sm", min: "1", required: true }),
            errors.session_count && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.session_count })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5 ml-1", children: "Fee Pelatih / Sesi" }),
            /* @__PURE__ */ jsx("input", { type: "number", value: data.coach_fee_per_session, onChange: (e) => setData("coach_fee_per_session", e.target.value), className: "w-full px-4 py-2.5 rounded-xl border-slate-200 focus:ring-orange-500 focus:border-orange-500 text-sm", min: "0", placeholder: "Rp", required: true }),
            errors.coach_fee_per_session && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.coach_fee_per_session })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5 ml-1", children: "Harga Jual Paket (Opsional)" }),
          /* @__PURE__ */ jsx("input", { type: "number", value: data.price, onChange: (e) => setData("price", e.target.value), className: "w-full px-4 py-2.5 rounded-xl border-slate-200 focus:ring-orange-500 focus:border-orange-500 text-sm", min: "0", placeholder: "Rp" }),
          errors.price && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.price })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: closeModal, className: "px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors", children: "Batal" }),
          /* @__PURE__ */ jsx("button", { type: "submit", className: "px-5 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-500/90 rounded-xl shadow-sm shadow-orange-500/20 hover:shadow-md hover:-translate-y-0.5 transition-all", children: editingPackage ? "Simpan Perubahan" : "Tambah Paket" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
