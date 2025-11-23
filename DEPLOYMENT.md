# Deployment Guide

This guide will help you deploy the AI Reasoning App to Vercel and other platforms.

## Prerequisites

- A GitHub account with this repository
- API keys from AI providers:
  - **OpenAI API Key**: Required for chat, search, and tasks endpoints
    - Get it from: https://platform.openai.com/api-keys
  - **DeepSeek API Key**: Optional, only needed if using DeepSeek R1 model
    - Get it from: https://platform.deepseek.com/

## Deploying to Vercel (Recommended)

### Step 1: Push Your Code to GitHub

Make sure all your changes are committed and pushed to your GitHub repository.

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Import Project to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign in with your GitHub account
3. Click "Add New..." → "Project"
4. Select this repository from the list
5. Click "Import"

### Step 3: Configure Environment Variables

In the Vercel project configuration screen:

1. Expand "Environment Variables" section
2. Add the following variables:

   ```
   Name: OPENAI_API_KEY
   Value: your_openai_api_key_here
   ```

   If you want to use DeepSeek models, also add:
   ```
   Name: DEEPSEEK_API_KEY
   Value: your_deepseek_api_key_here
   ```

3. Make sure these are available for **Production**, **Preview**, and **Development** environments

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the deployment to complete (usually 2-3 minutes)
3. Once deployed, click on your deployment URL to test the app

### Step 5: Test Your Deployment

1. Open your deployed app URL
2. Try sending a message in the chat interface
3. Switch between models (GPT-4o and DeepSeek R1)
4. Verify that responses are streaming correctly

## Deploying to Other Platforms

### Netlify

1. Go to [Netlify](https://netlify.com)
2. Import your GitHub repository
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables in Site settings → Environment variables
5. Deploy

### Railway

1. Go to [Railway](https://railway.app)
2. Create a new project from your GitHub repository
3. Add environment variables in the Variables tab
4. Railway will automatically detect Next.js and deploy

### Self-Hosted (Docker)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t ai-reasoning-app .
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=your_key \
  -e DEEPSEEK_API_KEY=your_key \
  ai-reasoning-app
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key for GPT-4o model |
| `DEEPSEEK_API_KEY` | No | DeepSeek API key for DeepSeek R1 model |

## Troubleshooting

### Build Fails

- **Error**: "Module not found"
  - Solution: Run `npm install` locally and ensure package-lock.json is committed
  
- **Error**: "TypeScript compilation failed"
  - Solution: Run `npm run build` locally to identify the issue

### API Errors in Production

- **Error**: "API key is invalid"
  - Solution: Verify your API keys are correctly set in environment variables
  - Make sure there are no extra spaces or quotes around the keys

- **Error**: "Model not found"
  - Solution: Ensure you're using the correct model names:
    - OpenAI: `gpt-4o`, `gpt-3.5-turbo`
    - DeepSeek: `deepseek-r1`, `deepseek-chat`

### Styling Issues

- **Problem**: Colors not displaying correctly
  - Solution: Clear browser cache and reload
  - The app uses OKLCH color space which requires modern browsers

### Performance Issues

- **Problem**: Slow response times
  - Solution: Check your API provider's rate limits
  - Consider implementing caching or rate limiting

## Monitoring and Logs

### Vercel

- Access logs in your Vercel dashboard under the "Logs" tab
- Monitor performance in the "Analytics" tab

### General Tips

- Enable error tracking (Sentry, Rollbar, etc.)
- Monitor API usage to avoid unexpected costs
- Set up alerts for error rates

## Security Best Practices

1. **Never commit API keys** to your repository
2. **Rotate API keys** regularly
3. **Set up rate limiting** to prevent abuse
4. **Monitor API usage** for unusual activity
5. **Use environment-specific keys** (different keys for dev/staging/production)

## Getting Help

If you encounter issues:

1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Review [Vercel AI SDK docs](https://ai-sdk.dev)
3. Open an issue in this repository
4. Check API provider status pages:
   - OpenAI: https://status.openai.com
   - DeepSeek: https://status.deepseek.com

## Updates and Maintenance

To update your deployment:

1. Make changes locally
2. Test with `npm run build` and `npm run dev`
3. Commit and push to GitHub
4. Vercel will automatically deploy the changes

For manual deployments:
```bash
vercel --prod
```

## Cost Estimates

- **Vercel**: Free tier available, $20/month for Pro
- **OpenAI API**: Pay-as-you-go, ~$0.03 per 1K tokens for GPT-4o
- **DeepSeek API**: Check current pricing at platform.deepseek.com

Monitor your usage to avoid unexpected costs!
