const fs = require('fs');
const path = require('path');

const files = [
    'resources/js/Pages/Admin/IndividualTrainings/CreateSession.jsx',
    'resources/js/Pages/Admin/IndividualTrainings/EditSession.jsx',
    'resources/js/Pages/Admin/GroupTrainings/CreateSession.jsx',
    'resources/js/Pages/Admin/GroupTrainings/EditSession.jsx',
    'resources/js/Pages/Admin/IndividualTrainings/Partials/PhaseBlock.jsx',
    'resources/js/Pages/Admin/IndividualTrainings/Partials/TextBlock.jsx'
];

files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) return;
    
    let content = fs.readFileSync(fullPath, 'utf8');

    // 1. Remove uppercase and tracking
    content = content.replace(/uppercase tracking-widest/g, '');
    content = content.replace(/uppercase tracking-wider/g, '');
    content = content.replace(/uppercase/g, '');
    
    // Clean up empty classes or double spaces
    content = content.replace(/  +/g, ' ');
    content = content.replace(/className="\s+/g, 'className="');
    content = content.replace(/\s+"/g, '"');

    // 2. Change slate to zinc for theme consistency
    content = content.replace(/slate-/g, 'zinc-');

    // 3. Fix button texts
    content = content.replace(/"MENYIMPAN..."/g, '"Menyimpan..."');
    content = content.replace(/"SIMPAN PROGRAM SESI INI"/g, '"Simpan Program Sesi Ini"');
    content = content.replace(/"UPDATE PROGRAM SESI INI"/g, '"Update Program Sesi Ini"');

    // 4. Reduce font sizes
    content = content.replace(/text-2xl font-bold/g, 'text-lg font-bold'); // Main title
    content = content.replace(/text-lg font-bold text-zinc-900/g, 'text-base font-bold text-zinc-900'); // Section titles
    content = content.replace(/text-\[11px\]/g, 'text-[11px]'); // Keep labels small
    
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
});
