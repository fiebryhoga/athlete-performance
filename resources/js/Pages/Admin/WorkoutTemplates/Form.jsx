import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import PageHeader from "@/Components/Common/PageHeader";
import {
    Sparkles,
    ChevronLeft,
    Save,
    Dumbbell,
    Activity,
    Type,
    Zap,
    Flame,
    HeartPulse,
    SlidersHorizontal,
    Layers,
    Trophy,
    Target,
    Timer,
    Scale,
    Footprints,
    Gauge,
    Shield,
    TrendingUp,
    RotateCcw,
    Crosshair
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import PhaseBlock from "../IndividualTrainings/Partials/PhaseBlock";
import TextBlock from "../IndividualTrainings/Partials/TextBlock";
import ExerciseQuickModal from "../IndividualTrainings/Partials/ExerciseQuickModal";

export default function Form({
    template = null,
    exercises = [],
    packages = [],
}) {
    const isEdit = !!template;

    const { data, setData, post, put, processing, errors } = useForm({
        title: template?.title || "",
        category: template?.category || "Strength & Hypertrophy",
        description: template?.description || "",
        icon: template?.icon || "Dumbbell",
        is_public: template?.is_public ?? true,
        blocks: template?.blocks?.length > 0 ? template.blocks : [],
    });

    const [isExModalOpen, setIsExModalOpen] = useState(false);
    const [isSimpleMode, setIsSimpleMode] = useState(true);

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route("admin.workout-templates.update", template.id));
        } else {
            post(route("admin.workout-templates.store"));
        }
    };

    const addPhaseBlock = () => {
        const newBlock = {
            name: `Fase ${data.blocks.length + 1} - Latihan`,
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
                },
            ],
        };
        setData("blocks", [...data.blocks, newBlock]);
    };

    const addTextBlock = () => {
        const newBlock = {
            step: 1,
            name: "Catatan Instruksi",
            note: "",
        };
        setData("blocks", [...data.blocks, newBlock]);
    };

    const updateBlock = (index, field, value) => {
        const updated = [...data.blocks];
        if (typeof field === "object") {
            updated[index] = { ...updated[index], ...field };
        } else {
            updated[index][field] = value;
        }
        setData("blocks", updated);
    };

    const removeBlock = (index) => {
        const updated = [...data.blocks];
        updated.splice(index, 1);
        setData("blocks", updated);
    };

    const duplicateBlock = (index) => {
        const updated = [...data.blocks];
        const clone = JSON.parse(JSON.stringify(updated[index]));
        clone.name = `${clone.name} (Copy)`;
        updated.splice(index + 1, 0, clone);
        setData("blocks", updated);
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
                    },
                ],
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
                    },
                ],
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
                    },
                ],
            },
        ];
        setData("blocks", defaultBlocks);
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination } = result;
        const items = Array.from(data.blocks);
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);
        setData("blocks", items);
    };

    const categoryOptions = [
        "Strength & Hypertrophy",
        "Strength & Power",
        "Athletic Conditioning",
        "Fat Burn & Stamina",
        "Recovery & Flexibility",
        "Speed & Agility (SAQ)",
        "Endurance & Cardio",
    ];

    const iconOptions = [
        { id: "Dumbbell", label: "Dumbbell (Kekuatan / Beban)", icon: Dumbbell },
        { id: "Zap", label: "Petir (Power & Kecepatan)", icon: Zap },
        { id: "Flame", label: "Api (Fat Burn & SAQ)", icon: Flame },
        { id: "Activity", label: "Aktivitas (Full Body / Kardio)", icon: Activity },
        { id: "HeartPulse", label: "Heart Pulse (Recovery)", icon: HeartPulse },
        { id: "Trophy", label: "Trophy (Performa & Cabor)", icon: Trophy },
        { id: "Target", label: "Target (Fokus Otot / Core)", icon: Target },
        { id: "Timer", label: "Timer (Interval & HIIT)", icon: Timer },
        { id: "Footprints", label: "Footprints (Agility & Footwork)", icon: Footprints },
        { id: "Gauge", label: "Gauge (Endurance / Stamina)", icon: Gauge },
        { id: "Shield", label: "Shield (Prehab & Bebas Cedera)", icon: Shield },
        { id: "TrendingUp", label: "Trending Up (Hipertrofi / Progress)", icon: TrendingUp },
        { id: "Scale", label: "Scale (Stabilitas & Postur)", icon: Scale },
        { id: "RotateCcw", label: "Mobilitas & Peregangan", icon: RotateCcw },
        { id: "Crosshair", label: "Crosshair (Spesifik Cabor)", icon: Crosshair },
        { id: "Sparkles", label: "Sparkles (Program Spesial)", icon: Sparkles },
    ];

    return (
        <AppLayout>
            <Head title={isEdit ? `Edit Template: ${data.title}` : "Buat Template Sesi Baru"} />

            <div className="space-y-4">
                {/* PAGE HEADER */}
                <PageHeader
                    title={isEdit ? "Edit Template Sesi" : "Buat Template Sesi Baru"}
                    description="Susun skema latihan siap pakai yang dapat langsung digunakan dalam 1-klik."
                    icon={Sparkles}
                    actions={
                        <div className="flex items-center gap-2">
                            <Link
                                href={route("admin.workout-templates.index")}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-semibold shadow-2xs transition-colors"
                            >
                                <ChevronLeft size={14} />
                                <span>Kembali</span>
                            </Link>
                            <button
                                type="button"
                                onClick={submit}
                                disabled={processing}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-md text-xs font-bold shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                            >
                                <Save size={14} />
                                <span>{processing ? "Menyimpan..." : "Simpan Template"}</span>
                            </button>
                        </div>
                    }
                />

                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* ═══════════════════════════════════════════════════════
                            KOLOM KIRI (4 Kolom di LG) — Informasi Template
                           ═══════════════════════════════════════════════════════ */}
                        <div className="lg:col-span-4 space-y-3">
                            <div className="bg-white border border-slate-200/80 rounded-md p-4 shadow-2xs space-y-3.5">
                                <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                                    <Sparkles size={14} className="text-orange-500" />
                                    <span>Informasi Template Sesi</span>
                                </h3>

                                {/* Judul Template */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Judul Template <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData("title", e.target.value)}
                                        placeholder="Contoh: Upper Body Strength A"
                                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        required
                                    />
                                    {errors.title && (
                                        <p className="text-[10.5px] text-rose-500 mt-1">{errors.title}</p>
                                    )}
                                </div>

                                {/* Kategori Template */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Kategori Program <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData("category", e.target.value)}
                                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    >
                                        {categoryOptions.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="text-[10.5px] text-rose-500 mt-1">{errors.category}</p>
                                    )}
                                </div>

                                {/* Pilihan Ikon */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Ikon Template ({iconOptions.length} Pilihan)
                                    </label>
                                    <div className="grid grid-cols-8 gap-1.5">
                                        {iconOptions.map((item) => {
                                            const IconComp = item.icon;
                                            const isSelected = data.icon === item.id;
                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => setData("icon", item.id)}
                                                    title={item.label}
                                                    className={`p-1.5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                                                        isSelected
                                                            ? "bg-orange-50 border-orange-500 text-orange-600 shadow-2xs ring-1 ring-orange-500"
                                                            : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                                    }`}
                                                >
                                                    <IconComp size={14} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Deskripsi Singkat */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Deskripsi / Catatan Singkat
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        placeholder="Penjelasan singkat tujuan latihan dan fokus otot..."
                                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    />
                                    {errors.description && (
                                        <p className="text-[10.5px] text-rose-500 mt-1">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ═══════════════════════════════════════════════════════
                            KOLOM KANAN (8 Kolom di LG) — Builder Fase Latihan
                           ═══════════════════════════════════════════════════════ */}
                        <div className="lg:col-span-8 space-y-3">
                            <div className="flex flex-wrap justify-between items-center gap-2 bg-white border border-slate-200/80 rounded-md px-4 py-2.5 shadow-2xs">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900">
                                        Skema & Fase Latihan Template
                                    </h3>
                                    <p className="text-[10.5px] text-slate-400 font-medium">
                                        {data.blocks.length} blok fase tersusun
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Mode Toggle */}
                                    <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-md border border-slate-200">
                                        <button
                                            type="button"
                                            onClick={() => setIsSimpleMode(true)}
                                            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                                                isSimpleMode
                                                    ? "bg-white text-orange-600 shadow-2xs"
                                                    : "text-slate-500 hover:text-slate-800"
                                            }`}
                                        >
                                            <Zap size={12} className={isSimpleMode ? "text-orange-500" : "text-slate-400"} />
                                            <span>Mode Ringkas</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsSimpleMode(false)}
                                            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                                                !isSimpleMode
                                                    ? "bg-white text-orange-600 shadow-2xs"
                                                    : "text-slate-500 hover:text-slate-800"
                                            }`}
                                        >
                                            <SlidersHorizontal size={12} className={!isSimpleMode ? "text-orange-500" : "text-slate-400"} />
                                            <span>Mode Pro</span>
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addTextBlock}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                                    >
                                        <Type size={13} className="text-slate-500" />
                                        <span>Catatan Teks</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={addPhaseBlock}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold shadow-2xs transition-all cursor-pointer"
                                    >
                                        <Activity size={13} />
                                        <span>Tambah Fase</span>
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

                            {data.blocks.length === 0 && (
                                <div className="text-center py-10 px-4 bg-white border border-dashed border-slate-200 rounded-lg shadow-2xs space-y-4">
                                    <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto border border-orange-100">
                                        <Dumbbell size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-800">
                                            Belum Ada Fase Program
                                        </h4>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            Klik tombol di bawah untuk membuat struktur 3 fase standar secara otomatis:
                                        </p>
                                    </div>
                                    <div className="flex justify-center">
                                        <button
                                            type="button"
                                            onClick={generateDefaultPhases}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
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
        </AppLayout>
    );
}
