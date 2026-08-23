import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import {
    Edit,
    Trash2,
    CalendarDays,
    Activity,
    Scale,
    HeartPulse,
    Droplets,
    AlertTriangle,
    History,
    Sparkles,
} from "lucide-react";

export default function HistoryTable({ history, onEdit, canDelete }) {
    const { delete: destroy, processing } = useForm();

    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const confirmDelete = (id) => {
        setDeleteId(id);
        setConfirmingDeletion(true);
    };

    const closeModal = () => {
        setConfirmingDeletion(false);
        setDeleteId(null);
    };

    const deleteRecord = () => {
        if (!deleteId) return;
        destroy(route("admin.composition-tests.destroy", deleteId), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    const formatDate = (dateString) => {
        const options = { day: "numeric", month: "short", year: "numeric" };
        return new Date(dateString).toLocaleDateString("id-ID", options);
    };

    if (!history || history.length === 0) return null;

    return (
        <>
            <div className="bg-white border border-slate-200/80 rounded-lg shadow-2xs overflow-hidden flex flex-col">
                {/* Table Header Row */}
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <History className="w-3.5 h-3.5 text-orange-500" />
                            Riwayat Pengukuran Komposisi Tubuh
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                            Daftar rekam jejak evaluasi bioimpedansi atlet
                            sepanjang waktu.
                        </p>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200/70 px-2.5 py-0.5 rounded-md shadow-2xs">
                        Total: {history.length} Record
                    </span>
                </div>

                {/* Table Records */}
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-xs text-left">
                        <thead className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/80 border-b border-slate-200/70">
                            <tr>
                                <th className="px-5 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-1.5">
                                        <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                                        Tanggal Tes
                                    </div>
                                </th>
                                <th className="px-5 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-1.5">
                                        <Scale className="w-3.5 h-3.5 text-slate-400" />
                                        Berat & BMI
                                    </div>
                                </th>
                                <th className="px-5 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-1.5">
                                        <Activity className="w-3.5 h-3.5 text-slate-400" />
                                        Lemak & Otot
                                    </div>
                                </th>
                                <th className="px-5 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-1.5">
                                        <HeartPulse className="w-3.5 h-3.5 text-slate-400" />
                                        Visceral & Phase Angle
                                    </div>
                                </th>
                                {(onEdit || canDelete) && (
                                    <th className="px-5 py-3 whitespace-nowrap text-right">
                                        Aksi
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {history.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="group hover:bg-orange-50/20 transition-colors bg-white"
                                >
                                    {/* Tanggal */}
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {index === 0 && (
                                                <span
                                                    className="w-2 h-2 rounded-full bg-orange-500 ring-2 ring-orange-500/20"
                                                    title="Data Terbaru"
                                                />
                                            )}
                                            <span
                                                className={`font-bold ${
                                                    index === 0
                                                        ? "text-slate-900"
                                                        : "text-slate-700"
                                                }`}
                                            >
                                                {formatDate(item.date)}
                                            </span>
                                            {index === 0 && (
                                                <span className="text-[9.5px] font-bold text-orange-600 bg-orange-50 border border-orange-200/60 px-1.5 py-0.2 rounded">
                                                    Terbaru
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Berat & BMI */}
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-900">
                                                {item.weight} kg
                                            </span>
                                            <span className="text-slate-300">
                                                /
                                            </span>
                                            <span className="font-semibold text-slate-600">
                                                BMI {item.bmi || "-"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Lemak & Otot */}
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-[10px] text-slate-400 font-bold">
                                                    Fat:
                                                </span>
                                                <span className="font-bold text-orange-600">
                                                    {item.body_fat_percentage
                                                        ? `${item.body_fat_percentage}%`
                                                        : "-"}
                                                </span>
                                            </div>
                                            <span className="text-slate-300">
                                                /
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-[10px] text-slate-400 font-bold">
                                                    Otot:
                                                </span>
                                                <span className="font-bold text-teal-700">
                                                    {item.muscle_mass
                                                        ? `${item.muscle_mass} kg`
                                                        : "-"}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Visceral & Phase Angle */}
                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-[10px] text-slate-400 font-bold">
                                                    Visc:
                                                </span>
                                                <span className="font-bold text-slate-800">
                                                    {item.visceral_fat
                                                        ? `Lvl ${item.visceral_fat}`
                                                        : "-"}
                                                </span>
                                            </div>
                                            <span className="text-slate-300">
                                                /
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-[10px] text-slate-400 font-bold">
                                                    Phase:
                                                </span>
                                                <span className="font-bold text-indigo-600">
                                                    {item.phase_angle
                                                        ? `${item.phase_angle}°`
                                                        : "-"}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    {(onEdit || canDelete) && (
                                        <td className="px-5 py-3.5 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {onEdit && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onEdit(item)
                                                        }
                                                        className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                                                        title="Edit Data"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                                {canDelete && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            confirmDelete(
                                                                item.id,
                                                            )
                                                        }
                                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                                        title="Hapus Data"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Konfirmasi Hapus */}
            <Modal show={confirmingDeletion} onClose={closeModal} maxWidth="md">
                <div className="p-5 bg-white rounded-xl space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">
                                Hapus Data Komposisi Tubuh?
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Tindakan ini tidak dapat dibatalkan. Rekam jejak
                                evaluasi ini akan terhapus secara permanen.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-md transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            disabled={processing}
                            onClick={deleteRecord}
                            className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors shadow-sm disabled:opacity-50"
                        >
                            {processing ? "Menghapus..." : "Hapus Data"}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
