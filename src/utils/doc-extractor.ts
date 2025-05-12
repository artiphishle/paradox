import fs from "fs-extra"
import path from "path"
import type { DocumentationItem } from "../types.js"

/**
 * Extracts documentation from files
 * @param files Array of file paths
 * @param projectDir The root directory of the project
 * @returns Array of documentation items
 */
export async function extractDocumentation(files: string[], projectDir: string): Promise<DocumentationItem[]> {
  const docs: DocumentationItem[] = []

  for (const filePath of files) {
    try {
      const content = await fs.readFile(filePath, "utf-8")
      const relativePath = path.relative(projectDir, filePath)

      // Skip files that don't have documentation comments
      if (!hasDocumentation(content)) {
        continue
      }

      const docContent = extractDocContent(content, filePath)
      const title = getTitle(relativePath)

      docs.push({
        filePath,
        relativePath,
        content: docContent,
        title,
      })
    } catch (error) {
      console.warn(`Error processing file ${filePath}:`, error)
    }
  }

  return docs
}

/**
 * Checks if a file has documentation comments
 */
function hasDocumentation(content: string): boolean {
  // Check for JSDoc style comments
  return /\/\*\*[\s\S]*?\*\//.test(content)
}

/**
 * Extracts documentation content from a file
 */
function extractDocContent(content: string, filePath: string): string {
  const extension = path.extname(filePath)
  let docContent = ""

  // Extract JSDoc style comments
  const jsdocMatch = content.match(/\/\*\*([\s\S]*?)\*\//)
  if (jsdocMatch && jsdocMatch[1]) {
    // Clean up the comment
    docContent = jsdocMatch[1]
      .split("\n")
      .map((line) => line.replace(/^\s*\*\s?/, ""))
      .join("\n")
      .trim()
  }

  // If it's a markdown file, use the content directly
  if ([".md", ".mdx"].includes(extension) && !docContent) {
    docContent = content
  }

  return docContent
}

/**
 * Generates a title from the file path
 */
function getTitle(relativePath: string): string {
  const baseName = path.basename(relativePath, path.extname(relativePath))
  return baseName
    .split(/[-_.]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
