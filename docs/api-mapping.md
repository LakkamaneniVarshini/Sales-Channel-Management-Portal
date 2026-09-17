# SCM Portal API Mapping Documentation

This document provides a comprehensive mapping between UI screens and API endpoints, including HTTP methods, request parameters, and response structures.

## Dashboard Module

### Screen: Dashboard (`/dashboard`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Display metrics | Mock data | - | - | Metrics data |
| Recent activities | Mock data | - | - | Activity list |
| Quick actions | Navigation | - | - | - |

**Note**: Dashboard currently uses mock data. In production, these would call aggregation APIs.

---

## User Management Module

### Screen: User List (`/dashboard/users`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| User list | `getUser` | GET | `username` | `User` object |
| User search | `getUserWithHrmsId` | GET | `hrmsId, username, guiUsername` | `User` object |
| User status check | `userStatusCheck` | GET | `username` | Status data |
| Change user status | `changeUserStatus` | POST | `hrmsId, username, guiUsername, status` | Status update result |

### Screen: User Creation (`/dashboard/users/new`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Send OTP | `sendUserCreationOtp` | POST | `msisdn, operation, topic` | OTP response |
| Validate OTP | `validateOtp` | POST | `otp, operation, msisdn` | Validation result |
| Create user | `createUser` | POST | `CreateUserRequest` | Created `User` object |
| Get zones | `getZones` | GET | - | `Zone[]` |
| Get circles | `getCircles` | GET | - | `Circle[]` |
| Get zone-based circles | `getZoneBasedCircles` | GET | `zoneId` | `Circle[]` |
| Get SSAs | `getSSAs` | GET | `circleId` | `SSA[]` |
| Fetch username | `fetchUsername` | GET | `username` | Username availability |

### Screen: User Edit (`/dashboard/users/[id]`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Get user details | `getUser` | GET | `username` | `User` object |
| Send OTP | `sendModifyUserOtp` | POST | `msisdn, operation, topic` | OTP response |
| Validate OTP | `validateOtp` | POST | `otp, operation, msisdn` | Validation result |
| Modify user | `modifyUser` | POST | `username, hrmsId` | Updated `User` object |

### Screen: User Permissions (`/dashboard/users/[id]/permissions`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Get permissions | `getUserPermissions` | GET | `hrmsId, username, guiUsername` | `UserPermissions` object |
| Send OTP | `sendModifyPermissionOtp` | POST | `msisdn, operation, topic` | OTP response |
| Validate OTP | `validateOtp` | POST | `otp, operation, msisdn` | Validation result |
| Modify permissions | `modifyPermissions` | POST | `guiUser, username` | Permission update result |

### Screen: Change Password (`/dashboard/settings`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Send OTP | `sendChangePasswordOtp` | POST | `msisdn, operation, topic` | OTP response |
| Validate OTP | `validateOtp` | POST | `otp, operation, msisdn` | Validation result |
| Change password | `changePassword` | POST | `ChangePasswordRequest` | Password change result |

---

## Dealer Management Module

### Screen: Dealer List (`/dashboard/dealers`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Dealer list | `getDealerList` | GET | `msisdn, username` | Dealer hierarchy |
| Fetch dealer | `fetchDealer` | GET | `mobile, guiUsername` | `Dealer` object |
| Dealer status check | `dealerStatusCheck` | GET | `msisdn` | Status data |
| Check by PAN | `checkDealerByPan` | GET | `panId` | PAN check result |
| Check by Aadhaar | `checkDealerByAadhar` | GET | `aadharId` | Aadhaar check result |

### Screen: Dealer Creation (`/dashboard/dealers/new`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Send OTP | `sendDealerCreationOtp` | POST | `msisdn, operation, topic` | OTP response |
| Validate OTP | `validateOtp` | POST | `otp, operation, msisdn` | Validation result |
| Create dealer | `createDealer` | POST | `CreateDealerRequest + certificate file` | Created `Dealer` object |
| Get circles | `getCircles` | GET | - | `Circle[]` |
| Get SSAs | `getSSAs` | GET | `circleId` | `SSA[]` |
| Get dealer types | `getDealerType` | GET | - | `DealerType[]` |
| Get categories | `getCategory` | GET | - | `Category[]` |
| Get category by dealer | `getCategoryByDealer` | GET | `dealerType` | `Category[]` |
| Get franchise | `getFranchise` | GET | `msisdn` | Franchise data |
| Get sub-franchise | `getSubFranchise` | GET | `msisdn` | Sub-franchise data |

### Screen: Dealer Edit (`/dashboard/dealers/[id]`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Get dealer data | `fetchDealerData` | GET | `msisdn, guiUsername` | `Dealer` object |
| Send OTP | `sendModifyDealerOtp` | POST | `msisdn, operation, topic` | OTP response |
| Validate OTP | `validateOtp` | POST | `otp, operation, msisdn` | Validation result |
| Update dealer | `updateDealer` | POST | `dealer data` | Updated `Dealer` object |

### Screen: Dealer Status (`/dashboard/dealers/[id]/status`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Send OTP | `sendDealerStatusOtp` | POST | `msisdn, operation, topic` | OTP response |
| Validate OTP | `validateOtp` | POST | `otp, operation, msisdn` | Validation result |
| Change status | `changeDealerStatus` | POST | `msisdn, username, status` | Status change result |
| Purge dealer | `purgeDealer` | POST | `msisdn, username` | Purge result |

### Screen: Dealer Hierarchy (`/dashboard/dealers/[id]/hierarchy`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Get dealer tree | `getDealerList` | GET | `msisdn, username` | Dealer hierarchy |
| Get source dealer | `getDealerWithMobile` | GET | `msisdn, guiUsername` | `Dealer` object |
| Get dest dealer | `getDealerWithMobile` | GET | `msisdn, guiUsername` | `Dealer` object |
| Send OTP | `sendDealerHierarchyChangeOtp` | POST | `msisdn, operation, topic` | OTP response |
| Validate OTP | `validateOtp` | POST | `otp, operation, msisdn` | Validation result |
| Change hierarchy | `changeDealerHierarchy` | POST | `srcMsisdn, parentMsisdn, guiUsername, type` | Hierarchy change result |

### Screen: MPIN Reset (`/dashboard/dealers/[id]/mpin`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Send OTP | `sendDealerMpinResetOtp` | POST | `msisdn, operation, topic` | OTP response |
| Validate OTP | `validateOtp` | POST | `otp, operation, msisdn` | Validation result |
| Reset MPIN | `resetDealerMpin` | PUT | `msisdn, username` | MPIN reset result |

---

## Commission Configuration Module

### Screen: Commission List (`/dashboard/commissions`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Get categories | `getCategory` | GET | - | `Category[]` |
| Fetch prepaid FRC | `fetchCommission` | GET | `denomination, circleId, categoryId, commissionType, username, dtype` | `Commission[]` |
| Fetch prepaid OTF | `fetchPrepaidOTFCommission` | GET | `denomination, circleId, categoryId, commissionType, username, dtype` | `Commission[]` |
| Fetch postpaid | `fetchPostpaidCommission` | GET | `circleId, category, sellerLevel, username` | Postpaid commissions |
| Fetch landline | `fetchLandlineCommission` | POST | `circleId, categoryId, fromAmount, toAmount, guiUsername` | Landline commissions |

### Screen: Prepaid FRC Commission (`/dashboard/commissions/prepaid-frc`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Get categories | `getCategory` | GET | - | `Category[]` |
| Get circles | `getCirclesInfo` | GET | `hrmsId` | `Circle[]` |
| Get zone-based circles | `getZoneBasedCircles` | GET | `zoneId` | `Circle[]` |
| Send OTP | `sendPrepaidFrcOtp` | POST | `msisdn, operation, topic` | OTP response |
| Validate OTP | `validateOtp` | POST | `otp, operation, msisdn` | Validation result |
| Save commission | `saveCommissionConfig` | POST | `SaveCommissionRequest` | Created `Commission` object |
| Save multiple (all) | `saveMultipleCommissionConfig` | POST | `SaveCommissionRequest + zoneId=0` | Created `Commission` object |
| Save multiple (zone) | `saveMultipleCommissionConfig` | POST | `SaveCommissionRequest + zoneId` | Created `Commission` object |

### Screen: Prepaid OTF Commission (`/dashboard/commissions/prepaid-otf`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Get categories | `getCategory` | GET | - | `Category[]` |
| Get circles | `getCirclesInfo` | GET | `hrmsId` | `Circle[]` |
| Get zone-based circles | `getZoneBasedCircles` | GET | `zoneId` | `Circle[]` |
| Send OTP | `sendPrepaidOtfOtp` | POST | `msisdn, operation, topic` | OTP response |
| Validate OTP | `validateOtp` | POST | `otp, operation, msisdn` | Validation result |
| Save commission | `saveCommissionConfig` | POST | `SaveCommissionRequest` | Created `Commission` object |

### Screen: Postpaid Commission (`/dashboard/commissions/postpaid`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Get categories | `getCategory` | GET | - | `Category[]` |
| Get circles | `getCirclesInfo` | GET | `hrmsId` | `Circle[]` |
| Get zone-based circles | `getZoneBasedCircles` | GET | `zoneId` | `Circle[]` |
| Send OTP | `sendPostpaidOtp` | POST | `msisdn, operation, topic` | OTP response |
| Validate OTP | `validateOtp` | POST | `otp, operation, msisdn` | Validation result |
| Save commission | `postpaidCommissionConfig` | POST | `PostpaidCommissionRequest` | Created commission object |

### Screen: Landline Commission (`/dashboard/commissions/landline`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Get categories | `getCategory` | GET | - | `Category[]` |
| Get circles | `getCirclesInfo` | GET | `hrmsId` | `Circle[]` |
| Get zone-based circles | `getZoneBasedCircles` | GET | `zoneId` | `Circle[]` |
| Send OTP | `sendLandlineOtp` | POST | `msisdn, operation, topic` | OTP response |
| Validate OTP | `validateOtp` | POST | `otp, operation, msisdn` | Validation result |
| Save commission | `landlineCommissionConfig` | POST | `LandlineCommissionRequest` | Created commission object |

### Screen: Commission Edit (`/dashboard/commissions/[id]/edit`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Send OTP (FRC) | `sendModifyPrepaidFrcOtp` | POST | `msisdn, operation, topic` | OTP response |
| Send OTP (OTF) | `sendModifyPrepaidOtfOtp` | POST | `msisdn, operation, topic` | OTP response |
| Send OTP (Postpaid) | `sendModifyPostpaidOtp` | POST | `msisdn, operation, topic` | OTP response |
| Send OTP (Landline) | `sendModifyLandlineOtp` | POST | `msisdn, operation, topic` | OTP response |
| Validate OTP | `validateOtp` | POST | `otp, operation, msisdn` | Validation result |
| Update commission | `updateCommissionConfig` | POST | `commissionId` | Update result |
| Update postpaid | `updatePostpaidCommission` | POST | `commissionId` | Update result |
| Update landline | `updateLandlineCommission` | POST | `commissionId` | Update result |

### Screen: Commission Delete (`/dashboard/commissions/[id]/delete`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Send OTP (OTF) | `sendDeletePrepaidOtfOtp` | POST | `msisdn, operation, topic` | OTP response |
| Validate OTP | `validateOtp` | POST | `otp, operation, msisdn` | Validation result |
| Delete commission | `deleteCommissionConfig` | POST | `commissionId` | Delete result |
| Delete postpaid | `deletePostpaidCommission` | POST | `commissionId` | Delete result |
| Delete landline | `deleteLandlineCommission` | POST | `commissionId` | Delete result |

### Screen: Franchise Add Balance (`/dashboard/commissions/franchise-balance`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Get transactions | `getFranchiseAddBalanceTransactions` | GET | `circleId` | `FranchiseAddBalanceTransaction[]` |
| Send OTP (approve) | `sendFranchiseAddBalanceApproveOtp` | POST | `msisdn, operation, topic` | OTP response |
| Send OTP (reject) | `sendFranchiseAddBalanceRejectOtp` | POST | `msisdn, operation, topic` | OTP response |
| Validate OTP | `validateOtp` | POST | `otp, operation, msisdn` | Validation result |
| Approve balance | `approveFranchiseAddBalance` | POST | `ApproveRejectBalanceRequest` | Approval result |
| Reject balance | `rejectFranchiseAddBalance` | POST | `ApproveRejectBalanceRequest` | Rejection result |

---

## Plan & Number Configuration Module

### Screen: Plan List (`/dashboard/plans`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Get plans | `getPlans` | GET | - | `Plan[]` |

### Screen: Plan Creation (`/dashboard/plans/new`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Send OTP | `sendAddPlanOtp` | POST | `msisdn, operation, topic` | OTP response |
| Validate OTP | `validateOtp` | POST | `otp, operation, msisdn` | Validation result |
| Add plan | `addPlan` | POST | `CreatePlanRequest + username` | Created `Plan` object |

### Screen: Plan Edit (`/dashboard/plans/[id]/edit`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Get plan | `getPlans` | GET | - | `Plan[]` |
| Update plan | `updatePlan` | PUT | `sno + plan data + username` | Updated `Plan` object |

### Screen: Plan Delete (`/dashboard/plans/[id]/delete`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Delete plan | `deletePlan` | DELETE | `sno + username` | Delete result |

### Screen: Denomination Configuration (`/dashboard/plans/denominations`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Fetch recharge plan | `fetchRechargePlan` | GET | `price, circleId, planType` | `Denomination[]` |
| Send OTP | `sendDenominationConfigurationOtp` | POST | `msisdn, operation, topic` | OTP response |
| Validate OTP | `validateOtp` | POST | `otp, operation, msisdn` | Validation result |
| Save denomination | `saveDenomination` | POST | `SaveDenominationRequest` | Created `Denomination` object |
| Save multiple (all) | `saveMultipleDenominations` | POST | `SaveDenominationRequest + zoneId=0` | Created `Denomination` object |
| Save multiple (zone) | `saveMultipleDenominations` | POST | `SaveDenominationRequest + zoneId` | Created `Denomination` object |

### Screen: MNP Configuration (`/dashboard/plans/mnp`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Find MNP data | `findMnpData` | GET | `msisdn, username` | MNP data |
| Send OTP | `sendAddMnpOtp` | POST | `msisdn, operation, topic` | OTP response |
| Validate OTP | `validateOtp` | POST | `otp, operation, msisdn` | Validation result |
| Save MNP | `saveMnp` | POST | `SaveMNPRequest` | Created MNP object |
| Send OTP (modify) | `sendModifyMnpOtp` | POST | `msisdn, operation, topic` | OTP response |
| Modify MNP | `modifyMnpData` | POST | `SaveMNPRequest` | Updated MNP object |
| Send OTP (delete) | `sendDeleteMnpOtp` | POST | `msisdn, operation, topic` | OTP response |
| Delete MNP | `deleteMnp` | POST | `msisdn, username` | Delete result |

### Screen: Number Series Configuration (`/dashboard/plans/number-series`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Get number series | `getNumberSeries` | GET | `username, series` | Number series data |
| Send OTP | `sendAddNumberSeriesOtp` | POST | `msisdn, operation, topic` | OTP response |
| Validate OTP | `validateOtp` | POST | `otp, operation, msisdn` | Validation result |
| Add number series | `addNumberSeries` | POST | `CreateNumberSeriesRequest + username` | Created number series |
| Send OTP (modify) | `sendModifyNumberSeriesOtp` | POST | `msisdn, operation, topic` | OTP response |
| Edit number series | `editNumberSeries` | PUT | `number series data + username` | Updated number series |
| Send OTP (delete) | `sendDeleteNumberSeriesOtp` | POST | `msisdn, operation, topic` | OTP response |
| Purge number series | `purgeNumberSeries` | DELETE | `username, series` | Delete result |

---

## Authentication Module

### Screen: Login (`/login`)

| Feature | API | HTTP Method | Request | Response |
|---------|-----|-------------|---------|----------|
| Login | `login` | POST | `username, password` | Auth token + user data |
| Logout | `logout` | GET | `username` | Logout result |

---

## Common API Patterns

### OTP Workflow Pattern
Most write operations follow this pattern:
1. **Send OTP** → `POST /masterdata-db-api/sendOtp` with `{ msisdn, operation, topic }`
2. **Validate OTP** → `POST /masterdata-db-api/validateOtp?otp={otp}&operation={operation}&msisdn={msisdn}`
3. **Execute Mutation** → Perform the actual operation

### Master Data Dependencies
Common hierarchical pattern:
- **Zones** → **Circles** → **SSAs**
- **Dealer Types** → **Categories**
- **Circles** → **Franchise/Sub-franchise**

### Response Structure
All APIs follow a consistent response pattern:
```json
{
  "status": "success|error",
  "message": "description",
  "data": { ... }
}
```

---

## API Base URLs

| Service | Base URL | Environment Variable |
|---------|----------|---------------------|
| User API | `https://ui.example.com/scm-user-api` | `NEXT_PUBLIC_USER_API_URL` |
| Database API | `https://ui.example.com/scm-db-api` | `NEXT_PUBLIC_DB_API_URL` |
| Plans API | `https://ui.example.com/scm-plans-api` | `NEXT_PUBLIC_PLANS_API_URL` |
| Dealer API | `https://ui.example.com/scm-dealer-api` | `NEXT_PUBLIC_DEALER_API_URL` |
| Franchise API | `https://ui.example.com/scmfmis-reports-api` | `NEXT_PUBLIC_FRANCHISE_API_URL` |
| Stock API | `https://ui.example.com/scm-stock-api` | `NEXT_PUBLIC_STOCK_API_URL` |

---

## Error Handling

### Common Error Codes
- **401**: Unauthorized - token expired or invalid
- **403**: Forbidden - insufficient permissions
- **404**: Not found - resource doesn't exist
- **422**: Validation error - invalid request data
- **500**: Server error - internal server error

### Error Response Format
```json
{
  "status": "error",
  "message": "Error description",
  "data": {
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

---

## Notes

- All OTP operations use operation code `10069`
- Different operations use different `topic` values for OTP verification
- File uploads use `multipart/form-data` content type
- Geographic selectors (Zone → Circle → SSA) must be used in sequence
- Permission checks should be performed both client-side and server-side
- All write operations should be protected by OTP verification in production