import React from 'react';
import { X, ExternalLink } from 'lucide-react';

export default function ExerciseQuickModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-black italic tracking-tighter">Master Latihan</h3>
                        <p className="text-[10px] text-zinc-500 font-bold mt-1">Manajemen Media & Video</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"><X size={20}/></button>
                </div>
                
                <div className="p-10 text-center space-y-6">
                    <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                        <p className="text-sm text-zinc-600 font-medium">
                            Untuk mengunggah <b>Foto Referensi</b>, memasukkan <b>Link Video YouTube/Drive</b>, atau menghapus data master, silakan lakukan di halaman utama Master Latihan.
                        </p>
                    </div>
                    
                    <a 
                        href="/admin/exercises" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-xl text-xs font-black shadow-md hover:bg-zinc-800 transition-colors"
                    >
                        Buka Master Latihan <ExternalLink size={14}/>
                    </a>
                </div>
            </div>
        </div>
    );
}
