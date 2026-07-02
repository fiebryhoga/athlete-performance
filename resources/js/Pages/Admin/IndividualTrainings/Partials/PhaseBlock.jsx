import React from"react";
import {
 GripVertical,
 Trash2,
 Plus,
 Dumbbell,
 Video,
 Image as ImageIcon,
 Info,
 FileDown,
 Search,
 Copy,
} from"lucide-react";
import { Droppable, Draggable } from"@hello-pangea/dnd";
import ExerciseSelect from"./ExerciseSelect";

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
 mode ="apply",
}) {
 const categories = [
 { id:"warm_up", label:"Warm Up", columns:"medium" },
 { id:"mobility", label:"Mobility Exercise", columns:"medium" },
 { id:"activation", label:"Muscle Activation", columns:"medium" },
 {
 id:"strength_training",
 label:"Strength Training",
 columns:"full",
 },
 {
 id:"stretching",
 label:"Free Individual Stretching",
 columns:"note_only",
 },
 { id:"interval", label:"Interval Training", columns:"cardio" },
 {
 id:"free_strength",
 label:"Free Individual Strength",
 columns:"full",
 },
 { id:"cardio", label:"Cardio Endurance", columns:"cardio" },
 ];

 const currentCat =
 categories.find((c) => c.id === block.category) || categories[0];

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
 return () => {
 document.removeEventListener("mousedown", handleClickOutside);
 };
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
 sets: "",
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
 sets: "",
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
 : newItems[index][field.replace("_array","")] ||"";

 if (val === undefined || val ==="") return;

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

 const handleKeyDown = (e) => {
 if (
 !["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)
 )
 return;
 if (e.target.tagName !=="INPUT") return;

 const input = e.target;
 if (e.key ==="ArrowLeft" && input.selectionStart > 0) return;
 if (
 e.key ==="ArrowRight" &&
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

 if (e.key ==="ArrowLeft" && colIndex > 0) {
 targetInput = rowInputs[colIndex - 1];
 } else if (e.key ==="ArrowRight" && colIndex < rowInputs.length - 1) {
 targetInput = rowInputs[colIndex + 1];
 } else if (e.key ==="ArrowUp" || e.key ==="ArrowDown") {
 const rows = Array.from(tbody.querySelectorAll("tr"));
 const rowIndex = rows.indexOf(tr);
 if (e.key ==="ArrowUp" && rowIndex > 0) {
 const prevRowInputs = Array.from(
 rows[rowIndex - 1].querySelectorAll(
 'input:not([type="hidden"]):not(:disabled)',
 ),
 );
 targetInput =
 prevRowInputs[colIndex] ||
 prevRowInputs[prevRowInputs.length - 1];
 } else if (e.key ==="ArrowDown" && rowIndex < rows.length - 1) {
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
 targetInput.type ==="text" ||
 targetInput.type ==="number"
 )
 targetInput.select();
 }, 0);
 }
 };

 const inputStyle ="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 :text-zinc-400 :ring-zinc-300 text-center";

 return (
 <div className="rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow-sm mb-6">
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-zinc-50 border-b border-zinc-200 gap-4 rounded-t-xl">
 <div className="flex items-center gap-3 flex-1 w-full">
 <div
 {...dragHandleProps}
 className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-zinc-900 :text-zinc-100 p-1"
 >
 <GripVertical size={16} />
 </div>

 <div className="flex flex-col gap-2 flex-1 w-full max-w-xl">
 <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
 <select
 className="flex h-9 w-full sm:w-auto items-center justify-between rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 :text-zinc-400 :ring-zinc-300"
 value={block.category}
 onChange={(e) =>
 onChange("category", e.target.value)
 }
 >
 {categories.map((c) => (
 <option key={c.id} value={c.id}>
 {c.label}
 </option>
 ))}
 </select>
 <input
 type="text"
 placeholder={"Phase Title (Optional)"}
 className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 :text-zinc-400 :ring-zinc-300"
 value={block.title ||""}
 onChange={(e) =>
 onChange("title", e.target.value)
 }
 title="If left empty, the category name will be used"
 />
 </div>
 <input
 type="text"
 placeholder={"Description / Note (Optional)"}
 className="flex h-8 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 :text-zinc-400 :ring-zinc-300"
 value={block.description ||""}
 onChange={(e) =>
 onChange("description", e.target.value)
 }
 />
 </div>
 </div>

 <div className="flex flex-col sm:flex-row items-center gap-2 pl-8 sm:pl-0 w-full sm:w-auto">
 <div className="relative w-full sm:w-auto">
 <select
 className="flex h-9 w-full items-center justify-between rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-xs shadow-sm ring-offset-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 :text-zinc-400 :ring-zinc-300 appearance-none pr-8"
 value={block.target_filled_by ||"admin"}
 onChange={(e) =>
 onChange("target_filled_by", e.target.value)
 }
 title="Set who should fill the Load and Reps target for this phase"
 >
 <option value="admin">{"Target by Admin"}</option>
 <option value="athlete">{"Target by Athlete"}</option>
 </select>
 <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-zinc-500">
 <svg
 className="h-4 w-4"
 viewBox="0 0 20 20"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <path d="m6 9 4 4 4-4" />
 </svg>
 </div>
 </div>

 <button
 type="button"
 onClick={onDuplicate}
 className="p-2 text-zinc-400 hover:text-blue-500 :text-blue-400 hover:bg-blue-50 :bg-blue-950/20 rounded-lg transition-all"
 title="Duplicate Phase"
 >
 <Copy size={18} />
 </button>
 <button
 type="button"
 onClick={onRemove}
 className="p-2 text-zinc-400 hover:text-red-500 :text-red-400 hover:bg-red-50 :bg-red-950/20 rounded-lg transition-all"
 title="Delete Phase"
 >
 <Trash2 size={18} />
 </button>
 </div>
 </div>

 <div className="p-0">
 {currentCat.columns !=="note_only" ? (
 <div className="p-4">
 <Droppable
 droppableId={`phase-items-${blockIndex}`}
 type="exercise"
 >
 {(provided) => (
 <div
 className="flex flex-col gap-4"
 onKeyDown={handleKeyDown}
 ref={provided.innerRef}
 {...provided.droppableProps}
 >
 {block.items.map((item, iIndex) => {
 const exData = exercises.find(
 (ex) => ex.id == item.exercise_id,
 );
    const imagesRaw = exData?.images || [];
    const images = typeof imagesRaw === 'string' ? (() => { try { return JSON.parse(imagesRaw); } catch(e) { return []; } })() : (Array.isArray(imagesRaw) ? imagesRaw : []);

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        if (path.startsWith('/storage/')) return path;
        return `/storage/${path}`;
    };
 const videos =
 exData?.videos?.filter(
 (v) => v && v.trim() !=="",
 ) || [];

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
 className={`group flex flex-col bg-white border border-zinc-200 rounded-xl overflow-visible transition-all ${snapshot.isDragging ?"shadow-2xl ring-2 ring-zinc-900/10 z-50 scale-[1.01]" :"shadow-sm"}`}
 style={
 provided
 .draggableProps
 .style
 }
 >
 {/* Top Main Row: Exercise Info */}
 <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 p-4 bg-zinc-50/50 border-b border-zinc-100 rounded-t-xl">
 <div className="flex items-center gap-3 lg:w-1/3">
 <div
 {...provided.dragHandleProps}
 className="cursor-grab text-zinc-400 hover:text-zinc-600 active:cursor-grabbing"
 >
 <GripVertical
 size={
 20
 }
 />
 </div>
 <div className="flex-1">
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
 iIndex,"exercise_id",
 val,
 )
 }
 />
 </div>
 </div>

 <div className="flex flex-1 flex-wrap lg:flex-nowrap items-center gap-3">
 {/* Visuals */}
 <div className="flex items-center gap-2">
 {images.length >
 0 ? (
 <div className="flex -space-x-2">
 {images
 .slice(
 0,
 3,
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
 href={getImageUrl(img)}
 target="_blank"
 rel="noreferrer"
 className="relative z-10 hover:z-20"
 >
 <img
 src={getImageUrl(img)}
 className="h-8 w-8 rounded-md border border-white object-cover"
 alt="asset"
 />
 </a>
 ),
 )}
 </div>
 ) : (
 <span className="text-[10px] text-zinc-400">
 No
 Img
 </span>
 )}
 </div>

 {/* Basic Fields */}
 {(currentCat.columns ==="full" ||
 currentCat.columns ==="medium" ||
 currentCat.columns ==="cardio") && (
 <div className="flex flex-col gap-1">
 <span className="text-[10px] font-bold text-zinc-500">
 {"Sets"}
 </span>
 <input
 type="number"
 min="0"
 className={`${inputStyle} w-16`}
 value={
 item.sets ||""
 }
 onChange={(
 e,
 ) =>
 updateItem(
 iIndex,"sets",
 e
 .target
 .value,
 )
 }
 placeholder="-"
 />
 </div>
 )}

 <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
 <span className="text-[10px] font-bold text-zinc-500">
 {"Note"}
 </span>
 <input
 type="text"
 className={
 inputStyle
 }
 value={
 item.note ||""
 }
 onChange={(
 e,
 ) =>
 updateItem(
 iIndex,"note",
 e
 .target
 .value,
 )
 }
 placeholder={"Exercise notes..."}
 />
 </div>

 <div className="flex items-center pt-5">
 <button
 type="button"
 onClick={() =>
 removeItem(
 iIndex,
 )
 }
 className="p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-100 :bg-zinc-800 rounded-lg transition-colors"
 >
 <Trash2
 size={
 16
 }
 />
 </button>
 </div>
 </div>
 </div>

 {/* Expanded Row: Sets */}
 {(currentCat.columns ==="full" ||
 currentCat.columns ==="medium" ||
 currentCat.columns ==="cardio") &&
 Number(item.sets) >
 0 && (
 <div className="p-4 bg-zinc-50/30 border-t border-zinc-100">
 <div className="flex items-center gap-3 mb-4">
 <div className="h-px bg-zinc-200 flex-1"></div>
 <span className="text-[10px] font-bold text-zinc-400 tracking-[0.2em]">
 Target
 Per
 Set
 </span>
 <div className="h-px bg-zinc-200 flex-1"></div>
 </div>

 <div className="flex flex-wrap gap-4">
 {Array.from(
 {
 length: Math.max(
 1,
 Number(
 item.sets,
 ) ||
 1,
 ),
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
 className="flex flex-col gap-3 p-3 bg-white border border-zinc-200 rounded-xl shadow-sm min-w-[160px] flex-1 max-w-[280px]"
 >
 <span className="text-xs font-bold text-zinc-800 border-b border-zinc-100 pb-2">
 SET{""}
 {setIdx +
 1}
 </span>

 {currentCat.columns ==="cardio" ? (
 <>
 <div className="flex flex-col gap-1.5">
 <span className="text-[10px] font-bold text-zinc-500 flex items-center justify-between">
 Distance
 (m)
 {setIdx ===
 0 &&
 block.target_filled_by !=="athlete" && (
 <button
 type="button"
 onClick={() =>
 applyToAllSets(
 iIndex,"distance_array",
 Number(
 item.sets,
 ) ||
 1,
 )
 }
 className="text-zinc-400 hover:text-zinc-600 :text-zinc-300"
 title="Apply to all sets"
 >
 <Copy
 size={
 12
 }
 />
 </button>
 )}
 </span>
 <input
 type="number"
 min="0"
 step="0.1"
 className={
 inputStyle
 }
 value={
 block.target_filled_by ==="athlete"
 ?""
 : (item
 .distance_array?.[
 setIdx
 ] ??
 (item.distance ||""))
 }
 onChange={(
 e,
 ) =>
 updateItemArray(
 iIndex,"distance_array",
 setIdx,
 e
 .target
 .value,
 )
 }
 disabled={
 block.target_filled_by ==="athlete"
 }
 placeholder={
 block.target_filled_by ==="athlete"
 ?"Diisi Atlet"
 :"e.g. 5000"
 }
 />
 </div>
 <div className="flex flex-col gap-1.5">
 <span className="text-[10px] font-bold text-zinc-500 flex items-center justify-between">
 Time
 /
 Reps
 {setIdx ===
 0 &&
 block.target_filled_by !=="athlete" && (
 <button
 type="button"
 onClick={() =>
 applyToAllSets(
 iIndex,"reps_array",
 Number(
 item.sets,
 ) ||
 1,
 )
 }
 className="text-zinc-400 hover:text-zinc-600 :text-zinc-300"
 title="Apply to all sets"
 >
 <Copy
 size={
 12
 }
 />
 </button>
 )}
 </span>
 <div className="flex gap-1.5">
 <input
 type="number"
 min="0"
 step="any"
 className={`flex-1 ${inputStyle}`}
 value={
 block.target_filled_by ==="athlete"
 ?""
 : (item
 .reps_array?.[
 setIdx
 ] ??
 (item.reps ||
 item.minutes ||""))
 }
 onChange={(
 e,
 ) =>
 updateItemArray(
 iIndex,"reps_array",
 setIdx,
 e
 .target
 .value,
 )
 }
 disabled={
 block.target_filled_by ==="athlete"
 }
 placeholder={
 block.target_filled_by ==="athlete"
 ?"Diisi Atlet"
 :"e.g. 30"
 }
 />
 {setIdx ===
 0 ? (
 <select
 className="h-9 w-[70px] rounded-md border border-zinc-200 bg-zinc-50 px-1 text-[10px] sm:text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-950"
 value={
 item.reps_unit ||"minutes"
 }
 onChange={(
 e,
 ) =>
 updateItem(
 iIndex,"reps_unit",
 e
 .target
 .value,
 )
 }
 >
 <option value="seconds">
 {"Secs"}
 </option>
 <option value="minutes">
 {"Mins"}
 </option>
 <option value="hours">
 {"Hours"}
 </option>
 </select>
 ) : (
 <div className="w-[70px] shrink-0"></div>
 )}
 </div>
 </div>
 <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-zinc-100">
 <span className="text-[10px] font-bold text-zinc-500 flex items-center justify-between">
 Rest
 {setIdx ===
 0 && (
 <button
 type="button"
 onClick={() =>
 applyToAllSets(
 iIndex,"rest_per_set_array",
 Number(
 item.sets,
 ) ||
 1,
 )
 }
 className="text-zinc-400 hover:text-zinc-600 :text-zinc-300"
 title="Apply to all sets"
 >
 <Copy
 size={
 12
 }
 />
 </button>
 )}
 </span>
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
 (item.rest_per_set ||"")
 }
 onChange={(
 e,
 ) =>
 updateItemArray(
 iIndex,"rest_per_set_array",
 setIdx,
 e
 .target
 .value,
 )
 }
 placeholder="-"
 />
 </div>
 </>
 ) : (
 <>
 {currentCat.columns ==="full" && (
 <div className="flex flex-col gap-1.5">
 <span className="text-[10px] font-bold text-zinc-500 flex items-center justify-between">
 Load
 {setIdx ===
 0 &&
 block.target_filled_by !=="athlete" && (
 <button
 type="button"
 onClick={() =>
 applyToAllSets(
 iIndex,"load_array",
 Number(
 item.sets,
 ) ||
 1,
 )
 }
 className="text-zinc-400 hover:text-zinc-600 :text-zinc-300"
 title="Apply to all sets"
 >
 <Copy
 size={
 12
 }
 />
 </button>
 )}
 </span>
 <div className="flex gap-1.5">
 <input
 type="number"
 min="0"
 step="any"
 className={`flex-1 ${inputStyle}`}
 value={
 block.target_filled_by ==="athlete"
 ?""
 : (item
 .load_array?.[
 setIdx
 ] ??
 (item.load ||""))
 }
 onChange={(
 e,
 ) =>
 updateItemArray(
 iIndex,"load_array",
 setIdx,
 e
 .target
 .value,
 )
 }
 disabled={
 block.target_filled_by ==="athlete"
 }
 placeholder={
 block.target_filled_by ==="athlete"
 ?"Diisi Atlet"
 :"-"
 }
 />
 {setIdx ===
 0 ? (
 <select
 className="h-9 w-[60px] rounded-md border border-zinc-200 bg-zinc-50 px-1 text-[10px] sm:text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-950"
 value={
 item.load_unit ||"kg"
 }
 onChange={(
 e,
 ) =>
 updateItem(
 iIndex,"load_unit",
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
 {"lbs"}
 </option>
 <option value="bw">
 {"bw"}
 </option>
 </select>
 ) : (
 <div className="w-[60px] shrink-0"></div>
 )}
 </div>
 </div>
 )}
 <div className="flex flex-col gap-1.5">
 <span className="text-[10px] font-bold text-zinc-500 flex items-center justify-between">
 Reps
 {setIdx ===
 0 &&
 block.target_filled_by !=="athlete" && (
 <button
 type="button"
 onClick={() =>
 applyToAllSets(
 iIndex,"reps_array",
 Number(
 item.sets,
 ) ||
 1,
 )
 }
 className="text-zinc-400 hover:text-zinc-600 :text-zinc-300"
 title="Apply to all sets"
 >
 <Copy
 size={
 12
 }
 />
 </button>
 )}
 </span>
 <div className="flex gap-1.5">
 <input
 type={
 block.category ==="strength_training"
 ?"number"
 :"text"
 }
 min={
 block.category ==="strength_training"
 ?"0"
 : undefined
 }
 className={`flex-1 ${inputStyle}`}
 value={
 block.target_filled_by ==="athlete"
 ?""
 : (item
 .reps_array?.[
 setIdx
 ] ??
 (item.reps ||""))
 }
 onChange={(
 e,
 ) =>
 updateItemArray(
 iIndex,"reps_array",
 setIdx,
 e
 .target
 .value,
 )
 }
 disabled={
 block.target_filled_by ==="athlete"
 }
 placeholder={
 block.target_filled_by ==="athlete"
 ?"Diisi Atlet"
 :"-"
 }
 />
 {block.category ==="strength_training" ? (
 setIdx ===
 0 ? (
 <select
 className="h-9 w-[70px] rounded-md border border-zinc-200 bg-zinc-50 px-1 text-[10px] sm:text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-950"
 value={
 item.reps_unit ||"reps"
 }
 onChange={(
 e,
 ) =>
 updateItem(
 iIndex,"reps_unit",
 e
 .target
 .value,
 )
 }
 >
 <option value="reps">
 {"Reps"}
 </option>
 <option value="seconds">
 {"Secs"}
 </option>
 <option value="minutes">
 {"Mins"}
 </option>
 </select>
 ) : (
 <div className="w-[70px] shrink-0"></div>
 )
 ) : null}
 </div>
 </div>
 {currentCat.columns ==="full" && (
 <>
 <div className="flex flex-col gap-1.5">
 <span className="text-[10px] font-bold text-zinc-500 flex items-center justify-between">
 Tempo
 {setIdx ===
 0 && (
 <button
 type="button"
 onClick={() =>
 applyToAllSets(
 iIndex,"tempo_array",
 Number(
 item.sets,
 ) ||
 1,
 )
 }
 className="text-zinc-400 hover:text-zinc-600 :text-zinc-300"
 title="Apply to all sets"
 >
 <Copy
 size={
 12
 }
 />
 </button>
 )}
 </span>
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
 (item.tempo ||"")
 }
 onChange={(
 e,
 ) =>
 updateItemArray(
 iIndex,"tempo_array",
 setIdx,
 e
 .target
 .value,
 )
 }
 placeholder="-"
 />
 </div>
 <div className="flex flex-col gap-1.5">
 <span className="text-[10px] font-bold text-zinc-500 flex items-center justify-between">
 {["strength_training", "free_strength"].includes(block.category) ? "RPE" : "RIR"}
 {setIdx ===
 0 && (
 <button
 type="button"
 onClick={() =>
 applyToAllSets(
 iIndex,"rir_array",
 Number(
 item.sets,
 ) ||
 1,
 )
 }
 className="text-zinc-400 hover:text-zinc-600 :text-zinc-300"
 title="Apply to all sets"
 >
 <Copy
 size={
 12
 }
 />
 </button>
 )}
 </span>
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
 (item.rir ||"")
 }
 onChange={(
 e,
 ) =>
 updateItemArray(
 iIndex,"rir_array",
 setIdx,
 e
 .target
 .value,
 )
 }
 placeholder="-"
 />
 </div>
 <div className="flex flex-col gap-1.5">
 <span className="text-[10px] font-bold text-zinc-500 flex items-center justify-between">
 Rest
 {setIdx ===
 0 && (
 <button
 type="button"
 onClick={() =>
 applyToAllSets(
 iIndex,"rest_per_set_array",
 Number(
 item.sets,
 ) ||
 1,
 )
 }
 className="text-zinc-400 hover:text-zinc-600 :text-zinc-300"
 title="Apply to all sets"
 >
 <Copy
 size={
 12
 }
 />
 </button>
 )}
 </span>
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
 (item.rest_per_set ||"")
 }
 onChange={(
 e,
 ) =>
 updateItemArray(
 iIndex,"rest_per_set_array",
 setIdx,
 e
 .target
 .value,
 )
 }
 placeholder="-"
 />
 </div>
 </>
 )}
 </>
 )}
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
 </div>
 ) : (
 <div className="p-6 bg-zinc-50/30">
 <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-zinc-400">
 <Info size={12} /> Stretching & Recovery
 Instructions
 </div>
 <textarea
 className="w-full bg-white border border-zinc-200 rounded-xl text-sm font-medium p-4 min-h-[100px] focus:ring-2 focus:ring-zinc-900 :ring-zinc-100 transition-all shadow-inner"
 placeholder={"Type routine details..."}
 value={block.items[0]?.note ||""}
 onChange={(e) =>
 onChange("items", [{ note: e.target.value }])
 }
 />
 </div>
 )}
 </div>

 <div className="p-4 bg-white border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-b-xl relative">
 {currentCat.columns !=="note_only" && (
 <div className="flex gap-2 w-full sm:w-auto">
 <button
 type="button"
 onClick={addItem}
 className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 :bg-zinc-800 :text-zinc-50 :ring-zinc-300 h-9 px-3 flex-1 sm:flex-none shadow-sm"
 >
 <Plus size={14} className="mr-2" /> {"Add Exercise"}
 </button>
 <div
 className="relative flex-1 sm:flex-none flex"
 ref={packageDropdownRef}
 >
 <button
 type="button"
 onClick={() =>
 setIsPackageModalOpen(!isPackageModalOpen)
 }
 className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 :bg-zinc-800 :text-zinc-50 :ring-zinc-300 h-9 px-3 flex-1 sm:flex-none shadow-sm relative w-full"
 >
 <Plus size={14} className="mr-2" /> Add From
 Package
 </button>

 {isPackageModalOpen && (
 <div className="absolute bottom-full left-0 mb-2 w-64 rounded-md border border-zinc-200 bg-white text-zinc-950 shadow-md z-[100] p-1">
 <div className="p-1.5 border-b border-zinc-100 flex items-center gap-2 mb-1">
 <Search
 size={14}
 className="text-zinc-400 ml-1"
 />
 <input
 autoFocus
 className="w-full bg-transparent border-none focus:ring-0 text-xs p-1"
 placeholder={"Search package..."}
 value={packageSearch}
 onChange={(e) =>
 setPackageSearch(e.target.value)
 }
 />
 </div>
 <div className="max-h-60 overflow-y-auto">
 {filteredPackages?.length > 0 ? (
 filteredPackages.map((pkg) => (
 <button
 key={pkg.id}
 type="button"
 onClick={() => {
 addPackage(pkg.id);
 setIsPackageModalOpen(
 false,
 );
 setPackageSearch("");
 }}
 className="w-full text-left px-3 py-2.5 text-xs hover:bg-zinc-100 :bg-zinc-900 rounded-lg flex items-center justify-between group transition-colors"
 >
 <div className="flex flex-col">
 <span className="font-bold group-hover:text-zinc-900 :text-white">
 {pkg.name}
 </span>
 <div className="flex items-center gap-2 mt-0.5 text-[9px] text-zinc-400">
 <span>
 {pkg.exercises
 ?.length ||
 0}{""}
 Exercises inside
 </span>
 </div>
 </div>
 </button>
 ))
 ) : (
 <div className="text-sm text-zinc-500 px-2 py-1.5">
 {"No packages found."}
 </div>
 )}
 </div>
 </div>
 )}
 </div>
 </div>
 )}
 <button
 type="button"
 onClick={onOpenExerciseModal}
 className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-zinc-100 hover:text-zinc-900 :bg-zinc-800 :text-zinc-50 :ring-zinc-300 h-9 px-3 w-full sm:w-auto text-zinc-500"
 >
 <Dumbbell size={14} className="mr-2" /> {"Global Library"}
 </button>
 </div>
 </div>
 );
}
