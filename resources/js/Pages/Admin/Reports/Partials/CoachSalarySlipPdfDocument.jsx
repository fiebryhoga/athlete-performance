import React from "react";
import {
    Document,
    Page,
    View,
    Text,
    Image,
    StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        paddingTop: 24,
        paddingBottom: 24,
        paddingHorizontal: 28,
        backgroundColor: "#ffffff",
        fontFamily: "Helvetica",
        fontSize: 8,
        color: "#0f172a",
        lineHeight: 1.3,
    },
    // Top Main Header Banner
    headerBanner: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 9,
        borderBottomWidth: 0.8,
        borderBottomColor: "#0f172a",
        marginBottom: 12,
    },
    headerLeft: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 12.5,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
        textTransform: "uppercase",
        letterSpacing: 0.4,
    },
    headerSubtitle: {
        fontSize: 8,
        color: "#64748b",
        marginTop: 4,
    },
    headerLogo: {
        width: 110,
        height: 30,
        objectFit: "contain",
    },

    // Metadata 2-Columns
    metaContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
        paddingVertical: 2,
    },
    metaColumn: {
        width: "48%",
    },
    metaRow: {
        flexDirection: "row",
        marginBottom: 3,
    },
    metaKey: {
        width: 90,
        color: "#334155",
        fontSize: 8,
    },
    metaSep: {
        width: 8,
        color: "#64748b",
        fontSize: 8,
    },
    metaVal: {
        flex: 1,
        color: "#0f172a",
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
    },
    metaValRegular: {
        flex: 1,
        color: "#0f172a",
        fontSize: 8,
    },

    divider: {
        borderBottomWidth: 0.8,
        borderBottomColor: "#cbd5e1",
        width: "100%",
        marginBottom: 10,
    },

    // Main Summary Pendapatan
    summarySection: {
        marginBottom: 12,
        width: "55%",
    },
    summaryTitle: {
        fontSize: 9,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
        marginBottom: 6,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 3.5,
    },
    summaryLabel: {
        fontSize: 8,
        color: "#334155",
        flex: 1,
    },
    summarySep: {
        width: 10,
        color: "#64748b",
        fontSize: 8,
    },
    summaryAmount: {
        width: 85,
        textAlign: "right",
        fontSize: 8,
        color: "#0f172a",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 0.8,
        borderTopColor: "#cbd5e1",
        marginTop: 6,
        paddingTop: 5,
    },
    totalLabel: {
        fontSize: 8.5,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
        flex: 1,
    },
    totalAmount: {
        width: 85,
        textAlign: "right",
        fontSize: 8.5,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
    },

    // ─── MULTI-GRID DETAIL SECTION (TANPA PEMBUNGKUS / TANPA WARNA LAIN) ───
    detailSectionHeader: {
        fontSize: 8.5,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
        marginBottom: 6,
        marginTop: 2,
    },
    gridContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    gridColumn: {
        width: "48.5%",
    },
    gridColumnFull: {
        width: "100%",
        marginBottom: 8,
    },
    gridHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 3,
        borderBottomWidth: 0.8,
        borderBottomColor: "#cbd5e1",
        marginBottom: 4,
    },
    gridTitle: {
        fontSize: 7.5,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
    },
    gridSubtotal: {
        fontSize: 7.5,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
    },
    gridItemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 1.8,
        borderBottomWidth: 0.4,
        borderBottomColor: "#f1f5f9",
    },
    gridItemLeft: {
        flexDirection: "row",
        flex: 1,
        marginRight: 6,
    },
    gridItemNo: {
        width: 14,
        fontSize: 6.5,
        color: "#64748b",
    },
    gridItemDate: {
        width: 46,
        fontSize: 6.5,
        color: "#475569",
    },
    gridItemDesc: {
        flex: 1,
        fontSize: 6.5,
        color: "#0f172a",
    },
    gridItemFee: {
        width: 52,
        textAlign: "right",
        fontSize: 6.5,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
    },
    emptyGridText: {
        fontSize: 6.5,
        color: "#94a3b8",
        fontStyle: "italic",
        paddingVertical: 2,
    },

    // Signature Block (Kanan Bawah Rata Kanan)
    signContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 12,
    },
    signBox: {
        width: 180,
        alignItems: "flex-end",
    },
    signDate: {
        fontSize: 7.5,
        color: "#334155",
        marginBottom: 3,
        textAlign: "right",
    },
    signRole: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
        marginBottom: 44,
        textAlign: "right",
    },
    signName: {
        fontSize: 7.5,
        color: "#334155",
        textAlign: "right",
    },

    // Footer
    footerText: {
        position: "absolute",
        bottom: 8,
        left: 28,
        right: 28,
        fontSize: 6.5,
        color: "#64748b",
        textAlign: "center",
        borderTopWidth: 0.5,
        borderTopColor: "#e2e8f0",
        paddingTop: 3,
    },
});

export default function CoachSalarySlipPdfDocument({
    coach = {},
    targetMonth = "all",
    targetMonthLabel = "Semua Periode",
    monthSessions = null,
    clubLogo,
    printDate,
}) {
    const formatRp = (num) => {
        return "Rp " + new Intl.NumberFormat("id-ID").format(num || 0);
    };

    const resolvedLogoUrl =
        clubLogo ||
        (typeof window !== "undefined"
            ? `${window.location.origin}/assets/images/otslogo2.png`
            : "/assets/images/otslogo2.png");

    const now = new Date();
    const formattedPrintDate =
        printDate ||
        now.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

    const getSessionMonthKey = (s) => {
        if (s.month_key) return s.month_key;
        if (s.date) {
            const dStr = String(s.date).substring(0, 10);
            if (dStr.length >= 7) return dStr.substring(0, 7);
        }
        return "other";
    };

    // Filter sessions by month if selected
    const allCoachSessions = (coach.all_sessions && coach.all_sessions.length > 0)
        ? coach.all_sessions
        : (coach.sessions || []);

    const filteredSessions = (monthSessions && monthSessions.length > 0)
        ? monthSessions
        : (targetMonth && targetMonth !== "all"
            ? allCoachSessions.filter((s) => getSessionMonthKey(s) === targetMonth)
            : allCoachSessions);

    // Kategori Sesi Terpisah
    const indRegular = filteredSessions.filter((s) => s.type === "Individu" && !s.is_extra);
    const indExtra = filteredSessions.filter((s) => s.type === "Individu" && !!s.is_extra);
    const allIndividual = [...indRegular, ...indExtra];

    const grpRegular = filteredSessions.filter((s) => s.type === "Grup" && !s.is_extra);
    const grpExtra = filteredSessions.filter((s) => s.type === "Grup" && !!s.is_extra);
    const allGroup = [...grpRegular, ...grpExtra];

    const gymShifts = filteredSessions.filter((s) => s.type === "Jaga Gym");

    const sumFee = (arr) => arr.reduce((acc, curr) => acc + Number(curr.fee || 0), 0);

    const feeIndReg = sumFee(indRegular);
    const feeIndExtra = sumFee(indExtra);
    const feeIndTotal = feeIndReg + feeIndExtra;

    const feeGrpReg = sumFee(grpRegular);
    const feeGrpExtra = sumFee(grpExtra);
    const feeGrpTotal = feeGrpReg + feeGrpExtra;

    const feeGym = sumFee(gymShifts);

    const totalGrossEarnings = feeIndReg + feeIndExtra + feeGrpReg + feeGrpExtra + feeGym;

    const totalRegularCount = indRegular.length + grpRegular.length;
    const totalExtraCount = indExtra.length + grpExtra.length;

    // Jabatan: Dinamis sesuai apakah pelatih juga bertugas jaga gym
    const isTrainer = totalRegularCount > 0 || totalExtraCount > 0 || !coach.is_gym_guard;
    const isGymGuard = !!coach.is_gym_guard || gymShifts.length > 0;

    let jabatanLabel = "Pelatih Fisik / Trainer";
    if (isTrainer && isGymGuard) {
        jabatanLabel = "Pelatih Fisik & Penjaga Gym";
    } else if (!isTrainer && isGymGuard) {
        jabatanLabel = "Petugas Jaga Gym";
    }

    const formatDateShort = (dStr) => {
        if (!dStr) return "-";
        try {
            const d = new Date(dStr);
            return d.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
            });
        } catch {
            return String(dStr).substring(0, 10);
        }
    };

    const cleanDescription = (s) => {
        const rawName = s.name || (s.type === "Jaga Gym" ? "Shift Jaga Gym" : "Sesi Latihan");
        // Hapus tanda # dari deskripsi
        const noHashName = String(rawName).replace(/#/g, "").trim();
        const clientStr = s.client_name ? `${s.client_name} - ` : "";
        const extraStr = s.is_extra ? " (Tambahan)" : "";
        return `${clientStr}${noHashName}${extraStr}`;
    };

    return (
        <Document>
            {/* Format Slip Gaji: A4 Portrait */}
            <Page size="A4" orientation="portrait" style={styles.page} wrap>
                {/* ─── 1. TOP HEADER BANNER DENGAN PERIODE BULAN LANGSUNG ─── */}
                <View style={styles.headerBanner}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerTitle}>
                            SLIP GAJI PERIODE {targetMonthLabel.toUpperCase()}
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            Olympus Training Surabaya - Performance Hub
                        </Text>
                    </View>
                    <View style={{ alignItems: "flex-end", justifyContent: "center" }}>
                        <Image
                            src={resolvedLogoUrl}
                            style={styles.headerLogo}
                        />
                    </View>
                </View>

                {/* ─── 2. METADATA 2-COLUMNS ─── */}
                <View style={styles.metaContainer}>
                    {/* Left Column */}
                    <View style={styles.metaColumn}>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaKey}>Nama</Text>
                            <Text style={styles.metaSep}>:</Text>
                            <Text style={styles.metaVal}>{coach.name || "-"}</Text>
                        </View>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaKey}>Departemen</Text>
                            <Text style={styles.metaSep}>:</Text>
                            <Text style={styles.metaValRegular}>Performance & Conditioning</Text>
                        </View>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaKey}>Jabatan</Text>
                            <Text style={styles.metaSep}>:</Text>
                            <Text style={styles.metaValRegular}>{jabatanLabel}</Text>
                        </View>
                    </View>

                    {/* Right Column */}
                    <View style={styles.metaColumn}>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaKey}>Total Sesi Kerja</Text>
                            <Text style={styles.metaSep}>:</Text>
                            <Text style={styles.metaVal}>
                                {filteredSessions.length} Sesi ({totalRegularCount} Asli, {totalExtraCount} Tambahan)
                            </Text>
                        </View>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaKey}>Shift Jaga Gym</Text>
                            <Text style={styles.metaSep}>:</Text>
                            <Text style={styles.metaValRegular}>{gymShifts.length} Shift</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* ─── 3. RINGKASAN PENDAPATAN (PERSIS TAMPILAN CONTOH) ─── */}
                <View style={styles.summarySection}>
                    <Text style={styles.summaryTitle}>Pendapatan</Text>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Sesi Individu Reguler ({indRegular.length}x)</Text>
                        <Text style={styles.summarySep}>:</Text>
                        <Text style={styles.summaryAmount}>{formatRp(feeIndReg)}</Text>
                    </View>

                    {indExtra.length > 0 && (
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Sesi Individu Tambahan ({indExtra.length}x)</Text>
                            <Text style={styles.summarySep}>:</Text>
                            <Text style={styles.summaryAmount}>{formatRp(feeIndExtra)}</Text>
                        </View>
                    )}

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Sesi Grup Reguler ({grpRegular.length}x)</Text>
                        <Text style={styles.summarySep}>:</Text>
                        <Text style={styles.summaryAmount}>{formatRp(feeGrpReg)}</Text>
                    </View>

                    {grpExtra.length > 0 && (
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Sesi Grup Tambahan ({grpExtra.length}x)</Text>
                            <Text style={styles.summarySep}>:</Text>
                            <Text style={styles.summaryAmount}>{formatRp(feeGrpExtra)}</Text>
                        </View>
                    )}

                    {(isGymGuard || gymShifts.length > 0) && (
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Shift Jaga Gym ({gymShifts.length}x)</Text>
                            <Text style={styles.summarySep}>:</Text>
                            <Text style={styles.summaryAmount}>{formatRp(feeGym)}</Text>
                        </View>
                    )}

                    {/* Total Pendapatan */}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Pendapatan</Text>
                        <Text style={styles.summarySep}>:</Text>
                        <Text style={styles.totalAmount}>{formatRp(totalGrossEarnings)}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* ─── 4. DETAIL SESI TERBAGI MENJADI BEBERAPA GRID (TANPA PEMBUNGKUS / TANPA # / MONOKROM) ─── */}
                <Text style={styles.detailSectionHeader}>Rincian Detail Sesi & Shift</Text>

                <View style={styles.gridContainer}>
                    {/* GRID 1 (KIRI): Detail Sesi Individu */}
                    <View style={styles.gridColumn}>
                        <View style={styles.gridHeader}>
                            <Text style={styles.gridTitle}>
                                Sesi Individu ({allIndividual.length} Sesi)
                            </Text>
                            <Text style={styles.gridSubtotal}>{formatRp(feeIndTotal)}</Text>
                        </View>
                        {allIndividual.length > 0 ? (
                            allIndividual.map((s, idx) => (
                                <View key={idx} style={styles.gridItemRow}>
                                    <View style={styles.gridItemLeft}>
                                        <Text style={styles.gridItemNo}>{idx + 1}.</Text>
                                        <Text style={styles.gridItemDate}>{formatDateShort(s.date)}</Text>
                                        <Text style={styles.gridItemDesc}>
                                            {cleanDescription(s)}
                                        </Text>
                                    </View>
                                    <Text style={styles.gridItemFee}>{formatRp(s.fee)}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.emptyGridText}>Tidak ada sesi individu</Text>
                        )}
                    </View>

                    {/* GRID 2 (KANAN): Detail Shift Jaga Gym */}
                    <View style={styles.gridColumn}>
                        <View style={styles.gridHeader}>
                            <Text style={styles.gridTitle}>
                                Shift Jaga Gym ({gymShifts.length} Shift)
                            </Text>
                            <Text style={styles.gridSubtotal}>{formatRp(feeGym)}</Text>
                        </View>
                        {gymShifts.length > 0 ? (
                            gymShifts.map((s, idx) => (
                                <View key={idx} style={styles.gridItemRow}>
                                    <View style={styles.gridItemLeft}>
                                        <Text style={styles.gridItemNo}>{idx + 1}.</Text>
                                        <Text style={styles.gridItemDate}>{formatDateShort(s.date)}</Text>
                                        <Text style={styles.gridItemDesc}>
                                            {cleanDescription(s)}
                                        </Text>
                                    </View>
                                    <Text style={styles.gridItemFee}>{formatRp(s.fee)}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.emptyGridText}>Tidak ada shift jaga gym</Text>
                        )}
                    </View>
                </View>

                {/* GRID 3: Detail Sesi Grup (Hanya tampil jika ada) */}
                {allGroup.length > 0 && (
                    <View style={styles.gridColumnFull}>
                        <View style={styles.gridHeader}>
                            <Text style={styles.gridTitle}>
                                Sesi Grup / Kelas ({allGroup.length} Sesi)
                            </Text>
                            <Text style={styles.gridSubtotal}>{formatRp(feeGrpTotal)}</Text>
                        </View>
                        {allGroup.map((s, idx) => (
                            <View key={idx} style={styles.gridItemRow}>
                                <View style={styles.gridItemLeft}>
                                    <Text style={styles.gridItemNo}>{idx + 1}.</Text>
                                    <Text style={styles.gridItemDate}>{formatDateShort(s.date)}</Text>
                                    <Text style={styles.gridItemDesc}>
                                        {cleanDescription(s)}
                                    </Text>
                                </View>
                                <Text style={styles.gridItemFee}>{formatRp(s.fee)}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* ─── 5. SIGNATURE (KANAN BAWAH) ─── */}
                <View style={styles.signContainer} wrap={false}>
                    <View style={styles.signBox}>
                        <Text style={styles.signDate}>Surabaya, {formattedPrintDate}</Text>
                        <Text style={styles.signRole}>Manager</Text>
                        <Text style={styles.signName}>( Manajemen OTS )</Text>
                    </View>
                </View>

                {/* ─── 6. FOOTER ─── */}
                <Text style={styles.footerText}>
                    Dokumen ini diterbitkan secara elektronik oleh Sistem Manajemen Performa Olympus Training Surabaya • Valid tanpa cap basah jika berstatus LUNAS.
                </Text>
            </Page>
        </Document>
    );
}
