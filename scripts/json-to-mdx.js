const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../api-docs.json');
const OUTPUT_DIR = path.join(__dirname, '../docs/api');

/**
 * Clean up strings removing leading hyphens from descriptions.
 */
function cleanDescription(desc) {
    if (!desc) return '';
    return desc.replace(/^- /, '').trim();
}

/**
 * Generates the MDX content for a given API documentation block.
 */
function generateMdxContent(doc) {
    const { description, tags, file } = doc;

    // Try to determine a title from the description (first sentence) or fallback
    const firstSentenceMatch = description.match(/^([^.]+)/);
    let title = firstSentenceMatch ? firstSentenceMatch[1] : 'API Reference';

    // Extract parameters and return tags
    const params = tags.filter(t => t.tag === 'param');
    const returns = tags.find(t => t.tag === 'returns' || t.tag === 'return');

    let mdx = `---
title: "${title}"
description: "Extracted from ${file.replace(/\\/g, '/')}"
---

${description}

`;

    if (params.length > 0) {
        mdx += `### Parameters\n\n`;
        params.forEach(param => {
            // Sometimes 'name' might hold the description if type parsing fails in comment-parser
            // We do our best to map it to Mintlify ParamField
            const paramName = param.name || 'parameter';
            const paramType = param.type || 'any';
            const paramDesc = cleanDescription(param.description);

            mdx += `<ParamField path="${paramName}" type="${paramType}">\n  ${paramDesc}\n</ParamField>\n\n`;
        });
    }

    if (returns) {
        mdx += `### Returns\n\n`;

        const returnType = returns.type || 'any';
        // Sometimes the name field captures part of the description due to comment-parser behavior
        const returnDesc = [returns.name, returns.description].filter(Boolean).join(' ').trim();

        mdx += `<ResponseField name="return" type="${returnType}">\n  ${cleanDescription(returnDesc)}\n</ResponseField>\n\n`;
    }

    return mdx;
}

/**
 * Main function to convert JSON to MDX
 */
function main() {
    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`Error: Input file not found at ${INPUT_FILE}`);
        console.log('Please run extract-jsdoc.js first.');
        return;
    }

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    console.log('Reading api-docs.json...');
    const data = fs.readFileSync(INPUT_FILE, 'utf8');
    let docs = [];

    try {
        docs = JSON.parse(data);
    } catch (error) {
        console.error('Error parsing api-docs.json:', error.message);
        return;
    }

    if (docs.length === 0) {
        console.log('No documentation blocks found in api-docs.json.');
        return;
    }

    console.log(`Found ${docs.length} documentation blocks. Generating MDX files...`);

    docs.forEach((doc, index) => {
        // Generate a file name (e.g., api-1.mdx, api-2.mdx or based on title)
        // Here we use a slugified version of the first 3 words of the description
        let fileName = `api-doc-${index + 1}.mdx`;
        if (doc.description) {
            const titleWords = doc.description.split(' ').slice(0, 3).join('-').replace(/[^\w-]/g, '').toLowerCase();
            if (titleWords) {
                fileName = `${titleWords}.mdx`;
            }
        }

        const mdxContent = generateMdxContent(doc);
        const filePath = path.join(OUTPUT_DIR, fileName);

        fs.writeFileSync(filePath, mdxContent, 'utf8');
        console.log(`Created: ${path.relative(path.join(__dirname, '..'), filePath)}`);
    });

    console.log('MDX conversion completed successfully!');
}

main();
