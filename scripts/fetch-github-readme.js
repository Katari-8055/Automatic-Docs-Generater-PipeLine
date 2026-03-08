const fs = require('fs');
const path = require('path');

// Add the GitHub repositories you want to fetch READMEs from here.
// Format: 'owner/repo'
const REPOSITORIES = [
    'webpack/webpack', // Example repository
    // 'facebook/react',
];

const OUTPUT_DIR = path.join(__dirname, '../docs/plugins');

/**
 * Fetches the raw README.md content from the GitHub API.
 */
async function fetchReadme(repo) {
    // We use the application/vnd.github.v3.raw header to get the raw markdown content
    // instead of the base64 encoded JSON response.
    const url = `https://api.github.com/repos/${repo}/readme`;
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3.raw',
                // GitHub API requires a User-Agent header
                'User-Agent': 'Mintlify-README-Fetcher'
            }
        });

        if (!response.ok) {
            console.error(`Failed to fetch README for ${repo}: ${response.status} ${response.statusText}`);
            return null;
        }

        return await response.text();
    } catch (error) {
        console.error(`Error fetching README for ${repo}: ${error.message}`);
        return null;
    }
}

/**
 * Wraps the plain markdown into an MDX format with Mintlify frontmatter.
 */
function convertToMdx(repo, markdown) {
    const repoName = repo.split('/')[1];

    // Sanitize plain markdown to prevent MDX parsing errors
    let safeMarkdown = markdown
        // Strip out div tags completely because markdown inside a div becomes strict JSX, 
        // which errors on unescaped entities like '&' in URLs.
        .replace(/<\/?div[^>]*>/g, '')
        // Self-close <img> tags if they aren't already
        .replace(/<img([^>]*[^\/])>/g, '<img$1 />')
        // Self-close <br> and <hr> tags
        .replace(/<br\s*>/g, '<br />')
        .replace(/<hr\s*>/g, '<hr />')
        // Escape special < syntax that MDX reads as unclosed components
        .replace(/<3/g, '&lt;3')
        .replace(/<<([^>]+)>>/g, '&lt;&lt;$1&gt;&gt;')
        .replace(/<style>/g, '`&lt;style&gt;`')
        .replace(/<\/style>/g, '`&lt;/style&gt;`');

    // Add basic frontmatter to the top of the file
    const frontmatter = `---
title: "${repoName}"
description: "Documentation fetched automatically from ${repo}"
---

`;

    return frontmatter + safeMarkdown;
}

/**
 * Main function to execute the fetch and conversion process.
 */
async function main() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        console.log(`Created directory: ${OUTPUT_DIR}`);
    }

    let successCount = 0;

    for (const repo of REPOSITORIES) {
        console.log(`Fetching README for ${repo}...`);
        const markdown = await fetchReadme(repo);

        if (markdown) {
            const mdxContent = convertToMdx(repo, markdown);

            // Generate a safe file name based on the repository name
            const repoName = repo.split('/')[1];
            const safeFileName = repoName.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase() + '.mdx';

            const outputPath = path.join(OUTPUT_DIR, safeFileName);

            fs.writeFileSync(outputPath, mdxContent, 'utf8');
            console.log(`Saved MDX documentation to docs/plugins/${safeFileName}`);
            successCount++;
        }
    }

    console.log(`\nFinished processing! Successfully created ${successCount} MDX plugin pages.`);
}

main();
