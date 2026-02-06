# Quick Setup Guide - Upstash Redis Configuration

## ✅ Local Development - COMPLETED

Your local environment is now configured with Upstash Redis.

**Configuration file**: `.env.local` (already created)

**Test results**:
- ✅ GET /api/feedback/ - Working
- ✅ POST /api/feedback/ - Working  
- ✅ Data persists in Upstash Redis
- ✅ Rate limiting (3 posts/day) - Working
- ✅ All features tested and verified

## 🚀 Production Deployment (Vercel) - ACTION REQUIRED

Your code has been pushed to GitHub. Vercel will auto-deploy, but you need to add environment variables.

### Option 1: Vercel Dashboard (Recommended)

1. Visit: https://vercel.com/dashboard
2. Select your project: **Journey-to-the-East**
3. Click: **Settings** → **Environment Variables**
4. Add these two variables:

```
Name: UPSTASH_REDIS_REST_URL
Value: https://romantic-toucan-47896.upstash.io

Name: UPSTASH_REDIS_REST_TOKEN
Value: AbsYAAIncDI5MjIxZjg1NWUyODU0MmIxOTRhNjQ2YWM3ODRhYTM3N3AyNDc4OTY
```

5. Click **Save** for each
6. Go to **Deployments** → Click **...** on latest → **Redeploy**

### Option 2: Vercel CLI

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Add environment variables
vercel env add UPSTASH_REDIS_REST_URL production
# Paste: https://romantic-toucan-47896.upstash.io

vercel env add UPSTASH_REDIS_REST_TOKEN production  
# Paste: AbsYAAIncDI5MjIxZjg1NWUyODU0MmIxOTRhNjQ2YWM3ODRhYTM3N3AyNDc4OTY

# Redeploy
vercel --prod
```

### Verification

After deployment:

1. Visit: https://journeytotheeast.vercel.app/
2. Scroll to the right panel (Reader Feedback)
3. Type a test message
4. Click **POST**
5. Should see: "Posted successfully!" ✅
6. Your message appears in the list below

### Check Upstash Console

View your data:
1. Go to: https://console.upstash.com/
2. Select your database: **romantic-toucan-47896**
3. Click **Data Browser**
4. Look for key: `feedback:posts`
5. You should see all posted feedback

## Security Notes

### ⚠️ Important

- `.env.local` is already in `.gitignore` - will NOT be committed
- Never share these credentials publicly
- Only add to Vercel environment variables (encrypted storage)
- If credentials are compromised, regenerate them in Upstash Console

### Environment Variable Scopes

When adding in Vercel, you can choose:
- **Production** - Only production deployments
- **Preview** - Preview deployments (pull requests)
- **Development** - Local development (optional)

Recommended: Add to **Production** and **Preview** scopes.

## Troubleshooting

### "Feedback service is not configured" error

**Cause**: Environment variables not set in Vercel

**Fix**:
1. Check Vercel → Settings → Environment Variables
2. Verify both variables are present
3. Redeploy the project

### Posts not showing up

**Cause**: Redis connection issue

**Fix**:
1. Check Upstash Console - is database active?
2. Verify credentials are exactly as shown above
3. Check Vercel function logs for errors

### Still having issues?

Check Vercel function logs:
1. Vercel Dashboard → Your Project
2. Click on latest deployment
3. Click **Functions** tab
4. Find `/api/feedback` function
5. Click to view logs

## Success Indicators

You'll know it's working when:
- ✅ No errors when posting feedback
- ✅ "Posted successfully!" message appears
- ✅ New posts show up in the feedback list immediately
- ✅ Data persists across page reloads
- ✅ Rate limiting works (3 posts max per day)

## Next Steps

Once Vercel is configured:
1. Test on production URL
2. Monitor Upstash request usage (should be minimal)
3. Encourage users to leave feedback!

---

**Status**: Local development ready ✅ | Production deployment pending ⏳

**Last updated**: 2026-02-06
