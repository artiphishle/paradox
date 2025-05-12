export interface UserConfig {
  githubUsername: string
  repoName: string
  projectName: string
  projectDescription: string
}

export interface DocumentationItem {
  filePath: string
  relativePath: string
  content: string
  title: string
}

export interface DocusaurusConfig {
  title: string
  tagline: string
  url: string
  baseUrl: string
  organizationName: string
  projectName: string
}
