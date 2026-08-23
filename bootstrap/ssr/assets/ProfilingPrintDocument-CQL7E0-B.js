import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import "react";
import { ShieldCheck, Compass, User, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
function ProfilingPrintDocument({
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
  clubLogo
}) {
  const calculateBMI = (h, w) => {
    if (!h || !w) return "-";
    const heightInM = h / 100;
    const bmiVal = w / (heightInM * heightInM);
    return parseFloat(bmiVal.toFixed(1));
  };
  const bmi = calculateBMI(athlete?.height, athlete?.weight);
  const initial = athlete?.name ? athlete.name.charAt(0).toUpperCase() : "-";
  const getBMIStatus = (val) => {
    if (val === "-") return { label: "-", color: "text-slate-500" };
    if (val < 18.5)
      return { label: "Underweight", color: "text-amber-600" };
    if (val >= 18.5 && val <= 24.9)
      return { label: "Ideal", color: "text-emerald-600" };
    if (val >= 25 && val <= 29.9)
      return { label: "Overweight", color: "text-orange-600" };
    return { label: "Obese", color: "text-rose-600" };
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
      return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center text-emerald-600 text-[9.5px] font-bold", children: [
        /* @__PURE__ */ jsx(TrendingUp, { className: "w-2.5 h-2.5 mr-0.5" }),
        " +",
        value,
        "%"
      ] });
    if (value < 0)
      return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center text-rose-500 text-[9.5px] font-bold", children: [
        /* @__PURE__ */ jsx(TrendingDown, { className: "w-2.5 h-2.5 mr-0.5" }),
        " ",
        value,
        "%"
      ] });
    return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center text-slate-400 text-[9.5px] font-bold", children: [
      /* @__PURE__ */ jsx(Minus, { className: "w-2.5 h-2.5 mr-0.5" }),
      " 0%"
    ] });
  };
  const sortedItemAnalysis = [...itemAnalysis || []].sort(
    (a, b) => (Number(b.score) || 0) - (Number(a.score) || 0)
  );
  const currentDate = (/* @__PURE__ */ new Date()).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const avgScore = Number(stats?.avg_score || stats?.average_score || 0);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        width: "1120px",
        backgroundColor: "#ffffff",
        color: "#0f172a",
        padding: "20px 24px",
        fontFamily: "system-ui, -apple-system, sans-serif"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-2.5 mb-2.5 border-b-2 border-slate-900", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "/assets/images/otslogo2.png",
                alt: "OTS Logo",
                className: "h-10 w-auto object-contain",
                onError: (e) => {
                  e.target.style.display = "none";
                }
              }
            ),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h1", { className: "text-sm font-black text-slate-900 uppercase tracking-tight leading-tight", children: "Laporan Profiling & Analisis Performa" }),
              /* @__PURE__ */ jsx("p", { className: "text-[9px] text-slate-500 font-medium", children: "Olympus Training Surabaya - Performance Hub" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-right flex items-center gap-4", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase tracking-wider block", children: "Tanggal Cetak" }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-slate-800", children: currentDate })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-md border border-slate-200 shadow-2xs overflow-hidden mb-2.5", children: [
          /* @__PURE__ */ jsx("div", { className: "h-10 bg-gradient-to-r from-white via-orange-50/60 to-amber-50/70 border-b border-slate-100 px-3 py-1.5 flex justify-end items-start", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 bg-white/95 border border-slate-200 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xs", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { size: 11, className: "text-orange-500" }),
            /* @__PURE__ */ jsx("span", { children: stats?.package_name || (stats?.sport ? `${stats.sport}` : "Member") })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "px-3 pb-2 pt-0.5", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "relative -mt-6 w-[52px] h-[52px] rounded-md border-2 border-white shadow-md overflow-hidden bg-white text-orange-600 font-black text-lg flex items-center justify-center shrink-0", children: athlete?.profile_photo_url ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: athlete.profile_photo_url,
                  alt: athlete.name,
                  className: "w-full h-full object-cover"
                }
              ) : /* @__PURE__ */ jsx("span", { className: "leading-none select-none", children: initial }) }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-0.5 min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-xs font-black text-slate-900 leading-tight", children: athlete?.name || "Athlete" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-[9px] font-mono text-slate-400 font-bold", children: [
                    "@",
                    athlete?.username || "-"
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 font-bold text-orange-700 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded text-[8.5px]", children: [
                    /* @__PURE__ */ jsx(
                      Compass,
                      {
                        size: 9,
                        className: "text-orange-500"
                      }
                    ),
                    stats?.sport || athlete?.sport?.name || "Umum"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[9.5px] text-slate-500 font-medium", children: [
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(
                      User,
                      {
                        size: 9,
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
              /* @__PURE__ */ jsxs("div", { className: "px-3 py-1 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200 text-center min-w-[70px]", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[7.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "Tinggi" }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-black text-slate-900 leading-tight", children: [
                  athlete?.height || "-",
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-[7.5px] font-normal text-slate-400", children: "cm" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "px-3 py-1 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200 text-center min-w-[70px]", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[7.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "Berat" }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-black text-slate-900 leading-tight", children: [
                  athlete?.weight || "-",
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-[7.5px] font-normal text-slate-400", children: "kg" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "px-3 py-1 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200 text-center min-w-[70px]", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[7.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "Usia" }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-black text-slate-900 leading-tight", children: [
                  athlete?.age || "-",
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-[7.5px] font-normal text-slate-400", children: "thn" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "px-3 py-1 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200 text-center min-w-[70px]", children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `text-[7.5px] font-bold block truncate ${bmiStatus.color}`,
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
                      /* @__PURE__ */ jsx("span", { className: "text-[7.5px] font-normal text-slate-400", children: "BMI" })
                    ]
                  }
                )
              ] })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-2.5 items-start mb-2.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "col-span-4 space-y-2.5", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-md p-2.5 shadow-2xs", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-1 pb-1 border-b border-slate-100 flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-[10.5px] font-bold text-slate-900", children: "Skor Performa" }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `text-[9.5px] font-bold ${avgScore >= 90 ? "text-emerald-600" : avgScore >= 80 ? "text-teal-600" : avgScore >= 70 ? "text-amber-600" : avgScore >= 60 ? "text-orange-600" : "text-rose-600"}`,
                    children: avgScore >= 90 ? "Sangat Baik" : avgScore >= 80 ? "Baik" : avgScore >= 70 ? "Cukup" : avgScore >= 60 ? "Kurang" : "Sangat Kurang"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center pt-0.5 pb-0.5", children: /* @__PURE__ */ jsxs("div", { className: "relative w-36 h-20 flex items-end justify-center", children: [
                /* @__PURE__ */ jsxs(
                  "svg",
                  {
                    className: "w-36 h-20 overflow-visible",
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
                          stroke: "url(#aspectGaugeGradientLandscape)",
                          strokeWidth: "11",
                          strokeLinecap: "round",
                          strokeDasharray: "201.06",
                          strokeDashoffset: 201.06 - 201.06 * Math.min(
                            100,
                            Math.max(0, avgScore)
                          ) / 100
                        }
                      ),
                      /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs(
                        "linearGradient",
                        {
                          id: "aspectGaugeGradientLandscape",
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
                  /* @__PURE__ */ jsx("span", { className: "text-xl font-black text-slate-900 leading-none", children: formatScore(avgScore) }),
                  /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 block mt-0.5", children: "Rata-Rata Tes" })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-1 text-center mt-1.5 pt-1.5 border-t border-slate-100", children: [
                /* @__PURE__ */ jsxs("div", { className: "p-1 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[7px] font-bold text-slate-400 uppercase block", children: "Total Sesi" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-slate-800 leading-tight", children: stats?.total_sessions || stats?.sessions || 0 })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-1 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[7px] font-bold text-slate-400 uppercase block", children: "Puncak" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-emerald-600 leading-tight", children: formatScore(
                    stats?.highest_score || stats?.max_score
                  ) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-1 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[7px] font-bold text-slate-400 uppercase block truncate", children: "Terbaik" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-orange-600 leading-tight truncate", children: stats?.best_category || "-" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-white p-2 rounded-md border border-slate-200 shadow-2xs", children: [
                /* @__PURE__ */ jsx("div", { className: "mb-1 pb-0.5 border-b border-slate-100", children: /* @__PURE__ */ jsx("h4", { className: "text-[9.5px] font-bold text-slate-900", children: "Keunggulan Fisik (>70%)" }) }),
                /* @__PURE__ */ jsx("div", { className: "space-y-1", children: strengths && strengths.length > 0 ? strengths.slice(0, 3).map((item, idx) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "p-1 rounded bg-gradient-to-br from-white via-white to-orange-50/40 border border-slate-200/80 space-y-0.5",
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[9px]", children: [
                        /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800 truncate", children: item.name }),
                        /* @__PURE__ */ jsxs("span", { className: "font-black text-emerald-600", children: [
                          formatScore(item.score),
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
                )) : /* @__PURE__ */ jsx("p", { className: "text-[8.5px] text-slate-400 italic text-center py-0.5", children: "Belum ada kategori di atas 70%" }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-white p-2 rounded-md border border-slate-200 shadow-2xs", children: [
                /* @__PURE__ */ jsx("div", { className: "mb-1 pb-0.5 border-b border-slate-100", children: /* @__PURE__ */ jsx("h4", { className: "text-[9.5px] font-bold text-slate-900", children: "Prioritas Peningkatan (≤70%)" }) }),
                /* @__PURE__ */ jsx("div", { className: "space-y-1", children: weaknesses && weaknesses.length > 0 ? weaknesses.slice(0, 3).map((item, idx) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "p-1 rounded bg-gradient-to-br from-white via-white to-orange-50/40 border border-slate-200/80 space-y-0.5",
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[9px]", children: [
                        /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800 truncate", children: item.name }),
                        /* @__PURE__ */ jsxs("span", { className: "font-black text-rose-500", children: [
                          formatScore(item.score),
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
                )) : /* @__PURE__ */ jsx("p", { className: "text-[8.5px] text-slate-400 italic text-center py-0.5", children: "Semua kategori berada di atas 70%" }) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "col-span-4 space-y-2.5", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-2 rounded-md border border-slate-200 shadow-2xs flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-0.5", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-[10px] font-bold text-slate-900 leading-tight", children: "Radar Kategori Fisik" }),
                /* @__PURE__ */ jsx("p", { className: "text-[8px] text-slate-400", children: "Evaluasi atribut fisik (0 – 100)" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "h-[140px] w-full", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(
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
                          fontSize: 7.5,
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
              ) }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white border border-slate-200 rounded-md p-2 shadow-2xs space-y-1.5", children: [
              /* @__PURE__ */ jsx("div", { className: "pb-0.5 border-b border-slate-100", children: /* @__PURE__ */ jsx("h3", { className: "text-[10px] font-bold text-slate-900", children: "Status Multi-Domain Asesmen" }) }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-1.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "p-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80 space-y-0.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase block", children: "PHV" }),
                  latest_phv ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[8.5px]", children: [
                    /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-800", children: [
                      "Offset:",
                      " ",
                      Number(
                        latest_phv.maturity_offset
                      ).toFixed(1),
                      "th"
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "font-bold text-orange-600", children: [
                      "+",
                      latest_phv.remaining_growth || "-",
                      "cm"
                    ] })
                  ] }) : /* @__PURE__ */ jsx("span", { className: "text-[8px] text-slate-400 italic", children: "Belum ada PHV" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80 space-y-0.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase block", children: "Komposisi" }),
                  latest_composition ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[8.5px]", children: [
                    /* @__PURE__ */ jsxs("span", { className: "font-bold text-orange-600", children: [
                      "Fat:",
                      " ",
                      latest_composition.body_fat_percentage ?? "-",
                      "%"
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-800", children: [
                      "Msc:",
                      " ",
                      latest_composition.muscle_mass ?? "-",
                      "kg"
                    ] })
                  ] }) : /* @__PURE__ */ jsx("span", { className: "text-[8px] text-slate-400 italic", children: "Belum ada data" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80 space-y-0.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase block", children: "Wellness" }),
                  latest_wellness ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[8.5px]", children: [
                    /* @__PURE__ */ jsxs("span", { className: "font-bold text-emerald-600", children: [
                      "Well:",
                      " ",
                      latest_wellness.daily_wellness_score ?? "-",
                      "/30"
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "font-bold text-orange-600", children: [
                      latest_wellness.daily_load ?? 0,
                      "AU"
                    ] })
                  ] }) : /* @__PURE__ */ jsx("span", { className: "text-[8px] text-slate-400 italic", children: "Belum ada catatan" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded border border-slate-200/80 space-y-0.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8px] font-bold text-slate-400 uppercase block", children: "Postur DPA" }),
                  latest_dpa ? /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-bold text-slate-800 truncate block", children: latest_dpa.conclusion || "Normal" }) : /* @__PURE__ */ jsx("span", { className: "text-[8px] text-slate-400 italic", children: "Belum ada DPA" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "col-span-4 space-y-2.5", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-md border border-slate-200 shadow-2xs overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-2.5 py-1.5 bg-gradient-to-r from-white via-orange-50/30 to-white border-b border-slate-200 flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-[10px] font-bold text-slate-900", children: "Rincian Parameter Tes" }),
              /* @__PURE__ */ jsxs("span", { className: "text-[8px] text-slate-500 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200", children: [
                sortedItemAnalysis.length,
                " Item"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
              /* @__PURE__ */ jsx("thead", { className: "text-[7.5px] text-slate-500 bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "px-2 py-1", children: "Item & Target" }),
                /* @__PURE__ */ jsx("th", { className: "px-1.5 py-1 text-center", children: "Hasil" }),
                /* @__PURE__ */ jsx("th", { className: "px-2 py-1 text-right", children: "Skor" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: sortedItemAnalysis.slice(0, 10).map((item, idx) => /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsxs("td", { className: "px-2 py-0.5", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-900 text-[9.5px] leading-tight truncate max-w-[130px]", children: item.name }),
                  /* @__PURE__ */ jsxs("div", { className: "text-[7.5px] text-slate-400 font-medium", children: [
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
                /* @__PURE__ */ jsxs("td", { className: "px-1.5 py-0.5 text-center", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-black text-slate-900 text-[9.5px] block leading-tight", children: formatNumber(
                    item.result_value || item.result
                  ) }),
                  /* @__PURE__ */ jsx("span", { className: "text-[7px] text-slate-400", children: item.unit })
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-2 py-0.5 text-right", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex flex-col items-end", children: [
                  /* @__PURE__ */ jsxs(
                    "span",
                    {
                      className: `font-black text-[9.5px] leading-tight ${(item.score || 0) >= 80 ? "text-emerald-600" : (item.score || 0) >= 60 ? "text-amber-600" : "text-rose-600"}`,
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
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-2 border-t border-slate-200 grid grid-cols-3 gap-3 text-center text-xs", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-[8px] text-slate-400 block mb-6", children: "Atlet / Klien" }),
            /* @__PURE__ */ jsx("strong", { className: "text-slate-800 block text-[9.5px] underline", children: athlete?.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-[8px] text-slate-400 block mb-6", children: "Pelatih Kepala / Head Coach" }),
            /* @__PURE__ */ jsx("strong", { className: "text-slate-800 block text-[9.5px] underline", children: stats?.coaches_text && stats.coaches_text !== "-" ? stats.coaches_text : "Pelatih Olympus" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-[8px] text-slate-400 block mb-6", children: "Direktur Performa Olahraga" }),
            /* @__PURE__ */ jsx("strong", { className: "text-slate-800 block text-[9.5px] underline", children: "Olympus Performance Lead" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 pt-1 border-t border-slate-100 text-center text-[7.5px] text-slate-400", children: "Generated via Olympus Performance System • Dokumen ini adalah laporan performa resmi Olympus Training Surabaya" })
      ]
    }
  );
}
export {
  ProfilingPrintDocument as default
};
