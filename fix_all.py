import os

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Fix addTextBlock
    old_addText = '''    const addTextBlock = () => {
        setData("blocks", [
            ...data.blocks,
            {
                step: 1,
                title: "",
                description: "",
                items: [{ note: "" }],
            },
        ]);
    };'''
    
    new_addText = '''    const addTextBlock = () => {
        const newPrograms = [...data.programs];
        newPrograms[activeProgramIndex].blocks.push({
            step: 1,
            title: "",
            description: "",
            items: [{ note: "" }],
        });
        setData("programs", newPrograms);
    };'''
    content = content.replace(old_addText, new_addText)

    # Fix addPhaseBlock
    old_addPhase = '''    const addPhaseBlock = () => {
        setData("blocks", [
            ...data.blocks,
            {
                step: 2,
                category: "warm_up",
                title: "",
                description: "",
                items: [
                    {
                        exercise_id: "",
                        note: "",
                        load: "",
                        load_unit: "kg",
                        sets: "",
                        reps: "",
                        reps_unit: "reps",
                        duration: "",
                        tempo: "",
                        rir: "",
                        rest_per_set: "",
                        intensity: "",
                    },
                ],
            },
        ]);
    };'''
    
    new_addPhase = '''    const addPhaseBlock = () => {
        const newPrograms = [...data.programs];
        newPrograms[activeProgramIndex].blocks.push({
            step: 2,
            category: "warm_up",
            title: "",
            description: "",
            items: [
                {
                    exercise_id: "",
                    note: "",
                    load: "",
                    load_unit: "kg",
                    sets: "",
                    reps: "",
                    reps_unit: "reps",
                    duration: "",
                    tempo: "",
                    rir: "",
                    rest_per_set: "",
                    intensity: "",
                },
            ],
        });
        setData("programs", newPrograms);
    };'''
    content = content.replace(old_addPhase, new_addPhase)

    # Fix X import
    if '<X size={14} />' in content and 'X,' not in content:
        content = content.replace('ClipboardEdit,', 'ClipboardEdit,\n    X,')

    with open(filepath, 'w') as f:
        f.write(content)


fix_file('resources/js/Pages/Admin/GroupTrainings/CreateSession.jsx')
fix_file('resources/js/Pages/Admin/GroupTrainings/EditSession.jsx')
print("Fixed functions and imports.")
