import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { P as PageHeader } from "./PageHeader-BXFyVdi4.js";
import { P as PageFooter } from "./PageFooter-BbeHbnjC.js";
import { usePage, useForm, Head, router, Link } from "@inertiajs/react";
import { Search, X, Filter, ChevronDown, AlignLeft, Plus, Dumbbell, Edit, Package, Trash2, ArrowUpDown, Check } from "lucide-react";
import "axios";
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
function Index({ auth, exercises, categories = [], packages = [], currentCategoryId }) {
  const { permissions } = usePage().props;
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("name_asc");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [activeTab, setActiveTab] = useState(new URLSearchParams(window.location.search).get("tab") || "exercises");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { delete: destroy } = useForm();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const { data: catData, setData: setCatData, post: postCat, put: putCat, processing: processingCat, reset: resetCat, delete: destroyCat } = useForm({ name: "" });
  const [isBulkCategoryModalOpen, setIsBulkCategoryModalOpen] = useState(false);
  const { data: bulkCatData, setData: setBulkCatData, post: postBulkCat, processing: processingBulkCat, reset: resetBulkCat } = useForm({ ids: [], category_id: "", new_category_name: "" });
  const sortOptions = [
    { value: "name_asc", label: "Nama (A - Z)" },
    { value: "name_desc", label: "Nama (Z - A)" },
    { value: "created_desc", label: "Terbaru Ditambahkan" },
    { value: "created_asc", label: "Terlama Ditambahkan" }
  ];
  const filteredExercises = useMemo(() => {
    let result = exercises;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((ex) => ex.name.toLowerCase().includes(q));
    }
    return [...result].sort((a, b) => {
      switch (sortOption) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "created_desc":
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        case "created_asc":
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        default:
          return 0;
      }
    });
  }, [searchQuery, exercises, sortOption]);
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter((cat) => cat.name.toLowerCase().includes(q));
  }, [searchQuery, categories]);
  const filteredPackages = useMemo(() => {
    if (!searchQuery.trim()) return packages;
    const q = searchQuery.toLowerCase();
    return packages.filter((pkg) => pkg.name.toLowerCase().includes(q));
  }, [searchQuery, packages]);
  const handleDeleteExercise = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Yakin ingin menghapus latihan ini?")) {
      router.delete(route("admin.exercises.destroy", id));
    }
  };
  const toggleExerciseMainSelection = (exerciseId) => {
    setSelectedExercises((prev) => prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId]);
  };
  const handleBulkDelete = () => {
    if (confirm(`Yakin ingin menghapus ${selectedExercises.length} latihan terpilih?`)) {
      router.delete(route("admin.exercises.bulk-destroy"), { data: { ids: selectedExercises }, onSuccess: () => setSelectedExercises([]) });
    }
  };
  const handleOpenBulkCategoryModal = () => {
    setBulkCatData({ ids: selectedExercises, category_id: "", new_category_name: "" });
    setIsBulkCategoryModalOpen(true);
  };
  const submitBulkCategory = (e) => {
    e.preventDefault();
    postBulkCat(route("admin.exercises.bulk-assign-category"), { onSuccess: () => {
      setIsBulkCategoryModalOpen(false);
      resetBulkCat();
      setSelectedExercises([]);
    } });
  };
  const openCategoryModal = (cat = null) => {
    if (cat) {
      setEditingCategoryId(cat.id);
      setCatData("name", cat.name);
    } else {
      setEditingCategoryId(null);
      resetCat();
    }
    setIsCategoryModalOpen(true);
  };
  const submitCategory = (e) => {
    e.preventDefault();
    if (editingCategoryId) {
      putCat(route("admin.exercise-categories.update", editingCategoryId), { onSuccess: () => {
        setIsCategoryModalOpen(false);
        resetCat();
      } });
    } else {
      postCat(route("admin.exercise-categories.store"), { onSuccess: () => {
        setIsCategoryModalOpen(false);
        resetCat();
      } });
    }
  };
  const handleDeleteCategory = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Yakin ingin menghapus kategori ini? Latihan di dalamnya akan menjadi tanpa kategori.")) {
      destroyCat(route("admin.exercise-categories.destroy", id));
    }
  };
  const handleDeletePackage = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Yakin ingin menghapus paket latihan ini?")) {
      router.delete(route("admin.exercise-packages.destroy", id));
    }
  };
  const activeFilterCount = sortOption !== "name_asc" ? 1 : 0;
  const headerTitle = useMemo(() => {
    if (!currentCategoryId) return "Master Latihan";
    if (currentCategoryId === "uncategorized") return "Latihan Tanpa Kategori";
    const cat = categories.find((c) => c.id == currentCategoryId);
    return cat ? `Kategori: ${cat.name}` : "Master Latihan";
  }, [currentCategoryId, categories]);
  return /* @__PURE__ */ jsxs(AppLayout, { title: headerTitle, children: [
    /* @__PURE__ */ jsx(Head, { title: headerTitle }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 pb-6", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: headerTitle,
          description: "Kelola daftar bentuk latihan fisik, kategori, dan paket latihan.",
          actions: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative w-44 sm:w-52", children: [
              /* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  placeholder: activeTab === "exercises" ? "Cari latihan..." : activeTab === "packages" ? "Cari paket..." : "Cari kategori...",
                  className: "w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-2xs"
                }
              ),
              searchQuery && /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setSearchQuery(""), className: "absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600", children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" }) })
            ] }),
            activeTab === "exercises" && /* @__PURE__ */ jsxs("div", { className: "relative", children: [
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
                    " Filter Latihan"
                  ] }),
                  /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsFilterOpen(false), className: "text-slate-400 hover:text-slate-600 p-0.5", children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-slate-600", children: "Kategori" }),
                  /* @__PURE__ */ jsxs("div", { className: "max-h-32 overflow-y-auto bg-slate-50 rounded-md p-1.5 border border-slate-200 space-y-0.5 custom-scrollbar", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          router.get(route("admin.exercises.index"), {}, { preserveState: true });
                          setIsFilterOpen(false);
                        },
                        className: `w-full text-left px-2 py-1 text-xs rounded ${!currentCategoryId ? "bg-orange-50 text-orange-700 font-bold" : "text-slate-700 hover:bg-white font-medium"}`,
                        children: "Semua Latihan"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          router.get(route("admin.exercises.index", { category_id: "uncategorized" }), {}, { preserveState: true });
                          setIsFilterOpen(false);
                        },
                        className: `w-full text-left px-2 py-1 text-xs rounded ${currentCategoryId === "uncategorized" ? "bg-orange-50 text-orange-700 font-bold" : "text-slate-700 hover:bg-white font-medium"}`,
                        children: "Tanpa Kategori"
                      }
                    ),
                    categories.map((cat) => /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          router.get(route("admin.exercises.index", { category_id: cat.id }), {}, { preserveState: true });
                          setIsFilterOpen(false);
                        },
                        className: `w-full text-left px-2 py-1 text-xs rounded truncate ${currentCategoryId == cat.id ? "bg-orange-50 text-orange-700 font-bold" : "text-slate-700 hover:bg-white font-medium"}`,
                        children: cat.name
                      },
                      cat.id
                    ))
                  ] })
                ] }),
                /* @__PURE__ */ jsx(CustomSelect, { label: "Urutkan", value: sortOption, options: sortOptions, onChange: setSortOption }),
                /* @__PURE__ */ jsx("div", { className: "pt-2 border-t border-slate-100 flex items-center justify-end", children: /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsFilterOpen(false), className: "px-3 py-1.5 bg-gradient-to-r from-white via-white to-orange-50/70 hover:to-orange-100/80 text-orange-600 hover:text-orange-700 border border-slate-200 hover:border-slate-300 rounded-md text-xs font-bold transition-all shadow-2xs cursor-pointer", children: "Terapkan" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Fragment, { children: [
              activeTab === "exercises" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs(Link, { href: route("admin.exercises.bulk-create"), className: "flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 text-orange-600 border border-slate-200/90 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-xs", children: [
                  /* @__PURE__ */ jsx(AlignLeft, { className: "w-3.5 h-3.5" }),
                  " Buat Banyak"
                ] }),
                /* @__PURE__ */ jsxs(Link, { href: route("admin.exercises.create"), className: "flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-orange-500 to-orange-600 text-white border border-orange-600 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-sm hover:from-orange-600 hover:to-orange-700", children: [
                  /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
                  " Buat Latihan"
                ] })
              ] }),
              activeTab === "categories" && /* @__PURE__ */ jsxs("button", { onClick: () => openCategoryModal(), className: "flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-orange-500 to-orange-600 text-white border border-orange-600 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-sm hover:from-orange-600 hover:to-orange-700 cursor-pointer", children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
                " Buat Kategori"
              ] }),
              activeTab === "packages" && /* @__PURE__ */ jsxs(Link, { href: route("admin.exercise-packages.create"), className: "flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-orange-500 to-orange-600 text-white border border-orange-600 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-sm hover:from-orange-600 hover:to-orange-700", children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
                " Buat Paket"
              ] })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex space-x-0.5 bg-white/80 p-0.5 rounded-lg border border-slate-200 w-fit", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              setActiveTab("exercises");
              router.get(route("admin.exercises.index"), {}, { preserveState: true });
            },
            className: `px-3.5 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === "exercises" ? "bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 text-orange-600 border border-slate-200/90 shadow-2xs" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`,
            children: [
              /* @__PURE__ */ jsx(Dumbbell, { className: "w-3.5 h-3.5" }),
              " Latihan Satuan"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setActiveTab("categories"),
            className: `px-3.5 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === "categories" ? "bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 text-orange-600 border border-slate-200/90 shadow-2xs" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`,
            children: [
              /* @__PURE__ */ jsx(Edit, { className: "w-3.5 h-3.5" }),
              " Kategori Latihan"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setActiveTab("packages"),
            className: `px-3.5 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === "packages" ? "bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 text-orange-600 border border-slate-200/90 shadow-2xs" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`,
            children: [
              /* @__PURE__ */ jsx(Package, { className: "w-3.5 h-3.5" }),
              " Paket Latihan"
            ]
          }
        )
      ] }),
      activeTab === "exercises" && selectedExercises.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-slate-900 text-white rounded-lg", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold", children: [
          selectedExercises.length,
          " Latihan Terpilih"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setSelectedExercises([]), className: "flex items-center gap-1.5 px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-md text-xs font-semibold transition-colors", children: "Batal" }),
          /* @__PURE__ */ jsxs("button", { onClick: handleOpenBulkCategoryModal, className: "flex items-center gap-1.5 px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-md text-xs font-semibold transition-colors", children: [
            /* @__PURE__ */ jsx(Edit, { className: "w-3 h-3" }),
            " Pindahkan"
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: handleBulkDelete, className: "flex items-center gap-1.5 px-2.5 py-1 bg-red-500/20 text-red-100 hover:bg-red-500/40 rounded-md text-xs font-semibold transition-colors", children: [
            /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" }),
            " Hapus"
          ] })
        ] })
      ] }),
      activeTab === "exercises" && /* @__PURE__ */ jsx(Fragment, { children: filteredExercises.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "col-span-full py-16 px-4 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-500 shadow-2xs", children: /* @__PURE__ */ jsx(Dumbbell, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-slate-800", children: "Belum ada latihan yang didaftarkan" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 font-medium max-w-sm", children: "Mulai dengan menambah latihan baru." })
        ] })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5", children: filteredExercises.map((ex) => /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: () => router.get(route("admin.exercises.edit", ex.id)),
          className: `group cursor-pointer relative bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 rounded-lg border ${selectedExercises.includes(ex.id) ? "border-orange-400 ring-1 ring-orange-400" : "border-slate-200/90 hover:border-orange-200/80"} shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-2.5 right-2.5 z-10", children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                className: "w-3.5 h-3.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer",
                checked: selectedExercises.includes(ex.id),
                onClick: (e) => e.stopPropagation(),
                onChange: () => toggleExerciseMainSelection(ex.id)
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 space-y-3 flex-1 flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 sm:w-11 sm:h-11 rounded-md border-2 border-white shadow-2xs bg-gradient-to-br from-orange-50 to-orange-100/70 text-orange-600 font-black text-base flex items-center justify-center shrink-0 overflow-hidden", children: ex.images && ex.images.length > 0 ? /* @__PURE__ */ jsx("img", { src: ex.images[0], alt: ex.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx(Dumbbell, { className: "w-5 h-5" }) }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 space-y-0.5 pr-4", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 text-xs sm:text-[13px] truncate group-hover:text-orange-600 transition-colors leading-tight", children: ex.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500 font-medium truncate", children: ex.category?.name || "Tanpa Kategori" })
                ] })
              ] }),
              ex.description && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 line-clamp-2 leading-relaxed", children: ex.description }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-1.5 pt-0.5 border-t border-slate-100/90", children: [
                /* @__PURE__ */ jsxs("div", { className: "p-1.5 bg-white/90 rounded-md border border-slate-200/70 shadow-2xs", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase tracking-wider block", children: "Gambar" }),
                  /* @__PURE__ */ jsx("div", { className: "flex items-baseline gap-0.5 mt-0.5", children: /* @__PURE__ */ jsx("span", { className: "text-[11.5px] font-black text-orange-600 leading-tight", children: Array.isArray(ex.images) ? ex.images.length : 0 }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-1.5 bg-white/90 rounded-md border border-slate-200/70 shadow-2xs", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase tracking-wider block", children: "Video" }),
                  /* @__PURE__ */ jsx("div", { className: "flex items-baseline gap-0.5 mt-0.5", children: /* @__PURE__ */ jsx("span", { className: "text-[11.5px] font-black text-teal-700 leading-tight", children: Array.isArray(ex.videos) ? ex.videos.length : 0 }) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "px-3.5 py-2 bg-gradient-to-r from-slate-50/90 via-white to-orange-50/30 border-t border-slate-100 flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9.5px] font-bold text-slate-500 truncate", children: ex.category?.name || "Tanpa Kategori" }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5", children: /* @__PURE__ */ jsx("button", { onClick: (e) => handleDeleteExercise(e, ex.id), className: "text-slate-400 hover:text-rose-500 transition-colors p-0.5", children: /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" }) }) })
            ] })
          ]
        },
        ex.id
      )) }) }),
      activeTab === "categories" && /* @__PURE__ */ jsx(Fragment, { children: filteredCategories.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "col-span-full py-16 px-4 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-500 shadow-2xs", children: /* @__PURE__ */ jsx(Edit, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-slate-800", children: "Belum ada kategori" }) })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5", children: filteredCategories.map((cat) => /* @__PURE__ */ jsxs("div", { className: "group relative bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 rounded-lg border border-slate-200/90 hover:border-orange-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3.5 space-y-3 flex-1 flex flex-col justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 sm:w-11 sm:h-11 rounded-md border-2 border-white shadow-2xs bg-gradient-to-br from-orange-50 to-orange-100/70 text-orange-600 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(Edit, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 text-xs sm:text-[13px] truncate group-hover:text-orange-600 transition-colors leading-tight", children: cat.name }) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "px-3.5 py-2 bg-gradient-to-r from-slate-50/90 via-white to-orange-50/30 border-t border-slate-100 flex items-center justify-between text-xs", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[9.5px] font-bold text-slate-500", children: "Kategori" }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5", children: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("button", { onClick: () => openCategoryModal(cat), className: "text-slate-400 hover:text-orange-500 transition-colors p-0.5", children: /* @__PURE__ */ jsx(Edit, { className: "w-3 h-3" }) }),
            /* @__PURE__ */ jsx("button", { onClick: (e) => handleDeleteCategory(e, cat.id), className: "text-slate-400 hover:text-rose-500 transition-colors p-0.5", children: /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" }) })
          ] }) })
        ] })
      ] }, cat.id)) }) }),
      activeTab === "packages" && /* @__PURE__ */ jsx(Fragment, { children: filteredPackages.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "col-span-full py-16 px-4 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-500 shadow-2xs", children: /* @__PURE__ */ jsx(Package, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-slate-800", children: "Belum ada paket latihan" }) })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5", children: filteredPackages.map((pkg) => /* @__PURE__ */ jsxs("div", { className: "group relative bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 rounded-lg border border-slate-200/90 hover:border-orange-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3.5 space-y-3 flex-1 flex flex-col justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 sm:w-11 sm:h-11 rounded-md border-2 border-white shadow-2xs bg-gradient-to-br from-orange-50 to-orange-100/70 text-orange-600 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(Package, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 space-y-0.5", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 text-xs sm:text-[13px] truncate group-hover:text-orange-600 transition-colors leading-tight", children: pkg.name }),
            /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-slate-500 font-medium", children: [
              pkg.exercises?.length || 0,
              " Latihan"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "px-3.5 py-2 bg-gradient-to-r from-slate-50/90 via-white to-orange-50/30 border-t border-slate-100 flex items-center justify-between text-xs", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-[9.5px] font-bold text-slate-500", children: [
            pkg.exercises?.length || 0,
            " Latihan"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5", children: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Link, { href: route("admin.exercise-packages.edit", pkg.id), className: "text-slate-400 hover:text-orange-500 transition-colors p-0.5", children: /* @__PURE__ */ jsx(Edit, { className: "w-3 h-3" }) }),
            /* @__PURE__ */ jsx("button", { onClick: (e) => handleDeletePackage(e, pkg.id), className: "text-slate-400 hover:text-rose-500 transition-colors p-0.5", children: /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" }) })
          ] }) })
        ] })
      ] }, pkg.id)) }) }),
      /* @__PURE__ */ jsx(PageFooter, { className: "!mt-8 !pt-4 !pb-1" })
    ] }),
    isBulkCategoryModalOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-slate-900 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(ArrowUpDown, { size: 18, className: "text-slate-400" }),
          " Pindahkan Kategori (",
          selectedExercises.length,
          " Latihan)"
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setIsBulkCategoryModalOpen(false), className: "text-slate-400 hover:text-slate-900 transition-colors", children: /* @__PURE__ */ jsx(X, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-6 overflow-y-auto custom-scrollbar", children: /* @__PURE__ */ jsx("form", { id: "bulkCategoryForm", onSubmit: submitBulkCategory, children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 mb-2", children: "Pilih Kategori Tujuan" }),
          /* @__PURE__ */ jsxs("select", { className: "w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none", value: bulkCatData.category_id, onChange: (e) => setBulkCatData("category_id", e.target.value), children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "-- Buat Kategori Baru --" }),
            /* @__PURE__ */ jsx("option", { value: "uncategorized", children: "Tanpa Kategori" }),
            categories.map((cat) => /* @__PURE__ */ jsx("option", { value: cat.id, children: cat.name }, cat.id))
          ] })
        ] }),
        bulkCatData.category_id === "" && /* @__PURE__ */ jsxs("div", { className: "animate-in slide-in-from-top-2 duration-200", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 mb-2", children: "Nama Kategori Baru" }),
          /* @__PURE__ */ jsx("input", { type: "text", className: "w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none", value: bulkCatData.new_category_name, onChange: (e) => setBulkCatData("new_category_name", e.target.value), placeholder: "e.g., Flexibility & Mobility...", required: true, autoFocus: true })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsBulkCategoryModalOpen(false), className: "px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors", children: "Batal" }),
        /* @__PURE__ */ jsx("button", { type: "submit", form: "bulkCategoryForm", disabled: processingBulkCat, className: "px-6 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors disabled:opacity-50 shadow-sm shadow-orange-500/20", children: processingBulkCat ? "Memproses..." : "Terapkan Kategori" })
      ] })
    ] }) }),
    isCategoryModalOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-slate-100 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900", children: editingCategoryId ? "Edit Kategori" : "Buat Kategori Baru" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setIsCategoryModalOpen(false), className: "text-slate-400 hover:text-slate-900 transition-colors", children: /* @__PURE__ */ jsx(X, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submitCategory, children: [
        /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-slate-500 mb-2", children: "Nama Kategori" }),
          /* @__PURE__ */ jsx("input", { type: "text", className: "w-full py-2.5 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none", value: catData.name, onChange: (e) => setCatData("name", e.target.value), placeholder: "e.g., Core, Upper Body...", required: true, autoFocus: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsCategoryModalOpen(false), className: "px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors", children: "Batal" }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: processingCat, className: "px-4 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors disabled:opacity-50", children: processingCat ? "Menyimpan..." : "Simpan Kategori" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Index as default
};
