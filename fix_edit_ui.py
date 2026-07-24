import re
import os

def fix_create_session():
    filepath = 'resources/js/Pages/Admin/GroupTrainings/CreateSession.jsx'
    with open(filepath, 'r') as f:
        content = f.read()

    # The header in CreateSession is currently:
    old_header = '''                    <div className="p-5 bg-white border-b border-slate-200 sticky top-0 z-40">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <Dumbbell className="w-5 h-5 text-orange-500" />
                            Skema & Program Latihan
                        </h3>
                        
                        {/* Tabs for Programs */}
                        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
                            {data.programs.map((prog, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setActiveProgramIndex(idx)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeProgramIndex === idx ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    {prog.name}
                                </button>
                            ))}
                            
                            {isAddingProgram ? (
                                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-2 py-1">
                                    <input 
                                        type="text" 
                                        autoFocus
                                        placeholder="Nama Program"
                                        className="text-sm px-2 py-1 outline-none w-32"
                                        value={newProgramName}
                                        onChange={e => setNewProgramName(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (newProgramName.trim() && !data.programs.find(p => p.name === newProgramName.trim())) {
                                                    setData("programs", [...data.programs, { name: newProgramName.trim(), athlete_ids: null, blocks: [] }]);
                                                    setActiveProgramIndex(data.programs.length);
                                                    setNewProgramName("");
                                                    setIsAddingProgram(false);
                                                }
                                            }
                                        }}
                                    />
                                    <button type="button" onClick={() => setIsAddingProgram(false)} className="text-slate-400 hover:text-red-500 p-1"><X size={14}/></button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsAddingProgram(true)}
                                    className="px-3 py-2 rounded-xl text-sm font-bold bg-white border border-dashed border-slate-300 text-slate-500 hover:bg-slate-50 transition-all flex items-center gap-1 whitespace-nowrap"
                                >
                                    + Tambah Program
                                </button>
                            )}
                        </div>
                    </div>'''

    if old_header not in content:
        print("CreateSession header missing or already fixed?")
    else:
        print("CreateSession header is present!")

def fix_edit_session():
    filepath = 'resources/js/Pages/Admin/GroupTrainings/EditSession.jsx'
    with open(filepath, 'r') as f:
        content = f.read()

    # The header in EditSession is currently:
    old_header_edit = ''' <div className="bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
 <div className="p-4 bg-white border-b border-zinc-200 flex justify-between items-center sticky top-0 z-40">
 <h3 className="text-lg font-bold text-zinc-900">Skema & Program Latihan</h3>
 </div>

 <div className="p-6">'''

    tabs_ui = ''' <div className="bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
 <div className="p-4 bg-white border-b border-zinc-200 sticky top-0 z-40">
 <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
    <Dumbbell className="w-5 h-5 text-orange-500" />
    Skema & Program Latihan
 </h3>
 
 {/* Tabs for Programs */}
 <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
    {data.programs.map((prog, idx) => (
        <button
            key={idx}
            type="button"
            onClick={() => setActiveProgramIndex(idx)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeProgramIndex === idx ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
            {prog.name}
        </button>
    ))}
    
    {isAddingProgram ? (
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-2 py-1">
            <input 
                type="text" 
                autoFocus
                placeholder="Nama Program"
                className="text-sm px-2 py-1 outline-none w-32"
                value={newProgramName}
                onChange={e => setNewProgramName(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newProgramName.trim() && !data.programs.find(p => p.name === newProgramName.trim())) {
                            setData("programs", [...data.programs, { name: newProgramName.trim(), athlete_ids: null, blocks: [] }]);
                            setActiveProgramIndex(data.programs.length);
                            setNewProgramName("");
                            setIsAddingProgram(false);
                        }
                    }
                }}
            />
            <button type="button" onClick={() => setIsAddingProgram(false)} className="text-slate-400 hover:text-red-500 p-1">X</button>
        </div>
    ) : (
        <button
            type="button"
            onClick={() => setIsAddingProgram(true)}
            className="px-3 py-2 rounded-xl text-sm font-bold bg-white border border-dashed border-slate-300 text-slate-500 hover:bg-slate-50 transition-all flex items-center gap-1 whitespace-nowrap"
        >
            + Tambah Program
        </button>
    )}
 </div>
 </div>

 <div className="p-6">
    {/* Program Settings (Audience) */}
    <div className="mb-6 bg-white p-4 rounded-xl border border-zinc-200">
        <label className="block text-sm font-bold text-zinc-700 mb-3">Peserta {data.programs[activeProgramIndex].name}</label>
        <div className="flex flex-wrap gap-2">
            <label className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${data.programs[activeProgramIndex].athlete_ids === null ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`}>
                <input 
                    type="radio" 
                    className="hidden" 
                    checked={data.programs[activeProgramIndex].athlete_ids === null}
                    onChange={() => {
                        const newProgs = [...data.programs];
                        newProgs[activeProgramIndex].athlete_ids = null;
                        setData("programs", newProgs);
                    }}
                />
                <span className="text-xs font-bold">Semua Peserta Sesi</span>
            </label>
            
            <label className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${data.programs[activeProgramIndex].athlete_ids !== null ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`}>
                <input 
                    type="radio" 
                    className="hidden" 
                    checked={data.programs[activeProgramIndex].athlete_ids !== null}
                    onChange={() => {
                        const newProgs = [...data.programs];
                        newProgs[activeProgramIndex].athlete_ids = [];
                        setData("programs", newProgs);
                    }}
                />
                <span className="text-xs font-bold">Atlet Tertentu</span>
            </label>
        </div>
        
        {data.programs[activeProgramIndex].athlete_ids !== null && (
            <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-zinc-100">
                {data.attendee_ids.map(attId => {
                    const athlete = (typeof availableAthletes !== 'undefined' ? availableAthletes.find(a => a.id === attId) : null) || (typeof group !== 'undefined' ? group?.members?.find(m => m.id === attId) : null);
                    if (!athlete) return null;
                    const isSelected = data.programs[activeProgramIndex].athlete_ids?.includes(attId);
                    return (
                        <label key={attId} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${isSelected ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`}>
                            <input 
                                type="checkbox"
                                className="hidden"
                                checked={isSelected}
                                onChange={(e) => {
                                    const newProgs = [...data.programs];
                                    let newIds = newProgs[activeProgramIndex].athlete_ids ? [...newProgs[activeProgramIndex].athlete_ids] : [];
                                    if (e.target.checked) newIds.push(attId);
                                    else newIds = newIds.filter(id => id !== attId);
                                    newProgs[activeProgramIndex].athlete_ids = newIds;
                                    setData("programs", newProgs);
                                }}
                            />
                            <span className="text-xs font-bold">{athlete?.name || 'Atlet'}</span>
                        </label>
                    );
                })}
            </div>
        )}
    </div>
'''

    if old_header_edit in content:
        content = content.replace(old_header_edit, tabs_ui)
        with open(filepath, 'w') as f:
            f.write(content)
        print("EditSession patched!")
    else:
        print("EditSession header missing!")

fix_create_session()
fix_edit_session()
