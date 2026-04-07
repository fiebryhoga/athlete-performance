import { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown, Trash2 } from 'lucide-react';

export default function CreatableExerciseInput({ value, options, onChange, onNewOption, onDeleteOption, disabled }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value || '');
    const wrapperRef = useRef(null);

    const filteredOptions = options.filter(opt => opt.toLowerCase().includes(inputValue.toLowerCase()));
    const isNew = inputValue.trim() !== '' && !options.find(opt => opt.toLowerCase() === inputValue.toLowerCase());

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                setInputValue(value || '');
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [value]);

    useEffect(() => setInputValue(value || ''), [value]);

    const handleSelect = (opt) => {
        setInputValue(opt); onChange(opt); setIsOpen(false);
    };

    return (
        // PERBAIKAN: Menambahkan z-index tinggi dan overflow-visible agar dropdown tidak terpotong tabel
        <div ref={wrapperRef} className="relative w-full h-full flex items-center min-w-[140px] md:min-w-0 z-50 overflow-visible">
            <input 
                type="text" 
                value={inputValue} 
                disabled={disabled} 
                placeholder="Ketik/Pilih Gerakan..."
                onChange={(e) => { setInputValue(e.target.value); if (!isOpen) setIsOpen(true); }}
                onClick={(e) => { 
                    e.stopPropagation(); // Mencegah klik menyebar ke tabel
                    if(!disabled) setIsOpen(true); 
                }} 
                className="w-full h-full border-none outline-none bg-transparent text-xs md:text-sm px-2 md:px-4 py-3 focus:ring-2 focus:ring-inset focus:ring-[#ff4d00] font-bold text-slate-700 placeholder-slate-400 touch-manipulation truncate relative z-10"
            />
            
            {!disabled && (
                <div 
                    className="absolute right-1 md:right-3 p-1 cursor-pointer bg-white z-20" 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        setIsOpen(!isOpen); 
                    }}
                >
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
            )}
            
            {isOpen && !disabled && (
                // PERBAIKAN: z-[999] yang sangat tinggi agar dropdown selalu berada di lapisan paling depan
                <div className="absolute top-[100%] left-0 w-full min-w-[250px] mt-1 bg-white border border-slate-200 shadow-xl rounded-xl max-h-56 overflow-y-auto z-[999] py-1 custom-scrollbar">
                    {filteredOptions.length > 0 ? filteredOptions.map((opt, idx) => (
                        <div 
                            key={idx} 
                            className="group flex items-center justify-between px-3 md:px-4 py-2.5 hover:bg-orange-50 cursor-pointer border-b border-slate-50 last:border-b-0"
                            onClick={(e) => { e.stopPropagation(); handleSelect(opt); }}
                        >
                            <span className="text-xs md:text-sm text-slate-700 font-medium group-hover:text-[#ff4d00] truncate pr-2 w-full">{opt}</span>
                            
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    if(confirm(`Hapus "${opt}" dari daftar pilihan?`)) {
                                        onDeleteOption(opt);
                                    }
                                }}
                                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1.5 md:p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all shrink-0"
                            >
                                <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </button>
                        </div>
                    )) : (
                        !isNew && <div className="px-4 py-3 text-xs text-slate-400 italic text-center">Gerakan tidak ditemukan</div>
                    )}
                    
                    {isNew && (
                        <div 
                            onClick={(e) => { e.stopPropagation(); onNewOption(inputValue.trim()); handleSelect(inputValue.trim()); }} 
                            className="px-3 md:px-4 py-3 text-xs md:text-sm text-[#ff4d00] bg-orange-50/50 hover:bg-orange-100 cursor-pointer font-bold flex items-center gap-2 border-t border-slate-100"
                        >
                            <Plus className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Tambah Baru "{inputValue}"</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}