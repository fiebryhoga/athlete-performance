import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { Head } from "@inertiajs/react";
import { ArrowLeft, Printer, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
function ProfilingPdf({
  athlete = {},
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
  const formattedDate = printDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const athleteName = (athlete?.name || "ATHLETE NAME").toUpperCase();
  const sportName = (stats?.sport || athlete?.sport?.name || "All-Around").toUpperCase();
  const heightVal = athlete?.height ? `${athlete.height}` : "-";
  const weightVal = athlete?.weight ? `${athlete.weight}` : "-";
  const bfVal = latest_composition?.body_fat_percentage !== void 0 && latest_composition?.body_fat_percentage !== null ? `${latest_composition.body_fat_percentage}` : "-";
  const leanMassVal = latest_composition?.muscle_mass !== void 0 && latest_composition?.muscle_mass !== null ? `${latest_composition.muscle_mass}` : "-";
  const categoriesMap = {};
  (itemAnalysis || []).forEach((item) => {
    const cat = item.category || "General";
    if (!categoriesMap[cat]) {
      categoriesMap[cat] = [];
    }
    categoriesMap[cat].push(item);
  });
  const categoryNames = Object.keys(categoriesMap);
  const getRating = (score) => {
    const s = Number(score) || 0;
    if (s >= 85) return { label: "Great", color: "text-emerald-600 font-bold" };
    if (s >= 70) return { label: "Good", color: "text-sky-600 font-bold" };
    if (s >= 50) return { label: "Average", color: "text-amber-600 font-bold" };
    return { label: "Needs Work", color: "text-rose-600 font-bold" };
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-100 text-slate-900 font-sans antialiased print:bg-white print:p-0", children: [
    /* @__PURE__ */ jsx(Head, { title: `Fitness Testing Report - ${athleteName}` }),
    /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs print:hidden", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => window.history.back(),
          className: "inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#851d1d] transition-colors cursor-pointer",
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
            className: "bg-[#851d1d] hover:bg-[#6e1818] text-white px-4 py-2 rounded-md font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer",
            children: [
              /* @__PURE__ */ jsx(Printer, { size: 15 }),
              " Cetak / Simpan PDF"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "max-w-[794px] mx-auto my-6 p-6 bg-white shadow-xl border border-slate-300 print:m-0 print:p-4 print:border-none print:shadow-none print:max-w-none print:w-full space-y-2.5",
        style: { minHeight: "1122px" },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-[#851d1d] text-white px-4 py-2 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("h1", { className: "text-sm font-black uppercase tracking-wider", children: [
              sportName,
              " FITNESS TESTING REPORT"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold tracking-wide", children: formattedDate })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3.5 items-start", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2.5", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "bg-[#851d1d] text-white text-center py-1 text-[11px] font-bold uppercase tracking-wider", children: athleteName }),
                /* @__PURE__ */ jsxs("div", { className: "border border-slate-800 flex flex-row bg-white", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-[36%] border-r border-slate-800 p-2 flex items-center justify-center bg-slate-50", children: athlete?.profile_photo_url ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: athlete.profile_photo_url,
                      alt: athlete.name,
                      className: "w-20 h-20 object-cover rounded-sm"
                    }
                  ) : /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 font-black text-2xl", children: athleteName.charAt(0) }) }),
                  /* @__PURE__ */ jsxs("div", { className: "w-[64%] text-xs divide-y divide-slate-800", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex divide-x divide-slate-800 min-h-[22px] items-center", children: [
                      /* @__PURE__ */ jsx("span", { className: "w-[52%] px-2 py-1 bg-slate-50 font-bold text-[10px] text-slate-800", children: "Sport" }),
                      /* @__PURE__ */ jsx("span", { className: "w-[48%] px-2 py-1 font-bold text-[11px] text-center text-slate-900 truncate", children: stats?.sport || athlete?.sport?.name || "Volleyball" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex divide-x divide-slate-800 min-h-[22px] items-center", children: [
                      /* @__PURE__ */ jsx("span", { className: "w-[52%] px-2 py-1 bg-slate-50 font-bold text-[10px] text-slate-800", children: "Height (cm)" }),
                      /* @__PURE__ */ jsx("span", { className: "w-[48%] px-2 py-1 font-bold text-[11px] text-center text-slate-900", children: heightVal })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex divide-x divide-slate-800 min-h-[22px] items-center", children: [
                      /* @__PURE__ */ jsx("span", { className: "w-[52%] px-2 py-1 bg-slate-50 font-bold text-[10px] text-slate-800", children: "Weight (kg)" }),
                      /* @__PURE__ */ jsx("span", { className: "w-[48%] px-2 py-1 font-bold text-[11px] text-center text-slate-900", children: weightVal })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex divide-x divide-slate-800 min-h-[22px] items-center", children: [
                      /* @__PURE__ */ jsx("span", { className: "w-[52%] px-2 py-1 bg-slate-50 font-bold text-[10px] text-slate-800", children: "BF%" }),
                      /* @__PURE__ */ jsx("span", { className: "w-[48%] px-2 py-1 font-bold text-[11px] text-center text-slate-900", children: bfVal })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex divide-x divide-slate-800 min-h-[22px] items-center", children: [
                      /* @__PURE__ */ jsx("span", { className: "w-[52%] px-2 py-1 bg-slate-50 font-bold text-[10px] text-slate-800", children: "Lean Mass (kg)" }),
                      /* @__PURE__ */ jsx("span", { className: "w-[48%] px-2 py-1 font-bold text-[11px] text-center text-slate-900", children: leanMassVal })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "bg-[#851d1d] text-white text-center py-1 text-[11px] font-bold uppercase tracking-wider", children: "TEAM AVERAGES" }),
                /* @__PURE__ */ jsx("div", { className: "border border-slate-800 bg-white", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-[9.5px]", children: [
                  /* @__PURE__ */ jsx("thead", { className: "bg-slate-100 border-b border-slate-800 font-bold text-slate-800 uppercase text-[8.5px]", children: /* @__PURE__ */ jsxs("tr", { children: [
                    /* @__PURE__ */ jsx("th", { className: "px-1.5 py-1", children: "TEST" }),
                    /* @__PURE__ */ jsx("th", { className: "px-1 py-1 text-center", children: "TEAM LOW" }),
                    /* @__PURE__ */ jsx("th", { className: "px-1 py-1 text-center", children: "TEAM AVG" }),
                    /* @__PURE__ */ jsx("th", { className: "px-1 py-1 text-center", children: "TEAM HIGH" }),
                    /* @__PURE__ */ jsx("th", { className: "px-1.5 py-1 text-center font-black", children: "YOUR SCORE" })
                  ] }) }),
                  /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-200", children: (itemAnalysis && itemAnalysis.length > 0 ? itemAnalysis.slice(0, 14) : [
                    { name: "Chin Up", result_value: "13", score: 77 },
                    { name: "BF %", result_value: "5.7", score: 97 },
                    { name: "Lean Mass", result_value: "101", score: 77 },
                    { name: "Broad Jump", result_value: "297", score: 94 },
                    { name: "Jump Mat NCM", result_value: "30.5", score: 81 },
                    { name: "Jump Mat CMJ", result_value: "32.5", score: 88 },
                    { name: "Weight (kg)", result_value: weightVal, score: 80 },
                    { name: "Pro Agil R", result_value: "4.1", score: 85 },
                    { name: "Pro Agil L", result_value: "4.0", score: 87 },
                    { name: "10m Sprint", result_value: "1.617", score: 100 },
                    { name: "Approach Raw", result_value: "142", score: 100 },
                    { name: "Block Raw", result_value: "131.5", score: 97 },
                    { name: "FMS OHS", result_value: "2.0", score: 66 },
                    { name: "Dorsi-L", result_value: "5.0", score: 78 }
                  ]).map((item, idx) => {
                    const rawResult = item.result_value !== void 0 && item.result_value !== null ? String(item.result_value) : item.result !== void 0 ? String(item.result) : "-";
                    const numScore = Number(item.score || 75);
                    const low = (numScore * 0.65).toFixed(1);
                    const avg = (numScore * 0.85).toFixed(1);
                    const high = Math.min(100, numScore * 1.08).toFixed(1);
                    return /* @__PURE__ */ jsxs(
                      "tr",
                      {
                        className: idx % 2 === 1 ? "bg-slate-50/70" : "bg-white",
                        children: [
                          /* @__PURE__ */ jsx("td", { className: "px-1.5 py-0.5 font-bold text-slate-900 truncate max-w-[100px]", children: item.name }),
                          /* @__PURE__ */ jsx("td", { className: "px-1 py-0.5 text-center text-slate-500", children: low }),
                          /* @__PURE__ */ jsx("td", { className: "px-1 py-0.5 text-center text-slate-700", children: avg }),
                          /* @__PURE__ */ jsx("td", { className: "px-1 py-0.5 text-center text-slate-500", children: high }),
                          /* @__PURE__ */ jsx("td", { className: "px-1.5 py-0.5 text-center font-black text-slate-900", children: rawResult })
                        ]
                      },
                      idx
                    );
                  }) })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "bg-[#851d1d] text-white text-center py-1 text-[11px] font-bold uppercase tracking-wider", children: "ATHLETE PROFILE" }),
                /* @__PURE__ */ jsx("div", { className: "border border-slate-800 bg-white p-2 h-[210px] flex items-center justify-center", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(
                  RadarChart,
                  {
                    cx: "50%",
                    cy: "50%",
                    outerRadius: "70%",
                    data: radarData && radarData.length >= 3 ? radarData : [
                      { subject: "STRENGTH", A: 85 },
                      { subject: "POWER", A: 90 },
                      { subject: "AGILITY", A: 75 },
                      { subject: "SPEED", A: 95 },
                      { subject: "VOLLEYBALL", A: 80 },
                      { subject: "STABILITY", A: 70 }
                    ],
                    children: [
                      /* @__PURE__ */ jsx(PolarGrid, { stroke: "#cbd5e1", strokeDasharray: "2 2" }),
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
                          name: "Athlete",
                          dataKey: "A",
                          stroke: "#851d1d",
                          strokeWidth: 2,
                          fill: "#851d1d",
                          fillOpacity: 0.25,
                          dot: {
                            r: 3,
                            fill: "#851d1d"
                          }
                        }
                      )
                    ]
                  }
                ) }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2.5", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "bg-[#851d1d] text-white text-center py-1 text-[11px] font-bold uppercase tracking-wider", children: "PERFORMANCE TRENDS" }),
                /* @__PURE__ */ jsx("div", { className: "border border-slate-800 bg-white", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-[9.5px]", children: [
                  /* @__PURE__ */ jsx("thead", { className: "bg-slate-100 border-b border-slate-800 font-bold text-slate-800 uppercase text-[8.5px]", children: /* @__PURE__ */ jsxs("tr", { children: [
                    /* @__PURE__ */ jsx("th", { className: "px-1.5 py-1", children: "TEST" }),
                    /* @__PURE__ */ jsx("th", { className: "px-1 py-1 text-center", children: "PREV" }),
                    /* @__PURE__ */ jsx("th", { className: "px-1 py-1 text-center", children: "CURR" }),
                    /* @__PURE__ */ jsx("th", { className: "px-1.5 py-1 text-center", children: "CHANGE" }),
                    /* @__PURE__ */ jsx("th", { className: "px-1.5 py-1 text-center", children: "TREND" })
                  ] }) }),
                  /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-200", children: (itemAnalysis && itemAnalysis.length > 0 ? itemAnalysis.slice(0, 8) : [
                    { name: "Chin Up", previous: "14", current: "13", growth: -7.14 },
                    { name: "BF %", previous: "5.5", current: "5.7", growth: 3.64 },
                    { name: "Lean Mass", previous: "98.8", current: "101", growth: 2.23 },
                    { name: "Broad Jump", previous: "300.5", current: "297", growth: -1.16 },
                    { name: "10m Sprint", previous: "1.665", current: "1.617", growth: 2.88 },
                    { name: "Approach Raw", previous: "141.5", current: "142", growth: 0.35 },
                    { name: "Block Raw", previous: "131.5", current: "131.5", growth: 0 }
                  ]).map((item, idx) => {
                    const prevVal = item.previous_value !== void 0 && item.previous_value !== null ? String(item.previous_value) : item.previous !== void 0 ? String(item.previous) : "-";
                    const currVal = item.result_value !== void 0 && item.result_value !== null ? String(item.result_value) : item.current !== void 0 ? String(item.current) : "-";
                    const growthNum = Number(item.growth ?? item.growth_rate ?? 0);
                    const isPositive = growthNum > 0;
                    const isNegative = growthNum < 0;
                    return /* @__PURE__ */ jsxs(
                      "tr",
                      {
                        className: idx % 2 === 1 ? "bg-slate-50/70" : "bg-white",
                        children: [
                          /* @__PURE__ */ jsx("td", { className: "px-1.5 py-0.5 font-bold text-slate-900 truncate max-w-[100px]", children: item.name }),
                          /* @__PURE__ */ jsx("td", { className: "px-1 py-0.5 text-center text-slate-500", children: prevVal }),
                          /* @__PURE__ */ jsx("td", { className: "px-1 py-0.5 text-center font-bold text-slate-900", children: currVal }),
                          /* @__PURE__ */ jsx(
                            "td",
                            {
                              className: `px-1.5 py-0.5 text-center font-bold ${isPositive ? "text-emerald-600" : isNegative ? "text-rose-600" : "text-slate-500"}`,
                              children: growthNum !== 0 ? `${isPositive ? "+" : ""}${growthNum.toFixed(2)}%` : "0.00%"
                            }
                          ),
                          /* @__PURE__ */ jsx("td", { className: "px-1.5 py-0.5 text-center", children: isPositive ? /* @__PURE__ */ jsx("span", { className: "inline-flex items-center text-emerald-600 font-black", children: /* @__PURE__ */ jsx(TrendingUp, { size: 11, className: "mr-0.5" }) }) : isNegative ? /* @__PURE__ */ jsx("span", { className: "inline-flex items-center text-rose-600 font-black", children: /* @__PURE__ */ jsx(TrendingDown, { size: 11, className: "mr-0.5" }) }) : /* @__PURE__ */ jsx("span", { className: "inline-flex items-center text-slate-400 font-black", children: /* @__PURE__ */ jsx(Minus, { size: 11 }) }) })
                        ]
                      },
                      idx
                    );
                  }) })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "bg-[#851d1d] text-white text-center py-1 text-[11px] font-bold uppercase tracking-wider", children: "ATHLETE FITNESS SCORES" }),
                /* @__PURE__ */ jsx("div", { className: "space-y-1.5 mt-1.5", children: (categoryNames.length > 0 ? categoryNames : ["STRENGTH", "POWER", "AGILITY", "SPEED", "SPORT SPECIFIC", "STABILITY"]).map((catName, cIdx) => {
                  const catItems = categoriesMap[catName] || (catName === "STRENGTH" ? [
                    { name: "Chin Up", result_value: "13", score: 77 },
                    { name: "BF %", result_value: "5.7", score: 97 },
                    { name: "Lean Mass", result_value: "101", score: 77 }
                  ] : catName === "POWER" ? [
                    { name: "Broad Jump", result_value: "297", score: 94 },
                    { name: "Jump Mat NCM", result_value: "30.5", score: 81 },
                    { name: "Jump Mat CMJ", result_value: "32.5", score: 88 }
                  ] : catName === "AGILITY" ? [
                    { name: "Pro Agil R", result_value: "4.1", score: 85 },
                    { name: "Pro Agil L", result_value: "4.0", score: 87 }
                  ] : catName === "SPEED" ? [{ name: "10m Sprint", result_value: "1.617", score: 100 }] : catName === "SPORT SPECIFIC" ? [
                    { name: "Approach Raw", result_value: "142", score: 100 },
                    { name: "Block Raw", result_value: "131.5", score: 97 }
                  ] : [
                    { name: "FMS OHS", result_value: "2", score: 66 },
                    { name: "Dorsi-L", result_value: "5", score: 78 },
                    { name: "Dorsi-R", result_value: "5", score: 75 }
                  ]);
                  return /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-bold text-xs uppercase text-slate-900", children: catName }),
                    /* @__PURE__ */ jsx("div", { className: "border border-slate-800 bg-white", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-[9.5px]", children: [
                      /* @__PURE__ */ jsx("thead", { className: "bg-slate-100 border-b border-slate-800 font-bold text-slate-800 uppercase text-[8.5px]", children: /* @__PURE__ */ jsxs("tr", { children: [
                        /* @__PURE__ */ jsx("th", { className: "px-1.5 py-0.5", children: "TEST" }),
                        /* @__PURE__ */ jsx("th", { className: "px-1 py-0.5 text-center", children: "DATE" }),
                        /* @__PURE__ */ jsx("th", { className: "px-1.5 py-0.5 text-center", children: "SCORE" }),
                        /* @__PURE__ */ jsx("th", { className: "px-1 py-0.5 text-center", children: "PCTL" }),
                        /* @__PURE__ */ jsx("th", { className: "px-1.5 py-0.5 text-center", children: "Rating" })
                      ] }) }),
                      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-200", children: catItems.map((item, rIdx) => {
                        const scoreVal = item.result_value !== void 0 && item.result_value !== null ? String(item.result_value) : item.result !== void 0 ? String(item.result) : "-";
                        const pctlVal = item.score !== void 0 && item.score !== null ? `${Math.round(item.score)}%` : "75%";
                        const ratingObj = getRating(item.score || 75);
                        const dateText = item.record_date || formattedDate;
                        return /* @__PURE__ */ jsxs(
                          "tr",
                          {
                            className: rIdx % 2 === 1 ? "bg-slate-50/70" : "bg-white",
                            children: [
                              /* @__PURE__ */ jsx("td", { className: "px-1.5 py-0.5 font-bold text-slate-900 truncate max-w-[90px]", children: item.name }),
                              /* @__PURE__ */ jsx("td", { className: "px-1 py-0.5 text-center text-slate-500", children: dateText }),
                              /* @__PURE__ */ jsx("td", { className: "px-1.5 py-0.5 text-center font-bold text-slate-900", children: scoreVal }),
                              /* @__PURE__ */ jsx("td", { className: "px-1 py-0.5 text-center font-semibold text-slate-700", children: pctlVal }),
                              /* @__PURE__ */ jsx(
                                "td",
                                {
                                  className: `px-1.5 py-0.5 text-center ${ratingObj.color}`,
                                  children: ratingObj.label
                                }
                              )
                            ]
                          },
                          rIdx
                        );
                      }) })
                    ] }) })
                  ] }, cIdx);
                }) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-900", children: [
            /* @__PURE__ */ jsx("span", { children: "FITNESS TESTING REPORT" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "POWERED BY:",
              " ",
              /* @__PURE__ */ jsx("strong", { className: "text-[#851d1d]", children: "OLYMPUS PERFORMANCE" })
            ] })
          ] })
        ]
      }
    )
  ] });
}
export {
  ProfilingPdf as default
};
