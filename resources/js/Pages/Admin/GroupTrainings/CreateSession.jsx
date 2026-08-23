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
    const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
    const [guestSearchQuery, setGuestSearchQuery] = useState("");

    const handleSelectAllAthletes = () => {
        const allMemberIds = group?.members?.map(m => m.id) || [];
        const guestIds = data.attendee_ids.filter(id => !allMemberIds.includes(id));
        const newIds = [...new Set([...allMemberIds, ...guestIds])];
        
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
    };

    const handleDeselectAllAthletes = () => {
        let newData = { ...data, attendee_ids: [] };
        if (typeof hasSecondaryProgram !== 'undefined' && hasSecondaryProgram) {
            const newProgs = [...data.programs];
            if (newProgs[1]) newProgs[1].athlete_ids = [];
            if (newProgs[0]) newProgs[0].athlete_ids = [];
            newData.programs = newProgs;
        }
        setData(newData);
    };

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
                {/* Basic Info Container */}
                <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm space-y-8 transition-colors">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#ed4e18]/10 border border-[#ed4e18]/20 flex items-center justify-center text-[#ed4e18] shrink-0 shadow-2xs">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    Informasi Dasar Sesi
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Tentukan jadwal, judul, fokus latihan, dan lokasi pelaksanaan sesi.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Group A: Date, Title, Focus, Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                                <Calendar size={14} className="text-[#ed4e18]" />
                                <span>Tanggal Sesi</span>
                            </label>
                            <input
                                type="date"
                                value={data.date}
                                onChange={(e) =>
                                    setData("date", e.target.value)
                                }
                                className="w-full py-2.5 px-3.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#ed4e18]/25 focus:border-[#ed4e18] outline-none transition-all shadow-2xs"
                            />
                            {errors.date && (
                                <div className="text-rose-500 text-xs mt-1.5 font-semibold">
                                    {errors.date}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                                <span>Judul Sesi Latihan</span>
                                <span className="text-[#ed4e18] font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="Contoh: Recovery Training"
                                className="w-full py-2.5 px-3.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#ed4e18]/25 focus:border-[#ed4e18] outline-none transition-all placeholder:text-slate-400 shadow-2xs"
                                required
                            />
                            {errors.name && (
                                <div className="text-rose-500 text-xs mt-1.5 font-semibold">
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                                <Target size={14} className="text-[#ed4e18]" />
                                <span>Fokus Latihan</span>
                            </label>
                            <input
                                type="text"
                                value={data.training_type}
                                onChange={(e) =>
                                    setData("training_type", e.target.value)
                                }
                                placeholder="Contoh: Strength, Endurance..."
                                className="w-full py-2.5 px-3.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#ed4e18]/25 focus:border-[#ed4e18] outline-none transition-all placeholder:text-slate-400 shadow-2xs"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                                <MapPin size={14} className="text-[#ed4e18]" />
                                <span>Lokasi</span>
                                <span className="text-[#ed4e18] font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.location}
                                onChange={(e) =>
                                    setData("location", e.target.value)
                                }
                                placeholder="Contoh: Gym A, Lapangan Utama..."
                                className={`w-full py-2.5 px-3.5 bg-white border rounded-lg text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#ed4e18]/25 focus:border-[#ed4e18] outline-none transition-all placeholder:text-slate-400 shadow-2xs ${errors.location ? "border-rose-300" : "border-slate-200"}`}
                            />
                            {errors.location && (
                                <div className="text-rose-500 text-xs mt-1.5 font-semibold">
                                    {errors.location}
                                </div>
                            )}
                        </div>

                        {/* Extra Session Banner Card */}
                        <div className="col-span-full pt-2">
                            <div
                                onClick={() => setData('is_extra', !data.is_extra)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                    data.is_extra
                                        ? "bg-[#ed4e18] text-white border-[#ed4e18] shadow-md shadow-[#ed4e18]/20"
                                        : "bg-slate-50/80 text-slate-800 border-slate-200 hover:border-[#ed4e18]/40"
                                }`}
                            >
                                <div className="flex items-start sm:items-center gap-3.5">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm transition-colors ${
                                        data.is_extra
                                            ? "bg-white/20 text-white shadow-2xs"
                                            : "bg-[#ed4e18]/10 text-[#ed4e18] border border-[#ed4e18]/20 shadow-2xs"
                                    }`}>
                                        <Sparkles size={18} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold">
                                                Sesi Tambahan (Turnamen / PR / Latihan Mandiri)
                                            </span>
                                            {data.is_extra && (
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/20">
                                                    Aktif
                                                </span>
                                            )}
                                        </div>
                                        <span className={`block text-xs mt-0.5 ${data.is_extra ? "text-white/90" : "text-slate-500"}`}>
                                            Sesi ini tidak akan memotong kuota paket latihan.
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={data.is_extra}
                                        onChange={(e) => setData('is_extra', e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 text-[#ed4e18] focus:ring-[#ed4e18] pointer-events-none"
                                    />
                                    <span className="text-xs font-semibold select-none">
                                        {data.is_extra ? "Ya, Jadikan Sesi Tambahan" : "Tidak"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Group B: Coach Pendamping */}
                    <div className="pt-6 border-t border-slate-100 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <label className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                                    <UserCheck size={16} className="text-[#ed4e18]" />
                                    <span>Coach Pendamping</span>
                                </label>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Pilih 1 atau maksimal 2 pelatih yang bertugas mendampingi sesi ini.
                                </p>
                            </div>
                            <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#ed4e18]/10 text-[#ed4e18] border border-[#ed4e18]/20 self-start sm:self-center shrink-0">
                                Terpilih: {data.coach_ids.length} / 2 Coach
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {coaches && coaches.length > 0 ? (
                                coaches.map((coach) => {
                                    const isSelected = data.coach_ids.includes(coach.id);
                                    return (
                                        <div
                                            key={coach.id}
                                            onClick={() => {
                                                if (isSelected) {
                                                    setData("coach_ids", data.coach_ids.filter((id) => id !== coach.id));
                                                } else {
                                                    if (data.coach_ids.length >= 2) {
                                                        alert("Maksimal memilih 2 pelatih");
                                                        return;
                                                    }
                                                    setData("coach_ids", [...data.coach_ids, coach.id]);
                                                }
                                            }}
                                            className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                                                isSelected
                                                    ? "bg-[#ed4e18] border-[#ed4e18] text-white shadow-md shadow-[#ed4e18]/20"
                                                    : "bg-white border-slate-200 text-slate-700 hover:bg-[#ed4e18]/5 hover:border-[#ed4e18]/30"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                                                    isSelected
                                                        ? "bg-white/20 text-white"
                                                        : "bg-[#ed4e18]/10 text-[#ed4e18] border border-[#ed4e18]/20"
                                                }`}>
                                                    {coach.name ? coach.name.substring(0, 2).toUpperCase() : "CO"}
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="block text-sm font-bold truncate">
                                                        {coach.name}
                                                    </span>
                                                    <span className={`block text-[11px] font-medium capitalize truncate ${
                                                        isSelected ? "text-white/90" : "text-slate-500"
                                                    }`}>
                                                        {coach.role ? coach.role.replace("_", " ").toLowerCase() : "coach"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-all ${
                                                isSelected
                                                    ? "bg-white text-[#ed4e18] border-white shadow-2xs"
                                                    : "border-slate-300 text-transparent"
                                            }`}>
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-full text-sm text-slate-500 italic py-3 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    Belum ada coach yang ditugaskan untuk atlet ini.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Group C: Attendance & Guest Athletes */}
                    <div className="pt-6 border-t border-slate-100 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <label className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                                    <Users size={16} className="text-[#ed4e18]" />
                                    <span>Daftar Hadir Atlet</span>
                                </label>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Hapus centang pada atlet yang <strong className="text-slate-700 font-semibold">tidak hadir / absen</strong> pada sesi ini agar tidak dimasukkan dalam catatan.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                                <button
                                    type="button"
                                    onClick={handleSelectAllAthletes}
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#ed4e18]/10 hover:bg-[#ed4e18]/20 text-[#ed4e18] transition-colors border border-[#ed4e18]/30 shadow-2xs"
                                >
                                    Pilih Semua ({group?.members?.length || 0})
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeselectAllAthletes}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-500 transition-colors border border-slate-200 shadow-2xs"
                                >
                                    Kosongkan
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
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
                                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl border cursor-pointer transition-all select-none ${
                                                isPresent
                                                    ? "bg-[#ed4e18] border-[#ed4e18] text-white shadow-sm shadow-[#ed4e18]/15"
                                                    : "bg-slate-50/60 border-dashed border-slate-200 text-slate-400 hover:bg-[#ed4e18]/5 hover:border-[#ed4e18]/30 hover:text-slate-600"
                                            }`}
                                        >
                                            <span className={`text-xs font-semibold truncate pr-1 ${!isPresent && "line-through opacity-70"}`}>
                                                {member.name}
                                            </span>
                                            <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 text-[10px] transition-colors ${
                                                isPresent
                                                    ? "bg-white/20 text-white font-bold"
                                                    : "border border-slate-300 text-transparent"
                                            }`}>
                                                {isPresent && "✓"}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-full text-sm text-slate-500 italic py-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    Belum ada anggota di grup ini.
                                </div>
                            )}

                            {/* Render Guests that are selected */}
                            {data.attendee_ids
                                .filter(id => !group?.members?.some(m => m.id === id))
                                .map(guestId => {
                                    const guest = typeof availableAthletes !== 'undefined' ? availableAthletes?.find(a => a.id === guestId) : null;
                                    if (!guest) return null;
                                    return (
                                        <div
                                            key={`guest-${guest.id}`}
                                            onClick={() => {
                                                const newIds = data.attendee_ids.filter(id => id !== guest.id);
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
                                            className="flex items-center justify-between px-3 py-2.5 rounded-xl border cursor-pointer transition-all bg-[#ed4e18] border-[#ed4e18] text-white shadow-sm shadow-[#ed4e18]/20 group/guest select-none"
                                        >
                                            <div className="min-w-0 pr-1">
                                                <span className="block text-xs font-semibold truncate">{guest.name}</span>
                                                <span className="block text-[9px] font-bold text-white/80">TAMU</span>
                                            </div>
                                            <div className="w-5 h-5 rounded hover:bg-white/20 flex items-center justify-center shrink-0 text-xs transition-colors" title="Hapus tamu">
                                                <X size={13} />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>

                        {/* Guest Athlete Dropdown */}
                        {typeof availableAthletes !== 'undefined' && availableAthletes && availableAthletes.filter(a => !group?.members?.some(m => m.id === a.id)).length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#ed4e18]/5 p-4 rounded-xl border border-[#ed4e18]/20 shadow-2xs">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-white border border-[#ed4e18]/20 flex items-center justify-center text-[#ed4e18] shrink-0 shadow-2xs">
                                        <UserPlus size={16} />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-slate-800">Tambah Tamu (Guest Athlete)</span>
                                        <span className="block text-[11px] text-slate-500 mt-0.5">Undang atlet dari luar grup untuk sesi latihan gabungan / make-up</span>
                                    </div>
                                </div>
                                <div className="relative min-w-[280px] self-stretch sm:self-auto">
                                    <button
                                        type="button"
                                        onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                                        className="w-full text-xs font-semibold bg-white border border-slate-200 hover:border-[#ed4e18] text-slate-700 rounded-lg px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs transition-all text-left"
                                    >
                                        <span className="truncate">
                                            {data.attendee_ids.filter(id => !group?.members?.some(m => m.id === id)).length > 0
                                                ? `${data.attendee_ids.filter(id => !group?.members?.some(m => m.id === id)).length} Atlet Tamu Terpilih`
                                                : "+ Pilih & Tambahkan Atlet..."}
                                        </span>
                                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 shrink-0 ${isGuestDropdownOpen ? "rotate-180 text-[#ed4e18]" : ""}`} />
                                    </button>

                                    {isGuestDropdownOpen && (
                                        <>
                                            <div 
                                                className="fixed inset-0 z-40" 
                                                onClick={() => setIsGuestDropdownOpen(false)} 
                                            />
                                            <div className="absolute right-0 left-0 sm:left-auto sm:right-0 sm:w-[320px] top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150 text-left">
                                                <div className="p-2.5 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-10 flex items-center justify-between gap-2">
                                                    <div className="relative flex-1">
                                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                        <input
                                                            type="text"
                                                            placeholder="Cari nama atau cabor..."
                                                            value={guestSearchQuery}
                                                            onChange={(e) => setGuestSearchQuery(e.target.value)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="w-full pl-8 pr-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ed4e18]/25 focus:border-[#ed4e18] transition-all placeholder:text-slate-400 text-slate-800"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsGuestDropdownOpen(false)}
                                                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors shrink-0"
                                                        title="Tutup"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>

                                                <div className="max-h-60 overflow-y-auto p-1.5 space-y-1 divide-y divide-slate-50/80">
                                                    {(() => {
                                                        const externalAthletes = availableAthletes.filter(a => !group?.members?.some(m => m.id === a.id));
                                                        const filteredGuests = externalAthletes.filter(a => {
                                                            if (!guestSearchQuery) return true;
                                                            const q = guestSearchQuery.toLowerCase();
                                                            return (a.name && a.name.toLowerCase().includes(q)) || (a.sport?.name && a.sport.name.toLowerCase().includes(q));
                                                        });

                                                        if (filteredGuests.length === 0) {
                                                            return (
                                                                <div className="py-6 text-center text-xs text-slate-400 italic">
                                                                    {guestSearchQuery ? "Atlet tidak ditemukan." : "Tidak ada atlet luar yang tersedia."}
                                                                </div>
                                                            );
                                                        }

                                                        return filteredGuests.map(guest => {
                                                            const isSelected = data.attendee_ids.includes(guest.id);
                                                            return (
                                                                <div
                                                                    key={`custom-guest-${guest.id}`}
                                                                    onClick={() => {
                                                                        let newIds;
                                                                        if (isSelected) {
                                                                            newIds = data.attendee_ids.filter(id => id !== guest.id);
                                                                        } else {
                                                                            newIds = [...data.attendee_ids, guest.id];
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
                                                                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all select-none ${
                                                                        isSelected
                                                                            ? "bg-[#ed4e18]/10 text-[#ed4e18] font-bold"
                                                                            : "hover:bg-slate-50 text-slate-700 font-medium"
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                                                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border text-[10px] transition-colors ${
                                                                            isSelected
                                                                                ? "bg-[#ed4e18] border-[#ed4e18] text-white font-bold"
                                                                                : "border-slate-300 bg-white text-transparent"
                                                                        }`}>
                                                                            {isSelected && "✓"}
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <span className="block text-xs truncate">{guest.name}</span>
                                                                            <span className={`block text-[10px] font-normal truncate ${isSelected ? "text-[#ed4e18]/80" : "text-slate-400"}`}>
                                                                                {guest.sport?.name || 'Atlet'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    {isSelected && (
                                                                        <span className="text-[9px] bg-[#ed4e18] text-white px-1.5 py-0.5 rounded font-bold shrink-0 shadow-2xs">
                                                                            TERPILIH
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            );
                                                        });
                                                    })()}
                                                </div>
                                                
                                                <div className="p-2 border-t border-slate-100 bg-slate-50/60 flex justify-between items-center text-[11px] text-slate-500">
                                                    <span>Bisa pilih &gt; 1 atlet sekaligus</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsGuestDropdownOpen(false)}
                                                        className="font-bold text-[#ed4e18] hover:underline px-2 py-0.5"
                                                    >
                                                        Selesai
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Editor Container */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-colors">
                    <div className="p-5 bg-white border-b border-slate-200 sticky top-0 z-40">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#ed4e18]/10 border border-[#ed4e18]/20 flex items-center justify-center text-[#ed4e18] shrink-0 shadow-2xs">
                                    <Dumbbell className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Skema & Program Latihan
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Atur urutan dan isi rancangan latihan untuk sesi ini.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-all select-none shadow-2xs">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-slate-300 text-[#ed4e18] focus:ring-[#ed4e18]"
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
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 text-xs font-bold text-white bg-[#ed4e18] hover:bg-[#d64312] rounded-lg transition-all shadow-md shadow-[#ed4e18]/25 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                                >
                                    {processing ? "MENYIMPAN..." : "Simpan Program"}
                                </button>
                            </div>
                        </div>
                        
                        {hasSecondaryProgram && (
                            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pt-1 pb-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveProgramIndex(0)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeProgramIndex === 0 ? 'bg-[#ed4e18] text-white shadow-md shadow-[#ed4e18]/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    {data.programs[0].name}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveProgramIndex(1)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeProgramIndex === 1 ? 'bg-[#ed4e18] text-white shadow-md shadow-[#ed4e18]/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    {data.programs[1]?.name || 'Program Sekunder'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="p-6 md:p-8">
                        {/* Program Settings (Audience) */}
                        {hasSecondaryProgram && activeProgramIndex === 1 && (
                            <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                                <label className="block text-sm font-bold text-slate-800 mb-1">Pilih Atlet untuk Program Sekunder</label>
                                <p className="text-xs text-slate-500 mb-3">Atlet yang dipilih akan menjalankan program ini dan TIDAK menjalankan Program Utama.</p>
                                <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                                    {data.attendee_ids.map(attId => {
                                        const athlete = (typeof availableAthletes !== 'undefined' ? availableAthletes.find(a => a.id === attId) : null) || (typeof group !== 'undefined' ? group?.members?.find(m => m.id === attId) : null);
                                        if (!athlete) return null;
                                        const isSelected = data.programs[1]?.athlete_ids?.includes(attId);
                                        return (
                                            <label key={attId} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all select-none ${isSelected ? 'bg-[#ed4e18] border-[#ed4e18] text-white shadow-sm shadow-[#ed4e18]/20' : 'bg-white border-slate-200 text-slate-600 hover:bg-[#ed4e18]/5 hover:border-[#ed4e18]/30'}`}>
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
                            <div className="mb-6 bg-[#ed4e18]/5 p-4 rounded-xl border border-[#ed4e18]/20 shadow-2xs">
                                <p className="text-sm font-bold text-[#ed4e18]">Informasi Program Utama</p>
                                <p className="text-xs text-slate-600 mt-1">Program ini akan diterapkan ke semua atlet dalam sesi ini, <strong className="font-bold text-slate-800">KECUALI</strong> atlet yang sudah Anda centang di tab <strong className="font-bold text-slate-800">Program Sekunder</strong>.</p>
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
                                <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
                                    <Dumbbell
                                        size={24}
                                        className="text-slate-400"
                                    />
                                </div>
                                <p className="text-base font-bold text-slate-800">
                                    Belum ada blok program latihan
                                </p>
                                <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                                    Gunakan tombol di bawah untuk mulai menyusun program. Anda bisa menyeret (drag) blok yang telah dibuat untuk mengatur urutannya.
                                </p>
                            </div>
                        )}

                        <div className="mt-8 flex flex-wrap justify-end gap-3">
                            <button
                                type="button"
                                onClick={addTextBlock}
                                className="text-xs font-bold bg-white border border-[#ed4e18]/30 text-[#ed4e18] px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all hover:bg-[#ed4e18]/5 shadow-2xs hover:shadow-sm"
                            >
                                <Type size={15} className="text-[#ed4e18]" />
                                <span>Tambah Catatan Teks</span>
                            </button>
                            <button
                                type="button"
                                onClick={addPhaseBlock}
                                className="text-xs font-bold bg-[#ed4e18] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all hover:bg-[#d64312] shadow-md shadow-[#ed4e18]/20 hover:shadow-lg"
                            >
                                <Activity size={15} />
                                <span>Tambah Fase Latihan</span>
                            </button>
                        </div>
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
