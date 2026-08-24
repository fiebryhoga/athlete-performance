import React from "react";
import { User } from "lucide-react";

export default function CompositionAnatomy({ test, player }) {
    if (!test) return null;

    const imgUrl = "/assets/images/siluet-tubuh.png";
    const w = parseFloat(test.weight) || 0;
    if (w <= 0) return null;

    const isMale =
        player?.gender === "male" ||
        player?.gender === "L" ||
        player?.gender === "Laki-laki" ||
        !player?.gender;

    // Direct values if present in test record
    let muscle = parseFloat(test.muscle_mass);
    let essFat = parseFloat(test.essential_fat_mass);
    let storFat = parseFloat(test.storage_fat_mass);
    let bone = parseFloat(test.bone_mass);
    let other = parseFloat(test.other_mass);

    const bfPct = parseFloat(test.body_fat_percentage);
    const ffm = parseFloat(test.fat_free_mass);

    // If sub-mass values are missing, intelligently estimate from weight & body fat
    if (isNaN(muscle) || muscle <= 0) {
        if (!isNaN(ffm) && ffm > 0) {
            muscle = parseFloat((ffm * 0.8).toFixed(1));
            bone =
                isNaN(bone) || bone <= 0
                    ? parseFloat((ffm * 0.12).toFixed(1))
                    : bone;
        } else if (!isNaN(bfPct) && bfPct > 0) {
            const totalFat = (w * bfPct) / 100;
            const estimatedFfm = w - totalFat;
            muscle = parseFloat((estimatedFfm * 0.8).toFixed(1));
            bone =
                isNaN(bone) || bone <= 0
                    ? parseFloat((estimatedFfm * 0.12).toFixed(1))
                    : bone;
        } else {
            muscle = parseFloat((w * 0.45).toFixed(1));
            bone =
                isNaN(bone) || bone <= 0
                    ? parseFloat((w * 0.08).toFixed(1))
                    : bone;
        }
    }

    if (isNaN(essFat) || essFat <= 0 || isNaN(storFat) || storFat <= 0) {
        if (!isNaN(bfPct) && bfPct > 0) {
            const totalFat = (w * bfPct) / 100;
            const essRatio = isMale ? 0.25 : 0.35;
            essFat = parseFloat((totalFat * essRatio).toFixed(1));
            storFat = parseFloat((totalFat * (1 - essRatio)).toFixed(1));
        } else {
            essFat = parseFloat((w * (isMale ? 0.04 : 0.08)).toFixed(1));
            storFat = parseFloat((w * 0.1).toFixed(1));
        }
    }

    if (isNaN(bone) || bone <= 0) {
        bone = parseFloat((w * 0.07).toFixed(1));
    }

    if (isNaN(other) || other <= 0) {
        other = Math.max(
            0.5,
            parseFloat((w - muscle - essFat - storFat - bone).toFixed(1)),
        );
    }

    const totalMass = muscle + essFat + storFat + bone + other;

    const pMuscle = (muscle / totalMass) * 100;
    const pEssFat = (essFat / totalMass) * 100;
    const pStorFat = (storFat / totalMass) * 100;
    const pBone = (bone / totalMass) * 100;
    const pOther = (other / totalMass) * 100;

    const stop1 = Math.min(100, Math.max(0, pMuscle));
    const stop2 = Math.min(100, Math.max(stop1, stop1 + pEssFat));
    const stop3 = Math.min(100, Math.max(stop2, stop2 + pStorFat));
    const stop4 = Math.min(100, Math.max(stop3, stop3 + pBone));

    const sections = [
        {
            id: "muscle",
            value: pMuscle,
            weight: muscle,
            bg: "#4f46e5",
            dotBg: "bg-indigo-600",
            label: "Jaringan Otot",
            y1: stop1 / 2,
            y2: 10,
        },
        {
            id: "essFat",
            value: pEssFat,
            weight: essFat,
            bg: "#0ea5e9",
            dotBg: "bg-sky-500",
            label: "Lemak Esensial",
            y1: stop1 + pEssFat / 2,
            y2: 30,
        },
        {
            id: "storFat",
            value: pStorFat,
            weight: storFat,
            bg: "#0d9488",
            dotBg: "bg-teal-600",
            label: "Lemak Cadangan (Storage)",
            y1: stop2 + pStorFat / 2,
            y2: 50,
        },
        {
            id: "bone",
            value: pBone,
            weight: bone,
            bg: "#f97316",
            dotBg: "bg-orange-500",
            label: "Massa Tulang",
            y1: stop3 + pBone / 2,
            y2: 70,
        },
        {
            id: "other",
            value: pOther,
            weight: other,
            bg: "#f59e0b",
            dotBg: "bg-amber-500",
            label: "Cairan & Jaringan Lain",
            y1: stop4 + pOther / 2,
            y2: 90,
        },
    ];

    const dynamicGradient = `linear-gradient(to bottom, 
        ${sections[0].bg} 0%, 
        ${sections[0].bg} ${stop1}%, 
        ${sections[1].bg} ${stop1}%, 
        ${sections[1].bg} ${stop2}%, 
        ${sections[2].bg} ${stop2}%, 
        ${sections[2].bg} ${stop3}%, 
        ${sections[3].bg} ${stop3}%, 
        ${sections[3].bg} ${stop4}%, 
        ${sections[4].bg} ${stop4}%, 
        ${sections[4].bg} 100%
    )`;

    return (
        <div
            id="composition-anatomy"
            className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-2xs overflow-hidden flex flex-col h-full space-y-4"
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

            <div className="flex flex-col sm:flex-row items-center sm:items-stretch w-full mx-auto min-h-[340px] gap-4 flex-1">
                {/* 1. Real Anatomical Human Silhouette using siluet-tubuh.png */}
                <div className="relative w-[130px] sm:w-[150px] md:w-[170px] h-[320px] sm:h-full shrink-0 flex items-center justify-center bg-slate-50/50 rounded-xl border border-slate-100 p-2 overflow-hidden group">
                    {/* Shadow / Base Layer */}
                    <img
                        src={imgUrl}
                        alt="Siluet Tubuh Atlet"
                        className="w-full h-full object-contain pointer-events-none opacity-20 filter grayscale"
                    />

                    {/* Gradient Mask Layer */}
                    <div
                        className="absolute inset-2 z-10 transition-transform duration-300 group-hover:scale-[1.02]"
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

                    {/* Percentage Floating Badges */}
                    {sections.map(
                        (sec) =>
                            sec.value >= 4 && (
                                <span
                                    key={`badge-${sec.id}`}
                                    className="absolute z-20 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/85 backdrop-blur-xs text-white font-bold text-[8.5px] px-1.5 py-0.2 rounded-full shadow-xs tracking-tight pointer-events-none"
                                    style={{
                                        top: `${Math.min(92, Math.max(8, sec.y1))}%`,
                                    }}
                                >
                                    {Math.round(sec.value)}%
                                </span>
                            ),
                    )}
                </div>

                {/* 2. SVG Connecting Dotted Lines */}
                <div className="hidden sm:block w-[30px] md:w-[45px] relative shrink-0 pointer-events-none h-full self-stretch">
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
                                strokeDasharray="3 3"
                                vectorEffect="non-scaling-stroke"
                                className="opacity-60"
                            />
                        ))}
                    </svg>
                </div>

                {/* 3. Right Legend Cards (Clean White-Orange Gradient Style) */}
                <div className="flex-1 w-full flex flex-col justify-between self-stretch space-y-2 py-0.5">
                    {sections.map((sec) => (
                        <div
                            key={`card-${sec.id}`}
                            className="flex items-center gap-2.5 p-2 sm:p-2.5 bg-gradient-to-b from-white via-orange-50/10 to-orange-50/25 border border-slate-200/90 rounded-lg shadow-2xs hover:border-orange-200/90 hover:shadow-xs transition-all"
                        >
                            {/* Color Dot / Tag */}
                            <div
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-white font-black text-[10px] sm:text-[11px] shadow-2xs shrink-0`}
                                style={{ backgroundColor: sec.bg }}
                            >
                                {sec.value.toFixed(0)}%
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex items-center justify-between min-w-0">
                                <span className="font-bold text-slate-800 text-[11px] sm:text-xs truncate">
                                    {sec.label}
                                </span>
                                <div className="flex items-baseline gap-0.5 shrink-0 ml-2">
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
