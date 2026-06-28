import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Dumbbell, Activity, Type } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import PhaseBlock from './Partials/PhaseBlock';
import TextBlock from './Partials/TextBlock';
import ExerciseQuickModal from './Partials/ExerciseQuickModal';

export default function CreateSession({ auth, athlete, exercises = [], packages = [], date, nextSessionNumber }) {
    const { data, setData, post, processing, errors } = useForm({
        date: date || '',
        session_option: 'next',
        custom_session_number: '',
        training_type: '',
        location: '',
        blocks: []
    });

    const [isExModalOpen, setIsExModalOpen] = useState(false);

    const submitSession = (e) => {
        e.preventDefault();
        post(route('admin.individual-trainings.session.store', athlete.id));
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
                items: [{ exercise_id: "", sets: "", reps: "", duration: "", rest: "", intensity: "", notes: "" }],
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
            
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Perancang Sesi Latihan</h1>
                    <p className="text-gray-600">Buat rancangan program latihan untuk {athlete.name} pada {date}.</p>
                </div>
                <Link
                    href={route('admin.individual-trainings.show', athlete.id)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                    <ChevronLeft size={16} /> Batal & Kembali
                </Link>
            </div>

            <form onSubmit={submitSession} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-white p-6 border border-zinc-200 rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-zinc-900 mb-6">Informasi Dasar</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-[11px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">Tanggal Sesi</label>
                            <input 
                                type="date" 
                                value={data.date} 
                                onChange={(e) => setData('date', e.target.value)}
                                className="w-full py-2.5 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none"
                            />
                            {errors.date && <div className="text-red-500 text-xs mt-1">{errors.date}</div>}
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">Opsi Sesi</label>
                            <div className="flex gap-4 items-center h-[42px]">
                                <label className="flex items-center gap-2 text-sm font-semibold text-zinc-900 cursor-pointer">
                                    <input type="radio" value="next" checked={data.session_option === 'next'} onChange={(e) => setData('session_option', e.target.value)} className="text-zinc-900 focus:ring-zinc-900 bg-zinc-100 border-zinc-300" />
                                    Lanjut Sesi {nextSessionNumber}
                                </label>
                                <label className="flex items-center gap-2 text-sm font-semibold text-zinc-900 cursor-pointer">
                                    <input type="radio" value="custom" checked={data.session_option === 'custom'} onChange={(e) => setData('session_option', e.target.value)} className="text-zinc-900 focus:ring-zinc-900 bg-zinc-100 border-zinc-300" />
                                    Custom
                                </label>
                            </div>
                        </div>
                        {data.session_option === 'custom' && (
                            <div>
                                <label className="block text-[11px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">Nomor Sesi Custom</label>
                                <input 
                                    type="number" min="1" 
                                    value={data.custom_session_number} 
                                    onChange={(e) => setData('custom_session_number', e.target.value)}
                                    className="w-full py-2.5 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-[11px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">Jenis Latihan</label>
                            <input 
                                type="text" 
                                value={data.training_type} 
                                onChange={(e) => setData('training_type', e.target.value)}
                                placeholder="e.g. Strength, Recovery..."
                                className="w-full py-2.5 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">Lokasi <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                value={data.location} 
                                onChange={(e) => setData('location', e.target.value)}
                                placeholder="e.g. Gym A..."
                                className={`w-full py-2.5 px-3 bg-zinc-50 border rounded-lg text-sm text-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none ${errors.location ? 'border-red-300' : 'border-zinc-200'}`}
                            />
                            {errors.location && <div className="text-red-500 text-xs mt-1">{errors.location}</div>}
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
                                                                exercises={exercises}
                                                                exercisePackages={packages}
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
                            <button type="button" onClick={addTextBlock} className="text-sm font-bold bg-white border border-zinc-200 text-zinc-900 px-6 py-3 rounded-xl flex items-center gap-2 transition-colors hover:bg-zinc-50 shadow-sm hover:shadow-md">
                                <Type size={16} /> Tambah Catatan Teks
                            </button>
                            <button type="button" onClick={addPhaseBlock} className="text-sm font-bold bg-zinc-900 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:bg-zinc-800 shadow-sm hover:shadow-md">
                                <Activity size={16} /> Tambah Fase Latihan
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-white border-t border-zinc-200 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-3 text-sm font-black text-white bg-[#ff4d00] hover:bg-[#e64500] rounded-xl transition-all shadow-md shadow-[#ff4d00]/20 disabled:opacity-50"
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
