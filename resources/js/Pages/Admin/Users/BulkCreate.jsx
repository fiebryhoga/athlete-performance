import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { ChevronLeft, Plus, X, Info, Save, Users, UploadCloud } from "lucide-react";

export default function BulkCreate() {
    const { data, setData, post, processing, errors } = useForm({
        users: [
            { id: 1, name: "", username: "", password: "", age: "", weight: "", height: "", gender: "L" }
        ]
    });

    const [counter, setCounter] = useState(2); // for unique row IDs

    const addRow = () => {
        setData('users', [
            ...data.users,
            { id: counter, name: "", username: "", password: "", age: "", weight: "", height: "", gender: "L" }
        ]);
        setCounter(c => c + 1);
    };

    const removeRow = (id) => {
        if (data.users.length <= 1) return;
        setData('users', data.users.filter(row => row.id !== id));
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
        if (firstCols[0] && firstCols[0].toLowerCase().includes('nama')) {
            startIndex = 1; // Skip header
        }

        for (let i = startIndex; i < rows.length; i++) {
            const cols = rows[i].split('\t');
            const name = cols[0] ? cols[0].trim() : '';
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
                    // if target row has name, we should push instead of overwrite
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

    return (
        <AppLayout title="Bulk Create Klien">
            <Head title="Buat Klien Massal" />
            <div className="mb-8 mx-auto max-w-[1400px]">
                <Link href={route('admin.users.index')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-4">
                    <ChevronLeft size={16} /> Kembali ke Manajemen Klien
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-white border border-slate-200 rounded-xl shadow-sm"><UploadCloud size={24} className="text-orange-500"/></div>
                    Buat Klien (Bulk)
                </h1>
                <p className="text-gray-600 mt-2">Buat banyak klien sekaligus dengan cepat. Copy dari Excel dan Paste langsung ke dalam tabel.</p>
            </div>

            <div className="mx-auto space-y-6 max-w-[1400px]">
                
                {/* Instruction Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 text-slate-600 text-sm shadow-sm">
                    <Info className="w-5 h-5 text-slate-400 shrink-0" />
                    <div>
                        <p className="mb-1">
                            <strong>Petunjuk:</strong> Anda dapat menempel (paste) data dari Excel. Kolom harus berurutan: <strong>Nama (Wajib) | Username | Password | Umur | BB | TB | Gender (L/P)</strong>. 
                        </p>
                        <p className="text-xs text-slate-500">
                            Klik pada kotak masukan <strong>Nama</strong> di baris kosong, lalu tekan <strong>Ctrl+V</strong> (atau Cmd+V). Sistem akan otomatis mengisi baris ke bawah. Jika Username dikosongkan, sistem akan otomatis men-generate-nya. Jika password dikosongkan, defaultnya adalah <strong>12345678</strong>.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-md">{data.users.length}</span> Baris Data
                            </h3>
                            <button
                                type="button"
                                onClick={addRow}
                                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <Plus size={14} /> Tambah Baris
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[1000px]">
                                <thead>
                                    <tr className="bg-white border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="px-4 py-3 w-12 text-center">No</th>
                                        <th className="px-4 py-3 min-w-[200px]">Nama <span className="text-rose-500">*</span></th>
                                        <th className="px-4 py-3 min-w-[150px]">Username</th>
                                        <th className="px-4 py-3 min-w-[150px]">Password</th>
                                        <th className="px-4 py-3 w-24 text-center">Umur</th>
                                        <th className="px-4 py-3 w-24 text-center">BB (kg)</th>
                                        <th className="px-4 py-3 w-24 text-center">TB (cm)</th>
                                        <th className="px-4 py-3 w-32">Gender</th>
                                        <th className="px-4 py-3 w-16 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {data.users.map((row, index) => (
                                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-3 text-center text-xs font-medium text-slate-400">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    value={row.name}
                                                    onPaste={(e) => handlePaste(e, row.id)}
                                                    onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                                                    placeholder="Nama Klien"
                                                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300"
                                                />
                                                {errors[`users.${index}.name`] && (
                                                    <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors[`users.${index}.name`]}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    value={row.username}
                                                    onChange={(e) => updateRow(row.id, 'username', e.target.value)}
                                                    placeholder="Auto-generate"
                                                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    value={row.password}
                                                    onChange={(e) => updateRow(row.id, 'password', e.target.value)}
                                                    placeholder="12345678"
                                                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="number"
                                                    value={row.age}
                                                    onChange={(e) => updateRow(row.id, 'age', e.target.value)}
                                                    placeholder="-"
                                                    className="w-full bg-white text-center border border-slate-200 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={row.weight}
                                                    onChange={(e) => updateRow(row.id, 'weight', e.target.value)}
                                                    placeholder="-"
                                                    className="w-full bg-white text-center border border-slate-200 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={row.height}
                                                    onChange={(e) => updateRow(row.id, 'height', e.target.value)}
                                                    placeholder="-"
                                                    className="w-full bg-white text-center border border-slate-200 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={row.gender}
                                                    onChange={(e) => updateRow(row.id, 'gender', e.target.value)}
                                                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-700"
                                                >
                                                    <option value="L">Laki-laki</option>
                                                    <option value="P">Perempuan</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => removeRow(row.id)}
                                                    disabled={data.users.length <= 1}
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

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
                        >
                            <Save size={16} />
                            {processing ? "Menyimpan..." : "Simpan Semua Data"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
