const fs = require('fs');
const content = fs.readFileSync('resources/js/Pages/Admin/Users/Index.jsx', 'utf8');

let stack = [];
for (let i = 0; i < content.length; i++) {
    if (content[i] === '{') {
        let lineNo = content.slice(0, i).split('\n').length;
        stack.push({ type: '{', line: lineNo });
    }
    if (content[i] === '}') {
        if (stack.length > 0 && stack[stack.length - 1].type === '{') {
            stack.pop();
        } else {
            stack.push({ type: '}', line: content.slice(0, i).split('\n').length });
        }
    }
}
console.log("Unmatched curly braces: ", stack);
