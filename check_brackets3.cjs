const fs = require('fs');
const content = fs.readFileSync('resources/js/Pages/Admin/Users/Index.jsx', 'utf8').split('\n');

for (let i = 0; i < content.length; i++) {
    const line = content[i];
    let open = (line.match(/\{/g) || []).length;
    let close = (line.match(/\}/g) || []).length;
    if (open !== close) {
        console.log(`${i+1}: +${open - close} | ${line.trim()}`);
    }
}
