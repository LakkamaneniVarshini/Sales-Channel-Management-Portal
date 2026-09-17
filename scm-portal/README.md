# SCM Portal - Sales Channel Management

A production-quality responsive web application for the Sales Channel Management (SCM) system, built with AI-driven development methodology.

## 🚀 Features

- **Dashboard**: Comprehensive overview with metrics, recent activities, and quick actions
- **User Management**: Create, edit, and manage users with 30+ permission flags
- **Dealer Management**: Manage dealers, franchises, and hierarchy with MPIN reset functionality
- **Commission Configuration**: Configure Prepaid FRC/OTF, Postpaid, and Landline commissions
- **Plan & Number Configuration**: Manage plans, denominations, MNP, and number series
- **OTP Workflow**: Secure two-step verification for all write operations
- **Permission-Based Access**: Role-based access control with 30+ permission flags
- **Responsive Design**: Optimized for desktop, laptop, tablet, and mobile devices

## 🛠️ Technology Stack

### Core Framework
- **Next.js 16** (App Router) - Modern React framework with server components
- **TypeScript** - Type safety and better developer experience
- **React 19** - UI library with concurrent features

### State Management & Data Fetching
- **TanStack Query (React Query)** - Server state management, caching, and synchronization
- **Zustand** - Client state management for UI state
- **React Hook Form** - Form state management and validation
- **Zod** - Schema validation for forms and API responses

### UI Components & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible React components
- **Lucide React** - Icon library
- **Recharts** - Charting library for dashboard

### Testing
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing
- **Playwright** - E2E testing
- **MSW (Mock Service Worker)** - API mocking for tests

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Sales-Channel-Management-Portal/scm-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.config.example .env.local
   ```

   Edit `.env.local` and configure the following variables:
   ```env
   # API Base URLs
   NEXT_PUBLIC_USER_API_URL=https://ui.example.com/scm-user-api
   NEXT_PUBLIC_DB_API_URL=https://ui.example.com/scm-db-api
   NEXT_PUBLIC_PLANS_API_URL=https://ui.example.com/scm-plans-api
   NEXT_PUBLIC_DEALER_API_URL=https://ui.example.com/scm-dealer-api
   NEXT_PUBLIC_FRANCHISE_API_URL=https://ui.example.com/scmfmis-reports-api
   NEXT_PUBLIC_STOCK_API_URL=https://ui.example.com/scm-stock-api

   # Application
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME=SCM Portal

   # Features
   NEXT_PUBLIC_ENABLE_MOCK_API=true
   NEXT_PUBLIC_OTP_RESEND_SECONDS=30
   ```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Component Tests
```bash
npm run test:component
```

### E2E Tests
```bash
npx playwright install chromium
npm run test:e2e
```

### Test with Coverage
```bash
npm run test:coverage
```

## 🏗️ Build Commands

### Development Build
```bash
npm run build
```

### Production Build
```bash
npm run build
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 🤖 AI Tools Used

This project was developed using an AI-native methodology with the following tools:

- **Claude Code** - Primary AI coding assistant for architecture, implementation, and testing
- **AI Prompt Engineering** - Structured prompt development for consistent, high-quality outputs
- **AI-Assisted Debugging** - Using AI to diagnose and fix issues during development

### AI Development Approach

The project follows the AI-native development methodology:
1. **Requirement Analysis** - AI-assisted API contract analysis
2. **Architecture Design** - AI-generated application architecture
3. **UI/UX Design** - AI-driven user experience design
4. **Implementation** - AI-generated code with human review
5. **Testing** - AI-generated unit, integration, and E2E tests
6. **Documentation** - AI-generated documentation and API mapping

For detailed AI prompts and development logs, see `docs/ai-prompts.md`.

## 📁 Project Structure

```
scm-portal/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (dashboard)/              # Dashboard route group
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── dealers/
│   │   ├── commissions/
│   │   ├── plans/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── ui/                       # UI components
│   ├── shared/                   # Shared components
│   │   ├── tables/
│   │   ├── forms/
│   │   ├── modals/
│   │   ├── selectors/
│   │   └── feedback/
│   └── features/                 # Feature-specific components
├── lib/
│   ├── api/                      # API clients
│   ├── hooks/                    # Custom hooks
│   ├── stores/                   # Zustand stores
│   ├── schemas/                  # Zod schemas
│   ├── types/                    # TypeScript types
│   └── utils/                    # Utility functions
├── docs/                         # Documentation
│   ├── architecture.md
│   ├── api-mapping.md
│   ├── ai-prompts.md
│   └── decisions.md
└── public/                       # Static assets
```

## 🔐 Authentication

The application uses a mock authentication system for demonstration purposes. In production, this would be replaced with a real authentication backend.

### Demo Credentials
- **Full access**: any username / any password (all sidebar modules visible)
- **Limited access**: username `limited` / any password (only Dashboard, Dealer Management, and Settings visible)

> Set `NEXT_PUBLIC_ENABLE_MOCK_API=true` in `.env.local` for local demo and test runs.

## 🎯 Key Features

### OTP Workflow
Most write operations require a two-step OTP verification:
1. Send OTP to registered mobile number
2. Enter OTP for verification
3. Execute the requested operation

### Permission System
The application includes 30+ permission flags for granular access control:
- `dealerPermissions`, `walletPermissions`, `userPermissions`
- `commissionPermissions`, `plansNumberpermissions`, `reportsPermissions`
- `stockCheck`, `dealerMpinReset`, `franchiseAddBalance`
- And many more...

### Geographic Hierarchy
The application follows a three-level geographic hierarchy:
- **Zone** (highest level)
- **Circle** (regional level)
- **SSA** (local level)

## ✅ Submission Readiness Checklist

Run these before submitting or demoing:

```bash
npm run type-check
npm run lint
npm run test -- --run
npm run build
npx playwright install chromium
npm run test:e2e
```

Expected status:
- TypeScript: passes
- Unit/component/integration tests: 54+ passing
- E2E (Chromium): 7 passing
- Production build: succeeds with mock API enabled

## 🐛 Known Limitations

1. **Mock Authentication**: Current implementation uses mock authentication. Real authentication backend integration required for production.
2. **Mock Data**: Dashboard and list views use mock data. Real API integration required for production.
3. **Permission Scope**: Sidebar navigation is permission-guarded; direct URL access to routes is not blocked yet.
4. **File Upload**: Dealer document upload functionality needs backend integration.
5. **OTP Integration**: OTP sending/validating uses mock implementation. Real SMS gateway integration required.
6. **Real-time Updates**: No real-time data updates implemented. WebSocket integration could be added for live data.
7. **Advanced Filtering**: Basic search and filtering implemented. Advanced filtering could be enhanced.
8. **Export Functionality**: Data export features not yet implemented.
9. **Audit Logging**: Comprehensive audit logging not yet implemented.

## 📝 Documentation

- **Architecture Document**: `docs/architecture.md` - Detailed system architecture and design decisions
- **API Mapping**: `docs/api-mapping.md` - Complete mapping between UI screens and API endpoints
- **AI Prompts**: `docs/ai-prompts.md` - AI prompts used during development and AI methodology
- **API Analysis**: `docs/api-analysis.md` - Analysis of the Postman collection and API contracts
- **Decisions**: `docs/decisions.md` - Key architecture and implementation decisions

## 🚦 Deployment

### Vercel Deployment
1. Push code to GitHub repository
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Docker Deployment
```bash
# Build Docker image
docker build -t scm-portal .

# Run container
docker run -p 3000:3000 scm-portal
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the AI-Native UI Developer Hackathon challenge.

## 🆘 Troubleshooting

### Common Issues

**Issue**: Dependencies installation fails
- **Solution**: Try using `--legacy-peer-deps` flag: `npm install --legacy-peer-deps`

**Issue**: Build fails with TypeScript errors
- **Solution**: Run `npm run type-check` to identify specific type errors

**Issue**: API calls fail in development
- **Solution**: Ensure `.env.local` is configured with correct API URLs and `NEXT_PUBLIC_ENABLE_MOCK_API=true`

**Issue**: Tests fail
- **Solution**: Ensure all dependencies are installed and test environment is properly configured

### Getting Help

For issues related to:
- **API Integration**: Check `docs/api-mapping.md` for correct endpoint usage
- **Architecture**: Refer to `docs/architecture.md` for system design
- **AI Development**: See `docs/ai-prompts.md` for AI methodology

## 📞 Support

For support and questions:
- Check the documentation in the `docs/` folder
- Review the API mapping document for integration issues
- Refer to the architecture document for design questions

---

**Built with ❤️ using AI-Native Development Methodology**