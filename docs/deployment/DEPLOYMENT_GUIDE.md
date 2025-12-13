# Global Anti-CCP Resistance Hub - Deployment Guide

## Overview

This guide provides complete instructions for deploying the Global Anti-CCP Resistance Hub platform to production. The platform is a comprehensive resistance coordination center built with React, Vite, and Tailwind CSS.

## Platform Features

The platform includes 8 core sections:

1. **Dashboard** - Real-time coordination center with statistics and quick actions
2. **Intelligence Feeds** - Live RSS feeds from verified sources (ICIJ, ASPI, RFA, HKFP)
3. **Resistance Directory** - Database of 50+ verified resistance organizations
4. **Campaign Hubs** - 6 active campaigns with progress tracking
5. **Community Support** - Mutual aid network with volunteers and support requests
6. **Secure Communications** - E2E encrypted communication channels
7. **Education Center** - 8 training modules and downloadable resources
8. **Security Center** - Security assessment tools and emergency procedures

## System Requirements

- Node.js 18+ (currently using 22.13.0)
- npm or pnpm (currently using pnpm)
- Modern web server (nginx, Apache, or Node.js)
- HTTPS support recommended

## Build Instructions

### 1. Install Dependencies

```bash
cd global-anti-ccp-resistance-hub
npm install
# or
pnpm install
```

### 2. Development Build

```bash
npm run dev
# or
pnpm dev
```

The development server will start at `http://localhost:5173`

### 3. Production Build

```bash
npm run build
# or
pnpm build
```

This creates an optimized production build in the `dist/` directory.

**Build Output:**
- HTML: 0.47 kB (gzipped: 0.30 kB)
- CSS: 1.61 kB (gzipped: 0.84 kB)
- JavaScript: 485.62 kB (gzipped: 141.75 kB)
- Total: ~142 kB gzipped

### 4. Preview Production Build

```bash
npm run preview
# or
pnpm preview
```

## Deployment Options

### Option 1: Manus Platform (Recommended)

The platform is currently deployed at: `https://jgpmcmbd.manus.space`

To deploy updates:

```bash
# Build the project
npm run build

# Deploy using Manus deployment system
# (Follow your organization's deployment procedures)
```

### Option 2: Static Hosting (Netlify, Vercel, GitHub Pages)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your hosting provider

3. **Configure routing** to serve `index.html` for all routes (required for React Router)

**Netlify Configuration Example:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:22-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Build and run:

```bash
docker build -t global-resistance-hub .
docker run -p 80:80 global-resistance-hub
```

### Option 4: Node.js Server

Create `server.js`:

```javascript
import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Serve static files
app.use(express.static(join(__dirname, 'dist')))

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
```

Run:

```bash
npm run build
node server.js
```

## Environment Configuration

### Development Environment

Create `.env.development`:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_ENVIRONMENT=development
```

### Production Environment

Create `.env.production`:

```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_ENVIRONMENT=production
```

## Security Considerations

### HTTPS

Always use HTTPS in production. Obtain an SSL certificate from:
- Let's Encrypt (free)
- AWS Certificate Manager
- Your hosting provider

### Content Security Policy

Add CSP headers to prevent XSS attacks:

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https:;";
```

### Security Headers

Add these headers to your web server:

```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

## Performance Optimization

### Caching Strategy

```nginx
# Cache static assets for 1 year
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 365d;
    add_header Cache-Control "public, immutable";
}

# Don't cache HTML files
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

### Compression

Enable gzip compression in nginx:

```nginx
gzip on;
gzip_types text/plain text/css text/javascript application/javascript application/json;
gzip_min_length 1000;
```

## Monitoring & Logging

### Application Monitoring

Monitor these metrics:
- Page load time
- Error rate
- User engagement
- Campaign participation
- Security alerts

### Log Configuration

```nginx
access_log /var/log/nginx/access.log combined;
error_log /var/log/nginx/error.log warn;
```

## Backup & Recovery

### Database Backup

If using a database, implement regular backups:

```bash
# Daily backup script
0 2 * * * /usr/local/bin/backup-database.sh
```

### Code Backup

Keep git repository up to date:

```bash
git push origin main
```

## Troubleshooting

### Build Fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Routes Not Working

Ensure your web server is configured to serve `index.html` for all routes.

### Styles Not Loading

Check that CSS files are being served with correct MIME type:

```nginx
types {
    text/css css;
}
```

### Performance Issues

1. Check bundle size: `npm run build` and review output
2. Enable gzip compression
3. Implement caching headers
4. Use CDN for static assets

## Rollback Procedures

### Rollback to Previous Version

```bash
# View deployment history
git log --oneline

# Checkout previous version
git checkout <commit-hash>

# Rebuild and redeploy
npm run build
# Deploy new build
```

## Maintenance

### Regular Updates

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update major versions (carefully)
npm install -g npm-check-updates
ncu -u
npm install
```

### Health Checks

Implement health check endpoint:

```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() })
})
```

Monitor: `curl https://yourdomain.com/health`

## Support & Documentation

- **GitHub Repository:** https://github.com/Stan2032/global-anti-ccp-resistance-hub
- **Issue Tracking:** GitHub Issues
- **Documentation:** See README.md in project root

## Version Information

- **Platform Version:** 1.0.0
- **Node.js:** 22.13.0
- **React:** 19.2.0
- **Vite:** 7.2.6
- **Tailwind CSS:** 3.4.1

## Deployment Checklist

Before deploying to production:

- [ ] Run `npm run build` successfully
- [ ] Test production build locally with `npm run preview`
- [ ] Verify all 8 sections are functional
- [ ] Check responsive design on mobile
- [ ] Verify external links work
- [ ] Test navigation between all pages
- [ ] Confirm security headers are configured
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure backups
- [ ] Create rollback plan
- [ ] Document deployment procedures
- [ ] Brief team on deployment
- [ ] Deploy to staging first
- [ ] Verify staging deployment
- [ ] Deploy to production
- [ ] Monitor production for errors
- [ ] Celebrate successful deployment! 🎉

## Post-Deployment

After successful deployment:

1. Monitor application for errors
2. Check analytics and user engagement
3. Gather user feedback
4. Plan next features
5. Schedule regular maintenance
6. Keep dependencies updated

---

**Last Updated:** December 3, 2025  
**Status:** Production Ready  
**Deployment Approved:** ✅
