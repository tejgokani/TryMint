# Deployment Guide

This guide covers deploying the TRYMINT frontend application.

## Prerequisites

- Node.js 18+ installed
- npm 9+ installed
- Access to hosting platform

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Environment Variables

Set these environment variables in your hosting platform:

- `VITE_API_URL` - Backend API URL (e.g., `https://api.trymint.io/v1`)
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID (optional)
- `VITE_SESSION_TIMEOUT` - Session timeout in milliseconds (default: 7200000)

## Deployment Options

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Set environment variables in Vercel dashboard

### Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Build: `npm run build`
3. Deploy: `netlify deploy --prod --dir=dist`
4. Set environment variables in Netlify dashboard

### GitHub Pages

1. Install gh-pages: `npm install -D gh-pages`
2. Add to package.json:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```
3. Run: `npm run deploy`

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Post-Deployment Checklist

- [ ] Verify all routes work
- [ ] Check API connectivity
- [ ] Test authentication flow
- [ ] Verify environment variables
- [ ] Check console for errors
- [ ] Test on multiple browsers
- [ ] Verify mobile responsiveness
- [ ] Check performance metrics

## Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Clear node_modules and reinstall
- Check for syntax errors

### API Connection Issues
- Verify `VITE_API_URL` is set correctly
- Check CORS settings on backend
- Verify network connectivity

### Routing Issues
- Configure redirect rules for SPA
- Ensure all routes redirect to index.html
