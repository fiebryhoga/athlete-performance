import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { 
    ChevronLeft, 
    Plus, 
    Trash2, 
    Edit3, 
    Target, 
    Info, 
    Timer, 
    Ruler, 
    Hash, 
    Activity, 
    Scale, 
    X, 
    Save, 
    AlertCircle,
    Dumbbell,
    Trophy,
    CheckCircle2,
    Layers,
    SlidersHorizontal,
    TrendingDown
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import PageHeader from '@/Components/Common/PageHeader';

const PARAM_CONFIG = {
    'points': { 
        label: 'Points (Score)', 
        unit: 'pts', 
        step: '1', 
        placeholder: '100', 
        hint: 'Nilai integer (1-100)' 
    },
    'reps': { 
        label: 'Repetisi (Reps)', 
        unit: 'reps', 
        step: '1', 
        placeholder: '50', 
        hint: 'Jumlah repetisi (integer)' 
    },
    'cm': { 
        label: 'Sentimeter (cm)', 
        unit: 'cm', 
        step: '1', 
        placeholder: '120', 
        hint: 'Jarak / tinggi dalam cm' 
    },
    'second': { 
        label: 'Detik (s)', 
        unit: 's', 
        step: '1', 
        placeholder: '60', 
        hint: 'Waktu tempuh (detik)' 
    },
    'vo2max': { 
        label: 'VO2Max', 
        unit: 'ml/kg/min', 
        step: '1', 
        placeholder: '55', 
        hint: 'Nilai kapasitas aerobik' 
    },
    'meter': { 
        label: 'Meter (m)', 
        unit: 'm', 
        step: '0.01', 
        placeholder: '1.20', 
        hint: 'Gunakan titik (.) untuk desimal' 
    },
    'minute': { 
        label: 'Menit (min)', 
        unit: 'min', 
        step: '0.01', 
        placeholder: '2.50', 
        hint: 'Gunakan titik (.) untuk desimal' 
    },
    'kg': {
        label: 'Kilogram (kg)',
        unit: 'kg',
        step: '0.1',
        placeholder: '50.0',
        hint: 'Gunakan titik (.) untuk desimal'
    },
    'n': {
        label: 'Newton (N)',
        unit: 'N',
        step: '0.1',
        placeholder: '100.0',
        hint: 'Gunakan titik (.) untuk desimal'
    },
    'n_kg': {
        label: 'Newton per Kg (N/kg)',
        unit: 'N/kg',
        step: '0.1',
        placeholder: '10.0',
        hint: 'Gunakan titik (.) untuk desimal'
    },
    'percent': {
        label: 'Persentase (%)',
        unit: '%',
        step: '0.1',
        placeholder: '50.0',
        hint: 'Gunakan titik (.) untuk desimal'
    },
    'watt': {
        label: 'Watt (W)',
        unit: 'W',
        step: '0.1',
        placeholder: '300.0',
        hint: 'Gunakan titik (.) untuk desimal'
    },
    'degree': {
        label: 'Derajat (°)',
        unit: '°',
        step: '0.1',
        placeholder: '90.0',
        hint: 'Gunakan titik (.) untuk desimal'
    }
};

export default function Show({ sport, categories = [] }) {
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
        is_lower_better: false,
    });

    useEffect(() => {
        if (PARAM_CONFIG[data.parameter_type]) {
            setData('unit', PARAM_CONFIG[data.parameter_type].unit);
        }
    }, [data.parameter_type]);

    const totalTests = useMemo(() => {
        return categories.reduce((sum, cat) => sum + (cat.test_items?.length || 0), 0);
    }, [categories]);

    const activeCategoriesCount = useMemo(() => {
        return categories.filter(cat => (cat.test_items?.length || 0) > 0).length;
    }, [categories]);

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
            target_value: '',
            is_lower_better: false
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
            target_value: item.target_value,
            is_lower_better: Boolean(item.is_lower_better)
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
        if (confirm('Apakah Anda yakin ingin menghapus item tes ini? Data performa terkait juga akan terpengaruh.')) {
            router.delete(route('admin.tests.destroy', id));
        }
    };

    const getParamIcon = (type) => {
        if (['second', 'minute'].includes(type)) return <Timer size={12} className="text-sky-500" />;
        if (['cm', 'meter', 'degree'].includes(type)) return <Ruler size={12} className="text-emerald-500" />;
        if (['vo2max', 'watt', 'percent'].includes(type)) return <Activity size={12} className="text-rose-500" />;
        if (['reps', 'points', 'n', 'n_kg', 'kg'].includes(type)) return <Scale size={12} className="text-amber-500" />;
        return <Hash size={12} className="text-slate-400" />;
    };

    const activeConfig = PARAM_CONFIG[data.parameter_type] || PARAM_CONFIG['points'];

    return (
        <AppLayout title={`Konfigurasi: ${sport.name}`}>
            <Head title={`Konfigurasi - ${sport.name}`} />

            <div className="space-y-4 pb-16">
                {/* ─── PAGE HEADER ─── */}
                <div className="space-y-1">
                    <Link 
                        href={route('admin.sports.index')} 
                        className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors gap-1.5"
                    >
                        <ChevronLeft size={14} />
                        <span>Kembali ke Kategori Olahraga</span>
                    </Link>

                    <PageHeader 
                        title={`Konfigurasi: ${sport.name}`}
                        description="Kelola item tes fisik dan target benchmark performa standar (100% score) untuk kategori olahraga ini."
                        actions={
                            <Link 
                                href={route('admin.sports.index')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                            >
                                <ChevronLeft size={14} />
                                <span>Daftar Olahraga</span>
                            </Link>
                        }
                    />
                </div>

                {/* ─── 2-COLUMN DASHBOARD LAYOUT (KANAN - KIRI) ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    {/* ═══════════════════════════════════════
                        KOLOM KIRI (LEBAR): Grid Kategori Tes Fisik
                       ═══════════════════════════════════════ */}
                    <div className="order-1 lg:col-span-8 xl:col-span-8 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {categories.map((category) => {
                                const itemCount = category.test_items?.length || 0;
                                return (
                                    <div 
                                        key={category.id} 
                                        className="bg-white rounded-md border border-slate-200/80 shadow-2xs flex flex-col h-full hover:border-slate-300 transition-all overflow-hidden"
                                    >
                                        {/* Card Header */}
                                        <div className="px-4 py-2.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                                                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                                                    {category.name}
                                                </h3>
                                                <span className="text-[11px] font-medium text-slate-400">
                                                    ({itemCount})
                                                </span>
                                            </div>

                                            <button 
                                                type="button"
                                                onClick={() => openAddModal(category)}
                                                className="w-6 h-6 rounded-md bg-white border border-slate-200/90 text-slate-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-2xs flex items-center justify-center cursor-pointer"
                                                title={`Tambah tes ke ${category.name}`}
                                            >
                                                <Plus size={13} />
                                            </button>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-3 sm:p-3.5 flex-1 bg-white flex flex-col justify-between">
                                            {itemCount > 0 ? (
                                                <ul className="space-y-2">
                                                    {category.test_items.map((test) => (
                                                        <li 
                                                            key={test.id} 
                                                            className="bg-slate-50/60 p-2.5 rounded-md border border-slate-100/90 hover:border-orange-200 hover:bg-orange-50/20 transition-all flex items-center justify-between gap-2 group"
                                                        >
                                                            <div className="space-y-1 min-w-0 flex-1">
                                                                <p className="font-bold text-slate-900 text-xs truncate">
                                                                    {test.name}
                                                                </p>

                                                                <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                                                                    <span className="inline-flex items-center gap-1 font-medium">
                                                                        {getParamIcon(test.parameter_type)}
                                                                        <span>{PARAM_CONFIG[test.parameter_type]?.label || test.parameter_type}</span>
                                                                    </span>
                                                                    <span className="text-slate-300">•</span>
                                                                    <span className="font-bold text-slate-800">
                                                                        Target: {Number(test.target_value)} {test.unit}
                                                                    </span>
                                                                    {test.is_lower_better && (
                                                                        <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 font-semibold" title="Nilai lebih rendah lebih baik">
                                                                            <TrendingDown size={11} />
                                                                            <span>Lower is better</span>
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Action buttons */}
                                                            <div className="flex items-center gap-1 shrink-0">
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => openEditModal(test, category)}
                                                                    className="p-1 text-slate-400 hover:text-slate-800 hover:bg-white rounded transition-colors cursor-pointer"
                                                                    title="Edit item tes"
                                                                >
                                                                    <Edit3 size={13} />
                                                                </button>
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => deleteTest(test.id)}
                                                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded transition-colors cursor-pointer"
                                                                    title="Hapus item tes"
                                                                >
                                                                    <Trash2 size={13} />
                                                                </button>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="py-6 px-3 text-center border border-dashed border-slate-200/80 rounded-md bg-slate-50/40 flex flex-col items-center justify-center space-y-1">
                                                    <Target size={20} className="text-slate-300 mx-auto" />
                                                    <p className="text-xs font-semibold text-slate-500">Belum ada item tes</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => openAddModal(category)}
                                                        className="text-[11px] font-bold text-orange-600 hover:text-orange-700 cursor-pointer pt-0.5"
                                                    >
                                                        + Tambah Tes
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════
                        KOLOM KANAN (SIDEBAR): Profil Kategori & Petunjuk Benchmark
                       ═══════════════════════════════════════ */}
                    <div className="order-2 lg:col-span-4 xl:col-span-4 space-y-4 lg:sticky lg:top-4">
                        {/* Card 1: Informasi Kategori Olahraga */}
                        <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                            <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <Trophy size={14} className="text-orange-500" />
                                    <h3 className="text-xs font-bold text-slate-900">Informasi Olahraga</h3>
                                </div>
                                <span className="text-[11px] font-bold text-orange-600">
                                    {totalTests} Parameter
                                </span>
                            </div>

                            <div className="p-4 space-y-3">
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                        Nama Olahraga
                                    </span>
                                    <h4 className="text-sm font-bold text-slate-900">
                                        {sport.name}
                                    </h4>
                                    {sport.description && (
                                        <p className="text-xs text-slate-500 leading-relaxed pt-1">
                                            {sport.description}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-2 border-t border-slate-100 divide-y divide-slate-100 text-xs">
                                    <div className="py-2 flex items-center justify-between">
                                        <span className="text-slate-500 font-medium">Total Parameter Aktif</span>
                                        <span className="font-bold text-slate-900">{totalTests} Tes Fisik</span>
                                    </div>
                                    <div className="py-2 flex items-center justify-between">
                                        <span className="text-slate-500 font-medium">Kategori Terkonfigurasi</span>
                                        <span className="font-bold text-slate-900">{activeCategoriesCount} dari {categories.length} Bidang</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Petunjuk Target Benchmark */}
                        <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                            <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center gap-1.5">
                                <Info size={14} className="text-orange-500" />
                                <h3 className="text-xs font-bold text-slate-900">Petunjuk Standar Benchmark</h3>
                            </div>

                            <div className="p-4 space-y-2.5 text-xs text-slate-600 leading-relaxed">
                                <p>
                                    Target benchmark merepresentasikan capaian skor maksimal <strong className="text-slate-900">(100% score)</strong> untuk masing-masing tes fisik.
                                </p>
                                <p className="text-[11.5px] text-slate-500">
                                    Pastikan satuan yang dipilih sesuai dengan alat uji fisik yang digunakan di lapangan.
                                </p>

                                <div className="pt-2 border-t border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                                        Satuan yang Didukung
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                        {Object.entries(PARAM_CONFIG).map(([key, cfg]) => (
                                            <span 
                                                key={key} 
                                                className="text-[10px] font-medium text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/80"
                                                title={cfg.hint}
                                            >
                                                {cfg.label} ({cfg.unit})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Daftar Kategori Cepat */}
                        <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                            <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <Layers size={13.5} className="text-slate-500" />
                                    <h3 className="text-xs font-bold text-slate-900">Daftar Kategori</h3>
                                </div>
                                <span className="text-[11px] font-medium text-slate-400">
                                    {categories.length} Bidang
                                </span>
                            </div>

                            <div className="divide-y divide-slate-100 text-xs">
                                {categories.map((cat) => {
                                    const count = cat.test_items?.length || 0;
                                    return (
                                        <div 
                                            key={cat.id} 
                                            className="px-4 py-2 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                                        >
                                            <span className="font-medium text-slate-700">{cat.name}</span>
                                            <span className={`text-[11px] font-bold ${count > 0 ? 'text-orange-600' : 'text-slate-400'}`}>
                                                {count} tes
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── MODAL ADD / EDIT TEST ITEM ─── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
                        onClick={() => setIsModalOpen(false)}
                    />

                    <div className="relative bg-white w-full max-w-md rounded-md shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                                    {modalMode === 'create' ? (
                                        <Plus size={14} className="text-orange-500" />
                                    ) : (
                                        <Edit3 size={14} className="text-orange-500" />
                                    )}
                                    <span>{modalMode === 'create' ? 'Tambah Item Tes Fisik' : 'Edit Item Tes Fisik'}</span>
                                </h3>
                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                    Kategori: <span className="text-orange-600 font-bold ml-0.5">{selectedCategory?.name}</span>
                                </p>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setIsModalOpen(false)} 
                                className="p-1 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-md transition-colors cursor-pointer"
                            >
                                <X size={14} />
                            </button>
                        </div>
                        
                        {/* Modal Form Content */}
                        <div className="overflow-y-auto custom-scrollbar flex-1">
                            <form onSubmit={submitForm} className="p-4 sm:p-5 space-y-4">
                                {/* Item Name */}
                                <div className="space-y-1">
                                    <label className="block text-[11px] font-bold text-slate-700">
                                        Nama Item Tes
                                    </label>
                                    <input 
                                        type="text" 
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold text-slate-800 shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                        placeholder="Contoh: 100m Sprint, Vertical Jump"
                                        required
                                        autoFocus
                                    />
                                    {errors.name && <p className="text-rose-500 text-[10.5px] font-bold mt-0.5">{errors.name}</p>}
                                </div>

                                {/* Parameter Type */}
                                <div className="space-y-1">
                                    <label className="block text-[11px] font-bold text-slate-700">
                                        Tipe Parameter & Satuan
                                    </label>
                                    <select 
                                        value={data.parameter_type}
                                        onChange={e => setData('parameter_type', e.target.value)}
                                        className="w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold text-slate-800 shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all cursor-pointer"
                                    >
                                        {Object.entries(PARAM_CONFIG).map(([key, config]) => (
                                            <option key={key} value={key}>
                                                {config.label} ({config.unit})
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1 mt-1">
                                        <Info size={11} /> 
                                        Satuan otomatis: <span className="font-bold text-slate-700 bg-slate-100 px-1 py-0.2 rounded border border-slate-200/60">{activeConfig.unit}</span>
                                    </p>
                                </div>

                                {/* Target Benchmark */}
                                <div className="bg-orange-50/40 p-3.5 rounded-md border border-orange-200/60 space-y-1.5">
                                    <label className="block text-[11px] font-bold text-orange-800">
                                        Target Benchmark (100% Score)
                                    </label>
                                    
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Target size={14} className="text-orange-500" />
                                        </div>
                                        <input 
                                            type="number" 
                                            step={activeConfig.step}
                                            value={data.target_value}
                                            onChange={e => setData('target_value', e.target.value)}
                                            className="w-full pl-9 pr-14 py-2 rounded-md border border-orange-200 bg-white text-xs font-bold text-slate-900 shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                            placeholder={activeConfig.placeholder}
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                                            <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">
                                                {activeConfig.unit}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1 pt-0.5">
                                        <AlertCircle size={11} className="text-amber-500 shrink-0" />
                                        Format: {activeConfig.hint}
                                    </p>
                                    
                                    {errors.target_value && <p className="text-rose-500 text-[10.5px] font-bold">{errors.target_value}</p>}
                                </div>

                                {/* Lower is Better Checkbox */}
                                <label className="flex items-start gap-2.5 p-3 border border-slate-200 rounded-md bg-slate-50/70 hover:bg-slate-50 cursor-pointer transition-colors">
                                    <input 
                                        type="checkbox" 
                                        className="mt-0.5 rounded text-orange-600 focus:ring-orange-500 w-4 h-4 bg-white border-slate-300 cursor-pointer shrink-0" 
                                        checked={data.is_lower_better}
                                        onChange={e => setData('is_lower_better', e.target.checked)}
                                    />
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-slate-800">Semakin kecil nilai semakin bagus?</p>
                                        <p className="text-[10.5px] text-slate-500 font-medium leading-tight">
                                            Aktifkan jika tes ini dinilai lebih baik saat nilainya lebih rendah (contoh: waktu tempuh sprint, agility shuttle run).
                                        </p>
                                    </div>
                                </label>

                                {/* Modal Footer Buttons */}
                                <div className="flex gap-2 pt-3 border-t border-slate-100">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)} 
                                        className="flex-1 px-3 py-2 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 font-semibold text-xs rounded-md transition-colors cursor-pointer shadow-2xs"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={processing} 
                                        className="flex-[2] px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-md transition-colors shadow-2xs disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <Save size={13} />
                                        <span>{processing ? 'Menyimpan...' : (modalMode === 'create' ? 'Simpan Item' : 'Perbarui Item')}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}