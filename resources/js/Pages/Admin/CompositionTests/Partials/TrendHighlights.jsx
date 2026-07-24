

import React from 'react';
import { TrendingUp, TrendingDown, Minus, Activity, Scale, Droplets, Dumbbell, Flame, Ruler, User } from 'lucide-react';

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
 label:"Height",
 value: current.height,
 unit:"cm",
 icon: Ruler,
 iconBg:"bg-purple-50 ",
 iconColor:"text-purple-500 ",
 trend: getTrendInfo(current.height, previous?.height, false) 
 },
 {
 label:"BMI",
 value: current.bmi,
 unit:"",
 icon: Activity,
 iconBg:"bg-orange-50 ",
 iconColor:"text-orange-500 ",
 trend: getTrendInfo(current.bmi, previous?.bmi, true) 
 },
 {
 label:"Body Fat",
 value: current.body_fat_percentage,
 unit:"%",
 icon: Flame,
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
 label:"Fat-Free Mass",
 value: current.fat_free_mass,
 unit:"kg",
 icon: Dumbbell,
 iconBg:"bg-teal-50 ",
 iconColor:"text-teal-500 ",
 trend: getTrendInfo(current.fat_free_mass, previous?.fat_free_mass, false) 
 },
 {
 label:"Skeletal Muscle",
 value: current.skeletal_muscle_mass,
 unit:"kg",
 icon: Dumbbell,
 iconBg:"bg-green-50 ",
 iconColor:"text-green-500 ",
 trend: getTrendInfo(current.skeletal_muscle_mass, previous?.skeletal_muscle_mass, false) 
 },
 {
 label:"Bone Mass",
 value: current.bone_mass,
 unit:"kg",
 icon: Activity,
 iconBg:"bg-zinc-100 ",
 iconColor:"text-zinc-500 ",
 trend: getTrendInfo(current.bone_mass, previous?.bone_mass, false) 
 },
 {
 label:"Essential Fat",
 value: current.essential_fat_mass,
 unit:"kg",
 icon: Activity,
 iconBg:"bg-rose-50 ",
 iconColor:"text-rose-500 ",
 trend: getTrendInfo(current.essential_fat_mass, previous?.essential_fat_mass, true) 
 },
 {
 label:"Storage Fat",
 value: current.storage_fat_mass,
 unit:"kg",
 icon: Activity,
 iconBg:"bg-orange-50 ",
 iconColor:"text-orange-500 ",
 trend: getTrendInfo(current.storage_fat_mass, previous?.storage_fat_mass, true) 
 },
 {
 label:"Visceral Fat",
 value: current.visceral_fat,
 unit:"Lvl",
 icon: Flame,
 iconBg:"bg-amber-50 ",
 iconColor:"text-amber-500 ",
 trend: getTrendInfo(current.visceral_fat, previous?.visceral_fat, true) 
 },
 {
 label:"Total Water",
 value: current.total_body_water,
 unit:"%",
 icon: Droplets,
 iconBg:"bg-cyan-50 ",
 iconColor:"text-cyan-500 ",
 trend: getTrendInfo(current.total_body_water, previous?.total_body_water, false) 
 },
 {
 label:"Intracellular Water",
 value: current.intracellular_water,
 unit:"L",
 icon: Droplets,
 iconBg:"bg-blue-50 ",
 iconColor:"text-blue-500 ",
 trend: getTrendInfo(current.intracellular_water, previous?.intracellular_water, false) 
 },
 {
 label:"Extracellular Water",
 value: current.extracellular_water,
 unit:"L",
 icon: Droplets,
 iconBg:"bg-sky-50 ",
 iconColor:"text-sky-500 ",
 trend: getTrendInfo(current.extracellular_water, previous?.extracellular_water, false) 
 },
 {
 label:"Phase Angle",
 value: current.phase_angle,
 unit:"°",
 icon: Activity,
 iconBg:"bg-indigo-50 ",
 iconColor:"text-indigo-500 ",
 trend: getTrendInfo(current.phase_angle, previous?.phase_angle, false) 
 },
 {
 label:"BMR",
 value: current.bmr,
 unit:"Kcal",
 icon: Flame,
 iconBg:"bg-orange-50 ",
 iconColor:"text-orange-500 ",
 trend: getTrendInfo(current.bmr, previous?.bmr, false) 
 },
 {
 label:"TDEE",
 value: current.tdee,
 unit:"Kcal",
 icon: Flame,
 iconBg:"bg-red-50 ",
 iconColor:"text-red-500 ",
 trend: getTrendInfo(current.tdee, previous?.tdee, false) 
 },
 {
 label:"Metabolic Age",
 value: current.metabolic_age,
 unit:"Yrs",
 icon: User,
 iconBg:"bg-purple-50 ",
 iconColor:"text-purple-500 ",
 trend: getTrendInfo(current.metabolic_age, previous?.metabolic_age, true) 
 },
 {
 label:"Other Mass",
 value: current.other_mass,
 unit:"kg",
 icon: Activity,
 iconBg:"bg-gray-100 ",
 iconColor:"text-gray-500 ",
 trend: getTrendInfo(current.other_mass, previous?.other_mass, false) 
 }
 ];

 return (
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
 {metrics.map((metric, idx) => {
 const TrendIcon = metric.trend.icon;
 return (
 <div key={idx} className="bg-white border border-zinc-200 rounded-xl p-3 shadow-sm flex flex-col gap-2.5 transition-all hover:shadow-md">
 
 
 <div className="flex items-center gap-2">
 <div className={`p-1.5 rounded-md ${metric.iconBg}`}>
 <metric.icon className={`w-3.5 h-3.5 ${metric.iconColor}`} />
 </div>
 <h3 className="text-xs font-semibold text-zinc-900 tracking-tight truncate">
 {metric.label}
 </h3>
 </div>
 
 
 <div>
 <div className="flex items-baseline gap-1">
 <span className="text-xl font-bold tracking-tight text-zinc-950 ">
 {metric.value ?? '-'}
 </span>
 {metric.value && (
 <span className="text-xs font-medium text-zinc-500 ">
 {metric.unit}
 </span>
 )}
 </div>
 </div>

 
 <div className="pt-2 border-t border-zinc-100  mt-auto flex flex-col gap-1.5">
 {previous && metric.value ? (
 <div className="flex items-center gap-1.5">
 <div className={`flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded border ${metric.trend.badgeClass}`}>
 <TrendIcon strokeWidth={2.5} className="w-2.5 h-2.5" />
 <span>{metric.trend.text}</span>
 </div>
 <span className="text-[10px] text-zinc-500 font-medium truncate">
 vs {metric.trend.prevValue}{metric.unit}
 </span>
 </div>
 ) : (
 <span className="text-[10px] text-zinc-400  font-medium">
 {"No comparative data."}
 </span>
 )}
 </div>

 </div>
 );
 })}
 </div>
 );
}