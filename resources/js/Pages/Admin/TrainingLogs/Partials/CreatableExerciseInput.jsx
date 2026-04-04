import { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown, Trash2 } from 'lucide-react'; // Tambahkan Trash2
import axios from 'axios';

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
        <div ref={wrapperRef} className="relative w-full h-full flex items-center">
            <input 
                type="text" 
                value={inputValue} 
                disabled={disabled} 
                placeholder="Pilih / ketik gerakan..."
                onChange={(e) => { setInputValue(e.target.value); if (!isOpen) setIsOpen(true); }}
                onClick={() => !disabled && setIsOpen(true)} 
                className="w-full h-full border-none outline-none bg-transparent text-sm px-4 py-3 focus:ring-2 focus:ring-inset focus:ring-[#00488b] font-bold text-slate-700 placeholder-slate-400"
            />
            {!disabled && <div className="absolute right-3 cursor-pointer bg-white" onClick={() => setIsOpen(!isOpen)}><ChevronDown className="w-4 h-4 text-slate-400" /></div>}
            
            {isOpen && !disabled && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 shadow-xl rounded-xl max-h-60 overflow-y-auto z-50 py-1">
                    {filteredOptions.map((opt, idx) => (
                        <div 
                            key={idx} 
                            className="group flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 cursor-pointer"
                            onClick={() => handleSelect(opt)}
                        >
                            <span className="text-sm text-slate-700 font-medium group-hover:text-[#00488b]">{opt}</span>
                            
                            {/* Ikon Hapus Gerakan dari Library */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation(); // Agar tidak memicu handleSelect
                                    if(confirm(`Hapus "${opt}" dari daftar pilihan?`)) {
                                        onDeleteOption(opt);
                                    }
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                    {isNew && (
                        <div onClick={() => { onNewOption(inputValue.trim()); handleSelect(inputValue.trim()); }} className="px-4 py-2.5 text-sm text-[#00488b] bg-blue-50/50 hover:bg-blue-100 cursor-pointer font-bold flex items-center gap-2">
                            <Plus className="w-3.5 h-3.5" /> Tambah "{inputValue}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}