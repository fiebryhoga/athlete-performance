import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ChevronLeft,
    Dumbbell,
    Activity,
    Type,
    Save,
    Calendar,
    MapPin,
    Target,
    User,
    UsersRound,
    Package,
    ShieldCheck,
    Sparkles,
    Zap,
    SlidersHorizontal,
    PlusCircle,
    Layers
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import PhaseBlock from "./Partials/PhaseBlock";
import TextBlock from "./Partials/TextBlock";
import ExerciseQuickModal from "./Partials/ExerciseQuickModal";
import WorkoutTemplateModal from "./Partials/WorkoutTemplateModal";
import PageHeader from "@/Components/Common/PageHeader";

export default function CreateSession({
    auth,
    athlete,
    exercises = [],
    packages = [],
    coaches = [],
    date,
    nextSessionNumber,
    sharedPackages = [],
    workoutTemplates = [],
}) {
    // Back URL & from param logic
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const fromParam = urlParams.get('from');
    const packageIdParam = urlParams.get('package_id');
    const defaultSharedPackage = packageIdParam || (sharedPackages && sharedPackages.length > 0 ? sharedPackages[0].id : '');

    let backUrl = route("admin.individual-trainings.show", athlete.id);
    let backLabel = "Kembali ke Kalender Latihan";

    if (fromParam === 'shared-package' && (packageIdParam || defaultSharedPackage)) {
        backUrl = route("admin.shared-packages.show", packageIdParam || defaultSharedPackage);
        backLabel = "Kembali ke Paket Bersama";
    }

    const { data, setData, post, processing, errors } = useForm({
        date: date || "",
        name: "",
        training_type: "",
        location: "",
        coach_ids: [],
        blocks: [],
        is_extra: false,
        shared_package_id: defaultSharedPackage || "",
    });

    const [isExModalOpen, setIsExModalOpen] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [isSimpleMode, setIsSimpleMode] = useState(true);

    const submitSession = (e) => {
        e.preventDefault();
        const query = fromParam ? `?from=${fromParam}&package_id=${packageIdParam || data.shared_package_id || ''}` : '';
        post(route("admin.individual-trainings.session.store", athlete.id) + query);
    };

    const handleApplyTemplate = (template) => {
        if (!template || !template.blocks) return;
        setData((prev) => ({
            ...prev,
            name: prev.name || template.title,
            training_type: prev.training_type || "Strength",
            blocks: template.blocks,
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
                    }
                ]
            },
            {
                name: "Latihan Inti (Strength Training)",
                category: "strength_training",
                target_filled_by: "coach",
                set_scheme: "straight_set",
                items: [
                    {
                        exercise_id: "",
                        exercise_name: "",
                        sets: 3,
                        reps: "10",
                        reps_array: ["10", "10", "10"],
                        load: "",
                        load_array: ["", "", ""],
                        load_unit: "kg",
                    }
                ]
            },
            {
                name: "Pendinginan & Peregangan (Cool Down)",
                category: "stretching",
                target_filled_by: "coach",
                set_scheme: "straight_set",
                items: [
                    {
                        exercise_id: "",
                        exercise_name: "",
                        sets: 1,
                        reps: "30s",
                        reps_array: ["30s"],
                        note: "Peregangan otot seluruh tubuh secara perlahan.",
                    }
                ]
            }
        ];
        setData("blocks", defaultBlocks);
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination, type } = result;

        if (type === "block") {
            const items = Array.from(data.blocks);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);
            setData("blocks", items);
        } else if (type === "exercise") {
            const sourceBlockIndex = parseInt(source.droppableId.split("-")[2]);
            const destBlockIndex = parseInt(
                destination.droppableId.split("-")[2],
            );

            const newBlocks = [...data.blocks];
            const sourceItems = Array.from(newBlocks[sourceBlockIndex].items);
            const [reorderedItem] = sourceItems.splice(source.index, 1);

            if (sourceBlockIndex === destBlockIndex) {
                sourceItems.splice(destination.index, 0, reorderedItem);
                newBlocks[sourceBlockIndex].items = sourceItems;
            } else {
                const destItems = Array.from(newBlocks[destBlockIndex].items);
                destItems.splice(destination.index, 0, reorderedItem);
                newBlocks[sourceBlockIndex].items = sourceItems;
                newBlocks[destBlockIndex].items = destItems;
            }
            setData("blocks", newBlocks);
        }
    };

    const addTextBlock = () => {
        setData("blocks", [
            ...data.blocks,
            {
                step: 1,
                category: "instruction",
                title: "",
                items: [{ note: "" }],
            },
        ]);
    };

    const addPhaseBlock = () => {
        setData("blocks", [
            ...data.blocks,
            {
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
            },
        ]);
    };

    const updateBlock = (index, field, value) => {
        const newBlocks = [...data.blocks];
        newBlocks[index][field] = value;
        setData("blocks", newBlocks);
    };

    const removeBlock = (index) => {
        if (confirm("Yakin ingin menghapus blok ini?")) {
            const newBlocks = [...data.blocks];
            newBlocks.splice(index, 1);
            setData("blocks", newBlocks);
        }
    };

    const duplicateBlock = (index) => {
        const newBlocks = [...data.blocks];
        const blockToCopy = JSON.parse(JSON.stringify(newBlocks[index]));
        newBlocks.splice(index + 1, 0, blockToCopy);
        setData("blocks", newBlocks);
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
            title={`Tambah Sesi - ${athlete.name}`}
            description="Perancang program latihan atlet."
        >
            <Head title={`Tambah Sesi - ${athlete.name}`} />

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
                        title="Perancang Sesi Latihan"
                        description={`Rancang program latihan untuk ${athlete.name} pada ${formattedDateStr}.`}
                        actions={
                            <div className="flex items-center gap-2">
                                <Link
                                    href={backUrl}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-semibold shadow-2xs transition-colors"
                                >
                                    <ChevronLeft size={13} />
                                    <span>Batal</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={submitSession}
                                    disabled={processing}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold shadow-2xs hover:shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    <Save size={13} />
                                    <span>{processing ? "Menyimpan..." : "Simpan Program"}</span>
                                </button>
                            </div>
                        }
                    />
                </div>

                <form onSubmit={submitSession}>
                    {/* ─── 2-COLUMN DASHBOARD LAYOUT (KIRI & KANAN) ─── */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                        {/* ═══════════════════════════════════════════════════════
                            KOLOM KIRI (4 Kolom di LG) — Informasi Dasar Sesi
                           ═══════════════════════════════════════════════════════ */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-slate-900">
                                        Informasi Dasar Sesi
                                    </h3>
                                    {athlete.package && (
                                        <span className="text-[10px] font-semibold text-slate-500">
                                            {athlete.package.name}
                                        </span>
                                    )}
                                </div>

                                <div className="p-4 space-y-3.5">
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
                                            placeholder="Contoh: Strength, Hypertrophy..."
                                            className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-orange-400 focus:border-orange-400 shadow-2xs placeholder:text-slate-400"
                                        />
                                    </div>

                                    {/* Paket Bersama (Jika ada) */}
                                    {sharedPackages && sharedPackages.length > 0 && (
                                        <div className="p-3 bg-orange-50/80 border border-orange-200/80 rounded-md space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900">
                                                    <UsersRound className="w-3.5 h-3.5 text-orange-600" />
                                                    <span>Paket Bersama: {sharedPackages[0].name}</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded">
                                                    {sharedPackages[0].used_sessions || 0}/{sharedPackages[0].total_sessions || '∞'} Sesi
                                                </span>
                                            </div>
                                            <p className="text-[10.5px] text-orange-700 leading-snug">
                                                Atlet ini terdaftar dalam paket bersama. Sesi latihan privat ini otomatis menggunakan kuota Paket Bersama (Sisa: {sharedPackages[0].remaining_sessions ?? '∞'} sesi).
                                            </p>
                                            {sharedPackages.length > 1 && (
                                                <select
                                                    value={data.shared_package_id}
                                                    onChange={(e) => setData("shared_package_id", e.target.value)}
                                                    className="w-full text-xs font-medium text-slate-800 bg-white border border-orange-200 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-orange-400 focus:border-orange-400 shadow-2xs mt-1"
                                                >
                                                    {sharedPackages.map((sp) => (
                                                        <option key={sp.id} value={sp.id}>
                                                            {sp.name} — {sp.used_sessions || 0}/{sp.total_sessions || '∞'} Sesi Terpakai (Sisa: {sp.remaining_sessions ?? '∞'} sesi)
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                    )}

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
                                            className={`w-full text-xs font-medium text-slate-800 bg-white border rounded-md px-3 py-2 focus:ring-1 focus:ring-orange-400 focus:border-orange-400 shadow-2xs placeholder:text-slate-400 ${errors.location ? "border-red-300" : "border-slate-200"}`}
                                            required
                                        />
                                        {errors.location && (
                                            <div className="text-red-500 text-[10px] mt-1 font-semibold">
                                                {errors.location}
                                            </div>
                                        )}
                                    </div>

                                    {/* Pelatih Pendamping */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                                            Pelatih Pendamping (Maks. 2)
                                        </label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {coaches && coaches.length > 0 ? (
                                                coaches.map((coach) => {
                                                    const isSelected = data.coach_ids.includes(coach.id);
                                                    return (
                                                        <button
                                                            key={coach.id}
                                                            type="button"
                                                            onClick={() => {
                                                                if (isSelected) {
                                                                    setData("coach_ids", data.coach_ids.filter((id) => id !== coach.id));
                                                                } else {
                                                                    if (data.coach_ids.length >= 2) {
                                                                        alert("Maksimal memilih 2 pelatih.");
                                                                        return;
                                                                    }
                                                                    setData("coach_ids", [...data.coach_ids, coach.id]);
                                                                }
                                                            }}
                                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                                                                isSelected 
                                                                    ? "bg-orange-50 border-orange-300 text-orange-700 shadow-2xs font-bold" 
                                                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                                            }`}
                                                        >
                                                            <span>{coach.name}</span>
                                                        </button>
                                                    );
                                                })
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">
                                                    Belum ada data pelatih.
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sesi Tambahan Checkbox */}
                                    <label className="flex items-start gap-2.5 p-2.5 bg-slate-50/70 border border-slate-200/80 rounded-md cursor-pointer hover:bg-slate-50 transition-colors mt-2">
                                        <input
                                            type="checkbox"
                                            checked={data.is_extra}
                                            onChange={(e) => setData("is_extra", e.target.checked)}
                                            className="w-3.5 h-3.5 text-orange-500 rounded border-slate-300 focus:ring-orange-500 mt-0.5"
                                        />
                                        <div className="text-xs font-medium text-slate-800">
                                            <span className="font-bold">Sesi Tambahan</span>
                                            <span className="text-slate-400 block text-[10.5px] mt-0.5 leading-snug">
                                                Tidak memotong kuota paket latihan atlet.
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* ═══════════════════════════════════════════════════════
                            KOLOM KANAN (8 Kolom di LG) — Skema & Program Latihan
                           ═══════════════════════════════════════════════════════ */}
                        <div className="lg:col-span-8 space-y-3">
                            <div className="flex flex-wrap justify-between items-center gap-2 bg-white border border-slate-200/80 rounded-md px-4 py-2.5 shadow-2xs">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900">
                                        Program Latihan
                                    </h3>
                                    <p className="text-[10.5px] text-slate-400 font-medium">
                                        {data.blocks.length} blok tersusun
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Mode Simpel / Pro Toggle */}
                                    <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200/80 text-xs">
                                        <button
                                            type="button"
                                            onClick={() => setIsSimpleMode(true)}
                                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                                                isSimpleMode
                                                    ? 'bg-white text-orange-600 shadow-2xs'
                                                    : 'text-slate-500 hover:text-slate-800'
                                            }`}
                                            title="Mode Ringkas"
                                        >
                                            <Zap size={11} className={isSimpleMode ? "text-orange-500" : "text-slate-400"} />
                                            <span>Ringkas</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsSimpleMode(false)}
                                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                                                !isSimpleMode
                                                    ? 'bg-white text-orange-600 shadow-2xs'
                                                    : 'text-slate-500 hover:text-slate-800'
                                            }`}
                                            title="Mode Pro"
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

                                    <button
                                        type="button"
                                        onClick={addTextBlock}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                                        title="Tambah Blok Catatan Teks"
                                    >
                                        <Type size={12} className="text-slate-500" />
                                        <span>Catatan</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={addPhaseBlock}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                                        title="Tambah Fase Latihan Baru"
                                    >
                                        <Activity size={12} />
                                        <span>Fase Latihan</span>
                                    </button>
                                </div>
                            </div>

                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="blocks" type="block">
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="space-y-3"
                                        >
                                            {data.blocks.map((block, index) => (
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
                                                                    onChange={(field, val) => updateBlock(index, field, val)}
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
                                                                    onChange={(field, val) => updateBlock(index, field, val)}
                                                                    onRemove={() => removeBlock(index)}
                                                                    onDuplicate={() => duplicateBlock(index)}
                                                                    onOpenExerciseModal={() => setIsExModalOpen(true)}
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

                            {data.blocks.length === 0 && (
                                <div className="text-center py-10 px-4 bg-white border border-dashed border-slate-200 rounded-lg shadow-2xs space-y-4">
                                    <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto border border-orange-100">
                                        <Dumbbell size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-800">
                                            Belum Ada Program Latihan yang Disusun
                                        </h4>
                                        <p className="text-[11px] text-slate-400 mt-0.5 max-w-md mx-auto">
                                            Pilih salah satu cara tercepat di bawah ini untuk mulai mengisi latihan:
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
                                </div>
                            )}

                            {data.blocks.length > 0 && (
                                <div className="pt-1 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={addTextBlock}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                                    >
                                        <Type size={13} />
                                        <span>Tambah Catatan Teks</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={addPhaseBlock}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold shadow-2xs transition-all cursor-pointer"
                                    >
                                        <Activity size={13} />
                                        <span>Tambah Fase Latihan</span>
                                    </button>
                                </div>
                            )}
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
