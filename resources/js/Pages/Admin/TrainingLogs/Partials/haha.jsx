import CreatableExerciseInput from './CreatableExerciseInput'; 
import { Plus, X, Dumbbell } from 'lucide-react'; 

export default function ExcelTable({ data, is_athlete, handleExChange, libExercises, handleAddNewExercise, addNewRow, removeRow, onDeleteExercise }) {    
    return (
        <div className="w-full max-w-full">
            

            <div className="lg:hidden flex flex-col gap-4 w-full relative z-20">
                {data.exercises.length === 0 && (
                    <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 font-medium italic shadow-sm">
                        Belum ada gerakan yang ditambahkan ke sesi ini.
                    </div>
                )}

                {data.exercises.map((ex, i) => (
                    <div key={ex.id || `mob-${i}`} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative">
                        
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Dumbbell className="w-3.5 h-3.5"/> Gerakan {i + 1}
                            </span>
                            {!is_athlete && (
                                <button type="button" onClick={() => removeRow(i)} className="text-rose-400 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 p-1.5 rounded-lg transition-colors touch-manipulation">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        
                        <div className="mb-4 border border-slate-200 rounded-xl bg-slate-50 relative z-50">
                            <CreatableExerciseInput 
                                value={ex.exercise_name} 
                                options={libExercises} 
                                disabled={is_athlete} 
                                onChange={(val) => handleExChange(i, 'exercise_name', val)} 
                                onNewOption={handleAddNewExercise} 
                                onDeleteOption={onDeleteExercise} 
                            />
                        </div>

                        
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            
                            <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-2.5 shadow-sm">
                                <div className="text-[10px] font-bold text-[#ff4d00] text-center mb-2 tracking-widest">SET 1</div>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <p className="text-[8px] text-slate-400 text-center mb-1 font-bold">LOAD</p>
                                        <input disabled={is_athlete} type="text" inputMode="decimal" value={ex.set_1_load || ''} onChange={e => handleExChange(i, 'set_1_load', e.target.value)} className="w-full text-center text-xs p-2 rounded-lg border border-slate-200 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] outline-none touch-manipulation bg-white"/>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[8px] text-slate-400 text-center mb-1 font-bold">REPS</p>
                                        <input disabled={is_athlete} type="text" inputMode="numeric" value={ex.set_1_reps || ''} onChange={e => handleExChange(i, 'set_1_reps', e.target.value)} className="w-full text-center text-xs font-bold text-[#ff4d00] p-2 rounded-lg border border-slate-200 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] outline-none touch-manipulation bg-white"/>
                                    </div>
                                </div>
                            </div>

                            
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 shadow-sm">
                                <div className="text-[10px] font-bold text-slate-500 text-center mb-2 tracking-widest">SET 2</div>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <p className="text-[8px] text-slate-400 text-center mb-1 font-bold">LOAD</p>
                                        <input disabled={is_athlete} type="text" inputMode="decimal" value={ex.set_2_load || ''} onChange={e => handleExChange(i, 'set_2_load', e.target.value)} className="w-full text-center text-xs p-2 rounded-lg border border-slate-200 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] outline-none touch-manipulation bg-white"/>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[8px] text-slate-400 text-center mb-1 font-bold">REPS</p>
                                        <input disabled={is_athlete} type="text" inputMode="numeric" value={ex.set_2_reps || ''} onChange={e => handleExChange(i, 'set_2_reps', e.target.value)} className="w-full text-center text-xs font-bold text-[#ff4d00] p-2 rounded-lg border border-slate-200 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] outline-none touch-manipulation bg-white"/>
                                    </div>
                                </div>
                            </div>

                            
                            <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-2.5 shadow-sm">
                                <div className="text-[10px] font-bold text-[#ff4d00] text-center mb-2 tracking-widest">SET 3</div>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <p className="text-[8px] text-slate-400 text-center mb-1 font-bold">LOAD</p>
                                        <input disabled={is_athlete} type="text" inputMode="decimal" value={ex.set_3_load || ''} onChange={e => handleExChange(i, 'set_3_load', e.target.value)} className="w-full text-center text-xs p-2 rounded-lg border border-slate-200 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] outline-none touch-manipulation bg-white"/>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[8px] text-slate-400 text-center mb-1 font-bold">REPS</p>
                                        <input disabled={is_athlete} type="text" inputMode="numeric" value={ex.set_3_reps || ''} onChange={e => handleExChange(i, 'set_3_reps', e.target.value)} className="w-full text-center text-xs font-bold text-[#ff4d00] p-2 rounded-lg border border-slate-200 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] outline-none touch-manipulation bg-white"/>
                                    </div>
                                </div>
                            </div>

                            
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 shadow-sm">
                                <div className="text-[10px] font-bold text-slate-500 text-center mb-2 tracking-widest">SET 4</div>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <p className="text-[8px] text-slate-400 text-center mb-1 font-bold">LOAD</p>
                                        <input disabled={is_athlete} type="text" inputMode="decimal" value={ex.set_4_load || ''} onChange={e => handleExChange(i, 'set_4_load', e.target.value)} className="w-full text-center text-xs p-2 rounded-lg border border-slate-200 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] outline-none touch-manipulation bg-white"/>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[8px] text-slate-400 text-center mb-1 font-bold">REPS</p>
                                        <input disabled={is_athlete} type="text" inputMode="numeric" value={ex.set_4_reps || ''} onChange={e => handleExChange(i, 'set_4_reps', e.target.value)} className="w-full text-center text-xs font-bold text-[#ff4d00] p-2 rounded-lg border border-slate-200 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] outline-none touch-manipulation bg-white"/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
                            <input disabled={is_athlete} type="text" placeholder="Tambahkan catatan (opsional)..." value={ex.notes || ''} onChange={e => handleExChange(i, 'notes', e.target.value)} className="w-full text-xs p-2 bg-transparent outline-none italic text-slate-600 touch-manipulation placeholder-slate-400"/>
                        </div>
                    </div>
                ))}

                {!is_athlete && (
                    <button type="button" onClick={addNewRow} className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-bold text-sm hover:border-[#ff4d00] hover:text-[#ff4d00] hover:bg-orange-50 transition-all w-full touch-manipulation mt-2 bg-white">
                        <Plus className="w-5 h-5" /> Tambah Gerakan Baru
                    </button>
                )}
            </div>

            
            <div className="hidden lg:flex bg-white border border-slate-300 rounded-3xl overflow-hidden shadow-sm relative z-20 flex-col w-full max-w-full">
                <div className="overflow-x-auto w-full custom-scrollbar relative">
                    <table className="w-full min-w-[900px] table-fixed text-sm text-left border-collapse relative">
                        <thead className="bg-[#ff4d00] text-white text-[11px] font-bold uppercase tracking-wider relative z-30">
                            <tr>
                                <th rowSpan="2" className="border-r border-b border-orange-700 px-3 py-3 text-center w-[25%] z-40">EXERCISE</th>
                                <th colSpan="2" className="border-r border-b border-orange-700 px-1 py-2 text-center bg-orange-800/40 w-[12%]">SET 1</th>
                                <th colSpan="2" className="border-r border-b border-orange-700 px-1 py-2 text-center w-[12%]">SET 2</th>
                                <th colSpan="2" className="border-r border-b border-orange-700 px-1 py-2 text-center bg-orange-800/40 w-[12%]">SET 3</th>
                                <th colSpan="2" className="border-r border-b border-orange-700 px-1 py-2 text-center w-[12%]">SET 4</th>
                                <th rowSpan="2" className="border-b border-orange-700 px-3 py-3 text-center w-[20%]">NOTE</th>
                                {!is_athlete && <th rowSpan="2" className="bg-orange-950 border-l border-b border-orange-700 px-1 py-3 text-center w-[5%] z-40"></th>}
                            </tr>
                            <tr className="bg-orange-900 text-[9px]">
                                <th className="border-r border-b border-orange-700 px-1 py-1.5 text-center w-[6%]">LOAD</th><th className="border-r border-b border-orange-700 px-1 py-1.5 text-center w-[6%]">REPS</th>
                                <th className="border-r border-b border-orange-700 px-1 py-1.5 text-center w-[6%]">LOAD</th><th className="border-r border-b border-orange-700 px-1 py-1.5 text-center w-[6%]">REPS</th>
                                <th className="border-r border-b border-orange-700 px-1 py-1.5 text-center w-[6%]">LOAD</th><th className="border-r border-b border-orange-700 px-1 py-1.5 text-center w-[6%]">REPS</th>
                                <th className="border-r border-b border-orange-700 px-1 py-1.5 text-center w-[6%]">LOAD</th><th className="border-b border-orange-700 px-1 py-1.5 text-center w-[6%]">REPS</th>
                            </tr>
                        </thead>
                        <tbody className="relative z-10">
                            {data.exercises.length === 0 && (
                                <tr>
                                    <td colSpan={is_athlete ? 10 : 11} className="py-12 text-center text-slate-400 font-medium italic border-b border-slate-200 bg-slate-50">
                                        Belum ada gerakan yang ditambahkan ke sesi ini.
                                    </td>
                                </tr>
                            )}

                            {data.exercises.map((ex, i) => (
                                <tr key={ex.id || `desk-${i}`} className="hover:bg-orange-50/30 group bg-white border-b border-slate-200 last:border-b-0">
                                    <td className="bg-white group-hover:bg-orange-50/50 border-r border-slate-200 p-0 relative z-20">
                                        <CreatableExerciseInput 
                                            value={ex.exercise_name} 
                                            options={libExercises} 
                                            disabled={is_athlete} 
                                            onChange={(val) => handleExChange(i, 'exercise_name', val)} 
                                            onNewOption={handleAddNewExercise} 
                                            onDeleteOption={onDeleteExercise} 
                                        />
                                    </td>
                                    
                                    <td className="border-r border-slate-200 p-0 bg-slate-50/50"><input disabled={is_athlete} type="text" inputMode="decimal" value={ex.set_1_load || ''} onChange={e => handleExChange(i, 'set_1_load', e.target.value)} className="w-full h-full border-none outline-none bg-transparent text-center px-1 py-4 focus:ring-2 focus:ring-inset focus:ring-[#ff4d00]"/></td>
                                    <td className="border-r border-slate-200 p-0 bg-slate-50/50"><input disabled={is_athlete} type="text" inputMode="numeric" value={ex.set_1_reps || ''} onChange={e => handleExChange(i, 'set_1_reps', e.target.value)} className="w-full h-full border-none outline-none bg-transparent text-center px-1 py-4 font-bold text-[#ff4d00] focus:ring-2 focus:ring-inset focus:ring-[#ff4d00]"/></td>
                                    
                                    <td className="border-r border-slate-200 p-0"><input disabled={is_athlete} type="text" inputMode="decimal" value={ex.set_2_load || ''} onChange={e => handleExChange(i, 'set_2_load', e.target.value)} className="w-full h-full border-none outline-none bg-transparent text-center px-1 py-4 focus:ring-2 focus:ring-inset focus:ring-[#ff4d00]"/></td>
                                    <td className="border-r border-slate-200 p-0"><input disabled={is_athlete} type="text" inputMode="numeric" value={ex.set_2_reps || ''} onChange={e => handleExChange(i, 'set_2_reps', e.target.value)} className="w-full h-full border-none outline-none bg-transparent text-center px-1 py-4 font-bold text-[#ff4d00] focus:ring-2 focus:ring-inset focus:ring-[#ff4d00]"/></td>
                                    
                                    <td className="border-r border-slate-200 p-0 bg-slate-50/50"><input disabled={is_athlete} type="text" inputMode="decimal" value={ex.set_3_load || ''} onChange={e => handleExChange(i, 'set_3_load', e.target.value)} className="w-full h-full border-none outline-none bg-transparent text-center px-1 py-4 focus:ring-2 focus:ring-inset focus:ring-[#ff4d00]"/></td>
                                    <td className="border-r border-slate-200 p-0 bg-slate-50/50"><input disabled={is_athlete} type="text" inputMode="numeric" value={ex.set_3_reps || ''} onChange={e => handleExChange(i, 'set_3_reps', e.target.value)} className="w-full h-full border-none outline-none bg-transparent text-center px-1 py-4 font-bold text-[#ff4d00] focus:ring-2 focus:ring-inset focus:ring-[#ff4d00]"/></td>
                                    
                                    <td className="border-r border-slate-200 p-0"><input disabled={is_athlete} type="text" inputMode="decimal" value={ex.set_4_load || ''} onChange={e => handleExChange(i, 'set_4_load', e.target.value)} className="w-full h-full border-none outline-none bg-transparent text-center px-1 py-4 focus:ring-2 focus:ring-inset focus:ring-[#ff4d00]"/></td>
                                    <td className="border-r border-slate-200 p-0"><input disabled={is_athlete} type="text" inputMode="numeric" value={ex.set_4_reps || ''} onChange={e => handleExChange(i, 'set_4_reps', e.target.value)} className="w-full h-full border-none outline-none bg-transparent text-center px-1 py-4 font-bold text-[#ff4d00] focus:ring-2 focus:ring-inset focus:ring-[#ff4d00]"/></td>
                                    
                                    <td className="p-0"><input disabled={is_athlete} type="text" placeholder="..." value={ex.notes || ''} onChange={e => handleExChange(i, 'notes', e.target.value)} className="w-full h-full border-none outline-none bg-transparent text-xs px-3 py-4 italic text-slate-500 focus:ring-2 focus:ring-inset focus:ring-[#ff4d00]"/></td>
                                    
                                    {!is_athlete && (
                                        <td className="bg-slate-50 group-hover:bg-orange-50/80 border-l border-slate-200 p-0 text-center z-20">
                                            <button type="button" onClick={() => removeRow(i)} className="text-rose-400 hover:text-rose-600 hover:bg-rose-100 p-4 w-full h-full flex items-center justify-center transition-colors mx-auto" title="Hapus Baris">
                                                <X className="w-5 h-5 font-bold" />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {!is_athlete && (
                    <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-center shrink-0">
                        <button type="button" onClick={addNewRow} className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-bold text-sm hover:border-[#ff4d00] hover:text-[#ff4d00] hover:bg-orange-50 transition-all min-w-[300px]">
                            <Plus className="w-5 h-5" /> Tambah Gerakan Baru
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}