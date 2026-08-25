import React, { useMemo } from "react";
import { History, Save, X, Edit, CheckCircle2, Calendar, FileText, Check, ListChecks } from "lucide-react";

export default function AssessmentForm({
    compensations = [],
    data,
    setData,
    submit,
    processing,
    isEditMode,
    cancelEdit,
}) {
    const categories = [
        "Posterior View",
        "Lateral View",
        "Anterior View",
        "Single Leg",
    ];

    const handleCheckboxChange = (compensationId) => {
        const selected = data.compensations || [];
        if (selected.includes(compensationId)) {
            setData(
                "compensations",
                selected.filter((id) => id !== compensationId),
            );
        } else {
            setData("compensations", [...selected, compensationId]);
        }
    };

    const selectedItems = useMemo(() => {
        return compensations.filter((c) => data.compensations?.includes(c.id));
    }, [compensations, data.compensations]);

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* ═══════════════════════════════════════
                    KOLOM KIRI (LEBAR): Grid Pemilihan Kompensasi per Kategori
                   ═══════════════════════════════════════ */}
                <div className="order-1 lg:col-span-8 xl:col-span-9 space-y-4">
                    {categories.map((category) => {
                        const categoryItems = compensations.filter(
                            (c) => c.category === category,
                        );
                        if (categoryItems.length === 0) return null;

                        const categorySelectedCount = categoryItems.filter((c) =>
                            data.compensations?.includes(c.id)
                        ).length;

                        return (
                            <div
                                key={category}
                                className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden"
                            >
                                <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wide">
                                            {category}
                                        </h5>
                                        <span className="text-[11px] font-medium text-slate-400">
                                            ({categoryItems.length} gerakan)
                                        </span>
                                    </div>
                                    {categorySelectedCount > 0 && (
                                        <span className="text-[11px] font-bold text-orange-600">
                                            {categorySelectedCount} Terpilih
                                        </span>
                                    )}
                                </div>

                                <div className="p-3.5 sm:p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                    {categoryItems.map((comp) => {
                                        const isChecked = data.compensations?.includes(comp.id);
                                        return (
                                            <label
                                                key={comp.id}
                                                className={`flex flex-col border rounded-md overflow-hidden cursor-pointer transition-all ${
                                                    isChecked
                                                        ? "border-orange-500 ring-1 ring-orange-500/30 bg-orange-50/20 shadow-2xs"
                                                        : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs"
                                                }`}
                                            >
                                                {comp.image_path ? (
                                                    <div className="w-full h-28 bg-slate-50/50 border-b border-slate-100 p-2 flex items-center justify-center">
                                                        <img
                                                            src={`/storage/${comp.image_path}`}
                                                            alt={comp.name}
                                                            className="w-full h-full object-contain rounded"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-28 bg-slate-50 border-b border-slate-100 flex flex-col items-center justify-center text-slate-400">
                                                        <span className="text-[10px] uppercase font-bold tracking-wider">
                                                            Tanpa Gambar
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="p-2.5 flex items-start gap-2.5 flex-1">
                                                    <input
                                                        type="checkbox"
                                                        className="mt-0.5 rounded text-orange-600 focus:ring-orange-500 w-4 h-4 bg-white border-slate-300 cursor-pointer shrink-0"
                                                        checked={isChecked}
                                                        onChange={() => handleCheckboxChange(comp.id)}
                                                    />
                                                    <div className="space-y-0.5">
                                                        <span className="font-bold text-xs text-slate-900 leading-snug block">
                                                            {comp.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ═══════════════════════════════════════
                    KOLOM KANAN (SIDEBAR): Tanggal, Catatan, Ringkasan Pilihan & Tombol Simpan
                   ═══════════════════════════════════════ */}
                <div className="order-2 lg:col-span-4 xl:col-span-3 space-y-4 lg:sticky lg:top-4">
                    {/* Panel Data Evaluasi */}
                    <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                        <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100">
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                {isEditMode ? (
                                    <Edit size={14} className="text-orange-500" />
                                ) : (
                                    <Calendar size={14} className="text-orange-500" />
                                )}
                                <span>{isEditMode ? "Perbarui Evaluasi" : "Form Evaluasi Baru"}</span>
                            </h3>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                {isEditMode ? "Edit data kompensasi yang tersimpan" : "Simpan sesi evaluasi DPA atlet"}
                            </p>
                        </div>

                        <div className="p-3.5 sm:p-4 space-y-3.5">
                            {/* Date Input */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                                    <Calendar size={12} className="text-slate-400" />
                                    <span>Tanggal Evaluasi</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.assessment_date}
                                    onChange={(e) => setData("assessment_date", e.target.value)}
                                    className="w-full rounded-md border border-slate-200 bg-slate-50 focus:bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer"
                                    required
                                />
                            </div>

                            {/* Additional Notes */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                                    <FileText size={12} className="text-slate-400" />
                                    <span>Catatan Klinis & Observasi</span>
                                </label>
                                <textarea
                                    value={data.notes || ""}
                                    onChange={(e) => setData("notes", e.target.value)}
                                    rows="3"
                                    className="w-full rounded-md border border-slate-200 bg-slate-50 focus:bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 resize-y"
                                    placeholder="Catatan observasi gerakan atau keluhan atlet..."
                                />
                            </div>

                            {/* Live Selection Summary */}
                            <div className="pt-2 border-t border-slate-100 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <ListChecks size={13} className="text-slate-500" />
                                        <span className="text-xs font-bold text-slate-900">Kompensasi Dipilih</span>
                                    </div>
                                    <span className="text-[11px] font-semibold text-slate-400">
                                        {selectedItems.length} terpilih
                                    </span>
                                </div>

                                <div className="max-h-48 overflow-y-auto custom-scrollbar">
                                    {selectedItems.length > 0 ? (
                                        <ul className="space-y-1 text-xs">
                                            {selectedItems.map((item) => (
                                                <li
                                                    key={item.id}
                                                    className="flex items-center justify-between py-1 px-2 rounded bg-slate-50 border border-slate-100 text-slate-700 group"
                                                >
                                                    <span className="font-medium truncate pr-2 text-[11.5px]">{item.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCheckboxChange(item.id)}
                                                        className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                                                        title="Batal pilih"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="p-3 text-center rounded bg-slate-50/80 border border-dashed border-slate-200 text-slate-400 text-[11px]">
                                            Centang kompensasi pada kolom kiri
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full inline-flex items-center justify-center rounded-md text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-2xs h-9 px-4 gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
                                >
                                    <Save size={13.5} />
                                    <span>{isEditMode ? "Perbarui Evaluasi" : "Simpan Evaluasi"}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="w-full inline-flex items-center justify-center rounded-md text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 h-8 px-3.5 gap-1.5 shadow-2xs cursor-pointer transition-colors"
                                >
                                    <X size={13} />
                                    <span>Batal</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
