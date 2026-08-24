import React from "react";
import { Link } from "@inertiajs/react";
import { Save, CheckCircle, ArrowRight, Check, X, Edit } from "lucide-react";

export default function ActionFooter({
    isAthlete,
    isCompleted,
    recentlySuccessful,
    processing,
    onComplete,
    data,
    training,
    isEditingActuals,
    setIsEditingActuals,
}) {
    const isLocked = isCompleted && !isEditingActuals;

    if (!isAthlete) {
        return (
            <div className="flex justify-end items-center gap-2.5 pt-2">
                {recentlySuccessful && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Check size={14} /> Tersimpan
                    </span>
                )}
                {isCompleted && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold border border-emerald-200">
                        <CheckCircle size={13} /> Program Selesai
                    </span>
                )}
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                    <Save size={13} /> Simpan Update RPE
                </button>
                {!isCompleted && (
                    <button
                        type="button"
                        disabled={processing}
                        onClick={onComplete}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        <CheckCircle size={13} /> Selesaikan Latihan
                    </button>
                )}
            </div>
        );
    }

    const hasSavedDraft = training?.status === "in_progress" || isCompleted;

    return (
        <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2.5 pt-2">
            {isLocked ? (
                <>
                    {recentlySuccessful && (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <Check size={14} /> Tersimpan
                        </span>
                    )}
                    <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold border border-emerald-200">
                        <CheckCircle size={13} /> Program Selesai
                    </span>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsEditingActuals(true);
                        }}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                        <Edit size={13} /> Edit Hasil Latihan
                    </button>
                </>
            ) : (
                <>
                    {recentlySuccessful && (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <Check size={14} /> Draft Tersimpan
                        </span>
                    )}

                    {hasSavedDraft && isEditingActuals && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsEditingActuals(false);
                            }}
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                        >
                            <X size={13} /> Batal Edit
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        <Save size={13} /> Simpan Sebagai Draft
                    </button>

                    <button
                        type="button"
                        disabled={processing}
                        onClick={onComplete}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        <span>Selesaikan Latihan</span>
                        <ArrowRight size={13} />
                    </button>
                </>
            )}
        </div>
    );
}
