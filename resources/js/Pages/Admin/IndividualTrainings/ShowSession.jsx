import React, { useState, useMemo } from "react";

import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, usePage, useForm, router } from "@inertiajs/react";
import {
    ChevronLeft,
    Calendar,
    MapPin,
    Target,
    Activity,
    Dumbbell,
    AlignLeft,
    CheckCircle2,
    ArrowLeft,
    Download,
    Eye,
    FileImage,
    Edit2,
    Trash2,
    Info,
    Clock,
    X,
    FileText,
    User,
} from "lucide-react";

import ActionFooter from "./Partials/ActionFooter";
import ExerciseItem from "./Partials/ExerciseItem";
import PageHeader from "@/Components/Common/PageHeader";
import SignaturePad from "@/Components/Common/SignaturePad";
import { PenTool } from "lucide-react";

export default function ShowSession({
    auth,
    training,
    rpeRecords = [],
    coaches = [],
}) {
    const { permissions } = usePage().props;
    const canUpdate = permissions?.individual_training?.update ?? false;
    const canCreate = permissions?.individual_training?.create ?? false;
    const isAthlete = auth.user.role === "athlete";
    const isAdmin =
        auth.user?.role === "admin" || auth.user?.role === "superadmin";
    const isCoachOrAdmin = isAdmin || auth.user?.role === "coach";

    const [modalMedia, setModalMedia] = useState(null);
    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 1280;
                    const MAX_HEIGHT = 1280;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob(
                        (blob) => {
                            resolve(
                                new File([blob], file.name, {
                                    type: "image/jpeg",
                                    lastModified: Date.now(),
                                }),
                            );
                        },
                        "image/jpeg",
                        0.7,
                    );
                };
            };
            reader.onerror = (error) => reject(error);
        });
    };

    // Initial RPEs Helper
    const getInitialRpes = () => {
        const rpes = {};
        rpeRecords.forEach((record) => {
            let rpeData = record.rpe_data || {
                rpes: [],
                load: "",
                reps: "",
                tempo: "",
                rir: "",
                rest: "",
            };
            if (Array.isArray(rpeData)) {
                const legacyArray = rpeData;
                rpeData = {
                    rpes: legacyArray.map(
                        (item) =>
                            (typeof item === "object" && item !== null
                                ? item.rpe
                                : item) || "",
                    ),
                    load: legacyArray[0]?.load || "",
                    reps: legacyArray[0]?.reps || "",
                    tempo: legacyArray[0]?.tempo || "",
                    rir: legacyArray[0]?.rir || "",
                    rest: legacyArray[0]?.rest || "",
                };
            }
            rpes[record.training_block_item_id] = rpeData;
        });
        return rpes;
    };

    // Helper to get array of size maxSets populated with default template values
    const getTargetArray = (templateArray, templateSingle, maxSets) => {
        const arr = [];
        for (let i = 0; i < maxSets; i++) {
            const val = templateArray?.[i] ?? templateSingle ?? "";
            arr.push(val);
        }
        return arr;
    };

    // Initial Targets Helper (Using template defaults since there are no custom targets for athlete)
    const getInitialTargets = () => {
        const targets = {};
        training.blocks.forEach((block) => {
            if (block.items) {
                block.items.forEach((item) => {
                    const maxSets = Math.max(
                        ...(String(item.sets || "0").match(/\d+/g) || [0]).map(
                            Number,
                        ),
                        0,
                    );

                    targets[item.id] = {
                        load: item.load ?? "",
                        load_unit: item.load_unit ?? "kg",
                        load_array: getTargetArray(
                            item.load_array,
                            item.load,
                            maxSets,
                        ),
                        reps: item.reps ?? "",
                        reps_unit: item.reps_unit ?? "reps",
                        reps_array: getTargetArray(
                            item.reps_array,
                            item.reps,
                            maxSets,
                        ),
                        distance: item.distance ?? "",
                        distance_array: getTargetArray(
                            item.distance_array,
                            item.distance,
                            maxSets,
                        ),
                        minutes: item.minutes ?? "",
                        minutes_array: getTargetArray(
                            item.minutes_array,
                            item.minutes,
                            maxSets,
                        ),
                        tempo: item.tempo ?? "",
                        tempo_array: getTargetArray(
                            item.tempo_array,
                            item.tempo,
                            maxSets,
                        ),
                        rir: item.rir ?? "",
                        rir_array: getTargetArray(
                            item.rir_array,
                            item.rir,
                            maxSets,
                        ),
                        rest_per_set: item.rest_per_set ?? "",
                        rest_per_set_array: getTargetArray(
                            item.rest_per_set_array,
                            item.rest_per_set,
                            maxSets,
                        ),
                        intensity: item.intensity ?? "",
                    };
                });
            }
        });
        return targets;
    };

    // Check if current athlete has completed the training
    const isCompleted = training.is_completed;
    const isExcused = false; // Individual training doesn't use excused status the same way

    const tDate = new Date(training.date);
    tDate.setHours(0, 0, 0, 0);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(todayDate - tDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isPastOneWeek = tDate < todayDate && diffDays > 7;

    const {
        data,
        setData,
        post,
        processing,
        recentlySuccessful,
        errors,
        isDirty,
    } = useForm({
        rpes: getInitialRpes(),
        targets: getInitialTargets(),
        athlete_note: training.athlete_note || "",
        proof_photo: null,
        remove_proof_photo: false,
        signature_data: null,
    });

    const [mainTab, setMainTab] = useState("detail");
    const [warningMessage, setWarningMessage] = useState("");
    const [confirmComplete, setConfirmComplete] = useState(false);
    const [isEditingActuals, setIsEditingActuals] = useState(false);

    // For individual trainings, it's locked if completed. We allow past 1 week if not completed yet.
    const isLocked = isCompleted && !isEditingActuals;
    const isReadOnly = isLocked || (!isAthlete && !isCoachOrAdmin);

    const openModal = (url, type) => {
        setModalMedia({ url, type });
    };

    const closeModal = () => {
        setModalMedia(null);
    };

    const getEmbedUrl = (url) => {
        if (!url) return "";
        const ytMatch = url.match(
            /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
        );
        if (ytMatch && ytMatch[1]) {
            return `https://www.youtube.com/embed/${ytMatch[1]}`;
        }
        return url;
    };

    const handlePhotoChange = async (file) => {
        if (!file) return;
        try {
            const compressedFile = await compressImage(file);
            setData("proof_photo", compressedFile);
        } catch (e) {
            console.error("Compression failed", e);
            setData("proof_photo", file);
        }
    };

    const handleExerciseChange = (itemId, field, value) => {
        const newRpes = { ...data.rpes };
        if (!newRpes[itemId])
            newRpes[itemId] = {
                rpes: [],
                load: "",
                reps: "",
                tempo: "",
                rir: "",
                rest: "",
            };
        newRpes[itemId][field] = value;
        setData("rpes", newRpes);
    };

    const handleSetRpeChange = (itemId, setIndex, value) => {
        const newRpes = { ...data.rpes };
        if (!newRpes[itemId])
            newRpes[itemId] = {
                rpes: [],
                load: "",
                reps: "",
                tempo: "",
                rir: "",
                rest: "",
            };
        if (!Array.isArray(newRpes[itemId].rpes)) newRpes[itemId].rpes = [];
        newRpes[itemId].rpes[setIndex] = value;
        setData("rpes", newRpes);
    };

    const handleExerciseArrayChange = (itemId, field, arrayIndex, value) => {
        const newRpes = { ...data.rpes };
        if (!newRpes[itemId])
            newRpes[itemId] = {
                rpes: [],
                load: "",
                reps: "",
                tempo: "",
                rir: "",
                rest: "",
                load_array: [],
                reps_array: [],
                distance_array: [],
                tempo_array: [],
                rir_array: [],
                rest_per_set_array: [],
            };
        if (!Array.isArray(newRpes[itemId][field])) newRpes[itemId][field] = [];
        newRpes[itemId][field][arrayIndex] = value;
        setData("rpes", newRpes);
    };

    const handleTargetChange = (itemId, field, value) => {
        const newTargets = { ...data.targets };
        if (!newTargets[itemId]) {
            newTargets[itemId] = {};
        }
        newTargets[itemId][field] = value;
        setData("targets", newTargets);
    };

    const handleTargetArrayChange = (itemId, field, arrayIndex, value) => {
        const newTargets = { ...data.targets };
        if (!newTargets[itemId]) {
            newTargets[itemId] = {};
        }
        if (!Array.isArray(newTargets[itemId][field])) {
            newTargets[itemId][field] = [];
        }
        newTargets[itemId][field][arrayIndex] = value;
        setData("targets", newTargets);
    };

    const submitRpe = (e) => {
        e.preventDefault();
        post(route("admin.individual-trainings.session.rpe", training.id), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const getMissingRequiredActuals = () => {
        if (!isAthlete) return [];
        let missing = [];
        training.blocks.forEach((block) => {
            if (block.target_filled_by === "athlete") {
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
                const blockName =
                    block.title ||
                    block.category
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase());

                block.items.forEach((item) => {
                    const exerciseData = data.rpes[item.id] || {};
                    const mSets = Math.max(
                        1,
                        ...(String(item.sets || "0").match(/\d+/g) || [0]).map(
                            Number,
                        ),
                    );

                    const exName = item.exercise?.name || "Exercise";

                    if (columns === "full") {
                        for (let i = 0; i < mSets; i++) {
                            if (!exerciseData.load_array?.[i])
                                missing.push(
                                    `Load (${item.load_unit || "kg"}) di exercise ${exName} pada fase ${blockName} (Set ke-${i + 1})`,
                                );
                            if (!exerciseData.reps_array?.[i])
                                missing.push(
                                    `Reps di exercise ${exName} pada fase ${blockName} (Set ke-${i + 1})`,
                                );
                        }
                    } else if (columns === "medium") {
                        for (let i = 0; i < mSets; i++) {
                            if (!exerciseData.reps_array?.[i])
                                missing.push(
                                    `Reps di exercise ${exName} pada fase ${blockName} (Set ke-${i + 1})`,
                                );
                        }
                    } else if (columns === "cardio") {
                        for (let i = 0; i < mSets; i++) {
                            if (!exerciseData.distance_array?.[i])
                                missing.push(
                                    `Distance (m) di exercise ${exName} pada fase ${blockName} (Set ke-${i + 1})`,
                                );
                            if (!exerciseData.reps_array?.[i])
                                missing.push(
                                    `Reps/Duration di exercise ${exName} pada fase ${blockName} (Set ke-${i + 1})`,
                                );
                        }
                    }
                });
            }
        });
        return missing;
    };

    const completeTraining = () => {
        const missingFields = getMissingRequiredActuals();
        
        if (missingFields.length > 0) {
            const formattedMissing = missingFields
                .map((m) => `• ${m}`)
                .join("\n");
            setWarningMessage(
                `Pengisian target/aktual belum lengkap. Anda belum mengisi:\n\n${formattedMissing}`,
            );
            return;
        }

        setConfirmComplete(true);
    };

    const confirmAndComplete = () => {
        const hasPhoto =
            data.proof_photo ||
            (training.proof_photo && !data.remove_proof_photo);

        const hasSig = data.signature_data || training.signature_photo;

        let missing = [];
        if (!hasPhoto) {
            missing.push("Foto Bukti Latihan (wajib diunggah)");
        }
        if (!hasSig) {
            missing.push("Tanda Tangan Digital Klien (wajib dibubuhkan)");
        }

        if (missing.length > 0) {
            setWarningMessage(
                `Penyelesaian belum lengkap:\n\n${missing.map(m => `• ${m}`).join('\n')}`
            );
            return;
        }

        post(
            route("admin.individual-trainings.session.complete", training.id),
            {
                forceFormData: true,
                onSuccess: () => setConfirmComplete(false),
            },
        );
    };

    // Back URL logic
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const fromParam = urlParams.get('from');
    const packageIdParam = urlParams.get('package_id') || training.shared_package_id;
    const athleteIdParam = urlParams.get('athlete_id');

    let backUrl = route("admin.individual-trainings.show", training.user_id || training.athlete_id || training.athlete?.id || auth.user?.id);
    let backLabel = "Kembali ke Kalender Latihan";

    if (fromParam === 'shared-package' && packageIdParam) {
        backUrl = route("admin.shared-packages.show", packageIdParam);
        backLabel = "Kembali ke Paket Bersama";
    } else if (fromParam === 'recap') {
        backUrl = route("admin.reports.session-recap");
        backLabel = "Kembali ke Rekap Sesi";
    } else if (fromParam === 'athlete' && athleteIdParam) {
        backUrl = route("admin.individual-trainings.show", athleteIdParam);
        backLabel = "Kembali ke Kalender Latihan";
    }

    return (
        <AppLayout title={`Detail Sesi - ${training.name || "Latihan"}`}>
            <Head title={`Detail Sesi - ${training.name || "Latihan"}`} />

            <div className="space-y-4 pb-12">
                {/* ─── BREADCRUMB & HEADER ─── */}
                <div className="space-y-1">
                    <Link
                        href={backUrl}
                        className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors gap-1.5"
                    >
                        <ChevronLeft size={13} /> {backLabel}
                    </Link>

                    <PageHeader
                        title={
                            <div className="flex items-center gap-2">
                                <span>{training.name || "Detail Sesi Latihan"}</span>
                                <span className={`text-xs font-semibold ${
                                    training.status === "completed" || training.is_completed
                                        ? "text-emerald-600"
                                        : "text-orange-500"
                                }`}>
                                    ({training.status === "completed" || training.is_completed ? "Selesai" : "Terjadwal"})
                                </span>
                            </div>
                        }
                        description={`${training.is_extra ? "Sesi Tambahan" : training.session_number ? `Sesi ${training.session_number}` : "Sesi Latihan"} - ${training.date}${training.location ? ` - ${training.location}` : ""}`}
                        actions={
                            <div className="flex items-center gap-2">
                                <a
                                    href={route("admin.individual-trainings.session.export-pdf", training.id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-semibold shadow-2xs transition-colors"
                                >
                                    <FileText size={13} />
                                    <span>Download PDF</span>
                                </a>

                                {isCoachOrAdmin && (
                                    <Link
                                        href={route("admin.individual-trainings.session.edit", training.id) + (fromParam ? `?from=${fromParam}&package_id=${packageIdParam || ''}` : '')}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors"
                                    >
                                        <Edit2 size={13} />
                                        <span>Edit Sesi</span>
                                    </Link>
                                )}
                            </div>
                        }
                    />
                </div>

                {/* ─── TWO-COLUMN LAYOUT ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    {/* ═══════════════════════════════════════════════════════
                        KOLOM KIRI (4 Kolom di LG) — Informasi Sesi, Atlet & Status
                       ═══════════════════════════════════════════════════════ */}
                    <div className="lg:col-span-4 space-y-4">
                        {/* Card 1: Informasi Sesi Latihan */}
                        <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                            <div className="bg-slate-50/80 border-b border-slate-200/90 px-3.5 py-2.5 flex items-center justify-between">
                                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    <Activity size={13} className="text-orange-500" />
                                    <span>Informasi Sesi</span>
                                </h3>
                                <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded border ${
                                    training.status === "completed" || training.is_completed
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/70"
                                        : "bg-slate-100 text-slate-700 border-slate-200"
                                }`}>
                                    {training.status === "completed" || training.is_completed ? "Selesai" : "Terjadwal"}
                                </span>
                            </div>

                            <div className="p-3.5 space-y-3 text-xs">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Nama Sesi</span>
                                    <span className="font-bold text-slate-900 text-sm block leading-snug">{training.name || "Program Latihan"}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Tanggal</span>
                                        <div className="flex items-center gap-1 font-semibold text-slate-800">
                                            <Calendar size={12} className="text-orange-500 shrink-0" />
                                            <span>{training.date}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Nomor Sesi</span>
                                        <span className="font-bold text-slate-800 text-xs inline-block">
                                            {training.is_extra ? "Sesi Tambahan" : training.session_number ? `Sesi ${training.session_number}` : "Sesi Latihan"}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Fokus Latihan</span>
                                        <div className="flex items-center gap-1 font-semibold text-slate-800">
                                            <Target size={12} className="text-orange-500 shrink-0" />
                                            <span>{training.training_type || "-"}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Lokasi</span>
                                        <div className="flex items-center gap-1 font-semibold text-slate-800 truncate" title={training.location}>
                                            <MapPin size={12} className="text-orange-500 shrink-0" />
                                            <span className="truncate">{training.location || "-"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Pelatih Pendamping</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {coaches && coaches.length > 0 ? (
                                            coaches.map((c) => (
                                                <span key={c.id} className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700">
                                                    <User size={11} className="text-orange-500" />
                                                    <span>{c.name}</span>
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-400 italic text-xs">-</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Atlet Info Card */}
                        {training.user && (
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs p-3.5 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-md bg-orange-50 text-orange-600 font-bold text-sm flex items-center justify-center border border-orange-200 shrink-0 shadow-2xs">
                                    {training.user.name?.charAt(0) || "A"}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Member Atlet</span>
                                    <h4 className="font-bold text-slate-900 text-xs truncate">{training.user.name}</h4>
                                    <span className="text-[11px] text-slate-500 font-medium truncate block">{training.user.sport?.name || "Member Atlet"}</span>
                                </div>
                            </div>
                        )}

                        {/* Card 3: Status & Catatan Feedback Atlet */}
                        <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                            <div className="bg-slate-50/80 border-b border-slate-200/90 px-3.5 py-2.5">
                                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    <AlignLeft size={13} className="text-orange-500" />
                                    <span>Status & Feedback Atlet</span>
                                </h3>
                            </div>

                            <div className="p-3.5 space-y-3">
                                {/* Status Box */}
                                {isCompleted ? (
                                    <div className="p-2.5 rounded-md border border-emerald-200/80 bg-emerald-50/70 flex items-center gap-2 text-xs text-emerald-800">
                                        <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                                        <div>
                                            <span className="font-bold block">Selesai Dikerjakan</span>
                                            {training.completed_at && (
                                                <span className="text-[10.5px] opacity-80 block">
                                                    {new Date(training.completed_at).toLocaleString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ) : training.status === "in_progress" ? (
                                    <div className="p-2.5 rounded-md border border-amber-200/80 bg-amber-50/70 flex items-center gap-2 text-xs text-amber-800">
                                        <Clock size={15} className="text-amber-600 shrink-0" />
                                        <span className="font-bold">Sedang Dikerjakan</span>
                                    </div>
                                ) : (
                                    <div className="p-2.5 rounded-md border border-slate-200/80 bg-slate-50 flex items-center gap-2 text-xs text-slate-600">
                                        <Clock size={15} className="text-slate-400 shrink-0" />
                                        <span className="font-bold">Belum Dikerjakan</span>
                                    </div>
                                )}

                                {/* Athlete Note Preview */}
                                {training.athlete_note && (
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Catatan Atlet</span>
                                        <div className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-md text-xs text-slate-700 italic">
                                            "{training.athlete_note}"
                                        </div>
                                    </div>
                                )}

                                {/* Proof Photo Preview */}
                                {training.proof_photo && (
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Foto Bukti</span>
                                        <button
                                            type="button"
                                            onClick={() => openModal("/storage/" + training.proof_photo, "image")}
                                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                                        >
                                            <FileImage size={13} className="text-orange-500" />
                                            <span>Lihat Foto Bukti</span>
                                        </button>
                                    </div>
                                )}

                                {/* Client Signature Preview */}
                                {training.signature_photo && (
                                    <div className="pt-2 border-t border-slate-100">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanda Tangan Klien</span>
                                            {training.signed_at && (
                                                <span className="text-[9.5px] text-slate-400">
                                                    {new Date(training.signed_at).toLocaleDateString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>
                                        <div
                                            onClick={() => openModal("/storage/" + training.signature_photo, "image")}
                                            className="bg-white border border-slate-200 rounded-md p-2 flex items-center justify-center cursor-pointer hover:border-orange-300 transition-all shadow-2xs group"
                                            title="Klik untuk melihat tanda tangan penuh"
                                        >
                                            <img
                                                src={"/storage/" + training.signature_photo}
                                                alt="Tanda Tangan Klien"
                                                className="h-14 max-w-full object-contain filter contrast-125 group-hover:scale-105 transition-transform"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════
                        KOLOM KANAN (8 Kolom di LG) — Program Latihan & Blok Fase
                       ═══════════════════════════════════════════════════════ */}
                    <div className="lg:col-span-8 space-y-4">
                        {/* Error message */}
                        {errors.error && (
                            <div className="p-3 rounded-md border border-red-200 bg-red-50 flex items-start gap-2.5 text-xs text-red-800 shadow-2xs">
                                <X size={16} className="mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="font-bold mb-0.5">Gagal Menyimpan</h4>
                                    <p className="leading-relaxed opacity-90">{errors.error}</p>
                                </div>
                            </div>
                        )}

                        {/* Step 1 Instructions / NB */}
                        {training.blocks
                            .filter((block) => Number(block.step) === 1)
                            .map((block, bIdx) => {
                                const isNB = block.category?.toLowerCase() === "nb" || block.title?.toLowerCase() === "nb";
                                return (
                                    <div
                                        key={`inst-${bIdx}`}
                                        className={`p-3.5 rounded-md border-l-[3px] shadow-2xs ${
                                            isNB
                                                ? "bg-rose-50/70 border-rose-500 border border-slate-200/80"
                                                : "bg-blue-50/70 border-blue-500 border border-slate-200/80"
                                        }`}
                                    >
                                        <div className="flex items-start gap-2.5">
                                            <div className={`mt-0.5 ${isNB ? "text-rose-500" : "text-blue-500"}`}>
                                                <Info size={16} />
                                            </div>
                                            <div className="space-y-1 flex-1">
                                                <div className={`font-bold text-xs uppercase tracking-wider ${isNB ? "text-rose-700" : "text-blue-700"}`}>
                                                    {block.title || block.category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                                </div>
                                                <div className={`text-xs whitespace-pre-wrap leading-relaxed font-medium ${isNB ? "text-rose-900/80" : "text-blue-900/80"}`}>
                                                    {block.items?.[0]?.note || block.description || ""}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                        {/* Section Header */}
                        <div className="flex justify-between items-center bg-white border border-slate-200/80 rounded-md px-4 py-2.5 shadow-2xs">
                            <div>
                                <h3 className="text-xs font-bold text-slate-900">
                                    Skema & Program Latihan
                                </h3>
                                <p className="text-[10.5px] text-slate-400 font-medium">
                                    {training.blocks.filter((b) => Number(b.step) === 2).length} fase latihan tersusun
                                </p>
                            </div>
                        </div>

                        {/* Form Program Latihan */}
                        <form onSubmit={submitRpe} className="space-y-4">
                            <div className="flex flex-col gap-4">
                                {training.blocks
                                    .filter((block) => Number(block.step) === 2)
                                    .map((block, bIdx) => {
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
                                        const columns = categoryMap[block.category] || "full";
                                        const phaseLabel = block.title || block.category.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

                                        if (columns === "note_only") {
                                            return (
                                                <div
                                                    key={`block-${bIdx}`}
                                                    className="bg-white border border-slate-200/90 rounded-md shadow-2xs flex flex-col sm:flex-row overflow-hidden"
                                                >
                                                    <div className="bg-slate-50/80 border-b sm:border-b-0 sm:border-r border-slate-200/90 p-3 sm:w-1/4 flex flex-col justify-center gap-1.5">
                                                        <h3 className="font-bold text-slate-900 text-xs">
                                                            {phaseLabel}
                                                        </h3>
                                                        {block.description && (
                                                            <div className="bg-white border-l-2 border-slate-400 pl-2.5 py-1 rounded-r">
                                                                <p className="text-[11px] text-slate-600 leading-relaxed">
                                                                    {block.description}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-3 sm:w-3/4 flex items-center">
                                                        <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                                                            {block.items?.[0]?.note || "-"}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div
                                                key={`block-${bIdx}`}
                                                className="bg-white border border-slate-200/90 rounded-md shadow-2xs overflow-hidden flex flex-col"
                                            >
                                                {/* Phase Header */}
                                                <div className="bg-slate-50/80 border-b border-slate-200/90 px-3.5 py-2.5 flex flex-col gap-1.5">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                                                            <span className="w-1.5 h-3.5 bg-orange-500 rounded-full inline-block shrink-0" />
                                                            <span>{phaseLabel}</span>
                                                        </h3>
                                                        <span className="text-[11px] text-slate-400 font-semibold">
                                                            {block.items?.length || 0} gerakan
                                                        </span>
                                                    </div>
                                                    {block.description && (
                                                        <div className="bg-white border border-slate-200/80 p-2 rounded-md">
                                                            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                                                                {block.description}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="divide-y divide-slate-100">
                                                    {block.items.map((item, iIdx) => (
                                                        <ExerciseItem
                                                            key={`item-${bIdx}-${iIdx}`}
                                                            item={item}
                                                            bIdx={bIdx}
                                                            iIdx={iIdx}
                                                            block={block}
                                                            columns={columns}
                                                            openModal={openModal}
                                                            data={data}
                                                            isReadOnly={isReadOnly}
                                                            isCoachOrAdmin={isCoachOrAdmin}
                                                            rpeRecords={rpeRecords}
                                                            handleExerciseChange={handleExerciseChange}
                                                            handleSetRpeChange={handleSetRpeChange}
                                                            handleExerciseArrayChange={handleExerciseArrayChange}
                                                            handleTargetChange={handleTargetChange}
                                                            handleTargetArrayChange={handleTargetArrayChange}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>

                            {/* Session Feedback & Proof for Athlete */}
                            {isAthlete && (
                                <div className="p-3.5 sm:p-4 bg-white border border-slate-200/90 rounded-md shadow-2xs flex flex-col gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                                            <span>Training Feedback Note</span>
                                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">
                                                Opsional
                                            </span>
                                        </label>
                                        <textarea
                                            value={data.athlete_note}
                                            disabled={isReadOnly}
                                            onChange={(e) => setData("athlete_note", e.target.value)}
                                            placeholder="Tambahkan catatan tambahan mengenai sesi latihanmu..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 p-2.5 min-h-[80px] resize-y placeholder:text-slate-400 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                                            <span>Foto Bukti</span>
                                            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold">
                                                Wajib
                                            </span>
                                        </label>
                                        <div className="flex items-center gap-3">
                                            {data.proof_photo ? (
                                                <div className="relative group shrink-0">
                                                    <img
                                                        src={URL.createObjectURL(data.proof_photo)}
                                                        className="h-16 w-16 object-cover rounded-md border border-slate-200 shadow-2xs cursor-pointer"
                                                        onClick={() => openModal(URL.createObjectURL(data.proof_photo), "image")}
                                                    />
                                                    {isCompleted && isAthlete ? null : (
                                                        <button
                                                            type="button"
                                                            onClick={() => setData("proof_photo", null)}
                                                            className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-100 text-red-600 rounded-full border border-white shadow-2xs hover:bg-red-200 transition-colors"
                                                            title="Hapus Foto"
                                                        >
                                                            <X size={11} strokeWidth={3} />
                                                        </button>
                                                    )}
                                                </div>
                                            ) : training?.proof_photo && !data.remove_proof_photo ? (
                                                <div className="relative group shrink-0">
                                                    <img
                                                        src={"/storage/" + training.proof_photo}
                                                        className="h-16 w-16 object-cover rounded-md border border-slate-200 shadow-2xs cursor-pointer"
                                                        onClick={() => openModal("/storage/" + training.proof_photo, "image")}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setData("remove_proof_photo", true)}
                                                        className="absolute -top-2 -right-2 bg-slate-900 text-white rounded-full p-1 shadow-2xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Hapus Foto"
                                                    >
                                                        <X size={10} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            ) : null}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="proof-photo"
                                                className="hidden"
                                                disabled={isReadOnly}
                                                onChange={(e) => {
                                                    setData((data) => ({
                                                        ...data,
                                                        remove_proof_photo: false,
                                                    }));
                                                    handlePhotoChange(e.target.files[0]);
                                                }}
                                            />
                                            <label
                                                htmlFor="proof-photo"
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-md text-xs font-semibold cursor-pointer hover:bg-slate-50 transition-colors shadow-2xs ${isReadOnly ? "opacity-50 pointer-events-none" : ""}`}
                                            >
                                                <FileImage size={13} className="text-orange-500" />
                                                <span>
                                                    {data.proof_photo || (training?.proof_photo && !data.remove_proof_photo)
                                                        ? "Ganti Foto"
                                                        : "Unggah Foto Bukti"}
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <ActionFooter
                                isAthlete={isAthlete}
                                isLocked={isLocked}
                                isCompleted={isCompleted}
                                recentlySuccessful={recentlySuccessful}
                                processing={processing}
                                onComplete={completeTraining}
                                data={data}
                                isMissingRequiredActuals={() => getMissingRequiredActuals().length > 0}
                                training={training}
                                isEditingActuals={isEditingActuals}
                                setIsEditingActuals={setIsEditingActuals}
                            />
                        </form>
                    </div>
                </div>

                <div className="text-center pt-6 pb-2">
                    <p className="text-[10.5px] font-medium text-slate-400">
                        Powered by Olympus Training Surabaya × UNESA
                    </p>
                </div>
            </div>

            {/* Media Modal */}
            {modalMedia && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/80 backdrop-blur-sm transition-opacity">
                    <div className="bg-white border border-zinc-200 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50 ">
                            <h3 className="text-sm font-bold text-zinc-900 ">
                                {modalMedia.type === "image"
                                    ? "Preview Image"
                                    : "Preview Video"}
                            </h3>
                            <div className="flex items-center gap-2">
                                <a
                                    href={modalMedia.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-zinc-500 hover:text-zinc-900 :text-zinc-100 bg-white rounded-lg shadow-sm border border-zinc-200 transition-colors flex items-center gap-2 text-xs font-bold"
                                >
                                    <Eye size={14} /> Buka Tab Baru
                                </a>
                                <button
                                    onClick={() => setModalMedia(null)}
                                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors bg-white rounded-lg shadow-sm border border-zinc-200 "
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                        <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-zinc-100 min-h-[50vh]">
                            {modalMedia.type === "image" ? (
                                <img
                                    src={modalMedia.url}
                                    alt="Preview Full"
                                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm bg-white "
                                />
                            ) : (
                                <iframe
                                    src={getEmbedUrl(modalMedia.url)}
                                    className="w-full aspect-video rounded-xl shadow-sm bg-black"
                                    allowFullScreen
                                ></iframe>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {warningMessage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm transition-opacity">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border-[4px] border-amber-50">
                            <span className=" text-2xl">!</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                            Peringatan
                        </h3>
                        <div className="max-h-64 overflow-y-auto mb-6 px-2">
                            <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-wrap text-left">
                                {warningMessage}
                            </p>
                        </div>
                        <button
                            onClick={() => setWarningMessage("")}
                            className="w-full py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20"
                        >
                            OK, Mengerti
                        </button>
                    </div>
                </div>
            )}

            {confirmComplete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs transition-opacity">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col p-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <CheckCircle2 className="text-emerald-500" size={18} />
                                <span>Selesaikan & Verifikasi Latihan</span>
                            </h2>
                            <button
                                type="button"
                                onClick={() => setConfirmComplete(false)}
                                className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Photo Proof Upload Section */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <FileImage size={13} className="text-orange-500" />
                                <span>Foto Bukti Latihan</span>
                                <span className="text-rose-500 text-xs">*</span>
                            </label>

                            <div className="flex items-center gap-3">
                                {data.proof_photo ? (
                                    <div className="relative group shrink-0 w-16 h-16 rounded-md overflow-hidden border border-orange-300 shadow-2xs">
                                        <img
                                            src={URL.createObjectURL(data.proof_photo)}
                                            alt="Preview Foto"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setData("proof_photo", null)}
                                            className="absolute top-1 right-1 p-0.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
                                        >
                                            <X size={10} strokeWidth={3} />
                                        </button>
                                    </div>
                                ) : training?.proof_photo && !data.remove_proof_photo ? (
                                    <div className="relative group shrink-0 w-16 h-16 rounded-md overflow-hidden border border-slate-200 shadow-2xs">
                                        <img
                                            src={"/storage/" + training.proof_photo}
                                            alt="Foto Tersimpan"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : null}

                                <input
                                    type="file"
                                    accept="image/*"
                                    id="modal-proof-photo"
                                    className="hidden"
                                    onChange={(e) => {
                                        setData((d) => ({ ...d, remove_proof_photo: false }));
                                        handlePhotoChange(e.target.files[0]);
                                    }}
                                />
                                <label
                                    htmlFor="modal-proof-photo"
                                    className="flex-1 flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-200 hover:border-orange-400 rounded-lg cursor-pointer bg-slate-50/50 hover:bg-orange-50/20 transition-all text-center"
                                >
                                    <FileImage size={16} className="text-orange-500 mb-1" />
                                    <span className="text-xs font-semibold text-slate-700">
                                        {data.proof_photo || (training?.proof_photo && !data.remove_proof_photo)
                                            ? "Ganti Foto Bukti"
                                            : "Pilih / Ambil Foto Bukti"}
                                    </span>
                                    <span className="text-[10px] text-slate-400">JPG, PNG maks 5MB</span>
                                </label>
                            </div>
                        </div>

                        {/* Signature Pad Section */}
                        <div className="pt-1">
                            <SignaturePad
                                value={data.signature_data}
                                onChange={(sig) => setData("signature_data", sig)}
                                label="Tanda Tangan Digital Klien / Atlet"
                                height={160}
                            />
                        </div>

                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-left">
                            <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600 shrink-0 mt-0.5">
                                <Info size={14} />
                            </div>
                            <div className="space-y-0.5 text-left">
                                <p className="text-xs font-bold text-slate-800">
                                    Verifikasi Selesai Latihan
                                </p>
                                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                                    Pastikan foto bukti telah terunggah dan klien/atlet membubuhkan tanda tangan digital sebagai persetujuan penyelesaian sesi latihan.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setConfirmComplete(false)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={confirmAndComplete}
                                disabled={processing || (!data.proof_photo && !training.proof_photo) || (!data.signature_data && !training.signature_photo)}
                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                                <CheckCircle2 size={14} />
                                <span>{processing ? "Menyimpan..." : "Konfirmasi & Selesaikan"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
