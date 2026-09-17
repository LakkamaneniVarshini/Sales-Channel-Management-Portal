import { plansApiClient, dbApiClient } from './client';
import { isMockApiEnabled } from '@/lib/utils/mock-api';
import type {
  ApiResponse,
  Plan,
  CreatePlanRequest,
  Denomination,
  SaveDenominationRequest,
  SendOtpRequest,
  OtpResponse,
} from '../types/api.types';

const MOCK_PLANS: Plan[] = [
  {
    sno: '1',
    operator: 'Demo Operator',
    denomination: '199',
    talkvalue: '199',
    country: 'India',
    start_date: '2025-01-01',
    end_date: '2026-01-01',
    type: 'Prepaid',
    description: 'Demo plan',
    tab_name: 'Popular',
    circle: '1',
    validity: '28 days',
    from_date: '2025-01-01',
    to_date: '2026-01-01',
  },
];

// Plan Operations
export const getPlans = async (): Promise<Plan[]> => {
  if (isMockApiEnabled()) {
    return MOCK_PLANS;
  }
  const response = await plansApiClient.get<ApiResponse<Plan[]>>(
    '/scm-product-api/getplans'
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Failed to fetch plans');
  }
  return response.data.data || [];
};

export const addPlan = async (request: CreatePlanRequest, username: string): Promise<Plan> => {
  if (isMockApiEnabled()) {
    const plan = { sno: Date.now().toString(), ...request, createdBy: username } as Plan;
    MOCK_PLANS.push(plan);
    return plan;
  }
  const response = await plansApiClient.post<ApiResponse<Plan>>(
    `/scm-product-api/addplan?username=${username}`,
    request
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Plan creation failed');
  }
  return response.data.data as Plan;
};

export const updatePlan = async (sno: string, request: any, username: string): Promise<Plan> => {
  if (isMockApiEnabled()) {
    const index = MOCK_PLANS.findIndex((plan) => plan.sno === sno);
    const updated = {
      ...(index >= 0 ? MOCK_PLANS[index] : { sno }),
      ...(request as Plan),
      sno,
    } as Plan;
    if (index >= 0) {
      MOCK_PLANS[index] = updated;
    } else {
      MOCK_PLANS.push(updated);
    }
    return updated;
  }
  const response = await plansApiClient.put<ApiResponse<Plan>>(
    `/scm-product-api/updateplan/${sno}?username=${username}`,
    request
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Plan update failed');
  }
  return response.data.data as Plan;
};

export const deletePlan = async (sno: string, username: string): Promise<any> => {
  const response = await plansApiClient.delete<ApiResponse<any>>(
    `/scm-product-api/deleteplan/${sno}?username=${username}`
  );
  if (response.data.status === 'error') {
    throw new Error(response.data.message || 'Plan deletion failed');
  }
  return response.data.data;
};

// Denomination Operations
export const fetchRechargePlan = async (params: {
  price: string;
  circleId: string;
  planType: string;
}): Promise<Denomination[]> => {
  const response = await plansApiClient.get<ApiResponse<Denomination[]>>(
    `/scm-product-api/rechargePlan?price=${params.price}&circleId=${params.circleId}&planType=${params.planType}`
  );
  return response.data.data || [];
};

export const saveDenomination = async (request: SaveDenominationRequest): Promise<Denomination> => {
  const response = await plansApiClient.post<ApiResponse<Denomination>>(
    '/scm-product-api/saveDenomination',
    request
  );
  return response.data.data as Denomination;
};

export const saveMultipleDenominations = async (
  request: SaveDenominationRequest,
  zoneId: string
): Promise<Denomination> => {
  const response = await plansApiClient.post<ApiResponse<Denomination>>(
    `/scm-product-api/saveMultipleDenominations?zoneId=${zoneId}`,
    request
  );
  return response.data.data as Denomination;
};

// OTP Operations for Plan Management
export const sendAddNewPlanOtp = async (msisdn: string): Promise<any> => {
  const request: SendOtpRequest = {
    msisdn,
    operation: '10069',
    topic: 'Addnewplan',
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

export const sendDenominationConfigurationOtp = async (msisdn: string): Promise<any> => {
  const request: SendOtpRequest = {
    msisdn,
    operation: '10069',
    topic: 'Denominationconfiguration',
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

export const sendAddPlanOtp = async (msisdn: string): Promise<OtpResponse> => {
  const { sendOtp } = await import('./masterdata.api');
  return sendOtp({ msisdn, operation: '10069', topic: 'Addplan' });
};

export const sendAddMnpOtp = async (msisdn: string): Promise<any> => {
  const request: SendOtpRequest = {
    msisdn,
    operation: '10069',
    topic: 'ADD MNP',
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

export const sendAddNumberSeriesOtp = async (msisdn: string): Promise<any> => {
  const request: SendOtpRequest = {
    msisdn,
    operation: '10069',
    topic: 'AddnumberSeries',
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

export const sendModifyMnpOtp = async (msisdn: string): Promise<any> => {
  const request: SendOtpRequest = {
    msisdn,
    operation: '10069',
    topic: 'ModifyMnp',
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

export const sendModifyNumberSeriesOtp = async (msisdn: string): Promise<any> => {
  const request: SendOtpRequest = {
    msisdn,
    operation: '10069',
    topic: 'ModfifynumberSeries',
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

export const sendDeleteNumberSeriesOtp = async (msisdn: string): Promise<any> => {
  const request: SendOtpRequest = {
    msisdn,
    operation: '10069',
    topic: 'DeleteNumberseries',
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

export const sendDeleteMnpOtp = async (msisdn: string): Promise<any> => {
  const request: SendOtpRequest = {
    msisdn,
    operation: '10069',
    topic: 'DeleteMnp',
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