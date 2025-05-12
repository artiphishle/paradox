#!/usr/bin/env node
import { Command } from "commander"
import inquirer from "inquirer"
import chalk from "chalk"
import ora from "ora"
import path from "path"
import { fileURLToPath } from "url"
import { scanProjectFiles } from "../src/utils/file-scanner.js"
import { extractDocumentation } from "../src/utils/doc-extractor.js"
import { generateDocusaurusSite } from "../src/utils/docusaurus-generator.js"
import type { UserConfig } from "../src/types.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const program = new Command()

program.name("@artiphishle/paradox").description("Generate Docusaurus documentation from your project").version("0.1.0")

program.parse()

async function main() {
  console.log(chalk.cyan.bold("\n🔮 Welcome to Paradox - Docusaurus Documentation Generator 🔮\n"))

  const answers = await inquirer.prompt<UserConfig>([
    {
      type: "input",
      name: "githubUsername",
      message: "What is your GitHub username?",
      validate: (input) => (input.trim() !== "" ? true : "GitHub username is required"),
    },
    {
      type: "input",
      name: "repoName",
      message: "What is your GitHub repository name?",
      validate: (input) => (input.trim() !== "" ? true : "Repository name is required"),
    },
    {
      type: "input",
      name: "projectName",
      message: "What is your project name?",
      default: path.basename(process.cwd()),
    },
    {
      type: "input",
      name: "projectDescription",
      message: "Provide a short description of your project:",
      default: "Documentation generated with Paradox",
    },
  ])

  // Current working directory where the command is executed
  const projectDir = process.cwd()

  // Create spinner for better UX
  const spinner = ora("Scanning project files...").start()

  try {
    // Scan project files
    spinner.text = "Scanning project files..."
    const files = await scanProjectFiles(projectDir)

    // Extract documentation from files
    spinner.text = "Extracting documentation..."
    const docs = await extractDocumentation(files, projectDir)

    // Generate Docusaurus site
    spinner.text = "Generating Docusaurus site..."
    await generateDocusaurusSite(docs, answers, projectDir)

    spinner.succeed(chalk.green("Documentation generated successfully!"))

    console.log(chalk.yellow("\nNext steps:"))
    console.log(chalk.white(`1. Navigate to the docs directory: ${chalk.cyan("cd docs")}`))
    console.log(chalk.white(`2. Install dependencies: ${chalk.cyan("npm install")}`))
    console.log(chalk.white(`3. Start the development server: ${chalk.cyan("npm start")}`))
    console.log(chalk.white(`4. Build for production: ${chalk.cyan("npm run build")}`))
    console.log(chalk.white(`5. Deploy to GitHub Pages: ${chalk.cyan("npm run deploy")}\n`))

    console.log(
      chalk.green(
        `Your documentation will be available at: ${chalk.cyan(`https://${answers.githubUsername}.github.io/${answers.repoName}`)}\n`,
      ),
    )
  } catch (error) {
    spinner.fail(chalk.red("Error generating documentation"))
    console.error(error)
    process.exit(1)
  }
}

main()
