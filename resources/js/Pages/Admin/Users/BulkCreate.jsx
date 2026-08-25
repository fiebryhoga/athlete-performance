import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { 
    ChevronLeft, Plus, X, Info, Save, UploadCloud, FileSpreadsheet, Trash2, 
    Copy, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, Sparkles 
} from "lucide-react";
import PageHeader from "@/Components/Common/PageHeader";

export default function BulkCreate() {
    const { data, setData, post, processing, errors } = useForm({
        users: [
            { id: 1, name: "", username: "", password: "", age: "", weight: "", height: "", gender: "L" },
            { id: 2, name: "", username: "", password: "", age: "", weight: "", height: "", gender: "L" },
            { id: 3, name: "", username: "", password: "", age: "", weight: "", height: "", gender: "L" }
        ]
    });

    const [counter, setCounter] = useState(4); // for unique row IDs
    const [copiedTemplate, setCopiedTemplate] = useState(false);

    const addRow = () => {
        setData('users', [
            ...data.users,
            { id: counter, name: "", username: "", password: "", age: "", weight: "", height: "", gender: "L" }
        ]);
        setCounter(c => c + 1);
    };

    const addMultipleRows = (count = 5) => {
        let currentCounter = counter;
        const newRows = [];
        for (let i = 0; i < count; i++) {
            newRows.push({
                id: currentCounter++,
                name: "", username: "", password: "", age: "", weight: "", height: "", gender: "L"
            });
        }
        setData('users', [...data.users, ...newRows]);
        setCounter(currentCounter);
    };

    const removeRow = (id) => {
        if (data.users.length <= 1) return;
        setData('users', data.users.filter(row => row.id !== id));
    };

    const clearEmptyRows = () => {
        const filtered = data.users.filter(r => r.name.trim() !== "");
        if (filtered.length === 0) {
            setData('users', [{ id: 1, name: "", username: "", password: "", age: "", weight: "", height: "", gender: "L" }]);
        } else {
            setData('users', filtered);
        }
    };

    const updateRow = (id, field, value) => {
        const newUsers = data.users.map(row => {
            if (row.id === id) {
                return { ...row, [field]: value };
            }
            return row;
        });
        setData('users', newUsers);
    };

    const handlePaste = (e, targetRowId) => {
        const pastedData = e.clipboardData.getData('Text');
        if (!pastedData || (!pastedData.includes('\t') && !pastedData.includes('\n'))) {
            return;
        }

        e.preventDefault();

        const rows = pastedData.split(/\r?\n/).filter(row => row.trim() !== '');
        const newUsers = [...data.users];
        const targetIndex = newUsers.findIndex(r => r.id === targetRowId);
        
        if (targetIndex === -1) return;

        let currentCounter = counter;
        const newRowsToAdd = [];

        // Check if there's a header row being pasted
        let startIndex = 0;
        const firstCols = rows[0].split('\t');
        if (firstCols[0] && (firstCols[0].toLowerCase().includes('nama') || firstCols[0].toLowerCase().includes('name'))) {
            startIndex = 1; // Skip header
        }

        for (let i = startIndex; i < rows.length; i++) {
            const cols = rows[i].split('\t');
            const name = cols[0] ? cols[0].trim() : '';
            if (!name) continue;

            const username = cols[1] ? cols[1].trim() : '';
            const password = cols[2] ? cols[2].trim() : '';
            const age = cols[3] ? cols[3].trim() : '';
            const weight = cols[4] ? cols[4].trim() : '';
            const height = cols[5] ? cols[5].trim() : '';
            const gender = cols[6] && cols[6].trim().toUpperCase() === 'P' ? 'P' : 'L';
            
            const rowIndex = targetIndex + (i - startIndex);
            
            if (rowIndex < newUsers.length) {
                if (!newUsers[rowIndex].name) {
                    newUsers[rowIndex].name = name;
                    newUsers[rowIndex].username = username;
                    newUsers[rowIndex].password = password;
                    newUsers[rowIndex].age = age;
                    newUsers[rowIndex].weight = weight;
                    newUsers[rowIndex].height = height;
                    newUsers[rowIndex].gender = gender;
                } else {
                    newRowsToAdd.push({
                        id: currentCounter++,
                        name, username, password, age, weight, height, gender
                    });
                }
            } else {
                newRowsToAdd.push({
                    id: currentCounter++,
                    name, username, password, age, weight, height, gender
                });
            }
        }

        setData('users', [...newUsers, ...newRowsToAdd]);
        setCounter(currentCounter);
    };

    const copySampleTemplate = () => {
        const sample = "Nama Lengkap\tUsername\tPassword\tUmur\tBB\tTB\tGender\nBudi Santoso\tbudi_s\t12345678\t18\t65\t175\tL\nSiti Rahma\tsiti_r\t12345678\t17\t52\t163\tP";
        navigator.clipboard.writeText(sample);
        setCopiedTemplate(true);
        setTimeout(() => setCopiedTemplate(false), 2500);
    };

    const validUsersCount = data.users.filter(u => u.name.trim() !== "").length;

    const submit = (e) => {
        e.preventDefault();
        
        const validUsers = data.users.filter(u => u.name.trim() !== "");
        
        if (validUsers.length === 0) {
            alert("Harap isi setidaknya satu nama klien.");
            return;
        }

        post(route("admin.users.bulk"), {
            forceFormData: true,
            preserveScroll: true
        });
    };

    const columns = [
        { num: '1', title: 'Nama Lengkap', req: true, desc: 'Wajib diisi' },
        { num: '2', title: 'Username', req: false, desc: 'Opsional (auto)' },
        { num: '3', title: 'Password', req: false, desc: 'Default: 12345678' },
        { num: '4', title: 'Umur', req: false, desc: 'Angka (tahun)' },
        { num: '5', title: 'Berat (kg)', req: false, desc: 'Contoh: 65.5' },
        { num: '6', title: 'Tinggi (cm)', req: false, desc: 'Contoh: 175' },
        { num: '7', title: 'Gender', req: false, desc: 'L / P' },
    ];

    return (
        <AppLayout title="Buat Klien Massal">
            <Head title="Buat Klien Massal" />

            <div className="space-y-4 pb-8 max-w-[1700px] mx-auto">
                
                {/* Modern PageHeader */}
                <PageHeader
                    title="Buat Klien Massal (Bulk Add)"
                    description="Tambah banyak data klien sekaligus dengan cepat. Copy kolom dari Excel / Google Sheets dan paste langsung ke dalam tabel."
                    actions={
                        <div className="flex items-center gap-2">
                            <Link 
                                href={route('admin.users.index', { tab: 'athlete' })} 
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md text-xs font-semibold shadow-2xs transition-all"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                <span>Kembali ke Manajemen Klien</span>
                            </Link>
                        </div>
                    }
                />

                {/* 2-Column Split Layout (Kiri: Grid Spreadsheet, Kanan: Panduan & Aksi Simpan) */}
                <form onSubmit={submit} className="flex flex-col-reverse lg:flex-row items-start gap-4">
                    
                    {/* ─── KOLOM KIRI: Grid Tabel Spreadsheet (Main Area) ─── */}
                    <div className="flex-1 min-w-0 w-full space-y-3">
                        <div className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
                            
                            {/* Table Action Bar */}
                            <div className="px-4 py-2.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-slate-50/70">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-800">Tabel Entri Data</span>
                                    <span className="text-[11px] text-slate-400">({data.users.length} baris)</span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => addMultipleRows(5)}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors shadow-2xs"
                                    >
                                        <Plus size={12} className="text-orange-500" />
                                        <span>5 Baris</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={addRow}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors shadow-2xs"
                                    >
                                        <Plus size={12} className="text-orange-500" />
                                        <span>Tambah Baris</span>
                                    </button>
                                    {data.users.length > 3 && (
                                        <button
                                            type="button"
                                            onClick={clearEmptyRows}
                                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-rose-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md hover:bg-rose-50 transition-colors shadow-2xs"
                                            title="Bersihkan baris yang kosong"
                                        >
                                            <Trash2 size={12} />
                                            <span>Hapus Kosong</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {/* Table Input */}
                            <div className="overflow-x-auto max-h-[calc(100vh-280px)] custom-scrollbar">
                                <table className="w-full text-left border-collapse min-w-[850px]">
                                    <thead className="sticky top-0 z-10">
                                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                            <th className="px-2.5 py-2 w-8 text-center bg-slate-50">No</th>
                                            <th className="px-2.5 py-2 min-w-[180px] bg-slate-50">Nama Lengkap <span className="text-rose-500">*</span></th>
                                            <th className="px-2.5 py-2 min-w-[130px] bg-slate-50">Username</th>
                                            <th className="px-2.5 py-2 min-w-[120px] bg-slate-50">Password</th>
                                            <th className="px-2.5 py-2 w-16 text-center bg-slate-50">Umur</th>
                                            <th className="px-2.5 py-2 w-20 text-center bg-slate-50">BB (kg)</th>
                                            <th className="px-2.5 py-2 w-20 text-center bg-slate-50">TB (cm)</th>
                                            <th className="px-2.5 py-2 w-24 bg-slate-50">Gender</th>
                                            <th className="px-2.5 py-2 w-10 text-center bg-slate-50"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {data.users.map((row, index) => (
                                            <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-2.5 py-1.5 text-center text-[11px] font-semibold text-slate-400">
                                                    {index + 1}
                                                </td>
                                                <td className="px-2.5 py-1.5">
                                                    <input
                                                        type="text"
                                                        value={row.name}
                                                        onPaste={(e) => handlePaste(e, row.id)}
                                                        onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                                                        placeholder={index === 0 ? "Paste data Excel di sini..." : "Nama klien..."}
                                                        className="w-full bg-slate-50/70 focus:bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all placeholder:text-slate-300 font-medium"
                                                    />
                                                    {errors[`users.${index}.name`] && (
                                                        <p className="text-[10px] text-rose-500 mt-0.5 font-medium">{errors[`users.${index}.name`]}</p>
                                                    )}
                                                </td>
                                                <td className="px-2.5 py-1.5">
                                                    <input
                                                        type="text"
                                                        value={row.username}
                                                        onChange={(e) => updateRow(row.id, 'username', e.target.value)}
                                                        placeholder="auto"
                                                        className="w-full bg-slate-50/70 focus:bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all placeholder:text-slate-300 font-mono text-slate-700"
                                                    />
                                                </td>
                                                <td className="px-2.5 py-1.5">
                                                    <input
                                                        type="text"
                                                        value={row.password}
                                                        onChange={(e) => updateRow(row.id, 'password', e.target.value)}
                                                        placeholder="12345678"
                                                        className="w-full bg-slate-50/70 focus:bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all placeholder:text-slate-300"
                                                    />
                                                </td>
                                                <td className="px-2.5 py-1.5">
                                                    <input
                                                        type="number"
                                                        value={row.age}
                                                        onChange={(e) => updateRow(row.id, 'age', e.target.value)}
                                                        placeholder="-"
                                                        className="w-full bg-slate-50/70 focus:bg-white text-center border border-slate-200 rounded-md px-1 py-1 text-xs focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all placeholder:text-slate-300"
                                                    />
                                                </td>
                                                <td className="px-2.5 py-1.5">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={row.weight}
                                                        onChange={(e) => updateRow(row.id, 'weight', e.target.value)}
                                                        placeholder="-"
                                                        className="w-full bg-slate-50/70 focus:bg-white text-center border border-slate-200 rounded-md px-1 py-1 text-xs focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all placeholder:text-slate-300"
                                                    />
                                                </td>
                                                <td className="px-2.5 py-1.5">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={row.height}
                                                        onChange={(e) => updateRow(row.id, 'height', e.target.value)}
                                                        placeholder="-"
                                                        className="w-full bg-slate-50/70 focus:bg-white text-center border border-slate-200 rounded-md px-1 py-1 text-xs focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all placeholder:text-slate-300"
                                                    />
                                                </td>
                                                <td className="px-2.5 py-1.5">
                                                    <select
                                                        value={row.gender}
                                                        onChange={(e) => updateRow(row.id, 'gender', e.target.value)}
                                                        className="w-full bg-slate-50/70 focus:bg-white border border-slate-200 rounded-md px-1.5 py-1 text-xs focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all text-slate-700"
                                                    >
                                                        <option value="L">L</option>
                                                        <option value="P">P</option>
                                                    </select>
                                                </td>
                                                <td className="px-2.5 py-1.5 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRow(row.id)}
                                                        disabled={data.users.length <= 1}
                                                        className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                                                        title="Hapus baris"
                                                    >
                                                        <X size={13} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* ─── KOLOM KANAN: Panduan, Urutan Kolom, & Status Simpan (Sidebar Ringkas) ─── */}
                    <div className="w-full lg:w-[270px] xl:w-[290px] shrink-0 space-y-2.5">
                        
                        {/* Card Panduan Salin Data */}
                        <div className="bg-white border border-slate-200 rounded-md p-3 shadow-2xs space-y-2.5">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Panduan Excel</span>
                                </h3>
                                <span className="text-[9.5px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded border border-emerald-200/60">
                                    Auto Format
                                </span>
                            </div>

                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                Salin data tabel Excel/Spreadsheet, lalu paste di kolom <span className="font-semibold text-slate-700">Nama</span> baris pertama.
                            </p>

                            {/* Urutan Kolom */}
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Urutan Kolom:</span>
                                <div className="grid grid-cols-1 gap-1">
                                    {columns.map((col) => (
                                        <div key={col.num} className="flex items-center justify-between px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[11px]">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-3.5 h-3.5 rounded bg-white border border-slate-200 text-[9px] font-bold text-slate-600 flex items-center justify-center shadow-2xs">
                                                    {col.num}
                                                </span>
                                                <span className="font-medium text-slate-800">
                                                    {col.title} {col.req && <span className="text-rose-500">*</span>}
                                                </span>
                                            </div>
                                            <span className="text-[9.5px] text-slate-400">{col.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tombol Salin Contoh Template */}
                            <button
                                type="button"
                                onClick={copySampleTemplate}
                                className={`w-full flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-md text-[11px] font-semibold border transition-all ${
                                    copiedTemplate 
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs' 
                                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                            >
                                {copiedTemplate ? (
                                    <>
                                        <CheckCircle2 size={12} className="text-emerald-600" />
                                        <span>Contoh Disalin!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={12} className="text-slate-500" />
                                        <span>Salin Format Template</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Card Status & Tombol Simpan */}
                        <div className="bg-white border border-slate-200 rounded-md p-3 shadow-2xs space-y-2.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-[11px] font-medium text-slate-500">Siap Disimpan:</span>
                                <span className={`text-[11px] font-bold px-2 py-0.2 rounded-full ${
                                    validUsersCount > 0 
                                        ? 'bg-orange-100 text-orange-700 border border-orange-200/60' 
                                        : 'bg-slate-100 text-slate-500'
                                }`}>
                                    {validUsersCount} Klien
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={processing || validUsersCount === 0}
                                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-md shadow-2xs hover:shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={13} />
                                <span>{processing ? "Menyimpan..." : `Simpan ${validUsersCount} Data`}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
