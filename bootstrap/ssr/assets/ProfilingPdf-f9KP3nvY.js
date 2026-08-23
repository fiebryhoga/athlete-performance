import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import "react";
import { Head } from "@inertiajs/react";
import { ArrowLeft, Printer, ShieldCheck, Compass, User, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts";
function ProfilingPdf({
  athlete,
  stats = {},
  radarData = [],
  comparisonData = [],
  itemAnalysis = [],
  strengths = [],
  weaknesses = [],
  latest_phv,
  latest_composition,
  latest_wellness,
  latest_dpa,
  galleries = [],
  history = [],
  clubLogo,
  printDate
}) {
  const handlePrint = () => {
    window.print();
  };
  const calculateBMI = (h, w) => {
    if (!h || !w) return "-";
    const heightInM = h / 100;
    const bmiVal = w / (heightInM * heightInM);
    return parseFloat(bmiVal.toFixed(1));
  };
  const bmi = calculateBMI(athlete?.height, athlete?.weight);
  const initial = athlete?.name ? athlete.name.charAt(0).toUpperCase() : "-";
  const getBMIStatus = (val) => {
    if (val === "-")
      return { label: "-", color: "text-slate-500", bg: "bg-slate-100" };
    if (val < 18.5)
      return {
        label: "Underweight",
        color: "text-amber-600",
        bg: "bg-amber-50"
      };
    if (val >= 18.5 && val <= 24.9)
      return {
        label: "Ideal",
        color: "text-emerald-600",
        bg: "bg-emerald-50"
      };
    if (val >= 25 && val <= 29.9)
      return {
        label: "Overweight",
        color: "text-orange-600",
        bg: "bg-orange-50"
      };
    return { label: "Obese", color: "text-rose-600", bg: "bg-rose-50" };
  };
  const bmiStatus = getBMIStatus(bmi);
  const isFemale = athlete?.gender === "P" || athlete?.gender === "female" || athlete?.gender === "Perempuan";
  const genderLabel = isFemale ? "Perempuan" : "Laki-laki";
  const formatScore = (val) => {
    if (val === void 0 || val === null) return 0;
    return Number(val) % 1 === 0 ? Number(val) : Number(val).toFixed(1);
  };
  const formatNumber = (val) => {
    if (val === void 0 || val === null) return "-";
    return Number(val) % 1 === 0 ? Number(val) : Number(val).toFixed(1);
  };
  const GrowthIndicator = ({ value }) => {
    if (value === void 0 || value === null)
      return /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "-" });
    if (value > 0)
      return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center text-emerald-600 text-xs font-bold", children: [
        /* @__PURE__ */ jsx(TrendingUp, { className: "w-3 h-3 mr-0.5" }),
        " +",
        value,
        "%"
      ] });
    if (value < 0)
      return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center text-rose-500 text-xs font-bold", children: [
        /* @__PURE__ */ jsx(TrendingDown, { className: "w-3 h-3 mr-0.5" }),
        " ",
        value,
        "%"
      ] });
    return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center text-slate-400 text-xs font-bold", children: [
      /* @__PURE__ */ jsx(Minus, { className: "w-3 h-3 mr-0.5" }),
      " 0%"
    ] });
  };
  const sortedItemAnalysis = [...itemAnalysis || []].sort(
    (a, b) => (Number(b.score) || 0) - (Number(a.score) || 0)
  );
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-100/70 text-slate-800 font-sans antialiased print:bg-white print:p-0", children: [
    /* @__PURE__ */ jsx(Head, { title: `Laporan Profiling - ${athlete?.name || "Athlete"}` }),
    /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs print:hidden", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => window.history.back(),
          className: "inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { size: 15 }),
            " Kembali"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400 font-medium hidden sm:inline", children: "Format Cetak: A4 Portrait" }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handlePrint,
            className: "bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer",
            children: [
              /* @__PURE__ */ jsx(Printer, { size: 15 }),
              " Cetak / Simpan PDF"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto my-6 p-6 sm:p-8 bg-white rounded-xl shadow-md border border-slate-200/80 print:m-0 print:p-0 print:border-none print:shadow-none print:max-w-none print:w-full space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-3 border-b-2 border-slate-900/80", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          clubLogo ? /* @__PURE__ */ jsx(
            "img",
            {
              src: clubLogo,
              alt: "Logo",
              className: "h-10 w-auto object-contain max-w-[160px]"
            }
          ) : /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-md bg-orange-600 text-white font-black text-lg flex items-center justify-center", children: "O" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-base font-black text-slate-900 uppercase tracking-tight leading-tight", children: "Laporan Profiling & Analisis Performa" }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 font-medium", children: "Olympus Training Surabaya - Performance Hub" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider block", children: "Tanggal Cetak" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-800", children: printDate || (/* @__PURE__ */ new Date()).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "relative h-16 sm:h-20 bg-gradient-to-r from-white via-orange-50/50 to-amber-50/60 border-b border-slate-100 p-2.5 flex justify-end items-start overflow-hidden", children: /* @__PURE__ */ jsxs("span", { className: "relative z-10 inline-flex items-center gap-1.5 bg-white/90 border border-slate-200/80 text-slate-700 text-[9.5px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs", children: [
          /* @__PURE__ */ jsx(
            ShieldCheck,
            {
              size: 11,
              className: "text-orange-500"
            }
          ),
          /* @__PURE__ */ jsx("span", { children: stats?.package_name || (stats?.sport ? `${stats.sport}` : "Member") })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "px-4 pb-3.5 pt-2", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsx("div", { className: "relative -mt-9 sm:-mt-10 w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-md border-[2.5px] border-white shadow-md overflow-hidden bg-white text-orange-600 font-black text-xl flex items-center justify-center shrink-0 z-10", children: athlete?.profile_photo_url ? /* @__PURE__ */ jsx(
              "img",
              {
                src: athlete.profile_photo_url,
                alt: athlete.name,
                className: "w-full h-full object-cover"
              }
            ) : /* @__PURE__ */ jsx("span", { className: "leading-none select-none", children: initial }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-0.5 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-base font-black text-slate-900 leading-tight", children: athlete?.name || "Athlete" }),
                /* @__PURE__ */ jsxs("span", { className: "text-[9.5px] font-mono text-slate-400 font-bold", children: [
                  "@",
                  athlete?.username || "-"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 font-bold text-orange-700 bg-orange-50 border border-orange-200/70 px-2 py-0.5 rounded text-[9.5px]", children: [
                  /* @__PURE__ */ jsx(
                    Compass,
                    {
                      size: 10,
                      className: "text-orange-500"
                    }
                  ),
                  stats?.sport || athlete?.sport?.name || "Tanpa Cabor"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[11px] text-slate-500 font-medium flex-wrap", children: [
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(
                    User,
                    {
                      size: 10,
                      className: "text-slate-400"
                    }
                  ),
                  genderLabel
                ] }),
                stats?.coaches_text && stats.coaches_text !== "-" && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "•" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "Pelatih:",
                    " ",
                    /* @__PURE__ */ jsx("strong", { className: "text-slate-700 font-semibold", children: stats.coaches_text })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-1.5 shrink-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-2.5 py-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-center min-w-[65px]", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase tracking-wider block", children: "Tinggi" }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs font-black text-slate-900 leading-tight", children: [
                athlete?.height || "-",
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-[8px] font-normal text-slate-400", children: "cm" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "px-2.5 py-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-center min-w-[65px]", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase tracking-wider block", children: "Berat" }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs font-black text-slate-900 leading-tight", children: [
                athlete?.weight || "-",
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-[8px] font-normal text-slate-400", children: "kg" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "px-2.5 py-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-center min-w-[65px]", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase tracking-wider block", children: "Usia" }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs font-black text-slate-900 leading-tight", children: [
                athlete?.age || "-",
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-[8px] font-normal text-slate-400", children: "thn" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "px-2.5 py-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-center min-w-[65px]", children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `text-[8px] font-bold block truncate ${bmiStatus.color}`,
                  children: bmiStatus.label
                }
              ),
              /* @__PURE__ */ jsxs(
                "span",
                {
                  className: `text-xs font-black leading-tight ${bmiStatus.color}`,
                  children: [
                    bmi,
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-[8px] font-normal text-slate-400", children: "BMI" })
                  ]
                }
              )
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-3.5 items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "col-span-7 space-y-3.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2.5", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-3 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-1", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-slate-900 leading-tight", children: "Radar Kategori Fisik" }),
                /* @__PURE__ */ jsx("p", { className: "text-[9px] text-slate-400", children: "Evaluasi atribut fisik (0 – 100)" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "h-[180px] w-full", children: /* @__PURE__ */ jsx(
                ResponsiveContainer,
                {
                  width: "100%",
                  height: "100%",
                  children: /* @__PURE__ */ jsxs(
                    RadarChart,
                    {
                      cx: "50%",
                      cy: "50%",
                      outerRadius: "68%",
                      data: radarData,
                      children: [
                        /* @__PURE__ */ jsx(
                          PolarGrid,
                          {
                            stroke: "#e2e8f0",
                            strokeDasharray: "3 3"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          PolarAngleAxis,
                          {
                            dataKey: "subject",
                            tick: {
                              fill: "#334155",
                              fontSize: 8.5,
                              fontWeight: "bold"
                            }
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          PolarRadiusAxis,
                          {
                            angle: 30,
                            domain: [0, 100],
                            tick: false,
                            axisLine: false
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          Radar,
                          {
                            name: "Target",
                            dataKey: "B",
                            stroke: "#f59e0b",
                            strokeWidth: 1.5,
                            fill: "#f59e0b",
                            fillOpacity: 0.08
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          Radar,
                          {
                            name: "Skor",
                            dataKey: "A",
                            stroke: "#ea580c",
                            strokeWidth: 2,
                            fill: "#ea580c",
                            fillOpacity: 0.35
                          }
                        )
                      ]
                    }
                  )
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-3 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-1", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-slate-900 leading-tight", children: "Perbandingan Sesi" }),
                /* @__PURE__ */ jsx("p", { className: "text-[9px] text-slate-400", children: "Sesi Terkini vs Sebelumnya" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "h-[180px] w-full", children: /* @__PURE__ */ jsx(
                ResponsiveContainer,
                {
                  width: "100%",
                  height: "100%",
                  children: /* @__PURE__ */ jsxs(
                    BarChart,
                    {
                      data: comparisonData,
                      margin: {
                        top: 10,
                        right: 0,
                        left: -25,
                        bottom: 0
                      },
                      barGap: 3,
                      children: [
                        /* @__PURE__ */ jsx(
                          CartesianGrid,
                          {
                            strokeDasharray: "3 3",
                            vertical: false,
                            stroke: "#f1f5f9"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          XAxis,
                          {
                            dataKey: "name",
                            tick: {
                              fontSize: 8,
                              fill: "#64748b",
                              fontWeight: 600
                            },
                            axisLine: false,
                            tickLine: false
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          YAxis,
                          {
                            domain: [0, 100],
                            tick: {
                              fontSize: 8,
                              fill: "#94a3b8"
                            },
                            axisLine: false,
                            tickLine: false
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          Bar,
                          {
                            name: "Lalu",
                            dataKey: "previous",
                            fill: "#cbd5e1",
                            radius: [2, 2, 0, 0],
                            barSize: 10
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          Bar,
                          {
                            name: "Kini",
                            dataKey: "latest",
                            fill: "#ea580c",
                            radius: [2, 2, 0, 0],
                            barSize: 10
                          }
                        )
                      ]
                    }
                  )
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2.5", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-3 rounded-md border border-slate-200/80 shadow-2xs", children: [
              /* @__PURE__ */ jsx("div", { className: "mb-2 pb-1 border-b border-slate-100", children: /* @__PURE__ */ jsx("h4", { className: "text-[11px] font-bold text-slate-900", children: "Keunggulan Fisik (>70%)" }) }),
              /* @__PURE__ */ jsx("div", { className: "space-y-2", children: strengths && strengths.length > 0 ? strengths.map((item, idx) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "p-2 rounded bg-gradient-to-br from-white via-white to-orange-50/40 border border-slate-200/80 space-y-1",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[10px]", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800", children: item.name }),
                      /* @__PURE__ */ jsxs("span", { className: "font-black text-emerald-600", children: [
                        formatScore(
                          item.score
                        ),
                        "%"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "w-full bg-slate-200 h-1 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "bg-emerald-500 h-full rounded-full",
                        style: {
                          width: `${Math.min(100, Math.max(0, item.score))}%`
                        }
                      }
                    ) })
                  ]
                },
                idx
              )) : /* @__PURE__ */ jsx("p", { className: "text-[9.5px] text-slate-400 italic text-center py-2", children: "Belum ada kategori di atas 70%" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-3 rounded-md border border-slate-200/80 shadow-2xs", children: [
              /* @__PURE__ */ jsx("div", { className: "mb-2 pb-1 border-b border-slate-100", children: /* @__PURE__ */ jsx("h4", { className: "text-[11px] font-bold text-slate-900", children: "Prioritas Peningkatan (≤70%)" }) }),
              /* @__PURE__ */ jsx("div", { className: "space-y-2", children: weaknesses && weaknesses.length > 0 ? weaknesses.map((item, idx) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "p-2 rounded bg-gradient-to-br from-white via-white to-orange-50/40 border border-slate-200/80 space-y-1",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[10px]", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800", children: item.name }),
                      /* @__PURE__ */ jsxs("span", { className: "font-black text-rose-500", children: [
                        formatScore(
                          item.score
                        ),
                        "%"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "w-full bg-slate-200 h-1 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "bg-rose-500 h-full rounded-full",
                        style: {
                          width: `${Math.min(100, Math.max(0, item.score))}%`
                        }
                      }
                    ) })
                  ]
                },
                idx
              )) : /* @__PURE__ */ jsx("p", { className: "text-[9.5px] text-slate-400 italic text-center py-2", children: "Semua kategori berada di atas 70%" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200/80 rounded-md p-3 shadow-2xs space-y-2.5", children: [
            /* @__PURE__ */ jsx("div", { className: "pb-1 border-b border-slate-100", children: /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-slate-900", children: "Status Multi-Domain Asesmen" }) }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80 space-y-0.5", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 uppercase block", children: "PHV & Pertumbuhan" }),
                latest_phv ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[10px]", children: [
                  /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-800", children: [
                    "Offset:",
                    " ",
                    Number(
                      latest_phv.maturity_offset
                    ).toFixed(1),
                    " ",
                    "thn"
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "font-bold text-orange-600", children: [
                    "+",
                    latest_phv.remaining_growth || "-",
                    " ",
                    "cm"
                  ] })
                ] }) : /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 italic", children: "Belum ada data PHV" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80 space-y-0.5", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 uppercase block", children: "Komposisi Tubuh" }),
                latest_composition ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[10px]", children: [
                  /* @__PURE__ */ jsxs("span", { className: "font-bold text-orange-600", children: [
                    "Fat:",
                    " ",
                    latest_composition.body_fat_percentage ?? "-",
                    "%"
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-800", children: [
                    "Muscle:",
                    " ",
                    latest_composition.muscle_mass ?? "-",
                    " ",
                    "kg"
                  ] })
                ] }) : /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 italic", children: "Belum ada data" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80 space-y-0.5", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 uppercase block", children: "Beban & Wellness" }),
                latest_wellness ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[10px]", children: [
                  /* @__PURE__ */ jsxs("span", { className: "font-bold text-emerald-600", children: [
                    "Well:",
                    " ",
                    latest_wellness.daily_wellness_score ?? "-",
                    "/30"
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "font-bold text-orange-600", children: [
                    "Load:",
                    " ",
                    latest_wellness.daily_load ?? 0,
                    " ",
                    "AU"
                  ] })
                ] }) : /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 italic", children: "Belum ada catatan" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80 space-y-0.5", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 uppercase block", children: "Postur Dinamis (DPA)" }),
                latest_dpa ? /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-800 truncate block", children: latest_dpa.conclusion || "Normal" }) : /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 italic", children: "Belum ada data DPA" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-5 space-y-3.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200/80 rounded-md p-3.5 shadow-2xs", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-1 pb-1.5 border-b border-slate-100 flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-slate-900", children: "Skor Performa" }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `text-[9.5px] font-bold ${(() => {
                    const score = stats?.avg_score || stats?.average_score || 0;
                    if (score >= 90)
                      return "text-emerald-600";
                    if (score >= 80) return "text-teal-600";
                    if (score >= 70)
                      return "text-amber-600";
                    if (score >= 60)
                      return "text-orange-600";
                    return "text-rose-600";
                  })()}`,
                  children: (() => {
                    const score = stats?.avg_score || stats?.average_score || 0;
                    if (score >= 90) return "Sangat Baik";
                    if (score >= 80) return "Baik";
                    if (score >= 70) return "Cukup";
                    if (score >= 60) return "Kurang";
                    return "Sangat Kurang";
                  })()
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center pt-1 pb-0.5", children: /* @__PURE__ */ jsxs("div", { className: "relative w-40 h-22 flex items-end justify-center", children: [
              /* @__PURE__ */ jsxs(
                "svg",
                {
                  className: "w-40 h-22 overflow-visible",
                  viewBox: "0 0 160 90",
                  children: [
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M 16 80 A 64 64 0 0 1 144 80",
                        fill: "none",
                        stroke: "#f1f5f9",
                        strokeWidth: "11",
                        strokeLinecap: "round"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M 16 80 A 64 64 0 0 1 144 80",
                        fill: "none",
                        stroke: "url(#aspectGaugeGradientPdf)",
                        strokeWidth: "11",
                        strokeLinecap: "round",
                        strokeDasharray: "201.06",
                        strokeDashoffset: 201.06 - 201.06 * Math.min(
                          100,
                          Math.max(
                            0,
                            stats?.avg_score || stats?.average_score || 0
                          )
                        ) / 100
                      }
                    ),
                    /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs(
                      "linearGradient",
                      {
                        id: "aspectGaugeGradientPdf",
                        x1: "0%",
                        y1: "0%",
                        x2: "100%",
                        y2: "0%",
                        children: [
                          /* @__PURE__ */ jsx(
                            "stop",
                            {
                              offset: "0%",
                              stopColor: "#fb923c"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "stop",
                            {
                              offset: "100%",
                              stopColor: "#ea580c"
                            }
                          )
                        ]
                      }
                    ) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 text-center pb-0.5", children: [
                /* @__PURE__ */ jsx("span", { className: "text-2xl font-black text-slate-900 leading-none", children: formatScore(
                  stats?.avg_score || stats?.average_score
                ) }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-slate-400 block mt-0.5", children: "Rata-Rata Tes" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-1 text-center mt-2 pt-2 border-t border-slate-100", children: [
              /* @__PURE__ */ jsxs("div", { className: "p-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase block", children: "Total Sesi" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs font-black text-slate-800 leading-tight", children: stats?.total_sessions || stats?.sessions || 0 })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase block", children: "Puncak" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs font-black text-emerald-600 leading-tight", children: formatScore(
                  stats?.highest_score || stats?.max_score
                ) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase block truncate", children: "Terbaik" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs font-black text-orange-600 leading-tight truncate", children: stats?.best_category || "-" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 bg-gradient-to-r from-white via-orange-50/30 to-white border-b border-slate-200/80 flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-slate-900", children: "Rincian Parameter Tes" }),
              /* @__PURE__ */ jsxs("span", { className: "text-[9px] text-slate-500 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200/80", children: [
                sortedItemAnalysis.length,
                " Item"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
              /* @__PURE__ */ jsx("thead", { className: "text-[8.5px] text-slate-500 bg-slate-50 border-b border-slate-200/80 font-bold uppercase tracking-wider", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "px-2.5 py-1.5", children: "Item & Target" }),
                /* @__PURE__ */ jsx("th", { className: "px-2 py-1.5 text-center", children: "Hasil" }),
                /* @__PURE__ */ jsx("th", { className: "px-2.5 py-1.5 text-right", children: "Skor" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: sortedItemAnalysis.map((item, idx) => /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsxs("td", { className: "px-2.5 py-1.5", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-900 text-[11px] leading-tight", children: item.name }),
                  /* @__PURE__ */ jsxs("div", { className: "text-[8.5px] text-slate-400 font-medium", children: [
                    /* @__PURE__ */ jsx("span", { children: item.category }),
                    " ",
                    "•",
                    " ",
                    /* @__PURE__ */ jsxs("span", { children: [
                      "Tgt:",
                      " ",
                      formatNumber(
                        item.target_value || item.target
                      ),
                      " ",
                      item.unit
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("td", { className: "px-2 py-1.5 text-center", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-black text-slate-900 text-[11px] block leading-tight", children: formatNumber(
                    item.result_value || item.result
                  ) }),
                  /* @__PURE__ */ jsx("span", { className: "text-[8px] text-slate-400", children: item.unit })
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-2.5 py-1.5 text-right", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex flex-col items-end", children: [
                  /* @__PURE__ */ jsxs(
                    "span",
                    {
                      className: `font-black text-[11px] leading-tight ${(item.score || 0) >= 80 ? "text-emerald-600" : (item.score || 0) >= 60 ? "text-amber-600" : "text-rose-600"}`,
                      children: [
                        formatScore(
                          item.score
                        ),
                        "%"
                      ]
                    }
                  ),
                  item.growth !== void 0 && item.growth !== 0 && /* @__PURE__ */ jsx("div", { className: "scale-75 origin-right", children: /* @__PURE__ */ jsx(
                    GrowthIndicator,
                    {
                      value: item.growth
                    }
                  ) })
                ] }) })
              ] }, idx)) })
            ] })
          ] })
        ] })
      ] }),
      galleries && galleries.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-md border border-slate-200/80 p-3 shadow-2xs space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-1 border-b border-slate-100", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-slate-900", children: "Dokumentasi Galeri Biometrik" }),
          /* @__PURE__ */ jsxs("span", { className: "text-[9px] text-slate-400", children: [
            galleries.length,
            " Foto"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-2", children: galleries.slice(0, 4).map((g, idx) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-gradient-to-br from-white via-white to-orange-50/40 border border-slate-200/80 rounded overflow-hidden",
            children: [
              /* @__PURE__ */ jsx("div", { className: "aspect-square bg-slate-100", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: g.image || g.image_path,
                  alt: "Biometric",
                  className: "w-full h-full object-cover"
                }
              ) }),
              g.notes && /* @__PURE__ */ jsxs("p", { className: "p-1 text-[8.5px] italic text-slate-600 line-clamp-1 border-t border-slate-100", children: [
                '"',
                g.notes,
                '"'
              ] })
            ]
          },
          idx
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-slate-200 grid grid-cols-3 gap-4 text-center text-xs", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 block mb-12", children: "Atlet / Klien" }),
          /* @__PURE__ */ jsx("strong", { className: "text-slate-800 block text-xs underline", children: athlete?.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 block mb-12", children: "Pelatih Kepala / Head Coach" }),
          /* @__PURE__ */ jsx("strong", { className: "text-slate-800 block text-xs underline", children: stats?.coaches_text !== "-" ? stats?.coaches_text : "Pelatih Olympus" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 block mb-12", children: "Direktur Performa Olahraga" }),
          /* @__PURE__ */ jsx("strong", { className: "text-slate-800 block text-xs underline", children: "Olympus Performance Lead" })
        ] })
      ] })
    ] })
  ] });
}
export {
  ProfilingPdf as default
};
