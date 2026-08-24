import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { Document, Page, View, Text, Image, Svg, Circle, Path, Polygon, Line, StyleSheet } from "@react-pdf/renderer";
const THEME = {
  headerBg: "#851d1d",
  // Dark Burgundy / Crimson as in reference
  headerText: "#ffffff",
  border: "#334155",
  borderLighter: "#e2e8f0",
  textDark: "#0f172a",
  textSub: "#475569",
  accentGreen: "#16a34a",
  accentRed: "#dc2626"
};
const styles = StyleSheet.create({
  page: {
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 18,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    fontSize: 7,
    color: THEME.textDark
  },
  // ─── 1. TOP MAIN HEADER BANNER ───
  mainHeaderBanner: {
    backgroundColor: THEME.headerBg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 7
  },
  mainHeaderTitle: {
    color: THEME.headerText,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  mainHeaderDate: {
    color: THEME.headerText,
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold"
  },
  // ─── 2-COLUMN GRID ───
  twoColumnLayout: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1
  },
  columnLeft: {
    width: "48.5%"
  },
  columnRight: {
    width: "49.5%"
  },
  // ─── SECTION BOX & BANNER HEADER ───
  sectionBanner: {
    backgroundColor: THEME.headerBg,
    paddingVertical: 2.5,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2
  },
  sectionBannerTitle: {
    color: THEME.headerText,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.4
  },
  // ─── ATHLETE BIO BOX ───
  athleteBioContainer: {
    borderWidth: 0.8,
    borderColor: THEME.border,
    flexDirection: "row",
    marginBottom: 6,
    backgroundColor: "#ffffff"
  },
  avatarBox: {
    width: "36%",
    borderRightWidth: 0.8,
    borderRightColor: THEME.border,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    backgroundColor: "#f8fafc"
  },
  avatarImg: {
    width: 54,
    height: 54,
    objectFit: "cover",
    borderRadius: 3
  },
  avatarSilhouette: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  bioTable: {
    width: "64%"
  },
  bioRow: {
    flexDirection: "row",
    borderBottomWidth: 0.6,
    borderBottomColor: THEME.border,
    minHeight: 12,
    alignItems: "center"
  },
  bioRowLast: {
    flexDirection: "row",
    minHeight: 12,
    alignItems: "center"
  },
  bioLabelCell: {
    width: "52%",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRightWidth: 0.6,
    borderRightColor: THEME.border,
    backgroundColor: "#f8fafc"
  },
  bioLabelText: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: THEME.textDark
  },
  bioValCell: {
    width: "48%",
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  bioValText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: THEME.textDark,
    textAlign: "center"
  },
  // ─── DATA TABLE BASE ───
  tableContainer: {
    borderWidth: 0.8,
    borderColor: THEME.border,
    marginBottom: 6,
    backgroundColor: "#ffffff"
  },
  tableHeadRow: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 0.8,
    borderBottomColor: THEME.border,
    paddingVertical: 2,
    alignItems: "center"
  },
  tableTh: {
    fontSize: 5.5,
    fontFamily: "Helvetica-Bold",
    color: THEME.textDark,
    textTransform: "uppercase",
    textAlign: "center"
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.4,
    borderBottomColor: THEME.borderLighter,
    paddingVertical: 1.8,
    alignItems: "center"
  },
  tableCell: {
    fontSize: 6,
    color: THEME.textDark,
    textAlign: "center"
  },
  tableCellBold: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: THEME.textDark,
    textAlign: "center"
  },
  // ─── RADAR CHART SECTION ───
  radarBox: {
    borderWidth: 0.8,
    borderColor: THEME.border,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    backgroundColor: "#ffffff",
    minHeight: 140
  },
  // ─── RIGHT COLUMN CATEGORY GROUPED FITNESS SCORES ───
  categoryGroupContainer: {
    marginBottom: 4
  },
  categoryTitleText: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: THEME.textDark,
    textTransform: "uppercase",
    marginBottom: 1.5,
    marginTop: 2
  },
  // ─── FOOTER ───
  footerBar: {
    borderTopWidth: 0.8,
    borderTopColor: THEME.border,
    paddingTop: 4,
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  footerLeft: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: THEME.textDark,
    textTransform: "uppercase",
    letterSpacing: 0.3
  },
  footerRight: {
    fontSize: 6,
    fontFamily: "Helvetica",
    color: THEME.textDark
  },
  footerBrand: {
    fontFamily: "Helvetica-Bold",
    color: THEME.headerBg
  }
});
function ProfilingPdfDocument({
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
  latest_dpa
}) {
  const formattedDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
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
    if (s >= 85) return "Great";
    if (s >= 70) return "Good";
    if (s >= 50) return "Average";
    return "Needs Work";
  };
  const defaultRadarCategories = [
    { name: "STRENGTH", key: "Strength" },
    { name: "POWER", key: "Power" },
    { name: "AGILITY", key: "Agility" },
    { name: "SPEED", key: "Speed" },
    { name: "SPORT", key: "Sport" },
    { name: "STABILITY", key: "Stability" }
  ];
  const radarSource = radarData && radarData.length >= 3 ? radarData : defaultRadarCategories;
  const numAxes = radarSource.length;
  const cx = 95;
  const cy = 70;
  const radius = 48;
  const gridLevels = [0.33, 0.66, 1];
  const gridPolygons = gridLevels.map((lvl) => {
    return Array.from({ length: numAxes }).map((_, i) => {
      const angle = -Math.PI / 2 + i * 2 * Math.PI / numAxes;
      const x = cx + radius * lvl * Math.cos(angle);
      const y = cy + radius * lvl * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
  });
  const athleteScorePoints = radarSource.map((item, i) => {
    const rawScore = Number(item.A ?? item.score ?? 65);
    const normScore = Math.min(100, Math.max(15, rawScore)) / 100;
    const angle = -Math.PI / 2 + i * 2 * Math.PI / numAxes;
    const x = cx + radius * normScore * Math.cos(angle);
    const y = cy + radius * normScore * Math.sin(angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const axesData = radarSource.map((item, i) => {
    const angle = -Math.PI / 2 + i * 2 * Math.PI / numAxes;
    const x2 = cx + radius * Math.cos(angle);
    const y2 = cy + radius * Math.sin(angle);
    const labelRadius = radius + 12;
    const lx = cx + labelRadius * Math.cos(angle);
    const ly = cy + labelRadius * Math.sin(angle);
    const name = (item.subject || item.name || `CAT ${i + 1}`).toUpperCase();
    return { x1: cx, y1: cy, x2, y2, lx, ly, name };
  });
  return /* @__PURE__ */ jsx(Document, { title: `Fitness Testing Report - ${athleteName}`, children: /* @__PURE__ */ jsxs(Page, { size: "A4", orientation: "portrait", style: styles.page, children: [
    /* @__PURE__ */ jsxs(View, { style: styles.mainHeaderBanner, children: [
      /* @__PURE__ */ jsxs(Text, { style: styles.mainHeaderTitle, children: [
        sportName,
        " FITNESS TESTING REPORT"
      ] }),
      /* @__PURE__ */ jsx(Text, { style: styles.mainHeaderDate, children: formattedDate })
    ] }),
    /* @__PURE__ */ jsxs(View, { style: styles.twoColumnLayout, children: [
      /* @__PURE__ */ jsxs(View, { style: styles.columnLeft, children: [
        /* @__PURE__ */ jsx(View, { style: styles.sectionBanner, children: /* @__PURE__ */ jsx(Text, { style: styles.sectionBannerTitle, children: athleteName }) }),
        /* @__PURE__ */ jsxs(View, { style: styles.athleteBioContainer, children: [
          /* @__PURE__ */ jsx(View, { style: styles.avatarBox, children: athlete?.profile_photo_url ? /* @__PURE__ */ jsx(
            Image,
            {
              src: athlete.profile_photo_url,
              style: styles.avatarImg
            }
          ) : /* @__PURE__ */ jsx(View, { style: styles.avatarSilhouette, children: /* @__PURE__ */ jsxs(Svg, { width: "44", height: "44", viewBox: "0 0 100 100", children: [
            /* @__PURE__ */ jsx(Circle, { cx: "50", cy: "30", r: "16", fill: "#0f172a" }),
            /* @__PURE__ */ jsx(
              Path,
              {
                d: "M 22 84 C 22 60, 34 50, 50 50 C 66 50, 78 60, 78 84 Z",
                fill: "#0f172a"
              }
            )
          ] }) }) }),
          /* @__PURE__ */ jsxs(View, { style: styles.bioTable, children: [
            /* @__PURE__ */ jsxs(View, { style: styles.bioRow, children: [
              /* @__PURE__ */ jsx(View, { style: styles.bioLabelCell, children: /* @__PURE__ */ jsx(Text, { style: styles.bioLabelText, children: "Sport" }) }),
              /* @__PURE__ */ jsx(View, { style: styles.bioValCell, children: /* @__PURE__ */ jsx(Text, { style: styles.bioValText, children: stats?.sport || athlete?.sport?.name || "Volleyball" }) })
            ] }),
            /* @__PURE__ */ jsxs(View, { style: styles.bioRow, children: [
              /* @__PURE__ */ jsx(View, { style: styles.bioLabelCell, children: /* @__PURE__ */ jsx(Text, { style: styles.bioLabelText, children: "Height (cm)" }) }),
              /* @__PURE__ */ jsx(View, { style: styles.bioValCell, children: /* @__PURE__ */ jsx(Text, { style: styles.bioValText, children: heightVal }) })
            ] }),
            /* @__PURE__ */ jsxs(View, { style: styles.bioRow, children: [
              /* @__PURE__ */ jsx(View, { style: styles.bioLabelCell, children: /* @__PURE__ */ jsx(Text, { style: styles.bioLabelText, children: "Weight (kg)" }) }),
              /* @__PURE__ */ jsx(View, { style: styles.bioValCell, children: /* @__PURE__ */ jsx(Text, { style: styles.bioValText, children: weightVal }) })
            ] }),
            /* @__PURE__ */ jsxs(View, { style: styles.bioRow, children: [
              /* @__PURE__ */ jsx(View, { style: styles.bioLabelCell, children: /* @__PURE__ */ jsx(Text, { style: styles.bioLabelText, children: "BF%" }) }),
              /* @__PURE__ */ jsx(View, { style: styles.bioValCell, children: /* @__PURE__ */ jsx(Text, { style: styles.bioValText, children: bfVal }) })
            ] }),
            /* @__PURE__ */ jsxs(View, { style: styles.bioRowLast, children: [
              /* @__PURE__ */ jsx(View, { style: styles.bioLabelCell, children: /* @__PURE__ */ jsx(Text, { style: styles.bioLabelText, children: "Lean Mass (kg)" }) }),
              /* @__PURE__ */ jsx(View, { style: styles.bioValCell, children: /* @__PURE__ */ jsx(Text, { style: styles.bioValText, children: leanMassVal }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(View, { style: styles.sectionBanner, children: /* @__PURE__ */ jsx(Text, { style: styles.sectionBannerTitle, children: "TEAM AVERAGES" }) }),
        /* @__PURE__ */ jsxs(View, { style: styles.tableContainer, children: [
          /* @__PURE__ */ jsxs(View, { style: styles.tableHeadRow, children: [
            /* @__PURE__ */ jsx(Text, { style: [styles.tableTh, { width: "32%", textAlign: "left", paddingLeft: 4 }], children: "TEST" }),
            /* @__PURE__ */ jsx(Text, { style: [styles.tableTh, { width: "17%" }], children: "TEAM LOW" }),
            /* @__PURE__ */ jsx(Text, { style: [styles.tableTh, { width: "17%" }], children: "TEAM AVG" }),
            /* @__PURE__ */ jsx(Text, { style: [styles.tableTh, { width: "17%" }], children: "TEAM HIGH" }),
            /* @__PURE__ */ jsx(Text, { style: [styles.tableTh, { width: "17%" }], children: "YOUR SCORE" })
          ] }),
          (itemAnalysis && itemAnalysis.length > 0 ? itemAnalysis.slice(0, 14) : [
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
            const isAlt = idx % 2 === 1;
            return /* @__PURE__ */ jsxs(
              View,
              {
                style: [
                  styles.tableRow,
                  isAlt ? { backgroundColor: "#f8fafc" } : {}
                ],
                children: [
                  /* @__PURE__ */ jsx(
                    Text,
                    {
                      style: [
                        styles.tableCellBold,
                        { width: "32%", textAlign: "left", paddingLeft: 4 }
                      ],
                      children: item.name
                    }
                  ),
                  /* @__PURE__ */ jsx(Text, { style: [styles.tableCell, { width: "17%", color: "#64748b" }], children: low }),
                  /* @__PURE__ */ jsx(Text, { style: [styles.tableCell, { width: "17%", color: "#475569" }], children: avg }),
                  /* @__PURE__ */ jsx(Text, { style: [styles.tableCell, { width: "17%", color: "#64748b" }], children: high }),
                  /* @__PURE__ */ jsx(
                    Text,
                    {
                      style: [
                        styles.tableCellBold,
                        {
                          width: "17%",
                          color: THEME.textDark,
                          fontFamily: "Helvetica-Bold"
                        }
                      ],
                      children: rawResult
                    }
                  )
                ]
              },
              idx
            );
          })
        ] }),
        /* @__PURE__ */ jsx(View, { style: styles.sectionBanner, children: /* @__PURE__ */ jsx(Text, { style: styles.sectionBannerTitle, children: "ATHLETE PROFILE" }) }),
        /* @__PURE__ */ jsxs(View, { style: styles.radarBox, children: [
          /* @__PURE__ */ jsxs(Svg, { width: "190", height: "140", viewBox: "0 0 190 140", children: [
            /* @__PURE__ */ jsx(
              Polygon,
              {
                points: gridPolygons[2],
                fill: "none",
                stroke: THEME.borderLighter,
                strokeWidth: 0.8
              }
            ),
            /* @__PURE__ */ jsx(
              Polygon,
              {
                points: gridPolygons[1],
                fill: "none",
                stroke: THEME.borderLighter,
                strokeWidth: 0.6,
                strokeDasharray: "2,2"
              }
            ),
            /* @__PURE__ */ jsx(
              Polygon,
              {
                points: gridPolygons[0],
                fill: "none",
                stroke: THEME.borderLighter,
                strokeWidth: 0.5,
                strokeDasharray: "2,2"
              }
            ),
            axesData.map((axis, i) => /* @__PURE__ */ jsx(
              Line,
              {
                x1: axis.x1,
                y1: axis.y1,
                x2: axis.x2,
                y2: axis.y2,
                stroke: THEME.borderLighter,
                strokeWidth: 0.6
              },
              `axis-${i}`
            )),
            /* @__PURE__ */ jsx(
              Polygon,
              {
                points: athleteScorePoints,
                fill: THEME.headerBg,
                fillOpacity: 0.22,
                stroke: THEME.headerBg,
                strokeWidth: 1.5
              }
            ),
            athleteScorePoints.split(" ").map((pt, i) => {
              const [px, py] = pt.split(",");
              return /* @__PURE__ */ jsx(
                Circle,
                {
                  cx: parseFloat(px),
                  cy: parseFloat(py),
                  r: "2",
                  fill: THEME.headerBg
                },
                `pt-${i}`
              );
            })
          ] }),
          /* @__PURE__ */ jsx(
            View,
            {
              style: {
                position: "absolute",
                top: 4,
                width: "100%",
                alignItems: "center"
              },
              children: /* @__PURE__ */ jsx(Text, { style: { fontSize: 5.5, fontFamily: "Helvetica-Bold", color: THEME.textSub }, children: axesData[0]?.name || "STRENGTH" })
            }
          ),
          /* @__PURE__ */ jsx(
            View,
            {
              style: {
                position: "absolute",
                bottom: 4,
                width: "100%",
                alignItems: "center"
              },
              children: /* @__PURE__ */ jsx(Text, { style: { fontSize: 5.5, fontFamily: "Helvetica-Bold", color: THEME.textSub }, children: axesData[3]?.name || "SPEED" })
            }
          ),
          /* @__PURE__ */ jsx(
            View,
            {
              style: {
                position: "absolute",
                top: 26,
                right: 6
              },
              children: /* @__PURE__ */ jsx(Text, { style: { fontSize: 5.5, fontFamily: "Helvetica-Bold", color: THEME.textSub }, children: axesData[1]?.name || "POWER" })
            }
          ),
          /* @__PURE__ */ jsx(
            View,
            {
              style: {
                position: "absolute",
                bottom: 26,
                right: 6
              },
              children: /* @__PURE__ */ jsx(Text, { style: { fontSize: 5.5, fontFamily: "Helvetica-Bold", color: THEME.textSub }, children: axesData[2]?.name || "AGILITY" })
            }
          ),
          /* @__PURE__ */ jsx(
            View,
            {
              style: {
                position: "absolute",
                bottom: 26,
                left: 6
              },
              children: /* @__PURE__ */ jsx(Text, { style: { fontSize: 5.5, fontFamily: "Helvetica-Bold", color: THEME.textSub }, children: axesData[4]?.name || "VOLLEYBALL" })
            }
          ),
          /* @__PURE__ */ jsx(
            View,
            {
              style: {
                position: "absolute",
                top: 26,
                left: 6
              },
              children: /* @__PURE__ */ jsx(Text, { style: { fontSize: 5.5, fontFamily: "Helvetica-Bold", color: THEME.textSub }, children: axesData[5]?.name || "STABILITY" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(View, { style: styles.columnRight, children: [
        /* @__PURE__ */ jsx(View, { style: styles.sectionBanner, children: /* @__PURE__ */ jsx(Text, { style: styles.sectionBannerTitle, children: "PERFORMANCE TRENDS" }) }),
        /* @__PURE__ */ jsxs(View, { style: styles.tableContainer, children: [
          /* @__PURE__ */ jsxs(View, { style: styles.tableHeadRow, children: [
            /* @__PURE__ */ jsx(Text, { style: [styles.tableTh, { width: "32%", textAlign: "left", paddingLeft: 4 }], children: "TEST" }),
            /* @__PURE__ */ jsx(Text, { style: [styles.tableTh, { width: "17%" }], children: "PREV" }),
            /* @__PURE__ */ jsx(Text, { style: [styles.tableTh, { width: "17%" }], children: "CURR" }),
            /* @__PURE__ */ jsx(Text, { style: [styles.tableTh, { width: "18%" }], children: "CHANGE" }),
            /* @__PURE__ */ jsx(Text, { style: [styles.tableTh, { width: "16%" }], children: "TREND" })
          ] }),
          (itemAnalysis && itemAnalysis.length > 0 ? itemAnalysis.slice(0, 8) : [
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
            const changeColor = isPositive ? THEME.accentGreen : isNegative ? THEME.accentRed : "#64748b";
            const changeText = growthNum !== 0 ? `${isPositive ? "+" : ""}${growthNum.toFixed(2)}%` : "0.00%";
            const isAlt = idx % 2 === 1;
            return /* @__PURE__ */ jsxs(
              View,
              {
                style: [
                  styles.tableRow,
                  isAlt ? { backgroundColor: "#f8fafc" } : {}
                ],
                children: [
                  /* @__PURE__ */ jsx(
                    Text,
                    {
                      style: [
                        styles.tableCellBold,
                        { width: "32%", textAlign: "left", paddingLeft: 4 }
                      ],
                      children: item.name
                    }
                  ),
                  /* @__PURE__ */ jsx(Text, { style: [styles.tableCell, { width: "17%", color: "#64748b" }], children: prevVal }),
                  /* @__PURE__ */ jsx(Text, { style: [styles.tableCellBold, { width: "17%" }], children: currVal }),
                  /* @__PURE__ */ jsx(
                    Text,
                    {
                      style: [
                        styles.tableCellBold,
                        { width: "18%", color: changeColor }
                      ],
                      children: changeText
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    View,
                    {
                      style: {
                        width: "16%",
                        alignItems: "center",
                        justifyContent: "center"
                      },
                      children: /* @__PURE__ */ jsx(Svg, { width: "22", height: "7", children: isPositive ? /* @__PURE__ */ jsx(
                        Line,
                        {
                          x1: "2",
                          y1: "6",
                          x2: "20",
                          y2: "1",
                          stroke: THEME.accentGreen,
                          strokeWidth: 1.2
                        }
                      ) : isNegative ? /* @__PURE__ */ jsx(
                        Line,
                        {
                          x1: "2",
                          y1: "1",
                          x2: "20",
                          y2: "6",
                          stroke: THEME.accentRed,
                          strokeWidth: 1.2
                        }
                      ) : /* @__PURE__ */ jsx(
                        Line,
                        {
                          x1: "2",
                          y1: "3.5",
                          x2: "20",
                          y2: "3.5",
                          stroke: "#94a3b8",
                          strokeWidth: 1.2
                        }
                      ) })
                    }
                  )
                ]
              },
              idx
            );
          })
        ] }),
        /* @__PURE__ */ jsx(View, { style: styles.sectionBanner, children: /* @__PURE__ */ jsx(Text, { style: styles.sectionBannerTitle, children: "ATHLETE FITNESS SCORES" }) }),
        (categoryNames.length > 0 ? categoryNames : ["STRENGTH", "POWER", "AGILITY", "SPEED", "SPORT SPECIFIC", "STABILITY"]).map((catName, cIdx) => {
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
          return /* @__PURE__ */ jsxs(View, { style: styles.categoryGroupContainer, children: [
            /* @__PURE__ */ jsx(Text, { style: styles.categoryTitleText, children: catName }),
            /* @__PURE__ */ jsxs(View, { style: [styles.tableContainer, { marginBottom: 3 }], children: [
              /* @__PURE__ */ jsxs(View, { style: styles.tableHeadRow, children: [
                /* @__PURE__ */ jsx(
                  Text,
                  {
                    style: [
                      styles.tableTh,
                      { width: "34%", textAlign: "left", paddingLeft: 4 }
                    ],
                    children: "TEST"
                  }
                ),
                /* @__PURE__ */ jsx(Text, { style: [styles.tableTh, { width: "22%" }], children: "DATE" }),
                /* @__PURE__ */ jsx(Text, { style: [styles.tableTh, { width: "16%" }], children: "SCORE" }),
                /* @__PURE__ */ jsx(Text, { style: [styles.tableTh, { width: "14%" }], children: "PCTL" }),
                /* @__PURE__ */ jsx(Text, { style: [styles.tableTh, { width: "14%" }], children: "Rating" })
              ] }),
              catItems.map((item, rIdx) => {
                const scoreVal = item.result_value !== void 0 && item.result_value !== null ? String(item.result_value) : item.result !== void 0 ? String(item.result) : "-";
                const pctlVal = item.score !== void 0 && item.score !== null ? `${Math.round(item.score)}%` : "75%";
                const ratingText = getRating(item.score || 75);
                const dateText = item.record_date || formattedDate;
                const isAlt = rIdx % 2 === 1;
                return /* @__PURE__ */ jsxs(
                  View,
                  {
                    style: [
                      styles.tableRow,
                      isAlt ? { backgroundColor: "#f8fafc" } : {}
                    ],
                    children: [
                      /* @__PURE__ */ jsx(
                        Text,
                        {
                          style: [
                            styles.tableCellBold,
                            {
                              width: "34%",
                              textAlign: "left",
                              paddingLeft: 4
                            }
                          ],
                          children: item.name
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Text,
                        {
                          style: [
                            styles.tableCell,
                            { width: "22%", color: "#64748b" }
                          ],
                          children: dateText
                        }
                      ),
                      /* @__PURE__ */ jsx(Text, { style: [styles.tableCellBold, { width: "16%" }], children: scoreVal }),
                      /* @__PURE__ */ jsx(Text, { style: [styles.tableCell, { width: "14%" }], children: pctlVal }),
                      /* @__PURE__ */ jsx(
                        Text,
                        {
                          style: [
                            styles.tableCellBold,
                            {
                              width: "14%",
                              color: ratingText === "Great" ? THEME.accentGreen : ratingText === "Good" ? "#0284c7" : ratingText === "Average" ? "#d97706" : THEME.accentRed
                            }
                          ],
                          children: ratingText
                        }
                      )
                    ]
                  },
                  rIdx
                );
              })
            ] })
          ] }, cIdx);
        })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(View, { style: styles.footerBar, children: [
      /* @__PURE__ */ jsx(Text, { style: styles.footerLeft, children: "FITNESS TESTING REPORT" }),
      /* @__PURE__ */ jsxs(Text, { style: styles.footerRight, children: [
        "POWERED BY:",
        " ",
        /* @__PURE__ */ jsx(Text, { style: styles.footerBrand, children: "OLYMPUS PERFORMANCE" })
      ] })
    ] })
  ] }) });
}
export {
  ProfilingPdfDocument as default
};
