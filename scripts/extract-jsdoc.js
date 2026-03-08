const fs = require('fs');
const path = require('path');
const { parse } = require('comment-parser');

const SOURCE_DIR = path.join(__dirname, '../src');
const OUTPUT_FILE = path.join(__dirname, '../api-docs.json');

/**
 * Recursively find all JavaScript files in the given directory.
 */
function findJsFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) {
        console.warn(`Warning: Source directory does not exist: ${dir}`);
        return fileList;
    }

    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findJsFiles(filePath, fileList);
        } else if (filePath.endsWith('.js')) {
            fileList.push(filePath);
        }
    }

    return fileList;
}

/**
 * Scan a single JavaScript file and extract JSDoc blocks.
 */
function extractJSDocFromFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');
    // comment-parser extracts all JSDoc-style block comments (/** ... */)
    const parsedComments = parse(code);

    return parsedComments.map(block => ({
        file: path.relative(path.join(__dirname, '..'), filePath),
        description: block.description,
        tags: block.tags.map(tag => ({
            tag: tag.tag,
            name: tag.name,
            type: tag.type,
            description: tag.description,
        })),
    }));
}

function main() {
    console.log('Scanning for JavaScript files...');
    const jsFiles = findJsFiles(SOURCE_DIR);

    if (jsFiles.length === 0) {
        console.log(`No JavaScript files found in ${SOURCE_DIR}`);
    }

    const allDocs = [];

    for (const file of jsFiles) {
        try {
            const docs = extractJSDocFromFile(file);
            if (docs.length > 0) {
                allDocs.push(...docs);
            }
        } catch (error) {
            console.error(`Error parsing file ${file}:`, error.message);
        }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allDocs, null, 2), 'utf8');
    console.log(`Successfully extracted JSDoc from ${jsFiles.length} files.`);
    console.log(`Saved output to ${OUTPUT_FILE}`);
}

main();
