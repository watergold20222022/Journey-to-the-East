# AGENTS.md

This file contains guidelines for agentic coding assistants working in this repository.

## Build, Lint, and Test Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint to check code quality

Note: No test framework is currently configured in this project.

## Project Overview

This is a Next.js 14 application that renders markdown content from the `chapters/` directory. The app uses:
- React 18 with functional components and hooks
- Static export mode (configured in next.config.js)
- gray-matter for frontmatter parsing
- remark and remark-html for markdown-to-HTML conversion
- API routes for dynamic content fetching

## Code Style Guidelines

### File Organization
- Pages and API routes go in `pages/` directory
- Markdown chapter files go in `chapters/` directory
- Chapter files use kebab-case naming with optional numeric prefixes (e.g., `01-the-monkey-kings-origin.md`)

### Imports
- Use ES6 import statements at the top of files
- React hooks: `import { useState, useEffect } from 'react'`
- Next.js components: `import Head from 'next/head'`
- File system operations: `import fs from 'fs'` and `import path from 'path'`
- Markdown processing: `import matter from 'gray-matter'`, `import { remark } from 'remark'`, `import html from 'remark-html'`

### Formatting
- Use 2-space indentation
- Use single quotes for strings
- Add trailing commas in arrays and objects
- No unnecessary whitespace or blank lines

### Naming Conventions
- Variables and functions: camelCase (e.g., `chapters`, `setChapters`, `fetchChapterContent`)
- React components: PascalCase (e.g., `Home`, `Head`)
- File names and directories: kebab-case (e.g., `01-the-monkey-kings-origin.md`)
- Constants: UPPER_SNAKE_CASE when used

### React Patterns
- Use functional components with hooks
- Destructure props and parameters (e.g., `const { slug } = req.query`)
- Use async/await for API calls and async operations
- Use `dangerouslySetInnerHTML` only when rendering processed markdown HTML
- Implement `getStaticProps` for static generation where appropriate
- Provide fallback UI states for loading and error conditions

### Error Handling
- Wrap async operations in try-catch blocks
- Use `console.error()` to log errors
- Provide fallback values or user-friendly error messages
- In API routes, return appropriate HTTP status codes:
  - 200: Success
  - 404: Resource not found
  - 405: Method not allowed
  - 500: Server error

### API Routes
- Use Next.js API route pattern with default export
- Implement switch statement to handle HTTP methods
- Destructure req object: `const { query: { slug }, method } = req`
- Set `res.setHeader('Allow', ['GET'])` before returning 405
- Always return JSON responses with proper status codes

### Markdown and Content
- Chapter files use YAML frontmatter for metadata (title, etc.)
- Frontmatter format: `---` followed by `key: "value"` pairs, then `---`
- Use gray-matter to parse frontmatter: `const matterResult = matter(fileContents)`
- Convert markdown to HTML using remark: `await remark().use(html).process(content)`
- Sort chapters by numeric prefix if present using regex: `parseInt(slug.match(/^\d+/)?.[0])`

### Styling
- Use CSS-in-JS with styled-jsx for component styles
- Use `className` for CSS classes (not `class`)
- Implement responsive design with media queries (e.g., `@media (max-width: 768px)`)
- Follow mobile-first approach where appropriate

### Code Quality
- Run `npm run lint` before committing changes
- ESLint configuration extends `next/core-web-vitals`
- Avoid console.log in production code (use console.error for errors only)
- Keep functions focused and single-purpose
- Comment complex logic sparingly

### Static Site Generation
- App is configured for static export (`output: 'export'` in next.config.js)
- Images are unoptimized for static export
- Trailing slashes are enabled for routes

### Additional Notes
- No TypeScript is currently used (JavaScript only)
- No testing framework is configured
- All content is client-side fetched from API routes
- Use `setSelectedChapter` pattern for managing selected state
