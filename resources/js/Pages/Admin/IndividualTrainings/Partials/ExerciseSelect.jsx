import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Plus, Loader2, Check } from 'lucide-react';
import ExerciseQuickModal from './ExerciseQuickModal';
import axios from 'axios';

export default function ExerciseSelect({ value, options, onChange }) {
 const [search, setSearch] = useState('');
 const [isOpen, setIsOpen] = useState(false);
 const [loading, setLoading] = useState(false);
 const [localOptions, setLocalOptions] = useState(options);
 const dropdownRef = useRef(null);

 const filtered = useMemo(() => {
 return localOptions.filter(opt => 
 opt.name.toLowerCase().includes(search.toLowerCase())
 );
 }, [search, localOptions]);

 const isNotFound = search.length > 0 && filtered.length === 0;

    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleCreateNew = () => {
        setIsOpen(false);
        setIsModalOpen(true);
    };

    const handleSuccess = (newEx) => {
        setLocalOptions(prev => [...prev, newEx]);
        onChange(newEx.id);
        setSearch('');
    };

 const selectedEx = localOptions.find(o => o.id == value);

 useEffect(() => {
 const handleClickOutside = (event) => {
 if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
 setIsOpen(false);
 }
 };
 document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 return (
 <div className="relative w-full" ref={dropdownRef}>
 <button 
 type="button"
 onClick={() => setIsOpen(!isOpen)}
 className="w-full text-left px-3 py-2 text-xs font-bold bg-zinc-50 rounded border border-transparent hover:border-zinc-200 transition-all flex items-center justify-between"
 >
 <span className={value ? "text-zinc-900 truncate" : "text-zinc-400"}>
 {selectedEx ? selectedEx.name : "Pilih Latihan..."}
 </span>
 </button>

        {isOpen && (
            <div className="absolute z-[100] mt-1 w-full min-w-[280px] bg-white border border-zinc-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="p-2 border-b border-zinc-100 flex items-center gap-2">
                    <Search size={14} className="text-zinc-400 ml-1" />
                    <input 
                        autoFocus
                        className="w-full bg-transparent border-none focus:ring-0 text-xs p-1"
                        placeholder="Cari atau ketik baru..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className="max-h-[250px] overflow-y-auto p-1">
                    {filtered.map(opt => (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => { onChange(opt.id); setIsOpen(false); setSearch(''); }}
                            className="w-full text-left px-3 py-2.5 text-xs hover:bg-zinc-100 rounded-lg flex items-center justify-between group transition-colors"
                        >
                            <div className="flex flex-col">
                                <span className="font-bold group-hover:text-zinc-900">{opt.name}</span>
                            </div>
                            {value == opt.id && <Check size={14} className="text-zinc-900" />}
                        </button>
                    ))}

                    {isNotFound && (
                        <button
                            type="button"
                            onClick={handleCreateNew}
                            className="w-full text-left px-3 py-3 text-xs bg-zinc-900 text-white rounded-lg flex items-center gap-2 hover:opacity-90 mt-1"
                        >
                            <Plus size={14} />
                            <span className="font-bold">Tambah "{search}" ke Master</span>
                        </button>
                    )}
                </div>
            </div>
        )}

        <ExerciseQuickModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            initialName={search} 
            onSuccess={handleSuccess} 
        />
    </div>
  );
}
