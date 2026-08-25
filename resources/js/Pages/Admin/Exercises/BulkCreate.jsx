import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { 
    ChevronLeft, 
    Plus, 
    X, 
    Image as ImageIcon, 
    Info, 
    Save, 
    FileSpreadsheet,
    Layers,
    Trash2,
    CheckCircle,
    HelpCircle,
    Sparkles,
    Package
} from "lucide-react";
import PageHeader from "@/Components/Common/PageHeader";

export default function BulkCreate({ categories = [], packages = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        exercises: [
            { id: 1, name: "", video_link: "", category_id: "", image: null }
        ],
        insert_to_package: false,
        exercise_package_id: "",
    });

    const [counter, setCounter] = useState(2); // for unique row IDs
    const [imagePreviews, setImagePreviews] = useState({});

    const addRow = () => {
        setData('exercises', [
            ...data.exercises,
            { id: counter, name: "", video_link: "", category_id: "", image: null }
        ]);
        setCounter(c => c + 1);
    };

    const removeRow = (id) => {
        if (data.exercises.length <= 1) return;
        setData('exercises', data.exercises.filter(row => row.id !== id));
        const newPreviews = { ...imagePreviews };
        delete newPreviews[id];
        setImagePreviews(newPreviews);
    };

    const updateRow = (id, field, value) => {
        const newExercises = data.exercises.map(row => {
            if (row.id === id) {
                return { ...row, [field]: value };
            }
            return row;
        });
        setData('exercises', newExercises);
    };

    const handleImageChange = (id, e) => {
        const file = e.target.files[0];
        if (file) {
            updateRow(id, 'image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => ({ ...prev, [id]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (id) => {
        updateRow(id, 'image', null);
        const newPreviews = { ...imagePreviews };
        delete newPreviews[id];
        setImagePreviews(newPreviews);
    };

    const handlePaste = (e, targetRowId) => {
        const pastedData = e.clipboardData.getData('Text');
        if (!pastedData || (!pastedData.includes('\t') && !pastedData.includes('\n'))) {
            return;
        }

        e.preventDefault();

        const rows = pastedData.split(/\r?\n/).filter(row => row.trim() !== '');
        
        const newExercises = [...data.exercises];
        const targetIndex = newExercises.findIndex(r => r.id === targetRowId);
        
        if (targetIndex === -1) return;

        let currentCounter = counter;
        const newRowsToAdd = [];

        rows.forEach((row, index) => {
            const cols = row.split('\t');
            const name = cols[0] ? cols[0].trim() : '';
            const videoLink = cols[1] ? cols[1].trim() : '';
            
            if (index === 0) {
                newExercises[targetIndex].name = name;
                newExercises[targetIndex].video_link = videoLink;
            } else {
                if (targetIndex + index < newExercises.length && !newExercises[targetIndex + index].name) {
                    newExercises[targetIndex + index].name = name;
                    newExercises[targetIndex + index].video_link = videoLink;
                } else {
                    newRowsToAdd.push({
                        id: currentCounter++,
                        name: name,
                        video_link: videoLink,
                        category_id: "",
                        image: null
                    });
                }
            }
        });

        setData('exercises', [...newExercises, ...newRowsToAdd]);
        setCounter(currentCounter);
    };

    const submit = (e) => {
        e.preventDefault();
        
        const validExercises = data.exercises.filter(ex => ex.name.trim() !== "");
        
        if (validExercises.length === 0) {
            alert("Harap isi setidaknya satu nama latihan.");
            return;
        }

        post(route("admin.exercises.bulk-store"), {
            forceFormData: true,
            preserveScroll: true
        });
    };

    const validRowsCount = data.exercises.filter(ex => ex.name.trim() !== "").length;

    return (
        <AppLayout title="Buat Latihan Massal (Bulk)">
            <Head title="Buat Latihan Massal" />

            <div className="space-y-4 pb-16">
                {/* ─── PAGE HEADER ─── */}
                <div className="space-y-1">
                    <Link 
                        href={route('admin.exercises.index')} 
                        className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors gap-1.5"
                    >
                        <ChevronLeft size={14} />
                        <span>Kembali ke Master Latihan</span>
                    </Link>

                    <PageHeader 
                        title="Buat Latihan Massal (Bulk)"
                        description="Tambah banyak master latihan sekaligus dengan cepat. Salin (copy) data dari Excel / Spreadsheet dan tempel (paste) langsung ke dalam tabel."
                        actions={
                            <Link 
                                href={route('admin.exercises.index')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                            >
                                <ChevronLeft size={14} />
                                <span>Daftar Latihan</span>
                            </Link>
                        }
                    />
                </div>

                <form onSubmit={submit}>
                    {/* ─── 2-COLUMN DASHBOARD LAYOUT (KANAN - KIRI) ─── */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                        {/* ═══════════════════════════════════════
                            KOLOM KIRI (LEBAR): Tabel Input Massal
                           ═══════════════════════════════════════ */}
                        <div className="order-1 lg:col-span-8 xl:col-span-8 space-y-4">
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
                                    <div className="flex items-center gap-2">
                                        <FileSpreadsheet size={14} className="text-orange-500" />
                                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                                            Tabel Input Latihan Massal
                                        </h3>
                                        <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60 ml-1">
                                            {data.exercises.length} Baris Data
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addRow}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200/90 px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                                    >
                                        <Plus size={13} className="text-orange-600" />
                                        <span>Tambah Baris</span>
                                    </button>
                                </div>
                                
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[750px]">
                                        <thead>
                                            <tr className="bg-slate-50/40 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                <th className="px-3.5 py-2.5 w-10 text-center">No</th>
                                                <th className="px-3 py-2.5 w-14 text-center">Foto</th>
                                                <th className="px-3.5 py-2.5 min-w-[200px]">Nama Latihan <span className="text-rose-500">*</span></th>
                                                <th className="px-3.5 py-2.5 min-w-[200px]">Tautan Video (Opsional)</th>
                                                <th className="px-3.5 py-2.5 w-44">Kategori (Opsional)</th>
                                                <th className="px-3 py-2.5 w-12 text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white text-xs">
                                            {data.exercises.map((row, index) => (
                                                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                                                    <td className="px-3.5 py-2 text-center font-bold text-slate-400">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-3 py-2 text-center">
                                                        <div className="relative group flex items-center justify-center">
                                                            {imagePreviews[row.id] ? (
                                                                <div className="relative w-8 h-8 rounded-md overflow-hidden border border-slate-200 shadow-2xs">
                                                                    <img src={imagePreviews[row.id]} alt="Preview" className="w-full h-full object-cover" />
                                                                    <button 
                                                                        type="button" 
                                                                        onClick={() => removeImage(row.id)}
                                                                        className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                                        title="Hapus gambar"
                                                                    >
                                                                        <X size={11} className="text-white" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <label className="w-8 h-8 rounded-md border border-dashed border-slate-300 bg-slate-50/70 flex items-center justify-center text-slate-400 cursor-pointer hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition-colors" title="Pilih foto gerakan">
                                                                    <ImageIcon size={13} />
                                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(row.id, e)} />
                                                                </label>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-3.5 py-2">
                                                        <input
                                                            type="text"
                                                            value={row.name}
                                                            onPaste={(e) => handlePaste(e, row.id)}
                                                            onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                                                            placeholder="Contoh: Barbell Back Squat"
                                                            className="w-full bg-slate-50/60 focus:bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300 shadow-2xs"
                                                        />
                                                        {errors[`exercises.${index}.name`] && (
                                                            <p className="text-[10px] text-rose-500 mt-0.5 font-bold">{errors[`exercises.${index}.name`]}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-3.5 py-2">
                                                        <input
                                                            type="url"
                                                            value={row.video_link}
                                                            onChange={(e) => updateRow(row.id, 'video_link', e.target.value)}
                                                            placeholder="https://youtube.com/watch?v=..."
                                                            className="w-full bg-slate-50/60 focus:bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300 shadow-2xs"
                                                        />
                                                        {errors[`exercises.${index}.video_link`] && (
                                                            <p className="text-[10px] text-rose-500 mt-0.5 font-bold">{errors[`exercises.${index}.video_link`]}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-3.5 py-2">
                                                        <select
                                                            value={row.category_id}
                                                            onChange={(e) => updateRow(row.id, 'category_id', e.target.value)}
                                                            className="w-full bg-slate-50/60 focus:bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all cursor-pointer shadow-2xs"
                                                        >
                                                            <option value="">Tanpa Kategori</option>
                                                            {categories.map(cat => (
                                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                            ))}
                                                        </select>
                                                        {errors[`exercises.${index}.category_id`] && (
                                                            <p className="text-[10px] text-rose-500 mt-0.5 font-bold">{errors[`exercises.${index}.category_id`]}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-3.5 py-2 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeRow(row.id)}
                                                            disabled={data.exercises.length <= 1}
                                                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                                            title="Hapus baris"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* ═══════════════════════════════════════
                            KOLOM KANAN (SIDEBAR): Aksi Simpan & Petunjuk Paste
                           ═══════════════════════════════════════ */}
                        <div className="order-2 lg:col-span-4 xl:col-span-4 space-y-4 lg:sticky lg:top-4">
                            {/* Card 1: Ringkasan & Tombol Simpan */}
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Layers size={14} className="text-orange-500" />
                                        <h3 className="text-xs font-bold text-slate-900">
                                            Ringkasan & Simpan
                                        </h3>
                                    </div>
                                    <span className="text-[11px] font-bold text-orange-600">
                                        {data.exercises.length} Baris
                                    </span>
                                </div>

                                <div className="p-4 space-y-3.5">
                                    <div className="divide-y divide-slate-100 text-xs">
                                        <div className="py-1.5 flex items-center justify-between">
                                            <span className="text-slate-500 font-medium">Total Baris Tabel</span>
                                            <span className="font-bold text-slate-900">{data.exercises.length} Baris</span>
                                        </div>
                                        <div className="py-1.5 flex items-center justify-between">
                                            <span className="text-slate-500 font-medium">Siap Disimpan (Berisi Nama)</span>
                                            <span className="font-bold text-orange-600">{validRowsCount} Latihan</span>
                                        </div>
                                    </div>

                                    {/* Opsi Masukkan ke Paket */}
                                    <div className="pt-3 border-t border-slate-100 space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input 
                                                type="checkbox" 
                                                className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 bg-white border-slate-300 cursor-pointer"
                                                checked={data.insert_to_package}
                                                onChange={(e) => setData('insert_to_package', e.target.checked)}
                                            />
                                            <span className="text-xs font-bold text-slate-800">
                                                Masukkan ke paket latihan
                                            </span>
                                        </label>

                                        {data.insert_to_package && (
                                            <div className="animate-in fade-in slide-in-from-top-1 duration-150 pt-1">
                                                <select
                                                    value={data.exercise_package_id}
                                                    onChange={(e) => setData('exercise_package_id', e.target.value)}
                                                    className={`w-full bg-slate-50 focus:bg-white border ${
                                                        errors.exercise_package_id ? 'border-rose-300' : 'border-slate-200'
                                                    } rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all cursor-pointer`}
                                                >
                                                    <option value="">-- Pilih Paket Latihan --</option>
                                                    {packages.map(pkg => (
                                                        <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                                                    ))}
                                                </select>
                                                {errors.exercise_package_id && (
                                                    <p className="text-[10px] text-rose-500 mt-0.5 font-bold">{errors.exercise_package_id}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit Action */}
                                    <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                                        <button
                                            type="submit"
                                            disabled={processing || validRowsCount === 0}
                                            className="w-full inline-flex items-center justify-center rounded-md text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-2xs h-9 px-4 gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
                                        >
                                            <Save size={13.5} />
                                            <span>{processing ? "Menyimpan..." : "Simpan Semua Latihan"}</span>
                                        </button>

                                        <Link
                                            href={route("admin.exercises.index")}
                                            className="w-full inline-flex items-center justify-center rounded-md text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 h-8 px-3.5 gap-1.5 shadow-2xs cursor-pointer transition-colors"
                                        >
                                            <X size={13} />
                                            <span>Batal</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Panduan Salin dari Spreadsheet */}
                            <div className="bg-white border border-slate-200/80 rounded-md shadow-2xs overflow-hidden">
                                <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center gap-1.5">
                                    <HelpCircle size={14} className="text-orange-500" />
                                    <h3 className="text-xs font-bold text-slate-900">
                                        Petunjuk Salin dari Excel
                                    </h3>
                                </div>

                                <div className="p-4 space-y-2.5 text-xs text-slate-600 leading-relaxed">
                                    <p>
                                        Anda dapat langsung menyalin <strong className="text-slate-900">2 kolom sekaligus</strong> dari spreadsheet:
                                    </p>
                                    <ul className="space-y-1.5 text-[11.5px] pl-1">
                                        <li className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                                            <span><strong className="text-slate-800">Kolom 1:</strong> Nama Latihan</span>
                                        </li>
                                        <li className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                                            <span><strong className="text-slate-800">Kolom 2:</strong> Tautan Video</span>
                                        </li>
                                    </ul>
                                    <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                                        Klik kolom <em>Nama Latihan</em> pada baris pertama, lalu tekan <strong className="text-slate-900 bg-slate-100 px-1 py-0.5 rounded border border-slate-200">Ctrl + V</strong> (atau Cmd + V). Baris ke bawah akan terisi otomatis.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
