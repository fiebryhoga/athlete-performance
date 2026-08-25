import React from "react";
import {
    Document,
    Page,
    View,
    Text,
    Image,
    StyleSheet,
    Svg,
    Line as SvgLine,
    Polygon,
    Circle,
    Rect,
    Path,
} from "@react-pdf/renderer";

// ─── THEME & COLOR PALETTE (EXACT FIT FOR REFERENCE REPORT) ───
const THEME = {
    headerBg: "#ea580c", // Vibrant Olympus Orange #ea580c
    headerText: "#ffffff",
    border: "#1e293b",
    borderLight: "#cbd5e1",
    borderLighter: "#e2e8f0",
    bgLight: "#f8fafc",
    bgRowAlt: "#f8fafc",
    textDark: "#0f172a",
    textMuted: "#64748b",
    textSub: "#334155",
    accentGreen: "#16a34a",
    accentRed: "#dc2626",
    accentOrange: "#ea580c",
};

const resolveFullImageUrl = (path) => {
    if (!path) return null;
    if (typeof path !== "string") return null;
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:") || path.startsWith("blob:")) {
        return path;
    }
    let clean = path;
    if (!clean.startsWith("/") && !clean.startsWith("storage/")) {
        clean = `/storage/${clean}`;
    } else if (!clean.startsWith("/")) {
        clean = `/${clean}`;
    }
    if (typeof window !== "undefined" && window.location?.origin) {
        return `${window.location.origin}${clean}`;
    }
    return clean;
};

const styles = StyleSheet.create({
    page: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 22,
        backgroundColor: "#ffffff",
        fontFamily: "Helvetica",
        fontSize: 6.5,
        color: THEME.textDark,
    },

    // ─── 1. TOP MAIN HEADER BANNER ───
    mainHeaderBanner: {
        backgroundColor: "#ffffff",
        borderBottomWidth: 1.5,
        borderBottomColor: "#0f172a",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 0,
        paddingBottom: 5,
        marginBottom: 7,
    },
    mainHeaderLeft: {
        flexDirection: "column",
    },
    mainHeaderTitle: {
        color: "#0f172a",
        fontSize: 12,
        fontFamily: "Helvetica-Bold",
        textTransform: "uppercase",
        letterSpacing: 0.3,
    },
    mainHeaderSubtitle: {
        color: "#64748b",
        fontSize: 6.8,
        fontFamily: "Helvetica",
        marginTop: 2,
    },

    // ─── 2-COLUMN GRID ───
    twoColumnLayout: {
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
    },
    columnLeft: {
        width: "48.8%",
    },
    columnRight: {
        width: "49.2%",
    },

    // ─── SECTION BANNER HEADER ───
    sectionBanner: {
        backgroundColor: THEME.headerBg,
        paddingVertical: 2.2,
        paddingHorizontal: 4,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 2,
    },
    sectionBannerTitle: {
        color: THEME.headerText,
        fontSize: 7,
        fontFamily: "Helvetica-Bold",
        textTransform: "uppercase",
        letterSpacing: 0.4,
    },

    // ─── ATHLETE BIO BOX ───
    athleteBioContainer: {
        borderWidth: 0.8,
        borderColor: THEME.border,
        flexDirection: "row",
        marginBottom: 4.5,
        backgroundColor: "#ffffff",
    },
    avatarBox: {
        width: "36%",
        borderRightWidth: 0.8,
        borderRightColor: THEME.border,
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
        backgroundColor: "#f8fafc",
    },
    avatarImg: {
        width: 48,
        height: 48,
        objectFit: "cover",
        borderRadius: 2,
    },
    avatarSilhouette: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },
    bioTable: {
        width: "64%",
    },
    bioRow: {
        flexDirection: "row",
        borderBottomWidth: 0.6,
        borderBottomColor: THEME.border,
        minHeight: 10,
        alignItems: "center",
    },
    bioRowLast: {
        flexDirection: "row",
        minHeight: 10,
        alignItems: "center",
    },
    bioLabelCell: {
        width: "50%",
        paddingHorizontal: 3,
        paddingVertical: 1.5,
        borderRightWidth: 0.6,
        borderRightColor: THEME.border,
        backgroundColor: "#f8fafc",
    },
    bioLabelText: {
        fontSize: 6,
        fontFamily: "Helvetica-Bold",
        color: THEME.textDark,
    },
    bioValCell: {
        width: "50%",
        paddingHorizontal: 3,
        paddingVertical: 1.5,
        alignItems: "center",
        justifyContent: "center",
    },
    bioValText: {
        fontSize: 6.5,
        fontFamily: "Helvetica-Bold",
        color: THEME.textDark,
        textAlign: "center",
    },

    // ─── DATA TABLE BASE ───
    tableContainer: {
        borderWidth: 0.8,
        borderColor: THEME.border,
        marginBottom: 4.5,
        backgroundColor: "#ffffff",
    },
    tableHeadRow: {
        flexDirection: "row",
        backgroundColor: "#f1f5f9",
        borderBottomWidth: 0.8,
        borderBottomColor: THEME.border,
        paddingVertical: 1.8,
        alignItems: "center",
    },
    tableTh: {
        fontSize: 5.2,
        fontFamily: "Helvetica-Bold",
        color: THEME.textDark,
        textTransform: "uppercase",
        textAlign: "center",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 0.4,
        borderBottomColor: THEME.borderLighter,
        paddingVertical: 1.3,
        alignItems: "center",
    },
    tableCell: {
        fontSize: 5.6,
        color: THEME.textDark,
        textAlign: "center",
    },
    tableCellBold: {
        fontSize: 5.6,
        fontFamily: "Helvetica-Bold",
        color: THEME.textDark,
        textAlign: "center",
    },

    // ─── RADAR CHART BOX ───
    radarBox: {
        borderWidth: 0.8,
        borderColor: THEME.border,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 2,
        backgroundColor: "#ffffff",
        height: 120,
    },

    // ─── RIGHT COLUMN GROUPED FITNESS SCORES ───
    categoryGroupContainer: {
        marginBottom: 3,
    },
    categoryTitleText: {
        fontSize: 6.8,
        fontFamily: "Helvetica-Bold",
        color: THEME.textDark,
        textTransform: "uppercase",
        marginBottom: 1,
        marginTop: 1,
    },

    // ─── MULTI-DOMAIN ASSESSMENT (2x2 GRID OF BALANCED CARDS) ───
    domainGridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        rowGap: 2.5,
        marginTop: 2,
    },
    domainCard: {
        width: "49%",
        borderWidth: 0.5,
        borderColor: THEME.borderLight,
        borderRadius: 1.5,
        backgroundColor: "#ffffff",
        overflow: "hidden",
        minHeight: 34,
    },
    domainCardHeader: {
        backgroundColor: "#f1f5f9",
        paddingHorizontal: 3,
        paddingVertical: 1.8,
        borderBottomWidth: 0.5,
        borderBottomColor: "#e2e8f0",
    },
    domainCardTitle: {
        fontSize: 4.6,
        fontFamily: "Helvetica-Bold",
        color: THEME.textDark,
        textTransform: "uppercase",
        letterSpacing: 0.2,
        textAlign: "center",
    },
    domainCardBody: {
        flex: 1,
        paddingHorizontal: 2,
        paddingVertical: 2.5,
        backgroundColor: "#ffffff",
        justifyContent: "center",
    },
    domainCardBodyRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    domainStatCol: {
        alignItems: "center",
        flex: 1,
    },
    domainStatLabel: {
        fontSize: 3.8,
        fontFamily: "Helvetica-Bold",
        color: "#64748b",
        textTransform: "uppercase",
        textAlign: "center",
    },
    domainStatVal: {
        fontSize: 5.2,
        fontFamily: "Helvetica-Bold",
        color: THEME.textDark,
        marginTop: 0.8,
        textAlign: "center",
    },
    domainEmpty: {
        fontSize: 4.2,
        fontFamily: "Helvetica",
        color: "#94a3b8",
        fontStyle: "italic",
        textAlign: "center",
        paddingVertical: 4,
    },

    // ─── FOOTER ───
    footerBar: {
        position: "absolute",
        bottom: 8,
        left: 22,
        right: 22,
        borderTopWidth: 0.6,
        borderTopColor: "#94a3b8",
        paddingTop: 3,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    footerLeft: {
        fontSize: 5.2,
        fontFamily: "Helvetica",
        color: "#475569",
    },
    footerRight: {
        fontSize: 5.2,
        fontFamily: "Helvetica-Bold",
        color: THEME.textDark,
    },
});

export default function ProfilingPdfDocument({
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
    clubLogo,
    printDate,
}) {
    // ─── DATES & LABELS ───
    const formattedDate = printDate || new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const now = new Date();
    const generatedDateStr = now.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
    const generatedTimeStr = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });
    const athleteName = (athlete?.name || "ATHLETE NAME").toUpperCase();
    const sportName = (
        stats?.sport ||
        athlete?.sport?.name ||
        "All-Around"
    ).toUpperCase();
    const resolvedLogoUrl =
        clubLogo ||
        (typeof window !== "undefined"
            ? `${window.location.origin}/assets/images/otslogo2.png`
            : "/assets/images/otslogo2.png");

    const calculateAge = (dob) => {
        if (!dob) return null;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    const ageVal =
        athlete?.age !== undefined && athlete?.age !== null
            ? `${athlete.age}`
            : athlete?.date_of_birth
              ? `${calculateAge(athlete.date_of_birth)}`
              : "-";

    const heightVal = athlete?.height ? `${athlete.height}` : "-";
    const weightVal = athlete?.weight ? `${athlete.weight}` : "-";
    const bmrVal =
        latest_composition?.bmr !== undefined && latest_composition?.bmr !== null
            ? `${latest_composition.bmr}`
            : athlete?.bmr
              ? `${athlete.bmr}`
              : "-";

    // ─── CATEGORY MAPPING ───
    const categoriesMap = {};
    (itemAnalysis || []).forEach((item) => {
        const cat = (item.category || "General").toUpperCase();
        if (!categoriesMap[cat]) {
            categoriesMap[cat] = [];
        }
        categoriesMap[cat].push(item);
    });

    const categoryNames = Object.keys(categoriesMap);

    const getScoreBadge = (score) => {
        const val = parseFloat(score) || 0;
        if (val >= 90)
            return {
                label: "Sangat Baik",
                color: "#059669",
            };
        if (val >= 80)
            return {
                label: "Baik",
                color: "#0d9488",
            };
        if (val >= 70)
            return {
                label: "Cukup",
                color: "#d97706",
            };
        if (val >= 60)
            return {
                label: "Kurang",
                color: "#ea580c",
            };
        return {
            label: "Sangat Kurang",
            color: "#e11d48",
        };
    };

    // ─── RADAR / SPIDER CHART SVG GENERATION ───
    const defaultRadarCategories = [
        { name: "STRENGTH", key: "Strength" },
        { name: "POWER", key: "Power" },
        { name: "AGILITY", key: "Agility" },
        { name: "SPEED", key: "Speed" },
        { name: "VOLLEYBALL", key: "Sport" },
        { name: "STABILITY", key: "Stability" },
    ];

    const radarSource =
        radarData && radarData.length >= 3 ? radarData : defaultRadarCategories;
    const numAxes = radarSource.length;

    const cx = 120;
    const cy = 70;
    const radius = 45;

    const gridLevels = [0.33, 0.66, 1.0];
    const gridPolygons = gridLevels.map((lvl) => {
        return Array.from({ length: numAxes })
            .map((_, i) => {
                const angle = -Math.PI / 2 + (i * 2 * Math.PI) / numAxes;
                const x = cx + radius * lvl * Math.cos(angle);
                const y = cy + radius * lvl * Math.sin(angle);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(" ");
    });

    const athleteScorePoints = radarSource
        .map((item, i) => {
            const rawScore = Number(item.A ?? item.score ?? 65);
            const normScore = Math.min(100, Math.max(15, rawScore)) / 100;
            const angle = -Math.PI / 2 + (i * 2 * Math.PI) / numAxes;
            const x = cx + radius * normScore * Math.cos(angle);
            const y = cy + radius * normScore * Math.sin(angle);
            return {
                x,
                y,
                score: rawScore,
                str: `${x.toFixed(1)},${y.toFixed(1)}`
            };
        });

    const labelRadius = radius + 12;
    const axesData = radarSource.map((item, i) => {
        const rawScore = Number(item.A ?? item.score ?? 0);
        const scoreFormatted = rawScore % 1 === 0 ? rawScore : rawScore.toFixed(1);
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / numAxes;
        const x2 = cx + radius * Math.cos(angle);
        const y2 = cy + radius * Math.sin(angle);
        const lx = cx + labelRadius * Math.cos(angle);
        const ly = cy + labelRadius * Math.sin(angle);
        const name = (
            item.subject ||
            item.name ||
            `CAT ${i + 1}`
        ).toUpperCase();
        return { x1: cx, y1: cy, x2, y2, lx, ly, name, score: rawScore, scoreFormatted };
    });

    return (
        <Document title={`Physical Test Report - ${athleteName}`}>
            <Page size="A4" orientation="portrait" style={styles.page}>
                {/* ─── 1. TOP MAIN HEADER BANNER ─── */}
                <View style={styles.mainHeaderBanner}>
                    <View style={styles.mainHeaderLeft}>
                        <Text style={styles.mainHeaderTitle}>
                            {sportName} PHYSICAL TEST REPORT
                        </Text>
                        <Text style={styles.mainHeaderSubtitle}>
                            Olympus Athlete Performance & Development System
                        </Text>
                    </View>
                    <View style={{ alignItems: "flex-end", justifyContent: "center" }}>
                        <Image
                            src={resolvedLogoUrl}
                            style={{ width: 140, height: 36, objectFit: "contain" }}
                        />
                    </View>
                </View>

                {/* ─── 2. MAIN 2-COLUMN LAYOUT ─── */}
                <View style={styles.twoColumnLayout}>
                    {/* ═══════════════════════════════════════════════════════
                        KOLOM KIRI (LEFT COLUMN):
                        - ATHLETE NAME BOX (PHOTO + SPECS)
                        - TEAM AVERAGES / BENCHMARK TABLE
                        - ATHLETE PROFILE (RADAR CHART)
                       ═══════════════════════════════════════════════════════ */}
                    <View style={styles.columnLeft}>
                        {/* ── A. ATHLETE NAME BANNER & BOX ── */}
                        <View style={styles.sectionBanner}>
                            <Text style={styles.sectionBannerTitle}>
                                {athleteName}
                            </Text>
                        </View>

                        <View style={styles.athleteBioContainer}>
                            {/* Athlete Photo / Silhouette */}
                            <View style={styles.avatarBox}>
                                {athlete?.profile_photo_url ? (
                                    <Image
                                        src={athlete.profile_photo_url}
                                        style={styles.avatarImg}
                                    />
                                ) : (
                                    <View style={styles.avatarSilhouette}>
                                        <Svg width="40" height="40" viewBox="0 0 100 100">
                                            <Circle cx="50" cy="28" r="16" fill="#0f172a" />
                                            <Path
                                                d="M 22 84 C 22 58, 34 48, 50 48 C 66 48, 78 58, 78 84 Z"
                                                fill="#0f172a"
                                            />
                                        </Svg>
                                    </View>
                                )}
                            </View>

                            {/* Specs Table */}
                            <View style={styles.bioTable}>
                                <View style={styles.bioRow}>
                                    <View style={styles.bioLabelCell}>
                                        <Text style={styles.bioLabelText}>Sport</Text>
                                    </View>
                                    <View style={styles.bioValCell}>
                                        <Text style={styles.bioValText}>
                                            {stats?.sport || athlete?.sport?.name || "Volleyball"}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.bioRow}>
                                    <View style={styles.bioLabelCell}>
                                        <Text style={styles.bioLabelText}>Age</Text>
                                    </View>
                                    <View style={styles.bioValCell}>
                                        <Text style={styles.bioValText}>{ageVal}</Text>
                                    </View>
                                </View>
                                <View style={styles.bioRow}>
                                    <View style={styles.bioLabelCell}>
                                        <Text style={styles.bioLabelText}>Height (cm)</Text>
                                    </View>
                                    <View style={styles.bioValCell}>
                                        <Text style={styles.bioValText}>{heightVal}</Text>
                                    </View>
                                </View>
                                <View style={styles.bioRow}>
                                    <View style={styles.bioLabelCell}>
                                        <Text style={styles.bioLabelText}>Weight (kg)</Text>
                                    </View>
                                    <View style={styles.bioValCell}>
                                        <Text style={styles.bioValText}>{weightVal}</Text>
                                    </View>
                                </View>
                                <View style={styles.bioRowLast}>
                                    <View style={styles.bioLabelCell}>
                                        <Text style={styles.bioLabelText}>BMR</Text>
                                    </View>
                                    <View style={styles.bioValCell}>
                                        <Text style={styles.bioValText}>{bmrVal}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* ── B. RADAR KATEGORI FISIK (SPIDER / RADAR CHART) ── */}
                        <View style={styles.sectionBanner}>
                            <Text style={styles.sectionBannerTitle}>RADAR KATEGORI FISIK</Text>
                        </View>

                        <View style={[styles.radarBox, { height: 140, paddingVertical: 2 }]}>
                            <Svg width="240" height="136" viewBox="0 0 240 136">
                                <Polygon
                                    points={gridPolygons[2]}
                                    fill="none"
                                    stroke={THEME.borderLighter}
                                    strokeWidth={0.8}
                                />
                                <Polygon
                                    points={gridPolygons[1]}
                                    fill="none"
                                    stroke={THEME.borderLighter}
                                    strokeWidth={0.6}
                                    strokeDasharray="2,2"
                                />
                                <Polygon
                                    points={gridPolygons[0]}
                                    fill="none"
                                    stroke={THEME.borderLighter}
                                    strokeWidth={0.5}
                                    strokeDasharray="2,2"
                                />

                                {axesData.map((axis, i) => (
                                    <SvgLine
                                        key={`axis-${i}`}
                                        x1={axis.x1}
                                        y1={axis.y1}
                                        x2={axis.x2}
                                        y2={axis.y2}
                                        stroke={THEME.borderLighter}
                                        strokeWidth={0.6}
                                    />
                                ))}

                                <Polygon
                                    points={athleteScorePoints.map((p) => p.str).join(" ")}
                                    fill={THEME.headerBg}
                                    fillOpacity={0.22}
                                    stroke={THEME.headerBg}
                                    strokeWidth={1.5}
                                />

                                {athleteScorePoints.map((pt, i) => (
                                    <Circle
                                        key={`pt-${i}`}
                                        cx={pt.x}
                                        cy={pt.y}
                                        r="2.4"
                                        fill={THEME.headerBg}
                                    />
                                ))}

                                {axesData.map((axis, i) => (
                                    <React.Fragment key={`label-${i}`}>
                                        <Text
                                            x={axis.lx}
                                            y={axis.ly - 2}
                                            textAnchor="middle"
                                            style={{
                                                fontSize: 5.2,
                                                fontFamily: "Helvetica-Bold",
                                                fill: "#334155",
                                            }}
                                        >
                                            {axis.name}
                                        </Text>
                                        <Text
                                            x={axis.lx}
                                            y={axis.ly + 4.2}
                                            textAnchor="middle"
                                            style={{
                                                fontSize: 5.4,
                                                fontFamily: "Helvetica-Bold",
                                                fill: THEME.headerBg,
                                            }}
                                        >
                                            {axis.scoreFormatted}
                                        </Text>
                                    </React.Fragment>
                                ))}
                            </Svg>
                        </View>

                        {/* ── C. KOMPARASI SESI TERKINI (BAR CHART) ── */}
                        <View style={[styles.sectionBanner, { marginTop: 4 }]}>
                            <Text style={styles.sectionBannerTitle}>KOMPARASI SESI TERKINI</Text>
                        </View>

                        <View style={[styles.tableContainer, { padding: 5, marginBottom: 2 }]}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                                <Text style={{ fontSize: 5.5, color: "#64748b", fontFamily: "Helvetica" }}>
                                    Perbandingan kategori sesi terkini vs sebelumnya (0 – 100)
                                </Text>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                                        <View style={{ width: 5, height: 5, backgroundColor: "#cbd5e1", borderRadius: 1 }} />
                                        <Text style={{ fontSize: 4.8, color: "#64748b" }}>Sebelumnya</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                                        <View style={{ width: 5, height: 5, backgroundColor: "#f97316", borderRadius: 1 }} />
                                        <Text style={{ fontSize: 4.8, color: "#ea580c", fontFamily: "Helvetica-Bold" }}>Terkini</Text>
                                    </View>
                                </View>
                            </View>

                            {(() => {
                                const barCats =
                                    comparisonData && comparisonData.length > 0
                                        ? comparisonData
                                        : [
                                              { name: "Agility", previous: 56.2, latest: 100 },
                                              { name: "Speed", previous: 97.0, latest: 75.6 },
                                              { name: "Strength", previous: 32.4, latest: 93.3 },
                                              { name: "Endurance", previous: 56.4, latest: 88.9 },
                                          ];

                                const N = barCats.length;
                                const step = 200 / Math.max(1, N);

                                return (
                                    <Svg width="235" height="98" viewBox="0 0 235 98">
                                        {/* Grid lines */}
                                        {[0, 25, 50, 75, 100].map((val) => {
                                            const y = 80 - (val / 100) * 65;
                                            return (
                                                <React.Fragment key={`grid-${val}`}>
                                                    <SvgLine
                                                        x1="18"
                                                        y1={y}
                                                        x2="230"
                                                        y2={y}
                                                        stroke="#f1f5f9"
                                                        strokeWidth={0.6}
                                                        strokeDasharray="2,2"
                                                    />
                                                    <Text
                                                        x="12"
                                                        y={y + 1.8}
                                                        textAnchor="end"
                                                        style={{ fontSize: 4.5, fill: "#94a3b8", fontFamily: "Helvetica" }}
                                                    >
                                                        {val}
                                                    </Text>
                                                </React.Fragment>
                                            );
                                        })}

                                        {/* Baseline */}
                                        <SvgLine x1="18" y1="80" x2="230" y2="80" stroke="#cbd5e1" strokeWidth={0.8} />

                                        {/* Bars */}
                                        {barCats.map((item, idx) => {
                                            const xc = 25 + (idx + 0.5) * step;
                                            const p = Math.min(100, Math.max(0, Number(item.previous || 0)));
                                            const c = Math.min(100, Math.max(0, Number(item.latest || 0)));
                                            const hp = (p / 100) * 65;
                                            const hc = (c / 100) * 65;

                                            const catDisplayName =
                                                item.name.length > 11 ? item.name.substring(0, 10) + ".." : item.name;

                                            return (
                                                <React.Fragment key={`bar-${idx}`}>
                                                    {/* Previous Bar */}
                                                    {p > 0 && (
                                                        <>
                                                            <Rect
                                                                x={xc - 8.5}
                                                                y={80 - hp}
                                                                width={7.5}
                                                                height={hp}
                                                                fill="#cbd5e1"
                                                            />
                                                            <Text
                                                                x={xc - 4.7}
                                                                y={80 - hp - 2}
                                                                textAnchor="middle"
                                                                style={{ fontSize: 4.6, fill: "#64748b", fontFamily: "Helvetica" }}
                                                            >
                                                                {p % 1 === 0 ? p : p.toFixed(1)}
                                                            </Text>
                                                        </>
                                                    )}

                                                    {/* Latest Bar */}
                                                    {c > 0 && (
                                                        <>
                                                            <Rect
                                                                x={xc + 0.5}
                                                                y={80 - hc}
                                                                width={7.5}
                                                                height={hc}
                                                                fill="#f97316"
                                                            />
                                                            <Text
                                                                x={xc + 4.2}
                                                                y={80 - hc - 2}
                                                                textAnchor="middle"
                                                                style={{ fontSize: 4.8, fill: "#ea580c", fontFamily: "Helvetica-Bold" }}
                                                            >
                                                                {c % 1 === 0 ? c : c.toFixed(1)}
                                                            </Text>
                                                        </>
                                                    )}

                                                    {/* Category label */}
                                                    <Text
                                                        x={xc}
                                                        y="90"
                                                        textAnchor="middle"
                                                        style={{ fontSize: 4.8, fill: "#334155", fontFamily: "Helvetica-Bold" }}
                                                    >
                                                        {catDisplayName}
                                                    </Text>
                                                </React.Fragment>
                                            );
                                        })}
                                    </Svg>
                                );
                            })()}

                            <View style={{ borderTopWidth: 0.5, borderTopColor: "#f1f5f9", paddingTop: 2, marginTop: 1 }}>
                                <Text style={{ fontSize: 5, color: "#64748b" }}>
                                    Total Kategori:{" "}
                                    <Text style={{ fontFamily: "Helvetica-Bold", color: THEME.textDark }}>
                                        {comparisonData?.length || 0} Elemen
                                    </Text>
                                </Text>
                            </View>
                        </View>

                        {/* ── D. STATUS MULTI-DOMAIN ASESMEN (2x2 BALANCED GRID) ── */}
                        <View style={[styles.sectionBanner, { marginTop: 4 }]}>
                            <Text style={styles.sectionBannerTitle}>STATUS MULTI-DOMAIN ASESMEN</Text>
                        </View>

                        <View style={styles.domainGridContainer}>
                            {/* Card 1: PHV & Pertumbuhan */}
                            <View style={styles.domainCard}>
                                <View style={styles.domainCardHeader}>
                                    <Text style={styles.domainCardTitle}>PHV & PERTUMBUHAN</Text>
                                </View>
                                {latest_phv ? (
                                    <View style={styles.domainCardBody}>
                                        <View style={styles.domainCardBodyRow}>
                                            <View style={styles.domainStatCol}>
                                                <Text style={styles.domainStatLabel}>Offset</Text>
                                                <Text style={styles.domainStatVal}>
                                                    {Number(latest_phv.maturity_offset).toFixed(1)} thn
                                                </Text>
                                            </View>
                                            <View style={styles.domainStatCol}>
                                                <Text style={styles.domainStatLabel}>Prediksi</Text>
                                                <Text style={styles.domainStatVal}>
                                                    {latest_phv.predicted_adult_height || "-"} cm
                                                </Text>
                                            </View>
                                            <View style={styles.domainStatCol}>
                                                <Text style={styles.domainStatLabel}>Sisa Tumbuh</Text>
                                                <Text style={[styles.domainStatVal, { color: THEME.headerBg }]}>
                                                    +{latest_phv.remaining_growth || "-"} cm
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.domainCardBody}>
                                        <Text style={styles.domainEmpty}>Belum ada data PHV</Text>
                                    </View>
                                )}
                            </View>

                            {/* Card 2: Komposisi Tubuh */}
                            <View style={styles.domainCard}>
                                <View style={styles.domainCardHeader}>
                                    <Text style={styles.domainCardTitle}>KOMPOSISI TUBUH</Text>
                                </View>
                                {latest_composition ? (
                                    <View style={styles.domainCardBody}>
                                        <View style={styles.domainCardBodyRow}>
                                            <View style={styles.domainStatCol}>
                                                <Text style={styles.domainStatLabel}>Body Fat</Text>
                                                <Text style={[styles.domainStatVal, { color: THEME.headerBg }]}>
                                                    {latest_composition.body_fat_percentage ?? "-"}%
                                                </Text>
                                            </View>
                                            <View style={styles.domainStatCol}>
                                                <Text style={styles.domainStatLabel}>Muscle</Text>
                                                <Text style={styles.domainStatVal}>
                                                    {latest_composition.muscle_mass ?? "-"} kg
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={[styles.domainCardBodyRow, { marginTop: 2 }]}>
                                            <View style={styles.domainStatCol}>
                                                <Text style={styles.domainStatLabel}>BMR</Text>
                                                <Text style={styles.domainStatVal}>
                                                    {latest_composition.bmr ?? "-"} kcal
                                                </Text>
                                            </View>
                                            <View style={styles.domainStatCol}>
                                                <Text style={styles.domainStatLabel}>Visceral</Text>
                                                <Text style={styles.domainStatVal}>
                                                    Lvl {latest_composition.visceral_fat_level ?? "-"}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.domainCardBody}>
                                        <Text style={styles.domainEmpty}>Belum ada data komposisi</Text>
                                    </View>
                                )}
                            </View>

                            {/* Card 3: Beban Latihan & Wellness */}
                            <View style={styles.domainCard}>
                                <View style={styles.domainCardHeader}>
                                    <Text style={styles.domainCardTitle}>BEBAN LATIHAN & WELLNESS</Text>
                                </View>
                                {latest_wellness ? (
                                    <View style={styles.domainCardBody}>
                                        <View style={styles.domainCardBodyRow}>
                                            <View style={styles.domainStatCol}>
                                                <Text style={styles.domainStatLabel}>Wellness</Text>
                                                <Text style={[styles.domainStatVal, { color: "#059669" }]}>
                                                    {latest_wellness.daily_wellness_score ?? "-"}/30
                                                </Text>
                                            </View>
                                            <View style={styles.domainStatCol}>
                                                <Text style={styles.domainStatLabel}>Session RPE</Text>
                                                <Text style={styles.domainStatVal}>
                                                    {latest_wellness.session_rpe ?? "-"}/10
                                                </Text>
                                            </View>
                                            <View style={styles.domainStatCol}>
                                                <Text style={styles.domainStatLabel}>Daily Load</Text>
                                                <Text style={[styles.domainStatVal, { color: THEME.headerBg }]}>
                                                    {latest_wellness.daily_load ?? 0} AU
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.domainCardBody}>
                                        <Text style={styles.domainEmpty}>Belum ada data wellness</Text>
                                    </View>
                                )}
                            </View>

                            {/* Card 4: Postur Dinamis (DPA) */}
                            <View style={styles.domainCard}>
                                <View style={styles.domainCardHeader}>
                                    <Text style={styles.domainCardTitle}>POSTUR DINAMIS (DPA)</Text>
                                </View>
                                {latest_dpa ? (
                                    <View style={styles.domainCardBody}>
                                        <View style={{ alignItems: "center" }}>
                                            <Text style={styles.domainStatLabel}>Hasil Postur</Text>
                                            <Text style={[styles.domainStatVal, { marginTop: 0.8 }]}>
                                                {latest_dpa.conclusion || "Normal"}
                                            </Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.domainCardBody}>
                                        <Text style={styles.domainEmpty}>Belum ada data postur (DPA)</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* ═══════════════════════════════════════════════════════
                        KOLOM KANAN (RIGHT COLUMN):
                        - PERFORMANCE TRENDS TABLE
                        - ATHLETE FITNESS SCORES (GROUPED BY CATEGORY)
                       ═══════════════════════════════════════════════════════ */}
                    <View style={styles.columnRight}>
                        {/* ── A. PERFORMANCE TRENDS (SKOR PER KATEGORI & TREND) ── */}
                        <View style={styles.sectionBanner}>
                            <Text style={styles.sectionBannerTitle}>PERFORMANCE TRENDS</Text>
                        </View>

                        <View style={styles.tableContainer}>
                            <View style={styles.tableHeadRow}>
                                <Text style={[styles.tableTh, { width: "38%", textAlign: "left", paddingLeft: 4 }]}>
                                    CATEGORY
                                </Text>
                                <Text style={[styles.tableTh, { width: "20%" }]}>PREV</Text>
                                <Text style={[styles.tableTh, { width: "21%" }]}>CURRENT</Text>
                                <Text style={[styles.tableTh, { width: "21%" }]}>CHANGE</Text>
                            </View>

                            {(() => {
                                // Derive category-level trends
                                let catTrends = [];

                                if (comparisonData && comparisonData.length > 0) {
                                    catTrends = comparisonData.map((cd) => {
                                        const prev = Number(cd.previous || 0);
                                        const curr = Number(cd.latest || 0);
                                        const diff = prev > 0 ? curr - prev : 0;
                                        return {
                                            name: cd.name,
                                            prev: prev > 0 ? prev : null,
                                            curr: curr,
                                            change: diff,
                                            hasPrev: prev > 0,
                                        };
                                    });
                                } else {
                                    // Calculate from categoriesMap
                                    const cNames =
                                        categoryNames.length > 0
                                            ? categoryNames
                                            : ["STRENGTH", "POWER", "AGILITY", "SPEED", "SPORT", "STABILITY"];

                                    catTrends = cNames.map((cName) => {
                                        const items = categoriesMap[cName] || [];
                                        const currScores = items
                                            .map((it) => Number(it.score))
                                            .filter((s) => !isNaN(s) && s > 0);
                                        const prevScores = items
                                            .map((it) => Number(it.previous_score || it.previous_value))
                                            .filter((s) => !isNaN(s) && s > 0);

                                        const currAvg =
                                            currScores.length > 0
                                                ? currScores.reduce((a, b) => a + b, 0) / currScores.length
                                                : 75;
                                        const prevAvg =
                                            prevScores.length > 0
                                                ? prevScores.reduce((a, b) => a + b, 0) / prevScores.length
                                                : null;

                                        const diff = prevAvg !== null ? currAvg - prevAvg : 0;

                                        return {
                                            name: cName,
                                            prev: prevAvg,
                                            curr: currAvg,
                                            change: diff,
                                            hasPrev: prevAvg !== null,
                                        };
                                    });
                                }

                                return catTrends.map((cat, idx) => {
                                    const prevText = cat.hasPrev && cat.prev !== null ? `${cat.prev.toFixed(1)}%` : "-";
                                    const currText = `${cat.curr.toFixed(1)}%`;
                                    const isPositive = cat.change > 0;
                                    const isNegative = cat.change < 0;
                                    const changeColor = !cat.hasPrev
                                        ? "#64748b"
                                        : isPositive
                                          ? THEME.accentGreen
                                          : isNegative
                                            ? THEME.accentRed
                                            : "#64748b";
                                    const changeText = !cat.hasPrev
                                        ? "-"
                                        : `${isPositive ? "+" : ""}${cat.change.toFixed(1)}%`;

                                    const isAlt = idx % 2 === 1;

                                    return (
                                        <View
                                            key={idx}
                                            style={[
                                                styles.tableRow,
                                                isAlt ? { backgroundColor: "#f8fafc" } : {},
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.tableCellBold,
                                                    { width: "38%", textAlign: "left", paddingLeft: 4 },
                                                ]}
                                            >
                                                {cat.name}
                                            </Text>
                                            <Text style={[styles.tableCell, { width: "20%", color: "#64748b" }]}>
                                                {prevText}
                                            </Text>
                                            <Text style={[styles.tableCellBold, { width: "21%" }]}>
                                                {currText}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.tableCellBold,
                                                    { width: "21%", color: changeColor },
                                                ]}
                                            >
                                                {changeText}
                                            </Text>
                                        </View>
                                    );
                                });
                            })()}
                        </View>

                        {/* ── B. PHYSICAL TEST SCORE (BY CATEGORY) ── */}
                        <View style={styles.sectionBanner}>
                            <Text style={styles.sectionBannerTitle}>PHYSICAL TEST SCORE</Text>
                        </View>

                        {(categoryNames.length > 0
                            ? categoryNames
                            : ["STRENGTH", "POWER", "AGILITY", "SPEED", "SPORT SPECIFIC", "STABILITY"]
                        ).map((catName, cIdx) => {
                            const catItems =
                                categoriesMap[catName] ||
                                (catName === "STRENGTH"
                                    ? [
                                          { name: "Chin Up", previous_value: "-", result_value: "13", target_value: "15", score: 77 },
                                          { name: "BF %", previous_value: "5.5", result_value: "5.7", target_value: "5.0", score: 97 },
                                          { name: "Lean Mass", previous_value: "98.8", result_value: "101", target_value: "110", score: 77 },
                                      ]
                                    : catName === "POWER"
                                      ? [
                                            { name: "Broad Jump", previous_value: "300.5", result_value: "297", target_value: "300", score: 94 },
                                            { name: "Jump Mat NCM", previous_value: "-", result_value: "30.5", target_value: "35", score: 81 },
                                            { name: "Jump Mat CMJ", previous_value: "-", result_value: "32.5", target_value: "36", score: 88 },
                                        ]
                                      : catName === "AGILITY"
                                        ? [
                                              { name: "Pro Agil R", previous_value: "-", result_value: "4.1", target_value: "4.0", score: 85 },
                                              { name: "Pro Agil L", previous_value: "-", result_value: "4.0", target_value: "4.0", score: 87 },
                                          ]
                                        : catName === "SPEED"
                                          ? [{ name: "10m Sprint", previous_value: "1.665", result_value: "1.617", target_value: "1.60", score: 100 }]
                                          : catName === "SPORT SPECIFIC"
                                            ? [
                                                  { name: "Approach Raw", previous_value: "141.5", result_value: "142", target_value: "145", score: 100 },
                                                  { name: "Block Raw", previous_value: "131.5", result_value: "131.5", target_value: "135", score: 97 },
                                              ]
                                            : [
                                                  { name: "FMS OHS", previous_value: "-", result_value: "2", target_value: "3", score: 66 },
                                                  { name: "Dorsi-L", previous_value: "-", result_value: "5", target_value: "5", score: 78 },
                                                  { name: "Dorsi-R", previous_value: "-", result_value: "5", target_value: "5", score: 75 },
                                              ]);

                            return (
                                <View key={cIdx} style={styles.categoryGroupContainer}>
                                    <Text style={styles.categoryTitleText}>{catName}</Text>

                                    <View style={[styles.tableContainer, { marginBottom: 2 }]}>
                                        <View style={styles.tableHeadRow}>
                                            <Text
                                                style={[
                                                    styles.tableTh,
                                                    { width: "29%", textAlign: "left", paddingLeft: 4 },
                                                ]}
                                            >
                                                ITEM TEST
                                            </Text>
                                            <Text style={[styles.tableTh, { width: "13%" }]}>PREV</Text>
                                            <Text style={[styles.tableTh, { width: "14%" }]}>CURRENT</Text>
                                            <Text style={[styles.tableTh, { width: "14%" }]}>TARGET</Text>
                                            <Text style={[styles.tableTh, { width: "15%" }]}>CHANGE</Text>
                                            <Text style={[styles.tableTh, { width: "15%" }]}>RATING</Text>
                                        </View>

                                        {catItems.map((item, rIdx) => {
                                            const prevVal =
                                                item.previous_value !== undefined && item.previous_value !== null && item.previous_value !== ""
                                                    ? String(item.previous_value)
                                                    : item.previous_result !== undefined && item.previous_result !== null && item.previous_result !== ""
                                                      ? String(item.previous_result)
                                                      : item.previous !== undefined && item.previous !== null && item.previous !== ""
                                                        ? String(item.previous)
                                                        : item.prev !== undefined && item.prev !== null && item.prev !== ""
                                                          ? String(item.prev)
                                                          : item.prev_0 !== undefined && item.prev_0 !== null && item.prev_0 !== "" && Number(item.prev_0) > 0
                                                            ? String(item.prev_0)
                                                            : "-";

                                            const currVal =
                                                item.result_value !== undefined && item.result_value !== null
                                                    ? String(item.result_value)
                                                    : item.result !== undefined && item.result !== null
                                                      ? String(item.result)
                                                      : "-";

                                            const targetVal =
                                                item.target_value !== undefined && item.target_value !== null
                                                    ? String(item.target_value)
                                                    : item.target !== undefined && item.target !== null
                                                      ? String(item.target)
                                                      : "-";

                                            // Growth calculation
                                            let growthNum = null;
                                            if (item.growth !== undefined && item.growth !== null && item.growth !== "") {
                                                growthNum = Number(item.growth);
                                            } else if (item.growth_rate !== undefined && item.growth_rate !== null) {
                                                growthNum = Number(item.growth_rate);
                                            } else if (prevVal !== "-" && currVal !== "-") {
                                                const p = parseFloat(prevVal);
                                                const c = parseFloat(currVal);
                                                if (!isNaN(p) && !isNaN(c) && p > 0) {
                                                    growthNum = ((c - p) / p) * 100;
                                                }
                                            }

                                            const hasGrowth = growthNum !== null && !isNaN(growthNum) && prevVal !== "-";
                                            const isPositive = hasGrowth && growthNum > 0;
                                            const isNegative = hasGrowth && growthNum < 0;
                                            const changeColor = !hasGrowth
                                                ? "#64748b"
                                                : isPositive
                                                  ? THEME.accentGreen
                                                  : isNegative
                                                    ? THEME.accentRed
                                                    : "#64748b";
                                            const changeText = !hasGrowth
                                                ? "-"
                                                : `${isPositive ? "+" : ""}${growthNum.toFixed(1)}%`;

                                            const scoreNum = item.score !== undefined && item.score !== null ? Number(item.score) : 75;
                                            const ratingObj = getScoreBadge(scoreNum);

                                            const isAlt = rIdx % 2 === 1;

                                            return (
                                                <View
                                                    key={rIdx}
                                                    style={[
                                                        styles.tableRow,
                                                        isAlt ? { backgroundColor: "#f8fafc" } : {},
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.tableCellBold,
                                                            {
                                                                width: "29%",
                                                                textAlign: "left",
                                                                paddingLeft: 4,
                                                            },
                                                        ]}
                                                    >
                                                        {item.name}
                                                    </Text>
                                                    <Text
                                                        style={[
                                                            styles.tableCell,
                                                            { width: "13%", color: "#64748b" },
                                                        ]}
                                                    >
                                                        {prevVal}
                                                    </Text>
                                                    <Text style={[styles.tableCellBold, { width: "14%" }]}>
                                                        {currVal}
                                                    </Text>
                                                    <Text
                                                        style={[
                                                            styles.tableCell,
                                                            { width: "14%", color: "#64748b" },
                                                        ]}
                                                    >
                                                        {targetVal}
                                                    </Text>
                                                    <Text
                                                        style={[
                                                            styles.tableCellBold,
                                                            { width: "15%", color: changeColor },
                                                        ]}
                                                    >
                                                        {changeText}
                                                    </Text>
                                                    <Text
                                                        style={[
                                                            styles.tableCellBold,
                                                            {
                                                                width: "15%",
                                                                color: ratingObj.color,
                                                                fontSize: 5.4,
                                                            },
                                                        ]}
                                                    >
                                                        {ratingObj.label}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* ─── 3. GALERI BIOMETRIK & DOKUMENTASI FISIK (2-GRID HORIZONTAL CARDS) ─── */}
                <View break style={{ marginTop: 6 }}>
                    <View style={styles.sectionBanner}>
                        <Text style={styles.sectionBannerTitle}>GALERI BIOMETRIK & DOKUMENTASI FISIK</Text>
                    </View>

                    <View style={{ marginTop: 2 }}>
                        {galleries && galleries.length > 0 ? (
                            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 4 }}>
                                {galleries.map((photo, pIdx) => {
                                    const photoDate = photo.created_at
                                        ? new Date(photo.created_at).toLocaleDateString("id-ID", {
                                              day: "numeric",
                                              month: "short",
                                              year: "numeric",
                                          })
                                        : "-";
                                    const imgSrc = resolveFullImageUrl(photo.image_path);

                                    return (
                                        <View
                                            key={pIdx}
                                            wrap={false}
                                            style={{
                                                width: "48.8%",
                                                flexDirection: "row",
                                                borderWidth: 0.6,
                                                borderColor: THEME.borderLight,
                                                borderRadius: 2,
                                                backgroundColor: "#ffffff",
                                                overflow: "hidden",
                                                marginBottom: 2,
                                            }}
                                        >
                                            {/* Gambar di Sisi Kiri */}
                                            <View
                                                style={{
                                                    width: "42%",
                                                    height: 105,
                                                    backgroundColor: "#f1f5f9",
                                                    borderRightWidth: 0.5,
                                                    borderRightColor: THEME.borderLight,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                {imgSrc ? (
                                                    <Image
                                                        src={imgSrc}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "contain",
                                                        }}
                                                    />
                                                ) : (
                                                    <Text style={{ fontSize: 5, color: "#94a3b8" }}>No Image</Text>
                                                )}
                                            </View>

                                            {/* Keterangan di Sisi Kanan */}
                                            <View
                                                style={{
                                                    width: "58%",
                                                    padding: 4,
                                                    backgroundColor: "#f8fafc",
                                                    justifyContent: "flex-start",
                                                }}
                                            >
                                                <Text style={{ fontSize: 5.8, fontFamily: "Helvetica-Bold", color: THEME.textDark, marginBottom: 1.5 }}>
                                                    {photoDate}
                                                </Text>
                                                {photo.notes ? (
                                                    <Text
                                                        style={{
                                                            fontSize: 5.0,
                                                            fontFamily: "Helvetica",
                                                            color: "#334155",
                                                            lineHeight: 1.35,
                                                        }}
                                                    >
                                                        {photo.notes}
                                                    </Text>
                                                ) : (
                                                    <Text style={{ fontSize: 4.8, fontFamily: "Helvetica", color: "#94a3b8", fontStyle: "italic" }}>
                                                        Tidak ada catatan tambahan.
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        ) : (
                            <View style={{ paddingVertical: 4, alignItems: "center", justifyContent: "center", borderWidth: 0.5, borderColor: THEME.borderLight, borderRadius: 1.5, backgroundColor: "#f8fafc" }}>
                                <Text style={{ fontSize: 5.2, fontFamily: "Helvetica", color: "#94a3b8", fontStyle: "italic" }}>
                                    Belum ada dokumentasi foto biometrik atlet
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* ─── 4. BOTTOM FOOTER BAR ─── */}
                <View style={styles.footerBar} fixed>
                    <Text style={styles.footerLeft}>
                        Olympus Training Surabaya - Generated: {generatedDateStr} {generatedTimeStr}
                    </Text>
                    <Text
                        style={styles.footerRight}
                        render={({ pageNumber, totalPages }) =>
                            `Hal ${pageNumber} / ${totalPages}`
                        }
                    />
                </View>
            </Page>
        </Document>
    );
}
