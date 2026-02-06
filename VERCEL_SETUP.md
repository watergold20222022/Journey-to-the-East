# Vercel Deployment Guide

## Reader Feedback Setup

The reader feedback feature requires Upstash Redis for data storage on Vercel's serverless environment.

### Step 1: Create Upstash Redis Database

1. Go to [Upstash Console](https://console.upstash.com/)
2. Sign up or log in
3. Click "Create Database"
4. Choose a name (e.g., "journey-feedback")
5. Select a region close to your users
6. Click "Create"

### Step 2: Get Redis Credentials

After creating the database:

1. Go to your database dashboard
2. Scroll down to "REST API" section
3. Copy the following values:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### Step 3: Add Environment Variables to Vercel

#### Option A: Via Vercel Dashboard

1. Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add the following variables:

```
UPSTASH_REDIS_REST_URL = your_redis_url_here
UPSTASH_REDIS_REST_TOKEN = your_redis_token_here
```

5. Click "Save"
6. Redeploy your project

#### Option B: Via Vercel CLI

```bash
vercel env add UPSTASH_REDIS_REST_URL
# Paste your URL when prompted

vercel env add UPSTASH_REDIS_REST_TOKEN
# Paste your token when prompted

# Redeploy
vercel --prod
```

### Step 4: Verify Deployment

1. Visit your deployed site
2. Try posting a feedback message
3. Check that it appears in the feedback list
4. Verify in Upstash Console that data is being stored

## Local Development Setup

For local development, you have two options:

### Option 1: Use Upstash (Recommended)

Create a `.env.local` file in the project root:

```bash
UPSTASH_REDIS_REST_URL=your_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
```

Then run:
```bash
npm run dev
```

### Option 2: Without Redis (View Only)

If you don't set up Redis for local development:
- GET requests will return empty array
- POST requests will return a 503 error with a helpful message

## Troubleshooting

### "Feedback service is not configured" Error

**Problem**: Environment variables are not set

**Solution**:
1. Verify environment variables are added in Vercel Dashboard
2. Redeploy the project after adding variables
3. Check variable names match exactly (case-sensitive)

### "Failed to post feedback" Error

**Problem**: Redis connection issue

**Solution**:
1. Verify Upstash Redis database is active
2. Check that REST API credentials are correct
3. Ensure database region is accessible
4. Check Upstash dashboard for any service issues

### Posts Not Showing Up

**Problem**: Data retrieval issue

**Solution**:
1. Check browser console for errors
2. Verify GET endpoint is working: `/api/feedback`
3. Check Upstash Console to see if data is stored
4. Clear browser cache and reload

### Rate Limit Not Working

**Problem**: IP detection issue in serverless

**Solution**:
- Vercel automatically provides `x-forwarded-for` header
- Check headers in API logs
- Verify IP is being detected correctly

## Cost Considerations

### Upstash Free Tier

- **10,000 requests per day**
- **256 MB storage**
- This is more than enough for most use cases

Assuming:
- 100 unique visitors per day
- Each visitor views feedback once (GET request)
- 10 visitors post feedback (POST request)

**Daily usage**: ~110 requests (well within free tier)

### Scaling

If you exceed free tier:
- Pay-as-you-go pricing starts
- ~$0.2 per 100K requests
- Very affordable for small to medium projects

## Data Management

### Viewing Stored Data

Use Upstash Console:
1. Go to your database
2. Click on "Data Browser"
3. View the `feedback:posts` key

### Backup Data

Use Upstash Console or API:

```bash
# Using Upstash REST API
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "YOUR_REDIS_URL/get/feedback:posts"
```

### Clear All Feedback (if needed)

```bash
# Using Upstash REST API
curl -H "Authorization: Bearer YOUR_TOKEN" \
  -X POST "YOUR_REDIS_URL/del/feedback:posts"
```

### Export Data

In Upstash Console:
1. Go to Data Browser
2. Select `feedback:posts`
3. Copy the JSON data
4. Save to a file for backup

## Security Notes

### Environment Variables

- Never commit `.env` or `.env.local` files to git
- `.gitignore` already includes these files
- Environment variables are encrypted in Vercel

### IP Address Storage

- IP addresses are stored for rate limiting only
- IPs are not exposed in API responses
- User IDs are anonymized using SHA-256 hash

### Rate Limiting

- 3 posts per IP per day (rolling 24-hour period)
- Helps prevent spam and abuse
- Can be adjusted in `pages/api/feedback.js`

## Migration from File-Based Storage

If you had previous feedback in `reader-feedback.md`:

1. Parse the markdown file
2. Convert to JSON array format
3. Upload to Redis using Upstash Console or API

Example migration script:

```javascript
// migration.js
const fs = require('fs');
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Parse reader-feedback.md and convert to posts array
const posts = []; // ... parse markdown file

// Upload to Redis
redis.set('feedback:posts', posts).then(() => {
  console.log('Migration complete!');
});
```

## Support

For issues with:
- **Upstash**: https://upstash.com/docs
- **Vercel**: https://vercel.com/docs
- **This project**: Check GitHub Issues

## Alternative Storage Solutions

If you prefer not to use Upstash, you can also use:

1. **Vercel Postgres** - PostgreSQL database
2. **Supabase** - Open source Firebase alternative
3. **PlanetScale** - MySQL database
4. **MongoDB Atlas** - NoSQL database

Each requires different setup but the concept is the same.
