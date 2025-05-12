import { glob } from "glob"

/**
 * Scans the project directory for files to extract documentation from
 * @param projectDir The root directory of the project
 * @returns Array of file paths
 */
export async function scanProjectFiles(projectDir: string): Promise<string[]> {
  // Define patterns to include
  const patterns = ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.md", "**/*.mdx"]

  // Define patterns to exclude
  const ignore = ["**/node_modules/**", "**/dist/**", "**/build/**", "**/docs/**", "**/.git/**"]

  // Find all matching files
  const files = await glob(patterns, {
    cwd: projectDir,
    ignore,
    absolute: true,
  })

  return files
}
