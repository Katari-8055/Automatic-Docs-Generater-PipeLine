const fs = require('fs');
const path = require('path');

const mintJsonPath = path.join(__dirname, '..', 'mint.json');
const docsApiDir = path.join(__dirname, '..', 'docs', 'api');

function updateMintNavigation() {
    try {
        if (!fs.existsSync(docsApiDir)) {
            console.error(`Directory not found: ${docsApiDir}`);
            return;
        }

        // 1. Scan docs/api for mdx and md files
        const files = fs.readdirSync(docsApiDir);
        const apiPages = files
            .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
            .map(file => {
                const basename = path.basename(file, path.extname(file));
                return `docs/api/${basename}`;
            })
            .sort();

        // 2. Read mint.json
        const mintJsonContent = fs.readFileSync(mintJsonPath, 'utf8');
        const mintConfig = JSON.parse(mintJsonContent);

        // 3. Update the navigation section
        let apiSectionFound = false;
        if (mintConfig.navigation && Array.isArray(mintConfig.navigation)) {
            for (const section of mintConfig.navigation) {
                // Look for a section that has "API" in the group name
                if (typeof section === 'object' && section.group && section.group.includes("API")) {
                    // Update pages array
                    section.pages = apiPages;
                    apiSectionFound = true;
                    break;
                }
            }
        }

        if (!apiSectionFound) {
            console.warn('Could not find API section in mint.json. Adding a new "API Reference" section.');
            if (!mintConfig.navigation) {
                mintConfig.navigation = [];
            }
            mintConfig.navigation.push({
                group: "API Reference",
                pages: apiPages
            });
        }

        // 4. Write back to mint.json
        fs.writeFileSync(mintJsonPath, JSON.stringify(mintConfig, null, 4) + '\n', 'utf8');
        console.log(`Successfully updated mint.json with ${apiPages.length} API pages.`);

    } catch (err) {
        console.error('Error updating mint.json navigation:', err);
        process.exit(1);
    }
}

updateMintNavigation();
