import CreatableExerciseInput from './CreatableExerciseInput'; // Sesuaikan pathnya
import { Plus, X } from 'lucide-react'; // Pastikan import icon ini

export default function ExcelTable({ data, is_athlete, handleExChange, libExercises, handleAddNewExercise, addNewRow, removeRow, onDeleteExercise }) {    return (
        <div className="bg-white border border-slate-300 rounded-3xl overflow-x-auto shadow-sm custom-scrollbar relative z-20">
            <table className="w-full min-w-[850px] table-fixed text-sm text-left border-collapse">
                <thead className="bg-[#00488b] text-white text-[10px] sm:text-[11px]  font-bold uppercase tracking-wider">
                    <tr>
                        <th rowSpan="2" className="border border-blue-800 px-3 py-3 text-center w-[23%]">EXERCISE</th>
                        <th colSpan="2" className="border border-blue-800 px-1 py-2 text-center bg-blue-900/50 w-[12%]">SET 1</th>
                        <th colSpan="2" className="border border-blue-800 px-1 py-2 text-center w-[12%]">SET 2</th>
                        <th colSpan="2" className="border border-blue-800 px-1 py-2 text-center bg-blue-900/50 w-[12%]">SET 3</th>
                        <th colSpan="2" className="border border-blue-800 px-1 py-2 text-center w-[12%]">SET 4</th>
                        <th rowSpan="2" className="border border-blue-800 px-3 py-3 text-center w-[20%]">NOTE</th>
                        {/* Kolom Baru untuk Tombol Hapus */}
                        {!is_athlete && <th rowSpan="2" className="border border-blue-800 px-2 py-3 text-center w-[5%] bg-blue-950"></th>}
                    </tr>
                    <tr className="bg-blue-900 text-[9px]">
                        <th className="border border-blue-800 px-1 py-1.5 text-center">LOAD</th><th className="border border-blue-800 px-1 py-1.5 text-center">REPS</th>
                        <th className="border border-blue-800 px-1 py-1.5 text-center">LOAD</th><th className="border border-blue-800 px-1 py-1.5 text-center">REPS</th>
                        <th className="border border-blue-800 px-1 py-1.5 text-center">LOAD</th><th className="border border-blue-800 px-1 py-1.5 text-center">REPS</th>
                        <th className="border border-blue-800 px-1 py-1.5 text-center">LOAD</th><th className="border border-blue-800 px-1 py-1.5 text-center">REPS</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Jika tidak ada data gerakan, tampilkan placeholder */}
                    {data.exercises.length === 0 && (
                        <tr>
                            <td colSpan={is_athlete ? 10 : 11} className="py-12 text-center text-slate-400 font-medium italic border-b border-slate-200">
                                Belum ada gerakan yang ditambahkan ke sesi ini.
                            </td>
                        </tr>
                    )}

                    {data.exercises.map((ex, i) => (
                        <tr key={ex.id || `new-${i}`} className="hover:bg-blue-50/30 group">
                            <td className="border border-slate-200 p-0 relative">
                                <CreatableExerciseInput 
                                    value={ex.exercise_name} 
                                    options={libExercises} 
                                    disabled={is_athlete} 
                                    onChange={(val) => handleExChange(i, 'exercise_name', val)} 
                                    onNewOption={handleAddNewExercise} 
                                    onDeleteOption={onDeleteExercise} // <--- Tambahkan ini
                                />
                            </td>
                            
                            {/* ... (Kolom input LOAD & REPS tetap SAMA seperti yang kamu punya sebelumnya) ... */}
                            <td className="border border-slate-200 p-0 bg-slate-50/50"><input disabled={is_athlete} type="text" value={ex.set_1_load || ''} onChange={e => handleExChange(i, 'set_1_load', e.target.value)} className="w-full border-none outline-none bg-transparent text-center px-1 py-3 focus:ring-2 focus:ring-[#00488b]"/></td>
                            <td className="border border-slate-200 p-0 bg-slate-50/50"><input disabled={is_athlete} type="text" value={ex.set_1_reps || ''} onChange={e => handleExChange(i, 'set_1_reps', e.target.value)} className="w-full border-none outline-none bg-transparent text-center px-1 py-3 font-bold text-blue-700 focus:ring-2 focus:ring-[#00488b]"/></td>
                            
                            <td className="border border-slate-200 p-0"><input disabled={is_athlete} type="text" value={ex.set_2_load || ''} onChange={e => handleExChange(i, 'set_2_load', e.target.value)} className="w-full border-none outline-none bg-transparent text-center px-1 py-3 focus:ring-2 focus:ring-[#00488b]"/></td>
                            <td className="border border-slate-200 p-0"><input disabled={is_athlete} type="text" value={ex.set_2_reps || ''} onChange={e => handleExChange(i, 'set_2_reps', e.target.value)} className="w-full border-none outline-none bg-transparent text-center px-1 py-3 font-bold text-blue-700 focus:ring-2 focus:ring-[#00488b]"/></td>
                            
                            <td className="border border-slate-200 p-0 bg-slate-50/50"><input disabled={is_athlete} type="text" value={ex.set_3_load || ''} onChange={e => handleExChange(i, 'set_3_load', e.target.value)} className="w-full border-none outline-none bg-transparent text-center px-1 py-3 focus:ring-2 focus:ring-[#00488b]"/></td>
                            <td className="border border-slate-200 p-0 bg-slate-50/50"><input disabled={is_athlete} type="text" value={ex.set_3_reps || ''} onChange={e => handleExChange(i, 'set_3_reps', e.target.value)} className="w-full border-none outline-none bg-transparent text-center px-1 py-3 font-bold text-blue-700 focus:ring-2 focus:ring-[#00488b]"/></td>
                            
                            <td className="border border-slate-200 p-0"><input disabled={is_athlete} type="text" value={ex.set_4_load || ''} onChange={e => handleExChange(i, 'set_4_load', e.target.value)} className="w-full border-none outline-none bg-transparent text-center px-1 py-3 focus:ring-2 focus:ring-[#00488b]"/></td>
                            <td className="border border-slate-200 p-0"><input disabled={is_athlete} type="text" value={ex.set_4_reps || ''} onChange={e => handleExChange(i, 'set_4_reps', e.target.value)} className="w-full border-none outline-none bg-transparent text-center px-1 py-3 font-bold text-blue-700 focus:ring-2 focus:ring-[#00488b]"/></td>
                            
                            <td className="border border-slate-200 p-0"><input disabled={is_athlete} type="text" placeholder="..." value={ex.notes || ''} onChange={e => handleExChange(i, 'notes', e.target.value)} className="w-full border-none outline-none bg-transparent text-xs px-2 py-3 italic text-slate-500 focus:ring-2 focus:ring-[#00488b]"/></td>
                            
                            {/* Tombol Hapus Baris */}
                            {!is_athlete && (
                                <td className="border border-slate-200 p-0 bg-slate-50 text-center">
                                    <button 
                                        type="button" 
                                        onClick={() => removeRow(i)} 
                                        className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors mx-auto"
                                        title="Hapus Baris"
                                    >
                                        <X className="w-4 h-4  font-bold" />
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Tombol Tambah Gerakan Baru di Bawah Tabel */}
            {!is_athlete && (
                <div className="bg-slate-50 border-t border-slate-200 p-3 flex justify-center">
                    <button 
                        type="button" 
                        onClick={addNewRow} 
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-bold text-sm hover:border-[#00488b] hover:text-[#00488b] hover:bg-blue-50 transition-all w-full justify-center"
                    >
                        <Plus className="w-4 h-4" /> Tambah Gerakan
                    </button>
                </div>
            )}
        </div>
    );
}