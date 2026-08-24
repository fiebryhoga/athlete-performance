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
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import PhaseBlock from "../IndividualTrainings/Partials/PhaseBlock";
import TextBlock from "../IndividualTrainings/Partials/TextBlock";
import ExerciseQuickModal from "../IndividualTrainings/Partials/ExerciseQuickModal";
import PageHeader from "@/Components/Common/PageHeader";

export default function EditSession({
    training,
    user,
    exercisesList = [],
    packagesList = [],
    coachesList = [],
    group,
    availableAthletes = [],
}) {
    const { data, setData, put, processing, errors, transform } = useForm({
        date: training.date || new Date().toISOString().split("T")[0],
        name: training.name || "",
        training_type: training.training_type || "Strength",
        location: training.location || "Gym",
        coach_ids: training.coach_ids || [],
        attendee_ids: training.attendee_ids || [],
        programs: training.programs || [
            { name: "Program Utama", athlete_ids: null, blocks: [] },
        ],
        is_extra: training.is_extra || false,
    });

    const [isExModalOpen, setIsExModalOpen] = useState(false);
    const [activeProgramIndex, setActiveProgramIndex] = useState(0);
    const [hasSecondaryProgram, setHasSecondaryProgram] = useState(
        data.programs && data.programs.length > 1
    );
    const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
    const [guestSearchQuery, setGuestSearchQuery] = useState("");

    transform((data) => ({
        ...data,
        programs: hasSecondaryProgram
            ? data.programs
            : [{ ...data.programs[0], athlete_ids: null }],
    }));

    const handleSelectAllAthletes = () => {
        const allMemberIds = group?.members?.map((m) => m.id) || [];
        const guestIds = data.attendee_ids.filter((id) => !allMemberIds.includes(id));
        const newIds = [...new Set([...allMemberIds, ...guestIds])];

        let newData = { ...data, attendee_ids: newIds };
        if (hasSecondaryProgram) {
            const newProgs = [...data.programs];
            if (newProgs[1] && newProgs[1].athlete_ids) {
                newProgs[1].athlete_ids = newProgs[1].athlete_ids.filter((id) =>
                    newIds.includes(id)
                );
            }
            if (newProgs[0] && newProgs[0].athlete_ids) {
                newProgs[0].athlete_ids = newIds.filter(
                    (id) => !newProgs[1]?.athlete_ids?.includes(id)
                );
            }
            newData.programs = newProgs;
        }
        setData(newData);
    };

    const handleDeselectAllAthletes = () => {
        let newData = { ...data, attendee_ids: [] };
        if (hasSecondaryProgram) {
            const newProgs = [...data.programs];
            if (newProgs[1]) newProgs[1].athlete_ids = [];
            if (newProgs[0]) newProgs[0].athlete_ids = [];
            newData.programs = newProgs;
        }
        setData(newData);
    };

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.group-trainings.session.update", training.id));
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
        delete blockToCopy.id;
        if (blockToCopy.items) {
            blockToCopy.items = blockToCopy.items.map((item) => {
                const newItem = { ...item };
                delete newItem.id;
                return newItem;
            });
        }
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
            title={`Edit Sesi - ${training.group?.name || ""}`}
            description="Perbarui sesi program latihan grup."
        >
            <Head title={`Edit Sesi - ${training.group?.name || ""}`} />

            <div className="space-y-4 pb-12">
                {/* ─── BREADCRUMB & HEADER ─── */}
                <div className="space-y-1">
                    <Link
                        href={route("admin.group-trainings.show", training.training_group_id || group?.id || 1)}
                        className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors gap-1.5"
                    >
                        <ChevronLeft size={13} /> Kembali ke Kalender Latihan Grup
                    </Link>

                    <PageHeader
                        title="Edit Sesi Latihan"
                        description={`Perbarui sesi program latihan untuk ${training.group?.name || group?.name || ""} pada ${formattedDateStr}.`}
                        actions={
                            <button
                                type="button"
                                onClick={submit}
                                disabled={processing}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold shadow-2xs hover:shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                            >
                                <Save size={13} />
                                <span>{processing ? "Menyimpan..." : "Simpan Perubahan"}</span>
                            </button>
                        }
                    />
                </div>

                <form onSubmit={submit}>
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
                                    {group?.package && (
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
                                        {coachesList && coachesList.length > 0 ? (
                                            coachesList.map((coach) => {
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
                                                            if (hasSecondaryProgram) {
                                                                const newProgs = [...data.programs];
                                                                if (newProgs[1] && newProgs[1].athlete_ids) {
                                                                    newProgs[1].athlete_ids = newProgs[1].athlete_ids.filter((id) =>
                                                                        newIds.includes(id)
                                                                    );
                                                                }
                                                                if (newProgs[0] && newProgs[0].athlete_ids) {
                                                                    newProgs[0].athlete_ids = newIds.filter(
                                                                        (id) => !newProgs[1]?.athlete_ids?.includes(id)
                                                                    );
                                                                }
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
                                                            if (hasSecondaryProgram) {
                                                                const newProgs = [...data.programs];
                                                                if (newProgs[1] && newProgs[1].athlete_ids) {
                                                                    newProgs[1].athlete_ids = newProgs[1].athlete_ids.filter((id) =>
                                                                        newIds.includes(id)
                                                                    );
                                                                }
                                                                if (newProgs[0] && newProgs[0].athlete_ids) {
                                                                    newProgs[0].athlete_ids = newIds.filter(
                                                                        (id) => !newProgs[1]?.athlete_ids?.includes(id)
                                                                    );
                                                                }
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
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                        <Dumbbell size={14} className="text-orange-500" />
                                        <span>Skema & Program Latihan</span>
                                    </h3>
                                    <p className="text-[10.5px] text-slate-400 font-medium mt-0.5">
                                        Atur urutan dan isi rancangan latihan untuk sesi grup ini.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200 hover:bg-slate-100 transition-all select-none">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-orange-500 focus:ring-orange-400 w-3.5 h-3.5"
                                            checked={hasSecondaryProgram}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                setHasSecondaryProgram(isChecked);

                                                const newProgs = [...data.programs];
                                                if (isChecked) {
                                                    if (newProgs.length < 2) {
                                                        newProgs.push({
                                                            name: "Program Sekunder",
                                                            athlete_ids: [],
                                                            blocks: [],
                                                        });
                                                    }
                                                    newProgs[0].athlete_ids = [...data.attendee_ids];
                                                } else {
                                                    setActiveProgramIndex(0);
                                                    newProgs[0].athlete_ids = null;
                                                }
                                                setData("programs", newProgs);
                                            }}
                                        />
                                        <span>Buat 2 Program?</span>
                                    </label>
                                </div>
                            </div>

                            {/* Secondary Program Tabs */}
                            {hasSecondaryProgram && (
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setActiveProgramIndex(0)}
                                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                                            activeProgramIndex === 0
                                                ? "bg-orange-500 text-white font-bold shadow-2xs"
                                                : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
                                        }`}
                                    >
                                        <span>{data.programs[0].name}</span>
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                            activeProgramIndex === 0 ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                                        }`}>
                                            {data.programs[0].athlete_ids ? `${data.programs[0].athlete_ids.length} atlet` : 'Semua'}
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveProgramIndex(1)}
                                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                                            activeProgramIndex === 1
                                                ? "bg-orange-500 text-white font-bold shadow-2xs"
                                                : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
                                        }`}
                                    >
                                        <span>{data.programs[1]?.name || "Program Sekunder"}</span>
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                            activeProgramIndex === 1 ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                                        }`}>
                                            {data.programs[1]?.athlete_ids?.length || 0} atlet
                                        </span>
                                    </button>
                                </div>
                            )}

                            {/* Program Audience for Secondary */}
                            {hasSecondaryProgram && activeProgramIndex === 1 && (
                                <div className="bg-white p-3.5 rounded-md border border-slate-200/80 shadow-2xs space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-800">
                                            Pilih Atlet untuk Program Sekunder
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500">
                                        Atlet terpilih akan menjalankan program sekunder ini dan tidak menjalankan program utama.
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                                        {data.attendee_ids.map((attId) => {
                                            const athlete =
                                                availableAthletes?.find((a) => a.id === attId) ||
                                                group?.members?.find((m) => m.id === attId);
                                            if (!athlete) return null;
                                            const isSelected = data.programs[1]?.athlete_ids?.includes(attId);
                                            return (
                                                <label
                                                    key={attId}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all select-none ${
                                                        isSelected
                                                            ? "bg-orange-500 text-white font-bold shadow-2xs"
                                                            : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={isSelected}
                                                        onChange={(e) => {
                                                            const newProgs = [...data.programs];
                                                            if (!newProgs[1])
                                                                newProgs[1] = {
                                                                    name: "Program Sekunder",
                                                                    athlete_ids: [],
                                                                    blocks: [],
                                                                };
                                                            let newIds = newProgs[1].athlete_ids
                                                                ? [...newProgs[1].athlete_ids]
                                                                : [];
                                                            if (e.target.checked) newIds.push(attId);
                                                            else newIds = newIds.filter((id) => id !== attId);
                                                            newProgs[1].athlete_ids = newIds;

                                                            const allIds = data.attendee_ids;
                                                            newProgs[0].athlete_ids = allIds.filter(
                                                                (id) => !newIds.includes(id)
                                                            );
                                                            setData("programs", newProgs);
                                                        }}
                                                    />
                                                    <span>{athlete.name}</span>
                                                    {isSelected && <Check size={11} strokeWidth={3} />}
                                                </label>
                                            );
                                        })}
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
                                                                    exercises={exercisesList}
                                                                    exercisePackages={packagesList}
                                                                    onChange={(field, val) =>
                                                                        updateBlock(index, field, val)
                                                                    }
                                                                    onRemove={() => removeBlock(index)}
                                                                    onDuplicate={() => duplicateBlock(index)}
                                                                    onOpenExerciseModal={() =>
                                                                        setIsExModalOpen(true)
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
                                <div className="text-center py-12 bg-white border border-slate-200 border-dashed rounded-md">
                                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2.5 border border-slate-100">
                                        <Dumbbell size={18} className="text-slate-400" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-800">
                                        Belum ada blok program latihan
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                                        Tambahkan instruksi catatan teks atau fase latihan menggunakan tombol di bawah.
                                    </p>
                                </div>
                            )}

                            {/* Add Block Buttons */}
                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={addTextBlock}
                                    className="text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3.5 py-1.5 rounded-md flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                                >
                                    <Type size={13} className="text-orange-500" />
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
                                    onClick={submit}
                                    disabled={processing}
                                    className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold shadow-2xs transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Save size={13} />
                                    <span>{processing ? "Menyimpan..." : "Simpan Perubahan"}</span>
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
        </AppLayout>
    );
}
