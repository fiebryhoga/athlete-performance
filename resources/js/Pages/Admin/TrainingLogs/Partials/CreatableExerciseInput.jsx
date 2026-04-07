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
        <div ref={wrapperRef} className="relative w-full h-full flex items-center min-w-[140px] md:min-w-0">
            <input 
                type="text" 
                value={inputValue} 
                disabled={disabled} 
                placeholder="Gerakan..."
                onChange={(e) => { setInputValue(e.target.value); if (!isOpen) setIsOpen(true); }}
                onClick={() => !disabled && setIsOpen(true)} 
                
                className="w-full h-full border-none outline-none bg-transparent text-xs md:text-sm px-2 md:px-4 py-3 focus:ring-2 focus:ring-inset focus:ring-[#ff4d00] font-bold text-slate-700 placeholder-slate-400 touch-manipulation truncate"
            />
            {!disabled && <div className="absolute right-1 md:right-3 p-1 cursor-pointer bg-white" onClick={() => setIsOpen(!isOpen)}><ChevronDown className="w-4 h-4 text-slate-400" /></div>}
            
            {isOpen && !disabled && (
                
                <div className="absolute top-full left-0 w-full min-w-[200px] mt-1 bg-white border border-slate-200 shadow-xl rounded-xl max-h-48 overflow-y-auto z-[100] py-1 custom-scrollbar">
                    {filteredOptions.map((opt, idx) => (
                        <div 
                            key={idx} 
                            className="group flex items-center justify-between px-3 md:px-4 py-2.5 hover:bg-orange-50 cursor-pointer"
                            onClick={() => handleSelect(opt)}
                        >
                            <span className="text-xs md:text-sm text-slate-700 font-medium group-hover:text-[#ff4d00] truncate pr-2">{opt}</span>
                            
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
                    ))}
                    {isNew && (
                        <div onClick={() => { onNewOption(inputValue.trim()); handleSelect(inputValue.trim()); }} className="px-3 md:px-4 py-2.5 text-xs md:text-sm text-[#ff4d00] bg-orange-50/50 hover:bg-orange-100 cursor-pointer font-bold flex items-center gap-2">
                            <Plus className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Tambah "{inputValue}"</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}