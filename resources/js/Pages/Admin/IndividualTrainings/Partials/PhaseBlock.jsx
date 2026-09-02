import React from "react";
import {
    GripVertical,
    Trash2,
    Plus,
    Dumbbell,
    Info,
    Search,
    Copy,
    Flame,
    Activity,
    HeartPulse,
    Sparkles,
    CheckCircle2,
    Layers,
    UserCheck,
} from "lucide-react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import ExerciseSelect from "./ExerciseSelect";

export default function PhaseBlock({
    block,
    blockIndex,
    exercises,
    exercisePackages,
    onChange,
    dragHandleProps,
    onOpenExerciseModal,
    onRemove,
    onDuplicate,
    isGlobalSimpleMode = true,
}) {
    const [showAdvanced, setShowAdvanced] = React.useState(false);
    const isSimple = isGlobalSimpleMode && !showAdvanced;

    const categories = [
        { id: "warm_up", label: "Warm Up", columns: "medium", icon: Flame },
        {
            id: "mobility",
            label: "Mobility Exercise",
            columns: "medium",
            icon: Activity,
        },
        {
            id: "activation",
            label: "Muscle Activation",
            columns: "medium",
            icon: Sparkles,
        },
        {
            id: "strength_training",
            label: "Strength Training",
            columns: "full",
            icon: Dumbbell,
        },
        {
            id: "stretching",
            label: "Free Individual Stretching",
            columns: "note_only",
            icon: HeartPulse,
        },
        {
            id: "interval",
            label: "Interval Training",
            columns: "cardio",
            icon: Activity,
        },
        {
            id: "free_strength",
            label: "Free Individual Strength",
            columns: "note_only",
            icon: Dumbbell,
        },
        {
            id: "cardio",
            label: "Cardio Endurance",
            columns: "cardio",
            icon: HeartPulse,
        },
    ];

    const currentCat =
        categories.find((c) => c.id === block.category) || categories[0];
    const CategoryIcon = currentCat.icon || Layers;

    const [isPackageModalOpen, setIsPackageModalOpen] = React.useState(false);
    const [packageSearch, setPackageSearch] = React.useState("");
    const packageDropdownRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                packageDropdownRef.current &&
                !packageDropdownRef.current.contains(event.target)
            ) {
                setIsPackageModalOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredPackages = React.useMemo(() => {
        if (!exercisePackages) return [];
        if (!packageSearch) return exercisePackages;
        return exercisePackages.filter((pkg) =>
            pkg.name.toLowerCase().includes(packageSearch.toLowerCase()),
        );
    }, [exercisePackages, packageSearch]);

    const addItem = () => {
        const newItem = {
            exercise_id: "",
            note: "",
            load: "",
            load_unit: "kg",
            sets: "1",
            reps: "",
            reps_unit: "reps",
            duration: "",
            tempo: "",
            rir: "",
            rest_per_set: "",
            intensity: "",
        };
        onChange("items", [...block.items, newItem]);
    };

    const addPackage = (pkgId) => {
        const pkg = exercisePackages.find((p) => p.id == pkgId);
        if (!pkg) return;
        const newItems = pkg.exercises.map((ex) => ({
            exercise_id: ex.id,
            note: "",
            load: "",
            load_unit: "kg",
            sets: "3",
            reps: "",
            reps_unit: "reps",
            duration: "",
            tempo: "",
            rir: "",
            rest_per_set: "",
            intensity: "",
        }));
        onChange("items", [...block.items, ...newItems]);
        setIsPackageModalOpen(false);
    };

    const updateItem = (index, field, val) => {
        const newItems = [...block.items];
        newItems[index][field] = val;
        onChange("items", newItems);
    };

    const updateItemArray = (index, field, arrayIndex, val) => {
        const newItems = [...block.items];
        const arr = Array.isArray(newItems[index][field])
            ? [...newItems[index][field]]
            : [];
        arr[arrayIndex] = val;
        newItems[index][field] = arr;
        onChange("items", newItems);
    };

    const applyToAllSets = (index, field, setsCount) => {
        const newItems = [...block.items];
        const val =
            newItems[index][field]?.[0] !== undefined
                ? newItems[index][field][0]
                : newItems[index][field.replace("_array", "")] || "";

        if (val === undefined || val === "") return;

        const arr = [];
        for (let i = 0; i < setsCount; i++) {
            arr.push(val);
        }
        newItems[index][field] = arr;
        onChange("items", newItems);
    };

    const removeItem = (index) => {
        const newItems = [...block.items];
        newItems.splice(index, 1);
        onChange("items", newItems);
    };

    const duplicateItem = (index) => {
        const newItems = [...block.items];
        const itemToCopy = JSON.parse(JSON.stringify(newItems[index]));
        delete itemToCopy.id;
        newItems.splice(index + 1, 0, itemToCopy);
        onChange("items", newItems);
    };

    const handleKeyDown = (e) => {
        if (
            !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
        )
            return;
        if (e.target.tagName !== "INPUT") return;

        const input = e.target;
        if (e.key === "ArrowLeft" && input.selectionStart > 0) return;
        if (
            e.key === "ArrowRight" &&
            input.selectionEnd < (input.value?.length || 0)
        )
            return;

        const tr = input.closest("tr");
        const tbody = input.closest("tbody");
        if (!tr || !tbody) return;

        const rowInputs = Array.from(
            tr.querySelectorAll('input:not([type="hidden"]):not(:disabled)'),
        );
        const colIndex = rowInputs.indexOf(input);
        if (colIndex === -1) return;

        let targetInput = null;
        if (e.key === "ArrowLeft" && colIndex > 0) {
            targetInput = rowInputs[colIndex - 1];
        } else if (e.key === "ArrowRight" && colIndex < rowInputs.length - 1) {
            targetInput = rowInputs[colIndex + 1];
        } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            const rows = Array.from(tbody.querySelectorAll("tr"));
            const rowIndex = rows.indexOf(tr);
            if (e.key === "ArrowUp" && rowIndex > 0) {
                const prevRowInputs = Array.from(
                    rows[rowIndex - 1].querySelectorAll(
                        'input:not([type="hidden"]):not(:disabled)',
                    ),
                );
                targetInput =
                    prevRowInputs[colIndex] ||
                    prevRowInputs[prevRowInputs.length - 1];
            } else if (e.key === "ArrowDown" && rowIndex < rows.length - 1) {
                const nextRowInputs = Array.from(
                    rows[rowIndex + 1].querySelectorAll(
                        'input:not([type="hidden"]):not(:disabled)',
                    ),
                );
                targetInput =
                    nextRowInputs[colIndex] ||
                    nextRowInputs[nextRowInputs.length - 1];
            }
        }

        if (targetInput) {
            e.preventDefault();
            targetInput.focus();
            setTimeout(() => {
                if (
                    targetInput.type === "text" ||
                    targetInput.type === "number"
                )
                    targetInput.select();
            }, 0);
        }
    };

    const inputStyle =
        "w-full h-7 px-2 rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-800 shadow-2xs focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none transition-all text-center placeholder:text-slate-400 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed";

    return (
        <div className="rounded-md border border-slate-200/90 bg-white shadow-2xs mb-4 overflow-hidden group/phase">
            {/* Header Banner - Clean Minimalist Theme */}
            <div className="bg-slate-50/80 border-b border-slate-200/90 p-3 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 flex-1 w-full">
                    <div
                        {...dragHandleProps}
                        className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 transition-colors p-1 rounded hover:bg-slate-200/60 shrink-0"
                        title="Tahan dan geser untuk memindahkan fase"
                    >
                        <GripVertical size={16} />
                    </div>

                    <div className="w-6 h-6 rounded-md bg-orange-50 text-orange-600 border border-orange-200/60 flex items-center justify-center shrink-0 shadow-2xs">
                        <CategoryIcon size={13} />
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1 max-w-xl">
                        <select
                            className="h-8 py-1 pl-2.5 pr-7 rounded-md border border-slate-200 bg-white text-xs font-bold text-slate-800 shadow-2xs focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 transition-all cursor-pointer leading-normal"
                            value={block.category}
                            onChange={(e) => onChange("category", e.target.value)}
                        >
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Judul fase (Opsional)..."
                            className="h-8 py-1 w-full rounded-md text-xs text-slate-800 border border-slate-200 focus:border-orange-400 focus:bg-white bg-white px-2.5 font-semibold transition-all placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-400 shadow-2xs leading-normal"
                            value={block.title || ""}
                            onChange={(e) => onChange("title", e.target.value)}
                            title="Jika dikosongkan, nama kategori di atas akan digunakan sebagai judul"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
                    <div className="relative flex items-center">
                        <div className="absolute left-2.5 pointer-events-none text-slate-400">
                            <UserCheck size={12} />
                        </div>
                        <select
                            className="h-8 pl-7 pr-8 py-1 rounded-md border border-slate-200 bg-white text-[11px] font-semibold text-slate-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 transition-all cursor-pointer leading-normal"
                            value={block.target_filled_by || "admin"}
                            onChange={(e) => onChange("target_filled_by", e.target.value)}
                            title="Tentukan siapa yang wajib mengisi target beban & reps pada sesi ini"
                        >
                            <option value="admin">Target Diisi Coach</option>
                            <option value="athlete">Target Diisi Atlet</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                        <button
                            type="button"
                            onClick={onDuplicate}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Duplikat Fase Ini"
                        >
                            <Copy size={13} />
                        </button>
                        <button
                            type="button"
                            onClick={onRemove}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Hapus Fase Ini"
                        >
                            <Trash2 size={13} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Exercise List Content */}
            <div className="p-3 bg-slate-50/30">
                {currentCat.columns !== "note_only" ? (
                    <div>
                        <Droppable
                            droppableId={`phase-items-${blockIndex}`}
                            type="exercise"
                        >
                            {(provided) => (
                                <div
                                    className="flex flex-col gap-3"
                                    onKeyDown={handleKeyDown}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {block.items.map((item, iIndex) => {
                                        const exData = exercises.find(
                                            (ex) => ex.id == item.exercise_id,
                                        );
                                        const imagesRaw = exData?.images || [];
                                        const images =
                                            typeof imagesRaw === "string"
                                                ? (() => {
                                                      try {
                                                          return JSON.parse(
                                                              imagesRaw,
                                                          );
                                                      } catch (e) {
                                                          return [];
                                                      }
                                                  })()
                                                : Array.isArray(imagesRaw)
                                                  ? imagesRaw
                                                  : [];

                                        const getImageUrl = (path) => {
                                            if (!path) return "";
                                            if (path.startsWith("http"))
                                                return path;
                                            if (path.startsWith("/storage/"))
                                                return path;
                                            return `/storage/${path}`;
                                        };

                                        const setsCount = Math.max(
                                            0,
                                            Number(item.sets) || 0,
                                        );

                                        return (
                                            <Draggable
                                                key={`exercise-${blockIndex}-${iIndex}`}
                                                draggableId={`exercise-${blockIndex}-${iIndex}`}
                                                index={iIndex}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`group flex flex-col bg-white border rounded-md overflow-visible transition-all ${
                                                            snapshot.isDragging
                                                                ? "border-orange-500 shadow-xl ring-2 ring-orange-500/20 z-50 scale-[1.01]"
                                                                : "border-slate-200/90 shadow-2xs hover:border-slate-300"
                                                        }`}
                                                        style={
                                                            provided
                                                                .draggableProps
                                                                .style
                                                        }
                                                    >
                                                        {/* Top Exercise Card Header */}
                                                        <div className="p-2.5 bg-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2.5 rounded-t-md">
                                                            <div className="flex items-center gap-2.5 w-full lg:w-[45%]">
                                                                <div
                                                                    {...provided.dragHandleProps}
                                                                    className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors shrink-0"
                                                                >
                                                                    <GripVertical
                                                                        size={16}
                                                                    />
                                                                </div>

                                                                <span className="w-5 h-5 rounded bg-slate-100 font-bold text-[11px] text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                                                                    {iIndex + 1}
                                                                </span>

                                                                <div className="flex-1 min-w-[180px]">
                                                                    <ExerciseSelect
                                                                        value={
                                                                            item.exercise_id
                                                                        }
                                                                        options={
                                                                            exercises
                                                                        }
                                                                        onChange={(
                                                                            val,
                                                                        ) =>
                                                                            updateItem(
                                                                                iIndex,
                                                                                "exercise_id",
                                                                                val,
                                                                            )
                                                                        }
                                                                    />
                                                                </div>

                                                                {images.length >
                                                                    0 && (
                                                                    <div className="flex -space-x-1 shrink-0">
                                                                        {images
                                                                            .slice(
                                                                                0,
                                                                                2,
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    img,
                                                                                    idx,
                                                                                ) => (
                                                                                    <a
                                                                                        key={
                                                                                            idx
                                                                                        }
                                                                                        href={getImageUrl(
                                                                                            img,
                                                                                        )}
                                                                                        target="_blank"
                                                                                        rel="noreferrer"
                                                                                        className="relative z-10 hover:z-20 transition-transform hover:scale-110 block"
                                                                                    >
                                                                                        <img
                                                                                            src={getImageUrl(
                                                                                                img,
                                                                                            )}
                                                                                            className="h-7 w-7 rounded-md border border-white object-cover shadow-2xs"
                                                                                            alt="asset"
                                                                                        />
                                                                                    </a>
                                                                                ),
                                                                            )}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-100">
                                                                {/* Sets Pill Input */}
                                                                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-1 focus-within:ring-orange-400 transition-all">
                                                                    <span className="text-[10px] font-bold text-slate-400">
                                                                        Sets
                                                                    </span>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        max="50"
                                                                        className="w-8 text-center font-bold text-xs text-slate-800 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                                                                        value={
                                                                            item.sets ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateItem(
                                                                                iIndex,
                                                                                "sets",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        placeholder="-"
                                                                    />
                                                                </div>

                                                                {/* Note Pill Input */}
                                                                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 flex-1 lg:w-[220px] focus-within:border-orange-400 focus-within:bg-white focus-within:ring-1 focus-within:ring-orange-400 transition-all">
                                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                                        Note
                                                                    </span>
                                                                    <input
                                                                        type="text"
                                                                        className="w-full font-medium text-xs text-slate-700 placeholder:text-slate-400 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                                                                        value={
                                                                            item.note ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateItem(
                                                                                iIndex,
                                                                                "note",
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        placeholder="Instruksi tambahan..."
                                                                    />
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        duplicateItem(
                                                                            iIndex,
                                                                        )
                                                                    }
                                                                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors shrink-0 cursor-pointer"
                                                                    title="Duplikat Latihan Ini"
                                                                >
                                                                    <Copy
                                                                        size={13}
                                                                    />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeItem(
                                                                            iIndex,
                                                                        )
                                                                    }
                                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors shrink-0 cursor-pointer"
                                                                    title="Hapus Latihan Ini"
                                                                >
                                                                    <Trash2
                                                                        size={13}
                                                                    />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Sleek Set Cards Layout */}
                                                        {setsCount > 0 && (
                                                            <div className="border-t border-slate-100 bg-slate-50/50 p-2.5 rounded-b-md">
                                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                                        <Layers
                                                                            size={12}
                                                                            className="text-orange-500"
                                                                        />
                                                                        <span>
                                                                            Target
                                                                            Per
                                                                            Set
                                                                            (
                                                                            {
                                                                                setsCount
                                                                            }{" "}
                                                                            Set)
                                                                        </span>
                                                                    </div>
                                                                    {block.target_filled_by !==
                                                                        "athlete" && (
                                                                        <span className="text-[10px] text-slate-400 italic">
                                                                            Klik "Copy all" pada Set 1 untuk menyalin ke semua set
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <div className="flex flex-wrap gap-2">
                                                                    {Array.from(
                                                                        {
                                                                            length: setsCount,
                                                                        },
                                                                    ).map(
                                                                        (
                                                                            _,
                                                                            setIdx,
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    setIdx
                                                                                }
                                                                                className="flex flex-col gap-2 p-2.5 bg-white border border-slate-200/90 rounded-md shadow-2xs hover:border-slate-300 transition-all min-w-[150px] flex-1 max-w-[220px]"
                                                                            >
                                                                                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded font-bold text-[10px] bg-orange-50 text-orange-700 border border-orange-200/50">
                                                                                        SET{" "}
                                                                                        {setIdx +
                                                                                            1}
                                                                                    </span>
                                                                                    <span className="text-[10px] font-semibold text-slate-400">
                                                                                        {block.target_filled_by ===
                                                                                        "athlete"
                                                                                            ? "Diisi Atlet"
                                                                                            : "Target"}
                                                                                    </span>
                                                                                </div>

                                                                                <div className="flex flex-col gap-2.5">
                                                                                    {currentCat.columns ===
                                                                                    "cardio" ? (
                                                                                        <>
                                                                                            {/* Distance */}
                                                                                            <div className="flex flex-col gap-1">
                                                                                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                                                                                                    <span>
                                                                                                        Distance
                                                                                                        (m)
                                                                                                    </span>
                                                                                                    {setIdx ===
                                                                                                        0 &&
                                                                                                        block.target_filled_by !==
                                                                                                            "athlete" && (
                                                                                                            <button
                                                                                                                type="button"
                                                                                                                onClick={() =>
                                                                                                                    applyToAllSets(
                                                                                                                        iIndex,
                                                                                                                        "distance_array",
                                                                                                                        setsCount,
                                                                                                                    )
                                                                                                                }
                                                                                                                className="text-slate-400 hover:text-[#ed4e18] transition-colors flex items-center gap-0.5 text-[10px]"
                                                                                                                title="Salin isi ke seluruh set"
                                                                                                            >
                                                                                                                <Copy
                                                                                                                    size={
                                                                                                                        11
                                                                                                                    }
                                                                                                                />
                                                                                                                <span>
                                                                                                                    Copy all                                                                                                                </span>
                                                                                                            </button>
                                                                                                        )}
                                                                                                </div>
                                                                                                <input
                                                                                                    type="number"
                                                                                                    min="0"
                                                                                                    step="0.1"
                                                                                                    className={
                                                                                                        inputStyle
                                                                                                    }
                                                                                                    value={
                                                                                                        block.target_filled_by ===
                                                                                                        "athlete"
                                                                                                            ? ""
                                                                                                            : (item
                                                                                                                  .distance_array?.[
                                                                                                                  setIdx
                                                                                                              ] ??
                                                                                                              (item.distance ||
                                                                                                                  ""))
                                                                                                    }
                                                                                                    onChange={(
                                                                                                        e,
                                                                                                    ) =>
                                                                                                        updateItemArray(
                                                                                                            iIndex,
                                                                                                            "distance_array",
                                                                                                            setIdx,
                                                                                                            e
                                                                                                                .target
                                                                                                                .value,
                                                                                                        )
                                                                                                    }
                                                                                                    disabled={
                                                                                                        block.target_filled_by ===
                                                                                                        "athlete"
                                                                                                    }
                                                                                                    placeholder={
                                                                                                        block.target_filled_by ===
                                                                                                        "athlete"
                                                                                                            ? "Diisi Atlet"
                                                                                                            : "e.g. 5000"
                                                                                                    }
                                                                                                />
                                                                                            </div>

                                                                                            {/* Time / Reps */}
                                                                                            <div className="flex flex-col gap-1">
                                                                                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                                                                                                    <span>
                                                                                                        Time
                                                                                                        /
                                                                                                        Reps
                                                                                                    </span>
                                                                                                    {setIdx ===
                                                                                                        0 &&
                                                                                                        block.target_filled_by !==
                                                                                                            "athlete" && (
                                                                                                            <button
                                                                                                                type="button"
                                                                                                                onClick={() =>
                                                                                                                    applyToAllSets(
                                                                                                                        iIndex,
                                                                                                                        "reps_array",
                                                                                                                        setsCount,
                                                                                                                    )
                                                                                                                }
                                                                                                                className="text-slate-400 hover:text-[#ed4e18] transition-colors flex items-center gap-0.5 text-[10px]"
                                                                                                                title="Salin isi ke seluruh set"
                                                                                                            >
                                                                                                                <Copy
                                                                                                                    size={
                                                                                                                        11
                                                                                                                    }
                                                                                                                />{" "}
                                                                                                                <span>
                                                                                                                    Copy all
                                                                                                                </span>
                                                                                                            </button>
                                                                                                        )}
                                                                                                </div>
                                                                                                <div className="flex gap-1.5">
                                                                                                    <input
                                                                                                        type="number"
                                                                                                        min="0"
                                                                                                        step="any"
                                                                                                        className={
                                                                                                            inputStyle
                                                                                                        }
                                                                                                        value={
                                                                                                            block.target_filled_by ===
                                                                                                            "athlete"
                                                                                                                ? ""
                                                                                                                : (item
                                                                                                                      .reps_array?.[
                                                                                                                      setIdx
                                                                                                                  ] ??
                                                                                                                  (item.reps ||
                                                                                                                      item.minutes ||
                                                                                                                      ""))
                                                                                                        }
                                                                                                        onChange={(
                                                                                                            e,
                                                                                                        ) =>
                                                                                                            updateItemArray(
                                                                                                                iIndex,
                                                                                                                "reps_array",
                                                                                                                setIdx,
                                                                                                                e
                                                                                                                    .target
                                                                                                                    .value,
                                                                                                            )
                                                                                                        }
                                                                                                        disabled={
                                                                                                            block.target_filled_by ===
                                                                                                            "athlete"
                                                                                                        }
                                                                                                        placeholder={
                                                                                                            block.target_filled_by ===
                                                                                                            "athlete"
                                                                                                                ? "Diisi Atlet"
                                                                                                                : "e.g. 30"
                                                                                                        }
                                                                                                    />
                                                                                                    {setIdx ===
                                                                                                    0 ? (
                                                                                                        <select
                                                                                                            className="h-8 w-[65px] py-0 pl-1.5 pr-4 rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-700 text-[11px] leading-normal shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#ed4e18]/20 focus:border-[#ed4e18] shrink-0"
                                                                                                            value={
                                                                                                                item.reps_unit ||
                                                                                                                "minutes"
                                                                                                            }
                                                                                                            onChange={(
                                                                                                                e,
                                                                                                            ) =>
                                                                                                                updateItem(
                                                                                                                    iIndex,
                                                                                                                    "reps_unit",
                                                                                                                    e
                                                                                                                        .target
                                                                                                                        .value,
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            <option value="seconds">
                                                                                                                Secs
                                                                                                            </option>
                                                                                                            <option value="minutes">
                                                                                                                Mins
                                                                                                            </option>
                                                                                                            <option value="hours">
                                                                                                                Hours
                                                                                                            </option>
                                                                                                        </select>
                                                                                                    ) : (
                                                                                                        <div className="h-8 w-[65px] flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-bold text-slate-500 shrink-0 leading-normal">
                                                                                                            {item.reps_unit ||
                                                                                                                "minutes"}
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>

                                                                                            {/* Rest */}
                                                                                            <div className="flex flex-col gap-1">
                                                                                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                                                                                                    <span>
                                                                                                        Rest
                                                                                                    </span>
                                                                                                    {setIdx ===
                                                                                                        0 && (
                                                                                                        <button
                                                                                                            type="button"
                                                                                                            onClick={() =>
                                                                                                                applyToAllSets(
                                                                                                                    iIndex,
                                                                                                                    "rest_per_set_array",
                                                                                                                    setsCount,
                                                                                                                )
                                                                                                            }
                                                                                                            className="text-slate-400 hover:text-[#ed4e18] transition-colors flex items-center gap-0.5 text-[10px]"
                                                                                                            title="Salin isi ke seluruh set"
                                                                                                        >
                                                                                                            <Copy
                                                                                                                size={
                                                                                                                    11
                                                                                                                }
                                                                                                            />{" "}
                                                                                                            <span>
                                                                                                                Copy
                                                                                                                all
                                                                                                            </span>
                                                                                                        </button>
                                                                                                    )}
                                                                                                </div>
                                                                                                <input
                                                                                                    type="text"
                                                                                                    className={
                                                                                                        inputStyle
                                                                                                    }
                                                                                                    value={
                                                                                                        item
                                                                                                            .rest_per_set_array?.[
                                                                                                            setIdx
                                                                                                        ] ??
                                                                                                        (item.rest_per_set ||
                                                                                                            "")
                                                                                                    }
                                                                                                    onChange={(
                                                                                                        e,
                                                                                                    ) =>
                                                                                                        updateItemArray(
                                                                                                            iIndex,
                                                                                                            "rest_per_set_array",
                                                                                                            setIdx,
                                                                                                            e
                                                                                                                .target
                                                                                                                .value,
                                                                                                        )
                                                                                                    }
                                                                                                    placeholder="e.g. 60s"
                                                                                                />
                                                                                            </div>
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            {currentCat.columns ===
                                                                                                "full" && (
                                                                                                <div className="flex flex-col gap-1">
                                                                                                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                                                                                                        <span>
                                                                                                            Load
                                                                                                        </span>
                                                                                                        {setIdx ===
                                                                                                            0 &&
                                                                                                            block.target_filled_by !==
                                                                                                                "athlete" && (
                                                                                                                <button
                                                                                                                    type="button"
                                                                                                                    onClick={() =>
                                                                                                                        applyToAllSets(
                                                                                                                            iIndex,
                                                                                                                            "load_array",
                                                                                                                            setsCount,
                                                                                                                        )
                                                                                                                    }
                                                                                                                    className="text-slate-400 hover:text-[#ed4e18] transition-colors flex items-center gap-0.5 text-[10px]"
                                                                                                                    title="Salin isi ke seluruh set"
                                                                                                                >
                                                                                                                    <Copy
                                                                                                                        size={
                                                                                                                            11
                                                                                                                        }
                                                                                                                    />{" "}
                                                                                                                    <span>
                                                                                                                        Copy
                                                                                                                        all
                                                                                                                    </span>
                                                                                                                </button>
                                                                                                            )}
                                                                                                    </div>
                                                                                                    <div className="flex gap-1.5">
                                                                                                        <input
                                                                                                            type="number"
                                                                                                            min="0"
                                                                                                            step="any"
                                                                                                            className={
                                                                                                                inputStyle
                                                                                                            }
                                                                                                            value={
                                                                                                                block.target_filled_by ===
                                                                                                                "athlete"
                                                                                                                    ? ""
                                                                                                                    : (item
                                                                                                                          .load_array?.[
                                                                                                                          setIdx
                                                                                                                      ] ??
                                                                                                                      (item.load ||
                                                                                                                          ""))
                                                                                                            }
                                                                                                            onChange={(
                                                                                                                e,
                                                                                                            ) =>
                                                                                                                updateItemArray(
                                                                                                                    iIndex,
                                                                                                                    "load_array",
                                                                                                                    setIdx,
                                                                                                                    e
                                                                                                                        .target
                                                                                                                        .value,
                                                                                                                )
                                                                                                            }
                                                                                                            disabled={
                                                                                                                block.target_filled_by ===
                                                                                                                "athlete"
                                                                                                            }
                                                                                                            placeholder={
                                                                                                                block.target_filled_by ===
                                                                                                                "athlete"
                                                                                                                    ? "Diisi Atlet"
                                                                                                                    : "-"
                                                                                                            }
                                                                                                        />
                                                                                                        {setIdx ===
                                                                                                        0 ? (
                                                                                                            <select
                                                                                                                className="h-8 w-[56px] py-0 pl-1.5 pr-4 rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-700 text-[11px] leading-normal shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#ed4e18]/20 focus:border-[#ed4e18] shrink-0"
                                                                                                                value={
                                                                                                                    item.load_unit ||
                                                                                                                    "kg"
                                                                                                                }
                                                                                                                onChange={(
                                                                                                                    e,
                                                                                                                ) =>
                                                                                                                    updateItem(
                                                                                                                        iIndex,
                                                                                                                        "load_unit",
                                                                                                                        e
                                                                                                                            .target
                                                                                                                            .value,
                                                                                                                    )
                                                                                                                }
                                                                                                            >
                                                                                                                <option value="kg">
                                                                                                                    kg
                                                                                                                </option>
                                                                                                                <option value="lbs">
                                                                                                                    lbs
                                                                                                                </option>
                                                                                                                <option value="bw">
                                                                                                                    bw
                                                                                                                </option>
                                                                                                            </select>
                                                                                                        ) : (
                                                                                                            <div className="h-8 w-[56px] flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-bold text-slate-500 shrink-0 leading-normal">
                                                                                                                {item.load_unit ||
                                                                                                                    "kg"}
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}

                                                                                            {/* Reps */}
                                                                                            <div className="flex flex-col gap-1">
                                                                                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                                                                                                    <span>
                                                                                                        {currentCat.columns ===
                                                                                                        "medium"
                                                                                                            ? "Reps / Duration"
                                                                                                            : "Reps"}
                                                                                                    </span>
                                                                                                    {setIdx ===
                                                                                                        0 &&
                                                                                                        block.target_filled_by !==
                                                                                                            "athlete" && (
                                                                                                            <button
                                                                                                                type="button"
                                                                                                                onClick={() =>
                                                                                                                    applyToAllSets(
                                                                                                                        iIndex,
                                                                                                                        "reps_array",
                                                                                                                        setsCount,
                                                                                                                    )
                                                                                                                }
                                                                                                                className="text-slate-400 hover:text-[#ed4e18] transition-colors flex items-center gap-0.5 text-[10px]"
                                                                                                                title="Salin isi ke seluruh set"
                                                                                                            >
                                                                                                                <Copy
                                                                                                                    size={
                                                                                                                        11
                                                                                                                    }
                                                                                                                />{" "}
                                                                                                                <span>
                                                                                                                    Copy
                                                                                                                    all
                                                                                                                </span>
                                                                                                            </button>
                                                                                                        )}
                                                                                                </div>
                                                                                                <div className="flex gap-1.5">
                                                                                                    <input
                                                                                                        type={
                                                                                                            block.category ===
                                                                                                            "strength_training"
                                                                                                                ? "number"
                                                                                                                : "text"
                                                                                                        }
                                                                                                        min={
                                                                                                            block.category ===
                                                                                                            "strength_training"
                                                                                                                ? "0"
                                                                                                                : undefined
                                                                                                        }
                                                                                                        className={
                                                                                                            inputStyle
                                                                                                        }
                                                                                                        value={
                                                                                                            block.target_filled_by ===
                                                                                                            "athlete"
                                                                                                                ? ""
                                                                                                                : (item
                                                                                                                      .reps_array?.[
                                                                                                                      setIdx
                                                                                                                  ] ??
                                                                                                                  (item.reps ||
                                                                                                                      ""))
                                                                                                        }
                                                                                                        onChange={(
                                                                                                            e,
                                                                                                        ) =>
                                                                                                            updateItemArray(
                                                                                                                iIndex,
                                                                                                                "reps_array",
                                                                                                                setIdx,
                                                                                                                e
                                                                                                                    .target
                                                                                                                    .value,
                                                                                                            )
                                                                                                        }
                                                                                                        disabled={
                                                                                                            block.target_filled_by ===
                                                                                                            "athlete"
                                                                                                        }
                                                                                                        placeholder={
                                                                                                            block.target_filled_by ===
                                                                                                            "athlete"
                                                                                                                ? "Diisi Atlet"
                                                                                                                : "-"
                                                                                                        }
                                                                                                    />
                                                                                                    {block.category ===
                                                                                                    "strength_training" ? (
                                                                                                        setIdx ===
                                                                                                        0 ? (
                                                                                                            <select
                                                                                                                className="h-8 w-[62px] py-0 pl-1.5 pr-4 rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-700 text-[11px] leading-normal shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#ed4e18]/20 focus:border-[#ed4e18] shrink-0"
                                                                                                                value={
                                                                                                                    item.reps_unit ||
                                                                                                                    "reps"
                                                                                                                }
                                                                                                                onChange={(
                                                                                                                    e,
                                                                                                                ) =>
                                                                                                                    updateItem(
                                                                                                                        iIndex,
                                                                                                                        "reps_unit",
                                                                                                                        e
                                                                                                                            .target
                                                                                                                            .value,
                                                                                                                    )
                                                                                                                }
                                                                                                            >
                                                                                                                <option value="reps">
                                                                                                                    Reps
                                                                                                                </option>
                                                                                                                <option value="seconds">
                                                                                                                    Secs
                                                                                                                </option>
                                                                                                                <option value="minutes">
                                                                                                                    Mins
                                                                                                                </option>
                                                                                                            </select>
                                                                                                        ) : (
                                                                                                            <div className="h-8 w-[62px] flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-bold text-slate-500 shrink-0 leading-normal">
                                                                                                                {item.reps_unit ||
                                                                                                                    "reps"}
                                                                                                            </div>
                                                                                                        )
                                                                                                    ) : null}
                                                                                                </div>
                                                                                            </div>

                                                                                            {!isSimple && currentCat.columns ===
                                                                                                "full" && (
                                                                                                <>
                                                                                                    {/* Tempo */}
                                                                                                    <div className="flex flex-col gap-1">
                                                                                                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                                                                                                            <span>
                                                                                                                Tempo
                                                                                                            </span>
                                                                                                            {setIdx ===
                                                                                                                0 && (
                                                                                                                <button
                                                                                                                    type="button"
                                                                                                                    onClick={() =>
                                                                                                                        applyToAllSets(
                                                                                                                            iIndex,
                                                                                                                            "tempo_array",
                                                                                                                            setsCount,
                                                                                                                        )
                                                                                                                    }
                                                                                                                    className="text-slate-400 hover:text-[#ed4e18] transition-colors flex items-center gap-0.5 text-[10px]"
                                                                                                                    title="Salin isi ke seluruh set"
                                                                                                                >
                                                                                                                    <Copy
                                                                                                                        size={
                                                                                                                            11
                                                                                                                        }
                                                                                                                    />{" "}
                                                                                                                    <span>
                                                                                                                        Copy
                                                                                                                        all
                                                                                                                    </span>
                                                                                                                </button>
                                                                                                            )}
                                                                                                        </div>
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            className={
                                                                                                                inputStyle
                                                                                                            }
                                                                                                            value={
                                                                                                                item
                                                                                                                    .tempo_array?.[
                                                                                                                    setIdx
                                                                                                                ] ??
                                                                                                                (item.tempo ||
                                                                                                                    "")
                                                                                                            }
                                                                                                            onChange={(
                                                                                                                e,
                                                                                                            ) =>
                                                                                                                updateItemArray(
                                                                                                                    iIndex,
                                                                                                                    "tempo_array",
                                                                                                                    setIdx,
                                                                                                                    e
                                                                                                                        .target
                                                                                                                        .value,
                                                                                                                )
                                                                                                            }
                                                                                                            placeholder="e.g. 2010"
                                                                                                        />
                                                                                                    </div>

                                                                                                    {/* RIR / RPE */}
                                                                                                    <div className="flex flex-col gap-1">
                                                                                                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                                                                                                            <span>
                                                                                                                {[
                                                                                                                    "interval",
                                                                                                                    "cardio",
                                                                                                                ].includes(
                                                                                                                    block.category,
                                                                                                                )
                                                                                                                    ? "RPE"
                                                                                                                    : "RIR / RPE"}
                                                                                                            </span>
                                                                                                            {setIdx ===
                                                                                                                0 && (
                                                                                                                <button
                                                                                                                    type="button"
                                                                                                                    onClick={() =>
                                                                                                                        applyToAllSets(
                                                                                                                            iIndex,
                                                                                                                            "rir_array",
                                                                                                                            setsCount,
                                                                                                                        )
                                                                                                                    }
                                                                                                                    className="text-slate-400 hover:text-[#ed4e18] transition-colors flex items-center gap-0.5 text-[10px]"
                                                                                                                    title="Salin isi ke seluruh set"
                                                                                                                >
                                                                                                                    <Copy
                                                                                                                        size={
                                                                                                                            11
                                                                                                                        }
                                                                                                                    />{" "}
                                                                                                                    <span>
                                                                                                                        Copy
                                                                                                                        all
                                                                                                                    </span>
                                                                                                                </button>
                                                                                                            )}
                                                                                                        </div>
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            className={
                                                                                                                inputStyle
                                                                                                            }
                                                                                                            value={
                                                                                                                item
                                                                                                                    .rir_array?.[
                                                                                                                    setIdx
                                                                                                                ] ??
                                                                                                                (item.rir ||
                                                                                                                    "")
                                                                                                            }
                                                                                                            onChange={(
                                                                                                                e,
                                                                                                            ) =>
                                                                                                                updateItemArray(
                                                                                                                    iIndex,
                                                                                                                    "rir_array",
                                                                                                                    setIdx,
                                                                                                                    e
                                                                                                                        .target
                                                                                                                        .value,
                                                                                                                )
                                                                                                            }
                                                                                                            placeholder="e.g. 2"
                                                                                                        />
                                                                                                    </div>
                                                                                                </>
                                                                                            )}

                                                                                            {!isSimple && (currentCat.columns ===
                                                                                                "full" ||
                                                                                                currentCat.columns ===
                                                                                                    "medium") && (
                                                                                                /* Rest */
                                                                                                <div className="flex flex-col gap-1">
                                                                                                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                                                                                                        <span>
                                                                                                            Rest
                                                                                                        </span>
                                                                                                        {setIdx ===
                                                                                                            0 && (
                                                                                                            <button
                                                                                                                type="button"
                                                                                                                onClick={() =>
                                                                                                                    applyToAllSets(
                                                                                                                        iIndex,
                                                                                                                        "rest_per_set_array",
                                                                                                                        setsCount,
                                                                                                                    )
                                                                                                                }
                                                                                                                className="text-slate-400 hover:text-[#ed4e18] transition-colors flex items-center gap-0.5 text-[10px]"
                                                                                                                title="Salin isi ke seluruh set"
                                                                                                            >
                                                                                                                <Copy
                                                                                                                    size={
                                                                                                                        11
                                                                                                                    }
                                                                                                                />{" "}
                                                                                                                <span>
                                                                                                                    Copy
                                                                                                                    all
                                                                                                                </span>
                                                                                                            </button>
                                                                                                        )}
                                                                                                    </div>
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        className={
                                                                                                            inputStyle
                                                                                                        }
                                                                                                        value={
                                                                                                            item
                                                                                                                .rest_per_set_array?.[
                                                                                                                setIdx
                                                                                                            ] ??
                                                                                                            (item.rest_per_set ||
                                                                                                                "")
                                                                                                        }
                                                                                                        onChange={(
                                                                                                            e,
                                                                                                        ) =>
                                                                                                            updateItemArray(
                                                                                                                iIndex,
                                                                                                                "rest_per_set_array",
                                                                                                                setIdx,
                                                                                                                e
                                                                                                                    .target
                                                                                                                    .value,
                                                                                                            )
                                                                                                        }
                                                                                                        placeholder="e.g. 90s"
                                                                                                    />
                                                                                                </div>
                                                                                            )}
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

                        {/* Modern Quick-Add Bar Inside Phase */}
                        <div className="mt-3 border border-dashed border-slate-200 hover:border-slate-300 bg-slate-50/60 rounded-md p-2 flex flex-wrap items-center justify-between gap-2 transition-all">
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-400 bg-orange-500 hover:bg-orange-600 text-white h-7 px-3 shadow-2xs cursor-pointer"
                                >
                                    <Plus size={13} className="mr-1" /> Tambah
                                    Latihan Baru
                                </button>
                                <div
                                    className="relative inline-block"
                                    ref={packageDropdownRef}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsPackageModalOpen(
                                                !isPackageModalOpen,
                                            )
                                        }
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-400 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 h-7 px-3 shadow-2xs cursor-pointer"
                                    >
                                        <Plus
                                            size={13}
                                            className="mr-1 text-orange-500"
                                        />
                                        Pilih Dari Paket Latihan
                                    </button>

                                    {isPackageModalOpen && (
                                        <div className="absolute bottom-full left-0 mb-1.5 w-72 rounded-md border border-slate-200 bg-white text-slate-900 shadow-xl z-[100] p-1.5 animate-in fade-in-0 zoom-in-95 duration-150">
                                            <div className="p-1.5 border-b border-slate-100 flex items-center gap-1.5 mb-1 bg-slate-50 rounded">
                                                <Search
                                                    size={13}
                                                    className="text-slate-400 ml-1"
                                                />
                                                <input
                                                    autoFocus
                                                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-slate-800 placeholder:text-slate-400 font-medium"
                                                    placeholder="Cari nama paket..."
                                                    value={packageSearch}
                                                    onChange={(e) =>
                                                        setPackageSearch(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="max-h-56 overflow-y-auto space-y-0.5 custom-scrollbar">
                                                {filteredPackages?.length >
                                                0 ? (
                                                    filteredPackages.map(
                                                        (pkg) => (
                                                            <button
                                                                key={pkg.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    addPackage(
                                                                        pkg.id,
                                                                    );
                                                                    setIsPackageModalOpen(
                                                                        false,
                                                                    );
                                                                    setPackageSearch(
                                                                        "",
                                                                    );
                                                                }}
                                                                className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-orange-50 hover:text-orange-700 rounded flex items-center justify-between group transition-all cursor-pointer"
                                                            >
                                                                <div className="flex flex-col">
                                                                    <span className="font-semibold text-slate-800 group-hover:text-orange-700">
                                                                        {
                                                                            pkg.name
                                                                        }
                                                                    </span>
                                                                    <span className="text-[10px] text-slate-400 group-hover:text-orange-600/80 mt-0.5">
                                                                        {pkg
                                                                            .exercises
                                                                            ?.length ||
                                                                            0}{" "}
                                                                        Latihan
                                                                        di dalam
                                                                        paket
                                                                    </span>
                                                                </div>
                                                            </button>
                                                        ),
                                                    )
                                                ) : (
                                                    <div className="text-xs text-slate-400 italic px-3 py-3 text-center">
                                                        Paket latihan tidak
                                                        ditemukan.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onOpenExerciseModal}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-400 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 h-7 px-3 shadow-2xs cursor-pointer"
                            >
                                <Dumbbell
                                    size={13}
                                    className="mr-1.5 text-orange-500"
                                />
                                Buka Master Library
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 bg-white rounded-md border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-slate-700">
                            <Info size={14} className="text-orange-500" />
                            <span>
                                Instruksi & Catatan Khusus Sesi Stretching /
                                Recovery
                            </span>
                        </div>
                        <textarea
                            className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-orange-400 rounded-md text-xs font-medium p-3 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-orange-400 transition-all shadow-2xs text-slate-800 placeholder:text-slate-400 leading-relaxed"
                            placeholder="Tulis rincian gerakan pemanasan, peregangan mandiri, atau catatan pemulihan..."
                            value={block.items[0]?.note || ""}
                            onChange={(e) =>
                                onChange("items", [{ note: e.target.value }])
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
