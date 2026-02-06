import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const feedbackFilePath = path.join(process.cwd(), 'reader-feedback.md');

// Helper function to generate anonymous user ID from IP
function generateUserId(ip) {
  const hash = crypto.createHash('sha256').update(ip).digest('hex');
  return `user_${hash.substring(0, 8)}`;
}

// Helper function to parse feedback file
function parseFeedback() {
  if (!fs.existsSync(feedbackFilePath)) {
    return [];
  }

  const fileContent = fs.readFileSync(feedbackFilePath, 'utf8');
  const posts = [];
  
  // Split by separator (---) but skip the header
  const sections = fileContent.split('\n---\n').slice(1);
  
  for (let i = 0; i < sections.length; i += 2) {
    if (i + 1 < sections.length) {
      const metadata = sections[i];
      const content = sections[i + 1].trim();
      
      const timestampMatch = metadata.match(/timestamp: (.+)/);
      const userIdMatch = metadata.match(/userId: (.+)/);
      const ipMatch = metadata.match(/ip: (.+)/);
      
      if (timestampMatch && userIdMatch && ipMatch) {
        posts.push({
          timestamp: timestampMatch[1],
          userId: userIdMatch[1],
          ip: ipMatch[1],
          content: content,
        });
      }
    }
  }
  
  return posts;
}

// Helper function to save feedback
function saveFeedback(posts) {
  let content = '# Reader Feedback\n';
  
  posts.forEach(post => {
    content += `\n---\ntimestamp: ${post.timestamp}\nuserId: ${post.userId}\nip: ${post.ip}\n---\n${post.content}\n`;
  });
  
  fs.writeFileSync(feedbackFilePath, content, 'utf8');
}

// Helper function to clean old posts (>10 days)
function cleanOldPosts(posts) {
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
  
  return posts.filter(post => {
    const postDate = new Date(post.timestamp);
    return postDate >= tenDaysAgo;
  });
}

// Helper function to check rate limit
function checkRateLimit(posts, ip) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayPosts = posts.filter(post => {
    const postDate = new Date(post.timestamp);
    return post.ip === ip && postDate >= today;
  });
  
  return todayPosts.length < 3;
}

// Helper function to get client IP
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;
  return ip || 'unknown';
}

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const posts = parseFeedback();
        const cleanedPosts = cleanOldPosts(posts);
        
        // Return posts without IP addresses (privacy)
        const publicPosts = cleanedPosts.map(post => ({
          timestamp: post.timestamp,
          userId: post.userId,
          content: post.content,
        })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        res.status(200).json({ posts: publicPosts });
      } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Failed to fetch feedback' });
      }
      break;

    case 'POST':
      try {
        const { content } = req.body;
        const clientIp = getClientIp(req);
        
        // Validate content
        if (!content || typeof content !== 'string') {
          return res.status(400).json({ error: 'Content is required' });
        }
        
        if (content.length > 100) {
          return res.status(400).json({ error: 'Content must be 100 characters or less' });
        }
        
        // Parse existing feedback
        let posts = parseFeedback();
        
        // Clean old posts
        posts = cleanOldPosts(posts);
        
        // Check rate limit
        if (!checkRateLimit(posts, clientIp)) {
          return res.status(429).json({ error: 'Rate limit exceeded. You can only post 3 times per day.' });
        }
        
        // Create new post
        const newPost = {
          timestamp: new Date().toISOString(),
          userId: generateUserId(clientIp),
          ip: clientIp,
          content: content.trim(),
        };
        
        // Add new post and save
        posts.push(newPost);
        saveFeedback(posts);
        
        res.status(201).json({ 
          success: true, 
          post: {
            timestamp: newPost.timestamp,
            userId: newPost.userId,
            content: newPost.content,
          }
        });
      } catch (error) {
        console.error('Error posting feedback:', error);
        res.status(500).json({ error: 'Failed to post feedback' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
