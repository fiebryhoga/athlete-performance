import React from "react";
import { History, Save, X, Edit, Activity, Check } from "lucide-react";

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

    return (
        <form
            onSubmit={submit}
            className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden flex flex-col space-y-4"
        >
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        {isEditMode ? (
                            <Edit size={14} className="text-orange-500" />
                        ) : (
                            <History size={14} className="text-orange-500" />
                        )}
                        <span>{isEditMode ? "Perbarui Data Evaluasi DPA" : "Form Evaluasi DPA Baru"}</span>
                        {isEditMode && (
                            <span className="px-1.5 py-0.2 rounded bg-orange-50 text-[10px] font-bold text-orange-700 border border-orange-200 ml-1">
                                Mode Edit
                            </span>
                        )}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Pilih semua kompensasi gerakan yang teramati selama pengujian Dynamic Posture Assessment.
                    </p>
                </div>
            </div>

            <div className="p-4 space-y-5">
                {/* Date Input */}
                <div className="space-y-1 max-w-xs">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <History size={12} className="text-slate-400" />
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

                {/* Compensations By Category */}
                <div className="space-y-4">
                    {categories.map((category) => {
                        const categoryItems = compensations.filter(
                            (c) => c.category === category,
                        );
                        if (categoryItems.length === 0) return null;

                        return (
                            <div
                                key={category}
                                className="bg-slate-50/50 border border-slate-200/80 rounded-md p-3.5 space-y-2.5"
                            >
                                <div className="border-b border-slate-200/80 pb-1.5">
                                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                                        {category}
                                    </h5>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                                    {categoryItems.map((comp) => {
                                        const isChecked = data.compensations.includes(comp.id);
                                        return (
                                            <label
                                                key={comp.id}
                                                className={`flex flex-col border rounded-md overflow-hidden cursor-pointer transition-all ${
                                                    isChecked
                                                        ? "border-orange-500 ring-1 ring-orange-500/30 bg-orange-50/20 shadow-2xs"
                                                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs"
                                                }`}
                                            >
                                                {comp.image_path ? (
                                                    <div className="w-full h-28 bg-white border-b border-slate-100 p-1.5 flex items-center justify-center">
                                                        <img
                                                            src={`/storage/${comp.image_path}`}
                                                            alt={comp.name}
                                                            className="w-full h-full object-contain rounded"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-28 bg-slate-50 border-b border-slate-100 flex flex-col items-center justify-center text-slate-400">
                                                        <span className="text-[10px] uppercase font-bold tracking-wider">
                                                            Tanpa Gambar
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="p-2.5 flex items-start gap-2 flex-1">
                                                    <input
                                                        type="checkbox"
                                                        className="mt-0.5 rounded text-orange-600 focus:ring-orange-500 w-3.5 h-3.5 bg-white border-slate-300 cursor-pointer"
                                                        checked={isChecked}
                                                        onChange={() => handleCheckboxChange(comp.id)}
                                                    />
                                                    <span className="font-bold text-xs text-slate-800 leading-snug">
                                                        {comp.name}
                                                    </span>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Additional Clinical Notes */}
                <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">
                        Observasi & Catatan Tambahan (Opsional)
                    </label>
                    <textarea
                        value={data.notes || ""}
                        onChange={(e) => setData("notes", e.target.value)}
                        rows="3"
                        className="w-full rounded-md border border-slate-200 bg-slate-50 focus:bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 resize-y"
                        placeholder="Catat observasi spesifik kompensasi gerakan atau keluhan atlet..."
                    />
                </div>
            </div>

            {/* Form Footer Actions */}
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col-reverse sm:flex-row justify-end items-center gap-2">
                {isEditMode && (
                    <button
                        type="button"
                        onClick={cancelEdit}
                        className="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 h-8 px-3.5 gap-1.5 shadow-2xs cursor-pointer transition-colors"
                    >
                        <X size={13} />
                        <span>Batal Ubah</span>
                    </button>
                )}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 shadow-2xs h-8 px-4 gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
                >
                    <Save size={13} />
                    <span>{isEditMode ? "Perbarui Data" : "Simpan Evaluasi"}</span>
                </button>
            </div>
        </form>
    );
}
