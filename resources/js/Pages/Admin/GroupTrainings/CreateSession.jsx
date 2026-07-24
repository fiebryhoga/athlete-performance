import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ChevronLeft,
    Dumbbell,
    Activity,
    Type,
    ClipboardEdit,
    X,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import PhaseBlock from "../IndividualTrainings/Partials/PhaseBlock";
import TextBlock from "../IndividualTrainings/Partials/TextBlock";
import ExerciseQuickModal from "../IndividualTrainings/Partials/ExerciseQuickModal";
import PageHeader from "@/Components/Layout/PageHeader";

export default function CreateSession({
    auth,
    group,
    exercises = [],
    packages = [],
    coaches = [],
    date,
    nextSessionNumber,
    availableAthletes,
}) {
    const { data, setData, post, processing, errors, transform } = useForm({
        date: date || "",
        name: "",
        training_type: "",
        location: "",
        coach_ids: [],
        attendee_ids: group?.members?.map(m => m.id) || [],
        programs: [{ name: "Program Utama", athlete_ids: null, blocks: [] }],
        is_extra: false,
    });

    
    transform((data) => ({
        ...data,
        programs: hasSecondaryProgram ? data.programs : [{ ...data.programs[0], athlete_ids: null }]
    }));

    const [isExModalOpen, setIsExModalOpen] = useState(false);
        const [activeProgramIndex, setActiveProgramIndex] = useState(0);
    const [hasSecondaryProgram, setHasSecondaryProgram] = useState(
        data.programs && data.programs.length > 1
    );

    const submitSession = (e) => {
        e.preventDefault();
        
        // Fix up athlete_ids before sending
        const submitData = { ...data };
        if (!hasSecondaryProgram) {
            submitData.programs = [{ ...submitData.programs[0], athlete_ids: null }];
        }
        
        post(route("admin.group-trainings.session.store", group.id), {
            data: submitData
        });
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
        const blockToCopy = JSON.parse(JSON.stringify(newPrograms[activeProgramIndex].blocks[index]));
        if (blockToCopy.items) {
            blockToCopy.items = blockToCopy.items.map(item => {
                const newItem = { ...item };
                return newItem;
            });
        }
        newPrograms[activeProgramIndex].blocks.splice(index + 1, 0, blockToCopy);
        setData("programs", newPrograms);
    };

    return (
        <AppLayout title={`Tambah Sesi - ${group.name}`}>
            <Head title={`Tambah Sesi - ${group.name}`} />

            <PageHeader
                title="Perancang Sesi Latihan"
                subtitle={`Buat rancangan program latihan untuk ${group.name} pada ${date}.`}
                badge="Training"
                icon={ClipboardEdit}
                actions={
                    <Link
                        href={route(
                            "admin.group-trainings.show",
                            group.id,
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
                        <Activity className="w-5 h-5 text-orange-500" />
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
                                className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
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
                                className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder-slate-400"
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
                                className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder-slate-400"
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
                                className={`w-full py-2.5 px-4 bg-slate-50 border rounded-lg text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder-slate-400 ${errors.location ? "border-rose-300" : "border-slate-200"}`}
                            />
                            {errors.location && (
                                <div className="text-rose-500 text-xs mt-1 font-bold">
                                    {errors.location}
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2 lg:col-span-3">
                            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer" onClick={() => setData('is_extra', !data.is_extra)}>
                                <input
                                    type="checkbox"
                                    checked={data.is_extra}
                                    onChange={(e) => setData('is_extra', e.target.checked)}
                                    className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                                />
                                <label className="text-sm font-semibold text-slate-800 cursor-pointer">
                                    Sesi Tambahan (Turnamen / PR / Latihan Mandiri)
                                    <span className="block text-xs text-slate-500 mt-0.5">Sesi ini tidak akan memotong kuota paket latihan.</span>
                                </label>
                            </div>
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
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all ${data.coach_ids.includes(coach.id) ? "bg-orange-50 border-orange-500 text-orange-500 shadow-sm" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"}`}
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
                                                className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold ${data.coach_ids.includes(coach.id) ? "bg-orange-500/10 text-orange-500" : "bg-slate-100 text-slate-500"}`}
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

                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-widest">
                                Peserta Sesi (Checklist Kehadiran)
                            </label>
                            <p className="text-xs text-slate-500 mb-3 -mt-1">
                                Hapus centang pada atlet yang <strong>tidak hadir / absen</strong> pada sesi ini agar mereka tidak dimasukkan ke dalam catatan sesi.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {group?.members && group.members.length > 0 ? (
                                    group.members.map((member) => (
                                        <label
                                            key={member.id}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${data.attendee_ids.includes(member.id) ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300"}`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={data.attendee_ids.includes(member.id)}
                                                onChange={(e) => {
                                                    let newIds = [...data.attendee_ids];
                                                    if (e.target.checked) {
                                                        newIds.push(member.id);
                                                    } else {
                                                        newIds = newIds.filter(id => id !== member.id);
                                                    }
                                                    
                                                    let newData = { ...data, attendee_ids: newIds };
                                                    
                                                    if (typeof hasSecondaryProgram !== 'undefined' && hasSecondaryProgram) {
                                                        const newProgs = [...data.programs];
                                                        if (newProgs[1] && newProgs[1].athlete_ids) {
                                                            newProgs[1].athlete_ids = newProgs[1].athlete_ids.filter(id => newIds.includes(id));
                                                        }
                                                        if (newProgs[0] && newProgs[0].athlete_ids) {
                                                            newProgs[0].athlete_ids = newIds.filter(id => !newProgs[1]?.athlete_ids?.includes(id));
                                                        }
                                                        newData.programs = newProgs;
                                                    }
                                                    
                                                    setData(newData);
                                                }}
                                            />
                                            <span className="text-xs font-bold">{member.name}</span>
                                        </label>
                                    ))
                                ) : (
                                    <div className="text-sm text-slate-500 italic py-2">
                                        Belum ada anggota di grup ini.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Editor */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-5 bg-white border-b border-slate-200 sticky top-0 z-40">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Dumbbell className="w-5 h-5 text-orange-500" />
                                Skema & Program Latihan
                            </h3>
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-600 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-all">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                                    checked={hasSecondaryProgram}
                                    onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        setHasSecondaryProgram(isChecked);
                                        
                                        const newProgs = [...data.programs];
                                        if (isChecked) {
                                            if (newProgs.length < 2) {
                                                newProgs.push({ name: "Program Sekunder", athlete_ids: [], blocks: [] });
                                            }
                                            newProgs[0].athlete_ids = [...data.attendee_ids];
                                            if (newProgs[1] && newProgs[1].athlete_ids) {
                                                newProgs[0].athlete_ids = data.attendee_ids.filter(id => !newProgs[1].athlete_ids.includes(id));
                                            }
                                        } else {
                                            setActiveProgramIndex(0);
                                            newProgs[0].athlete_ids = null;
                                        }
                                        setData("programs", newProgs);
                                    }}
                                />
                                Buat 2 Program Berbeda?
                            </label>
                        </div>
                        
                        {hasSecondaryProgram && (
                            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveProgramIndex(0)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeProgramIndex === 0 ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    {data.programs[0].name}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveProgramIndex(1)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeProgramIndex === 1 ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    {data.programs[1]?.name || 'Program Sekunder'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="p-6 md:p-8">
                        {/* Program Settings (Audience) */}
                        {hasSecondaryProgram && activeProgramIndex === 1 && (
                            <div className="mb-6 bg-white p-4 rounded-xl border border-zinc-200">
                                <label className="block text-sm font-bold text-zinc-700 mb-1">Pilih Atlet untuk Program Sekunder</label>
                                <p className="text-xs text-zinc-500 mb-3">Atlet yang dipilih akan menjalankan program ini dan TIDAK menjalankan Program Utama.</p>
                                <div className="flex flex-wrap gap-2 pt-3 border-t border-zinc-100">
                                    {data.attendee_ids.map(attId => {
                                        const athlete = (typeof availableAthletes !== 'undefined' ? availableAthletes.find(a => a.id === attId) : null) || (typeof group !== 'undefined' ? group?.members?.find(m => m.id === attId) : null);
                                        if (!athlete) return null;
                                        const isSelected = data.programs[1]?.athlete_ids?.includes(attId);
                                        return (
                                            <label key={attId} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${isSelected ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`}>
                                                <input 
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={isSelected}
                                                    onChange={(e) => {
                                                        const newProgs = [...data.programs];
                                                        if (!newProgs[1]) newProgs[1] = { name: "Program Sekunder", athlete_ids: [], blocks: [] };
                                                        let newIds = newProgs[1].athlete_ids ? [...newProgs[1].athlete_ids] : [];
                                                        if (e.target.checked) newIds.push(attId);
                                                        else newIds = newIds.filter(id => id !== attId);
                                                        newProgs[1].athlete_ids = newIds;
                                                        
                                                        // Automatically update Program Utama's athlete_ids
                                                        const allIds = data.attendee_ids;
                                                        newProgs[0].athlete_ids = allIds.filter(id => !newIds.includes(id));
                                                        
                                                        setData("programs", newProgs);
                                                    }}
                                                />
                                                <span className="text-xs font-bold">{athlete?.name || 'Atlet'}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        
                        {hasSecondaryProgram && activeProgramIndex === 0 && (
                            <div className="mb-6 bg-orange-50 p-4 rounded-xl border border-orange-200">
                                <p className="text-sm font-bold text-orange-800">Informasi Program Utama</p>
                                <p className="text-xs text-orange-600 mt-1">Program ini akan diterapkan ke semua atlet dalam sesi ini, <strong>KECUALI</strong> atlet yang sudah Anda centang di tab <strong>Program Sekunder</strong>.</p>
                            </div>
                        )}

                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="blocks" type="block">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="space-y-6"
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

                        {data.programs[activeProgramIndex].blocks.length === 0 && (
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
                                className="text-sm font-bold bg-orange-50 border border-orange-200 text-orange-500 px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:bg-orange-100 hover:border-orange-300 shadow-sm hover:shadow-md"
                            >
                                <Type size={16} className="text-orange-500" />{" "}
                                Tambah Catatan Teks
                            </button>
                            <button
                                type="button"
                                onClick={addPhaseBlock}
                                className="text-sm font-bold bg-orange-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:bg-orange-600 shadow-md shadow-orange-500/20 hover:shadow-lg"
                            >
                                <Activity size={16} /> Tambah Fase Latihan
                            </button>
                        </div>
                    </div>

                    <div className="p-5 bg-white border-t border-slate-200 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-3.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2"
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
