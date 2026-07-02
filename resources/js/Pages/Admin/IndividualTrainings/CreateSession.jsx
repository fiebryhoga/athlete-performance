import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ChevronLeft,
    Dumbbell,
    Activity,
    Type,
    ClipboardEdit,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import PhaseBlock from "./Partials/PhaseBlock";
import TextBlock from "./Partials/TextBlock";
import ExerciseQuickModal from "./Partials/ExerciseQuickModal";
import PageHeader from "@/Components/Layout/PageHeader";

export default function CreateSession({
    auth,
    athlete,
    exercises = [],
    packages = [],
    coaches = [],
    date,
    nextSessionNumber,
}) {
    const { data, setData, post, processing, errors } = useForm({
        date: date || "",
        name: "",
        training_type: "",
        location: "",
        coach_ids: [],
        blocks: [],
    });

    const [isExModalOpen, setIsExModalOpen] = useState(false);

    const submitSession = (e) => {
        e.preventDefault();
        post(route("admin.individual-trainings.session.store", athlete.id));
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

    return (
        <AppLayout title={`Tambah Sesi - ${athlete.name}`}>
            <Head title={`Tambah Sesi - ${athlete.name}`} />

            <PageHeader
                title="Perancang Sesi Latihan"
                subtitle={`Buat rancangan program latihan untuk ${athlete.name} pada ${date}.`}
                badge="Training"
                icon={ClipboardEdit}
                actions={
                    <Link
                        href={route(
                            "admin.individual-trainings.show",
                            athlete.id,
                        )}
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors bg-white border border-slate-200 px-5 py-2.5 rounded-lg shadow-sm"
                    >
                        <ChevronLeft size={16} /> Batal & Kembali
                    </Link>
                }
            />

            <form onSubmit={submitSession} className="space-y-6 md:space-y-8">
                {/* Basic Info */}
                <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[#ff4d00]" />
                        Informasi Dasar
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                                Tanggal Sesi
                            </label>
                            <input
                                type="date"
                                value={data.date}
                                onChange={(e) =>
                                    setData("date", e.target.value)
                                }
                                className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] outline-none transition-all"
                            />
                            {errors.date && (
                                <div className="text-rose-500 text-xs mt-1 font-bold">
                                    {errors.date}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                                Judul Sesi Latihan{" "}
                                <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="Contoh: Recovery Training"
                                className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] outline-none transition-all placeholder-slate-400"
                                required
                            />
                            {errors.name && (
                                <div className="text-rose-500 text-xs mt-1 font-bold">
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                                Fokus Latihan
                            </label>
                            <input
                                type="text"
                                value={data.training_type}
                                onChange={(e) =>
                                    setData("training_type", e.target.value)
                                }
                                placeholder="e.g. Strength, Recovery..."
                                className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] outline-none transition-all placeholder-slate-400"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                                Lokasi <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.location}
                                onChange={(e) =>
                                    setData("location", e.target.value)
                                }
                                placeholder="e.g. Gym A..."
                                className={`w-full py-2.5 px-4 bg-slate-50 border rounded-lg text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#ff4d00]/20 focus:border-[#ff4d00] outline-none transition-all placeholder-slate-400 ${errors.location ? "border-rose-300" : "border-slate-200"}`}
                            />
                            {errors.location && (
                                <div className="text-rose-500 text-xs mt-1 font-bold">
                                    {errors.location}
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-widest">
                                Coach Pendamping (Pilih 1 atau 2)
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {coaches && coaches.length > 0 ? (
                                    coaches.map((coach) => (
                                        <label
                                            key={coach.id}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all ${data.coach_ids.includes(coach.id) ? "bg-orange-50 border-[#ff4d00] text-[#ff4d00] shadow-sm" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"}`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={data.coach_ids.includes(
                                                    coach.id,
                                                )}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        if (
                                                            data.coach_ids
                                                                .length >= 2
                                                        ) {
                                                            alert(
                                                                "Maksimal memilih 2 pelatih",
                                                            );
                                                            return;
                                                        }
                                                        setData("coach_ids", [
                                                            ...data.coach_ids,
                                                            coach.id,
                                                        ]);
                                                    } else {
                                                        setData(
                                                            "coach_ids",
                                                            data.coach_ids.filter(
                                                                (id) =>
                                                                    id !==
                                                                    coach.id,
                                                            ),
                                                        );
                                                    }
                                                }}
                                            />
                                            <span className="text-sm font-bold">
                                                {coach.name}
                                            </span>
                                            <span
                                                className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold ${data.coach_ids.includes(coach.id) ? "bg-[#ff4d00]/10 text-[#ff4d00]" : "bg-slate-100 text-slate-500"}`}
                                            >
                                                {coach.role.replace("_", " ")}
                                            </span>
                                        </label>
                                    ))
                                ) : (
                                    <div className="text-sm text-slate-500 italic py-2">
                                        Belum ada coach yang ditugaskan untuk
                                        atlet ini.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Editor */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-5 bg-white border-b border-slate-200 flex justify-between items-center sticky top-0 z-40">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Dumbbell className="w-5 h-5 text-[#ff4d00]" />
                            Skema & Program Latihan
                        </h3>
                    </div>

                    <div className="p-6 md:p-8">
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="blocks" type="block">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="space-y-6"
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
                                                                dragHandleProps={
                                                                    provided.dragHandleProps
                                                                }
                                                                onChange={(
                                                                    field,
                                                                    val,
                                                                ) =>
                                                                    updateBlock(
                                                                        index,
                                                                        field,
                                                                        val,
                                                                    )
                                                                }
                                                                onRemove={() =>
                                                                    removeBlock(
                                                                        index,
                                                                    )
                                                                }
                                                                onDuplicate={() =>
                                                                    duplicateBlock(
                                                                        index,
                                                                    )
                                                                }
                                                            />
                                                        ) : (
                                                            <PhaseBlock
                                                                blockIndex={
                                                                    index
                                                                }
                                                                dragHandleProps={
                                                                    provided.dragHandleProps
                                                                }
                                                                block={block}
                                                                exercises={
                                                                    exercises
                                                                }
                                                                exercisePackages={
                                                                    packages
                                                                }
                                                                onChange={(
                                                                    field,
                                                                    val,
                                                                ) =>
                                                                    updateBlock(
                                                                        index,
                                                                        field,
                                                                        val,
                                                                    )
                                                                }
                                                                onRemove={() =>
                                                                    removeBlock(
                                                                        index,
                                                                    )
                                                                }
                                                                onDuplicate={() =>
                                                                    duplicateBlock(
                                                                        index,
                                                                    )
                                                                }
                                                                onOpenExerciseModal={() =>
                                                                    setIsExModalOpen(
                                                                        true,
                                                                    )
                                                                }
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
                            <div className="text-center py-16 bg-white border-2 border-slate-200 border-dashed rounded-xl mt-4">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
                                    <Dumbbell
                                        size={28}
                                        className="text-slate-300"
                                    />
                                </div>
                                <p className="text-lg font-bold text-slate-700">
                                    Belum ada blok program latihan
                                </p>
                                <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                                    Gunakan tombol di bawah untuk mulai menyusun
                                    program. Anda bisa menyeret (drag) blok yang
                                    telah dibuat untuk mengatur urutannya.
                                </p>
                            </div>
                        )}

                        <div className="mt-8 flex flex-wrap justify-end gap-3">
                            <button
                                type="button"
                                onClick={addTextBlock}
                                className="text-sm font-bold bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 shadow-sm hover:shadow-md"
                            >
                                <Type size={16} className="text-slate-400" />{" "}
                                Tambah Catatan Teks
                            </button>
                            <button
                                type="button"
                                onClick={addPhaseBlock}
                                className="text-sm font-bold bg-slate-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:bg-slate-900 shadow-md hover:shadow-lg"
                            >
                                <Activity size={16} /> Tambah Fase Latihan
                            </button>
                        </div>
                    </div>

                    <div className="p-5 bg-white border-t border-slate-200 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-3.5 text-sm font-bold text-white bg-[#ff4d00] hover:bg-[#e64500] rounded-xl transition-all shadow-lg shadow-[#ff4d00]/20 disabled:opacity-50 flex items-center gap-2"
                        >
                            {processing
                                ? "MENYIMPAN..."
                                : "SIMPAN PROGRAM SESI INI"}
                        </button>
                    </div>
                </div>
            </form>

            <ExerciseQuickModal
                isOpen={isExModalOpen}
                onClose={() => setIsExModalOpen(false)}
            />
        </AppLayout>
    );
}
