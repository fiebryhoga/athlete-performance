import re
import os

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find where to inject
    # It's at the end of the `Informasi Dasar` block, which ends with `</div>\n                    </div>\n                </div>\n`
    # Let's search for "Coach Pendamping" block to safely inject it after it.
    
    # In both CreateSession and EditSession, it is:
    # 
    #                            </div>
    #                        </div>
    #                    </div>
    #                </div>
    
    # We will search for:
    # `Belum ada coach yang ditugaskan untuk\n                                        atlet ini.\n                                    </div>\n                                )}\n                            </div>\n                        </div>`
    # Or more simply:
    search_target = '''                                ) : (
                                    <div className="text-sm text-slate-500 italic py-2">
                                        Belum ada coach yang ditugaskan untuk
                                        atlet ini.
                                    </div>
                                )}
                            </div>
                        </div>'''
    
    if search_target not in content:
        # In EditSession, it might be zinc-500
        search_target_zinc = '''                                ) : (
                                    <div className="text-sm text-zinc-500 italic py-2">
                                        Belum ada coach yang ditugaskan untuk grup ini.
                                    </div>
                                )}
                            </div>
                        </div>'''
        
        # Actually let's just use regex to find the end of the Coach Pendamping block
        pass
    
    # Let's do it safely by matching the label "Coach Pendamping" and finding the end of its div.
    match = re.search(r'(<label[^>]*>.*?Coach Pendamping.*?</label>\s*<div[^>]*>.*?)(</div>\s*</div>)', content, re.DOTALL)
    if not match:
        print(f"Could not find Coach Pendamping block in {filepath}")
        return
    
    # Actually, we can just replace the closing of the Coach Pendamping div with our new UI block
    is_create = 'CreateSession' in filepath
    color = 'slate' if is_create else 'zinc'
    border_active = 'indigo'
    
    injection = f'''
                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-[11px] font-bold text-{color}-500 mb-3 uppercase tracking-widest">
                                Peserta Sesi (Checklist Kehadiran)
                            </label>
                            <p className="text-xs text-{color}-500 mb-3 -mt-1">
                                Hapus centang pada atlet yang <strong>tidak hadir / absen</strong> pada sesi ini agar mereka tidak dimasukkan ke dalam catatan sesi.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {{group?.members && group.members.length > 0 ? (
                                    group.members.map((member) => (
                                        <label
                                            key={{member.id}}
                                            className={{`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${{data.attendee_ids.includes(member.id) ? "bg-{border_active}-50 border-{border_active}-500 text-{border_active}-700 shadow-sm" : "bg-white border-{color}-200 text-{color}-500 hover:bg-{color}-50 hover:border-{color}-300"}}`}}
                                        >
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={{data.attendee_ids.includes(member.id)}}
                                                onChange={{(e) => {{
                                                    let newIds = [...data.attendee_ids];
                                                    if (e.target.checked) {{
                                                        newIds.push(member.id);
                                                    }} else {{
                                                        newIds = newIds.filter(id => id !== member.id);
                                                    }}
                                                    
                                                    let newData = {{ ...data, attendee_ids: newIds }};
                                                    
                                                    if (typeof hasSecondaryProgram !== 'undefined' && hasSecondaryProgram) {{
                                                        const newProgs = [...data.programs];
                                                        if (newProgs[1] && newProgs[1].athlete_ids) {{
                                                            newProgs[1].athlete_ids = newProgs[1].athlete_ids.filter(id => newIds.includes(id));
                                                        }}
                                                        if (newProgs[0] && newProgs[0].athlete_ids) {{
                                                            newProgs[0].athlete_ids = newIds.filter(id => !newProgs[1]?.athlete_ids?.includes(id));
                                                        }}
                                                        newData.programs = newProgs;
                                                    }}
                                                    
                                                    setData(newData);
                                                }}}}
                                            />
                                            <span className="text-xs font-bold">{{member.name}}</span>
                                        </label>
                                    ))
                                ) : (
                                    <div className="text-sm text-{color}-500 italic py-2">
                                        Belum ada anggota di grup ini.
                                    </div>
                                )}}
                            </div>
                        </div>'''
    
    # We find where Coach Pendamping ends
    # We will just replace `</div>\n                    </div>\n                </div>\n` if it directly follows the coach block.
    # To make it robust, we'll replace the closing tags of the Info Dasar block.
    # Find `Info Dasar` or `Informasi Dasar`
    info_dasar = content.find('Informasi Dasar')
    if info_dasar == -1:
        print("Informasi Dasar not found")
        return
    
    # Find the next `{/* Editor */}`
    editor_idx = content.find('{/* Editor */}', info_dasar)
    if editor_idx == -1:
        print("Editor section not found")
        return
        
    # We know the closing of Information Dasar is right before Editor.
    # It looks like:
    #                         </div>
    #                     </div>
    #                 </div>
    #
    #                 {/* Editor */}
    
    # So we can search backwards from editor_idx for the closest `</div>` that is a child of the grid.
    # Actually, why not just inject it after the Coach Pendamping block?
    # Let's search for `coach_ids`
    
    coach_block = content.find('coach_ids', info_dasar)
    if coach_block == -1:
        print("coach_ids not found")
        return
        
    end_of_coach_block = content.find('</div>', coach_block)
    end_of_coach_block = content.find('</div>', end_of_coach_block + 1)
    # The coach block has a div containing labels, and then the container div.
    
    # A more robust regex:
    # Match the entire Coach Pendamping section up to its closing </div>
    match = re.search(r'(<label[^>]*>.*?Coach Pendamping.*?</label>.*?</div>\s*</div>)', content, re.DOTALL | re.IGNORECASE)
    if match:
        full_match = match.group(1)
        new_content = content.replace(full_match, full_match + '\n' + injection)
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Injected into {filepath}")
    else:
        print(f"Could not match Coach block in {filepath}")

process_file('resources/js/Pages/Admin/GroupTrainings/CreateSession.jsx')
process_file('resources/js/Pages/Admin/GroupTrainings/EditSession.jsx')
