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

 let coachData = recordData;
 if (Array.isArray(recordData)) {
 coachData = {
 rpes: recordData.map((d) => (typeof d === "object" && d !== null ? d.rpe : d) || ""),
 load: recordData[0]?.load || "",
 reps: recordData[0]?.reps || "",
 tempo: recordData[0]?.tempo || "",
 rir: recordData[0]?.rir || "",
 rest: recordData[0]?.rest || "",
 };
 }

 return (
 <div className="p-4 hover:bg-zinc-50/50 :bg-zinc-900/20 transition-colors flex flex-col gap-4">
 <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
 <div className="flex-1 w-full lg:w-auto">
 <h4 className="font-bold text-zinc-900 text-base mb-1.5 flex items-center gap-2">
 <div className="w-1.5 h-1.5 rounded-full bg-zinc-400"></div>
 {exercise?.name || item.name || "-"}
 </h4>
 {exercise?.description && (
 <div className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed ml-3.5 mb-2 mt-1 bg-zinc-100/50 p-2.5 rounded-lg border border-zinc-200 ">
 {exercise.description}
 </div>
 )}
 <div className="flex flex-wrap items-center gap-2 ml-3.5 mt-2">
 {item.sets && (
 <div className="flex flex-col bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200 min-w-[60px]">
 <span className="text-[9px] font-bold text-zinc-500 mb-0.5">
 {"Sets"}
 </span>
 <span className="text-sm font-bold text-zinc-900 leading-none">
 {item.sets}
 </span>
 </div>
 )}
 {maxSets > 0 && (
 <div className="flex flex-col gap-1.5 w-full mt-1.5">
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
 <div key={sIdx} className="flex items-center gap-2 bg-zinc-100/50 rounded-lg p-1.5 border border-zinc-200/50 flex-wrap">
 <span className="text-[10px] font-bold text-zinc-500 w-10 text-center border-r border-zinc-300 ">
 S {sIdx + 1}
 </span>
 {columns === "cardio" && (
 <>
 <div className="flex items-center gap-1.5 px-2">
 <span className="text-[9px] text-zinc-500 font-bold">{"Dist"}</span>
 {isEditableTarget ? (
 <div className="flex items-center gap-0.5">
 <input
 type="text"
 value={data.targets?.[item.id]?.distance_array?.[sIdx] ?? ""}
 onChange={(e) => handleTargetArrayChange(item.id, "distance_array", sIdx, e.target.value)}
 className="w-16 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-md shadow-sm text-xs py-0.5 px-1 font-bold h-6"
 placeholder="-"
 />
 <span className="text-[10px] text-zinc-500">m</span>
 </div>
 ) : (
 <span className="text-xs font-bold text-zinc-900 ">
 {block.target_filled_by === "athlete" ? <span className="text-[9px] text-zinc-400 italic">Diisi Atlet</span> : d ? `${d}m` : "-"}
 </span>
 )}
 </div>
 <div className="flex items-center gap-1.5 px-2 border-l border-zinc-200 ">
 <span className="text-[9px] text-zinc-500 font-bold">{"Time"}</span>
 {isEditableTarget ? (
 <div className="flex items-center gap-0.5">
 <input
 type="text"
 value={data.targets?.[item.id]?.reps_array?.[sIdx] ?? ""}
 onChange={(e) => handleTargetArrayChange(item.id, "reps_array", sIdx, e.target.value)}
 className="w-16 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-md shadow-sm text-xs py-0.5 px-1 font-bold h-6"
 placeholder="-"
 />
 <span className="text-[10px] text-zinc-500">{item.reps_unit || "mins"}</span>
 </div>
 ) : (
 <span className="text-xs font-bold text-zinc-900 ">
 {block.target_filled_by === "athlete" ? <span className="text-[9px] text-zinc-400 italic">Diisi Atlet</span> : r ? `${r} ${item.reps_unit || "minutes"}` : "-"}
 </span>
 )}
 </div>
 <div className="flex items-center gap-1.5 px-2 border-l border-zinc-200 ">
 <span className="text-[9px] text-zinc-500 font-bold">{"Rest"}</span>
 {isEditableTarget ? (
 <input
 type="text"
 value={data.targets?.[item.id]?.rest_per_set_array?.[sIdx] ?? ""}
 onChange={(e) => handleTargetArrayChange(item.id, "rest_per_set_array", sIdx, e.target.value)}
 className="w-16 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-md shadow-sm text-xs py-0.5 px-1 font-bold h-6"
 placeholder="-"
 />
 ) : (
 <span className="text-xs font-bold text-zinc-900 ">{rst || "-"}</span>
 )}
 </div>
 </>
 )}
 {(columns === "full" || columns === "medium") && (
 <>
 {columns === "full" && (
 <div className="flex items-center gap-1.5 px-2">
 <span className="text-[9px] text-zinc-500 font-bold">{"Load"}</span>
 {isEditableTarget ? (
 <div className="flex items-center gap-0.5">
 <input
 type="text"
 value={data.targets?.[item.id]?.load_array?.[sIdx] ?? ""}
 onChange={(e) => handleTargetArrayChange(item.id, "load_array", sIdx, e.target.value)}
 className="w-16 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-md shadow-sm text-xs py-0.5 px-1 font-bold h-6"
 placeholder="-"
 />
 <span className="text-[10px] text-zinc-500">{item.load_unit || "kg"}</span>
 </div>
 ) : (
 <span className="text-xs font-bold text-zinc-900 ">
 {block.target_filled_by === "athlete" ? <span className="text-[9px] text-zinc-400 italic">Diisi Atlet</span> : l ? `${l} ${item.load_unit || "kg"}` : "-"}
 </span>
 )}
 </div>
 )}
 <div className="flex items-center gap-1.5 px-2 border-l border-zinc-200 ">
 <span className="text-[9px] text-zinc-500 font-bold">{"Reps"}</span>
 {isEditableTarget ? (
 <div className="flex items-center gap-0.5">
 <input
 type="text"
 value={data.targets?.[item.id]?.reps_array?.[sIdx] ?? ""}
 onChange={(e) => handleTargetArrayChange(item.id, "reps_array", sIdx, e.target.value)}
 className="w-16 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-md shadow-sm text-xs py-0.5 px-1 font-bold h-6"
 placeholder="-"
 />
 <span className="text-[10px] text-zinc-500">{item.reps_unit === "seconds" ? "Secs" : item.reps_unit === "minutes" ? "Mins" : "Reps"}</span>
 </div>
 ) : (
 <span className="text-xs font-bold text-zinc-900 ">
 {block.target_filled_by === "athlete" ? <span className="text-[9px] text-zinc-400 italic">Diisi Atlet</span> : r ? `${r} ${item.reps_unit === "seconds" ? "Secs" : item.reps_unit === "minutes" ? "Mins" : "Reps"}` : "-"}
 </span>
 )}
 </div>
 {columns === "full" && (
 <>
 <div className="flex items-center gap-1.5 px-2 border-l border-zinc-200 ">
 <span className="text-[9px] text-zinc-500 font-bold">{"Tempo"}</span>
 {isEditableTarget ? (
 <input
 type="text"
 value={data.targets?.[item.id]?.tempo_array?.[sIdx] ?? ""}
 onChange={(e) => handleTargetArrayChange(item.id, "tempo_array", sIdx, e.target.value)}
 className="w-16 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-md shadow-sm text-xs py-0.5 px-1 font-bold h-6"
 placeholder="-"
 />
 ) : (
 <span className="text-xs font-bold text-zinc-900 ">{tmp || "-"}</span>
 )}
 </div>
 <div className="flex items-center gap-1.5 px-2 border-l border-zinc-200 ">
 <span className="text-[9px] text-zinc-500 font-bold">{["strength_training", "free_strength"].includes(block.category) ? "RPE" : "RIR"}</span>
 {isEditableTarget ? (
 <input
 type="text"
 value={data.targets?.[item.id]?.rir_array?.[sIdx] ?? ""}
 onChange={(e) => handleTargetArrayChange(item.id, "rir_array", sIdx, e.target.value)}
 className="w-12 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-md shadow-sm text-xs py-0.5 px-1 font-bold h-6"
 placeholder="-"
 />
 ) : (
 <span className="text-xs font-bold text-zinc-900 ">{rir || "-"}</span>
 )}
 </div>
 <div className="flex items-center gap-1.5 px-2 border-l border-zinc-200 ">
 <span className="text-[9px] text-zinc-500 font-bold">{"Rest"}</span>
 {isEditableTarget ? (
 <input
 type="text"
 value={data.targets?.[item.id]?.rest_per_set_array?.[sIdx] ?? ""}
 onChange={(e) => handleTargetArrayChange(item.id, "rest_per_set_array", sIdx, e.target.value)}
 className="w-16 border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-md shadow-sm text-xs py-0.5 px-1 font-bold h-6"
 placeholder="-"
 />
 ) : (
 <span className="text-xs font-bold text-zinc-900 ">{rst || "-"}</span>
 )}
 </div>
 </>
 )}
 </>
 )}
 </div>
 );
 })}
 </div>
 )}
 </div>
 {item.note && (
 <p className="mt-2 text-xs text-zinc-500 italic ml-3.5 border-l-2 border-zinc-200 pl-2">
 {item.note}
 </p>
 )}
 </div>
 <div className="flex flex-col sm:flex-row items-center gap-4 ml-0 mt-3 lg:mt-0 w-full lg:w-auto">
 {images.length > 0 && images[0] && (
 <img
 src={getImageUrl(images[0])}
 alt="Exercise preview"
 className="w-full sm:w-48 xl:w-64 h-auto rounded-lg border border-zinc-200 object-cover shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
 onClick={() => openModal(getImageUrl(images[0]), "image")}
 />
 )}
 {videos.length > 0 && (
 <div className="w-full sm:w-80 xl:w-64 shrink-0">
 <div
 onClick={() => openModal(videos[0], "video")}
 className="aspect-video bg-zinc-900 rounded-lg border border-zinc-200 shadow-sm cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center group"
 >
 <PlayCircle size={32} className="text-white opacity-50 group-hover:opacity-100 transition-opacity" />
 </div>
 </div>
 )}
 </div>
 </div>

 {((block.target_filled_by === "athlete" && ["full", "medium", "cardio"].includes(columns)) || ["strength_training", "free_strength", "interval", "cardio"].includes(block.category)) && (
 <div className="bg-zinc-50 border border-zinc-200/60 rounded-xl p-3 sm:p-4 ml-0 lg:ml-3.5 mt-2 flex flex-col gap-4 w-full">
 {block.target_filled_by === "athlete" && ["full", "medium", "cardio"].includes(columns) && (
 <div className="mb-4">
 <h5 className="text-[10px] font-bold text-zinc-500 mb-3">Exercise Actuals</h5>
 <div className="flex flex-col gap-3">
 {Array.from({ length: Math.max(1, maxSets) }).map((_, sIdx) => (
 <div key={`actual-${sIdx}`} className="flex flex-wrap gap-3 items-end p-2 bg-white rounded-lg border border-zinc-200 ">
 <div className="w-full flex items-center gap-2 mb-1 border-b border-zinc-100 pb-1">
 <span className="text-[10px] font-bold text-zinc-500">Set {sIdx + 1}</span>
 </div>
 {columns === "full" && (
 <div className="flex flex-col gap-1 w-[calc(50%-6px)] md:w-[calc(25%-9px)]">
 <span className="text-[10px] font-bold text-zinc-500">LOAD {item.load_unit ? `(${item.load_unit})` : "(KG)"} *</span>
 <input
 type="text"
 value={exerciseData.load_array?.[sIdx] || ""}
 onChange={(e) => handleExerciseArrayChange(item.id, "load_array", sIdx, e.target.value)}
 placeholder={item.load_array?.[sIdx] ?? item.load ?? ""}
 className="w-full border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-lg shadow-sm sm:text-xs h-8 placeholder:text-zinc-300 :text-zinc-700 font-bold disabled:opacity-50 disabled:bg-zinc-100"
 disabled={isReadOnly || block.target_filled_by === "admin"}
 />
 </div>
 )}
 {(columns === "full" || columns === "medium") && (
 <div className="flex flex-col gap-1 w-[calc(50%-6px)] md:w-[calc(25%-9px)]">
 <span className="text-[10px] font-bold text-zinc-500">REPS {item.reps_unit === "seconds" ? "(SECS)" : item.reps_unit === "minutes" ? "(MINS)" : ""} *</span>
 <input
 type="text"
 value={exerciseData.reps_array?.[sIdx] || ""}
 onChange={(e) => handleExerciseArrayChange(item.id, "reps_array", sIdx, e.target.value)}
 placeholder={item.reps_array?.[sIdx] ?? item.reps ?? ""}
 className="w-full border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-lg shadow-sm sm:text-xs h-8 placeholder:text-zinc-300 :text-zinc-700 font-bold disabled:opacity-50 disabled:bg-zinc-100"
 disabled={isReadOnly || block.target_filled_by === "admin"}
 />
 </div>
 )}
 {columns === "cardio" && (
 <>
 <div className="flex flex-col gap-1 w-[calc(50%-6px)] md:w-[calc(33%-8px)]">
 <span className="text-[10px] font-bold text-zinc-500">DIST (M) *</span>
 <input
 type="text"
 value={exerciseData.distance_array?.[sIdx] || ""}
 onChange={(e) => handleExerciseArrayChange(item.id, "distance_array", sIdx, e.target.value)}
 placeholder={item.distance_array?.[sIdx] ?? item.distance ?? ""}
 className="w-full border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-lg shadow-sm sm:text-xs h-8 placeholder:text-zinc-300 :text-zinc-700 font-bold disabled:opacity-50 disabled:bg-zinc-100"
 disabled={isReadOnly || block.target_filled_by === "admin"}
 />
 </div>
 <div className="flex flex-col gap-1 w-[calc(50%-6px)] md:w-[calc(33%-8px)]">
 <span className="text-[10px] font-bold text-zinc-500">TIME {item.reps_unit ? `(${item.reps_unit.toUpperCase()})` : "(MINS)"} *</span>
 <input
 type="text"
 value={exerciseData.reps_array?.[sIdx] || ""}
 onChange={(e) => handleExerciseArrayChange(item.id, "reps_array", sIdx, e.target.value)}
 placeholder={item.reps_array?.[sIdx] ?? (item.reps || item.minutes) ?? ""}
 className="w-full border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 rounded-lg shadow-sm sm:text-xs h-8 placeholder:text-zinc-300 :text-zinc-700 font-bold disabled:opacity-50 disabled:bg-zinc-100"
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

 {["strength_training", "free_strength", "interval", "cardio"].includes(block.category) && (
 <div className="mb-4">
 <h5 className="text-[10px] font-bold text-zinc-500 mb-3">
 {["strength_training", "free_strength"].includes(block.category) ? "RPE" : "RIR"}
 </h5>
 <div className="flex flex-wrap gap-3">
 {Array.from({ length: Math.max(1, maxSets) }).map((_, sIdx) => {
 const valRpe = (Array.isArray(exerciseData.rpes) ? exerciseData.rpes[sIdx] : data.rpes?.[item.id]?.rpes?.[sIdx]) || "";
 return (
 <div key={sIdx} className="flex flex-col gap-2 w-24 border border-zinc-200 rounded-lg p-2 bg-white shadow-sm shrink-0">
 <span className="text-[10px] text-zinc-500 font-bold text-center border-b border-zinc-100 pb-1">Set {sIdx + 1}</span>
 <input
 type="number"
 min="1"
 max="10"
 step="any"
 className="w-full text-center bg-zinc-50 border-none rounded text-lg font-bold p-2 text-zinc-900 disabled:opacity-50"
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
