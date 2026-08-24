import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { useForm, router, Head } from "@inertiajs/react";
import { Search, Plus, Shield, Edit3, Trash2, UserCog, X, Camera, UploadCloud, User, Lock } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import "axios";
function Index({ admins, filters }) {
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
    role: "coach",
    _method: "POST"
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      router.get(route("manage-admins.index"), { search }, { preserveState: true, replace: true });
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
      role: "coach",
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
      _method: "PUT"
    });
    setIsModalOpen(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "create") {
      post(route("manage-admins.store"), {
        forceFormData: true,
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        }
      });
    } else {
      post(route("manage-admins.update", editUser.id), {
        forceFormData: true,
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        }
      });
    }
  };
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this admin account?")) {
      router.delete(route("manage-admins.destroy", id));
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Admin Management", children: [
    /* @__PURE__ */ jsx(Head, { title: "Admin Management" }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[1400px] mx-auto pb-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 md:p-8 rounded-xl border border-slate-200 shadow-sm mb-6 md:mb-8 relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6 w-full", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none" }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 w-full lg:w-auto", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[9px] md:text-[10px] font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full mb-2 md:mb-3 inline-block", children: "System & Security" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2", children: "Admin Management" }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 font-medium mt-1 text-xs md:text-sm", children: "Kelola akun dengan hak akses administratif dan akses sistem.." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-full sm:w-72 shrink-0", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-3.5 top-3 w-4 h-4 text-slate-400" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Search by name or ID...",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: "w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none shadow-sm touch-manipulation"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: openCreateModal,
              className: "w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-500 text-white px-5 py-2.5 md:py-3 rounded-lg font-bold text-xs md:text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95 touch-manipulation shrink-0",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 md:w-5 md:h-5" }),
                " Add Admin"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "md:hidden flex flex-col gap-3", children: admins.data.length > 0 ? admins.data.map((user) => /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-16 h-16 bg-orange-500 blur-2xl opacity-5 rounded-full pointer-events-none" }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start mb-3", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-bold bg-orange-50 text-orange-500 border border-orange-100", children: [
          /* @__PURE__ */ jsx(Shield, { className: "w-3 h-3" }),
          " Administrator"
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center font-bold text-lg border border-orange-100 shadow-sm overflow-hidden", children: user.profile_photo_url ? /* @__PURE__ */ jsx("img", { src: user.profile_photo_url, alt: user.name, className: "w-full h-full object-cover" }) : user.name.substring(0, 2).toUpperCase() }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-w-0", children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800 text-base truncate", children: user.name }),
            /* @__PURE__ */ jsxs("span", { className: "font-mono text-slate-500 text-[10px] truncate", children: [
              "ID: ",
              user.username
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-3 border-t border-slate-100", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => openEditModal(user),
              className: "flex-1 py-2 text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 touch-manipulation",
              children: [
                /* @__PURE__ */ jsx(Edit3, { className: "w-3.5 h-3.5" }),
                " Edit"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleDelete(user.id),
              className: "flex-1 py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 touch-manipulation",
              children: [
                /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }),
                " Delete"
              ]
            }
          )
        ] })
      ] }, user.id)) : /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-xl p-8 text-center flex flex-col items-center justify-center", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 bg-slate-50 rounded-full mb-3", children: /* @__PURE__ */ jsx(Shield, { className: "w-6 h-6 text-slate-300" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-700", children: "No admin accounts found" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Try adjusting your search query." })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "hidden md:flex bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-col w-full", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto w-full custom-scrollbar", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[800px] text-left text-sm text-slate-600 whitespace-nowrap", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 w-[40%]", children: "Admin Profile" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 w-[25%]", children: "Login ID (Username)" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-center w-[20%]", children: "Role Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right w-[15%]", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100 bg-white", children: admins.data.length > 0 ? admins.data.map((user) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50 transition-colors group", children: [
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 align-middle", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center font-bold text-sm border border-orange-100 shadow-sm overflow-hidden", children: user.profile_photo_url ? /* @__PURE__ */ jsx("img", { src: user.profile_photo_url, alt: user.name, className: "w-full h-full object-cover" }) : user.name.substring(0, 2).toUpperCase() }),
            /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800 text-sm group-hover:text-orange-500 transition-colors", children: user.name })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 align-middle font-mono text-slate-500 text-xs font-medium", children: user.username }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 align-middle text-center", children: /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border ${user.role === "superadmin" ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`, children: [
            /* @__PURE__ */ jsx(Shield, { className: "w-3 h-3" }),
            " ",
            user.role === "superadmin" ? "Superadmin" : "Coach"
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-6 py-4 align-middle text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => openEditModal(user),
                className: "p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors",
                title: "Edit Admin",
                children: /* @__PURE__ */ jsx(Edit3, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDelete(user.id),
                className: "p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors",
                title: "Delete Admin",
                children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
              }
            )
          ] }) })
        ] }, user.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "4", className: "px-6 py-20 text-center text-slate-400", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsx("div", { className: "p-4 bg-slate-50 rounded-full mb-3", children: /* @__PURE__ */ jsx(Shield, { className: "w-8 h-8 text-slate-300" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-700", children: "No admin accounts found" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-1 font-medium", children: "Try adjusting your search query." })
        ] }) }) }) })
      ] }) }) })
    ] }),
    isModalOpen && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity", onClick: () => setIsModalOpen(false) }),
      /* @__PURE__ */ jsxs("div", { className: "relative bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h3", { className: "font-bold text-base md:text-lg text-slate-800 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(UserCog, { className: "w-4 h-4 md:w-5 md:h-5 text-orange-500" }),
              modalMode === "create" ? "Add New Admin" : "Edit Admin"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] md:text-xs text-slate-500 font-medium mt-0.5", children: modalMode === "create" ? "Create a new administrative account." : "Update administrator details." })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setIsModalOpen(false), className: "text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-lg hover:bg-rose-50 touch-manipulation", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4 md:w-5 md:h-5" }) })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-5 md:p-6 space-y-4 md:space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center mb-2", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                onClick: () => fileInputRef.current?.click(),
                className: "relative w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50 hover:bg-orange-50/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group shadow-sm touch-manipulation",
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
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 mb-1.5", children: "Full Name" }),
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(User, { className: "h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  className: "block w-full pl-10 pr-4 py-3 md:py-2.5 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-medium text-slate-800 outline-none text-xs md:text-sm touch-manipulation",
                  value: data.name,
                  onChange: (e) => setData("name", e.target.value),
                  placeholder: "e.g. John Doe"
                }
              )
            ] }),
            errors.name && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-[10px] md:text-xs mt-1 font-bold", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 mb-1.5", children: "Login ID (Username)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "block w-full px-4 py-3 md:py-2.5 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-xs md:text-sm font-mono text-slate-800 outline-none font-medium disabled:opacity-60 touch-manipulation",
                value: data.username,
                onChange: (e) => setData("username", e.target.value),
                placeholder: "e.g. admin_01",
                disabled: modalMode === "edit"
              }
            ),
            errors.username && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-[10px] md:text-xs mt-1 font-bold", children: errors.username })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-[10px] font-bold text-slate-500 mb-1.5 flex justify-between items-end", children: [
              "Password",
              modalMode === "edit" && /* @__PURE__ */ jsx("span", { className: "text-slate-400 font-medium normal-case tracking-normal text-[9px]", children: "(Kosongkan jika tidak diganti)" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  className: "block w-full pl-10 pr-4 py-3 md:py-2.5 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-medium text-slate-800 outline-none text-xs md:text-sm touch-manipulation",
                  value: data.password,
                  onChange: (e) => setData("password", e.target.value),
                  placeholder: "••••••••"
                }
              )
            ] }),
            errors.password && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-[10px] md:text-xs mt-1 font-bold", children: errors.password })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-500 mb-1.5", children: "Role / Jabatan" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "block w-full px-4 py-3 md:py-2.5 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-medium text-slate-800 outline-none text-xs md:text-sm",
                value: data.role,
                onChange: (e) => setData("role", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "coach", children: "Coach (Pelatih)" }),
                  /* @__PURE__ */ jsx("option", { value: "superadmin", children: "Superadmin" })
                ]
              }
            ),
            errors.role && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-[10px] md:text-xs mt-1 font-bold", children: errors.role })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 md:gap-3 pt-4 md:pt-6 mt-2 md:mt-4 border-t border-slate-100", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setIsModalOpen(false),
                className: "flex-1 px-4 py-3 md:py-2.5 text-slate-500 bg-slate-100 hover:bg-slate-200 font-bold text-xs md:text-sm rounded-lg transition-colors touch-manipulation",
                children: "Batal"
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "submit",
                disabled: processing,
                className: "flex-[2] px-4 py-3 md:py-2.5 bg-orange-500 text-white font-bold text-xs md:text-sm rounded-lg shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation",
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
