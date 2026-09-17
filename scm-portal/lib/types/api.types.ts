// API response types
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

// OTP types
export interface SendOtpRequest {
  msisdn: string;
  operation: string;
  topic: string;
}

export interface ValidateOtpRequest {
  otp: string;
  operation: string;
  msisdn: string;
}

export interface OtpResponse {
  status: string;
  message: string;
  data?: unknown;
}

// Master data types
export interface Zone {
  id: number;
  name: string;
  code?: string;
}

export interface Circle {
  id: number;
  name: string;
  zoneId: number;
  code?: string;
}

export interface SSA {
  id: number;
  name: string;
  circleId: number;
  code?: string;
}

export interface Category {
  id: number;
  name: string;
  code?: string;
}

export interface DealerType {
  id: number;
  name: string;
  code?: string;
}

// User types
export interface User {
  userId: string;
  hrmsId: string;
  username: string;
  mobileNumber: string;
  firstName: string;
  lastName: string;
  address: string;
  dob: string;
  roleId: number;
  roleName?: string;
  zoneId: number;
  circleId: number;
  ssaId: number;
  status: number;
  permissions?: UserPermissions;
  cdt: string;
  mdt: string;
  passwordChangeDate?: string;
  ipAddress?: string;
  userIpAddress?: string;
  expiredate?: string;
  loginStatus?: string;
}

export interface UserPermissions {
  roleId: number;
  username: string;
  hrmsId: string;
  roleName?: string;
  dealerPermissions: number;
  walletPermissions: number;
  userPermissions: number;
  commissionPermissions: number;
  plansNumberpermissions: number;
  reportsPermissions: number;
  stockCheck: number;
  dealerMpinReset: number;
  franchiseAddBalance: number;
  bulkRecharge: number;
  varepReports: number;
  userActivityReports: number;
  dealerStatus: number;
  transactionStatus: number;
  topupReversal: number;
  simSaleUpload: number;
  simInventory: number;
  pendingClearence: number;
  inReconsilation: number;
  mobileApp: number;
  deferredCommission: number;
  cbp: number;
  simUpgrade: number;
  mnp: number;
  frcStv: number;
  bulk_purge: number;
  e_auction: number;
  caf_postpaid?: number;
  denominations: number;
  prepaidCommissions: number;
  postpaidCommissions: number;
  landlineCommissions: number;
  FOSCreation: number;
}

export interface CreateUserRequest {
  userId: string;
  hrmsId: string;
  username: string;
  mobileNumber: string;
  createdBy: string;
  updatedBy?: string | null;
  firstName: string;
  lastName: string;
  address: string;
  status: number;
  cdt: string;
  mdt: string;
  roleId: number;
  passwordChangeDate?: string;
  ssaId: number;
  circleId: number;
  dob: string;
  password: string;
  ipAddress?: string;
  expiredate?: string;
  userIpAddress?: string;
  loginStatus?: string;
  zoneId: number;
  roleName?: string | null;
  permissions: UserPermissions;
}

export interface ChangePasswordRequest {
  hrmsId: string;
  username: string;
  oldPassword: string;
  newPassword: string;
  operation: string;
}

// Dealer types
export interface Dealer {
  dealerId: string;
  dealerCode: string;
  scmMsisdn: string;
  firstName: string;
  lastName: string;
  mobile: string;
  dob: string;
  address: string;
  pincode: string;
  emailId?: string;
  dealerType: string;
  circleId: number;
  ssaId: number;
  category: string;
  franchiseMsisdn?: string;
  subFranchiseMsisdn?: string;
  gstNumber?: string;
  panId?: string;
  aadhaarId?: string;
  status?: number;
  tds?: string;
  tdsCategory?: string;
  panFromDate?: string;
  panToDate?: string;
  houseNumber?: string;
  iccidNumber?: string;
  createdBy?: string;
  cdt?: string;
  mdt?: string;
}

export interface CreateDealerRequest {
  firstName: string;
  lastName: string;
  mobile: string;
  scmMsisdn: string;
  dob: string;
  address: string;
  pincode: string;
  emailId?: string;
  dealerType: string;
  circleId: number;
  ssaId: number;
  category: string;
  franchiseMsisdn?: string;
  subFranchiseMsisdn?: string;
  gstNumber?: string;
  panId?: string;
  aadhaarId?: string;
  tds?: string;
  tdsCategory?: string;
  panFromDate?: string;
  panToDate?: string;
  houseNumber?: string;
  iccidNumber?: string;
  createdBy: string;
}

// Commission types
export interface Commission {
  commissionId: string;
  masterCategoryId: string;
  categoryId: string;
  circleId: string;
  denomination: string;
  commissionType: string;
  dtype: string;
  sellerCommission: string;
  fraCommission: string;
  subCommission: string;
  tds: string;
  zoneId?: string;
  createdGuiUser?: string;
  cdt?: string;
  mdt?: string;
}

export interface SaveCommissionRequest {
  masterCategoryId: string;
  circleId: string;
  sellerCommission: string;
  fraCommission: string;
  subCommission: string;
  tds: string;
  denomination: string;
  categoryId: string;
  commissionType: string;
  dtype: string;
  createdGuiUser: string;
}

export interface PostpaidCommissionRequest {
  categoryId: string;
  circleId: string;
  tdsAmount: string;
  fraCommission: string;
  subFraCommission: number;
  actualCommission: string;
  retailerCommission: number;
  sellerLevel: string;
  cap_limit: string;
  createdGuiUser: string;
  zoneId: string;
}

export interface LandlineCommissionRequest {
  categoryId: string;
  circleId: string;
  tdsAmount: string;
  fraCommission: number;
  subFraCommission: number;
  retailerCommission: number;
  sellerLevel: string;
  commissionId: string;
  commissionAmount: string;
  fromAmount: string;
  toAmount: string;
  dtype: string;
  zoneId: string;
  createdGuiUser: string;
}

// Plan types
export interface Plan {
  sno: string;
  operator: string;
  denomination: string;
  talkvalue: string;
  country: string;
  start_date: string;
  end_date: string;
  type: string;
  description: string;
  tab_name: string;
  circle: string;
  validity: string;
  from_date: string;
  to_date: string;
  price?: string;
  createdBy?: string;
  cdt?: string;
  mdt?: string;
}

export interface CreatePlanRequest {
  operator: string;
  denomination: string;
  talkvalue: string;
  country: string;
  start_date: string;
  end_date: string;
  type: string;
  description: string;
  tab_name: string;
  circle: string;
  validity: string;
  from_date: string;
  to_date: string;
}

export interface Denomination {
  rechargePlanName: string;
  planType: string;
  price: string;
  createdBy: string;
  validity: string;
  description: string;
  bundleName?: string;
  bucketId?: string;
  faceValue?: string;
  netValue?: string;
  cardGroup?: string;
  varepDenom?: string;
  circleId?: string;
  vasDenom?: string;
  varepGroup?: string;
  sno?: string;
  cdt?: string;
  mdt?: string;
}

export interface SaveDenominationRequest {
  rechargePlanName: string;
  planType: string;
  price: string;
  createdBy: string;
  validity: string;
  description: string;
  bundleName?: string;
  bucketId?: string;
  faceValue?: string;
  netValue?: string;
  cardGroup?: string;
  varepDenom?: string;
  circleId?: string;
  vasDenom?: string;
  varepGroup?: string;
}

// MNP types
export interface MNP {
  msisdn: string;
  recipientNo: number;
  circleId: string;
  username: string;
  sno?: string;
  cdt?: string;
  mdt?: string;
}

export interface SaveMNPRequest {
  msisdn: string;
  recipientNo: number;
  circleId: string;
  username: string;
}

// Number Series types
export interface NumberSeries {
  numberSeries: string;
  numberSeriesId: string;
  circleId: string;
  zoneId?: string;
  seqNo?: string;
  inId?: string;
  username?: string;
  sno?: string;
  cdt?: string;
  mdt?: string;
}

export interface CreateNumberSeriesRequest {
  circleId: string;
  numberSeries: string;
  numberSeriesId: string;
  inId: number;
  username: string;
}

// Wallet types
export interface WalletAdjustmentRequest {
  dlr_msisdn: string;
  adjustment_type: number;
  adjustment_amount: number;
  wallet_type: number;
  gui_user: string;
  remarks: string;
}

// Franchise Add Balance types
export interface FranchiseAddBalanceTransaction {
  fabSeq: string;
  scmMsisdn: string;
  amount: number;
  adjustmentType: string;
  status: string;
  circleId: string;
  requestedBy: string;
  cdt: string;
  remarks?: string;
}

export interface ApproveRejectBalanceRequest {
  fabSeqList: string[];
  actionUser: string;
}