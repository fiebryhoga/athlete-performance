const fs = require('fs');
const path = require('path');

function updateFile(filePath) {
    const fullPath = path.join(__dirname, filePath);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Add state for dropdown if it doesn't exist
    if (!content.includes('const [isGuestDropdownOpen, setIsGuestDropdownOpen]')) {
        content = content.replace('const [isExModalOpen, setIsExModalOpen] = useState(false);', 'const [isExModalOpen, setIsExModalOpen] = useState(false);\n    const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);\n    const [guestSearch, setGuestSearch] = useState("");');
    }

    // Extract the section to replace
    const startTag = '<label className="block text-[11px] font-bold text-zinc-500 mb-3">\n                                Peserta Sesi (Checklist)';
    const endTag = '<label className="block text-[11px] font-bold text-zinc-500 mb-3">\n                                Coach Pendamping';
    
    const startIndex = content.indexOf(startTag);
    const endIndex = content.indexOf(endTag);

    if (startIndex !== -1 && endIndex !== -1) {
        // Find the <div className="md:col-span-2 lg:col-span-3"> before startTag
        const sectionStart = content.lastIndexOf('<div className="md:col-span-2 lg:col-span-3">', startIndex);
        
        const newUI = `
                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-[11px] font-bold text-zinc-500 mb-3">
                                Peserta Sesi (Checklist) <span className="text-rose-500">*</span>
                            </label>
                            
                            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
                                {/* Regular Members */}
                                <div className="mb-4">
                                    <h4 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-wider">Anggota Grup ({group?.name})</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {group?.members?.map(member => (
                                            <label
                                                key={member.id}
                                                className={\`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all \${data.attendee_ids.includes(member.id) ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm" : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:border-zinc-300 opacity-60"}\`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={data.attendee_ids.includes(member.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setData("attendee_ids", [...data.attendee_ids, member.id]);
                                                        } else {
                                                            setData("attendee_ids", data.attendee_ids.filter(id => id !== member.id));
                                                        }
                                                    }}
                                                />
                                                <span className="text-xs font-bold leading-tight">{member.name}</span>
                                            </label>
                                        ))}
                                        {(!group?.members || group.members.length === 0) && (
                                            <span className="text-xs text-zinc-500 italic">Tidak ada anggota di grup ini.</span>
                                        )}
                                    </div>
                                </div>

                                {/* Guests */}
                                <div>
                                    <h4 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                                        Atlet Tambahan (Guest)
                                    </h4>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {data.attendee_ids.filter(id => !group?.members?.find(m => m.id === id)).map(guestId => {
                                            const athlete = availableAthletes.find(a => a.id === guestId);
                                            if (!athlete) return null;
                                            return (
                                                <label
                                                    key={guestId}
                                                    className="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all bg-orange-50 border-orange-500 text-orange-700 shadow-sm"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={true}
                                                        onChange={() => {
                                                            setData("attendee_ids", data.attendee_ids.filter(id => id !== guestId));
                                                        }}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold leading-tight">{athlete.name}</span>
                                                        <span className="text-[9px] text-orange-600 font-bold uppercase tracking-wider">Guest</span>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>

                                    {/* Custom Dropdown for adding Guests */}
                                    <div className="relative">
                                        <button 
                                            type="button"
                                            onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                                            className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors flex items-center gap-2"
                                        >
                                            + Tambahkan Atlet Lain
                                        </button>

                                        {isGuestDropdownOpen && (
                                            <>
                                                <div 
                                                    className="fixed inset-0 z-10" 
                                                    onClick={() => setIsGuestDropdownOpen(false)}
                                                ></div>
                                                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-zinc-200 rounded-xl shadow-xl z-20 overflow-hidden flex flex-col">
                                                    <div className="p-2 border-b border-zinc-100">
                                                        <input 
                                                            type="text" 
                                                            autoFocus
                                                            placeholder="Cari atlet..." 
                                                            className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                                                            value={guestSearch}
                                                            onChange={(e) => setGuestSearch(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="max-h-48 overflow-y-auto p-1 custom-scrollbar">
                                                        {availableAthletes
                                                            .filter(a => !group?.members?.find(m => m.id === a.id))
                                                            .filter(a => a.name.toLowerCase().includes(guestSearch.toLowerCase()))
                                                            .map(athlete => {
                                                                const isSelected = data.attendee_ids.includes(athlete.id);
                                                                return (
                                                                    <button
                                                                        key={athlete.id}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            if (isSelected) {
                                                                                setData("attendee_ids", data.attendee_ids.filter(id => id !== athlete.id));
                                                                            } else {
                                                                                setData("attendee_ids", [...data.attendee_ids, athlete.id]);
                                                                            }
                                                                        }}
                                                                        className={\`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between \${isSelected ? 'bg-orange-50 text-orange-700' : 'hover:bg-zinc-100 text-zinc-700'}\`}
                                                                    >
                                                                        {athlete.name}
                                                                        {isSelected && (
                                                                            <span className="text-[10px] font-bold text-orange-500 bg-orange-100 px-1.5 py-0.5 rounded">✓</span>
                                                                        )}
                                                                    </button>
                                                                );
                                                            })
                                                        }
                                                        {availableAthletes.filter(a => !group?.members?.find(m => m.id === a.id) && a.name.toLowerCase().includes(guestSearch.toLowerCase())).length === 0 && (
                                                            <div className="text-center p-3 text-xs text-zinc-400">Tidak ada atlet ditemukan</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {errors.attendee_ids && (
                                <div className="text-rose-500 text-xs mt-1 font-bold">
                                    {errors.attendee_ids}
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2 lg:col-span-3">
                            `;
        
        content = content.substring(0, sectionStart) + newUI + content.substring(endIndex);
        fs.writeFileSync(fullPath, content);
    }
}

updateFile('resources/js/Pages/Admin/GroupTrainings/CreateSession.jsx');
updateFile('resources/js/Pages/Admin/GroupTrainings/EditSession.jsx');
console.log("Updated UI");
