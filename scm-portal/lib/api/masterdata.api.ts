import { dbApiClient } from './client';
import {
  isMockApiEnabled,
  MOCK_CIRCLES,
  MOCK_SSAS,
  MOCK_ZONES,
} from '@/lib/utils/mock-api';
import type {
  ApiResponse,
  Zone,
  Circle,
  SSA,
  Category,
  DealerType,
  SendOtpRequest,
  ValidateOtpRequest,
  OtpResponse,
} from '../types/api.types';

// OTP Operations
export const sendOtp = async (request: SendOtpRequest): Promise<OtpResponse> => {
  if (isMockApiEnabled()) {
    return { status: 'success', message: 'OTP sent successfully' };
  }
  const response = await dbApiClient.post<ApiResponse<OtpResponse>>(
    '/masterdata-db-api/sendOtp',
    request
  );
  return response.data.data || response.data;
};

export const validateOtp = async (request: ValidateOtpRequest): Promise<OtpResponse> => {
  if (isMockApiEnabled()) {
    if (request.otp.length === 6) {
      return { status: 'success', message: 'OTP validated successfully' };
    }
    throw new Error('Invalid OTP');
  }
  const response = await dbApiClient.post<ApiResponse<OtpResponse>>(
    `/masterdata-db-api/validateOtp?otp=${request.otp}&operation=${request.operation}&msisdn=${request.msisdn}`
  );
  return response.data.data || response.data;
};

// Master Data Operations
export const getZones = async (): Promise<Zone[]> => {
  if (isMockApiEnabled()) return MOCK_ZONES;
  const response = await dbApiClient.get<ApiResponse<Zone[]>>('/masterdata-db-api/zones');
  return response.data.data || [];
};

export const getCircles = async (): Promise<Circle[]> => {
  if (isMockApiEnabled()) return MOCK_CIRCLES;
  const response = await dbApiClient.get<ApiResponse<Circle[]>>('/masterdata-db-api/circles');
  return response.data.data || [];
};

export const getZoneBasedCircles = async (zoneId: string): Promise<Circle[]> => {
  if (isMockApiEnabled()) {
    return MOCK_CIRCLES.filter((circle) => circle.zoneId.toString() === zoneId);
  }
  const response = await dbApiClient.get<ApiResponse<Circle[]>>(
    `/masterdata-db-api/zonebasedcircles?zoneId=${zoneId}`
  );
  return response.data.data || [];
};

export const getSSAs = async (circleId: string): Promise<SSA[]> => {
  if (isMockApiEnabled()) {
    return MOCK_SSAS.filter((ssa) => ssa.circleId.toString() === circleId);
  }
  const response = await dbApiClient.get<ApiResponse<SSA[]>>(
    `/masterdata-db-api/ssas?circleId=${circleId}`
  );
  return response.data.data || [];
};

export const getCategory = async (): Promise<Category[]> => {
  const response = await dbApiClient.get<ApiResponse<Category[]>>(
    '/masterdata-db-api/getCategory'
  );
  return response.data.data || [];
};

export const getCategoryByDealer = async (dealerType: string): Promise<Category[]> => {
  const response = await dbApiClient.get<ApiResponse<Category[]>>(
    `/masterdata-db-api/getCategoryByDealer/${dealerType}`
  );
  return response.data.data || [];
};

export const getDealerType = async (): Promise<DealerType[]> => {
  const response = await dbApiClient.get<ApiResponse<DealerType[]>>(
    '/masterdata-db-api/dealerType'
  );
  return response.data.data || [];
};

// MNP Operations
export const findMnpData = async (msisdn: string, username: string): Promise<any> => {
  const response = await dbApiClient.get<ApiResponse<any>>(
    `/masterdata-db-api/findMnpData?msisdn=${msisdn}&username=${username}`
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Failed to fetch MNP data');
  }
  return response.data.data;
};

export const saveMnp = async (request: any): Promise<any> => {
  const response = await dbApiClient.post<ApiResponse<any>>(
    '/masterdata-db-api/savemnp',
    request
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Failed to save MNP');
  }
  return response.data.data;
};

export const modifyMnpData = async (request: any): Promise<any> => {
  const response = await dbApiClient.post<ApiResponse<any>>(
    '/masterdata-db-api/modifyMnpData',
    request
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Failed to modify MNP');
  }
  return response.data.data;
};

export const deleteMnp = async (msisdn: string, username: string): Promise<any> => {
  const response = await dbApiClient.post<ApiResponse<any>>(
    `/masterdata-db-api/deleteMnp?msisdn=${msisdn}&username=${username}`,
    { msisdn, username }
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Failed to delete MNP');
  }
  return response.data.data;
};

// Number Series Operations
export const getNumberSeries = async (username: string, series: string): Promise<any> => {
  const response = await dbApiClient.get<ApiResponse<any>>(
    `/masterdata-db-api/getnumberseries?username=${username}&series=${series}`
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Failed to fetch number series');
  }
  return response.data.data;
};

export const addNumberSeries = async (request: any): Promise<any> => {
  const response = await dbApiClient.post<ApiResponse<any>>(
    `/masterdata-db-api/addnumberseries?username=${request.username}`,
    request
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Failed to add number series');
  }
  return response.data.data;
};

export const saveNumberSeries = async (request: any): Promise<any> => {
  const response = await dbApiClient.post<ApiResponse<any>>(
    '/masterdata-db-api/saveNumberSeries',
    request
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Failed to save number series');
  }
  return response.data.data;
};

export const editNumberSeries = async (request: any): Promise<any> => {
  const response = await dbApiClient.put<ApiResponse<any>>(
    `/masterdata-db-api/editnumberseries?username=${request.username}`,
    request
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Failed to edit number series');
  }
  return response.data.data;
};

export const purgeNumberSeries = async (username: string, series: string): Promise<any> => {
  const response = await dbApiClient.delete<ApiResponse<any>>(
    `/masterdata-db-api/purgenumberseries?username=${username}&series=${series}`
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Failed to purge number series');
  }
  return response.data.data;
};