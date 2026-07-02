

import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, Plus, User, Download, Loader2 } from 'lucide-react';

export default function ProfileHeader({ player, latestTest, totalTests, onAddRecord, onExport, isExporting }) {
 return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden transition-colors">
        
        <div className="flex items-start md:items-center gap-5 relative z-10 w-full md:w-auto">
            <div className="shrink-0">
                {player.photo_url ? (
                    <img 
                        src={player.photo_url} 
                        alt={player.name} 
                        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border border-slate-200 shadow-sm bg-slate-50"
                    />
                ) : (
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border border-slate-200 shadow-sm bg-slate-50 flex items-center justify-center">
                        <User size={32} strokeWidth={1.5} className="text-slate-400" />
                    </div>
                )}
            </div>
            
            <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2.5 mb-2">
                    <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 leading-none capitalize">
                        {player.name}
                    </h2>
                    {player.position && (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md border border-slate-200/60 shadow-sm">
                            {player.position}
                        </span>
                    )}
                </div>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 sm:flex sm:flex-wrap sm:items-center sm:gap-3 md:gap-4 text-xs md:text-sm mt-3 sm:mt-0">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 mb-0.5">{"Age"}</span>
                        <span className="font-extrabold text-slate-800">{player.age || latestTest?.age || '-'} <span className="font-semibold text-slate-500">yrs</span></span>
                    </div>
                    <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 mb-0.5">{"Height"}</span>
                        <span className="font-extrabold text-slate-800">{player.height || latestTest?.height || '-'} <span className="font-medium text-slate-500">cm</span></span>
                    </div>
                    <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 mb-0.5">{"Latest Weight"}</span>
                        <span className="font-extrabold text-slate-800">{latestTest?.weight || player.weight || '-'} <span className="font-semibold text-slate-500">kg</span></span>
                    </div>
                    <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 mb-0.5">{"Total Tests"}</span>
                        <span className="font-extrabold text-slate-800">{totalTests} <span className="font-semibold text-slate-500">records</span></span>
                    </div>
                </div>
            </div>
        </div>

 
        <div className="flex items-center gap-3 relative z-10 w-full md:w-auto shrink-0 border-t border-slate-100 md:border-none pt-4 md:pt-0 mt-2 md:mt-0">
            <Link 
                href={route('admin.composition-tests.index')}
                className="inline-flex flex-1 md:flex-none items-center justify-center rounded-xl text-sm font-bold transition-colors border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 h-10 px-5 shadow-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2"
            >
                <ChevronLeft size={16} className="mr-1.5" />
                {"Back"}
            </Link>
            {onExport && (
                <button
                    onClick={onExport}
                    disabled={isExporting}
                    className="inline-flex flex-1 md:flex-none items-center justify-center rounded-xl text-sm font-bold transition-colors border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 h-10 px-5 shadow-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 disabled:opacity-50"
                    title="Export to PDF"
                >
                    {isExporting ? <Loader2 size={16} className="mr-1.5 animate-spin" /> : <Download size={16} className="mr-1.5" />}
                    PDF
                </button>
            )}
            {onAddRecord && (
                <button
                    onClick={onAddRecord}
                    className="inline-flex flex-[2] md:flex-none items-center justify-center rounded-xl text-sm font-bold transition-all bg-[#ff4d00] text-white hover:bg-[#e64500] shadow-lg shadow-[#ff4d00]/20 h-10 px-6 focus:outline-none focus:ring-2 focus:ring-[#ff4d00] focus:ring-offset-2"
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