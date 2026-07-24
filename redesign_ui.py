import re

def fix_ui(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # We need to add the `hasSecondaryProgram` state.
    # Find `const [activeProgramIndex, setActiveProgramIndex] = useState(0);`
    state_injection = '''    const [activeProgramIndex, setActiveProgramIndex] = useState(0);
    const [hasSecondaryProgram, setHasSecondaryProgram] = useState(
        data.programs && data.programs.length > 1
    );'''
    
    # We remove `newProgramName` and `isAddingProgram` states
    content = re.sub(
        r'const \[activeProgramIndex, setActiveProgramIndex\] = useState\(0\);\s*const \[newProgramName, setNewProgramName\] = useState\(""\);\s*const \[isAddingProgram, setIsAddingProgram\] = useState\(false\);',
        state_injection,
        content
    )

    # We need to add `transform` to useForm if it's not there.
    # We can just intercept `post` / `put` in `submit` function.
    if 'CreateSession.jsx' in filepath:
        old_submit = '''    const submitSession = (e) => {
        e.preventDefault();
        post(route("admin.group-trainings.session.store", group.id));
    };'''
        new_submit = '''    const submitSession = (e) => {
        e.preventDefault();
        
        // Fix up athlete_ids before sending
        const submitData = { ...data };
        if (!hasSecondaryProgram) {
            submitData.programs = [{ ...submitData.programs[0], athlete_ids: null }];
        }
        
        post(route("admin.group-trainings.session.store", group.id), {
            data: submitData
        });
    };'''
        content = content.replace(old_submit, new_submit)
        
        # Add transform hook to useForm
        content = content.replace('const { data, setData, post, processing, errors } = useForm', 'const { data, setData, post, processing, errors, transform } = useForm')
        
        transform_hook = '''
    transform((data) => ({
        ...data,
        programs: hasSecondaryProgram ? data.programs : [{ ...data.programs[0], athlete_ids: null }]
    }));
'''
        if 'transform((data)' not in content:
            content = content.replace('const [isExModalOpen, setIsExModalOpen] = useState(false);', transform_hook + '\n    const [isExModalOpen, setIsExModalOpen] = useState(false);')

    elif 'EditSession.jsx' in filepath:
        old_submit = '''    const submit = (e) => {
        e.preventDefault();
        put(route("admin.group-trainings.session.update", training.id));
    };'''
        new_submit = '''    const submit = (e) => {
        e.preventDefault();
        put(route("admin.group-trainings.session.update", training.id));
    };'''
        # Add transform hook to useForm
        content = content.replace('const { data, setData, put, processing, errors } = useForm', 'const { data, setData, put, processing, errors, transform } = useForm')
        
        transform_hook = '''
    transform((data) => ({
        ...data,
        programs: hasSecondaryProgram ? data.programs : [{ ...data.programs[0], athlete_ids: null }]
    }));
'''
        if 'transform((data)' not in content:
            content = content.replace('const [isExModalOpen, setIsExModalOpen] = useState(false);', transform_hook + '\n    const [isExModalOpen, setIsExModalOpen] = useState(false);')

    # Now, let's replace the header and Tabs UI.
    # In CreateSession it uses 'bg-slate-50', in EditSession it uses 'bg-zinc-50'
    
    # We will use regex to find the block from the `Editor` start to the end of `Tabs for Programs`
    # The structure:
    # <div className="bg-slate-50 ... (or zinc-50)
    #   <div className="p-5 bg-white ... (or p-4)
    #       <h3>...
    #       <div tabs ...
    
    editor_start = content.find('{/* Editor */}')
    p6_start = content.find('<div className="p-6', editor_start)
    
    if editor_start != -1 and p6_start != -1:
        # Extract the old header
        old_header_section = content[editor_start:p6_start]
        
        is_create = 'CreateSession.jsx' in filepath
        color = 'slate' if is_create else 'zinc'
        p_class = 'p-5' if is_create else 'p-4'
        
        new_header_section = f'''{{/* Editor */}}
                <div className="bg-{color}-50 border border-{color}-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="{p_class} bg-white border-b border-{color}-200 sticky top-0 z-40">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                            <h3 className="text-lg font-bold text-{color}-800 flex items-center gap-2">
                                <Dumbbell className="w-5 h-5 text-orange-500" />
                                Skema & Program Latihan
                            </h3>
                            <label className="flex items-center gap-2 text-sm font-bold text-{color}-600 cursor-pointer bg-{color}-50 px-3 py-1.5 rounded-lg border border-{color}-200 hover:bg-{color}-100 transition-all">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-{color}-300 text-orange-500 focus:ring-orange-500"
                                    checked={{hasSecondaryProgram}}
                                    onChange={{(e) => {{
                                        const isChecked = e.target.checked;
                                        setHasSecondaryProgram(isChecked);
                                        
                                        const newProgs = [...data.programs];
                                        if (isChecked) {{
                                            if (newProgs.length < 2) {{
                                                newProgs.push({{ name: "Program Sekunder", athlete_ids: [], blocks: [] }});
                                            }}
                                            newProgs[0].athlete_ids = [...data.attendee_ids];
                                            if (newProgs[1] && newProgs[1].athlete_ids) {{
                                                newProgs[0].athlete_ids = data.attendee_ids.filter(id => !newProgs[1].athlete_ids.includes(id));
                                            }}
                                        }} else {{
                                            setActiveProgramIndex(0);
                                            newProgs[0].athlete_ids = null;
                                        }}
                                        setData("programs", newProgs);
                                    }}}}
                                />
                                Buat 2 Program Berbeda?
                            </label>
                        </div>
                        
                        {{hasSecondaryProgram && (
                            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
                                <button
                                    type="button"
                                    onClick={{() => setActiveProgramIndex(0)}}
                                    className={{`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${{activeProgramIndex === 0 ? 'bg-orange-500 text-white shadow-md' : 'bg-{color}-100 text-{color}-500 hover:bg-{color}-200'}}`}}
                                >
                                    {{data.programs[0].name}}
                                </button>
                                <button
                                    type="button"
                                    onClick={{() => setActiveProgramIndex(1)}}
                                    className={{`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${{activeProgramIndex === 1 ? 'bg-orange-500 text-white shadow-md' : 'bg-{color}-100 text-{color}-500 hover:bg-{color}-200'}}`}}
                                >
                                    {{data.programs[1]?.name || 'Program Sekunder'}}
                                </button>
                            </div>
                        )}}
                    </div>

                    '''
        
        content = content.replace(old_header_section, new_header_section)

    # Now replace the Audience UI
    # It is right after `<div className="p-6 md:p-8">` (or p-6)
    audience_start = content.find('{/* Program Settings (Audience) */}')
    drag_drop_start = content.find('<DragDropContext', audience_start)
    
    if audience_start != -1 and drag_drop_start != -1:
        old_audience = content[audience_start:drag_drop_start]
        
        new_audience = '''{/* Program Settings (Audience) */}
                        {hasSecondaryProgram && activeProgramIndex === 1 && (
                            <div className="mb-6 bg-white p-4 rounded-xl border border-zinc-200">
                                <label className="block text-sm font-bold text-zinc-700 mb-1">Pilih Atlet untuk Program Sekunder</label>
                                <p className="text-xs text-zinc-500 mb-3">Atlet yang dipilih akan menjalankan program ini dan TIDAK menjalankan Program Utama.</p>
                                <div className="flex flex-wrap gap-2 pt-3 border-t border-zinc-100">
                                    {data.attendee_ids.map(attId => {
                                        const athlete = (typeof availableAthletes !== 'undefined' ? availableAthletes.find(a => a.id === attId) : null) || (typeof group !== 'undefined' ? group?.members?.find(m => m.id === attId) : null);
                                        if (!athlete) return null;
                                        const isSelected = data.programs[1]?.athlete_ids?.includes(attId);
                                        return (
                                            <label key={attId} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${isSelected ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`}>
                                                <input 
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={isSelected}
                                                    onChange={(e) => {
                                                        const newProgs = [...data.programs];
                                                        if (!newProgs[1]) newProgs[1] = { name: "Program Sekunder", athlete_ids: [], blocks: [] };
                                                        let newIds = newProgs[1].athlete_ids ? [...newProgs[1].athlete_ids] : [];
                                                        if (e.target.checked) newIds.push(attId);
                                                        else newIds = newIds.filter(id => id !== attId);
                                                        newProgs[1].athlete_ids = newIds;
                                                        
                                                        // Automatically update Program Utama's athlete_ids
                                                        const allIds = data.attendee_ids;
                                                        newProgs[0].athlete_ids = allIds.filter(id => !newIds.includes(id));
                                                        
                                                        setData("programs", newProgs);
                                                    }}
                                                />
                                                <span className="text-xs font-bold">{athlete?.name || 'Atlet'}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        
                        {hasSecondaryProgram && activeProgramIndex === 0 && (
                            <div className="mb-6 bg-orange-50 p-4 rounded-xl border border-orange-200">
                                <p className="text-sm font-bold text-orange-800">Informasi Program Utama</p>
                                <p className="text-xs text-orange-600 mt-1">Program ini akan diterapkan ke semua atlet dalam sesi ini, <strong>KECUALI</strong> atlet yang sudah Anda centang di tab <strong>Program Sekunder</strong>.</p>
                            </div>
                        )}

                        '''
        content = content.replace(old_audience, new_audience)

    with open(filepath, 'w') as f:
        f.write(content)


fix_ui('resources/js/Pages/Admin/GroupTrainings/CreateSession.jsx')
fix_ui('resources/js/Pages/Admin/GroupTrainings/EditSession.jsx')
print("UI fixed perfectly.")
