import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { usePage, useForm, Head, Link, router } from "@inertiajs/react";
import { Dumbbell, Plus, Copy, Pencil, Trash2, ChevronRight, Users, Activity, Trophy, X, Save, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import "axios";
function Index({ sports }) {
  const { auth } = usePage().props;
  const isSuperadmin = auth?.user?.role === "superadmin";
  const { data, setData, post, processing, reset, errors } = useForm({
    name: "",
    description: ""
  });
  const duplicateForm = useForm({
    name: ""
  });
  const editForm = useForm({
    name: "",
    description: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredSports = sports.filter(
    (sport) => sport.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const submit = (e) => {
    e.preventDefault();
    post(route("admin.sports.store"), {
      onSuccess: () => {
        reset();
        setIsModalOpen(false);
      }
    });
  };
  const handleDuplicateSubmit = (e) => {
    e.preventDefault();
    duplicateForm.post(route("admin.sports.duplicate", selectedSport.id), {
      onSuccess: () => {
        duplicateForm.reset();
        setIsDuplicateModalOpen(false);
        setSelectedSport(null);
      }
    });
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    editForm.put(route("admin.sports.update", selectedSport.id), {
      onSuccess: () => {
        editForm.reset();
        setIsEditModalOpen(false);
        setSelectedSport(null);
      }
    });
  };
  const openDuplicateModal = (e, sport) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSport(sport);
    duplicateForm.setData("name", sport.name + " (Copy)");
    duplicateForm.clearErrors();
    setIsDuplicateModalOpen(true);
  };
  const openEditModal = (e, sport) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSport(sport);
    editForm.setData({
      name: sport.name,
      description: sport.description || ""
    });
    editForm.clearErrors();
    setIsEditModalOpen(true);
  };
  const openDeleteModal = (e, sport) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSport(sport);
    setIsDeleteModalOpen(true);
  };
  const confirmDelete = () => {
    router.delete(route("admin.sports.destroy", selectedSport.id), {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setSelectedSport(null);
      }
    });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Sports Management", children: [
    /* @__PURE__ */ jsx(Head, { title: "Sports Management" }),
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: "Sports Categories",
        subtitle: "Kelola data cabang olahraga dan spesifikasi parameter tes fisik.",
        badge: "Management",
        icon: Dumbbell,
        searchPlaceholder: "Search sports...",
        searchValue: searchTerm,
        onSearchChange: setSearchTerm,
        actions: isSuperadmin && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setIsModalOpen(true),
            className: "flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-lg text-sm font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95 w-full sm:w-auto justify-center",
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 md:w-5 md:h-5" }),
              " Add Sport"
            ]
          }
        )
      }
    ),
    filteredSports.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300", children: filteredSports.map((sport) => /* @__PURE__ */ jsxs(
      Link,
      {
        href: route("admin.sports.show", sport.id),
        className: "group bg-white p-6 rounded-lg border border-slate-200 hover:border-orange-500 hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col h-full",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-lg border border-slate-100 overflow-hidden bg-orange-50 text-orange-500 flex justify-center items-center group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shadow-sm", children: /* @__PURE__ */ jsx(Dumbbell, { className: "w-6 h-6" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              isSuperadmin && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: (e) => openDuplicateModal(e, sport),
                    className: "p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all z-10 relative",
                    title: "Duplicate Sport",
                    children: /* @__PURE__ */ jsx(Copy, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: (e) => openEditModal(e, sport),
                    className: "p-2 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all z-10 relative",
                    title: "Edit Sport",
                    children: /* @__PURE__ */ jsx(Pencil, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: (e) => openDeleteModal(e, sport),
                    className: "p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all z-10 relative",
                    title: "Delete Sport",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "p-2 rounded-lg bg-slate-50 group-hover:bg-orange-50 transition-colors", children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-slate-400 group-hover:text-orange-500" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-800 mb-2 group-hover:text-orange-500 transition-colors", children: sport.name }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mb-6 line-clamp-2 flex-grow leading-relaxed font-medium", children: sport.description || "No additional description provided for this sport." }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs font-semibold text-slate-500 pt-4 border-t border-slate-100 mt-auto", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100", children: [
              /* @__PURE__ */ jsx(Users, { className: "w-3.5 h-3.5 text-orange-500" }),
              /* @__PURE__ */ jsxs("span", { children: [
                sport.athletes_count,
                " Athletes"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100", children: [
              /* @__PURE__ */ jsx(Activity, { className: "w-3.5 h-3.5 text-emerald-500" }),
              /* @__PURE__ */ jsxs("span", { children: [
                sport.test_items_count,
                " Tests"
              ] })
            ] })
          ] })
        ]
      },
      sport.id
    )) }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-dashed border-slate-300 text-center shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "p-4 bg-orange-50 rounded-full mb-3", children: /* @__PURE__ */ jsx(Trophy, { className: "w-8 h-8 text-orange-300" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-slate-800 font-bold text-lg", children: "No Sports Categories Found" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-sm mt-1 font-medium", children: "Please add new data to get started." })
    ] }),
    isModalOpen && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity", onClick: () => {
        setIsModalOpen(false);
        reset();
      } }),
      /* @__PURE__ */ jsxs("div", { className: "relative bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-800", children: "Add New Sport" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 font-medium mt-0.5", children: "Register a new sports category." })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            setIsModalOpen(false);
            reset();
          }, className: "p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6 space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-400 mb-1.5", children: "Sport Name" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                className: "w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm py-2.5 placeholder-slate-400 transition-all outline-none",
                placeholder: "e.g. Basketball, Swimming...",
                autoFocus: true
              }
            ),
            errors.name && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs mt-1 font-bold", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-400 mb-1.5", children: "Description (Optional)" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: data.description,
                onChange: (e) => setData("description", e.target.value),
                className: "w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm py-2.5 min-h-[100px] placeholder-slate-400 resize-none transition-all outline-none custom-scrollbar",
                placeholder: "Brief description about this sport..."
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-6 mt-2 border-t border-slate-100", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setIsModalOpen(false);
                  reset();
                },
                className: "px-5 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-lg transition-colors",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "submit",
                disabled: processing,
                className: "px-6 py-2.5 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-70 flex items-center gap-2",
                children: [
                  processing ? /* @__PURE__ */ jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
                  processing ? "Saving..." : "Save Data"
                ]
              }
            )
          ] })
        ] })
      ] })
    ] }),
    isDuplicateModalOpen && selectedSport && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity", onClick: () => {
        setIsDuplicateModalOpen(false);
        duplicateForm.reset();
      } }),
      /* @__PURE__ */ jsxs("div", { className: "relative bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-800", children: "Duplicate Sport" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 font-medium mt-0.5", children: [
              "Create a copy of ",
              selectedSport.name,
              "."
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            setIsDuplicateModalOpen(false);
            duplicateForm.reset();
          }, className: "p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleDuplicateSubmit, className: "p-6 space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-400 mb-1.5", children: "New Sport Name" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: duplicateForm.data.name,
                onChange: (e) => duplicateForm.setData("name", e.target.value),
                className: "w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm py-2.5 placeholder-slate-400 transition-all outline-none",
                placeholder: "Enter unique name...",
                autoFocus: true
              }
            ),
            duplicateForm.errors.name && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs mt-1 font-bold", children: duplicateForm.errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-6 mt-2 border-t border-slate-100", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setIsDuplicateModalOpen(false);
                  duplicateForm.reset();
                },
                className: "px-5 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-lg transition-colors",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "submit",
                disabled: duplicateForm.processing,
                className: "px-6 py-2.5 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-70 flex items-center gap-2",
                children: [
                  duplicateForm.processing ? /* @__PURE__ */ jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsx(Copy, { className: "w-4 h-4" }),
                  duplicateForm.processing ? "Duplicating..." : "Duplicate Data"
                ]
              }
            )
          ] })
        ] })
      ] })
    ] }),
    isEditModalOpen && selectedSport && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity", onClick: () => {
        setIsEditModalOpen(false);
        editForm.reset();
      } }),
      /* @__PURE__ */ jsxs("div", { className: "relative bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-800", children: "Edit Sport" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 font-medium mt-0.5", children: "Update sport details." })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            setIsEditModalOpen(false);
            editForm.reset();
          }, className: "p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleEditSubmit, className: "p-6 space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-400 mb-1.5", children: "Sport Name" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: editForm.data.name,
                onChange: (e) => editForm.setData("name", e.target.value),
                className: "w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm py-2.5 placeholder-slate-400 transition-all outline-none",
                placeholder: "Enter sport name...",
                autoFocus: true
              }
            ),
            editForm.errors.name && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs mt-1 font-bold", children: editForm.errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-400 mb-1.5", children: "Description (Optional)" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: editForm.data.description,
                onChange: (e) => editForm.setData("description", e.target.value),
                className: "w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm py-2.5 min-h-[100px] placeholder-slate-400 resize-none transition-all outline-none custom-scrollbar",
                placeholder: "Brief description about this sport..."
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 pt-6 mt-2 border-t border-slate-100", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setIsEditModalOpen(false);
                  editForm.reset();
                },
                className: "px-5 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-lg transition-colors",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "submit",
                disabled: editForm.processing,
                className: "px-6 py-2.5 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-70 flex items-center gap-2",
                children: [
                  editForm.processing ? /* @__PURE__ */ jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
                  editForm.processing ? "Saving..." : "Save Changes"
                ]
              }
            )
          ] })
        ] })
      ] })
    ] }),
    isDeleteModalOpen && selectedSport && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[70] flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity", onClick: () => setIsDeleteModalOpen(false) }),
      /* @__PURE__ */ jsx("div", { className: "relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200", children: /* @__PURE__ */ jsxs("div", { className: "p-6 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-rose-50 shadow-sm", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "w-8 h-8", strokeWidth: 2.5 }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-800 mb-2", children: "Peringatan Keras!" }),
        /* @__PURE__ */ jsxs("p", { className: "text-slate-600 text-sm mb-4", children: [
          "Anda akan menghapus cabor ",
          /* @__PURE__ */ jsxs("span", { className: "font-bold text-rose-500", children: [
            '"',
            selectedSport.name,
            '"'
          ] }),
          "."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-rose-50 p-4 rounded-xl text-left border border-rose-100 mb-6", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-rose-700 mb-2", children: "Dampak Tindakan Ini:" }),
          /* @__PURE__ */ jsxs("ul", { className: "text-xs text-rose-600 space-y-1.5 ml-4 list-disc font-medium", children: [
            /* @__PURE__ */ jsxs("li", { children: [
              "Seluruh ",
              /* @__PURE__ */ jsx("span", { className: "font-bold", children: "DATA LATIHAN / SKOR" }),
              " terkait cabor ini akan dihapus permanen."
            ] }),
            /* @__PURE__ */ jsx("li", { children: "Seluruh parameter item latihan pada cabor ini akan hilang." }),
            selectedSport.athletes_count > 0 && /* @__PURE__ */ jsxs("li", { children: [
              "Sebanyak ",
              /* @__PURE__ */ jsxs("span", { className: "font-bold", children: [
                selectedSport.athletes_count,
                " atlet"
              ] }),
              " akan dikeluarkan dari cabor (menjadi 'Tanpa Cabor'), tapi akun mereka tidak dihapus."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setIsDeleteModalOpen(false),
              className: "flex-1 py-3 text-slate-600 font-bold text-sm bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors",
              children: "Batalkan"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: confirmDelete,
              className: "flex-1 py-3 bg-rose-500 text-white font-bold text-sm rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30 hover:shadow-rose-500/40 active:scale-95",
              children: "Ya, Hapus Permanen"
            }
          )
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Index as default
};
