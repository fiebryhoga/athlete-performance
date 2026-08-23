import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useMemo } from "react";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import { usePage, useForm, Head, Link, router } from "@inertiajs/react";
import { Dumbbell, AlignLeft, Plus, Edit, Package, ChevronDown, Search, ArrowUpDown, Trash2, Image, Video, X } from "lucide-react";
import "axios";
function Index({ auth, exercises, categories = [], packages = [], currentCategoryId }) {
  const { permissions } = usePage().props;
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("name_asc");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [activeTab, setActiveTab] = useState(new URLSearchParams(window.location.search).get("tab") || "exercises");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const { delete: destroy } = useForm();
  useRef(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const {
    data: catData,
    setData: setCatData,
    post: postCat,
    put: putCat,
    processing: processingCat,
    reset: resetCat,
    delete: destroyCat
  } = useForm({
    name: ""
  });
  const [isBulkCategoryModalOpen, setIsBulkCategoryModalOpen] = useState(false);
  const {
    data: bulkCatData,
    setData: setBulkCatData,
    post: postBulkCat,
    processing: processingBulkCat,
    reset: resetBulkCat
  } = useForm({
    ids: [],
    category_id: "",
    new_category_name: ""
  });
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
    setSelectedExercises(
      (prev) => prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId]
    );
  };
  const handleBulkDelete = () => {
    if (confirm(`Yakin ingin menghapus ${selectedExercises.length} latihan terpilih?`)) {
      router.delete(route("admin.exercises.bulk-destroy"), {
        data: { ids: selectedExercises },
        onSuccess: () => setSelectedExercises([])
      });
    }
  };
  const handleOpenBulkCategoryModal = () => {
    setBulkCatData({
      ids: selectedExercises,
      category_id: "",
      new_category_name: ""
    });
    setIsBulkCategoryModalOpen(true);
  };
  const submitBulkCategory = (e) => {
    e.preventDefault();
    postBulkCat(route("admin.exercises.bulk-assign-category"), {
      onSuccess: () => {
        setIsBulkCategoryModalOpen(false);
        resetBulkCat();
        setSelectedExercises([]);
      }
    });
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
      putCat(route("admin.exercise-categories.update", editingCategoryId), {
        onSuccess: () => {
          setIsCategoryModalOpen(false);
          resetCat();
        }
      });
    } else {
      postCat(route("admin.exercise-categories.store"), {
        onSuccess: () => {
          setIsCategoryModalOpen(false);
          resetCat();
        }
      });
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
  const headerTitle = useMemo(() => {
    if (!currentCategoryId) return "Master Latihan";
    if (currentCategoryId === "uncategorized") return "Latihan Tanpa Kategori";
    const cat = categories.find((c) => c.id == currentCategoryId);
    return cat ? `Kategori: ${cat.name}` : "Master Latihan";
  }, [currentCategoryId, categories]);
  return /* @__PURE__ */ jsxs(AppLayout, { title: headerTitle, children: [
    /* @__PURE__ */ jsx(Head, { title: headerTitle }),
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: headerTitle,
        subtitle: "Kelola daftar bentuk latihan fisik, kategori, dan paket latihan.",
        badge: "Master Data",
        icon: Dumbbell,
        actions: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          activeTab === "exercises" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs(Link, { href: route("admin.exercises.bulk-create"), className: "flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs md:text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm", children: [
              /* @__PURE__ */ jsx(AlignLeft, { size: 16 }),
              " Buat Banyak"
            ] }),
            /* @__PURE__ */ jsxs(Link, { href: route("admin.exercises.create"), className: "flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-xs md:text-sm font-bold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/20", children: [
              /* @__PURE__ */ jsx(Plus, { size: 16 }),
              " Buat Latihan"
            ] })
          ] }),
          activeTab === "categories" && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => openCategoryModal(),
              className: "flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-xs md:text-sm font-bold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/20",
              children: [
                /* @__PURE__ */ jsx(Plus, { size: 16 }),
                " Buat Kategori"
              ]
            }
          ),
          activeTab === "packages" && /* @__PURE__ */ jsxs(Link, { href: route("admin.exercise-packages.create"), className: "flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-xs md:text-sm font-bold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/20", children: [
            /* @__PURE__ */ jsx(Plus, { size: 16 }),
            " Buat Paket"
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "pb-12 space-y-6 relative", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex p-1 bg-slate-100 border border-slate-200 rounded-xl w-fit shadow-sm overflow-x-auto max-w-full", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setActiveTab("exercises");
                router.get(route("admin.exercises.index"), {}, { preserveState: true });
              },
              className: `flex whitespace-nowrap items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === "exercises" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`,
              children: [
                /* @__PURE__ */ jsx(Dumbbell, { size: 16 }),
                " Latihan Satuan"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab("categories"),
              className: `flex whitespace-nowrap items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === "categories" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`,
              children: [
                /* @__PURE__ */ jsx(Edit, { size: 16 }),
                " Kategori Latihan"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab("packages"),
              className: `flex whitespace-nowrap items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === "packages" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`,
              children: [
                /* @__PURE__ */ jsx(Package, { size: 16 }),
                " Paket Latihan"
              ]
            }
          )
        ] }),
        activeTab === "exercises" && /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setIsCategoryDropdownOpen(!isCategoryDropdownOpen),
              className: "flex items-center justify-between w-64 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 transition-colors shadow-sm",
              children: [
                /* @__PURE__ */ jsx("span", { className: "truncate", children: !currentCategoryId ? "Semua Latihan" : currentCategoryId === "uncategorized" ? "Tanpa Kategori" : categories.find((c) => c.id == currentCategoryId)?.name || "Pilih Kategori" }),
                /* @__PURE__ */ jsx(ChevronDown, { size: 16, className: `text-slate-500 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}` })
              ]
            }
          ),
          isCategoryDropdownOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-40", onClick: () => setIsCategoryDropdownOpen(false) }),
            /* @__PURE__ */ jsxs("div", { className: "absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2 border-b border-slate-100", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 text-slate-400", size: 14 }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "Cari kategori...",
                    value: categorySearch,
                    onChange: (e) => setCategorySearch(e.target.value),
                    className: "w-full pl-8 pr-3 py-2 bg-slate-50 border-none rounded-lg text-sm text-slate-900 focus:ring-0 outline-none"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "max-h-60 overflow-y-auto custom-scrollbar p-1", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => {
                      router.get(route("admin.exercises.index"), {}, { preserveState: true });
                      setIsCategoryDropdownOpen(false);
                    },
                    className: `w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-100 transition-colors ${!currentCategoryId ? "bg-slate-100 font-bold text-slate-900" : "text-slate-700"}`,
                    children: "Semua Latihan"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => {
                      router.get(route("admin.exercises.index", { category_id: "uncategorized" }), {}, { preserveState: true });
                      setIsCategoryDropdownOpen(false);
                    },
                    className: `w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-100 transition-colors ${currentCategoryId === "uncategorized" ? "bg-slate-100 font-bold text-slate-900" : "text-slate-700"}`,
                    children: "Tanpa Kategori"
                  }
                ),
                categories.filter((c) => c.name.toLowerCase().includes(categorySearch.toLowerCase())).map((cat) => /* @__PURE__ */ jsx("div", { className: "flex items-center group", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => {
                      router.get(route("admin.exercises.index", { category_id: cat.id }), {}, { preserveState: true });
                      setIsCategoryDropdownOpen(false);
                    },
                    className: `flex-1 text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-100 transition-colors truncate ${currentCategoryId == cat.id ? "bg-slate-100 font-bold text-slate-900" : "text-slate-700"}`,
                    children: cat.name
                  }
                ) }, cat.id))
              ] }),
              /* @__PURE__ */ jsx("div", { className: "p-2 border-t border-slate-100 bg-slate-50", children: /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => {
                    openCategoryModal();
                    setIsCategoryDropdownOpen(false);
                  },
                  className: "w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-900 transition-colors shadow-sm",
                  children: [
                    /* @__PURE__ */ jsx(Plus, { size: 14 }),
                    " Buat Kategori Baru"
                  ]
                }
              ) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative w-full sm:w-80 group", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: /* @__PURE__ */ jsx(Search, { className: "text-slate-400", size: 16 }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: activeTab === "exercises" ? "Cari latihan..." : activeTab === "packages" ? "Cari paket..." : "Cari kategori...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-500 focus:ring-1 focus:ring-slate-900 outline-none shadow-sm"
            }
          )
        ] }),
        activeTab === "exercises" && /* @__PURE__ */ jsxs("div", { className: "relative w-full sm:w-48", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: /* @__PURE__ */ jsx(ArrowUpDown, { className: "text-slate-400", size: 16 }) }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: sortOption,
              onChange: (e) => setSortOption(e.target.value),
              className: "w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none shadow-sm appearance-none cursor-pointer truncate",
              children: [
                /* @__PURE__ */ jsx("option", { value: "name_asc", children: "Nama (A-Z)" }),
                /* @__PURE__ */ jsx("option", { value: "name_desc", children: "Nama (Z-A)" }),
                /* @__PURE__ */ jsx("option", { value: "created_desc", children: "Terbaru Ditambahkan" }),
                /* @__PURE__ */ jsx("option", { value: "created_asc", children: "Terlama Ditambahkan" })
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none", children: /* @__PURE__ */ jsx(ChevronDown, { className: "text-slate-400", size: 16 }) })
        ] })
      ] }) }),
      activeTab === "exercises" && /* @__PURE__ */ jsxs(Fragment, { children: [
        selectedExercises.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl animate-in fade-in slide-in-from-top-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold", children: [
            selectedExercises.length,
            " Latihan Terpilih"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setSelectedExercises([]),
                className: "flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors",
                children: "Batal"
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleOpenBulkCategoryModal,
                className: "flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors",
                children: [
                  /* @__PURE__ */ jsx(Edit, { size: 16 }),
                  " Pindahkan Kategori"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleBulkDelete,
                className: "flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-100 hover:bg-red-500/40 rounded-xl text-sm font-semibold transition-colors ",
                children: [
                  /* @__PURE__ */ jsx(Trash2, { size: 16 }),
                  " Hapus"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-in fade-in slide-in-from-bottom-2 duration-500", children: [
          filteredExercises.map((ex) => /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => router.get(route("admin.exercises.edit", ex.id)),
              className: `group cursor-pointer bg-white border ${selectedExercises.includes(ex.id) ? "border-slate-900 ring-1 ring-slate-900" : "border-slate-200 hover:border-slate-900 hover:shadow-md"} rounded-xl p-5 transition-all shadow-sm flex flex-col justify-between relative`,
              children: [
                /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4 z-10", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    className: "w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer",
                    checked: selectedExercises.includes(ex.id),
                    onClick: (e) => e.stopPropagation(),
                    onChange: () => toggleExerciseMainSelection(ex.id)
                  }
                ) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 border border-slate-200 mb-4 overflow-hidden relative", children: ex.images && ex.images.length > 0 ? /* @__PURE__ */ jsx("img", { src: ex.images[0], alt: ex.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx(Dumbbell, { size: 18 }) }),
                  /* @__PURE__ */ jsx("h4", { className: "font-bold text-slate-900 pr-6", children: ex.name }),
                  /* @__PURE__ */ jsx("div", { className: "mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600", children: ex.category?.name || "Tanpa Kategori" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mt-3 text-xs text-slate-500 font-semibold", children: [
                    /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(Image, { size: 14 }),
                      " ",
                      Array.isArray(ex.images) ? ex.images.length : 0
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(Video, { size: 14 }),
                      " ",
                      Array.isArray(ex.videos) ? ex.videos.length : 0
                    ] })
                  ] }),
                  ex.description && /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-slate-500 line-clamp-2", children: ex.description })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mt-6 pt-4 border-t border-slate-100 flex justify-end items-center", children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("button", { type: "button", onClick: (e) => {
                    e.stopPropagation();
                    router.get(route("admin.exercises.edit", ex.id));
                  }, className: "text-slate-400 hover:text-slate-900 transition-colors p-1", children: /* @__PURE__ */ jsx(Edit, { size: 16 }) }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: (e) => handleDeleteExercise(e, ex.id),
                      className: "text-slate-400 hover:text-red-500 transition-colors p-1",
                      children: /* @__PURE__ */ jsx(Trash2, { size: 16 })
                    }
                  )
                ] }) }) })
              ]
            },
            ex.id
          )),
          filteredExercises.length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-full py-12 text-center text-slate-500 text-sm", children: "Belum ada latihan yang didaftarkan." })
        ] })
      ] }),
      activeTab === "categories" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-in fade-in slide-in-from-bottom-2 duration-500", children: [
        filteredCategories.map((cat) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "group bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-900 transition-all shadow-sm flex flex-col justify-between",
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 border border-slate-200 mb-4", children: /* @__PURE__ */ jsx(Edit, { size: 18 }) }),
                /* @__PURE__ */ jsx("h4", { className: "font-bold text-slate-900", children: cat.name })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-6 pt-4 border-t border-slate-100 flex justify-end items-center gap-3", children: /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => openCategoryModal(cat),
                    className: "text-slate-400 hover:text-slate-900 transition-colors p-1",
                    children: /* @__PURE__ */ jsx(Edit, { size: 16 })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: (e) => handleDeleteCategory(e, cat.id),
                    className: "text-slate-400 hover:text-red-500 transition-colors p-1",
                    children: /* @__PURE__ */ jsx(Trash2, { size: 16 })
                  }
                )
              ] }) })
            ]
          },
          cat.id
        )),
        filteredCategories.length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-full py-12 text-center text-slate-500 text-sm", children: "Belum ada kategori yang dibuat." })
      ] }),
      activeTab === "packages" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-in fade-in slide-in-from-bottom-2 duration-500", children: [
        filteredPackages.map((pkg) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "group bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-900 transition-all shadow-sm flex flex-col justify-between",
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 border border-slate-200 mb-4", children: /* @__PURE__ */ jsx(Package, { size: 18 }) }),
                /* @__PURE__ */ jsx("h4", { className: "font-bold text-slate-900", children: pkg.name }),
                /* @__PURE__ */ jsxs("div", { className: "mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600", children: [
                  pkg.exercises?.length || 0,
                  " Latihan"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-6 pt-4 border-t border-slate-100 flex justify-end items-center gap-3", children: /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Link, { href: route("admin.exercise-packages.edit", pkg.id), className: "text-slate-400 hover:text-slate-900 transition-colors p-1", children: /* @__PURE__ */ jsx(Edit, { size: 16 }) }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: (e) => handleDeletePackage(e, pkg.id),
                    className: "text-slate-400 hover:text-red-500 transition-colors p-1",
                    children: /* @__PURE__ */ jsx(Trash2, { size: 16 })
                  }
                )
              ] }) })
            ]
          },
          pkg.id
        )),
        filteredPackages.length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-full py-12 text-center text-slate-500 text-sm", children: "Belum ada paket latihan yang dibuat." })
      ] })
    ] }),
    isBulkCategoryModalOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-slate-900 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(ArrowUpDown, { size: 18, className: "text-slate-400" }),
          "Pindahkan Kategori (",
          selectedExercises.length,
          " Latihan)"
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setIsBulkCategoryModalOpen(false),
            className: "text-slate-400 hover:text-slate-900 transition-colors",
            children: /* @__PURE__ */ jsx(X, { size: 20 })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-6 overflow-y-auto custom-scrollbar", children: /* @__PURE__ */ jsx("form", { id: "bulkCategoryForm", onSubmit: submitBulkCategory, children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 mb-2", children: "Pilih Kategori Tujuan" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none",
              value: bulkCatData.category_id,
              onChange: (e) => setBulkCatData("category_id", e.target.value),
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "-- Buat Kategori Baru --" }),
                /* @__PURE__ */ jsx("option", { value: "uncategorized", children: "Tanpa Kategori" }),
                categories.map((cat) => /* @__PURE__ */ jsx("option", { value: cat.id, children: cat.name }, cat.id))
              ]
            }
          )
        ] }),
        bulkCatData.category_id === "" && /* @__PURE__ */ jsxs("div", { className: "animate-in slide-in-from-top-2 duration-200", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-500 mb-2", children: "Nama Kategori Baru" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none",
              value: bulkCatData.new_category_name,
              onChange: (e) => setBulkCatData("new_category_name", e.target.value),
              placeholder: "e.g., Flexibility & Mobility...",
              required: true,
              autoFocus: true
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setIsBulkCategoryModalOpen(false),
            className: "px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors",
            children: "Batal"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            form: "bulkCategoryForm",
            disabled: processingBulkCat,
            className: "px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50 shadow-sm shadow-slate-900/20",
            children: processingBulkCat ? "Memproses..." : "Terapkan Kategori"
          }
        )
      ] })
    ] }) }),
    isCategoryModalOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-slate-100 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900", children: editingCategoryId ? "Edit Kategori" : "Buat Kategori Baru" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setIsCategoryModalOpen(false),
            className: "text-slate-400 hover:text-slate-900 transition-colors",
            children: /* @__PURE__ */ jsx(X, { size: 20 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submitCategory, children: [
        /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-slate-500 mb-2", children: "Nama Kategori" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              className: "w-full py-2.5 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none",
              value: catData.name,
              onChange: (e) => setCatData("name", e.target.value),
              placeholder: "e.g., Core, Upper Body...",
              required: true,
              autoFocus: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setIsCategoryModalOpen(false),
              className: "px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors",
              children: "Batal"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processingCat,
              className: "px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50",
              children: processingCat ? "Menyimpan..." : "Simpan Kategori"
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
