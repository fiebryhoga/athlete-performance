import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { A as AppLayout } from "./AppLayout-BFWH9KqI.js";
import { usePage, Head, Link } from "@inertiajs/react";
import { P as PageHeader } from "./PageHeader-BXFyVdi4.js";
import { P as PageFooter } from "./PageFooter-BbeHbnjC.js";
import { ArrowLeft, Edit3, Sparkles, Compass, Calendar, Target, TrendingUp, FileText, Activity, TrendingDown, Minus } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend, AreaChart, CartesianGrid, XAxis, YAxis, Area, LabelList, BarChart, Bar } from "recharts";
import "axios";
const formatNumber = (val) => {
  if (val === void 0 || val === null || val === "") return "-";
  return Number(val).toLocaleString("id-ID", { maximumFractionDigits: 2 });
};
const formatPercent = (val) => {
  if (val === void 0 || val === null) return "-";
  return Number(val).toLocaleString("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }) + "%";
};
const formatScore = (val) => {
  if (val === void 0 || val === null) return 0;
  return Number(val) % 1 === 0 ? Number(val) : Number(val).toFixed(1);
};
const GrowthIndicator = ({ value, hasPrevious }) => {
  if (!hasPrevious || value === void 0 || value === null)
    return /* @__PURE__ */ jsx("span", { className: "text-slate-300 text-[10px] font-medium", children: "-" });
  if (value > 0)
    return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center text-emerald-600 text-[10.5px] font-bold", children: [
      /* @__PURE__ */ jsx(TrendingUp, { className: "w-3 h-3 mr-0.5" }),
      " +",
      formatNumber(value),
      "%"
    ] });
  if (value < 0)
    return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center text-rose-500 text-[10.5px] font-bold", children: [
      /* @__PURE__ */ jsx(TrendingDown, { className: "w-3 h-3 mr-0.5" }),
      " ",
      formatNumber(value),
      "%"
    ] });
  return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center text-slate-400 text-[10.5px] font-bold", children: [
    /* @__PURE__ */ jsx(Minus, { className: "w-3 h-3 mr-0.5" }),
    " 0%"
  ] });
};
const getScoreColor = (val) => {
  if (val >= 90) return "#059669";
  if (val >= 80) return "#0d9488";
  if (val >= 70) return "#d97706";
  if (val >= 60) return "#ea580c";
  return "#e11d48";
};
const getScoreBadge = (score) => {
  const val = parseFloat(score);
  if (val >= 90)
    return {
      label: "Sangat Baik",
      color: "text-emerald-600"
    };
  if (val >= 80)
    return {
      label: "Baik",
      color: "text-teal-600"
    };
  if (val >= 70)
    return {
      label: "Cukup",
      color: "text-amber-600"
    };
  if (val >= 60)
    return {
      label: "Kurang",
      color: "text-orange-600"
    };
  return {
    label: "Sangat Kurang",
    color: "text-rose-600"
  };
};
function Show({
  test,
  current_score,
  radar_data = [],
  item_analysis = [],
  history = [],
  historical_labels = []
}) {
  const { auth } = usePage().props;
  const isAthlete = auth.user.role === "athlete";
  const hasPrevious = history && history.length > 1;
  const athleteInitial = test.athlete?.name ? test.athlete.name.charAt(0).toUpperCase() : "A";
  const status = getScoreBadge(current_score);
  const historicalColors = ["#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8"];
  const gaugeScore = Math.min(100, Math.max(0, current_score || 0));
  const gaugeOffset = 201.06 - 201.06 * gaugeScore / 100;
  return /* @__PURE__ */ jsxs(AppLayout, { title: `Hasil Tes Fisik - ${test.athlete?.name || "Atlet"}`, children: [
    /* @__PURE__ */ jsx(
      Head,
      {
        title: `Hasil Tes Fisik - ${test.athlete?.name || "Atlet"}`
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 pb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: route("admin.performance.index"),
            className: "inline-flex items-center text-xs font-semibold text-slate-400 hover:text-orange-600 transition-colors gap-1.5",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "w-3.5 h-3.5" }),
              " Kembali ke Tes Fisik"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          PageHeader,
          {
            title: "Analisis Tes Fisik",
            description: `Hasil asesmen performa fisik, peta keterampilan, dan rekam perbandingan parameter ${test.athlete?.name || "atlet"}.`,
            actions: !isAthlete && /* @__PURE__ */ jsxs(
              Link,
              {
                href: route(
                  "admin.performance.edit",
                  test.id
                ),
                className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-white via-white to-orange-50/70 hover:to-orange-100/80 text-orange-600 hover:text-orange-700 border border-slate-200 hover:border-slate-300 rounded-md text-xs font-bold transition-all shadow-2xs",
                children: [
                  /* @__PURE__ */ jsx(Edit3, { className: "w-3.5 h-3.5" }),
                  " Edit Nilai"
                ]
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { id: "report-content", className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-4 items-stretch", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-slate-200/80 shadow-2xs overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative h-20 sm:h-24 bg-gradient-to-r from-white via-orange-50/50 to-amber-50/60 border-b border-slate-100 p-3 flex justify-between items-start overflow-hidden", children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 z-10", children: /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-orange-700 bg-white/90 border border-slate-200/80 px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3 text-orange-500" }),
                  "Laporan Tes Resmi"
                ] }) }),
                /* @__PURE__ */ jsxs("span", { className: "relative z-10 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-slate-200/80 text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs", children: [
                  "REF ID: ",
                  test.name
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "px-5 pb-4 pt-2.5 sm:pt-3", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3.5 min-w-0", children: [
                  /* @__PURE__ */ jsx("div", { className: "relative -mt-10 sm:-mt-12 w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] rounded-md border-[3px] border-white shadow-md overflow-hidden bg-white text-orange-600 font-black text-xl sm:text-2xl flex items-center justify-center shrink-0 z-10", children: test.athlete?.profile_photo ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: test.athlete.profile_photo_url || `/storage/${test.athlete.profile_photo}`,
                      alt: test.athlete?.name,
                      className: "w-full h-full object-cover"
                    }
                  ) : /* @__PURE__ */ jsx("span", { className: "leading-none select-none", children: athleteInitial }) }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1 min-w-0", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                      /* @__PURE__ */ jsx("h2", { className: "text-base sm:text-lg font-black text-slate-900 leading-tight", children: test.athlete?.name || "Unknown" }),
                      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 font-bold text-orange-700 bg-orange-50 border border-orange-200/70 px-2 py-0.5 rounded text-[10px]", children: [
                        /* @__PURE__ */ jsx(Compass, { className: "w-2.5 h-2.5 text-orange-500" }),
                        test.athlete?.sport?.name || "Tanpa Cabor"
                      ] }),
                      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border bg-slate-100 text-slate-700 border-slate-200/70", children: [
                        "Sesi: ",
                        test.name
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5 text-slate-400" }),
                      "Pelaksanaan:",
                      " ",
                      /* @__PURE__ */ jsx("strong", { className: "text-slate-700", children: test.date })
                    ] }) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 shrink-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "px-3 py-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-center min-w-[85px]", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "Tanggal" }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-800 leading-tight", children: test.date })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "px-3 py-1.5 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-center min-w-[85px]", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "Parameter" }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xs font-black text-slate-900 leading-tight", children: [
                      item_analysis.length,
                      " Item"
                    ] })
                  ] })
                ] })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-white via-white to-orange-50/30 p-4 sm:p-5 rounded-lg border border-slate-200/80 shadow-2xs flex flex-col justify-between h-full", children: [
                /* @__PURE__ */ jsxs("div", { className: "mb-2", children: [
                  /* @__PURE__ */ jsxs("h3", { className: "text-xs sm:text-[13px] font-bold text-slate-900 flex items-center gap-1.5 leading-tight", children: [
                    /* @__PURE__ */ jsx(Target, { className: "w-3.5 h-3.5 text-orange-500" }),
                    "Peta Keterampilan Fisik"
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 font-medium mt-0.5", children: "Profil atribut fisik vs target ideal (0 – 100)" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex-1 w-full min-h-[220px] py-1", children: /* @__PURE__ */ jsx(
                  ResponsiveContainer,
                  {
                    width: "100%",
                    height: "100%",
                    children: /* @__PURE__ */ jsxs(
                      RadarChart,
                      {
                        cx: "50%",
                        cy: "50%",
                        outerRadius: "66%",
                        data: radar_data,
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
                              tick: ({
                                payload,
                                x,
                                y,
                                cx,
                                cy,
                                ...rest
                              }) => {
                                const item = radar_data?.find(
                                  (d) => d.subject === payload.value
                                );
                                const labelName = payload.value === "Strength Endurance" ? "Str. Endurance" : payload.value;
                                const valStr = item ? ` (${formatScore(item.A)})` : "";
                                return /* @__PURE__ */ jsxs(
                                  "text",
                                  {
                                    ...rest,
                                    x,
                                    y,
                                    fill: "#475569",
                                    fontSize: 9.5,
                                    fontWeight: "bold",
                                    textAnchor: x > cx ? "start" : x < cx ? "end" : "middle",
                                    children: [
                                      labelName,
                                      valStr
                                    ]
                                  }
                                );
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
                              name: "Target Ideal",
                              dataKey: "B",
                              stroke: "#cbd5e1",
                              strokeWidth: 1,
                              fill: "#f8fafc",
                              fillOpacity: 0.4,
                              strokeDasharray: "3 3"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            Radar,
                            {
                              name: "Hasil Atlet",
                              dataKey: "A",
                              stroke: "#ea580c",
                              strokeWidth: 2,
                              fill: "#ea580c",
                              fillOpacity: 0.25,
                              dot: {
                                r: 3.5,
                                fill: "#fff",
                                stroke: "#ea580c",
                                strokeWidth: 2
                              }
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            Tooltip,
                            {
                              contentStyle: {
                                borderRadius: "6px",
                                border: "1px solid #e2e8f0",
                                backgroundColor: "#ffffff",
                                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                                fontSize: "11px",
                                fontWeight: "700",
                                padding: "6px 10px"
                              }
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            Legend,
                            {
                              iconType: "circle",
                              wrapperStyle: {
                                fontSize: "11px",
                                paddingTop: "6px"
                              }
                            }
                          )
                        ]
                      }
                    )
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-white via-white to-orange-50/30 p-4 sm:p-5 rounded-lg border border-slate-200/80 shadow-2xs flex flex-col justify-between h-full", children: [
                /* @__PURE__ */ jsxs("div", { className: "mb-2", children: [
                  /* @__PURE__ */ jsxs("h3", { className: "text-xs sm:text-[13px] font-bold text-slate-900 flex items-center gap-1.5 leading-tight", children: [
                    /* @__PURE__ */ jsx(TrendingUp, { className: "w-3.5 h-3.5 text-emerald-500" }),
                    "Tren Perkembangan Skor"
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 font-medium mt-0.5", children: "Riwayat progres skor rata-rata pada setiap sesi" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex-1 w-full min-h-[220px] py-1", children: /* @__PURE__ */ jsx(
                  ResponsiveContainer,
                  {
                    width: "100%",
                    height: "100%",
                    children: /* @__PURE__ */ jsxs(
                      AreaChart,
                      {
                        data: history,
                        margin: {
                          top: 22,
                          right: 15,
                          left: -20,
                          bottom: 0
                        },
                        children: [
                          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs(
                            "linearGradient",
                            {
                              id: "colorScore",
                              x1: "0",
                              y1: "0",
                              x2: "0",
                              y2: "1",
                              children: [
                                /* @__PURE__ */ jsx(
                                  "stop",
                                  {
                                    offset: "5%",
                                    stopColor: "#ea580c",
                                    stopOpacity: 0.35
                                  }
                                ),
                                /* @__PURE__ */ jsx(
                                  "stop",
                                  {
                                    offset: "95%",
                                    stopColor: "#ea580c",
                                    stopOpacity: 0
                                  }
                                )
                              ]
                            }
                          ) }),
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
                              dataKey: "date",
                              tick: {
                                fontSize: 10,
                                fill: "#64748b",
                                fontWeight: "bold"
                              },
                              axisLine: false,
                              tickLine: false,
                              dy: 10
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            YAxis,
                            {
                              domain: [0, 100],
                              tick: {
                                fontSize: 10,
                                fill: "#94a3b8"
                              },
                              axisLine: false,
                              tickLine: false
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            Tooltip,
                            {
                              contentStyle: {
                                borderRadius: "6px",
                                border: "1px solid #e2e8f0",
                                backgroundColor: "#ffffff",
                                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                                fontSize: "11px",
                                fontWeight: "700",
                                padding: "6px 10px"
                              },
                              formatter: (val) => [
                                `${formatNumber(val)}%`,
                                "Skor Rata-rata"
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            Area,
                            {
                              type: "monotone",
                              dataKey: "score",
                              stroke: "#ea580c",
                              strokeWidth: 2.5,
                              fillOpacity: 1,
                              fill: "url(#colorScore)",
                              dot: {
                                r: 4,
                                fill: "#ea580c",
                                stroke: "#fff",
                                strokeWidth: 2
                              },
                              activeDot: {
                                r: 6,
                                fill: "#ea580c",
                                strokeWidth: 0
                              },
                              children: /* @__PURE__ */ jsx(
                                LabelList,
                                {
                                  dataKey: "score",
                                  position: "top",
                                  offset: 10,
                                  style: {
                                    fontSize: "10.5px",
                                    fontWeight: "bold",
                                    fill: "#ea580c"
                                  },
                                  formatter: (val) => `${formatNumber(val)}%`
                                }
                              )
                            }
                          )
                        ]
                      }
                    )
                  }
                ) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-white via-white to-orange-50/40 border border-slate-200/80 rounded-lg p-4 shadow-2xs hover:border-slate-300 transition-all", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-2 pb-2 border-b border-slate-100 flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-slate-900", children: "Skor Performa Sesi" }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `text-xs font-bold ${status.color}`,
                    children: status.label
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center pt-2 pb-1", children: /* @__PURE__ */ jsxs("div", { className: "relative w-48 h-26 flex items-end justify-center", children: [
                /* @__PURE__ */ jsxs(
                  "svg",
                  {
                    className: "w-48 h-26 overflow-visible",
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
                          stroke: "url(#performanceGaugeGradient)",
                          strokeWidth: "11",
                          strokeLinecap: "round",
                          strokeDasharray: "201.06",
                          strokeDashoffset: gaugeOffset,
                          className: "transition-all duration-1000 ease-out"
                        }
                      ),
                      /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs(
                        "linearGradient",
                        {
                          id: "performanceGaugeGradient",
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
                  /* @__PURE__ */ jsx("span", { className: "text-3xl font-black text-slate-900 leading-none", children: formatScore(current_score) }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400 block mt-0.5", children: "Rata-Rata Sesi" })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 text-center mt-3 pt-2.5 border-t border-slate-100", children: [
                /* @__PURE__ */ jsxs("div", { className: "p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "Target Ideal" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs sm:text-sm font-black text-slate-800 leading-tight mt-0.5", children: [
                    "100",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-normal text-slate-400", children: "pts" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "Status Akhir" }),
                  /* @__PURE__ */ jsx(
                    "p",
                    {
                      className: `text-xs font-black leading-tight mt-0.5 ${status.color}`,
                      children: status.label
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-white via-white to-orange-50/30 rounded-lg border border-slate-200/80 shadow-2xs p-4 flex-1 flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxs("h4", { className: "text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2", children: [
                /* @__PURE__ */ jsx(FileText, { className: "w-3.5 h-3.5 text-orange-500" }),
                "Catatan & Evaluasi Pelatih"
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-line bg-white/80 p-3 rounded-md border border-slate-200/70 flex-1 overflow-y-auto", children: test.notes || "Belum ada catatan evaluasi dari pelatih untuk sesi ini." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-slate-200/80 shadow-2xs p-4 sm:p-5 space-y-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-xs sm:text-[13px] font-bold text-slate-900 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Activity, { className: "w-3.5 h-3.5 text-orange-500" }),
              "Komparasi Sesi Terakhir"
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-[10.5px] text-slate-400 font-medium mt-0.5", children: [
              "Skor persentase capaian per item (",
              historical_labels ? historical_labels.length + 1 : 1,
              " ",
              "sesi)"
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "h-72 w-full", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(
            BarChart,
            {
              data: item_analysis,
              margin: {
                top: 10,
                right: 15,
                left: 10,
                bottom: 45
              },
              barGap: 2,
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
                      fontSize: 9.5,
                      fill: "#64748b",
                      fontWeight: 600
                    },
                    angle: -35,
                    textAnchor: "end",
                    interval: 0,
                    height: 50,
                    dy: 6,
                    axisLine: false,
                    tickLine: false
                  }
                ),
                /* @__PURE__ */ jsx(YAxis, { domain: [0, 100], hide: true }),
                /* @__PURE__ */ jsx(
                  Tooltip,
                  {
                    cursor: { fill: "#f8fafc" },
                    contentStyle: {
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                      fontSize: "11px",
                      fontWeight: "700"
                    },
                    formatter: (val) => [
                      `${formatPercent(val)}`,
                      "Skor"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  Legend,
                  {
                    verticalAlign: "top",
                    align: "right",
                    wrapperStyle: {
                      fontSize: "11px",
                      paddingBottom: "8px"
                    },
                    iconType: "circle"
                  }
                ),
                historical_labels && historical_labels.map(
                  (label, index) => {
                    const colorIndex = 4 - historical_labels.length + index;
                    const color = historicalColors[colorIndex] || "#cbd5e1";
                    return /* @__PURE__ */ jsx(
                      Bar,
                      {
                        name: label.name,
                        dataKey: label.key,
                        fill: color,
                        radius: [3, 3, 0, 0],
                        barSize: 10
                      },
                      label.key
                    );
                  }
                ),
                /* @__PURE__ */ jsx(
                  Bar,
                  {
                    name: "Tes Ini",
                    dataKey: "score",
                    fill: "#ea580c",
                    radius: [3, 3, 0, 0],
                    barSize: 10,
                    children: /* @__PURE__ */ jsx(
                      LabelList,
                      {
                        dataKey: "score",
                        position: "top",
                        offset: 6,
                        angle: -90,
                        textAnchor: "start",
                        style: {
                          fontSize: "8.5px",
                          fontWeight: "bold",
                          fill: "#ea580c"
                        },
                        formatter: (val) => `${formatNumber(val)}%`
                      }
                    )
                  }
                )
              ]
            }
          ) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg border border-slate-200/80 shadow-2xs overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 bg-gradient-to-r from-white via-orange-50/20 to-white border-b border-slate-100 flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 text-xs sm:text-[13px]", children: "Rincian Hasil & Capaian Parameter" }),
            /* @__PURE__ */ jsxs("span", { className: "text-[10.5px] font-semibold text-slate-400", children: [
              item_analysis.length,
              " Parameter Diuji"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto w-full custom-scrollbar", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-slate-50/80 text-[10px] text-slate-400 font-bold border-b border-slate-200/80 uppercase tracking-wider", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Parameter Tes" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center", children: "Hasil (Nilai Riil)" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center hidden md:table-cell", children: "Target Benchmark" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center bg-slate-100/40 hidden md:table-cell", children: "Sesi Lalu (%)" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center bg-orange-50/40 text-orange-700", children: "Skor Capaian (%)" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center hidden sm:table-cell", children: "Tren" })
            ] }) }),
            /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-slate-100 bg-white", children: [
              item_analysis.map((item, idx) => /* @__PURE__ */ jsxs(
                "tr",
                {
                  className: "hover:bg-orange-50/20 transition-colors",
                  children: [
                    /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
                      /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-800 text-xs", children: item.name }),
                      /* @__PURE__ */ jsx("div", { className: "text-[10px] text-slate-400 font-medium", children: item.category })
                    ] }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center font-black text-slate-900 text-sm whitespace-nowrap", children: formatNumber(
                      item.result_value
                    ) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center hidden md:table-cell", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600 border border-slate-200/70", children: [
                      /* @__PURE__ */ jsx(Target, { className: "w-2.5 h-2.5 text-orange-500" }),
                      formatNumber(
                        item.target_value
                      ),
                      " ",
                      item.unit
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center bg-slate-50/30 text-slate-400 font-medium text-xs hidden md:table-cell", children: hasPrevious ? formatPercent(
                      item.previous_score
                    ) : "-" }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center bg-orange-50/30", children: /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "font-black text-xs sm:text-sm",
                        style: {
                          color: getScoreColor(
                            item.score
                          )
                        },
                        children: formatPercent(item.score)
                      }
                    ) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center hidden sm:table-cell", children: /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
                      GrowthIndicator,
                      {
                        value: item.growth,
                        hasPrevious
                      }
                    ) }) })
                  ]
                },
                idx
              )),
              /* @__PURE__ */ jsx("tr", { className: "bg-gradient-to-r from-orange-50/30 via-white to-orange-50/40 border-t-2 border-slate-200", children: /* @__PURE__ */ jsx(
                "td",
                {
                  colSpan: "100%",
                  className: "px-4 py-3",
                  children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end items-center gap-3", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-500 text-xs", children: "Total Skor Rata-rata:" }),
                    /* @__PURE__ */ jsx("span", { className: "font-black text-xl text-orange-600", children: formatPercent(
                      current_score
                    ) })
                  ] })
                }
              ) })
            ] })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(PageFooter, { className: "!mt-6 !pt-4 !pb-1" })
    ] })
  ] });
}
export {
  Show as default
};
