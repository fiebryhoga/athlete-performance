import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ChevronLeft,
    Dumbbell,
    Activity,
    Type,
    X,
    UserPlus,
    Check,
    Users,
    Calendar,
    MapPin,
    Target,
    UserCheck,
    Sparkles,
    Search,
    ChevronDown,
    Save,
    SlidersHorizontal,
    Layers,
    Plus,
    Trash2,
    Copy,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import PhaseBlock from "../IndividualTrainings/Partials/PhaseBlock";
import TextBlock from "../IndividualTrainings/Partials/TextBlock";
import ExerciseQuickModal from "../IndividualTrainings/Partials/ExerciseQuickModal";
import WorkoutTemplateModal from "../IndividualTrainings/Partials/WorkoutTemplateModal";
import PageHeader from "@/Components/Common/PageHeader";

export default function CreateSession({
    auth,
    group,
    exercises = [],
    packages = [],
    coaches = [],
    date,
    nextSessionNumber,
    availableAthletes = [],
    workoutTemplates = [],
}) {
    const { data, setData, post, processing, errors, transform } = useForm({
        date: date || "",
        name: "",
        training_type: "",
        location: "",
        coach_ids: [],
        attendee_ids: group?.members?.map((m) => m.id) || [],
        programs: [{ name: "Program Utama", athlete_ids: null, blocks: [] }],
        is_extra: false,
    });

    const [isExModalOpen, setIsExModalOpen] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [isSimpleMode, setIsSimpleMode] = useState(true);
    const [activeProgramIndex, setActiveProgramIndex] = useState(0);
    const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
    const [guestSearchQuery, setGuestSearchQuery] = useState("");

    // Add a new Program tab
    const handleAddProgram = () => {
        let assignedSoFar = new Set();
        data.programs.forEach((p, idx) => {
            if (idx > 0 && Array.isArray(p.athlete_ids)) {
                p.athlete_ids.forEach((id) => assignedSoFar.add(id));
            }
        });

        const currentProgs = data.programs.map((p, idx) => {
            if (idx === 0 && !Array.isArray(p.athlete_ids)) {
                const p0Ids = data.attendee_ids.filter((id) => !assignedSoFar.has(id));
                return { ...p, athlete_ids: p0Ids };
            }
            return { ...p, athlete_ids: Array.isArray(p.athlete_ids) ? [...p.athlete_ids] : [] };
        });

        const newProgIndex = currentProgs.length;
        currentProgs.push({
            name: `Program ${newProgIndex + 1}`,
            athlete_ids: [],
            blocks: [],
        });
        setData("programs", currentProgs);
        setActiveProgramIndex(newProgIndex);
    };

    // Duplicate a Program into a new Program tab
    const handleDuplicateProgram = (sourceIndex = activeProgramIndex) => {
        let assignedSoFar = new Set();
        data.programs.forEach((p, idx) => {
            if (idx > 0 && Array.isArray(p.athlete_ids)) {
                p.athlete_ids.forEach((id) => assignedSoFar.add(id));
            }
        });

        const sourceProg = data.programs[sourceIndex];
        if (!sourceProg) return;

        const clonedBlocks = JSON.parse(JSON.stringify(sourceProg.blocks || [])).map((block) => {
            const { id, group_training_id, ...blockRest } = block;
            return {
                ...blockRest,
                items: (block.items || []).map((item) => {
                    const { id, training_block_id, ...itemRest } = item;
                    return itemRest;
                }),
            };
        });

        const currentProgs = data.programs.map((p, idx) => {
            if (idx === 0 && !Array.isArray(p.athlete_ids)) {
                const p0Ids = data.attendee_ids.filter((id) => !assignedSoFar.has(id));
                return { ...p, athlete_ids: p0Ids };
            }
            return { ...p, athlete_ids: Array.isArray(p.athlete_ids) ? [...p.athlete_ids] : [] };
        });

        const newProgIndex = currentProgs.length;
        currentProgs.push({
            name: `${sourceProg.name || `Program ${sourceIndex + 1}`} (Salinan)`,
            athlete_ids: [],
            blocks: clonedBlocks,
        });

        setData("programs", currentProgs);
        setActiveProgramIndex(newProgIndex);
    };

    // Copy blocks from another program into the current active program
    const handleCopyBlocksFrom = (sourceIndex) => {
        const sourceProg = data.programs[sourceIndex];
        if (!sourceProg || !sourceProg.blocks) return;

        const clonedBlocks = JSON.parse(JSON.stringify(sourceProg.blocks)).map((block) => {
            const { id, group_training_id, ...blockRest } = block;
            return {
                ...blockRest,
                items: (block.items || []).map((item) => {
                    const { id, training_block_id, ...itemRest } = item;
                    return itemRest;
                }),
            };
        });

        const newProgs = [...data.programs];
        newProgs[activeProgramIndex] = {
            ...newProgs[activeProgramIndex],
            blocks: clonedBlocks,
        };
        setData("programs", newProgs);
    };

    // Remove a Program tab
    const handleRemoveProgram = (indexToRemove) => {
        if (data.programs.length <= 1) return;
        const removedProg = data.programs[indexToRemove];
        const removedAthleteIds = removedProg?.athlete_ids || [];
        
        let newProgs = data.programs.filter((_, idx) => idx !== indexToRemove);
        
        if (newProgs.length === 1) {
            newProgs[0] = { ...newProgs[0], athlete_ids: null };
        } else {
            // Return unassigned athletes back to Program 0
            newProgs[0] = {
                ...newProgs[0],
                athlete_ids: [...(newProgs[0].athlete_ids || []), ...removedAthleteIds],
            };
        }
        
        setData("programs", newProgs);
        if (activeProgramIndex >= newProgs.length) {
            setActiveProgramIndex(Math.max(0, newProgs.length - 1));
        } else if (activeProgramIndex === indexToRemove) {
            setActiveProgramIndex(Math.max(0, indexToRemove - 1));
        }
    };

    // Rename active Program
    const handleRenameProgram = (newName) => {
        const newProgs = [...data.programs];
        newProgs[activeProgramIndex] = {
            ...newProgs[activeProgramIndex],
            name: newName,
        };
        setData("programs", newProgs);
    };

    // Toggle Athlete in the active Program (strictly 1 athlete = 1 program)
    const handleToggleAthleteForActiveProgram = (athleteId) => {
        const newProgs = data.programs.map((p, idx) => {
            const currentIds = Array.isArray(p.athlete_ids)
                ? [...p.athlete_ids]
                : (idx === 0 && data.programs.length === 1 ? [...data.attendee_ids] : []);

            if (idx === activeProgramIndex) {
                const exists = currentIds.includes(athleteId);
                return {
                    ...p,
                    athlete_ids: exists
                        ? currentIds.filter((id) => id !== athleteId)
                        : [...currentIds, athleteId],
                };
            } else {
                // Strictly remove from ALL other programs
                return {
                    ...p,
                    athlete_ids: currentIds.filter((id) => id !== athleteId),
                };
            }
        });
        setData("programs", newProgs);
    };

    // Assign all available/unassigned attendees to the active Program
    const handleAssignAllToActiveProgram = () => {
        const assignedOthers = new Set();
        data.programs.forEach((p, idx) => {
            if (idx !== activeProgramIndex && Array.isArray(p.athlete_ids)) {
                p.athlete_ids.forEach((id) => assignedOthers.add(id));
            }
        });
        const unassigned = data.attendee_ids.filter((id) => !assignedOthers.has(id));
        const newProgs = data.programs.map((p, idx) => {
            if (idx === activeProgramIndex) {
                return { ...p, athlete_ids: unassigned };
            }
            return p;
        });
        setData("programs", newProgs);
    };

    const handleApplyTemplate = (template) => {
        if (!template || !template.blocks) return;
        const newPrograms = [...data.programs];
        newPrograms[activeProgramIndex] = {
            ...newPrograms[activeProgramIndex],
            blocks: template.blocks,
        };
        setData((prev) => ({
            ...prev,
            name: prev.name || template.title,
            training_type: prev.training_type || "Strength",
            programs: newPrograms,
        }));
    };

    const generateDefaultPhases = () => {
        const defaultBlocks = [
            {
                name: "Pemanasan & Mobilitas (Warm Up)",
                category: "warm_up",
                target_filled_by: "coach",
                set_scheme: "straight_set",
                items: [
                    {
                        exercise_id: "",
                        exercise_name: "",
                        sets: 2,
                        reps: "10",
                        reps_array: ["10", "10"],
                        load_unit: "kg",
                        rest_per_set: "30s",
                        rest_per_set_array: ["30s", "30s"],
                    },
                    {
                        exercise_id: "",
                        exercise_name: "",
                        sets: 2,
                        reps: "10",
                        reps_array: ["10", "10"],
                        load_unit: "kg",
                        rest_per_set: "30s",
                        rest_per_set_array: ["30s", "30s"],
                    },
                ],
            },
            {
                name: "Latihan Kekuatan Inti (Main Strength)",
                category: "strength_training",
                target_filled_by: "coach",
                set_scheme: "straight_set",
                items: [
                    {
                        exercise_id: "",
                        exercise_name: "",
                        sets: 3,
                        reps: "8",
                        reps_array: ["8", "8", "8"],
                        load_unit: "kg",
                        rest_per_set: "60s",
                        rest_per_set_array: ["60s", "60s", "60s"],
                    },
                    {
                        exercise_id: "",
                        exercise_name: "",
                        sets: 3,
                        reps: "10",
                        reps_array: ["10", "10", "10"],
                        load_unit: "kg",
                        rest_per_set: "60s",
                        rest_per_set_array: ["60s", "60s", "60s"],
                    },
                ],
            },
            {
                name: "Pendinginan & Peregangan (Cool Down)",
                category: "cool_down",
                target_filled_by: "coach",
                set_scheme: "straight_set",
                items: [
                    {
                        exercise_id: "",
                        exercise_name: "",
                        sets: 1,
                        reps: "30s",
                        reps_array: ["30s"],
                        load_unit: "kg",
                        rest_per_set: "0s",
                        rest_per_set_array: ["0s"],
                    },
                ],
            },
        ];

        const newPrograms = [...data.programs];
        newPrograms[activeProgramIndex] = {
            ...newPrograms[activeProgramIndex],
            blocks: defaultBlocks,
        };
        setData("programs", newPrograms);
    };

    transform((data) => ({
        ...data,
        programs: data.programs.length === 1
            ? [{ ...data.programs[0], athlete_ids: null }]
            : data.programs.map((p) => ({
                ...p,
                athlete_ids: Array.isArray(p.athlete_ids) ? p.athlete_ids : [],
            })),
    }));

    const handleSelectAllAthletes = () => {
        const allMemberIds = group?.members?.map((m) => m.id) || [];
        const guestIds = data.attendee_ids.filter((id) => !allMemberIds.includes(id));
        const newIds = [...new Set([...allMemberIds, ...guestIds])];

        let newData = { ...data, attendee_ids: newIds };
        if (data.programs.length > 1) {
            const newProgs = data.programs.map((p) => {
                const validIds = (p.athlete_ids || []).filter(id => newIds.includes(id));
                return { ...p, athlete_ids: validIds };
            });
            newData.programs = newProgs;
        }
        setData(newData);
    };

    const handleDeselectAllAthletes = () => {
        let newData = { ...data, attendee_ids: [] };
        if (data.programs.length > 1) {
            const newProgs = data.programs.map((p) => ({ ...p, athlete_ids: [] }));
            newData.programs = newProgs;
        }
        setData(newData);
    };

    const submitSession = (e) => {
        e.preventDefault();
        post(route("admin.group-trainings.session.store", group.id));
    };

    const onDragEnd = (result) => {
        const { source, destination, type } = result;
        if (!destination) return;

        const newPrograms = [...data.programs];
        const activeBlocks = newPrograms[activeProgramIndex].blocks;

        if (type === "block") {
            const [reorderedBlock] = activeBlocks.splice(source.index, 1);
            activeBlocks.splice(destination.index, 0, reorderedBlock);
        } else if (type === "exercise") {
            const sourceBlockIndex = parseInt(source.droppableId.split("-")[2]);
            const destBlockIndex = parseInt(destination.droppableId.split("-")[2]);

            const sourceItems = Array.from(activeBlocks[sourceBlockIndex].items);
            const [reorderedItem] = sourceItems.splice(source.index, 1);

            if (sourceBlockIndex === destBlockIndex) {
                sourceItems.splice(destination.index, 0, reorderedItem);
                activeBlocks[sourceBlockIndex].items = sourceItems;
            } else {
                const destItems = Array.from(activeBlocks[destBlockIndex].items);
                destItems.splice(destination.index, 0, reorderedItem);
                activeBlocks[sourceBlockIndex].items = sourceItems;
                activeBlocks[destBlockIndex].items = destItems;
            }
        }
        setData("programs", newPrograms);
    };

    const addTextBlock = () => {
        const newPrograms = [...data.programs];
        newPrograms[activeProgramIndex].blocks.push({
            step: 1,
            category: "instruction",
            title: "",
            items: [{ note: "" }],
        });
        setData("programs", newPrograms);
    };

    const addPhaseBlock = () => {
        const newPrograms = [...data.programs];
        newPrograms[activeProgramIndex].blocks.push({
            step: 2,
            category: "warm_up",
            title: "",
            description: "",
            items: [
                {
                    exercise_id: "",
                    note: "",
                    load: "",
                    load_unit: "kg",
                    sets: "",
                    reps: "",
                    reps_unit: "reps",
                    duration: "",
                    tempo: "",
                    rir: "",
                    rest_per_set: "",
                    intensity: "",
                },
            ],
        });
        setData("programs", newPrograms);
    };

    const updateBlock = (index, field, value) => {
        const newPrograms = [...data.programs];
        newPrograms[activeProgramIndex].blocks[index][field] = value;
        setData("programs", newPrograms);
    };

    const removeBlock = (index) => {
        if (confirm("Yakin ingin menghapus blok ini?")) {
            const newPrograms = [...data.programs];
            newPrograms[activeProgramIndex].blocks.splice(index, 1);
            setData("programs", newPrograms);
        }
    };

    const duplicateBlock = (index) => {
        const newPrograms = [...data.programs];
        const blockToCopy = JSON.parse(
            JSON.stringify(newPrograms[activeProgramIndex].blocks[index])
        );
        newPrograms[activeProgramIndex].blocks.splice(index + 1, 0, blockToCopy);
        setData("programs", newPrograms);
    };

    const formattedDateStr = data.date
        ? new Date(data.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : "tanggal yang ditentukan";

    return (
        <AppLayout
            title={`Tambah Sesi - ${group.name}`}
            description="Perancang program latihan grup."
        >
            <Head title={`Tambah Sesi - ${group.name}`} />

            <div className="space-y-4 pb-12">
                {/* ─── BREADCRUMB & HEADER ─── */}
                <div className="space-y-1">
                    <Link
                        href={route("admin.group-trainings.show", group.id)}
                        className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors gap-1.5"
                    >
                        <ChevronLeft size={13} /> Kembali ke Kalender Latihan Grup
                    </Link>

                    <PageHeader
                        title="Perancang Sesi Latihan"
                        description={`Rancang program latihan untuk ${group.name} pada ${formattedDateStr}.`}
                        actions={
                            <button
                                type="button"
                                onClick={submitSession}
                                disabled={processing}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold shadow-2xs hover:shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                            >
                                <Save size={13} />
                                <span>{processing ? "Menyimpan..." : "Simpan Program"}</span>
                            </button>
                        }
                    />
                </div>

                <form onSubmit={submitSession}>
                    {/* ─── 2-COLUMN LAYOUT ─── */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                        {/* ═══════════════════════════════════════════════════════
                            KOLOM KIRI (4 Kolom di LG) — Informasi Sesi, Coach & Hadir
                           ═══════════════════════════════════════════════════════ */}
                        <div className="lg:col-span-4 space-y-4">
                            {/* Card 1: Informasi Dasar Sesi */}
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                        <Activity size={13} className="text-orange-500" />
                                        <span>Informasi Dasar Sesi</span>
                                    </h3>
                                    {group.package && (
                                        <span className="text-[10px] font-semibold text-slate-500">
                                            {group.package.name}
                                        </span>
                                    )}
                                </div>

                                <div className="p-3.5 space-y-3">
                                    {/* Tanggal Sesi */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                            Tanggal Sesi
                                        </label>
                                        <input
                                            type="date"
                                            value={data.date}
                                            onChange={(e) => setData("date", e.target.value)}
                                            className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-orange-400 focus:border-orange-400 shadow-2xs"
                                        />
                                        {errors.date && (
                                            <div className="text-red-500 text-[10px] mt-1 font-semibold">
                                                {errors.date}
                                            </div>
                                        )}
                                    </div>

                                    {/* Judul Sesi */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                            Judul Sesi Latihan <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            placeholder="Contoh: Recovery Training"
                                            className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-orange-400 focus:border-orange-400 shadow-2xs placeholder:text-slate-400"
                                            required
                                        />
                                        {errors.name && (
                                            <div className="text-red-500 text-[10px] mt-1 font-semibold">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>

                                    {/* Fokus Latihan */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                            Fokus Latihan
                                        </label>
                                        <input
                                            type="text"
                                            value={data.training_type}
                                            onChange={(e) => setData("training_type", e.target.value)}
                                            placeholder="Contoh: Strength, Endurance..."
                                            className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-orange-400 focus:border-orange-400 shadow-2xs placeholder:text-slate-400"
                                        />
                                    </div>

                                    {/* Lokasi */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                            Lokasi <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.location}
                                            onChange={(e) => setData("location", e.target.value)}
                                            placeholder="Contoh: Gym A / Lapangan"
                                            className={`w-full text-xs font-medium text-slate-800 bg-white border rounded-md px-3 py-2 focus:ring-1 focus:ring-orange-400 focus:border-orange-400 shadow-2xs placeholder:text-slate-400 ${
                                                errors.location ? "border-red-300" : "border-slate-200"
                                            }`}
                                            required
                                        />
                                        {errors.location && (
                                            <div className="text-red-500 text-[10px] mt-1 font-semibold">
                                                {errors.location}
                                            </div>
                                        )}
                                    </div>

                                    {/* Sesi Tambahan Card */}
                                    <div
                                        onClick={() => setData("is_extra", !data.is_extra)}
                                        className={`p-2.5 rounded-md border cursor-pointer transition-all flex items-center justify-between gap-2.5 ${
                                            data.is_extra
                                                ? "bg-orange-50 border-orange-300 text-orange-950"
                                                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/70"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Sparkles
                                                size={14}
                                                className={data.is_extra ? "text-orange-500" : "text-slate-400"}
                                            />
                                            <div>
                                                <span className="text-xs font-bold block leading-tight">
                                                    Sesi Tambahan
                                                </span>
                                                <span className="text-[10px] text-slate-500 block leading-tight">
                                                    Tidak memotong kuota paket latihan
                                                </span>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={data.is_extra}
                                            onChange={(e) => setData("is_extra", e.target.checked)}
                                            className="w-3.5 h-3.5 rounded border-slate-300 text-orange-500 focus:ring-orange-400 pointer-events-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Coach Pendamping */}
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                        <UserCheck size={13} className="text-orange-500" />
                                        <span>Coach Pendamping</span>
                                    </h3>
                                    <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60">
                                        Terpilih: {data.coach_ids.length} / 2
                                    </span>
                                </div>

                                <div className="p-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5">
                                        {coaches && coaches.length > 0 ? (
                                            coaches.map((coach) => {
                                                const isSelected = data.coach_ids.includes(coach.id);
                                                return (
                                                    <div
                                                        key={coach.id}
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                setData(
                                                                    "coach_ids",
                                                                    data.coach_ids.filter((id) => id !== coach.id)
                                                                );
                                                            } else {
                                                                if (data.coach_ids.length >= 2) {
                                                                    alert("Maksimal memilih 2 pelatih");
                                                                    return;
                                                                }
                                                                setData("coach_ids", [...data.coach_ids, coach.id]);
                                                            }
                                                        }}
                                                        className={`flex items-center justify-between p-2 rounded-md border cursor-pointer transition-all ${
                                                            isSelected
                                                                ? "bg-orange-50 border-orange-300 text-orange-950 shadow-2xs"
                                                                : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700"
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <div
                                                                className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                                                                    isSelected
                                                                        ? "bg-orange-500 text-white"
                                                                        : "bg-slate-200 text-slate-700"
                                                                }`}
                                                            >
                                                                {coach.name ? coach.name.substring(0, 2).toUpperCase() : "CO"}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <span className="block text-xs font-bold truncate">
                                                                    {coach.name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                                                                isSelected
                                                                    ? "bg-orange-500 text-white border-orange-500"
                                                                    : "border-slate-300 bg-white text-transparent"
                                                            }`}
                                                        >
                                                            <Check size={10} strokeWidth={3} />
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-xs text-slate-400 italic py-2 text-center">
                                                Belum ada coach tersedia.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Daftar Hadir Atlet */}
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                        <Users size={13} className="text-orange-500" />
                                        <span>Daftar Hadir Atlet</span>
                                    </h3>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={handleSelectAllAthletes}
                                            className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 transition-colors"
                                        >
                                            Pilih Semua
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleDeselectAllAthletes}
                                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 transition-colors"
                                        >
                                            Kosongkan
                                        </button>
                                    </div>
                                </div>

                                <div className="p-3 space-y-2.5">
                                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                                        {group?.members && group.members.length > 0 ? (
                                            group.members.map((member) => {
                                                const isPresent = data.attendee_ids.includes(member.id);
                                                return (
                                                    <div
                                                        key={member.id}
                                                        onClick={() => {
                                                            let newIds = [...data.attendee_ids];
                                                            if (!isPresent) {
                                                                newIds.push(member.id);
                                                            } else {
                                                                newIds = newIds.filter((id) => id !== member.id);
                                                            }

                                                            let newData = { ...data, attendee_ids: newIds };
                                                            if (data.programs.length > 1) {
                                                                const newProgs = data.programs.map((p) => ({
                                                                    ...p,
                                                                    athlete_ids: (p.athlete_ids || []).filter((id) => newIds.includes(id)),
                                                                }));
                                                                newData.programs = newProgs;
                                                            }
                                                            setData(newData);
                                                        }}
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all select-none ${
                                                            isPresent
                                                                ? "bg-orange-500 text-white shadow-2xs font-bold"
                                                                : "bg-slate-50 text-slate-400 border border-dashed border-slate-200 hover:text-slate-700 line-through"
                                                        }`}
                                                    >
                                                        <span>{member.name}</span>
                                                        {isPresent && <Check size={11} strokeWidth={3} />}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-xs text-slate-400 italic py-2">
                                                Belum ada anggota di grup ini.
                                            </div>
                                        )}

                                        {/* Guest athletes pills */}
                                        {data.attendee_ids
                                            .filter((id) => !group?.members?.some((m) => m.id === id))
                                            .map((guestId) => {
                                                const guest = availableAthletes?.find((a) => a.id === guestId);
                                                if (!guest) return null;
                                                return (
                                                    <div
                                                        key={`guest-${guest.id}`}
                                                        onClick={() => {
                                                            const newIds = data.attendee_ids.filter((id) => id !== guest.id);
                                                            let newData = { ...data, attendee_ids: newIds };
                                                            if (data.programs.length > 1) {
                                                                const newProgs = data.programs.map((p) => ({
                                                                    ...p,
                                                                    athlete_ids: (p.athlete_ids || []).filter((id) => newIds.includes(id)),
                                                                }));
                                                                newData.programs = newProgs;
                                                            }
                                                            setData(newData);
                                                        }}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-600 text-white cursor-pointer shadow-2xs"
                                                    >
                                                        <span>{guest.name} (Tamu)</span>
                                                        <X size={11} />
                                                    </div>
                                                );
                                            })}
                                    </div>

                                    {/* Add Guest Dropdown */}
                                    {availableAthletes.filter((a) => !group?.members?.some((m) => m.id === a.id)).length > 0 && (
                                        <div className="pt-2 border-t border-slate-100">
                                            <button
                                                type="button"
                                                onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                                                className={`w-full text-xs font-semibold border rounded-md px-2.5 py-1.5 flex items-center justify-between gap-1 shadow-2xs transition-all cursor-pointer ${
                                                    isGuestDropdownOpen
                                                        ? "bg-gradient-to-r from-orange-50/70 via-orange-50/30 to-white border-orange-300 text-orange-900"
                                                        : "bg-gradient-to-r from-orange-50/40 via-white to-white hover:from-orange-50/70 border-slate-200 hover:border-orange-200 text-slate-700 hover:text-orange-900"
                                                }`}
                                            >
                                                <span className="inline-flex items-center gap-1.5 text-[11px]">
                                                    <UserPlus size={12} className="text-orange-500" />
                                                    <span>+ Tambah Atlet Tamu (Guest)</span>
                                                </span>
                                                <ChevronDown size={12} className={`text-slate-400 transition-transform duration-200 ${isGuestDropdownOpen ? "rotate-180 text-orange-500" : ""}`} />
                                            </button>

                                            {isGuestDropdownOpen && (
                                                <div className="mt-2 bg-white border border-slate-200 rounded-md p-2 space-y-2 shadow-2xs">
                                                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                                                        <Search size={12} className="text-slate-400 shrink-0" />
                                                        <input
                                                            type="text"
                                                            placeholder="Cari atlet tamu..."
                                                            value={guestSearchQuery}
                                                            onChange={(e) => setGuestSearchQuery(e.target.value)}
                                                            className="w-full text-xs bg-transparent border-0 p-0 focus:ring-0 text-slate-800 placeholder:text-slate-400"
                                                        />
                                                        {guestSearchQuery && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setGuestSearchQuery("")}
                                                                className="text-slate-400 hover:text-slate-600"
                                                            >
                                                                <X size={11} />
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar pr-0.5">
                                                        {(() => {
                                                            const externalAthletes = availableAthletes.filter(
                                                                (a) => !group?.members?.some((m) => m.id === a.id)
                                                            );
                                                            const filteredGuests = externalAthletes.filter((a) => {
                                                                if (!guestSearchQuery) return true;
                                                                const q = guestSearchQuery.toLowerCase();
                                                                return a.name && a.name.toLowerCase().includes(q);
                                                            });

                                                            if (filteredGuests.length === 0) {
                                                                return (
                                                                    <div className="py-2.5 text-center text-[11px] text-slate-400 italic">
                                                                        Tidak ditemukan.
                                                                    </div>
                                                                );
                                                            }

                                                            return filteredGuests.map((guest) => {
                                                                const isSelected = data.attendee_ids.includes(guest.id);
                                                                return (
                                                                    <div
                                                                        key={`custom-guest-${guest.id}`}
                                                                        onClick={() => {
                                                                            let newIds = isSelected
                                                                                ? data.attendee_ids.filter((id) => id !== guest.id)
                                                                                : [...data.attendee_ids, guest.id];
                                                                            setData("attendee_ids", newIds);
                                                                        }}
                                                                        className={`flex items-center justify-between px-2 py-1.5 rounded border text-xs cursor-pointer transition-all ${
                                                                            isSelected
                                                                                ? "bg-orange-500 text-white font-bold border-orange-500 shadow-2xs"
                                                                                : "bg-white hover:bg-slate-100/80 text-slate-700 border-slate-200"
                                                                        }`}
                                                                    >
                                                                        <span className="truncate">{guest.name}</span>
                                                                        {isSelected && <Check size={11} strokeWidth={3} />}
                                                                    </div>
                                                                );
                                                            });
                                                        })()}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ═══════════════════════════════════════════════════════
                            KOLOM KANAN (8 Kolom di LG) — Program & Fase Latihan
                           ═══════════════════════════════════════════════════════ */}
                        <div className="lg:col-span-8 space-y-4">
                            {/* Program Header Toolbar */}
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs p-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
                                <div className="shrink-0">
                                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                        <Dumbbell size={14} className="text-orange-500" />
                                        <span>Program Latihan</span>
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-medium">
                                        {data.programs[activeProgramIndex]?.blocks?.length || 0} blok tersusun
                                    </p>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                                    {/* Mode Simpel / Pro Toggle */}
                                    <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200/80 text-xs">
                                        <button
                                            type="button"
                                            onClick={() => setIsSimpleMode(true)}
                                            className={`flex items-center px-2 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                                                isSimpleMode
                                                    ? 'bg-white text-orange-600 shadow-2xs'
                                                    : 'text-slate-500 hover:text-slate-800'
                                            }`}
                                            title="Mode Simpel: Sembunyikan kolom Tempo & Istirahat tambahan"
                                        >
                                            <span>Simpel</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsSimpleMode(false)}
                                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                                                !isSimpleMode
                                                    ? 'bg-white text-orange-600 shadow-2xs'
                                                    : 'text-slate-500 hover:text-slate-800'
                                            }`}
                                            title="Mode Pro: Membuka kolom Tempo, Waktu Istirahat, dan Target RPE"
                                        >
                                            <SlidersHorizontal size={11} className={!isSimpleMode ? "text-orange-500" : "text-slate-400"} />
                                            <span>Pro</span>
                                        </button>
                                    </div>

                                    {/* Template Button */}
                                    <button
                                        type="button"
                                        onClick={() => setIsTemplateModalOpen(true)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-b from-orange-50 to-orange-100/60 border border-orange-200/90 text-orange-700 hover:bg-orange-100 rounded-md text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                                        title="Gunakan Template Sesi Siap Pakai"
                                    >
                                        <Sparkles size={12} className="text-orange-500" />
                                        <span>Template</span>
                                    </button>

                                    {/* Duplikat Program Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleDuplicateProgram(activeProgramIndex)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-all cursor-pointer"
                                        title="Duplikat program yang sedang aktif"
                                    >
                                        <Copy size={11} className="text-orange-500" />
                                        <span>Duplikat</span>
                                    </button>

                                    {/* Tambah Program Button */}
                                    <button
                                        type="button"
                                        onClick={handleAddProgram}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 shadow-2xs transition-all cursor-pointer"
                                        title="Tambah program latihan baru"
                                    >
                                        <Plus size={12} strokeWidth={2.5} />
                                        <span>Tambah</span>
                                    </button>
                                </div>
                            </div>

                            {/* Program Tabs Bar (when multiple programs or single) */}
                            {data.programs.length > 1 && (
                                <div className="flex flex-wrap items-center gap-2 bg-slate-50/70 p-2 rounded-lg border border-slate-200/80">
                                    <div className="flex flex-wrap items-center gap-1.5 flex-1">
                                        {data.programs.map((prog, pIdx) => {
                                            const isActive = activeProgramIndex === pIdx;
                                            const athleteCount = prog.athlete_ids?.length || 0;

                                            return (
                                                <button
                                                    key={pIdx}
                                                    type="button"
                                                    onClick={() => setActiveProgramIndex(pIdx)}
                                                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                                                        isActive
                                                            ? "bg-orange-500 text-white font-bold shadow-2xs"
                                                            : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
                                                    }`}
                                                >
                                                    <span>{prog.name || `Program ${pIdx + 1}`}</span>
                                                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                                        isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                                                    }`}>
                                                        {athleteCount} atlet
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddProgram}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold border border-dashed border-orange-300 text-orange-600 bg-white hover:bg-orange-50 transition-all cursor-pointer shadow-2xs"
                                    >
                                        <Plus size={12} strokeWidth={2.5} />
                                        <span>Program Baru</span>
                                    </button>
                                </div>
                            )}

                            {/* Program Audience & Rename Card (when multiple programs exist) */}
                            {data.programs.length > 1 && (
                                <div className="bg-white p-3.5 rounded-md border border-slate-200/80 shadow-2xs space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                Nama Program:
                                            </span>
                                            <input
                                                type="text"
                                                value={data.programs[activeProgramIndex]?.name || ""}
                                                onChange={(e) => handleRenameProgram(e.target.value)}
                                                className="text-xs font-bold text-slate-800 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded px-2.5 py-1 w-52 sm:w-64 transition-all focus:ring-1 focus:ring-orange-400"
                                                placeholder={`Program ${activeProgramIndex + 1}`}
                                            />
                                        </div>

                                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                                            <button
                                                type="button"
                                                onClick={() => handleDuplicateProgram(activeProgramIndex)}
                                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-orange-600 hover:bg-orange-50 bg-white border border-slate-200 px-2 py-1 rounded transition-colors cursor-pointer shadow-2xs"
                                                title="Duplikat program ini ke tab baru"
                                            >
                                                <Copy size={11} className="text-orange-500" />
                                                <span>Duplikat</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleRemoveProgram(activeProgramIndex)}
                                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded transition-colors cursor-pointer"
                                            >
                                                <Trash2 size={12} />
                                                <span>Hapus Program</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Athlete Chips Assignment */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                                <Users size={13} className="text-orange-500" />
                                                <span>Pilih Atlet untuk {data.programs[activeProgramIndex]?.name || `Program ${activeProgramIndex + 1}`}</span>
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={handleAssignAllToActiveProgram}
                                                    className="text-[10.5px] font-semibold text-orange-600 hover:underline cursor-pointer"
                                                >
                                                    Pilih Sisa Atlet
                                                </button>
                                                <span className="text-slate-300">|</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newProgs = [...data.programs];
                                                        newProgs[activeProgramIndex].athlete_ids = [];
                                                        setData("programs", newProgs);
                                                    }}
                                                    className="text-[10.5px] font-semibold text-slate-500 hover:underline cursor-pointer"
                                                >
                                                    Kosongkan
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-slate-500">
                                            Klik nama atlet untuk memasukkannya ke program ini (atlet otomatis dipindahkan dari program lain).
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {data.attendee_ids.map((attId) => {
                                                const athlete =
                                                    availableAthletes?.find((a) => a.id === attId) ||
                                                    group?.members?.find((m) => m.id === attId);
                                                if (!athlete) return null;
                                                const isSelected = data.programs[activeProgramIndex]?.athlete_ids?.includes(attId);
                                                
                                                // Find which other program they might belong to
                                                const otherProg = !isSelected ? data.programs.find((p, idx) => idx !== activeProgramIndex && p.athlete_ids?.includes(attId)) : null;

                                                return (
                                                    <button
                                                        key={attId}
                                                        type="button"
                                                        onClick={() => handleToggleAthleteForActiveProgram(attId)}
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all select-none ${
                                                            isSelected
                                                                ? "bg-orange-500 text-white font-bold shadow-2xs"
                                                                : otherProg
                                                                ? "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
                                                                : "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-medium"
                                                        }`}
                                                    >
                                                        <span>{athlete.name}</span>
                                                        {isSelected && <Check size={11} strokeWidth={3} />}
                                                        {!isSelected && otherProg && (
                                                            <span className="text-[9.5px] text-slate-400 font-normal">
                                                                ({otherProg.name})
                                                            </span>
                                                        )}
                                                        {!isSelected && !otherProg && (
                                                            <span className="text-[9.5px] text-amber-600 font-normal">
                                                                (Belum dipilih)
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Drag and Drop Blocks List */}
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="blocks" type="block">
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="space-y-4"
                                        >
                                            {data.programs[activeProgramIndex].blocks.map((block, index) => (
                                                <Draggable
                                                    key={`block-${index}`}
                                                    draggableId={`block-${index}`}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                        >
                                                            {block.step === 1 ? (
                                                                <TextBlock
                                                                    block={block}
                                                                    dragHandleProps={provided.dragHandleProps}
                                                                    onChange={(field, val) =>
                                                                        updateBlock(index, field, val)
                                                                    }
                                                                    onRemove={() => removeBlock(index)}
                                                                    onDuplicate={() => duplicateBlock(index)}
                                                                />
                                                            ) : (
                                                                <PhaseBlock
                                                                    blockIndex={index}
                                                                    dragHandleProps={provided.dragHandleProps}
                                                                    block={block}
                                                                    exercises={exercises}
                                                                    exercisePackages={packages}
                                                                    onChange={(field, val) =>
                                                                        updateBlock(index, field, val)
                                                                    }
                                                                    onRemove={() => removeBlock(index)}
                                                                    onDuplicate={() => duplicateBlock(index)}
                                                                    onOpenExerciseModal={() =>
                                                                        setIsExModalOpen(true)
                                                                    }
                                                                    isGlobalSimpleMode={isSimpleMode}
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>

                            {data.programs[activeProgramIndex].blocks.length === 0 && (
                                <div className="text-center py-10 px-4 bg-white border border-dashed border-slate-200 rounded-lg shadow-2xs space-y-4">
                                    <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto border border-orange-100">
                                        <Dumbbell size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-800">
                                            Belum Ada Program Latihan yang Disusun
                                        </h4>
                                        <p className="text-[11px] text-slate-400 mt-0.5 max-w-md mx-auto">
                                            Pilih salah satu cara tercepat di bawah ini untuk mulai mengisi latihan {data.programs.length > 1 ? `(${data.programs[activeProgramIndex]?.name || `Program ${activeProgramIndex + 1}`})` : ''}:
                                        </p>
                                    </div>

                                    {/* QUICK ACTION BUTTONS */}
                                    <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setIsTemplateModalOpen(true)}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-md text-xs font-bold shadow-2xs transition-all cursor-pointer"
                                        >
                                            <Sparkles size={14} />
                                            <span>Gunakan Template Siap Pakai (1-Klik)</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={generateDefaultPhases}
                                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                                        >
                                            <Layers size={14} className="text-orange-500" />
                                            <span>Buat 3 Fase Standar (Pemanasan, Inti, Pendinginan)</span>
                                        </button>
                                    </div>

                                    {/* Opsi Salin dari Program Lain jika ada program lain yang sudah berisi blok */}
                                    {data.programs.length > 1 && data.programs.some((p, idx) => idx !== activeProgramIndex && (p.blocks?.length || 0) > 0) && (
                                        <div className="pt-3 border-t border-slate-100 max-w-lg mx-auto">
                                            <div className="text-[11px] font-bold text-slate-500 mb-2 flex items-center justify-center gap-1.5">
                                                <Copy size={12} className="text-orange-500" />
                                                <span>Atau Salin Seluruh Isi dari Program Lain:</span>
                                            </div>
                                            <div className="flex flex-wrap items-center justify-center gap-1.5">
                                                {data.programs.map((otherProg, oIdx) => {
                                                    if (oIdx === activeProgramIndex || (otherProg.blocks?.length || 0) === 0) return null;
                                                    return (
                                                        <button
                                                            key={oIdx}
                                                            type="button"
                                                            onClick={() => handleCopyBlocksFrom(oIdx)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-orange-50 hover:border-orange-300 border border-slate-200 text-slate-700 hover:text-orange-700 rounded-md text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                                                        >
                                                            <Copy size={11} className="text-slate-400 group-hover:text-orange-500" />
                                                            <span>Salin dari {otherProg.name || `Program ${oIdx + 1}`} ({otherProg.blocks.length} blok)</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Add Block Buttons */}
                            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsTemplateModalOpen(true)}
                                    className="text-xs font-semibold bg-gradient-to-b from-orange-50 to-orange-100/60 border border-orange-200/90 text-orange-700 hover:bg-orange-100 px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                                >
                                    <Sparkles size={13} className="text-orange-500" />
                                    <span>Gunakan Template</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={addTextBlock}
                                    className="text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3.5 py-1.5 rounded-md flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                                >
                                    <Type size={13} className="text-slate-500" />
                                    <span>Catatan / Instruksi</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={addPhaseBlock}
                                    className="text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white px-3.5 py-1.5 rounded-md flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                                >
                                    <Activity size={13} />
                                    <span>Fase Latihan</span>
                                </button>
                            </div>

                            {/* Bottom Action Footer */}
                            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200/80">
                                <button
                                    type="button"
                                    onClick={submitSession}
                                    disabled={processing}
                                    className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold shadow-2xs transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Save size={13} />
                                    <span>{processing ? "Menyimpan..." : "Simpan Program Latihan"}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <ExerciseQuickModal
                isOpen={isExModalOpen}
                onClose={() => setIsExModalOpen(false)}
            />

            <WorkoutTemplateModal
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                onSelectTemplate={handleApplyTemplate}
                templates={workoutTemplates}
            />
        </AppLayout>
    );
}
