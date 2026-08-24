import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, Plus, Loader2, Check } from 'lucide-react';
import ExerciseQuickModal from './ExerciseQuickModal';
import axios from 'axios';

export default function ExerciseSelect({ value, options, onChange }) {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [localOptions, setLocalOptions] = useState(options);
    const dropdownRef = useRef(null);
    const menuRef = useRef(null);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, openUp: false });

    useEffect(() => {
        setLocalOptions(options);
    }, [options]);

    const filtered = useMemo(() => {
        return (localOptions || []).filter(opt => 
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

    const selectedEx = (localOptions || []).find(o => o.id == value);

    const updateCoords = () => {
        if (dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            const openUp = spaceBelow < 260 && spaceAbove > spaceBelow;
            setCoords({
                top: openUp ? rect.top - 6 : rect.bottom + 6,
                left: rect.left,
                width: Math.max(rect.width, 280),
                openUp,
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            updateCoords();
            window.addEventListener('scroll', updateCoords, true);
            window.addEventListener('resize', updateCoords);
            return () => {
                window.removeEventListener('scroll', updateCoords, true);
                window.removeEventListener('resize', updateCoords);
            };
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                (!menuRef.current || !menuRef.current.contains(event.target))
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const dropdownPortal = isOpen ? createPortal(
        <div 
            ref={menuRef}
            style={{
                position: 'fixed',
                top: coords.openUp ? 'auto' : `${coords.top}px`,
                bottom: coords.openUp ? `${window.innerHeight - coords.top}px` : 'auto',
                left: `${coords.left}px`,
                width: `${coords.width}px`,
                zIndex: 99999,
            }}
            className="bg-white border border-slate-200 rounded-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
            <div className="p-1.5 border-b border-slate-100 flex items-center gap-1.5 bg-slate-50/80">
                <Search size={13} className="text-slate-400 ml-1 shrink-0" />
                <input 
                    autoFocus
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-xs p-1 text-slate-800 placeholder:text-slate-400 font-medium"
                    placeholder="Cari latihan..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            
            <div className="max-h-60 overflow-y-auto p-1 space-y-0.5 custom-scrollbar">
                {filtered.map(opt => (
                    <button
                        key={opt.id}
                        type="button"
                        onClick={() => { onChange(opt.id); setIsOpen(false); setSearch(''); }}
                        className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-orange-50 hover:text-orange-700 rounded flex items-center justify-between group transition-colors cursor-pointer"
                    >
                        <div className="flex flex-col truncate pr-2">
                            <span className="font-semibold text-slate-800 group-hover:text-orange-700 truncate">{opt.name}</span>
                        </div>
                        {value == opt.id && <Check size={13} className="text-orange-600 shrink-0 font-bold" />}
                    </button>
                ))}

                {isNotFound && (
                    <button
                        type="button"
                        onClick={handleCreateNew}
                        className="w-full text-left px-2.5 py-2 text-xs bg-orange-500 text-white rounded flex items-center justify-center gap-1.5 hover:bg-orange-600 mt-1 shadow-2xs transition-all font-semibold cursor-pointer"
                    >
                        <Plus size={13} className="shrink-0" />
                        <span className="truncate">Tambah "{search}" ke Master</span>
                    </button>
                )}
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button 
                type="button"
                onClick={() => {
                    if (!isOpen) updateCoords();
                    setIsOpen(!isOpen);
                }}
                className="w-full text-left px-2.5 py-1.5 text-xs font-semibold bg-white rounded-md border border-slate-200 hover:border-orange-400 shadow-2xs transition-all flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 cursor-pointer"
            >
                <span className={value ? "text-slate-800 truncate" : "text-slate-400 font-normal"}>
                    {selectedEx ? selectedEx.name : "Pilih Latihan..."}
                </span>
            </button>

            {dropdownPortal}

            <ExerciseQuickModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                initialName={search} 
                onSuccess={handleSuccess} 
            />
        </div>
    );
}
