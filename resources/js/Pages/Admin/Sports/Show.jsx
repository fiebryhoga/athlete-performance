import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2, Edit3, Target, Info, Timer, Ruler, Hash, Activity, Scale, X, Save, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const PARAM_CONFIG = {
    'points': { 
        label: 'points (score)', 
        unit: 'pts', 
        step: '1', 
        placeholder: '100', 
        hint: 'integer value (1-100)' 
    },
    'reps': { 
        label: 'repetitions', 
        unit: 'reps', 
        step: '1', 
        placeholder: '50', 
        hint: 'integer count' 
    },
    'cm': { 
        label: 'centimeters (cm)', 
        unit: 'cm', 
        step: '1', 
        placeholder: '120', 
        hint: 'integer height/distance' 
    },
    'second': { 
        label: 'seconds (s)', 
        unit: 's', 
        step: '1', 
        placeholder: '60', 
        hint: 'total seconds (integer)' 
    },
    'vo2max': { 
        label: 'vo2max', 
        unit: 'ml/kg/min', 
        step: '1', 
        placeholder: '55', 
        hint: 'integer value' 
    },
    'meter': { 
        label: 'meters (m)', 
        unit: 'm', 
        step: '0.01', 
        placeholder: '1.20', 
        hint: 'use dot (.) for decimals' 
    },
    'minute': { 
        label: 'minutes (min)', 
        unit: 'min', 
        step: '0.01', 
        placeholder: '2.50', 
        hint: 'use dot (.) for decimals' 
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
        if (confirm('are you sure? this will delete related performance data.')) {
            router.delete(route('admin.tests.destroy', id));
        }
    };

    const getParamIcon = (type) => {
        if (['second', 'minute'].includes(type)) return <Timer className="w-3 h-3" />;
        if (['cm', 'meter'].includes(type)) return <Ruler className="w-3 h-3" />;
        if (['vo2max'].includes(type)) return <Activity className="w-3 h-3" />;
        if (['reps', 'points'].includes(type)) return <Scale className="w-3 h-3" />;
        return <Hash className="w-3 h-3" />;
    };

    const activeConfig = PARAM_CONFIG[data.parameter_type] || PARAM_CONFIG['points'];

    return (
        <AdminLayout title={`manage: ${sport.name}`}>
            <Head title={sport.name} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <Link href={route('admin.sports.index')} className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-[#00488b] transition-colors mb-2 group  ">
                        <ArrowLeft className="w-3 h-3 mr-1 transition-transform group-hover:-translate-x-1" /> 
                        back to sports
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800   tracking-tight">{sport.name} configuration</h1>
                    <p className="text-slate-500 text-sm mt-1  ">manage physical test items and benchmarks.</p>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 max-w-sm shadow-sm">
                    <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm">
                        <Info className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-blue-800 mb-0.5  ">benchmark info</p>
                        <p className="text-[11px] text-blue-600/80 leading-relaxed  ">
                            set the standard target (100% score) for each test. ensure the unit matches the parameter type.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full hover:shadow-md transition-all duration-300 overflow-hidden group">
                        
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                            <h3 className="font-bold text-slate-700   flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#00488b]"></div>
                                {category.name}
                            </h3>
                            <button 
                                onClick={() => openAddModal(category)}
                                className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-400 hover:border-[#00488b] hover:bg-[#00488b] hover:text-white transition-all shadow-sm flex items-center justify-center"
                                title="add item"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-5 flex-1 bg-white">
                            {category.test_items.length > 0 ? (
                                <ul className="space-y-3">
                                    {category.test_items.map((test) => (
                                        <li key={test.id} className="relative bg-white p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50/50 hover:shadow-sm transition-all group/item">
                                            
                                            <div className="flex justify-between items-start mb-3">
                                                <p className="font-bold text-slate-800 text-sm   leading-tight pr-8">{test.name}</p>
                                                
                                                <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity absolute top-3 right-3 bg-white pl-2 shadow-[-10px_0_10px_white]">
                                                    <button 
                                                        onClick={() => openEditModal(test, category)}
                                                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteTest(test.id)}
                                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200  ">
                                                    {getParamIcon(test.parameter_type)}
                                                    {test.parameter_type}
                                                </span>
                                                
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100  ">
                                                    <Target className="w-3 h-3" />
                                                    target: {Number(test.target_value)} {test.unit}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="h-full min-h-[150px] flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-xl">
                                    <div className="p-3 bg-slate-50 rounded-full mb-2">
                                        <Target className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <p className="text-xs font-medium  ">no items yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>

                    <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800  ">
                                    {modalMode === 'create' ? 'add new item' : 'edit test item'}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium   mt-0.5">
                                    category: <span className="text-[#00488b] font-bold">{selectedCategory?.name}</span>
                                </p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={submitForm} className="p-6 space-y-6">
                            
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">item name</label>
                                <input 
                                    type="text" 
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-[#00488b] focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium placeholder:font-normal lowercase"
                                    placeholder="e.g. 100m sprint"
                                    autoFocus
                                />
                                {errors.name && <p className="text-red-500 text-xs font-bold ml-1">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">parameter type</label>
                                <div className="relative">
                                    <select 
                                        value={data.parameter_type}
                                        onChange={e => setData('parameter_type', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-[#00488b] focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium   appearance-none"
                                    >
                                        {Object.entries(PARAM_CONFIG).map(([key, config]) => (
                                            <option key={key} value={key}>{config.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                                        <ArrowLeft className="w-4 h-4 -rotate-90" />
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 flex items-center gap-1.5 ml-1  ">
                                    <Info className="w-3 h-3" /> 
                                    auto unit: <span className="font-bold text-slate-600 bg-slate-100 px-1.5 rounded">{activeConfig.unit}</span>
                                </p>
                            </div>

                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-2">
                                <label className="block text-xs font-bold text-[#00488b] uppercase tracking-wide ml-1">
                                    target benchmark (100%)
                                </label>
                                
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Target className="h-4 w-4 text-blue-400 group-focus-within:text-[#00488b] transition-colors" />
                                    </div>
                                    <input 
                                        type="number" 
                                        step={activeConfig.step}
                                        value={data.target_value}
                                        onChange={e => setData('target_value', e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 rounded-xl border-blue-200 bg-white focus:border-[#00488b] focus:ring-4 focus:ring-blue-500/10 transition-all text-sm text-[#00488b] font-bold placeholder-blue-200"
                                        placeholder={activeConfig.placeholder}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <span className="text-xs font-bold text-blue-400 bg-blue-50 px-2 py-1 rounded-md  ">{activeConfig.unit}</span>
                                    </div>
                                </div>
                                
                                <p className="text-[10px] text-slate-500 font-medium ml-1 flex items-center gap-1.5  ">
                                    <AlertCircle className="w-3 h-3 text-amber-500" />
                                    format: {activeConfig.hint}
                                </p>
                                
                                {errors.target_value && <p className="text-red-500 text-xs font-bold ml-1">{errors.target_value}</p>}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="flex-1 px-5 py-3 text-slate-500 font-bold text-sm hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-colors lowercase"
                                >
                                    cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="flex-[2] px-6 py-3 bg-[#00488b] text-white font-bold text-sm rounded-xl hover:bg-[#003666] transition-colors shadow-lg shadow-blue-900/10 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 flex items-center justify-center gap-2 lowercase"
                                >
                                    {processing ? (
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    {processing ? 'saving...' : (modalMode === 'create' ? 'save item' : 'update item')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}