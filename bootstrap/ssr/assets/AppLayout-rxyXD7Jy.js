import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useRef, useMemo, useEffect } from "react";
import { usePage, Link, useForm } from "@inertiajs/react";
import { Search, Menu, Home, ChevronRight, Loader2, ArrowRight, ChevronDown, Calendar, ClipboardList, Users, Flame, Shield, Settings, LogOut, User, X, Camera, UploadCloud, Lock, Save, ChevronLeft, LayoutDashboard, Target, CalendarDays, Building2, Timer, Scale, Calculator, Scan, UtensilsCrossed, HeartPulse, BatteryCharging, CalendarCheck, BarChart3, Trophy, Dumbbell, BookOpen, Package, UserCog, FileSpreadsheet } from "lucide-react";
import axios from "axios";
function Navbar({ onMobileMenuClick }) {
  const { auth, url } = usePage().props;
  const pageUrl = usePage().url;
  const user = auth.user;
  const isAthlete = user.role === "athlete";
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const quickActionRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileInputRef = useRef(null);
  const breadcrumbs = useMemo(() => {
    const pathSegments = pageUrl.split("?")[0].split("/").filter(Boolean);
    const segmentNames = {
      "dashboard": "Overview",
      "admin": "Admin",
      "athletes": "Profiling",
      "dpa": "Analysis DPA",
      "performance": "Tes Fisik",
      "composition": "Komposisi Tubuh",
      "phv-calculator": "Kalkulator PHV",
      "meal-plans": "Rencana Makan",
      "wellness-rpe": "Wellness & Beban",
      "recovery-strategies": "Recovery Strategi",
      "daily-metrics": "Pantauan Harian",
      "load-analysis": "Analisis Beban",
      "sports": "Kategori Olahraga",
      "exercises": "Master Exercise",
      "dpa-compensations": "DPA Compensations",
      "packages": "Manajemen Paket",
      "users": "Manajemen Pengguna",
      "reports": "Laporan",
      "sessions": "Rekap Sesi",
      "settings": "Pengaturan Sistem",
      "profiling": "Profil Fisik",
      "gym-attendance": "Absensi Gym",
      "individual-trainings": "Program Latihan",
      "group-trainings": "Latihan Grup",
      "create": "Tambah Baru",
      "edit": "Edit Data"
    };
    if (pathSegments.length === 0 || pathSegments.length === 1 && pathSegments[0] === "dashboard") {
      return [
        { name: "Dashboard", route: "/dashboard", isCurrent: false },
        { name: "Overview", route: null, isCurrent: true }
      ];
    }
    const isUnderAdmin = pathSegments.includes("admin");
    const items = [{ name: "Dashboard", route: "/dashboard", isCurrent: false }];
    let accumulatedPath = isUnderAdmin ? "/admin" : "";
    pathSegments.forEach((segment, idx) => {
      if (segment === "admin" || segment === "dashboard") return;
      accumulatedPath += `/${segment}`;
      const isLast = idx === pathSegments.length - 1;
      const label = segmentNames[segment] || (!isNaN(segment) ? "Detail" : segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " "));
      items.push({
        name: label,
        route: isLast ? null : accumulatedPath,
        isCurrent: isLast
      });
    });
    return items;
  }, [pageUrl]);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (keyword.length > 1) {
        performSearch(keyword);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);
  const performSearch = async (query) => {
    setIsLoading(true);
    try {
      const response = await axios.get(route("global.search"), {
        params: { query }
      });
      setResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (quickActionRef.current && !quickActionRef.current.contains(event.target)) {
        setIsQuickActionOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef, quickActionRef, searchRef]);
  useEffect(() => {
    if (isMobileSearchOpen && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("nav", { className: "sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-16 items-center justify-between px-4 sm:px-6 lg:px-6 max-w-[1920px] mx-auto relative gap-4", children: isMobileSearchOpen ? /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 bg-white z-50 flex items-center px-4 gap-3 animate-in fade-in slide-in-from-top-1 duration-150", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 relative", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-slate-400" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: mobileInputRef,
              type: "text",
              value: keyword,
              onChange: (e) => setKeyword(e.target.value),
              className: "w-full pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-orange-500 text-xs outline-none transition-all",
              placeholder: "Cari atlet, data tes, jadwal..."
            }
          )
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          setIsMobileSearchOpen(false);
          setKeyword("");
        }, className: "p-2 text-slate-500 hover:text-slate-800 rounded-lg", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold", children: "Batal" }) })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 shrink-0", children: [
          /* @__PURE__ */ jsx("button", { onClick: onMobileMenuClick, className: "p-1.5 text-slate-500 hover:bg-slate-100 hover:text-orange-600 rounded-lg lg:hidden transition-all", children: /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxs("nav", { className: "flex items-center gap-1.5 text-xs", "aria-label": "Breadcrumb", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: "/dashboard",
                className: "text-slate-400 hover:text-slate-700 flex items-center gap-1 shrink-0 transition-colors p-1 rounded-md hover:bg-slate-50",
                title: "Dashboard",
                children: /* @__PURE__ */ jsx(Home, { className: "w-3.5 h-3.5" })
              }
            ),
            breadcrumbs.map((crumb, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
              idx > 0 && /* @__PURE__ */ jsx(ChevronRight, { className: "w-3 h-3 text-slate-300 shrink-0" }),
              crumb.isCurrent ? /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-900 text-xs", children: crumb.name }) : /* @__PURE__ */ jsx(
                Link,
                {
                  href: crumb.route || "#",
                  className: "text-slate-400 hover:text-slate-700 transition-colors text-xs font-medium",
                  children: crumb.name
                }
              )
            ] }, idx))
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hidden md:flex justify-center max-w-[420px] w-full mx-4", ref: searchRef, children: /* @__PURE__ */ jsxs("div", { className: "w-full relative group", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none", children: isLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 text-orange-500 animate-spin" }) : /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: searchInputRef,
              type: "text",
              value: keyword,
              onChange: (e) => setKeyword(e.target.value),
              onFocus: () => {
                if (results.length > 0) setShowResults(true);
              },
              placeholder: isAthlete ? "Cari fitur, jadwal, atau analisis..." : "Cari atlet, tes fisik, atau jadwal...",
              className: "block w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200/90 bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all font-medium text-xs shadow-2xs hover:bg-white"
            }
          ),
          showResults && /* @__PURE__ */ jsx("div", { className: "absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-100 z-50", children: results.length > 0 ? /* @__PURE__ */ jsxs("ul", { className: "py-1 divide-y divide-slate-50", children: [
            /* @__PURE__ */ jsx("li", { className: "px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50", children: "Hasil Pencarian" }),
            results.map((result) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { href: result.url, onClick: () => {
              setShowResults(false);
              setKeyword("");
            }, className: "flex items-center justify-between px-3.5 py-2.5 hover:bg-orange-50/60 transition-colors group", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                /* @__PURE__ */ jsx("div", { className: "h-7 w-7 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0", children: result.title.charAt(0) }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors truncate", children: result.title }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 font-medium truncate", children: result.subtitle })
                ] })
              ] }),
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5 text-slate-300 group-hover:text-orange-500 -translate-x-1 group-hover:translate-x-0 transition-all opacity-0 group-hover:opacity-100 shrink-0" })
            ] }) }, result.id))
          ] }) : /* @__PURE__ */ jsxs("div", { className: "p-4 text-center text-xs font-medium text-slate-500", children: [
            'Tidak ada hasil untuk "',
            keyword,
            '".'
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2.5 sm:gap-3 shrink-0", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setIsMobileSearchOpen(true), className: "md:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-all", children: /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }) }),
          !isAthlete && /* @__PURE__ */ jsxs("div", { className: "relative", ref: quickActionRef, children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setIsQuickActionOpen(!isQuickActionOpen),
                className: `hidden sm:inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold transition-all duration-150 active:scale-95 ${isQuickActionOpen ? "text-orange-600 font-bold" : "text-slate-700 hover:text-orange-600"}`,
                children: [
                  /* @__PURE__ */ jsx("span", { children: "Input Baru" }),
                  /* @__PURE__ */ jsx(ChevronDown, { size: 12, className: `transition-transform duration-150 opacity-70 ${isQuickActionOpen ? "rotate-180 opacity-100 text-orange-600" : ""}` })
                ]
              }
            ),
            isQuickActionOpen && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200/80 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right", children: [
              /* @__PURE__ */ jsx("div", { className: "px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: "Pintasan Aksi Cepat" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route("admin.individual-trainings.index"),
                    onClick: () => setIsQuickActionOpen(false),
                    className: "flex items-center gap-2.5 px-2.5 py-2 text-xs text-slate-700 hover:bg-orange-50/70 hover:text-orange-700 font-medium rounded-lg transition-colors group",
                    children: [
                      /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-orange-100 group-hover:text-orange-600 transition-all", children: /* @__PURE__ */ jsx(Calendar, { size: 13 }) }),
                      /* @__PURE__ */ jsx("span", { children: "Program Latihan" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route("admin.performance.index"),
                    onClick: () => setIsQuickActionOpen(false),
                    className: "flex items-center gap-2.5 px-2.5 py-2 text-xs text-slate-700 hover:bg-orange-50/70 hover:text-orange-700 font-medium rounded-lg transition-colors group",
                    children: [
                      /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-orange-100 group-hover:text-orange-600 transition-all", children: /* @__PURE__ */ jsx(ClipboardList, { size: 13 }) }),
                      /* @__PURE__ */ jsx("span", { children: "Tes Fisik" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route("admin.athletes.index"),
                    onClick: () => setIsQuickActionOpen(false),
                    className: "flex items-center gap-2.5 px-2.5 py-2 text-xs text-slate-700 hover:bg-orange-50/70 hover:text-orange-700 font-medium rounded-lg transition-colors group",
                    children: [
                      /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-orange-100 group-hover:text-orange-600 transition-all", children: /* @__PURE__ */ jsx(Users, { size: 13 }) }),
                      /* @__PURE__ */ jsx("span", { children: "Profil Atlet" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route("admin.meal-plans.index"),
                    onClick: () => setIsQuickActionOpen(false),
                    className: "flex items-center gap-2.5 px-2.5 py-2 text-xs text-slate-700 hover:bg-orange-50/70 hover:text-orange-700 font-medium rounded-lg transition-colors group",
                    children: [
                      /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-orange-100 group-hover:text-orange-600 transition-all", children: /* @__PURE__ */ jsx(Flame, { size: 13 }) }),
                      /* @__PURE__ */ jsx("span", { children: "Rencana Makan" })
                    ]
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", ref: dropdownRef, children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setIsDropdownOpen(!isDropdownOpen),
                className: `flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-full border transition-all duration-150 group ${isDropdownOpen ? "bg-slate-50 border-slate-300 shadow-2xs" : "bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-200"}`,
                children: [
                  /* @__PURE__ */ jsx("div", { className: "h-7 w-7 rounded-full overflow-hidden bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-xs font-bold shadow-xs", children: user.profile_photo_url ? /* @__PURE__ */ jsx("img", { src: user.profile_photo_url, alt: user.name, className: "w-full h-full object-cover" }) : user.name.charAt(0).toUpperCase() }),
                  /* @__PURE__ */ jsxs("div", { className: "hidden sm:block text-left mr-0.5", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]", children: user.name }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-medium text-slate-400 capitalize", children: user.role })
                  ] }),
                  /* @__PURE__ */ jsx(ChevronDown, { className: `w-3.5 h-3.5 text-slate-400 transition-transform duration-150 hidden sm:block ${isDropdownOpen ? "rotate-180 text-slate-700" : ""}` })
                ]
              }
            ),
            isDropdownOpen && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-slate-200/80 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right", children: [
              /* @__PURE__ */ jsxs("div", { className: "px-3.5 py-2 border-b border-slate-100 sm:hidden bg-slate-50/50 mb-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-800", children: user.name }),
                /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-semibold capitalize text-slate-500 flex items-center gap-1 mt-0.5", children: [
                  /* @__PURE__ */ jsx(Shield, { className: "w-3 h-3 text-orange-500" }),
                  " ",
                  user.role
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "px-1.5 space-y-0.5", children: /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => {
                    setIsEditModalOpen(true);
                    setIsDropdownOpen(false);
                  },
                  className: "w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-lg transition-colors group",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "p-1 rounded-md bg-slate-100 text-slate-500 group-hover:text-slate-800 transition-all", children: /* @__PURE__ */ jsx(Settings, { className: "w-3.5 h-3.5" }) }),
                    "Edit Profile"
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx("div", { className: "h-px bg-slate-100 my-1 mx-1.5" }),
              /* @__PURE__ */ jsx("div", { className: "px-1.5", children: /* @__PURE__ */ jsxs(Link, { href: route("logout"), method: "post", as: "button", className: "w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 font-medium rounded-lg transition-colors group", children: [
                /* @__PURE__ */ jsx("div", { className: "p-1 rounded-md bg-rose-50 text-rose-500 transition-all", children: /* @__PURE__ */ jsx(LogOut, { className: "w-3.5 h-3.5" }) }),
                "Keluar Sesi"
              ] }) })
            ] })
          ] })
        ] })
      ] }) }),
      isMobileSearchOpen && showResults && /* @__PURE__ */ jsx("div", { className: "absolute top-16 left-0 w-full bg-white shadow-xl border-t border-slate-100 max-h-[60vh] overflow-y-auto z-40 custom-scrollbar", children: results.length > 0 ? /* @__PURE__ */ jsx("ul", { className: "divide-y divide-slate-50", children: results.map((result) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { href: result.url, onClick: () => {
        setIsMobileSearchOpen(false);
        setKeyword("");
      }, className: "flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors", children: [
        /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shadow-xs shrink-0", children: result.title.charAt(0) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-800", children: result.title }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-medium text-slate-500", children: result.subtitle })
        ] })
      ] }) }, result.id)) }) : /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-slate-500 text-xs font-medium", children: "Tidak ada hasil ditemukan." }) })
    ] }),
    isEditModalOpen && /* @__PURE__ */ jsx(EditProfileModal, { user, isOpen: isEditModalOpen, onClose: () => setIsEditModalOpen(false) })
  ] });
}
function EditProfileModal({ user, isOpen, onClose }) {
  const [photoPreview, setPhotoPreview] = useState(user.profile_photo_url || null);
  const fileInputRef = useRef(null);
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    name: user.name || "",
    current_password: "",
    password: "",
    password_confirmation: "",
    profile_photo: null,
    _method: "PATCH"
  });
  useEffect(() => {
    if (isOpen) {
      reset();
      clearErrors();
      setData("name", user.name);
      setPhotoPreview(user.profile_photo_url || null);
    }
  }, [isOpen]);
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
  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("profile.update"), {
      forceFormData: true,
      onSuccess: () => {
        onClose();
        reset();
      },
      onError: (err) => console.log(err),
      preserveScroll: true
    });
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity", onClick: onClose }),
    /* @__PURE__ */ jsxs("div", { className: "relative bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80", children: [
        /* @__PURE__ */ jsxs("h3", { className: "font-bold text-base text-slate-800 flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsx("div", { className: "p-1.5 bg-white rounded-lg shadow-xs border border-slate-100 text-orange-500", children: /* @__PURE__ */ jsx(User, { className: "w-4 h-4" }) }),
          "Edit Profile"
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: onClose, className: "p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-5 custom-scrollbar max-h-[80vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center mb-4", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              onClick: () => fileInputRef.current?.click(),
              className: "relative w-20 h-20 rounded-full border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50 hover:bg-orange-50/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group shadow-2xs",
              children: photoPreview ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("img", { src: photoPreview, alt: "Preview", className: "w-full h-full object-cover" }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(Camera, { className: "w-5 h-5 text-white" }) })
              ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-slate-400 group-hover:text-orange-500", children: [
                /* @__PURE__ */ jsx(UploadCloud, { className: "w-5 h-5 mb-0.5" }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold", children: "Foto" })
              ] })
            }
          ),
          /* @__PURE__ */ jsx("input", { type: "file", ref: fileInputRef, onChange: handlePhotoChange, accept: "image/*", className: "hidden" }),
          errors.profile_photo && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs mt-1.5 font-bold", children: errors.profile_photo })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-slate-500 ml-1", children: "Nama Lengkap" }),
          /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(User, { className: "h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" }) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                className: "block w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-medium text-slate-800 text-xs outline-none shadow-2xs",
                placeholder: "Masukkan nama lengkap"
              }
            )
          ] }),
          errors.name && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs font-bold ml-1", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsx("div", { className: "h-px bg-slate-100 flex-1" }),
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-slate-400 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Lock, { className: "w-3 h-3" }),
              " Ganti Password"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-px bg-slate-100 flex-1" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2.5", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                value: data.current_password,
                onChange: (e) => setData("current_password", e.target.value),
                className: `block w-full px-3.5 py-2 rounded-lg border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 transition-all text-xs outline-none shadow-2xs font-medium ${errors.current_password ? "border-rose-300" : "border-slate-200 focus:border-orange-500"}`,
                placeholder: "Password Sekarang (Wajib jika ubah)"
              }
            ),
            errors.current_password && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs font-bold ml-1", children: errors.current_password }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2.5", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  value: data.password,
                  onChange: (e) => setData("password", e.target.value),
                  className: "block w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-xs outline-none shadow-2xs font-medium",
                  placeholder: "Password Baru"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  value: data.password_confirmation,
                  onChange: (e) => setData("password_confirmation", e.target.value),
                  className: "block w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-xs outline-none shadow-2xs font-medium",
                  placeholder: "Konfirmasi Password"
                }
              )
            ] }),
            errors.password && /* @__PURE__ */ jsx("p", { className: "text-rose-500 text-xs font-bold ml-1", children: errors.password })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2.5 pt-4 border-t border-slate-100", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "flex-1 px-4 py-2 text-slate-600 font-semibold text-xs hover:bg-slate-100 rounded-lg transition-colors",
              children: "Batal"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "flex-[2] bg-orange-500 text-white font-semibold text-xs rounded-lg shadow-xs hover:bg-orange-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 py-2",
              children: [
                processing ? /* @__PURE__ */ jsx("span", { className: "w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-3.5 h-3.5" }),
                processing ? "Menyimpan..." : "Simpan Perubahan"
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function Sidebar({ isCollapsed, isMobileOpen, onMobileClose, onToggleCollapse }) {
  const { url, props } = usePage();
  const scrollContainerRef = useRef(null);
  const [tooltip, setTooltip] = useState({ show: false, text: "", top: 0, left: 0 });
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const savedScroll = sessionStorage.getItem("sidebarScrollPos");
    if (savedScroll) {
      container.scrollTop = parseInt(savedScroll, 10);
    }
    const handleScroll = () => {
      sessionStorage.setItem("sidebarScrollPos", container.scrollTop.toString());
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);
  const userRole = props.auth.user.role;
  const appSettings = props.app_settings || {};
  const appName = appSettings?.name || "Olympus Training";
  const appLogo = appSettings?.logo;
  const isActive = (path) => {
    if (path === "/admin/athletes/dpa") {
      return url.startsWith("/admin/athletes/dpa") || url.startsWith("/admin/athletes/") && url.includes("/dpa");
    }
    if (path === "/admin/athletes") {
      return url.startsWith("/admin/athletes") && !url.includes("/dpa");
    }
    return url.startsWith(path);
  };
  const handleMouseEnter = (e, text) => {
    if (!isCollapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      show: true,
      text,
      top: rect.top + rect.height / 2,
      left: rect.right + 12
    });
  };
  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, show: false }));
  };
  const menuGroups = [
    {
      title: null,
      items: [
        { name: "Dashboard", route: "dashboard", checkPath: "/dashboard", icon: LayoutDashboard, roles: ["superadmin", "coach", "athlete"] },
        { name: "Profiling", route: "admin.athletes.index", checkPath: "/admin/athletes", icon: Users, roles: ["superadmin", "coach"] },
        { name: "Profil Fisik", route: "athlete.profiling", checkPath: "/profiling", icon: Target, roles: ["athlete"] },
        { name: "Program Latihan", route: "admin.individual-trainings.index", checkPath: "/admin/individual-trainings", icon: CalendarDays, roles: ["superadmin", "coach", "athlete"] },
        { name: "Absensi Gym", route: "admin.gym-attendance.index", checkPath: "/admin/gym-attendance", icon: Building2, roles: ["superadmin", "coach"], condition: () => userRole === "superadmin" || props.auth.user.is_gym_guard }
      ]
    },
    {
      title: "Tes & Evaluasi",
      items: [
        { name: "Tes Fisik", route: "admin.performance.index", checkPath: "/performance", icon: Timer, roles: ["superadmin", "coach", "athlete"] },
        { name: "Komposisi Tubuh", route: "admin.composition-tests.index", checkPath: "/admin/composition", icon: Scale, roles: ["superadmin", "coach", "athlete"] },
        { name: "Kalkulator PHV", route: "admin.phv-calculator.index", checkPath: "/admin/phv-calculator", icon: Calculator, roles: ["superadmin", "coach"] },
        { name: "Analysis DPA", route: "admin.athletes.dpa.index", checkPath: "/admin/athletes/dpa", icon: Scan, roles: ["superadmin", "coach", "athlete"] }
      ]
    },
    {
      title: "Nutrisi & Diet",
      items: [
        { name: "Rencana Makan", route: "admin.meal-plans.index", checkPath: "/admin/meal-plans", icon: UtensilsCrossed, roles: ["superadmin", "coach", "athlete"] }
      ]
    },
    {
      title: "Recovery Tracking",
      items: [
        { name: "Wellness & Beban", route: "admin.wellness-rpe.index", checkPath: "/admin/wellness-rpe", icon: HeartPulse, roles: ["superadmin", "coach", "athlete"] },
        { name: "Recovery Strategi", route: "admin.recovery-strategies.index", checkPath: "/admin/recovery-strategies", icon: BatteryCharging, roles: ["superadmin", "coach", "athlete"] },
        { name: "Pantauan Harian", route: "admin.daily-metrics.index", checkPath: "/admin/daily-metrics", icon: CalendarCheck, roles: ["superadmin", "coach", "athlete"] },
        { name: "Analisis Beban", route: "admin.load-analysis.index", checkPath: "/admin/load-analysis", icon: BarChart3, roles: ["superadmin", "coach", "athlete"] }
      ]
    },
    {
      title: "Master Data",
      items: [
        { name: "Kategori Olahraga", route: "admin.sports.index", checkPath: "/admin/sports", icon: Trophy, roles: ["superadmin", "coach"] },
        { name: "Master Exercise", route: "admin.exercises.index", checkPath: "/admin/exercises", icon: Dumbbell, roles: ["superadmin", "coach"] },
        { name: "DPA Compensations", route: "admin.dpa-compensations.index", checkPath: "/admin/dpa-compensations", icon: BookOpen, roles: ["superadmin", "coach"] },
        { name: "Manajemen Paket", route: "admin.packages.index", checkPath: "/admin/packages", icon: Package, roles: ["superadmin"] }
      ]
    },
    {
      title: "Pengaturan",
      items: [
        { name: userRole === "superadmin" ? "Manajemen Pengguna" : "Manajemen Klien", route: "admin.users.index", checkPath: "/admin/users", icon: UserCog, roles: ["superadmin", "coach"] },
        { name: "Rekap Sesi", route: "admin.reports.sessions", checkPath: "/admin/reports/sessions", icon: FileSpreadsheet, roles: ["superadmin"] },
        { name: "Pengaturan Sistem", route: "admin.settings.index", checkPath: "/admin/settings", icon: Settings, roles: ["superadmin"] }
      ]
    }
  ];
  const sidebarClasses = `
        fixed top-0 left-0 h-screen bg-white border-r border-slate-200/80 shadow-[1px_0_10px_rgba(0,0,0,0.02)]
        flex flex-col z-40 transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-[70px]" : "w-[235px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    `;
  return /* @__PURE__ */ jsxs("aside", { className: sidebarClasses, children: [
    /* @__PURE__ */ jsxs("div", { className: `h-16 flex items-center border-b border-slate-100 px-3.5 relative transition-all ${isCollapsed ? "justify-center" : "justify-start gap-2.5"}`, children: [
      appLogo ? /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("img", { src: appLogo, alt: "Logo", className: "w-8 h-8 object-contain" }) }) : /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-md flex items-center justify-center font-bold text-sm shadow-xs", children: appName.charAt(0) }),
      !isCollapsed && /* @__PURE__ */ jsxs("div", { className: "flex flex-col animate-in fade-in duration-300 truncate min-w-0 pr-3", children: [
        /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900 text-xs truncate leading-tight", children: appName }),
        /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-medium text-slate-400 capitalize", children: [
          userRole,
          " Hub"
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onToggleCollapse,
          className: "hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-orange-500 hover:border-orange-500 shadow-xs transition-colors z-50 group",
          title: isCollapsed ? "Buka Sidebar" : "Tutup Sidebar",
          children: isCollapsed ? /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5 group-hover:scale-110 transition-transform" }) : /* @__PURE__ */ jsx(ChevronLeft, { className: "w-3.5 h-3.5 group-hover:scale-110 transition-transform" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { ref: scrollContainerRef, className: "flex-1 overflow-y-auto overflow-x-hidden no-scrollbar py-3 px-2 space-y-3.5", onMouseLeave: handleMouseLeave, children: menuGroups.map((group, groupIdx) => {
      const filteredItems = group.items.filter((item) => {
        if (!item.roles.includes(userRole)) return false;
        if (item.condition && !item.condition()) return false;
        return true;
      });
      if (filteredItems.length === 0) return null;
      return /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
        group.title && !isCollapsed && /* @__PURE__ */ jsx("div", { className: "px-2.5 py-1 text-[10px] font-semibold text-slate-400 tracking-wider", children: group.title }),
        group.title && isCollapsed && /* @__PURE__ */ jsx("div", { className: "w-4 h-px bg-slate-100 mx-auto my-2" }),
        filteredItems.map((item, index) => {
          const active = isActive(item.checkPath);
          const Icon = item.icon;
          return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
            Link,
            {
              href: route(item.route),
              onMouseEnter: (e) => handleMouseEnter(e, item.name),
              onMouseLeave: handleMouseLeave,
              onClick: () => {
                if (window.innerWidth < 1024) onMobileClose();
              },
              className: `
                                                relative flex items-center rounded-md transition-all duration-150
                                                ${isCollapsed ? "justify-center p-2 mx-auto w-9 h-9" : "justify-start px-2.5 py-2 gap-2.5 w-full"}
                                                ${active ? "text-orange-600 font-semibold border border-orange-100/70 shadow-2xs bg-orange-20/80" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium"}
                                            `,
              children: [
                /* @__PURE__ */ jsx(Icon, { className: `flex-shrink-0 transition-all w-4 h-4 ${active ? "text-orange-500 stroke-[2.2]" : "text-slate-400 group-hover:text-slate-600 stroke-[1.8]"}` }),
                !isCollapsed && /* @__PURE__ */ jsx("span", { className: "truncate text-xs", children: item.name }),
                active && !isCollapsed && /* @__PURE__ */ jsx("div", { className: "ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" })
              ]
            }
          ) }, index);
        })
      ] }, groupIdx);
    }) }),
    /* @__PURE__ */ jsx("div", { className: "p-2 border-t border-slate-100", children: /* @__PURE__ */ jsxs(
      Link,
      {
        href: route("logout"),
        method: "post",
        as: "button",
        onMouseEnter: (e) => handleMouseEnter(e, "Keluar Sesi"),
        onMouseLeave: handleMouseLeave,
        className: `
                        flex items-center rounded-md transition-all duration-150 w-full
                        text-rose-500 hover:bg-rose-50/80 hover:text-rose-600 font-medium text-xs
                        ${isCollapsed ? "justify-center p-2 mx-auto w-9 h-9" : "justify-start px-2.5 py-2 gap-2.5"}
                    `,
        children: [
          /* @__PURE__ */ jsx(LogOut, { className: "flex-shrink-0 w-4 h-4" }),
          !isCollapsed && /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: "Keluar Sesi" })
        ]
      }
    ) }),
    tooltip.show && /* @__PURE__ */ jsxs(
      "div",
      {
        className: "fixed z-[100] px-2.5 py-1 bg-slate-900 text-white text-[11px] font-semibold rounded-md shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in duration-100",
        style: { top: tooltip.top, left: tooltip.left, transform: "translateY(-50%)" },
        children: [
          tooltip.text,
          /* @__PURE__ */ jsx("div", { className: "absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-slate-900 rotate-45 rounded-2xs" })
        ]
      }
    )
  ] });
}
function AppLayout({ children, title }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebarCollapsed") === "true";
    }
    return false;
  });
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isSidebarCollapsed);
  }, [isSidebarCollapsed]);
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen bg-white font-sans text-slate-900 overflow-hidden", children: [
    /* @__PURE__ */ jsx(
      Sidebar,
      {
        isCollapsed: isSidebarCollapsed,
        isMobileOpen: isMobileSidebarOpen,
        onMobileClose: () => setIsMobileSidebarOpen(false),
        onToggleCollapse: () => setIsSidebarCollapsed(!isSidebarCollapsed)
      }
    ),
    isMobileSidebarOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-slate-900/40 z-30 lg:hidden backdrop-blur-sm transition-opacity",
        onClick: () => setIsMobileSidebarOpen(false)
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `flex flex-col flex-1 min-w-0 min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? "lg:pl-[70px]" : "lg:pl-[235px]"}`,
        children: [
          /* @__PURE__ */ jsx(
            Navbar,
            {
              onMobileMenuClick: () => setIsMobileSidebarOpen(true)
            }
          ),
          /* @__PURE__ */ jsx("main", { className: "flex-1 min-w-0 overflow-y-auto overflow-x-hidden relative scroll-smooth custom-scrollbar", children: /* @__PURE__ */ jsx("div", { className: "w-full mx-auto p-4 md:p-8 lg:p-7 md:py-6 lg:py-3 animate-in fade-in duration-500", children }) })
        ]
      }
    )
  ] });
}
export {
  AppLayout as A
};
