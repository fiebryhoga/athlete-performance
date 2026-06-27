

import React from 'react';


const MetricGauge = ({ label, value, unit, ranges, maxGaugeValue = 40 }) => {
 if (value === null || value === undefined) return null;
 
 const val = parseFloat(value);
 
 const positionPct = Math.min(100, Math.max(0, (val / maxGaugeValue) * 100));

 
 let currentCategory = { label: 'Out of Range', color: 'gray' };
 Object.values(ranges || {}).forEach(range => {
 if (val >= range.min && val <= range.max) {
 currentCategory = range;
 }
 });

 const bgColors = {
 blue: 'bg-blue-500', green: 'bg-emerald-500', lime: 'bg-lime-500', 
 yellow: 'bg-amber-400', orange: 'bg-orange-500', red: 'bg-red-500', gray: 'bg-zinc-400'
 };
 const textColors = {
 blue: 'text-blue-600 ', green: 'text-emerald-600 ', 
 lime: 'text-lime-600 ', yellow: 'text-amber-600 ', 
 orange: 'text-orange-600 ', red: 'text-red-600 ', gray: 'text-zinc-500'
 };

 return (
 <div className="bg-zinc-50/50  border border-zinc-100  rounded-xl p-4">
 <div className="flex justify-between items-end mb-3">
 <div>
 <p className="text-xs font-medium text-zinc-500 ">{label}</p>
 <p className="text-2xl font-bold tracking-tight text-zinc-900 ">
 {val} <span className="text-sm font-normal text-zinc-500">{unit}</span>
 </p>
 </div>
 <div className="text-right">
 <span className={`text-xs font-bold ${textColors[currentCategory.color] || textColors.gray}`}>
 {currentCategory.label}
 </span>
 </div>
 </div>

 
 <div className="relative w-full h-3 bg-zinc-200  rounded-full mt-2">
 
 {Object.values(ranges || {}).map((r, i) => {
 if(r.max > maxGaugeValue) r.max = maxGaugeValue; 
 const left = (r.min / maxGaugeValue) * 100;
 const width = ((r.max - r.min) / maxGaugeValue) * 100;
 return (
 <div key={i} className={`absolute h-full opacity-30 ${bgColors[r.color]}`} style={{ left: `${left}%`, width: `${width}%` }} title={r.label}></div>
 );
 })}
 
 
 <div 
 className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-zinc-900  rounded-full shadow-md z-10 transition-all duration-500"
 style={{ left: `calc(${positionPct}% - 8px)` }}
 ></div>
 </div>
 
 <div className="flex justify-between mt-1.5 text-[10px] text-zinc-400 font-medium">
 <span>0</span>
 <span>{maxGaugeValue}+</span>
 </div>
 </div>
 );
};

export default function AnalyticsDashboard({ test, player, benchmarks }) {
 if (!test || !benchmarks) return null;
 
 const isMale = player?.gender === 'male' || player?.gender === 'L' || !player?.gender;
 const bfBenchmarks = isMale ? benchmarks.body_fat?.male : benchmarks.body_fat?.female;

 return (
 <div className="bg-white  border border-zinc-200  rounded-xl p-6 shadow-sm">
 <h3 className="text-sm font-semibold tracking-tight text-zinc-950  mb-4">
 {"Performance Benchmarks"}
 </h3>
 
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <MetricGauge 
 label="Body Fat" 
 value={test.body_fat_percentage} 
 unit="%" 
 ranges={bfBenchmarks} 
 maxGaugeValue={35} 
 />
 <MetricGauge 
 label="Visceral Fat" 
 value={test.visceral_fat} 
 unit="Level" 
 ranges={benchmarks.visceral_fat} 
 maxGaugeValue={20} 
 />
 <MetricGauge 
 label="BMI" 
 value={test.bmi} 
 unit="" 
 ranges={benchmarks.bmi} 
 maxGaugeValue={35} 
 />
 <MetricGauge 
 label="Phase Angle (Cellular)" 
 value={test.phase_angle} 
 unit="°" 
 ranges={benchmarks.phase_angle} 
 maxGaugeValue={10} 
 />
 </div>
 </div>
 );
}