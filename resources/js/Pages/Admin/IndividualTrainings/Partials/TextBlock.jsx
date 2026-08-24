import React from 'react';
import { GripVertical, Trash2, Copy, AlertCircle, FileText, CheckSquare, MessageSquare } from 'lucide-react';

export default function TextBlock({ block, onChange, onRemove, onDuplicate, dragHandleProps }) {
    const getCategoryConfig = (category) => {
        switch (category) {
            case 'nb':
                return {
                    label: 'N.B (Penting)',
                    icon: AlertCircle,
                    badgeStyle: 'bg-orange-50 text-orange-600 border-orange-200/60',
                    containerStyle: 'border-orange-200/80 bg-white',
                    textareaStyle: 'text-slate-900 font-medium placeholder:text-slate-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-400',
                };
            case 'instruction':
                return {
                    label: 'Instruksi Latihan',
                    icon: CheckSquare,
                    badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
                    containerStyle: 'border-slate-200 bg-white',
                    textareaStyle: 'text-slate-700 font-medium placeholder:text-slate-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-400',
                };
            case 'description':
                return {
                    label: 'Deskripsi Sesi',
                    icon: FileText,
                    badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
                    containerStyle: 'border-slate-200 bg-white',
                    textareaStyle: 'text-slate-700 font-medium placeholder:text-slate-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-400',
                };
            default:
                return {
                    label: 'Catatan Umum',
                    icon: MessageSquare,
                    badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
                    containerStyle: 'border-slate-200 bg-white',
                    textareaStyle: 'text-slate-700 font-medium placeholder:text-slate-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-400',
                };
        }
    };

    const config = getCategoryConfig(block.category);
    const IconComponent = config.icon;

    return (
        <div className={`rounded-md border ${config.containerStyle} shadow-2xs mb-4 overflow-hidden group/block`}>
            {/* Header Bar */}
            <div className="bg-slate-50/80 p-2.5 px-3 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
                    <div 
                        {...dragHandleProps} 
                        className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 transition-colors p-1 rounded hover:bg-slate-200/50 -ml-1 shrink-0"
                        title="Tahan dan geser untuk memindahkan"
                    >
                        <GripVertical size={16} />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 shadow-2xs ${config.badgeStyle}`}>
                            <IconComponent size={13} />
                        </div>

                        <select 
                            className="bg-white border border-slate-200 text-slate-800 rounded-md text-xs font-bold py-1 pl-2.5 pr-7 shadow-2xs cursor-pointer hover:border-orange-400 outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 transition-all leading-normal"
                            value={block.category || 'note'} 
                            onChange={e => onChange('category', e.target.value)}
                        >
                            <option value="instruction">Instruksi Latihan</option>
                            <option value="description">Deskripsi Sesi</option>
                            <option value="nb">N.B (Penting)</option>
                            <option value="note">Catatan Umum</option>
                        </select>
                    </div>

                    <div className="w-px h-4 bg-slate-200 hidden sm:block mx-1"></div>

                    <input 
                        type="text" 
                        placeholder="Judul blok teks (opsional)..." 
                        className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs font-semibold text-slate-800 placeholder:text-slate-400 w-full hover:bg-white/50 focus:bg-white rounded px-2 py-0.5 transition-all"
                        value={block.title || ''}
                        onChange={e => onChange('title', e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-1 self-end sm:self-auto shrink-0 border-l border-slate-200 pl-2">
                    <button 
                        type="button" 
                        onClick={onDuplicate} 
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        title="Duplikat Blok"
                    >
                        <Copy size={13} />
                    </button>
                    <button 
                        type="button" 
                        onClick={onRemove} 
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        title="Hapus Blok"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-3 bg-white">
                <textarea 
                    className={`w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-md p-2.5 text-xs leading-relaxed min-h-[80px] resize-y transition-all outline-none ${config.textareaStyle}`}
                    placeholder={
                        block.category === 'nb' 
                            ? 'Tulis catatan penting atau instruksi krusial yang harus diperhatikan atlet di sini...' 
                            : 'Ketik penjelasan detail, arahan sesi, atau catatan umum di sini...'
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
