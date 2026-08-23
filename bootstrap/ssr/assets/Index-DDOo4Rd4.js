import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { usePage, router, Head, Link } from "@inertiajs/react";
import { P as PageHeader } from "./PageHeader-BXFyVdi4.js";
import { P as PageFooter } from "./PageFooter-BbeHbnjC.js";
import { Search, X, Filter, ChevronDown, Trash2, Edit3, ArrowUpRight } from "lucide-react";
import "axios";
function Index({ tests = [], sports = [], filters = {} }) {
  const { auth } = usePage().props;
  const isAthlete = auth.user.role === "athlete";
  const [search, setSearch] = useState(filters?.search || "");
  const [selectedSport, setSelectedSport] = useState(filters?.sport_id || "");
  const [selectedMonth, setSelectedMonth] = useState(filters?.month || "");
  const [startDate, setStartDate] = useState(filters?.start_date || "");
  const [endDate, setEndDate] = useState(filters?.end_date || "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    testId: null,
    athleteName: "",
    isLoading: false
  });
  useEffect(() => {
    if (isAthlete) return;
    const timer = setTimeout(() => {
      router.get(
        route("admin.performance.index"),
        {
          search,
          sport_id: selectedSport,
          month: selectedMonth,
          start_date: startDate,
          end_date: endDate
        },
        { preserveState: true, preserveScroll: true, replace: true }
      );
    }, 350);
    return () => clearTimeout(timer);
  }, [search, selectedSport, selectedMonth, startDate, endDate, isAthlete]);
  const resetFilters = () => {
    setSearch("");
    setSelectedSport("");
    setSelectedMonth("");
    setStartDate("");
    setEndDate("");
  };
  const activeFilterCount = [
    selectedSport ? 1 : 0,
    selectedMonth ? 1 : 0,
    startDate || endDate ? 1 : 0
  ].reduce((a, b) => a + b, 0);
  const getPerformanceStatus = (val) => {
    const score = parseFloat(val);
    if (score >= 90)
      return {
        label: "Sangat Baik",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        bar: "bg-emerald-500"
      };
    if (score >= 80)
      return {
        label: "Baik",
        badge: "bg-teal-50 text-teal-700 border-teal-200/80",
        bar: "bg-teal-500"
      };
    if (score >= 70)
      return {
        label: "Cukup",
        badge: "bg-amber-50 text-amber-700 border-amber-200/80",
        bar: "bg-amber-500"
      };
    if (score >= 60)
      return {
        label: "Kurang",
        badge: "bg-orange-50 text-orange-700 border-orange-200/80",
        bar: "bg-orange-500"
      };
    return {
      label: "Sangat Kurang",
      badge: "bg-rose-50 text-rose-700 border-rose-200/80",
      bar: "bg-rose-500"
    };
  };
  const openDeleteModal = (id, name) => {
    setConfirmModal({
      isOpen: true,
      testId: id,
      athleteName: name || "Atlet",
      isLoading: false
    });
  };
  const closeDeleteModal = () => {
    setConfirmModal({
      isOpen: false,
      testId: null,
      athleteName: "",
      isLoading: false
    });
  };
  const executeDelete = () => {
    if (!confirmModal.testId) return;
    setConfirmModal((prev) => ({ ...prev, isLoading: true }));
    router.delete(route("admin.performance.destroy", confirmModal.testId), {
      onSuccess: () => closeDeleteModal(),
      onFinish: () => setConfirmModal((prev) => ({ ...prev, isLoading: false }))
    });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Tes Fisik", children: [
    /* @__PURE__ */ jsx(Head, { title: "Tes Fisik" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Tes Fisik",
          description: "Kelola dan pantau hasil asesmen performa fisik atlet.",
          actions: !isAthlete && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2.5", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative min-w-[180px] sm:w-56", children: [
              /* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  placeholder: "Cari nama atlet...",
                  className: "w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-2xs"
                }
              ),
              search && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setSearch(""),
                  className: "absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600",
                  children: /* @__PURE__ */ jsx(X, { className: "w-3 h-3" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              isFilterOpen && /* @__PURE__ */ jsx(
                "div",
                {
                  className: "fixed inset-0 z-20 cursor-default",
                  onClick: () => setIsFilterOpen(false)
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setIsFilterOpen(!isFilterOpen),
                  className: `flex items-center gap-1.5 px-3 py-1.5 bg-white border rounded-md text-xs font-semibold shadow-2xs transition-all ${activeFilterCount > 0 ? "border-orange-300 text-orange-600 bg-orange-50/30" : "border-slate-200 hover:border-slate-300 text-slate-700"}`,
                  children: [
                    /* @__PURE__ */ jsx(
                      Filter,
                      {
                        className: `w-3.5 h-3.5 ${activeFilterCount > 0 ? "text-orange-500" : "text-slate-400"}`
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { children: "Filter" }),
                    activeFilterCount > 0 && /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold flex items-center justify-center", children: activeFilterCount }),
                    /* @__PURE__ */ jsx(
                      ChevronDown,
                      {
                        className: `w-3 h-3 text-slate-400 transition-transform ${isFilterOpen ? "rotate-180" : ""}`
                      }
                    )
                  ]
                }
              ),
              isFilterOpen && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-full mt-1.5 w-72 sm:w-80 bg-white rounded-lg shadow-xl border border-slate-200/80 p-4 z-30 animate-in fade-in zoom-in-95 duration-100 space-y-3.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 pb-2", children: [
                  /* @__PURE__ */ jsxs("h4", { className: "text-xs font-bold text-slate-900 flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx(Filter, { className: "w-3.5 h-3.5 text-orange-500" }),
                    "Filter Tes Fisik"
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    activeFilterCount > 0 && /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: resetFilters,
                        className: "text-[11px] font-semibold text-rose-600 hover:underline",
                        children: "Reset"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => setIsFilterOpen(
                          false
                        ),
                        className: "text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors",
                        title: "Tutup",
                        children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-slate-600", children: "Cabang Olahraga" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: selectedSport,
                      onChange: (e) => setSelectedSport(
                        e.target.value
                      ),
                      className: "w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "", children: "Semua Cabor" }),
                        sports.map((sport) => /* @__PURE__ */ jsx(
                          "option",
                          {
                            value: sport.id,
                            children: sport.name
                          },
                          sport.id
                        ))
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-slate-600", children: "Bulan" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "month",
                      value: selectedMonth,
                      onChange: (e) => {
                        setSelectedMonth(
                          e.target.value
                        );
                        setStartDate("");
                        setEndDate("");
                      },
                      className: "w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1 pt-1 border-t border-slate-100", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-slate-600", children: "Atau Rentang Tanggal" }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-medium block mb-0.5", children: "Dari:" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "date",
                          value: startDate,
                          onChange: (e) => {
                            setStartDate(
                              e.target.value
                            );
                            setSelectedMonth(
                              ""
                            );
                          },
                          className: "w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-medium text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-medium block mb-0.5", children: "Sampai:" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "date",
                          value: endDate,
                          onChange: (e) => {
                            setEndDate(
                              e.target.value
                            );
                            setSelectedMonth(
                              ""
                            );
                          },
                          className: "w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-medium text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                        }
                      )
                    ] })
                  ] })
                ] })
              ] })
            ] }),
            (search || activeFilterCount > 0) && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: resetFilters,
                className: "p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-md transition-colors border border-slate-200/60",
                title: "Atur Ulang Filter",
                children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
              }
            ),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("admin.performance.create"),
                className: "inline-flex items-center justify-center px-3.5 py-1.5 bg-gradient-to-r from-white via-white to-orange-50/70 hover:to-orange-100/80 text-orange-600 hover:text-orange-700 border border-slate-200 hover:border-slate-300 rounded-md text-xs font-bold transition-all shadow-2xs",
                children: "Input Tes Fisik"
              }
            )
          ] })
        }
      ),
      tests.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5", children: tests.map((test) => {
        const status = getPerformanceStatus(
          test.average_score
        );
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-gradient-to-br from-white via-white to-orange-50/30 rounded-lg border border-slate-200/80 shadow-2xs hover:border-orange-300/80 hover:shadow-xs transition-all flex flex-col justify-between overflow-hidden group",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "p-3.5 space-y-2.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `text-[9.5px] font-bold px-1.5 py-0.5 rounded border ${status.badge}`,
                      children: status.label
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "text-[10.5px] font-semibold text-slate-400", children: test.date })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-full bg-orange-100 text-orange-600 font-bold text-[10px] flex items-center justify-center shrink-0 overflow-hidden", children: test.athlete?.profile_photo ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: test.athlete.profile_photo_url || `/storage/${test.athlete.profile_photo}`,
                      alt: "",
                      className: "w-full h-full object-cover"
                    }
                  ) : (test.athlete?.name || "A").charAt(0).toUpperCase() }),
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-slate-900 truncate group-hover:text-orange-600 transition-colors", children: test.athlete?.name || "Unknown Athlete" }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 font-medium truncate", children: test.athlete?.sport?.name || "Umum" })
                  ] })
                ] }),
                test.name && /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "text-[10.5px] font-semibold text-slate-700 bg-white/90 px-2 py-1 rounded border border-slate-200/70 truncate flex items-center gap-1.5 shadow-2xs",
                    title: test.name,
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "text-slate-400 font-medium shrink-0", children: "Sesi:" }),
                      /* @__PURE__ */ jsx("span", { className: "truncate font-bold text-slate-800", children: test.name })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-md p-2.5 border border-slate-200/70 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider block", children: "Skor Performa" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1 mt-0.5", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-xl font-black text-slate-900", children: test.average_score }),
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold text-slate-400", children: "/ 100" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider block", children: "Target" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-slate-700 mt-0.5 block", children: "100 Pts" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 pt-0.5", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-[9.5px] font-bold text-slate-400 uppercase tracking-wider", children: "Rincian Kategori" }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                    Object.entries(
                      test.category_scores || {}
                    ).slice(0, 3).map(
                      ([category, score]) => {
                        const catStatus = getPerformanceStatus(
                          score
                        );
                        return /* @__PURE__ */ jsxs(
                          "div",
                          {
                            className: "space-y-0.5",
                            children: [
                              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[10px]", children: [
                                /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-600 truncate pr-1", children: category }),
                                /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800", children: score })
                              ] }),
                              /* @__PURE__ */ jsx("div", { className: "w-full h-1 bg-slate-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                                "div",
                                {
                                  className: `h-full rounded-full transition-all duration-500 ${catStatus.bar}`,
                                  style: {
                                    width: `${score}%`
                                  }
                                }
                              ) })
                            ]
                          },
                          category
                        );
                      }
                    ),
                    Object.keys(
                      test.category_scores || {}
                    ).length > 3 && /* @__PURE__ */ jsxs("p", { className: "text-[9.5px] text-center text-slate-400 font-medium pt-0.5", children: [
                      "+",
                      Object.keys(
                        test.category_scores
                      ).length - 3,
                      " ",
                      "kategori lainnya"
                    ] }),
                    Object.keys(
                      test.category_scores || {}
                    ).length === 0 && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 italic text-center py-1", children: "Rincian belum tersedia." })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "border-t border-slate-100 bg-white/60 p-1.5 flex items-center gap-1", children: !isAthlete ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => openDeleteModal(
                      test.id,
                      test.athlete?.name
                    ),
                    className: "p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors",
                    title: "Hapus Data Tes",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route(
                      "admin.performance.edit",
                      test.id
                    ),
                    className: "p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors",
                    title: "Edit Data Nilai",
                    children: /* @__PURE__ */ jsx(Edit3, { className: "w-3 h-3" })
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route(
                      "admin.performance.show",
                      test.id
                    ),
                    className: "flex-1 py-1 bg-gradient-to-r from-white via-white to-orange-50/70 hover:to-orange-100/80 text-orange-600 hover:text-orange-700 border border-slate-200 hover:border-slate-300 rounded text-[11px] font-bold flex items-center justify-center gap-0.5 transition-all shadow-2xs",
                    children: [
                      "Detail",
                      /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3 h-3" })
                    ]
                  }
                )
              ] }) : /* @__PURE__ */ jsxs(
                Link,
                {
                  href: route(
                    "admin.performance.show",
                    test.id
                  ),
                  className: "w-full py-1 bg-gradient-to-r from-white via-white to-orange-50/70 hover:to-orange-100/80 text-orange-600 hover:text-orange-700 border border-slate-200 hover:border-slate-300 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-all shadow-2xs",
                  children: [
                    "Lihat Analisis",
                    /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3 h-3" })
                  ]
                }
              ) })
            ]
          },
          test.id
        );
      }) }) : (
        /* Empty State */
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-dashed border-slate-300 p-12 text-center space-y-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsx(Search, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-800", children: isAthlete ? "Belum Ada Data Tes Fisik" : "Data Tes Fisik Tidak Ditemukan" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 max-w-sm mx-auto", children: isAthlete ? "Anda belum memiliki riwayat tes fisik yang tercatat." : "Tidak ada hasil tes fisik yang cocok dengan kata kunci pencarian atau filter yang dipilih." }),
          !isAthlete && (search || selectedSport) && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: resetFilters,
              className: "px-4 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-md font-bold text-xs hover:bg-slate-50 transition-colors shadow-2xs",
              children: "Atur Ulang Filter"
            }
          )
        ] })
      ),
      /* @__PURE__ */ jsx(PageFooter, { className: "!mt-6 !pt-4 !pb-1" })
    ] }),
    confirmModal.isOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-slate-200/80 shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-white via-rose-50/30 to-white", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xs sm:text-[13px] font-bold text-slate-900", children: "Hapus Riwayat Tes Fisik" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: closeDeleteModal,
            className: "text-slate-400 hover:text-slate-600 transition-colors",
            children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-3", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-600 leading-relaxed", children: [
          "Apakah Anda yakin ingin menghapus data tes fisik untuk atlet",
          " ",
          /* @__PURE__ */ jsxs("strong", { className: "text-slate-800", children: [
            '"',
            confirmModal.athleteName,
            '"'
          ] }),
          "? Tindakan ini tidak dapat dibatalkan."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-2 border-t border-slate-100", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: closeDeleteModal,
              className: "flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-md font-bold text-xs hover:bg-slate-50 transition-colors shadow-2xs",
              children: "Batal"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: executeDelete,
              disabled: confirmModal.isLoading,
              className: "flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-bold text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5",
              children: confirmModal.isLoading ? "Menghapus..." : "Hapus Data"
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
