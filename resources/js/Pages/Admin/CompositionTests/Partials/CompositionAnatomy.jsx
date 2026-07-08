

import React from 'react';

export default function CompositionAnatomy({ test }) {
 if (!test) return null;

 const imgUrl = '/assets/images/siluet-tubuh.png';

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
 { id: 'muscle', value: pMuscle, weight: muscle, bg: '#4f46e5', hex: 'bg-indigo-600', label: 'Muscle Tissue', y1: stop1 / 2, y2: 10 },
 { id: 'essFat', value: pEssFat, weight: essFat, bg: '#0ea5e9', hex: 'bg-sky-500', label: 'Essential Fat', y1: stop1 + (pEssFat / 2), y2: 30 },
 { id: 'storFat', value: pStorFat, weight: storFat, bg: '#0d9488', hex: 'bg-teal-600', label: 'Non-Essential Fat', y1: stop2 + (pStorFat / 2), y2: 50 },
 { id: 'bone', value: pBone, weight: bone, bg: '#f97316', hex: 'bg-orange-500', label: 'Bone Mass', y1: stop3 + (pBone / 2), y2: 70 },
 { id: 'other', value: pOther, weight: other, bg: '#f59e0b', hex: 'bg-amber-500', label: 'Other (Fluids)', y1: stop4 + (pOther / 2), y2: 90 }
 ];

 
 const dynamicGradient = `linear-gradient(to bottom, 
 ${sections[0].bg} 0% ${stop1}%, 
 ${sections[1].bg} ${stop1}% ${stop2}%, 
 ${sections[2].bg} ${stop2}% ${stop3}%, 
 ${sections[3].bg} ${stop3}% ${stop4}%, 
 ${sections[4].bg} ${stop4}% 100%
 )`;

 return (
 <div id="composition-anatomy" className="bg-white  border border-zinc-200  rounded-2xl p-6 md:p-8 shadow-sm overflow-hidden flex flex-col h-full">
 <div className="mb-8 text-center md:text-left">
 <h3 className="text-lg font-bold tracking-tight text-zinc-950 ">
 {"Human Body Composition"}
 </h3>
 <p className="text-sm text-zinc-500  mt-1 font-medium">
 Body anatomy distribution based on total body weight ({w} kg).
 </p>
 </div>
 
 <div className="flex flex-row items-center md:items-stretch w-full mx-auto h-[320px] sm:h-[400px] md:h-[480px] gap-3 sm:gap-6 md:gap-0 flex-1">
 
 <div className="relative w-[110px] sm:w-[160px] md:w-[220px] h-[320px] sm:h-[400px] md:h-[480px] shrink-0 group">
 
 <img src={imgUrl} className="absolute inset-0 w-full h-full object-contain opacity-10" alt="body silhouette fallback" />

 <div 
 className="absolute inset-0 z-10 transition-transform duration-500 group-hover:scale-[1.02]"
 style={{
 WebkitMaskImage: `url("${imgUrl}")`,
 WebkitMaskSize: 'contain',
 WebkitMaskRepeat: 'no-repeat',
 WebkitMaskPosition: 'center',
 maskImage: `url("${imgUrl}")`,
 maskSize: 'contain',
 maskRepeat: 'no-repeat',
 maskPosition: 'center',
 background: dynamicGradient
 }}
 />

 {sections.map(sec => (
 sec.value >= 2 && ( 
 <span 
 key={`text-${sec.id}`}
 className="absolute z-20 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/90 font-bold text-[9px] sm:text-[10px] md:text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-tight pointer-events-none transition-all duration-300"
 style={{ top: `${sec.y1}%` }}
 >
 {Math.round(sec.value)}%
 </span>
 )
 ))}
 </div>

 <div className="hidden md:block flex-1 relative min-w-[40px] lg:min-w-[60px] mx-1 shrink-0 pointer-events-none h-[320px] sm:h-[400px] md:h-[480px]">
 <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
 {sections.map(sec => (
 <path
 key={`line-${sec.id}`}
 d={`M 0,${sec.y1} C 40,${sec.y1} 60,${sec.y2} 100,${sec.y2}`}
 fill="none"
 stroke={sec.bg}
 strokeWidth="2"
 strokeDasharray="4 4"
 vectorEffect="non-scaling-stroke"
 className="opacity-60"
 />
 ))}
 </svg>
 </div>

 <div className="flex-1 md:w-[320px] flex flex-col justify-between h-[320px] sm:h-[400px] md:h-[480px] shrink-0 relative z-10 space-y-2 md:space-y-4 py-1">
 {sections.map(sec => (
 <div 
 key={`card-${sec.id}`} 
 className="flex items-center gap-2 md:gap-4 h-[56px] md:h-[64px] bg-zinc-50/50  border border-zinc-200  rounded-lg md:rounded-xl relative overflow-hidden shadow-sm pr-2 md:pr-5 shrink-0 transition-all duration-300 hover:bg-white  hover:shadow-md hover:border-zinc-300  group cursor-default"
 >
 <div className={`absolute left-0 top-0 bottom-0 w-1 md:w-1.5 ${sec.hex}`}></div>
 
 <div className={`ml-2 md:ml-5 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-md md:rounded-lg ${sec.hex} text-white font-bold text-[10px] md:text-[13px] shadow-sm group-hover:scale-110 transition-transform duration-300 shrink-0`}>
 {sec.value.toFixed(1)}%
 </div>
 
 <div className="flex-1 flex flex-col md:flex-row md:justify-between md:items-center min-w-0">
 <span className="font-bold text-zinc-900  text-[10px] md:text-xs truncate">
 {sec.label}
 </span>
 <div className="text-left md:text-right flex flex-row md:flex-col items-baseline md:items-end gap-1 md:gap-0 mt-0.5 md:mt-0">
 <span className="font-bold text-zinc-950  text-xs md:text-base leading-none">
 {sec.weight.toFixed(1)}
 </span>
 <span className="text-[9px] md:text-[10px] font-bold text-zinc-400 mt-0.5">
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