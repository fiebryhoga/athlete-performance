import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { 
    ChevronLeft, 
    Save, 
    X, 
    UploadCloud, 
    Flame, 
    Dumbbell, 
    ShieldAlert, 
    Zap, 
    Info, 
    Image as ImageIcon,
    Activity,
    Layers,
    CheckCircle2
} from "lucide-react";
import PageHeader from "@/Components/Common/PageHeader";

const ImageUploader = ({ label, field, imagePath, data, setData, removeFlag }) => {
    const previewUrl = data[field] instanceof File 
        ? URL.createObjectURL(data[field]) 
        : (!data[removeFlag] && imagePath ? `/storage/${imagePath}` : null);

    const handleRemove = () => {
        setData(prev => ({ ...prev, [field]: null, [removeFlag]: true }));
    };

    return (
        <div className="space-y-1.5 p-3 bg-slate-50/60 rounded-md border border-slate-200/80">
            {label && (
                <label className="block text-xs font-bold text-slate-700">
                    {label}
                </label>
            )}
            
            {previewUrl ? (
                <div className="relative group rounded-md overflow-hidden border border-slate-200 bg-white inline-block w-full">
                    <img src={previewUrl} alt="Preview" className="h-28 w-full object-contain p-1" />
                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-md shadow-2xs transition-colors cursor-pointer"
                            title="Hapus gambar"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="relative border border-dashed border-slate-300 rounded-md p-4 flex flex-col items-center justify-center text-center hover:bg-slate-100/60 transition-colors cursor-pointer group bg-white">
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                            if (e.target.files[0]) {
                                setData(prev => ({ 
                                    ...prev, 
                                    [field]: e.target.files[0], 
                                    [removeFlag]: false 
                                }));
                            }
                        }}
                    />
                    <UploadCloud size={20} className="text-slate-400 group-hover:text-orange-500 transition-colors mb-1" />
                    <span className="text-[11px] font-semibold text-slate-600">Klik atau seret gambar ke sini</span>
                </div>
            )}
        </div>
    );
};

export default function DpaForm({ auth, dpaCompensation }) {
    const isEdit = !!dpaCompensation;

    const { data, setData, post, processing, errors } = useForm({
        category: dpaCompensation?.category || "Posterior View",
        name: dpaCompensation?.name || "",
        overactive_muscles: dpaCompensation?.overactive_muscles || "",
        underactive_muscles: dpaCompensation?.underactive_muscles || "",
        possible_injuries: dpaCompensation?.possible_injuries || "",
        exercises_smr: dpaCompensation?.exercises_smr || "",
        exercises_stretching: dpaCompensation?.exercises_stretching || "",
        exercises_isometrics: dpaCompensation?.exercises_isometrics || "",
        exercises_integrated: dpaCompensation?.exercises_integrated || "",
        
        // File fields
        image: null,
        image_smr: null,
        image_stretching: null,
        image_isometrics: null,
        image_integrated: null,

        // Removal flags
        remove_image: false,
        remove_image_smr: false,
        remove_image_stretching: false,
        remove_image_isometrics: false,
        remove_image_integrated: false,
    });

    const categories = [
        "Posterior View",
        "Lateral View",
        "Anterior View",
        "Single Leg",
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const routeName = isEdit ? route("admin.dpa-compensations.update", dpaCompensation.id) : route("admin.dpa-compensations.store");
        
        post(routeName, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout title={isEdit ? "Edit Kompensasi DPA" : "Tambah Kompensasi DPA"}>
            <Head title={isEdit ? "Edit Kompensasi DPA" : "Tambah Kompensasi DPA"} />

            <div className="space-y-4 pb-16">
                {/* ─── PAGE HEADER ─── */}
                <div className="space-y-1">
                    <Link
                        href={route("admin.dpa-compensations.index")}
                        className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors gap-1.5"
                    >
                        <ChevronLeft size={14} />
                        <span>Kembali ke Direktori Kompensasi</span>
                    </Link>

                    <PageHeader
                        title={isEdit ? `Edit Kompensasi: ${dpaCompensation.name}` : "Tambah Kompensasi DPA Baru"}
                        description="Kelola master data kompensasi gerak Dynamic Posture Assessment, analisis otot, potensi cedera, dan protokol latihan korektif (4 Fase NASM)."
                        actions={
                            <Link
                                href={route('admin.dpa-compensations.index')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                            >
                                <ChevronLeft size={14} />
                                <span>Daftar Kompensasi</span>
                            </Link>
                        }
                    />
                </div>

                <form onSubmit={handleSubmit}>
                    {/* ─── 2-COLUMN DASHBOARD LAYOUT (KANAN - KIRI) ─── */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                        {/* ═══════════════════════════════════════
                            KOLOM KIRI (LEBAR): Form Detail & Protokol Latihan
                           ═══════════════════════════════════════ */}
                        <div className="order-1 lg:col-span-8 xl:col-span-8 space-y-4">
                            {/* Card 1: Informasi Dasar & Ketidakseimbangan Otot */}
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Activity size={14} className="text-orange-500" />
                                        <h3 className="text-xs font-bold text-slate-900">
                                            Informasi Gerakan & Analisis Otot
                                        </h3>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        Informasi Dasar
                                    </span>
                                </div>

                                <div className="p-4 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Kategori */}
                                        <div className="space-y-1">
                                            <label className="block text-[11px] font-bold text-slate-700">
                                                Sudut Pandang / Kategori <span className="text-rose-500">*</span>
                                            </label>
                                            <select
                                                className="w-full rounded-md border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold text-slate-800 shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all cursor-pointer px-2.5 py-1.5"
                                                value={data.category}
                                                onChange={(e) => setData("category", e.target.value)}
                                                required
                                            >
                                                {categories.map((cat) => (
                                                    <option key={cat} value={cat}>
                                                        {cat}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.category && (
                                                <p className="text-rose-500 text-[10.5px] font-bold mt-0.5">{errors.category}</p>
                                            )}
                                        </div>

                                        {/* Nama Kompensasi */}
                                        <div className="space-y-1">
                                            <label className="block text-[11px] font-bold text-slate-700">
                                                Nama Kompensasi Gerakan <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`w-full rounded-md border text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all px-2.5 py-1.5 ${
                                                    errors.name ? "border-rose-300" : "border-slate-200"
                                                }`}
                                                value={data.name}
                                                onChange={(e) => setData("name", e.target.value)}
                                                placeholder="Contoh: Foot Flattens, Arms Fall Forward"
                                                required
                                            />
                                            {errors.name && (
                                                <p className="text-rose-500 text-[10.5px] font-bold mt-0.5">{errors.name}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Analisis Otot 3-Kolom */}
                                    <div className="pt-2 border-t border-slate-100">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                                            Ketidakseimbangan Otot & Potensi Cedera (Pisahkan koma / baris baru)
                                        </span>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {/* Overactive */}
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                                                    <Flame size={12} className="text-rose-500 shrink-0" />
                                                    <span>Otot Overactive</span>
                                                </label>
                                                <textarea
                                                    className="w-full rounded-md border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium text-slate-800 shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all px-3 py-2 resize-y min-h-[130px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                                                    rows="5"
                                                    value={data.overactive_muscles}
                                                    onChange={(e) => setData("overactive_muscles", e.target.value)}
                                                    placeholder="Contoh: Soleus, Lateral gastrocnemius..."
                                                />
                                            </div>

                                            {/* Underactive */}
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                                                    <Dumbbell size={12} className="text-emerald-500 shrink-0" />
                                                    <span>Otot Underactive</span>
                                                </label>
                                                <textarea
                                                    className="w-full rounded-md border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium text-slate-800 shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all px-3 py-2 resize-y min-h-[130px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                                                    rows="5"
                                                    value={data.underactive_muscles}
                                                    onChange={(e) => setData("underactive_muscles", e.target.value)}
                                                    placeholder="Contoh: Medial gastrocnemius, Anterior tibialis..."
                                                />
                                            </div>

                                            {/* Possible Injuries */}
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                                                    <ShieldAlert size={12} className="text-amber-500 shrink-0" />
                                                    <span>Potensi Cedera</span>
                                                </label>
                                                <textarea
                                                    className="w-full rounded-md border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium text-slate-800 shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all px-3 py-2 resize-y min-h-[130px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                                                    rows="5"
                                                    value={data.possible_injuries}
                                                    onChange={(e) => setData("possible_injuries", e.target.value)}
                                                    placeholder="Contoh: Plantar fasciitis, Achilles tendinopathy..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Protokol Latihan Korektif 4 Fase */}
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Zap size={14} className="text-orange-500" />
                                        <h3 className="text-xs font-bold text-slate-900">
                                            Protokol Latihan Korektif (4 Fase NASM)
                                        </h3>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        Fase 1 s/d 4
                                    </span>
                                </div>

                                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Phase 1: Inhibit */}
                                    <div className="bg-slate-50/40 p-3.5 rounded-md border border-slate-200/70 space-y-2.5">
                                        <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60">
                                            <span className="w-5 h-5 rounded bg-orange-100/80 text-orange-700 text-[10.5px] font-black flex items-center justify-center shrink-0 border border-orange-200/60">
                                                1
                                            </span>
                                            <div>
                                                <h6 className="text-xs font-bold text-slate-800">Inhibit (Penghambatan)</h6>
                                                <span className="text-[10px] font-medium text-slate-400">Self-Myofascial Release (SMR)</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-slate-700 block">Instruksi / Nama Latihan</label>
                                            <textarea
                                                className="w-full rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-800 shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all px-3 py-2 resize-y min-h-[90px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                                                rows="3"
                                                value={data.exercises_smr}
                                                onChange={(e) => setData("exercises_smr", e.target.value)}
                                                placeholder="Contoh: SMR Gastrocnemius (tahan 30s)..."
                                            />
                                        </div>

                                        <ImageUploader 
                                            label="Foto Demonstrasi SMR"
                                            field="image_smr"
                                            imagePath={dpaCompensation?.image_smr}
                                            data={data}
                                            setData={setData}
                                            removeFlag="remove_image_smr"
                                        />
                                    </div>

                                    {/* Phase 2: Lengthen */}
                                    <div className="bg-slate-50/40 p-3.5 rounded-md border border-slate-200/70 space-y-2.5">
                                        <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60">
                                            <span className="w-5 h-5 rounded bg-orange-100/80 text-orange-700 text-[10.5px] font-black flex items-center justify-center shrink-0 border border-orange-200/60">
                                                2
                                            </span>
                                            <div>
                                                <h6 className="text-xs font-bold text-slate-800">Lengthen (Pemanjangan)</h6>
                                                <span className="text-[10px] font-medium text-slate-400">Peregangan Statis / Dinamis</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-slate-700 block">Instruksi / Nama Latihan</label>
                                            <textarea
                                                className="w-full rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-800 shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all px-3 py-2 resize-y min-h-[90px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                                                rows="3"
                                                value={data.exercises_stretching}
                                                onChange={(e) => setData("exercises_stretching", e.target.value)}
                                                placeholder="Contoh: Static Gastrocnemius Stretch..."
                                            />
                                        </div>

                                        <ImageUploader 
                                            label="Foto Demonstrasi Peregangan"
                                            field="image_stretching"
                                            imagePath={dpaCompensation?.image_stretching}
                                            data={data}
                                            setData={setData}
                                            removeFlag="remove_image_stretching"
                                        />
                                    </div>

                                    {/* Phase 3: Activate */}
                                    <div className="bg-slate-50/40 p-3.5 rounded-md border border-slate-200/70 space-y-2.5">
                                        <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60">
                                            <span className="w-5 h-5 rounded bg-orange-100/80 text-orange-700 text-[10.5px] font-black flex items-center justify-center shrink-0 border border-orange-200/60">
                                                3
                                            </span>
                                            <div>
                                                <h6 className="text-xs font-bold text-slate-800">Activate (Aktivasi)</h6>
                                                <span className="text-[10px] font-medium text-slate-400">Positional Isometrics</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-slate-700 block">Instruksi / Nama Latihan</label>
                                            <textarea
                                                className="w-full rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-800 shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all px-3 py-2 resize-y min-h-[90px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                                                rows="3"
                                                value={data.exercises_isometrics}
                                                onChange={(e) => setData("exercises_isometrics", e.target.value)}
                                                placeholder="Contoh: Anterior Tibialis Strengthening..."
                                            />
                                        </div>

                                        <ImageUploader 
                                            label="Foto Demonstrasi Aktivasi"
                                            field="image_isometrics"
                                            imagePath={dpaCompensation?.image_isometrics}
                                            data={data}
                                            setData={setData}
                                            removeFlag="remove_image_isometrics"
                                        />
                                    </div>

                                    {/* Phase 4: Integrate */}
                                    <div className="bg-slate-50/40 p-3.5 rounded-md border border-slate-200/70 space-y-2.5">
                                        <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60">
                                            <span className="w-5 h-5 rounded bg-orange-100/80 text-orange-700 text-[10.5px] font-black flex items-center justify-center shrink-0 border border-orange-200/60">
                                                4
                                            </span>
                                            <div>
                                                <h6 className="text-xs font-bold text-slate-800">Integrate (Integrasi)</h6>
                                                <span className="text-[10px] font-medium text-slate-400">Dynamic Movement Integration</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-slate-700 block">Instruksi / Nama Latihan</label>
                                            <textarea
                                                className="w-full rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-800 shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all px-3 py-2 resize-y min-h-[90px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                                                rows="3"
                                                value={data.exercises_integrated}
                                                onChange={(e) => setData("exercises_integrated", e.target.value)}
                                                placeholder="Contoh: Single-Leg Squat with OH Press..."
                                            />
                                        </div>

                                        <ImageUploader 
                                            label="Foto Demonstrasi Integrasi"
                                            field="image_integrated"
                                            imagePath={dpaCompensation?.image_integrated}
                                            data={data}
                                            setData={setData}
                                            removeFlag="remove_image_integrated"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ═══════════════════════════════════════
                            KOLOM KANAN (SIDEBAR): Aksi Simpan & Foto Utama
                           ═══════════════════════════════════════ */}
                        <div className="order-2 lg:col-span-4 xl:col-span-4 space-y-4 lg:sticky lg:top-4">
                            {/* Card 1: Ringkasan & Tombol Simpan */}
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Layers size={14} className="text-orange-500" />
                                        <h3 className="text-xs font-bold text-slate-900">
                                            Status & Aksi
                                        </h3>
                                    </div>
                                    <span className="text-[10.5px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60">
                                        {data.category}
                                    </span>
                                </div>

                                <div className="p-4 space-y-3.5">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                            Nama Kompensasi
                                        </span>
                                        <h4 className="text-sm font-bold text-slate-900">
                                            {data.name || "Belum diisi"}
                                        </h4>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full inline-flex items-center justify-center gap-1.5 h-9 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-md transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
                                        >
                                            <Save size={13.5} />
                                            <span>{processing ? "Menyimpan..." : (isEdit ? "Perbarui Kompensasi" : "Simpan Kompensasi")}</span>
                                        </button>

                                        <Link
                                            href={route("admin.dpa-compensations.index")}
                                            className="w-full inline-flex items-center justify-center h-8 border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-md shadow-2xs transition-colors"
                                        >
                                            <X size={13} className="mr-1" />
                                            <span>Batal</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Foto Visual Gerakan (Referensi Utama) */}
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <ImageIcon size={14} className="text-orange-500" />
                                        <h3 className="text-xs font-bold text-slate-900">
                                            Foto Gerakan Utama
                                        </h3>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-medium">
                                        Visual Referensi
                                    </span>
                                </div>

                                <div className="p-4 space-y-2">
                                    <ImageUploader 
                                        field="image"
                                        imagePath={dpaCompensation?.image_path}
                                        data={data}
                                        setData={setData}
                                        removeFlag="remove_image"
                                    />
                                    {errors.image && (
                                        <p className="text-rose-500 text-[10.5px] font-bold">{errors.image}</p>
                                    )}
                                    <p className="text-[10.5px] text-slate-400 font-medium">
                                        Foto ini akan ditampilkan sebagai visual panduan di penilaian DPA atlet.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
