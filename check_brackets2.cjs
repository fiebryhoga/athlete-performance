const fs = require('fs');
const content = fs.readFileSync('resources/js/Pages/Admin/Users/Index.jsx', 'utf8').split('\n');

let count = 0;
for (let i = 0; i < content.length; i++) {
    const line = content[i];
    let before = count;
    for (let j = 0; j < line.length; j++) {
        if (line[j] === '{') count++;
        if (line[j] === '}') count--;
    }
    if (count < 0) {
        console.log(`Went negative at line ${i+1}: ${line}`);
    }
}
console.log(`Final count: ${count}`);
