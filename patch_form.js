const fs = require('fs');
const file = 'resources/js/Pages/Admin/Phv/Form.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace component signature and useForm initialization
content = content.replace(
    /export default function PhvCalculator\(\{ auth, athletes \}\) \{[\s\S]*?\}\);/m,
    `export default function Form({ auth, athlete, assessment }) {
    const isEditing = !!assessment;
    const { data, setData, post, put, processing, errors, recentlySuccessful } = useForm({
        assessment_date: assessment?.assessment_date || new Date().toISOString().split('T')[0],
        gender: assessment?.gender || (athlete.gender === 'Perempuan' || athlete.gender === 'female' ? 'female' : 'male'),
        age: assessment?.age || athlete.age || '',
        weight: assessment?.weight || '',
        standing_height: assessment?.standing_height || '',
        sitting_height: assessment?.sitting_height || '',
        leg_length: assessment?.leg_length || '',
        maturity_offset: assessment?.maturity_offset || '',
        phv_age: assessment?.phv_age || '',
        maturity_status: assessment?.maturity_status || '',
        remaining_growth: assessment?.remaining_growth || '',
        predicted_adult_height: assessment?.predicted_adult_height || '',
        adult_height_percentage: assessment?.adult_height_percentage || ''
    });`
);

// Remove handleAthleteChange
content = content.replace(/const handleAthleteChange[\s\S]*?\};/m, '');

// Fix handleHeightOrSittingChange
content = content.replace(
    /const handleHeightOrSittingChange = \(field, value\) => \{[\s\S]*?setData\(newData\);\n    \};/m,
    `const handleHeightOrSittingChange = (field, value) => {
        const newData = { ...data, [field]: value };
        const height = parseFloat(newData.standing_height);
        const sitting = parseFloat(newData.sitting_height);
        if (height > 0 && sitting > 0 && sitting < height) {
            const calculatedLeg = (height - sitting).toFixed(1);
            if (!newData.leg_length || newData.leg_length === "") {
                newData.leg_length = calculatedLeg;
            }
        }
        setData(newData);
    };`
);

// Fix submit
content = content.replace(
    /const submit = \(e\) => \{[\s\S]*?\}\;/m,
    `const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.phv-calculator.update', assessment.id));
        } else {
            post(route('admin.phv-calculator.store', athlete.id));
        }
    };`
);

// Replace "Pilih Atlet" dropdown with static text
content = content.replace(
    /<div>\s*<label className="block text-sm font-medium text-slate-700 mb-1">Pilih Atlet<\/label>[\s\S]*?<\/div>/m,
    `<div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Atlet</label>
        <div className="w-full bg-slate-50 border border-slate-200 text-slate-500 rounded-lg px-4 py-2.5 font-semibold">
            {athlete.name}
        </div>
    </div>`
);

// Fix "Simpan Hasil" button text
content = content.replace(
    /Simpan Hasil/m,
    `{isEditing ? 'Update Hasil' : 'Simpan Hasil'}`
);

fs.writeFileSync(file, content);
