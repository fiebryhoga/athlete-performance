import React from "react";
import { User } from "lucide-react";

export default function CompositionAnatomy({ test, player }) {
    if (!test) return null;

    const imgUrl = "/assets/images/siluet-tubuh.png";
    const w = parseFloat(test.weight) || 1;

    const muscle = parseFloat(test.muscle_mass) || 0;
    const essFat = parseFloat(test.essential_fat_mass) || 0;
    const storFat = parseFloat(test.storage_fat_mass) || 0;
    const bone = parseFloat(test.bone_mass) || 0;

    const calculatedOther = Math.max(0, w - muscle - essFat - storFat - bone);
    const other = parseFloat(test.other_mass) || calculatedOther;
    const totalMass = muscle + essFat + storFat + bone + other;

    const pMuscle = (muscle / totalMass) * 100;
    const pEssFat = (essFat / totalMass) * 100;
    const pStorFat = (storFat / totalMass) * 100;
    const pBone = (bone / totalMass) * 100;
    const pOther = (other / totalMass) * 100;

    const stop1 = pMuscle;
    const stop2 = stop1 + pEssFat;
    const stop3 = stop2 + pStorFat;
    const stop4 = stop3 + pBone;

    const sections = [
        {
            id: "muscle",
            value: pMuscle,
            weight: muscle,
            bg: "#4f46e5",
            hex: "bg-indigo-600",
            label: "Jaringan Otot",
            y1: stop1 / 2,
            y2: 10,
        },
        {
            id: "essFat",
            value: pEssFat,
            weight: essFat,
            bg: "#0ea5e9",
            hex: "bg-sky-500",
            label: "Lemak Esensial",
            y1: stop1 + pEssFat / 2,
            y2: 30,
        },
        {
            id: "storFat",
            value: pStorFat,
            weight: storFat,
            bg: "#0d9488",
            hex: "bg-teal-600",
            label: "Lemak Cadangan (Non-Esensial)",
            y1: stop2 + pStorFat / 2,
            y2: 50,
        },
        {
            id: "bone",
            value: pBone,
            weight: bone,
            bg: "#f97316",
            hex: "bg-orange-500",
            label: "Massa Tulang",
            y1: stop3 + pBone / 2,
            y2: 70,
        },
        {
            id: "other",
            value: pOther,
            weight: other,
            bg: "#f59e0b",
            hex: "bg-amber-500",
            label: "Lainnya (Cairan & Jaringan)",
            y1: stop4 + pOther / 2,
            y2: 90,
        },
    ];

    const dynamicGradient = `linear-gradient(to bottom, 
    ${sections[0].bg} 0% ${stop1}%, 
    ${sections[1].bg} ${stop1}% ${stop2}%, 
    ${sections[2].bg} ${stop2}% ${stop3}%, 
    ${sections[3].bg} ${stop3}% ${stop4}%, 
    ${sections[4].bg} ${stop4}% 100%
  )`;

    return (
        <div
            id="composition-anatomy"
            className="bg-white border border-slate-200/80 rounded-lg p-4 sm:p-5 shadow-2xs overflow-hidden flex flex-col h-full space-y-4"
        >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-orange-500" />
                        Distribusi Anatomi Komposisi Tubuh
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        Proporsi komponen anatomis berdasarkan total berat badan
                        atlet ({w} kg).
                    </p>
                </div>
            </div>

            <div className="flex flex-row items-center md:items-stretch w-full mx-auto h-[300px] sm:h-[360px] md:h-[400px] gap-2 sm:gap-4 md:gap-0 flex-1">
                {/* Silhouette Container */}
                <div className="relative w-[100px] sm:w-[140px] md:w-[180px] h-full shrink-0 group">
                    <img
                        src={imgUrl}
                        className="absolute inset-0 w-full h-full object-contain opacity-10"
                        alt="body silhouette"
                    />

                    <div
                        className="absolute inset-0 z-10 transition-transform duration-500 group-hover:scale-[1.02]"
                        style={{
                            WebkitMaskImage: `url("${imgUrl}")`,
                            WebkitMaskSize: "contain",
                            WebkitMaskRepeat: "no-repeat",
                            WebkitMaskPosition: "center",
                            maskImage: `url("${imgUrl}")`,
                            maskSize: "contain",
                            maskRepeat: "no-repeat",
                            maskPosition: "center",
                            background: dynamicGradient,
                        }}
                    />

                    {sections.map(
                        (sec) =>
                            sec.value >= 2 && (
                                <span
                                    key={`text-${sec.id}`}
                                    className="absolute z-20 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-[9px] sm:text-[10px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-tight pointer-events-none"
                                    style={{ top: `${sec.y1}%` }}
                                >
                                    {Math.round(sec.value)}%
                                </span>
                            ),
                    )}
                </div>

                {/* SVG Connecting Curves */}
                <div className="hidden md:block flex-1 relative min-w-[30px] lg:min-w-[50px] mx-1 shrink-0 pointer-events-none h-full">
                    <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        className="absolute inset-0 w-full h-full"
                    >
                        {sections.map((sec) => (
                            <path
                                key={`line-${sec.id}`}
                                d={`M 0,${sec.y1} C 40,${sec.y1} 60,${sec.y2} 100,${sec.y2}`}
                                fill="none"
                                stroke={sec.bg}
                                strokeWidth="2"
                                strokeDasharray="4 4"
                                vectorEffect="non-scaling-stroke"
                                className="opacity-50"
                            />
                        ))}
                    </svg>
                </div>

                {/* Right Legend Cards */}
                <div className="flex-1 md:w-[280px] flex flex-col justify-between h-full shrink-0 relative z-10 space-y-2 py-0.5">
                    {sections.map((sec) => (
                        <div
                            key={`card-${sec.id}`}
                            className="flex items-center gap-2.5 h-[48px] sm:h-[54px] bg-slate-50/70 border border-slate-200/80 rounded-md relative overflow-hidden shadow-2xs pr-3 shrink-0 transition-all duration-200 hover:bg-white hover:border-slate-300 group"
                        >
                            <div
                                className={`absolute left-0 top-0 bottom-0 w-1 ${sec.hex}`}
                            />

                            <div
                                className={`ml-2.5 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md ${sec.hex} text-white font-black text-[10px] sm:text-xs shadow-2xs shrink-0`}
                            >
                                {sec.value.toFixed(1)}%
                            </div>

                            <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center min-w-0">
                                <span className="font-bold text-slate-800 text-[11px] sm:text-xs truncate">
                                    {sec.label}
                                </span>
                                <div className="flex items-baseline gap-0.5 mt-0.5 sm:mt-0">
                                    <span className="font-black text-slate-900 text-xs sm:text-sm">
                                        {sec.weight.toFixed(1)}
                                    </span>
                                    <span className="text-[9px] font-bold text-slate-400">
                                        kg
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
