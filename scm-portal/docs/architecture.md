# SCM Portal Architecture Document

## Technology Stack

### Core Framework
- **Next.js 14** (App Router) - Modern React framework with server components
- **TypeScript** - Type safety and better developer experience
- **React 18** - UI library with concurrent features

### State Management & Data Fetching
- **TanStack Query (React Query)** - Server state management, caching, and synchronization
- **Zustand** - Client state management for UI state (modals, forms, filters)
- **React Hook Form** - Form state management and validation
- **Zod** - Schema validation for forms and API responses

### UI Components & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible React components built on Radix UI
- **Lucide React** - Icon library
- **Recharts** - Charting library for dashboard

### Testing
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing
- **Playwright** - E2E testing
- **MSW (Mock Service Worker)** - API mocking for tests

### Build & Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript Compiler** - Type checking
- **Git** - Version control

## Application Architecture

### Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │   Layouts    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Custom Hooks │  │  Features    │  │  Services    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       Data Access Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ API Clients  │  │  React Query │  │  Schemas     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    External APIs (Backend)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ User API     │  │ Dealer API   │  │ Plans API    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

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
│   │   └── layout.tsx
│   ├── api/                      # API routes (if needed)
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── shared/                   # Shared components
│   │   ├── tables/
│   │   ├── forms/
│   │   ├── modals/
│   │   └── feedback/
│   └── features/                 # Feature-specific components
│       ├── dashboard/
│       ├── users/
│       ├── dealers/
│       ├── commissions/
│       └── plans/
├── lib/
│   ├── api/                      # API clients
│   │   ├── client.ts             # HTTP client
│   │   ├── user.api.ts
│   │   ├── dealer.api.ts
│   │   ├── commission.api.ts
│   │   ├── plan.api.ts
│   │   └── masterdata.api.ts
│   ├── hooks/                    # Custom hooks
│   │   ├── use-auth.ts
│   │   ├── use-otp.ts
│   │   ├── use-permissions.ts
│   │   └── use-masterdata.ts
│   ├── stores/                   # Zustand stores
│   │   ├── auth.store.ts
│   │   ├── ui.store.ts
│   │   └── permissions.store.ts
│   ├── schemas/                  # Zod schemas
│   │   ├── user.schema.ts
│   │   ├── dealer.schema.ts
│   │   ├── commission.schema.ts
│   │   └── plan.schema.ts
│   ├── utils/                    # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   └── types/                    # TypeScript types
│       ├── api.types.ts
│       ├── user.types.ts
│       ├── dealer.types.ts
│       └── commission.types.ts
├── features/                     # Feature modules
│   ├── dashboard/
│   ├── users/
│   ├── dealers/
│   ├── commissions/
│   └── plans/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── architecture.md
│   ├── api-mapping.md
│   ├── ai-prompts.md
│   └── decisions.md
├── public/
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

## Key Architectural Decisions

### 1. Component Architecture

#### Atomic Design Principles
- **Atoms**: Basic UI elements (buttons, inputs, labels)
- **Molecules**: Simple component combinations (form fields, search bars)
- **Organisms**: Complex UI sections (data tables, forms, modals)
- **Templates**: Page layouts
- **Pages**: Complete views

#### Reusable Component Strategy
Create reusable components for common patterns:
- `<DataTable />` - Generic data table with sorting, filtering, pagination
- `<SearchToolbar />` - Search and filter toolbar
- `<OTPVerificationModal />` - OTP verification workflow
- `<ZoneSelector />`, `<CircleSelector />`, `<SSASelector />` - Geographic selectors
- `<PermissionGuard />` - Permission-based component rendering
- `<ApiError />` - Error display component
- `<LoadingState />` - Loading state component
- `<StatusBadge />` - Status indicator

### 2. API Layer Architecture

#### HTTP Client
```typescript
// lib/api/client.ts
- Axios-based HTTP client
- Request/response interceptors
- Error handling
- Authentication token management
- Request logging
```

#### API Service Layer
```typescript
// lib/api/[module].api.ts
- Domain-specific API services
- Typed request/response interfaces
- React Query integration
- Error transformation
```

#### React Query Configuration
```typescript
- Global query client configuration
- Default retry logic
- Cache strategies
- Stale time configuration
- Optimistic updates
```

### 3. State Management Strategy

#### Server State (React Query)
- API data caching
- Automatic refetching
- Background updates
- Pagination and infinite scrolling
- Mutation handling

#### Client State (Zustand)
- UI state (modals, drawers, menus)
- Form state (multi-step forms)
- User session state
- Permission state
- Filter and search state

#### Form State (React Hook Form)
- Form validation
- Field-level validation
- Error handling
- Submission handling
- Dirty state tracking

### 4. Authentication & Authorization

#### Authentication Flow
1. Login form submission
2. API authentication
3. Token storage (secure HTTP-only cookies)
4. Session management
5. Token refresh

#### Authorization System
```typescript
// Permission-based access control
interface UserPermissions {
  dealerPermissions: boolean;
  walletPermissions: boolean;
  userPermissions: boolean;
  commissionPermissions: boolean;
  plansNumberpermissions: boolean;
  reportsPermissions: boolean;
  // ... 30+ permission flags
}

// Permission Guard Component
<PermissionGuard permission="commissionPermissions">
  <CommissionConfiguration />
</PermissionGuard>
```

#### Route Protection
- Middleware-based route protection
- Permission-based navigation
- Dynamic menu rendering based on permissions

### 5. OTP Workflow Architecture

#### OTP State Machine
```typescript
enum OtpState {
  IDLE = 'idle',
  SENDING = 'sending',
  SENT = 'sent',
  VALIDATING = 'validating',
  VALIDATED = 'validated',
  FAILED = 'failed'
}
```

#### OTP Hook
```typescript
useOtpVerification({
  msisdn: string,
  operation: string,
  topic: string,
  onSuccess: () => void,
  onError: (error) => void
})
```

#### OTP Workflow Integration
- Send OTP → Validate OTP → Execute Mutation pattern
- Resend OTP functionality
- Countdown timer
- Error handling and retry logic

### 6. Error Handling Strategy

#### API Error Handling
- Centralized error interceptor
- Error classification (network, validation, business logic)
- User-friendly error messages
- Error logging and monitoring

#### UI Error States
- Global error boundary
- Component-level error boundaries
- API error display components
- Retry mechanisms

#### Form Error Handling
- Field-level validation errors
- Form-level validation errors
- API submission errors
- Inline error display

### 7. Responsive Design Strategy

#### Breakpoint Strategy
```css
/* Mobile First Approach */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Laptop */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large desktop */
```

#### Component Adaptation
- Mobile-first component design
- Progressive enhancement
- Touch-friendly interfaces
- Adaptive layouts

#### Navigation Adaptation
- Desktop: Sidebar navigation
- Tablet: Collapsible sidebar
- Mobile: Bottom navigation or hamburger menu

### 8. Testing Strategy

#### Unit Testing
- Utility functions
- Custom hooks
- Validation schemas
- API client functions
- Component logic

#### Integration Testing
- API integration with React Query
- Form submission workflows
- OTP verification flows
- Permission-based rendering

#### E2E Testing
- Critical business journeys:
  1. User creation journey
  2. Commission configuration journey
  3. Plan management journey
- Cross-browser testing
- Mobile responsiveness testing

#### Test Organization
```
tests/
├── unit/
│   ├── utils/
│   ├── hooks/
│   └── schemas/
├── integration/
│   ├── api/
│   ├── features/
│   └── workflows/
└── e2e/
    ├── user-creation.spec.ts
    ├── commission-config.spec.ts
    └── plan-management.spec.ts
```

### 9. Performance Optimization

#### Code Splitting
- Route-based code splitting
- Component lazy loading
- Dynamic imports

#### Data Fetching Optimization
- React Query caching
- Selective data fetching
- Pagination and infinite scrolling
- Optimistic updates

#### Rendering Optimization
- React.memo for expensive components
- useCallback and useMemo
- Virtual scrolling for large lists
- Image optimization

### 10. Security Considerations

#### Data Security
- Secure HTTP-only cookies for authentication
- CSRF protection
- XSS prevention
- Input sanitization

#### API Security
- Request validation
- Rate limiting
- Secure headers
- Environment variable management

#### Permission Security
- Server-side permission validation
- Client-side permission enforcement
- Role-based access control
- Audit logging

## Feature Module Structure

Each feature module follows this structure:

```
features/[module-name]/
├── components/           # Feature-specific components
├── hooks/               # Feature-specific hooks
├── services/            # Feature-specific services
├── types/               # Feature-specific types
├── constants/           # Feature-specific constants
├── utils/               # Feature-specific utilities
└── index.ts             # Feature exports
```

## Development Workflow

### AI-Native Development Process

1. **Requirement Analysis**
   - Analyze API contracts
   - Identify business modules
   - Define feature boundaries

2. **Architecture Design**
   - Component architecture
   - API service architecture
   - State management strategy
   - Error handling strategy

3. **UI/UX Design**
   - Information architecture
   - Navigation structure
   - Component hierarchy
   - Responsive behavior

4. **Implementation**
   - API service layer
   - Reusable components
   - Feature modules
   - Integration

5. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests
   - Validation

6. **Documentation**
   - Architecture documentation
   - API mapping
   - AI prompt log
   - README

## Environment Configuration

### Environment Variables
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
NEXT_PUBLIC_ENABLE_MOCK_API=false
NEXT_PUBLIC_OTP_RESEND_SECONDS=30
```

## Deployment Strategy

### Build Process
- TypeScript compilation
- Code optimization
- Asset optimization
- Environment-specific builds

### Deployment Targets
- Development: Local development server
- Staging: Preview deployments
- Production: Optimized production build

### CI/CD Pipeline
- Automated testing
- Code quality checks
- Security scanning
- Automated deployment

## Monitoring & Observability

### Performance Monitoring
- Page load times
- API response times
- Component render times
- User interaction metrics

### Error Monitoring
- JavaScript errors
- API errors
- Network errors
- User-reported issues

### User Analytics
- Feature usage
- User flows
- Conversion rates
- Error rates