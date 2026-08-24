import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { usePage, Head, Link } from "@inertiajs/react";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { P as PageHeader } from "./PageHeader-BXFyVdi4.js";
import { P as PageFooter } from "./PageFooter-BbeHbnjC.js";
import { Search, X, Filter, ChevronDown, Activity, Calendar, ArrowUpRight, Check } from "lucide-react";
import "axios";
function getInitials(name) {
  if (!name) return "A";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
function getMaturityBadge(status) {
  if (!status) return null;
  const s = status.toUpperCase();
  if (s.includes("PRE")) {
    return { label: "Pre-PHV", color: "text-sky-600" };
  }
  if (s.includes("CIRCA")) {
    return { label: "Circa-PHV", color: "text-orange-600" };
  }
  if (s.includes("POST")) {
    return { label: "Post-PHV", color: "text-emerald-600" };
  }
  return { label: status, color: "text-slate-600" };
}
function CustomSelect({
  label,
  value,
  options,
  onChange,
  placeholder = "Pilih..."
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value)
  );
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
          /* @__PURE__ */ jsx(
            ChevronDown,
            {
              className: `w-3.5 h-3.5 text-slate-400 shrink-0 ml-1.5 transition-transform ${isOpen ? "rotate-180 text-orange-500" : ""}`
            }
          )
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "fixed inset-0 z-40 cursor-default",
          onClick: () => setIsOpen(false)
        }
      ),
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
function Index({ athletes = [], sports = [] }) {
  const { auth } = usePage().props;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("name_asc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const sportOptions = useMemo(() => {
    const list = [{ value: "ALL", label: "Semua Cabor" }];
    if (sports && sports.length > 0) {
      sports.forEach((s) => list.push({ value: s.id, label: s.name }));
    }
    return list;
  }, [sports]);
  const statusOptions = [
    { value: "ALL", label: "Semua Status Kematangan" },
    { value: "PRE", label: "Pre-PHV (Pra-Pertumbuhan)" },
    { value: "CIRCA", label: "Circa-PHV (Puncak Lonjakan)" },
    { value: "POST", label: "Post-PHV (Pasca-Pertumbuhan)" },
    { value: "UNTESTED", label: "Belum Dievaluasi" }
  ];
  const sortOptions = [
    { value: "name_asc", label: "Nama (A - Z)" },
    { value: "name_desc", label: "Nama (Z - A)" },
    { value: "offset_asc", label: "Offset Terendah" },
    { value: "offset_desc", label: "Offset Tertinggi" },
    { value: "tests_desc", label: "Pengukuran Terbanyak" },
    { value: "latest_date", label: "Terakhir Diperbarui" }
  ];
  const getNormalizedStatus = (statusStr) => {
    if (!statusStr) return null;
    const s = statusStr.toUpperCase();
    if (s.includes("PRE")) return "PRE";
    if (s.includes("CIRCA")) return "CIRCA";
    if (s.includes("POST")) return "POST";
    return s;
  };
  const filteredAthletes = useMemo(() => {
    return athletes.filter((athlete) => {
      if (searchQuery && !athlete.name?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedSport !== "ALL" && String(athlete.sport_id || athlete.sport?.id) !== String(selectedSport)) {
        return false;
      }
      if (selectedStatus !== "ALL") {
        const latest = athlete.phv_assessments?.[0];
        if (selectedStatus === "UNTESTED") {
          if (latest) return false;
        } else {
          if (!latest) return false;
          const norm = getNormalizedStatus(
            latest.maturity_status
          );
          if (norm !== selectedStatus) return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const latestA = a.phv_assessments?.[0];
      const latestB = b.phv_assessments?.[0];
      if (sortBy === "name_asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "name_desc") {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === "tests_desc") {
        const countA = a.phv_assessments?.length || 0;
        const countB = b.phv_assessments?.length || 0;
        return countB - countA;
      }
      if (sortBy === "offset_asc") {
        const offA = latestA ? parseFloat(latestA.maturity_offset) : 999;
        const offB = latestB ? parseFloat(latestB.maturity_offset) : 999;
        return offA - offB;
      }
      if (sortBy === "offset_desc") {
        const offA = latestA ? parseFloat(latestA.maturity_offset) : -999;
        const offB = latestB ? parseFloat(latestB.maturity_offset) : -999;
        return offB - offA;
      }
      if (sortBy === "latest_date") {
        const dateA = latestA ? new Date(latestA.assessment_date).getTime() : 0;
        const dateB = latestB ? new Date(latestB.assessment_date).getTime() : 0;
        return dateB - dateA;
      }
      return 0;
    });
  }, [athletes, searchQuery, selectedSport, selectedStatus, sortBy]);
  const activeFilterCount = (selectedSport !== "ALL" ? 1 : 0) + (selectedStatus !== "ALL" ? 1 : 0) + (sortBy !== "name_asc" ? 1 : 0);
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSport("ALL");
    setSelectedStatus("ALL");
    setSortBy("name_asc");
  };
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Kalkulator PHV & Kematangan Biologis" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 pb-12", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Kalkulator Peak Height Velocity (PHV)",
          description: "Pemantauan pertumbuhan biologis, perkiraan lonjakan tinggi badan (PHV), dan status kematangan atlet.",
          actions: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative w-44 sm:w-52", children: [
              /* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  placeholder: "Cari nama atlet...",
                  className: "w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-2xs"
                }
              ),
              searchQuery && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSearchQuery(""),
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
                  type: "button",
                  onClick: () => setIsFilterOpen(!isFilterOpen),
                  className: "flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 hover:via-orange-50/40 hover:to-orange-100/60 text-orange-600 border border-slate-200/90 hover:border-orange-300 rounded-md text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsx(Filter, { className: "w-3.5 h-3.5 text-orange-500" }),
                    /* @__PURE__ */ jsx("span", { children: "Filter" }),
                    activeFilterCount > 0 && /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black flex items-center justify-center", children: activeFilterCount }),
                    /* @__PURE__ */ jsx(
                      ChevronDown,
                      {
                        className: `w-3 h-3 text-orange-400 transition-transform ${isFilterOpen ? "rotate-180" : ""}`
                      }
                    )
                  ]
                }
              ),
              isFilterOpen && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-full mt-1.5 w-72 sm:w-80 bg-white rounded-lg shadow-xl border border-slate-200/80 p-4 z-30 animate-in fade-in zoom-in-95 duration-100 space-y-3.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 pb-2", children: [
                  /* @__PURE__ */ jsxs("h4", { className: "text-xs font-bold text-slate-900 flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx(Filter, { className: "w-3.5 h-3.5 text-orange-500" }),
                    "Filter Penilaian PHV"
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    activeFilterCount > 0 && /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: resetFilters,
                        className: "text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer",
                        children: "Reset"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setIsFilterOpen(false),
                        className: "text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors cursor-pointer",
                        title: "Tutup",
                        children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
                      }
                    )
                  ] })
                ] }),
                sports && sports.length > 0 && /* @__PURE__ */ jsx(
                  CustomSelect,
                  {
                    label: "Cabang Olahraga",
                    value: selectedSport,
                    options: sportOptions,
                    onChange: setSelectedSport
                  }
                ),
                /* @__PURE__ */ jsx(
                  CustomSelect,
                  {
                    label: "Status Kematangan",
                    value: selectedStatus,
                    options: statusOptions,
                    onChange: setSelectedStatus
                  }
                ),
                /* @__PURE__ */ jsx(
                  CustomSelect,
                  {
                    label: "Urutkan",
                    value: sortBy,
                    options: sortOptions,
                    onChange: setSortBy
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "pt-2 border-t border-slate-100 flex items-center justify-end", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setIsFilterOpen(false),
                    className: "px-3 py-1.5 bg-gradient-to-r from-white via-white to-orange-50/70 hover:to-orange-100/80 text-orange-600 hover:text-orange-700 border border-slate-200 hover:border-slate-300 rounded-md text-xs font-bold transition-all shadow-2xs cursor-pointer",
                    children: "Terapkan"
                  }
                ) })
              ] })
            ] })
          ] })
        }
      ),
      filteredAthletes.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center shadow-2xs", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 text-orange-500 flex items-center justify-center mx-auto mb-3 shadow-2xs", children: /* @__PURE__ */ jsx(Activity, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-slate-800 mb-1", children: "Tidak Ada Atlet Ditemukan" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 max-w-sm mx-auto mb-4 leading-relaxed", children: "Coba sesuaikan kata kunci pencarian atau bersihkan filter yang sedang aktif." }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: resetFilters,
            className: "px-3.5 py-1.5 bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 text-orange-600 border border-slate-200/90 rounded-md text-xs font-bold hover:border-orange-300 transition-all shadow-2xs cursor-pointer",
            children: "Reset Filter"
          }
        )
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5", children: filteredAthletes.map((athlete) => {
        const latest = athlete.phv_assessments?.[0];
        const hasAssessment = !!latest;
        const maturityBadge = hasAssessment ? getMaturityBadge(latest.maturity_status) : null;
        const offsetNum = latest ? parseFloat(latest.maturity_offset) : null;
        const isOffsetPositive = offsetNum !== null && offsetNum >= 0;
        const photo = athlete.profile_photo_url || athlete.profile_photo;
        return /* @__PURE__ */ jsxs(
          Link,
          {
            href: route(
              "admin.phv-calculator.show",
              athlete.id
            ),
            className: "group relative bg-gradient-to-b from-white via-orange-50/20 to-orange-100/30 rounded-lg border border-slate-200/90 hover:border-orange-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "p-3.5 space-y-3 flex-1 flex flex-col justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-10 h-10 sm:w-11 sm:h-11 rounded-md border-2 border-white shadow-2xs bg-gradient-to-br from-orange-50 to-orange-100/70 text-orange-600 font-black text-base flex items-center justify-center shrink-0 overflow-hidden", children: photo ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: photo,
                      alt: athlete.name,
                      className: "w-full h-full object-cover"
                    }
                  ) : /* @__PURE__ */ jsx("span", { className: "leading-none select-none", children: getInitials(
                    athlete.name
                  ) }) }),
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 space-y-0.5", children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 text-xs sm:text-[13px] truncate group-hover:text-orange-600 transition-colors leading-tight", children: athlete.name }),
                    /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-slate-500 font-medium truncate", children: [
                      athlete.sport?.name || "Tanpa Cabor",
                      athlete.gender && /* @__PURE__ */ jsxs("span", { className: "ml-1 text-slate-400", children: [
                        "(",
                        athlete.gender === "P" || athlete.gender === "female" || athlete.gender === "Perempuan" ? "Putri" : "Putra",
                        athlete.age ? `, ${Math.round(
                          athlete.age
                        )}th` : "",
                        ")"
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { children: hasAssessment ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-white/80 px-2 py-1 rounded border border-slate-200/70 text-[9.5px]", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-slate-400 font-medium flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(Calendar, { className: "w-2.5 h-2.5 text-slate-400" }),
                    "Tes Terakhir:"
                  ] }),
                  /* @__PURE__ */ jsx("strong", { className: "text-slate-700 font-bold", children: new Date(
                    latest.assessment_date
                  ).toLocaleDateString(
                    "id-ID",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    }
                  ) })
                ] }) : /* @__PURE__ */ jsx("div", { className: "bg-white/60 px-2 py-1 rounded border border-dashed border-slate-200 text-[9.5px] text-slate-400 font-medium text-center", children: "Belum ada data evaluasi" }) }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-1.5 pt-0.5 border-t border-slate-100/90", children: [
                  /* @__PURE__ */ jsxs("div", { className: "p-1.5 bg-white/90 rounded-md border border-slate-200/70 shadow-2xs", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase tracking-wider block", children: "Offset" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-0.5 mt-0.5", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[11.5px] font-black text-slate-900 leading-tight", children: hasAssessment && offsetNum !== null ? isOffsetPositive ? `+${offsetNum.toFixed(
                        1
                      )}` : offsetNum.toFixed(
                        1
                      ) : "-" }),
                      /* @__PURE__ */ jsx("span", { className: "text-[8px] font-normal text-slate-400", children: "thn" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "p-1.5 bg-white/90 rounded-md border border-slate-200/70 shadow-2xs", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase tracking-wider block truncate", children: "Kematangan" }),
                    /* @__PURE__ */ jsx("div", { className: "mt-0.5", children: maturityBadge ? /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `text-[9.5px] font-black leading-tight block truncate ${maturityBadge.color}`,
                        children: maturityBadge.label
                      }
                    ) : /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-medium", children: "-" }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "p-1.5 bg-white/90 rounded-md border border-slate-200/70 shadow-2xs", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase tracking-wider block", children: "Tinggi" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-0.5 mt-0.5", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[11.5px] font-black text-slate-800 leading-tight", children: hasAssessment && latest.standing_height ? latest.standing_height : "-" }),
                      /* @__PURE__ */ jsx("span", { className: "text-[8px] font-normal text-slate-400", children: "cm" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "p-1.5 bg-white/90 rounded-md border border-slate-200/70 shadow-2xs", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase tracking-wider block", children: "Usia PHV" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-0.5 mt-0.5", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[11.5px] font-black text-orange-600 leading-tight", children: hasAssessment && latest.phv_age ? parseFloat(
                        latest.phv_age
                      ).toFixed(1) : "-" }),
                      /* @__PURE__ */ jsx("span", { className: "text-[8px] font-normal text-slate-400", children: "thn" })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "px-3.5 py-2 bg-gradient-to-r from-slate-50/90 via-white to-orange-50/30 border-t border-slate-100 flex items-center justify-between text-xs", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-[9.5px] font-bold text-slate-500", children: [
                  "Total:",
                  " ",
                  /* @__PURE__ */ jsxs("strong", { className: "text-slate-800", children: [
                    athlete.phv_assessments?.length || 0,
                    " ",
                    "Record"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-0.5 text-[10.5px] font-bold text-orange-600 group-hover:text-orange-700 transition-colors", children: [
                  "Analisis PHV",
                  /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" })
                ] })
              ] })
            ]
          },
          athlete.id
        );
      }) }),
      /* @__PURE__ */ jsx(PageFooter, {})
    ] })
  ] });
}
export {
  Index as default
};
