# Global Anti-CCP Resistance Hub

**A comprehensive coordination platform for global anti-CCP activism**

[![Production](https://img.shields.io/badge/status-production-green)](https://ccp-prop-bnzskb.manus.space)
[![Tests](https://img.shields.io/badge/tests-37%2F37%20passing-brightgreen)](#testing)
[![License](https://img.shields.io/badge/license-MIT-blue)](#license)

---

## Overview

The Global Anti-CCP Resistance Hub is a professional web platform that serves as a central coordination center for global anti-CCP activism. It provides educational tools, secure communications, intelligence feeds, campaign coordination, and community support features for activists, journalists, and organizations worldwide.

**Live Platform:** https://ccp-prop-bnzskb.manus.space

---

## Features

### 🎯 Core Functionality

1. **Dashboard** - Command center with real-time statistics and quick actions
2. **Intelligence Feeds** - Live RSS feeds from verified sources (ICIJ, ASPI, Radio Free Asia, Hong Kong Free Press)
3. **Resistance Directory** - Database of 50+ verified organizations across 89 countries
4. **Active Campaigns** - Campaign coordination hub with progress tracking
5. **Community Support** - Mutual aid network with 8,734+ members
6. **Secure Communications** - End-to-end encrypted channels (planned)
7. **Education Center** - Training modules and resource library
8. **Security Center** - Security assessment tools and privacy protection resources

### ✨ Key Capabilities

- **Real Data Integration** - Live intelligence feeds from trusted sources
- **Professional Design** - Clean, modern UI optimized for usability
- **Mobile Responsive** - Works seamlessly on all devices
- **Security Focused** - Built with activist protection in mind
- **Scalable Architecture** - Ready for growth and expansion

---

## Project Structure

```
/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── server.js          # Main entry point
│   │   ├── db/                # Database layer
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API endpoints
│   │   ├── validators/        # Input validation
│   │   ├── utils/             # Utilities
│   │   └── tests/             # Test suites
│   ├── scripts/               # Setup and maintenance scripts
│   └── README.md              # Backend documentation
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── App.jsx            # Main app component
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   └── data/              # Static data
│   ├── dist/                  # Production build
│   └── README.md              # Frontend documentation
│
├── docs/                       # Documentation
│   ├── architecture/          # System design
│   ├── project-management/    # Planning and tracking
│   ├── research/              # Research findings
│   ├── strategy/              # Strategic planning
│   └── deployment/            # Deployment guides
│
└── README.md                   # This file
```

---

## Technology Stack

### Backend
- **Runtime:** Node.js 22.13.0
- **Framework:** Express.js 4.21.2
- **Database:** PostgreSQL 14+
- **Caching:** PostgreSQL UNLOGGED tables
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** Joi
- **Testing:** Jest
- **Logging:** Winston

### Frontend
- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.6
- **Styling:** Tailwind CSS 3.4.1
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router

### Infrastructure
- **Version Control:** Git + GitHub
- **Deployment:** Manus Platform
- **CI/CD:** GitHub Actions (planned)

---

## Getting Started

### Prerequisites
- Node.js 22.x or higher
- PostgreSQL 14 or higher
- npm or pnpm

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run migrate

# Start development server
npm run dev

# Run tests
npm test
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Full Stack Development

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Backend runs on `http://localhost:3000`  
Frontend runs on `http://localhost:5173`

---

## Testing

### Backend Tests
```bash
cd backend
npm test
```

**Test Coverage:**
- Authentication: 17/17 tests passing ✅
- Cache: 20/20 tests passing ✅
- **Total: 37/37 tests passing (100%)**

### Frontend Tests
```bash
cd frontend
npm test
```

---

## Documentation

Comprehensive documentation is available in the `/docs/` directory:

### Architecture
- [Database Schema](docs/architecture/DATABASE_SCHEMA.md) - Complete database design
- [API Specification](docs/architecture/API_SPECIFICATION.md) - REST API endpoints
- [Security Architecture](docs/architecture/SECURITY_ARCHITECTURE.md) - Security controls
- [Technology Stack](docs/architecture/TECHNOLOGY_STACK.md) - Tech decisions

### Project Management
- [Master Todo List](docs/project-management/MASTER_TODO_LIST.md) - 127 tasks roadmap
- [Implementation Roadmap](docs/project-management/IMPLEMENTATION_ROADMAP.md) - Phase-by-phase plan
- [Functional Audit](docs/project-management/FUNCTIONAL_AUDIT_FINDINGS.md) - Audit results
- [Work Completed](docs/project-management/WORK_COMPLETED_SUMMARY.md) - Progress summary

### Research
- [Caching Research](docs/research/CACHING_RESEARCH.md) - Caching technology analysis
- [Organizations Research](docs/research/ORGANIZATIONS_RESEARCH.md) - Resistance organizations
- [Organizations Database](docs/research/ORGANIZATIONS_DATABASE.md) - Organization data

### Strategy
- [Strategic Plan](docs/strategy/STRATEGIC_PLAN.md) - Overall strategy
- [Design Decisions](docs/strategy/DESIGN_DECISIONS.md) - UI/UX decisions

### Deployment
- [Deployment Guide](docs/deployment/DEPLOYMENT_GUIDE.md) - How to deploy

---

## Current Status

### ✅ Completed (Phase 0-1)

**Backend Infrastructure:**
- Express server with middleware stack
- PostgreSQL database with 17 tables
- Authentication system (JWT, bcrypt)
- PostgreSQL caching system
- Email service integration
- Comprehensive error handling
- Request logging
- Input validation
- 37/37 tests passing

**Frontend:**
- 8 core sections implemented
- Professional design system
- Mobile responsive
- Real RSS feed integration
- 50+ verified organizations
- 6 active campaigns
- Consistent UI/UX

### 🚧 In Progress (Phase 2)

- User profile management
- User settings endpoints
- Admin user management
- Notification system

### 📋 Planned (Phases 3-14)

- Real-time updates (WebSocket)
- Live statistics calculation
- Organizations & Campaigns CRUD
- Community features
- Education modules
- Search functionality
- File management
- Admin panel
- Analytics dashboard
- Production deployment

**Estimated Remaining Work:** 498 hours (~12-15 weeks)

See [Master Todo List](docs/project-management/MASTER_TODO_LIST.md) for complete roadmap.

---

## Contributing

This is a private project for global anti-CCP resistance coordination. If you'd like to contribute:

1. Review the [Master Todo List](docs/project-management/MASTER_TODO_LIST.md)
2. Check the [Implementation Roadmap](docs/project-management/IMPLEMENTATION_ROADMAP.md)
3. Follow the coding standards in existing code
4. Write tests for new features
5. Update documentation

---

## Security

This platform is designed for activist protection. Security considerations:

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs with cost 12
- **HTTPS Only** - All production traffic encrypted
- **CORS Protection** - Configured origins only
- **Rate Limiting** - Prevent abuse
- **Input Validation** - All inputs sanitized
- **Audit Logging** - Security events tracked

For security concerns, please contact the maintainers privately.

---

## License

MIT License - See LICENSE file for details

---

## Acknowledgments

Built for activists, journalists, and organizations fighting for freedom and human rights worldwide.

**Special Thanks:**
- Hong Kong Democracy Council
- World Uyghur Congress
- Students for a Free Tibet
- Taiwan Foundation for Democracy
- Campaign for Uyghurs
- All resistance organizations and activists

---

## Links

- **Live Platform:** https://ccp-prop-bnzskb.manus.space
- **GitHub Repository:** https://github.com/Stan2032/global-anti-ccp-resistance-hub
- **Documentation:** [/docs/](docs/)

---

**Made with ❤️ for global freedom and human rights**

**Last Updated:** December 11, 2024
