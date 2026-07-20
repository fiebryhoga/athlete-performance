import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Dumbbell, Activity, Type } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import PhaseBlock from '../IndividualTrainings/Partials/PhaseBlock';
import TextBlock from '../IndividualTrainings/Partials/TextBlock';
import ExerciseQuickModal from '../IndividualTrainings/Partials/ExerciseQuickModal';

export default function EditSession({
    training,
    user,
    exercisesList,
    packagesList,
    coachesList,
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

 const [isExModalOpen, setIsExModalOpen] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.group-trainings.session.update", training.id));
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
 const destBlockIndex = parseInt(destination.droppableId.split("-")[2]);

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
 { step: 1, category: "instruction", title: "", items: [{ note: "" }] },
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
 items: [{ exercise_id: "", note: "", load: "", load_unit: "kg", sets: "", reps: "", reps_unit: "reps", duration: "", tempo: "", rir: "", rest_per_set: "", intensity: "" }],
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
     blockToCopy.items = blockToCopy.items.map(item => {
         const newItem = { ...item };
         delete newItem.id;
         return newItem;
     });
 }
 newBlocks.splice(index + 1, 0, blockToCopy);
 setData("blocks", newBlocks);
 };

 return (
 <AppLayout title={`Edit Sesi - ${training.group?.name || ''}`}>
 <Head title={`Edit Sesi - ${training.group?.name || ''}`} />
 
 <div className="mb-8 flex items-center justify-between">
 <div>
 <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                                    Edit Sesi Latihan
                                </h2>
                                <p className="text-sm text-zinc-500 mt-1">
                                    Perbarui sesi program latihan untuk{" "}
                                    <span className="text-slate-900 font-bold">{training.group?.name}</span>
                                </p>
 </div>
 <Link
 href={route('admin.group-trainings.show', training.training_group_id)}
 className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
 >
 <ChevronLeft size={16} /> Batal & Kembali
 </Link>
 </div>

 <form onSubmit={submit} className="space-y-8">
 {/* Basic Info */}
 <div className="bg-white p-6 border border-zinc-200 rounded-xl shadow-sm">
 <h3 className="text-lg font-bold text-zinc-900 mb-6">Informasi Dasar</h3>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 <div>
 <label className="block text-[11px] font-bold text-zinc-500 mb-2">Tanggal Sesi</label>
 <input 
 type="date" 
 value={data.date} 
 onChange={(e) => setData('date', e.target.value)}
 className="w-full py-2.5 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none"
 />
 {errors.date && <div className="text-red-500 text-xs mt-1">{errors.date}</div>}
 </div>
 <div>
 <label className="block text-[11px] font-bold text-zinc-500 mb-2">Judul Sesi Latihan <span className="text-red-500">*</span></label>
 <input 
 type="text"
 value={data.name}
 onChange={(e) => setData('name', e.target.value)}
 placeholder="Contoh: Recovery Training"
 className="w-full py-2.5 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none"
 required
 />
 {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
 </div>
 <div>
 <label className="block text-[11px] font-bold text-zinc-500 mb-2">Fokus Latihan</label>
 <input 
 type="text" 
 value={data.training_type} 
 onChange={(e) => setData('training_type', e.target.value)}
 placeholder="e.g. Strength, Recovery..."
 className="w-full py-2.5 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none"
 />
 </div>
 <div>
 <label className="block text-[11px] font-bold text-zinc-500 mb-2">Lokasi <span className="text-red-500">*</span></label>
 <input 
 type="text" 
 value={data.location} 
 onChange={(e) => setData('location', e.target.value)}
 placeholder="e.g. Gym A..."
 className={`w-full py-2.5 px-3 bg-zinc-50 border rounded-lg text-sm text-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none ${errors.location ? 'border-red-300' : 'border-zinc-200'}`}
 />
 {errors.location && <div className="text-red-500 text-xs mt-1">{errors.location}</div>}
 </div>
 <div className="md:col-span-2 lg:col-span-3">
    <div className="flex items-center gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-lg cursor-pointer" onClick={() => setData('is_extra', !data.is_extra)}>
        <input
            type="checkbox"
            checked={data.is_extra}
            onChange={(e) => setData('is_extra', e.target.checked)}
            className="w-4 h-4 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-900"
        />
        <label className="text-sm font-semibold text-zinc-900 cursor-pointer">
            Sesi Tambahan (Turnamen / PR / Latihan Mandiri)
            <span className="block text-xs text-zinc-500 mt-0.5">Sesi ini tidak akan memotong kuota paket latihan.</span>
        </label>
    </div>
 </div>
 <div className="md:col-span-2 lg:col-span-3">
 <label className="block text-[11px] font-bold text-zinc-500 mb-2">Coach Pendamping (Pilih 1 atau 2)</label>
 <div className="flex flex-wrap gap-3">
 {coachesList && coachesList.length > 0 ? coachesList.map(coach => (
 <label key={coach.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${data.coach_ids.includes(coach.id) ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}>
 <input 
 type="checkbox"
 className="hidden"
 checked={data.coach_ids.includes(coach.id)}
 onChange={(e) => {
 if (e.target.checked) {
 if (data.coach_ids.length >= 2) {
 alert("Maksimal memilih 2 pelatih");
 return;
 }
 setData('coach_ids', [...data.coach_ids, coach.id]);
 } else {
 setData('coach_ids', data.coach_ids.filter(id => id !== coach.id));
 }
 }}
 />
 <span className="text-sm font-semibold">{coach.name}</span>
 <span className="text-[10px] opacity-70 bg-black/10 px-1.5 py-0.5 rounded">{coach.role ? coach.role.replace('_', ' ') : 'Coach'}</span>
 </label>
 )) : (
 <div className="text-sm text-zinc-500 italic py-2">Belum ada coach yang ditugaskan untuk atlet ini.</div>
 )}
 </div>
 </div>
 </div>
 </div>

 {/* Editor */}
 <div className="bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
 <div className="p-4 bg-white border-b border-zinc-200 flex justify-between items-center sticky top-0 z-40">
 <h3 className="text-lg font-bold text-zinc-900">Skema & Program Latihan</h3>
 </div>

 <div className="p-6">
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
 <div className="text-center py-16 bg-white border border-zinc-200 border-dashed rounded-xl mt-4">
 <Dumbbell size={32} className="mx-auto text-zinc-300 mb-3" />
 <p className="text-base font-bold text-zinc-900">Belum ada blok program latihan</p>
 <p className="text-sm text-zinc-500 mt-1">Gunakan tombol di bawah untuk mulai menyusun program. Anda bisa menyeret (drag) blok yang telah dibuat untuk mengatur urutannya.</p>
 </div>
 )}

 <div className="mt-8 flex justify-end gap-3">
 <button type="button" onClick={addTextBlock} className="text-sm font-bold bg-orange-50 border border-orange-200 text-orange-500 px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:bg-orange-100 hover:border-orange-300 shadow-sm hover:shadow-md">
 <Type size={16} className="text-orange-500" /> Tambah Catatan Teks
 </button>
 <button type="button" onClick={addPhaseBlock} className="text-sm font-bold bg-orange-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:bg-orange-600 shadow-md shadow-orange-500/20 hover:shadow-lg">
 <Activity size={16} /> Tambah Fase Latihan
 </button>
 </div>
 </div>

 <div className="p-4 bg-white border-t border-zinc-200 flex justify-end">
 <button
 type="submit"
 disabled={processing}
 className="px-8 py-3 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all shadow-md shadow-orange-500/20 disabled:opacity-50"
 >
 {processing ? "MENYIMPAN..." : "SIMPAN PROGRAM SESI INI"}
 </button>
 </div>
 </div>
 </form>

 <ExerciseQuickModal isOpen={isExModalOpen} onClose={() => setIsExModalOpen(false)} />
 </AppLayout>
 );
}
