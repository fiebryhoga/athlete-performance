

import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { Edit, Trash2, CalendarDays, Activity, Scale, HeartPulse, Droplets, AlertTriangle } from 'lucide-react';

export default function HistoryTable({ history, onEdit, canDelete }) {
 const { delete: destroy, processing } = useForm();
 
 
 const [confirmingDeletion, setConfirmingDeletion] = useState(false);
 const [deleteId, setDeleteId] = useState(null);

 const confirmDelete = (id) => {
 setDeleteId(id);
 setConfirmingDeletion(true);
 };

 const closeModal = () => {
 setConfirmingDeletion(false);
 setDeleteId(null);
 };

 const deleteRecord = () => {
 if (!deleteId) return;
 destroy(route('admin.composition-tests.destroy', deleteId), {
 preserveScroll: true,
 onSuccess: () => closeModal(),
 });
 };

 
 const formatDate = (dateString) => {
 const options = { day: 'numeric', month: 'short', year: 'numeric' };
 return new Date(dateString).toLocaleDateString('en-US', options);
 };

 if (!history || history.length === 0) return null;

 return (
 <>
 <div className="bg-white  border border-zinc-200  rounded-xl shadow-sm overflow-hidden flex flex-col">
 
 
 <div className="px-6 py-5 border-b border-zinc-200  flex items-center justify-between bg-zinc-50/50 ">
 <div className="space-y-1">
 <h3 className="text-base font-semibold tracking-tight text-zinc-950 ">
 {"Measurement History"}
 </h3>
 <p className="text-xs text-zinc-500 ">
 {"Historical register of player's body composition records."}
 </p>
 </div>
 </div>
 
 
 <div className="overflow-x-auto custom-scrollbar">
 <table className="w-full text-sm text-left">
 <thead className="text-[11px] font-bold text-zinc-500  bg-zinc-50/80  border-b border-zinc-200 ">
 <tr>
 <th className="px-6 py-4 whitespace-nowrap">
 <div className="flex items-center gap-1.5"><CalendarDays size={14} /> {"Date"}</div>
 </th>
 <th className="px-6 py-4 whitespace-nowrap">
 <div className="flex items-center gap-1.5"><Scale size={14} /> {"Weight & BMI"}</div>
 </th>
 <th className="px-6 py-4 whitespace-nowrap">
 <div className="flex items-center gap-1.5"><Activity size={14} /> {"Body Fat & Muscle"}</div>
 </th>
 <th className="px-6 py-4 whitespace-nowrap">
 <div className="flex items-center gap-1.5"><HeartPulse size={14} /> {"Visceral & Hydration"}</div>
 </th>
 {(onEdit || canDelete) && (
 <th className="px-6 py-4 whitespace-nowrap text-right">{"Actions"}</th>
 )}
 </tr>
 </thead>
 <tbody className="divide-y divide-zinc-200 ">
 {history.map((item, index) => (
 <tr 
 key={item.id} 
 className="group hover:bg-zinc-50/50  transition-colors bg-white "
 >
 
 <td className="px-6 py-4 whitespace-nowrap">
 <div className="flex items-center gap-2">
 
 {index === 0 && (
 <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" title="Latest Data"></span>
 )}
 <span className={`font-semibold ${index === 0 ? 'text-zinc-950 ' : 'text-zinc-700 '}`}>
 {formatDate(item.date)}
 </span>
 </div>
 </td>

 
 <td className="px-6 py-4 whitespace-nowrap">
 <div className="flex items-center gap-2">
 <span className="font-bold text-zinc-900  tabular-nums">
 {item.weight} <span className="text-xs font-normal text-zinc-500">kg</span>
 </span>
 {item.bmi && (
 <span className="px-2 py-0.5 bg-zinc-100  text-zinc-600  text-[10px] font-bold rounded-md border border-zinc-200 ">
 BMI {item.bmi}
 </span>
 )}
 </div>
 </td>

 
 <td className="px-6 py-4 whitespace-nowrap">
 <div className="flex flex-col gap-1.5">
 <div className="flex items-center gap-1.5 text-xs">
 <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
 <span className="text-zinc-500  w-8">Fat:</span>
 <span className="font-bold text-zinc-900  tabular-nums">{item.body_fat_percentage ?? '-'}%</span>
 </div>
 <div className="flex items-center gap-1.5 text-xs">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
 <span className="text-zinc-500  w-8">Msc:</span>
 <span className="font-bold text-zinc-900  tabular-nums">{item.muscle_mass ?? '-'} kg</span>
 </div>
 </div>
 </td>

 
 <td className="px-6 py-4 whitespace-nowrap">
 <div className="flex items-center gap-4">
 <div className="flex flex-col text-xs">
 <span className="text-zinc-500  flex items-center gap-1">{"Visceral"}</span>
 <span className="font-bold text-zinc-900 ">Lvl {item.visceral_fat ?? '-'}</span>
 </div>
 <div className="w-px h-6 bg-zinc-200 "></div>
 <div className="flex flex-col text-xs">
 <span className="text-zinc-500  flex items-center gap-1">{"Water (TBW)"}</span>
 <span className="font-bold text-zinc-900  text-blue-600 ">{item.total_body_water ?? '-'}%</span>
 </div>
 </div>
 </td>

 
 {(onEdit || canDelete) && (
 <td className="px-6 py-4 whitespace-nowrap text-right">
 <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
 {onEdit && (
 <button 
 onClick={() => onEdit(item)}
 className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50  rounded-md transition-colors"
 title="Edit Data"
 >
 <Edit className="w-4 h-4" />
 </button>
 )}
 {canDelete && (
 <button 
 onClick={() => confirmDelete(item.id)}
 className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50  rounded-md transition-colors"
 title="Delete Data"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 )}
 </div>
 </td>
 )}
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 
 <Modal show={confirmingDeletion} onClose={closeModal} maxWidth="sm">
 <div className="p-6 bg-white ">
 <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100  rounded-full border border-red-200 ">
 <AlertTriangle className="w-6 h-6 text-red-600 " />
 </div>
 
 <h2 className="text-lg font-bold text-center text-zinc-900  mb-2">
 Delete Record?
 </h2>
 <p className="text-sm text-center text-zinc-500  mb-6 leading-relaxed">
 {"Body composition data on this date will be permanently deleted from the system. This action cannot be undone."}
 </p>
 
 <div className="flex gap-3 justify-center w-full">
 <button 
 onClick={closeModal} 
 disabled={processing}
 className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-700  bg-white  border border-zinc-200  rounded-lg hover:bg-zinc-50  transition-colors"
 >
 {"Cancel"}
 </button>
 <button 
 onClick={deleteRecord} 
 disabled={processing} 
 className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex justify-center items-center"
 >
 {processing ? (
 <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
 ) : 'Yes, Delete'}
 </button>
 </div>
 </div>
 </Modal>
 </>
 );
}