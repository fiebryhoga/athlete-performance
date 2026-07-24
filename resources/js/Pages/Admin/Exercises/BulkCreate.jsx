import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { ChevronLeft, AlignLeft, Plus, X, Image as ImageIcon, Info, Save } from "lucide-react";

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

    return (
        <AppLayout title="Bulk Create Latihan">
            <Head title="Buat Latihan Massal" />
            <div className="mb-8 mx-auto">
                <Link href={route('admin.exercises.index')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-4">
                    <ChevronLeft size={16} /> Kembali ke Master Latihan
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-white border border-slate-200 rounded-xl shadow-sm"><AlignLeft size={24} className="text-slate-900"/></div>
                    Buat Latihan (Bulk)
                </h1>
                <p className="text-gray-600 mt-2">Buat banyak master latihan sekaligus dengan cepat. Copy dari Excel dan Paste langsung ke dalam tabel.</p>
            </div>

            <div className="mx-auto space-y-6">
                
                {/* Instruction Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 text-slate-600 text-sm shadow-sm">
                    <Info className="w-5 h-5 text-slate-400 shrink-0" />
                    <p>
                        <strong>Petunjuk:</strong> Anda dapat menempel (paste) 2 kolom sekaligus dari Excel: <strong>Kolom 1: Nama Latihan</strong> dan <strong>Kolom 2: Link Video</strong>. Klik pada baris pertama di kolom Nama Latihan, lalu tekan <strong>Ctrl+V</strong> (atau Cmd+V). Sistem akan otomatis mengisi ke bawah.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <span className="bg-slate-900 text-white text-xs px-2 py-0.5 rounded-md">{data.exercises.length}</span> Data Ready to Save
                            </h3>
                            <button
                                type="button"
                                onClick={addRow}
                                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <Plus size={14} /> Add Empty Row
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-white border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="px-6 py-3 w-12 text-center">No</th>
                                        <th className="px-6 py-3 w-16 text-center">Gambar</th>
                                        <th className="px-6 py-3 min-w-[200px]">Exercise Name <span className="text-rose-500">*</span></th>
                                        <th className="px-6 py-3 min-w-[200px]">Video Link (Optional)</th>
                                        <th className="px-6 py-3 w-48">Category (Optional)</th>
                                        <th className="px-6 py-3 w-16 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {data.exercises.map((row, index) => (
                                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-3 text-center text-xs font-medium text-slate-400">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <div className="relative group flex items-center justify-center">
                                                    {imagePreviews[row.id] ? (
                                                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                                                            <img src={imagePreviews[row.id]} alt="Preview" className="w-full h-full object-cover" />
                                                            <button 
                                                                type="button" 
                                                                onClick={() => removeImage(row.id)}
                                                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                title="Hapus gambar"
                                                            >
                                                                <X className="w-4 h-4 text-white" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <label className="w-10 h-10 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 cursor-pointer hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition-colors">
                                                            <ImageIcon size={16} />
                                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(row.id, e)} />
                                                        </label>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-3">
                                                <input
                                                    type="text"
                                                    value={row.name}
                                                    onPaste={(e) => handlePaste(e, row.id)}
                                                    onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                                                    placeholder="e.g., Barbell Back Squat"
                                                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300"
                                                />
                                                {errors[`exercises.${index}.name`] && (
                                                    <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors[`exercises.${index}.name`]}</p>
                                                )}
                                            </td>
                                            <td className="px-6 py-3">
                                                <input
                                                    type="text"
                                                    value={row.video_link}
                                                    onChange={(e) => updateRow(row.id, 'video_link', e.target.value)}
                                                    placeholder="https://youtube.com/..."
                                                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300"
                                                />
                                                {errors[`exercises.${index}.video_link`] && (
                                                    <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors[`exercises.${index}.video_link`]}</p>
                                                )}
                                            </td>
                                            <td className="px-6 py-3">
                                                <select
                                                    value={row.category_id}
                                                    onChange={(e) => updateRow(row.id, 'category_id', e.target.value)}
                                                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-700"
                                                >
                                                    <option value="">Uncategorized</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                                {errors[`exercises.${index}.category_id`] && (
                                                    <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors[`exercises.${index}.category_id`]}</p>
                                                )}
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => removeRow(row.id)}
                                                    disabled={data.exercises.length <= 1}
                                                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title="Hapus baris"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                        {/* Package Insertion Feature */}
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        className="peer sr-only"
                                        checked={data.insert_to_package}
                                        onChange={(e) => setData('insert_to_package', e.target.checked)}
                                    />
                                    <div className="w-5 h-5 rounded border-2 border-slate-300 bg-white peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-colors flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 12 12" fill="none">
                                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                                    Simpan sekaligus masukkan ke paket
                                </span>
                            </label>

                            {data.insert_to_package && (
                                <div className="ml-7 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <select
                                        value={data.exercise_package_id}
                                        onChange={(e) => setData('exercise_package_id', e.target.value)}
                                        className={`w-full max-w-xs bg-white border ${errors.exercise_package_id ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-orange-500 focus:ring-orange-500/20'} rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none transition-all`}
                                    >
                                        <option value="">-- Pilih Paket Latihan --</option>
                                        {packages.map(pkg => (
                                            <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                                        ))}
                                    </select>
                                    {errors.exercise_package_id && (
                                        <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.exercise_package_id}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
                        >
                            <Save size={16} />
                            {processing ? "Menyimpan..." : "Save All Exercises"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
