# SCM API Analysis

## API Domains Identified

Based on the Postman collection, the following API domains are identified:

### 1. Commission Configuration API
- **Base URL**: `https://ui.example.com/scm-plans-api/scm-product-api`
- **Operations**:
  - Prepaid FRC/OTF Commission configuration
  - Postpaid Commission configuration
  - Landline Commission configuration
  - Commission modification, search, and deletion
  - Multiple commission configuration (zone-based and all circulation)

### 2. User Management API
- **Base URL**: `https://ui.example.com/scm-user-api/scm-user-api`
- **Operations**:
  - User creation with extensive permissions
  - User search and modification
  - Permission management
  - Status management
  - Password change
  - Logout

### 3. Dealer Management API
- **Base URL**: `https://ui.example.com/scm-dealer-api/scm-dealer-api`
- **Operations**:
  - Dealer and franchise creation (multipart with file upload)
  - Dealer search and editing
  - Dealer hierarchy management
  - Status management
  - MPIN reset
  - Dealer tree/list views

### 4. Plan & Number Configuration API
- **Base URL**: `https://ui.example.com/scm-plans-api/scm-product-api` and `https://ui.example.com/scm-db-api/masterdata-db-api`
- **Operations**:
  - Plan CRUD operations
  - Denomination configuration
  - MNP configuration
  - Number series management

### 5. Master Data API
- **Base URL**: `https://ui.example.com/scm-db-api/masterdata-db-api`
- **Operations**:
  - OTP send/validate
  - Zones, Circles, SSAs management
  - Categories, Dealer types
  - Franchise/Sub-franchise lookup

### 6. Franchise Reports API
- **Base URL**: `https://ui.example.com/scmfmis-reports-api/scm-franchise-gui`
- **Operations**:
  - Franchise add balance transactions
  - Approve/reject balance requests

### 7. Wallet Management API
- **Base URL**: `https://ui.example.com/scm-stock-api/stock-api`
- **Operations**:
  - Wallet adjustments

## Key API Patterns

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

## Business Modules

### 1. Dashboard Module
- Aggregate statistics from all modules
- Recent activities
- Pending actions

### 2. User Management Module
- User CRUD operations
- Permission management (30+ permission flags)
- Status management
- Password management

### 3. Dealer Management Module
- Dealer/Franchise creation with document upload
- Dealer hierarchy tree
- Status management
- MPIN reset
- Search and filtering

### 4. Commission Configuration Module
- Prepaid FRC/OTF commissions
- Postpaid commissions
- Landline commissions
- Commission search and modification
- Zone-based bulk operations

### 5. Plan & Number Configuration Module
- Plan management
- Denomination configuration
- MNP management
- Number series management

## Permission Structure

The User Creation API includes 30+ permission flags:
- `dealerPermissions`, `walletPermissions`, `userPermissions`
- `commissionPermissions`, `plansNumberpermissions`, `reportsPermissions`
- `stockCheck`, `dealerMpinReset`, `franchiseAddBalance`
- `bulkRecharge`, `varepReports`, `userActivityReports`
- `dealerStatus`, `transactionStatus`, `topupReversal`
- `simSaleUpload`, `simInventory`, `pendingClearence`
- `inReconsilation`, `mobileApp`, `deferredCommission`
- `cbp`, `simUpgrade`, `mnp`, `frcStv`
- `bulk_purge`, `e_auction`, `denominations`
- `prepaidCommissions`, `postpaidCommissions`, `landlineCommissions`
- `FOSCreation`

## OTP Topics Identified

Different operations use different OTP topics:
- User operations: `UserCreation`, `Modifyuseredit`, `Modifyuserpermission`, `Modifyuserstatus`, `ChangePassword`
- Dealer operations: `Dealercreation`, `Modifydealer`, `DealerStatus`, `DealerHierarchyChange`, `DealerMpinreset`
- Commission operations: `PrepaidFrc`, `PrepaidOtf`, `Postpaid`, `Landline`, `Modify_PrepaidFRC`, `Modify_PrepaidOTF`, `Modify_Postpaid`, `Modify_Landline`, `DeleteprepaidOtf`
- Plan operations: `Addnewplan`, `Denominationconfiguration`, `ADD MNP`, `AddnumberSeries`, `Addplan`, `ModifyMnp`, `ModfifynumberSeries`, `DeleteNumberseries`, `DeleteMnp`
- Franchise operations: `FranchiseAddbalanceApprove`, `FranchiseAddbalanceReject`

## File Upload Requirements

Dealer/Franchise creation requires multipart form data with:
- `dealer`: JSON blob containing dealer information
- `certificate`: File upload for documentation

## Geographic Hierarchy

1. **Zone** (highest level)
2. **Circle** (regional level)
3. **SSA** (local level)

This hierarchy is used across multiple modules for filtering and configuration.