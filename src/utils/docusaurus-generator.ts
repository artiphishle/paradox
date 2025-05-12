import fs from "fs-extra"
import path from "path"
import type { DocumentationItem, UserConfig, DocusaurusConfig } from "../types.js"

/**
 * Generates a Docusaurus site from the extracted documentation
 * @param docs Array of documentation items
 * @param config User configuration
 * @param projectDir The root directory of the project
 */
export async function generateDocusaurusSite(
  docs: DocumentationItem[],
  config: UserConfig,
  projectDir: string,
): Promise<void> {
  const docsDir = path.join(projectDir, "docs")

  // Create docs directory if it doesn't exist
  await fs.ensureDir(docsDir)

  // Generate Docusaurus configuration
  await generateDocusaurusConfig(config, docsDir)

  // Generate documentation files
  await generateDocFiles(docs, docsDir)

  // Generate sidebar configuration
  await generateSidebar(docs, docsDir)

  // Generate package.json for the docs
  await generatePackageJson(config, docsDir)
}

/**
 * Generates Docusaurus configuration file
 */
async function generateDocusaurusConfig(config: UserConfig, docsDir: string): Promise<void> {
  const docusaurusConfig: DocusaurusConfig = {
    title: config.projectName,
    tagline: config.projectDescription,
    url: `https://${config.githubUsername}.github.io`,
    baseUrl: `/${config.repoName}/`,
    organizationName: config.githubUsername,
    projectName: config.repoName,
  }

  const configContent = `
// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '${docusaurusConfig.title}',
  tagline: '${docusaurusConfig.tagline}',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: '${docusaurusConfig.url}',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '${docusaurusConfig.baseUrl}',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: '${docusaurusConfig.organizationName}', // Usually your GitHub org/user name.
  projectName: '${docusaurusConfig.projectName}', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/${docusaurusConfig.organizationName}/${docusaurusConfig.projectName}/tree/main/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: '${docusaurusConfig.title}',
        logo: {
          alt: '${docusaurusConfig.title} Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://github.com/${docusaurusConfig.organizationName}/${docusaurusConfig.projectName}',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Documentation',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/${docusaurusConfig.organizationName}/${docusaurusConfig.projectName}',
              },
            ],
          },
        ],
        copyright: \`Copyright © \${new Date().getFullYear()} ${config.projectName}. Built with Docusaurus.\`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
  `

  await fs.writeFile(path.join(docsDir, "docusaurus.config.js"), configContent)

  // Create necessary directories
  await fs.ensureDir(path.join(docsDir, "docs"))
  await fs.ensureDir(path.join(docsDir, "src/pages"))
  await fs.ensureDir(path.join(docsDir, "src/css"))
  await fs.ensureDir(path.join(docsDir, "static/img"))

  // Create custom CSS
  const customCssContent = `
/**
 * Any CSS included here will be global. The classic template
 * bundles Infima by default. Infima is a CSS framework designed to
 * work well for content-centric websites.
 */

/* You can override the default Infima variables here. */
:root {
  --ifm-color-primary: #2e8555;
  --ifm-color-primary-dark: #29784c;
  --ifm-color-primary-darker: #277148;
  --ifm-color-primary-darkest: #205d3b;
  --ifm-color-primary-light: #33925d;
  --ifm-color-primary-lighter: #359962;
  --ifm-color-primary-lightest: #3cad6e;
  --ifm-code-font-size: 95%;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.1);
}

/* For readability concerns, you should choose a lighter palette in dark mode. */
[data-theme='dark'] {
  --ifm-color-primary: #25c2a0;
  --ifm-color-primary-dark: #21af90;
  --ifm-color-primary-darker: #1fa588;
  --ifm-color-primary-darkest: #1a8870;
  --ifm-color-primary-light: #29d5b0;
  --ifm-color-primary-lighter: #32d8b4;
  --ifm-color-primary-lightest: #4fddbf;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.3);
}
  `

  await fs.writeFile(path.join(docsDir, "src/css/custom.css"), customCssContent)

  // Create placeholder logo
  const logoSvgContent = `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#25c2a0" />
  <text x="100" y="120" font-size="80" text-anchor="middle" fill="white">P</text>
</svg>`

  await fs.writeFile(path.join(docsDir, "static/img/logo.svg"), logoSvgContent)

  // Create intro page
  const introContent = `---
sidebar_position: 1
---

# Introduction

Welcome to the ${config.projectName} documentation!

${config.projectDescription}

This documentation was automatically generated using [Paradox](https://github.com/artiphishle/paradox).
  `

  await fs.writeFile(path.join(docsDir, "docs/intro.md"), introContent)
}

/**
 * Generates documentation files from extracted content
 */
async function generateDocFiles(docs: DocumentationItem[], docsDir: string): Promise<void> {
  for (const doc of docs) {
    // Create a path for the doc file
    const docFilePath = getDocFilePath(doc.relativePath)
    const fullDocPath = path.join(docsDir, "docs", docFilePath)

    // Ensure the directory exists
    await fs.ensureDir(path.dirname(fullDocPath))

    // Create the markdown content
    const markdownContent = `---
sidebar_position: 1
---

# ${doc.title}

${doc.content}

*Source: \`${doc.relativePath}\`*
`

    // Write the file
    await fs.writeFile(fullDocPath, markdownContent)
  }
}

/**
 * Converts a source file path to a documentation file path
 */
function getDocFilePath(filePath: string): string {
  const dirName = path.dirname(filePath)
  const baseName = path.basename(filePath, path.extname(filePath))

  // If the file is in the root, just use the basename
  if (dirName === ".") {
    return `${baseName}.md`
  }

  // Otherwise, create a directory structure
  return path.join(dirName, `${baseName}.md`)
}

/**
 * Generates sidebar configuration
 */
async function generateSidebar(docs: DocumentationItem[], docsDir: string): Promise<void> {
  // Group docs by directory
  const docsByCategory: Record<string, string[]> = {}

  for (const doc of docs) {
    const docFilePath = getDocFilePath(doc.relativePath)
    const dirName = path.dirname(docFilePath)
    const baseName = path.basename(docFilePath, path.extname(docFilePath))

    const category = dirName === "." ? "root" : dirName

    if (!docsByCategory[category]) {
      docsByCategory[category] = []
    }

    // Add the doc ID (path without extension)
    const docId = dirName === "." ? baseName : `${dirName}/${baseName}`

    docsByCategory[category].push(docId)
  }

  // Create sidebar items
  const sidebarItems: string[] = []

  // Always add intro first
  sidebarItems.push(`'intro'`)

  // Add root items
  if (docsByCategory["root"]) {
    docsByCategory["root"].forEach((docId) => {
      if (docId !== "intro") {
        sidebarItems.push(`'${docId}'`)
      }
    })
  }

  // Add category items
  Object.entries(docsByCategory).forEach(([category, docIds]) => {
    if (category !== "root") {
      const categoryItems = docIds.map((docId) => `'${docId}'`).join(", ")
      sidebarItems.push(`{
        type: 'category',
        label: '${category.charAt(0).toUpperCase() + category.slice(1)}',
        items: [${categoryItems}],
      }`)
    }
  })

  // Create the sidebar configuration
  const sidebarContent = `
/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    ${sidebarItems.join(",\n    ")}
  ],
};

module.exports = sidebars;
  `

  await fs.writeFile(path.join(docsDir, "sidebars.js"), sidebarContent)
}

/**
 * Generates package.json for the docs
 */
async function generatePackageJson(config: UserConfig, docsDir: string): Promise<void> {
  const packageJsonContent = {
    name: `${config.repoName}-docs`,
    version: "0.0.0",
    private: true,
    scripts: {
      docusaurus: "docusaurus",
      start: "docusaurus start",
      build: "docusaurus build",
      swizzle: "docusaurus swizzle",
      deploy: "docusaurus deploy",
      clear: "docusaurus clear",
      serve: "docusaurus serve",
      write_translations: "docusaurus write-translations",
      write_heading_ids: "docusaurus write-heading-ids",
    },
    dependencies: {
      "@docusaurus/core": "^2.4.3",
      "@docusaurus/preset-classic": "^2.4.3",
      "@mdx-js/react": "^1.6.22",
      clsx: "^1.2.1",
      "prism-react-renderer": "^1.3.5",
      react: "^17.0.2",
      "react-dom": "^17.0.2",
    },
    devDependencies: {
      "@docusaurus/module-type-aliases": "^2.4.3",
    },
    browserslist: {
      production: [">0.5%", "not dead", "not op_mini all"],
      development: ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"],
    },
    engines: {
      node: ">=16.14",
    },
  }

  await fs.writeFile(path.join(docsDir, "package.json"), JSON.stringify(packageJsonContent, null, 2))
}
