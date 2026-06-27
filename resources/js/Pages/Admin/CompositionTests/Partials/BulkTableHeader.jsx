import React from "react";
import { Trash2 } from "lucide-react";

const COLUMNS = [
    { id: "age", label: "Age", width: "w-16" },
    { id: "weight", label: "Weight (kg)", width: "w-20" },
    { id: "height", label: "Height (cm)", width: "w-20" },
    { id: "bmi", label: "BMI", width: "w-20" },
    { id: "body_fat_percentage", label: "Fat (%)", width: "w-20" },
    { id: "muscle_mass", label: "Muscle (kg)", width: "w-20" },
    { id: "bone_mass", label: "Bone (kg)", width: "w-20" },
    { id: "visceral_fat", label: "Visceral Fat", width: "w-24" },
    { id: "total_body_water", label: "TBW (%)", width: "w-20" },
    { id: "phase_angle", label: "Phase Angle", width: "w-24" },
    { id: "bmr", label: "BMR (kcal)", width: "w-20" },
    { id: "metabolic_age", label: "Metab Age", width: "w-24" },
    { id: "fat_free_mass", label: "FFM (kg)", width: "w-20" },
    { id: "skeletal_muscle_mass", label: "SMM (kg)", width: "w-20" },
    { id: "essential_fat_mass", label: "Ess Fat (kg)", width: "w-24" },
    { id: "storage_fat_mass", label: "Store Fat (kg)", width: "w-24" },
    { id: "intracellular_water", label: "ICW", width: "w-20" },
    { id: "extracellular_water", label: "ECW", width: "w-20" },
    { id: "other_mass", label: "Other Mass", width: "w-24" },
];

export default function BulkTableHeader({ actions }) {
    return (
        <thead className="bg-zinc-50  sticky top-0 z-20 shadow-sm border-b border-zinc-200 ">
            <tr>
                <th className="px-3 py-2 font-semibold text-zinc-500  text-left sticky left-0 z-30 bg-zinc-50  border-r border-zinc-200  tracking-tight text-[11px] min-w-[200px]">
                    {"Player"}
                </th>
                
                {COLUMNS.map((col) => (
                    <th key={col.id} className="px-2 py-2 font-semibold text-zinc-500  text-center tracking-tight text-[10px] relative group">
                        <div className="flex flex-col items-center justify-center gap-1">
                            <span className="whitespace-nowrap">{col.label}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => actions.clearColumn(col.id, col.label)}
                                    className="p-1 rounded bg-zinc-100  hover:bg-zinc-200  text-red-500 transition-colors"
                                    title={`Clear ${col.label}`}
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    </th>
                ))}
                
                <th className="px-3 py-2 font-semibold text-zinc-500  text-center sticky right-0 z-30 bg-zinc-50  border-l border-zinc-200  tracking-tight text-[11px] w-12">
                    {"Del"}
                </th>
            </tr>
        </thead>
    );
}
