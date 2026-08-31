import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ChevronLeft, Dumbbell, Activity, Type, Save } from "lucide-react";
import PageHeader from "@/Components/Common/PageHeader";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import PhaseBlock from "./Partials/PhaseBlock";
import TextBlock from "./Partials/TextBlock";
import ExerciseQuickModal from "./Partials/ExerciseQuickModal";

export default function EditSession({
    training,
    user,
    exercisesList = [],
    packagesList = [],
    coachesList = [],
}) {
    const { data, setData, put, processing, errors } = useForm({
        date: training.date || new Date().toISOString().split("T")[0],
        name: training.name || "",
        training_type: training.training_type || "Strength",
        location: training.location || "Gym",
        coach_ids: training.coach_ids || [],
        blocks: training.blocks?.length > 0 ? training.blocks : [],
        is_extra: training.is_extra || false,
    });

    // Back URL logic
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const fromParam = urlParams.get('from');
    const packageIdParam = urlParams.get('package_id') || training.shared_package_id;
    const athleteIdParam = urlParams.get('athlete_id');

    let backUrl = route("admin.individual-trainings.session.show", training.id);
    let backLabel = "Kembali ke Detail Sesi";

    if (fromParam === 'shared-package' && packageIdParam) {
        backUrl = route("admin.individual-trainings.session.show", training.id) + `?from=shared-package&package_id=${packageIdParam}`;
    } else if (fromParam === 'athlete' && athleteIdParam) {
        backUrl = route("admin.individual-trainings.session.show", training.id) + `?from=athlete&athlete_id=${athleteIdParam}`;
    }

    const submit = (e) => {
        e.preventDefault();
        const query = fromParam ? `?from=${fromParam}&package_id=${packageIdParam || ''}&athlete_id=${athleteIdParam || ''}` : '';
        put(route("admin.individual-trainings.session.update", training.id) + query);
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
        delete blockToCopy.id;
        if (blockToCopy.items) {
            blockToCopy.items = blockToCopy.items.map((item) => {
                const newItem = { ...item };
                delete newItem.id;
                return newItem;
            });
        }
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
            title={`Edit Sesi - ${user.name}`}
            description="Edit program sesi latihan atlet."
        >
            <Head title={`Edit Sesi - ${user.name}`} />

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
                        title="Edit Sesi Latihan"
                        description={`Perbarui program latihan untuk ${training.athlete?.name || user.name} pada ${formattedDateStr}.`}
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
                                    onClick={submit}
                                    disabled={processing}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold shadow-2xs hover:shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    <Save size={13} />
                                    <span>{processing ? "Menyimpan..." : "Simpan Perubahan"}</span>
                                </button>
                            </div>
                        }
                    />
                </div>

                <form onSubmit={submit}>
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
                                    {training.session_number && (
                                        <span className="text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-200/60 px-2 py-0.5 rounded-md">
                                            Sesi #{training.session_number}
                                        </span>
                                    )}
                                </div>

                                <div className="p-4 space-y-3.5">
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

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                            Judul Sesi Latihan <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            placeholder="Contoh: Recovery Training / Upper Body Strength"
                                            className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-orange-400 focus:border-orange-400 shadow-2xs placeholder:text-slate-400"
                                            required
                                        />
                                        {errors.name && (
                                            <div className="text-red-500 text-[10px] mt-1 font-semibold">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>

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

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                                            Pelatih Pendamping (Maks. 2)
                                        </label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {coachesList && coachesList.length > 0 ? (
                                                coachesList.map((coach) => {
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
                            <div className="flex justify-between items-center bg-white border border-slate-200/80 rounded-md px-4 py-2.5 shadow-2xs">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900">
                                        Skema & Program Latihan
                                    </h3>
                                    <p className="text-[10.5px] text-slate-400 font-medium">
                                        {data.blocks.length} blok latihan tersusun
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
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
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                                    >
                                        <Activity size={13} />
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
                                                                    exercises={exercisesList}
                                                                    exercisePackages={packagesList}
                                                                    onChange={(field, val) => updateBlock(index, field, val)}
                                                                    onRemove={() => removeBlock(index)}
                                                                    onDuplicate={() => duplicateBlock(index)}
                                                                    onOpenExerciseModal={() => setIsExModalOpen(true)}
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
                                <div className="text-center py-14 bg-white border border-dashed border-slate-200 rounded-md shadow-2xs">
                                    <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center mx-auto mb-2 text-slate-400">
                                        <Dumbbell size={18} />
                                    </div>
                                    <p className="text-xs font-bold text-slate-700">
                                        Belum Ada Blok Program Latihan
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                                        Gunakan tombol <strong>Fase Latihan</strong> atau <strong>Catatan Teks</strong> di atas untuk mulai menyusun program.
                                    </p>
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
