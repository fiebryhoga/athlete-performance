

import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { X, Save, Activity, Scale, Target, Zap, Settings2 } from 'lucide-react';

export default function BenchmarkSettingsModal({ isOpen, onClose, currentBenchmarks }) {
 const { data, setData, post, processing, reset } = useForm({
 benchmarks: {}
 });

 const [localData, setLocalData] = useState(currentBenchmarks || {});
 const [activeTab, setActiveTab] = useState('bmi');

 useEffect(() => {
 if (isOpen) {
 setLocalData(currentBenchmarks || {});
 setData('benchmarks', currentBenchmarks || {});
 setActiveTab('bmi');
 }
 }, [isOpen, currentBenchmarks]);

 const tabs = [
 { id: 'bmi', label: 'BMI', icon: Scale, path: ['bmi'] },
 { id: 'bf_male', label: 'Body Fat (Men)', icon: Activity, path: ['body_fat', 'male'] },
 { id: 'bf_female', label: 'Body Fat (Women)', icon: Activity, path: ['body_fat', 'female'] },
 { id: 'visceral', label: 'Visceral Fat', icon: Target, path: ['visceral_fat'] },
 { id: 'phase_angle', label: 'Phase Angle', icon: Zap, path: ['phase_angle'] },
 ];

 const getNestedValue = (obj, path) => {
 return path.reduce((acc, part) => acc && acc[part], obj) || {};
 };

 const handleUpdate = (path, key, field, value) => {
 const newData = JSON.parse(JSON.stringify(localData));
 
 let current = newData;
 for (let i = 0; i < path.length; i++) {
 current = current[path[i]];
 }
 
 current[key][field] = field === 'min' || field === 'max' ? parseFloat(value) || 0 : value;
 
 setLocalData(newData);
 setData('benchmarks', newData);
 };

 const submit = (e) => {
 e.preventDefault();
 post(route('admin.composition-tests.benchmarks.store'), {
 preserveScroll: true,
 onSuccess: () => {
 onClose();
 reset();
 },
 });
 };

 const activeTabConfig = tabs.find(t => t.id === activeTab);
 const activeCategoryData = getNestedValue(localData, activeTabConfig.path);

 const colorOptions = [
 { value: 'blue', label: 'Blue (Low)' },
 { value: 'green', label: 'Green (Normal)' },
 { value: 'lime', label: 'Lime (Fitness)' },
 { value: 'yellow', label: 'Yellow (Upper Limit)' },
 { value: 'orange', label: 'Orange (High)' },
 { value: 'red', label: 'Red (Danger)' },
 ];

 
 const inputClass ="flex h-8 w-full rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-900    ";
 const labelClass ="text-xs font-semibold text-zinc-600  mb-1.5 block";

 return (
 <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
 <form onSubmit={submit} className="bg-white  rounded-xl overflow-hidden flex flex-col max-h-[85vh] shadow-2xl border border-zinc-200/50 ">
 
 {/* Header Modal */}
 <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200  shrink-0 bg-white  z-10">
 <div className="flex items-center gap-3">
 <div className="p-1.5 bg-zinc-100  rounded-lg border border-zinc-200  shadow-sm">
 <Settings2 size={18} className="text-zinc-900 " />
 </div>
 <div>
 <h2 className="text-base font-bold tracking-tight text-zinc-950  leading-none">
 {"Benchmark Configuration"}
 </h2>
 <p className="text-[11px] text-zinc-500  mt-1">
 {"Adjust analytics value ranges precisely."}
 </p>
 </div>
 </div>
 <button 
 type="button" 
 onClick={onClose}
 className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100   rounded-md transition-all focus:outline-none"
 >
 <X size={18} />
 </button>
 </div>

 {/* Body Modal - Split Layout */}
 <div className="flex flex-1 overflow-hidden flex-col md:flex-row relative bg-zinc-50/50 ">
 
 {/* Sidebar Navigasi - Disesuaikan lebarnya untuk 2xl */}
 <div className="w-full md:w-48 border-b md:border-b-0 md:border-r border-zinc-200  bg-white/50  p-3 shrink-0 overflow-x-auto md:overflow-y-auto">
 <nav className="flex md:flex-col gap-1 min-w-max md:min-w-0">
 {tabs.map((tab) => {
 const isActive = activeTab === tab.id;
 return (
 <button
 key={tab.id}
 type="button"
 onClick={() => setActiveTab(tab.id)}
 className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all ${
 isActive 
 ? 'bg-zinc-100  text-zinc-950  shadow-sm border border-zinc-200/80 ' 
 : 'text-zinc-600  hover:bg-zinc-50  hover:text-zinc-900  border border-transparent'
 }`}
 >
 <tab.icon size={14} className={isActive ? 'text-zinc-950 ' : 'text-zinc-400 '} />
 {tab.label}
 </button>
 );
 })}
 </nav>
 </div>

 {/* Area Form Input - Jarak & Padding dikurangi sedikit agar proporsional */}
 <div className="flex-1 overflow-y-auto p-4 md:p-5">
 <div className="space-y-4">
 {Object.entries(activeCategoryData).map(([key, item]) => (
 <div key={key} className="p-4 rounded-xl border border-zinc-200  bg-white  shadow-sm relative transition-all hover:border-zinc-300 ">
 
 {/* Card Header */}
 <div className="mb-3.5 pb-2.5 border-b border-zinc-100  flex items-center justify-between">
 <h4 className="text-[13px] font-bold text-zinc-900 ">
 {key.replace('_', ' ')}
 </h4>
 <div className={`w-2.5 h-2.5 rounded-full shadow-inner bg-${item.color}-500 ring-2 ring-${item.color}-500/20`} title={`Color: ${item.color}`}></div>
 </div>
 
 {/* Grid Input */}
 <div className="grid grid-cols-2 gap-x-4 gap-y-3">
 
 {/* Label */}
 <div className="col-span-2 sm:col-span-1">
 <label className={labelClass}>{"Display Label"}</label>
 <input 
 type="text" 
 value={item.label || ''}
 onChange={(e) => handleUpdate(activeTabConfig.path, key, 'label', e.target.value)}
 className={inputClass}
 />
 </div>

 {/* Warna */}
 <div className="col-span-2 sm:col-span-1">
 <label className={labelClass}>{"Indicator"}</label>
 <select 
 value={item.color || ''}
 onChange={(e) => handleUpdate(activeTabConfig.path, key, 'color', e.target.value)}
 className={inputClass}
 >
 {colorOptions.map(color => (
 <option key={color.value} value={color.value}>{color.label}</option>
 ))}
 </select>
 </div>

 {/* Min */}
 <div>
 <label className={labelClass}>{"Min"}</label>
 <input 
 type="number" 
 step="0.1"
 value={item.min ?? ''}
 onChange={(e) => handleUpdate(activeTabConfig.path, key, 'min', e.target.value)}
 className={`${inputClass} font-mono text-xs`}
 />
 </div>

 {/* Max */}
 <div>
 <label className={labelClass}>{"Max"}</label>
 <input 
 type="number" 
 step="0.1"
 value={item.max ?? ''}
 onChange={(e) => handleUpdate(activeTabConfig.path, key, 'max', e.target.value)}
 className={`${inputClass} font-mono text-xs`}
 />
 </div>

 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Footer Modal */}
 <div className="px-5 py-3 border-t border-zinc-200  bg-white  flex justify-end gap-2.5 shrink-0 z-10">
 <button
 type="button"
 onClick={onClose}
 className="inline-flex items-center justify-center rounded-lg text-[13px] font-semibold transition-colors focus-visible:outline-none border border-zinc-200 bg-white shadow-sm hover:bg-zinc-100 hover:text-zinc-900 h-8 px-4     "
 >
 {"Cancel"}
 </button>
 <button
 type="submit"
 disabled={processing}
 className="inline-flex items-center justify-center rounded-lg text-[13px] font-semibold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-900/90 h-8 px-4    gap-1.5"
 >
 <Save size={14} />
 {"Save"}
 </button>
 </div>
 </form>
 </Modal>
 );
}