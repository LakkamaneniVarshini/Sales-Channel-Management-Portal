import { plansApiClient, dbApiClient, franchiseApiClient } from './client';
import { isMockApiEnabled, MOCK_COMMISSIONS } from '@/lib/utils/mock-api';
import type {
  ApiResponse,
  Commission,
  SaveCommissionRequest,
  PostpaidCommissionRequest,
  LandlineCommissionRequest,
  SendOtpRequest,
  OtpResponse,
  Category,
  Circle,
  FranchiseAddBalanceTransaction,
  ApproveRejectBalanceRequest,
} from '../types/api.types';

// Prepaid Commission Operations
export type CommissionKind = 'prepaid-frc' | 'prepaid-otf' | 'postpaid' | 'landline';

export const addCommission = async (
  request: SaveCommissionRequest | PostpaidCommissionRequest | LandlineCommissionRequest,
  kind: CommissionKind
): Promise<unknown> => {
  if (isMockApiEnabled()) {
    return { commissionId: Date.now().toString(), ...request, kind };
  }
  const endpoint = kind === 'postpaid'
    ? '/scm-product-api/postpaidCommissionConfig'
    : kind === 'landline'
      ? '/scm-product-api/landlineCommissionConfig'
      : '/scm-product-api/saveCommissionConfig';
  const response = await plansApiClient.post<ApiResponse<any>>(
    endpoint,
    request
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Commission save failed');
  }
  return response.data.data;
};

export const saveCommissionConfig = async (request: SaveCommissionRequest): Promise<Commission> => {
  const response = await plansApiClient.post<ApiResponse<Commission>>(
    '/scm-product-api/saveCommissionConfig',
    request
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Commission save failed');
  }
  return response.data.data as Commission;
};

export const saveMultipleCommissionConfig = async (
  request: SaveCommissionRequest,
  zoneId: string
): Promise<Commission> => {
  const response = await plansApiClient.post<ApiResponse<Commission>>(
    `/scm-product-api/savemultipleCommissionConfig?zoneId=${zoneId}`,
    request
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Commission save failed');
  }
  return response.data.data as Commission;
};

export const fetchCommission = async (params: {
  denomination: string;
  circleId: string;
  categoryId: string;
  commissionType: string;
  username: string;
  dtype: string;
}): Promise<Commission[]> => {
  if (isMockApiEnabled()) {
    return MOCK_COMMISSIONS.filter(
      (item) =>
        (!params.denomination || item.denomination === params.denomination) &&
        (!params.circleId || item.circleId === params.circleId) &&
        (!params.categoryId || item.categoryId === params.categoryId)
    );
  }
  const response = await plansApiClient.get<ApiResponse<Commission[]>>(
    `/scm-product-api/fetchCommission?denomination=${params.denomination}&circleId=${params.circleId}&categoryId=${params.categoryId}&commissionType=${params.commissionType}&username=${params.username}&dtype=${params.dtype}`
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Failed to fetch commission');
  }
  return response.data.data || [];
};

export const fetchPrepaidOTFCommission = async (params: {
  denomination: string;
  circleId: string;
  categoryId: string;
  commissionType: string;
  username: string;
  dtype: string;
}): Promise<Commission[]> => {
  if (isMockApiEnabled()) {
    return MOCK_COMMISSIONS.map((item) => ({ ...item, dtype: 'OTF' }));
  }
  const response = await plansApiClient.get<ApiResponse<Commission[]>>(
    `/scm-product-api/fetchPrepaidOTFCommission?denomination=${params.denomination}&circleId=${params.circleId}&categoryId=${params.categoryId}&commissionType=${params.commissionType}&username=${params.username}&dtype=${params.dtype}`
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Failed to fetch OTF commission');
  }
  return response.data.data || [];
};

// Postpaid Commission Operations
export const postpaidCommissionConfig = async (
  request: PostpaidCommissionRequest
): Promise<any> => {
  const response = await plansApiClient.post<ApiResponse<any>>(
    '/scm-product-api/postpaidCommissionConfig',
    request
  );
  return response.data.data;
};

export const fetchPostpaidCommission = async (params: {
  circleId: string;
  category: string;
  sellerLevel: string;
  username: string;
}): Promise<any> => {
  if (isMockApiEnabled()) {
    return MOCK_COMMISSIONS;
  }
  const response = await plansApiClient.get<ApiResponse<any>>(
    `/scm-product-api/fetchPostpaidCommission?circleId=${params.circleId}&category=${params.category}&sellerLevel=${params.sellerLevel}&username=${params.username}`
  );
  return response.data.data;
};

// Landline Commission Operations
export const landlineCommissionConfig = async (
  request: LandlineCommissionRequest
): Promise<any> => {
  const response = await plansApiClient.post<ApiResponse<any>>(
    '/scm-product-api/landlineCommissionConfig',
    request
  );
  return response.data.data;
};

export const fetchLandlineCommission = async (request: {
  circleId: string;
  categoryId: string;
  fromAmount: string;
  toAmount: string;
  guiUsername: string;
}): Promise<any> => {
  if (isMockApiEnabled()) {
    return MOCK_COMMISSIONS;
  }
  const response = await plansApiClient.post<ApiResponse<any>>(
    '/scm-product-api/fetchLandlineCommission',
    request
  );
  return response.data.data;
};

// Commission Modification Operations
export const updateCommissionConfig = async (commissionId: string): Promise<any> => {
  if (isMockApiEnabled()) {
    return { commissionId, status: 'updated' };
  }
  const response = await plansApiClient.post<ApiResponse<any>>(
    '/scm-product-api/updateCommissionConfig',
    { commissionId }
  );
  return response.data.data;
};

export const updatePostpaidCommission = async (commissionId: string): Promise<any> => {
  if (isMockApiEnabled()) {
    return { commissionId, status: 'updated' };
  }
  const response = await plansApiClient.post<ApiResponse<any>>(
    '/scm-product-api/updatePostpaidCommission',
    { commissionId }
  );
  return response.data.data;
};

export const updateLandlineCommission = async (commissionId: string): Promise<any> => {
  if (isMockApiEnabled()) {
    return { commissionId, status: 'updated' };
  }
  const response = await plansApiClient.post<ApiResponse<any>>(
    '/scm-product-api/updateLandlineCommission',
    { commissionId }
  );
  return response.data.data;
};

export const deleteCommissionConfig = async (commissionId: string): Promise<any> => {
  const response = await plansApiClient.post<ApiResponse<any>>(
    `/scm-product-api/deleteCommissionConfig?commissionId=${commissionId}`
  );
  return response.data.data;
};

export const deletePostpaidCommission = async (commissionId: string): Promise<any> => {
  const response = await plansApiClient.post<ApiResponse<any>>(
    `/scm-product-api/deletePostpaidCommission?commissionId=${commissionId}`
  );
  return response.data.data;
};

export const deleteLandlineCommission = async (commissionId: string): Promise<any> => {
  const response = await plansApiClient.post<ApiResponse<any>>(
    `/scm-product-api/deleteLandlineCommission?commissionId=${commissionId}`
  );
  return response.data.data;
};

// Franchise Add Balance Operations
export const getFranchiseAddBalanceTransactions = async (
  circleId: string
): Promise<FranchiseAddBalanceTransaction[]> => {
  const response = await franchiseApiClient.get<ApiResponse<FranchiseAddBalanceTransaction[]>>(
    `/scm-franchise-gui/franchiseAddBalanceTransactions?circle=${circleId}`
  );
  return response.data.data || [];
};

export const approveFranchiseAddBalance = async (
  request: ApproveRejectBalanceRequest
): Promise<any> => {
  const response = await franchiseApiClient.post<ApiResponse<any>>(
    '/scm-franchise-gui/franchiseAddBalance/approve',
    request
  );
  return response.data.data;
};

export const rejectFranchiseAddBalance = async (
  request: ApproveRejectBalanceRequest
): Promise<any> => {
  const response = await franchiseApiClient.post<ApiResponse<any>>(
    '/scm-franchise-gui/franchiseAddBalance/reject',
    request
  );
  return response.data.data;
};

// OTP Operations for Commission Management
export const sendAddCommissionOtp = async (msisdn: string): Promise<any> => {
  const request: SendOtpRequest = {
    msisdn,
    operation: '10069',
    topic: 'AddCommission',
  };
  const response = await dbApiClient.post<ApiResponse<any>>(
    '/masterdata-db-api/sendOtp',
    request
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Failed to send OTP');
  }
  return response.data.data;
};

export const sendPrepaidFrcOtp = async (msisdn: string): Promise<OtpResponse> => {
  const { sendOtp } = await import('./masterdata.api');
  return sendOtp({ msisdn, operation: '10069', topic: 'PrepaidFrc' });
};

export const sendPrepaidOtfOtp = async (msisdn: string): Promise<OtpResponse> => {
  const { sendOtp } = await import('./masterdata.api');
  return sendOtp({ msisdn, operation: '10069', topic: 'PrepaidOtf' });
};

export const sendPostpaidOtp = async (msisdn: string): Promise<OtpResponse> => {
  const { sendOtp } = await import('./masterdata.api');
  return sendOtp({ msisdn, operation: '10069', topic: 'Postpaid' });
};

export const sendLandlineOtp = async (msisdn: string): Promise<OtpResponse> => {
  const { sendOtp } = await import('./masterdata.api');
  return sendOtp({ msisdn, operation: '10069', topic: 'Landline' });
};

export const sendModifyPrepaidFrcOtp = async (msisdn: string): Promise<OtpResponse> => {
  const { sendOtp } = await import('./masterdata.api');
  return sendOtp({ msisdn, operation: '10069', topic: 'Modify_PrepaidFRC' });
};

export const sendModifyPrepaidOtfOtp = async (msisdn: string): Promise<OtpResponse> => {
  const { sendOtp } = await import('./masterdata.api');
  return sendOtp({ msisdn, operation: '10069', topic: 'Modify_PrepaidOTF' });
};

export const sendModifyPostpaidOtp = async (msisdn: string): Promise<OtpResponse> => {
  const { sendOtp } = await import('./masterdata.api');
  return sendOtp({ msisdn, operation: '10069', topic: 'Modify_Postpaid' });
};

export const sendModifyLandlineOtp = async (msisdn: string): Promise<OtpResponse> => {
  const { sendOtp } = await import('./masterdata.api');
  return sendOtp({ msisdn, operation: '10069', topic: 'Modify_Landline' });
};

export const sendDeletePrepaidOtfOtp = async (msisdn: string): Promise<any> => {
  const request: SendOtpRequest = {
    msisdn,
    operation: '10069',
    topic: 'DeleteprepaidOtf',
  };
  const response = await dbApiClient.post<ApiResponse<any>>(
    '/masterdata-db-api/sendOtp',
    request
  );
  return response.data.data;
};

export const sendFranchiseAddBalanceApproveOtp = async (msisdn: string): Promise<any> => {
  const request: SendOtpRequest = {
    msisdn,
    operation: '10069',
    topic: 'FranchiseAddbalanceApprove',
  };
  const response = await dbApiClient.post<ApiResponse<any>>(
    '/masterdata-db-api/sendOtp',
    request
  );
  return response.data.data;
};

export const sendFranchiseAddBalanceRejectOtp = async (msisdn: string): Promise<any> => {
  const request: SendOtpRequest = {
    msisdn,
    operation: '10069',
    topic: 'FranchiseAddbalanceReject',
  };
  const response = await dbApiClient.post<ApiResponse<any>>(
    '/masterdata-db-api/sendOtp',
    request
  );
  return response.data.data;
};
