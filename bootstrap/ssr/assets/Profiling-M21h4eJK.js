import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { Head, Link } from "@inertiajs/react";
import { P as PageHeader } from "./PageHeader-BXFyVdi4.js";
import AthleteGallery from "./AthleteGallery-BJRa4hh6.js";
import ProfilingPdfDocument from "./ProfilingPdfDocument-k014Z6sd.js";
import { pdf } from "@react-pdf/renderer";
import { Loader2, Download, Activity, ShieldCheck, Compass, User, History, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, LabelList } from "recharts";
import "axios";
function AthleteProfiling({
  user,
  galleries = [],
  stats = {},
  radarData = [],
  comparisonData = [],
  itemAnalysis = [],
  strengths = [],
  weaknesses = [],
  trendData = [],
  history = [],
  daily_metrics = [],
  training_loads = [],
  latest_phv,
  latest_composition,
  latest_wellness,
  latest_dpa,
  latest_daily_metric,
  has_data = false
}) {
  const [isExporting, setIsExporting] = useState(false);
  const handleDownloadPdf = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const doc = /* @__PURE__ */ jsx(
        ProfilingPdfDocument,
        {
          athlete: user,
          stats,
          radarData,
          comparisonData,
          itemAnalysis,
          strengths,
          weaknesses,
          latest_phv,
          latest_composition,
          latest_wellness,
          latest_dpa
        }
      );
      const asPdf = pdf();
      asPdf.updateContainer(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const cleanName = (user?.name || "Athlete").replace(
        /[^a-zA-Z0-9_-]/g,
        "_"
      );
      a.download = `Profiling_${cleanName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setIsExporting(false);
    }
  };
  const calculateBMI = (h, w) => {
    if (!h || !w) return "-";
    const heightInM = h / 100;
    const bmiVal = w / (heightInM * heightInM);
    return parseFloat(bmiVal.toFixed(1));
  };
  const bmi = calculateBMI(user?.height, user?.weight);
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "-";
  const getBMIStatus = (val) => {
    if (val === "-")
      return {
        label: "-",
        color: "text-slate-500",
        bg: "bg-slate-100 border-slate-200"
      };
    if (val < 18.5)
      return {
        label: "Underweight",
        color: "text-amber-600",
        bg: "bg-amber-50 border-amber-200"
      };
    if (val >= 18.5 && val <= 24.9)
      return {
        label: "Ideal",
        color: "text-emerald-600",
        bg: "bg-emerald-50 border-emerald-200"
      };
    if (val >= 25 && val <= 29.9)
      return {
        label: "Overweight",
        color: "text-orange-600",
        bg: "bg-orange-50 border-orange-200"
      };
    return {
      label: "Obese",
      color: "text-rose-600",
      bg: "bg-rose-50 border-rose-200"
    };
  };
  const bmiStatus = getBMIStatus(bmi);
  const getScoreBadge = (score) => {
    const val = parseFloat(score || 0);
    if (val >= 90)
      return {
        label: "Sangat Baik",
        color: "text-emerald-600",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/70"
      };
    if (val >= 80)
      return {
        label: "Baik",
        color: "text-teal-600",
        badgeClass: "bg-teal-50 text-teal-700 border-teal-200/70"
      };
    if (val >= 70)
      return {
        label: "Cukup",
        color: "text-amber-600",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200/70"
      };
    if (val >= 60)
      return {
        label: "Kurang",
        color: "text-orange-600",
        badgeClass: "bg-orange-50 text-orange-700 border-orange-200/70"
      };
    return {
      label: "Sangat Kurang",
      color: "text-rose-600",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200/70"
    };
  };
  const perfStatus = getScoreBadge(stats?.avg_score);
  const isFemale = user?.gender === "P" || user?.gender === "female" || user?.gender === "Perempuan";
  const genderLabel = isFemale ? "Perempuan" : "Laki-laki";
  const formatScore = (val) => {
    if (val === void 0 || val === null) return 0;
    return Number(val) % 1 === 0 ? Number(val) : Number(val).toFixed(1);
  };
  const formatNumber = (val) => {
    if (val === void 0 || val === null) return "-";
    return Number(val) % 1 === 0 ? Number(val) : Number(val).toFixed(1);
  };
  const customTooltipStyle = {
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    fontSize: "11px",
    fontWeight: "700",
    padding: "6px 10px"
  };
  const GrowthIndicator = ({ value }) => {
    if (value === void 0 || value === null)
      return /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "-" });
    if (value > 0)
      return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center text-emerald-600 text-xs font-bold", children: [
        /* @__PURE__ */ jsx(TrendingUp, { className: "w-3.5 h-3.5 mr-0.5" }),
        " +",
        value,
        "%"
      ] });
    if (value < 0)
      return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center text-rose-500 text-xs font-bold", children: [
        /* @__PURE__ */ jsx(TrendingDown, { className: "w-3.5 h-3.5 mr-0.5" }),
        " ",
        value,
        "%"
      ] });
    return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center text-slate-400 text-xs font-bold", children: [
      /* @__PURE__ */ jsx(Minus, { className: "w-3.5 h-3.5 mr-0.5" }),
      " 0%"
    ] });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { title: "Profil Fisik & Analisis Komprehensif", children: [
    /* @__PURE__ */ jsx(Head, { title: `Profil Fisik - ${user?.name || "Athlete"}` }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3.5 pb-4", children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Profil Fisik & Analisis Performa",
          description: `Evaluasi rekam jejak performa fisik, antropometri, dan beban latihan ${user?.name || "atlet"}.`,
          actions: user?.id ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleDownloadPdf,
                disabled: isExporting,
                className: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 hover:border-slate-300 px-3 py-1.5 rounded-md font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60",
                children: isExporting ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    Loader2,
                    {
                      size: 13,
                      className: "text-orange-500 animate-spin"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { children: "Membuat PDF..." })
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    Download,
                    {
                      size: 13,
                      className: "text-orange-500"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { children: "Download PDF" })
                ] })
              }
            ),
            /* @__PURE__ */ jsxs(
              Link,
              {
                href: route(
                  "admin.individual-trainings.show",
                  user.id
                ),
                className: "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3 py-1.5 rounded-md font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5",
                children: [
                  /* @__PURE__ */ jsx(Activity, { size: 13 }),
                  " Program Latihan"
                ]
              }
            )
          ] }) : null
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-4 items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 space-y-4 w-full", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden hover:border-slate-300 transition-all", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative h-20 sm:h-24 bg-gradient-to-r from-white via-orange-50/50 to-amber-50/60 border-b border-slate-100 p-3 flex justify-end items-start overflow-hidden", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-10 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" }),
              /* @__PURE__ */ jsxs("span", { className: "relative z-10 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-slate-200/80 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs", children: [
                /* @__PURE__ */ jsx(
                  ShieldCheck,
                  {
                    size: 11,
                    className: "text-orange-500"
                  }
                ),
                /* @__PURE__ */ jsx("span", { children: stats?.package_name || (stats?.sport ? `${stats.sport}` : "Member") })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "px-5 pb-4 pt-2.5 sm:pt-3", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3.5 min-w-0", children: [
                /* @__PURE__ */ jsx("div", { className: "relative -mt-10 sm:-mt-12 w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-md border-[3px] border-white shadow-md overflow-hidden bg-white text-orange-600 font-black text-xl sm:text-2xl flex items-center justify-center shrink-0 z-10", children: user?.profile_photo_url ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: user.profile_photo_url,
                    alt: user.name,
                    className: "w-full h-full object-cover"
                  }
                ) : /* @__PURE__ */ jsx("span", { className: "leading-none select-none", children: initial }) }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1 min-w-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsx("h2", { className: "text-base sm:text-lg font-black text-slate-900 leading-tight", children: user?.name || "Athlete" }),
                    /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-mono text-slate-400 font-bold", children: [
                      "@",
                      user?.username || "-"
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 font-bold text-orange-700 bg-orange-50 border border-orange-200/70 px-2 py-0.5 rounded text-[10px]", children: [
                      /* @__PURE__ */ jsx(
                        Compass,
                        {
                          size: 10,
                          className: "text-orange-500"
                        }
                      ),
                      stats?.sport || user?.sport?.name || "Tanpa Cabor"
                    ] }),
                    stats?.package_name && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border bg-blue-50 text-blue-700 border-blue-200/70", children: stats.package_name })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap", children: [
                    /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(
                        User,
                        {
                          size: 11,
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
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0 mt-1 lg:mt-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-center min-w-[70px]", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "Tinggi" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs sm:text-sm font-black text-slate-900 leading-tight", children: [
                    user?.height || "-",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-normal text-slate-400", children: "cm" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-center min-w-[70px]", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "Berat" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs sm:text-sm font-black text-slate-900 leading-tight", children: [
                    user?.weight || "-",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-normal text-slate-400", children: "kg" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-center min-w-[70px]", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "Usia" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs sm:text-sm font-black text-slate-900 leading-tight", children: [
                    user?.age || "-",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-normal text-slate-400", children: "thn" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-center min-w-[70px]", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `text-[8.5px] font-bold block truncate ${bmiStatus.color}`,
                      children: bmiStatus.label
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "span",
                    {
                      className: `text-xs sm:text-sm font-black leading-tight ${bmiStatus.color}`,
                      children: [
                        bmi,
                        " ",
                        /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-normal text-slate-400", children: "BMI" })
                      ]
                    }
                  )
                ] })
              ] })
            ] }) })
          ] }),
          has_data ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-white via-white to-orange-50/40 p-4 sm:p-5 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-2", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xs sm:text-[13px] font-bold text-slate-900 leading-tight", children: "Radar Kategori Fisik" }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 font-medium mt-0.5", children: "Profil atribut fisik dari evaluasi tes terakhir (0 – 100)" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "h-[230px] sm:h-[250px] w-full py-1", children: /* @__PURE__ */ jsx(
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
                            tick: ({
                              payload,
                              x,
                              y,
                              cx,
                              cy,
                              ...rest
                            }) => {
                              const item = radarData?.find(
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
                                  fontWeight: "600",
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
                            name: "Performa Atlet",
                            dataKey: "A",
                            stroke: "#ea580c",
                            strokeWidth: 2.5,
                            fill: "#fed7aa",
                            fillOpacity: 0.45,
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
                            contentStyle: customTooltipStyle
                          }
                        )
                      ]
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "border-t border-slate-100 pt-2.5 flex items-center justify-between text-[11px] font-normal text-slate-500", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  "Teratas:",
                  " ",
                  /* @__PURE__ */ jsx("strong", { className: "text-slate-900 font-bold", children: (() => {
                    if (!radarData || radarData.length === 0)
                      return "-";
                    const top = [
                      ...radarData
                    ].sort(
                      (a, b) => (b.A || 0) - (a.A || 0)
                    )[0];
                    const name = top?.subject === "Strength Endurance" ? "Str. Endurance" : top?.subject;
                    return `${name} (${formatScore(top?.A)})`;
                  })() })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  "Fokus:",
                  " ",
                  /* @__PURE__ */ jsx("strong", { className: "text-orange-600 font-bold", children: (() => {
                    if (!radarData || radarData.length === 0)
                      return "-";
                    const lowest = [
                      ...radarData
                    ].sort(
                      (a, b) => (a.A || 0) - (b.A || 0)
                    )[0];
                    const name = lowest?.subject === "Strength Endurance" ? "Str. Endurance" : lowest?.subject;
                    return `${name} (${formatScore(lowest?.A)})`;
                  })() })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-white via-white to-orange-50/40 p-4 sm:p-5 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-2", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xs sm:text-[13px] font-bold text-slate-900 leading-tight", children: "Komparasi Sesi Terkini" }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 font-medium mt-0.5", children: "Perbandingan kategori sesi terkini vs sebelumnya (0 – 100)" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "h-[230px] sm:h-[250px] w-full py-1", children: /* @__PURE__ */ jsx(
                ResponsiveContainer,
                {
                  width: "100%",
                  height: "100%",
                  children: /* @__PURE__ */ jsxs(
                    BarChart,
                    {
                      data: comparisonData,
                      margin: {
                        top: 22,
                        right: 0,
                        left: -20,
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
                              fontSize: 9,
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
                              fontSize: 9,
                              fill: "#94a3b8"
                            },
                            axisLine: false,
                            tickLine: false
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          Tooltip,
                          {
                            cursor: { fill: "#f8fafc" },
                            contentStyle: customTooltipStyle
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          Legend,
                          {
                            wrapperStyle: {
                              fontSize: "10px",
                              paddingTop: "4px"
                            },
                            iconType: "circle"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          Bar,
                          {
                            name: "Sesi Sebelumnya",
                            dataKey: "previous",
                            fill: "#cbd5e1",
                            radius: [3, 3, 0, 0],
                            barSize: 14,
                            children: /* @__PURE__ */ jsx(
                              LabelList,
                              {
                                dataKey: "previous",
                                position: "top",
                                fill: "#64748b",
                                fontSize: 8.5,
                                fontWeight: "bold",
                                formatter: (val) => val > 0 ? `${formatScore(val)}` : "",
                                offset: 3
                              }
                            )
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          Bar,
                          {
                            name: "Sesi Terkini",
                            dataKey: "latest",
                            fill: "#f97316",
                            radius: [3, 3, 0, 0],
                            barSize: 14,
                            children: /* @__PURE__ */ jsx(
                              LabelList,
                              {
                                dataKey: "latest",
                                position: "top",
                                fill: "#ea580c",
                                fontSize: 8.5,
                                fontWeight: "bold",
                                formatter: (val) => val > 0 ? `${formatScore(val)}` : "",
                                offset: 3
                              }
                            )
                          }
                        )
                      ]
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsx("div", { className: "border-t border-slate-100 pt-2.5 flex items-center text-[11px] font-normal text-slate-500", children: /* @__PURE__ */ jsxs("span", { children: [
                "Total Kategori:",
                " ",
                /* @__PURE__ */ jsxs("strong", { className: "text-slate-900 font-bold", children: [
                  comparisonData?.length || 0,
                  " ",
                  "Elemen"
                ] })
              ] }) })
            ] })
          ] }) : null,
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-br from-white via-white to-orange-50/40 p-3.5 sm:p-4 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "mb-2.5 pb-2 border-b border-slate-100", children: /* @__PURE__ */ jsx("h3", { className: "text-[11.5px] sm:text-xs font-bold text-slate-900", children: "Keunggulan Fisik (>70%)" }) }),
              /* @__PURE__ */ jsx("div", { className: "space-y-2", children: strengths && strengths.length > 0 ? strengths.map((item, idx) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "p-2 rounded-md bg-slate-50/70 border border-slate-200/70 flex flex-col gap-1",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800 text-xs", children: item.name }),
                      /* @__PURE__ */ jsxs("span", { className: "font-black text-emerald-600 text-xs", children: [
                        formatScore(
                          item.score
                        ),
                        "%"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500",
                        style: {
                          width: `${Math.min(100, Math.max(0, item.score))}%`
                        }
                      }
                    ) })
                  ]
                },
                idx
              )) : /* @__PURE__ */ jsx("div", { className: "py-4 text-center text-slate-400 text-xs italic bg-slate-50/50 rounded-md border border-dashed border-slate-200", children: "Belum ada kategori di atas 70%." }) })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-br from-white via-white to-orange-50/40 p-3.5 sm:p-4 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "mb-2.5 pb-2 border-b border-slate-100", children: /* @__PURE__ */ jsx("h3", { className: "text-[11.5px] sm:text-xs font-bold text-slate-900", children: "Prioritas Peningkatan (≤70%)" }) }),
              /* @__PURE__ */ jsx("div", { className: "space-y-2", children: weaknesses && weaknesses.length > 0 ? weaknesses.map((item, idx) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "p-2 rounded-md bg-slate-50/70 border border-slate-200/70 flex flex-col gap-1",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800 text-xs", children: item.name }),
                      /* @__PURE__ */ jsxs("span", { className: "font-black text-rose-500 text-xs", children: [
                        formatScore(
                          item.score
                        ),
                        "%"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "bg-gradient-to-r from-rose-500 to-orange-400 h-full rounded-full transition-all duration-500",
                        style: {
                          width: `${Math.min(100, Math.max(0, item.score))}%`
                        }
                      }
                    ) })
                  ]
                },
                idx
              )) : /* @__PURE__ */ jsx("div", { className: "py-4 text-center text-slate-400 text-xs italic bg-slate-50/50 rounded-md border border-dashed border-slate-200", children: "Semua kategori berada di atas 70%." }) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsx(
            AthleteGallery,
            {
              athlete: user,
              galleries: galleries && galleries.length > 0 ? galleries : user?.galleries || []
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 bg-gradient-to-r from-white via-orange-50/30 to-white border-b border-slate-200/80 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold text-slate-900 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(History, { className: "w-4 h-4 text-orange-500" }),
                " ",
                "Riwayat Seluruh Sesi Tes Performa"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200/80 shadow-2xs", children: [
                "Total ",
                history?.length || 0,
                " Sesi"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left whitespace-nowrap", children: [
              /* @__PURE__ */ jsx("thead", { className: "text-[10px] text-slate-500 bg-slate-50/95 border-b border-slate-200/80 font-bold uppercase tracking-wider", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5", children: "Tanggal Sesi" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-center", children: "Skor Kumulatif" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-center", children: "Evaluasi Kinerja" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-2.5 text-right", children: "Tindakan" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: history && history.length > 0 ? history.map((session) => /* @__PURE__ */ jsxs(
                "tr",
                {
                  className: "hover:bg-orange-50/20 transition-colors",
                  children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-bold text-slate-800", children: session.full_date }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx("span", { className: "font-black text-orange-600 text-sm", children: formatScore(
                      session.score
                    ) }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: (() => {
                      const badge = getScoreBadge(
                        session.score
                      );
                      return /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: `inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${badge.badgeClass}`,
                          children: badge.label
                        }
                      );
                    })() }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsx(
                      Link,
                      {
                        href: route(
                          "admin.performance.show",
                          session.id
                        ),
                        className: "inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-orange-600 hover:text-white rounded-md transition-all shadow-2xs",
                        children: "Detail Sesi"
                      }
                    ) })
                  ]
                },
                session.id
              )) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
                "td",
                {
                  colSpan: "4",
                  className: "px-4 py-8 text-center text-slate-400 italic",
                  children: "Belum ada riwayat tes performa fisik yang terekam."
                }
              ) }) })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-[340px] xl:w-[380px] shrink-0 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-white via-white to-orange-50/40 border border-slate-200/80 rounded-md p-4 shadow-2xs hover:border-slate-300 transition-all", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-2 pb-2 border-b border-slate-100 flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-slate-900", children: "Skor Performa" }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `text-xs font-bold ${perfStatus.color}`,
                  children: perfStatus.label
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
                        stroke: "url(#aspectGaugeGradientAthlete)",
                        strokeWidth: "11",
                        strokeLinecap: "round",
                        strokeDasharray: "201.06",
                        strokeDashoffset: 201.06 - 201.06 * Math.min(
                          100,
                          Math.max(
                            0,
                            stats?.avg_score || 0
                          )
                        ) / 100,
                        className: "transition-all duration-1000 ease-out"
                      }
                    ),
                    /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs(
                      "linearGradient",
                      {
                        id: "aspectGaugeGradientAthlete",
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
                /* @__PURE__ */ jsx("span", { className: "text-3xl font-black text-slate-900 leading-none", children: formatScore(stats?.avg_score) }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400 block mt-0.5", children: "Rata-Rata Tes" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-1.5 text-center mt-3 pt-2.5 border-t border-slate-100", children: [
              /* @__PURE__ */ jsxs("div", { className: "p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "Total Sesi" }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs sm:text-sm font-black text-slate-800 leading-tight mt-0.5", children: [
                  stats?.sessions ?? 0,
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-normal text-slate-400", children: "sesi" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "Skor Puncak" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm font-black text-emerald-600 leading-tight mt-0.5", children: formatScore(stats?.max_score) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs flex flex-col justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block truncate", children: "Terbaik" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm font-black text-orange-600 leading-tight mt-0.5 truncate", children: stats?.best_category || "-" })
              ] })
            ] })
          ] }),
          itemAnalysis && itemAnalysis.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 bg-gradient-to-r from-white via-orange-50/30 to-white border-b border-slate-200/80 flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-slate-900", children: "Rincian Parameter Tes Sesi Terakhir" }),
              /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200/80 shadow-2xs", children: [
                "Total ",
                itemAnalysis.length,
                " Item"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
              /* @__PURE__ */ jsx("thead", { className: "sticky top-0 z-10 text-[9.5px] text-slate-500 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200/80 font-bold uppercase tracking-wider", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "px-3 py-2", children: "Item Tes & Target" }),
                /* @__PURE__ */ jsx("th", { className: "px-2 py-2 text-center", children: "Hasil" }),
                /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-right", children: "Skor" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100", children: [...itemAnalysis || []].sort(
                (a, b) => (Number(b.score) || 0) - (Number(a.score) || 0)
              ).map((item, idx) => /* @__PURE__ */ jsxs(
                "tr",
                {
                  className: "hover:bg-orange-50/20 transition-colors",
                  children: [
                    /* @__PURE__ */ jsxs("td", { className: "px-3 py-2.5", children: [
                      /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-900 text-xs leading-tight", children: item.name }),
                      /* @__PURE__ */ jsxs("div", { className: "text-[9.5px] text-slate-400 font-medium mt-0.5 flex items-center gap-1", children: [
                        /* @__PURE__ */ jsx("span", { children: item.category }),
                        /* @__PURE__ */ jsx("span", { children: "•" }),
                        /* @__PURE__ */ jsxs("span", { className: "text-slate-500", children: [
                          "Tgt:",
                          " ",
                          formatNumber(
                            item.target_value
                          ),
                          " ",
                          item.unit
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("td", { className: "px-2 py-2.5 text-center", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-black text-slate-900 text-xs block leading-tight", children: formatNumber(
                        item.result_value
                      ) }),
                      /* @__PURE__ */ jsx("span", { className: "text-[10.5px] text-slate-500 font-medium", children: item.unit })
                    ] }),
                    /* @__PURE__ */ jsx("td", { className: "px-3 py-2.5 text-right", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex flex-col items-end", children: [
                      /* @__PURE__ */ jsxs(
                        "span",
                        {
                          className: `font-black text-xs sm:text-sm leading-tight ${(item.score || 0) >= 80 ? "text-emerald-600" : (item.score || 0) >= 60 ? "text-amber-600" : "text-rose-600"}`,
                          children: [
                            formatScore(
                              item.score
                            ),
                            "%"
                          ]
                        }
                      ),
                      item.growth !== 0 && /* @__PURE__ */ jsx("div", { className: "mt-0.5 scale-90 origin-right", children: /* @__PURE__ */ jsx(
                        GrowthIndicator,
                        {
                          value: item.growth
                        }
                      ) })
                    ] }) })
                  ]
                },
                idx
              )) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-white via-white to-orange-50/40 border border-slate-200/80 rounded-md p-4 shadow-2xs hover:border-slate-300 transition-all space-y-3.5", children: [
            /* @__PURE__ */ jsx("div", { className: "mb-1 pb-2 border-b border-slate-100", children: /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-slate-900", children: "Status Multi-Domain Asesmen" }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs", children: /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800 text-[11px]", children: "PHV & Pertumbuhan" }) }),
              latest_phv ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-1.5 text-center p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-xs", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "Maturity Offset" }),
                  /* @__PURE__ */ jsxs("strong", { className: "text-slate-900 font-bold text-xs", children: [
                    Number(
                      latest_phv.maturity_offset
                    ).toFixed(2),
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-normal text-slate-400", children: "thn" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "Prediksi Tinggi" }),
                  /* @__PURE__ */ jsxs("strong", { className: "text-slate-900 font-bold text-xs", children: [
                    latest_phv.predicted_adult_height || "-",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-normal text-slate-400", children: "cm" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "Sisa Tumbuh" }),
                  /* @__PURE__ */ jsxs("strong", { className: "text-orange-600 font-bold text-xs", children: [
                    "+",
                    latest_phv.remaining_growth || "-",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] font-normal text-slate-400", children: "cm" })
                  ] })
                ] })
              ] }) : /* @__PURE__ */ jsx("p", { className: "text-[10.5px] text-slate-400 italic", children: "Belum ada asesmen PHV" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-2 border-t border-slate-100 space-y-1.5", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs", children: /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800 text-[11px]", children: "Komposisi Tubuh" }) }),
              latest_composition ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-1 text-center p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-xs", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "Body Fat" }),
                  /* @__PURE__ */ jsxs("strong", { className: "text-orange-600 font-bold text-xs", children: [
                    latest_composition.body_fat_percentage ?? "-",
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "Muscle" }),
                  /* @__PURE__ */ jsxs("strong", { className: "text-slate-900 font-bold text-xs", children: [
                    latest_composition.muscle_mass ?? "-",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-[8px] font-normal text-slate-400", children: "kg" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "BMR" }),
                  /* @__PURE__ */ jsx("strong", { className: "text-slate-900 font-bold text-xs", children: latest_composition.bmr ?? "-" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "Visceral" }),
                  /* @__PURE__ */ jsxs("strong", { className: "text-slate-900 font-bold text-xs", children: [
                    "Lvl",
                    " ",
                    latest_composition.visceral_fat_level ?? "-"
                  ] })
                ] })
              ] }) : /* @__PURE__ */ jsx("p", { className: "text-[10.5px] text-slate-400 italic", children: "Belum ada tes komposisi tubuh" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-2 border-t border-slate-100 space-y-1.5", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs", children: /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800 text-[11px]", children: "Beban & Wellness" }) }),
              latest_wellness ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-1.5 text-center p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-xs", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "Wellness" }),
                  /* @__PURE__ */ jsxs("strong", { className: "text-emerald-600 font-bold text-xs", children: [
                    latest_wellness.daily_wellness_score ?? "-",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-normal text-slate-400", children: "/30" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "Session RPE" }),
                  /* @__PURE__ */ jsxs("strong", { className: "text-slate-900 font-bold text-xs", children: [
                    latest_wellness.session_rpe ?? "-",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-normal text-slate-400", children: "/10" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block", children: "Daily Load" }),
                  /* @__PURE__ */ jsxs("strong", { className: "text-orange-600 font-bold text-xs", children: [
                    latest_wellness.daily_load ?? 0,
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-[8.5px] font-normal text-slate-400", children: "AU" })
                  ] })
                ] })
              ] }) : /* @__PURE__ */ jsx("p", { className: "text-[10.5px] text-slate-400 italic", children: "Belum ada catatan wellness" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-2 border-t border-slate-100 space-y-1.5", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs", children: /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800 text-[11px]", children: "Postur Dinamis (DPA)" }) }),
              latest_dpa ? /* @__PURE__ */ jsxs("div", { className: "p-2 bg-gradient-to-br from-white via-white to-orange-50/40 rounded-md border border-slate-200/80 shadow-2xs text-xs flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-500 font-medium", children: "Hasil Postur" }),
                /* @__PURE__ */ jsx("strong", { className: "text-slate-900 font-bold text-xs", children: latest_dpa.conclusion || "Normal" })
              ] }) : /* @__PURE__ */ jsx("p", { className: "text-[10.5px] text-slate-400 italic", children: "Belum ada asesmen postur (DPA)" })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  AthleteProfiling as default
};
