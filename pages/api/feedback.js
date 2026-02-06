import { Redis } from '@upstash/redis';
import crypto from 'crypto';

// Initialize Redis client (works in Vercel serverless environment)
// For local development, you can use mock data or set up local Redis
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Helper function to generate anonymous user ID from IP
function generateUserId(ip) {
  const hash = crypto.createHash('sha256').update(ip).digest('hex');
  return `user_${hash.substring(0, 8)}`;
}

// Helper function to get all feedback posts
async function getFeedbackPosts() {
  if (!redis) {
    // Return empty array if Redis is not configured (local dev without Redis)
    return [];
  }

  try {
    const posts = await redis.get('feedback:posts');
    return posts || [];
  } catch (error) {
    console.error('Error fetching from Redis:', error);
    return [];
  }
}

// Helper function to save feedback posts
async function saveFeedbackPosts(posts) {
  if (!redis) {
    throw new Error('Redis not configured');
  }

  await redis.set('feedback:posts', posts);
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
        const posts = await getFeedbackPosts();
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
        // Check if Redis is configured
        if (!redis) {
          return res.status(503).json({ 
            error: 'Feedback service is not configured. Please set up Upstash Redis in Vercel.' 
          });
        }

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
        let posts = await getFeedbackPosts();
        
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
        await saveFeedbackPosts(posts);
        
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
