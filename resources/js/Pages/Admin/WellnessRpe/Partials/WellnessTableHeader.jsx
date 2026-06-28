import React, { useState } from 'react';

import { Lock, Eraser, Check } from 'lucide-react';

const STICKY_COLS = {
 drag: { left: 0, width: 30, minWidth: 30, maxWidth: 30, boxSizing: 'border-box' },
 c1: { left: 30, width: 40, minWidth: 40, maxWidth: 40, boxSizing: 'border-box' }, 
 c2: { left: 70, width: 50, minWidth: 50, maxWidth: 50, boxSizing: 'border-box' }, 
 c3: { left: 120, width: 40, minWidth: 40, maxWidth: 40, boxSizing: 'border-box' }, 
 c4: { left: 160, width: 180, minWidth: 180, maxWidth: 180, boxSizing: 'border-box' }, 
 superHeader: { left: 0 },
};

export default function WellnessTableHeader({ actions }) {
    
 // State lokal untuk menyimpan ketikan di Header sebelum diterapkan ke semua pemain
 const [globalVals, setGlobalVals] = useState({});

 const wellnessCols = [
 { id: 'quality_of_sleep', label: 'Sleep Quality' },
 { id: 'fatigue', label: 'Fatigue' },
 { id: 'muscle_soreness', label: 'Muscle Soreness' },
 { id: 'stress', label: 'Stress' },
 ];

 // Fungsi Trigger Set All
 const handleGlobalFill = (colId) => {
 const val = globalVals[colId];
 if (val !== undefined && val !== '') {
 actions.fillColumn(colId, val); // Panggil fungsi di Show.jsx
 setGlobalVals(prev => ({...prev, [colId]: ''})); // Kosongkan input header setelah selesai
 }
 };

 // Komponen Input Set All (Agar tidak menulis kode berulang-ulang)
 const renderGlobalInput = (colId) => (
 <div className="flex items-center gap-1 mt-1.5 px-0.5">
 <input
 type="text"
 placeholder="Set All"
 value={globalVals[colId] || ''}
 onChange={e => setGlobalVals(prev => ({...prev, [colId]: e.target.value}))}
 className="w-full h-5 text-[9px] px-1 text-center border border-slate-200  focus:ring-1 focus:ring-slate-500 rounded bg-white  text-slate-900  placeholder-zinc-300  outline-none transition-colors"
 />
 <button
 type="button"
 onClick={() => handleGlobalFill(colId)}
 className="h-5 w-5 flex items-center justify-center bg-slate-800 text-slate-100   rounded hover:opacity-80 transition-opacity shrink-0"
 title="Apply to All"
 >
 <Check size={10} strokeWidth={4} />
 </button>
 </div>
 );

 return (
 <thead className="bg-slate-50 ">
 {/* SUPER HEADER */}
 <tr>
 <th colSpan="5" style={STICKY_COLS.superHeader} className="p-2 border-b sticky z-40 bg-slate-50  align-bottom border-r border-slate-200  shadow-[4px_0_12px_rgba(0,0,0,0.03)]">
 <div className="flex font-black text-slate-400  mb-1 ml-1 text-[9px]">"Athlete"</div>
 </th>
 <th colSpan="4" className="p-2 border-b-2 border-slate-300  text-center font-black text-[9px] tracking-[0.2em] text-slate-800  bg-slate-100/50 ">
 "Wellness Metrics (1-7)"
 </th>
 <th colSpan="3" className="p-2 border-b-2 border-slate-300  text-center font-black text-[9px] tracking-[0.2em] text-slate-800  bg-slate-200/30  border-l">
 "AM Session"
 </th>
 <th colSpan="3" className="p-2 border-b-2 border-slate-300  text-center font-black text-[9px] tracking-[0.2em] text-slate-800  bg-slate-200/30  border-l">
 "PM Session"
 </th>
 <th colSpan="3" className="p-2 border-b bg-slate-100/50  border-l border-slate-200 "></th>
 <th className="p-2 border-b border-slate-200 "></th>
 </tr>
 
 {/* SUB HEADER */}
 <tr className="bg-slate-50  [&>th]:border-b [&>th]:border-slate-200 "> 
 <th style={STICKY_COLS.drag} className="p-2 sticky z-30 bg-slate-50 "></th>
 <th style={STICKY_COLS.c1} className="p-2 font-black text-slate-500 text-[9px] sticky z-30 bg-slate-50  text-center border-r border-slate-200  align-top pt-3">"NO"</th>
 <th style={STICKY_COLS.c2} className="p-2 font-black text-slate-500 text-[9px] sticky z-30 bg-slate-50  text-center border-r border-slate-200  align-top pt-3">"POS"</th>
 <th style={STICKY_COLS.c3} className="p-2 font-black text-slate-500 text-[9px] sticky z-30 bg-slate-50  text-center border-r border-slate-200  align-top pt-3">"NP"</th>
 <th style={STICKY_COLS.c4} className="p-2 font-black text-slate-500 text-[9px] sticky z-30 bg-slate-50  shadow-[4px_0_12px_rgba(0,0,0,0.03)] border-r border-slate-200  align-top pt-3">"PLAYER NAME"</th>
 
 {/* Wellness Inputs */}
 {wellnessCols.map(col => (
 <th key={col.id} className="p-2 font-bold text-[9px] text-center border-l border-slate-200  min-w-[70px] text-slate-700  align-top">
 <div className="flex items-center justify-center gap-1 group/header cursor-default">
 <span className="truncate">{col.label}</span>
 <button type="button" onClick={() => actions.clearColumn(col.id, col.label)} className="text-slate-300  hover:text-slate-600  transition-colors shrink-0 opacity-0 group-hover/header:opacity-100" title={`Clear ${col.label}`}>
 <Eraser size={12} strokeWidth={2.5} />
 </button>
 </div>
 {renderGlobalInput(col.id)}
 </th>
 ))}

 {/* Sesi AM */}
 <th className="p-2 font-bold text-[9px] text-center border-l border-slate-200  min-w-[65px] text-slate-700  bg-slate-100/30  align-top">
 <div>"RPE (1-10)"</div>
 {renderGlobalInput('am_rpe')}
 </th>
 <th className="p-2 font-bold text-[9px] text-center border-l border-slate-200  min-w-[65px] text-slate-700  bg-slate-100/30  align-top">
 <div>"Duration (Minute)"</div>
 {renderGlobalInput('am_duration')}
 </th>
 <th className="p-2 font-bold text-[9px] text-center border-l border-slate-200  min-w-[60px] text-slate-500  bg-slate-100/30  align-top pt-3">
 <div className="flex items-center justify-center gap-1"><Lock size={10} strokeWidth={3} /> "LOAD"</div>
 </th>

 {/* Sesi PM */}
 <th className="p-2 font-bold text-[9px] text-center border-l border-slate-200  min-w-[65px] text-slate-700  bg-slate-100/30  align-top">
 <div>"RPE (1-10)"</div>
 {renderGlobalInput('pm_rpe')}
 </th>
 <th className="p-2 font-bold text-[9px] text-center border-l border-slate-200  min-w-[65px] text-slate-700  bg-slate-100/30  align-top">
 <div>"Duration (Minute)"</div>
 {renderGlobalInput('pm_duration')}
 </th>
 <th className="p-2 font-bold text-[9px] text-center border-l border-slate-200  min-w-[60px] text-slate-500  bg-slate-100/30  align-top pt-3">
 <div className="flex items-center justify-center gap-1"><Lock size={10} strokeWidth={3} /> "Load"</div>
 </th>

 {/* Total & Kalkulasi */}
 <th className="p-2 font-black text-[9px] text-center border-l-2 border-slate-300  min-w-[70px] text-slate-800  bg-slate-100  align-top pt-3">"Daily Load"</th>
 <th className="p-2 font-black text-[9px] text-center border-l border-slate-200  min-w-[70px] text-slate-900  bg-slate-200/50  align-top pt-3">"Daily Score"</th>
 <th className="p-2 font-black text-[9px] text-center border-l border-slate-200  min-w-[70px] text-slate-900  bg-slate-300/50  align-top pt-3">"Weekly Score"</th>
 <th className="p-2 font-bold text-[9px] text-center border-l border-slate-200  min-w-[150px] text-slate-700  bg-slate-50  align-top pt-3">"Notes"</th>
 <th className="p-2 font-bold text-[9px] text-center border-l border-slate-200  text-slate-500 align-top pt-3">"Actions"</th>
 </tr>
 </thead>
 );
}