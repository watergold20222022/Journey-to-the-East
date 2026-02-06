# AGENTS.md

This file contains guidelines for agentic coding assistants working in this repository.

## Build, Lint, and Test Commands

- `npm run dev` - Start development server at http://localhost:3000 (hot reload enabled)
- `npm run build` - Build for production (Next.js optimized build)
- `npm start` - Start production server
- `npm run lint` - Run ESLint to check code quality (extends next/core-web-vitals)

**Testing**: No test framework is currently configured. For testing:
- Use browser developer tools for client-side debugging
- Test API routes at `/api/chapters` and `/api/chapter/[slug]`
- Manual testing is the primary verification method

## Project Overview

This is a Next.js 14 application that renders a cyberpunk-themed novel from markdown content in the `chapters/` directory. The app uses:
- React 18 with functional components and hooks exclusively
- Next.js trailing slashes and unoptimized images (next.config.js)
- gray-matter for YAML frontmatter parsing
- remark and remark-html for markdown-to-HTML conversion
- API routes for dynamic content fetching (chapters list and individual chapter content)
- styled-jsx for component-scoped CSS
- Cyberpunk aesthetic with cyan/purple color scheme and monospace fonts

## Code Style Guidelines

### File Organization
- `pages/index.js` - Main application page with sidebar and content area
- `pages/api/chapters.js` - API endpoint returning sorted list of chapters
- `pages/api/chapter/[slug].js` - API endpoint returning individual chapter HTML content
- `chapters/` - Directory containing all chapter markdown files
- `CHAPTER_SUMMARIES.md` - Narrative reference and chapter summaries
- Chapter files: kebab-case with optional numeric prefixes (e.g., `01-guanyins-battle-at-the-flaming-mountain.md`)

### Imports
- Group imports by type: React/Next.js first, then utilities, then local modules
- Use ES6 import statements at the top of files
- React hooks: `import { useState, useEffect } from 'react'`
- Next.js components: `import Head from 'next/head'`
- File system: `import fs from 'fs'` and `import path from 'path'`
- Markdown processing: `import matter from 'gray-matter'`, `import { remark } from 'remark'`, `import html from 'remark-html'`

### Formatting
- Use 2-space indentation consistently
- Use single quotes for strings
- Add trailing commas in arrays and objects
- No unnecessary whitespace or blank lines between related code blocks
- Line length: aim for 100 characters or less when possible

### Naming Conventions
- Variables and functions: camelCase (e.g., `chapters`, `setChapters`, `fetchChapterContent`, `fileNames`)
- React components: PascalCase (e.g., `Home`)
- File names and directories: kebab-case (e.g., `01-guanyins-battle-at-the-flaming-mountain.md`)
- Constants: UPPER_SNAKE_CASE when used (rare in this codebase)
- API route parameters: destructure as `const { query: { slug }, method } = req`

### React Patterns
- Use functional components with hooks exclusively
- Destructure props and parameters immediately (e.g., `const { slug } = req.query`)
- Use async/await for API calls and async operations
- Use `dangerouslySetInnerHTML` only for processed markdown HTML content
- Implement `getStaticProps` for static generation (currently returns empty props for client-side fetching)
- Provide fallback UI states for loading and error conditions
- Use array methods like `map()`, `filter()`, `sort()` for data transformations
- Handle state updates with dedicated setter functions

### Error Handling
- Wrap all async operations in try-catch blocks
- Use `console.error()` to log errors (never `console.log` in production code)
- Provide user-friendly fallback values and error messages
- API routes return appropriate HTTP status codes:
  - 200: Success
  - 404: Resource not found (chapter not found)
  - 405: Method not allowed (wrong HTTP method)
  - 500: Server error (filesystem or processing errors)

### API Routes
- Use Next.js API route pattern with default export async function
- Implement switch statement to handle HTTP methods
- Destructure request object: `const { query: { slug }, method } = req`
- Set `res.setHeader('Allow', ['GET'])` before returning 405 status
- Always return JSON responses with proper status codes
- Use `fs.readdirSync()` and `fs.readFileSync()` for file operations
- Process markdown with remark pipeline: `await remark().use(html).process(matterResult.content)`

### Markdown and Content Processing
- Chapter files use YAML frontmatter: `---` key: "value" `---`
- Parse frontmatter with gray-matter: `const matterResult = matter(fileContents)`
- Convert markdown to HTML: `await remark().use(html).process(matterResult.content)`
- Sort chapters by numeric prefix using regex: `parseInt(slug.match(/^\d+/)?.[0]) || 0`
- Generate titles from slugs: split on hyphens, capitalize each word
- **CRITICAL**: Always update `CHAPTER_SUMMARIES.md` when adding/modifying chapters

### Writing Guidelines (Content Creation)
- All chapters written in English for Western readers
- Target length: 5,000-10,000 words per chapter
- Use markdown headers (# ## ###) for structure
- Maintain consistent cyberpunk sci-fi narrative voice
- Include blank lines between paragraphs for readability
- Adapt Chinese classical characters with Western contemporary reimagining
- Incorporate Western storytelling elements and themes
- Focus on cosmic scale, high-tech elements, and philosophical undertones

### Styling (Cyberpunk Theme)
- Use CSS-in-JS with styled-jsx (scoped styles within components)
- Use `className` for CSS classes (never `class`)
- Color palette: cyan (#00ffff), purple (#8a2be2), dark backgrounds (#0a0a1a)
- Font: 'Courier New', monospace throughout
- Effects: text-shadow, box-shadow, gradients, and glows for cyberpunk aesthetic
- Responsive design with `@media (max-width: 768px)` breakpoints
- Mobile-first approach where appropriate
- Custom scrollbars with themed colors
- Use CSS animations sparingly (e.g., glitch effect on header)

### Code Quality
- Run `npm run lint` before committing changes
- ESLint extends `next/core-web-vitals` configuration
- Keep functions focused and single-purpose
- Comment complex logic sparingly (prefer self-documenting code)
- Use meaningful variable names that reflect their purpose
- Avoid deep nesting; extract helper functions when needed

### Static Site Generation
- Images are unoptimized for static deployment (next.config.js)
- Trailing slashes enabled for routes (next.config.js)
- All content fetched client-side via API routes
- Note: No `output: 'export'` currently configured (standard Next.js SSR mode)

### Additional Notes
- No TypeScript currently used (JavaScript only)
- No testing framework configured
- All content is client-side fetched (no server-side rendering for chapters)
- State management: `useState` for component state, `setSelectedChapter` pattern
- File system operations use Node.js built-ins (fs, path)
- Dependencies include Next.js 14, React 18, gray-matter, remark ecosystem
