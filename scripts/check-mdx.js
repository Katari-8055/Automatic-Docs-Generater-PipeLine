const fs = require('fs');
const content = fs.readFileSync('docs/plugins/webpack.mdx', 'utf8');

// Basic checker for common MDX pitfalls
const lines = content.split('\n');
lines.forEach((line, index) => {
    // Look for unclosed img tags
    if (line.match(/<img([^>]*)>/) && !line.match(/<img([^>]*)(\/|><\/img)>/)) {
        console.log(`Unclosed img at line ${index + 1}: ${line}`);
    }
    // Look for unclosed br tags
    if (line.match(/<br>/)) {
        console.log(`Unclosed br at line ${index + 1}: ${line}`);
    }
    // Look for unclosed hr tags
    if (line.match(/<hr>/)) {
        console.log(`Unclosed hr at line ${index + 1}: ${line}`);
    }
    // Look for <3
    if (line.includes('<3')) {
        console.log(`<3 at line ${index + 1}: ${line}`);
    }
    // Look for { and } mismatches
    let openCount = 0;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '{') openCount++;
        if (line[i] === '}') openCount--;
    }
    if (openCount !== 0) {
        // Maybe legitimate, but worth logging
        // console.log(`Unbalanced {} at line ${index + 1}: ${line}`);
    }
});
