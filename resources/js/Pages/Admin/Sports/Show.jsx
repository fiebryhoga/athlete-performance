import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2, Edit3, Target, Info, Timer, Ruler, Hash, Activity, Scale, X, Save, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const PARAM_CONFIG = {
    'points': { 
        label: 'Points (Score)', 
        unit: 'pts', 
        step: '1', 
        placeholder: '100', 
        hint: 'Integer value (1-100)' 
    },
    'reps': { 
        label: 'Repetitions', 
        unit: 'reps', 
        step: '1', 
        placeholder: '50', 
        hint: 'Integer count' 
    },
    'cm': { 
        label: 'Centimeters (cm)', 
        unit: 'cm', 
        step: '1', 
        placeholder: '120', 
        hint: 'Integer height/distance' 
    },
    'second': { 
        label: 'Seconds (s)', 
        unit: 's', 
        step: '1', 
        placeholder: '60', 
        hint: 'Total seconds (integer)' 
    },
    'vo2max': { 
        label: 'VO2Max', 
        unit: 'ml/kg/min', 
        step: '1', 
        placeholder: '55', 
        hint: 'Integer value' 
    },
    'meter': { 
        label: 'Meters (m)', 
        unit: 'm', 
        step: '0.01', 
        placeholder: '1.20', 
        hint: 'Use dot (.) for decimals' 
    },
    'minute': { 
        label: 'Minutes (min)', 
        unit: 'min', 
        step: '0.01', 
        placeholder: '2.50', 
        hint: 'Use dot (.) for decimals' 
    }
};

export default function Show({ sport, categories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); 
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [editingItem, setEditingItem] = useState(null);

    const { data, setData, post, put, processing, reset, errors, clearErrors } = useForm({
        category_id: '',
        name: '',
        parameter_type: 'points',
        unit: 'pts',
        target_value: '',
    });

    useEffect(() => {
        if (PARAM_CONFIG[data.parameter_type]) {
            setData('unit', PARAM_CONFIG[data.parameter_type].unit);
        }
    }, [data.parameter_type]);

    const openAddModal = (category) => {
        setModalMode('create');
        setSelectedCategory(category);
        clearErrors();
        reset();
        setData({
            category_id: category.id,
            name: '',
            parameter_type: 'points',
            unit: 'pts',
            target_value: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item, category) => {
        setModalMode('edit');
        setEditingItem(item);
        setSelectedCategory(category);
        clearErrors();
        setData({
            category_id: category.id,
            name: item.name,
            parameter_type: item.parameter_type,
            unit: item.unit,
            target_value: item.target_value
        });
        setIsModalOpen(true);
    };

    const submitForm = (e) => {
        e.preventDefault();
        
        if (modalMode === 'create') {
            post(route('admin.sports.tests.store', sport.id), {
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            put(route('admin.tests.update', editingItem.id), {
                onSuccess: () => setIsModalOpen(false)
            });
        }
    };

    const deleteTest = (id) => {
        if (confirm('Are you sure? This will delete related performance data.')) {
            router.delete(route('admin.tests.destroy', id));
        }
    };

    const getParamIcon = (type) => {
        if (['second', 'minute'].includes(type)) return <Timer className="w-3.5 h-3.5 md:w-3 md:h-3" />;
        if (['cm', 'meter'].includes(type)) return <Ruler className="w-3.5 h-3.5 md:w-3 md:h-3" />;
        if (['vo2max'].includes(type)) return <Activity className="w-3.5 h-3.5 md:w-3 md:h-3" />;
        if (['reps', 'points'].includes(type)) return <Scale className="w-3.5 h-3.5 md:w-3 md:h-3" />;
        return <Hash className="w-3.5 h-3.5 md:w-3 md:h-3" />;
    };

    const activeConfig = PARAM_CONFIG[data.parameter_type] || PARAM_CONFIG['points'];

    return (
        <AdminLayout title={`Manage: ${sport.name}`}>
            <Head title={sport.name} />

            <div className="w-full max-w-[1400px] mx-auto pb-12">
                
                
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 md:gap-6 mb-6 md:mb-8">
                    <div className="w-full lg:w-auto">
                        <Link href={route('admin.sports.index')} className="inline-flex items-center text-[10px] md:text-xs font-bold text-slate-400 hover:text-[#ff4d00] transition-colors mb-2 md:mb-3 group uppercase tracking-widest touch-manipulation py-1">
                            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-1.5 transition-transform group-hover:-translate-x-1" /> 
                            Back to Sports
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2 flex-wrap">
                            {sport.name} <span className="text-slate-300 font-light hidden sm:inline">|</span> <span className="text-xl md:text-3xl text-slate-600 sm:text-slate-800">Configuration</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-xs md:text-sm mt-1.5">Manage physical test items and performance benchmarks.</p>
                    </div>
                    
                    
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3 w-full lg:max-w-sm shadow-sm shrink-0">
                        <div className="p-2 bg-white rounded-lg text-[#ff4d00] shadow-sm shrink-0">
                            <Info className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] md:text-xs font-bold text-orange-900 mb-0.5 uppercase tracking-widest">Benchmark Info</p>
                            <p className="text-[11px] md:text-xs text-orange-800/80 font-medium leading-relaxed">
                                Set the standard target (100% score) for each test. Ensure the unit matches the parameter type.
                            </p>
                        </div>
                    </div>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {categories.map((category) => (
                        <div key={category.id} className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full hover:shadow-md hover:border-orange-200 transition-all duration-300 overflow-hidden group">
                            
                            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-xs md:text-sm uppercase tracking-wider">
                                    <div className="w-2 h-2 rounded-full bg-[#ff4d00]"></div>
                                    {category.name}
                                </h3>
                                <button 
                                    onClick={() => openAddModal(category)}
                                    className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-white border border-slate-200 text-slate-400 hover:border-[#ff4d00] hover:bg-[#ff4d00] hover:text-white transition-all shadow-sm flex items-center justify-center touch-manipulation"
                                    title="Add Item"
                                >
                                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </div>

                            <div className="p-4 md:p-5 flex-1 bg-white">
                                {category.test_items.length > 0 ? (
                                    <ul className="space-y-3">
                                        {category.test_items.map((test) => (
                                            <li key={test.id} className="relative bg-white p-4 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 hover:shadow-sm transition-all group/item flex flex-col gap-3">
                                                
                                                
                                                <div className="flex justify-between items-start gap-3">
                                                    <p className="font-bold text-slate-800 text-sm leading-tight flex-1">{test.name}</p>
                                                    
                                                    
                                                    <div className="flex gap-1.5 opacity-100 lg:opacity-0 lg:group-hover/item:opacity-100 transition-opacity bg-white/80 lg:bg-white pl-1 shrink-0">
                                                        <button 
                                                            onClick={() => openEditModal(test, category)}
                                                            className="p-2 lg:p-1.5 text-slate-400 hover:text-amber-600 bg-slate-50 hover:bg-amber-50 rounded-lg transition-colors touch-manipulation"
                                                            title="Edit Test"
                                                        >
                                                            <Edit3 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => deleteTest(test.id)}
                                                            className="p-2 lg:p-1.5 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-lg transition-colors touch-manipulation"
                                                            title="Delete Test"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] md:text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-widest">
                                                        {getParamIcon(test.parameter_type)}
                                                        {test.parameter_type}
                                                    </span>
                                                    
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] md:text-[10px] font-bold bg-orange-50 text-[#ff4d00] border border-orange-100 uppercase tracking-widest">
                                                        <Target className="w-3 h-3" />
                                                        Target: {Number(test.target_value)} {test.unit}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="h-full min-h-[150px] flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                                        <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100 mb-3">
                                            <Target className="w-5 h-5 md:w-6 md:h-6 text-slate-300" />
                                        </div>
                                        <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest">No Items Yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>

                    
                    <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        
                        <div className="px-5 md:px-6 py-4 md:py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="font-bold text-base md:text-lg text-slate-800 flex items-center gap-2">
                                    {modalMode === 'create' ? 'Add New Item' : 'Edit Test Item'}
                                </h3>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-0.5">
                                    Category: <span className="text-[#ff4d00] font-bold uppercase tracking-wider ml-1">{selectedCategory?.name}</span>
                                </p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-rose-500 bg-white border border-slate-200 hover:bg-rose-50 rounded-full transition-all touch-manipulation">
                                <X className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        </div>
                        
                        
                        <div className="overflow-y-auto custom-scrollbar flex-1">
                            <form onSubmit={submitForm} className="p-5 md:p-6 space-y-5 md:space-y-6">
                                
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Item Name</label>
                                    <input 
                                        type="text" 
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full px-4 py-3 md:py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]/20 transition-all text-sm font-medium outline-none shadow-sm touch-manipulation"
                                        placeholder="e.g. 100m Sprint"
                                        autoFocus
                                    />
                                    {errors.name && <p className="text-rose-500 text-[10px] md:text-xs font-bold ml-1">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Parameter Type</label>
                                    <div className="relative">
                                        <select 
                                            value={data.parameter_type}
                                            onChange={e => setData('parameter_type', e.target.value)}
                                            className="w-full px-4 py-3 md:py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]/20 transition-all text-sm font-medium appearance-none outline-none shadow-sm touch-manipulation"
                                        >
                                            {Object.entries(PARAM_CONFIG).map(([key, config]) => (
                                                <option key={key} value={key}>{config.label}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                                            <ArrowLeft className="w-4 h-4 -rotate-90" />
                                        </div>
                                    </div>
                                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 flex items-center gap-1.5 ml-1 mt-1.5 uppercase tracking-widest">
                                        <Info className="w-3 h-3" /> 
                                        Auto Unit: <span className="font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{activeConfig.unit}</span>
                                    </p>
                                </div>

                                <div className="bg-orange-50/50 p-4 md:p-5 rounded-xl border border-orange-100 space-y-2">
                                    <label className="block text-[10px] font-bold text-[#ff4d00] uppercase tracking-widest ml-1">
                                        Target Benchmark (100%)
                                    </label>
                                    
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Target className="h-4 w-4 md:h-5 md:w-5 text-orange-400 group-focus-within:text-[#ff4d00] transition-colors" />
                                        </div>
                                        <input 
                                            type="number" 
                                            step={activeConfig.step}
                                            value={data.target_value}
                                            onChange={e => setData('target_value', e.target.value)}
                                            className="w-full pl-11 pr-16 py-3.5 md:py-3 rounded-lg border border-orange-200 bg-white focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]/20 transition-all text-sm text-[#ff4d00] font-bold placeholder-orange-200 outline-none shadow-sm touch-manipulation"
                                            placeholder={activeConfig.placeholder}
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-[9px] md:text-[10px] font-bold text-orange-500 bg-orange-100 px-2 py-1 rounded-md uppercase">{activeConfig.unit}</span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-[9px] md:text-[10px] text-slate-500 font-medium ml-1 flex items-center gap-1.5 mt-2">
                                        <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
                                        Format: {activeConfig.hint}
                                    </p>
                                    
                                    {errors.target_value && <p className="text-rose-500 text-[10px] md:text-xs font-bold ml-1">{errors.target_value}</p>}
                                </div>

                                <div className="flex gap-2 md:gap-3 pt-5 border-t border-slate-100">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)} 
                                        className="flex-1 px-4 py-3 md:py-2.5 text-slate-500 bg-slate-100 border border-slate-200 font-bold text-xs md:text-sm hover:bg-slate-200 hover:text-slate-700 rounded-lg transition-colors touch-manipulation"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={processing} 
                                        className="flex-[2] px-4 py-3 md:py-2.5 bg-[#ff4d00] text-white font-bold text-xs md:text-sm rounded-lg hover:bg-[#e64500] transition-colors shadow-lg shadow-[#ff4d00]/20 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 touch-manipulation"
                                    >
                                        {processing ? (
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        {processing ? 'Menyimpan...' : (modalMode === 'create' ? 'Simpan Item' : 'Update Item')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}