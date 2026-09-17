import { dealerApiClient, dbApiClient } from './client';
import { isMockApiEnabled } from '@/lib/utils/mock-api';
import type {
  ApiResponse,
  Dealer,
  CreateDealerRequest,
  SendOtpRequest,
  Circle,
  SSA,
  Category,
  DealerType,
} from '../types/api.types';

// Dealer Operations
export const createDealer = async (
  dealerData: CreateDealerRequest,
  certificate?: File
): Promise<Dealer> => {
  const formData = new FormData();
  formData.append('dealer', JSON.stringify(dealerData));
  if (certificate) {
    formData.append('certificate', certificate);
  }

  const response = await dealerApiClient.post<ApiResponse<Dealer>>(
    '/scm-dealer-api/createDealer',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Dealer creation failed');
  }
  return response.data.data as Dealer;
};

export const fetchDealer = async (mobile: string, guiUsername: string): Promise<Dealer> => {
  const response = await dealerApiClient.get<ApiResponse<Dealer>>(
    `/scm-dealer-api/fetchDealer?mobile=${mobile}&gui_username=${guiUsername}`
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Failed to fetch dealer');
  }
  return response.data.data as Dealer;
};

export const fetchDealerData = async (
  msisdn: string,
  guiUsername: string
): Promise<Dealer> => {
  const response = await dealerApiClient.get<ApiResponse<Dealer>>(
    `/scm-dealer-api/fetchDealerData?msisdn=${msisdn}&gui_username=${guiUsername}`
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Failed to fetch dealer data');
  }
  return response.data.data as Dealer;
};

export const updateDealer = async (request: any): Promise<Dealer> => {
  const response = await dealerApiClient.post<ApiResponse<Dealer>>(
    '/scm-dealer-api/updateDealer',
    request
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Failed to update dealer');
  }
  return response.data.data as Dealer;
};

export const checkDealerByPan = async (panId: string): Promise<any> => {
  const response = await dealerApiClient.get<ApiResponse<any>>(
    `/scm-dealer-api/checkDealerByPan?panId=${panId}`
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'PAN check failed');
  }
  return response.data.data;
};

export const checkDealerByAadhar = async (aadharId: string): Promise<any> => {
  const response = await dealerApiClient.get<ApiResponse<any>>(
    `/scm-dealer-api/checkDealerByAadhar?aadharId=${aadharId}`
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Aadhaar check failed');
  }
  return response.data.data;
};

// Dealer Tree / Status / Hierarchy / MPIN
export const getDealerList = async (msisdn: string, username: string): Promise<Array<{ msisdn: string; name: string }>> => {
  if (isMockApiEnabled()) {
    return [
      { msisdn: '9876543211', name: 'Child Dealer 1' },
      { msisdn: '9876543212', name: 'Child Dealer 2' },
    ];
  }
  const response = await dealerApiClient.get<ApiResponse<Array<{ msisdn: string; name: string }>>>(
    `/scm-dealer-api/dealerList?msisdn=${msisdn}&username=${username}`
  );
  return response.data.data || [];
};

export const getDealerByMsisdn = async (msisdn: string): Promise<Dealer> => {
  const response = await dealerApiClient.get<ApiResponse<Dealer>>(
    `/scm-dealer-api/dealer/${msisdn}`
  );
  return response.data.data as Dealer;
};

export const dealerStatusCheck = async (msisdn: string): Promise<any> => {
  const response = await dealerApiClient.get<ApiResponse<any>>(
    `/scm-dealer-api/dealerStatusCheck?msisdn=${msisdn}`
  );
  return response.data.data;
};

export const changeDealerStatus = async (
  msisdn: string,
  username: string,
  status: number
): Promise<any> => {
  const response = await dealerApiClient.post<ApiResponse<any>>(
    `/scm-dealer-api/dealerStatusChange?msisdn=${msisdn}&username=${username}&status=${status}`
  );
  return response.data.data;
};

export const purgeDealer = async (msisdn: string, username: string): Promise<any> => {
  const response = await dealerApiClient.post<ApiResponse<any>>(
    `/scm-dealer-api/purgeDealer?msisdn=${msisdn}&username=${username}`
  );
  return response.data.data;
};

export const getDealerWithMobile = async (msisdn: string, guiUsername: string): Promise<Dealer> => {
  if (isMockApiEnabled()) {
    return {
      dealerId: '1',
      dealerCode: 'DLR001',
      scmMsisdn: msisdn,
      firstName: 'Demo',
      lastName: 'Dealer',
      mobile: msisdn,
      dob: '1990-01-01',
      address: 'Demo address',
      pincode: '110001',
      dealerType: '1',
      circleId: 1,
      ssaId: 1,
      category: '1',
    };
  }
  const response = await dealerApiClient.get<ApiResponse<Dealer>>(
    `/scm-dealer-api/dealerWithMobile?msisdn=${msisdn}&guiUsername=${guiUsername}`
  );
  return response.data.data as Dealer;
};

export const changeDealerHierarchy = async (
  srcMsisdn: string,
  parentMsisdn: string,
  guiUsername: string,
  type: string
): Promise<unknown> => {
  if (isMockApiEnabled()) {
    return { srcMsisdn, parentMsisdn, guiUsername, type, status: 'success' };
  }
  const response = await dealerApiClient.post<ApiResponse<unknown>>(
    `/scm-dealer-api/changeDealerHierarchy?srcMsisdn=${srcMsisdn}&parentMsisdn=${parentMsisdn}&guiUsername=${guiUsername}&type=${type}`
  );
  return response.data.data;
};

export const resetDealerMpin = async (msisdn: string, username: string): Promise<any> => {
  const response = await dealerApiClient.put<ApiResponse<any>>(
    `/scm-dealer-api/resetMpin?msisdn=${msisdn}&username=${username}`
  );
  return response.data.data;
};

// Franchise Operations
export const getFranchise = async (msisdn: string): Promise<any> => {
  const response = await dealerApiClient.get<ApiResponse<any>>(
    `/scm-dealer-api/franchise?msisdn=${msisdn}`
  );
  return response.data.data;
};

export const getSubFranchise = async (msisdn: string): Promise<any> => {
  const response = await dealerApiClient.get<ApiResponse<any>>(
    `/scm-dealer-api/subFranchise?msisdn=${msisdn}`
  );
  return response.data.data;
};

// OTP Operations for Dealer Management
export const sendDealerCreationOtp = async (msisdn: string): Promise<any> => {
  const request: SendOtpRequest = {
    msisdn,
    operation: '10069',
    topic: 'Dealercreation',
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

export const sendModifyDealerOtp = async (msisdn: string): Promise<any> => {
  const request: SendOtpRequest = {
    msisdn,
    operation: '10069',
    topic: 'Modifydealer',
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

export const sendDealerStatusOtp = async (msisdn: string): Promise<any> => {
  const request: SendOtpRequest = {
    msisdn,
    operation: '10069',
    topic: 'DealerStatus',
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

export const sendDealerHierarchyChangeOtp = async (msisdn: string): Promise<any> => {
  const request: SendOtpRequest = {
    msisdn,
    operation: '10069',
    topic: 'DealerHierarchyChange',
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

export const sendDealerMpinResetOtp = async (msisdn: string): Promise<any> => {
  const request: SendOtpRequest = {
    msisdn,
    operation: '10069',
    topic: 'DealerMpinreset',
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