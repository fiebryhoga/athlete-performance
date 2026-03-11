import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, User, Trophy, MessageSquare, ArrowLeft, Target, AlertTriangle, CheckCircle2 } from 'lucide-react';

// --- SCORE INPUT COMPONENT (Mobile Optimized) ---
const ResultInput = ({ item, value, onChange }) => {
    
    const decimalTypes = ['second', 'minute', 'meter', 'vo2max'];
    const isDecimal = decimalTypes.includes(item.parameter_type);
    const step = isDecimal ? "0.01" : "1";
    const placeholder = isDecimal ? "0.00" : "0";

    let displayValue = value;
    if (!isDecimal && value !== '' && value !== null && value !== undefined) {
        if (typeof value === 'string' && value.endsWith('.00')) {
            displayValue = parseInt(value).toString();
        } else if (typeof value === 'number') {
            displayValue = Math.floor(value).toString();
        }
    }

    const isError = value === '' || value === null || value === undefined;

    return (
        <div className={`p-3 md:p-4 rounded-xl border transition-all duration-200 ${isError ? 'bg-amber-50/60 border-amber-200' : 'bg-slate-50/40 border-slate-200 hover:border-blue-200 hover:bg-white'}`}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1 sm:gap-2">
                <label className="font-bold text-slate-700 text-sm leading-tight">{item.name}</label>
                
                {/* Target Badge */}
                <div className="self-start sm:self-auto flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-500 whitespace-nowrap">
                    <Target className="w-3 h-3 text-blue-500" />
                    {Number(item.target_value)} <span className="text-slate-400 font-normal ml-0.5">{item.unit}</span>
                </div>
            </div>

            <div className="relative">
                <input 
                    type="number" 
                    step={step}
                    min="0"
                    value={displayValue}
                    onChange={(e) => onChange(e.target.value)}
                    className={`block w-full pl-3 pr-10 py-2.5 rounded-lg border font-bold text-slate-800 transition-all shadow-sm text-base md:text-lg ${
                        isError 
                        ? 'border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 bg-white' 
                        : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-white'
                    }`}
                    placeholder={placeholder}
                    onWheel={(e) => e.target.blur()} 
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.unit}</span>
                </div>
            </div>
            
            {isError && (
                <p className="text-[10px] text-amber-600 mt-1.5 flex items-center gap-1 font-bold">
                    <AlertTriangle className="w-3 h-3" /> required
                </p>
            )}
        </div>
    );
};

export default function Edit({ test, categories }) {
    const initialScores = categories.flatMap(cat => 
        cat.test_items.map(item => ({ 
            test_item_id: item.id, 
            result_value: item.saved_result !== null ? item.saved_result : '' 
        }))
    );

    const { data, setData, put, processing, isDirty } = useForm({
        scores: initialScores,
        notes: test.notes || ''
    });

    const handleValueChange = (itemId, val) => {
        const updatedScores = data.scores.map(item => 
            item.test_item_id === itemId ? { ...item, result_value: val } : item
        );
        setData('scores', updatedScores);
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.performance.update', test.id));
    };

    return (
        <AdminLayout title="Input Test Scores" noContainer>
            <Head title="Scoring" />

            <form onSubmit={submit} className="relative min-h-screen bg-slate-50/50 pb-28 md:pb-12">
                
                {/* --- STICKY HEADER (Solid & Full Width) --- */}
                {/* top-0 atau top-[64px] tergantung tinggi navbar layout Anda. Saya pakai top-0 agar aman di mobile */}
                <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
                        <div className="flex items-center justify-between gap-4">
                            
                            {/* Left: Info */}
                            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                <Link href={route('admin.performance.index')} className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-[#00488b] hover:border-blue-200 transition-colors shrink-0">
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                                <div className="min-w-0">
                                    <h1 className="text-base md:text-lg font-bold text-slate-800 truncate leading-tight  ">
                                        {test.name}
                                    </h1>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 truncate">
                                        <span className="flex items-center gap-1 font-medium  "><User className="w-3 h-3" /> {test.athlete.name}</span>
                                        <span className="text-slate-300">|</span>
                                        <span className="hidden sm:flex items-center gap-1  "><Trophy className="w-3 h-3" /> {test.athlete.sport.name}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Actions (Desktop Only) */}
                            <div className="hidden sm:flex items-center gap-4">
                                <div className={`text-xs font-bold transition-colors   ${isDirty ? 'text-amber-500' : 'text-emerald-600 flex items-center gap-1'}`}>
                                    {isDirty ? 'unsaved changes...' : <><CheckCircle2 className="w-3 h-3" /> all saved</>}
                                </div>
                                <button 
                                    type="submit" disabled={processing}
                                    className={`px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm hover:shadow-md   ${
                                        isDirty 
                                        ? 'bg-[#00488b] text-white hover:bg-[#003666]' 
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                                >
                                    {processing ? 'saving...' : <><Save className="w-4 h-4" /> save data</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MAIN CONTENT (Wider Container) --- */}
                {/* Gunakan max-w-7xl dan padding kecil di mobile (px-2) */}
                <div className="max-w-7xl mx-auto py-4 md:py-8 px-2 sm:px-6 lg:px-8 space-y-4 md:space-y-6">
                    
                    {categories.map((category) => (
                        <div key={category.id} className="bg-white rounded-xl md:rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            
                            {/* Category Header */}
                            <div className="px-4 md:px-6 py-3 md:py-4 bg-slate-50/80 border-b border-slate-100 flex justify-between items-center">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <div className="w-1 h-5 md:h-6 bg-[#00488b] rounded-full"></div>
                                    <h3 className="font-bold text-slate-800 text-sm md:text-lg  ">{category.name}</h3>
                                </div>
                                <span className="text-[10px] md:text-xs font-bold bg-white border border-slate-200 text-slate-500 px-2 py-1 rounded-full uppercase tracking-wider">
                                    {category.test_items.length} items
                                </span>
                            </div>

                            {/* Grid Inputs (Responsive: 1 col mobile, 2 tablet, 3 desktop) */}
                            <div className="p-3 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                                {category.test_items.map((item) => {
                                    const currentVal = data.scores.find(s => s.test_item_id === item.id)?.result_value;
                                    return (
                                        <ResultInput 
                                            key={item.id}
                                            item={item}
                                            value={currentVal}
                                            onChange={(val) => handleValueChange(item.id, val)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Notes Section */}
                    <div className="bg-white rounded-xl md:rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6">
                        <h3 className="font-bold text-slate-800 mb-3 md:mb-4 flex gap-2 items-center text-sm md:text-base  ">
                            <div className="p-1.5 bg-blue-50 text-[#00488b] rounded-lg border border-blue-100">
                                <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            coach notes & evaluation
                        </h3>
                        <div className="relative">
                            <textarea 
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-slate-700 min-h-[120px] focus:ring-2 focus:ring-[#00488b]/20 focus:border-[#00488b] transition-all placeholder:text-slate-400 placeholder:font-normal resize-y text-sm leading-relaxed hover:bg-white lowercase"
                                placeholder="write detailed evaluation regarding the athlete's performance in this session..."
                            ></textarea>
                            <div className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-300 pointer-events-none">
                                {data.notes.length} chars
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MOBILE FLOATING SAVE BAR --- */}
                {/* Fixed di bawah layar hanya untuk mobile (< sm) */}
                <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-slate-200 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex gap-3 items-center">
                    <div className="flex-1 text-xs font-medium text-slate-500 pl-1  ">
                        {isDirty ? 'unsaved changes...' : 'all data saved'}
                    </div>
                    <button 
                        type="submit" disabled={processing}
                        className={`px-6 py-3 rounded-xl font-bold text-sm flex justify-center items-center gap-2 shadow-lg transition-all active:scale-[0.98] w-auto   ${
                            isDirty 
                            ? 'bg-[#00488b] text-white hover:bg-[#003666]' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                        }`}
                    >
                        {processing ? 'saving...' : <><Save className="w-4 h-4" /> save</>}
                    </button>
                </div>

            </form>
        </AdminLayout>
    );
}