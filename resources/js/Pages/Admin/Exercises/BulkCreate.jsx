import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Dumbbell, ChevronLeft, AlignLeft } from "lucide-react";

export default function BulkCreate({ categories = [] }) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        names: "",
        exercise_category_id: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.exercises.bulk-store"));
    };

    return (
        <AppLayout title="Bulk Create Latihan">
            <Head title="Buat Latihan Massal" />
            <div className="mb-8">
                <Link href={route('admin.exercises.index')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-4">
                    <ChevronLeft size={16} /> Kembali ke Master Latihan
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-white border border-slate-200 rounded-xl shadow-sm"><AlignLeft size={24} className="text-slate-900"/></div>
                    Buat Latihan (Bulk)
                </h1>
                <p className="text-gray-600 mt-2">Buat banyak master latihan sekaligus dengan cepat. Ketik atau tempel (paste) daftar nama latihan di bawah ini.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden max-w-4xl">
                <form onSubmit={submit}>
                    <div className="p-8 space-y-8">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2">
                                Kategori (Opsional)
                            </label>
                            <p className="text-xs text-slate-500 mb-3">Semua latihan yang Anda ketik di bawah akan dimasukkan ke dalam kategori ini.</p>
                            <select
                                className="w-full md:w-1/2 py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none"
                                value={data.exercise_category_id}
                                onChange={(e) => setData("exercise_category_id", e.target.value)}
                            >
                                <option value="">Tanpa Kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <label className="block text-xs font-bold text-slate-500 mb-2">
                                Daftar Nama Latihan
                            </label>
                            <p className="text-xs text-slate-500 mb-3">Pisahkan setiap nama latihan dengan baris baru (Enter). 1 baris = 1 latihan.</p>
                            <textarea
                                className={`w-full py-3 px-4 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-900 outline-none resize-y min-h-[300px] leading-relaxed ${errors.names ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-200 focus:ring-1 focus:ring-slate-900'}`}
                                value={data.names}
                                onChange={(e) => setData("names", e.target.value)}
                                placeholder="Contoh:&#10;Barbell Squat&#10;Dumbbell Lunges&#10;Leg Extension&#10;Leg Curl"
                                required
                                autoFocus
                            />
                            {errors.names && <p className="mt-2 text-xs text-red-500 font-medium">{errors.names}</p>}
                        </div>
                    </div>
                    
                    <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                        <Link
                            href={route('admin.exercises.index')}
                            className="px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing || !data.names.trim()}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-[#ff4d00] hover:bg-[#e64500] rounded-xl transition-colors disabled:opacity-50 shadow-sm shadow-[#ff4d00]/20"
                        >
                            {processing ? "Memproses..." : "Buat Secara Massal"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
