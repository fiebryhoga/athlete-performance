import React from "react";
import { GripVertical, X } from "lucide-react";

const COLUMNS = [
    { id: "age", width: "w-16", step: "1" },
    { id: "weight", width: "w-20", step: "0.1" },
    { id: "height", width: "w-20", step: "0.1" },
    { id: "bmi", width: "w-20", step: "0.1", readOnly: true }, // computed if possible
    { id: "body_fat_percentage", width: "w-20", step: "0.1" },
    { id: "muscle_mass", width: "w-20", step: "0.1" },
    { id: "bone_mass", width: "w-20", step: "0.1" },
    { id: "visceral_fat", width: "w-24", step: "0.1" },
    { id: "total_body_water", width: "w-20", step: "0.1" },
    { id: "phase_angle", width: "w-24", step: "0.1" },
    { id: "bmr", width: "w-20", step: "1" },
    { id: "metabolic_age", width: "w-24", step: "1" },
    { id: "fat_free_mass", width: "w-20", step: "0.1" },
    { id: "skeletal_muscle_mass", width: "w-20", step: "0.1" },
    { id: "essential_fat_mass", width: "w-24", step: "0.1" },
    { id: "storage_fat_mass", width: "w-24", step: "0.1" },
    { id: "intracellular_water", width: "w-20", step: "0.1" },
    { id: "extracellular_water", width: "w-20", step: "0.1" },
    { id: "other_mass", width: "w-24", step: "0.1" },
];

export default function BulkRow({ player, visibleIdx, actions }) {
    return (
        <tr 
            className="hover:bg-zinc-50  transition-colors group"
            onDragOver={actions.handleDragOver}
            onDrop={(e) => actions.handleDrop(e, player.id)}
        >
            <td className="sticky left-0 z-10 bg-white  group-hover:bg-zinc-50  border-r border-zinc-200  px-3 py-2 transition-colors">
                <div className="flex items-center gap-2">
                    <div 
                        draggable
                        onDragStart={(e) => actions.handleDragStart(e, player.id)}
                        className="cursor-grab active:cursor-grabbing p-1 text-zinc-300 hover:text-zinc-500  "
                    >
                        <GripVertical size={14} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-zinc-900  text-xs line-clamp-1">{player.name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] font-bold text-zinc-500 bg-zinc-100  px-1 rounded">{player.position}</span>
                            <span className="text-[10px] text-zinc-400">No. {player.position_number}</span>
                        </div>
                    </div>
                </div>
            </td>

            {COLUMNS.map((col) => (
                <td key={col.id} className="px-2 py-2 text-center bg-white  group-hover:bg-zinc-50  transition-colors relative">
                    <input
                        type="number"
                        step={col.step}
                        value={player.metrics?.[col.id] ?? ""}
                        onChange={(e) => actions.handleNumericChange(player.id, col.id, e.target.value)}
                        onPaste={(e) => actions.handleLocalPaste(e, visibleIdx, col.id)}
                        className={`w-full ${col.width} h-8 text-center bg-white  border border-zinc-200  rounded outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400   font-semibold text-[11px] text-zinc-900  placeholder:text-zinc-300  disabled:bg-zinc-100 `}
                        placeholder="-"
                        disabled={col.readOnly}
                    />
                </td>
            ))}

            <td className="sticky right-0 z-10 bg-white  group-hover:bg-zinc-50  border-l border-zinc-200  px-2 py-2 text-center transition-colors">
                <button
                    onClick={() => actions.removePlayer(player)}
                    className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50  rounded-md transition-colors mx-auto block"
                    title="Remove from table"
                >
                    <X size={14} strokeWidth={2.5} />
                </button>
            </td>
        </tr>
    );
}
