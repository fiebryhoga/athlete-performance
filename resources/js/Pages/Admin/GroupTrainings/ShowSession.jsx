import React, { useState, useMemo, useEffect } from "react";

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
    Plus,
    X,
    FileText,
    User,
    Users,
    Save,
} from "lucide-react";

import ActionFooter from "../IndividualTrainings/Partials/ActionFooter";
import ExerciseItem from "../IndividualTrainings/Partials/ExerciseItem";
import PageHeader from "@/Components/Common/PageHeader";

export default function ShowSession({
    auth,
    training,
    group,
    availableAthletes = [],
    coaches = [],
}) {
    const { permissions } = usePage().props;
    const canUpdate = permissions?.individual_training?.update ?? false;
    const canCreate = permissions?.individual_training?.create ?? false;
    const isAthlete = auth.user?.role === "athlete";
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
    const rpeRecords = training.rpe_records || [];
    const membersPivot = training.members_pivot || [];
    
    // Sort members for consistent order, then pick the first as default
    const scheduledIds = Array.isArray(training.attendee_ids) ? training.attendee_ids : [];
    let membersToDisplay = [];
    
    if (scheduledIds.length > 0) {
        membersToDisplay = availableAthletes.filter(a => scheduledIds.includes(a.id)).map(m => ({
            ...m, 
            isGuest: !training.group?.members?.find(g => g.id === m.id)
        }));
    } else {
        // Fallback for old sessions that have empty attendee_ids
        membersToDisplay = (training.group?.members || []).map(m => ({ ...m, isGuest: false }));
    }
    
    const sortedMembers = membersToDisplay.sort((a, b) => a.name.localeCompare(b.name));
    const initialAthleteId = isAthlete ? auth.user?.id : (sortedMembers[0]?.id || null);
    const [selectedAthleteId, setSelectedAthleteId] = useState(initialAthleteId);
    useEffect(() => {
        if (!selectedAthleteId && sortedMembers.length > 0) {
            setSelectedAthleteId(isAthlete ? auth.user?.id : sortedMembers[0].id);
        }
    }, [sortedMembers, selectedAthleteId, isAthlete, auth.user?.id]);

    // Initial RPEs Helper
    const getInitialRpes = (athleteId) => {
        const rpes = {};
        const athleteRecords = rpeRecords.filter(r => r.athlete_id === athleteId);
        athleteRecords.forEach((record) => {
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

    // Initial Targets Helper (Using template defaults since there are no custom targets for group)
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

    // Per-athlete completion status via pivot
    const currentPivot = membersPivot.find(p => p.athlete_id === selectedAthleteId);
    const isCompleted = currentPivot?.is_completed || false;
    const isExcused = false;

    const tDate = new Date(training.date);
    tDate.setHours(0, 0, 0, 0);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(todayDate - tDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isPastOneWeek = tDate < todayDate && diffDays > 7;

    const getInitialData = (athleteId) => {
        const pivot = membersPivot.find(p => p.athlete_id === athleteId);
        return {
            athlete_id: athleteId,
            rpes: getInitialRpes(athleteId),
            targets: getInitialTargets(),
            group_note: pivot?.athlete_note || "",
            proof_photo: null,
            remove_proof_photo: false,
        };
    };

    const {
        data,
        setData,
        post,
        processing,
        recentlySuccessful,
        errors,
        isDirty,
    } = useForm(getInitialData(selectedAthleteId));

    // Re-init form when switching athlete tab
    useEffect(() => {
        if (selectedAthleteId) {
            setData(getInitialData(selectedAthleteId));
        }
    }, [selectedAthleteId]);

    const [mainTab, setMainTab] = useState("detail");
    const [warningMessage, setWarningMessage] = useState("");
    const [confirmComplete, setConfirmComplete] = useState(false);
    const [completeMode, setCompleteMode] = useState("single"); // 'single' | 'all'
    const [isEditingActuals, setIsEditingActuals] = useState(false);

    const currentAthlete = sortedMembers.find((m) => m.id === selectedAthleteId);
    const allMembersCompleted = sortedMembers.length > 0 && sortedMembers.every(m => membersPivot.find(p => p.athlete_id === m.id)?.is_completed);

    // Per-athlete lock
    const isLocked = isCompleted && !isEditingActuals;
    const isReadOnly = isLocked || (!isAthlete && !isCoachOrAdmin);

    // Back URL logic
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const fromPage = urlParams.get('from');
    const athleteIdParam = urlParams.get('athlete_id');

    let backUrl = route("admin.group-trainings.show", training.training_group_id);
    if (fromPage === 'athlete' && athleteIdParam) {
        backUrl = route("admin.individual-trainings.show", athleteIdParam);
    } else if (isAthlete) {
        backUrl = route("admin.individual-trainings.show", auth.user.id);
    }

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

    const submitRpe = (e, applyToAll = false) => {
        if (e && e.preventDefault) e.preventDefault();
        router.post(
            route("admin.group-trainings.session.rpe", training.id),
            {
                athlete_id: selectedAthleteId,
                rpes: data.rpes,
                apply_to_all: applyToAll,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const getMissingRequiredActuals = () => {
        if (!isAthlete) return [];
        let missing = [];
        training.blocks.forEach((block) => {
            if (block.target_filled_by === "group") {
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

    const completeTraining = (applyToAll = false) => {
        if (isAthlete) {
            const hasPhoto =
                data.proof_photo ||
                (currentPivot?.proof_photo && !data.remove_proof_photo);

            const missingFields = getMissingRequiredActuals();
            
            if (!hasPhoto) {
                missingFields.push("Foto Bukti (wajib diunggah)");
            }

            if (missingFields.length > 0) {
                const formattedMissing = missingFields
                    .map((m) => `• ${m}`)
                    .join("\n");
                setWarningMessage(
                    `Pengisian belum lengkap. Anda belum mengisi:\n\n${formattedMissing}`,
                );
                return;
            }
        }

        setCompleteMode(applyToAll ? "all" : "single");
        setConfirmComplete(true);
    };

    const confirmAndComplete = () => {
        router.post(
            route("admin.group-trainings.session.complete", training.id),
            {
                athlete_id: selectedAthleteId,
                rpes: data.rpes,
                apply_to_all: completeMode === "all" ? 1 : 0,
                group_note: data.group_note,
                proof_photo: data.proof_photo,
            },
            {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => setConfirmComplete(false),
            },
        );
    };

    return (
        <AppLayout title={`Detail Sesi - ${training.name || "Latihan"}`}>
            <Head title={`Detail Sesi - ${training.name || "Latihan"}`} />

            <div className="space-y-4 pb-12">
                {/* ─── BREADCRUMB & HEADER ─── */}
                <div className="space-y-1">
                    <Link
                        href={route("admin.group-trainings.show", group?.id || training?.training_group_id || training?.group?.id || 1)}
                        className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors gap-1.5"
                    >
                        <ChevronLeft size={13} /> Kembali ke Kalender Latihan Grup
                    </Link>

                    <PageHeader
                        title={
                            <div className="flex items-center gap-2">
                                <span>{training.name || "Detail Sesi Latihan Grup"}</span>
                                <span className={`text-xs font-semibold ${
                                    training.status === "completed" || training.is_completed || isCompleted
                                        ? "text-emerald-600"
                                        : "text-orange-500"
                                }`}>
                                    ({training.status === "completed" || training.is_completed || isCompleted ? "Selesai" : "Terjadwal"})
                                </span>
                            </div>
                        }
                        description={`${training.is_extra ? "Sesi Tambahan" : training.session_number ? `Sesi ${training.session_number}` : "Sesi Latihan"} - ${training.date}${training.location ? ` - ${training.location}` : ""}`}
                        actions={
                            <div className="flex items-center gap-2">
                                <a
                                    href={route("admin.group-trainings.session.export-pdf", training.id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-semibold shadow-2xs transition-colors"
                                >
                                    <FileText size={13} />
                                    <span>Download PDF</span>
                                </a>

                                {isCoachOrAdmin && (
                                    <Link
                                        href={route("admin.group-trainings.session.edit", training.id)}
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
                        KOLOM KIRI (4 Kolom di LG) — Informasi Sesi, Anggota & Status
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
                                    training.status === "completed" || training.is_completed || isCompleted
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/70"
                                        : "bg-slate-100 text-slate-700 border-slate-200"
                                }`}>
                                    {training.status === "completed" || training.is_completed || isCompleted ? "Selesai" : "Terjadwal"}
                                </span>
                            </div>

                            <div className="p-3.5 space-y-3 text-xs">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Nama Sesi</span>
                                    <span className="font-bold text-slate-900 text-sm block leading-snug">{training.name || "Program Latihan Grup"}</span>
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
                                            <span className="text-slate-400 italic">Admin</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Pilih Atlet Anggota Grup */}
                        {!isAthlete && sortedMembers.length > 0 && (
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                <div className="bg-slate-50/80 border-b border-slate-200/90 px-3.5 py-2.5 flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                        <User size={13} className="text-orange-500" />
                                        <span>Pilih Atlet (Member)</span>
                                    </h3>
                                    <span className="text-[10.5px] font-medium text-slate-500">
                                        {sortedMembers.length} atlet
                                    </span>
                                </div>

                                <div className="p-3">
                                    <div className="flex flex-col gap-1.5">
                                        {sortedMembers.map((member) => {
                                            const pivot = membersPivot.find((p) => p.athlete_id === member.id);
                                            const isDone = pivot?.is_completed;
                                            const isSelected = selectedAthleteId === member.id;

                                            return (
                                                <button
                                                    key={member.id}
                                                    type="button"
                                                    onClick={() => setSelectedAthleteId(member.id)}
                                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition-all cursor-pointer text-left ${
                                                        isDone
                                                            ? isSelected
                                                                ? "bg-gradient-to-r from-emerald-100/90 via-emerald-50 to-white text-emerald-950 border border-emerald-500 shadow-2xs font-bold"
                                                                : "bg-emerald-50/70 hover:bg-emerald-100/60 text-emerald-900 border border-emerald-300/80 font-semibold"
                                                            : isSelected
                                                                ? "bg-gradient-to-r from-orange-50 via-orange-50/40 to-white text-orange-950 border border-orange-400 shadow-2xs font-bold"
                                                                : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold"
                                                    }`}
                                                >
                                                    <span className="truncate pr-2">{member.name}</span>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        {member.isGuest && (
                                                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                                                isDone
                                                                    ? "bg-emerald-100 text-emerald-800"
                                                                    : "bg-orange-100 text-orange-600"
                                                            }`}>
                                                                GUEST
                                                            </span>
                                                        )}
                                                        {isDone && (
                                                            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Card 3: Status & Catatan Feedback Atlet Terpilih */}
                        <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                            <div className="bg-slate-50/80 border-b border-slate-200/90 px-3.5 py-2.5">
                                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    <AlignLeft size={13} className="text-orange-500" />
                                    <span>Status & Feedback ({sortedMembers.find((m) => m.id === selectedAthleteId)?.name || "Atlet"})</span>
                                </h3>
                            </div>

                            <div className="p-3.5 space-y-3">
                                {/* Status Box */}
                                {isCompleted ? (
                                    <div className="p-2.5 rounded-md border border-emerald-200/80 bg-emerald-50/70 flex items-center gap-2 text-xs text-emerald-800">
                                        <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                                        <div>
                                            <span className="font-bold block">Selesai Dikerjakan</span>
                                            {currentPivot?.completed_at && (
                                                <span className="text-[10.5px] opacity-80 block">
                                                    {new Date(currentPivot.completed_at).toLocaleString("id-ID", {
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
                                {currentPivot?.athlete_note && (
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Catatan Atlet</span>
                                        <div className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-md text-xs text-slate-700 italic">
                                            "{currentPivot.athlete_note}"
                                        </div>
                                    </div>
                                )}

                                {/* Proof Photo Preview */}
                                {currentPivot?.proof_photo && (
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Foto Bukti</span>
                                        <button
                                            type="button"
                                            onClick={() => openModal("/storage/" + currentPivot.proof_photo, "image")}
                                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                                        >
                                            <FileImage size={13} className="text-orange-500" />
                                            <span>Lihat Foto Bukti</span>
                                        </button>
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
                            .filter((block) => {
                                if (block.athlete_ids && Array.isArray(block.athlete_ids) && block.athlete_ids.length > 0) {
                                    if (!block.athlete_ids.includes(selectedAthleteId)) return false;
                                }
                                return Number(block.step) === 1;
                            })
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
                                    {training.blocks.filter((block) => {
                                        if (block.athlete_ids && Array.isArray(block.athlete_ids) && block.athlete_ids.length > 0) {
                                            if (!block.athlete_ids.includes(selectedAthleteId)) return false;
                                        }
                                        return Number(block.step) === 2;
                                    }).length} fase latihan tersusun
                                </p>
                            </div>
                        </div>

                        {/* Form Program Latihan */}
                        <form onSubmit={submitRpe} className="space-y-4">
                            <div className="flex flex-col gap-4">
                                {training.blocks
                                    .filter((block) => {
                                        if (block.athlete_ids && Array.isArray(block.athlete_ids) && block.athlete_ids.length > 0) {
                                            if (!block.athlete_ids.includes(selectedAthleteId)) return false;
                                        }
                                        return Number(block.step) === 2;
                                    })
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
                                            placeholder="Tambahkan catatan tambahan mengenai sesi latihan grup ini..."
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
                                            ) : currentPivot?.proof_photo && !data.remove_proof_photo ? (
                                                <div className="relative group shrink-0">
                                                    <img
                                                        src={"/storage/" + currentPivot.proof_photo}
                                                        className="h-16 w-16 object-cover rounded-md border border-slate-200 shadow-2xs cursor-pointer"
                                                        onClick={() => openModal("/storage/" + currentPivot.proof_photo, "image")}
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
                                                    {data.proof_photo || (currentPivot?.proof_photo && !data.remove_proof_photo)
                                                        ? "Ganti Foto"
                                                        : "Unggah Foto Bukti"}
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isAthlete ? (
                                <ActionFooter
                                    isAthlete={isAthlete}
                                    isLocked={isLocked}
                                    isCompleted={isCompleted}
                                    recentlySuccessful={recentlySuccessful}
                                    processing={processing}
                                    onComplete={() => completeTraining(false)}
                                    data={data}
                                    isMissingRequiredActuals={() => getMissingRequiredActuals().length > 0}
                                    training={training}
                                    isEditingActuals={isEditingActuals}
                                    setIsEditingActuals={setIsEditingActuals}
                                />
                            ) : (
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t border-slate-200 mt-4">
                                    {/* Left info badge */}
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/90 rounded-md shrink-0 whitespace-nowrap">
                                        <User size={13} className="text-orange-500 shrink-0" />
                                        <span className="text-xs text-slate-600">
                                            Klien: <strong className="text-slate-900 font-semibold">{currentAthlete?.name || 'Pilih Atlet'}</strong>
                                        </span>
                                        <span className="text-slate-300">•</span>
                                        {isCompleted ? (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                                                <CheckCircle2 size={12} className="text-emerald-600" /> Selesai
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600">
                                                <Clock size={12} className="text-orange-500" /> Terjadwal
                                            </span>
                                        )}
                                    </div>

                                    {/* Right Action Buttons */}
                                    <div className="flex items-center justify-end gap-2 flex-wrap">
                                        {/* Action untuk Klien Terpilih */}
                                        <button
                                            type="button"
                                            disabled={processing}
                                            onClick={(e) => submitRpe(e, false)}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                                            title="Simpan input hanya untuk atlet yang sedang dipilih"
                                        >
                                            <Save size={13} className="text-slate-500" />
                                            <span>Simpan</span>
                                        </button>

                                        {!isCompleted ? (
                                            <button
                                                type="button"
                                                disabled={processing}
                                                onClick={() => completeTraining(false)}
                                                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                                                title="Selesaikan sesi hanya untuk atlet ini"
                                            >
                                                <CheckCircle2 size={13} />
                                                <span>Selesaikan</span>
                                            </button>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-bold whitespace-nowrap">
                                                <CheckCircle2 size={13} /> Selesai
                                            </span>
                                        )}

                                        {/* Divider if multiple members */}
                                        {sortedMembers.length > 1 && (
                                            <>
                                                <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

                                                {!allMembersCompleted ? (
                                                    <button
                                                        type="button"
                                                        disabled={processing}
                                                        onClick={() => completeTraining(true)}
                                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                                                        title="Selesaikan sesi grup untuk semua atlet sekaligus"
                                                    >
                                                        <CheckCircle2 size={13} />
                                                        <span>Selesaikan Semua Atlet</span>
                                                    </button>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-bold whitespace-nowrap">
                                                        <CheckCircle2 size={13} /> Semua Atlet Selesai
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity">
                    <div className="bg-white border border-slate-200 rounded-md shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                            <h3 className="text-xs font-bold text-slate-900">
                                {modalMedia.type === "image" ? "Preview Image" : "Preview Video"}
                            </h3>
                            <div className="flex items-center gap-2">
                                <a
                                    href={modalMedia.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 text-slate-500 hover:text-slate-900 bg-white rounded-md shadow-2xs border border-slate-200 transition-colors flex items-center gap-1 text-xs font-semibold"
                                >
                                    <Eye size={12} /> Buka Tab Baru
                                </a>
                                <button
                                    onClick={() => setModalMedia(null)}
                                    className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-slate-100 min-h-[50vh]">
                            {modalMedia.type === "image" ? (
                                <img
                                    src={modalMedia.url}
                                    alt="Preview Full"
                                    className="max-w-full max-h-[70vh] object-contain rounded-md shadow-2xs bg-white"
                                />
                            ) : (
                                <iframe
                                    src={getEmbedUrl(modalMedia.url)}
                                    className="w-full aspect-video rounded-md shadow-2xs bg-black"
                                    allowFullScreen
                                ></iframe>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Warning Message Modal */}
            {warningMessage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity">
                    <div className="bg-white border border-slate-200 rounded-md shadow-2xl w-full max-w-sm overflow-hidden flex flex-col p-5 text-center">
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-amber-50">
                            <span className="text-xl font-bold">!</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                            Peringatan
                        </h3>
                        <div className="max-h-64 overflow-y-auto mb-4 px-1">
                            <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap text-left">
                                {warningMessage}
                            </p>
                        </div>
                        <button
                            onClick={() => setWarningMessage("")}
                            className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold transition-colors shadow-2xs"
                        >
                            OK, Mengerti
                        </button>
                    </div>
                </div>
            )}

            {/* Confirm Complete Modal */}
            {confirmComplete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity">
                    <div className="bg-white border border-slate-200 rounded-md shadow-2xl w-full max-w-md overflow-hidden flex flex-col p-5">
                        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <CheckCircle2 className="text-emerald-600" size={16} />
                            {completeMode === "all" ? "Konfirmasi Selesai Semua Atlet" : "Konfirmasi Selesai Latihan"}
                        </h2>
                        
                        <div className="mb-3 bg-slate-50 p-3 rounded-md border border-slate-200/80">
                            <p className="text-xs text-slate-700">
                                {completeMode === "all" ? (
                                    <>Menyelesaikan latihan untuk: <strong className="text-slate-900">Semua Atlet ({sortedMembers.length} orang)</strong></>
                                ) : (
                                    <>Menyelesaikan latihan untuk: <strong className="text-slate-900">{currentAthlete?.name}</strong></>
                                )}
                            </p>
                        </div>

                        <p className="text-slate-600 mb-4 text-xs leading-relaxed">
                            {completeMode === "all"
                                ? "Apakah Anda yakin ingin menyelesaikan dan menyerahkan program latihan ini untuk SEMUA atlet di sesi grup sekaligus? Status seluruh member akan ditandai selesai."
                                : "Apakah Anda yakin ingin menyelesaikan dan menyerahkan program latihan untuk atlet ini? Setelah diserahkan, data aktual atlet ini sudah tidak bisa diedit lagi."}
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setConfirmComplete(false)}
                                className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-200 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmAndComplete}
                                disabled={processing}
                                className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-2xs"
                            >
                                <CheckCircle2 size={13} />
                                <span>{completeMode === "all" ? "Ya, Selesaikan Semua" : "Ya, Selesai"}</span>
                            </button>
                        </div>
                        {errors.error && (
                            <div className="text-red-500 text-xs font-bold text-right mt-2">
                                {errors.error}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
