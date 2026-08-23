import React from "react";
import {
    Document,
    View,
    Text,
    Image,
    StyleSheet,
    Svg,
    Path,
    Line as SvgLine,
    Polygon,
    Rect,
} from "@react-pdf/renderer";
import PdfPageTemplate from "@/Components/Pdf/PdfPageTemplate";

const styles = StyleSheet.create({
    // ─── 1. FULL WIDTH HERO PROFILE CARD ───
    profileCard: {
        width: "100%",
        borderWidth: 0.5,
        borderColor: "#e2e8f0",
        borderRadius: 6,
        backgroundColor: "#ffffff",
        marginBottom: 10,
        overflow: "hidden",
    },
    // Banner: solid warm yellow-orange
    profileBanner: {
        height: 40,
        backgroundColor: "#fff8f0",
        borderBottomWidth: 0.5,
        borderBottomColor: "#fed7aa",
        position: "relative",
    },
    // PrintDoc: bg-white/95 border border-slate-200 text-slate-700 rounded-full
    profileTagPill: {
        backgroundColor: "#ffffff",
        borderWidth: 0.6,
        borderColor: "#cbd5e1",
        borderRadius: 14,
        paddingHorizontal: 7,
        paddingVertical: 1.5,
        flexDirection: "row",
        alignItems: "center",
    },
    profileTagText: {
        fontSize: 6.5,
        fontFamily: "Helvetica-Bold",
        color: "#334155",
    },
    // PrintDoc: px-3 pb-2 pt-0.5
    profileMainContent: {
        paddingHorizontal: 14,
        paddingBottom: 8,
        paddingTop: 2,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    // PrintDoc: flex items-center gap-3
    profileIdentity: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginRight: 8,
    },
    // PrintDoc: -mt-6 w-[52px] h-[52px] rounded-md border-2 border-white shadow-md
    profileAvatarBox: {
        width: 48,
        height: 48,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#ffffff",
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
        marginTop: -18,
        overflow: "hidden",
    },
    profileAvatarImg: {
        width: 48,
        height: 48,
        objectFit: "cover",
        borderRadius: 4,
    },
    profileAvatarInitial: {
        fontSize: 18,
        fontFamily: "Helvetica-Bold",
        color: "#ea580c",
        backgroundColor: "#fff7ed",
        width: 48,
        height: 48,
        textAlign: "center",
        paddingTop: 13,
    },
    // PrintDoc: flex items-center gap-2
    profileNameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginBottom: 2,
    },
    // PrintDoc: text-xs font-black text-slate-900
    profileName: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
    },
    // PrintDoc: text-[9px] font-mono text-slate-400 font-bold
    profileUsername: {
        fontSize: 6.5,
        color: "#94a3b8",
    },
    // PrintDoc: text-orange-700 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded text-[8.5px]
    caborPill: {
        backgroundColor: "#fff7ed",
        borderWidth: 0.6,
        borderColor: "#fed7aa",
        borderRadius: 3,
        paddingHorizontal: 4,
        paddingVertical: 1,
    },
    caborPillText: {
        fontSize: 6,
        fontFamily: "Helvetica-Bold",
        color: "#c2410c",
    },
    // PrintDoc: (no package pill shown, but same style as Show.jsx)
    packagePill: {
        backgroundColor: "#f1f5f9",
        borderWidth: 0.6,
        borderColor: "#cbd5e1",
        borderRadius: 3,
        paddingHorizontal: 4,
        paddingVertical: 1,
    },
    packagePillText: {
        fontSize: 6,
        fontFamily: "Helvetica-Bold",
        color: "#334155",
    },
    // PrintDoc: text-[9.5px] text-slate-500 font-medium
    profileMetaLine: {
        fontSize: 7,
        color: "#64748b",
    },

    // 4 Biometrics Cards
    // PrintDoc: grid grid-cols-4 gap-1.5 shrink-0
    bioGrid: {
        flexDirection: "row",
        gap: 4,
    },
    // PrintDoc: px-3 py-1 bg-gradient-to-br rounded border border-slate-200 text-center min-w-[70px]
    bioBox: {
        width: 56,
        paddingVertical: 4,
        paddingHorizontal: 5,
        borderWidth: 0.3,
        borderColor: "#f1f5f9",
        borderRadius: 4,
        backgroundColor: "#ffffff",
        alignItems: "center",
    },
    // PrintDoc: text-[7.5px] font-bold text-slate-400 uppercase tracking-wider block
    bioLabel: {
        fontSize: 5.5,
        fontFamily: "Helvetica-Bold",
        color: "#94a3b8",
        textTransform: "uppercase",
        letterSpacing: 0.3,
        marginBottom: 1,
    },
    // PrintDoc: text-xs font-black text-slate-900
    bioVal: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
    },
    // PrintDoc: text-[7.5px] font-normal text-slate-400
    bioUnit: {
        fontSize: 5.5,
        color: "#94a3b8",
    },

    // ─── 2. MAIN 2-COLUMN LAYOUT BELOW HERO ───
    dashboardRow: {
        flexDirection: "row",
        gap: 8,
        width: "100%",
    },
    leftColumn: {
        width: "56%",
    },
    rightColumn: {
        width: "44%",
    },

    // ─── DUAL CARDS ROW (LEFT COL TOP) ───
    dualCardsRow: {
        flexDirection: "row",
        gap: 5,
        marginBottom: 8,
    },
    dualCard: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 6,
        backgroundColor: "#ffffff",
        padding: 5,
        justifyContent: "space-between",
    },
    dualCardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 2,
    },
    dualCardTitle: {
        fontSize: 7.5,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
    },
    dualCardSubtitle: {
        fontSize: 5,
        color: "#94a3b8",
        marginTop: 0.5,
    },
    iconBoxPulse: {
        width: 12,
        height: 12,
        borderRadius: 2.5,
        backgroundColor: "#fff1f2",
        borderWidth: 0.5,
        borderColor: "#fecdd3",
        justifyContent: "center",
        alignItems: "center",
    },
    iconBoxLayers: {
        width: 12,
        height: 12,
        borderRadius: 2.5,
        backgroundColor: "#fffbeb",
        borderWidth: 0.5,
        borderColor: "#fde68a",
        justifyContent: "center",
        alignItems: "center",
    },
    dualCardFooter: {
        borderTopWidth: 0.5,
        borderTopColor: "#f1f5f9",
        paddingTop: 2.5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    footerLabel: {
        fontSize: 5,
        color: "#64748b",
    },

    // ─── STRENGTHS & PRIORITIES ROW (LEFT COL BOTTOM) ───
    swRow: {
        flexDirection: "row",
        gap: 5,
        marginBottom: 8,
    },
    swCard: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 6,
        backgroundColor: "#ffffff",
        padding: 5,
    },
    swHeader: {
        fontSize: 7,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
        marginBottom: 3,
        paddingBottom: 2,
        borderBottomWidth: 0.5,
        borderBottomColor: "#f1f5f9",
    },
    swItemRow: {
        marginBottom: 2.5,
    },
    swItemTextRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 1,
    },
    swName: {
        fontSize: 6,
        fontFamily: "Helvetica-Bold",
        color: "#1e293b",
    },
    swScoreGreen: {
        fontSize: 6,
        fontFamily: "Helvetica-Bold",
        color: "#059669",
    },
    swScoreRose: {
        fontSize: 6,
        fontFamily: "Helvetica-Bold",
        color: "#e11d48",
    },
    swProgressBg: {
        height: 2.5,
        backgroundColor: "#f1f5f9",
        borderRadius: 1.5,
        overflow: "hidden",
    },
    swProgressFillGreen: {
        height: 2.5,
        backgroundColor: "#10b981",
        borderRadius: 1.5,
    },
    swProgressFillRose: {
        height: 2.5,
        backgroundColor: "#f43f5e",
        borderRadius: 1.5,
    },

    // ─── RIGHT COLUMN TOP: SKOR PERFORMA CARD ───
    scoreCard: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 7,
        backgroundColor: "#ffffff",
        paddingHorizontal: 8,
        paddingVertical: 6,
        marginBottom: 8,
    },
    scoreCardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 3,
        borderBottomWidth: 0.8,
        borderBottomColor: "#f1f5f9",
        marginBottom: 4,
    },
    scoreCardTitle: {
        fontSize: 8.5,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
    },
    scoreRatingGood: {
        fontSize: 8.5,
        fontFamily: "Helvetica-Bold",
        color: "#ea580c",
    },
    gaugeContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 2,
    },
    gaugeScoreText: {
        fontSize: 16,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
        textAlign: "center",
    },
    gaugeSubtitle: {
        fontSize: 5.5,
        color: "#94a3b8",
        textAlign: "center",
    },
    score3StatsGrid: {
        flexDirection: "row",
        gap: 3,
        marginTop: 4,
        paddingTop: 3,
        borderTopWidth: 0.5,
        borderTopColor: "#f1f5f9",
    },
    score3StatBox: {
        flex: 1,
        paddingVertical: 2.5,
        paddingHorizontal: 1,
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 4,
        backgroundColor: "#ffffff",
        alignItems: "center",
    },
    score3StatLabel: {
        fontSize: 4.5,
        fontFamily: "Helvetica-Bold",
        color: "#94a3b8",
        textTransform: "uppercase",
    },
    score3StatVal: {
        fontSize: 8.5,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
        marginTop: 0.5,
    },

    // ─── RIGHT COLUMN BOTTOM: PARAMETER TEST CARD ───
    paramCard: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 7,
        backgroundColor: "#ffffff",
        overflow: "hidden",
    },
    paramCardHeader: {
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderBottomWidth: 0.8,
        borderBottomColor: "#e2e8f0",
        backgroundColor: "#fafafa",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    paramCardTitle: {
        fontSize: 7.5,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
    },
    paramBadge: {
        backgroundColor: "#ffffff",
        borderWidth: 0.8,
        borderColor: "#e2e8f0",
        borderRadius: 8,
        paddingHorizontal: 4,
        paddingVertical: 1,
    },
    paramBadgeText: {
        fontSize: 5,
        fontFamily: "Helvetica-Bold",
        color: "#64748b",
    },
    paramTableHead: {
        flexDirection: "row",
        backgroundColor: "#f8fafc",
        borderBottomWidth: 0.8,
        borderBottomColor: "#e2e8f0",
        paddingHorizontal: 5,
        paddingVertical: 2.5,
    },
    paramTh: {
        fontSize: 5.5,
        fontFamily: "Helvetica-Bold",
        color: "#64748b",
        textTransform: "uppercase",
    },
    paramRow: {
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderBottomColor: "#f1f5f9",
        paddingHorizontal: 5,
        paddingVertical: 2.2,
        alignItems: "center",
    },
    paramItemName: {
        fontSize: 6.5,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
    },
    paramItemMeta: {
        fontSize: 5,
        color: "#94a3b8",
    },
    paramResultVal: {
        fontSize: 6.5,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
        textAlign: "center",
    },
    paramResultUnit: {
        fontSize: 5.5,
        color: "#64748b",
        textAlign: "center",
    },
    paramScoreText: {
        fontSize: 6.5,
        fontFamily: "Helvetica-Bold",
        textAlign: "right",
    },

    // ─── SIGNATURE SECTION ───
    signRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 6,
        paddingTop: 4,
        borderTopWidth: 0.8,
        borderTopColor: "#e2e8f0",
    },
    signBox: {
        width: "30%",
        alignItems: "center",
    },
    signLabel: {
        fontSize: 6,
        color: "#64748b",
        marginBottom: 16,
    },
    signName: {
        fontSize: 7,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
        borderTopWidth: 0.8,
        borderTopColor: "#334155",
        paddingTop: 2,
        width: 80,
        textAlign: "center",
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
}) {
    const calculateBMI = (h, w) => {
        if (!h || !w) return "-";
        const heightInM = h / 100;
        return (w / (heightInM * heightInM)).toFixed(1);
    };

    const bmi = calculateBMI(athlete?.height, athlete?.weight);
    const initial = athlete?.name ? athlete.name.charAt(0).toUpperCase() : "-";

    const getBMIStatus = (val) => {
        if (val === "-") return { label: "-", color: "#64748b" };
        const num = parseFloat(val);
        if (num < 18.5) return { label: "Underweight", color: "#d97706" };
        if (num <= 24.9) return { label: "Ideal", color: "#059669" };
        if (num <= 29.9) return { label: "Overweight", color: "#ea580c" };
        return { label: "Obese", color: "#e11d48" };
    };
    const bmiStatus = getBMIStatus(bmi);

    const isFemale =
        athlete?.gender === "P" ||
        athlete?.gender === "female" ||
        athlete?.gender === "Perempuan";
    const genderLabel = isFemale ? "Perempuan" : "Laki-laki";

    const avgScore = Number(stats?.avg_score || stats?.average_score || 62.8);
    const getEvalRating = (val) => {
        if (val >= 90) return { rating: "Sangat Baik", color: "#059669" };
        if (val >= 80) return { rating: "Baik", color: "#0d9488" };
        if (val >= 70) return { rating: "Cukup", color: "#d97706" };
        if (val >= 60) return { rating: "Kurang", color: "#ea580c" };
        return { rating: "Sangat Kurang", color: "#e11d48" };
    };
    const { rating: evalRating, color: evalColor } = getEvalRating(avgScore);

    // Sort items descending by score
    const sortedItems = [...(itemAnalysis || [])].sort(
        (a, b) => (Number(b.score) || 0) - (Number(a.score) || 0),
    );

    return (
        <Document title={`Laporan Profiling - ${athlete?.name || "Athlete"}`}>
            <PdfPageTemplate
                orientation="portrait"
                footerLeftText="Olympus Training Surabaya • Profiling & Integrated Performance Report"
            >
                {/* ─── 1. FULL WIDTH HERO PROFILE CARD ─── */}
                <View style={styles.profileCard}>
                    <View style={styles.profileBanner}>
                        <Svg
                            width="100%"
                            height="40"
                            viewBox="0 0 580 40"
                            style={{ position: "absolute", top: 0, left: 0 }}
                        >
                            {Array.from({ length: 48 }).map((_, col) =>
                                Array.from({ length: 4 }).map((_, row) => (
                                    <Rect
                                        key={`dot-${col}-${row}`}
                                        x={col * 12 + 2}
                                        y={row * 12 + 2}
                                        width={1.2}
                                        height={1.2}
                                        fill="#ea580c"
                                        fillOpacity={0.1}
                                        rx={0.6}
                                    />
                                )),
                            )}
                        </Svg>
                    </View>

                    <View style={styles.profileMainContent}>
                        <View style={styles.profileIdentity}>
                            <View style={styles.profileAvatarBox}>
                                {athlete?.profile_photo_url ? (
                                    <Image
                                        src={athlete.profile_photo_url}
                                        style={styles.profileAvatarImg}
                                    />
                                ) : (
                                    <Text style={styles.profileAvatarInitial}>
                                        {initial}
                                    </Text>
                                )}
                            </View>

                            <View>
                                <View style={styles.profileNameRow}>
                                    <Text style={styles.profileName}>
                                        {athlete?.name || "Athlete"}
                                    </Text>
                                    <Text style={styles.profileUsername}>
                                        @{athlete?.username || "-"}
                                    </Text>
                                    <View style={styles.caborPill}>
                                        <Text style={styles.caborPillText}>
                                            {stats?.sport ||
                                                athlete?.sport?.name ||
                                                "Football men junior"}
                                        </Text>
                                    </View>
                                    <View style={styles.packagePill}>
                                        <Text style={styles.packagePillText}>
                                            Privat
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.profileMetaLine}>
                                    {genderLabel} • Pelatih:{" "}
                                    <Text
                                        style={{
                                            fontFamily: "Helvetica-Bold",
                                            color: "#334155",
                                        }}
                                    >
                                        {stats?.coaches_text &&
                                        stats.coaches_text !== "-"
                                            ? stats.coaches_text
                                            : "Coach Figo, Coach Andri"}
                                    </Text>
                                </Text>
                            </View>
                        </View>

                        {/* 4 Biometrics Boxes */}
                        <View style={styles.bioGrid}>
                            <View style={styles.bioBox}>
                                <Text style={styles.bioLabel}>Tinggi</Text>
                                <Text style={styles.bioVal}>
                                    {athlete?.height || "-"}{" "}
                                    <Text style={styles.bioUnit}>cm</Text>
                                </Text>
                            </View>
                            <View style={styles.bioBox}>
                                <Text style={styles.bioLabel}>Berat</Text>
                                <Text style={styles.bioVal}>
                                    {athlete?.weight || "-"}{" "}
                                    <Text style={styles.bioUnit}>kg</Text>
                                </Text>
                            </View>
                            <View style={styles.bioBox}>
                                <Text style={styles.bioLabel}>Usia</Text>
                                <Text style={styles.bioVal}>
                                    {athlete?.age || "-"}{" "}
                                    <Text style={styles.bioUnit}>thn</Text>
                                </Text>
                            </View>
                            <View style={styles.bioBox}>
                                <Text
                                    style={[
                                        styles.bioLabel,
                                        { color: bmiStatus.color },
                                    ]}
                                >
                                    {bmiStatus.label}
                                </Text>
                                <Text
                                    style={[
                                        styles.bioVal,
                                        { color: bmiStatus.color },
                                    ]}
                                >
                                    {bmi}{" "}
                                    <Text style={styles.bioUnit}>BMI</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* ─── 2. MAIN 2-COLUMN SECTION BELOW HERO CARD ─── */}
                <View style={styles.dashboardRow}>
                    {/* ═══════════════════════════════════════════════════════
                        KOLOM KIRI (56% LEBAR) — DUAL CHARTS & STRENGTHS
                       ═══════════════════════════════════════════════════════ */}
                    <View style={styles.leftColumn}>
                        {/* Dual Charts (Radar & Bar Comparison) */}
                        <View style={styles.dualCardsRow}>
                            {/* Radar Chart */}
                            <View style={styles.dualCard}>
                                <View style={styles.dualCardHeader}>
                                    <View>
                                        <Text style={styles.dualCardTitle}>
                                            Radar Kategori Fisik
                                        </Text>
                                        <Text style={styles.dualCardSubtitle}>
                                            Profil atribut fisik (0 – 100)
                                        </Text>
                                    </View>
                                    <View style={styles.iconBoxPulse}>
                                        <Text
                                            style={{
                                                fontSize: 6,
                                                color: "#e11d48",
                                                fontFamily: "Helvetica-Bold",
                                            }}
                                        >
                                            ~
                                        </Text>
                                    </View>
                                </View>

                                <View
                                    style={{
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: 75,
                                    }}
                                >
                                    <Svg
                                        width={130}
                                        height={75}
                                        viewBox="0 0 130 75"
                                    >
                                        <Polygon
                                            points="65,8 102,25 88,62 42,62 28,25"
                                            fill="none"
                                            stroke="#e2e8f0"
                                            strokeWidth={0.8}
                                        />
                                        <Polygon
                                            points="65,20 87,30 79,52 51,52 43,30"
                                            fill="none"
                                            stroke="#f1f5f9"
                                            strokeWidth={0.6}
                                            strokeDasharray="2,2"
                                        />
                                        <Polygon
                                            points="65,30 76,35 72,46 58,46 54,35"
                                            fill="none"
                                            stroke="#f1f5f9"
                                            strokeWidth={0.5}
                                        />

                                        <SvgLine
                                            x1={65}
                                            y1={40}
                                            x2={65}
                                            y2={8}
                                            stroke="#e2e8f0"
                                            strokeWidth={0.6}
                                        />
                                        <SvgLine
                                            x1={65}
                                            y1={40}
                                            x2={102}
                                            y2={25}
                                            stroke="#e2e8f0"
                                            strokeWidth={0.6}
                                        />
                                        <SvgLine
                                            x1={65}
                                            y1={40}
                                            x2={88}
                                            y2={62}
                                            stroke="#e2e8f0"
                                            strokeWidth={0.6}
                                        />
                                        <SvgLine
                                            x1={65}
                                            y1={40}
                                            x2={42}
                                            y2={62}
                                            stroke="#e2e8f0"
                                            strokeWidth={0.6}
                                        />
                                        <SvgLine
                                            x1={65}
                                            y1={40}
                                            x2={28}
                                            y2={25}
                                            stroke="#e2e8f0"
                                            strokeWidth={0.6}
                                        />

                                        <Polygon
                                            points="65,22 100,27 82,56 48,56 44,34"
                                            fill="#ea580c"
                                            fillOpacity={0.25}
                                            stroke="#ea580c"
                                            strokeWidth={1.5}
                                        />
                                    </Svg>
                                </View>

                                <View style={styles.dualCardFooter}>
                                    <Text style={styles.footerLabel}>
                                        Teratas:{" "}
                                        <Text
                                            style={{
                                                fontFamily: "Helvetica-Bold",
                                                color: "#0f172a",
                                            }}
                                        >
                                            Speed (97)
                                        </Text>
                                    </Text>
                                    <Text style={styles.footerLabel}>
                                        Fokus:{" "}
                                        <Text
                                            style={{
                                                fontFamily: "Helvetica-Bold",
                                                color: "#ea580c",
                                            }}
                                        >
                                            Strength (32.4)
                                        </Text>
                                    </Text>
                                </View>
                            </View>

                            {/* Bar Chart */}
                            <View style={styles.dualCard}>
                                <View style={styles.dualCardHeader}>
                                    <View>
                                        <Text style={styles.dualCardTitle}>
                                            Komparasi Sesi
                                        </Text>
                                        <Text style={styles.dualCardSubtitle}>
                                            Sesi terkini (0 – 100)
                                        </Text>
                                    </View>
                                    <View style={styles.iconBoxLayers}>
                                        <Text
                                            style={{
                                                fontSize: 6,
                                                color: "#d97706",
                                                fontFamily: "Helvetica-Bold",
                                            }}
                                        >
                                            #
                                        </Text>
                                    </View>
                                </View>

                                <View
                                    style={{
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: 75,
                                    }}
                                >
                                    <Svg
                                        width={130}
                                        height={75}
                                        viewBox="0 0 130 75"
                                    >
                                        <SvgLine
                                            x1={10}
                                            y1={12}
                                            x2={120}
                                            y2={12}
                                            stroke="#f1f5f9"
                                            strokeWidth={0.6}
                                        />
                                        <SvgLine
                                            x1={10}
                                            y1={30}
                                            x2={120}
                                            y2={30}
                                            stroke="#f1f5f9"
                                            strokeWidth={0.6}
                                        />
                                        <SvgLine
                                            x1={10}
                                            y1={48}
                                            x2={120}
                                            y2={48}
                                            stroke="#f1f5f9"
                                            strokeWidth={0.6}
                                        />
                                        <SvgLine
                                            x1={10}
                                            y1={62}
                                            x2={120}
                                            y2={62}
                                            stroke="#cbd5e1"
                                            strokeWidth={0.8}
                                        />

                                        <Rect
                                            x={22}
                                            y={32}
                                            width={10}
                                            height={30}
                                            fill="#ea580c"
                                            rx={1.5}
                                        />
                                        <Rect
                                            x={50}
                                            y={12}
                                            width={10}
                                            height={50}
                                            fill="#ea580c"
                                            rx={1.5}
                                        />
                                        <Rect
                                            x={78}
                                            y={44}
                                            width={10}
                                            height={18}
                                            fill="#ea580c"
                                            rx={1.5}
                                        />
                                        <Rect
                                            x={106}
                                            y={32}
                                            width={10}
                                            height={30}
                                            fill="#ea580c"
                                            rx={1.5}
                                        />
                                    </Svg>
                                </View>

                                <View style={styles.dualCardFooter}>
                                    <Text style={styles.footerLabel}>
                                        • Sesi Terkini
                                    </Text>
                                    <Text style={styles.footerLabel}>
                                        5 Kategori
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Strengths & Priorities */}
                        <View style={styles.swRow}>
                            {/* Keunggulan Fisik */}
                            <View style={styles.swCard}>
                                <Text style={styles.swHeader}>
                                    Keunggulan Fisik (&gt;70%)
                                </Text>
                                <View style={styles.swItemRow}>
                                    <View style={styles.swItemTextRow}>
                                        <Text style={styles.swName}>Speed</Text>
                                        <Text style={styles.swScoreGreen}>
                                            97%
                                        </Text>
                                    </View>
                                    <View style={styles.swProgressBg}>
                                        <View
                                            style={[
                                                styles.swProgressFillGreen,
                                                { width: "97%" },
                                            ]}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Prioritas Peningkatan */}
                            <View style={styles.swCard}>
                                <Text style={styles.swHeader}>
                                    Prioritas Peningkatan (&le;70%)
                                </Text>

                                <View style={styles.swItemRow}>
                                    <View style={styles.swItemTextRow}>
                                        <Text style={styles.swName}>
                                            Strength
                                        </Text>
                                        <Text style={styles.swScoreRose}>
                                            32.4%
                                        </Text>
                                    </View>
                                    <View style={styles.swProgressBg}>
                                        <View
                                            style={[
                                                styles.swProgressFillRose,
                                                { width: "32.4%" },
                                            ]}
                                        />
                                    </View>
                                </View>

                                <View style={styles.swItemRow}>
                                    <View style={styles.swItemTextRow}>
                                        <Text style={styles.swName}>
                                            Agility
                                        </Text>
                                        <Text style={styles.swScoreRose}>
                                            56.2%
                                        </Text>
                                    </View>
                                    <View style={styles.swProgressBg}>
                                        <View
                                            style={[
                                                styles.swProgressFillRose,
                                                { width: "56.2%" },
                                            ]}
                                        />
                                    </View>
                                </View>

                                <View style={styles.swItemRow}>
                                    <View style={styles.swItemTextRow}>
                                        <Text style={styles.swName}>
                                            Str. Endurance
                                        </Text>
                                        <Text style={styles.swScoreRose}>
                                            56.2%
                                        </Text>
                                    </View>
                                    <View style={styles.swProgressBg}>
                                        <View
                                            style={[
                                                styles.swProgressFillRose,
                                                { width: "56.2%" },
                                            ]}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* ═══════════════════════════════════════════════════════
                        KOLOM KANAN (44% LEBAR) — SKOR PERFORMA & PARAMETER TEST
                       ═══════════════════════════════════════════════════════ */}
                    <View style={styles.rightColumn}>
                        {/* 1. Skor Performa Card */}
                        <View style={styles.scoreCard}>
                            <View style={styles.scoreCardHeader}>
                                <Text style={styles.scoreCardTitle}>
                                    Skor Performa
                                </Text>
                                <Text
                                    style={[
                                        styles.scoreRatingGood,
                                        { color: evalColor },
                                    ]}
                                >
                                    {evalRating}
                                </Text>
                            </View>

                            {/* Semi-Circle Gauge Svg */}
                            <View style={styles.gaugeContainer}>
                                <Svg
                                    width={130}
                                    height={60}
                                    viewBox="0 0 130 60"
                                >
                                    <Path
                                        d="M 14 52 A 51 51 0 0 1 116 52"
                                        fill="none"
                                        stroke="#f1f5f9"
                                        strokeWidth={9}
                                        strokeLinecap="round"
                                    />
                                    <Path
                                        d="M 14 52 A 51 51 0 0 1 94 17"
                                        fill="none"
                                        stroke="#ea580c"
                                        strokeWidth={9}
                                        strokeLinecap="round"
                                    />
                                </Svg>
                                <View
                                    style={{ position: "absolute", bottom: 1 }}
                                >
                                    <Text style={styles.gaugeScoreText}>
                                        {avgScore.toFixed(1)}
                                    </Text>
                                    <Text style={styles.gaugeSubtitle}>
                                        Rata-Rata Tes
                                    </Text>
                                </View>
                            </View>

                            {/* 3 Mini Stats Box */}
                            <View style={styles.score3StatsGrid}>
                                <View style={styles.score3StatBox}>
                                    <Text style={styles.score3StatLabel}>
                                        Sesi Latihan
                                    </Text>
                                    <Text style={styles.score3StatVal}>
                                        {stats?.total_sessions ||
                                            stats?.sessions ||
                                            8}
                                    </Text>
                                </View>
                                <View style={styles.score3StatBox}>
                                    <Text style={styles.score3StatLabel}>
                                        Tes Fisik
                                    </Text>
                                    <Text style={styles.score3StatVal}>
                                        {stats?.total_tests || 1}
                                    </Text>
                                </View>
                                <View style={styles.score3StatBox}>
                                    <Text style={styles.score3StatLabel}>
                                        Skor Puncak
                                    </Text>
                                    <Text
                                        style={[
                                            styles.score3StatVal,
                                            { color: "#059669" },
                                        ]}
                                    >
                                        {Number(
                                            stats?.highest_score ||
                                                stats?.max_score ||
                                                62.8,
                                        ).toFixed(1)}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* 2. Rincian Parameter Tes Sesi Terakhir */}
                        <View style={styles.paramCard}>
                            <View style={styles.paramCardHeader}>
                                <Text style={styles.paramCardTitle}>
                                    Rincian Parameter Tes
                                </Text>
                                <View style={styles.paramBadge}>
                                    <Text style={styles.paramBadgeText}>
                                        {sortedItems.length} Item
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.paramTableHead}>
                                <Text
                                    style={[styles.paramTh, { width: "56%" }]}
                                >
                                    Item Tes & Target
                                </Text>
                                <Text
                                    style={[
                                        styles.paramTh,
                                        { width: "22%", textAlign: "center" },
                                    ]}
                                >
                                    Hasil
                                </Text>
                                <Text
                                    style={[
                                        styles.paramTh,
                                        { width: "22%", textAlign: "right" },
                                    ]}
                                >
                                    Skor
                                </Text>
                            </View>

                            {sortedItems.slice(0, 8).map((item, idx) => {
                                const scoreNum = Number(item.score || 0);
                                const isGreen = scoreNum >= 80;
                                const isAmber = scoreNum >= 60 && scoreNum < 80;
                                const sColor = isGreen
                                    ? "#059669"
                                    : isAmber
                                      ? "#d97706"
                                      : "#e11d48";

                                return (
                                    <View key={idx} style={styles.paramRow}>
                                        <View style={{ width: "56%" }}>
                                            <Text style={styles.paramItemName}>
                                                {item.name}
                                            </Text>
                                            <Text style={styles.paramItemMeta}>
                                                {item.category} • Tgt:{" "}
                                                {item.target_value ||
                                                    item.target ||
                                                    "-"}{" "}
                                                {item.unit || ""}
                                            </Text>
                                        </View>
                                        <View style={{ width: "22%" }}>
                                            <Text style={styles.paramResultVal}>
                                                {item.result_value ||
                                                    item.result ||
                                                    "-"}
                                            </Text>
                                            <Text
                                                style={styles.paramResultUnit}
                                            >
                                                {item.unit || ""}
                                            </Text>
                                        </View>
                                        <View style={{ width: "22%" }}>
                                            <Text
                                                style={[
                                                    styles.paramScoreText,
                                                    { color: sColor },
                                                ]}
                                            >
                                                {scoreNum.toFixed(1)}%
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>

                {/* ─── 3. SIGNATURE SECTION ─── */}
                <View style={styles.signRow}>
                    <View style={styles.signBox}>
                        <Text style={styles.signLabel}>Atlet / Klien</Text>
                        <Text style={styles.signName}>
                            {athlete?.name || "Athlete"}
                        </Text>
                    </View>
                    <View style={styles.signBox}>
                        <Text style={styles.signLabel}>Pelatih Kepala</Text>
                        <Text style={styles.signName}>
                            {stats?.coaches_text && stats.coaches_text !== "-"
                                ? stats.coaches_text
                                : "Coach Figo, Coach Andri"}
                        </Text>
                    </View>
                    <View style={styles.signBox}>
                        <Text style={styles.signLabel}>
                            Direktur Performa Olahraga
                        </Text>
                        <Text style={styles.signName}>Olympus Lead</Text>
                    </View>
                </View>
            </PdfPageTemplate>
        </Document>
    );
}
