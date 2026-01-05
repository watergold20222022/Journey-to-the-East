import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const chaptersDirectory = path.join(process.cwd(), 'chapters');

export default async function handler(req, res) {
  const {
    query: { slug },
    method,
  } = req;

  switch (method) {
    case 'GET':
      try {
        // Get file names from the chapters directory
        const fileNames = fs.readdirSync(chaptersDirectory);
        const chapters = fileNames
          .filter(fileName => fileName.endsWith('.md'))
          .map(fileName => {
            // Remove ".md" from file name to get slug
            const slug = fileName.replace(/\.md$/, '');

            // Read markdown file as string
            const fullPath = path.join(chaptersDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            // Use gray-matter to parse the post metadata section
            const matterResult = matter(fileContents);

            // Generate title from filename
            const title = slug
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            return {
              slug,
              title: title,
            };
          })
          .sort((a, b) => {
            // Sort chapters by numeric prefix if they have one (e.g., 01-chapter.md, 02-chapter.md)
            const numA = parseInt(a.slug.match(/^\d+/)?.[0]) || 0;
            const numB = parseInt(b.slug.match(/^\d+/)?.[0]) || 0;
            return numA - numB;
          });

        res.status(200).json({ chapters });
      } catch (error) {
        console.error('Error reading chapters directory:', error);
        res.status(500).json({ error: 'Failed to read chapters directory' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

