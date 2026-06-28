import React from 'react';
import { GripVertical, Trash2, AlignLeft, Copy } from 'lucide-react';

export default function TextBlock({ block, onChange, onRemove, onDuplicate, dragHandleProps }) {
    const getAccentBorder = (category) => {
        switch(category) {
            case 'nb': return 'border-l-[4px] border-l-red-500';
            case 'instruction': return 'border-l-[4px] border-l-blue-500';
            case 'description': return 'border-l-[4px] border-l-emerald-500';
            default: return 'border-l-[4px] border-l-zinc-400';
        }
    };

    const getIconColor = (category) => {
        switch(category) {
            case 'nb': return 'text-red-500';
            case 'instruction': return 'text-blue-500';
            case 'description': return 'text-emerald-500';
            default: return 'text-zinc-400';
        }
    };

    return (
        <div className={`bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden group/block ${getAccentBorder(block.category)} transition-all duration-300`}>
            
            <div className="bg-zinc-50/80 p-3 px-4 border-b border-zinc-200 flex items-center justify-between gap-4">
                
                <div className="flex items-center gap-3 flex-1">
                    <div 
                        {...dragHandleProps} 
                        className="cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600 transition-colors p-1"
                        title="Tahan dan geser untuk memindahkan"
                    >
                        <GripVertical size={18} />
                    </div>
                    
                    <AlignLeft size={16} className={getIconColor(block.category)} />

                    <div className="relative">
                        <select 
                            className="appearance-none bg-white border border-zinc-200 text-zinc-700 rounded-md text-[10px] font-bold py-1.5 pl-3 pr-8 shadow-sm cursor-pointer hover:border-zinc-300 outline-none focus:ring-1 focus:ring-zinc-900 transition-all"
                            value={block.category || 'note'} 
                            onChange={e => onChange('category', e.target.value)}
                        >
                            <option value="instruction">Instruksi</option>
                            <option value="description">Deskripsi</option>
                            <option value="nb">N.B (Penting)</option>
                            <option value="note">Catatan Umum</option>
                        </select>
                        
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                        </div>
                    </div>

                    <div className="w-px h-5 bg-zinc-300 hidden sm:block"></div>

                    <input 
                        type="text" 
                        placeholder="Judul blok teks (Opsional)..." 
                        className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold w-full text-zinc-900 placeholder:text-zinc-400 placeholder:font-medium"
                        value={block.title || ''}
                        onChange={e => onChange('title', e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-1">
                    <button 
                        type="button" 
                        onClick={onDuplicate} 
                        className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                        title="Duplikat Blok"
                    >
                        <Copy size={16} />
                    </button>
                    <button 
                        type="button" 
                        onClick={onRemove} 
                        className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                        title="Hapus Blok"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="p-5 bg-white">
                <textarea 
                    className={`w-full bg-transparent border-none p-0 focus:ring-0 text-sm min-h-[80px] resize-y placeholder:text-zinc-300 leading-relaxed transition-colors ${
                        block.category === 'nb' 
                        ? 'text-red-700 font-bold placeholder:text-red-300' 
                        : 'text-zinc-700 font-medium'
                    }`}
                    placeholder={
                        block.category === 'nb' 
                        ? 'Tulis informasi atau peringatan krusial di sini...' 
                        : 'Ketik pesan atau instruksi detail di sini...'
                    }
                    value={block.items?.[0]?.note || ''}
                    onChange={e => {
                        const newItems = block.items?.length ? [...block.items] : [{ note: '' }];
                        newItems[0].note = e.target.value;
                        onChange('items', newItems);
                    }}
                />
            </div>
        </div>
    );
}
