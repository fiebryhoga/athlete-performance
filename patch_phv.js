const fs = require('fs');
const file = 'resources/js/Pages/Admin/Tools/PhvCalculator.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace dark green banner with PageHeader
content = content.replace(
    /import { Ruler, Scale, Activity, User, Save, Info, AlertTriangle, ArrowRight, UserCircle, HeartPulse } from 'lucide-react';/g,
    `import { Ruler, Scale, Activity, User, Save, Info, AlertTriangle, ArrowRight, UserCircle, HeartPulse } from 'lucide-react';\nimport PageHeader from '@/Components/Layout/PageHeader';`
);

// We will overwrite the entire file to be safer and ensure all changes are cohesive
