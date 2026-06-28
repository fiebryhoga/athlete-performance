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

        current[key][field] = field === 'max' ? (value === '' ? '' : value) : value;
        
        // Auto-recalculate min based on max order
        let previousMax = -0.1;
        for (const k of Object.keys(current)) {
            current[k].min = parseFloat((previousMax + 0.1).toFixed(1));
            previousMax = parseFloat(current[k].max) || 0;
        }
        
        setLocalData(newData);
        setData('benchmarks', newData);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.composition-tests.save-benchmarks'), {
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

    const inputClass = "flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4d00]/20 focus-visible:border-[#ff4d00]";
    const labelClass = "text-xs font-bold text-slate-600 mb-1.5 block";

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <form onSubmit={submit} className="bg-white rounded-2xl overflow-hidden flex flex-col max-h-[85vh] shadow-2xl border border-slate-100 relative">
                
                {/* Header Modal */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0 bg-white z-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-2xl -mr-10 -mt-10 opacity-70 pointer-events-none"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-2.5 bg-orange-50 rounded-xl border border-orange-100 shadow-sm text-[#ff4d00]">
                            <Settings2 size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                                Benchmark Configuration
                            </h2>
                            <p className="text-xs font-medium text-slate-500 mt-1.5">
                                Adjust analytics value ranges precisely.
                            </p>
                        </div>
                    </div>
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="relative z-10 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all focus:outline-none"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body Modal - Split Layout */}
                <div className="flex flex-1 overflow-hidden flex-col md:flex-row relative bg-slate-50/50">
                    
                    {/* Sidebar Navigasi */}
                    <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 p-4 shrink-0 overflow-x-auto md:overflow-y-auto custom-scrollbar">
                        <nav className="flex md:flex-col gap-1.5 min-w-max md:min-w-0">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                            isActive 
                                                ? 'bg-white text-[#ff4d00] shadow-sm border border-slate-200 ring-1 ring-black/5' 
                                                : 'text-slate-500 hover:bg-white hover:text-slate-800 border border-transparent hover:shadow-sm'
                                        }`}
                                    >
                                        <tab.icon size={16} className={isActive ? 'text-[#ff4d00]' : 'text-slate-400'} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Area Form Input */}
                    <div className="flex-1 overflow-y-auto p-5 md:p-6 custom-scrollbar bg-slate-50/30">
                        <div className="space-y-4">
                            {Object.entries(activeCategoryData).map(([key, item]) => (
                                <div key={key} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm relative transition-all hover:border-[#ff4d00]/30 hover:shadow-md">
                                    
                                    {/* Card Header */}
                                    <div className="mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                                        <h4 className="text-sm font-extrabold text-slate-800 capitalize tracking-tight">
                                            {key.replace(/_/g, ' ')}
                                        </h4>
                                        <div className={`w-3 h-3 rounded-full shadow-inner bg-${item.color}-500 ring-4 ring-${item.color}-500/20`} title={`Color: ${item.color}`}></div>
                                    </div>
                                    
                                    {/* Grid Input */}
                                    <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                                        
                                        {/* Label */}
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className={labelClass}>Display Label</label>
                                            <input 
                                                type="text" 
                                                value={item.label || ''}
                                                onChange={(e) => handleUpdate(activeTabConfig.path, key, 'label', e.target.value)}
                                                className={inputClass}
                                            />
                                        </div>

                                        {/* Warna */}
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className={labelClass}>Indicator</label>
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

                                        {/* Range */}
                                        <div className="col-span-2">
                                            <label className={labelClass}>Value Range (Min — Max)</label>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 flex h-9 items-center justify-center bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-500 shadow-inner cursor-not-allowed">
                                                    {item.min ?? 0}
                                                </div>
                                                <span className="text-slate-300 font-bold">—</span>
                                                <input 
                                                    type="number" 
                                                    step="0.1"
                                                    value={item.max ?? ''}
                                                    onChange={(e) => handleUpdate(activeTabConfig.path, key, 'max', e.target.value)}
                                                    className={`${inputClass} flex-1 text-center font-mono font-bold`}
                                                    placeholder="Max..."
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Modal */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0 z-10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center justify-center rounded-xl text-sm font-bold transition-colors focus-visible:outline-none border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900 h-10 px-5 text-slate-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-[#ff4d00] text-white shadow-lg shadow-[#ff4d00]/20 hover:bg-[#e64500] h-10 px-6 gap-2"
                    >
                        <Save size={16} />
                        Save Configuration
                    </button>
                </div>
            </form>
        </Modal>
    );
}