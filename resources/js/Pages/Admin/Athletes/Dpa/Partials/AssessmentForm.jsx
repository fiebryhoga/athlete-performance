import React from "react";
import { History, Save, X, Edit, Info, Activity } from "lucide-react";

export default function AssessmentForm({
    compensations,
    data,
    setData,
    submit,
    processing,
    isEditMode,
    cancelEdit,
}) {
    const t = (text) => text;
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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <form
                onSubmit={submit}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300 flex flex-col"
            >
                <div className="p-5 md:p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                            <div className="p-1.5 rounded-md bg-orange-500 text-slate-50 shadow-sm">
                                {isEditMode ? (
                                    <Edit size={16} strokeWidth={2.5} />
                                ) : (
                                    <History size={16} strokeWidth={2.5} />
                                )}
                            </div>
                            <h3 className="text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2">
                                {isEditMode
                                    ? "Update DPA Record"
                                    : "New DPA Assessment"}
                                {isEditMode && (
                                    <span className="px-2 py-0.2 rounded-lg bg-slate-200 text-[10px] font-bold text-slate-600 ">
                                        {t("Edit Mode")}
                                    </span>
                                )}
                            </h3>
                        </div>
                        <p className="text-sm text-slate-500 ">
                            Check all applicable movement compensations observed
                            on the athlete.
                        </p>
                    </div>
                </div>

                <div className="p-5 md:p-6 space-y-8">
                    <div className="grid grid-cols-1 gap-5">
                        <div className="space-y-2 max-w-sm">
                            <label className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                                <History size={14} className="text-slate-500" />{" "}
                                Assessment Date
                            </label>
                            <input
                                type="date"
                                value={data.assessment_date}
                                onChange={(e) =>
                                    setData("assessment_date", e.target.value)
                                }
                                className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm text-slate-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 :ring-slate-300 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {categories.map((category) => {
                            const categoryItems = compensations.filter(
                                (c) => c.category === category,
                            );
                            if (categoryItems.length === 0) return null;

                            return (
                                <div
                                    key={category}
                                    className="bg-slate-50 border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm"
                                >
                                    <div className="mb-4 border-b border-slate-200 pb-2">
                                        <h5 className="font-bold text-slate-900 text-lg">
                                            {category}
                                        </h5>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {categoryItems.map((comp) => {
                                            const isChecked =
                                                data.compensations.includes(
                                                    comp.id,
                                                );
                                            return (
                                                <label
                                                    key={comp.id}
                                                    className={`flex flex-col border rounded-xl overflow-hidden cursor-pointer transition-all ${
                                                        isChecked
                                                            ? "border-slate-900 ring-1 ring-slate-900 bg-slate-50 shadow-sm"
                                                            : "border-slate-200 bg-white hover:bg-slate-50 :bg-orange-500/30"
                                                    }`}
                                                >
                                                    {comp.image_path ? (
                                                        <div className="w-full h-36 bg-white border-b border-slate-100 p-2 flex items-center justify-center">
                                                            <img
                                                                src={`/storage/${comp.image_path}`}
                                                                alt={comp.name}
                                                                className="w-full h-full object-contain rounded-lg"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-36 bg-slate-50 border-b border-slate-100 flex flex-col items-center justify-center text-slate-400 ">
                                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                                                                <span className="text-xs font-bold uppercase">
                                                                    {comp.name.substring(
                                                                        0,
                                                                        2,
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <span className="text-[10px] uppercase font-bold tracking-wider">
                                                                {t("No Image")}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="p-4 flex items-start gap-3 flex-1">
                                                        <div className="mt-0.5">
                                                            <input
                                                                type="checkbox"
                                                                className="rounded text-slate-900 focus:ring-slate-900 :ring-slate-100 w-4 h-4 bg-white border-slate-300 "
                                                                checked={
                                                                    isChecked
                                                                }
                                                                onChange={() =>
                                                                    handleCheckboxChange(
                                                                        comp.id,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="flex flex-col flex-1 mt-1.5">
                                                            <span className="font-bold text-sm text-slate-900 leading-snug">
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

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-900 ">
                            {t("Observations & Additional Notes")}
                        </label>
                        <textarea
                            value={data.notes || ""}
                            onChange={(e) => setData("notes", e.target.value)}
                            rows="3"
                            className="flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 :text-slate-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 :ring-slate-300 resize-y"
                            placeholder={t("Note any movement compensations or pain complaints...")}
                        />
                    </div>
                </div>

                <div className="p-5 border-t border-slate-200 bg-slate-50/50 flex flex-col-reverse md:flex-row justify-end items-center gap-3 mt-auto">
                    {isEditMode && (
                        <button
                            type="button"
                            onClick={cancelEdit}
                            className="w-full md:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 :ring-slate-300 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-100 :bg-slate-800 text-slate-900 h-9 px-4 py-2 gap-2 shadow-sm"
                        >
                            <X size={16} /> {t("Cancel Changes")}
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full md:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 :ring-slate-300 disabled:pointer-events-none disabled:opacity-50 bg-orange-500 text-slate-50 hover:bg-orange-500/90 :bg-slate-50/90 shadow h-9 px-6 py-2 gap-2"
                    >
                        <Save size={16} />
                        {isEditMode ? "Update Data" : "Save Assessment"}
                    </button>
                </div>
            </form>
        </div>
    );
}
