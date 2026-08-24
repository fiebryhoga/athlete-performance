import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { useForm, router, Head, Link } from "@inertiajs/react";
import { Search, UploadCloud, Plus, Package, Users, Shield, Building2, Edit3, Trash2, UserCog, X, Camera, User, Lock, ChevronRight, UserCheck, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import GroupList from "./GroupList-BNFHEb1T.js";
import "axios";
import "./Modal-DUGk5ZHw.js";
import "@headlessui/react";
function Index({ auth, users, filters, activeTab, sports, coachesList, packagesList, groupsList, allAthletes }) {
  const [search, setSearch] = useState(filters.search || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editUser, setEditUser] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    name: "",
    username: "",
    password: "",
    profile_photo: null,
    role: activeTab,
    is_gym_guard: false,
    gym_fee: "",
    sport_id: "",
    gender: "L",
    age: "",
    height: "",
    weight: "",
    training_exp_date: "",
    subscription_package_id: "",
    coach_ids: [],
    _method: "POST"
  });
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      router.get(route("admin.users.index"), { search, tab: activeTab }, { preserveState: true, replace: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData("profile_photo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleTabChange = (tab) => {
    router.get(route("admin.users.index"), { tab }, { preserveState: true, replace: true });
  };
  const handleSort = (field) => {
    let newDirection = "asc";
    if (filters.sort_field === field) {
      newDirection = filters.sort_direction === "asc" ? "desc" : "asc";
    }
    router.get(route("admin.users.index"), {
      tab: activeTab,
      search,
      sort_field: field,
      sort_direction: newDirection
    }, { preserveState: true, replace: true });
  };
  const SortIcon = ({ field }) => {
    if (filters.sort_field !== field) return /* @__PURE__ */ jsx(ArrowUpDown, { className: "w-3 h-3 text-slate-300 ml-1 inline-block" });
    if (filters.sort_direction === "asc") return /* @__PURE__ */ jsx(ArrowUp, { className: "w-3 h-3 text-orange-500 ml-1 inline-block" });
    return /* @__PURE__ */ jsx(ArrowDown, { className: "w-3 h-3 text-orange-500 ml-1 inline-block" });
  };
  const openCreateModal = () => {
    setModalMode("create");
    setEditUser(null);
    setPhotoPreview(null);
    reset();
    clearErrors();
    setData({
      name: "",
      username: "",
      password: "",
      profile_photo: null,
      role: activeTab,
      is_gym_guard: false,
      gym_fee: "",
      sport_id: "",
      gender: "L",
      age: "",
      height: "",
      weight: "",
      training_exp_date: "",
      subscription_package_id: "",
      coach_ids: [],
      _method: "POST"
    });
    setIsModalOpen(true);
  };
  const openEditModal = (user) => {
    setModalMode("edit");
    setEditUser(user);
    setPhotoPreview(user.profile_photo_url || null);
    clearErrors();
    setData({
      name: user.name,
      username: user.username,
      password: "",
      profile_photo: null,
      role: user.role,
      is_gym_guard: user.is_gym_guard || false,
      gym_fee: user.gym_fee || "",
      sport_id: user.sport_id || "",
      gender: user.gender || "L",
      age: user.age || "",
      height: user.height || "",
      weight: user.weight || "",
      training_exp_date: user.training_exp_date || "",
      subscription_package_id: user.subscription_package_id || "",
      coach_ids: user.coaches?.map((c) => c.id) || [],
      _method: "PUT"
    });
    setIsModalOpen(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "create") {
      post(route("admin.users.store"), {
        forceFormData: true,
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        }
      });
    } else {
      post(route("admin.users.update", editUser.id), {
        forceFormData: true,
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        }
      });
    }
  };
  const handleCoachToggle = (coachId) => {
    let newCoachIds = [...data.coach_ids];
    if (newCoachIds.includes(coachId)) {
      newCoachIds = newCoachIds.filter((id) => id !== coachId);
    } else {
      if (newCoachIds.length >= 2) {
        alert("Maksimal hanya 2 pelatih (coach) yang dapat dipilih.");
        return;
      }
      newCoachIds.push(coachId);
    }
    setData("coach_ids", newCoachIds);
  };
  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      router.delete(route("admin.users.destroy", id));
    }
  };
  const tabs = [
    { id: "superadmin", label: "Superadmin" },
    { id: "coach", label: "Coach" },
    { id: "athlete", label: "Athlete / Klien" },
    { id: "group", label: "Grup" }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { title: auth.user.role === "superadmin" ? "Manajemen Pengguna" : "Manajemen Klien", children: [
    /* @__PURE__ */ jsx(Head, { title: auth.user.role === "superadmin" ? "Manajemen Pengguna" : "Manajemen Klien" }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[1400px] mx-auto pb-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 md:p-8 rounded-xl border border-slate-200 shadow-sm mb-6 relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6 w-full", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none" }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 w-full lg:w-auto", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[9px] md:text-[10px] font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full mb-2 md:mb-3 inline-block", children: "System & Security" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2", children: auth.user.role === "superadmin" ? "Manajemen Pengguna" : "Manajemen Klien" }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 font-medium mt-1 text-xs md:text-sm", children: auth.user.role === "superadmin" ? "Kelola akun dan hak akses pengguna secara terpusat." : "Kelola data fisik klien yang berada di bawah pantauan Anda." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-full sm:w-72 shrink-0", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-3.5 top-3 w-4 h-4 text-slate-400" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Cari nama atau ID...",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: "w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none shadow-sm touch-manipulation"
              }
            )
          ] }),
          auth.user.role === "superadmin" && activeTab === "athlete" && /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("admin.users.bulkCreate"),
              className: "w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 px-5 py-2.5 md:py-3 rounded-lg font-bold text-xs md:text-sm shadow-sm hover:bg-orange-100 hover:text-orange-700 transition-all active:scale-95 touch-manipulation shrink-0",
              children: [
                /* @__PURE__ */ jsx(UploadCloud, { className: "w-4 h-4 md:w-5 md:h-5" }),
                " Bulk Add Klien"
              ]
            }
          ),
          auth.user.role === "superadmin" && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: openCreateModal,
              className: "w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-500 text-white px-5 py-2.5 md:py-3 rounded-lg font-bold text-xs md:text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95 touch-manipulation shrink-0",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 md:w-5 md:h-5" }),
                " Tambah Akun"
              ]
            }
          )
        ] })
      ] }),
      auth.user.role === "superadmin" && /* @__PURE__ */ jsx("div", { className: "flex border-b border-slate-200 mb-6 overflow-x-auto custom-scrollbar pb-1", children: tabs.map((tab) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleTabChange(tab.id),
          className: `px-6 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id ? "border-orange-500 text-orange-500" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}`,
          children: tab.label
        },
        tab.id
      )) }),
      activeTab === "group" ? /* @__PURE__ */ jsx(
        GroupList,
        {
          groups: groupsList,
          packages: packagesList,
          allAthletes,
          coaches: coachesList
        }
      ) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500", children: [
            /* @__PURE__ */ jsxs("th", { className: "px-6 py-4 w-[40%] cursor-pointer hover:bg-slate-100/50 transition-colors", onClick: () => handleSort("name"), children: [
              "Nama Lengkap ",
              /* @__PURE__ */ jsx(SortIcon, { field: "name" })
            ] }),
            /* @__PURE__ */ jsxs("th", { className: "px-6 py-4 w-[25%] cursor-pointer hover:bg-slate-100/50 transition-colors", onClick: () => handleSort("username"), children: [
              "Login ID ",
              /* @__PURE__ */ jsx(SortIcon, { field: "username" })
            ] }),
            /* @__PURE__ */ jsxs("th", { className: "px-6 py-4 text-center w-[20%] cursor-pointer hover:bg-slate-100/50 transition-colors", onClick: () => handleSort("role"), children: [
              "Role ",
              /* @__PURE__ */ jsx(SortIcon, { field: "role" })
            ] }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right w-[15%]", children: "Aksi" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100 bg-white", children: users.data.length > 0 ? users.data.map((user) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50 transition-colors group", children: [
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 align-middle", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center font-bold text-sm border border-orange-100 shadow-sm overflow-hidden", children: user.profile_photo_url ? /* @__PURE__ */ jsx("img", { src: user.profile_photo_url, alt: user.name, className: "w-full h-full object-cover" }) : user.name.substring(0, 2).toUpperCase() }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800 text-sm group-hover:text-orange-500 transition-colors", children: user.name }),
                user.role === "athlete" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 mt-1.5", children: [
                  user.package && /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 text-[10px] text-teal-700 bg-teal-50/80 px-2 py-0.5 rounded border border-teal-100 font-medium w-fit", children: [
                    /* @__PURE__ */ jsx(Package, { className: "w-3 h-3" }),
                    " Privat (",
                    user.package.name,
                    ")",
                    user.training_exp_date && /* @__PURE__ */ jsxs("span", { className: "text-rose-500 font-bold ml-1", children: [
                      "Exp: ",
                      new Date(user.training_exp_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                    ] })
                  ] }),
                  user.groups?.map((g) => /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 text-[10px] text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-100 font-medium w-fit", children: [
                    /* @__PURE__ */ jsx(Users, { className: "w-3 h-3" }),
                    " Grup: ",
                    g.name,
                    g.package && /* @__PURE__ */ jsxs("span", { className: "opacity-75", children: [
                      "(",
                      g.package.name,
                      ")"
                    ] }),
                    g.expiration_date && /* @__PURE__ */ jsxs("span", { className: "text-rose-500 font-bold ml-1", children: [
                      "Exp: ",
                      new Date(g.expiration_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                    ] })
                  ] }, g.id))
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 align-middle text-slate-500 text-xs font-medium", children: user.username }),
            /* @__PURE__ */ jsxs("td", { className: "px-6 py-4 align-middle text-center", children: [
              /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border ${user.role === "superadmin" ? "bg-indigo-50 text-indigo-600 border-indigo-100" : user.role === "coach" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-orange-50 text-orange-500 border-orange-100"}`, children: [
                /* @__PURE__ */ jsx(Shield, { className: "w-3 h-3" }),
                " ",
                user.role
              ] }),
              user.role === "coach" && user.is_gym_guard && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border bg-amber-50 text-amber-600 border-amber-100 mt-1", children: [
                /* @__PURE__ */ jsx(Building2, { className: "w-3 h-3" }),
                " Penjaga Gym"
              ] })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 align-middle text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => openEditModal(user),
                  className: "p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors",
                  title: "Edit Pengguna",
                  children: /* @__PURE__ */ jsx(Edit3, { className: "w-4 h-4" })
                }
              ),
              auth.user.role === "superadmin" && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleDelete(user.id),
                  className: "p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors",
                  title: "Hapus Pengguna",
                  children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                }
              )
            ] }) })
          ] }, user.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "4", className: "px-6 py-20 text-center text-slate-400", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center", children: [
            /* @__PURE__ */ jsx("div", { className: "p-4 bg-slate-50 rounded-full mb-3", children: /* @__PURE__ */ jsx(Users, { className: "w-8 h-8 text-slate-300" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-700", children: "Tidak ada pengguna ditemukan" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-1 font-medium", children: "Coba sesuaikan kata kunci pencarian atau ganti tab." })
          ] }) }) }) })
        ] }) }) }),
        /* @__PURE__ */ jsx("div", { className: "md:hidden flex flex-col gap-3", children: users.data.length > 0 ? users.data.map((user) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center font-bold text-base border border-orange-100 shadow-sm overflow-hidden", children: user.profile_photo_url ? /* @__PURE__ */ jsx("img", { src: user.profile_photo_url, alt: user.name, className: "w-full h-full object-cover" }) : user.name.substring(0, 2).toUpperCase() }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 text-sm", children: user.name }),
                /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-xs mt-0.5", children: user.username }),
                user.role === "athlete" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 mt-2", children: [
                  user.package && /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1 text-[9px] text-teal-700 bg-teal-50/80 px-1.5 py-0.5 rounded border border-teal-100 font-medium whitespace-nowrap w-fit", children: [
                    /* @__PURE__ */ jsx(Package, { className: "w-2.5 h-2.5 shrink-0" }),
                    " ",
                    /* @__PURE__ */ jsxs("span", { className: "truncate max-w-[120px]", children: [
                      "Privat (",
                      user.package.name,
                      ")"
                    ] }),
                    user.training_exp_date && /* @__PURE__ */ jsxs("span", { className: "text-rose-500 font-bold ml-0.5 shrink-0", children: [
                      "Exp: ",
                      new Date(user.training_exp_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                    ] })
                  ] }),
                  user.groups?.map((g) => /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1 text-[9px] text-indigo-700 bg-indigo-50/80 px-1.5 py-0.5 rounded border border-indigo-100 font-medium whitespace-nowrap w-fit", children: [
                    /* @__PURE__ */ jsx(Users, { className: "w-2.5 h-2.5 shrink-0" }),
                    " ",
                    /* @__PURE__ */ jsxs("span", { className: "truncate max-w-[120px]", children: [
                      "Grup: ",
                      g.name,
                      " ",
                      g.package && `(${g.package.name})`
                    ] }),
                    g.expiration_date && /* @__PURE__ */ jsxs("span", { className: "text-rose-500 font-bold ml-0.5 shrink-0", children: [
                      "Exp: ",
                      new Date(g.expiration_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                    ] })
                  ] }, g.id))
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-col items-end gap-2", children: /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold border ${user.role === "superadmin" ? "bg-indigo-50 text-indigo-600 border-indigo-100" : user.role === "coach" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-orange-50 text-orange-500 border-orange-100"}`, children: [
              /* @__PURE__ */ jsx(Shield, { className: "w-3 h-3" }),
              " ",
              user.role
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2 pt-3 border-t border-slate-100", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => openEditModal(user),
                className: "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors border border-slate-200 hover:border-amber-200",
                children: [
                  /* @__PURE__ */ jsx(Edit3, { className: "w-3.5 h-3.5" }),
                  " Edit"
                ]
              }
            ),
            auth.user.role === "superadmin" && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => handleDelete(user.id),
                className: "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors border border-slate-200 hover:border-rose-200",
                children: [
                  /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }),
                  " Hapus"
                ]
              }
            )
          ] })
        ] }, user.id)) : /* @__PURE__ */ jsxs("div", { className: "bg-white p-10 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "p-4 bg-slate-50 rounded-full mb-3", children: /* @__PURE__ */ jsx(Users, { className: "w-8 h-8 text-slate-300" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-700", children: "Tidak ada pengguna" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-1 font-medium", children: "Coba sesuaikan pencarian." })
        ] }) }),
        users.links && users.links.length > 3 && /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "inline-flex gap-1 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm", children: users.links.map((link, index) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => link.url && router.get(link.url, {}, { preserveState: true }),
            disabled: !link.url,
            className: `px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-bold rounded-md transition-all ${link.active ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : link.url ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900" : "text-slate-300 cursor-not-allowed"}`,
            dangerouslySetInnerHTML: { __html: link.label }
          },
          index
        )) }) })
      ] })
    ] }),
    isModalOpen && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity", onClick: () => setIsModalOpen(false) }),
      /* @__PURE__ */ jsxs("div", { className: `relative bg-white w-full ${data.role === "athlete" ? "max-w-3xl" : "max-w-md"} rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col`, children: [
        /* @__PURE__ */ jsxs("div", { className: "px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h3", { className: "font-bold text-base md:text-lg text-slate-800 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(UserCog, { className: "w-4 h-4 md:w-5 md:h-5 text-orange-500" }),
              modalMode === "create" ? "Tambah Akun" : "Edit Akun"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] md:text-xs text-slate-500 font-medium mt-0.5", children: modalMode === "create" ? "Buat akun pengguna baru." : "Ubah informasi akun pengguna." })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setIsModalOpen(false), className: "text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-lg hover:bg-rose-50 touch-manipulation", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4 md:w-5 md:h-5" }) })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col max-h-[75vh] overflow-y-auto custom-scrollbar", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-5 md:p-6 lg:p-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center mb-6 md:mb-8", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  onClick: () => auth.user.role === "superadmin" && fileInputRef.current?.click(),
                  className: `w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-dashed flex flex-col items-center justify-center bg-slate-50 overflow-hidden relative group transition-all ${auth.user.role === "superadmin" ? "border-slate-300 cursor-pointer hover:border-orange-500 hover:bg-orange-50" : "border-slate-200 cursor-not-allowed opacity-70"}`,
                  children: photoPreview ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx("img", { src: photoPreview, alt: "Preview", className: "w-full h-full object-cover" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(Camera, { className: "w-5 h-5 md:w-6 md:h-6 text-white" }) })
                  ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-slate-400 group-hover:text-orange-500", children: [
                    /* @__PURE__ */ jsx(UploadCloud, { className: "w-5 h-5 md:w-6 md:h-6 mb-1" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] md:text-[10px] font-bold mt-0.5 md:mt-1", children: "Photo" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsx("input", { type: "file", ref: fileInputRef, onChange: handlePhotoChange, accept: "image/*", className: "hidden" }),
              errors.profile_photo && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-[10px] md:text-xs mt-2 font-bold", children: errors.profile_photo })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: data.role === "athlete" ? "grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8" : "space-y-4 md:space-y-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-4 md:space-y-5", children: [
                data.role === "athlete" && /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-bold text-orange-500 mb-2 border-b border-orange-100 pb-2", children: "Account Information" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 mb-1.5 ml-1", children: "Role / Jabatan" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      className: "block w-full px-4 py-3 md:py-2.5 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-medium text-slate-800 outline-none text-xs md:text-sm disabled:opacity-60 disabled:cursor-not-allowed",
                      value: data.role,
                      onChange: (e) => setData("role", e.target.value),
                      disabled: auth.user.role !== "superadmin",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "superadmin", children: "Superadmin" }),
                        /* @__PURE__ */ jsx("option", { value: "coach", children: "Coach (Pelatih)" }),
                        /* @__PURE__ */ jsx("option", { value: "athlete", children: "Athlete / Klien" })
                      ]
                    }
                  ),
                  errors.role && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-[10px] md:text-xs mt-1 font-bold ml-1", children: errors.role })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 mb-1.5 ml-1", children: "Nama Lengkap" }),
                  /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                    /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(User, { className: "h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" }) }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        className: "block w-full pl-10 pr-4 py-3 md:py-2.5 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-medium text-slate-800 outline-none text-xs md:text-sm touch-manipulation disabled:opacity-60 disabled:cursor-not-allowed",
                        value: data.name,
                        onChange: (e) => setData("name", e.target.value),
                        placeholder: "e.g. John Doe",
                        disabled: auth.user.role !== "superadmin"
                      }
                    )
                  ] }),
                  errors.name && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-[10px] md:text-xs mt-1 font-bold ml-1", children: errors.name })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 mb-1.5 ml-1", children: "Login ID (Username)" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      className: "block w-full px-4 py-3 md:py-2.5 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-xs md:text-sm text-slate-800 outline-none font-medium disabled:opacity-60 touch-manipulation disabled:cursor-not-allowed",
                      value: data.username,
                      onChange: (e) => setData("username", e.target.value),
                      placeholder: "e.g. admin_01",
                      disabled: auth.user.role !== "superadmin"
                    }
                  ),
                  errors.username && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-[10px] md:text-xs mt-1 font-bold ml-1", children: errors.username })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("label", { className: "block text-[10px] font-bold text-slate-500 mb-1.5 ml-1 flex justify-between items-end", children: [
                    "Password",
                    modalMode === "edit" && /* @__PURE__ */ jsx("span", { className: "text-slate-400 font-medium normal-case tracking-normal text-[9px]", children: "(Kosongkan jika tidak diganti)" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                    /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" }) }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "password",
                        className: "block w-full pl-10 pr-4 py-3 md:py-2.5 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-medium text-slate-800 outline-none text-xs md:text-sm touch-manipulation disabled:opacity-60 disabled:cursor-not-allowed",
                        value: data.password,
                        onChange: (e) => setData("password", e.target.value),
                        placeholder: "••••••••",
                        disabled: auth.user.role !== "superadmin"
                      }
                    )
                  ] }),
                  errors.password && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-[10px] md:text-xs mt-1 font-bold ml-1", children: errors.password })
                ] }),
                data.role === "coach" && /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 md:p-4 rounded-lg border border-slate-200", children: [
                  /* @__PURE__ */ jsxs(
                    "label",
                    {
                      className: `flex items-center gap-3 ${auth.user.role === "superadmin" ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`,
                      onClick: () => auth.user.role === "superadmin" && setData("is_gym_guard", !data.is_gym_guard),
                      children: [
                        /* @__PURE__ */ jsx("div", { className: `w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${data.is_gym_guard ? "bg-orange-500 border-orange-500" : "border-slate-300 bg-white"}`, children: data.is_gym_guard && /* @__PURE__ */ jsx("svg", { className: "w-3 h-3 text-white", viewBox: "0 0 12 12", fill: "none", children: /* @__PURE__ */ jsx("path", { d: "M10 3L4.5 8.5L2 6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) }),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsx(Building2, { className: "w-4 h-4 text-slate-500" }),
                            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-700", children: "Bertugas sebagai Penjaga Gym" })
                          ] }),
                          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-medium mt-0.5 ml-6", children: "Coach ini akan bisa dijadwalkan untuk piket jaga gym" })
                        ] })
                      ]
                    }
                  ),
                  data.is_gym_guard && /* @__PURE__ */ jsxs("div", { className: "mt-3 pt-3 border-t border-slate-200/80 pl-8", children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-600 mb-1", children: "Tarif Khusus Jaga Gym (Rp / shift)" }),
                    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400", children: "Rp" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "number",
                          value: data.gym_fee || "",
                          onChange: (e) => setData("gym_fee", e.target.value),
                          placeholder: "Kosongkan untuk tarif default gym",
                          className: "w-full pl-9 pr-3 py-1.5 rounded-md border-slate-200 text-xs focus:ring-orange-500 focus:border-orange-500",
                          min: "0",
                          disabled: auth.user.role !== "superadmin"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-[9.5px] text-slate-400 font-medium mt-1", children: "Kosongkan jika ingin mengikuti tarif default global gym." })
                  ] })
                ] }),
                data.role === "athlete" && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 mb-1.5 ml-1", children: "Sport Category" }),
                    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsxs(
                        "select",
                        {
                          value: data.sport_id,
                          onChange: (e) => setData("sport_id", e.target.value),
                          className: "w-full px-4 py-2.5 md:py-3 rounded-lg border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs md:text-sm appearance-none bg-white transition-all outline-none shadow-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed",
                          disabled: auth.user.role !== "superadmin",
                          children: [
                            /* @__PURE__ */ jsx("option", { value: "", children: "-- Select Sport --" }),
                            sports && sports.map((sport) => /* @__PURE__ */ jsx("option", { value: sport.id, children: sport.name }, sport.id))
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsx(ChevronRight, { className: "absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none rotate-90" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 mb-1.5 ml-1", children: "Assign Coaches (Max 2)" }),
                    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: coachesList && coachesList.map((coach) => /* @__PURE__ */ jsxs("label", { onClick: () => auth.user.role === "superadmin" && handleCoachToggle(coach.id), className: `flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors text-xs md:text-sm font-medium select-none ${auth.user.role === "superadmin" ? "cursor-pointer hover:bg-slate-50" : "cursor-not-allowed opacity-60"} ${data.coach_ids.includes(coach.id) ? "border-orange-500 bg-orange-50 text-orange-500" : "border-slate-200 text-slate-700"}`, children: [
                      /* @__PURE__ */ jsx("div", { className: `w-4 h-4 rounded border flex items-center justify-center transition-colors ${data.coach_ids.includes(coach.id) ? "bg-orange-500 border-orange-500" : "border-slate-300"}`, children: data.coach_ids.includes(coach.id) && /* @__PURE__ */ jsx(UserCheck, { className: "w-3 h-3 text-white" }) }),
                      coach.name
                    ] }, coach.id)) }),
                    errors.coach_ids && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-[10px] md:text-xs mt-1 font-bold ml-1", children: errors.coach_ids })
                  ] })
                ] })
              ] }),
              data.role === "athlete" && /* @__PURE__ */ jsxs("div", { className: "space-y-4 md:space-y-5 border-t border-slate-100 pt-5 md:pt-0 md:border-t-0 md:border-l md:pl-6 lg:pl-8", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-bold text-orange-500 mb-2 border-b border-orange-100 pb-2", children: "Physical Metrics" }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 md:gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 mb-1.5 ml-1", children: "Gender" }),
                    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsxs(
                        "select",
                        {
                          value: data.gender,
                          onChange: (e) => setData("gender", e.target.value),
                          className: "w-full px-4 py-2.5 md:py-3 rounded-lg border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs md:text-sm appearance-none bg-white transition-all outline-none shadow-sm font-medium",
                          children: [
                            /* @__PURE__ */ jsx("option", { value: "L", children: "Male" }),
                            /* @__PURE__ */ jsx("option", { value: "P", children: "Female" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsx(ChevronRight, { className: "absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none rotate-90" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 mb-1.5 ml-1", children: "Age" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "number",
                        value: data.age,
                        onChange: (e) => setData("age", e.target.value),
                        className: "w-full px-4 py-2.5 md:py-3 rounded-lg border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs md:text-sm transition-all outline-none font-medium shadow-sm",
                        placeholder: "e.g. 25"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 md:gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 mb-1.5 ml-1", children: "Height (cm)" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "number",
                        step: "0.01",
                        value: data.height,
                        onChange: (e) => setData("height", e.target.value),
                        className: "w-full px-4 py-2.5 md:py-3 rounded-lg border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs md:text-sm transition-all outline-none font-medium shadow-sm",
                        placeholder: "e.g. 175"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 mb-1.5 ml-1", children: "Weight (kg)" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "number",
                        step: "0.01",
                        value: data.weight,
                        onChange: (e) => setData("weight", e.target.value),
                        className: "w-full px-4 py-2.5 md:py-3 rounded-lg border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs md:text-sm transition-all outline-none font-medium shadow-sm",
                        placeholder: "e.g. 70"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 mb-1.5 ml-1", children: "Masa Aktif Latihan (Opsional)" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "date",
                        value: data.training_exp_date,
                        onChange: (e) => setData("training_exp_date", e.target.value),
                        className: "w-full px-4 py-2.5 md:py-3 rounded-lg border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs md:text-sm transition-all outline-none font-medium shadow-sm"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 mb-1.5 ml-1", children: "Paket Latihan (Opsional)" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: data.subscription_package_id,
                      onChange: (e) => setData("subscription_package_id", e.target.value),
                      className: "w-full px-4 py-2.5 md:py-3 rounded-lg border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs md:text-sm transition-all outline-none font-medium shadow-sm",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "", children: "-- Tidak Ada / Kosongkan --" }),
                        packagesList?.map((pkg) => /* @__PURE__ */ jsxs("option", { value: pkg.id, children: [
                          pkg.name,
                          " (",
                          pkg.session_count,
                          " Sesi)"
                        ] }, pkg.id))
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-3 md:p-4 rounded-lg border border-slate-100 flex gap-2.5 md:gap-3 mt-4", children: [
                  /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4 text-slate-400 shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] md:text-xs text-slate-500 font-medium leading-relaxed", children: "Physical data is used for performance baselines and body composition algorithms." })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-5 md:p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 md:gap-3 sticky bottom-0 z-10", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setIsModalOpen(false),
                className: "px-5 py-2.5 text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-700 font-bold text-sm rounded-lg transition-colors touch-manipulation",
                children: "Batal"
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "submit",
                disabled: processing,
                className: "px-6 py-2.5 bg-orange-500 text-white font-bold text-sm rounded-lg shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation",
                children: [
                  processing && /* @__PURE__ */ jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }),
                  processing ? "Menyimpan..." : modalMode === "create" ? "Buat Akun" : "Simpan Perubahan"
                ]
              }
            )
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
