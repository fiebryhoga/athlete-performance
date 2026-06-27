

import React from 'react';
import { TrendingUp, TrendingDown, Minus, Activity, Scale, Droplets, Dumbbell } from 'lucide-react';

export default function TrendHighlights({ history }) {
 if (!history || history.length === 0) return null;

 const current = history[0];
 const previous = history.length > 1 ? history[1] : null;

 
 const formatShortDate = (dateString) => {
 if (!dateString) return '';
 const options = { day: 'numeric', month: 'short' };
 return new Date(dateString).toLocaleDateString('en-US', options);
 };
 const prevDateText = previous ? formatShortDate(previous.date) : '';

 
 const getTrendInfo = (currVal, prevVal, inverse = false) => {
 if (!currVal || !prevVal) {
 return { 
 icon: Minus, 
 badgeClass: 'bg-zinc-100 text-zinc-500  ', 
 text: '0.0', 
 prevValue: '-' 
 };
 }
 
 const delta = (parseFloat(currVal) - parseFloat(prevVal)).toFixed(1);
 
 
 
 let isGood = false;
 let badgeClass = '';

 if (delta > 0) {
 isGood = !inverse; 
 badgeClass = isGood 
 ? 'bg-emerald-50 text-emerald-600 border-emerald-200   ' 
 : 'bg-red-50 text-red-600 border-red-200   ';
 
 return { icon: TrendingUp, badgeClass, text: `+${delta}`, prevValue: prevVal };
 } 
 
 if (delta < 0) {
 isGood = inverse; 
 badgeClass = isGood 
 ? 'bg-emerald-50 text-emerald-600 border-emerald-200   ' 
 : 'bg-red-50 text-red-600 border-red-200   ';
 
 return { icon: TrendingDown, badgeClass, text: `${delta}`, prevValue: prevVal };
 }
 
 return { 
 icon: Minus, 
 badgeClass: 'bg-zinc-100 text-zinc-500 border-zinc-200   ', 
 text: 'Stable', 
 prevValue: prevVal 
 };
 };

 const metrics = [
 {
 label:"Body Weight",
 value: current.weight,
 unit:"kg",
 icon: Scale,
 iconBg:"bg-blue-50 ",
 iconColor:"text-blue-500 ",
 trend: getTrendInfo(current.weight, previous?.weight, false) 
 },
 {
 label:"Body Fat",
 value: current.body_fat_percentage,
 unit:"%",
 icon: Activity,
 iconBg:"bg-red-50 ",
 iconColor:"text-red-500 ",
 trend: getTrendInfo(current.body_fat_percentage, previous?.body_fat_percentage, true) 
 },
 {
 label:"Muscle Mass",
 value: current.muscle_mass,
 unit:"kg",
 icon: Dumbbell,
 iconBg:"bg-emerald-50 ",
 iconColor:"text-emerald-500 ",
 trend: getTrendInfo(current.muscle_mass, previous?.muscle_mass, false) 
 },
 {
 label:"Total Water",
 value: current.total_body_water,
 unit:"%",
 icon: Droplets,
 iconBg:"bg-cyan-50 ",
 iconColor:"text-cyan-500 ",
 trend: getTrendInfo(current.total_body_water, previous?.total_body_water, false) 
 }
 ];

 return (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 {metrics.map((metric, idx) => {
 const TrendIcon = metric.trend.icon;
 return (
 <div key={idx} className="bg-white  border border-zinc-200  rounded-xl p-5 shadow-sm flex flex-col gap-4 transition-all hover:shadow-md">
 
 
 <div className="flex items-center gap-3">
 <div className={`p-2 rounded-lg ${metric.iconBg}`}>
 <metric.icon className={`w-4 h-4 ${metric.iconColor}`} />
 </div>
 <h3 className="text-sm font-semibold text-zinc-900  tracking-tight">
 {metric.label}
 </h3>
 </div>
 
 
 <div>
 <div className="flex items-baseline gap-1">
 <span className="text-3xl font-bold tracking-tight text-zinc-950 ">
 {metric.value ?? '-'}
 </span>
 {metric.value && (
 <span className="text-sm font-medium text-zinc-500 ">
 {metric.unit}
 </span>
 )}
 </div>
 </div>

 
 <div className="pt-4 border-t border-zinc-100  mt-auto flex items-center gap-2">
 {previous && metric.value ? (
 <>
 <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border ${metric.trend.badgeClass}`}>
 <TrendIcon strokeWidth={2.5} className="w-3 h-3" />
 <span>{metric.trend.text}</span>
 </div>
 <span className="text-xs text-zinc-500 font-medium truncate">
 vs {metric.trend.prevValue}{metric.unit} ({prevDateText})
 </span>
 </>
 ) : (
 <span className="text-xs text-zinc-400  font-medium">
 {"No comparative test data available."}
 </span>
 )}
 </div>

 </div>
 );
 })}
 </div>
 );
}