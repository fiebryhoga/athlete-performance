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
    X,
    FileText,
    User,
} from "lucide-react";

import ActionFooter from "../IndividualTrainings/Partials/ActionFooter";
import ExerciseItem from "../IndividualTrainings/Partials/ExerciseItem";
import PageHeader from "@/Components/Layout/PageHeader";

export default function ShowSession({
    auth,
    training,
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
    const sortedMembers = [...(training.group?.members || [])].sort((a, b) => a.name.localeCompare(b.name));
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
    const [isEditingActuals, setIsEditingActuals] = useState(false);

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

    const submitRpe = (e) => {
        e.preventDefault();
        post(route("admin.group-trainings.session.rpe", training.id), {
            preserveScroll: true,
            forceFormData: true,
        });
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

    const completeTraining = () => {
        const hasPhoto =
            data.proof_photo ||
            (currentPivot?.proof_photo && !data.remove_proof_photo);

        const missingFields = getMissingRequiredActuals();
        
        if (isAthlete && !hasPhoto) {
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

        setConfirmComplete(true);
    };

    const confirmAndComplete = () => {
        post(
            route("admin.group-trainings.session.complete", training.id),
            {
                forceFormData: true,
                onSuccess: () => setConfirmComplete(false),
            },
        );
    };

    return (
        <AppLayout title={`Detail Sesi - ${training.name || "Latihan"}`}>
            <Head title={`Detail Sesi - ${training.name || "Latihan"}`} />

            <div className="pb-12 mx-auto space-y-8 relative">
                <div className="flex flex-col gap-6">
                    <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-70 pointer-events-none"></div>
                        <div className="relative z-10 space-y-4 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <button type="button" onClick={() => window.history.back()} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-sm font-semibold mr-2">
                                    <ArrowLeft size={16} /> Kembali
                                </button>
                                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                                    Sesi {training.session_number}
                                </span>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${training.status === 'completed' || training.is_completed ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                                    {training.status === 'completed' || training.is_completed ? 'Selesai' : 'Terjadwal'}
                                </span>
                            </div>
                            
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                                {training.name || 'Program Latihan Grup'}
                            </h1>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={16} className="text-slate-400" />
                                    <span className="font-medium">{training.date}</span>
                                </div>
                                {training.training_type && (
                                    <div className="flex items-center gap-1.5">
                                        <Target size={16} className="text-slate-400" />
                                        <span className="font-medium">{training.training_type}</span>
                                    </div>
                                )}
                                {training.location && (
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={16} className="text-slate-400" />
                                        <span className="font-medium">{training.location}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="pt-2 flex flex-wrap items-center gap-3">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coach:</span>
                                {coaches && coaches.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {coaches.map(c => (
                                            <div key={c.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full py-1 pr-3 pl-1">
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                                                    <User size={12} />
                                                </div>
                                                <span className="text-xs font-semibold text-slate-700">{c.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full py-1 pr-3 pl-1">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
                                            <User size={12} />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-700">Admin</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-end gap-3 md:pt-8 w-full md:w-auto">
                            <a 
                                href={route("admin.group-trainings.session.export-pdf", training.id)}
                                className="flex-1 sm:flex-none items-center justify-center flex gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all"
                            >
                                <FileText size={18} /> Download PDF
                            </a>
                            {isCoachOrAdmin && (
                                <Link
                                    href={route("admin.group-trainings.session.edit", training.id)}
                                    className="flex-1 sm:flex-none items-center justify-center flex gap-2 px-4 py-2.5 bg-indigo-600 text-white border border-transparent rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
                                >
                                    <Edit2 size={18} /> Edit
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Warning / Error Messages */}
                {(!isCoachOrAdmin || mainTab === "detail") && (
                    <>
                        {errors.error && (
                            <div className="mb-4 p-4 rounded-xl border border-red-200 bg-red-50 flex items-start gap-3 text-sm text-red-800 shadow-sm">
                                <X size={20} className="mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="font-bold mb-1">
                                        {"Gagal Menyimpan"}
                                    </h4>
                                    <p className="leading-relaxed opacity-90">
                                        {errors.error}
                                    </p>
                                </div>
                            </div>
                        )}
                        {isAthlete && training.status === "needs_update" && (
                            <div className="mb-4 p-4 rounded-xl border border-blue-200 bg-blue-50 flex items-start gap-3 text-sm text-blue-800 shadow-sm">
                                <Info size={20} className="mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="font-bold mb-1">
                                        {"Pembaruan Latihan"}
                                    </h4>
                                    <p className="leading-relaxed opacity-90">
                                        {
                                            "Admin atau Pelatih baru saja menambahkan atau mengubah program latihan ini. Silakan lengkapi bagian yang belum dikerjakan, lalu tekan tombol Selesaikan Latihan kembali."
                                        }
                                    </p>
                                </div>
                            </div>
                        )}
                        {/* Instructions */}
                        {training.blocks
                            .filter((block) => Number(block.step) === 1)
                            .map((block, bIdx) => (
                                <div
                                    key={`inst-${bIdx}`}
                                    className="space-y-2 px-1 pt-2"
                                >
                                    <div className="font-bold text-lg text-zinc-900">
                                        {block.title ||
                                            block.category
                                                .replace("_", " ")
                                                .replace(/\b\w/g, (l) =>
                                                    l.toUpperCase(),
                                                )}
                                    </div>
                                    <div className="text-base text-zinc-700 whitespace-pre-wrap leading-relaxed max-w-4xl">
                                        {block.items?.[0]?.note ||
                                            block.description ||
                                            ""}
                                    </div>
                                </div>
                            ))}

                        {isAdmin &&
                            (() => {
                                const isProgress =
                                    training.status === "in_progress";
                                const isNeedsUpdate =
                                    training.status === "needs_update";
                                const isExcused = false; // Individual doesn't use excused

                                if (isCompleted) {
                                    return (
                                        <div className="mt-4 p-3 rounded-lg border border-emerald-200 bg-emerald-50 flex items-center gap-2 text-sm text-emerald-800">
                                            <CheckCircle2 size={16} />
                                            <span className="font-semibold">
                                                {"Selesai Dikerjakan"}
                                            </span>
                                            {currentPivot?.completed_at && (
                                                <span className="opacity-75">
                                                    pada{" "}
                                                    {new Date(
                                                        currentPivot.completed_at,
                                                    ).toLocaleString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                    );
                                } else if (isNeedsUpdate) {
                                    return (
                                        <div className="mt-4 p-3 rounded-lg border border-blue-200 bg-blue-50 flex items-center gap-2 text-sm text-blue-800">
                                            <Info size={16} />
                                            <span className="font-semibold">
                                                {"Perlu Update"}
                                            </span>
                                            {training.updated_at && (
                                                <span className="opacity-75">
                                                    {" "}
                                                    (Terakhir disimpan:{" "}
                                                    {new Date(
                                                        training.updated_at,
                                                    ).toLocaleString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                    )
                                                </span>
                                            )}
                                        </div>
                                    );
                                } else if (isProgress) {
                                    return (
                                        <div className="mt-4 p-3 rounded-lg border border-amber-200 bg-amber-50 flex items-center gap-2 text-sm text-amber-800">
                                            <Clock size={16} />
                                            <span className="font-semibold">
                                                {"Sedang Dikerjakan"}
                                            </span>
                                            {training.updated_at && (
                                                <span className="opacity-75">
                                                    {" "}
                                                    (Terakhir disimpan:{" "}
                                                    {new Date(
                                                        training.updated_at,
                                                    ).toLocaleString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                    )
                                                </span>
                                            )}
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div className="mt-4 p-3 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center gap-2 text-sm text-zinc-600">
                                            <Clock size={16} />
                                            <span className="font-semibold">
                                                {"Belum Dikerjakan"}
                                            </span>
                                        </div>
                                    );
                                }
                            })()}

                        {!isAthlete && (
                            <div className="mt-8 border-b border-zinc-200 pb-0 mb-4">
                                <h2 className="text-sm font-bold text-zinc-500 mb-4">
                                    View By Athlete
                                </h2>
                                <div className="flex items-center gap-0 overflow-x-auto custom-scrollbar">
                                    {sortedMembers.map((member) => {
                                        const pivot = membersPivot.find(p => p.athlete_id === member.id);
                                        const isDone = pivot?.is_completed;
                                        const isSelected = selectedAthleteId === member.id;
                                        
                                        return (
                                            <button
                                                key={member.id}
                                                type="button"
                                                onClick={() => setSelectedAthleteId(member.id)}
                                                className={`whitespace-nowrap pb-3 px-4 border-b-2 font-semibold text-sm transition-colors flex items-center gap-2 ${isSelected ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-400 hover:text-zinc-600"}`}
                                            >
                                                {member.name}
                                                {isDone && <CheckCircle2 size={16} className="text-emerald-500" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        {/* Table */}
                        <form
                            onSubmit={submitRpe}
                            className=" overflow-hidden rounded-xl shadow-sm mt-4"
                        >
                            <div className="flex flex-col gap-4 bg-zinc-50/50">
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
                                        const columns =
                                            categoryMap[block.category] ||
                                            "full";
                                        const phaseLabel =
                                            block.title ||
                                            block.category
                                                .replace("_", " ")
                                                .replace(/\b\w/g, (l) =>
                                                    l.toUpperCase(),
                                                );

                                        if (columns === "note_only") {
                                            return (
                                                <div
                                                    key={`block-${bIdx}`}
                                                    className="bg-white border border-zinc-200 rounded-2xl shadow-sm flex flex-col sm:flex-row overflow-hidden"
                                                >
                                                    <div className="bg-zinc-100/50 border-b sm:border-b-0 sm:border-r border-zinc-200 p-4 sm:w-1/4 flex flex-col justify-center gap-2">
                                                        <h3 className="font-bold text-zinc-900 text-sm">
                                                            {phaseLabel}
                                                        </h3>
                                                        {block.description && (
                                                            <div className="bg-white/50 border-l-2 border-zinc-400 pl-3 py-1.5 rounded-r">
                                                                <p className="text-xs text-zinc-600 leading-relaxed">
                                                                    {
                                                                        block.description
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-4 sm:w-3/4 flex items-center">
                                                        <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">
                                                            {block.items?.[0]
                                                                ?.note || "-"}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div
                                                key={`block-${bIdx}`}
                                                className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden flex flex-col"
                                            >
                                                <div className="bg-zinc-100/50 border-b border-zinc-200 px-4 py-3 flex flex-col gap-2">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                                                            <Target
                                                                size={16}
                                                                className="text-zinc-500"
                                                            />{" "}
                                                            {phaseLabel}
                                                        </h3>
                                                    </div>
                                                    {block.description && (
                                                        <div className="bg-white/50 border-l-2 border-zinc-400 pl-3 py-2 ml-6 rounded-r">
                                                            <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-wrap">
                                                                {
                                                                    block.description
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="divide-y divide-zinc-100 ">
                                                    {block.items.map(
                                                        (item, iIdx) => {
                                                            const exercise =
                                                                item.exercise;
                                                            const images =
                                                                exercise?.images ||
                                                                [];
                                                            const videos =
                                                                exercise?.videos?.filter(
                                                                    (v) =>
                                                                        v &&
                                                                        v.trim() !==
                                                                            "",
                                                                ) || [];
                                                            const maxSets =
                                                                Math.max(
                                                                    ...(
                                                                        String(
                                                                            item.sets ||
                                                                                "0",
                                                                        ).match(
                                                                            /\d+/g,
                                                                        ) || [0]
                                                                    ).map(
                                                                        Number,
                                                                    ),
                                                                    0,
                                                                );

                                                            return (
                                                                <ExerciseItem
                                                                    key={`item-${bIdx}-${iIdx}`}
                                                                    item={item}
                                                                    bIdx={bIdx}
                                                                    iIdx={iIdx}
                                                                    block={
                                                                        block
                                                                    }
                                                                    columns={
                                                                        columns
                                                                    }
                                                                    openModal={
                                                                        openModal
                                                                    }
                                                                    data={data}
                                                                    isReadOnly={
                                                                        isReadOnly
                                                                    }
                                                                    isCoachOrAdmin={
                                                                        isCoachOrAdmin
                                                                    }
                                                                    rpeRecords={
                                                                        rpeRecords
                                                                    }
                                                                    handleExerciseChange={
                                                                        handleExerciseChange
                                                                    }
                                                                    handleSetRpeChange={
                                                                        handleSetRpeChange
                                                                    }
                                                                    handleExerciseArrayChange={
                                                                        handleExerciseArrayChange
                                                                    }
                                                                    handleTargetChange={
                                                                        handleTargetChange
                                                                    }
                                                                    handleTargetArrayChange={
                                                                        handleTargetArrayChange
                                                                    }
                                                                />
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>

                            {/* Session Feedback & Proof */}
                            {isAthlete && (
                                <div className="p-4 sm:p-6 bg-white border-t border-zinc-200 flex flex-col gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 mb-2 flex items-center gap-2">
                                            Training Feedback Note{" "}
                                            <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-lg font-medium lowercase tracking-normal">
                                                {"Opsional"}
                                            </span>
                                        </label>
                                        <textarea
                                            value={data.group_note}
                                            disabled={isReadOnly}
                                            onChange={(e) =>
                                                setData(
                                                    "group_note",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Tambahkan catatan tambahan mengenai sesi latihanmu..."
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 p-3 min-h-[100px] resize-y placeholder:text-zinc-400 focus:ring-1 focus:ring-zinc-900 :ring-zinc-100 disabled:opacity-50"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-700 mb-2 flex items-center gap-2">
                                            Proof Photo{" "}
                                            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-lg font-bold">
                                                {"Wajib"}
                                            </span>
                                        </label>
                                        <div className="flex items-center gap-4">
                                            {data.proof_photo ? (
                                                <div className="relative group shrink-0">
                                                    <img
                                                        src={URL.createObjectURL(
                                                            data.proof_photo,
                                                        )}
                                                        className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg border border-zinc-200 shadow-sm cursor-pointer"
                                                        onClick={() =>
                                                            openModal(
                                                                URL.createObjectURL(
                                                                    data.proof_photo,
                                                                ),
                                                                "image",
                                                            )
                                                        }
                                                    />
                                                    {isCompleted &&
                                                    isAthlete ? null : (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setData(
                                                                    "proof_photo",
                                                                    null,
                                                                )
                                                            }
                                                            className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-full border-2 border-white shadow-sm hover:bg-red-200 transition-colors"
                                                            title="Delete Photo"
                                                        >
                                                            <X
                                                                size={14}
                                                                strokeWidth={3}
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                            ) : currentPivot?.proof_photo &&
                                              !data.remove_proof_photo ? (
                                                <div className="relative group shrink-0">
                                                    <img
                                                        src={
                                                            "/storage/" +
                                                            currentPivot.proof_photo
                                                        }
                                                        className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg border border-zinc-200 shadow-sm cursor-pointer"
                                                        onClick={() =>
                                                            openModal(
                                                                "/storage/" +
                                                                    currentPivot.proof_photo,
                                                                "image",
                                                            )
                                                        }
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setData(
                                                                "remove_proof_photo",
                                                                true,
                                                            )
                                                        }
                                                        className="absolute -top-2 -right-2 bg-zinc-900 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Delete Draft Photo"
                                                    >
                                                        <X
                                                            size={10}
                                                            strokeWidth={3}
                                                        />
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
                                                    handlePhotoChange(
                                                        e.target.files[0],
                                                    );
                                                }}
                                            />
                                            <label
                                                htmlFor="proof-photo"
                                                className={`flex items-center gap-2 px-4 py-2.5 bg-white text-zinc-700 border border-zinc-200 rounded-lg text-sm font-bold cursor-pointer hover:bg-zinc-50 :bg-zinc-800 transition-colors shadow-sm ${isReadOnly ? "opacity-50 pointer-events-none" : ""}`}
                                            >
                                                <FileImage size={16} />{" "}
                                                {data.proof_photo ||
                                                (currentPivot?.proof_photo &&
                                                    !data.remove_proof_photo)
                                                    ? "Change Photo"
                                                    : "Upload Proof Photo"}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isCoachOrAdmin &&
                                (currentPivot?.athlete_note ||
                                    currentPivot?.proof_photo) && (
                                    <div className="p-4 sm:p-6 bg-zinc-50 border-t border-zinc-200 flex flex-col gap-4">
                                        <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                                            <AlignLeft
                                                size={16}
                                                className="text-zinc-400"
                                            />{" "}
                                            Feedback Atlet
                                        </h4>
                                        {currentPivot?.athlete_note && (
                                            <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm">
                                                <p className="text-sm text-zinc-700 italic">
                                                    "{currentPivot.athlete_note}"
                                                </p>
                                            </div>
                                        )}
                                        {currentPivot?.proof_photo && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openModal(
                                                        "/storage/" +
                                                            currentPivot.proof_photo,
                                                        "image",
                                                    )
                                                }
                                                className="flex items-center justify-center gap-2 px-4 h-10 w-max bg-white text-zinc-700 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors text-xs font-bold shadow-sm"
                                            >
                                                <FileImage size={14} /> Lihat
                                                Foto Bukti
                                            </button>
                                        )}
                                        {errors.proof_photo && (
                                            <div className="text-red-500 text-sm mt-2">
                                                {errors.proof_photo}
                                            </div>
                                        )}
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
                                isMissingRequiredActuals={() =>
                                    getMissingRequiredActuals().length > 0
                                }
                                training={training}
                                isEditingActuals={isEditingActuals}
                                setIsEditingActuals={setIsEditingActuals}
                            />
                        </form>
                    </>
                )}

                <div className="text-center pt-8 pb-4">
                    <p className="text-[10px] font-bold text-zinc-400">
                        Power by: Olympus Training Surabaya X Unesa | All Rights
                        Reserved
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm transition-opacity">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <CheckCircle2
                                className="text-green-500"
                                size={24}
                            />
                            Konfirmasi Selesai Latihan
                        </h2>
                        
                        <div className="mb-5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <p className="text-sm text-slate-700">Menyelesaikan latihan untuk: <strong>{sortedMembers.find(m => m.id === selectedAthleteId)?.name}</strong></p>
                        </div>

                        <p className="text-slate-600 mb-6 text-xs leading-relaxed">
                            Apakah Anda yakin ingin menyelesaikan dan
                            menyerahkan program latihan untuk atlet ini? Setelah diserahkan,
                            data aktual sudah{" "}
                            <strong className="text-slate-800">tidak bisa diedit lagi</strong>.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmComplete(false)}
                                className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmAndComplete}
                                disabled={processing}
                                className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md shadow-orange-500/20"
                            >
                                <CheckCircle2 size={16} /> Ya, Selesai
                            </button>
                        </div>
                        {errors.error && (
                            <div className="text-red-500 text-sm font-bold text-right mt-3">
                                {errors.error}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
