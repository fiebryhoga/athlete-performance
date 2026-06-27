import React, { useState, useMemo } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Package, ChevronLeft, Search } from "lucide-react";

export default function Create({ exercises = [] }) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        name: "",
        description: "",
        exercise_ids: [],
    });

    const [searchPackageEx, setSearchPackageEx] = useState("");

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.exercise-packages.store"));
    };

    const togglePackageExercise = (exId) => {
        const current = data.exercise_ids;
        if (current.includes(exId)) {
            setData("exercise_ids", current.filter((id) => id !== exId));
        } else {
            setData("exercise_ids", [...current, exId]);
        }
    };

    const filteredExercises = useMemo(() => {
        if (!searchPackageEx) return exercises;
        return exercises.filter(ex => ex.name.toLowerCase().includes(searchPackageEx.toLowerCase()));
    }, [exercises, searchPackageEx]);

    return (
        <AdminLayout title="Buat Paket Latihan">
            <Head title="Buat Paket Latihan" />
            <div className="mb-8">
                <Link href={route('admin.exercises.index', { tab: 'packages' })} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors mb-4">
                    <ChevronLeft size={16} /> Kembali ke Master Latihan
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-white border border-zinc-200 rounded-xl shadow-sm"><Package size={24} className="text-zinc-900"/></div>
                    Buat Paket Latihan Baru
                </h1>
                <p className="text-gray-600 mt-2">Buat grup/paket berisi kumpulan master latihan untuk memudahkan pemilihan saat membuat sesi.</p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden max-w-4xl">
                <form onSubmit={submit}>
                    <div className="p-8 space-y-8">
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                                Nama Paket
                            </label>
                            <input
                                type="text"
                                className={`w-full py-3 px-4 bg-zinc-50 border rounded-xl text-sm font-semibold text-zinc-900 outline-none ${errors.name ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-zinc-200 focus:ring-1 focus:ring-zinc-900'}`}
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="e.g., Warm Up Upper Body..."
                                required
                                autoFocus
                            />
                            {errors.name && <p className="mt-2 text-xs text-red-500 font-medium">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                                Deskripsi (Opsional)
                            </label>
                            <textarea
                                className="w-full py-3 px-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none resize-y min-h-[100px]"
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                placeholder="Tujuan atau deskripsi paket ini..."
                            />
                        </div>

                        <div className="pt-6 border-t border-zinc-100">
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                    Pilih Master Latihan ({data.exercise_ids.length} dipilih)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search size={14} className="text-zinc-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari latihan..."
                                        value={searchPackageEx}
                                        onChange={(e) => setSearchPackageEx(e.target.value)}
                                        className="pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-zinc-900"
                                    />
                                </div>
                            </div>
                            <div className="max-h-80 overflow-y-auto custom-scrollbar border border-zinc-200 rounded-xl bg-zinc-50 p-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                {filteredExercises.length > 0 ? filteredExercises.map(ex => (
                                    <label key={ex.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${data.exercise_ids.includes(ex.id) ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'}`}>
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 hidden"
                                            checked={data.exercise_ids.includes(ex.id)}
                                            onChange={() => togglePackageExercise(ex.id)}
                                        />
                                        <div className={`w-5 h-5 flex items-center justify-center rounded border ${data.exercise_ids.includes(ex.id) ? 'bg-white border-white' : 'bg-zinc-100 border-zinc-300'}`}>
                                            {data.exercise_ids.includes(ex.id) && <svg className="w-3 h-3 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
                                        </div>
                                        <span className="text-sm font-bold flex-1">{ex.name}</span>
                                    </label>
                                )) : (
                                    <div className="col-span-full py-8 text-center text-zinc-400 text-sm font-medium">Tidak ada latihan yang ditemukan.</div>
                                )}
                            </div>
                            {errors.exercise_ids && <p className="mt-2 text-xs text-red-500 font-medium">{errors.exercise_ids}</p>}
                        </div>
                    </div>
                    
                    <div className="px-8 py-5 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                        <Link
                            href={route('admin.exercises.index', { tab: 'packages' })}
                            className="px-6 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-200 rounded-xl transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors disabled:opacity-50 shadow-sm shadow-zinc-900/20"
                        >
                            {processing ? "Menyimpan..." : "Simpan Paket"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
