# Paradox

Paradox is a CLI tool that automatically generates Docusaurus documentation from your project's code comments.

## Installation

```bash
# Install globally
npm install -g @artiphishle/paradox

# Or use with npx
npx @artiphishle/paradox
```

## Usage

Navigate to your project directory and run:

```bash
npx @artiphishle/paradox
```

The CLI will prompt you for:
- GitHub username
- GitHub repository name
- Project name
- Project description

After providing this information, Paradox will:
1. Scan your project files
2. Extract documentation from JSDoc-style comments
3. Generate a Docusaurus site in a `docs` directory

## How It Works

Paradox looks for JSDoc-style comments at the beginning of your files:

```typescript
/**
 * This is a documentation comment
 * It will be extracted and included in the docs
 */
export function example() {
  // Some code
}
```

The documentation will be organized based on your project's file structure.

## Next Steps After Generation

1. Navigate to the docs directory: `cd docs`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Build for production: `npm run build`
5. Deploy to GitHub Pages: `npm run deploy`

Your documentation will be available at: `https://{username}.github.io/{repoName}`

## License

MIT
