# Architecture Decisions

## Mock API layer for local development and tests

**Decision:** Enable mock responses when `NEXT_PUBLIC_ENABLE_MOCK_API=true`.

**Why:** The Postman collection targets external services that are unavailable in hackathon/local environments. Mock mode keeps OTP, master data, and mutation flows testable without a live backend.

**Trade-off:** Production deployments must set the flag to `false` and provide real API URLs.

## OTP as a reusable workflow

**Decision:** Centralize OTP send/validate in `masterdata.api.ts` and expose a `useOtp` hook plus `OTPVerificationModal`.

**Why:** Most write operations share the same two-step OTP contract from the Postman collection.

## Permission-based navigation

**Decision:** Use Zustand auth store permissions and a `PermissionGuard` component for module visibility.

**Why:** The user creation API exposes 30+ permission flags that must drive navigation and feature access.

## Next.js App Router with feature pages

**Decision:** Organize routes under `app/(dashboard)/` by business module instead of a large single-page app.

**Why:** Matches the API module boundaries (users, dealers, commissions, plans) and keeps OTP-protected forms isolated per route.

## Testing strategy

**Decision:** Vitest for unit/component/integration tests; Playwright for seven end-to-end journeys (create + edit flows).

**Why:** Aligns with the hackathon rubric and validates OTP-gated flows closest to real user behavior.

**Coverage:** Form schemas, permission logic, OTP state machine, API response helpers, reusable components (OTP modal, DataTable, SearchToolbar, PermissionGuard), integration flows for user/commission creation and commission edit, and E2E journeys for user, commission, and plan create/edit paths.
