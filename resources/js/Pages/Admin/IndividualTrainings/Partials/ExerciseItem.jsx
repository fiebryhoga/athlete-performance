import React from "react";
import { PlayCircle } from "lucide-react";

export default function ExerciseItem({
    item,
    bIdx,
    iIdx,
    block,
    columns,
    openModal,
    data,
    rpeRecords,
    handleExerciseChange,
    handleSetRpeChange,
    handleExerciseArrayChange,
    isReadOnly,
    isCoachOrAdmin,
    handleTargetChange,
    handleTargetArrayChange,
}) {
    const exercise = item.exercise;
    const imagesRaw = exercise?.images || [];
    const images = typeof imagesRaw === 'string' ? (() => { try { return JSON.parse(imagesRaw); } catch(e) { return []; } })() : (Array.isArray(imagesRaw) ? imagesRaw : []);
    const videosRaw = exercise?.videos || [];
    const videos = (typeof videosRaw === 'string' ? (() => { try { return JSON.parse(videosRaw); } catch(e) { return []; } })() : (Array.isArray(videosRaw) ? videosRaw : [])).filter((v) => v && v.trim() !== "");
    const maxSets = Math.max(...(String(item.sets || "0").match(/\d+/g) || [0]).map(Number), 0);
    
    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        if (path.startsWith('/storage/')) return path;
        return `/storage/${path}`;
    };

    const exerciseData = data.rpes?.[item.id] || {
        rpes: [],
        load: "",
        reps: "",
        tempo: "",
        rir: "",
        rest: "",
        load_array: [],
        reps_array: [],
        distance_array: [],
        tempo_array: [],
        rir_array: [],
        rest_per_set_array: [],
    };

    const playerRecord = rpeRecords.find(
        (r) => r.training_block_item_id == item.id
    );
    const recordData = playerRecord?.rpe_data || {
        rpes: [],
        load: "",
        reps: "",
        tempo: "",
        rir: "",
        rest: "",
        load_array: [],
        reps_array: [],
        distance_array: [],
        tempo_array: [],
        rir_array: [],
        rest_per_set_array: [],
    };

    return (
        <div className="p-3.5 sm:p-4 hover:bg-slate-50/50 transition-colors flex flex-col gap-3">
            <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
                <div className="flex-1 w-full lg:w-auto">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">
                        {exercise?.name || item.name || "-"}
                    </h4>
                    {exercise?.description && (
                        <div className="text-[11px] text-slate-600 whitespace-pre-wrap leading-relaxed mb-1.5 mt-1 bg-slate-50 p-2 rounded-md border border-slate-200/80">
                            {exercise.description}
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-1 w-full mt-1.5">
                        {maxSets > 0 && (
                            <div className="flex flex-col gap-1 w-full">
                                {Array.from({ length: maxSets }).map((_, sIdx) => {
                                    const playerTarget = data.targets?.[item.id];
                                    const d = playerTarget?.distance_array?.[sIdx] ?? item.distance_array?.[sIdx] ?? item.distance;
                                    const r = playerTarget?.reps_array?.[sIdx] ?? (item.reps_array?.[sIdx] ?? (item.reps || item.minutes));
                                    const l = playerTarget?.load_array?.[sIdx] ?? item.load_array?.[sIdx] ?? item.load;
                                    const tmp = playerTarget?.tempo_array?.[sIdx] ?? item.tempo_array?.[sIdx] ?? item.tempo;
                                    const rir = playerTarget?.rir_array?.[sIdx] ?? item.rir_array?.[sIdx] ?? item.rir;
                                    const rst = playerTarget?.rest_per_set_array?.[sIdx] ?? item.rest_per_set_array?.[sIdx] ?? item.rest_per_set;

                                    const isEditableTarget = isCoachOrAdmin && block.target_filled_by !== "athlete";

                                    return (
                                        <div key={sIdx} className="flex items-center gap-2 bg-slate-50/80 rounded-md p-1 border border-slate-200/70 flex-wrap text-xs">
                                            <span className="text-[10px] font-bold text-slate-500 w-8 text-center border-r border-slate-200 pr-1 shrink-0">
                                                S{sIdx + 1}
                                            </span>
                                            {columns === "cardio" && (
                                                <>
                                                    <div className="flex items-center gap-1 px-1.5">
                                                        <span className="text-[9.5px] text-slate-400 font-bold uppercase">Dist</span>
                                                        {isEditableTarget ? (
                                                            <div className="flex items-center gap-0.5">
                                                                <input
                                                                    type="text"
                                                                    value={data.targets?.[item.id]?.distance_array?.[sIdx] ?? ""}
                                                                    onChange={(e) => handleTargetArrayChange(item.id, "distance_array", sIdx, e.target.value)}
                                                                    className="w-14 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-md text-xs py-0.5 px-1 font-bold h-6"
                                                                    placeholder="-"
                                                                />
                                                                <span className="text-[10px] text-slate-400">m</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs font-bold text-slate-900">
                                                                {block.target_filled_by === "athlete" ? <span className="text-[9.5px] text-slate-400 italic">Diisi Atlet</span> : d ? `${d}m` : "-"}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 px-1.5 border-l border-slate-200">
                                                        <span className="text-[9.5px] text-slate-400 font-bold uppercase">Time</span>
                                                        {isEditableTarget ? (
                                                            <div className="flex items-center gap-0.5">
                                                                <input
                                                                    type="text"
                                                                    value={data.targets?.[item.id]?.reps_array?.[sIdx] ?? ""}
                                                                    onChange={(e) => handleTargetArrayChange(item.id, "reps_array", sIdx, e.target.value)}
                                                                    className="w-14 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-md text-xs py-0.5 px-1 font-bold h-6"
                                                                    placeholder="-"
                                                                />
                                                                <span className="text-[10px] text-slate-400">{item.reps_unit || "mins"}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs font-bold text-slate-900">
                                                                {block.target_filled_by === "athlete" ? <span className="text-[9.5px] text-slate-400 italic">Diisi Atlet</span> : r ? `${r} ${item.reps_unit || "minutes"}` : "-"}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 px-1.5 border-l border-slate-200">
                                                        <span className="text-[9.5px] text-slate-400 font-bold uppercase">Rest</span>
                                                        {isEditableTarget ? (
                                                            <input
                                                                type="text"
                                                                value={data.targets?.[item.id]?.rest_per_set_array?.[sIdx] ?? ""}
                                                                onChange={(e) => handleTargetArrayChange(item.id, "rest_per_set_array", sIdx, e.target.value)}
                                                                className="w-14 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-md text-xs py-0.5 px-1 font-bold h-6"
                                                                placeholder="-"
                                                            />
                                                        ) : (
                                                            <span className="text-xs font-bold text-slate-900">{rst || "-"}</span>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                            {(columns === "full" || columns === "medium") && (
                                                <>
                                                    {columns === "full" && (
                                                        <div className="flex items-center gap-1 px-1.5">
                                                            <span className="text-[9.5px] text-slate-400 font-bold uppercase">Load</span>
                                                            {isEditableTarget ? (
                                                                <div className="flex items-center gap-0.5">
                                                                    <input
                                                                        type="text"
                                                                        value={data.targets?.[item.id]?.load_array?.[sIdx] ?? ""}
                                                                        onChange={(e) => handleTargetArrayChange(item.id, "load_array", sIdx, e.target.value)}
                                                                        className="w-14 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-md text-xs py-0.5 px-1 font-bold h-6"
                                                                        placeholder="-"
                                                                    />
                                                                    <span className="text-[10px] text-slate-400">{item.load_unit || "kg"}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs font-bold text-slate-900">
                                                                    {block.target_filled_by === "athlete" ? <span className="text-[9.5px] text-slate-400 italic">Diisi Atlet</span> : l ? `${l} ${item.load_unit || "kg"}` : "-"}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1 px-1.5 border-l border-slate-200">
                                                        <span className="text-[9.5px] text-slate-400 font-bold uppercase">Reps</span>
                                                        {isEditableTarget ? (
                                                            <div className="flex items-center gap-0.5">
                                                                <input
                                                                    type="text"
                                                                    value={data.targets?.[item.id]?.reps_array?.[sIdx] ?? ""}
                                                                    onChange={(e) => handleTargetArrayChange(item.id, "reps_array", sIdx, e.target.value)}
                                                                    className="w-14 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-md text-xs py-0.5 px-1 font-bold h-6"
                                                                    placeholder="-"
                                                                />
                                                                <span className="text-[10px] text-slate-400">{item.reps_unit === "seconds" ? "s" : item.reps_unit === "minutes" ? "m" : "r"}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs font-bold text-slate-900">
                                                                {block.target_filled_by === "athlete" ? <span className="text-[9.5px] text-slate-400 italic">Diisi Atlet</span> : r ? `${r} ${item.reps_unit === "seconds" ? "s" : item.reps_unit === "minutes" ? "m" : ""}` : "-"}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {columns === "full" && (
                                                        <>
                                                            <div className="flex items-center gap-1 px-1.5 border-l border-slate-200">
                                                                <span className="text-[9.5px] text-slate-400 font-bold uppercase">Tempo</span>
                                                                {isEditableTarget ? (
                                                                    <input
                                                                        type="text"
                                                                        value={data.targets?.[item.id]?.tempo_array?.[sIdx] ?? ""}
                                                                        onChange={(e) => handleTargetArrayChange(item.id, "tempo_array", sIdx, e.target.value)}
                                                                        className="w-14 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-md text-xs py-0.5 px-1 font-bold h-6"
                                                                        placeholder="-"
                                                                    />
                                                                ) : (
                                                                    <span className="text-xs font-bold text-slate-900">{tmp || "-"}</span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1 px-1.5 border-l border-slate-200">
                                                                <span className="text-[9.5px] text-slate-400 font-bold uppercase">{["interval", "cardio"].includes(block.category) ? "RPE" : "RIR"}</span>
                                                                {isEditableTarget ? (
                                                                    <input
                                                                        type="text"
                                                                        value={data.targets?.[item.id]?.rir_array?.[sIdx] ?? ""}
                                                                        onChange={(e) => handleTargetArrayChange(item.id, "rir_array", sIdx, e.target.value)}
                                                                        className="w-10 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-md text-xs py-0.5 px-1 font-bold h-6 text-center"
                                                                        placeholder="-"
                                                                    />
                                                                ) : (
                                                                    <span className="text-xs font-bold text-slate-900">{rir || "-"}</span>
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                    <div className="flex items-center gap-1 px-1.5 border-l border-slate-200">
                                                        <span className="text-[9.5px] text-slate-400 font-bold uppercase">Rest</span>
                                                        {isEditableTarget ? (
                                                            <input
                                                                type="text"
                                                                value={data.targets?.[item.id]?.rest_per_set_array?.[sIdx] ?? ""}
                                                                onChange={(e) => handleTargetArrayChange(item.id, "rest_per_set_array", sIdx, e.target.value)}
                                                                className="w-14 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-md text-xs py-0.5 px-1 font-bold h-6"
                                                                placeholder="-"
                                                            />
                                                        ) : (
                                                            <span className="text-xs font-bold text-slate-900">{rst || "-"}</span>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    {item.note && (
                        <p className="mt-1.5 text-[11px] text-slate-500 italic border-l-2 border-slate-200 pl-2">
                            {item.note}
                        </p>
                    )}
                </div>

                {/* Media Thumbnails */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 ml-0 mt-2 lg:mt-0 w-full lg:w-auto shrink-0">
                    {images.length > 0 && images[0] && (
                        <img
                            src={getImageUrl(images[0])}
                            alt="Exercise preview"
                            className="w-full sm:w-36 xl:w-44 h-24 rounded-md border border-slate-200 object-cover shadow-2xs cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => openModal(getImageUrl(images[0]), "image")}
                        />
                    )}
                    {videos.length > 0 && (
                        <div className="w-full sm:w-44 xl:w-48 shrink-0">
                            <div
                                onClick={() => openModal(videos[0], "video")}
                                className="aspect-video bg-slate-900 rounded-md border border-slate-200 shadow-2xs cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center group"
                            >
                                <PlayCircle size={28} className="text-white opacity-60 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Actuals Input Container */}
            {((block.target_filled_by === "athlete" && ["full", "medium", "cardio"].includes(columns)) || ["strength_training", "interval", "cardio"].includes(block.category)) && (
                <div className="bg-slate-50 border border-slate-200/80 rounded-md p-3 mt-1 flex flex-col gap-3 w-full">
                    {block.target_filled_by === "athlete" && ["full", "medium", "cardio"].includes(columns) && (
                        <div>
                            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Hasil Latihan Atlet (Actuals)</h5>
                            <div className="flex flex-col gap-2">
                                {Array.from({ length: Math.max(1, maxSets) }).map((_, sIdx) => (
                                    <div key={`actual-${sIdx}`} className="flex flex-wrap gap-2.5 items-end p-2 bg-white rounded-md border border-slate-200/80 shadow-2xs">
                                        <div className="w-full flex items-center gap-1.5 pb-1 border-b border-slate-100">
                                            <span className="text-[10px] font-bold text-slate-600">Set {sIdx + 1}</span>
                                        </div>
                                        {columns === "full" && (
                                            <div className="flex flex-col gap-0.5 w-[calc(50%-5px)] md:w-[calc(25%-7px)]">
                                                <span className="text-[9.5px] font-bold text-slate-500 uppercase">LOAD {item.load_unit ? `(${item.load_unit})` : "(KG)"} *</span>
                                                <input
                                                    type="text"
                                                    value={exerciseData.load_array?.[sIdx] || ""}
                                                    onChange={(e) => handleExerciseArrayChange(item.id, "load_array", sIdx, e.target.value)}
                                                    placeholder={item.load_array?.[sIdx] ?? item.load ?? ""}
                                                    className="w-full border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-2xs text-xs h-7 py-1 px-2 font-bold disabled:opacity-50 disabled:bg-slate-100"
                                                    disabled={isReadOnly || block.target_filled_by === "admin"}
                                                />
                                            </div>
                                        )}
                                        {(columns === "full" || columns === "medium") && (
                                            <div className="flex flex-col gap-0.5 w-[calc(50%-5px)] md:w-[calc(25%-7px)]">
                                                <span className="text-[9.5px] font-bold text-slate-500 uppercase">REPS {item.reps_unit === "seconds" ? "(SECS)" : item.reps_unit === "minutes" ? "(MINS)" : ""} *</span>
                                                <input
                                                    type="text"
                                                    value={exerciseData.reps_array?.[sIdx] || ""}
                                                    onChange={(e) => handleExerciseArrayChange(item.id, "reps_array", sIdx, e.target.value)}
                                                    placeholder={item.reps_array?.[sIdx] ?? item.reps ?? ""}
                                                    className="w-full border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-2xs text-xs h-7 py-1 px-2 font-bold disabled:opacity-50 disabled:bg-slate-100"
                                                    disabled={isReadOnly || block.target_filled_by === "admin"}
                                                />
                                            </div>
                                        )}
                                        {columns === "cardio" && (
                                            <>
                                                <div className="flex flex-col gap-0.5 w-[calc(50%-5px)] md:w-[calc(33%-6px)]">
                                                    <span className="text-[9.5px] font-bold text-slate-500 uppercase">DIST (M) *</span>
                                                    <input
                                                        type="text"
                                                        value={exerciseData.distance_array?.[sIdx] || ""}
                                                        onChange={(e) => handleExerciseArrayChange(item.id, "distance_array", sIdx, e.target.value)}
                                                        placeholder={item.distance_array?.[sIdx] ?? item.distance ?? ""}
                                                        className="w-full border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-2xs text-xs h-7 py-1 px-2 font-bold disabled:opacity-50 disabled:bg-slate-100"
                                                        disabled={isReadOnly || block.target_filled_by === "admin"}
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-0.5 w-[calc(50%-5px)] md:w-[calc(33%-6px)]">
                                                    <span className="text-[9.5px] font-bold text-slate-500 uppercase">TIME {item.reps_unit ? `(${item.reps_unit.toUpperCase()})` : "(MINS)"} *</span>
                                                    <input
                                                        type="text"
                                                        value={exerciseData.reps_array?.[sIdx] || ""}
                                                        onChange={(e) => handleExerciseArrayChange(item.id, "reps_array", sIdx, e.target.value)}
                                                        placeholder={item.reps_array?.[sIdx] ?? (item.reps || item.minutes) ?? ""}
                                                        className="w-full border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-2xs text-xs h-7 py-1 px-2 font-bold disabled:opacity-50 disabled:bg-slate-100"
                                                        disabled={isReadOnly || block.target_filled_by === "admin"}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {["strength_training", "interval", "cardio"].includes(block.category) && (
                        <div>
                            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                {["interval", "cardio"].includes(block.category) ? "Skala RPE (1-10)" : "Target RIR"}
                            </h5>
                            <div className="flex flex-wrap gap-2">
                                {Array.from({ length: Math.max(1, maxSets) }).map((_, sIdx) => {
                                    const valRpe = (Array.isArray(exerciseData.rpes) ? exerciseData.rpes[sIdx] : data.rpes?.[item.id]?.rpes?.[sIdx]) || "";
                                    return (
                                        <div key={sIdx} className="flex flex-col gap-1 w-20 border border-slate-200 rounded-md p-1.5 bg-white shadow-2xs shrink-0">
                                            <span className="text-[9.5px] text-slate-500 font-bold text-center border-b border-slate-100 pb-0.5">Set {sIdx + 1}</span>
                                            <input
                                                type="number"
                                                min="1"
                                                max="10"
                                                step="any"
                                                className="w-full text-center bg-slate-50 border border-slate-200/80 rounded text-sm font-bold py-1 px-1 text-slate-900 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50"
                                                value={valRpe || ""}
                                                onChange={(e) => handleSetRpeChange(item.id, sIdx, e.target.value)}
                                                placeholder="-"
                                                disabled={isReadOnly}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
