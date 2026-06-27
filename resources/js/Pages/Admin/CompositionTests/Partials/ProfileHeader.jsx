

import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, Plus, User, Download, Loader2 } from 'lucide-react';

export default function ProfileHeader({ player, latestTest, totalTests, onAddRecord, onExport, isExporting }) {
 return (
 <div className="bg-white  border border-zinc-200  rounded-xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden transition-colors">
 


 
 <div className="flex items-start md:items-center gap-5 relative z-10 w-full md:w-auto">
 <div className="shrink-0">
 {player.photo_url ? (
 <img 
 src={player.photo_url} 
 alt={player.name} 
 
 className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border border-zinc-200  shadow-sm bg-zinc-50 "
 />
 ) : (
 <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl border border-zinc-200  shadow-sm bg-zinc-50  flex items-center justify-center">
 <User size={32} strokeWidth={1.5} className="text-zinc-400" />
 </div>
 )}
 </div>
 
 <div className="flex flex-col justify-center">
 <div className="flex items-center gap-2.5 mb-2">
 <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-950  leading-none capitalize">
 {player.name}
 </h2>
 {player.position && (
 <span className="px-2 py-0.5 bg-zinc-100  text-zinc-600  text-[10px] font-bold rounded-md border border-zinc-200/60  shadow-sm">
 {player.position}
 </span>
 )}
 </div>
 
 
 <div className="grid grid-cols-2 gap-y-3 gap-x-6 sm:flex sm:flex-wrap sm:items-center sm:gap-3 md:gap-4 text-xs md:text-sm mt-3 sm:mt-0">
 <div className="flex flex-col">
 <span className="text-[10px] font-semibold text-zinc-500  mb-0.5">{"Age"}</span>
 <span className="font-bold text-zinc-900 ">{player.age || latestTest?.age || '-'} <span className="font-semibold text-zinc-500">yrs</span></span>
 </div>
 <div className="w-px h-6 bg-zinc-200  hidden sm:block"></div>
 <div className="flex flex-col">
 <span className="text-[10px] font-semibold text-zinc-500  mb-0.5">{"Height"}</span>
 <span className="font-bold text-zinc-900 ">{player.height || latestTest?.height || '-'} <span className="font-medium text-zinc-500">cm</span></span>
 </div>
 <div className="w-px h-6 bg-zinc-200  hidden sm:block"></div>
 <div className="flex flex-col">
 <span className="text-[10px] font-semibold text-zinc-500  mb-0.5">{"Latest Weight"}</span>
 <span className="font-bold text-zinc-900 ">{latestTest?.weight || player.weight || '-'} <span className="font-semibold text-zinc-500">kg</span></span>
 </div>
 <div className="w-px h-6 bg-zinc-200  hidden sm:block"></div>
 <div className="flex flex-col">
 <span className="text-[10px] font-semibold text-zinc-500  mb-0.5">{"Total Tests"}</span>
 <span className="font-bold text-zinc-900 ">{totalTests} <span className="font-semibold text-zinc-500">records</span></span>
 </div>
 </div>
 </div>
 </div>

 
 <div className="flex items-center gap-3 relative z-10 w-full md:w-auto shrink-0 border-t border-zinc-100  md:border-none pt-4 md:pt-0 mt-2 md:mt-0">
 <Link 
 href={route('admin.composition-tests.index')}
 className="inline-flex flex-1 md:flex-none items-center justify-center rounded-lg text-sm font-medium transition-colors border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 h-9 px-4      shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 "
 >
 <ChevronLeft size={16} className="mr-1.5" />
 {"Back"}
 </Link>
 {onExport && (
 <button
 onClick={onExport}
 disabled={isExporting}
 className="inline-flex flex-1 md:flex-none items-center justify-center rounded-lg text-sm font-medium transition-colors border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 h-9 px-4      shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2  disabled:opacity-50"
 title="Export to PDF"
 >
 {isExporting ? <Loader2 size={16} className="mr-1.5 animate-spin" /> : <Download size={16} className="mr-1.5" />}
 PDF
 </button>
 )}
 {onAddRecord && (
 <button
 onClick={onAddRecord}
 className="inline-flex flex-[2] md:flex-none items-center justify-center rounded-lg text-sm font-medium transition-all bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 h-9 px-4    shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 "
 >
 <Plus size={16} className="mr-1.5 sm:mr-1.5" />
 <span className="hidden sm:inline">{"Add Data"}</span>
 <span className="sm:hidden">{"Add"}</span>
 </button>
 )}
 </div>
 </div>
 );
}