import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { useForm, Head } from "@inertiajs/react";
import { useState } from "react";
import { Package, Plus, Calendar, Wallet, DollarSign, Edit2, Trash2 } from "lucide-react";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import { M as Modal } from "./Modal-DUGk5ZHw.js";
import Swal from "sweetalert2";
import "axios";
import "@headlessui/react";
function Index({ packages }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const { data, setData, post, put, delete: destroy, reset, errors, clearErrors } = useForm({
    name: "",
    description: "",
    session_count: 0,
    coach_fee_per_session: 0,
    price: 0
  });
  const openModal = (pkg = null) => {
    clearErrors();
    if (pkg) {
      setEditingPackage(pkg);
      setData({
        name: pkg.name,
        description: pkg.description || "",
        session_count: pkg.session_count,
        coach_fee_per_session: pkg.coach_fee_per_session,
        price: pkg.price || 0
      });
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
          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Paket berhasil diperbarui.",
            timer: 1500,
            showConfirmButton: false
          });
        }
      });
    } else {
      post(route("admin.packages.store"), {
        onSuccess: () => {
          closeModal();
          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Paket berhasil ditambahkan.",
            timer: 1500,
            showConfirmButton: false
          });
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
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl px-6 py-2.5 font-bold",
        cancelButton: "rounded-xl px-6 py-2.5 font-bold"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(route("admin.packages.destroy", pkg.id), {
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: "Terhapus!",
              text: "Paket berhasil dihapus.",
              timer: 1500,
              showConfirmButton: false
            });
          }
        });
      }
    });
  };
  const filteredPackages = packages.filter(
    (pkg) => pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Manajemen Paket", children: [
    /* @__PURE__ */ jsx(Head, { title: "Manajemen Paket" }),
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: "Manajemen Paket Latihan",
        subtitle: "Kelola paket latihan, harga, dan tarif per sesi untuk pelatih.",
        badge: "Master Data",
        icon: Package,
        searchPlaceholder: "Cari paket...",
        searchValue: searchTerm,
        onSearchChange: setSearchTerm,
        actions: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => openModal(),
            className: "flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-500/90 text-white rounded-xl text-xs md:text-sm font-bold transition-all shadow-sm shadow-orange-500/20 hover:shadow-md hover:shadow-orange-500/30 hover:-translate-y-0.5",
            children: [
              /* @__PURE__ */ jsx(Plus, { size: 18, strokeWidth: 2.5 }),
              "Tambah Paket"
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
      filteredPackages.map((pkg) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 group flex flex-col", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-5 flex-1 border-b border-slate-100 flex flex-col", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg text-slate-900 group-hover:text-orange-500 transition-colors", children: pkg.name }),
              pkg.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-1 line-clamp-2", children: pkg.description })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-colors", children: /* @__PURE__ */ jsx(Package, { size: 20, className: "text-slate-400 group-hover:text-orange-500 transition-colors" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-auto grid grid-cols-2 gap-3 pt-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-xl p-3 border border-slate-100", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mb-1 text-slate-500", children: [
                /* @__PURE__ */ jsx(Calendar, { size: 12 }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold", children: "JUMLAH SESI" })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-lg font-bold text-slate-800", children: [
                pkg.session_count,
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-slate-500", children: "sesi" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-xl p-3 border border-slate-100", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mb-1 text-slate-500", children: [
                /* @__PURE__ */ jsx(Wallet, { size: 12 }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold", children: "FEE PELATIH" })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-800", children: formatCurrency(pkg.coach_fee_per_session) })
            ] }),
            pkg.price > 0 && /* @__PURE__ */ jsxs("div", { className: "col-span-2 bg-slate-50 rounded-xl p-3 border border-slate-100 mt-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mb-1 text-slate-500", children: [
                /* @__PURE__ */ jsx(DollarSign, { size: 12 }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold", children: "HARGA PAKET KLIEN" })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-orange-500", children: formatCurrency(pkg.price) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex bg-slate-50 border-t border-slate-100", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => openModal(pkg),
              className: "flex-1 py-3 text-xs font-bold text-slate-600 hover:text-orange-500 hover:bg-orange-500/5 flex items-center justify-center gap-2 transition-colors border-r border-slate-200",
              children: [
                /* @__PURE__ */ jsx(Edit2, { size: 14 }),
                " Edit"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleDelete(pkg),
              className: "flex-1 py-3 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 transition-colors",
              children: [
                /* @__PURE__ */ jsx(Trash2, { size: 14 }),
                " Hapus"
              ]
            }
          )
        ] })
      ] }, pkg.id)),
      filteredPackages.length === 0 && /* @__PURE__ */ jsxs("div", { className: "col-span-full py-16 flex flex-col items-center justify-center bg-white border border-slate-200 border-dashed rounded-2xl", children: [
        /* @__PURE__ */ jsx(Package, { size: 48, className: "text-slate-300 mb-4", strokeWidth: 1.5 }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900 mb-1", children: "Belum ada paket latihan" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mb-6", children: "Mulai dengan menambahkan paket baru." }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => openModal(),
            className: "flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-500/90 transition-all shadow-sm shadow-orange-500/20 hover:-translate-y-0.5",
            children: [
              /* @__PURE__ */ jsx(Plus, { size: 18, strokeWidth: 2.5 }),
              "Tambah Paket"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(Modal, { show: isModalOpen, onClose: closeModal, maxWidth: "md", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-900 mb-6", children: editingPackage ? "Edit Paket" : "Tambah Paket Baru" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5 ml-1", children: "Nama Paket" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: data.name,
              onChange: (e) => setData("name", e.target.value),
              className: "w-full px-4 py-2.5 rounded-xl border-slate-200 focus:ring-orange-500 focus:border-orange-500 text-sm",
              placeholder: "Contoh: Paket 12 Sesi",
              required: true
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5 ml-1", children: "Deskripsi (Opsional)" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: data.description,
              onChange: (e) => setData("description", e.target.value),
              className: "w-full px-4 py-2.5 rounded-xl border-slate-200 focus:ring-orange-500 focus:border-orange-500 text-sm",
              placeholder: "Tuliskan deskripsi singkat paket",
              rows: "3"
            }
          ),
          errors.description && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5 ml-1", children: "Jumlah Sesi" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value: data.session_count,
                onChange: (e) => setData("session_count", e.target.value),
                className: "w-full px-4 py-2.5 rounded-xl border-slate-200 focus:ring-orange-500 focus:border-orange-500 text-sm",
                min: "1",
                required: true
              }
            ),
            errors.session_count && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.session_count })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5 ml-1", children: "Fee Pelatih / Sesi" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value: data.coach_fee_per_session,
                onChange: (e) => setData("coach_fee_per_session", e.target.value),
                className: "w-full px-4 py-2.5 rounded-xl border-slate-200 focus:ring-orange-500 focus:border-orange-500 text-sm",
                min: "0",
                placeholder: "Rp",
                required: true
              }
            ),
            errors.coach_fee_per_session && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.coach_fee_per_session })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 mb-1.5 ml-1", children: "Harga Jual Paket (Opsional)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: data.price,
              onChange: (e) => setData("price", e.target.value),
              className: "w-full px-4 py-2.5 rounded-xl border-slate-200 focus:ring-orange-500 focus:border-orange-500 text-sm",
              min: "0",
              placeholder: "Rp"
            }
          ),
          errors.price && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.price })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: closeModal,
              className: "px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors",
              children: "Batal"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "px-5 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-500/90 rounded-xl shadow-sm shadow-orange-500/20 hover:shadow-md hover:-translate-y-0.5 transition-all",
              children: editingPackage ? "Simpan Perubahan" : "Tambah Paket"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
