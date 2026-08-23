import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PageHeader from "@/Components/Common/PageHeader";
import PageFooter from "@/Components/Common/PageFooter";
import {
    Save,
    User,
    Trophy,
    MessageSquare,
    ArrowLeft,
    Target,
} from "lucide-react";

const ResultInput = ({ item, value, onChange }) => {
    const decimalTypes = [
        "second",
        "minute",
        "meter",
        "vo2max",
        "kg",
        "n",
        "n_kg",
        "percent",
        "watt",
        "degree",
    ];
    const isDecimal = decimalTypes.includes(item.parameter_type);
    const step = isDecimal ? "0.01" : "1";
    const placeholder = isDecimal ? "0.00" : "0";

    let displayValue = value;
    if (!isDecimal && value !== "" && value !== null && value !== undefined) {
        if (typeof value === "string" && value.endsWith(".00")) {
            displayValue = parseInt(value).toString();
        } else if (typeof value === "number") {
            displayValue = Math.floor(value).toString();
        }
    }

    return (
        <div className="bg-gradient-to-br from-white via-white to-orange-50/20 p-3.5 rounded-lg border border-slate-200/80 shadow-2xs hover:border-orange-300/80 transition-all flex flex-col justify-between space-y-2">
            <div className="flex items-start justify-between gap-2">
                <label className="font-bold text-slate-800 text-xs leading-snug">
                    {item.name}
                </label>
                <div className="shrink-0 flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-white/90 px-1.5 py-0.5 rounded border border-slate-200/70 shadow-2xs">
                    <Target className="w-2.5 h-2.5 text-orange-500" />
                    <span>
                        {Number(item.target_value)} {item.unit}
                    </span>
                </div>
            </div>

            <div className="relative">
                <input
                    type="number"
                    step={step}
                    min="0"
                    value={displayValue}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-3 pr-11 py-1.5 bg-white border border-slate-200 rounded-md font-bold text-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-2xs text-xs"
                    placeholder={placeholder}
                    onWheel={(e) => e.target.blur()}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-[10px] font-bold text-slate-400">
                        {item.unit}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default function Edit({ test, categories = [] }) {
    const initialScores = categories.flatMap((cat) =>
        cat.test_items.map((item) => ({
            test_item_id: item.id,
            result_value: item.saved_result !== null ? item.saved_result : "",
        })),
    );

    const { data, setData, put, processing, isDirty } = useForm({
        scores: initialScores,
        notes: test.notes || "",
    });

    const handleValueChange = (itemId, val) => {
        const updatedScores = data.scores.map((item) =>
            item.test_item_id === itemId
                ? { ...item, result_value: val }
                : item,
        );
        setData("scores", updatedScores);
    };

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.performance.update", test.id));
    };

    return (
        <AppLayout title={`Input Nilai - ${test.name}`}>
            <Head title={`Input Nilai - ${test.name}`} />

            <form onSubmit={submit} className="space-y-5 pb-4">
                {/* ─── 1. PAGE HEADER ─── */}
                <PageHeader
                    title="Input Nilai Tes Fisik"
                    description={`Sesi: ${test.name} • Atlet: ${test.athlete?.name || "Atlet"} (${test.athlete?.sport?.name || "Umum"})`}
                    actions={
                        <div className="flex flex-wrap items-center gap-2.5">
                            {/* Back Button */}
                            <Link
                                href={route("admin.performance.index")}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-md text-xs font-bold transition-all shadow-2xs"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                            </Link>

                            {/* Save Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-white via-white to-orange-50/70 hover:to-orange-100/80 text-orange-600 hover:text-orange-700 border border-slate-200 hover:border-slate-300 rounded-md text-xs font-bold transition-all shadow-2xs disabled:opacity-60"
                            >
                                <Save className="w-3.5 h-3.5" />
                                {processing ? "Menyimpan..." : "Simpan Nilai"}
                            </button>
                        </div>
                    }
                />

                {/* ─── 2. PARAMETERS BY CATEGORY (FULL WIDTH) ─── */}
                <div className="space-y-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white rounded-lg border border-slate-200/80 shadow-2xs overflow-hidden"
                        >
                            {/* Category Header */}
                            <div className="px-4 py-3 bg-gradient-to-r from-white via-orange-50/20 to-white border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                                    {category.name}
                                </h3>
                                <span className="text-[10.5px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
                                    {category.test_items.length} Parameter
                                </span>
                            </div>

                            {/* Grid of Parameter Inputs */}
                            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                                {category.test_items.map((item) => {
                                    const currentVal = data.scores.find(
                                        (s) => s.test_item_id === item.id,
                                    )?.result_value;
                                    return (
                                        <ResultInput
                                            key={item.id}
                                            item={item}
                                            value={currentVal}
                                            onChange={(val) =>
                                                handleValueChange(item.id, val)
                                            }
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ─── 3. COACH NOTES SECTION (FULL WIDTH) ─── */}
                <div className="bg-gradient-to-br from-white via-white to-orange-50/30 rounded-lg border border-slate-200/80 shadow-2xs p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4 text-orange-500" />
                            Catatan & Rekomendasi Pelatih
                        </h3>
                        <span className="text-[10px] font-medium text-slate-400">
                            {data.notes.length} Karakter
                        </span>
                    </div>
                    <div className="relative">
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData("notes", e.target.value)}
                            className="w-full rounded-md border border-slate-200 bg-white p-3 text-slate-800 min-h-[90px] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400 font-medium resize-y text-xs leading-relaxed outline-none shadow-2xs"
                            placeholder="Tuliskan evaluasi performa, catatan kekuatan, dan rekomendasi program latihan untuk atlet pada sesi ini..."
                        ></textarea>
                    </div>
                </div>

                <PageFooter className="!mt-6 !pt-4 !pb-1" />
            </form>
        </AppLayout>
    );
}
