import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect, useMemo } from "react";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { usePage, router, Head } from "@inertiajs/react";
import { P as PageHeader } from "./PageHeader-BXFyVdi4.js";
import { P as PageFooter } from "./PageFooter-BbeHbnjC.js";
import { Search, X, SlidersHorizontal, ChevronDown, Check, Target, Activity, Scale, ArrowRight, Users } from "lucide-react";
import "axios";
function Index({
  athletes = [],
  summary = {},
  sports = [],
  filters = {}
}) {
  const { auth } = usePage().props;
  auth?.user?.role === "coach";
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [selectedSport, setSelectedSport] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [trainingTypeFilter, setTrainingTypeFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("name_asc");
  const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      router.get(
        route("admin.athletes.index"),
        { search: searchTerm },
        { preserveState: true, preserveScroll: true, replace: true }
      );
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  const handleCardClick = (athleteId) => {
    router.visit(route("admin.athletes.show", athleteId));
  };
  const calculateBMI = (height, weight) => {
    if (!height || !weight) return null;
    const heightInMeters = height / 100;
    const bmiValue = weight / (heightInMeters * heightInMeters);
    return bmiValue.toFixed(1);
  };
  const getBMIStatus = (bmi) => {
    if (!bmi) return { label: "—", color: "text-slate-400 bg-slate-50 border-slate-200/60" };
    if (bmi < 18.5) return { label: "Underweight", color: "text-amber-700 bg-amber-50 border-amber-200/80" };
    if (bmi <= 24.9) return { label: "Ideal", color: "text-emerald-700 bg-emerald-50 border-emerald-200/80" };
    if (bmi <= 29.9) return { label: "Overweight", color: "text-orange-700 bg-orange-50 border-orange-200/80" };
    return { label: "Obese", color: "text-rose-700 bg-rose-50 border-rose-200/80" };
  };
  const processedAthletes = useMemo(() => {
    return athletes.filter((athlete) => {
      if (selectedSport !== "ALL" && athlete.sport_id !== parseInt(selectedSport)) {
        return false;
      }
      if (trainingTypeFilter === "GROUP" && (!athlete.groups || athlete.groups.length === 0)) {
        return false;
      }
      if (trainingTypeFilter === "PRIVATE" && athlete.groups && athlete.groups.length > 0) {
        return false;
      }
      if (statusFilter === "TESTED" && (athlete.latest_test_score === null || athlete.latest_test_score === void 0)) {
        return false;
      }
      if (statusFilter === "PHV" && !athlete.latest_phv) {
        return false;
      }
      if (statusFilter === "COMP" && !athlete.latest_composition) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "name_asc") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "name_desc") return (b.name || "").localeCompare(a.name || "");
      if (sortBy === "score_desc") return (b.latest_test_score || 0) - (a.latest_test_score || 0);
      if (sortBy === "age_asc") return (a.age || 99) - (b.age || 99);
      return 0;
    });
  }, [athletes, selectedSport, trainingTypeFilter, statusFilter, sortBy]);
  summary?.total || athletes.length;
  summary?.tested_count || 0;
  summary?.phv_count || 0;
  summary?.comp_count || 0;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSportDropdownOpen, setIsSportDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const filterRef = useRef(null);
  const sportDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
        setIsSportDropdownOpen(false);
        setIsSortDropdownOpen(false);
      } else {
        if (sportDropdownRef.current && !sportDropdownRef.current.contains(event.target)) {
          setIsSportDropdownOpen(false);
        }
        if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
          setIsSortDropdownOpen(false);
        }
      }
    };
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);
  const sortOptions = [
    { id: "name_asc", label: "Nama (A - Z)" },
    { id: "name_desc", label: "Nama (Z - A)" },
    { id: "score_desc", label: "Skor Fisik Tertinggi" },
    { id: "age_asc", label: "Usia Termuda" }
  ];
  const currentSportLabel = useMemo(() => {
    if (selectedSport === "ALL") return `Semua Cabor (${athletes.length})`;
    const found = sports.find((s) => s.id.toString() === selectedSport.toString());
    const count = athletes.filter((a) => a.sport_id === found?.id).length;
    return found ? `${found.name} (${count})` : "Pilih Cabor";
  }, [selectedSport, sports, athletes]);
  const currentSortLabel = sortOptions.find((o) => o.id === sortBy)?.label || "Nama (A - Z)";
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedSport !== "ALL") count++;
    if (trainingTypeFilter !== "ALL") count++;
    if (statusFilter !== "ALL") count++;
    if (sortBy !== "name_asc") count++;
    return count;
  }, [selectedSport, trainingTypeFilter, statusFilter, sortBy]);
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Profiling", children: [
    /* @__PURE__ */ jsx(Head, { title: "Profiling" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3 pb-2", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Profiling",
          description: "Evaluasi performa fisik, maturitas PHV, dan komposisi tubuh atlet.",
          actions: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 relative", ref: filterRef, children: [
            /* @__PURE__ */ jsxs("div", { className: "w-48 sm:w-64 relative", children: [
              /* @__PURE__ */ jsx(
                Search,
                {
                  size: 14,
                  className: "text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: searchTerm,
                  onChange: (e) => setSearchTerm(e.target.value),
                  placeholder: "Cari atlet...",
                  className: "w-full pl-8 pr-7 py-2 bg-white border border-slate-200/90 rounded-md text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-2xs"
                }
              ),
              searchTerm && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSearchTerm(""),
                  className: "absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded transition-colors",
                  children: /* @__PURE__ */ jsx(X, { size: 13 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setIsFilterOpen(!isFilterOpen),
                className: `inline-flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-bold transition-all shadow-2xs ${activeFilterCount > 0 ? "bg-gradient-to-br from-white via-white to-orange-50 text-orange-600 border-slate-200/90 shadow-xs" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90"}`,
                children: [
                  /* @__PURE__ */ jsx(SlidersHorizontal, { size: 13, className: activeFilterCount > 0 ? "text-orange-600" : "text-slate-500" }),
                  /* @__PURE__ */ jsx("span", { children: "Filter" }),
                  activeFilterCount > 0 && /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center", children: activeFilterCount })
                ]
              }
            ),
            isFilterOpen && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-full mt-2 w-80 sm:w-88 bg-white border border-slate-200/90 rounded-xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-slate-100 mb-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx(SlidersHorizontal, { size: 14, className: "text-orange-500" }),
                  /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-slate-800", children: "Filter & Pengurutan" })
                ] }),
                activeFilterCount > 0 && /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setSelectedSport("ALL");
                      setTrainingTypeFilter("ALL");
                      setStatusFilter("ALL");
                      setSortBy("name_asc");
                    },
                    className: "text-[11px] font-bold text-orange-600 hover:text-orange-700 transition-colors",
                    children: "Reset Filter"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3.5 text-xs", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5", children: "Cabang Olahraga" }),
                  /* @__PURE__ */ jsxs("div", { className: "relative", ref: sportDropdownRef, children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setIsSportDropdownOpen(!isSportDropdownOpen);
                          setIsSortDropdownOpen(false);
                        },
                        className: "w-full flex items-center justify-between bg-white border border-slate-200/90 text-slate-800 text-xs font-semibold rounded-md px-3 py-2 hover:bg-slate-50 transition-all cursor-pointer text-left shadow-2xs",
                        children: [
                          /* @__PURE__ */ jsx("span", { className: "truncate", children: currentSportLabel }),
                          /* @__PURE__ */ jsx(ChevronDown, { size: 13, className: `text-slate-400 shrink-0 ml-1.5 transition-transform duration-200 ${isSportDropdownOpen ? "rotate-180 text-orange-500" : ""}` })
                        ]
                      }
                    ),
                    isSportDropdownOpen && /* @__PURE__ */ jsxs("div", { className: "absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200/90 rounded-xl shadow-lg p-1 z-30 max-h-48 overflow-y-auto [scrollbar-width:thin] animate-in fade-in zoom-in-95 duration-100", children: [
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            setSelectedSport("ALL");
                            setIsSportDropdownOpen(false);
                          },
                          className: `w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between text-left transition-colors ${selectedSport === "ALL" ? "bg-orange-50 text-orange-600 font-bold" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"}`,
                          children: [
                            /* @__PURE__ */ jsx("span", { children: "Semua Cabor" }),
                            /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-slate-400 font-mono", children: [
                              "(",
                              athletes.length,
                              ")"
                            ] })
                          ]
                        }
                      ),
                      sports.map((sport) => {
                        const count = athletes.filter((a) => a.sport_id === sport.id).length;
                        const isSelected = selectedSport === sport.id.toString();
                        return /* @__PURE__ */ jsxs(
                          "button",
                          {
                            type: "button",
                            onClick: () => {
                              setSelectedSport(sport.id.toString());
                              setIsSportDropdownOpen(false);
                            },
                            className: `w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between text-left transition-colors ${isSelected ? "bg-orange-50 text-orange-600 font-bold" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"}`,
                            children: [
                              /* @__PURE__ */ jsx("span", { className: "truncate", children: sport.name }),
                              /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-slate-400 font-mono ml-2 shrink-0", children: [
                                "(",
                                count,
                                ")"
                              ] })
                            ]
                          },
                          sport.id
                        );
                      })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5", children: "Tipe Latihan / Kelas" }),
                  /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-1.5", children: [
                    { id: "ALL", label: "Semua" },
                    { id: "PRIVATE", label: "Privat" },
                    { id: "GROUP", label: "Grup Latihan" }
                  ].map((item) => /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setTrainingTypeFilter(item.id),
                      className: `px-2 py-1.5 rounded-md text-[11px] font-bold text-center border transition-all ${trainingTypeFilter === item.id ? "bg-gradient-to-br from-white via-white to-orange-50/90 text-orange-600 border-slate-200/90 shadow-xs" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80"}`,
                      children: item.label
                    },
                    item.id
                  )) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5", children: "Kelengkapan Data" }),
                  /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-1.5", children: [
                    { id: "ALL", label: "Semua" },
                    { id: "TESTED", label: "Skor Tes Fisik" },
                    { id: "PHV", label: "Asesmen PHV" },
                    { id: "COMP", label: "Komposisi Tubuh" }
                  ].map((item) => /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setStatusFilter(item.id),
                      className: `px-2.5 py-1.5 rounded-md text-[11px] font-bold text-center border transition-all ${statusFilter === item.id ? "bg-gradient-to-br from-white via-white to-orange-50/90 text-orange-600 border-slate-200/90 shadow-xs" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80"}`,
                      children: item.label
                    },
                    item.id
                  )) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5", children: "Urutkan Berdasarkan" }),
                  /* @__PURE__ */ jsxs("div", { className: "relative", ref: sortDropdownRef, children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setIsSortDropdownOpen(!isSortDropdownOpen);
                          setIsSportDropdownOpen(false);
                        },
                        className: "w-full flex items-center justify-between bg-white border border-slate-200/90 text-slate-800 text-xs font-semibold rounded-md px-3 py-2 hover:bg-slate-50 transition-all cursor-pointer text-left shadow-2xs",
                        children: [
                          /* @__PURE__ */ jsx("span", { className: "truncate", children: currentSortLabel }),
                          /* @__PURE__ */ jsx(ChevronDown, { size: 13, className: `text-slate-400 shrink-0 ml-1.5 transition-transform duration-200 ${isSortDropdownOpen ? "rotate-180 text-orange-500" : ""}` })
                        ]
                      }
                    ),
                    isSortDropdownOpen && /* @__PURE__ */ jsx("div", { className: "absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200/90 rounded-xl shadow-lg p-1 z-30 animate-in fade-in zoom-in-95 duration-100", children: sortOptions.map((opt) => {
                      const isSelected = sortBy === opt.id;
                      return /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            setSortBy(opt.id);
                            setIsSortDropdownOpen(false);
                          },
                          className: `w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between text-left transition-colors ${isSelected ? "bg-orange-50 text-orange-600 font-bold" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"}`,
                          children: [
                            /* @__PURE__ */ jsx("span", { children: opt.label }),
                            isSelected && /* @__PURE__ */ jsx(Check, { size: 12, className: "text-orange-500" })
                          ]
                        },
                        opt.id
                      );
                    }) })
                  ] })
                ] })
              ] })
            ] })
          ] })
        }
      ),
      processedAthletes.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-3.5 animate-in fade-in duration-300", children: processedAthletes.map((athlete) => {
        athlete.gender === "P" || athlete.gender === "female" || athlete.gender === "Perempuan";
        const initial = athlete.name ? athlete.name.charAt(0).toUpperCase() : "-";
        const hasPHV = !!athlete.latest_phv;
        const hasComp = !!athlete.latest_composition;
        !!athlete.latest_wellness;
        const hasScore = athlete.latest_test_score !== null && athlete.latest_test_score !== void 0;
        const bmi = calculateBMI(athlete.height, athlete.weight);
        const bmiStatus = getBMIStatus(bmi);
        const hasGroups = athlete.groups && athlete.groups.length > 0;
        const membershipLabel = hasGroups ? athlete.groups.length > 1 ? `${athlete.groups.length} Grup` : athlete.groups[0].name : athlete.package?.name || "Privat";
        const fullMembershipTitle = hasGroups ? `Grup: ${athlete.groups.map((g) => g.name).join(", ")}` : athlete.package?.name ? `Paket: ${athlete.package.name}` : "Sesi Privat";
        return /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => handleCardClick(athlete.id),
            className: "bg-white rounded-xl border border-slate-200/80 p-3.5 hover:border-orange-300 hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between group",
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5 mb-2.5", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-gradient-to-br from-white via-white to-orange-50/90 text-orange-600 border border-slate-200/90 shadow-2xs flex items-center justify-center text-sm font-black shrink-0 overflow-hidden mt-0.5", children: athlete.profile_photo_url ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: athlete.profile_photo_url,
                      alt: athlete.name,
                      className: "w-full h-full object-cover"
                    }
                  ) : initial }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 text-xs truncate leading-snug group-hover:text-orange-600 transition-colors", children: athlete.name }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-[10px] truncate mt-0.5", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-semibold text-orange-600 truncate", children: athlete.sport?.name || "Tanpa Cabor" }),
                      /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "•" }),
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          title: fullMembershipTitle,
                          className: `truncate font-medium ${hasGroups ? "text-blue-600" : "text-slate-500"}`,
                          children: membershipLabel
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-slate-400 truncate mt-0.5", children: [
                      "@",
                      athlete.username || "athlete"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-1 text-center bg-slate-50/80 p-1.5 rounded-lg border border-slate-100 mb-2.5 text-[10px]", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase block", children: "Usia" }),
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800", children: athlete.age ? `${athlete.age} th` : "—" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "border-x border-slate-200/60", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase block", children: "TB/BB" }),
                    /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-800 truncate block", children: [
                      athlete.height ? athlete.height : "—",
                      "/",
                      athlete.weight ? athlete.weight : "—"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase block", children: "BMI" }),
                    /* @__PURE__ */ jsx("span", { className: `font-bold block truncate ${bmiStatus.color ? bmiStatus.color.split(" ")[0] : "text-slate-600"}`, children: bmi || "—" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1 mb-2 text-[11px]", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100", children: [
                    /* @__PURE__ */ jsxs("span", { className: "text-slate-600 font-semibold flex items-center gap-1 text-[10px]", children: [
                      /* @__PURE__ */ jsx(Target, { size: 11, className: "text-orange-500" }),
                      /* @__PURE__ */ jsx("span", { children: "Skor Fisik" })
                    ] }),
                    hasScore ? /* @__PURE__ */ jsxs("span", { className: "font-black text-[11px] text-orange-600", children: [
                      athlete.latest_test_score,
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "text-[9px] font-medium text-slate-500", children: "pts" })
                    ] }) : /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 italic", children: "Belum tes" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100", children: [
                    /* @__PURE__ */ jsxs("span", { className: "text-slate-600 font-semibold flex items-center gap-1 text-[10px]", children: [
                      /* @__PURE__ */ jsx(Activity, { size: 11, className: "text-emerald-500" }),
                      /* @__PURE__ */ jsx("span", { children: "PHV" })
                    ] }),
                    hasPHV ? /* @__PURE__ */ jsxs("span", { className: "font-bold text-[10px] text-emerald-700 truncate", children: [
                      athlete.latest_phv.phv_status || "Circa",
                      " (",
                      Number(athlete.latest_phv.maturity_offset).toFixed(1),
                      ")"
                    ] }) : /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 italic", children: "Belum diukur" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100", children: [
                    /* @__PURE__ */ jsxs("span", { className: "text-slate-600 font-semibold flex items-center gap-1 text-[10px]", children: [
                      /* @__PURE__ */ jsx(Scale, { size: 11, className: "text-purple-500" }),
                      /* @__PURE__ */ jsx("span", { children: "Lemak Tubuh" })
                    ] }),
                    hasComp && athlete.latest_composition.body_fat_percentage !== null ? /* @__PURE__ */ jsxs("span", { className: "font-bold text-[10px] text-purple-700", children: [
                      athlete.latest_composition.body_fat_percentage,
                      "% BF"
                    ] }) : /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 italic", children: "Belum ada" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-orange-600 group-hover:text-orange-700 transition-colors", children: [
                /* @__PURE__ */ jsx("span", { children: "Lihat Profiling" }),
                /* @__PURE__ */ jsx(ArrowRight, { size: 12, className: "group-hover:translate-x-0.5 transition-transform" })
              ] })
            ]
          },
          athlete.id
        );
      }) }) : (
        /* Empty State */
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-12 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col items-center justify-center text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-3 border border-slate-200/80 shadow-2xs", children: /* @__PURE__ */ jsx(Users, { className: "w-8 h-8 text-slate-300" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-800 mb-1", children: "Tidak Ada Atlet Ditemukan" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "Tidak ada data atlet yang cocok dengan kata kunci pencarian atau filter yang dipilih." }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setSearchTerm("");
                setSelectedSport("ALL");
                setStatusFilter("ALL");
              },
              className: "mt-4 px-3.5 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-all shadow-2xs",
              children: "Reset Semua Filter"
            }
          )
        ] })
      ),
      /* @__PURE__ */ jsx(PageFooter, { className: "!mt-1 !py-2" })
    ] })
  ] });
}
export {
  Index as default
};
