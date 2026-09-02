import React from "react";
import {
    Document,
    View,
    Text,
    Image,
    StyleSheet,
} from "@react-pdf/renderer";
import PdfPageTemplate from "./PdfPageTemplate";

// ─── COLOR PALETTE ───
const THEME = {
    primary: "#ea580c",
    dark: "#0f172a",
    slate: "#334155",
    muted: "#64748b",
    border: "#334155",
    borderLight: "#cbd5e1",
    borderTable: "#e2e8f0",
    bgLight: "#f8fafc",
    bgHeader: "#e2e8f0",
    bgRowAlt: "#f1f5f9",
    accentYellow: "#fef08a",
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

const thumbnailCache = new Map();

export const compressImageToThumbnail = async (url, maxWidth = 160, maxHeight = 160, quality = 0.65) => {
    if (!url) return null;
    if (thumbnailCache.has(url)) return thumbnailCache.get(url);

    try {
        const fullUrl = resolveFullImageUrl(url);
        if (!fullUrl) return null;

        if (typeof window === "undefined" || !window.Image) {
            return fullUrl;
        }

        const img = new window.Image();
        img.crossOrigin = "anonymous";

        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = fullUrl;
        });

        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > height) {
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
            }
        }
        canvas.width = Math.max(width, 1);
        canvas.height = Math.max(height, 1);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        thumbnailCache.set(url, dataUrl);
        return dataUrl;
    } catch (e) {
        return resolveFullImageUrl(url);
    }
};

export const prepareTrainingsWithCompressedImages = async (trainings) => {
    if (!Array.isArray(trainings)) return [];

    const uniqueUrls = new Set();
    trainings.forEach((t) => {
        (t.blocks || []).forEach((b) => {
            (b.items || []).forEach((item) => {
                const rawImages = item.exercise?.images || [];
                (Array.isArray(rawImages) ? rawImages : []).forEach((img) => {
                    if (img && typeof img === "string") {
                        uniqueUrls.add(img);
                    }
                });
            });
        });
    });

    await Promise.all(
        Array.from(uniqueUrls).map(async (url) => {
            await compressImageToThumbnail(url);
        })
    );

    return trainings.map((t) => ({
        ...t,
        blocks: (t.blocks || []).map((b) => ({
            ...b,
            items: (b.items || []).map((item) => {
                const rawImages = item.exercise?.images || [];
                const compressedImages = (Array.isArray(rawImages) ? rawImages : []).map(
                    (img) => thumbnailCache.get(img) || resolveFullImageUrl(img)
                );
                return {
                    ...item,
                    exercise: item.exercise
                        ? {
                              ...item.exercise,
                              images: compressedImages,
                          }
                        : item.exercise,
                };
            }),
        })),
    }));
};

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    } catch {
        return dateStr;
    }
};

const styles = StyleSheet.create({
    // Summary Grid Styles (7-column schedule)
    summaryGrid: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#334155",
        borderRadius: 3,
        overflow: "hidden",
        marginBottom: 12,
    },
    summaryRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#334155",
    },
    summaryCol: {
        width: "14.28%",
        borderRightWidth: 1,
        borderRightColor: "#334155",
        minHeight: 50,
    },
    summaryDayHeader: {
        backgroundColor: "#e2e8f0",
        paddingVertical: 4,
        paddingHorizontal: 4,
        borderBottomWidth: 0.8,
        borderBottomColor: "#334155",
        alignItems: "center",
    },
    summaryDayNumber: {
        fontSize: 7.5,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
    },
    summaryDayDate: {
        fontSize: 6.5,
        fontFamily: "Helvetica",
        color: "#334155",
        marginTop: 1,
    },
    summaryActivityItem: {
        paddingVertical: 5,
        paddingHorizontal: 4,
        fontSize: 6.8,
        textAlign: "center",
        lineHeight: 1.25,
        color: "#18181b",
    },
    summaryActivityPrimary: {
        backgroundColor: "#fef08a",
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
        borderBottomWidth: 0.8,
        borderBottomColor: "#cbd5e1",
    },

    // Session Page Section
    instructionBox: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 3,
        padding: 7,
        marginBottom: 8,
        backgroundColor: "#f8fafc",
    },
    instructionTitle: {
        fontFamily: "Helvetica-Bold",
        fontSize: 8.5,
        textTransform: "uppercase",
        marginBottom: 2,
        color: "#0f172a",
    },
    instructionText: {
        fontSize: 7.5,
        color: "#334155",
        lineHeight: 1.3,
    },

    // Phase Block
    phaseBlock: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 3,
        overflow: "hidden",
        marginBottom: 8,
    },
    phaseHeader: {
        backgroundColor: "#f1f5f9",
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#cbd5e1",
    },
    phaseTitle: {
        fontSize: 8.5,
        fontFamily: "Helvetica-Bold",
        textTransform: "uppercase",
        color: "#0f172a",
    },
    phaseDesc: {
        fontSize: 7,
        color: "#475569",
        marginTop: 1.5,
        lineHeight: 1.25,
    },

    // Note Only Content
    noteOnlyContent: {
        padding: 8,
        fontSize: 7.5,
        color: "#1e293b",
        lineHeight: 1.35,
    },

    // Sub Header (Exercise Table Columns)
    tableHeaderRow: {
        flexDirection: "row",
        backgroundColor: "#e2e8f0",
        borderBottomWidth: 1,
        borderBottomColor: "#cbd5e1",
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    tableHeaderText: {
        fontSize: 7,
        fontFamily: "Helvetica-Bold",
        textTransform: "uppercase",
        color: "#0f172a",
    },

    // Exercise Item Row
    itemRow: {
        flexDirection: "row",
        borderBottomWidth: 0.8,
        borderBottomColor: "#e2e8f0",
        paddingVertical: 6,
        paddingHorizontal: 8,
    },
    itemLeft: {
        flex: 1,
        paddingRight: 8,
    },
    itemSetsCol: {
        width: 36,
        alignItems: "center",
        justifyContent: "center",
        borderLeftWidth: 0.8,
        borderLeftColor: "#e2e8f0",
        paddingHorizontal: 2,
    },
    exerciseTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        marginBottom: 3,
    },
    exerciseDetails: {
        flex: 1,
        paddingRight: 6,
    },
    exerciseName: {
        fontSize: 8.5,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
        marginBottom: 1.5,
    },
    exerciseDesc: {
        fontSize: 7,
        color: "#475569",
        marginBottom: 2,
        lineHeight: 1.25,
    },
    exerciseNote: {
        fontSize: 6.8,
        fontFamily: "Helvetica-Oblique",
        color: "#475569",
        borderLeftWidth: 2.5,
        borderLeftColor: "#ea580c",
        paddingLeft: 4,
        marginTop: 2,
        marginBottom: 2,
        lineHeight: 1.2,
    },

    // Image grid (top right of exercise)
    imageGrid: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    imagePreview: {
        width: 48,
        height: 38,
        objectFit: "cover",
        borderRadius: 2,
        marginLeft: 3,
    },

    // Per-Set Table
    setTable: {
        width: "100%",
        marginTop: 3,
        borderWidth: 0.8,
        borderColor: "#cbd5e1",
        borderRadius: 2,
        overflow: "hidden",
    },
    setTableHeaderRow: {
        flexDirection: "row",
        backgroundColor: "#f1f5f9",
        borderBottomWidth: 0.8,
        borderBottomColor: "#cbd5e1",
        paddingVertical: 2.5,
        alignItems: "center",
    },
    setTableRow: {
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderBottomColor: "#e2e8f0",
        paddingVertical: 2.5,
        alignItems: "center",
    },

    // Column Widths
    colSet: {
        width: "10%",
        textAlign: "center",
        fontSize: 6.5,
        fontFamily: "Helvetica-Bold",
        color: "#64748b",
    },
    colFullHeader: {
        width: "18%",
        textAlign: "center",
        fontSize: 6,
        fontFamily: "Helvetica-Bold",
        color: "#475569",
        textTransform: "uppercase",
    },
    colFullCell: {
        width: "18%",
        textAlign: "center",
        fontSize: 6.5,
        color: "#0f172a",
    },
    colCardioHeader: {
        width: "30%",
        textAlign: "center",
        fontSize: 6,
        fontFamily: "Helvetica-Bold",
        color: "#475569",
        textTransform: "uppercase",
    },
    colCardioCell: {
        width: "30%",
        textAlign: "center",
        fontSize: 6.5,
        color: "#0f172a",
    },
    colMedHeader: {
        width: "45%",
        textAlign: "center",
        fontSize: 6,
        fontFamily: "Helvetica-Bold",
        color: "#475569",
        textTransform: "uppercase",
    },
    colMedCell: {
        width: "45%",
        textAlign: "center",
        fontSize: 6.5,
        color: "#0f172a",
    },
});

export const AthleteSessionReportPdfDocument = ({
    athlete = {},
    trainings = [],
    logoUrl = null,
}) => {
    const totalSessions = athlete?.package?.session_count || trainings.length || 0;
    const athleteName = athlete?.name || "Athlete";

    // Chunk trainings for the 7-column summary grid (7 sessions per row)
    const chunkArray = (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };

    const trainingChunks = chunkArray(trainings, 7);

    return (
        <Document title={`Laporan Sesi - ${athleteName}`}>
            {/* ====== 1. SUMMARY OVERVIEW PAGE ====== */}
            <PdfPageTemplate
                title={`LAPORAN SESI - ${athleteName.toUpperCase()}`}
                subtitle={`Total Sesi: ${totalSessions} | Status Paket: ${athlete?.package?.name || "Reguler"}`}
                logoUrl={logoUrl}
                orientation="landscape"
                footerLeftText={`Olympus Training Surabaya • Rekap Sesi Latihan - ${athleteName}`}
            >
                <View style={styles.summaryGrid} wrap={false}>
                    {trainingChunks.map((chunk, rowIdx) => (
                        <View key={`row-${rowIdx}`} style={styles.summaryRow}>
                            {chunk.map((t, colIdx) => (
                                <View key={`col-${t.id || colIdx}`} style={styles.summaryCol}>
                                    <View style={styles.summaryDayHeader}>
                                        <Text style={styles.summaryDayNumber}>
                                            Sesi {t.session_number || (rowIdx * 7 + colIdx + 1)}
                                        </Text>
                                        <Text style={styles.summaryDayDate}>
                                            {formatDate(t.date)}
                                        </Text>
                                    </View>
                                    <Text style={[styles.summaryActivityItem, styles.summaryActivityPrimary]}>
                                        {t.title || t.name || `Sesi #${t.session_number}`}
                                    </Text>
                                    <Text style={styles.summaryActivityItem}>
                                        {t.focus || t.location || "Individual Training"}
                                    </Text>
                                </View>
                            ))}
                            {/* Empty cells to fill 7 columns if last row is incomplete */}
                            {Array.from({ length: 7 - chunk.length }).map((_, emptyIdx) => (
                                <View
                                    key={`empty-${emptyIdx}`}
                                    style={[styles.summaryCol, { backgroundColor: "#f8fafc" }]}
                                />
                            ))}
                        </View>
                    ))}
                </View>
            </PdfPageTemplate>

            {/* ====== 2. INDIVIDUAL SESSION DETAIL PAGES ====== */}
            {trainings.map((training, tIdx) => {
                const sessionNum = training.session_number || (tIdx + 1);
                const coachName = training.coachList || training.coach?.name || (Array.isArray(training.coach_ids) && training.coach_ids.length > 0 ? "Team Coach" : "-");

                const step1Blocks = (training.blocks || []).filter((b) => b.step === 1 || b.step === "1");
                const step2Blocks = (training.blocks || []).filter((b) => b.step !== 1 && b.step !== "1");

                return (
                    <PdfPageTemplate
                        key={`training-${training.id || tIdx}`}
                        title={training.title || training.name || `Session #${sessionNum}`}
                        subtitle={`${formatDate(training.date)} | ${athleteName} | Sesi ${sessionNum} / ${totalSessions}${training.location ? ` | ${training.location}` : ""} | Coach: ${coachName}`}
                        logoUrl={logoUrl}
                        orientation="landscape"
                        footerLeftText={`Olympus Training Surabaya • Sesi #${sessionNum} - ${athleteName}`}
                    >
                        {/* STEP 1: INSTRUCTION BLOCKS */}
                        {step1Blocks.map((block, bIdx) => (
                            <View key={`b1-${block.id || bIdx}`} style={styles.instructionBox} wrap={false}>
                                <Text style={styles.instructionTitle}>
                                    {block.title || (block.category ? block.category.replace(/_/g, " ") : "Instruksi")}:
                                </Text>
                                <Text style={styles.instructionText}>
                                    {block.items?.[0]?.note || "Tidak ada instruksi khusus."}
                                </Text>
                            </View>
                        ))}

                        {/* STEP 2: EXERCISE BLOCKS */}
                        {step2Blocks.map((block, bIdx) => {
                            const categoryMap = {
                                warm_up: "medium",
                                mobility: "medium",
                                activation: "medium",
                                strength_training: "full",
                                stretching: "note_only",
                                interval: "cardio",
                                free_strength: "note_only",
                                cardio: "cardio",
                            };
                            const columns = categoryMap[block.category] || "basic";
                            const isNoteOnly = columns === "note_only";
                            const items = block.items || [];

                            return (
                                <View key={`b2-${block.id || bIdx}`} style={styles.phaseBlock} wrap={false}>
                                    {/* Phase Header */}
                                    <View style={styles.phaseHeader}>
                                        <Text style={styles.phaseTitle}>
                                            PHASE: {block.title || (block.category ? block.category.replace(/_/g, " ") : "Latihan")}
                                        </Text>
                                        {block.description && (
                                            <Text style={styles.phaseDesc}>{block.description}</Text>
                                        )}
                                    </View>

                                    {/* Phase Content */}
                                    {isNoteOnly ? (
                                        <Text style={styles.noteOnlyContent}>
                                            {items[0]?.note || "Tidak ada catatan khusus."}
                                        </Text>
                                    ) : (
                                        <View>
                                            {/* Table Header */}
                                            <View style={styles.tableHeaderRow}>
                                                <Text style={[styles.tableHeaderText, { flex: 1 }]}>Exercise</Text>
                                                <Text style={[styles.tableHeaderText, { width: 36, textAlign: "center" }]}>Sets</Text>
                                            </View>

                                            {/* Item Rows */}
                                            {items.map((item, iIdx) => {
                                                const exercise = item.exercise;
                                                const rawImages = exercise?.images || [];
                                                const images = (Array.isArray(rawImages) ? rawImages : [])
                                                    .map(resolveFullImageUrl)
                                                    .filter(Boolean)
                                                    .slice(0, 3);

                                                // Calculate sets breakdown
                                                const setsCount = parseInt(item.sets, 10) || 1;
                                                const loadArray = Array.isArray(item.load_array) ? item.load_array : [];
                                                const repsArray = Array.isArray(item.reps_array) ? item.reps_array : [];
                                                const tempoArray = Array.isArray(item.tempo_array) ? item.tempo_array : [];
                                                const rirArray = Array.isArray(item.rir_array) ? item.rir_array : [];
                                                const restArray = Array.isArray(item.rest_per_set_array) ? item.rest_per_set_array : [];
                                                const distanceArray = Array.isArray(item.distance_array) ? item.distance_array : [];

                                                return (
                                                    <View key={`item-${item.id || iIdx}`} style={styles.itemRow} wrap={false}>
                                                        <View style={styles.itemLeft}>
                                                            {/* Exercise Top Row: Info (Left) + Images (Right) */}
                                                            <View style={styles.exerciseTopRow}>
                                                                <View style={styles.exerciseDetails}>
                                                                    <Text style={styles.exerciseName}>
                                                                        {exercise?.name || "Custom Exercise"}
                                                                    </Text>
                                                                    {exercise?.description && (
                                                                        <Text style={styles.exerciseDesc}>
                                                                            {exercise.description}
                                                                        </Text>
                                                                    )}
                                                                    {item.note && (
                                                                        <Text style={styles.exerciseNote}>
                                                                            Note: {item.note}
                                                                        </Text>
                                                                    )}
                                                                </View>

                                                                {/* Images top right */}
                                                                {images.length > 0 && (
                                                                    <View style={styles.imageGrid}>
                                                                        {images.map((imgSrc, imgIdx) => (
                                                                            <Image
                                                                                key={`img-${imgIdx}`}
                                                                                src={imgSrc}
                                                                                style={styles.imagePreview}
                                                                            />
                                                                        ))}
                                                                    </View>
                                                                )}
                                                            </View>

                                                            {/* Per-Set Table below */}
                                                            {columns !== "basic" && setsCount > 0 && (
                                                                <View style={styles.setTable} wrap={false}>
                                                                    <View style={styles.setTableHeaderRow}>
                                                                        <Text style={styles.colSet}>Set</Text>
                                                                        {columns === "cardio" && (
                                                                            <>
                                                                                <Text style={styles.colCardioHeader}>Distance (m)</Text>
                                                                                <Text style={styles.colCardioHeader}>Time</Text>
                                                                                <Text style={styles.colCardioHeader}>Rest</Text>
                                                                            </>
                                                                        )}
                                                                        {columns === "full" && (
                                                                            <>
                                                                                <Text style={styles.colFullHeader}>Load ({item.load_unit || "kg"})</Text>
                                                                                <Text style={styles.colFullHeader}>Reps</Text>
                                                                                <Text style={styles.colFullHeader}>Tempo</Text>
                                                                                <Text style={styles.colFullHeader}>RIR</Text>
                                                                                <Text style={styles.colFullHeader}>Rest</Text>
                                                                            </>
                                                                        )}
                                                                        {columns === "medium" && (
                                                                            <>
                                                                                <Text style={styles.colMedHeader}>Reps</Text>
                                                                                <Text style={styles.colMedHeader}>Rest</Text>
                                                                            </>
                                                                        )}
                                                                    </View>

                                                                    {Array.from({ length: setsCount }).map((_, sIdx) => (
                                                                        <View key={`s-${sIdx}`} style={styles.setTableRow}>
                                                                            <Text style={styles.colSet}>S{sIdx + 1}</Text>
                                                                            {columns === "cardio" && (
                                                                                <>
                                                                                    <Text style={styles.colCardioCell}>{distanceArray[sIdx] || item.distance || "-"}</Text>
                                                                                    <Text style={styles.colCardioCell}>{repsArray[sIdx] || item.minutes || item.reps || "-"}</Text>
                                                                                    <Text style={styles.colCardioCell}>{restArray[sIdx] || item.rest_per_set || "-"}</Text>
                                                                                </>
                                                                            )}
                                                                            {columns === "full" && (
                                                                                <>
                                                                                    <Text style={styles.colFullCell}>{loadArray[sIdx] || item.load || "-"}</Text>
                                                                                    <Text style={styles.colFullCell}>{repsArray[sIdx] || item.reps || "-"}</Text>
                                                                                    <Text style={styles.colFullCell}>{tempoArray[sIdx] || item.tempo || "-"}</Text>
                                                                                    <Text style={styles.colFullCell}>{rirArray[sIdx] || item.rir || "-"}</Text>
                                                                                    <Text style={styles.colFullCell}>{restArray[sIdx] || item.rest_per_set || "-"}</Text>
                                                                                </>
                                                                            )}
                                                                            {columns === "medium" && (
                                                                                <>
                                                                                    <Text style={styles.colMedCell}>{repsArray[sIdx] || item.reps || "-"}</Text>
                                                                                    <Text style={styles.colMedCell}>{restArray[sIdx] || item.rest_per_set || "-"}</Text>
                                                                                </>
                                                                            )}
                                                                        </View>
                                                                    ))}
                                                                </View>
                                                            )}
                                                        </View>

                                                        <View style={styles.itemSetsCol}>
                                                            <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#0f172a" }}>
                                                                {item.sets || "-"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </PdfPageTemplate>
                );
            })}
        </Document>
    );
};

export default AthleteSessionReportPdfDocument;
