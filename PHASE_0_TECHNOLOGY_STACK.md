# Phase 0: Technology Stack & Real-Time Architecture
**Resistance Hub Redesigned - Complete Technology Selection**  
**Created:** December 3, 2025  
**Status:** Design Phase - Ready for Implementation

---

## Overview

This document defines the complete technology stack for the resistance-hub-redesigned platform, optimized for:

- **Scalability** - Handle millions of users
- **Reliability** - 99.9% uptime
- **Security** - Enterprise-grade protection
- **Performance** - Sub-second response times
- **Developer Experience** - Easy to develop and maintain
- **Cost Efficiency** - Reasonable infrastructure costs

---

## 1. Backend Stack

### 1.1 Runtime & Framework

**Node.js + Express.js**

```javascript
// Why Node.js?
- JavaScript everywhere (frontend and backend)
- Non-blocking I/O (handles many concurrent connections)
- Large ecosystem (npm packages)
- Good performance for I/O-bound applications
- Easy to scale horizontally

// Why Express.js?
- Lightweight and flexible
- Excellent middleware ecosystem
- Industry standard for Node.js APIs
- Easy to understand and maintain
- Good documentation
```

**Versions:**
- Node.js: 18+ (LTS)
- Express.js: 4.18+

**Alternative Considered:** Python/FastAPI, Go/Gin
- Rejected because team expertise is in JavaScript

### 1.2 Database

**Primary: PostgreSQL 14+**

```sql
-- Why PostgreSQL?
- ACID compliance (data integrity)
- Advanced features (JSON, arrays, full-text search)
- Row-level security (for privacy)
- Excellent performance
- Open source and free
- Great for relational data

-- Why not?
- MySQL: Less advanced features
- MongoDB: Not suitable for relational data
- DynamoDB: Vendor lock-in, expensive
```

**Configuration:**
- Primary database: PostgreSQL 14+
- Replication: Streaming replication to standby
- Backups: Daily automated backups, 30-day retention
- Connection pooling: PgBouncer (100 connections per server)

**Caching: Redis 7+**

```javascript
// Why Redis?
- In-memory data store (very fast)
- Supports multiple data structures
- Pub/Sub for real-time features
- Session storage
- Cache layer for database queries
- Excellent for rate limiting

// Use Cases:
- Session storage
- Cache for frequently accessed data
- Real-time notifications
- Message queues
- Rate limiting
- Leaderboards
```

**Configuration:**
- Redis Cluster for high availability
- 16GB RAM per node
- Persistence: RDB snapshots + AOF
- Replication: Master-slave setup

### 1.3 Message Queue

**Bull (Redis-backed Job Queue)**

```javascript
// Why Bull?
- Built on Redis (fast)
- Reliable job processing
- Retry logic
- Job scheduling
- Excellent for background tasks

// Use Cases:
- Email sending
- Notification delivery
- Data processing
- Report generation
- Feed aggregation
```

**Alternative: RabbitMQ**
- More complex setup
- Better for very high throughput
- Rejected for now (can upgrade later)

### 1.4 Search Engine

**PostgreSQL Full-Text Search (Initially)**

```sql
-- Why PostgreSQL FTS?
- Built-in (no separate service)
- Good enough for platform size
- Easy to implement
- No additional infrastructure

-- Upgrade Path:
- Elasticsearch for very large scale
- Algolia for managed search
```

**Upgrade to Elasticsearch (Future)**

```javascript
// When to upgrade?
- Platform reaches 100k+ documents
- Need advanced search features
- Need real-time search suggestions
- Need faceted search
```

---

## 2. Frontend Stack

### 2.1 Framework & Build Tool

**React 18+ with Vite**

```javascript
// Why React?
- Component-based architecture
- Large ecosystem
- Good performance
- Easy to maintain
- Team expertise

// Why Vite?
- Fast build times
- Fast HMR (hot module replacement)
- Optimized production builds
- Modern tooling
- Better than Webpack
```

**Versions:**
- React: 18+
- Vite: 5+
- TypeScript: 5+

### 2.2 Styling

**Tailwind CSS 3+**

```javascript
// Why Tailwind?
- Utility-first approach
- Fast development
- Small bundle size
- Easy customization
- Good for responsive design
```

### 2.3 UI Components

**Radix UI + Headless UI**

```javascript
// Why Radix UI?
- Unstyled, accessible components
- Full control over styling
- Good for custom designs
- Excellent documentation

// Components to Use:
- Dialog
- Dropdown Menu
- Tabs
- Popover
- Toast
- Tooltip
```

### 2.4 State Management

**TanStack Query (React Query) + Zustand**

```javascript
// TanStack Query for Server State
- Fetching data from API
- Caching
- Synchronization
- Background updates

// Zustand for Client State
- User preferences
- UI state
- Simple and lightweight
- Better than Redux for this use case
```

### 2.5 Real-Time Communication

**Socket.IO**

```javascript
// Why Socket.IO?
- WebSocket with fallbacks
- Automatic reconnection
- Rooms and namespaces
- Broadcasting
- Excellent for real-time features

// Use Cases:
- Real-time notifications
- Live messaging
- Presence indicators
- Live updates
```

---

## 3. Real-Time Architecture

### 3.1 WebSocket Server

**Socket.IO Server**

```javascript
// Server Setup
const io = require('socket.io')(server, {
  cors: { origin: '*' },
  transports: ['websocket', 'polling']
});

// Namespace for different features
io.of('/notifications').on('connection', (socket) => {
  socket.on('subscribe', (userId) => {
    socket.join(`user_${userId}`);
  });
});

io.of('/messages').on('connection', (socket) => {
  socket.on('send_message', (data) => {
    io.of('/messages').to(`channel_${data.channelId}`).emit('new_message', data);
  });
});

io.of('/campaigns').on('connection', (socket) => {
  socket.on('subscribe', (campaignId) => {
    socket.join(`campaign_${campaignId}`);
  });
});
```

**Client Setup**

```javascript
// React Hook for Socket.IO
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function useSocket(namespace) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`http://localhost:3000${namespace}`);
    setSocket(newSocket);

    return () => newSocket.close();
  }, [namespace]);

  return socket;
}

// Usage
function NotificationCenter() {
  const socket = useSocket('/notifications');

  useEffect(() => {
    if (!socket) return;

    socket.emit('subscribe', userId);
    socket.on('notification', (data) => {
      // Handle notification
    });
  }, [socket]);

  return <div>Notifications</div>;
}
```

### 3.2 Pub/Sub with Redis

**Redis Pub/Sub for Server-to-Server Communication**

```javascript
// Publisher
const redis = require('redis');
const publisher = redis.createClient();

app.post('/campaigns/:id/update', async (req, res) => {
  const campaign = await updateCampaign(req.params.id, req.body);
  
  // Publish to all servers
  publisher.publish('campaign_updates', JSON.stringify({
    campaignId: campaign.id,
    update: campaign
  }));
  
  res.json(campaign);
});

// Subscriber (on each server)
const subscriber = redis.createClient();
subscriber.subscribe('campaign_updates', (message) => {
  const { campaignId, update } = JSON.parse(message);
  
  // Broadcast to connected clients
  io.of('/campaigns').to(`campaign_${campaignId}`).emit('update', update);
});
```

### 3.3 Message Queue for Background Jobs

**Bull Job Queue**

```javascript
const Queue = require('bull');

// Email queue
const emailQueue = new Queue('emails', {
  redis: { host: 'localhost', port: 6379 }
});

// Add job to queue
emailQueue.add(
  { to: 'user@example.com', template: 'welcome' },
  { delay: 5000, attempts: 3 }
);

// Process jobs
emailQueue.process(async (job) => {
  await sendEmail(job.data);
});

// Handle completion
emailQueue.on('completed', (job) => {
  console.log(`Email sent to ${job.data.to}`);
});

// Handle failure
emailQueue.on('failed', (job, err) => {
  console.log(`Email failed: ${err.message}`);
});
```

---

## 4. Infrastructure & Deployment

### 4.1 Containerization

**Docker**

```dockerfile
# Dockerfile for Node.js API
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
```

**Docker Compose for Development**

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/resistancehub
      REDIS_URL: redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: resistancehub
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### 4.2 Orchestration

**Kubernetes (For Scale)**

```yaml
# Kubernetes Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: resistancehub-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: resistancehub-api
  template:
    metadata:
      labels:
        app: resistancehub-api
    spec:
      containers:
      - name: api
        image: resistancehub/api:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        - name: REDIS_URL
          value: redis://redis-service:6379
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

### 4.3 Hosting Options

**Option 1: Heroku (Simple, Managed)**
- Pros: Easy deployment, managed infrastructure
- Cons: Higher cost, less control
- Cost: $50-500/month

**Option 2: AWS (Flexible, Scalable)**
- EC2 for compute
- RDS for database
- ElastiCache for Redis
- S3 for file storage
- CloudFront for CDN
- Cost: $100-1000+/month

**Option 3: DigitalOcean (Balanced)**
- App Platform for API
- Managed PostgreSQL
- Managed Redis
- Spaces for file storage
- Cost: $50-300/month

**Option 4: Self-Hosted (Control, Complexity)**
- Bare metal or VPS
- Full control
- Requires ops expertise
- Cost: $50-500/month

**Recommendation:** Start with DigitalOcean App Platform, migrate to AWS/Kubernetes when needed

### 4.4 CI/CD Pipeline

**GitHub Actions**

```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
      redis:
        image: redis:7

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm test
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost/test
        REDIS_URL: redis://localhost:6379
    
    - name: Build
      run: npm run build
    
    - name: Deploy to staging
      if: github.ref == 'refs/heads/develop'
      run: npm run deploy:staging
    
    - name: Deploy to production
      if: github.ref == 'refs/heads/main'
      run: npm run deploy:production
```

---

## 5. Development Tools

### 5.1 Code Quality

**ESLint + Prettier**

```javascript
// .eslintrc.json
{
  "extends": ["eslint:recommended", "prettier"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error"
  }
}

// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### 5.2 Testing

**Jest + Supertest**

```javascript
// Example test
describe('POST /auth/login', () => {
  it('should return token on successful login', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'user@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('accessToken');
  });
});
```

### 5.3 API Documentation

**Swagger/OpenAPI**

```javascript
// Swagger setup
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Resistance Hub API',
      version: '1.0.0'
    },
    servers: [
      { url: 'http://localhost:3000/api/v1' }
    ]
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
```

---

## 6. Monitoring & Analytics

### 6.1 Application Performance Monitoring

**New Relic or DataDog**

```javascript
// New Relic setup
require('newrelic');

// Automatic monitoring of:
- Response times
- Error rates
- Database queries
- External API calls
- Memory usage
- CPU usage
```

### 6.2 Error Tracking

**Sentry**

```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
});

app.use(Sentry.Handlers.errorHandler());
```

### 6.3 Logging

**Winston**

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('User logged in', { userId: 123 });
logger.error('Database error', { error: err.message });
```

---

## 7. Security Tools

### 7.1 Dependency Scanning

**Snyk**

```bash
# Scan for vulnerabilities
snyk test

# Fix vulnerabilities
snyk fix

# Monitor continuously
snyk monitor
```

### 7.2 Static Code Analysis

**SonarQube**

```bash
# Run analysis
sonar-scanner \
  -Dsonar.projectKey=resistancehub \
  -Dsonar.sources=src \
  -Dsonar.host.url=http://sonarqube:9000
```

---

## 8. Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Node.js | 18+ | JavaScript runtime |
| **Framework** | Express.js | 4.18+ | Web framework |
| **Database** | PostgreSQL | 14+ | Primary database |
| **Cache** | Redis | 7+ | Caching & sessions |
| **Queue** | Bull | 4+ | Background jobs |
| **Frontend** | React | 18+ | UI framework |
| **Build** | Vite | 5+ | Build tool |
| **Styling** | Tailwind CSS | 3+ | CSS framework |
| **Real-Time** | Socket.IO | 4+ | WebSocket library |
| **Testing** | Jest | 29+ | Testing framework |
| **Monitoring** | New Relic | Latest | APM |
| **Error Tracking** | Sentry | Latest | Error tracking |
| **Logging** | Winston | 3+ | Logging |
| **Container** | Docker | Latest | Containerization |
| **Orchestration** | Kubernetes | 1.25+ | Container orchestration |
| **CI/CD** | GitHub Actions | Latest | Automation |

---

## 9. Development Environment Setup

**Required Tools:**
- Node.js 18+
- npm or yarn
- PostgreSQL 14+
- Redis 7+
- Docker & Docker Compose
- Git
- VS Code (recommended)

**Setup Commands:**

```bash
# Clone repository
git clone https://github.com/Stan2032/global-anti-ccp-resistance-hub.git
cd global-anti-ccp-resistance-hub

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start development services
docker-compose up -d

# Run migrations
npm run migrate

# Start development server
npm run dev

# Start frontend
cd frontend
npm run dev
```

---

## 10. Scalability Plan

### Phase 1 (0-10k users)
- Single server
- PostgreSQL with backups
- Redis for caching
- No need for Kubernetes

### Phase 2 (10k-100k users)
- Multiple API servers behind load balancer
- PostgreSQL replication
- Redis cluster
- CDN for static assets

### Phase 3 (100k-1M users)
- Kubernetes cluster
- Database sharding
- Elasticsearch for search
- Microservices architecture

### Phase 4 (1M+ users)
- Multi-region deployment
- Advanced caching strategies
- Database optimization
- Custom infrastructure

---

## Conclusion

This technology stack provides:

- ✅ Scalability from startup to enterprise
- ✅ Modern, well-supported technologies
- ✅ Good developer experience
- ✅ Strong security foundation
- ✅ Excellent performance
- ✅ Cost-effective infrastructure

The technology stack is ready for implementation in Phase 1.

---

**Status:** ✅ Design Complete - Ready for Implementation  
**Next Step:** Begin Phase 1 - Backend Infrastructure Setup
