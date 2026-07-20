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
            <div className="p-4 sm:p-6 bg-slate-50/80 border-t border-slate-200 flex justify-end items-center gap-3">
                {recentlySuccessful && (
                    <span className="text-sm font-bold text-slate-500 flex justify-center items-center gap-1">
                        <Check size={16} className="text-green-500" /> Tersimpan
                    </span>
                )}
                {isCompleted && (
                    <span className="flex justify-center items-center gap-2 px-6 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-bold border border-green-200">
                        <CheckCircle size={16} /> Program Selesai
                    </span>
                )}
                <button
                    type="submit"
                    disabled={processing}
                    className="flex justify-center items-center gap-2 px-6 py-2.5 bg-orange-500 text-white border border-transparent rounded-xl text-sm font-bold hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20 disabled:opacity-50"
                >
                    <Save size={16} /> Simpan Update RPE
                </button>
                {!isCompleted && (
                    <button
                        type="button"
                        disabled={processing}
                        onClick={onComplete}
                        className="flex justify-center items-center gap-2 px-6 py-2.5 bg-green-500 text-white border border-transparent rounded-xl text-sm font-bold hover:bg-green-600 transition-all shadow-md shadow-green-500/20 disabled:opacity-50"
                    >
                        <CheckCircle size={16} /> Selesaikan Latihan
                    </button>
                )}
            </div>
        );
    }

    const hasSavedDraft = training?.status === "in_progress" || isCompleted;

    return (
        <div className="p-4 sm:p-6 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 sm:gap-4">
            {isLocked ? (
                <>
                    {recentlySuccessful && (
                        <span className="text-sm font-bold text-slate-500 flex justify-center items-center gap-1 mt-2 sm:mt-0">
                            <Check size={16} className="text-green-500" /> Tersimpan
                        </span>
                    )}
                    <span className="flex w-full sm:w-auto justify-center items-center gap-2 px-6 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-bold border border-green-200">
                        <CheckCircle size={16} /> Program Selesai
                    </span>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsEditingActuals(true);
                        }}
                        className="flex w-full sm:w-auto justify-center items-center gap-2 px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Edit size={16} /> Edit Hasil Latihan
                    </button>
                </>
            ) : (
                <>
                    {recentlySuccessful && (
                        <span className="text-sm font-bold text-slate-500 flex justify-center items-center gap-1 mt-2 sm:mt-0">
                            <Check size={16} className="text-green-500" /> Draft Tersimpan
                        </span>
                    )}

                    {hasSavedDraft && isEditingActuals && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsEditingActuals(false);
                            }}
                            className="flex w-full sm:w-auto justify-center items-center gap-2 px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <X size={16} /> Batal Edit
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="flex w-full sm:w-auto justify-center items-center gap-2 px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
                    >
                        <Save size={16} /> Simpan Sebagai Draft
                    </button>

                    <button
                        type="button"
                        disabled={processing}
                        onClick={onComplete}
                        className="flex w-full sm:w-auto justify-center items-center gap-2 px-6 py-2.5 bg-orange-500 text-white border border-transparent rounded-xl text-sm font-bold hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20 disabled:opacity-50"
                    >
                        Selesaikan Latihan <ArrowRight size={16} />
                    </button>
                </>
            )}
        </div>
    );
}
