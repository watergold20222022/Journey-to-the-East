import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const chaptersDirectory = path.join(process.cwd(), 'chapters');

export default async function handler(req, res) {
  const {
    query: { slug },
    method,
  } = req;

  switch (method) {
    case 'GET':
      try {
        // Read the chapter markdown file
        const fullPath = path.join(chaptersDirectory, `${slug}.md`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        
        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);
        
        // Use remark to convert markdown into HTML string
        const processedContent = await remark()
          .use(html)
          .process(matterResult.content);
        
        const contentHtml = processedContent.toString();
        
        res.status(200).json({ content: contentHtml });
      } catch (error) {
        console.error('Error reading chapter:', error);
        res.status(404).json({ error: 'Chapter not found' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

